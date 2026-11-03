/* ================================================================== */
/* Pengaturan "Lanjutan" tiap node: CSS ID, CSS Class, Custom CSS,       */
/* Custom JavaScript (gratis). Logika murni → bisa dites.               */
/*                                                                    */
/* Custom CSS                                                           */
/*   - Tanpa kurung kurawal = deklarasi untuk node itu sendiri:          */
/*       color: red; padding: 8px;                                      */
/*   - Dengan aturan: `&` = node itu; selector tanpa `&` otomatis        */
/*     menjadi turunan node (di-scope), jadi tidak bocor ke elemen lain: */
/*       &:hover { opacity: .8 }      p { margin: 0 }                    */
/*   - @media/@supports di-scope; @keyframes/@font-face dibiarkan;       */
/*     @import dibuang.                                                 */
/*                                                                    */
/* Custom JavaScript                                                    */
/*   Isi fungsi yang dijalankan SEKALI per mount dengan argumen:         */
/*     element, elements, on(target, type, handler), onCleanup(fn), root */
/*   `on()` otomatis dilepas saat dibersihkan → tidak ada listener ganda.*/
/*   Error per node ditangkap (console.error) dan tidak menghentikan     */
/*   node lain.                                                         */
/* ================================================================== */

export interface AdvancedProps {
  cssId?: string;
  /** Satu atau beberapa class, dipisah spasi. */
  cssClass?: string;
  customCss?: string;
  customJs?: string;
}

export const MAX_CUSTOM_CSS = 20000;
export const MAX_CUSTOM_JS = 20000;

export const isValidCssId = (id: string) => /^[A-Za-z][\w-]{0,63}$/.test(id);
const isValidClassName = (c: string) => /^-?[_A-Za-z][\w-]{0,63}$/.test(c);

/** Class valid saja, tanpa duplikat (urutan dipertahankan). */
export function parseClassList(v: string | undefined): string[] {
  const out: string[] = [];
  for (const c of (v ?? "").split(/\s+/)) if (c && isValidClassName(c) && !out.includes(c)) out.push(c);
  return out;
}

export function invalidClasses(v: string | undefined): string[] {
  return (v ?? "").split(/\s+/).filter((c) => c && !isValidClassName(c));
}

/** Bersihkan `advanced` dari data tersimpan. undefined = tidak ada isi. */
export function sanitizeAdvanced(v: unknown): AdvancedProps | undefined {
  if (!v || typeof v !== "object") return undefined;
  const o = v as Record<string, unknown>;
  const out: AdvancedProps = {};
  if (typeof o.cssId === "string" && o.cssId.trim()) out.cssId = o.cssId.trim().slice(0, 64);
  if (typeof o.cssClass === "string" && o.cssClass.trim()) out.cssClass = o.cssClass.trim().slice(0, 300);
  if (typeof o.customCss === "string" && o.customCss.trim()) out.customCss = o.customCss.slice(0, MAX_CUSTOM_CSS);
  if (typeof o.customJs === "string" && o.customJs.trim()) out.customJs = o.customJs.slice(0, MAX_CUSTOM_JS);
  return Object.keys(out).length ? out : undefined;
}

export const hasAdvanced = (a: AdvancedProps | undefined) =>
  !!a && !!(a.cssId || a.cssClass || a.customCss?.trim() || a.customJs?.trim());

/* ------------------------------ CSS -------------------------------- */

/** Hapus komentar & urutan yang bisa menutup tag <style>. */
function cleanCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/<\/?\s*style/gi, "")
    .replace(/<!--|-->/g, "")
    .replace(/@import[^;]*;?/gi, "");
}

function findClose(s: string, open: number): number {
  let depth = 1;
  for (let j = open + 1; j < s.length; j++) {
    if (s[j] === "{") depth++;
    else if (s[j] === "}" && --depth === 0) return j;
  }
  return -1;
}

export type CssFlavor = "plain" | "svelte";

function scopeSelector(sel: string, scope: string, flavor: CssFlavor): string {
  const s = sel.trim();
  const full = s.includes("&") ? s.replace(/&/g, scope) : /^(html|body|:root)\b/.test(s) ? scope : `${scope} ${s}`;
  return flavor === "svelte" ? `:global(${full})` : full;
}

/**
 * Scope Custom CSS ke `scope` (mis. `.custom-page__box-3`).
 * Hasil: aturan CSS siap pakai; kurung tak seimbang → null (tidak valid).
 */
export function scopeCustomCss(raw: string, scope: string, flavor: CssFlavor = "plain"): string | null {
  const css = cleanCss(raw).trim();
  if (!css) return "";
  if (!css.includes("{")) {
    if (css.includes("}")) return null;
    const decl = css
      .split(";")
      .map((d) => d.trim())
      .filter(Boolean)
      .map((d) => `  ${d};`)
      .join("\n");
    return `${flavor === "svelte" ? `:global(${scope})` : scope} {\n${decl}\n}\n`;
  }
  const self = flavor === "svelte" ? `:global(${scope})` : scope;
  // Deklarasi lepas di antara blok (gaya CSS nesting: `color: red; &:hover { … }`)
  // berlaku untuk node itu sendiri.
  const bare = (txt: string): string => {
    const decl = txt
      .split(";")
      .map((d) => d.trim())
      .filter((d) => /^-*[a-zA-Z][-a-zA-Z0-9]*\s*:/.test(d))
      .map((d) => `  ${d};`)
      .join("\n");
    return decl ? `${self} {\n${decl}\n}\n` : "";
  };
  const walk = (src: string): string | null => {
    let out = "";
    let i = 0;
    while (i < src.length) {
      const open = src.indexOf("{", i);
      if (open === -1) {
        const rest = src.slice(i).trim();
        if (rest && (rest.includes("}") || !rest.includes(":"))) return null; // sisa teks tanpa blok
        out += bare(rest);
        break;
      }
      const close = findClose(src, open);
      if (close === -1) return null;
      let prelude = src.slice(i, open).trim();
      const semi = prelude.lastIndexOf(";");
      if (semi !== -1) {
        out += bare(prelude.slice(0, semi + 1));
        prelude = prelude.slice(semi + 1).trim();
      }
      const body = src.slice(open + 1, close);
      if (!prelude) return null;
      if (prelude.startsWith("@")) {
        if (/^@(media|supports|container|layer)\b/i.test(prelude)) {
          const inner = walk(body);
          if (inner === null) return null;
          out += `${prelude} {\n${inner}}\n`;
        } else if (/^@(-webkit-)?keyframes\b|^@font-face\b/i.test(prelude)) {
          out += `${prelude} {${body}}\n`;
        }
        // at-rule lain dibuang
      } else {
        if (body.includes("{")) return null;
        const selectors = prelude
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => scopeSelector(x, scope, flavor))
          .join(", ");
        out += `${selectors} {\n  ${body.trim()}\n}\n`;
      }
      i = close + 1;
    }
    return out;
  };
  return walk(css);
}

/* --------------------------- atribut root -------------------------- */

/**
 * Tambahkan id & class pada TAG PERTAMA sebuah template string
 * (HTML / JSX / Vue / Svelte / Angular). Class digabung ke `class="…"` /
 * `className="…"` yang sudah ada.
 */
export function injectRootAttrs(tpl: string, id: string | undefined, classes: string[], jsx: boolean, extra: Record<string, string> = {}): string {
  if (!id && !classes.length && !Object.keys(extra).length) return tpl;
  const m = tpl.match(/<([A-Za-z][\w.-]*)([^>]*?)(\/?)>/);
  if (!m || m.index === undefined) return tpl;
  let attrs = m[2];
  const clsKey = jsx ? "className" : "class";
  if (classes.length) {
    const re = new RegExp(`(\\s${clsKey}=")([^"]*)(")`);
    if (re.test(attrs)) attrs = attrs.replace(re, (_a, p1, v, p3) => `${p1}${v} ${classes.join(" ")}${p3}`);
    else attrs += ` ${clsKey}="${classes.join(" ")}"`;
  }
  if (id && !/\sid=/.test(attrs)) attrs += ` id="${id}"`;
  for (const [k, v] of Object.entries(extra)) if (!attrs.includes(` ${k}=`)) attrs += ` ${k}="${v.replace(/"/g, "&quot;")}"`;
  for (const [k, v] of Object.entries(extra)) if (!new RegExp(`\\s${k}=`).test(attrs)) attrs += ` ${k}="${v.replace(/"/g, "&quot;")}"`;
  const tag = `<${m[1]}${attrs}${m[3]}>`;
  return tpl.slice(0, m.index) + tag + tpl.slice(m.index + m[0].length);
}

/* --------------------------- runtime JS ---------------------------- */

export interface CustomScript {
  /** Nama untuk pesan error (mis. "Section Hero"). */
  label: string;
  selector: string;
  code: string;
}

const indent = (code: string, pad: string) =>
  code
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((l) => (l.trim() ? pad + l : ""))
    .join("\n");

/** Cek sintaks (dikompilasi saja, tidak dijalankan). null = valid / tidak bisa dicek. */
export function jsSyntaxError(code: string, params = "element, elements, on, onCleanup, root"): string | null {
  try {
    new Function(...params.split(",").map((p) => p.trim()), code);
    return null;
  } catch (err) {
    return err instanceof SyntaxError ? err.message : null;
  }
}

/**
 * Isi modul runtime: fungsi `initCustomCode(root)` → fungsi pembersih.
 * Memanggil ulang pada root yang sama membersihkan inisialisasi sebelumnya
 * lebih dulu (aman untuk React StrictMode / render ulang pratinjau).
 */
export function customRuntime(scripts: CustomScript[]): string {
  const blocks = scripts
    .map(
      (s) =>
        `  run(${JSON.stringify(s.label)}, ${JSON.stringify(s.selector)}, function (element, elements, on, onCleanup, root) {\n${indent(s.code.trim(), "    ")}\n  });`,
    )
    .join("\n\n");
  return `function initCustomCode(root) {
  root = root || document;
  if (root.__pmCustomDestroy) root.__pmCustomDestroy();
  var cleanups = [];
  function on(target, type, handler, options) {
    if (!target || !target.addEventListener) return;
    target.addEventListener(type, handler, options);
    cleanups.push(function () { target.removeEventListener(type, handler, options); });
  }
  function onCleanup(fn) {
    if (typeof fn === "function") cleanups.push(fn);
  }
  function run(label, selector, fn) {
    var list = Array.prototype.slice.call(root.querySelectorAll(selector));
    if (root.matches && root.matches(selector)) list.unshift(root);
    if (!list.length) return;
    try {
      fn.call(list[0], list[0], list, on, onCleanup, root);
    } catch (err) {
      console.error("[Custom JS] " + label + ":", err);
    }
  }

${blocks}

  function destroy() {
    while (cleanups.length) {
      try { cleanups.pop()(); } catch (err) { console.error("[Custom JS] cleanup:", err); }
    }
    if (root.__pmCustomDestroy === destroy) root.__pmCustomDestroy = null;
  }
  root.__pmCustomDestroy = destroy;
  return destroy;
}`;
}
