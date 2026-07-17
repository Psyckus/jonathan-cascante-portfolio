"use client";

import { useEffect } from "react";

export function LocaleRedirect() {
  useEffect(() => {
    const saved = localStorage.getItem("portfolio-locale");
    const locale = saved === "es" || saved === "en" ? saved : navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
    window.location.replace(`/${locale}/${window.location.search}${window.location.hash}`);
  }, []);

  return null;
}
