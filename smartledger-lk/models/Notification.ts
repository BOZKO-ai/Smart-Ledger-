
import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  businessId: mongoose.Types.ObjectId;
  type: "low_stock" | "expiry" | "expired";
  message: string;
  itemId?: mongoose.Types.ObjectId;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    type: { type: String, enum: ["low_stock", "expiry", "expired"], required: true },
    message: { type: String, required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "InventoryItem" },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ businessId: 1, read: 1 });
NotificationSchema.index({ businessId: 1, createdAt: -1 });

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);

