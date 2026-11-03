import type { BoxNode, ComponentNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../../../pageMaker/engine/helpers/componentTypes";
import type { AnimateSettings, AosSettings, LibraryId } from "../../../../pageMaker/engine/helpers/libraries";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import { createRow } from "../../../../pageMaker/helpers/rowModel";
import { TF } from "../../../../pageMaker/core/helpers/templateFonts";
import { badge, button, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../../build";
import type { TemplatePageDef } from "../../../types";
import { listingCard, pageWith } from "../../pro/kit";
import { field, type Field } from "../../v2/setA/kitA";
import type { ProTheme } from "../../../../pageMaker/helpers/sectionPresetsPro";
import { animate, aos, installLibs, tilt } from "../libs";

/* ================================================================== */
/* Perangkat template v3 bagian D                                        */
/*                                                                    */
/* Gaya section BARU (bukan v2): bento, editorial/majalah, brutalis,     */
/* kaca (glassmorphism), layar terbagi, tipografi raksasa, pita kata,    */
/* neon gelap, pastel lembut, retro poster. Setiap template memilih      */
/* bentuk kartu (`shape`), palet, radius, pasangan font Google (TF) dan   */
/* gaya hero sendiri. Efek library (AOS / Animate.css / Vanilla Tilt)    */
/* dipasang pada node nyata sesuai `fx` template, lalu `pageD()`          */
/* memasang library yang benar-benar dipakai di halaman (root.libraries). */
/* ================================================================== */

export type { Field };

export type Shape = "brutal" | "glass" | "soft" | "sharp" | "neon" | "editorial" | "retro";

export interface Fx {
  aos?: AosSettings["effect"];
  animate?: AnimateSettings["effect"];
  tilt?: boolean;
}

export interface LookD {
  p: Palette;
  /** Latar section utama / selang-seling / pita kontras. */
  bg: string;
  alt: string;
  inv: string;
  /** Latar kartu & elemen form. */
  surface: string;
  radius: number;
  shape: Shape;
  head: string;
  body: string;
  headFont: string;
  font: string;
  fx: Fx;
  upper: boolean;
  /** Tema gelap (teks terang). */
  dark: boolean;
}

export function lookD(p: Palette, o: { head: string; body: string; shape: Shape; radius: number; bg: string; alt: string; inv: string; surface?: string; fx: Fx; upper?: boolean; dark?: boolean }): LookD {
  if (!TF[o.head] || !TF[o.body]) throw new Error(`Unknown template font: ${o.head} / ${o.body}`);
  return { p, bg: o.bg, alt: o.alt, inv: o.inv, surface: o.surface ?? "#ffffff", radius: o.radius, shape: o.shape, head: o.head, body: o.body, headFont: TF[o.head], font: TF[o.body], fx: o.fx, upper: !!o.upper, dark: !!o.dark };
}

/* ------------------------------ halaman ---------------------------- */

export const home = (id = "Beranda", en = "Home"): TemplatePageDef => ({ key: "home", slug: { id: "index", en: "index" }, name: { id, en }, home: true });
export const pg = (key: string, idv: [string, string], env: [string, string]): TemplatePageDef => ({ key, slug: { id: idv[0], en: env[0] }, name: { id: idv[1], en: env[1] } });

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

/** Halaman: font isi + latar root, lalu pasang library yang dipakai node di halaman ini. */
function pageD(L: LookD, sections: BoxNode[]): PageDoc {
  const doc = pageWith(sections, L.font, L.bg);
  const used = new Set<LibraryId>();
  const scan = () => sections.forEach((s) => walk(s, (n) => Object.keys(n.libs ?? {}).forEach((k) => used.add(k as LibraryId))));
  scan();
  // Jaminan: section isi pertama selalu punya efek bila template memakai library.
  if (used.size === 0 && sections[1]) {
    if (L.fx.aos) aos(sections[1], L.fx.aos);
    else if (L.fx.animate) animate(sections[1], L.fx.animate);
    else if (L.fx.tilt) tilt(sections[1], { max: 4 });
    scan();
  }
  return installLibs(doc, [...used]);
}

/** Tema untuk preset section Pro (sectionPresetsPro) dari Look template. */
export const pro = (L: LookD): ProTheme => ({ p: L.p, bg: L.bg, alt: L.alt, dark: L.inv, radius: L.radius, headFont: L.headFont });

/** Section preset + efek library pada isinya. */
export function withFx(L: LookD, s: BoxNode): BoxNode {
  s.children.forEach((r) => fxBlock(L, r));
  return s;
}

/** Susun halaman: header + section halaman `key` (atau beranda) + footer. */
export function render(L: LookD, key: string, head: BoxNode, foot: BoxNode, map: Record<string, () => BoxNode[]>): PageDoc {
  const f = map[key] ?? map.home;
  return pageD(L, [head, ...f(), foot]);
}

/* ------------------------------ util ------------------------------- */

export function addCss(n: ElementNode | BoxNode, decl: string): void {
  let cur = n.advanced?.customCss ?? "";
  if (!cur.includes("{") && !decl.includes("{")) {
    n.advanced = { ...n.advanced, customCss: `${cur}${cur ? "\n" : ""}${decl}` };
    return;
  }
  if (cur && !cur.includes("{")) cur = `& { ${cur} }`;
  const d = decl.includes("{") ? decl : `& { ${decl} }`;
  n.advanced = { ...n.advanced, customCss: cur ? `${cur}\n${d}` : d };
}

/** Efek hero (judul). */
export function fxHero<T extends ComponentNode>(L: LookD, n: T): T {
  if (L.fx.animate) return animate(n, L.fx.animate);
  if (L.fx.aos) return aos(n, "fade-up");
  return n;
}
/** Efek gambar. */
export function fxImg<T extends ComponentNode>(L: LookD, n: T): T {
  if (L.fx.tilt) return tilt(n, { max: 8, glare: true, scale: 1.02 });
  if (L.fx.aos) return aos(n, "zoom-in");
  return n;
}
/** Efek kartu satu per satu. */
export function fxCard<T extends ComponentNode>(L: LookD, n: T, i = 0): T {
  if (L.fx.tilt) tilt(n, { max: 6 });
  if (L.fx.aos) aos(n, L.fx.aos, { delay: Math.min(900, i * 100) });
  return n;
}
/** Efek isi section (blok teks). */
export function fxBlock<T extends ComponentNode>(L: LookD, n: T): T {
  if (L.fx.aos) return aos(n, L.fx.aos);
  if (L.fx.animate) return animate(n, "fadeIn", { speed: "slow" });
  return n;
}

/** Judul dengan font judul tema (huruf besar bila tema `upper`). */
export function T(L: LookD, text: string, tag: "h1" | "h2" | "h3" | "h4", o: Parameters<typeof heading>[2] = {}): ElementNode {
  const n = heading(text, tag, { color: L.p.ink, transform: L.upper && tag !== "h4" ? "uppercase" : "none", ...o });
  addCss(n, `font-family: ${L.headFont};`);
  if (L.shape === "neon" && (tag === "h1" || tag === "h2")) addCss(n, `text-shadow: 0 0 22px ${L.p.primary}88;`);
  return n;
}

export const P = (L: LookD, text: string, o: Parameters<typeof para>[1] = {}) => para(text, { color: L.p.muted, ...o });

export type Act = [string, string, ("primary" | "outline" | "light" | "dark")?];
export function acts(L: LookD, list: Act[], justify: "start" | "center" = "start"): BoxNode {
  return inline(
    list.map(([l, h, k]) => {
      const b = linkButton(l, h, k ?? "primary", L.p);
      b.state = { ...b.state, borderRadius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.shape === "soft" ? 999 : Math.min(L.radius, 14) };
      if (L.shape === "brutal" && (k ?? "primary") === "primary") addCss(b, `box-shadow: 4px 4px 0 ${L.p.ink}; border: 2px solid ${L.p.ink};`);
      if (L.shape === "neon" && (k ?? "primary") === "primary") addCss(b, `box-shadow: 0 0 18px ${L.p.primary}99;`);
      return b;
    }),
    { justify },
  );
}

/** Gaya kartu sesuai bentuk tema. */
function shapeCss(L: LookD, tone: "card" | "inv" = "card"): string {
  const r = `${L.radius}px`;
  if (tone === "inv") return `background: #ffffff12; border: 1px solid #ffffff26; border-radius: ${r};`;
  switch (L.shape) {
    case "brutal":
      return `background: ${L.surface}; border: 3px solid ${L.p.ink}; box-shadow: 6px 6px 0 ${L.p.ink}; border-radius: ${r};`;
    case "glass":
      return `background: ${L.surface}b8; border: 1px solid #ffffff99; box-shadow: 0 12px 40px -18px ${L.p.primaryDark}66; backdrop-filter: blur(14px); border-radius: ${r};`;
    case "soft":
      return `background: ${L.surface}; box-shadow: 0 24px 48px -28px ${L.p.primary}88; border-radius: ${r};`;
    case "sharp":
      return `background: ${L.surface}; border-top: 3px solid ${L.p.primary}; border-radius: 0;`;
    case "neon":
      return `background: ${L.surface}; border: 1px solid ${L.p.primary}66; box-shadow: 0 0 28px -8px ${L.p.primary}88; border-radius: ${r};`;
    case "editorial":
      return `background: transparent; border-left: 1px solid ${L.p.line}; border-radius: 0;`;
    case "retro":
      return `background: ${L.p.soft}; border: 2px solid ${L.p.ink}; box-shadow: 5px 5px 0 ${L.p.primary}; border-radius: ${r};`;
  }
}

/** Kartu (Kolom) bergaya bentuk tema. */
export function card(L: LookD, kids: (ElementNode | BoxNode)[], o: { name?: string; gap?: number; tone?: "card" | "inv"; pad?: number; span?: number; rows?: number } = {}): BoxNode {
  const c = col(kids, { gap: o.gap ?? 10, name: o.name ?? "Kartu", align: "stretch" });
  c.padding = o.pad ?? (L.shape === "editorial" ? 0 : 26);
  addCss(c, shapeCss(L, o.tone));
  if (L.shape === "editorial" && o.tone !== "inv") addCss(c, "padding-left: 22px;");
  if (o.span) addCss(c, `grid-column: span ${o.span};`);
  if (o.rows) addCss(c, `grid-row: span ${o.rows};`);
  if (o.span || o.rows) addCss(c, "@media (max-width: 640px) { & { grid-column: auto; grid-row: auto; } }");
  return c;
}

/** Kotak ikon/teks kecil. */
export function glyph(L: LookD, g: string, o: { bg?: string; color?: string } = {}): ElementNode {
  const n = el("text", { text: g, tag: "p", fontSize: 22, fontWeight: 800, textColor: o.color ?? L.p.primaryDark, textAlign: "center", widthMode: "auto" }, "Ikon");
  const round = L.shape === "soft" || L.shape === "glass" ? "999px" : L.shape === "brutal" || L.shape === "sharp" ? "0" : `${Math.max(6, L.radius - 6)}px`;
  n.advanced = { customCss: `display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: ${round}; background: ${o.bg ?? L.p.soft};${L.shape === "brutal" ? ` border: 2px solid ${L.p.ink};` : ""}` };
  return n;
}

export interface Intro {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  light?: boolean;
}

/** Elemen intro tanpa pembungkus (untuk ditaruh di dalam Kolom). */
export function introEls(L: LookD, c: Intro): ElementNode[] {
  const align = c.align ?? "left";
  const ink = c.light ? "#ffffff" : L.p.ink;
  return [
    ...(c.eyebrow ? [eyebrow(c.eyebrow, c.light ? L.p.line : L.p.primary, align)] : []),
    T(L, c.title, "h2", { align, color: ink, size: 34 }),
    ...(c.text ? [P(L, c.text, { align, size: 17, color: c.light ? "#e2e8f0" : L.p.muted })] : []),
  ];
}

export function intro(L: LookD, c: Intro): BoxNode {
  const align = c.align ?? "left";
  const ink = c.light ? "#ffffff" : L.p.ink;
  const s = stack(
    [
      ...(c.eyebrow ? [eyebrow(c.eyebrow, c.light ? L.p.line : L.p.primary, align)] : []),
      T(L, c.title, "h2", { align, color: ink, size: 38 }),
      ...(c.text ? [P(L, c.text, { align, size: 17, color: c.light ? "#e2e8f0" : L.p.muted })] : []),
    ],
    { gap: 10, align: "stretch" },
  );
  return fxBlock(L, s);
}

const img = (L: LookD, src: string, alt: string, ratio = "4 / 3", radius?: number) => {
  const i = image(src, alt, { ratio, radius: radius ?? (L.shape === "brutal" || L.shape === "sharp" || L.shape === "editorial" ? 0 : L.radius) });
  if (L.shape === "brutal") addCss(i, `border: 3px solid ${L.p.ink};`);
  if (L.shape === "retro") addCss(i, `border: 2px solid ${L.p.ink}; box-shadow: 6px 6px 0 ${L.p.primary};`);
  return i;
};
export { img as picture };

const sec = (name: string, rows: BoxNode[], o: Parameters<typeof section>[2]) => section(name, rows, o);

/* ------------------------------ header ----------------------------- */

/** Ukuran (vw) kata raksasa di footer agar satu baris pas selebar layar. */
const giantVw = (text: string) => Math.round((86 / (0.62 * Math.max(4, text.length))) * 10) / 10;

function menuD(L: LookD, color?: string, align: "start" | "center" | "end" = "end"): ElementNode {
  return el("menu", { siteId: "", pageIds: [], textColor: color ?? L.p.ink, hoverColor: L.p.primary, activeColor: L.p.primary, gap: 22, align, stackOnMobile: false, fontWeight: 600 }, "Menu");
}

function logoD(L: LookD, text: string, color?: string, size = 22): ElementNode {
  const n = heading(text, "h4", { size, color: color ?? L.p.ink, full: false, transform: L.upper ? "uppercase" : "none" });
  addCss(n, `font-family: ${L.headFont};`);
  return n;
}

/** Mega menu (Premium). */
export const megaD = (L: LookD, items: string[], cta: string, ctaHref: string) =>
  el("mega-menu", { items, ctaText: cta, ctaHref, hoverColor: L.p.primary, ctaBg: L.p.primary, textColor: L.p.ink, panelBg: L.surface }, "Mega Menu");

/**
 * Header: bar (logo kiri, menu kanan), pill (navigasi mengambang membulat),
 * center (logo tengah di atas menu), split (bilah info + garis tebal), ink (latar kontras).
 */
export function headerD(brand: string, L: LookD, c: { variant: "bar" | "pill" | "center" | "split" | "ink"; cta?: Act; nav?: ElementNode; info?: string[]; sticky?: boolean }): BoxNode {
  const inkBg = c.variant === "ink";
  const ink = inkBg ? "#ffffff" : L.p.ink;
  const nav = c.nav ?? menuD(L, inkBg ? "#e2e8f0" : L.p.ink, c.variant === "center" ? "center" : "end");
  // Mega menu di header berlatar gelap: teks menu harus terang agar terbaca.
  if (c.nav && inkBg && c.nav.state && "textColor" in c.nav.state) c.nav.state = { ...c.nav.state, textColor: "#e2e8f0", panelBg: L.inv };
  const ctaEl = c.cta ? acts(L, [c.cta]) : null;
  // Tombol header selebar isinya, agar tetap sebaris dengan menu (tidak turun ke bawah).
  if (ctaEl) ctaEl.widthMode = "auto";
  const rows: BoxNode[] = [];
  if (c.info) {
    const bar = createRow({ name: "Row Info", padding: 0, layout: "row", align: "center", justify: "between", wrap: true, gap: 12, stackOnMobile: false, children: c.info.map((t) => para(t, { size: 13, weight: 600, color: inkBg ? "#cbd5e1" : L.p.muted, full: false })) });
    bar.advanced = { customCss: `padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid ${inkBg ? "#ffffff26" : L.p.line};` };
    rows.push(bar);
  }
  if (c.variant === "center") {
    rows.push(createRow({ name: "Row Header", padding: 0, align: "center", gap: 10, children: [logoD(L, brand, ink, 28), nav, ...(ctaEl ? [ctaEl] : [])] }));
  } else {
    const row = createRow({ name: "Row Header", padding: 0, layout: "row", align: "center", justify: "between", wrap: false, gap: 16, stackOnMobile: false, children: [logoD(L, brand, ink), col([nav, ...(ctaEl ? [ctaEl] : [])], { layout: "row", gap: 16, name: "Navigasi", stackOnMobile: false, wrap: false })] });
    if (c.variant === "pill") {
      row.padding = 14;
      row.advanced = { customCss: `background: ${L.surface}${L.shape === "glass" ? "cc" : ""}; border: 1px solid ${L.p.line}; border-radius: 999px; padding-left: 26px; padding-right: 18px; box-shadow: 0 10px 30px -20px ${L.p.ink}55;${L.shape === "glass" ? " backdrop-filter: blur(12px);" : ""}` };
    }
    rows.push(row);
  }
  const s = section("Header", rows, { bg: inkBg ? L.inv : c.variant === "pill" ? L.alt : L.bg, padY: c.variant === "pill" ? 14 : 18, tag: "header" });
  const css: string[] = [];
  if (c.variant === "split" || L.shape === "brutal") css.push(`border-bottom: ${L.shape === "brutal" ? 3 : 1}px solid ${L.p.ink};`);
  if (c.sticky) css.push("position: sticky; top: 0; z-index: 40;");
  if (css.length) s.advanced = { customCss: css.join(" ") };
  return s;
}

/* ------------------------------ footer ----------------------------- */

const listEl = (items: string[], color: string) =>
  el("list", { items, listStyleType: "none", bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, textColor: color, dividerEnabled: false, itemHoverEnabled: false, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemPaddingX: 0, itemPaddingY: 4 }, "Daftar");

const socials = (L: LookD, links: string[], o: { light?: boolean } = {}) =>
  el("social-links", { links, shape: L.shape === "brutal" || L.shape === "sharp" ? "square" : "circle", size: 38, gap: 10, bgColor: o.light ? "#ffffff1a" : L.p.soft, iconColor: o.light ? "#ffffff" : L.p.primaryDark, hoverBg: L.p.primary, hoverColor: "#ffffff", brandColors: false, align: "left" }, "Tautan Sosial");

/** Kembali ke atas (Premium). */
export const backTop = (L: LookD, label: string) => el("back-to-top", { label, bgColor: L.p.primary, iconColor: "#ffffff", hoverBg: L.p.primaryDark }, "Kembali ke Atas");

/**
 * Footer: giant (nama merek raksasa), columns (kolom tautan), slim (satu baris).
 * `extra` = elemen tambahan (mis. tombol Kembali ke Atas).
 */
export function footerD(brand: string, L: LookD, c: { variant: "giant" | "columns" | "slim"; about: string; cols?: { title: string; items: string[] }[]; copy: string; social?: string[]; extra?: ElementNode[]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.inv;
  const soc = c.social ? [socials(L, c.social, { light: true })] : [];
  const extra = c.extra ?? [];
  if (c.variant === "slim")
    return sec(
      "Footer",
      [grid([col([logoD(L, brand, "#ffffff", 20), para(c.about, { size: 14, color: "#cbd5e1" })], { gap: 6, name: "Merek" }), col([...soc, para(c.copy, { size: 13, color: "#94a3b8" }), ...extra], { gap: 10, name: "Info", align: "end" })], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 24, align: "center" })],
      { bg, padY: 40, tag: "footer" },
    );
  const cols = (c.cols ?? []).map((x) => col([para(x.title, { color: "#ffffff", weight: 700, size: 14, transform: "uppercase", spacing: 1 }), listEl(x.items, "#cbd5e1")], { gap: 8, name: x.title }));
  const top = grid([col([logoD(L, brand, "#ffffff"), para(c.about, { color: "#cbd5e1", size: 14 }), ...soc], { gap: 12, name: "Merek" }), ...cols], `minmax(0, 1.5fr) ${cols.map(() => "minmax(0, 1fr)").join(" ")}`, { gap: 32 });
  const rows = [top];
  if (c.variant === "giant") {
    const big = heading(brand, "h2", { size: 120, color: "#ffffff", weight: 800, spacing: -3, transform: L.upper ? "uppercase" : "none" });
    // Selebar layar: ukuran mengikuti panjang nama agar tidak terpotong di HP.
    addCss(big, `font-family: ${L.headFont}; opacity: 0.14; line-height: 0.9; white-space: nowrap; overflow: hidden; font-size: min(120px, ${giantVw(brand)}vw);`);
    rows.push(stack([big], { gap: 0, align: "stretch" }));
  }
  rows.push(stack([para(c.copy, { size: 13, color: "#94a3b8" }), ...extra], { gap: 8 }));
  return sec("Footer", rows, { bg, padY: 56, tag: "footer" });
}

/* ------------------------------ hero ------------------------------- */

export interface HeroC {
  eyebrow?: string;
  title: string;
  text: string;
  actions?: Act[];
  image?: string;
  alt?: string;
  /** Ganti judul teks (mis. Teks Mengetik Premium). */
  titleNode?: ElementNode;
  size?: number;
}

const heroTitle = (L: LookD, c: HeroC, o: Parameters<typeof heading>[2] = {}) => fxHero(L, c.titleNode ?? T(L, c.title, "h1", { size: c.size ?? 58, ...o }));

/** Typewriter (Premium) untuk judul hero. */
export const typerD = (L: LookD, prefix: string, words: string[], o: { size?: number; color?: string; align?: "left" | "center" } = {}) => {
  const n = el("typewriter", { prefix, words, tag: "h1", fontSize: o.size ?? 54, textColor: o.color ?? L.p.ink, wordColor: L.p.primary, align: o.align ?? "left" }, "Teks Mengetik");
  addCss(n, `font-family: ${L.headFont};`);
  return n;
};

/** Hero Bento: teks besar di petak utama, gambar & angka di petak samping. */
export function heroBento(L: LookD, c: HeroC & { tiles: [string, string][] }): BoxNode {
  const main = card(L, [...(c.eyebrow ? [badge(c.eyebrow, L.p.soft, L.p.primaryDark, L.p.line)] : []), heroTitle(L, c, { size: c.size ?? 52 }), P(L, c.text, { size: 18 }), ...(c.actions ? [acts(L, c.actions)] : [])], { name: "Petak utama", gap: 18, pad: 40, span: 2, rows: 2 });
  const tiles = c.tiles.map(([n, l], i) => fxCard(L, card(L, [T(L, n, "h2", { size: 40, color: i % 2 ? L.p.ink : "#ffffff" }), P(L, l, { size: 14, color: i % 2 ? L.p.muted : "#e2e8f0" })], { name: "Petak angka", gap: 4, pad: 24 }), i + 1));
  tiles.forEach((t, i) => {
    if (i % 2 === 0) addCss(t, `background: ${L.p.primary}; border-color: ${L.p.primary};`);
  });
  const pic = c.image ? [fxImg(L, card(L, [img(L, c.image, c.alt ?? c.title, "4 / 3", Math.max(0, L.radius - 8))], { name: "Petak gambar", pad: 10, span: 1, rows: 2 }))] : [];
  const g = grid([main, ...pic, ...tiles], "repeat(3, minmax(0, 1fr))", { gap: 18, align: "stretch" });
  return sec("Hero Bento", [g], { bg: L.alt, padY: 64 });
}

/** Hero Editorial: kicker + judul raksasa selebar halaman, garis, lalu gambar lebar & kolom teks. */
export function heroEditorial(L: LookD, c: HeroC & { meta: string[] }): BoxNode {
  const metaRow = inline(c.meta.map((m) => para(m, { size: 13, weight: 700, color: L.p.muted, transform: "uppercase", spacing: 2, full: false })), { gap: 28, justify: "between" });
  addCss(metaRow, `border-top: 1px solid ${L.p.ink}; border-bottom: 1px solid ${L.p.ink}; padding: 10px 0;`);
  return sec(
    "Hero Editorial",
    [
      stack([metaRow, ...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), heroTitle(L, c, { size: c.size ?? 84, weight: 600, spacing: -2 })], { gap: 18, align: "stretch" }),
      grid([fxImg(L, col([img(L, c.image ?? "", c.alt ?? c.title, "16 / 9")], { name: "Gambar" })), fxBlock(L, col([P(L, c.text, { size: 19, color: L.p.ink }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 18, name: "Teks" }))], "minmax(0, 1.7fr) minmax(0, 1fr)", { gap: 40, align: "end" }),
    ],
    { bg: L.bg, padY: 56 },
  );
}

/** Hero Brutal: blok berbingkai tebal, stiker miring, gambar berbayang offset. */
export function heroBrutal(L: LookD, c: HeroC & { sticker: string }): BoxNode {
  const st = badge(c.sticker, L.p.primary, "#ffffff", L.p.ink);
  addCss(st, `transform: rotate(-4deg); border: 2px solid ${L.p.ink}; font-weight: 800; font-size: 14px;`);
  const text = col([st, heroTitle(L, c, { size: c.size ?? 64, weight: 800, spacing: -2 }), P(L, c.text, { size: 18, color: L.p.ink }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 20, name: "Teks hero" });
  const pic = fxImg(L, col([img(L, c.image ?? "", c.alt ?? c.title, "1 / 1")], { name: "Gambar" }));
  addCss(pic, `box-shadow: 12px 12px 0 ${L.p.primary};`);
  return sec("Hero Brutal", [grid([text, pic], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 48, align: "center" })], { bg: L.alt, padY: 80 });
}

/** Hero Kaca: latar gradien, kartu kaca transparan berisi teks, gambar melayang. */
export function heroGlass(L: LookD, c: HeroC & { gradient: [string, string]; chips?: string[] }): BoxNode {
  const glass = col(
    [...(c.eyebrow ? [eyebrow(c.eyebrow, "#ffffff")] : []), heroTitle(L, c, { size: c.size ?? 54, color: "#ffffff" }), P(L, c.text, { size: 18, color: "#f1f5f9" }), ...(c.chips ? [inline(c.chips.map((x) => badge(x, "#ffffff26", "#ffffff", "#ffffff55")), { gap: 8 })] : []), ...(c.actions ? [acts(L, c.actions)] : [])],
    { gap: 18, name: "Kartu kaca" },
  );
  glass.padding = 36;
  addCss(glass, `background: #ffffff1f; border: 1px solid #ffffff4d; border-radius: ${L.radius + 8}px; backdrop-filter: blur(16px); box-shadow: 0 30px 60px -30px #0f172a99;`);
  const pic = c.image ? [fxImg(L, col([img(L, c.image, c.alt ?? c.title, "4 / 5", L.radius + 8)], { name: "Gambar" }))] : [];
  return sec("Hero Kaca", [grid([glass, ...pic], pic.length ? "minmax(0, 1.2fr) minmax(0, 1fr)" : 1, { gap: 40, align: "center" })], { gradient: [c.gradient[0], c.gradient[1], 135], padY: 104 });
}

/** Hero Tipografi: judul raksasa rata kiri + pita kata berjalan. */
export function heroType(L: LookD, c: HeroC & { words: string[] }): BoxNode {
  return sec(
    "Hero Tipografi",
    [
      stack([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), heroTitle(L, c, { size: c.size ?? 104, weight: 800, spacing: -4 })], { gap: 14, align: "stretch" }),
      grid([fxBlock(L, col([P(L, c.text, { size: 19 })], { name: "Teks" })), col([...(c.actions ? [acts(L, c.actions)] : [])], { name: "Aksi", align: "end" })], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 32, align: "center" }),
      ...(c.image ? [stack([fxImg(L, img(L, c.image, c.alt ?? c.title, "21 / 9"))], { align: "stretch" })] : []),
      ribbon(L, c.words),
    ],
    { bg: L.bg, padY: 72 },
  );
}

/** Hero Neon: latar gelap, judul bercahaya rata tengah, gambar berpendar. */
export function heroNeon(L: LookD, c: HeroC & { chips?: string[] }): BoxNode {
  const pic = c.image ? fxImg(L, img(L, c.image, c.alt ?? c.title, "16 / 9", L.radius)) : null;
  if (pic) addCss(pic, `box-shadow: 0 0 60px -10px ${L.p.primary};`);
  return sec(
    "Hero Neon",
    [
      stack(
        [...(c.eyebrow ? [badge(c.eyebrow, `${L.p.primary}22`, L.p.primary, L.p.primary)] : []), heroTitle(L, c, { size: c.size ?? 64, align: "center" }), P(L, c.text, { size: 18, align: "center" }), ...(c.chips ? [inline(c.chips.map((x) => badge(x, "transparent", L.p.line, `${L.p.primary}88`)), { gap: 8, justify: "center" })] : []), ...(c.actions ? [acts(L, c.actions, "center")] : [])],
        { gap: 18, align: "center" },
      ),
      ...(pic ? [stack([pic], { align: "stretch" })] : []),
    ],
    { gradient: [L.bg, L.alt, 180], padY: 104, width: 1040 },
  );
}

/** Hero Layar Terbagi: panel warna penuh di kiri, gambar di kanan, daftar singkat. */
export function heroSplitScreen(L: LookD, c: HeroC & { list?: string[]; reverse?: boolean }): BoxNode {
  const panel = col(
    [...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.line)] : []), heroTitle(L, c, { size: c.size ?? 50, color: "#ffffff" }), P(L, c.text, { size: 18, color: "#f1f5f9" }), ...(c.list ? [listEl(c.list.map((x) => `→ ${x}`), "#ffffff")] : []), ...(c.actions ? [acts(L, c.actions)] : [])],
    { gap: 18, name: "Panel" },
  );
  panel.padding = 48;
  addCss(panel, `background: ${L.p.primaryDark}; border-radius: ${L.shape === "sharp" ? 0 : L.radius}px; min-height: 100%;`);
  addCss(panel, "@media (max-width: 640px) { & { padding: 28px; } }");
  const pic = fxImg(L, col([img(L, c.image ?? "", c.alt ?? c.title, "4 / 5")], { name: "Gambar" }));
  return sec("Hero Layar Terbagi", [grid(c.reverse ? [pic, panel] : [panel, pic], 2, { gap: 0, align: "stretch" })], { bg: L.bg, padY: 40, width: 1240 });
}

/** Hero Poster: gaya retro, judul tebal di tengah, lingkaran gambar, tanggal di pita. */
export function heroPoster(L: LookD, c: HeroC & { date?: string }): BoxNode {
  const pic = fxImg(L, img(L, c.image ?? "", c.alt ?? c.title, "1 / 1", 999));
  addCss(pic, `max-width: 360px; margin: 0 auto; border: 4px solid ${L.p.ink}; box-shadow: 10px 10px 0 ${L.p.primary};`);
  const kids: (ElementNode | BoxNode)[] = [...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primaryDark, "center")] : []), heroTitle(L, c, { size: c.size ?? 72, align: "center", weight: 800 })];
  if (c.date) {
    const d = para(c.date, { size: 16, weight: 800, color: "#ffffff", align: "center", transform: "uppercase", spacing: 3 });
    addCss(d, `background: ${L.p.ink}; padding: 10px 18px; border-radius: 999px; display: inline-block;`);
    kids.push(d);
  }
  kids.push(P(L, c.text, { size: 18, align: "center", color: L.p.ink }));
  if (c.actions) kids.push(acts(L, c.actions, "center"));
  return sec("Hero Poster", [stack([pic], { align: "stretch" }), stack(kids, { gap: 16, align: "center" })], { bg: L.p.soft, padY: 80, width: 900 });
}

/** Hero Lembut: blob pastel, teks + gambar membulat, chip fitur. */
export function heroSoft(L: LookD, c: HeroC & { chips?: string[] }): BoxNode {
  const pic = fxImg(L, col([img(L, c.image ?? "", c.alt ?? c.title, "1 / 1", 999)], { name: "Gambar" }));
  addCss(pic, `padding: 18px; background: ${L.p.soft}; border-radius: 999px;`);
  const text = col([...(c.eyebrow ? [badge(c.eyebrow, L.surface, L.p.primaryDark, L.p.line)] : []), heroTitle(L, c, { size: c.size ?? 56 }), P(L, c.text, { size: 18 }), ...(c.chips ? [inline(c.chips.map((x) => badge(x, L.surface, L.p.ink, L.p.line)), { gap: 8 })] : []), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 18, name: "Teks hero" });
  return sec("Hero Lembut", [grid([text, pic], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 56, align: "center" })], { gradient: [L.alt, L.bg, 160], padY: 96 });
}

/** Hero Kolase: tiga gambar bertumpuk asimetris + teks. */
export function heroCollage(L: LookD, c: HeroC & { images: [string, string][] }): BoxNode {
  const [a, b, d] = c.images;
  const big = fxImg(L, card(L, [img(L, a[0], a[1], "3 / 4")], { name: "Foto besar", pad: 0 }));
  const smalls = col([fxImg(L, img(L, b[0], b[1], "1 / 1")), fxImg(L, img(L, d[0], d[1], "1 / 1"))], { gap: 14, name: "Foto kecil", align: "stretch" });
  const text = col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), heroTitle(L, c, { size: c.size ?? 56 }), P(L, c.text, { size: 18 }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 18, name: "Teks hero" });
  return sec("Hero Kolase", [grid([text, big, smalls], "minmax(0, 1fr) minmax(0, 0.7fr) minmax(0, 0.45fr)", { gap: 48, align: "center" })], { bg: L.bg, padY: 88 });
}

/** Hero Pencarian: judul + kotak cari (input + select + tombol) + tag populer. */
export function heroSearch(L: LookD, c: HeroC & { fields: Field[]; submit: string; tags: string[] }): BoxNode {
  const form = card(L, [...c.fields.map((f, i) => field(lookA(L), f, i)), button(c.submit, L.p, { full: true, type: "submit" })], { name: "Kotak cari", pad: 22, gap: 12 });
  return sec(
    "Hero Pencarian",
    [
      stack([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary, "center")] : []), heroTitle(L, c, { size: c.size ?? 60, align: "center" }), P(L, c.text, { size: 18, align: "center" })], { gap: 14, align: "center" }),
      stack([fxBlock(L, form)], { align: "stretch" }),
      stack([inline(c.tags.map((t) => badge(t, L.surface, L.p.ink, L.p.ink)), { gap: 8, justify: "center" })], { align: "center" }),
    ],
    { bg: L.alt, padY: 88, width: 1040 },
  );
}

/** Hero Minimal: teks kecil rata tengah, gambar lebar berbingkai tipis. */
export function heroMinimal(L: LookD, c: HeroC & { note?: string }): BoxNode {
  return sec(
    "Hero Minimal",
    [
      stack([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary, "center")] : []), heroTitle(L, c, { size: c.size ?? 46, align: "center", weight: 600 }), P(L, c.text, { size: 17, align: "center" }), ...(c.actions ? [acts(L, c.actions, "center")] : []), ...(c.note ? [P(L, c.note, { size: 13, align: "center" })] : [])], { gap: 16, align: "center" }),
      ...(c.image ? [stack([fxImg(L, card(L, [img(L, c.image, c.alt ?? c.title, "16 / 7", 0)], { name: "Bingkai", pad: 8 }))], { align: "stretch" })] : []),
    ],
    { bg: L.bg, padY: 88, width: 1000 },
  );
}

/** Adaptor Look kitA untuk elemen form (radius & warna fokus). */
function lookA(L: LookD) {
  return { p: L.p, bg: L.bg, alt: L.alt, dark: L.inv, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.radius, font: L.font, page: L.bg, headFont: L.headFont };
}

/* ---------------------------- konten ------------------------------- */

/** Kepala halaman dalam (gaya mengikuti bentuk tema). */
export function pageHead(L: LookD, c: { eyebrow?: string; title: string; text?: string; crumbs?: [string, string][]; name?: string }): BoxNode {
  const kids: (ElementNode | BoxNode)[] = [];
  if (c.crumbs) kids.push(el("breadcrumbs", { items: c.crumbs.map(([label, href]) => ({ label, href })), bgColor: "transparent", borderWidth: 0, paddingLeft: 0, paddingRight: 0, paddingTop: 0, paddingBottom: 0, textColor: L.p.muted, currentColor: L.p.ink, linkHoverColor: L.p.primary }, "Breadcrumbs"));
  if (c.eyebrow) kids.push(eyebrow(c.eyebrow, L.p.primary));
  kids.push(fxHero(L, T(L, c.title, "h1", { size: L.shape === "editorial" ? 64 : 50, weight: L.shape === "editorial" ? 600 : 800 })));
  if (c.text) kids.push(P(L, c.text, { size: 18 }));
  const s = sec(c.name ?? "Kepala Halaman", [stack(kids, { gap: 12, align: "stretch" })], L.shape === "glass" ? { gradient: [L.p.soft, L.bg, 160], padY: 72 } : { bg: L.alt, padY: 72 });
  if (L.shape === "brutal" || L.shape === "editorial") s.advanced = { customCss: `border-bottom: ${L.shape === "brutal" ? 3 : 1}px solid ${L.p.ink};` };
  return s;
}

export interface Item {
  icon?: string;
  title: string;
  text: string;
  meta?: string;
}

/** Bento: petak berukuran beda (wide = 2 kolom, tall = 2 baris, image opsional). */
export function bento(L: LookD, c: Intro & { items: (Item & { wide?: boolean; tall?: boolean; image?: string; accent?: boolean })[]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map((it, i) => {
    const light = !!it.accent;
    const kids = [
      ...(it.image ? [img(L, it.image, it.title, it.tall ? "4 / 5" : "16 / 9", Math.max(0, L.radius - 8))] : []),
      ...(it.icon ? [glyph(L, it.icon, light ? { bg: "#ffffff26", color: "#ffffff" } : {})] : []),
      T(L, it.title, "h3", { size: 21, color: light ? "#ffffff" : L.p.ink }),
      P(L, it.text, { size: 15, color: light ? "#e2e8f0" : L.p.muted }),
      ...(it.meta ? [para(it.meta, { size: 13, weight: 700, color: light ? "#ffffff" : L.p.primary })] : []),
    ];
    const box = card(L, kids, { name: "Petak", span: it.wide ? 2 : undefined, rows: it.tall ? 2 : undefined });
    if (light) addCss(box, `background: ${L.p.primaryDark}; border-color: ${L.p.primaryDark};`);
    return fxCard(L, box, i);
  });
  return sec(c.name ?? "Bento", [intro(L, c), grid(cells, "repeat(3, minmax(0, 1fr))", { gap: 18, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Pita kata: deretan kata besar dipisah bintang (teks biasa, berjalan dengan CSS). */
function ribbon(L: LookD, words: string[], o: { bg?: string; color?: string } = {}): BoxNode {
  const line = words.concat(words).join("  ✦  ");
  const t = heading(line, "h3", { size: 30, color: o.color ?? "#ffffff", weight: 800, transform: "uppercase" });
  addCss(t, `font-family: ${L.headFont}; white-space: nowrap; overflow: hidden; text-overflow: clip;`);
  const box = createRow({ name: "Pita", padding: 18, gap: 0, align: "stretch", children: [t] });
  box.advanced = { customCss: `background: ${o.bg ?? L.p.primary}; overflow: hidden;${L.shape === "brutal" ? ` border: 3px solid ${L.p.ink};` : ""}${L.shape === "retro" ? " transform: rotate(-1.5deg);" : ""}` };
  return box;
}

/** Section berisi pita kata saja. */
export const wordBand = (L: LookD, words: string[], o: { bg?: string; color?: string; name?: string } = {}) => sec(o.name ?? "Pita Kata", [ribbon(L, words, o)], { bg: L.bg, padY: 24, width: 1400 });

/** Kolom editorial: nomor besar, judul, teks, dipisah garis tipis. */
export function editorial(L: LookD, c: Intro & { cols: [string, string][]; name?: string; bg?: string }): BoxNode {
  const cells = c.cols.map(([t, x], i) => {
    const b = col([para(String(i + 1).padStart(2, "0"), { size: 15, weight: 800, color: L.p.primary, spacing: 2 }), T(L, t, "h3", { size: 24, weight: 600 }), P(L, x, { size: 16 })], { gap: 10, name: "Kolom" });
    addCss(b, `border-top: 1px solid ${L.p.ink}; padding-top: 18px;`);
    return fxCard(L, b, i);
  });
  return sec(c.name ?? "Kolom Editorial", [intro(L, c), grid(cells, Math.min(4, cells.length), { gap: 32 })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Panel terbagi: gambar satu sisi, teks + poin di sisi lain. */
export function splitPanel(L: LookD, c: { eyebrow?: string; title: string; text: string; bullets?: string[]; image: string; alt: string; reverse?: boolean; actions?: Act[]; name?: string; bg?: string; ratio?: string }): BoxNode {
  const txt = fxBlock(L, col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), T(L, c.title, "h2", { size: 36 }), P(L, c.text, { size: 17 }), ...(c.bullets ? [listEl(c.bullets.map((b) => `✓ ${b}`), L.p.ink)] : []), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 14, name: "Teks" }));
  const pic = fxImg(L, col([img(L, c.image, c.alt, c.ratio ?? "5 / 4")], { name: "Gambar" }));
  return sec(c.name ?? "Panel Terbagi", [grid(c.reverse ? [txt, pic] : [pic, txt], 2, { gap: 56, align: "center" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Kartu fitur/layanan bergaya bentuk tema. */
export function cardsD(L: LookD, c: Intro & { items: Item[]; cols?: number; name?: string; bg?: string; inv?: boolean }): BoxNode {
  const inv = !!c.inv;
  const cells = c.items.map((it, i) =>
    fxCard(
      L,
      card(L, [...(it.icon ? [glyph(L, it.icon, inv ? { bg: "#ffffff1a", color: "#ffffff" } : {})] : []), T(L, it.title, "h3", { size: 20, color: inv ? "#ffffff" : L.p.ink }), P(L, it.text, { size: 15, color: inv ? "#cbd5e1" : L.p.muted }), ...(it.meta ? [para(it.meta, { size: 13, weight: 700, color: inv ? L.p.line : L.p.primaryDark })] : [])], { tone: inv ? "inv" : "card" }),
      i,
    ),
  );
  return sec(c.name ?? "Kartu", [intro(L, { ...c, light: inv }), grid(cells, c.cols ?? Math.min(3, cells.length), { gap: 22, align: "stretch" })], { bg: c.bg ?? (inv ? L.inv : L.bg), padY: 88 });
}

/** Deret angka (teks biasa) dengan garis pemisah. */
export function numbers(L: LookD, c: { items: [string, string][]; name?: string; inv?: boolean }): BoxNode {
  const inv = !!c.inv;
  const cells = c.items.map(([n, l], i) => {
    const b = col([T(L, n, "h2", { size: 46, color: inv ? "#ffffff" : L.p.primaryDark }), para(l, { size: 14, color: inv ? "#cbd5e1" : L.p.muted })], { gap: 2, name: "Angka" });
    if (i > 0) addCss(b, `border-left: 1px solid ${inv ? "#ffffff33" : L.p.line}; padding-left: 20px;`);
    return fxCard(L, b, i);
  });
  return sec(c.name ?? "Deret Angka", [grid(cells, cells.length, { gap: 20 })], { bg: inv ? L.inv : L.alt, padY: 56 });
}

/** Statistik Animasi (Premium). Item "angka | label". */
export function counterD(L: LookD, c: Partial<Intro> & { items: string[]; name?: string; inv?: boolean }): BoxNode {
  const inv = !!c.inv;
  const e = fxBlock(L, el("stats-counter", { items: c.items, columns: Math.min(4, c.items.length), numberColor: inv ? "#ffffff" : L.p.ink, labelColor: inv ? "#cbd5e1" : L.p.muted, accentColor: L.p.primary }, "Statistik Animasi"));
  return sec(c.name ?? "Statistik Animasi", [...(c.title ? [intro(L, { ...(c as Intro), light: inv })] : []), stack([e], { align: "stretch" })], { bg: inv ? L.inv : L.bg, padY: 72 });
}

/** Langkah zigzag: tiap langkah satu baris, sisi bergantian. */
export function zigzag(L: LookD, c: Intro & { steps: [string, string, string?][]; name?: string; bg?: string }): BoxNode {
  const rows = c.steps.map(([t, x, pic], i) => {
    const num = T(L, String(i + 1).padStart(2, "0"), "h2", { size: 64, color: L.p.primary, weight: 800 });
    const txt = col([T(L, t, "h3", { size: 24 }), P(L, x, { size: 16 })], { gap: 8, name: "Teks langkah" });
    const side = pic ? fxImg(L, col([img(L, pic, t, "16 / 10")], { name: "Gambar" })) : col([num], { name: "Nomor", align: i % 2 ? "start" : "end" });
    const left = col([...(pic ? [num] : []), txt], { gap: 8, name: "Langkah" });
    const r = grid(i % 2 ? [side, left] : [left, side], 2, { gap: 40, align: "center" });
    return fxBlock(L, r);
  });
  rows.forEach((r, i) => {
    if (i < rows.length - 1) r.advanced = { ...r.advanced, customCss: `margin-bottom: 36px; padding-bottom: 36px; border-bottom: 1px dashed ${L.p.line};` };
  });
  return sec(c.name ?? "Langkah", [intro(L, c), ...rows], { bg: c.bg ?? L.bg, padY: 88, width: 1000 });
}

/** Indeks: baris daftar bergaya katalog (judul, meta, tag, tautan). */
export function indexList(L: LookD, c: Intro & { rows: { title: string; meta: string; text?: string; tag?: string; href?: string; cta?: string }[]; name?: string; bg?: string }): BoxNode {
  const rows = c.rows.map((r, i) => {
    const g = grid(
      [
        col([T(L, r.title, "h3", { size: 22 }), ...(r.text ? [P(L, r.text, { size: 15 })] : [])], { gap: 4, name: "Judul" }),
        col([para(r.meta, { size: 14, weight: 600, color: L.p.muted }), ...(r.tag ? [badge(r.tag, L.p.soft, L.p.primaryDark, L.p.line)] : [])], { gap: 6, name: "Meta" }),
        col(r.href ? [el("anchor", { text: `${r.cta ?? "→"}`, href: r.href, underline: "hover", fontSize: 15, fontWeight: 700, textColor: L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan")] : [], { name: "Aksi", align: "end" }),
      ],
      "minmax(0, 1.6fr) minmax(0, 1fr) minmax(0, 0.6fr)",
      { gap: 20, align: "center" },
    );
    g.advanced = { customCss: `border-top: 1px solid ${L.p.line}; padding: 20px 0;${i === c.rows.length - 1 ? ` border-bottom: 1px solid ${L.p.line};` : ""}` };
    return fxBlock(L, g);
  });
  return sec(c.name ?? "Indeks", [intro(L, c), ...rows], { bg: c.bg ?? L.bg, padY: 88, width: 1040 });
}

export interface PlanEl {
  plan: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  featured?: boolean;
  badge?: string;
}

/** Kartu harga (Premium Pricing). */
export function plansD(L: LookD, c: Intro & { items: PlanEl[]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map((x, i) => fxCard(L, col([el("pricing", { ...x, featured: !!x.featured, badge: x.badge ?? "", accentColor: L.p.primary, textColor: L.p.ink, bgColor: L.surface, radius: L.radius }, "Harga")], { name: "Paket", align: "stretch" }), i));
  return sec(c.name ?? "Paket Harga", [intro(L, { ...c, align: c.align ?? "center" }), grid(cells, cells.length, { gap: 22, align: "stretch" })], { bg: c.bg ?? L.alt, padY: 88 });
}

/** Harga Bulanan/Tahunan (Premium). Plan: "Nama | bulanan | tahunan | fitur; fitur | CTA". */
export function priceSwitchD(L: LookD, c: Intro & { plans: string[]; labels: [string, string, string, string, string]; featured?: number; href: string; name?: string; bg?: string }): BoxNode {
  const [m, y, save, pm, py] = c.labels;
  return sec(
    c.name ?? "Harga Fleksibel",
    [intro(L, { ...c, align: c.align ?? "center" }), stack([fxBlock(L, el("pricing-switch", { monthlyLabel: m, yearlyLabel: y, saveBadge: save, periodMonthly: pm, periodYearly: py, plans: c.plans, featured: c.featured ?? 2, ctaHref: c.href, accentColor: L.p.primary, inkColor: L.p.ink, cardBg: L.surface, featuredBg: L.inv, radius: L.radius }, "Harga Bulanan/Tahunan"))], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Tabel perbandingan (Premium). Baris: "fitur | a | b | c". */
export function compareD(L: LookD, c: Intro & { columns: string[]; rows: string[]; highlight?: number; caption: string; name?: string; bg?: string }): BoxNode {
  return sec(
    c.name ?? "Perbandingan",
    [intro(L, c), stack([fxBlock(L, el("comparison-table", { columns: c.columns, rows: c.rows, highlight: c.highlight ?? 2, caption: c.caption, accentColor: L.p.primary, headerBg: L.alt, textColor: L.p.ink, radius: L.radius }, "Tabel Perbandingan"))], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88, width: 1000 },
  );
}

/** Kartu testimoni (Premium Testimonial). */
export function quotesD(L: LookD, c: Intro & { items: { quote: string; author: string; role: string; avatar: string; rating?: number }[]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map((q, i) => fxCard(L, col([el("testimonial", { quote: q.quote, author: q.author, role: q.role, avatar: q.avatar, rating: q.rating ?? 5, accentColor: L.p.primary, radius: L.radius, textColor: L.p.ink, bgColor: L.surface }, "Testimoni")], { name: "Testimoni", align: "stretch" }), i));
  return sec(c.name ?? "Testimoni", [intro(L, c), grid(cells, Math.min(3, cells.length), { gap: 22, align: "stretch" })], { bg: c.bg ?? L.alt, padY: 88 });
}

/** Kutipan besar dengan garis aksen (teks biasa). */
export function pullQuote(L: LookD, c: { text: string; name: string; role: string; name2?: string; inv?: boolean }): BoxNode {
  const inv = c.inv ?? true;
  const q = T(L, `“${c.text}”`, "h2", { size: 36, weight: 600, color: inv ? "#ffffff" : L.p.ink });
  addCss(q, `border-left: 6px solid ${L.p.primary}; padding-left: 28px;`);
  return sec(c.name2 ?? "Kutipan", [stack([fxBlock(L, q), para(`— ${c.name}, ${c.role}`, { size: 15, weight: 700, color: inv ? L.p.line : L.p.primaryDark })], { gap: 18, align: "stretch" })], { bg: inv ? L.inv : L.alt, padY: 96, width: 920 });
}

/** Tanya jawab dua kolom (dua akordeon gratis). */
export function faqD(L: LookD, c: Intro & { items: [string, string][]; name?: string; bg?: string }): BoxNode {
  const half = Math.ceil(c.items.length / 2);
  const acc = (items: [string, string][]) =>
    el("accordion", { items: items.map(([title, content]) => ({ title, content })), widthMode: "full", openTextColor: L.p.primaryDark, iconColor: L.p.primary, borderColor: L.shape === "brutal" ? L.p.ink : L.p.line, borderRadius: L.shape === "brutal" || L.shape === "sharp" ? 0 : Math.min(L.radius, 16), iconStyle: "plus", textColor: L.p.ink, headerBgColor: L.surface, headerHoverBgColor: L.p.soft, openHeaderBgColor: L.surface, contentColor: L.p.muted, contentBgColor: L.surface }, "FAQ");
  return sec(c.name ?? "Tanya Jawab", [intro(L, { ...c, align: c.align ?? "center" }), grid([col([fxBlock(L, acc(c.items.slice(0, half)))], { name: "Kolom 1", align: "stretch" }), col([fxBlock(L, acc(c.items.slice(half)))], { name: "Kolom 2", align: "stretch" })], 2, { gap: 18 })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Formulir + info (tanpa pengiriman ke server). */
export function formD(L: LookD, c: Intro & { info: [string, string][]; fields: Field[]; submit: string; note?: string; message?: string; name?: string; bg?: string; formFirst?: boolean }): BoxNode {
  const A = lookA(L);
  const info = fxBlock(
    L,
    col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), T(L, c.title, "h2", { size: 36 }), ...(c.text ? [P(L, c.text, { size: 17 })] : []), ...c.info.map(([k, v]) => col([para(k, { size: 12, weight: 700, color: L.p.primary, transform: "uppercase", spacing: 1 }), para(v, { size: 16, color: L.p.ink, weight: 600 })], { gap: 2, name: "Info" }))], { gap: 16, name: "Info kontak" }),
  );
  const kids: (ElementNode | BoxNode)[] = c.fields.map((f, i) => field(A, f, i));
  if (c.message) kids.push(el("textarea", { label: c.message, name: "pesan", placeholder: "", rows: 4, helper: "", labelColor: L.dark ? "#18181b" : L.p.ink, focusColor: L.p.primary, radius: A.radius, borderColor: L.p.line }, c.message));
  const btn = button(c.submit, L.p, { full: true, type: "submit" });
  btn.state = { ...btn.state, borderRadius: A.radius };
  kids.push(btn);
  if (c.note) kids.push(P(L, c.note, { size: 13, color: L.dark ? "#52525b" : L.p.muted }));
  const form = card(L, kids, { name: "Formulir", gap: 14, pad: 30 });
  // Tema gelap: kartu formulir terang agar label & isian (warna bawaan gelap) tetap terbaca.
  if (L.dark) addCss(form, "background: #fafafa;");
  if (L.shape === "editorial") addCss(form, `background: ${L.surface}; border: 1px solid ${L.p.line}; padding: 30px;`);
  return sec(c.name ?? "Formulir", [grid(c.formFirst ? [form, info] : [info, form], "minmax(0, 1fr) minmax(0, 1.15fr)", { gap: 48, align: "start" })], { bg: c.bg ?? L.alt, padY: 88 });
}

/** Buletin: satu baris ajakan + input email. */
export function newsletter(L: LookD, c: { title: string; text: string; ph: string; submit: string; name?: string; inv?: boolean }): BoxNode {
  const inv = c.inv ?? false;
  const A = lookA(L);
  const btn = button(c.submit, L.p, { type: "submit" });
  btn.state = { ...btn.state, borderRadius: A.radius };
  return sec(
    c.name ?? "Buletin",
    [grid([fxBlock(L, col([T(L, c.title, "h2", { size: 32, color: inv ? "#ffffff" : L.p.ink }), P(L, c.text, { color: inv ? "#cbd5e1" : L.p.muted })], { gap: 8, name: "Teks" })), col([el("input", { labelText: "Email", labelEnabled: false, text: c.ph, inputType: "email", borderRadius: A.radius, hoverBorderColor: L.p.primary }, "Email"), btn], { layout: "row", gap: 10, name: "Form", stackOnMobile: true })], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 32, align: "center" })],
    { bg: inv ? L.inv : L.p.soft, padY: 64 },
  );
}

/** Galeri Lightbox (Premium). */
export function galleryLb(L: LookD, c: Intro & { images: [string, string][]; cols?: number; ratio?: string; name?: string; bg?: string }): BoxNode {
  return sec(
    c.name ?? "Galeri Lightbox",
    [intro(L, c), stack([fxBlock(L, el("gallery-lightbox", { images: c.images.map(([s, cap]) => `${s} | ${cap}`), columns: c.cols ?? 3, gap: 14, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.radius, ratio: c.ratio ?? "4 / 3", showCaptions: true, overlayColor: L.inv, captionColor: "#ffffff" }, "Galeri Lightbox"))], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Galeri mozaik gratis: rasio gambar berbeda-beda. */
export function mosaic(L: LookD, c: Intro & { images: [string, string][]; name?: string; bg?: string }): BoxNode {
  const ratios = ["4 / 5", "1 / 1", "4 / 3", "1 / 1", "4 / 5", "16 / 10"];
  const cells = c.images.map(([s, cap], i) => fxImg(L, col([img(L, s, cap, ratios[i % ratios.length]), para(cap, { size: 13, color: L.p.muted, weight: 600 })], { gap: 6, name: "Foto" })));
  return sec(c.name ?? "Galeri Mozaik", [intro(L, c), grid(cells, 3, { gap: 16, align: "start" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Linimasa (elemen Timeline gratis). Item [tanggal, judul, teks]. */
export function timelineD(L: LookD, c: Intro & { items: [string, string, string][]; name?: string; bg?: string; side?: { image: string; alt: string } }): BoxNode {
  const t = fxBlock(L, el("timeline", { items: c.items.map((x) => x.join(" | ")), accentColor: L.p.primary, lineColor: L.p.line, dateColor: L.p.primaryDark, titleColor: L.p.ink, textColor: L.p.muted }, "Linimasa"));
  const body = c.side ? grid([col([t], { name: "Linimasa", align: "stretch" }), fxImg(L, col([img(L, c.side.image, c.side.alt, "4 / 5")], { name: "Gambar" }))], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 48, align: "center" }) : stack([t], { align: "stretch" });
  return sec(c.name ?? "Linimasa", [intro(L, c), body], { bg: c.bg ?? L.bg, padY: 88, width: c.side ? 1120 : 860 });
}

/** Sebelum/Sesudah (Premium). */
export function beforeAfterD(L: LookD, c: Intro & { before: string; after: string; labels: [string, string]; alt: string; name?: string; bg?: string }): BoxNode {
  return sec(
    c.name ?? "Sebelum Sesudah",
    [intro(L, { ...c, align: c.align ?? "center" }), stack([fxImg(L, el("before-after", { before: c.before, after: c.after, beforeLabel: c.labels[0], afterLabel: c.labels[1], alt: c.alt, radius: L.radius, handleColor: L.p.primary }, "Sebelum/Sesudah"))], { align: "stretch" })],
    { bg: c.bg ?? L.alt, padY: 88, width: 960 },
  );
}

/** Penawaran dengan Popup Modal (Premium). */
export function offer(L: LookD, c: { eyebrow?: string; title: string; text: string; trigger: string; modalTitle: string; body: string; cta: string; href: string; name?: string }): BoxNode {
  const m = el("modal-popup", { triggerText: c.trigger, title: c.modalTitle, body: c.body, ctaText: c.cta, ctaHref: c.href, triggerBg: L.p.primary, triggerColor: "#ffffff", panelBg: L.surface, textColor: L.p.ink, ctaBg: L.p.primary, ctaColor: "#ffffff", overlayColor: L.inv, radius: L.radius }, "Popup Modal");
  const box = card(L, [...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), T(L, c.title, "h2", { size: 34 }), P(L, c.text, { size: 17 }), m], { name: "Kotak penawaran", gap: 14, pad: 40 });
  return sec(c.name ?? "Penawaran", [stack([fxBlock(L, box)], { align: "stretch" })], { bg: L.bg, padY: 72, width: 860 });
}

/** Hitung mundur (Premium). */
export function countdownD(L: LookD, c: { eyebrow?: string; title: string; text: string; target: string; finished: string; actions?: Act[]; name?: string }): BoxNode {
  const cd = el("countdown", { title: "", target: c.target, finishedText: c.finished, boxColor: "#00000033", numberColor: "#ffffff", labelColor: L.p.line, titleColor: "#ffffff", radius: L.shape === "brutal" ? 0 : Math.min(L.radius, 16) }, "Countdown");
  return sec(
    c.name ?? "Hitung Mundur",
    [grid([fxBlock(L, col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.dark ? "#fde68a" : L.p.line)] : []), T(L, c.title, "h2", { color: "#ffffff", size: 38 }), P(L, c.text, { color: "#e2e8f0" }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 10, name: "Info" })), col([fxHero(L, cd)], { name: "Hitung mundur" })], 2, { gap: 40, align: "center" })],
    { gradient: [L.p.primaryDark, L.inv, 120], padY: 80 },
  );
}

/** Slider (Premium). */
export function sliderD(L: LookD, c: Partial<Intro> & { slides: { title: string; text: string; bg: string }[]; height?: number; name?: string; bg?: string }): BoxNode {
  return sec(c.name ?? "Slider", [...(c.title ? [intro(L, c as Intro)] : []), stack([fxBlock(L, el("slider", { slides: c.slides, height: c.height ?? 380, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.radius, interval: 6 }, "Slider"))], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 64 });
}

/** Bilah progres (Premium). */
export function progressD(L: LookD, c: Intro & { bars: [string, number][]; side?: { image: string; alt: string }; name?: string; bg?: string }): BoxNode {
  const bars = c.bars.map(([label, value]) => el("progress", { label, value, barColor: L.p.primary, trackColor: L.p.soft, textColor: L.p.ink, height: 12, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : 999 }, "Progres"));
  const left = fxBlock(L, col([...introEls(L, c), ...bars], { gap: 16, name: "Progres", align: "stretch" }));
  return sec(c.name ?? "Progres", [c.side ? grid([left, fxImg(L, col([img(L, c.side.image, c.side.alt, "4 / 3")], { name: "Gambar" }))], 2, { gap: 48, align: "center" }) : stack([left], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Tabel data (gratis). */
export function tableD(L: LookD, c: Intro & { columns: string[]; rows: string[][]; note?: string; name?: string; bg?: string }): BoxNode {
  const t = el("table", { columns: c.columns.map((label, i) => ({ id: `col-${i}`, label })), rows: c.rows, headerBgColor: L.shape === "brutal" ? L.p.ink : L.p.soft, headerTextColor: L.shape === "brutal" ? "#ffffff" : L.p.ink, textColor: L.p.ink, bodyBgColor: L.surface, stripeColor: L.alt, rowHoverColor: L.p.soft, borderRadius: L.shape === "brutal" || L.shape === "sharp" ? 0 : Math.min(L.radius, 16), shadowEnabled: false, outerBorderColor: L.shape === "brutal" ? L.p.ink : L.p.line, dividerColor: L.p.line }, "Tabel");
  return sec(c.name ?? "Tabel", [intro(L, c), stack([fxBlock(L, t), ...(c.note ? [P(L, c.note, { size: 13 })] : [])], { gap: 10, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 80 });
}

/** Tab konten (gratis). */
export function tabsD(L: LookD, c: Intro & { tabs: [string, string][]; name?: string; bg?: string }): BoxNode {
  return sec(
    c.name ?? "Tab",
    [intro(L, c), stack([fxBlock(L, el("tabs", { tabs: c.tabs.map(([title, content]) => ({ title, content })), widthMode: "full", variant: L.shape === "soft" || L.shape === "glass" ? "pills" : L.shape === "brutal" || L.shape === "retro" ? "boxed" : "underline", activeTextColor: L.p.primaryDark, indicatorColor: L.p.primary, activeBgColor: L.p.soft, listBgColor: L.alt, textColor: L.p.muted, panelTextColor: L.p.ink, panelFontSize: 16 }, "Tab"))], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 80, width: 960 },
  );
}

export interface Post {
  image: string;
  tag: string;
  title: string;
  text: string;
  date: string;
  href: string;
}

/** Majalah: satu artikel utama besar + daftar artikel ringkas di samping. */
export function magazine(L: LookD, c: Intro & { lead: Post; items: Post[]; read: string; name?: string; bg?: string }): BoxNode {
  const link = (x: Post) => el("anchor", { text: `${c.read} →`, href: x.href, underline: "hover", fontSize: 14, fontWeight: 700, textColor: L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan");
  const lead = fxCard(L, col([img(L, c.lead.image, c.lead.title, "16 / 10"), inline([badge(c.lead.tag, L.p.primary, "#ffffff"), para(c.lead.date, { size: 13, color: L.p.muted, full: false })], { gap: 10 }), T(L, c.lead.title, "h2", { size: 34 }), P(L, c.lead.text, { size: 17 }), link(c.lead)], { gap: 12, name: "Artikel utama" }));
  const side = col(
    c.items.map((x, i) => {
      const r = col([img(L, x.image, x.title, "16 / 7"), para(`${x.tag} · ${x.date}`, { size: 12, weight: 700, color: L.p.primary, transform: "uppercase", spacing: 1 }), T(L, x.title, "h3", { size: 18 }), link(x)], { gap: 6, name: "Artikel ringkas", align: "stretch" });
      if (i > 0) addCss(r, `border-top: 1px solid ${L.p.line}; padding-top: 16px;`);
      return fxCard(L, r, i + 1);
    }),
    { gap: 16, name: "Artikel lain", align: "stretch" },
  );
  return sec(c.name ?? "Majalah", [intro(L, c), grid([lead, side], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 40, align: "start" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Isi artikel panjang (kolom sempit). */
export function articleBody(L: LookD, c: { lead: string; blocks: [string, string][]; quote?: string; name?: string }): BoxNode {
  const body: (ElementNode | BoxNode)[] = [P(L, c.lead, { size: 21, color: L.p.ink })];
  for (const [h, t] of c.blocks) {
    if (h) body.push(T(L, h, "h2", { size: 28 }));
    body.push(P(L, t, { size: 17 }));
  }
  if (c.quote) {
    const q = T(L, c.quote, "h3", { size: 24, weight: 600, color: L.p.primaryDark });
    addCss(q, `border-left: 4px solid ${L.p.primary}; padding-left: 18px;`);
    body.splice(Math.min(3, body.length), 0, q);
  }
  return sec(c.name ?? "Isi Artikel", [fxBlock(L, stack(body, { gap: 16, align: "stretch" }))], { bg: L.bg, padY: 56, width: 760 });
}

/** Profil orang (gratis). */
export function peopleD(L: LookD, c: Intro & { items: { name: string; role: string; photo: string; text?: string }[]; cols?: number; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map((m, i) => fxCard(L, card(L, [img(L, m.photo, m.name, "1 / 1", L.shape === "soft" ? 999 : undefined), T(L, m.name, "h3", { size: 19 }), para(m.role, { size: 14, weight: 700, color: L.p.primaryDark }), ...(m.text ? [P(L, m.text, { size: 14 })] : [])], { name: "Profil", gap: 6, pad: 16 }), i));
  return sec(c.name ?? "Profil", [intro(L, c), grid(cells, c.cols ?? Math.min(4, cells.length), { gap: 20, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Ajakan dengan tipografi besar. */
export function ctaD(L: LookD, c: { title: string; text?: string; actions: Act[]; name?: string; tone?: "inv" | "primary" | "soft" }): BoxNode {
  const tone = c.tone ?? "inv";
  const light = tone !== "soft";
  const bg = tone === "inv" ? L.inv : tone === "primary" ? L.p.primary : L.p.soft;
  return sec(
    c.name ?? "Ajakan",
    [stack([fxBlock(L, T(L, c.title, "h2", { size: 54, color: light ? "#ffffff" : L.p.ink, align: "center", spacing: -1 })), ...(c.text ? [P(L, c.text, { size: 18, color: light ? "#f1f5f9" : L.p.muted, align: "center" })] : []), acts(L, c.actions.map(([a, b, k]) => [a, b, k ?? (light ? "light" : "primary")] as Act), "center")], { gap: 18, align: "center" })],
    { bg, padY: 96, width: 900 },
  );
}

export interface Listing {
  image: string;
  title: string;
  text: string;
  price: string;
  compare?: string;
  badge?: string;
  rating?: number;
  reviews?: string;
  cta: string;
  href: string;
}

/** Katalog kartu produk (Product Card gratis). */
export function catalog(L: LookD, c: Intro & { items: Listing[]; cols?: number; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map((it, i) => {
    const pc = listingCard({ ...it, p: L.p });
    pc.state = { ...pc.state, borderRadius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.radius, bgColor: L.surface, ...(L.shape === "brutal" ? { borderColor: L.p.ink, borderWidth: 3 } : {}) };
    return fxCard(L, col([pc], { name: "Item", align: "stretch" }), i);
  });
  return sec(c.name ?? "Katalog", [intro(L, c), grid(cells, c.cols ?? 3, { gap: 22, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Banner pengumuman (gratis). */
export function noticeD(L: LookD, c: { badge: string; text: string; link: string; href: string; name?: string }): BoxNode {
  return sec(c.name ?? "Pengumuman", [stack([el("banner", { badge: c.badge, text: c.text, linkText: c.link, href: c.href, dismissible: false, bgColor: L.p.primaryDark, badgeBg: "#ffffff", badgeText: L.p.primaryDark, linkColor: L.p.line, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : Math.min(L.radius, 14) }, "Banner")], { align: "stretch" })], { bg: L.bg, padY: 24 });
}

/** Spesifikasi: daftar kunci–nilai dua kolom + gambar opsional. */
export function specs(L: LookD, c: Intro & { rows: [string, string][]; image?: string; alt?: string; name?: string; bg?: string }): BoxNode {
  const rows = c.rows.map(([k, v]) => {
    const r = col([para(k, { size: 13, weight: 700, color: L.p.muted, transform: "uppercase", spacing: 1 }), para(v, { size: 16, weight: 600, color: L.p.ink })], { gap: 2, name: "Baris spesifikasi", align: "stretch" });
    addCss(r, `border-bottom: 1px solid ${L.p.line}; padding: 12px 0;`);
    return r;
  });
  const list = fxBlock(L, col([...introEls(L, c), ...rows], { gap: 0, name: "Spesifikasi", align: "stretch" }));
  return sec(c.name ?? "Spesifikasi", [c.image ? grid([list, fxImg(L, col([img(L, c.image, c.alt ?? c.title, "1 / 1")], { name: "Gambar" }))], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 48, align: "center" }) : stack([list], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Lokasi: peta ilustrasi + kartu alamat. */
export function locations(L: LookD, c: Intro & { places: [string, string, string][]; image: string; name?: string; bg?: string }): BoxNode {
  const cards = c.places.map(([n, a, h], i) => fxCard(L, card(L, [T(L, n, "h3", { size: 19 }), P(L, a, { size: 15 }), para(h, { size: 13, weight: 700, color: L.p.primaryDark })], { name: "Lokasi", gap: 6, pad: 20 }), i));
  return sec(c.name ?? "Lokasi", [intro(L, c), grid([fxImg(L, col([img(L, c.image, c.title, "4 / 3")], { name: "Peta" })), col(cards, { gap: 14, name: "Daftar lokasi", align: "stretch" })], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 32, align: "start" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Video (gratis). */
export function videoD(L: LookD, c: Intro & { url: string; vtitle: string; name?: string; bg?: string }): BoxNode {
  return sec(c.name ?? "Video", [intro(L, { ...c, align: c.align ?? "center" }), stack([fxImg(L, el("video", { source: "youtube", url: c.url, title: c.vtitle, radius: L.shape === "brutal" || L.shape === "sharp" ? 0 : L.radius, shadow: true }, "Video"))], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 80, width: 960 });
}

/** Marquee logo/nama mitra (Premium). */
export function marqueeD(L: LookD, c: { title: string; items: string[]; name?: string; bg?: string }): BoxNode {
  return sec(c.name ?? "Marquee Mitra", [stack([el("logo-marquee", { title: c.title, items: c.items, textColor: L.p.muted, bgColor: "transparent", grayscale: true, fade: true, speed: 32 }, "Logo Marquee")], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 48 });
}

/** Pemisah berlabel (gratis) sebagai section tipis. */
export function dividerD(L: LookD, label: string, name = "Pemisah"): BoxNode {
  return sec(name, [stack([el("divider", { label, lineStyle: L.shape === "retro" ? "dashed" : "solid", thickness: L.shape === "brutal" ? 3 : 1, color: L.shape === "brutal" ? L.p.ink : L.p.line, labelColor: L.p.muted })], { align: "stretch" })], { bg: L.bg, padY: 16 });
}
