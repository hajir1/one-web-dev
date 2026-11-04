import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, TemplatePageDef, Tr } from "../../../types";
import type { BoxNode, ElementNode } from "../../../../pageMaker/engine/helpers/componentTypes";
import * as K from "../../v5/setF/kitF";
import type { Act, ChartC, Field, LookD } from "../../v5/setF/kitF";
import { artKey } from "./keys";
import type { B, Biz, BlockId, BlockRef, GChart, GPage, GSpec } from "./spec";

/* ================================================================== */
/* v6 template engine part G: GSpec (data) → TemplateContent.           */
/*                                                                    */
/* Each block calls one shared kit function, so the resulting sections  */
/* are exactly the same as the handmade sections in sets D–F and        */
/* are editable in Page Design. Free templates use the free equivalent  */
/* of every Premium block (FREE_SWAP) and no Premium chrome elements    */
/* (mega menu, back to top, typing text).                               */
/* ================================================================== */

/** Premium block → free equivalent for Free templates. */
export const FREE_SWAP: Partial<Record<BlockId, BlockId>> = {
  counter: "stats",
  quotes: "pull",
  plans: "ptable",
  switch: "ptable",
  compare: "ptable",
  gallery: "mosaic",
  marquee: "partners",
  progress: "editorial",
  countdown: "cta",
  slider: "fimg",
  ba: "about",
  offer: "cta-soft",
};

/** Section name (shown in the Page Maker Structure panel). */
export const NAMES: Record<BlockId, string> = {
  svc: "Layanan",
  "svc-inv": "Layanan Kontras",
  bento: "Bento Layanan",
  special: "Spesialisasi",
  stats: "Deret Angka",
  counter: "Statistik Animasi",
  kpi: "Pita KPI",
  zig: "Langkah Zigzag",
  rail: "Rel Langkah",
  quotes: "Testimoni",
  pull: "Kutipan",
  faq: "Tanya Jawab",
  tabs: "Tab Layanan",
  plans: "Paket Harga",
  switch: "Harga Fleksibel",
  compare: "Perbandingan Paket",
  ptable: "Tabel Paket",
  items: "Katalog",
  menu: "Daftar Item",
  list: "Indeks Item",
  gallery: "Galeri Lightbox",
  mosaic: "Galeri Mozaik",
  polaroid: "Polaroid",
  team: "Tim",
  about: "Tentang",
  fsplit: "Belah Lebar Penuh",
  fimg: "Gambar Lebar Penuh",
  editorial: "Nilai",
  notes: "Catatan Tempel",
  swatch: "Swatch",
  words: "Pita Kata",
  marquee: "Marquee Mitra",
  partners: "Mitra",
  cta: "Ajakan",
  "cta-soft": "Ajakan Lembut",
  band: "Pita Belah",
  news: "Buletin",
  timeline: "Sejarah",
  events: "Jadwal",
  board: "Papan Jadwal",
  posts: "Artikel",
  specs: "Spesifikasi",
  loc: "Lokasi",
  contact: "Kontak",
  book: "Pemesanan",
  chart: "Panel Grafik",
  duo: "Dua Grafik",
  progress: "Progres",
  countdown: "Hitung Mundur",
  slider: "Slider",
  ba: "Sebelum Sesudah",
  offer: "Penawaran",
  notice: "Pengumuman",
};

const PREMIUM_BLOCKS = Object.keys(FREE_SWAP) as BlockId[];

/** Default title of each block (can be replaced per template through BlockRef). */
const TITLES: Partial<Record<BlockId, B>> = {
  svc: ["Yang kami kerjakan", "What we do"],
  "svc-inv": ["Layanan unggulan", "Signature services"],
  bento: ["Semua dalam satu tempat", "Everything in one place"],
  special: ["Kenapa memilih kami", "Why choose us"],
  counter: ["Dalam angka", "By the numbers"],
  zig: ["Cara kerjanya", "How it works"],
  rail: ["Langkah demi langkah", "Step by step"],
  quotes: ["Kata mereka", "What people say"],
  faq: ["Pertanyaan umum", "Common questions"],
  tabs: ["Pilih kebutuhan Anda", "Pick what you need"],
  plans: ["Pilihan paket", "Packages"],
  switch: ["Harga yang jelas", "Clear pricing"],
  compare: ["Bandingkan paket", "Compare packages"],
  ptable: ["Daftar paket", "Package list"],
  items: ["Pilihan favorit", "Favourites"],
  menu: ["Daftar lengkap", "Full list"],
  list: ["Semua pilihan", "All options"],
  gallery: ["Galeri", "Gallery"],
  mosaic: ["Galeri", "Gallery"],
  polaroid: ["Momen terbaru", "Recent moments"],
  team: ["Orang di balik layar", "The people behind it"],
  editorial: ["Yang kami pegang", "What we stand for"],
  notes: ["Catatan kecil dari kami", "A few notes from us"],
  swatch: ["Pilihan warna & bahan", "Colours & materials"],
  timeline: ["Perjalanan kami", "Our story"],
  events: ["Jadwal terdekat", "Coming up"],
  board: ["Jadwal minggu ini", "This week's schedule"],
  posts: ["Kabar & tulisan", "News & stories"],
  specs: ["Detail teknis", "Specifications"],
  loc: ["Temukan kami", "Find us"],
  chart: ["Hasil yang terukur", "Measurable results"],
  duo: ["Data terbaru", "Latest data"],
  progress: ["Capaian kami", "Our progress"],
  slider: ["Sorotan", "Highlights"],
  ba: ["Sebelum & sesudah", "Before & after"],
  marquee: ["Dipercaya oleh", "Trusted by"],
};

export const FACES = ["v6g-face-1", "v6g-face-2", "v6g-face-3", "v6g-face-4", "v6g-face-5", "v6g-face-6", "v6g-face-7", "v6g-face-8"];

export interface Ctx {
  s: GSpec;
  b: Biz;
  L: LookD;
  tr: Tr;
  href: (k: string) => string;
  free: boolean;
  t: (x: B) => string;
  img: (i: number) => string;
  face: (i: number) => string;
  alt: (i: number) => string;
  /** Alternating background for the next section. */
  bg: () => string;
}

export const words = (c: Ctx, x: B) =>
  c
    .t(x)
    .split(",")
    .map((w) => w.trim())
    .filter(Boolean);

function need<T>(v: T | undefined, what: string, c: Ctx): T {
  if (v === undefined || (Array.isArray(v) && v.length === 0)) throw new Error(`${c.s.id}: blok butuh biz.${what}`);
  return v;
}

export const chartOf = (c: Ctx, g: GChart): ChartC => ({
  type: g.type,
  title: c.t(g.title),
  series: c.t(g.series),
  rows: g.rows.map((r) => {
    const [label, ...rest] = r.split(",");
    const [li, le] = label.split("|");
    return [c.tr(li.trim(), (le ?? li).trim()), ...rest.map((x) => x.trim())].join(", ");
  }),
  legend: g.series[0].includes(","),
});

export const mainAct = (c: Ctx, style?: Act[2]): Act => [c.t(c.b.cta), c.href(c.b.ctaPage), ...(style ? [style] : [])] as Act;

/** Plan features → comparison table rows (✓ / –). */
function compareRows(c: Ctx): string[] {
  const plans = need(c.b.plans, "plans", c);
  const feats = plans.map((p) => c.t(p[3]).split(";").map((x) => x.trim()));
  const all = [...new Set(feats.flat())].slice(0, 6);
  return [`${c.tr("Harga", "Price")} | ${plans.map((p) => p[1]).join(" | ")}`, ...all.map((f) => `${f} | ${feats.map((fs) => (fs.includes(f) ? "✓" : "–")).join(" | ")}`)];
}

/** Build one block into a section. */
export function block(c: Ctx, ref: BlockRef, name: string): BoxNode {
  const [id0, title0, text0] = typeof ref === "string" ? [ref] : ref;
  const id = c.free && FREE_SWAP[id0] ? FREE_SWAP[id0]! : id0;
  const L = c.L;
  const b = c.b;
  const t = c.t;
  const dflt = TITLES[id];
  const title = title0 ? t(title0) : dflt ? t(dflt) : "";
  const text = text0 ? t(text0) : undefined;
  const intro = { title, text, name };
  const bg = c.bg();
  const svcItems = () => b.svc.map(([icon, ti, tx, meta]) => ({ icon, title: t(ti), text: t(tx), meta }));
  const values = () => (b.values ?? b.steps).map(([x, y]) => [t(x), t(y)] as [string, string]);
  const captions = () => [...(b.items ?? []).map((x) => t(x[0])), ...b.svc.map((x) => t(x[1]))];
  const pics = (n: number) => {
    const cap = captions();
    return Array.from({ length: n }, (_, i) => [c.img(i), cap[i % cap.length]] as [string, string]);
  };
  switch (id) {
    case "svc":
    case "svc-inv":
      return K.cardsD(L, { ...intro, items: svcItems(), cols: b.svc.length === 4 ? 2 : 3, inv: id === "svc-inv", bg: id === "svc" ? bg : undefined });
    case "bento":
      return K.bento(L, { ...intro, bg, items: svcItems().map((x, i, all) => ({ ...x, wide: i === 0 || (all.length % 3 === 1 && i === all.length - 1), accent: i === 1, ...(i === 0 ? { image: c.img(1) } : {}) })) });
    case "special":
      return K.specialty(L, {
        ...intro,
        eyebrow: t(b.eyebrow),
        bg,
        side: { title: t(b.ctaTitle), text: t(b.ctaText), items: b.perks.map(t), action: mainAct(c), inv: c.s.look.shape !== "glass" },
        items: svcItems().slice(0, 4),
        image: { src: c.img(2), alt: c.alt(2) },
        sideRight: c.s.header === "split" || c.s.header === "center",
        ratio: c.s.footer === "giant" ? "1/3" : "1/4",
      });
    case "stats":
      return K.numbers(L, { items: b.stats.map(([n, l]) => [n, t(l)]), name, inv: c.s.look.dark });
    case "counter":
      return K.counterD(L, { ...intro, items: b.stats.map(([n, l]) => `${n} | ${t(l)}`), inv: true });
    case "kpi":
      return K.kpiStrip(L, { items: b.stats.map(([n, l, d]) => [n, t(l), d ? t(d) : "✓"]), name });
    case "zig":
      return K.zigzag(L, { ...intro, bg, steps: b.steps.map(([x, y], i) => [t(x), t(y), ...(b.steps.length <= 3 ? [c.img(3 + i)] : [])] as [string, string, string?]) });
    case "rail":
      return K.rail(L, { ...intro, bg, steps: b.steps.map(([x, y]) => [t(x), t(y)]) });
    case "quotes":
      return K.quotesD(L, { ...intro, bg, items: need(b.quotes, "quotes", c).map(([q, n, r], i) => ({ quote: t(q), author: n, role: t(r), avatar: c.face(i) })) });
    case "pull": {
      const [q, n, r] = need(b.quotes, "quotes", c)[0];
      return K.pullQuote(L, { text: t(q), name: n, role: t(r), name2: name, inv: !c.s.look.dark });
    }
    case "faq":
      return K.faqD(L, { ...intro, bg, items: need(b.faq, "faq", c).map(([q, a]) => [t(q), t(a)]) });
    case "tabs":
      return K.tabsD(L, { ...intro, bg, tabs: b.svc.map(([, ti, tx, meta]) => [t(ti), `${t(tx)}${meta ? ` ${meta}` : ""}`]) });
    case "plans": {
      const per = b.period ? t(b.period) : "";
      return K.plansD(L, {
        ...intro,
        bg,
        items: need(b.plans, "plans", c).map(([n, price, d, f], i, all) => ({
          plan: t(n),
          price,
          period: per,
          description: t(d),
          features: t(f)
            .split(";")
            .map((x) => x.trim()),
          buttonText: t(b.cta),
          buttonHref: c.href(b.ctaPage),
          featured: i === Math.floor(all.length / 2),
          ...(i === Math.floor(all.length / 2) ? { badge: c.tr("Terlaris", "Most popular") } : {}),
        })),
      });
    }
    case "switch": {
      const plans = need(b.plans, "plans", c);
      return K.priceSwitchD(L, {
        ...intro,
        bg,
        plans: plans.map(([n, m, , f, y]) => `${t(n)} | ${m} | ${need(y, "plans[].yearly", c)} | ${t(f)} | ${t(b.cta)}`),
        labels: [c.tr("Bulanan", "Monthly"), c.tr("Tahunan", "Yearly"), c.tr("Hemat 2 bulan", "2 months free"), c.tr("/bulan", "/month"), c.tr("/tahun", "/year")],
        featured: Math.ceil(plans.length / 2),
        href: c.href(b.ctaPage),
      });
    }
    case "compare": {
      const plans = need(b.plans, "plans", c);
      return K.compareD(L, { ...intro, bg, columns: plans.map((p) => t(p[0])), rows: compareRows(c), highlight: Math.ceil(plans.length / 2), caption: c.tr("Harga contoh.", "Sample prices.") });
    }
    case "ptable":
      return K.tableD(L, {
        ...intro,
        title: title || t(TITLES.ptable!),
        bg,
        columns: [c.tr("Paket", "Package"), c.tr("Isi", "Includes"), c.tr("Harga", "Price")],
        rows: need(b.plans, "plans", c).map(([n, price, , f]) => [t(n), t(f).split(";").map((x) => x.trim()).join(", "), `${price}${b.period ? t(b.period) : ""}`]),
        note: c.tr("Harga contoh.", "Sample prices."),
      });
    case "items":
      return K.catalog(L, {
        ...intro,
        bg,
        cols: need(b.items, "items", c).length % 3 === 0 ? 3 : 4,
        items: b.items!.map(([n, d, price], i) => ({ image: c.img(i), title: t(n), text: t(d), price, cta: t(b.itemCta?.[0] ?? b.cta), href: c.href(b.itemCta?.[1] ?? b.ctaPage), ...(i === 0 ? { badge: c.tr("Favorit", "Favourite") } : {}) })),
      });
    case "menu":
      return K.cardsD(L, { ...intro, bg, cols: 3, items: need(b.items, "items", c).map(([n, d, price]) => ({ title: t(n), text: t(d), meta: price })) });
    case "list":
      return K.indexList(L, { ...intro, bg, rows: need(b.items, "items", c).map(([n, d, price]) => ({ title: t(n), text: t(d), meta: price, href: c.href(b.itemCta?.[1] ?? b.ctaPage), cta: `${t(b.itemCta?.[0] ?? b.cta)} →` })) });
    case "gallery":
      return K.galleryLb(L, { ...intro, bg, images: pics(6) });
    case "mosaic":
      return K.mosaic(L, { ...intro, bg, images: pics(6) });
    case "polaroid":
      return K.polaroids(L, { ...intro, bg, items: pics(4) });
    case "team":
      return K.peopleD(L, { ...intro, bg, items: need(b.team, "team", c).map(([n, r], i) => ({ name: n, role: t(r), photo: c.face(i + 3) })) });
    case "about":
      return K.splitPanel(L, { name, bg, eyebrow: title0 ? undefined : t(b.eyebrow), title: title || t(b.ctaTitle), text: text ?? t(b.about), bullets: b.perks.map(t), image: c.img(1), alt: c.alt(1), actions: [mainAct(c)], reverse: c.s.hero === "split" });
    case "fsplit":
      return K.fullSplit(L, { name, eyebrow: t(b.eyebrow), title: title || t(b.ctaTitle), text: text ?? t(b.about), image: c.img(4), alt: c.alt(4), bullets: b.perks.map(t), actions: [mainAct(c, "light")], tone: c.s.look.dark ? "primary" : "inv", reverse: c.s.footer === "slim" });
    case "fimg":
      return K.fullImage(L, { name, image: c.img(5), alt: c.alt(5), caption: title || t(b.text) });
    case "editorial":
      return K.editorial(L, { ...intro, bg, cols: values() });
    case "notes":
      return K.notes(L, { ...intro, bg, items: values(), colors: c.s.look.dark ? ["#fef3c7", "#dcfce7", "#e0f2fe", "#fce7f3"] : [L.p.soft, "#fef9c3", L.alt, "#e0f2fe"] });
    case "swatch":
      return K.swatches(L, { ...intro, bg, items: need(b.swatches, "swatches", c).map(([col, n, d]) => [col, t(n), t(d)]) });
    case "words":
      return K.wordBand(L, words(c, b.words), { name });
    case "marquee":
      return K.marqueeD(L, { title, items: need(b.partners, "partners", c), name, bg });
    case "partners":
      return K.wordBand(L, need(b.partners, "partners", c), { name, bg: L.alt, color: L.p.muted });
    case "cta":
    case "cta-soft":
      return K.ctaD(L, { name, title: title || t(b.ctaTitle), text: text ?? t(b.ctaText), actions: [mainAct(c, id === "cta" ? "light" : undefined)], tone: id === "cta-soft" ? "soft" : c.s.look.dark ? "primary" : "inv" });
    case "band":
      return K.splitBand(L, {
        name,
        left: { title: title || t(b.ctaTitle), text: text ?? t(b.ctaText), actions: [mainAct(c, "light")] },
        right: { title: c.tr("Mampir atau telepon", "Visit or call"), text: `${b.addr} · ${b.phone} · ${t(b.hours)}`, actions: [[c.tr("Kirim email", "Send an email"), `mailto:${b.email}`, "outline"]] },
      });
    case "news":
      return K.newsletter(L, { name, title: title || c.tr(`Kabar dari ${c.s.short ?? c.s.brand}`, `News from ${c.s.short ?? c.s.brand}`), text: text ?? c.tr("Satu email sebulan: jadwal, promo, dan cerita terbaru.", "One email a month: schedules, offers and new stories."), ph: c.tr("email@anda.com", "you@email.com"), submit: c.tr("Langganan", "Subscribe"), inv: c.s.look.dark });
    case "timeline":
      return K.timelineD(L, { ...intro, bg, items: need(b.history, "history", c).map(([y, x, z]) => [y, t(x), t(z)]), side: { image: c.img(2), alt: c.alt(2) } });
    case "events":
      return K.indexList(L, { ...intro, bg, rows: need(b.events, "events", c).map(([d, x, z, st]) => ({ title: t(x), text: t(z), meta: d, ...(st ? { tag: t(st) } : {}), href: c.href(b.ctaPage), cta: c.tr("Daftar", "Register") })) });
    case "board":
      return K.board(L, { ...intro, head: [c.tr("Tanggal", "Date"), c.tr("Acara", "Event"), c.tr("Tempat", "Place"), c.tr("Status", "Status")], rows: need(b.events, "events", c).map(([d, x, z, st]) => [d, t(x), t(z), st ? t(st) : c.tr("Buka", "Open")]) });
    case "posts": {
      const posts = need(b.posts, "posts", c).map(([x, y, d, tag], i) => ({ image: c.img(i + 1), tag: tag ? t(tag) : c.tr("Kabar", "News"), title: t(x), text: t(y), date: d, href: "#" }));
      return K.magazine(L, { ...intro, bg, lead: posts[0], items: posts.slice(1), read: c.tr("Baca", "Read") });
    }
    case "specs":
      return K.specs(L, { ...intro, bg, rows: need(b.specs, "specs", c).map(([k, v]) => [t(k), t(v)]), image: c.img(3), alt: c.alt(3) });
    case "loc":
      return K.locations(L, { ...intro, bg, image: c.img(2), places: need(b.places, "places", c).map(([x, y, z]) => [t(x), t(y), t(z)]) });
    case "contact":
      return K.formD(L, {
        name,
        bg,
        eyebrow: c.tr("Kontak", "Contact"),
        title: title || c.tr("Kirim pesan", "Send a message"),
        text: text ?? t(b.ctaText),
        info: [
          [c.tr("Alamat", "Address"), b.addr],
          [c.tr("Telepon", "Phone"), b.phone],
          ["Email", b.email],
          [c.tr("Jam buka", "Hours"), t(b.hours)],
        ],
        fields: [
          { kind: "input", label: c.tr("Nama", "Name"), ph: c.tr("Nama lengkap", "Full name") },
          { kind: "input", label: "Email", ph: c.tr("email@anda.com", "you@email.com") },
          { kind: "select", label: c.tr("Keperluan", "Topic"), ph: c.tr("Pilih", "Choose"), options: b.svc.map((x) => t(x[1])) },
        ],
        message: c.tr("Pesan", "Message"),
        submit: c.tr("Kirim", "Send"),
        note: c.tr("Kami membalas di hari kerja yang sama.", "We reply the same working day."),
      });
    case "book": {
      const fields: Field[] = [
        { kind: "input", label: c.tr("Nama", "Name"), ph: c.tr("Nama lengkap", "Full name") },
        { kind: "input", label: c.tr("WhatsApp", "WhatsApp"), ph: "08xx xxxx xxxx" },
        { kind: "date", label: c.tr("Tanggal", "Date") },
        { kind: "select", label: c.tr("Pilihan", "Option"), ph: c.tr("Pilih", "Choose"), options: (b.plans?.map((x) => x[0]) ?? b.items?.map((x) => x[0]) ?? b.svc.map((x) => x[1])).map(t) },
      ];
      return K.formD(L, { name, bg, eyebrow: t(b.cta), title: title || t(b.ctaTitle), text: text ?? t(b.ctaText), info: [[c.tr("Telepon", "Phone"), b.phone], [c.tr("Jam layanan", "Service hours"), t(b.hours)]], fields, submit: t(b.cta), formFirst: true });
    }
    case "chart":
      return K.chartPanel(L, { ...intro, bg, eyebrow: t(b.eyebrow), chart: chartOf(c, need(b.chart, "chart", c)), kpis: b.stats.slice(0, 2).map(([n, l]) => [n, t(l)]), bullets: b.perks.map(t), reverse: c.s.header === "pill" });
    case "duo":
      return K.chartDuo(L, { ...intro, bg, charts: [chartOf(c, need(b.chart, "chart", c)), chartOf(c, need(b.chart2, "chart2", c))], notes: b.perks.map(t) });
    case "progress":
      return K.progressD(L, { ...intro, bg, bars: need(b.bars, "bars", c).map(([l, v]) => [t(l), v]), side: { image: c.img(4), alt: c.alt(4) } });
    case "countdown":
      return K.countdownD(L, { name, eyebrow: b.dateLabel ? t(b.dateLabel) : t(b.eyebrow), title: title || t(b.ctaTitle), text: text ?? t(b.ctaText), target: need(b.date, "date", c), finished: c.tr("Sedang berlangsung!", "Happening now!"), actions: [mainAct(c, "light")] });
    case "slider": {
      const tones = [L.p.primaryDark, L.inv, L.p.primary];
      return K.sliderD(L, { ...intro, bg, slides: b.svc.slice(0, 4).map(([, ti, tx], i) => ({ title: t(ti), text: t(tx), bg: tones[i % 3] })), height: 340 });
    }
    case "ba":
      return K.beforeAfterD(L, { ...intro, bg, before: c.img(3), after: c.img(0), labels: [c.tr("Sebelum", "Before"), c.tr("Sesudah", "After")], alt: c.alt(0) });
    case "offer": {
      const [ot, ob] = need(b.offer, "offer", c);
      return K.offer(L, { name, eyebrow: t(b.eyebrow), title: title || t(ot), text: text ?? t(b.ctaText), trigger: c.tr("Lihat penawaran", "See the offer"), modalTitle: t(ot), body: t(ob), cta: t(b.cta), href: c.href(b.ctaPage) });
    }
    case "notice":
      return K.noticeD(L, { name, badge: c.tr("Info", "News"), text: t(need(b.notice, "notice", c)), link: t(b.cta), href: c.href(b.ctaPage) });
  }
}

/** Home hero for its type. */
export function hero(c: Ctx, pages: GPage[]): BoxNode {
  const { L, b, t } = c;
  const second = pages[0];
  const onColor = c.s.hero === "glass" || c.s.hero === "dash" || c.s.hero === "split" || c.s.hero === "full";
  const typer = !c.free && c.s.chrome?.includes("typer") && b.typer ? K.typerD(L, t(b.typer[0]), words(c, b.typer[1]), { size: 52, color: onColor ? "#ffffff" : undefined }) : undefined;
  // On colored backgrounds, the rotating words use a light color so they stay readable.
  if (typer && onColor) typer.state = { ...typer.state, wordColor: L.dark ? L.p.primary : "#fde68a" };
  const hc = {
    eyebrow: t(b.eyebrow),
    title: t(b.title),
    text: t(b.text),
    actions: [mainAct(c), [t(second.name), c.href(second.key), "outline"]] as Act[],
    image: c.img(0),
    alt: c.alt(0),
    ...(typer ? { titleNode: typer as ElementNode } : {}),
  };
  const perks = b.perks.map(t);
  const stats = b.stats.map(([n, l]) => [n, t(l)] as [string, string]);
  switch (c.s.hero) {
    case "full":
      return K.fullHeader(L, { ...hc, actions: [mainAct(c, "light"), [t(second.name), c.href(second.key), "dark"]], chips: perks, overlay: 72, align: c.s.header === "center" ? "center" : "left" });
    case "split":
      return K.heroSplitScreen(L, { ...hc, actions: [mainAct(c, "light")], list: perks, reverse: c.s.footer === "slim" });
    case "bento":
      return K.heroBento(L, { ...hc, tiles: stats.slice(0, 2) });
    case "editorial":
      return K.heroEditorial(L, { ...hc, meta: perks });
    case "brutal":
      return K.heroBrutal(L, { ...hc, eyebrow: undefined, sticker: t(b.eyebrow) });
    case "glass":
      return K.heroGlass(L, { ...hc, actions: [mainAct(c, "light"), [t(second.name), c.href(second.key), "dark"]], gradient: [L.p.primary, L.p.primaryDark], chips: perks });
    case "type":
      return K.heroType(L, { ...hc, image: undefined, words: words(c, b.words) });
    case "neon":
      return K.heroNeon(L, { ...hc, chips: perks });
    case "poster":
      return K.heroPoster(L, { ...hc, date: b.dateLabel ? t(b.dateLabel) : undefined });
    case "soft":
      return K.heroSoft(L, { ...hc, chips: perks });
    case "collage":
      return K.heroCollage(L, { ...hc, images: [0, 1, 2].map((i) => [c.img(i), c.alt(i)] as [string, string]) });
    case "search":
      return K.heroSearch(L, {
        ...hc,
        fields: [
          { kind: "input", label: c.tr("Cari", "Search"), ph: b.searchPh ? t(b.searchPh) : c.tr("Ketik kata kunci", "Type a keyword") },
          { kind: "select", label: c.tr("Kategori", "Category"), ph: c.tr("Semua", "All"), options: b.svc.map((x) => t(x[1])) },
        ],
        submit: t(b.cta),
        tags: words(c, b.words).slice(0, 5),
      });
    case "minimal":
      return K.heroMinimal(L, { ...hc, note: t(b.hours) });
    case "dash":
      return K.heroDash(L, { ...hc, actions: [mainAct(c, "light")], chart: chartOf(c, need(b.chart, "chart", c)), kpis: stats.slice(0, 2), gradient: [L.inv, L.p.primaryDark] });
    case "stacked": {
      const w = words(c, b.words);
      return K.heroStacked(L, { ...hc, lines: [w[0], w[1], w[2]] });
    }
    case "ticket":
      return K.heroTicket(L, { ...hc, stubs: b.stats.slice(0, 3).map(([n, l]) => [t(l), n]) });
  }
}

export const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


/** GSpec → TemplateContent. */
export function buildContent(s: GSpec): TemplateContent {
  const [ink, muted, primary, primaryDark, soft, line] = s.pal;
  const P: Palette = { ink, muted, primary, primaryDark, soft, line };
  const free = s.tier === "free";
  const fx = free ? { aos: s.look.fx?.aos ?? "fade-up" } : (s.look.fx ?? { aos: "fade-up" });
  const L = K.lookD(P, { ...s.look, fx });
  const defs: TemplatePageDef[] = [K.home(), ...s.pages.map((p) => K.pg(p.key, [slug(p.name[0]), p.name[0]], [slug(p.name[1]), p.name[1]]))];
  return {
    brand: s.brand,
    pages: defs,
    build: (key, tr, href) => {
      let alt = 0;
      const t = (x: B) => tr(x[0], x[1]);
      const c: Ctx = {
        s,
        b: s.biz,
        L,
        tr,
        href,
        free,
        t,
        img: (i) => asset(artKey(s.id, i % 6)),
        face: (i) => asset(FACES[(i + s.id.length) % FACES.length]),
        alt: (i) => `${s.brand} — ${t(s.biz.svc[i % s.biz.svc.length][1])}`,
        bg: () => (alt++ % 2 ? L.alt : L.bg),
      };
      const b = s.biz;
      const menu = s.pages.map((p) => t(p.name));
      const nav = !free && s.chrome?.includes("mega") ? K.megaD(L, menu.slice(0, 5), t(b.cta), href(b.ctaPage)) : undefined;
      const head = K.headerD(s.short ?? s.brand, L, {
        variant: s.header,
        // The mega menu already has its own call-to-action button.
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
        ...(!free && s.chrome?.includes("top") ? { extra: [K.backTop(L, tr("Ke atas", "Back to top"))] } : {}),
      });
      const named = (refs: BlockRef[]) => {
        const seen: Record<string, number> = {};
        return refs.map((r) => {
          const id0 = typeof r === "string" ? r : r[0];
          const id = free && FREE_SWAP[id0] ? FREE_SWAP[id0]! : id0;
          seen[id] = (seen[id] ?? 0) + 1;
          return block(c, r, seen[id] > 1 ? `${NAMES[id]} ${seen[id]}` : NAMES[id]);
        });
      };
      const map: Record<string, () => BoxNode[]> = {
        home: () => [hero(c, s.pages), ...named(s.home)],
      };
      for (const p of s.pages)
        map[p.key] = () => {
          alt = 1;
          return [K.pageHead(L, { eyebrow: t(p.name), title: t(p.title), text: p.text ? t(p.text) : undefined, name: `Kepala ${p.name[0]}` }), ...named(p.blocks)];
        };
      return K.render(L, key, head, foot, map);
    },
  };
}

/** Items & libraries used by a block (for documentation/tests). */
export const isPremiumBlock = (r: BlockRef) => PREMIUM_BLOCKS.includes(typeof r === "string" ? r : r[0]);
