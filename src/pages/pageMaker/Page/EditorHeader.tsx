import { useTranslation } from "react-i18next";
import { ArrowLeft, Database, FolderOpen, Layers, Plus, Redo2, Rocket, Settings2, Undo2 } from "lucide-react";
import { Link } from "../../../components/app/LocaleLink";
import { BAR_BTN, MODES, SEG_OFF, SEG_ON, VIEWPORTS, type Mode, type Viewport } from "./editorUi";

/* Page editor top bar (preview width, undo/redo, structure, mode, add).
   Split out of PageMaker.tsx (no. 15). */

interface Props {
  siteMode: boolean;
  /** Title of the Studio page being edited. */
  pageTitle: string | null;
  dirty: boolean;
  designsOpen: boolean;
  layersOpen: boolean;
  viewport: Viewport;
  mode: Mode;
  canUndo: boolean;
  canRedo: boolean;
  crudCount: number;
  sectionCount: number;
  nextStepPath: string;
  onExit: () => void;
  onToggleDesigns: () => void;
  onViewport: (v: Viewport) => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleLayers: () => void;
  onPageSettings: () => void;
  onOpenCrud: () => void;
  onMode: (m: Mode) => void;
  onAdd: () => void;
}

export default function EditorHeader(p: Props) {
  const { t } = useTranslation();
  return (
    <header className="flex shrink-0 flex-wrap items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
      {!p.siteMode && (
        <>
          <button type="button" onClick={p.onExit} className={BAR_BTN} aria-label={t("pm.editor.exitAria")} title={t("pm.editor.exit")}>
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("pm.editor.exit")}</span>
          </button>
          <h1 className="mr-1 text-sm font-semibold">{t("nav.items.pageMaker.name")}</h1>
          <button type="button" onClick={p.onToggleDesigns} className={BAR_BTN} aria-pressed={p.designsOpen} title={t("pm.editor.designsTitle")}>
            <FolderOpen className="h-4 w-4" />
            <span className="hidden md:inline">{t("pm.editor.myDesigns")}</span>
            {p.dirty && <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-label={t("pm.editor.unsaved")} />}
          </button>
        </>
      )}
      {p.siteMode && p.pageTitle && (
        <h1 className="mr-1 max-w-40 truncate text-sm font-semibold" title={p.pageTitle}>
          {p.pageTitle}
        </h1>
      )}

      <div className="mx-auto flex items-center gap-1 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700" role="group" aria-label={t("pm.editor.viewportWidth")}>
        {VIEWPORTS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            aria-label={t(label)}
            title={t(label)}
            aria-pressed={p.viewport === id}
            onClick={() => p.onViewport(id)}
            className={`inline-flex h-7 w-8 items-center justify-center rounded-md transition ${p.viewport === id ? SEG_ON : SEG_OFF}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        <button type="button" className={BAR_BTN} onClick={p.onUndo} disabled={!p.canUndo} aria-label="Undo" title={t("pm.editor.undoTitle")}>
          <Undo2 className="h-4 w-4" />
        </button>
        <button type="button" className={BAR_BTN} onClick={p.onRedo} disabled={!p.canRedo} aria-label="Redo" title={t("pm.editor.redoTitle")}>
          <Redo2 className="h-4 w-4" />
        </button>
        <button type="button" className={BAR_BTN} onClick={p.onToggleLayers} aria-pressed={p.layersOpen} title={t("pm.editor.structureTitle")}>
          <Layers className="h-4 w-4" />
          <span className="hidden lg:inline">{t("pm.editor.structure")}</span>
        </button>
        <button type="button" className={BAR_BTN} onClick={p.onPageSettings} title={t("pm.editor.pageSettingsTitle")} data-testid="page-settings">
          <Settings2 className="h-4 w-4" />
          <span className="hidden lg:inline">{t("pm.editor.page")}</span>
        </button>
        <button type="button" className={BAR_BTN} onClick={p.onOpenCrud} title={t("crud.openTitle")} data-testid="crud-open">
          <Database className="h-4 w-4" />
          <span className="hidden lg:inline">{t("crud.button")}</span>
          {p.crudCount > 0 && <span className="rounded-full bg-blue-100 px-1.5 text-[10px] leading-4 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200">{p.crudCount}</span>}
        </button>
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700" role="tablist" aria-label={t("pm.editor.modeAria")}>
        {MODES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-label={t(label)}
            aria-selected={p.mode === id}
            onClick={() => p.onMode(id)}
            className={`inline-flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition ${p.mode === id ? SEG_ON : SEG_OFF}`}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t(label)}</span>
          </button>
        ))}
      </div>

      <button type="button" data-testid="open-add" onClick={p.onAdd} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-blue-700 px-3 text-xs font-semibold text-white hover:bg-blue-800">
        <Plus className="h-4 w-4" />
        {p.sectionCount === 0 ? t("pm.editor.addSection") : t("pm.editor.add")}
      </button>
      {/* v17: next step of the Website Builder flow. Internal links are still guarded by useLeaveGuard. */}
      {!p.siteMode && (
        <Link to={p.nextStepPath} className={BAR_BTN} data-testid="pm-next-step" title={t("pm.editor.nextStepTitle")}>
          <Rocket className="h-4 w-4" />
          <span className="hidden 2xl:inline">{t("pm.editor.nextStep")}</span>
        </Link>
      )}
    </header>
  );
}
