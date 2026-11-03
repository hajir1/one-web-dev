import { useCallback, useMemo, useReducer, type SetStateAction } from "react";
import type { BoxNode, ComponentDoc } from "./componentTypes";

/* ================================================================== */
/* State dokumen + riwayat (undo / redo)                                */
/*                                                                    */
/* Perubahan beruntun pada properti yang sama (mengetik, menggeser      */
/* slider) digabung jadi satu langkah undo lewat `key`.                 */
/* ================================================================== */

const LIMIT = 80;
const COALESCE_MS = 900;

interface History {
  past: ComponentDoc[];
  present: ComponentDoc;
  future: ComponentDoc[];
  lastKey: string | null;
  lastAt: number;
}

type Action =
  | { type: "set"; next: (d: ComponentDoc) => ComponentDoc; key?: string; at: number }
  | { type: "undo" }
  | { type: "redo" }
  | { type: "reset"; doc: ComponentDoc };

function reducer(h: History, a: Action): History {
  switch (a.type) {
    case "set": {
      const next = a.next(h.present);
      if (next === h.present) return h;
      if (a.key && a.key === h.lastKey && a.at - h.lastAt < COALESCE_MS) {
        return { ...h, present: next, lastAt: a.at, future: [] };
      }
      return {
        past: [...h.past.slice(-(LIMIT - 1)), h.present],
        present: next,
        future: [],
        lastKey: a.key ?? null,
        lastAt: a.at,
      };
    }
    case "undo": {
      if (!h.past.length) return h;
      const prev = h.past[h.past.length - 1];
      return {
        past: h.past.slice(0, -1),
        present: prev,
        future: [h.present, ...h.future],
        lastKey: null,
        lastAt: 0,
      };
    }
    case "redo": {
      if (!h.future.length) return h;
      const [next, ...rest] = h.future;
      return {
        past: [...h.past, h.present],
        present: next,
        future: rest,
        lastKey: null,
        lastAt: 0,
      };
    }
    case "reset":
      return { past: [], present: a.doc, future: [], lastKey: null, lastAt: 0 };
  }
}

export function useComponentDoc(initial: () => ComponentDoc) {
  const [h, dispatch] = useReducer(reducer, undefined, () => ({
    past: [],
    present: initial(),
    future: [],
    lastKey: null,
    lastAt: 0,
  }));

  /** Ubah pohon. `key` menggabungkan perubahan beruntun jadi satu langkah undo. */
  const editRoot = useCallback(
    (fn: (root: BoxNode) => BoxNode, key?: string) =>
      dispatch({
        type: "set",
        key,
        at: Date.now(),
        next: (d) => {
          const root = fn(d.root);
          return root === d.root ? d : { ...d, root };
        },
      }),
    [],
  );

  /** Setter bergaya useState — untuk useDesignSaver (memuat / desain baru, bisa di-undo). */
  const setDoc = useCallback(
    (action: SetStateAction<ComponentDoc>) =>
      dispatch({
        type: "set",
        at: Date.now(),
        next: (d) => (typeof action === "function" ? action(d) : action),
      }),
    [],
  );

  const undo = useCallback(() => dispatch({ type: "undo" }), []);
  const redo = useCallback(() => dispatch({ type: "redo" }), []);
  const reset = useCallback((doc: ComponentDoc) => dispatch({ type: "reset", doc }), []);

  return useMemo(
    () => ({
      doc: h.present,
      editRoot,
      setDoc,
      undo,
      redo,
      reset,
      canUndo: h.past.length > 0,
      canRedo: h.future.length > 0,
    }),
    [h, editRoot, setDoc, undo, redo, reset],
  );
}
