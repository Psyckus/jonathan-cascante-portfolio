import Link from "next/link";
import { getDictionary, type Dictionary, type Locale } from "../i18n/config";
import { getProjects, getSkillCategories, type Project } from "../lib/projects";
import { ArrowIcon, DownloadIcon, ExternalIcon, GitHubIcon, LinkedInIcon } from "./icons";
import { BeyondCode, CopyEmail, GlowSurface, Header, HeroCode, HomeEffects, PortfolioMotion, SkillsExplorer, Timeline } from "./portfolio-interactions";
import { GitHubActivity, InteractiveTerminal } from "./premium-sections";
import { ProjectPreview } from "./project-preview";
import { StatusDot } from "./status-dot";
import { TechnologyMarquee } from "./technology-marquee";
import { ViewportEffects } from "./viewport-effects";

const email = "jonathan.cz141998@gmail.com";
const heroTechnologies = ["C# / .NET", "Python / Django", "PHP", "JavaScript / TypeScript", "React", "PostgreSQL / MySQL"];

function ProjectCard({ project, locale, copy, preview }: { project: Project; locale: Locale; copy: Dictionary["projectsSection"]; preview: Dictionary["projectPreviews"] }) {
  const href = `/${locale}/projects/${project.slug}/`;
  const featured = project.slug === "casanet";
  return (
    <article className={`project-card ${featured ? "featured" : ""}`} data-accent={project.accent} data-reveal>
      <div className="project-card-layout">
        <div className="project-visual">
          <ProjectPreview type={project.slug} copy={preview} />
        </div>
        <div className="project-content">
          <header>
            <p className="project-label">{featured ? copy.featured : project.label}</p>
            <h3>{project.title}</h3>
          </header>
          <p>{project.description}</p>
          <ul className="tag-list" role="list" aria-label={`${copy.technologiesFor} ${project.title}`}>
            {project.technologies.map((technology) => <li key={technology}><span>{technology}</span></li>)}
          </ul>
          <footer className="project-actions">
            <Link className="mini-action primary" href={href} prefetch={false} aria-label={`${copy.viewProject}: ${project.title}`}>{copy.viewProject}</Link>
            {project.demoUrl && <a className="mini-action" href={project.demoUrl} target="_blank" rel="noreferrer" aria-label={`${copy.liveDemo}: ${project.title}`}>{copy.liveDemo} <ExternalIcon size={14} /></a>}
            <Link className="mini-action" href={`${href}#arquitectura`} prefetch={false} aria-label={`${copy.architecture}: ${project.title}`}>{copy.architecture}</Link>
          </footer>
        </div>
      </div>
    </article>
  );
}

function ArchitectureShowcase({ copy }: { copy: Dictionary["architectureShowcase"] }) {
  const integrations = ["Redis", "SignalR", "SMTP", "OAuth"];
  return (
    <div className="architecture-showcase" data-reveal>
      <div className="architecture-copy"><p className="section-kicker">{copy.kicker}</p><h3>{copy.title}</h3><p>{copy.description}</p></div>
      <div className="system-diagram" aria-label={copy.aria}>
        <div className="main-flow">
          {copy.nodes.map((node, index) => (
            <div className="diagram-step" key={node}>
              <span>{node}<small>{index === 0 ? copy.entry : index === copy.nodes.length - 1 ? copy.data : copy.layer}</small></span>
              {index < copy.nodes.length - 1 && <i><b /></i>}
            </div>
          ))}
        </div>
        <div className="integration-grid">{integrations.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
    </div>
  );
}

function LearningBlock({ copy }: { copy: Dictionary["learning"] }) {
  return (
    <div className="learning-block" data-reveal>
      <div><p className="section-kicker">{copy.kicker}</p><h3>{copy.title}</h3><p>{copy.description}</p></div>
      <div className="learning-list">{copy.topics.map((topic) => (
        <div className="learning-item" key={topic.name}><i aria-hidden="true" /><span><b>{topic.name}</b><small>{topic.description}</small></span><em>{copy.status}</em></div>
      ))}</div>
    </div>
  );
}

function EngineeringDecisions({ copy }: { copy: Dictionary["engineering"] }) {
  return (
    <section className="engineering-section" aria-labelledby="engineering-title" data-reveal>
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3 id="engineering-title">{copy.title}</h3></div>
        <p>{copy.description}</p>
      </div>
      <div className="engineering-grid">
        {copy.decisions.map((decision, index) => (
          <article key={decision.technology}><span>{String(index + 1).padStart(2, "0")}</span><h4>{decision.question}</h4><i aria-hidden="true">↓</i><p>{decision.answer}</p><small>{decision.signal}</small></article>
        ))}
      </div>
    </section>
  );
}

function WorkProcess({ copy }: { copy: Dictionary["workProcess"] }) {
  return (
    <section className="work-process" aria-labelledby="work-process-title" data-reveal data-animate-when-visible>
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3 id="work-process-title">{copy.title}</h3></div>
        <p>{copy.description}</p>
      </div>
      <div className="work-process-track" role="list">
        {copy.steps.map((step) => <div role="listitem" key={step.title}><span>{step.index}</span><i aria-hidden="true" /><h4>{step.title}</h4><p>{step.detail}</p></div>)}
      </div>
    </section>
  );
}

function Contact({ copy, cv }: { copy: Dictionary["contact"]; cv: string }) {
  return (
    <GlowSurface className="contact-section" id="contacto">
      <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
      <div className="contact-copy" data-reveal>
        <p className="section-kicker">{copy.kicker}</p><h2>{copy.title}</h2><p>{copy.description}</p>
        <a className="contact-email" href={`mailto:${email}`}>{email}</a>
        <div className="contact-actions premium-actions">
          <a className="button button-primary" href={`mailto:${email}`}>{copy.write}</a>
          <CopyEmail email={email} copy={copy} />
          <a className="button button-secondary" href={cv} download><DownloadIcon />{copy.download}</a>
          <a className="text-link platform-link linkedin-link" href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer"><LinkedInIcon /> LinkedIn</a>
          <a className="text-link platform-link github-link" href="https://github.com/Psyckus" target="_blank" rel="noreferrer"><GitHubIcon /> GitHub</a>
        </div>
      </div>
    </GlowSurface>
  );
}

export function PortfolioHome({ locale }: { locale: Locale }) {
  const dictionary = getDictionary(locale);
  const { hero, academic, philosophy, portfolioStats, projectsSection } = dictionary;
  const projects = getProjects(dictionary);
  const categories = getSkillCategories(dictionary);
  const technologyCount = categories.reduce((count, category) => count + category.skills.length, 0);
  const cv = locale === "es" ? "/CV_ES.pdf" : "/CV_EN.pdf";
  const stats = [
    { value: technologyCount, label: portfolioStats.technologies },
    { value: projects.length, label: projectsSection.mainProjects },
    { value: projects.filter((project) => project.demoUrl).length, label: portfolioStats.publicDemos },
  ];

  return (
    <main>
      <a className="skip-link" href="#main-content">{dictionary.nav.skip}</a>
      <ViewportEffects />
      <PortfolioMotion>
        <HomeEffects message={hero.easterEgg} />
        <div className="ambient-particles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <Header locale={locale} copy={dictionary.nav} language={dictionary.language} />
        <GlowSurface className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span />{hero.eyebrow}</p>
            <h1 id="main-content" tabIndex={-1}>{hero.headlineStart} <em>{hero.headlineIdea}</em> {hero.headlineJoin} <em>{hero.headlineResult}</em></h1>
            <p className="role">{hero.role.split(" · ").map((part, index, parts) => <span key={part}>{part}{index < parts.length - 1 && <b> · </b>}</span>)}</p>
            <p className="intro">{hero.intro}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#proyectos">{hero.viewProjects} <ArrowIcon /></a>
              <a className="button button-secondary" href={cv} download><DownloadIcon />{dictionary.contact.download}</a>
              <a className="text-link hero-contact" href="#contacto">{dictionary.contact.write}</a>
            </div>
            <div className="skill-row" aria-label={hero.skillsLabel}>{heroTechnologies.map((skill) => <span className="skill-chip" key={skill}><i aria-hidden="true" /> {skill}</span>)}</div>
            <div className="hero-signals" aria-label={hero.statusLabel}><span><StatusDot />{hero.available}</span><span>{hero.open}</span><span>{hero.focus}</span></div>
          </div>
          <HeroCode copy={hero.panel} />
        </GlowSurface>

        <GlowSurface className="section projects-section" id="proyectos">
          <div className="section-heading" data-reveal><div><p className="section-kicker">{projectsSection.kicker}</p><h2>{projectsSection.title}</h2></div><p>{projectsSection.description}</p></div>
          <div className="project-list">{projects.map((project) => <ProjectCard project={project} locale={locale} copy={projectsSection} preview={dictionary.projectPreviews} key={project.slug} />)}</div>
          <ArchitectureShowcase copy={dictionary.architectureShowcase} />
        </GlowSurface>

        <section className="portfolio-stats" aria-label={portfolioStats.aria} data-reveal>
          {stats.map(({ value, label }) => <span key={label}><strong>{value}</strong><small>{label}</small></span>)}
        </section>

        <section className="section profile-section" id="habilidades">
          <div className="section-heading compact" data-reveal><div><p className="section-kicker">{dictionary.skillsSection.kicker}</p><h2>{dictionary.skillsSection.title}</h2></div><p>{dictionary.skillsSection.description}</p></div>
          <SkillsExplorer copy={dictionary.skillsSection} locale={locale} skillCategories={categories} />
          <TechnologyMarquee copy={dictionary.marquee} categories={categories} />
          <LearningBlock copy={dictionary.learning} />
          <EngineeringDecisions copy={dictionary.engineering} />
          <WorkProcess copy={dictionary.workProcess} />
          <div className="academic" id="experiencia">
            <div className="academic-intro" data-reveal><p className="section-kicker">{academic.kicker}</p><h2>{academic.title}</h2><p>{academic.description}</p><div className="availability"><StatusDot size="md" /> {academic.availability}</div><div className="academic-badges" aria-label={academic.badgesLabel}>{academic.badges.map((badge) => <span key={badge}><b>✓</b>{badge}</span>)}</div></div>
            <Timeline journey={academic.journey} />
          </div>
          <BeyondCode copy={dictionary.beyond} />
          <div className="philosophy-block" data-reveal>
            <p className="section-kicker">{philosophy.kicker}</p><blockquote>{philosophy.quote}</blockquote>
            <div className="philosophy-signals">{philosophy.signals.map((signal) => <span key={signal}><i />{signal}</span>)}</div>
          </div>
          <GitHubActivity copy={dictionary.github} />
        </section>

        <InteractiveTerminal copy={dictionary.terminal} categories={categories} cv={cv} />
        <Contact copy={dictionary.contact} cv={cv} />
        <footer className="site-footer"><a className="wordmark" href="#inicio">Jonathan <span>Cascante</span></a><div className="footer-copy"><p>{dictionary.footer.designed}</p><small>{dictionary.footer.location}</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
      </PortfolioMotion>
    </main>
  );
}
