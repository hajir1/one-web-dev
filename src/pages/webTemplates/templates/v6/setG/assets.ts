import { face, scene, type Ink } from "./motifs";
import { V6G_SPECS } from "./specs";
import { artKey } from "./keys";

/* ================================================================== */
/* Ilustrasi set G: 6 gambar per template dari 3 motif (kunci           */
/* "v6g-<id>-0..5"). 0–2 memakai warna lembut palet, 3–5 varian         */
/* tercermin dengan latar & aksen berbeda. Ditambah 8 avatar.           */
/* ================================================================== */

function inks(s: (typeof V6G_SPECS)[number]): [Ink, Ink] {
  const [ink, , primary, primaryDark, soft, line] = s.pal;
  return [
    { a: soft, b: line, m: primary, c: primaryDark, d: ink, l: "#ffffff" },
    { a: s.look.alt, b: soft, m: primaryDark, c: primary, d: ink, l: "#ffffff" },
  ];
}

const sources: Record<string, () => string> = {
  "v6g-face-1": () => face("#e0f2fe", "#c68642", "#1f2937", "#0369a1", 0),
  "v6g-face-2": () => face("#fce7f3", "#f1c27d", "#3f1d0b", "#be185d", 1),
  "v6g-face-3": () => face("#dcfce7", "#8d5524", "#111827", "#15803d", 2),
  "v6g-face-4": () => face("#fef3c7", "#e0ac69", "#78350f", "#b45309", 3),
  "v6g-face-5": () => face("#ede9fe", "#ffdbac", "#1f2937", "#6d28d9", 2),
  "v6g-face-6": () => face("#ffedd5", "#c68642", "#111827", "#c2410c", 1),
  "v6g-face-7": () => face("#ccfbf1", "#a0522d", "#0f172a", "#0f766e", 0),
  "v6g-face-8": () => face("#f1f5f9", "#f1c27d", "#57534e", "#334155", 3),
};

for (const s of V6G_SPECS) {
  const [k0, k1] = inks(s);
  s.art.forEach((m, i) => {
    sources[artKey(s.id, i)] = () => scene(m, k0, false);
    sources[artKey(s.id, i + 3)] = () => scene(m, k1, true);
  });
}

export const V6G_SOURCES = sources;
