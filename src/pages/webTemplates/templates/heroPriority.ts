import type { BoxNode, ComponentNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../pageMaker/engine/helpers/componentTypes";
import { isSection, type PageDoc } from "../../pageMaker/helpers/pageDoc";

/* ================================================================== */
/* Gambar hero (LCP) diprioritaskan                                      */
/*                                                                    */
/* Gambar pertama di bagian atas halaman (3 section teratas: navbar,    */
/* hero, ...) biasanya elemen LCP. Gambar itu TIDAK boleh lazy dan       */
/* diberi fetchpriority="high"; gambar lain tetap lazy.                 */
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
/* Hero tanpa animasi masuk                                             */
/*                                                                    */
/* Animasi masuk (AOS / Animate.css) di hero membuat judul & gambar      */
/* (AOS dilepas, Animate.css diganti "pulse" yang tidak menyembunyikan)  */
/* utama tersembunyi sampai animasi berjalan, sehingga LCP tertunda      */
/* (realty-rumah-kita: ±3,8 detik). Section konten pertama (hero)        */
/* ditampilkan langsung; section berikutnya tetap beranimasi.            */
/* ------------------------------------------------------------------ */

function stripEntrance(n: ComponentNode, keepAos: boolean): ComponentNode {
  let out = n;
  if ((n.libs?.aos && !keepAos) || (n.libs?.animate && n.libs.animate.effect !== "pulse")) {
    const { aos: _a, ...base } = n.libs;
    void _a;
    const rest = keepAos && n.libs.aos ? { ...base, aos: n.libs.aos } : base;
    // Animate.css diganti "pulse" (hanya skala, tanpa opacity 0): tetap hidup, LCP tidak tertunda.
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
  // Halaman yang isinya hanya hero tetap beranimasi (tidak ada section lain).
  if (idx < 0 || doc.root.children.filter(isContent).length < 2) return doc;
  const hero = doc.root.children[idx];
  const usesAos = (n: ComponentNode): boolean => !!n.libs?.aos || (isBox(n) && n.children.some(usesAos));
  // AOS terpasang hanya di hero → biarkan (pustaka terpasang harus tetap dipakai).
  const keepAos = !doc.root.children.some((s, i) => i !== idx && usesAos(s));
  const calm = stripEntrance(hero, keepAos);
  if (calm === hero) return doc;
  const children = doc.root.children.slice();
  children[idx] = calm;
  return { ...doc, root: { ...doc.root, children } };
}
