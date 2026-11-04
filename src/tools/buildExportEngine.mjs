// Bundle the export engine (src/exportEngine/engine.ts) into one ESM module
// for the Nest backend: <backend>/src/export-engine/engine.bundle.mjs
//
//   node src/tools/buildExportEngine.mjs ../onewebdev-backend
//
// Run again whenever elements, sections, or the code generator change,
// then copy the output along with the backend release.
import { build } from "esbuild";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const backend = resolve(process.argv[2] ?? "../onewebdev-backend");
const out = resolve(backend, "src/export-engine/engine.bundle.mjs");

await build({
  entryPoints: [resolve(here, "../exportEngine/engine.ts")],
  outfile: out,
  bundle: true,
  format: "esm",
  platform: "node",
  target: "node22",
  minify: true,
  legalComments: "eof",
  jsx: "automatic",
  loader: { ".svg": "text" },
  define: { "import.meta.env": "{}" },
  banner: { js: "// Dibuat otomatis oleh frontend src/tools/buildExportEngine.mjs. JANGAN diedit manual.\nimport { createRequire as __cr } from 'node:module'; const require = __cr(import.meta.url);" },
  logLevel: "info",
});
console.log("OK →", out);
