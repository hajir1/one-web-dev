import { DataError } from "./errors";

/* ================================================================== */
/* JSON: parse dengan posisi error (baris/kolom), format, minify.        */
/* ================================================================== */

/** Offset karakter → { line, col } (1-based). */
export function lineCol(text: string, offset: number): { line: number; col: number } {
  let line = 1;
  let col = 1;
  for (let i = 0; i < offset && i < text.length; i++) {
    if (text[i] === "\n") {
      line++;
      col = 1;
    } else col++;
  }
  return { line, col };
}

/**
 * Posisi karakter pertama yang membuat JSON tidak valid (pemindai kecil,
 * karena pesan JSON.parse tidak selalu menyebut posisi — mis. V8 untuk
 * token tak terduga). null bila teks ternyata valid.
 */
function findJsonErrorOffset(text: string): number | null {
  let i = 0;
  const ws = () => {
    while (i < text.length && " \t\n\r".includes(text[i])) i++;
  };
  class Stop {
    constructor(public at: number) {}
  }
  const fail = (at = i): never => {
    throw new Stop(at);
  };
  const lit = (w: string) => {
    if (text.startsWith(w, i)) i += w.length;
    else fail();
  };
  const str = () => {
    i++; // "
    while (i < text.length) {
      const c = text[i];
      if (c === '"') return void i++;
      if (c === "\\") {
        const e = text[i + 1];
        if (e === "u") {
          if (!/^[0-9a-fA-F]{4}$/.test(text.slice(i + 2, i + 6))) fail(i);
          i += 6;
        } else if (e !== undefined && '"\\/bfnrt'.includes(e)) i += 2;
        else fail(i);
      } else if (c < " ") fail(i);
      else i++;
    }
    fail(text.length);
  };
  const num = () => {
    const m = /^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/.exec(text.slice(i));
    if (!m) fail();
    i += m![0].length;
  };
  const val = (): void => {
    ws();
    const c = text[i];
    if (c === "{") {
      i++;
      ws();
      if (text[i] === "}") return void i++;
      for (;;) {
        ws();
        if (text[i] !== '"') fail();
        str();
        ws();
        if (text[i] !== ":") fail();
        i++;
        val();
        ws();
        if (text[i] === ",") {
          i++;
          continue;
        }
        if (text[i] === "}") return void i++;
        fail();
      }
    }
    if (c === "[") {
      i++;
      ws();
      if (text[i] === "]") return void i++;
      for (;;) {
        val();
        ws();
        if (text[i] === ",") {
          i++;
          continue;
        }
        if (text[i] === "]") return void i++;
        fail();
      }
    }
    if (c === '"') return str();
    if (c === "t") return lit("true");
    if (c === "f") return lit("false");
    if (c === "n") return lit("null");
    if (c === "-" || (c >= "0" && c <= "9")) return num();
    fail();
  };
  try {
    val();
    ws();
    if (i < text.length) fail();
    return null;
  } catch (e) {
    if (e instanceof Stop) return Math.min(e.at, text.length);
    throw e;
  }
}

/** JSON.parse yang melempar DataError("invalidJson", {line, col, detail}). */
export function parseJsonStrict(text: string): unknown {
  if (!text.trim()) throw new DataError("emptyInput");
  const src = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  try {
    return JSON.parse(src);
  } catch (e) {
    const off = findJsonErrorOffset(src);
    if (off === null) throw new DataError("invalidJsonNoPos", { detail: (e instanceof Error ? e.message : String(e)).slice(0, 160) });
    const { line, col } = lineCol(src, off);
    const ch = src[off];
    throw new DataError("invalidJson", { line, col, char: ch === undefined ? "EOF" : JSON.stringify(ch).slice(1, -1) });
  }
}

/** Urutkan kunci objek secara rekursif (stabil, untuk diff). */
function sortKeysDeep(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(sortKeysDeep);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(v as object).sort()) out[k] = sortKeysDeep((v as Record<string, unknown>)[k]);
    return out;
  }
  return v;
}

export type Indent = "2" | "4" | "tab";
const indentOf = (i: Indent) => (i === "tab" ? "\t" : Number(i));

export function formatJson(text: string, indent: Indent = "2", sortKeys = false): string {
  const v = parseJsonStrict(text);
  return JSON.stringify(sortKeys ? sortKeysDeep(v) : v, null, indentOf(indent));
}

export function minifyJson(text: string): string {
  return JSON.stringify(parseJsonStrict(text));
}

/** Ringkasan struktur untuk validator: tipe akar, jumlah elemen, kedalaman, jumlah kunci. */
export function jsonStats(v: unknown): { root: string; size: number; depth: number; keys: number } {
  let keys = 0;
  const depthOf = (x: unknown): number => {
    if (!x || typeof x !== "object") return 0;
    const vals = Array.isArray(x) ? x : Object.values(x as object);
    if (!Array.isArray(x)) keys += vals.length;
    let d = 0;
    for (const c of vals) d = Math.max(d, depthOf(c)); // loop, bukan spread (array besar)
    return 1 + d;
  };
  const depth = depthOf(v);
  const root = Array.isArray(v) ? "array" : v === null ? "null" : typeof v;
  const size = Array.isArray(v) ? v.length : v && typeof v === "object" ? Object.keys(v).length : 1;
  return { root, size, depth, keys };
}
