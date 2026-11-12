"use client";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { locales, localeInfo, localeHref } from "./i18n/locales";
import { StationMark } from "./StationMark";
const links = [["top","s055"],["about","s058"],["now","s077"],["computing","s143"],["interests","s083"],["gear","s085"],["contact","s095"]];
export function SiteHeader() {
  const { locale, t } = useLanguage();
  const [panel, setPanel] = useState<"language" | "directory" | null>(null);
  const controls = useRef<HTMLDivElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const directoryButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!panel) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controls.current?.contains(event.target)) setPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setPanel(null);
      (panel === "language" ? languageButton : directoryButton).current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [panel]);
  return <header className="site-header compact-header">
    <a className="wordmark" href="#top" aria-label="清月空间站 ~ Pleniluner’s Space Station">
      <StationMark className="station-logo" />
      <span className="station-identity">
        <span className="station-name" lang="zh-CN">清月空间站</span>
        <small lang="en" dir="ltr">~ Pleniluner’s Space Station</small>
      </span>
    </a>
    <div className="header-controls" ref={controls} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setPanel(null);
    }}>
      <div className="header-controls__bar">
        <button type="button" ref={languageButton} className="header-control header-control--language" aria-label={t("s126")}
          aria-expanded={panel === "language"} aria-controls="header-language"
          onClick={() => setPanel(panel === "language" ? null : "language")}>
          <span className="header-control__language-name" lang={locale} dir={localeInfo(locale).dir}>{localeInfo(locale).label}</span>
          <span className="header-control__chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" focusable="false">
              <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
        <button type="button" ref={directoryButton} className="header-control header-control--directory" aria-label={t("s127")}
          aria-expanded={panel === "directory"} aria-controls="header-directory"
          onClick={() => setPanel(panel === "directory" ? null : "directory")}>
          <span>{t("s129")}</span>
          <svg className="header-control__menu" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d={panel === "directory" ? "m5 5 14 14M5 19 19 5" : "M4 8h16M4 16h16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div id="header-language" className="header-popover header-language" hidden={panel !== "language"}>
        <div className="language-grid" role="group" aria-label={t("s130")}>{locales.map(item =>
          <a key={item.id} href={localeHref(item.id)} hrefLang={item.id} lang={item.id} dir={item.dir}
            aria-current={locale === item.id ? "page" : undefined}
            onClick={event => { event.currentTarget.href = localeHref(item.id) + (window.location.hash || "#top"); }}>
            <span>{item.label}</span><span aria-hidden="true">{locale === item.id ? "✓" : ""}</span>
          </a>
        )}</div>
      </div>
      <nav id="header-directory" className="header-popover header-directory" aria-label={t("s131")} hidden={panel !== "directory"}>
        <div className="header-directory__links">{links.map(([id,key]) =>
          <a key={id} href={"#" + id} onClick={() => {setPanel(null); directoryButton.current?.focus();}}>{t(key)}</a>
        )}</div>
      </nav>
    </div>
  </header>;
}
