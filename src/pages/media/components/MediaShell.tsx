import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import CreditDialog from "../../../credits/CreditDialog";
import { TOOL_BY_ID, type MediaToolId } from "../processing/policy";
import { useBilling } from "../processing/billing";
import { serverCostLabel } from "../processing/pricing";
import { ACCENT, Chip, type Accent } from "./ui";
import ServerGateDialog from "./ServerGate";
import { isDemoMode } from "../../../demo/demoMode";

/**
 * Media page shell: standard header (breadcrumb, an accent icon specific to
 * each tool, processing mode chip, Help button), then the content. The credit
 * & server dialogs are mounted once here.
 */
export default function MediaShell({
  tool,
  icon,
  accent,
  chips,
  actions,
  children,
}: {
  tool: MediaToolId;
  icon: LucideIcon;
  accent: Accent;
  /** Extra chips under the title. */
  chips?: ReactNode;
  /** Actions on the right of the header (e.g. a reset button). */
  actions?: ReactNode;
  children: ReactNode;
}) {
  const { t } = useTranslation();
  const spec = TOOL_BY_ID[tool];
  const a = ACCENT[accent];
  // Demo mode (v12): no paid server mode.
  const browserOnly = !spec.modes.server || isDemoMode();
  const pricing = useBilling((st) => (spec.serverFeature ? st.pricing[spec.serverFeature] : null));
  const serverChip = pricing ? t("media.shell.serverCost", { cost: serverCostLabel(pricing) }) : t("media.shell.server");
  return (
    <>
      <AppMeta title={spec.name} description={spec.tagline} />
      <div className="flex flex-col gap-5" data-testid={`media-${tool}`}>
        <PageHeader
          icon={icon}
          title={spec.name}
          description={spec.tagline}
          tileClassName={a.tile}
          help="media"
          crumbs={[{ label: t("nav.sections.media.name"), to: "/media-tools" }, { label: spec.name }]}
          chips={
            <>
              {browserOnly ? (
                <>
                  <Chip tone="green">{t("media.shell.browserFree")}</Chip>
                  <Chip>{t("media.shell.noUpload")}</Chip>
                </>
              ) : spec.modes.browser ? (
                <>
                  <Chip tone="green">{t("media.shell.browserFreeShort")}</Chip>
                  <Chip tone="amber">{serverChip}</Chip>
                </>
              ) : (
                <>
                  <Chip tone="amber">{serverChip}</Chip>
                  <Chip>{t("media.shell.needsCredits")}</Chip>
                </>
              )}
              {chips}
            </>
          }
          actions={actions}
        />
        {children}
      </div>
      <ServerGateDialog />
      <CreditDialog />
    </>
  );
}
