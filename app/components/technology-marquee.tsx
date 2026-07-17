import type { CSSProperties } from "react";
import type { SimpleIcon } from "simple-icons";
import {
  siBootstrap,
  siCss,
  siDocker,
  siDotnet,
  siFlutter,
  siGit,
  siGithub,
  siHibernate,
  siHtml5,
  siJavascript,
  siJquery,
  siJsonwebtokens,
  siMongodb,
  siMysql,
  siOpenid,
  siOpenjdk,
  siPhp,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siSpringboot,
  siSwagger,
  siTypescript,
} from "simple-icons";
import { useMemo } from "react";
import { useI18n } from "../i18n/i18n-provider";
import { getSkillCategories, getSkills, type Skill, type TechnologyIconId } from "../lib/projects";
import { TechIcon, type TechType } from "./icons";

const brandIcons: Partial<Record<TechnologyIconId, SimpleIcon>> = {
  bootstrap: siBootstrap,
  css: siCss,
  docker: siDocker,
  dotnet: siDotnet,
  flutter: siFlutter,
  git: siGit,
  github: siGithub,
  hibernate: siHibernate,
  html5: siHtml5,
  javascript: siJavascript,
  jquery: siJquery,
  jsonwebtokens: siJsonwebtokens,
  mongodb: siMongodb,
  mysql: siMysql,
  openid: siOpenid,
  openjdk: siOpenjdk,
  php: siPhp,
  postman: siPostman,
  python: siPython,
  react: siReact,
  redis: siRedis,
  springboot: siSpringboot,
  swagger: siSwagger,
  typescript: siTypescript,
};

const genericIcons: Partial<Record<TechnologyIconId, TechType>> = {
  api: "api",
  database: "db",
};

function TechnologyLogo({ technology }: { technology: Skill }) {
  const icon = brandIcons[technology.icon];

  if (icon) {
    return <svg className="technology-brand-icon" aria-hidden="true" viewBox="0 0 24 24"><path d={icon.path} /></svg>;
  }

  return <TechIcon type={genericIcons[technology.icon] ?? "service"} />;
}

function TechnologyChip({ technology, duplicate }: { technology: Skill; duplicate: boolean }) {
  return (
    <span
      className="technology-marquee-chip"
      style={{ "--technology-color": technology.color } as CSSProperties}
      role={duplicate ? undefined : "listitem"}
      tabIndex={duplicate ? -1 : 0}
      title={technology.context}
      aria-label={duplicate ? undefined : `${technology.name}: ${technology.context}`}
    >
      <span className="technology-marquee-icon"><TechnologyLogo technology={technology} /></span>
      <span>{technology.name}</span>
    </span>
  );
}

export function TechnologyMarquee() {
  const { dictionary } = useI18n();
  const copy = dictionary.marquee;
  const skillCategories = useMemo(() => getSkillCategories(dictionary), [dictionary]);
  const skills = useMemo(() => getSkills(dictionary), [dictionary]);
  const rows = [
    { label: copy.rowOne, technologies: skillCategories.slice(0, 2).flatMap((category) => category.skills) },
    { label: copy.rowTwo, technologies: skillCategories.slice(2).flatMap((category) => category.skills) },
  ];

  return (
    <section className="technology-marquee-section" aria-labelledby="technology-marquee-title">
      <div className="technology-marquee-heading">
        <div>
          <p className="section-kicker">{copy.kicker}</p>
          <h2 id="technology-marquee-title">{copy.title}</h2>
        </div>
        <div className="technology-marquee-summary">
          <p>{copy.description}</p>
          <span><strong>{skills.length}</strong> {copy.used}</span>
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
