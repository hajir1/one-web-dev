/* ================================================================== */
/* Code export engine for the SERVER (bundled into the backend).        */
/*                                                                    */
/* Pure functions without React/DOM/storage: design document + icons/fonts */
/* + Premium access rules → file list. The backend runs it so that      */
/* full code is only built after the server checks item ownership       */
/* Premium and deducts the export quota.                                */
/*                                                                    */
/* Rebundle after elements/compose change:                              */
/*   npm run build:export-engine   (see tools/buildExportEngine.mjs)     */
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

/** The caller's Premium access (computed by the server from user_items + template_grants). */
export interface Access {
  /** Owned item keys, e.g. "element:slider", "event:onChange", "preset:pro-faq". */
  owned: string[];
  /** Built-in items per owned template: templateId → item keys. */
  templateGrants: Record<string, string[]>;
  /** true = all Premium items allowed (admin). */
  all?: boolean;
}

export interface EngineInput {
  framework: string;
  lang?: "id" | "en";
  icons?: GlobalIcon[];
  fonts?: GlobalFont[];
  baseFontId?: string | null;
  /** v7: the user's global variables (colors/sizes/fonts) → :root in every format. */
  vars?: unknown;
  /** v7: project title for a single-page export (design name). */
  title?: string;
  access: Access;
}

/** Global variables from the client: sanitized, then merged with the default variables + library fonts. */
function varsOf(input: EngineInput) {
  return mergeVars(libraryFontVars(input.fonts ?? []), withBuiltinVars(sanitizeVars(input.vars)));
}

/** Items used by one page document: section presets, elements, events. */
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

/** Item access predicate for one document (built-in template items only in designs from that template). */
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

/** Exports one page design (Page Maker) as a ready-to-run single-page project. */
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

/** Export one website folder with its pages. */
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

/** Premium items the document uses but the caller may not use. */
export function lockedItems(state: unknown, access: Access, premium: Set<string>): string[] {
  const doc = normalizePageDoc(state);
  const allow = allowFor(doc, access);
  const used = itemsUsed(doc);
  return [...used.sections, ...used.elements, ...used.events].filter((k) => premium.has(k) && !allow(k));
}
