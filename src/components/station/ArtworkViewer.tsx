"use client";

import { useLanguage } from "./i18n/LanguageProvider";
import { asset } from "@/lib/site";

/** A full-bleed illustration, without a zoom control or modal. */
export function ArtworkViewer() {
  const { t } = useLanguage();
  return (
    <figure className="profile-artwork">
      <div className="profile-artwork__image" data-scene-art="portrait">
        <img src={asset("images/portrait.jpg")} alt={t("s118")} width="2039" height="1378" decoding="async" />
      </div>
    </figure>
  );
}
