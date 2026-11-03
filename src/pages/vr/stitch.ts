import JSZip from "jszip";

/**
 * v7: VR Panorama Stitcher. Pengguna memilih 2–24 foto biasa yang saling
 * tumpang tindih → browser membungkusnya jadi satu ZIP → Nest (/vr/jobs) →
 * layanan Python (OpenCV Stitcher) → JPEG 360° 2:1 yang langsung dipasang
 * sebagai panorama scene. Kredit hanya dipotong bila berhasil.
 */
export const STITCH = {
  feature: "vr-panorama-stitch" as const,
  minPhotos: 2,
  maxPhotos: 24,
  recommendedMin: 6,
  maxPhotoBytes: 40 * 1024 * 1024,
};

/** Bungkus foto jadi ZIP (tanpa kompresi: JPEG/PNG/WebP sudah terkompresi). Nama diberi nomor urut agar urutan terjaga. */
export async function zipPhotos(files: File[]): Promise<Blob> {
  const zip = new JSZip();
  files.forEach((f, i) => {
    const ext = (f.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 5) || "jpg";
    zip.file(`${String(i + 1).padStart(2, "0")}.${ext}`, f, { compression: "STORE" });
  });
  return zip.generateAsync({ type: "blob", mimeType: "application/zip" });
}
