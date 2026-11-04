import { create } from "zustand";
import { siteLimit } from "../../../marketplace/hooks";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { SITE_TYPE } from "./site";

/* ================================================================== */
/* Kuota folder website (FREE_SITES + slot tambahan)                    */
/*                                                                    */
/* Every path that CREATES a website folder (new folder, edit template) */
/* goes through `ensureSiteRoom`. When full, the dialog offers two options: */
/* pay for an extra slot, or delete an old website (the user chooses;  */
/* the app never deletes automatically).                                 */
/* ================================================================== */

type SiteLimitReason = "create" | "template";

export interface SiteLimitRequest {
  reason: SiteLimitReason;
  /** The name to be created (e.g. the template name); content, not translated. */
  label?: string;
  /**
   * Called once space is available. `paid` = a slot was just unlocked by the server
   * (the client limit value may not be updated yet, so the caller does not recheck).
   */
  onRoom?: (paid?: boolean) => void;
}

interface SiteLimitState {
  request: SiteLimitRequest | null;
  open: (r: SiteLimitRequest) => void;
  close: () => void;
}

export const useSiteLimitDialog = create<SiteLimitState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

const siteFolders = (): SavedDesign[] => useDesignStore.getState().designs[SITE_TYPE] ?? [];

/** Are there website folder slots left? */
const hasSiteRoom = (): boolean => siteFolders().length < siteLimit();

/** true = a website folder may be created now. false = the website quota dialog opens. */
export function ensureSiteRoom(request: SiteLimitRequest): boolean {
  if (hasSiteRoom()) return true;
  useSiteLimitDialog.getState().open(request);
  return false;
}
