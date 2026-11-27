"use client";

import { useLayoutEffect, useReducer, useRef, type KeyboardEvent } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { ProfileContent, profile } from "./ProfileContent";
import { SectionArtwork } from "./SectionArtwork";
import { fieldSubjects as subjects, readingLinkEvent } from "./navigation";

type SubjectId = typeof subjects[number]["id"];
type Selection = { id: SubjectId; backward: boolean; enhanced: boolean };

function changeSubject(previous: Selection, id: SubjectId): Selection {
  if (previous.enhanced && previous.id === id) return previous;
  const index = (key: SubjectId) => subjects.findIndex(subject => subject.id === key);
  return { id, backward: index(id) < index(previous.id), enhanced: true };
}

function FieldSymbol({ id }: { id: SubjectId }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.9"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {id === "computing" && <>
        <path className="field-symbol__detail" d="M17 5v5m7-5v5m7-5v5M17 38v5m7-5v5m7-5v5M5 17h5m-5 7h5m-5 7h5m28-14h5m-5 7h5m-5 7h5" />
        <path className="field-symbol__face" d="M14 10h18l6 6v17l-5 5H15l-5-5V14Z" />
        <path d="m19 20-4 4 4 4m10-8 4 4-4 4" />
        <path className="field-symbol__accent" d="m25.6 18.5-3.2 11" />
      </>}
      {id === "tools" && <>
        <path className="field-symbol__face" d="M7 9h29l6 6v21l-3 3H8l-3-3V11Z" />
        <path className="field-symbol__detail" d="M6 18h35" />
        <g fill="currentColor" stroke="none"><circle cx="11" cy="13.5" r="1.2" /><circle cx="15.5" cy="13.5" r="1.2" /></g>
        <path d="m12.5 24 5.5 4-5.5 4" />
        <path className="field-symbol__accent" d="M23 32h8" />
      </>}
      {id === "architecture" && <>
        <path className="field-symbol__detail" d="m4.5 34 17.5 9 21-11M14 25l-.1 10m14-9v11" />
        <path d="M9 22v12.5L21.8 41V28m16-8v13l-16 8" />
        <path className="field-symbol__face" d="M4 17.5 26 6l17.5 9v4L21.8 30 4 21Z" />
        <path className="field-symbol__detail" d="m4.5 18 17.3 8.5L43 15.2m-21.2 11.3v3" />
        <path className="field-symbol__accent" d="M32.5 25v10" />
      </>}
      {id === "learning" && <>
        <path className="field-symbol__detail" d="M6 36h36M11 41V7m-2 12h4m16 15v4" />
        <path className="field-symbol__detail" d="M22 16v19" strokeDasharray="1.5 3" />
        <path d="M6 32c7 0 9-16 16-16s8 11 13 11c3 0 5-4 8-13" />
        <circle className="field-symbol__accent" cx="22" cy="16" r="2.5" fill="currentColor" stroke="none" />
      </>}
      {id === "radio" && <>
        <path className="field-symbol__detail" d="M10 7a21 21 0 0 0 0 26M38 7a21 21 0 0 1 0 26" />
        <path d="M15.3 11.8a13 13 0 0 0 0 16.4m17.4-16.4a13 13 0 0 1 0 16.4" />
        <path className="field-symbol__face" d="m24 20 7 20H17Z" />
        <path className="field-symbol__detail" d="m20.2 32 6.1-4m-5.4.6 7.2 7.2M14 41h20" />
        <circle className="field-symbol__accent" cx="24" cy="18.5" r="2.8" fill="currentColor" stroke="none" />
      </>}
    </svg>
  );
}

export function ExpertiseDeck() {
  const { t, locale } = useLanguage();
  const [{ id: active, backward, enhanced }, setActive] = useReducer(changeSubject,
    { id: "computing", backward: false, enhanced: false });
  const frame = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLAnchorElement | null)[]>([]);
  const readingPosition = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (readingPosition.current === null) return;
    window.scrollTo({ top: readingPosition.current, behavior: "instant" });
    readingPosition.current = null;
  }, [active]);

  useLayoutEffect(() => {
    let scrollFrame = 0;
    function followAnchor(scroll: boolean, fallback = false) {
      const target = document.getElementById(window.location.hash.slice(1));
      const id = target?.closest<HTMLElement>("[data-subject]")?.dataset.subject ?? target?.id;
      const subject = subjects.find(item => item.id === id);
      if (subject || fallback) setActive(subject?.id ?? "computing");
      cancelAnimationFrame(scrollFrame);
      if (!scroll || !subject || !target) return;
      scrollFrame = requestAnimationFrame(() => {
        const destination = target.id === subject.id ? frame.current : target;
        destination?.scrollIntoView({ block: "start", behavior: "instant" });
      });
    }
    // The browser already follows links to the static headings before hydration.
    followAnchor(false, true);
    const onHashChange = () => followAnchor(!window.history.state?.stationReading);
    const onReadingLink = () => followAnchor(false);
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener(readingLinkEvent, onReadingLink);
    return () => {
      cancelAnimationFrame(scrollFrame);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener(readingLinkEvent, onReadingLink);
    };
  }, []);

  const select = (id: SubjectId) => {
    window.history.replaceState(window.history.state, "", `#${id}`);
    if (id === active) return;
    readingPosition.current = window.scrollY;
    setActive(id);
  };
  const navigateTabs = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    const direction = locale === "ar" ? -1 : 1;
    let next = index;
    if (event.key === "ArrowRight") next = (index + direction + subjects.length) % subjects.length;
    else if (event.key === "ArrowLeft") next = (index - direction + subjects.length) % subjects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = subjects.length - 1;
    else if (event.key === " ") next = index;
    else return;
    event.preventDefault();
    select(subjects[next].id);
    tabs.current[next]?.focus();
  };

  return <section ref={frame} id="fields" className="section fields-panel illustrated-section"
    data-nav="computing" data-reading-anchor={active} data-backward={backward || undefined}
    data-tabs-ready={enhanced || undefined} aria-label={t("s143")}>
    <SectionArtwork src="images/fields.jpg" />
    <div className="panel-frame fields-frame">
      <div className="field-tabs" role={enhanced ? "tablist" : "navigation"} aria-label={t("s131")} data-reveal="deck">
        {subjects.map((subject, index) => <a
          key={subject.id} className="field-tab" href={`#${subject.id}`} id={enhanced ? subject.id : undefined}
          role={enhanced ? "tab" : undefined} aria-controls={enhanced ? `panel-${subject.id}` : undefined}
          aria-selected={enhanced ? active === subject.id : undefined}
          tabIndex={enhanced ? (active === subject.id ? 0 : -1) : undefined}
          ref={node => { tabs.current[index] = node; }}
          onClick={event => {
            if (!enhanced || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            select(subject.id);
          }}
          onKeyDown={enhanced ? event => navigateTabs(event, index) : undefined}
          aria-label={t(profile.sections[subject.section].title)}
        >
          <span className="field-card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className="field-card-symbol"><FieldSymbol id={subject.id} /></span>
          <span className="field-card-heading"><span className="field-card-title">{t(profile.sections[subject.section].title)}</span><i aria-hidden="true" /></span>
        </a>)}
      </div>
      {subjects.map(subject => <div
        key={subject.id} id={`panel-${subject.id}`} className="field-panel" data-subject={subject.id}
        role={enhanced ? "tabpanel" : "region"}
        aria-labelledby={enhanced ? subject.id : `${subject.id}-heading`} tabIndex={enhanced ? 0 : undefined}
        hidden={enhanced && active !== subject.id}
      >
        <header id={enhanced ? undefined : subject.id} className="section-header field-heading">
          <h2 id={`${subject.id}-heading`} data-search-target>{t(profile.sections[subject.section].title)}</h2>
        </header>
        <ProfileContent section={subject.section} layout={subject.layout} />
      </div>)}
    </div>
  </section>;
}
