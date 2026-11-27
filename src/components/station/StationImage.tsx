import type { ImgHTMLAttributes } from "react";
import artwork from "./content/artwork.json";
import { asset } from "@/lib/site";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet" | "sizes"> & {
  src: string;
  alt: string;
  sizes?: string;
};

type Variant = { src: string; width: number };
type Artwork = {
  width: number;
  height: number;
  variants: Variant[];
  mobile?: { media: string; sizes: string; width: number; height: number; variants: Variant[] }[];
};
const preparedImages: Record<string, Artwork> = artwork;

function sourceSet(variants: Variant[]) {
  return variants.map(variant => `${asset(variant.src)} ${variant.width}w`).join(", ");
}

export function StationImage({ src, alt, sizes = "100vw", loading = "lazy", decoding = "async", width, height, ...props }: Props) {
  const image = Object.hasOwn(preparedImages, src) ? preparedImages[src] : null;
  if (!image) return <img {...props} src={asset(src)} alt={alt} width={width} height={height} loading={loading} decoding={decoding} />;
  return <picture className="station-picture">
    {image.mobile?.map(frame => <source key={frame.media} type="image/webp" media={frame.media}
      srcSet={sourceSet(frame.variants)} sizes={frame.sizes} width={frame.width} height={frame.height} />)}
    <source type="image/webp" srcSet={sourceSet(image.variants)} sizes={sizes} />
    <img {...props} src={asset(src)} alt={alt} width={width ?? image.width} height={height ?? image.height} loading={loading} decoding={decoding} />
  </picture>;
}
