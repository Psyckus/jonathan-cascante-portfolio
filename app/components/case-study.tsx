"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Project } from "../lib/projects";
import { ArrowIcon, ExternalIcon } from "./icons";
import { ProjectPreview } from "./project-preview";

function CaseReveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(9px)" }} whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true, amount: .15 }} transition={{ duration: .68, delay, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>;
}

function CaseArchitecture({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  return (
    <div className="case-architecture" aria-label={`Arquitectura de ${project.title}`}>
      <div className="case-main-flow">
        {project.flow.map((node, index) => (
          <div className="case-node-wrap" key={node}>
            <motion.span initial={reduced ? false : { opacity: 0, scale: .95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * .09 }}>{node}<small>{index === 0 ? "Entrada" : index === project.flow.length - 1 ? "Persistencia" : `Capa ${index}`}</small></motion.span>
            {index < project.flow.length - 1 && <motion.i initial={reduced ? false : { scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: .1 + index * .09, duration: .42 }}><b /></motion.i>}
          </div>
        ))}
      </div>
      <div className="case-integrations"><p>Servicios conectados</p><div>{project.integrations.map((item, index) => <motion.span key={item} initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .42 + index * .07 }}>{item}</motion.span>)}</div></div>
    </div>
  );
}

export function CaseStudy({ project }: { project: Project }) {
  return (
    <main className="case-page">
      <div className="case-header-shell"><header className="case-header"><Link className="wordmark" href="/#inicio">Jonathan <span>Cascante</span></Link><Link className="back-link" href="/#proyectos"><span>←</span> Volver a proyectos</Link></header></div>

      <section className={`case-hero ${project.accent}`}>
        <CaseReveal className="case-hero-copy">
          <p className="project-label">Caso de estudio · {project.index}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <div className="tag-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          <div className="case-actions"><a className="button button-primary" href="#arquitectura">Ver arquitectura <ArrowIcon /></a>{project.demoUrl ? <a className="button button-secondary" href={project.demoUrl} target="_blank" rel="noreferrer">Abrir demo <ExternalIcon /></a> : <span className="button button-secondary unavailable">Demo de acceso privado</span>}</div>
        </CaseReveal>
        <CaseReveal className="case-preview" delay={.08}><ProjectPreview type={project.slug} /></CaseReveal>
      </section>

      <section className="case-section case-overview">
        <CaseReveal><span>01</span><p className="section-kicker">El contexto</p><h2>Problema</h2><p>{project.problem}</p></CaseReveal>
        <CaseReveal delay={.08}><span>02</span><p className="section-kicker">La dirección</p><h2>Objetivo</h2><p>{project.objective}</p></CaseReveal>
        <CaseReveal delay={.16}><span>03</span><p className="section-kicker">Mi aporte</p><h2>Participación</h2><p>{project.participation}</p></CaseReveal>
      </section>

      <section className="case-section architecture-case-section" id="arquitectura">
        <CaseReveal className="case-section-heading"><p className="section-kicker">Diseño técnico</p><h2>Arquitectura pensada para separar responsabilidades.</h2><p>{project.architecture}</p></CaseReveal>
        <CaseArchitecture project={project} />
      </section>

      <section className="case-section case-challenges">
        <CaseReveal className="case-section-heading"><p className="section-kicker">Ejecución</p><h2>Desafíos que guiaron las decisiones.</h2></CaseReveal>
        <div className="challenge-grid">{project.challenges.map((challenge, index) => <motion.article key={challenge} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .5, delay: index * .07 }}><span>{String(index + 1).padStart(2, "0")}</span><p>{challenge}</p></motion.article>)}</div>
      </section>

      <section className="case-section result-grid">
        <CaseReveal><p className="section-kicker">Resultado</p><h2>Una solución orientada a uso real.</h2><p>{project.result}</p></CaseReveal>
        <CaseReveal delay={.1}><p className="section-kicker">Aprendizajes</p><h2>Lo que el proyecto dejó.</h2><p>{project.learnings}</p></CaseReveal>
      </section>

      <section className="case-next"><p className="section-kicker">Siguiente caso</p><h2>Explora otra solución.</h2><Link className="button button-primary" href={project.slug === "casanet" ? "/projects/ccss" : project.slug === "ccss" ? "/projects/api-transferencias" : "/projects/casanet"}>Ver siguiente proyecto <ArrowIcon /></Link></section>
      <footer className="site-footer"><Link className="wordmark" href="/">Jonathan <span>Cascante</span></Link><div className="footer-copy"><p>Diseñado y desarrollado por Jonathan Cascante.</p><small>Costa Rica 🇨🇷</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </main>
  );
}
