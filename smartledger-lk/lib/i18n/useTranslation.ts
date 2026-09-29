"use client";

import { useState, useEffect } from "react";
import en from "./en.json";
import si from "./si.json";

type TranslationDictionary = typeof en;
const LOCAL_STORAGE_KEY = "smartledger-language";

/**
 * Custom hook to manage internationalization (i18n) translation access keys.
 */
export function useTranslation() {
  const [locale, setLocale] = useState<"en" | "si">("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedLocale = localStorage.getItem(LOCAL_STORAGE_KEY) as "en" | "si";
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  const changeLocale = (newLocale: "en" | "si") => {
    setLocale(newLocale);
    localStorage.setItem(LOCAL_STORAGE_KEY, newLocale);
  };

  const dictionary: TranslationDictionary = locale === "si" ? (si as any) : en;

  // Simple nested key resolver (e.g. t('common.appName'))
  const t = (path: string): string => {
    const keys = path.split(".");
    let current: any = dictionary;

    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return path; // Fallback to path if missing key
      }
    }
    return current;
  };

  return { t, locale, changeLocale, isClient };
}
