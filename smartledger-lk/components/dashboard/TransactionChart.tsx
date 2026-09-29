import React from "react";

/**
 * TransactionChart Component.
 * Simplified visual breakdown of monthly cash inflows and outflows.
 */
export const TransactionChart: React.FC = () => {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Cash Flow Chart</h3>
      <div className="h-48 w-full bg-slate-50 flex items-center justify-center text-slate-400 rounded">
        {/* Placeholder for chart engine integration (e.g. Recharts or lightweight CSS bars) */}
        Interactive LKR Cash Flow Visualizer
      </div>
    </div>
  );
};
