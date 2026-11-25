"use client";

import { useEffect, useLayoutEffect, useReducer, useRef, type KeyboardEvent } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { ProfileContent, profile } from "./ProfileContent";
import { SectionArtwork } from "./SectionArtwork";
import { isHistoryTraversal } from "./navigation";

const subjects = [
  { id: "computing", section: "computing", layout: "folds" },
  { id: "tools", section: "tools", layout: "folds" },
  { id: "architecture", section: "architecture", layout: "folds" },
  { id: "learning", section: "mathematics", layout: "plain" },
  { id: "radio", section: "radio", layout: "plain" },
] as const;
type SubjectId = typeof subjects[number]["id"];
type Selection = { id: SubjectId; backward: boolean };

function changeSubject(previous: Selection, id: SubjectId): Selection {
  if (previous.id === id) return previous;
  const index = (key: SubjectId) => subjects.findIndex(subject => subject.id === key);
  return { id, backward: index(id) < index(previous.id) };
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
  const [{ id: active, backward }, setActive] = useReducer(changeSubject, { id: "computing", backward: false });
  const frame = useRef<HTMLElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const readingPosition = useRef<number | null>(null);
  const selectedByHash = useRef(false);
  const previousHash = useRef<string | null>(null);

  useLayoutEffect(() => {
    if (readingPosition.current === null) return;
    window.scrollTo({ top: readingPosition.current, behavior: "instant" });
    readingPosition.current = null;
  }, [active]);

  useEffect(() => {
    const followAnchor = (scroll: boolean) => {
      const changed = window.location.hash !== previousHash.current;
      previousHash.current = window.location.hash;
      const subject = subjects.find(item => `#${item.id}` === window.location.hash);
      if (!subject) return;
      selectedByHash.current = true;
      setActive(subject.id);
      if (changed && scroll) {
        requestAnimationFrame(() => {
          frame.current?.scrollIntoView({ block: "start" });
          selectedByHash.current = false;
        });
      } else {
        selectedByHash.current = false;
      }
    };
    followAnchor(!isHistoryTraversal());
    const onHashChange = () => followAnchor(true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const select = (id: SubjectId) => {
    window.history.replaceState(window.history.state, "", `#${id}`);
    if (id === active) return;
    if (!selectedByHash.current) readingPosition.current = window.scrollY;
    setActive(id);
  };
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const direction = locale === "ar" ? -1 : 1;
    let next = index;
    if (event.key === "ArrowRight") next = (index + direction + subjects.length) % subjects.length;
    else if (event.key === "ArrowLeft") next = (index - direction + subjects.length) % subjects.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = subjects.length - 1;
    else return;
    event.preventDefault();
    select(subjects[next].id);
    tabs.current[next]?.focus();
  };

  return <section ref={frame} id="fields" className="section fields-panel illustrated-section"
    data-nav="computing" data-reading-anchor={active} data-backward={backward || undefined} aria-labelledby={`${active}-heading`}>
    <SectionArtwork src="images/fields.jpg" />
    <div className="panel-frame fields-frame">
      <div className="field-tabs" role="tablist" aria-label={t("s131")} data-reveal="deck">
        {subjects.map((subject, index) => <button
          key={subject.id} type="button" role="tab" id={subject.id}
          aria-controls={`panel-${subject.id}`} aria-selected={active === subject.id}
          tabIndex={active === subject.id ? 0 : -1}
          ref={node => { tabs.current[index] = node; }}
          onClick={() => select(subject.id)} onKeyDown={event => navigateTabs(event, index)}
          aria-label={t(profile.sections[subject.section].title)}
        >
          <span className="field-card-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <span className="field-card-symbol"><FieldSymbol id={subject.id} /></span>
          <span className="field-card-heading"><span className="field-card-title">{t(profile.sections[subject.section].title)}</span><i aria-hidden="true" /></span>
        </button>)}
      </div>
      {subjects.map(subject => <div
        key={subject.id} id={`panel-${subject.id}`} className="field-panel" role="tabpanel"
        aria-labelledby={subject.id} tabIndex={0} hidden={active !== subject.id}
      >
        <header className="section-header field-heading"><h2 id={`${subject.id}-heading`}>{t(profile.sections[subject.section].title)}</h2></header>
        <ProfileContent section={subject.section} layout={subject.layout} />
      </div>)}
    </div>
  </section>;
}
