"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { GitHubIcon } from "./icons";
import { skillCategories, skills } from "../lib/projects";

const engineeringDecisions = [
  { technology: "Dapper", question: "¿Por qué Dapper?", answer: "Porque los módulos críticos necesitaban consultas SQL explícitas, rápidas y fáciles de optimizar.", signal: "Control + rendimiento" },
  { technology: "Redis", question: "¿Por qué Redis?", answer: "Para mantener sesiones resilientes y reducir accesos repetitivos a la base de datos.", signal: "Sesiones + caché" },
  { technology: "ASP.NET Core", question: "¿Por qué ASP.NET Core?", answer: "Por su arquitectura modular, tipado sólido y un ecosistema preparado para aplicaciones mantenibles.", signal: "Arquitectura limpia" },
  { technology: "SignalR", question: "¿Por qué SignalR?", answer: "Para comunicar cambios en tiempo real sin obligar al usuario a recargar la interfaz.", signal: "Tiempo real" },
  { technology: "JWT", question: "¿Por qué JWT?", answer: "Para desacoplar la autenticación y proteger contratos API de forma predecible.", signal: "Seguridad + contratos" },
] as const;

const workflow = [
  { index: "01", title: "Analizar", detail: "Entender el problema y el contexto." },
  { index: "02", title: "Diseñar", detail: "Definir flujos, datos y responsabilidades." },
  { index: "03", title: "Desarrollar", detail: "Construir por capas y validar temprano." },
  { index: "04", title: "Probar", detail: "Cubrir reglas, errores y casos reales." },
  { index: "05", title: "Documentar", detail: "Dejar decisiones y contratos claros." },
  { index: "06", title: "Entregar", detail: "Publicar, observar y mejorar." },
] as const;

function ViewportCounter({ value, suffix = "", label }: { value: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { once: true, amount: .65 });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      const timer = window.setTimeout(() => setCount(value), 0);
      return () => window.clearTimeout(timer);
    }
    const startedAt = performance.now();
    let frame = 0;
    const animate = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / 900);
      setCount(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [reduced, value, visible]);

  return <span ref={ref}><strong>{reduced ? value : count}{suffix}</strong><small>{label}</small></span>;
}

export function PortfolioStats() {
  return (
    <section className="portfolio-stats" aria-label="Resumen profesional">
      <ViewportCounter value={skills.length} suffix="+" label="Tecnologías" />
      <ViewportCounter value={12} suffix="+" label="Proyectos" />
      <ViewportCounter value={5} suffix="+" label="Años aprendiendo" />
      <ViewportCounter value={100} suffix="%" label="Compromiso" />
    </section>
  );
}

export function EngineeringDecisions() {
  const reduced = useReducedMotion();
  return (
    <section className="engineering-section" aria-labelledby="engineering-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">Decisiones técnicas</p><h3 id="engineering-title">Ingeniería detrás del código.</h3></div>
        <p>No se trata solo de conocer herramientas, sino de entender cuándo aportan valor y qué compromiso introduce cada decisión.</p>
      </div>
      <div className="engineering-grid">
        {engineeringDecisions.map((decision, index) => (
          <motion.article key={decision.technology} initial={reduced ? false : { opacity: 0, y: 14 }} whileInView={reduced ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: .35 }} transition={{ duration: .5, delay: index * .055, ease: [0.22, 1, 0.36, 1] }}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h4>{decision.question}</h4>
            <i aria-hidden="true">↓</i>
            <p>{decision.answer}</p>
            <small>{decision.signal}</small>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

export function WorkProcess() {
  const reduced = useReducedMotion();
  return (
    <section className="work-process" aria-labelledby="work-process-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">Cómo trabajo</p><h3 id="work-process-title">Del problema a una entrega confiable.</h3></div>
        <p>Un proceso claro reduce retrabajo, hace visibles las decisiones y mantiene el foco en el valor del producto.</p>
      </div>
      <div className="work-process-track" role="list">
        {workflow.map((step, index) => (
          <motion.div role="listitem" key={step.title} initial={reduced ? false : { opacity: 0, x: -8 }} whileInView={reduced ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .42, delay: index * .06 }}>
            <span>{step.index}</span><i aria-hidden="true" /><h4>{step.title}</h4><p>{step.detail}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

type GitHubUser = { public_repos: number };
type GitHubRepo = { fork: boolean; html_url: string; language: string | null; name: string; pushed_at: string };
type GitHubEvent = { payload?: { commits?: unknown[] }; type: string };
type GitHubSnapshot = { commits: number; contributions: number; languages: string; latest: GitHubRepo | null; repositories: number };

export function GitHubActivity() {
  const section = useRef<HTMLElement>(null);
  const visible = useInView(section, { once: true, amount: .12 });
  const [snapshot, setSnapshot] = useState<GitHubSnapshot | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!visible || snapshot || failed) return;
    const controller = new AbortController();
    const headers = { Accept: "application/vnd.github+json" };
    Promise.all([
      fetch("https://api.github.com/users/Psyckus", { headers, signal: controller.signal }),
      fetch("https://api.github.com/users/Psyckus/repos?per_page=100&sort=pushed", { headers, signal: controller.signal }),
      fetch("https://api.github.com/users/Psyckus/events/public?per_page=100", { headers, signal: controller.signal }),
    ])
      .then(async ([userResponse, repoResponse, eventResponse]) => {
        if (!userResponse.ok || !repoResponse.ok || !eventResponse.ok) throw new Error("GitHub API unavailable");
        const [user, repositories, events] = await Promise.all([
          userResponse.json() as Promise<GitHubUser>,
          repoResponse.json() as Promise<GitHubRepo[]>,
          eventResponse.json() as Promise<GitHubEvent[]>,
        ]);
        const ownRepositories = repositories.filter((repository) => !repository.fork);
        const languages = new Map<string, number>();
        ownRepositories.forEach((repository) => {
          if (repository.language) languages.set(repository.language, (languages.get(repository.language) ?? 0) + 1);
        });
        const topLanguages = [...languages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([language]) => language);
        const commits = events.reduce((total, event) => total + (event.type === "PushEvent" ? event.payload?.commits?.length ?? 0 : 0), 0);
        setSnapshot({ repositories: user.public_repos, commits, contributions: events.length, languages: topLanguages.join(" · ") || "C# · TypeScript", latest: ownRepositories[0] ?? null });
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") setFailed(true);
      });
    return () => controller.abort();
  }, [failed, snapshot, visible]);

  const metrics = useMemo(() => [
    { label: "Repositorios públicos", value: snapshot?.repositories ?? "—" },
    { label: "Commits públicos recientes", value: snapshot?.commits ?? "—" },
    { label: "Contribuciones recientes", value: snapshot?.contributions ?? "—" },
    { label: "Lenguajes principales", value: snapshot?.languages ?? "Cargando" },
  ], [snapshot]);

  return (
    <section ref={section} className="github-activity" aria-labelledby="github-activity-title">
      <div className="github-activity-heading">
        <div><GitHubIcon size={24} /><p className="section-kicker">GitHub público</p><h3 id="github-activity-title">Construcción visible, aprendizaje continuo.</h3></div>
        <a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">Ver perfil <span>↗</span></a>
      </div>
      {failed ? <p className="github-fallback">La actividad no está disponible en este momento. El perfil y los repositorios siguen accesibles directamente en GitHub.</p> : (
        <div className="github-metrics" aria-live="polite">
          {metrics.map((metric) => <span key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}
          <a href={snapshot?.latest?.html_url ?? "https://github.com/Psyckus"} target="_blank" rel="noreferrer"><small>Último proyecto actualizado</small><strong>{snapshot?.latest?.name ?? "Consultando GitHub…"}</strong><span>↗</span></a>
        </div>
      )}
    </section>
  );
}

type TerminalLine = { kind: "command" | "output" | "success"; text: string };

const terminalCommands: Record<string, string[]> = {
  help: ["Comandos: about · skills · projects · contact · cv · linkedin · github · hire · clear"],
  about: ["Jonathan Cascante · Full Stack Developer", "C# / .NET · APIs REST · Aplicaciones empresariales"],
  skills: skillCategories.map((category) => `${category.label}: ${category.skills.map((skill) => skill.name).join(", ")}`),
  projects: ["01 Casa Net", "02 Gestión institucional CCSS", "03 Transferencias interbancarias"],
  contact: ["Email: jonathan.cz141998@gmail.com", "Disponible para oportunidades Full Stack junior."],
  cv: ["CV listo: /Jonathan-Cascante-CV.pdf"],
  linkedin: ["linkedin.com/in/jonathan-cascante-dev"],
  github: ["github.com/Psyckus"],
  hire: ["Permission granted.", "Welcome aboard. Let's build something useful."],
  "hire jonathan": ["Permission granted.", "Welcome aboard. Let's build something useful."],
  "sudo hire jonathan": ["sudo: permiso concedido sin contraseña.", "Jonathan is ready to ship."],
  "npm install jonathan": ["added 1 highly motivated developer in 0.8s", "0 vulnerabilities found."],
  coffee: ["Brewing clean architecture… ☕", "Status: ready to code."],
};

export function InteractiveTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "output", text: "Portfolio CLI v1.0.0" },
    { kind: "output", text: "Escribe “help” para explorar." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const output = useRef<HTMLDivElement>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setLines([]);
    } else {
      const response = terminalCommands[command] ?? [`command not found: ${command}`, "Prueba con “help”."];
      setLines((current) => [...current, { kind: "command", text: `$ ${input.trim()}` }, ...response.map((text, index) => ({ kind: command.includes("hire") && index === 0 ? "success" as const : "output" as const, text }))]);
    }
    setHistory((current) => [input.trim(), ...current.filter((item) => item !== input.trim())].slice(0, 12));
    setHistoryIndex(-1);
    setInput("");
  };

  const navigateHistory = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const next = event.key === "ArrowUp" ? Math.min(history.length - 1, historyIndex + 1) : Math.max(-1, historyIndex - 1);
    setHistoryIndex(next);
    setInput(next === -1 ? "" : history[next] ?? "");
  };

  useEffect(() => {
    if (output.current) output.current.scrollTop = output.current.scrollHeight;
  }, [lines]);

  return (
    <section className="terminal-section" aria-labelledby="terminal-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">Portfolio CLI</p><h3 id="terminal-title">Una terminal para explorar el perfil.</h3></div>
        <p>Comandos cortos, información real y algunos easter eggs para quienes prueban más de lo evidente.</p>
      </div>
      <div className="interactive-terminal">
        <div className="interactive-terminal-bar"><i /><i /><i /><span>jonathan@portfolio:~</span><small>interactive</small></div>
        <div className="interactive-terminal-output" ref={output} aria-live="polite">
          {lines.map((line, index) => <p className={line.kind} key={`${line.text}-${index}`}>{line.text}</p>)}
        </div>
        <form onSubmit={submit}>
          <label htmlFor="portfolio-command"><span>jonathan@portfolio</span>:~$</label>
          <input id="portfolio-command" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={navigateHistory} autoComplete="off" spellCheck={false} aria-label="Escribir comando en la terminal" />
          <button type="submit">Ejecutar</button>
        </form>
      </div>
    </section>
  );
}
