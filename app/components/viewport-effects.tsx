"use client";

import { useEffect } from "react";

export function ViewportEffects() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const page = document.querySelector("main");
    if (!page) return;

    const seen = new WeakSet<Element>();
    const reveals = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        const initial = !seen.has(target);
        seen.add(target);
        if (!isIntersecting) continue;
        if (!initial) target.classList.add("is-revealed");
        reveals.unobserve(target);
      }
    }, { threshold: .12 });
    const animations = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) target.classList.toggle("is-in-view", isIntersecting);
    }, { rootMargin: "80px 0px" });

    page.querySelectorAll("[data-reveal]").forEach((element) => reveals.observe(element));
    page.querySelectorAll("[data-animate-when-visible]").forEach((element) => animations.observe(element));

    return () => {
      reveals.disconnect();
      animations.disconnect();
    };
  }, []);

  return null;
}
