
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const searchParams = request.nextUrl.searchParams;
    const timeRange = searchParams.get("range") || "monthly";

    let startDate: Date;
    const endDate = new Date();

    switch (timeRange) {
      case "daily":
        startDate = new Date(endDate);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "weekly":
        startDate = new Date(endDate);
        startDate.setDate(endDate.getDate() - 7);
        break;
      case "monthly":
      default:
        startDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1);
        break;
    }

    const transactions = await Transaction.find({
      businessId: profile.businessId,
      transactionDate: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ transactionDate: 1 });

    // Calculate total income and expenses
    let totalIncome = 0;
    let totalExpenses = 0;

    // Group by date for chart
    const chartData: Record<string, { income: number; expenses: number }> = {};
    // Group by category for expense breakdown
    const categoryData: Record<string, number> = {};

    transactions.forEach(tx => {
      const dateKey = tx.transactionDate.toISOString().split('T')[0];
      
      if (!chartData[dateKey]) {
        chartData[dateKey] = { income: 0, expenses: 0 };
      }

      if (tx.type === "income") {
        totalIncome += tx.amount;
        chartData[dateKey].income += tx.amount;
      } else {
        totalExpenses += tx.amount;
        chartData[dateKey].expenses += tx.amount;
        categoryData[tx.category] = (categoryData[tx.category] || 0) + tx.amount;
      }
    });

    // Convert chart data to array
    const formattedChartData = Object.entries(chartData).map(([date, values]) => ({
      date,
      ...values
    }));

    // Convert category data to array
    const formattedCategoryData = Object.entries(categoryData).map(([category, amount]) => ({
      category,
      amount
    }));

    return NextResponse.json({
      transactions,
      totalIncome,
      totalExpenses,
      netProfit: totalIncome - totalExpenses,
      chartData: formattedChartData,
      categoryData: formattedCategoryData
    });

  } catch (error) {
    console.error("Reports API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
