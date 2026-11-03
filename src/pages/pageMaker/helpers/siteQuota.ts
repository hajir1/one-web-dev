import { create } from "zustand";
import { siteLimit } from "../../../marketplace/hooks";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { SITE_TYPE } from "./site";

/* ================================================================== */
/* Kuota folder website (FREE_SITES + slot tambahan)                    */
/*                                                                    */
/* Semua jalur yang MEMBUAT folder website (folder baru, edit template)  */
/* lewat `ensureSiteRoom`. Bila penuh, dialog memberi dua pilihan:       */
/* bayar slot tambahan, atau hapus website lama (pengguna memilih sendiri;*/
/* aplikasi tidak pernah menghapus otomatis).                            */
/* ================================================================== */

type SiteLimitReason = "create" | "template";

export interface SiteLimitRequest {
  reason: SiteLimitReason;
  /** Nama yang akan dibuat (mis. nama template) — konten, tidak diterjemahkan. */
  label?: string;
  /**
   * Dipanggil setelah ruang tersedia. `paid` = slot baru saja dibuka server
   * (nilai batas di klien bisa belum diperbarui, jadi pemanggil tidak cek ulang).
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

/** Masih ada slot folder website? */
const hasSiteRoom = (): boolean => siteFolders().length < siteLimit();

/** true = boleh membuat folder website sekarang. false = dialog kuota website dibuka. */
export function ensureSiteRoom(request: SiteLimitRequest): boolean {
  if (hasSiteRoom()) return true;
  useSiteLimitDialog.getState().open(request);
  return false;
}
