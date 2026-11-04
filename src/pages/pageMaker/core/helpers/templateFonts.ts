import type { FontFallback, GlobalFont } from "./fontCss";

/* ================================================================== */
/* The template's built-in Google Fonts                                 */
/*                                                                    */
/* Catalog v3 templates use different fonts. Users do not need to       */
/* add these fonts to Global Setting: compose automatically             */
/* adds a Google Fonts @import ONLY when that font-family is used        */
/* in the page CSS. All are licensed under the SIL Open Font License.   */
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
  // v26: fonts for the 3D + scroll effect template batch (all SIL OFL).
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

/** Ready-to-use `font-family`, e.g. TF["Playfair Display"] → `"Playfair Display", serif`. */
export const TF: Record<string, string> = Object.fromEntries(TEMPLATE_FONTS.map((f) => [f.name, `"${f.name}", ${f.fallback}`]));

/** User fonts + template fonts (the user font wins when the names match). */
export function withTemplateFonts(fonts: GlobalFont[]): GlobalFont[] {
  const names = new Set(fonts.map((f) => f.name.trim().toLowerCase()));
  return [...fonts, ...TEMPLATE_FONTS.filter((f) => !names.has(f.name.toLowerCase()))];
}

/** Template fonts mentioned in the text (plain CSS or stringified JSON). */
export function templateFontsIn(text: string): string[] {
  return TEMPLATE_FONTS.filter((f) => text.includes(`"${f.name}"`) || text.includes(`\\"${f.name}\\"`)).map((f) => f.name);
}
