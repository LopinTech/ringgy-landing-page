"use client";

import { useEffect } from "react";

/**
 * Fades `[data-reveal]` elements up as they scroll into view. Only elements
 * that start below the fold are hidden, so server-rendered content above it
 * never flashes, and everything is force-shown after a safety timeout.
 */
export function ScrollReveal() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const vh = window.innerHeight || 800;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]")).filter(
      (el) => el.getBoundingClientRect().top > vh * 0.9,
    );
    els.forEach((el) => el.setAttribute("data-hidden", ""));

    const show = (el: HTMLElement) => {
      if (!el.hasAttribute("data-hidden")) return;
      el.removeAttribute("data-hidden");
      el.setAttribute("data-shown", "");
    };

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            show(e.target as HTMLElement);
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const safety = setTimeout(() => els.forEach(show), 6000);

    return () => {
      io.disconnect();
      clearTimeout(safety);
      els.forEach(show);
    };
  }, []);

  return null;
}
