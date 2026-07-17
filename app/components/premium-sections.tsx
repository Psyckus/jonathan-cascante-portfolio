"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { GitHubIcon } from "./icons";
import { useI18n } from "../i18n/i18n-provider";
import { getSkillCategories, getSkills } from "../lib/projects";

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
  const { dictionary } = useI18n();
  const copy = dictionary.portfolioStats;
  return (
    <section className="portfolio-stats" aria-label={copy.aria}>
      <ViewportCounter value={getSkills(dictionary).length} suffix="+" label={copy.technologies} />
      <ViewportCounter value={12} suffix="+" label={copy.projects} />
      <ViewportCounter value={5} suffix="+" label={copy.years} />
      <ViewportCounter value={100} suffix="%" label={copy.commitment} />
    </section>
  );
}

export function EngineeringDecisions() {
  const reduced = useReducedMotion();
  const { dictionary } = useI18n();
  const copy = dictionary.engineering;
  return (
    <section className="engineering-section" aria-labelledby="engineering-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3 id="engineering-title">{copy.title}</h3></div>
        <p>{copy.description}</p>
      </div>
      <div className="engineering-grid">
        {copy.decisions.map((decision, index) => (
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
  const { dictionary } = useI18n();
  const copy = dictionary.workProcess;
  return (
    <section className="work-process" aria-labelledby="work-process-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3 id="work-process-title">{copy.title}</h3></div>
        <p>{copy.description}</p>
      </div>
      <div className="work-process-track" role="list">
        {copy.steps.map((step, index) => (
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
  const { dictionary } = useI18n();
  const copy = dictionary.github;

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
    { label: copy.publicRepositories, value: snapshot?.repositories ?? "—" },
    { label: copy.recentCommits, value: snapshot?.commits ?? "—" },
    { label: copy.recentContributions, value: snapshot?.contributions ?? "—" },
    { label: copy.topLanguages, value: snapshot?.languages ?? copy.loading },
  ], [copy, snapshot]);

  return (
    <section ref={section} className="github-activity" aria-labelledby="github-activity-title">
      <div className="github-activity-heading">
        <div><GitHubIcon size={24} /><p className="section-kicker">{copy.kicker}</p><h3 id="github-activity-title">{copy.title}</h3></div>
        <a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">{copy.viewProfile} <span>↗</span></a>
      </div>
      {failed ? <p className="github-fallback">{copy.fallback}</p> : (
        <div className="github-metrics" aria-live="polite">
          {metrics.map((metric) => <span key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}
          <a href={snapshot?.latest?.html_url ?? "https://github.com/Psyckus"} target="_blank" rel="noreferrer"><small>{copy.latest}</small><strong>{snapshot?.latest?.name ?? copy.consulting}</strong><span>↗</span></a>
        </div>
      )}
    </section>
  );
}

type TerminalLine = { kind: "command" | "output" | "success"; text?: string; responseKey?: string; responseIndex?: number; argument?: string };

export function InteractiveTerminal() {
  const { dictionary } = useI18n();
  const copy = dictionary.terminal;
  const skillCategories = useMemo(() => getSkillCategories(dictionary), [dictionary]);
  const terminalCommands = useMemo<Record<string, string[]>>(() => ({
    help: copy.commands.help,
    about: copy.commands.about,
    skills: skillCategories.map((category) => `${category.label}: ${category.skills.map((skill) => skill.name).join(", ")}`),
    projects: copy.commands.projects,
    contact: copy.commands.contact,
    cv: copy.commands.cv,
    linkedin: ["linkedin.com/in/jonathan-cascante-dev"],
    github: ["github.com/Psyckus"],
    hire: copy.commands.hire,
    "hire jonathan": copy.commands.hire,
    "sudo hire jonathan": copy.commands.sudo,
    "npm install jonathan": copy.commands.npm,
    coffee: copy.commands.coffee,
  }), [copy, skillCategories]);
  const [lines, setLines] = useState<TerminalLine[]>([
    { kind: "output", responseKey: "welcome", responseIndex: 0 },
    { kind: "output", responseKey: "welcome", responseIndex: 1 },
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
      const responseKey = terminalCommands[command] ? command : "not-found";
      const response = terminalCommands[command] ?? [command, command];
      setLines((current) => [...current, { kind: "command", text: `$ ${input.trim()}` }, ...response.map((_, index) => ({ kind: command.includes("hire") && index === 0 ? "success" as const : "output" as const, responseKey, responseIndex: index, argument: command }))]);
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

  const lineText = (line: TerminalLine) => {
    if (line.text) return line.text;
    if (line.responseKey === "welcome") return copy.welcome[line.responseIndex ?? 0];
    if (line.responseKey === "not-found") return line.responseIndex === 0 ? `${copy.notFound}: ${line.argument}` : copy.tryHelp;
    return terminalCommands[line.responseKey ?? ""]?.[line.responseIndex ?? 0] ?? "";
  };

  return (
    <section className="terminal-section" aria-labelledby="terminal-title">
      <div className="mini-section-heading">
        <div><p className="section-kicker">{copy.kicker}</p><h3 id="terminal-title">{copy.title}</h3></div>
        <p>{copy.description}</p>
      </div>
      <div className="interactive-terminal">
        <div className="interactive-terminal-bar"><i /><i /><i /><span>jonathan@portfolio:~</span><small>{copy.interactive}</small></div>
        <div className="interactive-terminal-output" ref={output} aria-live="polite">
          {lines.map((line, index) => <p className={line.kind} key={`${line.text ?? line.responseKey}-${index}`}>{lineText(line)}</p>)}
        </div>
        <form onSubmit={submit}>
          <label htmlFor="portfolio-command"><span>jonathan@portfolio</span>:~$</label>
          <input id="portfolio-command" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={navigateHistory} autoComplete="off" spellCheck={false} aria-label={copy.inputLabel} />
          <button type="submit">{copy.run}</button>
        </form>
      </div>
    </section>
  );
}
