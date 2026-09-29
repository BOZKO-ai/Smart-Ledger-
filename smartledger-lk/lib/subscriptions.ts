
import dbConnect from "@/lib/mongodb";
import Business from "@/models/Business";
import Subscription, { PlanTier } from "@/models/Subscription";
import mongoose from "mongoose";

import { TIER_LIMITS, TIER_PRICES } from "@/lib/subscription-constants";

export { TIER_LIMITS, TIER_PRICES };


export async function getOrCreateSubscription(businessId: mongoose.Types.ObjectId | string) {
  await dbConnect();
  const businessObjectId =
    typeof businessId === "string" ? new mongoose.Types.ObjectId(businessId) : businessId;

  let subscription = await Subscription.findOne({ businessId: businessObjectId });

  if (!subscription) {
    const now = new Date();
    const currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const currentPeriodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    subscription = await Subscription.create({
      businessId: businessObjectId,
      plan: "free",
      status: "active",
      currentPeriodStart,
      currentPeriodEnd,
      lastScanResetDate: currentPeriodStart,
      monthlyScansUsed: 0,
      paymentHistory: [],
    });

    // Also update the business planTier field
    await Business.findByIdAndUpdate(businessObjectId, { planTier: "free" });
  } else {
    // Check if we need to reset the scan count
    const now = new Date();
    if (subscription.lastScanResetDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
      subscription.monthlyScansUsed = 0;
      subscription.lastScanResetDate = new Date(now.getFullYear(), now.getMonth(), 1);
      await subscription.save();
    }
  }

  return subscription;
}

export async function checkScanLimit(businessId: mongoose.Types.ObjectId | string) {
  const subscription = await getOrCreateSubscription(businessId);
  const limits = TIER_LIMITS[subscription.plan as keyof typeof TIER_LIMITS];
  const canScan = limits.monthlyScans === Infinity || subscription.monthlyScansUsed < limits.monthlyScans;

  return {
    canScan,
    scansUsed: subscription.monthlyScansUsed,
    limit: limits.monthlyScans,
  };
}

export async function incrementScanCount(businessId: mongoose.Types.ObjectId | string) {
  const subscription = await getOrCreateSubscription(businessId);
  subscription.monthlyScansUsed += 1;
  await subscription.save();
  return subscription;
}
