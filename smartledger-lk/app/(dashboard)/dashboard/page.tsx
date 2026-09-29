"use client";

import React, { useState, useEffect } from "react";
import {
  Scan,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Lightbulb,
  ArrowRight,
  Wallet,
  Receipt,
  PiggyBank,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/lib/i18n/useTranslation";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Skeleton } from "@/components/ui/Skeleton";

/* ─── Helpers ───────────────────────────────────────── */
const formatLKR = (amount: number): string =>
  new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateString));

/* ─── Sample data ───────────────────────────────────── */
const sampleTransactions = [
  {
    id: "1",
    type: "income" as const,
    description: "Cake order — Birthday",
    category: "Sales",
    amount: 5000,
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: "2",
    type: "expense" as const,
    description: "Flour & sugar purchase",
    category: "Supplies",
    amount: 1200,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "3",
    type: "income" as const,
    description: "Custom cupcakes",
    category: "Sales",
    amount: 3500,
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: "4",
    type: "expense" as const,
    description: "Delivery fuel",
    category: "Transport",
    amount: 600,
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

/* ─── Skeleton components ───────────────────────────── */
const MetricSkeleton = () => (
  <Card className="p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-2xl" />
        <Skeleton className="w-24 h-5" />
      </div>
      <Skeleton className="w-14 h-6 rounded-full" />
    </div>
    <Skeleton className="w-36 h-9" />
    <Skeleton className="w-20 h-4 mt-2" />
  </Card>
);

const TxSkeleton = () => (
  <div className="flex items-center justify-between py-4">
    <div className="flex items-center gap-4">
      <Skeleton className="w-11 h-11 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="w-36 h-5" />
        <Skeleton className="w-24 h-4" />
      </div>
    </div>
    <Skeleton className="w-24 h-6 rounded-full" />
  </div>
);

/* ─── Greeting ──────────────────────────────────────── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

/* ─── Main Page ─────────────────────────────────────── */
export default function DashboardPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [latestInsight, setLatestInsight] = useState<any>(null);
  const [insightLoading, setInsightLoading] = useState(true);
  const [insightError, setInsightError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch monthly reports
        const reportsRes = await fetch("/api/reports?range=monthly");
        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setIncome(reportsData.totalIncome || 0);
          setExpenses(reportsData.totalExpenses || 0);
        }

        // Fetch latest transactions
        const txsRes = await fetch("/api/transactions");
        if (txsRes.ok) {
          const txsData = await txsRes.json();
          setTransactions((txsData.transactions || []).slice(0, 4));
        }
      } catch (err) {
        console.error("Dashboard load data error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    fetchLatestInsight();
  }, []);

  const fetchLatestInsight = async () => {
    try {
      setInsightLoading(true);
      setInsightError(null);
      const res = await fetch("/api/insights/generate");
      if (res.ok) {
        const data = await res.json();
        if (data.insights && data.insights.length > 0) {
          setLatestInsight(data.insights[0]);
        } else if (data.insight) {
          setLatestInsight(data.insight);
        }
      } else if (res.status === 403) {
        setInsightError("Upgrade to Pro to unlock AI insights for your business!");
      }
    } catch (e) {
      console.error("Insight fetch error:", e);
    } finally {
      setInsightLoading(false);
    }
  };

  const netProfit   = income - expenses;
  const insightText = locale === "si" ? latestInsight?.insightTextSi : latestInsight?.insightTextEn;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">

      {/* ── Greeting banner ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-brand-gradient p-8 md:p-10 shadow-glow-brand"
      >
        {/* Inner orbs */}
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">{getGreeting()} 👋</p>
            <h1 className="text-3xl md:text-4xl font-display font-black text-white leading-tight mb-2">
              {t("common.dashboard")}
            </h1>
            <p className="text-white/75 text-sm">
              {"Here's what's happening with your business today."}
            </p>
          </div>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push("/receipts")}
            className="shrink-0 !bg-white/20 !border-white/30 !text-white hover:!bg-white/30 backdrop-blur-sm"
          >
            <Scan className="w-5 h-5 mr-2" />
            Scan Receipt
          </Button>
        </div>
      </motion.div>

      {/* ── Metric Cards ───────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <MetricCard
                label={`${t("dashboard.thisMonth")} ${t("dashboard.income")}`}
                value={formatLKR(income)}
                trend={12}
                trendLabel={t("dashboard.vsLastMonth")}
                icon={TrendingUp}
                variant="income"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <MetricCard
                label={`${t("dashboard.thisMonth")} ${t("dashboard.expenses")}`}
                value={formatLKR(expenses)}
                trend={-5}
                trendLabel={t("dashboard.vsLastMonth")}
                icon={Receipt}
                variant="expense"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <MetricCard
                label={t("dashboard.netProfit")}
                value={formatLKR(netProfit)}
                trend={netProfit > 0 ? 18 : -8}
                trendLabel={t("dashboard.vsLastMonth")}
                icon={PiggyBank}
                variant="profit"
              />
            </motion.div>
          </>
        )}
      </div>

      {/* ── Recent Transactions ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-neutral-900 dark:text-neutral-100">
                {t("dashboard.recentTransactions")}
              </h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                Your latest financial activity
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/transactions")}
              className="gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/70">
            {loading ? (
              <>
                <TxSkeleton />
                <TxSkeleton />
                <TxSkeleton />
                <TxSkeleton />
              </>
            ) : (
              transactions.map((tx, i) => (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="flex items-center justify-between py-4 group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                        tx.type === "income"
                          ? "metric-ring-income text-success-600 dark:text-success-400"
                          : "metric-ring-expense text-danger-600 dark:text-danger-400"
                      }`}
                    >
                      {tx.type === "income" ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <ShoppingCart className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                        {tx.description}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        <span className="px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 font-medium">
                          {tx.category}
                        </span>
                        <span>·</span>
                        <span>{formatDate(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`font-display font-bold text-base px-3 py-1 rounded-full ${
                      tx.type === "income"
                        ? "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-500/10"
                        : "text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-500/10"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {formatLKR(tx.amount)}
                  </span>
                </motion.div>
              ))
            )}
          </div>
        </Card>
      </motion.div>

      {/* ── Quick Actions row ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="grid md:grid-cols-2 gap-4"
      >
        {/* Scan card */}
        <Card
          hover
          variant="gradient"
          className="p-6 cursor-pointer"
          onClick={() => router.push("/receipts")}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-gradient flex items-center justify-center shadow-glow-brand-sm shrink-0">
              <Scan className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                {t("dashboard.scanReceipt")}
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {t("dashboard.scanReceiptDesc")}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 shrink-0" />
          </div>
        </Card>

        {/* Insights card */}
        <Card
          hover
          variant="glass"
          className="p-6 cursor-pointer"
          onClick={() => router.push("/insights")}
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-7 h-7 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-display font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                AI Insights
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Get smart suggestions from Gemini AI
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-neutral-400 shrink-0" />
          </div>
        </Card>
      </motion.div>

      {/* ── AI Insight Banner ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Card
          className="p-6 bg-amber-50/80 dark:bg-amber-500/10
                     border border-amber-200/80 dark:border-amber-500/30
                     backdrop-blur-sm"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-amber-900 dark:text-amber-200">
                  {t("dashboard.aiInsight")}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push("/insights")}
                  className="text-amber-700 dark:text-amber-400 hover:!bg-amber-100 dark:hover:!bg-amber-500/20"
                >
                  View all
                </Button>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                {insightLoading
                  ? "✨ Analysing your spending patterns…"
                  : insightError
                  ? insightError
                  : latestInsight
                  ? insightText
                  : "No insights yet. Click 'View all' to generate your first AI insights."}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
