import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import InventoryItem from "@/models/InventoryItem";
import Business from "@/models/Business";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const { messages } = await request.json();
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 });
    }

    const userMessage = messages[messages.length - 1]?.content || "";
    if (!userMessage.trim()) {
      return NextResponse.json({ error: "User message cannot be empty" }, { status: 400 });
    }

    // Fetch context data
    const business = await Business.findById(profile.businessId);
    const transactions = await Transaction.find({ businessId: profile.businessId }).sort({ transactionDate: -1 }).limit(100);
    const inventory = await InventoryItem.find({ businessId: profile.businessId });

    // Format metrics
    let totalIncome = 0;
    let totalExpenses = 0;
    const categoryBreakdown: Record<string, number> = {};

    transactions.forEach(tx => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
      } else {
        totalExpenses += tx.amount;
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + tx.amount;
      }
    });

    const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
    const expiringItems = inventory.filter(item => {
      if (!item.expiryDate) return false;
      const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 3600 * 24));
      return daysLeft > 0 && daysLeft <= 7;
    });

    const contextString = `
Business Name: ${business?.name || "Your Business"}
Business Type: ${business?.businessType || "Retail"}
Language Preference: ${business?.languagePref || "English"}

LATEST TRANSACTIONS METRICS (from last 100 entries):
- Total Income: LKR ${totalIncome}
- Total Expenses: LKR ${totalExpenses}
- Net Profit: LKR ${totalIncome - totalExpenses}

EXPENSE BREAKDOWN BY CATEGORY:
${Object.entries(categoryBreakdown).map(([cat, amt]) => `- ${cat}: LKR ${amt}`).join("\n")}

INVENTORY STATUS:
- Total Inventory Items: ${inventory.length}
- Low Stock Items: ${lowStockItems.length} (${lowStockItems.map(i => `${i.name}: ${i.quantity} left`).join(", ") || "None"})
- Expiring Soon Items (next 7 days): ${expiringItems.length} (${expiringItems.map(i => `${i.name}: exp ${new Date(i.expiryDate!).toLocaleDateString()}`).join(", ") || "None"})
`;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured on the server. Please set it in .env.local" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: `You are "SmartLedger AI Assistant", an expert, friendly Sri Lankan business consultant.
Your goal is to help local small businesses (e.g. bakeries, grocery stores, custom cake shops) manage their books, transactions, and inventory.
You have access to the business's real-time financial ledger and inventory stats provided below.
Always reply in the user's preferred language (Sinhala or English) or match the language of their message. Keep responses encouraging, highly readable (using formatting/bullet points), and actionable. Make calculations if they ask (e.g. profit margins, expense cuts).

BUSINESS CONTEXT:
${contextString}`,
    });

    // Build conversation history for Gemini
    // Gemini requires: history starts with 'user' and roles strictly alternate user/model/user/model...
    const allTurns = messages
      .filter((m: any) => m.content && m.content.trim())
      .slice(0, -1) // exclude the current user message (sent via sendMessage)
      .map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }]
      }));

    // Ensure history starts with a 'user' message (skip leading 'model' messages)
    let conversationHistory = allTurns;
    while (conversationHistory.length > 0 && conversationHistory[0].role !== "user") {
      conversationHistory = conversationHistory.slice(1);
    }

    // Ensure roles alternate strictly — collapse consecutive same-role messages
    const cleanedHistory: typeof conversationHistory = [];
    for (const turn of conversationHistory) {
      if (cleanedHistory.length > 0 && cleanedHistory[cleanedHistory.length - 1].role === turn.role) {
        // Merge consecutive same-role messages
        cleanedHistory[cleanedHistory.length - 1].parts[0].text += "\n" + turn.parts[0].text;
      } else {
        cleanedHistory.push(turn);
      }
    }

    const chat = model.startChat({
      history: cleanedHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const botResponseText = response.text();

    return NextResponse.json({
      success: true,
      message: botResponseText
    });

  } catch (error: any) {
    console.error("Chat API error:", error);

    // Provide more specific error messages for common failures
    const message = error?.message || "";
    if (message.includes("API_KEY_INVALID") || message.includes("403") || message.includes("401")) {
      return NextResponse.json(
        { error: "The Gemini API key is invalid. Please check your GEMINI_API_KEY in .env.local" },
        { status: 500 }
      );
    }
    if (message.includes("QUOTA_EXCEEDED") || message.includes("429")) {
      return NextResponse.json(
        { error: "Gemini API quota exceeded. Please try again later or upgrade your API plan" },
        { status: 429 }
      );
    }
    if (message.includes("SAFETY") || message.includes("blocked")) {
      return NextResponse.json(
        { error: "The response was blocked by safety filters. Please try rephrasing your question" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Failed to process chat message: ${message || "Unknown error"}` },
      { status: 500 }
    );
  }
}
