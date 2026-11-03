import type { BoxNode, SectionKind, SectionProps } from "../engine/helpers/componentTypes";
import { createBox } from "../engine/helpers/tree";
import { createRow } from "./rowModel";

/* ================================================================== */
/* Tipe section ala Divi: Reguler · Spesialisasi · Lebar Penuh          */
/*                                                                    */
/*   Reguler      : section biasa (isi dibatasi lebar isi) + satu Row    */
/*                  dengan struktur kolom yang dipilih (20 pilihan).     */
/*   Spesialisasi : satu Row berkolom; satu kolom "spesial" berisi       */
/*                  beberapa baris dalam (grup grid) sehingga kolom      */
/*                  samping tetap setinggi section (pola sidebar).       */
/*   Lebar Penuh  : section tanpa batas lebar & tanpa padding, Row       */
/*                  selebar layar (untuk header, gambar, peta penuh).    */
/*                                                                    */
/* Semua struktur KOSONG (tanpa elemen contoh). Yang dibuat = persis     */
/* yang digambar thumbnail-nya (thumbnail dibangun dari data yang sama). */
/* ================================================================== */

export const SECTION_KINDS: SectionKind[] = ["regular", "specialty", "fullwidth"];

/** Tipe section (section lama/preset pustaka tanpa tanda = reguler). */
export const sectionKindOf = (sec: SectionProps | undefined): SectionKind => sec?.sectionType ?? "regular";

const SECTION_BASE: SectionProps = { contentWidth: 1120, padY: 64, padX: 24, minHeight: 0, bgImage: "" };

/* --------------------------- struktur kolom ------------------------- */

export interface ColumnLayout {
  /** id stabil (dipakai payload drag & varian Row). */
  id: string;
  /** Perbandingan lebar kolom (fr). */
  fr: number[];
}

/** 20 struktur kolom Row (urutan & proporsi seperti panel "Sisipkan Baris" Divi). */
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

/** Label pecahan, mis. [1,2,1] → "1/4 + 1/2 + 1/4". */
export function fractionLabel(fr: number[]): string {
  const sum = fr.reduce((a, b) => a + b, 0);
  return fr
    .map((n) => {
      const g = gcd(n, sum);
      return `${n / g}/${sum / g}`;
    })
    .join(" + ");
}

/** grid-template-columns dari perbandingan fr. */
const frTemplate = (fr: number[]) =>
  fr.every((n) => n === fr[0]) ? `repeat(${fr.length}, minmax(0, 1fr))` : fr.map((n) => `minmax(0, ${n}fr)`).join(" ");

/** Sel kolom kosong. */
const columnCell = (name: string, patch: Partial<BoxNode> = {}): BoxNode =>
  createBox("stack", { name, gap: 12, widthMode: "auto", stackOnMobile: false, align: "start", ...patch });

/** Row kosong dengan struktur kolom tertentu (1 kolom = Row itu sendiri yang menampung isi). */
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

/** Section Reguler kosong dengan satu Row berstruktur kolom pilihan. */
export function createRegularSection(layoutId: string): BoxNode | null {
  const row = createColumnRow(layoutId);
  return row ? sectionBox("Section", "regular", {}, [row]) : null;
}

/* ---------------------------- spesialisasi -------------------------- */

export interface SpecialtyLayout {
  id: string;
  /** Kolom-kolom Row; `inner` = struktur baris dalam kolom spesial (fr per baris). */
  cols: { fr: number; inner?: number[][] }[];
}

/**
 * Kolom spesial berisi dua baris dalam: satu kolom penuh, lalu beberapa
 * kolom (jumlahnya menyesuaikan lebar kolom spesial, seperti di Divi).
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

/** Label, mis. "1/4 + 3/4 ★" (★ = kolom spesial). */
export function specialtyLabel(l: SpecialtyLayout): string {
  const parts = fractionLabel(l.cols.map((c) => c.fr)).split(" + ");
  return parts.map((p, i) => (l.cols[i].inner ? `${p} ★` : p)).join(" + ");
}

/**
 * Row dalam kolom spesial: grup grid biasa bertanda `innerRow` (bukan Row —
 * Row tidak boleh bersarang). 1 kolom = grup tumpuk yang langsung diisi modul.
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

/** Section Spesialisasi kosong. */
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

/* ---------------------------- lebar penuh --------------------------- */

/** Section Lebar Penuh kosong: tanpa batas lebar & padding, Row selebar layar. */
export function createFullwidthSection(): BoxNode {
  const row = createRow({ name: "Row Lebar Penuh", padding: 0, rowWidth: "full" });
  return sectionBox("Section Lebar Penuh", "fullwidth", { contentWidth: 0, padY: 0, padX: 0 }, [row]);
}
