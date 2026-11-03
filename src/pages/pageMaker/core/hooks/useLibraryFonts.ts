import { useLayoutEffect } from "react";
import { loadersCss } from "../helpers/fontCss";
import { useFontStore } from "../store/fontStore";

const STYLE_ID = "om-library-fonts";

/**
 * Muat SEMUA font pustaka ke dokumen aplikasi lewat satu <style> di <head>,
 * supaya pratinjau di DOM (Element Maker), pemilih font, dan halaman
 * Global Setting menampilkan font yang benar. (Iframe pratinjau Component/
 * Page Maker memuat font sendiri lewat CSS hasil compose.)
 */
export function useLibraryFonts(): void {
  const fonts = useFontStore((s) => s.fonts);
  useLayoutEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = loadersCss(fonts);
  }, [fonts]);
}
