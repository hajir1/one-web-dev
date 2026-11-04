// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { SECTION_PRESETS } from "../helpers/sectionPresets";
import { isSafeBgImage } from "../core/helpers/background";
import {
  canInsertInto,
  createRow,
  createRowVariant,
  isRow,
  movePageNode,
  placeNode,
  rowOf,
  ROW_VARIANTS,
  createDefaultPageDoc,
  createPageRoot,
  createSectionFromPreset,
  enforcePageStructure,
  isSection,
  normalizePageDoc,
  sectionOf,
} from "../helpers/pageDoc";
import { resolveDrop } from "../helpers/dropTarget";
import { compose } from "../engine/helpers/compose";
import { createElementNode, insertNode, countElements, findNode, findParent, walk } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";

const icons = makeIconLookup([]);
const el = (t = "button") => createElementNode(t, structuredClone(ELEMENT_DEFINITION_BY_TYPE[t].defaults), t);

test("32 preset: 12 gratis + 20 premium (termasuk 10 preset Pro baru: 4 + 6), semua section valid dengan id unik", () => {
  assert.equal(SECTION_PRESETS.length, 32);
  assert.equal(SECTION_PRESETS.filter((p) => p.tier === "free").length, 12);
  assert.equal(SECTION_PRESETS.filter((p) => p.tier === "premium").length, 20);
  // free ones are shown first
  assert.ok(SECTION_PRESETS.slice(0, 12).every((p) => p.tier === "free"));
  const ids = new Set();
  for (const p of SECTION_PRESETS) {
    const s = p.build();
    assert.ok(isSection(s), p.id);
    assert.equal(s.widthMode, "full");
    assert.equal(s.layout, "block", `${p.id}: section tampil normal (bukan flex/grid)`);
    assert.ok(s.children.length >= 1 && s.children.every(isRow), `${p.id}: isi section = Row`);
    ids.add(s.id);
    for (const c of s.children) ids.add(c.id);
  }
  assert.equal(new Set(SECTION_PRESETS.map((p) => p.id)).size, 32);
  assert.ok(ids.size > 32);
  // image presets use safe URLs & pass normalization
  const hero = SECTION_PRESETS.find((p) => p.id === "hero-image").build();
  assert.ok(isSafeBgImage(hero.bgImage));
  const n = normalizePageDoc({ version: 2, root: createPageRoot([hero]) });
  assert.equal(n.root.children[0].bgImage, hero.bgImage);
  assert.equal(n.root.children[0].bgOverlayOpacity, 45);
});

test("halaman baru kosong; elemen tidak boleh langsung di root (section wajib)", () => {
  const doc = createDefaultPageDoc();
  assert.equal(doc.root.children.length, 0);
  assert.equal(canInsertInto(doc.root, doc.root.id, el()), false);
  const sec = createSectionFromPreset("features-3");
  assert.equal(canInsertInto(doc.root, doc.root.id, sec), true);
  const root = insertNode(doc.root, doc.root.id, 0, sec);
  const row = sec.children[0];
  assert.equal(canInsertInto(root, row.id, el()), true);
  assert.equal(canInsertInto(root, row.children[0].id, el()), true);
  assert.equal(canInsertInto(root, row.id, createSectionFromPreset("single")), false);
  // sections only accept Rows; a Row may not go inside a Row
  assert.equal(canInsertInto(root, sec.id, el()), false);
  assert.equal(canInsertInto(root, sec.id, createRow()), true);
  assert.equal(canInsertInto(root, row.id, createRow()), false);
});

test("enforcePageStructure: tidak ada elemen yang hilang", () => {
  const stray = el("badge");
  const box = createSectionFromPreset(SECTION_PRESETS[2])!; // skeleton without sample content
  box.section = undefined;
  box.children[0].children[0].children.push(el("text"));
  const root = enforcePageStructure(createPageRoot([stray, box, createSectionFromPreset("single")]));
  assert.ok(root.children.every(isSection));
  assert.equal(countElements(root), 2);
  assert.equal(root.children.length, 3);
});

test("section bersarang dibersihkan", () => {
  const outer = createSectionFromPreset("features-3");
  outer.children[0].children[0].children.push(createSectionFromPreset("single"));
  const root = enforcePageStructure(createPageRoot([outer]));
  let n = 0;
  const walk = (x) => { if (x.kind === "box") { if (x.section) n++; x.children.forEach(walk); } };
  walk(root);
  assert.equal(n, 1);
});

test("normalizePageDoc tahan data sampah & format lama", () => {
  for (const bad of [null, undefined, 5, "x", [], {}, { version: 2 }, { version: 2, root: 3 }]) {
    const d = normalizePageDoc(bad);
    assert.equal(d.root.id, "root");
    assert.ok(d.root.children.every(isSection));
  }
  const legacy = normalizePageDoc({
    items: [
      { content: { elementType: "button", name: "Tombol", snapshot: { text: "Hai" } }, align: "start" },
      { content: { elementType: "component", name: "Kartu", snapshot: { version: 2, root: { kind: "box", children: [{ kind: "element", elementType: "badge", name: "B", state: {} }] } } } },
      { content: { elementType: "section", name: "Hero", snapshot: { slots: { a: { elementType: "alert", name: "A", snapshot: {} } } } } },
      null,
      { content: 5 },
    ],
  });
  assert.equal(legacy.root.children.length, 3);
  assert.equal(countElements(legacy.root), 3);
  assert.ok(legacy.root.children.every((s) => s.layout === "block" && s.children.every(isRow)));
});

test("normalizePageDoc idempoten & menjaga tag/section", () => {
  let root = createPageRoot();
  root = insertNode(root, root.id, 0, createSectionFromPreset("navbar"));
  const once = normalizePageDoc({ version: 2, root });
  const twice = normalizePageDoc(once);
  assert.deepEqual(twice, once);
  assert.equal(once.root.tag, "main");
  assert.equal(once.root.children[0].tag, "header");
  assert.equal(once.root.children[0].section.contentWidth, 1120);
});

test("URL gambar latar berbahaya dibuang", () => {
  const s = createSectionFromPreset("single");
  s.section.bgImage = 'javascript:alert(1)';
  const d = normalizePageDoc({ version: 2, root: createPageRoot([s]) });
  assert.equal(d.root.children[0].section.bgImage, "");
  s.section.bgImage = 'https://x.com/a.jpg") ;}body{display:none';
  assert.equal(normalizePageDoc({ version: 2, root: createPageRoot([s]) }).root.children[0].section.bgImage, "");
  s.section.bgImage = "https://x.com/a.jpg";
  assert.equal(normalizePageDoc({ version: 2, root: createPageRoot([s]) }).root.children[0].section.bgImage, "https://x.com/a.jpg");
});

test("compose: tag semantik, padding section, bgImage, preview == export", () => {
  let root = createPageRoot();
  const nav = createSectionFromPreset("navbar");
  const hero = createSectionFromPreset("hero-center");
  hero.section.bgImage = "https://x.com/h.jpg";
  hero.children[0].children.push(el("text"), el("button"));
  root = insertNode(root, root.id, 0, nav);
  root = insertNode(root, root.id, 1, hero);
  const c = compose(root, { rootClass: "custom-page", icons });
  assert.match(c.html.body, /^<main class="custom-page">/);
  assert.match(c.html.body, /<header class="custom-page__box-1">/);
  assert.match(c.html.body, /<section class="custom-page__box-\d+">/);
  // Fluid section spacing: 96px on desktop, 53px on phones.
  assert.match(c.html.css, /padding: clamp\(53px, [\d.]+px \+ [\d.]+vw, 96px\) 24px;/);
  // the section content width is applied to the Row (default: follow the content width, centered)
  assert.match(c.html.css, /\{[^}]*max-width: 1120px;[^}]*margin-left: auto;\n {2}margin-right: auto;/);
  assert.match(c.html.css, /background: url\("https:\/\/x.com\/h.jpg"\) center \/ cover no-repeat #f8fafc;/);
  const pv = compose(root, { rootClass: "custom-page", icons, preview: true });
  assert.equal(pv.html.body.replace(/ data-cm-[\w-]+(="[^"]*")?/g, ""), c.html.body);
  for (const fw of ["html", "react", "vue", "svelte", "angular"]) assert.ok(c.files(fw).length >= 1);
});

/* ------------------------------ drop -------------------------------- */

function pageWithRects() {
  let root = createPageRoot();
  const a = createSectionFromPreset("features-3"); // 3 columns
  const b = createSectionFromPreset("single");
  root = insertNode(root, root.id, 0, a);
  root = insertNode(root, root.id, 1, b);
  const ar = a.children[0];
  const br = b.children[0];
  const cells = ar.children;
  const rects = {
    root: { x: 0, y: 0, w: 1000, h: 600 },
    [a.id]: { x: 0, y: 0, w: 1000, h: 300 },
    [ar.id]: { x: 0, y: 0, w: 1000, h: 300 },
    [cells[0].id]: { x: 0, y: 0, w: 300, h: 300 },
    [cells[1].id]: { x: 350, y: 0, w: 300, h: 300 },
    [cells[2].id]: { x: 700, y: 0, w: 300, h: 300 },
    [b.id]: { x: 0, y: 300, w: 1000, h: 300 },
    [br.id]: { x: 0, y: 300, w: 1000, h: 300 },
  };
  return { root, a, b, ar, br, cells, rects };
}

test("drop: elemen ke kolom kosong = indeks 0, indikator kotak", () => {
  const { root, cells, rects } = pageWithRects();
  const r = resolveDrop(root, rects, { x: 400, y: 100 }, { kind: "element", elementType: "button" });
  assert.equal(r.parentId, cells[1].id);
  assert.equal(r.index, 0);
  assert.equal(r.indicator.kind, "box");
});

test("drop: celah antar kolom memakai anak terdekat; antar section memakai section terdekat", () => {
  const { root, ar, br, rects } = pageWithRects();
  const gap = resolveDrop(root, rects, { x: 320, y: 100 }, { kind: "element", elementType: "text" });
  assert.equal(gap.parentId, ar.id);
  const sec = resolveDrop(root, rects, { x: 500, y: 450 }, { kind: "element", elementType: "text" });
  assert.equal(sec.parentId, br.id);
  assert.equal(sec.index, 0);
});

test("drop: isi tidak pernah jatuh langsung di root", () => {
  const { root, rects } = pageWithRects();
  for (const y of [-50, 10, 299, 450, 900]) {
    const r = resolveDrop(root, rects, { x: 500, y }, { kind: "element", elementType: "text" });
    assert.ok(r && r.parentId !== "root");
  }
});

test("drop: indeks sisip menurut sumbu (stack = y, baris = x)", () => {
  const page = pageWithRects();
  const { br, rects } = page;
  let { root } = page;
  const e1 = el(), e2 = el("text");
  root = insertNode(root, br.id, 0, e1);
  root = insertNode(root, br.id, 1, e2);
  rects[e1.id] = { x: 0, y: 300, w: 1000, h: 100 };
  rects[e2.id] = { x: 0, y: 400, w: 1000, h: 100 };
  const top = resolveDrop(root, rects, { x: 50, y: 310 }, { kind: "element", elementType: "x" });
  assert.equal(top.index, 0);
  const mid = resolveDrop(root, rects, { x: 50, y: 395 }, { kind: "element", elementType: "x" });
  assert.equal(mid.index, 1);
  const end = resolveDrop(root, rects, { x: 50, y: 590 }, { kind: "element", elementType: "x" });
  assert.equal(end.index, 2);
  assert.equal(end.indicator.kind, "line");
});

test("drop: section hanya di antara section; memindah kontainer ke dirinya ditolak", () => {
  const { root, a, rects } = pageWithRects();
  const r = resolveDrop(root, rects, { x: 500, y: 450 }, { kind: "section", presetId: "cta" });
  assert.equal(r.parentId, "root");
  assert.equal(r.index, 2);
  const top = resolveDrop(root, rects, { x: 500, y: 5 }, { kind: "node", id: a.id });
  assert.equal(top.index, 0);
  // a column dragged into itself → another target / null, never itself
  const col = a.children[0].children[0];
  const self = resolveDrop(root, rects, { x: 100, y: 100 }, { kind: "node", id: col.id });
  assert.notEqual(self?.parentId, col.id);
});

test("sectionOf mencari section induk", () => {
  const { root, a, ar } = pageWithRects();
  assert.equal(sectionOf(root, ar.children[2].id).id, a.id);
  assert.equal(rowOf(root, ar.children[2].id).id, ar.id);
  assert.equal(rowOf(root, ar.id).id, ar.id);
  assert.equal(rowOf(root, a.id), null);
  assert.equal(sectionOf(root, a.id).id, a.id);
  assert.equal(sectionOf(root, "root"), null);
});


/* --------------------- Section → Row → Element ---------------------- */

test("section = blok: tidak ada display flex/grid pada section, anak bukan alignSelf", () => {
  const sec = createSectionFromPreset("hero-split");
  const root = createPageRoot([sec]);
  const c = compose(root, { rootClass: "pg", icons });
  const cls = c.html.body.match(/<section class="([^"]+)"/)[1];
  const rule = c.html.css.match(new RegExp(`\\.${cls} \\{[^}]*\\}`))[0];
  assert.match(rule, /display: block/);
  assert.doesNotMatch(rule, /flex|grid|gap/);
});

test("placeNode: konten ke section dibungkus Row; Row ke dalam Row naik jadi saudara", () => {
  const sec = createSectionFromPreset("single");
  const root = createPageRoot([sec]);
  const e = el();
  const p = placeNode(root, sec.id, 1, e);
  assert.ok(p.id);
  const sec2 = findNode(p.root, sec.id);
  assert.equal(sec2.children.length, 2);
  assert.ok(isRow(sec2.children[1]));
  assert.equal(sec2.children[1].children[0].id, e.id);
  // content into the root is rejected
  assert.equal(placeNode(root, root.id, 0, el()).id, null);
  // a Row inside a Row → becomes the sibling right below it
  const first = sec.children[0];
  const nr = createRow({ name: "Baru" });
  const q = placeNode(root, first.id, 0, nr);
  const s3 = findNode(q.root, sec.id);
  assert.deepEqual(s3.children.map((c) => c.id), [first.id, nr.id]);
  // a Row onto the root is rejected; a section into a Row is rejected
  assert.equal(placeNode(root, root.id, 0, createRow()).id, null);
  assert.equal(placeNode(root, first.id, 0, createSectionFromPreset("cta")).id, null);
});

test("(+) elemen: sisip tepat di bawah elemen (saudara berikutnya di Row yang sama)", () => {
  const sec = createSectionFromPreset("single");
  const a = el(), b = el("text"), c = el("badge");
  sec.children[0].children.push(a, b);
  const root = createPageRoot([sec]);
  const loc = findParent(root, a.id);
  const p = placeNode(root, loc.parent.id, loc.index + 1, c);
  const kids = findNode(p.root, sec.children[0].id).children.map((x) => x.id);
  assert.deepEqual(kids, [a.id, c.id, b.id]);
});

test("(+) Row: Row baru tepat di bawah Row terpilih; setiap varian valid", () => {
  const sec = createSectionFromPreset("features-3");
  const r2 = createRow({ name: "R2" });
  sec.children.push(r2);
  const root = createPageRoot([sec]);
  const mid = createRowVariant("2");
  const p = placeNode(root, sec.children[0].id, 0, mid);
  const names = findNode(p.root, sec.id).children.map((x) => x.id);
  assert.deepEqual(names, [sec.children[0].id, mid.id, r2.id]);
  for (const v of ROW_VARIANTS) {
    const r = v.build();
    assert.ok(isRow(r), v.id);
    assert.equal(canInsertInto(root, sec.id, r), true);
  }
});

test("Row bisa di-styling dan gayanya masuk CSS", () => {
  const sec = createSectionFromPreset("single");
  const row = sec.children[0];
  row.bgEnabled = true;
  row.bgColor = "#ff0000";
  row.padding = 20;
  row.borderRadius = 8;
  const c = compose(createPageRoot([sec]), { rootClass: "pg", icons });
  assert.match(c.html.css, /background: #ff0000/);
  assert.match(c.html.css, /padding: 20px/);
  assert.match(c.html.css, /border-radius: 8px/);
  // flag row lolos normalisasi
  const d = normalizePageDoc({ version: 2, root: createPageRoot([sec]) });
  assert.equal(d.root.children[0].children[0].row, true);
  assert.equal(d.root.children[0].children[0].bgColor, "#ff0000");
});

test("migrasi halaman lama: section flex/grid + kolom langsung → section blok + satu Row (tampilan sama)", () => {
  const old = createSectionFromPreset("features-3");
  // old shape: columns directly in a grid section
  const cells = old.children[0].children;
  cells[1].children.push(el("badge"));
  old.layout = "grid";
  old.columns = "repeat(3, minmax(0, 1fr))";
  old.gap = 32;
  old.children = cells;
  const d = normalizePageDoc({ version: 2, root: createPageRoot([old]) });
  const sec = d.root.children[0];
  assert.equal(sec.layout, "block");
  assert.equal(sec.children.length, 1);
  const row = sec.children[0];
  assert.ok(isRow(row));
  assert.equal(row.layout, "grid");
  assert.equal(row.columns, "repeat(3, minmax(0, 1fr))");
  assert.equal(row.gap, 32);
  assert.equal(row.children.length, 3);
  assert.equal(countElements(d.root), 1);
  // idempoten
  assert.deepEqual(normalizePageDoc(d), d);
  // elements directly in an old stack section → Row
  const old2 = createSectionFromPreset("single");
  old2.children = [el(), el("text")];
  old2.layout = "stack";
  const d2 = normalizePageDoc({ version: 2, root: createPageRoot([old2]) });
  assert.equal(d2.root.children[0].children.length, 1);
  assert.equal(d2.root.children[0].children[0].children.length, 2);
  // an old empty section (flex/grid) becomes a block
  const old3 = createSectionFromPreset("single");
  old3.children = [];
  old3.layout = "grid";
  assert.equal(normalizePageDoc({ version: 2, root: createPageRoot([old3]) }).root.children[0].layout, "block");
});

test("tidak ada Row bersarang & tidak ada section/Row di bawah Row setelah normalisasi", () => {
  const sec = createSectionFromPreset("single");
  const inner = createRow({ name: "dalam" });
  sec.children[0].children.push(inner);
  const d = normalizePageDoc({ version: 2, root: createPageRoot([sec]) });
  let rows = 0;
  walk(d.root, (n) => { if (isRow(n)) rows++; });
  assert.equal(rows, 1);
});

test("movePageNode: pindah elemen antar Row; pindah Row; Row tidak masuk grup", () => {
  const sec = createSectionFromPreset("features-3");
  const r2 = createRow({ name: "R2" });
  const e = el();
  sec.children[0].children[0].children.push(e);
  sec.children.push(r2);
  const root = createPageRoot([sec]);
  const m = movePageNode(root, e.id, r2.id, 0);
  assert.equal(findNode(m, r2.id).children[0].id, e.id);
  const m2 = movePageNode(root, r2.id, sec.id, 0);
  assert.equal(findNode(m2, sec.id).children[0].id, r2.id);
  const cell = sec.children[0].children[0];
  assert.equal(movePageNode(root, r2.id, cell.id, 0) === root || findParent(movePageNode(root, r2.id, cell.id, 0), r2.id).parent.id !== cell.id, true);
  // Row drop: only between Rows within a section
  const rects = {
    root: { x: 0, y: 0, w: 1000, h: 600 },
    [sec.id]: { x: 0, y: 0, w: 1000, h: 600 },
    [sec.children[0].id]: { x: 0, y: 0, w: 1000, h: 300 },
    [r2.id]: { x: 0, y: 300, w: 1000, h: 300 },
  };
  const d = resolveDrop(root, rects, { x: 500, y: 100 }, { kind: "row", variant: "2" });
  assert.equal(d.parentId, sec.id);
  assert.equal(d.index, 0);
  const d2 = resolveDrop(root, rects, { x: 500, y: 590 }, { kind: "row", variant: "2" });
  assert.equal(d2.index, 2);
});


/* --------------------------- background ----------------------------- */

import { backgroundCss, gradientCss, sanitizeBg, withOpacity } from "../core/helpers/background";
import { boxBackground } from "../engine/helpers/componentTypes";

test("background: solid, none, gradient linear/radial + warna tengah", () => {
  assert.equal(backgroundCss({ bgType: "solid", bgColor: "#123456" }), "#123456");
  assert.equal(backgroundCss({ bgType: "none", bgColor: "#123456" }), "none");
  assert.equal(
    backgroundCss({ bgType: "gradient", gradientFrom: "#000000", gradientTo: "#ffffff", gradientAngle: 45 }),
    "linear-gradient(45deg, #000000, #ffffff)",
  );
  assert.equal(
    gradientCss({ gradientKind: "radial", gradientFrom: "#000", gradientVia: "#f00", gradientTo: "#fff" }),
    "radial-gradient(circle, #000, #f00, #fff)",
  );
  // a malicious color cannot close the declaration
  assert.equal(gradientCss({ gradientFrom: "red;}body{x:y", gradientTo: "#fff", gradientAngle: 0 }), "linear-gradient(0deg, transparent, #fff)");
});

test("background: gambar + ukuran/posisi/ulangi/parallax/overlay; URL berbahaya → warna", () => {
  const v = backgroundCss({
    bgType: "image", bgColor: "#111111", bgImage: "https://x.com/a.jpg", bgSize: "contain",
    bgPosition: "top left", bgRepeat: "repeat-x", bgAttachment: "fixed", bgOverlayColor: "#000000", bgOverlayOpacity: 40,
  });
  assert.equal(v, 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url("https://x.com/a.jpg") top left / contain repeat-x fixed #111111');
  assert.equal(backgroundCss({ bgType: "image", bgColor: "#fff", bgImage: 'x.jpg") ;}body{' }), "#fff");
  assert.equal(backgroundCss({ bgType: "image", bgColor: "#fff", bgImage: "javascript:alert(1)" }), "#fff");
  assert.ok(isSafeBgImage("data:image/png;base64,AAAA"));
  assert.ok(!isSafeBgImage("data:text/html;base64,AAAA"));
  assert.equal(withOpacity("#fff", 50), "rgba(255, 255, 255, 0.5)");
});

test("background kontainer: data lama (bgEnabled / section.bgImage) tetap tampil & bisa diubah", () => {
  const s = createSectionFromPreset("cta"); // old bgEnabled + bgColor
  assert.equal(boxBackground(s).bgType, "solid");
  const c1 = compose(createPageRoot([s]), { rootClass: "pg", icons });
  assert.match(c1.html.css, /background: #eff6ff;/);
  // new type: gradient on a Row
  const row = s.children[0];
  Object.assign(row, { bgType: "gradient", gradientFrom: "#ff0000", gradientTo: "#0000ff", gradientAngle: 180, gradientKind: "linear" });
  const d = normalizePageDoc({ version: 2, root: createPageRoot([s]) });
  assert.equal(d.root.children[0].children[0].bgType, "gradient");
  const c2 = compose(d.root, { rootClass: "pg", icons });
  assert.match(c2.html.css, /background: linear-gradient\(180deg, #ff0000, #0000ff\);/);
  // bgType "none" → no background declaration
  const g = sanitizeBg({ bgType: "zzz", bgOverlayOpacity: 500 }, "none");
  assert.equal(g.bgType, "none");
  assert.equal(g.bgOverlayOpacity, 100);
});

test("background elemen: tipe gambar & gradient radial masuk ke CSS elemen", () => {
  const sec = createSectionFromPreset("single");
  const b = el("button");
  Object.assign(b.state, { bgType: "image", bgImage: "/img/bg.png", bgColor: "#000000" });
  const card = el("card");
  Object.assign(card.state, { bgType: "gradient", gradientKind: "radial", gradientFrom: "#ffffff", gradientTo: "#000000" });
  sec.children[0].children.push(b, card);
  const c = compose(createPageRoot([sec]), { rootClass: "pg", icons });
  assert.match(c.html.css, /background: url\("\/img\/bg.png"\) center \/ cover no-repeat #000000;/);
  assert.match(c.html.css, /radial-gradient\(circle, #ffffff, #000000\)/);
});


/* ------------------------------ event JS ----------------------------- */

import { EVENT_ELEMENT_TYPES, eventCodeError, handlerName, sanitizeEvents } from "../engine/helpers/events";

function pageWith(nodes) {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(...nodes);
  return createPageRoot([sec]);
}

test("event: onClick gratis di semua framework; premium diabaikan tanpa kredit", () => {
  const b = el("button");
  b.events = [{ name: "onClick", code: "console.log('hai');" }, { name: "onMouseDown", code: "console.log(1)" }];
  const root = pageWith([b]);
  const c = compose(root, { rootClass: "pg", icons });
  assert.ok(c.warnings.some((w) => /onMouseDown.*kredit/.test(w.message)));
  assert.match(c.html.script, /function handleButton1Click\(event\) \{\n {2}console.log\('hai'\);\n\}/);
  assert.match(c.html.script, /querySelectorAll\("\.pg__button-1"\)[\s\S]*addEventListener\("click", handleButton1Click\)/);
  assert.doesNotMatch(c.html.script, /mousedown/);
  const react = c.files("react")[0].content;
  assert.match(react, /onClick=\{handleButton1Click\}/);
  assert.match(react, /function handleButton1Click\(event\)/);
  assert.match(c.files("vue")[0].content, /@click="handleButton1Click"[\s\S]*<script setup>[\s\S]*function handleButton1Click/);
  const sv = c.files("svelte")[0].content;
  assert.match(sv, /on:click=\{handleButton1Click\}/);
  assert.match(sv, /<script>[\s\S]*function handleButton1Click/);
  const ng = c.files("angular");
  assert.match(ng.find((f) => f.name.endsWith(".component.html")).content, /\(click\)="handleButton1Click\(\$event\)"/);
  assert.match(ng.find((f) => f.name.endsWith(".component.ts")).content, /handleButton1Click\(event: any\): void \{/);
  // with credits (option) premium events are included
  const paid = compose(root, { rootClass: "pg", icons, allowPremiumEvents: true });
  assert.match(paid.html.script, /addEventListener\("mousedown", handleButton1MouseDown\)/);
  assert.match(paid.files("react")[0].content, /onMouseDown=\{handleButton1MouseDown\}/);
});

test("event: tidak jalan di canvas desain, kode tidak valid dibuang, elemen form memakai kontrolnya", () => {
  const b = el("button");
  b.events = [{ name: "onClick", code: "alert(1)" }];
  const bad = el("anchor");
  bad.events = [{ name: "onClick", code: "if ( {" }];
  const chk = el("checkbox");
  chk.events = [{ name: "onClick", code: "console.log(event.target.checked)" }];
  const root = pageWith([b, bad, chk]);
  const pv = compose(root, { rootClass: "pg", icons, preview: true });
  assert.doesNotMatch(pv.html.script, /handleButton1Click/);
  const ex = compose(root, { rootClass: "pg", icons });
  assert.match(ex.html.script, /handleButton1Click/);
  assert.doesNotMatch(ex.html.script, /handleAnchor1Click/);
  assert.ok(ex.warnings.some((w) => /tidak valid/.test(w.message)));
  // checkbox: the event is attached to the <input>, not the wrapping label
  assert.match(ex.files("react")[0].content, /<input[^>]*onClick=\{handleCheckbox1Click\}/);
  assert.equal(eventCodeError("let x = 1;"), null);
  assert.ok(eventCodeError("let = ;"));
  assert.equal(handlerName("pg__switch-12", "pg", "onChange"), "handleSwitch12Change");
});

test("event: semua elemen pendukung tidak stateful (bawaan) & data tersimpan dibersihkan", () => {
  for (const t of EVENT_ELEMENT_TYPES) {
    const n = el(t);
    n.events = [{ name: "onClick", code: "1" }];
    const c = compose(pageWith([n]), { rootClass: "pg", icons });
    assert.ok(!c.warnings.length, `${t}: ${JSON.stringify(c.warnings)}`);
    assert.match(c.files("react")[0].content, /onClick=\{handle/, t);
  }
  const ev = sanitizeEvents([{ name: "onClick", code: "x" }, { name: "onClick", code: "dup" }, { name: "onEvil", code: "x" }, 5, { name: "onBlur", code: 7 }]);
  assert.deepEqual(ev, [{ name: "onClick", code: "x" }, { name: "onBlur", code: "" }]);
  assert.equal(sanitizeEvents("x"), undefined);
  // The event feature was removed from edit mode: stored events move to Custom JavaScript when opened.
  const b = el("button");
  b.events = [{ name: "onClick", code: "go()" }];
  b.advanced = { customJs: "console.log('lama');" };
  const d = normalizePageDoc({ version: 2, root: pageWith([b]) });
  const nb = d.root.children[0].children[0].children[0];
  assert.equal(nb.events, undefined);
  assert.match(nb.advanced.customJs, /^console\.log\('lama'\);\n\nvar target = element;\n\/\/ onClick[^\n]*\non\(target, "click", function \(event\) \{\n {2}go\(\)\n\}\);$/);
  assert.equal(eventCodeError(nb.advanced.customJs), null);
  const ex = compose(d.root, { rootClass: "pg", icons });
  assert.ok(ex.html.script.includes('on(target, "click"'));
  // form elements: the event is attached to the control
  const ck = el("checkbox");
  ck.events = [{ name: "onChange", code: "x()" }, { name: "onBlur", code: "  " }];
  const nc = normalizePageDoc({ version: 2, root: pageWith([ck]) }).root.children[0].children[0].children[0];
  assert.match(nc.advanced.customJs, /querySelector\("input, select, textarea"\)/);
  assert.match(nc.advanced.customJs, /"change"/);
  assert.doesNotMatch(nc.advanced.customJs, /"blur"/);
  // elements that do not support events → a warning, no handler
  const t = el("tabs");
  t.events = [{ name: "onClick", code: "1" }];
  const c = compose(pageWith([t]), { rootClass: "pg", icons });
  assert.ok(c.warnings.some((w) => /tidak didukung/.test(w.message)));
});

/* ---------------------- download quota & preview ---------------------- */

import { FREE_EXPORTS, serverExport } from "../../../credits/downloadQuota";
import { limitedPreview } from "../core/ui/CodeExportPanel";
import { apiConfig, configureApi } from "../../media/processing/apiConfig";
import { emptyAccount, useMarketStore } from "../../../marketplace/account";

test("ekspor server: kode dari POST /exports; ulang identik tidak dihitung; habis → blocked, bayar → paid", async () => {
  assert.equal(FREE_EXPORTS, 20);
  const seen = new Set();
  const bodies = [];
  let balance = 5;
  const prev = { baseUrl: apiConfig.baseUrl, fetch: apiConfig.fetch };
  const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
  configureApi({
    baseUrl: "http://api.test",
    fetch: async (url, init = {}) => {
      assert.equal(String(url), "http://api.test/exports");
      assert.equal(init.credentials, "include");
      const b = JSON.parse(String(init.body));
      bodies.push(b);
      // The server computes its own fingerprint from the content (here: framework + rootClass).
      const fp = `${b.framework}:${b.rootClass}`;
      const files = [{ name: "index.html", content: `<main class="${b.rootClass}"></main>`, lang: "html" }];
      const q = () => ({ used: Math.min(seen.size, 20), free: 20, remaining: Math.max(0, 20 - seen.size), cost: 1 });
      if (b.id === "premium") return json(402, { error: "Item Premium terkunci", code: "PREMIUM_ITEMS_LOCKED", items: ["preset:x"] });
      if (seen.has(fp)) return json(200, { result: "repeat", files, fingerprint: fp, ...q() });
      if (seen.size < 20) {
        seen.add(fp);
        return json(200, { result: "counted", files, fingerprint: fp, ...q() });
      }
      if (!b.pay) return json(402, { error: "Kuota habis", code: "EXPORT_QUOTA_EXCEEDED", cost: 1 });
      balance -= 1;
      seen.add(fp);
      return json(200, { result: "paid", files, fingerprint: fp, ...q(), account: { balance, entitlements: {} } });
    },
  });
  try {
    useMarketStore.setState({ account: emptyAccount(), status: "ready" });
    const src = (n) => ({ kind: "page", id: "d1", rootClass: `p${n}` });
    for (let i = 0; i < 20; i++) {
      const r = await serverExport(src(i), "html", "id");
      assert.equal(r.result, "counted");
      assert.equal(r.files[0].name, "index.html", "berkas berasal dari server");
    }
    assert.equal(useMarketStore.getState().account.limits.exports.remaining, 0, "sisa kuota dari respons server");
    assert.equal((await serverExport(src(3), "html", "id")).result, "repeat");
    const blocked = await serverExport(src(3), "react", "id");
    assert.equal(blocked.result, "blocked");
    assert.equal(blocked.files.length, 0, "tanpa bayar tidak ada berkas");
    assert.equal(blocked.quota.cost, 1);
    const paid = await serverExport(src(3), "react", "id", true);
    assert.equal(paid.result, "paid");
    assert.equal(useMarketStore.getState().account.balance, 4, "saldo dari server");
    assert.equal(bodies.at(-1).pay, true);
    assert.ok(Array.isArray(bodies.at(-1).icons), "ikon global ikut dikirim");
    await assert.rejects(serverExport({ kind: "page", id: "premium" }, "html", "id"), (e) => e.code === "PREMIUM_ITEMS_LOCKED");
  } finally {
    configureApi(prev);
    useMarketStore.setState({ account: emptyAccount(), status: "idle" });
  }
});

test("pratinjau kode terbatas: sebagian baris saja, sisanya tidak dikirim", () => {
  const code = Array.from({ length: 100 }, (_, i) => `baris ${i + 1}`).join("\n");
  const p = limitedPreview(code);
  assert.equal(p.visible.split("\n").length, 24);
  assert.equal(p.hidden, 76);
  assert.ok(!p.visible.includes("baris 25"));
  const short = limitedPreview("a\nb\nc");
  assert.equal(short.hidden, 0);
  const mid = limitedPreview(Array.from({ length: 30 }, (_, i) => `${i}`).join("\n"));
  assert.equal(mid.visible.split("\n").length, 12);
});


/* ----------------------------- Row width ----------------------------- */

import { rowWidthRules } from "../engine/helpers/compose";

test("lebar Row: ikut lebar isi (bawaan), 80%, 100% penuh, kustom px/% — preview == export", () => {
  const sec = { contentWidth: 1120 };
  const row = (p = {}) => ({ ...createSectionFromPreset("single").children[0], ...p });
  assert.deepEqual(rowWidthRules(row(), sec), { maxWidth: "1120px", marginLeft: "auto", marginRight: "auto" });
  assert.deepEqual(rowWidthRules(row(), { contentWidth: 0 }), {});
  assert.deepEqual(rowWidthRules(row({ rowWidth: "full" }), sec), { width: "100%", maxWidth: "none" });
  assert.equal(rowWidthRules(row({ rowWidth: "80" }), sec).width, "80%");
  assert.equal(rowWidthRules(row({ rowWidth: "custom", rowCustomWidth: 640, rowCustomUnit: "px" }), sec).width, "640px");
  assert.equal(rowWidthRules(row({ rowWidth: "custom", rowCustomWidth: 500, rowCustomUnit: "%" }), sec).width, "100%");
  const s = createSectionFromPreset("single");
  s.children[0].rowWidth = "full";
  const c = compose(createPageRoot([s]), { rootClass: "pg", icons });
  assert.match(c.html.css, /\.pg__box-2 \{[^}]*width: 100%;[^}]*max-width: none;/);
  assert.doesNotMatch(c.html.css, /\.pg__box-2 \{[^}]*1120px/);
  const pv = compose(createPageRoot([s]), { rootClass: "pg", icons, preview: true });
  assert.equal(pv.html.css, c.html.css);
  // tersimpan
  const d = normalizePageDoc({ version: 2, root: createPageRoot([s]) });
  assert.equal(d.root.children[0].children[0].rowWidth, "full");
});
