import type { SimpleIcon } from "simple-icons";
import {
  siBootstrap,
  siCss,
  siDocker,
  siDotnet,
  siFlutter,
  siGit,
  siGithub,
  siHibernate,
  siHtml5,
  siJavascript,
  siJquery,
  siJsonwebtokens,
  siMongodb,
  siMysql,
  siOpenid,
  siOpenjdk,
  siPhp,
  siPostman,
  siPython,
  siReact,
  siRedis,
  siSpringboot,
  siSwagger,
  siTypescript,
} from "simple-icons";
import type { TechnologyIconId } from "../lib/projects";

export const dynamic = "force-static";

const brandIcons: Partial<Record<TechnologyIconId, SimpleIcon>> = {
  bootstrap: siBootstrap,
  css: siCss,
  docker: siDocker,
  dotnet: siDotnet,
  flutter: siFlutter,
  git: siGit,
  github: siGithub,
  hibernate: siHibernate,
  html5: siHtml5,
  javascript: siJavascript,
  jquery: siJquery,
  jsonwebtokens: siJsonwebtokens,
  mongodb: siMongodb,
  mysql: siMysql,
  openid: siOpenid,
  openjdk: siOpenjdk,
  php: siPhp,
  postman: siPostman,
  python: siPython,
  react: siReact,
  redis: siRedis,
  springboot: siSpringboot,
  swagger: siSwagger,
  typescript: siTypescript,
};

export function GET() {
  const symbols = Object.entries(brandIcons).map(([id, icon]) => `<symbol id="${id}" viewBox="0 0 24 24"><path d="${icon.path}"/></symbol>`);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg">${symbols.join("")}</svg>`;
  return new Response(svg, { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } });
}
