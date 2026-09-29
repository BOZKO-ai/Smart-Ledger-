"use client";

import React, { useState } from "react";

/**
 * LanguageToggle Component.
 * Supports quick shift between English (EN) and Sinhala (සිං) for local micro-SME owners.
 */
export const LanguageToggle: React.FC = () => {
  const [lang, setLang] = useState<"en" | "si">("en");

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "si" : "en";
    setLang(nextLang);
    // Dispatches standard translation context update here
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-xs font-bold border border-slate-300 rounded hover:bg-slate-50 transition-colors"
    >
      {lang === "en" ? "සිංහල (SI)" : "English (EN)"}
    </button>
  );
};
