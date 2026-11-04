import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  COLUMN_LAYOUTS,
  SPECIALTY_LAYOUTS,
  createColumnRow,
  createFullwidthSection,
  createRegularSection,
  createSpecialtySection,
  fractionLabel,
  sectionKindOf,
  specialtyLabel,
} from "../helpers/sectionTypes";
import { SECTION_PRESETS } from "../helpers/sectionPresets";
import {
  ROW_VARIANTS,
  canInsertInto,
  createPageRoot,
  createSectionForEditor,
  createSectionFromPreset,
  enforcePageStructure,
  isRow,
  isSection,
  normalizePageDoc,
  presetTree,
} from "../helpers/pageDoc";
import { compose } from "../engine/helpers/compose";
import { countElements, walk } from "../engine/helpers/tree";
import { isBox } from "../engine/helpers/componentTypes";
import { makeIconLookup } from "../core/helpers/elementDefinition";

const icons = makeIconLookup([]);
/** Box skeleton (name & layout) without ids, to compare structure. */
const shape = (n) => (isBox(n) ? { name: n.name, layout: n.layout, columns: n.columns, kids: n.children.filter(isBox).map(shape) } : null);
const rowsInside = (n) => {
  let c = 0;
  walk(n, (x) => {
    if (x !== n && isRow(x)) c++;
  });
  return c;
};

test("20 struktur kolom ala Divi; id 1–4 tetap; jumlah kolom = jumlah pecahan", () => {
  assert.equal(COLUMN_LAYOUTS.length, 20);
  assert.equal(new Set(COLUMN_LAYOUTS.map((l) => l.id)).size, 20);
  for (const id of ["1", "2", "3", "4"]) assert.ok(COLUMN_LAYOUTS.some((l) => l.id === id));
  for (const l of COLUMN_LAYOUTS) {
    const r = createColumnRow(l.id);
    assert.ok(isRow(r), l.id);
    assert.equal(l.fr.length === 1 ? 0 : r.children.length, l.fr.length === 1 ? 0 : l.fr.length, l.id);
  }
  assert.equal(fractionLabel([1, 2, 1]), "1/4 + 1/2 + 1/4");
  assert.equal(fractionLabel([1, 1, 1, 3]), "1/6 + 1/6 + 1/6 + 1/2");
  assert.equal(fractionLabel([2, 3]), "2/5 + 3/5");
  assert.equal(createColumnRow("1_4-3_4").columns, "minmax(0, 1fr) minmax(0, 3fr)");
  assert.equal(createColumnRow("3").columns, "repeat(3, minmax(0, 1fr))");
  // varian Row (panel +Row) = 20 struktur + Sejajar
  assert.equal(ROW_VARIANTS.length, 21);
});

test("Section Reguler: kosong, bertanda reguler, valid di halaman", () => {
  for (const l of COLUMN_LAYOUTS) {
    const s = createRegularSection(l.id);
    assert.ok(isSection(s));
    assert.equal(sectionKindOf(s.section), "regular");
    assert.equal(s.section.contentWidth, 1120);
    assert.equal(countElements(s), 0);
    assert.ok(isRow(s.children[0]));
    const root = createPageRoot();
    assert.equal(canInsertInto(root, root.id, s), true);
  }
  assert.equal(createRegularSection("tidak-ada"), null);
});

test("Section Spesialisasi: kolom spesial berisi baris dalam, tanpa Row bersarang, lolos aturan halaman", () => {
  assert.equal(SPECIALTY_LAYOUTS.length, 9);
  for (const l of SPECIALTY_LAYOUTS) {
    const s = createSpecialtySection(l.id);
    assert.equal(sectionKindOf(s.section), "specialty");
    const row = s.children[0];
    assert.equal(row.children.length, l.cols.length, l.id);
    l.cols.forEach((c, i) => {
      const cell = row.children[i];
      if (c.inner) {
        assert.equal(cell.children.length, c.inner.length, l.id);
        c.inner.forEach((fr, j) => {
          const inner = cell.children[j];
          assert.equal(fr.length === 1 ? 0 : inner.children.length, fr.length === 1 ? 0 : fr.length);
        });
      } else assert.equal(cell.children.length, 0);
    });
    assert.equal(rowsInside(row), 0, "Row tidak boleh bersarang");
    assert.equal(countElements(s), 0);
    // the page structure rules change nothing
    const root = createPageRoot([s]);
    assert.deepEqual(shape(enforcePageStructure(root).children[0]), shape(s));
  }
  assert.match(specialtyLabel(SPECIALTY_LAYOUTS[0]), /^1\/4 \+ 3\/4 ★$/);
});

test("Section Lebar Penuh: tanpa batas lebar & padding, Row 100%", () => {
  const s = createFullwidthSection();
  assert.equal(sectionKindOf(s.section), "fullwidth");
  assert.deepEqual([s.section.contentWidth, s.section.padX, s.section.padY], [0, 0, 0]);
  assert.equal(s.children[0].rowWidth, "full");
  const css = compose(createPageRoot([s]), { rootClass: "pg", icons }).html.css;
  assert.match(css, /width: 100%/);
  assert.match(css, /max-width: none/);
});

test("tipe section tersimpan & dimuat ulang (normalizePageDoc)", () => {
  const doc = { version: 2, root: createPageRoot([createRegularSection("2"), createSpecialtySection("1_4-3_4s"), createFullwidthSection()]) };
  const back = normalizePageDoc(JSON.parse(JSON.stringify(doc)));
  assert.deepEqual(back.root.children.map((s) => s.section.sectionType), ["regular", "specialty", "fullwidth"]);
  // unknown values are dropped, old sections without a marker = regular
  const bad = JSON.parse(JSON.stringify(doc));
  bad.root.children[0].section.sectionType = "<x>";
  const b2 = normalizePageDoc(bad);
  assert.equal(b2.root.children[0].section.sectionType, undefined);
  assert.equal(sectionKindOf(b2.root.children[0].section), "regular");
});

test("pustaka preset: yang ditambahkan = yang digambar (presetTree), dengan & tanpa contoh isi", () => {
  for (const p of SECTION_PRESETS) {
    for (const withContent of [true, false]) {
      assert.deepEqual(shape(createSectionForEditor(p, withContent)), shape(presetTree(p, withContent)), `${p.id} ${withContent}`);
      assert.equal(countElements(createSectionForEditor(p, withContent)), countElements(presetTree(p, withContent)), p.id);
    }
    // without the tick: an empty skeleton
    assert.equal(countElements(presetTree(p, false)), 0, p.id);
    // with the tick: EVERY preset now has samples (previously 22 base presets were empty)
    assert.ok(countElements(presetTree(p, true)) > 0, `${p.id} punya contoh isi`);
  }
});

test("contoh isi preset dasar tidak mengubah kerangka Row & kolomnya", () => {
  const base = SECTION_PRESETS.filter((p) => p.buildEmpty);
  assert.equal(base.length, 22);
  for (const p of base) {
    const full = p.build();
    const empty = p.buildEmpty();
    assert.deepEqual(full.children.map((r) => r.name), empty.children.map((r) => r.name), p.id);
    // every named column from the empty skeleton is filled too
    full.children.forEach((r, i) => {
      const er = empty.children[i];
      if (er.children.length === 0) assert.ok(r.children.length > 0, `${p.id}/${r.name}`);
      er.children.forEach((c, j) => assert.ok(r.children[j].children.length > 0, `${p.id}/${c.name}`));
    });
    assert.ok(isSection(createSectionFromPreset(p)));
    assert.equal(countElements(createSectionFromPreset(p)), 0, `${p.id}: struktur asli tetap kosong`);
  }
});

test("teks UI tipe section ada di id & en", () => {
  for (const lang of ["id", "en"]) {
    const j = JSON.parse(readFileSync(new URL(`../../../locales/${lang}.json`, import.meta.url), "utf8"));
    const ins = j.pm.insert;
    for (const k of ["title", "tabNew", "tabLibrary", "pickColumns", "pickSpecialty", "specialtyHint", "back", "emptyNote", "withContentHint"]) assert.ok(ins[k], `${lang}.${k}`);
    for (const k of ["regular", "specialty", "fullwidth"]) assert.ok(ins.kind[k].name && ins.kind[k].hint, `${lang}.${k}`);
    assert.ok(j.pm.inspector.section.type);
  }
});
