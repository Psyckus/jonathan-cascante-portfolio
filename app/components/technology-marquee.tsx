import type { CSSProperties } from "react";
import type { Dictionary } from "../i18n/config";
import type { Skill, SkillCategory, TechnologyIconId } from "../lib/projects";
import { TechIcon, type TechType } from "./icons";

const genericIcons: Partial<Record<TechnologyIconId, TechType>> = {
  api: "api",
  database: "db",
};

function TechnologyLogo({ technology }: { technology: Skill }) {
  const icon = genericIcons[technology.icon];
  if (icon) return <TechIcon type={icon} />;
  return <svg className="technology-brand-icon" aria-hidden="true" viewBox="0 0 24 24"><use href={`/technology-icons.svg#${technology.icon}`} /></svg>;
}

function TechnologyChip({ technology, duplicate }: { technology: Skill; duplicate: boolean }) {
  return (
    <span
      className="technology-marquee-chip"
      style={{ "--technology-color": technology.color } as CSSProperties}
      role={duplicate ? undefined : "listitem"}
      title={duplicate ? undefined : technology.context}
    >
      <span className="technology-marquee-icon"><TechnologyLogo technology={technology} /></span>
      <span>{technology.name}</span>
    </span>
  );
}

export function TechnologyMarquee({ copy, categories }: { copy: Dictionary["marquee"]; categories: SkillCategory[] }) {
  const total = categories.reduce((count, category) => count + category.skills.length, 0);
  const rows = [
    { label: copy.rowOne, technologies: categories.slice(0, 2).flatMap((category) => category.skills) },
    { label: copy.rowTwo, technologies: categories.slice(2).flatMap((category) => category.skills) },
  ];

  return (
    <section className="technology-marquee-section" aria-labelledby="technology-marquee-title" data-animate-when-visible>
      <div className="technology-marquee-heading">
        <div>
          <p className="section-kicker">{copy.kicker}</p>
          <h2 id="technology-marquee-title">{copy.title}</h2>
        </div>
        <div className="technology-marquee-summary">
          <p>{copy.description}</p>
          <span><strong>{total}</strong> {copy.used}</span>
        </div>
      </div>

      <div className="technology-marquee-rows">
        {rows.map((row, rowIndex) => (
          <div className="technology-marquee-row" data-direction={rowIndex === 0 ? "forward" : "reverse"} aria-label={row.label} key={row.label}>
            <div className="technology-marquee-track">
              {[false, true].map((duplicate) => (
                <div className="technology-marquee-group" role={duplicate ? undefined : "list"} aria-hidden={duplicate || undefined} key={duplicate ? "duplicate" : "primary"}>
                  {row.technologies.map((technology) => <TechnologyChip technology={technology} duplicate={duplicate} key={`${duplicate ? "duplicate" : "primary"}-${technology.name}`} />)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
