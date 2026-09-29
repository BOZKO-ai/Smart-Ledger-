
import mongoose, { Schema, Document } from "mongoose";

export interface ITransaction extends Document {
  businessId: mongoose.Types.ObjectId;
  type: "income" | "expense";
  amount: number;
  category: string;
  description?: string;
  source: "manual" | "receipt_scan";
  receiptUrl?: string;
  transactionDate: Date;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    businessId: { type: Schema.Types.ObjectId, ref: "Business", required: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    source: { type: String, enum: ["manual", "receipt_scan"], default: "manual" },
    receiptUrl: { type: String },
    transactionDate: { type: Date, required: true },
    createdBy: { type: String },
  },
  {
    timestamps: true,
  }
);

TransactionSchema.index({ businessId: 1 });
TransactionSchema.index({ transactionDate: 1 });
TransactionSchema.index({ category: 1 });
TransactionSchema.index({ businessId: 1, transactionDate: -1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

