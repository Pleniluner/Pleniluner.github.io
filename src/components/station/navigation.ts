"use client";

import { useEffect, useRef, useState } from "react";

const start = { anchor: "top", directory: "top", openFolds: "" };

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

function foldKey(fold: HTMLDetailsElement) {
  return fold.dataset.readingFold ?? fold.id;
}

/** Prefer the innermost open note at the reading line, then the nearest visible one. */
function visibleFold(folds: HTMLDetailsElement[], section: HTMLElement, headerBottom: number, line: number) {
  let best: HTMLDetailsElement | undefined;
  let distance = Infinity;
  for (const fold of folds) {
    if (!section.contains(fold)) continue;
    const rect = fold.getBoundingClientRect();
    if (!rect.height || rect.bottom <= headerBottom || rect.top >= window.innerHeight) continue;
    const gap = Math.max(0, rect.top - line, line - rect.bottom);
    if (gap < distance || (gap === distance && best?.contains(fold))) {
      best = fold;
      distance = gap;
    }
  }
  return best?.dataset.readingFold ? `note-${best.dataset.readingFold}` : best?.id;
}

export function useReadingPosition() {
  const headerRef = useRef<HTMLElement>(null);
  const [position, setPosition] = useState(start);

  useEffect(() => {
    const header = headerRef.current;
    const shell = header?.closest<HTMLElement>(".station-home");
    const sections = Array.from(shell?.querySelectorAll<HTMLElement>("main > section") ?? []);
    if (!header || !shell || !sections.length) return;
    const progress = shell.querySelector<HTMLElement>("[data-scroll-progress]");
    const folds = Array.from(shell.querySelectorAll<HTMLDetailsElement>("main details:is([data-reading-fold], [id])"));
    function applyFoldLink(initial: boolean) {
      const requested = new Set(new URLSearchParams(window.location.search).get("open")?.split("."));
      const linked = document.getElementById(window.location.hash.slice(1));
      for (const fold of folds) {
        if (requested.has(foldKey(fold)) || (linked && fold.contains(linked))) fold.open = true;
        else if (!initial) fold.open = false;
      }
    }
    applyFoldLink(true); // Keep any notes the reader opened before hydration.

    let frame = 0;
    let pageWidth = 0;
    let previous = start;
    let opened = folds.filter(fold => fold.open);
    let openFolds = opened.map(foldKey).join(".");
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

      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const fraction = scrollRange > 0 ? Math.max(0, Math.min(1, window.scrollY / scrollRange)) : 0;
      progress?.style.setProperty("--scroll-progress", String(fraction));

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
      const fold = visibleFold(opened, section, headerBottom, readingLine);
      if (fold) anchor = fold;
      if (anchor !== previous.anchor || directory !== previous.directory || openFolds !== previous.openFolds) {
        previous = { anchor, directory, openFolds };
        setPosition(previous);
      }
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onFoldToggle = (event: Event) => {
      if (!(event.target instanceof HTMLDetailsElement) || !folds.includes(event.target)) return;
      opened = folds.filter(fold => fold.open);
      openFolds = opened.map(foldKey).join(".");
      const url = new URL(window.location.href);
      if (openFolds) url.searchParams.set("open", openFolds);
      else url.searchParams.delete("open");
      const linked = document.getElementById(url.hash.slice(1));
      if (!event.target.open && linked && event.target.contains(linked)) {
        const panel = event.target.closest<HTMLElement>("[data-subject]");
        const section = event.target.closest<HTMLElement>("main > section");
        url.hash = panel?.dataset.subject ?? section?.id ?? "";
      }
      if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
      schedule();
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) needsRestore = true;
      schedule();
    };
    const onPopState = () => { applyFoldLink(false); schedule(); };
    const resize = new ResizeObserver(schedule);
    const selection = new MutationObserver(schedule);
    resize.observe(document.body);
    resize.observe(header);
    for (const section of sections) {
      resize.observe(section);
      selection.observe(section, { attributes: true, attributeFilter: ["data-reading-anchor"] });
    }
    schedule();
    shell.addEventListener("toggle", onFoldToggle, true);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("popstate", onPopState);
    return () => {
      resize.disconnect();
      selection.disconnect();
      cancelAnimationFrame(frame);
      shell.style.removeProperty("--station-page-width");
      shell.removeEventListener("toggle", onFoldToggle, true);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return { headerRef, ...position };
}
