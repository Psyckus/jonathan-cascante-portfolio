"use client";

import { AnimatePresence, LazyMotion, m, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Dictionary, Locale } from "../i18n/config";
import type { Skill, SkillCategory, SkillCategoryId } from "../lib/projects";
import { CheckIcon, CopyIcon, TechIcon, type TechType } from "./icons";
import { LanguageSwitcher } from "./language-switcher";
import { StatusDot } from "./status-dot";

const motionFeatures = () => import("./motion-features").then((module) => module.default);

export function PortfolioMotion({ children }: { children: ReactNode }) {
  return <LazyMotion features={motionFeatures} strict>{children}</LazyMotion>;
}

const navigationSections = ["proyectos", "habilidades", "experiencia", "contacto"] as const;
const observedSections = ["inicio", ...navigationSections] as const;
type SectionId = (typeof observedSections)[number];
type SkillPerspective = { choice: string; learning: string; mastery: string };
type BeyondTheme = "gaming" | "cycling" | "nature" | "learning";
type BeyondItem = { theme: BeyondTheme; index: string; label: string; title: string; signal: string; text: string };

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

    let lastCompact = false;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const nextCompact = window.scrollY > 48;
        if (nextCompact !== lastCompact) {
          lastCompact = nextCompact;
          setCompact(nextCompact);
        }
        calculateDominantSection();
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

export function Header({ locale, copy, language }: { locale: Locale; copy: Dictionary["nav"]; language: Dictionary["language"] }) {
  const { active, compact, activate } = useScrollSpy();
  const reduced = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menuButton = useRef<HTMLButtonElement>(null);
  const labels = { proyectos: copy.projects, habilidades: copy.skills, experiencia: copy.experience, contacto: copy.contact };

  useEffect(() => {
    if (!menuOpen) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [menuOpen]);

  function goToSection(event: React.MouseEvent<HTMLAnchorElement>, id: SectionId) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const section = document.getElementById(id);
    if (!section) return;
    event.preventDefault();
    setMenuOpen(false);
    activate(id);
    if (event.detail === 0) {
      const heading = section.querySelector<HTMLElement>("h1, h2");
      heading?.setAttribute("tabindex", "-1");
      heading?.focus({ preventScroll: true });
    }
    const behavior = reduced ? "instant" : "smooth";
    section.scrollIntoView({ behavior, block: "start" });
    window.history.replaceState(window.history.state, "", `#${id}`);
  }

  const indicator = <m.span className="active-indicator" layoutId="nav-active" transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 430, damping: 38, mass: .52 }} />;

  return (
    <div className={`header-shell ${compact ? "compact" : ""}`}>
      <header ref={header} className="site-header" onKeyDown={(event) => {
        if (event.key !== "Escape" || !menuOpen) return;
        setMenuOpen(false);
        menuButton.current?.focus();
      }}>
        <a className={`wordmark ${active === "inicio" ? "active" : ""}`} href="#inicio" aria-current={active === "inicio" ? "location" : undefined} onClick={(event) => goToSection(event, "inicio")}>Jonathan <span>Cascante</span>{active === "inicio" && indicator}</a>
        <nav aria-label={copy.label}>
          <button type="button" ref={menuButton} className="mobile-menu-toggle" aria-expanded={menuOpen} aria-controls="section-menu" onClick={() => setMenuOpen((open) => !open)}>{copy.menu}</button>
          <div id="section-menu" className="section-menu" data-open={menuOpen}>
            {navigationSections.map((id) => (
              <a key={id} href={`#${id}`} className={active === id ? "active" : ""} aria-current={active === id ? "location" : undefined} onClick={(event) => goToSection(event, id)}>
                {labels[id]}
                {active === id && indicator}
              </a>
            ))}
          </div>
          <LanguageSwitcher locale={locale} copy={language} />
        </nav>
      </header>
    </div>
  );
}

export function GlowSurface({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const frame = useRef(0);

  const move = useCallback((event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse" || !ref.current || document.documentElement.dataset.motionProfile === "reduced-effects") return;
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

  return <section ref={ref} id={id} className={`glow-surface ${className}`} data-animate-when-visible={id === "contacto" ? true : undefined} onPointerMove={move}>{children}</section>;
}

function highlightLine(line: string) {
  const tokens = line.split(/(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|\[HttpGet|\[HttpPost|\[HttpPut|\[HttpDelete|\]|"[^"]*"|@\w+)/g);
  return tokens.map((token, index) => {
    const hot = /^(public|private|readonly|async|await|return|class|const|string|var|run:|name:|jobs:|steps:|on:|SELECT|FROM|WHERE|INSERT|INTO|VALUES|UPDATE|SET|DELETE|\[HttpGet|\[HttpPost|\[HttpPut|\[HttpDelete|\])$/.test(token);
    const string = /^"|^@/.test(token);
    return <span key={`${token}-${index}`} className={hot ? "syntax-hot" : string ? "syntax-string" : ""}>{token}</span>;
  });
}

let lastHeroMode: TechType = "api";
let lastHeroRequest = 0;
let playedHeroIntro = false;

export function HeroCode({ copy: panelCopy }: { copy: Dictionary["hero"]["panel"] }) {
  const [mode, setMode] = useState(lastHeroMode);
  const [requestIndex, setRequestIndex] = useState(lastHeroRequest);
  const [play, setPlay] = useState(false);
  const [chars, setChars] = useState<number | null>(null);
  const [phase, setPhase] = useState<"typing" | "running" | "response">("response");
  const [flowStep, setFlowStep] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const panelVisible = useInView(panel, { amount: .12 });
  const [pageVisible, setPageVisible] = useState(true);
  const pointerFrame = useRef(0);
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 24, mass: .6 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 24, mass: .6 });
  const request = liveRequests[requestIndex];
  const config = { ...heroModes[mode], flow: panelCopy.flows[mode] };
  const view = useMemo<LiveView>(() => mode === "deploy"
    ? { file: "deploy-production.yml", lines: ["name: backend-ci", "- run: dotnet test          ✓", "- run: deploy production    ✓"] }
    : request.views[mode], [mode, request]);
  const snippet = useMemo(() => view.lines.join("\n"), [view]);

  useEffect(() => {
    lastHeroMode = mode;
    lastHeroRequest = requestIndex;
  }, [mode, requestIndex]);

  useEffect(() => {
    const updateVisibility = () => setPageVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    if (!panelVisible || !pageVisible || reduced || playedHeroIntro) return;
    const startIntro = () => {
      playedHeroIntro = true;
      setPlay(true);
    };
    if (typeof window.requestIdleCallback === "function") {
      const idle = window.requestIdleCallback(startIntro, { timeout: 1800 });
      return () => window.cancelIdleCallback(idle);
    }
    const timer = window.setTimeout(startIntro, 700);
    return () => window.clearTimeout(timer);
  }, [pageVisible, panelVisible, reduced]);

  useEffect(() => {
    if (!play || !panelVisible || !pageVisible || reduced) return;
    const timers: number[] = [];
    const reset = window.setTimeout(() => {
      setChars(0);
      setPhase("typing");
      setFlowStep(-1);
    }, 0);
    const start = performance.now();
    let frame = 0;
    let lastPaint = 0;
    let lastChars = -1;
    const type = (time: number) => {
      const progress = Math.min(1, (time - start) / 1500);
      const next = Math.min(snippet.length, Math.floor(snippet.length * progress));
      if ((time - lastPaint >= 34 || progress === 1) && next !== lastChars) {
        lastPaint = time;
        lastChars = next;
        setChars(next);
      }
      if (next < snippet.length) frame = requestAnimationFrame(type);
    };
    frame = requestAnimationFrame(type);
    timers.push(window.setTimeout(() => { setPhase("running"); setFlowStep(0); }, 1900));
    [1, 2, 3, 4].forEach((step, index) => timers.push(window.setTimeout(() => setFlowStep(step), 2200 + index * 300)));
    timers.push(window.setTimeout(() => {
      setPhase("response");
      setChars(null);
      setFlowStep(null);
      setPlay(false);
    }, 3450));
    return () => {
      window.clearTimeout(reset);
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(frame);
    };
  }, [mode, pageVisible, panelVisible, play, reduced, requestIndex, snippet.length]);

  function changeMode(nextMode: TechType) {
    if (nextMode === mode) return;
    setMode(nextMode);
    setChars(null);
    setFlowStep(null);
    setPhase("response");
    setPlay(false);
  }

  function replay() {
    playedHeroIntro = true;
    setRequestIndex((current) => (current + 1) % liveRequests.length);
    setPlay(true);
  }

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

  const visibleLines = useMemo(() => snippet.slice(0, chars ?? snippet.length).split("\n"), [chars, snippet]);
  const liveLog = phase === "typing" ? `${panelCopy.watcher} · ${view.file} ${panelCopy.changed}` : phase === "running" ? `${panelCopy.request} · ${request.method} ${request.endpoint} ${panelCopy.running}` : `${panelCopy.http} · ${request.status} · ${request.latency} ms`;
  return (
    <m.div
      ref={panel}
      className={`architecture phase-${phase}`}
      aria-label={`${panelCopy.aria}: ${request.method} ${request.endpoint}`}
      onPointerMove={move}
      onPointerLeave={resetTilt}
      onPointerCancel={resetTilt}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
    >
      <div className="architecture-particles" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="terminal-bar"><span /><span /><span /><AnimatePresence mode="wait" initial={false}><m.code key={config.path} initial={reduced ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -3 }} transition={{ duration: .25 }}>{config.path}</m.code></AnimatePresence><small>.NET 8 · {panelCopy.online}</small></div>
      <div className="architecture-body">
        <aside role="tablist" aria-label={panelCopy.layers}>
          {(Object.keys(heroModes) as TechType[]).map((key) => (
            <button type="button" role="tab" aria-selected={mode === key} className={mode === key ? "active" : ""} onClick={() => changeMode(key)} key={key}>
              <TechIcon type={key} /><small>{heroModes[key].label}</small><em>{heroModes[key].detail}</em>
            </button>
          ))}
        </aside>
        <div className="code-window">
          <div className="live-request-bar">
            <span className={`request-method method-${request.method.toLowerCase()}`}>{request.method}</span>
            <code>{request.endpoint}</code>
            <span className="live-request-state"><StatusDot size="xs" /> {panelCopy.liveRequest}</span>
            <span className="request-latency"><small>{panelCopy.latency}</small><b>{request.latency} ms</b></span>
          </div>
          <div className="live-editor">
            <div className="editor-file"><AnimatePresence mode="wait" initial={false}><m.span key={view.file} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .2 }}>{view.file}</m.span></AnimatePresence><i>{phase === "typing" ? panelCopy.editing : phase === "running" ? panelCopy.executing : panelCopy.response}</i></div>
            <div className="live-code-lines">
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleLines.map((line, index) => (
                  <m.div key={`${mode}-${requestIndex}-${index}`} initial={reduced ? false : { opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .16 }}>
                    <span className="line">{String(index + 1).padStart(2, "0")}</span>
                    <code>{highlightLine(line)}{index === visibleLines.length - 1 && phase === "typing" && <i className="typing-cursor" />}</code>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <m.span className="live-log-entry" key={liveLog} initial={reduced ? false : { opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: .2 }}><i aria-hidden="true" />{liveLog}</m.span>
            </AnimatePresence>
            <AnimatePresence initial={false}>
              {phase === "response" && <m.div className={`server-response ${request.tone}`} initial={reduced ? { opacity: 0 } : { opacity: 0, y: 7, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .28 }}><StatusDot tone={request.tone === "warning" ? "warning" : "online"} /><span>{panelCopy.serverResponse}</span><b>{request.status}</b></m.div>}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <div className="architecture-flow">
        <div className="flow-caption"><span>{panelCopy.pipeline} <i>{phase === "response" ? request.status : phase === "running" ? panelCopy.processing : panelCopy.waiting}</i></span><button type="button" className="hero-replay" onClick={replay}>{panelCopy.replay}</button></div>
        <AnimatePresence mode="wait" initial={false}>
          <m.div className="flow-track" key={mode} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>
          {config.flow.map((node, index) => (
            <div className="flow-unit" key={node}>
              <span className={`${index === 1 ? "primary-node" : ""} ${index <= (flowStep ?? config.flow.length - 1) ? "is-active" : ""}`}>{node}</span>
              {index < config.flow.length - 1 && <i className={`flow-link ${index < (flowStep ?? config.flow.length - 1) ? "is-complete" : ""}`}>{!reduced && index === flowStep && <b key={`${requestIndex}-${mode}-${index}`} />}</i>}
            </div>
          ))}
          </m.div>
        </AnimatePresence>
      </div>
    </m.div>
  );
}

export function ProjectCardFrame({ children, featured }: { children: ReactNode; featured?: boolean }) {
  const reduced = useReducedMotion();
  const card = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const onMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse" || !card.current || document.documentElement.dataset.motionProfile === "reduced-effects") return;
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
    cancelAnimationFrame(frame.current);
    if (!card.current) return;
    card.current.style.setProperty("--card-x", "0deg");
    card.current.style.setProperty("--card-y", "0deg");
  };
  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return (
    <article ref={card} className={featured ? "project-card featured" : "project-card"} data-reveal onPointerMove={onMove} onPointerLeave={reset}>
      {children}
    </article>
  );
}

type SkillFilter = "all" | SkillCategoryId;
let lastSkillSelection: { name: string; filter: SkillFilter; query: string } | undefined;

export function SkillsExplorer({ copy, locale, skillCategories }: { copy: Dictionary["skillsSection"]; locale: Locale; skillCategories: SkillCategory[] }) {
  const skills = useMemo(() => skillCategories.flatMap((category) => category.skills), [skillCategories]);
  const [selectedName, setSelectedName] = useState(lastSkillSelection?.name ?? skills[0].name);
  const [filter, setFilter] = useState<SkillFilter>(lastSkillSelection?.filter ?? "all");
  const [query, setQuery] = useState(lastSkillSelection?.query ?? "");
  useEffect(() => { lastSkillSelection = { name: selectedName, filter, query }; }, [selectedName, filter, query]);
  const reduced = useReducedMotion();
  const selected = skills.find((skill) => skill.name === selectedName) ?? skills[0];
  const categoryIcons: Record<SkillCategoryId, TechType> = { backend: "api", frontend: "service", datos: "db", herramientas: "deploy" };
  const filterOptions = [
    { id: "all" as const, label: copy.filters.all },
    { id: "backend" as const, label: copy.filters.backend },
    { id: "frontend" as const, label: copy.filters.frontend },
    { id: "datos" as const, label: copy.filters.datos },
    { id: "herramientas" as const, label: copy.filters.herramientas },
  ];
  const visibleCategories = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    return skillCategories
      .filter((category) => filter === "all" || category.id === filter)
      .map((category) => ({ ...category, skills: category.skills.filter((skill) => !normalized || skill.name.toLocaleLowerCase(locale).includes(normalized)) }))
      .filter((category) => category.skills.length > 0);
  }, [filter, locale, query, skillCategories]);
  const selectedCategory = skillCategories.find((category) => category.skills.some((skill) => skill.name === selected.name))?.id ?? "backend";
  const overrides = copy.overrides as Partial<Record<string, SkillPerspective>>;
  const perspectives = copy.perspectives as Record<SkillCategoryId, SkillPerspective>;
  const perspective = overrides[selected.name] ?? perspectives[selectedCategory];
  const catalogTransitionKey = `${filter}:${query.trim().toLocaleLowerCase(locale)}`;
  const changeFilter = (nextFilter: typeof filter) => {
    setFilter(nextFilter);
    if (nextFilter === "all") return;
    const nextCategory = skillCategories.find((category) => category.id === nextFilter);
    if (nextCategory && !nextCategory.skills.some((skill) => skill.name === selected.name)) setSelectedName(nextCategory.skills[0].name);
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
        <div className="skills-total"><strong>{skills.length}</strong><span>{copy.used}</span><small>{copy.hint}</small></div>
        <div className="skill-filters" role="tablist" aria-label={copy.filterLabel}>
          {filterOptions.map((option, index) => <button type="button" role="tab" aria-selected={filter === option.id} className={filter === option.id ? "active" : ""} onClick={() => changeFilter(option.id)} onKeyDown={(event) => handleFilterKeyDown(event, index)} key={option.id}>{option.label}</button>)}
        </div>
        <label className="skill-search"><span aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} /></label>
      </div>
      <div className="skill-catalog" id="skill-catalog" aria-label={copy.catalogLabel}>
        <AnimatePresence mode="wait" initial={false}>
          <m.div
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
                  <div className="skill-category-heading"><span>{String(categoryIndex + 1).padStart(2, "0")}</span><i><TechIcon type={categoryIcons[category.id]} /></i><div><h3>{category.label}</h3><p>{category.description}</p></div><small>{skillCategories[categoryIndex].skills.length} {copy.technologyCount}</small></div>
                  <div className="skill-selector" role="listbox" aria-label={category.label}>
                    {category.skills.map((skill) => <button type="button" role="option" aria-selected={selected.name === skill.name} className={selected.name === skill.name ? "selected" : ""} onMouseEnter={() => setSelectedName(skill.name)} onFocus={() => setSelectedName(skill.name)} onClick={() => setSelectedName(skill.name)} key={skill.name}>{skill.name}<span className="skill-active-indicator"><i /></span></button>)}
                  </div>
                </section>
              );
            })}
            {visibleCategories.length === 0 && <p className="skill-empty">{copy.empty}</p>}
          </m.div>
        </AnimatePresence>
      </div>
      <div className="skill-detail" data-category={selectedCategory} aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <m.div className="skill-detail-copy" key={selected.name} initial={reduced ? { opacity: 0 } : { opacity: 0, x: -7 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: 5 }} transition={{ duration: .25 }}>
            <p className="section-kicker">{copy.selected}</p><h3>{selected.name}</h3>
            <dl><div><dt>{copy.fields.where}</dt><dd>{selected.context}</dd></div><div><dt>{copy.fields.project}</dt><dd>{selected.project}</dd></div><div><dt>{copy.fields.problem}</dt><dd>{selected.use}</dd></div><div><dt>{copy.fields.why}</dt><dd>{perspective.choice}</dd></div><div><dt>{copy.fields.learned}</dt><dd>{perspective.learning}</dd></div><div><dt>{copy.fields.level}</dt><dd><span className="mastery-indicator"><i /><i /><i /><i /></span>{perspective.mastery}</dd></div></dl>
          </m.div>
        </AnimatePresence>
        <AnimatePresence mode="wait" initial={false}>
          <m.div className="skill-demo" key={selected.name} initial={reduced ? { opacity: 0 } : { opacity: 0, x: 7 }} animate={{ opacity: 1, x: 0 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -5 }} transition={{ duration: .25 }}>
            <SkillContextPreview skill={selected} copy={copy.preview} />
          </m.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function SkillContextPreview({ skill, copy }: { skill: Skill; copy: Dictionary["skillsSection"]["preview"] }) {
  const demonstrations: Partial<Record<string, Array<[string, string]>>> = {
    React: [["component", "function ProjectGrid()"], ["state", "const [active, setActive] = useState(0);"], ["render", "<ProjectCard project={items[active]} />"], ["flow", copy.interfaceFlow]],
    TypeScript: [["interface", "ProjectCardProps { project: Project }"], ["type", "type Status = 'draft' | 'published';"], ["validate", "const card: ProjectCardProps = props;"], [copy.result, copy.safeProps]],
    JavaScript: [["event", "button.addEventListener('click', load);"], ["request", "const data = await fetch('/api/projects');"], ["update", "view.replaceChildren(render(data));"], [copy.result, copy.interfaceUpdated]],
    "C#": [["controller", "[HttpGet(\"api/projects\")]"], ["service", "await service.GetAllAsync();"], ["response", "return Ok(projects);"], ["status", "200 OK"]],
    Dapper: [["query", "SELECT id, title FROM projects"], ["map", "QueryAsync<Project>(sql);"], [copy.result, copy.typedEntities], [copy.status, copy.mappingComplete]],
    Redis: [["cache", "GET session:user:1048"], [copy.result, "CACHE HIT"], ["ttl", copy.expires], ["latency", copy.response]],
    MongoDB: [["collection", "db.properties.find({ active: true })"], ["document", "{ title, price, location }"], [copy.result, copy.documents], [copy.status, copy.queryComplete]],
    Hibernate: [["entity", "@Entity class Property"], ["repository", "repository.findAll();"], ["persist", "session.save(entity);"], [copy.status, copy.transactionCommitted]],
  };
  const lines = demonstrations[skill.name] ?? [[copy.technology, `\"${skill.name}\"`], [copy.context, `\"${skill.context}\"`], [copy.project, `\"${skill.project}\"`], ["purpose", copy.purpose]];

  return (
    <div className="skill-context-preview" role="img" aria-label={`${copy.aria} ${skill.name}`}>
      <div className="preview-top"><i /><span>~/skills/{skill.name.toLowerCase().replaceAll(" ", "-")}</span><small>{copy.realUse}</small></div>
      <div className="skill-code-body">{lines.map(([label, code], index) => <span className="skill-demo-line" key={`${label}-${index}`}><i>{String(index + 1).padStart(2, "0")}</i><code><b>{label}</b>: {code}</code></span>)}<i className="skill-code-cursor" /></div>
    </div>
  );
}

function TimelineEvent({ item, current }: { item: { date: string; title: string; text: string }; current: boolean }) {
  const event = useRef<HTMLLIElement>(null);
  const reduced = useReducedMotion();
  const visible = useInView(event, { once: true, amount: .42, margin: "0px 0px -24% 0px" });

  return (
    <m.li
      ref={event}
      className={`timeline-event ${visible ? "active" : ""} ${current ? "current" : ""}`}
      aria-current={current ? "step" : undefined}
      initial={false}
      animate={{ opacity: visible ? 1 : .56 }}
      transition={{ duration: reduced ? 0 : .52, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="timeline-node" aria-hidden="true">
        <i className="timeline-node-core" />
        <i className="timeline-node-wave" />
      </span>
      <span className="timeline-date">{item.date}</span>
      <div className="timeline-copy"><h3>{item.title}</h3><p>{item.text}</p></div>
    </m.li>
  );
}

export function Timeline({ journey }: { journey: Dictionary["academic"]["journey"] }) {
  const timeline = useRef<HTMLOListElement>(null);
  const rail = useRef<HTMLDivElement>(null);
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
        <m.span className="timeline-rail-progress" style={{ scaleY: smoothProgress }} />
        <m.span className="timeline-spark" style={{ y: sparkY, opacity: sparkOpacity }}>
          <i />
        </m.span>
      </div>
      <ol ref={timeline} className="timeline">
        {journey.map((item, index) => <TimelineEvent item={item} current={index === journey.length - 1} key={`${item.date}-${item.title}`} />)}
      </ol>
    </div>
  );
}

type BeyondCopy = Dictionary["beyond"];

function BeyondVisual({ theme, copy }: { theme: BeyondTheme; copy: BeyondCopy }) {
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
        <span className="game-score"><i /> {copy.focus}</span>
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
      <span className="learning-progress"><i /> {copy.alwaysBeta}</span>
    </div>
  );
}

function BeyondCard({ item, copy, onActive, onInactive }: { item: BeyondItem; copy: BeyondCopy; onActive: (theme: BeyondTheme) => void; onInactive: () => void }) {
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
    <m.article
      ref={card}
      className="beyond-card"
      data-theme={item.theme}
      onPointerEnter={() => onActive(item.theme)}
      onPointerMove={move}
      onPointerLeave={() => { reset(); onInactive(); }}
      onPointerCancel={() => { reset(); onInactive(); }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      data-reveal
      transition={{ duration: .28, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduced ? undefined : { y: -6 }}
    >
      <div className="beyond-card-top"><span>{item.index}</span><small>{item.label}</small><i /></div>
      <div className="beyond-visual" aria-hidden="true"><BeyondVisual theme={item.theme} copy={copy} /></div>
      <div className="beyond-card-copy">
        <h4><span>{item.title}</span><i /></h4>
        <p>{item.text}</p>
        <div className="beyond-signal"><i /><span>{item.signal}</span></div>
      </div>
    </m.article>
  );
}

export function BeyondCode({ copy }: { copy: BeyondCopy }) {
  const [activeTheme, setActiveTheme] = useState<BeyondTheme | null>(null);
  const reduced = useReducedMotion();
  const beyondCode = copy.cards as BeyondItem[];
  const contexts = copy.contexts as Record<BeyondTheme, string>;
  const context = activeTheme ? contexts[activeTheme] : copy.defaultContext;

  return (
    <div className="beyond-code" data-reveal>
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3>{copy.title}</h3></div>
        <div className="beyond-heading-context" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <m.p key={activeTheme ?? "default"} initial={reduced ? false : { opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={reduced ? undefined : { opacity: 0, y: -3 }} transition={{ duration: .22 }}>{context}</m.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="beyond-grid">{beyondCode.map((item) => <BeyondCard item={item} copy={copy} onActive={setActiveTheme} onInactive={() => setActiveTheme(null)} key={item.title} />)}</div>
    </div>
  );
}

export function HomeEffects({ message }: { message: string }) {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const hero = document.getElementById("inicio");
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
    if (navigator.hardwareConcurrency <= 4 || (memory !== undefined && memory <= 4)) root.dataset.motionProfile = "reduced-effects";
    const updateVisibility = () => { root.dataset.pageHidden = String(document.hidden); };
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    const observer = new IntersectionObserver(([entry]) => {
      root.dataset.heroActive = String(entry.isIntersecting);
    });
    if (hero) observer.observe(hero);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateVisibility);
      delete root.dataset.motionProfile;
      delete root.dataset.pageHidden;
      delete root.dataset.heroActive;
    };
  }, []);

  useEffect(() => {
    const sequence = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let progress = 0;
    let hideTimer = 0;
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest("input, textarea, [contenteditable]")) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      progress = key === sequence[progress] ? progress + 1 : key === sequence[0] ? 1 : 0;
      if (progress !== sequence.length) return;
      progress = 0;
      setUnlocked(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setUnlocked(false), 4200);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("keydown", handleKey);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return <AnimatePresence>{unlocked && <m.div className="easter-toast" role="status" initial={{ opacity: .8, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><StatusDot />{message}</m.div>}</AnimatePresence>;
}

export function CopyEmail({ email, copy }: { email: string; copy: Dictionary["contact"] }) {
  const [feedback, setFeedback] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setFeedback("idle"), 2000);
  }

  return (
    <button type="button" className={`button button-secondary ${feedback === "copied" ? "success" : ""}`} onClick={copyEmail}>
      {feedback === "copied" ? <CheckIcon /> : <CopyIcon />}
      <span aria-live="polite">{feedback === "copied" ? copy.copied : feedback === "failed" ? copy.copyFailed : copy.copy}</span>
    </button>
  );
}
