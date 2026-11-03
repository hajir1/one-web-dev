import type { BoxNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import { createRow } from "../../../../pageMaker/helpers/rowModel";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import type { ProTheme } from "../../../../pageMaker/helpers/sectionPresetsPro";
import { badge, button, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../../build";
import type { TemplatePageDef } from "../../../types";
import { FONTS, listingCard, logo, menu, pageWith, theme } from "../../pro/kit";

/* ================================================================== */
/* Perangkat template v2 bagian A                                        */
/*                                                                    */
/* Kumpulan penyusun section yang bisa dikombinasikan bebas. Setiap      */
/* template memilih section, urutan, gaya hero, header & footer sendiri, */
/* jadi 25 template tidak berasal dari satu fungsi generik. Semua dibuat */
/* dari elemen Page Maker (Section → Row → Elemen) dan bisa diedit penuh. */
/* ================================================================== */

export { FONTS };

/** Tema template: palet + latar + radius + font judul & isi. */
export interface Look extends ProTheme {
  font: string;
  /** Latar halaman (root). */
  page: string;
}

export function look(p: Palette, o: Partial<Omit<Look, "p">> = {}): Look {
  const t = theme(p, o);
  return { ...t, font: o.font ?? FONTS.sans, page: o.page ?? t.bg };
}

export const page = (L: Look, sections: BoxNode[]): PageDoc => pageWith(sections, L.font, L.page);

/* ------------------------------ halaman ---------------------------- */

export const home = (id = "Beranda", en = "Home"): TemplatePageDef => ({ key: "home", slug: { id: "index", en: "index" }, name: { id, en }, home: true });

/** Definisi halaman: kunci, [slug, nama] ID, [slug, nama] EN. */
export const pg = (key: string, idv: [string, string], env: [string, string]): TemplatePageDef => ({ key, slug: { id: idv[0], en: env[0] }, name: { id: idv[1], en: env[1] } });

/* ------------------------------ teks ------------------------------- */

function addCss(n: ElementNode | BoxNode, decl: string): void {
  const cur = n.advanced?.customCss ?? "";
  n.advanced = { ...n.advanced, customCss: cur.includes("{") ? `${cur}\n& { ${decl} }` : `${cur}${cur ? "\n" : ""}${decl}` };
}

/** Judul dengan font judul tema. */
export function H(L: Look, text: string, tag: "h1" | "h2" | "h3" | "h4", o: Parameters<typeof heading>[2] = {}): ElementNode {
  const n = heading(text, tag, { color: L.p.ink, ...o });
  if (L.headFont) addCss(n, `font-family: ${L.headFont};`);
  return n;
}

export const P = (L: Look, text: string, o: Parameters<typeof para>[1] = {}) => para(text, { color: L.p.muted, ...o });

/** Aksi: [label, href, jenis]. */
export type Act = [string, string, ("primary" | "outline" | "light" | "dark")?];
export const acts = (L: Look, list: Act[], justify: "start" | "center" = "start") => inline(list.map(([l, h, k]) => linkButton(l, h, k ?? "primary", L.p)), { justify });

/** Kotak ikon (teks/emoji) bergaya. */
function tile(L: Look, glyph: string, o: { bg?: string; color?: string; round?: boolean } = {}): ElementNode {
  const n = el("text", { text: glyph, tag: "p", fontSize: 22, fontWeight: 800, textColor: o.color ?? L.p.primary, textAlign: "center", widthMode: "auto" }, "Ikon");
  n.advanced = { customCss: `display: inline-flex; align-items: center; justify-content: center; width: 52px; height: 52px; border-radius: ${o.round ? "999px" : `${Math.max(8, L.radius - 4)}px`}; background: ${o.bg ?? L.p.soft};` };
  return n;
}

/** Intro section (eyebrow + judul + teks). */
function introEls(L: Look, c: { eyebrow?: string; title: string; text?: string; align?: "left" | "center"; light?: boolean }): ElementNode[] {
  const align = c.align ?? "center";
  return [
    ...(c.eyebrow ? [eyebrow(c.eyebrow, c.light ? L.p.line : L.p.primary, align)] : []),
    H(L, c.title, "h2", { align, color: c.light ? "#ffffff" : L.p.ink }),
    ...(c.text ? [P(L, c.text, { align, size: 17, color: c.light ? "#cbd5e1" : L.p.muted })] : []),
  ];
}

function intro(L: Look, c: Parameters<typeof introEls>[1]): BoxNode {
  return stack(introEls(L, c), { gap: 10, align: "stretch" });
}
type Intro = Parameters<typeof intro>[1];

/* ------------------------------ header ----------------------------- */

/** Header dengan bilah info di atas (telepon, jam buka) + logo, menu, CTA. */
export function headerBar(brand: string, L: Look, c: { info: string[]; cta?: ElementNode; bg?: string; ink?: string; barInk?: string; nav?: ElementNode }): BoxNode {
  const ink = c.ink ?? L.p.ink;
  const nav = c.nav ?? menu(L.p, ink === "#ffffff" ? "#e2e8f0" : "#334155");
  const bar = createRow({
    name: "Row Info",
    padding: 0,
    layout: "row",
    align: "center",
    justify: "between",
    wrap: true,
    gap: 12,
    stackOnMobile: false,
    children: c.info.map((t) => para(t, { size: 13, weight: 600, color: c.barInk ?? (ink === "#ffffff" ? "#cbd5e1" : L.p.muted), full: false })),
  });
  bar.advanced = { customCss: `padding-bottom: 10px; margin-bottom: 14px; border-bottom: 1px solid ${ink === "#ffffff" ? "#ffffff26" : L.p.line};` };
  const main = createRow({
    name: "Row Header",
    padding: 0,
    layout: "row",
    align: "center",
    justify: "between",
    wrap: false,
    gap: 16,
    stackOnMobile: false,
    children: [logo(brand, ink, L.headFont), col([nav, ...(c.cta ? [c.cta] : [])], { layout: "row", gap: 16, name: "Navigasi", stackOnMobile: false, wrap: false })],
  });
  return section("Header", [bar, main], { bg: c.bg ?? "#ffffff", padY: 16, tag: "header" });
}

/** Header: logo + menu di kiri berdampingan, CTA di kanan (gaya aplikasi). */
export function headerLeft(brand: string, L: Look, c: { cta?: ElementNode; bg?: string; ink?: string; sticky?: boolean; nav?: ElementNode }): BoxNode {
  const ink = c.ink ?? L.p.ink;
  const nav = c.nav ?? menu(L.p, ink === "#ffffff" ? "#cbd5e1" : "#475569", { gap: 18 });
  if (!c.nav) nav.state = { ...nav.state, align: "start" };
  const row = createRow({
    name: "Row Header",
    padding: 0,
    layout: "row",
    align: "center",
    justify: "between",
    wrap: false,
    gap: 16,
    stackOnMobile: false,
    children: [col([logo(brand, ink, L.headFont, 22), nav], { layout: "row", gap: 36, name: "Logo & menu" }), ...(c.cta ? [c.cta] : [])],
  });
  const s = section("Header", [row], { bg: c.bg ?? "#ffffff", padY: 14, tag: "header" });
  if (c.sticky) s.advanced = { customCss: "position: sticky; top: 0; z-index: 40;" };
  return s;
}

/* ------------------------------ footer ----------------------------- */

/** Footer ringkas satu baris: merek, tautan, hak cipta. */
export function footerSlim(L: Look, brand: string, items: string[], copy: string, o: { bg?: string; ink?: string } = {}): BoxNode {
  const ink = o.ink ?? "#e5e7eb";
  return section(
    "Footer",
    [
      grid(
        [
          col([logo(brand, ink, L.headFont, 18), para(copy, { size: 13, color: ink, full: false })], { gap: 6, name: "Merek" }),
          col([inline(items.map((t) => para(t, { size: 14, color: ink, full: false, weight: 600 })), { gap: 20, justify: "end" })], { name: "Tautan", align: "stretch" }),
        ],
        "minmax(0, 1fr) minmax(0, 1.4fr)",
        { gap: 24, align: "center" },
      ),
    ],
    { bg: o.bg ?? L.dark, padY: 36, tag: "footer" },
  );
}

/* ------------------------------ hero ------------------------------- */

interface HeroBase {
  badge?: string;
  eyebrow?: string;
  title: string;
  text: string;
  actions?: Act[];
  note?: string;
  extra?: (ElementNode | BoxNode)[];
  size?: number;
  /** Ganti judul teks dengan elemen lain (mis. Teks Mengetik). */
  titleNode?: ElementNode;
}

/** Hero dua kolom: teks + gambar (bisa dibalik, latar terang/gelap/gradien). */
export function heroSplit(L: Look, c: HeroBase & { image: string; alt: string; ratio?: string; reverse?: boolean; bg?: string; gradient?: [string, string, number?]; light?: boolean; padY?: number }): BoxNode {
  const ink = c.light ? "#ffffff" : L.p.ink;
  const muted = c.light ? "#d1d5db" : L.p.muted;
  const text = col(
    [
      ...(c.badge ? [badge(c.badge, c.light ? "#ffffff1f" : L.p.soft, c.light ? "#ffffff" : L.p.primaryDark, c.light ? "#ffffff33" : L.p.line)] : []),
      ...(c.eyebrow ? [eyebrow(c.eyebrow, c.light ? L.p.line : L.p.primary)] : []),
      c.titleNode ?? H(L, c.title, "h1", { size: c.size ?? 52, color: ink }),
      P(L, c.text, { size: 18, color: muted }),
      ...(c.actions ? [acts(L, c.actions)] : []),
      ...(c.extra ?? []),
      ...(c.note ? [P(L, c.note, { size: 13, color: muted })] : []),
    ],
    { gap: 18, name: "Teks hero" },
  );
  const pic = col([image(c.image, c.alt, { ratio: c.ratio ?? "4 / 3", radius: L.radius + 6, shadow: !c.light })], { name: "Gambar" });
  return section(
    "Hero",
    [grid(c.reverse ? [pic, text] : [text, pic], c.reverse ? "minmax(0, 1fr) minmax(0, 1.1fr)" : "minmax(0, 1.1fr) minmax(0, 1fr)", { gap: 56, align: "center" })],
    c.gradient ? { gradient: c.gradient, padY: c.padY ?? 96 } : { bg: c.bg ?? L.bg, padY: c.padY ?? 96 },
  );
}

/** Hero sampul: teks rata tengah di latar gelap/berwarna, gambar lebar opsional di bawah. */
export function heroCover(L: Look, c: HeroBase & { bg?: string; gradient?: [string, string, number?]; image?: string; alt?: string; light?: boolean; ratio?: string }): BoxNode {
  const light = c.light ?? true;
  const ink = light ? "#ffffff" : L.p.ink;
  const rows = [
    stack(
      [
        ...(c.badge ? [badge(c.badge, light ? "#ffffff1f" : L.p.soft, light ? "#ffffff" : L.p.primaryDark, light ? "#ffffff40" : L.p.line)] : []),
        ...(c.eyebrow ? [eyebrow(c.eyebrow, light ? L.p.line : L.p.primary, "center")] : []),
        c.titleNode ?? H(L, c.title, "h1", { size: c.size ?? 60, color: ink, align: "center" }),
        P(L, c.text, { size: 19, color: light ? "#e5e7eb" : L.p.muted, align: "center" }),
        ...(c.actions ? [acts(L, c.actions, "center")] : []),
        ...(c.extra ?? []),
        ...(c.note ? [P(L, c.note, { size: 13, color: light ? "#cbd5e1" : L.p.muted, align: "center" })] : []),
      ],
      { gap: 18, align: "center" },
    ),
  ];
  if (c.image) rows.push(stack([image(c.image, c.alt ?? c.title, { ratio: c.ratio ?? "21 / 9", radius: L.radius + 8 })], { gap: 0, align: "stretch" }));
  return section("Hero", rows, c.gradient ? { gradient: c.gradient, padY: 112, width: 1040 } : { bg: c.bg ?? L.dark, padY: 112, width: 1040 });
}

/** Banner judul halaman dalam (breadcrumb + judul + teks). */
export function pageBanner(L: Look, c: { eyebrow?: string; title: string; text?: string; crumbs?: [string, string][]; bg?: string; light?: boolean; align?: "left" | "center" }): BoxNode {
  const light = c.light ?? false;
  const align = c.align ?? "left";
  const kids: ElementNode[] = [];
  if (c.crumbs)
    kids.push(
      el(
        "breadcrumbs",
        {
          items: c.crumbs.map(([label, href]) => ({ label, href })),
          bgColor: "transparent",
          borderWidth: 0,
          paddingLeft: 0,
          paddingRight: 0,
          paddingTop: 0,
          paddingBottom: 0,
          textColor: light ? "#cbd5e1" : L.p.muted,
          currentColor: light ? "#ffffff" : L.p.ink,
          linkHoverColor: L.p.primary,
        },
        "Breadcrumbs",
      ),
    );
  if (c.eyebrow) kids.push(eyebrow(c.eyebrow, light ? L.p.line : L.p.primary, align));
  kids.push(H(L, c.title, "h1", { size: 46, color: light ? "#ffffff" : L.p.ink, align }));
  if (c.text) kids.push(P(L, c.text, { size: 18, color: light ? "#d1d5db" : L.p.muted, align }));
  return section("Judul halaman", [stack(kids, { gap: 12, align: align === "center" ? "center" : "start" })], { bg: c.bg ?? (light ? L.dark : L.alt), padY: 72, width: align === "center" ? 860 : 1120 });
}

/* ---------------------------- konten umum -------------------------- */

export interface Item {
  icon?: string;
  title: string;
  text: string;
  meta?: string;
}

/** Kartu fitur/layanan. Varian: card (kartu ber-ikon), line (garis atas), num (bernomor), dark (latar gelap). */
export function cards(L: Look, c: Intro & { items: Item[]; cols?: number; bg?: string; variant?: "card" | "line" | "num" | "dark"; name?: string }): BoxNode {
  const v = c.variant ?? "card";
  const dark = v === "dark";
  const cell = (it: Item, i: number) => {
    const head: ElementNode[] = [];
    if (v === "num") head.push(H(L, String(i + 1).padStart(2, "0"), "h2", { size: 36, color: L.p.primary }));
    else if (it.icon) head.push(tile(L, it.icon, dark ? { bg: "#ffffff14", color: L.p.line } : {}));
    const kids = [
      ...head,
      H(L, it.title, "h3", { size: 19, color: dark ? "#ffffff" : L.p.ink }),
      P(L, it.text, { size: 15, color: dark ? "#cbd5e1" : L.p.muted }),
      ...(it.meta ? [para(it.meta, { size: 13, weight: 700, color: dark ? L.p.line : L.p.primaryDark })] : []),
    ];
    if (v === "line") {
      const box = col(kids, { gap: 10, name: "Item" });
      box.advanced = { customCss: `border-top: 3px solid ${L.p.primary}; padding-top: 18px;` };
      return box;
    }
    return col(kids, { gap: 10, name: "Kartu", card: dark ? { bg: "#ffffff0d", border: "#ffffff1f", radius: L.radius, padding: 26 } : { bg: "#ffffff", border: L.p.line, radius: L.radius, padding: 26 } });
  };
  return section(c.name ?? "Kartu", [intro(L, { ...c, light: dark || c.light }), grid(c.items.map(cell), c.cols ?? Math.min(3, c.items.length), { gap: 22, align: "stretch" })], { bg: c.bg ?? (dark ? L.dark : L.bg), padY: 88 });
}

/** Cerita/teks + gambar berdampingan, dengan daftar poin opsional. */
export function story(L: Look, c: { eyebrow?: string; title: string; paras: string[]; bullets?: string[]; image: string; alt: string; reverse?: boolean; bg?: string; actions?: Act[]; ratio?: string; light?: boolean; name?: string }): BoxNode {
  const light = !!c.light;
  const txt = col(
    [
      ...(c.eyebrow ? [eyebrow(c.eyebrow, light ? L.p.line : L.p.primary)] : []),
      H(L, c.title, "h2", { color: light ? "#ffffff" : L.p.ink }),
      ...c.paras.map((t) => P(L, t, { size: 16, color: light ? "#d1d5db" : L.p.muted })),
      ...(c.bullets ? [checklist(L, c.bullets, light)] : []),
      ...(c.actions ? [acts(L, c.actions)] : []),
    ],
    { gap: 14, name: "Teks" },
  );
  const pic = col([image(c.image, c.alt, { ratio: c.ratio ?? "5 / 4", radius: L.radius })], { name: "Gambar" });
  return section(c.name ?? "Cerita", [grid(c.reverse ? [txt, pic] : [pic, txt], 2, { gap: 56, align: "center" })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Daftar poin bercentang (List Element). */
export function checklist(L: Look, items: string[], light = false): ElementNode {
  return el(
    "list",
    {
      items: items.map((t) => `✓ ${t}`),
      listStyleType: "none",
      bgColor: "transparent",
      borderWidth: 0,
      borderStyle: "none",
      shadowEnabled: false,
      textColor: light ? "#e5e7eb" : L.p.ink,
      fontSize: 15,
      dividerEnabled: false,
      itemHoverEnabled: false,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemPaddingX: 0,
      itemPaddingY: 5,
    },
    "Daftar",
  );
}

export interface Listing {
  image: string;
  title: string;
  text: string;
  price: string;
  compare?: string;
  badge?: string;
  rating?: number;
  reviews?: string;
  cta: string;
  href: string;
}

/** Grid kartu listing (Product Card gratis): kelas, kamar, paket, produk. */
export function listings(L: Look, c: Intro & { items: Listing[]; cols?: number; bg?: string; name?: string }): BoxNode {
  return section(
    c.name ?? "Daftar",
    [intro(L, c), grid(c.items.map((it) => col([listingCard({ ...it, p: L.p })], { name: "Item" })), c.cols ?? 3, { gap: 22, align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Tabel data (Table Element gratis): jadwal, tarif, spesifikasi. */
export function tableBlock(L: Look, c: Intro & { columns: string[]; rows: string[][]; bg?: string; note?: string; name?: string }): BoxNode {
  const t = el(
    "table",
    {
      columns: c.columns.map((label, i) => ({ id: `col-${i}`, label })),
      rows: c.rows,
      headerBgColor: L.p.soft,
      headerTextColor: L.p.ink,
      stripeColor: L.alt,
      rowHoverColor: L.p.soft,
      borderRadius: Math.min(L.radius, 16),
      shadowEnabled: false,
      outerBorderColor: L.p.line,
      dividerColor: L.p.line,
    },
    "Tabel",
  );
  return section(c.name ?? "Tabel", [intro(L, c), stack([t, ...(c.note ? [P(L, c.note, { size: 13 })] : [])], { gap: 10, align: "stretch" })], { bg: c.bg ?? L.bg, padY: 80 });
}

/** Tab konten (Tabs Element gratis). */
export function tabsBlock(L: Look, c: Intro & { tabs: [string, string][]; bg?: string; variant?: "underline" | "pills" | "boxed"; name?: string }): BoxNode {
  return section(
    c.name ?? "Tab",
    [
      intro(L, c),
      stack(
        [el("tabs", { tabs: c.tabs.map(([title, content]) => ({ title, content })), widthMode: "full", variant: c.variant ?? "underline", activeTextColor: L.p.primaryDark, indicatorColor: L.p.primary, activeBgColor: L.p.soft, panelFontSize: 16 }, "Tab")],
        { align: "stretch" },
      ),
    ],
    { bg: c.bg ?? L.bg, padY: 80, width: 960 },
  );
}

/** Linimasa vertikal: label waktu di kiri, isi di kanan (satu Row per langkah). */
export function timeline(L: Look, c: Intro & { steps: [string, string, string][]; bg?: string; name?: string }): BoxNode {
  const rows = c.steps.map(([label, title, text]) => {
    const r = grid(
      [
        col([para(label, { size: 14, weight: 800, color: L.p.primary })], { name: "Waktu" }),
        col([H(L, title, "h3", { size: 19 }), P(L, text, { size: 15 })], { gap: 6, name: "Isi" }),
      ],
      "minmax(0, 160px) minmax(0, 1fr)",
      { gap: 24 },
    );
    r.advanced = { customCss: `border-left: 3px solid ${L.p.line}; padding-left: 20px; margin-bottom: 20px;` };
    return r;
  });
  return section(c.name ?? "Linimasa", [intro(L, { ...c, align: c.align ?? "left" }), ...rows], { bg: c.bg ?? L.bg, padY: 88, width: 960 });
}

/** Langkah horizontal bernomor dalam lingkaran. */
export function process(L: Look, c: Intro & { steps: [string, string][]; bg?: string; dark?: boolean }): BoxNode {
  const dark = !!c.dark;
  return section(
    "Proses",
    [
      intro(L, { ...c, light: dark }),
      grid(
        c.steps.map(([title, text], i) => col([tile(L, String(i + 1), { round: true, bg: dark ? L.p.primary : L.p.soft, color: dark ? "#ffffff" : L.p.primaryDark }), H(L, title, "h3", { size: 18, color: dark ? "#ffffff" : L.p.ink }), P(L, text, { size: 15, color: dark ? "#cbd5e1" : L.p.muted })], { gap: 10, name: "Langkah" })),
        c.steps.length,
        { gap: 24 },
      ),
    ],
    { bg: c.bg ?? (dark ? L.dark : L.alt), padY: 88 },
  );
}

/** Galeri gambar dengan keterangan. */
export function gallery(L: Look, c: Intro & { images: [string, string][]; cols?: number; ratio?: string; bg?: string; name?: string }): BoxNode {
  return section(
    c.name ?? "Galeri",
    [intro(L, c), grid(c.images.map(([src, cap]) => col([image(src, cap, { ratio: c.ratio ?? "1 / 1", radius: L.radius }), para(cap, { size: 14, color: L.p.muted })], { gap: 8, name: "Foto" })), c.cols ?? 3, { gap: 18 })],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Kutipan besar (teks biasa, gratis). */
export function bigQuote(L: Look, c: { text: string; name: string; role: string; bg?: string; light?: boolean }): BoxNode {
  const light = c.light ?? true;
  return section(
    "Kutipan",
    [
      stack(
        [
          H(L, "“", "h2", { size: 72, color: L.p.primary, align: "center" }),
          H(L, c.text, "h3", { size: 28, weight: 600, color: light ? "#ffffff" : L.p.ink, align: "center" }),
          para(`${c.name} · ${c.role}`, { size: 14, weight: 700, color: light ? L.p.line : L.p.primaryDark, align: "center" }),
        ],
        { gap: 12, align: "center" },
      ),
    ],
    { bg: c.bg ?? (light ? L.dark : L.alt), padY: 96, width: 860 },
  );
}

export type Field =
  | { kind: "input"; label: string; ph: string; type?: string }
  | { kind: "select"; label: string; ph: string; options: string[] }
  | { kind: "date"; label: string; mode?: "date" | "datetime-local" | "month" | "time" }
  | { kind: "check"; label: string };

export function field(L: Look, f: Field, i: number): ElementNode {
  if (f.kind === "select") return el("select", { labelText: f.label, placeholder: f.ph, options: f.options, widthMode: "full", focusBorderColor: L.p.primary, focusRingColor: L.p.primary, borderRadius: Math.min(L.radius, 12) }, f.label);
  if (f.kind === "date") return el("datepicker", { label: f.label, name: `tanggal-${i}`, mode: f.mode ?? "date", helper: "", focusColor: L.p.primary, radius: Math.min(L.radius, 12), required: false }, f.label);
  if (f.kind === "check") return el("checkbox", { labelText: f.label, defaultChecked: false, checkedBgColor: L.p.primary, checkedBorderColor: L.p.primary, focusRingColor: L.p.primary }, f.label);
  return el("input", { labelText: f.label, text: f.ph, inputType: f.type ?? "text", hoverBorderColor: L.p.primary, hoverShadowColor: L.p.primary, borderRadius: Math.min(L.radius, 12) }, f.label);
}

/** Formulir (tanpa pengiriman ke server) + info kontak. */
export function contact(L: Look, c: Intro & { info: [string, string][]; fields: Field[]; submit: string; bg?: string; note?: string; name?: string; formFirst?: boolean }): BoxNode {
  const info = col(
    [
      ...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []),
      H(L, c.title, "h2"),
      ...(c.text ? [P(L, c.text, { size: 17 })] : []),
      ...c.info.map(([k, v]) => col([para(k, { size: 12, weight: 700, color: L.p.primary, transform: "uppercase", spacing: 1 }), para(v, { size: 16, color: L.p.ink, weight: 600 })], { gap: 2, name: "Info" })),
    ],
    { gap: 16, name: "Info kontak" },
  );
  const form = col([...c.fields.map((f, i) => field(L, f, i)), button(c.submit, L.p, { full: true, type: "submit" }), ...(c.note ? [P(L, c.note, { size: 13 })] : [])], {
    gap: 14,
    name: "Formulir",
    card: { bg: "#ffffff", border: L.p.line, radius: L.radius, padding: 28 },
  });
  return section(c.name ?? "Kontak", [grid(c.formFirst ? [form, info] : [info, form], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 48, align: "start" })], { bg: c.bg ?? L.alt, padY: 88 });
}

export interface Post {
  image: string;
  tag: string;
  title: string;
  text: string;
  date: string;
  href: string;
}

/** Daftar artikel/berita. */
export function posts(L: Look, c: Intro & { items: Post[]; cols?: number; bg?: string; name?: string; readLabel: string }): BoxNode {
  const card = (x: Post) =>
    col(
      [
        image(x.image, x.title, { ratio: "16 / 10", radius: L.radius }),
        inline([badge(x.tag, L.p.soft, L.p.primaryDark, L.p.line), para(x.date, { size: 13, color: L.p.muted, full: false })], { gap: 10 }),
        H(L, x.title, "h3", { size: 20 }),
        P(L, x.text, { size: 15 }),
        el("anchor", { text: `${c.readLabel} →`, href: x.href, underline: "hover", fontSize: 14, fontWeight: 700, textColor: L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan"),
      ],
      { gap: 10, name: "Artikel" },
    );
  return section(c.name ?? "Artikel", [intro(L, c), grid(c.items.map(card), c.cols ?? 3, { gap: 28 })], { bg: c.bg ?? L.bg, padY: 88 });
}

/** Isi artikel panjang. */
export function article(L: Look, c: { crumbs: [string, string][]; tag: string; title: string; meta: string; image: string; lead: string; blocks: [string, string][]; quote?: string; bullets?: string[] }): BoxNode[] {
  const head = section(
    "Kepala artikel",
    [
      stack(
        [
          el("breadcrumbs", { items: c.crumbs.map(([label, href]) => ({ label, href })), bgColor: "transparent", borderWidth: 0, paddingLeft: 0, paddingRight: 0, textColor: L.p.muted, currentColor: L.p.ink, linkHoverColor: L.p.primary }, "Breadcrumbs"),
          badge(c.tag, L.p.soft, L.p.primaryDark, L.p.line),
          H(L, c.title, "h1", { size: 44 }),
          P(L, c.meta, { size: 14 }),
        ],
        { gap: 12 },
      ),
      stack([image(c.image, c.title, { ratio: "16 / 8", radius: L.radius })], { align: "stretch" }),
    ],
    { bg: L.bg, padY: 64, width: 860 },
  );
  const body: (ElementNode | BoxNode)[] = [P(L, c.lead, { size: 20, color: L.p.ink })];
  for (const [h, t] of c.blocks) {
    if (h) body.push(H(L, h, "h2", { size: 26 }));
    body.push(P(L, t, { size: 17 }));
  }
  if (c.quote) {
    const q = H(L, c.quote, "h3", { size: 22, weight: 600, color: L.p.primaryDark });
    addCss(q, `border-left: 4px solid ${L.p.primary}; padding-left: 18px;`);
    body.splice(Math.min(4, body.length), 0, q);
  }
  if (c.bullets) body.push(checklist(L, c.bullets));
  return [head, section("Isi artikel", [stack(body, { gap: 16, align: "stretch" })], { bg: L.bg, padY: 24, width: 760 })];
}

/** Ajakan (CTA) kotak sendiri — berbeda dari preset CTA Pita. */
export function ctaBox(L: Look, c: { title: string; text?: string; actions: Act[]; bg?: string; light?: boolean; align?: "left" | "center" }): BoxNode {
  const light = c.light ?? true;
  const align = c.align ?? "left";
  const kids = [H(L, c.title, "h2", { color: light ? "#ffffff" : L.p.ink, align }), ...(c.text ? [P(L, c.text, { color: light ? "#e5e7eb" : L.p.muted, size: 17, align })] : [])];
  if (align === "center") return section("Ajakan", [stack([...kids, acts(L, c.actions, "center")], { gap: 14, align: "center" })], { bg: c.bg ?? L.p.primaryDark, padY: 80, width: 860 });
  return section("Ajakan", [grid([col(kids, { gap: 10, name: "Teks" }), col([acts(L, c.actions)], { name: "Tombol", align: "end" })], "minmax(0, 1.6fr) minmax(0, 1fr)", { gap: 32, align: "center" })], { bg: c.bg ?? L.p.primaryDark, padY: 72 });
}

/** Papan menu/harga: grup berisi nama, deskripsi, harga. */
export function menuBoard(L: Look, c: Intro & { groups: { title: string; items: [string, string, string][] }[]; bg?: string; cols?: number; name?: string }): BoxNode {
  const item = ([n, d, pr]: [string, string, string]) =>
    col([inline([para(n, { size: 16, weight: 700, color: L.p.ink, full: false }), para(pr, { size: 16, weight: 700, color: L.p.primaryDark, full: false })], { justify: "between" }), P(L, d, { size: 14 })], { gap: 2, name: "Menu" });
  return section(
    c.name ?? "Menu",
    [
      intro(L, c),
      grid(
        c.groups.map((g) => col([H(L, g.title, "h3", { size: 20, color: L.p.primaryDark }), ...g.items.map(item)], { gap: 14, name: g.title, card: { bg: "#ffffff", border: L.p.line, radius: L.radius, padding: 26 } })),
        c.cols ?? Math.min(3, c.groups.length),
        { gap: 22 },
      ),
    ],
    { bg: c.bg ?? L.alt, padY: 88 },
  );
}

/** FAQ satu kolom (Accordion gratis) — berbeda dari preset FAQ Akordeon. */
export function faqList(L: Look, c: Intro & { items: [string, string][]; bg?: string }): BoxNode {
  return section(
    "FAQ",
    [
      intro(L, c),
      stack([el("accordion", { items: c.items.map(([title, content]) => ({ title, content })), widthMode: "full", openTextColor: L.p.primaryDark, iconColor: L.p.primary, borderColor: L.p.line, borderRadius: Math.min(L.radius, 16), iconStyle: "plus" }, "FAQ")], { align: "stretch" }),
    ],
    { bg: c.bg ?? L.bg, padY: 88, width: 860 },
  );
}

/** Lowongan kerja. */
export function jobs(L: Look, c: Intro & { items: { title: string; meta: string; text: string }[]; apply: string; href: string; bg?: string }): BoxNode {
  return section(
    "Lowongan",
    [
      intro(L, { ...c, align: c.align ?? "left" }),
      ...c.items.map((j) =>
        grid(
          [
            col([H(L, j.title, "h3", { size: 20 }), P(L, j.text, { size: 15 })], { gap: 6, name: "Posisi" }),
            col([badge(j.meta, L.p.soft, L.p.primaryDark, L.p.line), linkButton(c.apply, c.href, "outline", L.p)], { gap: 10, name: "Aksi", align: "end" }),
          ],
          "minmax(0, 1fr) auto",
          { gap: 20, align: "center" },
        ),
      ),
    ].map((r, i) => {
      if (i > 0) r.advanced = { customCss: `background: #ffffff; border: 1px solid ${L.p.line}; border-radius: ${L.radius}px; padding: 22px; margin-bottom: 14px;` };
      return r;
    }),
    { bg: c.bg ?? L.alt, padY: 88, width: 980 },
  );
}

/** Deretan nama klien/mitra. */
export function logos(L: Look, c: { label: string; names: string[]; bg?: string; light?: boolean }): BoxNode {
  const light = !!c.light;
  return section(
    "Mitra",
    [
      stack(
        [
          para(c.label, { size: 13, weight: 700, color: light ? "#94a3b8" : L.p.muted, align: "center", transform: "uppercase", spacing: 1 }),
          inline(c.names.map((n) => para(n, { size: 20, weight: 800, color: light ? "#e2e8f0" : "#94a3b8", full: false })), { gap: 40, justify: "center" }),
        ],
        { gap: 18, align: "center" },
      ),
    ],
    { bg: c.bg ?? L.bg, padY: 48 },
  );
}

/** Angka sederhana (teks biasa, gratis). */
export function figures(L: Look, c: { items: [string, string][]; bg?: string; light?: boolean }): BoxNode {
  const light = !!c.light;
  return section(
    "Angka",
    [grid(c.items.map(([n, l]) => col([H(L, n, "h2", { size: 40, color: light ? "#ffffff" : L.p.primaryDark, align: "center" }), para(l, { size: 14, color: light ? "#cbd5e1" : L.p.muted, align: "center" })], { gap: 4, name: "Angka", align: "stretch" })), c.items.length, { gap: 20 })],
    { bg: c.bg ?? L.alt, padY: 56 },
  );
}

/** Video (gratis). */
export function videoBlock(L: Look, c: Intro & { url: string; title: string; bg?: string }): BoxNode {
  return section("Video", [intro(L, c), stack([el("video", { source: "youtube", url: c.url, title: c.title, radius: L.radius, shadow: true }, "Video")], { align: "stretch" })], { bg: c.bg ?? L.bg, padY: 80, width: 960 });
}

/** Banner pengumuman (gratis). */
export function notice(L: Look, c: { badge: string; text: string; link: string; href: string; bg?: string }): BoxNode {
  return section(
    "Pengumuman",
    [stack([el("banner", { badge: c.badge, text: c.text, linkText: c.link, href: c.href, dismissible: false, bgColor: L.p.primaryDark, badgeBg: "#ffffff", badgeText: L.p.primaryDark, linkColor: L.p.line, radius: Math.min(L.radius, 14) }, "Banner")], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 24 },
  );
}

/** Profil orang (gratis, tanpa preset Kartu Tim). */
export function people(L: Look, c: Intro & { items: { name: string; role: string; photo: string; text?: string }[]; cols?: number; bg?: string; round?: boolean }): BoxNode {
  return section(
    "Profil",
    [
      intro(L, c),
      grid(
        c.items.map((m) => col([image(m.photo, m.name, { ratio: "1 / 1", radius: c.round ? 999 : L.radius }), H(L, m.name, "h3", { size: 18, align: c.round ? "center" : "left" }), para(m.role, { size: 14, weight: 600, color: L.p.primaryDark, align: c.round ? "center" : "left" }), ...(m.text ? [P(L, m.text, { size: 14, align: c.round ? "center" : "left" })] : [])], { gap: 6, name: "Profil", align: "stretch" })),
        c.cols ?? Math.min(4, c.items.length),
        { gap: 24 },
      ),
    ],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Rating ringkas (gratis). */
export const stars = (L: Look, value: number, caption: string) => el("rating", { value, caption, color: "#f59e0b", textColor: L.p.muted }, "Rating");

/* ------------------------------ premium ---------------------------- */

/** Statistik Animasi (Premium). Item: "angka | label". */
export function counter(L: Look, c: Partial<Intro> & { items: string[]; bg?: string; dark?: boolean }): BoxNode {
  const dark = !!c.dark;
  return section(
    "Statistik",
    [
      ...(c.title ? [intro(L, { ...(c as Intro), light: dark })] : []),
      stack([el("stats-counter", { items: c.items, columns: Math.min(4, c.items.length), numberColor: dark ? "#ffffff" : L.p.ink, labelColor: dark ? "#94a3b8" : L.p.muted, accentColor: L.p.primary }, "Statistik Animasi")], { align: "stretch" }),
    ],
    { bg: c.bg ?? (dark ? L.dark : L.bg), padY: 72 },
  );
}

/** Slider (Premium). */
export function slider(L: Look, c: Partial<Intro> & { slides: { title: string; text: string; bg: string }[]; height?: number; bg?: string; padY?: number }): BoxNode {
  return section(
    "Slider",
    [...(c.title ? [intro(L, c as Intro)] : []), stack([el("slider", { slides: c.slides, height: c.height ?? 360, radius: L.radius, interval: 6 }, "Slider")], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: c.padY ?? 56 },
  );
}

/** Hitung mundur (Premium) dengan teks di samping. */
export function countdownBand(L: Look, c: { eyebrow?: string; title: string; text: string; target: string; finished: string; bg?: string; actions?: Act[] }): BoxNode {
  return section(
    "Hitung mundur",
    [
      grid(
        [
          col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.line)] : []), H(L, c.title, "h2", { color: "#ffffff" }), P(L, c.text, { color: "#e5e7eb" }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 10, name: "Info" }),
          col([el("countdown", { title: "", target: c.target, finishedText: c.finished, boxColor: "#00000040", numberColor: "#ffffff", labelColor: L.p.line, titleColor: "#ffffff", radius: Math.min(L.radius, 16) }, "Countdown")], { name: "Hitung mundur" }),
        ],
        2,
        { gap: 40, align: "center" },
      ),
    ],
    { bg: c.bg ?? L.p.primaryDark, padY: 72 },
  );
}

/** Bilah progres (Premium). */
export function progressBars(L: Look, c: Intro & { bars: [string, number][]; bg?: string; side?: { image: string; alt: string } }): BoxNode {
  const bars = c.bars.map(([label, value]) => el("progress", { label, value, barColor: L.p.primary, trackColor: L.p.soft, textColor: L.p.ink, height: 12 }, "Progres"));
  const kids = [...introEls(L, { ...c, align: "left" }), ...bars];
  return section(
    "Progres",
    [c.side ? grid([col(kids, { gap: 16, name: "Progres" }), col([image(c.side.image, c.side.alt, { ratio: "4 / 3", radius: L.radius })], { name: "Gambar" })], 2, { gap: 48, align: "center" }) : stack(kids, { gap: 16, align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Kartu testimoni (Premium Testimonial). */
export function quotes(L: Look, c: Intro & { items: { quote: string; author: string; role: string; avatar: string; rating?: number }[]; cols?: number; bg?: string }): BoxNode {
  return section(
    "Testimoni",
    [
      intro(L, c),
      grid(
        c.items.map((q) => col([el("testimonial", { quote: q.quote, author: q.author, role: q.role, avatar: q.avatar, rating: q.rating ?? 5, accentColor: L.p.primary, radius: L.radius, textColor: L.p.ink }, "Testimoni")], { name: "Testimoni", align: "stretch" })),
        c.cols ?? Math.min(3, c.items.length),
        { gap: 22, align: "stretch" },
      ),
    ],
    { bg: c.bg ?? L.alt, padY: 88 },
  );
}

export interface PlanEl {
  plan: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonHref: string;
  featured?: boolean;
  badge?: string;
}

/** Kartu harga (Premium Pricing). */
export function plans(L: Look, c: Intro & { items: PlanEl[]; bg?: string }): BoxNode {
  return section(
    "Paket",
    [
      intro(L, c),
      grid(
        c.items.map((x) => col([el("pricing", { ...x, featured: !!x.featured, badge: x.badge ?? "", accentColor: L.p.primary, textColor: L.p.ink, radius: L.radius }, "Harga")], { name: "Paket", align: "stretch" })),
        c.items.length,
        { gap: 22, align: "stretch" },
      ),
    ],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Harga Bulanan/Tahunan (Premium). Plan: "Nama | bulanan | tahunan | fitur; fitur | CTA". */
export function priceSwitch(L: Look, c: Intro & { plans: string[]; labels: [string, string, string, string, string]; featured?: number; href: string; bg?: string }): BoxNode {
  const [m, y, save, pm, py] = c.labels;
  return section(
    "Harga",
    [
      intro(L, c),
      stack([el("pricing-switch", { monthlyLabel: m, yearlyLabel: y, saveBadge: save, periodMonthly: pm, periodYearly: py, plans: c.plans, featured: c.featured ?? 2, ctaHref: c.href, accentColor: L.p.primary, inkColor: L.p.ink, featuredBg: L.dark, radius: L.radius }, "Harga Bulanan/Tahunan")], { align: "stretch" }),
    ],
    { bg: c.bg ?? L.bg, padY: 88 },
  );
}

/** Tabel perbandingan (Premium). Baris: "fitur | a | b | c" ("ya"/"tidak" = tanda). */
export function compare(L: Look, c: Intro & { columns: string[]; rows: string[]; highlight?: number; caption: string; bg?: string }): BoxNode {
  return section(
    "Perbandingan",
    [intro(L, c), stack([el("comparison-table", { columns: c.columns, rows: c.rows, highlight: c.highlight ?? 2, caption: c.caption, accentColor: L.p.primary, headerBg: L.alt, textColor: L.p.ink, radius: L.radius }, "Tabel Perbandingan")], { align: "stretch" })],
    { bg: c.bg ?? L.bg, padY: 88, width: 1000 },
  );
}

/** Judul mengetik (Premium Typewriter). */
export const typer = (L: Look, prefix: string, words: string[], o: { size?: number; color?: string; word?: string; align?: "left" | "center" } = {}) =>
  el("typewriter", { prefix, words, tag: "h1", fontSize: o.size ?? 56, textColor: o.color ?? L.p.ink, wordColor: o.word ?? L.p.primary, align: o.align ?? "left" }, "Teks Mengetik");

/** Mega menu (Premium). */
export const mega = (L: Look, items: string[], cta: string, ctaHref: string, o: { ink?: string; panel?: string } = {}) =>
  el("mega-menu", { items, ctaText: cta, ctaHref, hoverColor: L.p.primary, ctaBg: L.p.primary, textColor: o.ink ?? L.p.ink, panelBg: o.panel ?? "#ffffff" }, "Mega Menu");
