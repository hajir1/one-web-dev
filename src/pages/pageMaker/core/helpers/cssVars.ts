/* ================================================================== */
/* Variabel global (v7) — logika murni, tanpa React                     */
/*                                                                    */
/* Pengguna membuat variabel di Pengaturan Global (nama, tipe, nilai).  */
/* Variabel ditulis sebagai CSS custom property di `:root`:             */
/*   x = #000000   →   :root { --x: #000000; }                          */
/* Field elemen yang memakai variabel menyimpan string `var(--x)`       */
/* (referensi, bukan salinan nilai), jadi mengubah nilai variabel       */
/* langsung mengubah semua elemen yang memakainya.                      */
/*                                                                    */
/* Generator CSS elemen ditulis untuk angka/hex. Supaya tidak perlu     */
/* mengubah puluhan generator, compose memakai "sentinel": field yang   */
/* berisi var(--x) diganti nilai penanda unik, CSS dibuat, lalu penanda */
/* diganti kembali dengan var(--x). Bila generator mengolah nilainya    */
/* (mis. dikali 0,6), hasilnya tidak bisa dipetakan dan compose memakai */
/* nilai variabel saat ini sebagai gantinya (dengan peringatan).        */
/* ================================================================== */

export type VarType = "color" | "size" | "font" | "text";

export const VAR_TYPES: VarType[] = ["color", "size", "font", "text"];

export interface CssVar {
  id: string;
  /** Nama tanpa awalan `--`, sudah dinormalisasi (huruf, angka, -, _). */
  name: string;
  type: VarType;
  value: string;
  /** Variabel bawaan: tidak bisa dihapus/diganti nama, nilai bisa diubah & direset. */
  builtin?: boolean;
}

/** Variabel bawaan (warna utama, font, dst). Nilai bawaan dipakai juga untuk tombol reset. */
export const BUILTIN_VARS: CssVar[] = [
  { id: "builtin-color-primary", name: "color-primary", type: "color", value: "#3b68f0", builtin: true },
  { id: "builtin-color-secondary", name: "color-secondary", type: "color", value: "#0f172a", builtin: true },
  { id: "builtin-color-text", name: "color-text", type: "color", value: "#1f2937", builtin: true },
  { id: "builtin-color-muted", name: "color-muted", type: "color", value: "#64748b", builtin: true },
  { id: "builtin-color-surface", name: "color-surface", type: "color", value: "#ffffff", builtin: true },
  { id: "builtin-font-heading", name: "font-heading", type: "font", value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', builtin: true },
  { id: "builtin-font-body", name: "font-body", type: "font", value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif', builtin: true },
  { id: "builtin-radius", name: "radius", type: "size", value: "8px", builtin: true },
  { id: "builtin-space", name: "space", type: "size", value: "16px", builtin: true },
];

export const builtinDefault = (name: string): CssVar | undefined => BUILTIN_VARS.find((b) => b.name === name);

/* ------------------------------ nama ------------------------------- */

const NAME_RE = /^[A-Za-z0-9_-]{1,40}$/;

/** "  --Warna Utama " → "warna-utama". Huruf kecil, spasi jadi "-". */
export function normalizeVarName(input: string): string {
  return input
    .trim()
    .replace(/^-+/, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

export type VarError = "nameEmpty" | "nameInvalid" | "nameTaken" | "valueInvalid";

export function validateVarName(raw: string, existing: readonly CssVar[], selfId?: string): VarError | null {
  const name = normalizeVarName(raw);
  if (!name) return "nameEmpty";
  if (!NAME_RE.test(name)) return "nameInvalid";
  if (existing.some((v) => v.name === name && v.id !== selfId)) return "nameTaken";
  return null;
}

/* ------------------------------ nilai ------------------------------ */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const COLOR_FN = /^(rgb|rgba|hsl|hsla)\(\s*[0-9.,%\s/-]+\)$/i;
const SIZE_RE = /^-?\d+(\.\d+)?(px|rem|em|%|vw|vh)$/;
const FONT_RE = /^[A-Za-z0-9 ,"'_-]{1,200}$/;
const TEXT_BAD = /[;{}<>\\\n\r]/;

export function isValidVarValue(type: VarType, raw: string): boolean {
  const v = raw.trim();
  if (!v) return false;
  switch (type) {
    case "color":
      return HEX.test(v) || COLOR_FN.test(v) || v.toLowerCase() === "transparent";
    case "size":
      return SIZE_RE.test(v) || v === "0";
    case "font":
      return FONT_RE.test(v);
    case "text":
      return v.length <= 200 && !TEXT_BAD.test(v) && !/url\s*\(|expression\s*\(/i.test(v);
  }
}

/** Nilai bawaan saat membuat variabel baru per tipe. */
export const DEFAULT_VALUE: Record<VarType, string> = {
  color: "#000000",
  size: "16px",
  font: 'system-ui, sans-serif',
  text: '"Teks"',
};

/* ---------------------------- referensi ---------------------------- */

const VAR_REF_RE = /^var\(--([A-Za-z0-9_-]{1,40})\)$/;
const VAR_REF_G = /var\(--([A-Za-z0-9_-]{1,40})\)/g;

export const varRef = (name: string) => `var(--${name})`;
export const isVarRef = (v: unknown): boolean => typeof v === "string" && VAR_REF_RE.test(v.trim());
export const refName = (v: string): string | null => VAR_REF_RE.exec(v.trim())?.[1] ?? null;

/** Gabung variabel: urutan belakang menang (mis. [bawaan desain, global]). */
export function mergeVars(...lists: (readonly CssVar[] | undefined)[]): CssVar[] {
  const map = new Map<string, CssVar>();
  for (const l of lists) for (const v of l ?? []) if (v && NAME_RE.test(v.name) && isValidVarValue(v.type, v.value)) map.set(v.name, v);
  return [...map.values()];
}

/** Blok `:root { --x: nilai; }` ("" bila tidak ada variabel). */
export function rootVarsCss(vars: readonly CssVar[], selector = ":root"): string {
  const ok = vars.filter((v) => NAME_RE.test(v.name) && isValidVarValue(v.type, v.value));
  if (!ok.length) return "";
  return `/* Variabel global */\n${selector} {\n${ok.map((v) => `  --${v.name}: ${v.value.trim()};`).join("\n")}\n}\n`;
}

/** Ganti semua var(--x) yang dikenal dengan nilainya (untuk mendeteksi font yang dipakai). */
export function expandVarRefs(css: string, vars: readonly CssVar[]): string {
  const map = new Map(vars.map((v) => [v.name, v.value]));
  return css.replace(VAR_REF_G, (m, n: string) => map.get(n) ?? m);
}

/** Nama variabel yang dirujuk di sebuah teks (CSS atau JSON state). */
export function varNamesIn(text: string): string[] {
  return [...new Set([...text.matchAll(VAR_REF_G)].map((m) => m[1]))];
}

/** Nilai px perkiraan dari ukuran (rem/em ×16). Dipakai saat nilai harus angka. */
export function sizeToPx(value: string): number {
  const m = /^(-?\d+(?:\.\d+)?)(px|rem|em|%|vw|vh)?$/.exec(value.trim());
  if (!m) return 0;
  const n = Number(m[1]);
  return m[2] === "rem" || m[2] === "em" ? Math.round(n * 16 * 100) / 100 : n;
}

/** Nilai variabel saat referensinya dilepas: ukuran → angka px, lainnya → teks nilai. */
function detachedValue(v: CssVar): string | number {
  return v.type === "size" ? sizeToPx(v.value) : v.value;
}

/* ------------------------- pemakaian di desain ------------------------- */

/** Jumlah referensi var(--name) di sebuah nilai (objek state, pohon desain). */
export function countRefs(obj: unknown, name: string): number {
  const ref = varRef(name);
  let n = 0;
  const walk = (o: unknown) => {
    if (typeof o === "string") {
      if (o.includes(ref)) n += o.split(ref).length - 1;
    } else if (Array.isArray(o)) o.forEach(walk);
    else if (o && typeof o === "object") Object.values(o).forEach(walk);
  };
  walk(obj);
  return n;
}

/** Salinan `obj` dengan setiap string diubah lewat `fn` (null = tidak berubah). */
function mapStrings(obj: unknown, fn: (s: string) => string | number | null): { value: unknown; changed: boolean } {
  let changed = false;
  const walk = (o: unknown): unknown => {
    if (typeof o === "string") {
      const r = fn(o);
      if (r === null) return o;
      changed = true;
      return r;
    }
    if (Array.isArray(o)) return o.map(walk);
    if (o && typeof o === "object") return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, walk(v)]));
    return o;
  };
  const value = walk(obj);
  return { value, changed };
}

/** Ganti nama referensi var(--from) → var(--to). */
export function renameRefs<T>(obj: T, from: string, to: string): { value: T; changed: boolean } {
  const a = varRef(from);
  const b = varRef(to);
  const r = mapStrings(obj, (s) => (s.includes(a) ? s.split(a).join(b) : null));
  return { value: r.value as T, changed: r.changed };
}

/**
 * Lepas referensi var(--name): field yang isinya persis var(--name) diganti
 * nilai terakhir variabel (ukuran → angka px), referensi di dalam teks lain
 * (mis. Custom CSS) diganti nilainya apa adanya.
 */
export function detachRefs<T>(obj: T, v: CssVar): { value: T; changed: boolean } {
  const ref = varRef(v.name);
  const r = mapStrings(obj, (s) => {
    if (!s.includes(ref)) return null;
    if (s.trim() === ref) return detachedValue(v);
    return s.split(ref).join(v.value);
  });
  return { value: r.value as T, changed: r.changed };
}

/* ----------------------------- sentinel ----------------------------- */

type BindKind = "number" | "color" | "string";

export interface VarBinding {
  key: string;
  name: string;
  kind: BindKind;
  /** Nilai sentinel (dipakai pass CSS). */
  sentinel: string | number;
  /** Nilai konkret saat ini (dipakai pass pembanding & markup). */
  resolved: string | number;
}

const COLORISH = /^(#|rgb|hsl|transparent$)/i;

function kindOf(def: unknown, key: string): BindKind {
  if (typeof def === "number") return "number";
  if (typeof def === "string" && (COLORISH.test(def.trim()) || /color/i.test(key))) return "color";
  return "string";
}

const sentinelHex = (i: number) => `#7a${(0x10 + i).toString(16).padStart(2, "0")}5c`;
const hexRgb = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Nilai konkret untuk field yang terikat variabel. */
function resolvedFor(kind: BindKind, v: CssVar | undefined, fallback: unknown): string | number {
  if (kind === "number") return v ? sizeToPx(v.value) : typeof fallback === "number" ? fallback : 0;
  if (kind === "color") {
    if (v && HEX.test(v.value.trim())) return v.value.trim();
    // Pembanding butuh hex; warna non-hex (rgb/transparent) diwakili hex netral.
    return v ? "#808080" : typeof fallback === "string" ? fallback : "#000000";
  }
  return v ? v.value : typeof fallback === "string" ? fallback : "";
}

/**
 * Siapkan dua salinan state: `css` (field ber-var(--x) diganti sentinel)
 * dan `plain` (diganti nilai variabel saat ini). Tanpa referensi →
 * `bindings` kosong dan keduanya = state asli.
 */
export function bindVars(
  defaults: Record<string, unknown>,
  state: Record<string, unknown>,
  vars: readonly CssVar[],
): { css: Record<string, unknown>; plain: Record<string, unknown>; bindings: VarBinding[]; missing: string[] } {
  const bindings: VarBinding[] = [];
  const missing: string[] = [];
  let css = state;
  let plain = state;
  const byName = new Map(vars.map((v) => [v.name, v]));
  let i = 0;
  for (const [key, val] of Object.entries(state)) {
    if (!isVarRef(val)) continue;
    const name = refName(val as string)!;
    const v = byName.get(name);
    if (!v) missing.push(name);
    const kind = kindOf(defaults[key], key);
    const sentinel = kind === "number" ? 917301 + i * 7 : kind === "color" ? sentinelHex(i) : `owdvar${i}x`;
    const resolved = resolvedFor(kind, v, defaults[key]);
    i++;
    if (css === state) {
      css = { ...state };
      plain = { ...state };
    }
    css[key] = sentinel;
    plain[key] = resolved;
    bindings.push({ key, name, kind, sentinel, resolved });
  }
  return { css, plain, bindings, missing };
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Petakan sentinel di `cssSentinel` kembali ke var(--x). `cssPlain` = CSS
 * dari state berisi nilai konkret: dipakai untuk memastikan generator tidak
 * mengolah nilainya. Mengembalikan null bila pemetaan tidak aman.
 */
export function restoreVars(cssSentinel: string, cssPlain: string, bindings: readonly VarBinding[]): string | null {
  if (!bindings.length) return cssSentinel;
  let out = cssSentinel;
  let check = cssSentinel;
  for (const b of bindings) {
    const ref = varRef(b.name);
    if (b.kind === "number") {
      const s = String(b.sentinel);
      // Sentinel dengan satuan selain px (%, ms, …) atau dalam ekspresi → tidak aman.
      if (new RegExp(`${esc(s)}(?!px\\b)[a-z%]`, "i").test(out) || new RegExp(`[\\d.]${esc(s)}|${esc(s)}\\.\\d`).test(out)) return null;
      const bare = new RegExp(`(?<![\\d.])${esc(s)}(?![\\d.])`, "g");
      out = out.replace(new RegExp(`${esc(s)}px\\b`, "g"), ref).replace(bare, ref);
      check = check.replace(bare, String(b.resolved));
    } else if (b.kind === "color") {
      const hex = String(b.sentinel);
      const [r, g, bl] = hexRgb(hex);
      const rgba = new RegExp(`rgba?\\(\\s*${r}\\s*,\\s*${g}\\s*,\\s*${bl}\\s*(?:,\\s*([\\d.]+)\\s*)?\\)`, "g");
      out = out
        .replace(new RegExp(esc(hex), "gi"), ref)
        .replace(rgba, (_m, a?: string) => (a === undefined || Number(a) >= 1 ? ref : `color-mix(in srgb, ${ref} ${Math.round(Number(a) * 1000) / 10}%, transparent)`));
      const [pr, pg, pb] = hexRgb(toHex6Plain(String(b.resolved)));
      check = check.replace(new RegExp(esc(hex), "gi"), String(b.resolved)).replace(rgba, (_m, a?: string) => (a === undefined ? `rgb(${pr}, ${pg}, ${pb})` : `rgba(${pr}, ${pg}, ${pb}, ${a})`));
      // Bandingkan bentuk rgb() yang sama di cssPlain.
      cssPlain = cssPlain.replace(new RegExp(`rgb\\(\\s*${pr}\\s*,\\s*${pg}\\s*,\\s*${pb}\\s*\\)`, "g"), `rgb(${pr}, ${pg}, ${pb})`);
    } else {
      const s = String(b.sentinel);
      out = out.split(s).join(ref);
      check = check.split(s).join(String(b.resolved));
    }
  }
  return check === cssPlain ? out : null;
}

function toHex6Plain(v: string): string {
  const t = v.trim();
  if (/^#[0-9a-f]{6}$/i.test(t)) return t;
  if (/^#[0-9a-f]{3}$/i.test(t)) return `#${t.slice(1).split("").map((c) => c + c).join("")}`;
  if (/^#[0-9a-f]{8}$/i.test(t)) return t.slice(0, 7);
  return "#808080";
}

/** Bersihkan daftar variabel dari penyimpanan (localStorage / data desain). */
/** Variabel bawaan selalu ada (nilai tersimpan yang valid menang), lalu variabel buatan pengguna. */
export function withBuiltinVars(saved: readonly CssVar[]): CssVar[] {
  const builtins = BUILTIN_VARS.map((b) => {
    const s = saved.find((v) => v.name === b.name);
    return s && s.type === b.type && isValidVarValue(b.type, s.value) ? { ...b, value: s.value } : b;
  });
  const reserved = new Set(BUILTIN_VARS.map((b) => b.name));
  return [...builtins, ...saved.filter((v) => !reserved.has(v.name)).map((v) => ({ ...v, builtin: undefined }))];
}

export function sanitizeVars(raw: unknown): CssVar[] {
  if (!Array.isArray(raw)) return [];
  const out: CssVar[] = [];
  const names = new Set<string>();
  for (const r of raw) {
    if (!r || typeof r !== "object") continue;
    const o = r as Record<string, unknown>;
    const name = typeof o.name === "string" ? normalizeVarName(o.name) : "";
    const type = VAR_TYPES.includes(o.type as VarType) ? (o.type as VarType) : null;
    const value = typeof o.value === "string" ? o.value.trim() : "";
    if (!type || !NAME_RE.test(name) || names.has(name) || !isValidVarValue(type, value)) continue;
    names.add(name);
    out.push({ id: typeof o.id === "string" && o.id ? o.id.slice(0, 60) : `v-${name}`, name, type, value, ...(o.builtin === true ? { builtin: true } : {}) });
  }
  return out.slice(0, 200);
}
