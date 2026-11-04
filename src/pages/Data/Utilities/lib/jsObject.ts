import { DataError } from "../../shared/errors";
import { lineCol, parseJsonStrict, type Indent } from "../../shared/json";

/* ================================================================== */
/* JS Object ↔ JSON — WITHOUT eval/new Function.                        */
/* Safe JavaScript object literal parser: data only (objects, arrays,   */
/* strings, numbers, booleans, null). Expressions/functions are rejected with a position. */
/* ================================================================== */

export interface JsParseResult {
  value: unknown;
  /** Conversion notes (e.g. undefined dropped), as i18n codes. */
  warnings: { code: string; params?: Record<string, string | number> }[];
}

const ID_START = /[A-Za-z_$À-￿]/;
const ID_PART = /[A-Za-z0-9_$À-￿]/;

class Parser {
  i = 0;
  warnings: JsParseResult["warnings"] = [];
  undefinedCount = 0;
  constructor(private s: string) {}

  fail(code: string, at = this.i, params: Record<string, string | number> = {}): never {
    const { line, col } = lineCol(this.s, at);
    throw new DataError(code, { line, col, ...params });
  }

  ws() {
    const s = this.s;
    for (;;) {
      const c = s[this.i];
      if (c === " " || c === "\t" || c === "\n" || c === "\r" || c === "﻿" || c === " ") this.i++;
      else if (c === "/" && s[this.i + 1] === "/") {
        while (this.i < s.length && s[this.i] !== "\n") this.i++;
      } else if (c === "/" && s[this.i + 1] === "*") {
        const end = s.indexOf("*/", this.i + 2);
        if (end < 0) this.fail("jsUnclosedComment");
        this.i = end + 2;
      } else return;
    }
  }

  ident(): string {
    const start = this.i;
    if (!ID_START.test(this.s[this.i] ?? "")) this.fail("jsUnexpected", this.i, { token: this.s[this.i] ?? "EOF" });
    while (ID_PART.test(this.s[this.i] ?? "")) this.i++;
    return this.s.slice(start, this.i);
  }

  /** Lewati pembungkus kode umum: const x =, export default, module.exports =. */
  prelude() {
    this.ws();
    const rest = this.s.slice(this.i);
    const m = /^(?:export\s+default\s+|module\.exports\s*=\s*|(?:export\s+)?(?:const|let|var)\s+[A-Za-z_$][\w$]*(?:\s*:\s*[^=]+?)?\s*=\s*)/.exec(rest);
    if (m) this.i += m[0].length;
  }

  parse(): unknown {
    this.prelude();
    this.ws();
    if (this.i >= this.s.length) this.fail("emptyInput");
    const v = this.value();
    this.ws();
    if (this.s[this.i] === ";") this.i++;
    // A trailing TypeScript "as const" / "satisfies X" is ignored.
    this.ws();
    const tail = /^(as\s+const|satisfies\s+[\w.<>[\], ]+)\s*;?/.exec(this.s.slice(this.i));
    if (tail) this.i += tail[0].length;
    this.ws();
    if (this.i < this.s.length) this.fail("jsTrailing", this.i, { token: this.s.slice(this.i, this.i + 12) });
    if (this.undefinedCount) this.warnings.push({ code: "undefinedRemoved", params: { count: this.undefinedCount } });
    return v === UNDEF ? null : v;
  }

  value(): unknown {
    this.ws();
    const c = this.s[this.i];
    if (c === "{") return this.object();
    if (c === "[") return this.array();
    if (c === '"' || c === "'" || c === "`") return this.string();
    if (c === "-" || c === "+" || c === "." || (c >= "0" && c <= "9")) return this.number();
    if (c !== undefined && ID_START.test(c)) {
      const at = this.i;
      const id = this.ident();
      if (id === "true") return true;
      if (id === "false") return false;
      if (id === "null") return null;
      if (id === "undefined") {
        this.undefinedCount++;
        return UNDEF;
      }
      if (id === "NaN" || id === "Infinity") this.fail("jsNonFinite", at, { token: id });
      if (id === "new" || id === "function") this.fail("jsExpression", at, { token: id });
      this.fail("jsIdentifier", at, { token: id });
    }
    if (c === undefined) this.fail("jsUnexpectedEnd");
    this.fail("jsUnexpected", this.i, { token: c });
  }

  object(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    this.i++; // {
    for (;;) {
      this.ws();
      if (this.s[this.i] === "}") {
        this.i++;
        return out;
      }
      const keyAt = this.i;
      let key: string;
      const c = this.s[this.i];
      if (c === '"' || c === "'" || c === "`") key = this.string();
      else if (c === "[") this.fail("jsComputedKey", keyAt);
      else if (c === "." && this.s.startsWith("...", this.i)) this.fail("jsSpread", keyAt);
      else if (c !== undefined && c >= "0" && c <= "9") key = String(this.number());
      else key = this.ident();
      this.ws();
      if (this.s[this.i] !== ":") {
        if (this.s[this.i] === "(") this.fail("jsExpression", keyAt, { token: key });
        this.fail("jsShorthand", keyAt, { token: key });
      }
      this.i++;
      const v = this.value();
      if (v !== UNDEF) {
        if (key === "__proto__") Object.defineProperty(out, key, { value: v, enumerable: true, writable: true, configurable: true });
        else out[key] = v;
      }
      this.ws();
      const d = this.s[this.i];
      if (d === ",") this.i++;
      else if (d === "}") continue;
      else if (d === undefined) this.fail("jsUnexpectedEnd");
      else this.fail("jsExpectedComma", this.i, { token: d });
    }
  }

  array(): unknown[] {
    const out: unknown[] = [];
    this.i++; // [
    for (;;) {
      this.ws();
      if (this.s[this.i] === "]") {
        this.i++;
        return out;
      }
      if (this.s[this.i] === ",") this.fail("jsHole");
      const v = this.value();
      out.push(v === UNDEF ? null : v);
      this.ws();
      const d = this.s[this.i];
      if (d === ",") this.i++;
      else if (d === "]") continue;
      else if (d === undefined) this.fail("jsUnexpectedEnd");
      else this.fail("jsExpectedComma", this.i, { token: d });
    }
  }

  string(): string {
    const q = this.s[this.i];
    const start = this.i;
    this.i++;
    let out = "";
    for (;;) {
      const c = this.s[this.i];
      if (c === undefined) this.fail("jsUnclosedString", start);
      if (c === q) {
        this.i++;
        return out;
      }
      if (q === "`" && c === "$" && this.s[this.i + 1] === "{") this.fail("jsTemplate", this.i);
      if ((c === "\n" || c === "\r") && q !== "`") this.fail("jsUnclosedString", start);
      if (c === "\\") {
        const e = this.s[this.i + 1];
        this.i += 2;
        switch (e) {
          case "n": out += "\n"; break;
          case "t": out += "\t"; break;
          case "r": out += "\r"; break;
          case "b": out += "\b"; break;
          case "f": out += "\f"; break;
          case "v": out += "\v"; break;
          case "0": out += "\0"; break;
          case "x": {
            const h = this.s.slice(this.i, this.i + 2);
            if (!/^[0-9a-fA-F]{2}$/.test(h)) this.fail("jsBadEscape", this.i - 2);
            out += String.fromCharCode(parseInt(h, 16));
            this.i += 2;
            break;
          }
          case "u": {
            if (this.s[this.i] === "{") {
              const end = this.s.indexOf("}", this.i);
              const h = end > 0 ? this.s.slice(this.i + 1, end) : "";
              if (!/^[0-9a-fA-F]{1,6}$/.test(h) || parseInt(h, 16) > 0x10ffff) this.fail("jsBadEscape", this.i - 2);
              out += String.fromCodePoint(parseInt(h, 16));
              this.i = end + 1;
            } else {
              const h = this.s.slice(this.i, this.i + 4);
              if (!/^[0-9a-fA-F]{4}$/.test(h)) this.fail("jsBadEscape", this.i - 2);
              out += String.fromCharCode(parseInt(h, 16));
              this.i += 4;
            }
            break;
          }
          case "\r":
            if (this.s[this.i] === "\n") this.i++;
            break; // line continuation
          case "\n":
            break;
          case undefined:
            this.fail("jsUnclosedString", start);
            break;
          default:
            out += e;
        }
        continue;
      }
      out += c;
      this.i++;
    }
  }

  number(): number {
    const start = this.i;
    const rest = this.s.slice(this.i);
    const m =
      /^[+-]?(?:0[xX][0-9a-fA-F_]+|0[bB][01_]+|0[oO][0-7_]+|(?:\d[\d_]*\.?[\d_]*|\.\d[\d_]*)(?:[eE][+-]?\d+)?)n?/.exec(rest);
    if (!m) {
      const id = /^[+-]?(Infinity|NaN)/.exec(rest);
      if (id) this.fail("jsNonFinite", start, { token: id[0] });
      this.fail("jsUnexpected", start, { token: rest[0] ?? "EOF" });
    }
    this.i += m[0].length;
    let raw = m[0].replace(/_/g, "");
    if (raw.endsWith("n")) this.fail("jsBigInt", start, { token: m[0] });
    let sign = 1;
    if (raw[0] === "-" || raw[0] === "+") {
      sign = raw[0] === "-" ? -1 : 1;
      raw = raw.slice(1);
    }
    const n = Number(raw);
    if (!Number.isFinite(n)) this.fail("jsNonFinite", start, { token: m[0] });
    if (Math.abs(n) > Number.MAX_SAFE_INTEGER && Number.isInteger(n)) this.warnings.push({ code: "unsafeInteger", params: { token: m[0] } });
    return sign * n;
  }
}

const UNDEF = Symbol("undefined");

/** JavaScript object/array literal → JSON value (safe, no code execution). */
export function parseJsObject(text: string): JsParseResult {
  const p = new Parser(text);
  const value = p.parse();
  return { value, warnings: p.warnings };
}

export function jsObjectToJson(text: string, indent: Indent = "2"): JsParseResult & { output: string } {
  const r = parseJsObject(text);
  return { ...r, output: JSON.stringify(r.value, null, indent === "tab" ? "\t" : Number(indent)) };
}

/* ------------------------------ JSON → JS ------------------------------ */

export interface JsPrintOptions {
  quote: "single" | "double";
  indent: Indent;
  /** No quotes for keys that are valid identifiers. */
  unquoteKeys: boolean;
  trailingComma: boolean;
  /** Variable name for `const <name> = ...;`; empty = literal only. */
  variable: string;
}

export const DEFAULT_JS_PRINT: JsPrintOptions = { quote: "single", indent: "2", unquoteKeys: true, trailingComma: false, variable: "data" };

const VALID_KEY = /^[A-Za-z_$][\w$]*$/;
const isValidVariable = (s: string) => VALID_KEY.test(s) && !RESERVED.has(s);
const RESERVED = new Set(
  "break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private protected public await".split(
    " ",
  ),
);

function quoteStr(s: string, q: "'" | '"'): string {
  let out = q;
  for (const ch of s) {
    const c = ch.codePointAt(0)!;
    if (ch === q) out += "\\" + q;
    else if (ch === "\\") out += "\\\\";
    else if (ch === "\n") out += "\\n";
    else if (ch === "\r") out += "\\r";
    else if (ch === "\t") out += "\\t";
    else if (c < 0x20 || c === 0x2028 || c === 0x2029) out += "\\u" + c.toString(16).padStart(4, "0");
    else out += ch;
  }
  return out + q;
}

export function printJs(value: unknown, o: JsPrintOptions = DEFAULT_JS_PRINT): string {
  const q = o.quote === "single" ? "'" : '"';
  const unit = o.indent === "tab" ? "\t" : " ".repeat(Number(o.indent));
  const tc = o.trailingComma ? "," : "";
  const key = (k: string) => (o.unquoteKeys && VALID_KEY.test(k) ? k : quoteStr(k, q));
  const pr = (v: unknown, depth: number): string => {
    const pad = unit.repeat(depth + 1);
    const end = unit.repeat(depth);
    if (v === null) return "null";
    if (typeof v === "string") return quoteStr(v, q);
    if (typeof v === "number" || typeof v === "boolean") return String(v);
    if (Array.isArray(v)) {
      if (!v.length) return "[]";
      return `[\n${v.map((x) => pad + pr(x, depth + 1)).join(",\n")}${tc}\n${end}]`;
    }
    if (typeof v === "object") {
      const entries = Object.entries(v as Record<string, unknown>);
      if (!entries.length) return "{}";
      return `{\n${entries.map(([k, x]) => `${pad}${key(k)}: ${pr(x, depth + 1)}`).join(",\n")}${tc}\n${end}}`;
    }
    return "null";
  };
  const body = pr(value, 0);
  const name = o.variable.trim();
  if (!name) return body;
  if (!isValidVariable(name)) throw new DataError("badVariable", { name });
  return `const ${name} = ${body};\n`;
}

export function jsonToJsObject(text: string, o: JsPrintOptions = DEFAULT_JS_PRINT): string {
  return printJs(parseJsonStrict(text), o);
}
