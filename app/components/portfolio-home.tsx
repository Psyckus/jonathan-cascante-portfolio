"use client";

import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowIcon, CheckIcon, CopyIcon, DownloadIcon, ExternalIcon, GitHubIcon, LinkedInIcon, TechIcon, type TechType } from "./icons";
import { ProjectPreview } from "./project-preview";
import { EngineeringDecisions, GitHubActivity, InteractiveTerminal, PortfolioStats, WorkProcess } from "./premium-sections";
import { StatusDot } from "./status-dot";
import { TechnologyMarquee } from "./technology-marquee";
import { projects, skillCategories, skills, type Project, type Skill } from "../lib/projects";

const EMAIL = "jonathan.cz141998@gmail.com";
const navigationSections = ["proyectos", "habilidades", "experiencia", "contacto"] as const;
const observedSections = ["inicio", ...navigationSections] as const;
type SectionId = (typeof observedSections)[number];
const introMessages = ["Initializing Portfolio...", "Loading Components...", "Loading Projects...", "Loading Skills...", "Done."];
const learningTopics = [
  { name: "Arquitectura limpia", description: "Separación de responsabilidades y mantenibilidad." },
  { name: "Microservicios", description: "Diseño de servicios independientes y escalables." },
  { name: "Docker", description: "Contenedores y entornos reproducibles." },
  { name: "Kubernetes", description: "Orquestación y despliegue." },
  { name: "Azure", description: "Servicios cloud y publicación." },
  { name: "Inteligencia Artificial", description: "Integración de modelos y automatización." },
];
const academicBadges = ["Desarrollo Full Stack", "APIs REST", "Backend", "Bases de datos", "Arquitectura", "Documentación técnica", "Validación con usuarios", "Trabajo en equipo"];
const journey = [
  { date: "2021", title: "Diplomado en Tecnologías de Información", text: "Construí una base técnica en programación, bases de datos, soporte y redes." },
  { date: "2023", title: "Proyecto PHP · CCSS", text: "Desarrollé módulos administrativos con reglas reales, trazabilidad y reportes." },
  { date: "2023", title: "Inicio de Ingeniería Informática", text: "Amplié mi formación hacia análisis, arquitectura y desarrollo de soluciones." },
  { date: "2025", title: "Proyecto ASP.NET Core", text: "Profundicé en C#, MVC, servicios, repositorios, seguridad e integraciones." },
  { date: "2026", title: "Proyecto de graduación", text: "Validé una solución institucional con usuarios, documentación y pruebas funcionales." },
  { date: "Actualidad", title: "Buscando oportunidades Full Stack", text: "Busco aportar en equipos donde pueda construir software útil y seguir creciendo." },
];
const beyondCode = [
  { theme: "gaming", index: "01", label: "Play / Think", title: "Videojuegos", signal: "Estrategia + intuición", text: "Analizo mecánicas, sistemas y decisiones. Cada partida es otra forma de entrenar la lógica y resolver problemas." },
  { theme: "cycling", index: "02", label: "Move / Reset", title: "Ciclismo", signal: "Ritmo + claridad", text: "Recorrer nuevos caminos me ayuda a despejar la mente, recuperar perspectiva y volver con ideas más claras." },
  { theme: "nature", index: "03", label: "Explore / Breathe", title: "Naturaleza", signal: "Perspectiva + equilibrio", text: "Montañas, ríos y senderos me recuerdan el valor de observar, explorar con calma y disfrutar el proceso." },
  { theme: "learning", index: "04", label: "Learn / Build", title: "Aprendizaje continuo", signal: "Curiosidad + práctica", text: "Exploro tecnologías y mejores prácticas para transformar conocimiento nuevo en software más simple y sólido." },
] as const;

const beyondContext: Record<(typeof beyondCode)[number]["theme"], string> = {
  gaming: "Estrategia, lógica y toma de decisiones en entornos interactivos.",
  cycling: "Movimiento, constancia y claridad para volver con nuevas ideas.",
  nature: "Perspectiva, equilibrio y espacios para observar con calma.",
  learning: "Curiosidad constante para construir soluciones cada vez mejores.",
};

type SkillPerspective = { choice: string; learning: string; mastery: string };
const categoryPerspectives: Record<(typeof skillCategories)[number]["id"], SkillPerspective> = {
  backend: { choice: "Por el control del flujo, el tipado y la facilidad para separar responsabilidades.", learning: "Diseñar contratos claros, aislar reglas de negocio y tratar los errores como parte del producto.", mastery: "Intermedio · aplicación práctica" },
  frontend: { choice: "Porque permitía construir una interfaz clara sin ocultar el comportamiento real del sistema.", learning: "Diseñar estados predecibles, componentes reutilizables y experiencias responsive.", mastery: "Intermedio · aplicación práctica" },
  datos: { choice: "Por su ajuste al modelo de información, las consultas y las necesidades de rendimiento del proyecto.", learning: "Modelar pensando en integridad, trazabilidad y costo de cada consulta.", mastery: "Intermedio · aplicación práctica" },
  herramientas: { choice: "Porque reducía fricción en pruebas, colaboración, documentación o despliegue.", learning: "Automatizar tareas repetibles y mantener un flujo de entrega verificable.", mastery: "Uso habitual en el flujo de trabajo" },
};
const skillPerspectiveOverrides: Partial<Record<string, SkillPerspective>> = {
  Dapper: { choice: "Porque necesitaba consultas SQL explícitas, mapeo liviano y control sobre el rendimiento.", learning: "Optimizar consultas sin mezclar acceso a datos con reglas de negocio.", mastery: "Intermedio · utilizado en Casa Net" },
  Redis: { choice: "Para sostener sesiones y caché sin aumentar accesos repetitivos a la base de datos.", learning: "Diseñar expiración, renovación y fallbacks para estados distribuidos.", mastery: "Intermedio · utilizado en Casa Net" },
  SignalR: { choice: "Para entregar actualizaciones en tiempo real con una integración natural en .NET.", learning: "Modelar eventos pequeños y mantener sincronizada la experiencia del usuario.", mastery: "Intermedio · utilizado en Casa Net" },
  "ASP.NET Core": { choice: "Por su arquitectura modular, seguridad integrada y ecosistema para aplicaciones mantenibles.", learning: "Separar controladores, servicios, repositorios y middleware con responsabilidades claras.", mastery: "Intermedio · múltiples proyectos" },
  React: { choice: "Para construir interacción mediante componentes reutilizables y estado predecible.", learning: "Componer interfaces sin acoplar la presentación a los datos.", mastery: "Intermedio · portafolio profesional" },
  TypeScript: { choice: "Para detectar errores antes de ejecutar y mantener contratos claros entre componentes.", learning: "Modelar datos y estados de interfaz con tipos útiles, no decorativos.", mastery: "Intermedio · portafolio profesional" },
  JWT: { choice: "Para proteger APIs con autenticación desacoplada y contratos verificables.", learning: "Separar identidad, autorización y vigencia de credenciales.", mastery: "Intermedio · APIs de autenticación" },
};

const heroModes: Record<TechType, { label: string; detail: string; path: string; flow: string[] }> = {
  api: { label: "API", detail: "Controllers", path: "~/backend/controllers", flow: ["CLIENTE", "API .NET", "SERVICE", "DATA", "RESPUESTA"] },
  db: { label: "DB", detail: "SELECT *", path: "~/backend/data", flow: ["API", "SERVICE", "DAPPER", "MYSQL", "RESULT"] },
  service: { label: "SERVICE", detail: "GetAsync()", path: "~/backend/services", flow: ["CLIENTE", "VALIDATE", "SERVICE", "EVENT", "RESPUESTA"] },
  deploy: { label: "DEPLOY", detail: "CI / CD", path: "~/backend/pipeline", flow: ["COMMIT", "TEST", "BUILD", "CLOUD", "HEALTH"] },
};

type LiveView = { file: string; lines: string[] };
type LiveRequest = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  endpoint: string;
  status: string;
  tone: "success" | "warning";
  latency: number;
  views: Record<Exclude<TechType, "deploy">, LiveView>;
};

const liveRequests: LiveRequest[] = [
  {
    method: "GET", endpoint: "/api/projects", status: "200 OK", tone: "success", latency: 18,
    views: {
      api: { file: "ProjectsController.cs", lines: ['[HttpGet("api/projects")]', "var data = await _service.GetAllAsync();", "return Ok(data);"] },
      db: { file: "ProjectRepository.sql", lines: ["SELECT id, title, status", "FROM projects", "WHERE published = 1;"] },
      service: { file: "ProjectService.cs", lines: ["var items = await repository.GetAllAsync();", "return mapper.ToDtos(items);"] },
    },
  },
  {
    method: "POST", endpoint: "/api/login", status: "401 Unauthorized", tone: "warning", latency: 22,
    views: {
      api: { file: "AuthController.cs", lines: ['[HttpPost("api/login")]', "var token = await _auth.SignInAsync(request);", "return Unauthorized();"] },
      db: { file: "UserRepository.sql", lines: ["SELECT id, password_hash", "FROM users", "WHERE email = @email;"] },
      service: { file: "AuthService.cs", lines: ["await password.VerifyAsync(request);", "return tokenService.Create(user);"] },
    },
  },
  {
    method: "GET", endpoint: "/api/properties", status: "200 OK", tone: "success", latency: 16,
    views: {
      api: { file: "PropertiesController.cs", lines: ['[HttpGet("api/properties")]', "var result = await _service.SearchAsync(query);", "return Ok(result);"] },
      db: { file: "PropertyRepository.sql", lines: ["SELECT id, price, location", "FROM properties", "WHERE active = 1;"] },
      service: { file: "PropertyService.cs", lines: ["var data = await repository.SearchAsync(query);", "return mapper.ToPage(data);"] },
    },
  },
  {
    method: "POST", endpoint: "/api/appointments", status: "201 Created", tone: "success", latency: 24,
    views: {
      api: { file: "AppointmentsController.cs", lines: ['[HttpPost("api/appointments")]', "var item = await _service.CreateAsync(command);", "return CreatedAtAction(nameof(Get), item);"] },
      db: { file: "AppointmentRepository.sql", lines: ["INSERT INTO appointments", "  (user_id, starts_at)", "VALUES (@userId, @startsAt);"] },
      service: { file: "AppointmentService.cs", lines: ["await validator.ValidateAsync(command);", "return await repository.CreateAsync(item);"] },
    },
  },
  {
    method: "PUT", endpoint: "/api/users", status: "200 OK", tone: "success", latency: 20,
    views: {
      api: { file: "UsersController.cs", lines: ['[HttpPut("api/users/{id}")]', "var user = await _service.UpdateAsync(id, request);", "return Ok(user);"] },
      db: { file: "UserRepository.sql", lines: ["UPDATE users", "SET display_name = @name", "WHERE id = @id;"] },
      service: { file: "UserService.cs", lines: ["var user = await repository.FindAsync(id);", "return await repository.UpdateAsync(user);"] },
    },
  },
  {
    method: "DELETE", endpoint: "/api/images", status: "204 No Content", tone: "success", latency: 19,
    views: {
      api: { file: "ImagesController.cs", lines: ['[HttpDelete("api/images/{id}")]', "await _service.DeleteAsync(id);", "return NoContent();"] },
      db: { file: "ImageRepository.sql", lines: ["DELETE FROM images", "WHERE id = @id", "  AND owner_id = @userId;"] },
      service: { file: "ImageService.cs", lines: ["await storage.DeleteAsync(image.Path);", "await repository.DeleteAsync(id);"] },
    },
  },
];

function useScrollSpy() {
  const [active, setActiveState] = useState<SectionId>("inicio");
  const [compact, setCompact] = useState(false);
  const activeRef = useRef<SectionId>("inicio");
  const manualTarget = useRef<{ id: SectionId; until: number } | null>(null);

  const setActive = useCallback((id: SectionId) => {
    if (activeRef.current === id) return;
    activeRef.current = id;
    setActiveState(id);
  }, []);

  const activate = useCallback((id: SectionId) => {
    manualTarget.current = { id, until: performance.now() + 1200 };
    setActive(id);
  }, [setActive]);

  useEffect(() => {
    let frame = 0;
    const nodes = observedSections.map((id) => document.getElementById(id)).filter((node): node is HTMLElement => Boolean(node));

    const calculateDominantSection = () => {
      if (window.scrollY <= 1) {
        manualTarget.current = null;
        setActive("inicio");
        return;
      }

      const viewportHeight = Math.max(window.innerHeight, 1);
      const rects = nodes.map((node) => node.getBoundingClientRect());
      const visibility = new Map<SectionId, number>();

      nodes.forEach((node, index) => {
        const id = node.id as SectionId;
        const start = rects[index].top;
        const end = index < nodes.length - 1 ? rects[index + 1].top : rects[index].bottom;
        const visiblePixels = Math.max(0, Math.min(end, viewportHeight) - Math.max(start, 0));
        visibility.set(id, Math.min(1, visiblePixels / viewportHeight));
      });

      let candidate: SectionId = "inicio";
      let candidateVisibility = visibility.get(candidate) ?? 0;
      visibility.forEach((value, id) => {
        if (value > candidateVisibility) {
          candidate = id;
          candidateVisibility = value;
        }
      });

      const heroVisibility = visibility.get("inicio") ?? 0;
      if (heroVisibility >= .47) {
        candidate = "inicio";
        candidateVisibility = heroVisibility;
      }

      const lock = manualTarget.current;
      if (lock && performance.now() < lock.until) {
        if (candidate === lock.id && candidateVisibility >= .32) manualTarget.current = null;
        else return;
      } else if (lock) manualTarget.current = null;

      const current = activeRef.current;
      if (candidate === current) return;
      const currentVisibility = visibility.get(current) ?? 0;
      const clearlyDominant = candidateVisibility - currentVisibility >= .08;
      const currentHasLeft = currentVisibility < .12 && candidateVisibility >= .22;
      if (clearlyDominant || currentHasLeft) setActive(candidate);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setCompact(window.scrollY > 48);
        if (window.scrollY <= 1) setActive("inicio");
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(calculateDominantSection, { threshold: Array.from({ length: 21 }, (_, index) => index / 20) });
    nodes.forEach((node) => observer.observe(node));
    window.addEventListener("resize", calculateDominantSection);
    calculateDominantSection();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", calculateDominantSection);
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [setActive]);

  return { active, compact, activate };
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
    introMessages.forEach((_, index) => timers.push(window.setTimeout(() => setStep(index), index * 135)));
    timers.push(window.setTimeout(() => setShow(false), 760));
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
  const { active, compact, activate } = useScrollSpy();
  const reduced = useReducedMotion();
  const goToSection = (event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) => {
    event.preventDefault();
    activate(id);
    document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };
  const indicator = <motion.span className="active-indicator" layoutId="nav-active" transition={{ type: "spring", stiffness: 430, damping: 38, mass: .52 }} />;

  return (
    <div className={`header-shell ${compact ? "compact" : ""}`}>
      <header className="site-header">
        <a className={`wordmark ${active === "inicio" ? "active" : ""}`} href="#inicio" aria-label="Jonathan Cascante, inicio" aria-current={active === "inicio" ? "location" : undefined} onClick={(event) => goToSection(event, "inicio")}>Jonathan <span>Cascante</span>{active === "inicio" && indicator}</a>
        <nav aria-label="Navegación principal">
          {navigationSections.map((id) => (
            <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined} onClick={(event) => goToSection(event, id)}>
              {id === "proyectos" ? "Proyectos" : id === "habilidades" ? "Habilidades" : id === "experiencia" ? "Experiencia" : "Contacto"}
              {active === id && indicator}
            </a>
          ))}
        </nav>
      </header>
    </div>
  );
}

function highlightLine(line: string) {
  const tokens = line.split(/(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|\[HttpGet|\[HttpPost|\[HttpPut|\[HttpDelete|\]|"[^"]*"|@\w+)/g);
  return tokens.map((token, index) => {
    const hot = /^(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|\[HttpGet|\[HttpPost|\[HttpPut|\[HttpDelete|\])$/.test(token);
    const string = /^"|^@/.test(token);
    return <span key={`${token}-${index}`} className={hot ? "syntax-hot" : string ? "syntax-string" : ""}>{token}</span>;
  });
}

function HeroCode() {
  const [mode, setMode] = useState<TechType>("api");
  const [requestIndex, setRequestIndex] = useState(0);
  const [chars, setChars] = useState(0);
  const [phase, setPhase] = useState<"typing" | "running" | "response">("typing");
  const [flowStep, setFlowStep] = useState(-1);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const pointerFrame = useRef(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 24, mass: .6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 24, mass: .6 });
  const request = liveRequests[requestIndex];
  const config = heroModes[mode];
  const view = useMemo<LiveView>(() => mode === "deploy"
    ? { file: "deploy-production.yml", lines: ["name: backend-ci", "- run: dotnet test          ✓", "- run: deploy production    ✓"] }
    : request.views[mode], [mode, request]);
  const snippet = useMemo(() => view.lines.join("\n"), [view]);

  useEffect(() => {
    if (reduced) {
      const timer = window.setTimeout(() => {
        setChars(snippet.length);
        setPhase("response");
        setFlowStep(config.flow.length - 1);
      }, 0);
      return () => window.clearTimeout(timer);
    }
    const timers: number[] = [];
    const reset = window.setTimeout(() => {
      setChars(0);
      setPhase("typing");
      setFlowStep(-1);
    }, 0);
    const start = performance.now();
    let frame = 0;
    const type = (time: number) => {
      const progress = Math.min(1, (time - start) / 1500);
      const next = Math.min(snippet.length, Math.floor(snippet.length * progress));
      setChars(next);
      if (next < snippet.length) frame = requestAnimationFrame(type);
    };
    frame = requestAnimationFrame(type);
    timers.push(window.setTimeout(() => { setPhase("running"); setFlowStep(0); }, 1900));
    [1, 2, 3, 4].forEach((step, index) => timers.push(window.setTimeout(() => setFlowStep(step), 2200 + index * 300)));
    timers.push(window.setTimeout(() => setPhase("response"), 3450));
    timers.push(window.setTimeout(() => setRequestIndex((current) => (current + 1) % liveRequests.length), 5200));
    return () => {
      window.clearTimeout(reset);
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [config.flow.length, mode, reduced, requestIndex, snippet.length]);

  const move = useCallback((event: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || event.pointerType === "touch" || !panel.current || document.documentElement.dataset.motionProfile === "reduced-effects") return;
    const { clientX, clientY } = event;
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current = requestAnimationFrame(() => {
      if (!panel.current) return;
      const rect = panel.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      rawRotateX.set((.5 - y) * 2.2);
      rawRotateY.set((x - .5) * 2.6);
      panel.current.style.setProperty("--panel-glow-x", `${x * 100}%`);
      panel.current.style.setProperty("--panel-glow-y", `${y * 100}%`);
    });
  }, [rawRotateX, rawRotateY, reduced]);

  const resetTilt = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    panel.current?.style.setProperty("--panel-glow-x", "72%");
    panel.current?.style.setProperty("--panel-glow-y", "30%");
  }, [rawRotateX, rawRotateY]);

  useEffect(() => () => {
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current);
  }, []);

  const visibleLines = useMemo(() => snippet.slice(0, chars).split("\n"), [chars, snippet]);
  const liveLog = phase === "typing" ? `watcher · ${view.file} changed` : phase === "running" ? `request · ${request.method} ${request.endpoint} executing` : `http · ${request.status} · ${request.latency} ms`;
  return (
    <motion.div
      ref={panel}
      className={`architecture phase-${phase}`}
      aria-label={`Sistema backend en vivo: ${request.method} ${request.endpoint}`}
      onPointerMove={move}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      <div className="architecture-particles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="terminal-bar"><span /><span /><span /><AnimatePresence mode="wait"><motion.code key={config.path} initial={reduced ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -3 }} transition={{ duration: .25 }}>{config.path}</motion.code></AnimatePresence><small>.NET 8 · ONLINE</small></div>
      <div className="architecture-body">
        <aside role="tablist" aria-label="Capas de la solución">
          {(Object.keys(heroModes) as TechType[]).map((key) => (
            <button type="button" role="tab" aria-selected={mode === key} className={mode === key ? "active" : ""} onPointerEnter={() => setMode(key)} onFocus={() => setMode(key)} onClick={() => setMode(key)} key={key}>
              <TechIcon type={key} /><small>{heroModes[key].label}</small><em>{heroModes[key].detail}</em>
            </button>
          ))}
        </aside>
        <div className="code-window" aria-live="polite">
          <div className="live-request-bar">
            <span className={`request-method method-${request.method.toLowerCase()}`}>{request.method}</span>
            <code>{request.endpoint}</code>
            <span className="live-request-state"><StatusDot size="xs" /> Live request</span>
            <span className="request-latency"><small>Latency</small><b>{request.latency} ms</b></span>
          </div>
          <div className="live-editor">
            <div className="editor-file"><AnimatePresence mode="wait"><motion.span key={view.file} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{view.file}</motion.span></AnimatePresence><i>{phase === "typing" ? "EDITING" : phase === "running" ? "EXECUTING" : "RESPONSE"}</i></div>
            <div className="live-code-lines">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleLines.map((line, index) => (
                  <motion.div key={`${mode}-${requestIndex}-${index}`} initial={reduced ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .16 }}>
                    <span className="line">{String(index + 1).padStart(2, "0")}</span>
                    <code>{highlightLine(line)}{index === visibleLines.length - 1 && phase === "typing" && <i className="typing-cursor" />}</code>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span className="live-log-entry" key={liveLog} initial={reduced ? false : { opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: .2 }}><i aria-hidden="true" />{liveLog}</motion.span>
            </AnimatePresence>
            <AnimatePresence>
              {phase === "response" && <motion.div className={`server-response ${request.tone}`} initial={reduced ? { opacity: 0 } : { opacity: 0, y: 7, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28 }}><StatusDot tone={request.tone === "warning" ? "warning" : "online"} /><span>SERVER RESPONSE</span><b>{request.status}</b></motion.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="architecture-flow" aria-hidden="true">
        <span className="flow-caption">Request pipeline <i>{phase === "response" ? request.status : phase === "running" ? "processing" : "waiting"}</i></span>
        <AnimatePresence mode="wait">
          <motion.div className="flow-track" key={mode} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
          {config.flow.map((node, index) => (
            <div className="flow-unit" key={node}>
              <span className={`${index === 1 ? "primary-node" : ""} ${index <= flowStep ? "is-active" : ""}`}>{node}</span>
              {index < config.flow.length - 1 && <i className={`flow-link ${index < flowStep ? "is-complete" : ""}`}>{!reduced && index === flowStep && <b key={`${requestIndex}-${mode}-${index}`} />}</i>}
            </div>
          ))}
          </motion.div>
        </AnimatePresence>
      </div>
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
  const [filter, setFilter] = useState<"all" | (typeof skillCategories)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const reduced = useReducedMotion();
  const categoryIcons: Record<(typeof skillCategories)[number]["id"], TechType> = { backend: "api", frontend: "service", datos: "db", herramientas: "deploy" };
  const filterOptions = [
    { id: "all" as const, label: "Todas" },
    { id: "backend" as const, label: "Backend" },
    { id: "frontend" as const, label: "Frontend" },
    { id: "datos" as const, label: "Datos" },
    { id: "herramientas" as const, label: "Herramientas" },
  ];
  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    return skillCategories
      .filter((category) => filter === "all" || category.id === filter)
      .map((category) => ({ ...category, skills: category.skills.filter((skill) => !normalized || skill.name.toLocaleLowerCase("es").includes(normalized)) }))
      .filter((category) => category.skills.length > 0);
  }, [filter, query]);
  const selectedCategory = skillCategories.find((category) => category.skills.some((skill) => skill.name === selected.name))?.id ?? "backend";
  const perspective = skillPerspectiveOverrides[selected.name] ?? categoryPerspectives[selectedCategory];
  const catalogTransitionKey = `${filter}:${query.trim().toLocaleLowerCase("es")}`;
  const changeFilter = (nextFilter: typeof filter) => {
    setFilter(nextFilter);
    if (nextFilter === "all") return;
    const nextCategory = skillCategories.find((category) => category.id === nextFilter);
    if (nextCategory && !nextCategory.skills.some((skill) => skill.name === selected.name)) setSelected(nextCategory.skills[0]);
  };
  const handleFilterKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      changeFilter(filterOptions[index].id);
      return;
    }
    const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? filterOptions.length - 1 : direction ? (index + direction + filterOptions.length) % filterOptions.length : -1;
    if (nextIndex < 0) return;
    event.preventDefault();
    changeFilter(filterOptions[nextIndex].id);
    const tabs = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button[role='tab']");
    tabs?.[nextIndex]?.focus();
  };

  return (
    <div className="skills-explorer">
      <div className="skills-toolbar">
        <div className="skills-total"><strong>{skills.length}</strong><span>tecnologías utilizadas</span><small>Selecciona una tecnología para ver cómo la aplico dentro de una solución real.</small></div>
        <div className="skill-filters" role="tablist" aria-label="Filtrar tecnologías por categoría">
          {filterOptions.map((option, index) => <button type="button" role="tab" aria-selected={filter === option.id} className={filter === option.id ? "active" : ""} onClick={() => changeFilter(option.id)} onKeyDown={(event) => handleFilterKeyDown(event, index)} key={option.id}>{option.label}</button>)}
        </div>
        <label className="skill-search"><span aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar tecnología" aria-label="Buscar tecnología" /></label>
      </div>
      <div className="skill-catalog" id="skill-catalog" aria-label="Tecnologías agrupadas por categoría">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="skill-catalog-content"
            key={catalogTransitionKey}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: reduced ? .1 : .22, ease: [0.22, 1, 0.36, 1] }}
          >
            {visibleCategories.map((category) => {
              const categoryIndex = skillCategories.findIndex((item) => item.id === category.id);
              return (
                <section className="skill-category" data-category={category.id} key={category.id}>
                  <div className="skill-category-heading"><span>{String(categoryIndex + 1).padStart(2, "0")}</span><i><TechIcon type={categoryIcons[category.id]} /></i><div><h3>{category.label}</h3><p>{category.description}</p></div><small>{skillCategories[categoryIndex].skills.length} tecnologías</small></div>
                  <div className="skill-selector" role="listbox" aria-label={category.label}>
                    {category.skills.map((skill) => <button type="button" role="option" aria-selected={selected.name === skill.name} className={selected.name === skill.name ? "selected" : ""} onMouseEnter={() => setSelected(skill)} onFocus={() => setSelected(skill)} onClick={() => setSelected(skill)} key={skill.name}>{skill.name}<span className="skill-active-indicator"><i /></span></button>)}
                  </div>
                </section>
              );
            })}
            {visibleCategories.length === 0 && <p className="skill-empty">No encontré una tecnología con ese nombre.</p>}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="skill-detail" data-category={selectedCategory} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="skill-detail-copy" key={selected.name} initial={reduced ? { opacity: 0 } : { opacity: 0, x: -7 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: 5 }} transition={{ duration: .25 }}>
            <p className="section-kicker">Tecnología seleccionada</p><h3>{selected.name}</h3>
            <dl><div><dt>Dónde la utilicé</dt><dd>{selected.context}</dd></div><div><dt>Proyecto</dt><dd>{selected.project}</dd></div><div><dt>Qué problema resolvió</dt><dd>{selected.use}</dd></div><div><dt>Por qué la elegí</dt><dd>{perspective.choice}</dd></div><div><dt>Qué aprendí</dt><dd>{perspective.learning}</dd></div><div><dt>Nivel aproximado</dt><dd><span className="mastery-indicator"><i /><i /><i /><i /></span>{perspective.mastery}</dd></div></dl>
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div className="skill-demo" key={selected.name} initial={reduced ? { opacity: 0 } : { opacity: 0, x: 7 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -5 }} transition={{ duration: .25 }}>
            <SkillContextPreview skill={selected} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkillContextPreview({ skill }: { skill: Skill }) {
  const demonstrations: Partial<Record<string, Array<[string, string]>>> = {
    React: [["component", "function ProjectGrid()"], ["state", "const [active, setActive] = useState(0);"], ["render", "<ProjectCard project={items[active]} />"], ["flow", "state → component → interface"]],
    TypeScript: [["interface", "ProjectCardProps { project: Project }"], ["type", "type Status = 'draft' | 'published';"], ["validate", "const card: ProjectCardProps = props;"], ["result", "safe props · predictable UI"]],
    JavaScript: [["event", "button.addEventListener('click', load);"], ["request", "const data = await fetch('/api/projects');"], ["update", "view.replaceChildren(render(data));"], ["result", "interface updated"]],
    "C#": [["controller", "[HttpGet(\"api/projects\")]"], ["service", "await service.GetAllAsync();"], ["response", "return Ok(projects);"], ["status", "200 OK"]],
    Dapper: [["query", "SELECT id, title FROM projects"], ["map", "QueryAsync<Project>(sql);"], ["result", "rows → typed entities"], ["status", "mapping complete"]],
    Redis: [["cache", "GET session:user:1048"], ["result", "CACHE HIT"], ["ttl", "expires in 18m"], ["latency", "2 ms response"]],
    MongoDB: [["collection", "db.properties.find({ active: true })"], ["document", "{ title, price, location }"], ["result", "12 documents"], ["status", "query complete"]],
    Hibernate: [["entity", "@Entity class Property"], ["repository", "repository.findAll();"], ["persist", "session.save(entity);"], ["status", "transaction committed"]],
  };
  const lines = demonstrations[skill.name] ?? [["technology", `\"${skill.name}\"`], ["context", `\"${skill.context}\"`], ["project", `\"${skill.project}\"`], ["purpose", "software que genera valor"]];

  return (
    <div className="skill-context-preview" role="img" aria-label={`Contexto de uso de ${skill.name}`}>
      <div className="preview-top"><i /><span>~/skills/{skill.name.toLowerCase().replaceAll(" ", "-")}</span><small>uso real</small></div>
      <div className="skill-code-body">{lines.map(([label, code], index) => <span className="skill-demo-line" key={`${label}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><code><b>{label}</b>: {code}</code></span>)}<i className="skill-code-cursor" /></div>
    </div>
  );
}

function LearningBlock() {
  const reduced = useReducedMotion();
  return (
    <Reveal className="learning-block">
      <div><p className="section-kicker">Evolución constante</p><h3>Actualmente aprendiendo</h3><p>Temas que estoy fortaleciendo para diseñar soluciones más mantenibles, distribuidas y preparadas para la nube.</p></div>
      <div className="learning-list">{learningTopics.map((topic, index) => <motion.div className="learning-item" key={topic.name} initial={reduced ? false : { opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .05 }}><i aria-hidden="true" /><span><b>{topic.name}</b><small>{topic.description}</small></span><em>En exploración</em></motion.div>)}</div>
    </Reveal>
  );
}

function TimelineEvent({ item, current }: { item: (typeof journey)[number]; current: boolean }) {
  const event = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const visible = useInView(event, { once: true, amount: .42, margin: "0px 0px -24% 0px" });
  const active = Boolean(reduced || visible);

  return (
    <motion.li
      ref={event}
      className={`timeline-event ${active ? "active" : ""} ${current ? "current" : ""}`}
      aria-current={current ? "step" : undefined}
      initial={false}
      animate={{ opacity: active ? 1 : .56 }}
      transition={{ duration: reduced ? 0 : .52, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="timeline-node" aria-hidden="true">
        <i className="timeline-node-core" />
        <i className="timeline-node-wave" />
      </span>
      <span className="timeline-date">{item.date}</span>
      <div className="timeline-copy"><h3>{item.title}</h3><p>{item.text}</p></div>
    </motion.li>
  );
}

function Timeline() {
  const timeline = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [railMetrics, setRailMetrics] = useState({ top: 34, height: 0 });
  const { scrollYProgress } = useScroll({ target: rail, offset: ["start 72%", "end 38%"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 110, damping: 27, mass: .4, restDelta: .001 });
  const sparkY = useTransform(smoothProgress, [0, 1], [0, railMetrics.height]);
  const sparkOpacity = useTransform(smoothProgress, [0, .018, .97, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const list = timeline.current;
    if (!list) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const nodes = list.querySelectorAll<HTMLElement>(".timeline-node");
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!first || !last) return;
        const listRect = list.getBoundingClientRect();
        const firstRect = first.getBoundingClientRect();
        const lastRect = last.getBoundingClientRect();
        const top = firstRect.top - listRect.top + firstRect.height / 2;
        const bottom = lastRect.top - listRect.top + lastRect.height / 2;
        setRailMetrics({ top, height: Math.max(0, bottom - top) });
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    measure();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="timeline-shell">
      <div ref={rail} className="timeline-rail" style={{ top: railMetrics.top, height: railMetrics.height }} aria-hidden="true">
        <span className="timeline-rail-base" />
        <motion.span className="timeline-rail-progress" style={{ scaleY: reduced ? 1 : smoothProgress }} />
        {!reduced && (
          <motion.span className="timeline-spark" style={{ y: sparkY, opacity: sparkOpacity }}>
            <i />
          </motion.span>
        )}
      </div>
      <ol ref={timeline} className="timeline">
        {journey.map((item, index) => <TimelineEvent item={item} current={index === journey.length - 1} key={`${item.date}-${item.title}`} />)}
      </ol>
    </div>
  );
}

function BeyondVisual({ theme }: { theme: (typeof beyondCode)[number]["theme"] }) {
  if (theme === "gaming") {
    return (
      <div className="game-scene">
        <div className="game-grid" />
        <span className="game-pixel pixel-one" /><span className="game-pixel pixel-two" /><span className="game-pixel pixel-three" />
        <div className="game-controller">
          <span className="game-dpad"><i /><b /></span>
          <span className="game-buttons"><i /><i /></span>
          <span className="game-status" />
        </div>
        <span className="game-score"><i /> Focus 98</span>
      </div>
    );
  }

  if (theme === "cycling") {
    return (
      <div className="bike-scene">
        <span className="bike-distance"><i /> 42.8 <small>km</small></span>
        <div className="bike-machine">
          <span className="bike-wheel bike-wheel-back" /><span className="bike-wheel bike-wheel-front" />
          <i className="bike-frame" /><i className="bike-fork" /><i className="bike-chain" />
          <i className="bike-seat" /><i className="bike-handle" /><i className="bike-pedal" />
        </div>
        <div className="bike-road"><i /><i /><i /></div>
      </div>
    );
  }

  if (theme === "nature") {
    return (
      <div className="nature-scene">
        <span className="nature-sun" />
        <i className="nature-air air-one" /><i className="nature-air air-two" /><i className="nature-air air-three" />
        <div className="mountain mountain-back" /><div className="mountain mountain-front" />
        <span className="nature-trail" />
        <span className="nature-altitude"><i /> 1 720 m</span>
      </div>
    );
  }

  return (
    <div className="learning-scene">
      <span className="learning-node node-one">01</span><span className="learning-node node-two">API</span><span className="learning-node node-three">&#123; &#125;</span>
      <div className="learning-book">
        <span className="book-shadow" /><span className="book-cover" />
        <i className="book-page page-one" /><i className="book-page page-two" /><i className="book-page page-three" />
        <b className="book-spine" />
      </div>
      <span className="learning-progress"><i /> Always in beta</span>
    </div>
  );
}

function BeyondCard({ item, index, onActive, onInactive }: { item: (typeof beyondCode)[number]; index: number; onActive: (theme: (typeof beyondCode)[number]["theme"]) => void; onInactive: () => void }) {
  const card = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 210, damping: 24, mass: .45 });
  const rotateY = useSpring(rawRotateY, { stiffness: 210, damping: 24, mass: .45 });

  const reset = useCallback(() => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    card.current?.style.setProperty("--beyond-x", "50%");
    card.current?.style.setProperty("--beyond-y", "50%");
  }, [rawRotateX, rawRotateY]);

  const move = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType === "touch" || !card.current || document.documentElement.dataset.motionProfile === "reduced-effects") return;
    const { clientX, clientY } = event;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      if (!card.current) return;
      const rect = card.current.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = (clientY - rect.top) / rect.height;
      rawRotateX.set((.5 - y) * 2.8);
      rawRotateY.set((x - .5) * 3.2);
      card.current.style.setProperty("--beyond-x", `${x * 100}%`);
      card.current.style.setProperty("--beyond-y", `${y * 100}%`);
    });
  }, [rawRotateX, rawRotateY, reduced]);

  useEffect(() => () => {
    if (frame.current) cancelAnimationFrame(frame.current);
  }, []);

  return (
    <motion.article
      ref={card}
      className="beyond-card"
      data-theme={item.theme}
      onPointerEnter={() => onActive(item.theme)}
      onPointerMove={move}
      onPointerLeave={() => { reset(); onInactive(); }}
      onPointerCancel={() => { reset(); onInactive(); }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: .28 }}
      transition={{ duration: .68, delay: index * .08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
    >
      <div className="beyond-card-top"><span>{item.index}</span><small>{item.label}</small><i /></div>
      <div className="beyond-visual" aria-hidden="true"><BeyondVisual theme={item.theme} /></div>
      <div className="beyond-card-copy">
        <h4><span>{item.title}</span><i /></h4>
        <p>{item.text}</p>
        <div className="beyond-signal"><i /><span>{item.signal}</span></div>
      </div>
    </motion.article>
  );
}

function BeyondCode() {
  const [activeTheme, setActiveTheme] = useState<(typeof beyondCode)[number]["theme"] | null>(null);
  const reduced = useReducedMotion();
  const context = activeTheme ? beyondContext[activeTheme] : "Cuatro espacios que alimentan mi forma de pensar: estrategia, movimiento, perspectiva y una curiosidad que nunca se queda quieta.";

  return (
    <Reveal className="beyond-code">
      <div className="mini-section-heading">
        <div><p className="section-kicker">Más allá del código</p><h3>La curiosidad también se entrena fuera de la pantalla.</h3></div>
        <div className="beyond-heading-context" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={activeTheme ?? "default"} initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -3 }} transition={{ duration: .22 }}>{context}</motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="beyond-grid">{beyondCode.map((item, index) => <BeyondCard item={item} index={index} onActive={setActiveTheme} onInactive={() => setActiveTheme(null)} key={item.title} />)}</div>
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
          <a className="text-link platform-link linkedin-link" href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer" aria-label="Abrir perfil de LinkedIn de Jonathan Cascante"><LinkedInIcon /> LinkedIn</a>
          <a className="text-link platform-link github-link" href="https://github.com/Psyckus" target="_blank" rel="noreferrer" aria-label="Abrir perfil de GitHub de Jonathan Cascante"><GitHubIcon /> GitHub</a>
        </div>
      </Reveal>
    </GlowSurface>
  );
}

export function PortfolioHome() {
  const [konamiUnlocked, setKonamiUnlocked] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    const lowPower = navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4);
    if (lowPower) document.documentElement.dataset.motionProfile = "reduced-effects";
    return () => { delete document.documentElement.dataset.motionProfile; };
  }, []);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let progress = 0;
    let hideTimer = 0;
    const handleKey = (event: globalThis.KeyboardEvent) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === sequence[progress] ? progress + 1 : key === sequence[0] ? 1 : 0;
      if (progress !== sequence.length) return;
      progress = 0;
      setKonamiUnlocked(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setKonamiUnlocked(false), 4200);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <main>
      <IntroOverlay />
      <AnimatePresence>{konamiUnlocked && <motion.div className="easter-toast" initial={reduced ? false : { opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={reduced ? undefined : { opacity: 0, y: 7 }} transition={{ duration: reduced ? 0 : .3 }}><StatusDot />Modo desarrollador desbloqueado · +30 enfoque</motion.div>}</AnimatePresence>
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
          <div className="hero-signals" aria-label="Estado profesional"><span><StatusDot />Disponible de inmediato</span><span>Abierto a oportunidades</span><span>Backend & APIs</span></div>
        </Reveal>
        <HeroCode />
      </GlowSurface>

      <GlowSurface className="section projects-section" id="proyectos">
        <Reveal className="section-heading"><div><p className="section-kicker">Trabajo seleccionado</p><h2>Proyectos que resuelven problemas reales.</h2></div><p>Cada proyecto combina decisiones técnicas con una necesidad concreta: organizar procesos, reducir fricción y entregar información confiable.</p></Reveal>
        <Reveal className="project-stats" delay={.05}><AnimatedCounter value={3} label="Proyectos principales" /><AnimatedCounter value={12} suffix="+" label="Integraciones aplicadas" /><AnimatedCounter value={3} label="Casos de estudio" /></Reveal>
        <div className="project-list">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div>
        <ArchitectureShowcase />
      </GlowSurface>

      <PortfolioStats />

      <section className="section profile-section" id="habilidades">
        <Reveal className="section-heading compact"><div><p className="section-kicker">Capacidades</p><h2>De la base de datos a la interfaz.</h2></div><p>Selecciona una tecnología para ver dónde la aplico y qué valor aporta dentro de una solución real.</p></Reveal>
        <Reveal delay={.08}><SkillsExplorer /></Reveal>
        <TechnologyMarquee />
        <LearningBlock />
        <EngineeringDecisions />
        <WorkProcess />
        <div className="academic" id="experiencia">
          <Reveal className="academic-intro"><p className="section-kicker">Experiencia académica</p><h2>Formación aplicada a escenarios reales.</h2><p>Mi experiencia se ha construido desarrollando soluciones completas, documentando procesos y validando resultados con usuarios reales.</p><div className="availability"><StatusDot size="md" /> Disponibilidad inmediata</div><div className="academic-badges" aria-label="Competencias aplicadas">{academicBadges.map((badge) => <span key={badge}><b>✓</b>{badge}</span>)}</div></Reveal>
          <Timeline />
        </div>
        <BeyondCode />
        <Philosophy />
        <GitHubActivity />
      </section>

      <InteractiveTerminal />
      <Contact />
      <footer className="site-footer"><a className="wordmark" href="#inicio">Jonathan <span>Cascante</span></a><div className="footer-copy"><p>Diseñado y desarrollado por Jonathan Cascante.</p><small>Costa Rica 🇨🇷</small></div><div className="footer-links"><a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/jonathan-cascante-dev" target="_blank" rel="noreferrer">LinkedIn</a></div></footer>
    </main>
  );
}
