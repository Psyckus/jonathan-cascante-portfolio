"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { getProjectBySlug, type Project, type ProjectSlug } from "../lib/projects";
import { useI18n } from "../i18n/i18n-provider";
import { ArrowIcon, ExternalIcon } from "./icons";
import { LanguageSwitcher } from "./language-switcher";
import { ProjectPreview } from "./project-preview";

function CaseReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(9px)" }} whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .15 }} transition={{ duration: .68, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function CaseArchitecture({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const { dictionary } = useI18n();
  const copy = dictionary.caseStudy;
  return (
    <div className="case-architecture" aria-label={`${copy.architectureFor} ${project.title}`}>
      <div className="case-main-flow">
        {project.flow.map((node, index) => (
          <div className="case-node-wrap" key={node}>
            <motion.span initial={reduced ? false : { opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * .09 }}>{node}<small>{index === 0 ? copy.entry : index === project.flow.length - 1 ? copy.persistence : `${copy.layer} ${index}`}</small></motion.span>
            {index < project.flow.length - 1 && <motion.i initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: .1 + index * .09, duration: .42 }}><b /></motion.i>}
          </div>
        ))}
      </div>
      <div className="case-integrations"><p>{copy.connectedServices}</p><div>{project.integrations.map((item, index) => <motion.span key={item} initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .42 + index * .07 }}>{item}</motion.span>)}</div></div>
    </div>
  );
}

export function CaseStudy({ projectSlug }: { projectSlug: ProjectSlug }) {
  const { dictionary, locale } = useI18n();
  const project = getProjectBySlug(dictionary, projectSlug);
  const copy = dictionary.caseStudy;
  const nextSlug = project.slug === "casanet" ? "ccss" : project.slug === "ccss" ? "api-transferencias" : "casanet";
  return (
    <main className="case-page">
      <div className="case-header-shell"><header className="case-header"><Link className="wordmark" href={`/${locale}/#inicio`}>Jonathan <span>Cascante</span></Link><div className="case-header-actions"><Link className="back-link" href={`/${locale}/#proyectos`}><span>←</span> {copy.back}</Link><LanguageSwitcher /></div></header></div>

      <section className={`case-hero ${project.accent}`}>
        <CaseReveal className="case-hero-copy">
          <p className="project-label">{copy.case} · {project.index}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="tag-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          <div className="case-actions"><a className="button button-primary" href="#arquitectura">{copy.viewArchitecture} <ArrowIcon /></a>{project.demoUrl ? <a className="button button-secondary" href={project.demoUrl} target="_blank" rel="noreferrer">{copy.openDemo} <ExternalIcon /></a> : <span className="button button-secondary unavailable">{copy.privateDemo}</span>}</div>
        </CaseReveal>
        <CaseReveal className="case-preview" delay={.08}><ProjectPreview type={project.slug} /></CaseReveal>
      </section>

      <section className="case-section case-overview">
        <CaseReveal><span>01</span><p className="section-kicker">{copy.context}</p><h2>{copy.problem}</h2><p>{project.problem}</p></CaseReveal>
        <CaseReveal delay={.08}><span>02</span><p className="section-kicker">{copy.direction}</p><h2>{copy.objective}</h2><p>{project.objective}</p></CaseReveal>
        <CaseReveal delay={.16}><span>03</span><p className="section-kicker">{copy.contribution}</p><h2>{copy.participation}</h2><p>{project.participation}</p></CaseReveal>
      </section>

      <section className="case-section architecture-case-section" id="arquitectura">
        <CaseReveal className="case-section-heading"><p className="section-kicker">{copy.technicalDesign}</p><h2>{copy.architectureTitle}</h2><p>{project.architecture}</p></CaseReveal>
        <CaseArchitecture project={project} />
      </section>

      <section className="case-section case-challenges">
        <CaseReveal className="case-section-heading"><p className="section-kicker">{copy.execution}</p><h2>{copy.challengesTitle}</h2></CaseReveal>
        <div className="challenge-grid">{project.challenges.map((challenge, index) => <motion.article key={challenge} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .5, delay: index * .07 }}><span>{String(index + 1).padStart(2, "0")}</span><p>{challenge}</p></motion.article>)}</div>
      </section>

      <section className="case-section result-grid">
        <CaseReveal><p className="section-kicker">{copy.result}</p><h2>{copy.resultTitle}</h2><p>{project.result}</p></CaseReveal>
        <CaseReveal delay={.1}><p className="section-kicker">{copy.learnings}</p><h2>{copy.learningsTitle}</h2><p>{project.learnings}</p></CaseReveal>
      </section>

      <section className="case-next"><p className="section-kicker">{copy.next}</p><h2>{copy.nextTitle}</h2><Link className="button button-primary" href={`/${locale}/projects/${nextSlug}`}>{copy.nextProject} <ArrowIcon /></Link></section>
      <footer className="site-footer"><Link className="wordmark" href={`/${locale}/`}>Jonathan <span>Cascante</span></Link><div className="footer-copy"><p>{dictionary.footer.designed}</p><small>{dictionary.footer.location}</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </main>
  );
}
