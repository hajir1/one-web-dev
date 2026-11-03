import type { MElement, MNode } from "../../core/helpers/markup";
import i18n from "../../../../i18n";

/* ================================================================== */
/* Event JavaScript pada elemen (Page Maker)                            */
/*                                                                    */
/* Pengguna menulis ISI fungsi handler (variabel `event` tersedia).      */
/* compose() menerjemahkannya per framework:                            */
/*   HTML    → function + addEventListener di script.js                 */
/*   React   → function di komponen + onClick={handler}                */
/*   Vue     → function di <script setup> + @click="handler"            */
/*   Svelte  → function di <script> + on:click={handler}                */
/*   Angular → method kelas + (click)="handler($event)"                 */
/*                                                                    */
/* Versi gratis: hanya onClick. Event lain = premium (butuh kredit).     */
/* ================================================================== */

export type EventName =
  | "onClick"
  | "onDoubleClick"
  | "onChange"
  | "onInput"
  | "onMouseDown"
  | "onMouseUp"
  | "onMouseEnter"
  | "onMouseLeave"
  | "onFocus"
  | "onBlur"
  | "onKeyDown"
  | "onKeyUp";

export interface ElementEvent {
  name: EventName;
  /** Isi fungsi handler (JavaScript). */
  code: string;
}

export interface EventInfo {
  name: EventName;
  /** Nama event DOM (addEventListener, Vue @, Svelte on:, Angular ()). */
  dom: string;
  label: string;
  free: boolean;
}

/** Label dibaca lewat getter supaya selalu mengikuti bahasa aktif. */
const ev = (name: EventName, dom: string, free: boolean): EventInfo => ({
  name,
  dom,
  free,
  get label() {
    return i18n.t(`el.events.${name}`);
  },
});

export const EVENTS: EventInfo[] = [
  ev("onClick", "click", true),
  ev("onDoubleClick", "dblclick", false),
  ev("onChange", "change", false),
  ev("onInput", "input", false),
  ev("onMouseDown", "mousedown", false),
  ev("onMouseUp", "mouseup", false),
  ev("onMouseEnter", "mouseenter", false),
  ev("onMouseLeave", "mouseleave", false),
  ev("onFocus", "focus", false),
  ev("onBlur", "blur", false),
  ev("onKeyDown", "keydown", false),
  ev("onKeyUp", "keyup", false),
];

export const EVENT_BY_NAME = Object.fromEntries(EVENTS.map((e) => [e.name, e])) as Record<EventName, EventInfo>;
export const isFreeEvent = (n: EventName) => EVENT_BY_NAME[n]?.free === true;

/** Elemen yang mendukung event (elemen interaktif tanpa logika framework sendiri). */
export const EVENT_ELEMENT_TYPES = ["button", "anchor", "image", "icon", "badge", "card", "product-card", "input", "select", "checkbox", "switch"];
export const supportsEvents = (elementType: string) => EVENT_ELEMENT_TYPES.includes(elementType);

export const MAX_EVENTS = EVENTS.length;
const MAX_EVENT_CODE = 5000;

/** Bersihkan `events` dari data tersimpan. */
export function sanitizeEvents(v: unknown): ElementEvent[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out: ElementEvent[] = [];
  const seen = new Set<string>();
  for (const e of v) {
    if (!e || typeof e !== "object") continue;
    const { name, code } = e as Record<string, unknown>;
    if (typeof name !== "string" || !(name in EVENT_BY_NAME) || seen.has(name)) continue;
    seen.add(name);
    out.push({ name: name as EventName, code: typeof code === "string" ? code.slice(0, MAX_EVENT_CODE) : "" });
  }
  return out.length ? out : undefined;
}

/** Cek sintaks isi handler tanpa menjalankannya. null = valid (atau tidak bisa dicek). */
export function eventCodeError(code: string): string | null {
  try {
    // Hanya MENGOMPILASI fungsi (tidak dipanggil).
    new Function("event", code);
    return null;
  } catch (err) {
    if (err instanceof SyntaxError) return err.message;
    return null; // mis. CSP melarang eval → anggap valid
  }
}

/** `pg__button-1` + onClick → `handleButton1Click`. */
export function handlerName(cls: string, rootClass: string, name: EventName): string {
  const local = cls.startsWith(`${rootClass}__`) ? cls.slice(rootClass.length + 2) : cls;
  const pascal = local
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
  return `handle${pascal}${name.slice(2)}`;
}

const FORM_TYPES = new Set(["input", "select", "checkbox", "switch"]);
const CONTROL_TAGS = new Set(["input", "select", "textarea"]);

/**
 * Elemen markup penerima event: untuk elemen form = kontrolnya
 * (input/select), selain itu = elemen terluar.
 */
export function eventTarget(markup: MNode | MNode[] | undefined, elementType = ""): MElement | null {
  const list = (Array.isArray(markup) ? markup : [markup]).filter(
    (n): n is MElement => !!n && typeof n === "object" && n.kind === "el",
  );
  const root = list[0];
  if (!root) return null;
  if (!FORM_TYPES.has(elementType)) return root;
  const find = (n: MElement): MElement | null => {
    if (CONTROL_TAGS.has(n.tag)) return n;
    for (const c of n.children) {
      if (c.kind === "el") {
        const f = find(c);
        if (f) return f;
      }
    }
    return null;
  };
  return find(root) ?? root;
}

/** Salinan markup dengan atribut tambahan pada `target` (tanpa mengubah aslinya). */
export function addAttrsTo(
  markup: MNode | MNode[] | undefined,
  target: MElement,
  attrs: MElement["attrs"],
): MNode | MNode[] | undefined {
  const go = (n: MNode): MNode => {
    if (!n || typeof n !== "object" || n.kind !== "el") return n;
    if (n === target) return { ...n, attrs: { ...n.attrs, ...attrs } };
    return { ...n, children: n.children.map((c) => go(c) as typeof c) };
  };
  return Array.isArray(markup) ? markup.map(go) : markup ? go(markup) : markup;
}

/** Selector CSS untuk target di export HTML. */
export function targetSelector(rootCls: string, target: MElement, isRoot: boolean): string {
  const cls = typeof target.attrs.class === "string" ? target.attrs.class.trim().split(/\s+/)[0] : "";
  if (cls) return `.${cls}`;
  return isRoot ? `.${rootCls}` : `.${rootCls} ${target.tag}`;
}

export const indentCode = (code: string, pad: string) =>
  code
    .replace(/\r\n?/g, "\n")
    .trim()
    .split("\n")
    .map((l) => (l.trim() ? pad + l : ""))
    .join("\n");

/**
 * Fitur event per elemen dihapus dari mode edit: JavaScript tambahan kini
 * ditulis UTUH di Custom JavaScript. Event yang sudah tersimpan di desain
 * lama diubah menjadi kode Custom JS yang setara (runtime menyediakan
 * `element` dan `on(target, event, fn)`), jadi perilakunya tidak hilang.
 */
export function eventsToCustomJs(events: ElementEvent[], elementType = ""): string {
  const used = events.filter((e) => e.code.trim());
  if (!used.length) return "";
  const target = FORM_TYPES.has(elementType) ? 'element.querySelector("input, select, textarea") || element' : "element";
  const body = used
    .map((e) => {
      const code = e.code
        .trim()
        .split("\n")
        .map((l) => `  ${l}`)
        .join("\n");
      return `// ${e.name} (dipindahkan dari panel Event)\non(target, "${EVENT_BY_NAME[e.name].dom}", function (event) {\n${code}\n});`;
    })
    .join("\n\n");
  return `var target = ${target};\n${body}`;
}
