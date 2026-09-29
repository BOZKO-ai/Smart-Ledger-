import React from "react";

/**
 * QuickActions Component.
 * Prompts micro-SMEs to do rapid entries:
 * 1. Log Income/Sale (LKR)
 * 2. Snap Receipt Image
 * 3. Log Voice memo (AI parses Sinhala speech/English numbers)
 */
export const QuickActions: React.FC = () => {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
      <button className="flex flex-col items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg text-primary-800 transition-colors">
        <span className="text-xl">💰</span>
        <span className="mt-1 text-sm font-semibold">Record Sale</span>
      </button>
      <button className="flex flex-col items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 rounded-lg text-yellow-800 transition-colors">
        <span className="text-xl">📸</span>
        <span className="mt-1 text-sm font-semibold">Scan Bill / Receipt</span>
      </button>
      <button className="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-blue-800 transition-colors">
        <span className="text-xl">🎙️</span>
        <span className="mt-1 text-sm font-semibold">Record Voice Memo</span>
      </button>
    </div>
  );
};
