import test from "node:test";
import { BRAND_ICONS, brandSvg } from "../core/elements/extra/brandIcons";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITIONS, ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset } from "../helpers/pageDoc";
import { jsSyntaxError } from "../engine/helpers/advanced";
import { elementIcon, ELEMENT_ICON } from "../engine/helpers/elementIcons";
import { ELEMENTS_V2, elementPrice, pieceInfo } from "../../../marketplace/data/prices";
import {
  fieldName,
  parseGallery,
  parseMarquee,
  parseOptions,
  parseSocialLinks,
  parseTimeline,
  safeLink,
  socialGlyph,
} from "../core/elements/extra/shared";

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
const FREE = ["divider", "textarea", "radio-group", "social-links", "timeline"];
const PREMIUM = ["gallery-lightbox", "logo-marquee", "modal-popup", "before-after", "back-to-top"];
const ALL = [...FREE, ...PREMIUM];

const el = (t, state = {}) => createElementNode(t, { ...structuredClone(D[t].defaults), ...state }, D[t].label);
const page = (...nodes) => {
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(...nodes);
  return createPageRoot([sec]);
};
const build = (root, extra = {}) => compose(root, { rootClass: "pg", icons, ...extra });
const allText = (out) => [out.html.body, ...FRAMEWORKS.flatMap((fw) => out.files(fw).map((f) => f.content))].join("\n");

/* ----------------------------- Registry ----------------------------- */

test("10 elemen v2: 5 Free + 5 Premium, terdaftar, berikon, harga 0 / 5–10 kredit", () => {
  const types = ELEMENT_DEFINITIONS.map((d) => d.type);
  assert.equal(new Set(types).size, types.length, "tidak ada tipe ganda");
  for (const t of ALL) assert.ok(D[t], t);
  assert.deepEqual(FREE.filter((t) => D[t].premium), []);
  assert.deepEqual(PREMIUM.filter((t) => !D[t].premium), []);
  for (const t of PREMIUM) assert.equal(D[t].group, "Premium", t);
  assert.deepEqual([...ELEMENTS_V2].sort(), [...ALL, "chart"].sort());
  for (const t of ALL) {
    assert.ok(ELEMENT_ICON[t] && elementIcon(t) === ELEMENT_ICON[t], `${t}: ikon`);
    const info = pieceInfo(`element:${t}`);
    assert.equal(info.tier, D[t].premium ? "premium" : "free");
    if (D[t].premium) assert.ok(info.price === 5 || info.price === 10, `${t}: ${info.price}`);
    else assert.equal(info.price, 0);
    assert.equal(info.price, elementPrice(t, info.tier));
  }
  // urutan registry: gratis setelah clipboard, premium setelah typewriter
  assert.deepEqual(types.slice(types.indexOf("clipboard") + 1, types.indexOf("clipboard") + 6), FREE);
  assert.deepEqual(types.slice(types.indexOf("typewriter") + 1, types.indexOf("typewriter") + 6), PREMIUM);
});

/* ------------------------------ Ekspor ------------------------------ */

test("setiap elemen v2 tampil di 5 framework tanpa peringatan; JS kustom valid", () => {
  for (const t of ALL) {
    const out = build(page(el(t)), { allowPremiumElements: true });
    assert.deepEqual(out.warnings, [], t);
    assert.equal(out.elementCount, 1, t);
    for (const fw of FRAMEWORKS) {
      const files = out.files(fw);
      assert.ok(files.length > 0, `${t}/${fw}`);
      assert.ok(files.some((f) => f.content.includes("pg__")), `${t}/${fw}: markup`);
    }
    const custom = D[t].customCode?.(D[t].defaults);
    if (custom?.js) {
      assert.equal(jsSyntaxError(custom.js), null, `${t}: JS`);
      assert.match(out.html.script, /initCustomCode/, `${t}: runtime`);
    }
  }
});

test("semua elemen v2 dalam satu halaman → ekspor bersih", () => {
  const out = build(page(...ALL.map((t) => el(t))), { allowPremiumElements: true });
  assert.deepEqual(out.warnings, []);
  assert.equal(out.elementCount, ALL.length);
});

test("Premium v2 terkunci tanpa izin (tidak ikut + 1 peringatan); Free tetap ikut", () => {
  for (const t of ALL) {
    const locked = build(page(el(t)));
    assert.equal(locked.warnings.length, D[t].premium ? 1 : 0, t);
    assert.equal(locked.elementCount, D[t].premium ? 0 : 1, t);
  }
  const mixed = build(page(...ALL.map((t) => el(t))));
  assert.equal(mixed.elementCount, FREE.length);
  assert.equal(mixed.warnings.length, PREMIUM.length);
  // izin per tipe
  const one = build(page(...PREMIUM.map((t) => el(t))), { allowPremiumElements: (k) => k === "modal-popup" });
  assert.equal(one.elementCount, 1);
  assert.match(one.html.body, /aria-haspopup="dialog"/);
});

/* --------------------------- Markup & a11y -------------------------- */

test("markup: label/aria benar, tombol type=button, React memakai atribut JSX", () => {
  const all = build(page(...ALL.map((t) => el(t))), { allowPremiumElements: true });
  const body = all.html.body;
  // semua <button> bertipe button
  for (const b of body.match(/<button[^>]*>/g) ?? []) assert.match(b, /type="button"/, b);
  // textarea berlabel
  assert.match(body, /<label class="pg__textarea-1__label" for="pg__textarea-1-input">/);
  assert.match(body, /<textarea[^>]*id="pg__textarea-1-input"[^>]*rows="4"/);
  // radio: fieldset/legend, opsi kedua terpilih
  assert.match(body, /<fieldset class="pg__radio-group-1">/);
  assert.match(body, /<legend/);
  assert.match(body, /value="Bisnis" checked/);
  // divider tanpa label = <hr>, dengan label = separator
  assert.match(body, /<hr class="pg__divider-1"/);
  const lbl = build(page(el("divider", { label: "atau" }))).html.body;
  assert.match(lbl, /role="separator" aria-label="atau"/);
  // modal: dialog tersembunyi, aria-modal, judul terhubung
  assert.match(body, /role="dialog" aria-modal="true" aria-labelledby="pg__modal-popup-1-title"/);
  assert.match(body, /class="pg__modal-popup-1__backdrop" hidden/);
  // lightbox tersembunyi, before/after range berlabel
  assert.match(body, /class="pg__gallery-lightbox-1__box" role="dialog" aria-modal="true" aria-label="Galeri" hidden/);
  assert.match(body, /type="range" min="0" max="100" step="1" value="50" aria-label="Sebelum \/ Sesudah"/);
  // marquee: salinan kedua aria-hidden + reduced motion
  assert.equal((body.match(/pg__logo-marquee-1__track/g) ?? []).length, 2);
  assert.match(body, /class="pg__logo-marquee-1__track" aria-hidden="true"/);
  assert.match(all.html.css, /prefers-reduced-motion: reduce\) \{\n {2}\.pg__logo-marquee-1__viewport/);
  // social: tab baru aman
  assert.match(body, /target="_blank" rel="noopener noreferrer"/);

  const react = all.files("react").map((f) => f.content).join("\n");
  assert.match(react, /htmlFor="pg__textarea-1-input"/);
  assert.match(react, /defaultChecked/);
  assert.match(react, /defaultValue="50"/);
  assert.match(react, /tabIndex="-1"/);
  assert.doesNotMatch(react, / class="/);
});

/* ---------------------------- Keamanan URL --------------------------- */

test("URL javascript:/vbscript:/data: dinetralkan di semua elemen v2", () => {
  const bad = "javascript:alert(1)";
  const root = page(
    el("social-links", { links: [`Evil | ${bad}`, "Ok | https://ok.example/", "Tab | java\tscript:alert(2)"] }),
    el("gallery-lightbox", { images: [`${bad} | jahat`, "vbscript:x | v", "data:text/html,<b>x</b> | d", "https://img.example/a.jpg | aman"] }),
    el("logo-marquee", { items: [`Logo | ${bad}`] }),
    el("modal-popup", { ctaHref: bad }),
    el("before-after", { before: bad, after: " JaVaScRiPt:alert(3)" }),
  );
  const out = build(root, { allowPremiumElements: true });
  assert.deepEqual(out.warnings, []);
  const text = allText(out);
  assert.doesNotMatch(text, /javascript:|vbscript:|java\tscript|data:text/i);
  assert.match(out.html.body, /href="https:\/\/ok\.example\/"/);
  assert.match(out.html.body, /href="https:\/\/img\.example\/a\.jpg"/);
  assert.match(out.html.body, /<a class="pg__modal-popup-1__cta" href="#">/);
  // logo berbahaya → tampil sebagai teks
  assert.match(out.html.body, /<span class="pg__logo-marquee-1__text">Logo<\/span>/);
});

/* ------------------------------ Parser ------------------------------ */

test("safeLink & fieldName", () => {
  assert.equal(safeLink("javascript:alert(1)"), "");
  assert.equal(safeLink("  JAVA\nSCRIPT:alert(1)"), "");
  assert.equal(safeLink("vbscript:msgbox"), "");
  assert.equal(safeLink("data:text/html;base64,AAAA"), "");
  assert.equal(safeLink("data:image/png;base64,AAAA"), "data:image/png;base64,AAAA");
  assert.equal(safeLink(" https://a.b/c "), "https://a.b/c");
  assert.equal(safeLink("/img/x.png"), "/img/x.png");
  assert.equal(safeLink(""), "");
  assert.equal(fieldName("pe san!", "x"), "pesan");
  assert.equal(fieldName("***", "x"), "x");
});

test("parseOptions: trim, kosong & duplikat dibuang, maks 12", () => {
  assert.deepEqual(parseOptions([" A ", "", "B", "A", "  "]), ["A", "B"]);
  assert.equal(parseOptions(Array.from({ length: 20 }, (_, i) => `o${i}`)).length, 12);
});

test("parseSocialLinks & socialGlyph", () => {
  assert.deepEqual(parseSocialLinks(["LinkedIn | https://linkedin.com/in/x", "", "TanpaUrl", "Bad | javascript:x", " | https://x.com"]), [
    { name: "LinkedIn", href: "https://linkedin.com/in/x", glyph: "in", icon: "linkedin" },
  ]);
  // Logo asli: dikenali dari nama atau URL; jaringan tak dikenal memakai teks.
  const [ig, web, mail, other] = parseSocialLinks(["IG | https://instagram.com/a", "Toko | https://www.tiktok.com/@a", "Surel | mailto:a@b.co", "Mastodon2 | https://contoh.id"]);
  assert.equal(ig.icon, "instagram");
  assert.equal(web.icon, "tiktok");
  assert.equal(mail.icon, "email");
  assert.equal(other.icon, null);
  for (const k of Object.keys(BRAND_ICONS)) assert.match(brandSvg(k), /^<svg [^>]*viewBox="0 0 24 24"[^>]*><path d="[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+"\/><\/svg>$/, k);
  assert.equal(brandSvg("tidak-ada"), "");
  assert.equal(socialGlyph("Facebook"), "f");
  assert.equal(socialGlyph("X (Twitter)"), "X");
  assert.equal(socialGlyph("YouTube"), "YT");
  assert.equal(socialGlyph("mastodon"), "M");
  assert.equal(parseSocialLinks(Array.from({ length: 20 }, (_, i) => `n${i} | https://x/${i}`)).length, 12);
});

test("parseTimeline: tanggal opsional, teks boleh berisi |, judul wajib", () => {
  assert.deepEqual(parseTimeline(["2024 | Mulai | a | b", " | Tanpa tanggal", "2025 |  | tanpa judul", ""]), [
    { date: "2024", title: "Mulai", text: "a | b" },
    { date: "", title: "Tanpa tanggal", text: "" },
  ]);
});

test("parseGallery & parseMarquee", () => {
  assert.deepEqual(parseGallery(["https://a/1.jpg | Satu", "https://a/2.jpg", "javascript:x | jahat", " | kosong"]), [
    { src: "https://a/1.jpg", caption: "Satu" },
    { src: "https://a/2.jpg", caption: "" },
  ]);
  assert.equal(parseGallery(Array.from({ length: 30 }, (_, i) => `/i${i}.jpg`)).length, 24);
  assert.deepEqual(parseMarquee(["Acme", "Logo | https://a/l.svg", "Bad | javascript:x", ""]), [
    { label: "Acme", src: "" },
    { label: "Logo", src: "https://a/l.svg" },
    { label: "Bad", src: "" },
  ]);
});

/* -------------------------- Runtime (DOM tiruan) --------------------- */

test("before/after: runtime memperbarui --pos saat range digeser", () => {
  const listeners = {};
  const range = { value: "50" };
  const props = {};
  const element = { querySelector: () => range, style: { setProperty: (k, v) => (props[k] = v) } };
  const on = (t, type, fn) => {
    if (t === range) listeners[type] = fn;
  };
  const js = D["before-after"].customCode(D["before-after"].defaults).js;
  new Function("element", "on", "onCleanup", js)(element, on, () => {});
  assert.equal(props["--pos"], "50%");
  range.value = "73";
  listeners.input();
  assert.equal(props["--pos"], "73%");
});

test("tautan sosial: logo SVG asli di 5 framework, warna merek opsional", () => {
  const def = D["social-links"];
  const sec = createSectionFromPreset("single");
  sec.children[0].children.push(createElementNode("social-links", structuredClone(def.defaults), def.label));
  const c = compose(createPageRoot([sec]), { rootClass: "pg", icons });
  assert.deepEqual(c.warnings, []);
  assert.match(c.html.body, /<svg [^>]*viewBox="0 0 24 24"/);
  assert.match(c.html.css, /__link--instagram \{\n {2}background: #FF0069;/);
  assert.doesNotMatch(c.html.body, />IG</);
  assert.match(c.files("react")[0].content, /dangerouslySetInnerHTML=\{\{ __html: "<svg/);
  const mono = structuredClone(def.defaults);
  mono.brandColors = false;
  const sec2 = createSectionFromPreset("single");
  sec2.children[0].children.push(createElementNode("social-links", mono, def.label));
  assert.doesNotMatch(compose(createPageRoot([sec2]), { rootClass: "pg", icons }).html.css, /__link--instagram/);
});
