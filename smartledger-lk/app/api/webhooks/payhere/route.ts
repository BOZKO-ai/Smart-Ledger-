import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import crypto from "crypto";
import mongoose from "mongoose";
import Business from "@/models/Business";
import Subscription, { PlanTier } from "@/models/Subscription";
import { TIER_PRICES } from "@/lib/subscriptions";

/**
 * API Route: PayHere Webhook Handler.
 * POST - Listen to payment confirmation notifications from PayHere (Sri Lanka payment gateway).
 * Validates the MD5 signature and updates user subscription or order statuses.
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const formData = await request.formData();
    
    const merchantId = formData.get("merchant_id") as string;
    const orderId = formData.get("order_id") as string;
    const payhereAmount = formData.get("payhere_amount") as string;
    const payhereCurrency = formData.get("payhere_currency") as string;
    const statusCode = formData.get("status_code") as string;
    const md5sig = formData.get("md5sig") as string;
    const paymentId = formData.get("payment_id") as string;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
    
    // Generate validation signature
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
      
    const combinedString = merchantId + orderId + payhereAmount + payhereCurrency + statusCode + hashedSecret;
    const calculatedSignature = crypto
      .createHash("md5")
      .update(combinedString)
      .digest("hex")
      .toUpperCase();

    if (calculatedSignature !== md5sig) {
      return NextResponse.json({ success: false, error: "Signature mismatch" }, { status: 400 });
    }

    if (statusCode === "2") {
      console.log(`Payment confirmed for Order ID: ${orderId}`);
      
      // Parse orderId to get businessId and plan (orderId format: {businessId}-{timestamp})
      const [businessIdStr] = orderId.split("-");
      const businessId = new mongoose.Types.ObjectId(businessIdStr);
      
      // Determine the plan based on the amount paid
      let plan: PlanTier = "starter";
      const amount = parseFloat(payhereAmount);
      if (amount >= TIER_PRICES.pro) {
        plan = "pro";
      }
      
      // Get or create subscription
      let subscription = await Subscription.findOne({ businessId });
      
      const now = new Date();
      const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      
      if (subscription) {
        subscription.plan = plan;
        subscription.status = "active";
        subscription.currentPeriodStart = currentPeriodStart;
        subscription.currentPeriodEnd = currentPeriodEnd;
        subscription.paymentHistory.push({
          paymentId,
          amount: parseFloat(payhereAmount),
          currency: payhereCurrency,
          date: now,
          status: "completed",
        });
        await subscription.save();
      } else {
        subscription = await Subscription.create({
          businessId,
          plan,
          status: "active",
          currentPeriodStart,
          currentPeriodEnd,
          lastScanResetDate: currentPeriodStart,
          monthlyScansUsed: 0,
          paymentHistory: [
            {
              paymentId,
              amount: parseFloat(payhereAmount),
              currency: payhereCurrency,
              date: now,
              status: "completed",
            }
          ],
        });
      }
      
      // Update business planTier
      await Business.findByIdAndUpdate(businessId, { planTier: plan });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PayHere webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
