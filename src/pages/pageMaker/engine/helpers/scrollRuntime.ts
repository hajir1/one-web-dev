/* ================================================================== */
/* OWD Scroll: "cinematic" scroll effects without a library (v26).       */
/*                                                                    */
/* Written in-house (not GSAP: the GSAP license forbids use in          */
/* no-code visual builders). Embedded in the HTML like OWD Motion, without */
/* CDN. The `data-scroll` attribute is written by compose() from the node settings: */
/*   split     headings appear word by word from behind a line          */
/*   rise      anak-anak box naik bergantian                             */
/*   mask      box terbuka seperti tirai (clip-path)                     */
/*   parallax  moves slower than the scroll                              */
/*   scale     grows to 100% while scrolling                             */
/*   scrub-x   section menempel, isinya bergeser horizontal              */
/*   pin       the section sticks, its children appear one by one        */
/*   counter   numbers in text count up                                 */
/*   marquee   content keeps moving sideways                            */
/*                                                                    */
/* Principle: content is ALWAYS visible when JavaScript is off (initial state */
/* set by the script, not CSS), every effect is off for "reduce         */
/* motion", and scrub-x/pin only on screens >= 768px (on phones the content stays */
/* stacked vertically). Uses the Web Animations API, IntersectionObserver, */
/* and position: sticky. init() is safe to call repeatedly.             */
/* scrub-x: use on a ROW box with fixed-width children (e.g. cards).    */
/* pin: use on a box whose children appear in turn (box height          */
/* < 90% of the screen); the first child is always visible.              */
/* ================================================================== */

export const SCROLL_EFFECTS = ["split", "rise", "mask", "parallax", "scale", "scrub-x", "pin", "counter", "marquee"] as const;
export type ScrollEffect = (typeof SCROLL_EFFECTS)[number];

/** Default "amount" value per effect (0 in the settings = use this). */
export const SCROLL_AMOUNT: Record<ScrollEffect, { def: number; min: number; max: number; unit: string }> = {
  split: { def: 60, min: 0, max: 200, unit: "ms" },
  rise: { def: 48, min: 8, max: 160, unit: "px" },
  mask: { def: 1200, min: 300, max: 3000, unit: "ms" },
  parallax: { def: 20, min: 5, max: 60, unit: "%" },
  scale: { def: 15, min: 3, max: 40, unit: "%" },
  "scrub-x": { def: 100, min: 50, max: 200, unit: "%" },
  pin: { def: 60, min: 30, max: 150, unit: "vh" },
  counter: { def: 1600, min: 400, max: 4000, unit: "ms" },
  marquee: { def: 30, min: 6, max: 120, unit: "s" },
};

export const SCROLL_CSS = `.owds-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.1em;margin-bottom:-.1em}.owds-i{display:inline-block}
html.owds-clip,html.owds-clip body{overflow-x:clip}
.owds-hx{flex-wrap:nowrap!important}
.owds-hx>*{flex:0 0 auto!important;will-change:transform}
.owds-mq{overflow:hidden}.owds-mq-track{display:flex;width:max-content;animation:owds-mq var(--owds-mq,30s) linear infinite}
.owds-mq:hover .owds-mq-track{animation-play-state:paused}
@keyframes owds-mq{to{transform:translate3d(-50%,0,0)}}
@media (prefers-reduced-motion:reduce){.owds-mq-track{animation:none}}`;

export const SCROLL_JS = `/* owd-scroll: OneWebDev scroll effects, no library */
(function () {
  if (window.OWDScroll) return;
  var d = document, W = window;
  var EXPO = "cubic-bezier(.16,1,.3,1)", QUART = "cubic-bezier(.25,1,.5,1)";
  var DEF = { split: 60, rise: 48, mask: 1200, parallax: 20, scale: 15, "scrub-x": 100, pin: 60, counter: 1600, marquee: 30 };
  function reduced() { return W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function wide() { return W.innerWidth >= 768; }
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function attr(el, k, dflt) { var v = parseFloat(el.getAttribute(k)); return isNaN(v) || v <= 0 ? dflt : v; }
  function css() {
    if (d.getElementById("owds-css")) return;
    var s = d.createElement("style"); s.id = "owds-css"; s.textContent = ${JSON.stringify(SCROLL_CSS)};
    d.head.appendChild(s);
  }
  var io = "IntersectionObserver" in W ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); var p = e.target.__owdsPlay; e.target.__owdsPlay = null; if (p) p(); } });
  }, { rootMargin: "0px 0px -10% 0px" }) : null;
  function onEnter(el, play) { if (!io) return play(); el.__owdsPlay = play; io.observe(el); }
  function anim(el, from, to, o) {
    for (var k in from) el.style[k] = "";
    if (el.animate) el.animate([from, to], { duration: o.duration, delay: o.delay || 0, easing: o.easing || EXPO, fill: "backwards" });
  }
  function hide(el, from) { for (var k in from) el.style[k] = from[k]; }
  function words(el) {
    var walker = d.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push(n);
    nodes.forEach(function (t) {
      var frag = d.createDocumentFragment();
      t.nodeValue.split(/(\\s+)/).forEach(function (part) {
        if (!part) return;
        if (/^\\s+$/.test(part)) { frag.appendChild(d.createTextNode(part)); return; }
        var w = d.createElement("span"); w.className = "owds-w";
        var i = d.createElement("span"); i.className = "owds-i"; i.textContent = part;
        w.appendChild(i); frag.appendChild(w);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return Array.prototype.slice.call(el.querySelectorAll(".owds-i"));
  }
  /* Elements that move with the scroll position. */
  var live = [], raf = 0;
  function tick() { raf = 0; var vh = W.innerHeight; live = live.filter(function (u) { return u(vh) !== false; }); }
  function queue() { if (!raf) raf = requestAnimationFrame(tick); }
  W.addEventListener("scroll", queue, { passive: true });
  W.addEventListener("resize", queue);
  /* position: sticky fails when an ancestor has overflow other than visible/clip. */
  function stickyOk(el) {
    for (var p = el.parentElement; p && p !== d.body; p = p.parentElement) {
      var cs = getComputedStyle(p);
      if (/(auto|scroll|hidden)/.test(cs.overflowY + cs.overflowX)) return false;
    }
    return true;
  }
  /* Wrap el in a "track" as tall as the scroll distance; el itself sticks in the middle of the screen. */
  function stick(el, extra) {
    var outer = d.createElement("div"); outer.className = "owds-pin";
    el.parentNode.insertBefore(outer, el); outer.appendChild(el);
    el.style.position = "sticky";
    var st = { outer: outer, top: 0, run: 0 };
    function size() {
      var h = el.offsetHeight;
      st.top = Math.max(0, (W.innerHeight - h) / 2); st.run = extra();
      el.style.top = st.top + "px";
      outer.style.height = (h + st.run) + "px";
    }
    size(); W.addEventListener("resize", size);
    st.p = function () { return st.run > 0 ? clamp((st.top - outer.getBoundingClientRect().top) / st.run) : 0; };
    return st;
  }
  var fx = {
    split: function (el, amt, delay) {
      var ws = words(el), from = { transform: "translateY(110%)" };
      ws.forEach(function (w) { hide(w, from); });
      onEnter(el, function () { ws.forEach(function (w, i) { anim(w, from, { transform: "none" }, { duration: 900, delay: delay + i * amt, easing: QUART }); }); });
    },
    rise: function (el, amt, delay) {
      var kids = Array.prototype.slice.call(el.children), from = { opacity: "0", transform: "translateY(" + amt + "px)" };
      kids.forEach(function (k) { hide(k, from); });
      onEnter(el, function () { kids.forEach(function (k, i) { anim(k, from, { opacity: "1", transform: "none" }, { duration: 800, delay: delay + i * 90 }); }); });
    },
    mask: function (el, amt, delay) {
      var from = { clipPath: "inset(0 0 100% 0)" };
      hide(el, from);
      onEnter(el, function () { anim(el, from, { clipPath: "inset(0 0 0% 0)" }, { duration: amt, delay: delay }); });
    },
    counter: function (el, amt, delay) {
      var leaf = el; while (leaf.children.length === 1) leaf = leaf.children[0];
      var text = leaf.textContent, m = text.match(/\\d[\\d.,]*\\d|\\d/);
      if (!m) return;
      var raw = m[0], dot = raw.indexOf(".") > -1, comma = raw.indexOf(",") > -1;
      // Indonesian style: dot = thousands, comma = decimal (12.500 / 4,8).
      var decSep = comma ? "," : dot && !/\\.\\d{3}(\\D|$)/.test(raw) ? "." : "";
      var parts = decSep ? raw.split(decSep) : [raw];
      var intPart = parts[0].replace(/[.,]/g, ""), places = parts[1] ? parts[1].length : 0;
      var val = parseFloat(intPart + (places ? "." + parts[1] : ""));
      var thou = decSep === "," ? "." : decSep === "." ? "," : dot ? "." : comma ? "," : "";
      if (isNaN(val)) return;
      function fmt(v) {
        var s = v.toFixed(places).split("."), i = s[0];
        if (thou && intPart.length > 3) i = i.replace(/\\B(?=(\\d{3})+(?!\\d))/g, thou);
        return i + (places ? decSep + s[1] : "");
      }
      leaf.textContent = text.replace(raw, fmt(0));
      onEnter(el, function () {
        var t0 = 0;
        function step(t) {
          if (!t0) t0 = t + delay;
          var p = clamp((t - t0) / amt); p = 1 - Math.pow(1 - p, 3);
          leaf.textContent = p >= 1 ? text : text.replace(raw, fmt(val * p));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    },
    marquee: function (el, amt) {
      el.classList.add("owds-mq");
      var track = d.createElement("div"); track.className = "owds-mq-track";
      var gap = getComputedStyle(el).columnGap; if (gap && gap !== "normal") track.style.gap = gap;
      while (el.firstChild) track.appendChild(el.firstChild);
      var copy = track.cloneNode(true);
      Array.prototype.forEach.call(copy.childNodes, function (c) { if (c.nodeType === 1) { c.setAttribute("aria-hidden", "true"); c.setAttribute("data-owds-copy", ""); } });
      while (copy.firstChild) track.appendChild(copy.firstChild);
      el.appendChild(track);
      track.style.setProperty("--owds-mq", amt + "s");
    },
    parallax: function (el, amt) {
      var shift = 0;
      live.push(function (vh) {
        if (!el.isConnected) return false;
        var r = el.getBoundingClientRect(), top = r.top - shift, h = el.offsetHeight;
        if (top > vh || top + h < 0) return;
        var p = clamp((vh - top) / (vh + h));
        shift = (p - 0.5) * amt / 100 * h;
        el.style.transform = "translate3d(0," + shift.toFixed(1) + "px,0)";
      });
    },
    scale: function (el, amt) {
      var s0 = 1 - amt / 100, s = s0;
      el.style.transformOrigin = "50% 50%";
      live.push(function (vh) {
        if (!el.isConnected) return false;
        var h = el.offsetHeight, top = el.getBoundingClientRect().top + h * (1 - s) / 2;
        if (top > vh) return;
        s = s0 + (1 - s0) * clamp((vh - top) / (vh / 2 + h / 2));
        el.style.transform = s >= 1 ? "" : "scale(" + s.toFixed(4) + ")";
      });
    },
    "scrub-x": function (el, amt) {
      if (!wide() || !stickyOk(el)) return;
      // The box's children line up in one row and slide together; the page must not get wider.
      d.documentElement.classList.add("owds-clip");
      el.classList.add("owds-hx");
      var kids = Array.prototype.slice.call(el.children), dist = 0;
      var st = stick(el, function () { dist = Math.max(0, el.scrollWidth - el.clientWidth); return dist * amt / 100; });
      live.push(function () {
        if (!el.isConnected) return false;
        var x = (-st.p() * dist).toFixed(1);
        kids.forEach(function (k) { k.style.transform = "translate3d(" + x + "px,0,0)"; });
      });
    },
    pin: function (el, amt) {
      if (!wide() || !stickyOk(el) || el.offsetHeight > W.innerHeight * 0.9) return;
      var kids = Array.prototype.slice.call(el.children.length === 1 ? el.children[0].children : el.children);
      if (kids.length < 2) return;
      var rest = kids.slice(1);
      var st = stick(el, function () { return W.innerHeight * amt / 100 * rest.length; });
      rest.forEach(function (k) { k.style.opacity = "0"; k.style.transform = "translateY(40px)"; });
      live.push(function () {
        if (!el.isConnected) return false;
        var p = st.p();
        rest.forEach(function (k, i) {
          var t = clamp(p * rest.length - i);
          k.style.opacity = t.toFixed(3); k.style.transform = t >= 1 ? "" : "translateY(" + ((1 - t) * 40).toFixed(1) + "px)";
        });
      });
    },
  };
  function init(scope) {
    var els = (scope || d).querySelectorAll("[data-scroll]");
    if (!els.length || reduced()) return;
    css();
    Array.prototype.forEach.call(els, function (el) {
      var name = el.getAttribute("data-scroll");
      if (el.__owds || !fx[name]) return;
      el.__owds = 1;
      fx[name](el, attr(el, "data-scroll-amount", DEF[name]), attr(el, "data-scroll-delay", 0));
    });
    queue();
  }
  W.OWDScroll = { init: init, version: "1" };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();`;
