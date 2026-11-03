/* ================================================================== */
/* Ilustrasi SVG untuk template v3 bagian C                             */
/* (buatan sendiri, ASCII, tanpa URL eksternal; nama berawalan "v3c-").  */
/* Bentuk datar sederhana + warna per tema, jadi satu bentuk punya       */
/* beberapa varian.                                                      */
/* ================================================================== */

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const bg = (a: string, b: string, w = 800, h = 600) =>
  `<defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${w}" height="${h}" fill="url(#b)"/>`;

const dots = (c: string, n = 14, w = 800, h = 600) => {
  let out = "";
  for (let i = 0; i < n; i++) out += `<circle cx="${(i * 137) % w}" cy="${(i * 89) % h}" r="${4 + (i % 4) * 3}" fill="${c}" opacity="0.35"/>`;
  return out;
};

/** Roti & croissant. */
function bread(a: string, b: string, crust: string, crumb: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<ellipse cx="400" cy="500" rx="300" ry="34" fill="#000000" opacity="0.1"/>` +
      `<rect x="150" y="380" width="500" height="40" rx="20" fill="${crust}" opacity="0.35"/>` +
      `<path d="M190 380 Q190 230 330 230 Q470 230 470 380Z" fill="${crust}"/><path d="M230 300 L260 270 M290 290 L320 255 M350 290 L380 258 M410 300 L435 275" stroke="${crumb}" stroke-width="12" stroke-linecap="round"/>` +
      `<path d="M470 400 Q520 300 600 320 Q680 340 640 400 Q600 430 540 420 Q490 425 470 400Z" fill="${crumb}"/><path d="M520 330 Q540 380 520 415 M570 322 Q585 375 575 422 M615 335 Q625 375 620 410" stroke="${crust}" stroke-width="9" fill="none" opacity="0.6"/>` +
      `<path d="M300 170 Q280 130 300 90 M360 170 Q340 130 360 90 M420 170 Q400 130 420 90" stroke="${crust}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.35"/>`,
  );
}

/** Kue tingkat. */
function cake(a: string, b: string, cream: string, berry: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<ellipse cx="400" cy="520" rx="250" ry="28" fill="#000000" opacity="0.1"/><rect x="170" y="500" width="460" height="16" rx="8" fill="#ffffff"/>` +
      `<rect x="210" y="370" width="380" height="130" rx="18" fill="${cream}"/><rect x="270" y="260" width="260" height="115" rx="16" fill="${cream}"/><rect x="330" y="170" width="140" height="95" rx="14" fill="${cream}"/>` +
      `<path d="M210 400 Q240 430 270 400 T330 400 T390 400 T450 400 T510 400 T570 400 T590 400" stroke="${berry}" stroke-width="10" fill="none"/>` +
      `<path d="M270 290 Q300 315 330 290 T390 290 T450 290 T510 290 T530 290" stroke="${berry}" stroke-width="8" fill="none" opacity="0.7"/>` +
      `<circle cx="400" cy="155" r="20" fill="${berry}"/><path d="M400 135 Q410 115 425 112" stroke="#16a34a" stroke-width="6" fill="none"/>` +
      `<circle cx="300" cy="360" r="12" fill="${berry}"/><circle cx="500" cy="360" r="12" fill="${berry}"/><circle cx="400" cy="250" r="10" fill="${berry}"/>`,
  );
}

/** Lapangan & bola. */
function pitch(a: string, b: string, line: string, ball: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="60" y="90" width="680" height="420" rx="16" fill="none" stroke="${line}" stroke-width="6"/><line x1="400" y1="90" x2="400" y2="510" stroke="${line}" stroke-width="6"/>` +
      `<circle cx="400" cy="300" r="70" fill="none" stroke="${line}" stroke-width="6"/><rect x="60" y="210" width="90" height="180" fill="none" stroke="${line}" stroke-width="6"/><rect x="650" y="210" width="90" height="180" fill="none" stroke="${line}" stroke-width="6"/>` +
      `<circle cx="520" cy="360" r="46" fill="#ffffff"/><path d="M520 330 L545 348 L536 378 L504 378 L495 348Z" fill="${ball}"/><path d="M520 330 L520 314 M545 348 L562 340 M536 378 L548 394 M504 378 L492 394 M495 348 L478 340" stroke="${ball}" stroke-width="5"/>`,
  );
}

/** Pelari + garis jalan. */
function runner(a: string, b: string, body: string, road: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M0 470 Q400 400 800 470 L800 600 L0 600Z" fill="${road}"/><path d="M80 520 L200 505 M300 495 L420 490 M520 492 L640 500" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.7"/>` +
      `<circle cx="420" cy="150" r="38" fill="${body}"/>` +
      `<path d="M410 195 L380 300 L310 340 M380 300 L440 380 L420 450 M405 215 L470 260 L520 230 M400 220 L340 250 L310 220" stroke="${body}" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="620" cy="120" r="54" fill="#ffffff" opacity="0.5"/><path d="M120 200 L220 200 M90 240 L200 240 M140 280 L230 280" stroke="#ffffff" stroke-width="8" stroke-linecap="round" opacity="0.6"/>`,
  );
}

/** Kubah masjid & bulan sabit. */
function mosque(a: string, b: string, dome: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="640" cy="120" r="46" fill="${accent}"/><circle cx="662" cy="108" r="40" fill="${a}"/>` +
      `<rect x="160" y="330" width="480" height="200" fill="${dome}"/><path d="M260 330 Q260 190 400 170 Q540 190 540 330Z" fill="${dome}"/><rect x="396" y="130" width="8" height="45" fill="${accent}"/><circle cx="400" cy="126" r="10" fill="${accent}"/>` +
      `<rect x="110" y="220" width="40" height="310" fill="${dome}"/><path d="M110 220 L130 170 L150 220Z" fill="${accent}"/><rect x="650" y="220" width="40" height="310" fill="${dome}"/><path d="M650 220 L670 170 L690 220Z" fill="${accent}"/>` +
      `<path d="M360 530 L360 440 Q400 400 440 440 L440 530Z" fill="${accent}"/><path d="M220 400 Q245 370 270 400 L270 450 L220 450Z M530 400 Q555 370 580 400 L580 450 L530 450Z" fill="${accent}" opacity="0.7"/>` +
      `<rect x="0" y="530" width="800" height="70" fill="${accent}" opacity="0.25"/>`,
  );
}

/** Pola geometris islami. */
function geometric(a: string, c1: string, c2: string): string {
  let s = "";
  for (let y = 0; y < 6; y++)
    for (let x = 0; x < 8; x++) {
      const cx = x * 100 + 50;
      const cy = y * 100 + 50;
      s += `<path d="M${cx} ${cy - 40} L${cx + 12} ${cy - 12} L${cx + 40} ${cy} L${cx + 12} ${cy + 12} L${cx} ${cy + 40} L${cx - 12} ${cy + 12} L${cx - 40} ${cy} L${cx - 12} ${cy - 12}Z" fill="${(x + y) % 2 ? c1 : c2}"/>`;
    }
  return svg(800, 600, `<rect width="800" height="600" fill="${a}"/>${s}`);
}

/** Gereja dengan jendela kaca. */
function chapel(a: string, b: string, wall: string, glass: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="250" y="260" width="300" height="270" fill="${wall}"/><path d="M230 270 L400 130 L570 270Z" fill="${glass}"/><rect x="380" y="60" width="40" height="100" fill="${wall}"/><rect x="392" y="40" width="16" height="60" fill="${glass}"/><rect x="372" y="54" width="56" height="14" fill="${glass}"/>` +
      `<circle cx="400" cy="320" r="40" fill="${glass}"/><path d="M400 280 L400 360 M360 320 L440 320 M372 292 L428 348 M428 292 L372 348" stroke="${wall}" stroke-width="5"/>` +
      `<path d="M370 530 L370 440 Q400 405 430 440 L430 530Z" fill="${glass}"/><path d="M285 420 Q305 390 325 420 L325 480 L285 480Z M475 420 Q495 390 515 420 L515 480 L475 480Z" fill="${glass}" opacity="0.75"/>` +
      `<rect x="0" y="530" width="800" height="70" fill="${glass}" opacity="0.2"/>` +
      dots("#ffffff", 10),
  );
}

/** Mikrofon podcast. */
function mic(a: string, b: string, body: string, wave: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M120 300 L160 300 L180 250 L200 350 L220 220 L240 380 L260 270 L280 300 L320 300" stroke="${wave}" stroke-width="8" fill="none" stroke-linejoin="round"/><path d="M480 300 L520 300 L540 240 L560 360 L580 260 L600 330 L620 290 L680 300" stroke="${wave}" stroke-width="8" fill="none" stroke-linejoin="round"/>` +
      `<rect x="350" y="120" width="100" height="200" rx="50" fill="${body}"/><path d="M362 170 H438 M362 200 H438 M362 230 H438" stroke="${wave}" stroke-width="5" opacity="0.6"/>` +
      `<path d="M320 250 Q320 360 400 360 Q480 360 480 250" stroke="${body}" stroke-width="14" fill="none"/><rect x="392" y="360" width="16" height="90" fill="${body}"/><rect x="330" y="450" width="140" height="18" rx="9" fill="${body}"/>`,
  );
}

/** Headphone + bilik studio. */
function headphones(a: string, b: string, body: string, pad: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="80" y="80" width="640" height="440" rx="24" fill="#ffffff" opacity="0.08"/>` +
      `<path d="M260 340 Q260 150 400 150 Q540 150 540 340" stroke="${body}" stroke-width="26" fill="none" stroke-linecap="round"/>` +
      `<rect x="220" y="310" width="90" height="150" rx="34" fill="${pad}"/><rect x="490" y="310" width="90" height="150" rx="34" fill="${pad}"/><rect x="240" y="330" width="50" height="110" rx="22" fill="${body}"/><rect x="510" y="330" width="50" height="110" rx="22" fill="${body}"/>` +
      `<path d="M120 520 L120 470 M150 520 L150 440 M180 520 L180 480 M620 520 L620 450 M650 520 L650 480 M680 520 L680 430" stroke="${pad}" stroke-width="12" stroke-linecap="round"/>`,
  );
}

/** Kaos/hoodie streetwear. */
function tee(a: string, b: string, cloth: string, print: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M300 110 L230 140 L150 230 L210 290 L250 250 L250 510 L550 510 L550 250 L590 290 L650 230 L570 140 L500 110 Q400 170 300 110Z" fill="${cloth}"/>` +
      `<path d="M330 260 L470 260 L470 300 L330 300Z" fill="${print}"/><path d="M340 320 L460 320 M340 345 L430 345" stroke="${print}" stroke-width="10" stroke-linecap="round"/><circle cx="400" cy="420" r="38" fill="none" stroke="${print}" stroke-width="10"/>` +
      `<path d="M70 70 L130 70 M100 40 L100 100 M690 500 L740 550 M740 500 L690 550" stroke="${print}" stroke-width="8" stroke-linecap="round"/>`,
  );
}

/** Kain batik (motif parang & kawung sederhana). */
function batik(base: string, ink: string, gold: string): string {
  let s = "";
  for (let y = 0; y < 4; y++)
    for (let x = 0; x < 5; x++) {
      const cx = x * 160 + 80;
      const cy = y * 160 + 70;
      s += `<ellipse cx="${cx}" cy="${cy - 22}" rx="14" ry="22" fill="${ink}"/><ellipse cx="${cx}" cy="${cy + 22}" rx="14" ry="22" fill="${ink}"/><ellipse cx="${cx - 22}" cy="${cy}" rx="22" ry="14" fill="${ink}"/><ellipse cx="${cx + 22}" cy="${cy}" rx="22" ry="14" fill="${ink}"/><circle cx="${cx}" cy="${cy}" r="6" fill="${gold}"/>`;
    }
  return svg(800, 600, `<rect width="800" height="600" fill="${base}"/>${s}<path d="M0 600 L800 0" stroke="${gold}" stroke-width="18" opacity="0.5"/>`);
}

/** Mesin cetak & kertas CMYK. */
function press(a: string, b: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="180" y="220" width="440" height="200" rx="22" fill="#1f2937"/><rect x="230" y="150" width="340" height="90" rx="10" fill="#ffffff"/><rect x="250" y="400" width="300" height="130" rx="6" fill="#ffffff"/>` +
      `<rect x="280" y="430" width="60" height="60" fill="#06b6d4"/><rect x="345" y="430" width="60" height="60" fill="#ec4899"/><rect x="410" y="430" width="60" height="60" fill="#facc15"/><rect x="475" y="430" width="40" height="60" fill="#111827"/>` +
      `<circle cx="560" cy="270" r="12" fill="#22c55e"/><rect x="220" y="260" width="160" height="16" rx="8" fill="#374151"/>` +
      `<circle cx="120" cy="120" r="50" fill="#06b6d4" opacity="0.7"/><circle cx="160" cy="150" r="50" fill="#ec4899" opacity="0.6"/><circle cx="130" cy="175" r="50" fill="#facc15" opacity="0.6"/>`,
  );
}

/** Mesin cuci + gelembung. */
function washer(a: string, b: string, body: string, water: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="250" y="110" width="300" height="400" rx="30" fill="${body}"/><rect x="250" y="110" width="300" height="70" rx="30" fill="${water}" opacity="0.4"/><circle cx="300" cy="145" r="12" fill="${water}"/><rect x="420" y="135" width="100" height="20" rx="10" fill="#ffffff"/>` +
      `<circle cx="400" cy="340" r="120" fill="#ffffff"/><circle cx="400" cy="340" r="95" fill="${water}"/><path d="M310 350 Q355 310 400 350 T490 350 L490 400 Q400 450 310 400Z" fill="#ffffff" opacity="0.4"/>` +
      `<circle cx="150" cy="200" r="30" fill="#ffffff" opacity="0.6"/><circle cx="120" cy="290" r="18" fill="#ffffff" opacity="0.5"/><circle cx="660" cy="180" r="36" fill="#ffffff" opacity="0.6"/><circle cx="640" cy="300" r="20" fill="#ffffff" opacity="0.5"/>`,
  );
}

/** Buket bunga. */
function bouquet(a: string, b: string, petal: string, petal2: string, leaf: string): string {
  const flower = (x: number, y: number, c: string) =>
    `<circle cx="${x}" cy="${y - 26}" r="22" fill="${c}"/><circle cx="${x + 26}" cy="${y}" r="22" fill="${c}"/><circle cx="${x}" cy="${y + 26}" r="22" fill="${c}"/><circle cx="${x - 26}" cy="${y}" r="22" fill="${c}"/><circle cx="${x}" cy="${y}" r="14" fill="#fde68a"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M400 540 L330 300 M400 540 L400 280 M400 540 L470 300" stroke="${leaf}" stroke-width="10"/><path d="M340 380 Q290 360 300 320 Q340 340 350 380Z M460 380 Q510 360 500 320 Q460 340 450 380Z" fill="${leaf}"/>` +
      flower(330, 260, petal) +
      flower(400, 220, petal2) +
      flower(470, 260, petal) +
      flower(365, 320, petal2) +
      flower(440, 320, petal2) +
      `<path d="M330 430 L470 430 L430 540 L370 540Z" fill="#ffffff" opacity="0.85"/><path d="M370 470 Q400 490 430 470" stroke="${petal}" stroke-width="8" fill="none"/>`,
  );
}

/** Gerbang dekorasi pernikahan. */
function arch(a: string, b: string, frame: string, bloom: string): string {
  let f = "";
  for (let i = 0; i < 16; i++) {
    const t = (Math.PI * i) / 15;
    f += `<circle cx="${Math.round(400 - Math.cos(t) * 200)}" cy="${Math.round(330 - Math.sin(t) * 200)}" r="${16 + (i % 3) * 6}" fill="${i % 2 ? bloom : "#ffffff"}"/>`;
  }
  return svg(800, 600, bg(a, b) + `<path d="M200 540 L200 330 Q200 130 400 130 Q600 130 600 330 L600 540" stroke="${frame}" stroke-width="14" fill="none"/>${f}<rect x="300" y="470" width="200" height="16" rx="8" fill="${frame}"/><rect x="0" y="540" width="800" height="60" fill="${frame}" opacity="0.25"/>`);
}

/** Ponsel & gawai. */
function gadget(a: string, b: string, body: string, screen: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="170" y="140" width="330" height="230" rx="16" fill="${body}"/><rect x="185" y="155" width="300" height="190" rx="8" fill="${screen}"/><rect x="130" y="370" width="410" height="22" rx="11" fill="${body}"/>` +
      `<rect x="520" y="170" width="140" height="270" rx="26" fill="${body}"/><rect x="532" y="190" width="116" height="226" rx="16" fill="${screen}"/><circle cx="590" cy="180" r="4" fill="${screen}"/>` +
      `<rect x="215" y="190" width="120" height="14" rx="7" fill="#ffffff" opacity="0.8"/><rect x="215" y="220" width="200" height="10" rx="5" fill="#ffffff" opacity="0.5"/><rect x="215" y="270" width="80" height="50" rx="8" fill="#ffffff" opacity="0.3"/><rect x="305" y="270" width="80" height="50" rx="8" fill="#ffffff" opacity="0.3"/>` +
      `<circle cx="300" cy="470" r="44" fill="${body}"/><circle cx="300" cy="470" r="26" fill="${screen}"/><rect x="380" y="440" width="70" height="70" rx="20" fill="${body}"/>`,
  );
}

/** Meja ilustrator: kertas, pensil, palet. */
function sketch(a: string, b: string, c1: string, c2: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="140" y="110" width="380" height="380" rx="10" fill="#ffffff" transform="rotate(-4 330 300)"/>` +
      `<path d="M210 360 Q260 220 330 300 T450 230" stroke="${c1}" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="270" cy="210" r="40" fill="${c2}" opacity="0.8"/><path d="M380 380 Q420 330 460 380 Q420 420 380 380Z" fill="${c1}" opacity="0.7"/>` +
      `<rect x="560" y="140" width="24" height="300" rx="6" fill="${c2}" transform="rotate(18 572 290)"/><path d="M606 418 L620 460 L590 450Z" fill="#1f2937"/>` +
      `<ellipse cx="620" cy="480" rx="110" ry="60" fill="#fef3c7"/><circle cx="580" cy="465" r="14" fill="${c1}"/><circle cx="620" cy="450" r="14" fill="${c2}"/><circle cx="660" cy="470" r="14" fill="#22c55e"/><circle cx="625" cy="500" r="14" fill="#3b82f6"/>`,
  );
}

/** Mangkuk ramen. */
function ramen(a: string, b: string, bowl: string, broth: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M300 140 Q280 100 300 60 M380 140 Q360 100 380 60 M460 140 Q440 100 460 60" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round" opacity="0.5"/>` +
      `<ellipse cx="400" cy="280" rx="260" ry="60" fill="${broth}"/><path d="M180 290 Q230 250 280 290 T380 290 T480 290 T580 290" stroke="#fde68a" stroke-width="10" fill="none"/>` +
      `<circle cx="480" cy="265" r="34" fill="#ffffff"/><circle cx="480" cy="265" r="18" fill="#f59e0b"/><rect x="290" y="245" width="80" height="40" rx="8" fill="#b45309"/><circle cx="360" cy="300" r="12" fill="#22c55e"/><circle cx="390" cy="310" r="10" fill="#22c55e"/>` +
      `<path d="M140 280 Q150 480 400 490 Q650 480 660 280Z" fill="${bowl}"/><path d="M200 380 L600 380" stroke="#ffffff" stroke-width="6" opacity="0.4"/>` +
      `<rect x="520" y="90" width="12" height="230" rx="6" fill="#d6a76c" transform="rotate(30 526 205)"/><rect x="550" y="90" width="12" height="230" rx="6" fill="#d6a76c" transform="rotate(34 556 205)"/>`,
  );
}

/** Dua kursi & daun (ruang konseling). */
function calm(a: string, b: string, chair: string, leaf: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="400" cy="200" r="110" fill="#ffffff" opacity="0.4"/>` +
      `<rect x="130" y="320" width="200" height="110" rx="40" fill="${chair}"/><rect x="150" y="250" width="160" height="100" rx="36" fill="${chair}" opacity="0.85"/><rect x="150" y="430" width="14" height="60" fill="${chair}"/><rect x="296" y="430" width="14" height="60" fill="${chair}"/>` +
      `<rect x="470" y="320" width="200" height="110" rx="40" fill="${chair}"/><rect x="490" y="250" width="160" height="100" rx="36" fill="${chair}" opacity="0.85"/><rect x="490" y="430" width="14" height="60" fill="${chair}"/><rect x="636" y="430" width="14" height="60" fill="${chair}"/>` +
      `<rect x="375" y="400" width="50" height="90" rx="10" fill="#ffffff"/><path d="M400 400 Q360 330 380 280 Q410 330 400 400 Q440 330 430 270 Q400 320 400 400" fill="${leaf}"/>`,
  );
}

/** Rehal & mushaf. */
function quran(a: string, b: string, wood: string, cover: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      dots("#ffffff", 12) +
      `<path d="M220 300 L400 250 L580 300 L560 330 L400 290 L240 330Z" fill="${cover}"/><path d="M250 300 L400 262 L400 290 L250 325Z M550 300 L400 262 L400 290 L550 325Z" fill="#fffbeb"/>` +
      `<path d="M240 330 L560 480 M560 330 L240 480" stroke="${wood}" stroke-width="26" stroke-linecap="round"/><rect x="200" y="480" width="400" height="16" rx="8" fill="${wood}"/>` +
      `<path d="M300 290 L380 270 M300 305 L380 285 M420 270 L500 290 M420 285 L500 305" stroke="${cover}" stroke-width="4" opacity="0.5"/>` +
      `<circle cx="400" cy="140" r="40" fill="#ffffff" opacity="0.6"/>`,
  );
}

/** Jaringan saraf / chip AI. */
function neural(a: string, b: string, node: string, link: string): string {
  const pts: [number, number][] = [
    [160, 160], [160, 300], [160, 440], [330, 120], [330, 240], [330, 360], [330, 480], [500, 190], [500, 300], [500, 410], [650, 300],
  ];
  const edges: [number, number][] = [[0, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9], [6, 9], [7, 10], [8, 10], [9, 10], [1, 3], [2, 4]];
  return svg(
    800,
    600,
    bg(a, b) +
      edges.map(([i, j]) => `<line x1="${pts[i][0]}" y1="${pts[i][1]}" x2="${pts[j][0]}" y2="${pts[j][1]}" stroke="${link}" stroke-width="4" opacity="0.6"/>`).join("") +
      pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 10 ? 30 : 18}" fill="${node}"/>`).join("") +
      `<rect x="600" y="80" width="120" height="120" rx="18" fill="none" stroke="${node}" stroke-width="6"/><rect x="630" y="110" width="60" height="60" rx="8" fill="${node}"/>`,
  );
}

/** Penyelam, ikan, karang. */
function reef(a: string, b: string, coral: string, fish: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M0 520 Q200 470 400 510 T800 500 L800 600 L0 600Z" fill="#fde68a" opacity="0.7"/>` +
      `<path d="M120 520 L120 420 M120 460 L90 420 M120 450 L150 400 M600 520 L600 400 M600 450 L640 410 M600 470 L570 430" stroke="${coral}" stroke-width="18" stroke-linecap="round"/><circle cx="700" cy="500" r="40" fill="${coral}" opacity="0.8"/>` +
      `<path d="M300 200 Q360 160 420 200 Q360 240 300 200Z M420 200 L450 180 L450 220Z" fill="${fish}"/><circle cx="320" cy="196" r="5" fill="#0f172a"/>` +
      `<path d="M480 320 Q520 295 560 320 Q520 345 480 320Z M560 320 L580 305 L580 335Z" fill="${fish}" opacity="0.8"/>` +
      `<circle cx="230" cy="320" r="26" fill="#1e293b"/><rect x="210" y="306" width="40" height="20" rx="8" fill="#7dd3fc"/><path d="M250 330 L380 360 L420 350" stroke="#1e293b" stroke-width="24" stroke-linecap="round"/><path d="M420 350 L470 335 M420 350 L470 375" stroke="#f97316" stroke-width="12" stroke-linecap="round"/>` +
      `<circle cx="220" cy="260" r="8" fill="#ffffff" opacity="0.7"/><circle cx="210" cy="220" r="12" fill="#ffffff" opacity="0.6"/><circle cx="222" cy="170" r="16" fill="#ffffff" opacity="0.5"/>`,
  );
}

/** Mawar tato flash. */
function roseFlash(a: string, ink: string, red: string, green: string): string {
  return svg(
    800,
    600,
    `<rect width="800" height="600" fill="${a}"/>` +
      `<circle cx="400" cy="250" r="110" fill="${red}" stroke="${ink}" stroke-width="8"/><path d="M340 240 Q400 170 460 240 Q400 300 340 240Z M370 250 Q400 210 430 250" stroke="${ink}" stroke-width="7" fill="none"/>` +
      `<path d="M400 360 L400 520" stroke="${ink}" stroke-width="10"/><path d="M400 420 Q330 390 300 430 Q350 460 400 440Z M400 460 Q470 430 500 470 Q450 500 400 480Z" fill="${green}" stroke="${ink}" stroke-width="6"/>` +
      `<path d="M150 120 L170 160 L210 160 L178 186 L190 226 L150 202 L110 226 L122 186 L90 160 L130 160Z" fill="none" stroke="${ink}" stroke-width="6"/>` +
      `<path d="M600 430 Q640 380 680 430 Q640 480 600 430Z" fill="none" stroke="${ink}" stroke-width="6"/><circle cx="640" cy="430" r="10" fill="${ink}"/>`,
  );
}

/** Kamar kapsul. */
function capsule(a: string, b: string, pod: string, light: string): string {
  let s = "";
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < 3; c++) {
      const x = 110 + c * 200;
      const y = 140 + r * 200;
      s += `<rect x="${x}" y="${y}" width="180" height="170" rx="40" fill="${pod}"/><rect x="${x + 20}" y="${y + 20}" width="140" height="130" rx="30" fill="#0f172a" opacity="0.6"/><rect x="${x + 30}" y="${y + 110}" width="120" height="26" rx="10" fill="#ffffff" opacity="0.85"/><circle cx="${x + 140}" cy="${y + 45}" r="9" fill="${light}"/>`;
    }
  return svg(800, 600, bg(a, b) + s + `<rect x="80" y="540" width="640" height="14" rx="7" fill="${light}" opacity="0.6"/>`);
}

/** Aplikasi belajar di ponsel. */
function appUi(a: string, b: string, brand: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="290" y="60" width="220" height="460" rx="34" fill="#0f172a"/><rect x="304" y="84" width="192" height="412" rx="22" fill="#ffffff"/>` +
      `<rect x="320" y="110" width="160" height="80" rx="14" fill="${brand}"/><rect x="334" y="128" width="90" height="12" rx="6" fill="#ffffff"/><rect x="334" y="150" width="60" height="10" rx="5" fill="#ffffff" opacity="0.7"/>` +
      `<rect x="320" y="206" width="160" height="12" rx="6" fill="#e2e8f0"/><rect x="320" y="206" width="110" height="12" rx="6" fill="${accent}"/>` +
      `<rect x="320" y="236" width="75" height="75" rx="12" fill="${accent}" opacity="0.3"/><rect x="405" y="236" width="75" height="75" rx="12" fill="${brand}" opacity="0.25"/><rect x="320" y="321" width="160" height="60" rx="12" fill="#f1f5f9"/><rect x="320" y="395" width="160" height="40" rx="20" fill="${brand}"/>` +
      `<circle cx="180" cy="200" r="60" fill="${accent}" opacity="0.6"/><path d="M160 200 L175 215 L205 185" stroke="#ffffff" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<rect x="560" y="330" width="160" height="110" rx="20" fill="#ffffff"/><path d="M585 410 L615 380 L645 395 L695 350" stroke="${brand}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  );
}

/** Dokumen pajak & kalkulator. */
function taxDoc(a: string, b: string, ink: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="180" y="90" width="300" height="400" rx="14" fill="#ffffff"/><rect x="210" y="125" width="150" height="16" rx="8" fill="${ink}"/>` +
      [170, 200, 230, 260, 290, 320].map((y) => `<rect x="210" y="${y}" width="240" height="9" rx="4" fill="#cbd5e1"/>`).join("") +
      `<rect x="210" y="360" width="100" height="40" rx="8" fill="${accent}" opacity="0.25"/><path d="M220 440 Q260 410 300 440" stroke="${ink}" stroke-width="5" fill="none"/>` +
      `<rect x="470" y="230" width="170" height="250" rx="18" fill="${ink}"/><rect x="490" y="250" width="130" height="50" rx="8" fill="${accent}"/>` +
      [0, 1, 2].map((r) => [0, 1, 2].map((c) => `<rect x="${490 + c * 45}" y="${318 + r * 48}" width="36" height="36" rx="8" fill="#ffffff" opacity="0.85"/>`).join("")).join("") +
      `<circle cx="150" cy="480" r="40" fill="${accent}" opacity="0.5"/>`,
  );
}

/** Wajah/avatar sederhana. */
function face(bgc: string, skin: string, hair: string, shirt: string, hijab = false): string {
  const head = hijab
    ? `<path d="M210 260 Q210 120 300 120 Q390 120 390 260 L390 330 Q300 380 210 330Z" fill="${hair}"/><circle cx="300" cy="245" r="62" fill="${skin}"/>`
    : `<circle cx="300" cy="245" r="70" fill="${skin}"/><path d="M228 230 Q230 160 300 160 Q372 160 372 230 Q340 196 300 200 Q258 196 228 230Z" fill="${hair}"/>`;
  return svg(600, 600, `<rect width="600" height="600" fill="${bgc}"/><path d="M140 600 Q140 400 300 400 Q460 400 460 600Z" fill="${shirt}"/>${head}<circle cx="276" cy="250" r="6" fill="#1f2937"/><circle cx="324" cy="250" r="6" fill="#1f2937"/><path d="M280 285 Q300 300 320 285" stroke="#1f2937" stroke-width="5" fill="none" stroke-linecap="round"/>`);
}

/** Gelombang suara mentah vs bersih (sebelum–sesudah mixing). */
function waveform(a: string, line: string, clean: boolean): string {
  let d = "M40 300";
  for (let x = 60; x <= 760; x += 20) {
    const amp = clean ? 80 * Math.sin(x / 40) : 40 + ((x * 37) % 140);
    d += ` L${x} ${Math.round(300 + (x % 40 ? amp : -amp))}`;
  }
  return svg(800, 600, `<rect width="800" height="600" fill="${a}"/><line x1="40" y1="300" x2="760" y2="300" stroke="${line}" stroke-width="2" opacity="0.4"/><path d="${d}" stroke="${line}" stroke-width="5" fill="none" stroke-linejoin="round"/>`);
}

/** Ruangan polos vs didekorasi (sebelum–sesudah). */
function venue(a: string, floor: string, decorated: boolean, bloom: string): string {
  const deco = decorated
    ? `<path d="M120 120 Q400 220 680 120" stroke="${bloom}" stroke-width="10" fill="none"/>${[160, 260, 360, 460, 560, 640].map((x) => `<circle cx="${x}" cy="${150 + (x % 3) * 10}" r="18" fill="${bloom}"/>`).join("")}<rect x="300" y="300" width="200" height="140" rx="10" fill="#ffffff"/><path d="M300 300 Q400 240 500 300" fill="${bloom}" opacity="0.7"/><circle cx="220" cy="420" r="30" fill="${bloom}"/><circle cx="580" cy="420" r="30" fill="${bloom}"/>`
    : `<rect x="330" y="340" width="140" height="100" fill="#d4d4d8"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${a}"/><path d="M0 440 L800 440 L800 600 L0 600Z" fill="${floor}"/>${deco}`);
}

/** Desain tato sebelum (pudar) & sesudah (cover-up). */
function tattooArm(skin: string, ink: string, fresh: boolean, red: string): string {
  const art = fresh
    ? `<circle cx="400" cy="300" r="80" fill="${red}" stroke="${ink}" stroke-width="7"/><path d="M350 300 Q400 240 450 300 Q400 350 350 300Z" stroke="${ink}" stroke-width="6" fill="none"/><path d="M320 380 Q360 360 400 390 M480 380 Q440 360 400 390" stroke="${ink}" stroke-width="7" fill="none"/>`
    : `<path d="M340 260 L460 340 M350 340 L450 270" stroke="${ink}" stroke-width="10" opacity="0.35"/><circle cx="400" cy="300" r="40" fill="none" stroke="${ink}" stroke-width="6" opacity="0.3"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="#e7e5e4"/><path d="M180 600 Q200 140 400 120 Q600 140 620 600Z" fill="${skin}"/>${art}`);
}

/* ------------------------------ registry ---------------------------- */

export const V3C_SOURCES: Record<string, () => string> = {
  "v3c-bread": () => bread("#fff7ed", "#fde68a", "#b45309", "#fbbf24"),
  "v3c-bread-night": () => bread("#451a03", "#78350f", "#f59e0b", "#fde68a"),
  "v3c-cake": () => cake("#fdf2f8", "#fbcfe8", "#ffffff", "#be185d"),
  "v3c-cake-gold": () => cake("#fefce8", "#fde68a", "#fff7ed", "#b45309"),
  "v3c-pitch": () => pitch("#052e16", "#14532d", "#4ade80", "#111827"),
  "v3c-runner": () => runner("#ffe4e6", "#fecdd3", "#e11d48", "#1f2937"),
  "v3c-runner-dawn": () => runner("#fef3c7", "#fda4af", "#111827", "#475569"),
  "v3c-mosque": () => mosque("#ecfdf5", "#a7f3d0", "#047857", "#f59e0b"),
  "v3c-pattern": () => geometric("#064e3b", "#10b981", "#fbbf24"),
  "v3c-chapel": () => chapel("#ede9fe", "#c4b5fd", "#ffffff", "#6d28d9"),
  "v3c-mic": () => mic("#1e1b4b", "#4c1d95", "#e9d5ff", "#a78bfa"),
  "v3c-headphones": () => headphones("#042f2e", "#115e59", "#5eead4", "#f0fdfa"),
  "v3c-tee": () => tee("#18181b", "#3f3f46", "#fafafa", "#a3e635"),
  "v3c-tee-acid": () => tee("#d9f99d", "#a3e635", "#18181b", "#f43f5e"),
  "v3c-batik": () => batik("#fef3c7", "#78350f", "#b45309"),
  "v3c-batik-indigo": () => batik("#1e3a8a", "#e0e7ff", "#f59e0b"),
  "v3c-press": () => press("#e0f2fe", "#bae6fd"),
  "v3c-washer": () => washer("#ecfeff", "#a5f3fc", "#ffffff", "#0891b2"),
  "v3c-bouquet": () => bouquet("#fdf2f8", "#fce7f3", "#db2777", "#f9a8d4", "#15803d"),
  "v3c-bouquet-sun": () => bouquet("#fefce8", "#fef08a", "#f97316", "#facc15", "#166534"),
  "v3c-arch": () => arch("#fefce8", "#fef3c7", "#a16207", "#fda4af"),
  "v3c-gadget": () => gadget("#dbeafe", "#bfdbfe", "#1e293b", "#2563eb"),
  "v3c-gadget-dark": () => gadget("#0f172a", "#1e3a8a", "#e2e8f0", "#38bdf8"),
  "v3c-sketch": () => sketch("#fff7ed", "#fed7aa", "#ea580c", "#7c3aed"),
  "v3c-ramen": () => ramen("#1c1917", "#450a0a", "#dc2626", "#f59e0b"),
  "v3c-calm": () => calm("#f0fdfa", "#ccfbf1", "#0d9488", "#65a30d"),
  "v3c-quran": () => quran("#f0fdf4", "#bbf7d0", "#92400e", "#15803d"),
  "v3c-neural": () => neural("#1e1b4b", "#312e81", "#a5b4fc", "#818cf8"),
  "v3c-reef": () => reef("#0c4a6e", "#0369a1", "#fb7185", "#facc15"),
  "v3c-rose-flash": () => roseFlash("#fafaf9", "#171717", "#dc2626", "#16a34a"),
  "v3c-capsule": () => capsule("#fff7ed", "#fed7aa", "#c2410c", "#facc15"),
  "v3c-app": () => appUi("#f3e8ff", "#e9d5ff", "#9333ea", "#22c55e"),
  "v3c-tax": () => taxDoc("#eff6ff", "#dbeafe", "#1e3a8a", "#f59e0b"),
  "v3c-pitch-day": () => pitch("#ecfccb", "#bef264", "#ffffff", "#f97316"),
  "v3c-chapel-dusk": () => chapel("#312e81", "#6d28d9", "#f5f3ff", "#f59e0b"),
  "v3c-headphones-amber": () => headphones("#fffbeb", "#fde68a", "#0f766e", "#f59e0b"),
  "v3c-press-warm": () => press("#fff7ed", "#fed7aa"),
  "v3c-washer-mint": () => washer("#f0fdf4", "#bbf7d0", "#ffffff", "#10b981"),
  "v3c-reef-deep": () => reef("#082f49", "#164e63", "#f97316", "#a3e635"),
  "v3c-face-1": () => face("#fde68a", "#c68642", "#1f2937", "#0f766e"),
  "v3c-face-2": () => face("#bfdbfe", "#f1c27d", "#7c2d12", "#be185d", true),
  "v3c-face-3": () => face("#d9f99d", "#8d5524", "#111827", "#4338ca"),
  "v3c-face-4": () => face("#fbcfe8", "#ffdbac", "#334155", "#ea580c", true),
  "v3c-wave-raw": () => waveform("#134e4a", "#fca5a5", false),
  "v3c-wave-clean": () => waveform("#134e4a", "#5eead4", true),
  "v3c-venue-plain": () => venue("#f5f5f4", "#d6d3d1", false, "#fda4af"),
  "v3c-venue-bloom": () => venue("#fffbeb", "#e7d8c3", true, "#f472b6"),
  "v3c-tattoo-old": () => tattooArm("#d6a77a", "#1f2937", false, "#dc2626"),
  "v3c-tattoo-new": () => tattooArm("#d6a77a", "#111827", true, "#dc2626"),
};
