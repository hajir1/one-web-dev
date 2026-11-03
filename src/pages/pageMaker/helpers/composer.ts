import type { SavedDesign } from "../core/store/designStore";
import { makeId } from "../core/helpers/makeId";
import { isBox, type BoxNode, type ComponentNode } from "../engine/helpers/componentTypes";
import { cloneNode, walk } from "../engine/helpers/tree";
import { isValidCssId } from "../engine/helpers/advanced";
import { createPageRoot, enforcePageStructure, normalizePageDoc, type PageDoc } from "./pageDoc";

/* ================================================================== */
/* Page Composer — menyusun beberapa DESAIN tersimpan menjadi PAGE      */
/*                                                                    */
/*   Design      = halaman yang disimpan dari Page Maker (tipe "page"). */
/*   Composition = susunan desain (tipe "composition") → satu halaman.  */
/*                                                                    */
/* Setiap item menyimpan SALINAN (snapshot) desain saat dimasukkan,     */
/* jadi mengubah susunan tidak pernah mengubah desain sumber; desain    */
/* sumber yang berubah bisa diambil ulang lewat "Perbarui dari sumber". */
/* ================================================================== */

export const DESIGN_TYPE = "page";
export const COMPOSITION_TYPE = "composition";
const MAX_ITEMS = 30;

export interface ComposerItem {
  uid: string;
  designId: string;
  name: string;
  snapshot: PageDoc;
  /** `updatedAt` desain sumber saat snapshot diambil. */
  sourceUpdatedAt: number;
}

export interface Composition {
  version: 1;
  items: ComposerItem[];
}

export const createComposition = (): Composition => ({ version: 1, items: [] });

/** Salinan dalam (deep copy) desain → item baru. Desain sumber tidak disentuh. */
function itemFromDesign(d: SavedDesign): ComposerItem {
  return {
    uid: makeId(),
    designId: d.id,
    name: d.name,
    snapshot: normalizePageDoc(structuredClone(d.state)),
    sourceUpdatedAt: d.updatedAt,
  };
}

/** Data tersimpan apa pun → Composition valid. */
export function normalizeComposition(saved: unknown): Composition {
  const out = createComposition();
  if (!saved || typeof saved !== "object") return out;
  const items = (saved as { items?: unknown }).items;
  if (!Array.isArray(items)) return out;
  const seen = new Set<string>();
  for (const raw of items.slice(0, MAX_ITEMS)) {
    if (!raw || typeof raw !== "object") continue;
    const v = raw as Record<string, unknown>;
    let uid = typeof v.uid === "string" && v.uid ? v.uid : makeId();
    if (seen.has(uid)) uid = makeId();
    seen.add(uid);
    out.items.push({
      uid,
      designId: typeof v.designId === "string" ? v.designId : "",
      name: typeof v.name === "string" ? v.name.slice(0, 80) : "Desain",
      snapshot: normalizePageDoc(v.snapshot),
      sourceUpdatedAt: typeof v.sourceUpdatedAt === "number" ? v.sourceUpdatedAt : 0,
    });
  }
  return out;
}

/* ------------------------------ operasi ----------------------------- */

export const addItem = (c: Composition, d: SavedDesign, at = c.items.length): Composition => {
  if (c.items.length >= MAX_ITEMS) return c;
  const items = [...c.items];
  items.splice(Math.max(0, Math.min(at, items.length)), 0, itemFromDesign(d));
  return { ...c, items };
};

export const removeItem = (c: Composition, uid: string): Composition => ({
  ...c,
  items: c.items.filter((i) => i.uid !== uid),
});

export function moveItem(c: Composition, uid: string, to: number): Composition {
  const from = c.items.findIndex((i) => i.uid === uid);
  if (from < 0) return c;
  const target = Math.max(0, Math.min(to, c.items.length - 1));
  if (target === from) return c;
  const items = [...c.items];
  const [it] = items.splice(from, 1);
  items.splice(target, 0, it);
  return { ...c, items };
}

/** Ganti item dengan desain lain (posisi tetap). */
export function replaceItem(c: Composition, uid: string, d: SavedDesign): Composition {
  return { ...c, items: c.items.map((i) => (i.uid === uid ? { ...itemFromDesign(d), uid } : i)) };
}

/** Ambil ulang snapshot dari desain sumber. */
export const refreshItem = replaceItem;

/** Desain sumber sudah berubah sejak snapshot diambil? */
export const isStale = (it: ComposerItem, designs: SavedDesign[]) => {
  const src = designs.find((d) => d.id === it.designId);
  return !!src && src.updatedAt > it.sourceUpdatedAt;
};

/* ---------------------------- penggabungan --------------------------- */

export interface MergeResult {
  root: BoxNode;
  /** Pesan untuk pengguna (ID ganda yang diganti, item kosong, dst). */
  warnings: string[];
}

/**
 * Gabungkan item menjadi satu halaman:
 *  - section tiap desain disalin (id node baru) sesuai urutan;
 *  - CSS ID yang bentrok antar-desain diberi akhiran (-2, -3, …);
 *  - struktur dipaksa valid (Section → Row → Element, tanpa nesting salah).
 * Class CSS dibuat ulang oleh compose() dari satu nama class halaman, jadi
 * gaya & Custom CSS (yang di-scope per node) tidak saling bertabrakan.
 */
export function mergeComposition(c: Composition): MergeResult {
  const warnings: string[] = [];
  const usedIds = new Set<string>();
  const sections: ComponentNode[] = [];

  for (const it of c.items) {
    const doc = normalizePageDoc(it.snapshot);
    if (!doc.root.children.length) {
      warnings.push(`“${it.name}” kosong (tidak punya section).`);
      continue;
    }
    for (const sec of doc.root.children) {
      const copy = cloneNode(sec);
      walk(copy, (n) => {
        const id = n.advanced?.cssId;
        if (!id || !isValidCssId(id)) return;
        let next = id;
        for (let k = 2; usedIds.has(next); k++) next = `${id}-${k}`;
        usedIds.add(next);
        if (next !== id) {
          n.advanced = { ...n.advanced, cssId: next };
          warnings.push(`CSS ID “${id}” di “${it.name}” sudah dipakai desain lain — diganti “${next}”.`);
        }
      });
      sections.push(copy);
    }
  }
  const root = enforcePageStructure(createPageRoot(sections.filter(isBox) as BoxNode[]));
  return { root, warnings };
}
