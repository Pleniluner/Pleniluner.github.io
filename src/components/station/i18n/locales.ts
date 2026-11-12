import { asset } from "@/lib/site";
export const locales = [
  { id: "zh-CN", slug: "", label: "简体中文", short: "简", dir: "ltr" },
  { id: "zh-TW", slug: "zh-tw", label: "繁體中文", short: "繁", dir: "ltr" },
  { id: "en", slug: "en", label: "English", short: "EN", dir: "ltr" },
  { id: "ja", slug: "ja", label: "日本語", short: "日", dir: "ltr" },
  { id: "ko", slug: "ko", label: "한국어", short: "한", dir: "ltr" },
  { id: "ru", slug: "ru", label: "Русский", short: "RU", dir: "ltr" },
  { id: "fr", slug: "fr", label: "Français", short: "FR", dir: "ltr" },
  { id: "de", slug: "de", label: "Deutsch", short: "DE", dir: "ltr" },
  { id: "it", slug: "it", label: "Italiano", short: "IT", dir: "ltr" },
  { id: "pt", slug: "pt", label: "Português", short: "PT", dir: "ltr" },
  { id: "es", slug: "es", label: "Español", short: "ES", dir: "ltr" },
  { id: "ar", slug: "ar", label: "العربية", short: "ع", dir: "rtl" },
] as const;
export type Locale = typeof locales[number]["id"];
export function localeInfo(locale: Locale) { return locales.find(item => item.id === locale)!; }
export function localeHref(locale: Locale) { const {slug} = localeInfo(locale); return asset(slug ? slug + "/" : ""); }
export function localeFromSlug(slug: string) { return locales.find(item => item.slug === slug); }
