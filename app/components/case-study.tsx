import Link from "next/link";
import { getProjectBySlug, type Project, type ProjectSlug } from "../lib/projects";
import { getDictionary, type Dictionary, type Locale } from "../i18n/config";
import { ViewportEffects } from "./viewport-effects";
import { ArrowIcon, ExternalIcon } from "./icons";
import { LanguageSwitcher } from "./language-switcher";
import { ProjectPreview } from "./project-preview";

function CaseReveal({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className} data-reveal>{children}</div>;
}

function CaseArchitecture({ project, copy }: { project: Project; copy: Dictionary["caseStudy"] }) {
  return (
    <div className="case-architecture" aria-label={`${copy.architectureFor} ${project.title}`}>
      <div className="case-main-flow">
        {project.flow.map((node, index) => (
          <div className="case-node-wrap" key={node}>
            <span data-reveal>{node}<small>{index === 0 ? copy.entry : index === project.flow.length - 1 ? copy.persistence : `${copy.layer} ${index}`}</small></span>
            {index < project.flow.length - 1 && <i data-reveal><b /></i>}
          </div>
        ))}
      </div>
      <div className="case-integrations"><p>{copy.connectedServices}</p><div>{project.integrations.map((item) => <span key={item} data-reveal>{item}</span>)}</div></div>
    </div>
  );
}

export function CaseStudy({ locale, projectSlug }: { locale: Locale; projectSlug: ProjectSlug }) {
  const dictionary = getDictionary(locale);
  const project = getProjectBySlug(dictionary, projectSlug);
  const copy = dictionary.caseStudy;
  const nextSlug = project.slug === "casanet" ? "ccss" : project.slug === "ccss" ? "api-transferencias" : "casanet";
  return (
    <main className="case-page">
      <a className="skip-link" href="#main-content">{dictionary.nav.skip}</a>
      <ViewportEffects />
      <div className="case-header-shell"><header className="case-header"><Link className="wordmark" href={`/${locale}/#inicio`}>Jonathan <span>Cascante</span></Link><div className="case-header-actions"><Link className="back-link" href={`/${locale}/#proyectos`}><span>←</span> {copy.back}</Link><LanguageSwitcher locale={locale} copy={dictionary.language} projectSlug={projectSlug} /></div></header></div>

      <section className={`case-hero ${project.accent}`}>
        <CaseReveal className="case-hero-copy">
          <p className="project-label">{copy.case} · {project.index}</p>
          <h1 id="main-content" tabIndex={-1}>{project.title}</h1>
          <p>{project.description}</p>
          <div className="tag-list">{project.technologies.map((tech) => <span key={tech}>{tech}</span>)}</div>
          <div className="case-actions">
            {project.demoUrl && <a className="button button-primary" href={project.demoUrl} target="_blank" rel="noreferrer">{copy.openDemo} <ExternalIcon /></a>}
            <a className={`button ${project.demoUrl ? "button-secondary" : "button-primary"}`} href="#arquitectura">{copy.viewArchitecture} <ArrowIcon /></a>
          </div>
        </CaseReveal>
        <CaseReveal className="case-preview"><ProjectPreview type={project.slug} copy={dictionary.projectPreviews} /></CaseReveal>
      </section>

      <section className="case-section case-overview">
        <CaseReveal><p className="section-kicker">{copy.context}</p><h2>{copy.problem}</h2><p>{project.problem}</p></CaseReveal>
        <CaseReveal><p className="section-kicker">{copy.contribution}</p><h2>{copy.participation}</h2><p>{project.participation}</p></CaseReveal>
        <CaseReveal><p className="section-kicker">{copy.result}</p><h2>{copy.resultTitle}</h2><p>{project.result}</p></CaseReveal>
      </section>

      <section className="case-section architecture-case-section" id="arquitectura">
        <CaseReveal className="case-section-heading"><p className="section-kicker">{copy.technicalDesign}</p><h2>{copy.architectureTitle}</h2><p>{project.architecture}</p></CaseReveal>
        <CaseArchitecture project={project} copy={copy} />
      </section>

      <section className="case-section case-challenges">
        <CaseReveal className="case-section-heading"><p className="section-kicker">{copy.execution}</p><h2>{copy.challengesTitle}</h2></CaseReveal>
        <div className="challenge-grid">{project.challenges.map((challenge, index) => <article key={challenge} data-reveal><span>{String(index + 1).padStart(2, "0")}</span><p>{challenge}</p></article>)}</div>
      </section>

      <section className="case-section result-grid">
        <CaseReveal><p className="section-kicker">{copy.direction}</p><h2>{copy.objective}</h2><p>{project.objective}</p></CaseReveal>
        <CaseReveal><p className="section-kicker">{copy.learnings}</p><h2>{copy.learningsTitle}</h2><p>{project.learnings}</p></CaseReveal>
      </section>

      <section className="case-next"><p className="section-kicker">{copy.next}</p><h2>{copy.nextTitle}</h2><Link className="button button-primary" href={`/${locale}/projects/${nextSlug}/`}>{copy.nextProject} <ArrowIcon /></Link></section>
      <footer className="site-footer"><Link className="wordmark" href={`/${locale}/`}>Jonathan <span>Cascante</span></Link><div className="footer-copy"><p>{dictionary.footer.designed}</p><small>{dictionary.footer.location}</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </main>
  );
}
