
import mongoose, { Schema, Document } from "mongoose";

export interface IInventoryItem extends Document {
  businessId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  lowStockThreshold: number;
  expiryDate?: Date;
  unitCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventoryItemSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 0 },
    expiryDate: { type: Date },
    unitCost: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

InventoryItemSchema.index({ businessId: 1 });

export default mongoose.models.InventoryItem || mongoose.model<IInventoryItem>("InventoryItem", InventoryItemSchema);

