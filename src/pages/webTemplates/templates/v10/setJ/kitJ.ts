import { asset } from "../../../assets";
import { col, el, grid, heading, inline, linkButton, para, section, stack, type Palette } from "../../../build";
import type { TemplateContent, TemplatePageDef, Tr } from "../../../types";
import { isBox, type BoxNode, type ComponentNode, type ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import type { LibraryId, ScrollEffect } from "../../../../pageMaker/engine/helpers/libraries";
import { TF } from "../../../../pageMaker/core/helpers/templateFonts";
import { createRow } from "../../../../pageMaker/helpers/rowModel";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import { menu, pageWith } from "../../pro/kit";
import { installLibs, tilt } from "../../v3/libs";
import { addCss } from "../../v3/setD/kitD";

/* ================================================================== */
/* Perangkat template v10 bagian J: 3D + efek scroll (OWD Scroll).       */
/*                                                                    */
/* Berbeda dari set G–I (blok data yang dipakai ulang), setiap template  */
/* set J menyusun beranda SENDIRI dari elemen dasar Page Maker, supaya   */
/* tata letak, tipografi, dan alur scroll tidak berulang antartemplate.  */
/* Kit ini hanya menyediakan bahan: teks berfont tema, tombol, section,  */
/* elemen 3D, formulir, header/footer polos, dan pemasang efek scroll.   */
/* Semua hasil tetap Section → Row → Elemen biasa (bisa diedit penuh).   */
/* ================================================================== */

export { addCss, col, el, grid, inline, stack, tilt };
export type { BoxNode, ElementNode };

/** Teks dwibahasa: [Indonesia, Inggris]. */
export type B = [string, string];

export interface LookJ {
  p: Palette;
  /** Latar halaman. */
  bg: string;
  head: string;
  body: string;
  /** Radius dasar (px). */
  r: number;
}

export function lookJ(o: { ink: string; muted: string; primary: string; primaryDark: string; soft: string; line: string; bg: string; head: string; body: string; r: number }): LookJ {
  if (!TF[o.head] || !TF[o.body]) throw new Error(`Unknown template font: ${o.head} / ${o.body}`);
  const { ink, muted, primary, primaryDark, soft, line } = o;
  return { p: { ink, muted, primary, primaryDark, soft, line }, bg: o.bg, head: TF[o.head], body: TF[o.body], r: o.r };
}

/** Konteks saat membangun halaman. */
export interface J {
  L: LookJ;
  t: (b: B) => string;
  tr: Tr;
  href: (key: string) => string;
  /** Gambar template (kunci aset v10j-<id>-<nama>). */
  img: (name: string) => string;
}

export const artKeyJ = (id: string, name: string) => `v10j-${id}-${name}`;

/* ------------------------------ teks ------------------------------- */

interface TxtO {
  size?: number;
  color?: string;
  weight?: number;
  align?: "left" | "center" | "right";
  spacing?: number;
  upper?: boolean;
  lh?: number;
  css?: string;
  /** Pakai font isi (bukan font judul) untuk judul. */
  bodyFont?: boolean;
  full?: boolean;
}

/** Judul berfont tema. Ukuran di HP mengecil otomatis (heading()). */
export function H(L: LookJ, text: string, tag: "h1" | "h2" | "h3" | "h4", o: TxtO = {}): ElementNode {
  const n = heading(text, tag, { size: o.size, color: o.color ?? L.p.ink, weight: o.weight, align: o.align, spacing: o.spacing, transform: o.upper ? "uppercase" : "none", full: o.full });
  addCss(n, `font-family: ${o.bodyFont ? L.body : L.head};${o.lh ? ` line-height: ${o.lh};` : ""}`);
  if (o.css) addCss(n, o.css);
  return n;
}

/** Paragraf. */
export function Tx(L: LookJ, text: string, o: TxtO = {}): ElementNode {
  const n = para(text, { size: o.size, color: o.color ?? L.p.muted, weight: o.weight, align: o.align, spacing: o.spacing, transform: o.upper ? "uppercase" : "none", full: o.full });
  if (o.lh) addCss(n, `line-height: ${o.lh};`);
  if (o.css) addCss(n, o.css);
  return n;
}

/** Label kecil berhuruf kapital (kode, nomor, kategori). */
export const Lbl = (L: LookJ, text: string, color?: string, o: TxtO = {}) => Tx(L, text, { size: 12, weight: 600, spacing: 1.5, upper: true, color: color ?? L.p.primary, ...o });

/* ------------------------------ aksi ------------------------------- */

export interface BtnO {
  bg?: string;
  fg?: string;
  border?: string;
  radius?: number;
  hoverBg?: string;
  hoverFg?: string;
  css?: string;
  full?: boolean;
}

/** Tautan bergaya tombol dengan warna bebas (bukan gaya bawaan). */
export function btn(L: LookJ, label: string, href: string, o: BtnO = {}): ElementNode {
  const b = linkButton(label, href, "primary", L.p, { full: o.full });
  const bg = o.bg ?? L.p.primary;
  const fg = o.fg ?? "#ffffff";
  b.state = {
    ...b.state,
    bgColor: bg,
    textColor: fg,
    borderWidth: o.border ? 2 : 0,
    borderStyle: o.border ? "solid" : "none",
    borderColor: o.border ?? bg,
    hoverBgColor: o.hoverBg ?? (bg === "transparent" ? (o.border ?? L.p.ink) : L.p.primaryDark),
    hoverTextColor: o.hoverFg ?? (bg === "transparent" ? L.bg : "#ffffff"),
    hoverBorderColor: o.hoverBg ?? o.border ?? L.p.primaryDark,
    borderRadius: o.radius ?? L.r,
  };
  addCss(b, `font-family: ${L.body};`);
  if (o.css) addCss(b, o.css);
  return b;
}

/* ---------------------------- struktur ----------------------------- */

export interface SecO {
  bg?: string;
  padY?: number;
  width?: number;
  css?: string;
  tag?: "section" | "header" | "footer";
  padX?: number;
}

/** Section; elemen lepas di `rows` otomatis dibungkus Row. */
export function sec(name: string, rows: (BoxNode | ElementNode)[], o: SecO = {}): BoxNode {
  const s = section(name, rows.map((r) => (isBox(r) && r.row ? r : stack([r], { gap: 0, align: "stretch" }))), { bg: o.bg, padY: o.padY, width: o.width, tag: o.tag });
  // Hanya anak langsung section yang boleh berupa Row; grid/baris di dalamnya jadi box biasa
  // (tata letak grid/baris dan perilaku HP tetap sama).
  const demote = (n: BoxNode | ElementNode) => {
    if (!isBox(n)) return;
    for (const c of n.children) {
      if (isBox(c) && c.row) {
        c.row = false;
        if (/^Row( \d+)? Kolom$|^Row$/.test(c.name)) c.name = c.layout === "grid" ? "Grid" : "Baris";
      }
      demote(c);
    }
  };
  s.children.forEach(demote);
  if (o.padX !== undefined) s.section = { ...s.section!, padX: o.padX };
  if (o.css) addCss(s, o.css);
  return s;
}

/** Row berjajar (baris) dengan anak lebar tetap; di HP bertumpuk. */
export function line(kids: (BoxNode | ElementNode)[], o: { gap?: number; align?: "start" | "center" | "end" | "stretch"; justify?: "start" | "center" | "end" | "between"; name?: string; wrap?: boolean; stack?: boolean } = {}): BoxNode {
  return createRow({ name: o.name ?? "Row", padding: 0, layout: "row", gap: o.gap ?? 24, align: o.align ?? "start", justify: o.justify ?? "start", wrap: o.wrap ?? false, stackOnMobile: o.stack ?? true, children: kids });
}

/** Kolom dengan CSS tambahan. */
/** Kolom dengan CSS tambahan. `bg` = latar (dipakai juga oleh perbaikan kontras otomatis; jangan taruh latar di `css`). */
export function box(kids: (BoxNode | ElementNode)[], o: { gap?: number; name?: string; css?: string; bg?: string; align?: "start" | "center" | "end" | "stretch"; width?: number; row?: boolean; wrap?: boolean; stackOnMobile?: boolean } = {}): BoxNode {
  const c = col(kids, { gap: o.gap ?? 12, name: o.name, align: o.align ?? "stretch", width: o.width, layout: o.row ? "row" : "stack", wrap: o.wrap, stackOnMobile: o.stackOnMobile });
  if (o.bg) Object.assign(c, { bgEnabled: true, bgColor: o.bg });
  if (o.css) addCss(c, o.css);
  return c;
}

/* --------------------------- efek scroll --------------------------- */

/** Pasang efek OWD Scroll pada node (bisa diubah di Pengaturan → Library). */
export function fx<T extends ComponentNode>(n: T, effect: ScrollEffect, amount = 0, delay = 0): T {
  n.libs = { ...n.libs, scroll: { effect, amount, delay } };
  return n;
}

/* ------------------------------ media ------------------------------ */

export function pic(src: string, alt: string, o: { ratio?: string; radius?: number; css?: string } = {}): ElementNode {
  const n = el("image", { srcUrl: src, altText: alt, widthMode: "full", heightMode: "aspect", aspectRatio: o.ratio ?? "4 / 3", borderRadius: o.radius ?? 0, shadowEnabled: false, hoverEnabled: false, hoverShadowEnabled: false }, "Gambar");
  if (o.css) addCss(n, o.css);
  return n;
}

type Tri = "on" | "off" | "global";
interface ThreeO {
  h: number;
  mh: number;
  alt: string;
  spin?: Tri;
  drag?: Tri;
  bg?: string;
  radius?: number;
}
const common = (o: ThreeO) => ({ height: o.h, mobileHeight: o.mh, alt: o.alt, autoRotate: o.spin ?? "on", interactive: o.drag ?? "on", background: o.bg ?? "transparent", radius: o.radius ?? 0 });

export type ProductModel = "bottle" | "can" | "jar" | "cup" | "vase" | "lens" | "massing" | "kite";
export const product3 = (o: ThreeO & { model: ProductModel; finish: "glossy" | "matte" | "metal"; color: string; accent: string }) =>
  el("three-product", { ...common(o), model: o.model, finish: o.finish, color: o.color, accent: o.accent }, "Produk 3D");

export const shape3 = (o: ThreeO & { shape: "torusKnot" | "icosahedron" | "torus" | "octahedron" | "dodecahedron"; material: "metal" | "glass" | "matte" | "wire"; color: string; accent: string; outline?: boolean }) =>
  el("three-shape", { ...common(o), shape: o.shape, material: o.material, color: o.color, accent: o.accent, outline: !!o.outline }, "Bentuk 3D");

export const globe3 = (o: ThreeO & { color: string; ocean: string; glow: string; marker: string; markers: string[]; startLon?: number }) =>
  el("three-globe", { ...common(o), color: o.color, ocean: o.ocean, glow: o.glow, marker: o.marker, markers: o.markers, arcs: true, startLon: o.startLon ?? 110 }, "Globe 3D");

export const particles3 = (o: ThreeO & { shape: "wave" | "galaxy" | "sphere"; color: string; accent: string; density?: "low" | "normal" | "high"; glow?: boolean; size?: number }) =>
  el("three-particles", { ...common(o), shape: o.shape, color: o.color, accent: o.accent, density: o.density ?? "normal", glow: o.glow ?? false, size: o.size ?? 3, background: o.bg ?? "transparent" }, "Partikel 3D");

/* ------------------------------ daftar ----------------------------- */

export const list = (items: string[], color: string, o: { size?: number; gap?: number } = {}) =>
  el(
    "list",
    { items, listStyleType: "none", bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, textColor: color, dividerEnabled: false, itemHoverEnabled: false, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemPaddingX: 0, itemPaddingY: o.gap ?? 4, fontSize: o.size ?? 15 },
    "Daftar",
  );

/* ----------------------------- formulir ---------------------------- */

export type FieldJ = { kind: "input"; label: string; ph: string; type?: string } | { kind: "select"; label: string; ph: string; options: string[] } | { kind: "date"; label: string };

export function field(L: LookJ, f: FieldJ, i: number, radius = L.r, labelColor?: string): ElementNode {
  const n = fieldEl(L, f, i, radius, labelColor);
  // Label input/select memakai warna teks isian; di formulir berlatar gelap labelnya diberi warna sendiri.
  if (labelColor && f.kind !== "date") addCss(n, `& label { color: ${labelColor} !important; }`);
  return n;
}

function fieldEl(L: LookJ, f: FieldJ, i: number, radius: number, labelColor?: string): ElementNode {
  if (f.kind === "select") return el("select", { labelText: f.label, placeholder: f.ph, options: f.options, widthMode: "full", focusBorderColor: L.p.primary, focusRingColor: L.p.primary, borderRadius: radius }, f.label);
  if (f.kind === "date") return el("datepicker", { label: f.label, name: `tanggal-${i}`, mode: "date", helper: "", focusColor: L.p.primary, radius, required: false, ...(labelColor ? { labelColor } : {}) }, f.label);
  return el("input", { labelText: f.label, text: f.ph, inputType: f.type ?? "text", hoverBorderColor: L.p.primary, hoverShadowColor: L.p.primary, borderRadius: radius }, f.label);
}

/** Formulir (tanpa server) dengan tombol kirim. */
export function form(L: LookJ, fields: FieldJ[], submit: string, o: { css?: string; bg?: string; btn?: BtnO; radius?: number; note?: string; noteColor?: string; labelColor?: string } = {}): BoxNode {
  const send = el("button", { text: submit, buttonType: "submit", bgColor: o.btn?.bg ?? L.p.primary, textColor: o.btn?.fg ?? "#ffffff", hoverBgColor: o.btn?.hoverBg ?? L.p.primaryDark, hoverTextColor: "#ffffff", hoverBorderColor: L.p.primaryDark, borderRadius: o.btn?.radius ?? L.r, paddingTop: 13, paddingBottom: 13, paddingLeft: 22, paddingRight: 22, fontSize: 15, widthMode: "full" }, "Tombol kirim");
  const kids: ElementNode[] = [...fields.map((f, i) => field(L, f, i, o.radius ?? L.r, o.labelColor)), send];
  if (o.note) kids.push(Tx(L, o.note, { size: 13, color: o.noteColor }));
  const c = box(kids, { gap: 14, name: "Formulir", bg: o.bg });
  if (o.css) addCss(c, o.css);
  return c;
}

/* ------------------------- header & footer ------------------------- */

export interface HeadO {
  bg: string;
  ink: string;
  menuInk?: string;
  hover?: string;
  cta?: [string, string];
  btn?: BtnO;
  css?: string;
  /** Teks kecil di samping logo (mis. kode lembar). */
  tag?: string;
  logoSize?: number;
  upper?: boolean;
  sticky?: boolean;
}

export function header(L: LookJ, brand: string, o: HeadO): BoxNode {
  const logo = H(L, brand, "h4", { size: o.logoSize ?? 22, color: o.ink, full: false, upper: o.upper, spacing: o.upper ? 1 : 0 });
  const left = o.tag ? box([logo, Tx(L, o.tag, { size: 11, color: o.menuInk ?? o.ink, spacing: 1, upper: true, full: false })], { gap: 2, name: "Logo", align: "start" }) : logo;
  const nav = menu({ ...L.p, primary: o.hover ?? L.p.primary }, o.menuInk ?? o.ink, { gap: 26 });
  nav.state = { ...nav.state, activeColor: o.hover ?? L.p.primary };
  addCss(nav, `font-family: ${L.body};`);
  // Di HP tombol CTA header disembunyikan (menu hamburger sudah memuat semua halaman) agar header tidak melebar.
  const right = [nav, ...(o.cta ? [btn(L, o.cta[0], o.cta[1], { ...o.btn, css: "& { white-space: nowrap; }\n@media (max-width: 640px) { & { display: none; } }" })] : [])];
  const row = createRow({ name: "Row Header", padding: 0, layout: "row", align: "center", justify: "between", wrap: false, gap: 16, stackOnMobile: false, children: [left, col(right, { layout: "row", gap: 18, name: "Navigasi", stackOnMobile: false, wrap: false })] });
  const s = sec("Header", [row], { bg: o.bg, padY: 18, tag: "header", css: o.css });
  if (o.sticky) addCss(s, "position: sticky; top: 0; z-index: 40;");
  return s;
}

export interface FootO {
  bg: string;
  ink: string;
  muted: string;
  about: string;
  cols: { title: string; items: string[] }[];
  copy: string;
  css?: string;
  /** Kalimat besar di atas kolom (penutup). */
  big?: string;
  bigSize?: number;
}

export function footer(L: LookJ, brand: string, o: FootO): BoxNode {
  const rows: BoxNode[] = [];
  if (o.big) rows.push(stack([H(L, o.big, "h2", { size: o.bigSize ?? 56, color: o.ink, lh: 1, css: "max-width: 18ch;" })], { gap: 0, align: "stretch" }));
  const cols = o.cols.map((c) => box([Lbl(L, c.title, o.muted), list(c.items, o.ink, { size: 14 })], { gap: 8, name: c.title }));
  rows.push(grid([box([H(L, brand, "h4", { size: 20, color: o.ink }), Tx(L, o.about, { size: 14, color: o.muted })], { gap: 8, name: "Merek" }), ...cols], `minmax(0, 1.4fr) ${cols.map(() => "minmax(0, 1fr)").join(" ")}`, { gap: 32 }));
  rows.push(stack([Tx(L, o.copy, { size: 13, color: o.muted })], { gap: 0 }));
  return sec("Footer", rows, { bg: o.bg, padY: 56, tag: "footer", css: o.css });
}

/* ------------------------------ halaman ---------------------------- */

export const home = (id = "Beranda", en = "Home"): TemplatePageDef => ({ key: "home", slug: { id: "index", en: "index" }, name: { id, en }, home: true });
export const pg = (key: string, idv: [string, string], env: [string, string]): TemplatePageDef => ({ key, slug: { id: idv[0], en: env[0] }, name: { id: idv[1], en: env[1] } });

function walk(n: ComponentNode, f: (n: ComponentNode) => void): void {
  f(n);
  if (isBox(n)) n.children.forEach((c) => walk(c, f));
}

/** Halaman: font isi + latar, lalu pasang library yang dipakai node (scroll / tilt). */
export function pageJ(L: LookJ, sections: BoxNode[]): PageDoc {
  const doc = pageWith(sections, L.body, L.bg);
  const used = new Set<LibraryId>();
  sections.forEach((s) => walk(s, (n) => Object.keys(n.libs ?? {}).forEach((k) => used.add(k as LibraryId))));
  return used.size ? installLibs(doc, [...used]) : doc;
}

export interface SpecJ {
  id: string;
  brand: string;
  L: LookJ;
  pages: TemplatePageDef[];
  head: (j: J) => BoxNode;
  foot: (j: J) => BoxNode;
  build: Record<string, (j: J) => BoxNode[]>;
}

/** SpecJ → TemplateContent. */
export function contentJ(s: SpecJ): TemplateContent {
  return {
    brand: s.brand,
    pages: s.pages,
    build: (key, tr, href) => {
      const j: J = { L: s.L, tr, href, t: (b) => tr(b[0], b[1]), img: (name) => asset(artKeyJ(s.id, name)) };
      const f = s.build[key] ?? s.build.home;
      return pageJ(s.L, [s.head(j), ...f(j), s.foot(j)]);
    },
  };
}
