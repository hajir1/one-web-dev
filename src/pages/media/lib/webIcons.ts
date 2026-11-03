// ─── lib/webIcons.ts ─────────────────────────────────────────────────────────
// Logika murni Favicon Generator & OG Image Maker (v10): penyusun berkas ICO,
// daftar ukuran ikon, site.webmanifest, dan potongan HTML <head>. Render ke
// canvas dilakukan di halaman (browser), jadi modul ini bisa diuji di Node.

export interface IconSpec {
  name: string;
  size: number;
  /** Latar diisi penuh (apple-touch-icon tidak boleh transparan). */
  opaque?: boolean;
  /** Ruang aman 80% di tengah untuk ikon maskable Android. */
  maskable?: boolean;
}

export const ICON_SPECS: IconSpec[] = [
  { name: "favicon-16x16.png", size: 16 },
  { name: "favicon-32x32.png", size: 32 },
  { name: "favicon-48x48.png", size: 48 },
  { name: "apple-touch-icon.png", size: 180, opaque: true },
  { name: "android-chrome-192x192.png", size: 192 },
  { name: "android-chrome-512x512.png", size: 512 },
  { name: "maskable-icon-512x512.png", size: 512, opaque: true, maskable: true },
];

/** Ukuran yang dimasukkan ke favicon.ico. */
export const ICO_SIZES = [16, 32, 48] as const;

/**
 * Susun favicon.ico dari PNG (format "PNG di dalam ICO", didukung semua
 * browser modern dan Windows Vista+). `pngs` berisi ukuran sisi & bytes PNG.
 */
export function buildIco(pngs: { size: number; bytes: Uint8Array }[]): Uint8Array {
  if (!pngs.length) throw new Error("ICO butuh minimal 1 gambar");
  const header = 6;
  const entry = 16;
  const total = header + entry * pngs.length + pngs.reduce((s, p) => s + p.bytes.length, 0);
  const out = new Uint8Array(total);
  const v = new DataView(out.buffer);
  v.setUint16(0, 0, true); // reserved
  v.setUint16(2, 1, true); // 1 = ikon
  v.setUint16(4, pngs.length, true);
  let offset = header + entry * pngs.length;
  pngs.forEach((p, i) => {
    if (p.size < 1 || p.size > 256) throw new Error("Ukuran ikon ICO 1–256 px");
    const at = header + i * entry;
    out[at] = p.size === 256 ? 0 : p.size; // 0 berarti 256
    out[at + 1] = p.size === 256 ? 0 : p.size;
    out[at + 2] = 0; // palet
    out[at + 3] = 0;
    v.setUint16(at + 4, 1, true); // color planes
    v.setUint16(at + 6, 32, true); // bit per piksel
    v.setUint32(at + 8, p.bytes.length, true);
    v.setUint32(at + 12, offset, true);
    out.set(p.bytes, offset);
    offset += p.bytes.length;
  });
  return out;
}

const HEX = /^#[0-9a-f]{6}$/i;
export const safeHex = (c: string, fallback = "#ffffff") => (HEX.test(c) ? c.toLowerCase() : fallback);

export function webManifest(o: { name: string; shortName?: string; themeColor: string; backgroundColor: string }): string {
  const name = o.name.trim().slice(0, 60) || "Situs Saya";
  return (
    JSON.stringify(
      {
        name,
        short_name: (o.shortName?.trim() || name).slice(0, 12),
        icons: [
          { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          { src: "/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
        theme_color: safeHex(o.themeColor, "#3b68f0"),
        background_color: safeHex(o.backgroundColor),
        display: "standalone",
        start_url: "/",
      },
      null,
      2,
    ) + "\n"
  );
}

/** Potongan HTML untuk <head>. */
export function faviconHtml(themeColor: string, withSvg: boolean): string {
  return [
    `<link rel="icon" href="/favicon.ico" sizes="48x48" />`,
    ...(withSvg ? [`<link rel="icon" href="/favicon.svg" type="image/svg+xml" />`] : []),
    `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />`,
    `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />`,
    `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />`,
    `<link rel="manifest" href="/site.webmanifest" />`,
    `<meta name="theme-color" content="${safeHex(themeColor, "#3b68f0")}" />`,
  ].join("\n");
}

/* ------------------------------- OG image ------------------------------- */

export const OG_SIZE = { width: 1200, height: 630 } as const;

/**
 * Pecah teks menjadi baris yang muat di `maxWidth` (pengukur lebar disuntik
 * supaya bisa diuji tanpa canvas). Kata yang terlalu panjang dipotong paksa.
 * Baris ke-`maxLines` diakhiri "…" bila masih ada sisa.
 */
export function wrapText(text: string, maxWidth: number, measure: (s: string) => number, maxLines: number): string[] {
  const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  const push = (s: string) => lines.push(s);
  for (let w of words) {
    while (measure(w) > maxWidth && w.length > 1) {
      // Potong kata sangat panjang (mis. URL) per karakter.
      let cut = w.length - 1;
      while (cut > 1 && measure(w.slice(0, cut)) > maxWidth) cut--;
      if (cur) {
        push(cur);
        cur = "";
      }
      push(w.slice(0, cut));
      w = w.slice(cut);
    }
    const next = cur ? `${cur} ${w}` : w;
    if (measure(next) <= maxWidth) cur = next;
    else {
      if (cur) push(cur);
      cur = w;
    }
  }
  if (cur) push(cur);
  if (lines.length <= maxLines) return lines;
  const kept = lines.slice(0, maxLines);
  let last = kept[maxLines - 1];
  while (last.length > 1 && measure(`${last}…`) > maxWidth) last = last.slice(0, -1);
  kept[maxLines - 1] = `${last.replace(/\s+$/, "")}…`;
  return kept;
}

/** Warna teks yang terbaca di atas latar (hitam/putih), berdasarkan luminans relatif WCAG. */
export function readableOn(hex: string): "#111827" | "#ffffff" {
  const h = safeHex(hex);
  const ch = [1, 3, 5].map((i) => {
    const c = parseInt(h.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const lum = 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
  // Kontras terhadap putih vs hitam, pilih yang lebih tinggi.
  return (1.05 / (lum + 0.05) >= (lum + 0.05) / 0.05 ? "#ffffff" : "#111827");
}

export function ogMetaHtml(o: { title: string; description: string; imageUrl: string }): string {
  const a = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return [
    `<meta property="og:title" content="${a(o.title)}" />`,
    ...(o.description ? [`<meta property="og:description" content="${a(o.description)}" />`] : []),
    `<meta property="og:image" content="${a(o.imageUrl || "https://domainanda.com/og-image.png")}" />`,
    `<meta property="og:image:width" content="${OG_SIZE.width}" />`,
    `<meta property="og:image:height" content="${OG_SIZE.height}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
  ].join("\n");
}
