import { create } from "zustand";
import { isAdminFree } from "../auth/adminFree";
import { CREDIT_COST, type CreditFeature } from "../config/pricing";
import { FREE_SITES, MAX_DESIGNS } from "../config/quota";
import { isDemoMode } from "../demo/demoMode";
import { notify } from "../components/app/Toaster";
import i18n from "../i18n";

/* ================================================================== */
/* Gerbang kredit (frontend)                                            */
/*                                                                    */
/* SATU pintu untuk fitur berbayar Web Maker. `requireCredit()` membuka  */
/* dialog yang menjelaskan biaya. Pembelian/pemakaian kredit SELALU      */
/* lewat backend (`unlockItem` di billing): saldo dan hak akses hanya    */
/* berubah setelah server mengonfirmasi. Tanpa backend, dialog memberi   */
/* tahu dengan jujur bahwa pembayaran belum tersedia.                    */
/* ================================================================== */

export type { CreditFeature };

/** Batas desain halaman tersimpan (lihat config/quota.ts). */
export const FREE_DESIGNS = MAX_DESIGNS;
/** Folder website gratis (lihat config/quota.ts). */
export { FREE_SITES };

export interface CreditRequest {
  feature: CreditFeature;
  /** Nama item yang diminta (preset / event / template), opsional — konten, tidak diterjemahkan. */
  item?: string;
  /** Kunci hak akses di backend (mis. "template:shop-premium"); bila ada, dialog bisa membuka akses. */
  itemKey?: string;
  /** Kunci teks i18n khusus; default credits.gate.<feature>.title/message. */
  titleKey?: string;
  messageKey?: string;
  /** Nilai interpolasi untuk teks. */
  values?: Record<string, string | number>;
  /** Biaya khusus dalam kredit (mis. harga template); default CREDIT_COST. */
  cost?: number;
  /**
   * Harga katalog item (section/elemen/event Premium) untuk TAMPILAN. Harga
   * yang benar-benar dipotong ditentukan server dari katalognya.
   */
  simCost?: number;
  /**
   * Aksi berbayar tanpa item (mis. ekspor setelah kuota gratis habis): tombol
   * "Gunakan N kredit" menjalankan ini; server yang memotong saldo.
   */
  onPay?: () => Promise<void>;
  /** Dipanggil setelah akses item (`itemKey`) dikonfirmasi server. */
  onUnlocked?: () => void;
}

interface CreditGateState {
  request: CreditRequest | null;
  open: (r: CreditRequest) => void;
  close: () => void;
}

export const useCreditGate = create<CreditGateState>((set) => ({
  request: null,
  open: (request) => set({ request }),
  close: () => set({ request: null }),
}));

/** Nilai bawaan untuk teks dialog tiap fitur. */
export const gateValues = (r: CreditRequest): Record<string, string | number> => ({
  sites: FREE_SITES,
  designs: MAX_DESIGNS,
  item: r.item ?? "",
  ...r.values,
});

/** Biaya efektif sebuah permintaan (null = mengikuti tarif fitur server). */
export const requestCost = (r: CreditRequest): number | null => r.cost ?? r.simCost ?? CREDIT_COST[r.feature];

/**
 * Minta pengguna memakai kredit untuk sebuah fitur. Menampilkan dialog
 * kredit dan mengembalikan `false` (aksi tidak dijalankan sekarang).
 */
export function requireCredit(feature: CreditFeature, extra: Omit<CreditRequest, "feature"> = {}): false {
  // Mode demo (v12): tidak ada kredit/pembelian → tanpa dialog, cukup pesan singkat.
  if (isDemoMode()) {
    notify.info(i18n.t("demo.notAvailable"));
    return false;
  }
  // v6: admin → tanpa dialog kredit. Aksi berbayar langsung dijalankan (server tidak menagih admin).
  if (isAdminFree() && extra.onPay) {
    void extra.onPay().catch(() => useCreditGate.getState().open({ feature, ...extra }));
    return false;
  }
  useCreditGate.getState().open({ feature, ...extra });
  return false;
}
