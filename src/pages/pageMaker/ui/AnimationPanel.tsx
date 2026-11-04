import { useTranslation } from "react-i18next";
import { Field } from "../core/helpers/SmallUIHelpers";
import { ANIM_EASING_IDS, ANIM_PRESETS, presetsOfKind, type AnimEasing, type AnimKind, type AnimPreset, type NodeAnim } from "../engine/helpers/motion";
import type { ComponentNode } from "../engine/helpers/componentTypes";
import { useMotionStore } from "../core/store/motionStore";

/* ================================================================== */
/* The "Animation" group in the Styling panel (v9): CSS animations without a library. */
/* Empty = follow Global Settings → Animation & 3D.                     */
/* ================================================================== */

interface Props {
  node: ComponentNode;
  onChange: (anim: NodeAnim | undefined, key: string) => void;
}

const SELECT = "w-full rounded border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
const KINDS: AnimKind[] = ["entrance", "loop", "hover"];

/** Optional number: empty = follow global. */
function OptNum({ value, onChange, placeholder, min, max, step, suffix }: { value?: number; onChange: (v: number | undefined) => void; placeholder: string; min: number; max: number; step: number; suffix: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <input
        type="number"
        className={SELECT}
        value={value ?? ""}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(e.target.value === "" ? undefined : Math.min(max, Math.max(min, Number(e.target.value))))}
      />
      <span className="shrink-0 text-[11px] text-gray-500">{suffix}</span>
    </div>
  );
}

export default function AnimationPanel({ node, onChange }: Props) {
  const { t } = useTranslation();
  const defaults = useMotionStore((s) => s.anim);
  const a = node.anim;
  const kind = a ? ANIM_PRESETS[a.preset].kind : null;
  const key = (k: string) => `anim:${node.id}:${k}`;
  const set = (patch: Partial<NodeAnim>, k: string) => {
    if (!a) return;
    const next = { ...a, ...patch } as NodeAnim;
    for (const f of Object.keys(next) as (keyof NodeAnim)[]) if (next[f] === undefined) delete next[f];
    onChange(next, key(k));
  };
  const choose = (preset: string) => {
    if (!preset) return onChange(undefined, key("preset"));
    const p = preset as AnimPreset;
    const k = ANIM_PRESETS[p].kind;
    // The global default trigger is stored when an animation is picked, so the export stays the same on other devices.
    onChange({ preset: p, ...(k === "entrance" ? { trigger: a?.trigger ?? defaults.trigger } : {}), ...(a?.duration !== undefined ? { duration: a.duration } : {}), ...(a?.easing ? { easing: a.easing } : {}) }, key("preset"));
  };

  return (
    <div className="flex flex-col gap-3" data-testid="animation-panel">
      <Field label={t("pm.anim.preset")}>
        <select className={SELECT} value={a?.preset ?? ""} onChange={(e) => choose(e.target.value)} data-testid="anim-preset">
          <option value="">{t("pm.anim.none")}</option>
          {KINDS.map((k) => (
            <optgroup key={k} label={t(`pm.anim.kinds.${k}`)}>
              {presetsOfKind(k).map((id) => (
                <option key={id} value={id}>
                  {t(`pm.anim.presets.${id}`)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      {a && kind === "entrance" && (
        <Field label={t("pm.anim.trigger")}>
          <select className={SELECT} value={a.trigger ?? defaults.trigger} onChange={(e) => set({ trigger: e.target.value === "load" ? "load" : "scroll" }, "trigger")} data-testid="anim-trigger">
            <option value="scroll">{t("pm.anim.triggers.scroll")}</option>
            <option value="load">{t("pm.anim.triggers.load")}</option>
          </select>
        </Field>
      )}

      {a && (
        <div className="grid grid-cols-2 gap-2">
          <Field label={t("pm.anim.duration")}>
            <OptNum value={a.duration} onChange={(v) => set({ duration: v }, "duration")} placeholder={String(kind === "hover" ? Math.round(defaults.duration * 0.4) : defaults.duration)} min={50} max={10000} step={50} suffix="ms" />
          </Field>
          {kind !== "hover" && (
            <Field label={t("pm.anim.delay")}>
              <OptNum value={a.delay} onChange={(v) => set({ delay: v }, "delay")} placeholder={String(defaults.delay)} min={0} max={10000} step={50} suffix="ms" />
            </Field>
          )}
          <Field label={t("pm.anim.easing")}>
            <select className={SELECT} value={a.easing ?? ""} onChange={(e) => set({ easing: (e.target.value || undefined) as AnimEasing | undefined }, "easing")}>
              <option value="">{t("pm.anim.followGlobal", { value: t(`pm.anim.easings.${defaults.easing}`) })}</option>
              {ANIM_EASING_IDS.map((id) => (
                <option key={id} value={id}>
                  {t(`pm.anim.easings.${id}`)}
                </option>
              ))}
            </select>
          </Field>
          {kind === "loop" && (
            <Field label={t("pm.anim.repeat")}>
              <OptNum value={a.repeat} onChange={(v) => set({ repeat: v }, "repeat")} placeholder="∞" min={0} max={20} step={1} suffix="×" />
            </Field>
          )}
          {kind === "entrance" && (a.trigger ?? defaults.trigger) === "scroll" && (
            <label className="col-span-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
              <input type="checkbox" checked={a.once ?? defaults.once} onChange={(e) => set({ once: e.target.checked === defaults.once ? undefined : e.target.checked }, "once")} />
              {t("pm.anim.once")}
            </label>
          )}
        </div>
      )}
      <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">{t("pm.anim.note")}</p>
    </div>
  );
}
