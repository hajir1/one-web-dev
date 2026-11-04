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
/* Tree operations — pure & immutable (return a new root)               */
/* ================================================================== */

export const LAYOUT_LABEL: Record<BoxLayout, string> = {
  stack: "Stack (vertikal)",
  row: "Baris (horizontal)",
  grid: "Grid",
  block: "Normal (blok)",
};

export const newNodeId = (): NodeId => `n-${makeId()}`;

/** A new box. `parentLayout` sets a sensible default width within its parent. */
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

/** Default root: a white card with rounded corners (same as the old Component Maker). */
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

/** Path from the root to the node (inclusive), to expand tree branches. */
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

/** Is `id` a descendant (not itself) of `ancestor`? */
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

/** Replace one node (only its path is copied). */
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

/** Inserts `node` into `parentId` at `index` (clamped). The parent must be a box. */
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

/** Removes a node (the root cannot be removed). */
export function removeNode(root: BoxNode, id: NodeId): BoxNode {
  if (id === root.id) return root;
  const loc = findParent(root, id);
  if (!loc) return root;
  return mapBox(root, loc.parent.id, (b) => ({
    ...b,
    children: b.children.filter((c) => c.id !== id),
  }));
}

/** May `dragId` be dropped into `parentId`? (not the root, not into itself/its descendants) */
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
 * Moves a node. `index` = the position in the target parent's child list BEFORE the node
 * is removed (matches the drop marker line position); the same-parent
 * adjustment is done here.
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
  if (loc.parent.id === parentId && target === loc.index) return root; // unchanged
  return insertNode(removeNode(root, id), parentId, target, node);
}

/** Shifts one step within the same parent (delta -1 = up, +1 = down). */
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

/** A deep copy with new ids. */
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

/** Wraps a node in a new box at the same position. */
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
  // The position in the parent (grow/span) moves to the wrapper; the wrapped content is clean.
  box.place = { ...node.place };
  box.children = [{ ...node, place: {} }];
  const replaced = updateNode(root, loc.parent.id, (p) =>
    isBox(p) ? { ...p, children: p.children.map((c) => (c.id === id ? box : c)) } : p,
  );
  return { root: replaced, boxId: box.id };
}

/** Unwraps a box: its children move up into the parent at the box's position. */
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

/** Ensures there are no duplicate ids (e.g. from corrupt data); replaces the duplicates. */
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
