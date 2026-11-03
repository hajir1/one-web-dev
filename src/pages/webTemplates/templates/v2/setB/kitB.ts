import type { BoxNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import type { ProTheme } from "../../../../pageMaker/helpers/sectionPresetsPro";
import { asset } from "../../../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, para, section, stack, type Palette } from "../../../build";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import type { TemplatePageDef } from "../../../types";
import { listingCard, pageWith, theme } from "../../pro/kit";

/* ================================================================== */
/* Perangkat section untuk 25 template v2 bagian B.                      */
/*                                                                    */
/* Setiap fungsi menghasilkan SATU section (Section → Row → isi) dengan  */
/* isi & gaya dari pemanggil. Template memilih, mengurutkan, dan mengisi */
/* section sendiri; preset Pro (sectionPresetsPro) dipakai langsung di   */
/* file template supaya presetId tercatat di katalog.                   */
/* ================================================================== */

export { asset };

/** Identitas visual satu template. */
export interface Look {
  p: Palette;
  t: ProTheme;
  /** Font teks (root halaman). */
  font: string;
  /** Font judul. */
  hf: string;
  r: number;
  bg: string;
  alt: string;
  dark: string;
  /** Teks redup di latar gelap. */
  onDark: string;
}

export function look(p: Palette, o: { font: string; hf?: string; r: number; dark: string; alt: string; bg?: string; onDark?: string }): Look {
  const hf = o.hf ?? o.font;
  const bg = o.bg ?? "#ffffff";
  return { p, font: o.font, hf, r: o.r, bg, alt: o.alt, dark: o.dark, onDark: o.onDark ?? "#cbd5e1", t: theme(p, { bg, alt: o.alt, dark: o.dark, radius: o.r, headFont: hf }) };
}

export type Btn = [label: string, href: string];

/** Susun halaman `key`: header + isi halaman + footer (halaman tak dikenal = beranda). */
export function render(L: Look, key: string, head: BoxNode, foot: BoxNode, pages: Record<string, () => BoxNode[]>): PageDoc {
  const build = pages[key] ?? pages.home;
  return pageWith([head, ...build(), foot], L.font, L.bg);
}

/** Definisi halaman ringkas. */
export const P = (key: string, id: string, en: string, slugId: string, slugEn: string, home = false): TemplatePageDef => ({ key, name: { id, en }, slug: { id: slugId, en: slugEn }, ...(home ? { home: true } : {}) });

function addCss(node: ElementNode | BoxNode, decl: string): void {
  const cur = node.advanced?.customCss ?? "";
  node.advanced = { ...node.advanced, customCss: cur.includes("{") ? `${cur}\n& { ${decl} }` : `${cur}${cur ? "\n" : ""}${decl}` };
}

/** Judul dengan font judul template. */
function H(L: Look, text: string, tag: "h1" | "h2" | "h3" | "h4", o: Parameters<typeof heading>[2] = {}): ElementNode {
  const n = heading(text, tag, { color: L.p.ink, ...o });
  addCss(n, `font-family: ${L.hf};`);
  return n;
}

/** Deretan tombol; tombol pertama utama. */
function btns(L: Look, list: Btn[], o: { dark?: boolean; justify?: "start" | "center" } = {}): BoxNode {
  return inline(
    list.map(([l, h], i) => linkButton(l, h, i === 0 ? "primary" : o.dark ? "light" : "outline", L.p)),
    { justify: o.justify ?? "start" },
  );
}

/** Judul section (eyebrow + judul + teks). */
function intro(L: Look, o: { ey?: string; title: string; text?: string; align?: "left" | "center"; light?: boolean }): BoxNode {
  const align = o.align ?? "center";
  return stack(
    [
      ...(o.ey ? [eyebrow(o.ey, o.light ? L.p.line : L.p.primary, align)] : []),
      H(L, o.title, "h2", { align, color: o.light ? "#ffffff" : L.p.ink }),
      ...(o.text ? [para(o.text, { align, size: 17, color: o.light ? L.onDark : L.p.muted })] : []),
    ],
    { gap: 10, align: "stretch" },
  );
}

const ink = (L: Look, dark?: boolean) => (dark ? "#ffffff" : L.p.ink);
const mut = (L: Look, dark?: boolean) => (dark ? L.onDark : L.p.muted);
const bgOf = (L: Look, dark?: boolean, bg?: string) => bg ?? (dark ? L.dark : L.bg);

/* ------------------------------ hero ------------------------------- */

export interface HeroOpts {
  badge?: string;
  ey?: string;
  title: string;
  text: string;
  btns: Btn[];
  image: string;
  alt: string;
  ratio?: string;
  reverse?: boolean;
  dark?: boolean;
  bg?: string;
  gradient?: [string, string, number?];
  note?: string;
  extra?: (ElementNode | BoxNode)[];
  size?: number;
}

/** Hero dua kolom: teks + gambar. */
export function heroSplit(L: Look, o: HeroOpts): BoxNode {
  const text = col(
    [
      ...(o.badge ? [badge(o.badge, o.dark ? "#ffffff1a" : L.p.soft, o.dark ? "#ffffff" : L.p.primaryDark, o.dark ? "#ffffff33" : L.p.line)] : []),
      ...(o.ey ? [eyebrow(o.ey, o.dark ? L.p.line : L.p.primary)] : []),
      H(L, o.title, "h1", { size: o.size ?? 52, color: ink(L, o.dark) }),
      para(o.text, { size: 18, color: mut(L, o.dark) }),
      btns(L, o.btns, { dark: o.dark }),
      ...(o.note ? [para(o.note, { size: 13, color: mut(L, o.dark) })] : []),
      ...(o.extra ?? []),
    ],
    { gap: 18, name: "Teks hero" },
  );
  const pic = col([image(asset(o.image), o.alt, { ratio: o.ratio ?? "4 / 3", radius: L.r + 6 })], { name: "Gambar" });
  return section("Hero", [grid(o.reverse ? [pic, text] : [text, pic], o.reverse ? "minmax(0, 1fr) minmax(0, 1.1fr)" : "minmax(0, 1.1fr) minmax(0, 1fr)", { gap: 52, align: "center" })], {
    ...(o.gradient ? { gradient: o.gradient } : { bg: bgOf(L, o.dark, o.bg) }),
    padY: 96,
  });
}

/** Hero dengan gambar latar penuh + lapisan warna. */
export function heroImage(L: Look, o: { ey?: string; title: string; text: string; btns: Btn[]; image: string; overlay?: string; opacity?: number; center?: boolean; minHeight?: number; extra?: (ElementNode | BoxNode)[] }): BoxNode {
  const align = o.center ? "center" : "left";
  const s = section(
    "Hero Gambar",
    [
      stack(
        [
          ...(o.ey ? [eyebrow(o.ey, "#ffffff", align)] : []),
          H(L, o.title, "h1", { size: 58, color: "#ffffff", align }),
          para(o.text, { size: 19, color: "#f1f5f9", align }),
          btns(L, o.btns, { dark: true, justify: o.center ? "center" : "start" }),
          ...(o.extra ?? []),
        ],
        { gap: 18, align: o.center ? "center" : "start" },
      ),
    ],
    { bg: L.dark, padY: 120, width: o.center ? 900 : 1120 },
  );
  s.bgType = "image";
  s.bgImage = asset(o.image);
  s.bgSize = "cover";
  s.bgPosition = "center";
  s.bgRepeat = "no-repeat";
  s.bgOverlayColor = o.overlay ?? L.dark;
  s.bgOverlayOpacity = o.opacity ?? 60;
  if (s.section) s.section = { ...s.section, minHeight: o.minHeight ?? 560 };
  return s;
}

/** Hero teks rata tengah, gambar lebar opsional. */
export function heroCenter(L: Look, o: { badge?: string; title: string; text: string; btns: Btn[]; image?: string; alt?: string; dark?: boolean; bg?: string; gradient?: [string, string, number?]; size?: number; extra?: (ElementNode | BoxNode)[] }): BoxNode {
  const rows: BoxNode[] = [
    stack(
      [
        ...(o.badge ? [badge(o.badge, o.dark ? "#ffffff1a" : L.p.soft, o.dark ? "#ffffff" : L.p.primaryDark, o.dark ? "#ffffff33" : L.p.line)] : []),
        H(L, o.title, "h1", { size: o.size ?? 60, color: ink(L, o.dark), align: "center" }),
        para(o.text, { size: 19, color: mut(L, o.dark), align: "center" }),
        btns(L, o.btns, { dark: o.dark, justify: "center" }),
        ...(o.extra ?? []),
      ],
      { gap: 18, align: "center" },
    ),
  ];
  if (o.image) rows.push(stack([image(asset(o.image), o.alt ?? o.title, { ratio: "21 / 9", radius: L.r + 4 })], { gap: 0, align: "stretch" }));
  return section("Hero Tengah", rows, { ...(o.gradient ? { gradient: o.gradient } : { bg: bgOf(L, o.dark, o.bg) }), padY: 104, width: 1040 });
}

/** Hero dengan teks mengetik (Premium: typewriter). */
export function heroType(L: Look, o: { ey?: string; prefix: string; words: string[]; text: string; btns: Btn[]; image: string; alt: string; dark?: boolean; size?: number }): BoxNode {
  return section(
    "Hero Mengetik",
    [
      grid(
        [
          col(
            [
              ...(o.ey ? [eyebrow(o.ey, o.dark ? L.p.line : L.p.primary)] : []),
              el("typewriter", { prefix: o.prefix, words: o.words, tag: "h1", fontSize: o.size ?? 54, textColor: ink(L, o.dark), wordColor: o.dark ? L.p.line : L.p.primary }, "Teks Mengetik"),
              para(o.text, { size: 18, color: mut(L, o.dark) }),
              btns(L, o.btns, { dark: o.dark }),
            ],
            { gap: 20, name: "Teks hero" },
          ),
          col([image(asset(o.image), o.alt, { ratio: "4 / 3", radius: L.r + 4 })], { name: "Gambar" }),
        ],
        "minmax(0, 1.15fr) minmax(0, 1fr)",
        { gap: 48, align: "center" },
      ),
    ],
    { bg: bgOf(L, o.dark), padY: 100 },
  );
}

/** Slider lebar (Premium: slider). */
export function sliderSec(L: Look, slides: [string, string, string][], o: { height?: number; bg?: string; padY?: number } = {}): BoxNode {
  return section("Slider", [stack([el("slider", { slides: slides.map(([title, text, bg]) => ({ title, text, bg })), height: o.height ?? 380, radius: L.r, autoplay: true, interval: 6 }, "Slider")], { align: "stretch" })], {
    bg: o.bg ?? L.bg,
    padY: o.padY ?? 40,
  });
}

/** Judul halaman dalam (dengan breadcrumbs opsional). */
export function pageHead(L: Look, o: { ey?: string; title: string; text?: string; crumbs?: Btn[]; dark?: boolean; bg?: string; image?: string; center?: boolean }): BoxNode {
  const align = o.center ? "center" : "left";
  const crumbs = o.crumbs
    ? [
        el(
          "breadcrumbs",
          {
            items: o.crumbs.map(([label, href], i) => ({ label, href: i === o.crumbs!.length - 1 ? "" : href })),
            separator: "slash",
            bgColor: "transparent",
            borderWidth: 0,
            paddingLeft: 0,
            paddingRight: 0,
            textColor: mut(L, o.dark),
            currentColor: ink(L, o.dark),
            linkHoverColor: L.p.primary,
          },
          "Breadcrumbs",
        ),
      ]
    : [];
  const text = [
    ...crumbs,
    ...(o.ey ? [eyebrow(o.ey, o.dark ? L.p.line : L.p.primary, align)] : []),
    H(L, o.title, "h1", { size: 46, color: ink(L, o.dark), align }),
    ...(o.text ? [para(o.text, { size: 18, color: mut(L, o.dark), align })] : []),
  ];
  const row = o.image
    ? grid([col(text, { gap: 12, name: "Judul" }), col([image(asset(o.image), o.title, { ratio: "16 / 10", radius: L.r })], { name: "Gambar" })], "minmax(0, 1.2fr) minmax(0, 1fr)", { gap: 40, align: "center" })
    : stack(text, { gap: 12, align: o.center ? "center" : "stretch" });
  return section("Judul Halaman", [row], { bg: o.bg ?? (o.dark ? L.dark : L.alt), padY: 72, width: o.center ? 860 : 1120 });
}

/* ------------------------------ isi -------------------------------- */

export interface CardItem {
  icon?: string;
  title: string;
  text: string;
  meta?: string;
  link?: Btn;
}

function glyph(L: Look, g: string, dark?: boolean): ElementNode {
  const n = el("text", { text: g, tag: "p", fontSize: 22, fontWeight: 700, textColor: dark ? "#ffffff" : L.p.primary, textAlign: "center", widthMode: "auto" }, "Ikon");
  n.advanced = { customCss: `display: inline-flex; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: ${Math.min(L.r, 16)}px; background: ${dark ? "#ffffff1a" : L.p.soft};` };
  return n;
}

/** Kartu informasi: style card (berbingkai), plain (tanpa bingkai), line (garis atas). */
export function cards(L: Look, o: { ey?: string; title?: string; text?: string; items: CardItem[]; cols?: number; dark?: boolean; bg?: string; style?: "card" | "plain" | "line"; align?: "left" | "center" }): BoxNode {
  const style = o.style ?? "card";
  const cell = (c: CardItem) => {
    const n = col(
      [
        ...(c.icon ? [glyph(L, c.icon, o.dark)] : []),
        ...(c.meta ? [eyebrow(c.meta, o.dark ? L.p.line : L.p.primary)] : []),
        H(L, c.title, "h3", { size: 20, color: ink(L, o.dark) }),
        para(c.text, { size: 15, color: mut(L, o.dark) }),
        ...(c.link ? [el("anchor", { text: `${c.link[0]} →`, href: c.link[1], underline: "none", fontSize: 15, fontWeight: 600, textColor: o.dark ? L.p.line : L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan")] : []),
      ],
      {
        gap: 10,
        name: "Kartu",
        ...(style === "card" ? { card: { bg: o.dark ? "#ffffff0d" : "#ffffff", border: o.dark ? "#ffffff1f" : L.p.line, radius: L.r, padding: 26 } } : {}),
      },
    );
    if (style === "line") addCss(n, `border-top: 3px solid ${L.p.primary}; padding-top: 18px;`);
    return n;
  };
  const rows: BoxNode[] = [];
  if (o.title) rows.push(intro(L, { ey: o.ey, title: o.title, text: o.text, light: o.dark, align: o.align }));
  rows.push(grid(o.items.map(cell), o.cols ?? Math.min(3, o.items.length), { gap: 24, align: "stretch" }));
  return section("Kartu", rows, { bg: bgOf(L, o.dark, o.bg), padY: 88 });
}

export interface ImgItem {
  image: string;
  title: string;
  text: string;
  meta?: string;
  link?: Btn;
  tag?: string;
}

/** Kartu bergambar (artikel, kamar, proyek, armada). */
export function imgCards(L: Look, o: { ey?: string; title?: string; text?: string; items: ImgItem[]; cols?: number; ratio?: string; bg?: string; dark?: boolean; boxed?: boolean }): BoxNode {
  const cell = (c: ImgItem) =>
    col(
      [
        image(asset(c.image), c.title, { ratio: o.ratio ?? "16 / 10", radius: o.boxed ? Math.max(0, L.r - 6) : L.r }),
        ...(c.tag ? [badge(c.tag, L.p.soft, L.p.primaryDark, L.p.line)] : []),
        ...(c.meta ? [para(c.meta, { size: 13, color: o.dark ? L.p.line : L.p.primary, weight: 600 })] : []),
        H(L, c.title, "h3", { size: 20, color: ink(L, o.dark) }),
        para(c.text, { size: 15, color: mut(L, o.dark) }),
        ...(c.link ? [el("anchor", { text: `${c.link[0]} →`, href: c.link[1], underline: "none", fontSize: 15, fontWeight: 600, textColor: o.dark ? L.p.line : L.p.primary, hoverEnabled: true, hoverTextColor: L.p.primaryDark }, "Tautan")] : []),
      ],
      { gap: 10, name: "Kartu gambar", ...(o.boxed ? { card: { bg: o.dark ? "#ffffff0d" : "#ffffff", border: o.dark ? "#ffffff1f" : L.p.line, radius: L.r, padding: 16 } } : {}) },
    );
  const rows: BoxNode[] = [];
  if (o.title) rows.push(intro(L, { ey: o.ey, title: o.title, text: o.text, light: o.dark }));
  rows.push(grid(o.items.map(cell), o.cols ?? Math.min(3, o.items.length), { gap: 28, align: "stretch" }));
  return section("Kartu Gambar", rows, { bg: bgOf(L, o.dark, o.bg), padY: 88 });
}

/** Teks + gambar berdampingan (tentang, cerita, keunggulan). */
export function split(L: Look, o: { ey?: string; title: string; paras: string[]; bullets?: string[]; image: string; alt: string; reverse?: boolean; dark?: boolean; bg?: string; btn?: Btn; ratio?: string }): BoxNode {
  const text = col(
    [
      ...(o.ey ? [eyebrow(o.ey, o.dark ? L.p.line : L.p.primary)] : []),
      H(L, o.title, "h2", { color: ink(L, o.dark) }),
      ...o.paras.map((t) => para(t, { size: 17, color: mut(L, o.dark) })),
      ...(o.bullets
        ? [
            el(
              "list",
              { items: o.bullets, listStyleType: "disc", markerColor: o.dark ? L.p.line : L.p.primary, bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, dividerEnabled: false, itemHoverEnabled: false, textColor: o.dark ? "#e2e8f0" : L.p.ink, fontSize: 15, paddingLeft: 0, paddingRight: 0, itemPaddingY: 4 },
              "Daftar",
            ),
          ]
        : []),
      ...(o.btn ? [linkButton(o.btn[0], o.btn[1], "primary", L.p)] : []),
    ],
    { gap: 14, name: "Teks" },
  );
  const pic = col([image(asset(o.image), o.alt, { ratio: o.ratio ?? "4 / 3", radius: L.r })], { name: "Gambar" });
  return section("Teks & Gambar", [grid(o.reverse ? [pic, text] : [text, pic], 2, { gap: 56, align: "center" })], { bg: bgOf(L, o.dark, o.bg), padY: 96 });
}

/** Langkah bernomor (proses kerja, cara pesan). */
export function steps(L: Look, o: { ey?: string; title: string; text?: string; items: [string, string][]; dark?: boolean; bg?: string }): BoxNode {
  return section(
    "Langkah",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text, light: o.dark }),
      grid(
        o.items.map(([t, d], i) =>
          col([H(L, String(i + 1).padStart(2, "0"), "h2", { size: 40, color: o.dark ? L.p.line : L.p.primary }), H(L, t, "h3", { size: 19, color: ink(L, o.dark) }), para(d, { size: 15, color: mut(L, o.dark) })], { gap: 8, name: "Langkah" }),
        ),
        Math.min(4, o.items.length),
        { gap: 28, align: "start" },
      ),
    ],
    { bg: bgOf(L, o.dark, o.bg), padY: 88 },
  );
}

/** Linimasa vertikal (riwayat, agenda, rundown). */
export function timeline(L: Look, o: { ey?: string; title: string; text?: string; items: [string, string, string][]; bg?: string; dark?: boolean }): BoxNode {
  const item = ([when, t, d]: [string, string, string]) => {
    const n = col(
      [col([para(when, { size: 14, weight: 700, color: o.dark ? L.p.line : L.p.primary })], { width: 140, name: "Waktu" }), col([H(L, t, "h3", { size: 19, color: ink(L, o.dark) }), para(d, { size: 15, color: mut(L, o.dark) })], { gap: 4, name: "Isi" })],
      { layout: "row", gap: 20, name: "Butir linimasa", align: "start" },
    );
    addCss(n, `border-left: 3px solid ${L.p.line}; padding-left: 20px;`);
    return n;
  };
  return section("Linimasa", [intro(L, { ey: o.ey, title: o.title, text: o.text, align: "left", light: o.dark }), stack(o.items.map(item), { gap: 22, align: "stretch" })], { bg: bgOf(L, o.dark, o.bg), padY: 88, width: 900 });
}

/** Tabel (jadwal, daftar harga, spesifikasi). */
export function tableSec(L: Look, o: { ey?: string; title: string; text?: string; columns: string[]; rows: string[][]; bg?: string; caption?: string }): BoxNode {
  return section(
    "Tabel",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text }),
      stack(
        [
          el(
            "table",
            {
              columns: o.columns.map((label, i) => ({ id: `col-${i}`, label })),
              rows: o.rows,
              caption: o.caption ?? "",
              headerBgColor: L.p.soft,
              headerTextColor: L.p.ink,
              stripeColor: L.alt,
              rowHoverColor: L.p.soft,
              borderRadius: Math.min(L.r, 16),
              textColor: L.p.ink,
              dividerColor: L.p.line,
              outerBorderColor: L.p.line,
              shadowEnabled: false,
            },
            "Tabel",
          ),
        ],
        { align: "stretch" },
      ),
    ],
    { bg: o.bg ?? L.bg, padY: 80 },
  );
}

/** Tab (detail layanan, kurikulum, kebijakan). */
export function tabsSec(L: Look, o: { ey?: string; title: string; text?: string; tabs: [string, string][]; bg?: string; variant?: "underline" | "pills" }): BoxNode {
  return section(
    "Tab",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text }),
      stack(
        [
          el(
            "tabs",
            {
              tabs: o.tabs.map(([title, content]) => ({ title, content })),
              variant: o.variant ?? "underline",
              widthMode: "full",
              activeTextColor: L.p.primaryDark,
              activeBgColor: L.p.soft,
              indicatorColor: L.p.primary,
              panelFontSize: 16,
              panelTextColor: L.p.muted,
              listBgColor: L.alt,
              listBorderColor: L.p.line,
            },
            "Tab",
          ),
        ],
        { align: "stretch" },
      ),
    ],
    { bg: o.bg ?? L.bg, padY: 80, width: 960 },
  );
}

/** Akordeon satu kolom (rata tengah). */
export function accordionSec(L: Look, o: { ey?: string; title: string; text?: string; items: [string, string][]; bg?: string }): BoxNode {
  return section(
    "Akordeon",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text }),
      stack(
        [
          el(
            "accordion",
            {
              items: o.items.map(([title, content]) => ({ title, content })),
              widthMode: "full",
              itemGap: 10,
              borderColor: L.p.line,
              borderRadius: Math.min(L.r, 14),
              textColor: L.p.ink,
              openTextColor: L.p.primaryDark,
              contentColor: L.p.muted,
              iconColor: L.p.primary,
              headerHoverBgColor: L.p.soft,
            },
            "Akordeon",
          ),
        ],
        { align: "stretch" },
      ),
    ],
    { bg: o.bg ?? L.bg, padY: 88, width: 860 },
  );
}

/** Kutipan besar. */
export function quote(L: Look, o: { text: string; name: string; role: string; dark?: boolean; bg?: string }): BoxNode {
  return section(
    "Kutipan",
    [
      stack(
        [
          H(L, "“", "h2", { size: 72, color: o.dark ? L.p.line : L.p.primary, align: "center" }),
          H(L, o.text, "h3", { size: 28, weight: 500, color: ink(L, o.dark), align: "center" }),
          para(`${o.name} · ${o.role}`, { size: 15, weight: 600, color: mut(L, o.dark), align: "center" }),
        ],
        { gap: 14, align: "stretch" },
      ),
    ],
    { bg: bgOf(L, o.dark, o.bg), padY: 96, width: 860 },
  );
}

/** Galeri gambar. */
export function gallery(L: Look, o: { ey?: string; title?: string; text?: string; images: [string, string][]; cols?: number; ratio?: string; bg?: string; dark?: boolean }): BoxNode {
  const rows: BoxNode[] = [];
  if (o.title) rows.push(intro(L, { ey: o.ey, title: o.title, text: o.text, light: o.dark }));
  rows.push(grid(o.images.map(([n, alt]) => col([image(asset(n), alt, { ratio: o.ratio ?? "1 / 1", radius: L.r })], { name: "Foto" })), o.cols ?? 3, { gap: 16 }));
  return section("Galeri", rows, { bg: bgOf(L, o.dark, o.bg), padY: 80 });
}

export type Field =
  | { k: "input"; label: string; ph: string; type?: "text" | "email" | "tel" | "number" }
  | { k: "select"; label: string; ph: string; options: string[] }
  | { k: "date"; label: string; mode?: "date" | "datetime-local" | "month" | "time" }
  | { k: "check"; label: string };

function fieldEl(L: Look, f: Field, i: number): ElementNode {
  switch (f.k) {
    case "input":
      return el("input", { labelText: f.label, text: f.ph, inputType: f.type ?? "text", hoverBorderColor: L.p.primary, hoverShadowColor: L.p.primary, borderRadius: Math.min(L.r, 12) }, "Input");
    case "select":
      return el("select", { labelText: f.label, placeholder: f.ph, options: f.options, widthMode: "full", focusBorderColor: L.p.primary, focusRingColor: L.p.primary, borderRadius: Math.min(L.r, 12) }, "Pilihan");
    case "date":
      return el("datepicker", { label: f.label, name: `tanggal-${i}`, mode: f.mode ?? "date", required: false, helper: "", focusColor: L.p.primary, radius: Math.min(L.r, 12) }, "Tanggal");
    case "check":
      return el("checkbox", { labelText: f.label, defaultChecked: false, checkedBgColor: L.p.primary, checkedBorderColor: L.p.primary, focusRingColor: L.p.primary }, "Centang");
  }
}

/** Formulir (kontak, booking, pendaftaran) + info kontak. */
export function formSec(L: Look, o: { ey?: string; title: string; text?: string; info?: [string, string][]; fields: Field[]; submit: string; dark?: boolean; bg?: string; note?: string; formFirst?: boolean }): BoxNode {
  const info = col(
    [
      ...(o.ey ? [eyebrow(o.ey, o.dark ? L.p.line : L.p.primary)] : []),
      H(L, o.title, "h2", { color: ink(L, o.dark) }),
      ...(o.text ? [para(o.text, { size: 17, color: mut(L, o.dark) })] : []),
      ...(o.info ?? []).map(([k, v]) => col([para(k, { size: 13, weight: 700, color: o.dark ? L.p.line : L.p.primary, transform: "uppercase", spacing: 1 }), para(v, { size: 16, color: ink(L, o.dark) })], { gap: 2, name: "Info" })),
    ],
    { gap: 14, name: "Info kontak" },
  );
  const form = col(
    [...o.fields.map((f, i) => fieldEl(L, f, i)), linkButton(o.submit, "#kirim", "primary", L.p, { full: true }), ...(o.note ? [para(o.note, { size: 13, color: L.p.muted })] : [])],
    { gap: 14, card: { bg: "#ffffff", border: L.p.line, radius: L.r, padding: 28 }, name: "Formulir" },
  );
  return section("Formulir", [grid(o.formFirst ? [form, info] : [info, form], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 48, align: "start" })], { bg: bgOf(L, o.dark, o.bg ?? L.alt), padY: 96 });
}

/** Artikel panjang (halaman blog / berita). */
export function article(L: Look, o: { meta: string; title: string; lead: string; image: string; body: string[]; sub?: string; list?: string[]; pull?: string; author: [string, string, string]; tags?: string[] }): BoxNode[] {
  const head = section(
    "Kepala Artikel",
    [
      stack(
        [
          eyebrow(o.meta, L.p.primary),
          H(L, o.title, "h1", { size: 46 }),
          para(o.lead, { size: 20, color: L.p.muted }),
          col([col([image(asset(o.author[2]), o.author[0], { ratio: "1 / 1", radius: 999 })], { width: 48, name: "Foto" }), col([para(o.author[0], { weight: 700, color: L.p.ink, size: 15 }), para(o.author[1], { size: 13 })], { gap: 0, name: "Penulis" })], { layout: "row", gap: 12, stackOnMobile: false, name: "Penulis" }),
        ],
        { gap: 14, align: "stretch" },
      ),
      stack([image(asset(o.image), o.title, { ratio: "16 / 9", radius: L.r })], { align: "stretch" }),
    ],
    { bg: L.bg, padY: 72, width: 820 },
  );
  const half = Math.ceil(o.body.length / 2);
  const bodyEls: (ElementNode | BoxNode)[] = [...o.body.slice(0, half).map((t) => para(t, { size: 18, color: "#334155" }))];
  if (o.pull) {
    const q = H(L, o.pull, "h3", { size: 24, weight: 600, color: L.p.primaryDark });
    addCss(q, `border-left: 4px solid ${L.p.primary}; padding-left: 20px; margin: 12px 0;`);
    bodyEls.push(q);
  }
  if (o.sub) bodyEls.push(H(L, o.sub, "h2", { size: 28 }));
  if (o.list) bodyEls.push(el("list", { items: o.list, listStyleType: "decimal", listType: "ol", markerColor: L.p.primary, bgColor: "transparent", borderWidth: 0, borderStyle: "none", shadowEnabled: false, dividerEnabled: false, itemHoverEnabled: false, textColor: "#334155", fontSize: 17 }, "Daftar"));
  bodyEls.push(...o.body.slice(half).map((t) => para(t, { size: 18, color: "#334155" })));
  if (o.tags) bodyEls.push(inline(o.tags.map((t) => badge(t, L.p.soft, L.p.primaryDark, L.p.line)), { gap: 8 }));
  return [head, section("Isi Artikel", [stack(bodyEls, { gap: 18, align: "stretch" })], { bg: L.bg, padY: 24, width: 760 })];
}

/** Daftar harga / menu bergrup. */
export function priceList(L: Look, o: { ey?: string; title: string; text?: string; groups: { name: string; items: [string, string, string][] }[]; dark?: boolean; bg?: string; note?: string }): BoxNode {
  const group = (g: { name: string; items: [string, string, string][] }) =>
    col(
      [
        H(L, g.name, "h3", { size: 22, color: o.dark ? L.p.line : L.p.primaryDark }),
        ...g.items.map(([n, d, pr]) => {
          const row = inline([col([para(n, { size: 17, weight: 700, color: ink(L, o.dark) }), ...(d ? [para(d, { size: 14, color: mut(L, o.dark) })] : [])], { gap: 2, name: "Nama" }), para(pr, { size: 17, weight: 700, color: o.dark ? L.p.line : L.p.primary, full: false })], { justify: "between", gap: 16 });
          addCss(row, `flex-wrap: nowrap; border-bottom: 1px dashed ${o.dark ? "#ffffff33" : L.p.line}; padding-bottom: 12px;`);
          return row;
        }),
      ],
      { gap: 14, name: "Grup harga" },
    );
  const rows: BoxNode[] = [intro(L, { ey: o.ey, title: o.title, text: o.text, light: o.dark }), grid(o.groups.map(group), Math.min(2, o.groups.length), { gap: 48 })];
  if (o.note) rows.push(stack([para(o.note, { size: 14, color: mut(L, o.dark), align: "center" })], { align: "stretch" }));
  return section("Daftar Harga", rows, { bg: bgOf(L, o.dark, o.bg), padY: 88 });
}

/** Deretan nama mitra/klien. */
export function logos(L: Look, o: { title: string; names: string[]; bg?: string; dark?: boolean }): BoxNode {
  return section(
    "Mitra",
    [
      stack([para(o.title, { size: 14, weight: 700, align: "center", color: mut(L, o.dark), transform: "uppercase", spacing: 2 })], { align: "stretch" }),
      stack([inline(o.names.map((n) => H(L, n, "h4", { size: 20, color: o.dark ? "#ffffffb3" : "#94a3b8", full: false })), { gap: 40, justify: "center" })], { align: "stretch" }),
    ],
    { bg: bgOf(L, o.dark, o.bg), padY: 48 },
  );
}

/** Pita info singkat (jam buka, alamat, telepon). */
export function infoBar(L: Look, items: [string, string][], o: { dark?: boolean; bg?: string } = {}): BoxNode {
  return section(
    "Info Singkat",
    [grid(items.map(([k, v]) => col([para(k, { size: 13, weight: 700, color: o.dark ? L.p.line : L.p.primary, transform: "uppercase", spacing: 1 }), para(v, { size: 16, weight: 600, color: ink(L, o.dark) })], { gap: 4, name: "Info" })), Math.min(4, items.length), { gap: 24 })],
    { bg: o.bg ?? (o.dark ? L.dark : L.p.soft), padY: 36 },
  );
}

/** Daftar baris (lowongan, jadwal acara, unduhan): teks kiri, tombol kanan. */
export function rowsList(L: Look, o: { ey?: string; title: string; text?: string; items: { title: string; meta: string; text: string; link: Btn }[]; bg?: string }): BoxNode {
  const item = (it: { title: string; meta: string; text: string; link: Btn }) => {
    const n = inline(
      [col([para(it.meta, { size: 13, weight: 700, color: L.p.primary }), H(L, it.title, "h3", { size: 20 }), para(it.text, { size: 15 })], { gap: 4, name: "Teks" }), linkButton(it.link[0], it.link[1], "outline", L.p)],
      { justify: "between", gap: 20 },
    );
    addCss(n, `padding: 22px 0; border-bottom: 1px solid ${L.p.line};`);
    return n;
  };
  return section("Daftar", [intro(L, { ey: o.ey, title: o.title, text: o.text, align: "left" }), stack(o.items.map(item), { gap: 0, align: "stretch" })], { bg: o.bg ?? L.bg, padY: 88, width: 960 });
}

/** Pita CTA dua kolom. */
export function ctaSplit(L: Look, o: { title: string; text: string; btns: Btn[]; bg?: string }): BoxNode {
  return section(
    "CTA",
    [grid([col([H(L, o.title, "h2", { color: "#ffffff" }), para(o.text, { size: 17, color: L.onDark })], { gap: 10, name: "Teks" }), col([btns(L, o.btns, { dark: true })], { name: "Tombol", align: "end" })], "minmax(0, 1.6fr) minmax(0, 1fr)", { gap: 32, align: "center" })],
    { bg: o.bg ?? L.dark, padY: 72 },
  );
}

/** Langganan buletin. */
export function newsletter(L: Look, o: { title: string; text: string; ph: string; btn: string; bg?: string; dark?: boolean }): BoxNode {
  return section(
    "Buletin",
    [
      stack(
        [
          H(L, o.title, "h2", { align: "center", color: ink(L, o.dark) }),
          para(o.text, { align: "center", color: mut(L, o.dark), size: 17 }),
          el("input", { labelText: "Email", labelEnabled: false, text: o.ph, inputType: "email", borderRadius: Math.min(L.r, 12) }, "Email"),
          linkButton(o.btn, "#langganan", "primary", L.p, { full: true }),
        ],
        { gap: 14, align: "stretch" },
      ),
    ],
    { bg: bgOf(L, o.dark, o.bg ?? L.p.soft), padY: 80, width: 560 },
  );
}

/** Kartu produk (Product Card gratis). */
export function products(L: Look, o: { ey?: string; title?: string; text?: string; items: { image: string; title: string; text: string; price: string; compare?: string; badge?: string; rating?: number; reviews?: string }[]; cta: string; href: string; cols?: number; bg?: string }): BoxNode {
  const rows: BoxNode[] = [];
  if (o.title) rows.push(intro(L, { ey: o.ey, title: o.title, text: o.text }));
  rows.push(grid(o.items.map((it) => col([listingCard({ ...it, image: asset(it.image), cta: o.cta, href: o.href, p: L.p })], { name: "Produk" })), o.cols ?? 3, { gap: 24, align: "stretch" }));
  return section("Produk", rows, { bg: o.bg ?? L.bg, padY: 88 });
}

/** Detail produk: gambar, harga, rating, tab info. */
export function productDetail(L: Look, o: { crumbs?: Btn[]; image: string; thumbs: string[]; tag?: string; title: string; price: string; compare?: string; rating: number; reviews: string; text: string; options?: Field[]; btns: Btn[]; tabs: [string, string][]; accordion?: boolean }): BoxNode {
  const left = col(
    [image(asset(o.image), o.title, { ratio: "1 / 1", radius: L.r }), inline(o.thumbs.map((t) => col([image(asset(t), o.title, { ratio: "1 / 1", radius: Math.max(4, L.r - 8) })], { name: "Thumb", width: 96 })), { gap: 10 })],
    { gap: 12, name: "Galeri produk" },
  );
  const right = col(
    [
      ...(o.crumbs ? [el("breadcrumbs", { items: o.crumbs.map(([label, href], i) => ({ label, href: i === o.crumbs!.length - 1 ? "" : href })), separator: "slash", bgColor: "transparent", borderWidth: 0, paddingLeft: 0, linkHoverColor: L.p.primary }, "Breadcrumbs")] : []),
      ...(o.tag ? [badge(o.tag, L.p.soft, L.p.primaryDark, L.p.line)] : []),
      H(L, o.title, "h1", { size: 38 }),
      el("rating", { value: o.rating, caption: o.reviews, textColor: L.p.muted, size: 20 }, "Rating"),
      inline([H(L, o.price, "h2", { size: 34, color: L.p.primaryDark, full: false }), ...(o.compare ? [para(o.compare, { size: 18, color: "#94a3b8", full: false })] : [])], { gap: 12 }),
      para(o.text, { size: 17 }),
      ...(o.options ?? []).map((f, i) => fieldEl(L, f, i)),
      btns(L, o.btns),
      o.accordion
        ? el("accordion", { items: o.tabs.map(([title, content]) => ({ title, content })), widthMode: "full", itemGap: 8, borderColor: L.p.line, borderRadius: Math.min(L.r, 12), textColor: L.p.ink, openTextColor: L.p.primaryDark, contentColor: L.p.muted, iconColor: L.p.primary }, "Akordeon")
        : el("tabs", { tabs: o.tabs.map(([title, content]) => ({ title, content })), widthMode: "full", activeTextColor: L.p.primaryDark, indicatorColor: L.p.primary, panelTextColor: L.p.muted, listBgColor: L.alt, listBorderColor: L.p.line }, "Tab"),
    ],
    { gap: 16, name: "Info produk" },
  );
  return section("Detail Produk", [grid([left, right], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 48, align: "start" })], { bg: L.bg, padY: 64 });
}

/* --------------------------- premium elemen ------------------------ */

/** Statistik animasi (Premium: stats-counter). */
export function counters(L: Look, items: [string, string][], o: { title?: string; ey?: string; dark?: boolean; bg?: string } = {}): BoxNode {
  const rows: BoxNode[] = [];
  if (o.title) rows.push(intro(L, { ey: o.ey, title: o.title, light: o.dark }));
  rows.push(stack([el("stats-counter", { items: items.map(([n, l]) => `${n} | ${l}`), columns: Math.min(4, items.length), accentColor: o.dark ? L.p.line : L.p.primary, numberColor: o.dark ? "#ffffff" : L.p.ink, labelColor: mut(L, o.dark) }, "Statistik Animasi")], { align: "stretch" }));
  return section("Statistik", rows, { bg: bgOf(L, o.dark, o.bg), padY: 72 });
}

/** Hitung mundur (Premium: countdown). */
export function countdownSec(L: Look, o: { ey?: string; title: string; text: string; target: string; done: string; btn?: Btn; bg?: string }): BoxNode {
  return section(
    "Hitung Mundur",
    [
      grid(
        [
          col([...(o.ey ? [eyebrow(o.ey, L.p.line)] : []), H(L, o.title, "h2", { color: "#ffffff" }), para(o.text, { color: L.onDark, size: 17 }), ...(o.btn ? [linkButton(o.btn[0], o.btn[1], "light", L.p)] : [])], { gap: 12, name: "Info" }),
          col([el("countdown", { title: "", target: o.target, finishedText: o.done, boxColor: "#ffffff1a", numberColor: "#ffffff", labelColor: L.p.line, titleColor: "#ffffff", radius: Math.min(L.r, 16) }, "Countdown")], { name: "Hitung mundur" }),
        ],
        2,
        { gap: 40, align: "center" },
      ),
    ],
    { bg: o.bg ?? L.dark, padY: 72 },
  );
}

/** Tabel perbandingan (Premium: comparison-table). */
export function compareSec(L: Look, o: { ey?: string; title: string; text?: string; columns: string[]; rows: string[]; highlight?: number; caption?: string; bg?: string }): BoxNode {
  return section(
    "Perbandingan",
    [intro(L, { ey: o.ey, title: o.title, text: o.text }), stack([el("comparison-table", { columns: o.columns, rows: o.rows, highlight: o.highlight ?? 2, caption: o.caption ?? "", accentColor: L.p.primary, headerBg: L.p.soft, textColor: L.p.ink, radius: Math.min(L.r, 20) }, "Tabel Perbandingan")], { align: "stretch" })],
    { bg: o.bg ?? L.bg, padY: 88, width: 1000 },
  );
}

/** Harga bulanan/tahunan (Premium: pricing-switch). */
export function priceSwitch(L: Look, o: { ey?: string; title: string; text?: string; plans: string[]; monthly: string; yearly: string; save: string; pm: string; py: string; featured?: number; href: string; bg?: string }): BoxNode {
  return section(
    "Harga",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text }),
      stack([el("pricing-switch", { monthlyLabel: o.monthly, yearlyLabel: o.yearly, saveBadge: o.save, periodMonthly: o.pm, periodYearly: o.py, plans: o.plans, featured: o.featured ?? 2, ctaHref: o.href, accentColor: L.p.primary, inkColor: L.p.ink, featuredBg: L.dark, radius: Math.min(L.r, 28) }, "Harga Bulanan/Tahunan")], { align: "stretch" }),
    ],
    { bg: o.bg ?? L.bg, padY: 88 },
  );
}

export interface PriceCard {
  plan: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  btn: Btn;
  featured?: boolean;
  badge?: string;
}

/** Kartu harga (Premium: pricing). */
export function priceCards(L: Look, o: { ey?: string; title: string; text?: string; plans: PriceCard[]; bg?: string }): BoxNode {
  return section(
    "Kartu Harga",
    [
      intro(L, { ey: o.ey, title: o.title, text: o.text }),
      grid(
        o.plans.map((pl) =>
          col(
            [
              el(
                "pricing",
                { plan: pl.plan, price: pl.price, period: pl.period, description: pl.desc, features: pl.features, buttonText: pl.btn[0], buttonHref: pl.btn[1], featured: !!pl.featured, badge: pl.badge ?? "", accentColor: L.p.primary, textColor: L.p.ink, radius: Math.min(L.r, 24) },
                "Kartu Harga",
              ),
            ],
            { name: "Paket" },
          ),
        ),
        Math.min(3, o.plans.length),
        { gap: 24, align: "stretch" },
      ),
    ],
    { bg: o.bg ?? L.alt, padY: 88 },
  );
}

/** Kartu testimoni (Premium: testimonial). */
export function testiCards(L: Look, o: { ey?: string; title: string; items: { quote: string; author: string; role: string; avatar: string; rating?: number }[]; dark?: boolean; bg?: string }): BoxNode {
  return section(
    "Testimoni",
    [
      intro(L, { ey: o.ey, title: o.title, light: o.dark }),
      grid(
        o.items.map((q) =>
          col(
            [el("testimonial", { quote: q.quote, author: q.author, role: q.role, avatar: asset(q.avatar), rating: q.rating ?? 5, bgColor: o.dark ? "#ffffff0d" : "#ffffff", textColor: o.dark ? "#f1f5f9" : L.p.ink, accentColor: L.p.primary, radius: Math.min(L.r, 24), shadow: !o.dark }, "Testimoni")],
            { name: "Testimoni" },
          ),
        ),
        Math.min(3, o.items.length),
        { gap: 24, align: "stretch" },
      ),
    ],
    { bg: bgOf(L, o.dark, o.bg ?? L.alt), padY: 88 },
  );
}

/** Bilah progres + teks (Premium: progress). */
export function progressSec(L: Look, o: { ey?: string; title: string; text: string; items: [string, number][]; image?: string; alt?: string; btn?: Btn; bg?: string; striped?: boolean }): BoxNode {
  const bars = col(
    [
      ...(o.ey ? [eyebrow(o.ey, L.p.primary)] : []),
      H(L, o.title, "h2"),
      para(o.text, { size: 17 }),
      ...o.items.map(([label, value]) => el("progress", { label, value, barColor: L.p.primary, trackColor: L.p.soft, textColor: L.p.ink, striped: !!o.striped, height: 12 }, "Progress Bar")),
      ...(o.btn ? [linkButton(o.btn[0], o.btn[1], "primary", L.p)] : []),
    ],
    { gap: 16, name: "Progres" },
  );
  const row = o.image ? grid([bars, col([image(asset(o.image), o.alt ?? o.title, { ratio: "4 / 3", radius: L.r })], { name: "Gambar" })], 2, { gap: 56, align: "center" }) : stack([bars], { align: "stretch" });
  return section("Progres", [row], { bg: o.bg ?? L.bg, padY: 88, width: o.image ? 1120 : 820 });
}

/* ----------------------------- header ------------------------------ */

/** Mega menu (Premium) untuk header. */
export function mega(L: Look, items: string[], ctaText: string, ctaHref: string, o: { dark?: boolean } = {}): ElementNode {
  return el("mega-menu", { items, ctaText, ctaHref, textColor: o.dark ? "#f1f5f9" : L.p.ink, hoverColor: L.p.primary, panelBg: "#ffffff", ctaBg: L.p.primary, align: "end" }, "Mega Menu");
}

/** Tambah pita pengumuman di atas header. */
export function withTopbar(head: BoxNode, L: Look, text: string, o: { badge?: string; link?: Btn; bg?: string } = {}): BoxNode {
  const bar = stack(
    [el("banner", { badge: o.badge ?? "", text, linkText: o.link?.[0] ?? "", href: o.link?.[1] ?? "#", align: "center", dismissible: false, bgColor: o.bg ?? L.p.primaryDark, textColor: "#ffffff", badgeBg: "#ffffff", badgeText: L.p.primaryDark, linkColor: L.p.line, radius: Math.min(L.r, 10), paddingY: 8 }, "Pengumuman")],
    { align: "stretch" },
  );
  bar.advanced = { customCss: "margin-bottom: 14px;" };
  head.children = [bar, ...head.children];
  return head;
}

/** Footer satu baris: logo + tautan + hak cipta (latar gelap atau terang). */
export function footerSlim(L: Look, brand: string, links: Btn[], copy: string, o: { bg?: string; light?: boolean } = {}): BoxNode {
  const c = o.light ? L.p.ink : "#ffffff";
  return section(
    "Footer",
    [
      stack(
        [
          inline(
            [
              H(L, brand, "h4", { size: 20, color: c, full: false }),
              inline(links.map(([l, h]) => el("anchor", { text: l, href: h, underline: "none", fontSize: 14, fontWeight: 500, textColor: o.light ? L.p.muted : L.onDark, hoverEnabled: true, hoverTextColor: L.p.primary }, "Tautan")), { gap: 22 }),
            ],
            { justify: "between", gap: 20 },
          ),
          para(copy, { size: 13, color: o.light ? L.p.muted : "#94a3b8" }),
        ],
        { gap: 18, align: "stretch" },
      ),
    ],
    { bg: o.bg ?? L.dark, padY: 40, tag: "footer" },
  );
}
