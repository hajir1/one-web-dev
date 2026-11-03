import { useTranslation } from "react-i18next";
import { Link } from "../../../../components/app/LocaleLink";
import AppMeta from "../../../../components/app/AppMeta";
import PageHeader from "../../../../components/app/PageHeader";
import { ArrowUpRight, AudioLines, Clapperboard, Coins, Cpu, Eraser, FileAudio, Film, Maximize2, Pipette, Repeat2, Server, Share2, ShieldOff, Shrink, Stamp, type LucideIcon } from "lucide-react";
import { ACCENT, Chip, Panel, type Accent } from "../../components/ui";
import { PLANS_PATH } from "../../../../config/menu";
import { isDemoMode } from "../../../../demo/demoMode";
import { MEDIA_TOOLS, type MediaToolId } from "../../processing/policy";
import { useBilling } from "../../processing/billing";
import { costOf, formatCredits, formatCreditValue, serverCostLabel } from "../../processing/pricing";

const LOOK: Record<MediaToolId, { icon: LucideIcon; accent: Accent }> = {
  "image-converter": { icon: Repeat2, accent: "blue" },
  "audio-converter": { icon: FileAudio, accent: "violet" },
  "find-colors": { icon: Pipette, accent: "violet" },
  "remove-background": { icon: Eraser, accent: "emerald" },
  "video-to-frames": { icon: Clapperboard, accent: "amber" },
  "image-upscaler": { icon: Maximize2, accent: "indigo" },
  "metadata-remover": { icon: ShieldOff, accent: "rose" },
  "video-to-gif": { icon: Film, accent: "amber" },
  "audio-extract": { icon: AudioLines, accent: "violet" },
  "video-compress": { icon: Shrink, accent: "blue" },
  "favicon-generator": { icon: Stamp, accent: "indigo" },
  "og-image": { icon: Share2, accent: "emerald" },
};

/** Perbandingan teknis — tiap baris berdasar mekanisme, bukan angka karangan. Teks di `media.hub.comparison.*`. */
const COMPARISON = ["performance", "resources", "fileSize", "privacy", "connection", "cost", "scalability", "quality", "formats"] as const;

export default function MediaHub() {
  const { t } = useTranslation();
  const pricing = useBilling((st) => st.pricing);
  // Mode demo (v12): hanya alat yang berjalan di browser; info server & harga disembunyikan.
  const demo = isDemoMode();
  const tools = demo ? MEDIA_TOOLS.filter((x) => x.modes.browser) : MEDIA_TOOLS;
  return (
    <>
      <AppMeta title={t("nav.sections.media.name")} description={t("media.hub.metaDescription")} />
      <div className="flex flex-col gap-6" data-testid="media-hub">
        <PageHeader
          title={t("nav.sections.media.name")}
          description={t(demo ? "demo.media.hubDescription" : "media.hub.description")}
          help="media"
          chips={
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                <Cpu className="h-3.5 w-3.5" /> {t("media.hub.chipBrowser")}
              </span>
              {!demo && (
                <>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">
                    <Server className="h-3.5 w-3.5" /> {t("media.hub.chipServer")}
                  </span>
                  <Link to={PLANS_PATH} className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 font-semibold text-gray-700 hover:bg-gray-200 dark:bg-white/10 dark:text-gray-200">
                    <Coins className="h-3.5 w-3.5" /> {t("media.hub.chipPricing")}
                  </Link>
                </>
              )}
            </div>
          }
        />

        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" data-testid="media-tools">
          {tools.map((tool) => {
            const { icon: Icon, accent } = LOOK[tool.id];
            return (
              <li key={tool.id}>
                <Link
                  to={tool.path}
                  className="group flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/40 dark:hover:border-gray-700"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${ACCENT[accent].tile}`}>
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-gray-600 dark:group-hover:text-gray-300" />
                  </div>
                  <h2 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">{tool.name}</h2>
                  <p className="mt-1 flex-1 text-sm text-gray-500 dark:text-gray-400">{tool.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tool.modes.browser && <Chip tone="green">{t("media.hub.browserFree")}</Chip>}
                    {tool.serverFeature && !demo && <Chip tone="amber">{t("media.hub.serverCost", { cost: serverCostLabel(pricing[tool.serverFeature]) })}</Chip>}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        {!demo && (
          <>
            <Panel title={t("media.hub.comparisonTitle")} description={t("media.hub.comparisonDescription")} bodyClassName="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm" data-testid="comparison">
                  <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">{t("media.hub.colAspect")}</th>
                      <th className="px-4 py-3 font-semibold">{t("media.hub.colBrowser")}</th>
                      <th className="px-4 py-3 font-semibold">{t("media.hub.colServer")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {COMPARISON.map((r) => (
                      <tr key={r} className="align-top">
                        <th scope="row" className="whitespace-nowrap px-4 py-3 font-semibold text-gray-800 dark:text-white/90">
                          {t(`media.hub.comparison.${r}.aspect`)}
                        </th>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t(`media.hub.comparison.${r}.browser`)}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{t(`media.hub.comparison.${r}.server`)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
              <Panel title={t("media.hub.recommendations")} bodyClassName="p-0">
                <ul className="divide-y divide-gray-100 dark:divide-gray-800" data-testid="recommendations">
                  {MEDIA_TOOLS.map((tool) => (
                    <li key={tool.id} className="flex flex-col gap-1 px-4 py-3 sm:px-5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white/90">{tool.name}</span>
                        <Chip tone={tool.recommended === "browser" ? "green" : "amber"}>
                          {tool.recommended === "browser" ? t("media.hub.recommendedBrowser") : t("media.hub.recommendedServer")}
                        </Chip>
                      </div>
                      <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{tool.rationale}</p>
                    </li>
                  ))}
                </ul>
              </Panel>
              <div className="flex flex-col gap-4">
                <Panel title={t("media.hub.pricingTitle")} description={t("media.hub.pricingDescription")}>
                  <ul className="flex flex-col divide-y divide-gray-100 text-xs dark:divide-gray-800" data-testid="hub-pricing">
                    {Object.values(pricing).map((p) => {
                      const tool = MEDIA_TOOLS.find((x) => x.serverFeature === p.feature);
                      return (
                        <li key={p.feature} className="flex items-center justify-between gap-2 py-1.5">
                          <span className="text-gray-700 dark:text-gray-200">{tool?.name}</span>
                          <span className="text-gray-500 dark:text-gray-400">
                            {p.inPlan ? serverCostLabel(p) : `${formatCredits(costOf(p))} (${formatCreditValue(costOf(p))})`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <ul className="mt-3 flex flex-col gap-1 text-xs text-gray-600 dark:text-gray-300">
                    <li>• {t("media.hub.pricingNote1")}</li>
                    <li>• {t("media.hub.pricingNote2")}</li>
                    <li>• {t("media.hub.pricingNote3")}</li>
                  </ul>
                  <Link to={PLANS_PATH} className={`mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:underline dark:text-blue-300`}>
                    <Coins className="h-4 w-4" /> {t("media.hub.buyCredits")}
                  </Link>
                </Panel>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
