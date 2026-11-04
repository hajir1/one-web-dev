import type { BoxNode, ComponentNode, ElementNode, NodeId } from "../engine/helpers/componentTypes";
import { isBox } from "../engine/helpers/componentTypes";
import { cloneNode, collectElements, findNode, updateNode } from "../engine/helpers/tree";
import { makeId } from "../core/helpers/makeId";

/* ================================================================== */
/* Koleksi data (uji coba CRUD)                                          */
/*                                                                    */
/* A Row / group of repeated cards can be marked as a "data collection". */
/* Its data is stored ON that node (`BoxNode.collection`), so it follows undo, */
/* save, and account sync without a new store.                          */
/*                                                                    */
/* The flow is like a redeploy: the user changes data in the dashboard → */
/* `materialize` rebuilds the cards on the page from the card pattern   */
/* first → the static output is included in the export/deploy. Backend code (Laravel / */
/* Express) is generated from the same schema (see helpers/crud).       */
/*                                                                    */
/* This preview only supports Product Card for now.                     */
/* ================================================================== */

export type FieldType = "text" | "textarea" | "price" | "number" | "rating" | "image" | "label" | "category";

export interface CollectionField {
  /** snake_case; also used as the database column name. */
  key: string;
  label: string;
  type: FieldType;
  required: boolean;
}

export type ItemValues = Record<string, string | number>;

export interface CollectionItem {
  id: string;
  values: ItemValues;
  /** Item URL, e.g. "arabika-gayo-250-g" (made from the name, unique, editable). */
  slug?: string;
}

export interface CollectionDef {
  /** Display name, e.g. "Produk". */
  name: string;
  /** Lowercase + hyphens; used for URLs, tables, and code file names. */
  slug: string;
  /** The repeated card kind (preview: only "product-card"). */
  card: "product-card";
  fields: CollectionField[];
  items: CollectionItem[];
  /** Card pattern (a copy of the first card), used when every item is deleted. */
  pattern?: ComponentNode;
  /** Optional: how cards are shown on the public page. Without it = every item. */
  display?: CollectionDisplay;
  /** Has item (detail) pages: card buttons go to `<collection slug>/<item slug>.html`. */
  itemPage?: boolean;
  /** Optional: only certain categories + order. Without it = every item, dashboard order. */
  view?: CollectionView;
}

/* ------------------------------ category + sort order ------------------- */

/** Display order. "manual" = the dashboard order (in the backend: ascending id). */
export type SortKey = "manual" | "name_asc" | "name_desc" | "price_asc" | "price_desc" | "rating_desc";
export const SORT_KEYS: SortKey[] = ["manual", "name_asc", "name_desc", "price_asc", "price_desc", "rating_desc"];
export interface CollectionView {
  /** Empty = every category. */
  category?: string;
  sort?: SortKey;
}
export const CATEGORY_MAX = 40;
/** Kategori item (dirapikan). */
export const itemCategory = (it: { values: ItemValues }): string => String(it.values.category ?? "").trim().replace(/\s+/g, " ").slice(0, CATEGORY_MAX);
export const sameCategory = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
/** Unique category list (order of first appearance). */
export function categoriesOf(col: Pick<CollectionDef, "items">): string[] {
  const out: string[] = [];
  for (const it of col.items) {
    const c = itemCategory(it);
    if (c && !out.some((x) => sameCategory(x, c))) out.push(c);
  }
  return out;
}

export function sortItems(items: CollectionItem[], sort: SortKey | undefined): CollectionItem[] {
  if (!sort || sort === "manual") return items;
  const name = (it: CollectionItem) => String(it.values.name ?? "");
  const num = (it: CollectionItem, k: string) => Number(it.values[k]) || 0;
  const cmp: Record<Exclude<SortKey, "manual">, (a: CollectionItem, b: CollectionItem) => number> = {
    name_asc: (a, b) => name(a).localeCompare(name(b), "id"),
    name_desc: (a, b) => name(b).localeCompare(name(a), "id"),
    price_asc: (a, b) => num(a, "price") - num(b, "price"),
    price_desc: (a, b) => num(b, "price") - num(a, "price"),
    rating_desc: (a, b) => num(b, "rating") - num(a, "rating"),
  };
  // Stable: ties keep the dashboard order.
  return items.map((it, i) => [it, i] as const).sort((x, y) => cmp[sort](x[0], y[0]) || x[1] - y[1]).map(([it]) => it);
}

/** Items matching the category choice + order (not yet cut per page). */
export function viewItems(col: CollectionDef): CollectionItem[] {
  const cat = col.view?.category ?? "";
  const items = cat ? col.items.filter((it) => sameCategory(itemCategory(it), cat)) : col.items;
  return sortItems(items, col.view?.sort);
}

/**
 * Collection display on the page (optional, default "all"):
 *   all    every item at once
 *   pages  numbered pagination
 *   more   a "Load more" button
 *   scroll horizontal swipe, the next page loads while swiping
 * Other than "all", the page only loads `perPage` items per request.
 */
export type CollectionDisplayMode = "all" | "pages" | "more" | "scroll";
export interface CollectionDisplay {
  mode: CollectionDisplayMode;
  perPage: number;
}
export const DISPLAY_MODES: CollectionDisplayMode[] = ["all", "pages", "more", "scroll"];
export const PER_PAGE_MIN = 1;
export const PER_PAGE_MAX = 48;
export const DEFAULT_DISPLAY: CollectionDisplay = { mode: "all", perPage: 6 };
export const displayOf = (col: Pick<CollectionDef, "display">): CollectionDisplay => col.display ?? DEFAULT_DISPLAY;
export const clampPerPage = (n: unknown): number => Math.max(PER_PAGE_MIN, Math.min(PER_PAGE_MAX, Math.round(Number(n)) || DEFAULT_DISPLAY.perPage));

/** Items rendered in the design/static HTML (other than "all": the first page only). */
export function visibleItems(col: CollectionDef): CollectionItem[] {
  const d = displayOf(col);
  const items = viewItems(col);
  return d.mode === "all" ? items : items.slice(0, d.perPage);
}

/** Extra CSS for the collection box (scope `&` = the box). Only "scroll" mode changes the layout. */
export function collectionDisplayCss(col: CollectionDef): string {
  if (displayOf(col).mode !== "scroll") return "";
  return `& {
  display: grid !important;
  grid-auto-flow: column !important;
  grid-template-columns: none !important;
  grid-template-rows: none !important;
  grid-auto-columns: minmax(220px, min(300px, 80%)) !important;
  flex-wrap: nowrap !important;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 8px;
}
& > * {
  scroll-snap-align: start;
  min-width: 0;
}`;
}

export const COLLECTION_CARD = "product-card" as const;

/** Placeholder image for items without an image (gray, image icon; no network request). */
export const NO_IMAGE =
  "data:image/svg+xml;base64," +
  btoa(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 450"><rect width="600" height="450" fill="#f1f5f9"/><g fill="none" stroke="#94a3b8" stroke-width="14" stroke-linejoin="round"><rect x="215" y="160" width="170" height="130" rx="14"/><path d="M225 280l55-55 40 40 25-25 40 40"/></g><circle cx="345" cy="195" r="14" fill="#94a3b8"/></svg>',
  );
export const MAX_ITEMS = 500;

/** Default Product Card schema. Order = table column & form order. */
export const PRODUCT_FIELDS: CollectionField[] = [
  { key: "name", label: "Nama", type: "text", required: true },
  { key: "price", label: "Harga", type: "price", required: true },
  { key: "compare_price", label: "Harga coret", type: "price", required: false },
  { key: "rating", label: "Rating", type: "rating", required: false },
  { key: "reviews", label: "Jumlah ulasan", type: "number", required: false },
  { key: "description", label: "Deskripsi", type: "textarea", required: false },
  { key: "label", label: "Label", type: "label", required: false },
  { key: "category", label: "Kategori", type: "category", required: false },
  { key: "image", label: "Gambar", type: "image", required: false },
];

/* ------------------------------ format ------------------------------ */

/** "Rp95.000" → 95000. Text without numbers → 0. */
export function parsePrice(text: unknown): number {
  if (typeof text === "number") return Number.isFinite(text) && text > 0 ? Math.round(text) : 0;
  const digits = String(text ?? "").replace(/[,.]\d{1,2}$/, "").replace(/\D/g, "");
  const n = digits ? Number(digits) : 0;
  return Number.isFinite(n) ? Math.min(n, 999_999_999_999) : 0;
}

/** 95000 → "Rp95.000". 0 → "" for a struck-through price. */
export function formatPrice(n: unknown, emptyWhenZero = false): string {
  const v = typeof n === "number" ? n : parsePrice(n);
  if (!v && emptyWhenZero) return "";
  return `Rp${Math.round(v).toLocaleString("id-ID").replace(/,/g, ".")}`;
}

/** "(214)" → 214. */
export const parseCount = (text: unknown): number => {
  const d = String(text ?? "").replace(/\D/g, "");
  return d ? Math.min(Number(d), 99_999_999) : 0;
};

export const clampRating = (v: unknown): number => {
  const n = typeof v === "number" ? v : Number(String(v ?? "").replace(",", "."));
  return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(5, n)) * 10) / 10 : 0;
};

/** "Produk Kopi" → "produk-kopi". */
export function collectionSlug(name: string): string {
  const s = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return /^[a-z]/.test(s) ? s : s ? `data-${s}`.slice(0, 40) : "data";
}

export const isValidCollectionSlug = (s: string) => /^[a-z][a-z0-9-]{0,39}$/.test(s) && !s.endsWith("-") && !s.includes("--");

/* ------------------------------ slug item --------------------------- */

export const ITEM_SLUG_MAX = 80;
/** "Arabika Gayo 250 g" → "arabika-gayo-250-g". */
export function itemSlugify(name: unknown): string {
  const s = String(name ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, ITEM_SLUG_MAX)
    .replace(/-+$/g, "");
  return s || "item";
}
export const isValidItemSlug = (s: unknown): s is string => typeof s === "string" && s.length <= ITEM_SLUG_MAX && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

/** Ensures every item has a valid and unique slug (old slugs are kept; duplicates → -2, -3). */
/** The slug used by backend API routes (e.g. /api/produk/kategori). */
export const RESERVED_ITEM_SLUGS = ["kategori"];

export function withSlugs(col: CollectionDef): CollectionDef {
  const used = new Set<string>(RESERVED_ITEM_SLUGS);
  let changed = false;
  const items = col.items.map((it) => {
    const base = isValidItemSlug(it.slug) ? it.slug : itemSlugify(it.values.name);
    let slug = base;
    for (let i = 2; used.has(slug); i++) slug = `${base.slice(0, ITEM_SLUG_MAX - String(i).length - 1)}-${i}`;
    used.add(slug);
    if (slug === it.slug) return it;
    changed = true;
    return { ...it, slug };
  });
  return changed ? { ...col, items } : col;
}

/** Validates a slug typed by the user (empty = made from the name). Returns an i18n error key or null. */
export function slugError(col: CollectionDef, raw: string, itemId: string | null): string | null {
  const s = raw.trim();
  if (!s) return null;
  if (!isValidItemSlug(s)) return "crud.err.itemSlug";
  if (RESERVED_ITEM_SLUGS.includes(s) || col.items.some((it) => it.id !== itemId && it.slug === s)) return "crud.err.itemSlugTaken";
  return null;
}

/** Item page URL relative to the site root, e.g. "produk/arabika-gayo-250-g.html". */
export const itemHref = (col: Pick<CollectionDef, "slug">, it: CollectionItem): string => `${col.slug}/${it.slug ?? itemSlugify(it.values.name)}.html`;

/* ------------------------------ card ↔ values ----------------------- */

const cardOf = (n: ComponentNode | undefined): ElementNode | null =>
  !n ? null : isBox(n) ? (collectElements(n).find((e) => e.elementType === COLLECTION_CARD) ?? null) : n.elementType === COLLECTION_CARD ? n : null;

/** Item values from a Product Card state. */
export function valuesFromCard(state: Record<string, unknown>): ItemValues {
  return {
    name: String(state.name ?? "").trim(),
    price: parsePrice(state.priceText),
    compare_price: parsePrice(state.comparePriceText),
    rating: clampRating(state.rating),
    reviews: parseCount(state.ratingCount),
    description: String(state.description ?? ""),
    label: state.badgeEnabled ? String(state.badgeText ?? "").trim() : "",
    image: String(state.imageSrc ?? ""),
  };
}

/** Product Card state from the pattern + item values (styles stay the pattern's). */
export function cardStateFor(pattern: Record<string, unknown>, v: ItemValues): Record<string, unknown> {
  const label = String(v.label ?? "").trim();
  const name = String(v.name ?? "");
  return {
    ...pattern,
    name,
    imageAlt: name,
    priceText: formatPrice(v.price),
    comparePriceText: formatPrice(v.compare_price, true),
    rating: clampRating(v.rating),
    ratingCount: Number(v.reviews) > 0 ? `(${Number(v.reviews)})` : "",
    description: String(v.description ?? ""),
    // The badge stays "active" in the pattern so its CSS exists; empty text = not shown.
    badgeEnabled: true,
    badgeText: label,
    imageSrc: v.image ? String(v.image) : NO_IMAGE,
  };
}

/** Does this box hold repeated cards that can become a collection? */
export function canBecomeCollection(box: BoxNode): boolean {
  if (box.collection || box.section) return false;
  return box.children.length > 0 && box.children.every((c) => !!cardOf(c));
}

/** A new collection from the cards already in the box (card values = initial data). */
export function inferCollection(box: BoxNode, name = "Produk"): CollectionDef {
  const items = box.children.slice(0, MAX_ITEMS).map((c, i) => ({ id: `it-${i + 1}`, values: valuesFromCard(cardOf(c)!.state ?? {}) }));
  const first = box.children[0];
  return withSlugs({
    name: name.trim() || "Produk",
    slug: collectionSlug(name || "produk"),
    card: COLLECTION_CARD,
    fields: PRODUCT_FIELDS.map((f) => ({ ...f })),
    items,
    ...(first ? { pattern: cloneNode(first) } : {}),
  });
}

/** Mark a box as a collection. */
export function markCollection(root: BoxNode, boxId: NodeId, name: string): BoxNode {
  return updateNode(root, boxId, (n) => (isBox(n) && canBecomeCollection(n) ? { ...n, collection: inferCollection(n, name) } : n));
}

/** Detaches the collection: the cards stay as static elements. */
export function unmarkCollection(root: BoxNode, boxId: NodeId): BoxNode {
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.collection) return n;
    const out = { ...n };
    delete out.collection;
    return out;
  });
}

/**
 * Rebuilds the cards from data. Pattern = the first card currently shown
 * (so styles changed on the first card carry to every card), or the stored
 * pattern when no cards are left.
 */
export function materialize(box: BoxNode, col: CollectionDef = box.collection!): BoxNode {
  const pattern = box.children.find((c) => !!cardOf(c)) ?? col.pattern;
  if (!pattern) return { ...box, collection: col };
  const patternCard = cardOf(pattern);
  if (!patternCard) return { ...box, collection: col };
  const children = visibleItems(col).map((it) => {
    const copy = cloneNode(pattern);
    const name = String(it.values.name ?? "") || patternCard.name;
    const patch = (n: ComponentNode): ComponentNode => {
      if (isBox(n)) return { ...n, children: n.children.map(patch) };
      if (n.elementType !== COLLECTION_CARD) return n;
      const state = cardStateFor(patternCard.state ?? {}, it.values);
      if (col.itemPage) state.ctaHref = itemHref(col, it);
      else if (typeof state.ctaHref === "string" && state.ctaHref.startsWith(`${col.slug}/`)) state.ctaHref = "#";
      return { ...n, name, state };
    };
    // Category marker (data-category) for the filter chips on the public page.
    const { itemCategory: _c, ...out } = patch(copy);
    void _c;
    const cat = itemCategory(it);
    return (cat ? { ...out, itemCategory: cat } : out) as ComponentNode;
  });
  return { ...box, collection: { ...col, pattern: cloneNode(pattern) }, children };
}

/** Replaces the collection data in box `boxId`, then rebuilds its cards. */
export function applyCollection(root: BoxNode, boxId: NodeId, next: CollectionDef): BoxNode {
  return updateNode(root, boxId, (n) => (isBox(n) && n.collection ? materialize(n, next) : n));
}

/** Changes the collection display of box `boxId` ("all" = remove the field, back to the default). */
export function setCollectionDisplay(root: BoxNode, boxId: NodeId, d: CollectionDisplay): BoxNode {
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.collection) return n;
    const { display: _old, ...rest } = n.collection;
    void _old;
    const next: CollectionDef = d.mode === "all" ? rest : { ...rest, display: { mode: d.mode, perPage: clampPerPage(d.perPage) } };
    return materialize(n, next);
  });
}

/* ------------------------------ CRUD murni -------------------------- */

export const emptyValues = (fields: CollectionField[]): ItemValues =>
  Object.fromEntries(fields.map((f) => [f.key, f.type === "price" || f.type === "number" || f.type === "rating" ? 0 : ""]));

export type FieldErrors = Partial<Record<string, string>>;

/** Validate + clean form values. Error message keys = i18n keys. */
export function validateValues(fields: CollectionField[], raw: Record<string, unknown>): { values: ItemValues; errors: FieldErrors } {
  const values: ItemValues = {};
  const errors: FieldErrors = {};
  for (const f of fields) {
    const v = raw[f.key];
    switch (f.type) {
      case "price":
      case "number": {
        const s = String(v ?? "").trim();
        const n = s === "" ? 0 : f.type === "price" ? parsePrice(s) : Number(s.replace(",", "."));
        if (s !== "" && (!Number.isFinite(n) || n < 0 || (f.type === "number" && !/^\d+$/.test(s)))) errors[f.key] = "crud.err.number";
        values[f.key] = Number.isFinite(n) ? Math.max(0, Math.round(n)) : 0;
        if (f.required && !values[f.key]) errors[f.key] = errors[f.key] ?? "crud.err.required";
        break;
      }
      case "rating": {
        const s = String(v ?? "").trim().replace(",", ".");
        const n = s === "" ? 0 : Number(s);
        if (!Number.isFinite(n) || n < 0 || n > 5) errors[f.key] = "crud.err.rating";
        values[f.key] = clampRating(n);
        break;
      }
      default: {
        const s = String(v ?? "").trim();
        const max = f.type === "textarea" ? 2000 : f.type === "label" ? 30 : f.type === "category" ? CATEGORY_MAX : f.type === "image" ? 3_000_000 : 160;
        if (f.required && !s) errors[f.key] = "crud.err.required";
        else if (s.length > max) errors[f.key] = "crud.err.tooLong";
        if (f.type === "image" && s && !/^(https?:\/\/|data:image\/|aset:|\/|\.\/|assets\/)/i.test(s)) errors[f.key] = "crud.err.image";
        values[f.key] = f.type === "category" ? s.replace(/\s+/g, " ") : s;
      }
    }
  }
  // The strikethrough price must be greater than the price.
  if (Number(values.compare_price) > 0 && Number(values.compare_price) <= Number(values.price)) errors.compare_price = errors.compare_price ?? "crud.err.compare";
  return { values, errors };
}

export function addItem(col: CollectionDef, values: ItemValues, atStart = true, slug = ""): CollectionDef {
  if (col.items.length >= MAX_ITEMS) return col;
  const item: CollectionItem = { id: `it-${makeId()}`, values, ...(isValidItemSlug(slug.trim()) ? { slug: slug.trim() } : {}) };
  // New items go first when assigning slugs so their typed slugs are not displaced.
  const next = withSlugs({ ...col, items: [item, ...col.items] });
  if (atStart) return next;
  const [first, ...rest] = next.items;
  return { ...next, items: [...rest, first] };
}

/** Changes an item. Empty `slug` = the old slug stays (it does not change when the name changes). */
export const updateItem = (col: CollectionDef, id: string, values: ItemValues, slug = ""): CollectionDef =>
  withSlugs({
    ...col,
    items: col.items.map((it) => (it.id === id ? { ...it, values, ...(isValidItemSlug(slug.trim()) ? { slug: slug.trim() } : {}) } : it)),
  });

export const removeItem = (col: CollectionDef, id: string): CollectionDef => ({ ...col, items: col.items.filter((it) => it.id !== id) });

export function moveItem(col: CollectionDef, id: string, delta: -1 | 1): CollectionDef {
  const i = col.items.findIndex((it) => it.id === id);
  const j = i + delta;
  if (i < 0 || j < 0 || j >= col.items.length) return col;
  const items = col.items.slice();
  [items[i], items[j]] = [items[j], items[i]];
  return { ...col, items };
}

/** Search (name, description, label) + pagination. Pages count from 1. */
export function queryItems(col: CollectionDef, q: string, page: number, perPage: number) {
  const needle = q.trim().toLowerCase();
  const text = col.fields.filter((f) => f.type === "text" || f.type === "textarea" || f.type === "label" || f.type === "category").map((f) => f.key);
  const matched = needle ? col.items.filter((it) => text.some((k) => String(it.values[k] ?? "").toLowerCase().includes(needle))) : col.items;
  const pages = Math.max(1, Math.ceil(matched.length / perPage));
  const current = Math.min(Math.max(1, page), pages);
  return { rows: matched.slice((current - 1) * perPage, current * perPage), total: matched.length, pages, page: current, from: matched.length ? (current - 1) * perPage + 1 : 0 };
}

/* ------------------------------ page / site --------------------- */

export interface CollectionRef {
  boxId: NodeId;
  col: CollectionDef;
}

/** Every collection in one page tree (document order). */
export function collectionsIn(root: ComponentNode): CollectionRef[] {
  const out: CollectionRef[] = [];
  const walk = (n: ComponentNode) => {
    if (!isBox(n)) return;
    if (n.collection) out.push({ boxId: n.id, col: n.collection });
    n.children.forEach(walk);
  };
  walk(root);
  return out;
}

/** The collection box this node belongs to (for the note in card Settings). */
export function collectionAncestor(root: BoxNode, id: NodeId): BoxNode | null {
  let found: BoxNode | null = null;
  const walk = (n: ComponentNode, owner: BoxNode | null): boolean => {
    const o = isBox(n) && n.collection ? n : owner;
    if (n.id === id) {
      found = o && o.id !== id ? o : null;
      return true;
    }
    return isBox(n) && n.children.some((c) => walk(c, o));
  };
  walk(root, null);
  return found;
}

/** Unique collections per slug for the backend code (duplicate slug → -2, -3 suffix). */
export function uniqueCollections(list: CollectionDef[]): CollectionDef[] {
  const used = new Set<string>();
  return list.map((c) => {
    let slug = isValidCollectionSlug(c.slug) ? c.slug : collectionSlug(c.name);
    for (let i = 2; used.has(slug); i++) slug = `${c.slug}-${i}`;
    used.add(slug);
    return slug === c.slug ? c : { ...c, slug };
  });
}

export const findCollectionBox = (root: BoxNode, boxId: NodeId): BoxNode | null => {
  const n = findNode(root, boxId);
  return n && isBox(n) && n.collection ? n : null;
};

/* ------------------------------ sanitizing (load) --------------------- */

const FIELD_TYPES: FieldType[] = ["text", "textarea", "price", "number", "rating", "image", "label", "category"];
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

/** Stored collection data → valid. `sanitizeNode` is used for the card pattern. */
export function sanitizeCollection(v: unknown, sanitizeNode: (n: unknown) => ComponentNode | null): CollectionDef | undefined {
  if (!isObj(v) || v.card !== COLLECTION_CARD) return undefined;
  const name = typeof v.name === "string" && v.name.trim() ? v.name.trim().slice(0, 60) : "Produk";
  const slug = typeof v.slug === "string" && isValidCollectionSlug(v.slug) ? v.slug : collectionSlug(name);
  const fields: CollectionField[] = Array.isArray(v.fields)
    ? v.fields
        .filter(isObj)
        .filter((f) => typeof f.key === "string" && /^[a-z][a-z0-9_]{0,39}$/.test(f.key) && FIELD_TYPES.includes(f.type as FieldType))
        .map((f) => ({ key: f.key as string, label: typeof f.label === "string" ? f.label.slice(0, 60) : (f.key as string), type: f.type as FieldType, required: f.required === true }))
    : [];
  const items: CollectionItem[] = Array.isArray(v.items)
    ? v.items
        .filter(isObj)
        .slice(0, MAX_ITEMS)
        .map((it) => {
          const raw = isObj(it.values) ? it.values : {};
          const values: ItemValues = {};
          for (const [k, x] of Object.entries(raw)) if (typeof x === "string" || (typeof x === "number" && Number.isFinite(x))) values[k] = x;
          return { id: typeof it.id === "string" && it.id ? it.id.slice(0, 64) : `it-${makeId()}`, values, ...(isValidItemSlug(it.slug) ? { slug: it.slug } : {}) };
        })
    : [];
  const pattern = v.pattern ? sanitizeNode(v.pattern) : null;
  const d = isObj(v.display) && DISPLAY_MODES.includes(v.display.mode as CollectionDisplayMode) ? v.display : null;
  const display: CollectionDisplay | null = d && d.mode !== "all" ? { mode: d.mode as CollectionDisplayMode, perPage: clampPerPage(d.perPage) } : null;
  const vw = isObj(v.view) ? v.view : null;
  const vCat = vw && typeof vw.category === "string" ? vw.category.trim().replace(/\s+/g, " ").slice(0, CATEGORY_MAX) : "";
  const vSort = vw && SORT_KEYS.includes(vw.sort as SortKey) && vw.sort !== "manual" ? (vw.sort as SortKey) : undefined;
  const view: CollectionView | null = vCat || vSort ? { ...(vCat ? { category: vCat } : {}), ...(vSort ? { sort: vSort } : {}) } : null;
  return withSlugs({
    name,
    slug,
    card: COLLECTION_CARD,
    fields: withCategoryField(fields.length ? fields : PRODUCT_FIELDS.map((f) => ({ ...f }))),
    items,
    ...(pattern ? { pattern } : {}),
    ...(display ? { display } : {}),
    ...(v.itemPage === true ? { itemPage: true } : {}),
    ...(view ? { view } : {}),
  });
}

/** Old data (before categories existed): a "Kategori" column is added after Label. */
function withCategoryField(fields: CollectionField[]): CollectionField[] {
  if (fields.some((f) => f.key === "category")) return fields;
  const cat = PRODUCT_FIELDS.find((f) => f.key === "category")!;
  const at = fields.findIndex((f) => f.key === "label");
  const out = fields.slice();
  out.splice(at < 0 ? out.length : at + 1, 0, { ...cat });
  return out;
}

/** Changes the category/display order of box `boxId`'s collection (all empty = remove the field). */
export function setCollectionView(root: BoxNode, boxId: NodeId, v: CollectionView): BoxNode {
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.collection) return n;
    const { view: _old, ...rest } = n.collection;
    void _old;
    const category = (v.category ?? "").trim();
    const sort = v.sort && v.sort !== "manual" ? v.sort : undefined;
    const next: CollectionDef = category || sort ? { ...rest, view: { ...(category ? { category } : {}), ...(sort ? { sort } : {}) } } : rest;
    return materialize(n, next);
  });
}
