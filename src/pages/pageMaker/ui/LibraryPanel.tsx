import { useTranslation } from "react-i18next";
import { Check, ExternalLink, Library, Plus, X } from "lucide-react";
import { Field } from "../core/helpers/SmallUIHelpers";
import {
  ANIMATE_EFFECTS,
  ANIMATE_SPEEDS,
  AOS_EFFECTS,
  DEFAULT_LIBS,
  LIBRARIES,
  SCROLL_AMOUNT,
  SCROLL_EFFECTS,
  type EffectLibraryId,
  type LibraryId,
  type NodeLibs,
} from "../engine/helpers/libraries";
import type { ComponentNode } from "../engine/helpers/componentTypes";

const SELECT =
  "w-full rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs text-gray-800 focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";

/**
 * The "Library" tab in the Add panel: installs/removes CDN libraries for this design.
 * Installed libraries load in Preview & the exported output; their effects are configured
 * per element/box in Settings → Library.
 */
export function LibraryManager({ installed, onToggle }: { installed: readonly LibraryId[]; onToggle: (id: LibraryId) => void }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-2" data-testid="library-tab">
      <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">{t("pm.library.cdnHint")}</p>
      {LIBRARIES.map((l) => {
        const on = installed.includes(l.id);
        if (l.auto)
          return (
            <div key={l.id} className="rounded-lg border border-dashed border-gray-300 px-3 py-2.5 dark:border-gray-700" data-testid={`library-${l.id}`}>
              <div className="flex items-start gap-2">
                <Library className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                    {l.name} <span className="text-[11px] font-normal text-gray-500">v{l.version}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t(`pm.library.items.${l.id}`)}</p>
                  <p className="mt-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">{t(`pm.library.auto.${l.id}`)}</p>
                </div>
              </div>
            </div>
          );
        return (
          <div key={l.id} className={`rounded-lg border px-3 py-2.5 ${on ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-500/40 dark:bg-emerald-500/10" : "border-gray-200 dark:border-gray-800"}`} data-testid={`library-${l.id}`}>
            <div className="flex items-start gap-2">
              <Library className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 dark:text-white/90">
                  {l.name} <span className="text-[11px] font-normal text-gray-500">v{l.version}</span>
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(`pm.library.items.${l.id}`)}</p>
                {l.homepage && (
                  <a href={l.homepage} target="_blank" rel="noopener noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-blue-700 underline dark:text-blue-300">
                    {t("pm.library.docs")} <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>
              <button
                type="button"
                onClick={() => onToggle(l.id)}
                aria-pressed={on}
                className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${on ? "bg-white text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50 dark:bg-gray-900" : "bg-blue-700 text-white hover:bg-blue-800"}`}
                data-testid={`library-toggle-${l.id}`}
              >
                {on ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />} {on ? t("pm.library.remove") : t("pm.library.install")}
              </button>
            </div>
            {on && (
              <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                <Check className="h-3 w-3" /> {t("pm.library.installed")}
              </p>
            )}
          </div>
        );
      })}
      <p className="text-[11px] leading-snug text-gray-400">{t("pm.library.cdnNote")}</p>
    </div>
  );
}

/** Settings → Library: per-element/box effects for installed libraries. */
export function NodeLibraryPanel({
  node,
  installed,
  onChange,
  onInstall,
}: {
  node: ComponentNode;
  installed: readonly LibraryId[];
  onChange: (libs: NodeLibs | undefined, key: string) => void;
  onInstall: (id: LibraryId) => void;
}) {
  const { t } = useTranslation();
  const libs = node.libs ?? {};
  const set = <K extends keyof NodeLibs>(k: K, v: NodeLibs[K] | undefined) => {
    const next: NodeLibs = { ...libs, [k]: v };
    if (!v) delete next[k];
    onChange(Object.keys(next).length ? next : undefined, `lib:${node.id}:${k}`);
  };
  const toggle = (id: EffectLibraryId) => (
    <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
      <input type="checkbox" checked={!!libs[id]} onChange={(e) => set(id, e.target.checked ? structuredClone(DEFAULT_LIBS[id]) : undefined)} data-testid={`node-lib-${id}`} />
      {t(`pm.library.enable.${id}`)}
    </label>
  );
  const num = (value: number, onValue: (n: number) => void, o: { min: number; max: number; step: number; label: string }) => (
    <Field label={o.label}>
      <input type="number" className={SELECT} value={value} min={o.min} max={o.max} step={o.step} onChange={(e) => onValue(Math.min(o.max, Math.max(o.min, Number(e.target.value) || 0)))} />
    </Field>
  );

  return (
    <div className="flex flex-col gap-3" data-testid="node-library-panel">
      {LIBRARIES.map((l) => {
        if (l.auto) return null;
        if (!installed.includes(l.id))
          return (
            <div key={l.id} className="flex items-center justify-between gap-2 rounded-lg border border-dashed border-gray-300 px-2.5 py-2 text-xs dark:border-gray-700">
              <span className="text-gray-500 dark:text-gray-400">{t("pm.library.notInstalled", { name: l.name })}</span>
              <button type="button" onClick={() => onInstall(l.id)} className="shrink-0 font-semibold text-blue-700 hover:underline dark:text-blue-300">
                {t("pm.library.install")}
              </button>
            </div>
          );
        return (
          <div key={l.id} className="flex flex-col gap-2 rounded-lg border border-gray-200 p-2.5 dark:border-gray-800">
            {toggle(l.id as EffectLibraryId)}
            {l.id === "aos" && libs.aos && (
              <>
                <Field label={t("pm.library.effect")}>
                  <select className={SELECT} value={libs.aos.effect} onChange={(e) => set("aos", { ...libs.aos!, effect: e.target.value as typeof libs.aos.effect })}>
                    {AOS_EFFECTS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-2">
                  {num(libs.aos.duration, (n) => set("aos", { ...libs.aos!, duration: n }), { min: 0, max: 3000, step: 50, label: t("pm.library.durationMs") })}
                  {num(libs.aos.delay, (n) => set("aos", { ...libs.aos!, delay: n }), { min: 0, max: 3000, step: 50, label: t("pm.library.delayMs") })}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={libs.aos.once} onChange={(e) => set("aos", { ...libs.aos!, once: e.target.checked })} />
                  {t("pm.library.once")}
                </label>
              </>
            )}
            {l.id === "animate" && libs.animate && (
              <>
                <Field label={t("pm.library.effect")}>
                  <select className={SELECT} value={libs.animate.effect} onChange={(e) => set("animate", { ...libs.animate!, effect: e.target.value as typeof libs.animate.effect })}>
                    {ANIMATE_EFFECTS.map((x) => (
                      <option key={x} value={x}>
                        {x}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-3 gap-2">
                  <Field label={t("pm.library.speed")}>
                    <select className={SELECT} value={libs.animate.speed} onChange={(e) => set("animate", { ...libs.animate!, speed: e.target.value as typeof libs.animate.speed })}>
                      {ANIMATE_SPEEDS.map((x) => (
                        <option key={x} value={x}>
                          {t(`pm.library.speeds.${x}`)}
                        </option>
                      ))}
                    </select>
                  </Field>
                  {num(libs.animate.delay, (n) => set("animate", { ...libs.animate!, delay: n }), { min: 0, max: 5, step: 1, label: t("pm.library.delayS") })}
                  {num(libs.animate.repeat, (n) => set("animate", { ...libs.animate!, repeat: n }), { min: 0, max: 3, step: 1, label: t("pm.library.repeat") })}
                </div>
              </>
            )}
            {l.id === "tilt" && libs.tilt && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  {num(libs.tilt.max, (n) => set("tilt", { ...libs.tilt!, max: n }), { min: 1, max: 35, step: 1, label: t("pm.library.tiltMax") })}
                  {num(libs.tilt.scale, (n) => set("tilt", { ...libs.tilt!, scale: n }), { min: 1, max: 1.2, step: 0.01, label: t("pm.library.scale") })}
                </div>
                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                  <input type="checkbox" checked={libs.tilt.glare} onChange={(e) => set("tilt", { ...libs.tilt!, glare: e.target.checked })} />
                  {t("pm.library.glare")}
                </label>
              </>
            )}
            {l.id === "scroll" && libs.scroll && (
              <>
                <Field label={t("pm.library.effect")}>
                  <select className={SELECT} value={libs.scroll.effect} onChange={(e) => set("scroll", { ...libs.scroll!, effect: e.target.value as typeof libs.scroll.effect, amount: 0 })} data-testid="node-lib-scroll-effect">
                    {SCROLL_EFFECTS.map((x) => (
                      <option key={x} value={x}>
                        {t(`pm.library.scrollFx.${x}`)}
                      </option>
                    ))}
                  </select>
                </Field>
                <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">{t(`pm.library.scrollHint.${libs.scroll.effect}`)}</p>
                <div className="grid grid-cols-2 gap-2">
                  {num(libs.scroll.amount || SCROLL_AMOUNT[libs.scroll.effect].def, (n) => set("scroll", { ...libs.scroll!, amount: n }), {
                    min: SCROLL_AMOUNT[libs.scroll.effect].min,
                    max: SCROLL_AMOUNT[libs.scroll.effect].max,
                    step: 1,
                    label: t("pm.library.amount", { unit: SCROLL_AMOUNT[libs.scroll.effect].unit }),
                  })}
                  {num(libs.scroll.delay, (n) => set("scroll", { ...libs.scroll!, delay: n }), { min: 0, max: 3000, step: 50, label: t("pm.library.delayMs") })}
                </div>
              </>
            )}
          </div>
        );
      })}
      <p className="text-[11px] leading-snug text-gray-400">{t("pm.library.previewNote")}</p>
    </div>
  );
}
