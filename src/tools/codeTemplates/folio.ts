import { dataBlock, doc, esc, oh, ot, type ThemeVar } from "./shared";
import { FOLIO_RENDER as RENDER, folioApi } from "../../pages/webTemplates/codeTemplates/render/folioRender";
import { BOOT, fontLink, LENIS_STYLE, LIB_IMPORTS, PRELOAD } from "./web3d";

/* ================================================================== */
/* Kategori PORTOFOLIO 3D. Library: three + lenis.                      */
/*                                                                    */
/* - Hero dengan objek 3D interaktif (bereaksi pada pointer; di HP:     */
/*   seret untuk memutar, ketuk untuk denyut).                          */
/* - Tentang, daftar proyek (kartu miring mengikuti kursor), detail     */
/*   proyek di halaman yang sama (#proyek-…), kontak email & WhatsApp.  */
/* - Data proyek dalam satu array PROJECTS di awal skrip. HTML statis   */
/*   dibuat dari array yang sama, jadi konten terbaca penuh tanpa JS.    */
/* ================================================================== */

export interface Project {
  slug: string;
  judul: string;
  ringkas: string;
  deskripsi: string[];
  peran: string;
  tahun: string;
  tag: string[];
  tautan: string;
}

export interface FolioSpec {
  id: string;
  title: string;
  description: string;
  name: string;
  role: string;
  intro: string;
  about: string[];
  skills: string[];
  experience: { tahun: string; posisi: string; tempat: string }[];
  email: string;
  whatsapp: string;
  city: string;
  font: { display: string; text: string; href: string };
  colors: { bg: string; surface: string; ink: string; inkSoft: string; accent: string; accent2: string; line: string; dark: boolean };
  projects: Project[];
  /** Kode JS: function buildHero(ctx) => { update(t, dt, pointer), pulse() }. */
  hero: string;
  /** Kelas tata letak hero. */
  layout: "split" | "stacked";
}

/** HTML statis proyek dari fungsi render yang sama dengan skrip template & editor. */
function staticRender(s: FolioSpec) {
  const api = folioApi();
  const list = withImages(s.projects);
  return { cards: api.renderCards(list, s.colors.accent, s.colors.accent2), details: api.renderDetails(list, s.colors.accent, s.colors.accent2) };
}
/** Tiap proyek punya kolom `gambar` (kosong = gambar contoh SVG) supaya bisa diisi lewat editor. */
const withImages = (list: Project[]) => list.map((p) => ({ ...p, gambar: "" }));

/** Variabel tema yang bisa diubah lewat editor tanpa kode. */
function folioVars(s: FolioSpec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--bg", value: c.bg, label: "Latar halaman" },
    { name: "--surface", value: c.surface, label: "Latar kartu" },
    { name: "--ink", value: c.ink, label: "Teks utama" },
    { name: "--ink-soft", value: c.inkSoft, label: "Teks sekunder" },
    { name: "--accent", value: c.accent, label: "Warna aksen" },
    { name: "--accent-2", value: c.accent2, label: "Warna aksen kedua" },
    { name: "--line", value: c.line, label: "Garis" },
    { name: "--on-accent", value: c.dark ? "#0b0b0b" : "#ffffff", label: "Teks di tombol aksen" },
  ];
}

/* ------------------------------- CSS ------------------------------- */

function css(s: FolioSpec): string {
  return `
:root {
  --font-display: "${s.font.display}", system-ui, sans-serif;
  --font-text: "${s.font.text}", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --pad: clamp(16px, 5vw, 72px);
}
* { box-sizing: border-box; }
html { background: var(--bg); }
body { margin: 0; color: var(--ink); font: 17px/1.65 var(--font-text); -webkit-font-smoothing: antialiased; }
a { color: inherit; }
img, svg { max-width: 100%; display: block; }
.skip { position: absolute; left: -999px; top: 8px; z-index: 50; padding: 10px 14px; background: var(--accent); color: var(--on-accent); border-radius: 8px; }
.skip:focus { left: 8px; }
:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }

.nav { position: sticky; top: 0; z-index: 20; display: flex; align-items: center; gap: 16px; padding: 14px var(--pad); background: color-mix(in srgb, var(--bg) 82%, transparent); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-bottom: 1px solid var(--line); }
.nav .brand { font-family: var(--font-display); font-weight: 700; text-decoration: none; font-size: 18px; }
.nav ul { display: flex; gap: 2px; margin: 0 0 0 auto; padding: 0; list-style: none; }
.nav ul a { display: inline-flex; align-items: center; min-height: 44px; padding: 0 12px; border-radius: 999px; text-decoration: none; color: var(--ink-soft); font-size: 15px; }
.nav ul a:hover { color: var(--ink); background: var(--surface); }

/* Hero */
.hero { position: relative; display: grid; gap: 24px; align-items: center; min-height: calc(100vh - 73px); padding: 40px var(--pad) 64px; }
.hero.split { grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); }
.hero.stacked { grid-template-columns: 1fr; text-align: center; justify-items: center; }
.hero .kicker { color: var(--accent); }
.hero h1 { margin: 0; font-family: var(--font-display); font-weight: 700; font-size: clamp(44px, 8vw, 104px); line-height: .98; letter-spacing: -.035em; }
.hero p.lead { max-width: 46ch; margin: 22px 0 0; font-size: clamp(17px, 1.6vw, 20px); color: var(--ink-soft); }
.hero.stacked p.lead { margin-left: auto; margin-right: auto; }
.stage { position: relative; aspect-ratio: 1; width: 100%; max-width: 640px; justify-self: center; border-radius: 28px; overflow: hidden; touch-action: pan-y; background: radial-gradient(60% 60% at 50% 45%, color-mix(in srgb, var(--accent) 45%, transparent), transparent 70%), radial-gradient(40% 40% at 65% 65%, color-mix(in srgb, var(--accent-2) 55%, transparent), transparent 70%); }
.hero.stacked .stage { order: -1; max-width: 520px; aspect-ratio: 16 / 10; }
.stage canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; opacity: 0; transition: opacity .8s; cursor: grab; }
html.webgl .stage canvas { opacity: 1; }
.stage .hint { position: absolute; left: 50%; bottom: 14px; transform: translateX(-50%); margin: 0; padding: 6px 12px; border-radius: 999px; background: color-mix(in srgb, var(--bg) 70%, transparent); font-size: 13px; color: var(--ink-soft); white-space: nowrap; opacity: 0; transition: opacity .6s; }
html.webgl .stage .hint { opacity: 1; }
.stage .spin { position: absolute; inset: 0; display: none; place-items: center; }
html.loading .stage .spin { display: grid; }
.spin i { width: 34px; height: 34px; border-radius: 50%; border: 3px solid var(--line); border-top-color: var(--accent); animation: rot .9s linear infinite; }
@keyframes rot { to { transform: rotate(360deg); } }

.kicker { margin: 0 0 12px; font-size: 13px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); }
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 48px; padding: 0 22px; border-radius: 999px; background: var(--accent); color: var(--on-accent); font-weight: 600; text-decoration: none; border: 0; transition: transform .2s; }
.btn:hover { transform: translateY(-2px); }
.btn.ghost { background: transparent; color: var(--ink); border: 1.5px solid var(--line); }
.ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.hero.stacked .ctas { justify-content: center; }

section.block { padding: clamp(72px, 10vw, 128px) var(--pad); border-top: 1px solid var(--line); }
h2 { margin: 0 0 28px; font-family: var(--font-display); font-weight: 700; font-size: clamp(34px, 5vw, 60px); line-height: 1.02; letter-spacing: -.03em; }

/* Tentang */
.about { display: grid; gap: 40px; }
@media (min-width: 900px) { .about { grid-template-columns: 1.2fr 1fr; } }
.about p { margin: 0 0 16px; max-width: 60ch; color: var(--ink-soft); }
.chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 18px; padding: 0; list-style: none; }
.chips li, .tags span { display: inline-flex; padding: 4px 12px; border-radius: 999px; border: 1px solid var(--line); font-size: 14px; color: var(--ink-soft); }
.timeline { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; }
.timeline li { display: grid; grid-template-columns: 110px 1fr; gap: 12px; padding: 14px 0; border-bottom: 1px solid var(--line); }
.timeline b { display: block; }
.timeline span { color: var(--ink-soft); font-size: 15px; }

/* Proyek */
.cards { display: grid; gap: 22px; margin: 0; padding: 0; list-style: none; grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr)); perspective: 1000px; }
.card { position: relative; display: flex; flex-direction: column; height: 100%; border-radius: 22px; overflow: hidden; background: var(--surface); border: 1px solid var(--line); text-decoration: none; transform-style: preserve-3d; transition: transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s; will-change: transform; }
.card:hover { box-shadow: 0 30px 50px -30px rgba(0,0,0,.55); }
.card .art { width: 100%; height: auto; aspect-ratio: 400 / 260; }
.card::after { content: ""; position: absolute; inset: 0; pointer-events: none; background: radial-gradient(circle at var(--gx, 50%) var(--gy, 0%), rgba(255,255,255,.22), transparent 45%); opacity: 0; transition: opacity .3s; }
.card:hover::after { opacity: 1; }
.card-body { display: grid; gap: 6px; padding: 20px 22px 24px; transform: translateZ(30px); }
.card-body strong { font-family: var(--font-display); font-size: 24px; line-height: 1.15; }
.card-body > span:not(.tags):not(.card-year) { color: var(--ink-soft); }
.card-year { font-size: 13px; color: var(--accent); font-weight: 600; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 6px; }

/* Detail proyek: dengan JS hanya yang dituju (#proyek-…) yang tampil; tanpa JS semua tampil berurutan. */
.details { margin-top: 48px; display: grid; gap: 40px; }
.detail { padding: clamp(20px, 3vw, 36px); border-radius: 26px; background: var(--surface); border: 1px solid var(--line); scroll-margin-top: 90px; }
.detail .art { border-radius: 18px; width: 100%; height: auto; }
.detail h3 { margin: 0 0 12px; font-family: var(--font-display); font-size: clamp(28px, 4vw, 44px); line-height: 1.05; }
.detail p { color: var(--ink-soft); }
.detail-grid { display: grid; gap: 28px; margin-top: 16px; }
@media (min-width: 900px) { .detail-grid { grid-template-columns: 1fr 1fr; align-items: start; } }
.back { display: inline-flex; min-height: 44px; align-items: center; font-weight: 600; color: var(--accent); }
html.js .detail { display: none; }
.detail:focus:not(:focus-visible) { outline: none; }
html.js .detail:target { display: block; animation: rise .5s ease both; }
@keyframes rise { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }

/* Kontak */
.contact { text-align: center; }
.contact h2 { max-width: 14ch; margin-left: auto; margin-right: auto; }
.contact p { color: var(--ink-soft); }
.contact .mail { display: inline-block; margin-top: 8px; font-family: var(--font-display); font-size: clamp(24px, 4vw, 44px); color: var(--accent); text-underline-offset: 8px; word-break: break-word; }
.contact .ctas { justify-content: center; }
footer { padding: 28px var(--pad) 40px; display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; font-size: 14px; color: var(--ink-soft); border-top: 1px solid var(--line); }

@media (max-width: 860px) {
  .hero.split { grid-template-columns: 1fr; }
  .hero.split .stage { order: -1; max-width: 460px; }
  .nav ul { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .card, .stage canvas { transition: none; }
  html.js .detail:target { animation: none; }
  .spin i { animation: none; }
}
`;
}

/* ------------------------------- mesin ----------------------------- */

const ENGINE = String.raw`
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

/* 1) Proyek: render ulang dari PROJECTS (HTML statis tetap ada bila JS mati). */
const css = getComputedStyle(root);
const A1 = css.getPropertyValue("--accent").trim(), A2 = css.getPropertyValue("--accent-2").trim();
document.getElementById("daftar-proyek").innerHTML = renderCards(PROJECTS, A1, A2);
document.getElementById("detail-proyek").innerHTML = renderDetails(PROJECTS, A1, A2);
function focusTarget() { const t = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (t && t.classList.contains("detail")) t.focus({ preventScroll: true }); }
addEventListener("hashchange", focusTarget);

/* 2) Kartu miring mengikuti kursor (hanya pointer halus, tanpa kurangi-gerak). */
if (!reduce && matchMedia("(pointer: fine)").matches) {
  document.addEventListener("pointermove", (e) => {
    const card = e.target.closest && e.target.closest("[data-tilt]");
    document.querySelectorAll("[data-tilt].tilting").forEach((c) => { if (c !== card) { c.classList.remove("tilting"); c.style.transform = ""; } });
    if (!card) return;
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    card.classList.add("tilting");
    card.style.transform = "rotateX(" + ((0.5 - y) * 12).toFixed(2) + "deg) rotateY(" + ((x - 0.5) * 14).toFixed(2) + "deg) translateZ(0)";
    card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
    card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
  }, { passive: true });
}

/* 3) Gulir halus. */
let lenis = null;
if (!reduce) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  const loop = (t) => { lenis.raf(t); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    const el = id && document.getElementById(id);
    if (!el) return;
    requestAnimationFrame(() => lenis.scrollTo(el, { offset: -80 }));
  });
}

/* 4) Hero 3D */
function fail(reason) { root.classList.add("no-webgl"); root.classList.remove("loading"); console.warn("[owd] Hero 3D tidak aktif:", reason); }
function hasWebGL() { try { const c = document.createElement("canvas"); return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl"))); } catch (e) { return false; } }
const stage = document.getElementById("stage");
const canvas = stage.querySelector("canvas");
if (!hasWebGL()) fail("WebGL tidak tersedia");
else { try { startHero(); } catch (e) { fail(e && e.message ? e.message : String(e)); } }

function startHero() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 9);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.3));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(4, 6, 5); scene.add(key);
  const rim = new THREE.DirectionalLight(A2 || 0xffffff, 1.6); rim.position.set(-5, -2, -4); scene.add(rim);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0, down: false, drag: 0, active: false };
  const hero = buildHero({ THREE, scene, camera, A1, A2, reduce });

  const tris = (() => { let n = 0; scene.traverse((o) => { if (o.isMesh) { const g = o.geometry; n += ((g.index ? g.index.count : g.attributes.position.count) / 3) * (o.isInstancedMesh ? o.count : 1); } }); return Math.round(n); })();
  window.__OWD_STATS = { triangles: tris, budget: 50000, contexts: 1 };

  /* Pointer: desktop mengikuti kursor; sentuh: seret memutar, ketuk berdenyut. */
  const rect = () => stage.getBoundingClientRect();
  stage.addEventListener("pointermove", (e) => {
    const r = rect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
    if (e.pointerType === "mouse") { pointer.tx = nx; pointer.ty = ny; pointer.active = true; }
    else if (pointer.down) { pointer.drag += e.movementX * 0.01; pointer.tx = Math.max(-1, Math.min(1, pointer.tx + e.movementX * 0.004)); pointer.ty = Math.max(-1, Math.min(1, pointer.ty - e.movementY * 0.004)); }
  });
  stage.addEventListener("pointerleave", () => { pointer.tx = 0; pointer.ty = 0; pointer.active = false; });
  stage.addEventListener("pointerdown", (e) => { pointer.down = true; pointer.active = true; if (hero.pulse) hero.pulse(); });
  addEventListener("pointerup", () => { pointer.down = false; });

  function resize() {
    const r = rect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  let visible = true;
  const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting; });
  io.observe(stage);

  const clock = new THREE.Clock();
  let raf = 0, first = true, frames = 0, slow = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(clock.getDelta(), 0.1);
    if (!visible || document.hidden) return;
    pointer.x += (pointer.tx - pointer.x) * Math.min(1, dt * 4);
    pointer.y += (pointer.ty - pointer.y) * Math.min(1, dt * 4);
    hero.update(reduce ? 0 : clock.elapsedTime, reduce ? 0 : dt, pointer);
    renderer.render(scene, camera);
    if (first) { first = false; root.classList.add("webgl"); root.classList.remove("loading"); }
    frames++; if (dt > 0.022) slow++;
    if (frames === 90) { if (slow > 45 && dpr > 1) { dpr = Math.max(1, dpr - 0.5); renderer.setPixelRatio(dpr); resize(); } frames = 0; slow = 0; }
  }
  if (window.OWD_THUMB) { hero.update(1.2, 0.016, pointer); renderer.render(scene, camera); root.classList.add("webgl"); root.classList.remove("loading"); return; }
  raf = requestAnimationFrame(frame);

  function dispose() {
    cancelAnimationFrame(raf);
    io.disconnect();
    if (lenis) lenis.destroy();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      const m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach((mat) => { for (const k in mat) { const v = mat[k]; if (v && v.isTexture) v.dispose(); } mat.dispose(); });
    });
    renderer.dispose();
    renderer.forceContextLoss();
  }
  addEventListener("pagehide", dispose, { once: true });
  window.__OWD_DISPOSE = dispose;
}
`;

/* ------------------------------- HTML ------------------------------ */

export function buildFolio(s: FolioSpec): string {
  const r = staticRender(s);
  const first = s.name.split(" ")[0];
  const waText = encodeURIComponent(`Halo ${first}, saya melihat portofolio Anda dan ingin berdiskusi tentang proyek.`);
  const NAMA = ot("nama", "Nama");
  const MAIL = oh("email", "Tautan email (mailto:alamat)");
  const body = `
<a class="skip" href="#konten">Lewati ke konten</a>
<header class="nav">
  <a class="brand" href="#beranda"${NAMA}>${esc(s.name)}</a>
  <nav aria-label="Navigasi utama"><ul><li><a href="#tentang"${ot("menu1", "Menu 1")}>Tentang</a></li><li><a href="#proyek"${ot("menu2", "Menu 2")}>Proyek</a></li><li><a href="#kontak"${ot("menu3", "Menu 3")}>Kontak</a></li></ul></nav>
</header>
<main id="konten">
<section class="hero ${s.layout}" id="beranda" aria-labelledby="hero-t">
  <div>
    <p class="kicker"${ot("peran", "Peran / profesi")}>${esc(s.role)}</p>
    <h1 id="hero-t"${NAMA}>${esc(s.name)}</h1>
    <p class="lead"${ot("intro", "Kalimat perkenalan", true)}>${esc(s.intro)}</p>
    <div class="ctas"><a class="btn" href="#proyek"${ot("tombolProyek", "Tombol lihat proyek")}>Lihat proyek</a><a class="btn ghost" href="#kontak"${ot("tombolKontak", "Tombol hubungi")}>Hubungi saya</a></div>
  </div>
  <div class="stage" id="stage" aria-hidden="true">
    <canvas></canvas>
    <div class="spin"><i></i></div>
    <p class="hint"${ot("petunjuk", "Petunjuk objek 3D")}>Gerakkan kursor atau seret objek</p>
  </div>
</section>
<section class="block" id="tentang" aria-labelledby="tentang-t">
  <h2 id="tentang-t"${ot("tentangJudul", "Tentang: judul")}>Tentang</h2>
  <div class="about">
    <div>${s.about.map((p, i) => `<p${ot(`tentang${i + 1}`, `Tentang: paragraf ${i + 1}`, true)}>${esc(p)}</p>`).join("")}
      <ul class="chips" aria-label="Keahlian">${s.skills.map((k, i) => `<li${ot(`keahlian${i + 1}`, `Keahlian ${i + 1}`)}>${esc(k)}</li>`).join("")}</ul>
    </div>
    <ol class="timeline" aria-label="Pengalaman">${s.experience
      .map(
        (e, i) =>
          `<li><span${ot(`pengalaman${i + 1}Tahun`, `Pengalaman ${i + 1}: tahun`)}>${esc(e.tahun)}</span><div><b${ot(`pengalaman${i + 1}Posisi`, `Pengalaman ${i + 1}: posisi`)}>${esc(e.posisi)}</b><span${ot(`pengalaman${i + 1}Tempat`, `Pengalaman ${i + 1}: tempat`)}>${esc(e.tempat)}</span></div></li>`,
      )
      .join("")}</ol>
  </div>
</section>
<section class="block" id="proyek" aria-labelledby="proyek-t">
  <h2 id="proyek-t"${ot("proyekJudul", "Proyek: judul")}>Proyek pilihan</h2>
  <ul class="cards" id="daftar-proyek"><!--owd:render name="cards"-->${r.cards}<!--owd:end--></ul>
  <div class="details" id="detail-proyek"><!--owd:render name="details"-->${r.details}<!--owd:end--></div>
</section>
<section class="block contact" id="kontak" aria-labelledby="kontak-t">
  <p class="kicker"${ot("kontakLabel", "Kontak: label kecil")}>Kontak</p>
  <h2 id="kontak-t"${ot("kontakJudul", "Kontak: judul")}>Punya ide yang ingin diwujudkan?</h2>
  <p${ot("kontakTeks", "Kontak: teks", true)}>Saya terbuka untuk proyek lepas dan kolaborasi jangka panjang.</p>
  <a class="mail" href="mailto:${s.email}"${MAIL}${ot("emailTeks", "Alamat email yang ditampilkan")}>${esc(s.email)}</a>
  <div class="ctas"><a class="btn" href="mailto:${s.email}"${MAIL}${ot("tombolEmail", "Tombol email")}>Kirim email</a><a class="btn ghost" href="https://wa.me/${s.whatsapp}?text=${waText}"${oh("whatsapp", "Tautan WhatsApp (https://wa.me/62…)")} target="_blank" rel="noopener"${ot("tombolWa", "Tombol WhatsApp")}>Chat WhatsApp</a></div>
</section>
</main>
<footer><span><span${NAMA}>${esc(s.name)}</span> · <span${ot("kota", "Kota")}>${esc(s.city)}</span></span><span${ot("catatanKaki", "Catatan kaki")}>Nama dan proyek di halaman ini fiktif.</span></footer>
<script type="module">
${LIB_IMPORTS}

/* ==== DATA PROYEK: ubah di sini (judul, deskripsi, tautan, tag, gambar) ==== */
const PROJECTS = ${dataBlock("PROJECTS", "Daftar proyek", withImages(s.projects), ["slug"])};
/* ========================================================================== */
${RENDER.trim()}

/* Objek 3D hero (prosedural). */
${s.hero.trim()}
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
    vars: folioVars(s),
    css: css(s),
    body,
  });
}

/* ------------------------------ objek hero ------------------------- */

/** Blob organik: ShaderMaterial dengan noise, bereaksi pada jarak pointer. */
const HERO_BLOB = String.raw`
function buildHero({ THREE, scene, A1, A2 }) {
  const uniforms = { uTime: { value: 0 }, uAmp: { value: 0.32 }, uPointer: { value: new THREE.Vector2() }, uA: { value: new THREE.Color(A1) }, uB: { value: new THREE.Color(A2) } };
  const noise = "vec3 h3(vec3 p){p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6)));return -1.0+2.0*fract(sin(p)*43758.5453);}float n3(vec3 p){vec3 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);return mix(mix(mix(dot(h3(i),f),dot(h3(i+vec3(1,0,0)),f-vec3(1,0,0)),u.x),mix(dot(h3(i+vec3(0,1,0)),f-vec3(0,1,0)),dot(h3(i+vec3(1,1,0)),f-vec3(1,1,0)),u.x),u.y),mix(mix(dot(h3(i+vec3(0,0,1)),f-vec3(0,0,1)),dot(h3(i+vec3(1,0,1)),f-vec3(1,0,1)),u.x),mix(dot(h3(i+vec3(0,1,1)),f-vec3(0,1,1)),dot(h3(i+vec3(1,1,1)),f-vec3(1,1,1)),u.x),u.y),u.z);}";
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: noise + "uniform float uTime,uAmp;uniform vec2 uPointer;varying vec3 vN;varying float vD;void main(){vec3 p=position;float d=n3(normal*1.6+uTime*0.35)+0.5*n3(normal*3.2-uTime*0.25);float pull=0.35*max(0.0,dot(normalize(vec3(uPointer,0.8)),normal));d+=pull;vD=d;p+=normal*d*uAmp;vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}",
    fragmentShader: "uniform vec3 uA,uB;varying vec3 vN;varying float vD;void main(){float f=pow(1.0-abs(vN.z),2.2);vec3 c=mix(uB*0.55,uA,smoothstep(-0.2,0.9,vD));c=mix(c,uB,0.25);c+=f*0.5;gl_FragColor=vec4(c,1.0);}",
  });
  const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1.9, 40), mat);
  scene.add(blob);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.015, 6, 160), new THREE.MeshBasicMaterial({ color: A1, transparent: true, opacity: 0.5 }));
  halo.rotation.x = 1.2; scene.add(halo);
  let kick = 0;
  return {
    pulse() { kick = 1; },
    update(t, dt, p) {
      uniforms.uTime.value = t;
      kick = Math.max(0, kick - dt * 1.8);
      uniforms.uAmp.value = 0.3 + kick * 0.35 + (p.active ? 0.08 : 0);
      uniforms.uPointer.value.set(p.x, p.y);
      blob.rotation.y = t * 0.15 + p.x * 0.6 + p.drag;
      blob.rotation.x = -p.y * 0.4;
      halo.rotation.z = t * 0.2;
    },
  };
}
`;

/** Simpul torus mengilap + bola yang mengorbit dan menghindar dari pointer. */
const HERO_KNOT = String.raw`
function buildHero({ THREE, scene, A1, A2 }) {
  const group = new THREE.Group(); scene.add(group);
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(1.35, 0.42, 220, 28, 2, 3), new THREE.MeshPhysicalMaterial({ color: A1, metalness: 0.1, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1, iridescence: 0.9, iridescenceIOR: 1.4, sheen: 0.4, sheenColor: new THREE.Color(A2) }));
  group.add(knot);
  const ballGeo = new THREE.SphereGeometry(1, 32, 16);
  const balls = [];
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(ballGeo, new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? A2 : 0xffffff, roughness: 0.35, metalness: 0.05 }));
    m.userData = { a: (i / 9) * Math.PI * 2, r: 2.7 + (i % 3) * 0.35, s: 0.12 + (i % 4) * 0.06, w: 0.35 + (i % 5) * 0.08, tilt: (i % 2 ? 1 : -1) * 0.5 };
    m.scale.setScalar(m.userData.s);
    group.add(m); balls.push(m);
  }
  const target = new THREE.Vector3();
  let kick = 0;
  return {
    pulse() { kick = 1; },
    update(t, dt, p) {
      kick = Math.max(0, kick - dt * 1.5);
      knot.rotation.x = t * 0.25; knot.rotation.y = t * 0.18 + p.drag;
      knot.scale.setScalar(1 + kick * 0.12);
      group.rotation.y += ((p.x * 0.6) - group.rotation.y) * Math.min(1, dt * 3);
      group.rotation.x += ((-p.y * 0.4) - group.rotation.x) * Math.min(1, dt * 3);
      target.set(p.x * 3.5, p.y * 2.5, 1.5);
      balls.forEach((b) => {
        const u = b.userData, a = u.a + t * u.w;
        b.position.set(Math.cos(a) * u.r, Math.sin(a * 1.3) * u.tilt * 1.6, Math.sin(a) * u.r);
        const d = b.position.distanceTo(target);
        if (p.active && d < 2.2) b.position.addScaledVector(b.position.clone().sub(target).normalize(), (2.2 - d) * 0.6);
      });
    },
  };
}
`;

/** Grid kubus mengambang; pointer membuat riak. */
const HERO_GRID = String.raw`
function buildHero({ THREE, scene, camera, A1, A2 }) {
  const n = 9, count = n * n, gap = 0.62;
  const geo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, metalness: 0.05 }), count);
  const c = new THREE.Color(), a = new THREE.Color(A1), b = new THREE.Color(A2), paper = new THREE.Color(0xf4efe6);
  const cells = [];
  for (let x = 0; x < n; x++) for (let z = 0; z < n; z++) {
    const i = x * n + z;
    cells.push({ x: (x - (n - 1) / 2) * gap, z: (z - (n - 1) / 2) * gap });
    mesh.setColorAt(i, c.copy(paper).lerp((x + z) % 4 === 0 ? a : b, (x + z) % 4 === 0 ? 0.9 : ((x * z) % 5 === 0 ? 0.6 : 0.08)));
  }
  const group = new THREE.Group(); group.add(mesh); scene.add(group);
  group.rotation.set(0.75, -0.6, 0);
  camera.position.set(0, 0, 11);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(1, 1, 1), pos = new THREE.Vector3();
  const ripple = new THREE.Vector2(), ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), hit = new THREE.Vector3(), inv = new THREE.Matrix4();
  let kick = 0;
  return {
    pulse() { kick = 1; },
    update(t, dt, p) {
      kick = Math.max(0, kick - dt);
      group.rotation.y = -0.6 + p.x * 0.35 + p.drag * 0.5;
      group.rotation.x = 0.75 - p.y * 0.2;
      group.updateMatrixWorld();
      ray.setFromCamera({ x: p.x, y: p.y }, camera);
      inv.copy(group.matrixWorld).invert();
      ray.ray.applyMatrix4(inv);
      if (ray.ray.intersectPlane(plane, hit)) ripple.set(hit.x, hit.z);
      cells.forEach((cell, i) => {
        const d = Math.hypot(cell.x - ripple.x, cell.z - ripple.y);
        const wave = Math.sin(t * 1.4 + (cell.x + cell.z) * 0.9) * 0.18;
        const lift = (p.active ? Math.max(0, 1.1 - d) * 0.9 : 0) + kick * Math.sin(d * 3 - t * 6) * 0.25;
        pos.set(cell.x, wave + lift, cell.z);
        e.set(lift * 0.6, 0, wave);
        q.setFromEuler(e);
        m.compose(pos, q, s);
        mesh.setMatrixAt(i, m);
      });
      mesh.instanceMatrix.needsUpdate = true;
    },
  };
}
`;

/** Awan partikel yang berubah bentuk: bola → simpul → spiral; pointer mendorong partikel. */
const HERO_MORPH = String.raw`
function buildHero({ THREE, scene, camera, A1, A2 }) {
  const N = 3600, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const shapes = [new Float32Array(N * 3), new Float32Array(N * 3), new Float32Array(N * 3)];
  const ca = new THREE.Color(A1), cb = new THREE.Color(A2), c = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const u = i / N, phi = Math.acos(1 - 2 * ((i + 0.5) / N)), th = Math.PI * (1 + Math.sqrt(5)) * i;
    shapes[0].set([2.3 * Math.sin(phi) * Math.cos(th), 2.3 * Math.cos(phi), 2.3 * Math.sin(phi) * Math.sin(th)], i * 3);
    const sk = u * Math.PI * 2, k = 1.75 + 0.7 * Math.cos(3 * sk), w = ((i % 9) / 9 - 0.5) * 0.45;
    shapes[1].set([(k + w * Math.cos(th)) * Math.cos(2 * sk), 0.7 * Math.sin(3 * sk) * 1.3 + w * Math.sin(th), (k + w * Math.sin(th)) * Math.sin(2 * sk)], i * 3);
    const a = u * Math.PI * 14, r = 0.3 + u * 2.4;
    shapes[2].set([Math.cos(a) * r, (u - 0.5) * 4.2 + Math.sin(th) * 0.08, Math.sin(a) * r], i * 3);
    c.copy(ca).lerp(cb, (Math.sin(th) + 1) / 2);
    col.set([c.r, c.g, c.b], i * 3);
  }
  pos.set(shapes[0]);
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const dot = document.createElement("canvas"); dot.width = dot.height = 32;
  const g = dot.getContext("2d"), grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, "rgba(255,255,255,1)"); grad.addColorStop(0.5, "rgba(255,255,255,.6)"); grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad; g.fillRect(0, 0, 32, 32);
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.12, vertexColors: true, map: new THREE.CanvasTexture(dot), transparent: true, depthWrite: false }));
  scene.add(pts);
  camera.position.set(0, 0, 9.5);
  const hit = new THREE.Vector3(), tmp = new THREE.Vector3(), inv = new THREE.Matrix4();
  let from = 0, to = 0, mix = 1, hold = 0;
  return {
    pulse() { if (mix >= 1) { from = to; to = (to + 1) % 3; mix = 0; hold = 0; } },
    update(t, dt, p) {
      hold += dt;
      if (mix >= 1 && hold > 5) this.pulse();
      mix = Math.min(1, mix + dt * 0.6);
      const e = mix < 0.5 ? 4 * mix * mix * mix : 1 - Math.pow(-2 * mix + 2, 3) / 2;
      pts.rotation.y = t * 0.12 + p.x * 0.5 + p.drag;
      pts.rotation.x = -p.y * 0.35;
      pts.updateMatrixWorld();
      inv.copy(pts.matrixWorld).invert();
      hit.set(p.x * 3.6, p.y * 2.8, 2).applyMatrix4(inv);
      const A = shapes[from], B = shapes[to];
      for (let i = 0; i < N * 3; i += 3) {
        let x = A[i] + (B[i] - A[i]) * e, y = A[i + 1] + (B[i + 1] - A[i + 1]) * e, z = A[i + 2] + (B[i + 2] - A[i + 2]) * e;
        const br = 1 + Math.sin(t * 1.3 + i * 0.002) * 0.03;
        x *= br; y *= br; z *= br;
        if (p.active) {
          tmp.set(x - hit.x, y - hit.y, z - hit.z);
          const d = tmp.length();
          if (d < 1.6) { const f = (1.6 - d) * 0.55 / (d || 1); x += tmp.x * f; y += tmp.y * f; z += tmp.z * f; }
        }
        pos[i] = x; pos[i + 1] = y; pos[i + 2] = z;
      }
      geo.attributes.position.needsUpdate = true;
    },
  };
}
`;

/** Cincin batang equalizer yang berdenyut; pointer mengangkat batang terdekat. */
const HERO_RING = String.raw`
function buildHero({ THREE, scene, camera, A1, A2 }) {
  const n = 72, R = 2.4;
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.11, 1, 0.22), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0.2, emissive: A1, emissiveIntensity: 0.25 }), n);
  const ca = new THREE.Color(A1), cb = new THREE.Color(A2), c = new THREE.Color();
  for (let i = 0; i < n; i++) mesh.setColorAt(i, c.copy(ca).lerp(cb, (Math.sin((i / n) * Math.PI * 4) + 1) / 2));
  const group = new THREE.Group(); group.add(mesh); scene.add(group);
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.05, 2), new THREE.MeshStandardMaterial({ color: A2, wireframe: true, transparent: true, opacity: 0.55 }));
  const inner = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 16), new THREE.MeshStandardMaterial({ color: A1, emissive: A1, emissiveIntensity: 0.6, roughness: 0.3 }));
  group.add(core, inner);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(R + 0.75, 0.012, 6, 180), new THREE.MeshBasicMaterial({ color: A2, transparent: true, opacity: 0.6 }));
  group.add(ring2);
  group.rotation.x = 0.55;
  camera.position.set(0, 0, 10);
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), pos = new THREE.Vector3(), up = new THREE.Vector3(0, 0, 1);
  let kick = 0;
  return {
    pulse() { kick = 1; },
    update(t, dt, p) {
      kick = Math.max(0, kick - dt * 1.4);
      group.rotation.y += ((p.x * 0.5 + p.drag) - group.rotation.y) * Math.min(1, dt * 3);
      group.rotation.x += ((0.55 - p.y * 0.35) - group.rotation.x) * Math.min(1, dt * 3);
      const pa = Math.atan2(p.y, p.x);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        let h = 0.35 + 0.3 * Math.abs(Math.sin(t * 2.1 + i * 0.45)) + 0.25 * Math.abs(Math.sin(t * 3.3 - i * 0.21)) * Math.abs(Math.sin(t * 0.7 + i * 0.13));
        if (p.active) { let d = Math.abs(a - pa); d = Math.min(d, Math.PI * 2 - d); h += Math.max(0, 1 - d * 2.2) * 1.1; }
        h += kick * (0.6 + 0.4 * Math.sin(i * 1.7));
        pos.set(Math.cos(a) * (R + h / 2), Math.sin(a) * (R + h / 2), 0);
        q.setFromAxisAngle(up, a - Math.PI / 2);
        s.set(1, h, 1);
        m.compose(pos, q, s);
        mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
      core.rotation.y = t * 0.4; core.rotation.z = t * 0.2;
      inner.scale.setScalar(1 + 0.08 * Math.sin(t * 4.2) + kick * 0.3);
      ring2.rotation.z = -t * 0.15;
    },
  };
}
`;

/* ------------------------------ varian --------------------------- */

const P = (slug: string, judul: string, ringkas: string, peran: string, tahun: string, tag: string[], d: string[]): Project => ({ slug, judul, ringkas, deskripsi: d, peran, tahun, tag, tautan: `https://example.com/${slug}` });

export const FOLIO_SPECS: FolioSpec[] = [
  {
    id: "folio-arka-pradipta",
    title: "Arka Pradipta · Creative Developer",
    description: "Portofolio 3D creative developer bernuansa gelap: blob organik interaktif, kartu proyek miring, detail proyek di halaman yang sama. Three.js + Lenis.",
    name: "Arka Pradipta",
    role: "Creative Developer · Jakarta",
    intro: "Saya membangun situs dan pengalaman web interaktif yang terasa hidup, cepat dimuat, dan tetap bisa dipakai semua orang.",
    about: [
      "Delapan tahun terakhir saya bekerja di antara desain dan kode: membuat situs peluncuran produk, instalasi museum, dan alat internal yang menyenangkan dipakai.",
      "Saya percaya animasi yang baik membantu orang memahami, bukan sekadar hiasan. Setiap efek harus punya alasan dan tetap ringan di ponsel.",
    ],
    skills: ["Three.js", "WebGL", "TypeScript", "Aksesibilitas", "Animasi", "Performa web"],
    experience: [
      { tahun: "2023 sampai kini", posisi: "Creative developer lepas", tempat: "Klien di Jakarta, Singapura, dan Tokyo" },
      { tahun: "2019 sampai 2023", posisi: "Lead front-end", tempat: "Studio Garis Nyala" },
      { tahun: "2016 sampai 2019", posisi: "Front-end developer", tempat: "Agensi Kanvas Digital" },
    ],
    email: "halo@arkapradipta.example",
    whatsapp: "6281200000011",
    city: "Jakarta",
    font: { display: "Syne", text: "Inter", href: "https://fonts.googleapis.com/css2?family=Syne:wght@700&family=Inter:wght@400;600&display=swap" },
    colors: { bg: "#0b0c10", surface: "#14161d", ink: "#f2f3f5", inkSoft: "#a6abb8", accent: "#c6f432", accent2: "#5b6cff", line: "#262a35", dark: true },
    layout: "split",
    hero: HERO_BLOB,
    projects: [
      P("arus-kopi", "Arus Kopi", "Situs peluncuran kopi dengan biji 3D yang bisa diputar.", "Pengembangan & animasi", "2026", ["WebGL", "E-commerce"], ["Arus Kopi ingin peluncuran varian baru terasa seperti mencicipi langsung. Kami membuat biji kopi 3D yang bisa diputar dan berubah warna sesuai tingkat sangrai.", "Halaman tetap cepat di ponsel kelas menengah dengan model prosedural dan pemuatan bertahap."]),
      P("museum-sunyi", "Museum Sunyi", "Pameran virtual untuk koleksi arsip foto keluarga.", "Konsep & pengembangan", "2025", ["Pameran", "Aksesibilitas"], ["Pameran daring dengan navigasi keyboard penuh dan deskripsi audio untuk setiap foto.", "Ruang pamer dibangun dari bentuk sederhana sehingga terasa tenang dan fokus pada arsip."]),
      P("kota-data", "Kota Data", "Visualisasi data transportasi kota dalam peta 3D.", "Visualisasi data", "2024", ["Data", "Peta"], ["Data perjalanan harian diubah menjadi kota kecil yang bisa dijelajahi, dengan filter waktu dan moda.", "Dipakai tim perencana untuk presentasi publik."]),
      P("bunyi-hujan", "Bunyi Hujan", "Eksperimen audio visual yang merespons suara sekitar.", "Eksperimen pribadi", "2024", ["Audio", "Eksperimen"], ["Partikel hujan yang menebal dan menipis mengikuti suara dari mikrofon pengunjung.", "Semua diproses di perangkat; tidak ada suara yang dikirim ke server."]),
    ],
  },
  {
    id: "folio-sinta-maharani",
    title: "Sinta Maharani · 3D & Motion Designer",
    description: "Portofolio 3D motion designer bernuansa pastel: simpul torus berkilau dengan bola yang menghindari kursor, kartu proyek miring, dan detail proyek. Three.js + Lenis.",
    name: "Sinta Maharani",
    role: "3D & Motion Designer · Bandung",
    intro: "Saya merancang gerak, bentuk, dan cahaya untuk merek yang ingin terlihat lembut tapi berani.",
    about: [
      "Saya memulai karier sebagai ilustrator, lalu jatuh cinta pada 3D karena bisa membuat ilustrasi yang bisa dikelilingi.",
      "Kini saya membantu merek kecantikan, gaya hidup, dan teknologi membuat identitas gerak yang konsisten di layar mana pun.",
    ],
    skills: ["Motion design", "3D modeling", "Art direction", "Identitas gerak", "Pencahayaan", "Storyboard"],
    experience: [
      { tahun: "2022 sampai kini", posisi: "Desainer 3D & motion lepas", tempat: "Merek lokal dan regional" },
      { tahun: "2019 sampai 2022", posisi: "Motion designer", tempat: "Studio Kabut Pagi" },
      { tahun: "2017 sampai 2019", posisi: "Ilustrator", tempat: "Penerbit Taman Buku" },
    ],
    email: "sinta@maharani.example",
    whatsapp: "6281200000012",
    city: "Bandung",
    font: { display: "Unbounded", text: "Manrope", href: "https://fonts.googleapis.com/css2?family=Unbounded:wght@600;700&family=Manrope:wght@400;600&display=swap" },
    colors: { bg: "#fbf6f4", surface: "#ffffff", ink: "#24182b", inkSoft: "#665a6e", accent: "#9f5cf0", accent2: "#ff9eb5", line: "#ecdfe6", dark: false },
    layout: "stacked",
    hero: HERO_KNOT,
    projects: [
      P("embun-skincare", "Embun Skincare", "Identitas gerak untuk rangkaian perawatan kulit.", "Art direction & 3D", "2026", ["Kecantikan", "3D"], ["Botol dan tetesan dirancang ulang dalam 3D dengan cahaya pagi yang lembut.", "Hasilnya dipakai untuk iklan, kemasan digital, dan konten media sosial selama satu musim."]),
      P("pulas-app", "Pulas", "Animasi orientasi untuk aplikasi tidur.", "Motion design", "2025", ["Aplikasi", "Animasi"], ["Tiga layar orientasi yang menenangkan, dengan gerak lambat yang menyesuaikan pengaturan kurangi gerak.", "Ukuran animasi dijaga kecil agar aplikasi tetap ringan."]),
      P("festival-warna", "Festival Warna", "Visual panggung untuk festival musik kota.", "Desain visual", "2024", ["Event", "Visual panggung"], ["Visual 3D yang bereaksi pada tempo lagu, diputar di tiga layar panggung selama dua malam.", "Disusun agar operator bisa mengganti warna tema secara langsung."]),
    ],
  },
  {
    id: "folio-bima-wiratama",
    title: "Bima Wiratama · Product Designer",
    description: "Portofolio 3D product designer bernuansa kertas hangat: grid kubus yang beriak mengikuti kursor, kartu proyek miring, detail proyek. Three.js + Lenis.",
    name: "Bima Wiratama",
    role: "Product Designer · Surabaya",
    intro: "Saya merancang produk digital yang rapi dan mudah dipahami, dari riset pengguna sampai sistem desain.",
    about: [
      "Saya senang memecah masalah rumit menjadi langkah kecil yang jelas. Di setiap proyek saya mulai dari percakapan dengan pengguna.",
      "Pengalaman saya meliputi aplikasi keuangan, logistik, dan layanan publik, termasuk produk yang dipakai jutaan orang setiap bulan.",
    ],
    skills: ["Riset pengguna", "Desain interaksi", "Sistem desain", "Prototipe", "Penulisan UX", "Figma"],
    experience: [
      { tahun: "2024 sampai kini", posisi: "Principal product designer", tempat: "Perusahaan logistik nasional" },
      { tahun: "2020 sampai 2024", posisi: "Senior product designer", tempat: "Aplikasi dompet digital" },
      { tahun: "2018 sampai 2020", posisi: "UI/UX designer", tempat: "Konsultan teknologi" },
    ],
    email: "bima@wiratama.example",
    whatsapp: "6281200000013",
    city: "Surabaya",
    font: { display: "Bricolage Grotesque", text: "Public Sans", href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;700&family=Public+Sans:wght@400;600&display=swap" },
    colors: { bg: "#f4efe6", surface: "#fffaf2", ink: "#1d1b16", inkSoft: "#5b564b", accent: "#e8552b", accent2: "#2a6f6a", line: "#e0d6c6", dark: false },
    layout: "split",
    hero: HERO_GRID,
    projects: [
      P("kirim-cepat", "Kirim Cepat", "Merancang ulang alur kirim paket untuk UMKM.", "Lead designer", "2026", ["Logistik", "Riset"], ["Alur pengiriman dipangkas dari sembilan langkah menjadi empat, berdasarkan wawancara dengan 40 penjual daring.", "Tingkat pengiriman yang selesai tanpa bantuan CS meningkat setelah peluncuran."]),
      P("dompet-rapi", "Dompet Rapi", "Fitur anggaran bulanan di aplikasi dompet digital.", "Product designer", "2024", ["Fintech", "Interaksi"], ["Fitur anggaran yang membantu pengguna menyisihkan uang tanpa harus membuat spreadsheet.", "Dirancang bersama tim data agar saran anggaran terasa personal namun mudah dipahami."]),
      P("layanan-warga", "Layanan Warga", "Sistem desain untuk portal layanan publik kota.", "Sistem desain", "2023", ["Pemerintah", "Aksesibilitas"], ["Komponen yang memenuhi standar aksesibilitas dan bisa dipakai oleh banyak tim vendor.", "Dokumentasi ditulis dalam bahasa sederhana supaya mudah diikuti."]),
      P("panen-kita", "Panen Kita", "Aplikasi pencatatan panen untuk kelompok tani.", "Riset & prototipe", "2022", ["Pertanian", "Prototipe"], ["Prototipe yang bisa dipakai tanpa sinyal, diuji langsung di sawah bersama petani.", "Ikon dan bahasa disesuaikan dengan istilah yang dipakai sehari-hari."]),
    ],
  },
  {
    id: "folio-naya-kirana",
    title: "Naya Kirana · Sound & Interaction Designer",
    description: "Portofolio 3D sound & interaction designer bernuansa gelap hangat: cincin equalizer 3D yang berdenyut dan bereaksi pada kursor, kartu proyek miring, detail proyek. Three.js + Lenis.",
    name: "Naya Kirana",
    role: "Sound & Interaction Designer · Yogyakarta",
    intro: "Saya merancang bunyi dan interaksi untuk aplikasi, ruang pamer, dan permainan, supaya setiap ketukan terasa punya jawaban.",
    about: [
      "Latar belakang saya musik gamelan dan elektronik. Dari sana saya belajar bahwa bunyi kecil yang tepat bisa membuat produk terasa ramah.",
      "Saya bekerja dari riset sampai implementasi: membuat pustaka bunyi antarmuka, instalasi interaktif, dan prototipe yang bisa langsung diuji.",
    ],
    skills: ["Desain bunyi", "Web Audio", "Prototipe interaksi", "Instalasi", "Komposisi", "Aksesibilitas audio"],
    experience: [
      { tahun: "2023 sampai kini", posisi: "Sound & interaction designer lepas", tempat: "Studio gim dan museum" },
      { tahun: "2020 sampai 2023", posisi: "Desainer audio UX", tempat: "Aplikasi musik daring" },
      { tahun: "2017 sampai 2020", posisi: "Komposer & penata bunyi", tempat: "Kelompok teater Panggung Rakyat" },
    ],
    email: "naya@kirana.example",
    whatsapp: "6281200000014",
    city: "Yogyakarta",
    font: { display: "Space Grotesk", text: "DM Sans", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=DM+Sans:wght@400;600&display=swap" },
    colors: { bg: "#130f0d", surface: "#1d1815", ink: "#f6efe8", inkSoft: "#b5a99d", accent: "#ff8a3d", accent2: "#35d0ba", line: "#2e2622", dark: true },
    layout: "split",
    hero: HERO_RING,
    projects: [
      P("bunyi-antarmuka", "Bunyi Antarmuka Kas", "Pustaka 24 bunyi antarmuka untuk aplikasi kasir.", "Desain bunyi", "2026", ["Audio UX", "Aplikasi"], ["Bunyi konfirmasi, galat, dan notifikasi yang mudah dibedakan bahkan di warung yang ramai.", "Setiap bunyi punya versi getar untuk pengguna yang mematikan suara."]),
      P("ruang-gema", "Ruang Gema", "Instalasi interaktif yang mengubah langkah kaki menjadi musik.", "Konsep & instalasi", "2025", ["Instalasi", "Sensor"], ["Lantai bersensor memicu nada gamelan yang berbeda di tiap ubin.", "Dipamerkan dua bulan dan dimainkan lebih dari sepuluh ribu pengunjung."]),
      P("hutan-malam", "Hutan Malam", "Suasana bunyi adaptif untuk gim petualangan.", "Audio gim", "2024", ["Gim", "Adaptif"], ["Bunyi serangga, angin, dan hujan berubah halus mengikuti waktu dan posisi pemain.", "Dibuat berlapis agar tetap ringan di ponsel."]),
    ],
  },
  {
    id: "folio-raka-aditya",
    title: "Raka Aditya · Data Visualization Engineer",
    description: "Portofolio 3D data visualization engineer bernuansa terang: awan partikel yang berubah bentuk dan menghindar dari kursor, kartu proyek miring, detail proyek. Three.js + Lenis.",
    name: "Raka Aditya",
    role: "Data Visualization Engineer · Medan",
    intro: "Saya mengubah data yang rumit menjadi gambar yang jujur, jelas, dan enak dijelajahi.",
    about: [
      "Saya memulai sebagai analis data, lalu sadar bahwa temuan yang bagus sering hilang karena grafiknya sulit dibaca.",
      "Sekarang saya membangun dasbor, cerita data, dan visualisasi interaktif untuk media, lembaga riset, dan tim produk.",
    ],
    skills: ["D3.js", "Three.js", "Statistika", "Desain informasi", "SQL", "Penulisan data"],
    experience: [
      { tahun: "2024 sampai kini", posisi: "Data visualization engineer", tempat: "Lembaga riset kebijakan" },
      { tahun: "2021 sampai 2024", posisi: "Pengembang grafis interaktif", tempat: "Redaksi media daring" },
      { tahun: "2019 sampai 2021", posisi: "Analis data", tempat: "Perusahaan ritel" },
    ],
    email: "raka@aditya.example",
    whatsapp: "6281200000015",
    city: "Medan",
    font: { display: "Sora", text: "IBM Plex Sans", href: "https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=IBM+Plex+Sans:wght@400;600&display=swap" },
    colors: { bg: "#eef1f7", surface: "#ffffff", ink: "#121a2e", inkSoft: "#4d5872", accent: "#2f5bff", accent2: "#ff5d8f", line: "#d9dfec", dark: false },
    layout: "stacked",
    hero: HERO_MORPH,
    projects: [
      P("jejak-hujan", "Jejak Hujan", "Peta interaktif curah hujan 30 tahun di Sumatra.", "Riset & pengembangan", "2026", ["Peta", "Iklim"], ["Pembaca bisa membandingkan musim hujan antartahun dengan menggeser lini waktu.", "Data diringkas di perangkat sehingga peta tetap cepat di ponsel."]),
      P("harga-pasar", "Harga Pasar", "Dasbor harga bahan pokok untuk pembaca umum.", "Visualisasi data", "2025", ["Dasbor", "Ekonomi"], ["Grafik dibuat sederhana dengan penjelasan satu kalimat di tiap panel.", "Diperbarui otomatis setiap pagi dari data terbuka."]),
      P("suara-kota", "Suara Kota", "Cerita data tentang kebisingan di lima kota.", "Cerita data", "2024", ["Cerita data", "Audio"], ["Gabungan peta, grafik, dan rekaman suara singkat dari tiap lokasi.", "Semua grafik punya tabel alternatif untuk pembaca layar."]),
      P("arus-mudik", "Arus Mudik", "Animasi pergerakan pemudik dari data agregat.", "Grafik interaktif", "2023", ["Animasi", "Transportasi"], ["Ribuan titik bergerak menunjukkan puncak arus mudik dari jam ke jam.", "Data agregat, tanpa informasi pribadi."]),
    ],
  },
];
