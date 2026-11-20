"use client";

import { useRouter } from "next/navigation";
import type { Dictionary, Locale } from "../i18n/config";
import { navigateWithLocaleTransition } from "../i18n/locale-transition";
import type { ProjectSlug } from "../lib/projects";

export function LanguageSwitcher({ locale, copy, projectSlug }: { locale: Locale; copy: Dictionary["language"]; projectSlug?: ProjectSlug }) {
  const router = useRouter();
  const options: Locale[] = ["es", "en"];

  return (
    <div className="language-switcher" role="group" aria-label={copy.label}>
      {options.map((option, index) => {
        const href = projectSlug ? `/${option}/projects/${projectSlug}/` : `/${option}/`;
        return (
          <span key={option}>
            {index > 0 && <i aria-hidden="true" />}
            <a
              href={href}
              hrefLang={option}
              lang={option}
              className={locale === option ? "active" : ""}
              aria-current={locale === option ? "page" : undefined}
              aria-label={`${copy[option]} · ${option === "es" ? copy.spanish : copy.english}`}
              onPointerEnter={(event) => { if (event.pointerType === "mouse" && locale !== option) router.prefetch(href); }}
              onFocus={() => { if (locale !== option) router.prefetch(href); }}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
                event.preventDefault();
                if (locale === option) return;
                const { search, hash } = window.location;
                navigateWithLocaleTransition(option, () => {
                  router.push(`${href}${search}${hash}`, { scroll: false });
                });
              }}
            >
              {copy[option]}
            </a>
          </span>
        );
      })}
    </div>
  );
}
