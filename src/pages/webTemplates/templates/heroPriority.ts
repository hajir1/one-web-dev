import type { BoxNode, ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../pageMaker/engine/helpers/componentTypes";
import { isSection, type PageDoc } from "../../pageMaker/helpers/pageDoc";

/* ================================================================== */
/* Hero image (LCP) is prioritized                                       */
/*                                                                    */
/* The first image at the top of the page (the top 3 sections: navbar,  */
/* hero, ...) is usually the LCP element. That image must NOT be lazy and */
/* gets fetchpriority="high"; other images stay lazy.                   */
/* ================================================================== */

const TOP_SECTIONS = 3;

function firstImage(n: ComponentNode): string | null {
  if (!isBox(n)) return n.elementType === "image" ? n.id : null;
  for (const c of n.children) {
    const hit = firstImage(c);
    if (hit) return hit;
  }
  return null;
}

export function heroImageId(root: BoxNode): string | null {
  for (const c of root.children.slice(0, TOP_SECTIONS)) {
    const hit = firstImage(c);
    if (hit) return hit;
  }
  return null;
}

export function prioritizeHeroImage(doc: PageDoc): PageDoc {
  const id = heroImageId(doc.root);
  if (!id) return doc;
  const patch = (n: ComponentNode): ComponentNode => {
    if (isBox(n)) return { ...n, children: n.children.map(patch) };
    return n.id === id ? { ...n, state: { ...n.state, lazyLoad: false, priority: true } } : n;
  };
  return { ...doc, root: patch(doc.root) as BoxNode };
}

/* ------------------------------------------------------------------ */
/* Hero without an entrance animation                                   */
/*                                                                    */
/* Entrance animations (AOS / Animate.css) in the hero make the heading & image */
/* (AOS removed, Animate.css replaced with "pulse", which does not hide) */
/* main content stayed hidden until the animation ran, delaying LCP      */
/* (realty-rumah-kita: ±3.8 seconds). The first content section (hero)   */
/* shown right away; the following sections still animate.             */
/* ------------------------------------------------------------------ */

function stripEntrance(n: ComponentNode, keepAos: boolean): ComponentNode {
  let out = n;
  if ((n.libs?.aos && !keepAos) || (n.libs?.animate && n.libs.animate.effect !== "pulse")) {
    const { aos: _a, ...base } = n.libs;
    void _a;
    const rest = keepAos && n.libs.aos ? { ...base, aos: n.libs.aos } : base;
    // Animate.css replaced with "pulse" (scale only, no opacity 0): still lively, LCP not delayed.
    const libs = rest.animate ? { ...rest, animate: { ...rest.animate, effect: "pulse" as const, delay: 0 } } : rest;
    out = { ...n, libs } as ComponentNode;
    if (!Object.keys(libs).length) delete (out as { libs?: unknown }).libs;
  }
  if (!isBox(out)) return out;
  const kids = out.children.map((c) => stripEntrance(c, keepAos));
  return kids.every((k, i) => k === out.children[i]) ? out : { ...out, children: kids };
}

const isContent = (s: ComponentNode) => isSection(s) && isBox(s) && s.tag !== "header" && s.tag !== "footer" && s.tag !== "nav";

export function calmHero(doc: PageDoc): PageDoc {
  const idx = doc.root.children.findIndex(isContent);
  // Pages whose content is only a hero still animate (there are no other sections).
  if (idx < 0 || doc.root.children.filter(isContent).length < 2) return doc;
  const hero = doc.root.children[idx];
  const usesAos = (n: ComponentNode): boolean => !!n.libs?.aos || (isBox(n) && n.children.some(usesAos));
  // AOS installed only in the hero → leave it (an installed library must still be used).
  const keepAos = !doc.root.children.some((s, i) => i !== idx && usesAos(s));
  const calm = stripEntrance(hero, keepAos);
  if (calm === hero) return doc;
  const children = doc.root.children.slice();
  children[idx] = calm;
  return { ...doc, root: { ...doc.root, children } };
}
