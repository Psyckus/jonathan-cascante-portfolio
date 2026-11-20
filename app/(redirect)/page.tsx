const redirectLocale = `(() => {
  const match = document.cookie.match(/(?:^|;\\s*)portfolio-locale=(es|en)(?:;|$)/);
  const locale = match?.[1] ?? (/^es(?:-|$)/i.test(navigator.language) ? "es" : "en");
  location.replace("/" + locale + "/" + location.search + location.hash);
})();`;

export default function Home() {
  return (
    <main>
      <script dangerouslySetInnerHTML={{ __html: redirectLocale }} />
      <h1>Jonathan Cascante</h1>
      {/* Plain links keep this fallback useful before hydration and without scripts. */}
      <p>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/es/" hrefLang="es">Español</a>{" · "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/en/" hrefLang="en" lang="en">English</a>
      </p>
    </main>
  );
}
