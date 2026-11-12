# Artwork delivery

The four large illustrations keep their original PNG/JPEG files in `public/images/`.
`npm run media:prepare` generates WebP delivery files under
`public/media/artwork/` and the matching `artwork.json` manifest. Generated WebP
files are ignored by Git and prepared automatically before dev/build. Run it after
changing an original. It uses Sharp 0.34.5, quality 90, retains transparency,
resizes without cropping, and includes a variant at the original resolution.

`StationImage` lets the browser choose a width through `picture`, `srcset` and
`sizes`. The original remains the fallback. Cover backgrounds use sizes that
account for their height; the two complete illustrations retain their full
frame and natural ratio. The export check covers resource paths, source hashes,
frame ratios and alpha channels.

## Verification on 2026-11-13

Browser-selected files for the four illustrations totalled 15,492,094 bytes in
the previous release. At 1440px / 1x they now total 877,110 bytes; at 390px / 2x,
769,564 bytes. Modern browsers requested the WebP variants without also
downloading the original fallbacks. The original-resolution workbench variant
retains the original alpha channel byte for byte. Menu, keyboard, quote-language,
RTL and reduced-motion flows were checked against the static export.

The full-frame illustrations also override the more specific `.scene-motion`
image transform. At the start, centre and end of each image, both desktop and
mobile checks confirm that the image fits its frame without scroll zoom.
These two sections also use the body's available width, measured by the existing
navigation resize observer, so desktop scrollbar gutters do not push the frame
past the visible page edges.
