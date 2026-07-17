"use client";

import { useI18n } from "../i18n/i18n-provider";
import type { Locale } from "../i18n/config";

export function LanguageSwitcher() {
  const { dictionary, locale, setLocale } = useI18n();
  const options: Locale[] = ["es", "en"];

  return (
    <div className="language-switcher" role="group" aria-label={dictionary.language.label}>
      {options.map((option, index) => (
        <span key={option}>
          {index > 0 && <i aria-hidden="true" />}
          <button type="button" className={locale === option ? "active" : ""} aria-pressed={locale === option} aria-label={option === "es" ? dictionary.language.spanish : dictionary.language.english} onClick={() => setLocale(option)}>
            {dictionary.language[option]}
          </button>
        </span>
      ))}
    </div>
  );
}
