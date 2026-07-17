import { getDictionary, type Dictionary } from "../i18n/config";

export type ProjectSlug = "casanet" | "ccss" | "api-transferencias";

export type Project = {
  slug: ProjectSlug;
  index: string;
  title: string;
  shortTitle: string;
  label: string;
  description: string;
  technologies: string[];
  accent: "orange" | "blue" | "green";
  mark: string;
  problem: string;
  objective: string;
  participation: string;
  architecture: string;
  challenges: string[];
  result: string;
  learnings: string;
  flow: string[];
  integrations: string[];
  demoUrl?: string;
  githubUrl: string;
};

const projectDefinitions = [
  { slug: "casanet", index: "01", technologies: ["ASP.NET Core MVC", "Dapper", "Redis", "SignalR", "MySQL"], accent: "orange", mark: "CN", demoUrl: "https://casanetcr.com", githubUrl: "https://github.com/Psyckus" },
  { slug: "ccss", index: "02", technologies: ["Oracle APEX", "Oracle Database", "REST APIs", "PL/SQL", "JavaScript"], accent: "blue", mark: "CCSS", githubUrl: "https://github.com/Psyckus" },
  { slug: "api-transferencias", index: "03", technologies: ["Flutter", "C#", "Web API", "SQL", "SMTP"], accent: "green", mark: "API", githubUrl: "https://github.com/Psyckus" },
] as const;

export function getProjects(dictionary: Dictionary): Project[] {
  return projectDefinitions.map((definition, index) => ({ ...definition, ...dictionary.projects[index], technologies: [...definition.technologies], challenges: [...dictionary.projects[index].challenges], flow: [...dictionary.projects[index].flow], integrations: [...dictionary.projects[index].integrations] }));
}

export function getProjectBySlug(dictionary: Dictionary, slug: ProjectSlug) {
  return getProjects(dictionary).find((project) => project.slug === slug)!;
}

export type TechnologyIconId =
  | "api" | "bootstrap" | "database" | "docker" | "dotnet" | "flutter" | "git" | "github"
  | "hibernate" | "html5" | "css" | "javascript" | "jquery" | "jsonwebtokens" | "mongodb"
  | "mysql" | "openid" | "openjdk" | "php" | "postman" | "python" | "react" | "redis"
  | "springboot" | "swagger" | "typescript";

export type Skill = {
  name: string;
  context: string;
  project: string;
  use: string;
  icon: TechnologyIconId;
  color: `#${string}`;
  preview?: ProjectSlug;
};

export type SkillCategoryId = "backend" | "frontend" | "datos" | "herramientas";
export type SkillCategory = { id: SkillCategoryId; label: string; description: string; skills: Skill[] };
type SkillDefinition = Pick<Skill, "name" | "icon" | "color" | "preview">;

const skillDefinitions: Array<{ id: SkillCategoryId; skills: SkillDefinition[] }> = [
  {
    id: "backend",
    skills: [
      { name: "C#", icon: "dotnet", color: "#9B72E9", preview: "api-transferencias" },
      { name: ".NET 8", icon: "dotnet", color: "#512BD4", preview: "casanet" },
      { name: "ASP.NET Core", icon: "dotnet", color: "#7857D9", preview: "casanet" },
      { name: "ASP.NET MVC", icon: "dotnet", color: "#7857D9" },
      { name: "REST APIs", icon: "api", color: "#FF8A3D", preview: "ccss" },
      { name: "PHP", icon: "php", color: "#777BB4", preview: "ccss" },
      { name: "Python", icon: "python", color: "#4B8BBE" },
      { name: "Java", icon: "openjdk", color: "#E4EAF2" },
      { name: "Spring Boot", icon: "springboot", color: "#6DB33F" },
      { name: "Entity Framework", icon: "dotnet", color: "#8B6DE9" },
      { name: "Dapper", icon: "database", color: "#D9A05B", preview: "casanet" },
      { name: "Hibernate", icon: "hibernate", color: "#BCAE79" },
      { name: "JWT", icon: "jsonwebtokens", color: "#E4EAF2" },
      { name: "OAuth2", icon: "openid", color: "#F78C40", preview: "casanet" },
      { name: "SignalR", icon: "dotnet", color: "#9B72E9", preview: "casanet" }
    ]
  },
  {
    id: "frontend",
    skills: [
      { name: "HTML5", icon: "html5", color: "#E34F26", preview: "casanet" },
      { name: "CSS3", icon: "css", color: "#7A5AF8", preview: "casanet" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E", preview: "ccss" },
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3", preview: "casanet" },
      { name: "jQuery", icon: "jquery", color: "#3C9BD7", preview: "ccss" },
      { name: "Razor", icon: "dotnet", color: "#9B72E9", preview: "casanet" },
      { name: "Flutter", icon: "flutter", color: "#4FC3F7", preview: "api-transferencias" }
    ]
  },
  {
    id: "datos",
    skills: [
      { name: "SQL Server", icon: "database", color: "#CC5252" },
      { name: "MySQL", icon: "mysql", color: "#5B9DB5", preview: "casanet" },
      { name: "Oracle Database", icon: "database", color: "#F05B5B", preview: "ccss" },
      { name: "Oracle APEX", icon: "database", color: "#F05B5B", preview: "ccss" },
      { name: "MongoDB", icon: "mongodb", color: "#58B96B" },
      { name: "Redis", icon: "redis", color: "#FF5A52", preview: "casanet" },
      { name: "PL/SQL", icon: "database", color: "#F05B5B", preview: "ccss" }
    ]
  },
  {
    id: "herramientas",
    skills: [
      { name: "Git", icon: "git", color: "#F05A42" },
      { name: "GitHub", icon: "github", color: "#E4EAF2" },
      { name: "Postman", icon: "postman", color: "#FF6C37" },
      { name: "Swagger", icon: "swagger", color: "#85EA2D" },
      { name: "Docker", icon: "docker", color: "#2496ED" }
    ]
  }
];

export function getSkillCategories(dictionary: Dictionary): SkillCategory[] {
  return skillDefinitions.map((category, categoryIndex) => {
    const copy = dictionary.skillCategories[categoryIndex];
    return {
      id: category.id,
      label: copy.label,
      description: copy.description,
      skills: category.skills.map((skill, skillIndex) => ({ ...skill, ...copy.skills[skillIndex] })),
    };
  });
}

export function getSkills(dictionary: Dictionary) {
  return getSkillCategories(dictionary).flatMap((category) => category.skills);
}

export const projects = getProjects(getDictionary("es"));
export const skillCategories = getSkillCategories(getDictionary("es"));
export const skills = skillCategories.flatMap((category) => category.skills);
export const projectBySlug = (slug: ProjectSlug) => projects.find((project) => project.slug === slug)!;
