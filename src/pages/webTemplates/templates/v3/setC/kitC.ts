import type { BoxNode, ComponentNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import type { AnimateSettings, AosSettings, EffectLibraryId } from "../../../../pageMaker/engine/helpers/libraries";
import { createBox, walk } from "../../../../pageMaker/engine/helpers/tree";
import { createRow } from "../../../../pageMaker/helpers/rowModel";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import { TF } from "../../../../pageMaker/core/helpers/templateFonts";
import { badge, button, col, el, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../../build";
import type { TemplatePageDef } from "../../../types";
import { logo, menu, pageWith } from "../../pro/kit";
import { field, type Field, type Look } from "../../v2/setA/kitA";
import { animate, aos, aosStagger, installLibs, tilt } from "../libs";

/* ================================================================== */
/* Perangkat template v3 bagian C                                        */
/*                                                                    */
/* Desain section baru (bento, editorial, brutalist, kaca, layar terbagi, */
/* tipografi raksasa, neon, pastel, retro). Setiap template memilih      */
/* "skin" kartu, radius, gaya hero, header & footer, serta pasangan font  */
/* Google (TF) sendiri. Efek library (AOS / Animate.css / Vanilla Tilt)  */
/* dipasang lewat `fx` tema dan dicatat di root.libraries tiap halaman.  */
/* Semua tetap tersusun dari elemen Page Maker (Section → Row → Elemen). */
/* ================================================================== */

export type { Field };

export type Skin = "soft" | "brutal" | "glass" | "editorial" | "neon" | "retro" | "bento" | "line";

export interface Fx {
  aos?: AosSettings["effect"];
  animate?: AnimateSettings["effect"];
  tilt?: { max: number; glare?: boolean };
}

/** Tema v3: palet, latar, radius, skin kartu, font judul/isi, efek library. */
export interface LC extends Look {
  skin: Skin;
  fx: Fx;
  btnR: number;
  caps: boolean;
  /** Teks redup di latar gelap. */
  onDark: string;
  /** Warna aksen kedua (gradien, neon). */
  accent2: string;
}

export function lookC(
  p: Palette,
  o: { head: string; body: string; skin: Skin; radius: number; bg: string; alt: string; dark: string; page?: string; fx: Fx; btnR?: number; caps?: boolean; onDark?: string; accent2?: string },
): LC {
  return {
    p,
    bg: o.bg,
    alt: o.alt,
    dark: o.dark,
    radius: o.radius,
    headFont: TF[o.head],
    font: TF[o.body],
    page: o.page ?? o.bg,
    skin: o.skin,
    fx: o.fx,
    btnR: o.btnR ?? Math.min(o.radius, 12),
    caps: !!o.caps,
    onDark: o.onDark ?? "#cbd5e1",
    accent2: o.accent2 ?? p.primaryDark,
  };
}

/* ------------------------------ halaman ---------------------------- */

export const home = (id = "Beranda", en = "Home"): TemplatePageDef => ({ key: "home", slug: { id: "index", en: "index" }, name: { id, en }, home: true });

/** Definisi halaman: kunci, [slug, nama] ID, [slug, nama] EN. */
export const pg = (key: string, idv: [string, string], env: [string, string]): TemplatePageDef => ({ key, slug: { id: idv[0], en: env[0] }, name: { id: idv[1], en: env[1] } });

const LIB_ORDER: Exclude<EffectLibraryId, "scroll">[] = ["aos", "animate", "tilt"];

/** Halaman: font & latar root + library dari `fx` (selalu ada node yang memakainya). */
export function pageC(L: LC, sections: BoxNode[]): PageDoc {
  const doc = pageWith(sections, L.font, L.page);
  const ids = LIB_ORDER.filter((k) => L.fx[k]);
  if (!ids.length) return doc;
  installLibs(doc, ids);
  const has = (id: EffectLibraryId) => {
    let found = false;
    walk(doc.root, (n) => {
      if (n.libs?.[id]) found = true;
    });
    return found;
  };
  const middle = sections.slice(1, -1);
  if (L.fx.aos && !has("aos")) for (const s of middle) if (s.children[0]) aos(s.children[0], L.fx.aos);
  if (L.fx.animate && !has("animate")) {
    const first = firstNode(middle, (n) => n.kind === "element" && (n as ElementNode).elementType === "text");
    if (first) animate(first, L.fx.animate);
  }
  if (L.fx.tilt && !has("tilt")) {
    const pic = firstNode(middle, (n) => n.kind === "element" && (n as ElementNode).elementType === "image") ?? firstNode(middle, (n) => n.kind === "box" && !!(n as BoxNode).bgEnabled) ?? firstNode(middle, (n) => n.kind === "box" && !(n as BoxNode).row) ?? firstNode(middle, (n) => n.kind === "element");
    if (pic) tilt(pic, { max: L.fx.tilt.max, glare: !!L.fx.tilt.glare });
  }
  return doc;
}

function firstNode(roots: BoxNode[], ok: (n: ComponentNode) => boolean): ComponentNode | null {
  let hit: ComponentNode | null = null;
  for (const r of roots)
    walk(r, (n) => {
      if (!hit && n !== r && ok(n)) hit = n;
    });
  return hit;
}

/* ------------------------------ efek -------------------------------- */

const fxText = <T extends ComponentNode>(L: LC, n: T): T => (L.fx.animate ? animate(n, L.fx.animate) : L.fx.aos ? aos(n, "fade-up") : n);
export const fxPic = <T extends ComponentNode>(L: LC, n: T): T => (L.fx.tilt ? tilt(n, { max: L.fx.tilt.max, glare: !!L.fx.tilt.glare }) : L.fx.aos ? aos(n, "zoom-in") : n);
const fxGrid = (L: LC, row: BoxNode): BoxNode => (L.fx.aos ? aosStagger(row, L.fx.aos, 120) : row);

/* ------------------------------ util -------------------------------- */

function css<T extends ElementNode | BoxNode>(n: T, decl: string): T {
  const raw = n.advanced?.customCss ?? "";
  // Deklarasi biasa dan blok bersarang tidak boleh dicampur: bungkus yang lama dengan `& { }` bila perlu.
  const cur = raw && !raw.includes("{") && decl.includes("{") ? `& { ${raw} }` : raw;
  const next = decl.includes("{") ? `${cur}${cur ? "\n" : ""}${decl}` : cur.includes("{") ? `${cur}\n& { ${decl} }` : `${cur}${cur ? "\n" : ""}${decl}`;
  n.advanced = { ...n.advanced, customCss: next };
  return n;
}

/** Latar gelap? (luminansi warna hex). */
function isDark(hex: string): boolean {
  const m = /^#([0-9a-f]{6})/i.exec(hex);
  if (!m) return false;
  const v = parseInt(m[1], 16);
  const r = (v >> 16) & 255;
  const g = (v >> 8) & 255;
  const b = v & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

const inkOf = (L: LC, dark: boolean) => (dark ? "#ffffff" : L.p.ink);
const mutedOf = (L: LC, dark: boolean) => (dark ? L.onDark : L.p.muted);

/** Judul dengan font judul tema (huruf kapital bila tema `caps`). */
export function H(L: LC, text: string, tag: "h1" | "h2" | "h3" | "h4", o: Parameters<typeof heading>[2] = {}): ElementNode {
  const n = heading(text, tag, { color: L.p.ink, transform: L.caps && (tag === "h1" || tag === "h2") ? "uppercase" : "none", ...o });
  if (L.headFont) css(n, `font-family: ${L.headFont};`);
  return n;
}

export const P = (L: LC, text: string, o: Parameters<typeof para>[1] = {}) => para(text, { color: L.p.muted, ...o });

export const kicker = (L: LC, text: string, dark = false, align: "left" | "center" = "left") =>
  para(text, { size: 12, weight: 700, color: dark ? L.p.line : L.p.primary, align, spacing: 2, transform: "uppercase" });

/** Aksi: [label, href, jenis]. */
export type Act = [string, string, ("primary" | "outline" | "light" | "dark")?];

function btn(L: LC, label: string, href: string, kind: Act[2] = "primary", o: { full?: boolean } = {}): ElementNode {
  const b = linkButton(label, href, kind ?? "primary", L.p, o);
  b.state = { ...b.state, borderRadius: L.btnR };
  if (L.caps) css(b, "text-transform: uppercase; letter-spacing: 0.06em;");
  if (L.skin === "brutal" && kind !== "outline") css(b, `border: 2px solid ${L.p.ink}; box-shadow: 4px 4px 0 ${L.p.ink};`);
  if (L.skin === "neon" && kind === "primary") css(b, `box-shadow: 0 0 22px ${L.p.primary}88;`);
  if (L.skin === "retro" && kind === "primary") css(b, `box-shadow: 3px 3px 0 ${L.p.ink};`);
  return b;
}

export const acts = (L: LC, list: Act[], justify: "start" | "center" | "end" = "start") => inline(list.map(([l, h, k]) => btn(L, l, h, k)), { justify });

/** Kartu sesuai skin tema. */
function card(L: LC, kids: (ElementNode | BoxNode)[], o: { dark?: boolean; tone?: "plain" | "soft" | "primary" | "dark"; pad?: number; name?: string; gap?: number; align?: "start" | "center" | "stretch" } = {}): BoxNode {
  const tone = o.tone ?? "plain";
  const dark = !!o.dark;
  const bgTone = tone === "soft" ? L.p.soft : tone === "primary" ? L.p.primary : tone === "dark" ? L.dark : dark ? "#ffffff0d" : L.skin === "bento" ? L.alt : "#ffffff";
  const c = col(kids, { gap: o.gap ?? 10, name: o.name ?? "Kartu", align: o.align, card: { bg: bgTone, border: dark && tone === "plain" ? "#ffffff1f" : undefined, radius: L.radius, padding: o.pad ?? 26 } });
  const ink = L.p.ink;
  switch (L.skin) {
    case "soft":
      css(c, `box-shadow: 0 22px 44px -28px ${ink}66;`);
      break;
    case "brutal":
      css(c, `border: 3px solid ${ink}; box-shadow: 7px 7px 0 ${ink};`);
      break;
    case "glass":
      if (tone === "plain") css(c, "background: rgba(255,255,255,0.14); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);");
      break;
    case "editorial":
      if (tone === "plain") {
        c.bgEnabled = false;
        css(c, `border-top: 2px solid ${dark ? "#ffffff" : ink}; border-radius: 0; padding: 22px 0 0;`);
      }
      break;
    case "neon":
      css(c, `border: 1px solid ${L.p.primary}; box-shadow: 0 0 30px -8px ${L.p.primary}aa;`);
      break;
    case "retro":
      css(c, `border: 2px solid ${ink}; box-shadow: 5px 5px 0 ${L.p.primary};`);
      break;
    case "bento":
      break;
    case "line":
      css(c, `border: 1px solid ${dark ? "#ffffff2a" : L.p.line};`);
      break;
  }
  return c;
}

/** Section dengan opsi gradien/CSS latar tambahan. */
export function sec(name: string, rows: BoxNode[], o: { bg?: string; gradient?: [string, string, number?]; padY?: number; width?: number; css?: string; tag?: "header" | "footer" } = {}): BoxNode {
  const s = section(name, rows, { bg: o.gradient ? undefined : o.bg, gradient: o.gradient, padY: o.padY ?? 88, width: o.width, tag: o.tag });
  if (o.css) css(s, o.css);
  return s;
}

/** Intro section. */
function intro(L: LC, c: { eyebrow?: string; title: string; text?: string; align?: "left" | "center" }, dark = false): BoxNode {
  const align = c.align ?? "left";
  return stack(
    [...(c.eyebrow ? [kicker(L, c.eyebrow, dark, align)] : []), H(L, c.title, "h2", { align, color: inkOf(L, dark), size: 38 }), ...(c.text ? [P(L, c.text, { align, size: 17, color: mutedOf(L, dark) })] : [])],
    { gap: 10, align: align === "center" ? "center" : "stretch" },
  );
}
type Intro = { eyebrow?: string; title: string; text?: string; align?: "left" | "center" };

const span = <T extends BoxNode>(n: T, cols: number, rows = 1): T =>
  css(n, `& { grid-column: span ${cols};${rows > 1 ? ` grid-row: span ${rows};` : ""} }\n@media (max-width: 640px) {\n  & { grid-column: auto; grid-row: auto; }\n}`);

/* ------------------------------ header ----------------------------- */

export interface HeadOpts {
  kind: "pill" | "bar" | "stack" | "dark" | "split";
  cta?: [string, string];
  nav?: ElementNode;
  strip?: string;
  sticky?: boolean;
}

/** Header situs (5 gaya). */
export function hdr(L: LC, brand: string, o: HeadOpts): BoxNode {
  const darkBg = o.kind === "dark" || o.kind === "split" ? L.dark : L.page;
  const dark = isDark(darkBg);
  const ink = inkOf(L, dark);
  const nav = o.nav ?? menu(L.p, dark ? "#e2e8f0" : "#334155");
  const ctaEl = o.cta ? btn(L, o.cta[0], o.cta[1], dark ? "light" : "primary") : null;
  const lg = logo(brand, ink, L.headFont, o.kind === "bar" ? 24 : 21);
  if (L.caps) css(lg, "text-transform: uppercase; letter-spacing: 0.04em;");
  const rowOf = (children: (BoxNode | ElementNode)[], justify: "between" | "center" = "between") =>
    createRow({ name: "Row Header", padding: 0, layout: "row", align: "center", justify, wrap: false, gap: 16, stackOnMobile: false, children });
  const rows: BoxNode[] = [];
  if (o.strip) {
    const strip = createRow({ name: "Row Info", padding: 0, align: "center", gap: 0, children: [para(o.strip, { size: 13, weight: 600, color: dark ? L.onDark : L.p.primaryDark, align: "center" })] });
    css(strip, `padding-bottom: 10px; margin-bottom: 12px; border-bottom: 1px solid ${dark ? "#ffffff22" : L.p.line};`);
    rows.push(strip);
  }
  if (o.kind === "stack") {
    const m = o.nav ?? menu(L.p, "#334155");
    if (!o.nav) m.state = { ...m.state, align: "center" };
    rows.push(createRow({ name: "Row Header", padding: 0, align: "center", gap: 10, children: [css(logo(brand, ink, L.headFont, 30), "text-align: center;"), m, ...(ctaEl ? [ctaEl] : [])] }));
  } else {
    const r = rowOf([lg, col([nav, ...(ctaEl ? [ctaEl] : [])], { layout: "row", gap: 16, name: "Navigasi", stackOnMobile: false, wrap: false })]);
    if (o.kind === "pill") css(r, `background: ${L.skin === "glass" ? "rgba(255,255,255,0.7)" : "#ffffff"}; border: 1px solid ${L.p.line}; border-radius: 999px; padding: 10px 14px 10px 24px; box-shadow: 0 12px 30px -22px ${L.p.ink}88;`);
    if (o.kind === "split") css(lg, `background: ${L.p.primary}; color: #ffffff; padding: 8px 14px; border-radius: ${Math.min(L.radius, 10)}px;`);
    rows.push(r);
  }
  const s = section("Header", rows, { bg: darkBg, padY: o.kind === "pill" ? 14 : 18, tag: "header" });
  if (o.kind === "bar") css(s, `border-bottom: 3px solid ${L.p.ink};`);
  if (o.kind === "dark") css(s, `border-bottom: 1px solid ${L.p.primary}55;`);
  if (o.sticky) css(s, "position: sticky; top: 0; z-index: 40;");
  return s;
}

/* ------------------------------ footer ----------------------------- */

export interface FootOpts {
  kind: "giant" | "card" | "columns" | "minimal";
  about: string;
  cols: { title: string; items: string[] }[];
  copy: string;
  social?: string[];
  backTop?: string;
  bg?: string;
}

const plainList = (items: string[], color: string) =>
  el(
    "list",
    { items, listStyleType: "none", bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, textColor: color, dividerEnabled: false, itemHoverEnabled: false, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemPaddingX: 0, itemPaddingY: 4 },
    "Daftar",
  );

function socials(L: LC, links: string[], dark: boolean, align: "left" | "center" = "left"): ElementNode {
  return el("social-links", { links, shape: L.radius < 6 ? "square" : "circle", size: 38, gap: 10, bgColor: dark ? "#ffffff14" : L.p.soft, iconColor: dark ? "#ffffff" : L.p.primaryDark, hoverBg: L.p.primary, hoverColor: "#ffffff", align, brandColors: false }, "Media sosial");
}

/** Grid di dalam kolom: Box "grid" biasa (bukan Row), agar tidak ada Row bersarang. */
export function gbox(children: ComponentNode[], columns: string, o: { gap?: number; name?: string; stack?: boolean } = {}): BoxNode {
  return createBox("grid", { name: o.name ?? "Petak", columns, gap: o.gap ?? 16, align: "stretch", widthMode: "full", stackOnMobile: o.stack ?? true, children });
}

/** Footer (4 gaya). `backTop` menambah tombol Kembali ke Atas (Premium). */
export function ftr(L: LC, brand: string, o: FootOpts): BoxNode {
  const bg = o.bg ?? (o.kind === "card" ? L.page : L.dark);
  const dark = isDark(bg);
  const ink = inkOf(L, dark);
  const muted = mutedOf(L, dark);
  const top = el("back-to-top", { label: o.backTop ?? "", showText: false, offset: 400, position: "right", size: 46, bgColor: L.p.primary, iconColor: "#ffffff", hoverBg: L.p.primaryDark, radius: Math.min(L.radius * 2, 999), bottom: 24 }, "Kembali ke atas");
  const extras = [...(o.social ? [socials(L, o.social, dark)] : []), ...(o.backTop ? [top] : [])];
  const colsRow = grid(
    [
      col([logo(brand, ink, L.headFont, 20), P(L, o.about, { color: muted, size: 14 }), ...extras], { gap: 12, name: "Merek" }),
      ...o.cols.map((c) => col([para(c.title, { color: ink, weight: 700, size: 14 }), plainList(c.items, muted)], { gap: 8, name: c.title })),
    ],
    `minmax(0, 1.5fr) ${o.cols.map(() => "minmax(0, 1fr)").join(" ")}`,
    { gap: 32 },
  );
  const copy = stack([para(o.copy, { color: muted, size: 13 })], { gap: 0 });
  css(copy, `border-top: 1px solid ${dark ? "#ffffff1f" : L.p.line}; padding-top: 18px;`);
  if (o.kind === "giant") {
    const word = H(L, brand, "h2", { size: 120, color: dark ? "#ffffff" : L.p.ink, spacing: -4 });
    // Selebar layar: ukuran mengikuti panjang nama agar tidak terpotong di HP.
    css(word, `& { line-height: 0.9; opacity: 0.14; white-space: nowrap; overflow: hidden; font-size: min(120px, ${Math.round((86 / (0.62 * Math.max(4, brand.length))) * 10) / 10}vw); }`);
    return section("Footer", [colsRow, stack([word], { gap: 0, align: "stretch" }), copy], { bg, padY: 56, tag: "footer" });
  }
  if (o.kind === "card") {
    const box = col(
      [gbox([col([logo(brand, "#ffffff", L.headFont, 22), P(L, o.about, { color: "#e5e7eb", size: 14 }), ...extras], { gap: 12, name: "Merek" }), ...o.cols.map((c) => col([para(c.title, { color: "#ffffff", weight: 700, size: 14 }), plainList(c.items, "#e5e7eb")], { gap: 8, name: c.title }))], `minmax(0, 1.5fr) ${o.cols.map(() => "minmax(0, 1fr)").join(" ")}`, { gap: 28, name: "Kolom footer" }), para(o.copy, { color: "#e5e7eb", size: 13 })],
      { gap: 24, name: "Kartu footer", card: { bg: L.p.primaryDark, radius: L.radius + 8, padding: 40 } },
    );
    return section("Footer", [stack([box], { gap: 0, align: "stretch" })], { bg, padY: 40, tag: "footer" });
  }
  if (o.kind === "minimal") {
    const r = grid(
      [col([logo(brand, ink, L.headFont, 18), para(o.copy, { size: 13, color: muted })], { gap: 6, name: "Merek" }), col([inline(o.cols.flatMap((c) => c.items).slice(0, 5).map((t) => para(t, { size: 14, weight: 600, color: muted, full: false })), { gap: 18, justify: "end" }), ...extras], { gap: 12, name: "Tautan", align: "end" })],
      "minmax(0, 1fr) minmax(0, 1.4fr)",
      { gap: 24, align: "center" },
    );
    return section("Footer", [r], { bg, padY: 36, tag: "footer" });
  }
  return section("Footer", [colsRow, copy], { bg, padY: 56, tag: "footer" });
}

/* ------------------------------ hero ------------------------------- */

export interface HeroC {
  kind: "bento" | "editorial" | "brutal" | "glass" | "split" | "oversized" | "neon" | "pastel" | "retro" | "collage" | "poster" | "minimal";
  eyebrow?: string;
  badge?: string;
  title: string;
  text: string;
  acts?: Act[];
  image?: string;
  alt?: string;
  images?: string[];
  note?: string;
  stat?: [string, string];
  chips?: string[];
  titleNode?: ElementNode;
  meta?: [string, string];
}

/** Hero dalam 12 gaya. */
export function hero(L: LC, c: HeroC): BoxNode {
  const pic = (ratio: string, radius = L.radius + 6) => fxPic(L, image(c.image ?? "", c.alt ?? c.title, { ratio, radius }));
  const title = (size: number, dark: boolean, align: "left" | "center" = "left") => c.titleNode ?? H(L, c.title, "h1", { size, color: inkOf(L, dark), align });
  const chipRow = (dark: boolean, justify: "start" | "center" = "start") =>
    c.chips ? [inline(c.chips.map((t) => badge(t, dark ? "#ffffff1a" : L.p.soft, dark ? "#ffffff" : L.p.primaryDark, dark ? "#ffffff33" : L.p.line)), { gap: 8, justify })] : [];
  const textCol = (dark: boolean, size: number, align: "left" | "center" = "left") =>
    fxText(
      L,
      col(
        [
          ...(c.badge ? [badge(c.badge, dark ? "#ffffff1a" : L.p.soft, dark ? "#ffffff" : L.p.primaryDark, dark ? "#ffffff33" : L.p.line)] : []),
          ...(c.eyebrow ? [kicker(L, c.eyebrow, dark, align)] : []),
          title(size, dark, align),
          P(L, c.text, { size: 18, color: mutedOf(L, dark), align }),
          ...(c.acts ? [acts(L, c.acts, align === "center" ? "center" : "start")] : []),
          ...chipRow(dark, align === "center" ? "center" : "start"),
          ...(c.note ? [P(L, c.note, { size: 13, color: mutedOf(L, dark), align })] : []),
        ],
        { gap: 18, name: "Teks hero", align: align === "center" ? "center" : "start" },
      ),
    );

  switch (c.kind) {
    case "bento": {
      const a = span(card(L, [...(c.eyebrow ? [kicker(L, c.eyebrow)] : []), title(54, false), P(L, c.text, { size: 17 }), ...(c.acts ? [acts(L, c.acts)] : [])], { tone: "soft", pad: 36, gap: 16, name: "Tile judul" }), 2, 2);
      const b = span(col([pic("4 / 3", L.radius)], { name: "Tile gambar" }), 2, 2);
      const st = c.stat ?? ["4.9", "rating"];
      const s1 = card(L, [H(L, st[0], "h2", { size: 46, color: "#ffffff" }), P(L, st[1], { color: "#ffffff", size: 14 })], { tone: "primary", name: "Tile angka" });
      const s2 = card(L, [...chipRow(true), ...(c.note ? [P(L, c.note, { color: "#e5e7eb", size: 14 })] : [])], { tone: "dark", name: "Tile catatan" });
      const g = fxGrid(L, grid([a, b, s1, span(s2, 3)], "repeat(4, minmax(0, 1fr))", { gap: 16, align: "stretch" }));
      return sec("Hero", [g], { bg: L.bg, padY: 56 });
    }
    case "editorial": {
      const meta = inline([para(c.meta?.[0] ?? c.eyebrow ?? "", { size: 13, weight: 700, color: L.p.ink, full: false, transform: "uppercase", spacing: 2 }), para(c.meta?.[1] ?? "", { size: 13, color: L.p.muted, full: false })], { justify: "between" });
      const top = stack([meta], { gap: 0, align: "stretch" });
      css(top, `border-top: 3px solid ${L.p.ink}; border-bottom: 1px solid ${L.p.ink}; padding: 10px 0;`);
      const big = stack([fxText(L, title(88, false))], { gap: 0, align: "stretch" });
      const lede = col([P(L, c.text, { size: 19, color: L.p.ink }), ...(c.acts ? [acts(L, c.acts)] : []), ...(c.note ? [P(L, c.note, { size: 13 })] : [])], { gap: 18, name: "Lede" });
      css(lede, `border-left: 1px solid ${L.p.line}; padding-left: 20px;`);
      return sec("Hero", [top, big, grid([lede, span(col([pic("16 / 9", 0)], { name: "Gambar" }), 2)], 3, { gap: 32 })], { bg: L.bg, padY: 48 });
    }
    case "brutal": {
      const box = card(L, [...(c.eyebrow ? [kicker(L, c.eyebrow)] : []), title(64, false), P(L, c.text, { size: 18, color: L.p.ink }), ...(c.acts ? [acts(L, c.acts)] : [])], { pad: 36, gap: 16, name: "Kotak judul" });
      const img = col([pic("1 / 1", L.radius)], { name: "Gambar" });
      css(img, `border: 3px solid ${L.p.ink}; transform: rotate(2deg); background: ${L.p.primary}; padding: 10px;`);
      const sticker = c.badge ? [stack([css(badge(c.badge, L.p.primary, "#ffffff", L.p.ink), "transform: rotate(-4deg); font-size: 15px; padding: 10px 16px;")], { gap: 0 })] : [];
      return sec("Hero", [...sticker, grid([fxText(L, box), img], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 40, align: "center" })], { bg: L.p.soft, padY: 80, css: `border-bottom: 3px solid ${L.p.ink};` });
    }
    case "glass": {
      const g = card(L, [...(c.eyebrow ? [kicker(L, c.eyebrow, true)] : []), title(56, true), P(L, c.text, { size: 18, color: "#f1f5f9" }), ...(c.acts ? [acts(L, c.acts)] : []), ...chipRow(true)], { pad: 40, gap: 16, name: "Kaca" });
      css(g, "background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.3); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);");
      return sec("Hero", [grid([fxText(L, g), col([pic("4 / 5")], { name: "Gambar" })], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 48, align: "center" })], {
        bg: L.dark,
        padY: 104,
        css: `background: radial-gradient(circle at 15% 20%, ${L.p.primary}cc 0, transparent 42%), radial-gradient(circle at 85% 80%, ${L.accent2}cc 0, transparent 40%), ${L.dark};`,
      });
    }
    case "split": {
      const left = col([textCol(true, 54)], { name: "Panel warna", card: { bg: L.p.primaryDark, radius: 0, padding: 56 } });
      const right = col([pic("4 / 5", 0)], { name: "Gambar" });
      return sec("Hero", [grid([left, right], "minmax(0, 1fr) minmax(0, 1fr)", { gap: 0, align: "stretch" })], { bg: L.bg, padY: 0, width: 1280 });
    }
    case "oversized": {
      const big = fxText(L, title(118, isDark(L.bg)));
      css(big, "& { line-height: 0.92; letter-spacing: -0.04em; }\n@media (max-width: 640px) {\n  & { font-size: 52px; }\n}");
      const d = isDark(L.bg);
      const rows = [
        stack([...(c.eyebrow ? [kicker(L, c.eyebrow, d)] : []), big], { gap: 14, align: "stretch" }),
        grid([col([P(L, c.text, { size: 19, color: mutedOf(L, d) })], { name: "Teks" }), col([...(c.acts ? [acts(L, c.acts, "end")] : [])], { name: "Aksi", align: "end" })], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 24, align: "end" }),
      ];
      if (c.image) rows.push(stack([pic("21 / 9")], { gap: 0, align: "stretch" }));
      return sec("Hero", rows, { bg: L.bg, padY: 72 });
    }
    case "neon": {
      const t = c.titleNode ?? H(L, c.title, "h1", { size: 64, color: "#ffffff" });
      if (!c.titleNode) css(t, `background: linear-gradient(90deg, ${L.p.line}, ${L.p.primary}, ${L.accent2}); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;`);
      const txt = fxText(L, col([...(c.badge ? [badge(c.badge, "#ffffff10", L.p.line, L.p.primary)] : []), t, P(L, c.text, { size: 18, color: L.onDark }), ...(c.acts ? [acts(L, c.acts)] : []), ...chipRow(true)], { gap: 18, name: "Teks hero" }));
      const img = col([pic("1 / 1")], { name: "Gambar" });
      css(img, `border-radius: ${L.radius + 6}px; box-shadow: 0 0 60px -10px ${L.p.primary};`);
      return sec("Hero", [grid([txt, img], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 48, align: "center" })], { bg: L.dark, padY: 104, css: `background: radial-gradient(circle at 80% 10%, ${L.p.primary}40 0, transparent 45%), ${L.dark};` });
    }
    case "pastel": {
      const rows = [stack([textCol(false, 58, "center")], { gap: 0, align: "center" })];
      if (c.image) rows.push(stack([pic("21 / 9", L.radius + 14)], { gap: 0, align: "stretch" }));
      return sec("Hero", rows, { bg: L.bg, padY: 96, width: 1040, css: `background: radial-gradient(circle at 10% 20%, ${L.p.soft} 0, transparent 35%), radial-gradient(circle at 90% 10%, ${L.p.line} 0, transparent 30%), radial-gradient(circle at 50% 100%, ${L.alt} 0, transparent 45%), ${L.bg};` });
    }
    case "retro": {
      const t = c.titleNode ?? H(L, c.title, "h1", { size: 66, color: L.p.ink });
      if (!c.titleNode) css(t, `text-shadow: 4px 4px 0 ${L.p.primary};`);
      const txt = fxText(L, col([...(c.badge ? [badge(c.badge, L.p.primary, "#ffffff", L.p.ink)] : []), t, P(L, c.text, { size: 18, color: L.p.ink }), ...(c.acts ? [acts(L, c.acts)] : [])], { gap: 18, name: "Teks hero" }));
      const img = col([pic("1 / 1", 999)], { name: "Gambar bulat" });
      css(img, `border: 4px solid ${L.p.ink}; border-radius: 999px; padding: 10px; background: ${L.p.line};`);
      const stripes = stack([P(L, " ", { size: 8 })], { gap: 0, align: "stretch" });
      css(stripes, `height: 22px; background: repeating-linear-gradient(90deg, ${L.p.primary} 0 40px, ${L.accent2} 40px 80px, ${L.p.line} 80px 120px); border-radius: 999px;`);
      return sec("Hero", [grid([txt, img], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 48, align: "center" }), stripes], { bg: L.bg, padY: 88 });
    }
    case "collage": {
      const imgs = c.images ?? [c.image ?? "", c.image ?? "", c.image ?? ""];
      const im = (src: string, ratio: string, rot: number) => {
        const n = col([fxPic(L, image(src, c.alt ?? c.title, { ratio, radius: L.radius }))], { name: "Foto" });
        return css(n, `transform: rotate(${rot}deg);`);
      };
      const coll = createBox("grid", { name: "Kolase", columns: "repeat(2, minmax(0, 1fr))", gap: 14, align: "stretch", widthMode: "full", stackOnMobile: false, children: [span(im(imgs[0], "3 / 4", -2), 1, 2), im(imgs[1], "1 / 1", 3), im(imgs[2], "1 / 1", -3)] });
      return sec("Hero", [grid([textCol(isDark(L.bg), 56), col([coll], { name: "Gambar" })], "minmax(0, 1fr) minmax(0, 1fr)", { gap: 48, align: "center" })], { bg: L.bg, padY: 88 });
    }
    case "poster": {
      const d = isDark(L.bg);
      const box = card(
        L,
        [
          ...(c.meta ? [inline([kicker(L, c.meta[0], d), kicker(L, c.meta[1], d)], { justify: "between" })] : []),
          title(72, d, "center"),
          P(L, c.text, { size: 18, color: mutedOf(L, d), align: "center" }),
          ...(c.acts ? [acts(L, c.acts, "center")] : []),
          ...chipRow(d, "center"),
        ],
        { dark: d, pad: 48, gap: 18, align: "center", name: "Poster" },
      );
      css(box, `border: 2px dashed ${d ? L.p.line : L.p.ink};`);
      const rows = [stack([fxText(L, box)], { gap: 0, align: "stretch" })];
      if (c.image) rows.push(stack([pic("21 / 8")], { gap: 0, align: "stretch" }));
      return sec("Hero", rows, { bg: L.bg, padY: 72, width: 1040 });
    }
    default: {
      const t = textCol(false, 60);
      const img = col([pic("4 / 5")], { name: "Gambar" });
      css(img, "margin-top: 80px;");
      return sec("Hero", [grid([t, img], "minmax(0, 1.5fr) minmax(0, 1fr)", { gap: 64, align: "start" })], { bg: L.bg, padY: 112 });
    }
  }
}

/* ------------------------- judul halaman dalam ---------------------- */

export function banner(L: LC, c: { kind: "band" | "rule" | "image" | "center"; eyebrow?: string; title: string; text?: string; image?: string; alt?: string }): BoxNode {
  if (c.kind === "band") {
    const t = fxText(L, H(L, c.title, "h1", { size: 64, color: "#ffffff" }));
    return sec("Judul halaman", [stack([...(c.eyebrow ? [kicker(L, c.eyebrow, true)] : []), t, ...(c.text ? [P(L, c.text, { size: 18, color: "#f1f5f9" })] : [])], { gap: 12 })], { gradient: [L.p.primary, L.accent2, 120], padY: 80 });
  }
  if (c.kind === "rule") {
    const left = col([...(c.eyebrow ? [kicker(L, c.eyebrow)] : []), fxText(L, H(L, c.title, "h1", { size: 56 }))], { gap: 10, name: "Judul" });
    const right = col([...(c.text ? [P(L, c.text, { size: 18 })] : [])], { name: "Teks", align: "end" });
    const r = grid([left, right], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 40, align: "end" });
    css(r, `border-bottom: 2px solid ${L.p.ink}; padding-bottom: 28px;`);
    return sec("Judul halaman", [r], { bg: L.bg, padY: 64 });
  }
  if (c.kind === "image") {
    const d = isDark(L.alt);
    const left = col([...(c.eyebrow ? [kicker(L, c.eyebrow, d)] : []), fxText(L, H(L, c.title, "h1", { size: 50, color: inkOf(L, d) })), ...(c.text ? [P(L, c.text, { size: 18, color: mutedOf(L, d) })] : [])], { gap: 12, name: "Judul" });
    const right = col([fxPic(L, image(c.image ?? "", c.alt ?? c.title, { ratio: "16 / 10", radius: L.radius }))], { name: "Gambar" });
    return sec("Judul halaman", [grid([left, right], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 48, align: "center" })], { bg: L.alt, padY: 64 });
  }
  const d = isDark(L.alt);
  return sec("Judul halaman", [stack([...(c.eyebrow ? [kicker(L, c.eyebrow, d, "center")] : []), fxText(L, H(L, c.title, "h1", { size: 52, align: "center", color: inkOf(L, d) })), ...(c.text ? [P(L, c.text, { size: 18, align: "center", color: mutedOf(L, d) })] : [])], { gap: 12, align: "center" })], { bg: L.alt, padY: 72, width: 860 });
}

/* ---------------------------- konten --------------------------------- */

export interface Tile {
  title: string;
  text: string;
  image?: string;
  stat?: string;
  tone?: "plain" | "soft" | "primary" | "dark";
  wide?: boolean;
}

/** Grid bento: ubin lebar/sempit, gambar, angka. */
export function bento(L: LC, c: Intro & { tiles: Tile[]; bg?: string }): BoxNode {
  const cell = (t: Tile) => {
    const lightText = t.tone === "primary" || t.tone === "dark";
    const kids: (ElementNode | BoxNode)[] = [];
    if (t.image) kids.push(fxPic(L, image(t.image, t.title, { ratio: t.wide ? "16 / 7" : "4 / 3", radius: Math.max(0, L.radius - 6) })));
    if (t.stat) kids.push(H(L, t.stat, "h2", { size: 44, color: lightText ? "#ffffff" : L.p.primaryDark }));
    kids.push(H(L, t.title, "h3", { size: 20, color: lightText ? "#ffffff" : L.p.ink }), P(L, t.text, { size: 15, color: lightText ? "#e5e7eb" : L.p.muted }));
    const k = card(L, kids, { tone: t.tone ?? "plain", name: "Ubin", pad: 24 });
    return t.wide ? span(k, 2) : k;
  };
  const d = isDark(c.bg ?? L.bg);
  return sec("Bento", [intro(L, c, d), fxGrid(L, grid(c.tiles.map(cell), 3, { gap: 18, align: "stretch" }))], { bg: c.bg ?? L.bg });
}

/** Daftar bernomor gaya majalah (garis tipis, angka besar). */
export function numbered(L: LC, c: Intro & { items: [string, string][]; bg?: string }): BoxNode {
  const d = isDark(c.bg ?? L.bg);
  const rows = c.items.map(([t, x], i) => {
    const r = grid(
      [
        col([H(L, String(i + 1).padStart(2, "0"), "h2", { size: 48, color: L.p.primary })], { name: "Nomor" }),
        col([H(L, t, "h3", { size: 24, color: inkOf(L, d) })], { name: "Judul" }),
        col([P(L, x, { size: 16, color: mutedOf(L, d) })], { name: "Teks" }),
      ],
      "minmax(0, 100px) minmax(0, 1fr) minmax(0, 1.4fr)",
      { gap: 24, align: "center" },
    );
    css(r, `border-top: 1px solid ${d ? "#ffffff2a" : L.p.ink}33; padding: 22px 0;`);
    return fxText(L, r);
  });
  return sec("Daftar Bernomor", [intro(L, c, d), ...rows], { bg: c.bg ?? L.bg, width: 1040 });
}

export interface Item {
  icon?: string;
  title: string;
  text: string;
  meta?: string;
  image?: string;
}

/** Kartu fitur/layanan bergaya skin tema. */
export function cardsC(L: LC, c: Intro & { items: Item[]; cols?: number; bg?: string; name?: string }): BoxNode {
  const d = isDark(c.bg ?? L.bg);
  const cell = (it: Item) => {
    const kids: (ElementNode | BoxNode)[] = [];
    if (it.image) kids.push(fxPic(L, image(it.image, it.title, { ratio: "4 / 3", radius: Math.max(0, L.radius - 6) })));
    if (it.icon) {
      const ic = el("text", { text: it.icon, tag: "p", fontSize: 24, fontWeight: 800, textColor: d ? L.p.line : L.p.primary, textAlign: "left", widthMode: "auto" }, "Ikon");
      css(ic, `display: inline-flex; align-items: center; justify-content: center; width: 54px; height: 54px; border-radius: ${Math.max(6, L.radius - 6)}px; background: ${d ? "#ffffff14" : L.p.soft};`);
      kids.push(ic);
    }
    kids.push(H(L, it.title, "h3", { size: 20, color: inkOf(L, d) }), P(L, it.text, { size: 15, color: mutedOf(L, d) }));
    if (it.meta) kids.push(para(it.meta, { size: 13, weight: 700, color: d ? L.p.line : L.p.primaryDark }));
    return card(L, kids, { dark: d, name: "Kartu" });
  };
  return sec(c.name ?? "Kartu", [intro(L, c, d), fxGrid(L, grid(c.items.map(cell), c.cols ?? Math.min(3, c.items.length), { gap: 22, align: "stretch" }))], { bg: c.bg ?? L.bg });
}

/** Layar terbagi: panel warna penuh + gambar, atau teks + gambar. */
export function split(L: LC, c: { eyebrow?: string; title: string; paras: string[]; bullets?: string[]; image: string; alt: string; reverse?: boolean; tone?: "primary" | "dark" | "soft"; acts?: Act[]; name?: string }): BoxNode {
  const tone = c.tone ?? "soft";
  const bg = tone === "primary" ? L.p.primaryDark : tone === "dark" ? L.dark : L.p.soft;
  const d = isDark(bg);
  const txt = col(
    [
      ...(c.eyebrow ? [kicker(L, c.eyebrow, d)] : []),
      H(L, c.title, "h2", { size: 36, color: inkOf(L, d) }),
      ...c.paras.map((t) => P(L, t, { size: 16, color: mutedOf(L, d) })),
      ...(c.bullets ? [checks(L, c.bullets, d)] : []),
      ...(c.acts ? [acts(L, c.acts)] : []),
    ],
    { gap: 14, name: "Panel teks", card: { bg, radius: 0, padding: 52 } },
  );
  const pic = col([fxPic(L, image(c.image, c.alt, { ratio: "1 / 1", radius: 0 }))], { name: "Gambar" });
  const r = grid(c.reverse ? [pic, fxText(L, txt)] : [fxText(L, txt), pic], 2, { gap: 0, align: "stretch" });
  css(r, `border-radius: ${L.radius}px; overflow: hidden;`);
  return sec(c.name ?? "Layar Terbagi", [r], { bg: L.bg, padY: 72 });
}

function checks(L: LC, items: string[], dark = false): ElementNode {
  return el(
    "list",
    { items: items.map((t) => `+ ${t}`), listStyleType: "none", bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, textColor: dark ? "#f1f5f9" : L.p.ink, fontSize: 15, dividerEnabled: false, itemHoverEnabled: false, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemPaddingX: 0, itemPaddingY: 5 },
    "Daftar",
  );
}

/** Pita kata besar (teks garis luar), gratis. */
export function words(L: LC, list: string[], o: { bg?: string } = {}): BoxNode {
  const bg = o.bg ?? L.p.primary;
  const d = isDark(bg);
  const items = list.map((w, i) => {
    const n = H(L, w, "h3", { size: 34, color: d ? "#ffffff" : L.p.ink, full: false });
    if (i % 2) css(n, `-webkit-text-stroke: 1.5px ${d ? "#ffffff" : L.p.ink}; -webkit-text-fill-color: transparent;`);
    return n;
  });
  return sec("Pita Kata", [stack([inline(items, { gap: 28, justify: "center" })], { gap: 0, align: "stretch" })], { bg, padY: 28 });
}

/** Angka besar sebaris (teks biasa, gratis). */
export function bigNumbers(L: LC, items: [string, string][], o: { bg?: string } = {}): BoxNode {
  const bg = o.bg ?? L.alt;
  const d = isDark(bg);
  const cells = items.map(([n, l]) => {
    const c = col([H(L, n, "h2", { size: 56, color: d ? "#ffffff" : L.p.primaryDark }), P(L, l, { size: 14, color: mutedOf(L, d) })], { gap: 2, name: "Angka" });
    return css(c, `border-left: 3px solid ${L.p.primary}; padding-left: 18px;`);
  });
  return sec("Angka Besar", [fxGrid(L, grid(cells, items.length, { gap: 24 }))], { bg, padY: 56 });
}

/** Daftar harga bertitik (menu, tarif). */
export function priceLines(L: LC, c: Intro & { groups: { title: string; items: [string, string, string][] }[]; bg?: string; note?: string }): BoxNode {
  const d = isDark(c.bg ?? L.bg);
  const item = ([n, desc, pr]: [string, string, string]) => {
    const head = inline([para(n, { size: 17, weight: 700, color: inkOf(L, d), full: false }), para(pr, { size: 17, weight: 700, color: d ? L.p.line : L.p.primaryDark, full: false })], { justify: "between" });
    css(head, `border-bottom: 1px dotted ${d ? "#ffffff55" : L.p.muted}; padding-bottom: 4px;`);
    return col([head, P(L, desc, { size: 14, color: mutedOf(L, d) })], { gap: 4, name: "Baris harga" });
  };
  const groups = c.groups.map((g) => col([H(L, g.title, "h3", { size: 22, color: d ? L.p.line : L.p.primary }), ...g.items.map(item)], { gap: 14, name: g.title }));
  return sec("Daftar Harga", [intro(L, c, d), fxGrid(L, grid(groups, Math.min(2, groups.length), { gap: 48 })), ...(c.note ? [stack([P(L, c.note, { size: 13, color: mutedOf(L, d) })], { gap: 0 })] : [])], { bg: c.bg ?? L.bg, width: 1040 });
}

/** Tabel (Table Element gratis). */
export function table(L: LC, c: Intro & { columns: string[]; rows: string[][]; bg?: string; note?: string; name?: string }): BoxNode {
  const t = el(
    "table",
    { columns: c.columns.map((label, i) => ({ id: `col-${i}`, label })), rows: c.rows, headerBgColor: L.p.primary, headerTextColor: "#ffffff", stripeColor: L.alt, rowHoverColor: L.p.soft, borderRadius: Math.min(L.radius, 16), shadowEnabled: false, outerBorderColor: L.p.line, dividerColor: L.p.line },
    "Tabel",
  );
  const d = isDark(c.bg ?? L.bg);
  return sec(c.name ?? "Jadwal", [intro(L, c, d), stack([fxText(L, t), ...(c.note ? [P(L, c.note, { size: 13, color: mutedOf(L, d) })] : [])], { gap: 10, align: "stretch" })], { bg: c.bg ?? L.bg, width: 1040 });
}

/** Langkah horizontal dengan nomor raksasa. */
export function steps(L: LC, c: Intro & { items: [string, string][]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.alt;
  const d = isDark(bg);
  const cells = c.items.map(([t, x], i) => {
    const n = H(L, String(i + 1), "h2", { size: 72, color: L.p.primary });
    css(n, `-webkit-text-stroke: 2px ${L.p.primary}; -webkit-text-fill-color: transparent;`);
    return col([n, H(L, t, "h3", { size: 19, color: inkOf(L, d) }), P(L, x, { size: 15, color: mutedOf(L, d) })], { gap: 8, name: "Langkah" });
  });
  return sec("Langkah", [intro(L, c, d), fxGrid(L, grid(cells, c.items.length, { gap: 28 }))], { bg });
}

/** Kutipan editorial besar. */
export function pull(L: LC, c: { text: string; name: string; role: string; bg?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const q = H(L, c.text, "h2", { size: 40, weight: 600, color: inkOf(L, d) });
  css(q, `border-left: 6px solid ${L.p.primary}; padding-left: 28px;`);
  return sec("Kutipan", [stack([fxText(L, q), para(`${c.name} / ${c.role}`, { size: 14, weight: 700, color: d ? L.p.line : L.p.primaryDark, transform: "uppercase", spacing: 1 })], { gap: 18 })], { bg, padY: 96, width: 960 });
}

/** Strip foto asimetris dengan keterangan. */
export function strip(L: LC, c: Partial<Intro> & { images: [string, string][]; bg?: string }): BoxNode {
  const ratios = ["3 / 4", "4 / 3", "1 / 1", "3 / 4", "4 / 3"];
  const d = isDark(c.bg ?? L.bg);
  const cells = c.images.map(([src, cap], i) => col([fxPic(L, image(src, cap, { ratio: ratios[i % ratios.length], radius: L.radius })), para(cap, { size: 13, color: mutedOf(L, d) })], { gap: 8, name: "Foto" }));
  const widths = c.images.map((_, i) => (i % 2 ? "minmax(0, 1fr)" : "minmax(0, 1.3fr)")).join(" ");
  return sec("Strip Foto", [...(c.title ? [intro(L, c as Intro, d)] : []), grid(cells, widths, { gap: 16, align: "center" })], { bg: c.bg ?? L.bg });
}

/** Tanya jawab: judul kiri lekat, akordeon kanan. */
export function faq(L: LC, c: Intro & { items: [string, string][]; bg?: string; act?: Act }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const acc = el(
    "accordion",
    { items: c.items.map(([title, content]) => ({ title, content })), exclusive: true, firstOpen: true, widthMode: "full", itemGap: 10, borderColor: d ? "#ffffff2a" : L.p.line, borderRadius: Math.min(L.radius, 14), textColor: d ? "#ffffff" : L.p.ink, headerBgColor: d ? L.dark : "#ffffff", headerHoverBgColor: d ? "#ffffff10" : L.p.soft, openHeaderBgColor: d ? L.dark : "#ffffff", openTextColor: d ? L.p.line : L.p.primaryDark, contentColor: d ? L.onDark : L.p.muted, iconStyle: "chevron", iconColor: L.p.primary },
    "Tanya jawab",
  );
  const left = col([...(c.eyebrow ? [kicker(L, c.eyebrow, d)] : []), H(L, c.title, "h2", { size: 40, color: inkOf(L, d) }), ...(c.text ? [P(L, c.text, { color: mutedOf(L, d) })] : []), ...(c.act ? [btn(L, c.act[0], c.act[1], c.act[2] ?? "outline")] : [])], { gap: 12, name: "Judul" });
  return sec("Tanya Jawab", [grid([left, col([fxText(L, acc)], { name: "Pertanyaan" })], "minmax(0, 1fr) minmax(0, 1.5fr)", { gap: 48 })], { bg });
}

/** Formulir dengan panel info berwarna. */
export function form(L: LC, c: Intro & { info: [string, string][]; fields: Field[]; submit: string; note?: string; bg?: string; message?: string }): BoxNode {
  const info = col(
    [
      ...(c.eyebrow ? [kicker(L, c.eyebrow, true)] : []),
      H(L, c.title, "h2", { size: 34, color: "#ffffff" }),
      ...(c.text ? [P(L, c.text, { color: "#e5e7eb", size: 16 })] : []),
      ...c.info.map(([k, v]) => col([para(k, { size: 12, weight: 700, color: L.p.line, transform: "uppercase", spacing: 1 }), para(v, { size: 16, color: "#ffffff", weight: 600 })], { gap: 2, name: "Info" })),
    ],
    { gap: 16, name: "Panel info", card: { bg: L.p.primaryDark, radius: L.radius, padding: 36 } },
  );
  const msg = c.message
    ? [el("textarea", { label: c.message, name: "pesan", placeholder: "", rows: 4, maxLength: 0, required: false, helper: "", labelColor: L.p.ink, borderColor: L.p.line, focusColor: L.p.primary, radius: Math.min(L.radius, 12), resize: "vertical" }, c.message)]
    : [];
  const f = card(L, [...c.fields.map((x, i) => field(L, x, i)), ...msg, button(c.submit, L.p, { full: true, type: "submit" }), ...(c.note ? [P(L, c.note, { size: 13 })] : [])], { gap: 14, name: "Formulir", pad: 32 });
  return sec("Formulir", [grid([fxText(L, info), f], "minmax(0, 1fr) minmax(0, 1.2fr)", { gap: 28, align: "stretch" })], { bg: c.bg ?? L.alt });
}

/** Ajakan: "giant" (teks raksasa), "split" (dua kolom), "sticker" (kotak miring). */
export function cta(L: LC, c: { kind: "giant" | "split" | "sticker"; title: string; text?: string; acts: Act[]; bg?: string }): BoxNode {
  if (c.kind === "giant") {
    const bg = c.bg ?? L.p.primary;
    const d = isDark(bg);
    const t = fxText(L, H(L, c.title, "h2", { size: 80, color: d ? "#ffffff" : L.p.ink, align: "center" }));
    css(t, "& { line-height: 0.95; letter-spacing: -0.03em; }\n@media (max-width: 640px) {\n  & { font-size: 42px; }\n}");
    return sec("Ajakan", [stack([t, ...(c.text ? [P(L, c.text, { size: 18, align: "center", color: d ? "#f1f5f9" : L.p.muted })] : []), acts(L, c.acts, "center")], { gap: 20, align: "center" })], { bg, padY: 112, width: 1040 });
  }
  if (c.kind === "sticker") {
    const box = card(L, [H(L, c.title, "h2", { size: 40, align: "center" }), ...(c.text ? [P(L, c.text, { size: 17, align: "center" })] : []), acts(L, c.acts, "center")], { tone: "soft", pad: 48, gap: 16, align: "center", name: "Stiker" });
    css(box, "transform: rotate(-1.5deg);");
    return sec("Ajakan", [stack([fxText(L, box)], { gap: 0, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 96, width: 900 });
  }
  const bg = c.bg ?? L.dark;
  const d = isDark(bg);
  return sec(
    "Ajakan",
    [grid([col([H(L, c.title, "h2", { size: 40, color: inkOf(L, d) }), ...(c.text ? [P(L, c.text, { color: mutedOf(L, d), size: 17 })] : [])], { gap: 10, name: "Teks" }), col([acts(L, c.acts, "end")], { name: "Tombol", align: "end" })], "minmax(0, 1.6fr) minmax(0, 1fr)", { gap: 32, align: "center" })],
    { bg, padY: 72 },
  );
}

/** Profil orang. */
export function people(L: LC, c: Intro & { items: { name: string; role: string; photo: string; text?: string }[]; cols?: number; bg?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const cell = (m: { name: string; role: string; photo: string; text?: string }) =>
    card(L, [fxPic(L, image(m.photo, m.name, { ratio: "1 / 1", radius: Math.max(0, L.radius - 6) })), H(L, m.name, "h3", { size: 19, color: inkOf(L, d) }), para(m.role, { size: 13, weight: 700, color: d ? L.p.line : L.p.primary, transform: "uppercase", spacing: 1 }), ...(m.text ? [P(L, m.text, { size: 14, color: mutedOf(L, d) })] : [])], { dark: d, pad: 16, gap: 8, name: "Profil" });
  return sec("Profil", [intro(L, c, d), fxGrid(L, grid(c.items.map(cell), c.cols ?? Math.min(4, c.items.length), { gap: 20, align: "stretch" }))], { bg });
}

/** Linimasa (Timeline Element gratis). Item: "waktu | judul | teks". */
export function timelineC(L: LC, c: Intro & { items: string[]; bg?: string; image?: string; alt?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const t = el("timeline", { items: c.items, accentColor: L.p.primary, lineColor: d ? "#ffffff33" : L.p.line, dateColor: d ? L.p.line : L.p.primary, titleColor: inkOf(L, d), textColor: mutedOf(L, d), dotSize: 14 }, "Linimasa");
  const body = c.image
    ? grid([col([fxText(L, t)], { name: "Linimasa" }), col([fxPic(L, image(c.image, c.alt ?? c.title, { ratio: "3 / 4", radius: L.radius }))], { name: "Gambar" })], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 48, align: "center" })
    : stack([fxText(L, t)], { align: "stretch" });
  return sec("Linimasa", [intro(L, c, d), body], { bg, width: c.image ? 1120 : 900 });
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

/** Katalog (Product Card gratis). */
export function catalog(L: LC, c: Intro & { items: Listing[]; cols?: number; bg?: string; name?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const cards = c.items.map((o) => {
    const n = el(
      "product-card",
      {
        imageSrc: o.image,
        imageAlt: o.title,
        name: o.title,
        description: o.text,
        priceText: o.price,
        comparePriceText: o.compare ?? "",
        rating: o.rating ?? 4.8,
        showRating: o.rating !== undefined,
        ratingCount: o.reviews ?? "",
        badgeEnabled: !!o.badge,
        badgeText: o.badge ?? "",
        badgeBgColor: L.p.primary,
        badgeTextColor: "#ffffff",
        priceColor: L.p.primaryDark,
        ctaText: o.cta,
        ctaHref: o.href,
        ctaBgColor: L.p.primary,
        hoverBorderColor: L.p.soft,
        titleColor: L.p.ink,
      },
      o.title,
    );
    return col([fxPic(L, n)], { name: "Item" });
  });
  return sec(c.name ?? "Katalog", [intro(L, c, isDark(bg)), fxGrid(L, grid(cards, c.cols ?? 3, { gap: 22, align: "stretch" }))], { bg });
}

/** Ubin info kunci–nilai (alamat, jam, kontak). */
export function infoTiles(L: LC, items: [string, string][], o: { bg?: string } = {}): BoxNode {
  const bg = o.bg ?? L.bg;
  const d = isDark(bg);
  const cells = items.map(([k, v]) => card(L, [para(k, { size: 12, weight: 700, color: d ? L.p.line : L.p.primary, transform: "uppercase", spacing: 1 }), para(v, { size: 17, weight: 600, color: inkOf(L, d) })], { dark: d, pad: 22, gap: 4, name: "Info" }));
  return sec("Info", [fxGrid(L, grid(cells, items.length, { gap: 16, align: "stretch" }))], { bg, padY: 48 });
}

/** Tab konten (Tabs Element gratis). */
export function tabs(L: LC, c: Intro & { tabs: [string, string][]; bg?: string; variant?: "underline" | "pills" | "boxed" }): BoxNode {
  const bg = c.bg ?? L.bg;
  return sec(
    "Tab",
    [intro(L, c, isDark(bg)), stack([fxText(L, el("tabs", { tabs: c.tabs.map(([title, content]) => ({ title, content })), widthMode: "full", variant: c.variant ?? "pills", activeTextColor: L.p.primaryDark, indicatorColor: L.p.primary, activeBgColor: L.p.soft, panelFontSize: 16 }, "Tab"))], { align: "stretch" })],
    { bg, width: 960 },
  );
}

/** Langganan kabar (input + tombol). */
export function newsletter(L: LC, c: { title: string; text: string; ph: string; submit: string; bg?: string }): BoxNode {
  const bg = c.bg ?? L.p.soft;
  const d = isDark(bg);
  const inp = el("input", { labelText: "", text: c.ph, inputType: "email", hoverBorderColor: L.p.primary, hoverShadowColor: L.p.primary, borderRadius: Math.min(L.radius, 12) }, "Email");
  return sec(
    "Langganan",
    [grid([col([H(L, c.title, "h2", { size: 32, color: inkOf(L, d) }), P(L, c.text, { color: mutedOf(L, d) })], { gap: 8, name: "Teks" }), col([inp, button(c.submit, L.p, { full: true, type: "submit" })], { gap: 10, name: "Formulir" })], "minmax(0, 1.3fr) minmax(0, 1fr)", { gap: 32, align: "center" })],
    { bg, padY: 64 },
  );
}

/** Artikel/jurnal gaya majalah: satu besar + daftar. */
export function journal(L: LC, c: Intro & { items: { image: string; tag: string; title: string; text: string; date: string }[]; bg?: string; read: string; href: string }): BoxNode {
  const [first, ...rest] = c.items;
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const link = () => el("anchor", { text: `${c.read} ->`, href: c.href, underline: "hover", fontSize: 14, fontWeight: 700, textColor: d ? L.p.line : L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan");
  const big = col([fxPic(L, image(first.image, first.title, { ratio: "16 / 10", radius: L.radius })), kicker(L, `${first.tag} / ${first.date}`, d), H(L, first.title, "h3", { size: 28, color: inkOf(L, d) }), P(L, first.text, { color: mutedOf(L, d) }), link()], { gap: 10, name: "Utama" });
  const list = col(
    rest.map((x) => {
      const r = col([kicker(L, `${x.tag} / ${x.date}`, d), H(L, x.title, "h3", { size: 20, color: inkOf(L, d) }), P(L, x.text, { size: 14, color: mutedOf(L, d) })], { gap: 6, name: "Artikel" });
      return css(r, `border-top: 1px solid ${d ? "#ffffff2a" : L.p.line}; padding-top: 16px;`);
    }),
    { gap: 18, name: "Daftar" },
  );
  return sec("Jurnal", [intro(L, c, d), grid([big, list], "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 40 })], { bg });
}

/** Video (gratis). */
export function video(L: LC, c: Intro & { url: string; title: string; bg?: string }): BoxNode {
  const bg = c.bg ?? L.dark;
  return sec("Video", [intro(L, c, isDark(bg)), stack([fxPic(L, el("video", { source: "youtube", url: c.url, title: c.title, radius: L.radius, shadow: true }, "Video"))], { align: "stretch" })], { bg, width: 960 });
}

/** Label/chip kategori. */
export function chips(L: LC, c: Intro & { chips: string[]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const list = c.chips.map((t) => {
    const b = badge(t, d ? "#ffffff14" : "#ffffff", d ? "#ffffff" : L.p.ink, d ? "#ffffff33" : L.p.ink);
    return css(b, "font-size: 15px; padding: 10px 18px;");
  });
  return sec("Label", [intro(L, { ...c, align: "center" }, d), stack([inline(list, { gap: 10, justify: "center" })], { gap: 0, align: "stretch" })], { bg, padY: 72 });
}

/* ------------------------------ premium ---------------------------- */

/** Galeri Lightbox (Premium). */
export function lightbox(L: LC, c: Partial<Intro> & { images: [string, string][]; cols?: number; ratio?: "1 / 1" | "4 / 3" | "16 / 9" | "3 / 4"; bg?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const g = el("gallery-lightbox", { images: c.images.map(([src, cap]) => `${src} | ${cap}`), columns: c.cols ?? 3, gap: 14, radius: L.radius, ratio: c.ratio ?? "4 / 3", showCaptions: true, overlayColor: L.dark, captionColor: "#ffffff" }, "Galeri Lightbox");
  return sec("Galeri Lightbox", [...(c.title ? [intro(L, c as Intro, isDark(bg))] : []), stack([fxText(L, g)], { align: "stretch" })], { bg });
}

/** Sebelum–Sesudah (Premium). */
export function beforeAfter(L: LC, c: Intro & { before: string; after: string; labels: [string, string]; alt: string; bullets?: string[]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.alt;
  const d = isDark(bg);
  const ba = el("before-after", { before: c.before, after: c.after, beforeLabel: c.labels[0], afterLabel: c.labels[1], alt: c.alt, start: 50, ratio: "4 / 3", radius: L.radius, handleColor: "#ffffff", showLabels: true }, "Sebelum Sesudah");
  return sec("Sebelum Sesudah", [grid([col([...intro(L, c, d).children, ...(c.bullets ? [checks(L, c.bullets, d)] : [])], { gap: 12, name: "Teks" }), col([fxPic(L, ba)], { name: "Perbandingan" })], "minmax(0, 1fr) minmax(0, 1.3fr)", { gap: 48, align: "center" })], { bg });
}

/** Penawaran dengan Modal Popup (Premium). */
export function modalOffer(L: LC, c: { title: string; text: string; trigger: string; modalTitle: string; body: string; cta: [string, string]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.p.soft;
  const d = isDark(bg);
  const m = el(
    "modal-popup",
    { triggerText: c.trigger, title: c.modalTitle, body: c.body, ctaText: c.cta[0], ctaHref: c.cta[1], closeOnBackdrop: true, maxWidth: 480, triggerBg: L.p.primary, triggerColor: "#ffffff", panelBg: "#ffffff", textColor: L.p.ink, ctaBg: L.p.primary, ctaColor: "#ffffff", overlayColor: L.dark, radius: L.radius },
    "Modal Popup",
  );
  return sec("Penawaran Popup", [grid([col([H(L, c.title, "h2", { size: 34, color: inkOf(L, d) }), P(L, c.text, { color: mutedOf(L, d) })], { gap: 10, name: "Teks" }), col([fxText(L, m)], { name: "Popup", align: "end" })], "minmax(0, 1.6fr) minmax(0, 1fr)", { gap: 32, align: "center" })], { bg, padY: 64 });
}

/** Marquee Logo / kata berjalan (Premium). */
export function marquee(L: LC, c: { title: string; items: string[]; bg?: string }): BoxNode {
  const bg = c.bg ?? L.bg;
  const d = isDark(bg);
  const m = el("logo-marquee", { title: c.title, items: c.items, speed: 28, direction: "left", pauseOnHover: true, logoHeight: 32, gap: 56, grayscale: false, fade: true, textColor: d ? "#e2e8f0" : L.p.ink, bgColor: "transparent" }, "Marquee");
  return sec("Marquee", [stack([m], { align: "stretch" })], { bg, padY: 44 });
}
