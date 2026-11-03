import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDownUp, Download, Loader2, Play, Upload } from "lucide-react";
import CopyButton from "../../../components/app/CopyButton";
import { INPUT, Notice, Panel, Toggle, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import { dataErrorMessage } from "../shared/errors";
import { triggerDownload } from "../shared/downloadUtils";
import { defaultOptions, type OptionDef, type OptionValues, type ToolDef, type ToolResult } from "./tools";

const MAX_INPUT_BYTES = 5 * 1024 * 1024;

/** Label opsi: data.util.options.<id>.label, nilai: data.util.options.<id>.values.<v>. */
function OptionControl({ tool, def, value, onChange }: { tool: ToolDef; def: OptionDef; value: string | boolean | number; onChange: (v: string | boolean | number) => void }) {
  const { t } = useTranslation();
  const id = useId();
  const label = t(`data.util.options.${def.id}.label`);
  if (def.kind === "toggle") return <Toggle checked={!!value} onChange={onChange} label={label} hint={t(`data.util.options.${def.id}.hint`, { defaultValue: "" }) || undefined} />;
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </label>
      {def.kind === "select" ? (
        <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)} className={INPUT} data-testid={`opt-${tool.id}-${def.id}`}>
          {def.values.map((v) => (
            <option key={v} value={v}>
              {def.literal ? (v === "\t" ? "Tab" : v) : t(`data.util.options.${def.id}.values.${v}`)}
            </option>
          ))}
        </select>
      ) : def.kind === "number" ? (
        <input id={id} type="number" min={def.min} max={def.max} value={Number(value)} onChange={(e) => onChange(Math.max(def.min, Math.min(def.max, Number(e.target.value) || def.min)))} className={INPUT} />
      ) : (
        <input id={id} type="text" value={String(value)} placeholder={def.placeholder} onChange={(e) => onChange(e.target.value)} className={`${INPUT} font-mono`} spellCheck={false} />
      )}
    </div>
  );
}

/** Tampilan generik: input → aksi → output (+ salin, unduh, jadikan input). */
export default function ToolView({ tool }: { tool: ToolDef }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<OptionValues>(() => defaultOptions(tool));
  const [result, setResult] = useState<ToolResult | null>(null);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const runToken = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const outputId = useId();

  // Ganti alat → reset state.
  useEffect(() => {
    setInput("");
    setOpts(defaultOptions(tool));
    setResult(null);
    setError(null);
    setLastAction(null);
  }, [tool]);

  const run = async (actionId: string) => {
    const action = tool.actions?.find((a) => a.id === actionId);
    if (!action) return;
    if (!tool.noInput && !input.trim()) {
      setError(t("data.errors.emptyInput"));
      setResult(null);
      return;
    }
    const token = ++runToken.current;
    setBusy(true);
    setError(null);
    try {
      const r = await action.run(input, opts);
      if (token !== runToken.current) return;
      setResult(r);
      setLastAction(actionId);
    } catch (e) {
      if (token !== runToken.current) return;
      setResult(null);
      setError(dataErrorMessage(e));
    } finally {
      if (token === runToken.current) setBusy(false);
    }
  };

  const primary = tool.actions?.find((a) => a.primary) ?? tool.actions?.[0];
  const outputName = `${tool.id}-${lastAction ?? "output"}.${lastAction === "toJson" ? "json" : lastAction === "validate" ? "txt" : (tool.ext ?? "txt")}`;

  const loadFile = (f: File) => {
    if (f.size > MAX_INPUT_BYTES) return setError(t("data.errors.fileTooLarge", { max: "5 MB" }));
    f.text().then(
      (txt) => {
        setInput(txt);
        setError(null);
      },
      () => setError(t("data.errors.readFailed")),
    );
  };

  return (
    <div className="flex flex-col gap-5" data-testid={`tool-${tool.id}`}>
      {tool.options && tool.options.length > 0 && (
        <Panel title={t("data.util.optionsTitle")}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tool.options.map((o) => (
              <OptionControl key={o.id} tool={tool} def={o} value={opts[o.id]} onChange={(v) => setOpts((s) => ({ ...s, [o.id]: v }))} />
            ))}
          </div>
        </Panel>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label={t("data.util.actionsLabel")}>
        {tool.actions?.map((a) => (
          <button key={a.id} type="button" onClick={() => void run(a.id)} disabled={busy} className={a === primary ? btn.primary : btn.secondary} data-testid={`action-${a.id}`}>
            {busy && a === primary ? <Loader2 className="h-4 w-4 animate-spin" /> : a === primary ? <Play className="h-4 w-4" /> : null}
            {t(`data.util.actions.${a.id}`)}
          </button>
        ))}
      </div>

      <div className={`grid gap-5 ${tool.noInput ? "" : "xl:grid-cols-2"}`}>
        {!tool.noInput && (
          <Panel
            title={<label htmlFor={inputId}>{t("common.input")}</label>}
            actions={
              <>
                {tool.sample && (
                  <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => (setInput(tool.sample!), setError(null))} data-testid="tool-sample">
                    {t("common.sample")}
                  </button>
                )}
                <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => fileRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" /> {t("data.util.openFile")}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  className="hidden"
                  accept=".json,.js,.ts,.txt,.csv,.tsv,text/*,application/json"
                  onChange={(e) => {
                    if (e.target.files?.[0]) loadFile(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
                {input && (
                  <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => (setInput(""), setResult(null), setError(null))}>
                    {t("common.clear")}
                  </button>
                )}
              </>
            }
            bodyClassName="p-0"
          >
            <textarea
              id={inputId}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && primary) {
                  e.preventDefault();
                  void run(primary.id);
                }
              }}
              placeholder={t(`data.util.tools.${tool.id}.placeholder`)}
              spellCheck={false}
              rows={14}
              className="block min-h-64 w-full resize-y rounded-b-2xl border-0 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-500/30 dark:text-gray-100"
              data-testid="tool-input"
            />
            <p className="border-t border-gray-100 px-4 py-1.5 text-[11px] text-gray-400 dark:border-gray-800">
              {t("common.characters", { count: input.length })} · {t("data.util.shortcut")}
            </p>
          </Panel>
        )}

        <Panel
          title={<label htmlFor={outputId}>{t("common.output")}</label>}
          actions={
            <>
              <CopyButton text={result?.output ?? ""} disabled={!result?.output} testId="tool-copy" />
              <button
                type="button"
                disabled={!result?.output}
                onClick={() => {
                  triggerDownload(new Blob([result!.output], { type: "text/plain;charset=utf-8" }), outputName);
                  notify.success(t("data.util.downloaded", { name: outputName }));
                }}
                className={`${btn.secondary} !px-3 !py-1.5 text-xs`}
                data-testid="tool-download"
              >
                <Download className="h-3.5 w-3.5" /> {t("common.download")}
              </button>
              {!tool.noInput && (tool.actions?.length ?? 0) > 1 && (
                <button
                  type="button"
                  disabled={!result?.output || lastAction === "validate"}
                  onClick={() => (setInput(result!.output), setResult(null))}
                  className={`${btn.ghost} !px-2 !py-1.5 text-xs`}
                  title={t("data.util.useAsInput")}
                >
                  <ArrowDownUp className="h-3.5 w-3.5" /> <span className="hidden sm:inline">{t("data.util.useAsInput")}</span>
                </button>
              )}
            </>
          }
          bodyClassName="p-0"
        >
          {error ? (
            <div className="p-4" data-testid="tool-error">
              <Notice tone="error" title={t("data.util.errorTitle")}>
                {error}
              </Notice>
            </div>
          ) : (
            <textarea
              id={outputId}
              readOnly
              value={result?.output ?? ""}
              placeholder={t("data.util.outputPlaceholder")}
              rows={14}
              className="block min-h-64 w-full resize-y rounded-b-2xl border-0 bg-gray-50/70 px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none placeholder:text-gray-400 dark:bg-gray-950/40 dark:text-gray-100"
              data-testid="tool-output"
            />
          )}
          {result && (result.stats?.length || result.warnings?.length) ? (
            <div className="flex flex-col gap-2 border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
              {result.stats && (
                <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                  {result.stats.map((s) => (
                    <div key={s.label} className="flex gap-1">
                      <dt className="text-gray-500">{s.label}:</dt>
                      <dd className="font-mono font-semibold text-gray-800 dark:text-gray-100">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {result.warnings?.map((w) => (
                <Notice key={w} tone="warn">
                  {w}
                </Notice>
              ))}
            </div>
          ) : null}
        </Panel>
      </div>

    </div>
  );
}
