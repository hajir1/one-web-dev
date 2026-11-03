// ─── auth/referralCapture.ts ─────────────────────────────────────────────────
// Kode referral dari tautan undangan (?ref=KODE). Kode disimpan di perangkat
// (30 hari) agar tetap terisi di formulir daftar walaupun pengunjung sempat
// membuka halaman lain dulu. Kode hanya saran: server yang memvalidasi.

const KEY = "owd.referral";
const TTL_MS = 30 * 86400_000;

/** Huruf besar, tanpa spasi/tanda hubung. null = format tidak mungkin valid. */
export function normalizeReferralInput(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const v = raw.trim().toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z0-9]{4,32}$/.test(v) ? v : null;
}

type Store = Pick<Storage, "getItem" | "setItem" | "removeItem">;
const storage = (): Store | null => {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
};

export function storeReferral(code: string, now = Date.now(), s: Store | null = storage()) {
  const c = normalizeReferralInput(code);
  if (!c || !s) return;
  try {
    s.setItem(KEY, JSON.stringify({ code: c, at: now }));
  } catch {
    /* penyimpanan penuh/diblokir: abaikan */
  }
}

export function getStoredReferral(now = Date.now(), s: Store | null = storage()): string | null {
  if (!s) return null;
  try {
    const v = JSON.parse(s.getItem(KEY) || "null") as { code?: unknown; at?: unknown } | null;
    const code = normalizeReferralInput(v?.code);
    if (!code || typeof v?.at !== "number" || now - v.at > TTL_MS) return null;
    return code;
  } catch {
    return null;
  }
}

export function clearStoredReferral(s: Store | null = storage()) {
  try {
    s?.removeItem(KEY);
  } catch {
    /* abaikan */
  }
}

/**
 * Dipanggil sekali saat aplikasi dibuka: ambil ?ref= dari URL, simpan, lalu
 * hapus dari alamat (tautan yang disalin ulang tidak membawa kode orang lain).
 * Di halaman daftar parameter dibiarkan agar formulir bisa membacanya.
 */
export function captureReferralFromUrl() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  const code = normalizeReferralInput(url.searchParams.get("ref"));
  if (!code) return;
  storeReferral(code);
  if (/\/signup\/?$/.test(url.pathname)) return;
  url.searchParams.delete("ref");
  window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
}
