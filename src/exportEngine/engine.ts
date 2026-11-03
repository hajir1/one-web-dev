/* ================================================================== */
/* Mesin ekspor kode untuk SERVER (dibundel ke backend).                 */
/*                                                                    */
/* Fungsi murni tanpa React/DOM/penyimpanan: dokumen desain + ikon/font  */
/* + aturan akses Premium → daftar berkas. Backend menjalankannya agar   */
/* kode lengkap hanya dibuat setelah server memeriksa kepemilikan item   */
/* Premium dan memotong kuota ekspor.                                   */
/*                                                                    */
/* Bundel ulang setelah elemen/compose berubah:                         */
/*   npm run build:export-engine   (lihat tools/buildExportEngine.mjs)   */
/* ================================================================== */
import "../i18n";
import i18n from "../i18n";
import { compose, type PremiumAllow } from "../pages/pageMaker/engine/helpers/compose";
import { collectElements, walk } from "../pages/pageMaker/engine/helpers/tree";
import type { BoxNode, ComponentNode } from "../pages/pageMaker/engine/helpers/componentTypes";
import { makeIconLookup } from "../pages/pageMaker/core/helpers/elementDefinition";
import { baseFontStack, libraryFontVars, type GlobalFont } from "../pages/pageMaker/core/helpers/fontCss";
import type { GlobalIcon } from "../pages/pageMaker/core/store/iconStore";
import { normalizePageDoc, type PageDoc } from "../pages/pageMaker/helpers/pageDoc";
import { buildSite, projectFiles, singlePage } from "../pages/pageMaker/helpers/siteExport";
import { mergeVars, sanitizeVars, withBuiltinVars } from "../pages/pageMaker/core/helpers/cssVars";
import type { SavedDesign } from "../pages/pageMaker/core/store/designStore";
import type { Framework } from "../pages/pageMaker/core/helpers/generatorCss";
import { FRAMEWORK_LABELS } from "../pages/pageMaker/core/helpers/generatorCss";

export const ENGINE_VERSION = 2;
export const FRAMEWORKS = Object.keys(FRAMEWORK_LABELS) as Framework[];

export interface EngineFile {
  name: string;
  content: string;
  lang: string;
}

/** Hak akses Premium pemanggil (dihitung server dari user_items + template_grants). */
export interface Access {
  /** Kunci item yang dimiliki, mis. "element:slider", "event:onChange", "preset:pro-faq". */
  owned: string[];
  /** Item bawaan per template yang dimiliki: templateId → kunci item. */
  templateGrants: Record<string, string[]>;
  /** true = semua item Premium boleh (admin). */
  all?: boolean;
}

export interface EngineInput {
  framework: string;
  lang?: "id" | "en";
  icons?: GlobalIcon[];
  fonts?: GlobalFont[];
  baseFontId?: string | null;
  /** v7: variabel global pengguna (warna/ukuran/font) → :root di setiap format. */
  vars?: unknown;
  /** v7: judul proyek ekspor satu halaman (nama desain). */
  title?: string;
  access: Access;
}

/** Variabel global dari klien: dibersihkan, lalu digabung dengan variabel bawaan + font pustaka. */
function varsOf(input: EngineInput) {
  return mergeVars(libraryFontVars(input.fonts ?? []), withBuiltinVars(sanitizeVars(input.vars)));
}

/** Item yang dipakai satu dokumen halaman: section preset, elemen, event. */
export function itemsUsed(doc: PageDoc): { sections: string[]; elements: string[]; events: string[] } {
  const sections = new Set<string>();
  const events = new Set<string>();
  walk(doc.root, (n: ComponentNode) => {
    const id = n.kind === "box" ? (n as BoxNode).section?.presetId : undefined;
    if (id) sections.add(`preset:${id}`);
    for (const ev of (n as { events?: { name?: string }[] }).events ?? []) if (ev?.name) events.add(`event:${ev.name}`);
  });
  const elements = new Set(collectElements(doc.root).map((e) => `element:${e.elementType}`));
  return { sections: [...sections], elements: [...elements], events: [...events] };
}

/** Predikat akses item untuk satu dokumen (item bawaan template hanya di desain dari template itu). */
function allowFor(doc: PageDoc, access: Access): (key: string) => boolean {
  if (access.all) return () => true;
  const owned = new Set(access.owned);
  const tpl = doc.source?.templateId;
  const granted = new Set(tpl && owned.has(`template:${tpl}`) ? (access.templateGrants[tpl] ?? []) : []);
  return (key: string) => owned.has(key) || granted.has(key);
}

const allowPrefix = (allow: (k: string) => boolean, prefix: string): PremiumAllow => (k: string) => allow(`${prefix}:${k}`);

function setLang(lang: string | undefined) {
  const l = lang === "en" ? "en" : "id";
  if (!i18n.language?.startsWith(l)) void i18n.changeLanguage(l);
}

function check(framework: string): Framework {
  if (!FRAMEWORKS.includes(framework as Framework)) throw new Error(`framework tidak dikenal: ${framework}`);
  return framework as Framework;
}

/** Ekspor satu desain halaman (Page Maker) sebagai proyek satu halaman siap jalan. */
export function exportPage(state: unknown, rootClass: string, input: EngineInput): EngineFile[] {
  setLang(input.lang);
  const fw = check(input.framework);
  const doc = normalizePageDoc(state);
  const allow = allowFor(doc, input.access);
  const fonts = input.fonts ?? [];
  const composed = compose(doc.root, {
    rootClass,
    icons: makeIconLookup(input.icons ?? []),
    fonts,
    baseFont: baseFontStack(fonts, input.baseFontId ?? null),
    allowPremiumElements: allowPrefix(allow, "element"),
    allowPremiumEvents: allowPrefix(allow, "event"),
    vars: varsOf(input),
  });
  const title = (input.title ?? "").trim().slice(0, 120) || "Desain";
  return projectFiles(fw, title, [singlePage(composed, title)]).map((f) => ({ name: f.name, content: f.content, lang: f.lang }));
}

/** Ekspor satu folder website beserta halaman-halamannya. */
export function exportSite(site: SavedDesign, pages: SavedDesign[], input: EngineInput): EngineFile[] {
  setLang(input.lang);
  const fw = check(input.framework);
  const fonts = input.fonts ?? [];
  const built = buildSite(site, pages, {
    icons: makeIconLookup(input.icons ?? []),
    fonts,
    baseFont: baseFontStack(fonts, input.baseFontId ?? null),
    allowPremiumElementsFor: (doc) => allowPrefix(allowFor(doc, input.access), "element"),
    allowPremiumEventsFor: (doc) => allowPrefix(allowFor(doc, input.access), "event"),
    vars: varsOf(input),
  });
  return built.files(fw).map((f) => ({ name: f.name, content: f.content, lang: f.lang }));
}

/** Item Premium yang dipakai dokumen tetapi tidak boleh dipakai pemanggil. */
export function lockedItems(state: unknown, access: Access, premium: Set<string>): string[] {
  const doc = normalizePageDoc(state);
  const allow = allowFor(doc, access);
  const used = itemsUsed(doc);
  return [...used.sections, ...used.elements, ...used.events].filter((k) => premium.has(k) && !allow(k));
}
