import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Loader2, Plus, RotateCcw, Trash2, TriangleAlert } from "lucide-react";
import { useVarStore } from "../../pageMaker/core/store/varStore";
import { VarValueInput } from "./VariableManager";
import {
  FONT_FALLBACKS,
  FONT_WEIGHTS,
  SYSTEM_FONTS,
  fontLoader,
  fontStack,
  urlKind,
  type FontFallback,
  type FontSource,
  type GlobalFont,
} from "../../pageMaker/core/helpers/fontCss";
import { useFontStore } from "../../pageMaker/core/store/fontStore";
import { useLibraryFonts } from "../../pageMaker/core/hooks/useLibraryFonts";
import { useFontStatus } from "../../pageMaker/core/hooks/useFontStatus";
import {
  Field,
  Segmented,
  SelectInput,
  TextInput,
  type SelectOption,
} from "../../pageMaker/core/helpers/SmallUIHelpers";

const SAMPLE = "Pack my box with five dozen liquor jugs 0123456789";
const SUGGESTIONS = ["Inter", "Poppins", "Roboto", "Lora", "Playfair Display", "Fira Code"];
const BTN_PRIMARY =
  "inline-flex items-center gap-1.5 rounded bg-blue-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-90";

/* ------------------------------ font dasar -------------------------- */

function BaseFontCard() {
  const { t } = useTranslation();
  const fonts = useFontStore((s) => s.fonts);
  const baseFontId = useFontStore((s) => s.baseFontId);
  const setBaseFont = useFontStore((s) => s.setBaseFont);

  const options = useMemo(() => {
    const o: SelectOption<string>[] = [{ value: "", label: t("gs.font.browserDefault") }];
    fonts.forEach((f) => o.push({ value: f.id, label: f.name, group: t("gs.font.groupMine") }));
    SYSTEM_FONTS.forEach((s) =>
      o.push({ value: s.id, label: s.id === "sys-ui" ? t("gs.font.systemUi") : s.name, group: t("gs.font.groupSystem") }),
    );
    return o;
  }, [fonts, t]);

  const stack =
    SYSTEM_FONTS.find((s) => s.id === baseFontId)?.stack ??
    (() => {
      const f = fonts.find((x) => x.id === baseFontId);
      return f ? fontStack(f) : undefined;
    })();

  return (
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.font.baseTitle")}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("gs.font.baseText")}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,18rem)_minmax(0,1fr)] sm:items-center">
        <SelectInput
          value={baseFontId ?? ""}
          onChange={(v) => setBaseFont(v || null)}
          options={options}
        />
        <p className="truncate text-lg text-gray-700 dark:text-gray-200" style={{ fontFamily: stack }}>
          {t("gs.font.basePreview")}
        </p>
      </div>
    </section>
  );
}

/* ---------------- v7: font judul & isi (variabel global) ---------------- */

function GlobalFontsCard() {
  const { t } = useTranslation();
  const vars = useVarStore((s) => s.vars);
  const update = useVarStore((s) => s.update);
  const reset = useVarStore((s) => s.reset);
  return (
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800" data-testid="global-fonts">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.font.globalTitle")}</h3>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t("gs.font.globalText")}</p>
      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(["font-heading", "font-body"] as const).map((name) => {
          const v = vars.find((x) => x.name === name);
          if (!v) return null;
          return (
            <Field key={name} label={`${t(name === "font-heading" ? "pm.font.heading" : "pm.font.body")} · --${name}`}>
              <div className="flex items-start gap-1.5">
                <div className="min-w-0 flex-1">
                  <VarValueInput type="font" value={v.value} onChange={(val) => update(v.id, { value: val })} />
                </div>
                <button type="button" onClick={() => reset(v.id)} title={t("gs.vars.reset")} aria-label={t("gs.vars.reset")} className="rounded border border-gray-300 p-1.5 text-gray-500 hover:text-gray-800 dark:border-gray-700">
                  <RotateCcw size={13} />
                </button>
              </div>
            </Field>
          );
        })}
      </div>
    </section>
  );
}

/* --------------------------- form tambah font ----------------------- */

function AddFontForm() {
  const { t } = useTranslation();
  const addFont = useFontStore((s) => s.addFont);
  const [source, setSource] = useState<FontSource>("google");
  const [name, setName] = useState("");
  const [fallback, setFallback] = useState<FontFallback>("sans-serif");
  const [weights, setWeights] = useState<number[]>([400, 700]);
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const toggleWeight = (w: number) =>
    setWeights((cur) =>
      cur.includes(w) ? (cur.length > 1 ? cur.filter((x) => x !== w) : cur) : [...cur, w].sort((a, b) => a - b),
    );

  const submit = () => {
    const err = addFont({ name, source, fallback, weights, url });
    setError(err);
    if (!err) {
      setName("");
      setUrl("");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <h3 className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("gs.font.addTitle")}</h3>
      <div className="mt-3 flex flex-col gap-3">
        <Segmented
          value={source}
          onChange={(v) => {
            setSource(v);
            setError(null);
          }}
          options={[
            { value: "google", label: "Google Fonts" },
            { value: "url", label: t("gs.font.sourceUrl") },
          ]}
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field
            label={t("gs.font.nameLabel")}
            hint={source === "google" ? t("gs.font.nameHintGoogle") : t("gs.font.nameHintUrl")}
          >
            <TextInput
              value={name}
              onChange={setName}
              placeholder={source === "google" ? t("gs.font.namePlaceholderGoogle") : t("gs.font.namePlaceholderUrl")}
            />
          </Field>
          <Field label={t("gs.font.fallbackLabel")} hint={t("gs.font.fallbackHint")}>
            <SelectInput
              value={fallback}
              onChange={setFallback}
              options={FONT_FALLBACKS.map((f) => ({ value: f.value, label: f.label }))}
            />
          </Field>
        </div>

        {source === "google" ? (
          <>
            <div className="flex flex-wrap gap-1.5" aria-label={t("gs.font.suggestions")}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setName(s)}
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-blue-300 hover:text-blue-800 dark:border-gray-700 dark:text-gray-300"
                >
                  {s}
                </button>
              ))}
            </div>
            <Field label={t("gs.font.weightsLabel")}>
              <WeightChips weights={weights} onToggle={toggleWeight} />
            </Field>
          </>
        ) : (
          <Field
            label="URL"
            hint={t("gs.font.urlHint")}
          >
            <TextInput value={url} onChange={setUrl} placeholder={t("gs.font.urlPlaceholder")} />
          </Field>
        )}

        {error && (
          <p role="alert" className="text-sm text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}
        <div>
          <button type="button" onClick={submit} className={BTN_PRIMARY}>
            <Plus size={15} /> {t("gs.font.addButton")}
          </button>
        </div>
      </div>
    </section>
  );
}

function WeightChips({
  weights,
  onToggle,
}: {
  weights: number[];
  onToggle: (w: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FONT_WEIGHTS.map((w) => {
        const on = weights.includes(w);
        return (
          <button
            key={w}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(w)}
            className={`rounded border px-2 py-1 text-xs font-medium ${
              on
                ? "border-blue-800 bg-blue-800 text-white"
                : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            {w}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ daftar font ------------------------- */

function StatusPill({ font }: { font: GlobalFont }) {
  const { t } = useTranslation();
  const status = useFontStatus(font.name, fontLoader(font)?.css ?? "");
  if (status === "loading")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-gray-400">
        <Loader2 size={12} className="animate-spin" /> {t("gs.font.statusChecking")}
      </span>
    );
  if (status === "ready")
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
        <Check size={12} /> {t("gs.font.statusReady")}
      </span>
    );
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400"
      title={t("gs.font.statusFailedHint")}
    >
      <TriangleAlert size={12} /> {t("gs.font.statusFailed")}
    </span>
  );
}

function FontRow({ font }: { font: GlobalFont }) {
  const { t } = useTranslation();
  const updateFont = useFontStore((s) => s.updateFont);
  const removeFont = useFontStore((s) => s.removeFont);
  const isBase = useFontStore((s) => s.baseFontId === font.id);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleWeight = (w: number) => {
    const next = font.weights.includes(w)
      ? font.weights.filter((x) => x !== w)
      : [...font.weights, w].sort((a, b) => a - b);
    if (next.length) setError(updateFont(font.id, { weights: next }));
  };

  const sourceLabel =
    font.source === "google"
      ? "Google Fonts"
      : urlKind(font.url) === "file"
        ? t("gs.font.kindFile")
        : t("gs.font.kindStylesheet");

  return (
    <li className="min-w-0 rounded-xl border border-gray-200 p-4 dark:border-gray-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-semibold text-gray-800 dark:text-white/90">{font.name}</h4>
            <span className="rounded-full bg-gray-100 px-2 py-px text-[11px] text-gray-600 dark:bg-white/10 dark:text-gray-300">
              {sourceLabel}
            </span>
            {isBase && (
              <span className="rounded-full bg-blue-100 px-2 py-px text-[11px] font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                {t("gs.font.baseBadge")}
              </span>
            )}
          </div>
          <div className="mt-1">
            <StatusPill font={font} />
          </div>
        </div>

        {confirming ? (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 dark:text-gray-400">{t("gs.font.deleteConfirm")}</span>
            <button
              type="button"
              onClick={() => removeFont(font.id)}
              className="rounded bg-rose-600 px-2 py-1 font-semibold text-white"
            >
              {t("common.delete")}
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="px-2 py-1 text-gray-500">
              {t("common.cancel")}
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            aria-label={t("gs.font.deleteAria", { name: font.name })}
            title={t("gs.font.deleteTitle")}
            className="p-1 text-gray-400 hover:text-rose-600"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <p
        className="mt-3 truncate text-xl text-gray-800 dark:text-white/90"
        style={{ fontFamily: fontStack(font) }}
      >
        {SAMPLE}
      </p>

      {font.source === "google" ? (
        <div className="mt-3">
          <p className="mb-1.5 text-xs text-gray-500 dark:text-gray-400">{t("gs.font.weightsLoaded")}</p>
          <WeightChips weights={font.weights} onToggle={toggleWeight} />
        </div>
      ) : (
        <p className="mt-3 break-all text-xs text-gray-400">{font.url}</p>
      )}
      {error && <p className="mt-2 text-xs text-rose-600">{error}</p>}
    </li>
  );
}

export default function FontManager() {
  const { t } = useTranslation();
  useLibraryFonts();
  const fonts = useFontStore((s) => s.fonts);

  return (
    <div className="flex flex-col gap-5">
      <BaseFontCard />
      <GlobalFontsCard />
      <AddFontForm />
      {fonts.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {fonts.map((f) => (
            <FontRow key={f.id} font={f} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
          {t("gs.font.empty")}
        </p>
      )}
    </div>
  );
}
