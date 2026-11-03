/* ================================================================== */
/* Generator katalog template v6 bagian G.                              */
/*                                                                    */
/*   npx tsx src/tools/genTemplatesG.ts                                */
/*                                                                    */
/* Menulis ulang pages/webTemplates/templates/v6/catalogG.ts (harga     */
/* statis dihitung dengan rumus templatePrice dari isi template) serta  */
/* nama, deskripsi, dan kategori baru di src/locales/{id,en}.json.      */
/* Jalankan ulang setiap kali spesifikasi di setG/ berubah.             */
/* ================================================================== */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { V6G_SPECS } from "../pages/webTemplates/templates/v6/setG/specs";
import { buildContent } from "../pages/webTemplates/templates/v6/setG/kitG";
import { NEW_CATEGORIES_G } from "../pages/webTemplates/templates/v6/categoriesG";
import { templateContents } from "../marketplace/data/templateCatalog";
import { templatePrice } from "../marketplace/templatePricing";
import { isPremiumPreset } from "../pages/pageMaker/helpers/sectionPresets";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../pages/pageMaker/core/elementDefinitions";
import type { WebTemplate } from "../pages/webTemplates/registry";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/* Id set G tidak boleh menimpa template lama: locale-nya ikut tertimpa. */
const older = new Set(["v2/catalogA", "v2/catalogB", "v3/catalogC", "v3/catalogD", "v4/catalogE", "v5/catalogF"].flatMap((f) => [...readFileSync(here(`../pages/webTemplates/templates/${f}.ts`), "utf8").matchAll(/id: "([^"]+)"/g)].map((m) => m[1])));
for (const m of readFileSync(here("../config/templates.ts"), "utf8").matchAll(/id: "([^"]+)"/g)) older.add(m[1]);
const clash = V6G_SPECS.filter((s) => older.has(s.id)).map((s) => s.id);
if (clash.length) throw new Error(`id sudah dipakai template lama: ${clash.join(", ")}`);

const rows: string[] = [];
for (const s of V6G_SPECS) {
  const content = buildContent(s);
  const t = { id: s.id, version: 1, category: s.cat, tier: s.tier, price: 0, accent: s.pal[2], tags: s.tags, content } as WebTemplate;
  const c = templateContents(t);
  const prem = c.sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))).length + c.elementIds.filter((id) => D[id.replace("element:", "")]?.premium).length;
  const price = s.tier === "free" ? 0 : templatePrice(content.pages.length, prem, c.libraries.length);
  const tier = s.tier === "free" ? "free" : "premium";
  rows.push(`  { id: ${JSON.stringify(s.id)}, version: 1, category: ${JSON.stringify(s.cat)}, tier: "${tier}", price: ${tier === "free" ? "TEMPLATE_PRICE.free" : price}, accent: ${JSON.stringify(s.pal[2])}, tags: ${JSON.stringify(s.tags)}, isNew: true },`);
  console.log(`${s.id.padEnd(34)} ${tier.padEnd(8)} ${content.pages.length} hlm  premium=${prem} libs=${c.libraries.join("+")}  → ${price}`);
}

const free = V6G_SPECS.filter((s) => s.tier === "free").length;
writeFileSync(
  here("../pages/webTemplates/templates/v6/catalogG.ts"),
  `import { TEMPLATE_PRICE } from "../../../../config/marketplace";
import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata ${V6G_SPECS.length} template katalog v6 (bagian G). Konten: ./setG/ (data di g*.ts).
 * ${free} Free + ${V6G_SPECS.length - free} Premium. Berkas ini DIHASILKAN oleh src/tools/genTemplatesG.ts:
 * harga Premium = rumus templatePrice dari jumlah halaman, item Premium, dan library.
 */
export const V6G_CATALOG: TemplateMeta[] = [
${rows.join("\n")}
];
`,
);

for (const lang of ["id", "en"] as const) {
  const file = here(`../locales/${lang}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  const tpl = json.templates;
  for (const [cat, label] of Object.entries(NEW_CATEGORIES_G)) tpl.categories[cat] = label[lang === "id" ? 0 : 1];
  // Buang entri item yang tidak lagi ada di katalog mana pun (mis. id set G yang diganti).
  const live = new Set([...older, ...V6G_SPECS.map((s) => s.id)]);
  for (const id of Object.keys(tpl.items)) if (!live.has(id)) delete tpl.items[id];
  for (const s of V6G_SPECS) {
    const n = s.pages.length + 1;
    const d = s.desc[lang === "id" ? 0 : 1].replace(/\.$/, "");
    tpl.items[s.id] = { name: s.brand, description: lang === "id" ? `${d}. Terdiri dari ${n} halaman.` : `${d}. Includes ${n} pages.` };
  }
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log(`\n${V6G_SPECS.length} template, ${free} Free. catalogG.ts & locales diperbarui.`);
