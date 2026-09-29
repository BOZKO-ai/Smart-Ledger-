
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  Package,
  Scan,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

// Step 1: Confirm business details
const Step1 = ({ onNext, initialData }: { onNext: () => void; initialData: any }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Confirm your details
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Everything looks good? Let&apos;s confirm your business information
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Business name</p>
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {initialData.businessName || "Your Business"}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Business type</p>
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {initialData.businessType || "Other"}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Owner</p>
          <p className="font-medium text-neutral-900 dark:text-neutral-50">
            {initialData.ownerName || "You"}
          </p>
        </div>
      </Card>

      <Button onClick={onNext} className="w-full">
        Looks good <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </motion.div>
  );
};

// Step 2: Add first inventory item
const Step2 = ({
  onNext,
  onSkip,
  onBack,
}: {
  onNext: () => void;
  onSkip: () => void;
  onBack: () => void;
}) => {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unitCost, setUnitCost] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center">
          <Package className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Add your first item
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Start tracking your inventory (optional)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Item name
          </label>
          <Input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            placeholder="e.g., Chocolate Cake"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Quantity
            </label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="10"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Unit cost (LKR)
            </label>
            <Input
              type="number"
              value={unitCost}
              onChange={(e) => setUnitCost(e.target.value)}
              placeholder="250"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Button type="submit" className="w-full">
            Add item <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="ghost" onClick={onSkip} className="w-full">
            Skip this step
          </Button>
        </div>

        <Button variant="ghost" onClick={onBack} className="w-full">
          <ArrowLeft className="mr-2 h-5 w-5" /> Back
        </Button>
      </form>
    </motion.div>
  );
};

// Step 3: Try receipt scanner
const Step3 = ({
  onComplete,
  onSkip,
  onBack,
}: {
  onComplete: () => void;
  onSkip: () => void;
  onBack: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-brand-100 dark:bg-brand-500/20 rounded-full flex items-center justify-center">
          <Scan className="w-8 h-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-neutral-900 dark:text-neutral-50 mb-2">
          Try receipt scanning
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400">
          Let&apos;s see how it works with a sample receipt
        </p>
      </div>

      <Card className="p-8 text-center">
        <div className="w-24 h-32 mx-auto mb-4 bg-neutral-100 dark:bg-neutral-800 rounded-xl flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-700">
          <Scan className="w-10 h-10 text-neutral-400" />
        </div>
        <p className="text-neutral-500 dark:text-neutral-400 mb-4">
          Sample receipt scanner UI here
        </p>
        <Badge variant="default">Coming soon</Badge>
      </Card>

      <div className="space-y-3">
        <Button onClick={onComplete} className="w-full">
          Complete setup <Check className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="ghost" onClick={onSkip} className="w-full">
          Skip for now
        </Button>
      </div>

      <Button variant="ghost" onClick={onBack} className="w-full">
        <ArrowLeft className="mr-2 h-5 w-5" /> Back
      </Button>
    </motion.div>
  );
};

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    // Add any final setup logic here
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  // Mock initial data from signup
  const initialData = {
    businessName: "Your Business",
    businessType: "Home Bakery",
    ownerName: "You",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-950">
      <div className="w-full max-w-lg">
        <Card className="p-8">
          {/* Progress indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s < step
                      ? "bg-brand-600 text-white"
                      : s === step
                      ? "bg-brand-500 text-white"
                      : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-16 h-1 mx-2 rounded-full transition-all ${
                      s < step ? "bg-brand-500" : "bg-neutral-200 dark:bg-neutral-800"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <Step1
                key="step1"
                initialData={initialData}
                onNext={() => setStep(2)}
              />
            )}
            {step === 2 && (
              <Step2
                key="step2"
                onNext={() => setStep(3)}
                onSkip={() => setStep(3)}
                onBack={() => setStep(1)}
              />
            )}
            {step === 3 && (
              <Step3
                key="step3"
                onComplete={handleComplete}
                onSkip={handleComplete}
                onBack={() => setStep(2)}
              />
            )}
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

