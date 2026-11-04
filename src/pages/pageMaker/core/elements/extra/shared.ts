import { safeColor } from "../../helpers/background";
import { brandIconKey, brandIconKeyFromUrl } from "./brandIcons";

/* ================================================================== */
/* Small utilities for extra elements (banner, video, rating, …).       */
/* Pure functions → easy to test.                                       */
/* ================================================================== */

export const color = (c: string, d: string) => safeColor(c) ?? d;
export const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));

/** Splits "a | b | c" into trimmed parts. */
export const cells = (line: string) => line.split("|").map((p) => p.trim());

/** Non-empty lines. */
export const nonEmpty = (lines: string[]) => lines.map((l) => l.trim()).filter(Boolean);

/** YouTube video ID from common URLs (watch, youtu.be, shorts, embed) or a plain ID. */
export function youtubeId(url: string): string | null {
  const u = url.trim();
  if (/^[\w-]{11}$/.test(u)) return u;
  const m = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
  return m ? m[1] : null;
}

/** Vimeo video ID from a URL (vimeo.com/123, player.vimeo.com/video/123) or a plain number. */
export function vimeoId(url: string): string | null {
  const u = url.trim();
  if (/^\d{4,12}$/.test(u)) return u;
  const m = u.match(/vimeo\.com\/(?:video\/)?(\d{4,12})/i);
  return m ? m[1] : null;
}

/** A safe http(s) or relative video file URL (no javascript:/data:). */
export function safeVideoFile(url: string): string | null {
  const u = url.trim();
  if (!u) return null;
  // Strip spaces & control characters (code < 32) before checking for dangerous schemes.
  const bare = [...u].filter((c) => c.charCodeAt(0) > 32).join("");
  if (/^(javascript|vbscript|data):/i.test(bare)) return null;
  return /^(https?:\/\/|\/|\.\/|[\w-]+\/)/i.test(u) || /^[\w.-]+\.(mp4|webm|ogg)$/i.test(u) ? u : null;
}

/** "12.500+" → { prefix: "", value: 12500, suffix: "+", decimals: 0 }. Null when there is no number. */
export function parseStat(raw: string): { prefix: string; value: number; suffix: string; decimals: number } | null {
  const m = raw.trim().match(/^([^\d-]*)(-?[\d.,]+)(.*)$/);
  if (!m) return null;
  let num = m[2];
  // A single comma/dot followed by 1–2 digits at the end = decimal; the rest are thousands separators.
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

/** Formats numbers per locale without Intl differences between engines: thousands separator "." (id) or "," (en). */
export function formatStat(value: number, decimals: number, locale: "id" | "en"): string {
  const fixed = Math.abs(value).toFixed(decimals);
  const [int, frac] = fixed.split(".");
  const sep = locale === "id" ? "." : ",";
  const dot = locale === "id" ? "," : ".";
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  return (value < 0 ? "-" : "") + grouped + (frac ? dot + frac : "");
}

/** Comparison table cell value: true/false for yes/no, otherwise the text as is. */
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
 * Mega menu line format:
 *   Products | #products            ← main menu
 *   - Analytics | Real-time dashboard | #analytics   ← link in the menu panel above it
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

/** "Name | monthly price | yearly price | feature; feature | Button text" */
export function parsePlans(lines: string[]): PricingPlan[] {
  return nonEmpty(lines)
    .map((l) => {
      const [name = "", monthly = "", yearly = "", features = "", cta = ""] = cells(l);
      return { name, monthly, yearly: yearly || monthly, features: features.split(";").map((f) => f.trim()).filter(Boolean), cta };
    })
    .filter((p) => p.name)
    .slice(0, 4);
}

/** CSS duration from seconds (clamped). */
export const seconds = (n: number, min: number, max: number) => `${clamp(n, min, max)}s`;

/* ------------------------------------------------------------------ */
/* v2 element parsers (divider, radio, social, timeline, gallery, marquee) */
/* ------------------------------------------------------------------ */

/**
 * Safe image URL: like safeLink, plus SVG data URIs. SVG is only
 * used as <img>/background, contexts that do not run scripts,
 * so template illustrations (data:image/svg+xml) still show.
 */
export function safeImage(url: string): string {
  const u = String(url ?? "").trim();
  return /^data:image\/svg\+xml[;,]/i.test(u) ? u : safeLink(u);
}

/** Safe URL for href/src: dangerous schemes (javascript:, vbscript:, non-image data:) → "". */
export function safeLink(url: string): string {
  const u = String(url ?? "").trim();
  if (!u) return "";
  const bare = [...u].filter((c) => c.charCodeAt(0) > 32).join("");
  if (/^(javascript|vbscript|data):/i.test(bare)) return /^data:image\/(png|jpe?g|gif|webp|avif);/i.test(bare) ? u : "";
  return u;
}

/** Radio options: one per line, at most 12, no duplicates. */
export function parseOptions(lines: string[]): string[] {
  return [...new Set(nonEmpty(lines))].slice(0, 12);
}

export interface SocialLink {
  name: string;
  href: string;
  /** Fallback text when the network has no logo. */
  glyph: string;
  /** Logo key in BRAND_ICONS (null = use a glyph). */
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

/** Short icon text for a network name ("LinkedIn" → "in", "Mastodon" → "M"). */
export function socialGlyph(name: string): string {
  const k = name.trim().toLowerCase().replace(/[^a-z]/g, "");
  if (SOCIAL_GLYPH[k]) return SOCIAL_GLYPH[k];
  const first = [...name.trim()][0] ?? "?";
  return first.toUpperCase();
}

/** "Name | url" → social link; dangerous URLs are dropped (line skipped). At most 12. */
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

/** "date | title | text" → timeline entry (title required). At most 20. */
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

/** "url | caption" → gallery image; empty/dangerous URLs are dropped. Max 24. */
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

/** "Label" or "Label | logo url" → marquee item (empty src = shown as text). Max 20. */
export function parseMarquee(lines: string[]): MarqueeItem[] {
  return nonEmpty(lines)
    .map((l) => {
      const [label = "", url = ""] = cells(l);
      return { label, src: safeImage(url) };
    })
    .filter((m) => m.label || m.src)
    .slice(0, 20);
}

/** A safe form `name` attribute (letters, digits, _ and -). */
export const fieldName = (n: string, d: string) => n.replace(/[^\w-]/g, "") || d;

/* ------------------------------------------------------------------ */
/* v3 element parsers (avatar, pagination, steps, hotspot, wizard, …)   */
/* ------------------------------------------------------------------ */

/** Initials from a name (max. 2 letters), e.g. "Sari Dewi" → "SD". */
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

/** "Name | photo URL (optional)" — at most 12 people. */
export function parsePeople(lines: string[]): Person[] {
  return nonEmpty(lines)
    .map((l) => {
      const [name = "", photo = ""] = cells(l);
      return { name, photo: safeImage(photo) };
    })
    .filter((p) => p.name)
    .slice(0, 12);
}

/** "Label | href" — at most 12 links. */
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
 * Page numbers shown by the pagination: the first page, the last, and
 * those around the active page; gaps are marked "…". E.g. (10, 5) → 1 … 4 5 6 … 10.
 */
export function paginationItems(total: number, current: number): (number | "…")[] {
  const n = Math.round(clamp(total, 1, 999));
  const c = Math.round(clamp(current, 1, n));
  const keep = new Set([1, n, c - 1, c, c + 1].filter((p) => p >= 1 && p <= n));
  // A one-page gap does not need "…": just show the page.
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

/** Page URL from a pattern, e.g. "?page={n}" → "?page=3". Dangerous schemes → "#". */
export const pageHref = (pattern: string, n: number) => safeLink((pattern || "?page={n}").split("{n}").join(String(n))) || "#";

export interface StepItem {
  title: string;
  text: string;
}

/** "Title | description (optional)" — at most 8 steps. */
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

/** "x% | y% | Title | Description" — positions clamped to 0–100, at most 10 points. */
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

/** Input type guessed from the label (email, phone, date, number, message). */
export function guessFieldType(label: string): WizardField["type"] {
  const l = label.toLowerCase();
  if (/e-?mail/.test(l)) return "email";
  if (/telepon|telp|phone|whatsapp|\bwa\b|\bhp\b|ponsel/.test(l)) return "tel";
  if (/tanggal|date/.test(l)) return "date";
  if (/jumlah|umur|usia|qty|quantity|number|angka/.test(l)) return "number";
  if (/pesan|catatan|keterangan|message|notes?|alamat|address/.test(l)) return "textarea";
  return "text";
}

/** Safe field name from a label, e.g. "Nama lengkap*" → "nama_lengkap". */
const slugField = (label: string, i: number) =>
  label
    .toLowerCase()
    .replace(/\*/g, "")
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "_")
    .slice(0, 40) || `field_${i + 1}`;

/** "Step title | Label 1*; Label 2; …" (* = required) — max. 5 steps × 6 fields. */
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

/** Google Maps embed URL from an address/keyword (no API key). */
export function mapsEmbedUrl(query: string, zoom: number): string {
  const q = encodeURIComponent(query.trim() || "Monas, Jakarta");
  return `https://maps.google.com/maps?q=${q}&z=${Math.round(clamp(zoom, 3, 20))}&output=embed`;
}
