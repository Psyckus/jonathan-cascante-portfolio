"use client";

import { useEffect } from "react";
import type { Locale } from "./config";
import { localeDidCommit } from "./locale-transition";

export function LocalePreference({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    document.cookie = `portfolio-locale=${locale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    localeDidCommit(locale);
  }, [locale]);
  return null;
}
