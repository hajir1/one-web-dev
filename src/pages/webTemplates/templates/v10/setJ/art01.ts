import { specks, svg } from "./art";

/* Illustration 01 Tanah Liat Kasongan: pottery on chalk paper, wet clay lines. */

const K = { bg: "#efe4d3", ink: "#3B2A20", tera: "#B5532A", dark: "#8f3f1e", moss: "#5E7D5B", ash: "#8C7B6B" };

const ground = (y: number) => `<ellipse cx="300" cy="${y}" rx="190" ry="20" fill="${K.ash}" opacity=".35"/>`;
const frame = (body: string, seed: number) => svg(600, 600, `<rect width="600" height="600" fill="${K.bg}"/>${specks(90, 600, 600, K.ash, seed, 1.6)}${body}`);
const stroke = `stroke="${K.ink}" stroke-width="5" stroke-linejoin="round"`;

const VESSELS: Record<string, string> = {
  vas: `${ground(520)}<path d="M270 120h60l-4 30c40 30 84 92 84 170 0 92-52 170-110 196-58-26-110-104-110-196 0-78 44-140 84-170z" fill="${K.tera}" ${stroke}/><path d="M196 300h208" stroke="${K.moss}" stroke-width="18"/><path d="M262 120h76" ${stroke}/>`,
  pot: `<path d="M300 40v120M300 40l-120 150M300 40l120 150" stroke="${K.ink}" stroke-width="3"/>${ground(500)}<path d="M170 190h260l-30 230c-4 30-30 50-60 50h-80c-30 0-56-20-60-50z" fill="${K.tera}" ${stroke}/><path d="M160 190h280v34H160z" fill="${K.dark}" ${stroke}/>`,
  kendi: `${ground(520)}<path d="M300 220c90 0 150 60 150 140s-70 150-150 150-150-70-150-150 60-140 150-140z" fill="${K.tera}" ${stroke}/><path d="M276 120h48v104h-48z" fill="${K.tera}" ${stroke}/><path d="M420 320l90-70 14 22-80 80z" fill="${K.tera}" ${stroke}/><path d="M190 390c70 20 150 20 220 0" stroke="${K.ink}" stroke-width="3" fill="none"/>`,
  tempayan: `${ground(530)}<path d="M200 130h200l20 40c50 40 70 110 60 200-10 90-60 150-180 150s-170-60-180-150c-10-90 10-160 60-200z" fill="${K.dark}" ${stroke}/>${[200, 260, 320, 380, 440].map((y) => `<path d="M150 ${y}c100 20 200 20 300 0" stroke="${K.bg}" stroke-width="4" stroke-dasharray="10 12" fill="none" opacity=".7"/>`).join("")}`,
  lampu: `<path d="M300 20v90" stroke="${K.ink}" stroke-width="4"/>${ground(520)}<path d="M300 110c110 0 170 110 170 250 0 80-40 140-170 140s-170-60-170-140c0-140 60-250 170-250z" fill="${K.tera}" ${stroke}/>${Array.from({ length: 18 }, (_, i) => `<circle cx="${200 + (i % 6) * 40}" cy="${250 + Math.floor(i / 6) * 70}" r="9" fill="#f6d28c"/>`).join("")}`,
  celengan: `${ground(520)}<path d="M180 470c-30-120 20-230 120-230 30-60 90-90 130-70-10 30-30 60-40 80 40 40 50 120 30 220z" fill="${K.tera}" ${stroke}/><path d="M410 180l30-50 20 60z" fill="#c8241b" ${stroke}/><circle cx="380" cy="250" r="9" fill="${K.ink}"/><path d="M250 300h80" stroke="${K.ink}" stroke-width="8" stroke-linecap="round"/><path d="M180 380c-40-20-70 0-80 30 30-10 50 0 80 10z" fill="${K.moss}" ${stroke}/>`,
};

/** Workshop: a potter's hands at the wheel, seen from the side (simple shapes). */
function bengkel(): string {
  return svg(
    800,
    1000,
    `<rect width="800" height="1000" fill="${K.ink}"/>${specks(160, 800, 1000, "#5c4a3e", 7, 2)}` +
      `<rect x="0" y="720" width="800" height="280" fill="#2c1f17"/>` +
      `<ellipse cx="400" cy="720" rx="300" ry="42" fill="#6b5545"/><rect x="380" y="730" width="40" height="200" fill="#6b5545"/>` +
      `<path d="M300 700c-10-120 30-240 70-300h60c40 60 80 180 70 300z" fill="${K.tera}"/>` +
      `<path d="M120 520c80-10 150 20 200 80l-20 40c-60-40-120-60-190-50z" fill="#c98b62"/>` +
      `<path d="M680 520c-80-10-150 20-200 80l20 40c60-40 120-60 190-50z" fill="#b97c55"/>` +
      `<path d="M330 460c40 10 100 10 140 0" stroke="#f3ebdd" stroke-width="3" opacity=".4" fill="none"/>` +
      `<circle cx="640" cy="160" r="70" fill="#f6d28c" opacity=".18"/>`,
  );
}

export const ART01: Record<string, () => string> = {
  ...Object.fromEntries(Object.entries(VESSELS).map(([k, body], i) => [k, () => frame(body, i + 3)])),
  bengkel,
};
