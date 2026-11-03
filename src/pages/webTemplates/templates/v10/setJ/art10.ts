import { svg, specks } from "./art";

/* Ilustrasi 10 Petak Sembilan: motif tegel semen 20 × 20 (dibuat dari bentuk geometris sederhana) + pres besi. */

const P = { semen: "#A7A39A", oker: "#A8442E", hitam: "#1E1E1C", kunyit: "#D8A13A", kapur: "#EFEBE3" };

/** Satu keping tegel: dasar, motif seperempat diputar empat kali, dan butir semen. */
function tile(bg: string, quarter: string, seed: number, center = ""): string {
  const q = [0, 90, 180, 270].map((r) => `<g transform="rotate(${r} 200 200)">${quarter}</g>`).join("");
  return svg(400, 400, `<rect width="400" height="400" fill="${bg}"/>${q}${center}${specks(90, 400, 400, "rgba(30,30,28,.14)", seed, 1.6)}<rect x="1" y="1" width="398" height="398" fill="none" stroke="rgba(30,30,28,.35)" stroke-width="2"/>`);
}

const M: Record<string, () => string> = {
  kawung: () => tile(P.kapur, `<ellipse cx="200" cy="90" rx="58" ry="92" fill="${P.oker}"/><ellipse cx="200" cy="90" rx="20" ry="40" fill="${P.kapur}"/>`, 3, `<circle cx="200" cy="200" r="22" fill="${P.hitam}"/>`),
  bintang: () => tile(P.hitam, `<path d="M200 200L170 40L200 0L230 40z" fill="${P.kunyit}"/><path d="M0 0H90L0 90z" fill="${P.oker}"/>`, 5, `<circle cx="200" cy="200" r="30" fill="${P.kapur}"/>`),
  kipas: () => tile(P.semen, `<path d="M0 0A200 200 0 0 1 200 0V0L0 200z" fill="${P.kapur}"/><path d="M0 0A140 140 0 0 1 140 0L0 140z" fill="${P.oker}"/><path d="M0 0A70 70 0 0 1 70 0L0 70z" fill="${P.hitam}"/>`, 7),
  belah: () => tile(P.kunyit, `<path d="M200 200L100 100L200 0L300 100z" fill="${P.hitam}"/><path d="M200 160L140 100L200 40L260 100z" fill="${P.kapur}"/>`, 11),
  daun: () => tile(P.kapur, `<path d="M200 200C140 150 130 70 200 20C270 70 260 150 200 200z" fill="#4f6b45"/><path d="M200 200V30" stroke="${P.kapur}" stroke-width="5"/>`, 13, `<rect x="180" y="180" width="40" height="40" transform="rotate(45 200 200)" fill="${P.oker}"/>`),
  roda: () => tile(P.oker, `<circle cx="200" cy="200" r="150" fill="none" stroke="${P.kapur}" stroke-width="18"/><path d="M200 200L200 50" stroke="${P.kapur}" stroke-width="10"/><circle cx="0" cy="0" r="70" fill="${P.hitam}"/>`, 17, `<circle cx="200" cy="200" r="40" fill="${P.kunyit}"/>`),
  catur: () => tile(P.kapur, `<rect x="0" y="0" width="100" height="100" fill="${P.hitam}"/><rect x="100" y="100" width="100" height="100" fill="${P.semen}"/>`, 19),
  sulur: () => tile(P.semen, `<path d="M0 200C60 200 80 140 140 140S200 200 200 200" fill="none" stroke="${P.hitam}" stroke-width="16"/><circle cx="140" cy="140" r="22" fill="${P.oker}"/>`, 23, `<circle cx="200" cy="200" r="26" fill="${P.kapur}" stroke="${P.hitam}" stroke-width="8"/>`),
  polos: () => tile(P.oker, `<rect x="0" y="0" width="200" height="14" fill="${P.hitam}"/>`, 29),
};

/** Pres besi tua dari samping, cetakan kuningan di bawahnya. */
function pres(): string {
  return svg(
    900,
    1100,
    `<rect width="900" height="1100" fill="${P.semen}"/>${specks(260, 900, 1100, "rgba(30,30,28,.18)", 31, 2)}<rect x="160" y="140" width="80" height="760" fill="${P.hitam}"/><rect x="660" y="140" width="80" height="760" fill="${P.hitam}"/><rect x="120" y="100" width="660" height="110" fill="${P.hitam}"/><rect x="420" y="210" width="60" height="300" fill="#5c5a55"/><path d="M450 120L450 40M300 40H600" stroke="${P.hitam}" stroke-width="26" stroke-linecap="round"/><circle cx="300" cy="40" r="30" fill="${P.oker}"/><circle cx="600" cy="40" r="30" fill="${P.oker}"/><rect x="300" y="510" width="300" height="70" fill="#5c5a55"/><rect x="290" y="600" width="320" height="90" fill="${P.kunyit}" stroke="${P.hitam}" stroke-width="8"/><path d="M330 645H570M450 610V680" stroke="${P.hitam}" stroke-width="5"/><rect x="100" y="900" width="700" height="80" fill="${P.hitam}"/><rect x="0" y="980" width="900" height="120" fill="#8d8981"/>`,
  );
}

export const MOTIFS = Object.keys(M);
export const ART10: Record<string, () => string> = { ...M, pres };
