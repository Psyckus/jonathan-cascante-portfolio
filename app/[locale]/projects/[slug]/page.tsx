import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "../../../components/case-study";
import { isLocale } from "../../../i18n/config";
import { isProjectSlug, projectSlugs } from "../../../lib/projects";
import { portfolioMetadata } from "../../../lib/seo";

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  return portfolioMetadata(locale, slug);
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !isProjectSlug(slug)) notFound();
  return <CaseStudy locale={locale} projectSlug={slug} />;
}
