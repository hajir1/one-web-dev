/* ================================================================== */
/* Ilustrasi SVG tambahan untuk template v2 bagian B (nama unik         */
/* berawalan "v2b-"). Buatan sendiri, ASCII, tanpa URL eksternal. Setiap */
/* bentuk menerima warna sehingga satu adegan bisa dipakai ulang.        */
/* ================================================================== */

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const lg = (id: string, a: string, b: string) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

/** Potret (tim, profil, testimoni). */
function face(bg: string, skin: string, hair: string, shirt: string, long = false): string {
  const hairShape = long
    ? `<path d="M110 200 Q100 70 200 70 Q300 70 290 200 L300 300 L250 260 Q200 150 150 260 L100 300Z" fill="${hair}"/>`
    : `<path d="M122 160 Q130 76 200 76 Q270 76 278 160 Q250 116 200 118 Q150 116 122 160Z" fill="${hair}"/>`;
  return svg(400, 400, `<rect width="400" height="400" fill="${bg}"/>${long ? hairShape : ""}<circle cx="200" cy="172" r="76" fill="${skin}"/>${long ? `<path d="M126 150 Q150 90 200 92 Q250 90 274 150 Q230 118 200 120 Q170 118 126 150Z" fill="${hair}"/>` : hairShape}<path d="M64 400 Q76 276 200 268 Q324 276 336 400Z" fill="${shirt}"/>`);
}

/** Pose yoga di atas matras. */
function yoga(bg: string, mat: string, body: string, sun: string): string {
  return svg(800, 600, `${lg("y", bg, "#ffffff")}<rect width="800" height="600" fill="url(#y)"/><circle cx="620" cy="140" r="80" fill="${sun}" opacity="0.6"/><rect x="170" y="470" width="460" height="22" rx="11" fill="${mat}"/><circle cx="400" cy="210" r="34" fill="${body}"/><path d="M400 246 L400 360 M400 270 L300 200 M400 270 L500 200 M400 360 L320 468 M400 360 L480 468" stroke="${body}" stroke-width="26" stroke-linecap="round" fill="none"/>`);
}

/** Kursi barber + tiang barber. */
function barber(bg: string, seat: string, pole: string): string {
  let stripes = "";
  for (let y = 120; y < 420; y += 40) stripes += `<path d="M110 ${y} L150 ${y + 30} L150 ${y + 50} L110 ${y + 20}Z" fill="${pole}"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="0" y="470" width="800" height="130" fill="#00000033"/><rect x="104" y="100" width="52" height="340" rx="26" fill="#ffffff"/>${stripes}<rect x="96" y="84" width="68" height="24" rx="12" fill="#e5e7eb"/><rect x="330" y="200" width="220" height="190" rx="30" fill="${seat}"/><rect x="300" y="360" width="280" height="50" rx="20" fill="${seat}"/><rect x="430" y="410" width="20" height="90" fill="#9ca3af"/><ellipse cx="440" cy="505" rx="90" ry="14" fill="#6b7280"/><rect x="620" y="150" width="120" height="180" rx="16" fill="#ffffff22" stroke="#ffffff55" stroke-width="4"/>`);
}

/** Mobil tampak samping. */
function car(bg: string, body: string, glass: string, floor = "#e5e7eb"): string {
  return svg(800, 500, `<rect width="800" height="500" fill="${bg}"/><rect x="0" y="380" width="800" height="120" fill="${floor}"/><path d="M110 330 Q120 260 200 250 L290 190 Q330 170 400 170 L520 170 Q570 172 610 220 L660 250 Q700 260 700 300 L700 340 Q700 352 688 352 L120 352 Q108 352 110 330Z" fill="${body}"/><path d="M305 200 Q335 186 395 186 L400 246 L250 250Z M420 186 L515 186 Q555 188 585 240 L425 246Z" fill="${glass}"/><circle cx="240" cy="352" r="50" fill="#111827"/><circle cx="240" cy="352" r="22" fill="#9ca3af"/><circle cx="580" cy="352" r="50" fill="#111827"/><circle cx="580" cy="352" r="22" fill="#9ca3af"/><rect x="660" y="282" width="34" height="14" rx="7" fill="#fde68a"/>`);
}

/** Grafik keuangan / dasbor. */
function chart(bg: string, card: string, bar: string, line: string): string {
  const bars = [140, 200, 170, 250, 220, 300].map((h, i) => `<rect x="${170 + i * 80}" y="${460 - h}" width="44" height="${h}" rx="8" fill="${bar}" opacity="${0.5 + i * 0.08}"/>`).join("");
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="120" y="90" width="560" height="420" rx="24" fill="${card}"/><rect x="160" y="124" width="180" height="16" rx="8" fill="${line}"/>${bars}<path d="M190 330 L270 290 L350 310 L430 230 L510 250 L590 170" stroke="${line}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="590" cy="170" r="12" fill="${line}"/>`);
}

/** Tangan & hati (yayasan). */
function heart(bg: string, c: string, d: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><circle cx="160" cy="120" r="60" fill="${d}" opacity="0.25"/><path d="M400 430 C250 330 230 220 310 190 C360 172 390 210 400 230 C410 210 440 172 490 190 C570 220 550 330 400 430Z" fill="${c}"/><path d="M180 470 Q280 420 400 470 Q520 420 620 470 L620 520 L180 520Z" fill="${d}"/>`);
}

/** Buku & pensil (pendidikan anak). */
function books(bg: string, a: string, b: string, c: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="180" y="380" width="440" height="60" rx="8" fill="${a}"/><rect x="210" y="320" width="380" height="60" rx="8" fill="${b}"/><rect x="240" y="260" width="320" height="60" rx="8" fill="${c}"/><rect x="200" y="395" width="400" height="8" fill="#ffffff" opacity="0.6"/><path d="M560 120 L640 200 L420 260 Z" fill="#fbbf24"/><circle cx="170" cy="140" r="40" fill="${c}" opacity="0.4"/>`);
}

/** Cincin & bunga (pernikahan). */
function rings(bg: string, gold: string, petal: string): string {
  const flower = (x: number, y: number) => [0, 72, 144, 216, 288].map((a) => `<ellipse cx="${x}" cy="${y - 22}" rx="12" ry="22" fill="${petal}" transform="rotate(${a} ${x} ${y})"/>`).join("") + `<circle cx="${x}" cy="${y}" r="9" fill="${gold}"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><circle cx="340" cy="320" r="110" fill="none" stroke="${gold}" stroke-width="22"/><circle cx="470" cy="320" r="110" fill="none" stroke="${gold}" stroke-width="22" opacity="0.85"/><path d="M440 205 L470 170 L500 205 L470 230Z" fill="#e0f2fe"/>${flower(140, 140)}${flower(660, 470)}${flower(680, 130)}`);
}

/** Lengkung dekorasi pelaminan. */
function arch(bg: string, frame: string, petal: string): string {
  let dots = "";
  for (let i = 0; i <= 12; i++) {
    const a = Math.PI - (i * Math.PI) / 12;
    dots += `<circle cx="${Math.round(400 + 220 * Math.cos(a))}" cy="${Math.round(330 - 220 * Math.sin(a))}" r="${18 + (i % 3) * 6}" fill="${petal}" opacity="0.9"/>`;
  }
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="0" y="480" width="800" height="120" fill="${frame}" opacity="0.2"/><path d="M180 520 L180 330 A220 220 0 0 1 620 330 L620 520" fill="none" stroke="${frame}" stroke-width="16"/>${dots}<rect x="330" y="430" width="140" height="50" rx="8" fill="${frame}" opacity="0.5"/>`);
}

/** Gitar + tuts piano. */
function music(bg: string, wood: string, keys: string): string {
  let k = "";
  for (let i = 0; i < 10; i++) k += `<rect x="${80 + i * 64}" y="440" width="60" height="130" fill="#ffffff" stroke="${keys}" stroke-width="3"/>`;
  for (const i of [0, 1, 3, 4, 5, 7, 8]) k += `<rect x="${124 + i * 64}" y="440" width="34" height="80" fill="${keys}"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/>${k}<rect x="520" y="40" width="24" height="230" rx="8" fill="#1f2937" transform="rotate(30 532 155)"/><ellipse cx="420" cy="320" rx="100" ry="80" fill="${wood}" transform="rotate(30 420 320)"/><ellipse cx="470" cy="245" rx="74" ry="60" fill="${wood}" transform="rotate(30 470 245)"/><circle cx="445" cy="285" r="24" fill="#1f2937"/>`);
}

/** Ruang interior. */
function room(wall: string, floor: string, sofa: string, accent: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${wall}"/><rect x="0" y="430" width="800" height="170" fill="${floor}"/><rect x="480" y="90" width="200" height="240" rx="6" fill="#ffffff" opacity="0.7"/><rect x="490" y="100" width="85" height="220" fill="#bae6fd"/><rect x="585" y="100" width="85" height="220" fill="#bae6fd"/><rect x="110" y="320" width="330" height="110" rx="24" fill="${sofa}"/><rect x="90" y="300" width="50" height="140" rx="20" fill="${sofa}"/><rect x="410" y="300" width="50" height="140" rx="20" fill="${sofa}"/><rect x="150" y="270" width="110" height="70" rx="18" fill="${accent}"/><path d="M620 430 L640 330 L660 430Z" fill="${accent}"/><circle cx="640" cy="320" r="24" fill="#22c55e"/><rect x="180" y="460" width="220" height="16" rx="8" fill="${accent}" opacity="0.6"/>`);
}

/** Crane & gedung dalam konstruksi. */
function crane(sky: string, steel: string, block: string): string {
  let floors = "";
  for (let i = 0; i < 6; i++) floors += `<rect x="420" y="${500 - i * 52}" width="220" height="44" fill="${block}" opacity="${1 - i * 0.1}"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${sky}"/>${floors}<rect x="230" y="80" width="18" height="460" fill="${steel}"/><rect x="120" y="80" width="460" height="16" fill="${steel}"/><path d="M248 96 L120 96 L248 150Z" fill="${steel}" opacity="0.5"/><path d="M520 96 L520 220" stroke="#111827" stroke-width="4"/><rect x="495" y="220" width="50" height="34" fill="${block}"/><rect x="0" y="540" width="800" height="60" fill="#78716c"/>`);
}

/** Vila dengan kolam. */
function villa(sky: string, roof: string, pool: string, leaf: string): string {
  return svg(1000, 640, `${lg("v", sky, "#ffffff")}<rect width="1000" height="640" fill="url(#v)"/><path d="M260 260 L500 140 L740 260Z" fill="${roof}"/><rect x="300" y="260" width="400" height="190" fill="#fafaf9"/><rect x="340" y="300" width="100" height="150" fill="#d6d3d1"/><rect x="470" y="300" width="190" height="90" fill="#bae6fd"/><rect x="180" y="470" width="640" height="90" rx="10" fill="${pool}"/><path d="M220 510 Q300 490 380 510 T540 510 T700 510" stroke="#ffffff" stroke-width="5" fill="none" opacity="0.7"/><rect x="0" y="560" width="1000" height="80" fill="${leaf}" opacity="0.5"/><path d="M120 560 L130 300" stroke="#78350f" stroke-width="12"/><path d="M130 300 Q60 280 40 330 M130 300 Q200 270 230 320 M130 300 Q110 230 60 230 M130 300 Q160 230 210 240" stroke="${leaf}" stroke-width="18" fill="none" stroke-linecap="round"/>`);
}

/** Mainan (balok, beruang, kereta, roket). */
function toy(kind: "blocks" | "bear" | "train" | "rocket", bg: string, a: string, b: string): string {
  const body: Record<typeof kind, string> = {
    blocks: `<rect x="200" y="330" width="120" height="120" rx="12" fill="${a}"/><rect x="330" y="330" width="120" height="120" rx="12" fill="${b}"/><rect x="265" y="200" width="120" height="120" rx="12" fill="#facc15"/><text x="325" y="285" font-size="70" font-family="Arial" font-weight="700" fill="#ffffff" text-anchor="middle">A</text>`,
    bear: `<circle cx="300" cy="230" r="90" fill="${a}"/><circle cx="225" cy="160" r="34" fill="${a}"/><circle cx="375" cy="160" r="34" fill="${a}"/><ellipse cx="300" cy="400" rx="110" ry="100" fill="${a}"/><ellipse cx="300" cy="260" rx="36" ry="26" fill="${b}"/><circle cx="270" cy="215" r="9" fill="#1f2937"/><circle cx="330" cy="215" r="9" fill="#1f2937"/>`,
    train: `<rect x="140" y="260" width="200" height="140" rx="14" fill="${a}"/><rect x="340" y="300" width="140" height="100" rx="12" fill="${b}"/><rect x="180" y="200" width="60" height="60" fill="${b}"/><circle cx="190" cy="420" r="30" fill="#1f2937"/><circle cx="300" cy="420" r="30" fill="#1f2937"/><circle cx="430" cy="420" r="30" fill="#1f2937"/>`,
    rocket: `<path d="M300 110 Q380 200 370 380 L230 380 Q220 200 300 110Z" fill="${a}"/><circle cx="300" cy="240" r="34" fill="#e0f2fe" stroke="${b}" stroke-width="8"/><path d="M230 330 L180 420 L240 390Z M370 330 L420 420 L360 390Z" fill="${b}"/><path d="M260 390 L300 470 L340 390Z" fill="#f97316"/>`,
  };
  return svg(600, 600, `<rect width="600" height="600" fill="${bg}"/><circle cx="480" cy="110" r="50" fill="#ffffff" opacity="0.5"/>${body[kind]}`);
}

/** Wajah hewan (kucing / anjing). */
function pet(kind: "cat" | "dog", bg: string, fur: string, inner: string): string {
  const ears = kind === "cat" ? `<path d="M210 220 L230 100 L300 180Z M390 220 L370 100 L300 180Z" fill="${fur}"/><path d="M228 190 L238 130 L270 170Z M372 190 L362 130 L330 170Z" fill="${inner}"/>` : `<ellipse cx="190" cy="270" rx="50" ry="100" fill="${inner}" transform="rotate(20 190 270)"/><ellipse cx="410" cy="270" rx="50" ry="100" fill="${inner}" transform="rotate(-20 410 270)"/>`;
  return svg(600, 600, `<rect width="600" height="600" fill="${bg}"/>${ears}<circle cx="300" cy="300" r="130" fill="${fur}"/><circle cx="250" cy="280" r="14" fill="#1f2937"/><circle cx="350" cy="280" r="14" fill="#1f2937"/><ellipse cx="300" cy="340" rx="${kind === "dog" ? 46 : 20}" ry="${kind === "dog" ? 32 : 14}" fill="${kind === "dog" ? inner : "#f472b6"}"/><circle cx="300" cy="332" r="10" fill="#1f2937"/><rect x="200" y="420" width="200" height="26" rx="13" fill="#ef4444"/>`);
}

/** Produk kemasan (toko hewan, apotek, kopi). */
function pack(kind: "bag" | "bottle" | "box" | "tube", bg: string, c: string, d: string): string {
  const body: Record<typeof kind, string> = {
    bag: `<path d="M200 170 L400 170 L430 480 L170 480Z" fill="${c}"/><rect x="200" y="150" width="200" height="30" rx="6" fill="${d}"/><circle cx="300" cy="330" r="60" fill="#ffffff" opacity="0.85"/><circle cx="300" cy="330" r="30" fill="${d}"/>`,
    bottle: `<rect x="250" y="120" width="100" height="50" rx="10" fill="${d}"/><rect x="210" y="170" width="180" height="310" rx="40" fill="${c}"/><rect x="230" y="270" width="140" height="110" rx="10" fill="#ffffff"/><rect x="250" y="300" width="100" height="14" rx="7" fill="${d}"/><rect x="250" y="330" width="70" height="10" rx="5" fill="#cbd5e1"/>`,
    box: `<path d="M160 230 L300 170 L440 230 L440 430 L300 490 L160 430Z" fill="${c}"/><path d="M300 290 L300 490 L160 430 L160 230Z" fill="${d}" opacity="0.35"/><path d="M160 230 L300 290 L440 230" stroke="#ffffff" stroke-width="6" fill="none"/><path d="M285 350 h30 v-30 h20 v30 h30 v20 h-30 v30 h-20 v-30 h-30z" fill="#ffffff"/>`,
    tube: `<rect x="160" y="250" width="280" height="110" rx="20" fill="${c}"/><rect x="440" y="280" width="50" height="50" rx="8" fill="${d}"/><rect x="190" y="285" width="160" height="16" rx="8" fill="#ffffff"/><rect x="190" y="312" width="100" height="10" rx="5" fill="#ffffff" opacity="0.7"/>`,
  };
  return svg(600, 600, `<rect width="600" height="600" fill="${bg}"/>${body[kind]}<ellipse cx="300" cy="510" rx="160" ry="14" fill="#000000" opacity="0.08"/>`);
}

/** Kebun kopi di lereng. */
function farm(sky: string, hill: string, leaf: string, cherry: string): string {
  let plants = "";
  for (let r = 0; r < 3; r++)
    for (let i = 0; i < 7; i++) {
      const x = 80 + i * 130 + (r % 2) * 60;
      const y = 400 + r * 70;
      plants += `<circle cx="${x}" cy="${y}" r="${34 - r * 4}" fill="${leaf}"/><circle cx="${x + 10}" cy="${y + 6}" r="6" fill="${cherry}"/>`;
    }
  return svg(1000, 640, `<rect width="1000" height="640" fill="${sky}"/><circle cx="820" cy="140" r="70" fill="#fde68a"/><path d="M0 330 Q250 220 500 300 T1000 260 V640 H0Z" fill="${hill}"/><path d="M0 420 Q300 340 600 400 T1000 380 V640 H0Z" fill="${hill}" opacity="0.7"/>${plants}`);
}

/** Truk kontainer + kapal. */
function truck(bg: string, cab: string, box: string, road: string): string {
  return svg(1000, 600, `<rect width="1000" height="600" fill="${bg}"/><rect x="0" y="450" width="1000" height="150" fill="${road}"/><rect x="0" y="515" width="1000" height="8" fill="#fde68a" opacity="0.6"/><rect x="200" y="220" width="460" height="200" rx="8" fill="${box}"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<rect x="${220 + i * 56}" y="236" width="12" height="168" fill="#ffffff" opacity="0.25"/>`).join("")}<path d="M670 270 L780 270 L840 340 L840 420 L670 420Z" fill="${cab}"/><path d="M690 285 L770 285 L815 340 L690 340Z" fill="#bae6fd"/><circle cx="290" cy="440" r="36" fill="#111827"/><circle cx="560" cy="440" r="36" fill="#111827"/><circle cx="770" cy="440" r="36" fill="#111827"/>`);
}

/** Tumpukan kontainer di pelabuhan. */
function containers(bg: string, a: string, b: string, c: string): string {
  const cols = [a, b, c, b, a, c];
  let s = "";
  cols.forEach((col, i) => {
    for (let r = 0; r < 3 - (i % 2); r++) s += `<rect x="${120 + i * 110}" y="${420 - r * 70}" width="104" height="64" rx="4" fill="${r % 2 ? cols[(i + 1) % 6] : col}"/>`;
  });
  return svg(1000, 600, `<rect width="1000" height="600" fill="${bg}"/><rect x="0" y="484" width="1000" height="116" fill="#1e3a8a" opacity="0.5"/>${s}<rect x="840" y="120" width="16" height="364" fill="#f59e0b"/><rect x="740" y="120" width="220" height="14" fill="#f59e0b"/><path d="M780 134 L780 230" stroke="#111827" stroke-width="4"/>`);
}

/** Stik game + cahaya neon. */
function gamepad(bg: string, pad: string, glow: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><circle cx="400" cy="300" r="230" fill="${glow}" opacity="0.18"/><path d="M220 230 Q400 190 580 230 Q680 250 670 380 Q660 450 600 440 Q560 432 520 380 L280 380 Q240 432 200 440 Q140 450 130 380 Q120 250 220 230Z" fill="${pad}"/><rect x="215" y="285" width="70" height="22" rx="6" fill="${glow}"/><rect x="239" y="261" width="22" height="70" rx="6" fill="${glow}"/><circle cx="530" cy="270" r="16" fill="${glow}"/><circle cx="570" cy="305" r="16" fill="#f472b6"/><circle cx="490" cy="305" r="16" fill="#facc15"/><circle cx="530" cy="340" r="16" fill="#4ade80"/>`);
}

/** Denah taman lanskap. */
function garden(bg: string, grass: string, tree: string, water: string): string {
  let trees = "";
  [[150, 140], [650, 120], [700, 460], [120, 470], [400, 90]].forEach(([x, y], i) => (trees += `<circle cx="${x}" cy="${y}" r="${44 - i * 3}" fill="${tree}"/><circle cx="${x - 10}" cy="${y - 10}" r="14" fill="#ffffff" opacity="0.25"/>`));
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="60" y="60" width="680" height="480" rx="30" fill="${grass}"/><path d="M60 300 Q250 260 400 300 T740 300" stroke="#e7e5e4" stroke-width="30" fill="none"/><ellipse cx="460" cy="380" rx="120" ry="60" fill="${water}"/>${trees}<rect x="250" y="180" width="140" height="70" rx="8" fill="#d6d3d1"/>`);
}

/** Thumbnail berita abstrak. */
function news(bg: string, a: string, b: string, shape: number): string {
  const shapes = [
    `<circle cx="560" cy="200" r="120" fill="${a}"/><rect x="100" y="320" width="420" height="160" rx="12" fill="${b}"/>`,
    `<path d="M0 420 L240 220 L420 360 L600 180 L800 380 V500 H0Z" fill="${a}"/><circle cx="640" cy="120" r="50" fill="${b}"/>`,
    `<rect x="120" y="120" width="160" height="300" fill="${a}"/><rect x="320" y="200" width="160" height="220" fill="${b}"/><rect x="520" y="80" width="160" height="340" fill="${a}" opacity="0.6"/>`,
    `<circle cx="400" cy="260" r="160" fill="none" stroke="${a}" stroke-width="40"/><circle cx="400" cy="260" r="60" fill="${b}"/>`,
    `<path d="M100 400 Q260 120 420 300 T740 160" stroke="${a}" stroke-width="30" fill="none" stroke-linecap="round"/><rect x="100" y="420" width="600" height="20" rx="10" fill="${b}"/>`,
    `<rect x="160" y="140" width="480" height="260" rx="20" fill="${a}"/><circle cx="400" cy="270" r="70" fill="${b}"/><path d="M380 230 L440 270 L380 310Z" fill="${a}"/>`,
  ];
  return svg(800, 500, `<rect width="800" height="500" fill="${bg}"/>${shapes[shape % shapes.length]}`);
}

/** Ponsel dengan kartu & saldo (fintech). */
function phone(bg: string, card: string, accent: string): string {
  return svg(800, 600, `${lg("f", bg, "#ffffff")}<rect width="800" height="600" fill="url(#f)"/><rect x="290" y="60" width="240" height="480" rx="36" fill="#0f172a"/><rect x="304" y="80" width="212" height="440" rx="26" fill="#f8fafc"/><rect x="320" y="110" width="180" height="104" rx="16" fill="${card}"/><rect x="336" y="130" width="70" height="12" rx="6" fill="#ffffff" opacity="0.8"/><rect x="336" y="170" width="120" height="20" rx="8" fill="#ffffff"/>${[0, 1, 2, 3].map((i) => `<rect x="320" y="${240 + i * 56}" width="180" height="44" rx="10" fill="#e2e8f0"/><circle cx="342" cy="${262 + i * 56}" r="12" fill="${accent}"/>`).join("")}<rect x="120" y="200" width="150" height="96" rx="16" fill="${accent}" transform="rotate(-12 195 248)"/><circle cx="640" cy="200" r="52" fill="${card}" opacity="0.6"/>`);
}

/** Furnitur (produk toko). */
function furniture(kind: "sofa" | "chair" | "table" | "lamp" | "shelf" | "bed", bg: string, c: string, wood: string): string {
  const body: Record<typeof kind, string> = {
    sofa: `<rect x="110" y="250" width="380" height="140" rx="30" fill="${c}"/><rect x="90" y="300" width="60" height="140" rx="22" fill="${c}"/><rect x="450" y="300" width="60" height="140" rx="22" fill="${c}"/><rect x="140" y="360" width="320" height="70" rx="16" fill="${c}" opacity="0.85"/><rect x="130" y="440" width="14" height="50" fill="${wood}"/><rect x="456" y="440" width="14" height="50" fill="${wood}"/>`,
    chair: `<rect x="230" y="140" width="150" height="190" rx="24" fill="${c}"/><rect x="200" y="320" width="210" height="50" rx="16" fill="${c}"/><path d="M220 370 L200 490 M390 370 L410 490 M260 370 L250 470 M350 370 L360 470" stroke="${wood}" stroke-width="12" stroke-linecap="round"/>`,
    table: `<ellipse cx="300" cy="280" rx="210" ry="50" fill="${wood}"/><rect x="90" y="270" width="420" height="20" fill="${wood}"/><path d="M180 300 L150 480 M420 300 L450 480 M300 320 L300 480" stroke="${wood}" stroke-width="16" stroke-linecap="round"/><circle cx="300" cy="250" r="26" fill="${c}"/>`,
    lamp: `<path d="M220 140 L380 140 L420 260 L180 260Z" fill="${c}"/><rect x="292" y="260" width="16" height="200" fill="${wood}"/><ellipse cx="300" cy="470" rx="90" ry="22" fill="${wood}"/><ellipse cx="300" cy="300" rx="120" ry="30" fill="#fde68a" opacity="0.35"/>`,
    shelf: `<rect x="150" y="110" width="300" height="380" rx="6" fill="none" stroke="${wood}" stroke-width="16"/><rect x="150" y="230" width="300" height="12" fill="${wood}"/><rect x="150" y="350" width="300" height="12" fill="${wood}"/><rect x="180" y="160" width="30" height="70" fill="${c}"/><rect x="216" y="170" width="26" height="60" fill="#94a3b8"/><circle cx="380" cy="300" r="30" fill="${c}"/><rect x="200" y="400" width="90" height="70" rx="6" fill="${c}" opacity="0.7"/>`,
    bed: `<rect x="80" y="200" width="70" height="280" rx="14" fill="${wood}"/><rect x="140" y="320" width="380" height="110" rx="16" fill="${c}"/><rect x="160" y="290" width="110" height="50" rx="20" fill="#ffffff"/><rect x="140" y="420" width="380" height="20" fill="${wood}"/><rect x="500" y="420" width="16" height="60" fill="${wood}"/>`,
  };
  return svg(600, 600, `<rect width="600" height="600" fill="${bg}"/><ellipse cx="300" cy="500" rx="230" ry="18" fill="#000000" opacity="0.08"/>${body[kind]}`);
}

/** Gelembung percakapan (kursus bahasa). */
function speech(bg: string, a: string, b: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="120" y="120" width="340" height="190" rx="40" fill="${a}"/><path d="M190 300 L170 380 L260 306Z" fill="${a}"/><text x="290" y="235" font-size="72" font-family="Arial" font-weight="700" fill="#ffffff" text-anchor="middle">Halo!</text><rect x="360" y="290" width="320" height="180" rx="40" fill="${b}"/><path d="M600 460 L630 530 L540 466Z" fill="${b}"/><text x="520" y="398" font-size="66" font-family="Arial" font-weight="700" fill="#ffffff" text-anchor="middle">Hello!</text>`);
}

/** Kapsul & tablet (apotek). */
function pills(bg: string, a: string, b: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><g transform="rotate(-30 330 300)"><rect x="200" y="250" width="260" height="100" rx="50" fill="${a}"/><rect x="330" y="250" width="130" height="100" rx="50" fill="${b}"/><rect x="330" y="250" width="40" height="100" fill="${b}"/></g><circle cx="560" cy="380" r="64" fill="#ffffff" stroke="${a}" stroke-width="8"/><rect x="510" y="376" width="100" height="8" fill="${a}"/><circle cx="600" cy="200" r="40" fill="${b}" opacity="0.6"/><path d="M150 470 h40 v-40 h30 v40 h40 v30 h-40 v40 h-30 v-40 h-40z" fill="${a}"/>`);
}

/** Kamera sinema + rol film. */
function film(bg: string, body: string, reel: string): string {
  let holes = "";
  for (let i = 0; i < 12; i++) holes += `<rect x="${40 + i * 64}" y="512" width="30" height="20" rx="4" fill="${bg}"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><circle cx="300" cy="170" r="80" fill="${reel}"/><circle cx="460" cy="170" r="80" fill="${reel}"/><circle cx="300" cy="170" r="20" fill="${bg}"/><circle cx="460" cy="170" r="20" fill="${bg}"/><rect x="220" y="250" width="320" height="170" rx="20" fill="${body}"/><path d="M540 300 L640 250 L640 420 L540 370Z" fill="${body}"/><circle cx="300" cy="335" r="30" fill="${reel}"/><rect x="0" y="500" width="800" height="44" fill="#111827"/>${holes}`);
}

/** Perisai & gembok (keamanan siber). */
function shield(bg: string, a: string, b: string): string {
  let grid = "";
  for (let i = 0; i < 9; i++) grid += `<path d="M${i * 100} 0 V600" stroke="${a}" stroke-width="1" opacity="0.15"/>`;
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/>${grid}<path d="M400 80 L580 150 Q590 400 400 520 Q210 400 220 150Z" fill="${a}" opacity="0.9"/><rect x="340" y="280" width="120" height="100" rx="12" fill="${b}"/><path d="M360 280 V245 Q360 205 400 205 Q440 205 440 245 V280" stroke="${b}" stroke-width="16" fill="none"/><circle cx="400" cy="325" r="14" fill="${a}"/><rect x="394" y="330" width="12" height="28" fill="${a}"/>`);
}

/** Dokumen bermeterai (notaris). */
function deed(bg: string, paper: string, seal: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="230" y="70" width="340" height="460" rx="8" fill="${paper}" transform="rotate(-4 400 300)"/><rect x="250" y="90" width="320" height="440" rx="8" fill="#ffffff"/>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect x="285" y="${150 + i * 34}" width="${i % 3 === 2 ? 170 : 250}" height="10" rx="5" fill="#cbd5e1"/>`).join("")}<circle cx="480" cy="440" r="50" fill="${seal}"/><circle cx="480" cy="440" r="34" fill="none" stroke="#ffffff" stroke-width="4"/><path d="M290 450 Q330 410 360 450 T420 440" stroke="#1e293b" stroke-width="4" fill="none"/>`);
}

/** Meja coworking. */
function desk(bg: string, table: string, accent: string): string {
  return svg(800, 600, `<rect width="800" height="600" fill="${bg}"/><rect x="0" y="420" width="800" height="180" fill="${table}" opacity="0.3"/><rect x="90" y="330" width="620" height="24" rx="8" fill="${table}"/><rect x="120" y="354" width="16" height="160" fill="${table}"/><rect x="664" y="354" width="16" height="160" fill="${table}"/><rect x="170" y="230" width="170" height="100" rx="8" fill="#1e293b"/><rect x="180" y="240" width="150" height="80" rx="4" fill="${accent}"/><rect x="430" y="250" width="150" height="80" rx="8" fill="#334155"/><circle cx="640" cy="300" r="24" fill="${accent}"/><path d="M640 276 L640 200" stroke="#22c55e" stroke-width="6"/><circle cx="640" cy="190" r="26" fill="#22c55e"/><rect x="560" y="80" width="160" height="110" rx="8" fill="#ffffff" opacity="0.6"/>`);
}

export const V2B_SOURCES: Record<string, () => string> = {
  "v2b-face-1": () => face("#fde68a", "#e0ac69", "#1f2937", "#0f766e"),
  "v2b-face-2": () => face("#fbcfe8", "#c68642", "#3f2a1d", "#7c3aed", true),
  "v2b-face-3": () => face("#bfdbfe", "#ffdbac", "#111827", "#1d4ed8"),
  "v2b-face-4": () => face("#bbf7d0", "#8d5524", "#0f172a", "#b45309", true),
  "v2b-face-5": () => face("#e9d5ff", "#f1c27d", "#78350f", "#be123c"),
  "v2b-face-6": () => face("#fed7aa", "#d4a373", "#1c1917", "#334155", true),
  "v2b-yoga": () => yoga("#ccfbf1", "#0d9488", "#134e4a", "#fcd34d"),
  "v2b-yoga-night": () => yoga("#312e81", "#a78bfa", "#ede9fe", "#fde68a"),
  "v2b-barber": () => barber("#1c1917", "#b91c1c", "#1d4ed8"),
  "v2b-car-1": () => car("#e0f2fe", "#dc2626", "#bfdbfe"),
  "v2b-car-2": () => car("#f1f5f9", "#0f172a", "#94a3b8"),
  "v2b-car-3": () => car("#ecfccb", "#e2e8f0", "#64748b", "#d9f99d"),
  "v2b-car-4": () => car("#fef3c7", "#1d4ed8", "#bfdbfe"),
  "v2b-chart": () => chart("#ecfdf5", "#ffffff", "#059669", "#064e3b"),
  "v2b-chart-dark": () => chart("#0f172a", "#1e293b", "#38bdf8", "#f472b6"),
  "v2b-heart": () => heart("#fff7ed", "#ea580c", "#fdba74"),
  "v2b-books": () => books("#fef9c3", "#16a34a", "#ea580c", "#2563eb"),
  "v2b-rings": () => rings("#fdf2f8", "#d4a017", "#f9a8d4"),
  "v2b-arch": () => arch("#fff1f2", "#be8b5b", "#fda4af"),
  "v2b-music": () => music("#fef3c7", "#b45309", "#111827"),
  "v2b-room": () => room("#f5f5f4", "#d6d3d1", "#57534e", "#ca8a04"),
  "v2b-room-2": () => room("#ecfeff", "#a8a29e", "#0f766e", "#f97316"),
  "v2b-crane": () => crane("#fef3c7", "#f59e0b", "#a8a29e"),
  "v2b-villa": () => villa("#bae6fd", "#78350f", "#06b6d4", "#15803d"),
  "v2b-villa-dusk": () => villa("#fdba74", "#44403c", "#0e7490", "#166534"),
  "v2b-toy-blocks": () => toy("blocks", "#e0f2fe", "#ef4444", "#22c55e"),
  "v2b-toy-bear": () => toy("bear", "#fef3c7", "#b45309", "#fde68a"),
  "v2b-toy-train": () => toy("train", "#fce7f3", "#2563eb", "#f59e0b"),
  "v2b-toy-rocket": () => toy("rocket", "#ede9fe", "#f43f5e", "#6366f1"),
  "v2b-pet-cat": () => pet("cat", "#ffedd5", "#f97316", "#fed7aa"),
  "v2b-pet-dog": () => pet("dog", "#e0f2fe", "#d6a76c", "#92400e"),
  "v2b-pack-food": () => pack("bag", "#fef3c7", "#ea580c", "#7c2d12"),
  "v2b-pack-vitamin": () => pack("bottle", "#ecfdf5", "#10b981", "#065f46"),
  "v2b-pack-medkit": () => pack("box", "#fef2f2", "#dc2626", "#7f1d1d"),
  "v2b-pack-cream": () => pack("tube", "#f0f9ff", "#0ea5e9", "#0c4a6e"),
  "v2b-pack-coffee": () => pack("bag", "#f5f5f4", "#44403c", "#a16207"),
  "v2b-farm": () => farm("#e0f2fe", "#4d7c0f", "#166534", "#dc2626"),
  "v2b-truck": () => truck("#e0f2fe", "#f59e0b", "#1e3a8a", "#475569"),
  "v2b-containers": () => containers("#dbeafe", "#dc2626", "#2563eb", "#16a34a"),
  "v2b-gamepad": () => gamepad("#09090b", "#27272a", "#a3e635"),
  "v2b-garden": () => garden("#f5f5f4", "#86efac", "#166534", "#7dd3fc"),
  "v2b-news-1": () => news("#fee2e2", "#dc2626", "#1f2937", 0),
  "v2b-news-2": () => news("#e0f2fe", "#0369a1", "#f59e0b", 1),
  "v2b-news-3": () => news("#f1f5f9", "#334155", "#94a3b8", 2),
  "v2b-news-4": () => news("#ecfccb", "#4d7c0f", "#1f2937", 3),
  "v2b-news-5": () => news("#fef3c7", "#b45309", "#1f2937", 4),
  "v2b-news-6": () => news("#1f2937", "#dc2626", "#f8fafc", 5),
  "v2b-phone": () => phone("#ede9fe", "#7c3aed", "#14b8a6"),
  "v2b-sofa": () => furniture("sofa", "#f5f5f4", "#a16207", "#57534e"),
  "v2b-chair": () => furniture("chair", "#ecfdf5", "#047857", "#78350f"),
  "v2b-table": () => furniture("table", "#fef3c7", "#e11d48", "#92400e"),
  "v2b-lamp": () => furniture("lamp", "#f1f5f9", "#0f766e", "#334155"),
  "v2b-shelf": () => furniture("shelf", "#fff7ed", "#ea580c", "#78350f"),
  "v2b-bed": () => furniture("bed", "#eff6ff", "#64748b", "#a16207"),
  "v2b-speech": () => speech("#eff6ff", "#2563eb", "#f97316"),
  "v2b-pills": () => pills("#ecfdf5", "#059669", "#f59e0b"),
  "v2b-film": () => film("#1c1917", "#44403c", "#d6b98c"),
  "v2b-shield": () => shield("#020617", "#22d3ee", "#0f172a"),
  "v2b-deed": () => deed("#f5f5f4", "#e7e5e4", "#7f1d1d"),
  "v2b-desk": () => desk("#fef9c3", "#a16207", "#14b8a6"),
};
