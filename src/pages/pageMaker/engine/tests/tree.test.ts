// @ts-nocheck
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  canMoveInto,
  cloneNode,
  collectElements,
  createBox,
  createElementNode,
  createRoot,
  duplicateNode,
  findNode,
  findParent,
  insertNode,
  moveBy,
  moveNode,
  removeNode,
  unwrapBox,
  updateNode,
  wrapInBox,
} from "../helpers/tree";
import { isBox, type BoxNode } from "../helpers/componentTypes";

const el = (name: string) => createElementNode("button", { text: name }, name);
const names = (b: BoxNode) => b.children.map((c) => c.name);

function sample() {
  // root: [A, box1:[B, C], D]
  const box1 = createBox("stack", { name: "box1" });
  const A = el("A"), B = el("B"), C = el("C"), D = el("D");
  let root = createRoot("stack", { children: [] });
  root = insertNode(root, root.id, 0, A);
  root = insertNode(root, root.id, 1, box1);
  root = insertNode(root, box1.id, 0, B);
  root = insertNode(root, box1.id, 1, C);
  root = insertNode(root, root.id, 3, D);
  return { root, box1, A, B, C, D };
}

test("insert & find", () => {
  const { root, box1, B } = sample();
  assert.deepEqual(names(root), ["A", "box1", "D"]);
  assert.equal(findNode(root, B.id)?.name, "B");
  assert.equal(findParent(root, B.id)?.parent.id, box1.id);
});

test("operasi bersifat immutable", () => {
  const { root, A } = sample();
  const before = JSON.stringify(root);
  removeNode(root, A.id);
  moveBy(root, A.id, 1);
  assert.equal(JSON.stringify(root), before);
});

test("remove tidak bisa menghapus root", () => {
  const { root } = sample();
  assert.equal(removeNode(root, root.id), root);
});

test("moveNode: pindah antar induk", () => {
  const { root, box1, A, B } = sample();
  const r = moveNode(root, A.id, box1.id, 1); // A goes into box1 between B and C
  const b1 = findNode(r, box1.id) as BoxNode;
  assert.deepEqual(names(b1), ["B", "A", "C"]);
  assert.deepEqual(names(r), ["box1", "D"]);
  assert.ok(findNode(r, B.id));
});

test("moveNode: reorder satu induk memakai indeks sebelum pencabutan", () => {
  const { root, A } = sample();
  // A after box1 (index 2 before removal) → [box1, A, D]
  assert.deepEqual(names(moveNode(root, A.id, root.id, 2)), ["box1", "A", "D"]);
  // A to the very end
  assert.deepEqual(names(moveNode(root, A.id, root.id, 3)), ["box1", "D", "A"]);
  // the same position = unchanged (same reference)
  assert.equal(moveNode(root, A.id, root.id, 0), root);
  assert.equal(moveNode(root, A.id, root.id, 1), root);
});

test("moveNode: tidak boleh ke dalam diri sendiri / turunan / root dipindah", () => {
  const { root, box1, B } = sample();
  assert.equal(canMoveInto(root, box1.id, box1.id), false);
  assert.equal(canMoveInto(root, root.id, box1.id), false);
  const nested = createBox("stack", { name: "nested" });
  const r = insertNode(root, box1.id, 0, nested);
  assert.equal(canMoveInto(r, box1.id, nested.id), false);
  assert.equal(moveNode(r, box1.id, nested.id, 0), r);
  // dropping into an element (not a box) is rejected
  assert.equal(canMoveInto(r, box1.id, B.id), false);
});

test("moveBy naik/turun & batas", () => {
  const { root, A, D } = sample();
  assert.deepEqual(names(moveBy(root, A.id, 1)), ["box1", "A", "D"]);
  assert.equal(moveBy(root, A.id, -1), root);
  assert.equal(moveBy(root, D.id, 1), root);
});

test("duplicate memberi id baru dan salinan dalam", () => {
  const { root, box1 } = sample();
  const { root: r, newId } = duplicateNode(root, box1.id);
  assert.ok(newId);
  assert.deepEqual(names(r), ["A", "box1", "box1 (salinan)", "D"]);
  const copy = findNode(r, newId!) as BoxNode;
  // element state is not shared
  const e0 = collectElements(copy)[0];
  e0.state.text = "diubah";
  assert.notEqual((collectElements(findNode(r, box1.id)!)[0].state as { text: string }).text, "diubah");
});

test("cloneNode: semua id baru", () => {
  const { box1 } = sample();
  const c = cloneNode(box1);
  const all = (n: BoxNode): string[] => [n.id, ...n.children.flatMap((x) => (isBox(x) ? all(x) : [x.id]))];
  const a = new Set(all(box1));
  assert.ok(all(c).every((id) => !a.has(id)));
});

test("wrapInBox & unwrapBox", () => {
  const { root, A } = sample();
  const w = wrapInBox(root, A.id, "row");
  assert.ok(w.boxId);
  assert.deepEqual(names(w.root), ["Grup", "box1", "D"]);
  const box = findNode(w.root, w.boxId!) as BoxNode;
  assert.equal(box.layout, "row");
  assert.deepEqual(names(box), ["A"]);
  assert.deepEqual(names(unwrapBox(w.root, w.boxId!)), ["A", "box1", "D"]);
  assert.equal(wrapInBox(root, root.id).boxId, null);
});

test("updateNode hanya menyalin jalur yang berubah", () => {
  const { root, box1, A } = sample();
  const r = updateNode(root, box1.id, (n) => ({ ...n, name: "baru" }));
  assert.equal(findNode(r, box1.id)?.name, "baru");
  assert.equal(findNode(r, A.id), findNode(root, A.id)); // siblings are not copied
});
