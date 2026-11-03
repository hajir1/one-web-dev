import type { TemplateContent } from "../../../types";
import { j01 } from "./j01Kasongan";
import { j02 } from "./j02Bayu";
import { j03 } from "./j03Nadia";
import { j04 } from "./j04Banda";
import { j05 } from "./j05Jamu";
import { j06 } from "./j06Layang";
import { j07 } from "./j07Sambal";
import { j08 } from "./j08Roda";
import { j09 } from "./j09Ombak";
import { j10 } from "./j10Petak";

/** Konten template katalog v10 (bagian J, 3D + efek scroll), dikunci dengan ID di ../catalogJ.ts. */
export const V10J_TEMPLATES: Record<string, TemplateContent> = {
  "j3d-tanah-liat-kasongan": j01,
  "j3d-bayu-kertanegara": j02,
  "j3d-nadia-pramesti": j03,
  "j3d-kongsi-pala-banda": j04,
  "j3d-jamu-bakul": j05,
  "j3d-angin-timur-layang": j06,
  "j3d-sambal-bu-rum": j07,
  "j3d-roda-lawas": j08,
  "j3d-ombak-kidul": j09,
  "j3d-petak-sembilan": j10,
};
