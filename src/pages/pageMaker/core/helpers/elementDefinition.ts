import type { PanelSection } from "../ui/PanelStyling";
import type { Updater } from "../ui/fields";
import type { FrameworkSpec } from "./markup";
import type { SpecContext } from "./siteTypes";
import { renderIconMarkup, type GlobalIcon } from "../store/iconStore";
import type { LibraryId } from "../../engine/helpers/libraries";
import type { Framework } from "./generatorCss";
import type { GeneratedFile } from "../ui/CodeExportPanel";

/* ================================================================== */
/* Definisi elemen — SATU sumber kebenaran untuk setiap element maker  */
/*                                                                    */
/* Halaman Element Maker dan Component Maker sama-sama memakai objek   */
/* ini, jadi tampilan, kode export, dan panel styling sebuah elemen    */
/* dijamin identik di kedua tempat:                                    */
/*                                                                    */
/*   spec      → CSS + pohon markup (+ override kode interaktif)       */
/*   sections  → kategori panel styling (untuk <PanelStyling/>)        */
/*   defaults  → state awal; juga dasar untuk merge desain lama        */
/* ================================================================== */

export type ElementGroup = "Elemen" | "Form" | "Data" | "Navigasi" | "3D" | "Premium";

/** Cari markup SVG ikon dari pustaka ikon global (null = tidak ada ikon). */
export type IconLookup = (
  iconId: string | null,
  size: number,
  mode: "currentColor" | "original",
) => string | null;

/** Hasil render satu elemen: persis argumen `generateFrameworkFiles` tanpa `name`. */
export type ElementSpec = Omit<FrameworkSpec, "name">;

/** Ubah beberapa field state sekaligus. */
export type Patcher<S> = (patch: Partial<S>) => void;

export interface ElementDefinition<S> {
  /** Kunci penyimpanan desain (designStore) — sama dengan argumen useElementState. */
  type: string;
  label: string;
  group: ElementGroup;
  /** Nama komponen PascalCase untuk file hasil generate ("Button" → Button.jsx). */
  componentName: string;
  /** Nama class bawaan di Element Maker. */
  defaultClassName: string;
  defaults: S;
  /**
   * Class elemen paling luar di markup hasil `spec` (default: `cls` itu
   * sendiri). Component Maker memakainya untuk menaruh aturan penempatan
   * (grow, span, align-self) langsung pada elemen.
   */
  rootClass?: (cls: string) => string;
  spec: (s: S, cls: string, icons: IconLookup, ctx?: SpecContext) => ElementSpec;
  /**
   * CSS/JS milik pengguna yang ikut elemen ini (Code Element). CSS di-scope
   * ke class elemen, JS dijalankan lewat runtime Custom JS yang sama.
   */
  customCode?: (s: S) => { css?: string; js?: string };
  /**
   * Library CDN yang dibutuhkan elemen (mis. Chart → Chart.js). Dipasang
   * otomatis di <head>/akhir <body> hasil ekspor saat elemen dipakai.
   */
  libraries?: LibraryId[];
  /** Elemen eksklusif: butuh kredit untuk ditambahkan & diekspor. */
  premium?: boolean;
  /** v9: elemen 3D membaca variabel --owd-3d-* (Pengaturan Global → Animasi & 3D). */
  uses3dSettings?: boolean;
  /**
   * v9: berkas pendukung bersama (mis. runtime 3D) yang ikut di proyek
   * framework saat elemen dipakai. Nama berkas sama = ditulis sekali.
   */
  extraFiles?: (fw: Framework) => GeneratedFile[];
  sections: (s: S, update: Updater<S>, patch: Patcher<S>) => PanelSection[];
}

/** Hanya untuk pengecekan tipe saat mendefinisikan elemen. */
export function defineElement<S>(def: ElementDefinition<S>): ElementDefinition<S> {
  return def;
}

/** Daftar elemen heterogen: tipe state berbeda-beda, dipilih lewat `type`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyElementDefinition = ElementDefinition<any>;

export function makeIconLookup(icons: GlobalIcon[]): IconLookup {
  return (iconId, size, mode) => {
    if (!iconId) return null;
    const found = icons.find((i) => i.id === iconId);
    return found ? renderIconMarkup(found.svg, size, mode) : null;
  };
}
