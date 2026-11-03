import { useTranslation } from "react-i18next";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type KeyboardEvent,
} from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Copy,
  GripVertical,
  Link2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  isBox,
  type BoxLayout,
  type BoxNode,
  type ComponentNode,
  type NodeId,
} from "../helpers/componentTypes";
import { canMoveInto, findNode, pathTo } from "../helpers/tree";
import {
  currentDrag,
  dropForRow,
  endDrag,
  startDrag,
  type DragPayload,
  type DropTarget,
  type TreeRowInfo,
} from "../helpers/dnd";
import { BOX_ICON, elementIcon } from "../helpers/elementIcons";

/* ================================================================== */
/* Struktur — pohon komponen dengan drag & drop                         */
/* ================================================================== */

interface Row extends TreeRowInfo {
  node: ComponentNode;
}

function flatten(root: BoxNode, collapsed: Set<NodeId>): Row[] {
  const rows: Row[] = [];
  const go = (n: ComponentNode, depth: number, parentId: NodeId | null, index: number) => {
    const box = isBox(n);
    const expanded = box && !collapsed.has(n.id);
    rows.push({
      node: n,
      id: n.id,
      isBox: box,
      isRoot: parentId === null,
      depth,
      parentId,
      index,
      childCount: box ? n.children.length : 0,
      expanded,
    });
    if (box && expanded) n.children.forEach((c, i) => go(c, depth + 1, n.id, i));
  };
  go(root, 0, null, 0);
  return rows;
}

interface TreeActions {
  onSelect: (id: NodeId, opts?: { openProps?: boolean }) => void;
  onHover: (id: NodeId | null) => void;
  onDrop: (drop: DropTarget, payload: DragPayload) => void;
  onDelete: (id: NodeId) => void;
  onDuplicate: (id: NodeId) => void;
  onMove: (id: NodeId, delta: -1 | 1) => void;
  onRename: (id: NodeId, name: string) => void;
  /** Tambah box baru (klik chip) ke target aktif. */
  onAddBox: (layout: BoxLayout) => void;
}

interface StructureTreeProps extends TreeActions {
  root: BoxNode;
  selectedId: NodeId;
  /** Id node yang baru ditambah/dipindah (berkedip sebentar). */
  flashId: NodeId | null;
  /** Ringkasan teks elemen untuk baris (mis. isi tombol). */
  describe: (n: ComponentNode) => { sub: string; linked?: boolean; broken?: boolean };
}

const BOX_CHIPS: BoxLayout[] = ["stack", "row", "grid"];

export default function StructureTree({
  root,
  selectedId,
  flashId,
  describe,
  onSelect,
  onHover,
  onDrop,
  onDelete,
  onDuplicate,
  onMove,
  onRename,
  onAddBox,
}: StructureTreeProps) {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState<Set<NodeId>>(new Set());
  const [drop, setDrop] = useState<DropTarget | null>(null);
  const [dragId, setDragId] = useState<NodeId | null>(null);
  const [renaming, setRenaming] = useState<NodeId | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const expandTimer = useRef<number | null>(null);

  const rows = useMemo(() => flatten(root, collapsed), [root, collapsed]);

  /* Buka cabang induk saat node terpilih dari tempat lain (mis. klik di preview). */
  useEffect(() => {
    const ancestors = pathTo(root, selectedId).slice(0, -1);
    if (ancestors.some((a) => collapsed.has(a.id))) {
      setCollapsed((prev) => {
        const next = new Set(prev);
        ancestors.forEach((a) => next.delete(a.id));
        return next;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, root]);

  /* Gulir baris terpilih ke dalam tampilan. */
  useEffect(() => {
    const el = scrollRef.current?.querySelector<HTMLElement>(`[data-row-id="${CSS.escape(selectedId)}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedId, rows.length]);

  const clearDrop = () => {
    setDrop(null);
    if (expandTimer.current) window.clearTimeout(expandTimer.current);
    expandTimer.current = null;
  };

  const validDrop = (d: DropTarget, payload: DragPayload | null): boolean => {
    if (!payload) return false;
    if (payload.kind === "node") return canMoveInto(root, payload.id, d.parentId);
    const target = findNode(root, d.parentId);
    return !!target && isBox(target);
  };

  const autoScroll = (e: DragEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (e.clientY < r.top + 28) el.scrollTop -= 14;
    else if (e.clientY > r.bottom - 28) el.scrollTop += 14;
  };

  const onRowDragOver = (e: DragEvent, row: Row) => {
    const payload = currentDrag(e);
    if (!payload) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const ratio = (e.clientY - rect.top) / rect.height;
    const d = dropForRow(row, ratio);
    if (!validDrop(d, payload)) {
      e.dataTransfer.dropEffect = "none";
      if (drop) clearDrop();
      return;
    }
    e.preventDefault();
    e.dataTransfer.dropEffect = payload.kind === "node" ? "move" : "copy";
    autoScroll(e);
    if (!drop || drop.rowId !== d.rowId || drop.mode !== d.mode || drop.index !== d.index) {
      setDrop(d);
      // Tahan di atas box tertutup → buka otomatis.
      if (expandTimer.current) window.clearTimeout(expandTimer.current);
      expandTimer.current = null;
      if (d.mode === "inside" && row.isBox && !row.expanded) {
        expandTimer.current = window.setTimeout(() => {
          setCollapsed((prev) => {
            const next = new Set(prev);
            next.delete(row.id);
            return next;
          });
        }, 650);
      }
    }
  };

  const onEndDragOver = (e: DragEvent) => {
    const payload = currentDrag(e);
    if (!payload) return;
    const d: DropTarget = {
      parentId: root.id,
      index: root.children.length,
      rowId: "end",
      mode: "end",
      depth: 1,
    };
    if (!validDrop(d, payload)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = payload.kind === "node" ? "move" : "copy";
    autoScroll(e);
    if (!drop || drop.mode !== "end") setDrop(d);
  };

  const commitDrop = (e: DragEvent) => {
    const payload = currentDrag(e);
    const d = drop;
    e.preventDefault();
    clearDrop();
    setDragId(null);
    endDrag();
    if (payload && d && validDrop(d, payload)) onDrop(d, payload);
  };

  /* --------------------------- keyboard --------------------------- */

  const onKeyDown = (e: KeyboardEvent) => {
    if (renaming) return;
    const target = e.target as HTMLElement;
    if (target.closest("input,textarea,select")) return;
    const idx = rows.findIndex((r) => r.id === selectedId);
    const row = rows[idx];
    if (!row) return;
    const focusRow = (id: NodeId) =>
      requestAnimationFrame(() =>
        scrollRef.current?.querySelector<HTMLElement>(`[data-row-id="${CSS.escape(id)}"]`)?.focus(),
      );

    if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      if (!row.isRoot) onMove(row.id, e.key === "ArrowUp" ? -1 : 1);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        const next = rows[idx + (e.key === "ArrowDown" ? 1 : -1)];
        if (next) {
          onSelect(next.id);
          focusRow(next.id);
        }
        break;
      }
      case "ArrowRight":
        if (row.isBox && !row.expanded) toggle(row.id);
        else if (row.isBox && rows[idx + 1]?.parentId === row.id) {
          onSelect(rows[idx + 1].id);
          focusRow(rows[idx + 1].id);
        }
        break;
      case "ArrowLeft":
        if (row.isBox && row.expanded && !row.isRoot) toggle(row.id);
        else if (row.parentId) {
          onSelect(row.parentId);
          focusRow(row.parentId);
        }
        break;
      case "Delete":
      case "Backspace":
        if (!row.isRoot) {
          e.preventDefault();
          // Fokus pindah ke baris sebelumnya supaya keyboard tetap di pohon.
          const prev = rows[idx - 1];
          onDelete(row.id);
          if (prev) focusRow(prev.id);
        }
        break;
      case "d":
      case "D":
        if ((e.ctrlKey || e.metaKey) && !row.isRoot) {
          e.preventDefault();
          onDuplicate(row.id);
        }
        break;
      case "Enter":
        e.preventDefault();
        onSelect(row.id, { openProps: true });
        break;
      case "F2":
        e.preventDefault();
        startRename(row.node);
        break;
    }
  };

  const toggle = (id: NodeId) =>
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const startRename = (n: ComponentNode) => {
    setRenaming(n.id);
    setRenameValue(n.name);
  };
  const commitRename = () => {
    if (renaming && renameValue.trim()) onRename(renaming, renameValue.trim());
    setRenaming(null);
  };

  const allBoxIds = useMemo(() => {
    const ids: NodeId[] = [];
    const go = (n: ComponentNode) => {
      if (isBox(n)) {
        if (n.id !== root.id) ids.push(n.id);
        n.children.forEach(go);
      }
    };
    go(root);
    return ids;
  }, [root]);

  /* ----------------------------- render --------------------------- */

  const indicator = (r: Row) => {
    if (!drop || drop.rowId !== r.id) return null;
    const pad = 8 + drop.depth * 16;
    if (drop.mode === "before" || drop.mode === "after" || drop.mode === "first-child") {
      return (
        <span
          aria-hidden
          className={`pointer-events-none absolute right-1 z-10 h-0.5 rounded bg-blue-600 ${
            drop.mode === "before" ? "-top-px" : "-bottom-px"
          }`}
          style={{ left: pad }}
        >
          <span className="absolute -left-1 -top-[3px] h-2 w-2 rounded-full border-2 border-blue-600 bg-white dark:bg-gray-900" />
        </span>
      );
    }
    return null;
  };

  return (
    <section className="flex min-h-0 flex-1 flex-col" aria-label={t("pm.tree.aria")}>
      <header className="flex shrink-0 items-center gap-2 px-3 pb-2 pt-3">
        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
          {t("pm.editor.structure")}
        </h4>
        <span className="text-[11px] text-gray-400">{t("pm.tree.nodes", { count: rows.length > 0 ? countAll(root) : 0 })}</span>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setCollapsed(new Set(allBoxIds))}
            disabled={allBoxIds.length === 0}
            className="rounded px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 disabled:opacity-40 dark:text-gray-400 dark:hover:bg-white/10"
          >
            {t("pm.tree.collapseAll")}
          </button>
          <button
            type="button"
            onClick={() => setCollapsed(new Set())}
            className="rounded px-1.5 py-0.5 text-[11px] text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
          >
            {t("pm.tree.expandAll")}
          </button>
        </div>
      </header>

      {/* Kontainer baru: seret ke pohon, atau klik */}
      <div className="flex shrink-0 flex-wrap items-center gap-1.5 px-3 pb-2">
        <span className="text-[11px] text-gray-400">{t("pm.tree.containers")}</span>
        {BOX_CHIPS.map((layout) => {
          const Icon = BOX_ICON[layout];
          const c = { layout, label: t(`pm.add.box.${layout}.label`) };
          return (
            <button
              key={c.layout}
              type="button"
              draggable
              title={t("pm.tree.chipTitle", { label: c.label })}
              onClick={() => onAddBox(c.layout)}
              onDragStart={(e) => startDrag(e, { kind: "box", layout: c.layout }, c.label)}
              onDragEnd={() => {
                endDrag();
                clearDrop();
              }}
              className="inline-flex cursor-grab items-center gap-1 rounded-full border border-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-600 transition hover:border-blue-500 hover:text-blue-700 active:cursor-grabbing dark:border-gray-700 dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Icon className="h-3 w-3" /> {c.label} <Plus className="h-3 w-3 opacity-60" />
            </button>
          );
        })}
      </div>

      <div
        ref={scrollRef}
        role="tree"
        aria-label={t("pm.tree.treeAria")}
        onKeyDown={onKeyDown}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) clearDrop();
        }}
        onDrop={commitDrop}
        onMouseLeave={() => onHover(null)}
        className="min-h-0 flex-1 overflow-y-auto border-t border-gray-100 px-1.5 py-1.5 dark:border-gray-800"
      >
        {rows.map((r) => {
          const n = r.node;
          const selected = r.id === selectedId;
          const info = describe(n);
          const Icon = isBox(n) ? BOX_ICON[n.layout] : elementIcon(n.elementType);
          const isInside = drop?.rowId === r.id && drop.mode === "inside";
          return (
            <div
              key={r.id}
              data-row-id={r.id}
              role="treeitem"
              aria-level={r.depth + 1}
              aria-selected={selected}
              aria-expanded={r.isBox ? r.expanded : undefined}
              tabIndex={selected ? 0 : -1}
              draggable={!r.isRoot && renaming !== r.id}
              onClick={() => onSelect(r.id)}
              onDoubleClick={() => !r.isRoot && startRename(n)}
              onMouseEnter={() => onHover(r.id)}
              onDragStart={(e) => {
                e.stopPropagation();
                startDrag(e, { kind: "node", id: r.id }, n.name);
                setDragId(r.id);
              }}
              onDragEnd={() => {
                endDrag();
                setDragId(null);
                clearDrop();
              }}
              onDragOver={(e) => onRowDragOver(e, r)}
              className={`group relative flex h-8 cursor-pointer select-none items-center gap-1 rounded-md pr-1 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600/50 ${
                selected
                  ? "bg-blue-50 text-blue-900 dark:bg-blue-500/15 dark:text-blue-100"
                  : "text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-white/5"
              } ${dragId === r.id ? "opacity-40" : ""} ${
                isInside ? "ring-2 ring-blue-600 ring-inset bg-blue-50/70 dark:bg-blue-500/10" : ""
              } ${flashId === r.id ? "cm-flash" : ""}`}
              style={{ paddingLeft: 4 + r.depth * 16 }}
            >
              {indicator(r)}

              {r.isBox ? (
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={r.expanded ? t("pm.tree.collapse") : t("pm.tree.expand")}
                  disabled={r.isRoot}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(r.id);
                  }}
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-gray-400 hover:bg-gray-200/60 disabled:opacity-0 dark:hover:bg-white/10"
                >
                  {r.expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                </button>
              ) : (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center text-gray-300 opacity-0 group-hover:opacity-100">
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
              )}

              <Icon className={`h-4 w-4 shrink-0 ${selected ? "text-blue-700 dark:text-blue-300" : "text-gray-500 dark:text-gray-400"}`} />

              {renaming === r.id ? (
                <input
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onBlur={commitRename}
                  onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter") commitRename();
                    if (e.key === "Escape") setRenaming(null);
                  }}
                  maxLength={60}
                  className="h-6 min-w-0 flex-1 rounded border border-blue-600 bg-white px-1.5 text-sm text-gray-900 outline-none dark:bg-gray-900 dark:text-white"
                />
              ) : (
                <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
                  <span className="truncate font-medium">{n.name}</span>
                  <span className="truncate text-[11px] text-gray-400">{info.sub}</span>
                </span>
              )}

              {info.linked && (
                <span title={t("pm.tree.linked")}>
                  <Link2 className="h-3 w-3 shrink-0 text-emerald-600" />
                </span>
              )}
              {info.broken && (
                <span className="shrink-0 rounded bg-red-100 px-1 text-[10px] font-semibold text-red-700 dark:bg-red-500/20 dark:text-red-300">
                  error
                </span>
              )}

              {!r.isRoot && renaming !== r.id && (
                <span
                  className={`ml-auto flex shrink-0 items-center gap-0.5 ${
                    selected ? "opacity-100" : "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100"
                  }`}
                >
                  <RowBtn label={t("pm.tree.moveUp")} onClick={() => onMove(r.id, -1)}>
                    <ArrowUp className="h-3 w-3" />
                  </RowBtn>
                  <RowBtn label={t("pm.tree.moveDown")} onClick={() => onMove(r.id, 1)}>
                    <ArrowDown className="h-3 w-3" />
                  </RowBtn>
                  <RowBtn label={t("pm.tree.duplicate")} onClick={() => onDuplicate(r.id)}>
                    <Copy className="h-3 w-3" />
                  </RowBtn>
                  <RowBtn label={t("pm.tree.delete")} danger onClick={() => onDelete(r.id)}>
                    <Trash2 className="h-3 w-3" />
                  </RowBtn>
                </span>
              )}
            </div>
          );
        })}

        {/* Zona jatuh di akhir komponen */}
        <div
          onDragOver={onEndDragOver}
          className={`relative mt-1 flex h-9 items-center justify-center rounded-md border border-dashed text-[11px] transition-colors ${
            drop?.mode === "end"
              ? "border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
              : "border-transparent text-gray-300 dark:text-gray-600"
          }`}
        >
          {dragId || drop ? t("pm.tree.dropEnd") : ""}
        </div>
      </div>
    </section>
  );
}

function RowBtn({
  label,
  onClick,
  danger,
  children,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      tabIndex={-1}
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`flex h-5 w-5 items-center justify-center rounded text-gray-400 transition-colors ${
        danger
          ? "hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20"
          : "hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-white/10 dark:hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function countAll(n: ComponentNode): number {
  return 1 + (isBox(n) ? n.children.reduce((a, c) => a + countAll(c), 0) : 0);
}
