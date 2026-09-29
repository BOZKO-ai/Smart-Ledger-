
import mongoose, { Schema, Document } from "mongoose";

export interface IBusiness extends Document {
  ownerId: string;
  name: string;
  businessType: string;
  languagePref: "en" | "si";
  planTier: string;
  createdAt: Date;
  updatedAt: Date;
}

const BusinessSchema: Schema = new Schema(
  {
    ownerId: { type: String, required: true },
    name: { type: String, required: true },
    businessType: { type: String, required: true },
    languagePref: { type: String, enum: ["en", "si"], default: "en" },
    planTier: { type: String, default: "free" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Business || mongoose.model<IBusiness>("Business", BusinessSchema);

