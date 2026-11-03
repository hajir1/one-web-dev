import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pencil, Plus, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import Modal from "../../../components/app/Modal";
import {
  BUILTIN_VARS,
  DEFAULT_VALUE,
  VAR_TYPES,
  countRefs,
  detachRefs,
  isValidVarValue,
  normalizeVarName,
  renameRefs,
  validateVarName,
  type CssVar,
  type VarError,
  type VarType,
} from "../../pageMaker/core/helpers/cssVars";
import { SYSTEM_FONTS, fontStack } from "../../pageMaker/core/helpers/fontCss";
import { useVarStore } from "../../pageMaker/core/store/varStore";
import { useFontStore } from "../../pageMaker/core/store/fontStore";
import { useDesignStore, type SavedDesign } from "../../pageMaker/core/store/designStore";
import { useLibraryFonts } from "../../pageMaker/core/hooks/useLibraryFonts";
import { ColorInput, Field, SelectInput, TextInput, type SelectOption } from "../../pageMaker/core/helpers/SmallUIHelpers";

/* ================================================================== */
/* Tab "Variabel" Pengaturan Global (v7).                               */
/* Variabel menjadi CSS custom property di :root (--nama: nilai).       */
/* Ganti nama → semua referensi var(--lama) di desain ikut diperbarui.  */
/* Hapus → referensi diganti nilai terakhirnya (tampilan tidak berubah). */
/* ================================================================== */

const BTN = "inline-flex items-center gap-1.5 rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50";
const BTN_GHOST = "inline-flex items-center gap-1.5 rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-white/5";

/** Pemakaian sebuah variabel di semua desain tersimpan. */
function varUsage(designs: Record<string, SavedDesign[]>, name: string): { refs: number; designs: number } {
  let refs = 0;
  let count = 0;
  for (const list of Object.values(designs))
    for (const d of list) {
      const n = countRefs(d.state, name);
      if (n) {
        refs += n;
        count++;
      }
    }
  return { refs, designs: count };
}

/** Terapkan `fn` ke setiap desain; hanya desain yang berubah yang disimpan (ikut tersinkron). */
function rewriteDesigns(fn: (state: unknown) => { value: unknown; changed: boolean }) {
  const store = useDesignStore.getState();
  for (const [type, list] of Object.entries(store.designs))
    for (const d of list) {
      const r = fn(d.state);
      if (r.changed) store.updateDesign(type, d.id, r.value);
    }
}

/* --------------------------- input nilai --------------------------- */

function useFontOptions(): SelectOption<string>[] {
  const fonts = useFontStore((s) => s.fonts);
  const { t } = useTranslation();
  return useMemo(
    () => [
      ...fonts.map((f) => ({ value: fontStack(f), label: f.name, group: t("gs.font.groupMine") })),
      ...SYSTEM_FONTS.map((s) => ({ value: s.stack, label: s.name, group: t("gs.font.groupSystem") })),
    ],
    [fonts, t],
  );
}

/** Input nilai sesuai tipe: color picker, angka + satuan, pilihan font, atau teks. */
export function VarValueInput({ type, value, onChange }: { type: VarType; value: string; onChange: (v: string) => void }) {
  const fontOptions = useFontOptions();
  if (type === "color") return <ColorInput value={value} onChange={onChange} />;
  if (type === "size") {
    const m = /^(-?\d*(?:\.\d+)?)(px|rem|em|%|vw|vh)?$/.exec(value.trim());
    const num = m?.[1] ?? "";
    const unit = m?.[2] ?? "px";
    return (
      <div className="flex gap-1.5">
        <input
          type="number"
          step="any"
          value={num}
          onChange={(e) => onChange(`${e.target.value}${unit}`)}
          className="w-full min-w-0 rounded border border-gray-300 bg-white px-2 py-1.5 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          aria-label="nilai"
        />
        <div className="w-24 shrink-0">
          <SelectInput value={unit} onChange={(u) => onChange(`${num || 0}${u}`)} options={["px", "rem", "em", "%", "vw", "vh"].map((u) => ({ value: u, label: u }))} />
        </div>
      </div>
    );
  }
  if (type === "font") {
    const opts = fontOptions.some((o) => o.value === value) ? fontOptions : [{ value, label: value.split(",")[0].replace(/["']/g, "") }, ...fontOptions];
    return (
      <div className="flex flex-col gap-1">
        <SelectInput value={value} onChange={onChange} options={opts} />
        <span className="truncate text-sm text-gray-600 dark:text-gray-300" style={{ fontFamily: value }}>
          Aa Bb Cc 123
        </span>
      </div>
    );
  }
  return <TextInput value={value} onChange={onChange} placeholder='"Teks" atau nilai CSS' />;
}

/* ---------------------------- tambah ---------------------------- */

function AddVarForm() {
  const { t } = useTranslation();
  const vars = useVarStore((s) => s.vars);
  const add = useVarStore((s) => s.add);
  const [name, setName] = useState("");
  const [type, setType] = useState<VarType>("color");
  const [value, setValue] = useState(DEFAULT_VALUE.color);
  const [error, setError] = useState<VarError | null>(null);

  const nameErr = name ? validateVarName(name, vars) : null;
  const valueErr = !isValidVarValue(type, value);

  const submit = () => {
    const err = add({ name, type, value });
    setError(err);
    if (!err) {
      setName("");
      setValue(DEFAULT_VALUE[type]);
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.vars.addTitle")}</h3>
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1.3fr)_auto] md:items-start">
        <Field label={t("gs.vars.name")} hint={name ? `CSS: --${normalizeVarName(name)}` : t("gs.vars.nameHint")}>
          <TextInput value={name} onChange={(v) => setName(v.slice(0, 42))} placeholder="mis. warna-aksen" />
        </Field>
        <Field label={t("gs.vars.type")}>
          <SelectInput
            value={type}
            onChange={(v) => {
              setType(v);
              setValue(DEFAULT_VALUE[v]);
            }}
            options={VAR_TYPES.map((v) => ({ value: v, label: t(`gs.vars.types.${v}`) }))}
          />
        </Field>
        <Field label={t("gs.vars.value")}>
          <VarValueInput type={type} value={value} onChange={setValue} />
        </Field>
        <div className="md:pt-5">
          <button type="button" className={BTN} disabled={!name || !!nameErr || valueErr} onClick={submit} data-testid="add-var">
            <Plus size={15} /> {t("gs.vars.add")}
          </button>
        </div>
      </div>
      {(nameErr || error || (value && valueErr)) && (
        <p role="alert" className="mt-2 text-xs text-red-600">
          {t(`gs.vars.errors.${nameErr ?? error ?? "valueInvalid"}`)}
        </p>
      )}
    </section>
  );
}

/* ----------------------------- baris ----------------------------- */

type Pending = { kind: "rename"; v: CssVar; to: string } | { kind: "delete"; v: CssVar };

function VarRow({ v, onAsk }: { v: CssVar; onAsk: (p: Pending) => void }) {
  const { t } = useTranslation();
  const update = useVarStore((s) => s.update);
  const reset = useVarStore((s) => s.reset);
  const all = useVarStore((s) => s.vars);
  const designs = useDesignStore((s) => s.designs);
  const usage = useMemo(() => varUsage(designs, v.name), [designs, v.name]);
  const [draft, setDraft] = useState(v.value);
  const [renaming, setRenaming] = useState<string | null>(null);
  const valid = isValidVarValue(v.type, draft);
  const def = BUILTIN_VARS.find((b) => b.id === v.id);

  const commit = (val: string) => {
    setDraft(val);
    if (isValidVarValue(v.type, val)) update(v.id, { value: val });
  };
  const renameErr = renaming !== null ? validateVarName(renaming, all, v.id) : null;

  return (
    <li className="grid grid-cols-1 gap-3 rounded-xl border border-gray-200 p-3 dark:border-gray-800 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-center" data-testid={`var-${v.name}`}>
      <div className="min-w-0">
        {renaming === null ? (
          <p className="truncate font-mono text-sm font-semibold text-gray-800 dark:text-white/90">--{v.name}</p>
        ) : (
          <div className="flex items-center gap-1.5">
            <TextInput value={renaming} onChange={(x) => setRenaming(x.slice(0, 42))} />
            <button
              type="button"
              className={BTN}
              disabled={!!renameErr || normalizeVarName(renaming) === v.name}
              onClick={() => {
                const to = normalizeVarName(renaming);
                setRenaming(null);
                if (usage.refs) onAsk({ kind: "rename", v, to });
                else update(v.id, { name: to });
              }}
            >
              OK
            </button>
          </div>
        )}
        {renameErr && renaming !== null && <p className="mt-1 text-xs text-red-600">{t(`gs.vars.errors.${renameErr}`)}</p>}
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className={`rounded-full px-2 py-px font-medium ${v.builtin ? "bg-gray-100 text-gray-700 dark:bg-white/10 dark:text-gray-300" : "bg-blue-50 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300"}`}>
            {v.builtin ? t("gs.vars.builtin") : t("gs.vars.mine")}
          </span>
          <span className="rounded-full bg-gray-50 px-2 py-px text-gray-600 dark:bg-white/5 dark:text-gray-400">{t(`gs.vars.types.${v.type}`)}</span>
          <span className="text-gray-500 dark:text-gray-400">{usage.refs ? t("gs.vars.usedIn", { refs: usage.refs, designs: usage.designs }) : t("gs.vars.unused")}</span>
        </div>
      </div>
      <div>
        <VarValueInput type={v.type} value={draft} onChange={commit} />
        {!valid && <p className="mt-1 text-xs text-red-600">{t("gs.vars.errors.valueInvalid")}</p>}
      </div>
      <div className="flex items-center gap-1.5 md:justify-end">
        {v.builtin ? (
          <button
            type="button"
            className={BTN_GHOST}
            disabled={def?.value === v.value}
            title={t("gs.vars.reset")}
            onClick={() => {
              reset(v.id);
              setDraft(def?.value ?? v.value);
            }}
          >
            <RotateCcw size={14} /> {t("gs.vars.reset")}
          </button>
        ) : (
          <>
            <button type="button" className={BTN_GHOST} onClick={() => setRenaming(renaming === null ? v.name : null)} aria-label={t("gs.vars.rename")} title={t("gs.vars.rename")}>
              <Pencil size={14} />
            </button>
            <button type="button" className={BTN_GHOST} onClick={() => onAsk({ kind: "delete", v })} aria-label={t("gs.vars.delete")} title={t("gs.vars.delete")}>
              <Trash2 size={14} className="text-red-600" />
            </button>
          </>
        )}
      </div>
    </li>
  );
}

/* ----------------------------- panel ----------------------------- */

export default function VariableManager() {
  const { t } = useTranslation();
  useLibraryFonts();
  const vars = useVarStore((s) => s.vars);
  const update = useVarStore((s) => s.update);
  const remove = useVarStore((s) => s.remove);
  const designs = useDesignStore((s) => s.designs);
  const [pending, setPending] = useState<Pending | null>(null);
  const usage = pending ? varUsage(designs, pending.v.name) : { refs: 0, designs: 0 };

  const confirm = () => {
    if (!pending) return;
    if (pending.kind === "rename") {
      const err = update(pending.v.id, { name: pending.to });
      if (!err) rewriteDesigns((st) => renameRefs(st, pending.v.name, pending.to));
    } else {
      if (usage.refs) rewriteDesigns((st) => detachRefs(st, pending.v));
      remove(pending.v.id);
    }
    setPending(null);
  };

  const builtin = vars.filter((v) => v.builtin);
  const mine = vars.filter((v) => !v.builtin);

  return (
    <div className="flex flex-col gap-5">
      <AddVarForm />
      <p className="rounded-lg bg-gray-50 px-3 py-2 font-mono text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
        :root {"{"} {vars.slice(0, 3).map((v) => `--${v.name}: ${v.value};`).join(" ")} … {"}"}
      </p>
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.vars.mineTitle", { count: mine.length })}</h3>
        {mine.length ? (
          <ul className="flex flex-col gap-2">{mine.map((v) => <VarRow key={v.id} v={v} onAsk={setPending} />)}</ul>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">{t("gs.vars.empty")}</p>
        )}
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.vars.builtinTitle")}</h3>
        <ul className="flex flex-col gap-2">{builtin.map((v) => <VarRow key={v.id} v={v} onAsk={setPending} />)}</ul>
      </section>

      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        alert
        icon={<TriangleAlert className="h-5 w-5 text-amber-600" />}
        title={pending?.kind === "rename" ? t("gs.vars.renameTitle", { from: pending.v.name, to: pending.to }) : t("gs.vars.deleteTitle", { name: pending?.v.name ?? "" })}
        description={
          pending?.kind === "rename"
            ? t("gs.vars.renameImpact", { refs: usage.refs, designs: usage.designs, to: pending.to })
            : usage.refs
              ? t("gs.vars.deleteImpact", { refs: usage.refs, designs: usage.designs, value: pending?.v.value ?? "" })
              : t("gs.vars.deleteUnused")
        }
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" className={BTN_GHOST} onClick={() => setPending(null)}>
              {t("gs.vars.cancel")}
            </button>
            <button type="button" className={pending?.kind === "delete" ? BTN.replace("bg-blue-800", "bg-red-600") : BTN} onClick={confirm} data-testid="confirm-var">
              {pending?.kind === "rename" ? t("gs.vars.confirmRename") : t("gs.vars.confirmDelete")}
            </button>
          </div>
        }
      />
    </div>
  );
}

