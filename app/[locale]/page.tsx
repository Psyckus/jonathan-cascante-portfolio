import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioHome } from "../components/portfolio-home";
import { isLocale } from "../i18n/config";
import { portfolioMetadata } from "../lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return portfolioMetadata(locale);
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <PortfolioHome locale={locale} />;
}
