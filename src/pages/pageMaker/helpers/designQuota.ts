import { create } from "zustand";
import { designCapacity, type CapacityCheck } from "../../../config/quota";
import { maxDesigns } from "../../../marketplace/hooks";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import { PAGE_DESIGN_TYPE, normalizeSiteDoc } from "./site";

/* ================================================================== */
/* Kuota desain Page Maker (MAX_DESIGNS + paket desain yang dibeli)     */
/*                                                                    */
/* Semua jalur yang MENAMBAH desain halaman (simpan baru, duplikat,      */
/* konversi Page Composer, edit template) wajib lewat `ensureDesignRoom`.*/
/* Bila penuh, dialog meminta pengguna menghapus desain lama sendiri —   */
/* aplikasi TIDAK PERNAH menghapus desain secara otomatis.               */
/* ================================================================== */

export type DesignLimitReason = "save" | "duplicate" | "template" | "convert";

export interface DesignLimitRequest {
  adding: number;
  reason: DesignLimitReason;
  /** Nama yang akan dibuat (mis. nama template) — konten, tidak diterjemahkan. */
  label?: string;
  /** Dipanggil bila pengguna menekan "Lanjutkan" setelah ruang tersedia. */
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

/** Kapasitas saat ini untuk menambah `adding` desain halaman. */
export const designRoom = (adding = 1): CapacityCheck => designCapacity(pageDesigns().length, adding, maxDesigns());

/**
 * true = boleh menambah `adding` desain sekarang. false = dialog batas
 * desain dibuka (tidak ada yang disimpan atau dihapus).
 */
export function ensureDesignRoom(adding: number, reason: DesignLimitReason, extra: Omit<DesignLimitRequest, "adding" | "reason"> = {}): boolean {
  if (designRoom(adding).ok) return true;
  useDesignLimit.getState().open({ adding, reason, ...extra });
  return false;
}

/** Nama folder website yang memakai tiap desain (untuk peringatan sebelum menghapus). */
export function designUsage(sites: SavedDesign[]): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const s of sites) {
    for (const p of normalizeSiteDoc(s.state).pages) (out[p.designId] ??= []).push(s.name);
  }
  return out;
}
