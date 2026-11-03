/* ================================================================== */
/* Dokumen iframe untuk canvas & pratinjau Page Maker                   */
/*                                                                    */
/* Halaman dirender di iframe sungguhan (sandbox) supaya @media bereaksi */
/* pada lebar viewport (Desktop/Tablet/Mobile) dan CSS halaman tidak     */
/* bocor ke aplikasi. Mode edit melaporkan kotak (rect) tiap node ke     */
/* induk; overlay (toolbar, tombol +, penanda drop) digambar di induk.   */
/* ================================================================== */

import { IMG_FALLBACK_TAG } from "./imagePlaceholder";

export interface PageRenderMessage {
  type: "pm:render";
  css: string;
  body: string;
  script: string;
  /** true = mode edit (klik memilih node, kontainer kosong diberi tinggi minimum). */
  edit: boolean;
  /** Library CDN (hanya dimuat di luar mode edit). */
  libs?: { css: string[]; js: string[]; init: string; editJs?: string[] };
}

export type PageOutgoing =
  | { type: "pm:ready" }
  | { type: "pm:pick"; id: string | null; dbl?: boolean }
  | { type: "pm:hover"; id: string | null }
  | { type: "pm:key"; key: string; mod: boolean; shift: boolean }
  | { type: "pm:navigate"; page: string }
  | { type: "pm:rects"; rects: Record<string, { x: number; y: number; w: number; h: number }>; height: number };

const SHELL_CSS = `
*,*::before,*::after{box-sizing:border-box}
html,body{margin:0;padding:0}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;line-height:1.5;background:#fff}
#pm-root{display:block}
html[data-edit] [data-cm-box][data-cm-empty]{min-height:84px}
html[data-edit] body{cursor:default}
`;

const RUNTIME = `
(function () {
  var cssEl = document.getElementById("pm-app");
  var root = document.getElementById("pm-root");
  var html = document.documentElement;
  var edit = false, queued = false, lastHover = null;

  function post(m) { window.parent.postMessage(m, "*"); }

  function measure() {
    queued = false;
    var rects = {};
    var all = root.querySelectorAll("[data-cm-id]");
    var sx = window.pageXOffset, sy = window.pageYOffset;
    for (var i = 0; i < all.length; i++) {
      var r = all[i].getBoundingClientRect();
      rects[all[i].getAttribute("data-cm-id")] = { x: Math.round((r.left + sx) * 10) / 10, y: Math.round((r.top + sy) * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 };
    }
    var rr = root.getBoundingClientRect();
    post({ type: "pm:rects", rects: rects, height: Math.ceil(rr.height + rr.top + sy) });
  }
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(measure);
  }

  function runScript(code) {
    if (!code) return;
    try {
      var s = document.createElement("script");
      s.textContent = code;
      document.body.appendChild(s);
      s.remove();
    } catch (err) { console.error(err); }
  }

  // Library CDN: <link>/<script> dimuat sekali; di mode edit stylesheet dimatikan
  // (AOS menyembunyikan elemen sebelum di-scroll).
  var libLinks = {}, libScripts = {};
  function loadLibs(l, done) {
    // Di mode edit hanya skrip yang aman (mis. Chart.js) yang dimuat.
    var css = edit ? [] : (l && l.css) || [], js = (l && (edit ? l.editJs : l.js)) || [];
    Object.keys(libLinks).forEach(function (u) { libLinks[u].disabled = edit || css.indexOf(u) < 0; });
    if (!css.length && !js.length) return done();
    css.forEach(function (u) {
      if (libLinks[u]) return;
      var k = document.createElement("link");
      k.rel = "stylesheet"; k.href = u; k.onload = schedule;
      document.head.appendChild(k); libLinks[u] = k;
    });
    var pending = js.filter(function (u) { return !libScripts[u]; }), i = 0;
    (function next() {
      if (i >= pending.length) return done();
      var u = pending[i++], s = document.createElement("script");
      libScripts[u] = true; s.src = u;
      s.onload = s.onerror = next;
      document.head.appendChild(s);
    })();
  }

  window.addEventListener("message", function (e) {
    if (e.source !== window.parent) return;
    var m = e.data;
    if (!m || m.type !== "pm:render") return;
    edit = !!m.edit;
    // Bersihkan Custom JS render sebelumnya (listener, timer) sebelum DOM diganti.
    if (document.__pmCustomDestroy) { try { document.__pmCustomDestroy(); } catch (err) { console.error(err); } }
    cssEl.textContent = String(m.css || "");
    root.innerHTML = String(m.body || "");
    if (edit) html.setAttribute("data-edit", ""); else html.removeAttribute("data-edit");
    runScript(m.script);
    lastHover = null;
    schedule();
    var libs = m.libs;
    loadLibs(libs, function () { if (!edit && libs && libs.init) runScript(libs.init); schedule(); });
  });

  function nodeOf(t) { return t && t.closest ? t.closest("[data-cm-id]") : null; }

  document.addEventListener("click", function (e) {
    var t = e.target;
    var a = t && t.closest ? t.closest("a[href]") : null;
    if (a && !(a.getAttribute("href") || "").startsWith("#")) e.preventDefault();
    // Tautan antarhalaman (Menu Element) → minta induk menampilkan halaman itu (hanya pratinjau).
    if (!edit && a && a.getAttribute("data-pm-page")) post({ type: "pm:navigate", page: a.getAttribute("data-pm-page") });
    if (!edit) return;
    var n = nodeOf(t);
    post({ type: "pm:pick", id: n ? n.getAttribute("data-cm-id") : null });
  }, true);
  document.addEventListener("dblclick", function (e) {
    if (!edit) return;
    var n = nodeOf(e.target);
    if (n) post({ type: "pm:pick", id: n.getAttribute("data-cm-id"), dbl: true });
  }, true);
  document.addEventListener("submit", function (e) { e.preventDefault(); }, true);

  document.addEventListener("mouseover", function (e) {
    if (!edit) return;
    var n = nodeOf(e.target);
    var id = n ? n.getAttribute("data-cm-id") : null;
    if (id !== lastHover) { lastHover = id; post({ type: "pm:hover", id: id }); }
  });
  document.addEventListener("mouseleave", function () {
    if (edit && lastHover !== null) { lastHover = null; post({ type: "pm:hover", id: null }); }
  });

  // Keyboard di dalam iframe tidak sampai ke induk → teruskan pintasan builder.
  document.addEventListener("keydown", function (e) {
    if (!edit) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    var mod = e.ctrlKey || e.metaKey, k = e.key;
    var hit = k === "Delete" || k === "Backspace" || k === "Escape" || (mod && (k.toLowerCase() === "z" || k.toLowerCase() === "y"));
    if (!hit) return;
    e.preventDefault();
    post({ type: "pm:key", key: k, mod: mod, shift: e.shiftKey });
  }, true);

  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  document.addEventListener("load", schedule, true);
  document.addEventListener("transitionend", schedule, true);
  document.addEventListener("animationend", schedule, true);
  document.addEventListener("toggle", schedule, true);
  document.addEventListener("click", function () { setTimeout(schedule, 0); setTimeout(schedule, 220); }, true);
  if (window.ResizeObserver) new ResizeObserver(schedule).observe(root);
  if (window.MutationObserver) new MutationObserver(schedule).observe(root, { subtree: true, childList: true, attributes: true });

  post({ type: "pm:ready" });
})();
`;

export const PAGE_SHELL = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>${SHELL_CSS}</style>
<style id="pm-app"></style>
${IMG_FALLBACK_TAG}
</head>
<body>
<div id="pm-root"></div>
<script>${RUNTIME.replace(/<\/script/gi, "<\\/script")}</script>
</body>
</html>`;
