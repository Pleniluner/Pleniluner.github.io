import { createHash } from "node:crypto";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = dirname(dirname(fileURLToPath(import.meta.url)));
const outputDirectory = join(root, "public/media/artwork");
const manifestFile = join(root, "src/components/station/content/artwork.json");
const originals = [
  "images/kaguya.png",
  "images/starlight.jpg",
  "images/music-room.png",
  "images/fields.jpg",
];
const widths = [640, 960, 1440, 1920, 2560, 3200];
const options = { quality: 90, alphaQuality: 100, effort: 5, smartSubsample: true };
const phoneWidths = [480, 640, 840, 1080];
// The browser's 72% focus applies to both the source crop and its final fit.
const mobileFrames = [
  { name: "tall", ratio: .90, media: "(max-width: 700px) and (min-height: 820px) and (max-aspect-ratio: 1/2)" },
  { name: "phone", ratio: 1.18, media: "(max-width: 500px) and (max-aspect-ratio: 5/8)" },
  { name: "portrait", ratio: 1.46, media: "(max-width: 700px) and (max-aspect-ratio: 5/6)" },
];
const manifest = {};
sharp.concurrency(2);

async function prepareVariants(input, stem, fullWidth, widths, crop) {
  const version = createHash("sha256").update(input).update(JSON.stringify({ widths, options, sharp: sharp.versions.sharp, crop })).digest("hex").slice(0, 10);
  const variants = [];
  for (const width of [...widths.filter(value => value < fullWidth), fullWidth]) {
    const src = `media/artwork/${stem}-${width}-${version}.webp`;
    const destination = join(root, "public", src);
    const existing = await stat(destination).catch(error => {
      if (error.code !== "ENOENT") throw error;
      return null;
    });
    if (!existing) {
      const pipeline = sharp(input);
      if (crop) pipeline.extract(crop);
      await pipeline.resize({ width, withoutEnlargement: true }).webp(options).toFile(destination);
    }
    const result = await sharp(destination).metadata();
    if (result.format !== "webp" || result.width !== width || !result.height) {
      throw new Error(`Invalid generated artwork: ${src}`);
    }
    variants.push({ src, width, height: result.height, bytes: (await stat(destination)).size });
  }
  return variants;
}

await mkdir(outputDirectory, { recursive: true });
for (const original of originals) {
  const input = await readFile(join(root, "public", original));
  const { width, height, orientation } = await sharp(input).metadata();
  if (!width || !height || (orientation && orientation !== 1)) {
    throw new Error(`Artwork needs an explicit orientation: ${original}`);
  }
  const stem = basename(original).replace(/\.[^.]+$/, "");
  const sha256 = createHash("sha256").update(input).digest("hex");
  const variants = await prepareVariants(input, stem, width, widths);
  const image = { width, height, originalBytes: input.length, sha256, variants };
  if (original === "images/kaguya.png") {
    image.mobile = [];
    for (const frame of mobileFrames) {
      const cropWidth = Math.min(width, Math.round(height * frame.ratio));
      const crop = { left: Math.round((width - cropWidth) * .72), top: 0, width: cropWidth, height };
      const variants = await prepareVariants(input, `${stem}-${frame.name}`, cropWidth, phoneWidths, crop);
      // CSS gives the portrait a maximum height of 136vw.
      const sizes = `${Math.ceil(cropWidth / height * 136)}vw`;
      image.mobile.push({ media: frame.media, sizes, width: cropWidth, height, variants });
    }
  }
  manifest[original] = image;
  console.log(JSON.stringify({ original, bytes: input.length, variants: variants.map(({ width, bytes }) => ({ width, bytes })) }));
}
// The manifest is only updated after every source has produced valid images.
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
