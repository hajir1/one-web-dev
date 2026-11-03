import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock, RotateCcw } from "lucide-react";
import CopyButton from "../../../components/app/CopyButton";
import { INPUT, Notice, Panel, Segmented, btn } from "../../../components/app/ui";
import { dataErrorMessage } from "../shared/errors";
import { parseTimestamp, relativeTime, type EpochUnit, type TimestampResult } from "./lib/timestamp";
import { LANG_LABEL, currentLang } from "../../../i18n";

type UnitChoice = EpochUnit | "auto";

export default function TimestampView() {
  const { t } = useTranslation();
  const locale = LANG_LABEL[currentLang()].locale;
  const [input, setInput] = useState(() => String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<UnitChoice>("auto");
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const res = useMemo<{ ok: TimestampResult } | { err: string } | null>(() => {
    if (!input.trim()) return null;
    try {
      return { ok: parseTimestamp(input, unit) };
    } catch (e) {
      return { err: dataErrorMessage(e) };
    }
  }, [input, unit]);

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const rows =
    res && "ok" in res
      ? [
          { k: t("data.util.ts.seconds"), v: String(res.ok.seconds) },
          { k: t("data.util.ts.millis"), v: String(res.ok.millis) },
          { k: "ISO 8601 (UTC)", v: res.ok.iso },
          { k: "RFC 7231 (UTC)", v: res.ok.utc },
          { k: t("data.util.ts.local", { tz }), v: res.ok.date.toLocaleString(locale, { dateStyle: "full", timeStyle: "long" }) },
          { k: t("data.util.ts.relative"), v: relativeTime(res.ok.millis, locale, now) },
        ]
      : [];

  return (
    <div className="flex flex-col gap-5" data-testid="tool-timestamp">
      <Panel
        title={t("data.util.ts.inputTitle")}
        description={t("data.util.ts.inputHint")}
        actions={
          <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}>
            <RotateCcw className="h-3.5 w-3.5" /> {t("data.util.ts.now")}
          </button>
        }
      >
        <div className="flex flex-col gap-3">
          <input value={input} onChange={(e) => setInput(e.target.value)} className={`${INPUT} font-mono`} aria-label={t("data.util.ts.inputTitle")} spellCheck={false} data-testid="tool-input" />
          <Segmented<UnitChoice>
            value={unit}
            onChange={setUnit}
            label={t("data.util.ts.unit")}
            options={(["auto", "s", "ms", "us", "ns"] as UnitChoice[]).map((u) => ({ value: u, label: t(`data.util.ts.units.${u}`) }))}
          />
          <p className="flex items-center gap-1.5 font-mono text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" /> {t("data.util.ts.current")}: {Math.floor(now / 1000)}
          </p>
        </div>
      </Panel>
      {res && "err" in res && (
        <div data-testid="tool-error">
          <Notice tone="error" title={t("data.util.errorTitle")}>
            {res.err}
          </Notice>
        </div>
      )}
      {res && "ok" in res && (
        <Panel title={t("data.util.ts.resultTitle")} description={res.ok.unit ? t("data.util.ts.detected", { unit: t(`data.util.ts.units.${res.ok.unit}`) }) : undefined} bodyClassName="p-0">
          <dl className="divide-y divide-gray-100 dark:divide-gray-800" data-testid="tool-output">
            {rows.map((r) => (
              <div key={r.k} className="flex flex-wrap items-center gap-2 px-4 py-2.5">
                <dt className="w-44 shrink-0 text-xs font-semibold text-gray-500">{r.k}</dt>
                <dd className="min-w-0 flex-1 break-all font-mono text-sm text-gray-800 dark:text-gray-100">{r.v}</dd>
                <CopyButton text={r.v} className={btn.icon} label="" />
              </div>
            ))}
          </dl>
        </Panel>
      )}
    </div>
  );
}
