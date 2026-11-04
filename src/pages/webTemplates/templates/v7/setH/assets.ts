import { V7H_SPECS } from "./specs";

/* ================================================================== */
/* Set H images (in-house SVG, ASCII, no third-party licenses):        */
/*   v7h-<id>-mark   logo merek 64×64 (bentuk geometris, 6 varian)      */
/*   v7h-<id>-login  an 800×560 dashboard illustration for the Sign-in page */
/*                   (3 chart variants), using the template palette.    */
/* ================================================================== */

type Spec = (typeof V7H_SPECS)[number];

const svg = (w: number, h: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

export const markKey = (id: string) => `v7h-${id}-mark`;
export const loginArtKey = (id: string) => `v7h-${id}-login`;

function mark(s: Spec): string {
  const [, , p, pd] = s.pal;
  const g = `<defs><linearGradient id="m" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p}"/><stop offset="1" stop-color="${pd}"/></linearGradient></defs>`;
  const r = Math.min(s.look.radius, 18);
  const shapes = [
    `<rect x="16" y="34" width="8" height="14" rx="2" fill="#fff"/><rect x="28" y="24" width="8" height="24" rx="2" fill="#fff"/><rect x="40" y="16" width="8" height="32" rx="2" fill="#fff" opacity=".75"/>`,
    `<circle cx="32" cy="32" r="15" fill="none" stroke="#fff" stroke-width="6"/><circle cx="32" cy="32" r="5" fill="#fff"/>`,
    `<path d="M14 42 L26 28 L36 36 L50 18" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<path d="M32 13 L51 32 L32 51 L13 32 Z" fill="#fff"/><path d="M32 23 L41 32 L32 41 L23 32 Z" fill="${pd}"/>`,
    `<path d="M32 14 A18 18 0 1 1 14 32 L32 32 Z" fill="#fff"/><path d="M36 10 A18 18 0 0 1 54 28 L36 28 Z" fill="#fff" opacity=".6"/>`,
    `<rect x="15" y="15" width="15" height="15" rx="4" fill="#fff"/><rect x="34" y="15" width="15" height="15" rx="4" fill="#fff" opacity=".6"/><rect x="15" y="34" width="15" height="15" rx="4" fill="#fff" opacity=".6"/><rect x="34" y="34" width="15" height="15" rx="4" fill="#fff"/>`,
  ];
  return svg(64, 64, `${g}<rect width="64" height="64" rx="${r}" fill="url(#m)"/>${shapes[hash(s.id) % shapes.length]}`);
}

function loginArt(s: Spec): string {
  const [ink, muted, p, pd, soft, line] = s.pal;
  const v = hash(s.id + "art") % 3;
  const surface = s.look.surface;
  const card = (x: number, y: number, w: number, h: number) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="16" fill="${surface}" stroke="${line}" stroke-width="2"/>`;
  const bar = (x: number, y: number, w: number, c: string, o = 1) => `<rect x="${x}" y="${y}" width="${w}" height="10" rx="5" fill="${c}" opacity="${o}"/>`;
  let body = `<rect width="800" height="560" fill="${soft}"/><circle cx="700" cy="70" r="90" fill="${p}" opacity=".18"/><circle cx="90" cy="510" r="70" fill="${pd}" opacity=".14"/>`;
  // App frame: sidebar + KPI cards.
  body += card(60, 60, 680, 440) + `<rect x="60" y="60" width="150" height="440" rx="16" fill="${pd}"/>`;
  for (let i = 0; i < 6; i++) body += bar(84, 110 + i * 34, i === 1 ? 100 : 80, "#ffffff", i === 1 ? 0.95 : 0.45);
  body += `<circle cx="96" cy="84" r="10" fill="#ffffff"/>`;
  for (let i = 0; i < 3; i++) {
    const x = 236 + i * 164;
    body += card(x, 84, 148, 84) + bar(x + 16, 104, 60, muted, 0.5) + `<rect x="${x + 16}" y="124" width="${70 + i * 10}" height="18" rx="6" fill="${i === 0 ? p : ink}" opacity="${i === 0 ? 1 : 0.8}"/>`;
  }
  // Grafik utama (3 varian).
  body += card(236, 188, 312, 288) + bar(256, 208, 110, ink, 0.8);
  const base = 450;
  const vals = Array.from({ length: 8 }, (_, i) => 40 + ((hash(s.id + i) % 150) + i * 9));
  if (v === 0) vals.forEach((h, i) => (body += `<rect x="${262 + i * 34}" y="${base - h}" width="20" height="${h}" rx="5" fill="${i % 3 === 2 ? pd : p}" opacity="${i % 3 === 2 ? 1 : 0.85}"/>`));
  else {
    const pts = vals.map((h, i) => `${262 + i * 38},${base - h}`).join(" ");
    if (v === 1) body += `<polygon points="262,${base} ${pts} ${262 + 7 * 38},${base}" fill="${p}" opacity=".18"/>`;
    body += `<polyline points="${pts}" fill="none" stroke="${p}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
    vals.forEach((h, i) => (body += `<circle cx="${262 + i * 38}" cy="${base - h}" r="6" fill="${surface}" stroke="${pd}" stroke-width="3"/>`));
  }
  // Donut + list.
  body += card(564, 188, 152, 288);
  const C = 2 * Math.PI * 44;
  const a = 0.35 + (hash(s.id) % 30) / 100;
  body += `<circle cx="640" cy="270" r="44" fill="none" stroke="${line}" stroke-width="18"/>`;
  body += `<circle cx="640" cy="270" r="44" fill="none" stroke="${p}" stroke-width="18" stroke-dasharray="${(C * a).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 640 270)"/>`;
  body += `<circle cx="640" cy="270" r="44" fill="none" stroke="${pd}" stroke-width="18" stroke-dasharray="0 ${(C * a).toFixed(1)} ${(C * 0.25).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 640 270)"/>`;
  for (let i = 0; i < 4; i++) body += `<circle cx="588" cy="${352 + i * 30}" r="6" fill="${i % 2 ? pd : p}"/>` + bar(602, 347 + i * 30, 90 - i * 12, muted, 0.45);
  return svg(800, 560, body);
}

const sources: Record<string, () => string> = {};
for (const s of V7H_SPECS) {
  sources[markKey(s.id)] = () => mark(s);
  sources[loginArtKey(s.id)] = () => loginArt(s);
}

export const V7H_SOURCES = sources;
