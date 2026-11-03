import { isBox, type BoxNode, type ComponentNode } from "../engine/helpers/componentTypes";
import { createBox } from "../engine/helpers/tree";

/* Model Row — dipisah supaya preset section bisa memakainya tanpa import melingkar. */

export const isRow = (n: ComponentNode): boolean => isBox(n) && !!n.row && !n.section;

/** Row baru: kontainer yang bisa di-styling, bawaannya menumpuk isi ke bawah. */
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
