import type { MElement, MNode } from "../../core/helpers/markup";
import i18n from "../../../../i18n";

/* ================================================================== */
/* JavaScript events on elements (Page Maker)                           */
/*                                                                    */
/* Users write the BODY of the handler function (the `event` variable is available). */
/* compose() menerjemahkannya per framework:                            */
/*   HTML    → function + addEventListener in script.js                 */
/*   React   → function in the component + onClick={handler}           */
/*   Vue     → function in <script setup> + @click="handler"            */
/*   Svelte  → function in <script> + on:click={handler}                */
/*   Angular → method kelas + (click)="handler($event)"                 */
/*                                                                    */
/* Free version: onClick only. Other events = premium (need credits).    */
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
  /** The handler function body (JavaScript). */
  code: string;
}

export interface EventInfo {
  name: EventName;
  /** Nama event DOM (addEventListener, Vue @, Svelte on:, Angular ()). */
  dom: string;
  label: string;
  free: boolean;
}

/** Labels are read via a getter so they always follow the active language. */
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

/** Elements that support events (interactive elements without their own framework logic). */
export const EVENT_ELEMENT_TYPES = ["button", "anchor", "image", "icon", "badge", "card", "product-card", "input", "select", "checkbox", "switch"];
export const supportsEvents = (elementType: string) => EVENT_ELEMENT_TYPES.includes(elementType);

export const MAX_EVENTS = EVENTS.length;
const MAX_EVENT_CODE = 5000;

/** Clean `events` from saved data. */
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

/** Syntax check of the handler body without running it. null = valid (or cannot be checked). */
export function eventCodeError(code: string): string | null {
  try {
    // Only COMPILES the function (it is not called).
    new Function("event", code);
    return null;
  } catch (err) {
    if (err instanceof SyntaxError) return err.message;
    return null; // e.g. a CSP forbids eval → treat as valid
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
 * The markup element that receives the event: for form elements = the control
 * (input/select), otherwise = the outermost element.
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

/** A copy of the markup with extra attributes on `target` (without changing the original). */
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

/** CSS selector for the target in the HTML export. */
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
 * The per-element event feature was removed from edit mode: extra JavaScript is now
 * written IN FULL in Custom JavaScript. Events already stored in old
 * designs are converted into equivalent Custom JS code (the runtime provides
 * `element` and `on(target, event, fn)`), so their behavior is not lost.
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
