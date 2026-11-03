import { useEffect, useState } from "react";

export type FontStatus = "loading" | "ready" | "failed";

const clean = (family: string) => family.replace(/^["']|["']$/g, "").trim();

/**
 * Apakah font `name` benar-benar termuat (mis. nama Google Fonts salah atau
 * URL tidak bisa dibuka → "failed"). @font-face dari stylesheet impor baru
 * muncul setelah CSS-nya selesai diunduh, jadi dicek berkala (maks. ~10 detik).
 */
export function useFontStatus(name: string, version: string): FontStatus {
  const [status, setStatus] = useState<FontStatus>("loading");

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    const started = Date.now();

    const tick = async () => {
      if (cancelled) return;
      let found = false;
      document.fonts.forEach((ff) => {
        if (clean(ff.family) === name) found = true;
      });
      if (found) {
        try {
          const loaded = await document.fonts.load(`16px "${name}"`, "Aa");
          if (!cancelled) setStatus(loaded.length ? "ready" : "failed");
        } catch {
          if (!cancelled) setStatus("failed");
        }
        return;
      }
      if (Date.now() - started > 10_000) {
        if (!cancelled) setStatus("failed");
        return;
      }
      window.setTimeout(tick, 400);
    };
    const t = window.setTimeout(tick, 150);
    return () => {
      cancelled = true;
      window.clearTimeout(t);
    };
  }, [name, version]);

  return status;
}
