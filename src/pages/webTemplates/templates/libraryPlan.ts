import type { BoxNode, ComponentNode, ElementNode } from "../../pageMaker/engine/helpers/componentTypes";
import { isBox } from "../../pageMaker/engine/helpers/componentTypes";
import type { AnimateSettings, AosSettings, LibraryId } from "../../pageMaker/engine/helpers/libraries";
import type { PageDoc } from "../../pageMaker/helpers/pageDoc";
import { isSection } from "../../pageMaker/helpers/pageDoc";
import { animate, aos, installLibs, tilt } from "./v3/libs";

/* ================================================================== */
/* Library untuk template Premium lama (katalog awal + v2)               */
/*                                                                    */
/* Template Premium sebelumnya diberi library dari menu Element →        */
/* Library supaya lebih hidup: AOS (animasi saat di-scroll) di semua     */
/* template, Animate.css di judul hero sebagian template, dan Vanilla    */
/* Tilt di gambar/kartu template yang bersifat visual. Efek dipasang     */
/* per node sehingga bisa diubah/dilepas di Pengaturan → Library.        */
/* Template v3 memasang library-nya sendiri dan tidak ada di daftar ini. */
/* ================================================================== */

interface LibraryPlan {
  /** Efek AOS untuk isi section. */
  aos: AosSettings["effect"];
  /** Efek Animate.css untuk baris pertama hero. */
  hero?: AnimateSettings["effect"];
  /** Vanilla Tilt pada gambar (atau kartu grid bila tak ada gambar). */
  tilt?: boolean;
}

export const LIBRARY_PLAN: Record<string, LibraryPlan> = {
  "company-agency": { aos: "fade-up", hero: "fadeInDown" },
  "shop-boutique": { aos: "zoom-in", tilt: true },
  "saas-launch": { aos: "fade-right", hero: "zoomIn" },
  "startup-pitch": { aos: "flip-up", tilt: true },
  "personal-brand": { aos: "fade", hero: "fadeInLeft" },
  "restaurant-saji": { aos: "slide-up" },
  "realestate-hunian": { aos: "zoom-in-up", hero: "lightSpeedInRight", tilt: true },
  "education-kelas": { aos: "fade-left" },
  "event-summit": { aos: "fade-up", hero: "fadeInDown" },
  "photography-lensa": { aos: "zoom-in", tilt: true },
  "tech-devhub": { aos: "fade-right", hero: "zoomIn", tilt: true },
  "health-klinik": { aos: "flip-up" },
  "travel-jelajah": { aos: "fade", hero: "fadeInLeft", tilt: true },
  "professional-lexa": { aos: "slide-up" },
  "creative-studio": { aos: "zoom-in-up", hero: "lightSpeedInRight" },
  "community-kita": { aos: "fade-left" },
  "fitness-gym-pulse": { aos: "fade-up", hero: "fadeInDown", tilt: true },
  "beauty-salon-ayu": { aos: "zoom-in" },
  "automotive-bengkel": { aos: "fade-right", hero: "zoomIn", tilt: true },
  "finance-dana": { aos: "flip-up" },
  "nonprofit-peduli": { aos: "fade", hero: "fadeInLeft" },
  "wedding-janji": { aos: "slide-up", tilt: true },
  "music-band-nada": { aos: "zoom-in-up", hero: "lightSpeedInRight", tilt: true },
  "construction-bangun": { aos: "fade-left" },
  "hotel-resort-pantai": { aos: "fade-up", hero: "fadeInDown", tilt: true },
  "kids-preschool": { aos: "zoom-in", tilt: true },
  "pets-vet-sahabat": { aos: "fade-right", hero: "zoomIn" },
  "agri-tani": { aos: "flip-up" },
  "logistics-kirim": { aos: "fade", hero: "fadeInLeft" },
  "gaming-arena": { aos: "slide-up" },
  "architecture-ruang": { aos: "zoom-in-up", hero: "lightSpeedInRight", tilt: true },
  "news-warta": { aos: "fade-left" },
  "saas-crm-relasi": { aos: "fade-up", hero: "fadeInDown" },
  "shop-skincare": { aos: "zoom-in", tilt: true },
  "education-university": { aos: "fade-right", hero: "zoomIn" },
  "health-dental": { aos: "flip-up" },
  "travel-umrah": { aos: "fade", hero: "fadeInLeft", tilt: true },
  "event-music-fest": { aos: "slide-up", tilt: true },
  "agency-marketing": { aos: "zoom-in-up", hero: "lightSpeedInRight" },
  "company-manufaktur": { aos: "fade-left" },
  "fitness-yoga": { aos: "fade-up", hero: "fadeInDown", tilt: true },
  "beauty-barbershop": { aos: "zoom-in" },
  "automotive-dealer": { aos: "fade-right", hero: "zoomIn", tilt: true },
  "finance-accounting": { aos: "flip-up" },
  "nonprofit-foundation-edu": { aos: "fade", hero: "fadeInLeft" },
  "wedding-organizer": { aos: "slide-up", tilt: true },
  "music-school": { aos: "zoom-in-up", hero: "lightSpeedInRight", tilt: true },
  "construction-interior": { aos: "fade-left" },
  "hospitality-villa": { aos: "fade-up", hero: "fadeInDown", tilt: true },
  "kids-toystore": { aos: "zoom-in", tilt: true },
  "pets-shop": { aos: "fade-right", hero: "zoomIn" },
  "agri-coffee-farm": { aos: "flip-up" },
  "logistics-cargo": { aos: "fade", hero: "fadeInLeft" },
  "gaming-esports-team": { aos: "slide-up" },
  "architecture-landscape": { aos: "zoom-in-up", hero: "lightSpeedInRight", tilt: true },
  "news-magazine": { aos: "fade-left" },
  "startup-fintech": { aos: "fade-up", hero: "fadeInDown" },
  "shop-furniture": { aos: "zoom-in", tilt: true },
  "education-language": { aos: "fade-right", hero: "zoomIn" },
  "health-pharmacy": { aos: "flip-up" },
  "photography-wedding-film": { aos: "fade", hero: "fadeInLeft", tilt: true },
  "tech-cybersecurity": { aos: "slide-up", tilt: true },
  "professional-notary": { aos: "zoom-in-up", hero: "lightSpeedInRight" },
  "community-coworking": { aos: "fade-left" },
};

const MAX_TILT = 8;

function hasGrid(n: ComponentNode): boolean {
  return isBox(n) && (n.layout === "grid" || n.children.some(hasGrid));
}

/** Pasang AOS: kartu di grid muncul bertahap, baris lain muncul utuh. */
function revealIn(n: ComponentNode, effect: AosSettings["effect"]): void {
  if (!isBox(n)) return;
  if (n.layout === "grid") {
    n.children.forEach((c, i) => aos(c, effect, { delay: Math.min(400, i * 100) }));
    return;
  }
  if (hasGrid(n)) n.children.forEach((c) => revealIn(c, effect));
  else aos(n, effect);
}

function collect(n: ComponentNode, pick: (x: ComponentNode, parent: BoxNode | null) => boolean, out: ComponentNode[], parent: BoxNode | null = null): ComponentNode[] {
  if (pick(n, parent)) out.push(n);
  if (isBox(n)) n.children.forEach((c) => collect(c, pick, out, n));
  return out;
}

/** Terapkan rencana library ke satu halaman template (tak berubah bila tak ada rencana). */
export function applyLibraryPlan(templateId: string, doc: PageDoc): PageDoc {
  const plan = LIBRARY_PLAN[templateId];
  if (!plan || doc.root.libraries?.length) return doc;
  const content = doc.root.children.filter((s) => isSection(s) && isBox(s) && s.tag !== "header" && s.tag !== "footer") as BoxNode[];
  if (!content.length) return doc;
  const libs: LibraryId[] = ["aos"];
  const [hero, ...rest] = content;
  // Halaman yang isinya hanya hero tetap memakai AOS (bukan Animate.css) agar efek scroll ada di setiap halaman.
  if (plan.hero && hero.children[0] && rest.length) {
    animate(hero.children[0], plan.hero);
    libs.push("animate");
    hero.children.slice(1).forEach((r) => revealIn(r, plan.aos));
  } else hero.children.forEach((r) => revealIn(r, plan.aos));
  for (const s of rest) s.children.forEach((r) => revealIn(r, plan.aos));
  if (plan.tilt) {
    const isImg = (x: ComponentNode) => !isBox(x) && (x as ElementNode).elementType === "image";
    let targets = rest.flatMap((s) => collect(s, isImg, []));
    if (!targets.length) targets = rest.flatMap((s) => collect(s, (x, p) => isBox(x) && p?.layout === "grid", []));
    targets.slice(0, MAX_TILT).forEach((t) => tilt(t, { max: 8, scale: 1.02 }));
    if (targets.length) libs.push("tilt");
  }
  return installLibs(doc, libs);
}
