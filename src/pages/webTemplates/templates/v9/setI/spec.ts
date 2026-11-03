import type { B, BlockId, GPage, GSpec } from "../../v6/setG/spec";

/* ================================================================== */
/* Spesifikasi template v9 bagian I: PREMIUM 3D & ANIMASI               */
/*                                                                    */
/* Ditulis seperti set G (data murni: Look, susunan blok, isi bisnis    */
/* dwibahasa) dan dibangun dengan mesin set G, ditambah:                 */
/*  - hero & section 3D (elemen Premium Three.js / kartu tilt),          */
/*  - animasi CSS per node (tanpa library) sesuai gaya `motion`.         */
/* Semua template set I Premium, 60–300 kredit sesuai kompleksitas.      */
/* ================================================================== */

export type { B };

/** Hero dengan elemen 3D. */
export type Hero3D =
  | "h3-globe" // teks + globe 3D di latar gradien gelap
  | "h3-product" // produk 3D berputar + chip angka
  | "h3-shape" // bentuk geometris 3D + daftar poin
  | "h3-particles" // judul di atas latar partikel 3D selebar layar
  | "h3-cards"; // judul tengah + tiga kartu 3D tilt

/** Section dengan elemen 3D. */
export type Block3D =
  | "x-globe" // globe + angka jangkauan
  | "x-product" // produk 3D + spesifikasi
  | "x-shape" // daftar fitur + bentuk 3D
  | "x-tilt" // tiga kartu 3D tilt
  | "x-particles"; // ajakan di atas latar partikel

export type IBlockId = BlockId | Block3D;
export type IBlockRef = IBlockId | [IBlockId, B?, B?];

export interface IPage extends Omit<GPage, "blocks"> {
  blocks: IBlockRef[];
}

/** Pengaturan elemen 3D yang dipakai template (warna diambil dari palet). */
export interface Three {
  product?: { model: "bottle" | "can" | "jar" | "cup"; finish: "glossy" | "matte" | "metal"; color?: string; accent?: string };
  shape?: { shape: "torusKnot" | "icosahedron" | "torus" | "octahedron" | "dodecahedron"; material: "metal" | "glass" | "matte" | "wire"; outline?: boolean };
  /** Penanda "Nama, lintang, bujur". */
  globe?: { markers: string[]; arcs?: boolean; startLon?: number };
  particles?: { shape: "wave" | "galaxy" | "sphere"; density?: "low" | "normal" | "high"; accent?: string };
}

/** Gaya animasi masuk: tenang, hidup, atau tegas. */
export type Motion = "calm" | "lively" | "bold";

export interface ISpec extends Omit<GSpec, "hero" | "home" | "pages" | "tier"> {
  tier: "premium";
  hero: GSpec["hero"] | Hero3D;
  home: IBlockRef[];
  pages: IPage[];
  three: Three;
  motion: Motion;
  /** Sumber kartu 3D tilt: katalog `items` (bawaan bila ada) atau layanan `svc`. */
  tiltFrom?: "items" | "svc";
}
