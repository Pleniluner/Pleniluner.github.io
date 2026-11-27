"use client";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { flushSync } from "react-dom";
import { useLanguage } from "./i18n/LanguageProvider";
import { locales, localeInfo, localeHref, type Locale } from "./i18n/locales";
import { StationMark } from "./StationMark";
import { DirectorySearch, indexDirectory } from "./DirectorySearch";
import { readingLinkEvent, rememberReadingPosition, useReadingPosition } from "./navigation";
export function SiteHeader() {
  const { locale, t } = useLanguage();
  const { headerRef, anchor, directory, subject, openFolds } = useReadingPosition();
  const [panel, setPanel] = useState<"language" | "directory" | null>(null);
  const [entries, setEntries] = useState<ReturnType<typeof indexDirectory>>([]);
  const controls = useRef<HTMLDivElement>(null);
  const languageButton = useRef<HTMLButtonElement>(null);
  const directoryButton = useRef<HTMLButtonElement>(null);
  function chooseLanguage(event: MouseEvent<HTMLAnchorElement>, next: Locale) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setPanel(null);
    if (next !== locale) {
      rememberReadingPosition(anchor);
      return;
    }
    event.preventDefault();
    languageButton.current?.focus({ preventScroll: true });
  }
  function toggleDirectory() {
    if (panel !== "directory") setEntries(indexDirectory());
    setPanel(panel === "directory" ? null : "directory");
  }
  function readResult(target: HTMLElement, href: string) {
    const url = new URL(href, window.location.href);
    if (url.href !== window.location.href) {
      rememberReadingPosition(anchor);
      window.history.pushState(null, "", url);
    }
    // Open the parent notes and commit the selected tab before moving focus.
    flushSync(() => {
      setPanel(null);
      window.dispatchEvent(new Event(readingLinkEvent));
    });
    if (!target.matches("a, button, summary, [tabindex]")) target.tabIndex = -1;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: "start", behavior: "instant" });
  }
  useEffect(() => {
    if (!panel) return;
    const outside = (event: PointerEvent) => {
      if (event.target instanceof Node && !controls.current?.contains(event.target)) setPanel(null);
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || event.isComposing) return;
      event.preventDefault();
      setPanel(null);
      (panel === "language" ? languageButton : directoryButton).current?.focus();
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", outside); document.removeEventListener("keydown", escape); };
  }, [panel]);
  return <header className="site-header compact-header" ref={headerRef}>
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
          onClick={toggleDirectory}>
          <span>{t("s129")}</span>
          <svg className="header-control__menu" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
            <path d={panel === "directory" ? "m5 5 14 14M5 19 19 5" : "M4 8h16M4 16h16"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <div id="header-language" className="header-popover header-language" hidden={panel !== "language"} inert={panel !== "language"}>
        <div className="language-grid" role="group" aria-label={t("s130")}>{locales.map(item =>
          <a key={item.id} href={`${localeHref(item.id)}${openFolds ? `?open=${openFolds}` : ""}#${anchor}`} hrefLang={item.id} lang={item.id} dir={item.dir}
            aria-current={locale === item.id ? "page" : undefined}
            onClick={event => chooseLanguage(event, item.id)}>
            <span>{item.label}</span><span aria-hidden="true">{locale === item.id ? "✓" : ""}</span>
          </a>
        )}</div>
      </div>
      <DirectorySearch open={panel === "directory"} directory={directory} subject={subject} openFolds={openFolds} entries={entries}
        onRead={readResult} onNavigate={() => { setPanel(null); directoryButton.current?.focus({ preventScroll: true }); }} />
    </div>
  </header>;
}
