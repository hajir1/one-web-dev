import type { BoxNode, ComponentNode, ElementNode } from "../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../pageMaker/engine/helpers/componentTypes";
import { collectElements, findNode, updateNode } from "../pageMaker/engine/helpers/tree";
import { canBecomeCollection, collectionsIn, inferCollection, itemHref, materialize, type CollectionDef } from "../pageMaker/helpers/collections";
import { canBind, markRelated, syncItemPage, type BindField } from "../pageMaker/helpers/itemPage";
import type { TplLang } from "./types";

/* ================================================================== */
/* Uji coba CRUD untuk SEMUA template yang punya katalog Product Card.  */
/*                                                                    */
/* Dijalankan setelah halaman template dibangun (buildPages.ts):        */
/*   1. Grid kartu terbesar = koleksi data (nama dari halamannya).      */
/*   2. Bila kartu menuju halaman detail (key "product" / "car"):       */
/*      halaman itu jadi halaman item (judul, harga, gambar, … terikat) */
/*      dan grid kartu di halaman detail jadi "Mungkin Anda suka".      */
/* Template yang sudah menandai koleksinya sendiri (mis. Kopi Senja)    */
/* tidak diubah. Grid kartu lain tetap statis.                          */
/* ================================================================== */

interface PageLike {
  key: string;
  slug: string;
  name: string;
  home: boolean;
  doc: { root: BoxNode };
}

/** Halaman yang isinya detail SATU item (kartu katalog menuju ke sini). */
const DETAIL_KEYS = new Set(["product", "car"]);
/** Nama halaman yang terlalu umum untuk jadi nama koleksi. */
const GENERIC = /^(beranda|home|katalog|catalog|koleksi|collection|toko|shop|store|produk|products?|karya|works?|merch)$/i;

interface Grid {
  page: number;
  box: BoxNode;
}

/** Grid kartu teratas (bukan grid di dalam grid kartu lain), urutan dokumen. */
function cardGrids(root: BoxNode, page: number, out: Grid[] = []): Grid[] {
  const walk = (n: ComponentNode) => {
    if (!isBox(n)) return;
    if (n.children.length >= 2 && canBecomeCollection(n)) {
      out.push({ page, box: n });
      return;
    }
    n.children.forEach(walk);
  };
  walk(root);
  return out;
}

const cardHref = (box: BoxNode): string[] => [
  ...new Set(
    box.children.map((c) => String(collectElements(c).find((e) => e.elementType === "product-card")?.state?.ctaHref ?? "")),
  ),
];

const textOf = (e: ElementNode) => String(e.state?.text ?? "").trim();
const PRICE = /^(rp|idr|\$|usd)\s?[\d.,]+/i;
const isText = (e: ElementNode) => e.elementType === "text";
/** Judul item: h1 pertama; tanpa h1 → h2 pertama yang bukan harga. */
const titleOf = (els: ElementNode[]) =>
  els.find((e) => isText(e) && e.state?.tag === "h1") ?? els.find((e) => isText(e) && e.state?.tag === "h2" && !PRICE.test(textOf(e)));

/**
 * Ikatan halaman detail berdasarkan posisi: judul h1 → nama, teks harga
 * pertama/kedua → harga/harga coret, bintang → rating, badge → label,
 * gambar pertama → gambar, paragraf panjang pertama setelah judul → deskripsi.
 */
function bindDetail(box: BoxNode): BoxNode | null {
  const els = collectElements(box).filter((e) => canBind(e) && e.elementType !== "product-card");
  const title = titleOf(els);
  const prices = els.filter((e) => e !== title && isText(e) && PRICE.test(textOf(e)));
  if (!title || !prices.length) return null;
  const want = new Map<string, BindField>();
  want.set(title.id, "name");
  want.set(prices[0].id, "price");
  if (prices[1]) want.set(prices[1].id, "compare_price");
  const stars = els.find((e) => e.elementType === "text" && textOf(e).startsWith("★"));
  if (stars) want.set(stars.id, "rating");
  const img = els.find((e) => e.elementType === "image");
  if (img) want.set(img.id, "image");
  const badge = els.find((e) => e.elementType === "badge");
  if (badge) want.set(badge.id, "label");
  const after = els.slice(els.indexOf(title) + 1);
  const desc = after.find((e) => e.elementType === "text" && !want.has(e.id) && !e.state?.tag?.startsWith?.("h") && textOf(e).length >= 30);
  if (desc) want.set(desc.id, "description");
  const patch = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return n.collection || n.related ? n : { ...n, children: n.children.map(patch) };
    const f = want.get(n.id);
    return f ? { ...n, bind: f } : n;
  };
  return patch(box) as BoxNode;
}

/** Box terkecil yang memuat judul h1/h2 dan harga (= "detail item"). */
function detailBox(root: BoxNode): BoxNode | null {
  let best: BoxNode | null = null;
  const walk = (n: ComponentNode) => {
    if (!isBox(n) || n.collection || n.related) return;
    if (canBecomeCollection(n)) return;
    const els = collectElements(n);
    const title = titleOf(els);
    // Judul, harga (selain judul), dan gambar dalam satu box; tanpa kartu produk.
    const ok =
      !!title &&
      els.some((e) => e !== title && isText(e) && PRICE.test(textOf(e))) &&
      els.some((e) => e.elementType === "image") &&
      !els.some((e) => e.elementType === "product-card");
    if (ok) best = n;
    n.children.forEach(walk);
  };
  walk(root);
  return best;
}

/** Nama koleksi bawaan per kategori template (bila halaman katalog bernama umum / beranda). */
const BY_CATEGORY: Record<string, [string, string]> = {
  restaurant: ["Menu", "Menu"],
  bakery: ["Menu", "Menu"],
  catering: ["Menu", "Menu"],
  travel: ["Paket", "Packages"],
  realestate: ["Properti", "Properties"],
  hospitality: ["Kamar", "Rooms"],
  florist: ["Buket", "Bouquets"],
  bookstore: ["Buku", "Books"],
  event: ["Tiket", "Tickets"],
};

function collectionName(main: PageLike, detail: PageLike | null, lang: TplLang, category?: string): string {
  const cat = category ? BY_CATEGORY[category] : undefined;
  const fallback = cat ? cat[lang === "id" ? 0 : 1] : lang === "id" ? "Produk" : "Products";
  if (detail) {
    const n = detail.name.replace(/^(detail|details?)\s+/i, "").replace(/\s+(detail|details?)$/i, "").trim();
    if (n && !GENERIC.test(n)) return n;
    if (n) return lang === "id" ? "Produk" : "Products";
  }
  return main.home || GENERIC.test(main.name.trim()) ? fallback : main.name.trim();
}

function linkCards(root: BoxNode, col: CollectionDef, skip: string): BoxNode {
  const byName = new Map(col.items.map((it) => [String(it.values.name ?? "").trim().toLowerCase(), it]));
  const walk = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return n.id === skip || n.collection ? n : { ...n, children: n.children.map(walk) };
    if (n.elementType !== "product-card") return n;
    const it = byName.get(String(n.state?.name ?? "").trim().toLowerCase());
    return it ? { ...n, state: { ...n.state, ctaHref: itemHref(col, it) } } : n;
  };
  return walk(root) as BoxNode;
}

export function applyTemplateCrud<P extends PageLike>(pages: P[], lang: TplLang, category?: string): P[] {
  if (pages.some((p) => collectionsIn(p.doc.root).length)) return pages;
  const grids = pages.flatMap((p, i) => cardGrids(p.doc.root, i));
  if (!grids.length) return pages;
  // Grid terbesar; seri → halaman selain beranda (katalog), lalu yang lebih dulu.
  const main = grids.reduce((a, b) => (b.box.children.length > a.box.children.length || (b.box.children.length === a.box.children.length && pages[a.page].home && !pages[b.page].home) ? b : a));
  const hrefs = cardHref(main.box);
  const found = hrefs.length === 1 ? pages.findIndex((p) => DETAIL_KEYS.has(p.key) && hrefs[0] === `${p.slug}.html`) : -1;
  // Grid utama di halaman detail itu sendiri → tanpa halaman item.
  const detailIdx = found >= 0 && found !== main.page ? found : -1;
  const detail = detailIdx >= 0 ? pages[detailIdx] : null;
  const name = collectionName(pages[main.page], detail, lang, category);

  const dBox = detail ? detailBox(detail.doc.root) : null;
  const bound = dBox ? bindDetail(dBox) : null;
  const col: CollectionDef = { ...inferCollection(main.box, name), ...(bound ? { itemPage: true } : {}) };

  return pages.map((p, i) => {
    let root = p.doc.root;
    if (i === main.page) root = updateNode(root, main.box.id, (n) => (isBox(n) ? materialize({ ...n, name: n.name || name }, col) : n)) as BoxNode;
    // Kartu lain (mis. "Terlaris" di beranda) yang produknya ada di koleksi → menuju halaman itemnya.
    if (bound) root = linkCards(root, col, main.box.id);
    if (bound && i === detailIdx && dBox) {
      root = updateNode(root, dBox.id, () => ({ ...bound, itemOf: { collection: col.slug } })) as BoxNode;
      // Grid kartu di halaman detail → "Mungkin Anda suka" (label sama dulu).
      for (const g of cardGrids(root, i)) if (findNode(root, g.box.id)) root = markRelated(root, g.box.id, col, g.box.children.length);
      root = syncItemPage(root, [col]);
    }
    return root === p.doc.root ? p : { ...p, doc: { ...p.doc, root } };
  });
}
