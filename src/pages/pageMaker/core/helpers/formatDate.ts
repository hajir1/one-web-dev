import i18n, { DEFAULT_LANG, LANG_LABEL, isLang } from "../../../../i18n";

/** Tanggal + jam singkat sesuai bahasa aktif (id-ID / en-US). */
export function formatDate(ts: number): string {
  const lang = isLang(i18n.language) ? i18n.language : DEFAULT_LANG;
  return new Date(ts).toLocaleString(LANG_LABEL[lang].locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
