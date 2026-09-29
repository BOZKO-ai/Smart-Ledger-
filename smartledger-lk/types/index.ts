
// Helper types
export type TransactionType = "income" | "expense";
export type ProfileRole = "owner" | "staff";
export type TransactionSource = "manual" | "receipt_scan";
export type SubscriptionStatus = "active" | "canceled" | "past_due";
export type LanguagePref = "en" | "si";
export type NotificationType = "low_stock" | "expiry" | "expired";

// Core entity interfaces
export interface Transaction {
  _id: string;
  businessId: string;
  type: TransactionType;
  amount: number;
  category: string;
  description?: string;
  source: TransactionSource;
  date: string | Date;
  createdAt?: string | Date;
}

export interface InventoryItem {
  _id: string;
  businessId: string;
  name: string;
  quantity: number;
  unitCost: number;
  lowStockThreshold: number;
  expiryDate?: string | Date;
  category?: string;
  createdAt?: string | Date;
}
