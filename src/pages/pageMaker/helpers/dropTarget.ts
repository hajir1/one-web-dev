import { isBox, type BoxNode, type ComponentNode, type NodeId } from "../engine/helpers/componentTypes";
import { findNode, isDescendant } from "../engine/helpers/tree";
import type { DragPayload } from "../engine/helpers/dnd";
import { isRow, isSection } from "./pageDoc";

/* ================================================================== */
/* Menentukan tempat jatuh di canvas dari posisi pointer                */
/*                                                                    */
/* Fungsi murni: input = pohon + kotak (rect) tiap node yang dilaporkan  */
/* iframe + posisi pointer; output = induk, indeks sisip, dan geometri   */
/* penanda untuk digambar.                                              */
/* ================================================================== */

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}
export type RectMap = Record<NodeId, Rect>;

export interface DropResolution {
  parentId: NodeId;
  /** Indeks sisip (sebelum node yang dipindah dicabut — sama seperti moveNode). */
  index: number;
  /** "line" = garis sisip; "box" = seluruh kontainer disorot (kosong / append). */
  indicator: { kind: "line" | "box"; rect: Rect };
}

const inside = (r: Rect, x: number, y: number) => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
const dist = (r: Rect, x: number, y: number) => {
  const dx = Math.max(r.x - x, 0, x - (r.x + r.w));
  const dy = Math.max(r.y - y, 0, y - (r.y + r.h));
  return Math.hypot(dx, dy);
};

/** Apakah payload ini sebuah section (dan karenanya hanya boleh jatuh di root)? */
function payloadIsSection(root: BoxNode, payload: DragPayload): boolean {
  if (payload.kind === "section") return true;
  if (payload.kind === "node") {
    const n = findNode(root, payload.id);
    return !!n && isSection(n);
  }
  return false;
}

/** Apakah payload ini sebuah Row (hanya boleh jatuh di antara Row dalam section)? */
function payloadIsRow(root: BoxNode, payload: DragPayload): boolean {
  if (payload.kind === "row") return true;
  if (payload.kind === "node") {
    const n = findNode(root, payload.id);
    return !!n && isRow(n);
  }
  return false;
}

export function resolveDrop(
  root: BoxNode,
  rects: RectMap,
  pt: { x: number; y: number },
  payload: DragPayload,
): DropResolution | null {
  const dragged: ComponentNode | null = payload.kind === "node" ? findNode(root, payload.id) : null;
  if (payload.kind === "node" && (!dragged || dragged.id === root.id)) return null;

  /* ---------- mode section: hanya di antara section ---------- */
  if (payloadIsSection(root, payload)) {
    const secs = root.children.filter((c) => rects[c.id]);
    if (!secs.length) {
      const pageRect = rects[root.id] ?? { x: 0, y: 0, w: 0, h: 0 };
      return { parentId: root.id, index: 0, indicator: { kind: "box", rect: pageRect } };
    }
    let index = secs.length;
    for (let i = 0; i < secs.length; i++) {
      const r = rects[secs[i].id];
      if (pt.y < r.y + r.h / 2) {
        index = i;
        break;
      }
    }
    // `index` dihitung terhadap daftar bersih; petakan ke indeks anak sebenarnya.
    const realIndex = index < secs.length ? root.children.indexOf(secs[index]) : root.children.length;
    const width = Math.max(...secs.map((c) => rects[c.id].x + rects[c.id].w));
    const y =
      index < secs.length ? rects[secs[index].id].y : rects[secs[secs.length - 1].id].y + rects[secs[secs.length - 1].id].h;
    return {
      parentId: root.id,
      index: realIndex,
      indicator: { kind: "line", rect: { x: 0, y: y - 2, w: width, h: 4 } },
    };
  }

  /* ---------- mode Row: di antara Row dalam satu section ---------- */
  if (payloadIsRow(root, payload)) {
    const secs = root.children.filter((c) => isBox(c) && rects[c.id]) as BoxNode[];
    if (!secs.length) return null;
    let sec: BoxNode | null = null;
    for (const s of secs) if (inside(rects[s.id], pt.x, pt.y)) sec = s;
    if (!sec) {
      let best = Infinity;
      for (const s of secs) {
        const d = dist(rects[s.id], pt.x, pt.y);
        if (d < best) {
          best = d;
          sec = s;
        }
      }
    }
    if (!sec) return null;
    const rows = sec.children.filter((c) => rects[c.id] && c.id !== dragged?.id);
    const sr = rects[sec.id];
    if (!rows.length) {
      return { parentId: sec.id, index: sec.children.length, indicator: { kind: "box", rect: sr } };
    }
    let index = rows.length;
    for (let i = 0; i < rows.length; i++) {
      const r = rects[rows[i].id];
      if (pt.y < r.y + r.h / 2) {
        index = i;
        break;
      }
    }
    const last = rects[rows[rows.length - 1].id];
    const y = index < rows.length ? rects[rows[index].id].y : last.y + last.h;
    const real = index < rows.length ? sec.children.indexOf(rows[index]) : sec.children.length;
    return {
      parentId: sec.id,
      index: real,
      indicator: { kind: "line", rect: { x: sr.x, y: y - 2, w: sr.w, h: 4 } },
    };
  }

  /* ---------- mode isi: kontainer terdalam di bawah pointer ---------- */
  const depth: Record<NodeId, number> = {};
  const boxes: BoxNode[] = [];
  const visit = (n: ComponentNode, d: number) => {
    if (isBox(n)) {
      depth[n.id] = d;
      boxes.push(n);
      n.children.forEach((c) => visit(c, d + 1));
    }
  };
  visit(root, 0);

  const allowed = (b: BoxNode) => {
    if (b.id === root.id) return false; // root hanya menerima section
    if (!rects[b.id]) return false;
    if (dragged && (dragged.id === b.id || (isBox(dragged) && isDescendant(dragged, b.id)))) return false;
    return true;
  };

  let target: BoxNode | null = null;
  for (const b of boxes) {
    if (!allowed(b) || !inside(rects[b.id], pt.x, pt.y)) continue;
    if (!target || depth[b.id] > depth[target.id]) target = b;
  }
  if (!target) {
    // Di luar semua kontainer (celah antar section): pakai section terdekat.
    let best = Infinity;
    for (const s of root.children) {
      if (!isBox(s) || !allowed(s)) continue;
      const d = dist(rects[s.id], pt.x, pt.y);
      if (d < best) {
        best = d;
        target = s;
      }
    }
  }
  if (!target) return null;
  // Konten yang jatuh di section dibungkus Row otomatis (placeNode); Row/section tak boleh masuk konten.
  if (dragged && (isSection(dragged) || isRow(dragged))) return null;

  const kids = target.children.filter((c) => rects[c.id]);
  if (!kids.length) {
    return {
      parentId: target.id,
      index: target.children.length,
      indicator: { kind: "box", rect: rects[target.id] },
    };
  }

  // Anak terdekat → sisip sebelum/sesudahnya menurut sumbu layout.
  let near = kids[0];
  let nd = Infinity;
  for (const k of kids) {
    const d = dist(rects[k.id], pt.x, pt.y);
    if (d < nd) {
      nd = d;
      near = k;
    }
  }
  const r = rects[near.id];
  const horizontal =
    target.layout === "row"
      ? true
      : target.layout === "stack" || target.layout === "block"
        ? false
        : pt.y >= r.y && pt.y <= r.y + r.h;
  const before = horizontal ? pt.x < r.x + r.w / 2 : pt.y < r.y + r.h / 2;
  const at = target.children.indexOf(near);
  return {
    parentId: target.id,
    index: before ? at : at + 1,
    indicator: {
      kind: "line",
      rect: horizontal
        ? { x: (before ? r.x : r.x + r.w) - 2, y: r.y, w: 4, h: r.h }
        : { x: r.x, y: (before ? r.y : r.y + r.h) - 2, w: r.w, h: 4 },
    },
  };
}


