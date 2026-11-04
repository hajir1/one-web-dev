import type { AnimCssSpec, CssScene } from "./animCss";
import { rng } from "./shared";

/* ================================================================== */
/* 10 pure CSS scenes (v29). Each one is its own little story built     */
/* from positioned elements and @keyframes; repeated elements (drops,   */
/* stars, windows, bubbles) are generated here with a fixed seed so the */
/* output never changes between builds.                                 */
/* ================================================================== */

const F = (family: string, weights = "500;600;700") => ({ display: family, href: `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weights}&display=swap` });
const rep = (n: number, f: (i: number) => string) => Array.from({ length: n }, (_, i) => f(i)).join("");
const pc = (v: number) => `${v.toFixed(1)}%`;

/** 1. Sunrise: the sun climbs over three layers of hills while the sky warms and birds cross. */
const SUNRISE: CssScene = {
  html: `<div class="sky"></div><div class="sun"></div><div class="cloud c1"></div><div class="cloud c2"></div>
<div class="birds">${rep(4, (i) => `<i style="--d:${i * -3.2}s;--y:${18 + i * 7}%"></i>`)}</div>
<div class="hill h3"></div><div class="hill h2"></div><div class="hill h1"></div>`,
  css: `
.sky { inset: 0; background: linear-gradient(180deg, transparent 20%, var(--c-2) 85%); opacity: 0; animation: skyWarm calc(var(--k) * 8) ease-in-out infinite alternate; }
@keyframes skyWarm { to { opacity: .85; } }
.sun { left: 50%; bottom: 24%; width: 26vmin; height: 26vmin; margin-left: -13vmin; border-radius: 50%; background: radial-gradient(circle, #fffbe8 0 30%, var(--c-1) 70%); box-shadow: 0 0 90px 30px color-mix(in srgb, var(--c-1) 55%, transparent); animation: sunRise calc(var(--k) * 8) ease-in-out infinite alternate; }
@keyframes sunRise { from { transform: translateY(26vh) scale(1.15); } to { transform: translateY(-18vh) scale(.9); } }
.cloud { width: 30vmin; height: 8vmin; border-radius: 99px; background: color-mix(in srgb, #fff 80%, var(--c-2)); opacity: .8; animation: drift calc(var(--k) * 40) linear infinite; }
.cloud::before { content: ""; position: absolute; left: 22%; bottom: 40%; width: 45%; height: 140%; border-radius: 50%; background: inherit; }
.c1 { top: 16%; animation-delay: calc(var(--k) * -8); }
.c2 { top: 30%; scale: .7; animation-delay: calc(var(--k) * -26); }
@keyframes drift { from { left: -35vmin; } to { left: 105%; } }
.birds i { top: var(--y); width: 22px; height: 10px; border: 3px solid var(--ink); border-color: var(--ink) transparent transparent; border-radius: 50% 50% 0 0; opacity: .7; animation: fly calc(var(--k) * 13) linear infinite, flap calc(var(--k) * .5) ease-in-out infinite alternate; animation-delay: calc(var(--d) / var(--speed)), 0s; }
@keyframes fly { from { left: -5%; translate: 0 0; } 50% { translate: 0 -3vh; } to { left: 105%; translate: 0 1vh; } }
@keyframes flap { to { scale: 1 .4; } }
.hill { left: -20%; right: -20%; border-radius: 50% 50% 0 0 / 100% 100% 0 0; animation: sway calc(var(--k) * 9) ease-in-out infinite alternate; }
.h3 { bottom: -18%; height: 52%; background: color-mix(in srgb, var(--c-3) 55%, var(--bg-2)); animation-duration: calc(var(--k) * 14); }
.h2 { bottom: -26%; height: 50%; left: -45%; right: 10%; background: color-mix(in srgb, var(--c-3) 78%, var(--bg-1)); }
.h1 { bottom: -30%; height: 46%; left: 15%; right: -40%; background: var(--c-3); animation-duration: calc(var(--k) * 7); }
@keyframes sway { to { translate: 3vw 0; } }
`,
};

/** 2. Windmill: the blades turn, rows of tulips roll past in three bands and clouds drift over. */
const MILL: CssScene = {
  html: `<div class="cloud c1"></div><div class="cloud c2"></div>
<div class="band b3"></div><div class="band b2"></div>
<div class="mill"><i class="door"></i><i class="win"></i></div><div class="hub">${rep(4, (i) => `<i style="--a:${i * 90}deg"></i>`)}<b></b></div>
<div class="band b1"></div>`,
  css: `
.cloud { width: 30vmin; height: 8vmin; border-radius: 99px; background: #fff; opacity: .85; animation: drift calc(var(--k) * 36) linear infinite; }
.cloud::before { content: ""; position: absolute; left: 20%; bottom: 40%; width: 46%; height: 150%; border-radius: 50%; background: inherit; }
.c1 { top: 12%; animation-delay: calc(var(--k) * -10); }
.c2 { top: 26%; scale: .65; animation-delay: calc(var(--k) * -24); }
@keyframes drift { from { left: -35vmin; } to { left: 105%; } }
.band { left: 0; width: 200%; animation: rows calc(var(--k) * var(--t)) linear infinite; }
.b3 { --t: 30; bottom: 22vh; height: 8vh; background: radial-gradient(8px 10px at 50% 60%, var(--c-1) 98%, transparent) 0 0 / 22px 100%, color-mix(in srgb, var(--c-3) 70%, var(--bg-2)); }
.b2 { --t: 20; bottom: 12vh; height: 11vh; background: radial-gradient(12px 15px at 50% 55%, var(--c-2) 98%, transparent) 0 0 / 32px 100%, color-mix(in srgb, var(--c-3) 85%, #000); }
.b1 { --t: 12; bottom: 0; height: 13vh; background: radial-gradient(16px 20px at 50% 50%, var(--c-1) 98%, transparent) 0 0 / 44px 100%, var(--c-3); }
@keyframes rows { to { translate: -50% 0; } }
.mill { left: 64%; bottom: 20vh; width: 16vmin; height: 40vmin; margin-left: -8vmin; clip-path: polygon(22% 0, 78% 0, 100% 100%, 0 100%); background: linear-gradient(90deg, #efe6d4, #fffaf0 50%, #e2d6bf); }
.mill::before { content: ""; position: absolute; left: -10%; right: -10%; top: -14%; height: 22%; background: color-mix(in srgb, var(--c-1) 70%, #000); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.door { left: 38%; bottom: 0; width: 24%; height: 18%; border-radius: 50% 50% 0 0; background: color-mix(in srgb, var(--c-1) 60%, #000); }
.win { left: 40%; top: 36%; width: 20%; height: 12%; border-radius: 50%; background: color-mix(in srgb, var(--c-2) 40%, #fff); }
.hub { left: 64%; bottom: calc(20vh + 37vmin); width: 0; height: 0; animation: turn calc(var(--k) * 6) linear infinite; }
@keyframes turn { to { rotate: 360deg; } }
.hub i { left: -2vmin; top: 0; width: 4vmin; height: 28vmin; transform-origin: 50% 0; rotate: var(--a); background: repeating-linear-gradient(0deg, #6b4e31 0 3px, transparent 3px 14px), repeating-linear-gradient(90deg, #6b4e31 0 3px, color-mix(in srgb, #fff 80%, var(--c-2)) 3px 50%); border: 3px solid #6b4e31; }
.hub b { left: -2.4vmin; top: -2.4vmin; width: 4.8vmin; height: 4.8vmin; border-radius: 50%; background: #4a3522; }
`,
};

/** 3. Paper boat: layered waves roll, the boat rocks over them, and the sun turns into the moon. */
const BOAT: CssScene = {
  html: `<div class="orb"></div><div class="star-field">${rep(30, (i) => `<i style="left:${pc((i * 37) % 100)};top:${pc((i * 53) % 45)};--d:${(i % 7) * -0.6}"></i>`)}</div>
<div class="wave w3"></div><div class="boat"><i class="hull"></i><i class="sail"></i><i class="flag"></i></div><div class="wave w2"></div><div class="wave w1"></div>`,
  css: `
.stage { animation: dusk calc(var(--k) * 16) ease-in-out infinite alternate; }
@keyframes dusk { to { background-color: var(--bg-1); filter: hue-rotate(-12deg) brightness(.75); } }
.orb { left: 70%; top: 14%; width: 18vmin; height: 18vmin; border-radius: 50%; background: var(--c-3); box-shadow: 0 0 60px 10px color-mix(in srgb, var(--c-3) 50%, transparent); animation: orb calc(var(--k) * 16) ease-in-out infinite alternate; }
@keyframes orb { 0% { translate: 0 0; } 45% { translate: 0 40vh; } 55% { translate: 0 40vh; background: #f4f1e6; } 100% { translate: -40vw 0; background: #f4f1e6; box-shadow: inset -4vmin -2vmin 0 color-mix(in srgb, var(--bg-1) 70%, #000); } }
.star-field i { width: 3px; height: 3px; border-radius: 50%; background: #fff; opacity: 0; animation: starsOn calc(var(--k) * 16) ease-in-out infinite alternate, twinkle calc(var(--k) * 2) ease-in-out infinite alternate; animation-delay: 0s, calc(var(--k) * var(--d)); }
@keyframes starsOn { 0%, 55% { opacity: 0; } 100% { opacity: .9; } }
@keyframes twinkle { to { scale: .4; } }
.wave { left: -50%; width: 200%; border-radius: 0; background: radial-gradient(60px 26px at 60px 0, transparent 98%, var(--c)) 0 0 / 120px 100% repeat-x; -webkit-mask: none; animation: roll calc(var(--k) * var(--t)) linear infinite; }
.w1 { --c: var(--c-2); --t: 5; bottom: 0; height: 18%; }
.w2 { --c: color-mix(in srgb, var(--c-2) 80%, #fff); --t: 7; bottom: 8%; height: 18%; animation-direction: reverse; opacity: .85; }
.w3 { --c: color-mix(in srgb, var(--c-2) 55%, #fff); --t: 10; bottom: 16%; height: 16%; opacity: .7; }
@keyframes roll { to { translate: 120px 0; } }
.boat { left: 50%; bottom: 20%; width: 34vmin; height: 26vmin; margin-left: -17vmin; transform-origin: 50% 100%; animation: rock calc(var(--k) * 3.2) ease-in-out infinite alternate, sail calc(var(--k) * 16) ease-in-out infinite alternate; }
@keyframes rock { from { rotate: -7deg; translate: 0 6px; } to { rotate: 7deg; translate: 0 -8px; } }
@keyframes sail { from { left: 30%; } to { left: 66%; } }
.hull { left: 0; right: 0; bottom: 0; height: 32%; background: #fbfaf5; clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%); box-shadow: inset 0 -6px 0 rgba(0,0,0,.08); }
.sail { left: 30%; bottom: 32%; width: 40%; height: 68%; background: linear-gradient(90deg, #fff, #e8e6dc); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.flag { left: 49%; top: -6%; width: 14%; height: 12%; background: var(--c-1); clip-path: polygon(0 0, 100% 50%, 0 100%); animation: wave calc(var(--k) * .6) ease-in-out infinite alternate; transform-origin: 0 50%; }
@keyframes wave { to { scale: .7 1; } }
`,
};

/** 4. Rocket launch: a countdown runs, smoke puffs build, the rocket lifts off and stars streak past. */
const ROCKET: CssScene = (() => {
  const r = rng(44);
  return {
    html: `<div class="streaks">${rep(26, () => `<i style="left:${pc(r.range(0, 100))};--d:${(-r.range(0, 2)).toFixed(2)};--h:${r.int(40, 140)}px"></i>`)}</div>
<div class="count"><span>3</span><span>2</span><span>1</span></div>
<div class="pad"></div><div class="smoke">${rep(9, (i) => `<i style="--x:${(i - 4) * 9}vmin;--d:${(i % 3) * 0.12}"></i>`)}</div>
<div class="rocket"><i class="body"></i><i class="window"></i><i class="fin l"></i><i class="fin r"></i><i class="fire"></i></div>`,
    css: `
.streaks i { top: -20%; width: 2px; height: var(--h); background: linear-gradient(transparent, #fff); opacity: 0; animation: streak calc(var(--k) * .9) linear infinite, streakOn calc(var(--k) * 10) linear infinite; animation-delay: calc(var(--k) * var(--d)), 0s; }
@keyframes streak { to { transform: translateY(130vh); } }
@keyframes streakOn { 0%, 45% { opacity: 0; } 55%, 92% { opacity: .7; } 100% { opacity: 0; } }
.count { left: 50%; top: 22%; width: 0; height: 0; }
.count span { left: -40px; top: -60px; width: 80px; text-align: center; font: 700 96px/1 var(--font-display); color: var(--c-1); opacity: 0; animation: tick calc(var(--k) * 10) linear infinite; }
.count span:nth-child(2) { animation-name: tick2; } .count span:nth-child(3) { animation-name: tick3; }
@keyframes tick { 0% { opacity: 0; scale: 1.6; } 3%, 10% { opacity: 1; scale: 1; } 13%, 100% { opacity: 0; } }
@keyframes tick2 { 0%, 12% { opacity: 0; scale: 1.6; } 15%, 22% { opacity: 1; scale: 1; } 25%, 100% { opacity: 0; } }
@keyframes tick3 { 0%, 24% { opacity: 0; scale: 1.6; } 27%, 34% { opacity: 1; scale: 1; } 37%, 100% { opacity: 0; } }
.pad { left: 50%; bottom: 0; width: 44vmin; height: 7vh; margin-left: -22vmin; background: linear-gradient(var(--c-3), color-mix(in srgb, var(--c-3) 60%, #000)); border-radius: 8px 8px 0 0; }
.smoke { left: 50%; bottom: 5vh; width: 0; height: 0; }
.smoke i { left: -8vmin; top: -8vmin; width: 16vmin; height: 16vmin; border-radius: 50%; background: color-mix(in srgb, #fff 80%, var(--c-3)); opacity: 0; animation: puff calc(var(--k) * 10) ease-out infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes puff { 0%, 30% { opacity: 0; translate: 0 0; scale: .2; } 40% { opacity: .95; } 60% { opacity: .6; translate: var(--x) -2vh; scale: 1.6; } 80%, 100% { opacity: 0; translate: calc(var(--x) * 1.6) -4vh; scale: 2.2; } }
.rocket { left: 50%; bottom: 7vh; width: 14vmin; height: 40vmin; margin-left: -7vmin; animation: launch calc(var(--k) * 10) cubic-bezier(.6,0,.9,.5) infinite; }
@keyframes launch { 0%, 36% { translate: 0 0; } 38% { translate: -2px 0; } 40% { translate: 2px 0; } 42% { translate: 0 -1vh; } 85% { translate: 0 -130vh; } 86%, 100% { translate: 0 60vh; } }
.body { inset: 0 0 12% 0; border-radius: 50% 50% 18% 18% / 34% 34% 10% 10%; background: linear-gradient(90deg, #d8dce3, #fff 40%, #c9ced8); }
.window { left: 30%; top: 26%; width: 40%; height: 13%; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff, var(--c-2) 60%); border: 4px solid var(--c-1); }
.fin { bottom: 8%; width: 40%; height: 26%; background: var(--c-1); }
.fin.l { left: -26%; clip-path: polygon(100% 0, 100% 100%, 0 100%); }
.fin.r { right: -26%; clip-path: polygon(0 0, 100% 100%, 0 100%); }
.fire { left: 22%; bottom: -16%; width: 56%; height: 30%; border-radius: 50% 50% 50% 50% / 30% 30% 70% 70%; background: radial-gradient(circle at 50% 20%, #fff, var(--c-3) 40%, var(--c-1) 75%, transparent); opacity: 0; transform-origin: 50% 0; animation: fire calc(var(--k) * .15) ease-in-out infinite alternate, fireOn calc(var(--k) * 10) linear infinite; }
@keyframes fire { to { scale: .8 1.3; } }
@keyframes fireOn { 0%, 34% { opacity: 0; } 38%, 100% { opacity: 1; } }
`,
  };
})();

/** 5. Flower garden: stems grow, petals open one flower after another, and two bees follow figure-eight paths. */
const GARDEN: CssScene = (() => {
  const flowers = [[18, 46, 0], [36, 58, 0.6], [62, 52, 1.2], [80, 40, 1.8]];
  return {
    html: `<div class="ground"></div>${flowers.map(([x, h, d]) => `<div class="flower" style="left:${x}%;--h:${h}vh;--d:${d}"><i class="stem"></i><i class="leaf"></i><div class="head">${rep(8, (k) => `<i style="--a:${k * 45}deg"></i>`)}<b></b></div></div>`).join("")}
<div class="bee b1"><i></i></div><div class="bee b2"><i></i></div>`,
    css: `
.ground { left: 0; right: 0; bottom: 0; height: 12vh; background: linear-gradient(var(--c-3), color-mix(in srgb, var(--c-3) 70%, #000)); border-radius: 50% 50% 0 0 / 30px 30px 0 0; }
.flower { bottom: 10vh; width: 0; height: var(--h); }
.stem { left: -3px; bottom: 0; width: 6px; height: 100%; background: var(--c-3); transform-origin: 50% 100%; animation: grow calc(var(--k) * 12) ease-out infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes grow { 0% { scale: 1 0; } 25%, 90% { scale: 1 1; } 100% { scale: 1 0; } }
.leaf { left: 0; bottom: 30%; width: 7vmin; height: 3.4vmin; border-radius: 0 100% 0 100%; background: var(--c-3); transform-origin: 0 50%; animation: leaf calc(var(--k) * 12) ease-out infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes leaf { 0%, 15% { scale: 0; } 30%, 90% { scale: 1; rotate: -20deg; } 100% { scale: 0; } }
.head { left: 0; top: 0; width: 0; height: 0; animation: nod calc(var(--k) * 4) ease-in-out infinite alternate; }
@keyframes nod { from { rotate: -6deg; } to { rotate: 6deg; } }
.head i { left: -3.5vmin; top: -9vmin; width: 7vmin; height: 9vmin; border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%; background: linear-gradient(var(--c-1), color-mix(in srgb, var(--c-1) 70%, #fff)); transform-origin: 50% 100%; rotate: var(--a); scale: 0; animation: bloom calc(var(--k) * 12) cubic-bezier(.3,1.5,.5,1) infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes bloom { 0%, 22% { scale: 0; } 34%, 88% { scale: 1; } 100% { scale: 0; } }
.head b { left: -2.6vmin; top: -2.6vmin; width: 5.2vmin; height: 5.2vmin; border-radius: 50%; background: radial-gradient(circle at 35% 35%, #fff3, transparent 50%), var(--c-2); }
.bee { left: 0; top: 0; width: 26px; height: 18px; offset-path: path("M 120 300 C 320 80, 520 520, 720 300 S 1120 80, 920 300 S 320 520, 120 300 Z"); offset-rotate: auto; animation: buzz calc(var(--k) * 9) linear infinite; }
.b2 { offset-path: path("M 300 200 C 500 420, 700 0, 900 200 S 600 420, 300 200 Z"); animation-duration: calc(var(--k) * 6); animation-direction: reverse; }
@keyframes buzz { to { offset-distance: 100%; } }
.bee i { inset: 0; border-radius: 50%; background: repeating-linear-gradient(90deg, var(--c-2) 0 6px, #222 6px 10px); }
.bee i::after { content: ""; position: absolute; left: 6px; top: -10px; width: 12px; height: 12px; border-radius: 50%; background: rgba(255,255,255,.75); animation: wing calc(var(--k) * .08) linear infinite alternate; }
@keyframes wing { to { scale: 1 .3; } }
`,
  };
})();

/** 6. Campfire: three flame layers flicker, sparks float up, the glow breathes and a tent sits in the dark. */
const FIRE: CssScene = (() => {
  const r = rng(66);
  return {
    html: `<div class="stars">${rep(40, () => `<i style="left:${pc(r.range(0, 100))};top:${pc(r.range(0, 55))};--d:${(-r.range(0, 3)).toFixed(2)}"></i>`)}</div>
<div class="tent"><i></i></div><div class="ground"></div><div class="glow"></div>
<div class="logs"><i></i><i></i></div>
<div class="flame f1"></div><div class="flame f2"></div><div class="flame f3"></div>
<div class="sparks">${rep(18, () => `<i style="--x:${r.int(-60, 60)}px;--d:${(-r.range(0, 3)).toFixed(2)}"></i>`)}</div>`,
    css: `
.stars i { width: 2px; height: 2px; border-radius: 50%; background: #fff; animation: tw calc(var(--k) * 2.4) ease-in-out infinite alternate; animation-delay: calc(var(--k) * var(--d)); }
@keyframes tw { from { opacity: .2; } to { opacity: 1; } }
.ground { left: 0; right: 0; bottom: 0; height: 16vh; background: linear-gradient(color-mix(in srgb, var(--c-3) 80%, #000), #000); }
.tent { left: 12%; bottom: 14vh; width: 34vmin; height: 24vmin; background: color-mix(in srgb, var(--c-3) 85%, #fff); clip-path: polygon(50% 0, 100% 100%, 0 100%); }
.tent i { left: 40%; bottom: 0; width: 20%; height: 55%; background: #000; clip-path: polygon(50% 0, 100% 100%, 0 100%); opacity: .6; }
.glow { left: 50%; bottom: 6vh; width: 70vmin; height: 40vmin; margin-left: -35vmin; border-radius: 50%; background: radial-gradient(closest-side, color-mix(in srgb, var(--c-1) 30%, transparent), transparent); animation: breathe calc(var(--k) * 1.6) ease-in-out infinite alternate; }
@keyframes breathe { to { scale: 1.12; opacity: .75; } }
.logs { left: 50%; bottom: 13vh; width: 0; height: 0; }
.logs i { left: -14vmin; top: -2vmin; width: 28vmin; height: 4vmin; border-radius: 2vmin; background: linear-gradient(#8a5a35, #4a2e18); rotate: 14deg; }
.logs i + i { rotate: -14deg; }
.flame { left: 50%; bottom: 14vh; border-radius: 50% 0 50% 50%; rotate: -45deg; transform-origin: 50% 100%; animation: flick calc(var(--k) * .5) ease-in-out infinite alternate; }
.f1 { width: 20vmin; height: 20vmin; margin-left: -10vmin; background: radial-gradient(circle at 60% 40%, var(--c-2), var(--c-1) 70%); box-shadow: 0 0 40px 10px color-mix(in srgb, var(--c-1) 50%, transparent); }
.f2 { width: 13vmin; height: 13vmin; margin-left: -6.5vmin; bottom: 14.5vh; background: radial-gradient(circle at 60% 40%, #fff3c4, var(--c-2) 75%); animation-duration: calc(var(--k) * .38); animation-direction: alternate-reverse; }
.f3 { width: 6vmin; height: 6vmin; margin-left: -3vmin; bottom: 15vh; background: radial-gradient(circle at 60% 40%, #fff, #fff6d8); animation-duration: calc(var(--k) * .3); }
@keyframes flick { 0% { scale: 1 1; translate: 0 0; } 50% { scale: .9 1.1; } 100% { scale: 1.08 .94; translate: 2px -3px; } }
.sparks { left: 50%; bottom: 30vh; width: 0; height: 0; }
.sparks i { left: 0; top: 0; width: 4px; height: 4px; border-radius: 50%; background: var(--c-2); box-shadow: 0 0 8px 2px var(--c-1); animation: spark calc(var(--k) * 3) ease-out infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes spark { 0% { translate: 0 0; opacity: 1; } 100% { translate: var(--x) -40vh; opacity: 0; scale: .3; } }
`,
  };
})();

/** 7. City lights: dusk falls, windows switch on in waves, the moon rises and a shooting star crosses. */
const CITY: CssScene = (() => {
  const r = rng(77);
  const blds = [[2, 14, 30], [15, 12, 42], [26, 16, 26], [41, 10, 48], [50, 15, 34], [64, 12, 44], [75, 13, 28], [87, 12, 38]];
  const html = blds.map(([x, w, h]) => `<div class="bld" style="left:${x}%;width:${w}%;height:${h}vh">${rep(12, () => `<i style="--d:${r.range(0, 6).toFixed(2)}"></i>`)}</div>`).join("");
  return {
    html: `<div class="moon"></div><i class="shoot"></i>${html}`,
    css: `
.stage { animation: night calc(var(--k) * 14) ease-in-out infinite alternate; }
@keyframes night { from { filter: brightness(1.25) saturate(.9); } to { filter: none; } }
.moon { right: 14%; top: 12%; width: 14vmin; height: 14vmin; border-radius: 50%; background: var(--c-3); box-shadow: inset -3vmin -1vmin 0 color-mix(in srgb, var(--c-3) 70%, #000), 0 0 40px 6px color-mix(in srgb, var(--c-3) 40%, transparent); animation: moon calc(var(--k) * 14) ease-in-out infinite alternate; }
@keyframes moon { from { translate: 0 30vh; } to { translate: 0 0; } }
.shoot { left: 10%; top: 10%; width: 120px; height: 2px; background: linear-gradient(90deg, transparent, #fff); rotate: 18deg; opacity: 0; animation: shoot calc(var(--k) * 7) ease-in infinite; }
@keyframes shoot { 0%, 70% { opacity: 0; translate: 0 0; } 74% { opacity: 1; } 84%, 100% { opacity: 0; translate: 50vw 16vh; } }
.bld { bottom: 0; display: grid; grid-template-columns: repeat(3, 1fr); align-content: start; gap: 10px 8px; padding: 14px 10px; background: linear-gradient(var(--c-2), color-mix(in srgb, var(--c-2) 70%, #000)); border-radius: 4px 4px 0 0; }
.bld i { position: relative; height: 14px; border-radius: 2px; background: color-mix(in srgb, var(--c-2) 80%, #000); animation: lamp calc(var(--k) * 8) steps(1) infinite; animation-delay: calc(var(--k) * var(--d) * -1); }
@keyframes lamp { 0% { background: color-mix(in srgb, var(--c-2) 80%, #000); box-shadow: none; } 40% { background: var(--c-1); box-shadow: 0 0 10px color-mix(in srgb, var(--c-1) 70%, transparent); } 85% { background: color-mix(in srgb, var(--c-2) 80%, #000); box-shadow: none; } }
`,
  };
})();

/** 8. Typewriter: keys hammer, three lines type onto the paper one after another, and the paper rolls up. */
const TYPE: CssScene = (() => {
  const lines = ["Halo,", "ada kabar baik", "hari ini."];
  const L = lines.map((t, i) => ({ t, a: 6 + i * 26, b: 6 + i * 26 + 18 }));
  const keyCss = L.map((l, i) => `@keyframes type${i} { 0%, ${l.a}% { width: 0; } ${l.b}%, 92% { width: ${l.t.length}ch; } 100% { width: 0; } }`).join("\n");
  return {
    html: `<div class="paper"><div class="sheet">${L.map((l, i) => `<span class="ln" style="--n:${l.t.length};animation-name:type${i}">${l.t}</span>`).join("")}</div></div>
<div class="tw"><i class="roller"></i><div class="keys">${rep(30, (i) => `<i style="--d:${((i * 7) % 10) * 0.11}"></i>`)}</div></div>`,
    css: `
.paper { left: 72%; bottom: calc(12vh + 22vmin); width: 44vmin; height: 46vmin; margin-left: -22vmin; overflow: hidden; }
.sheet { left: 0; right: 0; bottom: 0; height: 100%; padding: 6vmin 5vmin; background: repeating-linear-gradient(180deg, transparent 0 calc(4.6vmin - 1px), color-mix(in srgb, var(--c-2) 30%, transparent) 4.6vmin), #fffdf6; box-shadow: 0 0 0 1px rgba(0,0,0,.06); animation: roll calc(var(--k) * 12) steps(1) infinite; }
@keyframes roll { 0% { translate: 0 60%; } 30% { translate: 0 45%; } 58% { translate: 0 30%; } 92% { translate: 0 30%; } 100% { translate: 0 60%; } }
.ln { position: relative; display: block; width: 0; height: 4.6vmin; overflow: hidden; white-space: nowrap; font: 600 3.6vmin/4.6vmin "Courier New", monospace; color: var(--c-1); animation-duration: calc(var(--k) * 12); animation-iteration-count: infinite; animation-timing-function: steps(var(--n)); }
${keyCss}
.tw { left: 72%; bottom: 10vh; width: 64vmin; height: 26vmin; margin-left: -32vmin; border-radius: 3vmin 3vmin 2vmin 2vmin; background: linear-gradient(180deg, color-mix(in srgb, var(--c-3) 85%, #fff), var(--c-3)); box-shadow: 0 30px 50px -20px rgba(0,0,0,.5); }
.roller { left: 6%; right: 6%; top: -3vmin; height: 5vmin; border-radius: 3vmin; background: linear-gradient(#333, #111); animation: carriage calc(var(--k) * 12) ease-in-out infinite; }
@keyframes carriage { 0%, 6% { translate: 4vmin 0; } 24% { translate: -4vmin 0; } 30% { translate: 4vmin 0; } 50% { translate: -4vmin 0; } 56% { translate: 4vmin 0; } 76%, 100% { translate: -2vmin 0; } }
.keys { left: 8%; right: 8%; top: 32%; bottom: 12%; display: grid; grid-template-columns: repeat(10, 1fr); gap: 1.2vmin; }
.keys i { position: relative; border-radius: 50%; aspect-ratio: 1; background: radial-gradient(circle at 40% 35%, #fff, #d8d2c4); box-shadow: 0 .6vmin 0 #6a6152; animation: press calc(var(--k) * 1.1) steps(1) infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes press { 0% { translate: 0 .5vmin; box-shadow: 0 .1vmin 0 #6a6152; } 18% { translate: 0 0; box-shadow: 0 .6vmin 0 #6a6152; } }
@media (max-width: 640px) { .paper, .tw { left: 50%; } .paper { height: 34vmin; } }
`,
  };
})();

/** 9. Planet orbits: tilted orbits carry four planets around a glowing sun while a comet streaks across. */
const ORBIT: CssScene = (() => {
  const r = rng(91);
  const P = [[18, 6, 3.2, "--c-2"], [28, 10, 4.4, "--c-1"], [40, 16, 6, "--c-3"], [52, 24, 4, "--c-2"]];
  return {
    html: `<div class="stars">${rep(60, () => `<i style="left:${pc(r.range(0, 100))};top:${pc(r.range(0, 100))};--d:${(-r.range(0, 3)).toFixed(2)}"></i>`)}</div>
<i class="comet"></i><div class="system"><b class="sun"></b>${P.map(([rad, t, s, c], i) => `<div class="orbit" style="--r:${rad}vmin;--t:${t};--d:${-i * 2.3}"><i class="planet${i === 2 ? " ringed" : ""}" style="--s:${s}vmin;--c:var(${c})"></i></div>`).join("")}</div>`,
    css: `
.stars i { width: 2px; height: 2px; border-radius: 50%; background: #fff; animation: tw calc(var(--k) * 3) ease-in-out infinite alternate; animation-delay: calc(var(--k) * var(--d)); }
@keyframes tw { from { opacity: .2; } to { opacity: .9; } }
.system { left: 66%; top: 55%; width: 0; height: 0; transform: rotateX(64deg) rotateZ(-14deg); transform-style: preserve-3d; }
.sun { left: -7vmin; top: -7vmin; width: 14vmin; height: 14vmin; border-radius: 50%; background: radial-gradient(circle, #fff7d6, var(--c-1) 70%); box-shadow: 0 0 60px 20px color-mix(in srgb, var(--c-1) 60%, transparent); transform: rotateZ(14deg) rotateX(-64deg); animation: pulse calc(var(--k) * 2) ease-in-out infinite alternate; }
@keyframes pulse { to { box-shadow: 0 0 90px 34px color-mix(in srgb, var(--c-1) 50%, transparent); } }
.orbit { left: calc(var(--r) * -1); top: calc(var(--r) * -1); width: calc(var(--r) * 2); height: calc(var(--r) * 2); border-radius: 50%; border: 1px dashed color-mix(in srgb, var(--ink) 30%, transparent); transform-style: preserve-3d; animation: orbit calc(var(--k) * var(--t)) linear infinite; animation-delay: calc(var(--k) * var(--d)); }
@keyframes orbit { to { rotate: 360deg; } }
.planet { left: 50%; top: calc(var(--s) / -2); width: var(--s); height: var(--s); margin-left: calc(var(--s) / -2); border-radius: 50%; background: radial-gradient(circle at 30% 30%, color-mix(in srgb, var(--c) 40%, #fff), var(--c) 60%, color-mix(in srgb, var(--c) 50%, #000)); transform: rotateX(-64deg); }
.ringed::after { content: ""; position: absolute; left: -45%; top: 38%; width: 190%; height: 24%; border-radius: 50%; border: 2px solid color-mix(in srgb, var(--c) 60%, #fff); rotate: -18deg; }
.comet { left: -10%; top: 20%; width: 160px; height: 3px; border-radius: 3px; background: linear-gradient(90deg, transparent, #fff); rotate: 12deg; animation: comet calc(var(--k) * 9) ease-in infinite; }
.comet::after { content: ""; position: absolute; right: -4px; top: -3px; width: 9px; height: 9px; border-radius: 50%; background: #fff; box-shadow: 0 0 14px 4px var(--c-2); }
@keyframes comet { 0%, 60% { translate: 0 0; opacity: 0; } 64% { opacity: 1; } 80%, 100% { translate: 120vw 26vh; opacity: 0; } }
`,
  };
})();

/** 10. Banner plane: a small plane loops through three layers of clouds towing a banner and a dotted trail. */
const PLANE: CssScene = {
  html: `<div class="cl l3">${rep(3, (i) => `<i style="left:${i * 36}%"></i>`)}</div><div class="cl l2">${rep(3, (i) => `<i style="left:${10 + i * 34}%"></i>`)}</div>
<div class="flight"><div class="trail"></div><div class="banner"><span>HALO!</span></div><div class="plane"><i class="body"></i><i class="wing"></i><i class="tail"></i><i class="prop"></i></div></div>
<div class="cl l1">${rep(3, (i) => `<i style="left:${5 + i * 38}%"></i>`)}</div><div class="hills"></div>`,
  css: `
.cl { left: 0; width: 200%; height: 100%; animation: clouds calc(var(--k) * var(--t)) linear infinite; }
.cl i { width: 22vmin; height: 7vmin; border-radius: 99px; background: #fff; }
.cl i::before { content: ""; position: absolute; left: 18%; bottom: 40%; width: 50%; height: 160%; border-radius: 50%; background: inherit; }
.l3 { --t: 60; top: 14%; opacity: .55; scale: .6; } .l3 i { top: 0; }
.l2 { --t: 34; top: 34%; opacity: .8; } .l2 i { top: 0; }
.l1 { --t: 18; top: 62%; } .l1 i { top: 0; scale: 1.5; }
@keyframes clouds { to { translate: -50% 0; } }
.hills { left: -10%; right: -10%; bottom: -14vh; height: 30vh; border-radius: 50% 50% 0 0; background: var(--c-3); }
.flight { left: 0; top: 30%; width: 0; height: 0; animation: flyX calc(var(--k) * 12) linear infinite, flyY calc(var(--k) * 4) ease-in-out infinite alternate; }
@keyframes flyX { from { left: -60vw; } to { left: 130vw; } }
@keyframes flyY { from { top: 26%; } to { top: 40%; } }
.plane { left: -12vmin; top: -4vmin; width: 18vmin; height: 8vmin; animation: tilt calc(var(--k) * 4) ease-in-out infinite alternate; }
@keyframes tilt { from { rotate: 6deg; } to { rotate: -6deg; } }
.plane .body { left: 0; top: 25%; width: 100%; height: 50%; border-radius: 40% 60% 60% 40% / 50%; background: var(--c-1); }
.plane .wing { left: 34%; top: -10%; width: 22%; height: 120%; border-radius: 40%; background: color-mix(in srgb, var(--c-1) 70%, #000); }
.plane .tail { left: 0; top: -10%; width: 16%; height: 50%; background: var(--c-1); clip-path: polygon(0 0, 100% 100%, 0 100%); }
.plane .prop { right: -6%; top: 10%; width: 4%; height: 80%; border-radius: 4px; background: #333; animation: prop calc(var(--k) * .1) linear infinite alternate; }
@keyframes prop { to { scale: 1 .1; } }
.banner { left: -48vmin; top: -3vmin; width: 32vmin; height: 7vmin; display: grid; place-items: center; background: var(--c-2); clip-path: polygon(0 0, 100% 10%, 100% 90%, 0 100%, 6% 50%); animation: flutter calc(var(--k) * .7) ease-in-out infinite alternate; }
.banner span { position: static; font: 700 4vmin/1 var(--font-display); letter-spacing: .1em; color: var(--ink); }
.banner::after { content: ""; position: absolute; right: -4vmin; top: 50%; width: 4vmin; height: 1px; background: #333; }
@keyframes flutter { to { skew: 0 -3deg; translate: 0 3px; } }
.trail { left: -110vmin; top: 0; width: 60vmin; height: 4px; background: radial-gradient(circle, #fff 0 2px, transparent 3px) 0 0 / 14px 4px repeat-x; opacity: .8; }
`,
};

export const ANIM_CSS_SPECS: AnimCssSpec[] = [
  {
    id: "anim-css-matahari-terbit",
    title: "Matahari Terbit",
    description: "Animasi CSS murni: matahari naik perlahan di balik tiga lapis bukit, langit menghangat, awan bergeser, dan burung melintas.",
    font: F("Fraunces", "500;600;700"),
    colors: { bg1: "#fde6c8", bg2: "#8ec5e8", c1: "#e2632b", c2: "#ff8a5c", c3: "#4f8a5b", ink: "#1f2a37" },
    labels: ["Matahari", "Langit pagi", "Bukit"],
    kicker: "Selamat pagi",
    heading: "Hari baru, kesempatan baru.",
    text: "Kartu ucapan pagi yang bisa dikirim ke siapa saja. Ganti teks dan warnanya, lalu bagikan tautannya.",
    cta: "Kirim semangat",
    href: "https://wa.me/?text=Selamat%20pagi!",
    capPos: "top",
    still: 9,
    scene: SUNRISE,
  },
  {
    id: "anim-css-kincir-angin",
    title: "Kincir Angin",
    description: "Animasi CSS murni: baling-baling kincir angin berputar, tiga lajur kebun tulip bergulir dengan kecepatan berbeda, dan awan melintas pelan.",
    font: F("Quicksand", "500;600;700"),
    colors: { bg1: "#fdf6e9", bg2: "#9fd1f2", c1: "#e94b5f", c2: "#ffb703", c3: "#5f9e4a", ink: "#1f2a37" },
    labels: ["Tulip & atap", "Tulip kuning", "Ladang"],
    kicker: "Wisata kebun",
    heading: "Angin baik sedang bertiup.",
    text: "Hero animasi untuk agrowisata, toko bunga, atau undangan piknik keluarga akhir pekan.",
    cta: "Pesan tiket",
    href: "#",
    capPos: "left",
    still: 4,
    scene: MILL,
  },

  {
    id: "anim-css-kapal-kertas",
    title: "Kapal Kertas",
    description: "Animasi CSS murni: kapal kertas terombang-ambing di atas tiga lapis ombak, matahari terbenam berganti bulan, dan bintang mulai berkelip.",
    font: F("Lora", "500;600;700"),
    colors: { bg1: "#1d3557", bg2: "#a8dadc", c1: "#e63946", c2: "#457b9d", c3: "#ffd166", ink: "#f8fbff" },
    labels: ["Bendera", "Ombak", "Matahari"],
    kicker: "Bon voyage",
    heading: "Selamat berlayar ke babak baru.",
    text: "Untuk teman yang pindah kota, pensiun, atau memulai perjalanan baru. Ombaknya akan selalu mengantar pulang.",
    cta: "Kirim ucapan",
    href: "https://wa.me/?text=Selamat%20berlayar!",
    capPos: "top",
    still: 5,
    scene: BOAT,
  },
  {
    id: "anim-css-roket-luncur",
    title: "Roket Meluncur",
    description: "Animasi CSS murni: hitung mundur tiga, dua, satu, asap mengepul di landasan, roket meluncur ke atas dan bintang melesat lewat.",
    font: F("Space Grotesk", "500;600;700"),
    colors: { bg1: "#0b1020", bg2: "#1d2a52", c1: "#ff5d5d", c2: "#7fd1ff", c3: "#ffc857", ink: "#f2f5ff" },
    labels: ["Roket & angka", "Jendela", "Api & landasan"],
    kicker: "Peluncuran produk",
    heading: "Kami resmi meluncur.",
    text: "Halaman hitung mundur untuk peluncuran produk, aplikasi, atau toko baru. Satu tombol, satu tujuan.",
    cta: "Daftar lebih dulu",
    href: "#",
    capPos: "left",
    still: 4.6,
    scene: ROCKET,
  },
  {
    id: "anim-css-kebun-bunga",
    title: "Kebun Bunga",
    description: "Animasi CSS murni: batang tumbuh, kelopak mekar bergantian, daun membuka, dan dua lebah terbang mengikuti jalur angka delapan.",
    font: F("Comfortaa", "500;600;700"),
    colors: { bg1: "#fff4ec", bg2: "#d8f0ff", c1: "#ff7aa2", c2: "#ffc93c", c3: "#5aa469", ink: "#2b2d42" },
    labels: ["Kelopak", "Putik & lebah", "Batang & tanah"],
    kicker: "Selamat ulang tahun",
    heading: "Semoga mekar setiap hari.",
    text: "Kartu ucapan yang tumbuh sendiri. Cocok untuk ulang tahun, hari ibu, atau toko bunga.",
    cta: "Pesan buket",
    href: "#",
    capPos: "top",
    still: 6,
    scene: GARDEN,
  },
  {
    id: "anim-css-api-unggun",
    title: "Api Unggun",
    description: "Animasi CSS murni: tiga lapis api unggun berkedip, percikan naik ke langit, cahaya hangat bernapas, dan tenda berdiri di bawah bintang.",
    font: F("Bitter", "500;600;700"),
    colors: { bg1: "#0d0b14", bg2: "#1f1a35", c1: "#ff6a2b", c2: "#ffc94a", c3: "#3a4a3a", ink: "#fff4e6" },
    labels: ["Api luar", "Api dalam & percikan", "Tanah & tenda"],
    kicker: "Malam keakraban",
    heading: "Duduk dekat api, cerita mengalir.",
    text: "Cocok untuk undangan kemah, acara komunitas, atau promo paket camping akhir pekan.",
    cta: "Daftar sekarang",
    href: "#",
    capPos: "top",
    still: 2,
    scene: FIRE,
  },

  {
    id: "anim-css-lampu-kota",
    title: "Lampu Kota",
    description: "Animasi CSS murni: senja turun di atas deretan gedung, jendela menyala bergelombang, bulan naik, dan bintang jatuh melintas.",
    font: F("Outfit", "500;600;700"),
    colors: { bg1: "#0f1530", bg2: "#3a2f6b", c1: "#ffd76a", c2: "#232a4d", c3: "#f4f1de", ink: "#f6f4ff" },
    labels: ["Lampu jendela", "Gedung", "Bulan"],
    kicker: "Selamat malam",
    heading: "Kota tidak pernah benar-benar tidur.",
    text: "Cocok untuk acara malam, promo jam malam, atau kartu ucapan untuk teman di kota lain.",
    cta: "Lihat acara malam ini",
    href: "#",
    capPos: "top",
    still: 6,
    scene: CITY,
  },
  {
    id: "anim-css-pesawat-spanduk",
    title: "Pesawat Spanduk",
    description: "Animasi CSS murni: pesawat kecil terbang menembus tiga lapis awan sambil menarik spanduk dan meninggalkan jejak titik-titik.",
    font: F("Bowlby One", "400"),
    colors: { bg1: "#cfe9ff", bg2: "#7fbfff", c1: "#ef476f", c2: "#ffd166", c3: "#06d6a0", ink: "#14213d" },
    labels: ["Pesawat", "Spanduk", "Bukit"],
    kicker: "Pengumuman",
    heading: "Kabar ini terlalu besar untuk diam.",
    text: "Hero animasi untuk pengumuman, diskon besar, atau pembukaan cabang baru. Ganti teks spanduk lewat kode.",
    cta: "Lihat pengumuman",
    href: "#",
    capPos: "bottom",
    still: 7,
    scene: PLANE,
  },

  {
    id: "anim-css-mesin-ketik",
    title: "Mesin Ketik",
    description: "Animasi CSS murni: tuts mesin ketik menghentak, tiga baris kalimat terketik satu per satu di kertas, dan rol kertas bergeser naik.",
    font: F("Playfair Display", "500;600;700"),
    colors: { bg1: "#efe7da", bg2: "#f8f3ea", c1: "#2b2d42", c2: "#8d99ae", c3: "#3d5a80", ink: "#1b1b1f" },
    labels: ["Tinta", "Garis kertas", "Badan mesin"],
    kicker: "Penulis & penerbit",
    heading: "Setiap cerita dimulai dari satu huruf.",
    text: "Hero animasi untuk penulis, penerbit kecil, atau kelas menulis. Kalimat di kertas bisa diganti di kode.",
    cta: "Baca tulisan terbaru",
    href: "#",
    capPos: "left",
    still: 8,
    scene: TYPE,
  },

  {
    id: "anim-css-orbit-planet",
    title: "Orbit Planet",
    description: "Animasi CSS murni: empat planet mengelilingi matahari pada orbit miring 3D, planet bercincin ikut berputar, dan komet melesat lewat.",
    font: F("Orbitron", "500;600;700"),
    colors: { bg1: "#070a1a", bg2: "#1b1f45", c1: "#ffb347", c2: "#6ec6ff", c3: "#c38bff", ink: "#eef2ff" },
    labels: ["Matahari & tombol", "Planet biru & komet", "Planet bercincin"],
    kicker: "Kelas sains anak",
    heading: "Jelajahi tata surya dari rumah.",
    text: "Hero animasi untuk kelas sains, planetarium, atau acara edukasi. Semua orbit dibuat dengan CSS murni.",
    cta: "Ikut kelas",
    href: "#",
    capPos: "left",
    still: 6,
    scene: ORBIT,
  },

];
