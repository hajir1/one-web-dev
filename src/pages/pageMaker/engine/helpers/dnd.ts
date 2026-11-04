import type { DragEvent } from "react";
import type { BoxLayout, NodeId } from "./componentTypes";

/* ================================================================== */
/* Drag & drop — payload and drop position calculation                  */
/* ================================================================== */

const DND_MIME = "application/x-component-maker";

export type DragPayload =
  /** Moves a node that is already in the tree. */
  | { kind: "node"; id: NodeId }
  /** An element from the library (saved or built-in design). */
  | { kind: "element"; elementType: string }
  /** A new empty container. */
  | { kind: "box"; layout: BoxLayout }
  /** New section preset — Page Maker. */
  | { kind: "section"; presetId: string }
  /** New row (Section → Row → Element) — Page Maker. */
  | { kind: "row"; variant: string };

// dataTransfer.getData() cannot be read during dragover (only on drop),
// so the payload being dragged is stored here.
let current: DragPayload | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/** For `useSyncExternalStore`: knows when a drag is active. */
export function subscribeDrag(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getDragSnapshot = () => current;

export function startDrag(e: DragEvent, payload: DragPayload, label: string) {
  current = payload;
  // Deferred: changing the DOM during dragstart can cancel the drag in some browsers.
  setTimeout(notify, 0);
  e.dataTransfer.effectAllowed = payload.kind === "node" ? "move" : "copy";
  try {
    e.dataTransfer.setData(DND_MIME, JSON.stringify(payload));
    e.dataTransfer.setData("text/plain", label);
  } catch {
    /* some browsers restrict setData; the payload is still available through `current` */
  }
}

export function endDrag() {
  current = null;
  notify();
}

export function currentDrag(e?: DragEvent): DragPayload | null {
  if (current) return current;
  if (!e) return null;
  try {
    const raw = e.dataTransfer.getData(DND_MIME);
    return raw ? (JSON.parse(raw) as DragPayload) : null;
  } catch {
    return null;
  }
}

/** Drop location: insert into `parentId` at `index`. */
export interface DropTarget {
  parentId: NodeId;
  index: number;
  /** The tree row used as the visual reference + the marker kind. */
  rowId: NodeId | "end";
  mode: "before" | "after" | "inside" | "first-child" | "end";
  /** Marker line depth (indentation). */
  depth: number;
}

export interface TreeRowInfo {
  id: NodeId;
  isBox: boolean;
  isRoot: boolean;
  depth: number;
  parentId: NodeId | null;
  /** Position in the parent's child list. */
  index: number;
  childCount: number;
  expanded: boolean;
}

/**
 * From the hovered row + the pointer position (0..1 from the top of the row),
 * decides the drop location. The rules follow typical layer editors:
 *  - element row: top half = before, bottom half = after
 *  - box row:     top 25% = before, bottom 25% = after (or first child
 *                  when it is expanded), middle = inside (at the end)
 *  - root: always inside (at the end)
 */
export function dropForRow(row: TreeRowInfo, ratio: number): DropTarget {
  if (row.isRoot) {
    return { parentId: row.id, index: row.childCount, rowId: row.id, mode: "inside", depth: row.depth + 1 };
  }
  const before: DropTarget = {
    parentId: row.parentId!,
    index: row.index,
    rowId: row.id,
    mode: "before",
    depth: row.depth,
  };
  const after: DropTarget = {
    parentId: row.parentId!,
    index: row.index + 1,
    rowId: row.id,
    mode: "after",
    depth: row.depth,
  };
  if (!row.isBox) return ratio < 0.5 ? before : after;
  if (ratio < 0.25) return before;
  if (ratio > 0.75) {
    return row.expanded && row.childCount > 0
      ? { parentId: row.id, index: 0, rowId: row.id, mode: "first-child", depth: row.depth + 1 }
      : after;
  }
  return { parentId: row.id, index: row.childCount, rowId: row.id, mode: "inside", depth: row.depth + 1 };
}
