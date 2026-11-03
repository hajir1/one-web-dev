import ExcelJS from "exceljs";
import { OutputFormat } from "./types";
import { worksheetToObjects, worksheetToArrays } from "../shared/excelUtils";
import { DataError } from "../shared/errors";

/**
 * Ubah satu sheet dari Workbook jadi teks JSON / objek JavaScript siap-pakai.
 */
export function sheetToText(
  workbook: ExcelJS.Workbook,
  sheetName: string,
  headerRow: boolean,
  pretty: boolean,
  format: OutputFormat,
): { text: string; rowCount: number } {
  const ws = workbook.getWorksheet(sheetName) || workbook.worksheets[0];
  if (!ws) throw new DataError("sheetMissing", { name: sheetName });

  const data = headerRow ? worksheetToObjects(ws) : worksheetToArrays(ws);

  const jsonString = JSON.stringify(data, null, pretty ? 2 : 0);
  const text =
    format === "js"
      ? `const data = ${jsonString};\n\nexport default data;\n`
      : jsonString;

  return { text, rowCount: Array.isArray(data) ? data.length : 0 };
}
