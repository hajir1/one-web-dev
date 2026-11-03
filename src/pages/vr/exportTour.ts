import { LIBRARY_BY_ID } from "../pageMaker/engine/helpers/libraries";
import { MEDIA_EXT, MEDIA_MIME, type Tour, type VrMediaKind } from "./model";

/* ================================================================== */
/* Tur 360° → halaman HTML A-Frame                                      */
/*                                                                    */
/* SATU runtime (RUNTIME_JS) dipakai pratinjau editor dan hasil ekspor, */
/* jadi yang dilihat di editor = yang diunduh. A-Frame dimuat dari CDN  */
/* (versi dikunci) lewat <script> di <head>, dipasang otomatis.         */
/* ================================================================== */

export const AFRAME = LIBRARY_BY_ID.aframe;

/** Data tur yang dibaca runtime (tanpa id internal yang tidak perlu). */
export interface RuntimeTour {
  name: string;
  start: string;
  accent: string;
  autoRotate: boolean;
  scenes: { id: string; name: string; pano: string | null; hotspots: { id: string; kind: string; yaw: number; pitch: number; label: string; target?: string; text?: string; media?: string }[] }[];
}

export function runtimeTour(tour: Tour): RuntimeTour {
  return {
    name: tour.name,
    start: tour.startSceneId,
    accent: tour.accent,
    autoRotate: tour.autoRotate,
    scenes: tour.scenes.map((s) => ({
      id: s.id,
      name: s.name,
      pano: s.panoramaId,
      hotspots: s.hotspots.map((h) => ({ id: h.id, kind: h.kind, yaw: h.yaw, pitch: h.pitch, label: h.label, target: h.targetSceneId, text: h.text, media: h.mediaId })),
    })),
  };
}

/** JSON aman di dalam <script> (tidak bisa menutup tag). */
export const scriptJson = (v: unknown) => JSON.stringify(v).replace(/</g, "\\u003c").replace(/[\u2028\u2029]/g, (c) => (c === "\u2028" ? "\\u2028" : "\\u2029"));
const escHtml = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `html,body{margin:0;height:100%;overflow:hidden;background:#000;font-family:system-ui,-apple-system,"Segoe UI",sans-serif}
a-scene{position:absolute;inset:0}
#vr-title{position:fixed;left:12px;top:12px;z-index:10;max-width:calc(100% - 24px);padding:8px 12px;border-radius:10px;background:rgba(15,23,42,.72);color:#fff;font-size:14px;font-weight:600;pointer-events:none}
#vr-title small{display:block;font-weight:400;opacity:.8}
#vr-tip{position:fixed;left:50%;bottom:76px;z-index:10;transform:translateX(-50%);padding:6px 10px;border-radius:8px;background:rgba(15,23,42,.85);color:#fff;font-size:13px;pointer-events:none;opacity:0;transition:opacity .15s}
#vr-tip.on{opacity:1}
#vr-nav{position:fixed;left:0;right:0;bottom:12px;z-index:10;display:flex;gap:6px;justify-content:center;flex-wrap:wrap;padding:0 12px}
#vr-nav button{border:0;border-radius:999px;padding:7px 12px;background:rgba(15,23,42,.72);color:#fff;font-size:13px;cursor:pointer}
#vr-nav button[aria-current="true"]{background:var(--accent);}
#vr-panel{position:fixed;inset:0;z-index:20;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.55);padding:16px}
#vr-panel.on{display:flex}
#vr-panel .box{max-width:min(560px,100%);max-height:85vh;overflow:auto;border-radius:14px;background:#fff;color:#0f172a;padding:16px 18px;box-shadow:0 20px 50px rgba(0,0,0,.4)}
#vr-panel h2{margin:0 0 8px;font-size:18px}
#vr-panel p{margin:0 0 10px;line-height:1.55;white-space:pre-line}
#vr-panel img{display:block;max-width:100%;border-radius:8px}
#vr-panel audio{width:100%}
#vr-panel button{margin-top:10px;border:0;border-radius:8px;padding:8px 14px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer}
#vr-fade{position:fixed;inset:0;z-index:5;background:#000;opacity:0;pointer-events:none;transition:opacity .25s}
#vr-fade.on{opacity:1}
#vr-note{position:fixed;left:12px;right:12px;top:64px;z-index:30;display:none;padding:10px 12px;border-radius:10px;background:#fef3c7;color:#78350f;font-size:13px;line-height:1.5}
.vr-edit #vr-nav{display:none}
.vr-edit a-scene{cursor:crosshair}`;

/**
 * Runtime tur (JavaScript biasa). `window.__VR_BOOT` = { tour, media, mode }
 * untuk ekspor; di pratinjau editor data datang lewat postMessage.
 */
export const RUNTIME_JS = `(function () {
  var tour = null, urls = {}, mode = "view", current = null, rotating = false, lastShown = null;
  var $ = function (id) { return document.getElementById(id); };
  var sceneEl = document.querySelector("a-scene");
  function post(m) { if (window.parent !== window) window.parent.postMessage(m, "*"); }
  function make(tag, attrs, parent) {
    var e = document.createElement(tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function pos(yaw, pitch, r) {
    var y = yaw * Math.PI / 180, p = pitch * Math.PI / 180;
    return [(-Math.sin(y) * Math.cos(p) * r).toFixed(3), (Math.sin(p) * r).toFixed(3), (-Math.cos(y) * Math.cos(p) * r).toFixed(3)].join(" ");
  }
  function toYawPitch(v) {
    var len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
    var yaw = Math.atan2(-v.x, -v.z) * 180 / Math.PI, pitch = Math.asin(v.y / len) * 180 / Math.PI;
    return { yaw: Math.round(yaw * 10) / 10, pitch: Math.round(Math.max(-85, Math.min(85, pitch)) * 10) / 10 };
  }
  function sceneById(id) { for (var i = 0; i < tour.scenes.length; i++) if (tour.scenes[i].id === id) return tour.scenes[i]; return null; }
  function tip(text) { var t = $("vr-tip"); t.textContent = text || ""; t.className = text ? "on" : ""; }
  function panel(h) {
    var box = $("vr-panel-body"); box.textContent = "";
    make("h2", {}, box).textContent = h.label || "";
    if (h.kind === "info" && h.text) make("p", {}, box).textContent = h.text;
    if (h.kind === "image" && urls[h.media]) make("img", { src: urls[h.media], alt: h.label || "" }, box);
    if (h.kind === "audio" && urls[h.media]) { var a = make("audio", { src: urls[h.media], controls: "" }, box); a.play().catch(function () {}); }
    $("vr-panel").className = "on";
    $("vr-panel-close").focus();
  }
  function closePanel() {
    $("vr-panel").className = "";
    var a = document.querySelector("#vr-panel audio"); if (a) a.pause();
  }
  var ICON = {
    scene: [["a-triangle", { "vertex-a": "0 0.2 0.01", "vertex-b": "-0.17 -0.12 0.01", "vertex-c": "0.17 -0.12 0.01", color: "#ffffff", shader: "flat" }]],
    info: [["a-circle", { radius: "0.06", position: "0 0.15 0.01", color: "#ffffff", shader: "flat" }], ["a-plane", { width: "0.08", height: "0.2", position: "0 -0.06 0.01", color: "#ffffff", shader: "flat" }]],
    image: [["a-plane", { width: "0.34", height: "0.24", position: "0 0 0.01", color: "#ffffff", shader: "flat" }], ["a-triangle", { "vertex-a": "0 0.05 0.02", "vertex-b": "-0.13 -0.09 0.02", "vertex-c": "0.13 -0.09 0.02", shader: "flat" }]],
    audio: [["a-ring", { "radius-inner": "0.1", "radius-outer": "0.17", position: "0 0 0.01", color: "#ffffff", shader: "flat" }], ["a-circle", { radius: "0.05", position: "0 0 0.01", color: "#ffffff", shader: "flat" }]]
  };
  function renderHotspots(s) {
    var holder = $("vr-hotspots");
    while (holder.firstChild) holder.removeChild(holder.firstChild);
    s.hotspots.forEach(function (h) {
      var g = make("a-entity", { "class": "hs", position: pos(h.yaw, h.pitch, 8), rotation: h.pitch + " " + h.yaw + " 0" }, holder);
      make("a-circle", { "class": "hsp", radius: "0.38", color: tour.accent, opacity: "0.92", shader: "flat", animation: "property: scale; to: 1.12 1.12 1.12; dir: alternate; loop: true; dur: 900; easing: easeInOutSine" }, g);
      make("a-ring", { "class": "hsp", "radius-inner": "0.38", "radius-outer": "0.44", color: "#ffffff", shader: "flat", opacity: "0.9" }, g);
      (ICON[h.kind] || ICON.info).forEach(function (p) {
        var a = { "class": "hsp" }; for (var k in p[1]) a[k] = p[1][k];
        if (!a.color) a.color = tour.accent;
        make(p[0], a, g);
      });
      g.addEventListener("mouseenter", function () { tip(h.label || (h.kind === "scene" && sceneById(h.target) ? sceneById(h.target).name : "")); });
      g.addEventListener("mouseleave", function () { tip(""); });
      g.addEventListener("loaded", refreshRays);
      g.addEventListener("click", function (e) {
        e.stopPropagation();
        if (mode === "edit") { post({ type: "vr:pick", id: h.id }); return; }
        if (h.kind === "scene") { if (h.target) show(h.target); }
        else panel(h);
      });
    });
  }
  // Raycaster A-Frame tidak selalu melihat entitas baru; segarkan daftar objeknya.
  function refreshRays() {
    var list = document.querySelectorAll("[raycaster]");
    for (var i = 0; i < list.length; i++) { var rc = list[i].components && list[i].components.raycaster; if (rc && rc.refreshObjects) rc.refreshObjects(); }
  }
  function renderNav() {
    var nav = $("vr-nav"); nav.textContent = "";
    if (tour.scenes.length < 2) return;
    tour.scenes.forEach(function (s) {
      var b = make("button", { type: "button", "aria-current": String(current && current.id === s.id) }, nav);
      b.textContent = s.name;
      b.addEventListener("click", function () { show(s.id); });
    });
  }
  function show(id) {
    var s = sceneById(id) || tour.scenes[0];
    var src = s.pano && urls[s.pano] ? urls[s.pano] : "";
    var changed = !current || current.id !== s.id || lastShown !== src;
    current = s;
    $("vr-title").innerHTML = "";
    $("vr-title").appendChild(document.createTextNode(tour.name));
    make("small", {}, $("vr-title")).textContent = s.name;
    renderHotspots(s);
    setTimeout(refreshRays, 60);
    renderNav();
    tip("");
    if (!changed) return;
    lastShown = src;
    var sky = $("vr-sky"), fade = $("vr-fade");
    fade.className = "on";
    setTimeout(function () {
      var done = function () { setTimeout(function () { fade.className = ""; }, 120); };
      if (!src) { sky.removeAttribute("src"); sky.setAttribute("color", "#1f2937"); return done(); }
      asImage(src, function (ref) {
        if (lastShown !== src) return;
        // Warna material mewarnai tekstur; putih = foto tampil apa adanya.
        sky.setAttribute("color", "#ffffff"); sky.setAttribute("src", ref); done();
      });
    }, mode === "edit" ? 0 : 250);
  }
  // A-Frame menebak jenis URL tanpa ekstensi lewat permintaan HEAD, yang
  // gagal untuk URL blob (pratinjau di aplikasi) sehingga panorama tidak
  // pernah tampil. URL blob dipasang ke <img> dulu, lalu sky memakai "#id".
  var imgs = {}, imgSeq = 0;
  function asImage(src, cb) {
    if (String(src).indexOf("blob:") !== 0) return cb(src);
    var el = imgs[src];
    if (!el) { el = imgs[src] = make("img", { id: "vr-img-" + (++imgSeq), crossorigin: "anonymous", alt: "" }, $("vr-imgs")); el.src = src; }
    if (el.complete && el.naturalWidth) cb("#" + el.id);
    else el.addEventListener("load", function () { cb("#" + el.id); }, { once: true });
  }
  function setMedia(media) {
    var next = {};
    for (var k in media) {
      var v = media[k];
      if (typeof v === "string") next[k] = v;
      else if (v && typeof Blob !== "undefined" && v instanceof Blob) next[k] = urls[k] && urls["__blob_" + k] === v ? urls[k] : URL.createObjectURL(v);
      if (v instanceof Blob) next["__blob_" + k] = v;
    }
    for (var u in urls) if (u.indexOf("__blob_") !== 0 && urls[u] !== next[u] && String(urls[u]).indexOf("blob:") === 0) {
      if (imgs[urls[u]]) { imgs[urls[u]].remove(); delete imgs[urls[u]]; }
      URL.revokeObjectURL(urls[u]);
    }
    urls = next;
  }
  function boot(data) {
    tour = data.tour; mode = data.mode || "view";
    document.documentElement.style.setProperty("--accent", tour.accent);
    document.body.className = mode === "edit" ? "vr-edit" : "";
    setMedia(data.media || {});
    rotating = !!tour.autoRotate && mode !== "edit";
    show(data.sceneId || (current && sceneById(current.id) ? current.id : tour.start));
  }
  function ready(fn) { if (sceneEl.hasLoaded) fn(); else sceneEl.addEventListener("loaded", fn); }
  ready(function () {
    var sky = $("vr-sky");
    sky.addEventListener("click", function (e) {
      if (mode !== "edit" || !e.detail || !e.detail.intersection) return;
      var p = e.detail.intersection.point;
      var r = toYawPitch(p);
      post({ type: "vr:place", yaw: r.yaw, pitch: r.pitch });
    });
    // Kursor tatapan (fuse) hanya aktif di mode headset; di layar biasa ia akan
    // "mengeklik" hotspot yang kebetulan berada di tengah pandangan.
    sceneEl.addEventListener("enter-vr", function () {
      var g = $("vr-gaze");
      g.setAttribute("raycaster", "objects: .hsp");
      g.setAttribute("cursor", "fuse: true; fuseTimeout: 1500");
      g.setAttribute("visible", "true");
    });
    sceneEl.addEventListener("exit-vr", function () {
      var g = $("vr-gaze");
      g.removeAttribute("cursor");
      g.removeAttribute("raycaster");
      g.setAttribute("visible", "false");
    });
    ["pointerdown", "touchstart", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { rotating = false; }, { passive: true }); });
    (function spin() {
      var lc = $("vr-cam").components["look-controls"];
      if (rotating && lc && lc.yawObject) lc.yawObject.rotation.y += 0.0012;
      requestAnimationFrame(spin);
    })();
    if (window.__VR_BOOT) boot(window.__VR_BOOT);
    post({ type: "vr:ready" });
  });
  $("vr-panel-close").addEventListener("click", closePanel);
  $("vr-panel").addEventListener("click", function (e) { if (e.target === $("vr-panel")) closePanel(); });
  window.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });
  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return;
    var m = e.data;
    if (!m || m.type !== "vr:load" || !m.tour) return;
    ready(function () { boot(m); });
  });
  if (location.protocol === "file:" && !(window.__VR_BOOT && window.__VR_BOOT.inline)) { var n = $("vr-note"); n.style.display = "block"; n.textContent = "Tur 360° perlu dibuka lewat server web (hosting atau server lokal) agar foto panorama tampil. Untuk dicoba langsung dengan klik ganda, unduh \u201cPratinjau 1 berkas\u201d dari menu VR. Lihat README.md."; }
})();`;

/** Halaman HTML lengkap. `boot` diisi untuk ekspor; kosong untuk pratinjau editor. */
export function buildTourHtml(opts: { title: string; lang: string; boot?: { tour: RuntimeTour; media: Record<string, string>; mode: "view"; inline?: true } }): string {
  return `<!DOCTYPE html>
<html lang="${opts.lang === "en" ? "en" : "id"}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escHtml(opts.title)}</title>
  <!-- ${AFRAME.name} ${AFRAME.version} (${AFRAME.license}) — dipasang otomatis oleh menu VR -->
  <script src="${AFRAME.js}"></script>
  <style>
${CSS}
  </style>
</head>
<body>
  <a-scene loading-screen="enabled: false" vr-mode-ui="enabled: true" cursor="rayOrigin: mouse" raycaster="objects: .hsp, #vr-sky" renderer="colorManagement: true">
    <a-sky id="vr-sky" radius="500" color="#1f2937"></a-sky>
    <a-entity id="vr-hotspots"></a-entity>
    <a-entity id="vr-cam" camera position="0 0 0" look-controls="reverseMouseDrag: false; magicWindowTrackingEnabled: true" wasd-controls="enabled: false">
      <a-entity id="vr-gaze" visible="false" position="0 0 -1" geometry="primitive: ring; radiusInner: 0.012; radiusOuter: 0.02" material="color: #ffffff; shader: flat"></a-entity>
    </a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .hsp"></a-entity>
  </a-scene>
  <div id="vr-fade"></div>
  <div id="vr-title"></div>
  <div id="vr-tip" role="status" aria-live="polite"></div>
  <nav id="vr-nav" aria-label="Scene"></nav>
  <div id="vr-note" role="alert"></div>
  <div id="vr-imgs" hidden></div>
  <div id="vr-panel" role="dialog" aria-modal="true"><div class="box"><div id="vr-panel-body"></div><button type="button" id="vr-panel-close">Tutup</button></div></div>
  <script>${opts.boot ? `\n    window.__VR_BOOT = ${scriptJson(opts.boot)};` : ""}
${RUNTIME_JS}
  </script>
</body>
</html>
`;
}

export interface TourMediaFile {
  id: string;
  kind: VrMediaKind;
  blob: Blob;
}

/** Nama berkas aset hasil ekspor (urut, tanpa nama asli pengguna). */
export function assetNames(tour: Tour, media: TourMediaFile[]): Record<string, string> {
  const kindOf = Object.fromEntries(media.map((m) => [m.id, m.kind]));
  const out: Record<string, string> = {};
  let pano = 0;
  let other = 0;
  for (const s of tour.scenes) {
    if (s.panoramaId && kindOf[s.panoramaId] && !out[s.panoramaId]) out[s.panoramaId] = `assets/panorama-${++pano}.${MEDIA_EXT[kindOf[s.panoramaId]]}`;
  }
  for (const s of tour.scenes)
    for (const h of s.hotspots)
      if (h.mediaId && kindOf[h.mediaId] && !out[h.mediaId]) out[h.mediaId] = `assets/${h.kind === "audio" ? "audio" : "gambar"}-${++other}.${MEDIA_EXT[kindOf[h.mediaId]]}`;
  return out;
}

function tourReadme(tour: Tour, lang: string): string {
  const id = lang !== "en";
  return id
    ? `# ${tour.name}

Tur 360° hasil menu VR OneWebDev (${tour.scenes.length} scene).

## Cara membuka
Foto panorama dimuat sebagai tekstur WebGL, jadi berkas ini perlu dibuka lewat server web, bukan klik ganda:
- Unggah seluruh isi folder ke hosting statis (mis. hosting web Anda), atau
- Jalankan server lokal di folder ini, mis. \`npx serve .\` atau \`python3 -m http.server\`, lalu buka alamat yang ditampilkan.

Hanya ingin mencoba di komputer sendiri? Di menu VR ada tombol **Pratinjau 1 berkas**: satu file HTML berisi semua foto, bisa dibuka dengan klik ganda (tetap perlu internet untuk memuat A-Frame).

## Library
- ${AFRAME.name} ${AFRAME.version} (${AFRAME.license}) — ${AFRAME.homepage}
  Dimuat dari CDN di <head> index.html: ${AFRAME.js}

## Kontrol
- Seret / geser layar untuk melihat sekeliling; di ponsel bisa memakai sensor gerak.
- Klik titik hotspot untuk pindah ruangan atau membuka info, gambar, dan audio.
- Tombol kacamata VR (kanan bawah) membuka mode headset; arahkan pandangan ke hotspot selama 1,5 detik untuk memilih.
`
    : `# ${tour.name}

360° tour made with the OneWebDev VR menu (${tour.scenes.length} scenes).

## How to open
Panoramas are loaded as WebGL textures, so open this folder through a web server, not by double-clicking:
- Upload the whole folder to static hosting, or
- Run a local server here, e.g. \`npx serve .\` or \`python3 -m http.server\`, then open the printed address.

Just want to try it on your own computer? The VR menu has a **One-file preview** button: a single HTML file with every photo inside that opens by double-click (it still needs internet to load A-Frame).

## Library
- ${AFRAME.name} ${AFRAME.version} (${AFRAME.license}) — ${AFRAME.homepage}
  Loaded from CDN in the <head> of index.html: ${AFRAME.js}

## Controls
- Drag / swipe to look around; on phones the motion sensor works too.
- Click a hotspot to move to another room or open info, an image or audio.
- The VR goggles button (bottom right) enters headset mode; gaze at a hotspot for 1.5 s to select it.
`;
}

/** Blob → data URL (base64) dengan tipe MIME yang ditentukan. */
export async function blobToDataUrl(blob: Blob, mime: string): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return `data:${mime};base64,${btoa(bin)}`;
}

/**
 * Pratinjau 1 berkas: semua foto & audio ditanam sebagai data URL di dalam
 * satu HTML, jadi bisa dibuka dengan klik ganda (file://) tanpa server.
 * Gambar data URL tidak dianggap lintas-origin, sehingga tekstur WebGL tetap
 * boleh dipakai. A-Frame tetap dari CDN (perlu internet).
 */
export async function buildTourSingleHtml(tour: Tour, media: TourMediaFile[], lang: string): Promise<string> {
  const used = assetNames(tour, media);
  const inline: Record<string, string> = {};
  for (const m of media) if (used[m.id]) inline[m.id] = await blobToDataUrl(m.blob, MEDIA_MIME[m.kind]);
  return buildTourHtml({ title: tour.name, lang, boot: { tour: runtimeTour(tour), media: inline, mode: "view", inline: true } });
}

/** Berkas ekspor: index.html + README.md + assets/*. */
export function buildTourFiles(tour: Tour, media: TourMediaFile[], lang: string): { name: string; blob: Blob }[] {
  const names = assetNames(tour, media);
  const html = buildTourHtml({ title: tour.name, lang, boot: { tour: runtimeTour(tour), media: names, mode: "view" } });
  const files = [
    { name: "index.html", blob: new Blob([html], { type: "text/html" }) },
    { name: "README.md", blob: new Blob([tourReadme(tour, lang)], { type: "text/markdown" }) },
  ];
  for (const m of media) if (names[m.id]) files.push({ name: names[m.id], blob: m.blob });
  return files;
}
