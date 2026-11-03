import type { FontFallback, GlobalFont } from "./fontCss";

/* ================================================================== */
/* Font Google bawaan template                                          */
/*                                                                    */
/* Template katalog v3 memakai font yang berbeda-beda. Font ini tidak    */
/* perlu ditambahkan pengguna ke Global Setting: compose otomatis        */
/* menambahkan @import Google Fonts HANYA bila font-family-nya dipakai   */
/* di CSS halaman. Semua berlisensi SIL Open Font License.               */
/* ================================================================== */

const g = (name: string, fallback: FontFallback, weights: number[]): GlobalFont => ({
  id: `tpl-${name.toLowerCase().replace(/ /g, "-")}`,
  name,
  source: "google",
  fallback,
  weights,
  url: "",
  createdAt: 0,
});

const TEMPLATE_FONTS: GlobalFont[] = [
  g("Poppins", "sans-serif", [400, 600, 700]),
  g("Montserrat", "sans-serif", [400, 600, 800]),
  g("Plus Jakarta Sans", "sans-serif", [400, 600, 800]),
  g("Inter", "sans-serif", [400, 500, 700]),
  g("Space Grotesk", "sans-serif", [400, 500, 700]),
  g("Sora", "sans-serif", [400, 600, 700]),
  g("Outfit", "sans-serif", [400, 600, 700]),
  g("Nunito", "sans-serif", [400, 700, 800]),
  g("Rubik", "sans-serif", [400, 500, 700]),
  g("Josefin Sans", "sans-serif", [400, 600, 700]),
  g("Work Sans", "sans-serif", [400, 500, 700]),
  g("Archivo Black", "sans-serif", [400]),
  g("Bebas Neue", "sans-serif", [400]),
  g("Oswald", "sans-serif", [400, 600]),
  g("Syne", "sans-serif", [500, 700, 800]),
  g("Righteous", "cursive", [400]),
  g("Playfair Display", "serif", [400, 700]),
  g("DM Serif Display", "serif", [400]),
  g("Cormorant Garamond", "serif", [400, 600, 700]),
  g("Lora", "serif", [400, 600]),
  g("Merriweather", "serif", [400, 700]),
  g("Libre Baskerville", "serif", [400, 700]),
  g("Fraunces", "serif", [400, 600, 800]),
  g("Caveat", "cursive", [400, 700]),
  g("Pacifico", "cursive", [400]),
  g("Space Mono", "monospace", [400, 700]),
  g("JetBrains Mono", "monospace", [400, 700]),
  // v26: font Batch template 3D + efek scroll (semua SIL OFL).
  g("Young Serif", "serif", [400]),
  g("Hanken Grotesk", "sans-serif", [400, 600, 800]),
  g("Archivo", "sans-serif", [400, 600, 800]),
  g("IBM Plex Mono", "monospace", [400, 500, 600]),
  g("Newsreader", "serif", [400, 600]),
  g("DM Mono", "monospace", [400, 500]),
  g("Libre Caslon Display", "serif", [400]),
  g("Alegreya", "serif", [400, 700]),
  g("Bricolage Grotesque", "sans-serif", [400, 600, 800]),
  g("Spectral", "serif", [400, 600]),
  g("Big Shoulders Display", "sans-serif", [600, 800, 900]),
  g("Chivo", "sans-serif", [400, 700]),
  g("Dela Gothic One", "sans-serif", [400]),
  g("Zilla Slab", "serif", [400, 600, 700]),
  g("Bodoni Moda", "serif", [400, 600, 800]),
  g("Epilogue", "sans-serif", [400, 600, 800]),
  g("Instrument Serif", "serif", [400]),
  g("Schibsted Grotesk", "sans-serif", [400, 600, 800]),
  g("Unbounded", "sans-serif", [500, 700, 900]),
  g("Rethink Sans", "sans-serif", [400, 600]),
];

/** `font-family` siap pakai, mis. TF["Playfair Display"] → `"Playfair Display", serif`. */
export const TF: Record<string, string> = Object.fromEntries(TEMPLATE_FONTS.map((f) => [f.name, `"${f.name}", ${f.fallback}`]));

/** Font pengguna + font template (font pengguna menang bila namanya sama). */
export function withTemplateFonts(fonts: GlobalFont[]): GlobalFont[] {
  const names = new Set(fonts.map((f) => f.name.trim().toLowerCase()));
  return [...fonts, ...TEMPLATE_FONTS.filter((f) => !names.has(f.name.toLowerCase()))];
}

/** Font template yang disebut di teks (CSS biasa atau JSON hasil stringify). */
export function templateFontsIn(text: string): string[] {
  return TEMPLATE_FONTS.filter((f) => text.includes(`"${f.name}"`) || text.includes(`\\"${f.name}\\"`)).map((f) => f.name);
}
