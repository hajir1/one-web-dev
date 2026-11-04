import type { BoxNode, ComponentNode, ElementNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../pageMaker/engine/helpers/componentTypes";
import { gridTrackCount } from "../../pageMaker/engine/helpers/compose";
import type { PageDoc } from "../../pageMaker/helpers/pageDoc";

/* ================================================================== */
/* Responsive polish for EVERY template (v5)                            */
/*                                                                    */
/* Runs when a template page is built, so it applies equally to         */
/* the preview, Page Design (can be changed again in the panel), and downloads: */
/*  - Headings use fluid sizes (clamp) instead of phone-size @media.    */
/*  - Cards in a grid lift slightly on hover; corners at least 14px     */
/*    (kecuali gaya tegas bersudut 0).                                   */
/*  - Grids on phones: numbers/stats in 2 columns, image cards become rows */
/*    swipe (scroll-snap), the rest one column as usual.                 */
/*  - Text card grids are staggered on desktop (not rigidly aligned),   */
/*    every other grid so it is not overdone.                           */
/* All through regular node properties: no extra libraries.             */
/* ================================================================== */

/** The old phone heading size @media (from the heading helper); now replaced by fluid sizes. */
const MOBILE_FONT_RE = /\n?@media \(max-width: 640px\) \{\s*& \{ font-size: \d+px; \}\s*\}/g;

const isEl = (n: ComponentNode, ...types: string[]): n is ElementNode => !isBox(n) && types.includes((n as ElementNode).elementType);

function descendants(n: ComponentNode, out: ComponentNode[] = []): ComponentNode[] {
  if (isBox(n))
    for (const c of n.children) {
      out.push(c);
      descendants(c, out);
    }
  return out;
}

const hasBg = (b: BoxNode) => b.bgEnabled || (!!b.bgType && b.bgType !== "none");
const cssHas = (b: BoxNode, re: RegExp) => re.test(b.advanced?.customCss ?? "");

/** A box shown as a card (background + corners/border/shadow). */
function isCard(b: BoxNode): boolean {
  if (b.section || b.row) return false;
  return (hasBg(b) || cssHas(b, /background/)) && (b.borderRadius > 0 || b.borderWidth > 0 || b.shadow !== "none" || cssHas(b, /border|box-shadow/));
}

/** Short content without images/buttons: stat numbers, labels, small icons. */
function isSmallStat(n: ComponentNode): boolean {
  if (isEl(n, "stats-counter")) return true;
  if (!isBox(n)) return false;
  const d = descendants(n).filter((x) => !isBox(x));
  // Short text only (number + label); cards with paragraphs stay single-column so they breathe.
  const short = (x: ComponentNode) => !isEl(x, "text") || String((x as ElementNode).state.text ?? "").length <= 28;
  return d.length > 0 && d.length <= 3 && d.every((x) => isEl(x, "text", "badge", "icon") && short(x));
}

/** Image / product / testimonial cards: nice to swipe on phones. */
function isMediaCard(n: ComponentNode): boolean {
  const MEDIA = ["image", "product-card", "testimonial", "card"];
  if (isEl(n, ...MEDIA)) return true;
  return isBox(n) && descendants(n).some((x) => isEl(x, ...MEDIA));
}

function polishText(n: ElementNode): void {
  const s = n.state as { fontSize?: number; fluidType?: boolean };
  if (typeof s.fontSize !== "number" || s.fontSize < 24) return;
  n.state = { ...n.state, fluidType: true };
  const css = n.advanced?.customCss;
  if (css && MOBILE_FONT_RE.test(css)) n.advanced = { ...n.advanced, customCss: css.replace(MOBILE_FONT_RE, "").trim() };
  MOBILE_FONT_RE.lastIndex = 0;
}

function polishGrid(b: BoxNode, stagger: { n: number }): void {
  const kids = b.children;
  if (kids.length < 2) return;
  if (b.stackOnMobile && !b.mobileGrid && kids.length >= 3) {
    if (kids.every(isSmallStat)) b.mobileGrid = "two";
    else if (kids.every(isMediaCard)) b.mobileGrid = "scroll";
  }
  // Text cards aligned in 3/4 columns → staggered on desktop (every second grid).
  const cols = gridTrackCount(b.columns || "");
  const textCards = kids.every((k) => isBox(k) && isCard(k) && !isMediaCard(k));
  const spans = kids.some((k) => k.place.colSpan || k.place.colStart);
  if (textCards && !spans && (cols === 3 || cols === 4) && (kids.length === cols || kids.length === cols * 2)) {
    if (stagger.n % 2 === 0) b.stagger = true;
    stagger.n++;
  }
}

/**
 * Header buttons on phones: more compact, and not broken per word when the screen
 * is wide enough (below 420px two lines are allowed so the menu icon still fits).
 */
const HEADER_BTN_CSS = "@media (min-width: 420px) {\n  & { white-space: nowrap; }\n}\n@media (max-width: 480px) {\n  & { padding: 8px 12px; font-size: 13px; }\n}";

function compactHeaderButton(n: ElementNode): void {
  const css = (n.advanced?.customCss ?? "").trim();
  if (css.includes("white-space")) return;
  const own = !css ? "" : css.includes("{") ? css : `& { ${css} }`;
  n.advanced = { ...n.advanced, customCss: own ? `${own}\n${HEADER_BTN_CSS}` : HEADER_BTN_CSS };
}

function walk(n: ComponentNode, parent: BoxNode | null, stagger: { n: number }, header = false): void {
  if (!isBox(n)) {
    if (isEl(n, "text")) polishText(n);
    if (header && isEl(n, "anchor", "button")) compactHeaderButton(n);
    return;
  }
  if (n.section && n.tag === "header") header = true;
  if (parent && (parent.layout === "grid" || parent.layout === "row") && isCard(n)) {
    n.hoverLift = true;
    // Soft corners; bold styles (0 radius) are left true to their character.
    if (n.borderRadius > 0 && n.borderRadius < 14) n.borderRadius = 14;
  }
  if (n.layout === "grid") polishGrid(n, stagger);
  n.children.forEach((c) => walk(c, n, stagger, header));
}

/** Applies the polish to one template page (changes the freshly built tree). */
export function polishTemplatePage(doc: PageDoc): PageDoc {
  walk(doc.root, null, { n: 0 });
  return doc;
}
