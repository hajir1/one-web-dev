// ─── lib/download.ts ─────────────────────────────────────────────────────────
// Unduhan yang benar-benar menghasilkan file (bukan sekadar tampil di UI).
//
// Perbaikan dari versi lama:
// - <a> dimasukkan ke DOM sebelum click (Firefox lama mengabaikan click pada
//   elemen yang tidak terpasang).
// - Object URL ZIP tidak dicabut SEGERA setelah click — di beberapa browser
//   unduhan belum sempat membaca blob sehingga file 0 byte / gagal.
// - ZIP memakai STORE (tanpa kompresi ulang): gambar/frame sudah terkompresi,
//   kompresi DEFLATE hanya membuang waktu & CPU.

import JSZip from "jszip";
import i18n from "../../../i18n";
import { deduplicateName, safeFileName } from "./format";

const REVOKE_DELAY_MS = 60_000;

function triggerDownload(url: string, filename: string): void {
  const a = document.createElement("a");
  a.href = url;
  a.download = safeFileName(filename);
  a.rel = "noopener";
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

/** Unduh Blob; URL sementara dicabut otomatis setelah jeda aman. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

export interface ZipEntry {
  name: string;
  blob: Blob;
}

/** Buat ZIP (nama di dalamnya dibersihkan & dibuat unik). */
async function buildZip(entries: ZipEntry[], onProgress?: (pct: number) => void): Promise<Blob> {
  if (!entries.length) throw new Error(i18n.t("media.errors.zipEmpty"));
  const zip = new JSZip();
  const used = new Set<string>();
  for (const e of entries) {
    const name = deduplicateName(safeFileName(e.name), used);
    used.add(name);
    zip.file(name, e.blob, { binary: true });
  }
  return zip.generateAsync({ type: "blob", compression: "STORE", streamFiles: true }, (m) => onProgress?.(Math.round(m.percent)));
}

export async function downloadAsZip(entries: ZipEntry[], zipName: string, onProgress?: (pct: number) => void): Promise<void> {
  const blob = await buildZip(entries, onProgress);
  downloadBlob(blob, zipName);
}
