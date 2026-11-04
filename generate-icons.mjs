// v9: the OneWeb DevTools icon = a code-styled "1" (monospace stroke + terminal cursor "_") on a blue tile.
// One geometry source (below) → every SVG & PNG. Run again after the logo changes: npm run icons
//
//   public/favicon.svg                    vector favicon (rounded tile, readable on light & dark backgrounds)
//   public/favicon.ico                    16/32/48 (PNG inside ICO)
//   public/pwa-64x64.png, -192, -512      purpose "any" (transparent corners)
//   public/maskable-icon-192/512.png      purpose "maskable" (full background, content in the 80% safe zone)
//   public/apple-touch-icon-180x180.png   iOS (full background, iOS rounds it itself)
//   public/og-image.png                   1200×630 for Open Graph / social media
//   public/brand/*.svg + *.png            sources: tile, transparent (light/dark background), full logo light/dark

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const pub = join(dirname(fileURLToPath(import.meta.url)), "public");
const brandDir = join(pub, "brand");
mkdirSync(brandDir, { recursive: true });

/** Brand colors (same as --color-brand-* in index.css). */
const C = { from: "#3b68f0", to: "#1f3a8f", ink: "#2950d8", light: "#c0d2fd", navy: "#0f1b46" };

/** The "1" + cursor, in a 40×40 box. `s` = stroke width. */
const glyph = (main, cursor, s = 3.6) =>
  `<path d="M9.7 15.2 15.8 10.2V29.6" fill="none" stroke="${main}" stroke-width="${s}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="M10.2 29.6H21.2" fill="none" stroke="${main}" stroke-width="${s}" stroke-linecap="round"/>` +
  `<rect x="23.8" y="27.8" width="6.6" height="3.6" rx="1.2" fill="${cursor}"/>`;

const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.from}"/><stop offset="1" stop-color="${C.to}"/></linearGradient></defs>`;
const svg40 = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${body}</svg>`;

/** Ubin membulat (favicon, PWA "any"). */
const tile = svg40(`${grad}<rect width="40" height="40" rx="11" fill="url(#g)"/>${glyph("#fff", C.light)}`);
/** Full background; content scaled to 80% so it is safe for circular masks (maskable, apple-touch). */
const fullBleed = svg40(`${grad}<rect width="40" height="40" fill="url(#g)"/><g transform="translate(20 20) scale(0.8) translate(-20 -20)">${glyph("#fff", C.light)}</g>`);
/** Transparent: for light backgrounds (blue) and dark backgrounds (white/light blue). */
const onLight = svg40(glyph(C.ink, C.from, 4));
const onDark = svg40(glyph("#fff", C.light, 4));

/** The full logo (tile + wordmark). Text uses the system font; the app itself renders the wordmark in HTML. */
const lockup = (dark) => {
  const text = dark ? "#ffffff" : "#101828";
  const accent = dark ? "#8fb0fb" : C.from;
  const sub = dark ? "#98a2b3" : "#667085";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 48" width="220" height="48">${grad}<rect x="4" y="4" width="40" height="40" rx="11" fill="url(#g)"/><g transform="translate(4 4)">${glyph("#fff", C.light)}</g><text x="54" y="26" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="19" font-weight="800" letter-spacing="-0.4" fill="${text}">OneWeb<tspan fill="${accent}">Dev</tspan></text><text x="55" y="40" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="9" font-weight="600" letter-spacing="1.9" fill="${sub}">FOR DEVELOPER</text></svg>`;
};

const og = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0b1435"/><stop offset="1" stop-color="#1c3174"/></linearGradient>
<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.from}"/><stop offset="1" stop-color="${C.to}"/></linearGradient></defs>
<rect width="1200" height="630" fill="url(#bg)"/>
<g font-family="'DejaVu Sans Mono', Menlo, Consolas, monospace" font-size="22" fill="#3b68f0" opacity="0.28">
<text x="720" y="110">&lt;section class="hero"&gt;</text><text x="750" y="150">export default App;</text><text x="700" y="520">npm run build</text><text x="780" y="560">{ "pages": 3 }</text></g>
<g transform="translate(110 175)"><rect width="280" height="280" rx="77" fill="url(#g)"/><g transform="scale(7)">${glyph("#fff", C.light)}</g></g>
<text x="450" y="300" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="74" font-weight="800" letter-spacing="-1.5" fill="#fff">OneWeb <tspan fill="#8fb0fb">DevTools</tspan></text>
<text x="454" y="365" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="30" font-weight="500" fill="#c7d4f7">Generator kode, element maker, template web,</text>
<text x="454" y="407" font-family="Inter, 'Segoe UI', Roboto, Arial, sans-serif" font-size="30" font-weight="500" fill="#c7d4f7">dan alat file untuk developer.</text>
</svg>`;

const png = (svg, size, viewBox = 40) => sharp(Buffer.from(svg), { density: Math.ceil((72 * size * 2) / viewBox) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** An ICO containing PNGs (supported by every modern browser & Windows Vista+). */
function ico(images) {
  const head = Buffer.alloc(6 + images.length * 16);
  head.writeUInt16LE(0, 0);
  head.writeUInt16LE(1, 2);
  head.writeUInt16LE(images.length, 4);
  let offset = head.length;
  images.forEach(({ size, data }, i) => {
    const o = 6 + i * 16;
    head.writeUInt8(size >= 256 ? 0 : size, o);
    head.writeUInt8(size >= 256 ? 0 : size, o + 1);
    head.writeUInt8(0, o + 2);
    head.writeUInt8(0, o + 3);
    head.writeUInt16LE(1, o + 4);
    head.writeUInt16LE(32, o + 6);
    head.writeUInt32LE(data.length, o + 8);
    head.writeUInt32LE(offset, o + 12);
    offset += data.length;
  });
  return Buffer.concat([head, ...images.map((x) => x.data)]);
}

const write = (path, data) => {
  writeFileSync(path, data);
  console.log(`  ✓ ${path.slice(pub.length + 1)}`);
};

// Sumber vektor
write(join(pub, "favicon.svg"), tile);
write(join(brandDir, "logo-mark.svg"), tile);
write(join(brandDir, "logo-mark-maskable.svg"), fullBleed);
write(join(brandDir, "logo-mark-transparent.svg"), onLight);
write(join(brandDir, "logo-mark-transparent-dark.svg"), onDark);
write(join(brandDir, "logo-light.svg"), lockup(false));
write(join(brandDir, "logo-dark.svg"), lockup(true));
write(join(brandDir, "og-image.svg"), og);

// PNG aplikasi & PWA
for (const [svg, size, name] of [
  [tile, 64, "favicon.png"],
  [tile, 64, "pwa-64x64.png"],
  [tile, 192, "pwa-192x192.png"],
  [tile, 512, "pwa-512x512.png"],
  [fullBleed, 192, "maskable-icon-192x192.png"],
  [fullBleed, 512, "maskable-icon-512x512.png"],
  [fullBleed, 180, "apple-touch-icon-180x180.png"],
])
  write(join(pub, name), await png(svg, size));

// Every common size (16–1024) for app stores, social media, and documents
mkdirSync(join(brandDir, "sizes"), { recursive: true });
for (const size of [16, 24, 32, 48, 64, 96, 128, 144, 152, 167, 180, 192, 256, 384, 512, 1024])
  write(join(brandDir, "sizes", `logo-mark-${size}.png`), await png(tile, size));

// Transparent & background versions (PNG 512) for use outside the app
write(join(brandDir, "logo-mark-512.png"), await png(tile, 512));
write(join(brandDir, "logo-mark-transparent-512.png"), await png(onLight, 512));
write(join(brandDir, "logo-mark-transparent-dark-512.png"), await png(onDark, 512));

// favicon.ico 16/32/48
write(join(pub, "favicon.ico"), ico(await Promise.all([16, 32, 48].map(async (size) => ({ size, data: await png(tile, size) })))));

// Open Graph
write(join(pub, "og-image.png"), await sharp(Buffer.from(og)).resize(1200, 630).png({ compressionLevel: 9 }).toBuffer());
