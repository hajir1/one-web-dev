import { useMemo } from "react";
import { libraryFontVars } from "../helpers/fontCss";
import { mergeVars, type CssVar } from "../helpers/cssVars";
import { useFontStore } from "../store/fontStore";
import { useVarStore } from "../store/varStore";
import { currentMotionVars, motionVars, useMotionStore } from "../store/motionStore";

/** Effective variables (v7): library fonts (`--font-<name>`), then global variables (which win when the names match). */
function globalVarsOf(fonts: Parameters<typeof libraryFontVars>[0], vars: readonly CssVar[]): CssVar[] {
  return mergeVars(libraryFontVars(fonts), vars);
}

/** Non-React snapshot (server export, sync). */
export function currentGlobalVars(): CssVar[] {
  return globalVarsOf(useFontStore.getState().fonts, useVarStore.getState().vars);
}

export function useGlobalVars(): CssVar[] {
  const fonts = useFontStore((s) => s.fonts);
  const vars = useVarStore((s) => s.vars);
  return useMemo(() => globalVarsOf(fonts, vars), [fonts, vars]);
}

/**
 * v9: variables for compose (preview & export) = global variables + the default
 * Animation & 3D values (--owd-anim-*, --owd-3d-*). Not shown in the
 * variable picker; compose only writes them when the design uses them.
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
