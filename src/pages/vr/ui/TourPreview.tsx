import { useEffect, useMemo, useRef, useState } from "react";
import { buildTourHtml, runtimeTour } from "../exportTour";
import type { Tour } from "../model";

/**
 * Pratinjau A-Frame di iframe sandbox. Runtime-nya sama persis dengan hasil
 * ekspor; data tur & berkas (Blob) dikirim lewat postMessage, iframe membuat
 * URL blob-nya sendiri.
 *   mode "edit": klik panorama → onPlace(yaw, pitch); klik hotspot → onPick(id)
 *   mode "view": perilaku seperti hasil ekspor (pindah scene, buka panel)
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
  // srcDoc tetap (tidak ikut berubah) supaya A-Frame tidak dimuat ulang tiap edit.
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
