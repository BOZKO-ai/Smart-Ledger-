
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import AIInsight from "@/models/AIInsight";
import Subscription from "@/models/Subscription";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { TIER_LIMITS } from "@/lib/subscriptions";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    // Check subscription tier - AI Insights are Pro only
    const subscription = await Subscription.findOne({ businessId: profile.businessId });
    const userPlan = subscription?.plan || "free";
    if (!TIER_LIMITS[userPlan as keyof typeof TIER_LIMITS].hasAIInsights) {
      return NextResponse.json(
        {
          success: false,
          message: "AI Insights are only available on the Pro plan",
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    // Get current month's transactions
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const transactions = await Transaction.find({
      businessId: profile.businessId,
      transactionDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ transactionDate: 1 });

    // Prepare data for Gemini
    const transactionData = transactions.map(tx => ({
      type: tx.type,
      amount: tx.amount,
      category: tx.category,
      description: tx.description,
      date: tx.transactionDate.toISOString().split('T')[0]
    }));

    // Check if insight already exists for this month
    const existingInsight = await AIInsight.findOne({
      businessId: profile.businessId,
      month: startDate
    });

    if (existingInsight) {
      return NextResponse.json({
        success: true,
        insight: existingInsight
      });
    }

    // Call Gemini for insights
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("Missing GEMINI_API_KEY environment variable");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const sinhalaPrompt = `You are a friendly, encouraging business advisor for Sri Lankan small businesses. Analyze the following transaction data and provide 2-3 short, actionable business insights in Sinhala. Keep the tone supportive and practical.\n\nTransaction data (LKR):\n${JSON.stringify(transactionData, null, 2)}\n\nPlease provide insights such as:\n- Trends in spending categories\n- Sales patterns\n- Recommendations for improvement\n- Cost-saving suggestions\n\nRespond only with the insights in Sinhala, numbered 1, 2, 3.`;

    const englishPrompt = `You are a friendly, encouraging business advisor for Sri Lankan small businesses. Analyze the following transaction data and provide 2-3 short, actionable business insights in English. Keep the tone supportive and practical.\n\nTransaction data (LKR):\n${JSON.stringify(transactionData, null, 2)}\n\nPlease provide insights such as:\n- Trends in spending categories\n- Sales patterns\n- Recommendations for improvement\n- Cost-saving suggestions\n\nRespond only with the insights in English, numbered 1, 2, 3.`;

    const [sinhalaResult, englishResult] = await Promise.all([
      model.generateContent(sinhalaPrompt),
      model.generateContent(englishPrompt)
    ]);

    const sinhalaResponse = await sinhalaResult.response;
    const englishResponse = await englishResult.response;

    const sinhalaText = sinhalaResponse.text();
    const englishText = englishResponse.text();

    // Save to database
    const newInsight = await AIInsight.create({
      businessId: profile.businessId,
      month: startDate,
      insightTextSi: sinhalaText,
      insightTextEn: englishText
    });

    return NextResponse.json({
      success: true,
      insight: newInsight
    });

  } catch (error) {
    console.error("Generate insights API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to generate insights" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    // Check subscription tier - AI Insights are Pro only
    const subscription = await Subscription.findOne({ businessId: profile.businessId });
    const userPlan = subscription?.plan || "free";
    if (!TIER_LIMITS[userPlan as keyof typeof TIER_LIMITS].hasAIInsights) {
      return NextResponse.json(
        {
          success: false,
          message: "AI Insights are only available on the Pro plan",
          upgradeRequired: true
        },
        { status: 403 }
      );
    }

    const insights = await AIInsight.find({
      businessId: profile.businessId
    }).sort({ month: -1 });

    return NextResponse.json({
      success: true,
      insights
    });

  } catch (error) {
    console.error("Get insights API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch insights" },
      { status: 500 }
    );
  }
}
