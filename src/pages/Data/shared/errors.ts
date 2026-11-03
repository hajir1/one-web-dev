import i18n from "../../../i18n";

/* ================================================================== */
/* Error terstruktur untuk alat Data. Logika murni melempar kode;        */
/* UI menerjemahkannya lewat data.errors.<code> (ID/EN).                 */
/* ================================================================== */

export class DataError extends Error {
  constructor(
    public code: string,
    public params: Record<string, string | number> = {},
  ) {
    super(code);
    this.name = "DataError";
  }
}

/** Pesan error yang sudah diterjemahkan (DataError → data.errors.<code>). */
export function dataErrorMessage(e: unknown): string {
  if (e instanceof DataError) return i18n.t(`data.errors.${e.code}`, { ...e.params, defaultValue: e.code });
  if (e instanceof Error && e.message) return e.message;
  return i18n.t("errors.unknown");
}
