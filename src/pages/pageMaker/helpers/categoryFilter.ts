import type { BoxNode, ComponentNode, ElementNode, NodeId } from "../engine/helpers/componentTypes";
import { isBox } from "../engine/helpers/componentTypes";
import { cloneNode, newNodeId, updateNode } from "../engine/helpers/tree";
import { CATEGORY_MAX, categoriesOf, isValidCollectionSlug, sameCategory, type CollectionDef } from "./collections";

/* ================================================================== */
/* Chip filter kategori (uji coba CRUD)                                 */
/*                                                                    */
/* Sebuah grup berisi badge / teks / tombol (mis. "Semua · Biji kopi ·   */
/* Alat seduh") bisa dijadikan filter untuk koleksi data:               */
/*   - box: `filterOf` = slug koleksi → atribut data-filter             */
/*   - tiap chip: `chip` = kategori ("" = Semua) → data-chip            */
/*   - kartu koleksi: `itemCategory` → data-category                    */
/* Gaya chip tetap milik pengguna: chip aktif & tidak aktif diambil dari  */
/* chip yang ada (chip "Semua" = gaya aktif, chip lain = gaya biasa).    */
/*                                                                    */
/* Situs statis: FILTER_JS menyembunyikan kartu di halaman. Dengan       */
/* backend Express: collections.js memuat ulang data (?kategori=).       */
/* ================================================================== */

const CHIP_TYPES = new Set(["badge", "text", "button"]);
const ALL_WORDS = /^(semua|all|semua produk|all products)$/i;

export const isChipElement = (n: ComponentNode): n is ElementNode => !isBox(n) && CHIP_TYPES.has(n.elementType);
export const chipText = (el: ElementNode): string => String(el.state?.text ?? "").trim();

/** Box ini bisa dijadikan grup chip filter? (≥ 2 chip, semua anak badge/teks/tombol) */
export function canBeFilterBar(box: BoxNode): boolean {
  if (box.collection || box.section || box.itemOf || box.related || box.filterOf) return false;
  return box.children.length >= 2 && box.children.every(isChipElement);
}

/** Nilai chip dari teksnya: "Semua" → "", selain itu kategori yang cocok (atau teks itu sendiri). */
function chipValue(text: string, cats: string[], index: number): string {
  if (ALL_WORDS.test(text) || (index === 0 && !text)) return "";
  return cats.find((c) => sameCategory(c, text)) ?? text.slice(0, CATEGORY_MAX);
}

const withText = (el: ElementNode, text: string, chip: string): ElementNode => ({
  ...el,
  id: newNodeId(),
  name: text,
  state: { ...el.state, text },
  chip,
});

/**
 * Samakan chip dengan kategori koleksi. Data tanpa kategori → chip yang ada
 * dipertahankan (hanya diberi nilai dari teksnya).
 */
export function syncFilterBar(box: BoxNode, col: CollectionDef): BoxNode {
  const chips = box.children.filter(isChipElement);
  if (!chips.length) return box;
  const cats = categoriesOf(col);
  if (!cats.length) {
    return { ...box, children: box.children.map((c, i) => (isChipElement(c) ? { ...c, chip: chipValue(chipText(c), cats, i) } : c)) };
  }
  const all = chips.find((c) => chipValue(chipText(c), cats, chips.indexOf(c)) === "") ?? null;
  const idle = chips.find((c) => c !== all) ?? chips[0];
  const out: ComponentNode[] = [];
  if (all) out.push({ ...all, chip: "" });
  for (const cat of cats) {
    // Chip yang sudah ada untuk kategori ini dipakai lagi (id & gaya tetap).
    const same = chips.find((c) => c !== all && sameCategory(chipText(c), cat));
    out.push(same ? { ...same, chip: cat } : withText(cloneNode(idle) as ElementNode, cat, cat));
  }
  return { ...box, children: out };
}

export function markFilterBar(root: BoxNode, boxId: NodeId, col: CollectionDef): BoxNode {
  return updateNode(root, boxId, (n) => (isBox(n) && canBeFilterBar(n) ? syncFilterBar({ ...n, filterOf: col.slug }, col) : n));
}

export function unmarkFilterBar(root: BoxNode, boxId: NodeId): BoxNode {
  return updateNode(root, boxId, (n) => {
    if (!isBox(n) || !n.filterOf) return n;
    const { filterOf: _f, ...rest } = n;
    void _f;
    return {
      ...rest,
      children: n.children.map((c) => {
        if (isBox(c) || c.chip === undefined) return c;
        const { chip: _c, ...el } = c;
        void _c;
        return el;
      }),
    } as BoxNode;
  });
}

/** Semua grup chip di pohon (urutan dokumen). */
export function filterBarsIn(root: ComponentNode): BoxNode[] {
  const out: BoxNode[] = [];
  const walk = (n: ComponentNode) => {
    if (!isBox(n)) return;
    if (n.filterOf) out.push(n);
    n.children.forEach(walk);
  };
  walk(root);
  return out;
}

/** Sinkronkan semua grup chip dengan koleksinya (dipanggil saat data berubah). */
export function syncFilterBars(root: BoxNode, cols: CollectionDef[], rename?: { from: string; to: string }): BoxNode {
  const walk = (n: ComponentNode): ComponentNode => {
    if (!isBox(n)) return n;
    let box: BoxNode = { ...n, children: n.children.map(walk) };
    if (box.filterOf) {
      if (rename && box.filterOf === rename.from) box = { ...box, filterOf: rename.to };
      const col = cols.find((c) => c.slug === box.filterOf);
      if (col) box = syncFilterBar(box, col);
    }
    return box;
  };
  return walk(root) as BoxNode;
}

/** Grup chip tempat node ini berada (atau box itu sendiri). */
export function filterBarOf(root: BoxNode, id: NodeId): BoxNode | null {
  let found: BoxNode | null = null;
  const walk = (n: ComponentNode, owner: BoxNode | null): boolean => {
    const o = isBox(n) && n.filterOf ? n : owner;
    if (n.id === id) {
      found = o;
      return true;
    }
    return isBox(n) && n.children.some((c) => walk(c, o));
  };
  walk(root, null);
  return found;
}

/* ------------------------------ sanitasi ---------------------------- */

export const sanitizeFilterOf = (v: unknown): string | undefined => (typeof v === "string" && isValidCollectionSlug(v) ? v : undefined);
export const sanitizeChip = (v: unknown): string | undefined => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, CATEGORY_MAX) : undefined);
export const sanitizeCategory = (v: unknown): string | undefined => {
  const s = typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, CATEGORY_MAX) : "";
  return s || undefined;
};

/* ------------------------------ skrip halaman statis ---------------- */

/**
 * Skrip filter untuk situs statis (tanpa backend): klik chip →
 * kartu dengan data-category lain disembunyikan. Bila collections.js
 * (backend) ada, skrip ini berhenti supaya filter diambil dari server.
 */
export const FILTER_JS = `/* owd-category-filter */
(function () {
  function init() {
    if (window.OWD_COLLECTIONS) return;
    document.querySelectorAll("[data-filter]").forEach(function (bar) {
      var slug = bar.getAttribute("data-filter");
      var chips = Array.prototype.slice.call(bar.querySelectorAll("[data-chip]"));
      if (!chips.length) return;
      var active = chips.filter(function (c) { return c.getAttribute("aria-pressed") === "true"; })[0] || chips[0];
      var idle = chips.filter(function (c) { return c !== active; })[0] || active;
      var activeCls = active.className;
      var idleCls = idle.className;
      function select(chip) {
        var cat = (chip.getAttribute("data-chip") || "").toLowerCase();
        chips.forEach(function (c) {
          var on = c === chip;
          c.className = on ? activeCls : idleCls;
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
        document.querySelectorAll('[data-collection="' + slug + '"]').forEach(function (grid) {
          Array.prototype.forEach.call(grid.children, function (card) {
            var own = (card.getAttribute("data-category") || "").toLowerCase();
            card.style.display = !cat || own === cat ? "" : "none";
          });
        });
      }
      chips.forEach(function (chip) {
        chip.addEventListener("click", function (e) { e.preventDefault(); select(chip); });
        chip.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(chip); }
        });
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();`;
