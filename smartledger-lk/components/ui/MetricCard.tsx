
import React from "react";
import { motion } from "framer-motion";
import { Card } from "./Card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  prefix?: string;
  suffix?: string;
  icon?: React.ElementType;
  variant?: "income" | "expense" | "profit" | "default";
}

const variantConfig = {
  income:  { ring: "metric-ring-income",  text: "text-success-600 dark:text-success-400",  bg: "bg-success-50 dark:bg-success-500/10"  },
  expense: { ring: "metric-ring-expense", text: "text-danger-600 dark:text-danger-400",    bg: "bg-danger-50 dark:bg-danger-500/10"    },
  profit:  { ring: "metric-ring-profit",  text: "text-brand-600 dark:text-brand-400",      bg: "bg-brand-50 dark:bg-brand-500/10"      },
  default: { ring: "",                    text: "text-neutral-600 dark:text-neutral-400",  bg: "bg-neutral-100 dark:bg-neutral-800"    },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  trend,
  trendLabel,
  prefix,
  suffix,
  icon: Icon,
  variant = "default",
}) => {
  const isPositive = trend !== undefined && trend > 0;
  const isNegative = trend !== undefined && trend < 0;
  const cfg = variantConfig[variant];

  return (
    <Card hover className="p-6 group overflow-hidden relative">
      {/* Subtle gradient backdrop on hover */}
      <motion.div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${cfg.bg}`}
      />

      <div className="relative z-10">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cfg.ring || "bg-neutral-100 dark:bg-neutral-800"}`}>
                <Icon className={`w-5 h-5 ${cfg.text}`} />
              </div>
            )}
            <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 leading-tight">
              {label}
            </span>
          </div>

          {trend !== undefined && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                isPositive
                  ? "bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-400"
                  : isNegative
                  ? "bg-danger-50 text-danger-600 dark:bg-danger-500/20 dark:text-danger-400"
                  : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
              }`}
            >
              {isPositive ? (
                <ArrowUp size={11} />
              ) : isNegative ? (
                <ArrowDown size={11} />
              ) : (
                <Minus size={11} />
              )}
              {Math.abs(trend)}%
            </span>
          )}
        </div>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          {prefix && (
            <span className="text-lg font-semibold text-neutral-400 dark:text-neutral-500">
              {prefix}
            </span>
          )}
          <motion.span
            key={String(value)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-display font-black text-neutral-900 dark:text-neutral-50 tracking-tight"
          >
            {value}
          </motion.span>
          {suffix && (
            <span className="text-lg font-semibold text-neutral-400 dark:text-neutral-500">
              {suffix}
            </span>
          )}
        </div>

        {/* Trend label */}
        {trendLabel && (
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
            {trendLabel}
          </p>
        )}
      </div>
    </Card>
  );
};
