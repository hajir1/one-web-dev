import {
  ROOT_ID,
  isBox,
  type BoxNode,
  type ComponentDoc,
  type ComponentNode,
  type DocSource,
} from "../engine/helpers/componentTypes";
import { canMoveInto, cloneNode, createRoot, duplicateNode, findNode, findParent, insertNode, removeNode, updateNode, walk, wrapInBox } from "../engine/helpers/tree";
import { normalizeDoc } from "../engine/helpers/migrate";
import { createRow, isRow } from "./rowModel";
import { getSectionPreset, type SectionPreset } from "./sectionPresets";
import { COLUMN_LAYOUTS, createColumnRow, createInnerRow, fractionLabel } from "./sectionTypes";

/* ================================================================== */
/* Dokumen halaman: root (main) → Section → Row → Element                */
/*                                                                    */
/* Aturan struktur:                                                     */
/*   - anak langsung root HANYA boleh section                           */
/*   - anak langsung section HANYA boleh Row (section = layout blok)    */
/*   - elemen & component selalu berada di dalam sebuah Row             */
/*     (boleh lewat kolom/grup di dalam Row)                            */
/*   - section & Row tidak boleh bersarang                              */
/* ================================================================== */

export type PageDoc = ComponentDoc;
export const PAGE_TYPE = "page";
export const DEFAULT_PAGE_CLASS_NAME = "custom-page";

export const isSection = (n: ComponentNode): boolean => isBox(n) && !!n.section;

export function createPageRoot(children: BoxNode[] = []): BoxNode {
  return createRoot("stack", {
    name: "Halaman",
    tag: "main",
    gap: 0,
    padding: 0,
    bgEnabled: true,
    bgColor: "#ffffff",
    borderWidth: 0,
    borderRadius: 0,
    shadow: "none",
    align: "stretch",
    widthMode: "full",
    children,
  });
}

/** Halaman baru: kosong (pengguna wajib membuat section dulu). */
export function createDefaultPageDoc(): PageDoc {
  return { version: 2, root: createPageRoot() };
}

export function createSectionFromPreset(preset: SectionPreset | string): BoxNode | null {
  const p = typeof preset === "string" ? getSectionPreset(preset) : preset;
  // Struktur asli preset (preset dasar: kerangka tanpa contoh isi).
  return p ? (p.buildEmpty?.() ?? p.build()) : null;
}

/**
 * Kerangka kosong dari preset: Section → Row → kolom tetap (layout, latar,
 * padding ikut), tetapi tanpa elemen contoh. Grup di dalam kolom yang menjadi
 * kosong dibuang supaya tidak menyisakan kotak tak berguna.
 */
export function emptySection(section: BoxNode): BoxNode {
  const strip = (b: BoxNode, depth: number): BoxNode => {
    const kids = b.children
      .filter(isBox)
      .map((c) => strip(c, depth + 1))
      .filter((c) => depth < 2 || c.children.length > 0);
    return { ...b, children: kids };
  };
  return strip(section, 0);
}

/** Section baru dari preset: kerangka kosong (bawaan) atau lengkap dengan contoh isi. */
export function createSectionForEditor(preset: SectionPreset | string, withContent = false): BoxNode | null {
  const p = typeof preset === "string" ? getSectionPreset(preset) : preset;
  return p ? presetTree(p, withContent) : null;
}

/** Pohon yang ditambahkan preset — sama persis dengan yang digambar thumbnail-nya. */
export function presetTree(p: SectionPreset, withContent: boolean): BoxNode {
  if (withContent) return p.build();
  return p.buildEmpty ? p.buildEmpty() : emptySection(p.build());
}

/* ------------------------------ Row -------------------------------- */

export interface RowVariant {
  id: string;
  name: string;
  description: string;
  /** Perbandingan lebar kolom (untuk thumbnail); kosong = Row "Sejajar". */
  fr: number[];
  build: () => BoxNode;
}

/**
 * Varian Row = 20 struktur kolom ala Divi (lihat sectionTypes.ts) + "Sejajar".
 * ID "1"–"4" tetap sama dengan versi sebelumnya (payload drag lama tetap valid).
 */
export const ROW_VARIANTS: RowVariant[] = [
  ...COLUMN_LAYOUTS.map((l) => ({
    id: l.id,
    name: l.fr.length === 1 ? "1 Kolom" : fractionLabel(l.fr),
    description: l.fr.length === 1 ? "Isi ditumpuk ke bawah." : `${l.fr.length} kolom: ${fractionLabel(l.fr)}.`,
    fr: l.fr,
    build: () => createColumnRow(l.id)!,
  })),
  {
    id: "sejajar",
    name: "Sejajar",
    description: "Elemen berjajar ke samping (flex row).",
    fr: [],
    build: () => createRow({ name: "Row Sejajar", layout: "row", align: "center", wrap: true, stackOnMobile: false }),
  },
];

export function createRowVariant(id: string): BoxNode | null {
  return ROW_VARIANTS.find((v) => v.id === id)?.build() ?? null;
}

/* ------------------------------ aturan ----------------------------- */

function containsSection(n: ComponentNode): boolean {
  let found = false;
  walk(n, (x) => {
    if (isSection(x)) found = true;
  });
  return found;
}

function containsRow(n: ComponentNode): boolean {
  let found = false;
  walk(n, (x) => {
    if (isRow(x)) found = true;
  });
  return found;
}

/**
 * Boleh menaruh `node` TEPAT sebagai anak `parentId`?
 *   root     → hanya section
 *   section  → hanya Row
 *   lainnya  → elemen / kontainer biasa (bukan section, bukan Row)
 * (`placeNode` melengkapi ini: konten yang dijatuhkan ke section dibungkus Row otomatis.)
 */
export function canInsertInto(root: BoxNode, parentId: string, node: ComponentNode): boolean {
  const parent = findNode(root, parentId);
  if (!parent || !isBox(parent)) return false;
  if (parentId === root.id) return isSection(node);
  if (isSection(node)) return false;
  if (isSection(parent)) return isRow(node);
  return !isRow(node) && !containsSection(node) && !containsRow(node);
}

/** Section yang memuat node (atau node itu sendiri bila section). */
export function sectionOf(root: BoxNode, id: string): BoxNode | null {
  let cur: ComponentNode | null = findNode(root, id);
  while (cur) {
    if (isBox(cur) && cur.section && cur.id !== root.id) return cur;
    const loc = findParent(root, cur.id);
    cur = loc ? loc.parent : null;
  }
  return null;
}

/** Row yang memuat node (atau node itu sendiri bila Row). */
export function rowOf(root: BoxNode, id: string): BoxNode | null {
  let cur: ComponentNode | null = findNode(root, id);
  while (cur) {
    if (isRow(cur)) return cur as BoxNode;
    if (isSection(cur)) return null;
    const loc = findParent(root, cur.id);
    cur = loc ? loc.parent : null;
  }
  return null;
}

/** Anak langsung `ancestorId` yang memuat `id` (atau `id` sendiri bila anak langsung). */
function childOnPath(root: BoxNode, ancestorId: string, id: string): ComponentNode | null {
  const anc = findNode(root, ancestorId);
  if (!anc || !isBox(anc)) return null;
  return anc.children.find((c) => c.id === id || (isBox(c) && !!findNode(c, id))) ?? null;
}

export interface Placed {
  root: BoxNode;
  /** Id node yang disisipkan (null bila gagal). */
  id: string | null;
}

/**
 * Sisipkan `node` dengan menjaga hierarki Section → Row → Element:
 *   - konten (elemen / kontainer) yang dijatuhkan ke SECTION dibungkus Row baru;
 *   - Row yang dijatuhkan ke dalam Row/kontainer naik jadi saudara Row itu
 *     (tepat di bawah Row yang memuatnya);
 *   - section hanya masuk ke root.
 */
export function placeNode(root: BoxNode, parentId: string, index: number, node: ComponentNode): Placed {
  const fail: Placed = { root, id: null };
  const parent = findNode(root, parentId);
  if (!parent || !isBox(parent)) return fail;

  if (isSection(node)) {
    return parentId === root.id ? { root: insertNode(root, parentId, index, node), id: node.id } : fail;
  }
  if (parentId === root.id) return fail;

  if (isRow(node)) {
    if (isSection(parent)) return { root: insertNode(root, parentId, index, node), id: node.id };
    const sec = sectionOf(root, parentId);
    if (!sec) return fail;
    const anchor = childOnPath(root, sec.id, parentId);
    const at = anchor ? sec.children.indexOf(anchor) + 1 : sec.children.length;
    return { root: insertNode(root, sec.id, at, node), id: node.id };
  }

  if (isSection(parent)) {
    const row = createRow({ children: [node] });
    return { root: insertNode(root, parentId, index, row), id: node.id };
  }
  return canInsertInto(root, parentId, node)
    ? { root: insertNode(root, parentId, index, node), id: node.id }
    : fail;
}

/* --------------------- tambah "tepat di bawah" ---------------------- */

/** Wadah yang menata anaknya ke samping (grid / baris sejajar). */
const sideways = (b: BoxNode) => b.layout === "grid" || b.layout === "row";

/** Kotak polos tanpa latar & garis = kolom/wadah, bukan kartu. */
const plainBox = (b: BoxNode) => !b.bgEnabled && !b.borderWidth && !sideways(b);

/**
 * Titik sisip untuk (+) "tambah di bawah" node `id`. Hasilnya SELALU
 * menumpuk ke bawah, tidak pernah menjadi kolom baru di sampingnya:
 *   - induknya menumpuk (stack/blok)  → saudara berikutnya di induk itu;
 *   - kolom polos di grid/baris       → akhir isi kolom itu;
 *   - elemen/kartu di grid/baris      → `wrapId`: dibungkus Stack dulu,
 *                                       konten baru masuk di bawahnya.
 * null = bukan target "di bawah" (section, Row, atau anak root).
 */
export type BelowSpot = { parentId: string; index: number } | { wrapId: string };

export function belowSpot(root: BoxNode, id: string): BelowSpot | null {
  const node = findNode(root, id);
  const loc = findParent(root, id);
  if (!node || !loc || loc.parent.id === root.id || isSection(node) || isRow(node)) return null;
  if (!sideways(loc.parent)) return { parentId: loc.parent.id, index: loc.index + 1 };
  if (isBox(node) && plainBox(node)) return { parentId: node.id, index: node.children.length };
  return { wrapId: id };
}

/** Bungkus node `id` dengan grup Stack lalu taruh `node` tepat di bawahnya. */
export function placeBelowWrapped(root: BoxNode, id: string, node: ComponentNode): Placed {
  const wrapped = wrapInBox(root, id, "stack");
  const boxId = wrapped.boxId;
  if (!boxId) return { root, id: null };
  // Kolom/kotak yang dibungkus tetap selebar jalurnya (tanpa ini kolom kosong menyusut ke 0).
  const original = findNode(root, id);
  const base = original && isBox(original) ? updateNode(wrapped.root, boxId, (b) => ({ ...b, align: "stretch" as const })) : wrapped.root;
  const placed = placeNode(base, boxId, 1, node);
  return placed.id ? placed : { root, id: null };
}

/**
 * Salin node lalu taruh salinannya TEPAT DI BAWAH aslinya (seperti Divi):
 * section/Row/Row dalam/modul di wadah menumpuk → saudara berikutnya;
 * kolom atau modul di grid/baris sejajar → aslinya dibungkus Stack dan
 * salinan masuk di bawahnya (tidak pernah menjadi kolom baru di samping).
 */
export function duplicateBelow(root: BoxNode, id: string): { root: BoxNode; newId: string | null } {
  const node = findNode(root, id);
  const loc = findParent(root, id);
  if (!node || !loc || id === root.id) return { root, newId: null };
  if (!sideways(loc.parent) || isSection(node) || isRow(node)) return duplicateNode(root, id);
  const copy = cloneNode(node);
  copy.name = `${node.name} (salinan)`;
  const placed = placeBelowWrapped(root, id, copy);
  return placed.id ? { root: placed.root, newId: placed.id } : { root, newId: null };
}

/* ------------------------- Row dalam (spesialisasi) ------------------------ */

export const isInnerRow = (n: ComponentNode | null | undefined): boolean => !!n && isBox(n) && !!n.innerRow;

/** Kolom spesial = kotak yang berisi Row dalam. */
const isSpecialtyColumn = (n: ComponentNode) => isBox(n) && n.children.some(isInnerRow);

/**
 * Bila `id` berada di kolom spesial: posisi untuk Row dalam baru —
 * tepat di bawah Row dalam yang memuat `id`, atau di akhir kolom spesial.
 */
export function innerRowSpot(root: BoxNode, id: string): { columnId: string; index: number } | null {
  let cur = findNode(root, id);
  while (cur && cur.id !== root.id && !isSection(cur)) {
    if (isSpecialtyColumn(cur)) return { columnId: cur.id, index: (cur as BoxNode).children.length };
    const loc = findParent(root, cur.id);
    if (!loc) return null;
    if (isInnerRow(cur)) return { columnId: loc.parent.id, index: loc.index + 1 };
    cur = loc.parent;
  }
  return null;
}

/** Row dalam baru dengan struktur kolom `variantId` di kolom spesial. */
export function placeInnerRow(root: BoxNode, id: string, variantId: string): Placed {
  const spot = innerRowSpot(root, id);
  const v = ROW_VARIANTS.find((x) => x.id === variantId);
  if (!spot || !v) return { root, id: null };
  const col = findNode(root, spot.columnId) as BoxNode;
  const n = col.children.filter(isInnerRow).length + 1;
  const row = createInnerRow(v.fr.length ? v.fr : [1], n);
  return { root: insertNode(root, spot.columnId, spot.index, row), id: row.id };
}

/** Pindahkan node yang sudah ada dengan aturan `placeNode`. */
export function movePageNode(root: BoxNode, id: string, parentId: string, index: number): BoxNode {
  if (!canMoveInto(root, id, parentId)) return root;
  const loc = findParent(root, id);
  const node = findNode(root, id);
  if (!loc || !node) return root;
  let at = index;
  if (loc.parent.id === parentId && loc.index < index) at -= 1;
  if (loc.parent.id === parentId && at === loc.index && (isSection(node) || isRow(node) || !isSection(loc.parent)))
    return root;
  const removed = removeNode(root, id);
  const placed = placeNode(removed, parentId, at, node);
  return placed.id ? placed.root : root;
}

/* --------------------------- normalisasi --------------------------- */

const DEFAULT_SECTION = () => createSectionFromPreset("single")!;

/** Properti susunan anak yang diwariskan Row saat section lama (flex/grid) dimigrasi. */
function layoutOf(b: BoxNode): Partial<BoxNode> {
  return {
    layout: b.layout === "block" ? "stack" : b.layout,
    gap: b.gap,
    wrap: b.wrap,
    columns: b.columns,
    areas: b.areas,
    align: b.align === "stretch" && b.layout === "stack" ? "start" : b.align,
    justify: b.justify,
    stackOnMobile: b.stackOnMobile,
  };
}

/**
 * Section → pasti blok, anak-anaknya pasti Row. Section lama (layout flex/grid
 * dengan elemen/kolom langsung di dalamnya) dimigrasi: section jadi blok dan
 * isinya dibungkus satu Row yang mewarisi susunan lama — tampilan tetap sama.
 */
function normalizeSection(sec: BoxNode): BoxNode {
  const clean = (n: ComponentNode): ComponentNode => {
    if (!isBox(n)) return n;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { section: _s, row: _r, ...rest } = n;
    return { ...rest, children: n.children.map(clean) };
  };
  const mapRow = (r: BoxNode): BoxNode => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { section: _s, ...rest } = r;
    return { ...rest, row: true, children: r.children.map(clean) };
  };

  const kids = sec.children;
  const hasStray = kids.some((c) => !isRow(c));
  if (!hasStray && sec.layout !== "block" && kids.length === 0) {
    return { ...sec, layout: "block", children: [] };
  }
  if (!hasStray) return { ...sec, children: kids.map((c) => mapRow(c as BoxNode)) };

  const inherit = layoutOf(sec);
  const rows: BoxNode[] = [];
  let run: ComponentNode[] = [];
  const flush = () => {
    if (!run.length) return;
    rows.push(createRow({ ...inherit, padding: 0, children: run.map(clean) }));
    run = [];
  };
  for (const c of kids) {
    if (isRow(c)) {
      flush();
      rows.push(mapRow(c as BoxNode));
    } else run.push(c);
  }
  flush();
  return { ...sec, layout: "block", gap: 0, children: rows };
}

/** Paksa struktur valid. Tidak membuang elemen: yang nyasar dibungkus section + Row. */
export function enforcePageStructure(root: BoxNode): BoxNode {
  const next: BoxNode[] = [];
  let strays: ComponentNode[] = [];
  const flush = () => {
    if (!strays.length) return;
    const s = DEFAULT_SECTION();
    s.children = [createRow({ children: strays })];
    next.push(s);
    strays = [];
  };
  for (const c of root.children) {
    if (isBox(c) && c.section) {
      flush();
      next.push(normalizeSection(c));
    } else if (isBox(c)) {
      // Kontainer biasa di root → jadi section (gaya & isinya dipertahankan).
      flush();
      next.push(normalizeSection({ ...c, row: undefined, tag: c.tag ?? "section", section: DEFAULT_SECTION().section }));
    } else {
      strays.push(c);
    }
  }
  flush();
  return { ...root, children: next };
}


/** Asal desain yang valid (ID template katalog) atau undefined. */
function sanitizeSource(v: unknown): DocSource | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as { templateId?: unknown; version?: unknown };
  if (typeof o.templateId !== "string" || !/^[a-z0-9-]{1,64}$/.test(o.templateId)) return undefined;
  return typeof o.version === "number" && Number.isFinite(o.version) ? { templateId: o.templateId, version: o.version } : { templateId: o.templateId };
}

/** Template asal sebuah desain halaman (null = desain dari nol). */
export const docTemplateId = (doc: PageDoc | null | undefined): string | null => doc?.source?.templateId ?? null;

/** State tersimpan apa pun → PageDoc valid. Tidak pernah melempar. */
export function normalizePageDoc(saved: unknown): PageDoc {
  try {
    if (saved && typeof saved === "object" && Array.isArray((saved as { items?: unknown }).items)) {
      return migrateLegacyPage(saved as { items: unknown[] });
    }
    const looksValid =
      !!saved && typeof saved === "object" && (saved as { version?: unknown }).version === 2;
    if (!looksValid) return createDefaultPageDoc();
    const doc = normalizeDoc(saved);
    const root: BoxNode = {
      ...doc.root,
      id: ROOT_ID,
      name: doc.root.name && doc.root.name !== "Stack" ? doc.root.name : "Halaman",
      tag: doc.root.tag ?? "main",
      section: undefined,
    };
    const source = sanitizeSource((saved as { source?: unknown }).source);
    return source ? { version: 2, root: enforcePageStructure(root), source } : { version: 2, root: enforcePageStructure(root) };
  } catch {
    return createDefaultPageDoc();
  }
}

/** Elemen lama `{ elementType, name, snapshot }` → ElementNode (null bila tipe tak dikenal). */
function legacyElement(v: unknown): ComponentNode | null {
  if (!v || typeof v !== "object") return null;
  const o = v as { elementType?: unknown; name?: unknown; snapshot?: unknown };
  if (typeof o.elementType !== "string") return null;
  const doc = normalizeDoc({
    version: 2,
    root: { kind: "box", children: [{ kind: "element", elementType: o.elementType, name: o.name, state: o.snapshot }] },
  });
  return doc.root.children.find((n) => n.kind === "element") ?? null;
}

/** Format Page Maker lama: `items[]` berisi section / component / elemen (snapshot). */
function migrateLegacyPage(old: { items: unknown[] }): PageDoc {
  const sections: BoxNode[] = [];
  for (const raw of old.items.slice(0, 200)) {
    const c = (raw as { content?: Record<string, unknown> } | null)?.content;
    if (!c || typeof c.elementType !== "string") continue;
    const name = typeof c.name === "string" ? c.name : "Section";
    const sec = DEFAULT_SECTION();
    sec.name = name.slice(0, 60);
    const row = createRow();
    sec.children = [row];
    const snap = (c.snapshot ?? {}) as { version?: unknown; slots?: Record<string, unknown> };
    if (c.elementType === "component" && snap.version === 2) {
      row.children.push(...normalizeDoc(snap).root.children);
    } else if (c.elementType === "component" || c.elementType === "section") {
      // Component/section format lama (templateId + slots): elemen tiap slot dipindah ke Row.
      for (const slot of Object.values(snap.slots ?? {})) {
        const el = legacyElement(slot);
        if (el) row.children.push(el);
      }
    } else {
      const el = legacyElement(c);
      if (el) row.children.push(el);
    }
    sections.push(sec);
  }
  return { version: 2, root: createPageRoot(sections) };
}

export { createRow, isRow };
