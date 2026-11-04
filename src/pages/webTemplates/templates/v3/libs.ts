import type { BoxNode, ComponentNode } from "../../../pageMaker/engine/helpers/componentTypes";
import type { PageDoc } from "../../../pageMaker/helpers/pageDoc";
import {
  DEFAULT_LIBS,
  LIBRARY_IDS,
  type AnimateSettings,
  type AosSettings,
  type LibraryId,
  type TiltSettings,
} from "../../../pageMaker/engine/helpers/libraries";

/* ================================================================== */
/* Library setup (Element menu → Library) in template content.           */
/*                                                                    */
/* Templates may only use libraries available in the Library menu       */
/* (engine/helpers/libraries.ts). Users can change/remove them          */
/* through Settings → Library after the template is opened in Page Maker. */
/* ================================================================== */

/** Installs libraries on the page (root.libraries), in menu list order. */
export function installLibs(doc: PageDoc, ids: LibraryId[]): PageDoc {
  const cur = doc.root.libraries ?? [];
  doc.root.libraries = LIBRARY_IDS.filter((x) => ids.includes(x) || cur.includes(x));
  return doc;
}

/** Animations that appear on scroll (AOS). */
export function aos<T extends ComponentNode>(n: T, effect: AosSettings["effect"] = "fade-up", o: Partial<Omit<AosSettings, "effect">> = {}): T {
  n.libs = { ...n.libs, aos: { ...DEFAULT_LIBS.aos, ...o, effect } };
  return n;
}

/** Animate.css animations (once on load, or repeating). */
export function animate<T extends ComponentNode>(n: T, effect: AnimateSettings["effect"] = "fadeInUp", o: Partial<Omit<AnimateSettings, "effect">> = {}): T {
  n.libs = { ...n.libs, animate: { ...DEFAULT_LIBS.animate, ...o, effect } };
  return n;
}

/** Efek miring 3D (Vanilla Tilt). */
export function tilt<T extends ComponentNode>(n: T, o: Partial<TiltSettings> = {}): T {
  n.libs = { ...n.libs, tilt: { ...DEFAULT_LIBS.tilt, ...o } };
  return n;
}

/** Staggered AOS for a box's children (e.g. cards in a grid). */
export function aosStagger(box: BoxNode, effect: AosSettings["effect"] = "fade-up", step = 100): BoxNode {
  box.children.forEach((c, i) => aos(c, effect, { delay: Math.min(3000, i * step) }));
  return box;
}
