// ─── auth/session.ts ─────────────────────────────────────────────────────────
// Login session from the Nest backend. Tokens live in httpOnly cookies (not
// readable by JavaScript); the frontend only keeps the PROFILE in memory. Login
// status is always rechecked with GET /auth/me when the app opens.

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
  /** The terms version in effect on the server. */
  termsVersion?: string;
  /** The user has accepted the current version (required before purchasing). */
  termsAccepted?: boolean;
  mfaEnabled?: boolean;
  /** v6: admin with a validated session → every feature without credits (computed by the server). */
  adminFree?: boolean;
  /** v6: admin, but the session has not passed 2FA (no-credit mode not active yet). */
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
/** Called when the user changes (sign in/out): other stores reload their data. */
export const onUserChange = (cb: (u: SessionUser | null) => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

function setUser(user: SessionUser | null) {
  const before = useSession.getState().user;
  const prev = before?.id ?? null;
  setAdminFree(user?.adminFree === true, user?.adminFreePendingMfa === true);
  useSession.setState({ user, status: user ? "authenticated" : "anonymous" });
  // Account switched, or admin no-credit mode changed (e.g. after 2FA) → other stores reload.
  if ((user?.id ?? null) !== prev || !!user?.adminFree !== !!before?.adminFree) listeners.forEach((cb) => cb(user));
}

onSessionExpired(() => setUser(null));

let loading: Promise<SessionUser | null> | null = null;
/** Load the profile (once; parallel calls are merged). */
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
      // 401 = not signed in; 403 EMAIL_NOT_VERIFIED/ACCOUNT_SUSPENDED = session not valid.
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

/** Sign-up / resend response: always the same (the backend does not leak registered emails). */
export interface VerificationPending {
  status: "verification_pending";
  email: string;
  resendCooldownSeconds: number;
}


/**
 * Sign up with email + password. The new account CANNOT be used yet: the backend sends
 * a verification link by email, and the user signs in after clicking it.
 */
export async function signUp(email: string, password: string, name?: string, lang = currentLang(), referralCode?: string | null): Promise<VerificationPending> {
  return api<VerificationPending>("/auth/register", {
    body: { email, password, lang, acceptTerms: true, ...(name ? { name } : {}), ...(referralCode ? { referralCode } : {}) },
  });
}

/** Resend the verification link (generic response). */
export async function resendVerification(email: string, lang = currentLang()): Promise<VerificationPending> {
  return api<VerificationPending>("/auth/verify-email/resend", { body: { email, lang } });
}

/** Clicking the verification link → account activated and signed in. */
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
 * Google login URL on the backend; when done the backend redirects back to `redirect`.
 * `accept` = the user ticked the terms consent (new accounts are recorded as agreeing).
 */
export const googleSignInUrl = (redirect: string, accept = false, referralCode?: string | null) =>
  apiUrl(`/auth/google?redirect=${encodeURIComponent(redirect)}${accept ? "&accept=1" : ""}${referralCode ? `&ref=${encodeURIComponent(referralCode)}` : ""}`);

// ─── v4: Terms, forgot password, delete account, data download, 2FA ───────────────────────

/** Accept the current Terms + Privacy Policy version. */
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

/** Permanently delete the account (personal data is anonymized). `confirm` = "HAPUS"/"DELETE". */
export async function deleteAccount(confirm: string, password?: string): Promise<void> {
  await api("/auth/me", { method: "DELETE", body: { confirm, ...(password ? { password } : {}) } });
  setUser(null);
}

/** Download a copy of personal data (JSON) as a file. */
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
/** Verify 2FA for this session, then reload the profile (admin no-credit mode may activate). */
export async function mfaVerify(code: string) {
  await api("/auth/2fa/verify", { body: { code } });
  await loadSession(true);
}
export async function mfaDisable(code: string) {
  await api("/auth/2fa/disable", { body: { code } });
  await loadSession(true);
}

export const isAdmin = (u: SessionUser | null | undefined) => u?.role === "ADMIN";
