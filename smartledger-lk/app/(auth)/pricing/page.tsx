
"use client";

import React, { useState, useEffect } from "react";
import { Check, X, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TIER_PRICES, TIER_LIMITS } from "@/lib/subscription-constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

interface TierFeature {
  text: string;
  included: { free: boolean; starter: boolean; pro: boolean };
}

const features: TierFeature[] = [
  {
    text: "pricing.featureScans",
    included: { free: true, starter: true, pro: true }
  },
  {
    text: "pricing.featureUnlimitedScans",
    included: { free: false, starter: true, pro: true }
  },
  {
    text: "pricing.featureManualEntries",
    included: { free: true, starter: true, pro: true }
  },
  {
    text: "pricing.featureCoreFeatures",
    included: { free: true, starter: true, pro: true }
  },
  {
    text: "pricing.featureRealTimeAlerts",
    included: { free: false, starter: true, pro: true }
  },
  {
    text: "pricing.featureAIInsights",
    included: { free: false, starter: false, pro: true }
  },
  {
    text: "pricing.featureMultiUser",
    included: { free: false, starter: false, pro: true }
  },
  {
    text: "pricing.featureDataExport",
    included: { free: false, starter: false, pro: true }
  },
  {
    text: "pricing.featurePrioritySupport",
    included: { free: false, starter: false, pro: true }
  }
];

export default function PricingPage() {
  const { t } = useTranslation();
  const [currentPlan, setCurrentPlan] = useState<"free" | "starter" | "pro">("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const res = await fetch("/api/subscription");
        if (res.ok) {
          const data = await res.json();
          setCurrentPlan(data.plan);
        }
      } catch (error) {
        console.error("Error fetching subscription:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentPlan();
  }, []);

  const handleSubscribe = async (plan: "starter" | "pro") => {
    try {
      const res = await fetch("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
    }
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-display font-bold text-neutral-900 dark:text-neutral-100 mb-4"
          >
            {t("pricing.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-600 dark:text-neutral-400"
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-8 md:grid-cols-3 items-start"
        >
          {/* Free Tier */}
          <motion.div variants={itemVariants}>
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {t("pricing.free")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(TIER_PRICES.free)}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">{t("pricing.perMonth")}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included.free ? (
                      <Check className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    )}
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      {feature.text === "pricing.featureScans"
                        ? `${TIER_LIMITS.free.monthlyScans} ${t("pricing.featureScans")}`
                        : t(feature.text)}
                    </span>
                  </li>
                ))}
              </ul>

              {currentPlan === "free" ? (
                <Button disabled className="w-full">
                  {t("pricing.currentPlan")}
                </Button>
              ) : (
                <Button variant="secondary" className="w-full">
                  {t("pricing.subscribe")}
                </Button>
              )}
            </Card>
          </motion.div>

          {/* Starter Tier (Most Popular) */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-brand-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md flex items-center gap-1">
                <Star className="w-4 h-4" />
                {t("pricing.mostPopular")}
              </span>
            </div>
            <Card className="h-full p-6 border-2 border-brand-500 dark:border-brand-400 shadow-lg hover:shadow-xl transition-shadow">
              <div className="mb-6 pt-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {t("pricing.starter")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(TIER_PRICES.starter)}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">{t("pricing.perMonth")}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included.starter ? (
                      <Check className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    )}
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      {t(feature.text)}
                    </span>
                  </li>
                ))}
              </ul>

              {currentPlan === "starter" ? (
                <Button disabled className="w-full">
                  {t("pricing.currentPlan")}
                </Button>
              ) : (
                <Button onClick={() => handleSubscribe("starter")} className="w-full">
                  {t("pricing.subscribe")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </Card>
          </motion.div>

          {/* Pro Tier */}
          <motion.div variants={itemVariants}>
            <Card className="h-full p-6 hover:shadow-lg transition-shadow">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {t("pricing.pro")}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                    {formatPrice(TIER_PRICES.pro)}
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400">{t("pricing.perMonth")}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    {feature.included.pro ? (
                      <Check className="w-5 h-5 text-success-600 dark:text-success-400 flex-shrink-0" />
                    ) : (
                      <X className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0" />
                    )}
                    <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                      {t(feature.text)}
                    </span>
                  </li>
                ))}
              </ul>

              {currentPlan === "pro" ? (
                <Button disabled className="w-full">
                  {t("pricing.currentPlan")}
                </Button>
              ) : (
                <Button onClick={() => handleSubscribe("pro")} className="w-full">
                  {t("pricing.subscribe")} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
