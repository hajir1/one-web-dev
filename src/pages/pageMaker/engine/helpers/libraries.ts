/* ================================================================== */
/* Third-party libraries via CDN (the Library menu in Page Maker)       */
/*                                                                    */
/* Users "install" a library into the design (stored on the root node:  */
/* `root.libraries`), then configure its effects per element/box (`node.libs`). */
/* compose() adds attributes/classes to the markup, and the exported output loads */
/* CSS/JS libraries from the jsDelivr CDN (pinned versions).             */
/* v25: AOS, Animate.css, and Vanilla Tilt no longer come from a CDN: replaced by */
/* the OWD Motion runtime (motionRuntime.ts) embedded in the HTML, with  */
/* the same attributes/classes.                                         */
/*                                                                    */
/* Libraries are not loaded on the Design canvas (AOS hides elements    */
/* before scrolling); effects show in Preview & the exported output.   */
/* ================================================================== */

export type LibraryId = "aos" | "animate" | "tilt" | "scroll" | "chartjs" | "aframe" | "three";

/** Effect libraries users install/remove through the Library menu. */
export type EffectLibraryId = Exclude<LibraryId, "chartjs" | "aframe" | "three">;

import { MOTION_CSS, MOTION_HEAD_FLAG, MOTION_JS } from "./motionRuntime";
import { SCROLL_AMOUNT, SCROLL_CSS, SCROLL_EFFECTS, SCROLL_JS, type ScrollEffect } from "./scrollRuntime";
export { SCROLL_AMOUNT, SCROLL_EFFECTS, type ScrollEffect };

export interface LibraryDef {
  id: LibraryId;
  name: string;
  version: string;
  /** URL stylesheet CDN. */
  css?: string;
  /** URL skrip CDN. */
  js?: string;
  /** Initialization code after the script loads. */
  init?: string;
  /** npm package name (for React/Vue/Svelte/Angular projects). */
  npm: string;
  homepage: string;
  license: string;
  /**
   * Installed AUTOMATICALLY by elements that need it (e.g. Chart.js by the
   * Chart element); shown in the Library menu as info, without an install button.
   */
  auto?: boolean;
  /** Safe to load on the Design canvas (does not hide elements). */
  editSafe?: boolean;
  /** The CDN script goes in <head> (not at the end of <body>). */
  headScript?: boolean;
  /**
   * v9: an ES module loaded dynamically (`import()`) by the element runtime when
   * the element approaches the screen; no <script> tag in <head>/<body>.
   */
  esm?: string;
  /** v25: run by the OWD Motion runtime embedded in the HTML (no CDN). */
  builtin?: boolean;
  /** <head> scripts may use `defer` (the code using them waits for the library). */
  defer?: boolean;
}

export const LIBRARIES: LibraryDef[] = [
  {
    id: "aos",
    name: "AOS (Animate On Scroll)",
    version: "2.3.4",
    builtin: true,
    init: "if (window.OWDMotion) OWDMotion.init();",
    npm: "aos@2.3.4",
    homepage: "https://michalsnik.github.io/aos/",
    license: "MIT",
  },
  {
    id: "animate",
    name: "Animate.css",
    version: "4.1.1",
    builtin: true,
    npm: "animate.css@4.1.1",
    homepage: "https://animate.style/",
    license: "MIT",
  },
  {
    id: "tilt",
    name: "Vanilla Tilt",
    version: "1.8.1",
    builtin: true,
    init: "if (window.OWDMotion) OWDMotion.init();",
    npm: "vanilla-tilt@1.8.1",
    homepage: "https://micku7zu.github.io/vanilla-tilt.js/",
    license: "MIT",
  },
  {
    // v26: cinematic scroll effects (text split, pin, horizontal scroll, etc.), written in-house.
    id: "scroll",
    name: "OWD Scroll",
    version: "1.0",
    builtin: true,
    init: "if (window.OWDScroll) OWDScroll.init();",
    npm: "",
    homepage: "",
    license: "bagian dari OneWebDev (bebas dipakai di website ekspor)",
  },
  {
    id: "chartjs",
    name: "Chart.js",
    version: "4.4.1",
    js: "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.js",
    npm: "chart.js@4.4.1",
    homepage: "https://www.chartjs.org/",
    license: "MIT",
    auto: true,
    editSafe: true,
    headScript: true,
    // The Chart element waits for window.Chart (whenChartReady), so it is safe to defer.
    defer: true,
  },
  {
    id: "aframe",
    name: "A-Frame",
    version: "1.6.0",
    js: "https://cdn.jsdelivr.net/npm/aframe@1.6.0/dist/aframe-v1.6.0.min.js",
    npm: "aframe@1.6.0",
    homepage: "https://aframe.io/",
    license: "MIT",
    auto: true,
    headScript: true,
  },
  {
    id: "three",
    name: "Three.js",
    version: "0.186.1",
    esm: "https://cdn.jsdelivr.net/npm/three@0.186.1/+esm",
    npm: "three@0.186.1",
    homepage: "https://threejs.org/",
    license: "MIT",
    auto: true,
    editSafe: true,
  },
];

export const LIBRARY_IDS = LIBRARIES.map((l) => l.id);
export const LIBRARY_BY_ID = Object.fromEntries(LIBRARIES.map((l) => [l.id, l])) as Record<LibraryId, LibraryDef>;
export const isLibraryId = (v: unknown): v is LibraryId => typeof v === "string" && (LIBRARY_IDS as string[]).includes(v);
/** Libraries that can be installed manually (Library menu → Install). */
export const EFFECT_LIBRARY_IDS = LIBRARIES.filter((l) => !l.auto).map((l) => l.id) as EffectLibraryId[];

/* ------------------------------------------------------------------ */
/* Pengaturan per node                                                  */
/* ------------------------------------------------------------------ */

export const AOS_EFFECTS = ["fade", "fade-up", "fade-down", "fade-left", "fade-right", "zoom-in", "zoom-in-up", "zoom-out", "flip-up", "flip-left", "slide-up", "slide-left"] as const;
export const ANIMATE_EFFECTS = ["fadeIn", "fadeInUp", "fadeInDown", "fadeInLeft", "fadeInRight", "zoomIn", "bounceIn", "backInUp", "lightSpeedInRight", "pulse", "heartBeat", "tada", "swing", "rubberBand"] as const;
export const ANIMATE_SPEEDS = ["normal", "slow", "slower", "fast", "faster"] as const;

export interface AosSettings {
  effect: (typeof AOS_EFFECTS)[number];
  /** ms, 0–3000 (kelipatan 50). */
  duration: number;
  /** ms, 0–3000 (kelipatan 50). */
  delay: number;
  /** false = the animation repeats every time it becomes visible. */
  once: boolean;
}

export interface AnimateSettings {
  effect: (typeof ANIMATE_EFFECTS)[number];
  speed: (typeof ANIMATE_SPEEDS)[number];
  /** Delay 0–5 seconds. */
  delay: number;
  /** 1–3 kali, 0 = terus-menerus. */
  repeat: number;
}

export interface TiltSettings {
  /** Kemiringan maksimum (derajat) 1–35. */
  max: number;
  /** Scale on hover (1–1.2). */
  scale: number;
  glare: boolean;
}

export interface ScrollSettings {
  effect: ScrollEffect;
  /** Effect strength (unit depends on the effect, see SCROLL_AMOUNT); 0 = default. */
  amount: number;
  /** Delay before starting (ms), for one-time entrance effects. */
  delay: number;
}

export interface NodeLibs {
  aos?: AosSettings;
  animate?: AnimateSettings;
  tilt?: TiltSettings;
  scroll?: ScrollSettings;
}

export const DEFAULT_LIBS: Required<NodeLibs> = {
  aos: { effect: "fade-up", duration: 700, delay: 0, once: true },
  animate: { effect: "fadeInUp", speed: "normal", delay: 0, repeat: 1 },
  tilt: { max: 10, scale: 1.03, glare: false },
  scroll: { effect: "split", amount: 0, delay: 0 },
};

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const pick = <T extends string>(v: unknown, list: readonly T[], d: T): T => (list.includes(v as T) ? (v as T) : d);
const int = (v: unknown, d: number, min: number, max: number, step = 1) =>
  typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.round(v / step) * step)) : d;

/** Sanitizes `libs` from stored data (values outside the list → default). */
export function sanitizeLibs(v: unknown): NodeLibs | undefined {
  if (!isObj(v)) return undefined;
  const out: NodeLibs = {};
  if (isObj(v.aos)) {
    const d = DEFAULT_LIBS.aos;
    out.aos = { effect: pick(v.aos.effect, AOS_EFFECTS, d.effect), duration: int(v.aos.duration, d.duration, 0, 3000, 50), delay: int(v.aos.delay, d.delay, 0, 3000, 50), once: v.aos.once !== false };
  }
  if (isObj(v.animate)) {
    const d = DEFAULT_LIBS.animate;
    out.animate = { effect: pick(v.animate.effect, ANIMATE_EFFECTS, d.effect), speed: pick(v.animate.speed, ANIMATE_SPEEDS, d.speed), delay: int(v.animate.delay, d.delay, 0, 5), repeat: int(v.animate.repeat, d.repeat, 0, 3) };
  }
  if (isObj(v.tilt)) {
    const d = DEFAULT_LIBS.tilt;
    const scale = typeof v.tilt.scale === "number" && Number.isFinite(v.tilt.scale) ? Math.min(1.2, Math.max(1, Math.round(v.tilt.scale * 100) / 100)) : d.scale;
    out.tilt = { max: int(v.tilt.max, d.max, 1, 35), scale, glare: v.tilt.glare === true };
  }
  if (isObj(v.scroll)) {
    const d = DEFAULT_LIBS.scroll;
    const effect = pick(v.scroll.effect, SCROLL_EFFECTS, d.effect);
    const r = SCROLL_AMOUNT[effect];
    const amount = v.scroll.amount === 0 ? 0 : int(v.scroll.amount, 0, r.min, r.max);
    out.scroll = { effect, amount, delay: int(v.scroll.delay, d.delay, 0, 3000, 50) };
  }
  return Object.keys(out).length ? out : undefined;
}

/** Sanitizes the installed library list (unique, known ones only). */
export function sanitizeLibraryList(v: unknown): LibraryId[] | undefined {
  if (!Array.isArray(v)) return undefined;
  const out = LIBRARY_IDS.filter((id) => v.includes(id));
  return out.length ? out : undefined;
}

/**
 * Attributes & classes added to the node's outermost element, only for
 * libraries installed in the design.
 */
export function libraryAttrs(libs: NodeLibs | undefined, installed: readonly LibraryId[]): { attrs: Record<string, string>; classes: string[] } {
  const attrs: Record<string, string> = {};
  const classes: string[] = [];
  if (!libs) return { attrs, classes };
  if (libs.aos && installed.includes("aos")) {
    attrs["data-aos"] = libs.aos.effect;
    attrs["data-aos-duration"] = String(libs.aos.duration);
    if (libs.aos.delay) attrs["data-aos-delay"] = String(libs.aos.delay);
    if (!libs.aos.once) attrs["data-aos-once"] = "false";
  }
  if (libs.animate && installed.includes("animate")) {
    classes.push("animate__animated", `animate__${libs.animate.effect}`);
    if (libs.animate.speed !== "normal") classes.push(`animate__${libs.animate.speed}`);
    if (libs.animate.delay) classes.push(`animate__delay-${libs.animate.delay}s`);
    classes.push(libs.animate.repeat === 0 ? "animate__infinite" : libs.animate.repeat > 1 ? `animate__repeat-${libs.animate.repeat}` : "");
  }
  if (libs.tilt && installed.includes("tilt")) {
    attrs["data-tilt"] = "";
    attrs["data-tilt-max"] = String(libs.tilt.max);
    if (libs.tilt.scale !== 1) attrs["data-tilt-scale"] = String(libs.tilt.scale);
    if (libs.tilt.glare) {
      attrs["data-tilt-glare"] = "true";
      attrs["data-tilt-max-glare"] = "0.3";
    }
  }
  if (libs.scroll && installed.includes("scroll")) {
    attrs["data-scroll"] = libs.scroll.effect;
    if (libs.scroll.amount) attrs["data-scroll-amount"] = String(libs.scroll.amount);
    if (libs.scroll.delay) attrs["data-scroll-delay"] = String(libs.scroll.delay);
  }
  return { attrs, classes: classes.filter(Boolean) };
}

/** Libraries used by any node in the tree (for the template content list). */
export function librariesInTree(root: { libraries?: LibraryId[] }): LibraryId[] {
  return root.libraries ? LIBRARY_IDS.filter((id) => root.libraries!.includes(id)) : [];
}

/* ------------------------------------------------------------------ */
/* Keluaran HTML                                                        */
/* ------------------------------------------------------------------ */

/** <link> tags for <head>. */
const usesMotion = (ids: readonly LibraryId[]) => ids.some((id) => LIBRARY_BY_ID[id]?.builtin && id !== "scroll");
/** v26: the OWD Scroll runtime (separate from OWD Motion so old templates do not get heavier). */
const usesScroll = (ids: readonly LibraryId[]) => ids.includes("scroll");

/** Tags for <head>. Scripts marked `defer` do not block rendering (Chart.js). */
export function libraryHead(ids: readonly LibraryId[]): string {
  const libs = ids.map((id) => LIBRARY_BY_ID[id]);
  return [
    ...(usesMotion(ids) ? [MOTION_HEAD_FLAG, `<style>${MOTION_CSS}</style>`] : []),
    ...(usesScroll(ids) ? [`<style id="owds-css">${SCROLL_CSS}</style>`] : []),
    ...libs.filter((l) => l.css).map((l) => `<link rel="stylesheet" href="${l.css}" />`),
    ...libs.filter((l) => l.js && l.headScript).map((l) => `<script${l.defer ? " defer" : ""} src="${l.js}"></script>`),
  ].join("\n");
}

/** <script> tags at the end of <body> WITHOUT the init line (OWD Motion runtime + non-head CDN scripts). */
export function libraryTailTags(ids: readonly LibraryId[]): string {
  const libs = ids.map((id) => LIBRARY_BY_ID[id]);
  return [
    ...(usesMotion(ids) ? [`<script>\n${MOTION_JS}\n</script>`] : []),
    ...(usesScroll(ids) ? [`<script>\n${SCROLL_JS}\n</script>`] : []),
    ...libs.filter((l) => l.js && !l.headScript).map((l) => `<script src="${l.js}"></script>`),
  ].join("\n");
}

/** <script> tags (except `headScript`) + initialization for the end of <body>. */
export function libraryScripts(ids: readonly LibraryId[]): string {
  const libs = ids.map((id) => LIBRARY_BY_ID[id]);
  const tags = libraryTailTags(ids);
  // The OWD Motion runtime initializes itself; init is only for CDN libraries.
  const init = [...new Set(libs.filter((l) => !l.builtin).map((l) => l.init).filter(Boolean))];
  const initTag = init.length ? `<script>\n  ${init.join("\n  ")}\n</script>` : "";
  return [tags, initTag].filter(Boolean).join("\n");
}

/** Runtime CSS/JS for the iframe preview (data URL, no CDN). */
export const MOTION_PREVIEW = {
  css: `data:text/css;charset=utf-8,${encodeURIComponent(MOTION_CSS)}`,
  js: `data:text/javascript;charset=utf-8,${encodeURIComponent(MOTION_JS)}`,
};
export const SCROLL_PREVIEW = {
  css: `data:text/css;charset=utf-8,${encodeURIComponent(SCROLL_CSS)}`,
  js: `data:text/javascript;charset=utf-8,${encodeURIComponent(SCROLL_JS)}`,
};
export { usesMotion, usesScroll, SCROLL_CSS, SCROLL_JS };

/** Installation notes for framework projects (README). */
export function libraryReadme(ids: readonly LibraryId[]): string {
  if (!ids.length) return "";
  const libs = ids.map((id) => LIBRARY_BY_ID[id]);
  const esm = libs.filter((l) => l.esm);
  const tagIds = ids.filter((id) => !LIBRARY_BY_ID[id].esm && !LIBRARY_BY_ID[id].builtin);
  const motion = libs.filter((l) => l.builtin && l.id !== "scroll");
  const motionNote = motion.length
    ? `
Efek ${motion.map((l) => l.name).join(", ")} dijalankan **OWD Motion**, runtime kecil tanpa CDN yang sudah ditanam di HTML ekspor website (\`<style>\` di <head> dan \`<script>\` sebelum </body>). Untuk komponen lepas, sertakan \`owd-motion.css\` dan \`owd-motion.js\` (ikut di unduhan), lalu panggil \`OWDMotion.init()\` setelah komponen dirender. Atribut \`data-aos\`, class \`animate__*\`, dan \`data-tilt\` sama dengan library aslinya. Konten tetap terlihat bila JavaScript mati, dan animasi otomatis mati untuk pengguna yang memilih "kurangi gerakan".
`
    : "";
  const scrollNote = usesScroll(ids)
    ? `
Efek scroll (\`data-scroll\`: split, rise, mask, parallax, scale, scrub-x, pin, counter, marquee) dijalankan **OWD Scroll**, runtime kecil tanpa library yang ditanam di HTML ekspor. Untuk komponen lepas, sertakan \`owd-scroll.css\` dan \`owd-scroll.js\` (ikut di unduhan), lalu panggil \`OWDScroll.init()\` setelah komponen dirender. Konten tetap terlihat bila JavaScript mati, efek mati untuk "kurangi gerakan", dan efek pin/scroll horizontal hanya aktif di layar 768px ke atas.
`
    : "";
  const esmNote = (esm.length
    ? `
${esm.map((l) => `**${l.name}** tidak perlu tag <script>: runtime elemen 3D (\`owd3d.js\`) memuatnya dengan \`import("${l.esm}")\` hanya saat elemen 3D mendekati layar, dan menampilkan gambar statis bila WebGL tidak tersedia. Untuk memakai paket npm sendiri, pasang \`npm i ${l.npm}\` lalu set \`window.__owdThree = import("three")\` sebelum komponen dirender.`).join("\n")}
`
    : "") + motionNote + scrollNote;
  if (!tagIds.length) return `## Library

${libs.map((l) => `- **${l.name} ${l.version}** (${l.license})${l.homepage ? ` — ${l.homepage}` : ""}`).join("\n")}
${esmNote}`;
  return `## Library (CDN)

${libs.map((l) => `- **${l.name} ${l.version}** (${l.license})${l.homepage ? ` — ${l.homepage}` : ""}`).join("\n")}

Tempel di \`index.html\` proyek Anda:

\`\`\`html
<!-- inside <head> -->
${libraryHead(tagIds) || "<!-- (no CSS) -->"}

<!-- before </body> -->
${libraryScripts(tagIds) || "<!-- (no JS) -->"}
\`\`\`

Atau pasang lewat npm: \`npm i ${tagIds.map((id) => LIBRARY_BY_ID[id].npm).join(" ")}\`.
${esmNote}

Pada aplikasi satu halaman (SPA), jalankan ulang baris inisialisasi di atas setelah komponen dirender (mis. di \`useEffect\`, \`onMounted\`, \`onMount\`, atau \`ngAfterViewInit\`) agar elemen baru ikut beranimasi.
`;
}
