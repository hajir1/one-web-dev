import { safeColor } from "../../helpers/background";
import { brandIconKey, brandIconKeyFromUrl } from "./brandIcons";

/* ================================================================== */
/* Utilitas kecil untuk elemen tambahan (banner, video, rating, …).     */
/* Fungsi murni → mudah diuji.                                          */
/* ================================================================== */

export const color = (c: string, d: string) => safeColor(c) ?? d;
export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));

/** Pecah "a | b | c" menjadi bagian yang sudah di-trim. */
export const cells = (line: string) => line.split("|").map((p) => p.trim());

/** Baris yang tidak kosong. */
export const nonEmpty = (lines: string[]) => lines.map((l) => l.trim()).filter(Boolean);

/** ID video YouTube dari URL umum (watch, youtu.be, shorts, embed) atau ID polos. */
export function youtubeId(url: string): string | null {
  const u = url.trim();
  if (/^[\w-]{11}$/.test(u)) return u;
  const m = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
  return m ? m[1] : null;
}

/** ID video Vimeo dari URL (vimeo.com/123, player.vimeo.com/video/123) atau angka polos. */
export function vimeoId(url: string): string | null {
  const u = url.trim();
  if (/^\d{4,12}$/.test(u)) return u;
  const m = u.match(/vimeo\.com\/(?:video\/)?(\d{4,12})/i);
  return m ? m[1] : null;
}

/** URL berkas video http(s) atau relatif yang aman (tanpa javascript:/data:). */
export function safeVideoFile(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  // Buang spasi & karakter kontrol (kode < 32) sebelum memeriksa skema berbahaya.
  const bare = [...u].filter((c) => c.charCodeAt(0) > 32).join("");
  if (/^(javascript|vbscript|data):/i.test(bare)) return null;
  return /^(https?:\/\/|\/|\.\/|[\w-]+\/)/i.test(u) || /^[\w.-]+\.(mp4|webm|ogg)$/i.test(u) ? u : null;
}

/** "12.500+" → { prefix: "", value: 12500, suffix: "+", decimals: 0 }. Null bila tidak ada angka. */
export function parseStat(raw: string): { prefix: string; value: number; suffix: string; decimals: number } | null {
  const m = raw.trim().match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!m) return null;
  let num = m[2];
  // Satu koma/titik diikuti 1–2 digit di akhir = desimal; sisanya pemisah ribuan.
  const dec = num.match(/[.,](\d{1,2})$/);
  let decimals = 0;
  if (dec && !/[.,]\d{3}$/.test(num)) {
    decimals = dec[1].length;
    num = num.slice(0, -dec[0].length).replace(/[.,]/g, "") + "." + dec[1];
  } else num = num.replace(/[.,]/g, "");
  const value = Number(num);
  if (!Number.isFinite(value)) return null;
  return { prefix: m[1].trim(), value, suffix: m[3].trim(), decimals };
}

/** Format angka sesuai locale tanpa Intl yang berbeda antar-mesin: pemisah ribuan "." (id) atau "," (en). */
export function formatStat(value: number, decimals: number, locale: "id" | "en"): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const sep = locale === "id" ? "." : ",";
  const dot = locale === "id" ? "," : ".";
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return (value < 0 ? "-" : "") + grouped + (frac ? dot + frac : "");
}

/** Nilai sel tabel perbandingan: true/false untuk ya/tidak, selain itu teks apa adanya. */
export function comparisonCell(v: string): boolean | string {
  const t = v.trim().toLowerCase();
  if (["ya", "yes", "✓", "v", "true", "1"].includes(t)) return true;
  if (["tidak", "no", "-", "✗", "x", "false", "0", ""].includes(t)) return false;
  return v.trim();
}

export interface MegaMenuItem {
  label: string;
  href: string;
  links: { title: string; description: string; href: string }[];
}

/**
 * Format baris mega menu:
 *   Produk | #produk            ← menu utama
 *   - Analitik | Dasbor real-time | #analitik   ← tautan di panel menu di atasnya
 */
export function parseMegaMenu(lines: string[]): MegaMenuItem[] {
  const out: MegaMenuItem[] = [];
  for (const raw of nonEmpty(lines)) {
    if (raw.startsWith("-")) {
      const [title = "", description = "", href = "#"] = cells(raw.replace(/^-+\s*/, ""));
      if (title && out.length) out[out.length - 1].links.push({ title, description, href: href || "#" });
    } else {
      const [label = "", href = "#"] = cells(raw);
      if (label) out.push({ label, href: href || "#", links: [] });
    }
  }
  return out.slice(0, 8);
}

export interface PricingPlan {
  name: string;
  monthly: string;
  yearly: string;
  features: string[];
  cta: string;
}

/** "Nama | harga bulanan | harga tahunan | fitur; fitur | Teks tombol" */
export function parsePlans(lines: string[]): PricingPlan[] {
  return nonEmpty(lines)
    .map((l) => {
      const [name = "", monthly = "", yearly = "", features = "", cta = ""] = cells(l);
      return { name, monthly, yearly: yearly || monthly, features: features.split(";").map((f) => f.trim()).filter(Boolean), cta };
    })
    .filter((p) => p.name)
    .slice(0, 4);
}

/** Durasi CSS dari detik (dibatasi). */
export const seconds = (n: number, min: number, max: number) => `${clamp(n, min, max)}s`;

/* ------------------------------------------------------------------ */
/* Parser elemen v2 (divider, radio, sosial, timeline, galeri, marquee) */
/* ------------------------------------------------------------------ */

/**
 * URL gambar aman: seperti safeLink, ditambah data URI SVG. SVG hanya
 * dipakai sebagai <img>/background, konteks yang tidak menjalankan skrip,
 * jadi ilustrasi template (data:image/svg+xml) tetap tampil.
 */
export function safeImage(url: string): string {
  const u = String(url ?? "").trim();
  return /^data:image\/svg\+xml[;,]/i.test(u) ? u : safeLink(u);
}

/** URL aman untuk href/src: skema berbahaya (javascript:, vbscript:, data: non-gambar) → "". */
export function safeLink(url: string): string {
  const u = String(url ?? "").trim();
  if (!u) return "";
  const bare = [...u].filter((c) => c.charCodeAt(0) > 32).join("");
  if (/^(javascript|vbscript|data):/i.test(bare)) return /^data:image\/(png|jpe?g|gif|webp|avif);/i.test(bare) ? u : "";
  return u;
}

/** Opsi radio: satu per baris, maksimal 12, tanpa duplikat. */
export function parseOptions(lines: string[]): string[] {
  return [...new Set(nonEmpty(lines))].slice(0, 12);
}

export interface SocialLink {
  name: string;
  href: string;
  /** Teks cadangan bila jaringan tidak punya logo. */
  glyph: string;
  /** Kunci logo di BRAND_ICONS (null = pakai glyph). */
  icon: string | null;
}

const SOCIAL_GLYPH: Record<string, string> = {
  facebook: "f",
  instagram: "IG",
  x: "X",
  twitter: "X",
  linkedin: "in",
  youtube: "YT",
  tiktok: "TT",
  github: "GH",
  whatsapp: "WA",
  telegram: "TG",
  threads: "@",
  pinterest: "P",
  dribbble: "Dr",
  behance: "Be",
  discord: "DC",
  email: "@",
  website: "www",
};

/** Teks ikon singkat untuk nama jaringan ("LinkedIn" → "in", "Mastodon" → "M"). */
export function socialGlyph(name: string): string {
  const k = name.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (SOCIAL_GLYPH[k]) return SOCIAL_GLYPH[k];
  const first = [...name.trim()][0] ?? "?";
  return first.toUpperCase();
}

/** "Nama | url" → tautan sosial; URL berbahaya dibuang (baris dilewati). Maksimal 12. */
export function parseSocialLinks(lines: string[]): SocialLink[] {
  return nonEmpty(lines)
    .map((l) => {
      const [name = "", url = ""] = cells(l);
      const href = safeLink(url);
      return { name, href, glyph: socialGlyph(name), icon: brandIconKey(name) ?? brandIconKeyFromUrl(href) };
    })
    .filter((x) => x.name && x.href)
    .slice(0, 12);
}

export interface TimelineEntry {
  date: string;
  title: string;
  text: string;
}

/** "tanggal | judul | teks" → entri timeline (judul wajib). Maksimal 20. */
export function parseTimeline(lines: string[]): TimelineEntry[] {
  return nonEmpty(lines)
    .map((l) => {
      const [date = "", title = "", ...rest] = cells(l);
      return { date, title, text: rest.join(" | ").trim() };
    })
    .filter((e) => e.title)
    .slice(0, 20);
}

export interface GalleryImage {
  src: string;
  caption: string;
}

/** "url | keterangan" → gambar galeri; URL kosong/berbahaya dibuang. Maksimal 24. */
export function parseGallery(lines: string[]): GalleryImage[] {
  return nonEmpty(lines)
    .map((l) => {
      const [url = "", ...rest] = cells(l);
      return { src: safeImage(url), caption: rest.join(" | ").trim() };
    })
    .filter((g) => g.src)
    .slice(0, 24);
}

export interface MarqueeItem {
  label: string;
  src: string;
}

/** "Label" atau "Label | url logo" → item marquee (src kosong = tampil sebagai teks). Maksimal 20. */
export function parseMarquee(lines: string[]): MarqueeItem[] {
  return nonEmpty(lines)
    .map((l) => {
      const [label = "", url = ""] = cells(l);
      return { label, src: safeImage(url) };
    })
    .filter((m) => m.label || m.src)
    .slice(0, 20);
}

/** Nama atribut `name` form yang aman (huruf, angka, _ dan -). */
export const fieldName = (n: string, d: string) => n.replace(/[^\w-]/g, "") || d;

/* ------------------------------------------------------------------ */
/* Parser elemen v3 (avatar, paginasi, langkah, hotspot, wizard, …)     */
/* ------------------------------------------------------------------ */

/** Inisial dari nama (maks. 2 huruf), mis. "Sari Dewi" → "SD". */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  const first = parts[0][0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? "") : "";
  return (first + last).toUpperCase();
}

export interface Person {
  name: string;
  photo: string;
}

/** "Nama | URL foto (opsional)" — maksimal 12 orang. */
export function parsePeople(lines: string[]): Person[] {
  return nonEmpty(lines)
    .map((l) => {
      const [name = "", photo = ""] = cells(l);
      return { name, photo: safeImage(photo) };
    })
    .filter((p) => p.name)
    .slice(0, 12);
}

/** "Label | href" — maksimal 12 tautan. */
export function parseLinks(lines: string[]): { label: string; href: string }[] {
  return nonEmpty(lines)
    .map((l) => {
      const [label = "", href = ""] = cells(l);
      return { label, href: safeLink(href) || "#" };
    })
    .filter((x) => x.label)
    .slice(0, 12);
}

/**
 * Nomor halaman yang ditampilkan paginasi: halaman pertama, terakhir, dan
 * sekitar halaman aktif; celah ditandai "…". Mis. (10, 5) → 1 … 4 5 6 … 10.
 */
export function paginationItems(total: number, current: number): (number | "…")[] {
  const n = Math.round(clamp(total, 1, 999));
  const c = Math.round(clamp(current, 1, n));
  const keep = new Set([1, n, c - 1, c, c + 1].filter((p) => p >= 1 && p <= n));
  // Celah satu halaman tidak perlu "…": tampilkan saja halamannya.
  if (keep.has(3) || c <= 3) keep.add(2);
  if (keep.has(n - 2) || c >= n - 2) keep.add(n - 1);
  const pages = [...keep].filter((p) => p >= 1 && p <= n).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

/** URL halaman dari pola, mis. "?page={n}" → "?page=3". Skema berbahaya → "#". */
export const pageHref = (pattern: string, n: number) => safeLink((pattern || "?page={n}").split("{n}").join(String(n))) || "#";

export interface StepItem {
  title: string;
  text: string;
}

/** "Judul | keterangan (opsional)" — maksimal 8 langkah. */
export function parseSteps(lines: string[]): StepItem[] {
  return nonEmpty(lines)
    .map((l) => {
      const [title = "", text = ""] = cells(l);
      return { title, text };
    })
    .filter((x) => x.title)
    .slice(0, 8);
}

export interface Hotspot {
  x: number;
  y: number;
  title: string;
  text: string;
}

/** "x% | y% | Judul | Keterangan" — posisi dibatasi 0–100, maksimal 10 titik. */
export function parseHotspots(lines: string[]): Hotspot[] {
  return nonEmpty(lines)
    .map((l) => {
      const [x = "", y = "", title = "", text = ""] = cells(l);
      return { x: clamp(parseFloat(x), 0, 100), y: clamp(parseFloat(y), 0, 100), title, text };
    })
    .filter((h) => h.title)
    .slice(0, 10);
}

export interface WizardField {
  label: string;
  name: string;
  type: "text" | "email" | "tel" | "number" | "date" | "textarea";
  required: boolean;
}
export interface WizardStep {
  title: string;
  fields: WizardField[];
}

/** Jenis input ditebak dari label (email, telepon, tanggal, angka, pesan). */
export function guessFieldType(label: string): WizardField["type"] {
  const l = label.toLowerCase();
  if (/e-?mail/.test(l)) return "email";
  if (/telepon|telp|phone|whatsapp|\bwa\b|\bhp\b|ponsel/.test(l)) return "tel";
  if (/tanggal|date/.test(l)) return "date";
  if (/jumlah|umur|usia|qty|quantity|number|angka/.test(l)) return "number";
  if (/pesan|catatan|keterangan|message|notes?|alamat|address/.test(l)) return "textarea";
  return "text";
}

/** Nama field aman dari label, mis. "Nama lengkap*" → "nama_lengkap". */
const slugField = (label: string, i: number) =>
  label
    .toLowerCase()
    .replace(/\*/g, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .slice(0, 40) || `field_${i + 1}`;

/** "Judul langkah | Label 1*; Label 2; …" (* = wajib) — maks. 5 langkah × 6 field. */
export function parseWizard(lines: string[]): WizardStep[] {
  let n = 0;
  return nonEmpty(lines)
    .map((l) => {
      const [title = "", list = ""] = cells(l);
      const fields = list
        .split(";")
        .map((f) => f.trim())
        .filter(Boolean)
        .slice(0, 6)
        .map((raw) => {
          const label = raw.replace(/\*+$/, "").trim();
          return { label, name: slugField(label, n++), type: guessFieldType(label), required: /\*$/.test(raw) };
        });
      return { title, fields };
    })
    .filter((s) => s.title && s.fields.length)
    .slice(0, 5);
}

/** URL sematan Google Maps dari alamat/kata kunci (tanpa API key). */
export function mapsEmbedUrl(query: string, zoom: number): string {
  const q = encodeURIComponent(query.trim() || "Monas, Jakarta");
  return `https://maps.google.com/maps?q=${q}&z=${Math.round(clamp(zoom, 3, 20))}&output=embed`;
}
