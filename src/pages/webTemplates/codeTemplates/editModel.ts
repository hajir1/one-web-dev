/* ================================================================== */
/* Model edit TEMPLATE KODE tanpa ngoding (v17).                         */
/*                                                                    */
/* Template kode menandai bagian yang boleh diubah lewat form:           */
/*   1. Teks      : elemen ber-atribut data-owd-text="kunci"             */
/*                  (label: data-owd-label, banyak baris: data-owd-multi).*/
/*                  Kunci yang sama di beberapa elemen = satu field.      */
/*   2. Tautan    : data-owd-href="kunci" (label: data-owd-href-label).   */
/*   3. Warna/gaya: <style id="owd-theme"> berisi :root { --nama: nilai; */
/*                  /* Label [min,maks,langkah] *\/ }                     */
/*   4. Data      : JSON di antara penanda di skrip:                     */
/*                  /*owd:data name="CONFIG" label="..." hide="a,b.c"*\/ */
/*                  { ... } /*owd:end*\/                                  */
/*   5. Wilayah   : HTML statis yang dibangun ulang dari data (untuk      */
/*                  pembaca tanpa JS): <!--owd:render name="x"-->…        */
/*                  <!--owd:end-->                                       */
/*                                                                    */
/* Semua fungsi di sini berupa operasi string murni (jalan di browser    */
/* dan di Node untuk pengujian). Teks pengguna selalu di-escape.         */
/* ================================================================== */

export interface CodeEdits {
  texts?: Record<string, string>;
  links?: Record<string, string>;
  vars?: Record<string, string>;
  data?: Record<string, unknown>;
}

export interface TextField {
  key: string;
  label: string;
  value: string;
  multiline: boolean;
  /** Jumlah elemen yang memakai kunci ini. */
  uses: number;
}
export interface LinkField {
  key: string;
  label: string;
  value: string;
}
export interface VarField {
  name: string;
  label: string;
  value: string;
  kind: "color" | "range" | "text";
  min?: number;
  max?: number;
  step?: number;
}
export interface DataBlock {
  name: string;
  label: string;
  value: unknown;
  /** Jalur kunci yang disembunyikan dari form (mis. "id", "musik.nada", "adegan"). */
  hidden: string[];
}
export interface CodeModel {
  texts: TextField[];
  links: LinkField[];
  vars: VarField[];
  data: DataBlock[];
}

/** Pembangun ulang wilayah statis: (data semua blok, nilai variabel tema) → HTML. */
export type RegionRenderer = (data: Record<string, unknown>, vars: Record<string, string>) => string;

/* ------------------------------ util ------------------------------ */

const escText = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const escAttr = (s: string) => escText(s).replace(/"/g, "&quot;");
export function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}
const attrOf = (tag: string, name: string): string | null => {
  const m = new RegExp(`\\s${name}="([^"]*)"`).exec(tag);
  return m ? decodeEntities(m[1]) : null;
};

/** Elemen teks: <tag ... data-owd-text="k" ...>isi</tag> (isi = teks polos, tanpa tag bersarang). */
const TEXT_RE = /<([a-z][a-z0-9]*)\b([^>]*\sdata-owd-text="([\w.-]+)"[^>]*)>([^<]*)<\/\1>/gi;
/** Tag pembuka yang punya data-owd-href. */
const HREF_RE = /<a\b[^>]*\sdata-owd-href="([\w.-]+)"[^>]*>/gi;
const THEME_RE = /<style id="owd-theme">([\s\S]*?)<\/style>/;
const VAR_RE = /(--[\w-]+)\s*:\s*([^;]+);[ \t]*(?:\/\*\s*([^*[]*?)\s*(?:\[([^\]]*)\])?\s*\*\/)?/g;
const DATA_RE = /\/\*owd:data name="(\w+)" label="([^"]*)"(?: hide="([^"]*)")?\*\/([\s\S]*?)\/\*owd:end\*\//g;
const REGION_RE = /<!--owd:render name="([\w-]+)"-->([\s\S]*?)<!--owd:end-->/g;

const isHex = (v: string) => /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v.trim());

/** JSON aman di dalam <script> dan di antara penanda komentar. */
export function jsonForScript(value: unknown): string {
  return JSON.stringify(value, null, 2)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029")
    .replace(/\/\*/g, "\\/*")
    .replace(/\*\//g, "*\\/");
}

/* ------------------------------ baca ------------------------------ */

export function readModel(html: string): CodeModel {
  const texts = new Map<string, TextField>();
  for (const m of html.matchAll(TEXT_RE)) {
    const [, , attrs, key, inner] = m;
    const prev = texts.get(key);
    if (prev) {
      prev.uses++;
      continue;
    }
    texts.set(key, {
      key,
      label: attrOf(attrs, "data-owd-label") ?? key,
      value: decodeEntities(inner),
      multiline: /\sdata-owd-multi(\s|=|$)/.test(attrs),
      uses: 1,
    });
  }
  const links = new Map<string, LinkField>();
  for (const m of html.matchAll(HREF_RE)) {
    const key = m[1];
    if (links.has(key)) continue;
    links.set(key, { key, label: attrOf(m[0], "data-owd-href-label") ?? key, value: attrOf(m[0], "href") ?? "" });
  }
  const vars: VarField[] = [];
  const theme = THEME_RE.exec(html)?.[1] ?? "";
  for (const m of theme.matchAll(VAR_RE)) {
    const [, name, raw, label, range] = m;
    const value = raw.trim();
    const f: VarField = { name, label: label?.trim() || name.replace(/^--/, ""), value, kind: isHex(value) ? "color" : "text" };
    if (range) {
      const [min, max, step] = range.split(",").map((x) => Number(x.trim()));
      if (Number.isFinite(min) && Number.isFinite(max)) Object.assign(f, { kind: "range", min, max, step: Number.isFinite(step) ? step : (max - min) / 100 });
    }
    vars.push(f);
  }
  const data: DataBlock[] = [];
  for (const m of html.matchAll(DATA_RE)) {
    const [, name, label, hide, json] = m;
    try {
      data.push({ name, label: decodeEntities(label), value: JSON.parse(json), hidden: hide ? hide.split(",").map((s) => s.trim()).filter(Boolean) : [] });
    } catch {
      /* blok rusak: lewati (tidak bisa diedit lewat form) */
    }
  }
  return { texts: [...texts.values()], links: [...links.values()], vars, data };
}

/* ------------------------------ tulis ----------------------------- */

/** Terapkan perubahan ke HTML template dasar. Kunci yang tidak dikenal diabaikan. */
export function applyEdits(html: string, edits: CodeEdits, renderers: Record<string, RegionRenderer> = {}): string {
  let out = html;
  const texts = edits.texts ?? {};
  if (Object.keys(texts).length)
    out = out.replace(TEXT_RE, (all, tag: string, attrs: string, key: string) => (key in texts ? `<${tag}${attrs}>${escText(String(texts[key]))}</${tag}>` : all));

  const links = edits.links ?? {};
  if (Object.keys(links).length)
    out = out.replace(HREF_RE, (tag: string, key: string) => {
      if (!(key in links)) return tag;
      const href = safeHref(String(links[key]));
      return / href="[^"]*"/.test(tag) ? tag.replace(/ href="[^"]*"/, ` href="${escAttr(href)}"`) : tag.replace(/>$/, ` href="${escAttr(href)}">`);
    });

  const vars = edits.vars ?? {};
  if (Object.keys(vars).length)
    out = out.replace(THEME_RE, (_all, body: string) => {
      const next = body.replace(VAR_RE, (decl: string, name: string) => {
        if (!(name in vars)) return decl;
        const v = cleanCssValue(String(vars[name]));
        return v ? decl.replace(/:\s*[^;]+;/, `: ${v};`) : decl;
      });
      return `<style id="owd-theme">${next}</style>`;
    });

  const data = edits.data ?? {};
  if (Object.keys(data).length)
    out = out.replace(DATA_RE, (all, name: string, label: string, hide: string | undefined) =>
      name in data ? `/*owd:data name="${name}" label="${label}"${hide ? ` hide="${hide}"` : ""}*/${jsonForScript(data[name])}/*owd:end*/` : all,
    );

  if (Object.keys(renderers).length) {
    const model = readModel(out);
    const allData = Object.fromEntries(model.data.map((d) => [d.name, d.value]));
    const allVars = Object.fromEntries(model.vars.map((v) => [v.name, v.value]));
    out = out.replace(REGION_RE, (all, name: string) => {
      const r = renderers[name];
      return r ? `<!--owd:render name="${name}"-->${r(allData, allVars)}<!--owd:end-->` : all;
    });
  }
  return out;
}

/** Nilai CSS dari form: tanpa karakter yang bisa keluar dari deklarasi/blok style. */
export function cleanCssValue(v: string): string {
  return v.replace(/[;{}<>\\]/g, "").replace(/\/\*|\*\//g, "").trim().slice(0, 200);
}

/** Tautan dari form: hanya http(s), mailto, tel, wa.me, atau jangkar (#…). */
export function safeHref(v: string): string {
  const s = v.trim();
  if (/^(https?:|mailto:|tel:)/i.test(s) || s.startsWith("#")) return s;
  if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(s)) return `https://${s}`;
  return "#";
}

/* ------------------------- data bersarang ------------------------- */

export type Path = (string | number)[];

export function getAt(obj: unknown, path: Path): unknown {
  let cur = obj;
  for (const p of path) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string | number, unknown>)[p];
  }
  return cur;
}

/** Salinan baru dengan nilai di `path` diganti (struktur lain tetap dibagi). */
export function setAt<T>(obj: T, path: Path, value: unknown): T {
  if (!path.length) return value as T;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = obj.slice();
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy as T;
  }
  const base = (obj && typeof obj === "object" ? obj : {}) as Record<string, unknown>;
  return { ...base, [head]: setAt(base[head as string], rest, value) } as T;
}

/** Jalur tanpa indeks array, untuk dicocokkan dengan daftar `hide` ("acara.mulai"). */
export const pathKey = (path: Path) => path.filter((p) => typeof p === "string").join(".");

/** Item baru untuk daftar: salin item terakhir, kosongkan teks dan gambar. */
export function blankLike(sample: unknown): unknown {
  if (typeof sample === "string") return "";
  if (typeof sample === "number") return sample;
  if (typeof sample === "boolean") return sample;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") return Object.fromEntries(Object.entries(sample).map(([k, v]) => [k, typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v) ? v : blankLike(v)]));
  return null;
}

/** Ringkasan perubahan (untuk label "n perubahan"). */
export function countEdits(e: CodeEdits): number {
  return Object.keys(e.texts ?? {}).length + Object.keys(e.links ?? {}).length + Object.keys(e.vars ?? {}).length + Object.keys(e.data ?? {}).length;
}
