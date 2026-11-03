import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "../../../../components/app/LocaleLink";
import { Check, ChevronDown, RotateCcw, Settings } from "lucide-react";
import { SYSTEM_FONTS } from "../helpers/fontCss";
import { refName, varRef, isVarRef } from "../helpers/cssVars";
import { useLibraryFonts } from "../hooks/useLibraryFonts";
import { useGlobalVars } from "../hooks/useGlobalVars";

const FONT_MANAGE_HREF = "/global-setting?tab=font";

interface FontSelectProps {
  /** String CSS `font-family` di elemen: "" = ikuti pengaturan global, `var(--x)` = referensi variabel font. */
  value: string;
  onChange: (stack: string) => void;
}

interface Opt {
  value: string;
  label: string;
  /** Stack untuk pratinjau nama font memakai font aslinya. */
  stack?: string;
  group: string;
  hint?: string;
}

/**
 * Pemilih font panel Styling (v7). Pilihan:
 *  - "Ikuti pengaturan global" (bawaan, nilai kosong → mewarisi font halaman/judul global);
 *  - variabel font dari Pengaturan Global (font judul, font isi, font pustaka, variabel font
 *    buatan pengguna) — disimpan sebagai REFERENSI `var(--x)`, jadi ikut berubah otomatis;
 *  - font sistem (nilai tetap).
 * Setiap nama ditampilkan dengan font aslinya.
 */
export default function FontSelect({ value, onChange }: FontSelectProps) {
  const { t } = useTranslation();
  useLibraryFonts();
  const vars = useGlobalVars();
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const options = useMemo(() => {
    const out: Opt[] = [{ value: "", label: t("pm.font.followGlobal"), group: "" }];
    const fontVars = vars.filter((v) => v.type === "font");
    const special: Record<string, string> = { "font-heading": t("pm.font.heading"), "font-body": t("pm.font.body") };
    for (const v of fontVars)
      out.push({
        value: varRef(v.name),
        label: special[v.name] ?? v.value.split(",")[0].replace(/["']/g, "").trim(),
        stack: v.value,
        group: t("pm.font.globalGroup"),
        hint: `--${v.name}`,
      });
    SYSTEM_FONTS.forEach((s) => out.push({ value: s.stack, label: s.name, stack: s.stack, group: t("pm.font.system") }));
    if (value && !out.some((o) => o.value === value)) {
      const name = isVarRef(value) ? `--${refName(value)}` : value.split(",")[0].replace(/["']/g, "");
      out.push({ value, label: t("pm.font.outside", { name }), stack: isVarRef(value) ? undefined : value, group: t("pm.font.other") });
    }
    return out;
  }, [vars, value, t]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const current = options.find((o) => o.value === value) ?? options[0];
  const groups = [...new Set(options.map((o) => o.group))];

  return (
    <div className="flex flex-col gap-1.5" ref={box}>
      <div className="flex items-center gap-1.5">
        <div className="relative min-w-0 flex-1">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={open}
            data-testid="font-select"
            className="flex w-full items-center gap-2 rounded border border-gray-300 bg-white px-2.5 py-1.5 text-left text-sm text-gray-800 outline-none focus:border-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          >
            <span className="min-w-0 flex-1 truncate" style={current.stack ? { fontFamily: current.stack } : undefined}>
              {current.label}
            </span>
            <ChevronDown size={14} className="shrink-0 text-gray-400" />
          </button>
          {open && (
            <div role="listbox" className="absolute left-0 right-0 z-50 mt-1 max-h-72 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {groups.map((g) => (
                <div key={g || "default"}>
                  {g && <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">{g}</p>}
                  {options
                    .filter((o) => o.group === g)
                    .map((o) => (
                      <button
                        key={o.value || "inherit"}
                        type="button"
                        role="option"
                        aria-selected={o.value === value}
                        onClick={() => {
                          onChange(o.value);
                          setOpen(false);
                        }}
                        className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left hover:bg-gray-100 dark:hover:bg-white/10"
                      >
                        <span className="min-w-0 flex-1 truncate text-sm text-gray-800 dark:text-gray-100" style={o.stack ? { fontFamily: o.stack } : undefined}>
                          {o.label}
                        </span>
                        {o.hint && <span className="shrink-0 font-mono text-[10px] text-gray-400">{o.hint}</span>}
                        {o.value === value && <Check size={13} className="shrink-0 text-blue-700" />}
                      </button>
                    ))}
                </div>
              ))}
            </div>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            title={t("pm.font.reset")}
            aria-label={t("pm.font.reset")}
            className="inline-flex flex-shrink-0 items-center justify-center rounded border border-gray-300 p-1.5 text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white/90"
          >
            <RotateCcw size={13} />
          </button>
        )}
        <Link
          to={FONT_MANAGE_HREF}
          title={t("pm.font.manage")}
          aria-label={t("pm.font.manage")}
          className="inline-flex flex-shrink-0 items-center justify-center rounded border border-gray-300 p-1.5 text-gray-500 hover:text-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white/90"
        >
          <Settings size={13} />
        </Link>
      </div>
      {value && (
        <p className="truncate text-sm text-gray-600 dark:text-gray-300" style={{ fontFamily: current.stack ?? value }}>
          {t("pm.font.sample")}
        </p>
      )}
    </div>
  );
}
