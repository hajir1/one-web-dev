import { useEffect, useState } from "react";

export type FontStatus = "loading" | "ready" | "failed";

const clean = (family: string) => family.replace(/^["']|["']$/g, "").trim();

/**
 * Whether the font `name` really loaded (e.g. a wrong Google Fonts name or an
 * unreachable URL → "failed"). @font-face from an imported stylesheet only
 * appears after its CSS finishes downloading, so it is checked periodically (max. ~10 seconds).
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
