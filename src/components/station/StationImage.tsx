import type { ImgHTMLAttributes } from "react";
import artwork from "./content/artwork.json";
import { asset } from "@/lib/site";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  src: string;
  alt: string;
  sizes?: string;
};

/** Screen-sized delivery files share the original illustration's composition. */
export function StationImage({ src, alt, sizes = "100vw", loading = "lazy", decoding = "async", width, height, ...props }: Props) {
  const image = Object.hasOwn(artwork, src) ? artwork[src as keyof typeof artwork] : null;
  if (!image) return <img {...props} src={asset(src)} alt={alt} width={width} height={height} loading={loading} decoding={decoding} />;
  return <picture className="station-picture">
    <source type="image/webp" srcSet={image.variants.map(variant => `${asset(variant.src)} ${variant.width}w`).join(", ")} sizes={sizes} />
    <img {...props} src={asset(src)} alt={alt} width={width ?? image.width} height={height ?? image.height} loading={loading} decoding={decoding} />
  </picture>;
}
