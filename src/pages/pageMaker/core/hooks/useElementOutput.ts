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

/** An icon finder that updates when the icon library changes. */
export function useIconLookup(): IconLookup {
  const icons = useIconStore((st) => st.icons);
  return useMemo(() => makeIconLookup(icons), [icons]);
}

/**
 * An element's CSS + markup + generated files, from its definition.
 * Used by every Element Maker page.
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
  // Standalone export code: library fonts in use are loaded too (@import / @font-face).
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
