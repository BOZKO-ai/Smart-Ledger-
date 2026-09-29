
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { getOrCreateSubscription } from "@/lib/subscriptions";
import { getAuthorizedProfile, unauthorizedResponse } from "@/lib/authHelpers";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const profile = await getAuthorizedProfile(request);
    if (!profile) {
      return unauthorizedResponse();
    }

    const subscription = await getOrCreateSubscription(profile.businessId);

    return NextResponse.json({
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodStart: subscription.currentPeriodStart,
      currentPeriodEnd: subscription.currentPeriodEnd,
      monthlyScansUsed: subscription.monthlyScansUsed,
      lastScanResetDate: subscription.lastScanResetDate,
      paymentHistory: subscription.paymentHistory,
    });
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
