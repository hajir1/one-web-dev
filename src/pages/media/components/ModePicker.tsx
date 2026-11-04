import { Cpu, Server } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TOOL_BY_ID, type MediaToolId, type ProcessingMode } from "../processing/policy";
import { serverCostLabel, type UsageInput } from "../processing/pricing";
import { isServerConfigured } from "../processing/serverClient";
import { useBilling } from "../processing/billing";
import FeatureAccessCard from "./FeatureAccess";
import { Chip } from "./ui";
import { isDemoMode } from "../../../demo/demoMode";

/**
 * Processing mode picker (free browser / paid server) + each mode's
 * limits. When server mode is selected, the access card (cost, balance, access status)
 * shows too. Prices are read from the central config, not written here.
 */
export default function ModePicker({
  tool,
  value,
  onChange,
  disabled,
  inputs,
}: {
  tool: MediaToolId;
  value: ProcessingMode;
  onChange: (m: ProcessingMode) => void;
  disabled?: boolean;
  /** Current input for the cost estimate (size/duration/scale). */
  inputs?: UsageInput[];
}) {
  const { t } = useTranslation();
  const spec = TOOL_BY_ID[tool];
  const pricing = useBilling((s) => (spec.serverFeature ? s.pricing[spec.serverFeature] : null));
  const configured = isServerConfigured(spec.serverFeature);
  const current = spec.modes[value];
  const options: { mode: ProcessingMode; title: string; Icon: typeof Cpu; badge: React.ReactNode }[] = [];
  if (spec.modes.browser) options.push({ mode: "browser", title: "Browser", Icon: Cpu, badge: isDemoMode() ? null : <Chip tone="green">{t("common.free")}</Chip> });
  // Demo mode (v12): paid server mode is hidden, browser mode only.
  if (spec.modes.server && !isDemoMode())
    options.push({
      mode: "server",
      title: "Server",
      Icon: Server,
      badge: (
        <span className="flex flex-wrap gap-1">
          {pricing && <Chip tone="amber">{serverCostLabel(pricing)}</Chip>}
          {!configured && <Chip tone="rose">{t("access.notAvailable")}</Chip>}
        </span>
      ),
    });

  return (
    <div className="flex flex-col gap-3" data-testid="mode-picker">
      <div role="radiogroup" aria-label={t("media.modePicker.label")} className="grid gap-2">
        {options.map(({ mode, title, Icon, badge }) => {
          const active = value === mode;
          return (
            <button
              key={mode}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={disabled}
              data-testid={`mode-${mode}`}
              onClick={() => onChange(mode)}
              className={`flex items-start gap-3 rounded-xl border p-3 text-left transition disabled:opacity-50 ${
                active
                  ? "border-blue-700 bg-blue-50/60 ring-1 ring-blue-700 dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500"
                  : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
              }`}
            >
              <span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-gray-300"}`}>
                <Icon className="h-4 w-4" />
              </span>
              <span className="min-w-0">
                <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white/90">
                  {title} {badge}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{spec.modes[mode]?.summary}</span>
              </span>
            </button>
          );
        })}
      </div>
      {current && (
        <ul className="flex flex-col gap-1 rounded-xl bg-gray-50 px-3.5 py-2.5 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
          {current.limits.map((l) => (
            <li key={l} className="flex gap-1.5">
              <span aria-hidden className="text-gray-400">•</span>
              {l}
            </li>
          ))}
        </ul>
      )}
      {value === "server" && <FeatureAccessCard tool={tool} inputs={inputs} />}
    </div>
  );
}
