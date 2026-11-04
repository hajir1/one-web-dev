import { canBeFilterBar, filterBarsIn, markFilterBar, syncFilterBars, unmarkFilterBar } from "../helpers/categoryFilter";
import { useComposeVars } from "../core/hooks/useGlobalVars";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Link } from "../../../components/app/LocaleLink";
import { useDesignStore, type SavedDesign } from "../core/store/designStore";
import {
  AlertTriangle,
  Braces,
  Globe,
  Library,
  Sparkles,
  FileWarning,
  Trash2,
  Database,
  Rows3,
  FileText,
  Filter,
  Link2,
} from "lucide-react";
import DesignManagerBar from "../core/ui/DesignManagerBar";
import CodeExportPanel from "../core/ui/CodeExportPanel";
import { isDemoMode } from "../../../demo/demoMode";
import { useDesignSaver } from "../core/hooks/useDesignSaver";
import { useSafeClassName } from "../core/hooks/useSafeClassName";
import { useIconLookup } from "../core/hooks/useElementOutput";
import { useFontStore } from "../core/store/fontStore";
import { useLibraryFonts } from "../core/hooks/useLibraryFonts";
import { baseFontStack } from "../core/helpers/fontCss";
import { ELEMENT_DEFINITION_BY_TYPE } from "../core/elementDefinitions";
import type { Framework } from "../core/helpers/generatorCss";
import { buildSite, projectFiles, singlePage, siteZipName } from "../helpers/siteExport";
import { usePremiumElementsFor } from "../../../marketplace/hooks";

import { ROOT_ID, isBox, type BoxLayout, type BoxNode, type ComponentNode, type ElementNode, type NodeId } from "../engine/helpers/componentTypes";
import {
  canMoveInto,
  collectElements,
  createBox,
  createElementNode,
  findNode,
  findParent,
  moveBy,
  removeNode,
  unwrapBox,
  updateNode,
  wrapInBox,
} from "../engine/helpers/tree";
import { compose } from "../engine/helpers/compose";
import { resolveElement } from "../engine/helpers/resolve";
import { useComponentDoc } from "../engine/helpers/useComponentDoc";
import { buildEditHandlers } from "../engine/helpers/editHandlers";
import { usePersistentState } from "../engine/helpers/usePersistentState";
import type { DragPayload } from "../engine/helpers/dnd";
import Inspector, { type InspectorHandlers } from "../engine/ui/Inspector";
import StructureTree from "../engine/ui/StructureTree";
import type { LibraryPick } from "../engine/ui/ElementLibrary";
import Toasts, { useToasts } from "../engine/ui/Toasts";

import { DEFAULT_PAGE_CLASS_NAME, PAGE_TYPE, belowSpot, createDefaultPageDoc, duplicateBelow, innerRowSpot, isInnerRow, placeInnerRow, createPageRoot, createRow, createRowVariant, createSectionForEditor, createSectionFromPreset, docTemplateId, isRow, isSection, movePageNode, normalizePageDoc, placeBelowWrapped, placeNode, rowOf } from "../helpers/pageDoc";
import { getSectionPreset, isPremiumPreset, type SectionPreset } from "../helpers/sectionPresets";
import { requireCredit } from "../../../credits/credits";
import { itemKey } from "../../../credits/items";
import { useAccess, useMaxDesigns } from "../../../marketplace/hooks";
import { pieceInfo } from "../../../marketplace/data/prices";
import { PieceAccessProvider } from "../../../marketplace/ui/AccessBadge";
import { useDesignLimit } from "../helpers/designQuota";
import DesignLimitDialog from "../ui/DesignLimitDialog";
import FloatingPanel from "../ui/FloatingPanel";
import LeaveDialog from "../ui/LeaveDialog";
import { useLeaveGuard } from "../hooks/useLeaveGuard";
import { allSiteInfos, movePage, normalizeSiteDoc, setHidden, setHomepage, SITE_TYPE } from "../helpers/site";
import { footerOf, headerOf } from "../helpers/studio";
import { WEBSITE_HUB_PATH } from "../../../config/menu";
import Modal from "../../../components/app/Modal";
import EmptyState from "../../../components/app/EmptyState";
import { btn } from "../../../components/app/ui";
import PageBoard from "../ui/studio/PageBoard";
import AddPageDialog from "../ui/studio/AddPageDialog";
import SitePanel from "../ui/studio/SitePanel";
import StudioDeployDialog from "../ui/studio/StudioDeployDialog";
import { useStudioSite } from "./useStudioSite";
import StudioBar from "./StudioBar";
import EditorHeader from "./EditorHeader";
import SubmissionsPanel from "../../../submissions/SubmissionsPanel";
import type { SiteContext } from "../core/helpers/siteTypes";
import CreditDialog from "../../../credits/CreditDialog";
import AdvancedPanel from "../ui/AdvancedPanel";
import AnimationPanel from "../ui/AnimationPanel";
import type { PanelSection } from "../core/ui/PanelStyling";
import BuilderCanvas from "../ui/BuilderCanvas";
import PagePreview from "../ui/PagePreview";
import AddPanel, { type AddTab } from "../ui/AddPanel";
import { NodeLibraryPanel } from "../ui/LibraryPanel";
import { LIBRARY_IDS, type LibraryId } from "../engine/helpers/libraries";
import SectionPicker from "../ui/SectionPicker";
import CollectionDashboard, { type DashboardEntry } from "../ui/collections/CollectionDashboard";
import { CollectionBoxPanel, CollectionCardNote, CollectionDisplayPanel } from "../ui/collections/CollectionPanel";
import { BindPanel, FilterBarPanel, ItemBoxPanel, RelatedPanel } from "../ui/collections/ItemPagePanel";
import {
  canBeItemBox,
  canBeRelated,
  canBind,
  itemAncestor,
  itemBoxIn,
  itemCollectionsUsed,
  markItemBox,
  markRelated,
  renameCollectionRefs,
  setBinding,
  setPreviewItem,
  setRelatedLimit,
  syncItemPage,
  unmarkItemBox,
  unmarkRelated,
} from "../helpers/itemPage";
import CrudExportBar from "../ui/collections/CrudExportBar";
import { applyCollection, canBecomeCollection, collectionAncestor, collectionsIn, markCollection, setCollectionDisplay, setCollectionView, unmarkCollection, type CollectionDef } from "../helpers/collections";
import { DEFAULT_CRUD_STACK, frameworkForStack, isOfferedStack, stackForFramework, withCrud, type CrudStack } from "../helpers/crud";

import { VIEWPORTS, isBool, isMode, isViewport, summarize, type Mode, type Viewport } from "./editorUi";

/** Entry point: does not depend on AppLayout; the page fills the viewport itself. */
const NO_DESIGNS: SavedDesign[] = [];

export default function PageMaker() {
  const { t } = useTranslation();
  const history = useComponentDoc(createDefaultPageDoc);
  const { doc, editRoot } = history;
  const root = doc.root;
  /**
   * Premium item access: unlocked by the server (billing), bought individually (simulation),
   * or INCLUDED with a template the user owns; the last one only when this design
   * was created from that template (`doc.source.templateId`).
   */
  const templateId = docTemplateId(doc);
  const access = useAccess({ templateId });
  const owns = access.owns;
  const allowElement = useCallback((type: string) => owns(itemKey.element(type)), [owns]);
  const pieceAccess = useMemo(() => ({ reason: access.reason, priceOf: (id: string) => pieceInfo(id)?.price ?? null }), [access.reason]);
  const maxDesigns = useMaxDesigns();

  const defaultDoc = useMemo(createDefaultPageDoc, []);
  const design = useDesignSaver(PAGE_TYPE, doc, history.setDoc, defaultDoc, normalizePageDoc, {
    // Demo mode (v15): unlimited designs → no quota box.
    maxFree: isDemoMode() ? undefined : maxDesigns,
    // Full → design limit dialog (users delete designs themselves; nothing is deleted automatically).
    onLimit: () => useDesignLimit.getState().open({ adding: 1, reason: "save" }),
  });
  /* ---------------- Studio (v20): /studio/:siteId = one website, many pages ---------------- */
  const { siteId } = useParams();
  const siteMode = !!siteId;
  // Studio saves automatically, so there is no "save before leaving" dialog.
  const guard = useLeaveGuard(siteMode ? false : design.isDirty);

  /* ---------------- website (Menu Element) ---------------- */
  const siteDocs = useDesignStore((st) => st.designs[SITE_TYPE]) ?? NO_DESIGNS;
  const pageDesigns = useDesignStore((st) => st.designs[PAGE_TYPE]) ?? NO_DESIGNS;
  const siteCtx: SiteContext = useMemo(
    () => ({ sites: allSiteInfos(siteDocs, pageDesigns), currentDesignId: design.activeDesignId, routing: "none" }),
    [siteDocs, pageDesigns, design.activeDesignId],
  );

  // v17: "Next: Compose & Deploy" opens the website folder that contains this design.
  const nextStepPath = useMemo(() => {
    const site = siteDocs.find((s) => normalizeSiteDoc(s.state).pages.some((p) => p.designId === design.activeDesignId));
    return site ? `/website?site=${encodeURIComponent(site.id)}` : "/website";
  }, [siteDocs, design.activeDesignId]);

  // /page-maker?design=<id> → open that design (from the Website page).
  const [searchParams, setSearchParams] = useSearchParams();
  const openId = searchParams.get("design");
  useEffect(() => {
    if (!openId || siteMode) return;
    const d = pageDesigns.find((x) => x.id === openId);
    if (d && design.activeDesignId !== d.id) design.handleLoad(d);
    setSearchParams((p) => {
      p.delete("design");
      return p;
    }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);
  const { className, setClassName, safeClassName: cls } = useSafeClassName(DEFAULT_PAGE_CLASS_NAME);

  /* ---------------- Studio: website pages (useStudioSite.ts) ---------------- */
  const { toasts, push, dismiss } = useToasts();
  const [selectedId, setSelectedId] = useState<NodeId>(ROOT_ID);
  const { localeNavigate, updateDesignInStore, site, siteDoc, sitePages, saveTarget, boardOpen, setBoardOpen, addPageOpen, setAddPageOpen, sitePanelOpen, setSitePanelOpen, kirimanOpen, setKirimanOpen, deployOpen, setDeployOpen, deletePageId, setDeletePageId, saveSite, flush, openPage, currentPage, pageDocOf, homeDoc, createPage, renamePage, confirmDeletePage, syncChrome } = useStudioSite({ t, push, design, history, siteId, siteDocs, pageDesigns, searchParams, setSearchParams, onPageLoaded: () => setSelectedId(ROOT_ID) });


  const [framework, setFramework] = useState<Framework>("html");

  const icons = useIconLookup();
  const fonts = useFontStore((st) => st.fonts);
  const baseFont = useFontStore((st) => baseFontStack(st.fonts, st.baseFontId));
  const globalVars = useComposeVars();
  useLibraryFonts();

  /* ---------------- UI state ---------------- */
  const [mode, setMode] = usePersistentState<Mode>("pm-mode", "design", isMode);
  const [viewport, setViewport] = usePersistentState<Viewport>("pm-viewport", "desktop", isViewport);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [layersOpen, setLayersOpen] = useState(false);
  const [designsOpen, setDesignsOpen] = useState(false);
  /**
   * Target of the (+) button; null = follow the selection.
   * `after: true` = right below that node (next sibling); false = inside it.
   */
  const [addTarget, setAddTarget] = useState<{ id: NodeId; after: boolean } | null>(null);
  const [addTab, setAddTab] = useState<AddTab>("element");
  /** Pemilih preset section: indeks sisip (null = tertutup). */
  const [sectionAt, setSectionAt] = useState<number | null>(null);

  const selected: ComponentNode = findNode(root, selectedId) ?? root;
  useEffect(() => {
    if (!findNode(root, selectedId)) setSelectedId(ROOT_ID);
    if (addTarget && !findNode(root, addTarget.id)) setAddTarget(null);
  }, [root, selectedId, addTarget]);

  const viewportWidth = VIEWPORTS.find((v) => v.id === viewport)!.width;

  /* ---------------- compose ---------------- */
  const preview = useMemo(
    () => compose(root, { rootClass: cls, icons, fonts, baseFont, vars: globalVars, preview: true, site: siteCtx, allowPremiumElements: allowElement }),
    [root, cls, icons, fonts, baseFont, globalVars, siteCtx, allowElement],
  );
  const exported = useMemo(
    () => compose(root, { rootClass: cls, icons, fonts, baseFont, vars: globalVars, site: siteCtx, allowPremiumElements: allowElement }),
    [root, cls, icons, fonts, baseFont, globalVars, siteCtx, allowElement],
  );
  // v7: download = a ready-to-run single-page project (package.json, README, global CSS).
  const projectTitle = design.designNameInput.trim() || t("pm.editor.untitled");
  const premiumFor = usePremiumElementsFor();
  /**
   * Studio (website): the Code panel exports the WHOLE website (every page +
   * menu), same as Deploy. The active page uses the latest editor content.
   * Only computed in Code mode (composing every page is fairly heavy).
   */
  const builtSite = useMemo(() => {
    if (!siteMode || !site || mode !== "code") return null;
    const designs = pageDesigns.map((d) => (d.id === design.activeDesignId ? { ...d, state: doc } : d));
    return buildSite(site, designs, { icons, fonts, baseFont, vars: globalVars, allowPremiumElementsFor: premiumFor });
  }, [siteMode, site, mode, pageDesigns, design.activeDesignId, doc, icons, fonts, baseFont, globalVars, premiumFor]);
  const baseFiles = useMemo(
    () => (builtSite ? builtSite.files(framework) : projectFiles(framework, projectTitle, [singlePage(exported, projectTitle)])),
    [builtSite, exported, framework, projectTitle],
  );

  /* ---------------- uji coba CRUD: koleksi data ---------------- */
  const [includeCrud, setIncludeCrud] = usePersistentState<boolean>("pm-crud-include", false, isBool);
  const [crudStack, setCrudStack] = usePersistentState<CrudStack>("pm-crud-stack", DEFAULT_CRUD_STACK, isOfferedStack);
  const [crudOpen, setCrudOpen] = useState<{ key: string | null } | null>(null);
  const [reveal, setReveal] = useState<{ id: NodeId; n: number } | null>(null);
  /** Every collection in the website (active page = editor content). */
  const crudEntries: DashboardEntry[] = useMemo(() => {
    const pages = siteMode && sitePages.length ? sitePages.map((p) => ({ id: p.designId, title: p.title })) : [{ id: design.activeDesignId ?? "", title: projectTitle }];
    return pages.flatMap((p) => {
      const r = !siteMode || p.id === design.activeDesignId ? root : normalizePageDoc(p.id ? useDesignStore.getState().designs[PAGE_TYPE]?.find((x) => x.id === p.id)?.state : null).root;
      return collectionsIn(r).map((c) => ({ key: `${p.id}:${c.boxId}`, pageTitle: p.title, boxId: c.boxId, col: c.col }));
    });
    // pageDesigns: another page changes → the list changes too.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteMode, sitePages, design.activeDesignId, root, projectTitle, pageDesigns]);
  const crudCols = useMemo(() => crudEntries.map((e) => e.col), [crudEntries]);
  const crudActive = includeCrud && crudCols.length > 0 && stackForFramework(framework) === crudStack;
  const files = useMemo(
    () => (crudActive ? withCrud(crudStack, baseFiles, crudCols, site?.name ?? projectTitle) : baseFiles),
    [crudActive, crudStack, baseFiles, crudCols, site?.name, projectTitle],
  );
  /**
   * Item page preview: after a collection changes, the detail pages and
   * "related items" cards on every page are recomposed (a renamed collection
   * slug is updated too).
   */
  const syncItemPages = useCallback(
    (cols: CollectionDef[], rename?: { from: string; to: string }) => {
      const fix = (r: BoxNode) => {
        const renamed = rename ? renameCollectionRefs(r, rename.from, rename.to) : r;
        const items = itemCollectionsUsed(renamed).length ? syncItemPage(renamed, cols) : renamed;
        // Category filter chips follow the categories in the data.
        return filterBarsIn(items).length ? syncFilterBars(items, cols, rename) : items;
      };
      const ids = siteMode && sitePages.length ? sitePages.map((p) => p.designId) : [design.activeDesignId ?? ""];
      for (const id of ids) {
        if (!siteMode || !id || id === design.activeDesignId) {
          if (itemCollectionsUsed(root).length || filterBarsIn(root).length || rename) editRoot(fix);
          continue;
        }
        const pd = pageDocOf(id);
        const next = fix(pd.root);
        if (next !== pd.root) updateDesignInStore(PAGE_TYPE, id, { ...pd, root: next });
      }
    },
    [siteMode, sitePages, design.activeDesignId, root, editRoot, pageDocOf, updateDesignInStore],
  );
  const changeCollection = useCallback(
    (entry: DashboardEntry, next: CollectionDef) => {
      const pageId = entry.key.slice(0, entry.key.indexOf(":"));
      if (!siteMode || !pageId || pageId === design.activeDesignId) editRoot((r) => applyCollection(r, entry.boxId, next));
      else {
        const pd = pageDocOf(pageId);
        updateDesignInStore(PAGE_TYPE, pageId, { ...pd, root: applyCollection(pd.root, entry.boxId, next) });
      }
      const cols = crudEntries.map((e) => (e.key === entry.key ? next : e.col));
      syncItemPages(cols, entry.col.slug !== next.slug ? { from: entry.col.slug, to: next.slug } : undefined);
    },
    [siteMode, design.activeDesignId, editRoot, pageDocOf, updateDesignInStore, crudEntries, syncItemPages],
  );
  /** Does collection `slug` have an item page (card buttons lead to the item page)? */
  const setItemPageFlag = useCallback(
    (slug: string, on: boolean) => {
      const entry = crudEntries.find((e) => e.col.slug === slug);
      if (entry && !!entry.col.itemPage !== on) changeCollection(entry, { ...entry.col, itemPage: on || undefined });
    },
    [crudEntries, changeCollection],
  );
  const boardThumbs = useMemo(() => {
    if (!boardOpen) return new Map<string, { css: string; body: string }>();
    const out = new Map<string, { css: string; body: string }>();
    for (const p of sitePages) {
      const r = p.designId === design.activeDesignId ? root : normalizePageDoc(p.design?.state).root;
      const c = compose(r, { rootClass: cls, icons, fonts, baseFont, vars: globalVars, preview: true, site: siteCtx, allowPremiumElements: allowElement });
      out.set(p.designId, { css: c.html.css, body: c.html.body });
    }
    return out;
  }, [boardOpen, sitePages, root, design.activeDesignId, cls, icons, fonts, baseFont, globalVars, siteCtx, allowElement]);
  const sectionCount = root.children.length;
  const elementCount = useMemo(() => collectElements(root).length, [root]);

  /* ---------------- tujuan penambahan ---------------- */
  /**
   * CONTENT insertion point (element / component / group):
   *   - (+) on an element / group → right below it (always stacks
   *                                downward; see `belowSpot`)
   *   - (+) inside a Row / group → the end of its content
   *   - section                 → its last Row (or a new Row when there is none)
   */
  const spot: { parentId: NodeId; index: number; label: string; wrapId?: NodeId } | null = useMemo(() => {
    const explicit = addTarget ? findNode(root, addTarget.id) : null;
    const base = explicit ?? (selected.id !== ROOT_ID ? selected : null);
    const after = !!explicit && !!addTarget?.after;
    const intoSection = (sec: BoxNode) => {
      const last = sec.children[sec.children.length - 1];
      return last && isBox(last)
        ? { parentId: last.id, index: last.children.length, label: `“${last.name}”` }
        : { parentId: sec.id, index: 0, label: `“${sec.name}”` };
    };
    if (base) {
      const loc = findParent(root, base.id);
      const below = after ? belowSpot(root, base.id) : null;
      if (below && loc) {
        const label = t("pm.editor.target.below", { name: base.name });
        return "wrapId" in below ? { parentId: loc.parent.id, index: loc.index + 1, label, wrapId: below.wrapId } : { ...below, label };
      }
      if (isBox(base) && base.id !== ROOT_ID) {
        if (isSection(base)) return intoSection(base);
        // Row/inner Row with columns: the module goes into a column (the first empty column, or the last column), not a new column.
        const cols = (isRow(base) || isInnerRow(base)) && (base.layout === "grid" || base.layout === "row") && base.children.length > 0 && base.children.every(isBox) ? (base.children as BoxNode[]) : null;
        if (cols) {
          const c = cols.find((x) => x.children.length === 0) ?? cols[cols.length - 1];
          return { parentId: c.id, index: c.children.length, label: `“${c.name}”` };
        }
        return { parentId: base.id, index: base.children.length, label: `“${base.name}”` };
      }
      if (!isBox(base) && loc && loc.parent.id !== ROOT_ID) {
        return { parentId: loc.parent.id, index: loc.parent.children.length, label: `“${loc.parent.name}”` };
      }
    }
    const lastSec = root.children[root.children.length - 1];
    return lastSec && isBox(lastSec) ? intoSection(lastSec) : null;
  }, [root, selected, addTarget, t]);
  const targetLabel = spot ? spot.label : t("pm.editor.target.page");
  /** Layout of the target container (a new wrapping group is always a Stack). */
  const spotLayout: BoxLayout | undefined = spot?.wrapId ? "stack" : spot ? (findNode(root, spot.parentId) as BoxNode | null)?.layout : undefined;

  /** Position note for the new Row. */
  const rowBaseId: NodeId | null = useMemo(() => {
    const explicit = addTarget ? findNode(root, addTarget.id) : null;
    const base = explicit ?? (selected.id !== ROOT_ID ? selected : null);
    if (base) return base.id;
    const last = root.children[root.children.length - 1];
    return last ? last.id : null;
  }, [root, selected, addTarget]);
  const rowLabel = (() => {
    const b = rowBaseId ? findNode(root, rowBaseId) : null;
    if (!b) return t("pm.editor.row.toPage");
    if (isSection(b)) return t("pm.editor.row.endOfSection", { name: b.name });
    const inner = innerRowSpot(root, b.id);
    if (inner) return t("pm.editor.row.inSpecialty", { name: findNode(root, inner.columnId)?.name ?? "" });
    const r = rowOf(root, b.id);
    return r ? t("pm.editor.row.belowRow", { name: r.name }) : t("pm.editor.row.toPage");
  })();

  /* ---------------- operasi pohon ---------------- */
  const select = useCallback((id: NodeId) => setSelectedId(id), []);

  const insert = useCallback(
    (node: ComponentNode, parentId: NodeId, index: number): boolean => {
      const res = placeNode(root, parentId, index, node);
      if (!res.id) {
        push(
          parentId === root.id && !isSection(node)
            ? t("pm.editor.toast.pageOnlySections")
            : isSection(node)
              ? t("pm.editor.toast.sectionNotNested")
              : t("pm.editor.toast.cannotPlaceHere"),
        );
        return false;
      }
      editRoot((r) => placeNode(r, parentId, index, node).root);
      setSelectedId(node.id);
      return true;
    },
    [root, editRoot, push, t],
  );

  /** Adds a new section to the page. `openAdd`: immediately opens the element panel for its first Row. */
  const placeSection = useCallback(
    (node: BoxNode, index: number, openAdd = false) => {
      if (!insert(node, ROOT_ID, index)) return;
      setSectionAt(null);
      const openPanel = () => {
        setAddTarget({ id: node.children.find(isBox)?.id ?? node.id, after: false });
        setAddTab("element");
        setAddOpen(true);
      };
      if (openAdd) {
        openPanel();
        push(t("pm.editor.toast.sectionAdded", { name: node.name }));
      } else push(t("pm.editor.toast.sectionAdded", { name: node.name }), { label: t("pm.editor.toast.addContent"), run: openPanel });
    },
    [insert, push, t],
  );

  const addSection = useCallback(
    (preset: SectionPreset | string, index: number, unlocked = false, withContent = false) => {
      const p = typeof preset === "string" ? getSectionPreset(preset) : preset;
      if (!unlocked && p && isPremiumPreset(p) && !owns(itemKey.preset(p.id))) {
        const key = itemKey.preset(p.id);
        // `unlocked` = just unlocked in the dialog (the access state has not re-rendered yet).
        requireCredit("premium-preset", { item: p.name, itemKey: key, simCost: pieceInfo(key)?.price, onUnlocked: () => addSectionRef.current(p, index, true, withContent) });
        return;
      }
      // Default: an empty skeleton (Section → Row → column); sample content only when requested.
      const node = createSectionForEditor(preset, withContent);
      if (node) placeSection(node, index);
    },
    [placeSection, owns],
  );
  const addSectionRef = useRef(addSection);
  addSectionRef.current = addSection;

  const makeElement = useCallback((pick: { elementType: string }) => {
    const def = ELEMENT_DEFINITION_BY_TYPE[pick.elementType];
    return def ? createElementNode(pick.elementType, structuredClone(def.defaults), def.label) : null;
  }, []);

  /** Adds a new node to `parentId` at `index` (default: the end). */
  const addContent = useCallback(
    (node: ComponentNode | null, parentId?: NodeId, index?: number) => {
      if (!node) {
        push(t("pm.editor.toast.unknownElement"));
        return;
      }
      const pid = parentId ?? spot?.parentId;
      if (!pid) {
        push(t("pm.editor.toast.needSectionForElement"));
        return;
      }
      const parent = findNode(root, pid);
      if (parentId === undefined && spot?.wrapId) {
        // Elements/cards in a grid or a side-by-side row: wrap first so new content goes below, not beside.
        const placed = placeBelowWrapped(root, spot.wrapId, node);
        if (!placed.id) {
          push(t("pm.editor.toast.cannotPlaceHere"));
          return;
        }
        editRoot(() => placed.root);
        setSelectedId(node.id);
        push(t("pm.editor.toast.addedTo", { name: node.name, parent: findParent(placed.root, node.id)?.parent.name ?? "" }));
        return;
      }
      const at = index ?? (parentId === undefined && spot ? spot.index : parent && isBox(parent) ? parent.children.length : 0);
      if (insert(node, pid, at))
        push(parent ? t("pm.editor.toast.addedTo", { name: node.name, parent: parent.name }) : t("pm.editor.toast.addedToPage", { name: node.name }));
    },
    [root, spot, insert, editRoot, push, t],
  );

  const addContentRef = useRef(addContent);
  addContentRef.current = addContent;

  /** Adds an element from the library. Premium element → credit dialog (not added). */
  const addElement = useCallback(
    (pick: { elementType: string }, parentId?: NodeId, index?: number) => {
      const def = ELEMENT_DEFINITION_BY_TYPE[pick.elementType];
      if (def?.premium && !owns(itemKey.element(def.type))) {
        requireCredit("premium-element", {
          item: def.label,
          itemKey: itemKey.element(def.type),
          simCost: pieceInfo(itemKey.element(def.type))?.price,
          onUnlocked: () => addContentRef.current(makeElement(pick), parentId, index),
        });
        return;
      }
      addContent(makeElement(pick), parentId, index);
    },
    [addContent, makeElement, owns],
  );

  /** One entry point for every drop (canvas & tree). */
  const applyDrop = useCallback(
    (parentId: NodeId, index: number, payload: DragPayload) => {
      switch (payload.kind) {
        case "node": {
          const node = findNode(root, payload.id);
          if (!node) return;
          if (!canMoveInto(root, payload.id, parentId)) {
            push(t("pm.editor.toast.cannotMoveIntoSelf"));
            return;
          }
          const moved = movePageNode(root, payload.id, parentId, index);
          if (moved === root) {
            if (!isSection(node) && !isRow(node) && parentId === ROOT_ID) push(t("pm.editor.toast.pageOnlySectionsShort"));
            else if (isSection(node) || isRow(node)) push(isSection(node) ? t("pm.editor.toast.sectionOnlyInPage") : t("pm.editor.toast.rowOnlyInSection"));
            return;
          }
          editRoot((r) => movePageNode(r, payload.id, parentId, index));
          setSelectedId(payload.id);
          return;
        }
        case "element":
          return addElement(payload, parentId, index);
        case "box":
          return addContent(createBox(payload.layout, {}, (findNode(root, parentId) as BoxNode | null)?.layout), parentId, index);
        case "row": {
          const row = createRowVariant(payload.variant);
          if (row) insert(row, parentId, index);
          return;
        }
        case "section": {
          if (isPremiumPreset(payload.presetId) && !owns(itemKey.preset(payload.presetId))) {
            return addSection(payload.presetId, parentId === ROOT_ID ? index : root.children.length);
          }
          const node = createSectionForEditor(payload.presetId);
          if (node) insert(node, ROOT_ID, parentId === ROOT_ID ? index : root.children.length);
        }
      }
    },
    [root, editRoot, push, addContent, addElement, insert, owns, addSection, t],
  );

  const handleDelete = useCallback(
    (id: NodeId) => {
      if (id === ROOT_ID) return;
      const node = findNode(root, id);
      const loc = findParent(root, id);
      if (!node || !loc) return;
      editRoot((r) => removeNode(r, id));
      setSelectedId(loc.parent.id);
      push(t("pm.editor.toast.deleted", { name: node.name }), { label: t("pm.editor.toast.undo"), run: history.undo });
    },
    [root, editRoot, push, history.undo, t],
  );

  const handleDuplicate = useCallback(
    (id: NodeId) => {
      const res = duplicateBelow(root, id);
      if (!res.newId) return;
      editRoot(() => res.root);
      setSelectedId(res.newId);
    },
    [root, editRoot],
  );

  const handleMove = useCallback((id: NodeId, delta: -1 | 1) => editRoot((r) => moveBy(r, id, delta)), [editRoot]);
  const handleRename = useCallback(
    (id: NodeId, name: string) => {
      const clean = name.trim();
      if (clean) editRoot((r) => updateNode(r, id, (n) => ({ ...n, name: clean })), `rename:${id}`);
    },
    [editRoot],
  );

  const openSettings = useCallback((id: NodeId) => {
    setSelectedId(id);
    setSettingsOpen(true);
  }, []);
  const openAdd = useCallback((boxId: NodeId | null, after = false, tab?: AddTab) => {
    setAddTarget(boxId ? { id: boxId, after } : null);
    if (tab) setAddTab(tab);
    setAddOpen(true);
  }, []);

  /** New Row. `baseId`: a section (→ end of the section) or a node inside a Row (→ right below that Row). */
  const addRow = useCallback(
    (variantId: string, baseId?: NodeId | null) => {
      const id = baseId ?? rowBaseId;
      // In a specialty column (Specialty): a new inner Row goes right below that inner Row (Divi style).
      if (id && innerRowSpot(root, id)) {
        const inner = placeInnerRow(root, id, variantId);
        if (inner.id) {
          editRoot(() => inner.root);
          setSelectedId(inner.id);
          push(t("pm.editor.toast.rowAddedBelow"));
          return;
        }
      }
      const row = createRowVariant(variantId);
      const base = id ? findNode(root, id) : null;
      if (!row || !base) {
        push(t("pm.editor.toast.needSectionForRow"));
        return;
      }
      const host = isBox(base) ? base : (findParent(root, base.id)?.parent ?? null);
      if (!host) return;
      const res = placeNode(root, host.id, host.children.length, row);
      if (!res.id) {
        push(t("pm.editor.toast.rowOnlyInSectionAdd"));
        return;
      }
      editRoot((r) => placeNode(r, host.id, host.children.length, row).root);
      setSelectedId(row.id);
      push(isSection(host) ? t("pm.editor.toast.rowAddedTo", { name: host.name }) : t("pm.editor.toast.rowAddedBelow"));
    },
    [root, rowBaseId, editRoot, push, t],
  );

  /* ---------------- handler Inspector ---------------- */
  const inspector: InspectorHandlers = useMemo(
    () => ({
      select,
      rename: handleRename,
      ...buildEditHandlers({
        editRoot,
        resetBox: (n, isRoot) => {
          if (isRoot) return { ...createPageRoot(), id: n.id, name: n.name, children: n.children };
          const fresh = n.section ? createSectionFromPreset("single")! : n.row ? createRow() : createBox(n.layout);
          return { ...fresh, layout: n.section ? fresh.layout : n.layout, id: n.id, name: n.name, place: n.place, children: n.children };
        },
      }),
      duplicate: handleDuplicate,
      remove: handleDelete,
      wrap: (id) => {
        const res = wrapInBox(root, id, "stack");
        if (res.boxId) {
          editRoot(() => res.root);
          setSelectedId(res.boxId);
        }
      },
      unwrap: (id) => {
        const loc = findParent(root, id);
        editRoot((r) => unwrapBox(r, id));
        setSelectedId(loc ? loc.parent.id : ROOT_ID);
      },
    }),
    [select, handleRename, editRoot, handleDuplicate, handleDelete, root],
  );

  /** "JavaScript (Event)" section for interactive elements. */
  const advancedSection = useCallback(
    (n: ComponentNode): PanelSection => ({
      id: "advanced",
      label: t("pm.editor.advancedSection"),
      icon: Braces,
      content: (
        <AdvancedPanel
          node={n}
          root={root}
          onChange={(advanced, key) =>
            isBox(n) ? inspector.patchBox(n.id, { advanced }, key) : inspector.patchElement(n.id, { advanced }, key)
          }
        />
      ),
    }),
    [inspector, root, t],
  );

  /** v9: CSS animations (no library); empty values follow Global Settings. */
  const animationSection = useCallback(
    (n: ComponentNode): PanelSection => ({
      id: "animation",
      label: t("pm.anim.section"),
      icon: Sparkles,
      content: <AnimationPanel node={n} onChange={(anim, key) => (isBox(n) ? inspector.patchBox(n.id, { anim }, key) : inspector.patchElement(n.id, { anim }, key))} />,
    }),
    [inspector, t],
  );

  /** Adds/removes a CDN library (stored in root.libraries; included in the exported code). */
  const installed = useMemo(() => root.libraries ?? [], [root.libraries]);
  const toggleLibrary = useCallback(
    (id: LibraryId) =>
      editRoot((r) => {
        const cur = r.libraries ?? [];
        const next = cur.includes(id) ? cur.filter((x) => x !== id) : LIBRARY_IDS.filter((x) => x === id || cur.includes(x));
        const out: BoxNode = { ...r, libraries: next };
        if (!next.length) delete out.libraries;
        return out;
      }, `libs:${id}`),
    [editRoot],
  );
  const librarySection = useCallback(
    (n: ComponentNode): PanelSection => ({
      id: "library",
      label: t("pm.library.section"),
      icon: Library,
      content: (
        <NodeLibraryPanel
          node={n}
          installed={installed}
          onInstall={toggleLibrary}
          onChange={(libs, key) => (isBox(n) ? inspector.patchBox(n.id, { libs }, key) : inspector.patchElement(n.id, { libs }, key))}
        />
      ),
    }),
    [inspector, installed, toggleLibrary, t],
  );

  // Per-element JavaScript events were removed from edit mode: extra JavaScript
  // is written in full in Custom JavaScript (Advanced). Old events are moved there
  // when the design is opened (see migrate.ts).
  /** CRUD preview: Settings › Data collection (Row/card group) and notes on collection cards. */
  const openCollection = useCallback(
    (boxId: NodeId) => {
      flush();
      setCrudOpen({ key: `${design.activeDesignId ?? ""}:${boxId}` });
    },
    [flush, design.activeDesignId],
  );
  const collectionSection = useCallback(
    (b: BoxNode): PanelSection | null =>
      b.collection || canBecomeCollection(b)
        ? {
            id: "collection",
            label: t("crud.panel.section"),
            icon: Database,
            lead: !!b.collection,
            content: (
              <CollectionBoxPanel
                box={b}
                onMark={(name) => {
                  editRoot((r) => markCollection(r, b.id, name));
                  push(t("crud.toast.marked", { name }), { label: t("crud.panel.open"), run: () => openCollection(b.id) });
                }}
                onUnmark={() => {
                  editRoot((r) => unmarkCollection(r, b.id));
                  push(t("crud.toast.unmarked"), { label: t("pm.editor.toast.undo"), run: history.undo });
                }}
                onOpen={() => openCollection(b.id)}
              />
            ),
          }
        : null,
    [editRoot, push, t, openCollection, history.undo],
  );
  /** Item page preview: detail box panel, related cards, and element bindings. */
  const itemSections = useCallback(
    (b: BoxNode): PanelSection[] => {
      if (b.id === ROOT_ID || b.collection || !crudCols.length) return [];
      const out: PanelSection[] = [];
      const pageHasItem = !!itemBoxIn(root);
      if (b.itemOf || (!pageHasItem && !b.related && canBeItemBox(b) && !collectionAncestor(root, b.id)))
        out.push({
          id: "item-page",
          label: t("crud.item.section"),
          icon: FileText,
          lead: !!b.itemOf,
          content: (
            <ItemBoxPanel
              box={b}
              cols={crudCols}
              onMark={(slug) => {
                const col = crudCols.find((c) => c.slug === slug);
                if (!col) return;
                editRoot((r) => markItemBox(r, b.id, col), `item-mark:${b.id}`);
                setItemPageFlag(slug, true);
              }}
              onUnmark={() => {
                const slug = b.itemOf!.collection;
                editRoot((r) => unmarkItemBox(r, b.id), `item-unmark:${b.id}`);
                const elsewhere = sitePages.some((p) => p.designId !== design.activeDesignId && itemBoxIn(pageDocOf(p.designId).root)?.itemOf?.collection === slug);
                if (!elsewhere) setItemPageFlag(slug, false);
              }}
              onPreview={(itemId) => editRoot((r) => setPreviewItem(r, b.id, itemId, crudCols), `item-preview:${b.id}`)}
              onOpenData={() => {
                const e = crudEntries.find((x) => x.col.slug === b.itemOf!.collection);
                if (e) {
                  flush();
                  setCrudOpen({ key: e.key });
                }
              }}
            />
          ),
        });
      if (b.related || (pageHasItem && canBeRelated(b)))
        out.push({
          id: "related",
          label: t("crud.related.section"),
          icon: Link2,
          lead: !!b.related,
          content: (
            <RelatedPanel
              box={b}
              cols={crudCols}
              onMark={(slug) => {
                const col = crudCols.find((c) => c.slug === slug);
                if (col) editRoot((r) => markRelated(r, b.id, col), `related-mark:${b.id}`);
              }}
              onUnmark={() => editRoot((r) => unmarkRelated(r, b.id), `related-unmark:${b.id}`)}
              onLimit={(n) => editRoot((r) => setRelatedLimit(r, b.id, n, crudCols), `related-limit:${b.id}`)}
            />
          ),
        });
      if (b.filterOf || canBeFilterBar(b))
        out.push({
          id: "category-filter",
          label: t("crud.filter.section"),
          icon: Filter,
          lead: !!b.filterOf,
          content: (
            <FilterBarPanel
              box={b}
              cols={crudCols}
              onMark={(slug) => {
                const col = crudCols.find((c) => c.slug === slug);
                if (col) editRoot((r) => markFilterBar(r, b.id, col), `filter-mark:${b.id}`);
              }}
              onUnmark={() => editRoot((r) => unmarkFilterBar(r, b.id), `filter-unmark:${b.id}`)}
              onSync={() => editRoot((r) => syncFilterBars(r, crudCols), `filter-sync:${b.id}`)}
            />
          ),
        });
      return out;
    },
    [crudCols, crudEntries, root, t, editRoot, setItemPageFlag, sitePages, design.activeDesignId, pageDocOf, flush],
  );
  const elementExtras = useCallback(
    (el: ElementNode): PanelSection[] => {
      const owner = collectionAncestor(root, el.id);
      const note: PanelSection[] = owner?.collection
        ? [{ id: "collection", label: t("crud.panel.section"), icon: Database, lead: true, content: <CollectionCardNote name={owner.collection.name} onOpen={() => openCollection(owner.id)} /> }]
        : [];
      const itemOwner = itemAncestor(root, el.id);
      const bind: PanelSection[] =
        itemOwner && canBind(el)
          ? [{ id: "bind", label: t("crud.bind.section"), icon: Database, lead: true, content: <BindPanel el={el} onBind={(f) => editRoot((r) => setBinding(r, el.id, f, crudCols), `bind:${el.id}`)} /> }]
          : [];
      return [...note, ...bind, animationSection(el), librarySection(el), advancedSection(el)];
    },
    [advancedSection, animationSection, librarySection, root, t, openCollection, editRoot, crudCols],
  );
  const boxExtras = useCallback(
    (b: BoxNode): PanelSection[] => {
      if (b.id === ROOT_ID) return [];
      const col = collectionSection(b);
      const items = itemSections(b);
      const shown: PanelSection[] = b.collection
        ? [
            {
              id: "collection-display",
              label: t("crud.display.section"),
              icon: Rows3,
              content: (
                <CollectionDisplayPanel
                  col={b.collection}
                  onChange={(d) => editRoot((r) => setCollectionDisplay(r, b.id, d), `col-display:${b.id}`)}
                  onView={(v) => editRoot((r) => setCollectionView(r, b.id, v), `col-view:${b.id}`)}
                  filterBars={filterBarsIn(root).filter((x) => x.filterOf === b.collection!.slug).length}
                />
              ),
            },
          ]
        : [];
      return [...items.filter((x) => x.lead), ...(col ? [col] : []), ...shown, ...items.filter((x) => !x.lead), animationSection(b), librarySection(b), advancedSection(b)];
    },
    [advancedSection, animationSection, librarySection, collectionSection, itemSections, editRoot, t, root],
  );

  const describe = useCallback(
    (n: ComponentNode) => {
      if (isBox(n)) {
        const c = n.children.length;
        return {
          sub: isSection(n)
            ? t("pm.editor.describe.section", { count: c })
            : isRow(n)
              ? t("pm.editor.describe.row", { count: c })
              : c
                ? t("pm.editor.describe.items", { count: c })
                : t("pm.editor.describe.empty"),
        };
      }
      const r = resolveElement(n);
      if (!r.def) return { sub: t("pm.editor.describe.unknown", { type: n.elementType }), broken: true };
      return { sub: summarize(r.state) || r.def.label };
    },
    [t],
  );

  /* ---------------- pintasan keyboard ---------------- */
  const { undo, redo } = history;
  /** Used for keyboard input in the parent as well as input forwarded from the iframe. */
  const shortcut = useCallback(
    (key: string, mod: boolean, shift: boolean): boolean => {
      const k = key.toLowerCase();
      if (mod) {
        if (k === "z") (shift ? redo : undo)();
        else if (k === "y") redo();
        else return false;
        return true;
      }
      if (mode !== "design") return false;
      if ((key === "Delete" || key === "Backspace") && selectedId !== ROOT_ID) {
        handleDelete(selectedId);
        return true;
      }
      if (key === "Escape" && selectedId !== ROOT_ID) {
        setSelectedId(ROOT_ID);
        return true;
      }
      return false;
    },
    [undo, redo, handleDelete, selectedId, mode],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable);
      if (typing || el?.closest("[role=dialog],[role=alertdialog]")) return;
      if (shortcut(e.key, e.ctrlKey || e.metaKey, e.shiftKey)) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut]);

  /* ---------------- render ---------------- */
  const addPositionLabel =
    sectionAt === null
      ? ""
      : sectionAt === 0 && sectionCount > 0
        ? t("pm.editor.position.top")
        : sectionAt >= sectionCount
          ? t("pm.editor.position.end")
          : t("pm.editor.position.after", { n: sectionAt });

  const settingsTitle =
    selected.id === ROOT_ID
      ? t("pm.editor.settings.page")
      : t("pm.editor.settings.node", {
          kind: t(`pm.editor.kind.${isBox(selected) ? (isSection(selected) ? "section" : isRow(selected) ? "row" : "group") : "element"}`),
          name: selected.name,
        });

  if (siteMode && !site)
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-gray-100 p-4 dark:bg-gray-950">
        <EmptyState
          icon={FileWarning}
          title={t("studio.notFound")}
          text={t("studio.notFoundText")}
          action={
            <Link to={WEBSITE_HUB_PATH} className={btn.primary}>
              {t("flow.hub")}
            </Link>
          }
          testId="studio-missing"
        />
      </div>
    );

  const exitStudio = () => {
    flush();
    localeNavigate(WEBSITE_HUB_PATH);
  };

  return (
    <PieceAccessProvider value={pieceAccess}>
      <div className="fixed inset-0 z-40 flex flex-col bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-white/90" data-testid={siteMode ? "studio" : "page-maker"}>
        {/* ---------- Studio: website bar (pages, Site, Submissions, Deploy) ---------- */}
        {siteMode && site && (
          <StudioBar
            siteName={site.name}
            pages={sitePages}
            currentId={design.activeDesignId}
            saveTarget={saveTarget}
            dirty={design.isDirty}
            boardOpen={boardOpen}
            kirimanOpen={kirimanOpen}
            sitePanelOpen={sitePanelOpen}
            onExit={exitStudio}
            onOpenPage={openPage}
            onAddPage={() => setAddPageOpen(true)}
            onToggleBoard={() => setBoardOpen((v) => !v)}
            onOpenSitePanel={() => setSitePanelOpen(true)}
            onToggleSitePanel={() => setSitePanelOpen((v) => !v)}
            onToggleKiriman={() => setKirimanOpen((v) => !v)}
            onDeploy={() => {
              flush();
              setDeployOpen(true);
            }}
          />
        )}
        {/* ---------- top bar ---------- */}
        <EditorHeader
          siteMode={siteMode}
          pageTitle={currentPage?.title ?? null}
          dirty={design.isDirty}
          designsOpen={designsOpen}
          layersOpen={layersOpen}
          viewport={viewport}
          mode={mode}
          canUndo={history.canUndo}
          canRedo={history.canRedo}
          crudCount={crudEntries.length}
          sectionCount={sectionCount}
          nextStepPath={nextStepPath}
          onExit={() => guard.request({ kind: "exit" })}
          onToggleDesigns={() => setDesignsOpen((v) => !v)}
          onViewport={setViewport}
          onUndo={undo}
          onRedo={redo}
          onToggleLayers={() => setLayersOpen((v) => !v)}
          onPageSettings={() => openSettings(ROOT_ID)}
          onOpenCrud={() => {
            flush();
            setCrudOpen({ key: null });
          }}
          onMode={setMode}
          onAdd={() => (sectionCount === 0 ? setSectionAt(0) : openAdd(null))}
        />

        {exported.warnings.length > 0 && (
          <div role="alert" className="flex shrink-0 items-center gap-2 border-b border-amber-200 bg-amber-50 px-4 py-1.5 text-xs text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            <span className="min-w-0 truncate">{exported.warnings[0].message}{exported.warnings.length > 1 ? ` ${t("pm.editor.moreWarnings", { count: exported.warnings.length - 1 })}` : ""}</span>
          </div>
        )}

        {/* ---------- main area: 100% width ---------- */}
        <main className="relative min-h-0 flex-1">
          {mode === "design" && (
            <BuilderCanvas
              root={root}
              selectedId={selectedId}
              viewportWidth={viewportWidth}
              css={preview.html.css}
              body={preview.html.body}
              script={preview.html.script}
              libraries={preview.libraries}
              onSelect={select}
              onOpenSettings={openSettings}
              onAddTo={(id) => openAdd(id, false, "element")}
              onAddAfter={(id) => openAdd(id, true, "element")}
              onAddRowAfter={(id) => {
                // Like Divi: (+) Row opens the column structure options, and the result goes right below.
                setSelectedId(id);
                openAdd(id, false, "row");
              }}
              onAddSection={(i) => setSectionAt(i)}
              onMove={handleMove}
              onDuplicate={handleDuplicate}
              onDelete={handleDelete}
              onDrop={(res, payload) => applyDrop(res.parentId, res.index, payload)}
              onKey={(k, m, sh) => void shortcut(k, m, sh)}
              reveal={reveal}
            />
          )}

          {mode === "preview" && (
            <PagePreview css={exported.html.css} body={exported.html.body} script={exported.html.script} libraries={exported.libraries} viewportWidth={viewportWidth} onNavigate={siteMode ? openPage : undefined} />
          )}

          {siteMode && site && boardOpen && (
            <PageBoard
              siteName={site.name}
              pages={sitePages}
              currentId={design.activeDesignId}
              render={(id) => boardThumbs.get(id) ?? null}
              actions={{
                onOpen: openPage,
                onAdd: () => setAddPageOpen(true),
                onRename: renamePage,
                onSetHome: (id) => siteDoc && saveSite(setHomepage(siteDoc, id)),
                onToggleHidden: (id) => {
                  if (!siteDoc) return;
                  const p = siteDoc.pages.find((x) => x.designId === id);
                  saveSite(setHidden(siteDoc, id, !p?.hidden));
                },
                onDuplicate: (id) => createPage({ name: t("studio.copyName", { name: sitePages.find((p) => p.designId === id)?.title ?? "" }), copyFrom: id }),
                onDelete: (id) => setDeletePageId(id),
                onMove: (id, to) => siteDoc && saveSite(movePage(siteDoc, id, to)),
                onSyncChrome: syncChrome,
                onClose: () => setBoardOpen(false),
              }}
            />
          )}

          {mode === "code" && (
            <div className="grid h-full grid-cols-1 lg:grid-cols-2">
              <div className="h-[45vh] min-h-0 border-b border-gray-200 lg:h-full lg:border-b-0 lg:border-r dark:border-gray-800">
                <PagePreview css={exported.html.css} body={exported.html.body} script={exported.html.script} libraries={exported.libraries} viewportWidth={viewportWidth} />
              </div>
              <div className="min-h-0 overflow-y-auto bg-white p-3 dark:bg-gray-900" data-testid="code-pane">
                <CodeExportPanel
                  header={
                    <CrudExportBar
                      collections={crudCols.map((c) => c.name)}
                      enabled={includeCrud}
                      stack={crudStack}
                      active={crudActive}
                      onToggle={(on) => {
                        setIncludeCrud(on);
                        if (on) setFramework(frameworkForStack(crudStack));
                      }}
                      onStack={(st) => {
                        setCrudStack(st);
                        setFramework(frameworkForStack(st));
                      }}
                    />
                  }
                  packAs={crudActive && crudStack === "express" ? "express" : undefined}
                  framework={framework}
                  onFrameworkChange={setFramework}
                  files={files}
                  zipBaseName={`${builtSite ? siteZipName(site?.name ?? projectTitle) : cls}${crudActive ? "-crud" : ""}`}
                  codeMaxHeightClass="max-h-[calc(100vh-17rem)] min-h-60"
                  source={builtSite && site ? { kind: "site", id: site.id } : design.activeDesignId && !design.isDirty ? { kind: "page", id: design.activeDesignId, rootClass: cls } : null}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  {t("pm.editor.codeSummary", { sections: sectionCount, elements: elementCount })}
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ---------- popup ---------- */}
        {mode === "design" && addOpen && (
          <FloatingPanel
            title={t("pm.editor.addTo", { target: targetLabel })}
            storageKey="add"
            width={400}
            onClose={() => setAddOpen(false)}
            initial={(vw) => ({ x: vw - 416, y: 64 })}
            testId="add-panel"
          >
            <AddPanel
              icons={icons}
              targetLabel={targetLabel}
              locked={sectionCount === 0}
              tab={addTab}
              onTab={setAddTab}
              rowLabel={rowLabel}
              onAddRow={(v) => addRow(v)}
              onCreateSection={() => setSectionAt(0)}
              onAddElement={(p: LibraryPick) => addElement(p)}
              libraries={installed}
              onToggleLibrary={toggleLibrary}
              onAddBox={(layout: BoxLayout) =>
                addContent(createBox(layout, {}, spotLayout))
              }
            />
          </FloatingPanel>
        )}

        {mode === "design" && settingsOpen && (
          <FloatingPanel
            title={settingsTitle}
            storageKey="settings"
            width={380}
            onClose={() => setSettingsOpen(false)}
            initial={() => ({ x: 16, y: 72 })}
            testId="settings-panel"
          >
            <Inspector
              root={root}
              node={selected}
              elementExtras={elementExtras}
              boxExtras={boxExtras}
              classNameField={{ value: className, onChange: setClassName, placeholder: DEFAULT_PAGE_CLASS_NAME, effective: cls }}
              on={inspector}
            />
          </FloatingPanel>
        )}

        {mode === "design" && layersOpen && (
          <FloatingPanel
            title={t("pm.editor.structureTitle")}
            storageKey="layers"
            width={340}
            onClose={() => setLayersOpen(false)}
            initial={() => ({ x: 16, y: 120 })}
            testId="layers-panel"
          >
            <div className="-m-3 h-[min(60vh,520px)]">
              <StructureTree
                root={root}
                selectedId={selectedId}
                flashId={null}
                describe={describe}
                onSelect={(id) => setSelectedId(id)}
                onHover={() => {}}
                onDrop={(drop, payload) => applyDrop(drop.parentId, drop.index, payload)}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onMove={handleMove}
                onRename={handleRename}
                onAddBox={(layout) => addContent(createBox(layout, {}, spotLayout))}
              />
            </div>
          </FloatingPanel>
        )}

        {designsOpen && (
          <FloatingPanel
            title={t("pm.editor.myDesigns")}
            storageKey="designs"
            width={560}
            onClose={() => setDesignsOpen(false)}
            initial={() => ({ x: 120, y: 64 })}
            testId="designs-panel"
          >
            <DesignManagerBar
              design={design}
              extra={
                <div data-testid="website-link" className="flex flex-wrap items-center gap-2 rounded bg-blue-50 dark:bg-blue-900/10 px-3 py-2 text-xs text-blue-900 dark:text-blue-300">
                  <Globe size={14} className="shrink-0" />
                  <span className="flex-1 min-w-0">
                    {t("pm.editor.website.before")}<b>{t("pm.editor.website.folder")}</b>
                    {t("pm.editor.website.after", { count: siteDocs.length })}
                  </span>
                  <Link to="/website" className="font-semibold underline">{t("pm.editor.website.manage")}</Link>
                </div>
              }
            />
          </FloatingPanel>
        )}

        {sectionAt !== null && (
          <SectionPicker
            positionLabel={addPositionLabel}
            onClose={() => setSectionAt(null)}
            onPick={(p, withContent) => addSection(p, sectionAt, false, withContent)}
            // Full Width: pick an element right away (as Divi asks for a full-width module).
            onCreate={(node, kind) => placeSection(node, sectionAt, kind === "fullwidth")}
          />
        )}

        {siteMode && site && siteDoc && (
          <>
            {addPageOpen && <AddPageDialog pages={sitePages} hasChrome={!!homeDoc && (!!headerOf(homeDoc) || !!footerOf(homeDoc))} onCancel={() => setAddPageOpen(false)} onCreate={createPage} />}
            {sitePanelOpen && (
              <FloatingPanel title={t("studio.siteTitle")} storageKey="studio-site" width={420} onClose={() => setSitePanelOpen(false)} initial={(vw) => ({ x: vw - 436, y: 104 })} testId="studio-site-popup">
                <SitePanel siteName={site.name} doc={siteDoc} pages={sitePages} onRename={(n) => useDesignStore.getState().renameDesign(SITE_TYPE, site.id, n)} onChange={saveSite} />
              </FloatingPanel>
            )}
            {kirimanOpen && (
              <FloatingPanel title={t("kiriman.title")} storageKey="studio-kiriman" width={460} onClose={() => setKirimanOpen(false)} initial={(vw) => ({ x: vw - 476, y: 104 })} testId="studio-kiriman-popup">
                <SubmissionsPanel projectType="site" projectId={site.id} projectName={site.name} />
              </FloatingPanel>
            )}
            {deployOpen && <StudioDeployDialog site={site} designs={pageDesigns} onClose={() => setDeployOpen(false)} />}
            {deletePageId && (
              <Modal
                open
                size="sm"
                alert
                onClose={() => setDeletePageId(null)}
                icon={<Trash2 className="h-5 w-5" />}
                title={t("studio.deleteTitle", { name: sitePages.find((p) => p.designId === deletePageId)?.title ?? "" })}
                description={t("studio.deleteText")}
                testId="studio-delete-dialog"
                footer={
                  <>
                    <button type="button" className={btn.secondary} onClick={() => setDeletePageId(null)}>
                      {t("common.cancel")}
                    </button>
                    <button type="button" className={btn.danger} onClick={confirmDeletePage} data-testid="studio-delete-confirm">
                      {t("common.delete")}
                    </button>
                  </>
                }
              />
            )}
          </>
        )}

        {crudOpen && (
          <CollectionDashboard
            entries={crudEntries}
            initialKey={crudOpen.key}
            onChange={changeCollection}
            onClose={() => setCrudOpen(null)}
            onLocate={(e) => {
              const pageId = e.key.slice(0, e.key.indexOf(":"));
              setCrudOpen(null);
              if (siteMode && pageId && pageId !== design.activeDesignId) openPage(pageId);
              setMode("design");
              // After the page loads: select the collection Row and open Settings.
              setTimeout(() => {
                openSettings(e.boxId);
                setReveal((r) => ({ id: e.boxId, n: (r?.n ?? 0) + 1 }));
              }, 0);
            }}
            onDeploy={
              siteMode && site
                ? () => {
                    setCrudOpen(null);
                    flush();
                    setDeployOpen(true);
                  }
                : undefined
            }
          />
        )}
        <Toasts toasts={toasts} dismiss={dismiss} />
        {guard.pending && (
          <LeaveDialog
            needsName={!design.activeDesign}
            defaultName={design.designNameInput.trim() || t("pm.editor.untitled")}
            onSaveAndLeave={(name) => {
              const target = guard.pending!;
              const ok = design.activeDesign ? design.handleSaveChanges() : !!design.handleSaveNew(name);
              if (ok) guard.leave(target);
              return ok;
            }}
            onLeave={() => guard.leave(guard.pending!)}
            onCancel={guard.cancel}
          />
        )}
        <CreditDialog />
        <DesignLimitDialog />
      </div>
    </PieceAccessProvider>
  );
}

