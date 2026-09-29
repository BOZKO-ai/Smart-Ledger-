
"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Download, FileSpreadsheet, FileText, ArrowUp, ArrowDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { Skeleton } from "@/components/ui/Skeleton";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";

const formatLKR = (amount: number): string => {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-LK", {
    day: "numeric",
    month: "short",
  }).format(date);
};

export default function ReportsPage() {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "monthly">("monthly");
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);
  const [sortBy, setSortBy] = useState<"amount-asc" | "amount-desc" | "category">("amount-desc");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/reports?range=${timeRange}`);
      if (res.ok) {
        const data = await res.json();
        setReportsData(data);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    if (!reportsData) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Financial Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Period: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`, 20, 30);
    
    let yPos = 50;
    doc.text(`Total Income: ${formatLKR(reportsData.totalIncome)}`, 20, yPos);
    yPos += 10;
    doc.text(`Total Expenses: ${formatLKR(reportsData.totalExpenses)}`, 20, yPos);
    yPos += 10;
    doc.text(`Net Profit: ${formatLKR(reportsData.netProfit)}`, 20, yPos);
    yPos += 20;

    doc.setFontSize(14);
    doc.text("Expense Breakdown", 20, yPos);
    yPos += 10;
    doc.setFontSize(10);
    
    reportsData.categoryData.forEach((item: any, index: number) => {
      doc.text(`${item.category}: ${formatLKR(item.amount)}`, 20, yPos);
      yPos += 7;
    });

    doc.save("financial-report.pdf");
  };

  const exportExcel = () => {
    if (!reportsData) return;

    const worksheetData = [
      ["Financial Report", "", ""],
      [`Period: ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`, "", ""],
      [""],
      ["Category", "Amount"],
      ...reportsData.categoryData.map((item: any) => [
        item.category,
        item.amount
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, "financial-report.xlsx");
  };

  const sortedCategoryData = [...(reportsData?.categoryData || [])].sort((a, b) => {
    switch (sortBy) {
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      case "category":
        return a.category.localeCompare(b.category);
      default:
        return 0;
    }
  }).filter((item: any) => {
    if (filterCategory === "all") return true;
    return item.category === filterCategory;
  });

  const categories: string[] = ["all", ...new Set<string>((reportsData?.categoryData || []).map((item: any) => item.category as string))];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-80" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 dark:text-slate-100">
          {t("reports.title")}
        </h1>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-1">
            {(["daily", "weekly", "monthly"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors touch-target ${
                  timeRange === range
                    ? "bg-brand-500 text-white"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {t(`common.${range}`)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button onClick={exportPDF} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t("common.exportPDF")}
            </Button>
            <Button onClick={exportExcel} className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              {t("common.exportExcel")}
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("reports.totalIncome")}</p>
              <p className="text-2xl font-bold text-success-600 dark:text-success-400">
                {formatLKR(reportsData?.totalIncome || 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-success-100 dark:bg-success-500/20 flex items-center justify-center">
              <ArrowUp className="w-6 h-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("reports.totalExpenses")}</p>
              <p className="text-2xl font-bold text-danger-600 dark:text-danger-400">
                {formatLKR(reportsData?.totalExpenses || 0)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-full bg-danger-100 dark:bg-danger-500/20 flex items-center justify-center">
              <ArrowDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{t("reports.netProfit")}</p>
              <p className={`text-2xl font-bold ${
                (reportsData?.netProfit || 0) >= 0 
                  ? "text-brand-600 dark:text-brand-400" 
                  : "text-danger-600 dark:text-danger-400"
              }`}>
                {formatLKR(reportsData?.netProfit || 0)}
              </p>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              (reportsData?.netProfit || 0) >= 0 
                ? "bg-brand-100 dark:bg-brand-500/20" 
                : "bg-danger-100 dark:bg-danger-500/20"
            }`}>
              {(reportsData?.netProfit || 0) >= 0 ? (
                <ArrowUp className="w-6 h-6 text-brand-600 dark:text-brand-400" />
              ) : (
                <ArrowDown className="w-6 h-6 text-danger-600 dark:text-danger-400" />
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Chart */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          {t("reports.incomeVsExpenses")}
        </h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={reportsData?.chartData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: '#64748b' }} 
                tickFormatter={formatDate}
              />
              <YAxis tick={{ fill: '#64748b' }} />
              <Tooltip 
                formatter={(value: number) => formatLKR(value)} 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
              />
              <Legend />
              <Bar dataKey="income" fill="#10B981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Expense Breakdown */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t("reports.expenseBreakdown")}
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-48"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all" ? t("reports.allCategories") : cat}
                  </option>
                ))}
              </Select>
            </div>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-48"
            >
              <option value="amount-desc">Amount (High → Low)</option>
              <option value="amount-asc">Amount (Low → High)</option>
              <option value="category">Category (A → Z)</option>
            </Select>
          </div>
        </div>

        {sortedCategoryData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">{t("reports.noData")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedCategoryData.map((item: any, index: number) => {
              const percentage = (item.amount / (reportsData?.totalExpenses || 1)) * 100;
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {item.category}
                    </span>
                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                      {formatLKR(item.amount)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {percentage.toFixed(1)}% of total expenses
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
