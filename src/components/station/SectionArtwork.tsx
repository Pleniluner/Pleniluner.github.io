import { StationImage } from "./StationImage";

/** Full illustrations keep their natural ratio; background scenes can still crop. */
export function SectionArtwork({ src, complete = false, width, height }: { src: string; complete?: boolean; width?: number; height?: number }) {
  return <div className={`section-artwork${complete ? " section-artwork--complete" : ""}`} data-scene-art="chapter" aria-hidden="true">
    <StationImage src={src} alt="" width={width} height={height}
      sizes={src === "images/fields.jpg" ? "(max-width: 700px) max(100vw, 1000px), max(100vw, 1330px)" : "100vw"} />
  </div>;
}
