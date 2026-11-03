// ─── demo/demoMode.ts ────────────────────────────────────────────────────────
// MODE DEMO (v12) = frontend dijalankan tanpa backend (`VITE_API_BASE_URL=off`).
// Dipakai untuk demonstrasi ke pengguna baru: tidak ada akun, kredit, paket,
// atau pembelian. Aturan mode ini:
//   - menu & halaman Kredit, Paket, Akun, Riwayat pekerjaan, Tim, Admin,
//     masuk/daftar, Toko, dan /dokumentasi disembunyikan (rute diarahkan ke Dashboard);
//   - semua template katalog dibundel di frontend (lihat demoTemplateIds.ts);
//   - v15: folder website, desain halaman, dan Tur 360° (tur, scene, hotspot)
//     tanpa batas (marketplace/hooks.ts, pages/vr/model.ts `vrCap`);
//   - semua section, elemen, event, dan fitur Premium terbuka, tanpa label
//     "gratis"/Premium/kredit (teks di demoLocale.ts dan `demo.*` locale);
//   - Dashboard menampilkan banner promosi, bukan daftar menu;
//   - hanya alat yang berjalan di browser; alat/mode server (berbayar) disembunyikan.
// Tidak ada variabel env baru: mode ini aktif bila backend tidak dikonfigurasi.

import { isBackendConfigured } from "../pages/media/processing/apiConfig";

/** true = aplikasi berjalan sebagai demo frontend-only. */
export const isDemoMode = (): boolean => !isBackendConfigured();

/**
 * Rute (tanpa prefix bahasa) yang tidak ada di mode demo. Halaman akun,
 * pembayaran, dan alat yang hanya berjalan di server (berbayar).
 */
export const DEMO_HIDDEN_PATHS: readonly string[] = [
  "/credits",
  "/plans",
  "/account",
  "/profile",
  "/job-history",
  "/team",
  "/admin",
  "/web-market",
  "/data-tools/server-convert",
  "/media-tools/video-to-gif",
  "/media-tools/video-compress",
  "/media-tools/kredit",
  "/signin",
  "/signup",
  "/verify-email",
  "/forgot-password",
  "/reset-password",
  "/invoice",
  // v15: panduan lengkap lama penuh aturan kredit & Premium; /docs tetap ada.
  "/dokumentasi",
];

/** Apakah `path` (tanpa prefix bahasa) disembunyikan di mode demo. */
export function isDemoHiddenPath(path: string): boolean {
  return DEMO_HIDDEN_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}
