import { shadowLine, widthCss } from "../../helpers/generatorCss";
import { h, renderHtml } from "../../helpers/markup";
import { BorderSection, SECTION_ICONS, ShadowSection, SizingSection, TransitionFields, TypographySection, type PanelSection } from "../../ui/PanelStyling";
import ItemListEditor from "../../ui/ItemListEditor";
import { Group, Row } from "../../helpers/SmallUIHelpers";
import {
  ColorField,
  NumberField,
  SegmentedField,
  SelectField,
  Show,
  ToggleField,
  type Updater,
} from "../../ui/fields";
import { defineElement, type ElementSpec } from "../../helpers/elementDefinition";
import i18n from "../../../../../i18n";

/* ------------------------------------------------------------------ */
/* State                                                               */
/* ------------------------------------------------------------------ */

interface TabData extends Record<string, string> {
  title: string;
  content: string;
}

export interface TabsState {
  tabs: TabData[];
  variant: "underline" | "pills" | "boxed";
  align: "start" | "center" | "end" | "stretch";

  widthMode: "auto" | "fixed" | "full";
  width: number;

  /* Tab */
  tabPaddingX: number;
  tabPaddingY: number;
  tabGap: number;
  tabRadius: number;
  fontSize: number;
  fontWeight: number;
  textColor: string;
  hoverTextColor: string;
  activeTextColor: string;
  activeBgColor: string;
  indicatorColor: string;
  indicatorHeight: number;
  listBgColor: string;
  listBorderEnabled: boolean;
  listBorderColor: string;

  /* Content panel */
  panelPaddingX: number;
  panelPaddingY: number;
  panelFontSize: number;
  panelFontWeight: number;
  panelTextColor: string;
  panelBgColor: string;

  /* Outer box */
  borderWidth: number;
  borderStyle: "none" | "solid" | "dashed" | "dotted";
  borderColor: string;
  borderRadius: number;
  pill: boolean;
  shadowEnabled: boolean;
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowSpread: number;
  shadowColor: string;
  shadowOpacity: number;

  transitionDuration: number;
  transitionEasing: string;
}

const DEFAULT_STATE: TabsState = {
  tabs: [
    { title: "Ringkasan", content: "Gambaran umum produk: fitur utama, manfaat, dan siapa yang cocok memakainya." },
    { title: "Spesifikasi", content: "Prosesor 8 inti, RAM 16 GB, penyimpanan 512 GB SSD, layar 14 inci 120 Hz." },
    { title: "Ulasan", content: "Rata-rata penilaian 4,8 dari 5 berdasarkan 1.204 ulasan pembeli." },
  ],
  variant: "underline",
  align: "start",

  widthMode: "fixed",
  width: 520,

  tabPaddingX: 16,
  tabPaddingY: 10,
  tabGap: 4,
  tabRadius: 8,
  fontSize: 14,
  fontWeight: 600,
  textColor: "#6b7280",
  hoverTextColor: "#111827",
  activeTextColor: "#012060",
  activeBgColor: "#eff6ff",
  indicatorColor: "#012060",
  indicatorHeight: 2,
  listBgColor: "#f3f4f6",
  listBorderEnabled: true,
  listBorderColor: "#e5e7eb",

  panelPaddingX: 4,
  panelPaddingY: 16,
  panelFontSize: 14,
  panelFontWeight: 400,
  panelTextColor: "#374151",
  panelBgColor: "transparent",

  borderWidth: 0,
  borderStyle: "solid",
  borderColor: "#e5e7eb",
  borderRadius: 12,
  pill: false,
  shadowEnabled: false,
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 12,
  shadowSpread: 0,
  shadowColor: "#000000",
  shadowOpacity: 8,

  transitionDuration: 150,
  transitionEasing: "ease",
};

const DEFAULT_CLASS_NAME = "custom-tabs";

/* ------------------------------------------------------------------ */
/* CSS                                                                 */
/* ------------------------------------------------------------------ */

const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" } as const;

function generateTabsCss(s: TabsState, cls: string): string {
  const t = `${s.transitionDuration}ms ${s.transitionEasing}`;
  const hasBox = s.borderWidth > 0 && s.borderStyle !== "none";
  const rules: string[] = [];

  rules.push(`.${cls} {
  box-sizing: border-box;
  max-width: 100%;
${widthCss(s)}${hasBox ? `  border: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor};\n  border-radius: ${s.pill ? "24px" : `${s.borderRadius}px`};\n  padding: 12px;\n` : ""}${shadowLine(s)}}`);

  const listBase = [
    "  display: flex;",
    `  justify-content: ${JUSTIFY[s.align]};`,
    `  gap: ${s.tabGap}px;`,
    "  overflow-x: auto;",
  ];
  if (s.variant === "underline" && s.listBorderEnabled)
    listBase.push(`  border-bottom: 1px solid ${s.listBorderColor};`);
  if (s.variant === "boxed")
    listBase.push(`  padding: 4px;`, `  background: ${s.listBgColor};`, `  border-radius: ${s.tabRadius + 4}px;`);
  rules.push(`.${cls}__list {\n${listBase.join("\n")}\n}`);

  rules.push(`.${cls}__tab {
  ${s.align === "stretch" ? "flex: 1;\n  " : ""}padding: ${s.tabPaddingY}px ${s.tabPaddingX}px;
  border: 0;
  ${s.variant === "underline" ? `border-bottom: ${s.indicatorHeight}px solid transparent;\n  margin-bottom: ${s.listBorderEnabled ? -1 : 0}px;\n  border-radius: 0;` : `border-radius: ${s.tabRadius}px;`}
  background: transparent;
  color: ${s.textColor};
  font-family: inherit;
  font-size: ${s.fontSize}px;
  font-weight: ${s.fontWeight};
  white-space: nowrap;
  cursor: pointer;
  transition: color ${t}, background-color ${t}, border-color ${t}, box-shadow ${t};
}`);

  rules.push(`.${cls}__tab:hover {
  color: ${s.hoverTextColor};
}`);

  rules.push(`.${cls}__tab:focus-visible {
  outline: 2px solid ${s.indicatorColor};
  outline-offset: 2px;
}`);

  const active =
    s.variant === "underline"
      ? `  color: ${s.activeTextColor};\n  border-bottom-color: ${s.indicatorColor};`
      : s.variant === "pills"
        ? `  color: ${s.activeTextColor};\n  background: ${s.activeBgColor};`
        : `  color: ${s.activeTextColor};\n  background: ${s.activeBgColor};\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);`;
  rules.push(`.${cls}__tab[aria-selected="true"] {\n${active}\n}`);

  rules.push(`.${cls}__panel {
  padding: ${s.panelPaddingY}px ${s.panelPaddingX}px;
  background: ${s.panelBgColor};
  color: ${s.panelTextColor};
  font-size: ${s.panelFontSize}px;
  font-weight: ${s.panelFontWeight};
  line-height: 1.6;
}`);

  // Make sure hidden panels are really gone even if other CSS sets display.
  rules.push(`.${cls}__panel[hidden] {
  display: none;
}`);

  return rules.join("\n\n") + "\n";
}

/* ------------------------------------------------------------------ */
/* Kode per framework                                                  */
/* ------------------------------------------------------------------ */

/** JSON that is safe to embed in a <script> (escapes "<" so it does not close the tag). */
const jsData = (tabs: TabData[]) =>
  JSON.stringify(
    tabs.map((t) => ({ title: t.title, content: t.content })),
    null,
    2,
  ).replace(/</g, "\\u003c");

const KEYDOWN_BODY = `const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
let next;
if (step) next = (i + step + tabs.length) % tabs.length;
else if (e.key === "Home") next = 0;
else if (e.key === "End") next = tabs.length - 1;
else return;
e.preventDefault();
// Move focus to the target tab (a sibling inside the same tablist).
e.currentTarget.parentElement.children[next].focus();`;

function staticMarkup(s: TabsState, cls: string) {
  return h(
    "div",
    { class: cls },
    h(
      "div",
      { class: `${cls}__list`, role: "tablist" },
      s.tabs.map((tab, i) =>
        h(
          "button",
          {
            type: "button",
            class: `${cls}__tab`,
            role: "tab",
            id: `${cls}-tab-${i}`,
            "aria-controls": `${cls}-panel-${i}`,
            "aria-selected": String(i === 0),
            tabindex: i === 0 ? "0" : "-1",
          },
          tab.title,
        ),
      ),
    ),
    s.tabs.map((tab, i) =>
      h(
        "div",
        {
          class: `${cls}__panel`,
          role: "tabpanel",
          id: `${cls}-panel-${i}`,
          "aria-labelledby": `${cls}-tab-${i}`,
          tabindex: "0",
          hidden: i !== 0,
        },
        tab.content,
      ),
    ),
  );
}

function tabsSpec(s: TabsState, cls: string): ElementSpec {
  const css = generateTabsCss(s, cls);
  const data = jsData(s.tabs);
  const P = cls; // prefix id

  return {
    css,
    html: {
      body: renderHtml(staticMarkup(s, cls)),
      script: `// Tabs aksesibel: klik & navigasi keyboard (← → Home End)
document.querySelectorAll(".${cls}").forEach((root) => {
  const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
  const panels = Array.from(root.querySelectorAll('[role="tabpanel"]'));

  function select(index, focus) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus();
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i, false));
    tab.addEventListener("keydown", (e) => {
${KEYDOWN_BODY.split("\n").map((l) => "      " + l).join("\n")}
      select(next, false);
    });
  });
});`,
    },
    react: {
      imports: `import { useState } from "react";`,
      pre: `const tabs = ${data};

const [active, setActive] = useState(0);

function onKeyDown(e, i) {
${KEYDOWN_BODY.split("\n").map((l) => "  " + l).join("\n")}
  setActive(next);
}`,
      jsx: `<div className="${cls}">
  <div className="${cls}__list" role="tablist">
    {tabs.map((tab, i) => (
      <button
        key={i}
        type="button"
        className="${cls}__tab"
        role="tab"
        id={\`${P}-tab-\${i}\`}
        aria-controls={\`${P}-panel-\${i}\`}
        aria-selected={active === i}
        tabIndex={active === i ? 0 : -1}
        onClick={() => setActive(i)}
        onKeyDown={(e) => onKeyDown(e, i)}
      >
        {tab.title}
      </button>
    ))}
  </div>
  {tabs.map((tab, i) => (
    <div
      key={i}
      className="${cls}__panel"
      role="tabpanel"
      id={\`${P}-panel-\${i}\`}
      aria-labelledby={\`${P}-tab-\${i}\`}
      tabIndex={0}
      hidden={active !== i}
    >
      {tab.content}
    </div>
  ))}
</div>`,
    },
    vue: {
      script: `import { ref } from "vue";

const tabs = ${data};

const active = ref(0);

function onKeydown(e, i) {
${KEYDOWN_BODY.split("\n").map((l) => "  " + l).join("\n")}
  active.value = next;
}`,
      template: `<div class="${cls}">
  <div class="${cls}__list" role="tablist">
    <button
      v-for="(tab, i) in tabs"
      :key="i"
      type="button"
      class="${cls}__tab"
      role="tab"
      :id="'${P}-tab-' + i"
      :aria-controls="'${P}-panel-' + i"
      :aria-selected="String(active === i)"
      :tabindex="active === i ? 0 : -1"
      @click="active = i"
      @keydown="onKeydown($event, i)"
    >
      {{ tab.title }}
    </button>
  </div>
  <div
    v-for="(tab, i) in tabs"
    :key="'panel-' + i"
    v-show="active === i"
    class="${cls}__panel"
    role="tabpanel"
    :id="'${P}-panel-' + i"
    :aria-labelledby="'${P}-tab-' + i"
    tabindex="0"
  >
    {{ tab.content }}
  </div>
</div>`,
    },
    svelte: {
      script: `const tabs = ${data};

let active = 0;

function onKeydown(e, i) {
${KEYDOWN_BODY.split("\n").map((l) => "  " + l).join("\n")}
  active = next;
}`,
      markup: `<div class="${cls}">
  <div class="${cls}__list" role="tablist">
    {#each tabs as tab, i}
      <button
        type="button"
        class="${cls}__tab"
        role="tab"
        id="${P}-tab-{i}"
        aria-controls="${P}-panel-{i}"
        aria-selected={active === i}
        tabindex={active === i ? 0 : -1}
        on:click={() => (active = i)}
        on:keydown={(e) => onKeydown(e, i)}
      >
        {tab.title}
      </button>
    {/each}
  </div>
  {#each tabs as tab, i}
    <div
      class="${cls}__panel"
      role="tabpanel"
      id="${P}-panel-{i}"
      aria-labelledby="${P}-tab-{i}"
      tabindex="0"
      hidden={active !== i}
    >
      {tab.content}
    </div>
  {/each}
</div>`,
    },
    angular: {
      classBody: `tabs = ${data.replace(/\n/g, "\n")};

active = 0;

onKeydown(e: KeyboardEvent, i: number) {
  const tabs = this.tabs;
${KEYDOWN_BODY.replace("const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];", "const step = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];")
  .replace("let next;", "let next: number;")
  .replace("e.currentTarget.parentElement.children[next].focus();", "((e.currentTarget as HTMLElement).parentElement?.children[next] as HTMLElement | undefined)?.focus();")
  .split("\n")
  .map((l) => "  " + l)
  .join("\n")}
  this.active = next;
}`,
      template: `<div class="${cls}">
  <div class="${cls}__list" role="tablist">
    @for (tab of tabs; track $index; let i = $index) {
      <button
        type="button"
        class="${cls}__tab"
        role="tab"
        [id]="'${P}-tab-' + i"
        [attr.aria-controls]="'${P}-panel-' + i"
        [attr.aria-selected]="active === i"
        [attr.tabindex]="active === i ? 0 : -1"
        (click)="active = i"
        (keydown)="onKeydown($event, i)"
      >
        {{ tab.title }}
      </button>
    }
  </div>
  @for (tab of tabs; track $index; let i = $index) {
    <div
      class="${cls}__panel"
      role="tabpanel"
      [id]="'${P}-panel-' + i"
      [attr.aria-labelledby]="'${P}-tab-' + i"
      tabindex="0"
      [hidden]="active !== i"
    >
      {{ tab.content }}
    </div>
  }
</div>`,
    },
  };
}

/* ------------------------------------------------------------------ */
/* Panel                                                               */
/* ------------------------------------------------------------------ */

function tabsSections(s: TabsState, update: Updater<TabsState>): PanelSection[] {
  const p = { s, update };
  return [
    {
      id: "items",
      label: i18n.t("el.f.tab"),
      icon: SECTION_ICONS.items,
      content: (
        <ItemListEditor
          items={s.tabs}
          onChange={(v) => update("tabs", v)}
          itemLabel={i18n.t("el.f.tab")}
          max={8}
          fields={[
            { key: "title", label: i18n.t("el.f.tabTitle") },
            { key: "content", label: i18n.t("el.f.body"), multiline: true },
          ]}
          newItem={(i) => ({ title: `Tab ${i + 1}`, content: "Isi tab baru." })}
        />
      ),
    },
    {
      id: "style",
      label: i18n.t("el.f.tabStyle"),
      icon: SECTION_ICONS.layout,
      content: (
        <>
          <SelectField
            {...p}
            k="variant"
            label={i18n.t("el.f.variant")}
            options={[
              { value: "underline", label: i18n.t("el.f.underline") },
              { value: "pills", label: i18n.t("el.f.pills") },
              { value: "boxed", label: i18n.t("el.f.boxedSegmented") },
            ]}
          />
          <SegmentedField
            {...p}
            k="align"
            label={i18n.t("el.f.alignment")}
            options={[
              { value: "start", label: i18n.t("el.f.left") },
              { value: "center", label: i18n.t("el.f.center") },
              { value: "end", label: i18n.t("el.f.right") },
              { value: "stretch", label: i18n.t("el.f.full") },
            ]}
          />
          <Row>
            <NumberField {...p} k="tabPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="tabPaddingY" label="Padding Y" min={0} />
          </Row>
          <Row>
            <NumberField {...p} k="tabGap" label={i18n.t("el.f.tabGap")} min={0} />
            <Show when={s.variant !== "underline"}>
              <NumberField {...p} k="tabRadius" label={i18n.t("el.f.tabRadius")} min={0} />
            </Show>
          </Row>
          <Group title={i18n.t("el.f.color")}>
            <Row>
              <ColorField {...p} k="textColor" label={i18n.t("el.f.text")} />
              <ColorField {...p} k="hoverTextColor" label={i18n.t("el.f.textHover")} />
            </Row>
            <ColorField {...p} k="activeTextColor" label={i18n.t("el.f.activeTabText")} />
            <Show when={s.variant !== "underline"}>
              <ColorField {...p} k="activeBgColor" label={i18n.t("el.f.activeTabBg")} />
            </Show>
            <Show when={s.variant === "boxed"}>
              <ColorField {...p} k="listBgColor" label={i18n.t("el.f.tabListBg")} />
            </Show>
          </Group>
          <Show when={s.variant === "underline"}>
            <Group title={i18n.t("el.f.indicatorLine")}>
              <Row>
                <ColorField {...p} k="indicatorColor" label={i18n.t("el.f.color")} />
                <NumberField {...p} k="indicatorHeight" label={i18n.t("el.f.thickness")} min={1} />
              </Row>
              <ToggleField {...p} k="listBorderEnabled" label={i18n.t("el.f.baseLine")} />
              <Show when={s.listBorderEnabled}>
                <ColorField {...p} k="listBorderColor" label={i18n.t("el.f.baseLineColor")} />
              </Show>
            </Group>
          </Show>
        </>
      ),
    },
    {
      id: "typography",
      label: i18n.t("el.f.tabTypography"),
      icon: SECTION_ICONS.typography,
      content: <TypographySection {...p} keys={{ size: "fontSize", weight: "fontWeight" }} />,
    },
    {
      id: "panel",
      label: i18n.t("el.f.contentPanel"),
      icon: SECTION_ICONS.content,
      content: (
        <>
          <TypographySection
            {...p}
            keys={{ size: "panelFontSize", weight: "panelFontWeight", color: "panelTextColor" }}
          />
          <Row>
            <NumberField {...p} k="panelPaddingX" label="Padding X" min={0} />
            <NumberField {...p} k="panelPaddingY" label="Padding Y" min={0} />
          </Row>
          <ColorField {...p} k="panelBgColor" label={i18n.t("el.f.panelBg")} />
        </>
      ),
    },
    { id: "sizing", label: i18n.t("el.f.size"), icon: SECTION_ICONS.sizing, content: <SizingSection {...p} /> },
    { id: "border", label: i18n.t("el.f.outerBox"), icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: i18n.t("el.f.shadow"), icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "transition", label: i18n.t("el.f.transition"), icon: SECTION_ICONS.animation, content: <TransitionFields {...p} /> },
  ];
}



/* ------------------------------------------------------------------ */
/* Definition: used by this page and Component Maker                    */
/* ------------------------------------------------------------------ */

export const tabsElement = defineElement<TabsState>({
  type: "tabs",
  label: "Tabs",
  group: "Navigasi",
  componentName: "Tabs",
  defaultClassName: DEFAULT_CLASS_NAME,
  defaults: DEFAULT_STATE,
  spec: tabsSpec,
  sections: tabsSections,
});
