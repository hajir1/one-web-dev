import { dataBlock, doc, esc, n, ot, rng, type Rng, type ThemeVar } from "./shared";

/* ================================================================== */
/* DESIGN ANIMATION category: a romantic glowing garden at night.        */
/* No library: layered SVG + CSS keyframes + 2D canvas.                 */
/*                                                                    */
/* - SVG layers: stars, moon, hills, back grass, back flowers,          */
/*   front flowers, front grass. Each layer sways with a different delay. */
/* - Glow: a radial gradient halo on each petal & the moon (v19). Previously */
/*   an SVG blur filter on swaying layers: the blur was recomputed every */
/*   frame (FPS dropped to ~25). Gradients do not need recomputing.     */
/* - Fireflies: 2D canvas, max 60 particles, fewer on screens */
/*   narrow; stops when the tab is not visible.                         */
/* - Subtle parallax following the pointer, off on phones (configurable). */
/* ================================================================== */

type Flower = "tulip" | "rose" | "bell" | "daisy" | "lotus" | "sakura";
type Extra = "constellation" | "petals" | "lanterns" | "butterflies" | "meteors" | "hearts";

export interface AnimSpec {
  id: string;
  title: string;
  description: string;
  seed: number;
  flower: Flower;
  extra: Extra;
  /** Colors & speed (CSS variables on :root). */
  colors: {
    sky: [string, string, string];
    flower: string;
    flower2: string;
    center: string;
    glow: string;
    leaf: string;
    grass: string;
    grassFar: string;
    hill: string;
    firefly: string;
    ink: string;
  };
  moon: { x: number; y: number; r: number; crescent?: boolean };
  /** Text above the scene. */
  to: string;
  heading: string;
  text: string;
  from: string;
  /** Text position: left (default), right, or top center. */
  align?: "left" | "right" | "center";
  /** v17: a pond with the moon's reflection (floating flowers, e.g. lotus). */
  pond?: boolean;
  /** v17: a flowering branch from the top-left corner (e.g. sakura). */
  branch?: boolean;
  font: { display: string; href: string };
}

const W = 1600;
const H = 900;

/* ----------------------------- bentuk bunga ------------------------ */

/** Glow behind the petals: a gradient circle (replaces the blur filter). */
const halo = (kind: Flower) => `<circle class="halo" r="${kind === "lotus" ? 42 : kind === "daisy" ? 34 : 30}" fill="url(#halo)"/>`;

function blossomDef(kind: Flower): string {
  if (kind === "tulip")
    return `<g id="bl">${halo(kind)}
  <path class="p1" d="M-15 0C-18-17-10-31-3-37L0-24 3-37C10-31 18-17 15 0 9 8-9 8-15 0Z"/>
  <path class="p2" d="M-7 2C-11-12-6-24 0-31 6-24 11-12 7 2 3 5-3 5-7 2Z"/>
  <circle class="ct" cx="0" cy="-8" r="3"/>
</g>`;
  if (kind === "rose")
    return `<g id="bl">${halo(kind)}
  <circle class="p1" r="17"/>
  <path class="p2" d="M-17 0C-17-10-8-18 0-17 10-16 15-8 13 0 11 9 2 13-5 10-11 7-11-1-6-5-1-9 7-6 7 0 7 5 2 7-1 5"/>
  <path class="p3" d="M-16 4C-10 15 10 16 17 3"/>
</g>`;
  if (kind === "daisy")
    return `<g id="bl">${halo(kind)}
  ${Array.from({ length: 12 }, (_, i) => `<ellipse class="p1" cx="0" cy="-12" rx="3.6" ry="11" transform="rotate(${i * 30})"/>`).join("")}
  <circle class="p2" r="8"/>
  <circle class="ct" r="5.5"/>
</g>`;
  if (kind === "lotus")
    return `<g id="bl">${halo(kind)}
  <path class="p2" d="M0 2C-22 0-31-10-29-20-18-16-8-8 0 2ZM0 2C22 0 31-10 29-20 18-16 8-8 0 2Z"/>
  <path class="p1" d="M0 3C-15-4-20-20-14-33-7-24-2-12 0 3ZM0 3C15-4 20-20 14-33 7-24 2-12 0 3Z"/>
  <path class="p1" d="M0 3C-8-10-8-28 0-42 8-28 8-10 0 3Z"/>
  <path class="p3" d="M0-2V-30"/>
</g>`;
  if (kind === "sakura")
    return `<g id="bl">${halo(kind)}
  ${[0, 72, 144, 216, 288].map((a) => `<path class="p1" transform="rotate(${a})" d="M0 0C-8-5-9-14-5-19L0-15.5 5-19C9-14 8-5 0 0Z"/>`).join("")}
  ${[36, 108, 180, 252, 324].map((a) => `<path class="p3" transform="rotate(${a})" d="M0-2V-7"/>`).join("")}
  <circle class="ct" r="3.2"/>
</g>`;
  return `<g id="bl">${halo(kind)}
  <path class="p1" d="M-13-2C-13-18 13-18 13-2L17 12C7 7-7 7-17 12Z"/>
  <path class="p2" d="M-6 6C-4 0 4 0 6 6"/>
  <circle class="ct" cx="0" cy="9" r="4.5"/>
</g>`;
}

const leafPath = (len: number, side: 1 | -1) => `M0 0C${n(side * len * 0.4)} ${n(-len * 0.35)} ${n(side * len * 0.85)} ${n(-len * 0.3)} ${n(side * len)} ${n(-len * 0.55)}C${n(side * len * 0.6)} ${n(-len * 0.05)} ${n(side * len * 0.25)} ${n(len * 0.02)} 0 0Z`;

/** One flower: stem, leaves, and petals (use #bl). */
function flowerSvg(r: Rng, kind: Flower, x: number, base: number, h: number, scale: number, alt: boolean): string {
  const bend = r.range(-h * 0.18, h * 0.18);
  const tipX = kind === "bell" ? bend + r.range(18, 32) * (bend >= 0 ? 1 : -1) : bend;
  const tipY = kind === "bell" ? -h + r.range(4, 16) : -h;
  const stem = kind === "bell" ? `M0 0Q${n(bend * 0.4)} ${n(-h * 0.7)} ${n(bend)} ${n(-h - 8)}T${n(tipX)} ${n(tipY)}` : `M0 0Q${n(bend * 0.2)} ${n(-h * 0.55)} ${n(bend)} ${n(-h)}`;
  const leaves: string[] = [];
  const nl = r.int(1, 2);
  for (let i = 0; i < nl; i++) {
    const t = r.range(0.18, 0.5);
    const lx = bend * t * t;
    const ly = -h * t;
    const side = (i % 2 === 0 ? 1 : -1) as 1 | -1;
    leaves.push(`<path class="lf" transform="translate(${n(lx)} ${n(ly)}) rotate(${n(r.range(-12, 12))})" d="${leafPath(r.range(26, 42) * scale, side)}"/>`);
  }
  const rot = kind === "bell" ? r.range(-8, 8) : bend * 0.12 + r.range(-6, 6);
  const tone = alt ? ` style="--c:var(--flower-2)"` : "";
  const t = n(r.range(4.5, 7.5));
  const d = n(-r.range(0, 6));
  return `<g transform="translate(${n(x)} ${n(base)})"><g class="sw" style="--t:${t}s;--d:${d}s"><path class="st" d="${stem}"/>${leaves.join("")}<use href="#bl"${tone} transform="translate(${n(tipX)} ${n(tipY)}) rotate(${n(rot)}) scale(${n(scale, 2)})"/></g></g>`;
}

/** Grass tuft: several blades in one path. */
function grassClump(r: Rng, x: number, base: number, hMax: number, cls: string): string {
  let d = "";
  const blades = r.int(5, 9);
  for (let i = 0; i < blades; i++) {
    const bx = r.range(-26, 26);
    const h = r.range(hMax * 0.45, hMax);
    const lean = r.range(-h * 0.35, h * 0.35);
    const w = r.range(3, 6);
    d += `M${n(bx - w)} 0Q${n(bx + lean * 0.4)} ${n(-h * 0.6)} ${n(bx + lean)} ${n(-h)}Q${n(bx + lean * 0.3 + w)} ${n(-h * 0.5)} ${n(bx + w)} 0Z`;
  }
  return `<g transform="translate(${n(x)} ${n(base)})"><path class="sw ${cls}" style="--t:${n(r.range(5, 8))}s;--d:${n(-r.range(0, 5))}s" d="${d}"/></g>`;
}

function stars(r: Rng, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const x = r.range(0, W);
    const y = r.range(0, H * 0.55);
    out.push(`<circle class="tw" cx="${n(x, 0)}" cy="${n(y, 0)}" r="${n(r.range(0.7, 2.1))}" style="--d:${n(-r.range(0, 5))}s"/>`);
  }
  return out.join("");
}

/** Rasi berbentuk hati (taman kunang). */
function heartConstellation(cx: number, cy: number, s: number): string {
  const pts: [number, number][] = [];
  for (let i = 0; i < 12; i++) {
    const t = (i / 12) * Math.PI * 2;
    const x = 16 * Math.sin(t) ** 3;
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    pts.push([cx + x * s, cy + y * s]);
  }
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("") + "Z";
  const dots = pts.map(([x, y], i) => `<circle class="tw hs" cx="${n(x)}" cy="${n(y)}" r="2.6" style="--d:${n(-i * 0.4)}s"/>`).join("");
  return `<g class="heart" aria-hidden="true"><path class="cl" d="${line}"/>${dots}</g>`;
}

function hills(r: Rng): string {
  let d = `M0 ${H}L0 ${n(H * 0.7)}`;
  const steps = 8;
  for (let i = 1; i <= steps; i++) {
    const x = (W / steps) * i;
    const y = H * r.range(0.62, 0.74);
    d += `Q${n(x - W / steps / 2)} ${n(y - r.range(20, 60))} ${n(x)} ${n(y)}`;
  }
  return `<path class="hill" d="${d}L${W} ${H}Z"/>`;
}

/* ----------------------------- adegan ------------------------------ */

/** Lotus floating on round leaves (used when there is a pond). */
function floatingFlower(r: Rng, x: number, y: number, scale: number, alt: boolean): string {
  const tone = alt ? ` style="--c:var(--flower-2)"` : "";
  const pad = `<ellipse class="pad" cx="${n(r.range(-10, 10))}" cy="4" rx="${n(34 * scale)}" ry="${n(9 * scale)}"/>`;
  return `<g transform="translate(${n(x)} ${n(y)})">${pad}<g class="bob" style="--t:${n(r.range(5, 8))}s;--d:${n(-r.range(0, 6))}s"><use href="#bl"${tone} transform="scale(${n(scale, 2)})"/></g></g>`;
}

/** A flowering branch from the top-left corner. */
function branchLayer(r: Rng): string {
  const main = "M-40 30C120 60 260 110 420 170S700 250 820 236";
  const twigs = ["M160 74C190 30 240 18 290 20", "M330 140C360 200 420 230 470 236", "M520 205C560 160 610 150 660 160", "M260 112C250 160 270 200 300 226"];
  const spots: [number, number][] = [[60, 46], [110, 58], [190, 40], [240, 24], [290, 22], [210, 86], [300, 128], [350, 150], [400, 196], [450, 226], [470, 238], [530, 200], [580, 166], [640, 158], [690, 228], [760, 238], [810, 234], [270, 196], [300, 226], [150, 70]];
  const blooms = spots.map(([x, y], i) => `<use href="#bl"${i % 3 === 0 ? ` style="--c:var(--flower-2)"` : ""} transform="translate(${n(x + r.range(-8, 8))} ${n(y + r.range(-8, 8))}) rotate(${n(r.range(0, 72))}) scale(${n(r.range(0.8, 1.35), 2)})"/>`).join("");
  return `<g class="bsw"><path class="br" d="${main}"/>${twigs.map((d) => `<path class="br tw2" d="${d}"/>`).join("")}<g class="bloom-b">${blooms}</g></g>`;
}

function scene(s: AnimSpec): string {
  const r = rng(s.seed);
  const groundBase = s.pond ? H * 0.74 : H * 0.82;
  const backGrass: string[] = [];
  for (let x = -20; x < W + 40; x += r.range(30, 52)) backGrass.push(grassClump(r, x, groundBase + r.range(-8, 8), 90, "gb"));
  const backFlowers: string[] = [];
  for (let x = 40; x < W; x += r.range(70, 120)) backFlowers.push(flowerSvg(r, s.flower, x, groundBase + 2 + r.range(-6, 10), r.range(110, 190) * (s.pond ? 0.6 : 1), 0.75, r.next() < 0.35));
  const frontFlowers: string[] = [];
  const frontGrass: string[] = [];
  if (s.pond) {
    for (let x = 60; x < W; x += r.range(140, 220)) frontFlowers.push(floatingFlower(r, x, H * r.range(0.83, 0.95), r.range(1.1, 1.8), r.next() < 0.3));
  } else {
    for (let x = 20; x < W; x += r.range(95, 150)) frontFlowers.push(flowerSvg(r, s.flower, x, H + 10, r.range(200, 330), 1.15, r.next() < 0.3));
    for (let x = -20; x < W + 40; x += r.range(34, 60)) frontGrass.push(grassClump(r, x, H + 6, 120, "gf"));
  }

  const moonHalo = `<circle class="mh" cx="${s.moon.x}" cy="${s.moon.y}" r="${n(s.moon.r * 2.1)}" fill="url(#moonHalo)"/>`;
  const moon = s.moon.crescent
    ? `<mask id="cres"><circle cx="${s.moon.x}" cy="${s.moon.y}" r="${s.moon.r}" fill="#fff"/><circle cx="${n(s.moon.x + s.moon.r * 0.42)}" cy="${n(s.moon.y - s.moon.r * 0.18)}" r="${n(s.moon.r * 0.86)}" fill="#000"/></mask><g class="moon">${moonHalo}<circle cx="${s.moon.x}" cy="${s.moon.y}" r="${s.moon.r}" mask="url(#cres)"/></g>`
    : `<g class="moon">${moonHalo}<circle cx="${s.moon.x}" cy="${s.moon.y}" r="${s.moon.r}"/></g>`;

  const pond = s.pond
    ? `<g class="px" data-depth="20"><rect class="pond" x="-60" y="${n(H * 0.76)}" width="${W + 120}" height="${n(H * 0.3)}"/><g class="refl">${Array.from({ length: 7 }, (_, i) => `<ellipse cx="${n(s.moon.x + r.range(-6, 6))}" cy="${n(H * 0.8 + i * 16)}" rx="${n(s.moon.r * (0.95 - i * 0.1))}" ry="2.2" style="--d:${n(-i * 0.7)}s"/>`).join("")}</g>${Array.from({ length: 14 }, () => `<path class="ripple" d="M${n(r.range(0, W), 0)} ${n(r.range(H * 0.79, H * 0.99), 0)}h${n(r.range(40, 140), 0)}" style="--d:${n(-r.range(0, 6))}s"/>`).join("")}</g>`
    : "";

  return `<svg class="scene" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
<defs>
${blossomDef(s.flower)}
<radialGradient id="halo"><stop offset="0" style="stop-color:var(--glow);stop-opacity:.55"/><stop offset=".45" style="stop-color:var(--glow);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--glow);stop-opacity:0"/></radialGradient>
<radialGradient id="moonHalo"><stop offset=".45" style="stop-color:#fff6dc;stop-opacity:.55"/><stop offset=".62" style="stop-color:#fff6dc;stop-opacity:.16"/><stop offset="1" style="stop-color:#fff6dc;stop-opacity:0"/></radialGradient>
${s.pond ? `<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--sky-2)"/><stop offset="1" style="stop-color:var(--sky-1)"/></linearGradient>` : ""}
</defs>
<g class="px" data-depth="4">${stars(r, 90)}${s.extra === "constellation" ? heartConstellation(W * 0.74, H * 0.2, 5.2) : ""}</g>
<g class="px" data-depth="7">${moon}</g>
<g class="px" data-depth="12">${hills(r)}</g>
<g class="px ly" data-depth="18" style="--ld:-0.6s">${backGrass.join("")}</g>
<g class="px ly bloom" data-depth="24" style="--ld:-1.8s">${backFlowers.join("")}</g>
${pond}
<g class="px ly bloom" data-depth="34" style="--ld:-3.1s">${frontFlowers.join("")}</g>
<g class="px ly" data-depth="44" style="--ld:-4.4s">${frontGrass.join("")}</g>
${s.branch ? `<g class="px ly bloom" data-depth="30" style="--ld:-2.2s"><g transform="translate(${W} -10) scale(-1.3 1.3)">${branchLayer(r)}</g></g>` : ""}
</svg>`;
}

const BUTTERFLY = `<svg viewBox="-20 -16 40 32"><g class="wing"><path d="M0 0C-6-14-20-16-18-4-17 2-8 4 0 0ZM0 0C-5 6-14 14-16 8-17 3-8 1 0 0Z"/></g><g class="wing r"><path d="M0 0C6-14 20-16 18-4 17 2 8 4 0 0ZM0 0C5 6 14 14 16 8 17 3 8 1 0 0Z"/></g><path class="body" d="M0-7V8"/></svg>`;
const HEART = `<svg viewBox="0 0 32 30"><path d="M16 29C6 21 0 15 0 8.5 0 3.8 3.7 0 8.4 0 11.6 0 14.4 1.9 16 4.6 17.6 1.9 20.4 0 23.6 0 28.3 0 32 3.8 32 8.5 32 15 26 21 16 29Z"/></svg>`;

function extraLayer(s: AnimSpec): string {
  const r = rng(s.seed + 7);
  if (s.extra === "petals")
    return `<div class="petals" aria-hidden="true">${Array.from({ length: 9 }, () => `<i style="left:${n(r.range(2, 96))}%;--t:${n(r.range(9, 16))}s;--d:${n(-r.range(0, 14))}s;--x:${n(r.range(-12, 12))}vw"></i>`).join("")}</div>`;
  if (s.extra === "lanterns")
    return `<div class="lanterns" aria-hidden="true">${Array.from({ length: 7 }, () => `<i style="left:${n(r.range(4, 94))}%;--t:${n(r.range(18, 30))}s;--d:${n(-r.range(0, 26))}s;--s:${n(r.range(0.6, 1.1), 2)}"></i>`).join("")}</div>`;
  if (s.extra === "butterflies")
    return `<div class="butterflies" aria-hidden="true">${Array.from({ length: 5 }, (_, i) => `<i style="left:${n(8 + i * 18 + r.range(-4, 4))}%;top:${n(r.range(42, 70))}%;--t:${n(r.range(9, 15))}s;--d:${n(-r.range(0, 9))}s;--x:${n(r.range(-14, 14))}vw;--y:${n(r.range(-22, -8))}vh;--s:${n(r.range(0.7, 1.15), 2)}">${BUTTERFLY}</i>`).join("")}</div>`;
  if (s.extra === "meteors")
    return `<div class="meteors" aria-hidden="true">${Array.from({ length: 4 }, () => `<i style="left:${n(r.range(20, 95))}%;top:${n(r.range(2, 28))}%;--t:${n(r.range(7, 12))}s;--d:${n(-r.range(0, 10))}s"></i>`).join("")}</div>`;
  if (s.extra === "hearts")
    return `<div class="hearts" aria-hidden="true">${Array.from({ length: 8 }, () => `<i style="left:${n(r.range(4, 94))}%;--t:${n(r.range(12, 20))}s;--d:${n(-r.range(0, 18))}s;--s:${n(r.range(0.5, 1.1), 2)};--x:${n(r.range(-6, 6))}vw">${HEART}</i>`).join("")}</div>`;
  return "";
}

/* ------------------------------- CSS ------------------------------- */

/** Theme variables (editable through the Colors & style form). --speed: 1 normal, 0.5 slower, 2 faster. */
function themeVars(s: AnimSpec): ThemeVar[] {
  const c = s.colors;
  return [
    { name: "--sky-1", value: c.sky[0], label: "Langit bawah" },
    { name: "--sky-2", value: c.sky[1], label: "Langit tengah" },
    { name: "--sky-3", value: c.sky[2], label: "Langit atas" },
    { name: "--flower", value: c.flower, label: "Warna bunga" },
    { name: "--flower-2", value: c.flower2, label: "Warna bunga kedua" },
    { name: "--flower-center", value: c.center, label: "Tengah bunga" },
    { name: "--glow", value: c.glow, label: "Cahaya bunga" },
    { name: "--leaf", value: c.leaf, label: s.branch ? "Dahan, batang, dan daun" : "Batang dan daun" },
    { name: "--grass", value: c.grass, label: "Rumput depan" },
    { name: "--grass-far", value: c.grassFar, label: "Rumput belakang" },
    { name: "--hill", value: c.hill, label: "Bukit" },
    { name: "--firefly", value: c.firefly, label: "Kunang-kunang" },
    { name: "--ink", value: c.ink, label: "Warna teks" },
    { name: "--speed", value: "1", label: "Kecepatan animasi", range: [0.25, 3, 0.05] },
  ];
}

function css(s: AnimSpec): string {
  return `
:root {
  --font-display: "${s.font.display}", Georgia, serif;
  --font-text: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
* { box-sizing: border-box; }
html, body { margin: 0; height: 100%; }
body { background: var(--sky-1); color: var(--ink); font-family: var(--font-text); overflow: hidden; }
.stage { position: fixed; inset: 0; overflow: hidden; background: radial-gradient(120% 90% at 70% 0%, var(--sky-3) 0%, var(--sky-2) 45%, var(--sky-1) 100%); }
.scene { position: absolute; inset: 0; width: 100%; height: 100%; }
#flies { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; mix-blend-mode: screen; }
.px { transition: transform 0.9s cubic-bezier(.2,.7,.2,1); will-change: transform; }

.tw { fill: #fff8e7; animation: twinkle calc(4s / var(--speed)) ease-in-out var(--d, 0s) infinite alternate; }
.hs { fill: var(--glow); }
.cl { fill: none; stroke: var(--glow); stroke-opacity: .25; stroke-width: 1.2; stroke-dasharray: 3 7; }
.moon circle { fill: #fff6dc; }
.moon .mh { fill: url(#moonHalo); }
.moon { animation: breathe calc(9s / var(--speed)) ease-in-out infinite alternate; transform-box: fill-box; transform-origin: center; }
.hill { fill: var(--hill); }
.gb { fill: var(--grass-far); }
.gf { fill: var(--grass); }
.st { fill: none; stroke: var(--leaf); stroke-width: 3; stroke-linecap: round; }
.lf { fill: var(--leaf); }
.p1 { fill: var(--c, var(--flower)); }
.p2 { fill: var(--glow); fill-opacity: .55; stroke: none; }
.p3 { fill: none; stroke: var(--glow); stroke-opacity: .5; stroke-width: 1.5; }
.ct { fill: var(--flower-center); }
${s.flower === "rose" ? ".p2 { fill: none; stroke: var(--glow); stroke-opacity: .75; stroke-width: 2; }" : ""}

/* Sway: each flower & grass tuft sways from its base, with a different delay per layer (--ld). */
.sw { transform-box: fill-box; transform-origin: 50% 100%; animation: sway calc(var(--t, 6s) / var(--speed)) ease-in-out calc(var(--ld, 0s) + var(--d, 0s)) infinite alternate; }
.bloom use { animation: pulse calc(5s / var(--speed)) ease-in-out var(--d, 0s) infinite alternate; }

@keyframes sway { from { transform: rotate(-2.6deg); } to { transform: rotate(2.6deg); } }
@keyframes twinkle { from { opacity: .25; } to { opacity: 1; } }
@keyframes breathe { from { opacity: .9; transform: scale(.985); } to { opacity: 1; transform: scale(1.015); } }
@keyframes pulse { from { opacity: .82; } to { opacity: 1; } }

.petals i, .lanterns i { position: absolute; top: -6vh; display: block; pointer-events: none; }
.petals i { width: 14px; height: 10px; border-radius: 70% 0 70% 0; background: var(--flower); opacity: .8; box-shadow: 0 0 10px 1px var(--glow); animation: fall calc(var(--t) / var(--speed)) linear var(--d) infinite; }
@keyframes fall { from { transform: translate3d(0, 0, 0) rotate(0); } to { transform: translate3d(var(--x), 112vh, 0) rotate(540deg); } }
.lanterns i { top: auto; bottom: -10vh; width: calc(22px * var(--s)); height: calc(30px * var(--s)); border-radius: 40% 40% 30% 30%; background: radial-gradient(circle at 50% 65%, #fff4c9, var(--glow) 55%, transparent 75%); opacity: .75; animation: rise calc(var(--t) / var(--speed)) linear var(--d) infinite; }
@keyframes rise { 0% { transform: translate3d(0, 0, 0); opacity: 0; } 10% { opacity: .8; } 85% { opacity: .6; } 100% { transform: translate3d(4vw, -125vh, 0); opacity: 0; } }

/* Kolam, teratai, dahan (v17) */
.pond { fill: url(#water); }
.refl ellipse { fill: #fff6dc; opacity: .55; animation: shimmer calc(4s / var(--speed)) ease-in-out var(--d, 0s) infinite alternate; }
.ripple { fill: none; stroke: var(--glow); stroke-opacity: .35; stroke-width: 1.4; stroke-linecap: round; animation: shimmer calc(5s / var(--speed)) ease-in-out var(--d, 0s) infinite alternate; }
@keyframes shimmer { from { opacity: .15; transform: translateX(-10px); } to { opacity: .9; transform: translateX(10px); } }
.pad { fill: var(--leaf); fill-opacity: .9; }
.bob { animation: bob calc(var(--t, 6s) / var(--speed)) ease-in-out calc(var(--ld, 0s) + var(--d, 0s)) infinite alternate; }
@keyframes bob { from { transform: translateY(-3px); } to { transform: translateY(3px); } }
.br { fill: none; stroke: var(--leaf); stroke-width: 9; stroke-linecap: round; }
.br.tw2 { stroke-width: 4; }
.bsw { transform-box: view-box; transform-origin: 0 0; animation: bsway calc(9s / var(--speed)) ease-in-out infinite alternate; }
@keyframes bsway { from { transform: rotate(-.8deg); } to { transform: rotate(.8deg); } }
.bloom-b use { animation: pulse calc(5s / var(--speed)) ease-in-out infinite alternate; }

/* Kupu-kupu, bintang jatuh, hati (v17) */
.butterflies i, .meteors i, .hearts i { position: absolute; display: block; pointer-events: none; }
.butterflies i { width: calc(34px * var(--s)); animation: flutter calc(var(--t) / var(--speed)) ease-in-out var(--d) infinite alternate; filter: drop-shadow(0 0 6px var(--glow)); }
.butterflies svg { width: 100%; overflow: visible; }
.butterflies .wing { fill: var(--flower-2); transform-origin: 0 0; animation: flap calc(.32s / var(--speed)) ease-in-out infinite alternate; }
.butterflies .wing.r { fill: var(--flower); }
.butterflies .body { stroke: var(--ink); stroke-width: 2; stroke-linecap: round; }
@keyframes flap { from { transform: scaleX(1); } to { transform: scaleX(.25); } }
@keyframes flutter { 0% { transform: translate3d(0, 0, 0) rotate(-8deg); } 50% { transform: translate3d(calc(var(--x) * .5), calc(var(--y) * 1.1), 0) rotate(6deg); } 100% { transform: translate3d(var(--x), var(--y), 0) rotate(-4deg); } }
.meteors i { width: 140px; height: 2px; border-radius: 2px; background: linear-gradient(90deg, rgba(255,255,255,0), #fff8e7); transform: rotate(-28deg); opacity: 0; animation: meteor calc(var(--t) / var(--speed)) linear var(--d) infinite; }
@keyframes meteor { 0%, 88% { opacity: 0; translate: 0 0; } 90% { opacity: 1; } 100% { opacity: 0; translate: -38vw 20vw; } }
.hearts i { bottom: -8vh; width: calc(26px * var(--s)); opacity: .8; animation: rise calc(var(--t) / var(--speed)) linear var(--d) infinite; }
.hearts svg { width: 100%; fill: var(--flower); filter: drop-shadow(0 0 8px var(--glow)); }

/* Text */
.note { position: absolute; left: clamp(20px, 6vw, 96px); top: clamp(56px, 13vh, 140px); max-width: min(560px, calc(100vw - 40px)); z-index: 2; }
.note .to { margin: 0 0 14px; font-size: 15px; letter-spacing: .08em; color: var(--glow); }
.note h1 { margin: 0; font-family: var(--font-display); font-weight: 500; font-size: clamp(34px, 5.6vw, 68px); line-height: 1.08; color: #fffaf0; text-shadow: 0 2px 18px rgba(0,0,0,.55); }
.note p { margin: 18px 0 0; font-size: clamp(16px, 1.6vw, 19px); line-height: 1.6; color: var(--ink); text-shadow: 0 1px 10px rgba(0,0,0,.6); max-width: 46ch; }
.note .from { margin-top: 22px; font-family: var(--font-display); font-style: italic; font-size: 22px; color: #fffaf0; }
.scrim { position: absolute; inset: 0; z-index: 1; pointer-events: none; background: radial-gradient(70% 60% at ${s.align === "right" ? "82%" : s.align === "center" ? "50%" : "18%"} 22%, rgba(0,0,0,.35), transparent 70%); }
${s.align === "right" ? "@media (min-width: 641px) { .note { left: auto; right: clamp(20px, 6vw, 96px); text-align: right; } .note p { margin-left: auto; } }" : ""}
${s.branch ? "@media (max-width: 640px) { body .note { top: 30vh; } .scrim { background: radial-gradient(90% 50% at 30% 45%, rgba(0,0,0,.45), transparent 75%); } }" : ""}
${s.align === "center" ? ".note { left: 50%; transform: translateX(-50%); width: min(640px, calc(100vw - 40px)); text-align: center; } .note p { margin-left: auto; margin-right: auto; }" : ""}

/* Kontrol */
.controls { position: absolute; right: 16px; bottom: 16px; z-index: 3; display: flex; gap: 8px; }
.controls button { min-height: 44px; padding: 0 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,.28); background: rgba(10,10,25,.55); color: #fffaf0; font: 500 14px var(--font-text); cursor: pointer; backdrop-filter: blur(6px); }
.controls button:hover { background: rgba(10,10,25,.75); }
.controls button:focus-visible { outline: 2px solid var(--glow); outline-offset: 2px; }

.paused *, .paused { animation-play-state: paused !important; }
@media (max-width: 640px) {
  .note { top: 40px; }
  .controls { left: 16px; right: 16px; justify-content: center; }
}
@media (prefers-reduced-motion: reduce) {
  .sw, .tw, .moon, .bloom use, .refl ellipse, .petals i, .lanterns i, .bob, .bsw, .ripple, .bloom-b use, .butterflies i, .butterflies .wing, .meteors i, .hearts i { animation: none; }
  .meteors { display: none; }
  .px { transition: none; }
}
`;
}

/* ------------------------------- JS -------------------------------- */

function script(): string {
  return `
/* ==== CONFIGURATION (can also be changed in the OneWebDev editor) ====
   fireflies        : maximum number of fireflies (limit 60)
   firefliesNarrow  : number on narrow screens (< 640px)
   parallax         : parallax follows the pointer
   parallaxOnMobile : also enable on touch phones/tablets */
const CONFIG = ${dataBlock("CONFIG", "Pengaturan animasi", { fireflies: 60, firefliesNarrow: 24, parallax: true, parallaxOnMobile: false })};
/* ================================================================ */

const stage = document.querySelector(".stage");
const canvas = document.getElementById("flies");
const ctx = canvas.getContext("2d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)");
const coarse = matchMedia("(pointer: coarse), (max-width: 768px)");
let paused = false;
let flies = [];
let w = 0, h = 0, dpr = 1, raf = 0;

const css = getComputedStyle(document.documentElement);
const speed = () => parseFloat(css.getPropertyValue("--speed")) || 1;

/* Light sprite: drawn once, then copied (lighter than a gradient per particle). */
const sprite = document.createElement("canvas");
function makeSprite() {
  const color = css.getPropertyValue("--firefly").trim() || "#ffe08a";
  sprite.width = sprite.height = 64;
  const g = sprite.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "#ffffff");
  grd.addColorStop(0.18, color);
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
}

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = canvas.clientWidth; h = canvas.clientHeight;
  canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const max = Math.min(60, w < 640 ? CONFIG.firefliesNarrow : CONFIG.fireflies);
  while (flies.length < max) flies.push(spawn());
  flies.length = max;
}

function spawn() {
  return { x: Math.random() * w, y: h * (0.35 + Math.random() * 0.6), a: Math.random() * Math.PI * 2, v: 8 + Math.random() * 14, p: Math.random() * Math.PI * 2, s: 10 + Math.random() * 14 };
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000) * speed();
  last = now;
  ctx.clearRect(0, 0, w, h);
  ctx.globalCompositeOperation = "lighter";
  for (const f of flies) {
    f.a += (Math.random() - 0.5) * 1.6 * dt;
    f.x += Math.cos(f.a) * f.v * dt;
    f.y += Math.sin(f.a) * f.v * dt * 0.6;
    f.p += dt * 1.7;
    if (f.x < -20) f.x = w + 20; else if (f.x > w + 20) f.x = -20;
    if (f.y < h * 0.25 || f.y > h + 10) f.a = -f.a;
    const glow = 0.25 + 0.75 * Math.max(0, Math.sin(f.p));
    ctx.globalAlpha = glow;
    ctx.drawImage(sprite, f.x - f.s / 2, f.y - f.s / 2, f.s, f.s);
  }
  ctx.globalAlpha = 1;
  if (!paused && !reduce.matches && !document.hidden) raf = requestAnimationFrame(frame);
}
function start() { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(frame); }

/* Parallax: each layer shifts by its depth (data-depth, pixels). */
const layers = [...document.querySelectorAll(".px")].map((el) => ({ el, d: +el.dataset.depth || 0 }));
let parallaxOn = CONFIG.parallax && (CONFIG.parallaxOnMobile || !coarse.matches);
function onPointer(e) {
  if (!parallaxOn || paused || reduce.matches) return;
  const nx = e.clientX / innerWidth - 0.5;
  const ny = e.clientY / innerHeight - 0.5;
  for (const l of layers) l.el.style.transform = "translate(" + (-nx * l.d).toFixed(1) + "px," + (-ny * l.d * 0.5).toFixed(1) + "px)";
}
function resetParallax() { for (const l of layers) l.el.style.transform = ""; }
addEventListener("pointermove", onPointer, { passive: true });

/* Kontrol */
const btnPause = document.getElementById("pause");
const btnPx = document.getElementById("parallax");
function syncButtons() {
  btnPause.textContent = paused ? "Lanjutkan animasi" : "Jeda animasi";
  btnPause.setAttribute("aria-pressed", String(paused));
  btnPx.textContent = parallaxOn ? "Parallax: aktif" : "Parallax: mati";
  btnPx.setAttribute("aria-pressed", String(parallaxOn));
}
btnPause.addEventListener("click", () => {
  paused = !paused;
  stage.classList.toggle("paused", paused);
  if (!paused) start();
  syncButtons();
});
btnPx.addEventListener("click", () => {
  parallaxOn = !parallaxOn;
  if (!parallaxOn) resetParallax();
  syncButtons();
});

document.addEventListener("visibilitychange", () => { if (!document.hidden && !paused) start(); });
reduce.addEventListener("change", () => { resetParallax(); start(); });
addEventListener("resize", resize);

makeSprite();
resize();
syncButtons();
if (window.OWD_THUMB) { frame(performance.now()); stage.classList.add("paused"); }
else start();
`;
}

export function buildAnim(s: AnimSpec): string {
  const body = `
<div class="stage">
${scene(s)}
${extraLayer(s)}
<canvas id="flies" aria-hidden="true"></canvas>
<div class="scrim"></div>
<main class="note">
  <p class="to"${ot("untuk", "Untuk (sapaan)")}>${esc(s.to)}</p>
  <h1${ot("judul", "Judul")}>${esc(s.heading)}</h1>
  <p${ot("pesan", "Pesan", true)}>${esc(s.text)}</p>
  <p class="from"${ot("dari", "Dari (tanda tangan)")}>${esc(s.from)}</p>
</main>
<div class="controls">
  <button type="button" id="pause" aria-pressed="false">Jeda animasi</button>
  <button type="button" id="parallax" aria-pressed="true">Parallax: aktif</button>
</div>
</div>
<script>
${script().trim()}
</script>`;
  return doc({
    title: s.title,
    description: s.description,
    theme: s.colors.sky[0],
    head: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${s.font.href}">`,
    vars: themeVars(s),
    css: css(s),
    body,
  });
}

/* ------------------------------ 6 varian --------------------------- */

export const ANIM_SPECS: AnimSpec[] = [
  {
    id: "anim-taman-kunang",
    title: "Taman Kunang-Kunang",
    description: "Animasi taman tulip bercahaya di malam hari, kunang-kunang, dan rasi bintang berbentuk hati.",
    seed: 11,
    flower: "tulip",
    extra: "constellation",
    colors: {
      sky: ["#070b1f", "#141a44", "#3a2a6b"],
      flower: "#ff7eb6",
      flower2: "#ffb37a",
      center: "#fff1b8",
      glow: "#ffd1e6",
      leaf: "#2f8a6e",
      grass: "#0f3b33",
      grassFar: "#173f4a",
      hill: "#101b3a",
      firefly: "#ffe28a",
      ink: "#f3e9ff",
    },
    moon: { x: 1300, y: 150, r: 46 },
    to: "Untuk Nadia,",
    heading: "Di taman ini, setiap cahaya menyebut namamu.",
    text: "Kunang-kunang kecil berjaga sampai pagi, menjaga satu janji sederhana: ke mana pun aku pergi, aku selalu pulang padamu.",
    from: "Dengan sayang, Raka",
    font: { display: "Cormorant Garamond", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;1,500&display=swap" },
  },
  {
    id: "anim-mawar-rembulan",
    title: "Mawar di Bawah Rembulan",
    description: "Animasi taman mawar berpendar keemasan di bawah bulan sabit, dengan kelopak yang jatuh perlahan.",
    seed: 29,
    flower: "rose",
    extra: "petals",
    colors: {
      sky: ["#12060c", "#2a0b1c", "#5a1d36"],
      flower: "#e0315b",
      flower2: "#ff8fa3",
      center: "#ffd27a",
      glow: "#ffc978",
      leaf: "#3f7a4a",
      grass: "#1a2e1c",
      grassFar: "#2a2328",
      hill: "#1e0d17",
      firefly: "#ffd27a",
      ink: "#ffeef2",
    },
    moon: { x: 1240, y: 170, r: 64, crescent: true },
    to: "Teruntuk Kirana,",
    heading: "Rembulan pun menunduk saat kau tersenyum.",
    text: "Seribu mawar kutanam di halaman malam, dan semuanya mekar pada saat yang sama: ketika kau bilang iya.",
    from: "Selamanya, Dimas",
    font: { display: "Playfair Display", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;1,500&display=swap" },
  },
  {
    id: "anim-lentera-asmara",
    title: "Lentera Asmara",
    description: "Animasi bunga lonceng yang menyala seperti lentera, kunang-kunang biru, dan lampion yang terbang ke langit.",
    seed: 47,
    flower: "bell",
    extra: "lanterns",
    colors: {
      sky: ["#04101a", "#0b2433", "#21405e"],
      flower: "#b69cff",
      flower2: "#7fd4ff",
      center: "#fff3c4",
      glow: "#c9b8ff",
      leaf: "#3c8f86",
      grass: "#0c2b2e",
      grassFar: "#123543",
      hill: "#0a1d2b",
      firefly: "#9ff3ff",
      ink: "#e6f4ff",
    },
    moon: { x: 260, y: 140, r: 40 },
    align: "right",
    to: "Untuk Laras, di hari jadi kita,",
    heading: "Lentera-lentera kecil ini menyala untuk satu nama.",
    text: "Setiap bunga lonceng menyimpan satu doa yang kuucapkan diam-diam. Malam ini, semuanya kubiarkan terbang ke langit bersamamu.",
    from: "Peluk dari jauh, Bayu",
    font: { display: "Fraunces", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap" },
  },
  {
    id: "anim-padang-aster",
    title: "Padang Aster",
    description: "Animasi padang bunga aster putih di senja ungu, kupu-kupu bercahaya, dan kunang-kunang.",
    seed: 63,
    flower: "daisy",
    extra: "butterflies",
    colors: {
      sky: ["#120d2a", "#2b1f5c", "#7b4a8f"],
      flower: "#f7f1ff",
      flower2: "#ffd2ef",
      center: "#ffc93d",
      glow: "#e4d2ff",
      leaf: "#4f9c7c",
      grass: "#142a33",
      grassFar: "#1f3550",
      hill: "#18163a",
      firefly: "#fff0a6",
      ink: "#f3edff",
    },
    moon: { x: 1360, y: 130, r: 36 },
    align: "center",
    to: "Untuk Alya,",
    heading: "Setiap kelopak di padang ini menghitung hari bersamamu.",
    text: "Kupu-kupu kecil ini kuminta menyampaikan satu pesan: terima kasih sudah membuat hari-hari biasa terasa seperti musim semi.",
    from: "Yang selalu menunggumu, Gilang",
    font: { display: "Lora", href: "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;1,500&display=swap" },
  },
  {
    id: "anim-teratai-purnama",
    title: "Teratai Purnama",
    description: "Animasi kolam teratai bercahaya di bawah bulan purnama, pantulan bulan di air, riak, dan bintang jatuh.",
    seed: 81,
    flower: "lotus",
    extra: "meteors",
    pond: true,
    colors: {
      sky: ["#020b14", "#0b2638", "#1f4d66"],
      flower: "#ff9ec4",
      flower2: "#ffd3e4",
      center: "#ffe9a3",
      glow: "#ffc6de",
      leaf: "#2d7d6a",
      grass: "#0b2a2a",
      grassFar: "#123b44",
      hill: "#08202c",
      firefly: "#c2f6ff",
      ink: "#eaf7ff",
    },
    moon: { x: 330, y: 170, r: 66 },
    align: "right",
    to: "Teruntuk Maya,",
    heading: "Purnama menitipkan cahayanya di kolam ini, untukmu.",
    text: "Seperti teratai yang tetap mekar di air yang tenang, aku ingin tumbuh pelan-pelan bersamamu. Buat permohonan saat bintang jatuh lewat.",
    from: "Dari yang mencintaimu, Arya",
    font: { display: "Cormorant", href: "https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,500;1,500&display=swap" },
  },
  {
    id: "anim-sakura-senja",
    title: "Sakura Senja",
    description: "Animasi dahan sakura yang bergoyang di langit senja merah muda, taman sakura bercahaya, dan hati yang terbang.",
    seed: 97,
    flower: "sakura",
    extra: "hearts",
    branch: true,
    colors: {
      sky: ["#1d0f2c", "#4b1f4d", "#b0546b"],
      flower: "#ffc2d6",
      flower2: "#ff8fb3",
      center: "#ffe2a4",
      glow: "#ffd9e8",
      leaf: "#5a3446",
      grass: "#29152e",
      grassFar: "#3a1c3b",
      hill: "#23112a",
      firefly: "#ffd8e6",
      ink: "#fff0f5",
    },
    moon: { x: 760, y: 96, r: 30 },
    to: "Untuk Salsa, di hari ulang tahunmu,",
    heading: "Sakura mekar lebih awal tahun ini.",
    text: "Katanya ingin ikut merayakan hari lahirmu. Semoga tahun ini penuh tawa, sehat selalu, dan semua doa baikmu terkabul satu per satu.",
    from: "Selamat ulang tahun, sayang. Fikri",
    font: { display: "Marcellus", href: "https://fonts.googleapis.com/css2?family=Marcellus&display=swap" },
  },
];
