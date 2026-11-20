import type { Metadata } from "next";
import { getDictionary } from "../i18n/config";

const seo = getDictionary("es").seo.home;

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  robots: { index: false, follow: true },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es" style={{ colorScheme: "dark" }}><body>{children}</body></html>;
}
