
import mongoose, { Schema, Document } from "mongoose";

export interface IAIInsight extends Document {
  businessId: mongoose.Types.ObjectId;
  month: Date;
  insightTextSi?: string;
  insightTextEn?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AIInsightSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    month: { type: Date, required: true },
    insightTextSi: { type: String },
    insightTextEn: { type: String },
  },
  {
    timestamps: true,
  }
);

AIInsightSchema.index({ businessId: 1 });
AIInsightSchema.index({ businessId: 1, month: 1 }, { unique: true });

export default mongoose.models.AIInsight || mongoose.model<IAIInsight>("AIInsight", AIInsightSchema);

