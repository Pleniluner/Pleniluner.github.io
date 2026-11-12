import "@/styles/starfield.css";
import "@/styles/profile.css";
import { LanguageProvider } from "@/components/station/i18n/LanguageProvider";
import { getMessages, stationMetadata } from "@/components/station/i18n/server";
import "@/styles/station.css";
import "@/styles/languages.css";
import "@/styles/intro.css";
import "@/styles/reveal.css";
import "@/styles/station-layout.css";
import "@/styles/station-scenes.css";
import "@/styles/station-endfield.css";
export async function generateMetadata() {return stationMetadata("zh-CN");}
export default async function Layout({children}: {children: React.ReactNode}) {
  return <html lang="zh-CN" dir="ltr"><body><LanguageProvider locale="zh-CN" messages={await getMessages("zh-CN")}>{children}</LanguageProvider></body></html>;
}
