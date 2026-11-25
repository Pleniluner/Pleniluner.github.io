"use client";

import { useEffect, useRef } from "react";

/** A section plays its entrance once. Its text is visible even before hydration. */
export function Motion() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = progress.current?.closest(".station-home");
    if (!shell || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = shell.querySelectorAll("[data-reveal], [data-scene-art]:not(.section-artwork--complete)");
    const clearEntrances = () => targets.forEach(target => target.classList.remove("is-visible"));
    const syncPreference = () => { if (reduced.matches) clearEntrances(); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (!reduced.matches) entry.target.classList.add("is-visible");
      }
    }, { rootMargin: "0px 0px -24px", threshold: 0 });

    targets.forEach(target => observer.observe(target));
    reduced.addEventListener("change", syncPreference);
    return () => {
      observer.disconnect();
      reduced.removeEventListener("change", syncPreference);
      clearEntrances();
    };
  }, []);

  return <div ref={progress} className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}
