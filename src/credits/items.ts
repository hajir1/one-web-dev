import { useCallback } from "react";
import { useSession } from "../auth/session";
import { useBilling } from "../pages/media/processing/billing";

/* ================================================================== */
/* Kunci item berbayar Web Maker (dibuka per akun oleh backend)          */
/*                                                                    */
/* Item hanya dianggap dimiliki bila `account.items` dari SERVER        */
/* memuatnya. Frontend tidak pernah menambahkan item sendiri.           */
/* ================================================================== */

export const itemKey = {
  template: (id: string) => `template:${id}`,
  preset: (id: string) => `preset:${id}`,
  element: (type: string) => `element:${type}`,
  event: (name: string) => `event:${name}`,
  /**
   * Slot website ke-N (habis pakai). Nomor slot membuat kunci unik sehingga
   * klik ganda / pengulangan permintaan tidak memotong kredit dua kali;
   * backend menaikkan `extraSiteSlots` saat item ini dibuka.
   */
  siteSlot: (n: number) => `site-slot:${Math.max(1, Math.floor(n))}`,
};

/** Hook: fungsi `owns(key)` yang ikut diperbarui saat akun dari server berubah. */
export function useOwnedItems(): (key: string) => boolean {
  const items = useBilling((s) => s.account?.items);
  // v6: admin (sesi tervalidasi server) memakai semua item Premium tanpa membeli.
  const adminFree = useSession((s) => s.user?.adminFree === true);
  return useCallback((key: string) => adminFree || !!items?.includes(key), [items, adminFree]);
}

/** Slot website tambahan yang sudah dibeli (dari server). */
export const useExtraSiteSlots = () => useBilling((s) => s.account?.extraSiteSlots ?? 0);
