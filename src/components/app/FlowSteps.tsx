import { useTranslation } from "react-i18next";
import { Check, ChevronRight, Home } from "lucide-react";
import { Link } from "./LocaleLink";
import { TEMPLATES_PATH, WEBSITE_HUB_PATH } from "../../config/menu";

/* ================================================================== */
/* Penunjuk alur Pembuat Website (v17): 1 Pilih awal → 2 Modifikasi →    */
/* 3 Deploy. Ditampilkan di Template, Editor, dan Susun & Deploy supaya  */
/* pengguna selalu tahu sedang di langkah mana dan ke mana berikutnya.   */
/* ================================================================== */

export type FlowStep = 1 | 2 | 3;

export interface FlowStepsProps {
  current: FlowStep;
  /** Tujuan tiap langkah (path tanpa prefix bahasa) atau aksi. Langkah 1 bawaan: katalog template. */
  to?: Partial<Record<FlowStep, string | (() => void)>>;
  className?: string;
}

export default function FlowSteps({ current, to = {}, className = "" }: FlowStepsProps) {
  const { t } = useTranslation();
  const targets: Partial<Record<FlowStep, string | (() => void)>> = { 1: TEMPLATES_PATH, ...to };
  const item = (n: FlowStep) => {
    const done = n < current;
    const active = n === current;
    const body = (
      <>
        <span
          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
            active ? "bg-brand-600 text-white" : done ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-600 dark:bg-white/10 dark:text-gray-300"
          }`}
        >
          {done ? <Check className="h-3 w-3" /> : n}
        </span>
        <span className="truncate">{t(`flow.step${n}`)}</span>
      </>
    );
    const cls = `inline-flex min-w-0 items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold ${
      active ? "bg-brand-50 text-brand-800 dark:bg-brand-500/15 dark:text-brand-200" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
    }`;
    const target = targets[n];
    if (active || !target) return <span className={cls} aria-current={active ? "step" : undefined}>{body}</span>;
    return typeof target === "string" ? (
      <Link to={target} className={cls}>
        {body}
      </Link>
    ) : (
      <button type="button" onClick={target} className={cls}>
        {body}
      </button>
    );
  };
  return (
    <nav aria-label={t("flow.aria")} data-testid="flow-steps" className={`flex flex-wrap items-center gap-1 rounded-xl border border-gray-200 bg-white px-2 py-1.5 dark:border-gray-800 dark:bg-gray-900/40 ${className}`}>
      <Link to={WEBSITE_HUB_PATH} className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5">
        <Home className="h-3.5 w-3.5" /> {t("flow.hub")}
      </Link>
      <span className="mx-0.5 h-4 w-px bg-gray-200 dark:bg-gray-700" aria-hidden />
      <ol className="flex min-w-0 flex-wrap items-center gap-0.5">
        {([1, 2, 3] as const).map((n) => (
          <li key={n} className="flex min-w-0 items-center gap-0.5">
            {item(n)}
            {n < 3 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300 dark:text-gray-600" aria-hidden />}
          </li>
        ))}
      </ol>
    </nav>
  );
}
