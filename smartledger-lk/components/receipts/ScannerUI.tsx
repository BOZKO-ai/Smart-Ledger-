import React from "react";

/**
 * ScannerUI Component.
 * Visual camera frame placeholder targeting receipt borders, with OCR alignment cues.
 */
export const ScannerUI: React.FC = () => {
  return (
    <div className="relative aspect-[3/4] w-full rounded-lg border-2 border-primary-500 bg-slate-900 overflow-hidden flex items-center justify-center">
      {/* Target scanning border lines */}
      <div className="absolute inset-8 border border-dashed border-primary-300 opacity-60 pointer-events-none" />
      <span className="text-white text-sm text-center px-4 font-mono">
        Align receipt inside the border. Press shutter to capture.
      </span>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <button className="h-14 w-14 rounded-full border-4 border-white bg-primary-500 shadow-md focus:outline-none" />
      </div>
    </div>
  );
};
