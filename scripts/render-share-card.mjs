import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const local = path => fileURLToPath(new URL(path, import.meta.url));
const width = 1200;
const height = 630;
const original = local("../public/images/kaguya.png");
const logo = local("../public/favicon.svg");
const lettering = await readFile(local("./share-card-type.svg"));
const artwork = await sharp(original)
  .resize({ height })
  .extract({ left: 130, top: 0, width: 1000, height })
  .png().toBuffer();
const fade = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="shade">
    <stop offset="0" stop-color="#111b1c"/><stop offset=".27" stop-color="#111b1c"/>
    <stop offset=".43" stop-color="#111b1c" stop-opacity=".95"/>
    <stop offset=".61" stop-color="#111b1c" stop-opacity=".18"/>
    <stop offset=".77" stop-color="#111b1c" stop-opacity="0"/>
  </linearGradient></defs>
  <rect width="1200" height="630" fill="url(#shade)"/>
</svg>`);
const mark = await sharp(logo).resize(106, 106).png().toBuffer();
const destination = local("../public/images/station-share-v1.jpg");
await mkdir(local("../public/images/"), { recursive: true });
await sharp({ create: { width, height, channels: 3, background: "#111b1c" } })
  .composite([
    { input: artwork, top: 0, left: 200 },
    { input: fade },
    { input: mark, top: 122, left: 61 },
    { input: lettering },
  ])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(destination);
console.log("Rendered public/images/station-share-v1.jpg (1200 × 630)");
