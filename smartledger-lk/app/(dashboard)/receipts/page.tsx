
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { ReceiptUploader } from "@/components/receipts/ReceiptUploader";
import { ReviewModal } from "@/components/receipts/ReviewModal";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle } from "lucide-react";

export default function ReceiptsPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);

  const handleScanComplete = (data: any) => {
    setScanResult(data);
    setIsReviewOpen(true);
  };

  const handleConfirm = async (data: any) => {
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "expense",
          amount: data.amount,
          category: data.category,
          description: data.vendor ? `${data.vendor} - ${data.description || "Receipt Scan"}` : (data.description || "Receipt Scan"),
          transactionDate: data.date,
          source: "receipt_scan",
          receiptUrl: scanResult?.imageUrl || undefined
        }),
      });

      if (res.ok) {
        setIsSaved(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to save transaction.");
      }
    } catch (e) {
      console.error("Save scanned receipt error:", e);
      alert("Failed to save transaction. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-neutral-900 dark:text-neutral-100">
          {t("common.receipts")}
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Upload or take a photo of your receipt to add it to your ledger.
        </p>
      </div>

      {isSaved ? (
        <Card className="p-12 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success-500" />
          <h3 className="text-xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Transaction Saved!
          </h3>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">
            Redirecting to dashboard...
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      ) : (
        <>
          <ReceiptUploader onScanComplete={handleScanComplete} />

          <ReviewModal
            isOpen={isReviewOpen}
            onClose={() => setIsReviewOpen(false)}
            data={scanResult?.extractedData}
            imageUrl={scanResult?.imageUrl}
            onConfirm={handleConfirm}
          />
        </>
      )}
    </div>
  );
}
