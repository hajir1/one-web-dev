/* ================================================================== */
/* Model Component Maker — POHON node                                   */
/*                                                                    */
/* A component = one tree:                                             */
/*   - BoxNode     : layout container (stack / row / grid), may         */
/*                   contain other boxes → nested composition.          */
/*   - ElementNode : leaf; a copy of an Element Maker element's state.  */
/* Root selalu sebuah BoxNode.                                          */
/* ================================================================== */

import type { BgFields, BgKind } from "../../core/helpers/background";
import type { ElementEvent } from "./events";
import type { LibraryId, NodeLibs } from "./libraries";
import type { CssVar } from "../../core/helpers/cssVars";
import type { AdvancedProps } from "./advanced";
import type { NodeAnim } from "./motion";
import type { CollectionDef } from "../../helpers/collections";
import type { BindField, ItemOf, RelatedOf } from "../../helpers/itemPage";

export type NodeId = string;
export type RowWidth = "content" | "80" | "full" | "custom";

/** "block" = normal flow layout (display:block), used by Page Maker sections. */
export type BoxLayout = "stack" | "row" | "grid" | "block";
export type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between";
export type ShadowPreset = "none" | "sm" | "md" | "lg";
/** full = 100% · auto = ikut aturan layout induk · fit = fit-content · fixed = px */
export type WidthMode = "full" | "auto" | "fit" | "fixed";

/** Placement of a node inside its parent (empty = follow the default). */
export interface Place {
  /** In a flex row: take the remaining space (`flex: 1 1 …`). */
  grow?: boolean;
  /** In a flex row: base width (px) before growing/shrinking. */
  basis?: number;
  /** In a grid: start position & span of columns / rows (1 = first). */
  colStart?: number;
  colSpan?: number;
  rowStart?: number;
  rowSpan?: number;
  /** In a grid with areas: the `grid-area` name. */
  area?: string;
  /** Own position; axis meaning follows the parent layout. */
  selfH?: Align;
  selfV?: Align;
}

/** Semantic HTML tags a container may use. */
export const BOX_TAGS = ["div", "section", "header", "footer", "nav", "main", "aside", "article"] as const;
export type BoxTag = (typeof BOX_TAGS)[number];

/**
 * SECTION-specific settings (used by Page Maker). Boxes with a `section`
 * render as a full-page-width band; their content is limited by `contentWidth`
 * through padding (no extra wrapper element).
 */
export interface SectionProps {
  /** Maximum content width (px). 0 = page width. */
  contentWidth: number;
  padY: number;
  padX: number;
  /** Minimum height (px). 0 = follow the content. */
  minHeight: number;
  /** Background image URL (empty = no image). */
  bgImage: string;
  /** ID of the section's source preset (section catalog). Optional; does not affect rendering. */
  presetId?: string;
  /** Divi-style section type (no marker = regular). Only a marker; the look is set by other fields. */
  sectionType?: SectionKind;
}

export type SectionKind = "regular" | "specialty" | "fullwidth";

interface BaseNode {
  id: NodeId;
  /** Display name in the structure tree. */
  name: string;
  place: Place;
  /** Advanced settings: CSS ID, class, Custom CSS & JS (free). */
  advanced?: AdvancedProps;
  /** CDN library effects (AOS, Animate.css, Vanilla Tilt) for this node. */
  libs?: NodeLibs;
  /** v9: CSS animation without a library (Styling panel → Animation). */
  anim?: NodeAnim;
  /** CRUD trial: item category (collection card) → data-category attribute for filter chips. */
  itemCategory?: string;
}

export interface BoxNode extends BaseNode {
  kind: "box";
  /** Root only: CDN libraries installed in the design (Library menu). */
  libraries?: LibraryId[];
  /** v7, root only: a copy of the global variables the design references (see cssVars.ts). */
  vars?: CssVar[];
  layout: BoxLayout;
  gap: number;
  padding: number;
  /** Row: may wrap. */
  wrap: boolean;
  /** Grid: `grid-template-columns` value. */
  columns: string;
  /** Grid: `grid-template-areas` value (optional). */
  areas: string;
  /** Cross axis (stack: horizontal, row: vertical, grid: vertical). */
  align: Align;
  /** Main axis (row: justify-content, grid: justify-items, stack: unused). */
  justify: Justify | "stretch";
  /** On small screens: row → column, grid → one column. */
  stackOnMobile: boolean;

  bgEnabled: boolean;
  bgColor: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
  shadow: ShadowPreset;

  widthMode: WidthMode;
  width: number;

  /**
   * Full background (optional; old data uses bgEnabled/bgColor and
   * section.bgImage; see `boxBackground`).
   */
  bgType?: BgKind;
  gradientFrom?: string;
  gradientTo?: string;
  gradientAngle?: number;
  gradientKind?: BgFields["gradientKind"];
  gradientVia?: string;
  bgImage?: string;
  bgSize?: BgFields["bgSize"];
  bgPosition?: BgFields["bgPosition"];
  bgRepeat?: BgFields["bgRepeat"];
  bgAttachment?: BgFields["bgAttachment"];
  bgOverlayColor?: string;
  bgOverlayOpacity?: number;

  /** HTML tag (empty = div). */
  tag?: BoxTag;
  /** Present = this box is a Page Maker section. */
  section?: SectionProps;
  /** Present (true) = this box is a Page Maker ROW (Section → Row → Element). */
  row?: boolean;
  /**
   * Row width inside a section:
   *  content = follow the section's "content width" (default, e.g. 1120px centered)
   *  80 = 80% · full = 100% of the section width · custom = rowCustomWidth + unit
   */
  rowWidth?: RowWidth;
  /**
   * Present (true) = an INNER ROW in a Specialty section's special column (Divi style).
   * Structurally just a grid group (Rows may not nest), but in the
   * editor it is treated like a Row: (+) below it adds a new inner Row
   * with column structure options, and its copy goes right below it.
   */
  innerRow?: boolean;
  rowCustomWidth?: number;
  rowCustomUnit?: "px" | "%";

  /**
   * Grid on phones (when `stackOnMobile`): empty = one column, "two" = two
   * columns (e.g. stat numbers), "scroll" = a swipeable row (scroll-snap).
   */
  mobileGrid?: "two" | "scroll";
  /** Grid on desktop: alternate cards are offset slightly (not rigidly aligned). */
  stagger?: boolean;
  /** The box lifts slightly + a shadow on hover. */
  hoverLift?: boolean;
  /** CRUD preview: this box is a data collection; its child cards are built from `collection.items`. */
  collection?: CollectionDef;
  /** Item page preview: this box shows ONE collection item (detail page). */
  itemOf?: ItemOf;
  /** Item page preview: "You may also like" cards from another collection (same label). */
  related?: RelatedOf;
  /** CRUD preview: a category filter chip group for this collection (slug). */
  filterOf?: string;

  children: ComponentNode[];
}

export interface ElementNode extends BaseNode {
  kind: "element";
  elementType: string;
  /** A copy of this node's element state (always complete, already merged with defaults). */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any;
  /**
   * Origin from a saved design in Element Maker.
   *  - not `detached`: the state used = the latest version of that design.
   *  - `detached`: the user changed the element here → use the copy (`state`),
   *    the original design is still remembered so it can be synced again.
   * If the design was deleted, the node uses its last `state`.
   */
  link?: { designId: string; detached?: boolean };
  /** Event JavaScript (Page Maker). */
  events?: ElementEvent[];
  /** Item page preview: this element's content is taken from an item field. */
  bind?: BindField;
  /** Empty bound field value → the element is hidden. */
  bindEmpty?: boolean;
  /** Category filter chip: the category value ("" = All). Only inside a `filterOf` box. */
  chip?: string;
}

export type ComponentNode = BoxNode | ElementNode;

/** Design origin (e.g. created from a catalog template). Determines access to the template's built-in items. */
export interface DocSource {
  templateId: string;
  version?: number;
}

/** State saved through "My Designs". */
export interface ComponentDoc {
  version: 2;
  root: BoxNode;
  /** Only on page designs created from a template. */
  source?: DocSource;
}

export const DEFAULT_CLASS_NAME = "custom-component";
export const ROOT_ID: NodeId = "root";

export const SHADOW_CSS: Record<Exclude<ShadowPreset, "none">, string> = {
  sm: "0 1px 3px rgba(0, 0, 0, 0.12)",
  md: "0 4px 12px rgba(0, 0, 0, 0.12)",
  lg: "0 12px 32px rgba(0, 0, 0, 0.18)",
};

export function isBox(n: ComponentNode): n is BoxNode {
  return n.kind === "box";
}
export function isElement(n: ComponentNode): n is ElementNode {
  return n.kind === "element";
}

/** Effective background fields of a container (including old data). */
export function boxBackground(b: BoxNode): Partial<BgFields> & { bgType: BgKind } {
  const legacyImage = b.section?.bgImage ?? "";
  const bgType: BgKind = b.bgType ?? (legacyImage ? "image" : b.bgEnabled ? "solid" : "none");
  return {
    bgType,
    bgColor: b.bgColor,
    gradientFrom: b.gradientFrom ?? "#2563eb",
    gradientTo: b.gradientTo ?? "#7c3aed",
    gradientAngle: b.gradientAngle ?? 90,
    gradientKind: b.gradientKind,
    gradientVia: b.gradientVia,
    bgImage: b.bgImage || legacyImage,
    bgSize: b.bgSize,
    bgPosition: b.bgPosition,
    bgRepeat: b.bgRepeat,
    bgAttachment: b.bgAttachment,
    bgOverlayColor: b.bgOverlayColor,
    bgOverlayOpacity: b.bgOverlayOpacity,
  };
}
