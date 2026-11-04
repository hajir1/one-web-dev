// ─── demo/demoMode.ts ────────────────────────────────────────────────────────
// DEMO MODE (v12) = the frontend runs without a backend (`VITE_API_BASE_URL=off`).
// Used to demonstrate the app to new users: no accounts, credits, plans,
// or purchases. Rules of this mode:
//   - Credits, Packs, Account, Job history, Team, Admin menus & pages,
//     sign-in/sign-up, Store, and /dokumentasi are hidden (routes redirect to the Dashboard);
//   - every catalog template is bundled in the frontend (see demoTemplateIds.ts);
//   - v15: website folders, page designs, and 360° Tours (tours, scenes, hotspots)
//     unlimited (marketplace/hooks.ts, pages/vr/model.ts `vrCap`);
//   - every Premium section, element, event, and feature is unlocked, without
//     "free"/Premium/credit labels (text in demoLocale.ts and the `demo.*` locale keys);
//   - the Dashboard shows a promo banner instead of the menu list;
//   - only tools that run in the browser; server (paid) tools/modes are hidden.
// No new env variable: this mode is active when no backend is configured.

import { isBackendConfigured } from "../pages/media/processing/apiConfig";

/** true = the app runs as a frontend-only demo. */
export const isDemoMode = (): boolean => !isBackendConfigured();

/**
 * Routes (without the language prefix) that do not exist in demo mode. Account,
 * payment, and server-only (paid) tool pages.
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
  // v15: the old full guide is full of credit & Premium rules; /docs still exists.
  "/dokumentasi",
];

/** Whether `path` (without the language prefix) is hidden in demo mode. */
export function isDemoHiddenPath(path: string): boolean {
  return DEMO_HIDDEN_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}
