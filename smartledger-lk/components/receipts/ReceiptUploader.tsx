
"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, X, Image as ImageIcon, Loader2, Scan, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ReceiptUploaderProps {
  onScanComplete: (data: { imageUrl?: string; extractedData: any }) => void;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({ onScanComplete }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [upgradeRequired, setUpgradeRequired] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setError(null);
    setUpgradeRequired(false);
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.).");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    await processFile(file);
  };

  const processFile = async (file: File) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append("receipt", file);

      const res = await fetch("/api/receipts/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.upgradeRequired) {
          setUpgradeRequired(true);
          setError(t("subscription.upgradePrompt"));
          return;
        }
        throw new Error(data.message || "Failed to scan receipt");
      }

      const data = await res.json();
      onScanComplete(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Card className={`p-4 ${
          upgradeRequired
            ? "bg-brand-50 dark:bg-brand-500/10 border-brand-200 dark:border-brand-500/30"
            : "bg-danger-50 dark:bg-danger-500/10 border-danger-200 dark:border-danger-500/30"
        }`}>
          <div className="flex items-center gap-3">
            {upgradeRequired ? (
              <ArrowRight className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            ) : (
              <X className="w-5 h-5 text-danger-600 dark:text-danger-400" />
            )}
            <div>
              <p className={`font-medium ${
                upgradeRequired
                  ? "text-brand-800 dark:text-brand-200"
                  : "text-danger-800 dark:text-danger-200"
              }`}>
                {error}
              </p>
            </div>
            {upgradeRequired ? (
              <Button
                className="ml-auto"
                onClick={() => router.push("/pricing")}
              >
                {t("subscription.upgradeCta")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="ml-auto"
                onClick={() => {
                  setError(null);
                  setPreviewUrl(null);
                  setUpgradeRequired(false);
                }}
              >
                Try Again
              </Button>
            )}
          </div>
        </Card>
      )}

      <div
        className={`relative group border-2 border-dashed rounded-2xl p-8 transition-all ${
          isDragging
            ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10"
            : "border-neutral-200 dark:border-neutral-700 hover:border-brand-300"
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files && handleFile(e.target.files[0])}
        />

        {isScanning ? (
          <div className="flex flex-col items-center gap-6 py-12">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-brand-200 dark:border-brand-800" />
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-brand-500 border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <Scan className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 text-brand-500" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Scanning Receipt...
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                AI is extracting the details
              </p>
            </div>
          </div>
        ) : previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={previewUrl}
              alt="Receipt preview"
              className="max-h-80 w-auto rounded-lg shadow-lg"
            />
            <Button
              variant="ghost"
              onClick={() => {
                setPreviewUrl(null);
                setError(null);
              }}
            >
              Upload Another
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-500/10 flex items-center justify-center">
              <Upload className="w-8 h-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                Upload or Take a Photo
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Drag & drop your receipt here
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => fileInputRef.current?.click()}>
                <ImageIcon className="w-5 h-5 mr-2" />
                Choose File
              </Button>
              <Button
                variant="outline"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="w-5 h-5 mr-2" />
                Take Photo
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
