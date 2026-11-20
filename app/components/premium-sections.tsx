"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { GitHubIcon } from "./icons";
import type { Dictionary } from "../i18n/config";
import type { SkillCategory } from "../lib/projects";

type GitHubUser = { public_repos: number };
type GitHubRepo = { fork: boolean; html_url: string; language: string | null; name: string; pushed_at: string };
type GitHubEvent = { payload?: { commits?: unknown[] }; type: string };
type GitHubSnapshot = { commits: number; contributions: number; languages: string; latest: GitHubRepo | null; repositories: number };

export function GitHubActivity({ copy }: { copy: Dictionary["github"] }) {
  const section = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = section.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { rootMargin: "150px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
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
    { label: copy.publicRepositories, value: snapshot?.repositories ?? "—" },
    { label: copy.recentCommits, value: snapshot?.commits ?? "—" },
    { label: copy.recentContributions, value: snapshot?.contributions ?? "—" },
    { label: copy.topLanguages, value: snapshot?.languages ?? (failed ? "—" : copy.loading) },
  ], [copy, failed, snapshot]);

  return (
    <section ref={section} className="github-activity" aria-labelledby="github-activity-title">
      <div className="github-activity-heading">
        <div><GitHubIcon size={24} /><p className="section-kicker">{copy.kicker}</p><h3 id="github-activity-title">{copy.title}</h3></div>
        <a href="https://github.com/Psyckus" target="_blank" rel="noreferrer">{copy.viewProfile} <span>↗</span></a>
      </div>
      <div className="github-metrics" aria-live="polite">
          {metrics.map((metric) => <span key={metric.label}><strong>{metric.value}</strong><small>{metric.label}</small></span>)}
          <a href={snapshot?.latest?.html_url ?? "https://github.com/Psyckus"} target="_blank" rel="noreferrer"><small>{copy.latest}</small><strong>{snapshot?.latest?.name ?? (failed ? copy.viewProfile : copy.consulting)}</strong><span>↗</span></a>
        </div>
    </section>
  );
}

type TerminalLine = { kind: "command" | "output" | "success"; text?: string; responseKey?: string; responseIndex?: number; argument?: string };

let terminalSession: { lines: TerminalLine[]; input: string; history: string[]; historyIndex: number } | undefined;

export function InteractiveTerminal({ copy, categories, cv }: { copy: Dictionary["terminal"]; categories: SkillCategory[]; cv: string }) {
  const terminalCommands = useMemo<Record<string, string[]>>(() => ({
    help: copy.commands.help,
    about: copy.commands.about,
    skills: categories.map((category) => `${category.label}: ${category.skills.map((skill) => skill.name).join(", ")}`),
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
  }), [copy, categories]);
  const [lines, setLines] = useState<TerminalLine[]>(terminalSession?.lines ?? [
    { kind: "output", responseKey: "welcome", responseIndex: 0 },
    { kind: "output", responseKey: "welcome", responseIndex: 1 },
  ]);
  const [input, setInput] = useState(terminalSession?.input ?? "");
  const [history, setHistory] = useState<string[]>(terminalSession?.history ?? []);
  const [historyIndex, setHistoryIndex] = useState(terminalSession?.historyIndex ?? -1);
  const output = useRef<HTMLDivElement>(null);
  useEffect(() => { terminalSession = { lines, input, history, historyIndex }; }, [lines, input, history, historyIndex]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;
    if (command === "clear") {
      setLines([]);
    } else {
      const recognized = Object.hasOwn(terminalCommands, command);
      const responseKey = recognized ? command : "not-found";
      const response = recognized ? terminalCommands[command] : [command, command];
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
          {lines.map((line, index) => <p className={line.kind} key={`${line.text ?? line.responseKey}-${index}`}>{line.responseKey === "cv" && line.responseIndex === 0 ? <a href={cv} download>{lineText(line)}</a> : lineText(line)}</p>)}
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
