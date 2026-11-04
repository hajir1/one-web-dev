import { DataError } from "../../shared/errors";

/* ================================================================== */
/* Text & web utilities (v10): change case, sample text, cron, diff,    */
/* regex, color contrast. Pure logic, tested in Node.                   */
/* ================================================================== */

/* ---------------------------- change case ---------------------------- */

/** Splits text into words: spaces, punctuation, camelCase, numbers. */
export function words(s: string): string[] {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
}

export type CaseId = "slug" | "camel" | "pascal" | "snake" | "constant" | "title" | "sentence" | "upper" | "lower";

const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();

/** Changes case per line (empty lines are kept). */
export function convertCase(input: string, to: CaseId): string {
  return input
    .split("\n")
    .map((line) => {
      if (to === "upper") return line.toUpperCase();
      if (to === "lower") return line.toLowerCase();
      if (to === "sentence") {
        const l = line.trim().toLowerCase();
        return l.charAt(0).toUpperCase() + l.slice(1);
      }
      if (to === "title") return line.replace(/\S+/g, (w) => cap(w));
      const ws = words(line);
      if (!ws.length) return "";
      switch (to) {
        case "slug":
          return ws.join("-").toLowerCase();
        case "snake":
          return ws.join("_").toLowerCase();
        case "constant":
          return ws.join("_").toUpperCase();
        case "camel":
          return ws[0].toLowerCase() + ws.slice(1).map(cap).join("");
        case "pascal":
          return ws.map(cap).join("");
      }
    })
    .join("\n");
}

/* ---------------------------- sample text --------------------------- */

const LOREM =
  "lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum".split(
    " ",
  );
const ID_WORDS =
  "kami menyediakan layanan terbaik untuk usaha anda dengan harga terjangkau tim berpengalaman siap membantu setiap hari produk berkualitas dibuat dari bahan pilihan pesan sekarang dan nikmati pengiriman cepat ke seluruh kota pelanggan kami puas karena pelayanan ramah tepat waktu serta hasil rapi hubungi kami untuk konsultasi gratis".split(
    " ",
  );

/** Small PRNG (mulberry32) so results can be tested with a fixed seed. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function dummyText(paragraphs: number, lang: "lorem" | "id", seed = Date.now()): string {
  const r = rng(seed);
  const bank = lang === "id" ? ID_WORDS : LOREM;
  const n = Math.max(1, Math.min(50, Math.floor(paragraphs)));
  const out: string[] = [];
  for (let p = 0; p < n; p++) {
    const sentences: string[] = [];
    const sc = 3 + Math.floor(r() * 4);
    for (let s = 0; s < sc; s++) {
      const len = 6 + Math.floor(r() * 9);
      const ws = Array.from({ length: len }, () => bank[Math.floor(r() * bank.length)]);
      if (p === 0 && s === 0 && lang === "lorem") ws.splice(0, 5, ...LOREM.slice(0, 5));
      const text = ws.join(" ");
      sentences.push(text.charAt(0).toUpperCase() + text.slice(1) + ".");
    }
    out.push(sentences.join(" "));
  }
  return out.join("\n\n");
}

/* -------------------------------- cron ------------------------------- */

interface CronField {
  values: Set<number>;
  any: boolean;
}
export interface CronExpr {
  minute: CronField;
  hour: CronField;
  dom: CronField;
  month: CronField;
  dow: CronField;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MACROS: Record<string, string> = {
  "@yearly": "0 0 1 1 *",
  "@annually": "0 0 1 1 *",
  "@monthly": "0 0 1 * *",
  "@weekly": "0 0 * * 0",
  "@daily": "0 0 * * *",
  "@midnight": "0 0 * * *",
  "@hourly": "0 * * * *",
};

function parseField(src: string, min: number, max: number, names: string[] | null, field: string): CronField {
  const values = new Set<number>();
  const name = (v: string) => {
    const up = v.toUpperCase();
    const i = names ? names.indexOf(up) : -1;
    if (i >= 0) return i + (names === MONTHS ? 1 : 0);
    if (!/^\d+$/.test(v)) throw new DataError("cronField", { field, value: src });
    return Number(v);
  };
  for (const part of src.split(",")) {
    const [range, stepS] = part.split("/");
    const step = stepS === undefined ? 1 : Number(stepS);
    if (!Number.isInteger(step) || step < 1) throw new DataError("cronField", { field, value: src });
    let a: number;
    let b: number;
    if (range === "*") [a, b] = [min, max];
    else if (range.includes("-")) {
      const [x, y] = range.split("-");
      [a, b] = [name(x), name(y)];
    } else {
      a = name(range);
      b = stepS === undefined ? a : max;
    }
    if (field === "dow" && b === 7) {
      // 7 = Sunday (same as 0).
      if (a === 7) a = 0;
      else values.add(0);
      b = a === 0 && part.split("/")[0] !== "*" && !range.includes("-") ? 0 : 6;
    }
    if (a < min || b > max || a > b) throw new DataError("cronField", { field, value: src });
    for (let v = a; v <= b; v += step) values.add(v);
  }
  return { values, any: src === "*" };
}

export function parseCron(input: string): CronExpr {
  const raw = input.trim().replace(/\s+/g, " ");
  const expr = MACROS[raw.toLowerCase()] ?? raw;
  const parts = expr.split(" ");
  if (parts.length !== 5) throw new DataError("cronParts", { count: parts.length });
  return {
    minute: parseField(parts[0], 0, 59, null, "minute"),
    hour: parseField(parts[1], 0, 23, null, "hour"),
    dom: parseField(parts[2], 1, 31, null, "dom"),
    month: parseField(parts[3], 1, 12, MONTHS, "month"),
    dow: parseField(parts[4], 0, 7, DAYS, "dow"),
  };
}

function dayMatches(c: CronExpr, d: Date): boolean {
  const dom = c.dom.values.has(d.getDate());
  const dow = c.dow.values.has(d.getDay());
  // Standard cron rule: when both day-of-month AND day-of-week are restricted, either one matching is enough.
  if (!c.dom.any && !c.dow.any) return dom || dow;
  return (c.dom.any || dom) && (c.dow.any || dow);
}

/** Next runs (local time), at most `count`, searched up to ±4 years. */
export function nextRuns(c: CronExpr, from: Date, count = 5): Date[] {
  const out: Date[] = [];
  const d = new Date(from.getTime());
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const limit = from.getTime() + 4 * 366 * 24 * 3600 * 1000;
  while (out.length < count && d.getTime() < limit) {
    if (!c.month.values.has(d.getMonth() + 1)) {
      d.setMonth(d.getMonth() + 1, 1);
      d.setHours(0, 0);
    } else if (!dayMatches(c, d)) {
      d.setDate(d.getDate() + 1);
      d.setHours(0, 0);
    } else if (!c.hour.values.has(d.getHours())) {
      d.setHours(d.getHours() + 1, 0);
    } else {
      if (c.minute.values.has(d.getMinutes())) out.push(new Date(d.getTime()));
      d.setMinutes(d.getMinutes() + 1);
    }
  }
  return out;
}

/** Cron explanation in plain language. */
export function describeCron(c: CronExpr, lang: "id" | "en"): string {
  const id = lang === "id";
  const list = (f: CronField, fmt: (n: number) => string) => {
    const v = [...f.values].sort((a, b) => a - b);
    return v.length > 6 ? `${v.slice(0, 6).map(fmt).join(", ")}…` : v.map(fmt).join(", ");
  };
  const pad = (n: number) => String(n).padStart(2, "0");
  const dayNames = id ? ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"] : ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const monthNames = id
    ? ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const parts: string[] = [];
  const allMin = c.minute.values.size === 60;
  const allHour = c.hour.values.size === 24;
  if (allMin && allHour) parts.push(id ? "Setiap menit" : "Every minute");
  else if (allHour && c.minute.values.size === 1) parts.push(id ? `Setiap jam pada menit ke-${[...c.minute.values][0]}` : `Every hour at minute ${[...c.minute.values][0]}`);
  else if (c.minute.values.size * c.hour.values.size <= 6) {
    const times = [...c.hour.values].sort((a, b) => a - b).flatMap((h) => [...c.minute.values].sort((a, b) => a - b).map((m) => `${pad(h)}:${pad(m)}`));
    parts.push(id ? `Pukul ${times.join(", ")}` : `At ${times.join(", ")}`);
  } else {
    parts.push(id ? `Menit ${list(c.minute, String)}` : `At minute ${list(c.minute, String)}`);
    if (!allHour) parts.push(id ? `jam ${list(c.hour, pad)}` : `past hour ${list(c.hour, pad)}`);
  }
  if (!c.dom.any) parts.push(id ? `tanggal ${list(c.dom, String)}` : `on day ${list(c.dom, String)} of the month`);
  if (!c.dow.any) parts.push(`${id ? (c.dom.any ? "setiap hari" : "atau hari") : c.dom.any ? "on" : "or on"} ${list(c.dow, (n) => dayNames[n])}`);
  if (!c.month.any && c.month.values.size < 12) parts.push(id ? `bulan ${list(c.month, (n) => monthNames[n - 1])}` : `in ${list(c.month, (n) => monthNames[n - 1])}`);
  return parts.join(", ") + ".";
}

/* -------------------------------- diff -------------------------------- */

export type DiffOp = { type: "same" | "add" | "del"; text: string };

/** Line diff (LCS). Limited so the tab does not hang on very large text. */
export function diffLines(a: string, b: string, opts: { ignoreWhitespace?: boolean; ignoreCase?: boolean } = {}): DiffOp[] {
  const A = a.split("\n");
  const B = b.split("\n");
  if (A.length * B.length > 25_000_000) throw new DataError("diffTooLarge");
  const norm = (s: string) => {
    let x = opts.ignoreWhitespace ? s.replace(/\s+/g, " ").trim() : s;
    if (opts.ignoreCase) x = x.toLowerCase();
    return x;
  };
  const NA = A.map(norm);
  const NB = B.map(norm);
  // Trim the shared prefix & suffix (the common case: small changes).
  let start = 0;
  while (start < NA.length && start < NB.length && NA[start] === NB[start]) start++;
  let endA = NA.length;
  let endB = NB.length;
  while (endA > start && endB > start && NA[endA - 1] === NB[endB - 1]) {
    endA--;
    endB--;
  }
  const n = endA - start;
  const m = endB - start;
  const dp: Uint32Array[] = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--) dp[i][j] = NA[start + i] === NB[start + j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const out: DiffOp[] = A.slice(0, start).map((text) => ({ type: "same" as const, text }));
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (NA[start + i] === NB[start + j]) {
      out.push({ type: "same", text: B[start + j] });
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) out.push({ type: "del", text: A[start + i++] });
    else out.push({ type: "add", text: B[start + j++] });
  }
  while (i < n) out.push({ type: "del", text: A[start + i++] });
  while (j < m) out.push({ type: "add", text: B[start + j++] });
  for (let k = endB; k < B.length; k++) out.push({ type: "same", text: B[k] });
  return out;
}

/** Simple unified format for download/copy. */
export const diffToText = (ops: DiffOp[]) => ops.map((o) => `${o.type === "add" ? "+" : o.type === "del" ? "-" : " "} ${o.text}`).join("\n");

/* -------------------------------- regex ------------------------------- */

export interface RegexMatch {
  index: number;
  text: string;
  groups: (string | undefined)[];
  named?: Record<string, string | undefined>;
}

export const MAX_REGEX_MATCHES = 1000;

/** Runs a regex. Invalid pattern → DataError with the JS engine message. */
export function runRegex(pattern: string, flags: string, text: string): { matches: RegexMatch[]; truncated: boolean } {
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.includes("g") ? flags : flags + "g");
  } catch (e) {
    throw new DataError("regexInvalid", { detail: (e as Error).message });
  }
  const matches: RegexMatch[] = [];
  for (const m of text.matchAll(re)) {
    matches.push({ index: m.index ?? 0, text: m[0], groups: m.slice(1), ...(m.groups ? { named: { ...m.groups } } : {}) });
    if (matches.length >= MAX_REGEX_MATCHES) return { matches, truncated: true };
    if (!flags.includes("g")) break;
  }
  return { matches, truncated: false };
}

export function regexReplace(pattern: string, flags: string, text: string, replacement: string): string {
  try {
    return text.replace(new RegExp(pattern, flags), replacement);
  } catch (e) {
    throw new DataError("regexInvalid", { detail: (e as Error).message });
  }
}

/* ------------------------------- kontras ------------------------------ */

export function parseHex(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
}

export function luminance([r, g, b]: [number, number, number]): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

/** Rasio kontras WCAG 2.x (1–21). */
export function contrastRatio(fg: string, bg: string): number | null {
  const a = parseHex(fg);
  const b = parseHex(bg);
  if (!a || !b) return null;
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

export function wcagLevels(ratio: number) {
  return { aaNormal: ratio >= 4.5, aaLarge: ratio >= 3, aaaNormal: ratio >= 7, aaaLarge: ratio >= 4.5, ui: ratio >= 3 };
}
