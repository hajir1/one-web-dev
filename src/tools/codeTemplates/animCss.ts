import { dataBlock, doc, esc, oh, ot, type ThemeVar } from "./shared";

/* ================================================================== */
/* PURE CSS ANIMATIONS (v29): animated hero cards built only from HTML   */
/* elements and CSS @keyframes. No canvas, no SVG engine, no library.   */
/*                                                                    */
/* - Every template has its own scene (markup + keyframes) in          */
/*   animCssScenes.ts; the shared shell adds the caption, a call to     */
/*   action, and Pause / Replay controls.                               */
/* - Colors and speed are CSS variables (editable without code).       */
/*   Every duration is written as calc(var(--k) * n), where --k is      */
/*   1s divided by --speed.                                             */
/* - The tiny script only pauses, replays, and freezes a frame for      */
/*   thumbnails and for "reduce motion" through the Web Animations API. */
/* ================================================================== */

export interface CssScene {
  /** Scene markup (decorative, aria-hidden). */
  html: string;
  /** Scene CSS, including its @keyframes. */
  css: string;
}

export interface AnimCssSpec {
  id: string;
  title: string;
  description: string;
  font: { display: string; href: string };
  /** Two background colors, three scene colors, and the text color. */
  colors: { bg1: string; bg2: string; c1: string; c2: string; c3: string; ink: string };
  /** Names of the three scene colors in the editor form. */
  labels: [string, string, string];
  kicker: string;
  heading: string;
  text: string;
  cta: string;
  href: string;
  /** Where the caption sits so it never covers the main subject. */
  capPos: "top" | "bottom" | "left" | "right";
  /** Second of the loop shown in thumbnails and with "reduce motion". */
  still: number;
  scene: CssScene;
}

function vars(s: AnimCssSpec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--bg-1", value: c.bg1, label: "Latar bawah" },
    { name: "--bg-2", value: c.bg2, label: "Latar atas" },
    { name: "--c-1", value: c.c1, label: s.labels[0] },
    { name: "--c-2", value: c.c2, label: s.labels[1] },
    { name: "--c-3", value: c.c3, label: s.labels[2] },
    { name: "--ink", value: c.ink, label: "Warna teks" },
    { name: "--speed", value: "1", label: "Kecepatan animasi", range: [0.25, 3, 0.05] },
  ];
}

const PLACE: Record<AnimCssSpec["capPos"], string> = {
  top: "left: 50%; top: clamp(56px, 9vh, 96px); transform: translateX(-50%); text-align: center; align-items: center;",
  bottom: "left: 50%; bottom: clamp(84px, 12vh, 120px); transform: translateX(-50%); text-align: center; align-items: center;",
  left: "left: clamp(16px, 6vw, 96px); top: 50%; transform: translateY(-50%);",
  right: "right: clamp(16px, 6vw, 96px); top: 50%; transform: translateY(-50%);",
};

function shellCss(s: AnimCssSpec): string {
  return `
:root { --k: calc(1s / var(--speed)); --font-display: "${s.font.display}", Georgia, serif; --font-text: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { background: var(--bg-1); color: var(--ink); font-family: var(--font-text); overflow: hidden; }
.stage { position: fixed; inset: 0; overflow: hidden; background: linear-gradient(180deg, var(--bg-2), var(--bg-1)); }
.scene, .scene * { position: absolute; }
.scene { inset: 0; }
.scene i, .scene b, .scene span { display: block; }

.cap { position: absolute; ${PLACE[s.capPos]} z-index: 5; display: flex; flex-direction: column; gap: 12px; width: min(520px, calc(100vw - 32px)); animation: capIn calc(var(--k) * 1.2) cubic-bezier(.2,.8,.2,1) both; }
.cap .kicker { margin: 0; font-size: 13px; font-weight: 600; letter-spacing: .16em; text-transform: uppercase; color: var(--c-1); }
.cap h1 { margin: 0; font-family: var(--font-display); font-weight: 600; font-size: clamp(32px, 5.4vw, 64px); line-height: 1.05; text-wrap: balance; text-shadow: 0 2px 24px color-mix(in srgb, var(--bg-1) 70%, transparent); }
.cap p.text { margin: 0; font-size: clamp(15px, 1.6vw, 18px); line-height: 1.6; color: color-mix(in srgb, var(--ink) 84%, transparent); text-shadow: 0 1px 12px color-mix(in srgb, var(--bg-1) 80%, transparent); }
.cap .cta { align-self: ${s.capPos === "top" || s.capPos === "bottom" ? "center" : "flex-start"}; margin-top: 6px; display: inline-flex; align-items: center; min-height: 46px; padding: 0 22px; border-radius: 999px; background: var(--c-1); color: var(--bg-1); font-weight: 600; text-decoration: none; box-shadow: 0 12px 30px -12px color-mix(in srgb, var(--c-1) 80%, #000); }
.cap .cta:focus-visible { outline: 3px solid var(--ink); outline-offset: 3px; }
@keyframes capIn { from { opacity: 0; translate: 0 20px; } }

.controls { position: absolute; right: 16px; bottom: 16px; z-index: 6; display: flex; gap: 8px; }
.controls button { min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--ink) 25%, transparent); background: color-mix(in srgb, var(--bg-1) 55%, transparent); color: var(--ink); font: 500 14px var(--font-text); cursor: pointer; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.controls button:focus-visible { outline: 2px solid var(--c-1); outline-offset: 2px; }
.stage.paused *, .stage.paused *::before, .stage.paused *::after { animation-play-state: paused !important; }
@media (max-width: 640px) {
  .cap { ${s.capPos === "left" || s.capPos === "right" ? "left: 16px; right: auto; top: clamp(56px, 9vh, 96px); transform: none;" : ""} }
  .controls { right: 12px; bottom: 12px; }
}
@media (prefers-reduced-motion: reduce) {
  .stage *, .stage *::before, .stage *::after { animation-play-state: paused !important; }
  .cap { animation: none; }
}
`;
}

const SCRIPT = String.raw`
const stage = document.querySelector(".stage");
const btnPause = document.getElementById("pause");
const btnAgain = document.getElementById("again");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const anims = () => (document.getAnimations ? document.getAnimations() : []);
/* Freeze every CSS animation on one chosen frame (thumbnails, reduce motion). */
function still() { const ms = (+CONFIG.detikDiam || 0) * 1000; for (const a of anims()) { try { a.currentTime = ms; a.pause(); } catch (e) {} } }
function setPaused(p) { stage.classList.toggle("paused", p); btnPause.textContent = p ? "Lanjutkan" : "Jeda"; btnPause.setAttribute("aria-pressed", String(p)); }
btnPause.addEventListener("click", () => setPaused(!stage.classList.contains("paused")));
btnAgain.addEventListener("click", () => { if (reduce.matches) return still(); for (const a of anims()) { try { a.currentTime = 0; a.play(); } catch (e) {} } setPaused(false); });
/* Hidden tab: pause; visible again: resume unless the visitor paused it. */
let pausedByUser = false;
document.addEventListener("visibilitychange", () => { if (document.hidden) { pausedByUser = stage.classList.contains("paused"); stage.classList.add("paused"); } else if (!pausedByUser && !reduce.matches && !window.OWD_THUMB) stage.classList.remove("paused"); });
reduce.addEventListener("change", () => (reduce.matches ? still() : btnAgain.click()));
if (window.OWD_THUMB || reduce.matches) still();
else if (CONFIG.mainOtomatis === false) setPaused(true);
`;

export function buildAnimCss(s: AnimCssSpec): string {
  const config = { mainOtomatis: true, detikDiam: s.still };
  const body = `
<div class="stage">
<div class="scene" aria-hidden="true">
${s.scene.html.trim()}
</div>
<main class="cap">
  <p class="kicker"${ot("label", "Label kecil")}>${esc(s.kicker)}</p>
  <h1${ot("judul", "Judul")}>${esc(s.heading)}</h1>
  <p class="text"${ot("pesan", "Pesan", true)}>${esc(s.text)}</p>
  <a class="cta" href="${esc(s.href)}"${oh("tautan", "Tautan tombol")}${ot("tombol", "Teks tombol")}>${esc(s.cta)}</a>
</main>
<div class="controls">
  <button type="button" id="pause" aria-pressed="false">Jeda</button>
  <button type="button" id="again">Ulangi</button>
</div>
</div>
<script>
/* ==== SETTINGS: autoplay, and the second shown as a still frame ==== */
const CONFIG = ${dataBlock("CONFIG", "Pengaturan animasi", config)};
${SCRIPT.trim()}
</script>`;
  return doc({
    title: s.title,
    description: s.description,
    theme: s.colors.bg1,
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${s.font.href}">`,
    vars: vars(s),
    css: shellCss(s) + "\n/* ---- scene ---- */\n" + s.scene.css,
    body,
  });
}
