import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  Cloud,
  Download,
  ExternalLink,
  FileWarning,
  HardDrive,
  Inbox,
  ListChecks,
  Loader2,
  Lock,
  Monitor,
  MousePointerClick,
  Palette,
  Play,
  Rocket,
  RotateCcw,
  Smartphone,
  SlidersHorizontal,
  Type,
  Undo2,
} from "lucide-react";
import AppMeta from "../../../../components/app/AppMeta";
import EmptyState from "../../../../components/app/EmptyState";
import Modal from "../../../../components/app/Modal";
import { Link, useLang } from "../../../../components/app/LocaleLink";
import { INPUT, Notice, Slider, btn } from "../../../../components/app/ui";
import { notify } from "../../../../components/app/Toaster";
import { TEMPLATES_PATH, WEBSITE_HUB_PATH } from "../../../../config/menu";
import { useDesignStore } from "../../../pageMaker/core/store/designStore";
import { deployKey } from "../../../pageMaker/helpers/deployHistory";
import DeployDialog from "../../../pageMaker/ui/DeployDialog";
import FloatingPanel from "../../../pageMaker/ui/FloatingPanel";
import { useSaveTarget } from "../../../pageMaker/ui/studio/saveTarget";
import { triggerDownload } from "../../../Data/shared/downloadUtils";
import SubmissionsPanel from "../../../../submissions/SubmissionsPanel";
import { ensureEndpoint, withFormBridge } from "../../../../submissions/api";
import { isDemoMode } from "../../../../demo/demoMode";
import { useSession } from "../../../../auth/session";
import { codeTemplateMeta, loadCodeTemplate } from "../catalog";
import { CODE_SITE_TYPE, normalizeCodeSite, renderCodeSite, type CodeSiteDoc } from "../codeSite";
import { buildCodeZip } from "../download";
import { AssetLibraryButton } from "../../../../assetLibrary/AssetLibraryDialog";
import { assetSource, resolveForPreview, useResolvedAssets } from "../../../../assetLibrary/resolve";
import { countEdits, readModel, type CodeEdits, type CodeModel } from "../editModel";
import DataForm, { ImageInput } from "./DataForm";
import { BRIDGE_MSG, fieldsForPick, getIn, hiddenExcept, isEmptyPick, setIn, withBridge, type Pick as StudioPick } from "./codeStudio";

/* ================================================================== */
/* CODE TEMPLATE Studio (v20): invitations, animations, 3D, portfolios.  */
/*                                                                    */
/* The same layout as the website Studio: a full canvas, click a section */
/* anywhere → a popup with that part's fields. "Try" mode runs the template */
/* as is (buttons, animation, 3D). The template structure is LOCKED (no  */
/* adding/moving sections) so animation & 3D do not break; only          */
/* text, links, colors, and data are changed.                           */
/* Invitations deployed/downloaded while signed in (not demo) are automatically */
/* gets a Submissions address: guest RSVPs & wishes go to the account.  */
/* ================================================================== */

type Tab = "text" | "style" | "data";
const EMPTY: never[] = [];
const PREVIEW_DELAY = 450;
const SANDBOX = "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads";

function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), ms);
    return () => clearTimeout(id);
  }, [value, ms]);
  return v;
}

/** The value shown in the form: the user's change, or the template default. */
const pick = <T,>(edited: Record<string, T> | undefined, key: string, base: T): T => (edited && key in edited ? edited[key] : base);
const without = <T,>(map: Record<string, T> | undefined, key: string) => {
  const next = { ...(map ?? {}) };
  delete next[key];
  return next;
};

function TextTab({ model, edits, onChange, only }: { model: CodeModel; edits: CodeEdits; onChange: (e: CodeEdits) => void; only?: { texts: string[]; links: string[] } }) {
  const { t } = useTranslation();
  const reset = (title: string, onClick: () => void) => (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-brand-700 hover:underline dark:text-brand-300" title={title}>
      <Undo2 className="h-3 w-3" /> {t("codeEditor.resetField")}
    </button>
  );
  const texts = only ? only.texts.map((k) => model.texts.find((f) => f.key === k)).filter((f): f is NonNullable<typeof f> => !!f) : model.texts;
  const links = only ? only.links.map((k) => model.links.find((f) => f.key === k)).filter((f): f is NonNullable<typeof f> => !!f) : model.links;
  return (
    <div className="flex flex-col gap-4">
      {!only && model.texts.length === 0 && <p className="text-sm text-gray-500">{t("codeEditor.noTexts")}</p>}
      {texts.map((f) => {
        const id = `txt-${f.key}`;
        const value = pick(edits.texts, f.key, f.value);
        const edited = !!edits.texts && f.key in edits.texts;
        const set = (v: string) => onChange({ ...edits, texts: { ...(edits.texts ?? {}), [f.key]: v } });
        return (
          <div key={f.key} className="min-w-0" data-testid={`field-text-${f.key}`}>
            <div className="mb-1 flex items-baseline justify-between gap-2">
              <label htmlFor={id} className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                {f.label}
                {f.uses > 1 && <span className="ml-1 font-normal text-gray-400">{t("codeEditor.uses", { count: f.uses })}</span>}
              </label>
              {edited && reset(f.label, () => onChange({ ...edits, texts: without(edits.texts, f.key) }))}
            </div>
            {f.multiline || value.length > 80 ? (
              <textarea id={id} value={value} rows={Math.min(6, Math.max(2, Math.ceil(value.length / 55)))} onChange={(e) => set(e.target.value)} className={INPUT} />
            ) : (
              <input id={id} value={value} onChange={(e) => set(e.target.value)} className={INPUT} />
            )}
          </div>
        );
      })}
      {links.length > 0 && (
        <fieldset className="flex flex-col gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-800">
          <legend className="px-1 text-xs font-semibold text-gray-700 dark:text-gray-200">{t("codeEditor.links")}</legend>
          {links.map((f) => {
            const id = `lnk-${f.key}`;
            return (
              <div key={f.key}>
                <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {f.label}
                </label>
                <input id={id} value={pick(edits.links, f.key, f.value)} onChange={(e) => onChange({ ...edits, links: { ...(edits.links ?? {}), [f.key]: e.target.value } })} className={`${INPUT} font-mono text-xs`} />
              </div>
            );
          })}
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("codeEditor.linksHint")}</p>
        </fieldset>
      )}
    </div>
  );
}

function StyleTab({ model, edits, onChange }: { model: CodeModel; edits: CodeEdits; onChange: (e: CodeEdits) => void }) {
  const { t } = useTranslation();
  const set = (name: string, v: string) => onChange({ ...edits, vars: { ...(edits.vars ?? {}), [name]: v } });
  const colors = model.vars.filter((v) => v.kind === "color");
  const others = model.vars.filter((v) => v.kind !== "color");
  return (
    <div className="flex flex-col gap-5">
      {model.vars.length === 0 && <p className="text-sm text-gray-500">{t("codeEditor.noVars")}</p>}
      {colors.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {colors.map((v) => {
            const value = pick(edits.vars, v.name, v.value);
            return (
              <label key={v.name} className="flex min-w-0 items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 dark:border-gray-800" data-testid={`field-var-${v.name}`}>
                <input type="color" value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#000000"} onChange={(e) => set(v.name, e.target.value)} className="h-8 w-9 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" aria-label={v.label} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-gray-700 dark:text-gray-200">{v.label}</span>
                  <span className="block font-mono text-[11px] text-gray-400">{value}</span>
                </span>
              </label>
            );
          })}
        </div>
      )}
      {others.map((v) => {
        const value = pick(edits.vars, v.name, v.value);
        if (v.kind === "range") {
          const unit = /[a-z%]+$/i.exec(value)?.[0] ?? "";
          const num = parseFloat(value);
          return <Slider key={v.name} label={v.label} value={Number.isFinite(num) ? num : v.min!} min={v.min!} max={v.max!} step={v.step} onChange={(n) => set(v.name, `${+n.toFixed(3)}${unit}`)} />;
        }
        return (
          <div key={v.name}>
            <label htmlFor={`var-${v.name}`} className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
              {v.label}
            </label>
            <input id={`var-${v.name}`} value={value} onChange={(e) => set(v.name, e.target.value)} className={`${INPUT} font-mono text-xs`} />
          </div>
        );
      })}
      {edits.vars && Object.keys(edits.vars).length > 0 && (
        <button type="button" className={`${btn.ghost} self-start !px-2 text-xs`} onClick={() => onChange({ ...edits, vars: {} })}>
          <Undo2 className="h-3.5 w-3.5" /> {t("codeEditor.resetColors")}
        </button>
      )}
    </div>
  );
}


/** All data fields (used by the "All fields" popup and the section popup). */
function DataBlocks({ model, edits, onChange, only, invitation }: { model: CodeModel; edits: CodeEdits; onChange: (e: CodeEdits) => void; only?: { name: string; keys: string[] | null }[]; invitation: boolean }) {
  const { t } = useTranslation();
  const blocks = only ? only.map((o) => ({ o, d: model.data.find((d) => d.name === o.name) })).filter((x) => !!x.d) : model.data.map((d) => ({ o: { name: d.name, keys: null }, d }));
  return (
    <div className="flex flex-col gap-4">
      {invitation && !only && <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("templates.code.guestHint")}</p>}
      {blocks.map(({ o, d }) => {
        const value = pick(edits.data as Record<string, unknown> | undefined, d!.name, d!.value);
        return (
          <DataForm
            key={`${d!.name}:${(o.keys ?? []).join(",")}`}
            label={d!.label}
            value={value}
            hidden={hiddenExcept(value, o.keys, d!.hidden)}
            onChange={(v) => onChange({ ...edits, data: { ...(edits.data ?? {}), [d!.name]: v } })}
          />
        );
      })}
    </div>
  );
}

/** One photo clicked in the preview (v21): upload from the device or a URL, right in the popup. */
function PhotoField({ model, edits, onChange, path }: { model: CodeModel; edits: CodeEdits; onChange: (e: CodeEdits) => void; path: string[] }) {
  const { t } = useTranslation();
  const d = model.data.find((x) => x.name === "CONFIG");
  if (!d) return null;
  const value = pick(edits.data as Record<string, unknown> | undefined, d.name, d.value);
  const current = getIn(value, path);
  return (
    <div className="flex flex-col gap-2" data-testid="code-photo-field">
      <p className="text-xs text-gray-500 dark:text-gray-400">{t("codeStudio.photoHint")}</p>
      <ImageInput id={`photo-${path.join("-")}`} value={typeof current === "string" ? current : ""} onChange={(v) => onChange({ ...edits, data: { ...(edits.data ?? {}), [d.name]: setIn(value, path, v) } })} />
    </div>
  );
}

type Panel = { kind: "pick"; pick: StudioPick } | { kind: "style" } | { kind: "all"; tab: Tab } | { kind: "kiriman" } | null;

const BAR_BTN = "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10";
const BAR_ON = "bg-blue-50 !text-blue-800 dark:bg-blue-500/15 dark:!text-blue-200";

export default function CodeTemplateEditor() {
  const { t } = useTranslation();
  const lang = useLang();
  const { projectId = "" } = useParams();
  const [params, setParams] = useSearchParams();
  const projects = useDesignStore((s) => s.designs[CODE_SITE_TYPE]) ?? EMPTY;
  const updateDesign = useDesignStore((s) => s.updateDesign);
  const renameDesign = useDesignStore((s) => s.renameDesign);
  const project = projects.find((p) => p.id === projectId) ?? null;
  const doc = useMemo(() => (project ? normalizeCodeSite(project.state) : null), [project]);
  const meta = doc ? codeTemplateMeta(doc.templateId) : undefined;
  const tplName = doc ? t(`templates.items.${doc.templateId}.name`, { defaultValue: doc.templateId }) : "";
  const invitation = meta?.code.group === "invitation";
  const saveTarget = useSaveTarget();
  const session = useSession((s) => s.status);

  const [base, setBase] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    if (!doc) return;
    let alive = true;
    setBase(null);
    setLoadError(false);
    loadCodeTemplate(doc.templateId).then(
      (html) => alive && setBase(html),
      () => alive && setLoadError(true),
    );
    return () => {
      alive = false;
    };
  }, [doc?.templateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const model = useMemo(() => (base ? readModel(base) : null), [base]);
  const html = useMemo(() => (base && doc ? renderCodeSite(base, doc) : ""), [base, doc]);
  const debounced = useDebounced(html, PREVIEW_DELAY);

  const [editMode, setEditMode] = useState(true);
  const [mobile, setMobile] = useState(false);
  const [panel, setPanel] = useState<Panel>(null);
  const [deployOpen, setDeployOpen] = useState(params.get("step") === "deploy");
  const [deployHtml, setDeployHtml] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(true);
  const frame = useRef<HTMLIFrameElement>(null);
  /** Scroll position & cover state, carried to the next preview (does not trigger a render). */
  const view = useRef({ scrollY: 0, opened: false });
  const editRef = useRef(editMode);
  editRef.current = editMode;

  // Preview = HTML + bridge. Only rebuilt when the content changes (the mode is sent through messages).
  const rawPreview = useMemo(() => (debounced ? withBridge(debounced, { edit: editRef.current, ...view.current }) : ""), [debounced]);
  // v21: Asset Library images (`aset:<id>`) → data URLs for the sandboxed iframe.
  const [preview] = useResolvedAssets([rawPreview] as const);

  useEffect(() => {
    frame.current?.contentWindow?.postMessage({ type: BRIDGE_MSG, kind: "mode", edit: editMode }, "*");
  }, [editMode]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { type?: string; kind?: string; y?: number; pick?: StudioPick };
      if (!d || d.type !== BRIDGE_MSG) return;
      if (d.kind === "scroll" && typeof d.y === "number") view.current.scrollY = d.y;
      else if (d.kind === "opened") view.current.opened = true;
      else if (d.kind === "pick" && d.pick) {
        setHint(false);
        setPanel({ kind: "pick", pick: d.pick });
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // ?step=deploy from "My Websites": open the dialog once, then clean the URL.
  useEffect(() => {
    if (params.get("step") === "deploy") {
      const next = new URLSearchParams(params);
      next.delete("step");
      setParams(next, { replace: true });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /** Final HTML for download/deploy: invitation + account (not demo) → the Submissions address is set. */
  const finalHtml = useCallback(async (): Promise<string> => {
    if (!invitation || isDemoMode() || session !== "authenticated" || !project) return html;
    try {
      const ep = await ensureEndpoint("code-site", project.id, project.name);
      return withFormBridge(html, ep);
    } catch {
      notify.error(t("codeStudio.formOffline"));
      return html;
    }
  }, [invitation, session, project, html, t]);

  useEffect(() => {
    if (!deployOpen || !base) return;
    let alive = true;
    setDeployHtml(null);
    void finalHtml().then((h) => alive && setDeployHtml(h));
    return () => {
      alive = false;
    };
  }, [deployOpen, base]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!project || !doc || !meta)
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <EmptyState
          icon={FileWarning}
          title={t("codeEditor.notFound")}
          text={t("codeEditor.notFoundText")}
          action={
            <Link to={WEBSITE_HUB_PATH} className={btn.primary}>
              {t("flow.hub")}
            </Link>
          }
          testId="code-editor-missing"
        />
      </div>
    );

  const setEdits = (edits: CodeEdits) => updateDesign(CODE_SITE_TYPE, project.id, { ...doc, edits } satisfies CodeSiteDoc);
  const folder = `${project.name}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || doc.templateId;
  const ready = !!base && !!model;
  const changes = countEdits(doc.edits);

  const download = async () => {
    if (!ready || busy) return;
    setBusy(true);
    try {
      const zip = await buildCodeZip(doc.templateId, await finalHtml(), project.name, lang, folder, assetSource);
      triggerDownload(zip.blob, zip.fileName);
      notify.success(t("templates.downloadStarted", { file: zip.fileName }));
    } catch (e) {
      notify.error(t("templates.downloadFailed", { detail: e instanceof Error ? e.message : String(e) }));
    } finally {
      setBusy(false);
    }
  };

  const openTab = async () => {
    // The tab is opened right on click (so it is not blocked); its content follows once asset images are ready.
    const tab = html.includes("aset:") ? window.open("about:blank", "_blank") : null;
    const url = URL.createObjectURL(new Blob([await resolveForPreview(html)], { type: "text/html" }));
    if (tab) {
      tab.opener = null;
      tab.location.href = url;
    } else window.open(url, "_blank", "noopener");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const toggle = (p: Exclude<Panel, null>) => setPanel((cur) => (cur && cur.kind === p.kind ? null : p));
  const fields = panel?.kind === "pick" && model ? fieldsForPick(model, panel.pick) : null;
  const pickTitle =
    panel?.kind === "pick"
      ? fields?.image
        ? t("codeStudio.photo")
        : panel.pick.text
        ? (model?.texts.find((f) => f.key === panel.pick.text)?.label ?? t("codeStudio.text"))
        : panel.pick.section
          ? t(`codeStudio.sections.${panel.pick.section}`, { defaultValue: t("codeStudio.section", { name: panel.pick.section }) })
          : t("codeStudio.edit")
      : "";
  const SaveIcon = saveTarget === "account" ? Cloud : HardDrive;

  return (
    <>
      <AppMeta title={`${project.name} · ${t("codeEditor.title")}`} description={t("codeEditor.description")} />
      <div className="flex h-dvh flex-col bg-gray-100 dark:bg-gray-950" data-testid="code-editor">
        {/* -------- top bar -------- */}
        <header className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-white px-2 py-1.5 dark:border-gray-800 dark:bg-gray-900" data-testid="code-studio-bar">
          <Link to={WEBSITE_HUB_PATH} className={BAR_BTN} aria-label={t("studio.exitAria")} title={t("studio.exitAria")}>
            <ArrowLeft className="h-4 w-4" /> <span className="hidden lg:inline">{t("studio.exit")}</span>
          </Link>
          <div className="min-w-0 flex-1 basis-32 md:flex-none md:basis-56">
            <input
              defaultValue={project.name}
              key={project.name}
              aria-label={t("codeEditor.projectName")}
              onBlur={(e) => e.target.value.trim() && e.target.value !== project.name && renameDesign(CODE_SITE_TYPE, project.id, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="w-full min-w-0 rounded-md bg-transparent px-1.5 py-1 text-sm font-semibold text-gray-800 outline-none hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-brand-500/30 dark:text-white/90 dark:hover:bg-white/5 dark:focus:bg-gray-900"
            />
            <p className="hidden truncate px-1.5 text-[11px] text-gray-500 md:block dark:text-gray-400">
              {t("codeEditor.basedOn", { name: tplName })} · {t("codeEditor.changes", { count: changes })}
            </p>
          </div>

          <div className="flex gap-0.5 rounded-lg border border-gray-200 p-0.5 dark:border-gray-700" role="group" aria-label={t("codeStudio.modeAria")}>
            <button type="button" aria-pressed={editMode} onClick={() => setEditMode(true)} className={`${BAR_BTN} !h-7 ${editMode ? BAR_ON : ""}`} data-testid="code-mode-edit" title={t("codeStudio.editModeHint")}>
              <MousePointerClick className="h-3.5 w-3.5" /> {t("codeStudio.editMode")}
            </button>
            <button type="button" aria-pressed={!editMode} onClick={() => setEditMode(false)} className={`${BAR_BTN} !h-7 ${!editMode ? BAR_ON : ""}`} data-testid="code-mode-try" title={t("codeStudio.tryModeHint")}>
              <Play className="h-3.5 w-3.5" /> {t("codeStudio.tryMode")}
            </button>
          </div>
          <div className="hidden gap-0.5 rounded-lg border border-gray-200 p-0.5 sm:flex dark:border-gray-700" role="group" aria-label={t("website.viewport")}>
            {(
              [
                [false, Monitor, t("website.vp.desktop")],
                [true, Smartphone, t("website.vp.mobile")],
              ] as const
            ).map(([m, Icon, label]) => (
              <button key={label} type="button" aria-label={label} title={label} aria-pressed={mobile === m} onClick={() => setMobile(m)} className={`${BAR_BTN} !h-7 !px-2 ${mobile === m ? BAR_ON : ""}`}>
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-1">
            <span className="hidden items-center gap-1 px-1 text-[11px] text-gray-500 xl:inline-flex dark:text-gray-400" data-testid="code-save-state" title={t(saveTarget === "account" ? "studio.savedAccountLong" : saveTarget === "demo" ? "studio.savedDemoLong" : "studio.savedDeviceLong")}>
              <SaveIcon className="h-3.5 w-3.5" /> {t(saveTarget === "account" ? "studio.savedAccount" : "studio.savedDevice")}
            </span>
            <button type="button" className={`${BAR_BTN} ${panel?.kind === "style" ? BAR_ON : ""}`} onClick={() => toggle({ kind: "style" })} disabled={!ready} data-testid="code-open-style">
              <Palette className="h-4 w-4" /> <span className="hidden md:inline">{t("codeStudio.style")}</span>
            </button>
            <button type="button" className={`${BAR_BTN} ${panel?.kind === "all" ? BAR_ON : ""}`} onClick={() => toggle({ kind: "all", tab: model?.data.length ? "data" : "text" })} disabled={!ready} data-testid="code-open-all">
              <ListChecks className="h-4 w-4" /> <span className="hidden md:inline">{t("codeStudio.all")}</span>
            </button>
            <AssetLibraryButton className={BAR_BTN} labelClassName="hidden md:inline" />
            {invitation && (
              <button type="button" className={`${BAR_BTN} ${panel?.kind === "kiriman" ? BAR_ON : ""}`} onClick={() => toggle({ kind: "kiriman" })} data-testid="code-open-kiriman">
                <Inbox className="h-4 w-4" /> <span className="hidden md:inline">{t("kiriman.title")}</span>
              </button>
            )}
            <button type="button" className={BAR_BTN} onClick={download} disabled={!ready || busy} data-testid="code-download" title={t("codeEditor.download")} aria-label={t("codeEditor.download")}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />} <span className="hidden lg:inline">{t("codeEditor.download")}</span>
            </button>
            <button type="button" className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50" onClick={() => setDeployOpen(true)} disabled={!ready} data-testid="code-deploy">
              <Rocket className="h-4 w-4" /> {t("codeEditor.deploy")}
            </button>
          </div>
        </header>

        {/* -------- kanvas -------- */}
        <main className="relative min-h-0 flex-1">
          {loadError || (base !== null && !base) ? (
            <div className="p-4">
              <Notice tone="error" testId="code-editor-unavailable">
                {t("codeEditor.unavailable")}
              </Notice>
            </div>
          ) : !ready ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className={`flex h-full justify-center overflow-hidden ${mobile ? "py-3" : ""}`}>
              <iframe
                ref={frame}
                title={t("codeEditor.preview")}
                srcDoc={preview}
                sandbox={SANDBOX}
                data-testid="code-preview-frame"
                className={`h-full bg-white ${mobile ? "rounded-2xl border border-gray-300 shadow-lg dark:border-gray-700" : ""}`}
                style={{ width: mobile ? 390 : "100%", maxWidth: "100%" }}
              />
            </div>
          )}

          {ready && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3">
              <div className="flex max-w-xl items-center gap-2 rounded-full bg-gray-900/90 px-3 py-1.5 text-[11px] text-white shadow-lg" data-testid="code-studio-hint">
                {editMode ? <MousePointerClick className="h-3.5 w-3.5 shrink-0" /> : <Play className="h-3.5 w-3.5 shrink-0" />}
                <span>{editMode ? (hint ? t("codeStudio.hintEdit") : t("codeStudio.hintEditShort")) : t("codeStudio.hintTry")}</span>
                {editMode && (
                  <span className="hidden items-center gap-1 text-white/70 sm:inline-flex" title={t("codeStudio.lockedText")}>
                    <Lock className="h-3 w-3" /> {t("codeStudio.locked")}
                  </span>
                )}
                {debounced !== html && <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-label={t("codeEditor.updating")} />}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* -------- popup -------- */}
      {ready && panel?.kind === "pick" && fields && (
        <FloatingPanel title={pickTitle} icon={<MousePointerClick className="h-4 w-4" />} onClose={() => setPanel(null)} storageKey="code-pick" width={380} testId="code-pick-panel">
          <div className="flex flex-col gap-4">
            {isEmptyPick(fields) ? (
              <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300" data-testid="code-pick-empty">
                <p>{t("codeStudio.nothingHere")}</p>
                <button type="button" className={`${btn.secondary} self-start !py-1.5 text-xs`} onClick={() => setPanel({ kind: "all", tab: model.data.length ? "data" : "text" })}>
                  <ListChecks className="h-3.5 w-3.5" /> {t("codeStudio.all")}
                </button>
              </div>
            ) : (
              <>
                {fields.image && <PhotoField model={model} edits={doc.edits} onChange={setEdits} path={fields.image} />}
                {(fields.texts.length > 0 || fields.links.length > 0) && <TextTab model={model} edits={doc.edits} onChange={setEdits} only={{ texts: fields.texts, links: fields.links }} />}
                {fields.data.length > 0 && <DataBlocks model={model} edits={doc.edits} onChange={setEdits} only={fields.data} invitation={invitation} />}
                <button type="button" className="self-start text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300" onClick={() => setPanel({ kind: "all", tab: model.data.length ? "data" : "text" })}>
                  {t("codeStudio.seeAll")}
                </button>
              </>
            )}
          </div>
        </FloatingPanel>
      )}
      {ready && panel?.kind === "style" && (
        <FloatingPanel title={t("codeStudio.style")} icon={<Palette className="h-4 w-4" />} onClose={() => setPanel(null)} storageKey="code-style" width={380} testId="code-style-panel">
          <StyleTab model={model} edits={doc.edits} onChange={setEdits} />
        </FloatingPanel>
      )}
      {ready && panel?.kind === "all" && (
        <FloatingPanel
          title={t("codeStudio.all")}
          icon={<ListChecks className="h-4 w-4" />}
          onClose={() => setPanel(null)}
          storageKey="code-all"
          width={420}
          testId="code-all-panel"
          toolbar={
            <div role="tablist" className="flex gap-1 overflow-x-auto px-3 pt-1">
              {(
                [
                  ["text", t("codeEditor.tabText"), Type],
                  ...(model.data.length ? ([["data", model.data[0]?.label ?? t("codeEditor.tabData"), SlidersHorizontal]] as const) : []),
                ] as [Tab, string, typeof Type][]
              ).map(([id, label, Icon]) => (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={panel.tab === id}
                  onClick={() => setPanel({ kind: "all", tab: id })}
                  data-testid={`code-tab-${id}`}
                  className={`-mb-px inline-flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-semibold ${panel.tab === id ? "border-brand-600 text-brand-700 dark:text-brand-300" : "border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"}`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}
                </button>
              ))}
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            {panel.tab === "text" ? <TextTab model={model} edits={doc.edits} onChange={setEdits} /> : <DataBlocks model={model} edits={doc.edits} onChange={setEdits} invitation={invitation} />}
            <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3 dark:border-gray-800">
              <button type="button" className={`${btn.ghost} !px-2 text-xs`} onClick={() => setConfirmReset(true)} disabled={!changes} data-testid="code-reset">
                <RotateCcw className="h-3.5 w-3.5" /> {t("codeEditor.reset")}
              </button>
              <button type="button" onClick={openTab} className={`${btn.ghost} !px-2 text-xs`}>
                <ExternalLink className="h-3.5 w-3.5" /> {t("codeEditor.openTab")}
              </button>
              <Link to={TEMPLATES_PATH + "/" + doc.templateId} className="ml-auto text-xs font-semibold text-brand-700 hover:underline dark:text-brand-300">
                {t("codeEditor.viewTemplate")}
              </Link>
            </div>
          </div>
        </FloatingPanel>
      )}
      {panel?.kind === "kiriman" && (
        <FloatingPanel title={t("kiriman.title")} icon={<Inbox className="h-4 w-4" />} onClose={() => setPanel(null)} storageKey="code-kiriman" width={420} testId="code-kiriman-panel">
          <SubmissionsPanel projectType="code-site" projectId={project.id} projectName={project.name} invitation />
        </FloatingPanel>
      )}

      {deployOpen && ready && (
        <DeployDialog
          open
          onClose={() => setDeployOpen(false)}
          defaultRepo={folder}
          projectKey={deployKey("code", project.id)}
          withFiles={async (push) => {
            const content = deployHtml ?? (await finalHtml());
            return push([{ name: "index.html", content }]).then(
              () => "done" as const,
              () => "failed" as const,
            );
          }}
        />
      )}
      {confirmReset && (
        <Modal
          open
          size="sm"
          onClose={() => setConfirmReset(false)}
          icon={<RotateCcw className="h-5 w-5" />}
          title={t("codeEditor.resetTitle")}
          description={t("codeEditor.resetText")}
          testId="code-reset-dialog"
          footer={
            <>
              <button type="button" className={btn.secondary} onClick={() => setConfirmReset(false)}>
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className={btn.danger}
                onClick={() => {
                  setEdits({});
                  setConfirmReset(false);
                }}
              >
                {t("codeEditor.reset")}
              </button>
            </>
          }
        />
      )}
    </>
  );
}
