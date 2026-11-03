import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, Database, LocateFixed, Pencil, Plus, Rocket, Search, Settings2, Trash2, X } from "lucide-react";
import Modal from "../../../../components/app/Modal";
import { btn } from "../../../../components/app/ui";
import AssetImage from "../../../../assetLibrary/AssetImage";
import ImageValueInput from "../../../../assetLibrary/ImageValueInput";
import {
  addItem,
  itemSlugify,
  slugError,
  collectionSlug,
  emptyValues,
  formatPrice,
  isValidCollectionSlug,
  moveItem,
  queryItems,
  removeItem,
  updateItem,
  validateValues,
  type CollectionDef,
  CATEGORY_MAX,
  categoriesOf,
  type CollectionField,
  type CollectionItem,
  type FieldErrors,
} from "../../helpers/collections";

/* ================================================================== */
/* Dashboard Data (uji coba CRUD)                                        */
/*                                                                    */
/* Satu layar untuk semua koleksi di website: tabel + cari + pagination, */
/* tambah / ubah / hapus / urutkan. Setiap perubahan langsung menyusun   */
/* ulang kartu di halaman (lewat `onChange`); situs online berubah       */
/* setelah Deploy ulang.                                                 */
/* ================================================================== */

export interface DashboardEntry {
  /** Unik di dashboard: `<pageId>:<boxId>`. */
  key: string;
  pageTitle: string;
  boxId: string;
  col: CollectionDef;
}

const PER_PAGE = [5, 10, 20];
const FIELD =
  "rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";
const INPUT = `w-full ${FIELD}`;

export default function CollectionDashboard({
  entries,
  initialKey,
  onChange,
  onLocate,
  onDeploy,
  onClose,
}: {
  entries: DashboardEntry[];
  initialKey?: string | null;
  onChange: (entry: DashboardEntry, next: CollectionDef) => void;
  onLocate?: (entry: DashboardEntry) => void;
  onDeploy?: () => void;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState<string | null>(initialKey ?? entries[0]?.key ?? null);
  const entry = entries.find((e) => e.key === activeKey) ?? entries[0] ?? null;
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [editing, setEditing] = useState<{ item: CollectionItem | null } | null>(null);
  const [deleting, setDeleting] = useState<CollectionItem | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => setPage(1), [q, perPage, activeKey]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !editing && !deleting && !settingsOpen) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, deleting, settingsOpen, onClose]);

  const result = useMemo(() => (entry ? queryItems(entry.col, q, page, perPage) : null), [entry, q, page, perPage]);
  const save = (next: CollectionDef) => entry && onChange(entry, next);
  const single = entry?.col.name ?? "";

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-50 text-gray-800 dark:bg-gray-950 dark:text-white/90" role="dialog" aria-modal="true" aria-label={t("crud.title")} data-testid="crud-dashboard">
      {/* ---------- bilah atas ---------- */}
      <header className="flex shrink-0 items-center gap-2 border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-800 dark:bg-gray-900">
        <Database className="h-5 w-5 shrink-0 text-brand-600" />
        <h1 className="min-w-0 flex-1 truncate text-sm font-semibold">{t("crud.title")}</h1>
        {onDeploy && (
          <button type="button" onClick={onDeploy} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700" data-testid="crud-deploy">
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">{t("crud.redeploy")}</span>
          </button>
        )}
        <button type="button" onClick={onClose} className={btn.icon} aria-label={t("crud.close")} title={t("crud.close")} data-testid="crud-close">
          <X className="h-5 w-5" />
        </button>
      </header>

      {!entry ? (
        <div className="m-auto max-w-md p-6 text-center" data-testid="crud-empty-site">
          <Database className="mx-auto mb-3 h-10 w-10 text-gray-300" />
          <h2 className="mb-2 font-semibold">{t("crud.noneTitle")}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t("crud.noneText")}</p>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col md:flex-row">
          {/* ---------- daftar koleksi ---------- */}
          <aside className="shrink-0 border-b border-gray-200 bg-white p-3 md:w-60 md:border-r md:border-b-0 dark:border-gray-800 dark:bg-gray-900">
            <p className="mb-2 hidden px-2 text-[11px] font-semibold tracking-wide text-gray-400 uppercase md:block">{t("crud.collections")}</p>
            <select className={`${INPUT} md:hidden`} value={entry.key} onChange={(e) => setActiveKey(e.target.value)} aria-label={t("crud.collections")}>
              {entries.map((e) => (
                <option key={e.key} value={e.key}>
                  {e.col.name} · {e.pageTitle}
                </option>
              ))}
            </select>
            <nav className="hidden flex-col gap-1 md:flex">
              {entries.map((e) => (
                <button
                  key={e.key}
                  type="button"
                  onClick={() => setActiveKey(e.key)}
                  aria-current={e.key === entry.key ? "page" : undefined}
                  className={`flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm ${e.key === entry.key ? "bg-brand-50 font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "hover:bg-gray-100 dark:hover:bg-white/5"}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate">{e.col.name}</span>
                    <span className="block truncate text-[11px] font-normal text-gray-400">{e.pageTitle}</span>
                  </span>
                  <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-white/10 dark:text-gray-300">{e.col.items.length}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* ---------- isi koleksi ---------- */}
          <main className="min-h-0 min-w-0 flex-1 overflow-y-auto p-3 sm:p-5">
            <div className="mx-auto max-w-6xl">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <div className="min-w-0 basis-full sm:basis-auto sm:flex-1">
                  <h2 className="truncate text-lg font-semibold" data-testid="crud-collection-name">
                    {entry.col.name}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t("crud.subtitle", { count: entry.col.items.length, page: entry.pageTitle })}</p>
                </div>
                {onLocate && (
                  <button type="button" className={btn.secondary} onClick={() => onLocate(entry)} title={t("crud.locateTitle")}>
                    <LocateFixed className="h-4 w-4" />
                    <span className="hidden sm:inline">{t("crud.locate")}</span>
                  </button>
                )}
                <button type="button" className={btn.secondary} onClick={() => setSettingsOpen(true)} aria-label={t("crud.settings")} title={t("crud.settings")} data-testid="crud-settings">
                  <Settings2 className="h-4 w-4" />
                </button>
                <button type="button" className={btn.primary} onClick={() => setEditing({ item: null })} data-testid="crud-add">
                  <Plus className="h-4 w-4" />
                  {t("crud.add", { name: single.toLowerCase() })}
                </button>
              </div>

              <p className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-900 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-200">{t("crud.liveNote")}</p>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                <label className="relative min-w-0 flex-1 basis-56">
                  <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("crud.search", { name: single.toLowerCase() })} className={`${INPUT} pl-9`} aria-label={t("crud.searchAria")} data-testid="crud-search" />
                </label>
                <select className={FIELD} value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} aria-label={t("crud.perPageAria")} data-testid="crud-per-page">
                  {PER_PAGE.map((n) => (
                    <option key={n} value={n}>
                      {t("crud.perPage", { count: n })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <table className="w-full text-sm" data-testid="crud-table">
                  <thead className="bg-gray-50 text-left text-[11px] tracking-wide text-gray-500 uppercase dark:bg-white/5 dark:text-gray-400">
                    <tr>
                      <th className="w-14 px-3 py-2.5">{t("crud.col.image")}</th>
                      <th className="px-3 py-2.5">{t("crud.col.name")}</th>
                      <th className="hidden px-3 py-2.5 text-right sm:table-cell">{t("crud.col.price")}</th>
                      <th className="hidden px-3 py-2.5 text-right sm:table-cell">{t("crud.col.rating")}</th>
                      <th className="hidden px-3 py-2.5 md:table-cell">{t("crud.col.label")}</th>
                      <th className="px-3 py-2.5 text-right">{t("crud.col.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result && result.rows.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-3 py-10 text-center text-gray-500 dark:text-gray-400" data-testid="crud-empty">
                          {q ? t("crud.noResult", { q }) : t("crud.emptyRows")}
                        </td>
                      </tr>
                    )}
                    {result?.rows.map((it) => {
                      const index = entry.col.items.indexOf(it);
                      return (
                        <tr key={it.id} className="border-t border-gray-100 dark:border-gray-800" data-testid="crud-row">
                          <td className="px-3 py-2">
                            {it.values.image ? <AssetImage src={String(it.values.image)} alt="" className="h-10 w-10 rounded-md bg-gray-100 object-cover" /> : <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-white/10" />}
                          </td>
                          <td className="max-w-40 px-3 py-2 sm:max-w-64">
                            <span className="block truncate font-medium">{String(it.values.name ?? "")}</span>
                            {it.values.description ? <span className="block truncate text-xs text-gray-500 dark:text-gray-400">{String(it.values.description)}</span> : null}
                            <span className="block text-xs font-semibold tabular-nums sm:hidden">{formatPrice(it.values.price)}</span>
                          </td>
                          <td className="hidden px-3 py-2 text-right whitespace-nowrap tabular-nums sm:table-cell">
                            <span className="font-semibold">{formatPrice(it.values.price)}</span>
                            {Number(it.values.compare_price) > 0 && <s className="block text-xs text-gray-400">{formatPrice(it.values.compare_price)}</s>}
                          </td>
                          <td className="hidden px-3 py-2 text-right tabular-nums sm:table-cell">
                            ★ {Number(it.values.rating ?? 0).toFixed(1)}
                            {Number(it.values.reviews) > 0 && <span className="text-xs text-gray-400"> ({Number(it.values.reviews)})</span>}
                          </td>
                          <td className="hidden px-3 py-2 md:table-cell">{it.values.label ? <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-500/15 dark:text-amber-300">{String(it.values.label)}</span> : null}</td>
                          <td className="px-2 py-2 text-right whitespace-nowrap">
                            {!q && (
                              <>
                                <button type="button" className={`${btn.icon} hidden sm:inline-flex`} disabled={index <= 0} onClick={() => save(moveItem(entry.col, it.id, -1))} aria-label={t("crud.moveUp")} title={t("crud.moveUp")}>
                                  <ArrowUp className="h-4 w-4" />
                                </button>
                                <button type="button" className={`${btn.icon} hidden sm:inline-flex`} disabled={index >= entry.col.items.length - 1} onClick={() => save(moveItem(entry.col, it.id, 1))} aria-label={t("crud.moveDown")} title={t("crud.moveDown")}>
                                  <ArrowDown className="h-4 w-4" />
                                </button>
                              </>
                            )}
                            <button type="button" className={btn.icon} onClick={() => setEditing({ item: it })} aria-label={t("crud.edit")} title={t("crud.edit")} data-testid="crud-edit">
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button type="button" className={`${btn.icon} hover:!text-rose-600`} onClick={() => setDeleting(it)} aria-label={t("crud.delete")} title={t("crud.delete")} data-testid="crud-delete">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {result && result.total > 0 && (
                <nav className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400" aria-label={t("crud.pagerAria")} data-testid="crud-pager">
                  <span>{t("crud.range", { from: result.from, to: result.from + result.rows.length - 1, total: result.total })}</span>
                  <span className="flex items-center gap-1">
                    <button type="button" className={btn.secondary + " !px-3 !py-1.5 !text-xs"} disabled={result.page <= 1} onClick={() => setPage(result.page - 1)} data-testid="crud-prev">
                      {t("crud.prev")}
                    </button>
                    <span className="px-2" data-testid="crud-page">
                      {t("crud.pageOf", { page: result.page, pages: result.pages })}
                    </span>
                    <button type="button" className={btn.secondary + " !px-3 !py-1.5 !text-xs"} disabled={result.page >= result.pages} onClick={() => setPage(result.page + 1)} data-testid="crud-next">
                      {t("crud.next")}
                    </button>
                  </span>
                </nav>
              )}
            </div>
          </main>
        </div>
      )}

      {entry && editing && (
        <ItemForm
          col={entry.col}
          item={editing.item}
          onCancel={() => setEditing(null)}
          onSave={(values, slug) => {
            save(editing.item ? updateItem(entry.col, editing.item.id, values, slug) : addItem(entry.col, values, true, slug));
            setEditing(null);
            if (!editing.item) {
              setQ("");
              setPage(1);
            }
          }}
        />
      )}

      {entry && deleting && (
        <Modal
          open
          size="sm"
          alert
          onClose={() => setDeleting(null)}
          icon={<Trash2 className="h-5 w-5" />}
          title={t("crud.deleteTitle", { name: String(deleting.values.name ?? "") })}
          description={t("crud.deleteText")}
          testId="crud-delete-dialog"
          footer={
            <>
              <button type="button" className={btn.secondary} onClick={() => setDeleting(null)}>
                {t("common.cancel")}
              </button>
              <button
                type="button"
                className={btn.danger}
                data-testid="crud-delete-confirm"
                onClick={() => {
                  save(removeItem(entry.col, deleting.id));
                  setDeleting(null);
                }}
              >
                {t("common.delete")}
              </button>
            </>
          }
        />
      )}

      {entry && settingsOpen && <SettingsDialog col={entry.col} taken={entries.filter((e) => e.key !== entry.key).map((e) => e.col.slug)} onCancel={() => setSettingsOpen(false)} onSave={(name, slug) => (save({ ...entry.col, name, slug }), setSettingsOpen(false))} />}
    </div>
  );
}

/* ------------------------------ form item --------------------------- */

const toText = (v: unknown) => (v === undefined || v === null ? "" : String(v));

function ItemForm({ col, item, onCancel, onSave }: { col: CollectionDef; item: CollectionItem | null; onCancel: () => void; onSave: (values: CollectionItem["values"], slug: string) => void }) {
  const { t } = useTranslation();
  const start = item?.values ?? emptyValues(col.fields);
  const [raw, setRaw] = useState<Record<string, string>>(() =>
    Object.fromEntries(col.fields.map((f) => [f.key, (f.type === "price" || f.type === "number") && !Number(start[f.key]) ? "" : f.type === "rating" && !item ? "" : toText(start[f.key])])),
  );
  const [errors, setErrors] = useState<FieldErrors>({});
  const set = (k: string, v: string) => setRaw((r) => ({ ...r, [k]: v }));
  /** Slug URL item: kosong = dibuat dari nama (item baru) / tetap (item lama). */
  const [slug, setSlug] = useState(item?.slug ?? "");

  const submit = () => {
    const res = validateValues(col.fields, raw);
    const se = slugError(col, slug, item?.id ?? null);
    const errs = se ? { ...res.errors, slug: se } : res.errors;
    setErrors(errs);
    if (Object.keys(errs).length === 0) onSave(res.values, slug.trim());
  };

  const field = (f: CollectionField) => {
    const id = `crud-f-${f.key}`;
    const err = errors[f.key];
    const common = { id, "aria-invalid": err ? true : undefined, "aria-describedby": err ? `${id}-err` : undefined, "data-testid": `crud-field-${f.key}` };
    let input;
    switch (f.type) {
      case "textarea":
        input = <textarea {...common} rows={3} maxLength={2000} className={INPUT} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} />;
        break;
      case "image":
        input = <ImageValueInput id={id} value={raw[f.key]} onChange={(v) => set(f.key, v)} />;
        break;
      case "price":
        input = (
          <div className="relative">
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400">Rp</span>
            <input {...common} inputMode="numeric" className={`${INPUT} pl-9`} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder={f.key === "compare_price" ? t("crud.optional") : "95000"} />
          </div>
        );
        break;
      case "rating":
        input = <input {...common} type="number" min={0} max={5} step={0.1} className={INPUT} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder="4.5" />;
        break;
      case "number":
        input = <input {...common} type="number" min={0} step={1} className={INPUT} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder="0" />;
        break;
      case "category":
        input = (
          <>
            <input {...common} className={INPUT} maxLength={CATEGORY_MAX} list={`${id}-list`} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder={t("crud.categoryHint")} />
            <datalist id={`${id}-list`}>
              {categoriesOf(col).map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </>
        );
        break;
      default:
        input = <input {...common} className={INPUT} maxLength={f.type === "label" ? 30 : 160} value={raw[f.key]} onChange={(e) => set(f.key, e.target.value)} placeholder={f.type === "label" ? t("crud.labelHint") : undefined} {...(f.key === "name" ? { "data-autofocus": true } : {})} />;
    }
    return (
      <div key={f.key} className={f.type === "textarea" || f.type === "image" ? "sm:col-span-2" : ""}>
        <label htmlFor={id} className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
          {t(`crud.field.${f.key}`, { defaultValue: f.label })}
          {f.required && <span className="text-rose-500"> *</span>}
        </label>
        {input}
        {err && (
          <p id={`${id}-err`} className="mt-1 text-xs text-rose-600" role="alert">
            {t(err)}
          </p>
        )}
      </div>
    );
  };

  return (
    <Modal
      open
      size="lg"
      onClose={onCancel}
      title={item ? t("crud.editTitle", { name: col.name.toLowerCase() }) : t("crud.addTitle", { name: col.name.toLowerCase() })}
      testId="crud-form"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button type="submit" form="crud-item-form" className={btn.primary} data-testid="crud-save">
            {t("crud.save")}
          </button>
        </>
      }
    >
      <form
        id="crud-item-form"
        noValidate
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        {col.fields.map(field)}
        <div className="sm:col-span-2">
          <label htmlFor="crud-f-slug" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t("crud.field.slug")}
          </label>
          <div className="flex items-center rounded-lg border border-gray-200 focus-within:border-brand-500 dark:border-gray-700">
            <span className="shrink-0 pl-3 text-sm text-gray-400">/{col.slug}/</span>
            <input
              id="crud-f-slug"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
              maxLength={80}
              value={slug}
              placeholder={itemSlugify(raw.name)}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
              aria-invalid={errors.slug ? true : undefined}
              data-testid="crud-field-slug"
            />
          </div>
          {errors.slug ? (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {t(errors.slug)}
            </p>
          ) : (
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t(item ? "crud.slugHintEdit" : "crud.slugHintNew")}</p>
          )}
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------ pengaturan -------------------------- */

function SettingsDialog({ col, taken, onCancel, onSave }: { col: CollectionDef; taken: string[]; onCancel: () => void; onSave: (name: string, slug: string) => void }) {
  const { t } = useTranslation();
  const [name, setName] = useState(col.name);
  const [slug, setSlug] = useState(col.slug);
  const [slugTouched, setSlugTouched] = useState(false);
  const clean = slug.trim();
  const error = !name.trim() ? "crud.err.required" : !isValidCollectionSlug(clean) ? "crud.err.slug" : taken.includes(clean) ? "crud.err.slugTaken" : null;
  return (
    <Modal
      open
      size="sm"
      onClose={onCancel}
      title={t("crud.settingsTitle")}
      description={t("crud.settingsText")}
      testId="crud-settings-dialog"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button type="button" className={btn.primary} disabled={!!error} onClick={() => onSave(name.trim(), clean)} data-testid="crud-settings-save">
            {t("crud.save")}
          </button>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label htmlFor="crud-name" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t("crud.nameLabel")}
          </label>
          <input
            id="crud-name"
            className={INPUT}
            maxLength={60}
            value={name}
            data-autofocus
            onChange={(e) => {
              setName(e.target.value);
              if (!slugTouched) setSlug(collectionSlug(e.target.value));
            }}
          />
        </div>
        <div>
          <label htmlFor="crud-slug" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t("crud.slugLabel")}
          </label>
          <input
            id="crud-slug"
            className={`${INPUT} font-mono`}
            maxLength={40}
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value.toLowerCase());
            }}
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("crud.slugHint", { slug: clean || "produk" })}</p>
          {error && (
            <p className="mt-1 text-xs text-rose-600" role="alert">
              {t(error)}
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
