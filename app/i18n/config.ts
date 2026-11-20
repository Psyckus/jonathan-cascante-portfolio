import en from "./en.json";
import es from "./es.json";

export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export type Dictionary = typeof es;

const dictionaries: Record<Locale, Dictionary> = {
  es,
  en: en as Dictionary,
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
