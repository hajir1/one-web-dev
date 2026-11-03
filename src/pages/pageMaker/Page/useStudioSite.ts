import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SetURLSearchParams } from "react-router";
import type { TFunction } from "i18next";
import { useLocaleNavigate } from "../../../components/app/LocaleLink";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import type { useDesignSaver } from "../core/hooks/useDesignSaver";
import type { useComponentDoc } from "../engine/helpers/useComponentDoc";
import type { ComponentDoc } from "../engine/helpers/componentTypes";
import { PAGE_TYPE, normalizePageDoc } from "../helpers/pageDoc";
import { insertPageAfter, normalizeSiteDoc, removePage, resolvePages, setLabel, setSlug, slugify, uniqueSlug, SITE_TYPE, type SiteDoc } from "../helpers/site";
import { applyChrome, buildPatternPage, duplicatePageDoc, footerOf, headerOf } from "../helpers/studio";
import { ensureDesignRoom } from "../helpers/designQuota";
import type { NewPageChoice } from "../ui/studio/AddPageDialog";
import { useSaveTarget } from "../ui/studio/saveTarget";

/* ================================================================== */
/* Studio (v20): /studio/:siteId = satu website, banyak halaman.        */
/* Dipisah dari PageMaker.tsx (no. 15): daftar halaman, simpan          */
/* otomatis, buka/tambah/ganti nama/hapus halaman, salin header-footer. */
/* ================================================================== */

interface StudioArgs {
  t: TFunction;
  push: (message: string) => void;
  design: ReturnType<typeof useDesignSaver<ComponentDoc>>;
  history: ReturnType<typeof useComponentDoc>;
  siteId: string | undefined;
  siteDocs: SavedDesign[];
  pageDesigns: SavedDesign[];
  searchParams: URLSearchParams;
  setSearchParams: SetURLSearchParams;
  /** Dipanggil setelah halaman dimuat (mis. pilihan elemen kembali ke root). */
  onPageLoaded: () => void;
}

export function useStudioSite({ t, push, design, history, siteId, siteDocs, pageDesigns, searchParams, setSearchParams, onPageLoaded }: StudioArgs) {
  const siteMode = !!siteId;
  const { doc, editRoot } = history;
  /* ---------------- Studio: halaman website ---------------- */
  const localeNavigate = useLocaleNavigate();
  const saveDesignToStore = useDesignStore((st) => st.saveDesign);
  const updateDesignInStore = useDesignStore((st) => st.updateDesign);
  const renameDesignInStore = useDesignStore((st) => st.renameDesign);
  const deleteDesignInStore = useDesignStore((st) => st.deleteDesign);
  const site = siteMode ? (siteDocs.find((x) => x.id === siteId) ?? null) : null;
  const siteDoc: SiteDoc | null = useMemo(() => (site ? normalizeSiteDoc(site.state) : null), [site]);
  const sitePages = useMemo(() => (siteDoc ? resolvePages(siteDoc, pageDesigns).filter((p) => p.design) : []), [siteDoc, pageDesigns]);
  const saveTarget = useSaveTarget();
  const [boardOpen, setBoardOpen] = useState(false);
  const [addPageOpen, setAddPageOpen] = useState(false);
  const [sitePanelOpen, setSitePanelOpen] = useState(false);
  const [kirimanOpen, setKirimanOpen] = useState(false);
  const [deployOpen, setDeployOpen] = useState(() => searchParams.get("step") === "deploy");
  const [deletePageId, setDeletePageId] = useState<string | null>(null);

  const saveSite = useCallback((next: SiteDoc) => site && updateDesignInStore(SITE_TYPE, site.id, next), [site, updateDesignInStore]);

  // Simpan otomatis (Studio): perubahan tersimpan 0,8 detik setelah berhenti mengedit.
  const saveNowRef = useRef(design.handleSaveChanges);
  saveNowRef.current = design.handleSaveChanges;
  const dirtyRef = useRef(design.isDirty);
  dirtyRef.current = design.isDirty;
  const flush = useCallback(() => {
    if (dirtyRef.current) saveNowRef.current();
  }, []);
  useEffect(() => {
    if (!siteMode || !design.isDirty || !design.activeDesign) return;
    const id = setTimeout(() => saveNowRef.current(), 800);
    return () => clearTimeout(id);
  }, [siteMode, design.isDirty, design.activeDesign, doc]);
  useEffect(() => () => {
    if (siteMode && dirtyRef.current) saveNowRef.current();
  }, [siteMode]);
  useEffect(() => {
    if (!siteMode) return;
    const onHide = () => flush();
    window.addEventListener("pagehide", onHide);
    return () => window.removeEventListener("pagehide", onHide);
  }, [siteMode, flush]);

  /** Buka halaman: riwayat undo dimulai baru (undo tidak menyeberang ke halaman lain). */
  const loadPage = useCallback(
    (d: SavedDesign) => {
      design.handleLoad(d);
      history.reset(normalizePageDoc(d.state));
      onPageLoaded();
      setSearchParams(
        (p) => {
          p.set("page", d.id);
          p.delete("step");
          return p;
        },
        { replace: true },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [design.handleLoad, history.reset, setSearchParams],
  );
  const openPage = useCallback(
    (id: string) => {
      setBoardOpen(false);
      if (id === design.activeDesignId) return;
      flush();
      const d = useDesignStore.getState().designs[PAGE_TYPE]?.find((x) => x.id === id);
      if (d) loadPage(d);
    },
    [design.activeDesignId, flush, loadPage],
  );

  // Pertama kali (atau halaman aktif dihapus): buka ?page=, beranda, atau halaman pertama.
  const wantedPage = searchParams.get("page");
  useEffect(() => {
    if (!siteMode || !siteDoc) return;
    if (design.activeDesignId && sitePages.some((p) => p.designId === design.activeDesignId)) return;
    const target = sitePages.find((p) => p.designId === wantedPage) ?? sitePages.find((p) => p.isHome) ?? sitePages[0];
    if (target?.design) loadPage(target.design);
    else setBoardOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteMode, siteDoc, sitePages, design.activeDesignId]);

  const currentPage = sitePages.find((p) => p.designId === design.activeDesignId) ?? null;
  /** Isi terbaru sebuah halaman (halaman yang sedang diedit = isi editor). */
  const pageDocOf = useCallback(
    (id: string) => (id === design.activeDesignId ? doc : normalizePageDoc(useDesignStore.getState().designs[PAGE_TYPE]?.find((x) => x.id === id)?.state)),
    [design.activeDesignId, doc],
  );
  const homeDoc = useMemo(() => {
    const home = sitePages.find((p) => p.isHome) ?? sitePages[0];
    return home ? pageDocOf(home.designId) : null;
  }, [sitePages, pageDocOf]);

  const designNameFor = (name: string) => (site ? `${name} · ${site.name}` : name);

  const createPage = (c: NewPageChoice) => {
    if (!site || !siteDoc) return;
    if (!ensureDesignRoom(1, "save", { label: c.name, onRoom: () => createPage(c) })) return;
    flush();
    const pageDoc = "copyFrom" in c ? duplicatePageDoc(pageDocOf(c.copyFrom)) : buildPatternPage(c.pattern, homeDoc);
    const id = saveDesignToStore(PAGE_TYPE, designNameFor(c.name), pageDoc);
    const saved = useDesignStore.getState().designs[PAGE_TYPE]?.find((d) => d.id === id);
    if (!saved) return;
    let next = insertPageAfter(siteDoc, saved, design.activeDesignId);
    next = setLabel(next, id, c.name);
    const slug = uniqueSlug(slugify(c.name), new Set(next.pages.filter((p) => p.designId !== id).map((p) => p.slug)));
    next = setSlug(next, id, slug).doc;
    saveSite(next);
    setAddPageOpen(false);
    loadPage(saved);
    setBoardOpen(false);
    push(t("studio.toast.added", { name: c.name }));
  };

  const renamePage = (id: string, name: string) => {
    if (!siteDoc) return;
    const page = sitePages.find((p) => p.designId === id);
    let next = setLabel(siteDoc, id, name);
    // Slug ikut nama bila belum pernah diubah manual (URL = nama halaman).
    if (page && !page.isHome && page.slug === slugify(page.title)) {
      const taken = new Set(next.pages.filter((p) => p.designId !== id).map((p) => p.slug));
      next = setSlug(next, id, uniqueSlug(slugify(name), taken)).doc;
    }
    saveSite(next);
    renameDesignInStore(PAGE_TYPE, id, designNameFor(name));
  };

  const confirmDeletePage = () => {
    if (!siteDoc || !deletePageId || sitePages.length < 2) return setDeletePageId(null);
    const id = deletePageId;
    const name = sitePages.find((p) => p.designId === id)?.title ?? "";
    setDeletePageId(null);
    if (id === design.activeDesignId) {
      const other = sitePages.find((p) => p.designId !== id);
      if (other?.design) loadPage(other.design);
    }
    saveSite(removePage(siteDoc, id));
    deleteDesignInStore(PAGE_TYPE, id);
    push(t("studio.toast.deleted", { name }));
  };

  const syncChrome = (fromId: string) => {
    flush();
    const source = pageDocOf(fromId);
    if (!headerOf(source) && !footerOf(source)) {
      push(t("studio.toast.noChrome"));
      return;
    }
    let n = 0;
    for (const p of sitePages) {
      if (p.designId === fromId) continue;
      const res = applyChrome(source, pageDocOf(p.designId));
      if (!res.changed) continue;
      n++;
      if (p.designId === design.activeDesignId) editRoot(() => res.doc.root);
      else updateDesignInStore(PAGE_TYPE, p.designId, res.doc);
    }
    push(t("studio.toast.chromeSynced", { count: n }));
  };

  return { localeNavigate, updateDesignInStore, site, siteDoc, sitePages, saveTarget, boardOpen, setBoardOpen, addPageOpen, setAddPageOpen, sitePanelOpen, setSitePanelOpen, kirimanOpen, setKirimanOpen, deployOpen, setDeployOpen, deletePageId, setDeletePageId, saveSite, flush, openPage, currentPage, pageDocOf, homeDoc, createPage, renamePage, confirmDeletePage, syncChrome };
}
