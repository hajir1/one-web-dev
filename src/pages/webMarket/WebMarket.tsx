import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { BadgeCheck, Blocks, Coins, Crown, FolderPlus, History, Layers, LayoutPanelTop, Loader2, Lock, LogIn, PackagePlus, Search, Store, Wallet } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import EmptyState from "../../components/app/EmptyState";
import { Link } from "../../components/app/LocaleLink";
import { Chip, INPUT, Notice, Panel, Segmented, btn } from "../../components/app/ui";
import { notify } from "../../components/app/Toaster";
import { CREDITS_PATH, TEMPLATES_PATH } from "../../config/menu";
import { DESIGN_PACKAGES, MAX_DESIGNS_PER_PURCHASE, MAX_SITES_PER_PURCHASE, SITE_PACKAGES } from "../../config/marketplace";
import { FREE_SITES, MAX_DESIGNS } from "../../config/quota";
import { useDesignStore } from "../pageMaker/core/store/designStore";
import { PAGE_DESIGN_TYPE, SITE_TYPE } from "../pageMaker/helpers/site";
import { useAccess, useCatalog, useMarketAccount, useMarketStatus, useMaxDesigns, useSiteLimit, limitText } from "../../marketplace/hooks";
import { betterDeal, betterSiteDeal, normalizeDesignCount, normalizeSiteCount, quoteDesigns, quoteSites, smallestPack } from "../../marketplace/pricing";
import { commerceService } from "../../marketplace/services";
import type { PieceCatalogItem } from "../../marketplace/types";

/* ================================================================== */
/* Web Market: paket desain & website, saldo kredit, hak akses, dan toko */
/* section/elemen Premium. Semua transaksi lewat backend (commerceService */
/* → /marketplace/*); saldo & hak akses hanya dari respons server.       */
/* ================================================================== */

const NONE: unknown[] = [];

function Wallet_() {
  const { t } = useTranslation();
  const account = useMarketAccount();
  const status = useMarketStatus();
  return (
    <div className="min-w-[240px] rounded-2xl border border-gray-200 bg-white/80 p-4 dark:border-gray-700 dark:bg-gray-900/60" data-testid="market-wallet">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <Wallet className="h-3.5 w-3.5" /> {t("market.balance")}
      </p>
      <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white" data-testid="market-balance">
        {status === "loading" || status === "idle" ? <Loader2 className="h-6 w-6 animate-spin text-gray-400" /> : t("market.credits", { count: account.balance })}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {status === "anonymous" ? (
          <Link to={`/signin?next=${encodeURIComponent(window.location.pathname)}`} className={`${btn.primary} !px-3 !py-1.5 text-xs`} data-testid="market-signin">
            <LogIn className="h-3.5 w-3.5" /> {t("auth.signIn")}
          </Link>
        ) : (
          <Link to={CREDITS_PATH} className={`${btn.secondary} !px-3 !py-1.5 text-xs`} data-testid="market-buy-credits">
            <Coins className="h-3.5 w-3.5" /> {t("market.buyCredits")}
          </Link>
        )}
      </div>
    </div>
  );
}

function DesignPacks() {
  const { t } = useTranslation();
  const account = useMarketAccount();
  const max = useMaxDesigns();
  const used = (useDesignStore((s) => s.designs[PAGE_DESIGN_TYPE]) ?? NONE).length;
  const step = smallestPack().designs;
  const [amount, setAmount] = useState(String(step));
  const [busy, setBusy] = useState(false);
  const wanted = normalizeDesignCount(Number(amount));
  const quote = useMemo(() => quoteDesigns(wanted), [wanted]);
  const deal = useMemo(() => betterDeal(wanted), [wanted]);

  const buy = async (designs: number) => {
    if (busy) return;
    setBusy(true);
    const r = await commerceService.purchaseDesigns(designs);
    setBusy(false);
    if (r.ok) notify.success(t("market.toast.designsAdded", { count: r.quote?.designs ?? designs }));
    else notify.error(t(`market.errors.${r.error}`));
  };

  return (
    <Panel
      title={t("market.packs.title")}
      description={t("market.packs.description", { base: MAX_DESIGNS })}
      actions={
        <Chip tone={used >= max ? "amber" : "blue"}>
          <span data-testid="design-quota">{t("market.packs.quota", { used, max: limitText(max) })}</span>
        </Chip>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        {DESIGN_PACKAGES.map((p) => (
          <div
            key={p.id}
            className={`flex flex-col gap-3 rounded-2xl border p-4 ${p.highlight ? "border-brand-300 bg-brand-50/50 dark:border-brand-500/40 dark:bg-brand-500/10" : "border-gray-200 dark:border-gray-800"}`}
            data-testid={`pack-${p.id}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{t("market.packs.designs", { count: p.designs })}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.packs.perDesign", { value: (p.credits / p.designs).toFixed(2) })}</p>
              </div>
              {p.highlight && <Chip tone="green">{t("market.packs.save", { count: quoteDesigns(p.designs).listCredits - p.credits })}</Chip>}
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{t("market.credits", { count: p.credits })}</p>
            <button type="button" onClick={() => buy(p.designs)} disabled={busy || account.balance < p.credits} className={p.highlight ? btn.primary : btn.secondary} data-testid={`buy-${p.id}`}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <PackagePlus className="h-4 w-4" />} {t("market.packs.buy")}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-200">{t("market.packs.customLabel", { step, max: MAX_DESIGNS_PER_PURCHASE })}</span>
          <input type="number" min={step} max={MAX_DESIGNS_PER_PURCHASE} step={step} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${INPUT} max-w-40`} data-testid="pack-amount" />
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="pack-quote">
          {t("market.packs.quote", { designs: quote.designs, credits: quote.credits })}{" "}
          <span className="text-gray-400">({quote.lines.map((l) => t("market.packs.line", { count: l.count, designs: l.designs })).join(" + ")})</span>
        </p>
        {wanted !== Number(amount) && <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.packs.rounded", { designs: wanted, step })}</p>}
        {deal && <Notice tone="info">{t("market.packs.betterDeal", { designs: deal.designs, credits: deal.credits })}</Notice>}
        <div>
          <button type="button" onClick={() => buy(quote.designs)} disabled={busy || account.balance < quote.credits} className={btn.primary} data-testid="pack-buy-custom">
            <PackagePlus className="h-4 w-4" /> {t("market.packs.buyCustom", { designs: quote.designs, credits: quote.credits })}
          </button>
        </div>
      </div>
    </Panel>
  );
}

/** Paket folder website: makin banyak makin murah per website. */
function SitePacks() {
  const { t } = useTranslation();
  const account = useMarketAccount();
  const limit = useSiteLimit();
  const used = (useDesignStore((s) => s.designs[SITE_TYPE]) ?? NONE).length;
  const [amount, setAmount] = useState("1");
  const [busy, setBusy] = useState(false);
  const wanted = normalizeSiteCount(Number(amount));
  const quote = useMemo(() => quoteSites(wanted), [wanted]);
  const deal = useMemo(() => betterSiteDeal(wanted), [wanted]);
  const unit = SITE_PACKAGES.reduce((a, b) => (b.sites < a.sites ? b : a));

  const buy = async (sites: number) => {
    if (busy) return;
    setBusy(true);
    const r = await commerceService.purchaseSites(sites);
    setBusy(false);
    if (r.ok) notify.success(t("market.toast.sitesAdded", { count: r.quote?.sites ?? sites }));
    else notify.error(t(`market.errors.${r.error}`));
  };

  return (
    <Panel
      title={t("market.sites.title")}
      description={t("market.sites.description", { base: FREE_SITES, unit: unit.credits })}
      actions={
        <Chip tone={used >= limit ? "amber" : "blue"}>
          <span data-testid="site-quota">{t("market.sites.quota", { used, max: limitText(limit) })}</span>
        </Chip>
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5" data-testid="site-packs">
        {SITE_PACKAGES.map((p) => {
          const save = p.sites * unit.credits - p.credits;
          return (
            <div
              key={p.id}
              className={`flex flex-col gap-2 rounded-2xl border p-4 ${p.highlight ? "border-brand-300 bg-brand-50/50 dark:border-brand-500/40 dark:bg-brand-500/10" : "border-gray-200 dark:border-gray-800"}`}
              data-testid={`pack-${p.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-base font-semibold text-gray-900 dark:text-white">{t("market.sites.sites", { count: p.sites })}</p>
                {save > 0 && <Chip tone="green">{t("market.sites.save", { percent: Math.round((save / (p.sites * unit.credits)) * 100) })}</Chip>}
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{t("market.credits", { count: p.credits })}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.sites.perSite", { value: (p.credits / p.sites).toFixed(2) })}</p>
              <button type="button" onClick={() => buy(p.sites)} disabled={busy || account.balance < p.credits} className={`${p.highlight ? btn.primary : btn.secondary} mt-auto`} data-testid={`buy-${p.id}`}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <FolderPlus className="h-4 w-4" />} {t("market.packs.buy")}
              </button>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-gray-700 dark:text-gray-200">{t("market.sites.customLabel", { max: MAX_SITES_PER_PURCHASE })}</span>
          <input type="number" min={1} max={MAX_SITES_PER_PURCHASE} step={1} inputMode="numeric" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${INPUT} max-w-40`} data-testid="site-amount" />
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-300" data-testid="site-quote">
          {t("market.sites.quote", { count: quote.sites, credits: quote.credits })}{" "}
          <span className="text-gray-400">({quote.lines.map((l) => t("market.sites.line", { count: l.count, sites: l.sites })).join(" + ")})</span>
          {quote.listCredits > quote.credits && <span className="ml-1 font-semibold text-emerald-700 dark:text-emerald-400">{t("market.sites.saved", { count: quote.listCredits - quote.credits })}</span>}
        </p>
        {wanted !== Number(amount) && <p className="text-xs text-gray-500 dark:text-gray-400">{t("market.sites.rounded", { count: wanted })}</p>}
        {deal && <Notice tone="info">{t("market.sites.betterDeal", { count: deal.sites, credits: deal.credits })}</Notice>}
        <div>
          <button type="button" onClick={() => buy(quote.sites)} disabled={busy || account.balance < quote.credits} className={btn.primary} data-testid="site-buy-custom">
            <FolderPlus className="h-4 w-4" /> {t("market.sites.buyCustom", { count: quote.sites, credits: quote.credits })}
          </button>
        </div>
      </div>
    </Panel>
  );
}

function Entitlements() {
  const { t } = useTranslation();
  const account = useMarketAccount();
  const { data } = useCatalog();
  const nameOf = (id: string) => [...(data?.templates ?? []), ...(data?.sections ?? []), ...(data?.elements ?? [])].find((i) => i.id === id || i.refId === id)?.name ?? id;
  const e = account.entitlements;
  const owned = new Set(e.templates.map((x) => x.templateId));
  const grants = e.templateGrants.filter((g) => owned.has(g.templateId));

  return (
    <Panel title={t("market.access.title")} description={t("market.access.description")}>
      <div className="grid gap-4 lg:grid-cols-3" data-testid="entitlements">
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Crown className="h-3.5 w-3.5 text-amber-500" /> {t("market.access.templates", { count: e.templates.length })}
          </h3>
          {e.templates.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("market.access.noneTemplates")}</p>
          ) : (
            <ul className="space-y-1 text-sm" data-testid="owned-templates">
              {e.templates.map((x) => (
                <li key={x.templateId} className="flex justify-between gap-2">
                  <Link to={`${TEMPLATES_PATH}/${x.templateId}`} className="truncate font-medium text-brand-700 hover:underline dark:text-brand-300">
                    {nameOf(`template:${x.templateId}`)}
                  </Link>
                  <span className="shrink-0 text-xs text-gray-500">{t("market.credits", { count: x.pricePaid })}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <Layers className="h-3.5 w-3.5 text-indigo-500" /> {t("market.access.included", { count: grants.reduce<number>((n, g) => n + g.itemIds.length, 0) })}
          </h3>
          {grants.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("market.access.noneIncluded")}</p>
          ) : (
            <ul className="space-y-2 text-sm" data-testid="template-grants">
              {grants.map((g) => (
                <li key={g.templateId}>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{nameOf(`template:${g.templateId}`)}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{g.itemIds.length ? g.itemIds.map(nameOf).join(", ") : t("market.included.nonePremium")}</p>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t("market.included.scope")}</p>
        </section>
        <section>
          <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" /> {t("market.access.items", { count: e.items.length })}
          </h3>
          {e.items.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("market.access.noneItems")}</p>
          ) : (
            <ul className="space-y-1 text-sm" data-testid="owned-items">
              {e.items.map((x) => (
                <li key={x.itemId} className="flex justify-between gap-2">
                  <span className="truncate text-gray-800 dark:text-gray-100">{nameOf(x.itemId)}</span>
                  <span className="shrink-0 text-xs text-gray-500">{t("market.credits", { count: x.pricePaid })}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{t("market.access.itemsScope")}</p>
        </section>
      </div>
    </Panel>
  );
}

function PieceShop() {
  const { t } = useTranslation();
  const { status, data, error, reload } = useCatalog();
  const access = useAccess();
  const balance = useMarketAccount().balance;
  const [kind, setKind] = useState<"section" | "element">("section");
  const [tier, setTier] = useState<"all" | "free" | "premium">("premium");
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const list = useMemo(() => {
    const src: PieceCatalogItem[] = kind === "section" ? (data?.sections ?? []) : (data?.elements ?? []);
    const q = query.trim().toLowerCase();
    return src.filter((i) => (tier === "all" || i.tier === tier) && (!q || `${i.name} ${i.description} ${i.category}`.toLowerCase().includes(q)));
  }, [data, kind, tier, query]);

  const buy = async (item: PieceCatalogItem) => {
    if (busy) return;
    setBusy(item.id);
    const r = await commerceService.purchaseItem(item);
    setBusy(null);
    if (r.ok) notify.success(t("market.toast.itemUnlocked", { item: item.name }));
    else notify.error(t(`market.errors.${r.error}`));
  };

  return (
    <Panel title={t("market.shop.title")} description={t("market.shop.description")}>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Segmented label={t("market.shop.kind")} value={kind} onChange={setKind} options={[{ value: "section", label: t("market.shop.sections") }, { value: "element", label: t("market.shop.elements") }]} />
        <Segmented
          label={t("templates.tierFilter")}
          value={tier}
          onChange={setTier}
          options={[
            { value: "all", label: t("common.all") },
            { value: "free", label: t("common.free") },
            { value: "premium", label: t("common.premium") },
          ]}
        />
        <label className="relative min-w-48 flex-1">
          <span className="sr-only">{t("market.shop.search")}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("market.shop.search")} className={`${INPUT} pl-9`} />
        </label>
        <span className="text-sm text-gray-500 dark:text-gray-400" role="status">
          {status === "ready" ? t("market.shop.count", { count: list.length }) : ""}
        </span>
      </div>
      {status === "loading" && <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
      {status === "error" && (
        <Notice tone="error" title={t("templates.loadError")}>
          {error}{" "}
          <button type="button" onClick={reload} className="font-semibold underline">
            {t("templates.retry")}
          </button>
        </Notice>
      )}
      {status === "ready" && list.length === 0 && <EmptyState icon={Search} title={t("templates.emptyTitle")} />}
      {status === "ready" && list.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3" data-testid="piece-shop">
          {list.map((i) => {
            const reason = access.reason(i.id, i.tier);
            const Icon = i.kind === "section" ? LayoutPanelTop : Blocks;
            return (
              <li key={i.id} className="flex flex-col gap-2 rounded-xl border border-gray-200 p-3 dark:border-gray-800" data-testid={`piece-${i.id}`} data-access={reason}>
                <div className="flex items-start gap-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {i.name} {i.isNew && <span className="ml-1 rounded bg-blue-50 px-1 py-0.5 text-[10px] font-semibold uppercase text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{t("market.badge.new")}</span>}
                    </p>
                    <p className="line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{i.description || t(`market.categories.${i.category}`, { defaultValue: i.category })}</p>
                  </div>
                  <span className="shrink-0 text-sm font-bold text-gray-900 dark:text-white">{t("market.credits", { count: i.price })}</span>
                </div>
                <div className="mt-auto flex items-center justify-between gap-2">
                  {reason === "free" ? (
                    <Chip tone="green">{t("common.free")}</Chip>
                  ) : reason === "owned" ? (
                    <Chip tone="green">
                      <BadgeCheck className="h-3 w-3" /> {t("market.badge.owned")}
                    </Chip>
                  ) : (
                    <Chip tone="amber">
                      <Lock className="h-3 w-3" /> {t("market.badge.locked")}
                    </Chip>
                  )}
                  {reason === "locked" && (
                    <button type="button" onClick={() => buy(i)} disabled={!!busy || balance < i.price} className={`${btn.primary} !px-3 !py-1.5 text-xs`} data-testid={`buy-${i.id}`}>
                      {busy === i.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Coins className="h-3.5 w-3.5" />} {t("market.shop.buy", { count: i.price })}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

function Transactions() {
  const { t, i18n } = useTranslation();
  const tx = useMarketAccount().transactions;
  const { data } = useCatalog();
  const nameOf = (id?: string) => (id ? ([...(data?.templates ?? []), ...(data?.sections ?? []), ...(data?.elements ?? [])].find((i) => i.id === id)?.name ?? id) : "");
  const fmt = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium", timeStyle: "short" });
  return (
    <Panel title={t("market.tx.title")} description={t("market.tx.description")}>
      {tx.length === 0 ? (
        <EmptyState icon={History} title={t("market.tx.empty")} />
      ) : (
        <ul className="divide-y divide-gray-100 text-sm dark:divide-gray-800" data-testid="sim-transactions">
          {tx.slice(0, 20).map((x) => (
            <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <span className="min-w-0 flex-1 truncate text-gray-800 dark:text-gray-100">
                {x.kind === "usage" || x.kind === "adjustment"
                  ? (x.description ?? t(`market.tx.kind.${x.kind}`))
                  : t(`market.tx.kind.${x.kind}`, { item: nameOf(x.itemId), count: x.designs ?? x.sites ?? 0 })}
              </span>
              <span className="text-xs text-gray-500">{fmt.format(x.at)}</span>
              <span className={`w-20 text-right font-semibold ${x.credits < 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                {x.credits > 0 ? "+" : ""}
                {x.credits}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

export default function WebMarket() {
  const { t } = useTranslation();
  const status = useMarketStatus();
  return (
    <>
      <AppMeta title={t("market.metaTitle")} description={t("market.description")} />
      <div className="flex flex-col gap-5" data-testid="web-market">
        <PageHeader
          icon={Store}
          title={t("market.title")}
          description={t("market.description")}
          crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("market.title") }]}
          help="templates"
          actions={<Wallet_ />}
        />
        {status === "anonymous" && (
          <Notice tone="info" testId="market-signin-notice">
            {t("market.signInNotice")}
          </Notice>
        )}
        {status === "error" && (
          <Notice tone="error" testId="market-error">
            {t("market.loadError")}
          </Notice>
        )}
        <DesignPacks />
        <SitePacks />
        <Entitlements />
        <PieceShop />
        <Transactions />
      </div>
    </>
  );
}
