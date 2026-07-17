"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getDictionary, localeFromPathname, type Dictionary, type Locale } from "./config";

type I18nContextValue = {
  dictionary: Dictionary;
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "portfolio-locale";

function localizedPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] === "es" || segments[0] === "en") segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}${pathname.endsWith("/") ? "/" : ""}`;
}

export function I18nProvider({ children, initialLocale }: { children: React.ReactNode; initialLocale: Locale }) {
  const [locale, setCurrentLocale] = useState(initialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    if (nextLocale === locale) return;
    localStorage.setItem(STORAGE_KEY, nextLocale);
    document.cookie = `${STORAGE_KEY}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = nextLocale;
    const nextPath = localizedPath(window.location.pathname, nextLocale);
    window.history.pushState(window.history.state, "", `${nextPath}${window.location.search}${window.location.hash}`);
    setCurrentLocale(nextLocale);
  }, [locale]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale);
    document.cookie = `${STORAGE_KEY}=${locale}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = locale;
    const dictionary = getDictionary(locale);
    const projectSlug = window.location.pathname.match(/\/projects\/(casanet|ccss|api-transferencias)/)?.[1] as keyof typeof dictionary.seo.projects | undefined;
    const seo = projectSlug ? dictionary.seo.projects[projectSlug] : dictionary.seo.home;
    const socialTitle = projectSlug ? seo.title : dictionary.seo.home.ogTitle;
    const socialDescription = projectSlug ? seo.description : dictionary.seo.home.ogDescription;
    document.title = seo.title;
    document.querySelectorAll<HTMLMetaElement>('meta[name="description"]').forEach((element) => element.setAttribute("content", seo.description));
    document.querySelectorAll<HTMLMetaElement>('meta[property="og:description"], meta[name="twitter:description"]').forEach((element) => element.setAttribute("content", socialDescription));
    const titles = document.querySelectorAll<HTMLMetaElement>('meta[property="og:title"], meta[name="twitter:title"]');
    titles.forEach((element) => element.setAttribute("content", socialTitle));
  }, [locale]);

  useEffect(() => {
    const handlePopState = () => {
      const nextLocale = localeFromPathname(window.location.pathname);
      if (nextLocale) setCurrentLocale(nextLocale);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const value = useMemo(() => ({ dictionary: getDictionary(locale), locale, setLocale }), [locale, setLocale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
