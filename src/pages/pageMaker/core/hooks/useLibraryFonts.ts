import { useLayoutEffect } from "react";
import { loadersCss } from "../helpers/fontCss";
import { useFontStore } from "../store/fontStore";

const STYLE_ID = "om-library-fonts";

/**
 * Loads EVERY library font into the app document through one <style> in <head>,
 * so the DOM preview (Element Maker), the font picker, and the
 * Global Setting page show the right fonts. (The Component/Page Maker
 * preview iframe loads fonts itself through the composed CSS.)
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
