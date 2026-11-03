import type { BoxNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import { createBox } from "../../../../pageMaker/engine/helpers/tree";
import { createRow } from "../../../../pageMaker/helpers/rowModel";
import { slugify } from "../../../../pageMaker/helpers/site";
import type { PageDoc } from "../../../../pageMaker/helpers/pageDoc";
import { TF } from "../../../../pageMaker/core/helpers/templateFonts";
import { badge, button, col, el, heading, image, inline, linkButton, para, section, type Palette } from "../../../build";
import { asset } from "../../../assets";
import { loginArtKey, markKey } from "./assets";
import type { TemplateContent, TemplatePageDef, Tr } from "../../../types";
import { pageWith } from "../../pro/kit";
import { animate, aos, installLibs } from "../../v3/libs";
import type { CardStyle, Domain, HBlock, HChart, HSpec, PageKind, X } from "./spec";

/* ================================================================== */
/* Mesin template v7 bagian H: HSpec (dashboard) → TemplateContent.     */
/*                                                                    */
/* Setiap halaman aplikasi = 3 section:                                 */
/*   header  bilah atas (logo, cari, notifikasi, avatar / menu atas)    */
/*   section "Aplikasi": Row grid [sidebar | konten] (topnav: konten)   */
/*   footer  hak cipta + status sistem                                  */
/* Halaman Masuk memakai header/footer ringkas + kartu formulir.        */
/* Responsif: sidebar jadi menu geser horizontal di HP, grid KPI 2      */
/* kolom, tabel bergulir horizontal, grafik menyesuaikan lebar.         */
/* Template Free hanya memakai elemen gratis (target = daftar, KPI      */
/* tanpa penghitung animasi) dan tanpa library efek.                    */
/* ================================================================== */

/* ------------------------------ teks ------------------------------- */

type T = (s: X) => string;
const split1 = (s: string): [string, string] => {
  const i = s.indexOf("|");
  return i < 0 ? [s, s] : [s.slice(0, i), s.slice(i + 1)];
};
const tOf = (tr: Tr): T => (s) => {
  const [a, b] = split1(s);
  return tr(a.trim(), b.trim());
};
/** Bagian dipisah ";" (tiap bagian boleh dwibahasa). */
const parts = (t: T, s: string) => s.split(";").map((x) => t(x.trim()));

/* ------------------------------ tampilan --------------------------- */

interface Look {
  p: Palette;
  head: string;
  font: string;
  radius: number;
  bg: string;
  surface: string;
  dark: boolean;
  card: CardStyle;
  /** Teks kuat & redup di atas kartu. */
  ink: string;
  muted: string;
  line: string;
  /** Warna teks di atas warna utama (gelap bila warna utama terang). */
  onPrimary: string;
  onPrimaryDark: string;
}

/** Luminans relatif WCAG warna hex. */
export function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const onColor = (hex: string) => (luminance(hex) > 0.4 ? "#111827" : "#ffffff");

function lookOf(s: HSpec): Look {
  if (!TF[s.look.head] || !TF[s.look.body]) throw new Error(`${s.id}: font tidak dikenal ${s.look.head}/${s.look.body}`);
  const [ink, muted, primary, primaryDark, soft, line] = s.pal;
  return {
    p: { ink, muted, primary, primaryDark, soft, line },
    head: TF[s.look.head],
    font: TF[s.look.body],
    radius: s.look.radius,
    bg: s.look.bg,
    surface: s.look.surface,
    dark: !!s.look.dark,
    card: s.look.card,
    ink,
    muted,
    line,
    onPrimary: onColor(primary),
    onPrimaryDark: onColor(primaryDark),
  };
}

/** Tambah Custom CSS ke node (deklarasi biasa atau blok `& {…}` / @media). */
function css(n: ElementNode | BoxNode, decl: string): void {
  let cur = n.advanced?.customCss ?? "";
  if (!cur.includes("{") && !decl.includes("{")) {
    n.advanced = { ...n.advanced, customCss: `${cur}${cur ? "\n" : ""}${decl}` };
    return;
  }
  if (cur && !cur.includes("{")) cur = `& { ${cur} }`;
  const d = decl.includes("{") ? decl : `& { ${decl} }`;
  n.advanced = { ...n.advanced, customCss: cur ? `${cur}\n${d}` : d };
}

function cardCss(L: Look): string {
  const r = `${L.radius}px`;
  switch (L.card) {
    case "border":
      return `background: ${L.surface}; border: 1px solid ${L.line}; border-radius: ${r};`;
    case "flat":
      return `background: ${L.surface}; border-radius: ${r};`;
    case "glass":
      return `background: ${L.surface}cc; border: 1px solid ${L.dark ? "#ffffff1f" : "#ffffffb3"}; border-radius: ${r}; backdrop-filter: blur(12px); box-shadow: 0 10px 30px -18px ${L.p.primaryDark}66;`;
    case "brutal":
      return `background: ${L.surface}; border: 2px solid ${L.ink}; border-radius: ${r}; box-shadow: 4px 4px 0 ${L.ink};`;
    case "accent":
      return `background: ${L.surface}; border: 1px solid ${L.line}; border-top: 3px solid ${L.p.primary}; border-radius: ${r};`;
    default:
      return `background: ${L.surface}; border-radius: ${r}; box-shadow: 0 1px 2px rgba(15, 23, 42, ${L.dark ? 0.4 : 0.06}), 0 10px 28px -16px rgba(15, 23, 42, ${L.dark ? 0.6 : 0.22});`;
  }
}

/** Kartu (kolom bergaya). */
function card(L: Look, kids: (ElementNode | BoxNode)[], name = "Kartu", o: { gap?: number; pad?: number; tone?: "tint" | "accent" } = {}): BoxNode {
  const c = col(kids, { gap: o.gap ?? 14, name, align: "stretch" });
  c.padding = o.pad ?? 20;
  c.widthMode = "full";
  css(c, cardCss(L));
  if (o.tone === "tint") css(c, `background: ${L.dark ? `${L.p.primary}26` : L.p.soft}; box-shadow: none; border-color: transparent;`);
  if (o.tone === "accent") css(c, `border-left: 4px solid ${L.p.primary};`);
  css(c, "@media (max-width: 640px) { & { padding: 16px; } }");
  return c;
}

/** Grid di dalam kolom (bukan Row). */
function gbox(cells: BoxNode[], columns: string, o: { gap?: number; name?: string; mobile?: "one" | "two" | "scroll" } = {}): BoxNode {
  return createBox("grid", {
    name: o.name ?? "Grid",
    columns,
    gap: o.gap ?? 18,
    align: "stretch",
    justify: "stretch",
    stackOnMobile: true,
    widthMode: "full",
    ...(o.mobile === "two" ? { mobileGrid: "two" as const } : o.mobile === "scroll" ? { mobileGrid: "scroll" as const } : {}),
    children: cells,
  });
}

const H = (L: Look, text: string, tag: "h1" | "h2" | "h3" | "h4", o: { size?: number; color?: string; full?: boolean; align?: "left" | "center" } = {}) => {
  const n = heading(text, tag, { color: o.color ?? L.ink, size: o.size, full: o.full, align: o.align });
  css(n, `font-family: ${L.head};`);
  return n;
};
const Pm = (L: Look, text: string, o: Parameters<typeof para>[1] = {}) => para(text, { color: L.muted, size: 14, ...o });
const label = (L: Look, text: string) => para(text, { size: 12, weight: 600, color: L.muted, transform: "uppercase", spacing: 0.6 });

function glyph(L: Look, g: string, o: { bg?: string; color?: string; size?: number } = {}): ElementNode {
  const s = o.size ?? 40;
  const n = el("text", { text: g, tag: "p", fontSize: Math.round(s * 0.45), fontWeight: 800, textColor: o.color ?? L.p.primaryDark, textAlign: "center", widthMode: "auto" }, "Ikon");
  n.advanced = { customCss: `display: inline-flex; align-items: center; justify-content: center; width: ${s}px; height: ${s}px; flex: none; border-radius: ${Math.min(L.radius, 12)}px; background: ${o.bg ?? (L.dark ? `${L.p.primary}33` : L.p.soft)}; line-height: 1;` };
  return n;
}

/** Tanda naik/turun. */
function delta(L: Look, text: string, up: boolean): ElementNode {
  const good = up ? ["#dcfce7", "#15803d"] : ["#fee2e2", "#b91c1c"];
  const dark = up ? ["#14532d", "#86efac"] : ["#7f1d1d", "#fca5a5"];
  const [bg, fg] = L.dark ? dark : good;
  return badge(`${up ? "▲" : "▼"} ${text}`, bg, fg);
}

/* ------------------------------ elemen ----------------------------- */

/** Rona (0–360) warna hex. */
function hueOf(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  if (!d) return 0;
  const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return (h * 60 + 360) % 360;
}

/** Warna seri kedua yang kontras dengan warna utama: aksen hangat → biru, selain itu → amber. */
function secondColor(L: Look): string {
  const h = hueOf(L.p.primary);
  const warm = h < 100 || h >= 330;
  if (warm) return L.dark ? "#38bdf8" : "#0284c7";
  return L.dark ? "#fbbf24" : "#f59e0b";
}

function chart(L: Look, t: T, c: HChart, height = 280): ElementNode {
  return el(
    "chart",
    {
      chartType: c.type,
      title: "",
      series: t(c.series),
      rows: c.rows.map((r) => {
        const i = r.indexOf(",");
        return `${t(r.slice(0, i))}${r.slice(i)}`;
      }),
      color1: L.p.primary,
      color2: secondColor(L),
      titleColor: L.ink,
      textColor: L.muted,
      showLegend: true,
      beginAtZero: true,
      height,
    },
    "Grafik",
  );
}

function table(L: Look, t: T, cols: X[], rows: string[][]): ElementNode {
  return el(
    "table",
    {
      columns: cols.map((c, i) => ({ id: `col-${i}`, label: t(c) })),
      rows: rows.map((r) => r.map((c) => t(c))),
      fontSize: 14,
      textColor: L.ink,
      bodyBgColor: L.surface,
      headerBgColor: L.dark ? "#ffffff0d" : L.p.soft,
      headerTextColor: L.ink,
      headerUppercase: true,
      stripedRows: L.card !== "brutal",
      stripeColor: L.dark ? "#ffffff08" : L.bg,
      rowHoverColor: L.dark ? "#ffffff14" : L.p.soft,
      dividerColor: L.line,
      borderRadius: Math.min(L.radius, 12),
      shadowEnabled: false,
      outerBorderColor: L.line,
      cellPaddingY: 11,
    },
    "Tabel",
  );
}

function input(L: Look, lbl: string, ph: string, type: "text" | "email" | "password" | "number" | "search" | "tel" | "url" = "text"): ElementNode {
  return el(
    "input",
    {
      labelText: lbl,
      text: ph,
      inputType: type,
      bgColor: L.dark ? "#ffffff0d" : "#ffffff",
      textColor: L.ink,
      borderColor: L.line,
      hoverBorderColor: L.p.primary,
      hoverBgColor: L.dark ? "#ffffff14" : "#ffffff",
      hoverTextColor: L.ink,
      borderRadius: Math.min(L.radius, 10),
    },
    lbl,
  );
}

function select(L: Look, lbl: string, options: string[], o: { label?: boolean; full?: boolean } = {}): ElementNode {
  return el(
    "select",
    {
      labelText: lbl,
      labelEnabled: o.label ?? true,
      placeholder: options[0],
      options,
      widthMode: o.full === false ? "auto" : "full",
      bgColor: L.dark ? "#ffffff0d" : "#ffffff",
      textColor: L.ink,
      borderColor: L.line,
      hoverBgColor: L.dark ? "#ffffff14" : "#f9fafb",
      focusBorderColor: L.p.primary,
      focusRingColor: L.p.primary,
      shadowEnabled: false,
      borderRadius: Math.min(L.radius, 10),
    },
    lbl,
  );
}

const sw = (L: Look, lbl: string, on: boolean) =>
  el("switch", { labelText: lbl, defaultChecked: on, onTrackColor: L.p.primary, hoverOnTrackColor: L.p.primaryDark, textColor: L.ink, focusRingColor: L.p.primary }, lbl);

const search = (L: Look, ph: string, btn: string) =>
  el("search-bar", { placeholder: ph, buttonText: btn, action: "#", param: "q", accentColor: L.p.primary, bgColor: L.dark ? "#ffffff0d" : "#ffffff", borderColor: L.line, textColor: L.ink, radius: Math.min(L.radius, 999) }, "Cari");

function btnPrimary(L: Look, text: string): ElementNode {
  const b = button(text, L.p);
  b.state = { ...b.state, textColor: L.onPrimary, hoverTextColor: L.onPrimaryDark, fontSize: 14, paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, borderRadius: Math.min(L.radius, 10) };
  if (L.card === "brutal") css(b, `border: 2px solid ${L.ink}; box-shadow: 3px 3px 0 ${L.ink};`);
  return b;
}
function linkTo(L: Look, text: string, href: string, kind: "primary" | "outline" = "outline"): ElementNode {
  const a = linkButton(text, href, kind, L.p);
  a.state = { ...a.state, fontSize: 14, paddingTop: 9, paddingBottom: 9, paddingLeft: 16, paddingRight: 16, borderRadius: Math.min(L.radius, 10), ...(kind === "outline" ? { borderWidth: 1, textColor: L.dark ? L.ink : L.p.primaryDark } : { textColor: L.onPrimary, hoverTextColor: L.onPrimaryDark }) };
  return a;
}

/* ------------------------------ konteks ---------------------------- */

interface Ctx {
  s: HSpec;
  d: Domain;
  L: Look;
  t: T;
  href: (key: string) => string;
  premium: boolean;
  /** Halaman yang ada (untuk tautan). */
  keys: Set<string>;
}

const firstKey = (c: Ctx, ...keys: string[]) => keys.find((k) => c.keys.has(k)) ?? "home";

/* ------------------------------ blok ------------------------------- */

function kpiCard(c: Ctx, raw: string, i: number): BoxNode {
  const { L, t } = c;
  const [lbl, value, dlt, dir, g] = raw.split(";").map((x) => x.trim());
  const up = dir !== "down";
  const name = t(lbl);
  const v = H(L, t(value), "h3", { size: 26 });
  const d = delta(L, t(dlt), up);
  const vs = Pm(L, t("vs periode lalu|vs last period"), { size: 12 });
  switch (c.s.kpi) {
    case "icon":
      return card(L, [inline([glyph(L, g || "•"), col([label(L, name), v], { gap: 2, name: "Nilai" })], { gap: 12 }), inline([d, vs], { gap: 8 })], "KPI");
    case "tint":
      return card(L, [label(L, name), H(L, t(value), "h3", { size: 28, color: L.dark ? L.ink : L.p.primaryDark }), inline([d], { gap: 8 })], "KPI", { tone: i === 0 ? undefined : "tint" });
    case "accent":
      return card(L, [label(L, name), v, inline([d, vs], { gap: 8 })], "KPI", { tone: "accent" });
    case "split": {
      const top = inline([label(L, name), d], { gap: 8, justify: "between" });
      const bar = para(" ", { size: 4 });
      const pct = 35 + ((i * 17) % 55);
      css(bar, `height: 6px; border-radius: 999px; background: linear-gradient(90deg, ${L.p.primary} ${pct}%, ${L.dark ? "#ffffff1a" : L.p.soft} ${pct}%);`);
      return card(L, [top, v, bar], "KPI", { gap: 10 });
    }
    default:
      return card(L, [label(L, name), v, inline([d, vs], { gap: 8 })], "KPI", { gap: 8 });
  }
}

function kpis(c: Ctx, offset = 0, n = 4): BoxNode {
  const list = Array.from({ length: n }, (_, i) => c.d.kpis[(offset + i) % c.d.kpis.length]);
  if (c.s.kpi === "counter" && c.premium) {
    const counter = el(
      "stats-counter",
      {
        items: list.map((k) => {
          const [lbl, value] = k.split(";").map((x) => x.trim());
          return `${c.t(value)} | ${c.t(lbl)}`;
        }),
        columns: n,
        numberColor: c.L.ink,
        labelColor: c.L.muted,
        accentColor: c.L.p.primary,
        cardBg: "transparent",
        numberSize: 30,
        align: "left",
        divider: true,
      },
      "Statistik",
    );
    return card(c.L, [counter], "KPI");
  }
  return gbox(list.map((k, i) => kpiCard(c, k, i)), `repeat(${n}, minmax(0, 1fr))`, { name: "KPI", mobile: "two", gap: 16 });
}

function chartHead(c: Ctx, title: string, sub?: string): BoxNode {
  const { L, t } = c;
  const seg = el("segmented", { label: "", name: "periode", options: [t("7 hari|7 days"), t("30 hari|30 days"), t("12 bulan|12 months")], selected: 1, accentColor: L.p.primary, bgColor: L.dark ? "#ffffff0d" : L.bg, textColor: L.muted, radius: Math.min(L.radius, 10) }, "Periode");
  return inline([col([H(L, title, "h4", { size: 16 }), ...(sub ? [Pm(L, sub, { size: 13 })] : [])], { gap: 2, name: "Judul" }), seg], { gap: 12, justify: "between" });
}

const chartCard = (c: Ctx, ch: HChart, o: { height?: number; head?: boolean } = {}) =>
  card(c.L, [o.head === false ? H(c.L, c.t(ch.title), "h4", { size: 16 }) : chartHead(c, c.t(ch.title)), chart(c.L, c.t, ch, o.height)], "Grafik");

function mainBlock(c: Ctx): BoxNode {
  return gbox([chartCard(c, c.d.main, { height: 300 }), chartCard(c, c.d.side, { height: 300, head: false })], "minmax(0, 2fr) minmax(0, 1fr)", { name: "Grafik utama" });
}

function duo(c: Ctx): BoxNode {
  return gbox([chartCard(c, c.d.extra, { head: false }), chartCard(c, c.d.extra2 ?? c.d.side, { head: false })], "repeat(2, minmax(0, 1fr))", { name: "Dua grafik" });
}

function tableCard(c: Ctx, which: "table" | "table2" = "table", rows = 8): BoxNode {
  const { L, t } = c;
  const tb = (which === "table2" ? c.d.table2 : undefined) ?? c.d.table;
  const head = inline([col([H(L, t(tb.title), "h4", { size: 16 }), Pm(L, t(`${tb.rows.length} entri terbaru|${tb.rows.length} latest entries`), { size: 13 })], { gap: 2, name: "Judul" }), btnPrimary(L, t(c.d.action))], { gap: 12, justify: "between" });
  const tools = inline([search(L, t(c.d.search), t("Cari|Search")), select(L, t("Filter|Filter"), tb.filter.map(t), { label: false, full: false })], { gap: 10 });
  css(tools.children[0], "flex: 1 1 260px; min-width: 0;");
  const pager = el("pagination", { total: 6, current: 1, hrefPattern: "#", prevText: t("Sebelumnya|Previous"), nextText: t("Berikutnya|Next"), accentColor: L.p.primary, textColor: L.muted, borderColor: L.line, radius: Math.min(L.radius, 8) }, "Paginasi");
  return card(L, [head, tools, table(L, t, tb.cols, tb.rows.slice(0, rows)), pager], "Tabel data", { gap: 16 });
}

function miniTable(c: Ctx): BoxNode {
  const { L, t } = c;
  const tb = c.d.table;
  const cols = tb.cols.slice(0, 4);
  return card(L, [inline([H(L, t(tb.title), "h4", { size: 16, full: false }), linkTo(L, t("Lihat semua|View all"), c.href(firstKey(c, "records", "customers", "reports")))], { gap: 12, justify: "between" }), table(L, t, cols, tb.rows.slice(0, 5).map((r) => r.slice(0, 4)))], "Tabel ringkas");
}

function activity(c: Ctx): BoxNode {
  const { L, t } = c;
  const items = c.d.activity.map((a) => parts(t, a).join(" | "));
  return card(L, [H(L, t("Aktivitas terbaru|Recent activity"), "h4", { size: 16 }), el("timeline", { items, accentColor: L.p.primary, lineColor: L.line, dateColor: L.p.primary, titleColor: L.ink, textColor: L.muted, dotSize: 12 }, "Linimasa")], "Aktivitas");
}

function goals(c: Ctx): BoxNode {
  const { L, t } = c;
  const list = c.d.goals.map((g) => {
    const [a, v] = g.split(";").map((x) => x.trim());
    return [t(a), Number(v)] as const;
  });
  const kids: (ElementNode | BoxNode)[] = c.premium
    ? list.map(([a, v]) => el("progress", { label: a, value: v, barColor: L.p.primary, trackColor: L.dark ? "#ffffff1a" : L.p.soft, textColor: L.ink, height: 10 }, "Progres"))
    : list.map(([a, v]) => {
        const bar = para(" ", { size: 4 });
        css(bar, `height: 8px; border-radius: 999px; background: linear-gradient(90deg, ${L.p.primary} ${v}%, ${L.dark ? "#ffffff1a" : L.p.soft} ${v}%);`);
        return col([inline([para(a, { size: 14, color: L.ink, weight: 600, full: false }), para(`${v}%`, { size: 13, color: L.muted, full: false })], { gap: 8, justify: "between" }), bar], { gap: 6, name: "Target" });
      });
  return card(L, [H(L, t("Target bulan ini|This month's goals"), "h4", { size: 16 }), ...kids], "Target", { gap: 16 });
}

function team(c: Ctx): BoxNode {
  const { L, t } = c;
  const people = c.d.team.map((m) => m.split(";").map((x) => x.trim()));
  const av = el("avatar", { people: people.map(([n]) => n), stacked: true, maxVisible: 5, size: 40, bgColor: L.dark ? L.p.primary : L.p.soft, textColor: L.dark ? "#0f172a" : L.p.primaryDark, ringColor: L.surface }, "Avatar");
  const list = el(
    "list",
    {
      items: people.map(([n, r]) => `${n} · ${t(r)}`),
      listStyleType: "none",
      bgColor: "transparent",
      borderWidth: 0,
      shadowEnabled: false,
      textColor: L.ink,
      dividerEnabled: true,
      dividerColor: L.line,
      itemHoverBgColor: L.dark ? "#ffffff0d" : L.bg,
      itemHoverTextColor: L.ink,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemPaddingX: 6,
    },
    "Daftar tim",
  );
  return card(L, [inline([H(L, t("Tim|Team"), "h4", { size: 16, full: false }), badge(t(`${people.length} aktif|${people.length} active`), L.dark ? `${L.p.primary}33` : L.p.soft, L.dark ? L.ink : L.p.primaryDark)], { gap: 8, justify: "between" }), av, list], "Tim");
}

function board(c: Ctx): BoxNode {
  const { L, t } = c;
  const tones = [L.p.primary, "#f59e0b", "#10b981"];
  const cols = c.d.board.cols.map((name, i) => {
    const cards = (c.d.board.cards[i] ?? []).map((raw) => {
      const [title, tag] = raw.split(";").map((x) => t(x.trim()));
      const k = col([para(title, { size: 14, weight: 600, color: L.ink }), badge(tag, L.dark ? "#ffffff14" : L.bg, L.muted, L.line)], { gap: 8, name: "Tugas" });
      k.padding = 14;
      k.widthMode = "full";
      css(k, `background: ${L.dark ? "#ffffff0a" : L.surface}; border: 1px solid ${L.line}; border-radius: ${Math.min(L.radius, 10)}px; border-left: 3px solid ${tones[i % 3]};`);
      return k;
    });
    return card(L, [inline([H(L, t(name), "h4", { size: 15, full: false }), badge(String(cards.length), L.dark ? "#ffffff14" : L.p.soft, L.dark ? L.ink : L.p.primaryDark)], { gap: 8, justify: "between" }), ...cards], "Kolom papan", { gap: 12, pad: 16 });
  });
  return gbox(cols, `repeat(${cols.length}, minmax(0, 1fr))`, { name: "Papan", mobile: "scroll" });
}

function form(c: Ctx): BoxNode {
  const { L, t, d } = c;
  const fields = d.form.fields.map((f) => {
    const [a, ph, type] = f.split(";").map((x) => x.trim());
    return input(L, t(a), t(ph ?? ""), (type as Parameters<typeof input>[3]) || "text");
  });
  const selects = d.form.selects.map((f) => {
    const [a, ...opts] = f.split(";").map((x) => x.trim());
    return select(L, t(a), opts.map(t));
  });
  const grid = gbox([...fields, ...selects].map((e) => col([e], { gap: 0, name: "Field" })), "repeat(2, minmax(0, 1fr))", { name: "Field", gap: 16 });
  const switches = col(d.form.switches.map((s, i) => sw(L, t(s), i % 2 === 0)), { gap: 12, name: "Pengaturan" });
  const ta = el("textarea", { label: t("Catatan|Notes"), name: "catatan", placeholder: t(d.form.note), rows: 3, helper: "", labelColor: L.ink, borderColor: L.line, focusColor: L.p.primary, radius: Math.min(L.radius, 10) }, "Catatan");
  return card(L, [H(L, t(d.form.title), "h4", { size: 17 }), Pm(L, t(d.form.text)), grid, ta, switches, inline([btnPrimary(L, t("Simpan perubahan|Save changes")), linkTo(L, t("Batal|Cancel"), c.href("home"))], { gap: 10 })], "Formulir", { gap: 18, pad: 24 });
}

function alerts(c: Ctx): BoxNode {
  const { L, t } = c;
  const tones: [string, string, string][] = L.dark
    ? [
        ["#1e3a8a55", "#bfdbfe", "#1e40af"],
        ["#14532d55", "#bbf7d0", "#166534"],
        ["#78350f55", "#fde68a", "#92400e"],
      ]
    : [
        ["#eff6ff", "#1e3a8a", "#bfdbfe"],
        ["#f0fdf4", "#166534", "#bbf7d0"],
        ["#fffbeb", "#92400e", "#fde68a"],
      ];
  return col(
    c.d.alerts.map((a, i) => {
      const [bg, fg, bd] = tones[i % 3];
      return el("alert", { text: t(a), bgColor: bg, textColor: fg, borderColor: bd, borderRadius: Math.min(L.radius, 10) }, "Pemberitahuan");
    }),
    { gap: 10, name: "Pemberitahuan", align: "stretch" },
  );
}

function steps(c: Ctx): BoxNode {
  const { L, t } = c;
  return card(L, [H(L, t("Langkah penyiapan|Setup steps"), "h4", { size: 16 }), el("steps", { steps: c.d.steps.map((s) => parts(t, s).join(" | ")), current: 2, accentColor: L.p.primary, textColor: L.ink, mutedColor: L.muted, lineColor: L.line }, "Langkah")], "Langkah");
}

function tabs(c: Ctx): BoxNode {
  const { L, t } = c;
  return card(
    L,
    [
      H(L, t("Wawasan|Insights"), "h4", { size: 16 }),
      el(
        "tabs",
        {
          tabs: c.d.tabs.map((x) => {
            const [title, content] = parts(t, x);
            return { title, content };
          }),
          widthMode: "full",
          variant: "underline",
          textColor: L.muted,
          hoverTextColor: L.ink,
          activeTextColor: L.dark ? L.ink : L.p.primaryDark,
          activeBgColor: L.dark ? "#ffffff0d" : L.p.soft,
          indicatorColor: L.p.primary,
          listBgColor: "transparent",
          listBorderColor: L.line,
          panelTextColor: L.ink,
          panelFontSize: 14,
        },
        "Tab",
      ),
    ],
    "Wawasan",
  );
}

function quick(c: Ctx): BoxNode {
  const { L, t } = c;
  const links = ["records", "analytics", "settings", "board", "customers", "reports"].filter((k) => c.keys.has(k));
  return gbox(
    c.d.quick.slice(0, 4).map((q, i) => {
      const [g, a, b] = q.split(";").map((x) => x.trim());
      return card(L, [glyph(L, g, { size: 36 }), H(L, t(a), "h4", { size: 15 }), Pm(L, t(b), { size: 13 }), linkTo(L, t("Buka|Open"), c.href(links[i % Math.max(1, links.length)] ?? "home"))], "Pintasan", { gap: 10, pad: 18 });
    }),
    "repeat(4, minmax(0, 1fr))",
    { name: "Pintasan", mobile: "two", gap: 16 },
  );
}

function block(c: Ctx, b: HBlock, i: number): BoxNode {
  switch (b) {
    case "kpis":
      return kpis(c, i % 2 === 0 ? 0 : 2);
    case "main":
      return mainBlock(c);
    case "duo":
      return duo(c);
    case "wide":
      return chartCard(c, c.d.extra2 ?? c.d.extra, { height: 260 });
    case "table":
      return tableCard(c);
    case "mini-table":
      return miniTable(c);
    case "activity":
      return activity(c);
    case "goals":
      return goals(c);
    case "team":
      return team(c);
    case "board":
      return board(c);
    case "form":
      return form(c);
    case "alerts":
      return alerts(c);
    case "steps":
      return steps(c);
    case "tabs":
      return tabs(c);
    case "quick":
      return quick(c);
    case "split-act":
      return gbox([miniTable(c), activity(c)], "minmax(0, 1.6fr) minmax(0, 1fr)", { name: "Tabel & aktivitas" });
    case "split-goal":
      return gbox([goals(c), team(c)], "repeat(2, minmax(0, 1fr))", { name: "Target & tim" });
  }
}

/** Isi tiap jenis halaman (beranda dari spesifikasi). */
const PAGE_BLOCKS: Record<PageKind, HBlock[]> = {
  records: ["alerts", "table", "split-goal"],
  analytics: ["kpis", "duo", "wide", "tabs"],
  board: ["board", "split-act"],
  settings: ["form", "split-goal", "steps"],
  customers: ["kpis", "table", "activity"],
  reports: ["wide", "table", "duo"],
  login: [],
};

/* ------------------------------ kerangka --------------------------- */

const TOPNAV = (s: HSpec) => s.shell === "topnav" || s.shell === "topnav-dark";

function sideColors(c: Ctx): { bg: string; text: string; active: string; muted: string } {
  const { L, s } = c;
  switch (s.shell) {
    case "side-dark":
      return { bg: L.dark ? L.bg : "#0f172a", text: "#cbd5e1", active: "#ffffff", muted: "#64748b" };
    case "side-brand":
      return { bg: `linear-gradient(180deg, ${L.p.primaryDark}, #0f172a)`, text: "#e2e8f0", active: "#ffffff", muted: "#ffffffb3" };
    case "side-float":
    case "side-light":
    case "rail":
    default:
      return { bg: L.surface, text: L.muted, active: L.dark ? L.ink : L.p.primaryDark, muted: L.muted };
  }
}

function logo(c: Ctx, color: string, size = 18): BoxNode {
  const { L, s } = c;
  const g = image(asset(markKey(s.id)), `Logo ${s.brand}`, { ratio: "1 / 1", radius: 0 });
  g.state = { ...g.state, widthMode: "fixed", width: 32, lazyLoad: false };
  const name = heading(s.brand, "h4", { size, color, full: false });
  css(name, `font-family: ${L.head}; white-space: nowrap;`);
  const b = inline([g, name], { gap: 10 });
  b.widthMode = "auto";
  b.wrap = false;
  return b;
}

function avatarMe(c: Ctx): ElementNode {
  const me = c.d.team[0]?.split(";")[0]?.trim() ?? "Admin";
  return el("avatar", { people: [me], stacked: false, maxVisible: 1, size: 36, showStatus: true, bgColor: c.L.dark ? c.L.p.primary : c.L.p.soft, textColor: c.L.dark ? "#0f172a" : c.L.p.primaryDark, ringColor: c.L.surface }, "Profil");
}

function topbar(c: Ctx): BoxNode {
  const { L, s, t, d } = c;
  const dark = s.shell === "topnav-dark";
  const bg = dark ? (L.dark ? L.bg : "#0f172a") : L.surface;
  const ink = dark ? "#ffffff" : L.ink;
  const right = inline([badge(t("3 baru|3 new"), L.dark || dark ? `${L.p.primary}40` : L.p.soft, dark || L.dark ? "#ffffff" : L.p.primaryDark), avatarMe(c)], { gap: 12, justify: "end" });
  right.widthMode = "auto";
  right.wrap = false;
  let kids: (BoxNode | ElementNode)[];
  if (TOPNAV(s)) {
    const nav = el("menu", { siteId: "", pageIds: [], textColor: dark ? "#cbd5e1" : L.muted, hoverColor: dark ? "#ffffff" : L.p.primary, activeColor: dark ? "#ffffff" : L.p.primary, gap: 18, fontSize: 14, align: "center", stackOnMobile: false, mobileMenu: "burger", panelBg: bg }, "Menu");
    kids = [logo(c, ink), nav, right];
  } else {
    const sb = search(L, t(d.search), t("Cari|Search"));
    css(sb, "flex: 0 1 420px;");
    css(sb, "@media (max-width: 760px) { & { display: none; } }");
    kids = [logo(c, ink), sb, right];
  }
  const row = createRow({ name: "Bilah atas", padding: 0, layout: "row", align: "center", justify: "between", wrap: false, gap: 16, stackOnMobile: false, children: kids });
  const sec = section("Header", [row], { bg, padY: 12, width: 0, tag: "header" });
  sec.section!.padX = 24;
  css(sec, `border-bottom: 1px solid ${dark ? "#ffffff14" : L.line}; position: sticky; top: 0; z-index: 30;`);
  css(sec, "@media (max-width: 640px) { & { padding-left: 16px; padding-right: 16px; } }");
  return sec;
}

function sidebar(c: Ctx): BoxNode {
  const { L, s, t } = c;
  const sc = sideColors(c);
  const rail = s.shell === "rail";
  const nav = el(
    "menu",
    { siteId: "", pageIds: [], orientation: "vertical", align: "stretch", gap: rail ? 2 : 4, fontSize: rail ? 13 : 14, fontWeight: 500, paddingY: 9, paddingX: 12, textColor: sc.text, hoverColor: sc.active, activeColor: sc.active, stackOnMobile: false },
    "Menu samping",
  );
  const activeBg = s.shell === "side-dark" || s.shell === "side-brand" ? "#ffffff1f" : L.dark ? "#ffffff12" : L.p.soft;
  css(nav, `& a { border-radius: ${Math.min(L.radius, 10)}px; display: block; }\n& a[aria-current="page"] { background: ${activeBg}; }\n& a:hover { background: ${activeBg}; }`);
  css(nav, "@media (min-width: 641px) { & { position: sticky; top: 84px; } }");
  css(nav, "@media (max-width: 640px) { & ul { flex-direction: row; overflow-x: auto; flex-wrap: nowrap; } & li { flex: none; } }");
  const onDark = s.shell === "side-dark" || s.shell === "side-brand";
  const helpLink = linkTo(L, t("Pengaturan|Settings"), c.href(firstKey(c, "settings", "home")));
  if (onDark || L.dark) helpLink.state = { ...helpLink.state, textColor: "#ffffff", borderColor: "#ffffff66", hoverBgColor: "#ffffff1f", hoverTextColor: "#ffffff", hoverBorderColor: "#ffffff" };
  const help = col(
    [para(t("Butuh bantuan?|Need help?"), { size: 14, weight: 700, color: onDark ? "#ffffff" : L.ink }), para(t("Lihat panduan atau hubungi tim dukungan.|Read the guide or contact support."), { size: 13, color: sc.muted }), helpLink],
    { gap: 8, name: "Bantuan" },
  );
  help.padding = 14;
  help.widthMode = "full";
  css(help, `background: ${s.shell === "side-dark" || s.shell === "side-brand" ? "#ffffff12" : L.dark ? "#ffffff0a" : L.bg}; border-radius: ${Math.min(L.radius, 12)}px;`);
  css(help, "@media (max-width: 640px) { & { display: none; } }");
  const kids: (BoxNode | ElementNode)[] = [para(t("Menu utama|Main menu"), { size: 11, weight: 700, color: sc.muted, transform: "uppercase", spacing: 1 }), nav];
  if (!rail) kids.push(help);
  const side = col(kids, { gap: 14, name: "Sidebar", align: "stretch" });
  side.padding = rail ? 12 : 18;
  side.widthMode = "full";
  const float = s.shell === "side-float";
  css(
    side,
    `background: ${sc.bg}; ${s.shell === "side-light" || s.shell === "rail" ? `border-right: 1px solid ${L.line};` : ""} ${float ? `margin: 16px 0 16px 16px; border-radius: ${L.radius}px; box-shadow: 0 10px 30px -18px rgba(15, 23, 42, 0.35);` : ""} min-height: calc(100vh - 64px);`,
  );
  css(side, "@media (max-width: 640px) { & { position: static; min-height: 0; margin: 0; border-radius: 0; border-right: 0; padding: 10px 12px; } }");
  return side;
}

function pageTitle(c: Ctx, key: string, kind: PageKind | "overview"): BoxNode {
  const { L, t, d, s } = c;
  const name = t(d.names[kind] ?? (kind === "overview" ? "Ringkasan|Overview" : kind));
  const sub = kind === "overview" ? t(d.role) : t(`${s.brand} · diperbarui 5 menit lalu|${s.brand} · updated 5 minutes ago`);
  const acts = inline([linkTo(L, t("Unduh laporan|Download report"), c.href(firstKey(c, "reports", "analytics", "records"))), btnPrimary(L, t(d.action))], { gap: 10, justify: "end" });
  acts.widthMode = "auto";
  return inline([col([H(L, name, "h1", { size: 26 }), Pm(L, sub)], { gap: 4, name: "Judul halaman" }), ...(key === "settings" ? [] : [acts])], { gap: 14, justify: "between" });
}

function appSection(c: Ctx, key: string, kind: PageKind | "overview", blocks: HBlock[]): BoxNode {
  const { L, s } = c;
  const content = col([pageTitle(c, key, kind), ...blocks.map((b, i) => block(c, b, i))], { gap: 20, name: "Konten", align: "stretch" });
  content.padding = 28;
  content.widthMode = "full";
  css(content, "min-width: 0;");
  css(content, "@media (max-width: 640px) { & { padding: 16px; } }");
  const sideW = s.shell === "rail" ? 200 : s.shell === "side-float" ? 256 : 240;
  const row = TOPNAV(s)
    ? createRow({ name: "Row Aplikasi", padding: 0, gap: 0, align: "stretch", children: [content] })
    : createRow({ name: "Row Aplikasi", padding: 0, layout: "grid", columns: `${sideW}px minmax(0, 1fr)`, gap: 0, align: "stretch", justify: "stretch", stackOnMobile: true, children: [sidebar(c), content] });
  const sec = section(TOPNAV(s) ? "Aplikasi" : "Aplikasi (sidebar)", [row], { bg: L.bg, padY: 0, width: TOPNAV(s) ? 1320 : 0 });
  sec.section!.padX = TOPNAV(s) ? 16 : 0;
  return sec;
}

function footer(c: Ctx): BoxNode {
  const { L, s, t } = c;
  const row = createRow({
    name: "Row Footer",
    padding: 0,
    layout: "row",
    align: "center",
    justify: "between",
    wrap: true,
    gap: 10,
    stackOnMobile: false,
    children: [para(`© 2026 ${s.brand}. ${t("Data contoh, ganti dengan data Anda.|Sample data, replace with your own.")}`, { size: 13, color: L.muted, full: false }), badge(t("● Semua sistem normal|● All systems normal"), L.dark ? "#14532d" : "#dcfce7", L.dark ? "#86efac" : "#166534")],
  });
  const sec = section("Footer", [row], { bg: L.surface, padY: 16, width: 0, tag: "footer" });
  sec.section!.padX = 24;
  css(sec, `border-top: 1px solid ${L.line};`);
  return sec;
}

/* ------------------------------ masuk ------------------------------ */

/** Ilustrasi dashboard (SVG set H) di halaman Masuk. */
function loginArt(c: Ctx, radius: number): ElementNode {
  const img = image(asset(loginArtKey(c.s.id)), c.t("Ilustrasi dashboard|Dashboard illustration"), { ratio: "10 / 7", radius: Math.min(radius, 16) });
  img.state = { ...img.state, lazyLoad: false };
  return img;
}

function loginPage(c: Ctx): BoxNode[] {
  const { L, s, t, d } = c;
  const headRow = createRow({ name: "Bilah atas", padding: 0, layout: "row", align: "center", justify: "between", wrap: false, gap: 16, stackOnMobile: false, children: [logo(c, L.ink), linkTo(L, t("Ke dashboard|To dashboard"), c.href("home"))] });
  const head = section("Header", [headRow], { bg: L.surface, padY: 14, width: 0, tag: "header" });
  head.section!.padX = 24;
  css(head, `border-bottom: 1px solid ${L.line};`);

  const formCard = card(
    L,
    [
      H(L, t(d.login.title), "h2", { size: 26 }),
      Pm(L, t(d.login.text)),
      input(L, t("Email kerja|Work email"), "nama@perusahaan.com", "email"),
      input(L, t("Kata sandi|Password"), "••••••••", "password"),
      inline([el("checkbox", { labelText: t("Ingat saya|Remember me"), defaultChecked: true, checkedBgColor: L.p.primary, checkedBorderColor: L.p.primary, focusRingColor: L.p.primary, textColor: L.ink }, "Ingat saya"), el("anchor", { text: t("Lupa sandi?|Forgot password?"), href: "#", fontSize: 14, fontWeight: 600, textColor: L.dark ? L.ink : L.p.primaryDark }, "Lupa sandi")], { gap: 10, justify: "between" }),
      (() => {
        const b = btnPrimary(L, t("Masuk|Sign in"));
        b.state = { ...b.state, widthMode: "full", buttonType: "submit" };
        return b;
      })(),
      Pm(L, t("Halaman contoh: formulir belum terhubung ke server.|Sample page: the form is not connected to a server."), { size: 12, align: "center" }),
    ],
    "Formulir masuk",
    { gap: 16, pad: 32 },
  );
  css(formCard, "max-width: 440px; width: 100%; justify-self: center;");

  let row: BoxNode;
  if (s.login === "split") {
    const panel = col(
      [
        glyph(L, d.glyph, { size: 48, bg: "#ffffff26", color: "#ffffff" }),
        heading(s.brand, "h2", { size: 30, color: "#ffffff" }),
        para(t(d.role), { size: 16, color: "#e0e7ff" }),
        loginArt(c, 12),
        el("list", { items: d.login.bullets.map(t), listStyleType: "none", bgColor: "transparent", borderWidth: 0, shadowEnabled: false, textColor: "#ffffff", dividerEnabled: false, itemHoverEnabled: false, paddingTop: 0, paddingBottom: 0, paddingLeft: 0, paddingRight: 0, itemPaddingX: 0, itemPaddingY: 6 }, "Keunggulan"),
      ],
      { gap: 16, name: "Panel merek" },
    );
    panel.padding = 40;
    panel.widthMode = "full";
    css(panel, `background: linear-gradient(135deg, ${L.p.primaryDark}, ${L.p.primary}); border-radius: ${L.radius}px; min-height: 420px; justify-content: center;`);
    css(panel, "@media (max-width: 640px) { & { min-height: 0; padding: 24px; } }");
    row = createRow({ name: "Row Masuk", padding: 0, layout: "grid", columns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 32, align: "center", justify: "stretch", stackOnMobile: true, children: [panel, formCard] });
  } else {
    const intro = col([loginArt(c, L.radius), H(L, s.brand, "h3", { size: 22, align: "center" }), Pm(L, t(d.role), { align: "center" })], { gap: 10, name: "Pengantar", align: "center" });
    intro.widthMode = "full";
    if (s.login === "banner") css(intro, `padding: 28px; border-radius: ${L.radius}px; background: ${L.dark ? `${L.p.primary}26` : L.p.soft};`);
    row = createRow({ name: "Row Masuk", padding: 0, gap: 24, align: "center", children: [intro, formCard] });
  }
  const body = section("Masuk", [row], { bg: L.bg, padY: 72, width: s.login === "split" ? 1040 : 520 });
  css(body, "min-height: calc(100vh - 130px);");
  return [head, body, footer(c)];
}

/* ------------------------------ halaman ---------------------------- */

function pagesOf(s: HSpec): TemplatePageDef[] {
  const d = s.domain;
  const nm = (k: "overview" | PageKind, fb: X): [string, string] => split1(d.names[k] ?? fb).map((x) => x.trim()) as [string, string];
  const fallback: Record<PageKind, X> = { records: "Data|Data", analytics: "Analitik|Analytics", board: "Tugas|Tasks", settings: "Pengaturan|Settings", login: "Masuk|Sign in", customers: "Pelanggan|Customers", reports: "Laporan|Reports" };
  const [hid, hen] = nm("overview", "Ringkasan|Overview");
  return [
    { key: "home", slug: { id: "index", en: "index" }, name: { id: hid, en: hen }, home: true },
    ...s.pages.map((k) => {
      const [id, en] = nm(k, fallback[k]);
      return { key: k, slug: { id: slugify(id), en: slugify(en) }, name: { id, en } };
    }),
  ];
}

function buildPage(s: HSpec, key: string, tr: Tr, href: (k: string) => string): PageDoc {
  const L = lookOf(s);
  const c: Ctx = { s, d: s.domain, L, t: tOf(tr), href, premium: s.tier === "premium", keys: new Set(["home", ...s.pages]) };
  let sections: BoxNode[];
  if (key === "login") sections = loginPage(c);
  else {
    const kind = (key === "home" ? "overview" : key) as PageKind | "overview";
    const blocks = key === "home" ? s.home : PAGE_BLOCKS[key as PageKind];
    sections = [topbar(c), appSection(c, key, kind, blocks), footer(c)];
  }
  const doc = pageWith(sections, L.font, L.bg);
  if (c.premium && s.fx) {
    // Efek per blok konten (judul halaman tidak ikut).
    const row = sections[1].children[0] as BoxNode | undefined;
    const content = row?.children.at(-1);
    const targets = content && "children" in content ? (content as BoxNode).children.slice(1) : [sections[1]];
    targets.forEach((n, i) => (s.fx === "aos" ? aos(n, "fade-up", { duration: 500, delay: Math.min(i, 3) * 50 }) : animate(n, "fadeIn", { speed: "fast" })));
    return installLibs(doc, [s.fx]);
  }
  return doc;
}

export function buildContent(s: HSpec): TemplateContent {
  return { brand: s.brand, pages: pagesOf(s), build: (key, tr, href) => buildPage(s, key, tr, href), polish: false };
}
