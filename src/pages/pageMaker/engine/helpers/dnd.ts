import type { DragEvent } from "react";
import type { BoxLayout, NodeId } from "./componentTypes";

/* ================================================================== */
/* Drag & drop — payload dan perhitungan posisi jatuh                   */
/* ================================================================== */

const DND_MIME = "application/x-component-maker";

export type DragPayload =
  /** Memindahkan node yang sudah ada di pohon. */
  | { kind: "node"; id: NodeId }
  /** Elemen dari pustaka (desain tersimpan atau bawaan). */
  | { kind: "element"; elementType: string }
  /** Kontainer kosong baru. */
  | { kind: "box"; layout: BoxLayout }
  /** Preset section baru — Page Maker. */
  | { kind: "section"; presetId: string }
  /** Row baru (Section → Row → Element) — Page Maker. */
  | { kind: "row"; variant: string };

// dataTransfer.getData() tidak bisa dibaca saat dragover (hanya saat drop),
// jadi payload yang sedang diseret disimpan di sini.
let current: DragPayload | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

/** Untuk `useSyncExternalStore`: tahu kapan ada seretan aktif. */
export function subscribeDrag(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
export const getDragSnapshot = () => current;

export function startDrag(e: DragEvent, payload: DragPayload, label: string) {
  current = payload;
  // Ditunda: mengubah DOM saat dragstart bisa membatalkan seretan di beberapa browser.
  setTimeout(notify, 0);
  e.dataTransfer.effectAllowed = payload.kind === "node" ? "move" : "copy";
  try {
    e.dataTransfer.setData(DND_MIME, JSON.stringify(payload));
    e.dataTransfer.setData("text/plain", label);
  } catch {
    /* beberapa browser membatasi setData; payload tetap tersedia lewat `current` */
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

/** Letak jatuh: sisipkan di `parentId` pada `index`. */
export interface DropTarget {
  parentId: NodeId;
  index: number;
  /** Baris pohon yang jadi acuan visual + jenis penanda. */
  rowId: NodeId | "end";
  mode: "before" | "after" | "inside" | "first-child" | "end";
  /** Kedalaman garis penanda (indentasi). */
  depth: number;
}

export interface TreeRowInfo {
  id: NodeId;
  isBox: boolean;
  isRoot: boolean;
  depth: number;
  parentId: NodeId | null;
  /** Posisi di daftar anak induknya. */
  index: number;
  childCount: number;
  expanded: boolean;
}

/**
 * Dari baris yang sedang di-hover + posisi pointer (0..1 dari atas baris)
 * tentukan letak jatuhnya. Aturannya mengikuti editor layer pada umumnya:
 *  - baris elemen: separuh atas = sebelum, separuh bawah = sesudah
 *  - baris box:    25% atas = sebelum, 25% bawah = sesudah (atau anak pertama
 *                  kalau sedang terbuka), tengah = masuk ke dalam (di akhir)
 *  - root: selalu masuk ke dalam (di akhir)
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
