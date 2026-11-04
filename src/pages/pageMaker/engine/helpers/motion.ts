/* ================================================================== */
/* Per-node CSS animation (v9) — no library                             */
/*                                                                    */
/* Users pick an animation in the element/box Styling panel (`node.anim`). */
/* compose() menambah class `owd-anim owd-anim--<preset>` + atribut     */
/* the trigger to the outermost element, then writes @keyframes ONLY for the presets */
/* in use. Unset values follow Global Settings →                        */
/* Animation & 3D, which are written as CSS variables on :root:         */
/*   --owd-anim-duration, --owd-anim-delay, --owd-anim-easing,          */
/*   --owd-anim-distance, --owd-anim-once                               */
/* The "when visible" trigger uses a small IntersectionObserver (through */
/* the Custom JS runtime, so it is cleaned up in React/Vue/Svelte/Angular). */
/* prefers-reduced-motion selalu dihormati.                             */
/* ================================================================== */

import type { CssFlavor } from "./advanced";

export type AnimKind = "entrance" | "loop" | "hover";
export type AnimTrigger = "load" | "scroll";

interface PresetDef {
  kind: AnimKind;
  /** @keyframes content (entrance/loop) or declarations on :hover (hover). */
  css: string;
}

const D = "var(--owd-anim-distance, 24px)";

export const ANIM_PRESETS = {
  "fade-in": { kind: "entrance", css: "from { opacity: 0; } to { opacity: 1; }" },
  "fade-up": { kind: "entrance", css: `from { opacity: 0; transform: translate3d(0, ${D}, 0); } to { opacity: 1; transform: none; }` },
  "fade-down": { kind: "entrance", css: `from { opacity: 0; transform: translate3d(0, calc(${D} * -1), 0); } to { opacity: 1; transform: none; }` },
  "fade-left": { kind: "entrance", css: `from { opacity: 0; transform: translate3d(${D}, 0, 0); } to { opacity: 1; transform: none; }` },
  "fade-right": { kind: "entrance", css: `from { opacity: 0; transform: translate3d(calc(${D} * -1), 0, 0); } to { opacity: 1; transform: none; }` },
  "zoom-in": { kind: "entrance", css: "from { opacity: 0; transform: scale(0.88); } to { opacity: 1; transform: none; }" },
  "zoom-out": { kind: "entrance", css: "from { opacity: 0; transform: scale(1.12); } to { opacity: 1; transform: none; }" },
  "flip-up": { kind: "entrance", css: "from { opacity: 0; transform: perspective(800px) rotateX(55deg); transform-origin: 50% 100%; } to { opacity: 1; transform: none; }" },
  "blur-in": { kind: "entrance", css: "from { opacity: 0; filter: blur(12px); } to { opacity: 1; filter: none; }" },
  "bounce-in": { kind: "entrance", css: "0% { opacity: 0; transform: scale(0.6); } 60% { opacity: 1; transform: scale(1.06); } 80% { transform: scale(0.97); } 100% { transform: none; }" },
  pulse: { kind: "loop", css: "0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); }" },
  float: { kind: "loop", css: "0%, 100% { transform: translate3d(0, 0, 0); } 50% { transform: translate3d(0, -10px, 0); }" },
  spin: { kind: "loop", css: "from { transform: rotate(0deg); } to { transform: rotate(360deg); }" },
  shake: { kind: "loop", css: "0%, 100% { transform: none; } 20%, 60% { transform: translate3d(-6px, 0, 0); } 40%, 80% { transform: translate3d(6px, 0, 0); }" },
  wiggle: { kind: "loop", css: "0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-4deg); } 75% { transform: rotate(4deg); }" },
  heartbeat: { kind: "loop", css: "0%, 40%, 100% { transform: scale(1); } 20% { transform: scale(1.12); } 30% { transform: scale(0.98); }" },
  grow: { kind: "hover", css: "transform: scale(1.05);" },
  shrink: { kind: "hover", css: "transform: scale(0.96);" },
  lift: { kind: "hover", css: "transform: translate3d(0, -6px, 0); box-shadow: 0 18px 36px -18px rgba(15, 23, 42, 0.35);" },
  tilt: { kind: "hover", css: "transform: perspective(700px) rotateX(4deg) rotateY(-6deg);" },
  glow: { kind: "hover", css: "box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-primary, #3b68f0) 25%, transparent), 0 10px 30px -10px var(--color-primary, #3b68f0);" },
} satisfies Record<string, PresetDef>;

export type AnimPreset = keyof typeof ANIM_PRESETS;
export const ANIM_PRESET_IDS = Object.keys(ANIM_PRESETS) as AnimPreset[];
export const presetsOfKind = (k: AnimKind) => ANIM_PRESET_IDS.filter((id) => ANIM_PRESETS[id].kind === k);

export const ANIM_EASINGS = {
  ease: "ease",
  "ease-in": "ease-in",
  "ease-out": "ease-out",
  "ease-in-out": "ease-in-out",
  linear: "linear",
  smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;
export type AnimEasing = keyof typeof ANIM_EASINGS;
export const ANIM_EASING_IDS = Object.keys(ANIM_EASINGS) as AnimEasing[];

/** Animation settings of one node. Empty field = follow Global Settings. */
export interface NodeAnim {
  preset: AnimPreset;
  /** Entrance animations only: on page load or when the element becomes visible. */
  trigger?: AnimTrigger;
  /** ms 0–10000. */
  duration?: number;
  /** ms 0–10000. */
  delay?: number;
  easing?: AnimEasing;
  /** Looping animations only: number of iterations, 0 = infinite. */
  repeat?: number;
  /** Scroll trigger only: false = replayed every time it becomes visible. */
  once?: boolean;
}

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const ms = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? Math.min(10000, Math.max(0, Math.round(v / 10) * 10)) : undefined);

export function sanitizeAnim(v: unknown): NodeAnim | undefined {
  if (!isObj(v) || typeof v.preset !== "string" || !(v.preset in ANIM_PRESETS)) return undefined;
  const preset = v.preset as AnimPreset;
  const kind = ANIM_PRESETS[preset].kind;
  const out: NodeAnim = { preset };
  if (kind === "entrance") out.trigger = v.trigger === "load" ? "load" : v.trigger === "scroll" ? "scroll" : undefined;
  const duration = ms(v.duration);
  const delay = ms(v.delay);
  if (duration !== undefined) out.duration = Math.max(50, duration);
  if (delay !== undefined && kind !== "hover") out.delay = delay;
  if (typeof v.easing === "string" && v.easing in ANIM_EASINGS) out.easing = v.easing as AnimEasing;
  if (kind === "loop" && typeof v.repeat === "number" && Number.isFinite(v.repeat)) out.repeat = Math.min(20, Math.max(0, Math.round(v.repeat)));
  if (kind === "entrance" && typeof v.once === "boolean") out.once = v.once;
  return out;
}

/* ------------------------------------------------------------------ */
/* Pengaturan global (Pengaturan Global → Animasi & 3D)                 */
/* ------------------------------------------------------------------ */

export interface MotionDefaults {
  duration: number;
  delay: number;
  easing: AnimEasing;
  /** Entrance animation slide distance (px). */
  distance: number;
  /** Default trigger for new entrance animations. */
  trigger: AnimTrigger;
  once: boolean;
}

export const DEFAULT_MOTION: MotionDefaults = { duration: 700, delay: 0, easing: "smooth", distance: 24, trigger: "scroll", once: true };

/** Effective trigger of a node (entrance with no choice → global default). */
export const animTrigger = (a: NodeAnim, defaults: Pick<MotionDefaults, "trigger"> = DEFAULT_MOTION): AnimTrigger | "hover" | "loop" => {
  const kind = ANIM_PRESETS[a.preset].kind;
  return kind === "entrance" ? (a.trigger ?? defaults.trigger) : kind;
};

/* ------------------------------------------------------------------ */
/* Keluaran                                                             */
/* ------------------------------------------------------------------ */

/** Classes + attributes on the node's outermost element. */
export function animAttrs(a: NodeAnim | undefined, defaults: Pick<MotionDefaults, "trigger"> = DEFAULT_MOTION): { classes: string[]; attrs: Record<string, string> } {
  if (!a) return { classes: [], attrs: {} };
  const trigger = animTrigger(a, defaults);
  const kind = ANIM_PRESETS[a.preset].kind;
  const classes = kind === "hover" ? ["owd-hover", `owd-hover--${a.preset}`] : ["owd-anim", `owd-anim--${a.preset}`];
  const attrs: Record<string, string> = {};
  if (trigger === "scroll") {
    attrs["data-owd-trigger"] = "scroll";
    if (a.once !== undefined) attrs["data-owd-once"] = String(a.once);
  }
  return { classes, attrs };
}

/** Per-node override rules (custom duration/delay/easing/repeat). */
export function animNodeCss(a: NodeAnim, selector: string): string {
  const kind = ANIM_PRESETS[a.preset].kind;
  const decl: string[] = [];
  if (kind === "hover") {
    if (a.duration !== undefined) decl.push(`transition-duration: ${a.duration}ms;`);
    if (a.easing) decl.push(`transition-timing-function: ${ANIM_EASINGS[a.easing]};`);
  } else {
    if (a.duration !== undefined) decl.push(`animation-duration: ${a.duration}ms;`);
    if (a.delay !== undefined) decl.push(`animation-delay: ${a.delay}ms;`);
    if (a.easing) decl.push(`animation-timing-function: ${ANIM_EASINGS[a.easing]};`);
    if (kind === "loop" && a.repeat !== undefined) decl.push(`animation-iteration-count: ${a.repeat === 0 ? "infinite" : a.repeat};`);
  }
  if (!decl.length) return "";
  const cls = kind === "hover" ? ".owd-hover" : ".owd-anim";
  return `${selector}${cls} {\n${decl.map((d) => `  ${d}`).join("\n")}\n}\n`;
}

/**
 * Shared CSS for the presets in use. `svelte` wraps selectors
 * in :global() and prefixes @keyframes with -global-.
 */
export function motionCss(presets: Iterable<AnimPreset>, flavor: CssFlavor = "plain"): string {
  const used = [...new Set(presets)].filter((p) => p in ANIM_PRESETS).sort();
  if (!used.length) return "";
  const g = (sel: string) => (flavor === "svelte" ? `:global(${sel})` : sel);
  const kf = (name: string) => (flavor === "svelte" ? `-global-${name}` : name);
  const anims = used.filter((p) => ANIM_PRESETS[p].kind !== "hover");
  const hovers = used.filter((p) => ANIM_PRESETS[p].kind === "hover");
  const out: string[] = ["/* Animasi CSS (Pengaturan Global → Animasi & 3D) */"];
  if (anims.length) {
    out.push(
      `${g(".owd-anim")} {
  animation-duration: var(--owd-anim-duration, 700ms);
  animation-delay: var(--owd-anim-delay, 0ms);
  animation-timing-function: var(--owd-anim-easing, cubic-bezier(0.22, 1, 0.36, 1));
  animation-fill-mode: both;
}`,
    );
    for (const p of anims) {
      const loop = ANIM_PRESETS[p].kind === "loop";
      out.push(`@keyframes ${kf(`owd-${p}`)} {\n  ${ANIM_PRESETS[p].css}\n}`);
      out.push(`${g(`.owd-anim--${p}`)} {\n  animation-name: owd-${p};${loop ? "\n  animation-iteration-count: infinite;" : ""}\n}`);
    }
    out.push(`${g('.owd-motion .owd-anim[data-owd-trigger="scroll"]:not(.owd-in)')} {\n  animation-name: none;\n  opacity: 0;\n}`);
  }
  if (hovers.length) {
    out.push(
      `${g(".owd-hover")} {
  transition-property: transform, box-shadow, filter;
  transition-duration: calc(var(--owd-anim-duration, 700ms) * 0.4);
  transition-timing-function: var(--owd-anim-easing, cubic-bezier(0.22, 1, 0.36, 1));
}`,
    );
    for (const p of hovers) out.push(`${g(`.owd-hover--${p}:hover`)},\n${g(`.owd-hover--${p}:focus-visible`)} {\n  ${ANIM_PRESETS[p].css}\n}`);
  }
  out.push(`@media (prefers-reduced-motion: reduce) {\n  ${g(".owd-anim")},\n  ${g(".owd-hover")} {\n    animation: none !important;\n    transition: none !important;\n    opacity: 1 !important;\n  }\n}`);
  return out.join("\n") + "\n";
}

/** Scroll trigger code (run through the Custom JS runtime: `element` = the page root). */
export const MOTION_OBSERVER_JS = `// Animasi CSS: putar animasi "saat terlihat" ketika elemen masuk layar.
var doc = element.ownerDocument || document;
var list = element.querySelectorAll('[data-owd-trigger="scroll"]');
if (!list.length) return;
var showAll = function () { list.forEach(function (el) { el.classList.add("owd-in"); }); };
if (!("IntersectionObserver" in window)) return showAll();
var onceAll = getComputedStyle(doc.documentElement).getPropertyValue("--owd-anim-once").trim() !== "0";
doc.documentElement.classList.add("owd-motion");
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    var el = en.target;
    var once = el.hasAttribute("data-owd-once") ? el.getAttribute("data-owd-once") !== "false" : onceAll;
    if (en.isIntersecting) {
      el.classList.add("owd-in");
      if (once) io.unobserve(el);
    } else if (!once) el.classList.remove("owd-in");
  });
}, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
list.forEach(function (el) { io.observe(el); });
onCleanup(function () { io.disconnect(); });`;
