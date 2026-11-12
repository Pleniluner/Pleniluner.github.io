import profile0 from "./profile/zh-CN.json";
import profile1 from "./profile/zh-TW.json";
import profile2 from "./profile/en.json";
import profile3 from "./profile/ja.json";
import profile4 from "./profile/ko.json";
import profile5 from "./profile/ru.json";
import profile6 from "./profile/fr.json";
import profile7 from "./profile/de.json";
import profile8 from "./profile/it.json";
import profile9 from "./profile/pt.json";
import profile10 from "./profile/es.json";
import profile11 from "./profile/ar.json";
const profiles = {"zh-CN": profile0, "zh-TW": profile1, "en": profile2, "ja": profile3, "ko": profile4, "ru": profile5, "fr": profile6, "de": profile7, "it": profile8, "pt": profile9, "es": profile10, "ar": profile11};
import type { Metadata } from "next";
import { asset } from "@/lib/site";
import { locales, localeHref, type Locale } from "./locales";
import zhCN from "./messages/zh-CN.json";
import zhTW from "./messages/zh-TW.json";
import en from "./messages/en.json";
import ja from "./messages/ja.json";
import ko from "./messages/ko.json";
import ru from "./messages/ru.json";
import fr from "./messages/fr.json";
import de from "./messages/de.json";
import it from "./messages/it.json";
import pt from "./messages/pt.json";
import es from "./messages/es.json";
import ar from "./messages/ar.json";
const dictionaries = {"zh-CN": zhCN, "zh-TW": zhTW, en, ja, ko, ru, fr, de, it, pt, es, ar};
export async function getMessages(locale: Locale): Promise<Record<string,string>> {
  return {...dictionaries[locale], ...profiles[locale]};
}
export async function stationMetadata(locale: Locale): Promise<Metadata> {
  const messages = await getMessages(locale);
  const title = "清月空间站 ~ Pleniluner’s Space Station";
  return {
    metadataBase: new URL("https://pleniluner.com"), title, description: messages.s134,
    authors: [{name: "Pleniluner", url: "https://github.com/Pleniluner"}],
    alternates: { canonical: localeHref(locale), languages: Object.fromEntries([...locales.map(item => [item.id, localeHref(item.id)]), ["x-default", localeHref("zh-CN")]]) },
    icons: {icon: asset("icons/icon-32.png"), apple: asset("icons/icon-180.png")},
    openGraph: {title, description: messages.s134, type: "website", locale: locale.replace("-", "_"), images: [asset("images/kaguya.png")]},
    twitter: {card: "summary_large_image", title, description: messages.s134, images: [asset("images/kaguya.png")]},
    robots: {index: true, follow: true},
  };
}
