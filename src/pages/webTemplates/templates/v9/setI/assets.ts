import { scene, type Ink } from "../../v6/setG/motifs";
import { artKeyI } from "./keys";
import { V9I_SPECS } from "./specs";

/* ================================================================== */
/* Ilustrasi set I: 6 gambar per template dari 3 motif set G (kunci      */
/* "v9i-<id>-0..5"). 0–2 warna lembut palet, 3–5 varian tercermin.       */
/* Avatar memakai avatar set G (v6g-face-*). SVG buatan sendiri.         */
/* ================================================================== */

function inks(s: (typeof V9I_SPECS)[number]): [Ink, Ink] {
  const [ink, , primary, primaryDark, soft, line] = s.pal;
  return [
    { a: soft, b: line, m: primary, c: primaryDark, d: ink, l: "#ffffff" },
    { a: s.look.alt, b: soft, m: primaryDark, c: primary, d: ink, l: "#ffffff" },
  ];
}

const sources: Record<string, () => string> = {};
for (const s of V9I_SPECS) {
  const [k0, k1] = inks(s);
  s.art.forEach((m, i) => {
    sources[artKeyI(s.id, i)] = () => scene(m, k0, false);
    sources[artKeyI(s.id, i + 3)] = () => scene(m, k1, true);
  });
}

export const V9I_SOURCES = sources;
