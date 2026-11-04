/* ================================================================== */
/* DEMO MODE template content generator (v12; v13: all templates).      */
/*                                                                    */
/*   npx tsx src/tools/genDemoTemplates.ts                             */
/*                                                                    */
/* Rewrites src/demo/demoContent.generated.ts (+ demoSpecs*.generated */
/* .ts): ONLY the templates in src/demo/demoTemplateIds.ts go into the bundle. */
/* - DEMO_PAGES: the page list of each template (for catalog cards).    */
/* - DEMO_LOADERS: content loaders per template (dynamic import), so    */
/*   the browser only downloads the template set being opened (v13).   */
/* - Code-based templates (starter, Pro, sets A–F): imported from files */
/*   sumbernya. Template berbasis spesifikasi (set G, H, I): spesifikasi */
/*   copied as data into demoSpecs<Set>.generated.ts and then built     */
/*   with that set's kit.                                              */
/* Run again whenever the demo id list or the source templates change. */
/* ================================================================== */

import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { DEMO_TEMPLATE_IDS } from "../demo/demoTemplateIds";
import { V6G_SPECS } from "../pages/webTemplates/templates/v6/setG/specs";
import { V7H_SPECS } from "../pages/webTemplates/templates/v7/setH/specs";
import { V9I_SPECS } from "../pages/webTemplates/templates/v9/setI/specs";
import { WEB_TEMPLATES } from "../pages/webTemplates/registry";

const here = (p: string) => fileURLToPath(new URL(p, import.meta.url));
const read = (p: string) => readFileSync(here(p), "utf8");

/** Index files mapping id → export name (relative to src/pages/webTemplates/). */
const INDEXES = ["registry.ts", "templates/pro/index.ts", "templates/v2/setA/index.ts", "templates/v2/setB/index.ts", "templates/v3/setC/index.ts", "templates/v3/setD/index.ts", "templates/v4/setE/index.ts", "templates/v5/setF/index.ts", "templates/v10/setJ/index.ts"];

/** id → { export, module (relative to src/demo/) } for code-based templates. */
const codeSource = new Map<string, { name: string; from: string }>();
for (const idx of INDEXES) {
  const src = read(`../pages/webTemplates/${idx}`);
  const dir = idx.includes("/") ? idx.slice(0, idx.lastIndexOf("/")) : "";
  const importOf = new Map<string, string>();
  for (const m of src.matchAll(/import \{([^}]+)\} from "(\.\/[^"]+)";/g))
    for (const name of m[1].split(",").map((x) => x.trim()).filter(Boolean)) importOf.set(name, `../pages/webTemplates/${dir ? `${dir}/` : ""}${m[2].slice(2)}`);
  for (const m of src.matchAll(/^\s*"([\w-]+)": (\w+),$/gm)) {
    const from = importOf.get(m[2]);
    if (from && !codeSource.has(m[1])) codeSource.set(m[1], { name: m[2], from });
  }
}

const specOf = (list: { id: string }[]) => new Map(list.map((s) => [s.id, s]));
const SPEC_SETS = [
  { key: "G", specs: specOf(V6G_SPECS), type: "GSpec", typeFrom: "../pages/webTemplates/templates/v6/setG/spec", build: "buildContent as buildG", buildFrom: "../pages/webTemplates/templates/v6/setG/kitG", fn: "buildG" },
  { key: "H", specs: specOf(V7H_SPECS), type: "HSpec", typeFrom: "../pages/webTemplates/templates/v7/setH/spec", build: "buildContent as buildH", buildFrom: "../pages/webTemplates/templates/v7/setH/kitH", fn: "buildH" },
  { key: "I", specs: specOf(V9I_SPECS), type: "ISpec", typeFrom: "../pages/webTemplates/templates/v9/setI/spec", build: "buildContentI", buildFrom: "../pages/webTemplates/templates/v9/setI/kitI", fn: "buildContentI" },
];

const entries: string[] = [];
const specData: Record<string, unknown[]> = { G: [], H: [], I: [] };
const missing: string[] = [];
const contentOf = new Map(WEB_TEMPLATES.map((t) => [t.id, t.content]));
const pages: Record<string, unknown> = {};

/** Specs must be pure data: the JSON copy must be identical to the original. */
function assertPlainData(id: string, spec: unknown) {
  const walk = (v: unknown, path: string) => {
    if (typeof v === "function" || typeof v === "symbol") throw new Error(`spesifikasi ${id} berisi nilai non-data di ${path}`);
    if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
  };
  walk(spec, id);
}

for (const id of DEMO_TEMPLATE_IDS) {
  const content = contentOf.get(id);
  if (!content) {
    missing.push(id);
    continue;
  }
  pages[id] = content.pages.map((p) => ({ key: p.key, slug: p.slug, name: p.name, ...(p.home ? { home: true } : {}) }));
  const code = codeSource.get(id);
  if (code) {
    entries.push(`  ${JSON.stringify(id)}: () => import("${code.from}").then((m) => m.${code.name}),`);
    continue;
  }
  const set = SPEC_SETS.find((s) => s.specs.has(id));
  if (!set) {
    missing.push(id);
    continue;
  }
  const spec = set.specs.get(id)!;
  assertPlainData(id, spec);
  specData[set.key].push(spec);
  entries.push(`  ${JSON.stringify(id)}: spec${set.key}(${JSON.stringify(id)}),`);
}
if (missing.length) throw new Error(`konten template demo tidak ditemukan: ${missing.join(", ")}`);

const HEADER = `/* ================================================================== */
/* GENERATED by src/tools/genDemoTemplates.ts — do not edit by hand. */
/* Demo mode templates; the id list is in src/demo/demoTemplateIds.ts.  */
/* ================================================================== */
`;

const used = SPEC_SETS.filter((s) => specData[s.key].length);
for (const s of SPEC_SETS) {
  const file = here(`../demo/demoSpecs${s.key}.generated.ts`);
  if (!specData[s.key].length) {
    rmSync(file, { force: true });
    continue;
  }
  writeFileSync(
    file,
    `${HEADER}
import type { TemplateContent } from "../pages/webTemplates/types";
import type { ${s.type} } from "${s.typeFrom}";
import { ${s.build} } from "${s.buildFrom}";

/** Spesifikasi set ${s.key} untuk template demo (${specData[s.key].length}). */
const SPECS = ${JSON.stringify(specData[s.key])} as unknown as ${s.type}[];

/** Bangun isi satu template set ${s.key}. */
export function content(id: string): TemplateContent {
  const spec = SPECS.find((x) => x.id === id);
  if (!spec) throw new Error("TEMPLATE_NOT_FOUND");
  return ${s.fn}(spec);
}
`,
  );
}

const out = `${HEADER}
import type { TemplateContent, TemplatePageDef } from "../pages/webTemplates/types";

/** Page of each demo template (catalog card; without loading the template content). */
export const DEMO_PAGES: Record<string, TemplatePageDef[]> = ${JSON.stringify(pages)};

type Loader = () => Promise<TemplateContent>;
${used.map((s) => `const spec${s.key} = (id: string): Loader => () => import("./demoSpecs${s.key}.generated").then((m) => m.content(id));`).join("\n")}

/** Demo template content loaders, keyed by catalog id (one chunk per source file). */
export const DEMO_LOADERS: Record<string, Loader> = {
${entries.join("\n")}
};
`;
writeFileSync(here("../demo/demoContent.generated.ts"), out);
const codeCount = entries.length - used.reduce((n, s) => n + specData[s.key].length, 0);
console.log(`Selesai: ${codeCount} template kode + ${used.map((s) => `${specData[s.key].length} set ${s.key}`).join(" + ")} → src/demo/demoContent.generated.ts`);
