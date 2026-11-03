import { Trans, useTranslation } from "react-i18next";
import { Columns3, Grid3x3, Layers, LayoutPanelTop, Library, Plus, Rows3, Rows4, Shapes } from "lucide-react";
import ElementLibrary, { type LibraryPick } from "../engine/ui/ElementLibrary";
import type { IconLookup } from "../core/helpers/elementDefinition";
import type { BoxLayout } from "../engine/helpers/componentTypes";
import { endDrag, startDrag } from "../engine/helpers/dnd";
import { ROW_VARIANTS } from "../helpers/pageDoc";
import type { LibraryId } from "../engine/helpers/libraries";
import { LibraryManager } from "./LibraryPanel";
import { ColumnBars } from "./LayoutThumb";

export type AddTab = "element" | "box" | "row" | "library";

/** Label = kunci i18n (diterjemahkan saat render). */
const TABS: { id: AddTab; icon: typeof Shapes }[] = [
  { id: "element", icon: Shapes },
  { id: "box", icon: LayoutPanelTop },
  { id: "row", icon: Rows4 },
  { id: "library", icon: Library },
];

const BOXES: { layout: BoxLayout; icon: typeof Rows3 }[] = [
  { layout: "stack", icon: Rows3 },
  { layout: "row", icon: Columns3 },
  { layout: "grid", icon: Grid3x3 },
];

interface Props {
  icons: IconLookup;
  targetLabel: string;
  /** Belum ada section → penambahan dikunci. */
  locked: boolean;
  tab: AddTab;
  onTab: (t: AddTab) => void;
  onAddRow: (variantId: string) => void;
  /** Penjelasan posisi sisip untuk tab Row (mis. "di bawah Row “Hero”"). */
  rowLabel: string;
  onCreateSection: () => void;
  onAddElement: (p: LibraryPick) => void;
  onAddBox: (layout: BoxLayout) => void;
  /** Library CDN yang terpasang di halaman ini (root.libraries). */
  libraries: LibraryId[];
  onToggleLibrary: (id: LibraryId) => void;
}

/** Isi popup (+): elemen bawaan, grup, dan Row — bisa diklik atau diseret ke canvas. */
export default function AddPanel({ icons, targetLabel, locked, tab, onTab, onAddRow, rowLabel, onCreateSection, onAddElement, onAddBox, libraries, onToggleLibrary }: Props) {
  const { t } = useTranslation();
  if (locked) {
    return (
      <div className="flex flex-col items-center gap-3 px-2 py-6 text-center" data-testid="add-locked">
        <Layers className="h-8 w-8 text-blue-600" />
        <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{t("pm.add.lockedTitle")}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{t("pm.add.lockedHint")}</p>
        <button type="button" onClick={onCreateSection} className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-800">
          <Plus className="h-3.5 w-3.5" /> {t("pm.editor.addSection")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" className="flex rounded-lg border border-gray-200 p-0.5 dark:border-gray-800">
        {TABS.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => onTab(id)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold transition ${
              tab === id ? "bg-blue-800 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"
            }`}
          >
            <Icon className="h-3.5 w-3.5" /> {t(`pm.add.tab.${id}`)}
          </button>
        ))}
      </div>

      {tab === "element" && (
        <ElementLibrary icons={icons} onAdd={onAddElement} targetLabel={targetLabel} dropAreaLabel={t("pm.add.canvas")} />
      )}

      {tab === "box" && (
        <div className="flex flex-col gap-2">
          <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
            <Trans i18nKey="pm.add.boxHint" values={{ target: targetLabel }} components={{ b: <b /> }} />
          </p>
          {BOXES.map(({ layout, icon: Icon }) => {
            const label = t(`pm.add.box.${layout}.label`);
            return (
            <button
              key={layout}
              type="button"
              draggable
              onDragStart={(e) => startDrag(e, { kind: "box", layout }, label)}
              onDragEnd={endDrag}
              onClick={() => onAddBox(layout)}
              className="flex items-center gap-3 rounded-lg border border-gray-200 px-3 py-2 text-left transition hover:border-blue-500 dark:border-gray-800"
            >
              <Icon className="h-5 w-5 text-gray-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-gray-800 dark:text-white/90">{label}</span>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{t(`pm.add.box.${layout}.hint`)}</span>
              </span>
              <Plus className="h-4 w-4 text-gray-400" />
            </button>
            );
          })}
        </div>
      )}

      {tab === "library" && <LibraryManager installed={libraries} onToggle={onToggleLibrary} />}

      {tab === "row" && (
        <div className="flex flex-col gap-2" data-testid="row-tab">
          <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
            <Trans i18nKey="pm.add.rowHint" values={{ target: rowLabel }} components={{ b: <b /> }} />
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ROW_VARIANTS.map((v) => {
              const label = v.fr.length ? v.name : t("pm.rowVariant.sejajar.name", { defaultValue: v.name });
              return (
                <button
                  key={v.id}
                  type="button"
                  data-testid={`row-variant-${v.id}`}
                  draggable
                  onDragStart={(e) => startDrag(e, { kind: "row", variant: v.id }, label)}
                  onDragEnd={endDrag}
                  onClick={() => onAddRow(v.id)}
                  title={v.fr.length ? t("pm.add.rowColumns", { count: v.fr.length, label }) : t("pm.rowVariant.sejajar.description", { defaultValue: v.description })}
                  className="flex flex-col gap-1 rounded-lg border border-gray-200 p-1.5 text-left transition hover:border-teal-500 hover:ring-2 hover:ring-teal-500/20 dark:border-gray-800"
                >
                  {v.fr.length ? (
                    <ColumnBars fr={v.fr} height={16} />
                  ) : (
                    <div className="flex h-4 items-center gap-1" aria-hidden="true">
                      {[10, 16, 8].map((w, i) => (
                        <span key={i} className="h-2.5 rounded-sm bg-teal-400 dark:bg-teal-500" style={{ width: w }} />
                      ))}
                    </div>
                  )}
                  <span className="truncate text-[10px] font-medium text-gray-600 dark:text-gray-300">{label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
