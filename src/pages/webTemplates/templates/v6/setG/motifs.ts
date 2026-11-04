/* ================================================================== */
/* Set G illustration motifs (in-house SVG, ASCII, no external URLs).   */
/* Each motif draws one 1200x700 scene with colors from the template    */
/* palette, so one motif can look different in another template.       */
/* Objects are drawn at x 520-1100 then shifted to the center (see scene) so */
/* they stay whole when cropped to portrait/square ratios.              */
/* ================================================================== */

export interface Ink {
  /** Background gradient. */
  a: string;
  b: string;
  /** Main object color. */
  m: string;
  /** Aksen. */
  c: string;
  /** Lines/dark. */
  d: string;
  /** Terang. */
  l: string;
}

const r = (x: number, y: number, w: number, h: number, f: string, rx = 0, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}"${rx ? ` rx="${rx}"` : ""} fill="${f}"${extra}/>`;
const c = (x: number, y: number, rr: number, f: string, o = 1) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${f}"${o < 1 ? ` opacity="${o}"` : ""}/>`;
const p = (d: string, f: string, extra = "") => `<path d="${d}" fill="${f}"${extra}/>`;
const s = (d: string, st: string, w: number, extra = "") => `<path d="${d}" fill="none" stroke="${st}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"${extra}/>`;
const e = (x: number, y: number, rx: number, ry: number, f: string, o = 1) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${f}"${o < 1 ? ` opacity="${o}"` : ""}/>`;
const shadow = (x: number, y: number, w: number) => e(x, y, w, w * 0.12, "#000000", 0.12);

/** Decorative circles in the background. */
const deco = (k: Ink) => c(1060, 120, 160, k.l, 0.25) + c(140, 620, 200, k.c, 0.14) + c(980, 640, 60, k.c, 0.3);

const MOTIFS = {
  storefront: (k: Ink) =>
    deco(k) +
    shadow(800, 600, 360) +
    r(520, 260, 560, 340, k.l, 8) +
    p("M500 260 L540 170 H1060 L1100 260Z", k.m) +
    [0, 1, 2, 3, 4, 5, 6].map((i) => p(`M${500 + i * 86} 260 q43 50 86 0`, i % 2 ? k.l : k.c)).join("") +
    r(570, 330, 200, 160, k.a, 6) +
    r(820, 330, 110, 270, k.m, 6) +
    c(910, 470, 8, k.l) +
    r(960, 330, 90, 160, k.a, 6) +
    r(600, 360, 60, 60, k.c, 30) +
    r(680, 400, 60, 90, k.m, 8) +
    r(690, 200, 220, 40, k.d, 20),
  cup: (k: Ink) =>
    deco(k) +
    shadow(760, 600, 300) +
    e(760, 590, 260, 40, k.d, 0.25) +
    p("M560 330 H940 L900 560 Q890 600 850 600 H650 Q610 600 600 560Z", k.l) +
    p("M570 330 H930 L925 360 H575Z", k.m) +
    s("M935 380 Q1040 390 1020 470 Q1000 530 905 520", k.l, 28) +
    s("M680 290 Q650 240 690 200 Q730 160 700 110", k.c, 12) +
    s("M780 290 Q750 230 790 190 Q830 150 800 100", k.c, 12) +
    s("M860 280 Q840 240 870 210", k.c, 10) +
    r(640, 430, 220, 16, k.c, 8) +
    c(300, 520, 40, k.m, 0.6) +
    c(380, 560, 26, k.m, 0.5),
  plate: (k: Ink) =>
    deco(k) +
    shadow(760, 560, 330) +
    c(760, 380, 240, k.l) +
    c(760, 380, 186, k.a) +
    p("M640 370 Q680 270 790 290 Q890 310 880 410 Q850 480 740 470 Q640 450 640 370Z", k.m) +
    c(720, 350, 26, k.c) +
    c(800, 410, 20, k.l) +
    c(760, 440, 16, k.c) +
    p("M820 330 q30 -40 60 -10 q-20 40 -60 10Z", "#16a34a") +
    r(1050, 230, 16, 300, k.l, 8) +
    r(1090, 230, 16, 300, k.l, 8) +
    p("M420 520 Q400 420 460 380 Q520 420 490 520Z", k.c, ' opacity="0.8"'),
  skyline: (k: Ink) =>
    deco(k) +
    r(-400, 560, 2000, 140, k.d, 0, ' opacity="0.25"') +
    [
      [520, 260, 120, 300],
      [650, 180, 140, 380],
      [800, 300, 100, 260],
      [910, 220, 130, 340],
      [1050, 340, 110, 220],
    ]
      .map(([x, y, w, h], i) => r(x, y, w, h, i % 2 ? k.m : k.d, 4) + Array.from({ length: Math.floor(h / 60) }, (_, j) => r(x + 18, y + 24 + j * 60, w - 36, 22, k.l, 3, ' opacity="0.7"')).join(""))
      .join("") +
    p("M720 180 L720 120 L740 180Z", k.c) +
    c(420, 200, 70, k.c, 0.8),
  house: (k: Ink) =>
    deco(k) +
    r(-400, 580, 2000, 120, k.m, 0, ' opacity="0.25"') +
    shadow(800, 600, 340) +
    p("M540 330 L800 150 L1060 330Z", k.m) +
    r(580, 320, 440, 270, k.l, 4) +
    r(760, 430, 90, 160, k.d, 4) +
    c(830, 515, 7, k.c) +
    r(620, 380, 100, 90, k.a, 4, ` stroke="${k.d}" stroke-width="6"`) +
    r(890, 380, 100, 90, k.a, 4, ` stroke="${k.d}" stroke-width="6"`) +
    r(940, 180, 50, 100, k.d) +
    c(380, 480, 90, "#16a34a", 0.75) +
    r(372, 520, 16, 80, "#713f12"),
  plant: (k: Ink) =>
    deco(k) +
    shadow(780, 610, 220) +
    p("M660 450 H900 L870 600 H690Z", k.m) +
    r(650, 430, 260, 34, k.d, 8) +
    s("M780 440 V200", "#166534", 10) +
    p("M780 330 Q660 300 640 200 Q740 210 780 330Z", "#16a34a") +
    p("M780 280 Q900 250 930 150 Q820 160 780 280Z", "#22c55e") +
    p("M780 390 Q890 380 960 300 Q860 290 780 390Z", "#15803d") +
    p("M780 230 Q720 160 750 90 Q800 150 780 230Z", "#4ade80") +
    c(420, 300, 50, k.c, 0.5),
  mountains: (k: Ink) =>
    c(880, 220, 90, k.c) +
    p("M-400 600 L0 600 L260 300 L460 520 L700 220 L980 560 L1200 380 L1600 500 V700 H-400Z", k.m) +
    p("M700 220 L770 310 L730 300 L700 330 L660 300 L630 310Z", k.l) +
    p("M260 300 L310 360 L260 350 L220 370Z", k.l) +
    p("M-400 640 L0 640 Q300 560 600 620 T1200 600 L1600 600 V700 H-400Z", k.d, ' opacity="0.6"') +
    s("M120 180 l20 -12 l20 12 M180 150 l16 -10 l16 10", k.d, 5),
  waves: (k: Ink) =>
    c(820, 300, 130, k.c) +
    r(-400, 380, 2000, 320, k.m) +
    [0, 1, 2, 3].map((i) => s(`M-400 ${420 + i * 60} H0 Q150 ${400 + i * 60} 300 ${420 + i * 60} T600 ${420 + i * 60} T900 ${420 + i * 60} T1200 ${420 + i * 60} H1600`, k.l, 6, ' opacity="0.5"')).join("") +
    p("M300 380 L360 250 L420 380Z", k.l) +
    s("M360 250 V390", k.d, 6) +
    p("M280 390 H440 L420 420 H300Z", k.d),
  car: (k: Ink) =>
    deco(k) +
    p("M-400 560 L0 560 Q300 500 600 540 T1200 520 L1600 520 V700 H-400Z", k.d, ' opacity="0.35"') +
    p("M520 500 Q540 420 640 410 L720 340 Q750 320 820 320 L940 320 Q990 320 1020 360 L1060 410 Q1110 420 1110 470 L1110 500Z", k.m) +
    p("M740 350 L820 340 L820 400 L700 400Z", k.l) +
    p("M840 340 L930 340 Q970 342 990 370 L1010 400 H840Z", k.l) +
    c(640, 505, 46, k.d) +
    c(640, 505, 18, k.l) +
    c(990, 505, 46, k.d) +
    c(990, 505, 18, k.l) +
    r(1086, 440, 22, 16, k.c, 4),
  tools: (k: Ink) =>
    deco(k) +
    `<g transform="rotate(-30 780 360)">` +
    r(740, 160, 70, 420, k.m, 20) +
    p("M700 120 a80 80 0 1 0 150 0 l-40 0 l0 50 l-70 0 l0 -50Z", k.m) +
    `</g>` +
    c(930, 430, 110, k.d) +
    c(930, 430, 50, k.a) +
    Array.from({ length: 8 }, (_, i) => `<rect x="910" y="300" width="40" height="40" fill="${k.d}" transform="rotate(${i * 45} 930 430)"/>`).join("") +
    r(520, 520, 200, 30, k.c, 15),
  laptop: (k: Ink) =>
    deco(k) +
    shadow(780, 600, 380) +
    r(560, 200, 440, 290, k.d, 18) +
    r(580, 220, 400, 250, k.l, 6) +
    r(600, 240, 160, 18, k.m, 9) +
    r(600, 274, 240, 10, k.a, 5) +
    r(600, 296, 200, 10, k.a, 5) +
    r(600, 340, 110, 100, k.c, 8) +
    r(724, 340, 110, 100, k.m, 8, ' opacity="0.6"') +
    r(848, 340, 110, 100, k.a, 8) +
    p("M500 490 H1060 L1100 540 H460Z", k.m) +
    r(740, 500, 80, 10, k.l, 5),
  chart: (k: Ink) =>
    deco(k) +
    r(520, 150, 560, 420, k.l, 20) +
    [120, 200, 160, 260, 220, 320].map((h, i) => r(570 + i * 80, 520 - h, 50, h, i === 5 ? k.c : k.m, 6)).join("") +
    s("M580 380 L660 330 L740 350 L820 260 L900 290 L990 190", k.d, 8) +
    c(990, 190, 14, k.c) +
    r(560, 180, 160, 20, k.d, 10),
  books: (k: Ink) =>
    deco(k) +
    shadow(800, 600, 320) +
    r(560, 520, 460, 70, k.m, 6) +
    r(600, 450, 400, 70, k.c, 6) +
    r(580, 380, 430, 70, k.d, 6) +
    r(620, 310, 360, 70, k.m, 6, ' opacity="0.8"') +
    [520, 450, 380, 310].map((y) => r(980, y + 10, 6, 50, k.l, 3)).join("") +
    r(700, 140, 80, 170, k.c, 6) +
    r(790, 160, 70, 150, k.l, 6) +
    r(870, 120, 60, 190, k.m, 6),
  camera: (k: Ink) =>
    deco(k) +
    shadow(780, 590, 320) +
    r(560, 260, 460, 300, k.d, 34) +
    r(640, 210, 130, 70, k.d, 14) +
    c(790, 410, 120, k.l) +
    c(790, 410, 90, k.m) +
    c(790, 410, 50, k.d) +
    c(760, 380, 16, k.l) +
    r(930, 300, 50, 26, k.c, 8),
  music: (k: Ink) =>
    deco(k) +
    c(820, 380, 230, k.d) +
    [200, 170, 140, 110].map((rr) => `<circle cx="820" cy="380" r="${rr}" fill="none" stroke="${k.l}" stroke-opacity="0.18" stroke-width="3"/>`).join("") +
    c(820, 380, 70, k.m) +
    c(820, 380, 12, k.l) +
    s("M440 470 V240 L560 210 V440", k.c, 14) +
    c(415, 475, 34, k.c) +
    c(535, 445, 34, k.c),
  dumbbell: (k: Ink) =>
    deco(k) +
    `<g transform="rotate(-18 800 380)">` +
    r(620, 360, 360, 40, k.d, 10) +
    r(560, 290, 60, 180, k.m, 14) +
    r(510, 310, 50, 140, k.m, 14) +
    r(980, 290, 60, 180, k.m, 14) +
    r(1040, 310, 50, 140, k.m, 14) +
    `</g>` +
    r(560, 560, 200, 26, k.c, 13),
  flower: (k: Ink) =>
    deco(k) +
    s("M780 600 Q770 450 790 300", "#15803d", 10) +
    p("M785 470 Q700 430 690 370 Q760 380 785 470Z", "#16a34a") +
    [0, 72, 144, 216, 288].map((a) => `<ellipse cx="790" cy="230" rx="44" ry="80" fill="${k.m}" transform="rotate(${a} 790 300)"/>`).join("") +
    c(790, 300, 40, k.c) +
    s("M940 600 Q930 500 960 420", "#15803d", 8) +
    c(960, 400, 46, k.c) +
    c(960, 400, 20, k.l) +
    p("M680 560 H1000 L960 640 H720Z", k.d),
  paw: (k: Ink) =>
    deco(k) +
    e(800, 430, 130, 110, k.m) +
    e(670, 280, 50, 66, k.m) +
    e(770, 220, 50, 66, k.m) +
    e(880, 230, 50, 66, k.m) +
    e(960, 310, 46, 60, k.m) +
    c(420, 520, 30, k.c, 0.6) +
    c(480, 470, 18, k.c, 0.6),
  tooth: (k: Ink) =>
    deco(k) +
    p("M660 220 Q720 170 800 210 Q880 170 940 220 Q990 280 950 380 Q930 440 920 540 Q910 600 870 590 Q840 580 830 500 Q820 450 800 450 Q780 450 770 500 Q760 580 730 590 Q690 600 680 540 Q670 440 650 380 Q610 280 660 220Z", k.l, ` stroke="${k.m}" stroke-width="8"`) +
    s("M700 260 Q730 240 760 260", k.c, 8) +
    c(1000, 200, 18, k.c) +
    c(560, 280, 12, k.c),
  scissors: (k: Ink) =>
    deco(k) +
    s("M640 220 L920 480 M920 220 L640 480", k.d, 22) +
    `<circle cx="610" cy="510" r="56" fill="none" stroke="${k.m}" stroke-width="22"/>` +
    `<circle cx="950" cy="510" r="56" fill="none" stroke="${k.m}" stroke-width="22"/>` +
    c(780, 350, 14, k.c) +
    r(1000, 180, 40, 260, k.c, 10) +
    Array.from({ length: 8 }, (_, i) => r(1040, 196 + i * 30, 50, 10, k.c, 3)).join(""),
  medical: (k: Ink) =>
    deco(k) +
    r(640, 200, 300, 300, k.l, 40) +
    r(740, 250, 100, 200, k.m, 12) +
    r(690, 300, 200, 100, k.m, 12) +
    `<g transform="rotate(35 1010 520)">` +
    r(950, 490, 140, 60, k.c, 30) +
    r(1020, 490, 70, 60, k.l, 0) +
    `</g>` +
    c(560, 560, 30, k.c),
  bottle: (k: Ink) =>
    deco(k) +
    shadow(800, 610, 300) +
    r(640, 330, 120, 270, k.m, 24) +
    r(670, 230, 60, 110, k.m, 10) +
    r(668, 210, 64, 30, k.d, 6) +
    r(650, 420, 100, 90, k.l, 6) +
    p("M820 400 H960 L940 600 H840Z", k.l, ` stroke="${k.d}" stroke-width="6"`) +
    p("M828 470 H952 L940 600 H840Z", k.c) +
    r(1000, 360, 90, 240, k.d, 18),
  shirt: (k: Ink) =>
    deco(k) +
    s("M800 160 Q800 130 830 130 Q860 140 850 170 L800 200", k.d, 8) +
    s("M640 260 L800 200 L960 260", k.d, 8) +
    p("M650 260 L740 230 Q800 270 860 230 L950 260 L1010 360 L950 390 L930 350 V600 H670 V350 L650 390 L590 360Z", k.m) +
    p("M740 230 Q800 280 860 230 L850 250 Q800 300 750 250Z", k.l) +
    c(800, 330, 8, k.l) +
    c(800, 380, 8, k.l) +
    c(800, 430, 8, k.l),
  truck: (k: Ink) =>
    deco(k) +
    r(-400, 560, 2000, 12, k.d, 0, ' opacity="0.3"') +
    r(500, 300, 380, 230, k.m, 10) +
    p("M880 360 H990 L1060 440 V530 H880Z", k.d) +
    p("M900 380 H980 L1030 440 H900Z", k.l) +
    c(600, 540, 44, k.d) +
    c(600, 540, 16, k.l) +
    c(960, 540, 44, k.d) +
    c(960, 540, 16, k.l) +
    r(560, 340, 120, 80, k.c, 4) +
    r(700, 340, 120, 80, k.l, 4) +
    r(300, 430, 120, 100, k.c, 4) +
    r(330, 340, 80, 90, k.m, 4, ' opacity="0.7"'),
  blobs: (k: Ink) =>
    p("M620 160 Q820 60 980 200 Q1120 330 1000 500 Q860 650 680 560 Q500 470 540 320 Q560 210 620 160Z", k.m) +
    p("M820 300 Q920 260 960 360 Q980 460 880 480 Q780 490 770 400 Q760 330 820 300Z", k.c) +
    c(300, 200, 90, k.l, 0.4) +
    c(420, 560, 50, k.c, 0.6) +
    s("M200 420 Q300 360 400 420 T600 420", k.d, 6, ' opacity="0.4"'),
  grid: (k: Ink) =>
    Array.from({ length: 5 }, (_, i) => Array.from({ length: 4 }, (_, j) => r(560 + i * 110, 140 + j * 110, 90, 90, (i + j) % 3 === 0 ? k.m : (i + j) % 3 === 1 ? k.l : k.c, (i * j) % 2 ? 45 : 8, (i + j) % 4 === 0 ? ' opacity="0.6"' : "")).join("")).join("") +
    c(240, 200, 60, k.c, 0.4),
  solar: (k: Ink) =>
    c(1000, 160, 80, k.c) +
    Array.from({ length: 8 }, (_, i) => `<rect x="996" y="40" width="8" height="40" fill="${k.c}" transform="rotate(${i * 45} 1000 160)"/>`).join("") +
    `<g transform="skewX(-18)">` +
    r(640, 300, 420, 220, k.d, 6) +
    Array.from({ length: 4 }, (_, i) => Array.from({ length: 3 }, (_, j) => r(652 + i * 102, 312 + j * 70, 94, 62, k.m, 2)).join("")).join("") +
    `</g>` +
    r(700, 520, 20, 100, k.d) +
    r(900, 520, 20, 100, k.d) +
    r(-400, 620, 2000, 80, "#16a34a", 0, ' opacity="0.35"'),
  people: (k: Ink) =>
    deco(k) +
    [
      [640, k.m],
      [800, k.c],
      [960, k.d],
    ]
      .map(([x, f]) => c(x as number, 300, 60, f as string) + p(`M${(x as number) - 100} 600 Q${(x as number) - 100} 400 ${x} 400 Q${(x as number) + 100} 400 ${(x as number) + 100} 600Z`, f as string))
      .join("") +
    c(720, 230, 30, k.l, 0.5),
  bike: (k: Ink) =>
    deco(k) +
    `<circle cx="620" cy="470" r="110" fill="none" stroke="${k.d}" stroke-width="14"/>` +
    `<circle cx="980" cy="470" r="110" fill="none" stroke="${k.d}" stroke-width="14"/>` +
    s("M620 470 L740 300 L900 300 L980 470 M740 300 L800 470 L900 300 M800 470 L620 470", k.m, 14) +
    s("M720 270 H780 M900 300 L880 240 L930 230", k.d, 12) +
    c(800, 470, 20, k.c),
  pin: (k: Ink) =>
    p("M520 180 L700 130 L880 180 L1060 130 V560 L880 610 L700 560 L520 610Z", k.l) +
    p("M700 130 V560 M880 180 V610", "none", ` stroke="${k.a}" stroke-width="4"`) +
    s("M580 520 Q660 400 760 440 T960 300", k.c, 8, ' stroke-dasharray="18 14"') +
    p("M960 330 Q960 230 1020 230 Q1080 230 1080 300 Q1080 350 1020 420 Q960 350 960 330Z", k.m) +
    c(1020, 295, 20, k.l) +
    c(580, 520, 18, k.m),
  cake: (k: Ink) =>
    deco(k) +
    e(800, 590, 260, 30, k.d, 0.25) +
    r(580, 420, 440, 160, k.m, 20) +
    r(630, 300, 340, 130, k.l, 20) +
    p("M580 440 Q620 480 660 440 T740 440 T820 440 T900 440 T980 440 L1020 440 V420 H580Z", k.l) +
    [700, 800, 900].map((x) => r(x - 8, 220, 16, 80, k.c, 6) + p(`M${x} 190 q14 20 0 32 q-14 -12 0 -32Z`, "#f59e0b")).join("") +
    c(800, 360, 16, k.c),
  paint: (k: Ink) =>
    deco(k) +
    p("M600 300 Q620 180 780 180 Q980 180 1000 330 Q1010 420 920 420 Q860 420 870 480 Q880 560 760 560 Q600 560 600 300Z", k.l) +
    c(700, 280, 30, k.m) +
    c(800, 250, 30, k.c) +
    c(900, 300, 30, k.d) +
    c(690, 400, 30, "#16a34a") +
    `<g transform="rotate(40 1000 450)">` +
    r(980, 300, 30, 260, k.d, 10) +
    p("M975 300 h40 l-6 -70 q-14 -20 -28 0Z", k.m) +
    `</g>`,
  chat: (k: Ink) =>
    deco(k) +
    p("M560 200 H900 Q940 200 940 240 V400 Q940 440 900 440 H680 L620 500 V440 H600 Q560 440 560 400Z", k.m) +
    p("M760 330 H1060 Q1090 330 1090 360 V500 Q1090 530 1060 530 H1040 V580 L990 530 H790 Q760 530 760 500Z", k.l) +
    [640, 720, 800].map((x) => c(x, 320, 18, k.l)).join("") +
    r(800, 400, 220, 16, k.c, 8) +
    r(800, 440, 160, 16, k.a, 8),
  shield: (k: Ink) =>
    deco(k) +
    p("M800 140 L1010 220 V380 Q1010 530 800 620 Q590 530 590 380 V220Z", k.m) +
    p("M800 190 L960 250 V380 Q960 500 800 570Z", k.d, ' opacity="0.3"') +
    r(730, 360, 140, 120, k.l, 14) +
    s("M755 360 V320 Q755 270 800 270 Q845 270 845 320 V360", k.l, 18) +
    c(800, 410, 14, k.d),
  ball: (k: Ink) =>
    r(-400, 520, 2000, 180, "#16a34a", 0, ' opacity="0.5"') +
    s("M-400 600 H1600", k.l, 6, ' opacity="0.6"') +
    c(820, 340, 160, k.l) +
    p("M820 270 L880 315 L857 385 H783 L760 315Z", k.d) +
    s("M820 270 V180 M880 315 L965 290 M857 385 L910 460 M783 385 L730 460 M760 315 L675 290", k.d, 8) +
    c(400, 200, 60, k.c, 0.6),
  tent: (k: Ink) =>
    Array.from({ length: 30 }, (_, i) => c((i * 397) % 1500, (i * 151) % 300, 3, k.l, 0.7)).join("") +
    c(1000, 140, 50, k.l) +
    p("M-400 560 L0 560 Q400 480 800 540 T1200 520 L1600 520 V700 H-400Z", k.d) +
    p("M600 560 L800 260 L1000 560Z", k.m) +
    p("M800 260 L860 560 H740Z", k.c) +
    s("M800 260 L780 220 M800 260 L820 220", k.l, 6) +
    p("M480 560 L500 500 L520 560Z", "#f59e0b"),
  wheat: (k: Ink) =>
    c(980, 200, 90, k.c) +
    p("M-400 520 L0 520 Q300 460 600 500 T1200 470 L1600 470 V700 H-400Z", k.m) +
    Array.from({ length: 7 }, (_, i) => {
      const x = 560 + i * 80;
      return s(`M${x} 600 Q${x + 10} 450 ${x + 20} 330`, k.d, 6) + [0, 1, 2, 3].map((j) => e(x + 12 + j * 2, 360 + j * 34, 12, 22, k.c)).join("");
    }).join(""),
  spool: (k: Ink) =>
    deco(k) +
    r(640, 200, 240, 40, k.d, 10) +
    r(640, 500, 240, 40, k.d, 10) +
    r(670, 240, 180, 260, k.m) +
    [0, 1, 2, 3, 4, 5].map((i) => s(`M670 ${260 + i * 42} Q760 ${250 + i * 42} 850 ${270 + i * 42}`, k.l, 4, ' opacity="0.5"')).join("") +
    s("M850 420 Q960 420 980 520 Q1000 600 1080 600", k.m, 6) +
    s("M960 220 L1080 520", k.d, 8) +
    c(965, 232, 10, k.l),
  glasses: (k: Ink) =>
    deco(k) +
    `<circle cx="680" cy="380" r="110" fill="${k.l}" fill-opacity="0.6" stroke="${k.d}" stroke-width="22"/>` +
    `<circle cx="940" cy="380" r="110" fill="${k.l}" fill-opacity="0.6" stroke="${k.d}" stroke-width="22"/>` +
    s("M790 370 Q810 340 830 370", k.d, 18) +
    s("M570 360 L470 300 M1050 360 L1150 300", k.d, 16) +
    p("M630 330 Q660 300 700 310", "none", ` stroke="${k.c}" stroke-width="10" stroke-linecap="round"`),
  bubbles: (k: Ink) =>
    deco(k) +
    r(680, 330, 180, 270, k.m, 30) +
    p("M720 330 V260 H860 L900 230 V300 H820 V330Z", k.d) +
    r(700, 420, 140, 80, k.l, 10) +
    [
      [960, 240, 50],
      [1040, 330, 34],
      [960, 400, 26],
      [1060, 180, 22],
      [560, 280, 40],
      [590, 520, 28],
    ]
      .map(([x, y, rr]) => `<circle cx="${x}" cy="${y}" r="${rr}" fill="${k.l}" fill-opacity="0.5" stroke="${k.c}" stroke-width="5"/>`)
      .join(""),
  key: (k: Ink) =>
    deco(k) +
    `<g transform="rotate(-30 800 380)">` +
    `<circle cx="640" cy="380" r="110" fill="${k.m}"/>` +
    c(640, 380, 46, k.a) +
    r(740, 355, 360, 50, k.m, 12) +
    r(1000, 405, 34, 70, k.m) +
    r(1060, 405, 34, 50, k.m) +
    `</g>` +
    r(560, 560, 220, 22, k.c, 11),
  calendar: (k: Ink) =>
    deco(k) +
    r(580, 180, 460, 400, k.l, 24) +
    r(580, 180, 460, 90, k.m, 24) +
    r(580, 240, 460, 30, k.m) +
    r(660, 150, 20, 70, k.d, 10) +
    r(940, 150, 20, 70, k.d, 10) +
    Array.from({ length: 5 }, (_, i) => Array.from({ length: 3 }, (_, j) => r(620 + i * 82, 300 + j * 86, 60, 60, i === 2 && j === 1 ? k.c : k.a, 10)).join("")).join(""),
  mic: (k: Ink) =>
    deco(k) +
    r(720, 160, 160, 270, k.m, 80) +
    [0, 1, 2, 3].map((i) => r(740, 200 + i * 40, 120, 8, k.d, 4, ' opacity="0.3"')).join("") +
    s("M670 360 Q670 500 800 500 Q930 500 930 360", k.d, 18) +
    r(790, 500, 20, 80, k.d) +
    r(720, 580, 160, 22, k.d, 11) +
    s("M1000 300 Q1040 360 1000 420 M1050 260 Q1110 360 1050 460", k.c, 10),
  beaker: (k: Ink) =>
    deco(k) +
    p("M720 180 H880 V200 H860 V320 L980 560 Q990 600 950 600 H650 Q610 600 620 560 L740 320 V200 H720Z", k.l, ` stroke="${k.d}" stroke-width="8"`) +
    p("M690 460 H910 L975 575 Q980 592 960 592 H640 Q620 592 626 575Z", k.m) +
    c(760, 520, 14, k.l) +
    c(820, 500, 10, k.l) +
    c(860, 540, 16, k.l) +
    c(800, 400, 12, k.c) +
    c(830, 360, 8, k.c),
  ticket: (k: Ink) =>
    deco(k) +
    `<g transform="rotate(-8 800 380)">` +
    p("M560 260 H1060 V340 Q1020 340 1020 380 Q1020 420 1060 420 V500 H560 V420 Q600 420 600 380 Q600 340 560 340Z", k.m) +
    s("M900 270 V490", k.l, 4, ' stroke-dasharray="12 10"') +
    r(620, 300, 220, 30, k.l, 15) +
    r(620, 350, 160, 16, k.l, 8, ' opacity="0.7"') +
    r(620, 380, 190, 16, k.l, 8, ' opacity="0.7"') +
    c(980, 380, 34, k.c) +
    `</g>`,
  stones: (k: Ink) =>
    deco(k) +
    e(800, 590, 260, 30, k.d, 0.2) +
    e(800, 540, 200, 56, k.d) +
    e(800, 450, 160, 46, k.m) +
    e(800, 375, 120, 36, k.c) +
    e(800, 318, 80, 26, k.l) +
    p("M860 290 Q960 200 1060 230 Q980 320 860 290Z", "#16a34a") +
    s("M860 290 Q960 250 1040 236", "#14532d", 3),
  anchor: (k: Ink) =>
    r(-400, 520, 2000, 180, k.m, 0, ' opacity="0.5"') +
    `<circle cx="800" cy="210" r="40" fill="none" stroke="${k.d}" stroke-width="18"/>` +
    s("M800 250 V560 M700 320 H900", k.d, 22) +
    s("M620 460 Q640 580 800 580 Q960 580 980 460", k.d, 22) +
    p("M600 450 L640 470 L610 500Z", k.d) +
    p("M1000 450 L960 470 L990 500Z", k.d) +
    c(400, 200, 60, k.c, 0.6),
  cap: (k: Ink) =>
    deco(k) +
    p("M800 200 L1080 320 L800 440 L520 320Z", k.d) +
    p("M640 380 V500 Q800 580 960 500 V380 L800 440Z", k.m) +
    s("M1040 340 V480", k.c, 8) +
    c(1040, 490, 16, k.c) +
    r(560, 560, 240, 30, k.l, 6) +
    r(580, 530, 200, 30, k.c, 6),
  heart: (k: Ink) =>
    deco(k) +
    p("M800 600 Q560 440 560 300 Q560 200 660 190 Q750 185 800 270 Q850 185 940 190 Q1040 200 1040 300 Q1040 440 800 600Z", k.m) +
    p("M640 330 Q620 260 680 240", "none", ` stroke="${k.l}" stroke-width="16" stroke-linecap="round"`) +
    p("M440 500 Q400 470 400 440 Q400 410 430 410 Q445 410 450 430 Q455 410 470 410 Q500 410 500 440 Q500 470 440 500Z", k.c),
  gamepad: (k: Ink) =>
    deco(k) +
    p("M600 300 Q560 300 540 360 L500 500 Q490 560 540 570 Q580 575 620 520 L660 470 H940 L980 520 Q1020 575 1060 570 Q1110 560 1100 500 L1060 360 Q1040 300 1000 300Z", k.d) +
    r(620, 370, 90, 26, k.l, 6) +
    r(652, 338, 26, 90, k.l, 6) +
    c(930, 360, 18, k.c) +
    c(970, 400, 18, k.m) +
    c(890, 400, 18, "#22c55e") +
    c(930, 440, 18, "#f59e0b"),
  drop: (k: Ink) =>
    deco(k) +
    p("M800 150 Q900 300 940 380 Q980 470 930 540 Q880 600 800 600 Q720 600 670 540 Q620 470 660 380 Q700 300 800 150Z", k.m) +
    p("M720 460 Q720 400 760 370", "none", ` stroke="${k.l}" stroke-width="16" stroke-linecap="round"`) +
    s("M500 600 Q560 560 620 600 T740 600 M860 600 Q920 560 980 600 T1100 600", k.c, 8),
};

export type Motif = keyof typeof MOTIFS;

/** Wrap a scene into a full 1200x700 SVG (optionally mirrored). */
export function scene(motif: Motif, k: Ink, mirror = false): string {
  const body = MOTIFS[motif](k);
  const bgDef = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${k.a}"/><stop offset="1" stop-color="${k.b}"/></linearGradient></defs><rect width="1200" height="700" fill="url(#g)"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700" width="1200" height="700">${bgDef}<g transform="${mirror ? "translate(1380 0) scale(-1 1)" : "translate(-180 0)"}">${body}</g></svg>`;
}

/** Simple avatar for testimonials & team. */
export function face(bg: string, skin: string, hair: string, shirt: string, style: 0 | 1 | 2 | 3): string {
  const hairBack = style === 1 ? `<path d="M118 200 Q118 86 200 86 Q282 86 282 200 V310 H118Z" fill="${hair}"/>` : style === 3 ? `<path d="M128 150 Q200 40 272 150 Q290 100 250 80 Q200 50 150 80 Q110 100 128 150Z" fill="${hair}"/>` : "";
  const hairTop =
    style === 2
      ? `<path d="M126 170 Q126 100 200 100 Q274 100 274 170 Q230 150 200 150 Q170 150 126 170Z" fill="${hair}"/><rect x="180" y="96" width="40" height="18" rx="9" fill="${hair}"/>`
      : `<path d="M128 180 Q130 110 200 108 Q270 110 272 180 Q240 140 200 142 Q160 140 128 180Z" fill="${hair}"/>`;
  const glasses = style === 2 ? `<circle cx="176" cy="196" r="18" fill="none" stroke="#1f2937" stroke-width="4"/><circle cx="224" cy="196" r="18" fill="none" stroke="#1f2937" stroke-width="4"/><path d="M194 196 H206" stroke="#1f2937" stroke-width="4"/>` : "";
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400"><rect width="400" height="400" fill="${bg}"/>` +
    hairBack +
    `<path d="M90 400 Q90 290 200 290 Q310 290 310 400Z" fill="${shirt}"/><circle cx="200" cy="190" r="72" fill="${skin}"/>` +
    hairTop +
    `<circle cx="176" cy="196" r="6" fill="#1f2937"/><circle cx="224" cy="196" r="6" fill="#1f2937"/>` +
    glasses +
    `<path d="M180 228 Q200 242 220 228" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`
  );
}
