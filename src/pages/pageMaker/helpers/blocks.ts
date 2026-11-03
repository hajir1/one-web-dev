import { ELEMENT_DEFINITION_BY_TYPE } from "../core/elementDefinitions";
import type { BoxNode, ElementNode, SectionProps } from "../engine/helpers/componentTypes";
import { createBox, createElementNode } from "../engine/helpers/tree";
import { createRow } from "./rowModel";

/* ================================================================== */
/* Blok penyusun pohon (dipakai preset section & template website)       */
/*                                                                    */
/* Template disusun dari struktur & elemen Page Maker yang SAMA dengan    */
/* yang dipakai pengguna (Section → Row → Elemen), jadi setiap halaman    */
/* hasil template bisa diedit penuh di Page Maker.                       */
/* ================================================================== */

/* eslint-disable @typescript-eslint/no-explicit-any */
type Patch = Record<string, any>;

/** Elemen dengan state default + patch. Melempar bila tipe/field tidak dikenal (ditangkap tes). */
export function el(type: string, patch: Patch = {}, name?: string): ElementNode {
  const def = ELEMENT_DEFINITION_BY_TYPE[type];
  if (!def) throw new Error(`Unknown element type: ${type}`);
  const defaults = structuredClone(def.defaults) as Patch;
  for (const k of Object.keys(patch)) {
    if (!(k in defaults)) throw new Error(`Unknown field "${k}" for element ${type}`);
  }
  return createElementNode(type, { ...defaults, ...patch }, name ?? def.label);
}

export interface Palette {
  ink: string;
  muted: string;
  primary: string;
  primaryDark: string;
  soft: string;
  line: string;
}

/* ------------------------------ teks ------------------------------- */

type TextOpts = { size?: number; weight?: number; color?: string; align?: "left" | "center" | "right"; full?: boolean; spacing?: number; transform?: "none" | "uppercase" };

export function heading(text: string, tag: "h1" | "h2" | "h3" | "h4", o: TextOpts = {}): ElementNode {
  const size = o.size ?? { h1: 44, h2: 32, h3: 22, h4: 18 }[tag];
  // Jarak baris rapat + ukuran lebih kecil di ponsel (Custom CSS gratis, bisa diedit di Page Maker).
  const big = size >= 28;
  const node = el(
    "text",
    {
      text,
      tag,
      fontSize: size,
      fontWeight: o.weight ?? (tag === "h1" || tag === "h2" ? 800 : 700),
      textColor: o.color ?? "#0f172a",
      textAlign: o.align ?? "left",
      widthMode: o.full === false ? "auto" : "full",
      letterSpacing: o.spacing ?? (tag === "h1" ? -1 : 0),
      textTransform: o.transform ?? "none",
    },
    tag.toUpperCase(),
  );
  node.advanced = {
    customCss: big
      ? `& { line-height: 1.15; }\n@media (max-width: 640px) {\n  & { font-size: ${Math.round(size * 0.72)}px; }\n}`
      : "line-height: 1.3;",
  };
  return node;
}

export function para(text: string, o: TextOpts = {}): ElementNode {
  const node = el(
    "text",
    {
      text,
      tag: "p",
      fontSize: o.size ?? 16,
      fontWeight: o.weight ?? 400,
      textColor: o.color ?? "#475569",
      textAlign: o.align ?? "left",
      widthMode: o.full === false ? "auto" : "full",
      letterSpacing: o.spacing ?? 0,
      textTransform: o.transform ?? "none",
    },
    "Paragraf",
  );
  node.advanced = { customCss: "line-height: 1.6;" };
  return node;
}

export const eyebrow = (text: string, color: string, align: TextOpts["align"] = "left") =>
  para(text, { size: 13, weight: 700, color, align, spacing: 1, transform: "uppercase" });

/* ------------------------------ aksi ------------------------------- */

type BtnKind = "primary" | "outline" | "light" | "dark";

/** Tautan bergaya tombol (Anchor) — CTA yang benar-benar menuju sebuah alamat. */
export function linkButton(text: string, href: string, kind: BtnKind, p: Palette, o: { full?: boolean } = {}): ElementNode {
  const styles: Record<BtnKind, Patch> = {
    primary: { bgColor: p.primary, textColor: "#ffffff", borderWidth: 0, borderStyle: "none", hoverBgColor: p.primaryDark, hoverTextColor: "#ffffff", hoverBorderColor: p.primaryDark },
    outline: { bgColor: "transparent", textColor: p.primary, borderWidth: 2, borderStyle: "solid", borderColor: p.primary, hoverBgColor: p.soft, hoverTextColor: p.primaryDark, hoverBorderColor: p.primaryDark },
    light: { bgColor: "#ffffff", textColor: p.primaryDark, borderWidth: 0, borderStyle: "none", hoverBgColor: p.soft, hoverTextColor: p.primaryDark, hoverBorderColor: p.soft },
    dark: { bgColor: "#0f172a", textColor: "#ffffff", borderWidth: 0, borderStyle: "none", hoverBgColor: "#1e293b", hoverTextColor: "#ffffff", hoverBorderColor: "#1e293b" },
  };
  return el(
    "anchor",
    {
      text,
      href,
      underline: "none",
      fontSize: 15,
      fontWeight: 600,
      textAlign: "center",
      paddingLinked: false,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 22,
      paddingRight: 22,
      borderRadius: 10,
      hoverEnabled: true,
      widthMode: o.full ? "full" : "auto",
      ...styles[kind],
    },
    "Tombol tautan",
  );
}

/** Tombol <button> (aksi di halaman, tanpa tujuan). */
export function button(text: string, p: Palette, o: { full?: boolean; type?: "button" | "submit" } = {}): ElementNode {
  return el(
    "button",
    {
      text,
      buttonType: o.type ?? "button",
      bgColor: p.primary,
      hoverBgColor: p.primaryDark,
      hoverTextColor: "#ffffff",
      hoverBorderColor: p.primaryDark,
      borderRadius: 10,
      paddingTop: 12,
      paddingBottom: 12,
      paddingLeft: 22,
      paddingRight: 22,
      fontSize: 15,
      widthMode: o.full ? "full" : "auto",
    },
    "Tombol",
  );
}

export const badge = (text: string, bg: string, color: string, border = bg) =>
  el("badge", { text, bgColor: bg, textColor: color, borderColor: border, fontSize: 12 }, "Badge");

/* ------------------------------ media ------------------------------ */

export function image(src: string, alt: string, o: { ratio?: string; radius?: number; shadow?: boolean } = {}): ElementNode {
  return el(
    "image",
    {
      srcUrl: src,
      altText: alt,
      widthMode: "full",
      heightMode: "aspect",
      aspectRatio: o.ratio ?? "4 / 3",
      borderRadius: o.radius ?? 16,
      shadowEnabled: o.shadow ?? false,
      hoverEnabled: false,
      hoverShadowEnabled: false,
    },
    "Gambar",
  );
}

/* --------------------------- struktur ------------------------------ */

const SECTION_BASE: SectionProps = { contentWidth: 1120, padY: 72, padX: 24, minHeight: 0, bgImage: "" };

export function section(name: string, rows: BoxNode[], o: { bg?: string; padY?: number; width?: number; tag?: "section" | "header" | "footer" | "nav"; gradient?: [string, string, number?] } = {}): BoxNode {
  const bg: Partial<BoxNode> = o.gradient
    ? { bgEnabled: true, bgType: "gradient", gradientFrom: o.gradient[0], gradientTo: o.gradient[1], gradientAngle: o.gradient[2] ?? 135, bgColor: o.gradient[0] }
    : o.bg
      ? { bgEnabled: true, bgColor: o.bg }
      : {};
  // Jarak antar-Row di dalam section (section bertata letak blok tidak memakai `gap`).
  rows.forEach((r, i) => {
    if (i < rows.length - 1 && !r.advanced) r.advanced = { customCss: "margin-bottom: 32px;" };
  });
  return createBox("block", {
    name,
    tag: o.tag ?? "section",
    gap: 0,
    padding: 0,
    widthMode: "full",
    align: "stretch",
    justify: "stretch",
    stackOnMobile: false,
    section: { ...SECTION_BASE, padY: o.padY ?? SECTION_BASE.padY, contentWidth: o.width ?? SECTION_BASE.contentWidth },
    children: rows,
    ...bg,
  });
}

/** Row satu kolom (isi ditumpuk). */
export function stack(children: (BoxNode | ElementNode)[], o: { gap?: number; align?: "start" | "center" | "end" | "stretch" } = {}): BoxNode {
  return createRow({ name: "Row", padding: 0, gap: o.gap ?? 16, align: o.align ?? "start", children });
}

/** Row grid N kolom (jadi satu kolom di layar kecil). */
export function grid(cells: BoxNode[], columns: number | string, o: { gap?: number; align?: "start" | "center" | "end" | "stretch" } = {}): BoxNode {
  return createRow({
    name: `Row ${typeof columns === "number" ? columns : ""} Kolom`.replace("  ", " "),
    padding: 0,
    layout: "grid",
    columns: typeof columns === "number" ? `repeat(${columns}, minmax(0, 1fr))` : columns,
    justify: "stretch",
    gap: o.gap ?? 24,
    align: o.align ?? "start",
    stackOnMobile: true,
    children: cells,
  });
}

/** Kelompok horizontal di dalam kolom (bukan Row): elemen berjajar, turun baris bila sempit. */
export function inline(children: (BoxNode | ElementNode)[], o: { gap?: number; justify?: "start" | "center" | "end" | "between" } = {}): BoxNode {
  return createBox("row", {
    name: "Grup sejajar",
    padding: 0,
    align: "center",
    justify: o.justify ?? "start",
    wrap: true,
    gap: o.gap ?? 12,
    stackOnMobile: false,
    widthMode: "full",
    children,
  });
}

/** Kolom/sel di dalam Row. */
export function col(children: (BoxNode | ElementNode)[], o: { gap?: number; align?: "start" | "center" | "end" | "stretch"; card?: { bg: string; border?: string; radius?: number; padding?: number }; name?: string; layout?: "stack" | "row"; width?: number; stackOnMobile?: boolean; wrap?: boolean } = {}): BoxNode {
  const card: Partial<BoxNode> = o.card
    ? { bgEnabled: true, bgColor: o.card.bg, borderWidth: o.card.border ? 1 : 0, borderColor: o.card.border ?? "#e5e7eb", borderRadius: o.card.radius ?? 16, padding: o.card.padding ?? 24 }
    : {};
  return createBox(o.layout ?? "stack", {
    name: o.name ?? "Kolom",
    gap: o.gap ?? 12,
    widthMode: o.width ? "fixed" : "auto",
    width: o.width ?? 320,
    stackOnMobile: o.stackOnMobile ?? o.layout === "row",
    align: o.align ?? (o.layout === "row" ? "center" : "start"),
    wrap: o.wrap ?? o.layout === "row",
    children,
    ...card,
  });
}
