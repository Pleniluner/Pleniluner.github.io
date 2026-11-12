"use client";

import { useEffect } from "react";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);

export function SceneTransitions() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const scenes = Array.from(document.querySelectorAll<HTMLElement>(
      ".station-home [data-scene-art]:not(.section-artwork--complete)",
    ));
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches) return;
      const viewport = Math.max(window.innerHeight, 1);
      scenes.forEach((scene) => {
        const section = scene.closest<HTMLElement>("section");
        if (!section) return;
        const bounds = section.getBoundingClientRect();
        const arrival = smooth(clamp((viewport - bounds.top) / viewport));
        const progress = 1 - arrival;
        scene.style.setProperty("--scene-shift", `${(progress * 13).toFixed(2)}vh`);
        scene.style.setProperty("--scene-scale", (1 + progress * 0.14).toFixed(3));
        section.style.setProperty("--scene-title-shift", `${(progress * 7).toFixed(2)}vh`);
        section.classList.toggle("scene-in-motion", bounds.top < viewport && bounds.bottom > 0 && progress > 0.001);
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    const sync = () => {
      root.classList.toggle("scene-motion", !reduced.matches);
      if (!reduced.matches) schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", sync);
    sync();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", sync);
      window.cancelAnimationFrame(frame);
      root.classList.remove("scene-motion");
      scenes.forEach((scene) => {
        ["--scene-shift", "--scene-scale"].forEach((property) => scene.style.removeProperty(property));
        const section = scene.closest<HTMLElement>("section");
        section?.style.removeProperty("--scene-title-shift");
        section?.classList.remove("scene-in-motion");
      });
    };
  }, []);
  return null;
}
