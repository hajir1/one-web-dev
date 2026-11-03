/* ================================================================== */
/* Ilustrasi SVG set F (buatan sendiri, ASCII, tanpa URL eksternal;      */
/* kunci "v5f-<nama>"). Motif menerima warna agar punya beberapa varian. */
/* Banyak dipakai sebagai latar Header Lebar Penuh, jadi komposisinya    */
/* lebar dan objek utamanya tidak di tengah persis.                      */
/* ================================================================== */

const svg = (body: string, w = 1200, h = 700) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const bg = (a: string, b: string) =>
  `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="1200" height="700" fill="url(#g)"/>`;

const dot = (x: number, y: number, r: number, c: string, o = 0.3) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity="${o}"/>`;

/** Piring saji + mangkuk + daun (katering). */
function plate(a: string, b: string, food: string, acc: string): string {
  return svg(
    bg(a, b) +
      dot(1020, 140, 140, acc, 0.25) +
      dot(180, 600, 180, acc, 0.18) +
      `<ellipse cx="760" cy="420" rx="300" ry="120" fill="#000000" opacity="0.12"/>` +
      `<circle cx="760" cy="380" r="230" fill="#ffffff"/><circle cx="760" cy="380" r="180" fill="#f8fafc" stroke="${acc}" stroke-width="6"/>` +
      `<path d="M650 360 Q700 270 790 300 Q880 330 860 420 Q820 480 720 460 Q640 440 650 360Z" fill="${food}"/>` +
      `<circle cx="720" cy="350" r="22" fill="#fde68a"/><circle cx="790" cy="400" r="18" fill="#ef4444"/><circle cx="760" cy="440" r="14" fill="#16a34a"/>` +
      `<path d="M330 520 Q300 420 360 380 Q420 420 390 520Z" fill="#16a34a" opacity="0.8"/><path d="M360 380 V520" stroke="#14532d" stroke-width="3"/>` +
      `<rect x="1010" y="300" width="14" height="230" rx="7" fill="#e2e8f0"/><rect x="1050" y="300" width="14" height="230" rx="7" fill="#e2e8f0"/>`,
  );
}

/** Resor tepi pantai saat senja (hotel). */
function resort(a: string, b: string, sea: string, acc: string): string {
  return svg(
    bg(a, b) +
      `<circle cx="860" cy="330" r="120" fill="${acc}" opacity="0.9"/>` +
      `<rect y="420" width="1200" height="280" fill="${sea}"/>` +
      `<path d="M0 440 Q150 420 300 440 T600 440 T900 440 T1200 440" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.4"/>` +
      `<path d="M120 420 L240 300 L360 420Z" fill="#78350f"/><rect x="150" y="420" width="180" height="80" fill="#fef3c7"/><rect x="225" y="440" width="30" height="60" fill="#92400e"/>` +
      `<path d="M420 420 L520 320 L620 420Z" fill="#92400e"/><rect x="445" y="420" width="150" height="70" fill="#fffbeb"/>` +
      `<path d="M1000 470 Q1010 330 1030 250" stroke="#422006" stroke-width="10" fill="none"/>` +
      `<path d="M1030 250 Q960 230 930 280 M1030 250 Q1100 220 1130 270 M1030 250 Q1000 190 960 190 M1030 250 Q1070 190 1110 200" stroke="#166534" stroke-width="14" fill="none" stroke-linecap="round"/>`,
  );
}

/** Mobil di jalan berkelok (rental). */
function car(a: string, b: string, body: string, acc: string): string {
  return svg(
    bg(a, b) +
      `<path d="M0 520 Q300 440 600 500 T1200 470 V700 H0Z" fill="#334155"/>` +
      `<path d="M0 600 Q300 520 600 580 T1200 550" stroke="#f8fafc" stroke-width="6" stroke-dasharray="40 30" fill="none"/>` +
      `<path d="M120 420 L260 260 L400 420Z" fill="${acc}" opacity="0.35"/><path d="M300 420 L470 220 L640 420Z" fill="${acc}" opacity="0.25"/>` +
      `<path d="M640 470 Q660 400 740 390 L800 340 Q830 320 900 320 L990 320 Q1040 320 1060 360 L1090 400 Q1130 410 1130 450 L1130 480 H640Z" fill="${body}"/>` +
      `<path d="M815 350 L900 340 L900 395 L780 395Z" fill="#e0f2fe"/><path d="M920 340 L990 340 Q1020 342 1035 370 L1050 395 H920Z" fill="#e0f2fe"/>` +
      `<circle cx="740" cy="485" r="40" fill="#0f172a"/><circle cx="740" cy="485" r="16" fill="#cbd5e1"/><circle cx="1040" cy="485" r="40" fill="#0f172a"/><circle cx="1040" cy="485" r="16" fill="#cbd5e1"/>` +
      `<rect x="1110" y="420" width="20" height="14" rx="4" fill="#fde047"/>`,
  );
}

/** Pose yoga duduk + matahari (studio yoga). */
function yoga(a: string, b: string, skin: string, acc: string): string {
  return svg(
    bg(a, b) +
      dot(860, 260, 190, acc, 0.35) +
      dot(860, 260, 120, "#ffffff", 0.35) +
      `<ellipse cx="860" cy="560" rx="260" ry="26" fill="${acc}" opacity="0.5"/>` +
      `<circle cx="860" cy="250" r="44" fill="${skin}"/>` +
      `<path d="M800 320 Q860 290 920 320 L940 450 Q860 470 780 450Z" fill="${acc}"/>` +
      `<path d="M800 330 Q720 380 700 300" stroke="${skin}" stroke-width="24" fill="none" stroke-linecap="round"/><path d="M920 330 Q1000 380 1020 300" stroke="${skin}" stroke-width="24" fill="none" stroke-linecap="round"/>` +
      `<path d="M760 470 Q860 420 960 470 Q980 530 860 540 Q740 530 760 470Z" fill="#475569"/>` +
      `<path d="M240 560 Q260 470 300 440 Q340 470 360 560Z" fill="#65a30d" opacity="0.7"/><path d="M300 440 V560" stroke="#365314" stroke-width="3"/>`,
  );
}

/** Dokumen pajak + kalkulator + grafik (konsultan pajak). */
function ledger(a: string, b: string, paper: string, acc: string): string {
  return svg(
    bg(a, b) +
      dot(200, 140, 160, acc, 0.15) +
      `<rect x="620" y="140" width="320" height="420" rx="14" fill="${paper}" transform="rotate(-6 780 350)"/>` +
      `<rect x="660" y="120" width="320" height="420" rx="14" fill="#ffffff"/>` +
      `<rect x="700" y="170" width="200" height="16" rx="8" fill="${acc}"/><rect x="700" y="210" width="240" height="10" rx="5" fill="#cbd5e1"/><rect x="700" y="240" width="220" height="10" rx="5" fill="#cbd5e1"/><rect x="700" y="270" width="230" height="10" rx="5" fill="#cbd5e1"/>` +
      `<rect x="700" y="380" width="30" height="110" fill="${acc}" opacity="0.5"/><rect x="750" y="340" width="30" height="150" fill="${acc}" opacity="0.7"/><rect x="800" y="300" width="30" height="190" fill="${acc}"/>` +
      `<rect x="960" y="360" width="170" height="240" rx="18" fill="#1e293b"/><rect x="980" y="380" width="130" height="50" rx="6" fill="#a7f3d0"/>` +
      `<g fill="#475569"><rect x="980" y="450" width="35" height="30" rx="6"/><rect x="1028" y="450" width="35" height="30" rx="6"/><rect x="1076" y="450" width="35" height="30" rx="6"/><rect x="980" y="495" width="35" height="30" rx="6"/><rect x="1028" y="495" width="35" height="30" rx="6"/><rect x="1076" y="495" width="35" height="80" rx="6" fill="${acc}"/><rect x="980" y="540" width="83" height="35" rx="6"/></g>`,
  );
}

/** Balon + konfeti + pita (event organizer). */
function party(a: string, b: string, c1: string, c2: string): string {
  const conf = [
    [120, 120, c1],
    [260, 220, c2],
    [420, 90, "#fde047"],
    [560, 180, c1],
    [700, 70, c2],
    [180, 380, "#fde047"],
    [360, 330, c2],
  ]
    .map(([x, y, c]) => `<rect x="${x}" y="${y}" width="14" height="26" rx="3" fill="${c}" transform="rotate(${Number(x) % 60} ${x} ${y})"/>`)
    .join("");
  return svg(
    bg(a, b) +
      conf +
      `<ellipse cx="860" cy="250" rx="90" ry="110" fill="${c1}"/><path d="M860 360 Q850 460 880 560" stroke="#f8fafc" stroke-width="3" fill="none"/>` +
      `<ellipse cx="1000" cy="300" rx="80" ry="100" fill="${c2}"/><path d="M1000 400 Q1010 480 980 560" stroke="#f8fafc" stroke-width="3" fill="none"/>` +
      `<ellipse cx="760" cy="330" rx="70" ry="88" fill="#fde047"/><path d="M760 418 Q770 490 740 560" stroke="#f8fafc" stroke-width="3" fill="none"/>` +
      `<path d="M0 640 Q300 600 600 640 T1200 630" stroke="${c1}" stroke-width="10" fill="none"/>` +
      `<ellipse cx="830" cy="215" rx="20" ry="32" fill="#ffffff" opacity="0.35"/>`,
  );
}

/** Tiang barbershop + gunting + sisir (barbershop). */
function barber(a: string, b: string, metal: string, acc: string): string {
  const stripes = [0, 1, 2, 3, 4, 5].map((i) => `<path d="M880 ${150 + i * 60} L960 ${110 + i * 60} L960 ${140 + i * 60} L880 ${180 + i * 60}Z" fill="${i % 2 ? "#1d4ed8" : acc}"/>`).join("");
  return svg(
    bg(a, b) +
      `<rect x="870" y="90" width="100" height="440" rx="20" fill="#f8fafc"/>` +
      stripes +
      `<rect x="860" y="70" width="120" height="30" rx="12" fill="${metal}"/><rect x="860" y="520" width="120" height="30" rx="12" fill="${metal}"/>` +
      `<g transform="rotate(-25 420 380)"><circle cx="330" cy="470" r="44" fill="none" stroke="${metal}" stroke-width="16"/><circle cx="440" cy="470" r="44" fill="none" stroke="${metal}" stroke-width="16"/>` +
      `<path d="M350 430 L520 180 L540 190 L380 440Z" fill="${metal}"/><path d="M420 430 L360 170 L382 164 L450 435Z" fill="${metal}"/></g>` +
      `<rect x="520" y="560" width="260" height="34" rx="8" fill="#0f172a"/>` +
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => `<rect x="${532 + i * 24}" y="594" width="10" height="34" fill="#0f172a"/>`).join(""),
  );
}

/** Fasad museum berpilar + bingkai lukisan (museum). */
function museum(a: string, b: string, stone: string, acc: string): string {
  const pillars = [0, 1, 2, 3, 4].map((i) => `<rect x="${560 + i * 110}" y="300" width="44" height="240" fill="${stone}"/>`).join("");
  return svg(
    bg(a, b) +
      `<path d="M520 300 L780 170 L1040 300Z" fill="${stone}"/><rect x="520" y="290" width="520" height="20" fill="${stone}"/>` +
      pillars +
      `<rect x="500" y="540" width="560" height="26" fill="${stone}"/><rect x="480" y="566" width="600" height="26" fill="${stone}"/>` +
      `<circle cx="780" cy="240" r="24" fill="${acc}"/>` +
      `<rect x="120" y="180" width="260" height="200" fill="${acc}" stroke="#a16207" stroke-width="16"/>` +
      `<path d="M140 360 L220 260 L280 320 L320 280 L360 360Z" fill="#ffffff" opacity="0.6"/><circle cx="320" cy="230" r="20" fill="#ffffff" opacity="0.7"/>` +
      `<rect x="160" y="420" width="180" height="14" rx="7" fill="#ffffff" opacity="0.5"/>`,
  );
}

/** Ponsel berisi dasbor aplikasi + kartu melayang (aplikasi keuangan). */
function phone(a: string, b: string, screen: string, acc: string): string {
  return svg(
    bg(a, b) +
      dot(1000, 160, 150, acc, 0.25) +
      `<rect x="700" y="80" width="280" height="560" rx="44" fill="#0f172a"/><rect x="716" y="100" width="248" height="520" rx="32" fill="${screen}"/>` +
      `<rect x="740" y="140" width="200" height="90" rx="16" fill="${acc}"/><rect x="756" y="160" width="90" height="12" rx="6" fill="#ffffff" opacity="0.7"/><rect x="756" y="186" width="140" height="22" rx="8" fill="#ffffff"/>` +
      `<path d="M748 360 L790 320 L830 340 L880 280 L930 300" stroke="${acc}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
      `<rect x="740" y="400" width="200" height="40" rx="12" fill="#ffffff"/><rect x="740" y="452" width="200" height="40" rx="12" fill="#ffffff"/><rect x="740" y="504" width="200" height="40" rx="12" fill="#ffffff"/>` +
      `<g transform="rotate(-10 520 420)"><rect x="380" y="340" width="280" height="170" rx="20" fill="#ffffff"/><circle cx="430" cy="390" r="22" fill="${acc}"/><rect x="470" y="378" width="150" height="14" rx="7" fill="#cbd5e1"/><rect x="410" y="440" width="210" height="22" rx="8" fill="#e2e8f0"/></g>`,
  );
}

/** Pohon buah + keranjang petik (agrowisata). */
function orchard(a: string, b: string, leaf: string, fruit: string): string {
  const fruits = [
    [760, 220],
    [840, 180],
    [900, 260],
    [700, 300],
    [820, 300],
    [960, 200],
    [880, 340],
  ]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="20" fill="${fruit}"/>`)
    .join("");
  return svg(
    bg(a, b) +
      `<path d="M0 520 Q400 470 800 510 T1200 500 V700 H0Z" fill="#65a30d"/>` +
      `<rect x="810" y="320" width="40" height="230" fill="#713f12"/>` +
      `<circle cx="830" cy="250" r="190" fill="${leaf}"/><circle cx="700" cy="300" r="110" fill="${leaf}"/><circle cx="960" cy="300" r="110" fill="${leaf}"/>` +
      fruits +
      `<path d="M300 520 L340 620 H500 L540 520Z" fill="#a16207"/><path d="M330 520 Q420 440 510 520" stroke="#a16207" stroke-width="10" fill="none"/>` +
      `<circle cx="370" cy="510" r="20" fill="${fruit}"/><circle cx="420" cy="500" r="20" fill="${fruit}"/><circle cx="470" cy="512" r="20" fill="${fruit}"/>`,
  );
}

export const V5F_SOURCES: Record<string, () => string> = {
  "v5f-catering": () => plate("#fff7ed", "#fed7aa", "#ea580c", "#c2410c"),
  "v5f-catering-green": () => plate("#f0fdf4", "#bbf7d0", "#ca8a04", "#15803d"),
  "v5f-resort": () => resort("#fb923c", "#7c2d12", "#0e7490", "#fde68a"),
  "v5f-resort-night": () => resort("#1e1b4b", "#312e81", "#0f172a", "#e0e7ff"),
  "v5f-car": () => car("#e0f2fe", "#bae6fd", "#dc2626", "#0369a1"),
  "v5f-car-dark": () => car("#1e293b", "#0f172a", "#f59e0b", "#64748b"),
  "v5f-yoga": () => yoga("#f5f3ff", "#ddd6fe", "#e0ac69", "#8b5cf6"),
  "v5f-yoga-warm": () => yoga("#fff1f2", "#fecdd3", "#c68642", "#f43f5e"),
  "v5f-ledger": () => ledger("#ecfdf5", "#a7f3d0", "#d1fae5", "#047857"),
  "v5f-ledger-blue": () => ledger("#eff6ff", "#bfdbfe", "#dbeafe", "#1d4ed8"),
  "v5f-party": () => party("#fdf4ff", "#f5d0fe", "#d946ef", "#0ea5e9"),
  "v5f-party-night": () => party("#2e1065", "#4c1d95", "#f472b6", "#22d3ee"),
  "v5f-barber": () => barber("#1c1917", "#44403c", "#d6d3d1", "#dc2626"),
  "v5f-barber-light": () => barber("#fafaf9", "#e7e5e4", "#57534e", "#b91c1c"),
  "v5f-museum": () => museum("#fefce8", "#fde68a", "#e7e5e4", "#b45309"),
  "v5f-museum-dusk": () => museum("#312e81", "#1e1b4b", "#cbd5e1", "#f59e0b"),
  "v5f-phone": () => phone("#ecfeff", "#a5f3fc", "#f8fafc", "#0891b2"),
  "v5f-phone-dark": () => phone("#0f172a", "#1e293b", "#e2e8f0", "#22c55e"),
  "v5f-orchard": () => orchard("#fefce8", "#d9f99d", "#15803d", "#dc2626"),
  "v5f-orchard-citrus": () => orchard("#fff7ed", "#fde68a", "#166534", "#f97316"),
};
