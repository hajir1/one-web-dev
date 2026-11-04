import { useEffect, useMemo, useRef, useState } from "react";
import { buildTourHtml, runtimeTour } from "../exportTour";
import type { Tour } from "../model";

/**
 * A-Frame preview in a sandboxed iframe. Its runtime is exactly the same as the
 * export; tour data & files (Blobs) are sent through postMessage, and the iframe creates
 * its own blob URLs.
 *   "edit" mode: click the panorama → onPlace(yaw, pitch); click a hotspot → onPick(id)
 *   "view" mode: behaves like the export (switch scenes, open panels)
 */
export default function TourPreview({
  tour,
  media,
  sceneId,
  mode,
  lang,
  title,
  onPlace,
  onPick,
}: {
  tour: Tour;
  media: Record<string, Blob>;
  sceneId: string;
  mode: "edit" | "view";
  lang: string;
  title: string;
  onPlace?: (yaw: number, pitch: number) => void;
  onPick?: (id: string) => void;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(0);
  const cb = useRef({ onPlace, onPick });
  useEffect(() => {
    cb.current = { onPlace, onPick };
  }, [onPlace, onPick]);
  // srcDoc stays fixed (it does not change) so A-Frame is not reloaded on every edit.
  const srcDoc = useMemo(() => buildTourHtml({ title: "Tur 360°", lang }), [lang]);

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const m = e.data as { type?: string; yaw?: number; pitch?: number; id?: string };
      if (!m || typeof m !== "object") return;
      if (m.type === "vr:ready") setReady((n) => n + 1);
      else if (m.type === "vr:place" && typeof m.yaw === "number" && typeof m.pitch === "number") cb.current.onPlace?.(m.yaw, m.pitch);
      else if (m.type === "vr:pick" && typeof m.id === "string") cb.current.onPick?.(m.id);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  useEffect(() => {
    if (!ready) return;
    ref.current?.contentWindow?.postMessage({ type: "vr:load", tour: runtimeTour(tour), media, mode, sceneId }, "*");
  }, [ready, tour, media, mode, sceneId]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={srcDoc}
      sandbox="allow-scripts"
      allow="xr-spatial-tracking; fullscreen; accelerometer; gyroscope"
      className="block h-full w-full border-0 bg-black"
      data-testid="vr-preview"
    />
  );
}
