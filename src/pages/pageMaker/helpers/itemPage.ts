import type { BoxNode, ComponentNode, ElementNode, NodeId } from "../engine/helpers/componentTypes";
import { isBox } from "../engine/helpers/componentTypes";
import { cloneNode, collectElements, findNode, updateNode } from "../engine/helpers/tree";
import { canBecomeCollection, clampRating, formatPrice, materialize, type CollectionDef, type CollectionItem, type ItemValues } from "./collections";

/* ================================================================== */
/* Uji coba HALAMAN ITEM (detail produk)                                 */
/*                                                                    */
/*   itemOf   box di halaman detail = satu item koleksi. Elemen di       */
/*            dalamnya ber-`bind` (nama, harga, …) diisi dari item.      */
/*            Di editor: item pratinjau (previewId, default item 1).     */
/*   related  box kartu "Mungkin Anda suka": item lain dengan label      */
/*            sama dulu, lalu item lain, maksimal `limit`.               */
/*                                                                    */
/* URL item: <slug koleksi>/<slug item>.html (statis) atau               */
/* /<slug koleksi>/<slug item> (Express).                                */
/* ================================================================== */

export type BindField = "name" | "price" | "compare_price" | "rating" | "description" | "label" | "image";
export const BIND_FIELDS: BindField[] = ["name", "price", "compare_price", "rating", "description", "label", "image"];

export interface ItemOf {
  /** Slug koleksi. */
  collection: string;
  /** Item yang tampil di editor dan di berkas halaman detail utama. */
  previewId?: string;
}
export interface RelatedOf {
  collection: string;
  limit: number;
  /** Pola kartu (salinan kartu pertama) bila tidak ada item terkait. */
  pattern?: ComponentNode;
}

export const RELATED_MAX = 12;
const TEXT_TYPES = new Set(["text", "badge"]);

/** Elemen ini bisa diikat ke kolom `field`? (tanpa field: ke kolom apa pun) */
export function canBind(el: ElementNode, field?: BindField): boolean {
  if (el.elementType === "image") return !field || field === "image";
  return TEXT_TYPES.has(el.elementType) && field !== "image";
}

const stars = (r: number) => "★".repeat(Math.round(r)) + "☆".repeat(5 - Math.round(r));

/** Teks tampil untuk kolom item (gambar: URL). */
export function bindValue(field: BindField, v: ItemValues): string {
  switch (field) {
    case "price":
      return formatPrice(v.price);
    case "compare_price":
      return formatPrice(v.compare_price, true);
    case "rating": {
      const r = clampRating(v.rating);
      if (!r) return "";
      const n = Number(v.reviews) || 0;
      return `${stars(r)} ${r.toFixed(1)}${n ? ` (${n})` : ""}`;
    }
    default:
      return String(v[field] ?? "").trim();
  }
}

/** Isi elemen terikat di dalam `box` dengan nilai item. */
export function applyItemValues(box: BoxNode, v: ItemValues): BoxNode {
  const patch = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return { ...n, children: n.children.map(patch) };
    if (!n.bind || !canBind(n, n.bind)) return n;
    const value = bindValue(n.bind, v);
    const state = n.elementType === "image" ? { ...n.state, srcUrl: value || n.state.srcUrl, altText: String(v.name ?? "") } : { ...n.state, text: value };
    const out: ElementNode = { ...n, state };
    if (!value && n.bind !== "image") out.bindEmpty = true;
    else delete out.bindEmpty;
    return out;
  };
  return { ...box, children: box.children.map(patch) };
}

/** Item terkait: label sama dulu, lalu item lain; tanpa item `current`. */
export function relatedItems(col: CollectionDef, current: CollectionItem | null, limit: number): CollectionItem[] {
  const others = col.items.filter((it) => it.id !== current?.id);
  const label = String(current?.values.label ?? "").trim().toLowerCase();
  const same = others.filter((it) => String(it.values.label ?? "").trim().toLowerCase() === label);
  const rest = others.filter((it) => !same.includes(it));
  return [...same, ...rest].slice(0, Math.max(0, Math.min(RELATED_MAX, limit)));
}

/** Susun ulang kartu box terkait dari item terkait. */
export function materializeRelated(box: BoxNode, col: CollectionDef, current: CollectionItem | null): BoxNode {
  const rel = box.related!;
  const items = relatedItems(col, current, rel.limit);
  const tmp: CollectionDef = { ...col, items, display: undefined, pattern: rel.pattern ?? col.pattern };
  const { collection, ...out } = materialize({ ...box, collection: tmp }, tmp);
  return { ...out, related: { ...rel, ...(collection?.pattern ? { pattern: collection.pattern } : {}) } };
}

export const previewItem = (col: CollectionDef | undefined, itemOf: ItemOf | undefined): CollectionItem | null =>
  !col || !itemOf ? null : (col.items.find((it) => it.id === itemOf.previewId) ?? col.items[0] ?? null);

/** Box halaman item pertama di halaman. */
export function itemBoxIn(root: ComponentNode): BoxNode | null {
  if (!isBox(root)) return null;
  if (root.itemOf) return root;
  for (const c of root.children) {
    const f = itemBoxIn(c);
    if (f) return f;
  }
  return null;
}

/** Semua box `related` di halaman. */
function relatedBoxes(root: ComponentNode, out: BoxNode[] = []): BoxNode[] {
  if (!isBox(root)) return out;
  if (root.related) out.push(root);
  root.children.forEach((c) => relatedBoxes(c, out));
  return out;
}

/**
 * Selaraskan halaman dengan data koleksi: elemen item diisi item pratinjau
 * (atau `itemId` bila diberikan), box terkait disusun dari item terkait.
 * Halaman tanpa itemOf/related kembali apa adanya (objek sama).
 */
export function syncItemPage(root: BoxNode, cols: CollectionDef[], itemId?: string): BoxNode {
  const ib = itemBoxIn(root);
  const rels = relatedBoxes(root);
  if (!ib && !rels.length) return root;
  const bySlug = new Map(cols.map((c) => [c.slug, c]));
  const itemCol = ib ? bySlug.get(ib.itemOf!.collection) : undefined;
  const current = itemCol ? (itemId ? (itemCol.items.find((it) => it.id === itemId) ?? null) : previewItem(itemCol, ib!.itemOf)) : null;
  let next = root;
  if (ib && itemCol && current) next = updateNode(next, ib.id, (n) => (isBox(n) ? applyItemValues(n, current.values) : n)) as BoxNode;
  for (const rb of rels) {
    const col = bySlug.get(rb.related!.collection);
    if (!col) continue;
    next = updateNode(next, rb.id, (n) => (isBox(n) && n.related ? materializeRelated(n, col, current?.values && col.slug === itemCol?.slug ? current : null) : n)) as BoxNode;
  }
  return next;
}

/* ------------------------------ tandai / lepas ---------------------- */

/** Box ini bisa dijadikan halaman item? (section/grup yang punya elemen yang bisa diikat, bukan koleksi) */
export function canBeItemBox(box: BoxNode): boolean {
  if (box.collection || box.related || box.itemOf) return false;
  return collectElements(box).some((e) => canBind(e) && e.elementType !== "product-card");
}

/**
 * Tebak ikatan dari isi elemen yang sama dengan item pertama (mis. judul
 * "Arabika Gayo 250 g" → nama, "Rp95.000" → harga). Gambar pertama → gambar.
 */
export function inferBindings(box: BoxNode, v: ItemValues): BoxNode {
  const taken = new Set<BindField>();
  const wanted: [BindField, string][] = (["name", "price", "compare_price", "label", "description"] as BindField[]).map((f) => [f, bindValue(f, v).toLowerCase()]);
  const patch = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return n.collection || n.related ? n : { ...n, children: n.children.map(patch) };
    if (n.bind || !canBind(n)) return n;
    if (n.elementType === "image") {
      if (taken.has("image")) return n;
      taken.add("image");
      return { ...n, bind: "image" };
    }
    const text = String(n.state?.text ?? "").trim().toLowerCase();
    if (!text) return n;
    const hit = wanted.find(([f, s]) => s && !taken.has(f) && s === text)?.[0] ?? (text.startsWith("★") && !taken.has("rating") ? "rating" : undefined);
    if (!hit) return n;
    taken.add(hit);
    return { ...n, bind: hit };
  };
  return { ...box, children: box.children.map(patch) };
}

export function markItemBox(root: BoxNode, boxId: NodeId, col: CollectionDef): BoxNode {
  const first = col.items[0];
  const next = updateNode(root, boxId, (n) => (isBox(n) && canBeItemBox(n) ? { ...inferBindings(n, first?.values ?? {}), itemOf: { collection: col.slug } } : n)) as BoxNode;
  return syncItemPage(next, [col]);
}

/** Lepas halaman item: isi elemen tetap (item pratinjau terakhir), ikatan dihapus. */
export function unmarkItemBox(root: BoxNode, boxId: NodeId): BoxNode {
  const strip = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return { ...n, children: n.children.map(strip) };
    if (!n.bind && !n.bindEmpty) return n;
    const { bind: _b, bindEmpty: _e, ...rest } = n;
    void _b;
    void _e;
    return rest;
  };
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.itemOf) return n;
    const { itemOf: _i, ...rest } = n;
    void _i;
    return strip(rest);
  }) as BoxNode;
}

export function setPreviewItem(root: BoxNode, boxId: NodeId, itemId: string, cols: CollectionDef[]): BoxNode {
  const next = updateNode(root, boxId, (n) => (isBox(n) && n.itemOf ? { ...n, itemOf: { ...n.itemOf, previewId: itemId } } : n)) as BoxNode;
  return syncItemPage(next, cols);
}

/** Ikat / lepas satu elemen ke kolom (null = lepas). */
export function setBinding(root: BoxNode, elId: NodeId, field: BindField | null, cols: CollectionDef[]): BoxNode {
  const next = updateNode(root, elId, (n) => {
    if (isBox(n)) return n;
    if (!field) {
      const { bind: _b, bindEmpty: _e, ...rest } = n;
      void _b;
      void _e;
      return rest;
    }
    return canBind(n, field) ? { ...n, bind: field } : n;
  }) as BoxNode;
  return syncItemPage(next, cols);
}

/** Box kartu yang bisa jadi "Mungkin Anda suka" (kartu berulang, bukan koleksi). */
export const canBeRelated = (box: BoxNode) => canBecomeCollection(box);

export function markRelated(root: BoxNode, boxId: NodeId, col: CollectionDef, limit = 3): BoxNode {
  const next = updateNode(root, boxId, (n) =>
    isBox(n) && canBeRelated(n) ? { ...n, related: { collection: col.slug, limit: Math.max(1, Math.min(RELATED_MAX, limit)), ...(n.children[0] ? { pattern: cloneNode(n.children[0]) } : {}) } } : n,
  ) as BoxNode;
  return syncItemPage(next, [col]);
}

export function unmarkRelated(root: BoxNode, boxId: NodeId): BoxNode {
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.related) return n;
    const { related: _r, ...rest } = n;
    void _r;
    return rest;
  }) as BoxNode;
}

export function setRelatedLimit(root: BoxNode, boxId: NodeId, limit: number, cols: CollectionDef[]): BoxNode {
  const next = updateNode(root, boxId, (n) => (isBox(n) && n.related ? { ...n, related: { ...n.related, limit: Math.max(1, Math.min(RELATED_MAX, Math.round(limit) || 3)) } } : n)) as BoxNode;
  return syncItemPage(next, cols);
}

/** Box itemOf/related tempat node ini berada (untuk panel Pengaturan elemen). */
export function itemAncestor(root: BoxNode, id: NodeId): BoxNode | null {
  let found: BoxNode | null = null;
  const walk = (n: ComponentNode, owner: BoxNode | null): boolean => {
    const o = isBox(n) && n.itemOf ? n : owner;
    if (n.id === id) {
      found = o && o.id !== id ? o : null;
      return true;
    }
    return isBox(n) && n.children.some((c) => walk(c, o));
  };
  walk(root, null);
  return found;
}

/** Slug koleksi yang dipakai halaman ini (halaman item / terkait). */
export function itemCollectionsUsed(root: BoxNode): string[] {
  const out = new Set<string>();
  const ib = itemBoxIn(root);
  if (ib) out.add(ib.itemOf!.collection);
  for (const r of relatedBoxes(root)) out.add(r.related!.collection);
  return [...out];
}

/** Slug koleksi diganti: perbarui rujukan halaman item / terkait. */
export function renameCollectionRefs(root: BoxNode, from: string, to: string): BoxNode {
  if (from === to) return root;
  const walk = (n: ComponentNode): ComponentNode => {
    if (!isBox(n)) return n;
    let out: BoxNode = n;
    if (n.itemOf?.collection === from) out = { ...out, itemOf: { ...n.itemOf, collection: to } };
    if (n.related?.collection === from) out = { ...out, related: { ...n.related, collection: to } };
    const children = n.children.map(walk);
    return children.some((c, i) => c !== n.children[i]) ? { ...out, children } : out;
  };
  return walk(root) as BoxNode;
}

/* ------------------------------ sanitasi ---------------------------- */

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const SLUG = /^[a-z][a-z0-9-]{0,39}$/;

export function sanitizeItemOf(v: unknown): ItemOf | undefined {
  if (!isObj(v) || typeof v.collection !== "string" || !SLUG.test(v.collection)) return undefined;
  return { collection: v.collection, ...(typeof v.previewId === "string" && v.previewId.length <= 64 ? { previewId: v.previewId } : {}) };
}

export function sanitizeRelated(v: unknown, sanitizeNode: (n: unknown) => ComponentNode | null): RelatedOf | undefined {
  if (!isObj(v) || typeof v.collection !== "string" || !SLUG.test(v.collection)) return undefined;
  const pattern = v.pattern ? sanitizeNode(v.pattern) : null;
  return { collection: v.collection, limit: Math.max(1, Math.min(RELATED_MAX, Math.round(Number(v.limit)) || 3)), ...(pattern ? { pattern } : {}) };
}

export const sanitizeBind = (v: unknown): BindField | undefined => (BIND_FIELDS.includes(v as BindField) ? (v as BindField) : undefined);

export const findBox = (root: BoxNode, id: NodeId): BoxNode | null => {
  const n = findNode(root, id);
  return n && isBox(n) ? n : null;
};
