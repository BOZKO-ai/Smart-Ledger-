import React from "react";
import Link from "next/link";

/**
 * Shared Navigation Sidebar Links.
 */
export const Nav: React.FC = () => {
  return (
    <ul className="space-y-1">
      <li>
        <Link href="/dashboard" className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">
          <span>📊 Overview</span>
        </Link>
      </li>
      <li>
        <Link href="/transactions" className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">
          <span>📝 Ledger</span>
        </Link>
      </li>
      <li>
        <Link href="/receipts" className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">
          <span>📸 Scan Bills</span>
        </Link>
      </li>
      <li>
        <Link href="/inventory" className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">
          <span>📦 Stock</span>
        </Link>
      </li>
      <li>
        <Link href="/insights" className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-md">
          <span>💡 AI Advice</span>
        </Link>
      </li>
    </ul>
  );
};
