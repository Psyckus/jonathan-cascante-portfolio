"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon, CheckIcon, CopyIcon, DownloadIcon, ExternalIcon, TechIcon, type TechType } from "./icons";
import { ProjectPreview } from "./project-preview";
import { projects, skillCategories, skills, type Project, type Skill } from "../lib/projects";

const EMAIL = "jonathan.cz141998@gmail.com";
const sections = ["proyectos", "habilidades", "experiencia", "contacto"];
const introMessages = ["Initializing Portfolio...", "Loading Projects...", "Connecting APIs...", "Ready."];
const learningTopics = ["Arquitectura limpia", "Microservicios", "Docker", "Kubernetes", "Azure", "Inteligencia Artificial"];
const academicBadges = ["Desarrollo Full Stack", "APIs REST", "Backend", "Bases de datos", "Arquitectura", "Documentación técnica", "Validación con usuarios", "Trabajo en equipo"];
const journey = [
  { date: "2021", title: "Diplomado en Tecnologías de Información", text: "Construí una base técnica en programación, bases de datos, soporte y redes." },
  { date: "2023", title: "Inicio de Ingeniería Informática", text: "Amplié mi formación hacia análisis, arquitectura y desarrollo de soluciones." },
  { date: "2023", title: "Proyecto PHP · CCSS", text: "Desarrollé módulos administrativos con reglas reales, trazabilidad y reportes." },
  { date: "2025", title: "Proyecto ASP.NET Core", text: "Profundicé en C#, MVC, servicios, repositorios, seguridad e integraciones." },
  { date: "2026", title: "Proyecto de graduación", text: "Validé una solución institucional con usuarios, documentación y pruebas funcionales." },
  { date: "Actualidad", title: "Buscando oportunidades Full Stack", text: "Busco aportar en equipos donde pueda construir software útil y seguir creciendo." },
];
const beyondCode = [
  { icon: "🎮", title: "Videojuegos", text: "Disfruto los videojuegos porque me permiten analizar mecánicas, lógica y resolución de problemas." },
  { icon: "🚴", title: "Ciclismo", text: "Me gusta recorrer nuevos caminos y despejar la mente." },
  { icon: "🏔", title: "Naturaleza", text: "Disfruto visitar montañas, ríos y lugares naturales." },
  { icon: "📚", title: "Aprendizaje continuo", text: "Siempre estoy explorando nuevas tecnologías y mejores prácticas de desarrollo." },
];

const heroModes: Record<TechType, { label: string; path: string; code: string; flow: string[] }> = {
  api: {
    label: "API",
    path: "~/portfolio/api",
    code: `public class ProjectsController : ControllerBase\n{\n  private readonly IProjectService _service;\n\n  [HttpGet("api/projects")]\n  public async Task<IActionResult> Get()\n  {\n    var data = await _service.GetAllAsync();\n    return Ok(data);\n  }\n}`,
    flow: ["CLIENTE", "API .NET 8", "SERVICE", "JSON"],
  },
  db: {
    label: "DB",
    path: "~/portfolio/data",
    code: `public async Task<Project?> FindAsync(int id)\n{\n  const string sql = """\n    SELECT id, title, status\n    FROM projects\n    WHERE id = @id;\n  """;\n\n  return await connection\n    .QuerySingleOrDefaultAsync<Project>(sql, new { id });\n}`,
    flow: ["SERVICE", "DAPPER", "MYSQL", "RESULT"],
  },
  service: {
    label: "SERVICE",
    path: "~/portfolio/services",
    code: `public async Task<ProjectDto> PublishAsync(Command cmd)\n{\n  await validator.ValidateAndThrowAsync(cmd);\n\n  var project = Project.Create(cmd);\n  await repository.SaveAsync(project);\n  await notifier.ProjectPublished(project.Id);\n\n  return mapper.ToDto(project);\n}`,
    flow: ["COMMAND", "VALIDATE", "BUSINESS", "EVENT"],
  },
  deploy: {
    label: "DEPLOY",
    path: "~/portfolio/pipeline",
    code: `name: deploy-production\n\non:\n  push:\n    branches: [main]\n\njobs:\n  release:\n    steps:\n      - run: dotnet test\n      - run: dotnet publish -c Release\n      - run: deploy --environment production\n      - run: healthcheck --wait`,
    flow: ["COMMIT", "TEST", "BUILD", "CLOUD"],
  },
};

function useScrollSpy() {
  const [active, setActive] = useState("proyectos");
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setCompact(window.scrollY > 48);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0.08, 0.25, 0.5] },
    );
    sections.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return { active, compact };
}

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 24, filter: "blur(10px)" }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function GlowSurface({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const frame = useRef(0);

  const move = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch" || !ref.current) return;
    const { clientX, clientY } = event;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--mouse-x", `${clientX - rect.left}px`);
      ref.current.style.setProperty("--mouse-y", `${clientY - rect.top}px`);
    });
  }, [reduced]);

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  return <section ref={ref} id={id} className={`glow-surface ${className}`} onPointerMove={move}>{children}</section>;
}

function IntroOverlay() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced || sessionStorage.getItem("portfolio-intro")) return;
    sessionStorage.setItem("portfolio-intro", "seen");
    const timers = [window.setTimeout(() => setShow(true), 0)];
    introMessages.forEach((_, index) => timers.push(window.setTimeout(() => setStep(index), index * 210)));
    timers.push(window.setTimeout(() => setShow(false), 940));
    return () => timers.forEach(window.clearTimeout);
  }, [reduced]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="intro-overlay" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .22 }} aria-live="polite">
          <div><span>&gt;_</span><AnimatePresence mode="wait"><motion.code key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .12 }}>{introMessages[step]}</motion.code></AnimatePresence></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Header() {
  const { active, compact } = useScrollSpy();
  return (
    <div className={`header-shell ${compact ? "compact" : ""}`}>
      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Jonathan Cascante, inicio">Jonathan <span>Cascante</span></a>
        <nav aria-label="Navegación principal">
          {sections.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""}>
              {id === "proyectos" ? "Proyectos" : id === "habilidades" ? "Habilidades" : id === "experiencia" ? "Experiencia" : "Contacto"}
              {active === id && <motion.span className="active-indicator" layoutId="nav-active" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
            </a>
          ))}
        </nav>
      </header>
    </div>
  );
}

function highlightLine(line: string) {
  const tokens = line.split(/(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|\[HttpGet|\]|"[^"]*"|@\w+)/g);
  return tokens.map((token, index) => {
    const hot = /^(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|\[HttpGet|\])$/.test(token);
    const string = /^"|^@/.test(token);
    return <span key={`${token}-${index}`} className={hot ? "syntax-hot" : string ? "syntax-string" : ""}>{token}</span>;
  });
}

function HeroCode() {
  const [mode, setMode] = useState<TechType>("api");
  const [chars, setChars] = useState(0);
  const reduced = useReducedMotion();
  const config = heroModes[mode];

  useEffect(() => {
    if (reduced) {
      const timer = window.setTimeout(() => setChars(config.code.length), 0);
      return () => window.clearTimeout(timer);
    }
    const reset = window.setTimeout(() => setChars(0), 0);
    const start = performance.now();
    let frame = 0;
    const type = (time: number) => {
      const next = Math.min(config.code.length, Math.floor((time - start) / 10.5));
      setChars(next);
      if (next < config.code.length) frame = requestAnimationFrame(type);
    };
    frame = requestAnimationFrame(type);
    return () => {
      window.clearTimeout(reset);
      cancelAnimationFrame(frame);
    };
  }, [config.code, reduced]);

  const visibleLines = useMemo(() => config.code.slice(0, chars).split("\n"), [config.code, chars]);
  return (
    <motion.div className="architecture" layout aria-label={`Vista interactiva: ${config.label}`}>
      <div className="terminal-bar"><span /><span /><span /><AnimatePresence mode="wait"><motion.code key={config.path} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{config.path}</motion.code></AnimatePresence></div>
      <div className="architecture-body">
        <aside role="tablist" aria-label="Capas de la solución">
          {(Object.keys(heroModes) as TechType[]).map((key) => (
            <button type="button" role="tab" aria-selected={mode === key} className={mode === key ? "active" : ""} onClick={() => setMode(key)} key={key}>
              <TechIcon type={key} /><small>{heroModes[key].label}</small>
            </button>
          ))}
        </aside>
        <div className="code-window" aria-live="polite">
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleLines.map((line, index) => (
              <motion.div key={`${mode}-${index}`} initial={reduced ? false : { opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .18 }}>
                <span className="line">{String(index + 1).padStart(2, "0")}</span>
                <code>{highlightLine(line)}{index === visibleLines.length - 1 && chars < config.code.length && <i className="typing-cursor" />}</code>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="architecture-flow" key={mode} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .32 }} aria-hidden="true">
          {config.flow.map((node, index) => (
            <div className="flow-unit" key={node}>
              <span className={index === 1 ? "primary-node" : ""}>{node}</span>
              {index < config.flow.length - 1 && <i className="flow-link"><b /></i>}
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch" || !card.current) return;
    const { clientX, clientY } = event;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!card.current) return;
      const rect = card.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - .5;
      const y = (clientY - rect.top) / rect.height - .5;
      card.current.style.setProperty("--card-x", `${x * 5}deg`);
      card.current.style.setProperty("--card-y", `${y * -4}deg`);
      card.current.style.setProperty("--glow-x", `${clientX - rect.left}px`);
      card.current.style.setProperty("--glow-y", `${clientY - rect.top}px`);
    });
  };
  const reset = () => {
    if (!card.current) return;
    card.current.style.setProperty("--card-x", "0deg");
    card.current.style.setProperty("--card-y", "0deg");
  };
  return (
    <motion.article
      ref={card}
      className="project-card"
      onPointerMove={onMove}
      onPointerLeave={reset}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .2 }}
      transition={{ duration: .65, delay: index * .09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -4 }}
    >
      <div className={`project-visual ${project.accent}`}>
        <span>{project.index}</span>
        <div className="project-mark"><b>{project.mark}</b></div>
        <div className="preview-reveal"><ProjectPreview type={project.slug} /></div>
        <div className="visual-lines"><i /><i /><i /></div>
      </div>
      <div className="project-content">
        <p className="project-label">{project.label}</p>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-list" aria-label={`Tecnologías de ${project.title}`}>{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
        <div className="project-actions">
          <Link className="mini-action primary" href={`/projects/${project.slug}`}>Ver proyecto <ArrowIcon size={16} /></Link>
          <Link className="mini-action" href={`/projects/${project.slug}#arquitectura`}>Arquitectura</Link>
          <a className="mini-action" href={project.githubUrl} target="_blank" rel="noreferrer">GitHub <ExternalIcon size={14} /></a>
          {project.demoUrl ? <a className="mini-action" href={project.demoUrl} target="_blank" rel="noreferrer">Demo <ExternalIcon size={14} /></a> : <span className="mini-action disabled" aria-label="Demo privada">Demo privada</span>}
        </div>
      </div>
    </motion.article>
  );
}

function ArchitectureShowcase() {
  const reduced = useReducedMotion();
  const nodes = ["Usuario", "MVC", "Service", "Repository", "MySQL"];
  const integrations = ["Redis", "SignalR", "SMTP", "OAuth"];
  return (
    <Reveal className="architecture-showcase">
      <div className="architecture-copy"><p className="section-kicker">Arquitectura viva</p><h3>Una solución completa, capa por capa.</h3><p>El flujo muestra cómo una acción del usuario atraviesa la aplicación y activa servicios especializados sin acoplar responsabilidades.</p></div>
      <div className="system-diagram" aria-label="Diagrama de arquitectura por capas">
        <div className="main-flow">
          {nodes.map((node, index) => <div className="diagram-step" key={node}><motion.span initial={reduced ? false : { opacity: 0, scale: .96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: index * .09 }}>{node}<small>{index === 0 ? "Entrada" : index === nodes.length - 1 ? "Datos" : "Capa"}</small></motion.span>{index < nodes.length - 1 && <motion.i initial={reduced ? false : { scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: .12 + index * .09, duration: .42 }}><b /></motion.i>}</div>)}
        </div>
        <div className="integration-grid">{integrations.map((item, index) => <motion.span key={item} initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: .4 + index * .07 }}>{item}</motion.span>)}</div>
      </div>
    </Reveal>
  );
}

function AnimatedCounter({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: .8 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible || reduced) return;
    const start = performance.now();
    let frame = 0;
    const animate = (time: number) => {
      const progress = Math.min(1, (time - start) / 850);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, value, visible]);

  return <span ref={ref}><b>{reduced ? value : count}{suffix}</b><small>{label}</small></span>;
}

function SkillsExplorer() {
  const [selected, setSelected] = useState(skills[0]);
  const reduced = useReducedMotion();
  return (
    <div className="skills-explorer">
      <div className="skill-catalog" aria-label="Tecnologías agrupadas por categoría">
        {skillCategories.map((category, categoryIndex) => (
          <div className="skill-category" key={category.id}>
            <div className="skill-category-heading"><span>{String(categoryIndex + 1).padStart(2, "0")}</span><div><h3>{category.label}</h3><p>{category.description}</p></div></div>
            <div className="skill-selector" role="group" aria-label={category.label}>
              {category.skills.map((skill) => <button type="button" aria-pressed={selected.name === skill.name} className={selected.name === skill.name ? "selected" : ""} onMouseEnter={() => setSelected(skill)} onFocus={() => setSelected(skill)} onClick={() => setSelected(skill)} key={skill.name}>{skill.name}<span /></button>)}
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div className="skill-detail" aria-live="polite" key={selected.name} initial={reduced ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .28 }}>
          <div><p className="section-kicker">Tecnología seleccionada</p><h3>{selected.name}</h3><dl><div><dt>Dónde la utilicé</dt><dd>{selected.context}</dd></div><div><dt>Proyecto</dt><dd>{selected.project}</dd></div><div><dt>Para qué la utilicé</dt><dd>{selected.use}</dd></div></dl></div>
          {selected.preview ? <ProjectPreview type={selected.preview} compact /> : <SkillContextPreview skill={selected} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SkillContextPreview({ skill }: { skill: Skill }) {
  return (
    <div className="skill-context-preview" role="img" aria-label={`Contexto de uso de ${skill.name}`}>
      <div className="preview-top"><i /><span>~/skills/{skill.name.toLowerCase().replaceAll(" ", "-")}</span><small>uso real</small></div>
      <div className="skill-code-body"><span>01</span><code><b>technology</b>: &quot;{skill.name}&quot;</code><span>02</span><code><b>context</b>: &quot;{skill.context}&quot;</code><span>03</span><code><b>project</b>: &quot;{skill.project}&quot;</code><span>04</span><code><b>purpose</b>: &quot;software que genera valor&quot;</code><i className="skill-code-cursor" /></div>
    </div>
  );
}

function LearningBlock() {
  const reduced = useReducedMotion();
  return (
    <Reveal className="learning-block">
      <div><p className="section-kicker">Evolución constante</p><h3>Actualmente aprendiendo</h3><p>Temas que estoy fortaleciendo para diseñar soluciones más mantenibles, distribuidas y preparadas para la nube.</p></div>
      <div className="learning-list">{learningTopics.map((topic, index) => <motion.span key={topic} initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><i />{topic}</motion.span>)}</div>
    </Reveal>
  );
}

function BeyondCode() {
  return (
    <Reveal className="beyond-code">
      <div className="mini-section-heading"><div><p className="section-kicker">Más allá del código</p><h3>La curiosidad también se entrena fuera de la pantalla.</h3></div><p>Intereses que aportan perspectiva, equilibrio y nuevas formas de resolver problemas.</p></div>
      <div className="beyond-grid">{beyondCode.map((item, index) => <motion.article key={item.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .45 }} transition={{ delay: index * .06 }}><span aria-hidden="true">{item.icon}</span><h4>{item.title}</h4><p>{item.text}</p></motion.article>)}</div>
    </Reveal>
  );
}

function Philosophy() {
  return (
    <Reveal className="philosophy-block">
      <p className="section-kicker">Cómo pienso el desarrollo</p>
      <blockquote>“No me gusta desarrollar únicamente código. Me gusta entender el problema, diseñar una solución limpia y construir software que realmente genere valor.”</blockquote>
      <div className="philosophy-signals"><span><i />Apasionado por construir software</span><span><i />Enfoque backend</span><span><i />Aprendizaje continuo</span></div>
    </Reveal>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    const fallback = () => {
      const helper = document.createElement("textarea");
      helper.value = EMAIL;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    };
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(EMAIL);
      else fallback();
    } catch {
      fallback();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  return (
    <GlowSurface className="contact-section" id="contacto">
      <div className="contact-orbit" aria-hidden="true"><i /><i /><i /></div>
      <Reveal className="contact-copy">
        <p className="section-kicker">Hablemos</p><h2>¿Tienes una oportunidad o un proyecto en mente?</h2>
        <p>Estoy disponible para roles junior de desarrollo de software y para colaborar en productos web donde pueda aportar con C#, .NET y APIs.</p>
        <div className="contact-actions premium-actions">
          <button type="button" className={`button button-primary ${copied ? "success" : ""}`} onClick={copyEmail}>{copied ? <CheckIcon /> : <CopyIcon />}{copied ? "Correo copiado ✓" : "Copiar correo"}</button>
          <a className="button button-secondary" href="/Jonathan-Cascante-CV.pdf" download><DownloadIcon /> Descargar CV</a>
          <a className="text-link" href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn <ExternalIcon /></a>
          <a className="text-link" href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub <ExternalIcon /></a>
        </div>
      </Reveal>
    </GlowSurface>
  );
}

export function PortfolioHome() {
  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4);
    if (lowPower) document.documentElement.dataset.motionProfile = "reduced-effects";
    return () => { delete document.documentElement.dataset.motionProfile; };
  }, []);

  return (
    <main>
      <IntroOverlay />
      <div className="ambient-particles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <Header />
      <GlowSurface className="hero" id="inicio">
        <Reveal className="hero-copy">
          <p className="eyebrow"><span /> Full Stack Developer · Costa Rica</p>
          <h1>Construyo soluciones web que conectan <em>ideas</em> con <em>resultados.</em></h1>
          <p className="role">C# / .NET <b>·</b> APIs REST <b>·</b> Aplicaciones empresariales</p>
          <p className="intro">Transformo necesidades reales en productos confiables: backend robusto, interfaces claras y una arquitectura preparada para crecer.</p>
          <div className="hero-actions"><a className="button button-primary" href="#proyectos">Ver proyectos <ArrowIcon /></a><a className="button button-secondary" href="#contacto">Contactarme <ArrowIcon /></a></div>
          <div className="skill-row" aria-label="Tecnologías principales">{[".NET 8", "ASP.NET Core", "C#", "MySQL", "JavaScript"].map((skill) => <span className="skill-chip" key={skill}><i aria-hidden="true" /> {skill}</span>)}</div>
          <div className="hero-signals" aria-label="Estado profesional"><span><i />Disponible de inmediato</span><span>Abierto a oportunidades</span><span>Backend & APIs</span></div>
        </Reveal>
        <HeroCode />
      </GlowSurface>

      <GlowSurface className="section projects-section" id="proyectos">
        <Reveal className="section-heading"><div><p className="section-kicker">Trabajo seleccionado</p><h2>Proyectos que resuelven problemas reales.</h2></div><p>Cada proyecto combina decisiones técnicas con una necesidad concreta: organizar procesos, reducir fricción y entregar información confiable.</p></Reveal>
        <Reveal className="project-stats" delay={.05}><AnimatedCounter value={3} label="Proyectos principales" /><AnimatedCounter value={12} suffix="+" label="Integraciones aplicadas" /><AnimatedCounter value={3} label="Casos de estudio" /></Reveal>
        <div className="project-list">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
        <ArchitectureShowcase />
      </GlowSurface>

      <section className="section profile-section" id="habilidades">
        <Reveal className="section-heading compact"><div><p className="section-kicker">Capacidades</p><h2>De la base de datos a la interfaz.</h2></div><p>Selecciona una tecnología para ver dónde la aplico y qué valor aporta dentro de una solución real.</p></Reveal>
        <Reveal delay={.08}><SkillsExplorer /></Reveal>
        <LearningBlock />
        <div className="academic" id="experiencia">
          <Reveal className="academic-intro"><p className="section-kicker">Experiencia académica</p><h2>Formación aplicada a escenarios reales.</h2><p>Mi experiencia se ha construido desarrollando soluciones completas, documentando procesos y validando resultados con usuarios reales.</p><div className="availability"><i /> Disponibilidad inmediata</div><div className="academic-badges" aria-label="Competencias aplicadas">{academicBadges.map((badge) => <span key={badge}><b>✓</b>{badge}</span>)}</div></Reveal>
          <ol className="timeline">
            {journey.map((item, index) => <motion.li key={`${item.date}-${item.title}`} initial={{ opacity: 0, x: 16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .48, delay: index * .06 }}><span>{item.date}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></motion.li>)}
          </ol>
        </div>
        <BeyondCode />
        <Philosophy />
      </section>

      <Contact />
      <footer className="site-footer"><a className="wordmark" href="#inicio">Jonathan <span>Cascante</span></a><div className="footer-copy"><p>Diseñado y desarrollado por Jonathan Cascante.</p><p>Construido con React, TypeScript y Framer Motion.</p><small>Costa Rica 🇨🇷</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </main>
  );
}
