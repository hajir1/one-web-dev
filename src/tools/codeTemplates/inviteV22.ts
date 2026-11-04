import type { InviteSpec } from "./invite";

/* ================================================================== */
/* 17 new invitations (v22). Engine, features, and edit markers are the same as */
/* other invitations (AOS, Swiper, confetti, ?to=, .ics, WhatsApp RSVP). */
/* What is new: each invitation has its own OPENING ANIMATION when the button */
/* "Buka Undangan" is pressed: the envelope opens, the curtain parts, the door */
/* berayun, gulungan tergulung, kado dibuka, kepingan puzzle lepas, dll.*/
/* The cover no longer slides up; its pieces leave instead.             */
/* All names, addresses, numbers, and bank accounts are fictional.     */
/* ================================================================== */

export const C4 = (c1: string, c2: string, c3: string, c4: string) => ({ c1, c2, c3, c4 });

/* ---------------------- kerangka animasi pembuka -------------------- */

/** Shared CSS: a transparent cover, the cover content fades out, pieces (.op) carry the cover color. */
export const OPEN_BASE = `
.cover { background: none; perspective: 1400px; }
.cover.open { transform: none; opacity: 1; }
.cover[hidden] { display: none; }
.op { position: absolute; z-index: 0; background: var(--cover-bg); will-change: transform; }
.cover-inner { transition: opacity .35s ease, transform .35s ease; }
.cover.open .cover-inner { opacity: 0; transform: translateY(-14px) scale(.98); }
@media (prefers-reduced-motion: reduce) { .cover.open { opacity: 0 !important; } .cover .op, .cover .op * { transition: none !important; animation: none !important; } }
`;

export interface Opening { html: string; css: string }

/** Envelope: the triangular flap swings open, then the envelope slides off screen. */
const AMPLOP: Opening = {
  html: `<div class="op env" aria-hidden="true"><i class="env-v"></i><i class="env-flap"></i><b class="env-seal"></b></div>`,
  css: `
.env { inset: 0; transition: transform .5s cubic-bezier(.6,0,.4,1) .32s; }
.env-v { position: absolute; inset: 0; background: linear-gradient(to top right, transparent 49.6%, color-mix(in srgb, var(--cover-ink) 14%, transparent) 50%, transparent 50.4%), linear-gradient(to top left, transparent 49.6%, color-mix(in srgb, var(--cover-ink) 14%, transparent) 50%, transparent 50.4%); background-size: 50% 100%; background-position: left, right; background-repeat: no-repeat; }
.env-flap { position: absolute; left: 0; right: 0; top: 0; height: 36%; background: color-mix(in srgb, var(--cover-bg) 88%, #000); clip-path: polygon(0 0, 100% 0, 50% 100%); transform-origin: 50% 0; transition: transform .38s cubic-bezier(.5,0,.3,1); box-shadow: 0 10px 30px rgba(0,0,0,.2); }
.env-seal { position: absolute; left: 50%; top: 36%; width: 64px; height: 64px; margin: -32px 0 0 -32px; border-radius: 50%; background: radial-gradient(circle at 35% 35%, color-mix(in srgb, var(--accent) 70%, #fff), var(--accent)); box-shadow: 0 4px 12px rgba(0,0,0,.3); transition: transform .25s, opacity .25s; }
.cover.open .env-flap { transform: rotateX(180deg); }
.cover.open .env-seal { transform: scale(.4); opacity: 0; }
.cover.open .env { transform: translateY(105%); }
.cover-inner { padding-top: 26vh; }
`,
};

/** Stage curtains: two wavy curtains part to the sides, the valance rises. */
const TIRAI: Opening = {
  html: `<div class="op cur cur-l" aria-hidden="true"></div><div class="op cur cur-r" aria-hidden="true"></div><div class="op val" aria-hidden="true"></div>`,
  css: `
.cur { top: 0; bottom: 0; width: 50.5%; background: repeating-linear-gradient(90deg, color-mix(in srgb, var(--cover-bg) 80%, #000) 0 14px, var(--cover-bg) 14px 40px, color-mix(in srgb, var(--cover-bg) 88%, #fff) 40px 52px, var(--cover-bg) 52px 70px); transition: transform .8s cubic-bezier(.65,0,.25,1); }
.cur-l { left: 0; transform-origin: 0 0; }
.cur-r { right: 0; transform-origin: 100% 0; }
.val { left: 0; right: 0; top: 0; height: 64px; background: radial-gradient(circle at 30px 0, var(--accent) 28px, transparent 29px) 0 0 / 60px 64px repeat-x, var(--accent); height: 34px; box-shadow: 0 30px 0 -2px transparent; transition: transform .6s ease .15s; }
.val::after { content: ""; position: absolute; left: 0; right: 0; top: 34px; height: 26px; background: radial-gradient(circle at 30px 0, var(--accent) 24px, transparent 25px) 0 0 / 60px 26px repeat-x; }
.cover.open .cur-l { transform: translateX(-92%) scaleX(.55); }
.cover.open .cur-r { transform: translateX(92%) scaleX(.55); }
.cover.open .val { transform: translateY(-120%); }
`,
};

/** Carved wooden door: two door leaves swing inward. */
const PINTU: Opening = {
  html: `<div class="op door door-l" aria-hidden="true"><i></i><i></i></div><div class="op door door-r" aria-hidden="true"><i></i><i></i></div>`,
  css: `
.door { top: 0; bottom: 0; width: 50%; display: grid; grid-template-rows: 1.4fr 1fr; gap: 4vh; padding: 6vh 4vw; background: linear-gradient(90deg, color-mix(in srgb, var(--cover-bg) 92%, #000), var(--cover-bg) 30%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 70%, color-mix(in srgb, var(--cover-bg) 90%, #000)); transition: transform .85s cubic-bezier(.55,0,.25,1); backface-visibility: hidden; }
.door i { border: 2px solid color-mix(in srgb, var(--accent) 70%, transparent); border-radius: 10px; background: repeating-linear-gradient(45deg, transparent 0 10px, color-mix(in srgb, var(--accent) 12%, transparent) 10px 12px), repeating-linear-gradient(-45deg, transparent 0 10px, color-mix(in srgb, var(--accent) 12%, transparent) 10px 12px); box-shadow: inset 0 0 0 8px color-mix(in srgb, var(--cover-bg) 80%, #000), inset 0 0 0 10px color-mix(in srgb, var(--accent) 50%, transparent); }
.door-l { left: 0; transform-origin: 0 50%; }
.door-r { right: 0; transform-origin: 100% 50%; }
.door-l::after, .door-r::after { content: ""; position: absolute; top: 52%; width: 14px; height: 54px; border-radius: 8px; background: var(--accent); }
.door-l::after { right: 18px; } .door-r::after { left: 18px; }
.cover.open .door-l { transform: rotateY(-105deg); }
.cover.open .door-r { transform: rotateY(105deg); }
`,
};

/** Waves: the cover rises carrying a wave edge, bubbles rise. */
const OMBAK: Opening = {
  html: `<div class="op sea" aria-hidden="true"><svg viewBox="0 0 1200 80" preserveAspectRatio="none"><path d="M0 0H1200V40C1100 80 1000 0 900 40S700 80 600 40 400 0 300 40 100 80 0 40Z"/></svg></div>`,
  css: `
.sea { inset: 0; transition: transform .85s cubic-bezier(.6,0,.3,1); background: linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 70%, #fff), var(--cover-bg)); }
.sea svg { position: absolute; left: 0; top: 100%; width: 200%; height: 80px; fill: var(--cover-bg); animation: surf 6s linear infinite; }
@keyframes surf { to { transform: translateX(-50%); } }
.cover.open .sea { transform: translateY(calc(-100% - 90px)); }
`,
};

/** Petals: the cover splits into 8 petals that spin away from the center. */
const KELOPAK: Opening = (() => {
  const pts = ["50% -50%", "150% -50%", "150% 50%", "150% 150%", "50% 150%", "-50% 150%", "-50% 50%", "-50% -50%"];
  const html = pts.map((_, i) => `<div class="op pet p${i}" aria-hidden="true"></div>`).join("");
  const css = pts
    .map((p, i) => {
      const q = pts[(i + 1) % 8];
      const a = (i * 45 + 22.5 - 90) * (Math.PI / 180);
      return `.p${i} { clip-path: polygon(50% 50%, ${p}, ${q}); } .cover.open .p${i} { transform: translate(${Math.round(Math.cos(a) * 70)}%, ${Math.round(Math.sin(a) * 70)}%) rotate(${i % 2 ? 24 : -24}deg); }`;
    })
    .join("\n");
  return {
    html,
    css: `
.pet { inset: 0; transition: transform .85s cubic-bezier(.6,0,.25,1); background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--cover-bg) 85%, #fff), var(--cover-bg) 70%); }
${css}
`,
  };
})();

/** Diagonal: the cover splits diagonally, two triangles slide in opposite directions. */
const DIAGONAL: Opening = {
  html: `<div class="op dg dg-a" aria-hidden="true"></div><div class="op dg dg-b" aria-hidden="true"></div>`,
  css: `
.dg { inset: 0; transition: transform .8s cubic-bezier(.7,0,.25,1); }
.dg-a { clip-path: polygon(0 0, 100% 0, 0 100%); background: linear-gradient(135deg, color-mix(in srgb, var(--cover-bg) 90%, #fff), var(--cover-bg)); }
.dg-b { clip-path: polygon(100% 0, 100% 100%, 0 100%); background: linear-gradient(135deg, var(--cover-bg), color-mix(in srgb, var(--cover-bg) 90%, #000)); }
.dg-b::before { content: ""; position: absolute; inset: 0; background: linear-gradient(to top left, transparent calc(50% - 1px), var(--accent) 50%, transparent calc(50% + 1px)); }
.cover.open .dg-a { transform: translate(-70%, -70%); }
.cover.open .dg-b { transform: translate(70%, 70%); }
`,
};

/** Film roll: a sprocket-holed cover slides left like film being pulled. */
const FILM: Opening = {
  html: `<div class="op film" aria-hidden="true"><i class="sp t"></i><i class="sp b"></i></div>`,
  css: `
.film { inset: 0; width: 100%; transition: transform .8s cubic-bezier(.7,0,.2,1), filter .8s; }
.sp { position: absolute; left: 0; right: 0; height: 34px; background: radial-gradient(circle, transparent 0, transparent 0) , repeating-linear-gradient(90deg, transparent 0 14px, color-mix(in srgb, var(--cover-ink) 75%, transparent) 14px 30px, transparent 30px 44px); -webkit-mask: linear-gradient(#000 0 0) center / 100% 16px no-repeat; mask: linear-gradient(#000 0 0) center / 100% 16px no-repeat; }
.sp.t { top: 10px; } .sp.b { bottom: 10px; }
.cover.open .film { transform: translateX(-108%); filter: blur(2px); }
`,
};

/** Scroll: the sheet rolls up, the scroll rods rise along with it. */
const GULUNG: Opening = {
  html: `<div class="op scroll" aria-hidden="true"></div><div class="op rod" aria-hidden="true"></div>`,
  css: `
.scroll { inset: 0; transform-origin: 50% 0; transition: transform .8s cubic-bezier(.6,0,.3,1); background: linear-gradient(180deg, var(--cover-bg), color-mix(in srgb, var(--cover-bg) 88%, #000)); }
.rod { left: -2%; right: -2%; bottom: 0; height: 30px; border-radius: 15px; background: linear-gradient(180deg, color-mix(in srgb, var(--accent) 70%, #fff), var(--accent) 45%, color-mix(in srgb, var(--accent) 70%, #000)); box-shadow: 0 6px 16px rgba(0,0,0,.35); transition: transform .8s cubic-bezier(.6,0,.3,1); }
.cover.open .scroll { transform: scaleY(0); }
.cover.open .rod { transform: translateY(-100vh); }
`,
};

/** Bubble: a round hole grows from the center, bubbles fly off. */
const GELEMBUNG: Opening = {
  html: `<div class="op hole" aria-hidden="true"></div><div class="bub" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>`,
  css: `
.hole { left: 50%; top: 58%; width: 0; height: 0; border-radius: 50%; background: transparent; box-shadow: 0 0 0 200vmax var(--cover-bg); transform: translate(-50%, -50%); transition: width .8s cubic-bezier(.6,0,.3,1), height .8s cubic-bezier(.6,0,.3,1); }
.cover.open .hole { width: 300vmax; height: 300vmax; }
.bub { position: absolute; inset: 0; pointer-events: none; }
.bub i { position: absolute; bottom: -60px; width: var(--s, 40px); height: var(--s, 40px); border-radius: 50%; background: radial-gradient(circle at 30% 30%, rgba(255,255,255,.9), rgba(255,255,255,.15) 40%, color-mix(in srgb, var(--c1) 40%, transparent) 75%, rgba(255,255,255,.5)); animation: bub 9s linear infinite; }
.bub i:nth-child(1) { left: 8%; --s: 46px; animation-delay: -1s; } .bub i:nth-child(2) { left: 24%; --s: 26px; animation-delay: -4s; } .bub i:nth-child(3) { left: 46%; --s: 34px; animation-delay: -7s; }
.bub i:nth-child(4) { left: 66%; --s: 54px; animation-delay: -2.5s; } .bub i:nth-child(5) { left: 82%; --s: 30px; animation-delay: -5.5s; } .bub i:nth-child(6) { left: 92%; --s: 22px; animation-delay: -8s; }
@keyframes bub { to { transform: translate(30px, -125vh); } }
.cover.open .bub { opacity: 0; transition: opacity .3s; }
@media (prefers-reduced-motion: reduce) { .bub i { animation: none; } }
`,
};

/** Gift: the ribbon comes off, the box lid flies up, the box body drops. */
const KADO: Opening = {
  html: `<div class="op box" aria-hidden="true"></div><div class="op lid" aria-hidden="true"><b class="bow"></b></div><div class="op rib rib-v" aria-hidden="true"></div><div class="op rib rib-h" aria-hidden="true"></div>`,
  css: `
.box { left: 0; right: 0; bottom: 0; top: 26%; transition: transform .55s cubic-bezier(.6,0,.4,1) .3s; background: repeating-linear-gradient(45deg, var(--cover-bg) 0 26px, color-mix(in srgb, var(--cover-bg) 90%, #fff) 26px 52px); }
.lid { left: -3%; right: -3%; top: 0; height: 27%; background: color-mix(in srgb, var(--cover-bg) 88%, #000); box-shadow: 0 10px 22px rgba(0,0,0,.25); transition: transform .5s cubic-bezier(.4,0,.6,1) .12s; z-index: 1; }
.bow { position: absolute; left: 50%; bottom: -10px; width: 120px; height: 60px; margin-left: -60px; background: radial-gradient(ellipse at 25% 50%, var(--accent) 45%, transparent 47%), radial-gradient(ellipse at 75% 50%, var(--accent) 45%, transparent 47%); }
.rib { background: var(--accent); transition: transform .3s ease; z-index: 1; }
.rib-v { top: 0; bottom: 0; left: 50%; width: 46px; margin-left: -23px; transform-origin: 50% 27%; }
.rib-h { left: 0; right: 0; top: 27%; height: 30px; margin-top: -15px; }
.cover.open .rib-v { transform: scaleY(0); } .cover.open .rib-h { transform: scaleX(0); }
.cover.open .lid { transform: translateY(-130%) rotate(-10deg); }
.cover.open .box { transform: translateY(110%); }
`,
};

/** Circus tent: two striped tent flaps lift to the top corners. */
const TENDA: Opening = {
  html: `<div class="op tent tent-l" aria-hidden="true"></div><div class="op tent tent-r" aria-hidden="true"></div><div class="op flag" aria-hidden="true"></div>`,
  css: `
.tent { top: 0; bottom: 0; width: 51%; background: repeating-linear-gradient(90deg, var(--cover-bg) 0 44px, var(--c1) 44px 88px); transition: transform .8s cubic-bezier(.6,0,.3,1); }
.tent-l { left: 0; transform-origin: 0 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
.tent-r { right: 0; transform-origin: 100% 0; }
.flag { left: 50%; top: 0; width: 8px; height: 60px; margin-left: -4px; background: var(--accent); transition: transform .4s; }
.flag::after { content: ""; position: absolute; left: 8px; top: 0; border-left: 40px solid var(--accent); border-top: 14px solid transparent; border-bottom: 14px solid transparent; }
.cover.open .tent-l { transform: rotate(-58deg) scaleX(.7); }
.cover.open .tent-r { transform: rotate(58deg) scaleX(.7); }
.cover.open .flag { transform: translateY(-120%); }
.cover-inner { background: color-mix(in srgb, var(--cover-bg) 88%, transparent); padding: 28px 22px; border-radius: 24px; }
`,
};

/** Puzzle: the cover splits into 24 pieces that fall away one by one. */
const PUZZLE: Opening = (() => {
  const cols = 4, rows = 6;
  const tiles: string[] = [];
  const css: string[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c;
      tiles.push(`<i class="pz" style="--d:${(((i * 7) % 24) * 0.022).toFixed(3)}s;--x:${((c - 1.5) * 30).toFixed(0)}px;--r:${(((i * 37) % 60) - 30).toString()}deg"></i>`);
    }
  css.push(`.puzzle { inset: 0; display: grid; grid-template-columns: repeat(${cols}, 1fr); grid-template-rows: repeat(${rows}, 1fr); background: none; }`);
  return {
    html: `<div class="op puzzle" aria-hidden="true">${tiles.join("")}</div>`,
    css: `
${css.join("\n")}
.pz { background: var(--cover-bg); outline: 1px solid color-mix(in srgb, var(--cover-ink) 10%, transparent); transition: transform .45s cubic-bezier(.5,0,.75,0) var(--d), opacity .45s ease var(--d); }
.pz:nth-child(odd) { background: color-mix(in srgb, var(--cover-bg) 94%, #fff); }
.cover.open .pz { transform: translate(var(--x), 110vh) rotate(var(--r)) scale(.8); opacity: 0; }
`,
  };
})();

/** Map: three map folds close to the sides in turn like a folded map. */
const PETA: Opening = {
  html: `<div class="op map" aria-hidden="true"><i></i><i></i><i></i></div>`,
  css: `
.map { inset: 0; display: grid; grid-template-columns: repeat(3, 1fr); background: none; perspective: 1200px; }
.map i { background: linear-gradient(90deg, rgba(0,0,0,.08), transparent 20%, transparent 80%, rgba(0,0,0,.12)), radial-gradient(circle at 30% 40%, color-mix(in srgb, var(--c3) 40%, transparent) 0 60px, transparent 61px), radial-gradient(circle at 70% 70%, color-mix(in srgb, var(--c1) 30%, transparent) 0 90px, transparent 91px), var(--cover-bg); transition: transform .5s cubic-bezier(.6,0,.4,1), opacity .5s; }
.map i:nth-child(1) { transform-origin: 0 50%; transition-delay: .3s; }
.map i:nth-child(2) { transform-origin: 0 50%; transition-delay: .15s; }
.map i:nth-child(3) { transform-origin: 100% 50%; }
.cover.open .map i:nth-child(1) { transform: rotateY(-95deg); opacity: .6; }
.cover.open .map i:nth-child(2) { transform: rotateY(95deg) translateX(-30%); opacity: 0; }
.cover.open .map i:nth-child(3) { transform: rotateY(-95deg); opacity: 0; }
`,
};

/** Book: the book cover swings open from the left spine. */
const BUKU: Opening = {
  html: `<div class="op book" aria-hidden="true"><i class="spine"></i><i class="frame"></i></div>`,
  css: `
.book { inset: 0; transform-origin: 0 50%; transition: transform .9s cubic-bezier(.6,0,.3,1); background: linear-gradient(90deg, color-mix(in srgb, var(--cover-bg) 80%, #000) 0 3%, var(--cover-bg) 6%); backface-visibility: hidden; }
.frame { position: absolute; inset: 4vh 4vw 4vh 7vw; border: 2px solid color-mix(in srgb, var(--accent) 70%, transparent); border-radius: 6px; box-shadow: inset 0 0 0 6px var(--cover-bg), inset 0 0 0 7px color-mix(in srgb, var(--accent) 50%, transparent); }
.spine { position: absolute; left: 0; top: 0; bottom: 0; width: 3%; background: repeating-linear-gradient(180deg, transparent 0 40px, color-mix(in srgb, var(--accent) 60%, transparent) 40px 42px); }
.cover.open .book { transform: rotateY(-120deg); }
`,
};

/** Window louvers: horizontal slats rotate open in turn from the top. */
const KREPYAK: Opening = (() => {
  const n = 10;
  return {
    html: `<div class="op blinds" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i style="--d:${(i * 0.045).toFixed(3)}s"></i>`).join("")}</div>`,
    css: `
.blinds { inset: 0; display: grid; grid-template-rows: repeat(${n}, 1fr); background: none; perspective: 900px; }
.blinds i { background: linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 90%, #fff), var(--cover-bg) 60%, color-mix(in srgb, var(--cover-bg) 86%, #000)); border-bottom: 1px solid color-mix(in srgb, var(--cover-ink) 12%, transparent); transition: transform .4s cubic-bezier(.5,0,.3,1) var(--d), opacity .25s ease calc(var(--d) + .2s); }
.cover.open .blinds i { transform: rotateX(88deg); opacity: 0; }
`,
  };
})();

/** Clouds: clumps of clouds move aside to the left and right. */
const AWAN: Opening = {
  html: `<div class="op sky" aria-hidden="true"></div><div class="clouds" aria-hidden="true"><i class="cl a"></i><i class="cl b"></i><i class="cl c"></i><i class="cl d"></i><i class="cl e"></i><i class="cl f"></i></div>`,
  css: `
.sky { inset: 0; transition: opacity .6s ease .2s; }
.clouds { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.cl { position: absolute; width: 70vmax; height: 34vmax; border-radius: 50%; background: radial-gradient(closest-side, #fff 70%, rgba(255,255,255,0)); filter: drop-shadow(0 10px 20px rgba(0,0,0,.06)); transition: transform .85s cubic-bezier(.6,0,.3,1); }
.cl::before, .cl::after { content: ""; position: absolute; border-radius: 50%; background: radial-gradient(closest-side, #fff 70%, rgba(255,255,255,0)); }
.cl::before { width: 55%; height: 90%; left: 12%; top: -38%; } .cl::after { width: 45%; height: 80%; right: 10%; top: -26%; }
.cl.a { left: -34vmax; top: -8vmax; } .cl.b { right: -36vmax; top: 6vh; } .cl.c { left: -30vmax; top: 40vh; }
.cl.d { right: -30vmax; top: 52vh; } .cl.e { left: -20vmax; bottom: -16vmax; } .cl.f { right: -24vmax; bottom: -12vmax; }
.cover.open .sky { opacity: 0; }
.cover.open .cl.a, .cover.open .cl.c, .cover.open .cl.e { transform: translateX(-80vmax); }
.cover.open .cl.b, .cover.open .cl.d, .cover.open .cl.f { transform: translateX(80vmax); }
`,
};

/** Lentera: lentera-lentera naik, langit malam memudar. */
const LENTERA: Opening = {
  html: `<div class="op night" aria-hidden="true"></div><div class="lan" aria-hidden="true">${Array.from({ length: 7 }, (_, i) => `<i style="--x:${[8, 22, 36, 52, 66, 80, 92][i]}%;--y:${[62, 74, 58, 80, 66, 76, 60][i]}%;--s:${[0.8, 1.1, 0.9, 1.3, 1, 0.85, 1.15][i]};--d:${(i * 0.05).toFixed(2)}s"></i>`).join("")}</div>`,
  css: `
.night { inset: 0; background: radial-gradient(120% 80% at 50% 0%, color-mix(in srgb, var(--cover-bg) 70%, #fff), var(--cover-bg) 60%); transition: opacity .55s ease .3s; }
.lan { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.lan i { position: absolute; left: var(--x); top: var(--y); width: calc(34px * var(--s)); height: calc(48px * var(--s)); border-radius: 40% 40% 30% 30%; background: radial-gradient(circle at 50% 65%, #fff4c9, var(--c2) 55%, color-mix(in srgb, var(--c2) 70%, #000)); box-shadow: 0 0 30px 6px color-mix(in srgb, var(--c2) 45%, transparent); animation: sway 4s ease-in-out infinite alternate; transition: transform .9s cubic-bezier(.5,0,.6,1) var(--d), opacity .9s ease var(--d); }
.lan i::before { content: ""; position: absolute; left: 30%; right: 30%; top: -6px; height: 6px; border-radius: 3px 3px 0 0; background: color-mix(in srgb, var(--c2) 60%, #000); }
@keyframes sway { from { rotate: -4deg; } to { rotate: 4deg; } }
.cover.open .night { opacity: 0; }
.cover.open .lan i { transform: translateY(-120vh) scale(.7); opacity: 0; }
@media (prefers-reduced-motion: reduce) { .lan i { animation: none; } }
`,
};

/* ------------------------------ ornamen ---------------------------- */

export const SPRIG = `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M10 110C40 80 70 50 110 10"/><path d="M36 84c-14-2-22-10-24-24 12 2 22 10 24 24ZM60 60c-14-2-22-10-24-24 12 2 22 10 24 24ZM84 36c-12-2-20-8-22-20 12 2 20 8 22 20Z" fill="currentColor" fill-opacity=".2"/><path d="M36 84c2-14 10-22 24-24-2 12-10 22-24 24ZM60 60c2-14 10-22 24-24-2 12-10 22-24 24Z" fill="currentColor" fill-opacity=".12"/></g></svg>`;

/** Small cover ornaments (above the pieces, below the text). */
export const deco = (cls: string, svg: string) => `<div class="deco ${cls}" aria-hidden="true">${svg}</div>`;
export const DECO_CSS = `
.deco { position: absolute; z-index: 0; pointer-events: none; color: var(--accent); transition: opacity .3s; }
.deco svg { width: 100%; height: auto; display: block; }
.cover.open .deco { opacity: 0; }
`;

/* --------------------------- data bersama -------------------------- */

export type Cfg = Record<string, unknown>;
export interface Base {
  id: string;
  judul: string;
  namaSampul: string;
  tamuBawaan: string;
  salam: string;
  judulProfil: string;
  pembuka: string;
  tokoh: { panggilan: string; nama: string; keterangan: string }[];
  kutipan: { teks: string; sumber: string };
  acara: { nama: string; mulai: string; selesai: string; tempat: string; alamat: string }[];
  zona?: [string, string];
  galeri: string[];
  ucapan: [string, string][];
  amplop: { judul: string; pengantar: string; rekening: { bank: string; nomor: string; atasNama: string }[]; alamatKado: string };
  wa: string;
  namaAcara: string;
  pilihan?: string[];
  templat?: string;
  pengantarRsvp?: string;
  penutup: string;
  salamPenutup: string;
  keluarga: string;
  nada: number[];
  tempo: number;
  konfeti: string[];
  teks?: Partial<Record<"judulHitungMundur" | "teksSelesai" | "judulAcara" | "pengantarAcara" | "judulGaleri" | "pengantarGaleri" | "judulUcapan" | "pengantarUcapan", string>>;
}

export function cfg(b: Base): Cfg {
  const t = b.teks ?? {};
  return {
    id: b.id,
    judul: b.judul,
    namaSampul: b.namaSampul,
    tamuBawaan: b.tamuBawaan,
    salam: b.salam,
    judulProfil: b.judulProfil,
    pembuka: b.pembuka,
    tokoh: b.tokoh,
    kutipan: b.kutipan,
    judulHitungMundur: t.judulHitungMundur ?? "Menuju Hari Bahagia",
    teksSelesai: t.teksSelesai ?? "Acara telah berlangsung. Terima kasih atas doa dan kehadirannya.",
    judulAcara: t.judulAcara ?? "Waktu dan Tempat",
    pengantarAcara: t.pengantarAcara ?? "Acara akan diselenggarakan pada:",
    zonaWaktu: b.zona?.[0] ?? "Asia/Jakarta",
    labelZona: b.zona?.[1] ?? "WIB",
    acara: b.acara,
    judulGaleri: t.judulGaleri ?? "Galeri",
    pengantarGaleri: t.pengantarGaleri ?? "Sepenggal cerita sebelum hari ini.",
    galeri: b.galeri.map((judul) => ({ judul })),
    judulUcapan: t.judulUcapan ?? "Ucapan dan Doa",
    pengantarUcapan: t.pengantarUcapan ?? "Tuliskan ucapan dan doa terbaik Anda.",
    ucapanContoh: b.ucapan.map(([nama, teks]) => ({ nama, teks })),
    amplop: b.amplop,
    rsvp: {
      whatsapp: b.wa,
      namaAcara: b.namaAcara,
      pengantar: b.pengantarRsvp ?? "Mohon konfirmasi kehadiran Anda agar kami dapat menyiapkan jamuan dengan baik.",
      pilihan: b.pilihan ?? ["Insyaallah hadir", "Belum dapat memastikan", "Mohon maaf, tidak dapat hadir"],
      templatPesan: b.templat ?? "Halo, saya {nama} ingin mengonfirmasi kehadiran di acara {acara}: {hadir}, jumlah tamu {jumlah} orang. Terima kasih.",
    },
    penutup: b.penutup,
    salamPenutup: b.salamPenutup,
    keluarga: b.keluarga,
    musik: { url: "", putarSaatBuka: true, tempoMs: b.tempo, nada: b.nada },
    konfeti: { particleCount: 90, spread: 85, colors: b.konfeti },
  };
}

export const ISLAM = { salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh", tutup: "Wassalamu'alaikum Warahmatullahi Wabarakatuh" };
export const NADA_A = [261.63, 329.63, 392, 523.25, 493.88, 392, 440, 349.23];
export const NADA_B = [392, 440, 493.88, 587.33, 523.25, 493.88, 440, 392];
export const NADA_C = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46, 659.25, 523.25];
export const NADA_D = [293.66, 349.23, 440, 392, 349.23, 329.63, 293.66, 261.63];

export const RSVP_NIKAH = "Assalamu'alaikum. Saya {nama} ingin mengonfirmasi kehadiran di acara {acara}: {hadir}, jumlah tamu {jumlah} orang. Terima kasih.";

/* ------------------------------ 17 invitations ------------------------- */

export const INVITE_SPECS_V22: InviteSpec[] = [
  {
    id: "undangan-nikah-amplop-surat",
    kind: "nikah",
    title: "Undangan Pernikahan Aldi & Nisa",
    description: "Undangan pernikahan bernuansa merah muda pudar dengan animasi pembuka amplop: segel lepas, tutup amplop terbuka, lalu amplop turun memperlihatkan undangan.",
    theme: "#8c4a5a",
    fonts: { display: "Cormorant Garamond", script: "Pinyon Script", text: "Jost", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Pinyon+Script&family=Jost:wght@400;600&display=swap" },
    colors: { bg: "#fdf8f6", surface: "#f8ece9", ink: "#3b2a2e", inkSoft: "#6e585d", primary: "#8c4a5a", onPrimary: "#fff8f6", accent: "#c4874f", line: "#efdcd8", coverBg: "#e9c9c6", coverInk: "#4a2a33", ...C4("#d99aa5", "#c4874f", "#f1d3cf", "#b7d0c0") },
    ornament: AMPLOP.html + deco("sprig", SPRIG),
    css: OPEN_BASE + AMPLOP.css + DECO_CSS + `
.sprig { left: 50%; top: 4vh; width: 110px; margin-left: -55px; color: var(--primary); }
.cover h1 { color: var(--primary); }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.guest { background: rgba(255,255,255,.45); border-color: rgba(140,74,90,.25); }
.title { font-weight: 500; }
`,
    config: cfg({
      id: "nikah-aldi-nisa", judul: "Undangan Pernikahan", namaSampul: "Aldi & Nisa", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Dua Nama, Satu Surat",
      pembuka: "Dengan memohon rahmat Allah SWT, kami mengundang Anda untuk hadir di hari pernikahan kami:",
      tokoh: [
        { panggilan: "Aldi", nama: "Rinaldi Saputra, S.Kom.", keterangan: "Putra kedua Bapak Hasyim Saputra dan Ibu Wartini" },
        { panggilan: "Nisa", nama: "Khairunnisa Putri, S.E.", keterangan: "Putri sulung Bapak Ahmad Fauzi dan Ibu Nur Aini" },
      ],
      kutipan: { teks: "Dan Kami ciptakan kamu berpasang-pasangan.", sumber: "QS. An-Naba: 8" },
      acara: [
        { nama: "Akad Nikah", mulai: "2027-06-12T08:00:00+07:00", selesai: "2027-06-12T09:30:00+07:00", tempat: "Masjid Raya Al-Falah", alamat: "Jl. Diponegoro No. 40, Bandung" },
        { nama: "Resepsi", mulai: "2027-06-12T11:00:00+07:00", selesai: "2027-06-12T14:00:00+07:00", tempat: "Gedung Sabuga", alamat: "Jl. Tamansari No. 73, Bandung" },
      ],
      galeri: ["Surat pertama, 2018", "Kencan di Braga", "Lamaran, 2026", "Foto pranikah", "Bersama keluarga"],
      ucapan: [["Keluarga Om Dedi", "Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah."], ["Teman kampus Nisa", "Akhirnya! Bahagia selalu kalian berdua."]],
      amplop: { judul: "Amplop Digital", pengantar: "Doa restu Anda adalah hadiah terbaik. Bila ingin memberi tanda kasih, dapat melalui:", rekening: [{ bank: "Bank BCA", nomor: "1122 3344 55", atasNama: "Rinaldi Saputra" }, { bank: "Bank BSI", nomor: "7000 1122 33", atasNama: "Khairunnisa Putri" }], alamatKado: "Jl. Cigadung Raya No. 8, Bandung 40191" },
      wa: "6281200000101", namaAcara: "pernikahan Aldi & Nisa", templat: RSVP_NIKAH,
      penutup: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Besar Bapak Hasyim Saputra dan Bapak Ahmad Fauzi",
      nada: NADA_A, tempo: 560, konfeti: ["#d99aa5", "#c4874f", "#fff8f6"],
    }),
  },
  {
    id: "undangan-nikah-tirai-panggung",
    kind: "nikah",
    title: "Undangan Pernikahan Galang & Citra",
    description: "Undangan pernikahan bergaya panggung klasik merah marun dan emas: saat dibuka, tirai beludru tersibak ke samping dan lambrekin naik seperti pertunjukan dimulai.",
    theme: "#5a1420",
    fonts: { display: "Playfair Display", script: "Italianno", text: "Lato", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=Italianno&family=Lato:wght@400;700&display=swap" },
    colors: { bg: "#fbf6ef", surface: "#f4e9da", ink: "#2c1a1c", inkSoft: "#65494b", primary: "#7a1c2b", onPrimary: "#fff6e6", accent: "#c99a3e", line: "#ead8bf", coverBg: "#6e1424", coverInk: "#fbe9c4", ...C4("#a8243a", "#c99a3e", "#f1dfb8", "#3d0b14") },
    ornament: TIRAI.html,
    css: OPEN_BASE + TIRAI.css + `
.cover-inner { padding: 30px 24px; border-radius: 22px; background: color-mix(in srgb, var(--cover-bg) 70%, transparent); box-shadow: 0 0 80px 30px color-mix(in srgb, var(--accent) 22%, transparent); }
.cover h1 { color: var(--accent); }
.title { color: var(--primary); }
.account { background: linear-gradient(135deg, var(--primary), #3d0b14); }
`,
    config: cfg({
      id: "nikah-galang-citra", judul: "The Wedding of", namaSampul: "Galang & Citra", tamuBawaan: "Tamu Undangan", salam: "Salam sejahtera untuk kita semua.", judulProfil: "Pemeran Utama",
      pembuka: "Setelah bertahun-tahun latihan, kami siap naik ke panggung paling penting dalam hidup kami:",
      tokoh: [
        { panggilan: "Galang", nama: "Galang Prasetyo Nugroho", keterangan: "Putra Bapak Joko Nugroho dan Ibu Retno Wulandari" },
        { panggilan: "Citra", nama: "Citra Maharani", keterangan: "Putri Bapak Sutrisno dan Ibu Endang Lestari" },
      ],
      kutipan: { teks: "Seluruh dunia adalah panggung, dan aku ingin memerankan setiap babaknya bersamamu.", sumber: "Galang untuk Citra" },
      acara: [
        { nama: "Pemberkatan", mulai: "2027-04-24T10:00:00+07:00", selesai: "2027-04-24T11:30:00+07:00", tempat: "Gereja Santo Yosef", alamat: "Jl. Pemuda No. 61, Semarang" },
        { nama: "Resepsi", mulai: "2027-04-24T18:30:00+07:00", selesai: "2027-04-24T21:00:00+07:00", tempat: "Gedung Kesenian Sobokartti", alamat: "Jl. Dr. Cipto No. 31, Semarang" },
      ],
      teks: { judulAcara: "Jadwal Pertunjukan", pengantarAcara: "Pertunjukan dimulai tepat waktu:" },
      galeri: ["Babak pertama: kenalan", "Babak kedua: jarak jauh", "Babak ketiga: lamaran", "Gladi resik"],
      ucapan: [["Tante Maria", "Selamat Galang dan Citra! Tuhan memberkati rumah tangga kalian."], ["Teater Kampus", "Standing ovation untuk kalian berdua!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Kehadiran Anda adalah tepuk tangan termeriah. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank Mandiri", nomor: "1360 0011 2233", atasNama: "Galang Prasetyo" }], alamatKado: "" },
      wa: "6281200000102", namaAcara: "pernikahan Galang & Citra", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      penutup: "Tirai sudah dibuka. Kami menunggu Anda di barisan depan.", salamPenutup: "", keluarga: "Galang & Citra beserta keluarga",
      nada: NADA_D, tempo: 600, konfeti: ["#c99a3e", "#a8243a", "#fbe9c4"],
    }),
  },
  {
    id: "undangan-nikah-pintu-gebyok",
    kind: "nikah",
    title: "Undangan Pernikahan Bagas & Ayu",
    description: "Undangan pernikahan adat bernuansa kayu jati dan emas: saat dibuka, dua daun pintu gebyok berukir berayun ke dalam menyambut tamu.",
    theme: "#4a2c17",
    fonts: { display: "Cinzel", script: "Great Vibes", text: "Crimson Pro", href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Great+Vibes&family=Crimson+Pro:wght@400;600&display=swap" },
    colors: { bg: "#fbf5ea", surface: "#f2e5cf", ink: "#3a2414", inkSoft: "#6c523d", primary: "#6b3d1e", onPrimary: "#fff6e6", accent: "#d1a54a", line: "#e6d3b2", coverBg: "#5a3519", coverInk: "#f7e6c4", ...C4("#d1a54a", "#6b3d1e", "#ead29a", "#9c5b2e") },
    ornament: PINTU.html,
    css: OPEN_BASE + PINTU.css + `
.cover-inner { padding: 26px 22px; border-radius: 18px; background: color-mix(in srgb, var(--cover-bg) 84%, transparent); border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent); }
.cover h1 { color: var(--accent); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 12px 12px 999px 999px; }
`,
    config: cfg({
      id: "nikah-bagas-ayu", judul: "Pawiwahan", namaSampul: "Bagas & Ayu", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Mempelai",
      pembuka: "Pintu rumah kami terbuka untuk menyambut Bapak/Ibu/Saudara/i di hari bahagia putra-putri kami:",
      tokoh: [
        { panggilan: "Bagas", nama: "Bagas Wicaksono, S.H.", keterangan: "Putra Bapak R. Suryo Wicaksono dan Ibu Sri Rahayu" },
        { panggilan: "Ayu", nama: "Dyah Ayu Pramesti, S.Ars.", keterangan: "Putri Bapak Heru Pramono dan Ibu Wulan Sari" },
      ],
      kutipan: { teks: "Witing tresna jalaran saka kulina. Cinta tumbuh karena terbiasa bersama.", sumber: "Pepatah Jawa" },
      acara: [
        { nama: "Ijab Kabul", mulai: "2027-08-07T08:00:00+07:00", selesai: "2027-08-07T09:30:00+07:00", tempat: "Ndalem Wicaksonan", alamat: "Jl. Kemasan No. 17, Kotagede, Yogyakarta" },
        { nama: "Panggih & Resepsi", mulai: "2027-08-07T11:00:00+07:00", selesai: "2027-08-07T14:00:00+07:00", tempat: "Pendopo Ndalem Wicaksonan", alamat: "Jl. Kemasan No. 17, Kotagede, Yogyakarta" },
      ],
      galeri: ["Siraman", "Midodareni", "Peningsetan", "Bersama eyang"],
      ucapan: [["Pakde Harjo", "Sugeng pinanggih, mugi dados keluarga ingkang rukun."], ["Kantor Ayu", "Selamat Ayu dan Bagas, bahagia selalu!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa restu Anda sangat berarti. Bila berkenan memberi tanda kasih:", rekening: [{ bank: "Bank BRI", nomor: "0021 0100 2233 507", atasNama: "Bagas Wicaksono" }], alamatKado: "Jl. Kemasan No. 17, Kotagede, Yogyakarta 55173" },
      wa: "6281200000103", namaAcara: "pernikahan Bagas & Ayu", templat: RSVP_NIKAH,
      penutup: "Atas kehadiran dan doa restunya, kami haturkan maturnuwun.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Besar Wicaksono dan Pramono",
      nada: [293.66, 329.63, 392, 440, 392, 329.63, 293.66, 261.63], tempo: 640, konfeti: ["#d1a54a", "#f7e6c4", "#9c5b2e"],
    }),
  },
  {
    id: "undangan-nikah-ombak-pantai",
    kind: "nikah",
    title: "Undangan Pernikahan Kevin & Maria",
    description: "Undangan pernikahan pantai bernuansa biru laut dan pasir: saat dibuka, sampul tersapu naik seperti ombak dengan tepi gelombang yang bergerak.",
    theme: "#0f5e74",
    fonts: { display: "Marcellus", script: "Allura", text: "Mulish", href: "https://fonts.googleapis.com/css2?family=Marcellus&family=Allura&family=Mulish:wght@400;700&display=swap" },
    colors: { bg: "#fbf8f1", surface: "#eef5f4", ink: "#1d3138", inkSoft: "#4d6870", primary: "#0f5e74", onPrimary: "#ffffff", accent: "#e8a55a", line: "#d8e7e5", coverBg: "#1c7c93", coverInk: "#f4fbfb", ...C4("#5bc0d4", "#e8a55a", "#f1e3c8", "#0f5e74") },
    ornament: OMBAK.html,
    css: OPEN_BASE + OMBAK.css + `
.cover h1 { font-family: var(--font-script); }
.title { font-family: var(--font-display); font-weight: 400; color: var(--primary); }
.account { background: linear-gradient(135deg, #0f5e74, #5bc0d4); }
`,
    config: cfg({
      id: "nikah-kevin-maria", judul: "Wedding by the Sea", namaSampul: "Kevin & Maria", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: "Salam damai dalam kasih Kristus.", judulProfil: "Kedua Mempelai",
      pembuka: "Dengan penuh syukur kepada Tuhan, kami mengundang Anda menyaksikan janji kami di tepi pantai:",
      tokoh: [
        { panggilan: "Kevin", nama: "Kevin Hartanto Wijaya", keterangan: "Putra Bapak Hendrik Wijaya dan Ibu Lanny Susanti" },
        { panggilan: "Maria", nama: "Maria Fransiska Dewi", keterangan: "Putri Bapak Yohanes Ketut Arta dan Ibu Made Sulastri" },
      ],
      kutipan: { teks: "Kasih itu sabar; kasih itu murah hati. Kasih tidak berkesudahan.", sumber: "1 Korintus 13:4, 8" },
      zona: ["Asia/Makassar", "WITA"],
      acara: [
        { nama: "Pemberkatan Pernikahan", mulai: "2027-09-18T15:30:00+08:00", selesai: "2027-09-18T16:30:00+08:00", tempat: "Pantai Melasti", alamat: "Ungasan, Kuta Selatan, Badung, Bali" },
        { nama: "Makan Malam Resepsi", mulai: "2027-09-18T18:00:00+08:00", selesai: "2027-09-18T21:00:00+08:00", tempat: "Paviliun Senja Melasti", alamat: "Ungasan, Kuta Selatan, Badung, Bali" },
      ],
      galeri: ["Liburan pertama di Lombok", "Menyelam bersama", "Lamaran di Uluwatu", "Hari ini"],
      ucapan: [["Keluarga Arta", "Tuhan memberkati pernikahan kalian, rukun selalu."], ["Klub selam", "Selamat! Semoga petualangan kalian makin dalam."]],
      amplop: { judul: "Hadiah", pengantar: "Kehadiran Anda sudah cukup bagi kami. Bila ingin memberi hadiah:", rekening: [{ bank: "Bank BCA", nomor: "7710 2233 44", atasNama: "Kevin Hartanto" }], alamatKado: "" },
      wa: "6281200000104", namaAcara: "pernikahan Kevin & Maria", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      pengantarRsvp: "Mohon konfirmasi sebelum 1 September 2027. Dress code: putih dan biru muda, alas kaki santai.",
      penutup: "Sampai jumpa di tepi laut, saat matahari mulai turun.", salamPenutup: "Tuhan memberkati.", keluarga: "Kevin & Maria beserta keluarga",
      nada: NADA_B, tempo: 520, konfeti: ["#5bc0d4", "#e8a55a", "#ffffff"],
    }),
  },
  {
    id: "undangan-nikah-kelopak-sakura",
    kind: "nikah",
    title: "Undangan Pernikahan Yudha & Hanna",
    description: "Undangan pernikahan minimalis bernuansa sakura: saat dibuka, sampul terbelah menjadi delapan kelopak yang berputar menjauh dari tengah.",
    theme: "#b4546f",
    fonts: { display: "Shippori Mincho", script: "Parisienne", text: "Zen Kaku Gothic New", href: "https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600&family=Parisienne&family=Zen+Kaku+Gothic+New:wght@400;700&display=swap" },
    colors: { bg: "#fffafb", surface: "#fbeff2", ink: "#2f2427", inkSoft: "#6b5a5f", primary: "#b4546f", onPrimary: "#ffffff", accent: "#6d8f7a", line: "#f1dde3", coverBg: "#f6d5de", coverInk: "#5c2a3a", ...C4("#f3a6b9", "#6d8f7a", "#fbe3ea", "#d17b93") },
    ornament: KELOPAK.html,
    css: OPEN_BASE + KELOPAK.css + `
.cover h1 { color: var(--primary); }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.guest { background: rgba(255,255,255,.55); border-color: var(--line); }
.title { font-family: var(--font-display); font-weight: 500; color: var(--primary); }
.avatar { border-radius: 50%; width: 180px; height: 180px; }
`,
    config: cfg({
      id: "nikah-yudha-hanna", judul: "Pernikahan", namaSampul: "Yudha & Hanna", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Kedua Mempelai",
      pembuka: "Seperti sakura yang mekar di musimnya, kami memohon doa restu untuk pernikahan kami:",
      tokoh: [
        { panggilan: "Yudha", nama: "Yudha Mahendra", keterangan: "Putra Bapak Iwan Mahendra dan Ibu Ratih Kusuma" },
        { panggilan: "Hanna", nama: "Hanna Safitri", keterangan: "Putri Bapak Agus Salim dan Ibu Fitriani" },
      ],
      kutipan: { teks: "Segala sesuatu indah pada waktunya.", sumber: "Doa kami" },
      acara: [
        { nama: "Akad Nikah", mulai: "2027-04-03T09:00:00+07:00", selesai: "2027-04-03T10:00:00+07:00", tempat: "Masjid Agung Al-Azhar", alamat: "Jl. Sisingamangaraja, Kebayoran Baru, Jakarta Selatan" },
        { nama: "Resepsi Taman", mulai: "2027-04-03T16:00:00+07:00", selesai: "2027-04-03T19:00:00+07:00", tempat: "Taman Kirana", alamat: "Jl. Wijaya I No. 9, Jakarta Selatan" },
      ],
      galeri: ["Kyoto, 2023", "Hanami pertama", "Lamaran di rumah", "Pranikah"],
      ucapan: [["Sahabat SMA", "Selamat Hanna & Yudha! Mekar selalu cintanya."], ["Keluarga Pak Salim", "Barakallahu lakuma wa baraka alaikuma."]],
      amplop: { judul: "Amplop Digital", pengantar: "Bila ingin mengirim tanda kasih, dapat melalui:", rekening: [{ bank: "Bank Jago", nomor: "1088 7766 5544", atasNama: "Hanna Safitri" }], alamatKado: "Jl. Wijaya I No. 9, Jakarta Selatan 12170" },
      wa: "6281200000105", namaAcara: "pernikahan Yudha & Hanna", templat: RSVP_NIKAH,
      penutup: "Terima kasih telah menjadi bagian dari musim terindah kami.", salamPenutup: ISLAM.tutup, keluarga: "Yudha & Hanna",
      nada: [659.25, 587.33, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33], tempo: 520, konfeti: ["#f3a6b9", "#fbe3ea", "#ffffff"],
    }),
  },
  {
    id: "undangan-lamaran-cincin-diagonal",
    kind: "lamaran",
    title: "Undangan Lamaran Fikri & Salsa",
    description: "Undangan lamaran modern bernuansa hijau zaitun dan emas: saat dibuka, sampul terbelah miring dengan garis emas dan dua bagiannya bergeser berlawanan arah.",
    theme: "#3f4a2f",
    fonts: { display: "DM Serif Display", script: "Sacramento", text: "DM Sans", href: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Sacramento&family=DM+Sans:wght@400;700&display=swap" },
    colors: { bg: "#faf8f2", surface: "#eff0e6", ink: "#262a1f", inkSoft: "#5c6152", primary: "#4c5a35", onPrimary: "#fbfaf3", accent: "#c3a35a", line: "#e2e3d4", coverBg: "#3f4a2f", coverInk: "#f4efdc", ...C4("#8a9a6b", "#c3a35a", "#e5e0c8", "#2f3823") },
    ornament: DIAGONAL.html,
    css: OPEN_BASE + DIAGONAL.css + `
.cover h1 { color: var(--accent); }
.title { font-weight: 400; color: var(--primary); }
.account { background: linear-gradient(135deg, #2f3823, #8a9a6b); }
`,
    config: cfg({
      id: "lamaran-fikri-salsa", judul: "Acara Lamaran", namaSampul: "Fikri & Salsa", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Yang Akan Melamar dan Dilamar",
      pembuka: "Dengan rida Allah, keluarga kami bermaksud menyelenggarakan acara lamaran:",
      tokoh: [
        { panggilan: "Fikri", nama: "Muhammad Fikri Ramadhan", keterangan: "Putra Bapak Syamsul Bahri dan Ibu Rosmiati" },
        { panggilan: "Salsa", nama: "Salsabila Az-Zahra", keterangan: "Putri Bapak Irwan Setiadi dan Ibu Nurhayati" },
      ],
      kutipan: { teks: "Langkah kecil hari ini, untuk perjalanan panjang yang kami doakan bersama.", sumber: "Fikri & Salsa" },
      zona: ["Asia/Jakarta", "WIB"],
      acara: [{ nama: "Lamaran & Tukar Cincin", mulai: "2027-02-14T10:00:00+07:00", selesai: "2027-02-14T13:00:00+07:00", tempat: "Kediaman Keluarga Setiadi", alamat: "Jl. Gajah Mada No. 21, Medan" }],
      teks: { judulHitungMundur: "Menuju Hari Lamaran", judulAcara: "Waktu dan Tempat" },
      galeri: ["Pertama bertemu", "Silaturahmi keluarga", "Cincin yang dipilih bersama"],
      ucapan: [["Bou Rina", "Semoga lancar sampai hari pernikahan, Nak."], ["Teman kantor Fikri", "Gas terus, Fik! Kami tunggu undangan berikutnya."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah hadiah terbaik. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank Sumut", nomor: "1100 2200 3300", atasNama: "Muhammad Fikri" }], alamatKado: "" },
      wa: "6281200000106", namaAcara: "lamaran Fikri & Salsa", templat: RSVP_NIKAH,
      penutup: "Kehadiran dan doa Anda akan menjadi awal yang indah bagi kami.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Syamsul Bahri dan Bapak Irwan Setiadi",
      nada: NADA_A, tempo: 520, konfeti: ["#c3a35a", "#8a9a6b", "#f4efdc"],
    }),
  },
  {
    id: "undangan-lamaran-rol-film",
    kind: "lamaran",
    title: "Undangan Tunangan Rio & Dinda",
    description: "Undangan tunangan bergaya film analog hitam dan kuning: saat dibuka, sampul berlubang sproket meluncur ke kiri seperti rol film yang ditarik.",
    theme: "#1d1b18",
    fonts: { display: "Bebas Neue", script: "Homemade Apple", text: "IBM Plex Sans", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Homemade+Apple&family=IBM+Plex+Sans:wght@400;600&display=swap" },
    colors: { bg: "#fbf7ee", surface: "#f2ead8", ink: "#1d1b18", inkSoft: "#5a544a", primary: "#1d1b18", onPrimary: "#f7d046", accent: "#e0a420", line: "#e3d9c3", coverBg: "#1d1b18", coverInk: "#f7ecd0", ...C4("#f7d046", "#e0a420", "#c94f3d", "#6b8f8a") },
    ornament: FILM.html,
    css: OPEN_BASE + FILM.css + `
.cover h1 { font-family: var(--font-display); letter-spacing: .04em; color: var(--c1); font-size: clamp(56px, 14vw, 96px); }
.title { font-family: var(--font-display); font-weight: 400; letter-spacing: .03em; }
.avatar { border-radius: 6px; border: 10px solid #fff; border-bottom-width: 36px; box-shadow: 0 16px 30px -18px rgba(0,0,0,.6); }
.account { background: linear-gradient(135deg, #1d1b18, #4a453c); color: var(--c1); }
`,
    config: cfg({
      id: "tunangan-rio-dinda", judul: "Engagement Day", namaSampul: "Rio & Dinda", tamuBawaan: "Teman-teman", salam: "Halo!", judulProfil: "Pemeran",
      pembuka: "Setelah ribuan foto bersama, kami ingin merekam satu adegan lagi, kali ini disaksikan kalian:",
      tokoh: [
        { panggilan: "Rio", nama: "Mario Adiputra", keterangan: "Fotografer, penikmat kopi tubruk" },
        { panggilan: "Dinda", nama: "Adinda Kirana Putri", keterangan: "Penulis naskah, kolektor kamera lama" },
      ],
      kutipan: { teks: "Tidak semua momen perlu difoto. Tapi yang ini, harus.", sumber: "Rio & Dinda" },
      acara: [{ nama: "Pesta Tunangan", mulai: "2027-05-29T17:00:00+07:00", selesai: "2027-05-29T21:00:00+07:00", tempat: "Studio Kamar Gelap", alamat: "Jl. Kemang Raya No. 45, Jakarta Selatan" }],
      teks: { judulHitungMundur: "Kamera Mulai Merekam Dalam", judulAcara: "Lokasi Syuting", judulGaleri: "Arsip Negatif", pengantarGaleri: "Dicuci dan dicetak sendiri." },
      galeri: ["Roll #1: Bromo", "Roll #7: hujan di Kota Tua", "Roll #23: hari dia bilang iya", "Roll #24: ?"],
      ucapan: [["Klub Analog Jakarta", "Selamat! Semoga tidak pernah kehabisan film."], ["Kakak Rio", "Akhirnya adikku laku juga."]],
      amplop: { judul: "Kado", pengantar: "Datang saja sudah cukup. Tapi kalau mau patungan bulan madu:", rekening: [{ bank: "Bank Jago", nomor: "1099 8877 6655", atasNama: "Adinda Kirana" }], alamatKado: "" },
      wa: "6281200000107", namaAcara: "pesta tunangan Rio & Dinda", pilihan: ["Datang!", "Belum tahu", "Nggak bisa, maaf"], templat: "Halo Rio & Dinda! Aku {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Bawa kamera kalian. Film disediakan.", salamPenutup: "", keluarga: "Rio & Dinda",
      nada: [440, 523.25, 659.25, 587.33, 523.25, 440, 392, 440], tempo: 440, konfeti: ["#f7d046", "#e0a420", "#c94f3d"],
    }),
  },
  {
    id: "undangan-khitanan-gulungan",
    kind: "khitanan",
    title: "Undangan Khitanan Muhammad Alif",
    description: "Undangan khitanan islami bernuansa hijau tosca dan emas: saat dibuka, lembar sampul tergulung ke atas bersama batang gulungannya.",
    theme: "#0e5249",
    fonts: { display: "Amiri", script: "Aref Ruqaa", text: "Nunito Sans", href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=Nunito+Sans:wght@400;700&display=swap" },
    colors: { bg: "#f8fbf8", surface: "#e9f3ef", ink: "#16302b", inkSoft: "#4d6862", primary: "#0e6b5e", onPrimary: "#ffffff", accent: "#d4a73a", line: "#d5e6df", coverBg: "#0e5249", coverInk: "#f6efd8", ...C4("#2fa58f", "#d4a73a", "#cfe8df", "#0e5249") },
    ornament: GULUNG.html + deco("khat", `<svg viewBox="0 0 200 80"><text x="100" y="56" text-anchor="middle" font-family="Aref Ruqaa, serif" font-size="46" fill="currentColor">بِسْمِ اللَّهِ</text></svg>`),
    css: OPEN_BASE + GULUNG.css + DECO_CSS + `
.khat { left: 50%; top: 7vh; width: 200px; margin-left: -100px; }
.cover h1 { color: var(--accent); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 999px 999px 20px 20px; }
`,
    config: cfg({
      id: "khitanan-alif", judul: "Tasyakuran Khitanan", namaSampul: "Muhammad Alif", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Putra Kami",
      pembuka: "Dengan memohon rahmat Allah SWT, kami bermaksud menyelenggarakan tasyakuran khitanan putra kami:",
      tokoh: [{ panggilan: "Alif", nama: "Muhammad Alif Al-Fatih", keterangan: "Putra kedua Bapak Ridwan Hakim dan Ibu Siti Maryam, kelas 3 SD" }],
      kutipan: { teks: "Lima perkara termasuk fitrah: khitan, mencukur bulu kemaluan, mencabut bulu ketiak, memotong kuku, dan memendekkan kumis.", sumber: "HR. Bukhari dan Muslim" },
      acara: [{ nama: "Tasyakuran & Pengajian", mulai: "2027-07-04T09:00:00+07:00", selesai: "2027-07-04T13:00:00+07:00", tempat: "Kediaman Bapak Ridwan Hakim", alamat: "Perum Griya Asri Blok C2 No. 5, Bekasi" }],
      galeri: ["Alif dan kakak", "Hafalan juz 30", "Main bola sore"],
      ucapan: [["Ustaz Hamid", "Barakallahu fiik, semoga menjadi anak saleh."], ["Tetangga Blok C", "Selamat Alif, cepat sembuh ya!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Bapak/Ibu sangat berarti. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BSI", nomor: "7123 4567 89", atasNama: "Ridwan Hakim" }], alamatKado: "Perum Griya Asri Blok C2 No. 5, Bekasi 17145" },
      wa: "6281200000108", namaAcara: "tasyakuran khitanan Alif", templat: RSVP_NIKAH,
      penutup: "Atas kehadiran dan doanya, kami ucapkan jazakumullahu khairan.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Ridwan Hakim",
      nada: NADA_D, tempo: 600, konfeti: ["#d4a73a", "#2fa58f", "#ffffff"],
    }),
  },
  {
    id: "undangan-aqiqah-gelembung",
    kind: "aqiqah",
    title: "Undangan Aqiqah Aisyah",
    description: "Undangan aqiqah lembut bernuansa biru langit dan krem: gelembung sabun melayang di sampul, lalu lubang bundar membesar dari tengah untuk membuka undangan.",
    theme: "#6aa6c8",
    fonts: { display: "Quicksand", script: "Dancing Script", text: "Nunito", href: "https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Dancing+Script:wght@600&family=Nunito:wght@400;700&display=swap" },
    colors: { bg: "#fbfdff", surface: "#eef6fb", ink: "#24384a", inkSoft: "#5b7083", primary: "#3f86ad", onPrimary: "#ffffff", accent: "#f2b26b", line: "#dbe9f2", coverBg: "#cfe6f5", coverInk: "#24384a", ...C4("#8fd0f2", "#f2b26b", "#fde7cf", "#c5b6f0") },
    ornament: GELEMBUNG.html,
    css: OPEN_BASE + GELEMBUNG.css + `
.cover h1 { color: var(--primary); }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.guest { background: rgba(255,255,255,.6); border-color: var(--line); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 50%; width: 180px; height: 180px; }
`,
    config: cfg({
      id: "aqiqah-aisyah", judul: "Tasyakuran Aqiqah", namaSampul: "Aisyah", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Buah Hati Kami",
      pembuka: "Alhamdulillah, telah lahir putri pertama kami. Kami mengundang Anda ke tasyakuran aqiqahnya:",
      tokoh: [{ panggilan: "Aisyah", nama: "Aisyah Humaira Rahman", keterangan: "Lahir 2 Februari 2027, 3,1 kg, 49 cm. Putri Bapak Fadli Rahman dan Ibu Annisa" }],
      kutipan: { teks: "Setiap anak tergadai dengan aqiqahnya, disembelihkan untuknya pada hari ketujuh dan diberi nama.", sumber: "HR. Abu Dawud" },
      acara: [{ nama: "Aqiqah & Cukur Rambut", mulai: "2027-02-09T10:00:00+07:00", selesai: "2027-02-09T12:30:00+07:00", tempat: "Kediaman Bapak Fadli Rahman", alamat: "Jl. Cempaka Putih Tengah No. 14, Jakarta Pusat" }],
      galeri: ["Hari pertama", "Tidur siang", "Senyum pertama"],
      ucapan: [["Nenek Ijah", "Cantiknya cucu nenek. Sehat selalu, Nak."], ["Teman kantor Fadli", "Selamat jadi ayah! Semoga jadi anak salihah."]],
      amplop: { judul: "Kado untuk Aisyah", pengantar: "Bila ingin mengirim kado, dapat melalui:", rekening: [{ bank: "Bank BCA", nomor: "5566 7788 99", atasNama: "Annisa Putri" }], alamatKado: "Jl. Cempaka Putih Tengah No. 14, Jakarta Pusat 10510" },
      wa: "6281200000109", namaAcara: "aqiqah Aisyah", templat: RSVP_NIKAH,
      penutup: "Terima kasih atas doa untuk Aisyah. Semoga Allah membalas kebaikan Anda.", salamPenutup: ISLAM.tutup, keluarga: "Fadli & Annisa",
      nada: NADA_C, tempo: 480, konfeti: ["#8fd0f2", "#f2b26b", "#ffffff"],
    }),
  },
  {
    id: "undangan-ultah-kado-kejutan",
    kind: "ultah",
    title: "Undangan Ulang Tahun Kenzo ke-5",
    description: "Undangan ulang tahun anak bernuansa biru dan kuning: sampul berupa kotak kado, saat dibuka pita terlepas, tutup kado melambung, dan kotaknya jatuh.",
    theme: "#2f6fd6",
    fonts: { display: "Baloo 2", script: "Baloo 2", text: "Nunito", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;800&family=Nunito:wght@400;700&display=swap" },
    colors: { bg: "#fffbf2", surface: "#eef4ff", ink: "#1f2b45", inkSoft: "#56627c", primary: "#2f6fd6", onPrimary: "#ffffff", accent: "#ffbf2e", line: "#dfe7f6", coverBg: "#3d7fe6", coverInk: "#ffffff", ...C4("#ff6b6b", "#ffbf2e", "#4ecdc4", "#2f6fd6") },
    ornament: KADO.html,
    css: OPEN_BASE + KADO.css + `
.cover-inner { padding-top: 18vh; }
.cover h1 { font-family: var(--font-display); font-weight: 800; }
.cover .btn { background: var(--accent); color: #1f2b45; }
.title { font-family: var(--font-display); font-weight: 800; }
.avatar { border-radius: 50%; width: 180px; height: 180px; background: conic-gradient(var(--c1), var(--c2), var(--c3), var(--c4), var(--c1)); }
`,
    config: cfg({
      id: "ultah-kenzo-5", judul: "Ulang Tahun ke-5", namaSampul: "Kenzo", tamuBawaan: "Teman Kenzo", salam: "Halo, teman-teman!", judulProfil: "Yang Berulang Tahun",
      pembuka: "Kenzo mau tiup lilin! Ayo datang ke pestanya:",
      tokoh: [{ panggilan: "Kenzo", nama: "Kenzo Arkana Putra", keterangan: "Suka dinosaurus, mobil-mobilan, dan es krim cokelat" }],
      kutipan: { teks: "Kado terbaik adalah teman-teman yang datang.", sumber: "Kenzo, 5 tahun" },
      acara: [{ nama: "Pesta Ulang Tahun", mulai: "2027-03-13T15:30:00+07:00", selesai: "2027-03-13T18:00:00+07:00", tempat: "Kidzone Playground", alamat: "Mal Ciputra Lt. 3, Jl. S. Parman, Jakarta Barat" }],
      teks: { judulHitungMundur: "Pesta Dimulai Dalam", judulAcara: "Detail Pesta", pengantarAcara: "Jangan lupa bawa kaos kaki untuk area bermain:", judulUcapan: "Ucapan untuk Kenzo" },
      galeri: ["Ulang tahun pertama", "Ke kebun binatang", "Hari pertama TK"],
      ucapan: [["Om Bayu", "Selamat ulang tahun jagoan! Makin pintar ya."], ["Nayla", "Kenzo, ayo main perosotan bareng!"]],
      amplop: { judul: "Kado", pengantar: "Kehadiranmu sudah jadi kado. Bila ingin kirim kado dari jauh:", rekening: [{ bank: "GoPay", nomor: "0812 0000 0110", atasNama: "Mama Kenzo" }], alamatKado: "" },
      wa: "6281200000110", namaAcara: "ulang tahun Kenzo ke-5", pilihan: ["Datang!", "Belum tahu", "Maaf, tidak bisa"], templat: "Halo Mama Kenzo, saya orang tua {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Sampai ketemu di pesta, ya!", salamPenutup: "", keluarga: "Papa, Mama, dan Kenzo",
      nada: NADA_C, tempo: 360, konfeti: ["#ff6b6b", "#ffbf2e", "#4ecdc4", "#2f6fd6"],
    }),
  },
  {
    id: "undangan-ultah-sirkus",
    kind: "ultah",
    title: "Undangan Ulang Tahun Bima ke-6",
    description: "Undangan ulang tahun anak bertema sirkus merah dan krem: sampul berupa kain tenda bergaris, saat dibuka kedua kain terangkat ke pojok dan bendera naik.",
    theme: "#c8283c",
    fonts: { display: "Rye", script: "Rye", text: "Nunito", href: "https://fonts.googleapis.com/css2?family=Rye&family=Nunito:wght@400;700&display=swap" },
    colors: { bg: "#fff8ec", surface: "#fdeeda", ink: "#2e1d18", inkSoft: "#6b5248", primary: "#c8283c", onPrimary: "#ffffff", accent: "#f2b134", line: "#f1dcc0", coverBg: "#c8283c", coverInk: "#fff3db", ...C4("#fff3db", "#f2b134", "#2a9d8f", "#264653") },
    ornament: TENDA.html,
    css: OPEN_BASE + TENDA.css + `
.cover h1 { font-family: var(--font-display); color: var(--accent); font-size: clamp(48px, 12vw, 80px); }
.cover .btn { background: var(--accent); color: #2e1d18; }
.title { font-family: var(--font-display); font-weight: 400; color: var(--primary); }
.avatar { border-radius: 50%; width: 180px; height: 180px; background: repeating-conic-gradient(var(--primary) 0 15deg, var(--c1) 15deg 30deg); }
`,
    config: cfg({
      id: "ultah-bima-6", judul: "Sirkus Ulang Tahun", namaSampul: "Bima", tamuBawaan: "Penonton Istimewa", salam: "Hadirin sekalian!", judulProfil: "Bintang Pertunjukan",
      pembuka: "Saksikan pertunjukan paling seru tahun ini: Bima genap enam tahun!",
      tokoh: [{ panggilan: "Bima", nama: "Bima Satria Mahardika", keterangan: "Pawang singa (boneka), pesulap amatir, dan juara lompat trampolin" }],
      kutipan: { teks: "Tidak ada badut yang sedih di hari ulang tahun.", sumber: "Bima, 6 tahun" },
      acara: [{ nama: "Pertunjukan Ulang Tahun", mulai: "2027-06-26T16:00:00+07:00", selesai: "2027-06-26T18:30:00+07:00", tempat: "Taman Belakang Rumah Bima", alamat: "Jl. Kenanga No. 3, Malang" }],
      teks: { judulHitungMundur: "Pertunjukan Dimulai Dalam", judulAcara: "Tiket Masuk", pengantarAcara: "Ada sulap, badut, dan permen kapas:" },
      galeri: ["Latihan sulap", "Kostum pawang singa", "Ulang tahun ke-5"],
      ucapan: [["Badut Pipo", "Siap menghibur! Selamat ulang tahun, Bima!"], ["Kak Rania", "Bima makin besar, makin pemberani!"]],
      amplop: { judul: "Kado", pengantar: "Datang saja sudah membuat Bima senang. Bila ingin kirim kado:", rekening: [{ bank: "OVO", nomor: "0812 0000 0111", atasNama: "Mama Bima" }], alamatKado: "Jl. Kenanga No. 3, Malang 65141" },
      wa: "6281200000111", namaAcara: "ulang tahun Bima ke-6", pilihan: ["Datang!", "Belum tahu", "Maaf, tidak bisa"], templat: "Halo Mama Bima, saya orang tua {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Pertunjukan tidak akan lengkap tanpa kamu!", salamPenutup: "", keluarga: "Keluarga Mahardika",
      nada: [392, 523.25, 392, 523.25, 659.25, 587.33, 523.25, 392], tempo: 320, konfeti: ["#c8283c", "#f2b134", "#2a9d8f", "#fff3db"],
    }),
  },
  {
    id: "undangan-ultah-puzzle-oma",
    kind: "ultah",
    title: "Undangan Ulang Tahun ke-60 Oma Lies",
    description: "Undangan ulang tahun ke-60 bernuansa hijau sage dan krem: sampul tersusun dari 24 keping puzzle yang lepas dan jatuh satu per satu saat dibuka.",
    theme: "#4f6b5a",
    fonts: { display: "Fraunces", script: "Caveat", text: "Source Sans 3", href: "https://fonts.googleapis.com/css2?family=Fraunces:wght@500;600&family=Caveat:wght@600&family=Source+Sans+3:wght@400;600&display=swap" },
    colors: { bg: "#fbf9f3", surface: "#eef2ea", ink: "#25302a", inkSoft: "#5b665f", primary: "#4f6b5a", onPrimary: "#ffffff", accent: "#d18f5a", line: "#dfe5da", coverBg: "#4f6b5a", coverInk: "#f6f1e3", ...C4("#a9c2a8", "#d18f5a", "#f1e3c8", "#7d5a8c") },
    ornament: PUZZLE.html,
    css: OPEN_BASE + PUZZLE.css + `
.cover h1 { font-family: var(--font-display); font-weight: 600; }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 24px; }
`,
    config: cfg({
      id: "ultah-oma-lies-60", judul: "Syukuran 60 Tahun", namaSampul: "Oma Lies", tamuBawaan: "Keluarga dan sahabat", salam: "Shalom dan salam sejahtera.", judulProfil: "Yang Kami Rayakan",
      pembuka: "Enam puluh tahun, enam puluh keping cerita. Mari rayakan hari istimewa Oma kami:",
      tokoh: [{ panggilan: "Oma Lies", nama: "Elisabeth Gunawan", keterangan: "Ibu dari tiga anak, oma dari tujuh cucu, pembuat kue nastar terenak se-Surabaya" }],
      kutipan: { teks: "Masa tua adalah mahkota yang indah.", sumber: "Amsal 16:31" },
      acara: [{ nama: "Ibadah Syukur & Makan Siang", mulai: "2027-10-10T11:00:00+07:00", selesai: "2027-10-10T14:00:00+07:00", tempat: "Restoran Taman Sari", alamat: "Jl. Raya Darmo No. 101, Surabaya" }],
      teks: { judulHitungMundur: "Menuju Hari Istimewa", judulGaleri: "Keping Kenangan", pengantarGaleri: "Dari foto hitam putih sampai foto cucu." },
      galeri: ["Oma muda, 1985", "Hari pernikahan", "Toko kue pertama", "Bersama tujuh cucu"],
      ucapan: [["Cucu-cucu", "Selamat ulang tahun, Oma! Kami sayang Oma."], ["Persekutuan Wanita", "Tuhan memberkati Ibu Lies dengan umur panjang dan kesehatan."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Kehadiran Anda adalah kado terbaik untuk Oma. Bila ingin berbagi:", rekening: [{ bank: "Bank BCA", nomor: "0881 2233 44", atasNama: "Elisabeth Gunawan" }], alamatKado: "" },
      wa: "6281200000112", namaAcara: "syukuran 60 tahun Oma Lies", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      penutup: "Terima kasih telah menjadi bagian dari perjalanan Oma.", salamPenutup: "Tuhan memberkati.", keluarga: "Anak-anak dan cucu-cucu Oma Lies",
      nada: NADA_B, tempo: 560, konfeti: ["#a9c2a8", "#d18f5a", "#f1e3c8"],
    }),
  },
  {
    id: "undangan-ultah-peta-petualangan",
    kind: "ultah",
    title: "Undangan Ulang Tahun Dafa ke-8",
    description: "Undangan ulang tahun anak bertema petualangan: sampul berupa peta harta karun tiga lipatan yang terlipat menutup bergantian saat dibuka.",
    theme: "#7a5230",
    fonts: { display: "Pirata One", script: "Pirata One", text: "Nunito", href: "https://fonts.googleapis.com/css2?family=Pirata+One&family=Nunito:wght@400;700&display=swap" },
    colors: { bg: "#fbf6ea", surface: "#f2e7cf", ink: "#2d2318", inkSoft: "#665643", primary: "#7a5230", onPrimary: "#fff7e8", accent: "#2f7d6d", line: "#e5d6b6", coverBg: "#ead7ae", coverInk: "#3a2a18", ...C4("#c0392b", "#2f7d6d", "#7fb6a5", "#e0b25b") },
    ornament: PETA.html + deco("x", `<svg viewBox="0 0 200 200"><path d="M20 160C50 120 60 140 90 110S140 60 170 40" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="10 9" stroke-linecap="round"/><path d="M156 26l28 28M184 26l-28 28" stroke="#c0392b" stroke-width="7" stroke-linecap="round"/></svg>`),
    css: OPEN_BASE + PETA.css + DECO_CSS + `
.x { right: 6vw; top: 6vh; width: min(34vw, 200px); color: var(--primary); }
.cover h1 { font-family: var(--font-display); color: var(--primary); font-size: clamp(56px, 13vw, 90px); }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.guest { background: rgba(255,255,255,.4); border-color: rgba(58,42,24,.2); }
.title { font-family: var(--font-display); font-weight: 400; color: var(--primary); }
`,
    config: cfg({
      id: "ultah-dafa-8", judul: "Ekspedisi Ulang Tahun", namaSampul: "Dafa", tamuBawaan: "Penjelajah", salam: "Ahoy, penjelajah!", judulProfil: "Kapten Ekspedisi",
      pembuka: "Peta sudah ditemukan. Bergabunglah dalam ekspedisi berburu harta karun di ulang tahun ke-8 Dafa:",
      tokoh: [{ panggilan: "Dafa", nama: "Daffa Rizqullah", keterangan: "Kapten bajak laut paling baik hati di kompleks, kelas 2 SD" }],
      kutipan: { teks: "Harta karun paling berharga adalah teman yang ikut berpetualang.", sumber: "Kapten Dafa" },
      acara: [{ nama: "Berburu Harta Karun", mulai: "2027-08-21T15:00:00+07:00", selesai: "2027-08-21T18:00:00+07:00", tempat: "Taman Kota Kebun Raya", alamat: "Jl. Ir. H. Juanda No. 13, Bogor" }],
      teks: { judulHitungMundur: "Kapal Berangkat Dalam", judulAcara: "Titik Kumpul", pengantarAcara: "Pakai sepatu yang nyaman untuk berlari:", judulGaleri: "Catatan Ekspedisi" },
      galeri: ["Ekspedisi pantai", "Kemah di halaman", "Kostum bajak laut"],
      ucapan: [["Om Rudi", "Selamat ulang tahun, Kapten! Semoga ketemu harta karunnya."], ["Arsya", "Aku bawa teropong, Daf!"]],
      amplop: { judul: "Peti Harta", pengantar: "Bila ingin menitipkan hadiah untuk Kapten Dafa:", rekening: [{ bank: "DANA", nomor: "0812 0000 0113", atasNama: "Bunda Dafa" }], alamatKado: "" },
      wa: "6281200000113", namaAcara: "ulang tahun Dafa ke-8", pilihan: ["Siap berlayar!", "Belum tahu", "Maaf, tidak bisa"], templat: "Ahoy Bunda Dafa! Saya orang tua {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Siapkan topi bajak lautmu!", salamPenutup: "", keluarga: "Ayah, Bunda, dan Kapten Dafa",
      nada: [293.66, 392, 440, 392, 329.63, 293.66, 392, 440], tempo: 380, konfeti: ["#c0392b", "#e0b25b", "#2f7d6d"],
    }),
  },
  {
    id: "undangan-wisuda-buku",
    kind: "wisuda",
    title: "Undangan Syukuran Wisuda Anisa",
    description: "Undangan syukuran wisuda bernuansa biru tua dan emas: sampul berupa sampul buku berbingkai yang berputar terbuka dari punggungnya.",
    theme: "#1f2f57",
    fonts: { display: "Libre Baskerville", script: "Tangerine", text: "Source Sans 3", href: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Tangerine:wght@700&family=Source+Sans+3:wght@400;600&display=swap" },
    colors: { bg: "#f9f7f1", surface: "#eceef4", ink: "#1c2433", inkSoft: "#535d70", primary: "#1f2f57", onPrimary: "#f6ecd1", accent: "#c9a24a", line: "#dcdfe8", coverBg: "#1f2f57", coverInk: "#f3e6c3", ...C4("#c9a24a", "#3e5591", "#efe2bd", "#8a2f3c") },
    ornament: BUKU.html,
    css: OPEN_BASE + BUKU.css + `
.cover h1 { color: var(--accent); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 8px; }
`,
    config: cfg({
      id: "wisuda-anisa", judul: "Syukuran Wisuda", namaSampul: "Anisa, S.Pd.", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Wisudawati",
      pembuka: "Satu bab selesai ditulis. Kami mengundang Anda merayakan kelulusan putri kami:",
      tokoh: [{ panggilan: "Anisa", nama: "Anisa Rahmawati, S.Pd.", keterangan: "Lulusan Pendidikan Bahasa Indonesia, Universitas Negeri Surabaya, predikat cum laude" }],
      kutipan: { teks: "Ilmu itu lebih baik daripada harta. Ilmu menjagamu, sedangkan engkau menjaga harta.", sumber: "Ali bin Abi Thalib" },
      acara: [{ nama: "Syukuran & Makan Bersama", mulai: "2027-09-04T12:00:00+07:00", selesai: "2027-09-04T15:00:00+07:00", tempat: "Kediaman Bapak Sugiarto", alamat: "Jl. Ketintang Baru IV No. 22, Surabaya" }],
      teks: { judulHitungMundur: "Menuju Hari Syukuran", judulGaleri: "Halaman-Halaman Kuliah" },
      galeri: ["Ospek 2023", "PPL di SMP", "Sidang skripsi", "Toga dan keluarga"],
      ucapan: [["Bu Dosen Pembimbing", "Selamat Anisa, semoga menjadi guru yang menginspirasi."], ["Teman kos", "Akhirnya sarjana! Traktir bakso ya."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah bekal terbaik. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BNI", nomor: "0912 3456 78", atasNama: "Anisa Rahmawati" }], alamatKado: "" },
      wa: "6281200000114", namaAcara: "syukuran wisuda Anisa", templat: RSVP_NIKAH,
      penutup: "Bab berikutnya dimulai. Terima kasih telah menjadi bagian dari ceritanya.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Sugiarto",
      nada: NADA_B, tempo: 520, konfeti: ["#c9a24a", "#3e5591", "#ffffff"],
    }),
  },
  {
    id: "undangan-rumah-baru-krepyak",
    kind: "rumah",
    title: "Undangan Syukuran Rumah Baru Keluarga Santoso",
    description: "Undangan syukuran rumah baru bernuansa terakota dan krem: sampul berupa krepyak jendela yang bilah-bilahnya berputar terbuka satu per satu dari atas.",
    theme: "#a4532f",
    fonts: { display: "Bitter", script: "Kalam", text: "Work Sans", href: "https://fonts.googleapis.com/css2?family=Bitter:wght@600;700&family=Kalam:wght@700&family=Work+Sans:wght@400;600&display=swap" },
    colors: { bg: "#fcf8f2", surface: "#f5e9dd", ink: "#2f221c", inkSoft: "#6b5850", primary: "#a4532f", onPrimary: "#ffffff", accent: "#5b8a72", line: "#ecdccc", coverBg: "#c06a42", coverInk: "#fff6ea", ...C4("#e3a07a", "#5b8a72", "#f3dcc4", "#a4532f") },
    ornament: KREPYAK.html,
    css: OPEN_BASE + KREPYAK.css + `
.cover-inner { padding: 26px 22px; border-radius: 20px; background: color-mix(in srgb, var(--cover-bg) 85%, transparent); }
.cover h1 { font-family: var(--font-script); font-weight: 700; }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 20px; }
`,
    config: cfg({
      id: "rumah-santoso", judul: "Syukuran Rumah Baru", namaSampul: "Keluarga Santoso", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Penghuni Baru",
      pembuka: "Alhamdulillah, kami telah menempati rumah baru. Kami mengundang Anda untuk ikut bersyukur bersama:",
      tokoh: [
        { panggilan: "Pak Budi", nama: "Budi Santoso", keterangan: "Kepala keluarga, tukang kebun dadakan" },
        { panggilan: "Bu Ratna", nama: "Ratna Kurniasih", keterangan: "Ibu rumah, juru masak syukuran hari ini" },
      ],
      kutipan: { teks: "Rumah bukan soal dinding dan atap, tapi tentang siapa yang menunggu di dalamnya.", sumber: "Keluarga Santoso" },
      acara: [{ nama: "Pengajian & Syukuran", mulai: "2027-01-16T16:00:00+07:00", selesai: "2027-01-16T19:30:00+07:00", tempat: "Rumah Baru Keluarga Santoso", alamat: "Perumahan Taman Sari Blok F No. 12, Sidoarjo" }],
      teks: { judulGaleri: "Dari Fondasi Sampai Pintu", pengantarGaleri: "Perjalanan rumah ini dibangun." },
      galeri: ["Tanah kosong", "Pasang atap", "Cat dinding bersama anak-anak", "Kunci pertama"],
      ucapan: [["Tetangga Blok F", "Selamat datang, Pak Budi sekeluarga!"], ["Keluarga besar Kurniasih", "Semoga rumahnya penuh berkah dan tawa."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda sudah lebih dari cukup. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank Mandiri", nomor: "1420 0099 8877", atasNama: "Budi Santoso" }], alamatKado: "Perumahan Taman Sari Blok F No. 12, Sidoarjo 61252" },
      wa: "6281200000115", namaAcara: "syukuran rumah baru Keluarga Santoso", templat: RSVP_NIKAH,
      penutup: "Pintu rumah kami selalu terbuka untuk Anda.", salamPenutup: ISLAM.tutup, keluarga: "Budi, Ratna, Raka, dan Salma",
      nada: NADA_A, tempo: 540, konfeti: ["#e3a07a", "#5b8a72", "#fff6ea"],
    }),
  },
  {
    id: "undangan-baby-shower-awan",
    kind: "tujuhbulan",
    title: "Undangan Baby Shower Mama Rani",
    description: "Undangan baby shower bernuansa pastel langit: sampul penuh awan lembut yang menyingkir ke kiri dan kanan saat undangan dibuka.",
    theme: "#8aa9d6",
    fonts: { display: "Comfortaa", script: "Sniglet", text: "Nunito", href: "https://fonts.googleapis.com/css2?family=Comfortaa:wght@600;700&family=Sniglet&family=Nunito:wght@400;700&display=swap" },
    colors: { bg: "#fdfcff", surface: "#f1f4fd", ink: "#2b3150", inkSoft: "#636a8a", primary: "#6d84c4", onPrimary: "#ffffff", accent: "#f4a6b8", line: "#e2e7f6", coverBg: "#bcd4f2", coverInk: "#2b3150", ...C4("#bcd4f2", "#f4a6b8", "#fde2c6", "#c8e6c9") },
    ornament: AWAN.html,
    css: OPEN_BASE + AWAN.css + `
.cover h1 { font-family: var(--font-display); color: var(--primary); }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.guest { background: rgba(255,255,255,.7); border-color: var(--line); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 50%; width: 180px; height: 180px; }
`,
    config: cfg({
      id: "babyshower-rani", judul: "Baby Shower", namaSampul: "Mama Rani", tamuBawaan: "Sahabat Mama Rani", salam: "Halo, Aunty dan Uncle!", judulProfil: "Calon Orang Tua",
      pembuka: "Sebentar lagi ada yang turun dari awan. Ayo rayakan bersama sebelum dia datang:",
      tokoh: [
        { panggilan: "Rani", nama: "Maharani Putri", keterangan: "Calon mama, sedang ngidam martabak manis" },
        { panggilan: "Dimas", nama: "Dimas Anggara", keterangan: "Calon papa, sudah latihan pasang popok di boneka" },
      ],
      kutipan: { teks: "Kami belum bertemu denganmu, tapi kami sudah sangat menyayangimu.", sumber: "Mama & Papa" },
      acara: [{ nama: "Baby Shower", mulai: "2027-05-08T15:00:00+07:00", selesai: "2027-05-08T18:00:00+07:00", tempat: "Kafe Awan Biru", alamat: "Jl. Dago No. 101, Bandung" }],
      teks: { judulHitungMundur: "Pesta Dimulai Dalam", judulAcara: "Detail Acara", judulGaleri: "Menunggu Kamu", pengantarGaleri: "Dari dua garis sampai perut bundar." },
      galeri: ["Dua garis", "USG pertama", "Kamar bayi siap"],
      ucapan: [["Geng arisan", "Sehat-sehat Rani dan dedek bayi!"], ["Tante Wulan", "Semoga persalinannya lancar, Nak."]],
      amplop: { judul: "Kado untuk Si Kecil", pengantar: "Bila ingin mengirim kado untuk si kecil:", rekening: [{ bank: "Bank BCA", nomor: "4433 2211 00", atasNama: "Maharani Putri" }], alamatKado: "Jl. Cigadung Asri No. 4, Bandung 40191" },
      wa: "6281200000116", namaAcara: "baby shower Rani & Dimas", pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
      penutup: "Terima kasih sudah ikut menunggu bersama kami.", salamPenutup: "", keluarga: "Rani & Dimas",
      nada: NADA_C, tempo: 460, konfeti: ["#bcd4f2", "#f4a6b8", "#fde2c6"],
    }),
  },
  {
    id: "undangan-halal-bihalal-lentera",
    kind: "reuni",
    title: "Undangan Halal Bihalal Keluarga Besar Mangunsong",
    description: "Undangan halal bihalal bernuansa malam biru dan emas: lentera bergoyang di sampul, lalu terbang naik saat undangan dibuka.",
    theme: "#16224a",
    fonts: { display: "Amiri", script: "Reem Kufi", text: "Nunito Sans", href: "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Reem+Kufi:wght@500;700&family=Nunito+Sans:wght@400;700&display=swap" },
    colors: { bg: "#fbf9f3", surface: "#eef0f6", ink: "#1b2340", inkSoft: "#555d7a", primary: "#1f2f6b", onPrimary: "#f7e7b6", accent: "#d8a840", line: "#dde1ec", coverBg: "#16224a", coverInk: "#f7e7b6", ...C4("#d8a840", "#f0b44c", "#e9edf7", "#3a4c96") },
    ornament: LENTERA.html,
    css: OPEN_BASE + LENTERA.css + `
.cover h1 { font-family: var(--font-display); color: var(--accent); }
.cover-inner { padding-bottom: 10vh; }
.title { font-family: var(--font-display); color: var(--primary); }
`,
    config: cfg({
      id: "halal-bihalal-mangunsong", judul: "Halal Bihalal 1448 H", namaSampul: "Keluarga Mangunsong", tamuBawaan: "Keluarga Besar Mangunsong", salam: ISLAM.salam, judulProfil: "Tuan Rumah",
      pembuka: "Taqabbalallahu minna wa minkum. Mari bersilaturahmi dan saling memaafkan di halal bihalal keluarga:",
      tokoh: [
        { panggilan: "Opung", nama: "H. Parlindungan Mangunsong", keterangan: "Sesepuh keluarga" },
        { panggilan: "Panitia", nama: "Cucu-cucu angkatan 90-an", keterangan: "Urusan konsumsi, games, dan foto keluarga" },
      ],
      kutipan: { teks: "Barang siapa ingin dilapangkan rezekinya dan dipanjangkan umurnya, hendaklah ia menyambung tali silaturahmi.", sumber: "HR. Bukhari" },
      acara: [{ nama: "Halal Bihalal & Makan Siang", mulai: "2027-03-21T10:00:00+07:00", selesai: "2027-03-21T14:00:00+07:00", tempat: "Rumah Opung", alamat: "Jl. Sisingamangaraja No. 77, Medan" }],
      teks: { judulHitungMundur: "Berkumpul Kembali Dalam", judulGaleri: "Lebaran Tahun Lalu", judulUcapan: "Ucapan Lebaran" },
      galeri: ["Foto keluarga 2026", "Lomba makan kerupuk", "Opung dan cicit"],
      ucapan: [["Keluarga Tulang Ucok", "Mohon maaf lahir dan batin, sampai jumpa di rumah Opung!"], ["Cucu dari Jakarta", "Insyaallah pulang, Opung."]],
      amplop: { judul: "Kas Keluarga", pengantar: "Iuran sukarela untuk konsumsi dan santunan anak yatim:", rekening: [{ bank: "Bank Sumut", nomor: "2200 1100 4455", atasNama: "Panitia Halal Bihalal" }], alamatKado: "" },
      wa: "6281200000117", namaAcara: "halal bihalal keluarga Mangunsong", pilihan: ["Insyaallah hadir", "Belum pasti", "Tidak dapat hadir"], templat: RSVP_NIKAH,
      pengantarRsvp: "Mohon kabari jumlah anggota keluarga yang datang agar konsumsi cukup.",
      penutup: "Mohon maaf lahir dan batin. Sampai jumpa di rumah Opung.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Besar Mangunsong",
      nada: NADA_D, tempo: 600, konfeti: ["#d8a840", "#f0b44c", "#e9edf7"],
    }),
  },
];

