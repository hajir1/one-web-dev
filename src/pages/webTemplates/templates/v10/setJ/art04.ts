import { specks, svg } from "./art";

/* Ilustrasi 04 Kongsi Pala Banda: peta gravir sepia dan kebun pala bergaris arsir. */

const K = { paper: "#f1e6cc", ink: "#4A3426", red: "#9E2A2B", sea: "#21364A", nut: "#C9792B" };

const hatch = (x: number, y: number, w: number, h: number, step = 8) => Array.from({ length: Math.floor(w / step) }, (_, i) => `<path d="M${x + i * step} ${y}l${-h * 0.4} ${h}" stroke="${K.ink}" stroke-width="1" opacity=".5"/>`).join("");

/** Peta lama Kepulauan Banda: pulau, garis pantai ganda, mawar angin, kapal. */
function peta(): string {
  const island = (d: string) => `<path d="${d}" fill="#e6d3a9" stroke="${K.ink}" stroke-width="2.5"/><path d="${d}" fill="none" stroke="${K.ink}" stroke-width="1" transform="translate(0 0) scale(1)" opacity=".4" stroke-dasharray="3 5"/>`;
  const waves = Array.from({ length: 18 }, (_, i) => `<path d="M${40 + (i % 6) * 190} ${80 + Math.floor(i / 6) * 180}q12 -8 24 0t24 0" stroke="${K.sea}" stroke-width="1.5" fill="none" opacity=".6"/>`).join("");
  const rose = `<g transform="translate(1000 140)"><circle r="56" fill="none" stroke="${K.ink}" stroke-width="1.5"/>${[0, 45, 90, 135, 180, 225, 270, 315].map((a) => `<path d="M0 0L0 -${a % 90 ? 36 : 56}" stroke="${K.ink}" stroke-width="${a % 90 ? 1 : 2}" transform="rotate(${a})"/>`).join("")}<path d="M-6 -40L0 -62L6 -40z" fill="${K.red}"/></g>`;
  const ship = `<g transform="translate(860 470)"><path d="M0 0h90l-14 20h-62z" fill="${K.ink}"/><path d="M40 0V-70M40 -66l34 30h-34zM40 -40l-30 26h30z" stroke="${K.ink}" stroke-width="2" fill="#e6d3a9"/></g>`;
  return svg(
    1200,
    675,
    `<rect width="1200" height="675" fill="${K.paper}"/>${specks(220, 1200, 675, "#c9b48a", 4, 1.6)}<rect x="20" y="20" width="1160" height="635" fill="none" stroke="${K.ink}" stroke-width="3"/><rect x="30" y="30" width="1140" height="615" fill="none" stroke="${K.ink}" stroke-width="1"/>${waves}` +
      island("M300 300c40-60 140-70 190-20s20 140-60 150-170-60-130-130z") +
      island("M560 260c30-30 80-20 90 20s-20 70-60 70-50-60-30-90z") +
      island("M640 420c60-20 180 0 220 40s-60 70-150 60-120-80-70-100z") +
      island("M220 520c20-14 50-10 56 6s-16 30-34 28-36-22-22-34z") +
      hatch(320, 300, 160, 40) +
      `<path d="M490 330C700 330 820 200 1100 120" stroke="${K.red}" stroke-width="2.5" stroke-dasharray="10 8" fill="none"/>${rose}${ship}` +
      `<text x="330" y="470" font-family="serif" font-style="italic" font-size="26" fill="${K.ink}">Banda Neira</text><text x="660" y="540" font-family="serif" font-style="italic" font-size="24" fill="${K.ink}">Lonthoir</text><text x="540" y="380" font-family="serif" font-style="italic" font-size="18" fill="${K.ink}">Gunung Api</text>`,
  );
}

/** Kebun pala: batang, buah terbelah dengan fuli merah. */
function kebun(): string {
  const fruit = (x: number, y: number, r: number) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#e2c27a" stroke="${K.ink}" stroke-width="2"/><path d="M${x} ${y - r}v${2 * r}" stroke="${K.ink}" stroke-width="2"/><circle cx="${x + r * 0.2}" cy="${y}" r="${r * 0.5}" fill="${K.red}"/><circle cx="${x + r * 0.2}" cy="${y}" r="${r * 0.3}" fill="#5a3a24"/>`;
  return svg(
    800,
    600,
    `<rect width="800" height="600" fill="${K.paper}"/>${specks(160, 800, 600, "#c9b48a", 9, 1.5)}<path d="M380 600C390 420 360 300 300 180M392 600C420 420 470 320 560 220" stroke="${K.ink}" stroke-width="18" fill="none" stroke-linecap="round"/>` +
      [[200, 160], [300, 120], [420, 150], [540, 180], [620, 260], [160, 260], [480, 280]].map(([x, y]) => `<path d="M${x} ${y}c40-30 90-20 110 10-40 30-90 30-110-10z" fill="#7b8c4a" stroke="${K.ink}" stroke-width="2"/>`).join("") +
      fruit(330, 300, 34) + fruit(520, 340, 30) + fruit(250, 380, 26) + hatch(0, 520, 800, 80, 10),
  );
}

export const ART04: Record<string, () => string> = { peta, kebun };
