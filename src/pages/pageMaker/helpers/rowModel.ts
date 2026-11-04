import { isBox, type BoxNode, type ComponentNode } from "../engine/helpers/componentTypes";
import { createBox } from "../engine/helpers/tree";

/* Row model: split out so section presets can use it without circular imports. */

export const isRow = (n: ComponentNode): boolean => isBox(n) && !!n.row && !n.section;

/** A new Row: a stylable container that stacks its content downward by default. */
export function createRow(patch: Partial<BoxNode> = {}): BoxNode {
  return createBox("stack", {
    name: "Row",
    row: true,
    gap: 12,
    padding: 8,
    align: "start",
    widthMode: "full",
    stackOnMobile: false,
    ...patch,
  });
}
