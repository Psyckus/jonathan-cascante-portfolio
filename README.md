# Portafolio de Jonathan Cascante

Código fuente completo del portafolio profesional de Jonathan Cascante.

Está construido con:

- Next.js 16
- React 19
- TypeScript
- Framer Motion
- Tailwind CSS 4 / CSS personalizado

El proyecto genera un sitio estático en la carpeta `out`, por lo que puede alojarse fuera de ChatGPT sin necesitar una base de datos ni un servidor especializado.

## Requisitos

- Node.js 20.9 o superior
- npm 10 o superior

Se recomienda Node.js 22.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Abre `http://localhost:3000` en el navegador.

## Verificaciones

```bash
npm run typecheck
npm run lint
npm run build
```

Después de ejecutar `npm run build`, el sitio listo para publicar queda en:

```text
out/
```

El paquete entregado ya incluye una compilación verificada en `out/`. Puedes subir esa carpeta directamente o regenerarla después de modificar el código.

Puedes revisar esa versión con:

```bash
npm start
```

## Despliegue

### Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. Importa el repositorio en Vercel.
3. Vercel detectará Next.js automáticamente.
4. Usa `npm run build` como comando de compilación.

### Netlify

- Build command: `npm run build`
- Publish directory: `out`

### Cloudflare Pages

- Framework preset: Next.js (Static HTML Export)
- Build command: `npm run build`
- Build output directory: `out`

### Hosting tradicional

Ejecuta `npm run build` y sube todo el contenido de `out/` al directorio público de tu hosting.

## Estructura principal

```text
app/
├── components/       Componentes del portafolio, casos de estudio e interacciones
├── lib/              Proyectos, tecnologías y contenido reutilizable
├── projects/         Páginas individuales de cada caso de estudio
├── globals.css       Sistema visual, responsive y animaciones
├── layout.tsx        Metadatos y fuentes
└── page.tsx          Página principal

public/
├── Jonathan-Cascante-CV.pdf
└── favicon.svg
```

## Dónde actualizar el contenido

- Proyectos, tecnologías y experiencia: `app/lib/projects.ts`
- Contenido de la página principal: `app/components/portfolio-home.tsx`
- Casos de estudio: `app/components/case-study.tsx`
- Estilos y responsive: `app/globals.css`
- CV descargable: `public/Jonathan-Cascante-CV.pdf`

## Consideraciones

- El correo y los enlaces profesionales están definidos en `app/components/portfolio-home.tsx`.
- El CV se publica como un archivo descargable dentro de `public/`.
- Las animaciones respetan `prefers-reduced-motion` y reducen efectos en dispositivos de menor capacidad.
- No se incluyen archivos internos de ChatGPT, credenciales, cachés, compilaciones previas ni dependencias instaladas.

## Licencia

Este proyecto y su contenido pertenecen a Jonathan Cascante. Puedes modificarlo y desplegarlo para uso personal y profesional.
