import { artKeyJ } from "./kitJ";
import { ART01 } from "./art01";
import { ART10 } from "./art10";
import { ART09 } from "./art09";
import { ART08 } from "./art08";
import { ART07 } from "./art07";
import { ART06 } from "./art06";
import { ART05 } from "./art05";
import { ART04 } from "./art04";
import { ART03 } from "./art03";
import { ART02 } from "./art02";

/* Ilustrasi set J: per template, kunci v10j-<id>-<nama>. */
const PER_TEMPLATE: [string, Record<string, () => string>][] = [
  ["j3d-tanah-liat-kasongan", ART01],
  ["j3d-bayu-kertanegara", ART02],
  ["j3d-nadia-pramesti", ART03],
  ["j3d-kongsi-pala-banda", ART04],
  ["j3d-jamu-bakul", ART05],
  ["j3d-angin-timur-layang", ART06],
  ["j3d-sambal-bu-rum", ART07],
  ["j3d-roda-lawas", ART08],
  ["j3d-ombak-kidul", ART09],
  ["j3d-petak-sembilan", ART10],
];

export const V10J_SOURCES: Record<string, () => string> = Object.fromEntries(PER_TEMPLATE.flatMap(([id, art]) => Object.entries(art).map(([name, f]) => [artKeyJ(id, name), f])));
