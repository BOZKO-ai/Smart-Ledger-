import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Transaction from "@/models/Transaction";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    const { type, amount, category, description, transactionDate } = await req.json();

    const tx = await Transaction.findOne({ _id: params.id, businessId: profile.businessId });
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    if (type) tx.type = type;
    if (amount !== undefined) tx.amount = Number(amount);
    if (category) tx.category = category;
    if (description !== undefined) tx.description = description;
    if (transactionDate) tx.transactionDate = new Date(transactionDate);

    await tx.save();

    return NextResponse.json({ success: true, transaction: tx });
  } catch (error) {
    console.error("PUT transaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(req);
    if (!profile) {
      return unauthorizedResponse();
    }

    // Role check: Only owner is allowed to delete transactions
    if (profile.role !== "owner") {
      return NextResponse.json({ error: "Permission denied. Only owners can delete transactions." }, { status: 403 });
    }

    const tx = await Transaction.findOneAndDelete({ _id: params.id, businessId: profile.businessId });
    if (!tx) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("DELETE transaction error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
