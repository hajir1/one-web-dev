import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Box, Play, RotateCcw, Sparkles } from "lucide-react";
import { ANIM_EASING_IDS, ANIM_EASINGS, motionCss, presetsOfKind, type AnimPreset } from "../../pageMaker/engine/helpers/motion";
import { DEFAULT_THREE, useMotionStore, type ThreeQuality } from "../../pageMaker/core/store/motionStore";

/* ================================================================== */
/* Tab "Animasi & 3D" Pengaturan Global (v9).                            */
/* Default values for CSS animations (Styling panel → Animation) and 3D */
/* elements. Written as --owd-anim-* / --owd-3d-* variables in the exported */
/* :root, only when the design uses animations or 3D elements.          */
/* ================================================================== */

const INPUT = "w-full rounded border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100";
const BTN_GHOST =
  "inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5";

function Row({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-snug text-gray-500 dark:text-gray-400">{hint}</span>}
    </label>
  );
}

function Num({ value, onChange, min, max, step = 1, suffix }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number; suffix?: string }) {
  return (
    <div className="flex items-center gap-2">
      <input type="number" className={INPUT} value={value} min={min} max={max} step={step} onChange={(e) => e.target.value !== "" && onChange(Number(e.target.value))} />
      {suffix && <span className="shrink-0 text-xs text-gray-500">{suffix}</span>}
    </div>
  );
}

function Check({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-gray-300" />
      {label}
    </label>
  );
}

const ENTRANCE = presetsOfKind("entrance");

export default function MotionManager() {
  const { t } = useTranslation();
  const anim = useMotionStore((s) => s.anim);
  const three = useMotionStore((s) => s.three);
  const setAnim = useMotionStore((s) => s.setAnim);
  const setThree = useMotionStore((s) => s.setThree);
  const reset = useMotionStore((s) => s.reset);
  const [demo, setDemo] = useState<AnimPreset>("fade-up");
  const [run, setRun] = useState(0);

  const demoCss = useMemo(() => motionCss([demo]).replace(/\.owd-/g, ".gs-demo .owd-"), [demo]);
  const demoVars = {
    "--owd-anim-duration": `${anim.duration}ms`,
    "--owd-anim-delay": `${anim.delay}ms`,
    "--owd-anim-easing": ANIM_EASINGS[anim.easing],
    "--owd-anim-distance": `${anim.distance}px`,
  } as CSSProperties;

  return (
    <div className="grid gap-6 lg:grid-cols-2" data-testid="motion-manager">
      <section className="space-y-4 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Sparkles size={16} className="text-blue-700 dark:text-blue-400" /> {t("gs.motion.animTitle")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("gs.motion.animText")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Row label={t("gs.motion.duration")}>
            <Num value={anim.duration} min={50} max={10000} step={50} suffix="ms" onChange={(v) => setAnim({ duration: v })} />
          </Row>
          <Row label={t("gs.motion.delay")}>
            <Num value={anim.delay} min={0} max={10000} step={50} suffix="ms" onChange={(v) => setAnim({ delay: v })} />
          </Row>
          <Row label={t("gs.motion.easing")}>
            <select className={INPUT} value={anim.easing} onChange={(e) => setAnim({ easing: e.target.value as typeof anim.easing })} data-testid="gs-motion-easing">
              {ANIM_EASING_IDS.map((id) => (
                <option key={id} value={id}>
                  {t(`pm.anim.easings.${id}`)}
                </option>
              ))}
            </select>
          </Row>
          <Row label={t("gs.motion.distance")} hint={t("gs.motion.distanceHint")}>
            <Num value={anim.distance} min={0} max={200} suffix="px" onChange={(v) => setAnim({ distance: v })} />
          </Row>
          <Row label={t("gs.motion.trigger")} hint={t("gs.motion.triggerHint")}>
            <select className={INPUT} value={anim.trigger} onChange={(e) => setAnim({ trigger: e.target.value === "load" ? "load" : "scroll" })}>
              <option value="scroll">{t("pm.anim.triggers.scroll")}</option>
              <option value="load">{t("pm.anim.triggers.load")}</option>
            </select>
          </Row>
          <div className="flex items-end pb-2">
            <Check checked={anim.once} onChange={(v) => setAnim({ once: v })} label={t("gs.motion.once")} />
          </div>
        </div>
        <p className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-snug text-gray-500 dark:bg-white/5 dark:text-gray-400">{t("gs.motion.reducedNote")}</p>

        <div className="gs-demo rounded-lg border border-dashed border-gray-300 p-4 dark:border-gray-700" style={demoVars}>
          <style>{demoCss}</style>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <select className={`${INPUT} max-w-48`} value={demo} onChange={(e) => (setDemo(e.target.value as AnimPreset), setRun((n) => n + 1))} aria-label={t("gs.motion.demo")}>
              {ENTRANCE.map((id) => (
                <option key={id} value={id}>
                  {t(`pm.anim.presets.${id}`)}
                </option>
              ))}
            </select>
            <button type="button" className={BTN_GHOST} onClick={() => setRun((n) => n + 1)}>
              <Play size={14} /> {t("gs.motion.replay")}
            </button>
          </div>
          <div key={`${demo}-${run}-${anim.duration}-${anim.delay}-${anim.easing}-${anim.distance}`} className={`owd-anim owd-anim--${demo} rounded-lg bg-blue-700 px-4 py-6 text-center text-sm font-semibold text-white`}>
            {t("gs.motion.demoBox")}
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-xl border border-gray-200 p-5 dark:border-gray-800">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
          <Box size={16} className="text-blue-700 dark:text-blue-400" /> {t("gs.motion.threeTitle")}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("gs.motion.threeText")}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Row label={t("gs.motion.quality")} hint={t("gs.motion.qualityHint")}>
            <select className={INPUT} value={three.quality} onChange={(e) => setThree({ quality: e.target.value as ThreeQuality })} data-testid="gs-three-quality">
              {(["auto", "low", "high"] as const).map((q) => (
                <option key={q} value={q}>
                  {t(`gs.motion.qualities.${q}`)}
                </option>
              ))}
            </select>
          </Row>
          <Row label={t("gs.motion.maxDpr")} hint={t("gs.motion.maxDprHint")}>
            <select className={INPUT} value={three.maxDpr} onChange={(e) => setThree({ maxDpr: Number(e.target.value) })}>
              {[1, 1.25, 1.5, 1.75, 2].map((d) => (
                <option key={d} value={d}>
                  {d}×
                </option>
              ))}
            </select>
          </Row>
          <Row label={t("gs.motion.rotateSpeed")}>
            <Num value={three.rotateSpeed} min={0.2} max={3} step={0.1} suffix="×" onChange={(v) => setThree({ rotateSpeed: v })} />
          </Row>
          <div className="flex flex-col justify-end gap-2 pb-1">
            <Check checked={three.autoRotate} onChange={(v) => setThree({ autoRotate: v })} label={t("gs.motion.autoRotate")} />
            <Check checked={three.interactive} onChange={(v) => setThree({ interactive: v })} label={t("gs.motion.interactive")} />
          </div>
        </div>
        <ul className="list-disc space-y-1 pl-5 text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          <li>{t("gs.motion.threeNoteLazy")}</li>
          <li>{t("gs.motion.threeNoteFallback")}</li>
          <li>{t("gs.motion.threeNoteLicense")}</li>
        </ul>
        <div className="flex justify-end">
          <button
            type="button"
            className={BTN_GHOST}
            onClick={() => window.confirm(t("gs.motion.resetConfirm")) && reset()}
            disabled={JSON.stringify(three) === JSON.stringify(DEFAULT_THREE) && anim.duration === 700 && anim.easing === "smooth" && anim.delay === 0 && anim.distance === 24 && anim.trigger === "scroll" && anim.once}
          >
            <RotateCcw size={14} /> {t("gs.motion.reset")}
          </button>
        </div>
      </section>
    </div>
  );
}
