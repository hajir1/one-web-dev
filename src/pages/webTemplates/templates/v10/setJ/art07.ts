import { svg, specks } from "./art";

/* Illustration 07 Sambal Bu Rum: hand-painted food stall sign style (flat areas, thick charcoal lines). */

const INK = "#1A1A1A";

/** A stone mortar and pestle with red sambal. */
function cobek(): string {
  return svg(
    800,
    1000,
    `<rect width="800" height="1000" fill="#F2B705"/>${specks(160, 800, 1000, "#d9a204", 3, 3)}<ellipse cx="400" cy="640" rx="320" ry="120" fill="#5b5651" stroke="${INK}" stroke-width="10"/><ellipse cx="400" cy="600" rx="300" ry="104" fill="#77716a" stroke="${INK}" stroke-width="10"/><ellipse cx="400" cy="596" rx="230" ry="70" fill="#C8241B" stroke="${INK}" stroke-width="8"/>${specks(70, 380, 100, "#8d140e", 7, 5).replace(/cx="(\d+)" cy="(\d+)"/g, (_m, x, y) => `cx="${210 + +x}" cy="${548 + +y}"`)}<circle cx="330" cy="580" r="14" fill="#2F5D3A"/><circle cx="470" cy="610" r="10" fill="#FFF8EC"/><path d="M480 560L640 250c14-26 50-14 42 14L540 600z" fill="#8e8780" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/><path d="M120 300c40-80 120-110 170-80-20 50-90 90-170 80z" fill="#2F5D3A" stroke="${INK}" stroke-width="8"/><path d="M150 290c40-20 80-40 120-60" stroke="${INK}" stroke-width="5"/>`,
  );
}

/** Piles of red chilies and green bird's eye chilies. */
function cabai(): string {
  const chili = (x: number, y: number, r: number, c: string, s = 1) => `<g transform="translate(${x} ${y}) rotate(${r}) scale(${s})"><path d="M0 0c60-10 150 10 200 70-70-10-150-20-200-40z" fill="${c}" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/><path d="M0 0c-14-6-24-20-20-40" stroke="#2F5D3A" stroke-width="12" stroke-linecap="round" fill="none"/></g>`;
  return svg(
    800,
    800,
    `<rect width="800" height="800" fill="#FFF8EC"/>${chili(120, 200, 10, "#C8241B")}${chili(300, 140, 30, "#C8241B", 1.1)}${chili(160, 380, -8, "#2F5D3A", 0.8)}${chili(380, 360, 18, "#C8241B")}${chili(120, 540, 4, "#C8241B", 1.2)}${chili(420, 560, -20, "#2F5D3A", 0.9)}${chili(470, 230, 60, "#C8241B", 0.8)}${specks(40, 800, 800, "#F2B705", 3, 4)}`,
  );
}

/** Glass jars lined up on a shelf with handwritten labels. */
function rak(): string {
  const jar = (x: number, c: string, lab: string) => `<g transform="translate(${x} 0)"><rect x="0" y="330" width="150" height="190" rx="18" fill="${c}" stroke="${INK}" stroke-width="8"/><rect x="10" y="300" width="130" height="40" rx="6" fill="#F2B705" stroke="${INK}" stroke-width="8"/><rect x="20" y="390" width="110" height="70" fill="#FFF8EC" stroke="${INK}" stroke-width="5"/><text x="75" y="436" font-family="Georgia,serif" font-size="26" font-weight="700" text-anchor="middle" fill="${INK}">${lab}</text></g>`;
  return svg(
    1200,
    675,
    `<rect width="1200" height="675" fill="#2F5D3A"/><rect x="0" y="520" width="1200" height="40" fill="#8a5a2b" stroke="${INK}" stroke-width="8"/><rect x="0" y="560" width="1200" height="115" fill="#1A1A1A"/>${jar(110, "#C8241B", "bawang")}${jar(340, "#3f7a3f", "ijo")}${jar(570, "#7a2a14", "terasi")}${jar(800, "#a6311c", "cumi")}${jar(1030, "#C8241B", "bawang")}<path d="M0 120H1200" stroke="#FFF8EC" stroke-width="4" stroke-dasharray="20 14" opacity=".5"/>`,
  );
}

export const ART07: Record<string, () => string> = { cobek, cabai, rak };
