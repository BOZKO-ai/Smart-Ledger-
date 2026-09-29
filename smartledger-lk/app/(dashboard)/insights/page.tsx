
"use client";

import React, { useState, useEffect } from "react";
import { Lightbulb, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Skeleton } from "@/components/ui/Skeleton";


const formatMonthYear = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-LK", {
    month: "long",
    year: "numeric",
  }).format(date);
};

export default function InsightsPage() {
  const { t, locale } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [insights, setInsights] = useState<any[]>([]);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/insights/generate");
      if (res.ok) {
        const data = await res.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = async () => {
    try {
      setGenerating(true);
      const res = await fetch("/api/insights/generate", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.insight) {
          setInsights(prev => {
            const filtered = prev.filter(i => i._id !== data.insight._id);
            return [data.insight, ...filtered];
          });
        }
      }
    } catch (error) {
      console.error("Error generating insights:", error);
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        {[1, 2].map(i => (
          <Skeleton key={i} className="h-64" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
          {t("insights.title")}
        </h1>
        <Button onClick={generateInsights} disabled={generating} className="flex items-center gap-2">
          {generating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Lightbulb className="w-4 h-4" />
          )}
          {generating ? t("insights.generating") : t("insights.generateNew")}
        </Button>
      </div>

      {insights.length === 0 ? (
        <Card className="p-8 text-center">
          <Lightbulb className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {t("insights.noInsights")}
          </h3>
          <Button onClick={generateInsights} disabled={generating} className="flex items-center gap-2 mx-auto mt-4">
            {generating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lightbulb className="w-4 h-4" />
            )}
            {generating ? t("insights.generating") : t("insights.generateNew")}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => {
            const text = locale === "si" ? insight.insightTextSi : insight.insightTextEn;
            return (
              <Card key={insight._id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {formatMonthYear(insight.month)}
                      </span>
                    </div>
                    <div className="whitespace-pre-line text-slate-700 dark:text-slate-300">
                      {text}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
