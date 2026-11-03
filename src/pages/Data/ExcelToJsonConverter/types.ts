import ExcelJS from "exceljs";

type ItemStatus = "pending" | "converting" | "done" | "error";
export type OutputFormat = "json" | "js";

export interface ConvertItem {
  id: string;
  file: File;
  status: ItemStatus;
  originalSize: number;
  workbook?: ExcelJS.Workbook;
  sheetNames: string[];
  selectedSheet: string;
  rowCount?: number;
  resultText?: string;
  resultBlob?: Blob;
  errorMsg?: string;
  /** Format lama (.xls/.ods) → tampilkan tautan Konversi Server. */
  legacy?: boolean;
}
