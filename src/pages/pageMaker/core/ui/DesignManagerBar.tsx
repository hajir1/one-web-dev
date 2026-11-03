import { useEffect, useState, type ReactNode } from "react";
import { Trans, useTranslation } from "react-i18next";
import { filterDesigns } from "../helpers/designSearch";
import {
  Check,
  ChevronDown,
  Clock,
  Copy,
  FolderOpen,
  Pencil,
  Plus,
  Save,
  Trash2,
  Search,
} from "lucide-react";
import type { DesignManagerProps } from "./PanelStyling";
import type { SavedDesign } from "../store/designStore";
import { formatDate } from "../helpers/formatDate";

/** Aksi yang menunggu konfirmasi karena akan membuang perubahan yang belum disimpan. */
type PendingAction = { kind: "load"; design: SavedDesign } | { kind: "new" };

const TONE_CLASS = {
  ok: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  warn: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
  idle: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
} as const;

const DOT_CLASS = {
  ok: "bg-green-500",
  warn: "bg-amber-500",
  idle: "bg-gray-400",
} as const;

const PRIMARY_BTN =
  "inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-blue-800 text-white rounded px-3.5 py-2 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed";
const OUTLINE_BTN =
  "inline-flex items-center justify-center gap-1.5 text-sm font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded px-3.5 py-2 hover:bg-gray-50 dark:hover:bg-white/5";
const GHOST_BTN =
  "inline-flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 rounded px-3 py-2 hover:text-gray-800 dark:hover:text-white/90";

/**
 * Bilah "Desain Saya": simpan, buka, dan kelola desain di browser ini.
 * Dibuat untuk pengguna awam — bahasa sederhana, status yang jelas
 * ("sudah tersimpan" / "ada perubahan"), satu tombol utama yang berubah
 * sesuai konteks, dan konfirmasi sebelum membuang pekerjaan.
 * Tidak tergantung jenis elemen: cukup beri hasil `useDesignSaver`.
 */
export default function DesignManagerBar({
  design,
  extra,
}: {
  design: DesignManagerProps;
  /** Konten tambahan di bawah daftar desain (mis. tautan Folder Website). */
  extra?: ReactNode;
}) {
  const { t } = useTranslation();
  const {
    designs,
    activeDesign,
    activeDesignId,
    designNameInput,
    setDesignNameInput,
    renamingId,
    renameValue,
    setRenameValue,
    isDirty,
    handleSaveNew,
    handleSaveChanges,
    handleDuplicate,
    freeLimit,
    limitReached,
    handleNewDesign,
    handleLoad,
    handleDelete,
    startRename,
    confirmRename,
    cancelRename,
  } = design;

  const [listOpen, setListOpen] = useState(false);
  const [query, setQuery] = useState("");
  const shown = filterDesigns(designs, query);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  /** Pesan berhasil sebagai kunci i18n + parameter (diterjemahkan saat render). */
  const [notice, setNotice] = useState<{ key: string; opts?: Record<string, unknown> } | null>(null);

  // Pesan "berhasil disimpan" hilang sendiri.
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timer);
  }, [notice]);

  /* ---------------- aksi ---------------- */

  const onSaveNew = () => {
    const name = designNameInput.trim() || t("pm.design.defaultName", { n: designs.length + 1 });
    if (handleSaveNew()) setNotice({ key: "pm.design.saved", opts: { name } });
  };

  const onSaveChanges = () => {
    if (handleSaveChanges()) setNotice({ key: "pm.design.changesSaved", opts: { name: activeDesign?.name } });
  };

  const onDuplicate = () => {
    if (handleDuplicate()) setNotice({ key: "pm.design.duplicated" });
  };

  const requestLoad = (d: SavedDesign) => {
    if (isDirty) setPending({ kind: "load", design: d });
    else handleLoad(d);
  };

  const requestNew = () => {
    if (isDirty) setPending({ kind: "new" });
    else handleNewDesign();
  };

  const confirmPending = () => {
    if (!pending) return;
    if (pending.kind === "load") handleLoad(pending.design);
    else handleNewDesign();
    setPending(null);
  };

  /* ---------------- status ---------------- */

  const status: { tone: keyof typeof TONE_CLASS; text: string } = activeDesign
    ? isDirty
      ? { tone: "warn", text: t("pm.design.status.dirty") }
      : { tone: "ok", text: t("pm.design.status.saved") }
    : isDirty
      ? { tone: "warn", text: t("pm.design.status.unsaved") }
      : { tone: "idle", text: t("pm.design.status.idle") };

  return (
    <section
      aria-label={t("pm.editor.myDesigns")}
      className="rounded-lg border border-gray-200 dark:border-gray-800 p-4 sm:p-5 flex flex-col gap-4"
    >
      {/* Judul + penjelasan + status */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
            <Save size={16} />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">
              {activeDesign
                ? t("pm.design.editing", { name: activeDesign.name })
                : t("pm.design.new")}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-relaxed">
              {t("pm.design.intro")}
            </p>
          </div>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 self-start flex-shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASS[status.tone]}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${DOT_CLASS[status.tone]}`} />
          {status.text}
        </span>
      </div>

      {freeLimit !== undefined && (
        <div
          data-testid="design-quota"
          className={`flex flex-wrap items-center gap-x-2 gap-y-1 rounded px-3 py-2 text-xs ${
            limitReached
              ? "bg-amber-50 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300"
              : "bg-gray-50 text-gray-600 dark:bg-white/5 dark:text-gray-300"
          }`}
        >
          <b>
            {t("pm.design.quotaUsed", { used: Math.min(designs.length, freeLimit), limit: freeLimit })}
          </b>
          <span>
            {limitReached
              ? t("pm.design.quotaFull")
              : t("pm.design.quotaHint")}
          </span>
        </div>
      )}

      {/* Aksi utama — berubah sesuai konteks */}
      {activeDesign ? (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSaveChanges}
            disabled={!isDirty}
            className={PRIMARY_BTN}
          >
            <Check size={14} /> {t("pm.design.saveChanges")}
          </button>
          <button type="button" onClick={onDuplicate} className={OUTLINE_BTN}>
            <Copy size={14} /> {t("pm.design.saveCopy")}
          </button>
          <button type="button" onClick={requestNew} className={GHOST_BTN}>
            <Plus size={14} /> {t("pm.design.startNew")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={designNameInput}
            onChange={(e) => setDesignNameInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSaveNew()}
            placeholder={t("pm.design.namePlaceholder")}
            aria-label={t("pm.leave.designName")}
            className="flex-1 min-w-0 sm:max-w-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-800 dark:text-white/90 px-3 py-2"
          />
          <button type="button" onClick={onSaveNew} className={PRIMARY_BTN}>
            <Save size={14} /> {t("pm.design.save")}
          </button>
        </div>
      )}

      {/* Konfirmasi sebelum membuang perubahan */}
      {pending && (
        <div
          role="alertdialog"
          className="flex flex-col sm:flex-row sm:items-center gap-2 rounded border border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10 px-3 py-2.5"
        >
          <p className="flex-1 text-xs text-amber-800 dark:text-amber-300">
            {t("pm.design.discardConfirm")}
          </p>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={confirmPending}
              className="text-xs font-semibold bg-amber-600 text-white rounded px-2.5 py-1.5 hover:opacity-90"
            >
              {t("pm.design.yesContinue")}
            </button>
            <button
              type="button"
              onClick={() => setPending(null)}
              className="text-xs font-semibold text-gray-600 dark:text-gray-300 rounded px-2.5 py-1.5 hover:text-gray-900 dark:hover:text-white"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {/* Pesan berhasil */}
      <p
        aria-live="polite"
        className={`text-xs text-green-700 dark:text-green-400 flex items-center gap-1.5 ${
          notice ? "" : "hidden"
        }`}
      >
        <Check size={13} /> {notice ? t(notice.key, notice.opts) : null}
      </p>

      {/* Daftar desain tersimpan */}
      <div className="border-t border-gray-200 dark:border-gray-800 pt-3">
        <button
          type="button"
          onClick={() => setListOpen((v) => !v)}
          aria-expanded={listOpen}
          className="w-full flex items-center justify-between gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <span className="inline-flex items-center gap-1.5">
            <FolderOpen size={14} />
            {t("pm.design.savedList", { count: designs.length })}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform duration-200 ${
              listOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {listOpen &&
          (designs.length === 0 ? (
            <p className="text-xs text-gray-400 mt-3 leading-relaxed">
              <Trans i18nKey="pm.design.empty" components={{ b: <span className="font-semibold" /> }} />
            </p>
          ) : (
            <>
            <div className="relative mt-3">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("pm.design.searchPlaceholder")}
                aria-label={t("pm.design.searchPlaceholder")}
                data-testid="design-search"
                className="w-full rounded border border-gray-200 bg-white py-1.5 pl-8 pr-2 text-xs text-gray-800 outline-none focus:border-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </div>
            {query.trim() && (
              <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400" data-testid="design-search-count">
                {shown.length ? t("pm.design.searchCount", { count: shown.length, total: designs.length }) : t("pm.design.searchEmpty", { query: query.trim() })}
              </p>
            )}
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((d) => {
                const isActive = d.id === activeDesignId;
                return (
                  <li
                    key={d.id}
                    className={`rounded border px-3 py-2.5 flex flex-col gap-2 ${
                      isActive
                        ? "border-blue-800 bg-blue-50 dark:bg-blue-900/10"
                        : "border-gray-200 dark:border-gray-800"
                    }`}
                  >
                    {renamingId === d.id ? (
                      <div className="flex items-center gap-1.5">
                        <input
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmRename();
                            if (e.key === "Escape") cancelRename();
                          }}
                          aria-label={t("pm.design.newName")}
                          className="flex-1 min-w-0 text-sm rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-2 py-1"
                        />
                        <button
                          type="button"
                          onClick={confirmRename}
                          title={t("pm.design.saveName")}
                          aria-label={t("pm.design.saveName")}
                        >
                          <Check size={15} className="text-green-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90 truncate">
                          {d.name}
                          {isActive && (
                            <span className="ml-1.5 text-[10px] font-semibold text-blue-800 dark:text-blue-400">
                              {t("pm.design.opened")}
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-gray-400 flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {formatDate(d.updatedAt)}
                        </p>
                      </div>
                    )}

                    {confirmDeleteId === d.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-rose-600 dark:text-rose-400 flex-1">
                          {t("pm.design.deleteConfirm")}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            handleDelete(d.id);
                            setConfirmDeleteId(null);
                          }}
                          className="text-xs font-semibold bg-rose-600 text-white rounded px-2 py-1 hover:opacity-90"
                        >
                          {t("common.delete")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-1.5 py-1"
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => requestLoad(d)}
                          disabled={isActive && !isDirty}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded px-2.5 py-1.5 hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          <FolderOpen size={12} />
                          {isActive && isDirty ? t("pm.design.revert") : t("common.open")}
                        </button>
                        <button
                          type="button"
                          onClick={() => startRename(d)}
                          title={t("pm.design.rename")}
                          aria-label={t("pm.design.renameNamed", { name: d.name })}
                          className="p-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white/80"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(d.id)}
                          title={t("pm.design.delete")}
                          aria-label={t("pm.design.deleteNamed", { name: d.name })}
                          className="p-1.5 text-gray-400 hover:text-rose-600"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            </>
          ))}
      </div>
      {extra}
    </section>
  );
}
