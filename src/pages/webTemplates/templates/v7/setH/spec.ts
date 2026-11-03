import type { TemplateCategory, TemplateTier } from "../../../../../config/templates";

/* ================================================================== */
/* Spesifikasi template v7 bagian H: DASHBOARD                          */
/*                                                                    */
/* Satu template = isi domain (./domains.ts: KPI, grafik, tabel, form   */
/* dwibahasa) + tampilan (shell sidebar/topnav, gaya kartu, gaya KPI,   */
/* palet, font, urutan blok). Mesin di ./kitH.ts menyusunnya menjadi    */
/* section Page Maker biasa (Section → Row → Elemen), jadi setiap       */
/* halaman tetap bisa diedit penuh dan diekspor ke semua format.        */
/* ================================================================== */

/** Teks dwibahasa "id|en" (tanpa "|" = sama untuk kedua bahasa). */
export type X = string;

/** Kerangka aplikasi. */
export type Shell =
  | "side-dark" // sidebar gelap
  | "side-light" // sidebar terang bergaris
  | "side-brand" // sidebar warna merek (gradien)
  | "side-float" // sidebar kartu melayang
  | "topnav" // navigasi atas, tanpa sidebar
  | "topnav-dark" // navigasi atas gelap
  | "rail"; // sidebar ramping + label grup

/** Gaya kartu. */
export type CardStyle = "shadow" | "border" | "flat" | "glass" | "brutal" | "accent";

/** Gaya kartu statistik (KPI). */
export type KpiStyle = "plain" | "icon" | "tint" | "accent" | "split" | "counter";

/** Jenis halaman selain beranda (overview). */
export type PageKind = "records" | "analytics" | "board" | "settings" | "login" | "customers" | "reports";

/** Blok isi dashboard. */
export type HBlock =
  | "kpis" // kartu statistik
  | "main" // grafik utama + donat samping
  | "duo" // dua grafik
  | "wide" // grafik lebar
  | "table" // tabel data + toolbar + paginasi
  | "mini-table" // tabel ringkas (5 baris)
  | "activity" // linimasa aktivitas
  | "goals" // target (bilah progres)
  | "team" // anggota tim
  | "board" // kanban 3 kolom
  | "form" // formulir pengaturan
  | "alerts" // pemberitahuan
  | "steps" // langkah onboarding
  | "tabs" // tab wawasan
  | "quick" // pintasan
  | "split-act" // tabel ringkas + aktivitas berdampingan
  | "split-goal"; // target + tim berdampingan

export interface HChart {
  type: "bar" | "line" | "pie" | "doughnut";
  title: X;
  /** Nama seri dipisah koma, mis. "Pendapatan, Target|Revenue, Target". */
  series: X;
  /** "Label, nilai1, nilai2" — label dwibahasa "Jan|Jan". */
  rows: string[];
}

/** Paket isi satu domain (admin, CRM, keuangan, …). */
export interface Domain {
  key: string;
  /** Peran/subjudul di beranda. */
  role: X;
  /** Deskripsi katalog (tanpa jumlah halaman). */
  desc: X;
  tags: string[];
  /** Nama halaman. `records` = halaman tabel utama (mis. Pesanan). */
  names: Partial<Record<"overview" | PageKind, X>>;
  /** Ikon/glyph satu karakter untuk logo. */
  glyph: string;
  /** Placeholder kotak cari. */
  search: X;
  /** Tombol aksi utama. */
  action: X;
  /** KPI: "label|label en ; nilai ; delta ; up/down ; glyph". Minimal 6. */
  kpis: string[];
  main: HChart;
  side: HChart;
  extra: HChart;
  /** Grafik tambahan halaman analitik. */
  extra2?: HChart;
  table: { title: X; cols: X[]; rows: string[][]; filter: X[] };
  /** Tabel kedua (halaman pelanggan/laporan). */
  table2?: { title: X; cols: X[]; rows: string[][]; filter: X[] };
  /** "waktu | judul | teks" (dwibahasa per bagian). */
  activity: string[];
  /** "label ; nilai 0–100". */
  goals: string[];
  /** "Nama ; peran". */
  team: string[];
  board: { cols: X[]; cards: string[][] };
  form: { title: X; text: X; fields: string[]; selects: string[]; switches: X[]; note: X };
  alerts: string[];
  steps: string[];
  tabs: string[];
  quick: string[];
  login: { title: X; text: X; bullets: X[] };
}

export interface HSpec {
  id: string;
  brand: string;
  cat: TemplateCategory;
  tier: TemplateTier;
  domain: Domain;
  /** [ink, muted, primary, primaryDark, soft, line] */
  pal: [string, string, string, string, string, string];
  look: { head: string; body: string; radius: number; bg: string; surface: string; dark?: boolean; card: CardStyle };
  shell: Shell;
  kpi: KpiStyle;
  login: "split" | "center" | "banner";
  /** Halaman selain beranda (urut menu). */
  pages: PageKind[];
  /** Urutan blok beranda. */
  home: HBlock[];
  /** Tag tambahan (gaya). */
  tags?: string[];
  /** Efek muncul (hanya Premium). */
  fx?: "aos" | "animate";
}
