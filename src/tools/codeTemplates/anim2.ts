import { dataBlock, doc, esc, ot, type ThemeVar } from "./shared";

/* ================================================================== */
/* ANIMASI CERITA (v22): kartu ucapan yang bercerita dalam beberapa      */
/* babak. Tanpa library: satu canvas 2D + teks HTML.                     */
/*                                                                    */
/* - Tiap template punya adegan sendiri (fungsi scene di storyAnim*.ts):*/
/*   amplop yang berubah jadi burung, lilin yang ditiup, ulat yang jadi */
/*   kupu-kupu, dan seterusnya. Alurnya tidak seragam.                  */
/* - Waktu cerita B: 0 → jumlah babak. Babak maju sendiri tiap          */
/*   CONFIG.detikPerBabak detik; ketuk/klik/spasi untuk lanjut lebih    */
/*   cepat. Babak terakhir menampilkan kartu ucapan.                    */
/* - Warna dibaca dari variabel CSS (bisa diubah di editor tanpa kode).  */
/* - Hemat: DPR maks 2, partikel dibatasi, berhenti saat tab tersembunyi,*/
/*   "kurangi gerakan" langsung menampilkan babak terakhir tanpa gerak.  */
/* ================================================================== */

export type CapFx = "rise" | "blur" | "letters" | "scale" | "slide";

export interface Anim2Spec {
  id: string;
  title: string;
  description: string;
  font: { display: string; href: string; italic?: boolean };
  /** Warna: 3 latar (bawah/tengah/atas), 3 warna adegan, teks. */
  colors: { bg1: string; bg2: string; bg3: string; c1: string; c2: string; c3: string; ink: string; panel: string };
  /** Nama warna adegan untuk form editor. */
  labels: [string, string, string];
  /** Teks per babak (sebelum kartu ucapan). */
  beats: string[];
  to: string;
  heading: string;
  text: string;
  from: string;
  /** Posisi teks babak & kartu akhir. */
  capPos?: "top" | "bottom";
  notePos?: "top" | "bottom" | "center" | "left" | "right";
  capFx: CapFx;
  /** Petunjuk interaksi di babak pertama. */
  hint: string;
  /** Data adegan yang bisa diedit (mis. kata yang dibentuk partikel). */
  config?: Record<string, unknown>;
  configLabel?: string;
  beatSec?: number;
  scene: string;
}

function vars(s: Anim2Spec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--bg-1", value: c.bg1, label: "Latar bawah" },
    { name: "--bg-2", value: c.bg2, label: "Latar tengah" },
    { name: "--bg-3", value: c.bg3, label: "Latar atas" },
    { name: "--c-1", value: c.c1, label: s.labels[0] },
    { name: "--c-2", value: c.c2, label: s.labels[1] },
    { name: "--c-3", value: c.c3, label: s.labels[2] },
    { name: "--ink", value: c.ink, label: "Warna teks" },
    { name: "--panel", value: c.panel, label: "Latar kartu ucapan" },
    { name: "--speed", value: "1", label: "Kecepatan animasi", range: [0.25, 3, 0.05] },
  ];
}

function css(s: Anim2Spec): string {
  const cap = s.capPos ?? "top";
  const note = s.notePos ?? "center";
  const notePlace: Record<string, string> = {
    center: "left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;",
    top: "left: 50%; top: clamp(64px, 10vh, 110px); transform: translateX(-50%); text-align: center;",
    bottom: "left: 50%; bottom: clamp(76px, 10vh, 110px); transform: translateX(-50%); text-align: center;",
    left: "left: clamp(16px, 6vw, 96px); top: 50%; transform: translateY(-50%);",
    right: "right: clamp(16px, 6vw, 96px); top: 50%; transform: translateY(-50%);",
  };
  return `
:root {
  --font-display: "${s.font.display}", Georgia, serif;
  --font-text: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { background: var(--bg-1); color: var(--ink); font-family: var(--font-text); overflow: hidden; -webkit-tap-highlight-color: transparent; }
.stage { position: fixed; inset: 0; overflow: hidden; background: linear-gradient(180deg, var(--bg-3) 0%, var(--bg-2) 55%, var(--bg-1) 100%); cursor: pointer; }
#cv { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }

.caps { position: absolute; left: 0; right: 0; ${cap === "top" ? "top: clamp(56px, 11vh, 120px);" : "bottom: clamp(84px, 13vh, 140px);"} z-index: 2; display: grid; place-items: center; padding: 0 20px; pointer-events: none; }
.cap { grid-area: 1 / 1; margin: 0; max-width: 22ch; text-align: center; font-family: var(--font-display); font-weight: 500;${s.font.italic ? " font-style: italic;" : ""} font-size: clamp(26px, 4.4vw, 52px); line-height: 1.15; color: var(--ink); text-shadow: 0 2px 22px color-mix(in srgb, var(--panel) 80%, transparent); opacity: 0; }
.cap.on { opacity: 1; }
.cap.out { transition-duration: calc(.35s / var(--speed)) !important; }
${capCss(s.capFx)}

.note { position: absolute; ${notePlace[note]} z-index: 3; width: min(560px, calc(100vw - 32px)); padding: clamp(24px, 4vw, 40px); border-radius: 28px; background: color-mix(in srgb, var(--panel) 78%, transparent); border: 1px solid color-mix(in srgb, var(--ink) 16%, transparent); box-shadow: 0 30px 80px -30px rgba(0,0,0,.55); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); opacity: 0; visibility: hidden; transition: opacity calc(1.1s / var(--speed)) ease, visibility 0s linear calc(1.1s / var(--speed)), translate calc(1.1s / var(--speed)) cubic-bezier(.2,.8,.2,1); translate: 0 24px; cursor: auto; }
.note.on { opacity: 1; visibility: visible; translate: 0 0; transition-delay: 0s; }
.note .to { margin: 0 0 10px; font-size: 13px; letter-spacing: .16em; text-transform: uppercase; color: var(--c-1); font-weight: 600; }
.note h1 { margin: 0; font-family: var(--font-display); font-weight: 500;${s.font.italic ? " font-style: italic;" : ""} font-size: clamp(32px, 5vw, 56px); line-height: 1.08; color: var(--ink); }
.note p { margin: 16px 0 0; font-size: clamp(16px, 1.6vw, 18px); line-height: 1.65; color: color-mix(in srgb, var(--ink) 82%, transparent); }
.note .from { margin-top: 20px; font-family: var(--font-display); font-style: italic; font-size: 22px; color: var(--ink); }

.hint { position: absolute; left: 50%; bottom: clamp(20px, 4vh, 36px); z-index: 2; translate: -50% 0; margin: 0; padding: 8px 16px; border-radius: 999px; font-size: 13px; letter-spacing: .04em; color: var(--ink); background: color-mix(in srgb, var(--panel) 60%, transparent); opacity: .9; pointer-events: none; transition: opacity .6s; animation: nudge calc(2.4s / var(--speed)) ease-in-out infinite; }
.hint.off { opacity: 0; }
@keyframes nudge { 50% { translate: -50% -5px; } }
.dots { position: absolute; left: 16px; bottom: 26px; z-index: 3; display: flex; gap: 6px; }
.dots i { width: 7px; height: 7px; border-radius: 50%; background: var(--ink); opacity: .25; transition: opacity .4s, width .4s; }
.dots i.on { opacity: .9; width: 20px; border-radius: 4px; }
.controls { position: absolute; right: 16px; bottom: 16px; z-index: 4; display: flex; gap: 8px; }
.controls button { min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid color-mix(in srgb, var(--ink) 25%, transparent); background: color-mix(in srgb, var(--panel) 62%, transparent); color: var(--ink); font: 500 14px var(--font-text); cursor: pointer; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
.controls button:hover { background: color-mix(in srgb, var(--panel) 88%, transparent); }
.controls button:focus-visible { outline: 2px solid var(--c-1); outline-offset: 2px; }
@media (max-width: 640px) {
  .controls { bottom: 12px; right: 12px; }
  .controls button { padding: 0 12px; font-size: 13px; }
  .dots { bottom: 30px; }
  .hint { bottom: 70px; }
  .note { ${note === "left" || note === "right" ? "left: 16px; right: auto; top: 64px; bottom: auto; transform: none;" : note === "center" ? "" : ""} }
}
@media (prefers-reduced-motion: reduce) {
  .cap, .note, .hint { transition: none !important; animation: none !important; }
}
`;
}

function capCss(fx: CapFx): string {
  const t = "calc(1s / var(--speed))";
  if (fx === "blur") return `.cap { filter: blur(14px); transition: opacity ${t} ease, filter ${t} ease; }\n.cap.on { filter: blur(0); }`;
  if (fx === "scale") return `.cap { transform: scale(.82); transition: opacity ${t} ease, transform ${t} cubic-bezier(.2,.9,.25,1.2); }\n.cap.on { transform: scale(1); }`;
  if (fx === "slide") return `.cap { transform: translateX(-40px); transition: opacity ${t} ease, transform ${t} cubic-bezier(.2,.8,.2,1); }\n.cap.on { transform: none; }\n.cap.out { transform: translateX(40px); }`;
  if (fx === "letters")
    return `.cap { opacity: 1; }\n.cap .w { display: inline-block; white-space: pre; opacity: 0; transform: translateY(.5em) rotate(6deg); transition: opacity calc(.6s / var(--speed)) ease, transform calc(.6s / var(--speed)) cubic-bezier(.2,.8,.2,1); transition-delay: calc(var(--i) * 28ms / var(--speed)); }\n.cap.on .w { opacity: 1; transform: none; }`;
  return `.cap { transform: translateY(26px); transition: opacity ${t} ease, transform ${t} cubic-bezier(.2,.8,.2,1); }\n.cap.on { transform: none; }\n.cap.out { transform: translateY(-20px); }`;
}

const ENGINE = String.raw`
const stage = document.querySelector(".stage");
const cv = document.getElementById("cv");
const g = cv.getContext("2d");
const caps = [...document.querySelectorAll(".cap")];
const note = document.querySelector(".note");
const hint = document.querySelector(".hint");
const dots = [...document.querySelectorAll(".dots i")];
const btnPause = document.getElementById("pause");
const btnAgain = document.getElementById("again");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const N = caps.length + 1; /* babak terakhir = kartu ucapan */
const css = getComputedStyle(document.documentElement);
const COL = {};
function readColors() { for (const k of ["bg-1", "bg-2", "bg-3", "c-1", "c-2", "c-3", "ink", "panel"]) COL[k] = css.getPropertyValue("--" + k).trim() || "#888"; COL.speed = parseFloat(css.getPropertyValue("--speed")) || 1; }
readColors();

/* Huruf berjatuhan untuk efek "letters". */
for (const c of caps) if (c.dataset.fx === "letters") { const words = c.textContent.split(/(\s+)/); c.textContent = ""; let i = 0; for (const w of words) { const s = document.createElement("span"); s.className = "w"; s.style.setProperty("--i", i++); s.textContent = w; c.appendChild(s); } }

/* Bantuan untuk adegan. */
let seed = 7;
const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const seg = (v, a, b) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
function rgba(hex, a) {
  const m = /rgba?\(([^)]+)\)/.exec(hex); if (m) { const v = m[1].split(","); return "rgba(" + v[0] + "," + v[1] + "," + v[2] + "," + a + ")"; }
  let h = String(hex).replace("#", ""); if (h.length === 3) h = h.split("").map((x) => x + x).join("");
  const n = parseInt(h.slice(0, 6), 16); if (isNaN(n)) return "rgba(255,255,255," + a + ")";
  return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
}
function mix(h1, h2, t) {
  const p = (h) => { const m = /rgba?\(([^)]+)\)/.exec(h); if (m) return m[1].split(",").map(Number); let s = String(h).replace("#", ""); if (s.length === 3) s = s.split("").map((x) => x + x).join(""); const n = parseInt(s.slice(0, 6), 16) || 0; return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const a = p(h1), b = p(h2); return "rgb(" + Math.round(lerp(a[0], b[0], t)) + "," + Math.round(lerp(a[1], b[1], t)) + "," + Math.round(lerp(a[2], b[2], t)) + ")";
}
function glowDot(x, y, r, color, a) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, rgba(color, a)); gr.addColorStop(1, rgba(color, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); }
function heart(x, y, s) { g.beginPath(); g.moveTo(x, y + s * 0.35); g.bezierCurveTo(x, y, x - s * 0.5, y - s * 0.1, x - s * 0.5, y + s * 0.25); g.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s); g.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.25); g.bezierCurveTo(x + s * 0.5, y - s * 0.1, x, y, x, y + s * 0.35); g.fill(); }
/* Titik-titik pembentuk teks (untuk partikel yang menyusun kata). */
function textPoints(text, w, h, step, font) {
  const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d");
  let fs = h * 0.8; x.font = (font || "700 ") + fs + "px " + (css.getPropertyValue("--font-display") || "serif");
  while (x.measureText(text).width > w * 0.94 && fs > 10) { fs -= 4; x.font = (font || "700 ") + fs + "px " + (css.getPropertyValue("--font-display") || "serif"); }
  x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, w / 2, h / 2);
  const d = x.getImageData(0, 0, w, h).data, pts = [];
  for (let yy = 0; yy < h; yy += step) for (let xx = 0; xx < w; xx += step) if (d[(yy * w + xx) * 4 + 3] > 120) pts.push([xx / w - 0.5, yy / h - 0.5]);
  return pts;
}

let W = 0, H = 0, DPR = 1;
const api = { g, COL, CONFIG, rnd, clamp, lerp, ease, seg, rgba, mix, glowDot, heart, textPoints, get W() { return W; }, get H() { return H; }, get small() { return W < 640; } };
const S = scene(api);

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = cv.clientWidth; H = cv.clientHeight;
  cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (S.resize) S.resize(W, H);
}

/* Waktu cerita: B naik pelan menuju target; target naik satu babak tiap detikPerBabak. */
let B = 0, target = 0, t = 0, last = 0, raf = 0, paused = false, held = 0, frameN = 0, shown = -1;
const beatSec = () => Math.max(1.5, +CONFIG.detikPerBabak || 4.5) / COL.speed;
function setBeat(i) {
  if (i === shown) return; shown = i;
  caps.forEach((c, k) => { c.classList.toggle("on", k === i); c.classList.toggle("out", k < i); c.setAttribute("aria-hidden", k === i ? "false" : "true"); });
  note.classList.toggle("on", i >= N - 1);
  dots.forEach((d, k) => d.classList.toggle("on", k === i));
  if (i > 0) hint.classList.add("off");
}
function next() { if (target < N - 1) { target = Math.min(N - 1, Math.floor(target + 1e-6) + 1); held = 0; } }
function frame(now) {
  const dt = Math.max(0, Math.min(0.05, (now - last) / 1000 || 0.016)); last = now;
  if (!paused) {
    t += dt * COL.speed;
    held += dt;
    if (CONFIG.majuOtomatis !== false && held > beatSec() && target < N - 1) next();
    B += (target - B) * Math.min(1, dt * 1.6 * COL.speed);
    if (Math.abs(target - B) < 0.002) B = target;
  }
  if (++frameN % 30 === 0) readColors();
  setBeat(Math.min(N - 1, Math.round(B - 0.2 < 0 ? 0 : B - 0.2)));
  g.clearRect(0, 0, W, H);
  S.draw(t, B, dt);
  raf = requestAnimationFrame(frame);
}
function start() { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); }
function still() { cancelAnimationFrame(raf); B = target = N - 1; t = 20; setBeat(N - 1); g.clearRect(0, 0, W, H); S.draw(t, B, 0); }

stage.addEventListener("click", (e) => { if (e.target.closest(".note, .controls")) return; next(); });
addEventListener("keydown", (e) => { if ((e.key === " " || e.key === "ArrowRight" || e.key === "Enter") && !e.target.closest("button, a")) { e.preventDefault(); next(); } });
btnPause.addEventListener("click", () => { paused = !paused; btnPause.textContent = paused ? "Lanjutkan" : "Jeda"; btnPause.setAttribute("aria-pressed", String(paused)); stage.classList.toggle("paused", paused); });
btnAgain.addEventListener("click", () => { B = target = 0; held = 0; t = 0; shown = -1; hint.classList.remove("off"); if (S.reset) S.reset(); if (reduce.matches) { still(); return; } paused = false; btnPause.textContent = "Jeda"; start(); });
document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce.matches && !window.OWD_THUMB) start(); });
reduce.addEventListener("change", () => (reduce.matches ? still() : start()));
addEventListener("resize", () => { resize(); if (reduce.matches || window.OWD_THUMB) still(); });

resize();
if (window.OWD_THUMB || reduce.matches) still();
else { setBeat(0); start(); }
`;

export function buildAnim2(s: Anim2Spec): string {
  const capHtml = s.beats
    .map((b, i) => `<p class="cap" data-fx="${s.capFx}"${ot(`babak${i + 1}`, `Teks babak ${i + 1}`)}>${esc(b)}</p>`)
    .join("\n");
  const config = { detikPerBabak: s.beatSec ?? 4.5, majuOtomatis: true, ...(s.config ?? {}) };
  const body = `
<div class="stage">
<canvas id="cv" aria-hidden="true"></canvas>
<div class="caps" aria-live="polite">
${capHtml}
</div>
<main class="note">
  <p class="to"${ot("untuk", "Untuk (sapaan)")}>${esc(s.to)}</p>
  <h1${ot("judul", "Judul")}>${esc(s.heading)}</h1>
  <p${ot("pesan", "Pesan", true)}>${esc(s.text)}</p>
  <p class="from"${ot("dari", "Dari (tanda tangan)")}>${esc(s.from)}</p>
</main>
<p class="hint"${ot("petunjuk", "Petunjuk ketuk")}>${esc(s.hint)}</p>
<div class="dots" aria-hidden="true">${Array.from({ length: s.beats.length + 1 }, () => "<i></i>").join("")}</div>
<div class="controls">
  <button type="button" id="pause" aria-pressed="false">Jeda</button>
  <button type="button" id="again">Ulangi</button>
</div>
</div>
<script>
/* ==== PENGATURAN: lama tiap babak (detik), maju otomatis, dan data adegan ==== */
const CONFIG = ${dataBlock("CONFIG", s.configLabel ?? "Pengaturan animasi", config)};
${s.scene.trim()}
${ENGINE.trim()}
</script>`;
  return doc({
    title: s.title,
    description: s.description,
    theme: s.colors.bg1,
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${s.font.href}">`,
    vars: vars(s),
    css: css(s),
    body,
  });
}
