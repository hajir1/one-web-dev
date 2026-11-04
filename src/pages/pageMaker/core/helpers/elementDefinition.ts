import type { PanelSection } from "../ui/PanelStyling";
import type { Updater } from "../ui/fields";
import type { FrameworkSpec } from "./markup";
import type { SpecContext } from "./siteTypes";
import { renderIconMarkup, type GlobalIcon } from "../store/iconStore";
import type { LibraryId } from "../../engine/helpers/libraries";
import type { Framework } from "./generatorCss";
import type { GeneratedFile } from "../ui/CodeExportPanel";

/* ================================================================== */
/* Element definition: the ONE source of truth for every element maker */
/*                                                                    */
/* The Element Maker and Component Maker pages both use this            */
/* object, so an element's display, export code, and styling panel      */
/* guaranteed identical in both places:                                */
/*                                                                    */
/*   spec      → CSS + pohon markup (+ override kode interaktif)       */
/*   sections  → styling panel categories (for <PanelStyling/>)        */
/*   defaults  → initial state; also the base for merging old designs  */
/* ================================================================== */

export type ElementGroup = "Elemen" | "Form" | "Data" | "Navigasi" | "3D" | "Premium";

/** Finds an icon's SVG markup in the global icon library (null = no icon). */
export type IconLookup = (
  iconId: string | null,
  size: number,
  mode: "currentColor" | "original",
) => string | null;

/** Render result of one element: exactly the `generateFrameworkFiles` arguments without `name`. */
export type ElementSpec = Omit<FrameworkSpec, "name">;

/** Change several state fields at once. */
export type Patcher<S> = (patch: Partial<S>) => void;

export interface ElementDefinition<S> {
  /** Design storage key (designStore), the same as the useElementState argument. */
  type: string;
  label: string;
  group: ElementGroup;
  /** PascalCase component name for generated files ("Button" → Button.jsx). */
  componentName: string;
  /** Default class name in Element Maker. */
  defaultClassName: string;
  defaults: S;
  /**
   * The outermost element class in the `spec` markup (default: `cls`
   * itself). Component Maker uses it to place layout rules
   * (grow, span, align-self) directly on the element.
   */
  rootClass?: (cls: string) => string;
  spec: (s: S, cls: string, icons: IconLookup, ctx?: SpecContext) => ElementSpec;
  /**
   * User CSS/JS attached to this element (Code Element). The CSS is scoped
   * to the element class; the JS runs through the same Custom JS runtime.
   */
  customCode?: (s: S) => { css?: string; js?: string };
  /**
   * CDN libraries the element needs (e.g. Chart → Chart.js). Added
   * automatically to the exported <head>/end of <body> when the element is used.
   */
  libraries?: LibraryId[];
  /** Exclusive element: needs credits to be added & exported. */
  premium?: boolean;
  /** v9: 3D elements read the --owd-3d-* variables (Global Settings → Animation & 3D). */
  uses3dSettings?: boolean;
  /**
   * v9: shared support files (e.g. the 3D runtime) included in the framework
   * project when the element is used. Same file name = written once.
   */
  extraFiles?: (fw: Framework) => GeneratedFile[];
  sections: (s: S, update: Updater<S>, patch: Patcher<S>) => PanelSection[];
}

/** Only for type checking when defining elements. */
export function defineElement<S>(def: ElementDefinition<S>): ElementDefinition<S> {
  return def;
}

/** A heterogeneous element list: state types differ, selected via `type`. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyElementDefinition = ElementDefinition<any>;

export function makeIconLookup(icons: GlobalIcon[]): IconLookup {
  return (iconId, size, mode) => {
    if (!iconId) return null;
    const found = icons.find((i) => i.id === iconId);
    return found ? renderIconMarkup(found.svg, size, mode) : null;
  };
}
