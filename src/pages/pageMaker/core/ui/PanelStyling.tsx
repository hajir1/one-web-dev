import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../../i18n";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import {
  AlignLeft,
  ChevronDown,
  CircleDashed,
  Focus,
  Hash,
  Image as ImageIcon,
  LayoutGrid,
  List as ListIcon,
  MousePointer2,
  MousePointerClick,
  Move,
  Palette,
  RotateCcw,
  Ruler,
  Sparkles,
  Square,
  Type,
  Wand2,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  ColorInput,
  Field,
  Group,
  NumberInput,
  RangeInput,
  Row,
  Section,
  SelectInput,
  SelectOption,
  TextInput,
  Toggle,
} from "../helpers/SmallUIHelpers";
import {
  ALIGN_OPTIONS,
  EASING_OPTIONS,
  FONT_WEIGHT_OPTIONS,
  HOVER_TRANSFORM_OPTIONS,
  WIDTH_MODE_OPTIONS,
  type Updater,
} from "./fields";
import IconSelect from "../helpers/icon/IconSelect";
import FontSelect from "./FontSelect";
import BackgroundEditor from "./BackgroundEditor";
import type { BgFields, BgKind } from "../helpers/background";
import type { StyleState } from "../helpers/generatorCss";
import type { SavedDesign } from "../store/designStore";

export type { Updater } from "./fields";

/**
 * UI text for the generic sections in this file. Called at render time, so
 * it always follows the active language (PanelStyling subscribes via useTranslation).
 */
const t = (key: string, opts?: Record<string, unknown>): string => i18n.t(key, opts);

/* ==================================================================== */
/* Tipe umum                                                            */
/* ==================================================================== */

/**
 * All state & actions for managing the saved design list (Zustand).
 * The same for any element; produced by `useDesignSaver`.
 */
export interface DesignManagerProps {
  designs: SavedDesign[];
  activeDesign: SavedDesign | null;
  activeDesignId: string | null;

  designNameInput: string;
  setDesignNameInput: Dispatch<SetStateAction<string>>;

  renamingId: string | null;
  renameValue: string;
  setRenameValue: Dispatch<SetStateAction<string>>;

  /** Saves as a NEW design. Returns the id, or null when the free quota is full. */
  handleSaveNew: (name?: string) => string | null;
  /** Updates the currently open design (does not use quota). */
  handleSaveChanges: () => boolean;
  handleNewDesign: () => void;
  /** Saves a copy of the active design (counts as a new design). null when the quota is full. */
  handleDuplicate: () => string | null;
  /** Free design limit (undefined = unlimited). */
  freeLimit?: number;
  /** true when the design count has reached the free limit. */
  limitReached: boolean;
  /** true when there are unsaved changes. */
  isDirty: boolean;
  handleLoad: (design: SavedDesign) => void;
  handleDelete: (id: string) => void;
  startRename: (design: SavedDesign) => void;
  confirmRename: () => void;
  cancelRename: () => void;
}

/** One category in the panel accordion. */
export interface PanelSection {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
  /** true = not shown (handy for conditional sections). */
  hidden?: boolean;
  /** true = placed at the very top (and open) in Settings, e.g. Data collection. */
  lead?: boolean;
}

/**
 * Props for every shared section. Sections are "adaptive": each field
 * is only shown when its key REALLY EXISTS in the state `s`. So elements
 * with different state shapes (Checkbox without borderStyle, Table without
 * padding, etc.) can use the same section; there is no longer any need for
 * a `toBoxLike()` adapter that fills in fake fields.
 *
 * Key names can be passed through `keys` when they differ from the default
 * (e.g. Card: `keys={{ size: "titleFontSize" }}`).
 */
export interface SectionProps<S> {
  s: S;
  update: Updater<S>;
}

/** Loose string-based access, used internally by the generic sections. */
function loose<S>(s: S, update: Updater<S>) {
  const o = s as unknown as Record<string, unknown>;
  const setter = update as unknown as (k: string, v: unknown) => void;
  return {
    has: (k: string | undefined): k is string => !!k && k in o,
    num: (k: string) => Number(o[k] ?? 0),
    str: (k: string) => String(o[k] ?? ""),
    bool: (k: string) => Boolean(o[k]),
    set: (k: string, v: unknown) => setter(k, v),
  };
}
type Loose = ReturnType<typeof loose>;

/* -------- small controls for loose access (internal) -------- */

function LNum({
  f,
  k,
  label,
  min,
  max,
  suffix,
}: {
  f: Loose;
  k: string;
  label: string;
  min?: number;
  max?: number;
  suffix?: string;
}) {
  if (!f.has(k)) return null;
  return (
    <Field label={label}>
      <NumberInput
        value={f.num(k)}
        onChange={(v) => f.set(k, v)}
        min={min}
        max={max}
        suffix={suffix}
      />
    </Field>
  );
}

function LColor({ f, k, label }: { f: Loose; k: string; label: string }) {
  if (!f.has(k)) return null;
  return (
    <Field label={label}>
      <ColorInput value={f.str(k)} onChange={(v) => f.set(k, v)} />
    </Field>
  );
}

function LSelect<V extends string | number>({
  f,
  k,
  label,
  options,
}: {
  f: Loose;
  k: string;
  label: string;
  options: readonly SelectOption<V>[];
}) {
  if (!f.has(k)) return null;
  const numeric = typeof options[0]?.value === "number";
  return (
    <Field label={label}>
      <SelectInput
        value={(numeric ? f.num(k) : f.str(k)) as V}
        onChange={(v) => f.set(k, v)}
        options={options}
      />
    </Field>
  );
}

function LRange({
  f,
  k,
  label,
  min,
  max,
  step,
  unit = "",
}: {
  f: Loose;
  k: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  unit?: string;
}) {
  if (!f.has(k)) return null;
  return (
    <Field label={`${label}: ${f.num(k)}${unit}`}>
      <RangeInput
        value={f.num(k)}
        onChange={(v) => f.set(k, v)}
        min={min}
        max={max}
        step={step}
      />
    </Field>
  );
}

function LToggle({ f, k, label }: { f: Loose; k: string; label: string }) {
  if (!f.has(k)) return null;
  return (
    <Toggle checked={f.bool(k)} onChange={(v) => f.set(k, v)} label={label} />
  );
}

/** A 2-column row that automatically becomes 1 column when one of the fields is missing. */
function AutoRow({ children }: { children: ReactNode[] }) {
  const items = children.filter(Boolean);
  if (items.length === 0) return null;
  if (items.length === 1) return <>{items}</>;
  return <Row>{items}</Row>;
}

/* ==================================================================== */
/* Section bersama                                                      */
/* ==================================================================== */

/** Content text + alignment. `children` = extra element-specific fields. */
function ContentSection<S>({
  s,
  update,
  textKey = "text",
  alignKey = "textAlign",
  textLabel = t("pm.styling.text"),
  multiline = false,
  children,
}: SectionProps<S> & {
  textKey?: string;
  alignKey?: string | null;
  textLabel?: string;
  multiline?: boolean;
  children?: ReactNode;
}) {
  const f = loose(s, update);
  return (
    <>
      {f.has(textKey) && (
        <Field label={textLabel}>
          <TextInput
            value={f.str(textKey)}
            onChange={(v) => f.set(textKey, v)}
            multiline={multiline}
          />
        </Field>
      )}
      {children}
      {alignKey && (
        <LSelect
          f={f}
          k={alignKey}
          label={t("pm.styling.textAlign")}
          options={[...ALIGN_OPTIONS, { value: "justify", label: t("pm.styling.justify") }]}
        />
      )}
    </>
  );
}

/** Icon from the global library + position, size, spacing, color mode. */
export function IconSection<S>({
  s,
  update,
  withPosition = true,
}: SectionProps<S> & { withPosition?: boolean }) {
  const f = loose(s, update);
  const iconId = (s as unknown as { iconId: string | null }).iconId;
  return (
    <>
      <IconSelect
        value={iconId}
        onChange={(id) => f.set("iconId", id)}
        manageHref="/global-setting?tab=icon"
      />
      {iconId && (
        <>
          {withPosition && (
            <LSelect
              f={f}
              k="iconPosition"
              label={t("pm.styling.iconPosition")}
              options={[
                { value: "left", label: t("pm.styling.iconLeft") },
                { value: "right", label: t("pm.styling.iconRight") },
              ]}
            />
          )}
          <AutoRow>
            {[
              <LNum key="sz" f={f} k="iconSize" label={t("pm.styling.iconSize")} min={4} />,
              <LNum key="gap" f={f} k="iconGap" label={t("pm.styling.iconGap")} min={0} />,
            ]}
          </AutoRow>
          <LSelect
            f={f}
            k="iconColorMode"
            label={t("pm.styling.iconColor")}
            options={[
              { value: "currentColor", label: t("pm.styling.iconCurrent") },
              { value: "original", label: t("pm.styling.iconOriginal") },
            ]}
          />
        </>
      )}
    </>
  );
}

/** Element width (auto / fixed / full). */
export function SizingSection<S>({
  s,
  update,
  modeKey = "widthMode",
  widthKey = "width",
  label = t("pm.styling.width"),
}: SectionProps<S> & { modeKey?: string; widthKey?: string; label?: string }) {
  const f = loose(s, update);
  return (
    <>
      <LSelect f={f} k={modeKey} label={label} options={WIDTH_MODE_OPTIONS} />
      {f.str(modeKey) === "fixed" && (
        <LNum f={f} k={widthKey} label={t("pm.styling.widthValue")} min={0} />
      )}
    </>
  );
}

/** 4 sides with a "uniform" toggle. `base` = "padding" | "margin" | another prefix. */
function BoxSidesGroup({
  f,
  base,
  title,
  allowNegative,
}: {
  f: Loose;
  base: string;
  title: string;
  allowNegative?: boolean;
}) {
  const linkedKey = `${base}Linked`;
  const top = `${base}Top`;
  if (!f.has(top)) return null;
  const min = allowNegative ? undefined : 0;
  const linked = f.has(linkedKey) ? f.bool(linkedKey) : false;
  return (
    <Group>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {title}
        </span>
        {f.has(linkedKey) && (
          <Toggle
            checked={linked}
            onChange={(v) => f.set(linkedKey, v)}
            label={t("pm.styling.linked")}
          />
        )}
      </div>
      {linked ? (
        <NumberInput value={f.num(top)} onChange={(v) => f.set(top, v)} min={min} />
      ) : (
        <Row>
          <LNum f={f} k={top} label={t("pm.styling.top")} min={min} />
          <LNum f={f} k={`${base}Right`} label={t("pm.styling.right")} min={min} />
          <LNum f={f} k={`${base}Bottom`} label={t("pm.styling.bottom")} min={min} />
          <LNum f={f} k={`${base}Left`} label={t("pm.styling.left")} min={min} />
        </Row>
      )}
    </Group>
  );
}

/** Padding + margin (each shown only when present in the state). */
export function SpacingSection<S>({
  s,
  update,
  paddingBase = "padding",
  paddingTitle = "Padding",
  children,
}: SectionProps<S> & {
  paddingBase?: string;
  paddingTitle?: string;
  children?: ReactNode;
}) {
  const f = loose(s, update);
  return (
    <>
      <BoxSidesGroup f={f} base={paddingBase} title={paddingTitle} />
      <BoxSidesGroup f={f} base="margin" title="Margin" allowNegative />
      {children}
    </>
  );
}

/** v7: true = the element font is set in its own "Font" section (Inspector); do not show it again in Typography. */
export const GenericFontContext = createContext(false);

export interface TypographyKeys {
  fontFamily?: string;
  size?: string;
  weight?: string;
  color?: string;
  letterSpacing?: string;
  transform?: string;
  lineHeight?: string;
  align?: string;
}

const DEFAULT_TYPO_KEYS: TypographyKeys = {
  fontFamily: "fontFamily",
  size: "fontSize",
  weight: "fontWeight",
  color: "textColor",
  letterSpacing: "letterSpacing",
  transform: "textTransform",
  lineHeight: "lineHeight",
};

/** Size, weight, color, letter spacing, text transform. */
export function TypographySection<S>({
  s,
  update,
  keys,
  colorLabel = t("pm.styling.textColor"),
}: SectionProps<S> & { keys?: TypographyKeys; colorLabel?: string }) {
  const f = loose(s, update);
  const k = keys ?? DEFAULT_TYPO_KEYS;
  const fontElsewhere = useContext(GenericFontContext);
  return (
    <>
      {f.has(k.fontFamily) && !fontElsewhere && (
        <Field label="Font">
          <FontSelect
            value={f.str(k.fontFamily)}
            onChange={(v) => f.set(k.fontFamily!, v)}
          />
        </Field>
      )}
      <AutoRow>
        {[
          k.size && <LNum key="sz" f={f} k={k.size} label={t("pm.styling.fontSize")} min={1} />,
          k.weight && (
            <LSelect
              key="w"
              f={f}
              k={k.weight}
              label={t("pm.styling.weight")}
              options={FONT_WEIGHT_OPTIONS}
            />
          ),
        ]}
      </AutoRow>
      <AutoRow>
        {[
          k.letterSpacing && (
            <LNum key="ls" f={f} k={k.letterSpacing} label={t("pm.styling.letterSpacing")} />
          ),
          k.lineHeight && f.has(k.lineHeight) && (
            <Field key="lh" label={t("pm.styling.lineHeight")}>
              <NumberInput
                value={f.num(k.lineHeight)}
                onChange={(v) => f.set(k.lineHeight!, v)}
                min={0.5}
                step={0.1}
                suffix="×"
              />
            </Field>
          ),
        ]}
      </AutoRow>
      {f.has("fluidType") && <LToggle f={f} k="fluidType" label={t("pm.styling.fluidType")} />}
      {k.color && <LColor f={f} k={k.color} label={colorLabel} />}
      {k.transform && (
        <LSelect
          f={f}
          k={k.transform}
          label={t("pm.styling.textTransform")}
          options={[
            { value: "none", label: "Normal" },
            { value: "uppercase", label: t("pm.styling.upper") },
            { value: "lowercase", label: t("pm.styling.lower") },
            { value: "capitalize", label: t("pm.styling.capitalize") },
          ]}
        />
      )}
      {k.align && (
        <LSelect f={f} k={k.align} label={t("pm.styling.align")} options={ALIGN_OPTIONS} />
      )}
    </>
  );
}

/**
 * Background. With a `bgType` key → the full editor (none / color / gradient /
 * image). Without `bgType` → only a color picker.
 */
export function BackgroundSection<S>({
  s,
  update,
  colorKey = "bgColor",
  colorLabel = t("pm.styling.bgColor"),
  kinds,
}: SectionProps<S> & { colorKey?: string; colorLabel?: string; kinds?: BgKind[] }) {
  const f = loose(s, update);
  if (!f.has("bgType")) return <LColor f={f} k={colorKey} label={colorLabel} />;
  return (
    <BackgroundEditor
      value={s as unknown as Partial<BgFields>}
      set={(k, v) => f.set(k, v)}
      kinds={kinds}
      colorLabel={colorLabel}
    />
  );
}

export interface BorderKeys {
  width?: string;
  style?: string;
  color?: string;
  radius?: string;
  pill?: string;
}

/** Width, style, color, radius, pill. */
export function BorderSection<S>({
  s,
  update,
  keys,
  children,
}: SectionProps<S> & { keys?: BorderKeys; children?: ReactNode }) {
  const f = loose(s, update);
  const k: Required<BorderKeys> = {
    width: "borderWidth",
    style: "borderStyle",
    color: "borderColor",
    radius: "borderRadius",
    pill: "pill",
    ...keys,
  };
  const pill = f.has(k.pill) && f.bool(k.pill);
  return (
    <>
      <AutoRow>
        {[
          <LNum key="w" f={f} k={k.width} label={t("pm.styling.weight")} min={0} />,
          <LSelect
            key="st"
            f={f}
            k={k.style}
            label={t("pm.styling.borderStyle")}
            options={[
              { value: "none", label: "None" },
              { value: "solid", label: "Solid" },
              { value: "dashed", label: "Dashed" },
              { value: "dotted", label: "Dotted" },
            ]}
          />,
        ]}
      </AutoRow>
      <LColor f={f} k={k.color} label={t("pm.styling.borderColor")} />
      {f.has(k.radius) && (
        <Group>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {t("pm.styling.borderRadius")}
            </span>
            <LToggle f={f} k={k.pill} label={t("pm.styling.pill")} />
          </div>
          {!pill && (
            <NumberInput
              value={f.num(k.radius)}
              onChange={(v) => f.set(k.radius, v)}
              min={0}
            />
          )}
        </Group>
      )}
      {children}
    </>
  );
}

/**
 * Box-shadow lengkap. `prefix` menentukan nama key:
 *   "shadow"      → shadowEnabled, shadowX, shadowY, shadowBlur, ...
 *   "hoverShadow" → hoverShadowEnabled, hoverShadowX, ...
 */
export function ShadowSection<S>({
  s,
  update,
  prefix = "shadow",
  toggleLabel = t("pm.styling.enableShadow"),
}: SectionProps<S> & { prefix?: string; toggleLabel?: string }) {
  const f = loose(s, update);
  const key = (suffix: string) => `${prefix}${suffix}`;
  const enabledKey = key("Enabled");
  const enabled = f.has(enabledKey) ? f.bool(enabledKey) : true;
  return (
    <>
      <LToggle f={f} k={enabledKey} label={toggleLabel} />
      {enabled && (
        <>
          <Row>
            <LNum f={f} k={key("X")} label="Offset X" />
            <LNum f={f} k={key("Y")} label="Offset Y" />
            <LNum f={f} k={key("Blur")} label="Blur" min={0} />
            <LNum f={f} k={key("Spread")} label="Spread" />
          </Row>
          <LColor f={f} k={key("Color")} label={t("pm.styling.shadowColor")} />
          <LRange f={f} k={key("Opacity")} label="Opacity" min={0} max={100} unit="%" />
        </>
      )}
    </>
  );
}

export function CursorSection<S>({ s, update }: SectionProps<S>) {
  const f = loose(s, update);
  return (
    <LSelect
      f={f}
      k="cursor"
      label={t("pm.styling.cursor")}
      options={[
        "auto",
        "default",
        "pointer",
        "text",
        "move",
        "grab",
        "not-allowed",
        "wait",
        "help",
        "crosshair",
        "zoom-in",
        "zoom-out",
      ].map((c) => ({ value: c, label: c }))}
    />
  );
}

/** Durasi + easing transisi. */
export function TransitionFields<S>({ s, update }: SectionProps<S>) {
  const f = loose(s, update);
  return (
    <AutoRow>
      {[
        <LNum
          key="d"
          f={f}
          k="transitionDuration"
          label={t("pm.styling.duration")}
          min={0}
          suffix="ms"
        />,
        <LSelect key="e" f={f} k="transitionEasing" label="Easing" options={EASING_OPTIONS} />,
      ]}
    </AutoRow>
  );
}

export interface HoverLabels {
  toggle?: string;
  bg?: string;
  text?: string;
  border?: string;
}

/**
 * Hover: toggle, transition, colors (bg/text/border), motion effects, hover shadow.
 * Fields missing from the state are hidden automatically. `children` =
 * extra element-specific hover fields (e.g. image zoom).
 */
export function HoverSection<S>({
  s,
  update,
  labels,
  withTransform = true,
  children,
}: SectionProps<S> & {
  labels?: HoverLabels;
  withTransform?: boolean;
  children?: ReactNode;
}) {
  const f = loose(s, update);
  const enabled = f.has("hoverEnabled") ? f.bool("hoverEnabled") : true;
  return (
    <>
      <LToggle f={f} k="hoverEnabled" label={labels?.toggle ?? t("pm.styling.hover.enable")} />
      <TransitionFields s={s} update={update} />
      {enabled && (
        <>
          <LColor f={f} k="hoverBgColor" label={labels?.bg ?? t("pm.styling.hover.bg")} />
          <LColor f={f} k="hoverTextColor" label={labels?.text ?? t("pm.styling.hover.text")} />
          <LColor
            f={f}
            k="hoverBorderColor"
            label={labels?.border ?? t("pm.styling.hover.border")}
          />
          {withTransform && (
            <LSelect
              f={f}
              k="hoverTransform"
              label={t("pm.styling.hover.transform")}
              options={HOVER_TRANSFORM_OPTIONS}
            />
          )}
          {children}
          {f.has("hoverShadowEnabled") && (
            <Group>
              <ShadowSection
                s={s}
                update={update}
                prefix="hoverShadow"
                toggleLabel={t("pm.styling.hover.shadow")}
              />
            </Group>
          )}
        </>
      )}
    </>
  );
}

/** Cincin fokus (keyboard). */
export function FocusRingSection<S>({ s, update }: SectionProps<S>) {
  const f = loose(s, update);
  const enabled = f.bool("focusRingEnabled");
  return (
    <>
      <LColor f={f} k="focusBorderColor" label={t("pm.styling.focus.border")} />
      <LToggle f={f} k="focusRingEnabled" label={t("pm.styling.focus.ring")} />
      {enabled && (
        <>
          <LColor f={f} k="focusRingColor" label={t("pm.styling.focus.ringColor")} />
          <LNum f={f} k="focusRingWidth" label={t("pm.styling.focus.ringWidth")} min={0} />
          <LRange f={f} k="focusRingOpacity" label="Opacity" min={0} max={100} unit="%" />
        </>
      )}
    </>
  );
}

/* ==================================================================== */
/* Category icons: used by every element so the category icons match    */
/* ==================================================================== */

export const SECTION_ICONS = {
  content: AlignLeft,
  icon: Sparkles,
  sizing: Ruler,
  spacing: Move,
  typography: Type,
  background: Palette,
  border: Square,
  shadow: CircleDashed,
  cursor: MousePointer2,
  hover: MousePointerClick,
  focus: Focus,
  image: ImageIcon,
  filter: Wand2,
  animation: Zap,
  items: ListIcon,
  layout: LayoutGrid,
  number: Hash,
} as const satisfies Record<string, LucideIcon>;

/* ==================================================================== */
/* Standard section bundle for "single content" elements (StyleState)   */
/* ==================================================================== */

type StandardSectionId =
  | "content"
  | "icon"
  | "sizing"
  | "spacing"
  | "typography"
  | "background"
  | "border"
  | "shadow"
  | "cursor"
  | "hover";

export interface StandardSectionOptions {
  /** Text field label in the Content section (e.g. "Placeholder"). */
  textLabel?: string;
  multiline?: boolean;
  /** Extra fields inside the Content section (HTML tag, href, etc.). */
  contentExtra?: ReactNode;
  /** Background kinds that may be chosen (default: all). */
  backgroundKinds?: BgKind[];
  /** Standard sections this element does not use. */
  omit?: StandardSectionId[];
  hoverLabels?: HoverLabels;
  hoverTitle?: string;
  withHoverTransform?: boolean;
  /** Extra sections; inserted after the section with id `after` (default: at the end). */
  extra?: (PanelSection & { after?: string })[];
}

export function standardStyleSections<S extends StyleState>(
  s: S,
  update: Updater<S>,
  opts: StandardSectionOptions = {},
): PanelSection[] {
  const omit = new Set(opts.omit ?? []);
  const p = { s, update };
  const base: PanelSection[] = [
    {
      id: "content",
      label: t("pm.styling.section.content"),
      icon: SECTION_ICONS.content,
      content: (
        <ContentSection {...p} textLabel={opts.textLabel} multiline={opts.multiline}>
          {opts.contentExtra}
        </ContentSection>
      ),
    },
    { id: "icon", label: t("pm.styling.section.icon"), icon: SECTION_ICONS.icon, content: <IconSection {...p} /> },
    { id: "sizing", label: t("pm.styling.section.sizing"), icon: SECTION_ICONS.sizing, content: <SizingSection {...p} /> },
    { id: "spacing", label: t("pm.styling.section.spacing"), icon: SECTION_ICONS.spacing, content: <SpacingSection {...p} /> },
    {
      id: "typography",
      label: t("pm.styling.section.typography"),
      icon: SECTION_ICONS.typography,
      content: <TypographySection {...p} />,
    },
    {
      id: "background",
      label: "Background",
      icon: SECTION_ICONS.background,
      content: <BackgroundSection {...p} kinds={opts.backgroundKinds} />,
    },
    { id: "border", label: "Border", icon: SECTION_ICONS.border, content: <BorderSection {...p} /> },
    { id: "shadow", label: "Shadow", icon: SECTION_ICONS.shadow, content: <ShadowSection {...p} /> },
    { id: "cursor", label: "Cursor", icon: SECTION_ICONS.cursor, content: <CursorSection {...p} /> },
    {
      id: "hover",
      label: opts.hoverTitle ?? "Hover",
      icon: SECTION_ICONS.hover,
      content: (
        <HoverSection
          {...p}
          labels={opts.hoverLabels}
          withTransform={opts.withHoverTransform ?? true}
        />
      ),
    },
  ].filter((sec) => !omit.has(sec.id as StandardSectionId));

  for (const ex of opts.extra ?? []) {
    const idx = ex.after ? base.findIndex((b) => b.id === ex.after) : -1;
    if (idx >= 0) base.splice(idx + 1, 0, ex);
    else base.push(ex);
  }
  return base;
}

/* ==================================================================== */
/* Accordion                                                            */
/* ==================================================================== */

function AccordionItem({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
}: {
  title: string;
  icon: LucideIcon;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 last:border-none">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`w-full flex items-center gap-2 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide transition-colors ${
          isOpen
            ? "text-blue-800 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white/80"
        }`}
      >
        <Icon size={14} className="shrink-0" />
        <span className="flex-1">{title}</span>
        <ChevronDown
          size={14}
          className={`shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Open/close animation via grid-rows; `invisible` when closed
          so its content cannot be focused with the keyboard. */}
      <div
        className={`grid transition-[grid-template-rows,visibility] duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] visible" : "grid-rows-[0fr] invisible"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="px-4 pb-4 pt-1 flex flex-col gap-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

/* ==================================================================== */
/* PanelStyling: the ONLY panel used by every element maker             */
/* ==================================================================== */

export interface PanelStylingProps {
  /** Kategori accordion, berurutan. */
  sections: PanelSection[];
  /** Reset the state to defaults. */
  onReset: () => void;
  /** The "Class Name" field above the accordion (used by every element). */
  classNameField?: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
    /** The class name actually used (for the message when the input is invalid). */
    effective?: string;
  };
  /** Id of the category opened first. Default: the first category. */
  defaultOpen?: string | null;
  /**
   * Used inside another panel that already has its own scroll area
   * (Component Maker): no sticky/max height, scrolling is handled by the parent.
   */
  embedded?: boolean;
  /** Reset button & confirmation text (default: reset to defaults). */
  resetLabel?: string;
  resetConfirmText?: string;
}

export default function PanelStyling({
  sections,
  onReset,
  classNameField,
  defaultOpen,
  embedded = false,
  resetLabel,
  resetConfirmText,
}: PanelStylingProps) {
  const { t } = useTranslation();
  const visible = sections.filter((sec) => !sec.hidden);
  const [openId, setOpenId] = useState<string | null>(
    defaultOpen === undefined ? (visible[0]?.id ?? null) : defaultOpen,
  );
  const [confirmReset, setConfirmReset] = useState(false);

  const invalidClass =
    classNameField &&
    classNameField.effective !== undefined &&
    classNameField.value.trim() !== classNameField.effective;

  return (
    <div className="w-full flex flex-col gap-4">
      {classNameField && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-800 px-4">
          <Section title={t("pm.styling.className")}>
            <Field
              label=""
              hint={
                invalidClass
                  ? t("pm.styling.classNameInvalid", { effective: classNameField.effective })
                  : undefined
              }
            >
              <TextInput
                value={classNameField.value}
                onChange={classNameField.onChange}
                placeholder={classNameField.placeholder}
              />
            </Field>
          </Section>
        </div>
      )}

      <div
        className={`w-full rounded-lg border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden ${
          embedded ? "" : "lg:max-h-[calc(100vh-140px)] lg:sticky lg:top-4"
        }`}
      >
        <div className={embedded ? "" : "flex-1 min-h-0 overflow-y-auto"}>
          {visible.map((sec) => (
            <AccordionItem
              key={sec.id}
              title={sec.label}
              icon={sec.icon}
              isOpen={openId === sec.id}
              onToggle={() => setOpenId((prev) => (prev === sec.id ? null : sec.id))}
            >
              {sec.content}
            </AccordionItem>
          ))}
        </div>

        {/* The reset button stays visible at the bottom, outside the scroll area */}
        <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 px-4 py-4">
          {confirmReset ? (
            <div className="flex items-center gap-2">
              <span className="flex-1 text-xs text-gray-600 dark:text-gray-300">
                {resetConfirmText ?? t("pm.styling.resetConfirm")}
              </span>
              <button
                type="button"
                onClick={() => {
                  onReset();
                  setConfirmReset(false);
                }}
                className="text-xs font-semibold bg-rose-600 text-white rounded px-2.5 py-1.5 hover:opacity-90"
              >
                {t("pm.styling.reset")}
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-1.5"
              >
                {t("common.cancel")}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-3 py-2 hover:text-gray-800 dark:hover:text-white/90"
            >
              <RotateCcw size={13} /> {resetLabel ?? t("pm.styling.resetDefault")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
