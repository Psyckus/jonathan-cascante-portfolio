import { siGithub } from "simple-icons";

export function ArrowIcon({ size = 20 }: { size?: number }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}><path d="M5 12h13M13 6l6 6-6 6" /></svg>;
}

export function ExternalIcon({ size = 18 }: { size?: number }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}><path d="M14 5h5v5M19 5l-9 9M19 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" /></svg>;
}

export function DownloadIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="M12 3v12m-5-5 5 5 5-5M5 20h14" /></svg>;
}

export function CopyIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
}

export function CheckIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18"><path d="m5 12 4 4L19 6" /></svg>;
}

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return <svg aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 11v5M8 8v.01M12 16v-5m0 2.2c.7-1.5 4-1.6 4 1.3V16" /></svg>;
}

export function GitHubIcon({ size = 18 }: { size?: number }) {
  return <svg className="brand-icon" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size}><path d={siGithub.path} /></svg>;
}

export type TechType = "api" | "db" | "service" | "deploy";

export function TechIcon({ type }: { type: TechType }) {
  const paths = {
    api: <path d="M8 4H5v16h3M16 4h3v16h-3M10 8l4 8m0-8-4 8" />,
    db: <><ellipse cx="12" cy="6" rx="7" ry="3" /><path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" /></>,
    service: <path d="M4 8l8-4 8 4-8 4-8-4Zm0 0v8l8 4 8-4V8M12 12v8" />,
    deploy: <path d="M7 18H5a3 3 0 0 1-.4-6A7.5 7.5 0 0 1 19 10.5 4 4 0 0 1 19 18h-2M12 10v10m-4-4 4 4 4-4" />,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">{paths[type]}</svg>;
}
