import { syncFilterBar } from "../../pageMaker/helpers/categoryFilter";
import { asset } from "../assets";
import { badge, col, el, eyebrow, grid, heading, image, inline, linkButton, page, para, section, siteFooter, siteHeader, stack, type Palette } from "../build";
import type { TemplateContent, Tr } from "../types";
import { inferCollection, materialize, type CollectionDef } from "../../pageMaker/helpers/collections";
import { syncItemPage, type BindField } from "../../pageMaker/helpers/itemPage";
import type { BoxNode, ElementNode } from "../../pageMaker/engine/helpers/componentTypes";

/* Toko Online — GRATIS: kedai kopi, 3 halaman (Beranda+katalog, Detail Produk, Cara Pesan).
   Harga & tombol hanya tampilan: TIDAK ada transaksi sungguhan. */

const P: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#b45309", primaryDark: "#78350f", soft: "#fef3c7", line: "#e7e5e4" };
const BRAND = "Kopi Senja";

export interface DemoProduct {
  img: string;
  name: [string, string];
  price: string;
  compare?: string;
  rating: number;
  reviews: number;
  desc: [string, string];
  badge?: [string, string];
  /** Uji coba CRUD: kategori (cocok dengan chip "Biji kopi / Alat seduh / Camilan"). */
  cat?: [string, string];
}

const COFFEE: DemoProduct[] = [
  { img: "coffee-bag", name: ["Arabika Gayo 250 g", "Gayo Arabica 250 g"], price: "Rp95.000", compare: "Rp110.000", rating: 4.8, reviews: 214, desc: ["Fruity, cokelat, asam seimbang.", "Fruity, chocolate, balanced acidity."], badge: ["Terlaris", "Best seller"], cat: ["Biji kopi", "Coffee beans"] },
  { img: "coffee-beans", name: ["Robusta Temanggung 500 g", "Temanggung Robusta 500 g"], price: "Rp120.000", rating: 4.6, reviews: 98, desc: ["Body tebal, cocok untuk kopi susu.", "Full body, great with milk."], cat: ["Biji kopi", "Coffee beans"] },
  { img: "coffee-mug", name: ["Mug Keramik Senja", "Senja Ceramic Mug"], price: "Rp65.000", rating: 4.7, reviews: 61, desc: ["Keramik buatan tangan, 350 ml.", "Handmade ceramic, 350 ml."], cat: ["Alat seduh", "Brewing gear"] },
  { img: "coffee-dripper", name: ["Set V60 Pemula", "V60 Starter Set"], price: "Rp185.000", compare: "Rp220.000", rating: 4.9, reviews: 132, desc: ["Dripper, server, dan 40 kertas filter.", "Dripper, server, and 40 paper filters."], badge: ["Hemat", "Save"], cat: ["Alat seduh", "Brewing gear"] },
  { img: "coffee-tumbler", name: ["Tumbler Termos 500 ml", "Thermal Tumbler 500 ml"], price: "Rp140.000", rating: 4.5, reviews: 47, desc: ["Menjaga suhu hingga 8 jam.", "Keeps drinks hot for 8 hours."], cat: ["Alat seduh", "Brewing gear"] },
  { img: "coffee-cookie", name: ["Cookies Gula Aren", "Palm Sugar Cookies"], price: "Rp45.000", rating: 4.8, reviews: 76, desc: ["Teman ngopi, isi 12 keping.", "Coffee companion, 12 pieces."], badge: ["Baru", "New"], cat: ["Camilan", "Snacks"] },
];

export const productCard = (tr: Tr, p: DemoProduct, href: string, pal: Palette, cta: string) =>
  el(
    "product-card",
    {
      imageSrc: asset(p.img),
      imageAlt: tr(...p.name),
      name: tr(...p.name),
      description: tr(...p.desc),
      priceText: p.price,
      comparePriceText: p.compare ?? "",
      rating: p.rating,
      ratingCount: `(${p.reviews})`,
      badgeEnabled: !!p.badge,
      badgeText: p.badge ? tr(...p.badge) : "",
      badgeBgColor: pal.primary,
      badgeTextColor: "#ffffff",
      priceColor: pal.primaryDark,
      ctaText: cta,
      ctaHref: href,
      ctaBgColor: pal.primary,
      hoverBorderColor: pal.soft,
      titleColor: pal.ink,
    },
    tr(...p.name),
  );

const footer = (tr: Tr) =>
  siteFooter(
    BRAND,
    tr("Kopi pilihan dari petani Nusantara, disangrai setiap minggu.", "Specialty coffee from Indonesian farmers, roasted weekly."),
    [
      { title: tr("Belanja", "Shop"), items: [tr("Biji kopi", "Coffee beans"), tr("Alat seduh", "Brewing gear"), tr("Camilan", "Snacks")] },
      { title: tr("Bantuan", "Help"), items: [tr("Cara pesan", "How to order"), tr("Pengiriman", "Shipping"), "WhatsApp +62 812 0000 5678"] },
    ],
    tr("© 2026 Kopi Senja. Harga dan produk di template ini adalah contoh.", "© 2026 Kopi Senja. Prices and products in this template are examples."),
    "#1c1917",
  );

function home(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P, linkButton(tr("Cara pesan", "How to order"), href("order"), "primary", P)),
    section(
      "Hero",
      [
        grid(
          [
            col(
              [
                eyebrow(tr("Disangrai minggu ini", "Roasted this week"), P.primary),
                heading(tr("Kopi segar dari kebun ke cangkir Anda", "Fresh coffee from farm to your cup"), "h1", { color: P.ink }),
                para(tr("Biji kopi pilihan, alat seduh, dan camilan — dikirim ke seluruh Indonesia.", "Selected beans, brewing gear, and snacks, shipped across Indonesia."), { size: 18, color: P.muted }),
                inline([linkButton(tr("Belanja sekarang", "Shop now"), "#katalog", "primary", P), linkButton(tr("Cara pesan", "How to order"), href("order"), "outline", P)]),
              ],
              { gap: 20, name: "Teks hero" },
            ),
            col([image(asset("storefront"), tr("Ilustrasi kedai kopi", "Coffee shop illustration"), { ratio: "3 / 2", radius: 24 })], { name: "Gambar hero" }),
          ],
          2,
          { gap: 48, align: "center" },
        ),
      ],
      { bg: "#fffbeb", padY: 88 },
    ),
    section(
      "Kategori",
      [
        inlineRow([
          badge(tr("Semua", "All"), P.primary, "#ffffff"),
          badge(tr("Biji kopi", "Coffee beans"), P.soft, P.primaryDark, "#fde68a"),
          badge(tr("Alat seduh", "Brewing gear"), P.soft, P.primaryDark, "#fde68a"),
          badge(tr("Camilan", "Snacks"), P.soft, P.primaryDark, "#fde68a"),
        ], productCollection(tr, href)),
      ],
      { padY: 28 },
    ),
    katalog(tr, href),
    section(
      "Cara pesan",
      [
        stack([heading(tr("Pesan dalam 3 langkah", "Order in 3 steps"), "h2", { align: "center", color: P.ink })], { align: "stretch" }),
        grid(
          [
            col([heading("1", "h3", { size: 28, color: P.primary }), heading(tr("Pilih produk", "Pick products"), "h3", { size: 18, color: P.ink }), para(tr("Lihat detail dan pilih varian.", "View details and choose a variant."), { size: 15 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 6 }),
            col([heading("2", "h3", { size: 28, color: P.primary }), heading(tr("Kirim pesanan", "Send your order"), "h3", { size: 18, color: P.ink }), para(tr("Hubungi kami lewat WhatsApp atau email.", "Contact us via WhatsApp or email."), { size: 15 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 6 }),
            col([heading("3", "h3", { size: 28, color: P.primary }), heading(tr("Terima di rumah", "Get it delivered"), "h3", { size: 18, color: P.ink }), para(tr("Dikirim 1–3 hari kerja.", "Shipped in 1 to 3 business days."), { size: 15 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 6 }),
          ],
          3,
          { gap: 24, align: "stretch" },
        ),
      ],
      { bg: "#fafaf9" },
    ),
    footer(tr),
  ]);
}

/** Row horizontal langsung di section (untuk deretan badge kategori). */
function inlineRow(children: ReturnType<typeof badge>[], filter?: CollectionDef) {
  const row = inline(children, { gap: 10 });
  // Uji coba CRUD: chip = filter kategori koleksi Produk (klik → kartu katalog disaring).
  const r = stack([filter ? syncFilterBar({ ...row, name: "Filter kategori", filterOf: filter.slug }, filter) : row], { gap: 0 });
  return r;
}

const productGrid = (tr: Tr, items: DemoProduct[], href: (k: string) => string) =>
  grid(
    items.map((p) => col([productCard(tr, p, href("product"), P, tr("Lihat detail", "View details"))], { name: "Produk" })),
    3,
    { gap: 24, align: "stretch" },
  );

/**
 * Uji coba CRUD: koleksi "Produk" dari kartu katalog. Halaman Detail Produk
 * adalah halaman item koleksi ini, jadi tombol kartu menuju produk/<slug>.html.
 */
const productCollection = (tr: Tr, href: (k: string) => string): CollectionDef => withCategories(tr, { ...inferCollection(productGrid(tr, COFFEE, href), tr("Produk", "Products")), itemPage: true });

/** Kategori data awal (urutan item = urutan COFFEE). */
const withCategories = (tr: Tr, col: CollectionDef): CollectionDef => ({
  ...col,
  items: col.items.map((it, i) => (COFFEE[i]?.cat ? { ...it, values: { ...it.values, category: tr(...COFFEE[i].cat!) } } : it)),
});

/** Ikat elemen ke kolom item (halaman detail). */
const bound = <T extends ElementNode>(n: T, field: BindField): T => ({ ...n, bind: field });

function katalog(tr: Tr, href: (k: string) => string) {
  const raw = productGrid(tr, COFFEE, href);
  // Uji coba CRUD: kartu katalog = koleksi data "Produk" (dikelola di dashboard Data).
  raw.name = tr("Daftar produk", "Product list");
  const cards = materialize(raw, withCategories(tr, { ...inferCollection(raw, tr("Produk", "Products")), itemPage: true }));
  const s = section(
    "Katalog",
    [stack([eyebrow(tr("Katalog", "Catalog"), P.primary), heading(tr("Produk pilihan", "Featured products"), "h2", { color: P.ink })], { gap: 6, align: "stretch" }), cards],
    { padY: 56 },
  );
  s.advanced = { cssId: "katalog" };
  return s;
}

function product(tr: Tr, href: (k: string) => string) {
  const p = COFFEE[0];
  const related = productGrid(tr, COFFEE.slice(1, 4), href);
  related.name = tr("Produk terkait", "Related products");
  related.related = { collection: productCollection(tr, href).slug, limit: 3 };
  const doc = page([
    siteHeader(BRAND, P, linkButton(tr("Cara pesan", "How to order"), href("order"), "primary", P)),
    section(
      "Detail produk",
      [
        grid(
          [
            col([bound(image(asset(p.img), tr(...p.name), { ratio: "1 / 1", radius: 24 }), "image")], { name: "Foto produk" }),
            col(
              [
                bound(badge(tr(...p.badge!), P.primary, "#ffffff"), "label"),
                bound(heading(tr(...p.name), "h1", { size: 36, color: P.ink }), "name"),
                bound(para(`★★★★★ ${p.rating} · ${tr(`${p.reviews} ulasan`, `${p.reviews} reviews`)}`, { size: 14, color: "#b45309" }), "rating"),
                inline([bound(heading(p.price, "h2", { size: 30, color: P.primaryDark, full: false }), "price"), bound(para(p.compare ?? "", { size: 16, color: "#a8a29e", full: false }), "compare_price")], { gap: 12 }),
                bound(para(
                  tr(
                    "Kopi Arabika dari dataran tinggi Gayo, Aceh. Diproses full-wash dan disangrai medium sehingga rasa buah dan cokelatnya seimbang. Cocok untuk V60, French press, maupun espresso.",
                    "Arabica from the Gayo highlands, Aceh. Fully washed and medium roasted for a balance of fruit and chocolate notes. Great for V60, French press, or espresso.",
                  ),
                  { size: 16, color: P.muted },
                ), "description"),
                el("select", { labelText: tr("Gilingan", "Grind"), placeholder: tr("Pilih gilingan", "Choose a grind"), options: [tr("Biji utuh", "Whole bean"), tr("Halus (espresso)", "Fine (espresso)"), tr("Sedang (V60)", "Medium (V60)"), tr("Kasar (French press)", "Coarse (French press)")], widthMode: "full" }, "Pilih gilingan"),
                el("input", { labelText: tr("Jumlah", "Quantity"), text: "1", inputType: "number" }, "Input jumlah"),
                linkButton(tr("Pesan via WhatsApp", "Order via WhatsApp"), "https://wa.me/6281200005678", "primary", P, { full: true }),
                para(tr("Contoh toko: tidak ada pembayaran di halaman ini. Tombol membuka WhatsApp — ganti nomornya dengan milik Anda.", "Sample shop: no payment happens on this page. The button opens WhatsApp; replace the number with yours."), { size: 12, color: "#a8a29e" }),
              ],
              { gap: 14, name: "Info produk" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { padY: 64 },
    ),
    section(
      "Informasi",
      [
        stack(
          [
            el("accordion", {
              widthMode: "full",
              openTextColor: P.primary,
              items: [
                { title: tr("Profil rasa", "Tasting notes"), content: tr("Jeruk, cokelat hitam, gula aren. Keasaman sedang.", "Orange, dark chocolate, palm sugar. Medium acidity.") },
                { title: tr("Pengiriman", "Shipping"), content: tr("Dikirim setiap Senin dan Kamis setelah disangrai.", "Shipped every Monday and Thursday after roasting.") },
                { title: tr("Penyimpanan", "Storage"), content: tr("Simpan di wadah kedap udara, jauh dari sinar matahari.", "Keep in an airtight container away from sunlight.") },
              ],
            }),
          ],
          { align: "stretch" },
        ),
      ],
      { padY: 24, width: 820 },
    ),
    section(
      "Produk lain",
      [
        stack([heading(tr("Mungkin Anda suka", "You may also like"), "h2", { size: 26, color: P.ink })], { align: "stretch" }),
        related,
      ],
      { bg: "#fafaf9", padY: 56 },
    ),
    footer(tr),
  ]);
  // Uji coba halaman item: grid foto + info = satu produk dari koleksi "Produk".
  const mark = (n: BoxNode): BoxNode =>
    n.children.some((c) => c.name === "Foto produk")
      ? { ...n, name: tr("Detail item produk", "Product item detail"), itemOf: { collection: productCollection(tr, href).slug } }
      : { ...n, children: n.children.map((c) => (c.kind === "box" ? mark(c) : c)) };
  return { ...doc, root: syncItemPage(mark(doc.root), [productCollection(tr, href)]) };
}

function order(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P),
    section(
      "Cara pesan",
      [
        stack(
          [
            eyebrow(tr("Cara pesan", "How to order"), P.primary, "center"),
            heading(tr("Pesan mudah lewat WhatsApp atau email", "Order easily via WhatsApp or email"), "h1", { align: "center", size: 38, color: P.ink }),
            para(tr("Kirim nama produk, varian, jumlah, dan alamat. Kami membalas dengan total harga dan ongkos kirim.", "Send the product, variant, quantity, and address. We reply with the total and shipping cost."), { align: "center", size: 17, color: P.muted }),
          ],
          { gap: 14, align: "stretch" },
        ),
        grid(
          [
            col([heading("WhatsApp", "h3", { size: 20, color: P.ink }), para("+62 812 0000 5678", { size: 16 }), linkButton(tr("Chat sekarang", "Chat now"), "https://wa.me/6281200005678", "primary", P)], { card: { bg: "#ffffff", border: P.line, padding: 28 }, gap: 10 }),
            col([heading("Email", "h3", { size: 20, color: P.ink }), para("order@kopisenja.example", { size: 16 }), linkButton(tr("Kirim email", "Send email"), "mailto:order@kopisenja.example", "outline", P)], { card: { bg: "#ffffff", border: P.line, padding: 28 }, gap: 10 }),
          ],
          2,
          { gap: 24, align: "stretch" },
        ),
        stack([linkButton(tr("Kembali ke katalog", "Back to catalog"), href("home"), "outline", P)], { align: "center" }),
      ],
      { bg: "#fffbeb", padY: 88, width: 900 },
    ),
    footer(tr),
  ]);
}

export const shopStarter: TemplateContent = {
  brand: BRAND,
  pages: [
    { key: "home", slug: { id: "beranda", en: "home" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "product", slug: { id: "detail-produk", en: "product" }, name: { id: "Detail Produk", en: "Product" } },
    { key: "order", slug: { id: "cara-pesan", en: "how-to-order" }, name: { id: "Cara Pesan", en: "How to Order" } },
  ],
  build: (key, tr, href) => (key === "product" ? product(tr, href) : key === "order" ? order(tr, href) : home(tr, href)),
};
