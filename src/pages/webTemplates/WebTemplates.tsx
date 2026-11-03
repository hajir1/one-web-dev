import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { AlertTriangle, ArrowLeft, Code2, Crown, Download, Eye, FolderOpen, LayoutTemplate, Library as LibraryIcon, Loader2, Lock, Monitor, PencilRuler, RotateCcw, Search, SearchX, Smartphone, Sparkles, Tablet } from "lucide-react";

import AppMeta from "../../components/app/AppMeta";
import PageHeader from "../../components/app/PageHeader";
import Modal from "../../components/app/Modal";
import { Link, Navigate, useLang, useLocaleNavigate } from "../../components/app/LocaleLink";
import { Chip, INPUT, Notice, Panel, Segmented, btn } from "../../components/app/ui";
import EmptyState from "../../components/app/EmptyState";
import { notify } from "../../components/app/Toaster";
import { TEMPLATES_PATH, codeEditorPath, studioPath } from "../../config/menu";
import FlowSteps from "../../components/app/FlowSteps";
import { TEMPLATE_CATEGORIES } from "../../config/templates";
import CreditDialog from "../../credits/CreditDialog";
import { ApiError } from "../../api/client";
import { useSession } from "../../auth/session";
import { useAccess, useCatalog, useMaxDesigns, useSiteLimit, limitText } from "../../marketplace/hooks";
import { promoPrice } from "../../marketplace/promo";
import { PromoBanner, PromoPriceTag } from "../../marketplace/ui/Promo";
import { templateQueryFromSearch, templateSearchFromQuery, type TemplateQuery, type TemplateSort } from "../../marketplace/catalogQuery";
import { flattenTemplatePages, seedTemplateDetail, TEMPLATES_PER_LOAD, useTemplateDetail, useTemplatesInfinite, type TemplatesListParams } from "../../api/queries";
import { QueryError, SkeletonCards } from "../../components/app/QueryState";
import type { CatalogSnapshot } from "../../marketplace/repository";
import type { TemplateCatalogItem } from "../../marketplace/types";
import IncludedItems from "../../marketplace/ui/IncludedItems";
import { LIBRARY_BY_ID } from "../pageMaker/engine/helpers/libraries";
import TemplatePurchaseDialog from "../../marketplace/ui/TemplatePurchaseDialog";
import { useDesignStore, type SavedDesign } from "../pageMaker/core/store/designStore";
import { useIconLookup } from "../pageMaker/core/hooks/useElementOutput";
import { PAGE_DESIGN_TYPE, SITE_TYPE } from "../pageMaker/helpers/site";
import { ensureDesignRoom } from "../pageMaker/helpers/designQuota";
import DesignLimitDialog from "../pageMaker/ui/DesignLimitDialog";
import SiteLimitDialog from "../pageMaker/ui/SiteLimitDialog";
import { ensureSiteRoom } from "../pageMaker/helpers/siteQuota";
import { triggerDownload } from "../Data/shared/downloadUtils";
import CodeTemplateFrame from "./codeTemplates/CodeTemplateFrame";
import { CODE_SITE_TYPE, codeSitesFrom, createCodeSiteDoc } from "./codeTemplates/codeSite";
import { EXPORT_FORMATS } from "../pageMaker/helpers/projectExport";
import { FRAMEWORK_LABELS, type Framework } from "../pageMaker/core/helpers/generatorCss";
import { acquireTemplate, demoPageUrl, type TemplateRef } from "./templateContent";
import type { TplLang } from "./types";
import { createSiteFromTemplate, homeDesignOf, sitesFromTemplate } from "./createFromTemplate";
import { isDemoMode } from "../../demo/demoMode";
import DemoTemplateFrame from "../../demo/DemoTemplateFrame";
import { staticThumbUrl } from "./staticThumb";

/* ================================================================== */
/* Web Templates — katalog, pratinjau, unduh, dan "Edit di Page Maker"  */
/*                                                                    */
/* - Metadata template dari server (GET /templates lewat repository).     */
/* - Pratinjau & thumbnail = halaman demo HTML statis hasil render       */
/*   server (iframe sandbox), bukan isi JSON template.                  */
/* - Template gratis: langsung dipakai. Premium: dibeli dengan kredit    */
/*   (POST /templates/:id/purchase), lalu isinya diambil lewat acquire.  */
/* - Edit = salinan baru (folder + desain). Template asli tidak berubah.*/
/*   Kuota desain & folder website diperiksa sebelum menyimpan.         */
/* ================================================================== */

const NONE: SavedDesign[] = [];

type Tpl = TemplateCatalogItem;
const refOf = (tpl: Tpl): TemplateRef => ({ id: tpl.refId, version: tpl.version ?? 1 });
const toTplLang = (lng: string | undefined): TplLang => (lng?.startsWith("en") ? "en" : "id");
const VIEWPORTS = [
  { id: "desktop", width: null, icon: Monitor },
  { id: "tablet", width: 768, icon: Tablet },
  { id: "mobile", width: 390, icon: Smartphone },
] as const;

/* ------------------------------ aksi ------------------------------- */

/** `needCatalog` = katalog lengkap (item bawaan) dimuat sekarang; di daftar
 *  berhalaman katalog baru dimuat saat dialog beli dibuka. */
function useTemplateActions(needCatalog = false) {
  const { t, i18n } = useTranslation();
  const lang = toTplLang(i18n.language);
  const navigate = useLocaleNavigate();
  const access = useAccess();
  const icons = useIconLookup();
  const signedIn = useSession((s) => s.status === "authenticated");
  const [busy, setBusy] = useState<string | null>(null);
  const busyRef = useRef(false);
  const [dupe, setDupe] = useState<{ tpl: Tpl; sites: SavedDesign[] } | null>(null);
  const [buying, setBuying] = useState<{ item: Tpl; then: () => void } | null>(null);
  const catalog = useCatalog(needCatalog || !!buying);

  const hasAccess = useCallback((tpl: Tpl) => tpl.tier === "free" || access.ownsTemplate(tpl.refId), [access]);
  const name = useCallback((tpl: Tpl) => tpl.name, []);
  const itemOf = useCallback((tpl: Tpl) => tpl, []);

  /** Login dulu: isi template & pembelian butuh akun. Mode demo (v12): tanpa akun. */
  const requireSignIn = () => {
    if (signedIn || isDemoMode()) return true;
    notify.info(t("auth.signInToContinue"));
    navigate(`/signin?next=${encodeURIComponent(window.location.pathname + window.location.search)}`);
    return false;
  };

  /** Jalankan `run` bila punya akses; Premium yang belum dimiliki → dialog pembelian (server). */
  const withAccess = (tpl: Tpl, run: () => void) => {
    if (!requireSignIn()) return;
    if (hasAccess(tpl)) return run();
    setBuying({ item: tpl, then: run });
  };

  /** Ambil isi template dari server (402 → tawarkan beli). */
  const content = async (tpl: Tpl) => {
    try {
      return await acquireTemplate(refOf(tpl), lang);
    } catch (e) {
      if (e instanceof ApiError && e.status === 402) setBuying({ item: tpl, then: () => undefined });
      else notify.error(e instanceof Error ? e.message : t("errors.unknown"));
      return null;
    }
  };

  const once = async (key: string, fn: () => Promise<void> | void) => {
    if (busyRef.current) return; // cegah klik ganda (unduh/buat salinan dua kali)
    busyRef.current = true;
    setBusy(key);
    try {
      await fn();
    } finally {
      busyRef.current = false;
      setBusy(null);
    }
  };

  /** Pilihan format unduhan (v7): dialog dibuka setelah akses dipastikan. */
  const [formatFor, setFormatFor] = useState<Tpl | null>(null);
  const download = (tpl: Tpl) => withAccess(tpl, () => (tpl.code ? void downloadCode(tpl) : setFormatFor(tpl)));

  /** v16: Template Kode diunduh apa adanya (index.html + README), tanpa pilihan framework. */
  const downloadCode = (tpl: Tpl) =>
    once(`download:${tpl.refId}`, async () => {
      try {
        // Pembuat ZIP (jszip + data preset) dimuat saat tombol Unduh ditekan, bukan saat galeri dibuka.
        const { buildCodeTemplateZip } = await import("./codeTemplates/download");
        const zip = await buildCodeTemplateZip(tpl.refId, tpl.name, lang);
        triggerDownload(zip.blob, zip.fileName);
        notify.success(t("templates.downloadStarted", { file: zip.fileName }));
      } catch (e) {
        notify.error(t("templates.downloadFailed", { detail: e instanceof Error ? e.message : String(e) }));
      }
    });

  const downloadAs = (tpl: Tpl, fw: Framework) =>
    once(`download:${tpl.refId}`, async () => {
      const pages = await content(tpl);
      if (!pages) return;
      try {
        // Template dimiliki/gratis → elemen Premium bawaannya ikut diekspor.
        const { buildTemplateZip } = await import("./exportTemplate");
        const zip = await buildTemplateZip(refOf(tpl), lang, tpl.name, pages, { icons, allowPremiumElements: true }, fw);
        triggerDownload(zip.blob, zip.fileName);
        notify.success(t("templates.downloadStarted", { file: zip.fileName }));
      } catch (e) {
        notify.error(t("templates.downloadFailed", { detail: e instanceof Error ? e.message : String(e) }));
      }
    });

  const formatDialog = formatFor && (
    <Modal
      open
      onClose={() => setFormatFor(null)}
      size="sm"
      testId="template-format"
      icon={<Download className="h-5 w-5" />}
      title={t("templates.format.title", { name: name(formatFor) })}
      description={t("templates.format.text")}
    >
      <ul className="grid gap-2 sm:grid-cols-2">
        {EXPORT_FORMATS.map((fw) => (
          <li key={fw}>
            <button
              type="button"
              data-testid={`template-format-${fw}`}
              onClick={() => {
                const tpl = formatFor;
                setFormatFor(null);
                void downloadAs(tpl, fw);
              }}
              className="flex w-full flex-col items-start gap-0.5 rounded-lg border border-gray-200 px-3 py-2.5 text-left hover:border-brand-500 hover:bg-brand-50 dark:border-gray-700 dark:hover:bg-white/5"
            >
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">{FRAMEWORK_LABELS[fw]}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t(`templates.format.hint.${fw}`)}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );

  /** Buat salinan baru (kuota diperiksa). */
  const createCopy = (tpl: Tpl, slotConfirmed = false) => {
    const pages = tpl.pages.length;
    if (!ensureDesignRoom(pages, "template", { label: name(tpl), onRoom: () => createCopy(tpl, slotConfirmed) })) return;
    // Kuota website penuh → pilih bayar slot atau hapus website lama. Slot dibuka
    // SERVER → lanjut tanpa cek ulang (batas di klien bisa belum diperbarui).
    if (!slotConfirmed && !ensureSiteRoom({ reason: "template", label: name(tpl), onRoom: (paid) => createCopy(tpl, !!paid) })) return;
    void once(`edit:${tpl.refId}`, async () => {
      const built = await content(tpl);
      if (!built) return;
      const created = createSiteFromTemplate(refOf(tpl), built, tpl.name);
      notify.success(t("templates.created", { name: tpl.name, count: built.length }));
      navigate(studioPath(created.siteId, created.homeDesignId));
    });
  };

  const edit = (tpl: Tpl) => {
    if (!requireSignIn()) return;
    const existing = sitesFromTemplate(tpl.refId);
    // Sudah ada salinan → tawarkan buka salinan lama dulu (tanpa beli/kuota).
    if (existing.length && hasAccess(tpl)) return setDupe({ tpl, sites: existing });
    // Kuota website dicek SEBELUM membeli template, supaya pengguna tidak
    // membayar lalu tertahan karena folder website penuh.
    if (!ensureSiteRoom({ reason: "template", label: name(tpl), onRoom: (paid) => withAccess(tpl, () => createCopy(tpl, !!paid)) })) return;
    withAccess(tpl, () => {
      const copies = sitesFromTemplate(tpl.refId);
      if (copies.length) setDupe({ tpl, sites: copies });
      else createCopy(tpl);
    });
  };

  /** v17: Template Kode → proyek baru di editor tanpa kode (salinan lama ditawarkan dulu). */
  const [codeDupe, setCodeDupe] = useState<{ tpl: Tpl; list: SavedDesign[] } | null>(null);
  const createCodeProject = (tpl: Tpl) => {
    const store = useDesignStore.getState();
    const n = codeSitesFrom(tpl.refId, store.designs[CODE_SITE_TYPE] ?? []).length;
    const id = store.saveDesign(CODE_SITE_TYPE, n ? `${tpl.name} (${n + 1})` : tpl.name, createCodeSiteDoc(tpl.refId));
    notify.success(t("templates.code.created", { name: tpl.name }));
    navigate(codeEditorPath(id));
  };
  const editCode = (tpl: Tpl) =>
    withAccess(tpl, () => {
      const list = codeSitesFrom(tpl.refId, useDesignStore.getState().designs[CODE_SITE_TYPE] ?? []);
      if (list.length) setCodeDupe({ tpl, list });
      else createCodeProject(tpl);
    });
  const codeDupeDialog = codeDupe && (
    <Modal
      open
      onClose={() => setCodeDupe(null)}
      size="sm"
      testId="code-dupe"
      icon={<FolderOpen className="h-5 w-5" />}
      title={t("templates.dupe.title")}
      description={t("templates.code.dupeText", { count: codeDupe.list.length, name: name(codeDupe.tpl) })}
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={() => setCodeDupe(null)}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className={btn.primary}
            data-testid="code-dupe-new"
            onClick={() => {
              const tpl = codeDupe.tpl;
              setCodeDupe(null);
              createCodeProject(tpl);
            }}
          >
            {t("templates.code.createNew")}
          </button>
        </>
      }
    >
      <ul className="space-y-1.5">
        {codeDupe.list.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                setCodeDupe(null);
                navigate(codeEditorPath(s.id));
              }}
              className={`${btn.ghost} w-full justify-between !px-3 text-sm`}
              data-testid="code-dupe-open"
            >
              <span className="truncate font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
              <span className="text-xs text-brand-700 dark:text-brand-300">{t("templates.dupe.open")}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );

  const openExisting = (site: SavedDesign) => {
    const home = homeDesignOf(site);
    setDupe(null);
    navigate(studioPath(site.id, home ?? undefined));
  };

  const dupeDialog = dupe && (
    <Modal
      open
      onClose={() => setDupe(null)}
      size="sm"
      testId="template-dupe"
      icon={<FolderOpen className="h-5 w-5" />}
      title={t("templates.dupe.title")}
      description={t("templates.dupe.text", { count: dupe.sites.length, name: name(dupe.tpl) })}
      footer={
        <>
          <button type="button" className={btn.secondary} onClick={() => setDupe(null)}>
            {t("common.cancel")}
          </button>
          <button
            type="button"
            className={btn.primary}
            data-testid="template-dupe-new"
            onClick={() => {
              const tpl = dupe.tpl;
              setDupe(null);
              createCopy(tpl);
            }}
          >
            {t("templates.dupe.createNew", { count: dupe.tpl.pages.length })}
          </button>
        </>
      }
    >
      <ul className="space-y-1.5">
        {dupe.sites.map((s) => (
          <li key={s.id}>
            <button type="button" onClick={() => openExisting(s)} className={`${btn.ghost} w-full justify-between !px-3 text-sm`} data-testid="template-dupe-open">
              <span className="truncate font-medium text-gray-800 dark:text-gray-100">{s.name}</span>
              <span className="text-xs text-brand-700 dark:text-brand-300">{t("templates.dupe.open")}</span>
            </button>
          </li>
        ))}
      </ul>
    </Modal>
  );

  const purchaseDialog =
    buying &&
    (catalog.data ? (
      <TemplatePurchaseDialog tpl={buying.item} catalog={catalog.data} onClose={() => setBuying(null)} onPurchased={buying.then} />
    ) : (
      <Modal open onClose={() => setBuying(null)} size="sm" testId="template-purchase-loading" icon={<Crown className="h-5 w-5" />} title={buying.item.name}>
        {catalog.status === "error" ? (
          <QueryError error={catalog.error} onRetry={catalog.reload} compact />
        ) : (
          <div className="flex justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          </div>
        )}
      </Modal>
    ));

  return { lang, busy, hasAccess, name, download, edit, editCode, codeDupeDialog, dupeDialog, purchaseDialog, formatDialog, catalog, itemOf, buy: (tpl: Tpl) => withAccess(tpl, () => undefined) };
}

/* ------------------------------ UI --------------------------------- */

function TierChip({ tpl, owned }: { tpl: Tpl; owned: boolean }) {
  const { t } = useTranslation();
  // Mode demo (v15): tanpa label harga/tingkat sama sekali.
  if (isDemoMode()) return null;
  if (tpl.tier === "free") return <Chip tone="green">{t("common.free")}</Chip>;
  return (
    <Chip tone="amber">
      {owned ? <Crown className="h-3 w-3" /> : <Lock className="h-3 w-3" />} {owned ? t("templates.owned") : t("templates.premiumCost", { cost: promoPrice(tpl.price).price })}
    </Chip>
  );
}

/** v16: penanda Template Kode (satu berkas HTML mandiri). */
function CodeChip() {
  const { t } = useTranslation();
  return (
    <Chip tone="blue">
      <Code2 className="h-3 w-3" /> {t("templates.code.chip")}
    </Chip>
  );
}

/** Harga katalog: Free = 0 kredit, Premium = harga promo (harga awal dicoret selama promo). */
function PriceTag({ tpl }: { tpl: Tpl }) {
  if (isDemoMode()) return null;
  return (
    <span className="ml-auto text-right">
      <PromoPriceTag price={tpl.price} testId={`price-${tpl.refId}`} />
    </span>
  );
}

/**
 * Thumbnail kartu. v21: gambar statis (thumbnail server, lalu WebP dari
 * npm run gen:thumbs). Hanya template tanpa gambar yang masih memakai
 * halaman demo beranda di iframe sandbox, diperkecil mengikuti lebar kartu
 * dan dimuat saat kartu mendekati layar.
 */
function Thumb({ tpl }: { tpl: Tpl }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.3);
  // Tanpa IntersectionObserver (browser lama/tes) → langsung render.
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / 1280 || 0.3);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  useEffect(() => {
    const el = box.current;
    if (!el || visible) return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && setVisible(true), { rootMargin: "300px" });
    io.observe(el);
    return () => io.disconnect();
  }, [visible]);
  const src = demoPageUrl(tpl.demoUrl);
  const { i18n } = useTranslation();
  const demo = isDemoMode();
  const still = tpl.thumbnailUrl ?? staticThumbUrl(tpl.refId, i18n.language);
  if (still)
    return (
      <div ref={box} className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800" aria-hidden="true" style={{ backgroundColor: `${tpl.accent}14` }}>
        <img src={still} alt="" loading="lazy" decoding="async" width={640} height={416} className="h-full w-full object-cover object-top" data-testid={`thumb-img-${tpl.refId}`} />
      </div>
    );
  return (
    <div ref={box} className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800" aria-hidden="true" style={{ backgroundColor: `${tpl.accent}14` }}>
      {visible && demo ? (
        // Mode demo (v12): beranda dirender di browser.
        <div className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: 1280, height: Math.ceil(208 / scale) + 4, transform: `scale(${scale})` }}>
          <DemoTemplateFrame templateId={tpl.refId} lang={i18n.language} thumb title="" className="block w-[1280px] border-0 bg-white" style={{ height: Math.ceil(208 / scale) + 4 }} />
        </div>
      ) : visible && src ? (
        <div className="pointer-events-none absolute left-0 top-0 origin-top-left" style={{ width: 1280, transform: `scale(${scale})` }}>
          <iframe src={src} title="" tabIndex={-1} loading="lazy" sandbox="allow-scripts" referrerPolicy="no-referrer" className="block w-[1280px] border-0 bg-white" style={{ height: Math.ceil(208 / scale) + 4 }} />
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}


/** Filter katalog terakhir sebelum membuka detail (tombol Kembali memulihkan filter + posisi gulir). */
const LAST_SEARCH_KEY = "tpl-last-search";
function lastCatalogSearch(): string {
  try {
    const s = sessionStorage.getItem(LAST_SEARCH_KEY);
    return s ? `?${s}` : "";
  } catch {
    return "";
  }
}

const SORTS: TemplateSort[] = ["featured", "price-asc", "price-desc", "category", "name"];
type CatalogState = TemplateQuery & { page: number };

/**
 * Daftar template dengan infinite scroll (v7): 12 per muatan (paginasi
 * server), muatan berikutnya otomatis saat mendekati bawah (IntersectionObserver)
 * dengan tombol cadangan "Muat lebih banyak". Filter disimpan di URL
 * (?q&category&tier&sort) agar bisa dibagikan; ganti filter = daftar mulai
 * dari awal. Posisi gulir dipulihkan saat kembali dari halaman detail.
 */
function Catalog() {
  const { t, i18n } = useTranslation();
  const lang = toTplLang(i18n.language);
  const a = useTemplateActions();
  const [search, setSearch] = useSearchParams();
  const q = useMemo(() => templateQueryFromSearch(search, TEMPLATE_CATEGORIES), [search]);
  const designs = useDesignStore((s) => s.designs[PAGE_DESIGN_TYPE]) ?? NONE;
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? NONE;
  const siteLimit = useSiteLimit();
  const maxDesigns = useMaxDesigns();
  const catLabel = useCallback((c: string) => t(`templates.categories.${c}`), [t]);
  const listTop = useRef<HTMLDivElement>(null);

  /** Ubah filter/halaman di URL. Filter berubah → kembali ke halaman 1 (riwayat diganti, bukan ditambah). */
  const update = useCallback(
    (patch: Partial<CatalogState>) =>
      setSearch(
        (prev) => {
          const cur = templateQueryFromSearch(prev, TEMPLATE_CATEGORIES);
          return templateSearchFromQuery({ ...cur, ...patch, page: 1 });
        },
        { replace: true },
      ),
    [setSearch],
  );

  // Kotak cari: ketik bebas, URL diperbarui setelah jeda (bukan setiap huruf).
  const [text, setText] = useState(q.text);
  const pushed = useRef(q.text);
  useEffect(() => {
    // URL berubah dari luar (Kembali/Reset) → isi kotak mengikuti.
    if (q.text !== pushed.current) setText(q.text);
    pushed.current = q.text;
  }, [q.text]);
  useEffect(() => {
    if (text.trim() === q.text.trim()) return;
    const id = setTimeout(() => {
      pushed.current = text.trim();
      update({ text });
    }, 300);
    return () => clearTimeout(id);
  }, [text, q.text, update]);

  const params: TemplatesListParams = { lang, tier: q.tier, category: q.category, q: q.text, sort: q.sort };
  const res = useTemplatesInfinite(params);
  const first = res.data?.pages[0];
  const last = res.data?.pages[res.data.pages.length - 1];
  const items = useMemo(() => flattenTemplatePages(res.data?.pages), [res.data]);
  // Info filter (total, facet) dari muatan terakhir = data paling baru.
  const data = last ?? first;
  const loadingMore = res.isFetchingNextPage;
  const nextError = res.isFetchNextPageError;
  const canLoadMore = !!res.hasNextPage && !loadingMore && !nextError;

  // Muatan berikutnya otomatis saat penanda di bawah daftar mendekati layar.
  const sentinel = useRef<HTMLDivElement>(null);
  const loadMore = res.fetchNextPage;
  useEffect(() => {
    const el = sentinel.current;
    if (!el || !canLoadMore || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => entries.some((e) => e.isIntersecting) && void loadMore(), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [canLoadMore, loadMore, items.length]);

  // Pulihkan posisi gulir setelah kembali dari detail (muatan masih di cache).
  const scrollKey = `tpl-scroll:${search.toString()}`;
  const restored = useRef(false);
  useLayoutEffect(() => {
    if (restored.current || !items.length) return;
    restored.current = true;
    try {
      const y = Number(sessionStorage.getItem(scrollKey));
      sessionStorage.removeItem(scrollKey);
      if (y > 0) window.scrollTo(0, y);
    } catch {
      /* sessionStorage tidak tersedia */
    }
  }, [items.length, scrollKey]);
  const rememberScroll = () => {
    try {
      sessionStorage.setItem(scrollKey, String(Math.round(window.scrollY)));
      sessionStorage.setItem(LAST_SEARCH_KEY, search.toString());
    } catch {
      /* abaikan */
    }
  };

  const reset = () => {
    setText("");
    setSearch(new URLSearchParams(), { replace: true });
  };
  const filtered = q.text !== "" || q.category !== "all" || q.tier !== "all";
  // Mode demo (v12): semua template gratis → tanpa filter Free/Premium & urutan harga.
  const demo = isDemoMode();
  const facet = (label: string, n: number | undefined) => (n === undefined ? label : `${label} (${n})`);

  return (
    <div className="flex flex-col gap-5" data-testid="web-templates">
      <FlowSteps current={1} />
      <PageHeader
        icon={LayoutTemplate}
        title={t("templates.title")}
        description={t("templates.description")}
        crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("templates.title") }]}
        help="templates"
        chips={
          <>
            {data && <Chip tone="blue">{t("templates.count", { count: data.totalAll })}</Chip>}
            <Chip tone={designs.length >= maxDesigns ? "amber" : "gray"}>{t("website.quotaDesigns", { current: designs.length, max: limitText(maxDesigns) })}</Chip>
            <Chip tone="gray">{t("website.quotaSites", { current: sites.length, max: limitText(siteLimit) })}</Chip>
          </>
        }
      />
      <PromoBanner />
      <Notice tone="info">{t(demo ? "demo.templates.rules" : "templates.rules", { max: limitText(maxDesigns), count: data?.totalAll ?? 100 })}</Notice>

      <section aria-label={t("templates.filters")} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/40" data-testid="template-filters">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <label className="relative block">
            <span className="sr-only">{t("templates.search")}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input type="search" value={text} maxLength={100} onChange={(e) => setText(e.target.value)} placeholder={t("templates.searchPlaceholder")} className={`${INPUT} pl-9`} data-testid="template-search" />
          </label>
          <label className="block">
            <span className="sr-only">{t("templates.filter")}</span>
            <select value={q.category} onChange={(e) => update({ category: e.target.value })} className={INPUT} data-testid="template-category">
              <option value="all">{t("templates.allCategories")}</option>
              {TEMPLATE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {catLabel(c)}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="sr-only">{t("templates.sortLabel")}</span>
            <select value={q.sort} onChange={(e) => update({ sort: e.target.value as TemplateSort })} className={INPUT} data-testid="template-sort">
              {SORTS.filter((s) => !demo || !s.startsWith("price")).map((s) => (
                <option key={s} value={s}>
                  {t(`templates.sort.${s}`)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {!demo && (
            <Segmented
              label={t("templates.tierFilter")}
              value={q.tier}
              onChange={(v) => update({ tier: v })}
              options={[
                { value: "all", label: facet(t("common.all"), data?.facets.all) },
                { value: "free", label: facet(t("common.free"), data?.facets.free) },
                { value: "premium", label: facet(t("common.premium"), data?.facets.premium) },
              ]}
            />
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400" role="status" aria-live="polite" data-testid="template-count">
            {data ? t("templates.results", { count: data.total, total: data.totalAll }) : ""}
            {data && data.total > items.length ? ` · ${t("templates.shown", { count: items.length })}` : ""}
          </p>
          {res.isFetching && !loadingMore && <Loader2 className="h-4 w-4 animate-spin text-gray-400" aria-hidden="true" />}
          {filtered && (
            <button type="button" onClick={reset} className={`${btn.ghost} ml-auto !py-1.5 text-sm`}>
              <RotateCcw className="h-4 w-4" /> {t("templates.resetFilters")}
            </button>
          )}
        </div>
      </section>

      <div ref={listTop} className="-mt-2 scroll-mt-24" />
      {res.isPending && <SkeletonCards count={6} testId="template-loading" />}
      {res.isError && !nextError && (
        <QueryError error={res.error} title={t("templates.loadError")} onRetry={() => void res.refetch()} retrying={res.isFetching} compact={!!data} testId="template-error" />
      )}
      {data && data.total === 0 && (
        <EmptyState
          icon={SearchX}
          title={t("templates.emptyTitle")}
          text={t("templates.emptyText")}
          testId="template-empty"
          action={
            <button type="button" onClick={reset} className={btn.secondary}>
              <RotateCcw className="h-4 w-4" /> {t("templates.resetFilters")}
            </button>
          }
        />
      )}
      {items.length > 0 && (
        <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3" data-testid="template-list" aria-busy={loadingMore}>
          {items.map((item) => {
            const tpl = item;
            const owned = a.hasAccess(tpl);
            const seed = () => seedTemplateDetail(lang, tpl);
            const open = () => {
              seed();
              rememberScroll();
            };
            return (
              <li key={tpl.refId} className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900/40" data-testid={`template-${tpl.refId}`} data-tier={tpl.tier}>
                <Link to={`${TEMPLATES_PATH}/${tpl.refId}`} onPointerEnter={seed} onFocus={seed} onClick={open} className="relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500" aria-label={t("templates.previewAria", { name: item.name })}>
                  <Thumb tpl={tpl} />
                  {tpl.tier === "premium" && !owned && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-gray-900/80 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Lock className="h-3 w-3" /> {t("market.badge.locked")}
                    </span>
                  )}
                  {item.isNew && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-blue-700 px-2 py-1 text-[11px] font-semibold text-white">
                      <Sparkles className="h-3 w-3" /> {t("market.badge.new")}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <TierChip tpl={tpl} owned={tpl.tier === "premium" && owned} />
                    <Chip tone="gray">{catLabel(tpl.category)}</Chip>
                    {tpl.code ? <CodeChip /> : <Chip tone="gray">{t("templates.pages", { count: tpl.pages.length })}</Chip>}
                    <PriceTag tpl={tpl} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{item.name}</h2>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.description}</p>
                    {tpl.tier === "premium" && (
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                        <Crown className="h-3.5 w-3.5" /> {t("market.included.count", { count: item.premiumItemIds.length })}
                      </p>
                    )}
                    {tpl.code && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300" data-testid={`card-libs-${tpl.refId}`}>
                        <LibraryIcon className="h-3.5 w-3.5 shrink-0" /> {tpl.code.libs.length ? t("templates.code.libs", { list: tpl.code.libs.join(", ") }) : t("templates.code.noLibs")}
                      </p>
                    )}
                    {item.libraries.length > 0 && (
                      <p className="mt-1 flex items-center gap-1 text-xs text-blue-700 dark:text-blue-300" data-testid={`card-libs-${tpl.refId}`}>
                        <LibraryIcon className="h-3.5 w-3.5 shrink-0" /> {t("market.included.cardLibraries", { list: item.libraries.map((l) => LIBRARY_BY_ID[l].name.replace(/ \(.*\)$/, "")).join(", ") })}
                      </p>
                    )}
                  </div>
                  <div className="mt-auto flex flex-wrap gap-2">
                    <Link to={`${TEMPLATES_PATH}/${tpl.refId}`} onPointerEnter={seed} onClick={open} className={`${btn.secondary} !py-2 text-sm`} data-testid={`preview-${tpl.refId}`}>
                      <Eye className="h-4 w-4" /> {t("templates.preview")}
                    </Link>
                    <ActionButtons tpl={tpl} a={a} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {loadingMore && <SkeletonCards count={3} testId="template-loading-more" />}
      {nextError && (
        <QueryError error={res.error} title={t("templates.loadMoreError")} onRetry={() => void res.fetchNextPage()} retrying={loadingMore} compact testId="template-load-more-error" />
      )}
      <div ref={sentinel} aria-hidden="true" data-testid="template-sentinel" />
      {canLoadMore && (
        <div className="flex justify-center">
          <button type="button" onClick={() => void res.fetchNextPage()} className={btn.secondary} data-testid="template-load-more">
            {t("templates.loadMore")}
          </button>
        </div>
      )}
      {data && !res.hasNextPage && items.length > 0 && data.total > TEMPLATES_PER_LOAD && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400" role="status" data-testid="template-end">
          {t("templates.allShown", { count: items.length })}
        </p>
      )}
      {a.dupeDialog}
      {a.codeDupeDialog}
      {a.formatDialog}
      {a.purchaseDialog}
    </div>
  );
}

function ActionButtons({ tpl, a }: { tpl: Tpl; a: ReturnType<typeof useTemplateActions> }) {
  const { t } = useTranslation();
  const locked = !a.hasAccess(tpl);
  const dl = a.busy === `download:${tpl.refId}`;
  const ed = a.busy === `edit:${tpl.refId}`;
  return (
    <>
      {locked && (
        <button type="button" onClick={() => a.buy(tpl)} disabled={!!a.busy} className={`${btn.primary} !py-2 text-sm`} data-testid={`buy-${tpl.refId}`}>
          <Crown className="h-4 w-4" /> {t("market.purchase.cta", { count: promoPrice(tpl.price).price })}
        </button>
      )}
      <button type="button" onClick={() => a.download(tpl)} disabled={!!a.busy} className={`${btn.secondary} !py-2 text-sm`} data-testid={`download-${tpl.refId}`}>
        {dl ? <Loader2 className="h-4 w-4 animate-spin" /> : locked ? <Lock className="h-4 w-4" /> : <Download className="h-4 w-4" />} {t("templates.download")}
      </button>
      {/* v16: Template Kode tidak dibuka di Desain Halaman. v17: diedit lewat editor tanpa kode. */}
      {tpl.code ? (
        <button type="button" onClick={() => a.editCode(tpl)} disabled={!!a.busy} className={`${locked ? btn.secondary : btn.primary} !py-2 text-sm`} data-testid={`edit-code-${tpl.refId}`}>
          {locked ? <Lock className="h-4 w-4" /> : <PencilRuler className="h-4 w-4" />} {t("templates.code.edit")}
        </button>
      ) : (
        <button type="button" onClick={() => a.edit(tpl)} disabled={!!a.busy} className={`${locked ? btn.secondary : btn.primary} !py-2 text-sm`} data-testid={`edit-${tpl.refId}`}>
          {ed ? <Loader2 className="h-4 w-4 animate-spin" /> : locked ? <Lock className="h-4 w-4" /> : <PencilRuler className="h-4 w-4" />} {t("templates.edit")}
        </button>
      )}
    </>
  );
}

function Detail({ tpl }: { tpl: Tpl }) {
  const { t } = useTranslation();
  const a = useTemplateActions(!isDemoMode());
  const [viewport, setViewport] = useState<(typeof VIEWPORTS)[number]["id"]>("desktop");
  const [pageKey, setPageKey] = useState<string | null>(null);
  const shown = tpl.pages.find((p) => p.key === pageKey) ?? tpl.pages.find((p) => p.home) ?? tpl.pages[0];
  const src = demoPageUrl(tpl.demoUrl, shown);
  const width = VIEWPORTS.find((v) => v.id === viewport)!.width;
  const demo = isDemoMode();
  const { i18n } = useTranslation();
  const owned = a.hasAccess(tpl);
  const sites = useDesignStore((s) => s.designs[SITE_TYPE]) ?? NONE;
  const copies = useMemo(() => sitesFromTemplate(tpl.refId, sites), [tpl.refId, sites]);
  const maxDesigns = useMaxDesigns();
  const item = tpl;

  return (
    <div className="flex flex-col gap-5" data-testid="template-detail">
      <FlowSteps current={1} to={{ 1: TEMPLATES_PATH }} />
      <PageHeader
        icon={LayoutTemplate}
        title={tpl.name}
        description={tpl.description}
        crumbs={[{ label: t("nav.sections.web-maker.name") }, { label: t("templates.title"), to: TEMPLATES_PATH }, { label: a.name(tpl) }]}
        help="templates"
        chips={
          <>
            <TierChip tpl={tpl} owned={tpl.tier === "premium" && owned} />
            <Chip tone="gray">{t(`templates.categories.${tpl.category}`)}</Chip>
            {tpl.code ? (
              <>
                <CodeChip />
                <Chip tone="gray">{t("templates.code.size", { kb: tpl.code.budgetKb })}</Chip>
                {/* Daftar library bisa panjang: boleh turun baris di layar sempit (Chip bawaan nowrap). */}
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-white/10 dark:text-gray-300">
                  {tpl.code.libs.length ? t("templates.code.libs", { list: tpl.code.libs.join(", ") }) : t("templates.code.noLibs")}
                </span>
              </>
            ) : (
              <Chip tone="gray">{t("templates.pages", { count: tpl.pages.length })}</Chip>
            )}
            {!demo && (
              <span className="inline-flex items-center rounded-full bg-white px-2.5 py-0.5 ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-700">
                <PromoPriceTag price={tpl.price} testId="detail-price" />
              </span>
            )}
          </>
        }
        actions={<ActionButtons tpl={tpl} a={a} />}
      />
      <PromoBanner />
      {tpl.tier === "premium" && !owned && <Notice tone="info">{t("templates.premiumNote", { cost: promoPrice(tpl.price).price })}</Notice>}
      {tpl.tier === "free" && !tpl.code && <Notice tone="success">{t(demo ? "demo.templates.freeNote" : "templates.freeNote")}</Notice>}
      {tpl.code && (
        <Notice tone="info" testId="template-code-note">
          {t("templates.code.note")}
          {tpl.code.group === "invitation" && <span className="mt-1 block">{t("templates.code.guestHint")}</span>}
        </Notice>
      )}
      {copies.length > 0 && (
        <Notice tone="info" testId="template-copies">
          {t("templates.copies", { count: copies.length })}{" "}
          <Link to="/website" className="font-semibold underline">
            {t("templates.openWebsite")}
          </Link>
        </Notice>
      )}
      <Panel
        title={t("templates.previewTitle")}
        description={t("templates.previewHint")}
        actions={
          <Segmented
            label={t("website.viewport")}
            value={viewport}
            onChange={setViewport}
            options={VIEWPORTS.map((v) => ({ value: v.id, label: <v.icon className="h-4 w-4" aria-label={t(`website.vp.${v.id}`)} />, title: t(`website.vp.${v.id}`) }))}
          />
        }
        bodyClassName="p-3 sm:p-4"
      >
        <nav aria-label={t("website.previewPages")} className={`mb-3 flex flex-wrap gap-1.5${tpl.code ? " hidden" : ""}`} data-testid="template-pages">
          {tpl.pages.map((p) => (
            <button
              key={p.key}
              type="button"
              aria-pressed={shown?.key === p.key}
              onClick={() => setPageKey(p.key)}
              className={`rounded-full border px-3 py-1 text-xs font-medium ${
                shown?.key === p.key ? "border-brand-700 bg-brand-700 text-white" : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {p.name} <span className="opacity-60">{p.home ? "index.html" : `${p.slug}.html`}</span>
            </button>
          ))}
        </nav>
        <div className="flex h-[72vh] min-h-96 justify-center overflow-auto rounded-xl border border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950">
          {demo ? (
            <DemoTemplateFrame
              templateId={tpl.refId}
              lang={i18n.language}
              pageKey={shown?.key ?? null}
              onNavigate={setPageKey}
              title={t("templates.previewTitle")}
              testId="template-demo"
              className="h-full border-0 bg-white"
              style={{ width: width ? `${width}px` : "100%" }}
            />
          ) : tpl.code && !src ? (
            // Template kode tanpa demo server (mis. backend lama): render dari HTML yang bisa dimuat.
            <CodeTemplateFrame templateId={tpl.refId} title={t("templates.previewTitle")} testId="template-demo" className="h-full border-0 bg-white" style={{ width: width ? `${width}px` : "100%" }} />
          ) : src ? (
            <iframe
              key={src}
              src={src}
              title={t("templates.previewTitle")}
              sandbox="allow-scripts allow-popups"
              referrerPolicy="no-referrer"
              data-testid="template-demo"
              className="h-full border-0 bg-white"
              style={{ width: width ? `${width}px` : "100%" }}
            />
          ) : (
            <p className="m-auto text-sm text-gray-500">{t("templates.noDemo")}</p>
          )}
        </div>
      </Panel>
      {/* Mode demo (v12): tidak ada item Premium/pembelian → panel "isi template" disembunyikan. */}
      {!demo && !tpl.code && (
        <Panel title={t("market.included.title")} description={t("market.included.hint")}>
          {item && a.catalog.data ? <IncludedSection item={item} catalog={a.catalog.data} /> : a.catalog.status === "error" ? <CatalogError onRetry={a.catalog.reload} /> : <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
        </Panel>
      )}
      <Panel title={t("templates.howTitle")}>
        <ul className="list-disc space-y-1.5 pl-5 text-sm text-gray-600 dark:text-gray-300">
          {(t(tpl.code ? "templates.code.how" : "templates.how", { returnObjects: true, max: limitText(maxDesigns), pages: tpl.pages.length }) as string[]).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </Panel>
      <div>
        <Link to={`${TEMPLATES_PATH}${lastCatalogSearch()}`} className={`${btn.ghost} text-sm`}>
          <ArrowLeft className="h-4 w-4" /> {t("templates.back")}
        </Link>
      </div>
      {a.dupeDialog}
      {a.codeDupeDialog}
      {a.formatDialog}
      {a.purchaseDialog}
    </div>
  );
}

function IncludedSection({ item, catalog }: { item: TemplateCatalogItem; catalog: CatalogSnapshot }) {
  return <IncludedItems tpl={item} catalog={catalog} />;
}

function CatalogError({ onRetry }: { onRetry: () => void }) {
  const { t } = useTranslation();
  return (
    <p className="flex items-center gap-2 text-sm text-rose-700 dark:text-rose-300">
      <AlertTriangle className="h-4 w-4" /> {t("templates.loadError")}{" "}
      <button type="button" onClick={onRetry} className="font-semibold underline">
        {t("templates.retry")}
      </button>
    </p>
  );
}

export default function WebTemplates() {
  const { t, i18n } = useTranslation();
  const { templateId } = useParams();
  useLang();
  const lang = toTplLang(i18n.language);
  // Detail dari GET /templates/:id (cache diisi dari kartu katalog → tampil seketika).
  const detail = useTemplateDetail(lang, templateId);
  const tpl = templateId ? (detail.data ?? null) : null;
  const missing = detail.error instanceof ApiError && detail.error.status === 404;
  if (templateId && missing) return <Navigate to={TEMPLATES_PATH} replace />;
  return (
    <>
      <AppMeta title={tpl ? `${tpl.name} · ${t("templates.title")}` : t("templates.metaTitle")} description={t("templates.metaDescription")} />
      {templateId ? (
        tpl ? (
          <Detail tpl={tpl} />
        ) : detail.isError ? (
          <CatalogError onRetry={() => void detail.refetch()} />
        ) : (
          <div className="flex justify-center py-20" data-testid="template-detail-loading">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        )
      ) : (
        <Catalog />
      )}
      <CreditDialog />
      <DesignLimitDialog />
      <SiteLimitDialog />
    </>
  );
}
