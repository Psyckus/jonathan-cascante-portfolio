import type { Metadata } from "next";
import { getDictionary, type Locale } from "../i18n/config";
import type { ProjectSlug } from "./projects";

export const siteUrl = new URL(process.env.SITE_URL || "https://jonathan-cascante-portfolio.vercel.app");

export function localizedUrl(locale: Locale, project?: ProjectSlug) {
  return new URL(project ? `/${locale}/projects/${project}/` : `/${locale}/`, siteUrl).href;
}

export function languageAlternates(project?: ProjectSlug) {
  return { es: localizedUrl("es", project), en: localizedUrl("en", project), "x-default": localizedUrl("en", project) };
}

export function portfolioMetadata(locale: Locale, project?: ProjectSlug): Metadata {
  const dictionary = getDictionary(locale);
  const home = dictionary.seo.home;
  const { title, description } = project ? dictionary.seo.projects[project] : home;
  const socialTitle = project ? title : home.ogTitle;
  const socialDescription = project ? description : home.ogDescription;
  const url = localizedUrl(locale, project);
  const image = new URL(`/social/${locale}/${project ?? "home"}.png`, siteUrl).href;
  const socialLocale = locale === "es" ? "es_CR" : "en_US";

  return {
    title,
    description,
    alternates: { canonical: url, languages: languageAlternates(project) },
    openGraph: {
      url,
      siteName: "Jonathan Cascante",
      title: socialTitle,
      description: socialDescription,
      locale: socialLocale,
      alternateLocale: locale === "es" ? "en_US" : "es_CR",
      type: project ? "article" : "website",
      images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description: socialDescription, images: [{ url: image, alt: socialTitle }] },
  };
}
