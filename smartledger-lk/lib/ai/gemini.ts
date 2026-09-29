import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Transaction, InventoryItem } from "@/types";

/**
 * Gemini AI Helper.
 * Handles:
 * 1. Image OCR: Parsing handwritten receipts, merchant invoices in Sinhala/English.
 * 2. Strategic Insights: Local LKR calculation suggestions based on stock/sales volumes.
 */

interface GeminiParsedReceipt {
  vendor: string;
  totalAmount: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}

function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY environment variable.");
  }
  return new GoogleGenerativeAI(apiKey);
}

export async function parseReceiptWithGemini(
  imageBuffer: Buffer,
  mimeType: string
): Promise<GeminiParsedReceipt> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are a receipt OCR parser for Sri Lankan businesses. Extract data accurately from receipts in English and Sinhala. Always return strict JSON.",
  });

  const base64 = imageBuffer.toString("base64");

  const prompt = `Analyze this receipt image and extract the following fields as strict JSON:
- vendor: name of the shop/merchant (string)
- totalAmount: total amount on receipt (number, exclude currency symbols)
- items: array of { name: string, quantity: number, price: number } for each line item

If any field is unreadable, make your best guess. Use reasonable defaults for missing items.
Return ONLY the JSON object, no markdown fences, no extra text.`;

  const imagePart = { inlineData: { data: base64, mimeType } };
  const result = await model.generateContent([prompt, imagePart]);
  const response = await result.response;
  const text = response.text();

  // Clean up any markdown fences if the model wraps them
  const cleaned = text.replace(/```\w*\n?/g, "").trim();
  const parsed = JSON.parse(cleaned);

  return {
    vendor: parsed.vendor || "Unknown Vendor",
    totalAmount: parseFloat(parsed.totalAmount) || 0,
    items: Array.isArray(parsed.items)
      ? parsed.items.map((item: any) => ({
          name: String(item.name || ""),
          quantity: parseFloat(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
        }))
      : []
  };
}

export async function generateBusinessInsights(
  transactions: Transaction[],
  inventory: InventoryItem[]
): Promise<string[]> {
  const genAI = getGenAI();
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: "You are a friendly, encouraging business advisor for Sri Lankan micro-SMEs. Provide practical, actionable insights in clear bullet points.",
  });

  // Summarize data for the prompt
  const recentTransactions = transactions.slice(0, 50);
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryBreakdown: Record<string, number> = {};

  recentTransactions.forEach(tx => {
    if (tx.type === "income") {
      totalIncome += tx.amount;
    } else {
      totalExpenses += tx.amount;
      categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
    }
  });

  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);

  const prompt = `Analyze this business data and provide 3 short, actionable insights.

FINANCIAL SUMMARY (LKR):
- Total Income: ${totalIncome}
- Total Expenses: ${totalExpenses}
- Net Profit: ${totalIncome - totalExpenses}

EXPENSE BY CATEGORY:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: LKR ${amt}`).join("\n") || "No expenses recorded"}

LOW STOCK ALERTS:
${lowStockItems.map(i => `- ${i.name}: ${i.quantity} remaining`).join("\n") || "No low stock items"}

INVENTORY ITEMS: ${inventory.length} total

Provide 3 insights covering spending trends, sales patterns, or cost-saving opportunities. Keep each insight to 1-2 sentences. Number them 1, 2, 3.`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  // Split into individual insights
  const insights = text
    .split(/\n+/)
    .map(line => line.replace(/^\d+\.\s*/, "").trim())
    .filter(line => line.length > 10);

  return insights.length > 0 ? insights : [text.trim()];
}
