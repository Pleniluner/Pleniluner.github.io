import "@/styles/starfield.css";
import "@/styles/profile.css";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/components/station/i18n/LanguageProvider";
import { localeFromSlug, locales } from "@/components/station/i18n/locales";
import { getMessages, stationMetadata } from "@/components/station/i18n/server";
import "@/styles/station.css";
import "@/styles/languages.css";
import "@/styles/intro.css";
import "@/styles/reveal.css";
import "@/styles/station-layout.css";
import "@/styles/station-scenes.css";
import "@/styles/station-endfield.css";
export const dynamicParams = false;
export function generateStaticParams() { return locales.filter(item => item.slug).map(item => ({locale: item.slug})); }
export async function generateMetadata({params}: {params: Promise<{locale: string}>}) {
  const item = localeFromSlug((await params).locale);
  if (!item) notFound();
  return stationMetadata(item.id);
}
export default async function Layout({children, params}: {children: React.ReactNode; params: Promise<{locale: string}>}) {
  const item = localeFromSlug((await params).locale);
  if (!item) notFound();
  return <html lang={item.id} dir={item.dir}><body><LanguageProvider locale={item.id} messages={await getMessages(item.id)}>{children}</LanguageProvider></body></html>;
}
