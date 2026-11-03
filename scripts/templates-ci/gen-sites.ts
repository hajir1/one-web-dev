/* ================================================================== */
/* Bangun SEMUA template web menjadi situs HTML statis untuk diperiksa. */
/*                                                                    */
/*   npm run templates:gen -- [folder-keluar] [--only=id1,id2]          */
/*                                                                    */
/* Dijalankan dengan tsx + src/testSetup.ts (memuat locale lengkap).   */
/* Hasil: <keluar>/<id-template>/index.html, halaman lain, assets/…,   */
/* dan <keluar>/manifest.json (daftar template & halamannya).          */
/* ================================================================== */
import fs from "node:fs";
import path from "node:path";
import { WEB_TEMPLATES, buildTemplatePages } from "../../src/pages/webTemplates/registry";
import { templateFiles } from "../../src/pages/webTemplates/exportTemplate";
import { makeIconLookup } from "../../src/pages/pageMaker/core/helpers/elementDefinition";

const args = process.argv.slice(2);
const out = path.resolve(args.find((a) => !a.startsWith("--")) ?? ".template-sites");
const only = args.find((a) => a.startsWith("--only="))?.slice(7).split(",").filter(Boolean);
const icons = makeIconLookup([]);

fs.rmSync(out, { recursive: true, force: true });
const manifest: { id: string; tier: string; pages: string[] }[] = [];
const started = Date.now();
for (const t of WEB_TEMPLATES) {
  if (only && !only.includes(t.id)) continue;
  const pages = buildTemplatePages(t, "id");
  const { files } = templateFiles(t, "id", t.content.brand, pages, { icons, allowPremiumElements: true, allowPremiumEvents: true });
  const dir = path.join(out, t.id);
  for (const f of files) {
    const p = path.join(dir, f.name);
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, f.content);
  }
  manifest.push({ id: t.id, tier: t.tier, pages: files.filter((f) => f.name.endsWith(".html") && !f.name.includes("/")).map((f) => f.name) });
}
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 1));
console.log(`${manifest.length} template → ${out} (${((Date.now() - started) / 1000).toFixed(1)} dtk)`);
