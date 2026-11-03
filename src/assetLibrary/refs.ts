/* ================================================================== */
/* Rujukan ASET (v21).                                                  */
/*                                                                    */
/* Gambar dari Pustaka Aset disimpan di desain sebagai teks pendek      */
/* `aset:<id>` (bukan data URL besar). Rujukan ini sama di mode demo    */
/* (IndexedDB) dan mode fullstack (server), lalu diterjemahkan:          */
/*   - pratinjau/editor → data URL dari berkas aset;                    */
/*   - unduh zip / deploy → berkas sungguhan assets/img/<nama>.<ext>.   */
/* ================================================================== */

export const ASSET_SCHEME = "aset:";
const ID = "[a-z0-9][a-z0-9-]{5,40}";
const ONE = new RegExp(`^aset:(${ID})$`);

/** Semua rujukan aset di dalam teks (HTML, CSS, JSON, JS). */
export const assetRefPattern = () => new RegExp(`aset:(${ID})`, "g");

export const assetRef = (id: string) => `${ASSET_SCHEME}${id}`;

export const isAssetRef = (v: unknown): v is string => typeof v === "string" && ONE.test(v.trim());

/** id dari nilai `aset:<id>`, null bila bukan rujukan aset. */
export const assetIdOf = (v: unknown): string | null => (typeof v === "string" ? (ONE.exec(v.trim())?.[1] ?? null) : null);

/** id aset unik yang dirujuk teks, urut kemunculan. */
export function findAssetIds(...texts: string[]): string[] {
  const out = new Set<string>();
  for (const t of texts) for (const m of String(t ?? "").matchAll(assetRefPattern())) out.add(m[1]);
  return [...out];
}

/** Ganti tiap `aset:<id>` dengan hasil `to(id)` (undefined = biarkan). */
export function replaceAssetRefs(text: string, to: (id: string) => string | undefined): string {
  if (!text || !text.includes(ASSET_SCHEME)) return text;
  return text.replace(assetRefPattern(), (whole, id: string) => to(id) ?? whole);
}

/** Pengganti saat aset tidak ditemukan (sudah dihapus / akun lain): kotak abu-abu. */
export const MISSING_ASSET =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200"><rect width="320" height="200" fill="#e5e7eb"/><path d="M130 120l20-26 16 20 10-12 24 18z" fill="#9ca3af"/><circle cx="182" cy="82" r="8" fill="#9ca3af"/></svg>');

/** Nama berkas aman dari nama aset: huruf kecil, angka, tanda hubung. */
export function assetFileName(name: string, id: string, mime: string): string {
  const ext = mime === "image/jpeg" ? "jpg" : mime === "image/svg+xml" ? "svg" : (mime.split("/")[1] ?? "bin").replace(/[^a-z0-9]/g, "") || "bin";
  const base =
    name
      .replace(/\.[a-z0-9]{2,5}$/i, "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "gambar";
  return `${base}-${id.replace(/-/g, "").slice(0, 8)}.${ext}`;
}
