// ─── auth/adminFree.ts ───────────────────────────────────────────────────────
// v6: mode "Admin: tanpa kredit". Nilainya HANYA dari profil sesi yang dikirim
// backend (`GET /auth/me` → adminFree), yang dihitung server dari peran di
// database + klaim 2FA token. Frontend memakai flag ini untuk TAMPILAN saja
// (badge, tanpa peringatan kredit, item tampil terbuka); pemotongan kredit
// yang sebenarnya selalu diputuskan backend.
//
// Modul ini sengaja tanpa dependensi (bukan store React) agar bisa dipakai
// fungsi murni seperti `planCharge` tanpa impor melingkar.

let current = { adminFree: false, pendingMfa: false };
const listeners = new Set<() => void>();

export function setAdminFree(adminFree: boolean, pendingMfa = false) {
  if (current.adminFree === adminFree && current.pendingMfa === pendingMfa) return;
  current = { adminFree, pendingMfa };
  listeners.forEach((cb) => cb());
}

/** true = sesi admin tervalidasi; semua fitur tanpa kredit. */
export const isAdminFree = () => current.adminFree;
/** true = akun admin, tetapi sesi belum lolos 2FA (mode belum aktif). */
export const isAdminFreePendingMfa = () => current.pendingMfa;

export function subscribeAdminFree(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
