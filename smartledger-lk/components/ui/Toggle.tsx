
import React, { useState } from "react";
import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-14 h-7 rounded-full transition-colors duration-200 touch-target ${
        checked ? "bg-brand-500" : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full shadow-sm ${
          checked ? "left-8" : "left-1"
        }`}
      />
    </button>
  );
};

