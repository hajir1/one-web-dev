import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import {
  AlertTriangle,
  ChevronRight,
  Copy,
  PackageOpen,
  PackagePlus,
  Trash2,
} from "lucide-react";
import PanelStyling, {
  SECTION_ICONS,
  type PanelSection,
  type Updater,
} from "../../core/ui/PanelStyling";
import {
  ColorField,
  NumberField,
  SegmentedField,
  SelectField,
  Show,
  TextField,
  ToggleField,
} from "../../core/ui/fields";
import { Field, Group, NumberInput, SelectInput, TextInput, Toggle } from "../../core/helpers/SmallUIHelpers";
import {
  isBox,
  type Align,
  type BoxNode,
  type ComponentNode,
  type BoxTag,
  type ElementNode,
  type NodeId,
  type Place,
  type SectionProps,
  boxBackground,
  type RowWidth,
} from "../helpers/componentTypes";
import { pathTo } from "../helpers/tree";
import { resolveElement } from "../helpers/resolve";
import BackgroundEditor from "../../core/ui/BackgroundEditor";
import type { BgFields } from "../../core/helpers/background";
import { BOX_ICON, elementIcon } from "../helpers/elementIcons";
import { GENERIC_FONT_TYPES } from "../../core/elementDefinitions";
import FontSelect from "../../core/ui/FontSelect";
import { VarPickerProvider } from "../../core/ui/VarPicker";
import { GenericFontContext } from "../../core/ui/PanelStyling";
import { useGlobalVars } from "../../core/hooks/useGlobalVars";

/* ================================================================== */
/* Inspector — properties of the selected node                          */
/*                                                                    */
/* Elements use the ORIGINAL styling panel from Element Maker (the same */
/* definition), so no configuration is lost when reused.               */
/* ================================================================== */

export interface InspectorHandlers {
  select: (id: NodeId) => void;
  rename: (id: NodeId, name: string) => void;
  patchBox: (id: NodeId, patch: Partial<BoxNode>, key?: string) => void;
  patchPlace: (id: NodeId, place: Place, key?: string) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editElement: (id: NodeId, fn: (state: any) => any, key?: string) => void;
  /** Changes a field of the element node (not its state), e.g. `events`. */
  patchElement: (id: NodeId, patch: Partial<ElementNode>, key?: string) => void;
  /** Resets an element / container to its defaults. */
  resetElement: (id: NodeId) => void;
  duplicate: (id: NodeId) => void;
  remove: (id: NodeId) => void;
  wrap: (id: NodeId) => void;
  unwrap: (id: NodeId) => void;
}

interface InspectorProps {
  root: BoxNode;
  node: ComponentNode;
  /** Extra sections for an element (e.g. JavaScript / events). */
  elementExtras?: (el: ElementNode) => PanelSection[];
  /** Extra sections for containers (e.g. the full background). */
  boxExtras?: (box: BoxNode) => PanelSection[];
  classNameField: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    effective?: string;
  };
  on: InspectorHandlers;
}

/** UI text for the non-component functions in this file (called at render time). */
const t = (key: string, opts?: Record<string, unknown>): string => i18n.t(key, opts);

/* ------------------------- form penempatan ------------------------- */

type AlignAuto = "auto" | Align;

interface PlaceForm {
  grow: boolean;
  basis: number;
  colStart: number;
  colSpan: number;
  rowStart: number;
  rowSpan: number;
  area: string;
  selfH: AlignAuto;
  selfV: AlignAuto;
}

const placeToForm = (p: Place): PlaceForm => ({
  grow: !!p.grow,
  basis: p.basis ?? 0,
  colStart: p.colStart ?? 0,
  colSpan: p.colSpan ?? 0,
  rowStart: p.rowStart ?? 0,
  rowSpan: p.rowSpan ?? 0,
  area: p.area ?? "",
  selfH: p.selfH ?? "auto",
  selfV: p.selfV ?? "auto",
});

const formToPlace = (f: PlaceForm): Place => {
  const p: Place = {};
  if (f.grow) p.grow = true;
  if (f.basis > 0) p.basis = f.basis;
  if (f.colStart > 0) p.colStart = f.colStart;
  if (f.colSpan > 0) p.colSpan = f.colSpan;
  if (f.rowStart > 0) p.rowStart = f.rowStart;
  if (f.rowSpan > 0) p.rowSpan = f.rowSpan;
  if (f.area.trim()) p.area = f.area.trim();
  if (f.selfH !== "auto") p.selfH = f.selfH;
  if (f.selfV !== "auto") p.selfV = f.selfV;
  return p;
};

const alignOpts = () =>
  [
    { value: "start", label: t("pm.inspector.align.start") },
    { value: "center", label: t("pm.inspector.align.center") },
    { value: "end", label: t("pm.inspector.align.end") },
    { value: "stretch", label: t("pm.inspector.align.stretch") },
  ] as const;

const selfOpts = () => [{ value: "auto", label: t("pm.inspector.align.auto") }, ...alignOpts()] as const;

function placementSection(
  parent: BoxNode,
  form: PlaceForm,
  updatePlace: Updater<PlaceForm>,
): PanelSection {
  const L = parent.layout;
  const SELF_OPTS = selfOpts();
  return {
    id: "place",
    label: t("pm.inspector.place.label"),
    icon: SECTION_ICONS.layout,
    content: (
      <>
        <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          {t("pm.inspector.place.intro", { kind: t(`pm.inspector.place.kind.${L === "row" ? "row" : L === "grid" ? "grid" : "stack"}`), name: parent.name })}
        </p>
        <Show when={L === "row"}>
          <ToggleField s={form} update={updatePlace} k="grow" label={t("pm.inspector.place.grow")} />
          <NumberField s={form} update={updatePlace} k="basis" label={t("pm.inspector.place.basis")} min={0} suffix="px" hint={t("pm.inspector.place.auto")} />
          <SelectField s={form} update={updatePlace} k="selfV" label={t("pm.inspector.place.selfV")} options={SELF_OPTS} />
        </Show>
        <Show when={L === "stack"}>
          <SelectField s={form} update={updatePlace} k="selfH" label={t("pm.inspector.place.selfH")} options={SELF_OPTS} />
        </Show>
        <Show when={L === "grid"}>
          <TextField
            s={form}
            update={updatePlace}
            k="area"
            label={t("pm.inspector.place.area")}
            placeholder={t("pm.inspector.place.areaPlaceholder")}
            hint={t("pm.inspector.place.areaHint")}
          />
          <Group title={t("pm.inspector.place.spanGroup")}>
            <div className="grid grid-cols-2 gap-3">
              <NumberField s={form} update={updatePlace} k="colStart" label={t("pm.inspector.place.colStart")} min={0} />
              <NumberField s={form} update={updatePlace} k="colSpan" label={t("pm.inspector.place.colSpan")} min={0} />
              <NumberField s={form} update={updatePlace} k="rowStart" label={t("pm.inspector.place.rowStart")} min={0} />
              <NumberField s={form} update={updatePlace} k="rowSpan" label={t("pm.inspector.place.rowSpan")} min={0} />
            </div>
          </Group>
          <SelectField s={form} update={updatePlace} k="selfH" label={t("pm.inspector.place.selfH")} options={SELF_OPTS} />
          <SelectField s={form} update={updatePlace} k="selfV" label={t("pm.inspector.place.selfV")} options={SELF_OPTS} />
        </Show>
      </>
    ),
  };
}

/* ----------------------------- section box ------------------------- */

const FR_PRESETS = [1, 2, 3, 4];

const tagOpts = () => [
  { value: "div", label: t("pm.inspector.section.tagDiv") },
  { value: "section", label: "section" },
  { value: "header", label: "header" },
  { value: "nav", label: "nav" },
  { value: "main", label: "main" },
  { value: "article", label: "article" },
  { value: "aside", label: "aside" },
  { value: "footer", label: "footer" },
] as const;

function sectionPanel(
  box: BoxNode,
  update: Updater<BoxNode>,
  updateSec: Updater<SectionProps>,
): PanelSection {
  const sec = box.section!;
  const form = { ...sec, tag: box.tag ?? "div" };
  return {
    id: "section",
    label: "Section",
    icon: SECTION_ICONS.sizing,
    content: (
      <>
        <p className="text-xs text-gray-500 dark:text-gray-400" data-testid="section-kind">
          {t("pm.inspector.section.type")}: <b className="text-gray-800 dark:text-white/90">{t(`pm.insert.kind.${sec.sectionType ?? "regular"}.name`)}</b>
        </p>
        <SelectField
          s={form}
          update={((_k: string, v: string) => update("tag", v === "div" ? undefined : (v as BoxTag))) as Updater<typeof form>}
          k="tag"
          label={t("pm.inspector.section.tag")}
          options={tagOpts()}
          hint={t("pm.inspector.section.tagHint")}
        />
        <NumberField s={sec} update={updateSec} k="contentWidth" label={t("pm.inspector.section.contentWidth")} min={0} suffix="px" hint={t("pm.inspector.section.contentWidthHint")} />
        <NumberField s={sec} update={updateSec} k="padY" label={t("pm.inspector.section.padY")} min={0} suffix="px" />
        <NumberField s={sec} update={updateSec} k="padX" label={t("pm.inspector.section.padX")} min={0} suffix="px" />
        <NumberField s={sec} update={updateSec} k="minHeight" label={t("pm.inspector.section.minHeight")} min={0} suffix="px" hint={t("pm.inspector.section.minHeightHint")} />
      </>
    ),
  };
}

const ROW_WIDTH_HINT_KEY: Record<RowWidth, string> = {
  content: "pm.inspector.rowWidth.hint.content",
  "80": "pm.inspector.rowWidth.hint.80",
  full: "pm.inspector.rowWidth.hint.full",
  custom: "pm.inspector.rowWidth.hint.custom",
};

function boxSections(
  box: BoxNode,
  update: Updater<BoxNode>,
  updateSec: Updater<SectionProps> | undefined,
  patch: (p: Partial<BoxNode>, key?: string) => void,
): PanelSection[] {
  const bg = boxBackground(box);
  // First edit on old data: write every background field at once
  // (the old image in section.bgImage is moved along) so nothing is lost.
  const setBg = (k: keyof BgFields, v: unknown) => {
    const next = { ...bg, [k]: v } as BoxNode;
    patch(
      {
        ...next,
        bgEnabled: next.bgType !== "none",
        ...(box.section?.bgImage ? { section: { ...box.section, bgImage: "" } } : {}),
      },
      `bg:${box.id}:${String(k)}`,
    );
  };
  const L = box.layout;
  return [
    ...(box.section && updateSec ? [sectionPanel(box, update, updateSec)] : []),
    {
      id: "layout",
      label: "Layout",
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <SelectField
            s={box}
            update={update}
            k="layout"
            label={t("pm.inspector.layout.type")}
            options={[
              ...(box.section || L === "block"
                ? [{ value: "block" as const, label: t("pm.inspector.layout.block") }]
                : []),
              { value: "stack", label: t("pm.inspector.layout.stack") },
              { value: "row", label: t("pm.inspector.layout.row") },
              { value: "grid", label: t("pm.inspector.layout.grid") },
            ]}
          />
          <Show when={L === "grid"}>
            <Field label={t("pm.inspector.layout.columns")} hint={t("pm.inspector.layout.columnsHint")}>
              <div className="mb-1.5 flex gap-1.5">
                {FR_PRESETS.map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => update("columns", `repeat(${n}, minmax(0, 1fr))`)}
                    className={`h-6 min-w-8 rounded border px-1.5 text-xs transition ${
                      box.columns === `repeat(${n}, minmax(0, 1fr))`
                        ? "border-blue-800 bg-blue-800 text-white"
                        : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
                    }`}
                  >
                    {n}×
                  </button>
                ))}
              </div>
              <TextInput value={box.columns} onChange={(v) => update("columns", v)} placeholder="repeat(3, minmax(0, 1fr))" />
            </Field>
            <TextField
              s={box}
              update={update}
              k="areas"
              label={t("pm.inspector.layout.areas")}
              placeholder={'"header header" "side main"'}
              hint={t("pm.inspector.layout.areasHint")}
            />
          </Show>
          <Show when={L === "row"}>
            <ToggleField s={box} update={update} k="wrap" label={t("pm.inspector.layout.wrap")} />
          </Show>
          <Show when={L !== "block"}>
            <NumberField s={box} update={update} k="gap" label={t("pm.inspector.layout.gap")} min={0} suffix="px" />
          </Show>
          <Show when={L !== "block"}>
          <SegmentedField
            s={box}
            update={update}
            k="align"
            label={L === "stack" ? t("pm.inspector.layout.alignH") : t("pm.inspector.layout.alignV")}
            options={alignOpts()}
          />
          </Show>
          <Show when={L !== "stack" && L !== "block"}>
            <SelectField
              s={box}
              update={update}
              k="justify"
              label={L === "row" ? t("pm.inspector.layout.distribution") : t("pm.inspector.layout.alignH")}
              options={
                L === "row"
                  ? [
                      { value: "start", label: t("pm.inspector.align.start") },
                      { value: "center", label: t("pm.inspector.align.center") },
                      { value: "end", label: t("pm.inspector.align.end") },
                      { value: "between", label: t("pm.inspector.layout.between") },
                    ]
                  : [
                      { value: "start", label: t("pm.inspector.align.start") },
                      { value: "center", label: t("pm.inspector.align.center") },
                      { value: "end", label: t("pm.inspector.align.end") },
                      { value: "stretch", label: t("pm.inspector.align.stretch") },
                    ]
              }
            />
          </Show>
          <Show when={L !== "stack" && L !== "block"}>
            <ToggleField
              s={box}
              update={update}
              k="stackOnMobile"
              label={t("pm.inspector.layout.stackOnMobile")}
            />
          </Show>
          <Show when={L === "grid" && box.stackOnMobile}>
            <Field label={t("pm.inspector.layout.mobileGrid")}>
              <SelectInput
                value={box.mobileGrid ?? "one"}
                onChange={(v) => patch({ mobileGrid: v === "one" ? undefined : (v as "two" | "scroll") }, `mgrid:${box.id}`)}
                options={[
                  { value: "one", label: t("pm.inspector.layout.mobileOne") },
                  { value: "two", label: t("pm.inspector.layout.mobileTwo") },
                  { value: "scroll", label: t("pm.inspector.layout.mobileScroll") },
                ]}
              />
            </Field>
          </Show>
          <Show when={L === "grid"}>
            <Toggle checked={!!box.stagger} onChange={(v) => patch({ stagger: v || undefined }, `stag:${box.id}`)} label={t("pm.inspector.layout.stagger")} />
          </Show>
          <Toggle checked={!!box.hoverLift} onChange={(v) => patch({ hoverLift: v || undefined }, `lift:${box.id}`)} label={t("pm.inspector.layout.hoverLift")} />
        </>
      ),
    },
    {
      id: "sizing",
      label: t("pm.inspector.sizing.label"),
      icon: SECTION_ICONS.sizing,
      content: (
        <>
          <Show when={!!box.row}>
            <Field label={t("pm.inspector.rowWidth.label")} hint={t(ROW_WIDTH_HINT_KEY[box.rowWidth ?? "content"])}>
              <SelectInput
                value={box.rowWidth ?? "content"}
                onChange={(v) => patch({ rowWidth: v as RowWidth, widthMode: "full" }, `roww:${box.id}`)}
                options={[
                  { value: "content", label: t("pm.inspector.rowWidth.content") },
                  { value: "80", label: "80%" },
                  { value: "full", label: t("pm.inspector.rowWidth.full") },
                  { value: "custom", label: t("pm.inspector.rowWidth.custom") },
                ]}
              />
            </Field>
            <Show when={box.rowWidth === "custom"}>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label={t("pm.inspector.rowWidth.value")}>
                    <NumberInput
                      value={box.rowCustomWidth ?? (box.rowCustomUnit === "%" ? 80 : 960)}
                      onChange={(v) => update("rowCustomWidth", v)}
                      min={1}
                      max={box.rowCustomUnit === "%" ? 100 : 4000}
                    />
                  </Field>
                </div>
                <div className="w-24">
                  <SelectInput
                    value={box.rowCustomUnit ?? "px"}
                    onChange={(v) => update("rowCustomUnit", v as "px" | "%")}
                    options={[
                      { value: "px", label: "px" },
                      { value: "%", label: "%" },
                    ]}
                  />
                </div>
              </div>
            </Show>
          </Show>
          <Show when={!box.row}>
          <SelectField
            s={box}
            update={update}
            k="widthMode"
            label={t("pm.inspector.sizing.width")}
            options={[
              { value: "full", label: t("pm.inspector.sizing.full") },
              { value: "auto", label: t("pm.inspector.sizing.auto") },
              { value: "fit", label: t("pm.inspector.sizing.fit") },
              { value: "fixed", label: t("pm.inspector.sizing.fixed") },
            ]}
          />
          </Show>
          <Show when={box.widthMode === "fixed" && !box.row}>
            <NumberField s={box} update={update} k="width" label={t("pm.inspector.sizing.fixedWidth")} min={40} suffix="px" />
          </Show>
          <Show when={!box.section}>
            <NumberField s={box} update={update} k="padding" label="Padding" min={0} suffix="px" />
          </Show>
        </>
      ),
    },
    {
      id: "background",
      label: "Background & Border",
      icon: SECTION_ICONS.background,
      content: (
        <>
          <BackgroundEditor value={bg} set={setBg} colorLabel={t("pm.inspector.bg.color")} />
          <Group title="Border">
            <NumberField s={box} update={update} k="borderWidth" label={t("pm.inspector.border.width")} min={0} suffix="px" />
            <Show when={box.borderWidth > 0}>
              <ColorField s={box} update={update} k="borderColor" label={t("pm.inspector.border.color")} />
            </Show>
            <NumberField s={box} update={update} k="borderRadius" label={t("pm.inspector.border.radius")} min={0} suffix="px" />
          </Group>
          <SelectField
            s={box}
            update={update}
            k="shadow"
            label={t("pm.inspector.shadow.label")}
            options={[
              { value: "none", label: t("pm.inspector.shadow.none") },
              { value: "sm", label: t("pm.inspector.shadow.sm") },
              { value: "md", label: t("pm.inspector.shadow.md") },
              { value: "lg", label: t("pm.inspector.shadow.lg") },
            ]}
          />
        </>
      ),
    },
  ];
}

/* ------------------------------ komponen --------------------------- */

function IconBtn({
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
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded border border-gray-200 text-gray-500 transition dark:border-gray-700 dark:text-gray-300 ${
        danger
          ? "hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
          : "hover:bg-gray-50 hover:text-gray-800 dark:hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}

export default function Inspector({ root, node, elementExtras, boxExtras, classNameField, on }: InspectorProps) {
  // Subscribe to language changes (the panel functions above use i18n.t directly).
  const { t } = useTranslation();
  const globalVars = useGlobalVars();
  const path = useMemo(() => pathTo(root, node.id), [root, node.id]);
  const parent = path.length > 1 ? (path[path.length - 2] as BoxNode) : null;
  const isRoot = node.id === root.id;
  const Icon = isBox(node) ? BOX_ICON[node.layout] : elementIcon(node.elementType);

  const placeForm = placeToForm(node.place);
  const updatePlace: Updater<PlaceForm> = (k, v) =>
    on.patchPlace(node.id, formToPlace({ ...placeForm, [k]: v }), `place:${node.id}:${String(k)}`);

  let body: React.ReactNode;

  if (isBox(node)) {
    const update: Updater<BoxNode> = (k, v) =>
      on.patchBox(node.id, { [k]: v } as Partial<BoxNode>, `box:${node.id}:${String(k)}`);
    const updateSec: Updater<SectionProps> = (k, v) =>
      on.patchBox(node.id, { section: { ...node.section!, [k]: v } }, `sec:${node.id}:${String(k)}`);
    const sections = boxSections(node, update, node.section ? updateSec : undefined, (p, key) =>
      on.patchBox(node.id, p, key),
    );
    if (boxExtras) {
      const extra = boxExtras(node);
      sections.unshift(...extra.filter((s) => s.lead));
      sections.push(...extra.filter((s) => !s.lead));
    }
    if (parent && parent.layout !== "block") sections.push(placementSection(parent, placeForm, updatePlace));
    body = (
      <PanelStyling
        key={node.id}
        embedded
        sections={sections}
        classNameField={isRoot ? classNameField : undefined}
        onReset={() => on.resetElement(node.id)}
        resetLabel={t("pm.inspector.resetBox")}
        resetConfirmText={t("pm.inspector.resetBoxConfirm")}
      />
    );
  } else {
    const el = node as ElementNode;
    const r = resolveElement(el);
    if (!r.def) {
      body = (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
          <AlertTriangle className="mt-px h-4 w-4 shrink-0" />
          <span>
            {t("pm.inspector.unknownType", { type: el.elementType })}
          </span>
        </div>
      );
    } else {
      const def = r.def;
      const update: Updater<unknown> = (k, v) =>
        on.editElement(el.id, (st) => ({ ...st, [k as string]: v }), `el:${el.id}:${String(k)}`);
      const patch = (p: object) => on.editElement(el.id, (st) => ({ ...st, ...p }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sections = def.sections(r.state, update as Updater<any>, patch);
      // v7: fonts for every text element. Elements with their own font generator
      // show it in the Typography section; the rest get this "Font" section.
      const genericFont = GENERIC_FONT_TYPES.has(el.elementType);
      if (genericFont)
        sections.splice(Math.min(1, sections.length), 0, {
          id: "font",
          label: t("pm.font.section"),
          icon: SECTION_ICONS.typography,
          content: (
            <Field label="Font" hint={t("pm.font.genericHint")}>
              <FontSelect value={typeof r.state.fontFamily === "string" ? r.state.fontFamily : ""} onChange={(v) => update("fontFamily" as never, v as never)} />
            </Field>
          ),
        });
      if (parent && parent.layout !== "block") sections.push(placementSection(parent, placeForm, updatePlace));

      if (elementExtras) {
        const extra = elementExtras(el);
        sections.unshift(...extra.filter((s) => s.lead));
        sections.push(...extra.filter((s) => !s.lead));
      }

      body = (
        <VarPickerProvider value={globalVars}>
          <GenericFontContext.Provider value={genericFont}>
            <PanelStyling
              key={`${el.id}-${el.elementType}`}
              embedded
              sections={sections}
              onReset={() => on.resetElement(el.id)}
              resetLabel={t("pm.inspector.resetElement")}
              resetConfirmText={t("pm.inspector.resetElementConfirm")}
            />
          </GenericFontContext.Provider>
        </VarPickerProvider>
      );
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <nav aria-label={t("pm.inspector.breadcrumb")} className="flex flex-wrap items-center gap-0.5 text-[11px] text-gray-500 dark:text-gray-400">
          {path.map((p, i) => (
            <span key={p.id} className="inline-flex items-center gap-0.5">
              {i > 0 && <ChevronRight className="h-3 w-3 text-gray-300" />}
              <button
                type="button"
                disabled={p.id === node.id}
                onClick={() => on.select(p.id)}
                className={`max-w-28 truncate rounded px-1 py-0.5 ${
                  p.id === node.id
                    ? "font-semibold text-gray-800 dark:text-white/90"
                    : "hover:bg-gray-100 hover:text-gray-800 dark:hover:bg-white/10"
                }`}
              >
                {p.name}
              </button>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-blue-700 dark:text-blue-300" />
          <div className="min-w-0 flex-1">
            <TextInput
              value={node.name}
              onChange={(v) => on.rename(node.id, v.slice(0, 60))}
              placeholder={t("pm.inspector.nodeName")}
            />
          </div>
          {!isRoot && (
            <div className="flex shrink-0 items-center gap-1">
              <IconBtn label={t("pm.inspector.duplicate")} onClick={() => on.duplicate(node.id)}>
                <Copy className="h-3.5 w-3.5" />
              </IconBtn>
              {!(isBox(node) && (node.section || node.row)) && (
                <IconBtn label={t("pm.inspector.wrap")} onClick={() => on.wrap(node.id)}>
                  <PackagePlus className="h-3.5 w-3.5" />
                </IconBtn>
              )}
              {isBox(node) && !node.section && !node.row && (
                <IconBtn label={t("pm.inspector.unwrap")} onClick={() => on.unwrap(node.id)}>
                  <PackageOpen className="h-3.5 w-3.5" />
                </IconBtn>
              )}
              <IconBtn label={t("pm.inspector.delete")} danger onClick={() => on.remove(node.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconBtn>
            </div>
          )}
        </div>
      </div>

      {body}
    </div>
  );
}
