import { ASSET_LIMITS, type PreparedImage } from "./types";

export class AssetError extends Error {
  constructor(public readonly code: "type" | "size" | "decode" | "quota" | "network" | "inUse") {
    super(code);
  }
}

const toBlob = (c: HTMLCanvasElement, type: string, q: number) => new Promise<Blob | null>((res) => c.toBlob(res, type, q));

/**
 * Gambar dari perangkat → siap disimpan. Foto besar diperkecil (sisi terpanjang
 * 2000 px) dan diubah ke WebP (JPEG bila browser tidak bisa membuat WebP),
 * sehingga satu foto HP 4–8 MB menjadi ±200–500 KB. GIF dibiarkan (animasi).
 * SVG ditolak: bisa berisi skrip.
 */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const type = file.type.toLowerCase();
  if (!ASSET_LIMITS.types.includes(type)) throw new AssetError("type");
  if (file.size > ASSET_LIMITS.maxInputBytes) throw new AssetError("size");
  let bmp: ImageBitmap;
  try {
    bmp = await createImageBitmap(file);
  } catch {
    throw new AssetError("decode");
  }
  const { width, height } = bmp;
  const name = file.name.slice(0, 120) || "gambar";
  const scale = Math.min(1, ASSET_LIMITS.maxSide / Math.max(width, height));
  const keep = type === "image/gif" || (scale === 1 && file.size <= 400 * 1024);
  if (keep) {
    bmp.close();
    if (file.size > ASSET_LIMITS.maxBytes) throw new AssetError("size");
    return { blob: file, name, mime: type, width, height };
  }
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d");
  if (!g) throw new AssetError("decode");
  g.imageSmoothingQuality = "high";
  g.drawImage(bmp, 0, 0, w, h);
  bmp.close();
  let out = await toBlob(c, "image/webp", 0.85);
  if (!out || out.type !== "image/webp") out = await toBlob(c, type === "image/png" ? "image/png" : "image/jpeg", 0.88);
  if (!out) throw new AssetError("decode");
  // Hasil olahan lebih besar dari aslinya (jarang, mis. PNG kecil) → simpan aslinya.
  if (scale === 1 && out.size >= file.size) out = file;
  if (out.size > ASSET_LIMITS.maxBytes) throw new AssetError("size");
  return { blob: out, name, mime: out.type || type, width: w, height: h };
}
