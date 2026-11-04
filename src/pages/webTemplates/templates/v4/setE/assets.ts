/* ================================================================== */
/* Set E SVG illustrations (in-house, ASCII, no external URLs;          */
/* keys "v4e-<name>"). Motifs take colors so they have many variants.   */
/* ================================================================== */

const svg = (body: string, w = 800, h = 600) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const bg = (a: string, b: string) =>
  `<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="800" height="600" fill="url(#g)"/>`;

const blob = (x: number, y: number, r: number, c: string, o = 0.35) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;

/** Meja kerja bersama + laptop + lampu gantung (coworking). */
function cowork(a: string, b: string, desk: string, acc: string): string {
  return svg(
    bg(a, b) +
      blob(640, 120, 90, acc) +
      `<path d="M400 0 V110" stroke="${desk}" stroke-width="4"/><path d="M350 110 H450 L420 160 H380Z" fill="${acc}"/>` +
      `<rect x="120" y="360" width="560" height="22" rx="6" fill="${desk}"/><rect x="150" y="382" width="14" height="150" fill="${desk}"/><rect x="636" y="382" width="14" height="150" fill="${desk}"/>` +
      `<rect x="200" y="280" width="130" height="80" rx="6" fill="#1f2937"/><rect x="208" y="288" width="114" height="64" rx="3" fill="${acc}" opacity="0.8"/>` +
      `<rect x="470" y="280" width="130" height="80" rx="6" fill="#1f2937"/><rect x="478" y="288" width="114" height="64" rx="3" fill="#ffffff" opacity="0.85"/>` +
      `<rect x="370" y="320" width="40" height="40" rx="8" fill="#ffffff"/><path d="M380 320 Q390 290 400 320" fill="#16a34a"/>` +
      `<circle cx="265" cy="230" r="26" fill="#f1c27d"/><rect x="235" y="256" width="60" height="30" rx="14" fill="${desk}" opacity="0.6"/>` +
      `<circle cx="535" cy="230" r="26" fill="#a16e4b"/><rect x="505" y="256" width="60" height="30" rx="14" fill="${acc}" opacity="0.7"/>`,
  );
}

/** Gigi bergaya (klinik gigi). */
function tooth(a: string, b: string, c: string, acc: string): string {
  return svg(
    bg(a, b) +
      blob(160, 140, 80, acc) +
      blob(660, 470, 110, acc, 0.2) +
      `<path d="M300 170 Q400 120 500 170 Q560 210 530 310 Q510 380 500 470 Q490 520 460 470 L430 380 Q400 350 370 380 L340 470 Q310 520 300 470 Q290 380 270 310 Q240 210 300 170Z" fill="${c}" stroke="${acc}" stroke-width="6"/>` +
      `<path d="M330 210 Q350 190 380 196" stroke="${acc}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>` +
      `<path d="M600 140 l12 28 28 12 -28 12 -12 28 -12 -28 -28 -12 28 -12z" fill="${acc}"/>` +
      `<path d="M190 420 l8 18 18 8 -18 8 -8 18 -8 -18 -18 -8 18 -8z" fill="${acc}" opacity="0.7"/>`,
  );
}

/** Senyum + kawat gigi (ortodonti). */
function braces(a: string, b: string, lip: string, wire: string): string {
  let teeth = "";
  for (let i = 0; i < 8; i++) teeth += `<rect x="${222 + i * 46}" y="262" width="40" height="64" rx="12" fill="#ffffff"/><rect x="${234 + i * 46}" y="286" width="16" height="16" rx="3" fill="${wire}"/>`;
  return svg(
    bg(a, b) +
      blob(400, 300, 260, "#ffffff", 0.25) +
      `<path d="M170 280 Q400 140 630 280 Q400 470 170 280Z" fill="${lip}"/>` +
      `<path d="M210 290 Q400 220 590 290 Q400 400 210 290Z" fill="#7f1d1d"/>` +
      teeth +
      `<path d="M222 294 H590" stroke="${wire}" stroke-width="4"/>`,
  );
}

/** Kursi kayu + meja samping (mebel). */
function chair(a: string, b: string, wood: string, fabric: string): string {
  return svg(
    bg(a, b) +
      `<rect x="0" y="470" width="800" height="130" fill="${wood}" opacity="0.18"/>` +
      `<path d="M250 180 Q250 140 290 140 H430 Q470 140 470 180 V340 H250Z" fill="${fabric}"/>` +
      `<rect x="230" y="330" width="260" height="50" rx="16" fill="${fabric}"/>` +
      `<rect x="250" y="380" width="16" height="110" fill="${wood}"/><rect x="454" y="380" width="16" height="110" fill="${wood}"/>` +
      `<rect x="214" y="270" width="24" height="90" rx="10" fill="${wood}"/><rect x="482" y="270" width="24" height="90" rx="10" fill="${wood}"/>` +
      `<rect x="560" y="330" width="130" height="16" rx="4" fill="${wood}"/><rect x="574" y="346" width="10" height="144" fill="${wood}"/><rect x="666" y="346" width="10" height="144" fill="${wood}"/>` +
      `<rect x="600" y="270" width="44" height="60" rx="8" fill="#ffffff" opacity="0.9"/><path d="M622 270 Q600 220 622 200 Q644 220 622 270" fill="#4d7c0f"/>`,
  );
}

/** Sofa minimalis + lampu lantai. */
function sofa(a: string, b: string, body: string, acc: string): string {
  return svg(
    bg(a, b) +
      `<rect x="0" y="480" width="800" height="120" fill="#000000" opacity="0.05"/>` +
      `<rect x="150" y="250" width="440" height="140" rx="28" fill="${body}"/>` +
      `<rect x="120" y="320" width="500" height="110" rx="24" fill="${body}" opacity="0.9"/>` +
      `<rect x="160" y="430" width="10" height="50" fill="#1f2937"/><rect x="570" y="430" width="10" height="50" fill="#1f2937"/>` +
      `<rect x="200" y="280" width="90" height="70" rx="16" fill="${acc}"/>` +
      `<path d="M690 480 V180" stroke="#1f2937" stroke-width="6"/><path d="M640 180 H740 L715 110 H665Z" fill="${acc}"/>` +
      `<circle cx="690" cy="482" r="30" fill="#1f2937" opacity="0.3"/>`,
  );
}

/** Book + speech bubbles (language). */
function speech(a: string, b: string, c1: string, c2: string, t1: string, t2: string): string {
  return svg(
    bg(a, b) +
      `<rect x="130" y="130" width="300" height="170" rx="30" fill="${c1}"/><path d="M190 300 L170 360 L250 300Z" fill="${c1}"/>` +
      `<text x="280" y="236" font-size="78" font-family="Arial" font-weight="700" text-anchor="middle" fill="#ffffff">${t1}</text>` +
      `<rect x="380" y="270" width="290" height="160" rx="30" fill="${c2}"/><path d="M600 430 L630 490 L560 430Z" fill="${c2}"/>` +
      `<text x="525" y="372" font-size="74" font-family="Arial" font-weight="700" text-anchor="middle" fill="#ffffff">${t2}</text>` +
      `<rect x="150" y="470" width="200" height="30" rx="4" fill="${c2}" opacity="0.6"/><rect x="170" y="440" width="200" height="30" rx="4" fill="${c1}" opacity="0.6"/>`,
  );
}

/** Penyelam + terumbu + ikan (diving). */
function reef(a: string, b: string, coral: string, fish: string): string {
  return svg(
    bg(a, b) +
      `<path d="M0 520 Q200 470 400 520 T800 510 V600 H0Z" fill="#f5deb3" opacity="0.6"/>` +
      `<path d="M120 520 V420 M120 460 Q90 430 90 400 M120 450 Q150 420 150 390" stroke="${coral}" stroke-width="16" stroke-linecap="round" fill="none"/>` +
      `<path d="M640 520 Q620 440 660 400 Q700 440 680 520Z" fill="${coral}" opacity="0.8"/>` +
      `<ellipse cx="420" cy="250" rx="110" ry="34" fill="#0f172a"/><circle cx="300" cy="242" r="34" fill="#0f172a"/><rect x="278" y="226" width="40" height="22" rx="8" fill="#7dd3fc"/>` +
      `<rect x="390" y="200" width="70" height="26" rx="12" fill="${fish}"/><path d="M530 250 L600 220 L590 270Z" fill="#0f172a"/>` +
      `<path d="M560 140 q20 -18 40 0 q-20 18 -40 0z M600 140 l14 -10 v20z" fill="${fish}"/>` +
      `<path d="M180 300 q16 -14 32 0 q-16 14 -32 0z M212 300 l10 -8 v16z" fill="${fish}"/>` +
      `<circle cx="270" cy="180" r="8" fill="#ffffff" opacity="0.6"/><circle cx="262" cy="140" r="6" fill="#ffffff" opacity="0.5"/><circle cx="272" cy="104" r="4" fill="#ffffff" opacity="0.4"/>`,
  );
}

/** Passenger ship at sea. */
function ship(a: string, b: string, hull: string, deck: string): string {
  return svg(
    bg(a, b) +
      blob(640, 130, 60, "#fde68a", 0.8) +
      `<path d="M140 360 H660 L610 450 H190Z" fill="${hull}"/>` +
      `<rect x="230" y="290" width="340" height="70" fill="#ffffff"/><rect x="290" y="230" width="230" height="60" fill="#ffffff"/>` +
      `<rect x="420" y="170" width="44" height="60" fill="${deck}"/>` +
      `<g fill="${deck}">${[250, 290, 330, 370, 410, 450, 490, 530].map((x) => `<rect x="${x}" y="312" width="24" height="18" rx="4"/>`).join("")}</g>` +
      `<path d="M0 450 Q100 430 200 450 T400 450 T600 450 T800 450 V600 H0Z" fill="#ffffff" opacity="0.25"/>` +
      `<path d="M0 490 Q100 470 200 490 T400 490 T600 490 T800 490 V600 H0Z" fill="#ffffff" opacity="0.2"/>`,
  );
}

/** Anyaman: pola silang + keranjang. */
function weave(a: string, b: string, c1: string, c2: string): string {
  let rows = "";
  for (let y = 0; y < 6; y++) for (let x = 0; x < 8; x++) rows += `<rect x="${220 + x * 45}" y="${250 + y * 32}" width="42" height="28" rx="6" fill="${(x + y) % 2 ? c1 : c2}"/>`;
  return svg(
    bg(a, b) +
      `<path d="M200 250 H580 L550 450 H230Z" fill="${c2}" opacity="0.4"/>` +
      `<clipPath id="k"><path d="M210 250 H580 L550 450 H240Z"/></clipPath><g clip-path="url(#k)">${rows}</g>` +
      `<path d="M260 250 Q390 90 520 250" stroke="${c1}" stroke-width="18" fill="none" stroke-linecap="round"/>` +
      `<ellipse cx="395" cy="250" rx="190" ry="20" fill="${c1}"/>`,
  );
}

/** Ceramic vase + potter's wheel. */
function pottery(a: string, b: string, clay: string, glaze: string): string {
  return svg(
    bg(a, b) +
      `<ellipse cx="400" cy="480" rx="230" ry="36" fill="#1f2937" opacity="0.25"/><rect x="190" y="470" width="420" height="24" rx="10" fill="#57534e"/>` +
      `<path d="M330 160 H470 Q460 200 500 250 Q570 330 520 420 Q490 470 400 470 Q310 470 280 420 Q230 330 300 250 Q340 200 330 160Z" fill="${clay}"/>` +
      `<path d="M286 300 Q400 340 514 300" stroke="${glaze}" stroke-width="16" fill="none"/>` +
      `<path d="M276 360 Q400 400 524 360" stroke="${glaze}" stroke-width="10" fill="none" opacity="0.7"/>` +
      `<ellipse cx="400" cy="160" rx="72" ry="14" fill="${glaze}"/>` +
      `<path d="M610 200 Q650 260 610 320 Q660 380 620 430" stroke="${clay}" stroke-width="8" fill="none" opacity="0.4"/>`,
  );
}

/** Dashboard panel: bar + line + donut charts. */
function dash(a: string, b: string, panel: string, c1: string, c2: string): string {
  const bars = [120, 180, 150, 220, 260, 210, 300].map((h, i) => `<rect x="${130 + i * 46}" y="${470 - h}" width="30" height="${h}" rx="5" fill="${i === 6 ? c2 : c1}"/>`).join("");
  return svg(
    bg(a, b) +
      `<rect x="90" y="90" width="620" height="420" rx="22" fill="${panel}"/>` +
      `<rect x="120" y="120" width="160" height="16" rx="8" fill="${c1}" opacity="0.5"/>` +
      bars +
      `<path d="M140 220 L190 200 L240 230 L290 170 L340 180 L390 130 L440 150" stroke="${c2}" stroke-width="6" fill="none" stroke-linecap="round"/>` +
      `<circle cx="590" cy="250" r="70" fill="none" stroke="${c1}" stroke-width="28"/><path d="M590 180 A70 70 0 0 1 655 275" stroke="${c2}" stroke-width="28" fill="none"/>` +
      `<rect x="530" y="370" width="130" height="14" rx="7" fill="${c1}" opacity="0.5"/><rect x="530" y="400" width="90" height="14" rx="7" fill="${c2}" opacity="0.6"/>`,
  );
}

/** A sprout growing on top of coins (investment). */
function growth(a: string, b: string, coin: string, leaf: string): string {
  return svg(
    bg(a, b) +
      [0, 1, 2, 3].map((i) => `<ellipse cx="300" cy="${470 - i * 28}" rx="80" ry="22" fill="${coin}" stroke="#00000022" stroke-width="3"/>`).join("") +
      [0, 1, 2, 3, 4, 5].map((i) => `<ellipse cx="500" cy="${470 - i * 28}" rx="80" ry="22" fill="${coin}" stroke="#00000022" stroke-width="3"/>`).join("") +
      `<path d="M500 330 V200" stroke="${leaf}" stroke-width="10"/><path d="M500 250 Q440 230 430 180 Q490 180 500 250Z M500 220 Q560 200 580 150 Q510 150 500 220Z" fill="${leaf}"/>` +
      `<path d="M120 200 L250 150 L360 170 L560 90" stroke="${leaf}" stroke-width="6" fill="none" stroke-dasharray="14 10"/><path d="M560 90 l-30 4 18 22z" fill="${leaf}"/>`,
  );
}

/** Hydroponic rack with pipes & lettuce. */
function hydro(a: string, b: string, pipe: string, leaf: string): string {
  let plants = "";
  for (let r = 0; r < 3; r++)
    for (let i = 0; i < 6; i++) plants += `<circle cx="${190 + i * 84}" cy="${178 + r * 120}" r="26" fill="${leaf}" opacity="${0.75 + (i % 2) * 0.25}"/><circle cx="${176 + i * 84}" cy="${186 + r * 120}" r="16" fill="${leaf}"/>`;
  return svg(
    bg(a, b) +
      `<rect x="140" y="120" width="12" height="400" fill="#475569"/><rect x="648" y="120" width="12" height="400" fill="#475569"/>` +
      [0, 1, 2].map((r) => `<rect x="150" y="${196 + r * 120}" width="500" height="26" rx="13" fill="${pipe}"/>`).join("") +
      plants +
      `<path d="M660 470 Q720 470 720 520" stroke="#38bdf8" stroke-width="10" fill="none"/>`,
  );
}

/** Tangan menopang hati (nonprofit). */
function hands(a: string, b: string, heart: string, skin: string): string {
  return svg(
    bg(a, b) +
      blob(400, 280, 210, "#ffffff", 0.35) +
      `<path d="M400 330 C330 270 270 230 300 180 C325 140 380 150 400 190 C420 150 475 140 500 180 C530 230 470 270 400 330Z" fill="${heart}"/>` +
      `<path d="M180 380 Q260 360 330 390 Q370 400 400 420 Q430 400 470 390 Q540 360 620 380 L640 460 Q520 440 400 480 Q280 440 160 460Z" fill="${skin}"/>` +
      `<path d="M240 240 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z M560 230 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6z" fill="${heart}" opacity="0.6"/>`,
  );
}

/** Wind turbines on a hill. */
function wind(a: string, b: string, hill: string, blade: string): string {
  const turbine = (x: number, y: number, s: number) =>
    `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 L-10 260 H10 L6 0Z" fill="${blade}"/><circle r="12" fill="${blade}"/>` +
    [0, 120, 240].map((r) => `<path d="M0 0 L-8 -120 Q0 -136 8 -120Z" fill="${blade}" transform="rotate(${r})"/>`).join("") +
    `</g>`;
  return svg(bg(a, b) + `<path d="M0 470 Q260 380 520 450 T800 420 V600 H0Z" fill="${hill}"/>` + turbine(240, 220, 1) + turbine(500, 270, 0.75) + turbine(680, 300, 0.55));
}

/** Roket + panah naik (pitch startup). */
function rocket(a: string, b: string, body: string, flame: string): string {
  return svg(
    bg(a, b) +
      `<path d="M120 480 L280 380 L400 410 L640 200" stroke="${body}" stroke-width="10" fill="none" opacity="0.35"/>` +
      `<g transform="rotate(35 420 300)"><path d="M420 120 Q480 190 480 330 H360 Q360 190 420 120Z" fill="${body}"/><circle cx="420" cy="230" r="28" fill="#ffffff"/><circle cx="420" cy="230" r="16" fill="${flame}"/>` +
      `<path d="M360 300 L320 370 H360Z M480 300 L520 370 H480Z" fill="${flame}"/><path d="M380 330 Q420 450 460 330Z" fill="${flame}"/></g>` +
      `<circle cx="160" cy="140" r="6" fill="${body}"/><circle cx="660" cy="480" r="8" fill="${body}" opacity="0.5"/><circle cx="700" cy="120" r="5" fill="${flame}"/>`,
  );
}

/** Student with a laptop + formula board (tutoring). */
function study(a: string, b: string, shirt: string, board: string): string {
  return svg(
    bg(a, b) +
      `<rect x="420" y="110" width="290" height="190" rx="14" fill="${board}"/>` +
      `<text x="565" y="190" font-size="40" font-family="Arial" font-weight="700" text-anchor="middle" fill="#ffffff">a2+b2=c2</text>` +
      `<path d="M460 250 H660" stroke="#ffffff" stroke-width="6" opacity="0.5"/>` +
      `<circle cx="260" cy="230" r="54" fill="#d4a373"/><path d="M206 220 Q260 150 314 220 Q300 180 260 176 Q220 180 206 220Z" fill="#1f2937"/>` +
      `<path d="M170 420 Q170 300 260 300 Q350 300 350 420Z" fill="${shirt}"/>` +
      `<rect x="150" y="400" width="320" height="16" rx="6" fill="#334155"/><path d="M200 400 L230 330 H380 L410 400Z" fill="#475569"/>`,
  );
}

/** Warehouse: pallet racks + boxes + forklift. */
function warehouse(a: string, b: string, box: string, lift: string): string {
  let boxes = "";
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) boxes += `<rect x="${110 + i * 80}" y="${150 + r * 110}" width="66" height="70" rx="4" fill="${box}" opacity="${0.75 + ((i + r) % 2) * 0.25}"/><path d="M${126 + i * 80} ${150 + r * 110} V${180 + r * 110}" stroke="#ffffff" stroke-width="4" opacity="0.6"/>`;
  return svg(
    bg(a, b) +
      `<rect x="96" y="120" width="10" height="380" fill="#475569"/><rect x="420" y="120" width="10" height="380" fill="#475569"/>` +
      [0, 1, 2].map((r) => `<rect x="96" y="${220 + r * 110}" width="334" height="10" fill="#475569"/>`).join("") +
      boxes +
      `<rect x="520" y="360" width="140" height="90" rx="10" fill="${lift}"/><rect x="560" y="300" width="70" height="60" rx="6" fill="none" stroke="${lift}" stroke-width="8"/>` +
      `<path d="M500 280 V460 H460" stroke="#334155" stroke-width="8" fill="none"/><circle cx="550" cy="470" r="24" fill="#1f2937"/><circle cx="640" cy="470" r="24" fill="#1f2937"/>` +
      `<rect x="440" y="380" width="60" height="50" rx="4" fill="${box}"/>`,
  );
}

/** Wajah sederhana (avatar). */
function face(bgc: string, skin: string, hair: string, shirt: string, long = false): string {
  return svg(
    `<rect width="400" height="400" fill="${bgc}"/>` +
      (long ? `<path d="M120 200 Q120 90 200 90 Q280 90 280 200 V300 H120Z" fill="${hair}"/>` : "") +
      `<path d="M90 400 Q90 290 200 290 Q310 290 310 400Z" fill="${shirt}"/>` +
      `<circle cx="200" cy="190" r="72" fill="${skin}"/>` +
      `<path d="M128 180 Q130 110 200 108 Q270 110 272 180 Q240 140 200 142 Q160 140 128 180Z" fill="${hair}"/>` +
      `<circle cx="176" cy="196" r="6" fill="#1f2937"/><circle cx="224" cy="196" r="6" fill="#1f2937"/><path d="M180 228 Q200 242 220 228" stroke="#1f2937" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    400,
    400,
  );
}

/** Peta pulau + rute putus-putus. */
function route(a: string, land: string, line: string): string {
  return svg(
    `<rect width="800" height="600" fill="${a}"/>` +
      `<path d="M80 140 Q160 90 240 130 Q290 180 230 230 Q150 250 100 210Z" fill="${land}"/>` +
      `<path d="M330 320 Q420 260 520 300 Q560 360 480 400 Q380 420 340 380Z" fill="${land}"/>` +
      `<path d="M600 120 Q680 100 720 150 Q700 210 640 200 Q590 180 600 120Z" fill="${land}"/>` +
      `<path d="M200 190 Q320 260 420 340 Q540 250 650 160" stroke="${line}" stroke-width="6" fill="none" stroke-dasharray="16 12"/>` +
      `<circle cx="200" cy="190" r="12" fill="${line}"/><circle cx="420" cy="340" r="12" fill="${line}"/><circle cx="650" cy="160" r="12" fill="${line}"/>`,
  );
}

export const V4E_SOURCES: Record<string, () => string> = {
  "v4e-cowork": () => cowork("#ccfbf1", "#f0fdfa", "#0f766e", "#f59e0b"),
  "v4e-cowork-night": () => cowork("#2e1065", "#4c1d95", "#a78bfa", "#f472b6"),
  "v4e-tooth": () => tooth("#e0f2fe", "#f0f9ff", "#ffffff", "#0ea5e9"),
  "v4e-tooth-mint": () => tooth("#ccfbf1", "#f0fdfa", "#ffffff", "#14b8a6"),
  "v4e-braces": () => braces("#fce7f3", "#fdf2f8", "#f472b6", "#94a3b8"),
  "v4e-braces-clear": () => braces("#ede9fe", "#faf5ff", "#e879f9", "#e2e8f0"),
  "v4e-chair": () => chair("#fef3c7", "#fffbeb", "#92400e", "#d6d3d1"),
  "v4e-chair-sage": () => chair("#ecfccb", "#f7fee7", "#78350f", "#a3b18a"),
  "v4e-sofa": () => sofa("#f5f5f5", "#fafafa", "#525252", "#f59e0b"),
  "v4e-sofa-clay": () => sofa("#fafaf9", "#f5f5f4", "#c2a189", "#262626"),
  "v4e-speech": () => speech("#fee2e2", "#fff7ed", "#dc2626", "#2563eb", "Hi!", "Halo"),
  "v4e-speech-jp": () => speech("#dbeafe", "#eff6ff", "#2563eb", "#f59e0b", "Hola", "Hallo"),
  "v4e-reef": () => reef("#7dd3fc", "#0369a1", "#fb7185", "#facc15"),
  "v4e-reef-deep": () => reef("#0e7490", "#082f49", "#f97316", "#a3e635"),
  "v4e-ship": () => ship("#bfdbfe", "#1e3a8a", "#1e3a8a", "#f59e0b"),
  "v4e-ship-dusk": () => ship("#fed7aa", "#7c2d12", "#0f172a", "#38bdf8"),
  "v4e-route": () => route("#dbeafe", "#bbf7d0", "#1e3a8a"),
  "v4e-weave": () => weave("#fef9c3", "#fefce8", "#a16207", "#facc15"),
  "v4e-weave-dark": () => weave("#422006", "#713f12", "#fde68a", "#ca8a04"),
  "v4e-pottery": () => pottery("#ffedd5", "#fff7ed", "#c2410c", "#0f766e"),
  "v4e-pottery-blue": () => pottery("#e0f2fe", "#f8fafc", "#e7e5e4", "#1d4ed8"),
  "v4e-dash": () => dash("#e0e7ff", "#eef2ff", "#ffffff", "#4f46e5", "#22d3ee"),
  "v4e-dash-dark": () => dash("#0b1020", "#111827", "#1e1b4b", "#818cf8", "#34d399"),
  "v4e-growth": () => growth("#d1fae5", "#ecfdf5", "#fbbf24", "#047857"),
  "v4e-hydro": () => hydro("#dcfce7", "#f0fdf4", "#e2e8f0", "#16a34a"),
  "v4e-hydro-night": () => hydro("#1e1b4b", "#312e81", "#cbd5e1", "#4ade80"),
  "v4e-hands": () => hands("#fce7f3", "#fdf2f8", "#be185d", "#d4a373"),
  "v4e-wind": () => wind("#cffafe", "#ecfeff", "#22c55e", "#ffffff"),
  "v4e-wind-night": () => wind("#082f49", "#0e7490", "#134e4a", "#e0f2fe"),
  "v4e-rocket": () => rocket("#ffedd5", "#fff7ed", "#f97316", "#1f2937"),
  "v4e-study": () => study("#f3e8ff", "#faf5ff", "#9333ea", "#1e1b4b"),
  "v4e-warehouse": () => warehouse("#fef3c7", "#fffbeb", "#b45309", "#facc15"),
  "v4e-face-1": () => face("#e0e7ff", "#c68642", "#1f2937", "#4338ca"),
  "v4e-face-2": () => face("#fce7f3", "#e0ac69", "#3f1d0b", "#be185d", true),
  "v4e-face-3": () => face("#dcfce7", "#8d5524", "#111827", "#15803d"),
  "v4e-face-4": () => face("#fef3c7", "#f1c27d", "#78350f", "#b45309", true),
};
