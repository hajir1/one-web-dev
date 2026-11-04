import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type DragEvent, type ReactNode } from "react";
import type { LibraryId } from "../engine/helpers/libraries";
import { useTranslation } from "react-i18next";
import { ArrowUpToLine, ChevronDown, ChevronUp, Copy, GripVertical, Layers, ListPlus, Plus, Settings2, Trash2 } from "lucide-react";
import { isBox, type BoxNode, type NodeId } from "../engine/helpers/componentTypes";
import { findNode, findParent } from "../engine/helpers/tree";
import { currentDrag, endDrag, getDragSnapshot, startDrag, subscribeDrag, type DragPayload } from "../engine/helpers/dnd";
import { resolveDrop, type DropResolution, type Rect, type RectMap } from "../helpers/dropTarget";
import { isInnerRow, isRow, isSection } from "../helpers/pageDoc";

/** A Row or an inner Row (special column); both have a (+) "Row below". */
const isRowLike = (n: Parameters<typeof isRow>[0]) => isRow(n) || isInnerRow(n);
import PageFrame from "./PageFrame";

/* ================================================================== */
/* Builder canvas: the page iframe + overlays in the parent             */
/*                                                                    */
/* Overlays (outline, toolbar, + buttons, drop markers) are drawn in the parent */
/* DOM based on the boxes the iframe reports, so there are no extra     */
/* elements inside the page (the output code = exactly the preview content). */
/* ================================================================== */

interface CanvasActions {
  onSelect: (id: NodeId) => void;
  onOpenSettings: (id: NodeId) => void;
  /** (+) inside a container: adds an element / component into it. */
  onAddTo: (boxId: NodeId) => void;
  /** (+) on an element / group: adds content RIGHT below it (the next sibling). */
  onAddAfter: (id: NodeId) => void;
  /** (+) on a Row: adds a new Row right below it. On a section: adds a Row at the end of the section. */
  onAddRowAfter: (id: NodeId) => void;
  onAddSection: (index: number) => void;
  onMove: (id: NodeId, delta: -1 | 1) => void;
  onDuplicate: (id: NodeId) => void;
  onDelete: (id: NodeId) => void;
  onDrop: (res: DropResolution, payload: DragPayload) => void;
}

interface BuilderCanvasProps extends CanvasActions {
  root: BoxNode;
  selectedId: NodeId;
  /** Simulated viewport width (px); null = canvas width. */
  viewportWidth: number | null;
  css: string;
  body: string;
  script: string;
  /** Design libraries; on the canvas only the edit-mode-safe ones (Chart.js) load. */
  libraries?: readonly LibraryId[];
  /** Keyboard shortcuts coming from inside the iframe. */
  onKey: (key: string, mod: boolean, shift: boolean) => void;
  /** Scrolls to this node (e.g. "View on page" from the Data dashboard); `n` increments per request. */
  reveal?: { id: NodeId; n: number } | null;
}

const TONE = {
  section: { ring: "#2563eb", bg: "bg-blue-600", soft: "rgba(37,99,235,.08)" },
  row: { ring: "#7c3aed", bg: "bg-violet-600", soft: "rgba(124,58,237,.08)" },
  box: { ring: "#059669", bg: "bg-emerald-600", soft: "rgba(5,150,105,.08)" },
  element: { ring: "#475569", bg: "bg-slate-700", soft: "rgba(71,85,105,.08)" },
} as const;

const toneOf = (root: BoxNode, id: NodeId) => {
  const n = findNode(root, id);
  return !n ? TONE.element : isBox(n) ? (isSection(n) ? TONE.section : isRowLike(n) ? TONE.row : TONE.box) : TONE.element;
};

const TB_BTN =
  "inline-flex h-6 w-6 items-center justify-center rounded text-white/90 hover:bg-white/20 hover:text-white focus-visible:outline-2 focus-visible:outline-white disabled:opacity-40 disabled:hover:bg-transparent";

function Abs({ rect, className = "", style, children }: { rect: Rect; className?: string; style?: React.CSSProperties; children?: ReactNode }) {
  return (
    <div
      className={`absolute ${className}`}
      style={{ left: rect.x, top: rect.y, width: rect.w, height: rect.h, ...style }}
    >
      {children}
    </div>
  );
}

export default function BuilderCanvas(props: BuilderCanvasProps) {
  const { root, selectedId, viewportWidth, css, body, script, libraries, onSelect, onOpenSettings, onAddTo, onAddAfter, onAddRowAfter, onAddSection, onMove, onDuplicate, onDelete, onDrop, onKey, reveal } = props;
  const { t } = useTranslation();

  const scrollRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [rects, setRects] = useState<RectMap>({});
  const [contentH, setContentH] = useState(0);
  const [stageH, setStageH] = useState(0);
  const [wrapW, setWrapW] = useState(0);
  const [hoverId, setHoverId] = useState<NodeId | null>(null);
  const hoverTimer = useRef<number | null>(null);
  const [drop, setDrop] = useState<DropResolution | null>(null);
  const dragging = useSyncExternalStore(subscribeDrag, getDragSnapshot);

  /* ---- area size ---- */
  useLayoutEffect(() => {
    const sc = scrollRef.current;
    const wr = wrapRef.current;
    if (!sc || !wr) return;
    const m = () => {
      setStageH(sc.clientHeight);
      setWrapW(wr.clientWidth);
    };
    m();
    const ro = new ResizeObserver(m);
    ro.observe(sc);
    ro.observe(wr);
    return () => ro.disconnect();
  }, []);

  useEffect(() => () => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
  }, []);

  /* ---- scroll to the node (once per request, after its position is known) ---- */
  const revealed = useRef(0);
  useEffect(() => {
    if (!reveal || revealed.current === reveal.n) return;
    const r = rects[reveal.id];
    const sc = scrollRef.current;
    const wr = wrapRef.current;
    if (!r || !sc || !wr) return;
    revealed.current = reveal.n;
    const top = wr.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop + r.y;
    sc.scrollTo({ top: Math.max(0, top - 96), behavior: "smooth" });
  }, [reveal, rects]);

  /** Hover is released with a delay so the pointer has time to move to the toolbar. */
  const setHover = useCallback((id: NodeId | null) => {
    if (hoverTimer.current) window.clearTimeout(hoverTimer.current);
    if (id) setHoverId(id);
    else hoverTimer.current = window.setTimeout(() => setHoverId(null), 220);
  }, []);

  const sectionCount = root.children.length;
  const empty = sectionCount === 0;
  const frameH = Math.max(contentH, stageH - 76, 240);

  /* ---- drag & drop ---- */
  const toPoint = (e: DragEvent) => {
    const r = wrapRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const autoScroll = (e: DragEvent) => {
    const sc = scrollRef.current;
    if (!sc) return;
    const r = sc.getBoundingClientRect();
    const edge = 64;
    if (e.clientY < r.top + edge) sc.scrollBy({ top: -18 });
    else if (e.clientY > r.bottom - edge) sc.scrollBy({ top: 18 });
  };
  const onDragOver = (e: DragEvent) => {
    const payload = currentDrag(e);
    if (!payload) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = payload.kind === "node" ? "move" : "copy";
    autoScroll(e);
    setDrop(resolveDrop(root, rects, toPoint(e), payload));
  };
  const onDropHere = (e: DragEvent) => {
    const payload = currentDrag(e);
    e.preventDefault();
    const res = payload ? resolveDrop(root, rects, toPoint(e), payload) : null;
    setDrop(null);
    endDrag();
    if (payload && res) onDrop(res, payload);
  };
  useEffect(() => {
    if (!dragging) setDrop(null);
  }, [dragging]);

  /* ---- overlay ---- */
  const selRect = selectedId !== root.id ? rects[selectedId] : undefined;
  const hovRect = hoverId && hoverId !== selectedId && hoverId !== root.id ? rects[hoverId] : undefined;
  const selNode = findNode(root, selectedId);
  const parentOfSel = selNode ? findParent(root, selectedId) : null;
  const siblings = parentOfSel?.parent.children.length ?? 0;
  const selIndex = parentOfSel?.index ?? 0;

  const toolbar = (() => {
    if (!selRect || !selNode || dragging) return null;
    const tone = toneOf(root, selectedId);
    const isSec = isSection(selNode);
    const isRowSel = isRowLike(selNode);
    const flip = selRect.x + 320 > wrapW; // near the right edge → align right
    const above = selRect.y >= 30;
    return (
      <div
        data-testid="node-toolbar"
        className={`pointer-events-auto absolute z-20 flex items-center gap-0.5 rounded-md px-1 py-0.5 text-xs font-medium text-white shadow-lg ${tone.bg}`}
        style={{
          top: above ? selRect.y - 28 : selRect.y + 4,
          ...(flip ? { right: Math.max(4, wrapW - (selRect.x + selRect.w)) } : { left: Math.max(4, selRect.x) }),
        }}
        onMouseEnter={() => setHover(selectedId)}
      >
        <span className="max-w-40 truncate px-1.5" title={selNode.name}>
          {selNode.name}
        </span>
        <button
          type="button"
          draggable
          aria-label={t("pm.canvas.drag")}
          title={t("pm.canvas.drag")}
          onDragStart={(e) => startDrag(e, { kind: "node", id: selectedId }, selNode.name)}
          onDragEnd={endDrag}
          className={`${TB_BTN} cursor-grab active:cursor-grabbing`}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label={t("pm.canvas.settings")} title={t("pm.canvas.settings")} onClick={() => onOpenSettings(selectedId)} className={TB_BTN}>
          <Settings2 className="h-3.5 w-3.5" />
        </button>
        {isSec && (
          <button type="button" data-testid="tb-add-row" aria-label={t("pm.canvas.addRow")} title={t("pm.canvas.addRowInSection")} onClick={() => onAddRowAfter(selectedId)} className={TB_BTN}>
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
        {isRowSel && (
          <>
            <button type="button" data-testid="tb-add-row-below" aria-label={t("pm.canvas.addRowBelow")} title={t("pm.canvas.addRowBelowTitle")} onClick={() => onAddRowAfter(selectedId)} className={TB_BTN}>
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button type="button" data-testid="tb-add-in" aria-label={t("pm.canvas.addToRow")} title={t("pm.canvas.addToRowTitle")} onClick={() => onAddTo(selectedId)} className={TB_BTN}>
              <ListPlus className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        {!isSec && !isRowSel && isBox(selNode) && (
          <>
            <button type="button" data-testid="tb-add-in" aria-label={t("pm.canvas.addHere")} title={t("pm.canvas.addHereTitle")} onClick={() => onAddTo(selectedId)} className={TB_BTN}>
              <ListPlus className="h-3.5 w-3.5" />
            </button>
            <button type="button" data-testid="tb-add-below" aria-label={t("pm.canvas.addBelow")} title={t("pm.canvas.addBelowContainer")} onClick={() => onAddAfter(selectedId)} className={TB_BTN}>
              <Plus className="h-3.5 w-3.5" />
            </button>
          </>
        )}
        {!isBox(selNode) && (
          <button type="button" data-testid="tb-add-below" aria-label={t("pm.canvas.addBelow")} title={t("pm.canvas.addBelowElement")} onClick={() => onAddAfter(selectedId)} className={TB_BTN}>
            <Plus className="h-3.5 w-3.5" />
          </button>
        )}
        <button type="button" aria-label={t("pm.canvas.up")} title={t("pm.canvas.upTitle")} disabled={selIndex === 0} onClick={() => onMove(selectedId, -1)} className={TB_BTN}>
          <ChevronUp className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label={t("pm.canvas.down")} title={t("pm.canvas.downTitle")} disabled={selIndex >= siblings - 1} onClick={() => onMove(selectedId, 1)} className={TB_BTN}>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
        <button type="button" aria-label={t("pm.canvas.duplicate")} title={t("pm.canvas.duplicate")} onClick={() => onDuplicate(selectedId)} className={TB_BTN}>
          <Copy className="h-3.5 w-3.5" />
        </button>
        {!isSec && parentOfSel && (
          <button type="button" aria-label={t("pm.canvas.selectParent")} title={t("pm.canvas.selectParent")} onClick={() => onSelect(parentOfSel.parent.id)} className={TB_BTN}>
            <ArrowUpToLine className="h-3.5 w-3.5" />
          </button>
        )}
        <button type="button" aria-label={t("common.delete")} title={t("common.delete")} onClick={() => onDelete(selectedId)} className={TB_BTN}>
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  })();

  /** The + button in the middle of an empty container. */
  const emptyPlus: ReactNode[] = [];
  const visit = (n: BoxNode) => {
    for (const c of n.children) if (isBox(c)) visit(c);
    if (n.id === root.id || n.children.length > 0) return;
    const r = rects[n.id];
    if (!r || r.h < 24) return;
    const secEmpty = isSection(n);
    emptyPlus.push(
      <Abs key={n.id} rect={r} className="pointer-events-none flex items-center justify-center" style={{ border: "1px dashed rgba(100,116,139,.55)" }}>
        <button
          type="button"
          data-testid={`add-${n.id}`}
          aria-label={secEmpty ? t("pm.canvas.addRowTo", { name: n.name }) : t("pm.canvas.addElementTo", { name: n.name })}
          title={secEmpty ? t("pm.canvas.addRowToTitle", { name: n.name }) : t("pm.canvas.addElementToTitle", { name: n.name })}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(n.id);
            if (secEmpty) onAddRowAfter(n.id);
            else onAddTo(n.id);
          }}
          className={`pointer-events-auto inline-flex items-center justify-center rounded-full text-white shadow-md transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            secEmpty ? "h-8 gap-1 bg-violet-600 px-3 text-xs font-semibold hover:bg-violet-700 focus-visible:outline-violet-600" : "h-8 w-8 bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600"
          }`}
        >
          <Plus className="h-4 w-4" />
          {secEmpty && t("pm.canvas.addRow")}
        </button>
      </Abs>,
    );
  };
  visit(root);

  /**
   * (+) floating at the bottom edge of the selected or hovered element / group / Row:
   * element → new content right below it; Row → a new Row right below it.
   */
  const floating: ReactNode[] = [];
  if (!dragging) {
    const ids = [selectedId, hoverId].filter((x, i, a): x is NodeId => !!x && x !== root.id && a.indexOf(x) === i);
    for (const id of ids) {
      const n = findNode(root, id);
      const rc = rects[id];
      if (!n || !rc || isSection(n)) continue;
      const row = isRowLike(n);
      floating.push(
        <button
          key={`fab-${id}`}
          type="button"
          data-testid={row ? `row-plus-${id}` : `el-plus-${id}`}
          aria-label={row ? t("pm.canvas.addRowBelowName", { name: n.name }) : t("pm.canvas.addBelowName", { name: n.name })}
          title={row ? t("pm.canvas.addRowBelowTitle") : t("pm.canvas.addBelowThis")}
          onMouseEnter={() => setHover(id)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(id);
            if (row) onAddRowAfter(id);
            else onAddAfter(id);
          }}
          className={`pointer-events-auto absolute z-20 inline-flex h-6 w-6 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white transition hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 ${
            row ? "bg-violet-600 hover:bg-violet-700 focus-visible:outline-violet-600" : "bg-emerald-600 hover:bg-emerald-700 focus-visible:outline-emerald-600"
          }`}
          style={{ left: Math.max(2, Math.min(wrapW - 26, rc.x + rc.w / 2 - 12)), top: rc.y + rc.h - 12 }}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>,
      );
    }
  }

  /** The + button between sections (adds a new section at that position). */
  const sectionAdders: ReactNode[] = [];
  if (!empty) {
    const secs = root.children.filter((c) => rects[c.id]);
    const ys = [rects[secs[0]?.id]?.y ?? 0, ...secs.map((c) => rects[c.id].y + rects[c.id].h)];
    ys.forEach((y, i) => {
      sectionAdders.push(
        <div key={`add-sec-${i}`} className="pointer-events-none absolute inset-x-0 z-10 flex justify-center" style={{ top: Math.max(2, y - 13) }}>
          <button
            type="button"
            data-testid={`add-section-${i}`}
            aria-label={i === 0 ? t("pm.canvas.addSectionTop") : t("pm.canvas.addSectionAfter", { n: i })}
            title={t("pm.canvas.addSection")}
            onClick={() => onAddSection(i)}
            className="pointer-events-auto inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white opacity-30 shadow transition hover:scale-110 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>,
      );
    });
  }

  return (
    <div ref={scrollRef} className="relative h-full overflow-auto bg-gray-200 dark:bg-gray-950" data-testid="canvas-scroll">
      <div
        ref={wrapRef}
        className={`relative mx-auto bg-white ${viewportWidth ? "my-4 shadow-xl ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}
        style={{ width: viewportWidth ? Math.min(viewportWidth, 4000) : "100%", maxWidth: "100%" }}
      >
        <div className="relative">
          <PageFrame
            title={t("pm.canvas.frameTitle")}
            css={css}
            body={body}
            script={script}
            edit
            libraries={libraries}
            height={frameH}
            onPick={(id, dbl) => {
              onSelect(id ?? root.id);
              if (dbl && id) onOpenSettings(id);
            }}
            onHover={setHover}
            onKey={onKey}
            onRects={(r, h) => {
              setRects(r);
              setContentH(h);
            }}
          />

          {/* overlay */}
          <div className="pointer-events-none absolute inset-0" aria-hidden={false}>
            {hovRect && !dragging && (
              <Abs rect={hovRect} style={{ outline: `1px solid ${toneOf(root, hoverId!).ring}`, outlineOffset: -1, background: toneOf(root, hoverId!).soft }} />
            )}
            {selRect && (
              <Abs rect={selRect} style={{ outline: `2px solid ${toneOf(root, selectedId).ring}`, outlineOffset: -2 }} />
            )}
            {emptyPlus}
            {sectionAdders}
            {floating}
            {toolbar}

            {empty && (
              <div className="pointer-events-auto absolute inset-x-0 top-24 mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-dashed border-blue-300 bg-white/95 p-8 text-center shadow-sm dark:border-blue-500/40 dark:bg-gray-900/95">
                <Layers className="h-8 w-8 text-blue-600" />
                <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">{t("pm.canvas.emptyTitle")}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t("pm.canvas.emptyHint")}
                </p>
                <button
                  type="button"
                  data-testid="start-add-section"
                  onClick={() => onAddSection(0)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
                >
                  <Plus className="h-4 w-4" /> {t("pm.editor.addSection")}
                </button>
              </div>
            )}
          </div>

          {/* drop catcher — only present while a drag is in progress */}
          {dragging && (
            <div className="absolute inset-0 z-30" onDragOver={onDragOver} onDragLeave={(e) => e.currentTarget === e.target && setDrop(null)} onDrop={onDropHere} data-testid="drop-cover">
              {drop && (
                <Abs
                  rect={drop.indicator.rect}
                  className="pointer-events-none"
                  style={
                    drop.indicator.kind === "line"
                      ? { background: "#2563eb", borderRadius: 2, boxShadow: "0 0 0 2px rgba(37,99,235,.25)" }
                      : { outline: "2px solid #2563eb", outlineOffset: -2, background: "rgba(37,99,235,.10)" }
                  }
                />
              )}
            </div>
          )}
        </div>

        {!empty && (
          <button
            type="button"
            data-testid="add-section-end"
            onClick={() => onAddSection(sectionCount)}
            className="flex h-14 w-full items-center justify-center gap-1.5 border-t border-dashed border-gray-300 bg-gray-50 text-sm font-medium text-gray-500 transition hover:bg-blue-50 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-blue-500/10"
          >
            <Plus className="h-4 w-4" /> {t("pm.canvas.addSection")}
          </button>
        )}
      </div>
    </div>
  );
}
