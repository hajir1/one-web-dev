/* ================================================================== */
/* Ekspor kode DI SERVER (v4) — POST /exports                            */
/*                                                                    */
/* Kode lengkap tidak lagi dibuat di browser lalu "dilaporkan": server   */
/* memuat desain yang sudah tersinkron, memeriksa item Premium,         */
/* mencatat kuota, baru mengirim berkas. Aturan kuota tetap sama:       */
/*  - 20 ekspor gratis per akun; hasil identik (framework + isi sama)    */
/*    tidak dihitung lagi (sidik jari dihitung server);                  */
/*  - setelah habis → ekspor memakai kredit (pay=true setelah setuju).   */
/* ================================================================== */

import { FREE_EXPORTS } from "../config/quota";
import { api, ApiError } from "../api/client";
import { patchLimits, useMarketStore } from "../marketplace/account";
import { useBilling } from "../pages/media/processing/billing";
import { useIconStore } from "../pages/pageMaker/core/store/iconStore";
import { useFontStore } from "../pages/pageMaker/core/store/fontStore";
import { useVarStore } from "../pages/pageMaker/core/store/varStore";
import { currentMotionVars } from "../pages/pageMaker/core/store/motionStore";

export { FREE_EXPORTS };
/** @deprecated nama lama */
export const FREE_DOWNLOADS = FREE_EXPORTS;

/** v9: "free" = ekspor Susun Website Utuh, gratis tanpa batas (tidak memakai kuota). */
export type ExportRecordResult = "counted" | "repeat" | "paid" | "free" | "blocked";

export interface ExportQuotaInfo {
  used: number;
  free: number;
  remaining: number;
  cost: number;
}

export interface ServerExportSource {
  kind: "page" | "site";
  /** Id desain/website di designStore (harus sudah tersinkron). */
  id: string;
  rootClass?: string;
}

export interface ExportedFile {
  name: string;
  content: string;
  lang: string;
}

type ServerExport = ExportQuotaInfo & { result: "counted" | "repeat" | "paid" | "free"; account?: unknown; files: ExportedFile[]; fingerprint: string };

/** Ikon, font & variabel global pengguna hanya ada di perangkat → ikut dikirim agar kode server sama dengan pratinjau. */
function assets() {
  const { fonts, baseFontId } = useFontStore.getState();
  // v7: variabel global ikut dikirim (font pustaka jadi variabel di server dari `fonts`).
  // v9: + nilai bawaan Animasi & 3D (--owd-anim-*, --owd-3d-*); server hanya menulisnya bila dipakai.
  const vars = [...useVarStore.getState().vars, ...currentMotionVars()].map(({ name, type, value }) => ({ name, type, value }));
  return { icons: useIconStore.getState().icons, fonts, vars, ...(baseFontId ? { baseFontId } : {}) };
}

/**
 * Minta server membuat kode. "blocked" = kuota gratis habis dan `pay` belum
 * disetujui (tidak ada yang dicatat, tidak ada berkas). Error lain dilempar
 * sebagai ApiError: 401 belum masuk · 402 PREMIUM_ITEMS_LOCKED { items } ·
 * 402 INSUFFICIENT_CREDITS · 404 DESIGN_NOT_SYNCED.
 */
export async function serverExport(
  source: ServerExportSource,
  framework: string,
  lang: "id" | "en",
  pay = false,
): Promise<{ result: ExportRecordResult; quota: ExportQuotaInfo; files: ExportedFile[] }> {
  try {
    const r = await api<ServerExport>("/exports", {
      body: { kind: source.kind, id: source.id, framework, lang, pay, ...(source.rootClass ? { rootClass: source.rootClass } : {}), ...assets() },
    });
    const quota = { used: r.used, free: r.free, remaining: r.remaining, cost: r.cost };
    patchLimits({ exports: quota });
    // Ekspor berbayar: server mengirim saldo terbaru.
    const billing = r.account ? useBilling.getState().setAccountFromServer(r.account) : null;
    if (billing) useMarketStore.setState((s) => ({ account: { ...s.account, balance: billing.balance } }));
    return { result: r.result, quota, files: Array.isArray(r.files) ? r.files : [] };
  } catch (e) {
    if (e instanceof ApiError && e.code === "EXPORT_QUOTA_EXCEEDED") {
      const cur = useMarketStore.getState().account.limits.exports;
      const cost = typeof e.body.cost === "number" ? e.body.cost : cur.cost;
      const quota = { ...cur, remaining: 0, cost };
      patchLimits({ exports: quota });
      return { result: "blocked", quota, files: [] };
    }
    throw e;
  }
}
