/* ================================================================== */
/* Global variables (v7) — pure logic, no React                         */
/*                                                                    */
/* Users create variables in Global Settings (name, type, value).       */
/* Variables are written as CSS custom properties on `:root`:           */
/*   x = #000000   →   :root { --x: #000000; }                          */
/* Element fields that use a variable store the string `var(--x)`       */
/* (a reference, not a copy of the value), so changing the variable value */
/* immediately changes every element that uses it.                      */
/*                                                                    */
/* Element CSS generators are written for numbers/hex. To avoid         */
/* changing dozens of generators, compose uses a "sentinel": fields     */
/* holding var(--x) are replaced with a unique marker value, the CSS is built, then the marker */
/* is replaced back with var(--x). When a generator transforms the value */
/* (e.g. multiplies it by 0.6), the result cannot be mapped and compose uses */
/* the variable's current value instead (with a warning).               */
/* ================================================================== */

export type VarType = "color" | "size" | "font" | "text";

export const VAR_TYPES: VarType[] = ["color", "size", "font", "text"];

export interface CssVar {
  id: string;
  /** Name without the `--` prefix, already normalized (letters, digits, -, _). */
  name: string;
  type: VarType;
  value: string;
  /** Built-in variable: cannot be deleted/renamed; its value can be changed & reset. */
  builtin?: boolean;
}

/** Built-in variables (primary color, font, etc.). The default values are also used by the reset button. */
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

/** "  --Warna Utama " → "warna-utama". Lowercase, spaces become "-". */
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

/* ------------------------------ values ------------------------------ */

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

/** Default value when creating a new variable, per type. */
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

/** Merge variables: later ones win (e.g. [design defaults, global]). */
export function mergeVars(...lists: (readonly CssVar[] | undefined)[]): CssVar[] {
  const map = new Map<string, CssVar>();
  for (const l of lists) for (const v of l ?? []) if (v && NAME_RE.test(v.name) && isValidVarValue(v.type, v.value)) map.set(v.name, v);
  return [...map.values()];
}

/** A `:root { --x: value; }` block ("" when there are no variables). */
export function rootVarsCss(vars: readonly CssVar[], selector = ":root"): string {
  const ok = vars.filter((v) => NAME_RE.test(v.name) && isValidVarValue(v.type, v.value));
  if (!ok.length) return "";
  return `/* Variabel global */\n${selector} {\n${ok.map((v) => `  --${v.name}: ${v.value.trim()};`).join("\n")}\n}\n`;
}

/** Replaces every known var(--x) with its value (to detect fonts in use). */
export function expandVarRefs(css: string, vars: readonly CssVar[]): string {
  const map = new Map(vars.map((v) => [v.name, v.value]));
  return css.replace(VAR_REF_G, (m, n: string) => map.get(n) ?? m);
}

/** Variable names referenced in a text (CSS or JSON state). */
export function varNamesIn(text: string): string[] {
  return [...new Set([...text.matchAll(VAR_REF_G)].map((m) => m[1]))];
}

/** Approximate px value of a size (rem/em ×16). Used when the value must be a number. */
export function sizeToPx(value: string): number {
  const m = /^(-?\d+(?:\.\d+)?)(px|rem|em|%|vw|vh)?$/.exec(value.trim());
  if (!m) return 0;
  const n = Number(m[1]);
  return m[2] === "rem" || m[2] === "em" ? Math.round(n * 16 * 100) / 100 : n;
}

/** Variable value when its reference is detached: sizes → px number, others → value text. */
function detachedValue(v: CssVar): string | number {
  return v.type === "size" ? sizeToPx(v.value) : v.value;
}

/* ------------------------- usage in designs ------------------------- */

/** Number of var(--name) references in a value (state object, design tree). */
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

/** A copy of `obj` with every string transformed by `fn` (null = unchanged). */
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

/** Rename references var(--from) → var(--to). */
export function renameRefs<T>(obj: T, from: string, to: string): { value: T; changed: boolean } {
  const a = varRef(from);
  const b = varRef(to);
  const r = mapStrings(obj, (s) => (s.includes(a) ? s.split(a).join(b) : null));
  return { value: r.value as T, changed: r.changed };
}

/**
 * Detaches var(--name) references: fields whose content is exactly var(--name) are replaced
 * with the variable's last value (sizes → px number); references inside other text
 * (e.g. Custom CSS) are replaced with the value as is.
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
  /** Sentinel value (used by the CSS pass). */
  sentinel: string | number;
  /** The current concrete value (used by the comparison & markup passes). */
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

/** Concrete value for fields bound to a variable. */
function resolvedFor(kind: BindKind, v: CssVar | undefined, fallback: unknown): string | number {
  if (kind === "number") return v ? sizeToPx(v.value) : typeof fallback === "number" ? fallback : 0;
  if (kind === "color") {
    if (v && HEX.test(v.value.trim())) return v.value.trim();
    // The comparison needs hex; non-hex colors (rgb/transparent) are represented by a neutral hex.
    return v ? "#808080" : typeof fallback === "string" ? fallback : "#000000";
  }
  return v ? v.value : typeof fallback === "string" ? fallback : "";
}

/**
 * Prepares two copies of the state: `css` (var(--x) fields replaced with sentinels)
 * and `plain` (replaced with the variable's current value). No references →
 * `bindings` is empty and both = the original state.
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
 * Maps the sentinels in `cssSentinel` back to var(--x). `cssPlain` = CSS
 * from the state with concrete values: used to make sure the generator does not
 * transform the value. Returns null when the mapping is not safe.
 */
export function restoreVars(cssSentinel: string, cssPlain: string, bindings: readonly VarBinding[]): string | null {
  if (!bindings.length) return cssSentinel;
  let out = cssSentinel;
  let check = cssSentinel;
  for (const b of bindings) {
    const ref = varRef(b.name);
    if (b.kind === "number") {
      const s = String(b.sentinel);
      // Sentinels with units other than px (%, ms, …) or inside expressions → not safe.
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
      // Compare the same rgb() form in cssPlain.
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

/** Clean the variable list from storage (localStorage / design data). */
/** Built-in variables always exist (valid stored values win), followed by user-created variables. */
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
