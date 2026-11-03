import { asset } from "../assets";
import { badge, button, col, el, eyebrow, grid, heading, image, inline, linkButton, page, para, section, siteFooter, siteHeader, stack, type Palette } from "../build";
import type { TemplateContent, Tr } from "../types";
import { productCard, type DemoProduct } from "./shopStarter";

/* Toko Online — PREMIUM: butik fashion, 4 halaman (Beranda, Katalog, Detail Produk, Kontak).
   Harga, keranjang, dan tombol hanya tampilan: TIDAK ada transaksi sungguhan. */

const P: Palette = { ink: "#0f172a", muted: "#475569", primary: "#0f766e", primaryDark: "#134e4a", soft: "#ccfbf1", line: "#e2e8f0" };
const BRAND = "Moda Rupa";

const FASHION: DemoProduct[] = [
  { img: "fashion-shirt", name: ["Kemeja Linen Teal", "Teal Linen Shirt"], price: "Rp289.000", compare: "Rp349.000", rating: 4.8, reviews: 156, desc: ["Linen adem, potongan relaxed.", "Breathable linen, relaxed fit."], badge: ["-17%", "-17%"] },
  { img: "fashion-dress", name: ["Dress Midi Rosa", "Rosa Midi Dress"], price: "Rp459.000", rating: 4.9, reviews: 88, desc: ["Katun rayon, ada saku.", "Cotton rayon, with pockets."], badge: ["Baru", "New"] },
  { img: "fashion-sneaker", name: ["Sneakers Kanvas Abu", "Grey Canvas Sneakers"], price: "Rp399.000", rating: 4.6, reviews: 203, desc: ["Sol karet ringan, ukuran 36–44.", "Light rubber sole, sizes 36 to 44."] },
  { img: "fashion-tote", name: ["Tas Tote Mustard", "Mustard Tote Bag"], price: "Rp179.000", rating: 4.7, reviews: 64, desc: ["Kanvas tebal, muat laptop 14 inci.", "Heavy canvas, fits a 14-inch laptop."] },
  { img: "fashion-watch", name: ["Jam Tangan Minimalis", "Minimalist Watch"], price: "Rp629.000", compare: "Rp699.000", rating: 4.8, reviews: 41, desc: ["Tahan air 3 ATM, tali kulit.", "3 ATM water resistant, leather strap."] },
  { img: "fashion-hat", name: ["Topi Bucket Terakota", "Terracotta Bucket Hat"], price: "Rp129.000", rating: 4.5, reviews: 37, desc: ["Katun twill, satu ukuran.", "Cotton twill, one size."] },
  { img: "fashion-shirt", name: ["Kemeja Linen Hijau Tua", "Forest Linen Shirt"], price: "Rp289.000", rating: 4.7, reviews: 72, desc: ["Warna baru musim ini.", "New colour this season."] },
  { img: "fashion-tote", name: ["Tote Mini Mustard", "Mini Mustard Tote"], price: "Rp139.000", rating: 4.6, reviews: 29, desc: ["Ringkas untuk jalan santai.", "Compact for casual outings."], badge: ["Terbatas", "Limited"] },
];

const footer = (tr: Tr) =>
  siteFooter(
    BRAND,
    tr("Busana harian yang nyaman, dibuat oleh penjahit lokal.", "Comfortable everyday wear, made by local tailors."),
    [
      { title: tr("Belanja", "Shop"), items: [tr("Pakaian", "Clothing"), tr("Aksesori", "Accessories"), tr("Koleksi baru", "New arrivals")] },
      { title: tr("Bantuan", "Help"), items: [tr("Panduan ukuran", "Size guide"), tr("Pengiriman & retur", "Shipping & returns"), tr("Kontak", "Contact")] },
      { title: tr("Ikuti", "Follow"), items: ["Instagram", "TikTok", "Pinterest"] },
    ],
    tr("© 2026 Moda Rupa. Produk dan harga dalam template ini adalah contoh.", "© 2026 Moda Rupa. Products and prices in this template are examples."),
    "#042f2e",
  );

const cards = (tr: Tr, list: DemoProduct[], href: (k: string) => string) =>
  list.map((p) => col([productCard(tr, p, href("product"), P, tr("Lihat produk", "View product"))], { name: "Produk" }));

const category = (title: string, img: string, href: string, cta: string) =>
  col([image(asset(img), title, { ratio: "1 / 1", radius: 18 }), heading(title, "h3", { size: 17 }), linkButton(cta, href, "outline", P)], { gap: 10, name: "Kategori" });

function home(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P, linkButton(tr("Belanja", "Shop"), href("catalog"), "primary", P)),
    section(
      "Banner",
      [
        grid(
          [
            col(
              [
                badge(tr("Koleksi musim kemarau 2026", "Dry season 2026 collection"), P.soft, P.primaryDark, "#99f6e4"),
                heading(tr("Gaya santai, bahan yang bernapas", "Easy style, breathable fabrics"), "h1", { size: 48 }),
                para(tr("Linen, katun, dan aksesori pilihan untuk keseharian di iklim tropis.", "Linen, cotton, and accessories chosen for tropical everyday life."), { size: 18 }),
                inline([linkButton(tr("Lihat koleksi", "Shop the collection"), href("catalog"), "primary", P), linkButton(tr("Panduan ukuran", "Size guide"), href("contact"), "outline", P)]),
              ],
              { gap: 20, name: "Teks banner" },
            ),
            col([image(asset("boutique-banner"), tr("Ilustrasi koleksi", "Collection illustration"), { ratio: "15 / 7", radius: 24 })], { name: "Gambar banner" }),
          ],
          "minmax(0, 1fr) minmax(0, 1.2fr)",
          { gap: 40, align: "center" },
        ),
      ],
      { gradient: ["#f0fdfa", "#ecfeff", 90], padY: 80, width: 1200 },
    ),
    section(
      "Kategori",
      [
        stack([heading(tr("Belanja per kategori", "Shop by category"), "h2", { size: 28 })], { align: "stretch" }),
        grid(
          [
            category(tr("Kemeja", "Shirts"), "fashion-shirt", href("catalog"), tr("Lihat", "Browse")),
            category(tr("Dress", "Dresses"), "fashion-dress", href("catalog"), tr("Lihat", "Browse")),
            category(tr("Sepatu", "Shoes"), "fashion-sneaker", href("catalog"), tr("Lihat", "Browse")),
            category(tr("Aksesori", "Accessories"), "fashion-watch", href("catalog"), tr("Lihat", "Browse")),
          ],
          4,
          { gap: 20, align: "stretch" },
        ),
      ],
      { padY: 64, width: 1200 },
    ),
    section(
      "Produk unggulan",
      [
        stack([eyebrow(tr("Paling dicari", "Trending now"), P.primary), heading(tr("Produk unggulan", "Featured products"), "h2", { size: 28 })], { gap: 6, align: "stretch" }),
        grid(cards(tr, FASHION.slice(0, 4), href), 4, { gap: 20, align: "stretch" }),
        stack([linkButton(tr("Lihat semua produk", "View all products"), href("catalog"), "outline", P)], { align: "center" }),
      ],
      { bg: "#f8fafc", padY: 64, width: 1200 },
    ),
    section(
      "Promo",
      [
        grid(
          [
            col(
              [
                heading(tr("Gratis ongkir untuk pembelian pertama", "Free shipping on your first order"), "h2", { color: "#ffffff", size: 30 }),
                para(tr("Gunakan kode SELAMATDATANG saat checkout. (Contoh promo — atur sesuai toko Anda.)", "Use code WELCOME at checkout. (Sample promo; set your own.)"), { color: "#ccfbf1", size: 16 }),
              ],
              { gap: 10, name: "Teks promo" },
            ),
            col([linkButton(tr("Belanja sekarang", "Shop now"), href("catalog"), "light", P)], { align: "end", name: "Tombol promo" }),
          ],
          "minmax(0, 2fr) minmax(0, 1fr)",
          { gap: 24, align: "center" },
        ),
      ],
      { gradient: ["#134e4a", "#0f766e", 120], padY: 56, width: 1200 },
    ),
    section(
      "Ulasan",
      [
        stack([heading(tr("Kata pelanggan", "What customers say"), "h2", { size: 28, align: "center" })], { align: "stretch" }),
        grid(
          [
            col([para("★★★★★", { color: "#f59e0b" }), para(tr("“Bahannya adem dan jahitannya rapi. Pengiriman cepat.”", "“Cool fabric and neat stitching. Fast delivery.”"), { color: P.ink }), para("Nadia, Surabaya", { size: 13 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 8 }),
            col([para("★★★★★", { color: "#f59e0b" }), para(tr("“Ukurannya pas sesuai panduan. Pasti beli lagi.”", "“True to the size guide. Will buy again.”"), { color: P.ink }), para("Raka, Bandung", { size: 13 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 8 }),
            col([para("★★★★☆", { color: "#f59e0b" }), para(tr("“Tote-nya kuat, muat banyak barang.”", "“The tote is sturdy and holds a lot.”"), { color: P.ink }), para("Maya, Medan", { size: 13 })], { card: { bg: "#ffffff", border: P.line, padding: 24 }, gap: 8 }),
          ],
          3,
          { gap: 20, align: "stretch" },
        ),
      ],
      { padY: 64, width: 1200 },
    ),
    section(
      "Newsletter",
      [
        grid(
          [
            col([heading(tr("Dapatkan kabar koleksi baru", "Get new collection updates"), "h3", { size: 22 }), para(tr("Satu email per bulan, bisa berhenti kapan saja.", "One email a month, unsubscribe anytime."), { size: 15 })], { gap: 6 }),
            col([el("input", { labelText: "Email", text: "nama@email.com", inputType: "email" }, "Input email"), button(tr("Berlangganan", "Subscribe"), P, { full: true })], { gap: 10 }),
          ],
          2,
          { gap: 32, align: "center" },
        ),
      ],
      { bg: "#f0fdfa", padY: 56, width: 1000 },
    ),
    footer(tr),
  ]);
}

function catalog(tr: Tr, href: (k: string) => string) {
  return page([
    siteHeader(BRAND, P, linkButton(tr("Kontak", "Contact"), href("contact"), "primary", P)),
    section(
      "Judul katalog",
      [
        stack(
          [
            heading(tr("Semua produk", "All products"), "h1", { size: 38 }),
            para(tr(`${FASHION.length} produk · harga sudah termasuk PPN (contoh)`, `${FASHION.length} products · prices include VAT (example)`), { size: 15 }),
            inline(
              [
                badge(tr("Semua", "All"), P.primary, "#ffffff"),
                badge(tr("Kemeja", "Shirts"), P.soft, P.primaryDark, "#99f6e4"),
                badge(tr("Dress", "Dresses"), P.soft, P.primaryDark, "#99f6e4"),
                badge(tr("Sepatu", "Shoes"), P.soft, P.primaryDark, "#99f6e4"),
                badge(tr("Aksesori", "Accessories"), P.soft, P.primaryDark, "#99f6e4"),
              ],
              { gap: 8 },
            ),
          ],
          { gap: 12, align: "stretch" },
        ),
      ],
      { bg: "#f0fdfa", padY: 48, width: 1200 },
    ),
    section("Grid produk", [grid(cards(tr, FASHION, href), 4, { gap: 20, align: "stretch" })], { padY: 48, width: 1200 }),
    footer(tr),
  ]);
}

function product(tr: Tr, href: (k: string) => string) {
  const p = FASHION[0];
  return page([
    siteHeader(BRAND, P, linkButton(tr("Belanja", "Shop"), href("catalog"), "primary", P)),
    section(
      "Detail produk",
      [
        grid(
          [
            col(
              [
                image(asset(p.img), tr(...p.name), { ratio: "1 / 1", radius: 20 }),
                col(
                  [
                    col([image(asset("fashion-shirt"), tr("Tampak depan", "Front view"), { ratio: "1 / 1", radius: 12 })], { width: 96, name: "Thumbnail" }),
                    col([image(asset("fashion-tote"), tr("Padu padan", "Styled look"), { ratio: "1 / 1", radius: 12 })], { width: 96, name: "Thumbnail" }),
                    col([image(asset("fashion-hat"), tr("Aksesori", "Accessory"), { ratio: "1 / 1", radius: 12 })], { width: 96, name: "Thumbnail" }),
                  ],
                  { layout: "row", gap: 10, name: "Galeri", stackOnMobile: false },
                ),
              ],
              { gap: 12, name: "Galeri produk" },
            ),
            col(
              [
                para(tr("Kemeja · Linen", "Shirts · Linen"), { size: 13, weight: 600, color: P.primary }),
                heading(tr(...p.name), "h1", { size: 36 }),
                para(`★★★★★ ${p.rating} · ${tr(`${p.reviews} ulasan`, `${p.reviews} reviews`)}`, { size: 14, color: "#b45309" }),
                inline([heading(p.price, "h2", { size: 30, color: P.primaryDark, full: false }), para(p.compare ?? "", { size: 16, color: "#94a3b8", full: false }), badge("-17%", "#fee2e2", "#b91c1c")], { gap: 12 }),
                para(
                  tr(
                    "Kemeja linen 100% dengan potongan relaxed dan kancing batok kelapa. Ringan, cepat kering, dan makin lembut setiap dicuci.",
                    "100% linen shirt with a relaxed cut and coconut-shell buttons. Light, quick-drying, and softer with every wash.",
                  ),
                  { size: 16 },
                ),
                el("select", { labelText: tr("Ukuran", "Size"), placeholder: tr("Pilih ukuran", "Choose a size"), options: ["S", "M", "L", "XL"], widthMode: "full" }, "Pilih ukuran"),
                el("select", { labelText: tr("Warna", "Colour"), placeholder: tr("Pilih warna", "Choose a colour"), options: [tr("Teal", "Teal"), tr("Hijau tua", "Forest green"), tr("Pasir", "Sand")], widthMode: "full" }, "Pilih warna"),
                el("input", { labelText: tr("Jumlah", "Quantity"), text: "1", inputType: "number" }, "Input jumlah"),
                button(tr("Tambah ke keranjang", "Add to cart"), P, { full: true }),
                para(tr("Contoh toko: tombol ini belum terhubung ke keranjang/pembayaran. Hubungkan ke platform e-commerce atau backend Anda.", "Sample shop: this button is not connected to a cart or payment yet. Connect it to your e-commerce platform or backend."), { size: 12, color: "#94a3b8" }),
                el("accordion", {
                  widthMode: "full",
                  openTextColor: P.primary,
                  items: [
                    { title: tr("Detail & perawatan", "Details & care"), content: tr("Cuci dengan air dingin, jangan diperas, setrika suhu sedang.", "Wash cold, do not wring, iron on medium.") },
                    { title: tr("Pengiriman", "Shipping"), content: tr("Dikirim 1–2 hari kerja ke seluruh Indonesia.", "Ships in 1 to 2 business days across Indonesia.") },
                    { title: tr("Pengembalian", "Returns"), content: tr("Tukar ukuran gratis dalam 14 hari.", "Free size exchange within 14 days.") },
                  ],
                }),
              ],
              { gap: 14, name: "Info produk" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { padY: 56, width: 1200 },
    ),
    section(
      "Produk terkait",
      [
        stack([heading(tr("Lengkapi gayamu", "Complete the look"), "h2", { size: 26 })], { align: "stretch" }),
        grid(cards(tr, FASHION.slice(2, 6), href), 4, { gap: 20, align: "stretch" }),
      ],
      { bg: "#f8fafc", padY: 56, width: 1200 },
    ),
    footer(tr),
  ]);
}

function contact(tr: Tr) {
  return page([
    siteHeader(BRAND, P),
    section(
      "Kontak",
      [
        grid(
          [
            col(
              [
                eyebrow(tr("Layanan pelanggan", "Customer care"), P.primary),
                heading(tr("Ada pertanyaan soal ukuran atau pesanan?", "Questions about sizing or orders?"), "h1", { size: 36 }),
                para(tr("Tim kami online Senin–Sabtu, 09.00–18.00 WIB.", "Our team is online Monday to Saturday, 9am to 6pm (GMT+7)."), { size: 17 }),
                el("table", {}, "Tabel ukuran"),
              ],
              { gap: 16, name: "Info" },
            ),
            col(
              [
                el("input", { labelText: tr("Nama", "Name"), text: tr("Nama Anda", "Your name") }, "Input nama"),
                el("input", { labelText: "Email", text: "nama@email.com", inputType: "email" }, "Input email"),
                el("input", { labelText: tr("Nomor pesanan (opsional)", "Order number (optional)"), text: "MR-000123" }, "Input pesanan"),
                el("input", { labelText: tr("Pesan", "Message"), text: tr("Tulis pertanyaan Anda", "Write your question") }, "Input pesan"),
                button(tr("Kirim", "Send"), P, { full: true, type: "submit" }),
                para(tr("Formulir contoh: hubungkan ke layanan formulir atau backend Anda.", "Sample form: connect it to your form service or backend."), { size: 12, color: "#94a3b8" }),
              ],
              { card: { bg: "#ffffff", border: P.line, radius: 20, padding: 28 }, gap: 14, name: "Formulir" },
            ),
          ],
          2,
          { gap: 48, align: "start" },
        ),
      ],
      { bg: "#f0fdfa", padY: 80, width: 1200 },
    ),
    footer(tr),
  ]);
}

export const shopBoutique: TemplateContent = {
  brand: BRAND,
  pages: [
    { key: "home", slug: { id: "beranda", en: "home" }, name: { id: "Beranda", en: "Home" }, home: true },
    { key: "catalog", slug: { id: "katalog", en: "catalog" }, name: { id: "Katalog", en: "Catalog" } },
    { key: "product", slug: { id: "detail-produk", en: "product" }, name: { id: "Detail Produk", en: "Product" } },
    { key: "contact", slug: { id: "kontak", en: "contact" }, name: { id: "Kontak", en: "Contact" } },
  ],
  build: (key, tr, href) => (key === "catalog" ? catalog(tr, href) : key === "product" ? product(tr, href) : key === "contact" ? contact(tr) : home(tr, href)),
};
