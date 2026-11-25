"use client";

import { StationImage } from "./StationImage";
import { useLanguage } from "./i18n/LanguageProvider";

const works = {
  starlight: { title: "🌟", artist: "蒼響Verniy", artworkId: "136960564", artistId: "16186292", alt: "starlightAlt" },
  musicRoom: { title: "靠", artist: "XilmO@夕末", artworkId: "104450545", artistId: "19389056", alt: "musicRoomAlt" },
} as const;

type Props = { src: string; credit?: keyof typeof works; width?: number; height?: number };

export function SectionArtwork({ src, credit, width, height }: Props) {
  const { t } = useLanguage();
  if (credit) {
    const work = works[credit];
    return <figure className="station-plate">
      <div className="section-artwork section-artwork--complete">
        <StationImage src={src} alt={t(work.alt)} width={width} height={height} sizes="100vw" />
      </div>
      <figcaption>
        <details id={`credit-${credit}`} className="station-plate__credit">
          <summary>{t("artworkInfo")}</summary>
          <p><cite dir="auto">{work.title}</cite>
            <a dir="auto" href={`https://www.pixiv.net/users/${work.artistId}`}>{work.artist}</a>
            <a href={`https://www.pixiv.net/artworks/${work.artworkId}`} dir="ltr">Pixiv <span aria-hidden="true">↗</span></a>
          </p>
        </details>
      </figcaption>
    </figure>;
  }
  return <div className="section-artwork" data-scene-art="chapter" aria-hidden="true">
    <StationImage src={src} alt="" width={width} height={height}
      sizes={src === "images/fields.jpg" ? "(max-width: 700px) max(100vw, 1000px), max(100vw, 1330px)" : "100vw"} />
  </div>;
}
