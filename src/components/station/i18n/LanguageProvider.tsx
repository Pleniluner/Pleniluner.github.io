"use client";
import { createContext, useContext, useEffect, useMemo } from "react";
import { localeInfo, type Locale } from "./locales";
type Language = { locale: Locale; t: (key: string) => string };
const Context = createContext<Language | null>(null);
export function LanguageProvider({locale, messages, children}: {locale: Locale; messages: Record<string, string>; children: React.ReactNode}) {
  const value = useMemo(() => ({locale, t: (key: string) => messages[key] ?? key}), [locale, messages]);
  useEffect(() => { document.documentElement.lang = locale; document.documentElement.dir = localeInfo(locale).dir; }, [locale]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useLanguage() {
  const value = useContext(Context);
  if (!value) throw new Error("Station language provider is missing");
  return value;
}
