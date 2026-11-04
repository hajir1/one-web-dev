import { DataError } from "../../shared/errors";
import { parseCsv, toCsv, type Delimiter } from "../../shared/csv";
import { parseJsonStrict } from "../../shared/json";

/* ================================================================== */
/* Hash (Web Crypto), UUID v4, JSON ↔ CSV.                              */
/* ================================================================== */

export type HashAlgo = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export async function hashText(text: string, algo: HashAlgo = "SHA-256", format: "hex" | "base64" = "hex"): Promise<string> {
  if (!globalThis.crypto?.subtle) throw new DataError("cryptoUnavailable");
  const buf = new Uint8Array(await crypto.subtle.digest(algo, new TextEncoder().encode(text)));
  if (format === "hex") return Array.from(buf, (b) => b.toString(16).padStart(2, "0")).join("");
  let bin = "";
  buf.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

function uuidV4(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") return crypto.randomUUID();
  const b = crypto.getRandomValues(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export function uuids(count: number, upper = false): string {
  const n = Math.max(1, Math.min(500, Math.floor(count) || 1));
  return Array.from({ length: n }, () => (upper ? uuidV4().toUpperCase() : uuidV4())).join("\n");
}

/** Array of JSON objects → CSV (columns = union of all keys, in order of appearance). */
export function jsonToCsv(text: string, delimiter: Delimiter = ","): { output: string; rows: number; cols: number } {
  const v = parseJsonStrict(text);
  const arr = Array.isArray(v) ? v : [v];
  if (!arr.length) throw new DataError("noRows");
  if (arr.every((r) => Array.isArray(r))) {
    return { output: toCsv(arr as unknown[][], delimiter), rows: arr.length, cols: (arr as unknown[][]).reduce((m, r) => Math.max(m, r.length), 0) };
  }
  if (!arr.every((r) => r && typeof r === "object" && !Array.isArray(r))) throw new DataError("csvNeedsObjects");
  const cols: string[] = [];
  const seen = new Set<string>();
  for (const r of arr as Record<string, unknown>[]) for (const k of Object.keys(r)) {
    if (!seen.has(k)) {
      seen.add(k);
      cols.push(k);
    }
  }
  const rows = (arr as Record<string, unknown>[]).map((r) => cols.map((c) => r[c]));
  return { output: toCsv([cols, ...rows], delimiter), rows: rows.length, cols: cols.length };
}

/** CSV → JSON (the first row = column names when `header`). */
export function csvToJson(text: string, header = true, indent = 2): { output: string; rows: number; cols: number } {
  if (!text.trim()) throw new DataError("emptyInput");
  const rows = parseCsv(text);
  if (!rows.length) throw new DataError("noRows");
  const width = rows.reduce((m, r) => Math.max(m, r.length), 0);
  if (!header) return { output: JSON.stringify(rows, null, indent), rows: rows.length, cols: width };
  const used = new Set<string>();
  const head = Array.from({ length: width }, (_, i) => {
    const base = (rows[0][i] ?? "").trim() || `kolom_${i + 1}`;
    let name = base;
    for (let n = 2; used.has(name); n++) name = `${base}_${n}`;
    used.add(name);
    return name;
  });
  const out = rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ""])));
  return { output: JSON.stringify(out, null, indent), rows: out.length, cols: width };
}
