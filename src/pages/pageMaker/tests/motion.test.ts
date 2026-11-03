// @ts-nocheck
import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset, normalizePageDoc } from "../helpers/pageDoc";
import { animAttrs, animNodeCss, motionCss, sanitizeAnim, ANIM_PRESET_IDS } from "../engine/helpers/motion";
import { motionVars, sanitizeMotion, sanitizeThree, DEFAULT_THREE } from "../core/store/motionStore";
import { DEFAULT_MOTION } from "../engine/helpers/motion";

/* v9: animasi CSS per node + variabel Pengaturan Global → Animasi & 3D. */

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
const VARS = motionVars(DEFAULT_MOTION, DEFAULT_THREE);

function page(anim, boxAnim) {
  const sec = createSectionFromPreset("single");
  const t = createElementNode("text", { ...structuredClone(D.text.defaults), text: "Halo" }, "Judul");
  if (anim) t.anim = anim;
  if (boxAnim) sec.anim = boxAnim;
  sec.children[0].children.push(t);
  return createPageRoot([sec]);
}

test("motion: sanitize menolak preset asing dan menjepit angka", () => {
  assert.equal(sanitizeAnim(null), undefined);
  assert.equal(sanitizeAnim({ preset: "meledak" }), undefined);
  assert.deepEqual(sanitizeAnim({ preset: "fade-up", trigger: "load", duration: 99999, delay: -3, easing: "aneh", repeat: 5 }), { preset: "fade-up", trigger: "load", duration: 10000, delay: 0 });
  assert.deepEqual(sanitizeAnim({ preset: "spin", repeat: 3.6, trigger: "load" }), { preset: "spin", repeat: 4 });
  assert.deepEqual(sanitizeAnim({ preset: "grow", delay: 300, duration: 10 }), { preset: "grow", duration: 50 });
  assert.equal(ANIM_PRESET_IDS.length, 21);
});

test("motion: atribut, override per node, dan CSS hanya untuk preset terpakai", () => {
  assert.deepEqual(animAttrs({ preset: "fade-up", trigger: "scroll", once: false }), { classes: ["owd-anim", "owd-anim--fade-up"], attrs: { "data-owd-trigger": "scroll", "data-owd-once": "false" } });
  assert.deepEqual(animAttrs({ preset: "grow" }), { classes: ["owd-hover", "owd-hover--grow"], attrs: {} });
  assert.equal(animNodeCss({ preset: "fade-up" }, ".x"), "");
  assert.match(animNodeCss({ preset: "pulse", duration: 900, repeat: 0 }, ".x"), /\.x\.owd-anim \{\n {2}animation-duration: 900ms;\n {2}animation-iteration-count: infinite;/);
  const css = motionCss(["fade-up", "grow"]);
  assert.match(css, /@keyframes owd-fade-up/);
  assert.doesNotMatch(css, /owd-zoom-in/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /var\(--owd-anim-duration, 700ms\)/);
  const sv = motionCss(["spin"], "svelte");
  assert.match(sv, /@keyframes -global-owd-spin/);
  assert.match(sv, /:global\(\.owd-anim--spin\)/);
});

test("motion: compose (ekspor) menulis class, keyframes, variabel :root, dan pemicu scroll di 5 framework", () => {
  const root = page({ preset: "fade-up", trigger: "scroll", duration: 900 }, { preset: "zoom-in", trigger: "load" });
  const c = compose(root, { rootClass: "pg", icons, vars: VARS, allowPremiumElements: true });
  assert.match(c.html.body, /class="[^"]*owd-anim owd-anim--fade-up[^"]*"[^>]*data-owd-trigger="scroll"/);
  assert.match(c.html.css, /--owd-anim-duration: 700ms/);
  assert.doesNotMatch(c.html.css, /--owd-3d-/, "variabel 3D tidak ditulis tanpa elemen 3D");
  assert.match(c.html.css, /@keyframes owd-zoom-in/);
  assert.match(c.html.css, /animation-duration: 900ms/);
  assert.match(c.html.script, /IntersectionObserver/);
  for (const fw of FRAMEWORKS) {
    const all = c.files(fw).map((f) => f.content).join("\n");
    assert.match(all, /owd-anim--fade-up/, fw);
    assert.match(all, /@keyframes (-global-)?owd-fade-up/, fw);
    assert.match(all, /data-owd-once|IntersectionObserver/, fw);
  }
  // Angular: CSS animasi global (encapsulation None) agar menjangkau komponen anak.
  assert.match(c.files("angular").map((f) => f.content).join("\n"), /ViewEncapsulation\.None/);
});

test("motion: canvas desain (preview) tidak memutar animasi; desain tanpa animasi tidak menulis variabel", () => {
  const root = page({ preset: "fade-up" });
  const pv = compose(root, { rootClass: "pg", icons, vars: VARS, preview: true });
  assert.doesNotMatch(pv.html.body, /owd-anim/);
  assert.doesNotMatch(pv.html.css, /owd-anim/);
  const plain = compose(page(), { rootClass: "pg", icons, vars: VARS });
  assert.doesNotMatch(plain.html.css, /--owd-anim/);
  assert.doesNotMatch(plain.html.script, /IntersectionObserver/);
});

test("motion: anim ikut tersimpan & dibersihkan saat desain dimuat ulang", () => {
  const root = page({ preset: "float", repeat: 2, junk: 1 });
  const doc = normalizePageDoc({ version: 2, root: JSON.parse(JSON.stringify(root)) });
  const t = doc.root.children[0].children[0].children[0];
  assert.deepEqual(t.anim, { preset: "float", repeat: 2 });
});

test("motion: pengaturan global disanitasi dan jadi variabel CSS", () => {
  assert.deepEqual(sanitizeMotion({ duration: -1, easing: "x", trigger: "load", once: false, distance: 999 }), { duration: 50, delay: 0, easing: "smooth", distance: 200, trigger: "load", once: false });
  assert.deepEqual(sanitizeThree({ quality: "ultra", maxDpr: 9, rotateSpeed: 0 }), { ...DEFAULT_THREE, maxDpr: 2, rotateSpeed: 0.2 });
  const names = VARS.map((v) => v.name);
  assert.ok(names.includes("owd-anim-easing") && names.includes("owd-3d-dpr"));
});
