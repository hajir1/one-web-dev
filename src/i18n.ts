import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import idCore from "./locales/split/id.core.json";

/* ================================================================== */
/* Internasionalisasi (i18next + react-i18next)                         */
/*                                                                    */
/* - Bahasa aktif SELALU berasal dari prefix URL: /id/... atau /en/...  */
/*   (lihat `LangRoute` di App.tsx). Pilihan terakhir disimpan hanya     */
/*   untuk mengarahkan URL tanpa prefix (mis. "/" atau tautan lama).     */
/* - Teks dipecah dua (scripts/split-locales.mjs): "core" (shell,       */
/*   beranda, auth, akun) dan "rest" (fitur besar: template, Studio,     */
/*   media, docs, ...). Hanya core Bahasa Indonesia yang ikut bundle     */
/*   awal; rest dimuat saat halaman fitur dibuka (lihat lazyPage).       */
/*   Bahasa Inggris seluruhnya dimuat saat dibutuhkan.                   */
/* - Modul non-React (pesan error, kebijakan Media, dsb.) memanggil      */
/*   `i18n.t()` saat dipakai — bukan saat modul dimuat.                 */
/* - Kode program, identifier teknis, dan konten buatan pengguna TIDAK  */
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
  // Komponen ikut dirender ulang saat bagian "rest" selesai dimuat.
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

/** Muat teks fitur (bagian "rest") untuk bahasa ini. Aman dipanggil berulang. */
export function ensureFullLocale(lang: Lang = currentLang()): Promise<void> {
  let p = restLoading.get(lang);
  if (!p) {
    p = restLoaders[lang]()
      .then((res) => {
        i18n.addResourceBundle(lang, "translation", res, true, false);
      })
      .catch((err) => {
        restLoading.delete(lang); // coba lagi di navigasi berikutnya
        throw err;
      });
    restLoading.set(lang, p);
  }
  return p;
}

/** Pastikan bundle bahasa termuat lalu aktifkan. Aman dipanggil berulang. */
export async function activateLanguage(lang: Lang): Promise<void> {
  if (!i18n.hasResourceBundle(lang, "translation")) {
    const res = await coreLoaders[lang]();
    i18n.addResourceBundle(lang, "translation", res, true, false);
  }
  // Halaman fitur yang sudah terbuka butuh teks lengkap bahasa baru.
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
 * Pengganti `import()` untuk React.lazy pada halaman fitur: chunk halaman dan
 * teks fiturnya diunduh bersamaan, halaman baru tampil setelah keduanya siap.
 */
export function withFullLocale<T>(load: () => Promise<T>): () => Promise<T> {
  return () => Promise.all([load(), ensureFullLocale()]).then(([m]) => m);
}

/** Bahasa pilihan untuk URL tanpa prefix: pilihan tersimpan → bahasa browser → bawaan. */
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

/** Bahasa aktif saat ini (untuk modul non-React). */
export const currentLang = (): Lang => (isLang(i18n.language) ? i18n.language : DEFAULT_LANG);

/* ----------------------------- path URL ----------------------------- */

/** "/en/media-tools" → { lang: "en", rest: "/media-tools" }; tanpa prefix → lang null. */
export function splitLangPath(pathname: string): { lang: Lang | null; rest: string } {
  const m = /^\/([a-z]{2})(?=\/|$)(.*)$/.exec(pathname);
  if (m && isLang(m[1])) return { lang: m[1], rest: m[2] || "/" };
  return { lang: null, rest: pathname || "/" };
}

/** Tambahkan prefix bahasa ke path absolut internal. Path relatif / URL luar dibiarkan. */
export function localizePath(to: string, lang: Lang): string {
  if (!to.startsWith("/") || to.startsWith("//")) return to;
  const { rest } = splitLangPath(to.replace(/[?#].*$/, ""));
  const tail = to.slice(to.replace(/[?#].*$/, "").length);
  return `/${lang}${rest === "/" ? "" : rest}${tail}`;
}

/** Path yang sama dalam bahasa lain (query & hash dipertahankan). */
export function switchLangPath(pathname: string, search: string, hash: string, lang: Lang): string {
  const { rest } = splitLangPath(pathname);
  return `/${lang}${rest === "/" ? "" : rest}${search}${hash}`;
}

/** Format angka sesuai bahasa aktif. */
export function formatNumber(n: number, opts?: Intl.NumberFormatOptions, lang: Lang = currentLang()): string {
  return n.toLocaleString(LANG_LABEL[lang].locale, opts);
}

export default i18n;
