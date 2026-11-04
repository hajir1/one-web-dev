import type { ComponentType } from "react";
import { useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Braces, Shapes, SlidersHorizontal, Sparkles, Type, type LucideIcon } from "lucide-react";
import { useVarStore } from "../../pageMaker/core/store/varStore";
import VariableManager from "../ui/VariableManager";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import { useIconStore } from "../../pageMaker/core/store/iconStore";
import { useFontStore } from "../../pageMaker/core/store/fontStore";
import IconManager from "../ui/IconManager";
import FontManager from "../ui/FontManager";
import MotionManager from "../ui/MotionManager";
import { useMotionStore } from "../../pageMaker/core/store/motionStore";

/* ================================================================== */
/* Global Setting: configuration used by EVERY maker                    */
/*                                                                    */
/* Adding a new settings group (brand colors, spacing, etc.) =          */
/* adding one entry to SETTING_TABS + one panel component.              */
/* ================================================================== */

interface SettingTab {
  id: "icon" | "font" | "vars" | "motion";
  icon: LucideIcon;
  Panel: ComponentType;
  /** Number of library items (shown in the tab). */
  useCount: () => number;
}

const SETTING_TABS: SettingTab[] = [
  {
    id: "icon",
    icon: Shapes,
    Panel: IconManager,
    useCount: () => useIconStore((s) => s.icons.length),
  },
  {
    id: "font",
    icon: Type,
    Panel: FontManager,
    useCount: () => useFontStore((s) => s.fonts.length),
  },
  {
    id: "vars",
    icon: Braces,
    Panel: VariableManager,
    useCount: () => useVarStore((s) => s.vars.length),
  },
  {
    // v9: default values for CSS animations & 3D elements (count = settings changed from the defaults).
    id: "motion",
    icon: Sparkles,
    Panel: MotionManager,
    useCount: () =>
      useMotionStore((s) => {
        const a = s.anim;
        const th = s.three;
        return [a.duration !== 700, a.delay !== 0, a.easing !== "smooth", a.distance !== 24, a.trigger !== "scroll", !a.once, th.quality !== "auto", !th.autoRotate, th.rotateSpeed !== 1, th.maxDpr !== 1.5, !th.interactive].filter(Boolean).length;
      }),
  },
];

function TabButton({
  tab,
  active,
  onSelect,
}: {
  tab: SettingTab;
  active: boolean;
  onSelect: () => void;
}) {
  const { t } = useTranslation();
  const count = tab.useCount();
  const Icon = tab.icon;
  return (
    <button
      type="button"
      role="tab"
      id={`gs-tab-${tab.id}`}
      aria-selected={active}
      aria-controls={`gs-panel-${tab.id}`}
      onClick={onSelect}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "border-blue-800 text-blue-800 dark:border-blue-400 dark:text-blue-300"
          : "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
      }`}
    >
      <Icon size={16} />
      {t(`gs.tabs.${tab.id}.label`)}
      <span className="rounded-full bg-gray-100 px-1.5 py-px text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
        {count}
      </span>
    </button>
  );
}

export default function GlobalSetting() {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const active = SETTING_TABS.find((tab) => tab.id === params.get("tab")) ?? SETTING_TABS[0];
  const { Panel } = active;

  return (
    <>
      <AppMeta title={t("gs.title")} description={t("gs.metaDescription")} />
      <div className="flex min-h-screen flex-col gap-6">
        <PageHeader
          icon={SlidersHorizontal}
          title={t("gs.title")}
          description={t("gs.description")}
          crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("gs.title") }]}
          help="global-setting"
        />

        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-6 dark:border-gray-800 dark:bg-white/3 xl:px-8">
          <div
            role="tablist"
            aria-label={t("gs.tabsLabel")}
            className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-800"
          >
            {SETTING_TABS.map((tab) => (
              <TabButton
                key={tab.id}
                tab={tab}
                active={tab.id === active.id}
                onSelect={() => setParams({ tab: tab.id }, { replace: true })}
              />
            ))}
          </div>

          <div
            role="tabpanel"
            id={`gs-panel-${active.id}`}
            aria-labelledby={`gs-tab-${active.id}`}
            className="pt-6"
          >
            <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">{t(`gs.tabs.${active.id}.description`)}</p>
            <Panel />
          </div>
        </div>
      </div>
    </>
  );
}
