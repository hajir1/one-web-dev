// ─── lib/validate.ts ─────────────────────────────────────────────────────────
// Validates files BEFORE processing: size, empty files, and kind based on
// content. One function for every Media page so rules & messages stay consistent.

import i18n from "../../../i18n";
import { KIND_LABEL, sniffFile, type SniffedKind } from "./fileSniff";
import { formatSize } from "./format";

export interface FileRules {
  /** Accepted kinds (from content sniffing). */
  kinds: SniffedKind[];
  /** Size limit per file (bytes). */
  maxBytes: number;
  /** Limit on files per add (default unlimited). */
  maxFiles?: number;
  /** Specific messages per kind that is recognized but unsupported, e.g. HEIC. */
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

/** Default hint (read at use time so it follows the active language). */
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

/** Summarize the rejection list into a short message (max. 3 names). */
export function summarizeRejections(rejected: RejectedFile[]): string | null {
  if (!rejected.length) return null;
  const head = rejected.slice(0, 3).map((r) => `${r.name}: ${r.reason}`);
  const more = rejected.length > 3 ? i18n.t("media.validate.more", { n: rejected.length - 3 }) : "";
  return i18n.t("media.validate.summary", { count: rejected.length, list: head.join(" · "), more });
}
