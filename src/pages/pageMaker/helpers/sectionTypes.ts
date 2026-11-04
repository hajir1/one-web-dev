import type { BoxNode, SectionKind, SectionProps } from "../engine/helpers/componentTypes";
import { createBox } from "../engine/helpers/tree";
import { createRow } from "./rowModel";

/* ================================================================== */
/* Divi-style section types: Regular · Specialty · Full Width           */
/*                                                                    */
/*   Regular      : a regular section (content limited to the content width) + one Row */
/*                  with the chosen column structure (20 options).      */
/*   Specialty : one columned Row; one "special" column holds            */
/*                  several inner rows (a grid group) so the side        */
/*                  column stays as tall as the section (sidebar pattern). */
/*   Full Width   : a section without width limits & padding, a Row     */
/*                  as wide as the screen (for headers, images, full maps). */
/*                                                                    */
/* Every structure is EMPTY (no sample elements). What gets created is exactly */
/* what its thumbnail draws (thumbnails are built from the same data).  */
/* ================================================================== */

export const SECTION_KINDS: SectionKind[] = ["regular", "specialty", "fullwidth"];

/** Section type (old sections/library presets without a marker = regular). */
export const sectionKindOf = (sec: SectionProps | undefined): SectionKind => sec?.sectionType ?? "regular";

const SECTION_BASE: SectionProps = { contentWidth: 1120, padY: 64, padX: 24, minHeight: 0, bgImage: "" };

/* --------------------------- column structure ------------------------- */

export interface ColumnLayout {
  /** Stable id (used by the drag payload & Row variants). */
  id: string;
  /** Column width ratio (fr). */
  fr: number[];
}

/** 20 Row column structures (order & proportions like Divi's "Insert Row" panel). */
export const COLUMN_LAYOUTS: ColumnLayout[] = [
  { id: "1", fr: [1] },
  { id: "2", fr: [1, 1] },
  { id: "3", fr: [1, 1, 1] },
  { id: "4", fr: [1, 1, 1, 1] },
  { id: "5", fr: [1, 1, 1, 1, 1] },
  { id: "6", fr: [1, 1, 1, 1, 1, 1] },
  { id: "2_5-3_5", fr: [2, 3] },
  { id: "3_5-2_5", fr: [3, 2] },
  { id: "1_3-2_3", fr: [1, 2] },
  { id: "2_3-1_3", fr: [2, 1] },
  { id: "1_4-3_4", fr: [1, 3] },
  { id: "3_4-1_4", fr: [3, 1] },
  { id: "1_4-1_2-1_4", fr: [1, 2, 1] },
  { id: "1_5-3_5-1_5", fr: [1, 3, 1] },
  { id: "1_4-1_4-1_2", fr: [1, 1, 2] },
  { id: "1_2-1_4-1_4", fr: [2, 1, 1] },
  { id: "1_5-1_5-3_5", fr: [1, 1, 3] },
  { id: "3_5-1_5-1_5", fr: [3, 1, 1] },
  { id: "1_6-1_6-1_6-1_2", fr: [1, 1, 1, 3] },
  { id: "1_2-1_6-1_6-1_6", fr: [3, 1, 1, 1] },
];

const COLUMN_LAYOUT_BY_ID: Record<string, ColumnLayout> = Object.fromEntries(COLUMN_LAYOUTS.map((l) => [l.id, l]));

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** Fraction label, e.g. [1,2,1] → "1/4 + 1/2 + 1/4". */
export function fractionLabel(fr: number[]): string {
  const sum = fr.reduce((a, b) => a + b, 0);
  return fr
    .map((n) => {
      const g = gcd(n, sum);
      return `${n / g}/${sum / g}`;
    })
    .join(" + ");
}

/** grid-template-columns from the fr ratio. */
const frTemplate = (fr: number[]) =>
  fr.every((n) => n === fr[0]) ? `repeat(${fr.length}, minmax(0, 1fr))` : fr.map((n) => `minmax(0, ${n}fr)`).join(" ");

/** Empty column cell. */
const columnCell = (name: string, patch: Partial<BoxNode> = {}): BoxNode =>
  createBox("stack", { name, gap: 12, widthMode: "auto", stackOnMobile: false, align: "start", ...patch });

/** An empty Row with a given column structure (1 column = the Row itself holds the content). */
export function createColumnRow(layoutId: string): BoxNode | null {
  const l = COLUMN_LAYOUT_BY_ID[layoutId];
  if (!l) return null;
  if (l.fr.length === 1) return createRow({ name: "Row" });
  return createRow({
    name: `Row ${fractionLabel(l.fr)}`,
    layout: "grid",
    columns: frTemplate(l.fr),
    justify: "stretch",
    gap: 24,
    stackOnMobile: true,
    children: l.fr.map((_, i) => columnCell(`Kolom ${i + 1}`)),
  });
}

function sectionBox(name: string, kind: SectionKind, sec: Partial<SectionProps>, rows: BoxNode[]): BoxNode {
  return createBox("block", {
    name,
    tag: "section",
    gap: 0,
    padding: 0,
    widthMode: "full",
    align: "stretch",
    justify: "stretch",
    stackOnMobile: false,
    section: { ...SECTION_BASE, ...sec, sectionType: kind },
    children: rows,
  });
}

/** An empty Regular section with one Row of the chosen column structure. */
export function createRegularSection(layoutId: string): BoxNode | null {
  const row = createColumnRow(layoutId);
  return row ? sectionBox("Section", "regular", {}, [row]) : null;
}

/* ---------------------------- spesialisasi -------------------------- */

export interface SpecialtyLayout {
  id: string;
  /** Row columns; `inner` = inner row structure of the special column (fr per row). */
  cols: { fr: number; inner?: number[][] }[];
}

/**
 * A special column containing two inner rows: one full column, then several
 * columns (their number adapts to the special column's width, as in Divi).
 */
const IN3 = [[1], [1, 1, 1]];
const IN2 = [[1], [1, 1]];

export const SPECIALTY_LAYOUTS: SpecialtyLayout[] = [
  { id: "1_4-3_4s", cols: [{ fr: 1 }, { fr: 3, inner: IN3 }] },
  { id: "3_4s-1_4", cols: [{ fr: 3, inner: IN3 }, { fr: 1 }] },
  { id: "1_3-2_3s", cols: [{ fr: 1 }, { fr: 2, inner: IN2 }] },
  { id: "2_3s-1_3", cols: [{ fr: 2, inner: IN2 }, { fr: 1 }] },
  { id: "1_2-1_2s", cols: [{ fr: 1 }, { fr: 1, inner: IN2 }] },
  { id: "1_2s-1_2", cols: [{ fr: 1, inner: IN2 }, { fr: 1 }] },
  { id: "1_4-1_4-1_2s", cols: [{ fr: 1 }, { fr: 1 }, { fr: 2, inner: IN2 }] },
  { id: "1_2s-1_4-1_4", cols: [{ fr: 2, inner: IN2 }, { fr: 1 }, { fr: 1 }] },
  { id: "1_4-1_2s-1_4", cols: [{ fr: 1 }, { fr: 2, inner: IN2 }, { fr: 1 }] },
];

const SPECIALTY_BY_ID: Record<string, SpecialtyLayout> = Object.fromEntries(SPECIALTY_LAYOUTS.map((l) => [l.id, l]));

/** Label, e.g. "1/4 + 3/4 ★" (★ = special column). */
export function specialtyLabel(l: SpecialtyLayout): string {
  const parts = fractionLabel(l.cols.map((c) => c.fr)).split(" + ");
  return parts.map((p, i) => (l.cols[i].inner ? `${p} ★` : p)).join(" + ");
}

/**
 * An inner Row in a special column: a regular grid group marked `innerRow` (not a Row;
 * Rows may not nest). 1 column = a stack group filled directly with modules.
 */
export function createInnerRow(fr: number[], n: number): BoxNode {
  if (fr.length <= 1) return columnCell(`Baris Dalam ${n}`, { widthMode: "full", align: "stretch", innerRow: true });
  return createBox("grid", {
    innerRow: true,
    name: `Baris Dalam ${n}`,
    columns: frTemplate(fr),
    justify: "stretch",
    gap: 20,
    stackOnMobile: true,
    widthMode: "full",
    children: fr.map((_, i) => columnCell(`Kolom ${i + 1}`)),
  });
}

/** Empty Specialty section. */
export function createSpecialtySection(layoutId: string): BoxNode | null {
  const l = SPECIALTY_BY_ID[layoutId];
  if (!l) return null;
  let side = 0;
  const cells = l.cols.map((c) =>
    c.inner
      ? columnCell("Kolom Spesial", { gap: 24, align: "stretch", children: c.inner.map((fr, i) => createInnerRow(fr, i + 1)) })
      : columnCell(`Kolom Samping${l.cols.filter((x) => !x.inner).length > 1 ? ` ${++side}` : ""}`),
  );
  const row = createRow({
    name: `Row ${specialtyLabel(l)}`,
    layout: "grid",
    columns: frTemplate(l.cols.map((c) => c.fr)),
    justify: "stretch",
    align: "stretch",
    gap: 32,
    stackOnMobile: true,
    children: cells,
  });
  return sectionBox("Section Spesialisasi", "specialty", {}, [row]);
}

/* ---------------------------- full width --------------------------- */

/** An empty Full Width section: no width limit & padding, a screen-wide Row. */
export function createFullwidthSection(): BoxNode {
  const row = createRow({ name: "Row Lebar Penuh", padding: 0, rowWidth: "full" });
  return sectionBox("Section Lebar Penuh", "fullwidth", { contentWidth: 0, padY: 0, padX: 0 }, [row]);
}
