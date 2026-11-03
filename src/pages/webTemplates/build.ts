import type { BoxNode, ElementNode } from "../pageMaker/engine/helpers/componentTypes";
import { createRow } from "../pageMaker/helpers/rowModel";
import { createPageRoot, type PageDoc } from "../pageMaker/helpers/pageDoc";
import { col, el, grid, heading, para, section, stack, type Palette } from "../pageMaker/helpers/blocks";

/* ================================================================== */
/* Penyusun pohon halaman untuk template                                 */
/*                                                                    */
/* Blok dasar (el, heading, section, grid, …) ada di                     */
/* pageMaker/helpers/blocks.ts dan dipakai juga oleh preset section.     */
/* Berkas ini menambah header/footer situs dan `page()`.                 */
/* ================================================================== */

export * from "../pageMaker/helpers/blocks";

/** Header situs: logo teks + Menu Element (otomatis mengambil halaman folder website). */
export function siteHeader(brand: string, p: Palette, cta?: ElementNode): BoxNode {
  const menu = el("menu", { siteId: "", pageIds: [], textColor: "#334155", hoverColor: p.primary, activeColor: p.primary, gap: 22, align: "end", stackOnMobile: false }, "Menu");
  return section(
    "Header",
    [
      createRow({
        name: "Row Header",
        padding: 0,
        layout: "row",
        align: "center",
        justify: "between",
        wrap: false,
        gap: 16,
        stackOnMobile: false,
        children: [heading(brand, "h4", { size: 20, color: p.ink, full: false }), col([menu, ...(cta ? [cta] : [])], { layout: "row", gap: 20, name: "Navigasi", stackOnMobile: false, wrap: false })],
      }),
    ],
    { bg: "#ffffff", padY: 18, tag: "header" },
  );
}

/** Footer sederhana: kolom merek, tautan, kontak. */
export function siteFooter(brand: string, about: string, columns: { title: string; items: string[] }[], copyright: string, dark = "#0f172a"): BoxNode {
  const listOf = (items: string[]) =>
    el("list", {
      items,
      listStyleType: "none",
      bgColor: "transparent",
      borderWidth: 0,
      borderStyle: "none",
      shadowEnabled: false,
      textColor: "#cbd5e1",
      dividerEnabled: false,
      itemHoverEnabled: false,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemPaddingX: 0,
      itemPaddingY: 4,
    }, "Daftar");
  return section(
    "Footer",
    [
      grid(
        [
          col([heading(brand, "h4", { color: "#ffffff" }), para(about, { color: "#94a3b8", size: 14 })], { gap: 10 }),
          ...columns.map((c) => col([para(c.title, { color: "#ffffff", weight: 700, size: 14 }), listOf(c.items)], { gap: 8 })),
        ],
        `minmax(0, 1.4fr) ${columns.map(() => "minmax(0, 1fr)").join(" ")}`,
        { gap: 32 },
      ),
      stack([para(copyright, { color: "#64748b", size: 13 })], { gap: 0 }),
    ],
    { bg: dark, padY: 48, tag: "footer" },
  );
}

/** Font sistem untuk seluruh halaman (Custom CSS root — tetap terbawa saat diedit & diekspor dari Page Maker). */
const PAGE_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export function page(sections: BoxNode[]): PageDoc {
  const root = createPageRoot(sections);
  root.advanced = { customCss: `font-family: ${PAGE_FONT};\n-webkit-font-smoothing: antialiased;` };
  return { version: 2, root };
}
