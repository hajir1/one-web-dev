import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeftRight, Check, X } from "lucide-react";
import { ColorField, Panel, btn } from "../../../components/app/ui";
import { contrastRatio, wcagLevels } from "./lib/textTools";

export default function ContrastView() {
  const { t } = useTranslation();
  const [fg, setFg] = useState("#1f2937");
  const [bg, setBg] = useState("#ffffff");
  const ratio = contrastRatio(fg, bg);
  const lv = ratio ? wcagLevels(ratio) : null;
  const rows = lv
    ? ([
        ["aaNormal", lv.aaNormal],
        ["aaLarge", lv.aaLarge],
        ["aaaNormal", lv.aaaNormal],
        ["aaaLarge", lv.aaaLarge],
        ["ui", lv.ui],
      ] as const)
    : [];
  return (
    <div className="grid gap-5 lg:grid-cols-2" data-testid="tool-contrast">
      <Panel title={t("data.util.contrast.colors")}>
        <div className="flex flex-col gap-4">
          <ColorField label={t("data.util.contrast.text")} value={fg} onChange={setFg} />
          <ColorField label={t("data.util.contrast.background")} value={bg} onChange={setBg} />
          <button type="button" className={`${btn.secondary} self-start`} onClick={() => (setFg(bg), setBg(fg))}>
            <ArrowLeftRight className="h-4 w-4" /> {t("data.util.contrast.swap")}
          </button>
        </div>
      </Panel>
      <Panel title={ratio ? t("data.util.contrast.ratio", { ratio: ratio.toFixed(2) }) : t("data.util.contrast.invalid")}>
        <div className="rounded-xl border border-gray-200 p-5 dark:border-gray-700" style={{ background: bg, color: fg }} data-testid="contrast-sample">
          <p className="text-2xl font-bold">{t("data.util.contrast.sampleLarge")}</p>
          <p className="mt-2 text-sm">{t("data.util.contrast.sampleNormal")}</p>
        </div>
        <ul className="mt-4 flex flex-col gap-1.5 text-sm" data-testid="contrast-levels">
          {rows.map(([k, ok]) => (
            <li key={k} className="flex items-center gap-2">
              {ok ? <Check className="h-4 w-4 text-emerald-600" /> : <X className="h-4 w-4 text-rose-600" />}
              <span className={ok ? "text-gray-800 dark:text-gray-100" : "text-gray-500"}>{t(`data.util.contrast.levels.${k}`)}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
