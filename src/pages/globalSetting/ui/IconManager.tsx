import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";
import {
  isValidSvg,
  normalizeSvg,
  resizeSvg,
  sanitizeSvg,
  useIconStore,
} from "../../pageMaker/core/store/iconStore";

const MAX_SVG_BYTES = 200 * 1024;
const BTN_PRIMARY =
  "inline-flex items-center gap-1.5 rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50";
const BTN_GHOST =
  "inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5";
const INPUT =
  "w-full rounded border border-gray-300 bg-white px-2.5 py-2 text-sm text-gray-800 outline-none focus:border-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

/** "panah-kanan.svg" → "panah kanan" */
const nameFromFile = (file: string, fallback: string) =>
  file.replace(/\.svg$/i, "").replace(/[-_]+/g, " ").trim() || fallback;

export default function IconManager() {
  const { t } = useTranslation();
  const { icons, addIcon, renameIcon, removeIcon } = useIconStore();

  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSvg, setNewSvg] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = icons.filter((i) =>
    i.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  const handleAdd = () => {
    const svg = normalizeSvg(newSvg);
    if (!isValidSvg(svg)) {
      setError(t("gs.icon.invalidSvg"));
      return;
    }
    addIcon(newName, svg);
    setNewName("");
    setNewSvg("");
    setError(null);
    setShowForm(false);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    let ok = 0;
    const problems: string[] = [];
    for (const file of Array.from(files)) {
      if (file.size > MAX_SVG_BYTES) {
        problems.push(t("gs.icon.tooLarge", { name: file.name }));
        continue;
      }
      const svg = normalizeSvg(await file.text());
      if (!isValidSvg(svg)) {
        problems.push(t("gs.icon.notSvg", { name: file.name }));
        continue;
      }
      addIcon(nameFromFile(file.name, t("gs.icon.defaultName")), svg);
      ok++;
    }
    setNotice(
      problems.length
        ? t("gs.icon.addedSkipped", { count: ok, skipped: problems.join("; ") })
        : t("gs.icon.added", { count: ok }),
    );
    if (fileRef.current) fileRef.current.value = "";
  };

  const startRename = (id: string, name: string) => {
    setRenamingId(id);
    setRenameValue(name);
  };
  const confirmRename = () => {
    if (renamingId) renameIcon(renamingId, renameValue);
    setRenamingId(null);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-48 flex-1 items-center gap-2 rounded border border-gray-300 px-2.5 py-2 dark:border-gray-700">
          <Search size={15} className="shrink-0 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("gs.icon.searchPlaceholder")}
            aria-label={t("gs.icon.search")}
            className="min-w-0 flex-1 bg-transparent text-sm text-gray-700 outline-none dark:text-gray-300"
          />
        </div>
        <button type="button" onClick={() => fileRef.current?.click()} className={BTN_GHOST}>
          <Upload size={15} /> {t("gs.icon.upload")}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".svg,image/svg+xml"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />
        <button type="button" onClick={() => setShowForm((v) => !v)} className={BTN_PRIMARY}>
          <Plus size={15} /> {t("gs.icon.paste")}
        </button>
      </div>

      {notice && (
        <p
          role="status"
          className="flex items-start justify-between gap-3 rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-900 dark:bg-blue-900/20 dark:text-blue-200"
        >
          <span>{notice}</span>
          <button type="button" aria-label={t("gs.icon.closeNotice")} onClick={() => setNotice(null)}>
            <X size={14} />
          </button>
        </p>
      )}

      {showForm && (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder={t("gs.icon.namePlaceholder")}
            aria-label={t("gs.icon.name")}
            className={INPUT}
          />
          <textarea
            value={newSvg}
            onChange={(e) => setNewSvg(e.target.value)}
            placeholder="<svg ...>...</svg>"
            aria-label={t("gs.icon.code")}
            rows={5}
            className={`${INPUT} font-mono`}
          />
          {newSvg.trim() && isValidSvg(newSvg) && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              {t("gs.icon.preview")}
              <span
                className="size-8 text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: resizeSvg(sanitizeSvg(newSvg), 32) }}
              />
            </div>
          )}
          {error && <p className="text-sm text-rose-600 dark:text-rose-400">{error}</p>}
          <div className="flex gap-2">
            <button type="button" onClick={handleAdd} className={BTN_PRIMARY}>
              {t("gs.icon.save")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setError(null);
              }}
              className={BTN_GHOST}
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}

      {filtered.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {filtered.map((icon) => {
            const renaming = renamingId === icon.id;
            const confirming = confirmId === icon.id;
            return (
              <li
                key={icon.id}
                title={icon.name}
                className="group relative flex flex-col items-center gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800"
              >
                {renaming ? (
                  <input
                    autoFocus
                    value={renameValue}
                    aria-label={t("gs.icon.name")}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={confirmRename}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") confirmRename();
                      if (e.key === "Escape") setRenamingId(null);
                    }}
                    className="mt-4 w-full rounded border border-gray-300 px-1.5 py-1 text-xs dark:border-gray-700 dark:bg-gray-900"
                  />
                ) : (
                  <>
                    <span
                      className="flex size-10 items-center justify-center text-gray-700 dark:text-gray-300"
                      dangerouslySetInnerHTML={{ __html: resizeSvg(sanitizeSvg(icon.svg), 32) }}
                    />
                    <span className="w-full truncate text-center text-xs text-gray-500 dark:text-gray-400">
                      {icon.name}
                    </span>
                  </>
                )}

                {confirming ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl bg-white/95 p-2 text-center dark:bg-gray-900/95">
                    <p className="text-[11px] leading-tight text-gray-600 dark:text-gray-300">
                      {t("gs.icon.deleteConfirm")}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          removeIcon(icon.id);
                          setConfirmId(null);
                        }}
                        className="inline-flex items-center gap-1 rounded bg-rose-600 px-2 py-1 text-xs font-semibold text-white"
                      >
                        <Check size={12} /> {t("common.delete")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="rounded px-2 py-1 text-xs text-gray-500"
                      >
                        {t("common.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  !renaming && (
                    <div className="absolute right-1 top-1 flex gap-0.5 rounded bg-white/90 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100 dark:bg-gray-900/90">
                      <button
                        type="button"
                        onClick={() => startRename(icon.id, icon.name)}
                        title={t("gs.icon.rename")}
                        aria-label={t("gs.icon.renameAria", { name: icon.name })}
                        className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-white/80"
                      >
                        <Pencil size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(icon.id)}
                        title={t("gs.icon.deleteTitle")}
                        aria-label={t("gs.icon.deleteAria", { name: icon.name })}
                        className="p-1 text-gray-400 hover:text-rose-600"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {icons.length === 0
            ? t("gs.icon.empty")
            : t("gs.icon.noMatch")}
        </p>
      )}
    </div>
  );
}
