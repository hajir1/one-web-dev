// @ts-nocheck
import { test } from "node:test";
import assert from "node:assert/strict";
import { compose, stackedAreas, boxRules, placeRules } from "../helpers/compose";
import { createBox, createElementNode, createRoot, insertNode } from "../helpers/tree";
import { ELEMENT_DEFINITIONS, ELEMENT_DEFINITION_BY_TYPE as D } from "../../core/elementDefinitions";
import { makeIconLookup } from "../../core/helpers/elementDefinition";
import { normalizeDoc, createDefaultDoc } from "../helpers/migrate";
import { collectElements } from "../helpers/tree";
import type { BoxNode } from "../helpers/componentTypes";

const icons = makeIconLookup([]);
const mk = (t: string, patch: object = {}) => createElementNode(t, { ...D[t].defaults, ...patch }, D[t].label);
const opts = (extra = {}) => ({ rootClass: "demo", icons, ...extra });
const FR = (n: number) => `repeat(${n}, minmax(0, 1fr))`;
const cells = (n: number) => Array.from({ length: n }, () => createBox("stack"));
/** Pengganti preset Component Maker lama untuk tes. */
const presetRoot = (id: string): BoxNode =>
  id === "grid-2x2"
    ? createRoot("grid", { columns: FR(2), children: cells(4) })
    : id === "grid-3col"
      ? createRoot("grid", { columns: FR(3), children: cells(3) })
      : createRoot("stack", { children: cells(2) });

test("setiap elemen: rootClass cocok dengan class paling luar di markup", () => {
  const bad: string[] = [];
  for (const def of ELEMENT_DEFINITIONS) {
    const spec = def.spec(def.defaults, "X", icons);
    const expected = def.rootClass ? def.rootClass("X") : "X";
    const html = spec.html?.body ?? "";
    const first = Array.isArray(spec.markup) ? spec.markup[0] : spec.markup;
    const cls = first && first.kind === "el" ? first.attrs.class : html.match(/class="([^"]+)"/)?.[1];
    if (cls !== expected) bad.push(`${def.type}: markup=${cls} rootClass=${expected}`);
  }
  assert.deepEqual(bad, []);
});

test("compose: tiap elemen tersimpan bisa dirakit tanpa error di semua framework", () => {
  let root = presetRoot("grid-2x2");
  ELEMENT_DEFINITIONS.forEach((d, i) => {
    root = insertNode(root, root.children[i % 4].id, 0, mk(d.type));
  });
  const c = compose(root, opts({ allowPremiumElements: true }));
  assert.deepEqual(c.warnings, []);
  assert.equal(c.elementCount, ELEMENT_DEFINITIONS.length);
  // tanpa kredit: elemen premium tidak ikut, dengan peringatan
  const free = compose(root, opts());
  const premium = ELEMENT_DEFINITIONS.filter((d) => d.premium).length;
  assert.ok(premium >= 5);
  assert.equal(free.elementCount, ELEMENT_DEFINITIONS.length - premium);
  assert.equal(free.warnings.length, premium);
  for (const fw of ["html", "react", "vue", "svelte", "angular"] as const) {
    const files = c.files(fw);
    assert.ok(files.length > 0);
    assert.ok(files.every((f) => f.content.length > 0), fw);
  }
});

test("kode HTML export tidak mengandung penanda preview; preview mengandung", () => {
  let root = presetRoot("block-stack");
  root = insertNode(root, root.children[0].id, 0, mk("button"));
  root = insertNode(root, root.children[1].id, 0, mk("tabs"));
  const ex = compose(root, opts());
  const pv = compose(root, opts({ preview: true }));
  assert.ok(!ex.html.body.includes("data-cm"));
  assert.ok(pv.html.body.includes("data-cm-id"));
  // Selain penanda, isinya identik (preview == kode)
  const strip = (s: string) => s.replace(/ data-cm-[a-z-]+(="[^"]*")?/g, "");
  assert.equal(strip(pv.html.body), ex.html.body);
  assert.equal(pv.html.css, ex.html.css);
  assert.equal(pv.html.script, ex.html.script);
});

test("elemen stateful menjadi komponen anak (non-HTML) dan di-import induk", () => {
  let root = presetRoot("block-stack");
  root = insertNode(root, root.children[0].id, 0, mk("tabs"));
  root = insertNode(root, root.children[0].id, 1, mk("alert", { dismissible: true }));
  root = insertNode(root, root.children[0].id, 2, mk("alert", { dismissible: false }));
  const c = compose(root, opts());
  const names = (fw: Parameters<typeof c.files>[0]) => c.files(fw).map((f) => f.name);
  assert.deepEqual(names("react"), ["Demo.jsx", "Demo.css", "Tabs1.jsx", "Tabs1.css", "Alert1.jsx", "Alert1.css"]);
  const parent = c.files("react")[0].content;
  assert.match(parent, /import Tabs1 from "\.\/Tabs1";/);
  assert.match(parent, /<Tabs1 \/>/);
  assert.match(parent, /<Alert1 \/>/);
  // alert non-dismissible di-inline, bukan komponen
  assert.match(parent, /demo__alert-2/);
  assert.match(c.files("angular")[0].content, /imports: \[Tabs1Component, Alert1Component\]/);
  assert.match(c.files("angular").find((f) => f.name === "tabs1.component.ts")!.content, /standalone: true/);
  assert.match(c.files("vue")[0].content, /import Tabs1 from "\.\/Tabs1\.vue";/);
  assert.match(c.files("svelte")[0].content, /import Tabs1 from '\.\/Tabs1\.svelte';|import Tabs1 from "\.\/Tabs1\.svelte";/);
  // HTML: satu halaman + script gabungan
  assert.ok(c.html.script.includes("demo__tabs-1"));
  assert.ok(c.html.script.includes("demo__alert-1__close"));
});

test("elemen tak dikenal: dilewati di kode, jadi peringatan, placeholder di preview", () => {
  let root = presetRoot("block-stack");
  root = insertNode(root, root.children[0].id, 0, createElementNode("hologram", {}, "Hologram"));
  root = insertNode(root, root.children[0].id, 1, mk("button"));
  const ex = compose(root, opts());
  assert.equal(ex.warnings.length, 1);
  assert.equal(ex.elementCount, 1);
  assert.ok(!ex.html.body.includes("hologram"));
  const pv = compose(root, opts({ preview: true }));
  assert.ok(pv.html.body.includes("data-cm-failed"));
});

test("elemen yang melempar error tidak merusak komponen lain", () => {
  let root = presetRoot("block-stack");
  const bad = mk("table", { rows: null, columns: 5 }); // state sengaja rusak
  root = insertNode(root, root.children[0].id, 0, bad);
  root = insertNode(root, root.children[0].id, 1, mk("button"));
  const c = compose(root, opts());
  assert.equal(c.elementCount >= 1, true);
  assert.ok(c.html.body.includes("demo__button-"));
});

test("aturan CSS box & penempatan", () => {
  const grid = createBox("grid", { columns: "1fr 2fr", areas: '"h h" "s m"', stackOnMobile: true });
  const r = boxRules(grid);
  assert.equal(r.base.display, "grid");
  assert.equal(r.mobile.gridTemplateColumns, "minmax(0, 1fr)");
  assert.equal(r.mobile.gridTemplateAreas, '"h" "s" "m"');
  assert.equal(stackedAreas('"a a" "b c" "d d"'), '"a" "b" "c" "d"');
  const row = createBox("row", { stackOnMobile: true });
  assert.equal(boxRules(row).mobile.flexDirection, "column");
  assert.equal(placeRules({ grow: true, basis: 160 }, row).base.flex, "1 1 160px");
  assert.equal(placeRules({ grow: true }, row).mobile.flex, "none");
  assert.equal(placeRules({ colStart: 1, colSpan: 2, rowStart: 1, rowSpan: 2 }, grid).base.gridColumn, "1 / span 2");
  assert.equal(placeRules({ selfH: "center" }, createBox("stack")).base.alignSelf, "center");
});

test("@media hanya ada kalau ada aturan layar kecil", () => {
  const stack = presetRoot("block-stack");
  assert.ok(!compose(stack, opts()).html.css.includes("@media"));
  const grid = presetRoot("grid-3col");
  assert.match(compose(grid, opts()).html.css, /@media \(max-width: 640px\)/);
});

/* ----------------------------- migrasi ----------------------------- */

test("normalizeDoc: data korup/kosong → dokumen bawaan, tidak melempar", () => {
  for (const bad of [null, undefined, 5, "x", [], {}, { version: 2 }, { version: 2, root: 5 }]) {
    const d = normalizeDoc(bad);
    assert.equal(d.version, 2);
    assert.equal(d.root.kind, "box");
  }
});

test("normalizeDoc: tautan desain lama (Element Maker) dibuang, state tetap", () => {
  const d = normalizeDoc({
    version: 2,
    root: { kind: "box", children: [{ kind: "element", elementType: "button", name: "B", state: { text: "Halo" }, link: { designId: "d1" } }] },
  });
  const els = collectElements(d.root);
  assert.equal(els.length, 1);
  assert.equal(els[0].link, undefined);
  assert.equal((els[0].state as { text: string }).text, "Halo");
  assert.equal(typeof (els[0].state as { borderRadius: number }).borderRadius, "number");
});

test("normalizeDoc: pembersihan nilai tak valid & id ganda", () => {
  const dirty = {
    version: 2,
    root: {
      kind: "box", id: "zzz", layout: "bogus", gap: -5, padding: "x", columns: 7,
      children: [
        { kind: "element", id: "dup", elementType: "button", state: { text: 5, fontSize: 18 } },
        { kind: "element", id: "dup", elementType: "button", state: null },
        { kind: "wat" },
        null,
      ],
    },
  };
  const d = normalizeDoc(dirty);
  assert.equal(d.root.id, "root");
  assert.equal(d.root.layout, "stack");
  assert.equal(d.root.gap, 0);
  assert.equal(d.root.children.length, 2);
  assert.notEqual(d.root.children[0].id, d.root.children[1].id);
  const first = d.root.children[0] as ReturnType<typeof mk>;
  assert.equal(first.state.fontSize, 18);
  assert.equal(typeof first.state.text, "string"); // tipe salah diganti default
});

test("normalizeDoc idempotent", () => {
  const a = normalizeDoc(createDefaultDoc());
  const b = normalizeDoc(JSON.parse(JSON.stringify(a)));
  assert.equal(JSON.stringify(a), JSON.stringify(b));
});
