import { isBox, type BoxNode, type ComponentNode } from "../engine/helpers/componentTypes";
import { cloneNode } from "../engine/helpers/tree";
import { createPageRoot, createSectionForEditor, isSection, normalizePageDoc, type PageDoc } from "./pageDoc";
import { getSectionPreset, isPremiumPreset } from "./sectionPresets";

/* ================================================================== */
/* Studio (v20): one website = many pages in one editor.                */
/*                                                                    */
/* Pure functions for the page board:                                   */
/*   - new pages from patterns (empty, About, Services, Contact),       */
/*     automatically using the home page's header & footer;            */
/*   - "Match header & footer": copies one page's header/footer to      */
/*     other pages (the rest is untouched).                            */
/* Header = the first section tagged <header>; footer = the last section */
/* bertag <footer>.                                                    */
/* ================================================================== */

export type PagePatternId = "blank" | "about" | "services" | "contact";

export interface PagePattern {
  id: PagePatternId;
  /** i18n key: studio.pattern.<id>.{name,text}. */
  sections: string[];
}

/** FREE presets only (new pages must not trigger the credit dialog). */
export const PAGE_PATTERNS: PagePattern[] = [
  { id: "blank", sections: [] },
  { id: "about", sections: ["hero-center", "content-sidebar", "pro-cta-band"] },
  { id: "services", sections: ["hero-center", "features-3", "pro-faq-accordion", "cta"] },
  { id: "contact", sections: ["hero-center", "content-sidebar", "pro-faq-accordion"] },
];

const sectionTag = (n: ComponentNode | undefined): string | undefined => (n && isBox(n) && isSection(n) ? n.tag : undefined);

/** The page's header section (the first section tagged header). */
export function headerOf(doc: PageDoc): BoxNode | null {
  const first = doc.root.children[0];
  return first && sectionTag(first) === "header" ? (first as BoxNode) : null;
}

/** The page's footer section (the last section tagged footer). */
export function footerOf(doc: PageDoc): BoxNode | null {
  const last = doc.root.children[doc.root.children.length - 1];
  return last && sectionTag(last) === "footer" ? (last as BoxNode) : null;
}

function patternSections(p: PagePattern): BoxNode[] {
  const out: BoxNode[] = [];
  for (const id of p.sections) {
    const preset = getSectionPreset(id);
    if (!preset || isPremiumPreset(preset)) continue;
    const node = createSectionForEditor(preset, true);
    if (node) out.push(node);
  }
  return out;
}

/** A new page: home header + pattern content + home footer (all copies with new ids). */
export function buildPatternPage(pattern: PagePatternId, home: PageDoc | null): PageDoc {
  const p = PAGE_PATTERNS.find((x) => x.id === pattern) ?? PAGE_PATTERNS[0];
  const head = home ? headerOf(home) : null;
  const foot = home ? footerOf(home) : null;
  const children: BoxNode[] = [...(head ? [cloneNode(head)] : []), ...patternSections(p), ...(foot && foot !== head ? [cloneNode(foot)] : [])];
  return { version: 2, root: createPageRoot(children) };
}

/** A full copy of another page (new node ids so they do not clash). */
export function duplicatePageDoc(source: unknown): PageDoc {
  const doc = normalizePageDoc(source);
  return { ...doc, root: { ...doc.root, children: doc.root.children.map((c) => cloneNode(c)) } };
}

/**
 * Applies the header & footer of `source` to `target`. The target's old header/footer
 * is replaced; when the target has none, they are added at the start/end. When `source`
 * has no header (or footer), that part of the target is unchanged.
 */
export function applyChrome(source: PageDoc, target: PageDoc): { doc: PageDoc; changed: boolean } {
  const head = headerOf(source);
  const foot = footerOf(source);
  if (!head && !foot) return { doc: target, changed: false };
  let kids = [...target.root.children];
  if (head) {
    if (headerOf(target)) kids = kids.slice(1);
    kids = [cloneNode(head), ...kids];
  }
  if (foot && foot !== head) {
    const t = { ...target, root: { ...target.root, children: kids } };
    if (footerOf(t)) kids = kids.slice(0, -1);
    kids = [...kids, cloneNode(foot)];
  }
  return { doc: { ...target, root: { ...target.root, children: kids } }, changed: true };
}

/** Short text describing the page content for the board card (section count). */
export const sectionCount = (doc: unknown) => normalizePageDoc(doc).root.children.length;
