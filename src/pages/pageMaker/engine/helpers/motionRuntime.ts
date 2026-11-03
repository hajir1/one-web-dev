/* ================================================================== */
/* OWD Motion: pengganti AOS, Animate.css, dan Vanilla Tilt (v25)        */
/*                                                                    */
/* Atribut & class TETAP sama dengan library aslinya (data-aos,         */
/* animate__*, data-tilt), jadi desain lama tidak perlu diubah. Bedanya: */
/*   - tidak ada request ke CDN (CSS ±4 KB + JS ±2 KB ditanam di HTML),  */
/*   - konten tetap terlihat bila JavaScript mati/gagal (kelas           */
/*     html.owd-motion dipasang skrip kecil di <head>),                  */
/*   - animasi mati otomatis untuk prefers-reduced-motion,               */
/*   - tilt hanya untuk mouse (bukan layar sentuh).                       */
/* Keyframes Animate.css diambil dari animate.css 4.1.1 (MIT,           */
/* Daniel Eden & Animate.css contributors).                              */
/* ================================================================== */

/** Penanda di <head>: aktifkan gaya "tersembunyi sebelum muncul" hanya bila JS jalan. */
export const MOTION_HEAD_FLAG = `<script>document.documentElement.classList.add("owd-motion")</script>`;

const AOS_FROM: Record<string, string> = {
  fade: "",
  "fade-up": "translate3d(0,100px,0)",
  "fade-down": "translate3d(0,-100px,0)",
  "fade-left": "translate3d(100px,0,0)",
  "fade-right": "translate3d(-100px,0,0)",
  "zoom-in": "scale(.6)",
  "zoom-in-up": "translate3d(0,100px,0) scale(.6)",
  "zoom-out": "scale(1.2)",
  "flip-up": "perspective(2500px) rotateX(-100deg)",
  "flip-left": "perspective(2500px) rotateY(-100deg)",
  "slide-up": "translate3d(0,100%,0)",
  "slide-left": "translate3d(100%,0,0)",
};
/** Efek tanpa opacity (sama dengan AOS: flip & slide tetap terlihat). */
const AOS_KEEP_OPACITY = new Set(["flip-up", "flip-left", "slide-up", "slide-left"]);

const aosCss = () => {
  const sel = (e: string) => `html.owd-motion [data-aos="${e}"]`;
  const rules = Object.entries(AOS_FROM).map(([e, t]) => {
    const parts = [AOS_KEEP_OPACITY.has(e) ? "" : "opacity:0", t ? `transform:${t}` : "", e.startsWith("flip") ? "backface-visibility:hidden" : ""].filter(Boolean);
    return `${sel(e)}{${parts.join(";")}}`;
  });
  return [
    `html.owd-motion [data-aos]{transition-property:opacity,transform;transition-duration:.7s;transition-timing-function:ease}`,
    ...rules,
    `html.owd-motion [data-aos].aos-animate{opacity:1;transform:none}`,
  ].join("\n");
};

const ANIMATE_KEYFRAMES = `@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeInUp{from{opacity:0;transform:translate3d(0,100%,0)}to{opacity:1;transform:translateZ(0)}}
@keyframes fadeInDown{from{opacity:0;transform:translate3d(0,-100%,0)}to{opacity:1;transform:translateZ(0)}}
@keyframes fadeInLeft{from{opacity:0;transform:translate3d(-100%,0,0)}to{opacity:1;transform:translateZ(0)}}
@keyframes fadeInRight{from{opacity:0;transform:translate3d(100%,0,0)}to{opacity:1;transform:translateZ(0)}}
@keyframes zoomIn{from{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}
@keyframes bounceIn{from,20%,40%,60%,80%,to{animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{opacity:0;transform:scale3d(.3,.3,.3)}20%{transform:scale3d(1.1,1.1,1.1)}40%{transform:scale3d(.9,.9,.9)}60%{opacity:1;transform:scale3d(1.03,1.03,1.03)}80%{transform:scale3d(.97,.97,.97)}to{opacity:1;transform:scaleX(1)}}
@keyframes backInUp{0%{transform:translateY(1200px) scale(.7);opacity:.7}80%{transform:translateY(0) scale(.7);opacity:.7}to{transform:scale(1);opacity:1}}
@keyframes lightSpeedInRight{from{transform:translate3d(100%,0,0) skewX(-30deg);opacity:0}60%{transform:skewX(20deg);opacity:1}80%{transform:skewX(-5deg)}to{transform:translateZ(0)}}
@keyframes pulse{from{transform:scaleX(1)}50%{transform:scale3d(1.05,1.05,1.05)}to{transform:scaleX(1)}}
@keyframes heartBeat{0%{transform:scale(1)}14%{transform:scale(1.3)}28%{transform:scale(1)}42%{transform:scale(1.3)}70%{transform:scale(1)}}
@keyframes tada{from{transform:scaleX(1)}10%,20%{transform:scale3d(.9,.9,.9) rotate(-3deg)}30%,50%,70%,90%{transform:scale3d(1.1,1.1,1.1) rotate(3deg)}40%,60%,80%{transform:scale3d(1.1,1.1,1.1) rotate(-3deg)}to{transform:scaleX(1)}}
@keyframes swing{20%{transform:rotate(15deg)}40%{transform:rotate(-10deg)}60%{transform:rotate(5deg)}80%{transform:rotate(-5deg)}to{transform:rotate(0)}}
@keyframes rubberBand{from{transform:scaleX(1)}30%{transform:scale3d(1.25,.75,1)}40%{transform:scale3d(.75,1.25,1)}50%{transform:scale3d(1.15,.85,1)}65%{transform:scale3d(.95,1.05,1)}75%{transform:scale3d(1.05,.95,1)}to{transform:scaleX(1)}}`;

const ANIMATE_CLASSES = `:root{--animate-duration:1s;--animate-delay:1s;--animate-repeat:1}
.animate__animated{animation-duration:var(--animate-duration);animation-fill-mode:both}
.animate__infinite{animation-iteration-count:infinite}
.animate__repeat-1{animation-iteration-count:var(--animate-repeat)}
.animate__repeat-2{animation-iteration-count:calc(var(--animate-repeat)*2)}
.animate__repeat-3{animation-iteration-count:calc(var(--animate-repeat)*3)}
${[1, 2, 3, 4, 5].map((n) => `.animate__delay-${n}s{animation-delay:calc(var(--animate-delay)*${n})}`).join("\n")}
.animate__faster{animation-duration:calc(var(--animate-duration)/2)}
.animate__fast{animation-duration:calc(var(--animate-duration)*.8)}
.animate__slow{animation-duration:calc(var(--animate-duration)*2)}
.animate__slower{animation-duration:calc(var(--animate-duration)*3)}
.animate__fadeIn{animation-name:fadeIn}.animate__fadeInUp{animation-name:fadeInUp}.animate__fadeInDown{animation-name:fadeInDown}
.animate__fadeInLeft{animation-name:fadeInLeft}.animate__fadeInRight{animation-name:fadeInRight}.animate__zoomIn{animation-name:zoomIn}
.animate__bounceIn{animation-duration:calc(var(--animate-duration)*.75);animation-name:bounceIn}
.animate__backInUp{animation-name:backInUp}
.animate__lightSpeedInRight{animation-name:lightSpeedInRight;animation-timing-function:ease-out}
.animate__pulse{animation-name:pulse;animation-timing-function:ease-in-out}
.animate__heartBeat{animation-name:heartBeat;animation-duration:calc(var(--animate-duration)*1.3);animation-timing-function:ease-in-out}
.animate__tada{animation-name:tada}
.animate__swing{transform-origin:top center;animation-name:swing}
.animate__rubberBand{animation-name:rubberBand}`;

const TILT_CSS = `[data-tilt]{transform-style:preserve-3d}
.owd-tilt-glare{position:absolute;inset:0;overflow:hidden;pointer-events:none;border-radius:inherit}
.owd-tilt-glare>i{position:absolute;left:50%;top:50%;width:200%;height:200%;transform:rotate(180deg) translate(-50%,-50%);transform-origin:0 0;background:linear-gradient(0deg,rgba(255,255,255,0) 0%,#fff 100%);opacity:0}`;

const REDUCED = `@media (prefers-reduced-motion:reduce){html.owd-motion [data-aos]{opacity:1!important;transform:none!important;transition:none!important}.animate__animated{animation:none!important}}`;

/** CSS runtime (ditanam di <head> sebagai <style>). */
/** Elemen fade-left/zoom-out dll. mulai di luar layar: jangan sampai halaman bisa digeser ke samping. */
// html "hidden" menahan propagasi ke viewport; body "clip" memotong tanpa menjadi kontainer scroll
// (position: sticky tetap jalan, scroll samping lewat sentuhan/JS tidak mungkin).
const NO_SIDE_SCROLL = "html.owd-motion{overflow-x:hidden}@supports (overflow-x:clip){html.owd-motion body{overflow-x:clip}}";

export const MOTION_CSS = [NO_SIDE_SCROLL, aosCss(), ANIMATE_KEYFRAMES, ANIMATE_CLASSES, TILT_CSS, REDUCED].join("\n");

/**
 * JS runtime (akhir <body>). `OWDMotion.init()` aman dipanggil berulang
 * (SPA / pratinjau memanggilnya setelah setiap render).
 */
export const MOTION_JS = `/* owd-motion: pengganti AOS + Vanilla Tilt, tanpa CDN */
(function () {
  var d = document, root = d.documentElement;
  root.classList.add("owd-motion");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover: hover) and (pointer: fine)").matches;
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var el = e.target, once = el.getAttribute("data-aos-once") !== "false";
      if (e.isIntersecting) { el.classList.add("aos-animate"); if (once) io.unobserve(el); }
      else if (!once && e.boundingClientRect.top > 0) el.classList.remove("aos-animate");
    });
  }, { rootMargin: "0px 0px -8% 0px" }) : null;
  function reveal(el) {
    if (el.__owdAos) return;
    el.__owdAos = 1;
    var dur = el.getAttribute("data-aos-duration"), delay = el.getAttribute("data-aos-delay");
    if (dur) el.style.transitionDuration = (+dur / 1000) + "s";
    if (delay) el.style.transitionDelay = (+delay / 1000) + "s";
    if (reduce || !io) el.classList.add("aos-animate"); else io.observe(el);
  }
  function tilt(el) {
    if (el.__owdTilt || reduce || !fine) return;
    el.__owdTilt = 1;
    var max = +(el.getAttribute("data-tilt-max") || 10), sc = +(el.getAttribute("data-tilt-scale") || 1);
    var glareMax = el.getAttribute("data-tilt-glare") === "true" ? +(el.getAttribute("data-tilt-max-glare") || 0.3) : 0;
    var glare = null, raf = 0, ev = null;
    if (glareMax) {
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      glare = d.createElement("div"); glare.className = "owd-tilt-glare"; glare.innerHTML = "<i></i>";
      el.appendChild(glare); glare = glare.firstChild;
    }
    var ease = "transform .3s cubic-bezier(.03,.98,.52,.99)";
    function frame() {
      raf = 0;
      var r = el.getBoundingClientRect(), x = (ev.clientX - r.left) / r.width, y = (ev.clientY - r.top) / r.height;
      x = Math.min(1, Math.max(0, x)); y = Math.min(1, Math.max(0, y));
      el.style.transform = "perspective(1000px) rotateX(" + (y * max - max / 2).toFixed(2) + "deg) rotateY(" + (max / 2 - x * max).toFixed(2) + "deg) scale3d(" + sc + "," + sc + "," + sc + ")";
      if (glare) {
        var ang = Math.atan2(ev.clientX - (r.left + r.width / 2), -(ev.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
        glare.style.transform = "rotate(" + ang + "deg) translate(-50%,-50%)";
        glare.style.opacity = (y * glareMax).toFixed(3);
      }
    }
    el.addEventListener("mouseenter", function () { el.style.transition = ease; el.style.willChange = "transform"; setTimeout(function () { el.style.transition = ""; }, 300); });
    el.addEventListener("mousemove", function (e) { ev = e; if (!raf) raf = requestAnimationFrame(frame); });
    el.addEventListener("mouseleave", function () {
      if (raf) cancelAnimationFrame(raf), raf = 0;
      el.style.transition = ease; el.style.transform = "perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1)"; el.style.willChange = "";
      if (glare) glare.style.opacity = "0";
    });
  }
  function init(scope) {
    var s = scope || d;
    Array.prototype.forEach.call(s.querySelectorAll("[data-aos]"), reveal);
    Array.prototype.forEach.call(s.querySelectorAll("[data-tilt]"), tilt);
  }
  window.OWDMotion = { init: init };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
})();`;
