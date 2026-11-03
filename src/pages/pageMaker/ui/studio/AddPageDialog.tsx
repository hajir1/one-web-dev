import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, FilePlus2, Info, LayoutList, Mail, Plus } from "lucide-react";
import Modal from "../../../../components/app/Modal";
import { INPUT, btn } from "../../../../components/app/ui";
import type { PagePatternId } from "../../helpers/studio";
import type { ResolvedSitePage } from "../../helpers/site";

/* Dialog "Tambah halaman" (v20): pilih pola atau salin halaman yang ada. */

export type NewPageChoice = { name: string; pattern: PagePatternId } | { name: string; copyFrom: string };

const PATTERNS: { id: PagePatternId; icon: typeof Plus }[] = [
  { id: "blank", icon: FilePlus2 },
  { id: "about", icon: Info },
  { id: "services", icon: LayoutList },
  { id: "contact", icon: Mail },
];

export default function AddPageDialog({ pages, hasChrome, onCancel, onCreate }: { pages: ResolvedSitePage[]; hasChrome: boolean; onCancel: () => void; onCreate: (c: NewPageChoice) => void }) {
  const { t } = useTranslation();
  const [choice, setChoice] = useState<PagePatternId | "copy">("blank");
  const [copyFrom, setCopyFrom] = useState(pages[0]?.designId ?? "");
  const [name, setName] = useState("");
  const fallback = choice === "copy" ? t("studio.copyName", { name: pages.find((p) => p.designId === copyFrom)?.title ?? "" }) : t(`studio.pattern.${choice}.default`);
  const submit = () => {
    const n = name.trim() || fallback;
    onCreate(choice === "copy" ? { name: n, copyFrom } : { name: n, pattern: choice });
  };
  const card = (id: PagePatternId | "copy", Icon: typeof Plus) => (
    <button
      key={id}
      type="button"
      role="radio"
      aria-checked={choice === id}
      onClick={() => setChoice(id)}
      className={`flex items-start gap-2.5 rounded-xl border-2 p-3 text-left transition ${
        choice === id ? "border-blue-700 bg-blue-50/60 dark:bg-blue-500/10" : "border-gray-200 hover:border-gray-300 dark:border-gray-800"
      }`}
      data-testid={`studio-pattern-${id}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${choice === id ? "text-blue-800 dark:text-blue-300" : "text-gray-400"}`} />
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-gray-800 dark:text-white/90">{t(`studio.pattern.${id}.name`)}</span>
        <span className="block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t(`studio.pattern.${id}.text`)}</span>
      </span>
    </button>
  );
  return (
    <Modal
      open
      size="lg"
      onClose={onCancel}
      icon={<Plus className="h-5 w-5" />}
      title={t("studio.addPageTitle")}
      description={hasChrome ? t("studio.addPageChrome") : t("studio.addPageText")}
      testId="studio-add-dialog"
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={onCancel}>
            {t("common.cancel")}
          </button>
          <button type="button" className={btn.primary} onClick={submit} data-testid="studio-add-confirm">
            <Plus className="h-4 w-4" /> {t("studio.addPageCta")}
          </button>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="studio-new-name" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
            {t("studio.pageName")}
          </label>
          <input id="studio-new-name" className={INPUT} value={name} maxLength={60} placeholder={fallback} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submit()} data-testid="studio-new-name" />
          <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">{t("studio.pageNameHint")}</p>
        </div>
        <div role="radiogroup" aria-label={t("studio.patternAria")} className="grid gap-2 sm:grid-cols-2">
          {PATTERNS.map((p) => card(p.id, p.icon))}
          {pages.length > 0 && card("copy", Copy)}
        </div>
        {choice === "copy" && (
          <select className={INPUT} value={copyFrom} onChange={(e) => setCopyFrom(e.target.value)} aria-label={t("studio.copyFrom")}>
            {pages.map((p) => (
              <option key={p.designId} value={p.designId}>
                {p.title}
              </option>
            ))}
          </select>
        )}
      </div>
    </Modal>
  );
}
