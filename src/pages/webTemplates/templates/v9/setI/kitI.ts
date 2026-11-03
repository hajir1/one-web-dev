import { asset } from "../../../assets";
import { badge, col, el, eyebrow, grid, inline, section, stack, type Palette } from "../../../build";
import type { TemplateContent, TemplatePageDef } from "../../../types";
import { isBox, type BoxNode, type ComponentNode, type ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import type { AnimPreset, NodeAnim } from "../../../../pageMaker/engine/helpers/motion";
import * as K from "../../v5/setF/kitF";
import type { Act, LookD } from "../../v5/setF/kitF";
import { FACES, NAMES, block, hero, mainAct, slug, type Ctx } from "../../v6/setG/kitG";
import type { B, BlockRef, GSpec } from "../../v6/setG/spec";
import { artKeyI } from "./keys";
import type { Block3D, Hero3D, IBlockRef, ISpec, Motion } from "./spec";

/* ================================================================== */
/* Mesin template v9 bagian I: ISpec (data) → TemplateContent.          */
/*                                                                    */
/* Blok biasa memakai mesin set G apa adanya (section sama persis dan   */
/* bisa diedit di Desain Halaman). Hero & blok 3D memakai elemen 3D      */
/* Premium (Three.js dimuat saat terlihat, gambar statis tanpa WebGL),   */
/* dan setiap halaman diberi animasi CSS bawaan (tanpa library) sesuai   */
/* gaya `motion`: judul, kartu (berurutan), gambar, dan elemen 3D.       */
/* ================================================================== */

const HERO_3D: Hero3D[] = ["h3-globe", "h3-product", "h3-shape", "h3-particles", "h3-cards"];
const BLOCK_3D: Block3D[] = ["x-globe", "x-product", "x-shape", "x-tilt", "x-particles"];
export const is3dHero = (h: string): h is Hero3D => (HERO_3D as string[]).includes(h);
export const is3dBlock = (r: IBlockRef): boolean => (BLOCK_3D as string[]).includes(typeof r === "string" ? r : r[0]);

const NAMES_3D: Record<Block3D, string> = {
  "x-globe": "Globe 3D",
  "x-product": "Produk 3D",
  "x-shape": "Fitur 3D",
  "x-tilt": "Kartu 3D",
  "x-particles": "Ajakan Partikel",
};

const TITLES_3D: Record<Block3D, B> = {
  "x-globe": ["Menjangkau lebih jauh", "Reaching further"],
  "x-product": ["Lihat dari segala sisi", "See it from every angle"],
  "x-shape": ["Dirancang dengan presisi", "Designed with precision"],
  "x-tilt": ["Pilihan unggulan", "Featured picks"],
  "x-particles": ["Siap mulai?", "Ready to start?"],
};

const SURFACE_DARK = "#0b1020";

function need<T>(v: T | undefined, what: string, s: ISpec): T {
  if (v === undefined || (Array.isArray(v) && v.length === 0)) throw new Error(`${s.id}: butuh ${what}`);
  return v;
}

/* ------------------------------ elemen 3D -------------------------- */

const label = (c: Ctx, what: string) => `${c.s.brand} — ${what}`;

function globeEl(c: Ctx, s: ISpec, h: number, mh: number): ElementNode {
  const g = need(s.three.globe, "three.globe", s);
  const L = c.L;
  return el(
    "three-globe",
    {
      height: h,
      mobileHeight: mh,
      color: L.dark ? L.p.primary : L.p.soft,
      ocean: L.dark ? SURFACE_DARK : L.inv,
      glow: L.p.primary,
      marker: "#fbbf24",
      markers: g.markers,
      arcs: g.arcs ?? true,
      startLon: g.startLon ?? 110,
      alt: label(c, c.tr("globe jangkauan", "coverage globe")),
    },
    "Globe 3D",
  );
}

function productEl(c: Ctx, s: ISpec, h: number, mh: number): ElementNode {
  const p = need(s.three.product, "three.product", s);
  return el(
    "three-product",
    { height: h, mobileHeight: mh, model: p.model, finish: p.finish, color: p.color ?? c.L.p.primary, accent: p.accent ?? "#f8fafc", alt: label(c, c.tr("produk 3D", "3D product")) },
    "Produk 3D",
  );
}

function shapeEl(c: Ctx, s: ISpec, h: number, mh: number): ElementNode {
  const sh = need(s.three.shape, "three.shape", s);
  return el(
    "three-shape",
    { height: h, mobileHeight: mh, shape: sh.shape, material: sh.material, outline: !!sh.outline, color: c.L.p.primary, accent: c.L.p.soft, alt: label(c, c.tr("bentuk 3D", "3D shape")) },
    "Bentuk 3D",
  );
}

function particlesEl(c: Ctx, s: ISpec, h: number, mh: number): ElementNode {
  const pt = need(s.three.particles, "three.particles", s);
  return el(
    "three-particles",
    { height: h, mobileHeight: mh, radius: 0, background: c.L.dark ? SURFACE_DARK : c.L.inv, shape: pt.shape, density: pt.density ?? "normal", color: c.L.p.primary, accent: pt.accent ?? "#e2e8f0", alt: label(c, c.tr("latar partikel", "particle background")) },
    "Partikel 3D",
  );
}

function tiltEl(c: Ctx, i: number, title: string, text: string, badgeText: string, cta: string, href: string): ElementNode {
  const L = c.L;
  return el(
    "card-3d",
    {
      imageUrl: c.img(i),
      alt: label(c, title),
      badge: badgeText,
      title,
      text,
      ctaLabel: cta,
      ctaUrl: href,
      maxTilt: 10,
      maxWidth: 420,
      radius: L.shape === "brutal" || L.shape === "sharp" ? 4 : Math.max(14, L.radius),
      bg: L.dark ? L.surface : L.inv,
      textColor: "#f8fafc",
      accent: L.p.primary,
    },
    "Kartu 3D",
  );
}

/**
 * Teks di atas latar partikel: kolom ditarik ke atas setinggi elemen
 * partikel (margin negatif), jadi tetap satu alur dokumen & responsif.
 */
function overlay(kids: (ElementNode | BoxNode)[], h: number, mh: number, name: string): BoxNode {
  const o = col(kids, { gap: 18, name, align: "center" });
  K.addCss(o, `position: relative; z-index: 1; margin-top: -${h}px; min-height: ${h}px; justify-content: center; padding: 48px 24px; pointer-events: none;`);
  K.addCss(o, "& a, & button, & input { pointer-events: auto; }");
  K.addCss(o, `@media (max-width: 640px) { & { margin-top: -${mh}px; min-height: ${mh}px; padding: 32px 20px; } }`);
  return o;
}

const chips = (L: LookD, list: string[], dark: boolean, justify: "start" | "center" = "start") =>
  inline(
    list.map((x) => badge(x, dark ? "#ffffff14" : L.surface, dark ? "#f8fafc" : L.p.ink, dark ? "#ffffff3d" : L.p.line)),
    { gap: 8, justify },
  );

/* ------------------------------ hero 3D ---------------------------- */

function hero3d(c: Ctx, s: ISpec, kind: Hero3D): BoxNode {
  const { L, b, t } = c;
  const second = s.pages[0];
  const secondAct: Act = [t(second.name), c.href(second.key), "outline"];
  const perks = b.perks.map(t);
  const stats = b.stats.map(([n, l]) => [n, t(l)] as [string, string]);
  switch (kind) {
    case "h3-globe": {
      const text = col(
        [
          badge(t(b.eyebrow), "#ffffff1a", "#ffffff", "#ffffff44"),
          K.T(L, t(b.title), "h1", { size: 56, color: "#ffffff" }),
          K.P(L, t(b.text), { size: 18, color: "#cbd5e1" }),
          K.acts(L, [mainAct(c, "light"), [t(second.name), c.href(second.key), "dark"]]),
          col(
            stats.slice(0, 3).map(([n, l]) => col([K.T(L, n, "h3", { size: 30, color: "#ffffff" }), K.P(L, l, { size: 13, color: "#94a3b8" })], { gap: 2, name: "Angka" })),
            { layout: "row", gap: 32, name: "Deret angka", align: "start" },
          ),
        ],
        { gap: 20, name: "Teks hero" },
      );
      const g = col([globeEl(c, s, 540, 340)], { name: "Globe", align: "stretch" });
      return section("Hero Globe 3D", [grid([text, g], "minmax(0, 1fr) minmax(0, 1.1fr)", { gap: 32, align: "center" })], { gradient: [L.dark ? SURFACE_DARK : L.inv, L.p.primaryDark, 155], padY: 64 });
    }
    case "h3-product": {
      const text = col(
        [eyebrow(t(b.eyebrow), L.p.primary), K.T(L, t(b.title), "h1", { size: 58 }), K.P(L, t(b.text), { size: 18 }), chips(L, stats.slice(0, 3).map(([n, l]) => `${n} · ${l}`), L.dark), K.acts(L, [mainAct(c), secondAct])],
        { gap: 18, name: "Teks hero" },
      );
      const stage = col([productEl(c, s, 520, 360)], { name: "Panggung produk", align: "stretch" });
      K.addCss(stage, `background: radial-gradient(circle at 50% 45%, ${L.p.soft}, transparent 68%); border-radius: ${Math.max(16, L.radius * 2)}px;`);
      return section("Hero Produk 3D", [grid(s.footer === "slim" ? [stage, text] : [text, stage], "minmax(0, 1fr) minmax(0, 1fr)", { gap: 40, align: "center" })], { gradient: [L.alt, L.bg, 170], padY: 72 });
    }
    case "h3-shape": {
      const list = col(
        perks.map((x) => K.P(L, `✓ ${x}`, { size: 16, color: L.p.ink, weight: 600 })),
        { gap: 8, name: "Poin" },
      );
      const text = col([eyebrow(t(b.eyebrow), L.p.primary), K.T(L, t(b.title), "h1", { size: 60 }), K.P(L, t(b.text), { size: 18 }), list, K.acts(L, [mainAct(c), secondAct])], { gap: 18, name: "Teks hero" });
      const shape = col([shapeEl(c, s, 500, 320)], { name: "Bentuk 3D", align: "stretch" });
      return section("Hero Bentuk 3D", [grid([text, shape], "minmax(0, 1.1fr) minmax(0, 1fr)", { gap: 40, align: "center" })], { bg: L.bg, padY: 80 });
    }
    case "h3-particles": {
      const H = 620;
      const MH = 540;
      const kids = [
        badge(t(b.eyebrow), "#ffffff14", "#ffffff", "#ffffff40"),
        K.T(L, t(b.title), "h1", { size: 64, color: "#ffffff", align: "center" }),
        K.P(L, t(b.text), { size: 19, color: "#cbd5e1", align: "center" }),
        K.acts(L, [mainAct(c, "light"), [t(second.name), c.href(second.key), "dark"]], "center"),
        chips(L, perks, true, "center"),
      ];
      const row = stack([particlesEl(c, s, H, MH), overlay(kids, H, MH, "Teks hero")], { gap: 0, align: "stretch" });
      const sec = section("Hero Partikel 3D", [row], { bg: L.dark ? SURFACE_DARK : L.inv, padY: 0, width: 1600 });
      sec.section = { ...sec.section!, padX: 0 };
      return sec;
    }
    case "h3-cards": {
      const head = stack(
        [eyebrow(t(b.eyebrow), L.p.primary, "center"), K.T(L, t(b.title), "h1", { size: 58, align: "center" }), K.P(L, t(b.text), { size: 18, align: "center" }), K.acts(L, [mainAct(c), secondAct], "center")],
        { gap: 16, align: "center" },
      );
      const cards = b.svc.slice(0, 3).map(([, ti, tx, meta], i) =>
        col([tiltEl(c, i, t(ti), t(tx), meta ?? perks[i % perks.length], t(b.cta), c.href(b.ctaPage))], { name: "Sel kartu", align: "center" }),
      );
      return section("Hero Kartu 3D", [head, grid(cards, 3, { gap: 24, align: "stretch" })], { gradient: [L.p.soft, L.bg, 180], padY: 80 });
    }
  }
}

/* ------------------------------ blok 3D ---------------------------- */

function block3d(c: Ctx, s: ISpec, ref: IBlockRef, name: string): BoxNode {
  const [id, title0, text0] = (typeof ref === "string" ? [ref] : ref) as [Block3D, B?, B?];
  const { L, b, t } = c;
  const title = t(title0 ?? TITLES_3D[id]);
  const text = text0 ? t(text0) : undefined;
  const bg = c.bg();
  switch (id) {
    case "x-globe": {
      // Angka dibungkus baris (bukan Row bersarang) agar struktur Section → Row → isi tetap valid.
      const nums = col(
        b.stats.map(([n, l]) => col([K.T(L, n, "h3", { size: 34, color: "#ffffff" }), K.P(L, t(l), { size: 14, color: "#94a3b8" })], { gap: 4, name: "Angka", width: 160 })),
        { layout: "row", wrap: true, stackOnMobile: false, gap: 24, align: "start", name: "Daftar angka" },
      );
      const side = col([...K.introEls(L, { eyebrow: t(b.eyebrow), title, text: text ?? t(b.about), light: true }), nums, K.acts(L, [mainAct(c, "light")])], { gap: 18, name: "Teks" });
      return section(name, [grid([col([globeEl(c, s, 460, 320)], { name: "Globe", align: "stretch" }), side], "minmax(0, 1.1fr) minmax(0, 1fr)", { gap: 40, align: "center" })], { bg: L.dark ? SURFACE_DARK : L.inv, padY: 80 });
    }
    case "x-product": {
      const rows = (b.specs ?? b.perks.map((p, i) => [[`0${i + 1}`, `0${i + 1}`] as B, p])).map(([k, v]) => {
        const r = col([K.P(L, t(k), { size: 13, color: L.p.muted, weight: 600 }), K.P(L, t(v), { size: 16, color: L.p.ink, weight: 700 })], { gap: 2, name: "Spesifikasi" });
        K.addCss(r, `padding: 12px 0; border-bottom: 1px solid ${L.p.line};`);
        return r;
      });
      const side = col([...K.introEls(L, { eyebrow: t(b.eyebrow), title, text: text ?? t(b.about) }), ...rows, K.acts(L, [mainAct(c)])], { gap: 10, name: "Spesifikasi produk" });
      return section(name, [grid([col([productEl(c, s, 480, 340)], { name: "Produk", align: "stretch" }), side], "minmax(0, 1fr) minmax(0, 1fr)", { gap: 48, align: "center" })], { bg, padY: 88 });
    }
    case "x-shape": {
      const feats = b.svc.slice(0, 3).map(([icon, ti, tx]) => {
        const row = col([K.glyph(L, icon), col([K.T(L, t(ti), "h3", { size: 19 }), K.P(L, t(tx), { size: 15 })], { gap: 4, name: "Teks fitur" })], { layout: "row", gap: 16, name: "Fitur", align: "start" });
        row.stackOnMobile = false;
        row.wrap = false;
        return row;
      });
      const side = col([...K.introEls(L, { eyebrow: t(b.eyebrow), title, text }), ...feats], { gap: 18, name: "Daftar fitur" });
      return section(name, [grid([side, col([shapeEl(c, s, 440, 300)], { name: "Bentuk 3D", align: "stretch" })], "minmax(0, 1fr) minmax(0, 1fr)", { gap: 40, align: "center" })], { bg, padY: 88 });
    }
    case "x-tilt": {
      const src = b.items?.length && s.tiltFrom !== "svc" ? b.items.map(([n, d, price]) => [t(n), t(d), price] as const) : b.svc.map(([, ti, tx, meta]) => [t(ti), t(tx), meta ?? ""] as const);
      const cards = src.slice(0, 3).map(([ti, tx, meta], i) => col([tiltEl(c, i + 3, ti, tx, meta || t(b.perks[i % b.perks.length]), `${t(b.itemCta?.[0] ?? b.cta)} →`, c.href(b.itemCta?.[1] ?? b.ctaPage))], { name: "Sel kartu", align: "center" }));
      return section(name, [K.intro(L, { title, text, align: "center" }), grid(cards, 3, { gap: 24, align: "stretch" })], { bg, padY: 88 });
    }
    case "x-particles": {
      const H = 420;
      const MH = 380;
      const kids = [K.T(L, title0 ? title : t(b.ctaTitle), "h2", { size: 44, color: "#ffffff", align: "center" }), K.P(L, text ?? t(b.ctaText), { size: 18, color: "#cbd5e1", align: "center" }), K.acts(L, [mainAct(c, "light")], "center")];
      const sec = section(name, [stack([particlesEl(c, s, H, MH), overlay(kids, H, MH, "Ajakan")], { gap: 0, align: "stretch" })], { bg: L.dark ? SURFACE_DARK : L.inv, padY: 0, width: 1600 });
      sec.section = { ...sec.section!, padX: 0 };
      return sec;
    }
  }
}

/* ------------------------------ animasi ---------------------------- */

interface MotionSet {
  head: AnimPreset;
  card: AnimPreset;
  img: AnimPreset;
  stagger: number;
}

const MOTION: Record<Motion, MotionSet> = {
  calm: { head: "fade-up", card: "fade-up", img: "fade-in", stagger: 80 },
  lively: { head: "blur-in", card: "zoom-in", img: "fade-up", stagger: 110 },
  bold: { head: "fade-right", card: "flip-up", img: "zoom-out", stagger: 140 },
};

const THREE_TYPES = new Set(["three-globe", "three-product", "three-shape", "three-particles"]);
const isCardBox = (n: BoxNode) => !n.section && !n.row && /^Kartu|^Sel kartu|^Angka|^Spesifikasi$|^Fitur$/.test(n.name ?? "");
/** Node yang sudah memakai transform sendiri (mis. polaroid miring) tidak dianimasikan agar posisinya tidak tertimpa. */
const hasTransform = (n: ComponentNode) => /transform|rotate|translate/.test(n.advanced?.customCss ?? "");

/**
 * Animasi CSS bawaan untuk satu section: judul h1/h2 & kartu (berurutan)
 * masuk saat terlihat, gambar & elemen 3D memudar masuk. Node yang sudah
 * dianimasikan tidak diturunkan lagi ke anak-anaknya.
 */
export function applyMotion(sec: BoxNode, m: Motion): void {
  const set = MOTION[m];
  const give = (n: ComponentNode, preset: AnimPreset, delay = 0) => {
    const a: NodeAnim = { preset, trigger: "scroll", ...(delay ? { delay } : {}) };
    n.anim = a;
  };
  const visit = (n: ComponentNode, delay: number): void => {
    if (n.anim || hasTransform(n)) return;
    if (isBox(n)) {
      if (isCardBox(n)) return give(n, set.card, delay);
      let i = 0;
      for (const ch of n.children) {
        const cardLike = isBox(ch) && isCardBox(ch);
        visit(ch, cardLike ? Math.min(560, i++ * set.stagger) : 0);
      }
      return;
    }
    const e = n as ElementNode;
    const tag = (e.state as { tag?: string }).tag;
    if (e.elementType === "text" && (tag === "h1" || tag === "h2")) return give(e, set.head);
    if (e.elementType === "image") return give(e, set.img);
    if (THREE_TYPES.has(e.elementType)) return give(e, "fade-in");
  };
  visit(sec, 0);
}

/* ------------------------------ harga ------------------------------ */

/**
 * Harga set I (kredit): 25 per halaman + 20 per jenis elemen 3D + bonus
 * kualitas set G (0/5/10 dari item Premium & library), dijepit 60–300.
 */
export function showcasePrice(pages: number, threeD: number, bonus: number): number {
  return Math.min(300, Math.max(60, 25 * pages + 20 * threeD + bonus));
}

/* ------------------------------ konten ----------------------------- */

/** ISpec → TemplateContent. */
export function buildContentI(s: ISpec): TemplateContent {
  const [ink, muted, primary, primaryDark, soft, line] = s.pal;
  const P: Palette = { ink, muted, primary, primaryDark, soft, line };
  // Efek muncul memakai animasi CSS bawaan (bukan library AOS/Animate).
  const L = K.lookD(P, { ...s.look, fx: {} });
  const defs: TemplatePageDef[] = [K.home(), ...s.pages.map((p) => K.pg(p.key, [slug(p.name[0]), p.name[0]], [slug(p.name[1]), p.name[1]]))];
  const g = s as unknown as GSpec;
  return {
    brand: s.brand,
    pages: defs,
    build: (key, tr, href) => {
      let alt = 0;
      const t = (x: B) => tr(x[0], x[1]);
      const c: Ctx = {
        s: g,
        b: s.biz,
        L,
        tr,
        href,
        free: false,
        t,
        img: (i) => asset(artKeyI(s.id, i % 6)),
        face: (i) => asset(FACES[(i + s.id.length) % FACES.length]),
        alt: (i) => `${s.brand} — ${t(s.biz.svc[i % s.biz.svc.length][1])}`,
        bg: () => (alt++ % 2 ? L.alt : L.bg),
      };
      const b = s.biz;
      const menu = s.pages.map((p) => t(p.name));
      const nav = s.chrome?.includes("mega") ? K.megaD(L, menu.slice(0, 5), t(b.cta), href(b.ctaPage)) : undefined;
      const head = K.headerD(s.short ?? s.brand, L, {
        variant: s.header,
        ...(nav ? { nav } : { cta: [t(b.cta), href(b.ctaPage)] as Act }),
        ...(s.header === "split" ? { info: [b.phone, t(b.hours), b.email] } : {}),
        sticky: s.header === "pill" || s.header === "ink",
      });
      const foot = K.footerD(s.brand, L, {
        variant: s.footer,
        about: t(b.about),
        cols: [
          { title: tr("Halaman", "Pages"), items: menu },
          { title: tr("Kontak", "Contact"), items: [b.addr, b.phone, b.email, t(b.hours)] },
        ],
        social: b.social,
        copy: `© 2026 ${s.brand}. ${tr("Konten contoh.", "Sample content.")}`,
        ...(s.chrome?.includes("top") ? { extra: [K.backTop(L, tr("Ke atas", "Back to top"))] } : {}),
      });
      const named = (refs: IBlockRef[]) => {
        const seen: Record<string, number> = {};
        return refs.map((r) => {
          const id = typeof r === "string" ? r : r[0];
          const base = is3dBlock(r) ? NAMES_3D[id as Block3D] : NAMES[id as keyof typeof NAMES];
          seen[id] = (seen[id] ?? 0) + 1;
          const nm = seen[id] > 1 ? `${base} ${seen[id]}` : base;
          return is3dBlock(r) ? block3d(c, s, r, nm) : block(c, r as BlockRef, nm);
        });
      };
      const map: Record<string, () => BoxNode[]> = {
        home: () => [is3dHero(s.hero) ? hero3d(c, s, s.hero) : hero(c, g.pages), ...named(s.home)],
      };
      for (const p of s.pages)
        map[p.key] = () => {
          alt = 1;
          return [K.pageHead(L, { eyebrow: t(p.name), title: t(p.title), text: p.text ? t(p.text) : undefined, name: `Kepala ${p.name[0]}` }), ...named(p.blocks)];
        };
      const doc = K.render(L, key, head, foot, map);
      const secs = doc.root.children as BoxNode[];
      secs.slice(1, -1).forEach((sec) => applyMotion(sec, s.motion));
      return doc;
    },
  };
}

/** Jenis elemen 3D yang dipakai satu spesifikasi (hero + semua blok). */
export function threeTypesOf(s: ISpec): string[] {
  const out = new Set<string>();
  const of: Record<string, string> = { "h3-globe": "three-globe", "x-globe": "three-globe", "h3-product": "three-product", "x-product": "three-product", "h3-shape": "three-shape", "x-shape": "three-shape", "h3-particles": "three-particles", "x-particles": "three-particles", "h3-cards": "card-3d", "x-tilt": "card-3d" };
  if (of[s.hero]) out.add(of[s.hero]);
  for (const r of [...s.home, ...s.pages.flatMap((p) => p.blocks)]) {
    const id = typeof r === "string" ? r : r[0];
    if (of[id]) out.add(of[id]);
  }
  return [...out].sort();
}
