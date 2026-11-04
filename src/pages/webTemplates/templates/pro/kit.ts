import type { BoxNode, ElementNode } from "../../../pageMaker/engine/helpers/componentTypes";
import { createRow } from "../../../pageMaker/helpers/rowModel";
import { createPageRoot, type PageDoc } from "../../../pageMaker/helpers/pageDoc";
import type { ProTheme } from "../../../pageMaker/helpers/sectionPresetsPro";
import { col, el, heading, linkButton, section, siteFooter, type Palette } from "../../build";

/* ================================================================== */
/* A small toolkit for the 16 Pro templates: theme, page fonts, header. */
/* Templates are built from catalog section presets (sectionPresetsPro) + */
/* special sections from the same blocks, so everything is fully editable. */
/* ================================================================== */

export const FONTS = {
  sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  serif: 'Georgia, "Times New Roman", Times, serif',
  elegant: '"Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif',
  rounded: '"Trebuchet MS", "Segoe UI", system-ui, sans-serif',
  grotesk: '"Helvetica Neue", Helvetica, Arial, sans-serif',
  mono: 'ui-monospace, "SFMono-Regular", Menlo, Consolas, "Liberation Mono", monospace',
};

export function theme(p: Palette, o: Partial<Omit<ProTheme, "p">> = {}): ProTheme {
  return { p, bg: "#ffffff", alt: "#f8fafc", dark: "#0f172a", radius: 18, ...o };
}

/** A page with its own root font & background (visual identity per template). */
export function pageWith(sections: BoxNode[], font: string, bg = "#ffffff"): PageDoc {
  const root = createPageRoot(sections);
  root.advanced = { customCss: `font-family: ${font};\n-webkit-font-smoothing: antialiased;\nbackground: ${bg};` };
  return { version: 2, root };
}

/** Website menu (Menu Element, automatic from the folder pages). */
export const menu = (p: Palette, color = "#334155", o: { gap?: number } = {}) =>
  el("menu", { siteId: "", pageIds: [], textColor: color, hoverColor: p.primary, activeColor: p.primary, gap: o.gap ?? 22, align: "end", stackOnMobile: false }, "Menu");

/** Text logo. */
export const logo = (text: string, color: string, font?: string, size = 20) => {
  const n = heading(text, "h4", { size, color, full: false });
  if (font) n.advanced = { customCss: `${n.advanced?.customCss ?? ""}\nfont-family: ${font};` };
  return n;
};

/** Header: logo on the left, navigation (menu or mega menu) + CTA on the right. */
export function header(brand: string, p: Palette, o: { nav?: ElementNode; cta?: ElementNode | null; bg?: string; ink?: string; font?: string; sticky?: boolean } = {}): BoxNode {
  const ink = o.ink ?? p.ink;
  const nav = o.nav ?? menu(p, ink === "#ffffff" ? "#e2e8f0" : "#334155");
  const row = createRow({
    name: "Row Header",
    padding: 0,
    layout: "row",
    align: "center",
    justify: "between",
    wrap: false,
    gap: 16,
    stackOnMobile: false,
    children: [logo(brand, ink, o.font), col([nav, ...(o.cta ? [o.cta] : [])], { layout: "row", gap: 16, name: "Navigasi", stackOnMobile: false, wrap: false })],
  });
  const s = section("Header", [row], { bg: o.bg ?? "#ffffff", padY: 16, tag: "header" });
  if (o.sticky) s.advanced = { customCss: "position: sticky; top: 0; z-index: 40;" };
  return s;
}

/** Centered header: logo in the middle, menu below it (restaurants, photography). */
export function centeredHeader(brand: string, p: Palette, o: { bg?: string; ink?: string; font?: string } = {}): BoxNode {
  const ink = o.ink ?? p.ink;
  const m = menu(p, ink === "#ffffff" ? "#e2e8f0" : "#334155");
  m.state = { ...m.state, align: "center" };
  return section(
    "Header",
    [createRow({ name: "Row Header", padding: 0, align: "center", gap: 10, children: [logo(brand, ink, o.font, 26), m] })],
    { bg: o.bg ?? "#ffffff", padY: 20, tag: "header" },
  );
}

export const cta = (label: string, href: string, p: Palette, kind: "primary" | "outline" | "light" | "dark" = "primary") => linkButton(label, href, kind, p);

export { siteFooter as footer };

/** Listing card (free Product Card): destinations, properties, classes, menus. */
export function listingCard(o: { image: string; title: string; text: string; price: string; compare?: string; rating?: number; reviews?: string; badge?: string; cta: string; href: string; p: Palette }): ElementNode {
  return el(
    "product-card",
    {
      imageSrc: o.image,
      imageAlt: o.title,
      name: o.title,
      description: o.text,
      priceText: o.price,
      comparePriceText: o.compare ?? "",
      rating: o.rating ?? 4.8,
      showRating: o.rating !== undefined,
      ratingCount: o.reviews ?? "",
      badgeEnabled: !!o.badge,
      badgeText: o.badge ?? "",
      badgeBgColor: o.p.primary,
      badgeTextColor: "#ffffff",
      priceColor: o.p.primaryDark,
      ctaText: o.cta,
      ctaHref: o.href,
      ctaBgColor: o.p.primary,
      hoverBorderColor: o.p.soft,
      titleColor: o.p.ink,
    },
    o.title,
  );
}
