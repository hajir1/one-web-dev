// @ts-nocheck — skrip Node (tsx), tidak ikut bundle aplikasi.
/* ================================================================== */
/* Tulis contoh ekspor proyek (v7) untuk diuji build.                   */
/*                                                                    */
/*   npx tsx src/tools/verifyExports.ts <folder> [templateId,...]        */
/*                                                                    */
/* Hasil: <folder>/<templateId>/<format>/… untuk html, blade, react,     */
/* vue, svelte, angular, plus <folder>/design-vars/<format> (desain      */
/* contoh dengan variabel global & font Google). Build dijalankan oleh   */
/* tools/verify-exports.sh (npm install + npm run build, Laravel).       */
/* ================================================================== */
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { makeIconLookup } from "../pages/pageMaker/core/helpers/elementDefinition";
import { WEB_TEMPLATES, buildTemplatePages } from "../pages/webTemplates/registry";
import { templateFiles } from "../pages/webTemplates/exportTemplate";
import { EXPORT_FORMATS } from "../pages/pageMaker/helpers/projectExport";
import { projectFiles, singlePage } from "../pages/pageMaker/helpers/siteExport";
import { compose } from "../pages/pageMaker/engine/helpers/compose";
import { createDefaultDoc } from "../pages/pageMaker/engine/helpers/migrate";
import { createElementNode, insertNode } from "../pages/pageMaker/engine/helpers/tree";
import { ELEMENT_DEFINITION_BY_TYPE as D } from "../pages/pageMaker/core/elementDefinitions";
import { BUILTIN_VARS, mergeVars } from "../pages/pageMaker/core/helpers/cssVars";
import { libraryFontVars } from "../pages/pageMaker/core/helpers/fontCss";

const out = resolve(process.argv[2] ?? "export-check");
const ids = (process.argv[3] ?? "company-starter").split(",");
const icons = makeIconLookup([]);

const write = (dir: string, files: { name: string; content: string }[]) => {
  rmSync(dir, { recursive: true, force: true });
  for (const f of files) {
    const p = join(dir, f.name);
    mkdirSync(dirname(p), { recursive: true });
    writeFileSync(p, f.content);
  }
  return files.length;
};

for (const id of ids) {
  const tpl = WEB_TEMPLATES.find((t) => t.id === id);
  if (!tpl) throw new Error(`template tidak ada: ${id}`);
  const pages = buildTemplatePages(tpl, "id");
  for (const fw of EXPORT_FORMATS) {
    const { files } = templateFiles(tpl, "id", tpl.content.brand, pages, { icons, allowPremiumElements: true }, fw);
    console.log(`${id}/${fw}: ${write(join(out, id, fw), files)} berkas`);
  }
}

// Desain contoh: variabel warna/ukuran/font + font Google, dipakai elemen teks, tombol, kartu, input.
const poppins = { id: "f1", name: "Poppins", source: "google", fallback: "sans-serif", weights: [400, 600], url: "", createdAt: 1 };
const vars = mergeVars(libraryFontVars([poppins]), BUILTIN_VARS, [
  { id: "u1", name: "aksen", type: "color", value: "#e11d48" },
  { id: "u2", name: "jarak", type: "size", value: "1.25rem" },
]);
const doc = createDefaultDoc();
let root = doc.root;
const add = (type, state) => {
  root = insertNode(root, root.id, root.children.length, createElementNode(type, { ...D[type].defaults, ...state }, type));
};
add("text", { text: "Judul memakai variabel", textColor: "var(--aksen)", fontFamily: "var(--font-poppins)" });
add("button", { paddingTop: "var(--jarak)", paddingLinked: false, bgColor: "var(--color-primary)" });
add("card", { fontFamily: "var(--font-heading)" });
add("input", { fontFamily: "var(--font-poppins)" });
const composed = compose(root, { rootClass: "desain-variabel", icons, fonts: [poppins], vars, allowPremiumElements: () => true });
if (composed.warnings.length) console.log("peringatan:", composed.warnings.map((w) => w.message));
for (const fw of EXPORT_FORMATS) console.log(`design-vars/${fw}: ${write(join(out, "design-vars", fw), projectFiles(fw, "Desain Variabel", [singlePage(composed, "Desain Variabel")]))} berkas`);

// v9: desain contoh 5 elemen 3D + animasi CSS (runtime owd3d.js, Three.js dimuat dinamis).
import { motionVars, DEFAULT_THREE } from "../pages/pageMaker/core/store/motionStore";
import { DEFAULT_MOTION } from "../pages/pageMaker/engine/helpers/motion";
const doc3d = createDefaultDoc();
let root3d = doc3d.root;
for (const type of ["three-product", "three-shape", "three-globe", "three-particles", "card-3d", "text"]) {
  const node = createElementNode(type, { ...D[type].defaults, ...(type === "text" ? { text: "Teks beranimasi" } : {}) }, type);
  if (type === "text") node.anim = { preset: "fade-up", trigger: "scroll" };
  if (type === "card-3d") node.anim = { preset: "lift" };
  root3d = insertNode(root3d, root3d.id, root3d.children.length, node);
}
const composed3d = compose(root3d, { rootClass: "desain-3d", icons, vars: mergeVars(BUILTIN_VARS, motionVars(DEFAULT_MOTION, DEFAULT_THREE)), allowPremiumElements: () => true });
if (composed3d.warnings.length) console.log("peringatan 3D:", composed3d.warnings.map((w) => w.message));
for (const fw of EXPORT_FORMATS) console.log(`design-3d/${fw}: ${write(join(out, "design-3d", fw), projectFiles(fw, "Desain 3D", [singlePage(composed3d, "Desain 3D")]))} berkas`);
