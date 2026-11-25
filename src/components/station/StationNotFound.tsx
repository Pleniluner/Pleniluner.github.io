"use client";

import { useEffect, useSyncExternalStore } from "react";
import { basePath } from "@/lib/site";
import { localeFromSlug, localeHref, localeInfo, type Locale } from "./i18n/locales";
import { StationMark } from "./StationMark";
import styles from "./not-found.module.css";

const copy: Record<Locale, readonly [string, string, string]> = {
  "zh-CN": ["这个页面没有找到","回首页","看最近"],
  "zh-TW": ["找不到這個頁面","回首頁","看近況"],
  "en": ["Page not found","Home","Latest updates"],
  "ja": ["ページが見つかりません","ホームへ","近況を見る"],
  "ko": ["페이지를 찾을 수 없습니다","홈으로","근황 보기"],
  "fr": ["Page introuvable","Accueil","Actualités"],
  "de": ["Seite nicht gefunden","Zur Startseite","Neuigkeiten"],
  "ru": ["Страница не найдена","На главную","Что нового"],
  "it": ["Pagina non trovata","Home","Novità"],
  "pt": ["Página não encontrada","Início","Novidades"],
  "es": ["Página no encontrada","Inicio","Novedades"],
  "ar": ["لم نعثر على هذه الصفحة","الرئيسية","آخر المستجدات"],
};

// GitHub Pages serves one 404.html at any missing URL. Its plain HTML links
// already work; after hydration the URL selects the matching language.
const subscribe = () => () => {};
const defaultLocale = (): Locale => "zh-CN";
function requestedLocale(): Locale {
  const path = window.location.pathname;
  const relative = basePath && path.startsWith(basePath + "/") ? path.slice(basePath.length) : path;
  return localeFromSlug(relative.split("/")[1])?.id ?? defaultLocale();
}

export function StationNotFound() {
  const locale = useSyncExternalStore(subscribe, requestedLocale, defaultLocale);
  const [title, home, recent] = copy[locale];
  const url = localeHref(locale);
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
      </nav>
    </div>
  </main>;
}
