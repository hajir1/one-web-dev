import { useTranslation } from "react-i18next";
import { Blocks, Check, Crown, LayoutPanelTop, Library, Lock, Type } from "lucide-react";
import { LIBRARY_BY_ID } from "../../pages/pageMaker/engine/helpers/libraries";
import { useAccess } from "../hooks";
import type { CatalogSnapshot } from "../repository";
import type { PieceCatalogItem, TemplateCatalogItem } from "../types";

/**
 * Isi template: section & elemen yang dipakai, dengan status akses tiap item
 * Premium. Item bawaan hanya berlaku di desain dari template ini.
 */
export default function IncludedItems({ tpl, catalog, compact = false }: { tpl: TemplateCatalogItem; catalog: CatalogSnapshot; compact?: boolean }) {
  const { t } = useTranslation();
  const access = useAccess({ templateId: tpl.refId });
  const byId = new Map<string, PieceCatalogItem>([...catalog.sections, ...catalog.elements].map((i) => [i.id, i]));
  const premium = tpl.premiumItemIds.map((id) => byId.get(id)).filter((i): i is PieceCatalogItem => !!i);
  const free = [...tpl.sectionIds, ...tpl.elementIds]
    .map((id) => byId.get(id))
    .filter((i): i is PieceCatalogItem => !!i && i.tier === "free");
  const owned = access.ownsTemplate(tpl.refId);

  return (
    <div className="flex flex-col gap-3 text-sm" data-testid="template-included">
      {tpl.tier === "premium" && (
        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Crown className="h-3.5 w-3.5 text-amber-500" /> {t("market.included.premiumTitle", { count: premium.length })}
          </p>
          {premium.length === 0 ? (
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.included.nonePremium")}</p>
          ) : (
            <ul className="flex flex-wrap gap-1.5" data-testid="template-premium-items">
              {premium.map((i) => {
                const reason = access.reason(i.id, "premium");
                const Icon = i.kind === "section" ? LayoutPanelTop : Blocks;
                return (
                  <li
                    key={i.id}
                    data-access={reason}
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                      reason === "locked" ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200" : "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200"
                    }`}
                  >
                    <Icon className="h-3 w-3" /> {i.name}
                    {reason === "locked" ? <Lock className="h-3 w-3" aria-label={t("market.badge.locked")} /> : <Check className="h-3 w-3" aria-label={t(`market.badge.${reason}`)} />}
                  </li>
                );
              })}
            </ul>
          )}
          {!compact && premium.length > 0 && (
            <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{owned ? t("market.included.ownedScope") : t("market.included.scope")}</p>
          )}
        </div>
      )}
      {(tpl.libraries.length > 0 || (!compact && tpl.fonts.length > 0)) && (
        <div data-testid="template-libraries">
          <p className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Library className="h-3.5 w-3.5 text-blue-600" /> {t("market.included.librariesTitle")}
          </p>
          {tpl.libraries.length > 0 ? (
            <ul className="flex flex-wrap gap-1.5">
              {tpl.libraries.map((id) => (
                <li key={id} className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200" data-testid={`template-lib-${id}`}>
                  {LIBRARY_BY_ID[id].name} {LIBRARY_BY_ID[id].version}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.included.noLibraries")}</p>
          )}
          {!compact && tpl.fonts.length > 0 && (
            <p className="mt-1.5 flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300" data-testid="template-fonts">
              <Type className="h-3.5 w-3.5" /> {t("market.included.fonts", { list: tpl.fonts.join(", ") })}
            </p>
          )}
          {!compact && tpl.libraries.length > 0 && <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">{t("market.included.librariesHint")}</p>}
        </div>
      )}
      {!compact && (
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{t("market.included.freeTitle", { count: free.length })}</p>
          <ul className="flex flex-wrap gap-1.5">
            {free.map((i) => (
              <li key={i.id} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-white/10 dark:text-gray-300">
                {i.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
