import { useCallback } from "react";
import { useSession } from "../auth/session";
import { useBilling } from "../pages/media/processing/billing";

/* ================================================================== */
/* Paid Web Maker item keys (unlocked per account by the backend)        */
/*                                                                    */
/* An item only counts as owned when `account.items` from the SERVER    */
/* contains it. The frontend never adds items on its own.               */
/* ================================================================== */

export const itemKey = {
  template: (id: string) => `template:${id}`,
  preset: (id: string) => `preset:${id}`,
  element: (type: string) => `element:${type}`,
  event: (name: string) => `event:${name}`,
  /**
   * The N-th website slot (consumable). The slot number makes the key unique so
   * double clicks / repeated requests do not charge credits twice;
   * the backend raises `extraSiteSlots` when this item is unlocked.
   */
  siteSlot: (n: number) => `site-slot:${Math.max(1, Math.floor(n))}`,
};

/** Hook: an `owns(key)` function that updates when the server account changes. */
export function useOwnedItems(): (key: string) => boolean {
  const items = useBilling((s) => s.account?.items);
  // v6: admins (server-validated session) use every Premium item without buying.
  const adminFree = useSession((s) => s.user?.adminFree === true);
  return useCallback((key: string) => adminFree || !!items?.includes(key), [items, adminFree]);
}

/** Extra website slots already purchased (from the server). */
export const useExtraSiteSlots = () => useBilling((s) => s.account?.extraSiteSlots ?? 0);
