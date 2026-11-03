import { useEffect } from "react";
import { useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import { LANG_LABEL, SUPPORTED_LANGS, splitLangPath, type Lang } from "../../i18n";

/* ================================================================== */
/* Metadata halaman sesuai bahasa aktif:                                */
/*   <title>, meta description, og:title/description/locale,            */
/*   <link rel="alternate" hreflang> untuk /id dan /en, canonical.       */
/* Atribut <html lang> diatur oleh activateLanguage() di i18n.ts.        */
/* ================================================================== */

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const sel = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(sel);
  if (!el) {
    el = document.createElement("link");
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

export default function AppMeta({ title, description }: { title: string; description?: string }) {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const brand = t("app.name");
  const fullTitle = title ? `${title} | ${brand}` : brand;
  const desc = description || t("app.description");

  useEffect(() => {
    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:locale", LANG_LABEL[(i18n.language as Lang) ?? "id"]?.locale.replace("-", "_") ?? "id_ID");
    const { rest } = splitLangPath(pathname);
    // v13: sertakan awalan path situs (mis. GitHub Pages "/repo").
    const origin = window.location.origin + import.meta.env.BASE_URL.replace(/\/+$/, "");
    for (const l of SUPPORTED_LANGS) upsertLink("alternate", `${origin}/${l}${rest === "/" ? "" : rest}`, l);
    upsertLink("alternate", `${origin}/id${rest === "/" ? "" : rest}`, "x-default");
    upsertLink("canonical", `${origin}${pathname}`);
  }, [fullTitle, desc, pathname, i18n.language]);

  return null;
}
