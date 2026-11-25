"use client";

import { useEffect, useRef } from "react";

/** Track the cover for the reading header; each other entrance plays once. */
export function Motion() {
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = progress.current?.closest(".station-home");
    if (!shell || !("IntersectionObserver" in window)) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cover = shell.querySelector("main > #top");
    const coverObserver = new IntersectionObserver(([entry]) => {
      // A fixed threshold keeps the scroll boundary independent of the header's height.
      shell.classList.toggle("is-reading", !entry.isIntersecting && entry.boundingClientRect.bottom <= (entry.rootBounds?.top ?? 0));
    }, { rootMargin: "-52px 0px 0px" });
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

    if (cover) coverObserver.observe(cover);
    targets.forEach(target => observer.observe(target));
    reduced.addEventListener("change", syncPreference);
    return () => {
      observer.disconnect();
      coverObserver.disconnect();
      shell.classList.remove("is-reading");
      reduced.removeEventListener("change", syncPreference);
      clearEntrances();
    };
  }, []);

  return <div ref={progress} className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}
