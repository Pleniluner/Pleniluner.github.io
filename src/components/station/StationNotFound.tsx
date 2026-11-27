"use client";

import { useEffect, useSyncExternalStore } from "react";
import { basePath } from "@/lib/site";
import { localeFromSlug, localeHref, localeInfo, type Locale } from "./i18n/locales";
import { directoryQueryKey, directoryQueryLimit } from "./directoryQuery";
import { StationMark } from "./StationMark";
import styles from "./not-found.module.css";

const copy: Record<Locale, readonly [string, string, string, string]> = {
  "zh-CN": ["这个页面没有找到","回首页","看最近","在目录中查找"],
  "zh-TW": ["找不到這個頁面","回首頁","看近況","在目錄中搜尋"],
  "en": ["Page not found","Home","Latest updates","Search the directory"],
  "ja": ["ページが見つかりません","ホームへ","近況を見る","目次から探す"],
  "ko": ["페이지를 찾을 수 없습니다","홈으로","근황 보기","목차에서 검색"],
  "fr": ["Page introuvable","Accueil","Actualités","Rechercher dans le sommaire"],
  "de": ["Seite nicht gefunden","Zur Startseite","Neuigkeiten","Inhaltsverzeichnis durchsuchen"],
  "ru": ["Страница не найдена","На главную","Что нового","Поиск по разделам"],
  "it": ["Pagina non trovata","Home","Novità","Cerca nell’indice"],
  "pt": ["Página não encontrada","Início","Novidades","Pesquisar no índice"],
  "es": ["Página no encontrada","Inicio","Novedades","Buscar en el índice"],
  "ar": ["لم نعثر على هذه الصفحة","الرئيسية","آخر المستجدات","ابحث في الفهرس"],
};

const chapterPaths = new Map([
  ["about", "about"], ["about-notes", "about-notes"], ["anniversary-quote", "anniversary-quote"],
  ["now", "now"], ["workbench", "now"], ["fields", "fields"],
  ["computing", "computing"], ["tools", "tools"], ["architecture", "architecture"],
  ["learning", "learning"], ["radio", "radio"], ["interests", "interests"],
  ["games", "text-p151"], ["gear", "gear"], ["workstation", "gear"], ["contact", "contact"],
]);

// GitHub Pages serves one 404.html at any missing URL. Its plain HTML links
// already work; after hydration the URL selects the matching language.
const subscribe = () => () => {};
const defaultPath = () => "";
const requestedPath = () => window.location.pathname;

function parseRecoveryPath(path: string) {
  const relative = basePath && path.startsWith(`${basePath}/`) ? path.slice(basePath.length) : path;
  const segments = relative.split("/").filter(Boolean).map(segment => {
    try { return decodeURIComponent(segment); } catch { return segment; }
  });
  const first = segments[0]?.toLowerCase();
  const preferred = first === "chinese" ? localeInfo("zh-CN") : first && localeFromSlug(first);
  if (preferred) segments.shift();
  const slug = (segments[segments.length - 1] ?? "").replace(/\.html?$/i, "");
  const anchor = segments.length === 1 ? chapterPaths.get(slug.toLowerCase()) : undefined;
  const terms = slug.normalize("NFKC").replace(/[^\p{L}\p{N}\p{M}]+/gu, " ").trim().slice(0, directoryQueryLimit);
  return { locale: preferred ? preferred.id : "zh-CN" as const, anchor, terms };
}

export function StationNotFound() {
  const path = useSyncExternalStore(subscribe, requestedPath, defaultPath);
  const { locale, anchor, terms } = parseRecoveryPath(path);
  const [title, home, recent, directory] = copy[locale];
  const url = localeHref(locale);
  const destination = anchor ? `${url}#${anchor}` : undefined;
  const search = new URLSearchParams([[directoryQueryKey, terms]]);
  useEffect(() => {
    if (destination) window.location.replace(destination);
  }, [destination]);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = localeInfo(locale).dir;
    document.title = `${title} · Pleniluner`;
  }, [locale, title]);
  return <main className={styles.page} lang={locale} dir={localeInfo(locale).dir}>
    <div className={styles.inner}>
      <a className={styles.brand} href={url} lang="zh-CN" dir="ltr"><StationMark />清月空间站</a>
      <p className={styles.code} aria-hidden="true" dir="ltr">404</p>
      <h1>{title}</h1>
      <nav className={styles.links}>
        <a href={url}>{home}</a>
        <a href={url + "#now"}>{recent}</a>
        <a href={`${url}?${search}`}>{directory}</a>
      </nav>
    </div>
  </main>;
}
