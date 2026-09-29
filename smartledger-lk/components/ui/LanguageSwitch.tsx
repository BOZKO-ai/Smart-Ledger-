
import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface LanguageSwitchProps {
  onLanguageChange?: (lang: "en" | "si") => void;
}

export const LanguageSwitch: React.FC<LanguageSwitchProps> = ({ onLanguageChange }) => {
  const { locale, changeLocale } = useTranslation();

  const handleLanguageChange = (newLocale: "en" | "si") => {
    changeLocale(newLocale);
    if (onLanguageChange) {
      onLanguageChange(newLocale);
    }
  };

  return (
    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
      <button
        onClick={() => handleLanguageChange("en")}
        className="relative px-4 py-2 rounded-lg font-medium transition-all touch-target"
      >
        <span
          className={`relative z-10 ${
            locale === "en"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          EN
        </span>
        {locale === "en" && (
          <motion.div
            layoutId="active-language"
            className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-layered-sm dark:shadow-layered-sm-dark"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </button>
      <button
        onClick={() => handleLanguageChange("si")}
        className="relative px-4 py-2 rounded-lg font-medium transition-all touch-target"
      >
        <span
          className={`relative z-10 ${
            locale === "si"
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          සිං
        </span>
        {locale === "si" && (
          <motion.div
            layoutId="active-language"
            className="absolute inset-0 bg-white dark:bg-neutral-700 rounded-lg shadow-layered-sm dark:shadow-layered-sm-dark"
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        )}
      </button>
    </div>
  );
};
