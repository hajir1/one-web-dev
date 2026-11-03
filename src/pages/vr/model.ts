import { isDemoMode } from "../../demo/demoMode";

/* ================================================================== */
/* Tur 360° (menu VR) — model data                                      */
/*                                                                    */
/* Tur = beberapa scene panorama equirectangular (2:1). Tiap scene      */
/* punya hotspot di koordinat yaw/pitch (derajat):                       */
/*   yaw   0 = depan (-Z), positif = ke kiri; rentang -180..180          */
/*   pitch 0 = horizon, positif = ke atas; rentang -85..85              */
/* Berkas gambar/audio disimpan terpisah (IndexedDB, lihat storage.ts),  */
/* model hanya menyimpan id media-nya.                                  */
/* ================================================================== */

export type HotspotKind = "scene" | "info" | "image" | "audio";

export interface Hotspot {
  id: string;
  kind: HotspotKind;
  yaw: number;
  pitch: number;
  /** Teks tooltip / judul panel. */
  label: string;
  /** kind "scene": scene tujuan. */
  targetSceneId?: string;
  /** kind "info": isi teks. */
  text?: string;
  /** kind "image" | "audio": id media. */
  mediaId?: string;
}

export interface TourScene {
  id: string;
  name: string;
  /** id media panorama (null = belum diunggah). */
  panoramaId: string | null;
  hotspots: Hotspot[];
}

export interface Tour {
  id: string;
  name: string;
  startSceneId: string;
  scenes: TourScene[];
  /** Putar perlahan sampai pengunjung menyentuh layar. */
  autoRotate: boolean;
  /** Warna titik hotspot. */
  accent: string;
  createdAt: number;
  updatedAt: number;
}

export interface MediaMeta {
  id: string;
  name: string;
  type: string;
  size: number;
}

/** Mode demo (v15): jumlah tur, scene, dan hotspot tanpa batas. */
export const vrCap = (n: number): number => (isDemoMode() ? Infinity : n);

/** Batas paket: Gratis vs Tur 360° Pro (sekali buka per akun). */
export const VR_LIMITS = {
  freeScenes: 3,
  proScenes: 30,
  hotspotsPerScene: 40,
  maxTours: 20,
  panoramaBytes: 25 * 1024 * 1024,
  imageBytes: 8 * 1024 * 1024,
  audioBytes: 10 * 1024 * 1024,
} as const;

export const HOTSPOT_KINDS: HotspotKind[] = ["scene", "info", "image", "audio"];
/** Jenis hotspot yang butuh Tur 360° Pro. */
export const PRO_HOTSPOT_KINDS: HotspotKind[] = ["image", "audio"];

let seq = 0;
export const uid = (p: string) => `${p}-${Date.now().toString(36)}${(seq++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : 0));
const round1 = (n: number) => Math.round(n * 10) / 10;
/** Normalisasi yaw ke -180..180. */
export const normYaw = (y: number) => round1(((((Number.isFinite(y) ? y : 0) + 180) % 360) + 360) % 360 - 180);
export const clampPitch = (p: number) => round1(clamp(p, -85, 85));
const text = (v: unknown, max: number, d = "") => (typeof v === "string" ? v.slice(0, max) : d);
const HEX = /^#[0-9a-f]{6}$/i;

export function createScene(name: string): TourScene {
  return { id: uid("scene"), name: name.slice(0, 60), panoramaId: null, hotspots: [] };
}

export function createTour(name: string, now = Date.now()): Tour {
  const first = createScene("Scene 1");
  return { id: uid("tour"), name: name.slice(0, 80) || "Tur 360°", startSceneId: first.id, scenes: [first], autoRotate: false, accent: "#2563eb", createdAt: now, updatedAt: now };
}

export function createHotspot(kind: HotspotKind, yaw: number, pitch: number, label: string): Hotspot {
  return { id: uid("hs"), kind, yaw: normYaw(yaw), pitch: clampPitch(pitch), label: label.slice(0, 80) };
}

/** Bersihkan data tersimpan / impor (nilai asing → aman, referensi rusak dibuang). */
export function sanitizeTour(v: unknown): Tour | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const rawScenes = Array.isArray(o.scenes) ? o.scenes.slice(0, vrCap(VR_LIMITS.proScenes)) : [];
  const objs = rawScenes.filter((s): s is Record<string, unknown> => !!s && typeof s === "object" && typeof (s as Record<string, unknown>).id === "string");
  const scenes: TourScene[] = objs.map((s) => ({
    id: text(s.id, 80),
    name: text(s.name, 60, "Scene"),
    panoramaId: typeof s.panoramaId === "string" ? s.panoramaId.slice(0, 80) : null,
    hotspots: [],
  }));
  if (!scenes.length) return null;
  const ids = new Set(scenes.map((s) => s.id));
  scenes.forEach((s, i) => {
    const raw = Array.isArray(objs[i].hotspots) ? (objs[i].hotspots as unknown[]).slice(0, vrCap(VR_LIMITS.hotspotsPerScene)) : [];
    s.hotspots = raw
      .filter((h): h is Record<string, unknown> => !!h && typeof h === "object")
      .map((h) => {
        const kind = HOTSPOT_KINDS.includes(h.kind as HotspotKind) ? (h.kind as HotspotKind) : "info";
        const out: Hotspot = { id: text(h.id, 80) || uid("hs"), kind, yaw: normYaw(Number(h.yaw)), pitch: clampPitch(Number(h.pitch)), label: text(h.label, 80) };
        if (kind === "scene") out.targetSceneId = typeof h.targetSceneId === "string" && ids.has(h.targetSceneId) ? h.targetSceneId : undefined;
        if (kind === "info") out.text = text(h.text, 1000);
        if (kind === "image" || kind === "audio") out.mediaId = typeof h.mediaId === "string" ? h.mediaId.slice(0, 80) : undefined;
        return out;
      });
  });
  const start = typeof o.startSceneId === "string" && ids.has(o.startSceneId) ? o.startSceneId : scenes[0].id;
  return {
    id: text(o.id, 80) || uid("tour"),
    name: text(o.name, 80, "Tur 360°") || "Tur 360°",
    startSceneId: start,
    scenes,
    autoRotate: o.autoRotate === true,
    accent: typeof o.accent === "string" && HEX.test(o.accent) ? o.accent : "#2563eb",
    createdAt: Number(o.createdAt) || Date.now(),
    updatedAt: Number(o.updatedAt) || Date.now(),
  };
}

/** Fitur Pro yang dipakai tur ini (kosong = cukup paket Gratis). */
export function proFeaturesUsed(tour: Tour): ("scenes" | "image" | "audio")[] {
  const out: ("scenes" | "image" | "audio")[] = [];
  if (tour.scenes.length > VR_LIMITS.freeScenes) out.push("scenes");
  const kinds = new Set(tour.scenes.flatMap((s) => s.hotspots.map((h) => h.kind)));
  if (kinds.has("image")) out.push("image");
  if (kinds.has("audio")) out.push("audio");
  return out;
}

/** Masalah yang membuat tur belum bisa diekspor (kunci i18n vr.issues.*). */
export function tourIssues(tour: Tour): { key: string; scene?: string; label?: string }[] {
  const out: { key: string; scene?: string; label?: string }[] = [];
  for (const s of tour.scenes) {
    if (!s.panoramaId) out.push({ key: "noPanorama", scene: s.name });
    for (const h of s.hotspots) {
      if (h.kind === "scene" && !h.targetSceneId) out.push({ key: "noTarget", scene: s.name, label: h.label });
      if ((h.kind === "image" || h.kind === "audio") && !h.mediaId) out.push({ key: "noMedia", scene: s.name, label: h.label });
    }
  }
  return out;
}

/** Hapus scene + hotspot yang menuju ke sana. */
export function removeScene(tour: Tour, sceneId: string): Tour {
  if (tour.scenes.length <= 1) return tour;
  const scenes = tour.scenes
    .filter((s) => s.id !== sceneId)
    .map((s) => ({ ...s, hotspots: s.hotspots.map((h) => (h.targetSceneId === sceneId ? { ...h, targetSceneId: undefined } : h)) }));
  return { ...tour, scenes, startSceneId: tour.startSceneId === sceneId ? scenes[0].id : tour.startSceneId };
}

/** Semua id media yang dipakai tur (panorama + gambar/audio hotspot). */
export function mediaIdsOf(tour: Tour): string[] {
  const ids = tour.scenes.flatMap((s) => [s.panoramaId, ...s.hotspots.map((h) => h.mediaId)]);
  return [...new Set(ids.filter((x): x is string => !!x))];
}

/* ------------------------------------------------------------------ */
/* Geometri: yaw/pitch ↔ posisi 3D (sama dengan runtime A-Frame)         */
/* ------------------------------------------------------------------ */

const RAD = Math.PI / 180;

export function toPosition(yaw: number, pitch: number, r = 8): [number, number, number] {
  const y = yaw * RAD;
  const p = pitch * RAD;
  const f = (n: number) => Math.round(n * 1000) / 1000;
  return [f(-Math.sin(y) * Math.cos(p) * r), f(Math.sin(p) * r), f(-Math.cos(y) * Math.cos(p) * r)];
}

export function fromDirection(x: number, y: number, z: number): { yaw: number; pitch: number } {
  const len = Math.hypot(x, y, z) || 1;
  return { yaw: normYaw(Math.atan2(-x, -z) / RAD), pitch: clampPitch(Math.asin(y / len) / RAD) };
}

/* ------------------------------------------------------------------ */
/* Deteksi jenis berkas dari isi (bukan nama/ekstensi)                   */
/* ------------------------------------------------------------------ */

export type VrMediaKind = "jpeg" | "png" | "webp" | "mp3" | "wav" | "ogg" | "unknown";

export function sniffVrMedia(b: Uint8Array): VrMediaKind {
  const at = (i: number, ...v: number[]) => v.every((x, k) => b[i + k] === x);
  if (at(0, 0xff, 0xd8, 0xff)) return "jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47)) return "png";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "webp";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x41, 0x56, 0x45)) return "wav";
  if (at(0, 0x4f, 0x67, 0x67, 0x53)) return "ogg";
  if (at(0, 0x49, 0x44, 0x33) || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0)) return "mp3";
  return "unknown";
}

export const IMAGE_MEDIA: VrMediaKind[] = ["jpeg", "png", "webp"];
export const AUDIO_MEDIA: VrMediaKind[] = ["mp3", "wav", "ogg"];
export const MEDIA_EXT: Record<VrMediaKind, string> = { jpeg: "jpg", png: "png", webp: "webp", mp3: "mp3", wav: "wav", ogg: "ogg", unknown: "bin" };
export const MEDIA_MIME: Record<VrMediaKind, string> = { jpeg: "image/jpeg", png: "image/png", webp: "image/webp", mp3: "audio/mpeg", wav: "audio/wav", ogg: "audio/ogg", unknown: "application/octet-stream" };
