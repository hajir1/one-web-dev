import ExcelJS from "exceljs";
import { Row, SqlDialect, InsertMode, ColumnMap } from "./types";
import { worksheetToObjects, worksheetToArrays } from "../shared/excelUtils";
import { parseJsonStrict } from "../shared/json";

// ---------------------------------------------------------------------------
// Excel rows
// ---------------------------------------------------------------------------

export function excelRowsFromSheet(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  headerRow: boolean,
): Row[] {
  const ws = workbook.getWorksheet(sheetName) || workbook.worksheets[0];
  if (!ws) return [];

  if (headerRow) {
    return worksheetToObjects(ws) as Row[];
  }

  const raw = worksheetToArrays(ws);
  return raw.map((arr) => {
    const obj: Row = {};
    arr.forEach((v, idx) => {
      obj[`kolom_${idx + 1}`] = v;
    });
    return obj;
  });
}

// ---------------------------------------------------------------------------
// JSON parsing
// ---------------------------------------------------------------------------

/** Teks JSON → baris. Melempar DataError dengan posisi baris/kolom bila tidak valid. */
export function parseJsonText(text: string): Row[] {
  const parsed = parseJsonStrict(text);
  const arr = Array.isArray(parsed) ? parsed : [parsed];

  return arr.map((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) {
      return item as Row;
    }
    if (Array.isArray(item)) {
      const obj: Row = {};
      item.forEach((v, i) => {
        obj[`kolom_${i + 1}`] = v;
      });
      return obj;
    }
    return { value: item } as Row;
  });
}

// ---------------------------------------------------------------------------
// Deteksi kolom
// ---------------------------------------------------------------------------

export function detectColumns(rows: Row[]): string[] {
  const seen = new Set<string>();
  const cols: string[] = [];
  rows.forEach((r) => {
    Object.keys(r).forEach((k) => {
      if (!seen.has(k)) {
        seen.add(k);
        cols.push(k);
      }
    });
  });
  return cols;
}

export type ColumnKind = "number" | "boolean" | "json" | "text";

/** Tipe kolom dari ≤200 nilai pertama yang tidak kosong (campuran → text). */
export function detectColumnType(rows: Row[], col: string): ColumnKind {
  const limit = Math.min(rows.length, 200);
  let kind: ColumnKind | null = null;
  for (let i = 0; i < limit; i++) {
    const v = rows[i][col];
    if (v === null || v === undefined || v === "") continue;
    const k: ColumnKind = typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : typeof v === "object" ? "json" : "text";
    if (kind && kind !== k) return "text";
    kind = k;
  }
  return kind ?? "text";
}

// ---------------------------------------------------------------------------
// SQL builder
// ---------------------------------------------------------------------------

const PLAIN_IDENT = /^[A-Za-z_][A-Za-z0-9_]*$/;

export function quoteIdent(name: string, dialect: SqlDialect): string {
  const safe = name.trim() || "kolom";
  switch (dialect) {
    case "mysql":
      return `\`${safe.replace(/`/g, "``")}\``;
    case "postgres":
      return `"${safe.replace(/"/g, '""')}"`;
    case "mssql":
      return `[${safe.replace(/]/g, "]]")}]`;
    default:
      // Generic: tanpa kutip bila aman; selain itu kutip ANSI agar spasi/tanda
      // baca di nama kolom Excel tidak merusak query.
      return PLAIN_IDENT.test(safe) ? safe : `"${safe.replace(/"/g, '""')}"`;
  }
}

/** Nilai → literal SQL sesuai dialek. */
export function escapeValue(value: unknown, nullAsKeyword: boolean, dialect: SqlDialect = "generic"): string {
  if (value === null || value === undefined || value === "") {
    return nullAsKeyword ? "NULL" : "''";
  }
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "NULL";
  if (typeof value === "bigint") return String(value);
  if (typeof value === "boolean") {
    // PostgreSQL menolak 1/0 untuk kolom boolean; MySQL & SQL Server memakai 1/0.
    if (dialect === "postgres" || dialect === "generic") return value ? "TRUE" : "FALSE";
    return value ? "1" : "0";
  }
  const text = value instanceof Date ? value.toISOString() : typeof value === "object" ? JSON.stringify(value) : String(value);
  let body = text.replace(/'/g, "''");
  // MySQL (mode default) memperlakukan backslash sebagai escape: C:\path\ → rusak.
  if (dialect === "mysql") body = body.replace(/\\/g, "\\\\");
  // SQL Server: N'' agar teks Unicode tidak berubah jadi "?".
  // eslint-disable-next-line no-control-regex -- rentang ASCII sengaja dipakai untuk mendeteksi teks non-ASCII
  return dialect === "mssql" && /[^\x00-\x7f]/.test(text) ? `N'${body}'` : `'${body}'`;
}

/** Validasi pemetaan kolom: nama kosong / duplikat (tidak peka huruf besar). */
export function validateColumns(columns: ColumnMap[]): { code: "noColumns" } | { code: "emptyColumn"; source: string } | { code: "duplicateColumn"; name: string } | null {
  const included = columns.filter((c) => c.included);
  if (!included.length) return { code: "noColumns" };
  const seen = new Set<string>();
  for (const c of included) {
    const name = (c.dbColumn || c.source).trim();
    if (!name) return { code: "emptyColumn", source: c.source };
    const key = name.toLowerCase();
    if (seen.has(key)) return { code: "duplicateColumn", name };
    seen.add(key);
  }
  return null;
}

export function buildSql(
  rows: Row[],
  tableName: string,
  columns: ColumnMap[],
  insertMode: InsertMode,
  dialect: SqlDialect,
  nullAsKeyword: boolean,
  limit?: number,
): string {
  const included = columns.filter((c) => c.included);
  if (included.length === 0 || rows.length === 0) return "";

  const table = quoteIdent(tableName || "nama_tabel", dialect);
  const colsPart = included
    .map((c) => quoteIdent(c.dbColumn || c.source, dialect))
    .join(", ");
  const targetRows = typeof limit === "number" ? rows.slice(0, limit) : rows;

  const tuples = targetRows.map((row) => {
    const vals = included.map((c) => escapeValue(row[c.source], nullAsKeyword, dialect));
    return `(${vals.join(", ")})`;
  });

  if (insertMode === "bulk") {
    return `INSERT INTO ${table} (${colsPart}) VALUES\n${tuples.join(",\n")};`;
  }
  return tuples
    .map((t) => `INSERT INTO ${table} (${colsPart}) VALUES ${t};`)
    .join("\n");
}
