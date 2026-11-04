import i18n, { DEFAULT_LANG, LANG_LABEL, isLang } from "../../../../i18n";

/** Short date + time for the active language (id-ID / en-US). */
export function formatDate(ts: number): string {
  const lang = isLang(i18n.language) ? i18n.language : DEFAULT_LANG;
  return new Date(ts).toLocaleString(LANG_LABEL[lang].locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}
