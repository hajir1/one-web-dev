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
/* Pemasangan library (menu Element → Library) di konten template.       */
/*                                                                    */
/* Template hanya boleh memakai library yang ada di menu Library         */
/* (engine/helpers/libraries.ts). Pengguna bisa mengubah/melepasnya     */
/* lewat Pengaturan → Library setelah template dibuka di Page Maker.    */
/* ================================================================== */

/** Pasang library di halaman (root.libraries), urut sesuai daftar menu. */
export function installLibs(doc: PageDoc, ids: LibraryId[]): PageDoc {
  const cur = doc.root.libraries ?? [];
  doc.root.libraries = LIBRARY_IDS.filter((x) => ids.includes(x) || cur.includes(x));
  return doc;
}

/** Animasi muncul saat di-scroll (AOS). */
export function aos<T extends ComponentNode>(n: T, effect: AosSettings["effect"] = "fade-up", o: Partial<Omit<AosSettings, "effect">> = {}): T {
  n.libs = { ...n.libs, aos: { ...DEFAULT_LIBS.aos, ...o, effect } };
  return n;
}

/** Animasi Animate.css (sekali saat dimuat, atau berulang). */
export function animate<T extends ComponentNode>(n: T, effect: AnimateSettings["effect"] = "fadeInUp", o: Partial<Omit<AnimateSettings, "effect">> = {}): T {
  n.libs = { ...n.libs, animate: { ...DEFAULT_LIBS.animate, ...o, effect } };
  return n;
}

/** Efek miring 3D (Vanilla Tilt). */
export function tilt<T extends ComponentNode>(n: T, o: Partial<TiltSettings> = {}): T {
  n.libs = { ...n.libs, tilt: { ...DEFAULT_LIBS.tilt, ...o } };
  return n;
}

/** AOS bertahap untuk anak-anak sebuah box (mis. kartu dalam grid). */
export function aosStagger(box: BoxNode, effect: AosSettings["effect"] = "fade-up", step = 100): BoxNode {
  box.children.forEach((c, i) => aos(c, effect, { delay: Math.min(3000, i * step) }));
  return box;
}
