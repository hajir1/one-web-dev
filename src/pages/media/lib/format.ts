// ─── lib/format.ts ───────────────────────────────────────────────────────────

/** Byte → teks singkat (B / KB / MB / GB). */
export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(2)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

/** Detik → m:ss.cc (atau h:mm:ss.cc). */
export function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "—";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = (sec % 60).toFixed(2).padStart(5, "0");
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

/** Selisih ukuran dalam persen: negatif = lebih kecil. null bila tidak bisa dihitung. */
export function sizeDelta(original: number, result: number): number | null {
  if (!(original > 0) || !(result >= 0)) return null;
  const d = Math.round((result / original - 1) * 100);
  // Hasil yang tidak kosong jangan tampil "-100%".
  return result > 0 && d <= -100 ? -99 : d;
}

export function makeId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/** Nama dasar tanpa ekstensi. */
export const baseName = (name: string) => name.replace(/\.[^/.]+$/, "") || "file";

/**
 * Nama file aman untuk diunduh / dimasukkan ZIP: tanpa pemisah path,
 * karakter kontrol, atau karakter terlarang Windows; panjang dibatasi.
 */
export function safeFileName(name: string, fallback = "file"): string {
  // eslint-disable-next-line no-control-regex
  const cleaned = name.replace(/[\u0000-\u001f\u007f<>:"/\\|?*]+/g, "-").replace(/^[.\s-]+|[.\s]+$/g, "");
  const s = cleaned.slice(0, 150);
  return s || fallback;
}

/** Hindari nama bentrok di ZIP: foto.png, foto-1.png, foto-2.png, … */
export function deduplicateName(base: string, used: Set<string>): string {
  if (!used.has(base)) return base;
  const dot = base.lastIndexOf(".");
  const stem = dot > 0 ? base.slice(0, dot) : base;
  const ext = dot > 0 ? base.slice(dot) : "";
  let i = 1;
  while (used.has(`${stem}-${i}${ext}`)) i++;
  return `${stem}-${i}${ext}`;
}
