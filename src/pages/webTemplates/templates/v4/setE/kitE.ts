import type { BoxNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import { badge, col, el, eyebrow, grid, inline, para, section, stack } from "../../../build";
import { acts, addCss, card, fxBlock, fxCard, fxHero, fxImg, intro, introEls, P, picture, T, type HeroC, type Intro, type LookD } from "../../v3/setD/kitD";

/* ================================================================== */
/* Template kit v4 part E                                                */
/*                                                                    */
/* The basics (Look, header, footer, theme shape cards, library effects) use */
/* kitD; this file adds NEW sections typical of set E: a dashboard hero (chart */
/* inside a glass card), stacked hero (outlined typography), ticket hero, */
/* chart panels & double charts (Chart element), KPI ribbons with deltas, */
/* airport-style schedule board, pastel sticky notes, material swatches,  */
/* a horizontal step rail, tilted polaroids, and a two-color split ribbon. */
/* ================================================================== */

export * from "../../v3/setD/kitD";

/* ------------------------------ grafik ----------------------------- */

export interface ChartC {
  type: "bar" | "line" | "pie" | "doughnut";
  title: string;
  /** Nama seri dipisah koma (maks. 2). */
  series: string;
  /** "Label, value1, value2" — numbers without thousands separators. */
  rows: string[];
  c2?: string;
  height?: number;
  legend?: boolean;
}

/** Chart element (Chart.js is added automatically by compose on export). */
function chartEl(L: LookD, c: ChartC, dark = L.dark): ElementNode {
  return el(
    "chart",
    {
      chartType: c.type,
      title: c.title,
      series: c.series,
      rows: c.rows,
      color1: L.p.primary,
      color2: c.c2 ?? "#f59e0b",
      titleColor: dark ? "#f8fafc" : L.p.ink,
      textColor: dark ? "#cbd5e1" : L.p.muted,
      showLegend: c.legend ?? true,
      beginAtZero: true,
      height: c.height ?? 300,
    },
    "Grafik",
  );
}

/** Chart panel: text + small KPIs on one side, a chart card on the other. */
export function chartPanel(L: LookD, c: Intro & { chart: ChartC; kpis?: [string, string][]; bullets?: string[]; reverse?: boolean; name?: string; bg?: string }): BoxNode {
  const kpis = c.kpis
    ? [
        col(
          c.kpis.map(([v, l]) => col([T(L, v, "h3", { size: 28, color: L.p.primary }), P(L, l, { size: 13 })], { gap: 2, name: "KPI" })),
          { layout: "row", gap: 28, name: "Deret KPI", align: "start" },
        ),
      ]
    : [];
  const bullets = (c.bullets ?? []).map((b) => P(L, `— ${b}`, { size: 15, color: L.p.ink }));
  const text = fxBlock(L, col([...introEls(L, c), ...bullets, ...kpis], { gap: 14, name: "Teks" }));
  const chart = fxImg(L, card(L, [chartEl(L, c.chart)], { name: "Kartu grafik", pad: 22 }));
  return section(c.name ?? "Panel Grafik", [grid(c.reverse ? [chart, text] : [text, chart], "minmax(0, 1fr) minmax(0, 1.35fr)", { gap: 40, align: "center" })], { bg: c.bg ?? L.bg, padY: 80 });
}

/** Double chart: two (or three) chart cards side by side + a note. */
export function chartDuo(L: LookD, c: Intro & { charts: ChartC[]; notes?: string[]; name?: string; bg?: string }): BoxNode {
  const cells = c.charts.map((ch, i) => fxCard(L, card(L, [chartEl(L, ch), ...(c.notes?.[i] ? [P(L, c.notes[i], { size: 13 })] : [])], { name: "Kartu grafik", pad: 20 }), i));
  return section(c.name ?? "Grafik Ganda", [intro(L, c), grid(cells, `repeat(${c.charts.length}, minmax(0, 1fr))`, { gap: 22, align: "stretch" })], { bg: c.bg ?? L.alt, padY: 80 });
}

/* ------------------------------- hero ------------------------------ */

/** Dashboard Hero: gradient background, light text, a glass card with a chart + KPI chips. */
export function heroDash(L: LookD, c: HeroC & { chart: ChartC; kpis: [string, string][]; gradient: [string, string] }): BoxNode {
  const text = col(
    [...(c.eyebrow ? [badge(c.eyebrow, "#ffffff1f", "#ffffff", "#ffffff55")] : []), fxHero(L, c.titleNode ?? T(L, c.title, "h1", { size: c.size ?? 56, color: "#ffffff" })), P(L, c.text, { size: 18, color: "#e2e8f0" }), ...(c.actions ? [acts(L, c.actions)] : [])],
    { gap: 18, name: "Teks hero" },
  );
  const chips = inline(
    c.kpis.map(([v, l]) => {
      const b = badge(`${v} · ${l}`, "#ffffff", L.p.primaryDark, "#ffffff");
      addCss(b, "font-weight: 700;");
      return b;
    }),
    { gap: 8 },
  );
  const panel = col([chartEl(L, c.chart, false), chips], { gap: 14, name: "Kartu kaca grafik", align: "stretch" });
  panel.padding = 24;
  addCss(panel, `background: #ffffffe6; border: 1px solid #ffffff; border-radius: ${L.radius + 6}px; box-shadow: 0 40px 80px -40px #0f172acc; backdrop-filter: blur(14px);`);
  return section("Hero Dasbor", [grid([text, fxImg(L, panel)], "minmax(0, 1fr) minmax(0, 1.2fr)", { gap: 48, align: "center" })], { gradient: [c.gradient[0], c.gradient[1], 135], padY: 96 });
}

/** Stacked hero: three lines of giant heading — solid, outlined, colored. */
export function heroStacked(L: LookD, c: HeroC & { lines: [string, string, string] }): BoxNode {
  const [a, b, d] = c.lines;
  const size = c.size ?? 96;
  const l1 = fxHero(L, T(L, a, "h1", { size, weight: 800, spacing: -3 }));
  const l2 = T(L, b, "h2", { size, weight: 800, spacing: -3, color: L.bg });
  addCss(l2, `-webkit-text-stroke: 2px ${L.p.ink}; line-height: 0.95;`);
  const l3 = T(L, d, "h2", { size, weight: 800, spacing: -3, color: L.p.primary });
  [l1, l3].forEach((n) => addCss(n, "line-height: 0.95;"));
  // Typing text (optional) shows as a subheading in the side column.
  const sub = c.titleNode ? [Object.assign(c.titleNode, { state: { ...c.titleNode.state, tag: "p", fontSize: 30 } })] : [];
  const side = col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), ...sub, P(L, c.text, { size: 18 }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 16, name: "Teks samping" });
  const pic = c.image ? fxImg(L, col([picture(L, c.image, c.alt ?? c.title, "3 / 4")], { name: "Gambar" })) : null;
  return section(
    "Hero Tumpuk",
    [stack([l1, l2, l3], { gap: 0, align: "stretch" }), grid(pic ? [side, pic] : [side], pic ? "minmax(0, 1.3fr) minmax(0, 1fr)" : 1, { gap: 40, align: "end" })],
    { bg: L.bg, padY: 72 },
  );
}

/** Ticket Hero: a ticket card with a dashed tear line and info stubs on the right. */
export function heroTicket(L: LookD, c: HeroC & { stubs: [string, string][] }): BoxNode {
  const main = col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), fxHero(L, T(L, c.title, "h1", { size: c.size ?? 52 })), P(L, c.text, { size: 17 }), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 16, name: "Badan tiket" });
  main.padding = 40;
  const stub = col(
    c.stubs.map(([k, v]) => col([para(k, { size: 12, weight: 700, color: "#cbd5e1", transform: "uppercase", spacing: 2 }), para(v, { size: 20, weight: 800, color: "#ffffff" })], { gap: 2, name: "Info" })),
    { gap: 18, name: "Potongan tiket" },
  );
  stub.padding = 32;
  addCss(stub, `background: ${L.p.primaryDark}; border-left: 3px dashed ${L.bg}; min-height: 100%;`);
  const ticket = grid([main, stub], "minmax(0, 1.8fr) minmax(0, 1fr)", { gap: 0, align: "stretch" });
  addCss(ticket, `background: ${L.surface}; border-radius: ${L.radius}px; overflow: hidden; box-shadow: 0 30px 60px -30px ${L.p.ink}88;`);
  const pic = c.image ? [stack([fxImg(L, picture(L, c.image, c.alt ?? c.title, "21 / 8"))], { align: "stretch" })] : [];
  return section("Hero Tiket", [...pic, ticket], { bg: L.alt, padY: 72 });
}

/* ----------------------------- konten ------------------------------ */

/** KPI ribbon: large numbers + labels + delta chips, on a contrasting background. */
export function kpiStrip(L: LookD, c: { items: [string, string, string][]; name?: string; inv?: boolean }): BoxNode {
  const inv = c.inv ?? true;
  const cells = c.items.map(([v, l, d], i) => {
    const chip = badge(d, inv ? "#ffffff1a" : L.p.soft, inv ? "#ffffff" : L.p.primaryDark, inv ? "#ffffff33" : L.p.line);
    return fxCard(L, col([T(L, v, "h2", { size: 46, color: inv ? "#ffffff" : L.p.ink }), para(l, { size: 14, color: inv ? "#cbd5e1" : L.p.muted }), chip], { gap: 6, name: "KPI" }), i);
  });
  const g = grid(cells, `repeat(${c.items.length}, minmax(0, 1fr))`, { gap: 24 });
  addCss(g, "@media (max-width: 640px) { & { grid-template-columns: repeat(2, minmax(0, 1fr)); } }");
  return section(c.name ?? "Pita KPI", [g], { bg: inv ? L.inv : L.alt, padY: 56 });
}

/** Airport-style schedule board: dark monospace rows. */
export function board(L: LookD, c: Intro & { head: [string, string, string, string]; rows: [string, string, string, string][]; name?: string }): BoxNode {
  const mono = '"JetBrains Mono", monospace';
  const line = (r: string[], headRow = false, i = 0) => {
    // A Column (not a Row) styled as a grid so there are no nested Rows inside the board.
    const g = col(
      r.map((x, j) => {
        const t = para(x, { size: headRow ? 12 : 16, weight: headRow ? 700 : 600, color: headRow ? "#94a3b8" : j === 3 ? "#fbbf24" : "#f8fafc", transform: headRow ? "uppercase" : "none", spacing: headRow ? 2 : 0 });
        addCss(t, `font-family: ${mono};`);
        return col([t], { name: "Sel" });
      }),
      { layout: "row", gap: 12, name: "Baris papan", align: "center", stackOnMobile: false },
    );
    addCss(g, "display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr); width: 100%;");
    addCss(g, `padding: 14px 18px; border-bottom: 1px solid #ffffff1a;${headRow ? "" : i % 2 ? " background: #ffffff08;" : ""}`);
    addCss(g, "@media (max-width: 640px) { & { grid-template-columns: repeat(2, minmax(0, 1fr)); } }");
    return g;
  };
  const panel = col([line(c.head, true), ...c.rows.map((r, i) => line(r, false, i))], { gap: 0, name: "Papan", align: "stretch" });
  addCss(panel, `background: #0b1120; border-radius: ${Math.min(L.radius, 16)}px; overflow: hidden; box-shadow: 0 24px 50px -30px #000000;`);
  return section(c.name ?? "Papan Jadwal", [intro(L, c), stack([fxBlock(L, panel)], { align: "stretch" })], { bg: L.bg, padY: 80 });
}

/** Sticky notes: alternately tilted pastel cards. */
export function notes(L: LookD, c: Intro & { items: [string, string][]; colors: string[]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map(([t, x], i) => {
    const n = col([T(L, t, "h3", { size: 22 }), P(L, x, { size: 15, color: L.p.ink })], { gap: 8, name: "Catatan" });
    n.padding = 26;
    addCss(n, `background: ${c.colors[i % c.colors.length]}; transform: rotate(${i % 2 ? 1.5 : -1.5}deg); box-shadow: 0 14px 24px -16px #0f172a66; border-radius: 4px;`);
    return fxCard(L, n, i);
  });
  return section(c.name ?? "Catatan Tempel", [intro(L, c), grid(cells, `repeat(${Math.min(4, c.items.length)}, minmax(0, 1fr))`, { gap: 26 })], { bg: c.bg ?? L.bg, padY: 80 });
}

/** Material swatches: color circle + name + description. */
export function swatches(L: LookD, c: Intro & { items: [string, string, string][]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map(([color, t, x], i) => {
    const dot = para(" ", { size: 12 });
    addCss(dot, `width: 88px; height: 88px; border-radius: 999px; background: ${color}; border: 4px solid ${L.surface}; box-shadow: 0 0 0 1px ${L.p.line};`);
    return fxCard(L, col([dot, T(L, t, "h4", { size: 18 }), P(L, x, { size: 14 })], { gap: 8, name: "Swatch", align: "center" }), i);
  });
  return section(c.name ?? "Swatch Material", [intro(L, { ...c, align: c.align ?? "center" }), grid(cells, `repeat(${Math.min(5, c.items.length)}, minmax(0, 1fr))`, { gap: 24 })], { bg: c.bg ?? L.alt, padY: 80 });
}

/** Horizontal step rail: numbers in circles above a line. */
export function rail(L: LookD, c: Intro & { steps: [string, string][]; name?: string; bg?: string }): BoxNode {
  const cells = c.steps.map(([t, x], i) => {
    const num = para(String(i + 1).padStart(2, "0"), { size: 16, weight: 800, color: "#ffffff", align: "center" });
    addCss(num, `width: 52px; height: 52px; line-height: 52px; border-radius: 999px; background: ${L.p.primary}; box-shadow: 0 0 0 8px ${L.p.soft};`);
    const cell = col([num, T(L, t, "h4", { size: 18 }), P(L, x, { size: 14 })], { gap: 10, name: "Langkah" });
    addCss(cell, `border-top: 2px dashed ${L.p.line}; padding-top: 0;`);
    return fxCard(L, cell, i);
  });
  return section(c.name ?? "Rel Langkah", [intro(L, c), grid(cells, `repeat(${c.steps.length}, minmax(0, 1fr))`, { gap: 20 })], { bg: c.bg ?? L.bg, padY: 80 });
}

/** Polaroid: white-framed photos, alternately tilted, handwritten captions. */
export function polaroids(L: LookD, c: Intro & { items: [string, string][]; name?: string; bg?: string }): BoxNode {
  const cells = c.items.map(([src, cap], i) => {
    const capEl = para(cap, { size: 16, weight: 600, color: "#1f2937", align: "center" });
    addCss(capEl, `font-family: "Caveat", cursive; font-size: 22px;`);
    const n = col([picture(L, src, cap, "1 / 1", 0), capEl], { gap: 10, name: "Polaroid", align: "stretch" });
    n.padding = 14;
    addCss(n, `background: #ffffff; transform: rotate(${[-3, 2, -1.5, 3][i % 4]}deg); box-shadow: 0 20px 30px -20px #0f172a88;`);
    return fxCard(L, n, i);
  });
  return section(c.name ?? "Polaroid", [intro(L, { ...c, align: c.align ?? "center" }), grid(cells, `repeat(${Math.min(4, c.items.length)}, minmax(0, 1fr))`, { gap: 30 })], { bg: c.bg ?? L.alt, padY: 88 });
}

/** Split band: two panels of different colors side by side (split screen). */
export function splitBand(L: LookD, c: { left: Intro & { actions?: [string, string, ("primary" | "outline" | "light" | "dark")?][] }; right: Intro & { actions?: [string, string, ("primary" | "outline" | "light" | "dark")?][] }; name?: string }): BoxNode {
  const half = (x: typeof c.left, bgc: string, light: boolean) => {
    const h = fxBlock(L, col([...introEls(L, { ...x, light }), ...(x.actions ? [acts(L, x.actions)] : [])], { gap: 14, name: "Panel" }));
    h.padding = 48;
    addCss(h, `background: ${bgc}; min-height: 100%;`);
    return h;
  };
  return section(c.name ?? "Pita Belah", [grid([half(c.left, L.p.primaryDark, true), half(c.right, L.p.soft, false)], 2, { gap: 0, align: "stretch" })], { bg: L.bg, padY: 0, width: 1400 });
}
