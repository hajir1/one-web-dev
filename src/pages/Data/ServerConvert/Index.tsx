import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CloudOff, Coins, Download, FileText, Loader2, Play, ScanText, ServerCog, ShieldCheck, Sheet, X } from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import Modal from "../../../components/app/Modal";
import { Chip, Notice, Panel, Segmented, ProgressBar, btn } from "../../../components/app/ui";
import { Link } from "../../../components/app/LocaleLink";
import { notify } from "../../../components/app/Toaster";
import { CREDITS_PATH, PLANS_PATH } from "../../../config/menu";
import FileDropZone from "../shared/FileDropZone";
import { formatSize } from "../shared/excelUtils";
import { baseName, safeFileName, triggerDownload } from "../shared/downloadUtils";
import { DataError, dataErrorMessage } from "../shared/errors";
import { refreshBilling, useBilling } from "../../media/processing/billing";
import { InsufficientCreditError, FeatureLockedError, ServerUnavailableError, isServerConfigured, runServerJob } from "../../media/processing/serverClient";
import { accessState, featureName, formatCredits, planCharge, quotaFor, tierNote, validateServerInput, type DataServerFeatureId, type UsageInput } from "../../media/processing/pricing";
import { AccessChip } from "../../media/components/FeatureAccess";
import { OCR_LANGS, OCR_MAX_PAGES, SERVER_INPUT, checkSignature, estimatePdfPages, isPdfFeature, type OcrLang, type ServerOutput } from "./estimate";

type Output = ServerOutput;
interface Picked {
  file: File;
  input: UsageInput;
  pagesKnown: boolean;
}

export default function ServerConvert() {
  const { t } = useTranslation();
  const [feature, setFeature] = useState<DataServerFeatureId>("data-legacy-sheet");
  const [output, setOutput] = useState<Output>("json");
  const [lang, setLang] = useState<OcrLang>("ind+eng");
  const ocr = feature === "data-pdf-ocr";
  const [picked, setPicked] = useState<Picked | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const abort = useRef<AbortController | null>(null);
  const { account, pricing, status } = useBilling();
  const p = pricing[feature];
  const serverReady = isServerConfigured(feature);

  useEffect(() => {
    if (status === "idle") void refreshBilling();
  }, [status]);
  useEffect(() => () => abort.current?.abort(), []);

  const plan = picked ? planCharge(p, [picked.input], account) : null;
  const quota = picked ? quotaFor(p, [picked.input], account) : null;
  const state = accessState(p, { serverAvailable: serverReady, account, plan: plan ?? undefined, quota: quota ?? undefined });
  const blocked = plan?.affordable === false || quota?.enough === false;
  const sub = account?.subscription;

  const pick = async (file: File) => {
    setError(null);
    setPicked(null);
    const spec = SERVER_INPUT[feature];
    try {
      if (!spec.ext.test(file.name)) throw new DataError(isPdfFeature(feature) ? "notPdf" : "serverSheetType");
      const tooBig = validateServerInput(p, { bytes: file.size });
      if (tooBig) throw new Error(tooBig);
      const head = new Uint8Array(await file.slice(0, 8).arrayBuffer());
      checkSignature(feature, head, file.name);
      let pages: number | null = null;
      if (isPdfFeature(feature)) pages = estimatePdfPages(new Uint8Array(await file.arrayBuffer()));
      if (feature === "data-pdf-ocr" && pages && pages > OCR_MAX_PAGES) throw new Error(t("data.server.ocrTooManyPages", { max: OCR_MAX_PAGES }));
      setPicked({ file, input: { bytes: file.size, ...(pages ? { pages } : {}) }, pagesKnown: pages !== null });
    } catch (e) {
      setError(dataErrorMessage(e));
    }
  };

  const changeFeature = (f: DataServerFeatureId) => {
    setFeature(f);
    setOutput(SERVER_INPUT[f].outputs[0]);
    setPicked(null);
    setError(null);
  };

  const start = () => {
    if (!picked) return;
    if (!serverReady) {
      // Honest: no request, no cost.
      setError(t("errors.serverUnavailable"));
      return;
    }
    setConfirm(true);
  };

  const run = async () => {
    if (!picked || running) return;
    setConfirm(false);
    setRunning(true);
    setProgress(0);
    setError(null);
    abort.current = new AbortController();
    try {
      const params = ocr ? { lang } : { output };
      const res = await runServerJob({ feature, file: picked.file, params, signal: abort.current.signal, onProgress: setProgress });
      triggerDownload(res.blob, `${safeFileName(baseName(picked.file.name))}${ocr ? "-ocr.zip" : `.${output}`}`);
      notify.success(t("data.server.done"));
    } catch (e) {
      if ((e as Error)?.name === "AbortError") notify.info(t("data.server.cancelled"));
      else if (e instanceof InsufficientCreditError || e instanceof FeatureLockedError || e instanceof ServerUnavailableError) setError(e.message);
      else setError(dataErrorMessage(e));
    } finally {
      setRunning(false);
      setProgress(null);
      abort.current = null;
    }
  };

  const spec = SERVER_INPUT[feature];
  const note = tierNote(p);

  return (
    <>
      <AppMeta title={t("data.server.metaTitle")} description={t("data.server.description")} />
      <div className="flex flex-col gap-5" data-testid="server-convert">
        <PageHeader
          icon={ServerCog}
          tileClassName="bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300"
          title={t("data.server.title")}
          description={t("data.server.description")}
          crumbs={[{ label: t("nav.sections.data.name"), to: "/data-tools" }, { label: t("data.server.title") }]}
          help="data-server"
          chips={
            <>
              <Chip tone="amber">
                <Coins className="h-3 w-3" /> {t("data.server.usesCredits")}
              </Chip>
              {!serverReady && (
                <Chip tone="rose">
                  <CloudOff className="h-3 w-3" /> {t("access.notAvailable")}
                </Chip>
              )}
            </>
          }
        />

        {!serverReady && (
          <Notice tone="warn" title={t("data.server.unavailableTitle")} testId="server-unavailable">
            {t("data.server.unavailable")}
          </Notice>
        )}

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
            <Panel title={t("data.server.chooseTitle")}>
              <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label={t("data.server.chooseTitle")}>
                {(["data-legacy-sheet", "data-pdf-table", "data-pdf-ocr"] as DataServerFeatureId[]).map((f) => {
                  const Icon = f === "data-pdf-ocr" ? ScanText : f === "data-pdf-table" ? FileText : Sheet;
                  const on = f === feature;
                  return (
                    <button
                      key={f}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => changeFeature(f)}
                      data-testid={`feature-${f}`}
                      className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${on ? "border-brand-500 bg-brand-25 ring-1 ring-brand-500 dark:bg-brand-500/5" : "border-gray-200 hover:border-brand-200 dark:border-gray-700"}`}
                    >
                      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${on ? "text-brand-600" : "text-gray-400"}`} />
                      <span>
                        <span className="block text-sm font-semibold text-gray-900 dark:text-white">{featureName(f)}</span>
                        <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">{t(`data.server.features.${f}`)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </Panel>

            <Panel title={t("data.server.fileTitle")} description={t("data.server.fileHint", { max: formatSize(p.limits.maxBytes) })}>
              {!picked ? (
                <FileDropZone accept={spec.accept} onFiles={(f) => void pick(f[0])} hint={t(`data.server.accept.${feature}`)} testId="server-drop" disabled={running} />
              ) : (
                <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3.5 dark:border-gray-800" data-testid="server-file">
                  <FileText className="h-5 w-5 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-white/90">{picked.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatSize(picked.file.size)}
                      {isPdfFeature(feature) && <> · {picked.pagesKnown ? t("data.server.pagesEstimate", { count: picked.input.pages }) : t("data.server.pagesUnknown")}</>}
                    </p>
                  </div>
                  <button type="button" onClick={() => setPicked(null)} className={btn.icon} disabled={running} aria-label={t("data.sql.changeFile")}>
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
              {ocr ? (
                <div className="mt-4" data-testid="ocr-options">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("data.server.ocrLang")}</p>
                  <Segmented<OcrLang> value={lang} onChange={setLang} label={t("data.server.ocrLang")} options={OCR_LANGS.map((l) => ({ value: l, label: t(`data.server.ocrLangs.${l.replace("+", "_")}`) }))} />
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t("data.server.ocrOutput")}</p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("data.server.output")}</p>
                  <Segmented<Output> value={output} onChange={setOutput} label={t("data.server.output")} options={spec.outputs.map((o) => ({ value: o, label: o.toUpperCase() }))} />
                </div>
              )}
              {error && (
                <div className="mt-4" data-testid="server-error">
                  <Notice tone="error" onDismiss={() => setError(null)}>
                    {error}
                  </Notice>
                </div>
              )}
              {running && (
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1">
                    <ProgressBar value={progress} label={t("common.processing")} />
                  </div>
                  <button type="button" className={`${btn.secondary} !py-1.5 text-xs`} onClick={() => abort.current?.abort()}>
                    {t("common.cancel")}
                  </button>
                </div>
              )}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={start} disabled={!picked || running} className={btn.primary} data-testid="server-run">
                  {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />} {t("data.server.run")}
                </button>
              </div>
            </Panel>
          </div>

          <aside className="flex flex-col gap-5">
            <Panel title={t("data.server.costTitle")} actions={<AccessChip state={state} />}>
              {p.inPlan ? (
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm" data-testid="server-estimate">
                <dt className="text-gray-500">{t("data.server.usage")}</dt>
                <dd className="text-right font-semibold text-gray-800 dark:text-gray-100" data-testid="server-cost">
                  {!plan ? (
                    <span className="font-normal text-gray-400">{t("data.server.pickFirst")}</span>
                  ) : plan.packUses > 0 ? (
                    t("access.plan.fromPack", { n: plan.packUses })
                  ) : (
                    t("access.plan.units", { count: quota?.units ?? 1 })
                  )}
                </dd>
                <dt className="text-gray-500">{t("access.plan.left")}</dt>
                <dd className="text-right font-semibold text-gray-800 dark:text-gray-100">
                  {sub ? t("access.plan.unitsLeft", { n: sub.units.left, total: sub.units.limit + sub.units.bonus }) : <span className="font-normal text-gray-400">{t("access.notLoaded")}</span>}
                </dd>
              </dl>
              ) : (
              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm" data-testid="server-estimate">
                <dt className="text-gray-500">{t("access.costPerUse")}</dt>
                <dd className="text-right font-semibold text-gray-800 dark:text-gray-100">
                  {formatCredits(p.costPerUse)}
                  {note && <span className="block text-[11px] font-normal text-gray-500">{note}</span>}
                </dd>
                <dt className="text-gray-500">{t("data.server.estimate")}</dt>
                <dd className="text-right font-semibold text-gray-800 dark:text-gray-100" data-testid="server-cost">
                  {plan ? formatCredits(plan.credits) : <span className="font-normal text-gray-400">{t("data.server.pickFirst")}</span>}
                </dd>
                <dt className="text-gray-500">{t("access.balance")}</dt>
                <dd className="text-right font-semibold text-gray-800 dark:text-gray-100">{account ? formatCredits(account.balance) : <span className="font-normal text-gray-400">{t("access.notLoaded")}</span>}</dd>
              </dl>
              )}
              <ul className="mt-4 flex list-disc flex-col gap-1.5 pl-4 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {(t(p.inPlan ? "data.server.rulesPlan" : "data.server.rules", { returnObjects: true }) as string[]).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <Link to={p.inPlan ? PLANS_PATH : `${CREDITS_PATH}?feature=${feature}`} className={`${btn.secondary} mt-4 w-full`}>
                <Coins className="h-4 w-4" /> {p.inPlan ? t("data.server.seePlans") : t("data.server.seeCredits")}
              </Link>
            </Panel>
            <Panel title={t("data.server.privacyTitle")}>
              <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {t("data.server.privacy")}
              </p>
            </Panel>
          </aside>
        </div>
      </div>

      <Modal
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t("data.server.confirmTitle")}
        description={
          p.inPlan
            ? t("data.server.confirmPlan", { name: featureName(feature), usage: plan?.packUses ? t("access.plan.fromPack", { n: plan.packUses }) : t("access.plan.units", { count: quota?.units ?? 1 }) })
            : t("data.server.confirmText", { name: featureName(feature), cost: plan ? formatCredits(plan.credits) : "—" })
        }
        icon={<Coins className="h-5 w-5" />}
        size="sm"
        testId="server-confirm"
        footer={
          <>
            <button type="button" className={btn.secondary} onClick={() => setConfirm(false)}>
              {t("common.cancel")}
            </button>
            <button type="button" className={btn.primary} onClick={run} disabled={blocked} data-testid="server-confirm-run">
              <Download className="h-4 w-4" /> {t("data.server.confirmRun")}
            </button>
          </>
        }
      >
        {quota?.problem && <Notice tone="warn">{t(`media.gate.quota.${quota.problem}`)}</Notice>}
        {plan && plan.affordable === false && <Notice tone="warn">{t("data.server.shortfall", { cost: formatCredits(plan.shortfall) })}</Notice>}
      </Modal>
    </>
  );
}
