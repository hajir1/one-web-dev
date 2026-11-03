import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import Modal from "../../../../components/app/Modal";
import { Notice } from "../../../../components/app/ui";
import { usePremiumElementsFor } from "../../../../marketplace/hooks";
import CodeExportPanel from "../../core/ui/CodeExportPanel";
import { useIconLookup } from "../../core/hooks/useElementOutput";
import { useComposeVars } from "../../core/hooks/useGlobalVars";
import { useFontStore } from "../../core/store/fontStore";
import { baseFontStack } from "../../core/helpers/fontCss";
import type { Framework } from "../../core/helpers/generatorCss";
import type { SavedDesign } from "../../core/store/designStore";
import { usePersistentState } from "../../engine/helpers/usePersistentState";
import { buildSite, siteZipName } from "../../helpers/siteExport";
import { normalizePageDoc } from "../../helpers/pageDoc";
import { normalizeSiteDoc, resolvePages } from "../../helpers/site";
import { collectionsIn } from "../../helpers/collections";
import { DEFAULT_CRUD_STACK, frameworkForStack, isOfferedStack, stackForFramework, withCrud, type CrudStack } from "../../helpers/crud";
import CrudExportBar from "./CrudExportBar";

/* ================================================================== */
/* Website Saya › Unduh: seluruh website (semua halaman) sebagai zip,    */
/* dengan opsi Include CRUD bila website punya koleksi data.             */
/* Pilihan Include CRUD + stack sama dengan panel Kode di Studio.        */
/* ================================================================== */

const FRAMEWORKS: Framework[] = ["html", "blade", "react", "vue", "svelte", "angular"];
const isFramework = (v: unknown): v is Framework => FRAMEWORKS.includes(v as Framework);
const isBool = (v: unknown): v is boolean => typeof v === "boolean";

export default function SiteDownloadDialog({ site, designs, onClose }: { site: SavedDesign; designs: SavedDesign[]; onClose: () => void }) {
  const { t } = useTranslation();
  const icons = useIconLookup();
  const fonts = useFontStore((st) => st.fonts);
  const baseFont = useFontStore((st) => baseFontStack(st.fonts, st.baseFontId));
  const vars = useComposeVars();
  const premiumFor = usePremiumElementsFor();
  const [framework, setFramework] = usePersistentState<Framework>("hub-download-fw", "html", isFramework);
  const [includeCrud, setIncludeCrud] = usePersistentState<boolean>("pm-crud-include", false, isBool);
  const [crudStack, setCrudStack] = usePersistentState<CrudStack>("pm-crud-stack", DEFAULT_CRUD_STACK, isOfferedStack);

  const built = useMemo(() => buildSite(site, designs, { icons, fonts, baseFont, vars, allowPremiumElementsFor: premiumFor }), [site, designs, icons, fonts, baseFont, vars, premiumFor]);
  /** Koleksi data di semua halaman website. */
  const cols = useMemo(
    () =>
      resolvePages(normalizeSiteDoc(site.state), designs)
        .filter((p) => p.design)
        .flatMap((p) => collectionsIn(normalizePageDoc(p.design!.state).root).map((c) => c.col)),
    [site, designs],
  );
  const crudActive = includeCrud && cols.length > 0 && stackForFramework(framework) === crudStack;
  const files = useMemo(() => {
    const base = built.files(framework);
    return crudActive ? withCrud(crudStack, base, cols, site.name) : base;
  }, [built, framework, crudActive, crudStack, cols, site.name]);

  return (
    <Modal open size="xl" onClose={onClose} icon={<Download className="h-5 w-5" />} title={t("hub.download.title", { name: site.name })} description={t("hub.download.text", { count: built.pages.length })} testId="hub-download">
      <div className="flex flex-col gap-3">
        {built.warnings.length > 0 && <Notice tone="warn">{built.warnings[0]}</Notice>}
        <CodeExportPanel
          header={
            <CrudExportBar
              collections={[...new Set(cols.map((c) => c.name))]}
              enabled={includeCrud}
              stack={crudStack}
              active={crudActive}
              onToggle={(on) => {
                setIncludeCrud(on);
                if (on) setFramework(frameworkForStack(crudStack));
              }}
              onStack={(st) => {
                setCrudStack(st);
                setFramework(frameworkForStack(st));
              }}
            />
          }
          packAs={crudActive && crudStack === "express" ? "express" : undefined}
          framework={framework}
          onFrameworkChange={setFramework}
          files={files}
          zipBaseName={`${siteZipName(site.name)}${crudActive ? "-crud" : ""}`}
          codeMaxHeightClass="max-h-[40vh]"
          source={{ kind: "site", id: site.id }}
          unlimited
          autoDeploy={false}
        />
      </div>
    </Modal>
  );
}
