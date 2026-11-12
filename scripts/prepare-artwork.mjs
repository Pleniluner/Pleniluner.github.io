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
const manifest = {};
sharp.concurrency(2);

await mkdir(outputDirectory, { recursive: true });
for (const original of originals) {
  const input = await readFile(join(root, "public", original));
  const metadata = await sharp(input).metadata();
  if (!metadata.width || !metadata.height || (metadata.orientation && metadata.orientation !== 1)) {
    throw new Error(`Artwork needs an explicit orientation: ${original}`);
  }
  const fingerprint = createHash("sha256").update(input).digest("hex");
  const version = createHash("sha256").update(input).update(JSON.stringify({ widths, options, sharp: sharp.versions.sharp })).digest("hex").slice(0, 10);
  const stem = basename(original).replace(/\.[^.]+$/, "");
  const variants = [];
  for (const width of [...widths.filter(value => value < metadata.width), metadata.width]) {
    const src = `media/artwork/${stem}-${width}-${version}.webp`;
    const destination = join(root, "public", src);
    const existing = await stat(destination).catch(error => {
      if (error.code !== "ENOENT") throw error;
      return null;
    });
    if (!existing) {
      await sharp(input).resize({ width, withoutEnlargement: true }).webp(options).toFile(destination);
    }
    const result = await sharp(destination).metadata();
    if (result.format !== "webp" || result.width !== width || !result.height) {
      throw new Error(`Invalid generated artwork: ${src}`);
    }
    variants.push({ src, width, height: result.height, bytes: (await stat(destination)).size });
  }
  manifest[original] = { width: metadata.width, height: metadata.height, originalBytes: input.length, sha256: fingerprint, variants };
  console.log(JSON.stringify({ original, bytes: input.length, variants: variants.map(({ width, bytes }) => ({ width, bytes })) }));
}
// The manifest is only updated after every source has produced valid images.
await writeFile(manifestFile, JSON.stringify(manifest, null, 2) + "\n");
