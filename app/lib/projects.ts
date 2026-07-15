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

export const projects: Project[] = [
  {
    slug: "casanet",
    index: "01",
    title: "Casa Net",
    shortTitle: "Casa Net",
    label: "Plataforma web · Proyecto personal",
    description:
      "Ecosistema inmobiliario desarrollado con .NET 8: publicación de propiedades, mapas, carga de imágenes, autenticación, notificaciones y una experiencia administrativa completa.",
    technologies: ["ASP.NET Core MVC", "Dapper", "Redis", "SignalR", "MySQL"],
    accent: "orange",
    mark: "CN",
    problem:
      "Publicar, organizar y consultar propiedades suele implicar información dispersa, procesos manuales y una experiencia distinta para clientes y administradores.",
    objective:
      "Construir una plataforma inmobiliaria integral que centralizara propiedades, clientes, ubicaciones, archivos y comunicación sin sacrificar velocidad ni claridad.",
    participation:
      "Diseñé y desarrollé la solución end-to-end: arquitectura, modelo de datos, backend, vistas Razor, autenticación, integraciones, carga de archivos y experiencia administrativa.",
    architecture:
      "La aplicación usa una arquitectura MVC por capas. Los controladores coordinan servicios de negocio y repositorios Dapper; MySQL persiste la información, Redis gestiona sesiones y caché, SignalR distribuye eventos en tiempo real y servicios externos cubren correo, OAuth, mapas e imágenes.",
    challenges: [
      "Mantener sesiones resilientes y rápidas con Redis.",
      "Procesar imágenes y archivos sin afectar la experiencia de publicación.",
      "Sincronizar notificaciones en tiempo real entre áreas administrativas.",
      "Integrar OAuth, reCAPTCHA, mapas y correo bajo un flujo coherente.",
    ],
    result:
      "Una plataforma desplegada en producción con flujos completos para publicación, búsqueda, administración y comunicación inmobiliaria.",
    learnings:
      "Profundicé en diseño por capas, observabilidad de flujos, seguridad web, optimización de consultas y decisiones de UX para productos con múltiples tipos de usuario.",
    flow: ["Usuario", "ASP.NET MVC", "Service", "Repository", "MySQL"],
    integrations: ["Redis", "SignalR", "SMTP", "OAuth", "Leaflet"],
    demoUrl: "https://casanetcr.com",
    githubUrl: "https://github.com/Psyckus",
  },
  {
    slug: "ccss",
    index: "02",
    title: "Gestión institucional CCSS",
    shortTitle: "CCSS",
    label: "Proyecto de graduación · Caso real",
    description:
      "Sistema institucional para automatizar procesos administrativos, aplicar reglas de negocio, mejorar la trazabilidad y facilitar el seguimiento operativo.",
    technologies: ["Oracle APEX", "Oracle Database", "REST APIs", "PL/SQL", "JavaScript"],
    accent: "blue",
    mark: "CCSS",
    problem:
      "Procesos administrativos distribuidos entre controles manuales dificultaban la trazabilidad, la consulta de disponibilidad y el seguimiento oportuno de cada solicitud.",
    objective:
      "Digitalizar procesos institucionales para siete edificios, centralizando solicitudes, estados, validaciones y reportes en una experiencia operativa consistente.",
    participation:
      "Colaboré en levantamiento de requerimientos, diseño de módulos administrativos, integraciones REST, validaciones de negocio, documentación y pruebas funcionales con usuarios del proceso.",
    architecture:
      "La solución concentra interfaz y lógica operativa en Oracle APEX, utiliza PL/SQL para reglas y procedimientos, Oracle Database para persistencia e integra componentes mediante APIs REST.",
    challenges: [
      "Traducir reglas operativas reales en validaciones consistentes.",
      "Mantener trazabilidad entre solicitudes, responsables y estados.",
      "Diseñar pantallas claras para usuarios con distintos niveles técnicos.",
      "Documentar y validar los flujos con evidencia funcional.",
    ],
    result:
      "Un sistema institucional orientado a reducir tareas manuales, mejorar el control operativo y facilitar el seguimiento de procesos administrativos.",
    learnings:
      "Fortalecí la comunicación con usuarios, el análisis de requerimientos, el diseño de reglas de negocio y la importancia de validar una solución en su contexto real.",
    flow: ["Funcionario", "Oracle APEX", "REST API", "PL/SQL", "Oracle DB"],
    integrations: ["Reportes", "Validaciones", "Auditoría", "Dashboards"],
    githubUrl: "https://github.com/Psyckus",
  },
  {
    slug: "api-transferencias",
    index: "03",
    title: "Transferencias interbancarias",
    shortTitle: "API Transferencias",
    label: "Aplicación móvil + API",
    description:
      "Flujo seguro para registrar transferencias, validar fondos y autorizaciones, consultar moneda, mostrar el detalle de la operación y enviar confirmaciones por correo.",
    technologies: ["Flutter", "C#", "Web API", "SQL", "SMTP"],
    accent: "green",
    mark: "API",
    problem:
      "Una transferencia necesita validar múltiples condiciones antes de ejecutarse y comunicar el resultado con claridad sin duplicar operaciones ni ocultar errores.",
    objective:
      "Crear un flujo móvil sencillo respaldado por una API capaz de validar saldo, estado, autorización y datos de la operación antes de registrar y notificar.",
    participation:
      "Desarrollé el formulario en Flutter, los diálogos de confirmación y detalle, además de los endpoints C# para registro, consulta de moneda y envío de correo.",
    architecture:
      "Flutter captura y valida la intención del usuario; una Web API en C# aplica reglas de negocio, consulta y persiste en SQL, y SMTP envía la confirmación de la operación.",
    challenges: [
      "Coordinar validaciones de interfaz y servidor sin duplicar lógica crítica.",
      "Evitar operaciones inválidas por saldo, estado o autorización.",
      "Presentar el detalle de la transferencia antes de confirmar.",
      "Manejar respuestas y errores de forma comprensible en móvil.",
    ],
    result:
      "Un flujo completo y verificable desde la captura de datos hasta el registro y la notificación por correo.",
    learnings:
      "Mejoré el diseño de contratos API, manejo de estados asíncronos y separación entre validaciones de experiencia y reglas críticas del servidor.",
    flow: ["Usuario móvil", "Flutter", "C# Web API", "Service", "SQL"],
    integrations: ["SMTP", "Moneda", "Autorización", "Logs"],
    githubUrl: "https://github.com/Psyckus",
  },
];

export const projectBySlug = (slug: ProjectSlug) =>
  projects.find((project) => project.slug === slug)!;

export type TechnologyIconId =
  | "api"
  | "bootstrap"
  | "database"
  | "docker"
  | "dotnet"
  | "flutter"
  | "git"
  | "github"
  | "hibernate"
  | "html5"
  | "css"
  | "javascript"
  | "jquery"
  | "jsonwebtokens"
  | "mongodb"
  | "mysql"
  | "openid"
  | "openjdk"
  | "php"
  | "postman"
  | "python"
  | "react"
  | "redis"
  | "springboot"
  | "swagger"
  | "typescript";

export type Skill = {
  name: string;
  context: string;
  project: string;
  use: string;
  icon: TechnologyIconId;
  color: `#${string}`;
  preview?: ProjectSlug;
};

export type SkillCategory = {
  id: "backend" | "frontend" | "datos" | "herramientas";
  label: string;
  description: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "backend",
    label: "Backend",
    description: "APIs, reglas de negocio, seguridad y servicios empresariales.",
    skills: [
      { name: "C#", context: "Backend, APIs e integraciones.", project: "Casa Net · Transferencias interbancarias · Lover2023Cuc", use: "Lógica de negocio, servicios, validaciones y endpoints REST.", icon: "dotnet", color: "#9B72E9", preview: "api-transferencias" },
      { name: ".NET 8", context: "Plataformas web empresariales.", project: "Casa Net", use: "Runtime principal para una aplicación MVC moderna, escalable y desplegada.", icon: "dotnet", color: "#512BD4", preview: "casanet" },
      { name: "ASP.NET Core", context: "Backend y aplicaciones MVC.", project: "Casa Net · APIs en C#", use: "Controladores, servicios, autenticación, middleware y flujos web.", icon: "dotnet", color: "#7857D9", preview: "casanet" },
      { name: "ASP.NET MVC", context: "Aplicaciones web por capas.", project: "Lover2023Cuc · Proyectos académicos", use: "Separación de responsabilidades mediante modelos, vistas y controladores.", icon: "dotnet", color: "#7857D9" },
      { name: "REST APIs", context: "Integración entre interfaces y servicios.", project: "CCSS · Casa Net · Transferencias interbancarias", use: "Contratos HTTP para consultar, validar y registrar operaciones.", icon: "api", color: "#FF8A3D", preview: "ccss" },
      { name: "PHP", context: "Backend web y módulos administrativos.", project: "Módulos de parqueo y multimedia CCSS · Laravel API", use: "Lógica del servidor, reglas operativas, autenticación y acceso a datos.", icon: "php", color: "#777BB4", preview: "ccss" },
      { name: "Python", context: "Automatización y herramientas técnicas.", project: "Administración remota de servicios · Scripts y APIs", use: "Automatización de procesos, control de servicios Windows/Linux y utilidades.", icon: "python", color: "#4B8BBE" },
      { name: "Java", context: "Aplicaciones orientadas a objetos.", project: "Sistemas Java y proyectos académicos", use: "Modelado de dominio, lógica empresarial y construcción de servicios.", icon: "openjdk", color: "#E4EAF2" },
      { name: "Spring Boot", context: "Servicios backend con Java.", project: "Sistemas Java", use: "Creación de APIs, configuración de servicios y arquitectura por capas.", icon: "springboot", color: "#6DB33F" },
      { name: "Entity Framework", context: "Persistencia en aplicaciones .NET.", project: "Aplicaciones ASP.NET Core", use: "ORM para modelar entidades, relaciones y operaciones sobre bases de datos.", icon: "dotnet", color: "#8B6DE9" },
      { name: "Dapper", context: "Acceso a datos de alto control.", project: "Casa Net", use: "Consultas SQL explícitas, mapeo liviano y repositorios eficientes.", icon: "database", color: "#D9A05B", preview: "casanet" },
      { name: "Hibernate", context: "Persistencia en aplicaciones Java.", project: "Sistemas Java", use: "ORM para mapear entidades y gestionar operaciones de persistencia.", icon: "hibernate", color: "#BCAE79" },
      { name: "JWT", context: "Seguridad de APIs.", project: "APIs de autenticación y proyectos web", use: "Emisión y validación de tokens para proteger recursos y sesiones.", icon: "jsonwebtokens", color: "#E4EAF2" },
      { name: "OAuth2", context: "Inicio de sesión e identidad externa.", project: "Casa Net · Integración con Google", use: "Autenticación delegada y acceso seguro mediante proveedores externos.", icon: "openid", color: "#F78C40", preview: "casanet" },
      { name: "SignalR", context: "Comunicación en tiempo real.", project: "Casa Net", use: "Notificaciones instantáneas y actualización de información sin recargar.", icon: "dotnet", color: "#9B72E9", preview: "casanet" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    description: "Interfaces responsive, claras y conectadas con procesos reales.",
    skills: [
      { name: "HTML5", context: "Estructura semántica de interfaces web.", project: "Casa Net · CCSS · Aplicaciones web", use: "Construcción de vistas accesibles, formularios y contenido estructurado.", icon: "html5", color: "#E34F26", preview: "casanet" },
      { name: "CSS3", context: "Diseño responsive y sistemas visuales.", project: "Casa Net · Dashboards · Portafolio", use: "Layouts, adaptación móvil, estados visuales y microinteracciones.", icon: "css", color: "#7A5AF8", preview: "casanet" },
      { name: "JavaScript", context: "Interacción en el navegador.", project: "Casa Net · CCSS · Aplicaciones administrativas", use: "Validaciones, eventos, consumo de APIs y comportamiento dinámico.", icon: "javascript", color: "#F7DF1E", preview: "ccss" },
      { name: "TypeScript", context: "Aplicaciones frontend y componentes React con tipado estático.", project: "Portafolio profesional y proyectos web modernos.", use: "Tipado seguro, mantenibilidad, reducción de errores y mejor organización del código.", icon: "typescript", color: "#3178C6" },
      { name: "React", context: "Desarrollo de interfaces modernas basadas en componentes.", project: "Portafolio profesional y aplicaciones frontend.", use: "Componentes reutilizables, estado, interacción y construcción de interfaces dinámicas.", icon: "react", color: "#61DAFB" },
      { name: "Bootstrap", context: "Interfaces web responsive.", project: "Casa Net · Sistemas administrativos", use: "Componentes, grids, modales y adaptación consistente entre dispositivos.", icon: "bootstrap", color: "#7952B3", preview: "casanet" },
      { name: "jQuery", context: "Flujos administrativos dinámicos.", project: "Casa Net · Módulos CCSS", use: "Eventos, peticiones asíncronas, tablas y manipulación controlada de interfaz.", icon: "jquery", color: "#3C9BD7", preview: "ccss" },
      { name: "Razor", context: "Vistas del ecosistema ASP.NET.", project: "Casa Net", use: "Renderizado de interfaces MVC conectadas con ViewModels y lógica del servidor.", icon: "dotnet", color: "#9B72E9", preview: "casanet" },
      { name: "Flutter", context: "Aplicaciones móviles multiplataforma.", project: "Transferencias interbancarias", use: "Formularios, navegación, diálogos y estados asíncronos en móvil.", icon: "flutter", color: "#4FC3F7", preview: "api-transferencias" },
    ],
  },
  {
    id: "datos",
    label: "Bases de datos",
    description: "Modelado, consultas, procedimientos, caché y persistencia.",
    skills: [
      { name: "SQL Server", context: "Persistencia en aplicaciones Microsoft.", project: "Lover2023Cuc · Aplicaciones ASP.NET", use: "Modelado relacional, consultas y operaciones transaccionales.", icon: "database", color: "#CC5252" },
      { name: "MySQL", context: "Persistencia de aplicaciones web.", project: "Casa Net · Sistemas PHP · Laravel API", use: "Diseño relacional, consultas, reportes y soporte de flujos empresariales.", icon: "mysql", color: "#5B9DB5", preview: "casanet" },
      { name: "Oracle Database", context: "Datos institucionales.", project: "Proyecto de graduación CCSS", use: "Persistencia, relaciones y soporte de procesos administrativos.", icon: "database", color: "#F05B5B", preview: "ccss" },
      { name: "Oracle APEX", context: "Desarrollo low-code empresarial.", project: "Proyecto de graduación CCSS", use: "Módulos administrativos, dashboards y flujos conectados con Oracle.", icon: "database", color: "#F05B5B", preview: "ccss" },
      { name: "MongoDB", context: "Persistencia documental.", project: "Prototipo inmobiliario Next.js + Prisma", use: "Almacenamiento flexible de propiedades con estructuras y colecciones complejas.", icon: "mongodb", color: "#58B96B" },
      { name: "Redis", context: "Sesiones y caché distribuida.", project: "Casa Net", use: "Sesiones resilientes, renovación controlada y reducción de accesos repetitivos.", icon: "redis", color: "#FF5A52", preview: "casanet" },
      { name: "PL/SQL", context: "Lógica cercana a los datos.", project: "Proyecto de graduación CCSS", use: "Procedimientos, consultas y validaciones dentro del ecosistema Oracle.", icon: "database", color: "#F05B5B", preview: "ccss" },
    ],
  },
  {
    id: "herramientas",
    label: "Herramientas",
    description: "Flujo de trabajo, documentación, pruebas y despliegue.",
    skills: [
      { name: "Git", context: "Control de versiones.", project: "Todos los proyectos principales", use: "Historial de cambios, ramas y evolución segura del código.", icon: "git", color: "#F05A42" },
      { name: "GitHub", context: "Colaboración y portafolio técnico.", project: "Casa Net · APIs · Proyectos personales", use: "Repositorios, respaldo, revisión y presentación del trabajo.", icon: "github", color: "#E4EAF2" },
      { name: "Postman", context: "Pruebas de servicios HTTP.", project: "APIs REST en C#, PHP y Laravel", use: "Validación de endpoints, cuerpos, autenticación y respuestas.", icon: "postman", color: "#FF6C37" },
      { name: "Swagger", context: "Documentación de APIs.", project: "Web APIs con ASP.NET Core", use: "Exploración, documentación y prueba de contratos REST.", icon: "swagger", color: "#85EA2D" },
      { name: "Docker", context: "Entornos reproducibles.", project: "Prácticas y entornos de desarrollo", use: "Contenedores para aislar dependencias y preparar despliegues consistentes.", icon: "docker", color: "#2496ED" },
    ],
  },
];

export const skills = skillCategories.flatMap((category) => category.skills);
