import { svg } from "./art";

/* Ilustrasi 02 Bayu Kertanegara: gambar kerja garis tinta biru di atas kalkir (denah, potongan, tampak). */

const K = { bg: "#f4f6f1", ink: "#1F3A5F", pen: "#A7B0A8", red: "#C8402F" };
const gridBg = () => {
  let g = "";
  for (let x = 0; x <= 800; x += 25) g += `<path d="M${x} 0V600" stroke="${K.pen}" stroke-width=".6" opacity=".5"/>`;
  for (let y = 0; y <= 600; y += 25) g += `<path d="M0 ${y}H800" stroke="${K.pen}" stroke-width=".6" opacity=".5"/>`;
  return `<rect width="800" height="600" fill="${K.bg}"/>${g}`;
};
const ln = (d: string, w = 3, c = K.ink) => `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linejoin="round"/>`;
const dim = (x1: number, x2: number, y: number, label: string) => `${ln(`M${x1} ${y}H${x2}M${x1} ${y - 8}v16M${x2} ${y - 8}v16`, 1.5, K.red)}<text x="${(x1 + x2) / 2}" y="${y - 10}" font-family="monospace" font-size="16" fill="${K.red}" text-anchor="middle">${label}</text>`;

/** Potongan rumah dengan atap lebar dan garis matahari. */
const p1 = () => svg(800, 600, gridBg() + ln("M120 460H680") + ln("M200 460V300H600V460") + ln("M90 300L400 180L710 300") + ln("M300 460V360H380V460", 2) + ln("M450 340H560V410H450Z", 2) + ln("M640 90L520 300", 1.5, K.red) + `<circle cx="660" cy="70" r="26" fill="none" stroke="${K.red}" stroke-width="2"/>` + dim(90, 200, 520, "2.400") + `<text x="120" y="560" font-family="monospace" font-size="18" fill="${K.ink}">POTONGAN A-A  1:100</text>`);

/** Denah sekolah: deret kelas dengan koridor terbuka. */
const p2 = () => {
  let rooms = "";
  for (let i = 0; i < 6; i++) rooms += ln(`M${100 + i * 100} 160H${200 + i * 100}V320H${100 + i * 100}Z`, 2.5) + ln(`M${130 + i * 100} 320v-30`, 2);
  return svg(800, 600, gridBg() + rooms + ln("M100 320H700V380H100", 1.5) + Array.from({ length: 13 }, (_, i) => `<rect x="${100 + i * 50 - 4}" y="376" width="8" height="8" fill="${K.ink}"/>`).join("") + ln("M100 430H700", 1.5, K.red) + `<text x="100" y="470" font-family="monospace" font-size="18" fill="${K.ink}">DENAH LT.1  12 KELAS</text>`);
};

/** Tampak gudang dengan rangka baja dan bukaan baru. */
const p3 = () => svg(800, 600, gridBg() + ln("M120 460V220L400 120L680 220V460Z") + Array.from({ length: 6 }, (_, i) => ln(`M${160 + i * 90} 460V${230 - (i < 3 ? i : 5 - i) * 25}`, 1.5)) + ln("M220 460V340H360V460M440 460V340H580V460", 2.5, K.red) + `<text x="120" y="530" font-family="monospace" font-size="18" fill="${K.ink}">TAMPAK SELATAN  1:150</text>`);

/** Isometri paviliun atap bambu modular. */
const p4 = () => {
  let mods = "";
  for (let i = 0; i < 4; i++) for (let k = 0; k < 3; k++) {
    const x = 160 + i * 110 - k * 60, y = 220 + k * 70 + i * 10;
    mods += ln(`M${x} ${y}l55 -35l55 35l-55 35z`, 2) + ln(`M${x + 55} ${y + 35}v120`, 1.5);
  }
  return svg(800, 600, gridBg() + mods + `<text x="120" y="560" font-family="monospace" font-size="18" fill="${K.ink}">ISOMETRI MODUL ATAP 3x3 M</text>`);
};

export const ART02: Record<string, () => string> = { p1, p2, p3, p4 };
