import { create } from "zustand";
import { designCapacity, type CapacityCheck } from "../../../config/quota";
import { maxDesigns } from "../../../marketplace/hooks";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { PAGE_DESIGN_TYPE, normalizeSiteDoc } from "./site";

/* ================================================================== */
/* Page Maker design quota (MAX_DESIGNS + purchased design packs)       */
/*                                                                    */
/* Every path that ADDS page designs (save new, duplicate,              */
/* Page Composer conversion, template editing) must go through `ensureDesignRoom`.*/
/* When full, a dialog asks the user to delete old designs themselves;  */
/* the app NEVER deletes designs automatically.                          */
/* ================================================================== */

export type DesignLimitReason = "save" | "duplicate" | "template" | "convert";

export interface DesignLimitRequest {
  adding: number;
  reason: DesignLimitReason;
  /** The name to be created (e.g. the template name); content, not translated. */
  label?: string;
  /** Called when the user presses "Continue" after space is available. */
  onRoom?: () => void;
}

interface DesignLimitState {
  request: DesignLimitRequest | null;
  open: (r: DesignLimitRequest) => void;
  close: () => void;
}

export const useDesignLimit = create<DesignLimitState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

const pageDesigns = (): SavedDesign[] => useDesignStore.getState().designs[PAGE_DESIGN_TYPE] ?? [];

/** Current capacity to add `adding` page designs. */
export const designRoom = (adding = 1): CapacityCheck => designCapacity(pageDesigns().length, adding, maxDesigns());

/**
 * true = `adding` designs may be added now. false = the design limit
 * dialog opens (nothing is saved or deleted).
 */
export function ensureDesignRoom(adding: number, reason: DesignLimitReason, extra: Omit<DesignLimitRequest, "adding" | "reason"> = {}): boolean {
  if (designRoom(adding).ok) return true;
  useDesignLimit.getState().open({ adding, reason, ...extra });
  return false;
}

/** Names of the website folders that use each design (for the warning before deleting). */
export function designUsage(sites: SavedDesign[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of sites) {
    for (const p of normalizeSiteDoc(s.state).pages) (out[p.designId] ??= []).push(s.name);
  }
  return out;
}
