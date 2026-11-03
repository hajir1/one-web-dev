import { useSession } from "../../../../auth/session";
import { isDemoMode } from "../../../../demo/demoMode";

/**
 * Tempat perubahan tersimpan (v20), untuk label yang jujur di editor:
 *   "account" = masuk → disinkronkan ke akun (designSync.ts), ikut ke perangkat lain;
 *   "device"  = belum masuk → hanya di browser ini (diunggah saat masuk);
 *   "demo"    = mode demo tanpa server → hanya di browser ini.
 */
export type SaveTarget = "account" | "device" | "demo";

export function useSaveTarget(): SaveTarget {
  const status = useSession((s) => s.status);
  if (isDemoMode()) return "demo";
  return status === "authenticated" ? "account" : "device";
}
