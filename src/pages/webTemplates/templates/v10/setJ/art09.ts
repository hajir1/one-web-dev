import { svg } from "./art";

/* Illustration 09 Ombak Kidul: a two-color risograph print (teal + orange) with dot halftone and off-register. */

const TEAL = "#00838A";
const ORANGE = "#FF6C2F";
const PAPER = "#F6F1E7";

/** Halftone dot raster in a rectangle. */
function dots(x0: number, y0: number, w: number, h: number, step: number, color: string, grow = 0): string {
  let out = "";
  for (let y = y0; y < y0 + h; y += step)
    for (let x = x0 + ((y / step) % 2) * (step / 2); x < x0 + w; x += step) {
      const r = Math.max(0.6, (step / 2.6) * (grow ? 0.3 + (0.7 * (y - y0)) / h : 1));
      out += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r.toFixed(1)}" fill="${color}"/>`;
    }
  return out;
}

/** Waves and a surfer, the orange layer shifted 6px like a misregistration. */
function ombak(): string {
  const wave = (dx: number, dy: number, c: string) =>
    `<g transform="translate(${dx} ${dy})" style="mix-blend-mode:multiply"><path d="M0 520C160 420 260 300 470 300c170 0 230 120 160 200-40 46-120 40-130-20 120 10 110-120-10-120-150 0-250 120-330 210-60 70-120 120-160 130z" fill="${c}" opacity=".92"/></g>`;
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="${PAPER}"/>${dots(0, 0, 1200, 260, 18, ORANGE, 1)}<circle cx="900" cy="170" r="110" fill="${ORANGE}" style="mix-blend-mode:multiply"/>${wave(0, 0, TEAL)}${wave(6, 6, ORANGE).replace('opacity=".92"', 'opacity=".35"')}<rect x="0" y="560" width="1200" height="240" fill="${TEAL}"/>${dots(0, 570, 1200, 230, 16, PAPER)}<g transform="translate(700 420) rotate(-12)"><path d="M0 0h200c20 0 20 18 0 18H0c-14 0-14-18 0-18z" fill="${ORANGE}"/><path d="M90 0l-6-70 22-60M100-130l40 50M100-130l-50 30M84-70l-30 60M88-70l40 60" stroke="#1D2B4F" stroke-width="9" stroke-linecap="round" fill="none"/><circle cx="104" cy="-150" r="15" fill="#1D2B4F"/></g>`,
  );
}

/** Foam boards lined up on the sand. */
function papan(): string {
  const board = (x: number, c: string, r: number) => `<g transform="translate(${x} 520) rotate(${r})"><rect x="-55" y="-420" width="110" height="440" rx="55" fill="${c}" style="mix-blend-mode:multiply"/><path d="M0 -400V0" stroke="${PAPER}" stroke-width="5"/></g>`;
  return svg(
    900,
    1100,
    `<rect width="900" height="1100" fill="${PAPER}"/><rect y="560" width="900" height="540" fill="#E3C99A"/>${dots(0, 580, 900, 520, 14, ORANGE)}${board(170, TEAL, -6)}${board(340, ORANGE, 3)}${board(510, TEAL, -2)}${board(690, ORANGE, 6)}<text x="60" y="1040" font-family="Georgia,serif" font-size="56" font-style="italic" fill="#1D2B4F">papan busa 8 kaki</text>`,
  );
}

export const ART09: Record<string, () => string> = { ombak, papan };
