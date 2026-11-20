import { ImageResponse } from "next/og";
import { getDictionary, isLocale, locales } from "../../../i18n/config";
import { getProjectBySlug, isProjectSlug, projectSlugs } from "../../../lib/projects";

const cards = ["home", ...projectSlugs];
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => cards.map((card) => ({ locale, card: `${card}.png` })));
}

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string; card: string }> }) {
  const { locale, card } = await params;
  const name = card.endsWith(".png") ? card.slice(0, -4) : "";
  if (!isLocale(locale) || (name !== "home" && !isProjectSlug(name))) {
    return new Response(null, { status: 404 });
  }

  const dictionary = getDictionary(locale);
  const project = isProjectSlug(name) ? getProjectBySlug(dictionary, name) : undefined;
  const accent = project?.accent === "blue" ? "#93b3ff" : project?.accent === "green" ? "#62ddb1" : "#ff994f";
  const title = project?.title ?? "Jonathan Cascante";
  const detail = project ? project.technologies.slice(0, 4).join("  ·  ") : dictionary.hero.role;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 82px", color: "#f2f5fb", backgroundImage: "linear-gradient(130deg, #111e31, #070b14 70%)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 27, color: "#aebbd0" }}>
          <div style={{ width: 40, height: 3, backgroundColor: accent }} />
          {project ? "Jonathan Cascante" : dictionary.hero.eyebrow}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {project && <div style={{ display: "flex", color: accent, fontSize: 27 }}>{dictionary.caseStudy.case}</div>}
          <div style={{ display: "flex", fontSize: title.length > 30 ? 72 : 90, lineHeight: 1.06, fontWeight: 700 }}>{title}</div>
        </div>
        <div style={{ display: "flex", borderTop: "1px solid #354157", paddingTop: 26, color: accent, fontSize: 25 }}>{detail}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
