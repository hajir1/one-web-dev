import { ELEMENT_DEFINITION_BY_TYPE } from "../../core/elementDefinitions";
import { isBox, isElement, ROOT_ID, type BoxNode, type ElementNode } from "./componentTypes";
import { resolveElement } from "./resolve";
import { createBox, createRoot, updateNode } from "./tree";
import type { InspectorHandlers } from "../ui/Inspector";

/* ================================================================== */
/* Handler pengeditan properti (Inspector)                              */
/* ================================================================== */

export interface EditDeps {
  editRoot: (fn: (root: BoxNode) => BoxNode, key?: string) => void;
  /** Reset the container to defaults; default: plain box / component root. */
  resetBox?: (box: BoxNode, isRoot: boolean) => BoxNode;
}

const defaultResetBox = (n: BoxNode, isRoot: boolean): BoxNode => {
  const fresh = isRoot ? createRoot(n.layout) : createBox(n.layout);
  return { ...fresh, id: n.id, name: n.name, place: n.place, children: n.children };
};

export function buildEditHandlers({
  editRoot,
  resetBox = defaultResetBox,
}: EditDeps): Pick<InspectorHandlers, "patchBox" | "patchPlace" | "editElement" | "patchElement" | "resetElement"> {
  return {
    patchBox: (id, patch, key) =>
      editRoot((r) => updateNode(r, id, (n) => (isBox(n) ? { ...n, ...patch } : n)), key),
    patchPlace: (id, place, key) => editRoot((r) => updateNode(r, id, (n) => ({ ...n, place })), key),
    editElement: (id, fn, key) =>
      editRoot(
        (r) =>
          updateNode(r, id, (n) => {
            if (!isElement(n)) return n;
            return { ...n, state: fn(resolveElement(n).state) };
          }),
        key,
      ),
    patchElement: (id, patch, key) =>
      editRoot((r) => updateNode(r, id, (n) => (isElement(n) ? { ...n, ...patch } : n)), key),
    resetElement: (id) =>
      editRoot((r) =>
        updateNode(r, id, (n) => {
          if (isBox(n)) return resetBox(n, id === ROOT_ID);
          const el = n as ElementNode;
          const def = ELEMENT_DEFINITION_BY_TYPE[el.elementType];
          return def ? { ...el, state: structuredClone(def.defaults) } : el;
        }),
      ),
  };
}
