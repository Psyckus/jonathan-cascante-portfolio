import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioHome } from "../components/portfolio-home";
import { getDictionary, isLocale, locales } from "../i18n/config";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const seo = getDictionary(locale).seo.home;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { languages: { es: "/es/", en: "/en/" } },
    openGraph: { title: seo.ogTitle, description: seo.ogDescription, locale: locale === "es" ? "es_CR" : "en_US", type: "website" },
    twitter: { card: "summary_large_image", title: seo.ogTitle, description: seo.ogDescription },
  };
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PortfolioHome />;
}
