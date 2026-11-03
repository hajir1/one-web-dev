import { makeId } from "../../core/helpers/makeId";
import {
  isBox,
  ROOT_ID,
  type BoxLayout,
  type BoxNode,
  type ComponentNode,
  type ElementNode,
  type NodeId,
} from "./componentTypes";

/* ================================================================== */
/* Operasi pohon — murni & immutable (mengembalikan root baru)          */
/* ================================================================== */

export const LAYOUT_LABEL: Record<BoxLayout, string> = {
  stack: "Stack (vertikal)",
  row: "Baris (horizontal)",
  grid: "Grid",
  block: "Normal (blok)",
};

export const newNodeId = (): NodeId => `n-${makeId()}`;

/** Box baru. `parentLayout` menentukan lebar bawaan yang masuk akal di induknya. */
export function createBox(
  layout: BoxLayout = "stack",
  patch: Partial<BoxNode> = {},
  parentLayout?: BoxLayout,
): BoxNode {
  const inRow = parentLayout === "row";
  return {
    id: newNodeId(),
    kind: "box",
    name: layout === "stack" ? "Stack" : layout === "row" ? "Baris" : layout === "block" ? "Blok" : "Grid",
    place: inRow ? { grow: true } : {},
    layout,
    gap: 12,
    padding: 0,
    wrap: false,
    columns: "repeat(2, minmax(0, 1fr))",
    areas: "",
    align: layout === "row" ? "center" : "start",
    justify: "start",
    stackOnMobile: layout !== "stack",
    bgEnabled: false,
    bgColor: "#ffffff",
    borderWidth: 0,
    borderColor: "#e5e7eb",
    borderRadius: 0,
    shadow: "none",
    widthMode: inRow ? "auto" : "full",
    width: 320,
    children: [],
    ...patch,
  };
}

/** Root bawaan: kartu putih bersudut membulat (sama seperti Component Maker lama). */
export function createRoot(layout: BoxLayout = "stack", patch: Partial<BoxNode> = {}): BoxNode {
  return createBox(layout, {
    id: ROOT_ID,
    name: "Komponen",
    gap: 16,
    padding: 16,
    bgEnabled: true,
    bgColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    widthMode: "full",
    ...patch,
  });
}

export function createElementNode(
  elementType: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any,
  name: string,
  link?: { designId: string },
): ElementNode {
  return {
    id: newNodeId(),
    kind: "element",
    elementType,
    state,
    name,
    place: {},
    ...(link ? { link } : {}),
  };
}

/* ------------------------------ query ------------------------------ */

export function findNode(root: ComponentNode, id: NodeId): ComponentNode | null {
  if (root.id === id) return root;
  if (isBox(root)) {
    for (const c of root.children) {
      const f = findNode(c, id);
      if (f) return f;
    }
  }
  return null;
}

export function findParent(
  root: BoxNode,
  id: NodeId,
): { parent: BoxNode; index: number } | null {
  for (let i = 0; i < root.children.length; i++) {
    const c = root.children[i];
    if (c.id === id) return { parent: root, index: i };
    if (isBox(c)) {
      const f = findParent(c, id);
      if (f) return f;
    }
  }
  return null;
}

/** Jalur dari root ke node (inklusif) — untuk membuka cabang pohon. */
export function pathTo(root: ComponentNode, id: NodeId): ComponentNode[] {
  if (root.id === id) return [root];
  if (isBox(root)) {
    for (const c of root.children) {
      const p = pathTo(c, id);
      if (p.length) return [root, ...p];
    }
  }
  return [];
}

export function walk(
  node: ComponentNode,
  fn: (n: ComponentNode, parent: BoxNode | null, depth: number) => void,
  parent: BoxNode | null = null,
  depth = 0,
): void {
  fn(node, parent, depth);
  if (isBox(node)) node.children.forEach((c) => walk(c, fn, node, depth + 1));
}

/** `id` adalah turunan (bukan diri sendiri) dari `ancestor`? */
export function isDescendant(ancestor: ComponentNode, id: NodeId): boolean {
  if (!isBox(ancestor)) return false;
  return ancestor.children.some((c) => c.id === id || isDescendant(c, id));
}

export function collectElements(node: ComponentNode): ElementNode[] {
  const out: ElementNode[] = [];
  walk(node, (n) => {
    if (n.kind === "element") out.push(n);
  });
  return out;
}

export const countElements = (root: ComponentNode) => collectElements(root).length;

/* ------------------------------ update ----------------------------- */

/** Ganti satu node (sepanjang jalurnya saja yang disalin). */
export function updateNode(
  root: BoxNode,
  id: NodeId,
  fn: (n: ComponentNode) => ComponentNode,
): BoxNode {
  const go = (n: ComponentNode): ComponentNode => {
    if (n.id === id) return fn(n);
    if (!isBox(n)) return n;
    let changed = false;
    const children = n.children.map((c) => {
      const next = go(c);
      if (next !== c) changed = true;
      return next;
    });
    return changed ? { ...n, children } : n;
  };
  return go(root) as BoxNode;
}

function mapBox(root: BoxNode, id: NodeId, fn: (b: BoxNode) => BoxNode): BoxNode {
  return updateNode(root, id, (n) => (isBox(n) ? fn(n) : n));
}

/** Sisipkan `node` ke `parentId` pada `index` (di-clamp). Induk harus box. */
export function insertNode(
  root: BoxNode,
  parentId: NodeId,
  index: number,
  node: ComponentNode,
): BoxNode {
  return mapBox(root, parentId, (b) => {
    const i = Math.max(0, Math.min(index, b.children.length));
    const children = [...b.children];
    children.splice(i, 0, node);
    return { ...b, children };
  });
}

/** Hapus node (root tidak bisa dihapus). */
export function removeNode(root: BoxNode, id: NodeId): BoxNode {
  if (id === root.id) return root;
  const loc = findParent(root, id);
  if (!loc) return root;
  return mapBox(root, loc.parent.id, (b) => ({
    ...b,
    children: b.children.filter((c) => c.id !== id),
  }));
}

/** Bolehkah `dragId` dijatuhkan ke dalam `parentId`? (bukan root, bukan ke dirinya/turunannya) */
export function canMoveInto(root: BoxNode, dragId: NodeId, parentId: NodeId): boolean {
  if (dragId === root.id) return false;
  const target = findNode(root, parentId);
  if (!target || !isBox(target)) return false;
  if (dragId === parentId) return false;
  const dragged = findNode(root, dragId);
  if (!dragged) return false;
  return !isDescendant(dragged, parentId);
}

/**
 * Pindahkan node. `index` = posisi di daftar anak induk tujuan SEBELUM node
 * dicabut (cocok dengan posisi garis penanda drop); penyesuaian saat satu
 * induk dilakukan di sini.
 */
export function moveNode(
  root: BoxNode,
  id: NodeId,
  parentId: NodeId,
  index: number,
): BoxNode {
  if (!canMoveInto(root, id, parentId)) return root;
  const loc = findParent(root, id);
  const node = findNode(root, id);
  if (!loc || !node) return root;
  let target = index;
  if (loc.parent.id === parentId && loc.index < index) target -= 1;
  if (loc.parent.id === parentId && target === loc.index) return root; // tidak berubah
  return insertNode(removeNode(root, id), parentId, target, node);
}

/** Geser satu langkah dalam induk yang sama (delta -1 = naik, +1 = turun). */
export function moveBy(root: BoxNode, id: NodeId, delta: -1 | 1): BoxNode {
  const loc = findParent(root, id);
  if (!loc) return root;
  const next = loc.index + delta;
  if (next < 0 || next >= loc.parent.children.length) return root;
  return mapBox(root, loc.parent.id, (b) => {
    const children = [...b.children];
    [children[loc.index], children[next]] = [children[next], children[loc.index]];
    return { ...b, children };
  });
}

/* ----------------------------- duplicate --------------------------- */

/** Salinan dalam dengan id baru. */
export function cloneNode<T extends ComponentNode>(node: T): T {
  const copy = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) {
      return { ...n, id: newNodeId(), place: { ...n.place }, children: n.children.map(copy) };
    }
    return {
      ...n,
      id: newNodeId(),
      place: { ...n.place },
      state: JSON.parse(JSON.stringify(n.state ?? {})),
      ...(n.link ? { link: { ...n.link } } : {}),
    };
  };
  return copy(node) as T;
}

export function duplicateNode(root: BoxNode, id: NodeId): { root: BoxNode; newId: NodeId | null } {
  if (id === root.id) return { root, newId: null };
  const loc = findParent(root, id);
  const node = findNode(root, id);
  if (!loc || !node) return { root, newId: null };
  const copy = cloneNode(node);
  copy.name = `${node.name} (salinan)`;
  return { root: insertNode(root, loc.parent.id, loc.index + 1, copy), newId: copy.id };
}

/* ------------------------- grouping (wrap/unwrap) ------------------- */

/** Bungkus node dengan box baru di posisi yang sama. */
export function wrapInBox(
  root: BoxNode,
  id: NodeId,
  layout: BoxLayout = "stack",
): { root: BoxNode; boxId: NodeId | null } {
  if (id === root.id) return { root, boxId: null };
  const loc = findParent(root, id);
  const node = findNode(root, id);
  if (!loc || !node) return { root, boxId: null };
  const box = createBox(layout, { name: "Grup" }, loc.parent.layout);
  // Posisi di induk (grow/span) berpindah ke pembungkus; isi bungkusan bersih.
  box.place = { ...node.place };
  box.children = [{ ...node, place: {} }];
  const replaced = updateNode(root, loc.parent.id, (p) =>
    isBox(p) ? { ...p, children: p.children.map((c) => (c.id === id ? box : c)) } : p,
  );
  return { root: replaced, boxId: box.id };
}

/** Lepas box: anak-anaknya naik ke induk pada posisi box. */
export function unwrapBox(root: BoxNode, id: NodeId): BoxNode {
  if (id === root.id) return root;
  const loc = findParent(root, id);
  const node = findNode(root, id);
  if (!loc || !node || !isBox(node)) return root;
  return mapBox(root, loc.parent.id, (p) => {
    const children = [...p.children];
    children.splice(loc.index, 1, ...node.children);
    return { ...p, children };
  });
}

/* ----------------------------- utilities --------------------------- */

/** Pastikan tidak ada id ganda (mis. dari data korup); ganti yang ganda. */
export function dedupeIds(root: BoxNode): BoxNode {
  const seen = new Set<string>();
  const fix = (n: ComponentNode, isRoot: boolean): ComponentNode => {
    let id = isRoot ? ROOT_ID : n.id;
    if (!id || seen.has(id)) id = newNodeId();
    seen.add(id);
    if (isBox(n)) return { ...n, id, children: n.children.map((c) => fix(c, false)) };
    return { ...n, id };
  };
  return fix(root, true) as BoxNode;
}
