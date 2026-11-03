import { Code2, Eye, Monitor, PencilRuler, Smartphone, Tablet } from "lucide-react";

/* Konstanta & util kecil editor halaman (dipisah dari PageMaker.tsx, no. 15). */

export type Mode = "design" | "preview" | "code";
export type Viewport = "desktop" | "tablet" | "mobile";

/** `label` = kunci i18n (diterjemahkan saat render). */
export const VIEWPORTS: { id: Viewport; label: string; width: number | null; icon: typeof Monitor }[] = [
  { id: "desktop", label: "pm.editor.viewport.desktop", width: null, icon: Monitor },
  { id: "tablet", label: "pm.editor.viewport.tablet", width: 768, icon: Tablet },
  { id: "mobile", label: "pm.editor.viewport.mobile", width: 375, icon: Smartphone },
];
export const MODES: { id: Mode; label: string; icon: typeof Eye }[] = [
  { id: "design", label: "pm.editor.mode.design", icon: PencilRuler },
  { id: "preview", label: "pm.editor.mode.preview", icon: Eye },
  { id: "code", label: "pm.editor.mode.code", icon: Code2 },
];

export const isViewport = (v: unknown): v is Viewport => v === "desktop" || v === "tablet" || v === "mobile";
export const isMode = (v: unknown): v is Mode => v === "design" || v === "preview" || v === "code";
export const isBool = (v: unknown): v is boolean => typeof v === "boolean";

export const BAR_BTN =
  "inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5";
export const SEG_ON = "bg-blue-800 text-white";
export const SEG_OFF = "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5";

export function summarize(state: unknown): string {
  if (!state || typeof state !== "object") return "";
  const s = state as Record<string, unknown>;
  for (const k of ["text", "title", "label", "placeholder", "src"]) {
    if (typeof s[k] === "string" && (s[k] as string).trim()) return (s[k] as string).trim().slice(0, 40);
  }
  return "";
}
