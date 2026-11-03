// Memecah src/locales/{id,en}.json menjadi dua bundle:
//   split/<lang>.core.json  : teks shell, beranda, auth, akun (ikut bundle awal)
//   split/<lang>.rest.json  : teks fitur besar (dimuat saat halaman fitur dibuka)
// Sumber yang diedit tetap src/locales/<lang>.json. Jalan otomatis lewat
// predev / prebuild / pretest; test app.test.ts memastikan hasilnya tidak basi.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const REST_KEYS = ["templates", "docs", "media", "guide", "pm", "el", "data", "market", "gs", "crud", "vr"];

const dir = join(dirname(fileURLToPath(import.meta.url)), "../src/locales");

export function splitLocale(all) {
  const core = {};
  const rest = {};
  for (const [k, v] of Object.entries(all)) (REST_KEYS.includes(k) ? rest : core)[k] = v;
  return { core, rest };
}

export function writeSplit() {
  mkdirSync(join(dir, "split"), { recursive: true });
  for (const lang of ["id", "en"]) {
    const { core, rest } = splitLocale(JSON.parse(readFileSync(join(dir, `${lang}.json`), "utf8")));
    writeFileSync(join(dir, "split", `${lang}.core.json`), JSON.stringify(core) + "\n");
    writeFileSync(join(dir, "split", `${lang}.rest.json`), JSON.stringify(rest) + "\n");
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) writeSplit();
