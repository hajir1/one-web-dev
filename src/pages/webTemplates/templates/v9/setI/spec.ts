import type { B, BlockId, GPage, GSpec } from "../../v6/setG/spec";

/* ================================================================== */
/* v9 template specification part I: PREMIUM 3D & ANIMATION             */
/*                                                                    */
/* Written like set G (pure data: Look, block layout, business content  */
/* bilingual) and built with the set G engine, plus:                    */
/*  - 3D hero & sections (Premium Three.js elements / tilt cards),       */
/*  - per-node CSS animation (no library) matching the `motion` style.   */
/* All set I templates are Premium, 60–300 credits by complexity.        */
/* ================================================================== */

export type { B };

/** A hero with a 3D element. */
export type Hero3D =
  | "h3-globe" // text + a 3D globe on a dark gradient background
  | "h3-product" // spinning 3D product + number chips
  | "h3-shape" // 3D geometric shape + bullet list
  | "h3-particles" // a heading over a screen-wide 3D particle background
  | "h3-cards"; // centered heading + three 3D tilt cards

/** A section with a 3D element. */
export type Block3D =
  | "x-globe" // globe + angka jangkauan
  | "x-product" // 3D product + specifications
  | "x-shape" // feature list + 3D shape
  | "x-tilt" // three 3D tilt cards
  | "x-particles"; // a call to action over a particle background

export type IBlockId = BlockId | Block3D;
export type IBlockRef = IBlockId | [IBlockId, B?, B?];

export interface IPage extends Omit<GPage, "blocks"> {
  blocks: IBlockRef[];
}

/** Settings for the 3D elements the template uses (colors taken from the palette). */
export interface Three {
  product?: { model: "bottle" | "can" | "jar" | "cup"; finish: "glossy" | "matte" | "metal"; color?: string; accent?: string };
  shape?: { shape: "torusKnot" | "icosahedron" | "torus" | "octahedron" | "dodecahedron"; material: "metal" | "glass" | "matte" | "wire"; outline?: boolean };
  /** Penanda "Nama, lintang, bujur". */
  globe?: { markers: string[]; arcs?: boolean; startLon?: number };
  particles?: { shape: "wave" | "galaxy" | "sphere"; density?: "low" | "normal" | "high"; accent?: string };
}

/** Entrance animation style: calm, lively, or bold. */
export type Motion = "calm" | "lively" | "bold";

export interface ISpec extends Omit<GSpec, "hero" | "home" | "pages" | "tier"> {
  tier: "premium";
  hero: GSpec["hero"] | Hero3D;
  home: IBlockRef[];
  pages: IPage[];
  three: Three;
  motion: Motion;
  /** Source for 3D tilt cards: the `items` catalog (default when present) or the `svc` services. */
  tiltFrom?: "items" | "svc";
}
