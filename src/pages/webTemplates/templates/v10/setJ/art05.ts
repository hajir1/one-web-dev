import { svg } from "./art";

/* Illustration 05 Jamu Bakul: jamu ingredients in woodcut style (flat colors, thick black lines, strokes). */

const INK = "#1d1712";
const cuts = (cx: number, cy: number, r: number, n: number, rot = 0) =>
  Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    return `<path d="M${x.toFixed(0)} ${y.toFixed(0)}l${(Math.cos(a) * 26).toFixed(0)} ${(Math.sin(a) * 26).toFixed(0)}" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
  }).join("");

const plate = (bg: string, body: string) => svg(600, 600, `<rect width="600" height="600" fill="${bg}"/><circle cx="300" cy="300" r="250" fill="none" stroke="${INK}" stroke-width="10"/>${body}`);

/** Rimpang kunyit terbelah + polong asam. */
const kunyit = () =>
  plate("#f4c24f", `<path d="M150 330c20-60 90-80 150-60s110 10 150-20c20 40-10 110-80 130s-120 0-160 20-80-20-60-70z" fill="#c9790f" stroke="${INK}" stroke-width="8"/><ellipse cx="420" cy="300" rx="44" ry="34" fill="#f08a10" stroke="${INK}" stroke-width="8"/>${cuts(420, 300, 18, 8)}<path d="M180 190c60-30 140-30 220 10l-10 30c-80-30-150-30-200-10z" fill="#7a4a24" stroke="${INK}" stroke-width="8"/>`);

/** Rice grains and kencur rhizomes. */
const kencur = () =>
  plate("#f7ecd0", `${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${170 + (i % 6) * 52}" cy="${180 + Math.floor(i / 6) * 40}" rx="16" ry="8" transform="rotate(${(i * 37) % 180} ${170 + (i % 6) * 52} ${180 + Math.floor(i / 6) * 40})" fill="#fffaf0" stroke="${INK}" stroke-width="4"/>`).join("")}<path d="M170 400c40-30 100-20 130 0 30-30 90-30 130 0-10 50-60 70-130 70s-120-20-130-70z" fill="#d9b98a" stroke="${INK}" stroke-width="8"/>${cuts(300, 420, 34, 10, 0.2)}`);

/** Temulawak: round orange slices with rings. */
const temulawak = () =>
  plate("#5d8a52", `<circle cx="300" cy="300" r="150" fill="#f0a63a" stroke="${INK}" stroke-width="10"/><circle cx="300" cy="300" r="110" fill="none" stroke="${INK}" stroke-width="6" stroke-dasharray="14 12"/><circle cx="300" cy="300" r="50" fill="#e07b1a" stroke="${INK}" stroke-width="6"/>${cuts(300, 300, 70, 12)}`);

export const ART05: Record<string, () => string> = { kunyit, kencur, temulawak };
