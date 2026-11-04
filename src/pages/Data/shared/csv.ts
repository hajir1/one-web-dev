import { DataError } from "./errors";

/* ================================================================== */
/* CSV/TSV per RFC 4180:                                               */
/*  - quoted fields may contain separators, "" (double quotes), and newlines */
/*  - the separator is detected from the first row (, ; tab |), never mixed */
/*  - the UTF-8 BOM is dropped; non-UTF-8 text (Windows Excel export) is read */
/*    as Windows-1252                                                   */
/* ================================================================== */

export type Delimiter = "," | ";" | "\t" | "|";
const CANDIDATES: Delimiter[] = [",", ";", "\t", "|"];

/** Dekode buffer: UTF-8 ketat, fallback Windows-1252. BOM dibuang. */
export function decodeText(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    text = new TextDecoder("windows-1252").decode(bytes);
  }
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

/** Counts separators outside quotes on the first (logical) line. */
export function detectDelimiter(text: string): Delimiter {
  const counts = new Map<Delimiter, number>(CANDIDATES.map((d) => [d, 0]));
  let inQuotes = false;
  for (let i = 0; i < text.length && i < 64 * 1024; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') i++;
      else inQuotes = !inQuotes;
    } else if (!inQuotes && (c === "\n" || c === "\r")) break;
    else if (!inQuotes && counts.has(c as Delimiter)) counts.set(c as Delimiter, counts.get(c as Delimiter)! + 1);
  }
  let best: Delimiter = ",";
  let max = 0;
  for (const d of CANDIDATES) {
    const n = counts.get(d)!;
    if (n > max) {
      max = n;
      best = d;
    }
  }
  return best;
}

/** Parse CSV → string[][] rows. Fully empty rows are skipped. */
export function parseCsv(text: string, delimiter: Delimiter = detectDelimiter(text)): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let quotedAt = -1; // the line where the quote was opened (for the error message)
  let line = 1;

  const endRow = () => {
    row.push(field);
    field = "";
    if (row.length > 1 || row[0] !== "") rows.push(row);
    row = [];
  };

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else {
        if (c === "\n") line++;
        field += c;
      }
      continue;
    }
    if (c === '"' && field === "") {
      inQuotes = true;
      quotedAt = line;
    } else if (c === delimiter) {
      row.push(field);
      field = "";
    } else if (c === "\r") {
      if (text[i + 1] === "\n") i++;
      line++;
      endRow();
    } else if (c === "\n") {
      line++;
      endRow();
    } else field += c;
  }
  if (inQuotes) throw new DataError("csvUnclosedQuote", { line: quotedAt });
  if (field !== "" || row.length) endRow();
  return rows;
}

const needsQuote = (s: string, d: string) => s.includes(d) || /["\r\n]/.test(s) || /^\s|\s$/.test(s);

/** Cell value → CSV text (objects/arrays are JSON-encoded). */
function cellText(v: unknown): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/** Rows → CSV text (CRLF, quoted when needed). */
export function toCsv(rows: unknown[][], delimiter: Delimiter = ","): string {
  return rows
    .map((r) =>
      r
        .map((v) => {
          const s = cellText(v);
          return needsQuote(s, delimiter) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(delimiter),
    )
    .join("\r\n");
}
