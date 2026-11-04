import type { InviteSpec } from "./invite";
import { C4, DECO_CSS, ISLAM, NADA_A, NADA_B, NADA_C, NADA_D, OPEN_BASE, RSVP_NIKAH, cfg, deco, type Opening } from "./inviteV22";

/* ================================================================== */
/* 15 new invitations (v29). Same engine and features as the v22/v23     */
/* invitations: a transparent cover whose pieces (.op) move when the    */
/* "Buka Undangan" button is pressed. Fifteen new opening animations,   */
/* each one finishing in under 900 ms (the cover is hidden after that). */
/* Every name, address, phone number and bank account is fictional.     */
/* ================================================================== */

const FT = (display: string, script: string, text: string, q: string) => ({ display, script, text, href: `https://fonts.googleapis.com/css2?${q}&display=swap` });

/** Wax seal: the seal cracks in two, then the four envelope flaps fly out to their own edges. */
const WAX: Opening = {
  html: `<div class="op wax w1" aria-hidden="true"></div><div class="op wax w2" aria-hidden="true"></div><div class="op wax w3" aria-hidden="true"></div><div class="op wax w4" aria-hidden="true"></div><b class="op wax-seal" aria-hidden="true"><i></i><i></i></b>`,
  css: `
.wax { inset: 0; transition: transform .5s cubic-bezier(.6,0,.4,1) .28s; }
.w1 { clip-path: polygon(0 0, 100% 0, 50% 50%); background: color-mix(in srgb, var(--cover-bg) 92%, #fff); }
.w2 { clip-path: polygon(100% 0, 100% 100%, 50% 50%); background: color-mix(in srgb, var(--cover-bg) 90%, #000); }
.w3 { clip-path: polygon(0 100%, 100% 100%, 50% 50%); }
.w4 { clip-path: polygon(0 0, 0 100%, 50% 50%); background: color-mix(in srgb, var(--cover-bg) 90%, #000); }
.wax-seal { left: 50%; top: 9vh; width: 84px; height: 84px; margin-left: -42px; z-index: 1; background: none; }
.wax-seal i { position: absolute; inset: 0; border-radius: 50%; background: radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--accent) 60%, #fff), var(--accent) 55%, color-mix(in srgb, var(--accent) 70%, #000)); box-shadow: 0 6px 14px rgba(0,0,0,.3); transition: transform .3s cubic-bezier(.5,0,.5,1), opacity .3s ease; }
.wax-seal i:first-child { clip-path: polygon(0 0, 56% 0, 44% 48%, 54% 100%, 0 100%); }
.wax-seal i:last-child { clip-path: polygon(56% 0, 100% 0, 100% 100%, 54% 100%, 44% 48%); }
.cover.open .wax-seal i:first-child { transform: translate(-26px, 34px) rotate(-28deg); opacity: 0; }
.cover.open .wax-seal i:last-child { transform: translate(26px, 34px) rotate(28deg); opacity: 0; }
.cover.open .w1 { transform: translateY(-102%); }
.cover.open .w2 { transform: translateX(102%); }
.cover.open .w3 { transform: translateY(102%); }
.cover.open .w4 { transform: translateX(-102%); }
.cover-inner { margin-top: 10vh; }
`,
};

/** Camera iris: six blades meet at the center, then swirl outward like an opening aperture. */
const IRIS: Opening = (() => {
  const blades = Array.from({ length: 6 }, (_, i) => `<i style="--a:${i * 60}deg"></i>`).join("");
  return {
    html: `<div class="op iris" aria-hidden="true">${blades}</div>`,
    css: `
.iris { inset: 0; overflow: hidden; background: none; }
.iris i { position: absolute; left: 50%; top: 50%; width: 220vmax; height: 220vmax; transform-origin: 0 0; transform: rotate(var(--a)) translate(-110vmax, 0); background: var(--cover-bg); border-top: 2px solid color-mix(in srgb, var(--accent) 55%, transparent); transition: transform .7s cubic-bezier(.65,0,.35,1); }
.iris i:nth-child(odd) { background: color-mix(in srgb, var(--cover-bg) 90%, #fff); }
.cover.open .iris i { transform: rotate(calc(var(--a) + 50deg)) translate(-110vmax, 80vmax); }
`,
  };
})();

/** Sky lanterns: seven strips each carrying a glowing lantern float up at their own pace. */
const LANTERN: Opening = (() => {
  const n = 7;
  const strips = Array.from({ length: n }, (_, i) => `<i style="--l:${((i * 100) / n).toFixed(3)}%;--d:${[0.12, 0.28, 0.04, 0.2, 0.08, 0.3, 0.16][i]}s;--y:${[62, 74, 58, 80, 66, 70, 60][i]}%"></i>`).join("");
  return {
    html: `<div class="op lan" aria-hidden="true">${strips}</div>`,
    css: `
.lan { inset: 0; background: none; }
.lan i { position: absolute; top: 0; bottom: 0; left: var(--l); width: calc(100% / ${n} + 1px); background: linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 80%, #000), var(--cover-bg)); transition: transform .55s cubic-bezier(.55,0,.6,1) var(--d); }
.lan i::after { content: ""; position: absolute; left: 50%; top: var(--y); width: 26px; height: 34px; margin-left: -13px; border-radius: 10px 10px 6px 6px; background: radial-gradient(circle at 50% 70%, #fff6c8, var(--accent) 60%, color-mix(in srgb, var(--accent) 60%, #000)); box-shadow: 0 0 22px 6px color-mix(in srgb, var(--accent) 55%, transparent); animation: lanBob 2.6s ease-in-out infinite alternate; }
@keyframes lanBob { to { transform: translateY(-10px); } }
.cover.open .lan i { transform: translateY(-112vh); }
`,
  };
})();

/** Tear-off calendar: three pages flip up from the binding one after another. */
const CAL: Opening = {
  html: `<div class="op tear tp3" aria-hidden="true"></div><div class="op tear tp2" aria-hidden="true"></div><div class="op tear tp1" aria-hidden="true"></div><b class="op tear-ring" aria-hidden="true"></b>`,
  css: `
.tear { inset: 0; transform-origin: 50% 0; transition: transform .38s cubic-bezier(.55,0,.6,1) var(--d), opacity .2s ease calc(var(--d) + .2s); }
.tear::before { content: ""; position: absolute; left: 6%; right: 6%; top: 18vh; bottom: 6vh; border: 1px solid color-mix(in srgb, var(--cover-ink) 18%, transparent); border-radius: 8px; }
.tp1 { --d: 0s; background: var(--cover-bg); }
.tp2 { --d: .18s; background: color-mix(in srgb, var(--cover-bg) 94%, #000); }
.tp3 { --d: .36s; background: color-mix(in srgb, var(--cover-bg) 88%, #000); }
.tear-ring { left: 0; right: 0; top: 0; height: 26px; z-index: 1; background: radial-gradient(circle at 50% 60%, color-mix(in srgb, var(--cover-bg) 40%, #000) 5px, transparent 6px) 0 0 / 44px 26px repeat-x, color-mix(in srgb, var(--accent) 80%, #000); transition: transform .3s ease .5s; }
.cover.open .tear { transform: perspective(1200px) rotateX(100deg); opacity: 0; }
.cover.open .tear-ring { transform: translateY(-110%); }
`,
};

/** Woven mat: horizontal and vertical strips are pulled out of the weave in opposite directions. */
const WEAVE: Opening = (() => {
  const h = Array.from({ length: 6 }, (_, i) => `<i class="wh" style="--t:${(i * 100) / 6}%;--s:${i % 2 ? 1 : -1};--d:${(i * 0.03).toFixed(2)}s"></i>`).join("");
  const v = Array.from({ length: 6 }, (_, i) => `<i class="wv-v" style="--l:${(i * 100) / 6}%;--s:${i % 2 ? 1 : -1};--d:${(0.18 + i * 0.03).toFixed(2)}s"></i>`).join("");
  return {
    html: `<div class="op wv" aria-hidden="true">${v}${h}</div>`,
    css: `
.wv { inset: 0; background: none; }
.wv i { position: absolute; transition: transform .5s cubic-bezier(.6,0,.4,1) var(--d); }
.wh { left: 0; right: 0; top: var(--t); height: calc(100% / 6 + 1px); background: repeating-linear-gradient(90deg, var(--cover-bg) 0 12%, transparent 12% 16.66%), linear-gradient(transparent 46%, color-mix(in srgb, var(--accent) 30%, transparent) 50%, transparent 54%); }
.wv-v { top: 0; bottom: 0; left: var(--l); width: calc(100% / 6 + 1px); background: color-mix(in srgb, var(--cover-bg) 86%, #000); }
.cover.open .wh { transform: translateX(calc(var(--s) * 104%)); }
.cover.open .wv-v { transform: translateY(calc(var(--s) * 104%)); }
`,
  };
})();

/** Split temple gate: both stepped halves sink a little, then slide apart. */
const CANDI: Opening = {
  html: `<div class="op candi cd-l" aria-hidden="true"></div><div class="op candi cd-r" aria-hidden="true"></div><div class="op cd-sky" aria-hidden="true"></div>`,
  css: `
.candi { top: 0; bottom: 0; width: 50%; background: repeating-linear-gradient(180deg, transparent 0 34px, color-mix(in srgb, var(--cover-bg) 80%, #000) 34px 38px), var(--cover-bg); }
.cd-l { left: 0; clip-path: polygon(0 0, 62% 0, 62% 6%, 76% 6%, 76% 13%, 88% 13%, 88% 21%, 100% 21%, 100% 100%, 0 100%); }
.cd-r { right: 0; clip-path: polygon(38% 0, 100% 0, 100% 100%, 0 100%, 0 21%, 12% 21%, 12% 13%, 24% 13%, 24% 6%, 38% 6%); }
.cd-sky { inset: 0; z-index: -1; background: radial-gradient(40% 30% at 50% 22%, color-mix(in srgb, var(--accent) 70%, #fff), transparent), linear-gradient(180deg, color-mix(in srgb, var(--accent) 45%, var(--cover-bg)), var(--cover-bg) 60%); transition: opacity .3s ease .45s; }
.cover.open .cd-sky { opacity: 0; }
.cover.open .cd-l { animation: cdL .8s cubic-bezier(.6,0,.4,1) forwards; }
.cover.open .cd-r { animation: cdR .8s cubic-bezier(.6,0,.4,1) forwards; }
@keyframes cdL { 35% { transform: translateY(3%); } 100% { transform: translate(-106%, 3%); } }
@keyframes cdR { 35% { transform: translateY(3%); } 100% { transform: translate(106%, 3%); } }
`,
};

/** Flip tiles: a 6 × 8 grid of tiles turns edge-on in a diagonal wave from the top left. */
const TILES: Opening = (() => {
  const C = 6, R = 8;
  const tiles = Array.from({ length: C * R }, (_, k) => { const c = k % C, r = Math.floor(k / C); return `<i style="--x:${((c * 100) / C).toFixed(3)}%;--y:${((r * 100) / R).toFixed(3)}%;--d:${((c + r) * 0.032).toFixed(3)}s"></i>`; }).join("");
  return {
    html: `<div class="op tiles" aria-hidden="true">${tiles}</div>`,
    css: `
.tiles { inset: 0; background: none; perspective: 900px; }
.tiles i { position: absolute; left: var(--x); top: var(--y); width: calc(100% / ${C} + 1px); height: calc(100% / ${R} + 1px); background: var(--cover-bg); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--accent) 22%, transparent); transition: transform .4s cubic-bezier(.5,0,.5,1) var(--d), opacity .1s linear calc(var(--d) + .3s); }
.tiles i:nth-child(odd) { background: color-mix(in srgb, var(--cover-bg) 93%, #fff); }
.cover.open .tiles i { transform: rotateY(90deg) rotateX(20deg); opacity: 0; }
`,
  };
})();

/** Wooden window shutters with louvers swing out toward the viewer; a beam of light falls in. */
const SHUT: Opening = {
  html: `<div class="op shut sh-l" aria-hidden="true"></div><div class="op shut sh-r" aria-hidden="true"></div><b class="op sh-beam" aria-hidden="true"></b>`,
  css: `
.shut { top: 0; bottom: 0; width: 50%; background: repeating-linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 86%, #000) 0 3px, var(--cover-bg) 3px 18px, color-mix(in srgb, var(--cover-bg) 90%, #fff) 18px 22px); border: 10px solid color-mix(in srgb, var(--cover-bg) 78%, #000); transition: transform .62s cubic-bezier(.5,0,.3,1), opacity .2s ease .55s; backface-visibility: hidden; }
.sh-l { left: 0; transform-origin: 0 50%; }
.sh-r { right: 0; transform-origin: 100% 50%; }
.sh-beam { left: 20%; right: 20%; top: -10%; bottom: -10%; z-index: 0; background: linear-gradient(115deg, transparent 30%, color-mix(in srgb, var(--accent) 40%, transparent) 50%, transparent 70%); opacity: 0; transition: opacity .3s ease .2s; pointer-events: none; }
.cover.open .sh-l { transform: perspective(1100px) rotateY(-112deg); opacity: 0; }
.cover.open .sh-r { transform: perspective(1100px) rotateY(112deg); opacity: 0; }
.cover.open .sh-beam { opacity: 1; }
`,
};

/** Layer cake: five horizontal layers slide out alternately left and right, top layer first. */
const LAPIS: Opening = (() => {
  const shades = ["92%, #fff", "100%, #000", "90%, #000", "96%, #fff", "86%, #000"];
  const layers = shades.map((s, i) => `<i style="--t:${i * 20}%;--s:${i % 2 ? 1 : -1};--d:${(i * 0.08).toFixed(2)}s;--c:color-mix(in srgb, var(--cover-bg) ${s})"></i>`).join("");
  return {
    html: `<div class="op lapis" aria-hidden="true">${layers}</div>`,
    css: `
.lapis { inset: 0; background: none; }
.lapis i { position: absolute; left: 0; right: 0; top: var(--t); height: calc(20% + 1px); background: var(--c); border-bottom: 6px solid color-mix(in srgb, var(--accent) 70%, #fff); transition: transform .45s cubic-bezier(.6,0,.4,1) var(--d); }
.lapis i:first-child::before { content: ""; position: absolute; left: 0; right: 0; bottom: -14px; height: 14px; background: radial-gradient(circle at 50% 0, color-mix(in srgb, var(--accent) 70%, #fff) 9px, transparent 10px) 0 0 / 36px 14px repeat-x; }
.cover.open .lapis i { transform: translateX(calc(var(--s) * 104%)); }
`,
  };
})();

/** Balloon pop: the cover is a cluster of balloons that swell and pop one after another. */
const POP: Opening = (() => {
  const B = [[12, 18, 34, 0], [44, 8, 40, 0.1], [78, 20, 36, 0.05], [24, 52, 42, 0.18], [62, 48, 46, 0.12], [90, 62, 34, 0.24], [8, 84, 38, 0.28], [46, 86, 44, 0.2], [80, 92, 40, 0.32]];
  const balls = B.map(([x, y, s, d], i) => `<i style="--x:${x}%;--y:${y}%;--s:${s}vmax;--d:${d}s;--c:var(--c${(i % 4) + 1})"></i>`).join("");
  return {
    html: `<div class="op pop" aria-hidden="true">${balls}</div>`,
    css: `
.pop { inset: 0; overflow: hidden; transition: opacity .25s ease .5s; }
.pop i { position: absolute; left: var(--x); top: var(--y); width: var(--s); height: calc(var(--s) * 1.15); margin: calc(var(--s) * -.575) 0 0 calc(var(--s) * -.5); border-radius: 50%; background: radial-gradient(circle at 32% 28%, rgba(255,255,255,.65), transparent 22%), var(--c); opacity: .9; transition: transform .28s cubic-bezier(.3,0,.6,1.6) var(--d), opacity .12s linear calc(var(--d) + .24s); }
.cover.open .pop i { transform: scale(1.35); opacity: 0; }
.cover.open .pop { opacity: 0; }
`,
  };
})();

/** Postcard: the card flips over to show its stamped back, shrinks and drops into the mailbox below. */
const PCARD: Opening = {
  html: `<div class="op pcard" aria-hidden="true"><i class="pc-front"></i><i class="pc-back"><b></b></i></div>`,
  css: `
.pcard { inset: 0; background: none; transform-style: preserve-3d; transition: transform .8s cubic-bezier(.6,0,.4,1); }
.pcard i { position: absolute; inset: 0; backface-visibility: hidden; }
.pc-front { background: repeating-linear-gradient(135deg, var(--accent) 0 14px, var(--cover-bg) 14px 28px, color-mix(in srgb, var(--accent) 60%, #2b5fb5) 28px 42px, var(--cover-bg) 42px 56px) 0 0 / 100% 14px no-repeat, repeating-linear-gradient(135deg, var(--accent) 0 14px, var(--cover-bg) 14px 28px, color-mix(in srgb, var(--accent) 60%, #2b5fb5) 28px 42px, var(--cover-bg) 42px 56px) 0 100% / 100% 14px no-repeat, var(--cover-bg); }
.pc-back { transform: rotateY(180deg); background: linear-gradient(90deg, transparent 49.8%, color-mix(in srgb, var(--cover-ink) 30%, transparent) 50%, transparent 50.2%), color-mix(in srgb, var(--cover-bg) 94%, #fff); }
.pc-back b { position: absolute; right: 8%; top: 8%; width: 80px; height: 96px; border: 4px dotted color-mix(in srgb, var(--accent) 80%, #000); background: color-mix(in srgb, var(--accent) 35%, var(--cover-bg)); }
.cover.open .pcard { transform: perspective(1400px) translateY(115vh) rotateY(180deg) scale(.4); }
`,
};

/** Shattered glass: eight shards crack apart and fall away under gravity, each with its own spin. */
const SHARD: Opening = (() => {
  const P = ["0 0, 46% 0, 38% 34%", "46% 0, 100% 0, 100% 22%, 52% 40%, 38% 34%", "0 0, 38% 34%, 30% 62%, 0 54%", "38% 34%, 52% 40%, 58% 64%, 30% 62%", "52% 40%, 100% 22%, 100% 70%, 58% 64%", "0 54%, 30% 62%, 22% 100%, 0 100%", "30% 62%, 58% 64%, 66% 100%, 22% 100%", "58% 64%, 100% 70%, 100% 100%, 66% 100%"];
  const R = [-18, 22, -26, 14, 30, -12, 18, -24];
  const shards = P.map((p, i) => `<i style="clip-path:polygon(${p});--r:${R[i]}deg;--d:${(0.06 * ((i * 3) % 8)).toFixed(2)}s;--x:${(i % 2 ? 1 : -1) * (6 + i * 2)}vw"></i>`).join("");
  return {
    html: `<div class="op shard" aria-hidden="true">${shards}</div>`,
    css: `
.shard { inset: 0; background: none; }
.shard i { position: absolute; inset: 0; background: linear-gradient(135deg, color-mix(in srgb, var(--cover-bg) 88%, #fff), var(--cover-bg) 45%, color-mix(in srgb, var(--cover-bg) 85%, #000)); filter: drop-shadow(0 0 1px color-mix(in srgb, var(--accent) 80%, #fff)); transition: transform .5s cubic-bezier(.55,0,.9,.6) var(--d); }
.cover.open .shard i { transform: translate(var(--x), 115vh) rotate(var(--r)); }
`,
  };
})();

/** Honey drip: the cover slides down while its top edge hangs in uneven drips. */
const DRIP: Opening = {
  html: `<div class="op drip" aria-hidden="true"><i></i></div>`,
  css: `
.drip { inset: 0; background: linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 92%, #fff), var(--cover-bg) 30%); transition: transform .7s cubic-bezier(.65,0,.55,1) .1s; }
.drip i { position: absolute; left: 0; right: 0; top: -70px; height: 72px; background: radial-gradient(18px 34px at 6% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(14px 52px at 19% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(22px 28px at 33% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(12px 62px at 47% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(20px 40px at 61% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(15px 30px at 75% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(18px 56px at 88% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent), radial-gradient(14px 36px at 98% 100%, color-mix(in srgb, var(--cover-bg) 92%, #fff) 98%, transparent); transform: scaleY(-1); transform-origin: 50% 100%; opacity: 0; transition: opacity .1s; }
.cover.open .drip i { opacity: 1; }
.cover.open .drip { transform: translateY(112%); }
`,
};

/** Folded letter: the top half folds down onto the bottom half, then the letter flies off to the right. */
const FOLD: Opening = {
  html: `<div class="op fold fd-b" aria-hidden="true"></div><div class="op fold fd-t" aria-hidden="true"></div>`,
  css: `
.fold { left: 0; right: 0; height: 50%; background: repeating-linear-gradient(180deg, transparent 0 31px, color-mix(in srgb, var(--cover-ink) 10%, transparent) 31px 32px), var(--cover-bg); }
.fd-t { top: 0; transform-origin: 50% 100%; transition: transform .42s cubic-bezier(.5,0,.4,1); backface-visibility: hidden; box-shadow: 0 1px 0 color-mix(in srgb, var(--cover-ink) 18%, transparent); }
.fd-b { bottom: 0; transition: transform .38s cubic-bezier(.6,0,.4,1) .42s; }
.cover.open .fd-t { transform: perspective(1400px) rotateX(-180deg); }
.cover.open .fd-b { transform: translateX(110%) rotate(8deg); }
`,
};

/** Bead curtain: strings of beads part from the center outward, swaying as they go. */
const BEAD: Opening = (() => {
  const n = 12;
  const strings = Array.from({ length: n }, (_, i) => { const off = i - (n - 1) / 2; return `<i style="--l:${((i * 100) / n).toFixed(3)}%;--x:${(off < 0 ? -1 : 1) * (60 + Math.abs(off) * 8)}vw;--r:${(off < 0 ? 1 : -1) * 9}deg;--d:${((n / 2 - Math.abs(off)) * 0.05).toFixed(2)}s"></i>`; }).join("");
  return {
    html: `<div class="op bead" aria-hidden="true">${strings}</div>`,
    css: `
.bead { inset: 0; background: none; }
.bead i { position: absolute; top: -2%; bottom: -2%; left: var(--l); width: calc(100% / ${n} + 1px); transform-origin: 50% 0; background: radial-gradient(circle at 50% 50%, color-mix(in srgb, var(--accent) 80%, #fff) 0 7px, transparent 8px) 50% 0 / 100% 22px, linear-gradient(90deg, transparent 49%, color-mix(in srgb, var(--accent) 60%, transparent) 49% 51%, transparent 51%), var(--cover-bg); transition: transform .55s cubic-bezier(.6,0,.4,1) var(--d); }
.bead i:nth-child(even) { background-color: color-mix(in srgb, var(--cover-bg) 92%, #000); }
.cover.open .bead i { transform: translateX(var(--x)) rotate(var(--r)); }
`,
  };
})();

const STAR = `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="M50 6l5 39 39 5-39 5-5 39-5-39-39-5 39-5z"/><circle cx="82" cy="18" r="3"/><circle cx="20" cy="80" r="3"/></g></svg>`;
const RINGS = `<svg viewBox="0 0 120 80" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="4"><circle cx="45" cy="44" r="26"/><circle cx="75" cy="44" r="26"/></g><path d="M45 12l5-8h-10z" fill="currentColor"/></svg>`;
const MOON = `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><path d="M62 10a40 40 0 1 0 28 62A34 34 0 1 1 62 10z" fill="currentColor"/><circle cx="80" cy="22" r="3" fill="currentColor"/></svg>`;
const SOFT = `
.cover-inner { padding: 26px 22px; border-radius: 22px; background: color-mix(in srgb, var(--cover-bg) 74%, transparent); }
.title { font-family: var(--font-display); color: var(--primary); }
`;

export const INVITE_SPECS_V29: InviteSpec[] = [
  {
    id: "undangan-nikah-segel-lilin",
    kind: "nikah",
    title: "Undangan Pernikahan Dimas & Anggun",
    description: "Undangan pernikahan bergaya surat antik merah marun: saat dibuka, segel lilin retak menjadi dua, lalu keempat lipatan amplop terlempar ke tepi layar.",
    theme: "#6d1f2b",
    fonts: FT("Playfair Display", "Pinyon Script", "Lora", "family=Playfair+Display:wght@500;700&family=Pinyon+Script&family=Lora:wght@400;600"),
    colors: { bg: "#fbf6f0", surface: "#f3e7dc", ink: "#2c1a1c", inkSoft: "#6b5153", primary: "#6d1f2b", onPrimary: "#fbefd9", accent: "#b8862f", line: "#eadacb", coverBg: "#f1e2cc", coverInk: "#4a1520", ...C4("#8e2a3a", "#b8862f", "#f1e2cc", "#4f6b4a") },
    ornament: WAX.html,
    css: OPEN_BASE + WAX.css + SOFT + `
.cover h1 { color: var(--primary); }
.account { background: linear-gradient(135deg, var(--primary), #3a0f17); }
`,
    config: cfg({
      id: "nikah-dimas-anggun", judul: "Pernikahan", namaSampul: "Dimas & Anggun", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Kedua Mempelai",
      pembuka: "Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:",
      tokoh: [
        { panggilan: "Dimas", nama: "Dimas Aryo Wicaksono", keterangan: "Putra Bapak Bambang Wicaksono dan Ibu Sri Rahayu" },
        { panggilan: "Anggun", nama: "Anggun Puspita Sari", keterangan: "Putri Bapak Joko Santoso dan Ibu Endang Lestari" },
      ],
      kutipan: { teks: "Dan Kami ciptakan kamu berpasang-pasangan.", sumber: "QS. An-Naba: 8" },
      acara: [
        { nama: "Akad Nikah", mulai: "2027-05-22T08:00:00+07:00", selesai: "2027-05-22T10:00:00+07:00", tempat: "Masjid Al-Hikmah", alamat: "Jl. Diponegoro No. 40, Klaten" },
        { nama: "Resepsi", mulai: "2027-05-22T11:00:00+07:00", selesai: "2027-05-22T14:00:00+07:00", tempat: "Pendopo Ndalem Wicaksono", alamat: "Jl. Pemuda Selatan No. 9, Klaten" },
      ],
      galeri: ["Surat pertama", "Kencan di alun-alun", "Lamaran", "Foto pranikah di kebun teh", "Seserahan"],
      ucapan: [["Bude Ratmi", "Sakinah mawaddah warahmah, Nak."], ["Teman SMA Anggun", "Akhirnya! Bahagia selalu kalian berdua."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa restu Anda adalah karunia bagi kami. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank Mandiri", nomor: "1370 0021 4455", atasNama: "Dimas Aryo Wicaksono" }, { bank: "Bank BRI", nomor: "0089 0102 3344 507", atasNama: "Anggun Puspita Sari" }], alamatKado: "Jl. Pemuda Selatan No. 9, Klaten 57411" },
      wa: "6281200000206", namaAcara: "pernikahan Dimas & Anggun", templat: RSVP_NIKAH,
      penutup: "Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Wicaksono dan Keluarga Santoso",
      nada: NADA_A, tempo: 600, konfeti: ["#8e2a3a", "#b8862f", "#f1e2cc"],
    }),
  },
  {
    id: "undangan-nikah-lensa-kamera",
    kind: "nikah",
    title: "Undangan Pernikahan Bayu & Citra",
    description: "Undangan pernikahan monokrom untuk pasangan fotografer: enam bilah diafragma lensa bertemu di tengah, lalu berputar terbuka seperti kamera yang siap memotret.",
    theme: "#1d1d1f",
    fonts: FT("DM Serif Display", "Great Vibes", "DM Sans", "family=DM+Serif+Display&family=Great+Vibes&family=DM+Sans:wght@400;600"),
    colors: { bg: "#f6f5f2", surface: "#ebe9e4", ink: "#1d1d1f", inkSoft: "#5d5c60", primary: "#1d1d1f", onPrimary: "#f6f5f2", accent: "#d9a441", line: "#dedbd4", coverBg: "#1d1d1f", coverInk: "#f6f5f2", ...C4("#3a3a3d", "#d9a441", "#f6f5f2", "#8a8a8f") },
    ornament: IRIS.html,
    css: OPEN_BASE + IRIS.css + SOFT + `
.cover h1 { color: var(--accent); letter-spacing: .02em; }
.photo, .avatar { filter: grayscale(1) contrast(1.05); }
`,
    config: cfg({
      id: "nikah-bayu-citra", judul: "Pernikahan", namaSampul: "Bayu & Citra", tamuBawaan: "Kawan", salam: "Halo, kawan!", judulProfil: "Di Depan dan Di Balik Lensa",
      pembuka: "Setelah ribuan foto orang lain, akhirnya kami berdiri di depan kamera untuk hari kami sendiri:",
      tokoh: [
        { panggilan: "Bayu", nama: "Bayu Satria Nugraha", keterangan: "Putra Bapak Hadi Nugraha dan Ibu Wulan Sari" },
        { panggilan: "Citra", nama: "Citra Ayu Pramesti", keterangan: "Putri Bapak Agus Pramono dan Ibu Dian Kartika" },
      ],
      kutipan: { teks: "Foto terbaik selalu diambil saat kita lupa sedang difoto.", sumber: "Catatan studio kami" },
      acara: [{ nama: "Pemberkatan & Resepsi Taman", mulai: "2027-10-09T15:00:00+07:00", selesai: "2027-10-09T20:00:00+07:00", tempat: "Taman Galeri Cahaya", alamat: "Jl. Ciumbuleuit No. 120, Bandung" }],
      teks: { judulHitungMundur: "Hitung Mundur ke Jepretan Pertama", judulGaleri: "Rol Film Kami", pengantarGaleri: "Diambil dengan kamera film, dicuci sendiri." },
      galeri: ["Kamar gelap", "Hunting di Braga", "Lamaran di studio", "Pranikah hitam putih", "Polaroid keluarga"],
      ucapan: [["Klub Foto Kampus", "Akhirnya gantian difoto! Selamat, Bayu dan Citra."], ["Tante Mira", "Semoga langgeng dan selalu fokus pada yang penting."]],
      amplop: { judul: "Kado Digital", pengantar: "Kehadiran Anda sudah cukup. Bila ingin memberi kado:", rekening: [{ bank: "Bank BCA", nomor: "2810 4455 66", atasNama: "Citra Ayu Pramesti" }], alamatKado: "Jl. Ciumbuleuit No. 120, Bandung 40131" },
      wa: "6281200000207", namaAcara: "pernikahan Bayu & Citra", pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
      penutup: "Datanglah, dan biarkan kami memotret senyum Anda untuk album kami.", salamPenutup: "", keluarga: "Keluarga Nugraha dan Keluarga Pramono",
      nada: NADA_B, tempo: 520, konfeti: ["#d9a441", "#f6f5f2", "#3a3a3d"],
    }),
  },
  {
    id: "undangan-ultah-60-lampion",
    kind: "ultah",
    title: "Undangan Syukuran 60 Tahun Oma Lies",
    description: "Undangan syukuran ulang tahun ke-60 bernuansa malam biru: tujuh lajur sampul membawa lampion yang menyala lalu terbang ke langit satu per satu.",
    theme: "#16224a",
    fonts: FT("Cinzel", "Tangerine", "Nunito Sans", "family=Cinzel:wght@500;700&family=Tangerine:wght@700&family=Nunito+Sans:wght@400;700"),
    colors: { bg: "#f7f5ef", surface: "#ece8dc", ink: "#172036", inkSoft: "#525b70", primary: "#16224a", onPrimary: "#ffe6a8", accent: "#f2a93b", line: "#e0dbcc", coverBg: "#16224a", coverInk: "#fff1d0", ...C4("#f2a93b", "#d9573b", "#ffe6a8", "#3a5ba0") },
    ornament: LANTERN.html + deco("moon", MOON),
    css: OPEN_BASE + LANTERN.css + DECO_CSS + SOFT + `
.moon { right: 8vw; top: 6vh; width: 60px; color: #ffe6a8; }
.cover h1 { color: var(--accent); }
`,
    config: cfg({
      id: "ultah-oma-lies-60", judul: "Syukuran 60 Tahun", namaSampul: "Oma Lies", tamuBawaan: "Keluarga dan Sahabat", salam: "Salam sejahtera,", judulProfil: "Yang Berulang Tahun",
      pembuka: "Enam puluh tahun penuh kasih. Mari bersama-sama mengucap syukur untuk Oma kami tercinta:",
      tokoh: [{ panggilan: "Oma Lies", nama: "Elisabeth Lestari Wibowo", keterangan: "Ibu dari tiga anak, oma dari tujuh cucu" }],
      kutipan: { teks: "Rambut putih adalah mahkota yang indah.", sumber: "Amsal 16:31" },
      acara: [{ nama: "Ibadah Syukur & Makan Malam", mulai: "2027-03-27T17:30:00+07:00", selesai: "2027-03-27T21:00:00+07:00", tempat: "Taman Belakang Rumah Keluarga", alamat: "Jl. Kenanga No. 12, Salatiga" }],
      teks: { judulHitungMundur: "Lampion Diterbangkan Dalam", judulAcara: "Malam Syukur", judulGaleri: "Enam Dekade Oma", judulUcapan: "Ucapan untuk Oma" },
      galeri: ["Oma muda, 1985", "Pernikahan Oma dan Opa", "Rumah Salatiga", "Cucu pertama", "Ulang tahun ke-50"],
      ucapan: [["Cucu-cucu", "Selamat ulang tahun, Oma! Kami sayang Oma."], ["Gereja Sion", "Tuhan memberkati Oma Lies selalu."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Tanpa kado pun Oma sudah bahagia. Bila ingin, donasi akan diteruskan ke panti wreda:", rekening: [{ bank: "Bank BCA", nomor: "0123 9876 54", atasNama: "Yayasan Kasih Lansia" }], alamatKado: "" },
      wa: "6281200000208", namaAcara: "syukuran 60 tahun Oma Lies", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      penutup: "Terima kasih telah menjadi bagian dari perjalanan Oma.", salamPenutup: "Tuhan memberkati.", keluarga: "Anak, menantu, dan cucu",
      nada: NADA_D, tempo: 640, konfeti: ["#f2a93b", "#ffe6a8", "#d9573b"],
    }),
  },
  {
    id: "undangan-reuni-kalender-sobek",
    kind: "reuni",
    title: "Undangan Reuni Perak Angkatan 2002",
    description: "Undangan reuni 25 tahun bergaya kalender sobek: tiga lembar kalender tersobek ke atas satu per satu sebelum undangan terlihat.",
    theme: "#20515a",
    fonts: FT("Righteous", "Caveat", "Work Sans", "family=Righteous&family=Caveat:wght@600&family=Work+Sans:wght@400;600"),
    colors: { bg: "#f6f3ea", surface: "#ebe5d4", ink: "#1b2a2e", inkSoft: "#566468", primary: "#20515a", onPrimary: "#fff4d6", accent: "#e2603b", line: "#ddd5c0", coverBg: "#fffaf0", coverInk: "#20515a", ...C4("#e2603b", "#20515a", "#f3c45a", "#8fb9a8") },
    ornament: CAL.html,
    css: OPEN_BASE + CAL.css + `
.cover h1 { font-family: var(--font-display); color: var(--accent); font-size: clamp(2.4rem, 9vw, 4.4rem); }
.cover-inner { margin-top: 8vh; }
.title { font-family: var(--font-display); color: var(--primary); font-weight: 400; }
`,
    config: cfg({
      id: "reuni-smp-pelita-2002", judul: "Reuni Perak 25 Tahun", namaSampul: "SMP Pelita '02", tamuBawaan: "Alumni Angkatan 2002", salam: "Halo, teman sekelas!", judulProfil: "Panitia",
      pembuka: "Kalender sudah disobek dua puluh lima tahun. Saatnya kita bertemu lagi di halaman sekolah:",
      tokoh: [
        { panggilan: "Ketua", nama: "Yudi Kurniawan (3B)", keterangan: "Dulu ketua kelas, sekarang tetap disuruh-suruh" },
        { panggilan: "Sekretaris", nama: "Nia Ramadhani (3D)", keterangan: "Penyimpan buku absen dan semua nomor HP" },
      ],
      kutipan: { teks: "Yang berubah cuma alamat dan rambut. Ceritanya tetap sama.", sumber: "Grup alumni" },
      acara: [{ nama: "Temu Kangen & Makan Siang", mulai: "2027-12-18T10:00:00+07:00", selesai: "2027-12-18T15:00:00+07:00", tempat: "Aula SMP Pelita", alamat: "Jl. Veteran No. 33, Kediri" }],
      teks: { judulHitungMundur: "Lembar Terakhir Disobek Dalam", judulAcara: "Jadwal", judulGaleri: "Album Kelas 3", judulUcapan: "Pesan untuk Teman Lama" },
      galeri: ["Upacara Senin", "Kemah Pramuka", "Lomba 17-an", "Perpisahan 2002"],
      ucapan: [["Hendra 3A", "Masih ingat kantin Bu Sum? Sampai ketemu!"], ["Lilis 3C", "Sudah nggak sabar. Bawa foto lama ya, semuanya."]],
      amplop: { judul: "Iuran Reuni", pengantar: "Iuran Rp200.000 per orang, sisa dana disumbangkan untuk perpustakaan sekolah:", rekening: [{ bank: "Bank BNI", nomor: "0456 7788 99", atasNama: "Nia Ramadhani" }], alamatKado: "" },
      wa: "6281200000209", namaAcara: "reuni perak SMP Pelita 2002", pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
      templat: "Halo panitia, saya {nama} konfirmasi untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Sampai jumpa di halaman sekolah. Jangan telat, nanti disuruh lari keliling lapangan.", salamPenutup: "", keluarga: "Panitia Reuni Angkatan 2002",
      nada: NADA_C, tempo: 440, konfeti: ["#e2603b", "#f3c45a", "#8fb9a8"],
    }),
  },
  {
    id: "undangan-tujuh-bulan-anyaman",
    kind: "tujuhbulan",
    title: "Undangan Tujuh Bulanan Rahma",
    description: "Undangan tujuh bulanan bernuansa anyaman pandan hijau muda: lajur anyaman mendatar dan tegak ditarik keluar ke arah berlawanan.",
    theme: "#5b7b3a",
    fonts: FT("Fraunces", "Sacramento", "Quicksand", "family=Fraunces:wght@500;700&family=Sacramento&family=Quicksand:wght@400;600"),
    colors: { bg: "#f7f8f0", surface: "#ecefdc", ink: "#24301a", inkSoft: "#5f6b52", primary: "#5b7b3a", onPrimary: "#fbf7e4", accent: "#c79a52", line: "#dfe4cc", coverBg: "#d9c79a", coverInk: "#3b4d24", ...C4("#7fa35a", "#c79a52", "#f2e6c4", "#e6a3a3") },
    ornament: WEAVE.html,
    css: OPEN_BASE + WEAVE.css + SOFT + `
.cover h1 { color: var(--primary); }
`,
    config: cfg({
      id: "mitoni-rahma", judul: "Tujuh Bulanan", namaSampul: "Rahma & Yoga", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Calon Ayah dan Ibu",
      pembuka: "Dengan rasa syukur, kami mengundang Bapak/Ibu dalam doa bersama tujuh bulan kehamilan:",
      tokoh: [
        { panggilan: "Yoga", nama: "Yoga Prasetya", keterangan: "Calon ayah" },
        { panggilan: "Rahma", nama: "Rahmawati Putri", keterangan: "Calon ibu" },
      ],
      kutipan: { teks: "Ya Allah, lindungilah ibu dan bayi dalam kandungan ini, dan lahirkanlah ia dengan selamat.", sumber: "Doa orang tua" },
      acara: [{ nama: "Pengajian & Siraman", mulai: "2027-04-10T09:00:00+07:00", selesai: "2027-04-10T12:00:00+07:00", tempat: "Kediaman Bapak Slamet", alamat: "Jl. Mawar No. 5, Purwokerto" }],
      teks: { judulHitungMundur: "Menuju Hari Doa Bersama", judulGaleri: "Tujuh Bulan Menanti", pengantarGaleri: "Setiap bulan kami catat dengan foto." },
      galeri: ["Kabar gembira", "USG pertama", "Bulan keempat", "Kamar bayi"],
      ucapan: [["Mbah Uti", "Sehat-sehat ya, Nduk. Lancar sampai lahiran."], ["Teman kantor Yoga", "Selamat calon ayah! Semoga lancar semuanya."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda sudah sangat berarti. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BSI", nomor: "7210 3344 55", atasNama: "Rahmawati Putri" }], alamatKado: "Jl. Mawar No. 5, Purwokerto 53116" },
      wa: "6281200000210", namaAcara: "tujuh bulanan Rahma", templat: RSVP_NIKAH,
      penutup: "Atas doa dan kehadirannya kami ucapkan terima kasih.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Slamet",
      nada: NADA_A, tempo: 600, konfeti: ["#7fa35a", "#c79a52", "#f2e6c4"],
    }),
  },
  {
    id: "undangan-nikah-candi-bentar",
    kind: "nikah",
    title: "Undangan Pawiwahan Made & Komang",
    description: "Undangan pawiwahan bernuansa Bali: dua sisi gerbang candi bentar turun sedikit lalu bergeser terbuka, dengan cahaya senja di celahnya.",
    theme: "#7a2e1a",
    fonts: FT("Cormorant Garamond", "Italianno", "Lato", "family=Cormorant+Garamond:wght@600;700&family=Italianno&family=Lato:wght@400;700"),
    colors: { bg: "#fbf5ec", surface: "#f2e5d2", ink: "#2d1b14", inkSoft: "#6c5446", primary: "#7a2e1a", onPrimary: "#fff1d6", accent: "#e0a23a", line: "#ead9c1", coverBg: "#9c4a2b", coverInk: "#fff1d6", ...C4("#c0582f", "#e0a23a", "#f6e2bc", "#3f6b4c") },
    ornament: CANDI.html,
    css: OPEN_BASE + CANDI.css + SOFT + `
.cover h1 { color: var(--accent); }
`,
    config: cfg({
      id: "pawiwahan-made-komang", judul: "Pawiwahan", namaSampul: "Made & Komang", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: "Om Swastiastu", judulProfil: "Kedua Mempelai",
      pembuka: "Atas asung kertha wara nugraha Ida Sang Hyang Widhi Wasa, kami bermaksud menyelenggarakan upacara pawiwahan putra-putri kami:",
      tokoh: [
        { panggilan: "Made", nama: "I Made Surya Adnyana", keterangan: "Putra Bapak I Wayan Darma dan Ibu Ni Nyoman Sari" },
        { panggilan: "Komang", nama: "Ni Komang Ayu Lestari", keterangan: "Putri Bapak I Ketut Gede dan Ibu Ni Made Rai" },
      ],
      kutipan: { teks: "Semoga kalian berdua tetap bersatu dan tidak pernah terpisahkan, mencapai usia lanjut bersama.", sumber: "Doa pawiwahan" },
      acara: [
        { nama: "Upacara Pawiwahan", mulai: "2027-06-19T09:00:00+08:00", selesai: "2027-06-19T12:00:00+08:00", tempat: "Griya Keluarga Darma", alamat: "Br. Tegal Sari, Desa Mas, Ubud, Gianyar" },
        { nama: "Resepsi", mulai: "2027-06-19T17:00:00+08:00", selesai: "2027-06-19T21:00:00+08:00", tempat: "Wantilan Desa Mas", alamat: "Jl. Raya Mas, Ubud, Gianyar" },
      ],
      zona: ["Asia/Makassar", "WITA"],
      galeri: ["Bertemu di sanggar tari", "Galungan bersama", "Mepadik", "Foto pranikah di Tegallalang"],
      ucapan: [["Sekaa Teruna Tegal Sari", "Rahajeng nganten, Made dan Komang!"], ["Bli Putu", "Semoga langgeng dan bahagia."]],
      amplop: { judul: "Punia & Kado", pengantar: "Doa restu Anda adalah anugerah. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BPD Bali", nomor: "0300 2010 4455", atasNama: "I Made Surya Adnyana" }], alamatKado: "Br. Tegal Sari, Desa Mas, Ubud, Gianyar 80571" },
      wa: "6281200000211", namaAcara: "pawiwahan Made & Komang", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      templat: "Om Swastiastu. Saya {nama} konfirmasi untuk {acara}: {hadir}, {jumlah} orang. Suksma.",
      penutup: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir memberikan doa restu.", salamPenutup: "Om Shanti Shanti Shanti Om", keluarga: "Keluarga Besar I Wayan Darma dan I Ketut Gede",
      nada: NADA_D, tempo: 560, konfeti: ["#c0582f", "#e0a23a", "#f6e2bc"],
    }),
  },
  {
    id: "undangan-wisuda-ubin-balik",
    kind: "wisuda",
    title: "Undangan Syukuran Wisuda Nadia",
    description: "Undangan syukuran wisuda teknik bergaya papan sirkuit: 48 ubin sampul berbalik miring dalam gelombang diagonal dari kiri atas.",
    theme: "#123c69",
    fonts: FT("Space Grotesk", "Kalam", "Inter", "family=Space+Grotesk:wght@500;700&family=Kalam:wght@700&family=Inter:wght@400;600"),
    colors: { bg: "#f4f7fb", surface: "#e5ecf5", ink: "#0f1f33", inkSoft: "#4c5d73", primary: "#123c69", onPrimary: "#ffffff", accent: "#20c997", line: "#d5dfeb", coverBg: "#123c69", coverInk: "#ffffff", ...C4("#20c997", "#f7b32b", "#ffffff", "#5b8def") },
    ornament: TILES.html + deco("spark", STAR),
    css: OPEN_BASE + TILES.css + DECO_CSS + SOFT + `
.spark { left: 50%; top: 6vh; width: 46px; margin-left: -23px; color: var(--accent); }
.cover h1 { color: #fff; }
`,
    config: cfg({
      id: "wisuda-nadia", judul: "Syukuran Wisuda", namaSampul: "Nadia, S.T.", tamuBawaan: "Keluarga dan Sahabat", salam: ISLAM.salam, judulProfil: "Sang Wisudawati",
      pembuka: "Empat tahun, satu skripsi, dan banyak malam begadang. Alhamdulillah, mari merayakannya bersama:",
      tokoh: [{ panggilan: "Nadia", nama: "Nadia Kusumawardani, S.T.", keterangan: "Lulusan Teknik Elektro, predikat cum laude" }],
      kutipan: { teks: "Ilmu itu lebih baik daripada harta. Ilmu menjagamu, sedangkan kamu menjaga harta.", sumber: "Ali bin Abi Thalib" },
      acara: [{ nama: "Syukuran & Makan Siang", mulai: "2027-09-04T11:00:00+07:00", selesai: "2027-09-04T14:00:00+07:00", tempat: "Rumah Makan Saung Cahaya", alamat: "Jl. Dipatiukur No. 88, Bandung" }],
      teks: { judulHitungMundur: "Toga Dilempar Dalam", judulGaleri: "Dari Maba sampai Toga", judulUcapan: "Ucapan untuk Nadia" },
      galeri: ["Ospek 2023", "Lab elektronika", "Kerja praktik", "Sidang skripsi", "Wisuda"],
      ucapan: [["Ayah dan Ibu", "Bangga sekali sama kamu, Nak."], ["Asisten lab", "Selamat, Nadia! Sukses di dunia kerja."]],
      amplop: { judul: "Kado Wisuda", pengantar: "Doa Anda yang paling berharga. Bila ingin memberi kado:", rekening: [{ bank: "Bank Jago", nomor: "1023 4455 6677", atasNama: "Nadia Kusumawardani" }], alamatKado: "" },
      wa: "6281200000212", namaAcara: "syukuran wisuda Nadia", pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
      penutup: "Terima kasih atas doa dan dukungan selama ini.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Kusuma",
      nada: NADA_C, tempo: 480, konfeti: ["#20c997", "#f7b32b", "#5b8def"],
    }),
  },
  {
    id: "undangan-rumah-jendela-kayu",
    kind: "rumah",
    title: "Undangan Syukuran Rumah Baru Keluarga Hidayat",
    description: "Undangan syukuran rumah baru bernuansa kayu hangat: daun jendela berkisi terayun terbuka ke arah pembaca dan seberkas cahaya pagi masuk.",
    theme: "#6b4a2b",
    fonts: FT("Libre Baskerville", "Homemade Apple", "Source Sans 3", "family=Libre+Baskerville:wght@400;700&family=Homemade+Apple&family=Source+Sans+3:wght@400;600"),
    colors: { bg: "#faf6ef", surface: "#f0e6d6", ink: "#2b1f15", inkSoft: "#6a5847", primary: "#6b4a2b", onPrimary: "#fff6e6", accent: "#e8b04a", line: "#e6d8c2", coverBg: "#8a5d36", coverInk: "#fff6e6", ...C4("#8a5d36", "#e8b04a", "#f4e3c3", "#5f8a5a") },
    ornament: SHUT.html,
    css: OPEN_BASE + SHUT.css + SOFT + `
.cover h1 { color: var(--accent); }
`,
    config: cfg({
      id: "syukuran-rumah-hidayat", judul: "Syukuran Rumah Baru", namaSampul: "Keluarga Hidayat", tamuBawaan: "Bapak/Ibu Tetangga", salam: ISLAM.salam, judulProfil: "Tuan Rumah",
      pembuka: "Alhamdulillah, jendela rumah baru kami sudah terbuka. Kami mengundang Bapak/Ibu untuk doa bersama dan makan siang:",
      tokoh: [
        { panggilan: "Pak Arif", nama: "Arif Hidayat", keterangan: "Kepala keluarga" },
        { panggilan: "Bu Lina", nama: "Lina Marlina", keterangan: "Ibu rumah tangga dan pembuat kue" },
      ],
      kutipan: { teks: "Ya Allah, berkahilah rumah ini dan jadikanlah ia tempat yang penuh ketenangan.", sumber: "Doa menempati rumah" },
      acara: [{ nama: "Doa Bersama & Makan Siang", mulai: "2027-01-23T10:00:00+07:00", selesai: "2027-01-23T13:00:00+07:00", tempat: "Rumah Keluarga Hidayat", alamat: "Perum Griya Asri Blok C No. 7, Cibinong, Bogor" }],
      teks: { judulHitungMundur: "Pintu Dibuka Dalam", judulGaleri: "Dari Fondasi ke Rumah", pengantarGaleri: "Setahun membangun, sedikit demi sedikit." },
      galeri: ["Tanah kosong", "Fondasi", "Atap terpasang", "Taman depan", "Ruang keluarga"],
      ucapan: [["Pak RT 04", "Selamat datang di lingkungan kami, Pak Arif."], ["Keluarga Bu Lina", "Semoga rumahnya membawa berkah."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Kehadiran Bapak/Ibu sudah lebih dari cukup.", rekening: [{ bank: "Bank BRI", nomor: "0120 0100 5566 503", atasNama: "Arif Hidayat" }], alamatKado: "Perum Griya Asri Blok C No. 7, Cibinong, Bogor 16911" },
      wa: "6281200000213", namaAcara: "syukuran rumah baru Keluarga Hidayat", templat: RSVP_NIKAH,
      penutup: "Pintu rumah kami selalu terbuka untuk Bapak/Ibu.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Arif Hidayat",
      nada: NADA_B, tempo: 560, konfeti: ["#e8b04a", "#8a5d36", "#5f8a5a"],
    }),
  },
  {
    id: "undangan-ultah-anak-kue-lapis",
    kind: "ultah",
    title: "Undangan Ulang Tahun ke-5 Arka",
    description: "Undangan ulang tahun anak bertema kue lapis warna-warni: lapisan kue bergeser keluar bergantian ke kiri dan kanan, dimulai dari lapisan krim teratas.",
    theme: "#d9467a",
    fonts: FT("Fredoka", "Pacifico", "Nunito", "family=Fredoka:wght@500;700&family=Pacifico&family=Nunito:wght@400;700"),
    colors: { bg: "#fff8f2", surface: "#ffeedd", ink: "#33212b", inkSoft: "#6f5865", primary: "#d9467a", onPrimary: "#ffffff", accent: "#ffd166", line: "#f5dfd0", coverBg: "#f7a6c1", coverInk: "#4a1f33", ...C4("#ff8fab", "#ffd166", "#7bdff2", "#b8e986") },
    ornament: LAPIS.html,
    css: OPEN_BASE + LAPIS.css + SOFT + `
.cover h1 { color: var(--primary); }
`,
    config: cfg({
      id: "ultah-arka-5", judul: "Ulang Tahun ke-5", namaSampul: "Arka", tamuBawaan: "Teman Arka", salam: "Halo, teman-teman!", judulProfil: "Yang Berulang Tahun",
      pembuka: "Arka mau tiup lilin lima! Ayo datang, ada kue lapis, badut, dan lomba makan kerupuk:",
      tokoh: [{ panggilan: "Arka", nama: "Arkananta Putra", keterangan: "Suka dinosaurus dan kereta api" }],
      kutipan: { teks: "Tumbuhlah jadi anak yang baik hati, berani, dan selalu gembira.", sumber: "Ayah dan Bunda" },
      acara: [{ nama: "Pesta Ulang Tahun", mulai: "2027-02-14T15:30:00+07:00", selesai: "2027-02-14T18:00:00+07:00", tempat: "Ruang Bermain Pelangi", alamat: "Jl. Margonda Raya No. 211, Depok" }],
      teks: { judulHitungMundur: "Tiup Lilin Dalam", judulAcara: "Detail Pesta", pengantarAcara: "Dress code: warna favoritmu!", judulGaleri: "Arka dari 1 sampai 5", judulUcapan: "Ucapan untuk Arka" },
      galeri: ["Ulang tahun pertama", "Main di pantai", "Masuk TK", "Arka dan kereta api"],
      ucapan: [["Kakek & Nenek", "Selamat ulang tahun, cucu kesayangan!"], ["Teman TK", "Arka, selamat ulang tahun! Kita main bareng ya."]],
      amplop: { judul: "Kado untuk Arka", pengantar: "Kado tidak wajib. Kalau mau, Arka sedang suka buku cerita bergambar.", rekening: [{ bank: "Bank BCA", nomor: "5560 1122 33", atasNama: "Putri Ayuningtyas" }], alamatKado: "Jl. Kemuning No. 4, Depok 16424" },
      wa: "6281200000214", namaAcara: "ulang tahun ke-5 Arka", pilihan: ["Datang", "Belum tahu", "Tidak bisa datang"],
      templat: "Halo Bunda Arka, saya {nama} untuk {acara}: {hadir}, {jumlah} orang (termasuk anak).",
      penutup: "Sampai ketemu di pesta, jangan lupa bawa senyum terbaik!", salamPenutup: "", keluarga: "Ayah, Bunda, dan Arka",
      nada: NADA_C, tempo: 380, konfeti: ["#ff8fab", "#ffd166", "#7bdff2", "#b8e986"],
    }),
  },
  {
    id: "undangan-khitanan-balon-letus",
    kind: "khitanan",
    title: "Undangan Tasyakuran Khitanan Rafa",
    description: "Undangan tasyakuran khitanan yang ceria: sampul berupa kumpulan balon warna-warni yang mengembang dan meletus satu per satu.",
    theme: "#1f6f8b",
    fonts: FT("Baloo 2", "Sniglet", "Poppins", "family=Baloo+2:wght@600;800&family=Sniglet&family=Poppins:wght@400;600"),
    colors: { bg: "#f3fafc", surface: "#e2f2f6", ink: "#12303a", inkSoft: "#4d6870", primary: "#1f6f8b", onPrimary: "#ffffff", accent: "#ff9f1c", line: "#d0e7ee", coverBg: "#d8f1f7", coverInk: "#12303a", ...C4("#ff9f1c", "#2ec4b6", "#e71d36", "#5b7cfa") },
    ornament: POP.html,
    css: OPEN_BASE + POP.css + SOFT + `
.cover h1 { color: var(--primary); }
`,
    config: cfg({
      id: "khitanan-rafa", judul: "Tasyakuran Khitanan", namaSampul: "Rafa", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Putra Kami",
      pembuka: "Alhamdulillah, putra kami telah dikhitan. Kami mengundang Bapak/Ibu dalam tasyakuran sederhana:",
      tokoh: [{ panggilan: "Rafa", nama: "Muhammad Rafa Alfarizi", keterangan: "Putra Bapak Fajar Ramadhan dan Ibu Nisa Amelia" }],
      kutipan: { teks: "Fitrah itu ada lima: khitan, mencukur rambut kemaluan, memotong kumis, memotong kuku, dan mencabut bulu ketiak.", sumber: "HR. Bukhari dan Muslim" },
      acara: [{ nama: "Tasyakuran & Hiburan Anak", mulai: "2027-07-03T13:00:00+07:00", selesai: "2027-07-03T16:00:00+07:00", tempat: "Kediaman Bapak Fajar", alamat: "Jl. Cempaka Putih No. 21, Pekanbaru" }],
      teks: { judulHitungMundur: "Balon Meletus Dalam", judulGaleri: "Rafa yang Pemberani" },
      galeri: ["Rafa bayi", "Masuk SD", "Juara lomba mewarnai", "Hari khitan"],
      ucapan: [["Om Doni", "Hebat, Rafa! Sudah jadi anak pemberani."], ["Wali kelas", "Semoga Rafa cepat sembuh dan semakin saleh."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Bapak/Ibu sangat berarti bagi Rafa. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank Riau Kepri", nomor: "1011 2233 44", atasNama: "Fajar Ramadhan" }], alamatKado: "Jl. Cempaka Putih No. 21, Pekanbaru 28141" },
      wa: "6281200000215", namaAcara: "tasyakuran khitanan Rafa", templat: RSVP_NIKAH,
      penutup: "Atas kehadiran dan doanya kami ucapkan terima kasih.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Fajar Ramadhan",
      nada: NADA_B, tempo: 420, konfeti: ["#ff9f1c", "#2ec4b6", "#e71d36", "#5b7cfa"],
    }),
  },
  {
    id: "undangan-nikah-kartu-pos",
    kind: "nikah",
    title: "Undangan Pernikahan Gilang & Sekar",
    description: "Undangan pernikahan di tepi pantai bergaya kartu pos perjalanan: kartu pos berbalik memperlihatkan perangko, lalu mengecil dan meluncur ke kotak pos.",
    theme: "#0e6e8c",
    fonts: FT("Abril Fatface", "Allura", "Karla", "family=Abril+Fatface&family=Allura&family=Karla:wght@400;700"),
    colors: { bg: "#f6f9f8", surface: "#e4f0ee", ink: "#14292e", inkSoft: "#4f6569", primary: "#0e6e8c", onPrimary: "#ffffff", accent: "#e4572e", line: "#d3e5e3", coverBg: "#fdf8ee", coverInk: "#0e6e8c", ...C4("#e4572e", "#0e6e8c", "#f3c969", "#7cc6b8") },
    ornament: PCARD.html,
    css: OPEN_BASE + PCARD.css + `
.cover h1 { font-family: var(--font-display); color: var(--primary); }
.cover-inner { padding: 26px 22px; }
.title { font-family: var(--font-display); color: var(--primary); font-weight: 400; }
`,
    config: cfg({
      id: "nikah-gilang-sekar", judul: "Pernikahan", namaSampul: "Gilang & Sekar", tamuBawaan: "Kawan Seperjalanan", salam: "Salam hangat dari pantai,", judulProfil: "Dua Pelancong",
      pembuka: "Setelah keliling dua puluh pulau berdua, kami memilih satu pantai untuk berjanji sehidup semati:",
      tokoh: [
        { panggilan: "Gilang", nama: "Gilang Ramadhan Putra", keterangan: "Putra Bapak Sutrisno dan Ibu Mariani" },
        { panggilan: "Sekar", nama: "Sekar Ayu Larasati", keterangan: "Putri Bapak Wahyudi dan Ibu Hartini" },
      ],
      kutipan: { teks: "Perjalanan terbaik adalah perjalanan pulang ke orang yang tepat.", sumber: "Catatan perjalanan kami" },
      acara: [
        { nama: "Akad Nikah", mulai: "2027-08-28T16:00:00+08:00", selesai: "2027-08-28T17:00:00+08:00", tempat: "Dermaga Pantai Waecicu", alamat: "Labuan Bajo, Manggarai Barat, NTT" },
        { nama: "Makan Malam Senja", mulai: "2027-08-28T18:00:00+08:00", selesai: "2027-08-28T21:00:00+08:00", tempat: "Bukit Senja Resto", alamat: "Jl. Pantai Pede, Labuan Bajo" },
      ],
      zona: ["Asia/Makassar", "WITA"],
      teks: { judulHitungMundur: "Kapal Berangkat Dalam", judulGaleri: "Cap Paspor Kami" },
      galeri: ["Pulau Padar", "Danau Kelimutu", "Raja Ampat", "Lamaran di Gili"],
      ucapan: [["Grup Open Trip", "Selamat berlayar ke bab berikutnya!"], ["Bude Narti", "Semoga sakinah, jangan lupa pulang ke Solo."]],
      amplop: { judul: "Kado Digital", pengantar: "Karena lokasinya jauh, doa dari rumah pun kami terima dengan bahagia. Bila ingin memberi kado:", rekening: [{ bank: "Bank Mandiri", nomor: "1560 0098 7766", atasNama: "Sekar Ayu Larasati" }], alamatKado: "" },
      wa: "6281200000216", namaAcara: "pernikahan Gilang & Sekar", pilihan: ["Hadir", "Hadir daring", "Tidak bisa hadir"],
      penutup: "Bawa topi, tabir surya, dan hati yang lapang.", salamPenutup: "", keluarga: "Keluarga Sutrisno dan Keluarga Wahyudi",
      nada: NADA_A, tempo: 520, konfeti: ["#e4572e", "#f3c969", "#7cc6b8"],
    }),
  },
  {
    id: "undangan-ultah-30-kaca-pecah",
    kind: "ultah",
    title: "Undangan Pesta 30 Tahun Bram",
    description: "Undangan pesta ulang tahun ke-30 bergaya malam elegan: sampul kaca retak menjadi delapan pecahan yang jatuh berputar ke bawah layar.",
    theme: "#121417",
    fonts: FT("Bebas Neue", "Dancing Script", "Inter", "family=Bebas+Neue&family=Dancing+Script:wght@700&family=Inter:wght@400;600"),
    colors: { bg: "#f5f4f1", surface: "#e9e7e2", ink: "#121417", inkSoft: "#55585e", primary: "#121417", onPrimary: "#f1d18a", accent: "#c9a14a", line: "#dcd9d2", coverBg: "#1c1f24", coverInk: "#f1d18a", ...C4("#c9a14a", "#8b9bb4", "#f1d18a", "#e0e0e0") },
    ornament: SHARD.html,
    css: OPEN_BASE + SHARD.css + SOFT + `
.cover h1 { font-family: var(--font-display); color: var(--accent); letter-spacing: .06em; font-size: clamp(3rem, 12vw, 6rem); }
`,
    config: cfg({
      id: "ultah-bram-30", judul: "Tiga Puluh", namaSampul: "Bram", tamuBawaan: "Kawan", salam: "Halo, kawan!", judulProfil: "Yang Berulang Tahun",
      pembuka: "Kepala tiga sudah datang. Mari pecahkan gelas dua puluhan dan rayakan bersama:",
      tokoh: [{ panggilan: "Bram", nama: "Bramantyo Adi Saputra", keterangan: "Arsitek, pemain bas, dan juru masak akhir pekan" }],
      kutipan: { teks: "Umur cuma angka. Tapi tiga puluh angka yang bagus untuk berpesta.", sumber: "Bram" },
      acara: [{ nama: "Pesta Malam", mulai: "2027-11-13T19:30:00+07:00", selesai: "2027-11-13T23:30:00+07:00", tempat: "Rooftop Lantai 9", alamat: "Gedung Arunika, Jl. Senopati No. 70, Jakarta Selatan" }],
      teks: { judulHitungMundur: "Gelas Dipecahkan Dalam", judulAcara: "Detail Pesta", pengantarAcara: "Dress code: hitam dan emas.", judulGaleri: "Tiga Dekade", judulUcapan: "Ucapan untuk Bram" },
      galeri: ["Bram kecil", "Band kampus", "Proyek pertama", "Ulang tahun ke-29"],
      ucapan: [["Anak band", "Selamat kepala tiga, Bram! Siap jamming sampai pagi."], ["Kakak", "Selamat ulang tahun, adikku yang sudah tua."]],
      amplop: { judul: "Kado", pengantar: "Datang saja sudah cukup. Kalau memaksa, Bram sedang menabung untuk bas baru:", rekening: [{ bank: "Bank BCA", nomor: "6780 3344 21", atasNama: "Bramantyo Adi Saputra" }], alamatKado: "" },
      wa: "6281200000217", namaAcara: "pesta 30 tahun Bram", pilihan: ["Datang", "Mungkin", "Tidak bisa"],
      templat: "Halo Bram, ini {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      penutup: "Sampai jumpa di atap. Jangan lupa jaket, anginnya kencang.", salamPenutup: "", keluarga: "Bram dan kawan-kawan",
      nada: NADA_D, tempo: 460, konfeti: ["#c9a14a", "#f1d18a", "#8b9bb4"],
    }),
  },
  {
    id: "undangan-aqiqah-tetes-madu",
    kind: "aqiqah",
    title: "Undangan Aqiqah Hana",
    description: "Undangan aqiqah bernuansa madu keemasan: sampul meleleh turun seperti tetesan madu kental, memperlihatkan undangan dari atas ke bawah.",
    theme: "#b9771c",
    fonts: FT("Lora", "Parisienne", "Mulish", "family=Lora:wght@500;700&family=Parisienne&family=Mulish:wght@400;700"),
    colors: { bg: "#fffaf1", surface: "#fbefd9", ink: "#33230f", inkSoft: "#6e5a40", primary: "#b9771c", onPrimary: "#fffaf1", accent: "#f2c14e", line: "#f1e2c6", coverBg: "#e9a93a", coverInk: "#3d2709", ...C4("#f2c14e", "#e9a93a", "#fff1cc", "#c9876b") },
    ornament: DRIP.html,
    css: OPEN_BASE + DRIP.css + SOFT + `
.cover h1 { color: #3d2709; }
`,
    config: cfg({
      id: "aqiqah-hana", judul: "Aqiqah", namaSampul: "Hana", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Buah Hati Kami",
      pembuka: "Dengan penuh syukur atas kelahiran putri kami, kami mengundang Bapak/Ibu dalam acara aqiqah:",
      tokoh: [{ panggilan: "Hana", nama: "Hana Khairunnisa", keterangan: "Putri Bapak Rizky Maulana dan Ibu Aulia Rahman, lahir 2 Maret 2027" }],
      kutipan: { teks: "Setiap anak tergadai dengan aqiqahnya, disembelihkan pada hari ketujuh, dicukur, dan diberi nama.", sumber: "HR. Abu Dawud" },
      acara: [{ nama: "Aqiqah & Pengajian", mulai: "2027-03-14T09:00:00+07:00", selesai: "2027-03-14T12:00:00+07:00", tempat: "Kediaman Bapak Rizky", alamat: "Jl. Teratai No. 15, Pontianak" }],
      teks: { judulHitungMundur: "Menuju Hari Aqiqah", judulGaleri: "Minggu Pertama Hana" },
      galeri: ["Hari lahir", "Pulang ke rumah", "Tidur pertama di boks", "Digendong kakek"],
      ucapan: [["Nenek Hana", "Semoga menjadi anak salehah, sehat selalu."], ["Teman pengajian", "Barakallah, semoga jadi penyejuk mata orang tuanya."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Bapak/Ibu adalah hadiah terbaik untuk Hana.", rekening: [{ bank: "Bank BSI", nomor: "7220 1199 88", atasNama: "Rizky Maulana" }], alamatKado: "Jl. Teratai No. 15, Pontianak 78117" },
      wa: "6281200000218", namaAcara: "aqiqah Hana", templat: RSVP_NIKAH,
      penutup: "Atas doa dan kehadirannya kami ucapkan jazakumullah khairan.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Rizky Maulana",
      nada: NADA_A, tempo: 620, konfeti: ["#f2c14e", "#e9a93a", "#fff1cc"],
    }),
  },
  {
    id: "undangan-lamaran-surat-lipat",
    kind: "lamaran",
    title: "Undangan Lamaran Yusuf & Aisyah",
    description: "Undangan lamaran bergaya surat bergaris: bagian atas surat terlipat ke bawah, lalu surat yang sudah terlipat meluncur keluar ke kanan.",
    theme: "#3d4f7a",
    fonts: FT("Crimson Pro", "Homemade Apple", "Lato", "family=Crimson+Pro:wght@500;700&family=Homemade+Apple&family=Lato:wght@400;700"),
    colors: { bg: "#f7f8fb", surface: "#e9ecf4", ink: "#1c2333", inkSoft: "#555f75", primary: "#3d4f7a", onPrimary: "#ffffff", accent: "#c9a24a", line: "#dde1ec", coverBg: "#fdfbf5", coverInk: "#2c3a5e", ...C4("#3d4f7a", "#c9a24a", "#e8ecf6", "#a7b8d8") },
    ornament: FOLD.html + deco("rings", RINGS),
    css: OPEN_BASE + FOLD.css + DECO_CSS + SOFT + `
.rings { left: 50%; top: 7vh; width: 80px; margin-left: -40px; color: var(--accent); }
.cover h1 { color: var(--primary); }
`,
    config: cfg({
      id: "lamaran-yusuf-aisyah", judul: "Acara Lamaran", namaSampul: "Yusuf & Aisyah", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Yang Akan Melamar dan Dilamar",
      pembuka: "Dengan memohon ridha Allah SWT, kami bermaksud menyampaikan niat baik dalam acara lamaran:",
      tokoh: [
        { panggilan: "Yusuf", nama: "Yusuf Al-Hakim", keterangan: "Putra Bapak Abdul Hakim dan Ibu Fatimah" },
        { panggilan: "Aisyah", nama: "Aisyah Nurul Izzah", keterangan: "Putri Bapak Hasan Basri dan Ibu Khadijah" },
      ],
      kutipan: { teks: "Wahai para pemuda, siapa di antara kalian yang mampu menikah, maka menikahlah.", sumber: "HR. Bukhari dan Muslim" },
      acara: [{ nama: "Lamaran", mulai: "2027-05-08T10:00:00+07:00", selesai: "2027-05-08T12:30:00+07:00", tempat: "Kediaman Bapak Hasan Basri", alamat: "Jl. Ahmad Yani No. 77, Banjarmasin" }],
      zona: ["Asia/Makassar", "WITA"],
      teks: { judulHitungMundur: "Surat Dibuka Dalam", judulGaleri: "Sebelum Surat Ini" },
      galeri: ["Taaruf", "Silaturahmi keluarga", "Cincin pilihan ibu"],
      ucapan: [["Ustadz Hamid", "Barakallah, semoga dimudahkan sampai akad."], ["Sahabat Aisyah", "Ikut bahagia, Aisyah!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah hadiah terindah.", rekening: [{ bank: "Bank BSI", nomor: "7300 4411 22", atasNama: "Yusuf Al-Hakim" }], alamatKado: "" },
      wa: "6281200000219", namaAcara: "lamaran Yusuf & Aisyah", templat: RSVP_NIKAH,
      pengantarRsvp: "Acara lamaran terbatas untuk keluarga dan kerabat dekat. Mohon konfirmasi kehadiran.",
      penutup: "Atas doa dan kehadirannya kami ucapkan terima kasih.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Abdul Hakim dan Bapak Hasan Basri",
      nada: NADA_B, tempo: 600, konfeti: ["#c9a24a", "#3d4f7a", "#e8ecf6"],
    }),
  },
  {
    id: "undangan-nikah-tirai-manik",
    kind: "nikah",
    title: "Undangan Baralek Fikri & Laila",
    description: "Undangan baralek bernuansa Minang merah dan emas: untaian tirai manik tersibak dari tengah ke kedua sisi sambil berayun.",
    theme: "#8b1e1e",
    fonts: FT("Cinzel", "Great Vibes", "Poppins", "family=Cinzel:wght@500;700&family=Great+Vibes&family=Poppins:wght@400;600"),
    colors: { bg: "#fdf7ef", surface: "#f6e6d2", ink: "#2d1414", inkSoft: "#6d4d4a", primary: "#8b1e1e", onPrimary: "#ffe9b8", accent: "#d9a63e", line: "#edd8bf", coverBg: "#7a1717", coverInk: "#ffe9b8", ...C4("#b5262b", "#d9a63e", "#ffe9b8", "#1f4b3a") },
    ornament: BEAD.html,
    css: OPEN_BASE + BEAD.css + SOFT + `
.cover h1 { color: var(--accent); }
.account { background: linear-gradient(135deg, var(--primary), #4a0c0c); }
`,
    config: cfg({
      id: "baralek-fikri-laila", judul: "Baralek", namaSampul: "Fikri & Laila", tamuBawaan: "Bapak/Ibu/Dunsanak", salam: ISLAM.salam, judulProfil: "Anak Daro & Marapulai",
      pembuka: "Dengan memohon rahmat Allah SWT, kami mengundang Bapak/Ibu/Dunsanak ke alek pernikahan anak kami:",
      tokoh: [
        { panggilan: "Fikri", nama: "Fikri Ananda Putra", keterangan: "Putra Bapak Syafrizal dan Ibu Yusnimar" },
        { panggilan: "Laila", nama: "Laila Rahmadani", keterangan: "Putri Bapak Darmawan dan Ibu Nurhayati" },
      ],
      kutipan: { teks: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan dari jenismu sendiri, agar kamu merasa tenteram.", sumber: "QS. Ar-Rum: 21" },
      acara: [
        { nama: "Akad Nikah", mulai: "2027-09-18T08:00:00+07:00", selesai: "2027-09-18T10:00:00+07:00", tempat: "Masjid Raya Nurul Iman", alamat: "Jl. Imam Bonjol No. 3, Bukittinggi" },
        { nama: "Baralek", mulai: "2027-09-18T11:00:00+07:00", selesai: "2027-09-18T16:00:00+07:00", tempat: "Rumah Gadang Keluarga Darmawan", alamat: "Jorong Koto Tuo, Agam, Sumatera Barat" },
      ],
      galeri: ["Batimbang tando", "Malam bainai", "Foto pranikah di Ngarai Sianok", "Pelaminan"],
      ucapan: [["Mamak Laila", "Salamaik baralek, semoga sakinah."], ["Kawan rantau Fikri", "Barakallah, Fikri dan Laila!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa restu Bapak/Ibu/Dunsanak adalah kebahagiaan kami.", rekening: [{ bank: "Bank Nagari", nomor: "1100 0120 3344", atasNama: "Fikri Ananda Putra" }], alamatKado: "Jorong Koto Tuo, Agam, Sumatera Barat 26152" },
      wa: "6281200000220", namaAcara: "baralek Fikri & Laila", templat: RSVP_NIKAH,
      penutup: "Merupakan suatu kehormatan apabila Bapak/Ibu/Dunsanak berkenan hadir.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Syafrizal dan Keluarga Darmawan",
      nada: NADA_D, tempo: 580, konfeti: ["#b5262b", "#d9a63e", "#ffe9b8"],
    }),
  },
];
