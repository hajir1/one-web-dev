/* ================================================================== */
/* Ilustrasi tambahan (SVG buatan sendiri, ASCII, tanpa lisensi pihak    */
/* ketiga) untuk preset section Pro dan 16 template baru. Setiap fungsi  */
/* menerima warna sehingga satu bentuk bisa punya banyak identitas.      */
/* ================================================================== */

const svg = (w: number, h: number, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const lg = (id: string, a: string, b: string, vertical = false) =>
  `<defs><linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;

/** Lanskap pegunungan + matahari (travel, fotografi). */
function landscape(sky1: string, sky2: string, far: string, near: string, sun: string): string {
  return svg(
    1200,
    800,
    lg("s", sky1, sky2, true) +
      `<rect width="1200" height="800" fill="url(#s)"/><circle cx="880" cy="250" r="110" fill="${sun}"/>` +
      `<path d="M0 560 L220 330 L380 470 L560 260 L780 520 L940 380 L1200 600 V800 H0Z" fill="${far}"/>` +
      `<path d="M0 640 L260 470 L460 610 L700 450 L960 640 L1200 520 V800 H0Z" fill="${near}"/>` +
      `<path d="M0 720 Q300 660 600 720 T1200 700 V800 H0Z" fill="${near}" opacity="0.7"/>`,
  );
}

/** Siluet gedung kota (properti, jasa profesional). */
function city(bg: string, b1: string, b2: string, win: string): string {
  const tower = (x: number, w: number, h: number, c: string) => {
    let wins = "";
    for (let y = 800 - h + 30; y < 760; y += 46) for (let xx = x + 18; xx < x + w - 24; xx += 36) wins += `<rect x="${xx}" y="${y}" width="16" height="22" rx="3" fill="${win}" opacity="0.8"/>`;
    return `<rect x="${x}" y="${800 - h}" width="${w}" height="${h}" fill="${c}"/>${wins}`;
  };
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="${bg}"/><circle cx="980" cy="180" r="90" fill="${win}" opacity="0.35"/>` +
      tower(80, 180, 420, b2) + tower(270, 220, 560, b1) + tower(500, 160, 380, b2) + tower(670, 240, 620, b1) + tower(920, 200, 460, b2),
  );
}

/** Rumah modern (properti). */
function house(bg: string, wall: string, roof: string, glass: string): string {
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="${bg}"/><rect y="640" width="1200" height="160" fill="${roof}" opacity="0.18"/>` +
      `<path d="M220 360 L600 140 L980 360Z" fill="${roof}"/><rect x="280" y="360" width="640" height="300" fill="${wall}"/>` +
      `<rect x="340" y="420" width="200" height="150" rx="8" fill="${glass}"/><rect x="660" y="420" width="200" height="240" rx="8" fill="${glass}"/>` +
      `<rect x="438" y="420" width="4" height="150" fill="${wall}"/><circle cx="1040" cy="560" r="80" fill="${roof}" opacity="0.5"/><rect x="1034" y="560" width="12" height="100" fill="${roof}"/>`,
  );
}

/** Piring tampak atas (restoran). */
function dish(bg: string, plate: string, a: string, b: string): string {
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/><circle cx="500" cy="400" r="290" fill="${plate}" opacity="0.25"/>` +
      `<circle cx="500" cy="400" r="240" fill="${plate}"/><circle cx="500" cy="400" r="170" fill="${a}"/>` +
      `<circle cx="440" cy="350" r="48" fill="${b}"/><circle cx="560" cy="430" r="56" fill="${b}" opacity="0.85"/><circle cx="470" cy="470" r="30" fill="#ffffff" opacity="0.6"/>` +
      `<rect x="120" y="180" width="18" height="440" rx="9" fill="${plate}" opacity="0.8"/><rect x="862" y="180" width="18" height="440" rx="9" fill="${plate}" opacity="0.8"/>`,
  );
}

/** Antarmuka dasbor (SaaS, startup, teknologi). */
function dashboard(bg1: string, bg2: string, panel: string, a: string, b: string): string {
  const bars = [140, 220, 180, 300, 260, 340, 290].map((h, i) => `<rect x="${560 + i * 44}" y="${560 - h}" width="28" height="${h}" rx="6" fill="${i % 2 ? a : b}"/>`).join("");
  return svg(
    1200,
    800,
    lg("d", bg1, bg2) +
      `<rect width="1200" height="800" fill="url(#d)"/><rect x="120" y="110" width="960" height="580" rx="28" fill="${panel}"/>` +
      `<rect x="120" y="110" width="200" height="580" rx="28" fill="${a}" opacity="0.12"/><rect x="160" y="160" width="120" height="16" rx="8" fill="${a}"/>` +
      [210, 250, 290, 330].map((y) => `<rect x="160" y="${y}" width="${90 + (y % 3) * 10}" height="10" rx="5" fill="${a}" opacity="0.4"/>`).join("") +
      `<rect x="360" y="160" width="300" height="20" rx="10" fill="${a}" opacity="0.7"/><rect x="360" y="200" width="180" height="12" rx="6" fill="${b}" opacity="0.5"/>` +
      `<rect x="360" y="250" width="160" height="110" rx="16" fill="${a}" opacity="0.15"/><rect x="380" y="276" width="70" height="26" rx="6" fill="${a}"/>` +
      `<rect x="360" y="380" width="160" height="110" rx="16" fill="${b}" opacity="0.18"/><rect x="380" y="406" width="90" height="26" rx="6" fill="${b}"/>` +
      bars +
      `<path d="M360 620 Q520 560 640 600 T1040 560" stroke="${b}" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  );
}

/** Editor kode (teknologi, developer). */
function codeEditor(bg: string, panel: string, a: string, b: string, c: string): string {
  const line = (y: number, x: number, w: number, col: string) => `<rect x="${x}" y="${y}" width="${w}" height="14" rx="7" fill="${col}"/>`;
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="${bg}"/><rect x="140" y="120" width="920" height="560" rx="24" fill="${panel}"/>` +
      `<circle cx="180" cy="160" r="9" fill="#f87171"/><circle cx="210" cy="160" r="9" fill="#fbbf24"/><circle cx="240" cy="160" r="9" fill="#34d399"/>` +
      line(220, 190, 120, a) + line(220, 330, 220, b) + line(260, 230, 180, c) + line(260, 430, 140, a) + line(300, 230, 260, b) +
      line(340, 270, 200, c) + line(340, 490, 120, a) + line(380, 270, 300, b) + line(420, 230, 90, a) + line(460, 190, 60, c) +
      line(520, 190, 150, b) + line(520, 360, 240, a) + line(560, 230, 330, c) + `<rect x="760" y="420" width="240" height="200" rx="18" fill="${a}" opacity="0.18"/>` +
      `<path d="M820 520 l-36 -30 36 -30 M940 520 l36 -30 -36 -30 M900 450 l-40 120" stroke="${a}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  );
}

/** Potret orang (personal brand, tim). */
function portrait(bg: string, skin: string, hair: string, shirt: string): string {
  return svg(
    800,
    900,
    `<rect width="800" height="900" fill="${bg}"/><circle cx="640" cy="160" r="120" fill="${shirt}" opacity="0.18"/>` +
      `<path d="M150 900 Q170 640 400 620 Q630 640 650 900Z" fill="${shirt}"/><rect x="350" y="520" width="100" height="120" rx="40" fill="${skin}"/>` +
      `<ellipse cx="400" cy="400" rx="150" ry="175" fill="${skin}"/><path d="M245 380 Q250 200 400 200 Q560 200 555 390 Q520 290 400 300 Q290 300 245 380Z" fill="${hair}"/>` +
      `<circle cx="345" cy="410" r="12" fill="#1f2937"/><circle cx="455" cy="410" r="12" fill="#1f2937"/><path d="M350 490 Q400 520 450 490" stroke="#1f2937" stroke-width="8" fill="none" stroke-linecap="round"/>`,
  );
}

/** Tumpukan buku (pendidikan). */
function books(bg: string, a: string, b: string, c: string): string {
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/><circle cx="780" cy="200" r="120" fill="${b}" opacity="0.25"/>` +
      `<rect x="250" y="560" width="500" height="80" rx="12" fill="${a}"/><rect x="290" y="480" width="440" height="80" rx="12" fill="${b}"/>` +
      `<rect x="230" y="400" width="480" height="80" rx="12" fill="${c}"/><rect x="270" y="320" width="420" height="80" rx="12" fill="${a}" opacity="0.85"/>` +
      `<rect x="250" y="585" width="460" height="10" rx="5" fill="#ffffff" opacity="0.6"/><rect x="250" y="425" width="420" height="10" rx="5" fill="#ffffff" opacity="0.6"/>` +
      `<path d="M440 320 L500 230 L560 320Z" fill="${c}"/><rect x="494" y="160" width="12" height="80" fill="${c}"/>`,
  );
}

/** Panggung acara (event). */
function stage(bg1: string, bg2: string, light: string, crowd: string): string {
  let heads = "";
  for (let i = 0; i < 16; i++) heads += `<circle cx="${50 + i * 75}" cy="${700 + (i % 2) * 18}" r="38" fill="${crowd}"/>`;
  return svg(
    1200,
    800,
    lg("g", bg1, bg2, true) +
      `<rect width="1200" height="800" fill="url(#g)"/><path d="M300 0 L520 520 H680 L900 0Z" fill="${light}" opacity="0.18"/>` +
      `<path d="M80 0 L380 520 H460 L200 0Z" fill="${light}" opacity="0.12"/><path d="M1120 0 L820 520 H740 L1000 0Z" fill="${light}" opacity="0.12"/>` +
      `<rect x="200" y="520" width="800" height="90" rx="10" fill="${crowd}" opacity="0.6"/><rect x="560" y="400" width="80" height="120" rx="12" fill="${light}"/>` +
      heads,
  );
}

/** Kesehatan: salib + detak jantung. */
function pulse(bg: string, a: string, b: string): string {
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/><circle cx="500" cy="400" r="270" fill="${a}" opacity="0.12"/>` +
      `<rect x="430" y="220" width="140" height="360" rx="30" fill="${a}"/><rect x="320" y="330" width="360" height="140" rx="30" fill="${a}"/>` +
      `<path d="M100 620 H360 L410 540 L470 700 L530 580 L570 620 H900" stroke="${b}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  );
}

/** Kamera (fotografi). */
function camera(bg: string, body: string, lens: string): string {
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/><rect x="230" y="270" width="540" height="340" rx="40" fill="${body}"/>` +
      `<rect x="330" y="210" width="160" height="80" rx="20" fill="${body}"/><circle cx="500" cy="440" r="130" fill="${lens}"/>` +
      `<circle cx="500" cy="440" r="90" fill="${body}"/><circle cx="500" cy="440" r="50" fill="${lens}" opacity="0.6"/><circle cx="470" cy="410" r="16" fill="#ffffff" opacity="0.7"/>` +
      `<circle cx="700" cy="320" r="18" fill="${lens}"/>`,
  );
}

/** Komposisi bentuk abstrak (studio kreatif, agensi, galeri). */
function shapes(bg: string, a: string, b: string, c: string, seed = 0): string {
  const r = (n: number) => ((n * 9301 + 49297 + seed * 233) % 233280) / 233280;
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/>` +
      `<circle cx="${300 + r(1) * 200}" cy="${280 + r(2) * 100}" r="${160 + r(3) * 60}" fill="${a}"/>` +
      `<rect x="${520 + r(4) * 80}" y="${300 + r(5) * 80}" width="280" height="280" rx="${20 + r(6) * 60}" fill="${b}" transform="rotate(${-12 + r(7) * 24} 660 440)"/>` +
      `<path d="M${120 + r(8) * 80} 700 L${300 + r(9) * 60} 460 L${480 + r(10) * 40} 700Z" fill="${c}"/>` +
      `<circle cx="${780 + r(11) * 60}" cy="${170 + r(12) * 60}" r="40" fill="${c}" opacity="0.8"/>`,
  );
}

/** Sampul artikel (blog). */
function article(bg: string, a: string, b: string): string {
  return svg(
    1000,
    640,
    `<rect width="1000" height="640" fill="${bg}"/><circle cx="760" cy="200" r="150" fill="${a}" opacity="0.35"/>` +
      `<rect x="120" y="180" width="420" height="300" rx="20" fill="#ffffff"/><rect x="160" y="230" width="260" height="22" rx="11" fill="${b}"/>` +
      `<rect x="160" y="280" width="320" height="12" rx="6" fill="${a}" opacity="0.5"/><rect x="160" y="306" width="280" height="12" rx="6" fill="${a}" opacity="0.5"/>` +
      `<rect x="160" y="332" width="300" height="12" rx="6" fill="${a}" opacity="0.5"/><rect x="160" y="390" width="120" height="40" rx="20" fill="${b}"/>`,
  );
}

/** Kelompok orang (komunitas). */
function people(bg: string, a: string, b: string, c: string): string {
  const person = (x: number, s: number, col: string) =>
    `<circle cx="${x}" cy="${430 - s * 40}" r="${60 * s}" fill="#f1c27d"/><path d="M${x - 110 * s} 800 Q${x} ${470 - s * 20} ${x + 110 * s} 800Z" fill="${col}"/>`;
  return svg(1200, 800, `<rect width="1200" height="800" fill="${bg}"/><circle cx="600" cy="360" r="300" fill="${a}" opacity="0.15"/>` + person(300, 1, b) + person(900, 1, c) + person(600, 1.25, a));
}

/** Tas kerja + dokumen (jasa profesional). */
function briefcase(bg: string, a: string, b: string): string {
  return svg(
    1000,
    800,
    `<rect width="1000" height="800" fill="${bg}"/><rect x="560" y="140" width="260" height="340" rx="16" fill="#ffffff" transform="rotate(8 690 310)"/>` +
      `<rect x="600" y="200" width="160" height="12" rx="6" fill="${b}" transform="rotate(8 690 310)"/><rect x="600" y="236" width="180" height="10" rx="5" fill="${a}" opacity="0.4" transform="rotate(8 690 310)"/>` +
      `<rect x="200" y="330" width="460" height="320" rx="36" fill="${a}"/><rect x="350" y="270" width="160" height="80" rx="20" fill="none" stroke="${a}" stroke-width="24"/>` +
      `<rect x="200" y="450" width="460" height="24" fill="${b}"/><rect x="400" y="430" width="60" height="64" rx="10" fill="${b}"/>`,
  );
}

const SCENES: Record<string, () => string> = {
  "pro-hero": () => dashboard("#eef2ff", "#e0f2fe", "#ffffff", "#4f46e5", "#06b6d4"),
  "pro-services": () => briefcase("#eff6ff", "#1d4ed8", "#f59e0b"),
  "pro-team-1": () => portrait("#e0e7ff", "#f1c27d", "#3f2a1d", "#4f46e5"),
  "pro-team-2": () => portrait("#fce7f3", "#c68642", "#111827", "#db2777"),
  "pro-team-3": () => portrait("#dcfce7", "#ffdbac", "#7c2d12", "#16a34a"),
  "pro-team-4": () => portrait("#fef3c7", "#8d5524", "#1f2937", "#d97706"),
  "pro-work-1": () => shapes("#eef2ff", "#4f46e5", "#06b6d4", "#f59e0b", 1),
  "pro-work-2": () => shapes("#fdf2f8", "#db2777", "#f97316", "#0ea5e9", 2),
  "pro-work-3": () => shapes("#ecfeff", "#0891b2", "#a3e635", "#6366f1", 3),
  "pro-work-4": () => shapes("#fefce8", "#ca8a04", "#ef4444", "#14b8a6", 4),
  "pro-work-5": () => shapes("#f0fdf4", "#16a34a", "#8b5cf6", "#f43f5e", 5),
  "saas-dash": () => dashboard("#eef2ff", "#f5f3ff", "#ffffff", "#6366f1", "#22d3ee"),
  "startup-dash": () => dashboard("#0a0a0a", "#1c1917", "#171717", "#a3e635", "#f5f5f4"),
  "tech-code": () => codeEditor("#0b1120", "#111827", "#22d3ee", "#a78bfa", "#34d399"),
  "brand-portrait": () => portrait("#fde8d7", "#e0ac69", "#2b1b12", "#c2410c"),
  "food-hero": () => dish("#14532d", "#fef3c7", "#ea580c", "#65a30d"),
  "food-1": () => dish("#fff7ed", "#ffffff", "#f97316", "#facc15"),
  "food-2": () => dish("#f0fdf4", "#ffffff", "#16a34a", "#dc2626"),
  "food-3": () => dish("#fef2f2", "#ffffff", "#b91c1c", "#f59e0b"),
  "estate-city": () => city("#e0f2fe", "#0f172a", "#334155", "#fbbf24"),
  "estate-house-1": () => house("#ecfeff", "#ffffff", "#0f766e", "#99f6e4"),
  "estate-house-2": () => house("#fef9c3", "#fffbeb", "#a16207", "#fde68a"),
  "estate-house-3": () => house("#ede9fe", "#ffffff", "#6d28d9", "#c4b5fd"),
  "edu-books": () => books("#fefce8", "#2563eb", "#f59e0b", "#10b981"),
  "event-stage": () => stage("#1e1b4b", "#020617", "#e879f9", "#0f172a"),
  "photo-1": () => landscape("#fde68a", "#fb923c", "#7c2d12", "#431407", "#fff7ed"),
  "photo-2": () => landscape("#bae6fd", "#e0f2fe", "#64748b", "#334155", "#ffffff"),
  "photo-3": () => landscape("#c4b5fd", "#fbcfe8", "#6d28d9", "#3b0764", "#fdf4ff"),
  "photo-4": () => camera("#e7e5e4", "#1c1917", "#78716c"),
  "photo-5": () => landscape("#99f6e4", "#ecfeff", "#0f766e", "#134e4a", "#fef9c3"),
  "health-pulse": () => pulse("#f0fdfa", "#0d9488", "#f43f5e"),
  "travel-hero": () => landscape("#7dd3fc", "#fef3c7", "#0369a1", "#0c4a6e", "#fbbf24"),
  "travel-1": () => landscape("#fecaca", "#fef9c3", "#b45309", "#78350f", "#fde68a"),
  "travel-2": () => landscape("#a7f3d0", "#ecfccb", "#15803d", "#14532d", "#ffffff"),
  "travel-3": () => landscape("#c7d2fe", "#e0e7ff", "#4338ca", "#1e1b4b", "#fef3c7"),
  "law-city": () => city("#0b1730", "#1e3a5f", "#13294b", "#d4af37"),
  "landing-product": () => dashboard("#ecfdf5", "#f0fdfa", "#ffffff", "#059669", "#0ea5e9"),
  "community-people": () => people("#f5f3ff", "#7c3aed", "#f472b6", "#38bdf8"),
  "creative-hero": () => shapes("#0a0a0a", "#ec4899", "#facc15", "#22d3ee", 7),
  "blog-1": () => article("#e0f2fe", "#0284c7", "#0f172a"),
  "blog-2": () => article("#fef3c7", "#d97706", "#0f172a"),
  "blog-3": () => article("#fce7f3", "#db2777", "#0f172a"),
  "blog-4": () => article("#dcfce7", "#16a34a", "#0f172a"),
  "folio-1": () => shapes("#fafaf9", "#0f172a", "#f97316", "#e7e5e4", 11),
  "folio-2": () => shapes("#fafaf9", "#f97316", "#0f172a", "#fed7aa", 12),
  "folio-3": () => shapes("#fafaf9", "#78716c", "#f97316", "#0f172a", 13),
  "folio-4": () => shapes("#fafaf9", "#0f172a", "#fdba74", "#a8a29e", 14),
};

export const EXTRA_SOURCES: Record<string, () => string> = SCENES;
