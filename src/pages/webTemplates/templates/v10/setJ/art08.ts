import { svg } from "./art";

/* Ilustrasi 08 Roda Lawas: gambar teknik onthel bergaya katalog suku cadang lama (garis tinta, nomor bagian). */

const INK = "#1E4D3B";
const RED = "#A3282B";

const spokes = (cx: number, cy: number, r: number, n = 36) =>
  Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2, b = a + 0.5;
    return `<path d="M${(cx + Math.cos(b) * 14).toFixed(1)} ${(cy + Math.sin(b) * 14).toFixed(1)}L${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}" stroke="${INK}" stroke-width="1.2"/>`;
  }).join("");

const wheel = (cx: number, cy: number) => `<circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="${INK}" stroke-width="14"/><circle cx="${cx}" cy="${cy}" r="136" fill="none" stroke="${INK}" stroke-width="3"/>${spokes(cx, cy, 134)}<circle cx="${cx}" cy="${cy}" r="16" fill="#F1E6C8" stroke="${INK}" stroke-width="4"/>`;

const callout = (x: number, y: number, tx: number, ty: number, n: string) => `<path d="M${x} ${y}L${tx} ${ty}" stroke="${RED}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="5" fill="${RED}"/><circle cx="${tx}" cy="${ty}" r="22" fill="#F1E6C8" stroke="${RED}" stroke-width="3"/><text x="${tx}" y="${ty + 7}" font-family="Georgia,serif" font-size="20" font-weight="700" text-anchor="middle" fill="${RED}">${n}</text>`;

/** Onthel dari samping dengan nomor bagian. */
function onthel(): string {
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="#F1E6C8"/><path d="M0 40H1200M0 760H1200" stroke="${INK}" stroke-width="2" stroke-dasharray="4 8"/>${wheel(300, 520)}${wheel(900, 520)}<path d="M300 520L520 330L560 520L300 520M520 330H800L560 520M800 330L900 520M790 300L830 230H900M520 330L505 280" stroke="${INK}" stroke-width="12" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="M460 270h100c10 0 10 14 0 14H470z" fill="#3a2a1e" stroke="${INK}" stroke-width="4"/><circle cx="560" cy="520" r="34" fill="none" stroke="${INK}" stroke-width="6"/><path d="M560 520L620 590M560 520L500 450" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M140 470c40-120 280-120 320 0" stroke="${INK}" stroke-width="6" fill="none"/><path d="M740 470c40-120 280-120 320 0" stroke="${INK}" stroke-width="6" fill="none"/><circle cx="910" cy="300" r="20" fill="#B9BCB8" stroke="${INK}" stroke-width="4"/>${callout(520, 330, 470, 140, "1")}${callout(900, 380, 1010, 170, "2")}${callout(510, 277, 360, 170, "3")}${callout(590, 560, 660, 700, "4")}${callout(860, 230, 760, 120, "5")}${callout(300, 670, 180, 720, "6")}`,
  );
}

/** Dinding bengkel: velg tergantung dan papan alat. */
function bengkel(): string {
  const rim = (cx: number, cy: number, r: number) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#B9BCB8" stroke-width="10"/><circle cx="${cx}" cy="${cy}" r="${r - 10}" fill="none" stroke="#8d918d" stroke-width="2"/><path d="M${cx} ${cy - r - 30}V${cy - r}" stroke="#F1E6C8" stroke-width="3"/>`;
  const tools = Array.from({ length: 9 }, (_, i) => `<rect x="${640 + i * 54}" y="${180 + (i % 3) * 14}" width="16" height="${150 - (i % 4) * 20}" rx="6" fill="#B9BCB8" stroke="#1a1a1a" stroke-width="3"/>`).join("");
  return svg(
    1000,
    1200,
    `<rect width="1000" height="1200" fill="#1E4D3B"/><rect x="600" y="140" width="380" height="300" fill="#8A4B2A" stroke="#1a1a1a" stroke-width="6"/>${tools}${rim(240, 300, 150)}${rim(320, 640, 130)}${rim(700, 720, 160)}<rect x="0" y="980" width="1000" height="220" fill="#2b2420"/><path d="M0 980H1000" stroke="#F1E6C8" stroke-width="4"/><path d="M90 980L120 900H360L390 980" fill="#A3282B" stroke="#1a1a1a" stroke-width="5"/>`,
  );
}

export const ART08: Record<string, () => string> = { onthel, bengkel };
