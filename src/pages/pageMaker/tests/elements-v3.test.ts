import test from "node:test";
import assert from "node:assert/strict";
import { compose } from "../engine/helpers/compose";
import { createElementNode } from "../engine/helpers/tree";
import { ELEMENT_DEFINITIONS, ELEMENT_DEFINITION_BY_TYPE as D } from "../core/elementDefinitions";
import { makeIconLookup } from "../core/helpers/elementDefinition";
import { createPageRoot, createSectionFromPreset } from "../helpers/pageDoc";
import { jsSyntaxError } from "../engine/helpers/advanced";
import { ELEMENT_ICON } from "../engine/helpers/elementIcons";
import { NEW_ELEMENT_TYPES, pieceInfo } from "../../../marketplace/data/prices";
import { guessFieldType, initials, mapsEmbedUrl, pageHref, paginationItems, parseHotspots, parseLinks, parsePeople, parseWizard } from "../core/elements/extra/shared";

const icons = makeIconLookup([]);
const FRAMEWORKS = ["html", "react", "vue", "svelte", "angular"];
const FREE = ["floating-input", "search-bar", "number-stepper", "file-upload", "segmented", "avatar", "blockquote", "skeleton", "pagination", "steps", "map-embed"];
const PREMIUM = ["popover", "toast", "offcanvas", "dropdown", "otp-input", "cookie-consent", "image-hotspot", "form-wizard"];

const el = (t: string, state = {}) => createElementNode(t, { ...structuredClone(D[t].defaults), ...state }, D[t].label);
const page = (...nodes: ReturnType<typeof el>[]) => {
  const sec = createSectionFromPreset("single")!;
  (sec.children[0] as { children: unknown[] }).children.push(...nodes);
  return createPageRoot([sec]);
};
const build = (root: ReturnType<typeof page>, extra = {}) => compose(root, { rootClass: "pg", icons, ...extra });

test("19 elemen v3: 11 gratis + 8 premium, terdaftar, berikon, harga 0 / 5–10 kredit", () => {
  const types = ELEMENT_DEFINITIONS.map((d) => d.type);
  assert.equal(new Set(types).size, types.length);
  assert.deepEqual([...NEW_ELEMENT_TYPES].sort(), [...FREE, ...PREMIUM].sort());
  for (const t of FREE) assert.ok(D[t] && !D[t].premium, t);
  for (const t of PREMIUM) {
    assert.ok(D[t]?.premium, t);
    assert.equal(D[t].group, "Premium", t);
  }
  for (const t of [...FREE, ...PREMIUM]) {
    assert.ok(ELEMENT_ICON[t], `${t}: ikon`);
    const p = pieceInfo(`element:${t}`)!;
    if (D[t].premium) assert.ok(p.price === 5 || p.price === 10, `${t}: ${p.price}`);
    else assert.equal(p.price, 0);
  }
  for (const t of ["offcanvas", "image-hotspot", "form-wizard"]) assert.equal(pieceInfo(`element:${t}`)!.price, 10);
});

test("semua elemen v3 tampil di 5 framework, JS valid, premium terkunci tanpa kredit", () => {
  for (const t of [...FREE, ...PREMIUM]) {
    const root = page(el(t));
    const ok = build(root, { allowPremiumElements: true });
    assert.deepEqual(ok.warnings, [], t);
    assert.equal(ok.elementCount, 1, t);
    for (const fw of FRAMEWORKS) {
      const files = ok.files(fw);
      assert.ok(files.length > 0, `${t}/${fw}`);
      assert.ok(!files.some((f: { content: string }) => /\bundefined\b|\[object Object\]|\bNaN\b/.test(f.content.replace(/isNaN/g, ""))), `${t}/${fw}: nilai bocor`);
    }
    const js = D[t].customCode?.(D[t].defaults)?.js;
    if (js) assert.equal(jsSyntaxError(js), null, `${t}: JS`);
    const locked = build(root);
    assert.equal(locked.elementCount, D[t].premium ? 0 : 1, `${t}: kunci`);
  }
});

test("input label mengambang: placeholder kosong + label for=id (CSS :placeholder-shown)", () => {
  const body = build(page(el("floating-input"))).html.body;
  assert.match(body, /<input class="pg__floating-input-1__input" id="pg__floating-input-1-field" type="email" name="email" placeholder=" " required ?\/?>/);
  assert.match(body, /<label class="pg__floating-input-1__label" for="pg__floating-input-1-field">\s*Alamat email/);
  const area = build(page(el("floating-input", { inputType: "textarea" }))).html.body;
  assert.match(area, /<textarea class="pg__floating-input-1__input"/);
});

test("popover: terbuka di canvas desain, tertutup bila opsi dimatikan; aria lengkap", () => {
  const open = build(page(el("popover")), { allowPremiumElements: true }).html.body;
  assert.match(open, /aria-expanded="true" aria-controls="pg__popover-1-panel"/);
  assert.doesNotMatch(open, /role="dialog"[^>]*hidden/);
  const closed = build(page(el("popover", { openInDesign: false })), { allowPremiumElements: true }).html.body;
  assert.match(closed, /role="dialog"[^>]*hidden/);
});

test("paginasi: halaman pertama/terakhir/sekitar aktif + celah", () => {
  assert.deepEqual(paginationItems(10, 5), [1, "…", 4, 5, 6, "…", 10]);
  assert.deepEqual(paginationItems(10, 4), [1, 2, 3, 4, 5, "…", 10]);
  assert.deepEqual(paginationItems(5, 3), [1, 2, 3, 4, 5]);
  assert.deepEqual(paginationItems(1, 1), [1]);
  assert.deepEqual(paginationItems(12, 12), [1, "…", 11, 12]);
  assert.deepEqual(paginationItems(12, 1), [1, 2, "…", 12]);
  assert.equal(pageHref("/blog/page/{n}", 3), "/blog/page/3");
  assert.equal(pageHref("javascript:alert({n})", 2), "#");
  const body = build(page(el("pagination"))).html.body;
  assert.match(body, /aria-current="page"[^>]*>4</);
});

test("parser: orang, tautan, hotspot, wizard, peta", () => {
  assert.equal(initials("Sari Dewi Lestari"), "SL");
  assert.equal(initials(""), "?");
  assert.deepEqual(parsePeople(["Ana | javascript:x", " ", "Budi | https://x.test/b.jpg"]), [
    { name: "Ana", photo: "" },
    { name: "Budi", photo: "https://x.test/b.jpg" },
  ]);
  assert.deepEqual(parseLinks(["Beranda | /", "Bahaya | javascript:alert(1)", "| #kosong"]), [
    { label: "Beranda", href: "/" },
    { label: "Bahaya", href: "#" },
  ]);
  assert.deepEqual(parseHotspots(["150 | -4 | Titik | ket", "10 | 20 |"]), [{ x: 100, y: 0, title: "Titik", text: "ket" }]);
  const wz = parseWizard(["Data | Nama lengkap*; Email*; Nomor WhatsApp", "Tanpa isian |", "Pesan | Catatan"]);
  assert.equal(wz.length, 2);
  assert.deepEqual(wz[0].fields.map((f) => [f.name, f.type, f.required]), [
    ["nama_lengkap", "text", true],
    ["email", "email", true],
    ["nomor_whatsapp", "tel", false],
  ]);
  assert.equal(wz[1].fields[0].type, "textarea");
  assert.equal(guessFieldType("Tanggal mulai"), "date");
  assert.match(mapsEmbedUrl("Monas, Jakarta", 99), /q=Monas%2C%20Jakarta&z=20&output=embed$/);
});

test("formulir bertahap: langkah 2+ tersembunyi; tanpa action → tidak ada atribut action", () => {
  const body = build(page(el("form-wizard")), { allowPremiumElements: true }).html.body;
  assert.match(body, /data-step="0">/);
  assert.match(body, /data-step="1" hidden>/);
  assert.doesNotMatch(body, /<form[^>]* action=/);
  const withAction = build(page(el("form-wizard", { action: "https://formspree.io/f/x" })), { allowPremiumElements: true }).html.body;
  assert.match(withAction, /<form[^>]* action="https:\/\/formspree.io\/f\/x"/);
});
