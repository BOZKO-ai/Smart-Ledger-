
import mongoose, { Schema, Document } from "mongoose";

export type PlanTier = "free" | "starter" | "pro";

export interface ISubscription extends Document {
  businessId: mongoose.Types.ObjectId;
  plan: PlanTier;
  status: "active" | "canceled" | "past_due" | "trialing";
  payhereSubscriptionId?: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  monthlyScansUsed: number;
  lastScanResetDate: Date;
  paymentHistory: Array<{
    paymentId: string;
    amount: number;
    currency: string;
    date: Date;
    status: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    plan: { type: String, enum: ["free", "starter", "pro"], default: "free", required: true },
    status: { type: String, enum: ["active", "canceled", "past_due", "trialing"], default: "active", required: true },
    payhereSubscriptionId: { type: String },
    currentPeriodStart: { type: Date, required: true },
    currentPeriodEnd: { type: Date, required: true },
    monthlyScansUsed: { type: Number, default: 0 },
    lastScanResetDate: { type: Date, required: true },
    paymentHistory: [
      {
        paymentId: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        date: { type: Date, required: true },
        status: { type: String, required: true },
      }
    ],
  },
  {
    timestamps: true,
  }
);

SubscriptionSchema.index({ businessId: 1 });

export default mongoose.models.Subscription || mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

