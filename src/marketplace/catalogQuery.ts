import type { TemplateCatalogItem, Tier } from "./types";

/* ================================================================== */
/* Filter & urutan katalog template (murni, dipakai UI dan tes)          */
/* ================================================================== */

export type TemplateSort = "featured" | "price-asc" | "price-desc" | "category" | "name";

export interface TemplateQuery {
  /** Cari di nama, deskripsi, dan tag. */
  text: string;
  category: "all" | string;
  tier: "all" | Tier;
  sort: TemplateSort;
}

export const DEFAULT_TEMPLATE_QUERY: TemplateQuery = { text: "", category: "all", tier: "all", sort: "featured" };

/** Normalisasi teks pencarian: huruf kecil, tanpa diakritik, spasi tunggal. */
const normalizeSearch = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Terapkan filter & urutan. `categoryLabel` dipakai untuk urutan kategori
 * sesuai bahasa tampilan. Urutan "featured" = urutan katalog asli.
 */
export function queryTemplates(list: TemplateCatalogItem[], q: TemplateQuery, categoryLabel: (c: string) => string = (c) => c): TemplateCatalogItem[] {
  const words = normalizeSearch(q.text).split(" ").filter(Boolean);
  const out = list.filter((t) => {
    if (q.category !== "all" && t.category !== q.category) return false;
    if (q.tier !== "all" && t.tier !== q.tier) return false;
    if (!words.length) return true;
    const hay = normalizeSearch(`${t.name} ${t.description} ${t.tags.join(" ")} ${categoryLabel(t.category)}`);
    return words.every((w) => hay.includes(w));
  });
  const index = new Map(list.map((t, i) => [t.id, i]));
  const byIndex = (a: TemplateCatalogItem, b: TemplateCatalogItem) => index.get(a.id)! - index.get(b.id)!;
  const sorters: Record<TemplateSort, (a: TemplateCatalogItem, b: TemplateCatalogItem) => number> = {
    featured: byIndex,
    "price-asc": (a, b) => a.price - b.price || byIndex(a, b),
    "price-desc": (a, b) => b.price - a.price || byIndex(a, b),
    category: (a, b) => categoryLabel(a.category).localeCompare(categoryLabel(b.category)) || byIndex(a, b),
    name: (a, b) => a.name.localeCompare(b.name) || byIndex(a, b),
  };
  return [...out].sort(sorters[q.sort] ?? byIndex);
}

/* ------------------------------------------------------------------ */
/* Halaman katalog: filter & nomor halaman di URL                        */
/* ------------------------------------------------------------------ */

const SORT_VALUES: TemplateSort[] = ["featured", "price-asc", "price-desc", "category", "name"];
const MAX_PAGE = 10_000;

/** Filter + halaman dari query string (?q&category&tier&sort&page). Nilai tidak dikenal → default. */
export function templateQueryFromSearch(search: URLSearchParams, categories: readonly string[]): TemplateQuery & { page: number } {
  const category = search.get("category") ?? "all";
  const tier = search.get("tier");
  const sort = search.get("sort") as TemplateSort | null;
  const page = Number.parseInt(search.get("page") ?? "1", 10);
  return {
    text: (search.get("q") ?? "").slice(0, 100),
    category: categories.includes(category) ? category : "all",
    tier: tier === "free" || tier === "premium" ? tier : "all",
    sort: sort && SORT_VALUES.includes(sort) ? sort : "featured",
    page: Number.isFinite(page) && page >= 1 ? Math.min(page, MAX_PAGE) : 1,
  };
}

/** Query string untuk filter + halaman; nilai default tidak ditulis agar URL tetap pendek. */
export function templateSearchFromQuery(q: TemplateQuery & { page: number }): URLSearchParams {
  const s = new URLSearchParams();
  if (q.text.trim()) s.set("q", q.text.trim());
  if (q.category !== "all") s.set("category", q.category);
  if (q.tier !== "all") s.set("tier", q.tier);
  if (q.sort !== "featured") s.set("sort", q.sort);
  if (q.page > 1) s.set("page", String(q.page));
  return s;
}

/**
 * Nomor halaman yang ditampilkan: selalu halaman pertama & terakhir, plus
 * tetangga halaman aktif; celah diganti "…". Mis. (6, 25) → 1 … 5 6 7 … 25.
 */
export function pageList(current: number, pages: number, around = 1): (number | "gap")[] {
  if (pages <= 1) return [1];
  const keep = new Set([1, pages]);
  for (let p = current - around; p <= current + around; p++) if (p >= 1 && p <= pages) keep.add(p);
  // Celah satu angka tidak perlu "…": tampilkan angkanya.
  const sorted = [...keep].sort((a, b) => a - b);
  const out: (number | "gap")[] = [];
  sorted.forEach((p, i) => {
    const prev = sorted[i - 1];
    if (prev !== undefined && p - prev === 2) out.push(prev + 1);
    else if (prev !== undefined && p - prev > 2) out.push("gap");
    out.push(p);
  });
  return out;
}

/** Rentang item yang tampil di halaman ini (1-based), mis. 11–20 dari 47. */
export const pageRange = (page: number, limit: number, total: number) => (total === 0 ? { from: 0, to: 0 } : { from: (page - 1) * limit + 1, to: Math.min(total, page * limit) });
