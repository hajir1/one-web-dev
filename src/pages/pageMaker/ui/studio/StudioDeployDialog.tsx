import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Rocket } from "lucide-react";
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
import { buildSite, siteZipName as zipName } from "../../helpers/siteExport";

/* Studio "Deploy" dialog (v20): the whole website (every page + menu) → GitHub Pages or a zip. */


export default function StudioDeployDialog({ site, designs, onClose }: { site: SavedDesign; designs: SavedDesign[]; onClose: () => void }) {
  const { t } = useTranslation();
  const icons = useIconLookup();
  const fonts = useFontStore((st) => st.fonts);
  const baseFont = useFontStore((st) => baseFontStack(st.fonts, st.baseFontId));
  const vars = useComposeVars();
  const premiumFor = usePremiumElementsFor();
  const [framework, setFramework] = useState<Framework>("html");
  const built = useMemo(() => buildSite(site, designs, { icons, fonts, baseFont, vars, allowPremiumElementsFor: premiumFor }), [site, designs, icons, fonts, baseFont, vars, premiumFor]);
  const files = useMemo(() => built.files(framework), [built, framework]);
  return (
    <Modal open size="xl" onClose={onClose} icon={<Rocket className="h-5 w-5" />} title={t("studio.deployTitle", { name: site.name })} description={t("studio.deployText", { count: built.pages.length })} testId="studio-deploy">
      <div className="flex flex-col gap-3">
        {built.warnings.length > 0 && <Notice tone="warn">{built.warnings[0]}</Notice>}
        <CodeExportPanel framework={framework} onFrameworkChange={setFramework} files={files} zipBaseName={zipName(site.name)} codeMaxHeightClass="max-h-[40vh]" source={{ kind: "site", id: site.id }} unlimited autoDeploy={false} />
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("studio.deployHint")}</p>
      </div>
    </Modal>
  );
}
