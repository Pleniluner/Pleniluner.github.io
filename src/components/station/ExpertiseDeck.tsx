"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { ProfileContent, profile } from "./ProfileContent";
import { SectionArtwork } from "./SectionArtwork";

const subjects = [
  { id: "computing", section: "computing", layout: "folds" },
  { id: "tools", section: "tools", layout: "folds" },
  { id: "architecture", section: "architecture", layout: "folds" },
  { id: "learning", section: "mathematics", layout: "plain" },
  { id: "radio", section: "radio", layout: "plain" },
] as const;
type SubjectId = typeof subjects[number]["id"];

function FieldSymbol({ id }: { id: SubjectId }) {
  return <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="miter" aria-hidden="true">
    {id === "computing" && <><rect x="16" y="16" width="32" height="32" /><path d="m27 25-7 7 7 7m10-14 7 7-7 7m-2-18-6 22M23 8v8m9-8v8m9-8v8M23 48v8m9-8v8m9-8v8M8 23h8m-8 9h8m-8 9h8m32-18h8m-8 9h8m-8 9h8" /></>}
    {id === "tools" && <><path d="M8 15h48v37H8zM8 25h48M14 20h3m4 0h3m4 0h3M20 33l-5 5 5 5m5 0h10M44 6v12m-6-6h12" /><circle cx="44" cy="38" r="5" /></>}
    {id === "architecture" && <><path d="M7 54h50M12 54V25L32 9l20 16v29M7 25h50M20 54V34a12 12 0 0 1 24 0v20M27 54V38a5 5 0 0 1 10 0v16M32 4v10" /></>}
    {id === "learning" && <><path d="M9 51h47M14 56V9M14 45c8 0 7-28 18-28s11 28 22 28M22 9h34M48 5v8" /><circle cx="32" cy="17" r="3" /><path d="M32 24v27" strokeDasharray="3 4" /></>}
    {id === "radio" && <><path d="M32 30v24M22 54h20M17 12a23 23 0 0 0 0 34m30-34a23 23 0 0 1 0 34M23 19a13 13 0 0 0 0 20m18-20a13 13 0 0 1 0 20" /><circle cx="32" cy="27" r="4" /></>}
  </svg>;
}

export function ExpertiseDeck() {
  const { t, locale } = useLanguage();
  const [active, setActive] = useState<SubjectId>("computing");
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
    const followAnchor = () => {
      const changed = window.location.hash !== previousHash.current;
      previousHash.current = window.location.hash;
      const subject = subjects.find(item => `#${item.id}` === window.location.hash);
      if (!subject) return;
      selectedByHash.current = true;
      setActive(subject.id);
      if (changed) {
        requestAnimationFrame(() => {
          frame.current?.scrollIntoView({ block: "start" });
          selectedByHash.current = false;
        });
      } else {
        selectedByHash.current = false;
      }
    };
    followAnchor();
    window.addEventListener("hashchange", followAnchor);
    return () => {
      window.removeEventListener("hashchange", followAnchor);
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

  return <section ref={frame} id="fields" className="section fields-panel illustrated-section" data-nav={active} aria-labelledby={`${active}-heading`}>
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
