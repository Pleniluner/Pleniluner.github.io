"use client";

import { useEffect, useRef, useState } from "react";

const start = { anchor: "top", directory: "top" };

export function isHistoryTraversal() {
  const [entry] = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
  return entry?.type === "back_forward";
}

// A prior hash can be a different chapter after the reader has scrolled.
export function rememberReadingPosition(anchor: string) {
  const target = document.getElementById(anchor);
  if (!target) return;
  const stationReading = { id: anchor, top: target.getBoundingClientRect().top };
  window.history.replaceState({ ...window.history.state, stationReading }, "");
}

function restoreReadingPosition() {
  const { stationReading, ...state } = window.history.state ?? {};
  if (!stationReading) return;
  const target = typeof stationReading.id === "string" ? document.getElementById(stationReading.id) : null;
  if (target && Number.isFinite(stationReading.top)) {
    window.scrollBy({ top: target.getBoundingClientRect().top - stationReading.top, behavior: "instant" });
  }
  window.history.replaceState(state, "");
}

export function useReadingPosition() {
  const headerRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(start);

  useEffect(() => {
    const header = headerRef.current;
    const shell = header?.closest<HTMLElement>(".station-home");
    const sections = Array.from(shell?.querySelectorAll<HTMLElement>("main > section") ?? []);
    if (!header || !shell || !sections.length) return;

    let frame = 0;
    let pageWidth = 0;
    let previous = start;
    let needsRestore = isHistoryTraversal();
    const update = () => {
      frame = 0;
      const width = document.body.getBoundingClientRect().width;
      if (width > 0 && width !== pageWidth) {
        shell.style.setProperty("--station-page-width", `${width}px`);
        pageWidth = width;
      }

      if (needsRestore && document.readyState === "complete") {
        needsRestore = false;
        restoreReadingPosition();
      }

      const headerBottom = header.getBoundingClientRect().bottom;
      const readingLine = headerBottom + (window.innerHeight - headerBottom) / 4;
      const section = sections.find(item => item.getBoundingClientRect().bottom > readingLine) ?? sections[sections.length - 1];
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      header.classList.toggle("is-over-content", section.dataset.tone !== "dark");

      const directory = section.dataset.nav ?? section.id;
      let anchor = section.dataset.readingAnchor ?? section.id;
      // Keep a deep link such as the music player while it is still on screen.
      const hash = window.location.hash;
      const linked = hash && document.getElementById(hash.slice(1));
      if (!section.dataset.readingAnchor && linked && linked !== section && section.contains(linked)) {
        const rect = linked.getBoundingClientRect();
        if (rect.bottom > headerBottom && rect.top < window.innerHeight) anchor = linked.id;
      }
      if (anchor !== previous.anchor || directory !== previous.directory) {
        previous = { anchor, directory };
        setPosition(previous);
      }
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) needsRestore = true;
      schedule();
    };
    const resize = new ResizeObserver(schedule);
    const selection = new MutationObserver(schedule);
    resize.observe(document.body);
    resize.observe(header);
    for (const section of sections) {
      resize.observe(section);
      selection.observe(section, { attributes: true, attributeFilter: ["data-reading-anchor"] });
    }
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("pageshow", onPageShow);
    return () => {
      resize.disconnect();
      selection.disconnect();
      cancelAnimationFrame(frame);
      shell.style.removeProperty("--station-page-width");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, []);

  return { headerRef, ...position };
}
