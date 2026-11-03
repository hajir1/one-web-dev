import { isBox, type BoxNode, type ComponentNode } from "../engine/helpers/componentTypes";
import { cloneNode } from "../engine/helpers/tree";
import { createPageRoot, createSectionForEditor, isSection, normalizePageDoc, type PageDoc } from "./pageDoc";
import { getSectionPreset, isPremiumPreset } from "./sectionPresets";

/* ================================================================== */
/* Studio (v20): satu website = banyak halaman di satu editor.           */
/*                                                                    */
/* Fungsi murni untuk papan halaman:                                    */
/*   - halaman baru dari pola (kosong, Tentang, Layanan, Kontak),        */
/*     otomatis memakai header & footer halaman beranda;               */
/*   - "Samakan header & footer": salin header/footer satu halaman ke    */
/*     halaman lain (yang lain tidak disentuh).                        */
/* Header = section pertama bertag <header>; footer = section terakhir   */
/* bertag <footer>.                                                    */
/* ================================================================== */

export type PagePatternId = "blank" | "about" | "services" | "contact";

export interface PagePattern {
  id: PagePatternId;
  /** Kunci i18n: studio.pattern.<id>.{name,text}. */
  sections: string[];
}

/** Hanya preset GRATIS (halaman baru tidak boleh memunculkan dialog kredit). */
export const PAGE_PATTERNS: PagePattern[] = [
  { id: "blank", sections: [] },
  { id: "about", sections: ["hero-center", "content-sidebar", "pro-cta-band"] },
  { id: "services", sections: ["hero-center", "features-3", "pro-faq-accordion", "cta"] },
  { id: "contact", sections: ["hero-center", "content-sidebar", "pro-faq-accordion"] },
];

const sectionTag = (n: ComponentNode | undefined): string | undefined => (n && isBox(n) && isSection(n) ? n.tag : undefined);

/** Section header halaman (section pertama bertag header). */
export function headerOf(doc: PageDoc): BoxNode | null {
  const first = doc.root.children[0];
  return first && sectionTag(first) === "header" ? (first as BoxNode) : null;
}

/** Section footer halaman (section terakhir bertag footer). */
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

/** Halaman baru: header beranda + isi pola + footer beranda (semuanya salinan ber-id baru). */
export function buildPatternPage(pattern: PagePatternId, home: PageDoc | null): PageDoc {
  const p = PAGE_PATTERNS.find((x) => x.id === pattern) ?? PAGE_PATTERNS[0];
  const head = home ? headerOf(home) : null;
  const foot = home ? footerOf(home) : null;
  const children: BoxNode[] = [...(head ? [cloneNode(head)] : []), ...patternSections(p), ...(foot && foot !== head ? [cloneNode(foot)] : [])];
  return { version: 2, root: createPageRoot(children) };
}

/** Salinan utuh halaman lain (id node baru supaya tidak bentrok). */
export function duplicatePageDoc(source: unknown): PageDoc {
  const doc = normalizePageDoc(source);
  return { ...doc, root: { ...doc.root, children: doc.root.children.map((c) => cloneNode(c)) } };
}

/**
 * Pasang header & footer `source` ke `target`. Header/footer lama di target
 * diganti; bila target belum punya, ditambahkan di awal/akhir. Bila `source`
 * tidak punya header (atau footer), bagian itu di target tidak diubah.
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

/** Teks ringkas isi halaman untuk kartu papan (jumlah section). */
export const sectionCount = (doc: unknown) => normalizePageDoc(doc).root.children.length;
