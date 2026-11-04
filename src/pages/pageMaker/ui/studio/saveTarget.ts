import { useSession } from "../../../../auth/session";
import { isDemoMode } from "../../../../demo/demoMode";

/**
 * Where changes are saved (v20), for an honest label in the editor:
 *   "account" = signed in → synced to the account (designSync.ts), available on other devices;
 *   "device"  = not signed in → only in this browser (uploaded on sign-in);
 *   "demo"    = demo mode without a server → only in this browser.
 */
export type SaveTarget = "account" | "device" | "demo";

export function useSaveTarget(): SaveTarget {
  const status = useSession((s) => s.status);
  if (isDemoMode()) return "demo";
  return status === "authenticated" ? "account" : "device";
}
