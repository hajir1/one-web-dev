import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Braces, Unlink } from "lucide-react";
import i18n from "../../../../i18n";
import { refName, sizeToPx, varRef, type CssVar, type VarType } from "../helpers/cssVars";

/* ================================================================== */
/* Global variable picker (v7) for color, size, and font fields.        */
/*                                                                    */
/* Active only inside <VarPickerProvider> (the Page Maker element panel), */
/* because compose only maps var(--x) for element state. The stored     */
/* value is the string `var(--x)`.                                      */
/* ================================================================== */

const VarPickerContext = createContext<readonly CssVar[] | null>(null);

export const VarPickerProvider = VarPickerContext.Provider;

export function useVarPicker(): readonly CssVar[] | null {
  return useContext(VarPickerContext);
}

/** Sample text of a variable value for the list & chip. */
function preview(v: CssVar): string {
  return v.type === "font" ? v.value.split(",")[0].replace(/["']/g, "") : v.value;
}

/** A "value from variable" chip + a detach button (back to a manual value). */
export function VarChip({ value, onDetach }: { value: string; onDetach: () => void }) {
  const vars = useVarPicker() ?? [];
  const name = refName(value) ?? "";
  const v = vars.find((x) => x.name === name);
  return (
    <div className="flex min-w-0 items-center gap-2 rounded border border-blue-300 bg-blue-50 px-2 py-1 dark:border-blue-500/40 dark:bg-blue-500/10">
      {v?.type === "color" && <span className="h-5 w-5 shrink-0 rounded border border-black/10" style={{ background: v.value }} />}
      <Braces size={13} className="shrink-0 text-blue-700 dark:text-blue-300" />
      <span className="min-w-0 flex-1 truncate font-mono text-xs text-blue-800 dark:text-blue-200" title={v ? `--${name}: ${v.value}` : undefined}>
        --{name}
        <span className="ml-1 text-gray-500 dark:text-gray-400">{v ? preview(v) : i18n.t("gs.vars.missing")}</span>
      </span>
      <button type="button" onClick={onDetach} title={i18n.t("gs.vars.detach")} aria-label={i18n.t("gs.vars.detach")} className="shrink-0 rounded p-0.5 text-gray-500 hover:bg-white hover:text-gray-800 dark:hover:bg-white/10">
        <Unlink size={13} />
      </button>
    </div>
  );
}

/** The {} button that opens the list of variables of type `type`. */
export function VarButton({ type, onPick }: { type: VarType; onPick: (ref: string) => void }) {
  const vars = useVarPicker();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  if (!vars) return null;
  const list = vars.filter((v) => v.type === type);
  return (
    <div ref={box} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        title={i18n.t("gs.vars.pick")}
        aria-label={i18n.t("gs.vars.pick")}
        aria-expanded={open}
        data-testid="var-button"
        className="inline-flex h-7 w-7 items-center justify-center rounded border border-gray-300 text-gray-500 hover:text-blue-700 dark:border-gray-700 dark:text-gray-400"
      >
        <Braces size={13} />
      </button>
      {open && (
        <div role="listbox" className="absolute right-0 z-50 mt-1 max-h-64 w-60 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
          {list.length === 0 && <p className="px-2 py-2 text-xs text-gray-500">{i18n.t("gs.vars.noneOfType")}</p>}
          {list.map((v) => (
            <button
              key={v.name}
              type="button"
              role="option"
              aria-selected={false}
              onClick={() => {
                onPick(varRef(v.name));
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-gray-100 dark:hover:bg-white/10"
            >
              {v.type === "color" && <span className="h-4 w-4 shrink-0 rounded border border-black/10" style={{ background: v.value }} />}
              <span className="min-w-0 flex-1 truncate font-mono text-gray-800 dark:text-gray-100" style={v.type === "font" ? { fontFamily: v.value } : undefined}>
                --{v.name}
              </span>
              <span className="shrink-0 truncate text-[11px] text-gray-500">{preview(v)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Numeric value when a size variable reference is detached. */
export function detachNumber(value: string, vars: readonly CssVar[] | null): number {
  const v = vars?.find((x) => x.name === refName(value));
  return v ? sizeToPx(v.value) : 0;
}

/** Color value when a color variable reference is detached. */
export function detachColor(value: string, vars: readonly CssVar[] | null): string {
  return vars?.find((x) => x.name === refName(value))?.value ?? "#000000";
}
