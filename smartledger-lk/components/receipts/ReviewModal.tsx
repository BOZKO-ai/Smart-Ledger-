
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ExtractedData {
  amount: number;
  date: string;
  vendor: string;
  category: string;
  confidence: "high" | "low";
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: ExtractedData;
  imageUrl?: string;
  onConfirm: (data: any) => void;
}

const CATEGORIES = [
  "Supplies",
  "Rent",
  "Utilities",
  "Marketing",
  "Transport",
  "Salaries",
  "Other",
];

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  data,
  imageUrl,
  onConfirm,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<{
    amount: string;
    date: string;
    vendor: string;
    category: string;
    description: string;
  }>(() => ({
    amount: data?.amount?.toString() || "",
    date: data?.date || new Date().toISOString().split("T")[0],
    vendor: data?.vendor || "",
    category: data?.category || "Other",
    description: "",
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black bg-opacity-50"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg z-10"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100">
              {t("receipts.verify")}
            </h3>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 touch-target"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {data?.confidence === "low" && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200">
                Please double-check these details — the AI had low confidence in some fields.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Amount (LKR)
              </label>
              <Input
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Date
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Vendor/Shop
              </label>
              <Input
                value={formData.vendor}
                onChange={(e) =>
                  setFormData({ ...formData, vendor: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Description (Optional)
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Add notes about this expense..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1">
                <CheckCircle className="w-5 h-5 mr-2" />
                Save Transaction
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};
