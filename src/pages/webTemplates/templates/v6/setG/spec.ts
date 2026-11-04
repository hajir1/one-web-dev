import type { TemplateCategory, TemplateTier } from "../../../../../config/templates";
import type { ChartC, Fx, Shape } from "../../v5/setF/kitF";
import type { Motif } from "./motifs";

/* ================================================================== */
/* Data specification for v6 templates part G                          */
/*                                                                    */
/* Each template is written as pure data (GSpec): identity, Look,       */
/* home & page section order, and bilingual business content. The engine */
/* in ./kitG.ts turns it into Page Maker sections using the shared kits */
/* (kitD/kitE/kitF), so the result stays fully editable.               */
/* Free templates automatically use the free equivalent of every Premium block. */
/* ================================================================== */

/** Bilingual text [id, en]. */
export type B = [string, string];

type HeroKind =
  | "full" // Full Width Header (background image)
  | "split" // Split screen
  | "bento"
  | "editorial"
  | "brutal"
  | "glass"
  | "type" // Giant typography + word band
  | "neon"
  | "poster"
  | "soft"
  | "collage"
  | "search"
  | "minimal"
  | "dash" // Panel grafik (butuh biz.chart)
  | "stacked"
  | "ticket";

/**
 * Section blocks. Blocks marked (P) use Premium elements; in Free templates they are
 * automatically replaced by free equivalents (see FREE_SWAP in kitG).
 */
export type BlockId =
  | "svc" // service cards
  | "svc-inv" // service cards, contrast background
  | "bento" // service tiles of different sizes
  | "special" // Specialty section (sidebar + inner rows)
  | "stats" // deret angka
  | "counter" // (P) statistik animasi
  | "kpi" // pita KPI
  | "zig" // langkah zigzag
  | "rail" // rel langkah
  | "quotes" // (P) testimonial cards
  | "pull" // large quote
  | "faq"
  | "tabs" // service tabs
  | "plans" // (P) pricing cards
  | "switch" // (P) monthly/yearly pricing
  | "compare" // (P) plan comparison table
  | "ptable" // plan table (free)
  | "items" // illustrated product catalog
  | "menu" // item list cards + prices (no images)
  | "list" // item row index
  | "gallery" // (P) galeri lightbox
  | "mosaic" // galeri mozaik
  | "polaroid"
  | "team"
  | "about" // split panel (photo + text)
  | "fsplit" // full-width split
  | "fimg" // a full-width image
  | "editorial" // editorial value columns
  | "notes" // value sticky notes
  | "swatch" // color/material swatches
  | "words" // word band
  | "marquee" // (P) marquee mitra
  | "partners" // partner names (free)
  | "cta"
  | "cta-soft"
  | "band" // two-way split call-to-action band
  | "news" // buletin
  | "timeline" // sejarah
  | "events" // event schedule (index)
  | "board" // papan jadwal gelap
  | "posts" // majalah artikel
  | "specs" // spesifikasi
  | "loc" // location / service area
  | "contact" // formulir kontak
  | "book" // formulir pemesanan
  | "chart" // panel grafik
  | "duo" // two charts
  | "progress" // (P) bilah progres
  | "countdown" // (P) hitung mundur
  | "slider" // (P) slider
  | "ba" // (P) before/after
  | "offer" // (P) popup penawaran
  | "notice"; // pengumuman

/** Block + replacement heading/text (optional). */
export type BlockRef = BlockId | [BlockId, B?, B?];

/** Premium elements outside sections: mega menu, back to top, typing text. */
type Chrome = "mega" | "top" | "typer";

export interface GPage {
  key: string;
  name: B;
  /** Page header title. */
  title: B;
  text?: B;
  blocks: BlockRef[];
}

export interface GChart {
  type: ChartC["type"];
  title: B;
  /** Nama seri dipisah koma. */
  series: B;
  /** "Label, nilai1, nilai2". Label dwibahasa: "Jan|Jan, 10, 12". */
  rows: string[];
}

export interface Biz {
  eyebrow: B;
  title: B;
  text: B;
  /** Main call to action → the `ctaPage` page. */
  cta: B;
  ctaPage: string;
  /** Button on product cards/lists (`items`) when the main call to action does not fit: [label, page]. */
  itemCta?: [B, string];
  /** Call-to-action section heading & text. */
  ctaTitle: B;
  ctaText: B;
  /** Offer popup [title, body]. */
  offer?: [B, B];
  /** Pengumuman singkat. */
  notice?: B;
  /** Typing text: [prefix, "word, word, word"]. */
  typer?: [B, B];
  /** Search box placeholder (hero search). */
  searchPh?: B;
  about: B;
  /** 3–4 short points (hero chips, sidebar, list). */
  perks: B[];
  /** [icon, title, text, meta?] */
  svc: [string, B, B, string?][];
  /** [angka, label, chip KPI?] */
  stats: [string, B, B?][];
  steps: [B, B][];
  quotes?: [B, string, B][];
  faq?: [B, B][];
  team?: [string, B][];
  /** [name, price, description, "feature; feature; feature", yearly price?] */
  plans?: [B, string, B, B, string?][];
  /** Plan price unit, e.g. ["/bulan", "/month"]. */
  period?: B;
  /** [name, description, price] */
  items?: [B, B, string][];
  /** [title, summary, date, tag?] */
  posts?: [B, B, string, B?][];
  /** [date, title, place/description, status?] */
  events?: [string, B, B, B?][];
  /** Values/principles [title, text] (editorial columns, sticky notes). */
  values?: [B, B][];
  /** [year, title, text] */
  history?: [string, B, B][];
  chart?: GChart;
  chart2?: GChart;
  /** Progress bars [label, value 0–100]. */
  bars?: [B, number][];
  /** [color, name, description] */
  swatches?: [string, B, B][];
  /** [key, value] */
  specs?: [B, B][];
  /** Words for the band/marquee, comma-separated. */
  words: B;
  partners?: string[];
  /** ISO date for the countdown / poster. */
  date?: string;
  dateLabel?: B;
  addr: string;
  phone: string;
  email: string;
  hours: B;
  /** [name, description, description] */
  places?: [B, B, B][];
  social: string[];
}

export interface GSpec {
  id: string;
  brand: string;
  /** Short name in the header (default: brand). */
  short?: string;
  cat: TemplateCategory;
  tier: TemplateTier;
  tags: string[];
  /** Catalog description [id, en] (without the page count; added automatically). */
  desc: B;
  /** [ink, muted, primary, primaryDark, soft, line] */
  pal: [string, string, string, string, string, string];
  look: { head: string; body: string; shape: Shape; radius: number; bg: string; alt: string; inv: string; surface?: string; fx?: Fx; upper?: boolean; dark?: boolean };
  header: "bar" | "pill" | "center" | "split" | "ink";
  footer: "giant" | "columns" | "slim";
  hero: HeroKind;
  /** Three illustration motifs (images 0–2; 3–5 = color variants). */
  art: [Motif, Motif, Motif];
  chrome?: Chrome[];
  home: BlockRef[];
  pages: GPage[];
  biz: Biz;
}
