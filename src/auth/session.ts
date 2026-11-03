// ─── auth/session.ts ─────────────────────────────────────────────────────────
// Sesi login dari backend Nest. Token ada di cookie httpOnly (tidak bisa
// dibaca JavaScript); frontend hanya menyimpan PROFIL di memori. Status
// login selalu dicek ulang ke GET /auth/me saat aplikasi dibuka.

import { create } from "zustand";
import { api, ApiError, apiUrl, onSessionExpired } from "../api/client";
import { isBackendConfigured } from "../pages/media/processing/apiConfig";
import { currentLang } from "../i18n";
import { setAdminFree } from "./adminFree";

export interface SessionUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: "USER" | "ADMIN";
  emailVerified: boolean;
  verificationStatus?: "verified" | "unverified";
  referralCode?: string | null;
  hasPassword: boolean;
  providers: string[];
  /** Versi S&K yang berlaku di server. */
  termsVersion?: string;
  /** User sudah menyetujui versi yang berlaku (wajib sebelum membeli). */
  termsAccepted?: boolean;
  mfaEnabled?: boolean;
  /** v6: admin dengan sesi tervalidasi → semua fitur tanpa kredit (dihitung server). */
  adminFree?: boolean;
  /** v6: admin, tetapi sesi belum lolos 2FA (mode tanpa kredit belum aktif). */
  adminFreePendingMfa?: boolean;
}

export interface AuthMethods {
  password: boolean;
  google: boolean;
}

type Status = "idle" | "loading" | "authenticated" | "anonymous" | "unavailable";

interface SessionState {
  status: Status;
  user: SessionUser | null;
  methods: AuthMethods | null;
}

export const useSession = create<SessionState>(() => ({ status: "idle", user: null, methods: null }));

const listeners = new Set<(u: SessionUser | null) => void>();
/** Dipanggil saat user berganti (masuk/keluar) — store lain memuat ulang datanya. */
export const onUserChange = (cb: (u: SessionUser | null) => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function setUser(user: SessionUser | null) {
  const before = useSession.getState().user;
  const prev = before?.id ?? null;
  setAdminFree(user?.adminFree === true, user?.adminFreePendingMfa === true);
  useSession.setState({ user, status: user ? "authenticated" : "anonymous" });
  // Ganti akun, atau mode admin tanpa kredit berubah (mis. setelah 2FA) → store lain memuat ulang.
  if ((user?.id ?? null) !== prev || !!user?.adminFree !== !!before?.adminFree) listeners.forEach((cb) => cb(user));
}

onSessionExpired(() => setUser(null));

let loading: Promise<SessionUser | null> | null = null;
/** Muat profil (sekali; panggilan paralel digabung). */
export function loadSession(force = false): Promise<SessionUser | null> {
  if (!isBackendConfigured()) {
    useSession.setState({ status: "unavailable", user: null });
    return Promise.resolve(null);
  }
  const s = useSession.getState();
  if (!force && (s.status === "authenticated" || s.status === "anonymous")) return Promise.resolve(s.user);
  loading ??= (async () => {
    useSession.setState({ status: "loading" });
    try {
      const user = await api<SessionUser>("/auth/me");
      setUser(user);
      return user;
    } catch (e) {
      // 401 = belum masuk; 403 EMAIL_NOT_VERIFIED/ACCOUNT_SUSPENDED = sesi tidak berlaku.
      if (e instanceof ApiError && (e.status === 401 || e.status === 403)) setUser(null);
      else useSession.setState({ status: "unavailable", user: null });
      return null;
    } finally {
      loading = null;
    }
  })();
  return loading;
}

export async function loadAuthMethods(): Promise<AuthMethods> {
  const cur = useSession.getState().methods;
  if (cur) return cur;
  const m = await api<AuthMethods>("/auth/methods").catch(() => ({ password: true, google: false }));
  useSession.setState({ methods: m });
  return m;
}

export async function signIn(email: string, password: string): Promise<SessionUser> {
  const r = await api<{ user: SessionUser }>("/auth/login", { body: { email, password } });
  setUser(r.user);
  return r.user;
}

/** Balasan daftar / kirim ulang: selalu sama (backend tidak membocorkan email terdaftar). */
export interface VerificationPending {
  status: "verification_pending";
  email: string;
  resendCooldownSeconds: number;
}


/**
 * Daftar email + sandi. Akun baru BELUM bisa dipakai: backend mengirim
 * tautan verifikasi ke email, user baru masuk setelah tautan diklik.
 */
export async function signUp(email: string, password: string, name?: string, lang = currentLang(), referralCode?: string | null): Promise<VerificationPending> {
  return api<VerificationPending>("/auth/register", {
    body: { email, password, lang, acceptTerms: true, ...(name ? { name } : {}), ...(referralCode ? { referralCode } : {}) },
  });
}

/** Kirim ulang tautan verifikasi (respons generik). */
export async function resendVerification(email: string, lang = currentLang()): Promise<VerificationPending> {
  return api<VerificationPending>("/auth/verify-email/resend", { body: { email, lang } });
}

/** Klik tautan verifikasi → akun aktif dan langsung masuk. */
export async function verifyEmail(token: string): Promise<SessionUser> {
  const r = await api<{ user: SessionUser }>("/auth/verify-email", { body: { token } });
  setUser(r.user);
  return r.user;
}

export async function signOut(): Promise<void> {
  await api("/auth/logout", { method: "POST" }).catch(() => {});
  setUser(null);
}

export async function changePassword(currentPassword: string | undefined, newPassword: string): Promise<void> {
  await api("/auth/password", { body: { ...(currentPassword ? { currentPassword } : {}), newPassword } });
}

/**
 * URL login Google di backend; setelah selesai backend mengarahkan kembali ke `redirect`.
 * `accept` = user mencentang persetujuan S&K (akun baru tercatat setuju).
 */
export const googleSignInUrl = (redirect: string, accept = false, referralCode?: string | null) =>
  apiUrl(`/auth/google?redirect=${encodeURIComponent(redirect)}${accept ? "&accept=1" : ""}${referralCode ? `&ref=${encodeURIComponent(referralCode)}` : ""}`);

// ─── v4: S&K, lupa sandi, hapus akun, unduh data, 2FA ───────────────────────

/** Setujui versi S&K + Kebijakan Privasi yang berlaku. */
export async function acceptTerms(version: string): Promise<void> {
  await api("/auth/terms/accept", { body: { version } });
  await loadSession(true);
}

export async function forgotPassword(email: string, lang = currentLang()): Promise<void> {
  await api("/auth/password/forgot", { body: { email, lang } });
}

export async function resetPassword(token: string, newPassword: string): Promise<void> {
  await api("/auth/password/reset", { body: { token, newPassword } });
  setUser(null);
}

/** Hapus akun permanen (data pribadi dianonimkan). `confirm` = "HAPUS"/"DELETE". */
export async function deleteAccount(confirm: string, password?: string): Promise<void> {
  await api("/auth/me", { method: "DELETE", body: { confirm, ...(password ? { password } : {}) } });
  setUser(null);
}

/** Unduh salinan data pribadi (JSON) sebagai berkas. */
export async function downloadMyData(): Promise<void> {
  const data = await api<Record<string, unknown>>("/auth/me/export");
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `onewebdev-data-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export interface MfaStatus {
  enabled: boolean;
  enabledAt: string | null;
  requiredForAdmin: boolean;
  sessionVerified: boolean;
}
export const mfaStatus = () => api<MfaStatus>("/auth/2fa");
export const mfaSetup = () => api<{ secret: string; otpauthUrl: string }>("/auth/2fa/setup", { method: "POST" });
export const mfaEnable = (code: string) => api("/auth/2fa/enable", { body: { code } });
/** Verifikasi 2FA sesi ini, lalu muat ulang profil (mode admin tanpa kredit bisa aktif). */
export async function mfaVerify(code: string) {
  await api("/auth/2fa/verify", { body: { code } });
  await loadSession(true);
}
export async function mfaDisable(code: string) {
  await api("/auth/2fa/disable", { body: { code } });
  await loadSession(true);
}

export const isAdmin = (u: SessionUser | null | undefined) => u?.role === "ADMIN";
