import test from "node:test";
import assert from "node:assert/strict";
import { TEMPLATE_PRICE } from "../../config/marketplace";
import { CREDITS_PER_PAGE, qualityBonus, templatePrice } from "../templatePricing";
import { templateContents } from "../data/templateCatalog";
import { WEB_TEMPLATES } from "../../pages/webTemplates/registry";
import { isPremiumPreset } from "../../pages/pageMaker/helpers/sectionPresets";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../../pages/pageMaker/core/elementDefinitions";
import { V9I_SPECS } from "../../pages/webTemplates/templates/v9/setI/specs";
import { showcasePrice, threeTypesOf } from "../../pages/webTemplates/templates/v9/setI/kitI";
import { V10J_CATALOG } from "../../pages/webTemplates/templates/v10/catalogJ";

/* Premium template price: 3 credits/page + quality bonus 0–2 (see templatePricing.ts). */

const premiumCount = (c: ReturnType<typeof templateContents>) =>
  c.sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))).length + c.elementIds.filter((id) => D[id.replace("element:", "")]?.premium).length;

test("rumus harga: bonus kualitas < harga satu halaman, batas 20–300 kredit (Rp20rb–Rp300rb)", () => {
  assert.equal(CREDITS_PER_PAGE, 15);
  assert.deepEqual([qualityBonus(0, 0), qualityBonus(1, 1), qualityBonus(2, 1), qualityBonus(4, 1), qualityBonus(5, 1), qualityBonus(9, 3)], [0, 0, 5, 5, 10, 10]);
  assert.equal(templatePrice(1, 0, 0), TEMPLATE_PRICE.premiumMin);
  assert.equal(templatePrice(3, 0, 0), 45);
  assert.equal(templatePrice(3, 9, 3), 55);
  assert.equal(templatePrice(4, 0, 0), 60, "4 halaman tanpa bonus tetap lebih mahal dari 3 halaman dengan bonus penuh");
  assert.equal(templatePrice(10, 8, 3), 160);
  assert.equal(templatePrice(25, 8, 3), TEMPLATE_PRICE.premiumMax);
  for (let p = 1; p < 10; p++) assert.ok(templatePrice(p + 1, 0, 0) > templatePrice(p, 99, 3), `${p + 1} vs ${p} halaman`);
});

/* Set I (Premium 3D & animation) uses its own showcasePrice formula, 60–300 credits. */
const SHOWCASE = new Set([...V9I_SPECS.map((s) => s.id), ...V10J_CATALOG.map((m) => m.id)]);

const premium = WEB_TEMPLATES.filter((t) => t.tier === "premium" && !SHOWCASE.has(t.id)).map((t) => {
  const c = templateContents(t);
  return { id: t.id, price: t.price, pages: t.content.pages.length, prem: premiumCount(c), libs: c.libraries.length };
});

test("harga katalog = rumus untuk setiap template Premium; Free = 0", () => {
  assert.ok(premium.length >= 64);
  for (const t of premium) assert.equal(t.price, templatePrice(t.pages, t.prem, t.libs), `${t.id}: ${t.pages} halaman, ${t.prem} item Premium, ${t.libs} library`);
  for (const t of WEB_TEMPLATES.filter((x) => x.tier === "free")) assert.equal(t.price, TEMPLATE_PRICE.free, t.id);
});

test("set I: harga = showcasePrice (25/halaman + 20/jenis 3D + bonus), dijepit 60–300", () => {
  assert.equal(showcasePrice(1, 0, 0), 60);
  assert.equal(showcasePrice(2, 1, 0), 70);
  assert.equal(showcasePrice(8, 2, 10), 250);
  assert.equal(showcasePrice(12, 5, 10), 300);
  for (const s of V9I_SPECS) {
    const t = WEB_TEMPLATES.find((x) => x.id === s.id)!;
    const c = templateContents(t);
    assert.equal(t.price, showcasePrice(t.content.pages.length, threeTypesOf(s).length, qualityBonus(premiumCount(c), c.libraries.length)), s.id);
  }
});

test("set J (3D + efek scroll): harga = showcasePrice dengan jenis 3D = elemen three-* + tilt", () => {
  for (const m of V10J_CATALOG) {
    const t = WEB_TEMPLATES.find((x) => x.id === m.id)!;
    const c = templateContents(t);
    const three = new Set(c.elementIds.filter((id) => id.startsWith("element:three-"))).size + (c.libraries.includes("tilt") ? 1 : 0);
    assert.ok(three >= 1, `${m.id}: minimal satu jenis 3D`);
    assert.equal(t.price, showcasePrice(t.content.pages.length, three, qualityBonus(premiumCount(c), c.libraries.length)), m.id);
  }
});

test("template dengan halaman lebih banyak selalu lebih mahal", () => {
  for (const a of premium)
    for (const b of premium)
      if (a.pages > b.pages) assert.ok(a.price > b.price, `${a.id} (${a.pages} hlm, ${a.price}) vs ${b.id} (${b.pages} hlm, ${b.price})`);
});
