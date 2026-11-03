import {
  BoxStyle,
  ShadowStyle,
  shadowLine,
  TypographyStyle,
  widthCss,
} from "../../helpers/generatorCss";
import { h } from "../../helpers/markup";
import { SECTION_ICONS, ShadowSection, SizingSection, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import { Field, Group, Row, SyncedTextarea } from "../../helpers/SmallUIHelpers";
import {
  ALIGN_OPTIONS,
  ColorField,
  FONT_WEIGHT_OPTIONS,
  NumberField,
  SelectField,
  Show,
  TextField,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* TableState                                                          */
/* ------------------------------------------------------------------ */

export interface TableState
  extends Pick<BoxStyle, "widthMode" | "width" | "borderRadius">,
    ShadowStyle,
    Pick<TypographyStyle, "fontSize" | "textColor"> {
  columns: { id: string; label: string }[];
  /** Data contoh untuk preview & kode export. */
  rows: string[][];
  caption: string;

  textAlign: "left" | "center" | "right";
  cellPaddingX: number;
  cellPaddingY: number;
  bodyBgColor: string;

  headerBgColor: string;
  headerTextColor: string;
  headerFontWeight: number;
  headerUppercase: boolean;

  stripedRows: boolean;
  stripeColor: string;

  rowHoverEnabled: boolean;
  rowHoverColor: string;

  dividerColor: string;
  dividerWidth: number;
  verticalDividers: boolean;

  outerBorderEnabled: boolean;
  outerBorderColor: string;
}

const DEFAULT_STATE: TableState = {
  widthMode: "full",
  width: 600,
  borderRadius: 8,

  shadowEnabled: true,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 6,
  shadowSpread: -1,
  shadowColor: "#000000",
  shadowOpacity: 10,

  fontSize: 14,
  textColor: "#374151",
  textAlign: "left",

  columns: [
    { id: "col-0", label: "ID" },
    { id: "col-1", label: "Nama" },
    { id: "col-2", label: "Email" },
    { id: "col-3", label: "Peran" },
  ],
  rows: [
    ["1", "John Doe", "john@example.com", "Admin"],
    ["2", "Jane Smith", "jane@example.com", "Editor"],
    ["3", "Bob Wilson", "bob@example.com", "User"],
    ["4", "Alice Brown", "alice@example.com", "User"],
  ],
  caption: "",

  cellPaddingX: 16,
  cellPaddingY: 12,
  bodyBgColor: "#ffffff",

  headerBgColor: "#f9fafb",
  headerTextColor: "#111827",
  headerFontWeight: 600,
  headerUppercase: false,

  stripedRows: true,
  stripeColor: "#f3f4f6",

  rowHoverEnabled: true,
  rowHoverColor: "#e5e7eb",

  dividerColor: "#e5e7eb",
  dividerWidth: 1,
  verticalDividers: false,

  outerBorderEnabled: true,
  outerBorderColor: "#e5e7eb",
};

const DEFAULT_CLASS_NAME = "custom-table";

/* ------------------------------------------------------------------ */
/* CSS generator khusus Table                                          */
/* ------------------------------------------------------------------ */

function generateTableCss(s: TableState, cls: string): string {
  const line = `${s.dividerWidth}px solid ${s.dividerColor}`;
  const rules: string[] = [];

  rules.push(`.${cls}-wrapper {
  box-sizing: border-box;
  max-width: 100%;
  overflow-x: auto;
${widthCss(s)}${s.outerBorderEnabled ? `  border: ${s.dividerWidth || 1}px solid ${s.outerBorderColor};\n` : ""}  border-radius: ${s.borderRadius}px;
  background: ${s.bodyBgColor};
${shadowLine(s)}}`);

  rules.push(`.${cls} {
  width: 100%;
  border-collapse: collapse;
  font-size: ${s.fontSize}px;
  color: ${s.textColor};
  text-align: ${s.textAlign};
}`);

  if (s.caption.trim()) {
    rules.push(`.${cls} caption {
  padding: ${s.cellPaddingY}px ${s.cellPaddingX}px;
  text-align: left;
  font-weight: 600;
  caption-side: top;
}`);
  }

  rules.push(`.${cls} th,
.${cls} td {
  padding: ${s.cellPaddingY}px ${s.cellPaddingX}px;
  border-bottom: ${line};${s.verticalDividers ? `\n  border-right: ${line};` : ""}
}`);

  if (s.verticalDividers) {
    rules.push(`.${cls} th:last-child,
.${cls} td:last-child {
  border-right: none;
}`);
  }

  rules.push(`.${cls} th {
  background-color: ${s.headerBgColor};
  color: ${s.headerTextColor};
  font-weight: ${s.headerFontWeight};${s.headerUppercase ? "\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  font-size: 0.85em;" : ""}
}`);

  rules.push(`.${cls} tbody tr:last-child td {
  border-bottom: none;
}`);

  if (s.stripedRows) {
    rules.push(`.${cls} tbody tr:nth-child(even) {
  background-color: ${s.stripeColor};
}`);
  }

  if (s.rowHoverEnabled) {
    rules.push(`.${cls} tbody tr {
  transition: background-color 150ms ease;
}

.${cls} tbody tr:hover {
  background-color: ${s.rowHoverColor};
}`);
  }

  return rules.join("\n\n") + "\n";
}

function buildMarkup(s: TableState, cls: string) {
  const colCount = s.columns.length;
  return h(
    "div",
    { class: `${cls}-wrapper` },
    h(
      "table",
      { class: cls },
      s.caption.trim() ? h("caption", {}, s.caption) : null,
      h("thead", {}, h("tr", {}, s.columns.map((c) => h("th", { scope: "col" }, c.label)))),
      h(
        "tbody",
        {},
        s.rows.map((row) =>
          h(
            "tr",
            {},
            // Samakan jumlah sel dengan jumlah kolom supaya tabel tidak "bolong".
            Array.from({ length: colCount }, (_, i) => h("td", {}, row[i] ?? "")),
          ),
        ),
      ),
    ),
  );
}

/* ------------------------------------------------------------------ */
/* Editor data (kolom & baris)                                         */
/* ------------------------------------------------------------------ */

const SEP = " | ";
const splitCells = (line: string) => line.split("|").map((c) => c.trim());

const formatColumns = (cols: TableState["columns"]) => cols.map((c) => c.label).join(SEP);
const parseColumns = (text: string): TableState["columns"] =>
  splitCells(text.replace(/\n/g, " "))
    .filter((c, i, arr) => c !== "" || i < arr.length - 1)
    .map((label, i) => ({ id: `col-${i}`, label }));

const formatRows = (rows: string[][]) => rows.map((r) => r.join(SEP)).join("\n");
const parseRows = (text: string) =>
  text
    .split("\n")
    .filter((l) => l.trim() !== "")
    .map(splitCells);

function TableDataEditor({ s, update }: { s: TableState; update: Updater<TableState> }) {
  return (
    <>
      <Field label={i18n.t("el.f.columnHeaders")} hint={i18n.t("el.f.columnHeadersHint")}>
        <SyncedTextarea
          value={s.columns}
          onChange={(v) => update("columns", v)}
          format={formatColumns}
          parse={parseColumns}
          rows={2}
        />
      </Field>
      <Field label={i18n.t("el.f.dataRows")} hint={i18n.t("el.f.dataRowsHint")}>
        <SyncedTextarea
          value={s.rows}
          onChange={(v) => update("rows", v)}
          format={formatRows}
          parse={parseRows}
          rows={6}
        />
      </Field>
      <TextField
        s={s}
        update={update}
        k="caption"
        label={i18n.t("el.f.captionOptional")}
        hint={i18n.t("el.f.captionHint")}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function tableSections(s: TableState, update: Updater<TableState>): PanelSection[] {
  const p = { s, update };
  return [
    { id: "data", label: i18n.t("el.f.data"), icon: SECTION_ICONS.items, content: <TableDataEditor {...p} /> },
    {
      id: "header",
      label: i18n.t("el.f.header"),
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <Row>
            <ColorField {...p} k="headerBgColor" label={i18n.t("el.f.background")} />
            <ColorField {...p} k="headerTextColor" label={i18n.t("el.f.text")} />
          </Row>
          <SelectField {...p} k="headerFontWeight" label={i18n.t("el.f.weight")} options={FONT_WEIGHT_OPTIONS} />
          <ToggleField {...p} k="headerUppercase" label={i18n.t("el.f.smallCaps")} />
        </>
      ),
    },
    {
      id: "cells",
      label: i18n.t("el.f.cellsTypography"),
      icon: SECTION_ICONS.typography,
      content: (
        <>
          <TypographySection {...p} />
          <SelectField {...p} k="textAlign" label={i18n.t("el.f.alignment")} options={ALIGN_OPTIONS} />
          <Row>
            <NumberField {...p} k="cellPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="cellPaddingY" label="Padding Y" min={0} />
          </Row>
          <ColorField {...p} k="bodyBgColor" label={i18n.t("el.f.tableBg")} />
        </>
      ),
    },
    {
      id: "rows",
      label: i18n.t("el.f.rows"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <Group title={i18n.t("el.f.striped")}>
            <ToggleField {...p} k="stripedRows" label={i18n.t("el.f.stripedRows")} />
            <Show when={s.stripedRows}>
              <ColorField {...p} k="stripeColor" label={i18n.t("el.f.stripeColor")} />
            </Show>
          </Group>
          <Group title={i18n.t("el.f.hover")}>
            <ToggleField {...p} k="rowHoverEnabled" label={i18n.t("el.f.highlightRowHover")} />
            <Show when={s.rowHoverEnabled}>
              <ColorField {...p} k="rowHoverColor" label={i18n.t("el.f.hoverColor")} />
            </Show>
          </Group>
        </>
      ),
    },
    {
      id: "border",
      label: i18n.t("el.f.linesBorder"),
      icon: SECTION_ICONS.border,
      content: (
        <>
          <Row>
            <NumberField {...p} k="dividerWidth" label={i18n.t("el.f.lineWidth")} min={0} />
            <ColorField {...p} k="dividerColor" label={i18n.t("el.f.lineColor")} />
          </Row>
          <ToggleField {...p} k="verticalDividers" label={i18n.t("el.f.verticalDividers")} />
          <Group title={i18n.t("el.f.outerBorder")}>
            <ToggleField {...p} k="outerBorderEnabled" label={i18n.t("el.f.showOuterBorder")} />
            <Show when={s.outerBorderEnabled}>
              <ColorField {...p} k="outerBorderColor" label={i18n.t("el.f.outerBorderColor")} />
            </Show>
            <NumberField {...p} k="borderRadius" label={i18n.t("el.f.cornerRadius")} min={0} />
          </Group>
        </>
      ),
    },
    { id: "sizing", label: i18n.t("el.f.size"), icon: SECTION_ICONS.sizing, content: <SizingSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definisi — dipakai halaman ini dan Component Maker                  */
/* ------------------------------------------------------------------ */

export const tableElement = defineElement<TableState>({
  type: "table",
  label: "Table",
  group: "Data",
  componentName: "Table",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  rootClass: (cls) => `${cls}-wrapper`,
  spec: (s, cls) => ({ css: generateTableCss(s, cls), markup: buildMarkup(s, cls) }),
  sections: tableSections,
});
