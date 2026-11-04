import { svg } from "./art";

/* Illustration 06 Angin Timur: a beach with many kites, poster style (flat color fields, diagonals). */

function pantai(): string {
  const kites = [
    [180, 160, "#D2412F", 1.1], [420, 110, "#123A5A", 0.8], [640, 200, "#E8D3A6", 1.3], [880, 90, "#D2412F", 0.9], [1040, 230, "#FAF6EE", 0.7], [300, 300, "#FAF6EE", 0.6], [760, 330, "#123A5A", 0.6],
  ] as [number, number, string, number][];
  const kite = ([x, y, c, s]: [number, number, string, number]) => `<g transform="translate(${x} ${y}) scale(${s}) rotate(-14)"><path d="M0 -60L42 0L0 70L-42 0z" fill="${c}" stroke="#123A5A" stroke-width="3"/><path d="M0 70c-14 40 20 70 0 120" stroke="#123A5A" stroke-width="2.5" fill="none"/><path d="M0 -60V70M-42 0H42" stroke="#123A5A" stroke-width="1.5"/></g><path d="M${x} ${y + 70 * s}L${x - 200} 620" stroke="#123A5A" stroke-width="1" opacity=".5"/>`;
  return svg(
    1200,
    675,
    `<rect width="1200" height="675" fill="#9CC9DD"/><path d="M0 470L1200 400V675H0z" fill="#123A5A"/><path d="M0 560L1200 470V675H0z" fill="#E8D3A6"/><path d="M0 600L1200 520" stroke="#FAF6EE" stroke-width="6"/>${kites.map(kite).join("")}${Array.from({ length: 16 }, (_, i) => `<rect x="${60 + i * 70}" y="${600 - i * 5}" width="10" height="34" fill="#123A5A"/>`).join("")}`,
  );
}

/** Contents of the three-day paper kite kit: paper, bamboo, string, glue, laid out flat. */
function paket(): string {
  return svg(
    1200,
    800,
    `<rect width="1200" height="800" fill="#E8D3A6"/><path d="M330 140L520 400L330 700L140 400z" fill="#D2412F" stroke="#123A5A" stroke-width="5"/><path d="M330 140V700M140 400H520" stroke="#123A5A" stroke-width="3" stroke-dasharray="10 8"/><rect x="620" y="150" width="22" height="520" rx="10" fill="#c79a52" stroke="#123A5A" stroke-width="4"/><rect x="680" y="230" width="22" height="380" rx="10" fill="#c79a52" stroke="#123A5A" stroke-width="4"/><circle cx="900" cy="300" r="110" fill="#FAF6EE" stroke="#123A5A" stroke-width="6"/><circle cx="900" cy="300" r="40" fill="#123A5A"/>${Array.from({ length: 6 }, (_, i) => `<circle cx="900" cy="300" r="${55 + i * 9}" fill="none" stroke="#9CC9DD" stroke-width="3"/>`).join("")}<rect x="820" y="500" width="160" height="200" rx="16" fill="#123A5A"/><rect x="845" y="540" width="110" height="60" fill="#FAF6EE"/><text x="900" y="580" font-family="Arial,sans-serif" font-size="26" font-weight="700" text-anchor="middle" fill="#123A5A">LEM</text>`,
  );
}

export const ART06: Record<string, () => string> = { pantai, paket };
