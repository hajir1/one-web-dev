// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import {
  BUILTIN_VARS,
  bindVars,
  countRefs,
  detachRefs,
  isValidVarValue,
  normalizeVarName,
  renameRefs,
  restoreVars,
  rootVarsCss,
  sanitizeVars,
  validateVarName,
} from "../../pageMaker/core/helpers/cssVars";
import { fontLoadCss, libraryFontVars } from "../../pageMaker/core/helpers/fontCss";
import { compose } from "../../pageMaker/engine/helpers/compose";
import { createDefaultDoc, normalizeDoc } from "../../pageMaker/engine/helpers/migrate";
import { createElementNode, insertNode } from "../../pageMaker/engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D, GENERIC_FONT_TYPES, NATIVE_FONT_TYPES } from "../../pageMaker/core/elementDefinitions";
import { makeIconLookup } from "../../pageMaker/core/helpers/elementDefinition";
import { mergeWithDefault } from "../../pageMaker/core/hooks/useDesignSaver";
import { withBuiltins } from "../../pageMaker/core/store/varStore";

const icons = makeIconLookup([]);
const v = (name, type, value) => ({ id: name, name, type, value });
const docWith = (type, state) => {
  const doc = createDefaultDoc();
  return insertNode(doc.root, doc.root.id, 0, createElementNode(type, { ...D[type].defaults, ...state }, "El"));
};
const opts = (extra = {}) => ({ rootClass: "demo", icons, ...extra });

test("nama variabel dinormalisasi ke format CSS dan divalidasi", () => {
  assert.equal(normalizeVarName("  --Warna Utama "), "warna-utama");
  assert.equal(normalizeVarName("x"), "x");
  assert.equal(validateVarName("", []), "nameEmpty");
  assert.equal(validateVarName("a;b", []), "nameInvalid");
  assert.equal(validateVarName("x.y", []), "nameInvalid");
  assert.equal(validateVarName("--X", [v("x", "color", "#000")]), "nameTaken");
  assert.equal(validateVarName("x", [v("x", "color", "#000")], "x"), null, "nama sendiri boleh saat edit");
  assert.equal(validateVarName("aksen_2", []), null);
});

test("nilai divalidasi sesuai tipe", () => {
  for (const ok of ["#000", "#000000", "#00000080", "rgb(0, 0, 0)", "hsl(200 50% 40%)", "transparent"]) assert.ok(isValidVarValue("color", ok), ok);
  for (const bad of ["red; x", "#12", "url(x)", "var(--y)"]) assert.ok(!isValidVarValue("color", bad), bad);
  for (const ok of ["16px", "1.5rem", "50%", "0", "-4px", "10vw"]) assert.ok(isValidVarValue("size", ok), ok);
  for (const bad of ["16", "px", "1.5 rem", "calc(1px)"]) assert.ok(!isValidVarValue("size", bad), bad);
  assert.ok(isValidVarValue("font", '"Poppins", sans-serif'));
  assert.ok(!isValidVarValue("font", "a;b{"));
  assert.ok(isValidVarValue("text", '"Halo"'));
  assert.ok(!isValidVarValue("text", "a}b"));
  assert.ok(!isValidVarValue("text", "url(javascript:x)"));
});

test(":root berisi --x: #000000; untuk variabel x", () => {
  assert.match(rootVarsCss([v("x", "color", "#000000")]), /:root \{\n {2}--x: #000000;\n\}/);
  assert.equal(rootVarsCss([]), "");
});

test("sanitizeVars membuang data rusak & duplikat; bawaan selalu ada", () => {
  const out = sanitizeVars([v("x", "color", "#000"), v("x", "color", "#fff"), { name: "y", type: "size", value: "abc" }, null, v("z", "nope", "1")]);
  assert.deepEqual(out.map((o) => o.name), ["x"]);
  const all = withBuiltins([v("color-primary", "color", "#ff0000"), v("mine", "size", "2rem")]);
  assert.equal(all.find((x) => x.name === "color-primary").value, "#ff0000");
  assert.ok(all.find((x) => x.name === "color-primary").builtin);
  assert.equal(all.length, BUILTIN_VARS.length + 1);
  assert.ok(!all.find((x) => x.name === "mine").builtin);
});

test("compose: warna dari variabel ditulis sebagai var(--x) dan :root ikut", () => {
  const root = docWith("text", { textColor: "var(--aksen)" });
  const c = compose(root, opts({ vars: [v("aksen", "color", "#ff0000")] }));
  assert.match(c.html.css, /--aksen: #ff0000;/);
  assert.match(c.html.css, /color: var\(--aksen\);/);
  assert.ok(!c.html.css.includes("#7a"), "sentinel tidak bocor");
  assert.equal(c.warnings.length, 0);
});

test("compose: ukuran dari variabel menggantikan Npx", () => {
  const root = docWith("button", { paddingTop: "var(--gap)", paddingLinked: false });
  const c = compose(root, opts({ vars: [v("gap", "size", "1.5rem")] }));
  assert.match(c.html.css, /var\(--gap\)/);
  assert.ok(!c.html.css.includes("917301"));
});

test("compose: field yang diolah generator memakai nilai variabel saat ini + peringatan", () => {
  // fluidType: the font size is computed as clamp(min, …, max) → cannot be mapped directly.
  const root = docWith("text", { fontSize: "var(--besar)", fluidType: true });
  const c = compose(root, opts({ vars: [v("besar", "size", "48px")] }));
  assert.ok(!c.html.css.includes("917301"));
  assert.ok(c.warnings.some((w) => w.message.includes("--besar")), JSON.stringify(c.warnings));
  assert.match(c.html.css, /48px/);
});

test("compose: variabel hilang → nilai bawaan field + peringatan", () => {
  const root = docWith("text", { textColor: "var(--hilang)" });
  const c = compose(root, opts({ vars: [] }));
  assert.ok(c.warnings.some((w) => w.message.includes("--hilang")));
  assert.match(c.html.css, /color: var\(--hilang\);/);
});

test("compose: salinan variabel di desain dipakai bila variabel global tidak ada", () => {
  let root = docWith("text", { textColor: "var(--aksen)" });
  root = { ...root, vars: [v("aksen", "color", "#00ff00")] };
  const c = compose(root, opts());
  assert.match(c.html.css, /--aksen: #00ff00;/);
  const c2 = compose(root, opts({ vars: [v("aksen", "color", "#0000ff")] }));
  assert.match(c2.html.css, /--aksen: #0000ff;/, "variabel global terkini menang");
});

test("font: referensi var(--font-x) dimuat (Google Fonts) dan berubah mengikuti pustaka", () => {
  const poppins = { id: "f1", name: "Poppins", source: "google", fallback: "sans-serif", weights: [400], url: "", createdAt: 1 };
  const fvars = libraryFontVars([poppins]);
  assert.equal(fvars[0].name, "font-poppins");
  const root = docWith("text", { fontFamily: "var(--font-poppins)" });
  const c = compose(root, opts({ fonts: [poppins], vars: fvars }));
  assert.match(c.html.css, /font-family: var\(--font-poppins\);/);
  assert.match(c.html.css, /--font-poppins: "Poppins", sans-serif;/);
  assert.ok(c.html.css.startsWith("@import"), "font dimuat walau lewat variabel");
  assert.match(c.fontLoaders, /fonts\.googleapis\.com/);
  // Changing a library font's fallback → the variable value follows, element references stay.
  const c2 = compose(root, opts({ fonts: [{ ...poppins, fallback: "serif" }], vars: libraryFontVars([{ ...poppins, fallback: "serif" }]) }));
  assert.match(c2.html.css, /--font-poppins: "Poppins", serif;/);
  assert.match(c2.html.css, /font-family: var\(--font-poppins\);/);
});

test("font umum: elemen tanpa generator font (mis. Card, Input) tetap mendapat font-family", () => {
  assert.ok(NATIVE_FONT_TYPES.has("text") && NATIVE_FONT_TYPES.has("button"));
  for (const t of ["card", "input", "table", "tabs", "accordion", "select", "menu"]) {
    assert.ok(GENERIC_FONT_TYPES.has(t), t);
    assert.equal(D[t].defaults.fontFamily, "", t);
  }
  assert.ok(!GENERIC_FONT_TYPES.has("image") && !GENERIC_FONT_TYPES.has("divider"));
  const root = docWith("input", { fontFamily: "var(--font-heading)" });
  const c = compose(root, opts({ vars: BUILTIN_VARS }));
  assert.match(c.html.css, /font-family: var\(--font-heading\);/);
  assert.match(c.html.css, /:where\(input, select, textarea, button\) \{\n {2}font-family: inherit;/);
});

test("font judul/isi global: hanya ditulis bila diubah dari bawaan", () => {
  const root = docWith("text", {});
  const plain = compose(root, opts({ vars: BUILTIN_VARS }));
  assert.ok(!plain.html.css.includes("var(--font-heading)"));
  const changed = BUILTIN_VARS.map((b) => (b.name === "font-heading" ? { ...b, value: '"Lora", serif' } : b.name === "font-body" ? { ...b, value: '"Inter", sans-serif' } : b));
  const c = compose(root, opts({ vars: changed }));
  assert.match(c.html.css, /:where\(\.demo\) :where\(h1, h2, h3, h4, h5, h6\) \{\n {2}font-family: var\(--font-heading\);/);
  assert.match(c.html.css, /\.demo \{[^}]*font-family: var\(--font-body\);/);
});

test("referensi: hitung, ganti nama, lepas", () => {
  const state = { root: { children: [{ state: { textColor: "var(--x)", fontSize: "var(--s)", css: "a{color:var(--x)}" } }] } };
  assert.equal(countRefs(state, "x"), 2);
  const r = renameRefs(state, "x", "y");
  assert.ok(r.changed);
  assert.equal(countRefs(r.value, "y"), 2);
  assert.equal(countRefs(r.value, "x"), 0);
  const d = detachRefs(state, v("s", "size", "1.5rem"));
  assert.equal(d.value.root.children[0].state.fontSize, 24, "ukuran dilepas jadi angka px");
  const d2 = detachRefs(state, v("x", "color", "#123456"));
  assert.equal(d2.value.root.children[0].state.textColor, "#123456");
  assert.equal(d2.value.root.children[0].state.css, "a{color:#123456}");
});

test("mergeWithDefault menerima var(--x) di field angka/warna, menolak di boolean", () => {
  const m = mergeWithDefault({ size: 10, color: "#000", on: true }, { size: "var(--a)", color: "var(--b)", on: "var(--c)" });
  assert.equal(m.size, "var(--a)");
  assert.equal(m.color, "var(--b)");
  assert.equal(m.on, true);
});

test("normalizeDoc menyimpan salinan variabel di root", () => {
  const doc = createDefaultDoc();
  const n = normalizeDoc({ ...doc, root: { ...doc.root, vars: [v("x", "color", "#000"), { name: "bad;" }] } });
  assert.deepEqual(n.root.vars.map((x) => x.name), ["x"]);
});

test("bindVars/restoreVars: aman untuk satuan selain px", () => {
  const b = bindVars({ dur: 150 }, { dur: "var(--t)" }, [v("t", "size", "200px")]);
  assert.equal(restoreVars(`transition: ${b.bindings[0].sentinel}ms;`, "transition: 200ms;", b.bindings), null);
  assert.equal(fontLoadCss("a{font-family:var(--f)}", [{ id: "1", name: "Lora", source: "google", fallback: "serif", weights: [400], url: "", createdAt: 0 }], [v("f", "font", '"Lora", serif')]).includes("Lora"), true);
});
