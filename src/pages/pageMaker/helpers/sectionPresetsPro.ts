import i18n from "../../../i18n";
import type { BoxNode, ElementNode } from "../engine/helpers/componentTypes";
import { asset } from "../../webTemplates/assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "./blocks";

/* ================================================================== */
/* 10 "Pro" section presets: with content & styles, not empty skeletons */
/*                                                                    */
/*   Free    : Spotlight Hero, Icon Features, Accordion FAQ, Ribbon CTA  */
/*   Premium : Split Services, Testimonial Wall, 3-Plan Pricing,          */
/*             Mosaic Portfolio, Team Cards, Stats Ribbon               */
/*                                                                    */
/* Each preset = a function (theme, language, content) → section. Page Maker */
/* uses the default theme & content; website templates use the same function */
/* with their own theme & content, so template sections = catalog presets. */
/* All content is built from FREE elements so buying a section does not */
/* require buying other elements. Responsive: grid Rows automatically become */
/* one column on small screens (stackOnMobile) + heading sizes shrink.  */
/* ================================================================== */

export type Tr = (id: string, en: string) => string;
export const trFor = (lang: string | undefined): Tr => (id, en) => (lang?.startsWith("en") ? en : id);
const currentTr = (): Tr => trFor(i18n.language);

export interface ProTheme {
  p: Palette;
  /** Light section background. */
  bg: string;
  /** Alternating section background. */
  alt: string;
  /** Dark section background. */
  dark: string;
  /** Card corner radius (px). */
  radius: number;
  /** Heading font-family (optional). */
  headFont?: string;
}

const DEFAULT_PRO_THEME: ProTheme = {
  p: { ink: "#0f172a", muted: "#475569", primary: "#4f46e5", primaryDark: "#3730a3", soft: "#eef2ff", line: "#e0e7ff" },
  bg: "#ffffff",
  alt: "#f8fafc",
  dark: "#0f172a",
  radius: 18,
};

export interface Link {
  label: string;
  href: string;
}

/* ------------------------------ util ------------------------------- */

/** Adds CSS declarations to a node (respecting existing Custom CSS). */
function addCss(node: ElementNode | BoxNode, decl: string): void {
  const cur = node.advanced?.customCss ?? "";
  const next = cur.includes("{") ? `${cur}\n& { ${decl} }` : `${cur}${cur ? "\n" : ""}${decl}`;
  node.advanced = { ...node.advanced, customCss: next };
}

/** Heading with the theme font. */
function h(t: ProTheme, text: string, tag: "h1" | "h2" | "h3" | "h4", o: Parameters<typeof heading>[2] = {}): ElementNode {
  const n = heading(text, tag, { color: t.p.ink, ...o });
  if (t.headFont) addCss(n, `font-family: ${t.headFont};`);
  return n;
}

/** Marks a section as preset output (used by the catalog & template content list). */
export function stamp(id: string, node: BoxNode): BoxNode {
  if (node.section) node.section = { ...node.section, presetId: id };
  return node;
}

function intro(t: ProTheme, o: { eyebrow?: string; title: string; text?: string; align?: "left" | "center"; light?: boolean }): BoxNode {
  const align = o.align ?? "center";
  const ink = o.light ? "#ffffff" : t.p.ink;
  const muted = o.light ? "#cbd5e1" : t.p.muted;
  return stack(
    [
      ...(o.eyebrow ? [eyebrow(o.eyebrow, o.light ? "#a5b4fc" : t.p.primary, align)] : []),
      h(t, o.title, "h2", { align, color: ink }),
      ...(o.text ? [para(o.text, { align, color: muted, size: 17 })] : []),
    ],
    { gap: 10, align: "stretch" },
  );
}

/** Icon box (emoji/text): a regular Text element so it can be replaced freely. */
function iconTile(t: ProTheme, glyph: string): ElementNode {
  const n = el("text", { text: glyph, tag: "p", fontSize: 22, fontWeight: 700, textColor: t.p.primary, textAlign: "center", widthMode: "auto" }, "Ikon");
  n.advanced = { customCss: `display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 14px; background: ${t.p.soft};` };
  return n;
}

const card = (t: ProTheme, bg = "#ffffff") => ({ bg, border: t.p.line, radius: t.radius, padding: 28 });

/* ================================================================== */
/* FREE                                                                 */
/* ================================================================== */

export interface HeroSpotlightContent {
  badge: string;
  title: string;
  text: string;
  primary: Link;
  secondary: Link;
  image: string;
  imageAlt: string;
  note: string;
}

/** Spotlight Hero (Free): centered text + 2 buttons + a wide product image below. */
export function heroSpotlight(t: ProTheme = DEFAULT_PRO_THEME, tr: Tr = currentTr(), c: Partial<HeroSpotlightContent> = {}): BoxNode {
  const x: HeroSpotlightContent = {
    badge: tr("Baru · Versi 2.0", "New · Version 2.0"),
    title: tr("Bangun halaman profesional dalam hitungan menit", "Build professional pages in minutes"),
    text: tr("Susun section siap pakai, ubah konten, lalu ekspor kode bersih untuk lima framework.", "Arrange ready-made sections, edit content, then export clean code for five frameworks."),
    primary: { label: tr("Mulai sekarang", "Get started"), href: "#mulai" },
    secondary: { label: tr("Lihat demo", "Watch demo"), href: "#demo" },
    image: asset("pro-hero"),
    imageAlt: tr("Tampilan dasbor aplikasi", "App dashboard preview"),
    note: tr("Gratis dicoba · Tanpa kartu kredit", "Free to try · No credit card"),
    ...c,
  };
  return stamp(
    "pro-hero-spotlight",
    section(
      "Hero Sorotan",
      [
        stack(
          [
            badge(x.badge, t.p.soft, t.p.primaryDark, t.p.line),
            h(t, x.title, "h1", { align: "center", size: 52 }),
            para(x.text, { align: "center", size: 19, color: t.p.muted }),
            inline([linkButton(x.primary.label, x.primary.href, "primary", t.p), linkButton(x.secondary.label, x.secondary.href, "outline", t.p)], { justify: "center" }),
            ...(x.note ? [para(x.note, { align: "center", size: 13, color: t.p.muted })] : []),
          ],
          { gap: 18, align: "center" },
        ),
        stack([image(x.image, x.imageAlt, { ratio: "16 / 9", radius: t.radius + 6, shadow: true })], { gap: 0, align: "stretch" }),
      ],
      { gradient: [t.p.soft, t.bg, 180], padY: 96, width: 1040 },
    ),
  );
}

export interface FeatureItem {
  icon: string;
  title: string;
  text: string;
}

/** Icon Features (Free): heading + 3/4/6 feature cards with icons. */
export function featuresIcons(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; items: FeatureItem[]; columns: number }> = {},
): BoxNode {
  const items = c.items ?? [
    { icon: "⚡", title: tr("Cepat", "Fast"), text: tr("Halaman ringan dengan skor performa tinggi di semua perangkat.", "Lightweight pages with high performance scores on every device.") },
    { icon: "🎨", title: tr("Mudah diubah", "Easy to customize"), text: tr("Ganti warna, font, dan tata letak tanpa menulis kode.", "Change colors, fonts, and layout without writing code.") },
    { icon: "🔒", title: tr("Aman", "Secure"), text: tr("Kode ekspor bersih tanpa skrip pihak ketiga tersembunyi.", "Clean exported code with no hidden third-party scripts.") },
  ];
  const cols = c.columns ?? (items.length % 3 === 0 ? 3 : items.length === 4 ? 4 : 2);
  return stamp(
    "pro-features-icons",
    section(
      "Fitur Ikon",
      [
        intro(t, { eyebrow: c.eyebrow ?? tr("Fitur", "Features"), title: c.title ?? tr("Semua yang Anda butuhkan untuk tampil online", "Everything you need to go online"), text: c.text }),
        grid(
          items.map((f) => col([iconTile(t, f.icon), h(t, f.title, "h3", { size: 19 }), para(f.text, { size: 15, color: t.p.muted })], { card: card(t), gap: 12, name: "Fitur" })),
          cols,
          { gap: 24, align: "stretch" },
        ),
      ],
      { bg: t.bg, padY: 88 },
    ),
  );
}

/** Accordion FAQ (Free): heading on the left, accordion on the right. */
export function faqAccordion(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; items: [string, string][]; contact: Link }> = {},
): BoxNode {
  const items = c.items ?? [
    [tr("Apakah saya perlu bisa coding?", "Do I need to know how to code?"), tr("Tidak. Semua bisa diatur lewat editor visual, dan kode tetap tersedia bila dibutuhkan.", "No. Everything can be set in the visual editor, and the code is still there if you need it.")],
    [tr("Bisakah saya memakai domain sendiri?", "Can I use my own domain?"), tr("Bisa. Unggah hasil ekspor ke hosting mana pun dan hubungkan domain Anda.", "Yes. Upload the export to any host and connect your domain.")],
    [tr("Bagaimana jika saya butuh bantuan?", "What if I need help?"), tr("Tim kami membalas lewat email pada hari kerja, biasanya dalam 24 jam.", "Our team replies by email on business days, usually within 24 hours.")],
    [tr("Apakah ada biaya tersembunyi?", "Are there hidden fees?"), tr("Tidak ada. Harga yang tampil adalah harga yang Anda bayar.", "None. The price you see is the price you pay.")],
  ];
  const acc = el(
    "accordion",
    {
      items: items.map(([title, content]) => ({ title, content })),
      exclusive: true,
      firstOpen: true,
      widthMode: "full",
      itemGap: 12,
      borderColor: t.p.line,
      borderRadius: Math.min(t.radius, 16),
      textColor: t.p.ink,
      headerBgColor: "#ffffff",
      headerHoverBgColor: t.p.soft,
      openHeaderBgColor: "#ffffff",
      openTextColor: t.p.primaryDark,
      contentColor: t.p.muted,
      iconStyle: "plus",
      iconColor: t.p.primary,
    },
    "FAQ",
  );
  const left = col(
    [
      eyebrow(c.eyebrow ?? "FAQ", t.p.primary),
      h(t, c.title ?? tr("Pertanyaan yang sering diajukan", "Frequently asked questions"), "h2"),
      para(c.text ?? tr("Belum menemukan jawabannya? Hubungi kami kapan saja.", "Can't find the answer? Contact us any time."), { color: t.p.muted }),
      ...(c.contact ? [linkButton(c.contact.label, c.contact.href, "outline", t.p)] : []),
    ],
    { gap: 12, name: "Judul FAQ" },
  );
  return stamp("pro-faq-accordion", section("FAQ Akordeon", [grid([left, col([acc], { name: "Pertanyaan" })], "minmax(0, 1fr) minmax(0, 1.6fr)", { gap: 48 })], { bg: t.alt, padY: 88 }));
}

/** Ribbon CTA (Free): a gradient ribbon with a call to action and two buttons. */
export function ctaBand(t: ProTheme = DEFAULT_PRO_THEME, tr: Tr = currentTr(), c: Partial<{ title: string; text: string; primary: Link; secondary: Link | null }> = {}): BoxNode {
  const secondary = c.secondary === undefined ? { label: tr("Hubungi kami", "Contact us"), href: "#kontak" } : c.secondary;
  const box = col(
    [
      h(t, c.title ?? tr("Siap meluncurkan website Anda?", "Ready to launch your website?"), "h2", { color: "#ffffff", align: "center" }),
      para(c.text ?? tr("Mulai gratis hari ini dan tingkatkan kapan saja Anda butuh lebih.", "Start free today and upgrade whenever you need more."), { color: "#e0e7ff", align: "center", size: 18 }),
      inline([linkButton((c.primary ?? { label: tr("Mulai gratis", "Start free") }).label, (c.primary ?? { href: "#mulai" }).href, "light", t.p), ...(secondary ? [linkButton(secondary.label, secondary.href, "dark", t.p)] : [])], { justify: "center" }),
    ],
    { gap: 16, align: "center", name: "Kotak CTA" },
  );
  box.bgEnabled = true;
  box.bgType = "gradient";
  box.gradientFrom = t.p.primary;
  box.gradientTo = t.p.primaryDark;
  box.gradientAngle = 120;
  box.bgColor = t.p.primary;
  box.borderRadius = t.radius + 8;
  box.padding = 56;
  addCss(box, "@media (max-width: 640px) { & { padding: 32px 20px; } }");
  return stamp("pro-cta-band", section("CTA Pita", [stack([box], { gap: 0, align: "stretch" })], { bg: t.bg, padY: 72 }));
}

/* ================================================================== */
/* PREMIUM                                                              */
/* ================================================================== */

/** Split Services (Premium): a large image + a list of services with icons. */
export function servicesSplit(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; image: string; imageAlt: string; items: FeatureItem[]; cta: Link | null; reverse: boolean }> = {},
): BoxNode {
  const items = c.items ?? [
    { icon: "01", title: tr("Strategi & riset", "Strategy & research"), text: tr("Memetakan tujuan bisnis dan kebutuhan pengguna sebelum mendesain.", "Mapping business goals and user needs before designing.") },
    { icon: "02", title: tr("Desain antarmuka", "Interface design"), text: tr("Sistem desain konsisten yang mudah dikembangkan tim Anda.", "A consistent design system your team can grow.") },
    { icon: "03", title: tr("Pengembangan", "Development"), text: tr("Website cepat, aman, dan siap dikelola sendiri.", "Fast, secure websites you can manage yourself.") },
  ];
  const cta = c.cta === undefined ? { label: tr("Diskusikan proyek", "Discuss a project"), href: "#kontak" } : c.cta;
  const list = col(
    [
      eyebrow(c.eyebrow ?? tr("Layanan", "Services"), t.p.primary),
      h(t, c.title ?? tr("Layanan menyeluruh dari ide hingga peluncuran", "End-to-end services from idea to launch"), "h2"),
      ...(c.text ? [para(c.text, { color: t.p.muted, size: 17 })] : []),
      ...items.map((s) =>
        col([iconTile(t, s.icon), col([h(t, s.title, "h3", { size: 18 }), para(s.text, { size: 15, color: t.p.muted })], { gap: 4, name: "Teks layanan" })], { layout: "row", gap: 16, name: "Layanan", stackOnMobile: false }),
      ),
      ...(cta ? [linkButton(cta.label, cta.href, "primary", t.p)] : []),
    ],
    { gap: 18, name: "Daftar layanan" },
  );
  const pic = col([image(c.image ?? asset("pro-services"), c.imageAlt ?? tr("Ilustrasi layanan", "Services illustration"), { ratio: "4 / 5", radius: t.radius + 6 })], { name: "Gambar" });
  return stamp("pro-services-split", section("Layanan Terbagi", [grid(c.reverse ? [list, pic] : [pic, list], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 56, align: "center" })], { bg: t.bg, padY: 96 }));
}

export interface Quote {
  text: string;
  name: string;
  role: string;
  avatar: string;
}

/** Testimonial Wall (Premium): rating score + 3 quote cards. */
export function testimonialsWall(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; score: number; caption: string; quotes: Quote[]; dark: boolean }> = {},
): BoxNode {
  const dark = !!c.dark;
  const quotes = c.quotes ?? [
    { text: tr("Konversi halaman kami naik 38% dalam sebulan setelah ganti desain.", "Our page conversion rose 38% within a month of the redesign."), name: "Rina Kusuma", role: tr("Pemilik, Toko Rina", "Owner, Toko Rina"), avatar: asset("pro-team-2") },
    { text: tr("Tim kami bisa merilis halaman kampanye tanpa menunggu developer.", "Our team ships campaign pages without waiting for developers."), name: "Bayu Pratama", role: "Marketing Lead, Kopiku", avatar: asset("pro-team-1") },
    { text: tr("Kodenya rapi dan mudah dilanjutkan. Hemat waktu berminggu-minggu.", "The code is tidy and easy to extend. Saved us weeks."), name: "Dewi Lestari", role: "CTO, Finly", avatar: asset("pro-team-3") },
  ];
  const ink = dark ? "#ffffff" : t.p.ink;
  const rating = el("rating", { value: c.score ?? 4.9, caption: c.caption ?? tr("dari 2.400+ ulasan", "from 2,400+ reviews"), textColor: dark ? "#e2e8f0" : t.p.muted, size: 24 }, "Rating");
  const quoteCard = (q: Quote) =>
    col(
      [
        para(`“${q.text}”`, { size: 17, color: ink }),
        col(
          [col([image(q.avatar, q.name, { ratio: "1 / 1", radius: 999 })], { width: 52, name: "Foto" }), col([para(q.name, { weight: 700, color: ink, size: 15 }), para(q.role, { size: 13, color: dark ? "#94a3b8" : t.p.muted })], { gap: 0, name: "Nama" })],
          { layout: "row", gap: 14, name: "Penulis", stackOnMobile: false },
        ),
      ],
      { card: { bg: dark ? "#111827" : "#ffffff", border: dark ? "#1f2937" : t.p.line, radius: t.radius, padding: 28 }, gap: 20, name: "Testimoni" },
    );
  return stamp(
    "pro-testimonials-wall",
    section(
      "Dinding Testimoni",
      [
        stack([...(c.eyebrow !== "" ? [eyebrow(c.eyebrow ?? tr("Testimoni", "Testimonials"), dark ? "#a5b4fc" : t.p.primary, "center")] : []), h(t, c.title ?? tr("Dicintai ribuan pelanggan", "Loved by thousands of customers"), "h2", { align: "center", color: ink }), rating], { gap: 12, align: "center" }),
        grid(quotes.map(quoteCard), Math.min(3, quotes.length), { gap: 24, align: "stretch" }),
      ],
      { bg: dark ? t.dark : t.alt, padY: 96 },
    ),
  );
}

export interface Plan {
  name: string;
  price: string;
  period: string;
  text: string;
  features: string[];
  cta: Link;
  featured?: boolean;
}

/** 3-Plan Pricing (Premium): plan cards, featured plan in dark. */
export function pricingCards(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; plans: Plan[]; badge: string }> = {},
): BoxNode {
  const plans = c.plans ?? [
    { name: "Basic", price: "Rp0", period: tr("/bulan", "/month"), text: tr("Untuk mencoba.", "For trying things out."), features: [tr("1 website", "1 website"), tr("3 halaman", "3 pages"), tr("Subdomain gratis", "Free subdomain")], cta: { label: tr("Mulai gratis", "Start free"), href: "#mulai" } },
    { name: "Pro", price: "Rp99rb", period: tr("/bulan", "/month"), text: tr("Untuk bisnis yang tumbuh.", "For growing businesses."), features: [tr("5 website", "5 websites"), tr("Halaman tanpa batas", "Unlimited pages"), tr("Domain kustom", "Custom domain"), tr("Analitik", "Analytics")], cta: { label: tr("Pilih Pro", "Choose Pro"), href: "#pro" }, featured: true },
    { name: "Business", price: "Rp299rb", period: tr("/bulan", "/month"), text: tr("Untuk tim & agensi.", "For teams & agencies."), features: [tr("Website tanpa batas", "Unlimited websites"), tr("Kolaborasi tim", "Team collaboration"), tr("Dukungan prioritas", "Priority support")], cta: { label: tr("Hubungi sales", "Contact sales"), href: "#kontak" } },
  ];
  const planCard = (pl: Plan) => {
    const ink = pl.featured ? "#ffffff" : t.p.ink;
    return col(
      [
        ...(pl.featured ? [badge(c.badge ?? tr("Paling populer", "Most popular"), t.p.primary, "#ffffff")] : []),
        h(t, pl.name, "h3", { size: 20, color: ink }),
        para(pl.text, { size: 14, color: pl.featured ? "#c7d2fe" : t.p.muted }),
        col([h(t, pl.price, "h2", { size: 40, color: ink, full: false }), para(pl.period, { size: 14, color: pl.featured ? "#c7d2fe" : t.p.muted, full: false })], { layout: "row", gap: 6, name: "Harga", stackOnMobile: false }),
        el("list", { items: pl.features, listStyleType: "none", markerColor: pl.featured ? "#a5b4fc" : t.p.primary, bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, dividerEnabled: false, itemHoverEnabled: false, textColor: pl.featured ? "#e0e7ff" : t.p.muted, paddingLeft: 0, paddingRight: 0 }),
        linkButton(pl.cta.label, pl.cta.href, pl.featured ? "light" : "outline", t.p, { full: true }),
      ],
      { card: { bg: pl.featured ? t.dark : "#ffffff", border: pl.featured ? undefined : t.p.line, radius: t.radius, padding: 30 }, gap: 14, name: "Paket" },
    );
  };
  return stamp(
    "pro-pricing-cards",
    section(
      "Harga 3 Paket",
      [
        intro(t, { eyebrow: c.eyebrow ?? tr("Harga", "Pricing"), title: c.title ?? tr("Harga sederhana, tanpa kejutan", "Simple pricing, no surprises"), text: c.text ?? tr("Ganti paket atau berhenti kapan saja.", "Switch plans or cancel any time.") }),
        grid(plans.map(planCard), Math.min(3, plans.length), { gap: 24, align: "stretch" }),
      ],
      { bg: t.bg, padY: 96 },
    ),
  );
}

export interface Work {
  title: string;
  tag: string;
  image: string;
}

/** Mosaic Portfolio (Premium): 2 large works + 3 small works. */
export function portfolioMosaic(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; works: Work[]; cta: Link | null }> = {},
): BoxNode {
  const works = c.works ?? [
    { title: "Finly App", tag: tr("Aplikasi keuangan", "Finance app"), image: asset("pro-work-1") },
    { title: "Kopiku", tag: tr("Branding & web", "Branding & web"), image: asset("pro-work-2") },
    { title: "Sehatku", tag: tr("Platform kesehatan", "Health platform"), image: asset("pro-work-3") },
    { title: "Ruang Kelas", tag: tr("Edtech", "Edtech"), image: asset("pro-work-4") },
    { title: "Hijau Market", tag: "E-commerce", image: asset("pro-work-5") },
  ];
  const workCard = (w: Work, ratio: string) =>
    col([image(w.image, w.title, { ratio, radius: t.radius }), col([h(t, w.title, "h3", { size: 18 }), para(w.tag, { size: 14, color: t.p.muted })], { gap: 2, name: "Keterangan" })], { gap: 12, name: "Karya" });
  const cta = c.cta === undefined ? { label: tr("Lihat semua karya", "See all work"), href: "#karya" } : c.cta;
  return stamp(
    "pro-portfolio-mosaic",
    section(
      "Portofolio Mozaik",
      [
        grid(
          [
            col([eyebrow(c.eyebrow ?? tr("Karya pilihan", "Selected work"), t.p.primary), h(t, c.title ?? tr("Proyek yang kami banggakan", "Projects we are proud of"), "h2")], { gap: 8, name: "Judul" }),
            col([para(c.text ?? tr("Kolaborasi dengan startup dan brand di Asia Tenggara.", "Collaborations with startups and brands across Southeast Asia."), { color: t.p.muted }), ...(cta ? [linkButton(cta.label, cta.href, "outline", t.p)] : [])], { gap: 12, name: "Deskripsi" }),
          ],
          "minmax(0, 1.2fr) minmax(0, 1fr)",
          { gap: 32, align: "end" },
        ),
        grid(works.slice(0, 2).map((w) => workCard(w, "16 / 10")), "minmax(0, 1.4fr) minmax(0, 1fr)", { gap: 24 }),
        grid(works.slice(2, 5).map((w) => workCard(w, "4 / 3")), 3, { gap: 24 }),
      ],
      { bg: t.bg, padY: 96 },
    ),
  );
}

export interface Member {
  name: string;
  role: string;
  photo: string;
  links?: Link[];
}

/** Team Cards (Premium): 4 profiles with photo, role, social links. */
export function teamCards(t: ProTheme = DEFAULT_PRO_THEME, tr: Tr = currentTr(), c: Partial<{ eyebrow: string; title: string; text: string; members: Member[] }> = {}): BoxNode {
  const members = c.members ?? [
    { name: "Andi Wijaya", role: "CEO", photo: asset("pro-team-1") },
    { name: "Sari Utami", role: tr("Kepala Desain", "Head of Design"), photo: asset("pro-team-2") },
    { name: "Raka Putra", role: "Lead Engineer", photo: asset("pro-team-3") },
    { name: "Maya Sari", role: tr("Manajer Produk", "Product Manager"), photo: asset("pro-team-4") },
  ];
  const linkEl = (l: Link) => el("anchor", { text: l.label, href: l.href, underline: "none", fontSize: 13, fontWeight: 600, textColor: t.p.primary, hoverEnabled: true, hoverTextColor: t.p.primaryDark }, "Tautan");
  return stamp(
    "pro-team-cards",
    section(
      "Kartu Tim",
      [
        intro(t, { eyebrow: c.eyebrow ?? tr("Tim", "Team"), title: c.title ?? tr("Orang-orang di balik layar", "The people behind the work"), text: c.text }),
        grid(
          members.map((m) =>
            col(
              [
                image(m.photo, m.name, { ratio: "1 / 1", radius: t.radius }),
                h(t, m.name, "h3", { size: 18 }),
                para(m.role, { size: 14, color: t.p.muted }),
                inline((m.links ?? [{ label: "LinkedIn", href: "#" }, { label: "Email", href: "#" }]).map(linkEl), { gap: 14 }),
              ],
              { card: { bg: "#ffffff", border: t.p.line, radius: t.radius + 4, padding: 16 }, gap: 8, name: "Anggota" },
            ),
          ),
          Math.min(4, members.length),
          { gap: 20, align: "stretch" },
        ),
      ],
      { bg: t.alt, padY: 96 },
    ),
  );
}

/** Stats Ribbon (Premium): dark background, heading on top, 4 number cards. */
export function statsBand(
  t: ProTheme = DEFAULT_PRO_THEME,
  tr: Tr = currentTr(),
  c: Partial<{ eyebrow: string; title: string; text: string; stats: [string, string][] }> = {},
): BoxNode {
  const stats = c.stats ?? [
    ["12K+", tr("Website diluncurkan", "Websites launched")],
    ["98%", tr("Pelanggan puas", "Happy customers")],
    ["35", tr("Negara", "Countries")],
    ["24/7", tr("Dukungan", "Support")],
  ];
  const stat = ([n, l]: [string, string]) =>
    col([h(t, n, "h2", { size: 44, color: "#ffffff" }), para(l, { size: 14, color: "#94a3b8" })], { gap: 4, name: "Statistik", card: { bg: "#ffffff0d", border: "#ffffff1a", radius: t.radius, padding: 24 } });
  return stamp(
    "pro-stats-band",
    section(
      "Pita Statistik",
      [
        stack(
          [
            eyebrow(c.eyebrow ?? tr("Dalam angka", "By the numbers"), "#a5b4fc"),
            h(t, c.title ?? tr("Dipercaya bisnis dari berbagai skala", "Trusted by businesses of every size"), "h2", { color: "#ffffff" }),
            para(c.text ?? tr("Angka yang terus tumbuh berkat pelanggan yang luar biasa.", "Numbers that keep growing thanks to amazing customers."), { color: "#cbd5e1", size: 17 }),
          ],
          { gap: 12 },
        ),
        grid(stats.map(stat), 4, { gap: 16, align: "stretch" }),
      ],
      { bg: t.dark, padY: 96 },
    ),
  );
}

/* ================================================================== */
/* Registry                                                             */
/* ================================================================== */

export interface ProPresetDef {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  family: "stack" | "row" | "grid";
  /** Catalog category (hero, features, faq, …). */
  category: string;
  build: () => BoxNode;
}

/** Display order; tier is set by PRO_FREE_IDS. */
export const PRO_PRESETS: ProPresetDef[] = [
  { id: "pro-hero-spotlight", name: "Hero Sorotan", nameEn: "Spotlight Hero", description: "Judul besar rata tengah, dua tombol, dan gambar produk lebar.", descriptionEn: "Centered headline, two buttons, and a wide product image.", family: "stack", category: "hero", build: () => heroSpotlight() },
  { id: "pro-features-icons", name: "Fitur Ikon", nameEn: "Icon Features", description: "Judul section dan tiga kartu fitur ber-ikon.", descriptionEn: "Section title and three icon feature cards.", family: "grid", category: "features", build: () => featuresIcons() },
  { id: "pro-faq-accordion", name: "FAQ Akordeon", nameEn: "FAQ Accordion", description: "Judul di kiri, pertanyaan yang bisa dibuka-tutup di kanan.", descriptionEn: "Title on the left, collapsible questions on the right.", family: "grid", category: "faq", build: () => faqAccordion() },
  { id: "pro-cta-band", name: "CTA Pita", nameEn: "CTA Band", description: "Kotak gradient dengan ajakan dan dua tombol.", descriptionEn: "Gradient box with a call to action and two buttons.", family: "stack", category: "cta", build: () => ctaBand() },
  { id: "pro-services-split", name: "Layanan Terbagi", nameEn: "Split Services", description: "Gambar besar dan daftar layanan bernomor.", descriptionEn: "Large image with a numbered services list.", family: "grid", category: "services", build: () => servicesSplit() },
  { id: "pro-testimonials-wall", name: "Dinding Testimoni", nameEn: "Testimonial Wall", description: "Skor rating dan tiga kartu kutipan pelanggan.", descriptionEn: "Rating score and three customer quote cards.", family: "grid", category: "testimonials", build: () => testimonialsWall() },
  { id: "pro-pricing-cards", name: "Harga 3 Paket", nameEn: "3-Plan Pricing", description: "Tiga kartu paket dengan paket unggulan gelap.", descriptionEn: "Three plan cards with a dark featured plan.", family: "grid", category: "pricing", build: () => pricingCards() },
  { id: "pro-portfolio-mosaic", name: "Portofolio Mozaik", nameEn: "Portfolio Mosaic", description: "Dua karya besar dan tiga karya kecil dengan keterangan.", descriptionEn: "Two large and three small projects with captions.", family: "grid", category: "portfolio", build: () => portfolioMosaic() },
  { id: "pro-team-cards", name: "Kartu Tim", nameEn: "Team Cards", description: "Empat profil anggota tim dengan foto dan tautan.", descriptionEn: "Four team profiles with photos and links.", family: "grid", category: "team", build: () => teamCards() },
  { id: "pro-stats-band", name: "Pita Statistik", nameEn: "Statistics Band", description: "Latar gelap, judul di atas, empat kartu angka.", descriptionEn: "Dark background, heading on top, four figure cards.", family: "grid", category: "statistics", build: () => statsBand() },
];

/** 4 free Pro presets (see NEW_SECTION_SPLIT in config/marketplace.ts). */
export const PRO_FREE_IDS = ["pro-hero-spotlight", "pro-features-icons", "pro-faq-accordion", "pro-cta-band"];
