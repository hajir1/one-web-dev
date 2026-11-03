import { useMemo } from "react";
import type { Framework } from "../helpers/generatorCss";
import {
  makeIconLookup,
  type ElementDefinition,
  type IconLookup,
} from "../helpers/elementDefinition";
import { generateFrameworkFiles } from "../helpers/markup";
import { useIconStore } from "../store/iconStore";
import { useFontStore } from "../store/fontStore";
import { withFontCss } from "../helpers/fontCss";

/** Pencari ikon yang ikut berubah saat pustaka ikon berubah. */
export function useIconLookup(): IconLookup {
  const icons = useIconStore((st) => st.icons);
  return useMemo(() => makeIconLookup(icons), [icons]);
}

/**
 * CSS + markup + file hasil generate sebuah elemen, dari definisinya.
 * Dipakai semua halaman Element Maker.
 */
export function useElementOutput<S>(
  def: ElementDefinition<S>,
  s: S,
  cls: string,
  framework: Framework,
) {
  const lookup = useIconLookup();
  const spec = useMemo(() => def.spec(s, cls, lookup), [def, s, cls, lookup]);
  const fonts = useFontStore((st) => st.fonts);
  // Kode export mandiri: font pustaka yang dipakai ikut dimuat (@import / @font-face).
  const files = useMemo(
    () =>
      generateFrameworkFiles(framework, {
        name: def.componentName,
        ...spec,
        css: withFontCss(spec.css, fonts),
      }),
    [def, framework, spec, fonts],
  );
  return { spec, files };
}
