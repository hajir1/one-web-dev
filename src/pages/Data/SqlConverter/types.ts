export type SourceType = "excel" | "json";
export type JsonInputMode = "paste" | "upload";
export type InsertMode = "bulk" | "single";
export type SqlDialect = "mysql" | "postgres" | "mssql" | "generic";

export type Row = Record<string, unknown>;

export interface ColumnMap {
  source: string;
  dbColumn: string;
  included: boolean;
}
