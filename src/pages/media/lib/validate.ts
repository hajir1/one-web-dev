// ─── lib/validate.ts ─────────────────────────────────────────────────────────
// Validasi file SEBELUM diproses: ukuran, file kosong, dan jenis berdasarkan
// isi. Satu fungsi untuk semua halaman Media supaya aturan & pesan konsisten.

import i18n from "../../../i18n";
import { KIND_LABEL, sniffFile, type SniffedKind } from "./fileSniff";
import { formatSize } from "./format";

export interface FileRules {
  /** Jenis yang diterima (hasil sniffing isi file). */
  kinds: SniffedKind[];
  /** Batas ukuran per file (byte). */
  maxBytes: number;
  /** Batas jumlah file sekali tambah (default tanpa batas). */
  maxFiles?: number;
  /** Pesan khusus per jenis yang dikenali tapi tidak didukung, mis. HEIC. */
  unsupportedHint?: Partial<Record<SniffedKind, string>>;
}

export interface AcceptedFile {
  file: File;
  kind: SniffedKind;
}

export interface RejectedFile {
  name: string;
  reason: string;
}

export interface ValidationResult {
  accepted: AcceptedFile[];
  rejected: RejectedFile[];
}

/** Petunjuk bawaan (dibaca saat dipakai agar mengikuti bahasa aktif). */
const defaultHint = (kind: SniffedKind): string | undefined =>
  kind === "heic" || kind === "tiff" ? i18n.t(`media.validate.hints.${kind}`) : undefined;

export async function validateFiles(files: Iterable<File>, rules: FileRules): Promise<ValidationResult> {
  const list = Array.from(files);
  const accepted: AcceptedFile[] = [];
  const rejected: RejectedFile[] = [];
  const max = rules.maxFiles ?? Infinity;
  const allowed = rules.kinds.map((k) => KIND_LABEL[k]).join(", ");

  for (const file of list) {
    if (accepted.length >= max) {
      rejected.push({ name: file.name, reason: i18n.t("media.validate.tooMany", { max }) });
      continue;
    }
    if (file.size === 0) {
      rejected.push({ name: file.name, reason: i18n.t("media.validate.empty") });
      continue;
    }
    if (file.size > rules.maxBytes) {
      rejected.push({ name: file.name, reason: i18n.t("media.validate.tooLarge", { size: formatSize(file.size), max: formatSize(rules.maxBytes) }) });
      continue;
    }
    let kind: SniffedKind;
    try {
      kind = await sniffFile(file);
    } catch {
      rejected.push({ name: file.name, reason: i18n.t("media.validate.unreadable") });
      continue;
    }
    if (!rules.kinds.includes(kind)) {
      const hint = rules.unsupportedHint?.[kind] ?? defaultHint(kind);
      rejected.push({
        name: file.name,
        reason:
          kind === "unknown"
            ? i18n.t("media.validate.unrecognized", { allowed })
            : hint ?? i18n.t("media.validate.unsupported", { kind: KIND_LABEL[kind], allowed }),
      });
      continue;
    }
    accepted.push({ file, kind });
  }
  return { accepted, rejected };
}

/** Ringkas daftar penolakan menjadi pesan pendek (maks. 3 nama). */
export function summarizeRejections(rejected: RejectedFile[]): string | null {
  if (!rejected.length) return null;
  const head = rejected.slice(0, 3).map((r) => `${r.name}: ${r.reason}`);
  const more = rejected.length > 3 ? i18n.t("media.validate.more", { n: rejected.length - 3 }) : "";
  return i18n.t("media.validate.summary", { count: rejected.length, list: head.join(" · "), more });
}
