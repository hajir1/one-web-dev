import { dataBlock, doc, esc, oh, ot, type ThemeVar } from "./shared";
import { BOOT, fontLink, CDNS, LENIS_STYLE, LIB_IMPORTS, PRELOAD } from "./web3d";
import { MOTION_RENDER, motionApi } from "../../pages/webTemplates/codeTemplates/render/motionRender";
import { OBJECTS, type ObjectKind } from "./motionObjects";
import { MOTION_SPECS_DATA } from "./motionSpecs";
import { SCRUB_JS } from "./scrub";

/* ================================================================== */
/* Kategori 3D MOTION (v18): satu objek 3D yang "bercerita" saat scroll. */
/* Library: three (WebGL) + OWD Scrub (scroll) + Motion (teks,  */
/* angka, tombol) + Lenis (gulir halus), semuanya dari CDN, versi        */
/* dipatok.                                                            */
/*                                                                    */
/* Alur tiap template (contoh PC): objek kecil di hero → saat scroll     */
/* objek membesar dan layarnya MENGETIK biodata dalam bentuk kode →      */
/* objek bergeser dan kalimat muncul kata demi kata → kartu, angka,     */
/* kontak.                                                             */
/*                                                                    */
/* - Pose objek & kamera per bab (POSES) di-scrub OWD Scrub per section.     */
/* - Layar objek (PC, HP, laptop, halaman buku) = CanvasTexture yang     */
/*   digambar ulang: logo, kode biodata (diketik sesuai scroll), UI,    */
/*   atau teks.                                                        */
/* - Konten = HTML biasa di atas canvas; biodata kode dibuat dari        */
/*   CONFIG (bisa diedit tanpa kode).                                  */
/* - Fallback: tanpa WebGL → latar gradasi; tanpa Scrub/Motion → konten  */
/*   tetap tampil penuh; kurangi gerak → pose diam, teks langsung tampil.*/
/* - Anggaran: pixel ratio maks 2 (turun otomatis bila lambat), maks     */
/*   50.000 segitiga, satu konteks WebGL, dispose saat pagehide.         */
/* ================================================================== */

export const MOTION_JS = "https://cdn.jsdelivr.net/npm/motion@11.11.13/dist/motion.js";
/** Jalur paket tanpa alamat CDN (untuk pemuat dengan CDN cadangan). */
const path = (u: string) => u.slice(CDNS[0].length);

type V3 = [number, number, number];
export type ScreenMode = "logo" | "code" | "ui" | "text";

export interface Pose {
  cam: V3;
  look: V3;
  pos: V3;
  rot: V3;
  s: number;
  /** Nilai keadaan objek (mis. open, zoom, flame), 0..1. */
  st?: Record<string, number>;
  screen?: ScreenMode;
}

interface Cta {
  label: string;
  href: string;
  ghost?: boolean;
}

export interface Chapter {
  id: string;
  nav?: string;
  kind: "hero" | "code" | "text" | "cards" | "stats" | "contact";
  align: "left" | "right" | "center";
  kicker?: string;
  title: string;
  body?: string[];
  items?: { title: string; text: string; tag?: string }[];
  stats?: { value: string; label: string }[];
  cta?: Cta[];
  pose: Pose;
}

export interface MotionSpec {
  id: string;
  title: string;
  description: string;
  brand: string;
  object: ObjectKind;
  font: { display: string; text: string; href: string };
  colors: { bg: string; bg2: string; panel: string; ink: string; inkSoft: string; accent: string; accent2: string; line: string; obj: string; obj2: string; dark: boolean };
  /** Isi CONFIG: biodata kode + teks layar. */
  config: { komentar: string; variabel: string; bahasa: "js" | "py" | "json"; profil: Record<string, string | string[] | number | boolean>; layarTeks: string; layarSub: string };
  berkas: string;
  chapters: Chapter[];
  contact: { email: string; whatsapp: string; waText: string };
  footer: string;
}

/* ------------------------------- CSS ------------------------------- */

function css(s: MotionSpec): string {
  return `
:root {
  --font-display: "${s.font.display}", system-ui, sans-serif;
  --font-text: "${s.font.text}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --pad: clamp(18px, 5vw, 80px);
}
* { box-sizing: border-box; }
html { background: var(--bg); }
body { margin: 0; color: var(--ink); font: 17px/1.65 var(--font-text); -webkit-font-smoothing: antialiased; background: radial-gradient(120% 80% at 70% 0%, var(--bg-2), var(--bg) 60%) fixed; }
a { color: inherit; }
.skip { position: absolute; left: -999px; top: 8px; z-index: 60; padding: 10px 14px; border-radius: 8px; background: var(--accent); color: var(--bg); }
.skip:focus { left: 8px; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.sr { position: absolute !important; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

#gl { position: fixed; inset: 0; z-index: 0; width: 100vw; height: 100vh; display: block; opacity: 0; transition: opacity 1s; pointer-events: none; }
html.webgl #gl { opacity: 1; }
/* Loading: penanda kecil di bawah, konten tetap terbaca selama objek 3D dimuat (v19). */
.loader { position: fixed; left: 20px; bottom: 20px; z-index: 40; display: none; align-items: center; gap: 10px; padding: 8px 16px 8px 10px; border-radius: 999px; background: var(--panel); color: var(--ink-soft); font-size: 12px; letter-spacing: .14em; text-transform: uppercase; pointer-events: none; }
html.loading .loader { display: flex; }
.loader > div { display: flex; align-items: center; gap: 10px; }
.loader i { display: block; width: 18px; height: 18px; border-radius: 50%; border: 2px solid var(--line); border-top-color: var(--accent); animation: rot .9s linear infinite; }
@keyframes rot { to { transform: rotate(360deg); } }

/* Navigasi & progres */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 30; display: flex; align-items: center; gap: 16px; padding: 14px var(--pad); background: color-mix(in srgb, var(--bg) 55%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
.nav .brand { font-family: var(--font-display); font-weight: 700; font-size: 18px; text-decoration: none; letter-spacing: -.01em; }
.nav ul { display: flex; gap: 2px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; align-items: center; min-height: 40px; padding: 0 12px; border-radius: 999px; text-decoration: none; font-size: 14px; color: var(--ink-soft); transition: color .2s, background .2s; }
.nav ul a:hover, .nav ul a.active { color: var(--ink); background: color-mix(in srgb, var(--ink) 9%, transparent); }
.progress { position: absolute; left: 0; right: 0; bottom: 0; height: 2px; background: color-mix(in srgb, var(--ink) 8%, transparent); }
.progress i { display: block; height: 100%; background: linear-gradient(90deg, var(--accent), var(--accent-2)); transform-origin: 0 50%; transform: scaleX(0); }

/* Bab */
main { position: relative; z-index: 1; }
.ch { position: relative; display: flex; align-items: center; min-height: 125vh; padding: 14vh var(--pad); }
.ch.hero { min-height: 100vh; padding-top: 18vh; }
.a-left { justify-content: flex-start; }
.a-right { justify-content: flex-end; }
.a-center { justify-content: center; text-align: center; }
.panel { position: relative; width: min(100%, 33rem); padding: clamp(22px, 3vw, 34px); border-radius: 26px; background: color-mix(in srgb, var(--panel) 74%, transparent); border: 1px solid var(--line); backdrop-filter: blur(16px) saturate(1.2); -webkit-backdrop-filter: blur(16px) saturate(1.2); box-shadow: 0 30px 60px -40px rgba(0,0,0,.6); }
.hero .panel { width: min(100%, 40rem); padding: 0; background: none; border: 0; box-shadow: none; backdrop-filter: none; -webkit-backdrop-filter: none; }
.kicker { margin: 0 0 12px; font-size: 13px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--accent); }
h1, h2 { margin: 0 0 16px; font-family: var(--font-display); font-weight: 700; letter-spacing: -.03em; line-height: 1.02; }
h1 { font-size: clamp(46px, 7.4vw, 104px); }
h2 { font-size: clamp(32px, 4.4vw, 58px); }
.w { display: inline-block; will-change: transform, opacity; }
.panel p { margin: 0 0 12px; color: var(--ink-soft); }
.lead { font-size: clamp(17px, 1.5vw, 20px); max-width: 44ch; }
.a-center .lead { margin-left: auto; margin-right: auto; }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.a-center .ctas { justify-content: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 24px; border-radius: 999px; background: var(--accent); color: var(--on-accent); font-weight: 600; text-decoration: none; border: 0; }
.btn.ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
.scroll-hint { position: absolute; left: 50%; bottom: 4vh; transform: translateX(-50%); display: grid; justify-items: center; gap: 8px; font-size: 12px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-soft); text-decoration: none; }
.scroll-hint span { display: block; width: 22px; height: 36px; border-radius: 12px; border: 1.5px solid var(--ink-soft); position: relative; }
.scroll-hint span::after { content: ""; position: absolute; left: 50%; top: 7px; width: 3px; height: 7px; margin-left: -1.5px; border-radius: 2px; background: var(--accent); animation: wheel 1.6s ease-in-out infinite; }
@keyframes wheel { 0% { opacity: 0; transform: translateY(0); } 30% { opacity: 1; } 100% { opacity: 0; transform: translateY(12px); } }

/* Kode biodata */
.stack { display: grid; gap: 18px; width: min(100%, 36rem); }
.code-win { border-radius: 18px; overflow: hidden; background: #0b1020; color: #e8ecf8; border: 1px solid rgba(255,255,255,.08); box-shadow: 0 40px 80px -40px rgba(0,0,0,.8); }
.code-win .bar { display: flex; align-items: center; gap: 7px; padding: 12px 16px; background: rgba(255,255,255,.04); border-bottom: 1px solid rgba(255,255,255,.06); font: 13px var(--font-mono); color: #8f9bb3; }
.code-win .bar i { width: 11px; height: 11px; border-radius: 50%; background: #ff5f57; }
.code-win .bar i:nth-child(2) { background: #febc2e; }
.code-win .bar i:nth-child(3) { background: #28c840; margin-right: 8px; }
.code-win pre { margin: 0; padding: 18px 16px 22px; overflow-x: auto; font: 14px/1.7 var(--font-mono); counter-reset: ln; }
.ln { display: block; white-space: pre; }
.ln::before { counter-increment: ln; content: counter(ln); display: inline-block; width: 2.2ch; margin-right: 14px; text-align: right; color: #4b5575; }
.tk-kw { color: #c792ea; } .tk-var { color: #eef1ff; } .tk-key { color: var(--accent); } .tk-str { color: #c3e88d; } .tk-num { color: #f78c6c; } .tk-pun { color: #9aa4bf; } .tk-com { color: #7a83a6; font-style: italic; }
html.typing .ln { opacity: 0; transform: translateX(-6px); transition: opacity .25s, transform .25s; }
html.typing .ln.on { opacity: 1; transform: none; }
html.typing .ln.cur::after { content: ""; display: inline-block; width: .55em; height: 1.15em; margin-left: 2px; vertical-align: -.2em; background: var(--accent); animation: blink 1s steps(1) infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* Kalimat besar */
.statement { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(28px, 3.9vw, 54px); line-height: 1.14; letter-spacing: -.02em; color: var(--ink) !important; }
.text-ch .panel { width: min(100%, 44rem); }

/* Kartu & angka */
.cards { display: grid; gap: 12px; margin: 22px 0 0; padding: 0; list-style: none; }
.cards li { padding: 16px 18px; border-radius: 16px; background: color-mix(in srgb, var(--ink) 5%, transparent); border: 1px solid var(--line); }
.cards b { display: block; font-family: var(--font-display); font-size: 19px; }
.cards span { display: block; font-size: 15px; color: var(--ink-soft); }
.cards small { display: inline-block; margin-bottom: 6px; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; color: var(--on-accent); background: var(--accent); }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 22px 0 0; }
.stats div { padding: 16px 10px; border-radius: 16px; border: 1px solid var(--line); text-align: center; }
.stats dt { font-family: var(--font-display); font-weight: 700; font-size: clamp(28px, 3.4vw, 42px); line-height: 1.05; background: linear-gradient(120deg, var(--accent), var(--accent-2)); -webkit-background-clip: text; background-clip: text; color: transparent; font-variant-numeric: tabular-nums; }
.stats dd { margin: 6px 0 0; font-size: 13px; color: var(--ink-soft); }

/* Kontak */
.mail { display: inline-block; margin: 6px 0 4px; font-family: var(--font-display); font-size: clamp(22px, 3vw, 34px); color: var(--accent); word-break: break-word; text-underline-offset: 6px; }
footer { position: relative; z-index: 1; display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px 24px; padding: 28px var(--pad) 40px; font-size: 14px; color: var(--ink-soft); border-top: 1px solid var(--line); background: color-mix(in srgb, var(--bg) 80%, transparent); }

/* Layar objek menampilkan kode → panel kode HTML disembunyikan di layar lebar (tetap terbaca pembaca layar). */
@media (min-width: 821px) { html.webgl .code-win.mirror { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); } }

/* Tanpa WebGL: latar gradasi. */
html.no-webgl body { background: radial-gradient(90% 70% at 75% 30%, color-mix(in srgb, var(--accent) 28%, var(--bg-2)), var(--bg) 70%) fixed; }
html.no-webgl #gl { display: none; }

@media (max-width: 820px) {
  .nav ul { display: none; }
  .ch { align-items: flex-end; min-height: 120vh; padding: 52vh 16px 8vh; }
  .ch.hero { min-height: 100vh; padding-top: 50vh; padding-bottom: 14vh; }
  .ch.code-ch { padding-top: 40vh; }
  h1 { font-size: clamp(38px, 11vw, 52px); }
  .ch.hero { padding-top: 46vh; }
  .a-left, .a-right, .a-center { justify-content: center; }
  .panel, .stack, .text-ch .panel { width: 100%; }
  .stats dd { font-size: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  #gl, .ln { transition: none; }
  .scroll-hint span::after, .loader i, html.typing .ln.cur::after { animation: none; }
}
`;
}

/* ------------------------------- mesin ----------------------------- */

const ENGINE = String.raw`
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
/* OWD Scrub: mesin scroll bawaan OneWebDev (API mirip GSAP + ScrollTrigger). */
const G = window.OWDScrub, ST = G && G.ScrollTrigger, M = window.Motion;
const hasG = !!(G && ST);
const cssv = (n) => getComputedStyle(root).getPropertyValue(n).trim();
const COL = { bg: cssv("--bg"), bg2: cssv("--bg-2"), ink: cssv("--ink"), inkSoft: cssv("--ink-soft"), accent: cssv("--accent"), accent2: cssv("--accent-2"), obj: cssv("--obj"), obj2: cssv("--obj-2"), panel: cssv("--panel") };
const sections = Array.prototype.slice.call(document.querySelectorAll("[data-ch]"));
const navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav ul a"));
const P = Object.assign({}, POSES[0]);
let screenMode = POSES[0].screen, screenDirty = true, current = 0;

/* 1) Biodata kode dari CONFIG; diketik mengikuti scroll. */
const codeEl = document.getElementById("kode");
if (codeEl) codeEl.innerHTML = bioHtml(CONFIG);
const LINES = bioLines(CONFIG);
const lineEls = codeEl ? Array.prototype.slice.call(codeEl.querySelectorAll(".ln")) : [];
const LEN = LINES.map((l) => l.reduce((n, t) => n + t[1].length, 0) + 1);
const TOTAL = LEN.reduce((a, b) => a + b, 0);
let typed = TOTAL;
function setTyped(chars) {
  const next = Math.max(0, Math.min(TOTAL, Math.round(chars)));
  if (next === typed) return;
  typed = next;
  let start = 0;
  lineEls.forEach((el, i) => {
    el.classList.toggle("on", typed > start);
    el.classList.toggle("cur", typed > start && typed <= start + LEN[i] && typed < TOTAL);
    start += LEN[i];
  });
  screenDirty = true;
}
const berkas = (document.getElementById("berkas") || {}).textContent || "biodata";

/* 2) Pecah judul & kalimat besar jadi kata (untuk animasi per kata). */
function splitWords(el) {
  const words = el.textContent.trim().split(/\s+/);
  el.setAttribute("aria-label", el.textContent.trim());
  el.textContent = "";
  words.forEach((w, i) => { const s = document.createElement("span"); s.className = "w"; s.setAttribute("aria-hidden", "true"); s.textContent = w; el.appendChild(s); if (i < words.length - 1) el.appendChild(document.createTextNode(" ")); });
  return Array.prototype.slice.call(el.querySelectorAll(".w"));
}
const animated = !reduce && hasG && !!M;
const heroWords = animated ? splitWords(document.querySelector("h1")) : [];
const statements = animated ? Array.prototype.slice.call(document.querySelectorAll(".statement")).map(splitWords) : [];

/* 3) OWD Scrub + Lenis: gulir halus, progres, kalimat muncul kata demi kata, pengetikan kode, pose objek per bab. */
let lenis = null;
if (hasG) G.registerPlugin(ST);
if (animated) {
  root.classList.add("typing");
  typed = -1; setTyped(0);
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ST.update);
  G.ticker.add((time) => lenis.raf(time * 1000));
  G.ticker.lagSmoothing(0);
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    const el = a && document.getElementById(a.getAttribute("href").slice(1));
    if (!el) return;
    e.preventDefault();
    lenis.scrollTo(el, { offset: 0, duration: 1.4 });
  });
  G.to(".progress i", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  statements.forEach((words) => {
    G.fromTo(words, { opacity: 0.14 }, { opacity: 1, stagger: 0.08, ease: "none", scrollTrigger: { trigger: words[0].parentNode, start: "top 82%", end: "bottom 48%", scrub: true } });
  });
  const codeSec = codeEl && codeEl.closest("[data-ch]");
  if (codeSec) ST.create({ trigger: codeSec, start: "top 62%", end: "bottom 85%", scrub: true, onUpdate: (st) => setTyped(st.progress * TOTAL * 1.12) });
  for (let i = 1; i < sections.length; i++) {
    const from = Object.assign({}, POSES[i - 1]), to = Object.assign({}, POSES[i]);
    delete from.screen; delete to.screen;
    G.timeline({ scrollTrigger: { trigger: sections[i], start: "top bottom", end: "top 18%", scrub: 1 } })
      .fromTo(P, from, Object.assign(to, { ease: "power2.inOut", immediateRender: false }));
  }
  sections.forEach((sec, i) => ST.create({ trigger: sec, start: "top 55%", end: "bottom 55%", onToggle: (st) => { if (st.isActive) setChapter(i); } }));
} else {
  // Tanpa animasi (kurangi gerak / library gagal dimuat): semua konten tampil, layar menunjukkan kode lengkap.
  const ci = POSES.findIndex((p) => p.screen === "code");
  if (ci > 0 && !reduce) Object.assign(P, POSES[ci]);
  screenMode = ci >= 0 ? "code" : screenMode;
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((en) => en.forEach((e) => { if (e.isIntersecting) setNav(sections.indexOf(e.target)); }), { rootMargin: "-50% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }
}
function setNav(i) { navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + sections[i].id)); }
function setChapter(i) {
  if (i === current) return;
  current = i; setNav(i);
  screenMode = POSES[i].screen || screenMode;
  screenDirty = true;
}

/* 4) Motion: judul per kata, panel muncul, kartu bertahap, angka menghitung, tombol magnetis. */
if (animated) {
  const { animate, inView, stagger } = M;
  const ease = [0.2, 0.7, 0.2, 1];
  animate(heroWords, { opacity: [0, 1], y: [36, 0], rotate: [4, 0] }, { delay: stagger(0.07, { startDelay: 0.25 }), duration: 0.9, ease });
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.style.opacity = "0";
    inView(el, () => { animate(el, { opacity: [0, 1], y: [28, 0] }, { duration: 0.8, ease }); }, { amount: 0.2 });
  });
  document.querySelectorAll("[data-stagger]").forEach((el) => {
    const kids = Array.prototype.slice.call(el.children);
    kids.forEach((k) => { k.style.opacity = "0"; });
    inView(el, () => { animate(kids, { opacity: [0, 1], y: [30, 0], scale: [0.96, 1] }, { delay: stagger(0.1), duration: 0.7, ease }); }, { amount: 0.2 });
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

/* 5) Three.js */
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
  scene.fog = new THREE.Fog(COL.bg, 16, 40);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 120);
  const look = new THREE.Vector3();

  scene.add(new THREE.HemisphereLight(0xffffff, COL.bg2 || 0x222233, 1.15));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 7, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(COL.accent, 2.6); rim.position.set(-6, 2, -5); scene.add(rim);
  const fill = new THREE.PointLight(COL.accent2, 18, 26, 1.6); fill.position.set(4, -1, 5); scene.add(fill);

  /* Tekstur bantu: cahaya bulat & teks. */
  const textures = [];
  function glowTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.35, "rgba(255,255,255,.35)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); textures.push(t); return t;
  }
  function textTexture(draw, w, h) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    draw(c.getContext("2d"), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; textures.push(t); return t;
  }
  const screens = [];
  function makeScreen(w, h, style) {
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    screens.push({ c, g: c.getContext("2d"), tex, style: style || "dark" }); textures.push(tex);
    return tex;
  }

  const api = buildObject({ THREE, COL, makeScreen, glowTexture, textTexture, brand: BRAND });
  scene.add(api.group);
  const floor = typeof api.floor === "number" ? api.floor : -1.9;

  /* Bayangan lembut & debu cahaya. */
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ map: glowTexture(), color: 0x000000, transparent: true, opacity: 0.35, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; scene.add(shadow);
  const DUST = 420, dp = new Float32Array(DUST * 3);
  for (let i = 0; i < DUST; i++) { dp[i * 3] = (Math.random() - 0.5) * 26; dp[i * 3 + 1] = (Math.random() - 0.5) * 14; dp[i * 3 + 2] = (Math.random() - 0.5) * 18 - 2; }
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.BufferAttribute(dp, 3));
  const dust = new THREE.Points(dg, new THREE.PointsMaterial({ color: COL.accent, size: 0.05, map: glowTexture(), transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  /* Layar: logo / kode / UI / teks. */
  const TK = { dark: { bg: "#0b1020", kw: "#c792ea", var: "#eef1ff", key: COL.accent, str: "#c3e88d", num: "#f78c6c", pun: "#8f9bb3", com: "#6f789b", ln: "#3c4566", bar: "rgba(255,255,255,.05)", ink: "#eef1ff" },
               paper: { bg: "#f4ecda", kw: "#7a3e9d", var: "#2a2420", key: "#a4442b", str: "#3d6f3a", num: "#a0522d", pun: "#7d7468", com: "#9a8f7e", ln: "#c9bca2", bar: "rgba(0,0,0,.05)", ink: "#2a2420" } };
  function wrap(g, text, maxW) { const words = String(text).split(/\s+/), out = []; let line = ""; words.forEach((w) => { const t = line ? line + " " + w : w; if (g.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t; }); if (line) out.push(line); return out; }
  function drawScreen(s, t) {
    const g = s.g, W = s.c.width, H = s.c.height, k = TK[s.style] || TK.dark, paper = s.style === "paper";
    const u = Math.min(W, H);
    g.fillStyle = k.bg; g.fillRect(0, 0, W, H);
    if (screenMode === "code") {
      const head = Math.round(u * 0.085);
      g.fillStyle = k.bar; g.fillRect(0, 0, W, head);
      ["#ff5f57", "#febc2e", "#28c840"].forEach((c, i) => { g.fillStyle = paper ? k.ln : c; g.beginPath(); g.arc(head * 0.6 + i * head * 0.45, head / 2, head * 0.13, 0, 7); g.fill(); });
      g.fillStyle = k.pun; g.font = "500 " + Math.round(head * 0.38) + "px ui-monospace, Menlo, Consolas, monospace"; g.textBaseline = "middle"; g.fillText(berkas, head * 2.2, head / 2);
      const n = LINES.length + 1, portrait = H > W * 1.2;
      const fs = portrait ? Math.floor(W / 19) : Math.floor(Math.min((H - head) / (n * 1.55), W / 34));
      g.font = "500 " + fs + "px ui-monospace, Menlo, Consolas, monospace";
      const cw = g.measureText("M").width, lh = fs * 1.55, x0 = fs * 3.2, maxX = W - fs * 0.6;
      let left = typed, y = head + lh * 0.9, x = x0;
      for (let i = 0; i < LINES.length && left > 0; i++) {
        g.fillStyle = k.ln; g.textAlign = "right"; g.fillText(String(i + 1), fs * 2.2, y); g.textAlign = "left";
        x = x0;
        for (const tk of LINES[i]) {
          if (left <= 0) break;
          let txt = tk[1].slice(0, Math.max(0, left)); left -= tk[1].length;
          g.fillStyle = k[tk[0]] || k.var;
          /* Baris panjang dibungkus ke baris berikutnya (penting untuk layar tegak seperti HP). */
          if (txt.length > (maxX - x) / cw && txt.length <= (maxX - x0 - cw * 2) / cw && x > x0) { y += lh; x = x0 + cw * 2; }
          while (txt.length) {
            if (maxX - x < cw) { y += lh; x = x0 + cw * 2; }
            const part = txt.slice(0, Math.max(1, Math.floor((maxX - x) / cw)));
            g.fillText(part, x, y); x += cw * part.length; txt = txt.slice(part.length);
          }
        }
        left -= 1;
        if (left <= 0 && typed < TOTAL && Math.floor(t * 2) % 2 === 0) { g.fillStyle = COL.accent; g.fillRect(x + 2, y - fs * 0.55, fs * 0.55, fs * 1.1); }
        y += lh;
      }
    } else if (screenMode === "ui") {
      const pad = u * 0.06, side = W > H ? W * 0.2 : 0;
      g.fillStyle = paper ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.04)"; if (side) g.fillRect(0, 0, side, H);
      g.fillStyle = COL.accent; g.beginPath(); g.arc((side || pad * 2) / 2 + (side ? 0 : pad), pad * 1.3, u * 0.03, 0, 7); g.fill();
      for (let i = 0; i < 4 && side; i++) { g.fillStyle = i === 1 ? COL.accent : (paper ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.12)"); g.fillRect(pad, pad * 3 + i * u * 0.09, side - pad * 2, u * 0.035); }
      const x0 = side + pad, cw = W - x0 - pad;
      g.fillStyle = k.ink; g.font = "700 " + Math.round(u * 0.07) + "px system-ui, sans-serif"; g.textBaseline = "alphabetic"; g.fillText(BRAND, x0, pad + u * 0.07);
      const cards = W > H ? 3 : 2, gap = pad * 0.6, cwid = (cw - gap * (cards - 1)) / cards, ch = u * 0.2, cy = pad * 1.6 + u * 0.08;
      for (let i = 0; i < cards; i++) { const x = x0 + i * (cwid + gap); g.fillStyle = paper ? "rgba(0,0,0,.05)" : "rgba(255,255,255,.06)"; g.fillRect(x, cy, cwid, ch); g.fillStyle = i % 2 ? COL.accent2 : COL.accent; g.fillRect(x + gap * 0.6, cy + ch * 0.62, cwid * (0.35 + 0.4 * (0.5 + 0.5 * Math.sin(t * 0.8 + i))), ch * 0.12); g.fillStyle = k.ink; g.font = "700 " + Math.round(ch * 0.26) + "px system-ui, sans-serif"; g.fillText(String(Math.round(40 + 50 * (0.5 + 0.5 * Math.sin(t * 0.5 + i * 2)))) + "%", x + gap * 0.6, cy + ch * 0.42); }
      const by = cy + ch + gap * 1.4, bh = H - by - pad, bars = W > H ? 14 : 8, bw = cw / bars;
      for (let i = 0; i < bars; i++) { const v = 0.3 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.2 + i * 0.7)); g.fillStyle = i % 3 === 0 ? COL.accent2 : COL.accent; g.globalAlpha = 0.85; g.fillRect(x0 + i * bw + bw * 0.18, by + bh * (1 - v), bw * 0.64, bh * v); }
      g.globalAlpha = 1;
    } else {
      const grad = g.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, COL.accent); grad.addColorStop(1, COL.accent2);
      g.globalAlpha = paper ? 0.18 : 0.28; g.fillStyle = grad; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
      const glow = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, u * 0.7);
      glow.addColorStop(0, paper ? "rgba(255,255,255,.4)" : "rgba(255,255,255,.12)"); glow.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = glow; g.fillRect(0, 0, W, H);
      const main = screenMode === "logo" ? BRAND : CONFIG.layarTeks || BRAND, sub = screenMode === "logo" ? CONFIG.layarSub || "" : CONFIG.layarSub || "";
      g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = k.ink;
      let fs = Math.round(u * (screenMode === "logo" ? 0.15 : 0.12));
      g.font = "800 " + fs + "px system-ui, sans-serif";
      let lines = wrap(g, main, W * 0.82);
      while (lines.length > 3 && fs > 12) { fs -= 4; g.font = "800 " + fs + "px system-ui, sans-serif"; lines = wrap(g, main, W * 0.82); }
      const total = lines.length * fs * 1.1;
      lines.forEach((l, i) => g.fillText(l, W / 2, H / 2 - total / 2 + fs * 0.55 + i * fs * 1.1 - (sub ? fs * 0.3 : 0)));
      if (sub) { g.font = "500 " + Math.round(fs * 0.3) + "px system-ui, sans-serif"; g.fillStyle = paper ? k.pun : "rgba(255,255,255,.75)"; g.fillText(sub, W / 2, H / 2 + total / 2 + fs * 0.35); }
      g.textAlign = "left";
    }
    s.tex.needsUpdate = true;
  }

  const tris = (() => { let n = 0; scene.traverse((o) => { if (o.isMesh) { const gg = o.geometry; n += ((gg.index ? gg.index.count : gg.attributes.position.count) / 3) * (o.isInstancedMesh ? o.count : 1); } }); return Math.round(n); })();
  window.__OWD_STATS = { triangles: tris, budget: 50000, contexts: 1 };

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  if (!reduce && matchMedia("(pointer: fine)").matches) addEventListener("pointermove", (e) => { pointer.tx = e.clientX / innerWidth - 0.5; pointer.ty = e.clientY / innerHeight - 0.5; }, { passive: true });

  function resize() { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); }
  addEventListener("resize", resize); resize();
  let visible = true;
  const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; });
  io.observe(canvas);

  /* Pose → kamera & objek. Layar sempit: objek ke tengah-atas, kamera mundur supaya muat. */
  function applyPose(t) {
    const narrow = camera.aspect < 0.9, k = narrow ? Math.pow(0.9 / camera.aspect, 0.85) : 1;
    const lx = P.lx * (narrow ? 0.1 : 1), ly = P.ly - (narrow ? 0.8 + 0.55 * (k - 0.6) : 0);
    look.set(lx, ly, P.lz);
    camera.position.set(lx + (P.cx - P.lx) * k * (narrow ? 0.4 : 1), ly + (P.cy - P.ly) * k, P.lz + (P.cz - P.lz) * k);
    camera.position.x += pointer.x * 0.5; camera.position.y -= pointer.y * 0.3;
    camera.lookAt(look);
    const g = api.group;
    g.position.set(P.px * (narrow ? 0.1 : 1), P.py, P.pz);
    g.rotation.set(P.rx, P.ry + (reduce ? 0 : Math.sin(t * 0.45) * 0.06), P.rz);
    g.scale.setScalar(P.s);
    shadow.position.set(g.position.x, P.py + floor * P.s, g.position.z);
    shadow.scale.setScalar(P.s);
  }

  /* v21: di desktop objek 3D tidak boleh menabrak panel teks. Kotak objek di layar dibandingkan
     dengan panel yang terlihat; bila bertabrakan, objek digeser menjauh dari panel (dan dikecilkan
     bila ruangnya kurang), dengan transisi halus. Panel di tengah & layar sempit tidak diubah. */
  const panels = Array.prototype.slice.call(document.querySelectorAll("[data-ch] .panel"));
  const corner = new THREE.Vector3(), right = new THREE.Vector3();
  const avoid = { x: 0, s: 1, tx: 0, ts: 1 };
  /* Kotak layar objek: sudut kotak lokal tiap mesh diproyeksikan langsung (lebih rapat daripada
     kotak dunia gabungan, yang menggembung saat objek diputar). Halo/kilau transparan diabaikan. */
  function objRect() {
    api.group.updateMatrixWorld(true);
    let l = Infinity, r = -Infinity, tp = Infinity, b = -Infinity;
    api.group.traverse(function (m) {
      if (!m.isMesh || !m.visible || !m.geometry) return;
      const mat = Array.isArray(m.material) ? m.material[0] : m.material;
      if (mat && (mat.blending === THREE.AdditiveBlending || (mat.transparent && mat.depthWrite === false))) return;
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      const bb = m.geometry.boundingBox;
      for (let i = 0; i < 8; i++) {
        corner.set(i & 1 ? bb.max.x : bb.min.x, i & 2 ? bb.max.y : bb.min.y, i & 4 ? bb.max.z : bb.min.z).applyMatrix4(m.matrixWorld).project(camera);
        const x = (corner.x + 1) / 2 * innerWidth, y = (1 - corner.y) / 2 * innerHeight;
        l = Math.min(l, x); r = Math.max(r, x); tp = Math.min(tp, y); b = Math.max(b, y);
      }
    });
    return l < r ? { l, r, t: tp, b } : null;
  }
  function avoidText() {
    avoid.tx = 0; avoid.ts = 1;
    if (camera.aspect < 0.9 || !panels.length) return;
    camera.updateMatrixWorld();
    const o = objRect(); if (!o) return;
    const W = innerWidth, gap = 32, edge = 12, w = o.r - o.l, c = (o.l + o.r) / 2;
    /* Kandidat posisi: tetap, atau tepat di kiri/kanan tiap panel (diperkecil bila ruangnya sempit).
       Dipilih yang paling sedikit menabrak SEMUA panel yang terlihat; seri → geser paling kecil. */
    const rects = [];
    for (const p of panels) {
      const r = p.getBoundingClientRect();
      const top = Math.max(r.top, 0), bottom = Math.min(r.bottom, innerHeight);
      if (!r.width || bottom <= top) continue;
      if (Math.abs((r.left + r.right) / 2 - W / 2) < W * 0.08) continue;
      rects.push({ l: r.left - gap, r: r.right + gap, t: top - gap, b: bottom + gap });
    }
    if (!rects.length) return;
    const h = o.b - o.t, cy = (o.t + o.b) / 2;
    function cost(nc, s) {
      const l = nc - (w * s) / 2, r = nc + (w * s) / 2, t = cy - (h * s) / 2, b = cy + (h * s) / 2;
      let sum = 0;
      for (const q of rects) { const ix = Math.min(r, q.r) - Math.max(l, q.l), iy = Math.min(b, q.b) - Math.max(t, q.t); if (ix > 0 && iy > 0) sum += ix * iy; }
      return sum;
    }
    const cands = [[c, 1]];
    for (const q of rects) {
      for (const side of [-1, 1]) {
        const room = side < 0 ? q.l - edge : W - edge - q.r;
        if (room < w * 0.35) continue;
        const s = Math.min(1, room / Math.max(1, w));
        cands.push([side < 0 ? q.l - (w * s) / 2 : q.r + (w * s) / 2, s]);
      }
    }
    let best = null, bestCost = Infinity;
    for (const k of cands) {
      const v = cost(k[0], k[1]) + Math.abs(k[0] - c) * 2 + (1 - k[1]) * w * 20;
      if (v < bestCost) { bestCost = v; best = k; }
    }
    let dx = best[0] - c, sc = best[1];
    if (!dx) return;
    const d = camera.position.distanceTo(api.group.position);
    avoid.tx = dx * (2 * d * Math.tan((camera.fov * Math.PI) / 360)) / innerHeight;
    avoid.ts = sc;
  }
  function applyAvoid() {
    right.setFromMatrixColumn(camera.matrixWorld, 0).setY(0).normalize();
    api.group.position.addScaledVector(right, avoid.x);
    api.group.scale.multiplyScalar(avoid.s);
    shadow.position.x = api.group.position.x; shadow.position.z = api.group.position.z;
    shadow.scale.multiplyScalar(avoid.s);
    if (window.OWD_DEBUG) { window.__OWD_STATS.obj = objRect(); window.__OWD_STATS.avoid = Object.assign({}, avoid); }
  }

  const clock = new THREE.Clock();
  let raf = 0, first = true, frames = 0, slow = 0, lastDraw = -1;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1), t = clock.elapsedTime;
    if (!visible || document.hidden) return;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3); pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    applyPose(t);
    avoidText();
    const ka = Math.min(1, dt * 5);
    avoid.x += (avoid.tx - avoid.x) * ka; avoid.s += (avoid.ts - avoid.s) * ka;
    applyAvoid();
    api.update(reduce ? 0 : t, reduce ? 0 : dt, P);
    if (!reduce) { dust.rotation.y = t * 0.015; dust.position.y = Math.sin(t * 0.2) * 0.2; }
    const live = screenMode === "ui" || (screenMode === "code" && typed < TOTAL);
    if (screens.length && (screenDirty || (live && t - lastDraw > 0.08))) { screens.forEach((s) => drawScreen(s, t)); screenDirty = false; lastDraw = t; }
    renderer.render(scene, camera);
    if (first) { first = false; root.classList.add("webgl"); root.classList.remove("loading"); }
    frames++; if (dt > 0.022) slow++;
    if (frames === 90) { if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); } frames = 0; slow = 0; }
  }
  if (window.OWD_THUMB) { applyPose(0); avoidText(); avoid.x = avoid.tx; avoid.s = avoid.ts; applyAvoid(); api.update(1.2, 0.016, P); screens.forEach((s) => drawScreen(s, 1)); renderer.render(scene, camera); root.classList.add("webgl"); root.classList.remove("loading"); return; }
  raf = requestAnimationFrame(frame);

  function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (hasG) ST.getAll().forEach((s) => s.kill());
    if (lenis) lenis.destroy();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((mat) => mat.dispose());
    });
    textures.forEach((x) => x.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }
  addEventListener("pagehide", dispose, { once: true });
  window.__OWD_DISPOSE = dispose;
}
`;

/* ------------------------------- HTML ------------------------------ */

const SCREEN_OBJECTS: ObjectKind[] = ["monitor", "phone", "laptop", "book"];

function ctas(list: Cta[] | undefined, k: string): string {
  return list?.length
    ? `<div class="ctas" data-reveal>${list.map((c, j) => `<a class="btn${c.ghost ? " ghost" : ""}" href="${c.href}"${ot(`${k}Tombol${j + 1}`, `Bab ${k.slice(1)}: tombol ${j + 1}`)}>${esc(c.label)}</a>`).join("")}</div>`
    : "";
}

function chapterHtml(s: MotionSpec, c: Chapter, i: number, codeHtml: string): string {
  const k = `b${i}`;
  const L = `Bab ${i + 1}`;
  const kicker = c.kicker ? `<p class="kicker"${ot(`${k}Label`, `${L}: label kecil`)}>${esc(c.kicker)}</p>` : "";
  const paras = (c.body ?? []).map((p, j) => `<p${j === 0 && c.kind === "hero" ? ' class="lead"' : ""}${ot(`${k}Teks${j + 1}`, `${L}: paragraf ${j + 1}`, true)}>${esc(p)}</p>`).join("\n    ");
  const H = c.kind === "hero" ? "h1" : "h2";
  const title = c.kind === "text" ? "" : `<${H} id="${c.id}-t"${ot(`${k}Judul`, `${L}: judul`)}>${esc(c.title)}</${H}>`;
  const attrs = `class="ch ${c.kind === "hero" ? "hero" : `${c.kind}-ch`} a-${c.align}" id="${c.id}" data-ch="${i}"`;
  let inner = "";
  switch (c.kind) {
    case "hero":
      inner = `<div class="panel">
    ${kicker}
    ${title}
    ${paras}
    ${ctas(c.cta, k)}
  </div>
  <a class="scroll-hint" href="#${s.chapters[1].id}"><span></span>Gulir</a>`;
      break;
    case "code":
      inner = `<div class="stack">
    <div class="panel" data-reveal>
      ${kicker}
      ${title}
      ${paras}
    </div>
    <figure class="code-win${SCREEN_OBJECTS.includes(s.object) ? " mirror" : ""}" aria-label="Biodata dalam bentuk kode" style="margin:0">
      <div class="bar" aria-hidden="true"><i></i><i></i><i></i><span id="berkas"${ot("namaBerkas", "Nama berkas kode")}>${esc(s.berkas)}</span></div>
      <pre><code id="kode"><!--owd:render name="code"-->${codeHtml}<!--owd:end--></code></pre>
    </figure>
  </div>`;
      break;
    case "text":
      inner = `<div class="panel" data-reveal>
    ${kicker}
    <h2 class="sr">${esc(c.title)}</h2>
    <p class="statement"${ot(`${k}Kalimat`, `${L}: kalimat besar`, true)}>${esc(c.body?.[0] ?? "")}</p>
  </div>`;
      break;
    case "cards":
      inner = `<div class="panel" data-reveal>
    ${kicker}
    ${title}
    ${paras}
    <ul class="cards" data-stagger>${(c.items ?? [])
      .map(
        (it, j) =>
          `<li>${it.tag ? `<small${ot(`${k}Item${j + 1}Tag`, `${L}: kartu ${j + 1} label`)}>${esc(it.tag)}</small>` : ""}<b${ot(`${k}Item${j + 1}Judul`, `${L}: kartu ${j + 1} judul`)}>${esc(it.title)}</b><span${ot(`${k}Item${j + 1}Teks`, `${L}: kartu ${j + 1} teks`, true)}>${esc(it.text)}</span></li>`,
      )
      .join("")}</ul>
    ${ctas(c.cta, k)}
  </div>`;
      break;
    case "stats":
      inner = `<div class="panel" data-reveal>
    ${kicker}
    ${title}
    ${paras}
    <dl class="stats" data-stagger>${(c.stats ?? [])
      .map((st, j) => `<div><dt data-count${ot(`${k}Angka${j + 1}`, `${L}: angka ${j + 1}`)}>${esc(st.value)}</dt><dd${ot(`${k}Ket${j + 1}`, `${L}: keterangan angka ${j + 1}`)}>${esc(st.label)}</dd></div>`)
      .join("")}</dl>
  </div>`;
      break;
    case "contact": {
      const MAIL = oh("email", "Tautan email (mailto:alamat)");
      inner = `<div class="panel" data-reveal>
    ${kicker}
    ${title}
    ${paras}
    <a class="mail" href="mailto:${s.contact.email}"${MAIL}${ot("emailTeks", "Alamat email yang ditampilkan")}>${esc(s.contact.email)}</a>
    <div class="ctas"><a class="btn" href="mailto:${s.contact.email}"${MAIL}${ot("tombolEmail", "Tombol email")}>Kirim email</a><a class="btn ghost" href="https://wa.me/${s.contact.whatsapp}?text=${encodeURIComponent(s.contact.waText)}"${oh("whatsapp", "Tautan WhatsApp (https://wa.me/62…)")} target="_blank" rel="noopener"${ot("tombolWa", "Tombol WhatsApp")}>Chat WhatsApp</a></div>
  </div>`;
      break;
    }
  }
  return `<section ${attrs} aria-labelledby="${c.id}-t">
  ${c.kind === "text" ? inner.replace('<h2 class="sr">', `<h2 class="sr" id="${c.id}-t">`) : inner}
</section>`;
}

/** Pose datar untuk OWD Scrub: {cx..,lx..,px..,rx..,s, ...keadaan, screen}. Keadaan yang tidak disebut ikut bab sebelumnya. */
function flatPoses(s: MotionSpec) {
  const keys = new Set<string>();
  s.chapters.forEach((c) => Object.keys(c.pose.st ?? {}).forEach((k) => keys.add(k)));
  let prevSt: Record<string, number> = Object.fromEntries([...keys].map((k) => [k, 0]));
  let prevScreen: ScreenMode = "logo";
  return s.chapters.map((c) => {
    const p = c.pose;
    const st = { ...prevSt, ...(p.st ?? {}) };
    prevSt = st;
    prevScreen = p.screen ?? prevScreen;
    const r = (v: number) => Math.round(v * 1000) / 1000;
    return {
      cx: r(p.cam[0]), cy: r(p.cam[1]), cz: r(p.cam[2]),
      lx: r(p.look[0]), ly: r(p.look[1]), lz: r(p.look[2]),
      px: r(p.pos[0]), py: r(p.pos[1]), pz: r(p.pos[2]),
      rx: r(p.rot[0]), ry: r(p.rot[1]), rz: r(p.rot[2]),
      s: p.s,
      ...st,
      screen: prevScreen,
    };
  });
}

function vars(s: MotionSpec): ThemeVar[] {
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
  ];
}

export function buildMotion(s: MotionSpec): string {
  const config = { ...s.config };
  const codeHtml = motionApi().bioHtml(config);
  const menu = s.chapters.filter((c) => c.nav);
  const body = `
<a class="skip" href="#konten">Lewati ke konten</a>
<canvas id="gl" aria-hidden="true"></canvas>
<div class="loader" aria-hidden="true"><div><i></i>Memuat</div></div>
<header class="nav">
  <a class="brand" href="#${s.chapters[0].id}"${ot("merek", "Nama merek")}>${esc(s.brand)}</a>
  <nav aria-label="Navigasi utama"><ul>${menu.map((c, j) => `<li><a href="#${c.id}"${ot(`menu${j + 1}`, `Menu ${j + 1}`)}>${esc(c.nav!)}</a></li>`).join("")}</ul></nav>
  <div class="progress" aria-hidden="true"><i></i></div>
</header>
<main id="konten">
${s.chapters.map((c, i) => chapterHtml(s, c, i, codeHtml)).join("\n")}
</main>
<footer><span${ot("merek", "Nama merek")}>${esc(s.brand)}</span><span${ot("catatanKaki", "Catatan kaki")}>${esc(s.footer)}</span></footer>
<script type="module">
${LIB_IMPORTS}
/* Motion (skrip klasik); animasi scroll memakai OWD Scrub bawaan (tanpa CDN). Bila gagal, halaman tetap jalan. */
await umd(${JSON.stringify(path(MOTION_JS))}).catch((e) => console.warn("[owd] Animasi scroll tidak aktif:", e));

/* ==== BIODATA & TEKS LAYAR: ubah di sini (atau lewat editor OneWebDev) ==== */
const CONFIG = ${dataBlock("CONFIG", "Biodata & layar", config, ["bahasa"])};
/* ========================================================================= */
/* Nama merek di layar/objek 3D = teks merek di navigasi (ikut berubah bila diedit). */
const BRAND = ((document.querySelector(".nav .brand") || {}).textContent || "").trim() || ${JSON.stringify(s.brand)};
/* Pose kamera & objek per bab (urutan sama dengan section data-ch). */
const POSES = ${JSON.stringify(flatPoses(s))};
${MOTION_RENDER.trim()}

/* Objek 3D (prosedural, tanpa model/tekstur eksternal). */
${OBJECTS[s.object].trim()}
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

export const MOTION_SPECS: MotionSpec[] = MOTION_SPECS_DATA;
