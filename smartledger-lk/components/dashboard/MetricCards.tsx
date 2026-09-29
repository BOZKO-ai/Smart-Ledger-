import React from "react";

/**
 * MetricCards Dashboard Component.
 * Displays LKR earnings and monthly metrics with trend icons.
 */
export const MetricCards: React.FC = () => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {/* Revenue Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase">Revenue (Income)</div>
        <div className="mt-2 text-2xl font-bold text-slate-900">LKR 125,500.00</div>
        <div className="text-xs text-primary-600 mt-1">↑ 12% vs last month</div>
      </div>
      {/* Expenses Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase">Expenses</div>
        <div className="mt-2 text-2xl font-bold text-slate-900">LKR 45,200.00</div>
        <div className="text-xs text-rose-600 mt-1">↓ 4% vs last month</div>
      </div>
      {/* Net profit Card */}
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-xs font-medium text-slate-500 uppercase">Net Profit</div>
        <div className="mt-2 text-2xl font-bold text-primary-700">LKR 80,300.00</div>
        <div className="text-xs text-slate-500 mt-1">Estimated for current month</div>
      </div>
    </div>
  );
};
