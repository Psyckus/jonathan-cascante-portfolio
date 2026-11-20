import type { Locale } from "./config";

const snapshotDeadline = 400;
let displayedLocale: Locale | undefined;
let pending: { locale: Locale; release: () => void } | undefined;

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function navigateWithLocaleTransition(locale: Locale, navigate: () => void) {
  if (pending?.locale === locale) return;
  if (!document.startViewTransition || prefersReducedMotion()) {
    navigate();
    return;
  }

  pending?.release();
  let deadline = 0;
  let complete = () => {};
  const committed = new Promise<void>((resolve) => { complete = resolve; });
  const request = {
    locale,
    release() {
      window.clearTimeout(deadline);
      complete();
    },
  };
  pending = request;

  const transition = document.startViewTransition(() => {
    navigate();
    return committed;
  });

  function cleanUp() {
    request.release();
    if (pending === request) pending = undefined;
  }

  // A slow route can finish in the background without holding the old frame.
  deadline = window.setTimeout(() => {
    transition.skipTransition();
    cleanUp();
  }, snapshotDeadline);

  // Skipping the snapshot rejects ready, independently of the navigation.
  void transition.ready.catch(() => {});
  void transition.updateCallbackDone.catch(() => {});
  void transition.finished.then(cleanUp, cleanUp);
}

export function localeDidCommit(locale: Locale) {
  const previous = displayedLocale;
  displayedLocale = locale;

  if (pending?.locale === locale) {
    pending.release();
    return;
  }

  if (!previous || previous === locale || prefersReducedMotion() || typeof Element.prototype.animate !== "function") return;

  const veil = document.createElement("div");
  veil.className = "locale-transition-veil";
  veil.setAttribute("aria-hidden", "true");
  document.body.append(veil);
  const fade = veil.animate([{ opacity: .18 }, { opacity: 0 }], { duration: 200, easing: "ease-out" });
  const remove = () => veil.remove();
  void fade.finished.then(remove, remove);
}
