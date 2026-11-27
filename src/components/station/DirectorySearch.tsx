"use client";

import { useMemo, useRef, useState, type MouseEvent } from "react";
import { useLanguage } from "./i18n/LanguageProvider";
import { fieldSubjects, foldKey } from "./navigation";
import { profile } from "./ProfileContent";

const chapters = [["top", "s055"], ["about", "s058"], ["now", "s077"], ["interests", "s083"], ["gear", "s085"], ["contact", "s095"]];

type Entry = {
  id: string;
  path: string[];
  text: string;
  folds: string[];
  searchText: string;
  searchPath: string;
  isHeading: boolean;
};

function normalize(text: string) {
  return text.normalize("NFKC").toLowerCase().replace(/\s+/g, " ").trim();
}

export function indexDirectory(): Entry[] {
  const sectionTitles = new Map<Element, string>();
  return Array.from(document.querySelectorAll<HTMLElement>("main [data-search-target][id]")).flatMap(target => {
    const text = (target instanceof HTMLTableRowElement
      ? Array.from(target.cells, cell => cell.textContent).join(" · ")
      : target.textContent ?? "").replace(/\s+/g, " ").trim();
    if (!text) return [];

    const section = target.closest<HTMLElement>("[data-subject], main > section");
    if (section && !sectionTitles.has(section)) {
      sectionTitles.set(section, section.querySelector("h1, h2")?.textContent?.trim() || section.dataset.panelLabel || "");
    }
    const group = target.closest("[data-profile-group]")?.querySelector(":scope > h3")?.textContent?.trim();
    const labels: string[] = [];
    const folds: string[] = [];
    for (let fold = target.closest<HTMLDetailsElement>("details[data-reading-fold]"); fold;
      fold = fold.parentElement?.closest<HTMLDetailsElement>("details[data-reading-fold]") ?? null) {
      folds.unshift(foldKey(fold));
      const label = fold.querySelector(":scope > summary")?.textContent?.trim();
      if (label) labels.unshift(label);
    }
    const path = [section && sectionTitles.get(section), group, ...labels].filter((label): label is string => Boolean(label && label !== text));
    return [{ id: target.id, path, text, folds, searchText: normalize(text), searchPath: normalize(path.join(" ")), isHeading: target.matches("h1, h2, h3, h4, summary") }];
  });
}

function findEntries(entries: Entry[], terms: string[]) {
  if (!terms.length) return [];
  return entries.flatMap(entry => {
    let score = 0;
    for (const term of terms) {
      const index = entry.searchText.indexOf(term);
      if (index < 0 && !entry.searchPath.includes(term)) return [];
      if (index >= 0) {
        score += 4 + (entry.isHeading ? 3 : 0);
        if (index === 0 || /[^\p{L}\p{N}]/u.test(entry.searchText[index - 1])) score += 2;
        if (entry.searchText === term) score += 4;
      }
    }
    return [{ entry, score }];
  }).sort((a, b) => b.score - a.score).map(result => result.entry);
}

function Excerpt({ text, terms }: { text: string; terms: string[] }) {
  const lower = text.toLowerCase();
  const hit = terms.map(term => ({ term, index: lower.indexOf(term) }))
    .filter(match => match.index >= 0).sort((a, b) => a.index - b.index)[0];
  const start = Math.max(0, (hit?.index ?? 0) - 26);
  const end = Math.min(text.length, Math.max(start + 120, (hit?.index ?? 0) + (hit?.term.length ?? 0)));
  return <span className="directory-excerpt" dir="auto">
    {start > 0 && "…"}
    {hit ? <>{text.slice(start, hit.index)}<mark>{text.slice(hit.index, hit.index + hit.term.length)}</mark>{text.slice(hit.index + hit.term.length, end)}</> : text.slice(start, end)}
    {end < text.length && "…"}
  </span>;
}

function entryHref(entry: Entry, openFolds: string) {
  const folds = Array.from(new Set([...openFolds.split("."), ...entry.folds].filter(Boolean)));
  return `${folds.length ? `?open=${folds.join(".")}` : ""}#${entry.id}`;
}

type Props = {
  open: boolean;
  directory: string;
  subject: string;
  openFolds: string;
  entries: Entry[];
  onNavigate(): void;
  onRead(target: HTMLElement, href: string): void;
};

export function DirectorySearch({ open, directory, subject, openFolds, entries, onNavigate, onRead }: Props) {
  const { t, locale } = useLanguage();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const resultList = useRef<HTMLDivElement>(null);
  const firstResult = useRef<HTMLAnchorElement>(null);
  const terms = useMemo(() => normalize(query).split(" ").filter(Boolean), [query]);
  const matches = useMemo(() => findEntries(entries, terms), [entries, terms]);
  const searching = terms.length > 0;

  function read(entry: Entry, event?: MouseEvent<HTMLAnchorElement>) {
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    const target = document.getElementById(entry.id);
    if (!target) return;
    event?.preventDefault();
    onRead(target, entryHref(entry, openFolds));
  }

  return <nav id="header-directory" className="header-popover header-directory" aria-label={t("s131")}
    hidden={!open} inert={!open} data-searching={searching || undefined}>
    <form className="directory-search" role="search" aria-label={t("searchBody")} onSubmit={event => {
      event.preventDefault();
      if (matches[0]) read(matches[0]);
    }}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden="true">
        <circle cx="10.75" cy="10.75" r="6.25"/><path d="m15.5 15.5 4.25 4.25" strokeLinecap="round"/>
      </svg>
      <input ref={input} type="search" value={query} onChange={event => {
        setQuery(event.target.value);
        if (resultList.current) resultList.current.scrollTop = 0;
      }} onKeyDown={event => {
        if (event.key === "ArrowDown" && !event.nativeEvent.isComposing && firstResult.current) {
          event.preventDefault();
          firstResult.current.focus();
        }
      }}
        aria-label={t("searchBody")} placeholder={t("searchBody")} autoComplete="off" maxLength={120} enterKeyHint="search" />
      {query && <button type="button" aria-label={t("clearSearch")} onClick={() => { setQuery(""); input.current?.focus(); }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" aria-hidden="true">
          <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round"/>
        </svg>
      </button>}
    </form>

    <div className="directory-body" ref={resultList}>
      <div className="directory-chapters">
        <p className="directory-caption">{t("chapters")}</p>
        <ul>{chapters.map(([id, label]) => <li key={id}>
          <a href={`#${id}`} aria-current={id === directory ? "location" : undefined} onClick={onNavigate}>{t(label)}</a>
        </li>)}</ul>
      </div>
      <div className="directory-main">
        <p className={searching && !matches.length ? "directory-empty" : "sr-only"} role="status">
          {searching && (matches.length ? t("searchResults").replace("{count}", matches.length.toLocaleString(locale)) : t("searchEmpty"))}
        </p>
        {searching ? <ul className="directory-results">{matches.map((entry, index) => <li key={entry.id}>
          <a ref={index === 0 ? firstResult : undefined} href={entryHref(entry, openFolds)} onClick={event => read(entry, event)}>
            {entry.path.length > 0 && <span className="directory-result-path" dir="auto">{entry.path.join(" / ")}</span>}
            <Excerpt text={entry.text} terms={terms} />
          </a>
        </li>)}</ul> : <>
          <p className="directory-caption">{t("s143")}</p>
          <ul>{fieldSubjects.map(({ id, section }) => <li key={id}>
            <a href={`#${id}`} aria-current={subject === id ? "location" : undefined} onClick={onNavigate}>
              {t(profile.sections[section].title)}
            </a>
          </li>)}</ul>
        </>}
      </div>
    </div>
  </nav>;
}
