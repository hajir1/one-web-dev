import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Cloud, HardDrive, SlidersHorizontal } from "lucide-react";
import { Link } from "../../../../components/app/LocaleLink";
import { INPUT } from "../../../../components/app/ui";
import { GLOBAL_SETTING_PATH } from "../../../../config/menu";
import SiteSeoPanel from "../SiteSeoPanel";
import type { ResolvedSitePage, SiteDoc } from "../../helpers/site";
import { useSaveTarget } from "./saveTarget";

/* Popup "Situs" (v20): nama website, tempat penyimpanan, SEO, gaya global. */

export default function SitePanel({
  siteName,
  doc,
  pages,
  onRename,
  onChange,
}: {
  siteName: string;
  doc: SiteDoc;
  pages: ResolvedSitePage[];
  onRename: (name: string) => void;
  onChange: (next: SiteDoc) => void;
}) {
  const { t } = useTranslation();
  const [name, setName] = useState(siteName);
  useEffect(() => setName(siteName), [siteName]);
  const target = useSaveTarget();
  return (
    <div className="flex flex-col gap-4" data-testid="studio-site-panel">
      <div>
        <label htmlFor="studio-site-name" className="mb-1 block text-xs font-semibold text-gray-600 dark:text-gray-300">
          {t("studio.siteName")}
        </label>
        <input
          id="studio-site-name"
          className={INPUT}
          value={name}
          maxLength={80}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name.trim() && name.trim() !== siteName && onRename(name.trim())}
          onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
        />
      </div>
      <p className="flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-white/5 dark:text-gray-300">
        {target === "account" ? <Cloud className="mt-0.5 h-4 w-4 shrink-0" /> : <HardDrive className="mt-0.5 h-4 w-4 shrink-0" />}
        <span>{t(target === "account" ? "studio.savedAccountLong" : target === "demo" ? "studio.savedDemoLong" : "studio.savedDeviceLong")}</span>
      </p>
      <Link to={GLOBAL_SETTING_PATH} className="flex items-start gap-2 rounded-xl border border-gray-200 p-3 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5">
        <SlidersHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-gray-800 dark:text-white/90">{t("studio.globalStyle")}</span>
          <span className="block text-xs text-gray-500 dark:text-gray-400">{t("studio.globalStyleText")}</span>
        </span>
      </Link>
      <SiteSeoPanel siteName={siteName} doc={doc} pages={pages} onChange={onChange} />
    </div>
  );
}
