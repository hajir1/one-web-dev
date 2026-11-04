import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import idCore from "./locales/split/id.core.json";

/* ================================================================== */
/* Internasionalisasi (i18next + react-i18next)                         */
/*                                                                    */
/* - The active language ALWAYS comes from the URL prefix: /id/... or /en/... */
/*   (see `LangRoute` in App.tsx). The last choice is stored only        */
/*   to redirect URLs without a prefix (e.g. "/" or old links).          */
/* - Text is split in two (scripts/split-locales.mjs): "core" (shell,   */
/*   home, auth, account) and "rest" (large features: templates, Studio, */
/*   media, docs, ...). Only the Indonesian core ships in the initial    */
/*   bundle; rest loads when a feature page opens (see lazyPage).        */
/*   English is loaded entirely when needed.                             */
/* - Non-React modules (error messages, Media policy, etc.) call         */
/*   `i18n.t()` at use time, not when the module loads.                 */
/* - Program code, technical identifiers, and user-created content are NOT */
/*   diterjemahkan.                                                     */
/* ================================================================== */

export const SUPPORTED_LANGS = ["id", "en"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];
export const DEFAULT_LANG: Lang = "id";

export const LANG_LABEL: Record<Lang, { short: string; native: string; locale: string }> = {
  id: { short: "ID", native: "Bahasa Indonesia", locale: "id-ID" },
  en: { short: "EN", native: "English", locale: "en-US" },
};

const PREF_KEY = "owd-lang";

export const isLang = (v: unknown): v is Lang => typeof v === "string" && (SUPPORTED_LANGS as readonly string[]).includes(v);

void i18n.use(initReactI18next).init({
  resources: { id: { translation: idCore } },
  lng: DEFAULT_LANG,
  fallbackLng: DEFAULT_LANG,
  supportedLngs: [...SUPPORTED_LANGS],
  interpolation: { escapeValue: false },
  returnNull: false,
  initAsync: false,
  showSupportNotice: false,
  // Components re-render once the "rest" part has loaded.
  react: { useSuspense: false, bindI18nStore: "added" },
});

type Bundle = Record<string, unknown>;
const coreLoaders: Record<Lang, () => Promise<Bundle>> = {
  id: async () => idCore as Bundle,
  en: async () => (await import("./locales/split/en.core.json")).default as Bundle,
};
const restLoaders: Record<Lang, () => Promise<Bundle>> = {
  id: async () => (await import("./locales/split/id.rest.json")).default as Bundle,
  en: async () => (await import("./locales/split/en.rest.json")).default as Bundle,
};

const restLoading = new Map<Lang, Promise<void>>();

/** Loads the feature text ("rest" part) for this language. Safe to call repeatedly. */
export function ensureFullLocale(lang: Lang = currentLang()): Promise<void> {
  let p = restLoading.get(lang);
  if (!p) {
    p = restLoaders[lang]()
      .then((res) => {
        i18n.addResourceBundle(lang, "translation", res, true, false);
      })
      .catch((err) => {
        restLoading.delete(lang); // try again on the next navigation
        throw err;
      });
    restLoading.set(lang, p);
  }
  return p;
}

/** Ensures the language bundle is loaded, then activates it. Safe to call repeatedly. */
export async function activateLanguage(lang: Lang): Promise<void> {
  if (!i18n.hasResourceBundle(lang, "translation")) {
    const res = await coreLoaders[lang]();
    i18n.addResourceBundle(lang, "translation", res, true, false);
  }
  // Feature pages that are already open need the full text of the new language.
  if (lang !== DEFAULT_LANG || restLoading.has(DEFAULT_LANG)) void ensureFullLocale(lang).catch(() => undefined);
  if (i18n.language !== lang) await i18n.changeLanguage(lang);
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = "ltr";
  }
  try {
    localStorage.setItem(PREF_KEY, lang);
  } catch {
    /* penyimpanan diblokir: abaikan */
  }
}

/**
 * Replacement for `import()` with React.lazy on feature pages: the page chunk and
 * its feature text download together, and the new page shows once both are ready.
 */
export function withFullLocale<T>(load: () => Promise<T>): () => Promise<T> {
  return () => Promise.all([load(), ensureFullLocale()]).then(([m]) => m);
}

/** Preferred language for URLs without a prefix: stored choice → browser language → default. */
export function preferredLang(): Lang {
  try {
    const saved = localStorage.getItem(PREF_KEY);
    if (isLang(saved)) return saved;
  } catch {
    /* abaikan */
  }
  if (typeof navigator !== "undefined") {
    const nav = (navigator.languages?.length ? navigator.languages : [navigator.language]).map((l) => String(l).toLowerCase());
    for (const l of nav) {
      if (l.startsWith("id") || l.startsWith("ms")) return "id";
      if (l.startsWith("en")) return "en";
    }
  }
  return DEFAULT_LANG;
}

/** The current active language (for non-React modules). */
export const currentLang = (): Lang => (isLang(i18n.language) ? i18n.language : DEFAULT_LANG);

/* ----------------------------- path URL ----------------------------- */

/** "/en/media-tools" → { lang: "en", rest: "/media-tools" }; no prefix → lang null. */
export function splitLangPath(pathname: string): { lang: Lang | null; rest: string } {
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(pathname);
  if (m && isLang(m[1])) return { lang: m[1], rest: m[2] || "/" };
  return { lang: null, rest: pathname || "/" };
}

/** Add the language prefix to an internal absolute path. Relative paths / external URLs are left alone. */
export function localizePath(to: string, lang: Lang): string {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const { rest } = splitLangPath(to.replace(/[?#].*$/, ""));
  const tail = to.slice(to.replace(/[?#].*$/, "").length);
  return `/${lang}${rest === "/" ? "" : rest}${tail}`;
}

/** The same path in another language (query & hash are kept). */
export function switchLangPath(pathname: string, search: string, hash: string, lang: Lang): string {
  const { rest } = splitLangPath(pathname);
  return `/${lang}${rest === "/" ? "" : rest}${search}${hash}`;
}

/** Format numbers for the active language. */
export function formatNumber(n: number, opts?: Intl.NumberFormatOptions, lang: Lang = currentLang()): string {
  return n.toLocaleString(LANG_LABEL[lang].locale, opts);
}

export default i18n;
