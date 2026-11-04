import ExcelJS from "exceljs";
import { DataError } from "./errors";
import { decodeText, parseCsv } from "./csv";

// ---------------------------------------------------------------------------
// Konstanta
// ---------------------------------------------------------------------------

export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
/** Formats readable in the browser (ExcelJS + our own CSV parser). */
const BROWSER_SHEET_EXT = /\.(xlsx|xlsm|csv|tsv|txt)$/i;
/** Old formats that ExcelJS CANNOT read → point to Server Convert. */
export const LEGACY_SHEET_EXT = /\.(xls|ods|xlsb|numbers)$/i;
/** Everything the file picker accepts (old formats are rejected with a clear message). */
export const ACCEPTED_EXCEL_EXT = /\.(xlsx|xlsm|csv|tsv|txt|xls|ods|xlsb)$/i;
export const ACCEPT_ATTR = ".xlsx,.xlsm,.csv,.tsv,.txt,.xls,.ods,.xlsb";

// ---------------------------------------------------------------------------
// Helper umum
// ---------------------------------------------------------------------------

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ---------------------------------------------------------------------------
// Cell value format
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatCellValue(value: any): any {
  if (value === null || value === undefined) return "";

  if (typeof value === "object") {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? "" : value.toISOString();
    }
    if ("formula" in value || "sharedFormula" in value) {
      // Formulas without a stored result (the file was never recalculated) →
      // empty, not a {formula} object leaking into the JSON.
      return value.result === undefined || value.result === null ? "" : formatCellValue(value.result);
    }
    if ("result" in value) {
      return value.result === undefined || value.result === null ? "" : formatCellValue(value.result);
    }
    if ("richText" in value && Array.isArray(value.richText)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return value.richText.map((item: any) => item.text || "").join("");
    }
    if ("text" in value && typeof value.text === "string") {
      return value.text;
    }
    if ("hyperlink" in value && typeof value.hyperlink === "string") {
      return value.hyperlink;
    }
    if ("error" in value) {
      return "";
    }
  }
  if (typeof value === "number" && !Number.isFinite(value)) return "";

  return value;
}

/** Unique column names: "a", "a" → "a", "a_2"; never collides with a real "a_2" header. */
export function uniqueHeaders(raw: string[]): string[] {
  const used = new Set<string>();
  return raw.map((h, i) => {
    const base = h.trim() || `kolom_${i + 1}`;
    let name = base;
    for (let n = 2; used.has(name); n++) name = `${base}_${n}`;
    used.add(name);
    return name;
  });
}

const isBlank = (v: unknown) => v === "" || v === null || v === undefined;

// ---------------------------------------------------------------------------
// Extractor Row/Cell Worksheet (ExcelJS)
// ---------------------------------------------------------------------------

/** Every non-empty row as an array of values (empty columns in the middle become ""). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function worksheetToArrays(worksheet: ExcelJS.Worksheet): any[][] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any[][] = [];
  if (!worksheet || worksheet.rowCount === 0) return result;

  worksheet.eachRow({ includeEmpty: false }, (row) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rowValues: any[] = [];
    let last = -1;
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const val = formatCellValue(cell.value);
      rowValues[colNumber - 1] = val;
      if (!isBlank(val)) last = colNumber - 1;
    });
    if (last >= 0) {
      for (let i = 0; i <= last; i++) if (rowValues[i] === undefined) rowValues[i] = "";
      result.push(rowValues.slice(0, last + 1));
    }
  });
  return result;
}

/** First row = column names; following rows → objects. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function arraysToObjects(arrays: any[][]): Record<string, any>[] {
  if (!arrays.length) return [];
  const width = arrays.reduce((m, r) => Math.max(m, r.length), 0);
  const head = arrays[0];
  const headers = uniqueHeaders(Array.from({ length: width }, (_, i) => String(head[i] ?? "")));
  return arrays.slice(1).flatMap((r) => {
    if (r.every(isBlank)) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => (obj[h] = r[i] === undefined ? "" : r[i]));
    return [obj];
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function worksheetToObjects(worksheet: ExcelJS.Worksheet): Record<string, any>[] {
  return arraysToObjects(worksheetToArrays(worksheet));
}

// ---------------------------------------------------------------------------
// CSV → Workbook
// ---------------------------------------------------------------------------

/** CSV is read as is, as text (old behavior kept: "007" stays "007"). */
function csvToWorkbook(workbook: ExcelJS.Workbook, text: string, fileName: string): void {
  const sheetName = fileName.replace(/\.[^/.]+$/, "").replace(/[*?:\\/[\]]/g, "_").slice(0, 31) || "Sheet1";
  const worksheet = workbook.addWorksheet(sheetName);
  for (const r of parseCsv(text)) worksheet.addRow(r);
}

// ---------------------------------------------------------------------------
// readWorkbook
// ---------------------------------------------------------------------------

/** Reads an Excel/CSV File into a Workbook (ExcelJS) entirely in the browser. */
export async function readWorkbook(file: File): Promise<ExcelJS.Workbook> {
  if (LEGACY_SHEET_EXT.test(file.name)) throw new DataError("legacyFormat", { ext: file.name.split(".").pop()?.toLowerCase() ?? "" });
  if (!BROWSER_SHEET_EXT.test(file.name)) throw new DataError("unsupportedFile", { name: file.name });
  if (file.size > MAX_FILE_SIZE) throw new DataError("fileTooLarge", { max: formatSize(MAX_FILE_SIZE) });

  let buffer: ArrayBuffer;
  try {
    buffer = await file.arrayBuffer();
  } catch {
    throw new DataError("readFailed");
  }
  if (!buffer.byteLength) throw new DataError("emptyFile");

  const workbook = new ExcelJS.Workbook();
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "csv" || ext === "tsv" || ext === "txt") {
    csvToWorkbook(workbook, decodeText(buffer), file.name);
  } else {
    // .xlsx/.xlsm are ZIP ("PK"). Anything else → not a modern Excel file.
    const head = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
    if (head[0] !== 0x50 || head[1] !== 0x4b) throw new DataError("notXlsx");
    try {
      await workbook.xlsx.load(buffer);
    } catch {
      throw new DataError("corruptXlsx");
    }
  }
  if (!workbook.worksheets.length) throw new DataError("noSheets");
  return workbook;
}
