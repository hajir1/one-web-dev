import type { GSpec } from "./spec";
import { G1 } from "./g1";
import { G2 } from "./g2";
import { G3 } from "./g3";
import { G4 } from "./g4";
import { G4B } from "./g4b";
import { G4C } from "./g4c"; import { G5 } from "./g5"; import { G5B } from "./g5b"; import { G5C } from "./g5c";

/** Semua spesifikasi set G, urut sesuai katalog. */
export const V6G_SPECS: GSpec[] = [...G1, ...G2, ...G3, ...G4, ...G4B, ...G4C, ...G5, ...G5B, ...G5C];
