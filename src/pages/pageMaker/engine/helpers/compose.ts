import { FILTER_JS } from "../../helpers/categoryFilter";
import type { Framework } from "../../core/helpers/generatorCss";
import { libraryAttrs, libraryHead, libraryReadme, libraryScripts, sanitizeLibraryList, usesMotion, usesScroll, SCROLL_CSS, SCROLL_JS, type LibraryId } from "./libraries";
import { MOTION_CSS, MOTION_JS } from "./motionRuntime";
import i18n from "../../../../i18n";
import type { GeneratedFile } from "../../core/ui/CodeExportPanel";
import type {
  AnyElementDefinition,
  ElementSpec,
  IconLookup,
} from "../../core/helpers/elementDefinition";
import {
  generateFrameworkFiles,
  h,
  raw,
  renderFor,
  toKebab,
  type MNode,
  type RenderTarget,
} from "../../core/helpers/markup";
import { backgroundCss } from "../../core/helpers/background";
import {
  boxBackground,
  isBox,
  SHADOW_CSS,
  type Align,
  type BoxNode,
  type ElementNode,
  type NodeId,
  type Place,
} from "./componentTypes";
import { resolveElement } from "./resolve";
import type { SiteContext } from "../../core/helpers/siteTypes";
import {
  customRuntime,
  injectRootAttrs,
  invalidClasses,
  isValidCssId,
  jsSyntaxError,
  parseClassList,
  scopeCustomCss,
  type CssFlavor,
  type CustomScript,
} from "./advanced";
import {
  addAttrsTo,
  EVENT_BY_NAME,
  eventCodeError,
  eventTarget,
  handlerName,
  indentCode,
  supportsEvents,
  targetSelector,
  type EventInfo,
} from "./events";
import { fontLoadCss, withFontCss, type GlobalFont } from "../../core/helpers/fontCss";
import { withTemplateFonts } from "../../core/helpers/templateFonts";
import { bindVars, builtinDefault, mergeVars, restoreVars, rootVarsCss, type CssVar } from "../../core/helpers/cssVars";
import { GENERIC_FONT_TYPES } from "../../core/elementDefinitions";
import { animAttrs, animNodeCss, MOTION_OBSERVER_JS, motionCss, type AnimPreset } from "./motion";
import { collectionDisplayCss, displayOf } from "../../helpers/collections";

/* ================================================================== */
/* Komposisi: pohon node → CSS + markup + file per framework            */
/*                                                                    */
/* SATU alur untuk pratinjau dan kode export: pratinjau = target HTML   */
/* dari hasil yang sama (ditambah penanda `data-cm-*` khusus preview),  */
/* jadi apa yang terlihat di Live Preview sama dengan kode yang diunduh.*/
/* ================================================================== */

const MOBILE_BREAKPOINT = 640;
/** Batas atas tablet: grid 3+ kolom menjadi 2 kolom di 641–1024px. */
const TABLET_BREAKPOINT = 1024;

/**
 * Ukuran cair (clamp) antara layar 360px dan 1280px: `max` di desktop,
 * `min` di HP, linear di antaranya. Satuan px; untuk teks pakai `fluidRem`.
 */
export function fluidPx(max: number, min: number): string {
  if (max <= min) return `${max}px`;
  const slope = (max - min) / 920;
  const base = Math.round((min - slope * 360) * 100) / 100;
  return `clamp(${min}px, ${base}px + ${Math.round(slope * 10000) / 100}vw, ${max}px)`;
}

/** Jumlah kolom grid dari `grid-template-columns` (repeat(N, …) atau daftar track). */
export function gridTrackCount(columns: string): number {
  const c = columns.trim();
  const rep = /^repeat\(\s*(\d+)\s*,/.exec(c);
  if (rep) return Number(rep[1]);
  let depth = 0;
  let n = 0;
  let inTrack = false;
  for (const ch of c) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (/\s/.test(ch) && depth === 0) inTrack = false;
    else if (!inTrack) {
      inTrack = true;
      n++;
    }
  }
  return n;
}

/**
 * Izin fitur premium: boolean untuk semua, atau fungsi per kunci (nama event /
 * tipe elemen) — mis. hanya item yang sudah dibuka server untuk akun ini.
 */
export type PremiumAllow = boolean | ((key: string) => boolean);
const allows = (a: PremiumAllow | undefined, key: string) => (typeof a === "function" ? a(key) : !!a);

export interface ComposeOptions {
  /** Class root komponen (sudah valid). */
  rootClass: string;
  icons: IconLookup;
  /** Tambahkan penanda `data-cm-*` agar pratinjau bisa memilih node. Jangan untuk export. */
  preview?: boolean;
  /** Pustaka font global: font yang dipakai CSS otomatis dimuat (@import / @font-face). */
  fonts?: GlobalFont[];
  /** `font-family` untuk root (font dasar halaman). Kosong = tidak ditulis. */
  baseFont?: string | null;
  /** Event selain onClick ikut di-generate (fitur kredit). Default false. */
  allowPremiumEvents?: PremiumAllow;
  /** Elemen premium (Slider, Countdown, …) ikut di hasil (fitur kredit). Default false. */
  allowPremiumElements?: PremiumAllow;
  /** Konteks website (Menu Element): folder, halaman, mode routing. */
  site?: SiteContext;
  /**
   * v7: variabel global (bawaan + buatan pengguna + font pustaka). Ditulis
   * di `:root` dan dipakai untuk memetakan field `var(--x)` elemen.
   */
  vars?: CssVar[];
}

/** v9: variabel Animasi & 3D hanya ditulis di :root bila desain memakainya. */
const isMotionVar = (name: string) => name.startsWith("owd-anim-");
const is3dVar = (name: string) => name.startsWith("owd-3d-");

interface ComposeWarning {
  nodeId: NodeId;
  message: string;
}

type Decls = Record<string, string>;

/* ------------------------------ CSS util --------------------------- */

const kebab = (prop: string) => prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);

function decls(d: Decls, pad = "  "): string {
  return Object.entries(d)
    .map(([k, v]) => `${pad}${kebab(k)}: ${v};\n`)
    .join("");
}

function rule(selector: string, d: Decls): string {
  return Object.keys(d).length ? `${selector} {\n${decls(d)}}\n` : "";
}

const FLEX_ALIGN: Record<Align, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};
const GRID_ALIGN: Record<Align, string> = {
  start: "start",
  center: "center",
  end: "end",
  stretch: "stretch",
};
const JUSTIFY_FLEX: Record<string, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  between: "space-between",
  stretch: "flex-start",
};
const JUSTIFY_GRID: Record<string, string> = {
  start: "start",
  center: "center",
  end: "end",
  between: "stretch",
  stretch: "stretch",
};

/** `"a a" "b c"` → `"a" "b" "c"` (satu baris per area, urutan kemunculan). */
export function stackedAreas(areas: string): string {
  const names: string[] = [];
  for (const m of areas.matchAll(/[A-Za-z_][\w-]*|\./g)) {
    if (m[0] !== "." && !names.includes(m[0])) names.push(m[0]);
  }
  return names.map((n) => `"${n}"`).join(" ");
}

interface Rules {
  base: Decls;
  mobile: Decls;
}

/** URL gambar latar yang aman dimasukkan ke `url("…")`. */
export function safeCssUrl(u: string): boolean {
  return /^(https?:\/\/|data:image\/(png|jpe?g|gif|webp|avif);|\/|\.\/)/i.test(u) && !/["'()\\\s<>]/.test(u);
}

/** Aturan CSS sebuah box (gaya sendiri + susunan anak-anaknya). */
export function boxRules(b: BoxNode): Rules {
  const base: Decls = { boxSizing: "border-box" };
  const mobile: Decls = {};

  if (b.layout === "block") {
    // Tata letak normal: anak-anak mengalir ke bawah seperti elemen biasa.
    base.display = "block";
  } else if (b.layout === "grid") {
    base.display = "grid";
    base.gridTemplateColumns = b.columns.trim() || "minmax(0, 1fr)";
    if (b.areas.trim()) base.gridTemplateAreas = b.areas.trim();
    base.gap = `${b.gap}px`;
    base.alignItems = GRID_ALIGN[b.align];
    base.justifyItems = JUSTIFY_GRID[b.justify] ?? "stretch";
    if (b.stackOnMobile) {
      if (b.mobileGrid === "scroll") {
        // Baris geser: kartu berikutnya terlihat sebagian sebagai petunjuk.
        mobile.gridTemplateColumns = "none";
        mobile.gridAutoFlow = "column";
        mobile.gridAutoColumns = "minmax(78%, 1fr)";
        mobile.overflowX = "auto";
        mobile.scrollSnapType = "x mandatory";
        mobile.overscrollBehaviorX = "contain";
        mobile.paddingBottom = "12px";
        mobile.scrollbarWidth = "thin";
      } else mobile.gridTemplateColumns = b.mobileGrid === "two" ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)";
      if (b.areas.trim()) mobile.gridTemplateAreas = stackedAreas(b.areas);
    }
  } else {
    base.display = "flex";
    base.flexDirection = b.layout === "row" ? "row" : "column";
    if (b.layout === "row" && b.wrap) base.flexWrap = "wrap";
    base.gap = `${b.gap}px`;
    base.alignItems = FLEX_ALIGN[b.align];
    if (b.layout === "row") base.justifyContent = JUSTIFY_FLEX[b.justify] ?? "flex-start";
    if (b.layout === "row" && b.stackOnMobile) {
      mobile.flexDirection = "column";
      mobile.alignItems = "stretch";
    }
  }

  if (b.section) {
    const sec = b.section;
    // Lebar isi (contentWidth) kini diterapkan pada Row (lihat rowWidthRules),
    // supaya Row bisa memilih ikut lebar isi, 80%, 100%, atau kustom.
    // Jarak cair: lega di desktop, lebih rapat di HP (tanpa breakpoint kaku).
    const py = sec.padY > 40 ? fluidPx(sec.padY, Math.max(32, Math.round(sec.padY * 0.55))) : `${sec.padY}px`;
    const px = sec.padX > 24 ? fluidPx(sec.padX, 20) : `${sec.padX}px`;
    base.padding = `${py} ${px}`;
    if (sec.minHeight > 0) base.minHeight = `${sec.minHeight}px`;
  } else if (b.padding > 0) base.padding = `${b.padding}px`;
  const bg = boxBackground(b);
  if (bg.bgType !== "none") base.background = backgroundCss(bg);
  if (b.borderWidth > 0) base.border = `${b.borderWidth}px solid ${b.borderColor}`;
  if (b.borderRadius > 0) base.borderRadius = `${b.borderRadius}px`;
  if (b.shadow !== "none") base.boxShadow = SHADOW_CSS[b.shadow];
  if (b.hoverLift) base.transition = "translate 0.25s ease, box-shadow 0.25s ease";

  if (b.widthMode === "full") base.width = "100%";
  else if (b.widthMode === "fixed") base.width = `${b.width}px`;
  else if (b.widthMode === "fit") base.width = "fit-content";
  base.maxWidth = "100%";
  base.minWidth = "0";

  return { base, mobile };
}

/** Lebar Row di dalam section (lihat BoxNode.rowWidth). */
export function rowWidthRules(row: BoxNode, sec: { contentWidth: number }): Decls {
  const mode = row.rowWidth ?? "content";
  const center = { marginLeft: "auto", marginRight: "auto" };
  if (mode === "full") return { width: "100%", maxWidth: "none" };
  if (mode === "80") return { width: "80%", maxWidth: "100%", ...center };
  if (mode === "custom") {
    const unit = row.rowCustomUnit === "%" ? "%" : "px";
    const n = Math.max(1, Math.min(unit === "%" ? 100 : 4000, Math.round(row.rowCustomWidth ?? (unit === "%" ? 80 : 960))));
    return { width: `${n}${unit}`, maxWidth: "100%", ...center };
  }
  // "content": lebar tetap mengikuti pengaturan Row, dibatasi lebar isi section.
  return sec.contentWidth > 0 ? { maxWidth: `${sec.contentWidth}px`, ...center } : {};
}

/** Aturan penempatan sebuah node di dalam induknya. */
export function placeRules(place: Place, parent: BoxNode | null): Rules {
  const base: Decls = {};
  const mobile: Decls = {};
  if (!parent) return { base, mobile };

  if (parent.layout === "block") {
    return { base, mobile };
  }
  if (parent.layout === "row") {
    if (place.grow || place.basis) {
      base.flex = `${place.grow ? 1 : 0} 1 ${place.basis ? `${place.basis}px` : place.grow ? "0%" : "auto"}`;
      if (parent.stackOnMobile) mobile.flex = "none";
    }
    if (place.selfV) base.alignSelf = FLEX_ALIGN[place.selfV];
  } else if (parent.layout === "stack") {
    if (place.selfH) base.alignSelf = FLEX_ALIGN[place.selfH];
  } else {
    if (place.area) base.gridArea = place.area;
    const col = span(place.colStart, place.colSpan);
    const row = span(place.rowStart, place.rowSpan);
    if (col) base.gridColumn = col;
    if (row) base.gridRow = row;
    if ((col || row) && parent.stackOnMobile) {
      if (col) mobile.gridColumn = "auto";
      if (row) mobile.gridRow = "auto";
    }
    if (place.selfH) base.justifySelf = GRID_ALIGN[place.selfH];
    if (place.selfV) base.alignSelf = GRID_ALIGN[place.selfV];
  }
  return { base, mobile };
}

function span(start?: number, size?: number): string | null {
  if (start && size && size > 1) return `${start} / span ${size}`;
  if (start) return `${start}`;
  if (size && size > 1) return `span ${size}`;
  return null;
}

/* ------------------------------- plan ------------------------------ */

interface PBox {
  kind: "box";
  node: BoxNode;
  cls: string;
  children: PNode[];
  /** CSS ID final (sudah unik) & class tambahan dari pengaturan Lanjutan. */
  cssId?: string;
  classes?: string[];
  /** Atribut library (data-aos, data-tilt, …). */
  attrs?: Record<string, string>;
}

interface PElement {
  kind: "element";
  node: ElementNode;
  cls: string;
  def?: AnyElementDefinition;
  spec?: ElementSpec;
  /** Class paling luar di markup elemen (tempat aturan penempatan ditaruh). */
  rootCls: string;
  place: Rules;
  /** Punya logika per framework (state/event) → jadi komponen anak di non-HTML. */
  stateful: boolean;
  compName?: string;
  error?: string;
  cssId?: string;
  classes?: string[];
  /** State efektif elemen (sudah di-merge default). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state?: any;
  /** Event yang di-generate untuk elemen ini. */
  events: PlannedEvent[];
  /** Markup dengan atribut event per target framework. */
  eventMarkup?: (target: RenderTarget) => MNode | MNode[] | undefined;
}

interface PlannedEvent {
  info: EventInfo;
  code: string;
  handler: string;
  /** Selector untuk export HTML (addEventListener). */
  selector: string;
}

type PNode = PBox | PElement;

const isStateful = (spec: ElementSpec) =>
  !!(spec.react || spec.vue || spec.svelte || spec.angular || spec.wrap);

export function toPascal(cls: string): string {
  const p = cls
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return /^[A-Za-z]/.test(p) ? p : `C${p}`;
}

interface ChildComponent {
  name: string;
  nodeId: NodeId;
  /** Spec elemen + CSS penempatan (sudah digabung). */
  spec: ElementSpec;
}

export interface Composed {
  rootClass: string;
  rootName: string;
  warnings: ComposeWarning[];
  /** Jumlah elemen yang berhasil dirender. */
  elementCount: number;
  /** Hasil target HTML (juga dipakai pratinjau). */
  html: { css: string; body: string; script: string };
  /** Library CDN yang dipasang di desain (dimuat di <head>/akhir <body> hasil ekspor). */
  libraries: LibraryId[];
  /** File per framework. */
  files: (framework: Framework) => GeneratedFile[];
  /** v7: blok `:root { --x: … }` (juga sudah termasuk di `html.css`). */
  varsCss: string;
  /** v7: pemuat font (@import/@font-face) untuk seluruh halaman, termasuk font variabel. */
  fontLoaders: string;
}

export function compose(root: BoxNode, opts: ComposeOptions): Composed {
  const {
    rootClass,
    icons,
    preview = false,
    fonts = [],
    baseFont = null,
    allowPremiumEvents = false,
    allowPremiumElements = false,
    site,
  } = opts;
  const allFonts = withTemplateFonts(fonts);
  // Variabel: salinan di desain (cadangan) ditimpa variabel global terkini.
  const vars = mergeVars(root.vars, opts.vars);
  const withFonts = (css: string) => withFontCss(css, allFonts, vars);
  const customized = (name: string) => {
    const v = vars.find((x) => x.name === name);
    const d = builtinDefault(name);
    return !!v && !!d && v.value.trim() !== d.value;
  };
  const installedLibs: LibraryId[] = sanitizeLibraryList(root.libraries) ?? [];
  /* v9: animasi CSS per node (tidak dirender di canvas desain agar overlay tetap stabil). */
  const animPresets = new Set<AnimPreset>();
  const animNodeRules: string[] = [];
  let animScroll = false;
  let hasFilter = false;
  const planAnim = (n: BoxNode | ElementNode, selector: string) => {
    if (preview || !n.anim) return { classes: [] as string[], attrs: {} as Record<string, string> };
    // Pemicu disimpan di node saat animasi dipilih (bawaan global saat itu); data tanpa pemicu = scroll.
    const a = animAttrs(n.anim);
    animPresets.add(n.anim.preset);
    if (a.attrs["data-owd-trigger"] === "scroll") animScroll = true;
    const own = animNodeCss(n.anim, selector);
    if (own) animNodeRules.push(own);
    return a;
  };
  const warnings: ComposeWarning[] = [];
  const counters: Record<string, number> = {};
  const count = (k: string) => (counters[k] = (counters[k] ?? 0) + 1);
  const rootName = toPascal(rootClass);
  const usedNames = new Set<string>([rootName]);

  /* ---- event JavaScript ---- */
  const planEvents = (el: PElement) => {
    const list = el.node.events ?? [];
    if (!list.length || !el.spec) return;
    if (!supportsEvents(el.node.elementType) || el.stateful || !el.spec.markup) {
      warnings.push({ nodeId: el.node.id, message: i18n.t("el.compose.eventUnsupported", { label: el.def?.label ?? i18n.t("el.compose.thisElement") }) });
      return;
    }
    const target = eventTarget(el.spec.markup, el.node.elementType);
    if (!target) return;
    const firstRoot = (Array.isArray(el.spec.markup) ? el.spec.markup : [el.spec.markup]).find(
      (n) => !!n && typeof n === "object" && n.kind === "el",
    );
    for (const ev of list) {
      const info = EVENT_BY_NAME[ev.name];
      if (!info || !ev.code.trim()) continue;
      if (!info.free && !allows(allowPremiumEvents, ev.name)) {
        warnings.push({ nodeId: el.node.id, message: i18n.t("el.compose.eventPremium", { event: ev.name, name: el.node.name }) });
        continue;
      }
      const err = eventCodeError(ev.code);
      if (err) {
        warnings.push({ nodeId: el.node.id, message: i18n.t("el.compose.eventInvalid", { event: ev.name, name: el.node.name, err }) });
        continue;
      }
      el.events.push({
        info,
        code: ev.code,
        handler: handlerName(el.cls, rootClass, ev.name),
        selector: targetSelector(el.rootCls, target, target === firstRoot),
      });
    }
    if (!el.events.length) return;
    const evs = el.events;
    const markup = el.spec.markup;
    el.eventMarkup = (t) => {
      const attrs: Record<string, { expr: string }> = {};
      for (const e of evs) {
        if (t === "react") attrs[`jsx:${e.info.name}`] = { expr: e.handler };
        else if (t === "vue") attrs[`vue:@${e.info.dom}`] = { expr: e.handler };
        else if (t === "svelte") attrs[`svelte:on:${e.info.dom}`] = { expr: e.handler };
        else if (t === "angular") attrs[`angular:(${e.info.dom})`] = { expr: `${e.handler}($event)` };
      }
      return addAttrsTo(markup, target, attrs);
    };
  };

  /* ---- Lanjutan: CSS ID (unik), class, Custom CSS & JS ---- */
  const usedIds = new Set<string>();
  const customBlocks: { nodeId: NodeId; label: string; scope: string; css: string }[] = [];
  const customScripts: (CustomScript & { nodeId: NodeId })[] = [];
  const labelOf = (n: BoxNode | ElementNode, def?: AnyElementDefinition) =>
    isBox(n)
      ? `${n.section ? "Section" : n.row ? "Row" : "Grup"} “${n.name}”`
      : `${def?.label ?? "Elemen"} “${n.name}”`;
  /** Versi `labelOf` untuk pesan peringatan (mengikuti bahasa aktif). */
  const warnLabelOf = (n: BoxNode | ElementNode, def?: AnyElementDefinition) =>
    isBox(n)
      ? `${n.section ? "Section" : n.row ? "Row" : i18n.t("el.compose.group")} “${n.name}”`
      : `${def?.label ?? i18n.t("el.compose.element")} “${n.name}”`;

  const planAdvanced = (p: PBox | PElement, scope: string, extra?: { css?: string; js?: string }) => {
    const n = p.node;
    const a = n.advanced;
    const label = labelOf(n, p.kind === "element" ? p.def : undefined);
    const wl = warnLabelOf(n, p.kind === "element" ? p.def : undefined);
    if (a?.cssId) {
      if (!isValidCssId(a.cssId)) {
        warnings.push({ nodeId: n.id, message: i18n.t("el.compose.cssIdInvalid", { id: a.cssId, label: wl }) });
      } else {
        let id = a.cssId;
        for (let i = 2; usedIds.has(id); i++) id = `${a.cssId}-${i}`;
        if (id !== a.cssId) warnings.push({ nodeId: n.id, message: i18n.t("el.compose.cssIdDuplicate", { id: a.cssId, label: wl, used: id }) });
        usedIds.add(id);
        p.cssId = id;
      }
    }
    const bad = invalidClasses(a?.cssClass);
    if (bad.length) warnings.push({ nodeId: n.id, message: i18n.t("el.compose.classInvalid", { label: wl, list: bad.join(", ") }) });
    p.classes = parseClassList(a?.cssClass);
    for (const [css, what] of [
      [a?.customCss, "Custom CSS"],
      [extra?.css, "CSS"],
    ] as const) {
      if (!css?.trim()) continue;
      if (scopeCustomCss(css, scope) === null) {
        warnings.push({ nodeId: n.id, message: i18n.t("el.compose.cssUnbalanced", { what, label: wl }) });
      } else customBlocks.push({ nodeId: n.id, label, scope, css });
    }
    for (const [js, what] of [
      [extra?.js, "JavaScript"],
      [a?.customJs, "Custom JS"],
    ] as const) {
      if (!js?.trim()) continue;
      const err = jsSyntaxError(js);
      if (err) warnings.push({ nodeId: n.id, message: i18n.t("el.compose.codeInvalid", { what, label: wl, err }) });
      else customScripts.push({ nodeId: n.id, label, selector: scope, code: js });
    }
  };

  /** Tempel id & class Lanjutan ke elemen paling luar spec (markup + semua template override). */
  const withRootAttrs = (spec: ElementSpec, id: string | undefined, classes: string[], extra: Record<string, string> = {}): ElementSpec => {
    if (!id && !classes.length && !Object.keys(extra).length) return spec;
    const next: ElementSpec = { ...spec };
    if (spec.markup) {
      let done = false;
      const add = (m: MNode): MNode => {
        if (done || !m || typeof m !== "object" || m.kind !== "el") return m;
        done = true;
        const cls = typeof m.attrs.class === "string" ? m.attrs.class : "";
        return {
          ...m,
          attrs: {
            ...m.attrs,
            ...(classes.length ? { class: [cls, ...classes].filter(Boolean).join(" ") } : {}),
            ...(id && !m.attrs.id ? { id } : {}),
            ...extra,
          },
        };
      };
      next.markup = Array.isArray(spec.markup) ? spec.markup.map(add) : add(spec.markup);
    }
    if (spec.html?.body) next.html = { ...spec.html, body: injectRootAttrs(spec.html.body, id, classes, false, extra) };
    if (spec.react?.jsx) next.react = { ...spec.react, jsx: injectRootAttrs(spec.react.jsx, id, classes, true, extra) };
    if (spec.vue?.template) next.vue = { ...spec.vue, template: injectRootAttrs(spec.vue.template, id, classes, false, extra) };
    if (spec.svelte?.markup) next.svelte = { ...spec.svelte, markup: injectRootAttrs(spec.svelte.markup, id, classes, false, extra) };
    if (spec.angular?.template)
      next.angular = { ...spec.angular, template: injectRootAttrs(spec.angular.template, id, classes, false, extra) };
    return next;
  };

  /* ---- 1. plan: class, spec, penempatan ---- */
  const plan = (node: BoxNode | ElementNode, parent: BoxNode | null, isRoot = false): PNode => {
    if (isBox(node)) {
      const cls = isRoot ? rootClass : `${rootClass}__box-${count("box")}`;
      const box: PBox = { kind: "box", node, cls, children: [] };
      // Uji coba CRUD: tampilan koleksi "geser horizontal" = CSS tambahan box.
      const colCss = node.collection ? collectionDisplayCss(node.collection) : "";
      planAdvanced(box, `.${cls}`, colCss ? { css: colCss } : undefined);
      const lib = libraryAttrs(node.libs, installedLibs);
      const an = planAnim(node, `.${cls}`);
      if (lib.classes.length || an.classes.length) box.classes = [...(box.classes ?? []), ...lib.classes, ...an.classes];
      if (Object.keys(lib.attrs).length || Object.keys(an.attrs).length) box.attrs = { ...lib.attrs, ...an.attrs };
      // Uji coba CRUD: penanda koleksi untuk skrip pemuat data di kode backend.
      if (node.collection) {
        const d = displayOf(node.collection);
        box.attrs = {
          ...(box.attrs ?? {}),
          "data-collection": node.collection.slug,
          ...(d.mode !== "all" ? { "data-collection-mode": d.mode, "data-per-page": String(d.perPage) } : {}),
          ...(node.collection.view?.category ? { "data-view-category": node.collection.view.category } : {}),
          ...(node.collection.view?.sort ? { "data-sort": node.collection.view.sort } : {}),
        };
      }
      if (node.filterOf) {
        box.attrs = { ...(box.attrs ?? {}), "data-filter": node.filterOf };
        hasFilter = true;
      }
      if (node.itemCategory) box.attrs = { ...(box.attrs ?? {}), "data-category": node.itemCategory };
      if (node.itemOf) box.attrs = { ...(box.attrs ?? {}), "data-item": node.itemOf.collection };
      if (node.related) box.attrs = { ...(box.attrs ?? {}), "data-related": node.related.collection, "data-limit": String(node.related.limit) };
      box.children = node.children.map((c) => plan(c, node));
      return box;
    }
    const r = resolveElement(node);
    const type = node.elementType.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const cls = `${rootClass}__${type}-${count(type)}`;
    const el: PElement = {
      kind: "element",
      node,
      cls,
      def: r.def,
      rootCls: cls,
      place: placeRules(node.place, parent),
      stateful: false,
      events: [],
    };
    if (!r.def) {
      el.error = i18n.t("el.compose.unknownType", { type: node.elementType });
      warnings.push({ nodeId: node.id, message: el.error });
      return el;
    }
    if (r.def.premium && !allows(allowPremiumElements, node.elementType)) {
      el.error = i18n.t("el.compose.premiumElement", { label: r.def.label });
      warnings.push({ nodeId: node.id, message: el.error });
      return el;
    }
    try {
      // v7: field berisi var(--x) → CSS memakai referensi variabel (lihat cssVars.ts).
      const b = bindVars(r.def.defaults as Record<string, unknown>, r.state, vars);
      const state = b.plain;
      el.spec = r.def.spec(state, cls, icons, { site });
      if (b.bindings.length) {
        const css = restoreVars(r.def.spec(b.css, cls, icons, { site }).css, el.spec.css, b.bindings);
        if (css !== null) el.spec = { ...el.spec, css };
        else warnings.push({ nodeId: node.id, message: i18n.t("el.compose.varFixed", { name: node.name, vars: b.bindings.map((x) => `--${x.name}`).join(", ") }) });
      }
      for (const m of b.missing) warnings.push({ nodeId: node.id, message: i18n.t("el.compose.varMissing", { name: node.name, v: `--${m}` }) });
      el.rootCls = r.def.rootClass ? r.def.rootClass(cls) : cls;
      // v7: font umum untuk elemen yang generator-nya tidak menulis font-family.
      const ff = typeof r.state.fontFamily === "string" ? r.state.fontFamily.trim() : "";
      if (ff && GENERIC_FONT_TYPES.has(node.elementType) && /^[A-Za-z0-9 ,"'_()-]{1,200}$/.test(ff))
        el.spec = { ...el.spec, css: `${el.spec.css.trimEnd()}\n.${el.rootCls} {\n  font-family: ${ff};\n}\n.${el.rootCls} :where(input, select, textarea, button) {\n  font-family: inherit;\n}\n` };
      el.stateful = isStateful(el.spec);
      el.state = state;
      const code = r.def.customCode?.(state);
      // Uji coba halaman item: elemen terikat kolom kosong → disembunyikan (skrip publik membuka lagi bila terisi).
      const bindCss = node.bind
        ? "&[data-empty] {\n  display: none !important;\n}"
        : node.chip !== undefined && parent?.filterOf
          ? "& {\n  cursor: pointer;\n  user-select: none;\n}"
          : "";
      planAdvanced(el, `.${el.rootCls}`, bindCss ? { ...code, css: [code?.css, bindCss].filter(Boolean).join("\n") } : code);
      const lib = libraryAttrs(node.libs, installedLibs);
      const an = planAnim(node, `.${el.rootCls}`);
      const bindAttrs: Record<string, string> = node.bind ? { "data-field": node.bind, ...(node.bindEmpty ? { "data-empty": "" } : {}) } : {};
      if (node.itemCategory) bindAttrs["data-category"] = node.itemCategory;
      // Chip filter kategori (di dalam grup `filterOf`).
      if (node.chip !== undefined && parent?.filterOf) {
        bindAttrs["data-chip"] = node.chip;
        bindAttrs["aria-pressed"] = node.chip === "" ? "true" : "false";
        if (node.elementType !== "button") Object.assign(bindAttrs, { role: "button", tabindex: "0" });
      }
      el.spec = withRootAttrs(el.spec, el.cssId, [...(el.classes ?? []), ...lib.classes, ...an.classes], { ...lib.attrs, ...an.attrs, ...bindAttrs });
      if (el.stateful) {
        let name = `${r.def.componentName}${count(`comp-${r.def.componentName}`)}`;
        while (usedNames.has(name)) name += "Part";
        usedNames.add(name);
        el.compName = name;
      }
      planEvents(el);
    } catch (err) {
      el.error = i18n.t("el.compose.renderFailed", { label: r.def.label });
      warnings.push({ nodeId: node.id, message: `${el.error}: ${(err as Error).message}` });
      console.error("[ComponentMaker] gagal render elemen", node.elementType, err);
    }
    return el;
  };
  const tree = plan(root, null, true) as PBox;
  // v9: pemicu "saat terlihat" memakai runtime Custom JS (ikut dibersihkan saat komponen dilepas).
  if (animScroll) customScripts.push({ nodeId: root.id, label: "Animasi CSS", selector: `.${rootClass}`, code: MOTION_OBSERVER_JS });
  const hasCustomJs = customScripts.length > 0;
  const animCss = (flavor: CssFlavor) => {
    const base = motionCss(animPresets, flavor);
    if (!base) return "";
    const own = animNodeRules.join("");
    if (!own) return base;
    return `${base}${flavor === "svelte" ? own.replace(/^([^\n{]+) \{$/gm, (_m, sel: string) => `:global(${sel}) {`) : own}`;
  };
  const customCss = (flavor: CssFlavor) =>
    [
      animCss(flavor),
      customBlocks.length
        ? `/* Custom CSS */\n${customBlocks
            .map((b) => `/* ${b.label.replace(/\*\//g, "")} */\n${scopeCustomCss(b.css, b.scope, flavor)}`)
            .join("\n")}`
        : "",
    ]
      .filter(Boolean)
      .join("\n");
  const runtime = hasCustomJs ? customRuntime(customScripts) : "";

  /* ---- 2. CSS ---- */
  const walkPlan = (p: PNode, fn: (p: PNode, parent: PBox | null) => void, parent: PBox | null = null) => {
    fn(p, parent);
    if (p.kind === "box") p.children.forEach((c) => walkPlan(c, fn, p));
  };

  const layoutRules: string[] = [];
  const mobileRules: string[] = [];
  const tabletRules: string[] = [];
  const desktopRules: string[] = [];
  const hoverRules: string[] = [];
  walkPlan(tree, (p, parent) => {
    if (p.kind !== "box") return;
    const own = boxRules(p.node);
    // Font dasar hanya di root; elemen lain mewarisinya.
    if (!parent && baseFont) own.base = { fontFamily: baseFont, ...own.base };
    // v7: font body global diubah pengguna → root mengikuti var(--font-body).
    else if (!parent && customized("font-body")) own.base = { fontFamily: "var(--font-body)", ...own.base };
    const place = parent ? placeRules(p.node.place, parent.node) : { base: {}, mobile: {} };
    const rowW = p.node.row && parent?.node.section ? rowWidthRules(p.node, parent.node.section) : {};
    layoutRules.push(rule(`.${p.cls}`, { ...own.base, ...place.base, ...rowW }));
    const m = { ...own.mobile, ...place.mobile };
    if (Object.keys(m).length) mobileRules.push(rule(`.${p.cls}`, m));
    const b = p.node;
    const n = p.children.length;
    if (b.layout === "grid") {
      const cols = gridTrackCount(b.columns || "minmax(0, 1fr)");
      const spans = p.children.some((c) => c.node.place.colSpan || c.node.place.colStart);
      // Tablet: 4+ kolom terlalu sempit → 2 kolom. Tiga kolom tetap tiga, kecuali
      // jumlah kartunya genap dan tidak habis dibagi tiga (agar tidak ada kartu yatim).
      const tablet2 = cols >= 4 || (cols === 3 && n % 2 === 0 && n % 3 !== 0);
      if (b.stackOnMobile && tablet2 && !b.areas.trim() && !spans) tabletRules.push(rule(`.${p.cls}`, { gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }));
      if (b.stackOnMobile && b.mobileGrid === "scroll") mobileRules.push(rule(`.${p.cls} > *`, { scrollSnapAlign: "start" }));
      if (b.stagger && n >= 2 && cols >= 2 && !spans) {
        const off = 40;
        desktopRules.push(rule(`.${p.cls}`, { paddingBottom: `${(b.section ? 0 : b.padding) + off}px` }));
        desktopRules.push(rule(`.${p.cls} > :nth-child(${cols === 3 ? "3n+2" : "2n"})`, { position: "relative", top: `${off}px` }));
      }
    }
    if (b.hoverLift)
      hoverRules.push(rule(`.${p.cls}:hover`, { translate: "0 -6px", boxShadow: "0 22px 44px -20px rgba(15, 23, 42, 0.35)" }));
  });
  const media = (q: string, rules: string[]) =>
    rules.length
      ? `\n@media ${q} {\n${rules
          .join("\n")
          .split("\n")
          .map((l) => (l ? `  ${l}` : l))
          .join("\n")
          .trimEnd()}\n}\n`
      : "";
  // v7: judul (h1–h6) tanpa font sendiri mengikuti var(--font-heading) bila diubah pengguna.
  // :where() = spesifisitas 0, jadi font yang dipilih per elemen tetap menang.
  const headingRule = customized("font-heading") ? `\n:where(.${rootClass}) :where(h1, h2, h3, h4, h5, h6) {\n  font-family: var(--font-heading);\n}\n` : "";
  const layoutCss =
    `/* Layout */\n${layoutRules.join("\n")}${headingRule}` +
    media(`(hover: hover) and (prefers-reduced-motion: no-preference)`, hoverRules) +
    media(`(min-width: ${TABLET_BREAKPOINT + 1}px)`, desktopRules) +
    media(`(min-width: ${MOBILE_BREAKPOINT + 1}px) and (max-width: ${TABLET_BREAKPOINT}px)`, tabletRules) +
    media(`(max-width: ${MOBILE_BREAKPOINT}px)`, mobileRules);

  // Aturan di dalam @media diberi indentasi dua spasi.
  const placeBlock = (p: PElement): string => {
    let css = rule(`.${p.rootCls}`, p.place.base);
    if (Object.keys(p.place.mobile).length) {
      const inner = rule(`.${p.rootCls}`, p.place.mobile)
        .trimEnd()
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n");
      css += `\n@media (max-width: ${MOBILE_BREAKPOINT}px) {\n${inner}\n}\n`;
    }
    return css;
  };

  const elements: PElement[] = [];
  walkPlan(tree, (p) => {
    if (p.kind === "element") elements.push(p);
  });
  const okElements = elements.filter((e) => e.spec && !e.error);
  // Library terpasang + library yang dibutuhkan elemen (otomatis, mis. Chart.js).
  const neededLibs = new Set<LibraryId>(okElements.flatMap((e) => e.def?.libraries ?? []));
  // v9: variabel :root — Animasi & 3D hanya bila dipakai desain ini.
  const uses3d = okElements.some((e) => e.def?.uses3dSettings);
  const varsCss = rootVarsCss(vars.filter((v) => (isMotionVar(v.name) ? animPresets.size > 0 : is3dVar(v.name) ? uses3d : true)));
  const exportLibs: LibraryId[] = sanitizeLibraryList([...installedLibs, ...neededLibs]) ?? [];

  const elementCss = (p: PElement) => {
    const label = p.node.name ? ` — ${p.node.name.replace(/\*\//g, "")}` : "";
    return `/* ${p.def!.label}${label} */\n${p.spec!.css.trim()}\n${placeBlock(p) ? "\n" + placeBlock(p) : ""}`;
  };

  /* ---- 3. markup per target ---- */
  const mark = (id: string): Record<string, string | boolean> =>
    preview ? { "static:data-cm-id": id } : {};

  const staticElement = (p: PElement): MNode | MNode[] => {
    if (p.error || !p.spec) {
      return h(
        "div",
        { ...mark(p.node.id), "static:data-cm-failed": true, style: "padding:8px 12px;border:1px dashed #dc2626;border-radius:6px;color:#dc2626;font:12px sans-serif" },
        p.error ?? i18n.t("el.compose.cannotRender"),
      );
    }
    const spec = p.spec;
    let body = spec.html?.body;
    const wrap = spec.wrap?.static;
    if (body === undefined) {
      if (!spec.markup) return null;
      const nodes = (Array.isArray(spec.markup) ? spec.markup : [spec.markup]).filter(Boolean) as MNode[];
      if (!preview) return wrap ? raw(wrap(renderFor("static", nodes))) : nodes;
      // Preview: tandai elemen paling luar.
      let marked = false;
      return nodes.map((n) => {
        if (!marked && n && n.kind === "el") {
          marked = true;
          return { ...n, attrs: { ...n.attrs, ...mark(p.node.id), "static:data-cm-el": true } };
        }
        return n;
      });
    }
    if (wrap) body = wrap(body);
    if (preview) {
      body = body.replace(
        /^(\s*<[a-zA-Z][\w-]*)/,
        `$1 data-cm-id="${p.node.id}" data-cm-el`,
      );
    }
    return raw(body);
  };

  const componentTag = (p: PElement, target: RenderTarget) =>
    target === "angular" ? `app-${toKebab(p.compName!)}` : p.compName!;

  const nodesFor = (p: PNode, target: RenderTarget): MNode | MNode[] => {
    if (p.kind === "box") {
      const attrs: Record<string, string | boolean | { expr: string }> = {
        class: [p.cls, ...(p.classes ?? [])].join(" "),
        ...(p.cssId ? { id: p.cssId } : {}),
        ...(p.attrs ?? {}),
      };
      // Root mendapat ref supaya Custom JS bisa diinisialisasi saat komponen di-mount.
      if (p === tree && hasCustomJs) {
        Object.assign(attrs, {
          "jsx:ref": { expr: "rootRef" },
          "vue:ref": "rootRef",
          "svelte:bind:this": { expr: "rootEl" },
          "angular:#pmRoot": true,
        });
      }
      if (preview) {
        Object.assign(attrs, mark(p.node.id), {
          "static:data-cm-box": true,
          ...(p.children.length === 0 ? { "static:data-cm-empty": true } : {}),
        });
      }
      return h(p.node.tag ?? "div", attrs, p.children.map((c) => nodesFor(c, target)).flat() as MNode[]);
    }
    if (p.error || !p.spec) {
      // Placeholder hanya di pratinjau; kode export melewati elemen yang gagal.
      return preview && target === "static" ? staticElement(p) : null;
    }
    if (target === "static") return staticElement(p);
    if (p.stateful) return h(componentTag(p, target), {});
    const nodes = p.eventMarkup ? p.eventMarkup(target) : p.spec.markup;
    return nodes ?? null;
  };

  /* ---- 4. keluaran HTML (pratinjau + export HTML) ---- */
  // v9: blok bersama (/* owd-shared:id */ … /* /owd-shared:id */) cukup ditulis sekali.
  const sharedSeen = new Set<string>();
  const scripts = okElements
    .map((e) => e.spec!.html?.script?.trim())
    .filter((s): s is string => !!s)
    .map((s) => s.replace(/\/\* owd-shared:([\w-]+) \*\/[\s\S]*?\/\* \/owd-shared:\1 \*\/\n?/g, (m, id: string) => (sharedSeen.has(id) ? "" : (sharedSeen.add(id), m))));
  const allEvents = okElements.flatMap((e) => e.events);
  // Di canvas desain (preview) event tidak dijalankan: klik dipakai untuk memilih.
  if (allEvents.length && !preview) {
    scripts.push(
      allEvents
        .map(
          (e) =>
            `function ${e.handler}(event) {\n${indentCode(e.code, "  ")}\n}\ndocument.querySelectorAll(${JSON.stringify(e.selector)}).forEach(function (el) {\n  el.addEventListener(${JSON.stringify(e.info.dom)}, ${e.handler});\n});`,
        )
        .join("\n\n"),
    );
  }
  const jsHandlers = allEvents
    .map((e) => `function ${e.handler}(event) {\n${indentCode(e.code, "  ")}\n}`)
    .join("\n\n");
  const tsHandlers = allEvents
    .map((e) => `${e.handler}(event: any): void {\n${indentCode(e.code, "  ")}\n}`)
    .join("\n\n");
  const joinParts = (...parts: (string | undefined)[]) => parts.filter((x) => x && x.trim()).join("\n\n") || undefined;
  // Custom JS hanya jalan di Pratinjau & hasil export — tidak di canvas desain.
  if (hasCustomJs && !preview) scripts.push(`${runtime}\n\ninitCustomCode(document);`);
  // Uji coba CRUD: chip filter kategori di situs statis.
  if (hasFilter && !preview) scripts.push(FILTER_JS);
  const fontLoaders = fontLoadCss([layoutCss, ...okElements.map(elementCss), customCss("plain")].join("\n"), allFonts, vars);
  const html = {
    css: withFonts([varsCss, layoutCss, ...okElements.map(elementCss), customCss("plain")].filter(Boolean).join("\n")),
    body: renderFor("static", nodesFor(tree, "static")),
    script: scripts.join("\n\n"),
  };

  /* ---- 5. file per framework ---- */
  const children: ChildComponent[] = okElements
    .filter((e) => e.stateful)
    .map((e) => {
      // CSS penempatan ikut ke komponen anak (class-nya ada di template anak).
      const extra = (placeBlock(e) ? "\n" + placeBlock(e) : "") + "";
      return {
        name: e.compName!,
        nodeId: e.node.id,
        spec: { ...e.spec!, css: withFonts(`${e.spec!.css.trim()}\n${extra}`.trimEnd() + "\n") },
      };
    });

  // Pemuat font juga memindai Custom CSS (mis. font template di root), karena
  // Custom CSS framework ditulis terpisah dari CSS induk.
  const parentBase = [layoutCss, ...okElements.filter((e) => !e.stateful).map(elementCss)].join("\n");
  const parentLoad = fontLoadCss(`${parentBase}\n${customCss("plain")}`, allFonts, vars);
  const parentCss = parentLoad ? `${parentLoad}\n\n${parentBase}` : parentBase;

  const files = (framework: Framework): GeneratedFile[] => {
    if (framework === "html" || framework === "blade") {
      return generateFrameworkFiles("html", {
        name: rootName,
        css: html.css,
        html: { body: html.body, script: html.script || undefined, head: libraryHead(exportLibs) || undefined, tail: libraryScripts(exportLibs) || undefined },
      });
    }
    const target = framework as RenderTarget;
    const markup = renderFor(target, nodesFor(tree, target));
    const plainCustom = customCss("plain");
    const cssFor =
      framework === "svelte"
        ? [parentCss, customCss("svelte")].filter(Boolean).join("\n")
        : framework === "vue"
          ? parentCss
          : [parentCss, plainCustom].filter(Boolean).join("\n");
    const parent = generateFrameworkFiles(framework, {
      name: rootName,
      css: cssFor,
      ...(framework === "react" && {
        react: {
          jsx: markup,
          imports:
            joinParts(
              hasCustomJs ? `import { useEffect, useRef } from "react";\nimport { initCustomCode } from "./customCode";` : undefined,
              children.map((c) => `import ${c.name} from "./${c.name}";`).join("\n"),
            )?.replace(/\n\n/g, "\n"),
          pre: joinParts(
            hasCustomJs ? `const rootRef = useRef(null);\nuseEffect(() => initCustomCode(rootRef.current), []);` : undefined,
            jsHandlers,
          ),
        },
      }),
      ...(framework === "vue" && {
        vue: {
          template: markup,
          script: joinParts(
            [
              ...(hasCustomJs
                ? [`import { ref, onMounted, onBeforeUnmount } from "vue";`, `import { initCustomCode } from "./customCode.js";`]
                : []),
              ...children.map((c) => `import ${c.name} from "./${c.name}.vue";`),
            ].join("\n"),
            hasCustomJs
              ? `const rootRef = ref(null);\nlet destroyCustomCode = null;\nonMounted(() => {\n  destroyCustomCode = initCustomCode(rootRef.value);\n});\nonBeforeUnmount(() => {\n  if (destroyCustomCode) destroyCustomCode();\n});`
              : undefined,
            jsHandlers,
          ),
          globalCss: plainCustom || undefined,
        },
      }),
      ...(framework === "svelte" && {
        svelte: {
          markup,
          script: joinParts(
            [
              ...(hasCustomJs ? [`import { onMount } from "svelte";`, `import { initCustomCode } from "./customCode.js";`] : []),
              ...children.map((c) => `import ${c.name} from "./${c.name}.svelte";`),
            ].join("\n"),
            hasCustomJs ? `let rootEl;\nonMount(() => initCustomCode(rootEl));` : undefined,
            jsHandlers,
          ),
        },
      }),
      ...(framework === "angular" && {
        angular: {
          template: markup,
          classBody: joinParts(
            hasCustomJs
              ? `@ViewChild('pmRoot') pmRoot!: ElementRef<HTMLElement>;\nprivate destroyCustomCode: (() => void) | null = null;\n\nngAfterViewInit(): void {\n  this.destroyCustomCode = initCustomCode(this.pmRoot.nativeElement);\n}\n\nngOnDestroy(): void {\n  if (this.destroyCustomCode) this.destroyCustomCode();\n}`
              : undefined,
            tsHandlers,
          ),
          ...(hasCustomJs && {
            coreImports: ["AfterViewInit", "ElementRef", "OnDestroy", "ViewChild"],
            headerImports: `import { initCustomCode } from './custom-code';`,
            implementsList: ["AfterViewInit", "OnDestroy"],
          }),
          encapsulationNone: !!plainCustom,
          imports: children.map((c) => ({
            name: `${c.name}Component`,
            path: `./${toKebab(c.name)}.component`,
          })),
        },
      }),
    });
    const childFiles = children.flatMap((c) =>
      generateFrameworkFiles(framework, {
        name: c.name,
        ...c.spec,
        // Host komponen Angular transparan supaya aturan layout induk tetap berlaku.
        css:
          framework === "angular"
            ? withFonts(`:host {\n  display: contents;\n}\n\n${c.spec.css}`)
            : c.spec.css,
        ...(framework === "angular" && {
          angular: { ...c.spec.angular, standalone: true },
        }),
      }),
    );
    const runtimeFile: GeneratedFile[] = hasCustomJs
      ? framework === "angular"
        ? [{ name: "custom-code.ts", lang: "ts", content: `// @ts-nocheck — Custom JS ditulis pengguna (JavaScript biasa).\nexport ${runtime}\n` }]
        : [{ name: "customCode.js", lang: "js", content: `export ${runtime}\n` }]
      : [];
    const libFile: GeneratedFile[] = exportLibs.length ? [{ name: "LIBRARIES.md", lang: "md", content: libraryReadme(exportLibs) }] : [];
    // v25: runtime efek (pengganti AOS/Animate.css/Tilt) sebagai berkas sendiri untuk komponen framework.
    if (usesMotion(exportLibs))
      libFile.push({ name: "owd-motion.css", lang: "css", content: MOTION_CSS + "\n" }, { name: "owd-motion.js", lang: "js", content: MOTION_JS + "\n" });
    if (usesScroll(exportLibs))
      libFile.push({ name: "owd-scroll.css", lang: "css", content: SCROLL_CSS + "\n" }, { name: "owd-scroll.js", lang: "js", content: SCROLL_JS + "\n" });
    // v9: berkas pendukung elemen (mis. runtime 3D), satu salinan per nama berkas.
    const extra = new Map<string, GeneratedFile>();
    for (const e of okElements) for (const f of e.def?.extraFiles?.(framework) ?? []) if (!extra.has(f.name)) extra.set(f.name, f);
    return [...parent, ...childFiles, ...runtimeFile, ...extra.values(), ...libFile];
  };

  return {
    rootClass,
    rootName,
    warnings,
    elementCount: okElements.length,
    html,
    libraries: exportLibs,
    files,
    varsCss,
    fontLoaders,
  };
}
