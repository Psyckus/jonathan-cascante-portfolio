import type { MetadataRoute } from "next";
import { locales } from "./i18n/config";
import { projectSlugs } from "./lib/projects";
import { languageAlternates, localizedUrl } from "./lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    { url: localizedUrl(locale), alternates: { languages: languageAlternates() } },
    ...projectSlugs.map((project) => ({
      url: localizedUrl(locale, project),
      alternates: { languages: languageAlternates(project) },
    })),
  ]);
}
