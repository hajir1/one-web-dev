import { dataBlock, doc, esc, oh, ot, type ThemeVar } from "./shared";
import { BOOT, fontLink, CDNS, LENIS_STYLE, LIB_IMPORTS, PRELOAD } from "./web3d";
import { MOTION_JS } from "./motion3d";
import { SCRUB_JS } from "./scrub";

/* ================================================================== */
/* 3D SCROLL STORIES (v22): one visual story per template.               */
/*                                                                    */
/* Unlike 3D Motion v18 (one object + a code bio), here                 */
/* each template has its own SCENE that changes shape following        */
/* the scroll: an empty computer zoomed in until text comes out of its screen, */
/* a cat's eye zoomed in to reveal a universe, a hammer that            */
/* summons bricks until they become a house, and so on.                 */
/*                                                                    */
/* - three.js  : procedural scenes (no external models/textures).        */
/* - OWD Scrub : men-scrub keadaan adegan (KEYS) per babak  */
/*               and scroll-bound text effects (typing, sweep, zoom).   */
/* - Motion    : text per word/letter, staggered cards, numbers, buttons. */
/* - Lenis     : smooth scrolling.                                      */
/*                                                                    */
/* Each act (a data-act section) has one state in KEYS: position        */
/* camera + story values (e.g. build 0..1, zoom, veil). Scenes read      */
/* those values every frame, so the story can play forward and backward. */
/* Fallback: no WebGL → a gradient background; no Scrub → the state jumps */
/* per act; reduce motion → no animation, all text shown.              */
/* ================================================================== */

const path = (u: string) => u.slice(CDNS[0].length);

export type Fx = "rise" | "chars" | "type" | "zoom" | "wipe" | "slide" | "flip";

export interface StoryAct {
  id: string;
  nav?: string;
  kind: "hero" | "text" | "cards" | "stats" | "quote" | "contact";
  side: "left" | "right" | "center";
  fx: Fx;
  kicker?: string;
  title: string;
  body?: string[];
  cards?: { tag?: string; title: string; text: string }[];
  stats?: [string, string][];
  cta?: { label: string; href: string; ghost?: boolean }[];
  /** Act height (vh). Default 150. */
  vh?: number;
  /** Scene state in this act (unmentioned values carry over from the previous act). cam/look = [x,y,z]; others are numbers. */
  key: Record<string, number | number[]>;
}

export interface StorySpec {
  id: string;
  title: string;
  description: string;
  brand: string;
  footer: string;
  font: { display: string; text: string; href: string };
  colors: { bg: string; bg2: string; panel: string; ink: string; inkSoft: string; accent: string; accent2: string; line: string; obj: string; obj2: string; veil: string; dark: boolean };
  config: Record<string, unknown>;
  configLabel: string;
  /** Act for the thumbnail (default 0). */
  thumb?: number;
  /** Kode adegan: function scene(ctx) { ...; return { update(S, t, dt) } } */
  scene: string;
  acts: StoryAct[];
  email: string;
  wa: string;
}

/* ------------------------------- CSS ------------------------------- */

function css(s: StorySpec): string {
  return `
:root { --font-display: "${s.font.display}", system-ui, sans-serif; --font-text: "${s.font.text}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; --pad: clamp(18px, 4vw, 56px); }
* { box-sizing: border-box; }
html { background: var(--bg); color-scheme: ${s.colors.dark ? "dark" : "light"}; }
body { margin: 0; background: var(--bg); color: var(--ink); font: 17px/1.62 var(--font-text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
a { color: inherit; }
.skip { position: absolute; left: -999px; top: 8px; z-index: 60; padding: 10px 14px; border-radius: 8px; background: var(--accent); color: var(--on-accent); }
.skip:focus { left: 8px; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

#gl { position: fixed; inset: 0; z-index: 0; width: 100vw; height: 100vh; display: block; opacity: 0; transition: opacity 1s; pointer-events: none; }
html.webgl #gl { opacity: 1; }
/* Color curtain: used when the camera "enters" the object (screen, eye, cup), then the text appears from there. */
#veil { position: fixed; inset: 0; z-index: 1; background: var(--veil); opacity: 0; pointer-events: none; }
.loader { position: fixed; left: 20px; bottom: 20px; z-index: 40; display: none; align-items: center; gap: 10px; padding: 8px 16px 8px 10px; border-radius: 999px; background: var(--panel); color: var(--ink-soft); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; pointer-events: none; }
html.loading .loader { display: flex; }
.loader i { display: block; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--line); border-top-color: var(--accent); animation: rot .9s linear infinite; }
@keyframes rot { to { transform: rotate(360deg); } }

.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 30; display: flex; align-items: center; gap: 16px; padding: 14px var(--pad); background: color-mix(in srgb, var(--bg) 50%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 18px; text-decoration: none; letter-spacing: -.01em; }
.nav ul { display: flex; gap: 2px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 999px; text-decoration: none; font-size: 14px; color: var(--ink-soft); transition: color .2s, background .2s; }
.nav ul a:hover, .nav ul a.active { color: var(--ink); background: color-mix(in srgb, var(--ink) 9%, transparent); }
.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: color-mix(in srgb, var(--ink) 8%, transparent); }
.progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transform-origin: 0 50%; transform: scaleX(0); }

main { position: relative; z-index: 2; }
.act { position: relative; display: flex; align-items: flex-start; min-height: var(--h, 160vh); padding: 14vh var(--pad) 4vh; }
.act.k-hero { min-height: 100vh; align-items: center; }
.act > .inner { position: sticky; top: 12vh; width: 100%; display: flex; }
.k-quote > .inner { top: 30vh; }
.s-left > .inner { justify-content: flex-start; }
.s-right > .inner { justify-content: flex-end; }
.s-center > .inner { justify-content: center; text-align: center; }
.panel { position: relative; width: min(100%, 31rem); padding: clamp(22px, 3vw, 34px); border-radius: 24px; background: color-mix(in srgb, var(--panel) 76%, transparent); border: 1px solid var(--line); backdrop-filter: blur(14px) saturate(1.2); -webkit-backdrop-filter: blur(14px) saturate(1.2); box-shadow: 0 30px 60px -40px rgba(0,0,0,.55); }
.k-hero .panel, .k-quote .panel { width: min(100%, 44rem); padding: 0; background: none; border: 0; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
.kicker { margin: 0 0 12px; font-size: 13px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
h1, h2 { margin: 0 0 16px; font-family: var(--font-display); font-weight: 700; letter-spacing: -.03em; line-height: 1.03; }
h1 { font-size: clamp(44px, 7vw, 100px); }
h2 { font-size: clamp(30px, 4.2vw, 56px); }
.k-quote h2 { font-size: clamp(32px, 5vw, 72px); line-height: 1.08; }
.panel p { margin: 0 0 12px; color: var(--ink-soft); }
.lead { font-size: clamp(17px, 1.5vw, 20px); max-width: 46ch; }
.s-center .lead { margin-left: auto; margin-right: auto; }
.w, .c { display: inline-block; }
.wd { display: inline-block; white-space: nowrap; }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
.s-center .ctas { justify-content: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: var(--accent); color: var(--on-accent); font-weight: 600; text-decoration: none; border: 0; }
.btn.ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
.hint { position: absolute; left: 50%; bottom: 4vh; transform: translateX(-50%); display: grid; justify-items: center; gap: 8px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); text-decoration: none; }
.hint span { display: block; width: 22px; height: 36px; border-radius: 12px; border: 1.5px solid var(--ink-soft); position: relative; }
.hint span::after { content: ""; position: absolute; left: 50%; top: 7px; width: 3px; height: 7px; margin-left: -1.5px; border-radius: 2px; background: var(--accent); animation: wheel 1.6s ease-in-out infinite; }
@keyframes wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }
.cards { display: grid; gap: 12px; margin: 20px 0 0; padding: 0; list-style: none; }
.cards li { padding: 16px 18px; border-radius: 16px; background: color-mix(in srgb, var(--ink) 5%, transparent); border: 1px solid var(--line); text-align: left; }
.cards b { display: block; font-family: var(--font-display); font-size: 19px; }
.cards span { display: block; font-size: 15px; color: var(--ink-soft); }
.cards small { display: inline-block; margin-bottom: 6px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: var(--on-accent); background: var(--accent); }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 20px 0 0; }
.stats div { padding: 16px 4px; border-radius: 16px; border: 1px solid var(--line); text-align: center; }
.stats dt { font-family: var(--font-display); font-weight: 700; font-size: clamp(18px, 1.9vw, 30px); white-space: nowrap; line-height: 1.05; color: var(--accent); font-variant-numeric: tabular-nums; }
.stats dd { margin: 6px 0 0; font-size: 13px; color: var(--ink-soft); }
.mail { display: inline-block; margin: 6px 0 4px; font-family: var(--font-display); font-size: clamp(22px, 3vw, 32px); color: var(--accent); word-break: break-word; text-underline-offset: 6px; }
footer { position: relative; z-index: 2; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding: 28px var(--pad) 40px; font-size: 14px; color: var(--ink-soft); border-top: 1px solid var(--line); background: color-mix(in srgb, var(--bg) 82%, transparent); }

html.no-webgl body { background: radial-gradient(90% 70% at 70% 30%, color-mix(in srgb, var(--accent) 26%, var(--bg-2)), var(--bg) 70%) fixed; }
html.no-webgl #gl, html.no-webgl #veil { display: none; }

@media (max-width: 820px) {
  .nav ul { display: none; }
  .act { align-items: flex-end; padding: 50vh 16px 10vh; }
  .act.k-hero { align-items: flex-end; padding-top: 54vh; padding-bottom: 8vh; }
  .act > .inner { top: auto; bottom: 6vh; }
  .s-left > .inner, .s-right > .inner { justify-content: center; }
  .panel { width: 100%; }
  h1 { font-size: clamp(38px, 11vw, 52px); }
  .stats dd { font-size: 12px; }
  .k-hero .hint { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  #gl { transition: none; }
  .hint span::after, .loader i { animation: none; }
}
`;
}

/* ------------------------------- mesin ----------------------------- */

const ENGINE = String.raw`
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
/* OWD Scrub: OneWebDev's built-in scroll engine (API similar to GSAP + ScrollTrigger). */
const G = window.OWDScrub, ST = G && G.ScrollTrigger, M = window.Motion;
const hasG = !!(G && ST);
const cssv = (n) => getComputedStyle(root).getPropertyValue(n).trim();
const COL = { bg: cssv("--bg"), bg2: cssv("--bg-2"), ink: cssv("--ink"), accent: cssv("--accent"), accent2: cssv("--accent-2"), obj: cssv("--obj"), obj2: cssv("--obj-2"), veil: cssv("--veil"), panel: cssv("--panel") };
const acts = Array.prototype.slice.call(document.querySelectorAll("[data-act]"));
const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav ul a"));
const veil = document.getElementById("veil");
/* Current story state (tweened by OWD Scrub between KEYS). */
const S = Object.assign({}, KEYS[0]);
const animated = !reduce && hasG && !!M;

/* 1) Text: split into words / letters. */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.textContent = "";
  words.forEach((w, i) => { const s = document.createElement("span"); s.className = "w"; s.setAttribute("aria-hidden", "true"); s.textContent = w; el.appendChild(s); if (i < words.length - 1) el.appendChild(document.createTextNode(" ")); });
  return Array.prototype.slice.call(el.querySelectorAll(".w"));
}
function splitChars(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.textContent = "";
  words.forEach((w, i) => {
    const wd = document.createElement("span"); wd.className = "wd"; wd.setAttribute("aria-hidden", "true");
    Array.from(w).forEach((ch) => { const c = document.createElement("span"); c.className = "c"; c.textContent = ch; wd.appendChild(c); });
    el.appendChild(wd); if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
  });
  return Array.prototype.slice.call(el.querySelectorAll(".c"));
}

/* 2) Smooth scrolling + progress + scene state per act. */
let lenis = null;
if (hasG) G.registerPlugin(ST);
function setNav(i) { navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + acts[i].id)); }
if (animated) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ST.update);
  G.ticker.add((time) => lenis.raf(time * 1000));
  G.ticker.lagSmoothing(0);
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    const el = a && document.getElementById(a.getAttribute("href").slice(1));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: 0, duration: 1.6 });
  });
  G.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  /* The state of act i is reached as act i rises from the bottom of the screen to 20% from the top. */
  for (let i = 1; i < acts.length; i++) {
    G.timeline({ scrollTrigger: { trigger: acts[i], start: "top bottom", end: "top 20%", scrub: 1 } })
      .fromTo(S, Object.assign({}, KEYS[i - 1]), Object.assign({}, KEYS[i], { ease: "none", immediateRender: false }));
  }
  acts.forEach((sec, i) => ST.create({ trigger: sec, start: "top 55%", end: "bottom 55%", onToggle: (st) => { if (st.isActive) setNav(i); } }));
} else if ("IntersectionObserver" in window) {
  /* No scroll engine / reduced motion: the state jumps to the act being read. */
  const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) { const i = acts.indexOf(e.target); Object.assign(S, KEYS[i]); setNav(i); } }), { rootMargin: "-50% 0px -50% 0px" });
  acts.forEach((s) => io.observe(s));
}

/* 3) Text effects per act (data-fx). */
if (animated) {
  const { animate, inView, stagger } = M;
  const ease = [0.2, 0.7, 0.2, 1];
  acts.forEach((sec) => {
    const fx = sec.getAttribute("data-fx"), panel = sec.querySelector(".panel"), head = sec.querySelector("h1, h2");
    if (!panel || !head) return;
    const rest = Array.prototype.slice.call(panel.querySelectorAll(".kicker, p, .ctas, .cards, .stats, .mail"));
    rest.forEach((el) => { el.style.opacity = "0"; });
    const showRest = (d) => animate(rest, { opacity: [0, 1], y: [18, 0] }, { delay: stagger(0.08, { startDelay: d || 0 }), duration: 0.7, ease });
    if (fx === "rise") {
      const w = splitWords(head); w.forEach((x) => { x.style.opacity = "0"; });
      inView(sec, () => { animate(w, { opacity: [0, 1], y: [44, 0], rotate: [5, 0] }, { delay: stagger(0.06), duration: 0.9, ease }); showRest(0.3); }, { amount: 0.25 });
    } else if (fx === "chars") {
      const c = splitChars(head); c.forEach((x) => { x.style.opacity = "0"; });
      inView(sec, () => { animate(c, { opacity: [0, 1], y: [-30, 0], rotate: [-14, 0] }, { delay: stagger(0.02), duration: 0.55, ease }); showRest(0.4); }, { amount: 0.25 });
    } else if (fx === "type") {
      /* Typing with the scroll (as if coming out of the screen). */
      const c = splitChars(head); c.forEach((x) => { x.style.opacity = "0"; });
      let shown = -1;
      ST.create({ trigger: sec, start: "top 70%", end: "top 15%", scrub: true, onUpdate: (st) => { const n = Math.round(st.progress * c.length); if (n === shown) return; shown = n; c.forEach((x, k) => { x.style.opacity = k < n ? "1" : "0"; }); } });
      inView(head, () => showRest(0.2), { amount: 0.9 });
    } else if (fx === "zoom") {
      /* The panel grows from the center of the screen (from inside the object). */
      G.fromTo(panel, { scale: 0.18, opacity: 0, transformOrigin: "50% 50%" }, { scale: 1, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: sec, start: "top 85%", end: "top 25%", scrub: true } });
      rest.forEach((el) => { el.style.opacity = ""; });
    } else if (fx === "wipe") {
      G.fromTo(head, { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", ease: "none", scrollTrigger: { trigger: sec, start: "top 75%", end: "top 30%", scrub: true } });
      inView(sec, () => showRest(0.3), { amount: 0.3 });
    } else if (fx === "slide") {
      const dir = sec.classList.contains("s-right") ? 1 : -1;
      G.fromTo(panel, { x: dir * 160, opacity: 0 }, { x: 0, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 80%", end: "top 35%", scrub: true } });
      rest.forEach((el) => { el.style.opacity = ""; });
    } else if (fx === "flip") {
      panel.style.opacity = "0";
      inView(sec, () => { animate(panel, { opacity: [0, 1], rotateX: [65, 0], y: [60, 0] }, { duration: 1, ease }); showRest(0.35); }, { amount: 0.25 });
    }
  });
  document.querySelectorAll("[data-stagger]").forEach((el) => {
    const kids = Array.prototype.slice.call(el.children);
    kids.forEach((k) => { k.style.opacity = "0"; });
    inView(el, () => { animate(kids, { opacity: [0, 1], y: [26, 0], scale: [0.95, 1] }, { delay: stagger(0.1, { startDelay: 0.3 }), duration: 0.7, ease }); }, { amount: 0.2 });
  });
  document.querySelectorAll("[data-count]").forEach((el) => {
    const m = /^(\D*)(\d+(?:[.,]\d+)?)(.*)$/.exec(el.textContent.trim());
    if (!m) return;
    const target = parseFloat(m[2].replace(",", ".")), dec = (m[2].split(/[.,]/)[1] || "").length, sep = m[2].indexOf(",") >= 0 ? "," : ".";
    inView(el, () => { animate(0, target, { duration: 1.8, ease, onUpdate: (v) => { el.textContent = m[1] + v.toFixed(dec).replace(".", sep) + m[3]; } }); }, { amount: 0.6 });
  });
  if (matchMedia("(pointer: fine)").matches) document.querySelectorAll(".btn").forEach((b) => {
    b.addEventListener("pointermove", (e) => { const r = b.getBoundingClientRect(); animate(b, { x: (e.clientX - r.left - r.width / 2) * 0.22, y: (e.clientY - r.top - r.height / 2) * 0.3 }, { type: "spring", stiffness: 320, damping: 18 }); });
    b.addEventListener("pointerleave", () => { animate(b, { x: 0, y: 0 }, { type: "spring", stiffness: 260, damping: 14 }); });
  });
}

/* 4) Three.js */
function fail(reason) { root.classList.add("no-webgl"); root.classList.remove("loading"); console.warn("[owd] 3D tidak aktif:", reason); }
function hasWebGL() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; } }
const canvas = document.getElementById("gl");
if (!hasWebGL()) fail("WebGL tidak tersedia");
else { try { start(); } catch (e) { fail(e && e.message ? e.message : String(e)); } }

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(COL.bg, 18, 60);
  const camera = new THREE.PerspectiveCamera(38, 1, 0.04, 200);
  const look = new THREE.Vector3();
  const hemi = new THREE.HemisphereLight(0xffffff, COL.bg2 || 0x222233, 1.1); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.3); key.position.set(4, 8, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(COL.accent, 2.2); rim.position.set(-6, 3, -5); scene.add(rim);

  /* Scene helpers. */
  const textures = [];
  function glow() {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.35)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); textures.push(t); return t;
  }
  /* Canvases that can be redrawn (screen, map, labels). */
  function paint(w, h, draw) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const g = c.getContext("2d"), tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4; textures.push(tex);
    const o = { c, g, tex, w, h, draw: (fn) => { (fn || draw)(g, w, h); tex.needsUpdate = true; } };
    if (draw) o.draw();
    return o;
  }
  const mat = (color, o) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: 0.55, metalness: 0.05 }, o || {}));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  /* Progress slice: 0 before a, 1 after b, smooth in between. */
  const seg = (v, a, b) => { const x = clamp((v - a) / (b - a), 0, 1); return x * x * (3 - 2 * x); };
  const lerp = (a, b, k) => a + (b - a) * k;
  let seed = 7;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const ctx = { THREE, scene, camera, renderer, COL, CONFIG, BRAND, glow, paint, mat, clamp, seg, lerp, rnd, key, rim, hemi, reduce };
  const api = scene_(ctx) || {};

  const tris = (() => { let n = 0; scene.traverse((o) => { if (o.isMesh) { const gg = o.geometry; n += ((gg.index ? gg.index.count : gg.attributes.position.count) / 3) * (o.isInstancedMesh ? o.count : 1); } }); return Math.round(n); })();
  window.__OWD_STATS = { triangles: tris, budget: 50000, contexts: 1 };

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; }, { passive: true });
  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize); resize();
  let visible = true;
  const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; });
  io.observe(canvas);

  /* Camera from the state: cam (position) & look (look-at point). Narrow screens: pull back & center. */
  function applyCamera() {
    const narrow = camera.aspect < 0.9, k = narrow ? Math.pow(0.9 / camera.aspect, 0.8) : 1;
    const lx = S.lx * (narrow ? 0.15 : 1);
    look.set(lx, S.ly, S.lz);
    camera.position.set(lx + (S.cx - S.lx) * k, S.ly + (S.cy - S.ly) * k, S.lz + (S.cz - S.lz) * k);
    camera.position.x += pointer.x * S.sway; camera.position.y -= pointer.y * S.sway * 0.6;
    camera.lookAt(look);
    if (S.roll) camera.rotateZ(S.roll);
    if (S.fov && S.fov !== camera.fov) { camera.fov = S.fov; camera.updateProjectionMatrix(); }
  }
  function sync() { if (veil) veil.style.opacity = String(clamp(S.veil || 0, 0, 1)); }

  const clock = new THREE.Clock();
  let raf = 0, first = true, frames = 0, slow = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3); pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    applyCamera(); sync();
    if (api.update) api.update(S, reduce ? 1 : t, reduce ? 0 : dt);
    renderer.render(scene, camera);
    if (first) { first = false; root.classList.add("webgl"); root.classList.remove("loading"); }
    frames++; if (dt > 0.022) slow++;
    if (frames === 90) { if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); } frames = 0; slow = 0; }
  }
  if (window.OWD_THUMB) { Object.assign(S, KEYS[THUMB]); applyCamera(); sync(); for (let i = 0; i < 3; i++) if (api.update) api.update(S, 1.5 + i * 0.016, 0.016); renderer.render(scene, camera); root.classList.add("webgl"); root.classList.remove("loading"); return; }
  raf = requestAnimationFrame(frame);

  function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (hasG) ST.getAll().forEach((s) => s.kill());
    if (lenis) lenis.destroy();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((x) => x.dispose());
    });
    textures.forEach((x) => x.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }
  addEventListener("pagehide", dispose, { once: true });
}
`;

/* ------------------------------- HTML ------------------------------ */

function actHtml(s: StorySpec, a: StoryAct, i: number): string {
  const k = (x: string) => `${a.id}-${x}`;
  const H = a.kind === "hero" ? "h1" : "h2";
  const head = `${a.kicker ? `<p class="kicker"${ot(k("kicker"), `Babak ${i + 1}: label kecil`)}>${esc(a.kicker)}</p>` : ""}<${H} id="${a.id}-t"${ot(k("judul"), `Babak ${i + 1}: judul`)}>${esc(a.title)}</${H}>`;
  const body = (a.body ?? []).map((p, j) => `<p class="${j === 0 ? "lead" : ""}"${ot(k(`teks${j + 1}`), `Babak ${i + 1}: paragraf ${j + 1}`, true)}>${esc(p)}</p>`).join("");
  let extra = "";
  if (a.kind === "cards" && a.cards)
    extra = `<ul class="cards" data-stagger>${a.cards.map((c, j) => `<li>${c.tag ? `<small${ot(k(`tag${j + 1}`), `Kartu ${j + 1}: label`)}>${esc(c.tag)}</small>` : ""}<b${ot(k(`kartu${j + 1}`), `Kartu ${j + 1}: judul`)}>${esc(c.title)}</b><span${ot(k(`isi${j + 1}`), `Kartu ${j + 1}: isi`, true)}>${esc(c.text)}</span></li>`).join("")}</ul>`;
  if (a.kind === "stats" && a.stats)
    extra = `<dl class="stats">${a.stats.map(([v, l], j) => `<div><dt data-count${ot(k(`angka${j + 1}`), `Angka ${j + 1}`)}>${esc(v)}</dt><dd${ot(k(`label${j + 1}`), `Label angka ${j + 1}`)}>${esc(l)}</dd></div>`).join("")}</dl>`;
  if (a.kind === "contact")
    extra = `<a class="mail" href="mailto:${s.email}"${oh("email", "Alamat email")}${ot("emailTeks", "Teks email")}>${esc(s.email)}</a>`;
  const ctas = a.cta?.length
    ? `<div class="ctas">${a.cta
        .map((c, j) => {
          const href = c.href === "wa" ? `https://wa.me/${s.wa}?text=${encodeURIComponent(`Halo ${s.brand}, saya ingin bertanya.`)}` : c.href;
          const link = c.href === "wa" ? oh("whatsapp", "Tautan WhatsApp") : "";
          return `<a class="btn${c.ghost ? " ghost" : ""}" href="${esc(href)}"${c.href === "wa" ? ' target="_blank" rel="noopener"' : ""}${link}${ot(k(`tombol${j + 1}`), `Babak ${i + 1}: tombol ${j + 1}`)}>${esc(c.label)}</a>`;
        })
        .join("")}</div>`
    : "";
  const hint = a.kind === "hero" ? `<a class="hint" href="#${s.acts[1].id}" aria-label="Gulir ke bawah"><span></span>Gulir</a>` : "";
  return `<section class="act k-${a.kind} s-${a.side}" id="${a.id}" data-act data-fx="${a.fx}" aria-labelledby="${a.id}-t"${a.vh && a.kind !== "hero" ? ` style="--h:${a.vh}vh"` : ""}>
  <div class="inner"><div class="panel">${head}${body}${extra}${ctas}</div></div>${hint}
</section>`;
}

/** Flat KEYS: every act carries every value (unmentioned values carry over from the previous act). */
export function flatKeys(s: StorySpec) {
  const r = (v: number) => Math.round(v * 1000) / 1000;
  /* Values first mentioned in a later act: earlier acts use that first value (the scrub engine needs every key). */
  const first: Record<string, number | number[]> = { veil: 0, sway: 0.4 };
  for (const a of s.acts) for (const [n, v] of Object.entries(a.key)) if (!(n in first)) first[n] = v;
  let prev: Record<string, number | number[]> = first;
  return s.acts.map((a) => {
    const k = { ...prev, ...a.key };
    prev = k;
    const out: Record<string, number> = {};
    for (const [n, v] of Object.entries(k)) {
      if (n === "cam" || n === "look") (v as number[]).forEach((x, j) => (out[(n === "cam" ? "c" : "l") + "xyz"[j]] = r(x)));
      else out[n] = r(v as number);
    }
    return out;
  });
}

function vars(s: StorySpec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--bg", value: c.bg, label: "Latar halaman" },
    { name: "--bg-2", value: c.bg2, label: "Latar kedua (cahaya)" },
    { name: "--panel", value: c.panel, label: "Latar panel teks" },
    { name: "--ink", value: c.ink, label: "Teks utama" },
    { name: "--ink-soft", value: c.inkSoft, label: "Teks sekunder" },
    { name: "--accent", value: c.accent, label: "Warna aksen" },
    { name: "--accent-2", value: c.accent2, label: "Warna aksen kedua" },
    { name: "--line", value: c.line, label: "Garis" },
    { name: "--on-accent", value: c.dark ? "#0b0b0b" : "#ffffff", label: "Teks di tombol aksen" },
    { name: "--obj", value: c.obj, label: "Warna objek 3D" },
    { name: "--obj-2", value: c.obj2, label: "Warna objek 3D kedua" },
    { name: "--veil", value: c.veil, label: "Warna saat kamera masuk ke objek" },
  ];
}

export function buildStory(s: StorySpec): string {
  const menu = s.acts.filter((a) => a.nav);
  const body = `
<a class="skip" href="#konten">Lewati ke konten</a>
<canvas id="gl" aria-hidden="true"></canvas>
<div id="veil" aria-hidden="true"></div>
<div class="loader" aria-hidden="true"><i></i>Memuat</div>
<header class="nav">
  <a class="brand" href="#${s.acts[0].id}"${ot("merek", "Nama merek")}>${esc(s.brand)}</a>
  <nav aria-label="Navigasi utama"><ul>${menu.map((a, j) => `<li><a href="#${a.id}"${ot(`menu${j + 1}`, `Menu ${j + 1}`)}>${esc(a.nav!)}</a></li>`).join("")}</ul></nav>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<main id="konten">
${s.acts.map((a, i) => actHtml(s, a, i)).join("\n")}
</main>
<footer><span${ot("merek", "Nama merek")}>${esc(s.brand)}</span><span${ot("catatanKaki", "Catatan kaki")}>${esc(s.footer)}</span></footer>
<script type="module">
${LIB_IMPORTS}
/* Motion (classic script); scroll animation uses the built-in OWD Scrub (no CDN). If it fails, the page still works. */
await umd(${JSON.stringify(path(MOTION_JS))}).catch((e) => console.warn("[owd] Animasi scroll tidak aktif:", e));

/* ==== TEXT INSIDE THE 3D SCENE: edit here (or in the OneWebDev editor) ==== */
const CONFIG = ${dataBlock("CONFIG", s.configLabel, s.config)};
/* ============================================================================ */
const BRAND = ((document.querySelector(".nav .brand") || {}).textContent || "").trim() || ${JSON.stringify(s.brand)};
/* Scene state per act (same order as the data-act sections). cam/look = camera. */
const KEYS = ${JSON.stringify(flatKeys(s))};
const THUMB = ${s.thumb ?? 0};

/* ---- 3D scene (procedural, no external models/textures) ---- */
${s.scene.trim().replace(/^function scene\(/, "function scene_(")}
${ENGINE.trim()}
</script>`;
  return doc({
    title: s.title,
    description: s.description,
    theme: s.colors.bg,
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
${fontLink(s.font.href)}
${LENIS_STYLE}
${PRELOAD}
<link rel="preload" as="fetch" href="${MOTION_JS}" crossorigin>
<script>${SCRUB_JS.trim()}</script>
${BOOT}`,
    vars: vars(s),
    css: css(s),
    body,
  });
}
