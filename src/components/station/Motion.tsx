"use client";

import { useEffect } from "react";

export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      root.classList.add("motion-reduced");
      return;
    }

    root.classList.add("motion-ready");

    const revealTargets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0.1 },
    );

    revealTargets.forEach((target) => observer.observe(target));

    const timers: number[] = [];
    const restoreTypedContent: Array<() => void> = [];
    const schedule = (callback: () => void, delay: number) => {
      const timer = window.setTimeout(callback, delay);
      timers.push(timer);
    };

    const introParagraphs = Array.from(
      document.querySelectorAll<HTMLElement>("[data-type-copy] > p"),
    );

    const preparedParagraphs = introParagraphs.map((target) => {
      const measuredHeight = target.getBoundingClientRect().height;
      const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      let current = walker.nextNode();

      while (current) {
        nodes.push(current as Text);
        current = walker.nextNode();
      }

      const values = nodes.map((node) => node.data);
      target.style.minHeight = `${measuredHeight}px`;
      target.querySelectorAll<HTMLAnchorElement>("a").forEach((link) => {
        const label = link.textContent?.trim();
        if (label) link.setAttribute("aria-label", label);
      });
      nodes.forEach((node) => {
        node.data = "";
      });

      restoreTypedContent.push(() => {
        nodes.forEach((node, index) => {
          node.data = values[index];
        });
        target.classList.remove("is-typing");
        target.style.removeProperty("min-height");
      });

      return { target, nodes, values };
    });

    const typeParagraph = (
      paragraph: (typeof preparedParagraphs)[number],
      delay: number,
      done?: () => void,
    ) => {
      let nodeIndex = 0;
      let characterIndex = 0;
      paragraph.target.classList.add("is-typing");

      const typeNext = () => {
        while (
          nodeIndex < paragraph.nodes.length &&
          paragraph.values[nodeIndex].length === 0
        ) {
          nodeIndex += 1;
        }

        if (nodeIndex >= paragraph.nodes.length) {
          paragraph.target.classList.remove("is-typing");
          done?.();
          return;
        }

        characterIndex += 1;
        paragraph.nodes[nodeIndex].data = paragraph.values[nodeIndex].slice(
          0,
          characterIndex,
        );

        if (characterIndex >= paragraph.values[nodeIndex].length) {
          nodeIndex += 1;
          characterIndex = 0;
        }

        schedule(typeNext, delay);
      };

      typeNext();
    };

    const typeIntro = (index: number) => {
      const paragraph = preparedParagraphs[index];
      if (!paragraph) return;

      typeParagraph(paragraph, 20, () => {
        schedule(() => typeIntro(index + 1), 140);
      });
    };

    if (preparedParagraphs.length > 0) {
      schedule(() => typeIntro(0), 760);
    }

    const progress = document.querySelector<HTMLElement>("[data-scroll-progress]");
    const moonImage = document.querySelector<HTMLElement>("[data-parallax]");
    let frame = 0;

    const updateScrollMotion = () => {
      frame = 0;
      const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = scrollRange > 0 ? window.scrollY / scrollRange : 0;

      progress?.style.setProperty("--scroll-progress", String(Math.min(1, Math.max(0, scrollProgress))));

      if (moonImage) {
        const rect = moonImage.getBoundingClientRect();
        const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
        const parallax = Math.max(-20, Math.min(20, centerOffset * -0.032));
        moonImage.style.setProperty("--parallax", `${parallax}px`);
      }
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateScrollMotion);
    };

    updateScrollMotion();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      restoreTypedContent.forEach((restore) => restore());
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("motion-ready");
    };
  }, []);

  return <div className="scroll-progress" data-scroll-progress aria-hidden="true" />;
}
