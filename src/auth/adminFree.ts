// ─── auth/adminFree.ts ───────────────────────────────────────────────────────
// v6: "Admin: no credits" mode. Its value comes ONLY from the session profile sent
// by the backend (`GET /auth/me` → adminFree), which the server computes from the role in
// the database + the token's 2FA claim. The frontend uses this flag for DISPLAY only
// (badge, no credit warnings, items shown unlocked); credit charging
// which is always decided by the backend in the end.
//
// This module deliberately has no dependencies (not a React store) so it can be used
// by pure functions such as `planCharge` without circular imports.

let current = { adminFree: false, pendingMfa: false };
const listeners = new Set<() => void>();

export function setAdminFree(adminFree: boolean, pendingMfa = false) {
  if (current.adminFree === adminFree && current.pendingMfa === pendingMfa) return;
  current = { adminFree, pendingMfa };
  listeners.forEach((cb) => cb());
}

/** true = validated admin session; every feature without credits. */
export const isAdminFree = () => current.adminFree;
/** true = admin account, but the session has not passed 2FA yet (mode not active). */
export const isAdminFreePendingMfa = () => current.pendingMfa;

export function subscribeAdminFree(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
