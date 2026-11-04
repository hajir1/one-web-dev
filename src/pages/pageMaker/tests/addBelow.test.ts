import test from "node:test";
import assert from "node:assert/strict";
import { isBox, type BoxNode } from "../engine/helpers/componentTypes";
import { createBox, createElementNode, findNode, findParent } from "../engine/helpers/tree";
import { belowSpot, createPageRoot, placeBelowWrapped, placeNode } from "../helpers/pageDoc";
import { createRegularSection } from "../helpers/sectionTypes";

/* (+) "add below" must not create a new column beside it. */

const text = () => createElementNode("text", {}, "Text");

function twoColumns() {
  const sec = createRegularSection("2")!;
  const root = { ...createPageRoot(), children: [sec] } as BoxNode;
  const row = sec.children[0] as BoxNode;
  const [c1, c2] = row.children as BoxNode[];
  return { root, row, c1, c2 };
}

test("(+) di bawah kolom grid → isi baru masuk ke kolom itu, bukan jadi kolom ke-3", () => {
  const { root, row, c1 } = twoColumns();
  const spot = belowSpot(root, c1.id);
  assert.deepEqual(spot, { parentId: c1.id, index: 0 });
  const box = createBox("stack");
  const r = placeNode(root, c1.id, 0, box).root;
  assert.equal((findNode(r, row.id) as BoxNode).children.length, 2);
  assert.equal(findParent(r, box.id)!.parent.id, c1.id);
});

test("(+) di bawah elemen dalam kolom → saudara berikutnya di kolom yang sama", () => {
  const { root, c1 } = twoColumns();
  const el = text();
  const r = placeNode(root, c1.id, 0, el).root;
  assert.deepEqual(belowSpot(r, el.id), { parentId: c1.id, index: 1 });
});

test("(+) di bawah elemen yang langsung di grid → dibungkus Stack, isi baru di bawahnya", () => {
  const { root, row } = twoColumns();
  const el = text();
  let r = placeNode(root, row.id, 0, el).root;
  assert.deepEqual(belowSpot(r, el.id), { wrapId: el.id });
  const add = text();
  r = placeBelowWrapped(r, el.id, add).root;
  const wrap = findParent(r, el.id)!.parent;
  assert.equal(wrap.layout, "stack");
  assert.deepEqual(wrap.children.map((c) => c.id), [el.id, add.id]);
  // the grid cell count stays 3 (2 columns + 1 group), it does not grow
  assert.equal((findNode(r, row.id) as BoxNode).children.length, 3);
});

test("kartu (berlatar) di grid ikut dibungkus, bukan diisi", () => {
  const { root, row } = twoColumns();
  const card = createBox("stack", { bgEnabled: true });
  const r = placeNode(root, row.id, 0, card).root;
  assert.deepEqual(belowSpot(r, card.id), { wrapId: card.id });
});

test("section, Row, dan anak root bukan target (+) di bawah", () => {
  const { root, row } = twoColumns();
  assert.equal(belowSpot(root, root.children[0].id), null);
  assert.equal(belowSpot(root, row.id), null);
  assert.ok(isBox(row));
});

/* ------------------- copy right below (Divi style) ------------------- */

import { duplicateBelow, innerRowSpot, isInnerRow, placeInnerRow } from "../helpers/pageDoc";
import { createSpecialtySection } from "../helpers/sectionTypes";
import { normalizeDoc } from "../engine/helpers/migrate";

test("salin kolom grid → salinan tepat di bawahnya (dibungkus), Row tetap 2 kolom", () => {
  const { root, row, c1, c2 } = twoColumns();
  const res = duplicateBelow(root, c1.id);
  const r = findNode(res.root, row.id) as BoxNode;
  assert.equal(r.children.length, 2);
  const wrap = r.children[0] as BoxNode;
  assert.equal(wrap.layout, "stack");
  assert.deepEqual(wrap.children.map((c) => c.name), ["Kolom 1", "Kolom 1 (salinan)"]);
  assert.equal(r.children[1].id, c2.id);
  assert.equal(res.newId, wrap.children[1].id);
});

test("salin section / Row / modul di kolom → saudara berikutnya (tepat di bawah)", () => {
  const { root, row, c1 } = twoColumns();
  const sec = root.children[0];
  let res = duplicateBelow(root, sec.id);
  assert.equal(res.root.children[1].id, res.newId);
  res = duplicateBelow(root, row.id);
  assert.equal((res.root.children[0] as BoxNode).children[1].id, res.newId);
  const el = text();
  const r2 = placeNode(root, c1.id, 0, el).root;
  res = duplicateBelow(r2, el.id);
  assert.deepEqual((findNode(res.root, c1.id) as BoxNode).children.map((c) => c.id), [el.id, res.newId]);
});

test("spesialisasi: Row dalam bertanda, salinannya di bawah, Row dalam baru tepat di bawah yang dipilih", () => {
  const sec = createSpecialtySection("1_4-3_4s")!;
  const root = { ...createPageRoot(), children: [sec] } as BoxNode;
  const special = ((sec.children[0] as BoxNode).children as BoxNode[]).find((c) => c.name === "Kolom Spesial")!;
  const [in1, in2] = special.children as BoxNode[];
  assert.ok(isInnerRow(in1) && isInnerRow(in2));
  // copy inner Row 1 → right below it
  const dup = duplicateBelow(root, in1.id);
  assert.deepEqual((findNode(dup.root, special.id) as BoxNode).children.map((c) => c.id), [in1.id, dup.newId, in2.id]);
  // a column inside inner Row 2 → a new inner Row right below inner Row 2
  const cell = in2.children[0];
  assert.deepEqual(innerRowSpot(root, cell.id), { columnId: special.id, index: 2 });
  const placed = placeInnerRow(root, in1.id, "3");
  const kids = (findNode(placed.root, special.id) as BoxNode).children as BoxNode[];
  assert.equal(kids[1].id, placed.id);
  assert.ok(kids[1].innerRow && kids[1].children.length === 3 && !kids[1].row);
  // the side column is not the special column
  const side = ((sec.children[0] as BoxNode).children as BoxNode[]).find((c) => c.name.startsWith("Kolom Samping"))!;
  assert.equal(innerRowSpot(root, side.id), null);
});

test("tanda Row dalam ikut tersimpan & termuat ulang", () => {
  const sec = createSpecialtySection("1_2s-1_2")!;
  const doc = normalizeDoc({ version: 2, type: "page", className: "p", root: { ...createPageRoot(), children: [sec] } });
  let n = 0;
  const walkAll = (b: BoxNode) => b.children.forEach((c) => isBox(c) && (c.innerRow && n++, walkAll(c)));
  walkAll(doc.root);
  assert.equal(n, 2);
});
