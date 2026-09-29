
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { TIER_PRICES } from "@/lib/subscriptions";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const { plan } = await request.json();
    const amount = TIER_PRICES[plan as keyof typeof TIER_PRICES];
    const orderId = `${profile.businessId.toString()}-${Date.now()}`;
    const merchantId = process.env.PAYHERE_MERCHANT_ID || "";
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || "";
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`;
    const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pricing`;
    const notifyUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhooks/payhere`;

    const amountFormatted = amount.toFixed(2);
    const currency = "LKR";

    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();
    const combinedString = merchantId + orderId + amountFormatted + currency + hashedSecret;
    const md5Hash = crypto
      .createHash("md5")
      .update(combinedString)
      .digest("hex")
      .toUpperCase();

    const payHereParams = new URLSearchParams();
    payHereParams.append("merchant_id", merchantId);
    payHereParams.append("return_url", returnUrl);
    payHereParams.append("cancel_url", cancelUrl);
    payHereParams.append("notify_url", notifyUrl);
    payHereParams.append("order_id", orderId);
    payHereParams.append("items", `SmartLedger LK - ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`);
    payHereParams.append("currency", currency);
    payHereParams.append("amount", amountFormatted);
    payHereParams.append("first_name", profile.email?.split("@")[0] || "Customer");
    payHereParams.append("last_name", "");
    payHereParams.append("email", profile.email || "");
    payHereParams.append("hash", md5Hash);

    const redirectUrl = `https://sandbox.payhere.lk/pay/checkout?${payHereParams.toString()}`;

    return NextResponse.json({ redirectUrl });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
