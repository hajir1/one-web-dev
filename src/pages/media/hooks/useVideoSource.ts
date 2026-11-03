import { useCallback, useEffect, useRef, useState } from "react";
import i18n from "../../../i18n";
import { loadVideoMeta, type VideoMeta } from "../lib/video";
import type { AcceptedFile } from "../lib/validate";

export interface VideoSource {
  file: File;
  url: string;
  meta: VideoMeta;
}

/**
 * Satu video sumber: muat metadata (durasi, ukuran) dengan penanganan codec
 * tidak didukung, durasi Infinity, dan timeout. URL dicabut saat diganti
 * atau halaman ditinggalkan.
 *
 * `requireVideoTrack: false` → file audio-saja / video tanpa gambar tetap
 * diterima (untuk Ekstrak Audio).
 */
export function useVideoSource({ requireVideoTrack = true }: { requireVideoTrack?: boolean } = {}) {
  const [video, setVideo] = useState<VideoSource | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const current = useRef<VideoSource | null>(null);
  const token = useRef(0);
  current.current = video;

  useEffect(
    () => () => {
      token.current++;
      if (current.current) URL.revokeObjectURL(current.current.url);
    },
    [],
  );

  const clear = useCallback(() => {
    token.current++;
    if (current.current) URL.revokeObjectURL(current.current.url);
    setVideo(null);
    setError(null);
    setNotice(null);
    setLoading(false);
  }, []);

  const load = useCallback(
    async ([f]: AcceptedFile[]) => {
      clear();
      const my = ++token.current;
      setLoading(true);
      const url = URL.createObjectURL(f.file);
      const el = document.createElement("video");
      try {
        let meta: VideoMeta;
        try {
          meta = await loadVideoMeta(el, url);
        } catch (e) {
          // Tanpa trek video (mis. audio saja): metadata durasi masih bisa dibaca.
          if (!requireVideoTrack && Number.isFinite(el.duration) && el.duration > 0) meta = { duration: el.duration, width: 0, height: 0, durationFixed: false };
          else throw e;
        }
        if (my !== token.current) return URL.revokeObjectURL(url);
        setVideo({ file: f.file, url, meta });
        if (meta.durationFixed) setNotice(i18n.t("media.video.durationFixed"));
      } catch (e) {
        URL.revokeObjectURL(url);
        if (my === token.current) setError(e instanceof Error ? e.message : i18n.t("media.video.loadFailed"));
      } finally {
        el.removeAttribute("src");
        el.load();
        if (my === token.current) setLoading(false);
      }
    },
    [clear, requireVideoTrack],
  );

  return { video, loading, error, notice, load, clear, clearError: () => setError(null), clearNotice: () => setNotice(null) };
}
