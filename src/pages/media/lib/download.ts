// ─── lib/download.ts ─────────────────────────────────────────────────────────
// Downloads that really produce a file (not just shown in the UI).
//
// Fixes from the old version:
// - <a> is attached to the DOM before click (old Firefox ignored clicks on
//   detached elements).
// - The ZIP object URL is not revoked RIGHT after click; in some browsers
//   the download had not read the blob yet, so the file was 0 bytes / failed.
// - ZIP uses STORE (no recompression): images/frames are already compressed,
//   DEFLATE compression only wastes time & CPU.

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

/** Download a Blob; the temporary URL is revoked automatically after a safe delay. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  triggerDownload(url, filename);
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_DELAY_MS);
}

export interface ZipEntry {
  name: string;
  blob: Blob;
}

/** Builds a ZIP (names inside are sanitized & made unique). */
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
