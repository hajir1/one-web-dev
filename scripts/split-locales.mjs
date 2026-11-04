// Splits src/locales/{id,en}.json into two bundles:
//   split/<lang>.core.json  : shell, home, auth, account text (in the initial bundle)
//   split/<lang>.rest.json  : large feature text (loaded when a feature page opens)
// The edited source stays src/locales/<lang>.json. Runs automatically through
// predev / prebuild / pretest; the app.test.ts test makes sure the output is not stale.
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
