import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

/**
 * API Route: Transactions CRUD.
 * GET - Fetch transactions for current logged-in user.
 * POST - Create a new ledger transaction.
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const { searchParams } = request.nextUrl;
    const category = searchParams.get("category");
    const type = searchParams.get("type");
    const search = searchParams.get("search");

    const query: any = { businessId: profile.businessId };

    if (category && category !== "all" && category !== "All Categories") {
      // Handle potential casing issues
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    if (type && (type === "income" || type === "expense")) {
      query.type = type;
    }
    if (search) {
      query.description = { $regex: search, $options: "i" };
    }

    const transactions = await Transaction.find(query).sort({ transactionDate: -1 });

    return NextResponse.json({
      success: true,
      transactions
    });
  } catch (error) {
    console.error("GET transactions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const body = await request.json();
    const { type, amount, category, description, transactionDate, source, receiptUrl } = body;

    if (!type || !amount || !category) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: type, amount, category" },
        { status: 400 }
      );
    }

    const newTx = new Transaction({
      businessId: profile.businessId,
      type,
      amount: Number(amount),
      category,
      description,
      source: source || "manual",
      receiptUrl,
      transactionDate: transactionDate ? new Date(transactionDate) : new Date(),
      createdBy: profile.fullName || profile.email
    });

    await newTx.save();

    return NextResponse.json({
      success: true,
      transaction: newTx
    }, { status: 201 });
  } catch (error) {
    console.error("POST transactions API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
