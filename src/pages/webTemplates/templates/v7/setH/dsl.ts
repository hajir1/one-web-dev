import type { TemplateCategory, TemplateTier } from "../../../../../config/templates";
import type { CardStyle, Domain, HBlock, HSpec, KpiStyle, PageKind, Shell } from "./spec";

/* Penulisan spesifikasi ringkas: satu baris per template (lihat h1.ts…h5.ts). */

/** Urutan blok beranda. */
const HOME: HBlock[][] = [
  ["kpis", "main", "split-act", "split-goal"],
  ["kpis", "main", "table", "activity"],
  ["quick", "kpis", "main", "mini-table"],
  ["kpis", "duo", "table", "split-goal"],
  ["alerts", "kpis", "main", "split-act"],
  ["kpis", "wide", "split-act", "tabs"],
  ["kpis", "main", "board", "activity"],
  ["steps", "kpis", "duo", "mini-table"],
];

/** Susunan halaman selain beranda. */
const PAGES: PageKind[][] = [
  ["records", "analytics", "settings", "login"],
  ["records", "board", "customers", "settings", "login"],
  ["records", "reports", "settings", "login"],
  ["analytics", "records", "board", "login"],
  ["customers", "records", "analytics", "reports", "settings", "login"],
  ["records", "analytics", "login"],
];

export interface Row {
  cat?: TemplateCategory;
  tier?: TemplateTier;
  shell: Shell;
  card: CardStyle;
  kpi: KpiStyle;
  /** [ink, muted, primary, primaryDark, soft, line] */
  pal: [string, string, string, string, string, string];
  font: [string, string];
  r: number;
  bg: string;
  sf?: string;
  dark?: boolean;
  login: HSpec["login"];
  pages: number;
  home: number;
  fx?: HSpec["fx"];
  tags?: string[];
}

export const h = (id: string, brand: string, domain: Domain, r: Row): HSpec => ({
  id,
  brand,
  cat: r.cat ?? "dashboard",
  tier: r.tier ?? "premium",
  domain,
  pal: r.pal,
  look: { head: r.font[0], body: r.font[1], radius: r.r, bg: r.bg, surface: r.sf ?? (r.dark ? "#111827" : "#ffffff"), dark: r.dark, card: r.card },
  shell: r.shell,
  kpi: r.tier === "free" && r.kpi === "counter" ? "plain" : r.kpi,
  login: r.login,
  pages: PAGES[r.pages],
  home: HOME[r.home],
  ...(r.tags ? { tags: r.tags } : {}),
  ...(r.fx && r.tier !== "free" ? { fx: r.fx } : {}),
});

/** Frasa gaya untuk deskripsi katalog [id, en]. */
export const SHELL_TEXT: Record<Shell, [string, string]> = {
  "side-dark": ["sidebar gelap", "a dark sidebar"],
  "side-light": ["sidebar terang bergaris", "a light outlined sidebar"],
  "side-brand": ["sidebar gradien warna merek", "a brand-gradient sidebar"],
  "side-float": ["sidebar kartu melayang", "a floating card sidebar"],
  topnav: ["navigasi atas yang lapang", "a roomy top navigation"],
  "topnav-dark": ["bilah navigasi atas gelap", "a dark top navigation bar"],
  rail: ["sidebar ramping", "a slim sidebar"],
};
export const CARD_TEXT: Record<CardStyle, [string, string]> = {
  shadow: ["kartu berbayang lembut", "soft-shadow cards"],
  border: ["kartu bergaris tipis", "thin-outline cards"],
  flat: ["kartu datar", "flat cards"],
  glass: ["kartu kaca transparan", "glassy cards"],
  brutal: ["kartu tegas bergaya neo-brutal", "bold neo-brutalist cards"],
  accent: ["kartu beraksen garis atas", "top-accent cards"],
};
