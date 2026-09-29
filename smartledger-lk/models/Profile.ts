
import mongoose, { Schema, Document } from "mongoose";

export interface IProfile extends Document {
  businessId: mongoose.Types.ObjectId;
  authUserId: string;
  fullName: string;
  role: "owner" | "staff";
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    authUserId: { type: String, required: true },
    fullName: { type: String, required: true },
    role: { type: String, enum: ["owner", "staff"], default: "owner" },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

ProfileSchema.index({ businessId: 1 });
ProfileSchema.index({ authUserId: 1 });

export default mongoose.models.Profile || mongoose.model<IProfile>("Profile", ProfileSchema);

