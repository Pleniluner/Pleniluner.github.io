"use client";

import { useEffect } from "react";

/** Observe reading position without intercepting native scrolling or anchors. */
export function ScrollNavigation() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>(".site-header");
    const shell = document.querySelector<HTMLElement>(".station-home");
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section"));
    let frame = 0;
    let pageWidth = 0;
    const update = () => {
      frame = 0;
      const width = document.body.getBoundingClientRect().width;
      if (width > 0 && width !== pageWidth) {
        shell?.style.setProperty("--station-page-width", `${width}px`);
        pageWidth = width;
      }
      header?.classList.toggle("is-scrolled", window.scrollY > 40);
      const marker = (header?.getBoundingClientRect().bottom ?? 80) + 24;
      const section = sections.find((item) => {
        const rect = item.getBoundingClientRect();
        return rect.top <= marker && rect.bottom > marker;
      }) ?? sections[0];
      header?.classList.toggle("is-over-content", section?.dataset.tone !== "dark");
      header?.querySelectorAll<HTMLAnchorElement>("nav a").forEach((link) => {
        if (link.hash === `#${section?.dataset.nav ?? section?.id}`) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    sections.forEach((section) => observer.observe(section));
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      shell?.style.removeProperty("--station-page-width");
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);
  return null;
}
