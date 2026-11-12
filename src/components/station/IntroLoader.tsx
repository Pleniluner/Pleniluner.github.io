"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { bootMotion } from "./rhine-timing/boot-motion";
import { StationMark } from "./StationMark";

// Timing data is adapted from RhineLabUI; attribution is in rhine-timing/LICENSE.
const TIMELINE_START = 1.76;
const TIMELINE_END = 20.9;
const EXIT_DURATION = 800;

function arc(radius: number, start: number, sweep: number, x = 960, y = 540) {
  const point = (angle: number) => `${x + Math.cos(angle) * radius},${y + Math.sin(angle) * radius}`;
  if (sweep >= Math.PI * 1.999) {
    return `M${point(start)}A${radius},${radius} 0 1 1 ${point(start + Math.PI)}A${radius},${radius} 0 1 1 ${point(start + Math.PI * 2)}`;
  }
  return `M${point(start)}A${radius},${radius} 0 ${sweep > Math.PI ? 1 : 0} 1 ${point(start + sweep)}`;
}

export function IntroLoader() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const replay = new URLSearchParams(window.location.search).get("intro") === "1";
    const skipsForAnchor = !replay && Boolean(window.location.hash);
    if (reduced.matches || skipsForAnchor) {
      root.dataset.stationIntro = "done";
      let active = true;
      queueMicrotask(() => { if (active) setVisible(false); });
      if (skipsForAnchor) window.requestAnimationFrame(() => {
        let id = window.location.hash.slice(1);
        try { id = decodeURIComponent(id); } catch { /* Leave malformed anchors inert. */ }
        document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
      });
      return () => { active = false; delete root.dataset.stationIntro; };
    }

    const previousOverflow = document.body.style.overflow;
    let finished = false;
    let leaving = false;
    let frame = 0;
    let exitTimer = 0;
    const startedAt = performance.now();
    const finish = () => {
      if (finished) return;
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = previousOverflow;
      root.dataset.stationIntro = "done";
      setVisible(false);
    };
    const safetyTimer = window.setTimeout(finish, (TIMELINE_END - TIMELINE_START) * 1000 + EXIT_DURATION + 2000);
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Tab", "Enter", " ", "ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) finish();
    };
    const tick = (now: number) => {
      if (finished) return;
      const overlay = overlayRef.current;
      if (overlay) {
        const motion = bootMotion(Math.min(TIMELINE_END, TIMELINE_START + (now - startedAt) / 1000));
        const set = (name: string, value: number) => overlay.style.setProperty(name, String(value));
        overlay.dataset.phase = motion.step;
        set("--access-alpha", motion.accessOpacity);
        set("--logo-alpha", Number(motion.logoOpacity));
        set("--logo-shift", motion.logo.offsetX);
        set("--logo-symbol-alpha", motion.logo.symbolScale);
        set("--logo-text-alpha", motion.logoLetters.length / 9);
        set("--auth-alpha", motion.authOpacity);
        set("--brand-alpha", motion.brand[0].opacity);
        set("--scan-alpha", motion.scanVisible ? motion.ringOpacity : 0);
        set("--scan-message-alpha", motion.scanVisible ? motion.permissionOpacity : 0);
        set("--welcome-alpha", motion.welcomeVisible ? motion.welcomeOpacity : 0);
        set("--welcome-scale", motion.welcomeScale);
        set("--welcome-highlight", motion.highlight);
        set("--welcome-detail-alpha", Number(motion.companyVisible));
        set("--welcome-flash", motion.welcomePanel);

        const access = overlay.querySelector<HTMLElement>(".intro-loader__access");
        if (access) access.textContent = "A SIGNAL FROM THE STARS".slice(0, motion.access.length);
        const auth = overlay.querySelector<HTMLElement>(".intro-loader__auth-text");
        if (auth) {
          const line = motion.f < 363 ? "SIGNAL FOUND : PLENILUNER" : motion.f < 421 ? "STATION READY" : "OPENING STATION...";
          auth.textContent = line.slice(0, motion.auth.length);
        }
        overlay.querySelectorAll<SVGPathElement>(".intro-loader__mark-path").forEach(contour => {
          const drawn = Math.min(1, motion.logo.length / 0.96);
          contour.style.strokeDasharray = `${drawn} 1`;
          contour.style.strokeDashoffset = "0";
        });
        const scan = motion.scan;
        const paths = overlay.querySelectorAll<SVGPathElement>(".intro-loader__scan-path");
        if (motion.scanVisible && paths.length === 6) {
          const rings = paths[0].parentElement;
          if (rings) {
            rings.setAttribute("transform", `translate(960 540) scale(${motion.ringScale}) translate(-960 -540)`);
            rings.style.filter = `blur(${motion.ringBlur}px)`;
          }
          paths[0].setAttribute("d", arc(scan.radius, scan.outerStart, scan.outerSweep));
          paths[1].setAttribute("d", arc(scan.whiteRadius, scan.whiteStart, scan.whiteSweep));
          paths[2].setAttribute("d", arc(scan.innerRadius, scan.innerStart, scan.innerSweep));
          paths[3].setAttribute("d", arc(scan.innerRadius, scan.innerStart + Math.PI, scan.innerSweep));
          motion.scanOrbit.sides.forEach((side, i) => {
            paths[i + 4].setAttribute("d", arc(side.radius, side.start, side.sweep, side.x, side.y));
            paths[i + 4].style.opacity = motion.scanOrbit.sideVisible ? "1" : "0";
          });
          overlay.querySelectorAll<SVGCircleElement>(".intro-loader__satellite").forEach((dot, i) => {
            const point = motion.scanOrbit.satellites[i];
            dot.setAttribute("cx", String(point.x));
            dot.setAttribute("cy", String(point.y));
            dot.setAttribute("r", String(point.radius));
          });
          overlay.querySelectorAll<SVGCircleElement>(".intro-loader__orbit-dot").forEach((dot, i) => {
            const angle = scan.orbit + i * Math.PI;
            dot.setAttribute("cx", String(960 + Math.cos(angle) * scan.orbitRadius));
            dot.setAttribute("cy", String(540 + Math.sin(angle) * scan.orbitRadius));
            dot.setAttribute("r", String(scan.dotRadius));
          });
          const core = overlay.querySelector<SVGCircleElement>(".intro-loader__core");
          if (core) core.setAttribute("r", String(motion.ornament ? motion.coreRadius : 0));
        }
        if (!leaving && motion.t >= TIMELINE_END + 5) {
          leaving = true;
          overlay.classList.add("is-leaving");
          exitTimer = window.setTimeout(finish, EXIT_DURATION);
        }
      }
      if (!leaving) frame = window.requestAnimationFrame(tick);
    };

    root.dataset.stationIntro = "playing";
    document.body.style.overflow = "hidden";
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("hashchange", finish);
    reduced.addEventListener("change", finish);
    return () => {
      finished = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(exitTimer);
      window.clearTimeout(safetyTimer);
      document.body.style.overflow = previousOverflow;
      delete root.dataset.stationIntro;
      window.removeEventListener("keydown", onKey, true);
      window.removeEventListener("hashchange", finish);
      reduced.removeEventListener("change", finish);
    };
  }, []);

  if (!visible) return null;
  return <><noscript><style>{".intro-loader{display:none!important}"}</style></noscript><div ref={overlayRef} className="intro-loader" aria-label={t("s135")}>
    <div className="intro-loader__corners" aria-hidden="true"><span>PLENILUNER</span><span>SPACE STATION</span><i /></div>
    <div className="intro-loader__access" aria-hidden="true" dir="ltr" />
    <div className="intro-loader__identity" aria-hidden="true" dir="ltr">
      <div className="intro-loader__mark">
        <StationMark animated />
        <span>PLENILUNER</span>
      </div>
      <div className="intro-loader__auth"><i /><span className="intro-loader__auth-text" /></div>
    </div>
    <div className="intro-loader__scanner" aria-hidden="true">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid meet">
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <path className="intro-loader__scan-path intro-loader__scan-path--muted" />
          <path className="intro-loader__scan-path" strokeWidth="4" />
          <path className="intro-loader__scan-path" /><path className="intro-loader__scan-path" />
          <path className="intro-loader__scan-path" /><path className="intro-loader__scan-path" />
          <circle className="intro-loader__orbit-dot" fill="var(--accent)" stroke="none" />
          <circle className="intro-loader__orbit-dot" fill="var(--accent)" stroke="none" />
          {Array.from({ length: 6 }, (_, i) => <circle key={i} className="intro-loader__satellite" fill="currentColor" stroke="none" />)}
          <circle className="intro-loader__core" cx="959.5" cy="539.5" fill="currentColor" stroke="none" />
        </g>
      </svg>
      <span dir="ltr">PAX OMNIBUS.</span>
    </div>
    <div className="intro-loader__welcome" aria-hidden="true">
      <span>{t("s135")}</span>
      <strong dir="ltr">PLENILUNER</strong>
      <small dir="ltr">SPACE STATION</small>
      <StationMark />
    </div>
  </div></>;
}
