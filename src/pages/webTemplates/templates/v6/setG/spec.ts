import type { TemplateCategory, TemplateTier } from "../../../../../config/templates";
import type { ChartC, Fx, Shape } from "../../v5/setF/kitF";
import type { Motif } from "./motifs";

/* ================================================================== */
/* Spesifikasi data template v6 bagian G                               */
/*                                                                    */
/* Setiap template ditulis sebagai data murni (GSpec): identitas, Look, */
/* susunan section beranda & halaman, dan isi bisnis dwibahasa. Mesin  */
/* di ./kitG.ts mengubahnya menjadi section Page Maker memakai kit      */
/* bersama (kitD/kitE/kitF), jadi hasilnya tetap bisa diedit penuh.     */
/* Template Free otomatis memakai padanan gratis setiap blok Premium.  */
/* ================================================================== */

/** Teks dwibahasa [id, en]. */
export type B = [string, string];

type HeroKind =
  | "full" // Header Lebar Penuh (gambar latar)
  | "split" // Layar terbagi
  | "bento"
  | "editorial"
  | "brutal"
  | "glass"
  | "type" // Tipografi raksasa + pita kata
  | "neon"
  | "poster"
  | "soft"
  | "collage"
  | "search"
  | "minimal"
  | "dash" // Panel grafik (butuh biz.chart)
  | "stacked"
  | "ticket";

/**
 * Blok section. Blok bertanda (P) memakai elemen Premium; di template Free
 * otomatis diganti padanan gratis (lihat FREE_SWAP di kitG).
 */
export type BlockId =
  | "svc" // kartu layanan
  | "svc-inv" // kartu layanan, latar kontras
  | "bento" // petak layanan beda ukuran
  | "special" // section Spesialisasi (sidebar + baris dalam)
  | "stats" // deret angka
  | "counter" // (P) statistik animasi
  | "kpi" // pita KPI
  | "zig" // langkah zigzag
  | "rail" // rel langkah
  | "quotes" // (P) kartu testimoni
  | "pull" // kutipan besar
  | "faq"
  | "tabs" // tab layanan
  | "plans" // (P) kartu harga
  | "switch" // (P) harga bulanan/tahunan
  | "compare" // (P) tabel perbandingan paket
  | "ptable" // tabel paket (gratis)
  | "items" // katalog produk bergambar
  | "menu" // kartu daftar item + harga (tanpa gambar)
  | "list" // indeks baris item
  | "gallery" // (P) galeri lightbox
  | "mosaic" // galeri mozaik
  | "polaroid"
  | "team"
  | "about" // panel terbagi (foto + teks)
  | "fsplit" // belah lebar penuh
  | "fimg" // gambar lebar penuh
  | "editorial" // kolom editorial nilai
  | "notes" // catatan tempel nilai
  | "swatch" // swatch warna/material
  | "words" // pita kata
  | "marquee" // (P) marquee mitra
  | "partners" // nama mitra (gratis)
  | "cta"
  | "cta-soft"
  | "band" // pita belah dua ajakan
  | "news" // buletin
  | "timeline" // sejarah
  | "events" // jadwal acara (indeks)
  | "board" // papan jadwal gelap
  | "posts" // majalah artikel
  | "specs" // spesifikasi
  | "loc" // lokasi / area layanan
  | "contact" // formulir kontak
  | "book" // formulir pemesanan
  | "chart" // panel grafik
  | "duo" // dua grafik
  | "progress" // (P) bilah progres
  | "countdown" // (P) hitung mundur
  | "slider" // (P) slider
  | "ba" // (P) sebelum/sesudah
  | "offer" // (P) popup penawaran
  | "notice"; // pengumuman

/** Blok + judul/teks pengganti (opsional). */
export type BlockRef = BlockId | [BlockId, B?, B?];

/** Elemen Premium di luar section: mega menu, kembali ke atas, teks mengetik. */
type Chrome = "mega" | "top" | "typer";

export interface GPage {
  key: string;
  name: B;
  /** Judul kepala halaman. */
  title: B;
  text?: B;
  blocks: BlockRef[];
}

export interface GChart {
  type: ChartC["type"];
  title: B;
  /** Nama seri dipisah koma. */
  series: B;
  /** "Label, nilai1, nilai2". Label dwibahasa: "Jan|Jan, 10, 12". */
  rows: string[];
}

export interface Biz {
  eyebrow: B;
  title: B;
  text: B;
  /** Ajakan utama → halaman `ctaPage`. */
  cta: B;
  ctaPage: string;
  /** Tombol pada kartu/daftar produk (`items`) bila ajakan utama tidak cocok: [label, halaman]. */
  itemCta?: [B, string];
  /** Judul & teks section ajakan. */
  ctaTitle: B;
  ctaText: B;
  /** Popup penawaran [judul, isi]. */
  offer?: [B, B];
  /** Pengumuman singkat. */
  notice?: B;
  /** Teks mengetik: [awalan, "kata, kata, kata"]. */
  typer?: [B, B];
  /** Placeholder kotak cari (hero search). */
  searchPh?: B;
  about: B;
  /** 3–4 poin singkat (chip hero, sidebar, daftar). */
  perks: B[];
  /** [ikon, judul, teks, meta?] */
  svc: [string, B, B, string?][];
  /** [angka, label, chip KPI?] */
  stats: [string, B, B?][];
  steps: [B, B][];
  quotes?: [B, string, B][];
  faq?: [B, B][];
  team?: [string, B][];
  /** [nama, harga, keterangan, "fitur; fitur; fitur", harga tahunan?] */
  plans?: [B, string, B, B, string?][];
  /** Satuan harga paket, mis. ["/bulan", "/month"]. */
  period?: B;
  /** [nama, keterangan, harga] */
  items?: [B, B, string][];
  /** [judul, ringkasan, tanggal, tag?] */
  posts?: [B, B, string, B?][];
  /** [tanggal, judul, tempat/keterangan, status?] */
  events?: [string, B, B, B?][];
  /** Nilai/prinsip [judul, teks] (kolom editorial, catatan tempel). */
  values?: [B, B][];
  /** [tahun, judul, teks] */
  history?: [string, B, B][];
  chart?: GChart;
  chart2?: GChart;
  /** Bilah progres [label, nilai 0–100]. */
  bars?: [B, number][];
  /** [warna, nama, keterangan] */
  swatches?: [string, B, B][];
  /** [kunci, nilai] */
  specs?: [B, B][];
  /** Kata untuk pita/marquee, dipisah koma. */
  words: B;
  partners?: string[];
  /** Tanggal ISO untuk hitung mundur / poster. */
  date?: string;
  dateLabel?: B;
  addr: string;
  phone: string;
  email: string;
  hours: B;
  /** [nama, keterangan, keterangan] */
  places?: [B, B, B][];
  social: string[];
}

export interface GSpec {
  id: string;
  brand: string;
  /** Nama pendek di header (default: brand). */
  short?: string;
  cat: TemplateCategory;
  tier: TemplateTier;
  tags: string[];
  /** Deskripsi katalog [id, en] (tanpa jumlah halaman; ditambahkan otomatis). */
  desc: B;
  /** [ink, muted, primary, primaryDark, soft, line] */
  pal: [string, string, string, string, string, string];
  look: { head: string; body: string; shape: Shape; radius: number; bg: string; alt: string; inv: string; surface?: string; fx?: Fx; upper?: boolean; dark?: boolean };
  header: "bar" | "pill" | "center" | "split" | "ink";
  footer: "giant" | "columns" | "slim";
  hero: HeroKind;
  /** Tiga motif ilustrasi (gambar 0–2; 3–5 = varian warna). */
  art: [Motif, Motif, Motif];
  chrome?: Chrome[];
  home: BlockRef[];
  pages: GPage[];
  biz: Biz;
}
