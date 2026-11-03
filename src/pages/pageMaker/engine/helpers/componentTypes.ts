/* ================================================================== */
/* Model Component Maker — POHON node                                   */
/*                                                                    */
/* Sebuah komponen = satu pohon:                                       */
/*   - BoxNode     : kontainer layout (stack / baris / grid), bisa      */
/*                   berisi box lain → komposisi bersarang.             */
/*   - ElementNode : daun; salinan state sebuah elemen Element Maker.   */
/* Root selalu sebuah BoxNode.                                          */
/* ================================================================== */

import type { BgFields, BgKind } from "../../core/helpers/background";
import type { ElementEvent } from "./events";
import type { LibraryId, NodeLibs } from "./libraries";
import type { CssVar } from "../../core/helpers/cssVars";
import type { AdvancedProps } from "./advanced";
import type { NodeAnim } from "./motion";
import type { CollectionDef } from "../../helpers/collections";
import type { BindField, ItemOf, RelatedOf } from "../../helpers/itemPage";

export type NodeId = string;
export type RowWidth = "content" | "80" | "full" | "custom";

/** "block" = tata letak normal (display:block), dipakai section Page Maker. */
export type BoxLayout = "stack" | "row" | "grid" | "block";
export type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between";
export type ShadowPreset = "none" | "sm" | "md" | "lg";
/** full = 100% · auto = ikut aturan layout induk · fit = fit-content · fixed = px */
export type WidthMode = "full" | "auto" | "fit" | "fixed";

/** Penempatan sebuah node di dalam induknya (kosong = ikut default). */
export interface Place {
  /** Di baris flex: ambil sisa ruang (`flex: 1 1 …`). */
  grow?: boolean;
  /** Di baris flex: lebar dasar (px) sebelum tumbuh/menyusut. */
  basis?: number;
  /** Di grid: posisi awal & rentang kolom / baris (1 = pertama). */
  colStart?: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
  /** Di grid ber-area: nama `grid-area`. */
  area?: string;
  /** Posisi sendiri; arti sumbu mengikuti layout induk. */
  selfH?: Align;
  selfV?: Align;
}

/** Tag HTML semantik yang boleh dipakai sebuah kontainer. */
export const BOX_TAGS = ["div", "section", "header", "footer", "nav", "main", "aside", "article"] as const;
export type BoxTag = (typeof BOX_TAGS)[number];

/**
 * Pengaturan khusus SECTION (dipakai Page Maker). Box yang punya `section`
 * dirender sebagai pita selebar halaman; isinya dibatasi `contentWidth`
 * lewat padding (tanpa elemen pembungkus tambahan).
 */
export interface SectionProps {
  /** Lebar maksimum isi (px). 0 = selebar halaman. */
  contentWidth: number;
  padY: number;
  padX: number;
  /** Tinggi minimum (px). 0 = ikut isi. */
  minHeight: number;
  /** URL gambar latar (kosong = tanpa gambar). */
  bgImage: string;
  /** ID preset asal section (katalog section). Opsional; tidak memengaruhi tampilan. */
  presetId?: string;
  /** Tipe section ala Divi (tanpa tanda = reguler). Hanya penanda; tampilan diatur field lain. */
  sectionType?: SectionKind;
}

export type SectionKind = "regular" | "specialty" | "fullwidth";

interface BaseNode {
  id: NodeId;
  /** Nama tampilan di pohon struktur. */
  name: string;
  place: Place;
  /** Pengaturan lanjutan: CSS ID, class, Custom CSS & JS (gratis). */
  advanced?: AdvancedProps;
  /** Efek library CDN (AOS, Animate.css, Vanilla Tilt) untuk node ini. */
  libs?: NodeLibs;
  /** v9: animasi CSS tanpa library (panel Styling → Animasi). */
  anim?: NodeAnim;
  /** Uji coba CRUD: kategori item (kartu koleksi) → atribut data-category untuk chip filter. */
  itemCategory?: string;
}

export interface BoxNode extends BaseNode {
  kind: "box";
  /** Hanya root: library CDN yang dipasang ke desain (menu Library). */
  libraries?: LibraryId[];
  /** v7, hanya root: salinan variabel global yang dirujuk desain (lihat cssVars.ts). */
  vars?: CssVar[];
  layout: BoxLayout;
  gap: number;
  padding: number;
  /** Baris: boleh turun baris. */
  wrap: boolean;
  /** Grid: nilai `grid-template-columns`. */
  columns: string;
  /** Grid: nilai `grid-template-areas` (opsional). */
  areas: string;
  /** Sumbu silang (stack: horizontal, baris: vertikal, grid: vertikal). */
  align: Align;
  /** Sumbu utama (baris: justify-content, grid: justify-items, stack: tidak dipakai). */
  justify: Justify | "stretch";
  /** Di layar kecil: baris → kolom, grid → satu kolom. */
  stackOnMobile: boolean;

  bgEnabled: boolean;
  bgColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  shadow: ShadowPreset;

  widthMode: WidthMode;
  width: number;

  /**
   * Background lengkap (opsional; data lama memakai bgEnabled/bgColor dan
   * section.bgImage — lihat `boxBackground`).
   */
  bgType?: BgKind;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  gradientKind?: BgFields["gradientKind"];
  gradientVia?: string;
  bgImage?: string;
  bgSize?: BgFields["bgSize"];
  bgPosition?: BgFields["bgPosition"];
  bgRepeat?: BgFields["bgRepeat"];
  bgAttachment?: BgFields["bgAttachment"];
  bgOverlayColor?: string;
  bgOverlayOpacity?: number;

  /** Tag HTML (kosong = div). */
  tag?: BoxTag;
  /** Ada = box ini sebuah section Page Maker. */
  section?: SectionProps;
  /** Ada (true) = box ini sebuah ROW Page Maker (Section → Row → Element). */
  row?: boolean;
  /**
   * Lebar Row di dalam section:
   *  content = ikut "lebar isi" section (bawaan, mis. 1120px di tengah)
   *  80 = 80% · full = 100% selebar section · custom = rowCustomWidth + unit
   */
  rowWidth?: RowWidth;
  /**
   * Ada (true) = ROW DALAM di kolom spesial section Spesialisasi (ala Divi).
   * Secara struktur hanya grup grid (Row tidak boleh bersarang), tapi di
   * editor diperlakukan seperti Row: (+) di bawahnya menambah Row dalam baru
   * dengan pilihan struktur kolom, dan salinannya tepat di bawahnya.
   */
  innerRow?: boolean;
  rowCustomWidth?: number;
  rowCustomUnit?: "px" | "%";

  /**
   * Grid di HP (bila `stackOnMobile`): kosong = satu kolom, "two" = dua
   * kolom (mis. angka statistik), "scroll" = baris geser (scroll-snap).
   */
  mobileGrid?: "two" | "scroll";
  /** Grid di desktop: kartu selang-seling diturunkan sedikit (tidak sejajar kaku). */
  stagger?: boolean;
  /** Kotak terangkat halus + bayangan saat di-hover. */
  hoverLift?: boolean;
  /** Uji coba CRUD: box ini koleksi data; kartu anaknya disusun dari `collection.items`. */
  collection?: CollectionDef;
  /** Uji coba halaman item: box ini menampilkan SATU item koleksi (halaman detail). */
  itemOf?: ItemOf;
  /** Uji coba halaman item: kartu "Mungkin Anda suka" dari koleksi lain (label sama). */
  related?: RelatedOf;
  /** Uji coba CRUD: grup chip filter kategori untuk koleksi (slug) ini. */
  filterOf?: string;

  children: ComponentNode[];
}

export interface ElementNode extends BaseNode {
  kind: "element";
  elementType: string;
  /** Salinan state elemen milik node ini (selalu lengkap, sudah di-merge dengan default). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  /**
   * Asal dari desain tersimpan di Element Maker.
   *  - tidak `detached`: state yang dipakai = versi terbaru desain itu.
   *  - `detached`: pengguna mengubah elemen di sini → pakai salinan (`state`),
   *    desain asal tetap diingat supaya bisa disinkronkan lagi.
   * Kalau desainnya sudah dihapus, node memakai `state` terakhir.
   */
  link?: { designId: string; detached?: boolean };
  /** Event JavaScript (Page Maker). */
  events?: ElementEvent[];
  /** Uji coba halaman item: isi elemen ini diambil dari kolom item. */
  bind?: BindField;
  /** Nilai kolom terikat kosong → elemen disembunyikan. */
  bindEmpty?: boolean;
  /** Chip filter kategori: nilai kategori ("" = Semua). Hanya di dalam box `filterOf`. */
  chip?: string;
}

export type ComponentNode = BoxNode | ElementNode;

/** Asal desain (mis. dibuat dari template katalog). Menentukan akses item bawaan template. */
export interface DocSource {
  templateId: string;
  version?: number;
}

/** State yang disimpan lewat "Desain Saya". */
export interface ComponentDoc {
  version: 2;
  root: BoxNode;
  /** Hanya pada desain halaman yang dibuat dari template. */
  source?: DocSource;
}

export const DEFAULT_CLASS_NAME = "custom-component";
export const ROOT_ID: NodeId = "root";

export const SHADOW_CSS: Record<Exclude<ShadowPreset, "none">, string> = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
  md: "0 4px 12px rgba(0, 0, 0, 0.12)",
  lg: "0 12px 32px rgba(0, 0, 0, 0.18)",
};

export function isBox(n: ComponentNode): n is BoxNode {
  return n.kind === "box";
}
export function isElement(n: ComponentNode): n is ElementNode {
  return n.kind === "element";
}

/** Field background efektif sebuah kontainer (termasuk data lama). */
export function boxBackground(b: BoxNode): Partial<BgFields> & { bgType: BgKind } {
  const legacyImage = b.section?.bgImage ?? "";
  const bgType: BgKind = b.bgType ?? (legacyImage ? "image" : b.bgEnabled ? "solid" : "none");
  return {
    bgType,
    bgColor: b.bgColor,
    gradientFrom: b.gradientFrom ?? "#2563eb",
    gradientTo: b.gradientTo ?? "#7c3aed",
    gradientAngle: b.gradientAngle ?? 90,
    gradientKind: b.gradientKind,
    gradientVia: b.gradientVia,
    bgImage: b.bgImage || legacyImage,
    bgSize: b.bgSize,
    bgPosition: b.bgPosition,
    bgRepeat: b.bgRepeat,
    bgAttachment: b.bgAttachment,
    bgOverlayColor: b.bgOverlayColor,
    bgOverlayOpacity: b.bgOverlayOpacity,
  };
}
