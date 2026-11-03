import { dataBlock, doc, esc, oh, ot, type ThemeVar } from "./shared";

/* ================================================================== */
/* Kategori WEBSITE FULL 3D (scroll-driven).                            */
/* Library: three + lenis (versi dipatok), dimuat lewat LIB_LOADER.    */
/*                                                                    */
/* - Satu canvas WebGL fixed di latar, satu konteks per halaman.        */
/* - Kamera bergerak di jalur (CatmullRom) mengikuti progres scroll;   */
/*   tiap section punya adegan 3D sendiri, semuanya prosedural.          */
/* - Konten = HTML biasa di atas canvas (terbaca mesin pencari &        */
/*   pembaca layar).                                                    */
/* - Konten tampil langsung di atas latar gradasi; adegan 3D muncul    */
/*   perlahan setelah siap (v19: loader tidak lagi menutupi halaman).   */
/* - Deteksi WebGL, fallback gradasi CSS.                               */
/* - Anggaran: pixel ratio maks 2 (turun otomatis bila lambat), maks    */
/*   50.000 segitiga, render berhenti saat canvas tidak terlihat,       */
/*   dispose lengkap saat halaman ditinggalkan.                         */
/* ================================================================== */

/** CDN utama + cadangan (berkas & versi sama). */
export const CDNS = ["https://cdn.jsdelivr.net/npm/", "https://unpkg.com/"];
export const THREE_PATH = "three@0.169.0/build/three.module.min.js";
export const LENIS_PATH = "lenis@1.1.13/dist/lenis.mjs";
export const THREE_URL = CDNS[0] + THREE_PATH;
export const LENIS_URL = CDNS[0] + LENIS_PATH;
/** CSS bawaan lenis 1.1.13 disisipkan langsung: stylesheet dari CDN menahan tampilan pertama (dan menggantung bila CDN terblokir). */
export const LENIS_STYLE = `<style>html.lenis,html.lenis body{height:auto}.lenis.lenis-smooth{scroll-behavior:auto!important}.lenis.lenis-smooth [data-lenis-prevent]{overscroll-behavior:contain}.lenis.lenis-stopped{overflow:hidden}.lenis.lenis-smooth iframe{pointer-events:none}</style>`;

/** Font Google tanpa menahan tampilan: teks muncul dengan font sistem dulu, lalu berganti. */
export const fontLink = (href: string) => `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="${href}"></noscript>`;

/** Petunjuk di <head>: unduhan library dimulai sejak awal, bukan setelah seluruh HTML terbaca. */
export const PRELOAD = `<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<link rel="modulepreload" href="${THREE_URL}">
<link rel="modulepreload" href="${LENIS_URL}">`;

/**
 * Pemuat library (awal skrip modul). Bila CDN utama gagal atau belum
 * selesai dalam 4 detik, CDN cadangan ikut dicoba; yang lebih dulu
 * selesai dipakai. esm() = modul ES, umd() = skrip klasik (sekali jalan).
 */
export const LIB_LOADER = String.raw`/* ---- Pemuat library: CDN utama + cadangan ---- */
const CDN = ${JSON.stringify(CDNS)};
function race(path, get) {
  const order = CDN.slice();
  return new Promise((ok, no) => {
    let i = 0, fails = 0, done = false;
    const next = () => {
      const cdn = order[i++], url = cdn + path;
      /* CDN yang menang dipakai lebih dulu untuk library berikutnya. */
      get(url).then((v) => { if (!done) { done = true; CDN.splice(CDN.indexOf(cdn), 1); CDN.unshift(cdn); ok(v); } }, () => { if (++fails === CDN.length) no(new Error("Gagal memuat " + path)); else if (i < CDN.length) next(); });
      if (i < CDN.length) setTimeout(() => { if (!done && i < CDN.length) next(); }, 4000);
    };
    next();
  });
}
const esm = (path) => race(path, (u) => import(u));
const umd = (path) => race(path, (u) => fetch(u).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); })).then((code) => { const s = document.createElement("script"); s.textContent = code; document.head.appendChild(s); });
const libFail = (e) => { document.documentElement.classList.add("no-webgl"); document.documentElement.classList.remove("loading"); throw e; };`;

/** Awal skrip modul: THREE & Lenis dari pemuat di atas. */
export const LIB_IMPORTS = `${LIB_LOADER}
const [THREE, { default: Lenis }] = await Promise.all([esm(${JSON.stringify(THREE_PATH)}), esm(${JSON.stringify(LENIS_PATH)})]).catch(libFail);`;

/** Skrip klasik kecil di <head>: kelas js/loading + batas waktu fallback bila library tidak kunjung termuat. */
export const BOOT = `<script>
document.documentElement.classList.add("js", "loading");
setTimeout(function () { var r = document.documentElement; if (!r.classList.contains("webgl") && !r.classList.contains("no-webgl")) { r.classList.add("no-webgl"); r.classList.remove("loading"); } }, 12000);
</script>`;

interface Section {
  id: string;
  /** Posisi teks: kiri, kanan, tengah. */
  align: "left" | "right" | "center";
  kicker?: string;
  title: string;
  /** Paragraf (HTML sederhana diizinkan: <strong>, <em>). */
  body: string[];
  list?: string[];
  cta?: { label: string; href: string; ghost?: boolean }[];
  /** Kamera & titik pandang untuk section ini (koordinat dunia). */
  cam: [number, number, number];
  look: [number, number, number];
  /** Posisi pusat adegan 3D section ini. */
  at: [number, number, number];
}

export interface Web3DSpec {
  id: string;
  title: string;
  description: string;
  brand: string;
  nav: { label: string; href: string }[];
  font: { display: string; text: string; href: string };
  colors: { bg: string; fog: string; ink: string; inkSoft: string; accent: string; accent2: string; panel: string; fallback: string; light: string; dark: boolean; ground?: string };
  fog: number;
  sections: Section[];
  contact: { title: string; text: string; email: string; cta: string; address: string };
  /** Pembangun adegan (kode JS): array fungsi (ctx, group) => { update?(t, dt) }. */
  scenes: string;
}

/* ------------------------------- CSS ------------------------------- */

/** Variabel tema (form Warna & gaya). Warna latar & aksen juga dipakai adegan 3D. */
export function web3dVars(s: Web3DSpec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--accent", value: c.accent, label: "Warna aksen (tombol, objek 3D)" },
    { name: "--accent-2", value: c.accent2, label: "Warna aksen kedua (objek 3D)" },
    { name: "--bg", value: c.bg, label: "Latar halaman dan adegan 3D" },
    { name: "--ink", value: c.ink, label: "Warna teks" },
    { name: "--ink-soft", value: c.inkSoft, label: "Warna teks sekunder" },
  ];
}

export function web3dCss(s: Web3DSpec): string {
  const c = s.colors;
  return `
:root {
  --panel: ${c.panel}; --fallback: ${c.fallback};
  --font-display: "${s.font.display}", system-ui, sans-serif;
  --font-text: "${s.font.text}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html { background: var(--bg); }
body { margin: 0; color: var(--ink); font: 17px/1.65 var(--font-text); background: var(--fallback); background-attachment: fixed; -webkit-font-smoothing: antialiased; }
html.webgl body { background: var(--bg); }
a { color: inherit; }
#gl { position: fixed; inset: 0; width: 100%; height: 100%; display: block; z-index: 0; opacity: 0; transition: opacity 1s; }
html.webgl #gl { opacity: 1; }
html.no-webgl #gl { display: none; }

/* Loading: penanda kecil di bawah, konten tetap terbaca selama adegan 3D dimuat. */
.loader { position: fixed; left: 50%; bottom: 20px; z-index: 30; display: none; transform: translateX(-50%); padding: 10px 16px 12px; border-radius: 999px; background: var(--panel); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); color: var(--ink); pointer-events: none; }
html.loading .loader { display: block; }
.loader p { margin: 8px 0 0; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); text-align: center; }
.loader .bar { width: 140px; height: 2px; background: color-mix(in srgb, var(--ink) 15%, transparent); overflow: hidden; border-radius: 2px; }
.loader .bar i { display: block; width: 40%; height: 100%; background: var(--accent); animation: load 1.1s ease-in-out infinite; }
@keyframes load { from { transform: translateX(-100%); } to { transform: translateX(260%); } }

/* Navigasi */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 20; display: flex; align-items: center; gap: 24px; padding: 16px clamp(16px, 4vw, 48px); background: linear-gradient(to bottom, color-mix(in srgb, var(--bg) 88%, transparent), transparent); }
.brand { font-family: var(--font-display); font-weight: 700; font-size: 20px; text-decoration: none; letter-spacing: -.01em; }
.nav ul { display: flex; gap: 4px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 999px; text-decoration: none; font-size: 15px; color: var(--ink-soft); }
.nav ul a:hover, .nav ul a:focus-visible { color: var(--ink); background: color-mix(in srgb, var(--ink) 10%, transparent); }
@media (max-width: 760px) { .nav ul { display: none; } }

/* Section */
main { position: relative; z-index: 1; }
.sec { min-height: 120vh; display: flex; align-items: center; padding: 120px clamp(16px, 6vw, 96px); }
.sec.hero { min-height: 100vh; }
.sec.right { justify-content: flex-end; }
.sec.center { justify-content: center; text-align: center; }
.panel { max-width: 520px; padding: clamp(22px, 3vw, 34px); border-radius: 22px; background: var(--panel); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid color-mix(in srgb, var(--ink) 12%, transparent); }
.hero .panel { background: none; border: 0; backdrop-filter: none; -webkit-backdrop-filter: none; padding: 0; max-width: 680px; }
.kicker { margin: 0 0 14px; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); font-weight: 600; }
h1, h2 { margin: 0; font-family: var(--font-display); font-weight: 700; letter-spacing: -.02em; line-height: 1.05; }
h1 { font-size: clamp(42px, 7.5vw, 92px); }
h2 { font-size: clamp(30px, 4.4vw, 52px); }
.panel p { margin: 16px 0 0; color: var(--ink-soft); }
.panel strong { color: var(--ink); }
.panel ul { margin: 18px 0 0; padding: 0; list-style: none; display: grid; gap: 10px; }
.panel li { display: flex; gap: 10px; align-items: baseline; }
.panel li::before { content: ""; flex: none; width: 8px; height: 8px; border-radius: 2px; background: var(--accent); transform: translateY(-1px) rotate(45deg); }
.center .panel li { justify-content: center; }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 26px; }
.center .ctas { justify-content: center; }
.btn { display: inline-flex; align-items: center; justify-content: center; min-height: 48px; padding: 0 22px; border-radius: 999px; background: var(--accent); color: ${c.dark ? "#0b0b14" : "#ffffff"}; font-weight: 600; text-decoration: none; transition: transform .2s; }
.btn:hover { transform: translateY(-2px); }
.btn.ghost { background: transparent; color: var(--ink); border: 1.5px solid color-mix(in srgb, var(--ink) 40%, transparent); }
.btn:focus-visible, .brand:focus-visible, .nav a:focus-visible { outline: 3px solid var(--accent-2); outline-offset: 3px; }

/* Kontak (penutup, menutupi canvas: render berhenti di sini) */
.contact { position: relative; z-index: 1; padding: clamp(80px, 12vw, 140px) clamp(16px, 6vw, 96px) 48px; background: var(--bg); border-top: 1px solid color-mix(in srgb, var(--ink) 12%, transparent); }
.contact h2 { max-width: 16ch; }
.contact p { max-width: 52ch; color: var(--ink-soft); }
.contact .mail { display: inline-block; margin-top: 18px; font-family: var(--font-display); font-size: clamp(22px, 3.4vw, 38px); color: var(--accent); text-decoration-thickness: 2px; text-underline-offset: 6px; }
.contact footer { margin-top: 64px; font-size: 14px; color: var(--ink-soft); display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; }

.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
@media (max-width: 640px) {
  .sec { min-height: 110vh; padding: 96px 16px; align-items: flex-end; }
  .sec.right, .sec.center { justify-content: flex-start; text-align: left; }
  .center .ctas, .center .panel li { justify-content: flex-start; }
}
@media (prefers-reduced-motion: reduce) { #gl, .loader { transition: none; } .loader .bar i { animation: none; } }
`;
}

/* ------------------------------- mesin ----------------------------- */

const ENGINE = String.raw`
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;
const canvas = document.getElementById("gl");
const sections = [...document.querySelectorAll("[data-adegan]")];

function fail(reason) {
  root.classList.add("no-webgl");
  root.classList.remove("loading", "webgl");
  console.warn("[owd] Mode 3D tidak aktif, memakai latar gradasi:", reason);
}
function hasWebGL() {
  try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; }
}

/* RNG deterministik supaya adegan sama di setiap kunjungan. */
function seeded(seed) { let a = seed >>> 0; return () => { a = (a + 0x6d2b79f5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

function triangles(obj) {
  let n = 0;
  obj.traverse((o) => {
    if (!o.isMesh || !o.geometry) return;
    const g = o.geometry;
    const per = (g.index ? g.index.count : g.attributes.position.count) / 3;
    n += per * (o.isInstancedMesh ? o.count : 1);
  });
  return Math.round(n);
}

/* Warna latar & aksen diambil dari variabel CSS (satu tempat untuk diubah). */
const cssv = getComputedStyle(root);
const cv = (name, fallback) => cssv.getPropertyValue(name).trim() || fallback;
const WARNA = Object.assign({}, CONFIG.warna, { latar: cv("--bg", "#000000"), aksen: cv("--accent", "#ffffff"), aksen2: cv("--accent-2", "#ffffff") });

if (!hasWebGL()) fail("WebGL tidak tersedia di perangkat ini");
else {
  try { start(); } catch (e) { fail(e && e.message ? e.message : String(e)); }
}

function start() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, CONFIG.maksPixelRatio);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(WARNA.latar);
  scene.fog = new THREE.FogExp2(WARNA.kabut, CONFIG.kepadatanKabut);
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400);
  scene.add(new THREE.HemisphereLight(WARNA.langit, WARNA.tanah, 1.4));
  const sun = new THREE.DirectionalLight(WARNA.cahaya, 2.2);
  sun.position.set(12, 20, 10);
  scene.add(sun);

  const ctx = { THREE, scene, camera, rand: seeded(CONFIG.benih), warna: WARNA, reduce };
  const parts = SCENES.map((build, i) => {
    const group = new THREE.Group();
    group.position.fromArray(CONFIG.adegan[i].pusat);
    scene.add(group);
    const api = build(ctx, group, i) || {};
    return { group, update: api.update, center: group.position.clone() };
  });
  if (GLOBAL) GLOBAL(ctx);

  /* Anggaran segitiga */
  const tris = triangles(scene);
  window.__OWD_STATS = { triangles: tris, budget: CONFIG.maksSegitiga, contexts: 1 };
  if (tris > CONFIG.maksSegitiga) console.warn("[owd] Melebihi anggaran segitiga:", tris);

  /* Jalur kamera: satu titik per section, dihaluskan dengan CatmullRom. */
  const v = (a) => new THREE.Vector3(a[0], a[1], a[2]);
  const camPath = new THREE.CatmullRomCurve3(CONFIG.adegan.map((a) => v(a.kamera)), false, "centripetal");
  const lookPath = new THREE.CatmullRomCurve3(CONFIG.adegan.map((a) => v(a.lihat)), false, "centripetal");
  const N = CONFIG.adegan.length;

  /* Progres scroll: kamera "berhenti" sejenak di tiap adegan (dwell), lalu pindah. */
  let stops = [];
  function measure() {
    const y0 = window.scrollY;
    stops = sections.map((s) => { const r = s.getBoundingClientRect(); return r.top + y0 + r.height / 2 - innerHeight / 2; });
  }
  const smooth = (x) => x * x * (3 - 2 * x);
  function targetU() {
    const y = window.scrollY;
    if (y <= stops[0]) return 0;
    for (let i = 0; i < stops.length - 1; i++) {
      if (y < stops[i + 1]) {
        const f = (y - stops[i]) / (stops[i + 1] - stops[i]);
        const d = Math.min(1, Math.max(0, (f - 0.18) / 0.64));
        return (i + smooth(d)) / (N - 1);
      }
    }
    return 1;
  }

  /* Pointer: kamera bergeser sedikit (desktop). */
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const finePointer = matchMedia("(pointer: fine)").matches;
  if (finePointer && !reduce) addEventListener("pointermove", (e) => { pointer.tx = (e.clientX / innerWidth - 0.5) * 2; pointer.ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });

  /* Komposisi: objek digeser ke sisi yang berlawanan dengan teks (setViewOffset).
     Di layar tegak teks ada di bawah, jadi objek digeser ke atas. */
  function frameView(uu) {
    const w = innerWidth, h = innerHeight;
    const k = uu * (N - 1), i = Math.min(N - 2, Math.floor(k)), f = k - i;
    const a = CONFIG.adegan[i].geser, b = CONFIG.adegan[i + 1].geser;
    const gx = a[0] + (b[0] - a[0]) * f, gy = a[1] + (b[1] - a[1]) * f;
    if (w < h) camera.setViewOffset(w, h, 0, h * 0.16, w, h);
    else camera.setViewOffset(w, h, gx * w * 0.2, gy * h * 0.16, w, h);
  }

  function resize() {
    const w = innerWidth, h = innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.fov = w < h ? 68 : 55;
    camera.updateProjectionMatrix();
    measure();
  }
  addEventListener("resize", resize);
  resize();

  /* Lenis: gulir halus (dimatikan bila pengguna memilih kurangi gerak). */
  let lenis = null;
  if (!reduce) lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const t = document.querySelector(a.getAttribute("href"));
    if (!t) return;
    e.preventDefault();
    if (lenis) lenis.scrollTo(t, { offset: 0 }); else t.scrollIntoView();
    t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true });
  }));

  /* Render hanya saat ada section 3D yang terlihat dan tab aktif. */
  let visible = true;
  const seen = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => (en.isIntersecting ? seen.add(en.target) : seen.delete(en.target)));
    visible = seen.size > 0;
  });
  sections.forEach((s) => io.observe(s));

  let u = targetU();
  const camPos = new THREE.Vector3(), lookAt = new THREE.Vector3();
  const clock = new THREE.Clock();
  let raf = 0, frames = 0, slow = 0, first = true;

  function frame(time) {
    raf = requestAnimationFrame(frame);
    if (lenis) lenis.raf(time);
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!visible || document.hidden) return;
    const tu = targetU();
    u = reduce ? tu : u + (tu - u) * Math.min(1, dt * 4);
    camPath.getPointAt(u, camPos);
    lookPath.getPointAt(u, lookAt);
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 3);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 3);
    camera.position.copy(camPos).add(new THREE.Vector3(pointer.x * 1.2, -pointer.y * 0.7, 0));
    camera.lookAt(lookAt);
    frameView(u);
    const t = clock.elapsedTime;
    for (const p of parts) {
      const near = p.center.distanceTo(camPos) < CONFIG.jarakAktif;
      p.group.visible = near;
      if (near && p.update && !reduce) p.update(t, dt);
    }
    renderer.render(scene, camera);
    if (first) { first = false; root.classList.add("webgl"); root.classList.remove("loading"); }
    /* Turunkan pixel ratio bila rata-rata frame > 22 ms (target 60 fps). */
    frames++;
    if (dt > 0.022) slow++;
    if (frames === 90) {
      if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); }
      frames = 0; slow = 0;
    }
  }

  if (window.OWD_THUMB) {
    camPath.getPointAt(0, camPos); lookPath.getPointAt(0, lookAt);
    camera.position.copy(camPos); camera.lookAt(lookAt); frameView(0);
    parts.forEach((p) => p.update && p.update(1.5, 0.016));
    renderer.render(scene, camera);
    root.classList.add("webgl"); root.classList.remove("loading");
    return;
  }
  raf = requestAnimationFrame(frame);

  /* Bersihkan semuanya saat halaman ditinggalkan. */
  function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (lenis) lenis.destroy();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((mat) => { for (const k in mat) { const val = mat[k]; if (val && val.isTexture) val.dispose(); } mat.dispose(); });
    });
    renderer.dispose();
    renderer.forceContextLoss();
  }
  addEventListener("pagehide", dispose, { once: true });
  window.__OWD_DISPOSE = dispose;
}
`;

/* ------------------------------- HTML ------------------------------ */

function sectionHtml(s: Section, i: number): string {
  const H = i === 0 ? "h1" : "h2";
  const k = `s${i + 1}`;
  const label = `Bagian ${i + 1}`;
  const list = s.list ? `<ul>${s.list.map((x, j) => `<li${ot(`${k}Poin${j + 1}`, `${label}: poin ${j + 1}`)}>${esc(x)}</li>`).join("")}</ul>` : "";
  const cta = s.cta ? `<div class="ctas">${s.cta.map((c, j) => `<a class="btn${c.ghost ? " ghost" : ""}" href="${c.href}"${ot(`${k}Tombol${j + 1}`, `${label}: tombol ${j + 1}`)}>${esc(c.label)}</a>`).join("")}</div>` : "";
  return `<section id="${s.id}" class="sec ${s.align}${i === 0 ? " hero" : ""}" data-adegan="${i}" aria-labelledby="${s.id}-t">
  <div class="panel">
    ${s.kicker ? `<p class="kicker"${ot(`${k}Label`, `${label}: label kecil`)}>${esc(s.kicker)}</p>` : ""}
    <${H} id="${s.id}-t"${ot(`${k}Judul`, `${label}: judul`)}>${esc(s.title)}</${H}>
    ${s.body.map((p, j) => `<p${ot(`${k}Teks${j + 1}`, `${label}: paragraf ${j + 1}`, true)}>${esc(p)}</p>`).join("\n    ")}
    ${list}${cta}
  </div>
</section>`;
}

export function buildWeb3D(s: Web3DSpec): string {
  const config = {
    maksPixelRatio: 2,
    maksSegitiga: 50000,
    jarakAktif: 95,
    benih: 7,
    kepadatanKabut: s.fog,
    warna: { kabut: s.colors.fog, langit: s.colors.light, tanah: s.colors.ground ?? s.colors.bg, cahaya: "#ffffff" },
    adegan: s.sections.map((x) => ({ id: x.id, pusat: x.at, kamera: x.cam, lihat: x.look, geser: x.align === "left" ? [-1, 0] : x.align === "right" ? [1, 0] : [0, -1] })),
  };
  const body = `
<div class="loader" role="status" aria-live="polite"><div><div class="bar"><i></i></div><p>Memuat adegan 3D</p></div></div>
<canvas id="gl" aria-hidden="true"></canvas>
<header class="nav">
  <a class="brand" href="#${s.sections[0].id}"${ot("merek", "Nama merek")}>${esc(s.brand)}</a>
  <nav aria-label="Navigasi utama"><ul>${s.nav.map((x, i) => `<li><a href="${x.href}"${ot(`menu${i + 1}`, `Menu ${i + 1}`)}>${esc(x.label)}</a></li>`).join("")}</ul></nav>
</header>
<main>
${s.sections.map(sectionHtml).join("\n")}
</main>
<section class="contact" id="kontak" aria-labelledby="kontak-t">
  <h2 id="kontak-t"${ot("kontakJudul", "Kontak: judul")}>${esc(s.contact.title)}</h2>
  <p${ot("kontakTeks", "Kontak: teks", true)}>${esc(s.contact.text)}</p>
  <a class="mail" href="mailto:${s.contact.email}"${oh("email", "Tautan email (mailto:)")}${ot("emailTeks", "Alamat email yang ditampilkan")}>${esc(s.contact.email)}</a>
  <div class="ctas"><a class="btn" href="mailto:${s.contact.email}"${oh("email", "Tautan email (mailto:)")}${ot("kontakTombol", "Kontak: tulisan tombol")}>${esc(s.contact.cta)}</a></div>
  <footer><span${ot("merek", "Nama merek")}>${esc(s.brand)}</span><span${ot("alamat", "Alamat / kota")}>${esc(s.contact.address)}</span><span${ot("catatanKaki", "Catatan kaki")}>Konten dan nama di halaman ini fiktif.</span></footer>
</section>
<script type="module">
${LIB_IMPORTS}

/* ==== KONFIGURASI: warna 3D, anggaran, dan jalur kamera per section ==== */
const CONFIG = ${dataBlock("CONFIG", "Pengaturan 3D", config, ["maksPixelRatio", "maksSegitiga", "jarakAktif", "benih", "adegan"])};
/* ==================================================================== */

/* Adegan per section (urutan = urutan section). Semua bentuk prosedural. */
${s.scenes.trim()}
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
${BOOT}`,
    vars: web3dVars(s),
    css: web3dCss(s),
    body,
  });
}

/* ------------------------------ adegan ----------------------------- */

const SCENES_NEBULA = String.raw`
const GLOBAL = (ctx) => {
  /* Bintang di seluruh jalur (Points, bukan segitiga). */
  const { THREE, rand } = ctx;
  const n = 1800, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (rand() - 0.5) * 220; pos[i * 3 + 1] = (rand() - 0.5) * 140; pos[i * 3 + 2] = 30 - rand() * 240; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  ctx.scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xdfe6ff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.85, fog: false })));
};
const SCENES = [
  /* 0. Planet bercincin */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const planet = new THREE.Mesh(new THREE.IcosahedronGeometry(6, 12), new THREE.MeshStandardMaterial({ color: 0x2a2470, emissive: new THREE.Color(warna.aksen), emissiveIntensity: 0.18, roughness: 0.65, flatShading: true }));
    const atmo = new THREE.Mesh(new THREE.IcosahedronGeometry(6.6, 12), new THREE.MeshBasicMaterial({ color: warna.aksen2, transparent: true, opacity: 0.12, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    const ring = new THREE.Mesh(new THREE.RingGeometry(8.5, 12.5, 96, 1), new THREE.MeshBasicMaterial({ color: warna.aksen, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.set(Math.PI / 2.3, 0.2, 0);
    g.add(planet, atmo, ring);
    return { update: (t) => { planet.rotation.y = t * 0.08; ring.rotation.z = t * 0.05; } };
  },
  /* 1. Gugus kristal (instanced) */
  (ctx, g) => {
    const { THREE, rand, warna } = ctx;
    const count = 40;
    const mesh = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0xbcb4ff, emissive: new THREE.Color(warna.aksen), emissiveIntensity: 0.25, metalness: 0.2, roughness: 0.15, flatShading: true }), count);
    const data = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) data.push({ p: new THREE.Vector3((rand() - 0.5) * 18, (rand() - 0.5) * 12, (rand() - 0.5) * 14), s: 0.4 + rand() * 1.6, r: rand() * 6, v: 0.2 + rand() * 0.6 });
    g.add(mesh);
    const place = (t) => { data.forEach((d, i) => { e.set(d.r + t * d.v, d.r * 2 + t * d.v * 0.7, 0); q.setFromEuler(e); p.copy(d.p); p.y += Math.sin(t * 0.6 + d.r) * 0.4; s.setScalar(d.s); m.compose(p, q, s); mesh.setMatrixAt(i, m); }); mesh.instanceMatrix.needsUpdate = true; };
    place(0);
    return { update: place };
  },
  /* 2. Giroskop tiga cincin */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const mat = new THREE.MeshStandardMaterial({ color: 0xe8e6ff, metalness: 0.85, roughness: 0.25 });
    const rings = [5, 4, 3].map((r, i) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, 0.16, 12, 120), mat); m.rotation.x = i * 0.9; g.add(m); return m; });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.5, 3), new THREE.MeshStandardMaterial({ color: warna.aksen2, emissive: new THREE.Color(warna.aksen2), emissiveIntensity: 0.9 }));
    g.add(core);
    const light = new THREE.PointLight(warna.aksen2, 60, 30); g.add(light);
    return { update: (t) => { rings[0].rotation.y = t * 0.5; rings[1].rotation.x = t * 0.7; rings[2].rotation.z = t * 0.9; core.scale.setScalar(1 + Math.sin(t * 2) * 0.06); } };
  },
  /* 3. Sabuk asteroid */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const count = 180;
    const mesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0x8c88a8, roughness: 0.9, flatShading: true }), count);
    const data = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) data.push({ a: rand() * Math.PI * 2, r: 7 + rand() * 9, y: (rand() - 0.5) * 3, s: 0.2 + rand() ** 2 * 1.1, w: 0.04 + rand() * 0.08, k: rand() * 6 });
    g.add(mesh);
    g.rotation.x = 0.35;
    const place = (t) => { data.forEach((d, i) => { const a = d.a + t * d.w; p.set(Math.cos(a) * d.r, d.y, Math.sin(a) * d.r); e.set(d.k + t * 0.3, d.k, 0); q.setFromEuler(e); s.setScalar(d.s); m.compose(p, q, s); mesh.setMatrixAt(i, m); }); mesh.instanceMatrix.needsUpdate = true; };
    place(0);
    return { update: place };
  },
  /* 4. Lorong portal */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const count = 24;
    const mesh = new THREE.InstancedMesh(new THREE.TorusGeometry(6, 0.07, 6, 48), new THREE.MeshBasicMaterial({ color: 0xffffff }), count);
    const m = new THREE.Matrix4(), c = new THREE.Color(), a = new THREE.Color(warna.aksen), b = new THREE.Color(warna.aksen2);
    for (let i = 0; i < count; i++) { m.makeTranslation(0, 0, -i * 2.2); mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.copy(a).lerp(b, i / count)); }
    g.add(mesh);
    return { update: (t) => { g.rotation.z = t * 0.15; } };
  },
];
`;

const SCENES_LAPIS = String.raw`
const GLOBAL = (ctx) => {
  const { THREE } = ctx;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0xe6dccd, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -4; ctx.scene.add(floor);
};
const SAND = 0xdccab2, CLAY = 0xc0643f, STONE = 0xf3ece2;
const SCENES = [
  /* 0. Deret lengkung (extrude) */
  (ctx, g) => {
    const { THREE } = ctx;
    const shape = new THREE.Shape(); shape.moveTo(-4, -4); shape.lineTo(4, -4); shape.lineTo(4, 6); shape.lineTo(-4, 6); shape.lineTo(-4, -4);
    const hole = new THREE.Path(); hole.moveTo(-2.4, -4); hole.lineTo(-2.4, 1.6); hole.absarc(0, 1.6, 2.4, Math.PI, 0, true); hole.lineTo(2.4, -4); hole.lineTo(-2.4, -4); shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.8, bevelEnabled: false, curveSegments: 20 });
    const mats = [new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.9 }), new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.8 })];
    for (let i = 0; i < 6; i++) { const m = new THREE.Mesh(geo, mats[i === 2 ? 1 : 0]); m.position.set(0, 0, -i * 5); g.add(m); }
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({ color: 0xf2a65a }));
    sunDisc.position.set(0, 2, -34); g.add(sunDisc);
    return { update: (t) => { sunDisc.position.y = 1.6 + Math.sin(t * 0.4) * 0.5; } };
  },
  /* 1. Tangga spiral (instanced) */
  (ctx, g) => {
    const { THREE } = ctx;
    const count = 56;
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, 0.3, 1.1), new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.85 }), count);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < count; i++) { const a = i * 0.32; p.set(Math.cos(a) * 2.4, -4 + i * 0.32, Math.sin(a) * 2.4); q.setFromAxisAngle(up, -a); m.compose(p, q, s); mesh.setMatrixAt(i, m); }
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 20, 24), new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.7 }));
    col.position.y = 5;
    g.add(mesh, col);
    return { update: (t) => { g.rotation.y = t * 0.12; } };
  },
  /* 2. Kota balok */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const n = 14, count = n * n;
    const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 }), count);
    const m = new THREE.Matrix4(), c = new THREE.Color(), hs = [];
    let i = 0;
    for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) {
      const h = 0.6 + rand() ** 2.2 * 9; hs.push(h);
      m.makeScale(1.6, h, 1.6); m.setPosition((x - n / 2) * 2.2, -4 + h / 2, (z - n / 2) * 2.2); mesh.setMatrixAt(i, m);
      mesh.setColorAt(i, c.setHex(rand() < 0.12 ? CLAY : rand() < 0.5 ? STONE : SAND)); i++;
    }
    g.add(mesh);
    return { update: (t) => { g.rotation.y = Math.sin(t * 0.1) * 0.25; } };
  },
  /* 3. Kolonade */
  (ctx, g) => {
    const { THREE } = ctx;
    const colGeo = new THREE.CylinderGeometry(0.45, 0.55, 9, 20);
    const count = 16;
    const mesh = new THREE.InstancedMesh(colGeo, new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.7 }), count);
    const m = new THREE.Matrix4();
    for (let i = 0; i < count; i++) { m.makeTranslation(i % 2 ? 4 : -4, 0.5, -Math.floor(i / 2) * 3.4); mesh.setMatrixAt(i, m); }
    const roof = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.8, 27), new THREE.MeshStandardMaterial({ color: SAND, roughness: 0.8 }));
    roof.position.set(0, 5.4, -11.9);
    g.add(mesh, roof);
    return { update: (t) => { roof.position.y = 5.4 + Math.sin(t * 0.5) * 0.08; } };
  },
  /* 4. Kubah dengan oculus */
  (ctx, g) => {
    const { THREE } = ctx;
    const dome = new THREE.Mesh(new THREE.SphereGeometry(7, 48, 20, 0, Math.PI * 2, 0.18, Math.PI / 2 - 0.18), new THREE.MeshStandardMaterial({ color: STONE, roughness: 0.85, side: THREE.DoubleSide }));
    dome.position.y = -4;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.25, 0.18, 10, 48), new THREE.MeshStandardMaterial({ color: CLAY }));
    ring.rotation.x = Math.PI / 2; ring.position.y = 2.88;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 2.6, 7, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0xffe2b8, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    beam.position.y = -0.6;
    g.add(dome, ring, beam);
    return { update: (t) => { beam.material.opacity = 0.14 + Math.sin(t * 0.8) * 0.05; } };
  },
];
`;

const SCENES_SAMUDRA = String.raw`
const GLOBAL = (ctx) => {
  const { THREE, rand } = ctx;
  /* Partikel plankton di seluruh jalur. */
  const n = 1400, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (rand() - 0.5) * 160; pos[i * 3 + 1] = (rand() - 0.5) * 60; pos[i * 3 + 2] = 20 - rand() * 220; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  ctx.scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0x9ff5ec, size: 1.8, sizeAttenuation: false, transparent: true, opacity: 0.6 })));
};
const SCENES = [
  /* 0. Permukaan laut dilihat dari bawah + berkas cahaya */
  (ctx, g) => {
    const { THREE } = ctx;
    const geo = new THREE.PlaneGeometry(90, 90, 80, 80);
    const base = geo.attributes.position.array.slice();
    const sea = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x3fb7c9, emissive: 0x0d4f63, roughness: 0.35, metalness: 0.1, side: THREE.DoubleSide, flatShading: true }));
    sea.rotation.x = Math.PI / 2; sea.position.y = 9;
    g.add(sea);
    const beams = [];
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 2.4, 22, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xbff7ff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      b.position.set(-12 + i * 5, -1, -6 - (i % 3) * 4); b.rotation.z = 0.25; g.add(b); beams.push(b);
    }
    const arr = geo.attributes.position.array;
    return { update: (t) => {
      for (let i = 0; i < arr.length; i += 3) { const x = base[i], y = base[i + 1]; arr[i + 2] = Math.sin(x * 0.18 + t * 1.1) * 0.7 + Math.cos(y * 0.22 + t * 0.8) * 0.6; }
      geo.attributes.position.needsUpdate = true;
      beams.forEach((b, i) => { b.material.opacity = 0.06 + Math.sin(t * 0.7 + i) * 0.03; });
    } };
  },
  /* 1. Terumbu karang bercabang (instanced, rekursif) */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const segs = [];
    function branch(p, dir, len, depth) {
      const end = p.clone().addScaledVector(dir, len);
      segs.push({ a: p, b: end, r: 0.06 + depth * 0.05 });
      if (depth === 0) return;
      const k = depth > 2 ? 2 : 3;
      for (let i = 0; i < k; i++) { const d = dir.clone().add(new THREE.Vector3((rand() - 0.5) * 1.1, 0.4 + rand() * 0.3, (rand() - 0.5) * 1.1)).normalize(); branch(end, d, len * (0.65 + rand() * 0.15), depth - 1); }
    }
    for (let c = 0; c < 9; c++) branch(new THREE.Vector3((rand() - 0.5) * 18, -6, (rand() - 0.5) * 12), new THREE.Vector3(0, 1, 0), 1.8 + rand(), 3);
    const mesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.7, 1, 1, 6, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, flatShading: true }), segs.length);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), mid = new THREE.Vector3(), dir = new THREE.Vector3(), s = new THREE.Vector3(), c = new THREE.Color();
    const tones = [0xff7a59, 0xff9f80, 0xf25c8a, 0xffc36b];
    segs.forEach((sg, i) => { dir.subVectors(sg.b, sg.a); const L = dir.length(); q.setFromUnitVectors(up, dir.normalize()); mid.addVectors(sg.a, sg.b).multiplyScalar(0.5); s.set(sg.r, L, sg.r); m.compose(mid, q, s); mesh.setMatrixAt(i, m); mesh.setColorAt(i, c.setHex(tones[i % tones.length])); });
    const bed = new THREE.Mesh(new THREE.CircleGeometry(16, 40), new THREE.MeshStandardMaterial({ color: 0x0f5561, roughness: 1 }));
    bed.rotation.x = -Math.PI / 2; bed.position.y = -6;
    g.add(mesh, bed);
    return { update: (t) => { mesh.rotation.y = Math.sin(t * 0.2) * 0.05; } };
  },
  /* 2. Ubur-ubur berdenyut */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const bellGeo = new THREE.SphereGeometry(1.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2);
    const jellies = [];
    for (let i = 0; i < 7; i++) {
      const j = new THREE.Group();
      const bell = new THREE.Mesh(bellGeo, new THREE.MeshStandardMaterial({ color: 0xc8a8ff, emissive: 0x7a4dff, emissiveIntensity: 0.6, transparent: true, opacity: 0.7, side: THREE.DoubleSide }));
      j.add(bell);
      const pts = [];
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; for (let y = 0; y < 6; y++) pts.push(Math.cos(a) * 0.8, -y * 0.5, Math.sin(a) * 0.8, Math.cos(a) * 0.8, -(y + 1) * 0.5, Math.sin(a) * 0.8); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
      j.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0xe6d6ff, transparent: true, opacity: 0.5 })));
      j.position.set((rand() - 0.5) * 16, (rand() - 0.5) * 8, (rand() - 0.5) * 10);
      j.userData = { k: rand() * 6, s: 0.7 + rand() * 0.7 };
      j.scale.setScalar(j.userData.s);
      g.add(j); jellies.push(j);
    }
    g.add(new THREE.PointLight(0xb08cff, 40, 30));
    return { update: (t, dt) => { jellies.forEach((j) => { const p = Math.sin(t * 2 + j.userData.k); j.children[0].scale.set(1 + p * 0.08, 1 - p * 0.12, 1 + p * 0.08); j.position.y += (0.35 + p * 0.25) * dt; if (j.position.y > 7) j.position.y = -7; }); } };
  },
  /* 3. Kawanan ikan berputar */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const count = 240;
    const geo = new THREE.ConeGeometry(0.22, 0.9, 6); geo.rotateZ(-Math.PI / 2);
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xdff8ff, metalness: 0.6, roughness: 0.3 }), count);
    const data = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) data.push({ a: rand() * Math.PI * 2, r: 4 + rand() * 4, y: (rand() - 0.5) * 4, w: 0.5 + rand() * 0.3, k: rand() * 6 });
    g.add(mesh);
    const place = (t) => { data.forEach((d, i) => { const a = d.a + t * d.w; p.set(Math.cos(a) * d.r, d.y + Math.sin(t + d.k) * 0.6, Math.sin(a) * d.r); e.set(0, -a - Math.PI / 2, Math.sin(t * 3 + d.k) * 0.15); q.setFromEuler(e); m.compose(p, q, s); mesh.setMatrixAt(i, m); }); mesh.instanceMatrix.needsUpdate = true; };
    place(0);
    return { update: place };
  },
  /* 4. Cincin cahaya di laut dalam */
  (ctx, g) => {
    const { THREE } = ctx;
    const ring = new THREE.Mesh(new THREE.TorusGeometry(5, 0.12, 10, 96), new THREE.MeshBasicMaterial({ color: 0x5ff2df }));
    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(3.4, 0.06, 8, 96), new THREE.MeshBasicMaterial({ color: 0xffd38a }));
    const glow = new THREE.Mesh(new THREE.CircleGeometry(4.6, 64), new THREE.MeshBasicMaterial({ color: 0x0aa3a3, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }));
    g.add(ring, ring2, glow);
    return { update: (t) => { ring.rotation.y = Math.sin(t * 0.4) * 0.4; ring2.rotation.x = t * 0.3; glow.material.opacity = 0.14 + Math.sin(t) * 0.05; } };
  },
];
`;


const SCENES_KOPI = String.raw`
const GLOBAL = (ctx) => {
  /* Debu hangat di sepanjang jalur (Points). */
  const { THREE, rand } = ctx;
  const n = 900, pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { pos[i * 3] = (rand() - 0.5) * 140; pos[i * 3 + 1] = (rand() - 0.5) * 50; pos[i * 3 + 2] = 20 - rand() * 210; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  ctx.scene.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffc98a, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.45 })));
};
const BEAN = 0x5a3320, CREAM = 0xf4ece2;
const beanGeo = (THREE) => { const g = new THREE.SphereGeometry(1, 14, 10); g.scale(0.62, 0.42, 0.9); return g; };
const SCENES = [
  /* 0. Cangkir, biji kopi mengorbit, dan uap */
  (ctx, g) => {
    const { THREE, rand, warna } = ctx;
    const prof = [[0, 0], [1.9, 0], [2.1, 0.25], [2.3, 2.6], [2.45, 3.2], [2.25, 3.25], [2.05, 0.5], [0, 0.45]].map((p) => new THREE.Vector2(p[0], p[1]));
    const porcelain = new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.35, side: THREE.DoubleSide });
    const cup = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), porcelain); cup.position.y = -1.6;
    const coffee = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshStandardMaterial({ color: 0x3b2112, roughness: 0.15 }));
    coffee.rotation.x = -Math.PI / 2; coffee.position.y = 1.2;
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.17, 10, 32, Math.PI), porcelain); handle.position.set(2.35, 0, 0); handle.rotation.z = -Math.PI / 2;
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.1, 0.25, 48), porcelain); saucer.position.y = -1.75;
    g.add(cup, coffee, handle, saucer);
    const count = 56;
    const beans = new THREE.InstancedMesh(beanGeo(THREE), new THREE.MeshStandardMaterial({ color: BEAN, roughness: 0.5 }), count);
    const data = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) data.push({ a: rand() * Math.PI * 2, r: 4.6 + rand() * 3.6, y: -1.5 + rand() * 5, w: 0.15 + rand() * 0.25, k: rand() * 6, s: 0.35 + rand() * 0.35 });
    g.add(beans);
    const sn = 260, sp = new Float32Array(sn * 3), seeds = [];
    for (let i = 0; i < sn; i++) seeds.push({ y: rand() * 5, k: rand() * 6, r: rand() * 1.4 });
    const steamGeo = new THREE.BufferGeometry(); steamGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    const steam = new THREE.Points(steamGeo, new THREE.PointsMaterial({ color: warna.aksen2, size: 2.5, sizeAttenuation: false, transparent: true, opacity: 0.5, depthWrite: false }));
    g.add(steam);
    const place = (t, dt) => {
      data.forEach((d, i) => { const a = d.a + t * d.w; p.set(Math.cos(a) * d.r, d.y + Math.sin(t * 0.8 + d.k) * 0.5, Math.sin(a) * d.r); e.set(d.k + t * 0.6, d.k, t * 0.4); q.setFromEuler(e); sc.setScalar(d.s); m.compose(p, q, sc); beans.setMatrixAt(i, m); });
      beans.instanceMatrix.needsUpdate = true;
      seeds.forEach((s, i) => { s.y += (dt || 0) * 0.9; if (s.y > 5) s.y = 0; sp[i * 3] = Math.sin(t * 0.9 + s.k + s.y) * (0.3 + s.y * 0.18) * s.r; sp[i * 3 + 1] = 1.4 + s.y; sp[i * 3 + 2] = Math.cos(t * 0.7 + s.k) * 0.4 * s.r; });
      steamGeo.attributes.position.needsUpdate = true;
    };
    place(0, 0);
    return { update: place };
  },
  /* 1. Kebun kopi bertingkat di dataran tinggi */
  (ctx, g) => {
    const { THREE, rand } = ctx;
    const greens = [0x2f5d3a, 0x3c7046, 0x4c8452, 0x5d975e, 0x6fa86a];
    for (let i = 0; i < 5; i++) { const r = 9 - i * 1.6; const t = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 0.4, 1, 40), new THREE.MeshStandardMaterial({ color: greens[i], roughness: 1, flatShading: true })); t.position.y = -4 + i; g.add(t); }
    const count = 130;
    const trees = new THREE.InstancedMesh(new THREE.ConeGeometry(0.42, 1.2, 7), new THREE.MeshStandardMaterial({ color: 0x3d7a46, emissive: 0x0f2414, roughness: 0.8, flatShading: true }), count);
    const m = new THREE.Matrix4(), c = new THREE.Color();
    for (let i = 0; i < count; i++) { const lvl = i % 5, r = 9 - lvl * 1.6 - 0.6, a = rand() * Math.PI * 2; m.makeTranslation(Math.cos(a) * r, -4 + lvl + 1.1, Math.sin(a) * r); trees.setMatrixAt(i, m); trees.setColorAt(i, c.setHex(rand() < 0.2 ? 0xc0503a : 0x3d7a46)); }
    g.add(trees);
    const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(2.4, 40), new THREE.MeshBasicMaterial({ color: 0xf2b45a })); sunDisc.position.set(6, 6, -14); g.add(sunDisc);
    return { update: (t) => { g.rotation.y = t * 0.05; } };
  },
  /* 2. Mesin sangrai: drum berputar, biji berguling, cahaya panas */
  (ctx, g) => {
    const { THREE, rand, warna } = ctx;
    const steel = new THREE.MeshStandardMaterial({ color: 0x9a8f86, metalness: 0.85, roughness: 0.3, side: THREE.DoubleSide });
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 6.5, 40, 1, true), steel); drum.rotation.z = Math.PI / 2;
    const rimA = new THREE.Mesh(new THREE.TorusGeometry(3, 0.18, 10, 48), steel); rimA.rotation.y = Math.PI / 2; rimA.position.x = 3.25;
    const rimB = rimA.clone(); rimB.position.x = -3.25;
    const legs = new THREE.Mesh(new THREE.BoxGeometry(7, 0.4, 2.4), new THREE.MeshStandardMaterial({ color: 0x3a2a20, roughness: 0.8 })); legs.position.y = -3.8;
    g.add(drum, rimA, rimB, legs);
    const count = 90;
    const beans = new THREE.InstancedMesh(beanGeo(THREE), new THREE.MeshStandardMaterial({ color: 0x6b3d22, roughness: 0.45 }), count);
    const data = [], m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(0.3, 0.3, 0.3), p = new THREE.Vector3();
    for (let i = 0; i < count; i++) data.push({ x: (rand() - 0.5) * 5.6, a: rand() * Math.PI * 2, r: 1 + rand() * 1.7, w: 0.8 + rand() * 0.6, k: rand() * 6 });
    g.add(beans);
    const glow = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.2, 8, 48), new THREE.MeshBasicMaterial({ color: warna.aksen })); glow.rotation.x = Math.PI / 2; glow.position.y = -3.4;
    const heat = new THREE.PointLight(warna.aksen, 50, 18); heat.position.y = -2.5;
    g.add(glow, heat);
    const place = (t) => {
      drum.rotation.x = t * 0.8;
      data.forEach((d, i) => { const a = d.a + t * d.w; p.set(d.x, Math.cos(a) * d.r * 0.6 - 1, Math.sin(a) * d.r); e.set(t * 2 + d.k, d.k, 0); q.setFromEuler(e); m.compose(p, q, sc); beans.setMatrixAt(i, m); });
      beans.instanceMatrix.needsUpdate = true;
      heat.intensity = 40 + Math.sin(t * 3) * 10;
    };
    place(0);
    return { update: place };
  },
  /* 3. Seduh manual: dripper, server kaca, tetesan */
  (ctx, g) => {
    const { THREE } = ctx;
    const dripper = new THREE.Mesh(new THREE.ConeGeometry(2.2, 2.6, 40, 1, true), new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.4, side: THREE.DoubleSide }));
    dripper.rotation.x = Math.PI; dripper.position.y = 3.4;
    const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.6, 3.6, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false }));
    glass.position.y = -0.4;
    const brew = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.6, 1, 40), new THREE.MeshStandardMaterial({ color: 0x4a2814, roughness: 0.2 }));
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3, 3, 0.3, 48), new THREE.MeshStandardMaterial({ color: 0x2a1d16, roughness: 0.7 })); base.position.y = -2.4;
    g.add(dripper, glass, brew, base);
    const count = 14;
    const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshStandardMaterial({ color: 0x5a3018 }), count);
    g.add(drops);
    const m = new THREE.Matrix4();
    const place = (t) => {
      const lvl = 0.4 + ((t * 0.08) % 1) * 2.4;
      brew.scale.y = lvl; brew.position.y = -2.2 + lvl / 2;
      for (let i = 0; i < count; i++) { const f = (t * 0.9 + i / count) % 1; m.makeTranslation(0, 2 - f * (4.1 - lvl), 0); drops.setMatrixAt(i, m); }
      drops.instanceMatrix.needsUpdate = true;
    };
    place(0);
    return { update: place };
  },
  /* 4. Pulau asal biji kopi dengan penanda */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const geo = new THREE.IcosahedronGeometry(7, 3); geo.scale(1.3, 0.22, 0.8);
    const island = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x5f7d4a, roughness: 1, flatShading: true }));
    const sea = new THREE.Mesh(new THREE.CircleGeometry(14, 64), new THREE.MeshStandardMaterial({ color: 0x23404a, roughness: 0.6 })); sea.rotation.x = -Math.PI / 2; sea.position.y = -0.6;
    g.add(sea, island);
    const pins = [];
    [[-6, 0.6, 1], [-3, 1.2, -1.5], [0.5, 1.3, 0.8], [3.5, 1, -0.8], [6.5, 0.6, 1.2], [-1.5, 1.2, 3]].forEach((p, i) => {
      const pin = new THREE.Group();
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), new THREE.MeshStandardMaterial({ color: warna.aksen, emissive: new THREE.Color(warna.aksen), emissiveIntensity: 0.4 }));
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.9, 12), head.material); tip.rotation.x = Math.PI; tip.position.y = -0.55;
      head.position.y = 0.2; pin.add(head, tip); pin.position.set(p[0], p[1] + 0.9, p[2]); pin.userData.k = i;
      g.add(pin); pins.push(pin);
    });
    return { update: (t) => { g.rotation.y = Math.sin(t * 0.15) * 0.4; pins.forEach((p) => { p.position.y += Math.sin(t * 2 + p.userData.k) * 0.004; }); } };
  },
];
`;

const SCENES_SURYA = String.raw`
const GLOBAL = (ctx) => {
  const { THREE } = ctx;
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.MeshStandardMaterial({ color: 0xd9ebe5, roughness: 1 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -4; ctx.scene.add(floor);
};
const PANEL = 0x1d3a66, WHITE = 0xf7fbfa;
const SCENES = [
  /* 0. Matahari dengan sinar berputar */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const sun = new THREE.Mesh(new THREE.IcosahedronGeometry(3.4, 6), new THREE.MeshStandardMaterial({ color: warna.aksen2, emissive: new THREE.Color(warna.aksen2), emissiveIntensity: 0.9, roughness: 0.4 }));
    const count = 36;
    const rays = new THREE.InstancedMesh(new THREE.BoxGeometry(0.22, 2.2, 0.22), new THREE.MeshStandardMaterial({ color: warna.aksen2, emissive: new THREE.Color(warna.aksen2), emissiveIntensity: 0.6 }), count);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), z = new THREE.Vector3(0, 0, 1), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
    for (let i = 0; i < count; i++) { const a = (i / count) * Math.PI * 2; p.set(Math.cos(a) * 5.2, Math.sin(a) * 5.2, 0); q.setFromAxisAngle(z, a - Math.PI / 2); s.set(1, i % 2 ? 0.6 : 1, 1); m.compose(p, q, s); rays.setMatrixAt(i, m); }
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6.6, 0.08, 8, 96), new THREE.MeshBasicMaterial({ color: warna.aksen }));
    g.add(sun, rays, ring, new THREE.PointLight(warna.aksen2, 60, 30));
    return { update: (t) => { rays.rotation.z = t * 0.12; ring.rotation.x = Math.sin(t * 0.3) * 0.4; sun.scale.setScalar(1 + Math.sin(t * 1.5) * 0.02); } };
  },
  /* 1. Ladang panel surya */
  (ctx, g) => {
    const { THREE } = ctx;
    const nx = 10, nz = 7, count = nx * nz;
    const panels = new THREE.InstancedMesh(new THREE.BoxGeometry(1.9, 0.08, 1.2), new THREE.MeshStandardMaterial({ color: PANEL, metalness: 0.6, roughness: 0.25 }), count);
    const legs = new THREE.InstancedMesh(new THREE.BoxGeometry(0.12, 1.2, 0.12), new THREE.MeshStandardMaterial({ color: 0x9fb3ad }), count);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), x = new THREE.Vector3(1, 0, 0), p = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
    q.setFromAxisAngle(x, -0.5);
    let i = 0;
    for (let a = 0; a < nx; a++) for (let b = 0; b < nz; b++) { p.set((a - nx / 2) * 2.3, -2.6, (b - nz / 2) * 2.1); m.compose(p, q, s); panels.setMatrixAt(i, m); m.makeTranslation(p.x, -3.4, p.z); legs.setMatrixAt(i, m); i++; }
    g.add(panels, legs);
    return { update: (t) => { g.rotation.y = Math.sin(t * 0.12) * 0.15; } };
  },
  /* 2. Turbin angin */
  (ctx, g) => {
    const { THREE } = ctx;
    const mat = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.5 });
    const rotors = [];
    [[-7, -4], [-2, -9], [3, -3], [8, -8], [0, 3]].forEach((pos, i) => {
      const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.32, 11, 12), mat); tower.position.set(pos[0], 1.5, pos[1]);
      const hub = new THREE.Group(); hub.position.set(pos[0], 7.1, pos[1] + 0.4);
      const nac = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 1.2), mat); nac.position.set(pos[0], 7.1, pos[1]);
      for (let k = 0; k < 3; k++) { const blade = new THREE.Mesh(new THREE.BoxGeometry(0.22, 4.2, 0.06), mat); blade.position.y = 2.1; const arm = new THREE.Group(); arm.rotation.z = (k / 3) * Math.PI * 2; arm.add(blade); hub.add(arm); }
      hub.userData.w = 0.8 + i * 0.12;
      g.add(tower, nac, hub); rotors.push(hub);
    });
    return { update: (t) => { rotors.forEach((r) => { r.rotation.z = t * r.userData.w; }); } };
  },
  /* 3. Penyimpanan baterai: level energi naik turun */
  (ctx, g) => {
    const { THREE, warna } = ctx;
    const cells = [];
    for (let i = 0; i < 6; i++) {
      const x = (i % 3 - 1) * 3, z = (Math.floor(i / 3) - 0.5) * 3.2;
      const shell = new THREE.Mesh(new THREE.BoxGeometry(2.2, 5, 2.2), new THREE.MeshStandardMaterial({ color: WHITE, transparent: true, opacity: 0.3, roughness: 0.1, depthWrite: false }));
      shell.position.set(x, -1.5, z);
      const level = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1, 1.8), new THREE.MeshStandardMaterial({ color: warna.aksen, emissive: new THREE.Color(warna.aksen), emissiveIntensity: 0.5 }));
      level.position.set(x, -3.9, z); level.userData.k = i;
      g.add(shell, level); cells.push(level);
    }
    return { update: (t) => { cells.forEach((c) => { const h = 1.2 + (Math.sin(t * 0.6 + c.userData.k) * 0.5 + 0.5) * 3.4; c.scale.y = h; c.position.y = -4 + h / 2; }); } };
  },
  /* 4. Kota hijau dan jaringan pintar */
  (ctx, g) => {
    const { THREE, rand, warna } = ctx;
    const n = 11, count = n * n;
    const city = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), count);
    const m = new THREE.Matrix4(), c = new THREE.Color(), acc = new THREE.Color(warna.aksen);
    let i = 0;
    for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) { const h = 0.8 + rand() ** 2 * 7; m.makeScale(1.4, h, 1.4); m.setPosition((x - n / 2) * 2, -4 + h / 2, (z - n / 2) * 2); city.setMatrixAt(i, m); city.setColorAt(i, rand() < 0.15 ? acc : c.setHex(rand() < 0.5 ? WHITE : 0xd5e6e1)); i++; }
    const grid = new THREE.Mesh(new THREE.TorusGeometry(10, 0.07, 6, 120), new THREE.MeshBasicMaterial({ color: warna.aksen }));
    grid.rotation.x = Math.PI / 2; grid.position.y = 4.5;
    const grid2 = new THREE.Mesh(new THREE.TorusGeometry(7, 0.05, 6, 120), new THREE.MeshBasicMaterial({ color: warna.aksen2 }));
    grid2.rotation.x = Math.PI / 2; grid2.position.y = 5.5;
    g.add(city, grid, grid2);
    return { update: (t) => { grid.rotation.z = t * 0.2; grid2.rotation.z = -t * 0.3; grid.position.y = 4.5 + Math.sin(t) * 0.2; } };
  },
];
`;

/* ------------------------------ 5 varian --------------------------- */

const navOf = (secs: Section[]) => [...secs.slice(1).map((x) => ({ label: x.kicker ?? x.title, href: `#${x.id}` })), { label: "Kontak", href: "#kontak" }];

const NEBULA_SECTIONS: Section[] = [
  { id: "beranda", align: "left", title: "Melihat sawah Indonesia dari orbit.", kicker: "Nebula Labs", body: ["Citra satelit harian yang diolah menjadi peringatan sederhana untuk petani dan koperasi: kapan menyiram, kapan memupuk, dan petak mana yang perlu dicek hari ini."], cta: [{ label: "Coba demo", href: "#kontak" }, { label: "Cara kerja", href: "#cara-kerja", ghost: true }], cam: [0, 1.5, 22], look: [0, 0, 0], at: [0, 0, 0] },
  { id: "fitur", align: "right", kicker: "Fitur", title: "Data rumit, jadi jawaban singkat.", body: ["Setiap petak dipantau lewat indeks kehijauan, kelembapan tanah, dan prakiraan cuaca lokal."], list: ["Peringatan kekeringan tiga hari lebih awal", "Peta kesehatan tanaman per petak", "Laporan mingguan lewat WhatsApp"], cam: [12, 0, -26], look: [26, -4, -40], at: [26, -4, -40] },
  { id: "cara-kerja", align: "left", kicker: "Cara kerja", title: "Tiga lapis pengolahan, satu dasbor.", body: ["Citra mentah dibersihkan dari awan, dibandingkan dengan riwayat musim tanam, lalu diringkas oleh model yang dilatih bersama agronom lokal."], cam: [-6, 7, -66], look: [-22, 4, -82], at: [-22, 4, -82] },
  { id: "skala", align: "right", kicker: "Skala", title: "Dari satu petak sampai satu kabupaten.", body: ["Mulai dengan lahan sendiri, lalu tambahkan anggota koperasi tanpa mengubah cara kerja. Harga dihitung per hektare yang dipantau."], cta: [{ label: "Lihat paket", href: "#kontak", ghost: true }], cam: [-2, 3, -106], look: [10, -2, -124], at: [10, -2, -124] },
  { id: "mulai", align: "center", kicker: "Mulai", title: "Siap menanam dengan lebih tenang?", body: ["Hubungkan lahan pertama Anda dalam sepuluh menit. Tanpa alat tambahan di sawah."], cta: [{ label: "Jadwalkan demo", href: "#kontak" }], cam: [0, 0, -152], look: [0, 0, -175], at: [0, 0, -168] },
];

const LAPIS_SECTIONS: Section[] = [
  { id: "beranda", align: "left", kicker: "Ruang Lapis", title: "Arsitektur yang tumbuh dari cahaya dan bayangan.", body: ["Studio arsitektur dan interior di Yogyakarta. Kami merancang rumah, ruang kerja, dan ruang publik yang tenang, hemat energi, dan jujur pada material."], cta: [{ label: "Konsultasi gratis", href: "#kontak" }, { label: "Pendekatan kami", href: "#pendekatan", ghost: true }], cam: [0, 0.5, 14], look: [0, 0.5, -6], at: [0, 0, 0] },
  { id: "pendekatan", align: "right", kicker: "Pendekatan", title: "Setiap langkah dirancang naik perlahan.", body: ["Kami mulai dari cara Anda bergerak di dalam ruang: dari pintu, ke dapur, ke jendela favorit. Bentuk mengikuti kebiasaan, bukan sebaliknya."], cam: [26, 4, -18], look: [34, 2, -32], at: [34, 0, -32] },
  { id: "layanan", align: "left", kicker: "Layanan", title: "Dari satu kamar sampai satu kawasan.", body: ["Tim kecil yang menangani perencanaan sampai pengawasan."], list: ["Rumah tinggal dan renovasi", "Interior kantor dan kafe", "Perencanaan kawasan dan lanskap"], cam: [0, 16, -48], look: [-6, -2, -70], at: [-6, 0, -70] },
  { id: "material", align: "right", kicker: "Material", title: "Batu, kayu, dan tanah liat lokal.", body: ["Kami memilih bahan dari radius sedekat mungkin dengan lokasi proyek, supaya bangunan lebih sejuk, lebih murah dirawat, dan lebih dekat dengan tempatnya."], cam: [3, 1, -98], look: [0, 1, -116], at: [0, 0, -104] },
  { id: "proses", align: "center", kicker: "Proses", title: "Mari mulai dari secangkir kopi.", body: ["Ceritakan lahan dan kebiasaan Anda. Konsultasi pertama tidak dipungut biaya."], cta: [{ label: "Atur pertemuan", href: "#kontak" }], cam: [0, -1, -136], look: [0, 1, -150], at: [0, 0, -150] },
];

const SAMUDRA_SECTIONS: Section[] = [
  { id: "beranda", align: "left", kicker: "Arus Biru", title: "Menjaga laut tetap biru, satu terumbu setiap kali.", body: ["Gerakan konservasi pesisir yang menanam ulang terumbu karang, memantau satwa laut, dan mengajak nelayan lokal menjadi penjaga laut."], cta: [{ label: "Ikut berdonasi", href: "#kontak" }, { label: "Program kami", href: "#terumbu", ghost: true }], cam: [0, 0, 16], look: [0, 4, -4], at: [0, 0, 0] },
  { id: "terumbu", align: "right", kicker: "Terumbu", title: "Karang tumbuh pelan. Kami menunggu dengan sabar.", body: ["Fragmen karang ditanam di rangka baja ramah laut, lalu dipantau setiap bulan oleh penyelam relawan dan kelompok nelayan setempat."], cam: [10, -1, -26], look: [20, -4, -44], at: [20, 0, -44] },
  { id: "satwa", align: "left", kicker: "Satwa", title: "Mencatat yang datang kembali.", body: ["Ubur-ubur, penyu, dan kawanan ikan adalah tanda laut yang pulih."], list: ["Survei bawah laut bulanan", "Data terbuka untuk peneliti", "Pelatihan pemandu wisata selam"], cam: [-6, 1, -70], look: [-18, 0, -84], at: [-18, 0, -84] },
  { id: "nelayan", align: "right", kicker: "Nelayan", title: "Penjaga terbaik laut adalah yang hidup darinya.", body: ["Kami bekerja dengan kelompok nelayan untuk zona tangkap bergilir, sehingga ikan punya waktu berkembang biak dan hasil tangkapan tetap terjaga."], cam: [12, 2, -108], look: [8, 0, -124], at: [8, 0, -124] },
  { id: "bergabung", align: "center", kicker: "Bergabung", title: "Laut menunggu bantuan Anda.", body: ["Satu donasi membantu satu fragmen karang tumbuh selama setahun penuh."], cta: [{ label: "Donasi sekarang", href: "#kontak" }], cam: [0, 0, -150], look: [0, 0, -168], at: [0, 0, -166] },
];


const KOPI_SECTIONS: Section[] = [
  { id: "beranda", align: "left", kicker: "Kopi Senja Roastery", title: "Secangkir kopi, dari kebun sampai mejamu.", body: ["Kami menyangrai biji kopi dari petani kecil di dataran tinggi Nusantara setiap minggu, lalu mengirimnya segar ke rumah dan kafe Anda."], cta: [{ label: "Pesan biji kopi", href: "#kontak" }, { label: "Kisah kami", href: "#kebun", ghost: true }], cam: [0, 1.5, 15], look: [0, 0.6, 0], at: [0, 0, 0] },
  { id: "kebun", align: "right", kicker: "Kebun", title: "Ditanam di lereng, dipetik dengan tangan.", body: ["Kami bekerja langsung dengan 120 keluarga petani. Hanya buah merah matang yang dipetik, dan harga dibayar di atas harga pasar."], cam: [12, 5, -24], look: [24, -2, -40], at: [24, 0, -40] },
  { id: "sangrai", align: "left", kicker: "Sangrai", title: "Disangrai pelan, dalam jumlah kecil.", body: ["Setiap batch hanya 5 kilogram, supaya rasa asli setiap asal tetap terjaga."], list: ["Profil sangrai terang untuk seduh manual", "Profil sedang untuk espresso", "Tanggal sangrai tercetak di setiap kemasan"], cam: [-6, 3, -64], look: [-20, 1, -80], at: [-20, 1, -80] },
  { id: "seduh", align: "right", kicker: "Seduh", title: "Panduan seduh untuk setiap kantong.", body: ["Kode di kemasan membuka resep seduh: takaran, suhu air, dan waktu, disesuaikan dengan alat yang Anda punya di rumah."], cam: [-3, 2, -106], look: [8, 0, -120], at: [8, 0, -120] },
  { id: "asal", align: "center", kicker: "Asal", title: "Dari Gayo sampai Toraja.", body: ["Enam asal kopi pilihan, berganti mengikuti musim panen. Berlangganan dan cicipi satu asal baru setiap bulan."], cta: [{ label: "Mulai berlangganan", href: "#kontak" }], cam: [0, 7, -147], look: [0, -1, -165], at: [0, -1, -165] },
];

const SURYA_SECTIONS: Section[] = [
  { id: "beranda", align: "left", kicker: "Surya Nusa Energi", title: "Energi bersih untuk setiap atap di Indonesia.", body: ["Kami merancang, memasang, dan merawat panel surya untuk rumah, pabrik, dan desa, dengan cicilan yang lebih ringan dari tagihan listrik Anda."], cta: [{ label: "Hitung penghematan", href: "#kontak" }, { label: "Solusi kami", href: "#ladang", ghost: true }], cam: [0, 0.5, 24], look: [0, 0.5, 0], at: [0, 1, 0] },
  { id: "ladang", align: "right", kicker: "Panel surya", title: "Atap Anda, pembangkit listrik Anda.", body: ["Panel bersertifikat dengan garansi kinerja 25 tahun, dipantau dari aplikasi setiap hari."], list: ["Survei atap gratis", "Pemasangan dalam 3 hari", "Pemantauan produksi harian"], cam: [8, 8, -26], look: [22, -3, -42], at: [22, 0, -42] },
  { id: "angin", align: "left", kicker: "Hibrida", title: "Saat matahari beristirahat, angin bekerja.", body: ["Untuk desa pesisir dan pulau kecil, kami memadukan surya dan turbin angin skala kecil agar listrik tetap menyala sepanjang malam."], cam: [-6, 4, -62], look: [-20, 3, -80], at: [-20, -1, -80] },
  { id: "baterai", align: "right", kicker: "Penyimpanan", title: "Simpan energi siang untuk malam hari.", body: ["Baterai pintar mengatur kapan energi dipakai, disimpan, atau dijual kembali ke jaringan, otomatis tanpa perlu Anda atur."], cam: [-4, 3, -104], look: [8, -1, -120], at: [8, 0, -120] },
  { id: "kota", align: "center", kicker: "Kota hijau", title: "Bersama membangun kota yang lebih terang.", body: ["Lebih dari 3.000 atap sudah terpasang. Atap berikutnya bisa milik Anda."], cta: [{ label: "Jadwalkan survei", href: "#kontak" }], cam: [0, 10, -144], look: [0, -1, -165], at: [0, 0, -165] },
];

export const WEB3D_SPECS: Web3DSpec[] = [
  {
    id: "web3d-nebula-labs",
    title: "Nebula Labs · Pemantauan Satelit untuk Pertanian",
    description: "Website 3D scroll-driven: kamera terbang dari planet, gugus kristal, giroskop, sabuk asteroid, sampai lorong portal. Three.js prosedural + Lenis.",
    brand: "Nebula Labs",
    nav: navOf(NEBULA_SECTIONS),
    font: { display: "Space Grotesk", text: "Inter", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&display=swap" },
    colors: { bg: "#05060f", fog: "#070a1c", ink: "#eef0ff", inkSoft: "#b7bbe0", accent: "#8b7bff", accent2: "#3de0ff", panel: "rgba(8,10,28,.62)", fallback: "radial-gradient(120% 80% at 70% 10%, #2a1f6b 0%, #0b0d2a 45%, #05060f 100%)", light: "#9aa4ff", dark: true },
    fog: 0.018,
    sections: NEBULA_SECTIONS,
    contact: { title: "Ceritakan lahan Anda.", text: "Kami akan menyiapkan demo dengan data petak Anda sendiri dalam dua hari kerja.", email: "halo@nebulalabs.example", cta: "Jadwalkan demo Nebula Labs", address: "Bandung, Jawa Barat" },
    scenes: SCENES_NEBULA,
  },
  {
    id: "web3d-ruang-lapis",
    title: "Ruang Lapis · Studio Arsitektur",
    description: "Website 3D scroll-driven bernuansa terang untuk studio arsitektur: deret lengkung, tangga spiral, kota balok, kolonade, dan kubah. Three.js prosedural + Lenis.",
    brand: "Ruang Lapis",
    nav: navOf(LAPIS_SECTIONS),
    font: { display: "DM Serif Display", text: "DM Sans", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;600&display=swap" },
    colors: { bg: "#efe7dc", fog: "#efe7dc", ink: "#2b211a", inkSoft: "#5e5045", accent: "#b4532f", accent2: "#2b211a", panel: "rgba(247,241,233,.78)", fallback: "linear-gradient(180deg, #f6efe6 0%, #e8d9c5 60%, #d9b99a 100%)", light: "#fff4e4", dark: false },
    fog: 0.022,
    sections: LAPIS_SECTIONS,
    contact: { title: "Punya lahan atau ruang yang ingin diubah?", text: "Kirim foto dan ukuran kasar. Kami balas dengan gambaran awal dan perkiraan biaya.", email: "studio@ruanglapis.example", cta: "Konsultasi dengan Ruang Lapis", address: "Sleman, Yogyakarta" },
    scenes: SCENES_LAPIS,
  },
  {
    id: "web3d-arus-biru",
    title: "Arus Biru · Konservasi Laut",
    description: "Website 3D scroll-driven bawah laut: permukaan ombak, terumbu karang, ubur-ubur, kawanan ikan, dan cincin cahaya di laut dalam. Three.js prosedural + Lenis.",
    brand: "Arus Biru",
    nav: navOf(SAMUDRA_SECTIONS),
    font: { display: "Sora", text: "Manrope", href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=Manrope:wght@400;600&display=swap" },
    colors: { bg: "#021a2b", fog: "#03304a", ink: "#e8fbff", inkSoft: "#a9d6df", accent: "#39d0c3", accent2: "#ffd38a", panel: "rgba(2,26,43,.6)", fallback: "linear-gradient(180deg, #0b6e8a 0%, #04405e 40%, #021a2b 100%)", light: "#9be8ff", dark: true },
    fog: 0.03,
    sections: SAMUDRA_SECTIONS,
    contact: { title: "Jadi bagian dari laut yang pulih.", text: "Donasi, jadi relawan penyelam, atau ajak perusahaan Anda menanam terumbu bersama kami.", email: "halo@arusbiru.example", cta: "Bergabung dengan Arus Biru", address: "Labuan Bajo, Nusa Tenggara Timur" },
    scenes: SCENES_SAMUDRA,
  },
  {
    id: "web3d-kopi-senja",
    title: "Kopi Senja Roastery · Kopi Sangrai Nusantara",
    description: "Website 3D scroll-driven untuk roastery kopi: cangkir dengan biji mengorbit dan uap, kebun bertingkat, drum sangrai, seduh manual, dan pulau asal kopi. Three.js prosedural + Lenis.",
    brand: "Kopi Senja",
    nav: navOf(KOPI_SECTIONS),
    font: { display: "Fraunces", text: "Work Sans", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Work+Sans:wght@400;600&display=swap" },
    colors: { bg: "#1a120d", fog: "#24170f", ink: "#f6ede2", inkSoft: "#d2bfa8", accent: "#e08c3c", accent2: "#f3d9a4", panel: "rgba(26,18,13,.62)", fallback: "radial-gradient(120% 80% at 70% 10%, #6b3b1e 0%, #2a1a10 50%, #1a120d 100%)", light: "#ffd9a8", dark: true, ground: "#2a1a10" },
    fog: 0.02,
    sections: KOPI_SECTIONS,
    contact: { title: "Mari ngopi bareng.", text: "Pesan biji kopi untuk rumah, kantor, atau kafe Anda. Kami bantu memilih asal dan profil sangrai yang pas.", email: "halo@kopisenja.example", cta: "Pesan sekarang", address: "Malang, Jawa Timur" },
    scenes: SCENES_KOPI,
  },
  {
    id: "web3d-surya-nusa",
    title: "Surya Nusa Energi · Panel Surya untuk Semua",
    description: "Website 3D scroll-driven bernuansa terang untuk perusahaan energi terbarukan: matahari bersinar, ladang panel surya, turbin angin, baterai pintar, dan kota hijau. Three.js prosedural + Lenis.",
    brand: "Surya Nusa",
    nav: navOf(SURYA_SECTIONS),
    font: { display: "Outfit", text: "Figtree", href: "https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Figtree:wght@400;600&display=swap" },
    colors: { bg: "#e8f4f1", fog: "#e8f4f1", ink: "#10302b", inkSoft: "#3d5f59", accent: "#0f9d74", accent2: "#f5b82e", panel: "rgba(240,250,247,.8)", fallback: "linear-gradient(180deg, #f3fbf9 0%, #d8eee8 55%, #bfe3d8 100%)", light: "#ffffff", dark: false, ground: "#c6ddd6" },
    fog: 0.018,
    sections: SURYA_SECTIONS,
    contact: { title: "Siap beralih ke energi surya?", text: "Kirim alamat dan rata-rata tagihan listrik bulanan Anda. Kami kirim perkiraan penghematan dalam satu hari kerja.", email: "halo@suryanusa.example", cta: "Minta perkiraan", address: "Denpasar, Bali" },
    scenes: SCENES_SURYA,
  },
];
