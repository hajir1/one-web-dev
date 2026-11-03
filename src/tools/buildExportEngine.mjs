// Bundel mesin ekspor (src/exportEngine/engine.ts) menjadi satu modul ESM
// untuk backend Nest: <backend>/src/export-engine/engine.bundle.mjs
//
//   node src/tools/buildExportEngine.mjs ../onewebdev-backend
//
// Jalankan ulang setiap kali elemen, section, atau generator kode berubah,
// lalu salin hasilnya bersama rilis backend.
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
