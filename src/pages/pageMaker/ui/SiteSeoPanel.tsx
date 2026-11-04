import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ChevronDown, Info, Search } from "lucide-react";
import { setPageSeo, setSiteSeo, type ResolvedSitePage, type SiteDoc } from "../helpers/site";
import { SEO_IDEAL, SEO_LIMITS, cleanUrl, resolveSeo, seoAudit, type SeoPageInput } from "../helpers/seo";

/* ================================================================== */
/* Panel SEO folder website (v10)                                        */
/*   - site SEO: public URL, default description & share image,          */
/*     izinkan mesin pencari                                            */
/*   - per-page SEO: title, description, image, hide                     */
/*   - Google result preview + a list of suggestions                     */
/* Every value is stored in the website folder and goes into the export. */
/* ================================================================== */

const CARD = "rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3";
const INPUT =
  "w-full rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90";

/** An input/textarea that saves on blur. */
function Field({
  label,
  value,
  onCommit,
  placeholder,
  max,
  ideal,
  multiline,
  type = "text",
  invalid,
  testId,
}: {
  label: string;
  value: string;
  onCommit: (v: string) => void;
  placeholder?: string;
  max: number;
  ideal?: number;
  multiline?: boolean;
  type?: "text" | "url";
  invalid?: (v: string) => boolean;
  testId?: string;
}) {
  const { t } = useTranslation();
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const bad = !!v.trim() && !!invalid?.(v);
  const over = ideal !== undefined && v.length > ideal;
  const props = {
    value: v,
    "aria-label": label,
    placeholder,
    maxLength: max,
    "data-testid": testId,
    onChange: (e: { target: { value: string } }) => setV(e.target.value),
    onBlur: () => v !== value && !bad && onCommit(v),
    className: `${INPUT} ${bad ? "border-rose-500" : ""}`,
  };
  return (
    <label className="flex min-w-0 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2 text-xs text-gray-500">
        <span>{label}</span>
        {ideal !== undefined && (
          <span className={`text-[10px] tabular-nums ${over ? "text-amber-600" : "text-gray-400"}`}>
            {v.length}/{ideal}
          </span>
        )}
      </span>
      {multiline ? <textarea rows={2} {...props} /> : <input type={type} {...props} />}
      {bad && <span className="text-[11px] text-rose-600">{t("website.seo.urlInvalid")}</span>}
    </label>
  );
}

const isBadUrl = (v: string) => !cleanUrl(v);

export default function SiteSeoPanel({
  siteName,
  doc,
  pages,
  onChange,
}: {
  siteName: string;
  doc: SiteDoc;
  pages: ResolvedSitePage[];
  onChange: (next: SiteDoc) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState<string | null>(null);
  const live = pages.filter((p) => p.design);
  const inputs: SeoPageInput[] = useMemo(
    () => live.map((p) => ({ title: p.title, slug: p.slug, isHome: p.isHome, file: p.isHome ? "index" : p.slug, seo: p.seo })),
    [live],
  );
  const issues = useMemo(() => seoAudit(siteName, doc.seo, inputs), [siteName, doc.seo, inputs]);
  const site = doc.seo ?? {};

  return (
    <section className={CARD} aria-labelledby="ws-seo" data-testid="site-seo">
      <h2 id="ws-seo" className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-gray-800 dark:text-white/90">
        <Search className="h-4 w-4 text-blue-700" /> {t("website.seo.title")}
      </h2>
      <p className="mb-3 text-[11px] text-gray-500 dark:text-gray-400">{t("website.seo.hint")}</p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field
          label={t("website.seo.siteUrl")}
          type="url"
          value={site.siteUrl ?? ""}
          placeholder="https://contoh.com"
          max={SEO_LIMITS.url}
          invalid={isBadUrl}
          testId="seo-site-url"
          onCommit={(v) => onChange(setSiteSeo(doc, { siteUrl: v }))}
        />
        <Field
          label={t("website.seo.ogImage")}
          type="url"
          value={site.ogImage ?? ""}
          placeholder="https://contoh.com/gambar-bagikan.jpg"
          max={SEO_LIMITS.url}
          invalid={isBadUrl}
          onCommit={(v) => onChange(setSiteSeo(doc, { ogImage: v }))}
        />
        <div className="sm:col-span-2">
          <Field
            label={t("website.seo.siteDescription")}
            multiline
            value={site.description ?? ""}
            placeholder={t("website.seo.descriptionPlaceholder")}
            max={SEO_LIMITS.description}
            ideal={SEO_IDEAL.description}
            onCommit={(v) => onChange(setSiteSeo(doc, { description: v }))}
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-700 sm:col-span-2 dark:text-gray-300">
          <input
            type="checkbox"
            checked={site.indexable !== false}
            data-testid="seo-indexable"
            onChange={(e) => onChange(setSiteSeo(doc, { indexable: e.target.checked ? undefined : false }))}
          />
          {t("website.seo.indexable")}
        </label>
      </div>

      {live.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2" data-testid="seo-pages">
          {live.map((p, i) => {
            const r = resolveSeo(siteName, doc.seo, inputs[i], "html");
            const expanded = open === p.designId;
            return (
              <li key={p.designId} className="rounded-lg border border-gray-200 dark:border-gray-800">
                <button
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : p.designId)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-gray-800 dark:text-white/90">{p.title}</span>
                    <span className="block truncate text-[11px] text-gray-400">{r.noindex ? t("website.seo.hidden") : r.description || t("website.seo.noDescriptionShort")}</span>
                  </span>
                  <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition ${expanded ? "rotate-180" : ""}`} />
                </button>
                {expanded && (
                  <div className="flex flex-col gap-3 border-t border-gray-200 px-3 py-3 dark:border-gray-800">
                    {/* Google search result preview */}
                    <div className="rounded-lg bg-gray-50 p-3 dark:bg-white/5" aria-label={t("website.seo.preview")} data-testid="seo-snippet">
                      <p className="truncate text-[11px] text-gray-500">{r.url || `${t("website.seo.yourDomain")}${r.path}`}</p>
                      <p className="truncate text-base text-[#1a0dab] dark:text-[#8ab4f8]">{r.title}</p>
                      <p className="line-clamp-2 text-xs text-gray-600 dark:text-gray-300">{r.description || t("website.seo.noDescriptionShort")}</p>
                    </div>
                    <Field
                      label={t("website.seo.pageTitle")}
                      value={p.seo?.title ?? ""}
                      placeholder={r.title}
                      max={SEO_LIMITS.title}
                      ideal={SEO_IDEAL.title}
                      onCommit={(v) => onChange(setPageSeo(doc, p.designId, { title: v }))}
                    />
                    <Field
                      label={t("website.seo.pageDescription")}
                      multiline
                      value={p.seo?.description ?? ""}
                      placeholder={site.description || t("website.seo.descriptionPlaceholder")}
                      max={SEO_LIMITS.description}
                      ideal={SEO_IDEAL.description}
                      onCommit={(v) => onChange(setPageSeo(doc, p.designId, { description: v }))}
                    />
                    <Field
                      label={t("website.seo.pageImage")}
                      type="url"
                      value={p.seo?.ogImage ?? ""}
                      placeholder={site.ogImage || "https://"}
                      max={SEO_LIMITS.url}
                      invalid={isBadUrl}
                      onCommit={(v) => onChange(setPageSeo(doc, p.designId, { ogImage: v }))}
                    />
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input type="checkbox" checked={!!p.seo?.noindex} onChange={(e) => onChange(setPageSeo(doc, p.designId, { noindex: e.target.checked }))} />
                      {t("website.seo.noindex")}
                    </label>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {issues.length > 0 && (
        <ul className="mt-3 flex flex-col gap-1 text-[11px]" data-testid="seo-issues">
          {issues.slice(0, 10).map((x, i) => (
            <li key={i} className={`flex gap-1.5 ${x.level === "warn" ? "text-amber-700 dark:text-amber-400" : "text-gray-500 dark:text-gray-400"}`}>
              {x.level === "warn" ? <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" /> : <Info className="mt-0.5 h-3 w-3 shrink-0" />}
              {t(`website.seo.issue.${x.code}`, { page: x.page, ideal: x.code === "longTitle" ? SEO_IDEAL.title : SEO_IDEAL.description, min: SEO_IDEAL.descriptionMin })}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
