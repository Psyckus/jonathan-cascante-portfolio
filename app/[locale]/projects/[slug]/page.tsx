import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "../../../components/case-study";
import { getDictionary, isLocale } from "../../../i18n/config";
import type { ProjectSlug } from "../../../lib/projects";

const projectSlugs: ProjectSlug[] = ["casanet", "ccss", "api-transferencias"];

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !projectSlugs.includes(slug as ProjectSlug)) notFound();
  const seo = getDictionary(locale).seo.projects[slug as ProjectSlug];
  return {
    title: seo.title,
    description: seo.description,
    alternates: { languages: { es: `/es/projects/${slug}/`, en: `/en/projects/${slug}/` } },
    openGraph: { title: seo.title, description: seo.description, locale: locale === "es" ? "es_CR" : "en_US", type: "article" },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !projectSlugs.includes(slug as ProjectSlug)) notFound();
  return <CaseStudy projectSlug={slug as ProjectSlug} />;
}
