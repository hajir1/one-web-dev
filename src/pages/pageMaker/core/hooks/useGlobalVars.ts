import { useMemo } from "react";
import { libraryFontVars } from "../helpers/fontCss";
import { mergeVars, type CssVar } from "../helpers/cssVars";
import { useFontStore } from "../store/fontStore";
import { useVarStore } from "../store/varStore";
import { currentMotionVars, motionVars, useMotionStore } from "../store/motionStore";

/** Variabel efektif (v7): font pustaka (`--font-<nama>`) lalu variabel global (menang bila namanya sama). */
function globalVarsOf(fonts: Parameters<typeof libraryFontVars>[0], vars: readonly CssVar[]): CssVar[] {
  return mergeVars(libraryFontVars(fonts), vars);
}

/** Snapshot non-React (ekspor server, sinkron). */
export function currentGlobalVars(): CssVar[] {
  return globalVarsOf(useFontStore.getState().fonts, useVarStore.getState().vars);
}

export function useGlobalVars(): CssVar[] {
  const fonts = useFontStore((s) => s.fonts);
  const vars = useVarStore((s) => s.vars);
  return useMemo(() => globalVarsOf(fonts, vars), [fonts, vars]);
}

/**
 * v9: variabel untuk compose (pratinjau & ekspor) = variabel global + nilai
 * bawaan Animasi & 3D (--owd-anim-*, --owd-3d-*). Tidak ditampilkan di
 * pemilih variabel; compose hanya menulisnya bila desain memakainya.
 */
export function useComposeVars(): CssVar[] {
  const base = useGlobalVars();
  const anim = useMotionStore((s) => s.anim);
  const three = useMotionStore((s) => s.three);
  return useMemo(() => mergeVars(motionVars(anim, three), base), [base, anim, three]);
}

export function currentComposeVars(): CssVar[] {
  return mergeVars(currentMotionVars(), currentGlobalVars());
}
