import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Crown, Gift, Sparkles, X } from "lucide-react";
import { boxBackground, type BoxNode, type SectionKind } from "../engine/helpers/componentTypes";
import { ThumbNode } from "../engine/ui/ThumbNode";
import { presetTree } from "../helpers/pageDoc";
import {
  COLUMN_LAYOUTS,
  SPECIALTY_LAYOUTS,
  createFullwidthSection,
  createRegularSection,
  createSpecialtySection,
  fractionLabel,
  specialtyLabel,
} from "../helpers/sectionTypes";
import { ColumnBars, SpecialtyBars } from "./LayoutThumb";
import { FREE_PRESETS, PREMIUM_PRESETS_LIST, type SectionPreset } from "../helpers/sectionPresets";
import { backgroundCss } from "../core/helpers/background";
import { AccessBadge } from "../../../marketplace/ui/AccessBadge";
import { usePieceAccess } from "../../../marketplace/ui/pieceAccess";
import { isDemoMode } from "../../../demo/demoMode";

const FAMILY_BADGE: Record<SectionPreset["family"], string> = {
  stack: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  row: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  grid: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
};

/**
 * Thumbnail = EXACTLY the section that will be added: with sample content when
 * ticked, or its empty skeleton (Rows & columns) when not. There are no
 * decorative blocks that are not added.
 */
function SectionThumb({ preset, withContent }: { preset: SectionPreset; withContent: boolean }) {
  const root = useMemo(() => presetTree(preset, withContent), [preset, withContent]);
  const b = boxBackground(root);
  const bg = b.bgType === "none" ? "#ffffff" : backgroundCss(b);
  return (
    <div className="h-20 w-full overflow-hidden rounded border border-gray-100 dark:border-gray-800" style={{ background: bg }} aria-hidden="true">
      <ThumbNode node={root} parent={null} isRoot leafMin={withContent ? 9 : 30} />
    </div>
  );
}

function PresetGroup({
  title,
  hint,
  presets,
  premium = false,
  withContent,
  onPick,
  testId,
}: {
  title: string;
  hint: string;
  presets: SectionPreset[];
  premium?: boolean;
  withContent: boolean;
  onPick: (preset: SectionPreset) => void;
  testId: string;
}) {
  const { t } = useTranslation();
  const access = usePieceAccess();
  return (
    <section aria-label={title} data-testid={testId}>
      <div className="mb-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <h5 className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">
          {premium ? <Crown className="h-3.5 w-3.5 text-amber-500" /> : isDemoMode() ? <Sparkles className="h-3.5 w-3.5 text-brand-600" /> : <Gift className="h-3.5 w-3.5 text-emerald-600" />}
          {title}
        </h5>
        <span className="text-[11px] text-gray-500 dark:text-gray-400">{hint}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {presets.map((p) => {
          const locked = access.reason(`preset:${p.id}`, p.tier) === "locked";
          return (
            <button
              key={p.id}
              type="button"
              data-testid={`preset-${p.id}`}
              data-tier={p.tier}
              data-locked={locked}
              onClick={() => onPick(p)}
              title={locked ? t("pm.picker.premiumTitle", { description: p.description }) : p.description}
              aria-label={locked ? t("pm.picker.premiumAria", { name: p.name }) : p.name}
              className={`relative rounded-lg border p-1.5 text-left transition focus-visible:outline-2 focus-visible:outline-blue-600 ${
                premium
                  ? "border-amber-200 hover:border-amber-400 hover:ring-2 hover:ring-amber-400/20 dark:border-amber-500/30"
                  : "border-gray-200 hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 dark:border-gray-800"
              }`}
            >
              <div className={locked ? "opacity-80" : ""}>
                <SectionThumb preset={p} withContent={withContent} />
              </div>
              <AccessBadge itemId={`preset:${p.id}`} tier={p.tier} className="absolute right-2.5 top-2.5" />
              {p.isNew && (
                <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-blue-700 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
                  <Sparkles className="h-2.5 w-2.5" /> {t("market.badge.new")}
                </span>
              )}
              <div className="mt-1.5 flex items-center justify-between gap-1 px-0.5">
                <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-200">{p.name}</span>
                <span className={`shrink-0 rounded px-1 py-0.5 text-[9px] font-semibold uppercase ${FAMILY_BADGE[p.family]}`}>{p.family}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 px-0.5 text-[10px] leading-snug text-gray-500 dark:text-gray-400">{p.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}

type Tab = "new" | "library";
type Step = "kind" | "regular" | "specialty";

const KIND_STYLE: Record<SectionKind, string> = {
  regular: "bg-blue-600 hover:bg-blue-700 focus-visible:outline-blue-600",
  specialty: "bg-rose-500 hover:bg-rose-600 focus-visible:outline-rose-500",
  fullwidth: "bg-violet-600 hover:bg-violet-700 focus-visible:outline-violet-600",
};

/** Section type buttons (colors follow Divi: blue, red, purple). */
function KindButton({ kind, onClick }: { kind: SectionKind; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      data-testid={`section-kind-${kind}`}
      onClick={onClick}
      className={`flex flex-col items-start gap-2 rounded-xl p-4 text-left text-white shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-2 ${KIND_STYLE[kind]}`}
    >
      <span className="text-sm font-semibold">{t(`pm.insert.kind.${kind}.name`)}</span>
      <span className="w-full rounded bg-white/15 p-1.5">
        {kind === "regular" && <ColumnBars fr={[1, 1, 1]} tone="white" height={18} />}
        {kind === "specialty" && <SpecialtyBars layout={SPECIALTY_LAYOUTS[0]} height={18} />}
        {kind === "fullwidth" && <div className="h-[18px] w-full rounded-sm bg-white/70" />}
      </span>
      <span className="text-[11px] leading-snug text-white/85">{t(`pm.insert.kind.${kind}.hint`)}</span>
    </button>
  );
}

const LAYOUT_BTN =
  "flex flex-col gap-1.5 rounded-lg border border-gray-200 p-2 text-left transition hover:border-blue-500 hover:ring-2 hover:ring-blue-500/20 focus-visible:outline-2 focus-visible:outline-blue-600 dark:border-gray-800";

export default function SectionPicker({
  positionLabel,
  onPick,
  onCreate,
  onClose,
}: {
  positionLabel: string;
  /** Sections from the preset library. */
  onPick: (preset: SectionPreset, withContent: boolean) => void;
  /** A new empty section (Regular / Specialty / Full Width). */
  onCreate: (node: BoxNode, kind: SectionKind) => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<Tab>("new");
  const [step, setStep] = useState<Step>("kind");
  // Library = ready-made designs: built-ins WITH sample content (thumbnails follow this choice).
  // Empty sections are created through the "New Section" tab.
  const [withContent, setWithContent] = useState(true);
  const pick = (p: SectionPreset) => onPick(p, withContent);
  const create = (node: BoxNode | null, kind: SectionKind) => node && onCreate(node, kind);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  const tabBtn = (id: Tab) => (
    <button
      type="button"
      role="tab"
      aria-selected={tab === id}
      data-testid={`insert-tab-${id}`}
      onClick={() => {
        setTab(id);
        setStep("kind");
      }}
      className={`border-b-2 px-4 py-2.5 text-xs font-semibold transition ${
        tab === id ? "border-blue-600 text-blue-700 dark:text-blue-400" : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
      }`}
    >
      {t(id === "new" ? "pm.insert.tabNew" : "pm.insert.tabLibrary")}
    </button>
  );

  return createPortal(
    <div
      className="fixed inset-0 z-99999 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("pm.insert.title")}
        data-testid="section-picker"
        className="flex max-h-[88vh] w-full max-w-4xl flex-col rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("pm.insert.title")}</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("pm.picker.subtitle", { position: positionLabel })}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t("common.close")} className="rounded p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div role="tablist" className="mt-2 flex border-b border-gray-200 px-3 dark:border-gray-800">
          {tabBtn("new")}
          {tabBtn("library")}
        </div>

        {tab === "new" && (
          <div className="flex flex-col gap-4 overflow-y-auto p-5" data-testid="insert-new">
            {step === "kind" && (
              <>
                <div className="grid gap-3 sm:grid-cols-3">
                  <KindButton kind="regular" onClick={() => setStep("regular")} />
                  <KindButton kind="specialty" onClick={() => setStep("specialty")} />
                  <KindButton kind="fullwidth" onClick={() => create(createFullwidthSection(), "fullwidth")} />
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("pm.insert.emptyNote")}</p>
              </>
            )}
            {step !== "kind" && (
              <>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setStep("kind")}
                    data-testid="insert-back"
                    className="inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> {t("pm.insert.back")}
                  </button>
                  <h5 className="text-xs font-semibold text-gray-800 dark:text-white/90">
                    {t(`pm.insert.kind.${step}.name`)} · {t(step === "regular" ? "pm.insert.pickColumns" : "pm.insert.pickSpecialty")}
                  </h5>
                </div>
                {step === "regular" && (
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4" data-testid="regular-layouts">
                    {COLUMN_LAYOUTS.map((l) => (
                      <button key={l.id} type="button" data-testid={`regular-${l.id}`} onClick={() => create(createRegularSection(l.id), "regular")} className={LAYOUT_BTN}>
                        <ColumnBars fr={l.fr} />
                        <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{fractionLabel(l.fr)}</span>
                      </button>
                    ))}
                  </div>
                )}
                {step === "specialty" && (
                  <>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("pm.insert.specialtyHint")}</p>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3" data-testid="specialty-layouts">
                      {SPECIALTY_LAYOUTS.map((l) => (
                        <button key={l.id} type="button" data-testid={`specialty-${l.id}`} onClick={() => create(createSpecialtySection(l.id), "specialty")} className={LAYOUT_BTN}>
                          <SpecialtyBars layout={l} />
                          <span className="text-[11px] font-medium text-gray-600 dark:text-gray-300">{specialtyLabel(l)}</span>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        )}

        {tab === "library" && (
          <>
            <label className="flex items-start gap-2 border-b border-gray-200 px-5 py-2.5 text-xs text-gray-600 dark:border-gray-800 dark:text-gray-300">
              <input type="checkbox" className="mt-0.5" checked={withContent} onChange={(e) => setWithContent(e.target.checked)} data-testid="preset-with-content" />
              <span>
                <span className="font-semibold text-gray-800 dark:text-white/90">{t("pm.picker.withContent")}</span> — {t("pm.insert.withContentHint")}
              </span>
            </label>
            <div className="flex flex-col gap-6 overflow-y-auto p-5">
              {/* Demo mode (v15): one list without a Free/Premium split. */}
              {isDemoMode() ? (
                <PresetGroup
                  title={t("demo.pm.allTitle", { count: FREE_PRESETS.length + PREMIUM_PRESETS_LIST.length })}
                  hint={t("demo.pm.allHint")}
                  presets={[...FREE_PRESETS, ...PREMIUM_PRESETS_LIST]}
                  withContent={withContent}
                  onPick={pick}
                  testId="presets-all"
                />
              ) : (
                <>
              <PresetGroup
                title={t("pm.picker.freeTitle", { count: FREE_PRESETS.length })}
                hint={t("pm.picker.freeHint")}
                presets={FREE_PRESETS}
                withContent={withContent}
                onPick={pick}
                testId="presets-free"
              />
              <PresetGroup
                title={t("pm.picker.premiumGroupTitle", { count: PREMIUM_PRESETS_LIST.length })}
                hint={t("pm.picker.premiumHint")}
                premium
                presets={PREMIUM_PRESETS_LIST}
                withContent={withContent}
                onPick={pick}
                testId="presets-premium"
              />
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
