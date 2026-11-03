/* ================================================================== */
/* OWD Scrub: mesin animasi terikat scroll milik OneWebDev.              */
/*                                                                    */
/* Pengganti GSAP + ScrollTrigger di template kode. Lisensi GSAP        */
/* melarang pemakaian di builder visual seperti OneWebDev, jadi bagian  */
/* yang kami pakai ditulis ulang di sini (tanpa kode GSAP).             */
/*                                                                    */
/* API sengaja dibuat mirip bagian kecil GSAP yang dipakai template:    */
/*   S.to(target, vars) · S.fromTo(target, from, to) ·                 */
/*   S.timeline({ scrollTrigger }).fromTo(...) ·                       */
/*   S.ticker.add(fn) · S.ScrollTrigger.create({ … onUpdate, onToggle })*/
/*   · S.ScrollTrigger.update() · S.ScrollTrigger.getAll()              */
/* vars.scrollTrigger = { trigger, start, end, scrub }:                 */
/*   start/end  "top bottom", "top 20%", "center 50%", "bottom 55%",   */
/*              angka piksel, atau end: "max" (akhir halaman).         */
/*   scrub      true = langsung; angka = detik untuk menyusul.         */
/* Target: objek biasa (angka di-interpolasi, teks berganti di tengah) */
/* atau elemen/selector/daftar elemen (opacity, x, y, scale, scaleX,   */
/* scaleY, rotate, clipPath, dan properti CSS angka lain).             */
/* Ease: none, power1–4 (.in/.out/.inOut), sine. Stagger: angka.       */
/* ================================================================== */

export const SCRUB_JS = String.raw`
window.OWDScrub = (function () {
  "use strict";
  var all = [], tickers = [], t0 = 0, last = 0, running = false, dirty = true;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function power(n, mode) {
    return function (t) {
      if (mode === "in") return Math.pow(t, n);
      if (mode === "inOut") return t < 0.5 ? Math.pow(2 * t, n) / 2 : 1 - Math.pow(2 - 2 * t, n) / 2;
      return 1 - Math.pow(1 - t, n);
    };
  }
  function easeOf(name) {
    if (typeof name === "function") return name;
    if (!name) return power(2, "out"); /* bawaan = power1.out (n=2 di sini setara kuadrat) */
    if (name === "none" || name === "linear") return function (t) { return t; };
    var m = /^(power([0-4])|sine)(?:\.(in|out|inOut))?$/.exec(name);
    if (!m) return power(2, "out");
    if (m[1] === "sine") {
      var mode = m[3] || "out";
      return mode === "in" ? function (t) { return 1 - Math.cos((t * Math.PI) / 2); } : mode === "inOut" ? function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; } : function (t) { return Math.sin((t * Math.PI) / 2); };
    }
    return power(Number(m[2]) + 1, m[3] || "out");
  }
  function els(t) {
    if (typeof t === "string") return Array.prototype.slice.call(document.querySelectorAll(t));
    if (t && typeof t.length === "number" && !t.nodeType) return Array.prototype.slice.call(t);
    return [t];
  }
  var SPECIAL = { scrollTrigger: 1, ease: 1, stagger: 1, immediateRender: 1, duration: 1, transformOrigin: 1 };
  var TRANSFORM = { x: "px", y: "px", scale: "", scaleX: "", scaleY: "", rotate: "deg", rotateX: "deg", rotateY: "deg" };
  function isEl(o) { return o && o.nodeType === 1; }

  /* Ambil angka-angka di dalam teks (mis. clipPath "inset(0 100% 0 0)") agar bisa di-interpolasi. */
  function nums(s) { return String(s).match(/-?\d*\.?\d+/g) || []; }
  function mixStr(a, b, k) {
    var na = nums(a), i = 0;
    return String(b).replace(/-?\d*\.?\d+/g, function (m) { var f = na[i] !== undefined ? parseFloat(na[i]) : 0; i++; return String(Math.round((f + (parseFloat(m) - f) * k) * 1000) / 1000); });
  }
  /* Nilai transform awal diambil dari CSS (mis. scaleX(0) pada garis progres). */
  function stateOf(el) {
    if (el.__owds) return el.__owds;
    var st = { x: 0, y: 0, scale: 1, scaleX: 1, scaleY: 1, rotate: 0, rotateX: 0, rotateY: 0 };
    var tr = getComputedStyle(el).transform;
    if (tr && tr !== "none" && window.DOMMatrixReadOnly) {
      var m = new DOMMatrixReadOnly(tr);
      st.x = m.m41; st.y = m.m42;
      st.scaleX = Math.hypot(m.a, m.b); st.scaleY = Math.hypot(m.c, m.d);
      st.rotate = (Math.atan2(m.b, m.a) * 180) / Math.PI;
    }
    return (el.__owds = st);
  }
  function readEl(el, key) {
    var st = stateOf(el);
    if (key in TRANSFORM) return st[key];
    var v = getComputedStyle(el)[key];
    return key === "opacity" ? parseFloat(v) : v;
  }
  function writeEl(el, key, v) {
    var st = stateOf(el);
    if (key in TRANSFORM) {
      st[key] = v;
      el.style.transform = "translate(" + st.x + "px," + st.y + "px)" + (st.rotate ? " rotate(" + st.rotate + "deg)" : "") + (st.rotateX ? " rotateX(" + st.rotateX + "deg)" : "") + (st.rotateY ? " rotateY(" + st.rotateY + "deg)" : "") + " scale(" + st.scale * st.scaleX + "," + st.scale * st.scaleY + ")";
    } else el.style[key] = typeof v === "number" && key !== "opacity" && key !== "zIndex" ? v + "px" : String(v);
  }

  /* Satu tween = satu target, nilai awal & akhir, posisi dalam rentang 0..1. */
  function makeTween(target, from, to, offset, span) {
    var keys = Object.keys(to).filter(function (k) { return !SPECIAL[k]; });
    var el = isEl(target);
    if (el && to.transformOrigin) target.style.transformOrigin = to.transformOrigin;
    if (el && from && from.transformOrigin) target.style.transformOrigin = from.transformOrigin;
    var a = {}, b = {};
    keys.forEach(function (k) { a[k] = from && k in from ? from[k] : el ? readEl(target, k) : target[k]; b[k] = to[k]; });
    var ease = easeOf(to.ease);
    return {
      render: function (p) {
        var k = ease(clamp((p - offset) / span, 0, 1));
        keys.forEach(function (key) {
          var va = a[key], vb = b[key], v;
          if (typeof va === "number" && typeof vb === "number") v = va + (vb - va) * k;
          else if (typeof vb === "string" && /\d/.test(vb) && /\d/.test(String(va))) v = k >= 1 ? vb : k <= 0 ? va : mixStr(va, vb, k);
          else v = k >= 0.5 ? vb : va;
          if (el) writeEl(target, key, v); else target[key] = v;
        });
      },
    };
  }

  /* Posisi "<tepi elemen> <tepi layar>" → piksel scroll. */
  function edge(word, size) {
    if (word === "top" || word === undefined) return 0;
    if (word === "center") return size / 2;
    if (word === "bottom") return size;
    if (/%$/.test(word)) return (parseFloat(word) / 100) * size;
    return parseFloat(word) || 0;
  }
  function pos(spec, trigger, isEnd) {
    var max = Math.max(0, document.documentElement.scrollHeight - innerHeight);
    if (typeof spec === "number") return spec;
    if (spec === "max") return max;
    if (!trigger) return isEnd ? max : 0;
    var parts = String(spec || (isEnd ? "bottom top" : "top bottom")).split(/\s+/);
    var r = trigger.getBoundingClientRect(), top = r.top + scrollY;
    return top + edge(parts[0], r.height) - edge(parts[1], innerHeight);
  }

  function ST(cfg) {
    var self = this;
    this.vars = cfg;
    this.trigger = typeof cfg.trigger === "string" ? document.querySelector(cfg.trigger) : cfg.trigger || null;
    this.tweens = [];
    this.progress = 0;
    this.shown = -1;
    this.target = 0;
    this.isActive = false;
    this.lag = cfg.scrub === true || cfg.scrub === undefined ? 0 : Number(cfg.scrub) || 0;
    this.kill = function () { var i = all.indexOf(self); if (i >= 0) all.splice(i, 1); };
    this.refresh();
    all.push(this);
    dirty = true;
    start();
  }
  ST.prototype.refresh = function () {
    this.start = pos(this.vars.start, this.trigger, false);
    this.end = pos(this.vars.end, this.trigger, true);
    if (this.end <= this.start) this.end = this.start + 1;
  };
  ST.prototype.measure = function () {
    var y = scrollY;
    this.target = clamp((y - this.start) / (this.end - this.start), 0, 1);
    var active = y >= this.start && y <= this.end;
    if (active !== this.isActive) { this.isActive = active; if (this.vars.onToggle) this.vars.onToggle(this); }
  };
  /* Majukan progres (scrub angka = menyusul pelan). Hasil: true bila berubah. */
  ST.prototype.advance = function (dt, force) {
    if (this.lag > 0 && !force) this.progress += (this.target - this.progress) * (1 - Math.exp((-dt * 4) / this.lag));
    else this.progress = this.target;
    if (Math.abs(this.target - this.progress) < 0.0005) this.progress = this.target;
    if (this.progress === this.shown && !force) return false;
    this.changed = true;
    return true;
  };
  ST.prototype.render = function () {
    var first = this.shown < 0;
    /* Seperti GSAP: tween yang belum pernah dimulai (progres 0) tidak menimpa nilai awal halaman. */
    if (first && this.progress === 0 && this.lazy) { this.shown = 0; return; }
    this.shown = this.progress;
    this.tweens.forEach(function (t) { t.render(this.progress); }, this);
  };
  ST.prototype.step = function (dt, force) {
    if (!this.advance(dt, force)) return;
    this.render();
    this.changed = false;
    if (this.vars.onUpdate) this.vars.onUpdate(this);
  };

  function add(targets, from, to) {
    var cfg = to.scrollTrigger || {};
    var st = cfg instanceof ST ? cfg : new ST(typeof cfg === "string" ? { trigger: cfg } : cfg);
    var list = isEl(targets) || typeof targets === "string" || (targets && typeof targets.length === "number") ? els(targets) : [targets];
    var n = list.length, gap = Number(to.stagger) || 0, dur = 0.5, total = dur + gap * (n - 1);
    list.forEach(function (t, i) { st.tweens.push(makeTween(t, from, to, n > 1 ? (i * gap) / total : 0, n > 1 ? dur / total : 1)); });
    if (from && to.immediateRender === false) st.lazy = true;
    if (!from) st.lazy = true;
    st.step(0, true);
    return st;
  }

  /* Beberapa trigger boleh menggerakkan objek yang sama (pose per bab). Agar hasilnya   */
  /* selalu "bab yang sedang dibaca", urutan gambar dibuat pasti: trigger yang kembali ke */
  /* 0 digambar dari belakang ke depan, lalu semua yang sedang/sudah jalan (progres > 0)  */
  /* digambar dari depan ke belakang, sehingga bab paling akhir yang aktif menang.         */
  function frame(now) {
    var dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
    last = now;
    if (!t0) t0 = now;
    tickers.slice().forEach(function (fn) { fn((now - t0) / 1000); });
    var any = false, i, s;
    for (i = 0; i < all.length; i++) { s = all[i]; if (dirty) s.measure(); if (s.advance(dt, false)) any = true; }
    dirty = false;
    if (any) {
      for (i = all.length - 1; i >= 0; i--) { s = all[i]; if (s.changed && s.progress === 0) s.render(); }
      for (i = 0; i < all.length; i++) { s = all[i]; if (s.progress > 0 && s.tweens.length) s.render(); }
      for (i = 0; i < all.length; i++) { s = all[i]; if (s.changed) { s.changed = false; if (s.vars.onUpdate) s.vars.onUpdate(s); } }
    }
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }
  function refreshAll() { all.forEach(function (s) { s.refresh(); }); dirty = true; }
  addEventListener("scroll", function () { dirty = true; }, { passive: true });
  addEventListener("resize", refreshAll);
  addEventListener("load", refreshAll);
  if (window.ResizeObserver) new ResizeObserver(refreshAll).observe(document.documentElement);

  var api = {
    registerPlugin: function () {},
    to: function (t, v) { return add(t, null, v); },
    fromTo: function (t, a, b) { return add(t, a, b); },
    timeline: function (v) {
      var cfg = (v && v.scrollTrigger) || {};
      var st = new ST(cfg);
      var tl = { fromTo: function (t, a, b) { add(t, a, Object.assign({}, b, { scrollTrigger: st })); return tl; }, to: function (t, b) { add(t, null, Object.assign({}, b, { scrollTrigger: st })); return tl; }, scrollTrigger: st };
      return tl;
    },
    ticker: { add: function (fn) { tickers.push(fn); start(); }, remove: function (fn) { var i = tickers.indexOf(fn); if (i >= 0) tickers.splice(i, 1); }, lagSmoothing: function () {} },
    ScrollTrigger: {
      create: function (cfg) { var st = new ST(cfg); st.step(0, true); return st; },
      update: function () { dirty = true; },
      refresh: refreshAll,
      getAll: function () { return all.slice(); },
    },
  };
  return api;
})();
`;

/** Ukuran kira-kira untuk catatan pustaka. */
export const SCRUB_NAME = "OWD Scrub (bawaan, tanpa CDN)";
