import type { BoxNode, ElementNode } from "../engine/helpers/componentTypes";
import { isBox } from "../engine/helpers/componentTypes";
import { asset } from "../../webTemplates/assets";
import { el, heading, image, inline, linkButton, para, type Palette } from "./blocks";
import type { Tr } from "./sectionPresetsPro";

/* ================================================================== */
/* Contoh isi untuk 22 preset dasar (dulu hanya kerangka kosong).        */
/*                                                                    */
/* Dipakai saat "Sertakan contoh isi" dicentang, supaya hasil klik sama  */
/* dengan gambar & deskripsi preset. Isi ditentukan dari NAMA kolom/Row   */
/* yang dibuat preset (mis. "Teks", "Gambar", "Paket 1"), jadi struktur  */
/* preset tidak berubah: tanpa centang, emptySection() membuangnya lagi. */
/* ================================================================== */

const P: Palette = { ink: "#0f172a", muted: "#475569", primary: "#2563eb", primaryDark: "#1d4ed8", soft: "#eff6ff", line: "#dbeafe" };

type Fill = (tr: Tr, n: number) => (ElementNode | BoxNode)[];

const muted = (text: string, o: Parameters<typeof para>[1] = {}) => para(text, { color: P.muted, size: 15, ...o });
const buttons = (tr: Tr, justify: "start" | "center" = "start", light = false) =>
  inline(
    [
      linkButton(tr("Mulai sekarang", "Get started"), "#mulai", light ? "light" : "primary", P),
      linkButton(tr("Pelajari lebih lanjut", "Learn more"), "#info", light ? "dark" : "outline", P),
    ],
    { justify },
  );

const heroText = (tr: Tr, align: "left" | "center", light = false): (ElementNode | BoxNode)[] => [
  heading(tr("Judul utama yang jelas dan meyakinkan", "A clear, convincing main headline"), "h1", { align, color: light ? "#ffffff" : P.ink }),
  para(tr("Satu atau dua kalimat yang menjelaskan manfaat utama untuk pengunjung.", "One or two sentences explaining the main benefit for visitors."), {
    align,
    size: 18,
    color: light ? "#e2e8f0" : P.muted,
  }),
  buttons(tr, align === "center" ? "center" : "start", light),
];

const titleBlock = (tr: Tr, align: "left" | "center"): ElementNode[] => [
  heading(tr("Judul section", "Section title"), "h2", { align }),
  muted(tr("Kalimat pengantar singkat untuk section ini.", "A short introduction for this section."), { align, size: 17 }),
];

const footerLinks = (title: string, links: string[]) => [heading(title, "h4", { size: 16 }), ...links.map((l) => muted(l, { size: 14 }))];

/** Isi per nama Row tanpa kolom (Row itu sendiri yang menampung elemen). */
const ROW_FILL: Record<string, Fill> = {
  Row: (tr) => titleBlock(tr, "left"),
  "Row Judul": (tr) => titleBlock(tr, "center"),
  "Row CTA": (tr) => [
    heading(tr("Siap memulai?", "Ready to start?"), "h2", { align: "center" }),
    muted(tr("Ajak pengunjung mengambil langkah berikutnya.", "Invite visitors to take the next step."), { align: "center", size: 17 }),
    inline([linkButton(tr("Hubungi kami", "Contact us"), "#kontak", "primary", P)], { justify: "center" }),
  ],
};

/** Isi per nama kolom; angka di akhir nama (mis. "Paket 2") dikirim sebagai `n`. */
const CELL_FILL: Record<string, Fill> = {
  Teks: (tr) => heroText(tr, "left"),
  Gambar: (tr) => [image(asset("workspace"), tr("Gambar contoh", "Sample image"), { ratio: "4 / 3", radius: 16 })],
  Visual: (tr) => [image(asset("hero-office"), tr("Gambar contoh", "Sample image"), { ratio: "4 / 3", radius: 16, shadow: true })],
  Fitur: (tr, n) => [heading(tr(`Fitur ${n}`, `Feature ${n}`), "h3"), muted(tr("Jelaskan manfaat fitur ini dalam satu atau dua kalimat.", "Describe this feature's benefit in a sentence or two."))],
  Stat: (tr, n) => [heading(["120+", "98%", "24/7", "15"][n - 1] ?? "100", "h2", { align: "center", color: P.primary }), muted(tr(["Klien", "Puas", "Dukungan", "Tahun"][n - 1] ?? "Angka", ["Clients", "Satisfied", "Support", "Years"][n - 1] ?? "Number"), { align: "center" })],
  Konten: (tr) => [
    heading(tr("Judul konten", "Content title"), "h2"),
    muted(tr("Paragraf pertama berisi penjelasan utama. Ganti dengan teks Anda sendiri.", "The first paragraph holds the main explanation. Replace it with your own text."), { size: 16 }),
    muted(tr("Paragraf kedua untuk detail tambahan.", "A second paragraph for extra detail."), { size: 16 }),
  ],
  Samping: (tr) => [heading(tr("Info samping", "Side info"), "h4"), muted(tr("Tautan, ringkasan, atau ajakan singkat.", "Links, a summary, or a short call to action."))],
  Paket: (tr, n) => [
    heading([tr("Dasar", "Basic"), tr("Bisnis", "Business"), tr("Pro", "Pro")][n - 1] ?? "Paket", "h3"),
    heading(["Rp49rb", "Rp99rb", "Rp199rb"][n - 1] ?? "Rp0", "h2", { color: P.primary }),
    muted(tr("Ringkasan isi paket ini.", "What this plan includes.")),
    linkButton(tr("Pilih paket", "Choose plan"), "#harga", n === 2 ? "primary" : "outline", P, { full: true }),
  ],
  Testimoni: (tr, n) => [
    para(tr("“Layanan yang cepat dan hasilnya rapi. Sangat direkomendasikan.”", "“Fast service and tidy results. Highly recommended.”"), { size: 16, color: P.ink }),
    heading(["Rina", "Bima", "Sari"][n - 1] ?? "Pelanggan", "h4", { size: 15 }),
  ],
  Anggota: (tr, n) => [
    image(asset(`team-${((n - 1) % 3) + 1}`), tr("Foto anggota tim", "Team member photo"), { ratio: "1 / 1", radius: 999 }),
    heading(["Andi", "Dewi", "Raka", "Maya"][n - 1] ?? "Nama", "h4", { align: "center" }),
    muted(tr("Jabatan", "Role"), { align: "center" }),
  ],
  Logo: (_tr, n) => [heading(n ? `LOGO ${n}` : "Brand", "h4", { align: n ? "center" : "left", color: n ? "#94a3b8" : P.ink })],
  Menu: (tr) => [tr("Beranda", "Home"), tr("Layanan", "Services"), tr("Tentang", "About"), tr("Kontak", "Contact")].map((l) => para(l, { size: 15, color: P.ink, full: false })),
  "Judul FAQ": (tr) => [heading(tr("Pertanyaan umum", "Common questions"), "h2"), muted(tr("Jawaban singkat untuk hal yang sering ditanyakan.", "Short answers to frequent questions."))],
  Pertanyaan: (tr) => [
    el(
      "accordion",
      {
        items: [
          { title: tr("Berapa lama prosesnya?", "How long does it take?"), content: tr("Biasanya 3–5 hari kerja.", "Usually 3–5 business days.") },
          { title: tr("Apakah bisa revisi?", "Can I request revisions?"), content: tr("Bisa, hingga dua kali revisi.", "Yes, up to two rounds.") },
          { title: tr("Bagaimana cara bayar?", "How do I pay?"), content: tr("Transfer bank atau e-wallet.", "Bank transfer or e-wallet.") },
        ],
        widthMode: "full",
      },
      "FAQ",
    ),
  ],
  "Kartu Langganan": (tr) => [
    heading(tr("Dapatkan kabar terbaru", "Get the latest news"), "h3", { align: "center" }),
    muted(tr("Tips dan promo, sebulan sekali. Tanpa spam.", "Tips and offers, once a month. No spam."), { align: "center" }),
    inline([linkButton(tr("Berlangganan", "Subscribe"), "#langganan", "primary", P)], { justify: "center" }),
  ],
  Langkah: (tr, n) => [heading(`0${n}`, "h3", { color: P.primary }), heading(tr(`Tahap ${n}`, `Step ${n}`), "h4"), muted(tr("Penjelasan singkat tahap ini.", "A short note on this step."))],
  Foto: (tr, n) => [image(asset(["workspace", "hero-office", "storefront", "hero-agency", "boutique-banner", "workspace"][n - 1] ?? "workspace"), tr(`Foto ${n}`, `Photo ${n}`), { ratio: "4 / 3", radius: 10 })],
  "Info Kontak": (tr) => [
    heading(tr("Hubungi kami", "Get in touch"), "h3", { color: "#ffffff" }),
    para("halo@contoh.com", { color: "#dbeafe" }),
    para("+62 812 0000 0000", { color: "#dbeafe" }),
    para(tr("Jakarta, Indonesia", "Jakarta, Indonesia"), { color: "#dbeafe" }),
  ],
  Formulir: (tr) => [
    heading(tr("Kirim pesan", "Send a message"), "h3"),
    muted(tr("Tambahkan elemen formulir dari panel (+) di sini.", "Add form elements from the (+) panel here.")),
    linkButton(tr("Kirim email", "Send email"), "mailto:halo@contoh.com", "primary", P),
  ],
  Artikel: (tr, n) => [
    image(asset(["workspace", "hero-office", "storefront"][n - 1] ?? "workspace"), tr("Gambar artikel", "Article image"), { ratio: "16 / 9", radius: 12 }),
    heading(tr(`Judul artikel ${n}`, `Article title ${n}`), "h3", { size: 19 }),
    muted(tr("Ringkasan singkat isi artikel.", "A short summary of the article.")),
  ],
  "Teks Banner": (tr) => [heading(tr("Penawaran terbatas bulan ini", "Limited offer this month"), "h3", { color: "#ffffff" }), para(tr("Diskon 20% untuk pelanggan baru.", "20% off for new customers."), { color: "#cbd5e1" })],
  Aksi: (tr) => [linkButton(tr("Ambil penawaran", "Claim offer"), "#promo", "light", P)],
  Brand: (tr) => [heading("Brand", "h4"), muted(tr("Satu kalimat tentang bisnis Anda.", "One sentence about your business."), { size: 14 })],
  Produk: (tr) => footerLinks(tr("Produk", "Product"), [tr("Fitur", "Features"), tr("Harga", "Pricing"), "FAQ"]),
  Perusahaan: (tr) => footerLinks(tr("Perusahaan", "Company"), [tr("Tentang", "About"), tr("Karier", "Careers"), "Blog"]),
  Kontak: (tr) => footerLinks(tr("Kontak", "Contact"), ["halo@contoh.com", "+62 812 0000 0000"]),
};

/** Isi khusus Row hero per preset (judul besar rata tengah, teks terang di atas gambar). */
const HERO_ROW: Record<string, Fill> = {
  "hero-center": (tr) => heroText(tr, "center"),
  "hero-image": (tr) => heroText(tr, "center", true),
};
/** Kolom "Teks" di hero gradient memakai teks terang. */
const LIGHT_TEXT = new Set(["hero-gradient"]);

function cellFill(name: string, presetId: string): Fill | null {
  if (name === "Teks" && LIGHT_TEXT.has(presetId)) return (tr) => heroText(tr, "left", true);
  if (CELL_FILL[name]) return CELL_FILL[name];
  const m = /^(.*\S) (\d+)$/.exec(name);
  if (m && CELL_FILL[m[1]]) {
    const f = CELL_FILL[m[1]];
    return (tr) => f(tr, Number(m[2]));
  }
  return null;
}

/** Isi kotak kosong preset dasar dengan contoh elemen (kotak yang sudah berisi tidak disentuh). */
export function withSampleContent(presetId: string, section: BoxNode, tr: Tr): BoxNode {
  for (const row of section.children) {
    if (!isBox(row)) continue;
    if (row.children.length === 0) {
      const f = HERO_ROW[presetId] ?? ROW_FILL[row.name];
      if (f) row.children = f(tr, 0);
      continue;
    }
    for (const cell of row.children) {
      if (!isBox(cell) || cell.children.length) continue;
      const f = cellFill(cell.name, presetId);
      if (f) cell.children = f(tr, 0);
    }
  }
  return section;
}
