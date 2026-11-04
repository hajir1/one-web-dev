import JSZip from "jszip";

/**
 * v7: VR Panorama Stitcher. The user picks 2–24 regular overlapping photos
 * → the browser packs them into one ZIP → Nest (/vr/jobs) →
 * the Python service (OpenCV Stitcher) → a 2:1 360° JPEG applied directly
 * as the scene panorama. Credits are only charged on success.
 */
export const STITCH = {
  feature: "vr-panorama-stitch" as const,
  minPhotos: 2,
  maxPhotos: 24,
  recommendedMin: 6,
  maxPhotoBytes: 40 * 1024 * 1024,
};

/** Packs photos into a ZIP (no compression: JPEG/PNG/WebP are already compressed). Names are numbered so the order is kept. */
export async function zipPhotos(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((f, i) => {
    const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    zip.file(`${String(i + 1).padStart(2, "0")}.${ext}`, f, { compression: "STORE" });
  });
  return zip.generateAsync({ type: "blob", mimeType: "application/zip" });
}
