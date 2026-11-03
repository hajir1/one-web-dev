/* ================================================================== */
/* Ilustrasi SVG untuk template v3 bagian D                             */
/* (buatan sendiri, ASCII, tanpa URL eksternal; nama berawalan "v3d-").  */
/* Bentuk dasar menerima warna sehingga satu motif punya banyak varian.   */
/* ================================================================== */

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const lg = (id: string, a: string, b: string, v = true) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

const bg = (a: string, b: string, w = 800, h = 600) => lg("b", a, b) + `<rect width="${w}" height="${h}" fill="url(#b)"/>`;

/** Dot pattern (dekorasi). */
const dots = (x: number, y: number, c: string, n = 5) => {
  let s = "";
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += `<circle cx="${x + i * 18}" cy="${y + j * 18}" r="3" fill="${c}"/>`;
  return s;
};

/* ------------------------------ motif ------------------------------ */

/** Mangkuk + sendok di atas meja (kuliner). */
function bowl(a: string, b: string, dish: string, food: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="400" cy="320" r="210" fill="#ffffff" opacity="0.55"/>` +
      `<path d="M220 300 H580 Q570 440 400 460 Q230 440 220 300Z" fill="${dish}"/>` +
      `<ellipse cx="400" cy="300" rx="180" ry="34" fill="${food}"/>` +
      `<circle cx="340" cy="290" r="22" fill="#ffffff" opacity="0.7"/><circle cx="420" cy="284" r="16" fill="#16a34a"/><circle cx="460" cy="296" r="14" fill="#facc15"/>` +
      `<rect x="610" y="230" width="18" height="230" rx="9" fill="${dish}" opacity="0.8"/><ellipse cx="619" cy="220" rx="26" ry="38" fill="${dish}" opacity="0.8"/>` +
      `<path d="M340 230 Q320 190 345 160 M400 225 Q380 185 405 150 M460 230 Q440 190 465 160" stroke="${dish}" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.35"/>` +
      dots(80, 80, dish, 4),
  );
}

/** Rumah-rumah desa + sawah berundak. */
function village(a: string, b: string, roof: string, field: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="640" cy="120" r="56" fill="#fde68a"/>` +
      `<path d="M0 330 Q200 250 400 320 T800 300 V600 H0Z" fill="${field}" opacity="0.55"/>` +
      `<path d="M0 420 Q220 360 420 410 T800 400 V600 H0Z" fill="${field}"/>` +
      `<path d="M0 500 Q200 460 400 500 T800 490" stroke="#ffffff" stroke-width="4" fill="none" opacity="0.5"/>` +
      `<rect x="180" y="300" width="120" height="90" fill="#fff7ed"/><path d="M165 305 L240 240 L315 305Z" fill="${roof}"/><rect x="225" y="340" width="30" height="50" fill="${roof}" opacity="0.7"/>` +
      `<rect x="360" y="320" width="100" height="74" fill="#fff7ed"/><path d="M348 324 L410 270 L472 324Z" fill="${roof}"/>` +
      `<rect x="520" y="296" width="140" height="100" fill="#fff7ed"/><path d="M505 300 L590 226 L675 300Z" fill="${roof}"/><rect x="545" y="330" width="34" height="30" fill="${field}"/><rect x="600" y="330" width="34" height="30" fill="${field}"/>`,
  );
}

/** Gunung + danau (pariwisata). */
function lake(a: string, b: string, hill: string, water: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="560" cy="150" r="70" fill="#ffffff" opacity="0.7"/>` +
      `<path d="M0 380 L180 170 L300 300 L420 140 L620 380Z" fill="${hill}"/>` +
      `<path d="M380 380 L560 210 L800 380Z" fill="${hill}" opacity="0.7"/>` +
      `<path d="M150 210 L180 170 L210 205Z M395 170 L420 140 L448 172Z" fill="#ffffff"/>` +
      `<rect y="380" width="800" height="220" fill="${water}"/>` +
      `<path d="M80 440 H260 M420 470 H640 M200 520 H380 M520 550 H720" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.5"/>` +
      `<path d="M300 430 L360 430 L340 455 L320 455Z" fill="${hill}"/><path d="M330 430 V390 L355 425Z" fill="#ffffff"/>`,
  );
}

/** Perisai dengan centang (asuransi). */
function shield(a: string, b: string, main: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="400" cy="300" r="230" fill="${accent}" opacity="0.18"/>` +
      `<path d="M400 90 L580 160 V300 Q580 430 400 510 Q220 430 220 300 V160Z" fill="${main}"/>` +
      `<path d="M400 130 L545 185 V300 Q545 405 400 470Z" fill="#ffffff" opacity="0.14"/>` +
      `<path d="M320 300 L380 360 L490 240" stroke="#ffffff" stroke-width="30" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="140" cy="140" r="34" fill="${accent}"/><circle cx="660" cy="470" r="46" fill="${accent}" opacity="0.6"/>` +
      dots(620, 90, main, 4),
  );
}

/** Mobil samping (asuransi kendaraan). */
function car(a: string, b: string, body: string, glass: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect y="430" width="800" height="170" fill="#0f172a" opacity="0.12"/>` +
      `<path d="M120 400 Q120 330 190 320 L280 230 Q300 210 340 210 H500 Q540 210 565 240 L630 320 Q700 330 700 400 V420 H120Z" fill="${body}"/>` +
      `<path d="M300 245 H400 V315 H235Z M420 245 H520 Q535 245 545 258 L590 315 H420Z" fill="${glass}"/>` +
      `<circle cx="250" cy="420" r="55" fill="#1f2937"/><circle cx="250" cy="420" r="24" fill="#e5e7eb"/>` +
      `<circle cx="580" cy="420" r="55" fill="#1f2937"/><circle cx="580" cy="420" r="24" fill="#e5e7eb"/>` +
      `<rect x="670" y="350" width="30" height="18" rx="6" fill="#fde047"/><rect x="120" y="350" width="26" height="18" rx="6" fill="#f87171"/>`,
  );
}

/** Kamera film + papan klep. */
function camera(a: string, b: string, body: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="300" cy="170" r="80" fill="none" stroke="${body}" stroke-width="22"/><circle cx="470" cy="170" r="80" fill="none" stroke="${body}" stroke-width="22"/>` +
      `<circle cx="300" cy="170" r="16" fill="${accent}"/><circle cx="470" cy="170" r="16" fill="${accent}"/>` +
      `<rect x="200" y="260" width="360" height="200" rx="24" fill="${body}"/>` +
      `<path d="M560 310 L680 250 V470 L560 410Z" fill="${body}"/>` +
      `<circle cx="300" cy="360" r="40" fill="${accent}" opacity="0.85"/><rect x="380" y="300" width="140" height="20" rx="10" fill="${accent}" opacity="0.5"/>` +
      `<rect x="80" y="470" width="220" height="90" rx="10" fill="#f8fafc"/><path d="M80 470 L300 470 L290 440 L70 440Z" fill="#111827"/>` +
      `<path d="M100 440 L120 470 M150 440 L170 470 M200 440 L220 470 M250 440 L270 470" stroke="#f8fafc" stroke-width="10"/>`,
  );
}

/** Layar bioskop + kursi (festival). */
function cinema(a: string, b: string, screen: string, seat: string): string {
  let seats = "";
  for (let r = 0; r < 3; r++) for (let i = 0; i < 9; i++) seats += `<rect x="${110 + i * 66 + (r % 2) * 20}" y="${400 + r * 56}" width="50" height="40" rx="10" fill="${seat}" opacity="${0.6 + r * 0.15}"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M120 80 Q400 50 680 80 L660 330 Q400 300 140 330Z" fill="${screen}"/>` +
      `<path d="M300 150 L470 200 L300 250Z" fill="#ffffff" opacity="0.8"/>` +
      `<path d="M60 40 V360 M740 40 V360" stroke="${seat}" stroke-width="40"/>` +
      seats,
  );
}

/** Cincin & kalung (perhiasan). */
function ring(a: string, b: string, metal: string, gem: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M150 80 Q400 420 650 80" stroke="${metal}" stroke-width="6" fill="none"/>` +
      `<path d="M380 330 L400 300 L420 330 L400 370Z" fill="${gem}"/>` +
      `<circle cx="400" cy="420" r="110" fill="none" stroke="${metal}" stroke-width="26"/>` +
      `<circle cx="400" cy="420" r="110" fill="none" stroke="#ffffff" stroke-width="6" opacity="0.4" stroke-dasharray="60 300"/>` +
      `<path d="M360 300 L400 250 L440 300 L400 330Z" fill="${gem}" opacity="0.9"/><path d="M360 300 H440" stroke="#ffffff" stroke-width="4" opacity="0.7"/>` +
      `<path d="M610 170 l10 -26 l10 26 l26 10 l-26 10 l-10 26 l-10 -26 l-26 -10Z M170 470 l8 -20 l8 20 l20 8 l-20 8 l-8 20 l-8 -20 l-20 -8Z" fill="${metal}" opacity="0.7"/>`,
  );
}

/** Untaian manik (handmade). */
function beads(a: string, b: string, c1: string, c2: string, c3: string): string {
  let s = "";
  for (let i = 0; i < 14; i++) {
    const t = (i / 13) * Math.PI;
    const x = Math.round(400 - Math.cos(t) * 260);
    const y = Math.round(150 + Math.sin(t) * 300);
    s += `<circle cx="${x}" cy="${y}" r="${i % 3 === 1 ? 26 : 18}" fill="${[c1, c2, c3][i % 3]}"/>`;
  }
  return svg(800, 600, bg(a, b) + `<path d="M140 150 Q400 820 660 150" stroke="#78716c" stroke-width="3" fill="none" opacity="0.5"/>` + s + `<circle cx="400" cy="160" r="46" fill="#ffffff" opacity="0.5"/>`);
}

/** Wajah/avatar sederhana. */
function face(bgc: string, skin: string, hair: string, shirt: string, long = false): string {
  return svg(
    400,
    400,
    `<rect width="400" height="400" fill="${bgc}"/>` +
      (long ? `<path d="M120 200 Q110 90 200 80 Q290 90 280 200 V300 H120Z" fill="${hair}"/>` : "") +
      `<path d="M70 400 Q80 300 200 290 Q320 300 330 400Z" fill="${shirt}"/>` +
      `<rect x="178" y="240" width="44" height="60" rx="18" fill="${skin}"/>` +
      `<circle cx="200" cy="185" r="78" fill="${skin}"/>` +
      (long ? `<path d="M124 170 Q140 100 200 100 Q262 100 276 170 Q240 130 200 135 Q160 130 124 170Z" fill="${hair}"/>` : `<path d="M122 175 Q120 100 200 98 Q282 100 278 175 Q260 128 200 132 Q140 128 122 175Z" fill="${hair}"/>`) +
      `<circle cx="172" cy="190" r="7" fill="#1f2937"/><circle cx="228" cy="190" r="7" fill="#1f2937"/>` +
      `<path d="M176 222 Q200 240 224 222" stroke="#1f2937" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  );
}

/** Koper kerja + kartu kandidat (rekrutmen). */
function briefcase(a: string, b: string, main: string, card: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="150" y="230" width="360" height="250" rx="28" fill="${main}"/>` +
      `<path d="M270 230 V190 Q270 170 290 170 H370 Q390 170 390 190 V230" stroke="${main}" stroke-width="20" fill="none"/>` +
      `<rect x="150" y="320" width="360" height="20" fill="#000000" opacity="0.15"/><rect x="310" y="306" width="40" height="46" rx="8" fill="${card}"/>` +
      `<rect x="470" y="120" width="230" height="300" rx="22" fill="${card}"/>` +
      `<circle cx="585" cy="200" r="44" fill="${main}" opacity="0.3"/>` +
      `<rect x="515" y="270" width="140" height="14" rx="7" fill="${main}"/><rect x="530" y="300" width="110" height="10" rx="5" fill="${main}" opacity="0.4"/>` +
      `<rect x="530" y="322" width="110" height="10" rx="5" fill="${main}" opacity="0.4"/><rect x="540" y="356" width="90" height="30" rx="15" fill="${main}"/>`,
  );
}

/** Rak buku. */
function books(a: string, b: string, c1: string, c2: string, c3: string): string {
  const cs = [c1, c2, c3];
  let s = "";
  let x = 120;
  for (let i = 0; i < 11; i++) {
    const w = 34 + ((i * 7) % 20);
    const h = 170 + ((i * 37) % 70);
    s += `<rect x="${x}" y="${420 - h}" width="${w}" height="${h}" rx="4" fill="${cs[i % 3]}"/><rect x="${x + 6}" y="${440 - h}" width="${w - 12}" height="6" fill="#ffffff" opacity="0.5"/>`;
    x += w + 6;
  }
  return svg(800, 600, bg(a, b) + s + `<rect x="90" y="420" width="620" height="22" rx="6" fill="#78350f"/><rect x="110" y="442" width="20" height="90" fill="#78350f"/><rect x="670" y="442" width="20" height="90" fill="#78350f"/>`);
}

/** Buku terbuka + pena (penerbit). */
function openBook(a: string, b: string, cover: string, ink: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M120 170 Q260 130 400 190 V470 Q260 410 120 450Z" fill="#ffffff"/><path d="M680 170 Q540 130 400 190 V470 Q540 410 680 450Z" fill="#f8fafc"/>` +
      `<path d="M110 460 Q260 420 400 480 Q540 420 690 460 V480 Q540 445 400 500 Q260 445 110 480Z" fill="${cover}"/>` +
      `<path d="M160 220 Q260 195 360 230 M160 260 Q260 235 360 270 M160 300 Q260 275 360 310 M440 230 Q540 195 640 220 M440 270 Q540 235 640 260" stroke="${ink}" stroke-width="6" fill="none" opacity="0.35"/>` +
      `<path d="M600 80 L640 100 L520 380 L490 390 L492 360Z" fill="${cover}"/><path d="M490 390 L492 360 L505 372Z" fill="${ink}"/>`,
  );
}

/** Panel surya + matahari. */
function solar(a: string, b: string, panel: string, sun: string): string {
  let grid = "";
  for (let i = 1; i < 4; i++) grid += `<path d="M${180 + i * 110} 300 L${150 + i * 120} 470" stroke="#ffffff" stroke-width="3" opacity="0.6"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="620" cy="140" r="70" fill="${sun}"/><path d="M620 40 V20 M620 260 V240 M520 140 H500 M740 140 H720 M550 70 L536 56 M690 210 L704 224 M690 70 L704 56 M550 210 L536 224" stroke="${sun}" stroke-width="10" stroke-linecap="round"/>` +
      `<path d="M180 300 H620 L650 470 H150Z" fill="${panel}"/>` +
      grid +
      `<path d="M165 385 H635" stroke="#ffffff" stroke-width="3" opacity="0.6"/>` +
      `<rect x="380" y="470" width="40" height="80" fill="#64748b"/><rect x="300" y="545" width="200" height="16" rx="8" fill="#64748b"/>`,
  );
}

/** Stasiun pengisian kendaraan listrik. */
function charger(a: string, b: string, main: string, glow: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="250" y="110" width="200" height="380" rx="30" fill="${main}"/>` +
      `<rect x="280" y="150" width="140" height="100" rx="14" fill="#0f172a"/><path d="M355 165 L320 210 H350 L340 240 L380 190 H350Z" fill="${glow}"/>` +
      `<path d="M450 300 Q560 300 560 380 V440" stroke="#1f2937" stroke-width="18" fill="none"/><rect x="535" y="430" width="50" height="60" rx="12" fill="#1f2937"/>` +
      `<rect x="220" y="490" width="260" height="24" rx="12" fill="#334155"/>` +
      `<circle cx="350" cy="320" r="40" fill="none" stroke="${glow}" stroke-width="10"/>` +
      `<path d="M620 120 L650 170 M680 110 L690 160 M580 150 L620 190" stroke="${glow}" stroke-width="8" stroke-linecap="round" opacity="0.7"/>`,
  );
}

/** Labu kimia + molekul. */
function flask(a: string, b: string, glass: string, liquid: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M330 100 H430 V250 L540 460 Q550 500 510 500 H250 Q210 500 220 460 L330 250Z" fill="${glass}" opacity="0.9"/>` +
      `<path d="M285 360 H475 L535 470 Q540 490 515 490 H245 Q220 490 225 470Z" fill="${liquid}"/>` +
      `<circle cx="330" cy="430" r="14" fill="#ffffff" opacity="0.6"/><circle cx="410" cy="400" r="9" fill="#ffffff" opacity="0.6"/>` +
      `<rect x="315" y="86" width="130" height="22" rx="8" fill="${liquid}"/>` +
      `<circle cx="620" cy="160" r="22" fill="${liquid}"/><circle cx="690" cy="230" r="16" fill="${liquid}" opacity="0.7"/><circle cx="600" cy="270" r="18" fill="${liquid}" opacity="0.8"/>` +
      `<path d="M620 160 L690 230 L600 270 Z" stroke="${liquid}" stroke-width="5" fill="none"/>`,
  );
}

/** Planet + roket (museum sains). */
function planet(a: string, b: string, body: string, ringc: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<circle cx="120" cy="90" r="4" fill="#ffffff"/><circle cx="700" cy="70" r="3" fill="#ffffff"/><circle cx="640" cy="520" r="4" fill="#ffffff"/><circle cx="90" cy="460" r="3" fill="#ffffff"/>` +
      `<circle cx="360" cy="320" r="150" fill="${body}"/>` +
      `<path d="M200 330 Q360 270 520 300" stroke="#ffffff" stroke-width="10" opacity="0.2" fill="none"/>` +
      `<ellipse cx="360" cy="330" rx="260" ry="50" fill="none" stroke="${ringc}" stroke-width="16" transform="rotate(-14 360 330)"/>` +
      `<path d="M610 250 Q640 170 690 140 Q700 200 660 270Z" fill="#f8fafc"/><circle cx="660" cy="200" r="12" fill="${ringc}"/><path d="M620 260 L600 300 L640 280Z" fill="#f97316"/>`,
  );
}

/** Kaos + mug (merchandise). */
function merch(a: string, b: string, shirt: string, print: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M190 140 L280 100 Q330 140 380 100 L470 140 L520 230 L450 260 V500 H210 V260 L140 230Z" fill="${shirt}"/>` +
      `<circle cx="330" cy="290" r="62" fill="${print}"/><path d="M300 290 L325 315 L365 265" stroke="#ffffff" stroke-width="12" fill="none" stroke-linecap="round"/>` +
      `<rect x="540" y="300" width="140" height="170" rx="16" fill="#ffffff"/><path d="M680 340 Q730 340 730 385 Q730 430 680 430" stroke="#ffffff" stroke-width="18" fill="none"/>` +
      `<rect x="565" y="350" width="90" height="60" rx="10" fill="${print}"/>`,
  );
}

/** Mesin cuci (laundry). */
function washer(a: string, b: string, body: string, water: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="240" y="100" width="320" height="400" rx="30" fill="${body}"/>` +
      `<rect x="240" y="100" width="320" height="70" rx="30" fill="#ffffff" opacity="0.4"/><circle cx="290" cy="135" r="12" fill="${water}"/><rect x="420" y="126" width="100" height="18" rx="9" fill="${water}" opacity="0.6"/>` +
      `<circle cx="400" cy="330" r="120" fill="#e2e8f0"/><circle cx="400" cy="330" r="96" fill="${water}"/>` +
      `<path d="M310 340 Q355 300 400 340 T490 340 V400 Q440 430 400 430 Q350 430 310 400Z" fill="#ffffff" opacity="0.35"/>` +
      `<circle cx="140" cy="200" r="26" fill="#ffffff" opacity="0.6"/><circle cx="660" cy="170" r="18" fill="#ffffff" opacity="0.6"/><circle cx="640" cy="420" r="30" fill="#ffffff" opacity="0.5"/>`,
  );
}

/** Dasbor aplikasi (SaaS). */
function dashboard(a: string, b: string, main: string, accent: string): string {
  let bars = "";
  [120, 180, 90, 210, 160, 240, 200].forEach((h, i) => (bars += `<rect x="${370 + i * 42}" y="${440 - h}" width="26" height="${h}" rx="6" fill="${i === 5 ? accent : main}" opacity="${i === 5 ? 1 : 0.35}"/>`));
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="80" y="80" width="640" height="440" rx="24" fill="#ffffff"/>` +
      `<rect x="80" y="80" width="180" height="440" rx="24" fill="${main}"/><rect x="236" y="80" width="24" height="440" fill="${main}"/>` +
      `<rect x="110" y="120" width="110" height="14" rx="7" fill="#ffffff" opacity="0.8"/><rect x="110" y="170" width="90" height="10" rx="5" fill="#ffffff" opacity="0.4"/><rect x="110" y="200" width="100" height="10" rx="5" fill="#ffffff" opacity="0.4"/><rect x="110" y="230" width="80" height="10" rx="5" fill="#ffffff" opacity="0.4"/>` +
      `<rect x="300" y="120" width="120" height="70" rx="12" fill="${accent}" opacity="0.15"/><rect x="440" y="120" width="120" height="70" rx="12" fill="${main}" opacity="0.12"/><rect x="580" y="120" width="110" height="70" rx="12" fill="${main}" opacity="0.12"/>` +
      `<circle cx="320" cy="300" r="34" fill="none" stroke="${accent}" stroke-width="14" stroke-dasharray="150 220"/>` +
      bars,
  );
}

/** Koin bertumpuk + celengan (koperasi). */
function coins(a: string, b: string, coin: string, pig: string): string {
  let s = "";
  for (let i = 0; i < 6; i++) s += `<ellipse cx="200" cy="${460 - i * 30}" rx="80" ry="22" fill="${coin}" stroke="#ffffff" stroke-width="3"/>`;
  for (let i = 0; i < 4; i++) s += `<ellipse cx="330" cy="${470 - i * 30}" rx="66" ry="18" fill="${coin}" stroke="#ffffff" stroke-width="3" opacity="0.85"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      s +
      `<ellipse cx="560" cy="360" rx="150" ry="120" fill="${pig}"/><circle cx="680" cy="330" r="40" fill="${pig}"/><ellipse cx="712" cy="335" rx="16" ry="20" fill="#ffffff" opacity="0.4"/>` +
      `<rect x="470" y="450" width="34" height="60" rx="10" fill="${pig}"/><rect x="590" y="450" width="34" height="60" rx="10" fill="${pig}"/>` +
      `<rect x="520" y="240" width="80" height="14" rx="7" fill="#1f2937" opacity="0.5"/><circle cx="640" cy="320" r="8" fill="#1f2937"/>` +
      `<circle cx="560" cy="160" r="40" fill="${coin}"/><text x="560" y="175" font-size="40" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-weight="700">$</text>`,
  );
}

/** Menara apartemen. */
function tower(a: string, b: string, main: string, win: string): string {
  let w = "";
  for (let r = 0; r < 9; r++) for (let c = 0; c < 4; c++) w += `<rect x="${300 + c * 52}" y="${110 + r * 44}" width="34" height="26" rx="4" fill="${win}" opacity="${(r + c) % 3 === 0 ? 1 : 0.55}"/>`;
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="120" y="260" width="140" height="300" fill="${main}" opacity="0.5"/><rect x="560" y="200" width="150" height="360" fill="${main}" opacity="0.6"/>` +
      `<rect x="280" y="80" width="240" height="480" fill="${main}"/>` +
      w +
      `<rect y="540" width="800" height="60" fill="#0f172a" opacity="0.3"/><circle cx="160" cy="520" r="34" fill="#16a34a"/><circle cx="660" cy="520" r="40" fill="#16a34a"/>`,
  );
}

/** Pemutar piringan (DJ). */
function turntable(a: string, b: string, deck: string, neon: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<rect x="90" y="130" width="620" height="360" rx="30" fill="${deck}"/>` +
      `<circle cx="300" cy="310" r="140" fill="#020617"/><circle cx="300" cy="310" r="100" fill="none" stroke="${neon}" stroke-width="3" opacity="0.6"/><circle cx="300" cy="310" r="70" fill="none" stroke="${neon}" stroke-width="2" opacity="0.4"/><circle cx="300" cy="310" r="30" fill="${neon}"/>` +
      `<path d="M560 170 L520 330 L460 360" stroke="#e2e8f0" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<rect x="560" y="380" width="110" height="20" rx="10" fill="${neon}" opacity="0.8"/><circle cx="600" cy="440" r="16" fill="${neon}"/><circle cx="650" cy="440" r="16" fill="#e2e8f0" opacity="0.4"/>` +
      `<path d="M60 560 Q200 520 300 560 T540 560 T780 560" stroke="${neon}" stroke-width="5" fill="none" opacity="0.6"/>`,
  );
}

/** Pohon + daun (lingkungan). */
function tree(a: string, b: string, leaf: string, ground: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M0 470 Q400 420 800 470 V600 H0Z" fill="${ground}"/>` +
      `<rect x="380" y="300" width="40" height="190" rx="12" fill="#78350f"/>` +
      `<circle cx="400" cy="230" r="120" fill="${leaf}"/><circle cx="310" cy="290" r="80" fill="${leaf}" opacity="0.85"/><circle cx="490" cy="290" r="80" fill="${leaf}" opacity="0.85"/>` +
      `<path d="M150 420 Q170 360 230 350 Q220 410 150 420Z M640 400 Q620 340 560 330 Q570 390 640 400Z" fill="${leaf}"/>` +
      `<circle cx="640" cy="110" r="44" fill="#fde68a"/>`,
  );
}

/** Kaca pembesar + grafik naik (SEO). */
function seo(a: string, b: string, main: string, accent: string): string {
  return svg(
    800,
    600,
    bg(a, b) +
      `<path d="M100 470 L250 380 L360 420 L520 250 L680 170" stroke="${main}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M640 160 L690 165 L680 215" stroke="${main}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<circle cx="330" cy="240" r="110" fill="#ffffff" opacity="0.85" stroke="${accent}" stroke-width="22"/>` +
      `<path d="M410 320 L520 430" stroke="${accent}" stroke-width="36" stroke-linecap="round"/>` +
      `<rect x="270" y="210" width="120" height="14" rx="7" fill="${main}"/><rect x="270" y="240" width="90" height="12" rx="6" fill="${main}" opacity="0.4"/><rect x="270" y="265" width="100" height="12" rx="6" fill="${main}" opacity="0.4"/>`,
  );
}

/** Peta sederhana dengan penanda. */
function map(a: string, road: string, pin: string): string {
  return svg(
    800,
    600,
    `<rect width="800" height="600" fill="${a}"/>` +
      `<path d="M0 200 Q300 150 800 260 M120 0 Q200 300 140 600 M500 0 Q450 300 620 600 M0 450 Q400 400 800 470" stroke="${road}" stroke-width="22" fill="none"/>` +
      `<rect x="230" y="270" width="140" height="90" rx="10" fill="${road}" opacity="0.4"/><rect x="560" y="120" width="140" height="90" rx="10" fill="${road}" opacity="0.4"/>` +
      `<path d="M400 120 Q340 120 340 180 Q340 230 400 300 Q460 230 460 180 Q460 120 400 120Z" fill="${pin}"/><circle cx="400" cy="180" r="22" fill="#ffffff"/>`,
  );
}

/** Kaos sebelum/sesudah sablon, ruangan kosong/terisi, dll. dipakai sebagai pasangan before-after. */
function roomPlain(a: string, floor: string): string {
  return svg(800, 450, `<rect width="800" height="450" fill="${a}"/><rect y="320" width="800" height="130" fill="${floor}"/><rect x="520" y="90" width="160" height="150" fill="#ffffff" opacity="0.5"/>`);
}

function roomFull(a: string, floor: string, sofa: string, art: string): string {
  return svg(
    800,
    450,
    `<rect width="800" height="450" fill="${a}"/><rect y="320" width="800" height="130" fill="${floor}"/><rect x="520" y="90" width="160" height="150" fill="#ffffff" opacity="0.8"/>` +
      `<rect x="120" y="230" width="320" height="110" rx="24" fill="${sofa}"/><rect x="100" y="250" width="50" height="100" rx="20" fill="${sofa}"/><rect x="410" y="250" width="50" height="100" rx="20" fill="${sofa}"/>` +
      `<rect x="180" y="100" width="200" height="100" rx="6" fill="${art}"/><circle cx="600" cy="300" r="40" fill="#16a34a"/><rect x="590" y="330" width="20" height="40" fill="#78350f"/>`,
  );
}

/* ------------------------------ daftar ----------------------------- */

export const V3D_SOURCES: Record<string, () => string> = {
  "v3d-food-hero": () => bowl("#ffedd5", "#fed7aa", "#c2410c", "#fbbf24"),
  "v3d-food-green": () => bowl("#ecfccb", "#d9f99d", "#4d7c0f", "#f97316"),
  "v3d-food-plum": () => bowl("#fce7f3", "#fbcfe8", "#9d174d", "#fde047"),
  "v3d-village": () => village("#dcfce7", "#f0fdf4", "#b45309", "#16a34a"),
  "v3d-village-dusk": () => village("#fed7aa", "#fef3c7", "#7c2d12", "#65a30d"),
  "v3d-lake": () => lake("#cffafe", "#ecfeff", "#0e7490", "#06b6d4"),
  "v3d-lake-dusk": () => lake("#fbcfe8", "#fde68a", "#6d28d9", "#7c3aed"),
  "v3d-shield": () => shield("#dbeafe", "#eff6ff", "#1d4ed8", "#60a5fa"),
  "v3d-shield-orange": () => shield("#ffedd5", "#fff7ed", "#ea580c", "#fdba74"),
  "v3d-car": () => car("#fff7ed", "#ffedd5", "#ea580c", "#1e293b"),
  "v3d-car-blue": () => car("#e0f2fe", "#f0f9ff", "#1d4ed8", "#0f172a"),
  "v3d-camera": () => camera("#111827", "#1f2937", "#e5e7eb", "#ef4444"),
  "v3d-camera-light": () => camera("#f5f5f4", "#e7e5e4", "#1c1917", "#f59e0b"),
  "v3d-cinema": () => cinema("#450a0a", "#7f1d1d", "#fef2f2", "#b91c1c"),
  "v3d-cinema-gold": () => cinema("#1c1917", "#292524", "#fef3c7", "#a16207"),
  "v3d-ring": () => ring("#fefce8", "#fef3c7", "#a16207", "#0ea5e9"),
  "v3d-ring-dark": () => ring("#1c1917", "#292524", "#eab308", "#f43f5e"),
  "v3d-beads": () => beads("#fdf2f8", "#fce7f3", "#9d174d", "#94a3b8", "#f472b6"),
  "v3d-beads-teal": () => beads("#f0fdfa", "#ccfbf1", "#0f766e", "#cbd5e1", "#f59e0b"),
  "v3d-face-1": () => face("#e0e7ff", "#c68642", "#1f2937", "#4338ca"),
  "v3d-face-2": () => face("#fce7f3", "#e0ac69", "#3f1d0b", "#be185d", true),
  "v3d-face-3": () => face("#dcfce7", "#8d5524", "#111827", "#15803d"),
  "v3d-face-4": () => face("#fef3c7", "#f1c27d", "#78350f", "#b45309", true),
  "v3d-face-5": () => face("#e0f2fe", "#a16e4b", "#0f172a", "#0369a1"),
  "v3d-face-6": () => face("#f3e8ff", "#d4a373", "#27272a", "#7e22ce", true),
  "v3d-briefcase": () => briefcase("#ccfbf1", "#f0fdfa", "#0f766e", "#ffffff"),
  "v3d-briefcase-indigo": () => briefcase("#e0e7ff", "#eef2ff", "#4338ca", "#ffffff"),
  "v3d-books": () => books("#fef3c7", "#fffbeb", "#7c2d12", "#b45309", "#166534"),
  "v3d-books-rose": () => books("#ffe4e6", "#fff1f2", "#be123c", "#1e3a8a", "#f59e0b"),
  "v3d-openbook": () => openBook("#ffe4e6", "#fff1f2", "#be123c", "#1f2937"),
  "v3d-openbook-sepia": () => openBook("#fef3c7", "#fffbeb", "#7c2d12", "#292524"),
  "v3d-solar": () => solar("#fef9c3", "#fefce8", "#1e3a8a", "#f59e0b"),
  "v3d-solar-roof": () => solar("#e0f2fe", "#fef9c3", "#0f172a", "#ca8a04"),
  "v3d-charger": () => charger("#022c22", "#064e3b", "#10b981", "#a7f3d0"),
  "v3d-charger-light": () => charger("#ecfdf5", "#d1fae5", "#059669", "#fde047"),
  "v3d-flask": () => flask("#e0f2fe", "#f0f9ff", "#bae6fd", "#0369a1"),
  "v3d-flask-violet": () => flask("#ede9fe", "#f5f3ff", "#ddd6fe", "#7c3aed"),
  "v3d-planet": () => planet("#1e1b4b", "#3b0764", "#a855f7", "#fbbf24"),
  "v3d-planet-teal": () => planet("#042f2e", "#134e4a", "#14b8a6", "#f472b6"),
  "v3d-merch": () => merch("#ffe4e6", "#fff1f2", "#111827", "#e11d48"),
  "v3d-merch-yellow": () => merch("#fef9c3", "#fefce8", "#e11d48", "#111827"),
  "v3d-shirt-plain": () => merch("#f1f5f9", "#f8fafc", "#e2e8f0", "#cbd5e1"),
  "v3d-washer": () => washer("#dbeafe", "#eff6ff", "#ffffff", "#3b82f6"),
  "v3d-washer-mint": () => washer("#ccfbf1", "#f0fdfa", "#ffffff", "#14b8a6"),
  "v3d-dashboard": () => dashboard("#e0e7ff", "#eef2ff", "#4f46e5", "#f59e0b"),
  "v3d-dashboard-dark": () => dashboard("#1e1b4b", "#312e81", "#6366f1", "#22d3ee"),
  "v3d-coins": () => coins("#dcfce7", "#f0fdf4", "#ca8a04", "#15803d"),
  "v3d-tower": () => tower("#e2e8f0", "#f8fafc", "#334155", "#fde68a"),
  "v3d-tower-night": () => tower("#0f172a", "#1e293b", "#475569", "#fbbf24"),
  "v3d-turntable": () => turntable("#0a0a0a", "#2e1065", "#18181b", "#d946ef"),
  "v3d-turntable-cyan": () => turntable("#020617", "#0c4a6e", "#111827", "#22d3ee"),
  "v3d-tree": () => tree("#ecfccb", "#f7fee7", "#65a30d", "#3f6212"),
  "v3d-tree-autumn": () => tree("#fef3c7", "#fffbeb", "#d97706", "#65a30d"),
  "v3d-seo": () => seo("#fef3c7", "#fffbeb", "#1f2937", "#f59e0b"),
  "v3d-seo-dark": () => seo("#1f2937", "#111827", "#fbbf24", "#f59e0b"),
  "v3d-map": () => map("#ecfdf5", "#ffffff", "#15803d"),
  "v3d-map-blue": () => map("#eff6ff", "#ffffff", "#1d4ed8"),
  "v3d-room-plain": () => roomPlain("#f1f5f9", "#cbd5e1"),
  "v3d-room-full": () => roomFull("#f1f5f9", "#cbd5e1", "#334155", "#f59e0b"),
  "v3d-roof-plain": () => solar("#e2e8f0", "#f1f5f9", "#94a3b8", "#e2e8f0"),
  "v3d-car-dent": () => car("#e5e7eb", "#f3f4f6", "#9ca3af", "#475569"),
};
