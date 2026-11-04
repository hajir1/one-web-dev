import type { BoxNode, ElementNode, SectionKind } from "../../../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../../../pageMaker/engine/helpers/componentTypes";
import { createBox } from "../../../../pageMaker/engine/helpers/tree";
import { badge, col, eyebrow, grid, image, section, stack } from "../../../build";
import { acts, addCss, card, fxBlock, fxCard, fxHero, fxImg, glyph, introEls, P, T, type Act, type HeroC, type Intro, type Item, type LookD } from "../../v4/setE/kitE";

/* ================================================================== */
/* Template kit v5 part F — Divi-style layouts                           */
/*                                                                    */
/* The basics (Look, header, footer, cards, effects) use kitE/kitD. This file */
/* adds FULL WIDTH sections (screen-wide, no padding)                   */
/* and SPECIALTY sections (a side column as tall as the section + a column holding */
/* several inner rows), marked with `section.sectionType` so that in     */
/* Page Maker shows them as the same type as user-made ones.            */
/* ================================================================== */

export * from "../../v4/setE/kitE";

/** Marks the section type; full width = no width limit & side padding. */
function kind(s: BoxNode, k: SectionKind): BoxNode {
  s.section = { ...s.section!, sectionType: k, ...(k === "fullwidth" ? { contentWidth: 0, padX: 0, padY: 0 } : {}) };
  if (k === "fullwidth") s.children.forEach((r) => isBox(r) && (r.rowWidth = "full"));
  return s;
}

/* --------------------------- full width --------------------------- */

/**
 * Full Width Header: a screen-wide background image + overlay, heading & buttons
 * (equivalent to Divi's "Fullwidth Header" module).
 */
export function fullHeader(L: LookD, c: HeroC & { image: string; align?: "left" | "center"; height?: number; overlay?: number; chips?: string[] }): BoxNode {
  const align = c.align ?? "center";
  const inner = col(
    [
      ...(c.eyebrow ? [badge(c.eyebrow, "#ffffff22", "#ffffff", "#ffffff66")] : []),
      fxHero(L, c.titleNode ?? T(L, c.title, "h1", { size: c.size ?? 64, color: "#ffffff", align })),
      P(L, c.text, { size: 19, color: "#f1f5f9", align }),
      ...(c.chips ? [col(c.chips.map((x) => badge(x, "#00000033", "#ffffff", "#ffffff44")), { layout: "row", gap: 8, name: "Chip" })] : []),
      ...(c.actions ? [acts(L, c.actions, align === "center" ? "center" : "start")] : []),
    ],
    { gap: 18, name: "Isi header", align: align === "center" ? "center" : "start" },
  );
  addCss(inner, `max-width: 820px; ${align === "center" ? "margin: 0 auto;" : "margin-left: max(24px, calc((100% - 1120px) / 2));"} padding: ${c.height ?? 150}px 24px;`);
  addCss(inner, "@media (max-width: 640px) { & { padding: 90px 20px; } }");
  const s = section("Header Lebar Penuh", [stack([inner], { gap: 0, align: "stretch" })], {});
  Object.assign(s, {
    bgEnabled: true,
    bgType: "image",
    bgImage: c.image,
    bgColor: L.inv,
    bgSize: "cover",
    bgPosition: "center",
    bgOverlayColor: L.inv,
    bgOverlayOpacity: c.overlay ?? 55,
  });
  return kind(s, "fullwidth");
}

/** Full Width Image: one screen-wide photo (+ an optional caption above it). */
export function fullImage(L: LookD, c: { image: string; alt: string; ratio?: string; caption?: string; name?: string }): BoxNode {
  const pic = image(c.image, c.alt, { ratio: c.ratio ?? "21 / 7", radius: 0 });
  addCss(pic, "@media (max-width: 640px) { & img { aspect-ratio: 4 / 3 !important; } }");
  const rows = [stack([fxImg(L, pic)], { gap: 0, align: "stretch" })];
  if (c.caption) {
    const cap = P(L, c.caption, { size: 14, align: "center", color: L.p.muted });
    addCss(cap, "padding: 14px 24px;");
    rows.push(stack([cap], { gap: 0, align: "stretch" }));
  }
  rows.forEach((r) => (r.advanced = undefined));
  return kind(section(c.name ?? "Gambar Lebar Penuh", rows, { bg: L.bg }), "fullwidth");
}

/** Full Width Split: a photo on one side, a color panel on the other, screen-wide. */
export function fullSplit(L: LookD, c: Intro & { image: string; alt: string; bullets?: string[]; actions?: Act[]; reverse?: boolean; name?: string; tone?: "inv" | "primary" }): BoxNode {
  const light = true;
  const bg = c.tone === "primary" ? L.p.primaryDark : L.inv;
  const panel = fxBlock(L, col([...introEls(L, { ...c, light }), ...(c.bullets ?? []).map((b) => P(L, `✓ ${b}`, { size: 16, color: "#f8fafc" })), ...(c.actions ? [acts(L, c.actions)] : [])], { gap: 14, name: "Panel" }));
  panel.padding = 64;
  addCss(panel, `background: ${bg}; min-height: 100%; justify-content: center;`);
  addCss(panel, "@media (max-width: 640px) { & { padding: 32px 22px; } }");
  const pic = image(c.image, c.alt, { ratio: "4 / 3", radius: 0 });
  const picCol = col([pic], { name: "Foto", align: "stretch" });
  const g = grid(c.reverse ? [panel, picCol] : [picCol, panel], 2, { gap: 0, align: "stretch" });
  return kind(section(c.name ?? "Belah Lebar Penuh", [g], { bg: L.bg }), "fullwidth");
}

/* --------------------------- spesialisasi -------------------------- */

export interface SideC {
  title: string;
  text?: string;
  items?: string[];
  action?: Act;
  /** Dark card (inv) or light. */
  inv?: boolean;
}

/** A side column (sidebar) that sticks while scrolling. */
function sidebar(L: LookD, s: SideC): BoxNode {
  const ink = s.inv ? "#ffffff" : L.p.ink;
  const kids: (ElementNode | BoxNode)[] = [T(L, s.title, "h3", { size: 21, color: ink })];
  if (s.text) kids.push(P(L, s.text, { size: 15, color: s.inv ? "#cbd5e1" : L.p.muted }));
  for (const it of s.items ?? []) {
    const p = P(L, it, { size: 15, color: ink, weight: 600 });
    addCss(p, `padding: 10px 0; border-bottom: 1px solid ${s.inv ? "#ffffff22" : L.p.line};`);
    kids.push(p);
  }
  if (s.action) kids.push(acts(L, [[s.action[0], s.action[1], s.action[2] ?? (s.inv ? "light" : "primary")]]));
  const c = card(L, kids, { name: "Kolom Samping", gap: 8, tone: s.inv ? "inv" : "card", pad: 26 });
  if (s.inv) addCss(c, `background: ${L.inv};`);
  addCss(c, "position: sticky; top: 24px; align-self: start;");
  addCss(c, "@media (max-width: 640px) { & { position: static; } }");
  return c;
}

/** An inner row (a grid group, not a Row, because Rows may not nest). */
function innerGrid(cells: BoxNode[], n: number, name = "Baris Dalam"): BoxNode {
  return createBox("grid", {
    innerRow: true,
    name,
    columns: `repeat(${n}, minmax(0, 1fr))`,
    justify: "stretch",
    align: "stretch",
    gap: 20,
    stackOnMobile: true,
    widthMode: "full",
    children: cells,
  });
}

/**
 * Specialty section: a section-height sidebar + a special column holding
 * an intro row, a card row, and (optionally) a wide image row.
 */
export function specialty(
  L: LookD,
  c: Intro & { side: SideC; items: Item[]; cols?: number; image?: { src: string; alt: string }; sideRight?: boolean; ratio?: "1/3" | "1/4"; name?: string; bg?: string },
): BoxNode {
  const cols = c.cols ?? 2;
  const cards = c.items.map((it, i) =>
    fxCard(L, card(L, [...(it.icon ? [glyph(L, it.icon)] : []), T(L, it.title, "h3", { size: 19 }), P(L, it.text, { size: 15 }), ...(it.meta ? [P(L, it.meta, { size: 13, weight: 700, color: L.p.primaryDark })] : [])], { name: "Kartu", gap: 8, pad: 22 }), i),
  );
  const rows: BoxNode[] = [fxBlock(L, col([...(c.eyebrow ? [eyebrow(c.eyebrow, L.p.primary)] : []), ...introEls(L, { ...c, eyebrow: undefined })], { gap: 10, name: "Baris Dalam 1", align: "stretch" })), innerGrid(cards, cols, "Baris Dalam 2")];
  if (c.image) rows.push(col([fxImg(L, image(c.image.src, c.image.alt, { ratio: "21 / 9", radius: L.shape === "sharp" || L.shape === "brutal" ? 0 : L.radius }))], { name: "Baris Dalam 3", align: "stretch" }));
  // Each inner row is marked as an inner Row (Divi style): it can be copied & added right below.
  rows.forEach((r) => (r.innerRow = true));
  const main = col(rows, { gap: 28, name: "Kolom Spesial", align: "stretch" });
  const side = sidebar(L, c.side);
  const fr = c.ratio === "1/3" ? ["minmax(0, 1fr)", "minmax(0, 2fr)"] : ["minmax(0, 1fr)", "minmax(0, 3fr)"];
  const g = grid(c.sideRight ? [main, side] : [side, main], (c.sideRight ? [fr[1], fr[0]] : fr).join(" "), { gap: 36, align: "stretch" });
  return kind(section(c.name ?? "Spesialisasi", [g], { bg: c.bg ?? L.bg, padY: 88 }), "specialty");
}
