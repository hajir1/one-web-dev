import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Copy, ImageUp, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import { INPUT, Notice, btn } from "../components/app/ui";
import { notify } from "../components/app/Toaster";
import { useDesignStore } from "../pages/pageMaker/core/store/designStore";
import AssetImage from "./AssetImage";
import { assetRef } from "./refs";
import { currentBackend, useAssets, type UploadResult } from "./store";
import { assetUsage, type AssetUse } from "./usage";
import { ASSET_LIMITS, type AssetMeta } from "./types";

export const ACCEPT = ASSET_LIMITS.types.join(",");

export const fmtBytes = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

/** Unggah + pesan hasil (dipakai pustaka & pemilih). */
export function useUploader() {
  const { t } = useTranslation();
  const upload = useAssets((s) => s.upload);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const run = async (files: File[]): Promise<UploadResult> => {
    setProgress({ done: 0, total: files.length });
    try {
      const r = await upload(files, (done, total) => setProgress({ done, total }));
      for (const f of r.failed) notify.error(t(`assets.err.${f.code}`, { name: f.name, mb: ASSET_LIMITS.maxInputBytes / 1024 / 1024, max: ASSET_LIMITS.maxCount }));
      if (r.added.length) notify.success(t("assets.uploaded", { count: r.added.length }));
      return r;
    } finally {
      setProgress(null);
    }
  };
  return { run, progress };
}

/** Area seret-lepas + tombol pilih berkas. */
export function DropZone({ onFiles, busy, compact }: { onFiles: (f: File[]) => void; busy: string | null; compact?: boolean }) {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = [...e.dataTransfer.files].filter((f) => f.type.startsWith("image/"));
        if (files.length) onFiles(files);
      }}
      className={`flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition ${compact ? "px-3 py-4" : "px-4 py-10"} ${
        over ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10" : "border-gray-300 dark:border-gray-700"
      }`}
      data-testid="asset-dropzone"
    >
      {busy ? <Loader2 className="h-6 w-6 animate-spin text-brand-600" /> : <ImageUp className="h-6 w-6 text-gray-400" />}
      <p className="text-sm text-gray-600 dark:text-gray-300">{busy ?? t("assets.drop")}</p>
      <button type="button" className={`${btn.secondary} !py-1.5`} onClick={() => input.current?.click()} disabled={!!busy}>
        {t("assets.chooseFiles")}
      </button>
      <p className="text-xs text-gray-400">{t("assets.dropHint")}</p>
      <input
        ref={input}
        type="file"
        accept={ACCEPT}
        multiple
        hidden
        data-testid="asset-file-input"
        onChange={(e) => {
          const files = [...(e.target.files ?? [])];
          e.target.value = "";
          if (files.length) onFiles(files);
        }}
      />
    </div>
  );
}

function useTypeLabel() {
  const { t } = useTranslation();
  return (type: string) => (type === "page" ? t("assets.use.page") : type === "code-site" ? t("assets.use.codeSite") : t("assets.use.element"));
}

/**
 * Grid Pustaka Aset.
 *   mode "manage": unggah, ganti nama, salin rujukan, hapus (dicegah bila masih dipakai).
 *   mode "pick":   klik untuk memilih (bisa banyak bila `multiple`).
 */
export default function AssetLibrary({
  mode,
  multiple,
  selected,
  onSelect,
  onConfirm,
}: {
  mode: "manage" | "pick";
  multiple?: boolean;
  selected?: string[];
  onSelect?: (ids: string[]) => void;
  /** Klik ganda / Enter di mode pick. */
  onConfirm?: (ids: string[]) => void;
}) {
  const { t } = useTranslation();
  const { assets, loaded, loading, error, load, rename, remove } = useAssets();
  const designs = useDesignStore((s) => s.designs);
  const typeLabel = useTypeLabel();
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ asset: AssetMeta; uses: AssetUse[] } | null>(null);
  const { run, progress } = useUploader();
  const local = currentBackend().kind === "local";

  useEffect(() => {
    void load();
  }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? assets.filter((a) => a.name.toLowerCase().includes(s)) : assets;
  }, [assets, q]);
  const total = assets.reduce((n, a) => n + a.bytes, 0);
  const sel = new Set(selected ?? []);

  const toggle = (id: string) => {
    if (!onSelect) return;
    if (!multiple) return onSelect([id]);
    onSelect(sel.has(id) ? [...sel].filter((x) => x !== id) : [...sel, id]);
  };

  const askRemove = (a: AssetMeta) => setConfirm({ asset: a, uses: assetUsage(a.id, designs, typeLabel) });

  const busy = progress ? t("assets.uploading", { done: progress.done, total: progress.total }) : null;

  return (
    <div className="flex flex-col gap-3" data-testid={`asset-library-${mode}`}>
      <DropZone
        compact={assets.length > 0}
        busy={busy}
        onFiles={async (files) => {
          const r = await run(files);
          if (mode === "pick" && r.added.length && onSelect) onSelect(multiple ? [...sel, ...r.added.map((a) => a.id)] : [r.added[0].id]);
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[10rem] flex-1">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("assets.search")} className={`${INPUT} !py-1.5 pl-8`} aria-label={t("assets.search")} />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {t("assets.summary", { count: assets.length, size: fmtBytes(total) })} · {local ? t("assets.whereLocal") : t("assets.whereServer")}
        </span>
      </div>

      {error && <Notice tone="warn">{t("assets.loadFailed")}</Notice>}
      {!loaded && loading && (
        <p className="flex items-center gap-2 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("common.loading")}
        </p>
      )}
      {loaded && assets.length === 0 && <p className="text-center text-sm text-gray-500 dark:text-gray-400">{t("assets.empty")}</p>}
      {loaded && assets.length > 0 && shown.length === 0 && <p className="text-center text-sm text-gray-500">{t("assets.noMatch")}</p>}

      {confirm && (
        <div role="alertdialog" aria-label={t("assets.delete")} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm dark:border-rose-500/30 dark:bg-rose-500/10" data-testid="asset-delete-confirm">
          {confirm.uses.length > 0 ? (
            <>
              <p className="font-semibold text-rose-900 dark:text-rose-100">{t("assets.inUseTitle", { name: confirm.asset.name })}</p>
              <ul className="mt-1 list-disc pl-5 text-rose-800 dark:text-rose-200">
                {confirm.uses.slice(0, 6).map((u) => (
                  <li key={u.designId}>{u.label}</li>
                ))}
                {confirm.uses.length > 6 && <li>{t("assets.inUseMore", { count: confirm.uses.length - 6 })}</li>}
              </ul>
              <p className="mt-1 text-rose-800 dark:text-rose-200">{t("assets.inUseText")}</p>
            </>
          ) : (
            <p className="text-rose-900 dark:text-rose-100">{t("assets.deleteConfirm", { name: confirm.asset.name })}</p>
          )}
          <div className="mt-2 flex gap-2">
            <button type="button" className={`${btn.secondary} !py-1.5`} onClick={() => setConfirm(null)}>
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className={`${btn.danger} !py-1.5`}
              data-testid="asset-delete-ok"
              onClick={() => {
                const a = confirm.asset;
                setConfirm(null);
                void remove(a.id).then(
                  () => notify.success(t("assets.deleted", { name: a.name })),
                  () => notify.error(t("assets.err.network")),
                );
              }}
            >
              {confirm.uses.length > 0 ? t("assets.deleteAnyway") : t("assets.delete")}
            </button>
          </div>
        </div>
      )}

      <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4" role={mode === "pick" ? "listbox" : undefined} aria-multiselectable={mode === "pick" ? !!multiple : undefined}>
        {shown.map((a) => {
          const on = sel.has(a.id);
          return (
            <li
              key={a.id}
              role={mode === "pick" ? "option" : undefined}
              aria-selected={mode === "pick" ? on : undefined}
              data-testid="asset-card"
              className={`group relative overflow-hidden rounded-xl border bg-white transition dark:bg-gray-900 ${
                on ? "border-brand-600 ring-2 ring-brand-500/40" : "border-gray-200 dark:border-gray-800"
              }`}
            >
              <button
                type="button"
                className="block w-full text-left"
                onClick={() => (mode === "pick" ? toggle(a.id) : undefined)}
                onDoubleClick={() => mode === "pick" && onConfirm?.(multiple ? [...new Set([...sel, a.id])] : [a.id])}
                tabIndex={mode === "pick" ? 0 : -1}
                aria-label={a.name}
              >
                <span className="block aspect-[4/3] bg-[repeating-conic-gradient(#f3f4f6_0_25%,#fff_0_50%)] bg-[length:16px_16px] dark:bg-gray-800">
                  <AssetImage src={assetRef(a.id)} className="h-full w-full object-contain" />
                </span>
              </button>
              {on && (
                <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                  <Check className="h-4 w-4" />
                </span>
              )}
              <div className="flex items-start gap-1 px-2 py-1.5">
                <div className="min-w-0 flex-1">
                  {editing === a.id ? (
                    <input
                      autoFocus
                      defaultValue={a.name}
                      className={`${INPUT} !px-1.5 !py-0.5 text-xs`}
                      onBlur={(e) => {
                        setEditing(null);
                        if (e.target.value.trim() && e.target.value !== a.name) void rename(a.id, e.target.value).catch(() => notify.error(t("assets.err.network")));
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                        if (e.key === "Escape") setEditing(null);
                      }}
                      aria-label={t("assets.rename")}
                    />
                  ) : (
                    <p className="truncate text-xs font-medium text-gray-800 dark:text-white/90" title={a.name}>
                      {a.name}
                    </p>
                  )}
                  <p className="text-[11px] text-gray-400">
                    {a.width && a.height ? `${a.width}×${a.height} · ` : ""}
                    {fmtBytes(a.bytes)}
                  </p>
                </div>
                {mode === "manage" && (
                  <div className="flex shrink-0">
                    <button type="button" className={`${btn.icon} !h-7 !w-7`} onClick={() => setEditing(a.id)} aria-label={t("assets.rename")} title={t("assets.rename")}>
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      className={`${btn.icon} !h-7 !w-7`}
                      onClick={() => {
                        void navigator.clipboard?.writeText(assetRef(a.id)).then(() => notify.success(t("assets.copied")));
                      }}
                      aria-label={t("assets.copyRef")}
                      title={t("assets.copyRefHint")}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" className={`${btn.icon} !h-7 !w-7 hover:!text-rose-600`} onClick={() => askRemove(a)} aria-label={t("assets.delete")} title={t("assets.delete")} data-testid="asset-delete">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

    </div>
  );
}
