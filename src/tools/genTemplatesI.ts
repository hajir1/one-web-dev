/* ================================================================== */
/* Generator katalog template v9 bagian I (Premium 3D & animasi).       */
/*                                                                    */
/*   npx tsx src/tools/genTemplatesI.ts                                */
/*                                                                    */
/* Menulis ulang pages/webTemplates/templates/v9/catalogI.ts (harga     */
/* statis dihitung dengan rumus showcasePrice dari isi template) serta  */
/* nama & deskripsi di src/locales/{id,en}.json.                        */
/* Jalankan ulang setiap kali spesifikasi di setI/ berubah.             */
/* ================================================================== */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { V9I_SPECS as SPECS } from "../pages/webTemplates/templates/v9/setI/specs";
import { buildContentI, showcasePrice, threeTypesOf } from "../pages/webTemplates/templates/v9/setI/kitI";
import { templateContents } from "../marketplace/data/templateCatalog";
import { qualityBonus } from "../marketplace/templatePricing";
import { isPremiumPreset } from "../pages/pageMaker/helpers/sectionPresets";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../pages/pageMaker/core/elementDefinitions";
import type { WebTemplate } from "../pages/webTemplates/registry";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));

/* Id set I tidak boleh menimpa template lama: locale-nya ikut tertimpa. */
const older = new Set(["v2/catalogA", "v2/catalogB", "v3/catalogC", "v3/catalogD", "v4/catalogE", "v5/catalogF", "v6/catalogG", "v7/catalogH"].flatMap((f) => [...readFileSync(here(`../pages/webTemplates/templates/${f}.ts`), "utf8").matchAll(/id: "([^"]+)"/g)].map((m) => m[1])));
for (const m of readFileSync(here("../config/templates.ts"), "utf8").matchAll(/id: "([^"]+)"/g)) older.add(m[1]);
const clash = SPECS.filter((s) => older.has(s.id)).map((s) => s.id);
if (clash.length) throw new Error(`id sudah dipakai template lama: ${clash.join(", ")}`);

const rows: string[] = [];
for (const s of SPECS) {
  const content = buildContentI(s);
  const t = { id: s.id, version: 1, category: s.cat, tier: "premium", price: 0, accent: s.pal[2], tags: s.tags, content } as WebTemplate;
  const c = templateContents(t);
  const prem = c.sectionIds.filter((id) => isPremiumPreset(id.replace("preset:", ""))).length + c.elementIds.filter((id) => D[id.replace("element:", "")]?.premium).length;
  const three = threeTypesOf(s);
  const price = showcasePrice(content.pages.length, three.length, qualityBonus(prem, c.libraries.length));
  rows.push(`  { id: ${JSON.stringify(s.id)}, version: 1, category: ${JSON.stringify(s.cat)}, tier: "premium", price: ${price}, accent: ${JSON.stringify(s.pal[2])}, tags: ${JSON.stringify(s.tags)}, isNew: true },`);
  console.log(`${s.id.padEnd(30)} ${content.pages.length} hlm  3D=${three.join("+")}  premium=${prem} libs=${c.libraries.join("+") || "-"}  → ${price}`);
}

writeFileSync(
  here("../pages/webTemplates/templates/v9/catalogI.ts"),
  `import type { TemplateMeta } from "../../../../config/templates";

/**
 * Metadata ${SPECS.length} template katalog v9 (bagian I, Premium 3D & animasi). Konten: ./setI/ (data di i*.ts).
 * Semua Premium. Berkas ini DIHASILKAN oleh src/tools/genTemplatesI.ts:
 * harga = showcasePrice (25/halaman + 20/jenis elemen 3D + bonus kualitas), 60–300 kredit.
 */
export const V9I_CATALOG: TemplateMeta[] = [
${rows.join("\n")}
];
`,
);

for (const lang of ["id", "en"] as const) {
  const file = here(`../locales/${lang}.json`);
  const json = JSON.parse(readFileSync(file, "utf8"));
  const tpl = json.templates;
  for (const s of SPECS) {
    const n = s.pages.length + 1;
    const d = s.desc[lang === "id" ? 0 : 1].replace(/\.$/, "");
    tpl.items[s.id] = { name: s.brand, description: lang === "id" ? `${d}. Terdiri dari ${n} halaman.` : `${d}. Includes ${n} pages.` };
  }
  writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
}
console.log(`\n${SPECS.length} template Premium. catalogI.ts & locales diperbarui.`);
