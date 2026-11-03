// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D, ELEMENT_GROUP_ORDER } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset } from "../helpers/pageDoc";
import { THREE_D_TYPES, parseMarkers, safeModelUrl } from "../core/elements/three/ThreeElements";
import { OWD3D_MODULE, OWD3D_RUNTIME, THREE_VERSION } from "../core/elements/three/runtime";
import { motionVars } from "../core/store/motionStore";
import { DEFAULT_MOTION } from "../engine/helpers/motion";
import { DEFAULT_THREE } from "../core/store/motionStore";
import { LIBRARY_BY_ID } from "../engine/helpers/libraries";
import { ELEMENT_3D_PRICE, isValidPrice } from "../../../config/marketplace";
import { elementPrice } from "../../../marketplace/data/prices";

/* v9: 5 elemen 3D Premium (Three.js dimuat dinamis, gambar statis cadangan). */

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
const VARS = motionVars(DEFAULT_MOTION, DEFAULT_THREE);

function page(types) {
  const sec = createSectionFromPreset("single");
  for (const t of types) sec.children[0].children.push(createElementNode(t, structuredClone(D[t].defaults), D[t].label));
  return createPageRoot([sec]);
}

test("3D: 5 elemen terdaftar di grup 3D, semuanya Premium dengan harga 10–25 kredit", () => {
  assert.deepEqual(THREE_D_TYPES, ["three-product", "three-shape", "three-globe", "three-particles", "card-3d"]);
  assert.ok(ELEMENT_GROUP_ORDER.includes("3D"));
  for (const t of THREE_D_TYPES) {
    assert.equal(D[t].group, "3D", t);
    assert.equal(D[t].premium, true, t);
    assert.equal(elementPrice(t, "premium"), ELEMENT_3D_PRICE[t], t);
    assert.ok(isValidPrice("element3d", "premium", ELEMENT_3D_PRICE[t]), t);
  }
  // Kartu tilt tidak butuh Three.js.
  assert.deepEqual(D["card-3d"].libraries, undefined);
  for (const t of THREE_D_TYPES.slice(0, 4)) assert.deepEqual(D[t].libraries, ["three"], t);
});

test("3D: runtime valid, versi Three.js dikunci, lisensi MIT, dimuat dinamis", () => {
  assert.equal(THREE_VERSION, "0.186.1");
  assert.ok(!OWD3D_RUNTIME.includes("`"), "runtime tanpa backtick");
  assert.ok(!OWD3D_RUNTIME.includes("${"), "runtime tanpa ${");
  assert.doesNotThrow(() => new Function(OWD3D_RUNTIME.replace(/import\(/g, "Promise.resolve(")));
  assert.match(OWD3D_RUNTIME, /three@" \+ VERSION/);
  assert.match(OWD3D_RUNTIME, /IntersectionObserver/);
  assert.match(OWD3D_RUNTIME, /is-3d-fallback/);
  assert.match(OWD3D_MODULE, /export function mount3d/);
  const lib = LIBRARY_BY_ID.three;
  assert.equal(lib.license, "MIT");
  assert.equal(lib.esm, "https://cdn.jsdelivr.net/npm/three@0.186.1/+esm");
  assert.equal(lib.js, undefined, "tidak ada tag <script> statis");
});

test("3D: tanpa kredit elemen terkunci; dengan kredit lengkap di 5 framework tanpa peringatan", () => {
  const root = page(THREE_D_TYPES);
  const locked = compose(root, { rootClass: "pg", icons, vars: VARS });
  assert.equal(locked.elementCount, 0);
  const ok = compose(root, { rootClass: "pg", icons, vars: VARS, allowPremiumElements: true });
  assert.deepEqual(ok.warnings, []);
  assert.equal(ok.elementCount, 5);
  for (const fw of FRAMEWORKS) assert.ok(ok.files(fw).length > 0, fw);
});

test("3D: HTML memuat runtime sekali, gambar statis di markup, variabel --owd-3d-* hanya bila dipakai", () => {
  const ok = compose(page(THREE_D_TYPES), { rootClass: "pg", icons, vars: VARS, allowPremiumElements: true });
  assert.equal(ok.html.script.split("/* owd-shared:owd3d */").length - 1, 1, "runtime ditulis sekali");
  assert.equal(ok.html.script.match(/OWD3D\.mount\(el, "(product|shape|globe|particles|tilt)"/g).length, 5);
  assert.doesNotThrow(() => new Function(ok.html.script.replace(/import\(/g, "Promise.resolve(")));
  assert.equal((ok.html.body.match(/__fallback/g) || []).length, 4);
  assert.match(ok.html.css, /--owd-3d-quality/);
  assert.doesNotThrow(() => new Function(ok.html.script.replace(/import\(/g, "Promise.resolve(")));
  // Halaman tanpa elemen 3D tidak membawa variabel 3D.
  const plain = compose(page(["text"]), { rootClass: "pg", icons, vars: VARS });
  assert.doesNotMatch(plain.html.css, /--owd-3d-/);
  assert.doesNotMatch(plain.html.script ?? "", /OWD3D/);
});

test("3D: proyek framework mendapat satu berkas runtime + LIBRARIES.md", () => {
  const ok = compose(page(THREE_D_TYPES), { rootClass: "pg", icons, vars: VARS, allowPremiumElements: true });
  for (const fw of ["react", "vue", "svelte"]) {
    const files = ok.files(fw);
    assert.equal(files.filter((f) => f.name === "owd3d.js").length, 1, fw);
    assert.match(files.find((f) => f.name === "LIBRARIES.md").content, /Three\.js 0\.186\.1/);
    assert.doesNotMatch(files.find((f) => f.name === "LIBRARIES.md").content, /<script src="undefined"/);
  }
  const ng = ok.files("angular");
  assert.equal(ng.filter((f) => f.name === "owd-3d.ts").length, 1);
  const comp = ng.find((f) => f.name === "product3-d1.component.ts");
  const anyComp = ng.filter((f) => f.name.endsWith(".component.ts") && f.content.includes("mount3d("));
  assert.ok(anyComp.length >= 5, "komponen Angular memanggil mount3d");
  assert.ok(anyComp.every((f) => f.content.includes("import { mount3d } from './owd-3d';")));
  assert.match(comp.content, /ngOnDestroy\(\): void \{\n {4}if \(this\.destroy3d\) this\.destroy3d\(\);/);
  const react = ok.files("react").filter((f) => f.name.endsWith(".jsx") && f.content.includes("mount3d("));
  assert.equal(react.length, 5);
  assert.ok(react.every((f) => f.content.includes('import { mount3d } from "./owd3d";')));
  // HTML tidak butuh berkas tambahan.
  assert.ok(!ok.files("html").some((f) => f.name.startsWith("owd3d")));
});

test("3D: URL model & penanda globe dibersihkan", () => {
  assert.equal(safeModelUrl("https://cdn.example.com/a/model.glb"), "https://cdn.example.com/a/model.glb");
  assert.equal(safeModelUrl("/models/botol.gltf?v=2"), "/models/botol.gltf?v=2");
  assert.equal(safeModelUrl("javascript:alert(1)//.glb"), "");
  assert.equal(safeModelUrl("http://insecure.com/a.glb"), "");
  assert.equal(safeModelUrl("https://x.com/a.obj"), "");
  assert.equal(safeModelUrl('https://x.com/a".glb'), "");
  assert.equal(safeModelUrl("//evil.com/a.glb"), "");
  assert.deepEqual(parseMarkers(["Jakarta, -6.2, 106.8", "rusak", "Kutub, 95, 0", "Tokyo,35.68,139.69"]), [
    { name: "Jakarta", lat: -6.2, lon: 106.8 },
    { name: "Tokyo", lat: 35.68, lon: 139.69 },
  ]);
  assert.equal(parseMarkers(Array.from({ length: 40 }, (_, i) => `K${i}, 0, ${i}`)).length, 24);
});

test("3D: teks pengguna di-escape di semua framework", () => {
  const sec = createSectionFromPreset("single");
  const evil = '<img src=x onerror=alert(1)> {{x}} @if';
  sec.children[0].children.push(createElementNode("card-3d", { ...structuredClone(D["card-3d"].defaults), title: evil, alt: evil }, "K"));
  sec.children[0].children.push(createElementNode("three-globe", { ...structuredClone(D["three-globe"].defaults), alt: evil, markers: ["</script><b>, 1, 2"] }, "G"));
  const ok = compose(createPageRoot([sec]), { rootClass: "pg", icons, vars: VARS, allowPremiumElements: true });
  assert.doesNotMatch(ok.html.body, /<img src=x/);
  assert.doesNotMatch(ok.html.script, /<\/script>/i);
  for (const fw of ["react", "vue", "svelte", "angular"]) for (const f of ok.files(fw)) assert.doesNotMatch(f.content, /<img src=x onerror/, `${fw}/${f.name}`);
  for (const f of ok.files("angular").filter((x) => x.name.endsWith(".html") || x.name.endsWith(".ts"))) assert.doesNotMatch(f.content, /\{\{x\}\}/, f.name);
});

test("runtime 3D: penjaga FPS & context lost → gambar statis", () => {
  assert.match(OWD3D_RUNTIME, /var minFps = typeof cfg\.minFps === "number" \? cfg\.minFps : 30;/);
  assert.match(OWD3D_RUNTIME, /setPixelRatio\(1\)/, "turun resolusi dulu");
  assert.match(OWD3D_RUNTIME, /webglcontextlost/);
  assert.match(OWD3D_RUNTIME, /classList\.add\("is-3d-fallback"\)/);
});
