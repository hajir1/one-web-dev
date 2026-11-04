/* ================================================================== */
/* ATURAN KUOTA TERPUSAT (Web Maker)                                    */
/*                                                                    */
/* - Page Maker page designs: a MAXIMUM of 10 saved (all designs,        */
/*   including modified templates). When full, users must                */
/*   delete old designs; the app does NOT delete anything automatically. */
/* - Website folders: 2 free; after that they use credits (site-slot).  */
/* - Code export: 20 successful exports free (see credits/downloadQuota).*/
/*                                                                    */
/* Security note: frontend quotas are for UX only. Enforcement           */
/* must really be enforced by the backend per account.                   */
/* ================================================================== */

export const MAX_DESIGNS = 10;
export const FREE_SITES = 2;
export const FREE_EXPORTS = 20;

export interface CapacityCheck {
  ok: boolean;
  /** Current count. */
  current: number;
  /** Count to be added. */
  adding: number;
  max: number;
  /** Remaining slots before the addition. */
  free: number;
  /** How many must be deleted for the addition to fit (0 when ok). */
  mustDelete: number;
}

/** Checks whether `adding` new designs still fit within MAX_DESIGNS. */
export function designCapacity(current: number, adding = 1, max = MAX_DESIGNS): CapacityCheck {
  const cur = Math.max(0, Math.floor(current));
  const add = Math.max(0, Math.floor(adding));
  const free = Math.max(0, max - cur);
  const mustDelete = Math.max(0, cur + add - max);
  return { ok: mustDelete === 0, current: cur, adding: add, max, free, mustDelete };
}

/** Are free website folders still available? */
export const canCreateFreeSite = (currentSites: number, extraSlots = 0) => currentSites < FREE_SITES + Math.max(0, extraSlots);
