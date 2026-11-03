/* ================================================================== */
/* ATURAN KUOTA TERPUSAT (Web Maker)                                    */
/*                                                                    */
/* - Desain halaman Page Maker: MAKSIMAL 10 tersimpan (semua desain,     */
/*   termasuk hasil modifikasi template). Bila penuh, pengguna harus     */
/*   menghapus desain lama — aplikasi TIDAK menghapus otomatis.         */
/* - Folder website: 2 gratis; berikutnya memakai kredit (site-slot).   */
/* - Ekspor kode: 20 ekspor berhasil gratis (lihat credits/downloadQuota).*/
/*                                                                    */
/* Catatan keamanan: kuota di frontend hanya untuk UX. Penegakan yang    */
/* sebenarnya harus dilakukan backend per akun.                          */
/* ================================================================== */

export const MAX_DESIGNS = 10;
export const FREE_SITES = 2;
export const FREE_EXPORTS = 20;

export interface CapacityCheck {
  ok: boolean;
  /** Jumlah saat ini. */
  current: number;
  /** Jumlah yang akan ditambahkan. */
  adding: number;
  max: number;
  /** Sisa slot sebelum penambahan. */
  free: number;
  /** Berapa yang harus dihapus agar penambahan muat (0 bila ok). */
  mustDelete: number;
}

/** Cek apakah `adding` desain baru masih muat di batas MAX_DESIGNS. */
export function designCapacity(current: number, adding = 1, max = MAX_DESIGNS): CapacityCheck {
  const cur = Math.max(0, Math.floor(current));
  const add = Math.max(0, Math.floor(adding));
  const free = Math.max(0, max - cur);
  const mustDelete = Math.max(0, cur + add - max);
  return { ok: mustDelete === 0, current: cur, adding: add, max, free, mustDelete };
}

/** Folder website gratis masih tersedia? */
export const canCreateFreeSite = (currentSites: number, extraSlots = 0) => currentSites < FREE_SITES + Math.max(0, extraSlots);
