import { useTranslation } from "react-i18next";
import { ArrowLeft, Cloud, Globe2, HardDrive, Inbox, Rocket } from "lucide-react";
import PageTabs from "../ui/studio/PageTabs";
import { AssetLibraryButton } from "../../../assetLibrary/AssetLibraryDialog";
import type { SaveTarget } from "../ui/studio/saveTarget";
import type { ResolvedSitePage } from "../helpers/site";
import { BAR_BTN } from "./editorUi";

/* Studio: website bar (pages, Site, Submissions, Deploy). Split out of PageMaker.tsx (no. 15). */

interface Props {
  siteName: string;
  pages: ResolvedSitePage[];
  currentId: string | null;
  saveTarget: SaveTarget;
  dirty: boolean;
  boardOpen: boolean;
  kirimanOpen: boolean;
  sitePanelOpen: boolean;
  onExit: () => void;
  onOpenPage: (id: string) => void;
  onAddPage: () => void;
  onToggleBoard: () => void;
  onOpenSitePanel: () => void;
  onToggleSitePanel: () => void;
  onToggleKiriman: () => void;
  onDeploy: () => void;
}

export default function StudioBar(p: Props) {
  const { t } = useTranslation();
  const { saveTarget } = p;
  return (
    <div className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900" data-testid="studio-bar">
      <button type="button" onClick={p.onExit} className={BAR_BTN} aria-label={t("studio.exitAria")} title={t("studio.exitAria")} data-testid="studio-exit">
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden lg:inline">{t("studio.exit")}</span>
      </button>
      <button type="button" onClick={p.onOpenSitePanel} className="hidden max-w-48 shrink-0 truncate text-left text-sm font-semibold hover:underline sm:block" title={t("studio.siteTitle")} data-testid="studio-site-name">
        {p.siteName}
      </button>
      <span className="hidden h-5 w-px shrink-0 bg-gray-200 sm:block dark:bg-gray-700" aria-hidden />
      <div className="min-w-0 flex-1">
        <PageTabs pages={p.pages} currentId={p.currentId} onOpen={p.onOpenPage} onAdd={p.onAddPage} onBoard={p.onToggleBoard} boardOpen={p.boardOpen} />
      </div>
      <span className="hidden shrink-0 items-center gap-1 text-[11px] text-gray-500 xl:inline-flex dark:text-gray-400" data-testid="studio-save-state" title={t(saveTarget === "account" ? "studio.savedAccountLong" : saveTarget === "demo" ? "studio.savedDemoLong" : "studio.savedDeviceLong")}>
        {saveTarget === "account" ? <Cloud className="h-3.5 w-3.5" /> : <HardDrive className="h-3.5 w-3.5" />}
        {p.dirty ? t("studio.saving") : t(saveTarget === "account" ? "studio.savedAccount" : "studio.savedDevice")}
      </span>
      <AssetLibraryButton className={BAR_BTN} labelClassName="hidden 2xl:inline" />
      <button type="button" className={BAR_BTN} onClick={p.onToggleKiriman} aria-pressed={p.kirimanOpen} title={t("kiriman.title")} data-testid="studio-kiriman">
        <Inbox className="h-4 w-4" />
        <span className="hidden 2xl:inline">{t("kiriman.title")}</span>
      </button>
      <button type="button" className={BAR_BTN} onClick={p.onToggleSitePanel} aria-pressed={p.sitePanelOpen} title={t("studio.siteTitle")} data-testid="studio-site">
        <Globe2 className="h-4 w-4" />
        <span className="hidden 2xl:inline">{t("studio.site")}</span>
      </button>
      <button
        type="button"
        onClick={p.onDeploy}
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
        data-testid="studio-deploy-open"
      >
        <Rocket className="h-4 w-4" /> <span className="hidden sm:inline">{t("studio.deploy")}</span>
      </button>
    </div>
  );
}
