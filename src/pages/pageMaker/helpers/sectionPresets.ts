import i18n from "../../../i18n";
import type { BoxNode, Place, SectionProps } from "../engine/helpers/componentTypes";
import { createBox } from "../engine/helpers/tree";
import { createRow } from "./rowModel";
import { PRO_FREE_IDS, PRO_PRESETS, stamp, trFor } from "./sectionPresetsPro";
import { withSampleContent } from "./presetSamples";

/* ================================================================== */
/* Preset section — dasar (8 gratis + 14 premium) + 10 preset Pro       */
/* (4 gratis + 6 premium, lihat sectionPresetsPro.ts).                  */
/*                                                                    */
/* Preset hanyalah pohon awal: sebuah section (pita selebar halaman)    */
/* berisi Row dengan kolom/sel kosong yang bisa diisi lewat (+).        */
/* Setelah dibuat, semuanya bisa diubah bebas lewat popup pengaturan.   */
/* ================================================================== */

type SectionFamily = "stack" | "row" | "grid";

type PresetTier = "free" | "premium";

/** Jumlah preset yang tersedia di versi gratis. */
export const FREE_PRESET_LIMIT = 12;

export interface SectionPreset {
  id: string;
  name: string;
  family: SectionFamily;
  description: string;
  /** "free" = langsung dipakai; "premium" = butuh kredit. */
  tier: PresetTier;
  /** Preset Pro (berisi konten) yang ditambahkan pada rilis katalog ini. */
  isNew?: boolean;
  /** Kategori katalog (hero, features, …). */
  category?: string;
  /** Section lengkap (dengan contoh isi bila preset punya). */
  build: () => BoxNode;
  /** Kerangka kosong khusus (bawaan: emptySection(build())). */
  buildEmpty?: () => BoxNode;
}

const FR = (n: number) => `repeat(${n}, minmax(0, 1fr))`;

const SECTION_BASE: SectionProps = { contentWidth: 1120, padY: 64, padX: 24, minHeight: 0, bgImage: "" };

const column = (name: string, patch: Partial<BoxNode> = {}, place: Place = {}): BoxNode =>
  createBox("stack", {
    name,
    gap: 12,
    widthMode: "auto",
    stackOnMobile: false,
    align: "start",
    place,
    ...patch,
  });

/**
 * Section = pita BLOK (tata letak normal). Isinya selalu Row; susunan kolom
 * ada di Row-nya, bukan di section.
 */
function section(
  name: string,
  patch: Partial<BoxNode> = {},
  sec: Partial<SectionProps> = {},
  rows: BoxNode[] = [],
): BoxNode {
  return createBox("block", {
    name,
    tag: "section",
    gap: 0,
    padding: 0,
    widthMode: "full",
    align: "stretch",
    justify: "stretch",
    stackOnMobile: false,
    section: { ...SECTION_BASE, ...sec },
    children: rows,
    ...patch,
  });
}

const row = (name: string, patch: Partial<BoxNode> = {}, cells: BoxNode[] = []): BoxNode =>
  createRow({ name, padding: 0, children: cells, ...patch });

const gridRow = (name: string, n: number | string, patch: Partial<BoxNode>, cells: BoxNode[]): BoxNode =>
  row(name, { layout: "grid", columns: typeof n === "number" ? FR(n) : n, justify: "stretch", stackOnMobile: true, ...patch }, cells);

const BASE_PRESETS: Omit<SectionPreset, "tier">[] = [
  {
    id: "single",
    name: "Satu Kolom",
    family: "stack",
    description: "Section dengan satu Row — susun elemen ke bawah.",
    build: () => section("Section", {}, {}, [row("Row")]),
  },
  {
    id: "hero-center",
    name: "Hero Terpusat",
    family: "stack",
    description: "Judul besar, teks, dan tombol — rata tengah di atas latar lembut.",
    build: () =>
      section("Hero", { bgEnabled: true, bgColor: "#f8fafc" }, { padY: 96 }, [
        row("Row Hero", { align: "center", gap: 16 }),
      ]),
  },
  {
    id: "hero-split",
    name: "Hero Dua Kolom",
    family: "grid",
    description: "Teks di kiri, gambar di kanan.",
    build: () =>
      section("Hero 2 Kolom", {}, { padY: 80 }, [
        gridRow("Row Hero", 2, { align: "center", gap: 48 }, [column("Teks"), column("Gambar")]),
      ]),
  },
  {
    id: "features-3",
    name: "Fitur 3 Kolom",
    family: "grid",
    description: "Tiga kolom sama lebar untuk fitur atau layanan.",
    build: () =>
      section("Fitur", {}, {}, [
        gridRow("Row Fitur", 3, { gap: 32 }, [column("Fitur 1"), column("Fitur 2"), column("Fitur 3")]),
      ]),
  },
  {
    id: "stats-4",
    name: "Statistik 4 Kolom",
    family: "grid",
    description: "Empat angka/ikon rata tengah di atas latar abu muda.",
    build: () =>
      section("Statistik", { bgEnabled: true, bgColor: "#f1f5f9" }, { padY: 48 }, [
        gridRow(
          "Row Statistik",
          4,
          { align: "center", gap: 24 },
          ["Stat 1", "Stat 2", "Stat 3", "Stat 4"].map((n) => column(n, { align: "center" })),
        ),
      ]),
  },
  {
    id: "content-sidebar",
    name: "Konten + Sisi",
    family: "grid",
    description: "Kolom konten lebar (2/3) dan kolom samping (1/3).",
    build: () =>
      section("Konten + Sisi", {}, {}, [
        gridRow("Row Konten", "minmax(0, 2fr) minmax(0, 1fr)", { gap: 40 }, [column("Konten"), column("Samping")]),
      ]),
  },
  {
    id: "pricing-3",
    name: "Harga 3 Kartu",
    family: "grid",
    description: "Tiga kartu bersudut bulat dengan bayangan.",
    build: () =>
      section("Harga", { bgEnabled: true, bgColor: "#f8fafc" }, {}, [
        gridRow(
          "Row Harga",
          3,
          { align: "stretch", gap: 24 },
          ["Paket 1", "Paket 2", "Paket 3"].map((n) =>
            column(n, {
              padding: 24,
              bgEnabled: true,
              bgColor: "#ffffff",
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 12,
              shadow: "sm",
            }),
          ),
        ),
      ]),
  },
  {
    id: "cta",
    name: "CTA Banner",
    family: "stack",
    description: "Ajakan bertindak rata tengah di atas latar biru muda.",
    build: () =>
      section("CTA", { bgEnabled: true, bgColor: "#eff6ff" }, { padY: 72 }, [
        row("Row CTA", { align: "center", gap: 16 }),
      ]),
  },
  {
    id: "navbar",
    name: "Navbar",
    family: "row",
    description: "Baris header: logo di kiri, menu di kanan.",
    build: () =>
      section("Navbar", { tag: "header", bgEnabled: true, bgColor: "#ffffff", shadow: "sm" }, { padY: 16 }, [
        row(
          "Row Navbar",
          { layout: "row", align: "center", justify: "between", gap: 16, wrap: true },
          [column("Logo", { layout: "row", align: "center" }), column("Menu", { layout: "row", align: "center", gap: 20 })],
        ),
      ]),
  },
  {
    id: "footer-4",
    name: "Footer 4 Kolom",
    family: "grid",
    description: "Footer dengan empat kolom tautan.",
    build: () =>
      section("Footer", { tag: "footer", bgEnabled: true, bgColor: "#f8fafc" }, { padY: 56 }, [
        gridRow(
          "Row Footer",
          4,
          { gap: 32 },
          ["Brand", "Produk", "Perusahaan", "Kontak"].map((n) => column(n)),
        ),
      ]),
  },
];

/** Gambar latar contoh (SVG data URI, tanpa jaringan) untuk preset bergambar. */
function svgData(svg: string): string {
  return (
    "data:image/svg+xml;utf8," +
    encodeURIComponent(svg).replace(/'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29")
  );
}
const SAMPLE_IMAGE = svgData(
  "<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900' viewBox='0 0 1600 900'>" +
    "<rect width='1600' height='900' fill='#1e3a8a'/>" +
    "<circle cx='1300' cy='180' r='320' fill='#3b82f6' opacity='.55'/>" +
    "<circle cx='260' cy='760' r='380' fill='#7c3aed' opacity='.45'/>" +
    "<circle cx='900' cy='520' r='180' fill='#22d3ee' opacity='.35'/></svg>",
);

const card = (name: string, patch: Partial<BoxNode> = {}) =>
  column(name, {
    padding: 24,
    bgEnabled: true,
    bgColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    shadow: "sm",
    ...patch,
  });

const PREMIUM_PRESETS: Omit<SectionPreset, "tier">[] = [
  {
    id: "hero-image",
    name: "Hero Gambar",
    family: "stack",
    description: "Hero tinggi dengan gambar latar, overlay gelap, dan isi rata tengah.",
    build: () =>
      section(
        "Hero Gambar",
        { bgType: "image", bgImage: SAMPLE_IMAGE, bgColor: "#0f172a", bgSize: "cover", bgPosition: "center", bgOverlayColor: "#000000", bgOverlayOpacity: 45 },
        { padY: 120, minHeight: 520 },
        [row("Row Hero", { align: "center", gap: 16 })],
      ),
  },
  {
    id: "hero-gradient",
    name: "Hero Gradient",
    family: "grid",
    description: "Dua kolom di atas gradient biru-ungu yang mencolok.",
    build: () =>
      section(
        "Hero Gradient",
        { bgType: "gradient", gradientKind: "linear", gradientAngle: 135, gradientFrom: "#1d4ed8", gradientVia: "", gradientTo: "#7c3aed" },
        { padY: 96 },
        [gridRow("Row Hero", 2, { align: "center", gap: 48 }, [column("Teks"), column("Visual")])],
      ),
  },
  {
    id: "stats-4",
    name: "Statistik 4 Kolom",
    family: "grid",
    description: "Empat angka/ikon rata tengah di atas latar abu muda.",
    build: () => BASE_STATS(),
  },
  {
    id: "pricing-3",
    name: "Harga 3 Kartu",
    family: "grid",
    description: "Tiga kartu bersudut bulat dengan bayangan.",
    build: () => BASE_PRICING(),
  },
  {
    id: "testimonials-3",
    name: "Testimoni 3 Kartu",
    family: "grid",
    description: "Judul di atas, lalu tiga kartu kutipan pelanggan.",
    build: () =>
      section("Testimoni", { bgEnabled: true, bgColor: "#f1f5f9" }, { padY: 80 }, [
        row("Row Judul", { align: "center", gap: 8 }),
        gridRow("Row Testimoni", 3, { gap: 24, align: "stretch" }, ["Testimoni 1", "Testimoni 2", "Testimoni 3"].map((n) => card(n))),
      ]),
  },
  {
    id: "team-4",
    name: "Tim 4 Kolom",
    family: "grid",
    description: "Empat profil anggota tim, rata tengah.",
    build: () =>
      section("Tim", {}, { padY: 80 }, [
        row("Row Judul", { align: "center", gap: 8 }),
        gridRow("Row Tim", 4, { gap: 24 }, ["Anggota 1", "Anggota 2", "Anggota 3", "Anggota 4"].map((n) => column(n, { align: "center" }))),
      ]),
  },
  {
    id: "logos-6",
    name: "Deretan Logo",
    family: "row",
    description: "Enam slot logo klien/partner berjajar rapi.",
    build: () =>
      section("Logo", { bgEnabled: true, bgColor: "#ffffff" }, { padY: 40 }, [
        row(
          "Row Logo",
          { layout: "row", align: "center", justify: "between", gap: 24, wrap: true },
          Array.from({ length: 6 }, (_, i) => column(`Logo ${i + 1}`, { align: "center" })),
        ),
      ]),
  },
  {
    id: "faq-split",
    name: "FAQ Dua Kolom",
    family: "grid",
    description: "Judul di kiri, daftar pertanyaan (Accordion) di kanan.",
    build: () =>
      section("FAQ", {}, { padY: 80 }, [
        gridRow("Row FAQ", "minmax(0, 1fr) minmax(0, 2fr)", { gap: 48 }, [column("Judul FAQ"), column("Pertanyaan")]),
      ]),
  },
  {
    id: "newsletter",
    name: "Newsletter",
    family: "stack",
    description: "Kartu langganan di tengah, di atas latar gradient lembut.",
    build: () =>
      section(
        "Newsletter",
        { bgType: "gradient", gradientKind: "radial", gradientFrom: "#eff6ff", gradientVia: "", gradientTo: "#dbeafe", gradientAngle: 90 },
        { padY: 80 },
        [row("Row Newsletter", { align: "center" }, [card("Kartu Langganan", { widthMode: "fixed", width: 560, align: "center" })])],
      ),
  },
  {
    id: "steps-4",
    name: "Langkah 4 Tahap",
    family: "grid",
    description: "Empat tahap proses dengan garis aksen di atas tiap kolom.",
    build: () =>
      section("Langkah", {}, { padY: 72 }, [
        row("Row Judul", { align: "center", gap: 8 }),
        gridRow(
          "Row Langkah",
          4,
          { gap: 24 },
          ["Langkah 1", "Langkah 2", "Langkah 3", "Langkah 4"].map((n) =>
            column(n, { padding: 16, borderWidth: 0, bgEnabled: true, bgColor: "#f8fafc", borderRadius: 8 }),
          ),
        ),
      ]),
  },
  {
    id: "gallery-6",
    name: "Galeri 3×2",
    family: "grid",
    description: "Enam sel gambar dalam grid tiga kolom.",
    build: () =>
      section("Galeri", {}, { padY: 64 }, [
        gridRow("Row Galeri", 3, { gap: 16 }, Array.from({ length: 6 }, (_, i) => column(`Foto ${i + 1}`))),
      ]),
  },
  {
    id: "contact-split",
    name: "Kontak Dua Kolom",
    family: "grid",
    description: "Info kontak di kartu berwarna, formulir di sebelahnya.",
    build: () =>
      section("Kontak", {}, { padY: 80 }, [
        gridRow("Row Kontak", "minmax(0, 1fr) minmax(0, 1.4fr)", { gap: 32, align: "stretch" }, [
          card("Info Kontak", { bgColor: "#1e3a8a", borderWidth: 0 }),
          card("Formulir"),
        ]),
      ]),
  },
  {
    id: "blog-3",
    name: "Artikel 3 Kartu",
    family: "grid",
    description: "Judul + tiga kartu artikel/berita terbaru.",
    build: () =>
      section("Artikel", { bgEnabled: true, bgColor: "#f8fafc" }, { padY: 80 }, [
        row("Row Judul", { gap: 8 }),
        gridRow("Row Artikel", 3, { gap: 24, align: "stretch" }, ["Artikel 1", "Artikel 2", "Artikel 3"].map((n) => card(n, { padding: 0 }))),
      ]),
  },
  {
    id: "banner-dark",
    name: "Banner Gelap",
    family: "row",
    description: "Pita gelap: teks di kiri, tombol di kanan.",
    build: () =>
      section("Banner", { bgEnabled: true, bgColor: "#0f172a" }, { padY: 48 }, [
        row("Row Banner", { layout: "row", align: "center", justify: "between", gap: 24, wrap: true, stackOnMobile: true }, [
          column("Teks Banner"),
          column("Aksi", { layout: "row", align: "center" }),
        ]),
      ]),
  },
];

/** 8 preset gratis (urutan tampil), sisanya premium. */
const FREE_IDS = ["single", "hero-center", "hero-split", "features-3", "content-sidebar", "cta", "navbar", "footer-4"];

const BASE_BY_ID = Object.fromEntries(BASE_PRESETS.map((p) => [p.id, p]));
function BASE_STATS() {
  return BASE_BY_ID["stats-4"].build();
}
function BASE_PRICING() {
  return BASE_BY_ID["pricing-3"].build();
}

/**
 * `name` & `description` = getter i18n (bahasa aktif saat dibaca); teks
 * Indonesia di atas menjadi nilai cadangan. `id` tidak pernah diterjemahkan.
 */
function localized(p: Omit<SectionPreset, "tier">, tier: PresetTier): SectionPreset {
  return {
    id: p.id,
    family: p.family,
    tier,
    category: p.category ?? CATEGORY_OF[p.id] ?? "layout",
    // Section hasil preset mencatat ID asalnya (katalog & daftar isi template).
    build: () => stamp(p.id, withSampleContent(p.id, p.build(), trFor(i18n.language))),
    buildEmpty: () => stamp(p.id, p.build()),
    get name() {
      return i18n.t(`pm.presets.${p.id}.name`, { defaultValue: p.name });
    },
    get description() {
      return i18n.t(`pm.presets.${p.id}.description`, { defaultValue: p.description });
    },
  };
}

/** Kategori katalog preset dasar. */
const CATEGORY_OF: Record<string, string> = {
  single: "layout",
  "hero-center": "hero",
  "hero-split": "hero",
  "features-3": "features",
  "content-sidebar": "layout",
  cta: "cta",
  navbar: "navigation",
  "footer-4": "footer",
  "hero-image": "hero",
  "hero-gradient": "hero",
  "stats-4": "statistics",
  "pricing-3": "pricing",
  "testimonials-3": "testimonials",
  "team-4": "team",
  "logos-6": "logos",
  "faq-split": "faq",
  newsletter: "cta",
  "steps-4": "features",
  "gallery-6": "portfolio",
  "contact-split": "contact",
  "blog-3": "blog",
  "banner-dark": "cta",
};

/** Preset Pro: nama & deskripsi dua bahasa langsung dari definisinya. */
function localizedPro(p: (typeof PRO_PRESETS)[number]): SectionPreset {
  const en = () => i18n.language?.startsWith("en");
  return {
    id: p.id,
    family: p.family,
    tier: PRO_FREE_IDS.includes(p.id) ? "free" : "premium",
    isNew: true,
    category: p.category,
    build: p.build,
    get name() {
      return en() ? p.nameEn : p.name;
    },
    get description() {
      return en() ? p.descriptionEn : p.description;
    },
  };
}

const PRO_SECTION_PRESETS: SectionPreset[] = PRO_PRESETS.map(localizedPro);

export const SECTION_PRESETS: SectionPreset[] = [
  ...FREE_IDS.map((id) => localized(BASE_BY_ID[id], "free")),
  ...PRO_SECTION_PRESETS.filter((p) => p.tier === "free"),
  ...PREMIUM_PRESETS.map((p) => localized(p, "premium")),
  ...PRO_SECTION_PRESETS.filter((p) => p.tier === "premium"),
];

export const FREE_PRESETS = SECTION_PRESETS.filter((p) => p.tier === "free");
export const PREMIUM_PRESETS_LIST = SECTION_PRESETS.filter((p) => p.tier === "premium");

export const isPremiumPreset = (p: SectionPreset | string): boolean =>
  (typeof p === "string" ? getSectionPreset(p) : p)?.tier === "premium";

export const getSectionPreset = (id: string) => SECTION_PRESETS.find((p) => p.id === id);
