import { sanitizeCategory, sanitizeChip, sanitizeFilterOf } from "../../helpers/categoryFilter";
import { mergeWithDefault } from "../../core/hooks/useDesignSaver";
import { ELEMENT_DEFINITION_BY_TYPE } from "../../core/elementDefinitions";
import {
  ROOT_ID,
  type Align,
  BOX_TAGS,
  type BoxLayout,
  type BoxNode,
  type BoxTag,
  type SectionProps,
  type ComponentDoc,
  type ComponentNode,
  type ElementNode,
  type Place,
  type ShadowPreset,
  type WidthMode,
} from "./componentTypes";
import { createBox, createRoot, dedupeIds, newNodeId } from "./tree";
import { sanitizeBg } from "../../core/helpers/background";
import { eventsToCustomJs, sanitizeEvents } from "./events";
import { sanitizeLibraryList, sanitizeLibs } from "./libraries";
import { sanitizeVars } from "../../core/helpers/cssVars";
import { sanitizeAdvanced } from "./advanced";
import { sanitizeAnim } from "./motion";
import { sanitizeCollection } from "../../helpers/collections";
import { sanitizeBind, sanitizeItemOf, sanitizeRelated } from "../../helpers/itemPage";

/* ================================================================== */
/* Normalisasi state tersimpan                                          */
/*                                                                    */
/* Dipakai saat memuat "Desain Saya": menerima                          */
/*   - format baru (version 2: pohon node)                              */
/*   - format lama (templateId + slots) → dimigrasi ke pohon            */
/*   - data korup / tak lengkap → dibersihkan, bukan membuat crash      */
/* ================================================================== */

export function createDefaultDoc(): ComponentDoc {
  return { version: 2, root: createRoot("stack") };
}

const MAX_DEPTH = 24;
const MAX_NODES = 1500;

const LAYOUTS: BoxLayout[] = ["stack", "row", "grid", "block"];
const ALIGNS: Align[] = ["start", "center", "end", "stretch"];
const JUSTIFIES = ["start", "center", "end", "between", "stretch"];
const SHADOWS: ShadowPreset[] = ["none", "sm", "md", "lg"];
const WIDTHS: WidthMode[] = ["full", "auto", "fit", "fixed"];

const isObj = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object" && !Array.isArray(v);
const num = (v: unknown, d: number, min = 0, max = 100000) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d;
const str = (v: unknown, d: string) => (typeof v === "string" ? v : d);
const bool = (v: unknown, d: boolean) => (typeof v === "boolean" ? v : d);
const oneOf = <T extends string>(v: unknown, list: readonly T[], d: T): T =>
  list.includes(v as T) ? (v as T) : d;

function sanitizePlace(v: unknown): Place {
  if (!isObj(v)) return {};
  const out: Place = {};
  if (typeof v.grow === "boolean" && v.grow) out.grow = true;
  for (const k of ["basis", "colStart", "colSpan", "rowStart", "rowSpan"] as const) {
    if (typeof v[k] === "number" && Number.isFinite(v[k]) && (v[k] as number) > 0) {
      out[k] = Math.round(v[k] as number);
    }
  }
  if (typeof v.area === "string" && /^[A-Za-z_][\w-]*$/.test(v.area)) out.area = v.area;
  if (ALIGNS.includes(v.selfH as Align)) out.selfH = v.selfH as Align;
  if (ALIGNS.includes(v.selfV as Align)) out.selfV = v.selfV as Align;
  return out;
}

interface Budget {
  nodes: number;
}

function sanitizeNode(v: unknown, depth: number, budget: Budget): ComponentNode | null {
  if (!isObj(v) || depth > MAX_DEPTH || budget.nodes >= MAX_NODES) return null;
  budget.nodes++;
  if (v.kind === "box") return sanitizeBox(v, depth, budget);
  if (v.kind === "element" && typeof v.elementType === "string") {
    const def = ELEMENT_DEFINITION_BY_TYPE[v.elementType];
    const el: ElementNode = {
      id: str(v.id, "") || newNodeId(),
      kind: "element",
      elementType: v.elementType,
      name: str(v.name, def?.label ?? v.elementType),
      place: sanitizePlace(v.place),
      // State dilengkapi default supaya field baru tidak jadi `undefined`.
      state: def ? mergeWithDefault(def.defaults, v.state) : (isObj(v.state) ? v.state : {}),
    };
    // Event lama → Custom JavaScript (fitur event per elemen sudah dihapus).
    const events = sanitizeEvents(v.events);
    const fromEvents = events ? eventsToCustomJs(events, v.elementType) : "";
    const advRaw = isObj(v.advanced) ? v.advanced : {};
    const prevJs = typeof advRaw.customJs === "string" ? advRaw.customJs.trim() : "";
    const adv = sanitizeAdvanced(fromEvents ? { ...advRaw, customJs: [prevJs, fromEvents].filter(Boolean).join("\n\n") } : v.advanced);
    if (adv) el.advanced = adv;
    const libs = sanitizeLibs(v.libs);
    if (libs) el.libs = libs;
    const anim = sanitizeAnim(v.anim);
    if (anim) el.anim = anim;
    const bind = sanitizeBind(v.bind);
    if (bind) {
      el.bind = bind;
      if (v.bindEmpty === true) el.bindEmpty = true;
    }
    const chip = sanitizeChip(v.chip);
    if (chip !== undefined) el.chip = chip;
    const cat = sanitizeCategory(v.itemCategory);
    if (cat) el.itemCategory = cat;
    return el;
  }
  return null;
}

/** URL gambar latar: hanya http(s), data:image, atau path relatif. */
const isSafeImageUrl = (u: string) =>
  /^(https?:\/\/|data:image\/(png|jpe?g|gif|webp|avif);|\/|\.\/)/i.test(u) && !/["'()\\\s<>]/.test(u) && u.length <= 4000;

function sanitizeSection(v: unknown): SectionProps | undefined {
  if (!isObj(v)) return undefined;
  const img = str(v.bgImage, "");
  return {
    contentWidth: num(v.contentWidth, 1120, 0, 4000),
    padY: num(v.padY, 48, 0, 600),
    padX: num(v.padX, 24, 0, 600),
    minHeight: num(v.minHeight, 0, 0, 4000),
    bgImage: isSafeImageUrl(img) ? img : "",
    ...(typeof v.presetId === "string" && /^[a-z0-9-]{1,64}$/.test(v.presetId) ? { presetId: v.presetId } : {}),
    ...(v.sectionType === "regular" || v.sectionType === "specialty" || v.sectionType === "fullwidth" ? { sectionType: v.sectionType } : {}),
  };
}

function sanitizeBox(v: Record<string, unknown>, depth: number, budget: Budget): BoxNode {
  const layout = oneOf(v.layout, LAYOUTS, "stack");
  const d = createBox(layout);
  const children: ComponentNode[] = [];
  if (Array.isArray(v.children)) {
    for (const c of v.children) {
      const n = sanitizeNode(c, depth + 1, budget);
      if (n) children.push(n);
    }
  }
  return {
    ...d,
    id: str(v.id, "") || newNodeId(),
    name: str(v.name, d.name),
    place: sanitizePlace(v.place),
    layout,
    gap: num(v.gap, d.gap, 0, 400),
    padding: num(v.padding, d.padding, 0, 400),
    wrap: bool(v.wrap, d.wrap),
    columns: str(v.columns, d.columns).slice(0, 200),
    areas: str(v.areas, d.areas).slice(0, 400),
    align: oneOf(v.align, ALIGNS, d.align),
    justify: oneOf(v.justify, JUSTIFIES, d.justify) as BoxNode["justify"],
    stackOnMobile: bool(v.stackOnMobile, d.stackOnMobile),
    ...(v.mobileGrid === "two" || v.mobileGrid === "scroll" ? { mobileGrid: v.mobileGrid } : {}),
    ...(v.stagger === true ? { stagger: true } : {}),
    ...(v.hoverLift === true ? { hoverLift: true } : {}),
    bgEnabled: bool(v.bgEnabled, d.bgEnabled),
    bgColor: str(v.bgColor, d.bgColor),
    borderWidth: num(v.borderWidth, d.borderWidth, 0, 40),
    borderColor: str(v.borderColor, d.borderColor),
    borderRadius: num(v.borderRadius, d.borderRadius, 0, 999),
    shadow: oneOf(v.shadow, SHADOWS, d.shadow),
    widthMode: oneOf(v.widthMode, WIDTHS, d.widthMode),
    width: num(v.width, d.width, 40, 4000),
    ...(BOX_TAGS.includes(v.tag as BoxTag) && v.tag !== "div" ? { tag: v.tag as BoxTag } : {}),
    ...(isObj(v.section) ? { section: sanitizeSection(v.section) } : {}),
    ...(v.row === true ? { row: true } : {}),
    ...(v.innerRow === true && v.row !== true ? { innerRow: true } : {}),
    ...(v.row === true && ["content", "80", "full", "custom"].includes(v.rowWidth as string)
      ? {
          rowWidth: v.rowWidth as BoxNode["rowWidth"],
          rowCustomWidth: num(v.rowCustomWidth, 960, 1, 4000),
          rowCustomUnit: v.rowCustomUnit === "%" ? ("%" as const) : ("px" as const),
        }
      : {}),
    ...(sanitizeAdvanced(v.advanced) ? { advanced: sanitizeAdvanced(v.advanced) } : {}),
    ...(sanitizeLibs(v.libs) ? { libs: sanitizeLibs(v.libs) } : {}),
    ...(sanitizeAnim(v.anim) ? { anim: sanitizeAnim(v.anim) } : {}),
    ...(() => {
      const col = depth > 0 && v.section === undefined ? sanitizeCollection(v.collection, (n) => sanitizeNode(n, depth + 1, budget)) : undefined;
      return col ? { collection: col } : {};
    })(),
    ...(() => {
      if (depth === 0) return {};
      const itemOf = sanitizeItemOf(v.itemOf);
      const related = v.collection ? undefined : sanitizeRelated(v.related, (n) => sanitizeNode(n, depth + 1, budget));
      const filterOf = v.collection || v.section !== undefined ? undefined : sanitizeFilterOf(v.filterOf);
      const cat = sanitizeCategory(v.itemCategory);
      return { ...(itemOf ? { itemOf } : {}), ...(related ? { related } : {}), ...(filterOf ? { filterOf } : {}), ...(cat ? { itemCategory: cat } : {}) };
    })(),
    ...(depth === 0 && sanitizeLibraryList(v.libraries) ? { libraries: sanitizeLibraryList(v.libraries) } : {}),
    // v7: salinan variabel global yang dipakai desain (cadangan nilai bila variabel tidak ada di perangkat lain).
    ...(depth === 0 && sanitizeVars(v.vars).length ? { vars: sanitizeVars(v.vars) } : {}),
    // Background lengkap hanya ditulis bila data sudah memakainya (data lama tetap lewat bgEnabled).
    ...(typeof v.bgType === "string" ? sanitizeBg(v, "none") : {}),
    children,
  };
}

/* ------------------------------ publik ----------------------------- */

/** State tersimpan apa pun → ComponentDoc valid. Tidak pernah melempar. */
export function normalizeDoc(saved: unknown): ComponentDoc {
  try {
    if (!isObj(saved)) return createDefaultDoc();
    if (saved.version === 2 && isObj(saved.root)) {
      const root = sanitizeBox({ ...saved.root, kind: "box" }, 0, { nodes: 1 });
      return { version: 2, root: dedupeIds({ ...root, id: ROOT_ID }) };
    }
  } catch (err) {
    console.error("[ComponentMaker] gagal memuat desain", err);
  }
  return createDefaultDoc();
}

