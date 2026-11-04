/* ================================================================== */
/* Extra SVG illustrations for v2 templates part A                       */
/* (in-house, ASCII, no external URLs; names prefixed "v2a-").          */
/* Each function takes colors so one shape has many variants.           */
/* ================================================================== */

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const lg = (id: string, a: string, b: string) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

const bg = (a: string, b: string, w = 800, h = 600) => lg("b", a, b) + `<rect width="${w}" height="${h}" fill="url(#b)"/>`;

/** Cangkir kopi + uap (kafe). */
function cup(a: string, b: string, body: string, coffee: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<ellipse cx="400" cy="470" rx="240" ry="40" fill="${coffee}" opacity="0.15"/>` +
      `<path d="M240 250 H520 L500 440 Q495 470 465 470 H295 Q265 470 260 440Z" fill="${body}"/>` +
      `<path d="M520 290 Q600 290 600 350 Q600 410 510 410" fill="none" stroke="${body}" stroke-width="22"/>` +
      `<ellipse cx="380" cy="250" rx="140" ry="22" fill="${coffee}"/>` +
      `<path d="M330 200 Q300 160 330 120 T330 50 M390 200 Q360 160 390 120 T390 50 M450 200 Q420 160 450 120 T450 50" stroke="${coffee}" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.35"/>`,
  );
}

/** Dumbel + lantai gym. */
function dumbbell(a: string, b: string, metal: string, plate: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="0" y="460" width="800" height="140" fill="${plate}" opacity="0.25"/>` +
      `<rect x="200" y="285" width="400" height="30" rx="15" fill="${metal}"/>` +
      `<rect x="140" y="190" width="60" height="220" rx="16" fill="${plate}"/><rect x="90" y="220" width="50" height="160" rx="14" fill="${plate}" opacity="0.8"/>` +
      `<rect x="600" y="190" width="60" height="220" rx="16" fill="${plate}"/><rect x="660" y="220" width="50" height="160" rx="14" fill="${plate}" opacity="0.8"/>` +
      `<path d="M120 100 L180 100 M150 70 L150 130" stroke="${metal}" stroke-width="10" stroke-linecap="round" opacity="0.5"/>` +
      `<circle cx="660" cy="110" r="44" fill="none" stroke="${metal}" stroke-width="10" opacity="0.4"/>`,
  );
}

/** Cermin salon + sisir + daun. */
function mirror(a: string, b: string, frame: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<ellipse cx="330" cy="280" rx="170" ry="210" fill="${frame}"/><ellipse cx="330" cy="280" rx="145" ry="185" fill="#ffffff" opacity="0.85"/>` +
      `<path d="M240 200 Q300 140 380 170" stroke="${frame}" stroke-width="10" fill="none" opacity="0.4" stroke-linecap="round"/>` +
      `<rect x="540" y="150" width="46" height="300" rx="20" fill="${accent}"/>` +
      `<path d="M586 170 h40 M586 200 h40 M586 230 h40 M586 260 h40 M586 290 h40 M586 320 h40 M586 350 h40 M586 380 h40 M586 410 h40" stroke="${accent}" stroke-width="8"/>` +
      `<path d="M120 520 Q200 420 280 520Z" fill="${accent}" opacity="0.5"/><path d="M640 540 Q700 460 760 540Z" fill="${frame}" opacity="0.4"/>`,
  );
}

/** Mobil samping. */
function car(a: string, b: string, body: string, wheel: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="0" y="430" width="800" height="170" fill="${wheel}" opacity="0.2"/><rect x="60" y="460" width="120" height="10" rx="5" fill="#ffffff" opacity="0.5"/><rect x="330" y="460" width="120" height="10" rx="5" fill="#ffffff" opacity="0.5"/><rect x="600" y="460" width="120" height="10" rx="5" fill="#ffffff" opacity="0.5"/>` +
      `<path d="M130 380 Q140 300 230 290 L310 210 Q330 190 370 190 H520 Q560 190 590 220 L650 290 Q700 300 700 350 V390 H130Z" fill="${body}"/>` +
      `<path d="M330 225 H420 V290 H275Z M440 225 H520 Q545 225 560 245 L595 290 H440Z" fill="#ffffff" opacity="0.75"/>` +
      `<circle cx="250" cy="395" r="52" fill="${wheel}"/><circle cx="250" cy="395" r="22" fill="#e5e7eb"/>` +
      `<circle cx="580" cy="395" r="52" fill="${wheel}"/><circle cx="580" cy="395" r="22" fill="#e5e7eb"/>` +
      `<rect x="670" y="320" width="30" height="16" rx="6" fill="#fde68a"/>`,
  );
}

/** Grafik keuangan + koin. */
function chart(a: string, b: string, bar: string, coin: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="110" y="90" width="580" height="400" rx="26" fill="#ffffff" opacity="0.92"/>` +
      `<rect x="170" y="330" width="60" height="110" rx="10" fill="${bar}" opacity="0.45"/><rect x="260" y="280" width="60" height="160" rx="10" fill="${bar}" opacity="0.6"/>` +
      `<rect x="350" y="230" width="60" height="210" rx="10" fill="${bar}" opacity="0.75"/><rect x="440" y="170" width="60" height="270" rx="10" fill="${bar}"/>` +
      `<path d="M170 300 L290 250 L380 200 L470 140 L560 120" stroke="${coin}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<circle cx="600" cy="390" r="62" fill="${coin}"/><circle cx="600" cy="390" r="42" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.6"/>` +
      `<rect x="170" y="130" width="150" height="16" rx="8" fill="${bar}" opacity="0.3"/>`,
  );
}

/** A heart above a hand (donation). */
function care(a: string, b: string, heart: string, hand: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M400 330 C330 270 250 220 290 150 C320 100 380 110 400 160 C420 110 480 100 510 150 C550 220 470 270 400 330Z" fill="${heart}"/>` +
      `<path d="M150 470 Q250 360 380 400 L400 420 L420 400 Q550 360 650 470 V520 H150Z" fill="${hand}"/>` +
      `<circle cx="180" cy="140" r="14" fill="${heart}" opacity="0.4"/><circle cx="640" cy="200" r="20" fill="${heart}" opacity="0.3"/><circle cx="600" cy="100" r="10" fill="${hand}" opacity="0.4"/>`,
  );
}

/** Two rings + flowers (wedding). */
function rings(a: string, b: string, gold: string, flower: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="340" cy="320" r="110" fill="none" stroke="${gold}" stroke-width="26"/><circle cx="470" cy="320" r="110" fill="none" stroke="${gold}" stroke-width="26" opacity="0.85"/>` +
      `<path d="M440 180 L470 140 L500 180 L470 205Z" fill="#ffffff" stroke="${gold}" stroke-width="4"/>` +
      `<circle cx="140" cy="120" r="34" fill="${flower}" opacity="0.7"/><circle cx="175" cy="150" r="24" fill="${flower}" opacity="0.5"/>` +
      `<circle cx="660" cy="500" r="40" fill="${flower}" opacity="0.6"/><circle cx="620" cy="470" r="22" fill="${flower}" opacity="0.45"/>` +
      `<path d="M120 520 Q200 470 260 520" stroke="${gold}" stroke-width="4" fill="none" opacity="0.5"/>`,
  );
}

/** Gitar + gelombang suara. */
function guitar(a: string, b: string, body: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M60 300 Q100 220 140 300 T220 300 T300 300" stroke="${accent}" stroke-width="6" fill="none" opacity="0.5"/>` +
      `<path d="M500 300 Q540 220 580 300 T660 300 T740 300" stroke="${accent}" stroke-width="6" fill="none" opacity="0.5"/>` +
      `<g transform="rotate(-35 400 330)"><rect x="385" y="60" width="30" height="230" rx="6" fill="${accent}"/><rect x="375" y="40" width="50" height="50" rx="8" fill="${body}"/>` +
      `<ellipse cx="400" cy="330" rx="95" ry="80" fill="${body}"/><ellipse cx="400" cy="440" rx="120" ry="100" fill="${body}"/>` +
      `<circle cx="400" cy="370" r="30" fill="#0b0b0b" opacity="0.6"/><rect x="370" y="460" width="60" height="14" rx="6" fill="${accent}"/></g>`,
  );
}

/** Crane + a half-built building. */
function crane(a: string, b: string, steel: string, wall: string): string {
  let floors = "";
  for (let y = 300; y < 520; y += 44) floors += `<rect x="430" y="${y}" width="230" height="8" fill="${steel}" opacity="0.7"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="430" y="300" width="230" height="260" fill="${wall}" opacity="0.6"/>${floors}` +
      `<rect x="190" y="110" width="22" height="450" fill="${steel}"/><rect x="100" y="110" width="520" height="18" fill="${steel}"/>` +
      `<path d="M201 60 L120 110 M201 60 L560 110" stroke="${steel}" stroke-width="5"/>` +
      `<rect x="500" y="128" width="4" height="120" fill="${steel}"/><rect x="480" y="248" width="44" height="32" rx="4" fill="${wall}"/>` +
      `<rect x="0" y="560" width="800" height="40" fill="${steel}" opacity="0.4"/>`,
  );
}

/** Pantai, laut, pohon kelapa, matahari. */
function beach(sky: string, sea: string, sand: string, sun: string): string {
  return svg(
    1200,
    800,
    lg("b", sky, "#ffffff") +
      `<rect width="1200" height="800" fill="url(#b)"/><circle cx="880" cy="240" r="100" fill="${sun}"/>` +
      `<rect y="430" width="1200" height="200" fill="${sea}"/><path d="M0 470 Q150 450 300 470 T600 470 T900 470 T1200 470" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.5"/>` +
      `<path d="M0 600 Q600 520 1200 600 V800 H0Z" fill="${sand}"/>` +
      `<path d="M260 640 Q250 450 300 300" stroke="#7c4a1e" stroke-width="22" fill="none"/>` +
      `<path d="M300 300 Q220 250 160 300 M300 300 Q380 240 450 290 M300 300 Q260 220 200 210 M300 300 Q350 220 420 220" stroke="#15803d" stroke-width="20" fill="none" stroke-linecap="round"/>`,
  );
}

/** Balok mainan ABC (PAUD). */
function blocks(a: string, b: string, c1: string, c2: string, c3: string): string {
  const blk = (x: number, y: number, c: string, t: string) =>
    `<rect x="${x}" y="${y}" width="130" height="130" rx="16" fill="${c}"/><text x="${x + 65}" y="${y + 92}" font-family="Arial, sans-serif" font-size="80" font-weight="700" fill="#ffffff" text-anchor="middle">${t}</text>`;
  return svg(
    800,
    600,
    bg(a, b) + blk(200, 380, c1, "A") + blk(340, 380, c2, "B") + blk(480, 380, c3, "C") + blk(270, 240, c3, "1") + blk(410, 240, c1, "2") + blk(340, 100, c2, "*") +
      `<circle cx="120" cy="120" r="40" fill="${c1}" opacity="0.3"/><circle cx="690" cy="160" r="54" fill="${c3}" opacity="0.25"/>`,
  );
}

/** Jejak kaki hewan + tulang. */
function paw(a: string, b: string, c: string, d: string): string {
  const p = (x: number, y: number, s: number, col: string) =>
    `<g transform="translate(${x} ${y}) scale(${s})" fill="${col}"><ellipse cx="0" cy="30" rx="48" ry="40"/><ellipse cx="-50" cy="-30" rx="18" ry="24"/><ellipse cx="-18" cy="-55" rx="18" ry="24"/><ellipse cx="18" cy="-55" rx="18" ry="24"/><ellipse cx="50" cy="-30" rx="18" ry="24"/></g>`;
  return svg(
    800,
    600,
    bg(a, b) + p(320, 300, 2, c) + p(620, 140, 0.9, d) + p(150, 480, 0.7, d) +
      `<g fill="${d}"><rect x="560" y="440" width="140" height="28" rx="14"/><circle cx="560" cy="440" r="20"/><circle cx="560" cy="468" r="20"/><circle cx="700" cy="440" r="20"/><circle cx="700" cy="468" r="20"/></g>`,
  );
}

/** Ladang berjajar + matahari. */
function field(sky: string, land: string, crop: string, sun: string): string {
  let rows = "";
  for (let i = 0; i < 7; i++) rows += `<path d="M${-200 + i * 180} 800 L${520 + i * 30} 420" stroke="${crop}" stroke-width="${18 - i}" opacity="0.8"/>`;
  return svg(
    1200,
    800,
    lg("b", sky, "#ffffff") + `<rect width="1200" height="800" fill="url(#b)"/><circle cx="300" cy="230" r="90" fill="${sun}"/>` +
      `<path d="M0 420 Q300 380 600 420 T1200 410 V800 H0Z" fill="${land}"/>${rows}` +
      `<rect x="880" y="300" width="160" height="130" fill="#b91c1c"/><path d="M860 310 L960 240 L1060 310Z" fill="#7f1d1d"/><rect x="940" y="360" width="40" height="70" fill="#fef3c7"/>`,
  );
}

/** Container truck on the road. */
function truck(a: string, b: string, cab: string, box: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect y="440" width="800" height="160" fill="#334155"/><path d="M0 515 H800" stroke="#fde68a" stroke-width="8" stroke-dasharray="50 34"/>` +
      `<rect x="120" y="210" width="380" height="200" rx="10" fill="${box}"/><rect x="150" y="240" width="320" height="16" rx="8" fill="#ffffff" opacity="0.35"/>` +
      `<path d="M510 260 H610 L680 330 V410 H510Z" fill="${cab}"/><path d="M530 280 H600 L650 330 H530Z" fill="#e0f2fe"/>` +
      `<circle cx="210" cy="420" r="38" fill="#0f172a"/><circle cx="410" cy="420" r="38" fill="#0f172a"/><circle cx="600" cy="420" r="38" fill="#0f172a"/>` +
      `<circle cx="210" cy="420" r="14" fill="#cbd5e1"/><circle cx="410" cy="420" r="14" fill="#cbd5e1"/><circle cx="600" cy="420" r="14" fill="#cbd5e1"/>`,
  );
}

/** Gamepad neon. */
function gamepad(a: string, b: string, body: string, glow: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M0 520 L800 520 M0 470 L800 470 M100 600 L300 420 M700 600 L500 420 M400 600 V420" stroke="${glow}" stroke-width="2" opacity="0.4"/>` +
      `<path d="M210 220 Q240 170 320 180 H480 Q560 170 590 220 L650 380 Q670 450 600 450 Q560 450 520 390 H280 Q240 450 200 450 Q130 450 150 380Z" fill="${body}" stroke="${glow}" stroke-width="5"/>` +
      `<rect x="250" y="255" width="80" height="24" rx="6" fill="${glow}"/><rect x="278" y="227" width="24" height="80" rx="6" fill="${glow}"/>` +
      `<circle cx="520" cy="240" r="16" fill="#f43f5e"/><circle cx="555" cy="275" r="16" fill="#22c55e"/><circle cx="485" cy="275" r="16" fill="#3b82f6"/><circle cx="520" cy="310" r="16" fill="#facc15"/>`,
  );
}

/** Fasad bangunan geometris (arsitektur). */
function facade(a: string, b: string, wall: string, glass: string): string {
  let g = "";
  for (let y = 180; y < 470; y += 60) for (let x = 360; x < 620; x += 64) g += `<rect x="${x}" y="${y}" width="50" height="46" fill="${glass}" opacity="0.85"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M120 520 L120 260 L330 160 L330 520Z" fill="${wall}" opacity="0.7"/>` +
      `<rect x="340" y="150" width="300" height="370" fill="${wall}"/>${g}` +
      `<path d="M640 520 V300 L720 340 V520Z" fill="${wall}" opacity="0.5"/>` +
      `<rect y="520" width="800" height="80" fill="${wall}" opacity="0.25"/><path d="M40 520 H760" stroke="${wall}" stroke-width="3"/>`,
  );
}

/** Lembar koran. */
function paper(a: string, b: string, ink: string, accent: string): string {
  let lines = "";
  for (let y = 300; y < 500; y += 22) lines += `<rect x="190" y="${y}" width="190" height="9" rx="4" fill="${ink}" opacity="0.25"/><rect x="420" y="${y}" width="190" height="9" rx="4" fill="${ink}" opacity="0.25"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="150" y="60" width="500" height="480" rx="10" fill="#ffffff"/>` +
      `<rect x="190" y="100" width="420" height="40" rx="6" fill="${ink}"/><rect x="190" y="160" width="300" height="14" rx="7" fill="${accent}"/>` +
      `<rect x="190" y="190" width="420" height="90" rx="8" fill="${accent}" opacity="0.25"/>${lines}`,
  );
}

/** Dasbor CRM (pipeline kanban). */
function crm(a: string, b: string, c1: string, c2: string): string {
  const colm = (x: number, n: number, c: string) => {
    let s = `<rect x="${x}" y="170" width="150" height="330" rx="14" fill="#f8fafc"/><rect x="${x + 16}" y="186" width="80" height="12" rx="6" fill="${c}"/>`;
    for (let i = 0; i < n; i++) s += `<rect x="${x + 12}" y="${214 + i * 70}" width="126" height="58" rx="10" fill="#ffffff" stroke="#e2e8f0"/><rect x="${x + 24}" y="${228 + i * 70}" width="70" height="9" rx="4" fill="${c}" opacity="0.6"/><circle cx="${x + 118}" cy="${256 + i * 70}" r="9" fill="${c}" opacity="0.4"/>`;
    return s;
  };
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="70" y="80" width="660" height="450" rx="22" fill="#ffffff"/><rect x="70" y="80" width="660" height="60" rx="22" fill="${c1}"/><rect x="70" y="120" width="660" height="20" fill="${c1}"/>` +
      `<rect x="100" y="102" width="120" height="14" rx="7" fill="#ffffff" opacity="0.8"/>` +
      colm(95, 4, c1) + colm(255, 3, c2) + colm(415, 2, c1) + colm(575, 3, c2),
  );
}

/** Botol skincare. */
function bottle(a: string, b: string, body: string, cap: string, shape = 0): string {
  const shapes = [
    `<rect x="320" y="200" width="160" height="300" rx="30" fill="${body}"/><rect x="355" y="130" width="90" height="80" rx="10" fill="${cap}"/>`,
    `<rect x="300" y="260" width="200" height="240" rx="90" fill="${body}"/><rect x="370" y="170" width="60" height="100" rx="8" fill="${cap}"/><rect x="385" y="140" width="80" height="20" rx="6" fill="${cap}"/>`,
    `<rect x="280" y="330" width="240" height="160" rx="30" fill="${body}"/><rect x="270" y="290" width="260" height="60" rx="18" fill="${cap}"/>`,
    `<path d="M340 160 H460 L480 500 H320Z" fill="${body}"/><rect x="350" y="110" width="100" height="56" rx="10" fill="${cap}"/>`,
  ];
  return svg(
    800,
    600,
    bg(a, b) + `<ellipse cx="400" cy="505" rx="200" ry="22" fill="#000000" opacity="0.08"/>` + shapes[shape % shapes.length] +
      `<rect x="345" y="360" width="110" height="60" rx="8" fill="#ffffff" opacity="0.7"/><circle cx="160" cy="140" r="40" fill="${cap}" opacity="0.2"/><circle cx="650" cy="420" r="60" fill="${body}" opacity="0.15"/>`,
  );
}

/** Gedung kampus + pohon. */
function campus(sky: string, wall: string, roof: string, tree: string): string {
  let cols = "";
  for (let x = 330; x <= 830; x += 70) cols += `<rect x="${x}" y="380" width="30" height="230" fill="#ffffff" opacity="0.9"/>`;
  return svg(
    1200,
    800,
    lg("b", sky, "#ffffff") + `<rect width="1200" height="800" fill="url(#b)"/>` +
      `<rect x="280" y="360" width="640" height="260" fill="${wall}"/>${cols}<path d="M250 370 L600 200 L950 370Z" fill="${roof}"/>` +
      `<circle cx="600" cy="300" r="34" fill="#ffffff" opacity="0.8"/><rect y="620" width="1200" height="180" fill="${tree}" opacity="0.35"/>` +
      `<circle cx="140" cy="540" r="90" fill="${tree}"/><rect x="130" y="580" width="20" height="80" fill="#78350f"/><circle cx="1060" cy="520" r="110" fill="${tree}"/><rect x="1050" y="570" width="22" height="90" fill="#78350f"/>`,
  );
}

/** Gigi + kilau (klinik gigi). */
function tooth(a: string, b: string, body: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M300 170 Q350 140 400 175 Q450 140 500 170 Q560 210 540 300 Q525 360 515 450 Q505 500 475 470 Q455 400 440 380 Q400 360 360 380 Q345 400 325 470 Q295 500 285 450 Q275 360 260 300 Q240 210 300 170Z" fill="${body}" stroke="${accent}" stroke-width="6"/>` +
      `<path d="M600 140 L612 172 L644 184 L612 196 L600 228 L588 196 L556 184 L588 172Z" fill="${accent}"/><path d="M180 360 L188 380 L208 388 L188 396 L180 416 L172 396 L152 388 L172 380Z" fill="${accent}" opacity="0.7"/>`,
  );
}

/** Siluet kubah & menara (perjalanan ibadah). */
function dome(sky1: string, sky2: string, bld: string, moon: string): string {
  return svg(
    1200,
    800,
    lg("b", sky1, sky2) + `<rect width="1200" height="800" fill="url(#b)"/>` +
      `<circle cx="930" cy="190" r="70" fill="${moon}"/><circle cx="960" cy="170" r="62" fill="${sky1}"/>` +
      `<rect x="250" y="250" width="34" height="400" fill="${bld}"/><path d="M240 255 L267 190 L294 255Z" fill="${bld}"/>` +
      `<rect x="916" y="300" width="34" height="350" fill="${bld}"/><path d="M906 305 L933 240 L960 305Z" fill="${bld}"/>` +
      `<rect x="380" y="460" width="440" height="200" fill="${bld}"/><path d="M440 470 Q440 300 600 280 Q760 300 760 470Z" fill="${bld}"/>` +
      `<rect y="650" width="1200" height="150" fill="${bld}" opacity="0.85"/>`,
  );
}

/** Panggung festival + lampu sorot + kerumunan. */
function festival(a: string, b: string, light: string, crowd: string): string {
  let heads = "";
  for (let x = 20; x < 1200; x += 46) heads += `<circle cx="${x}" cy="${700 + ((x * 7) % 30)}" r="24" fill="${crowd}"/>`;
  return svg(
    1200,
    800,
    lg("b", a, b) + `<rect width="1200" height="800" fill="url(#b)"/>` +
      `<path d="M200 0 L420 520 L520 520Z M1000 0 L780 520 L680 520Z M600 0 L560 520 L640 520Z" fill="${light}" opacity="0.22"/>` +
      `<rect x="250" y="420" width="700" height="140" fill="#020617"/><rect x="250" y="400" width="700" height="24" fill="${light}"/>` +
      `<rect x="250" y="160" width="20" height="260" fill="#334155"/><rect x="930" y="160" width="20" height="260" fill="#334155"/><rect x="250" y="160" width="700" height="20" fill="#334155"/>${heads}` +
      `<rect y="720" width="1200" height="80" fill="${crowd}"/>`,
  );
}

/** Megafon + grafik naik (agensi marketing). */
function megaphone(a: string, b: string, body: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M220 260 L470 160 V440 L220 340Z" fill="${body}"/><rect x="160" y="255" width="70" height="90" rx="12" fill="${accent}"/>` +
      `<rect x="250" y="340" width="40" height="110" rx="10" fill="${body}" opacity="0.8"/>` +
      `<path d="M510 220 Q560 300 510 380 M550 180 Q630 300 550 420" stroke="${accent}" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<path d="M560 520 L630 470 L680 490 L750 420" stroke="${body}" stroke-width="10" fill="none" stroke-linecap="round"/>`,
  );
}

/** Pabrik + cerobong + roda gigi. */
function factory(a: string, b: string, wall: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M100 520 V320 L220 260 V320 L340 260 V320 L460 260 V320 L580 260 V520Z" fill="${wall}"/>` +
      `<rect x="620" y="150" width="50" height="370" fill="${wall}"/><circle cx="660" cy="110" r="30" fill="${accent}" opacity="0.25"/><circle cx="700" cy="70" r="22" fill="${accent}" opacity="0.18"/>` +
      `<rect x="150" y="390" width="70" height="50" fill="${accent}"/><rect x="270" y="390" width="70" height="50" fill="${accent}"/><rect x="390" y="390" width="70" height="50" fill="${accent}"/><rect x="490" y="420" width="60" height="100" fill="${accent}" opacity="0.8"/>` +
      `<circle cx="160" cy="150" r="54" fill="none" stroke="${accent}" stroke-width="18" stroke-dasharray="20 12"/><rect y="520" width="800" height="80" fill="${wall}" opacity="0.4"/>`,
  );
}

/** Potret sederhana (tim, testimoni). */
function avatar(a: string, skin: string, hair: string, shirt: string): string {
  return svg(
    600,
    600,
    `<rect width="600" height="600" fill="${a}"/><path d="M110 600 Q120 430 300 420 Q480 430 490 600Z" fill="${shirt}"/>` +
      `<rect x="265" y="350" width="70" height="90" rx="20" fill="${skin}"/><ellipse cx="300" cy="260" rx="110" ry="125" fill="${skin}"/>` +
      `<path d="M190 250 Q190 120 300 120 Q420 120 412 255 Q390 180 300 175 Q220 180 190 250Z" fill="${hair}"/>` +
      `<circle cx="260" cy="270" r="9" fill="#1f2937"/><circle cx="340" cy="270" r="9" fill="#1f2937"/><path d="M265 320 Q300 345 335 320" stroke="#9a3412" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  );
}

/** A plate of food from above. */
function plate(a: string, food: string, side: string): string {
  return svg(
    800,
    600,
    `<rect width="800" height="600" fill="${a}"/><circle cx="400" cy="300" r="210" fill="#ffffff"/><circle cx="400" cy="300" r="165" fill="#f8fafc" stroke="#e2e8f0" stroke-width="4"/>` +
      `<circle cx="370" cy="290" r="90" fill="${food}"/><circle cx="470" cy="240" r="40" fill="${side}"/><circle cx="460" cy="360" r="34" fill="${side}" opacity="0.8"/>` +
      `<rect x="120" y="120" width="16" height="360" rx="8" fill="#cbd5e1"/><rect x="664" y="120" width="16" height="360" rx="8" fill="#cbd5e1"/>`,
  );
}

const SCENES: Record<string, () => string> = {
  // Kafe
  "v2a-cafe-hero": () => cup("#fef3c7", "#fde68a", "#7c2d12", "#3f1d0b"),
  "v2a-cafe-latte": () => cup("#fff7ed", "#fed7aa", "#ffffff", "#92400e"),
  "v2a-cafe-cold": () => cup("#ecfeff", "#cffafe", "#0e7490", "#451a03"),
  "v2a-cafe-plate": () => plate("#fef9c3", "#d97706", "#65a30d"),
  // Gym
  "v2a-gym-hero": () => dumbbell("#111827", "#1f2937", "#e5e7eb", "#facc15"),
  "v2a-gym-class": () => dumbbell("#fef9c3", "#fde047", "#111827", "#ef4444"),
  // Salon
  "v2a-salon-hero": () => mirror("#fdf2f8", "#fce7f3", "#be185d", "#d4a373"),
  "v2a-salon-spa": () => mirror("#f5f5f4", "#e7e5e4", "#a16207", "#84cc16"),
  // Bengkel
  "v2a-auto-hero": () => car("#e0f2fe", "#f8fafc", "#dc2626", "#111827"),
  "v2a-auto-suv": () => car("#f1f5f9", "#e2e8f0", "#1e3a8a", "#0f172a"),
  // Keuangan
  "v2a-fin-hero": () => chart("#ecfdf5", "#d1fae5", "#047857", "#f59e0b"),
  "v2a-fin-plan": () => chart("#eef2ff", "#e0e7ff", "#4338ca", "#10b981"),
  // Nirlaba
  "v2a-care-hero": () => care("#fff7ed", "#ffedd5", "#ea580c", "#92400e"),
  "v2a-care-edu": () => care("#f0fdf4", "#dcfce7", "#16a34a", "#a16207"),
  // Pernikahan
  "v2a-wed-hero": () => rings("#fdf8f3", "#f5ebe0", "#b08968", "#e5989b"),
  "v2a-wed-venue": () => rings("#f1f5f9", "#e2e8f0", "#64748b", "#a5b4fc"),
  // Musik
  "v2a-music-hero": () => guitar("#1e1b4b", "#0f0a1f", "#f97316", "#facc15"),
  "v2a-music-album": () => guitar("#fde68a", "#f59e0b", "#7c2d12", "#111827"),
  // Konstruksi
  "v2a-build-hero": () => crane("#fef3c7", "#fffbeb", "#1f2937", "#f59e0b"),
  "v2a-build-site": () => crane("#e2e8f0", "#f8fafc", "#334155", "#94a3b8"),
  // Resort
  "v2a-resort-hero": () => beach("#7dd3fc", "#0284c7", "#fde68a", "#fef08a"),
  "v2a-resort-sunset": () => beach("#fb923c", "#9a3412", "#fcd34d", "#fef3c7"),
  "v2a-resort-dish": () => plate("#ecfeff", "#0891b2", "#f97316"),
  // PAUD
  "v2a-kids-hero": () => blocks("#fef9c3", "#fefce8", "#ef4444", "#3b82f6", "#22c55e"),
  "v2a-kids-play": () => blocks("#e0f2fe", "#f0f9ff", "#f97316", "#a855f7", "#14b8a6"),
  // Hewan
  "v2a-pet-hero": () => paw("#ecfdf5", "#d1fae5", "#059669", "#f59e0b"),
  "v2a-pet-groom": () => paw("#fdf4ff", "#fae8ff", "#a21caf", "#0ea5e9"),
  // Pertanian
  "v2a-agri-hero": () => field("#bae6fd", "#65a30d", "#3f6212", "#fde047"),
  "v2a-agri-harvest": () => field("#fde68a", "#ca8a04", "#713f12", "#fef3c7"),
  // Logistik
  "v2a-log-hero": () => truck("#dbeafe", "#eff6ff", "#1d4ed8", "#f97316"),
  "v2a-log-fleet": () => truck("#fef3c7", "#fffbeb", "#0f172a", "#16a34a"),
  // Gaming
  "v2a-game-hero": () => gamepad("#0b0118", "#1e0b3a", "#1f1147", "#22d3ee"),
  "v2a-game-arena": () => gamepad("#020617", "#0f172a", "#111827", "#a3e635"),
  // Arsitektur
  "v2a-arch-hero": () => facade("#f5f5f4", "#e7e5e4", "#292524", "#a8a29e"),
  "v2a-arch-house": () => facade("#ecfccb", "#f7fee7", "#3f6212", "#d9f99d"),
  "v2a-arch-tower": () => facade("#e0e7ff", "#eef2ff", "#1e1b4b", "#93c5fd"),
  // Berita
  "v2a-news-1": () => paper("#fee2e2", "#fef2f2", "#111827", "#dc2626"),
  "v2a-news-2": () => paper("#e0f2fe", "#f0f9ff", "#0f172a", "#0284c7"),
  "v2a-news-3": () => paper("#fef9c3", "#fefce8", "#1c1917", "#ca8a04"),
  "v2a-news-4": () => paper("#dcfce7", "#f0fdf4", "#052e16", "#16a34a"),
  // SaaS CRM
  "v2a-crm-hero": () => crm("#ede9fe", "#f5f3ff", "#7c3aed", "#14b8a6"),
  "v2a-crm-report": () => crm("#ccfbf1", "#f0fdfa", "#0f766e", "#f59e0b"),
  // Skincare (products)
  "v2a-skin-hero": () => bottle("#fdf2f8", "#fce7f3", "#f9a8d4", "#831843", 0),
  "v2a-skin-1": () => bottle("#fff1f2", "#ffe4e6", "#fda4af", "#9f1239", 0),
  "v2a-skin-2": () => bottle("#f0fdf4", "#dcfce7", "#86efac", "#14532d", 1),
  "v2a-skin-3": () => bottle("#fefce8", "#fef9c3", "#fde047", "#713f12", 2),
  "v2a-skin-4": () => bottle("#eff6ff", "#dbeafe", "#93c5fd", "#1e3a8a", 3),
  "v2a-skin-5": () => bottle("#faf5ff", "#f3e8ff", "#d8b4fe", "#581c87", 1),
  "v2a-skin-6": () => bottle("#fff7ed", "#ffedd5", "#fdba74", "#7c2d12", 2),
  // Universitas
  "v2a-uni-hero": () => campus("#bfdbfe", "#1e3a8a", "#172554", "#15803d"),
  "v2a-uni-lab": () => campus("#e9d5ff", "#6b21a8", "#3b0764", "#65a30d"),
  // Gigi
  "v2a-dental-hero": () => tooth("#ecfeff", "#cffafe", "#ffffff", "#0891b2"),
  "v2a-dental-kids": () => tooth("#fef9c3", "#fefce8", "#ffffff", "#f59e0b"),
  // Umrah
  "v2a-umrah-hero": () => dome("#0f3d3e", "#e9c46a", "#0b2b2c", "#fefae0"),
  "v2a-umrah-dusk": () => dome("#1e3a8a", "#f4a261", "#172554", "#fef3c7"),
  // Festival
  "v2a-fest-hero": () => festival("#4c0519", "#0c0a09", "#fb7185", "#1c1917"),
  "v2a-fest-stage2": () => festival("#082f49", "#020617", "#38bdf8", "#0f172a"),
  // Agensi marketing
  "v2a-mkt-hero": () => megaphone("#fff7ed", "#ffedd5", "#ea580c", "#0f172a"),
  "v2a-mkt-case": () => megaphone("#ecfeff", "#cffafe", "#0e7490", "#f43f5e"),
  // Manufaktur
  "v2a-mfg-hero": () => factory("#e2e8f0", "#f8fafc", "#334155", "#0ea5e9"),
  "v2a-mfg-plant": () => factory("#fef3c7", "#fffbeb", "#78350f", "#f59e0b"),
  // Potret
  "v2a-face-1": () => avatar("#fde68a", "#f1c27d", "#1f2937", "#b45309"),
  "v2a-face-2": () => avatar("#bfdbfe", "#c68642", "#111827", "#1d4ed8"),
  "v2a-face-3": () => avatar("#fbcfe8", "#ffdbac", "#7c2d12", "#be185d"),
  "v2a-face-4": () => avatar("#bbf7d0", "#8d5524", "#0f172a", "#15803d"),
  "v2a-face-5": () => avatar("#ddd6fe", "#e0ac69", "#3f2a1d", "#6d28d9"),
  "v2a-face-6": () => avatar("#e5e7eb", "#f1c27d", "#78716c", "#334155"),
};

export const V2A_SOURCES: Record<string, () => string> = SCENES;
