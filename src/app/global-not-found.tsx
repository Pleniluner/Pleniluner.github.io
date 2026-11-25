import type { Metadata } from "next";
import { StationNotFound } from "@/components/station/StationNotFound";
import { asset } from "@/lib/site";

export const metadata: Metadata = {
  title: "这个页面没有找到 · Pleniluner",
  robots: { index: false, follow: true },
  icons: { icon: asset("icons/icon-32.png") },
};

export default function GlobalNotFound() {
  return <html lang="zh-CN"><body style={{ margin: 0, backgroundColor: "#101617" }}><StationNotFound /></body></html>;
}
