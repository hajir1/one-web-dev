import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { portfolioMosaic, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  bento,
  cardsD,
  catalog,
  chartDuo,
  chartPanel,
  compareD,
  counterD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroBento,
  heroCollage,
  heroDash,
  heroEditorial,
  heroSoft,
  home,
  indexList,
  kpiStrip,
  lookD,
  magazine,
  marqueeD,
  newsletter,
  offer,
  pageHead,
  pg,
  plansD,
  polaroids,
  priceSwitchD,
  pro,
  progressD,
  pullQuote,
  rail,
  render,
  sliderD,
  specs,
  swatches,
  tableD,
  tabsD,
  timelineD,
  typerD,
  withFx,
} from "./kitE";

/* ================================================================== */
/* Template v4 E11–E15: Anyaman, Keramik, SaaS analitik (grafik),        */
/* Investasi (grafik), Hidroponik (grafik).                              */
/* ================================================================== */

/* ------------- 11. Anyam Lestari — kerajinan anyaman (5 hlm) -------- */
// Premium: pro-portfolio-mosaic, logo-marquee. Library: AOS + Tilt.

const AP: Palette = { ink: "#2d1d05", muted: "#6b5631", primary: "#a16207", primaryDark: "#713f12", soft: "#fef3c7", line: "#fde68a" };
const A = lookD(AP, { head: "Fraunces", body: "Josefin Sans", shape: "retro", radius: 14, bg: "#fffcf2", alt: "#fdf4dc", inv: "#2d1d05", fx: { aos: "fade-up", tilt: true } });

const aFoot = (tr: Tr) =>
  footerD("Anyam Lestari", A, {
    variant: "columns",
    about: tr("Keranjang, tas, dan tikar anyaman rotan & pandan dari 140 perajin perempuan di Lombok dan Kalimantan.", "Rattan & pandan baskets, bags and mats from 140 women weavers in Lombok and Kalimantan."),
    cols: [{ title: tr("Belanja", "Shop"), items: [tr("Keranjang", "Baskets"), tr("Tas", "Bags"), tr("Tikar", "Mats")] }, { title: tr("Kontak", "Contact"), items: ["halo@anyamlestari.id", "0819 0700 3344"] }],
    social: ["Instagram | https://instagram.com/anyamlestari", "Pinterest | https://pinterest.com/anyamlestari"],
    copy: tr("© 2026 Anyam Lestari. Konten contoh.", "© 2026 Anyam Lestari. Sample content."),
  });

export const craftAnyaman: TemplateContent = {
  brand: "Anyam Lestari",
  pages: [home(), pg("products", ["produk", "Produk"], ["products", "Products"]), pg("artisans", ["perajin", "Perajin"], ["weavers", "Weavers"]), pg("process", ["proses", "Proses"], ["process", "Process"]), pg("wholesale", ["grosir", "Grosir"], ["wholesale", "Wholesale"])],
  build: (key, tr, href) =>
    render(A, key, headerD("Anyam Lestari", A, { variant: "center", cta: [tr("Belanja", "Shop"), href("products")] }), aFoot(tr), {
      home: () => [
        heroCollage(A, {
          eyebrow: tr("Kerajinan anyaman", "Handwoven craft"),
          title: tr("Setiap helai dianyam dengan tangan", "Every strand woven by hand"),
          text: tr("Satu keranjang besar butuh tiga hari kerja. Kami membayar perajin di muka dan mencantumkan nama mereka di setiap label.", "One large basket takes three days. We pay weavers upfront and print their name on every tag."),
          images: [[asset("v4e-weave"), tr("Keranjang rotan", "Rattan basket")], [asset("v4e-weave-dark"), tr("Anyaman gelap", "Dark weave")], [asset("v4e-weave"), tr("Detail anyaman", "Weave detail")]],
          actions: [[tr("Lihat produk", "See products"), href("products")], [tr("Kenali perajin", "Meet the weavers"), href("artisans"), "outline"]],
        }),
        swatches(A, { title: tr("Bahan alami kami", "Our natural fibres"), items: [["#d6b47a", tr("Rotan", "Rattan"), tr("Kuat, untuk keranjang.", "Strong, for baskets.")], ["#a3b18a", tr("Pandan", "Pandan"), tr("Lentur, untuk tikar.", "Supple, for mats.")], ["#8b5a2b", tr("Bambu", "Bamboo"), tr("Rangka & tutup.", "Frames & lids.")], ["#e8d9b5", tr("Mendong", "Mendong grass"), tr("Halus, untuk tas.", "Fine, for bags.")]] }),
        withFx(A, portfolioMosaic(pro(A), tr, { eyebrow: tr("Koleksi", "Collection"), title: tr("Favorit musim ini", "This season's favourites"), works: [{ title: tr("Keranjang Pasar", "Market basket"), tag: tr("Rotan", "Rattan"), image: asset("v4e-weave") }, { title: tr("Tas Bulan", "Moon bag"), tag: tr("Mendong", "Mendong"), image: asset("v4e-weave-dark") }, { title: tr("Tikar Piknik", "Picnic mat"), tag: tr("Pandan", "Pandan"), image: asset("v4e-weave") }, { title: tr("Tudung Saji", "Food cover"), tag: tr("Bambu", "Bamboo"), image: asset("v4e-weave-dark") }, { title: tr("Wadah Roti", "Bread basket"), tag: tr("Rotan", "Rattan"), image: asset("v4e-weave") }], cta: { label: tr("Belanja", "Shop"), href: href("products") } })),
      ],
      products: () => [
        pageHead(A, { eyebrow: tr("Produk", "Products"), title: tr("Siap kirim", "Ready to ship") }),
        catalog(A, { title: tr("Keranjang & tas", "Baskets & bags"), cols: 3, items: [{ image: asset("v4e-weave"), title: tr("Keranjang Pasar", "Market basket"), text: tr("Ø 40 cm, gagang rotan.", "Ø 40 cm, rattan handle."), price: "Rp285.000", cta: tr("Beli", "Buy"), href: href("wholesale"), rating: 5, reviews: "86" }, { image: asset("v4e-weave-dark"), title: tr("Tas Bulan", "Moon bag"), text: tr("Tali kulit sapi.", "Cowhide strap."), price: "Rp340.000", cta: tr("Beli", "Buy"), href: href("wholesale") }, { image: asset("v4e-weave"), title: tr("Tikar Piknik", "Picnic mat"), text: "120 × 180 cm.", price: "Rp420.000", compare: "Rp480.000", badge: tr("Promo", "Sale"), cta: tr("Beli", "Buy"), href: href("wholesale") }] }),
        faqD(A, { title: tr("Merawat anyaman", "Caring for weaves"), items: [[tr("Boleh kena air?", "Can it get wet?"), tr("Lap lembap, lalu jemur di tempat teduh.", "Wipe damp, then dry in the shade.")], [tr("Berjamur?", "Mould?"), tr("Sikat lembut dengan cuka encer.", "Brush gently with diluted vinegar.")]] }),
      ],
      artisans: () => [
        pageHead(A, { eyebrow: tr("Perajin", "Weavers"), title: tr("140 perajin, 6 desa", "140 weavers, 6 villages") }),
        polaroids(A, { title: tr("Wajah di balik anyaman", "Faces behind the weave"), items: [[asset("v4e-face-2"), "Inaq Saenah, Lombok"], [asset("v4e-face-4"), "Mama Rosa, Kalbar"], [asset("v4e-face-3"), "Amaq Rudi, Lombok"], [asset("v4e-face-1"), "Pak Daud, Kalbar"]] }),
        marqueeD(A, { title: tr("Kelompok perajin", "Weaver groups"), items: ["Sukarara", "Beleq", "Sanggau", "Loyok", "Sekadau", "Pringgasela"] }),
      ],
      process: () => [
        pageHead(A, { eyebrow: tr("Proses", "Process"), title: tr("Dari hutan ke rumah Anda", "From forest to your home") }),
        rail(A, { title: tr("Empat tahap", "Four stages"), steps: [[tr("Panen", "Harvest"), tr("Rotan dipotong selektif.", "Rattan cut selectively.")], [tr("Jemur", "Dry"), tr("7 hari di bawah matahari.", "7 days in the sun.")], [tr("Anyam", "Weave"), tr("1–3 hari per produk.", "1–3 days per piece.")], [tr("Periksa", "Check"), tr("Kontrol mutu di gudang.", "Quality check at the warehouse.")]] }),
        pullQuote(A, { text: tr("Dulu kami jual ke tengkulak. Sekarang harga ditentukan bersama.", "We used to sell to middlemen. Now prices are agreed together."), name: "Inaq Saenah", role: tr("Ketua kelompok Sukarara", "Sukarara group leader") }),
      ],
      wholesale: () => [
        pageHead(A, { eyebrow: tr("Grosir", "Wholesale"), title: tr("Untuk toko, hotel, dan kafe", "For shops, hotels and cafés") }),
        tableD(A, { title: tr("Harga grosir", "Wholesale pricing"), columns: [tr("Jumlah", "Quantity"), tr("Diskon", "Discount"), tr("Waktu produksi", "Lead time")], rows: [["20–49", "15%", tr("3 minggu", "3 weeks")], ["50–199", "25%", tr("5 minggu", "5 weeks")], ["200+", "35%", tr("8 minggu", "8 weeks")]] }),
        formD(A, { title: tr("Minta katalog grosir", "Request the wholesale catalogue"), info: [["Email", "grosir@anyamlestari.id"]], fields: [{ kind: "input", label: tr("Nama usaha", "Business name"), ph: tr("Nama toko", "Shop name") }, { kind: "input", label: "Email", ph: "nama@usaha.id", type: "email" }], submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ------------- 12. Tanah Liat Studio — keramik (4 hlm) --------------- */
// Premium: gallery-lightbox, modal-popup. Library: Animate + Tilt.

const CP: Palette = { ink: "#2a1206", muted: "#704b38", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fed7aa" };
const C = lookD(CP, { head: "Playfair Display", body: "Rubik", shape: "editorial", radius: 0, bg: "#fffaf5", alt: "#fbeee2", inv: "#2a1206", fx: { animate: "fadeInUp", tilt: true } });

const cFoot = (tr: Tr) =>
  footerD("Tanah Liat", C, {
    variant: "giant",
    about: tr("Studio keramik kecil: kelas putar, perabot makan buatan tangan, dan pesanan untuk restoran.", "A small ceramics studio: wheel classes, handmade tableware and restaurant commissions."),
    cols: [{ title: tr("Studio", "Studio"), items: ["Jl. Tirtodipuran 9, Yogyakarta", tr("Rabu–Minggu 10.00–19.00", "Wed–Sun 10am–7pm")] }],
    social: ["Instagram | https://instagram.com/tanahliat.studio"],
    copy: tr("© 2026 Tanah Liat Studio. Konten contoh.", "© 2026 Tanah Liat Studio. Sample content."),
  });

export const craftKeramik: TemplateContent = {
  brand: "Tanah Liat Studio",
  pages: [home(), pg("classes", ["kelas", "Kelas"], ["classes", "Classes"]), pg("shop", ["toko", "Toko"], ["shop", "Shop"]), pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  build: (key, tr, href) =>
    render(C, key, headerD("Tanah Liat", C, { variant: "split", info: [tr("Kelas putar setiap akhir pekan", "Wheel classes every weekend"), "Yogyakarta"], cta: [tr("Ikut kelas", "Join a class"), href("classes")] }), cFoot(tr), {
      home: () => [
        heroEditorial(C, {
          meta: [tr("Studio keramik", "Ceramics studio"), "Yogyakarta", tr("Est. 2020", "Est. 2020")],
          title: tr("Tangan kotor, kepala tenang", "Muddy hands, quiet mind"),
          text: tr("Dua jam di roda putar, tanpa ponsel. Bawa pulang mangkuk buatan sendiri setelah dibakar dua minggu kemudian.", "Two hours at the wheel, no phones. Take home your own bowl after it's fired two weeks later."),
          image: asset("v4e-pottery"),
          alt: tr("Vas keramik di roda putar", "Ceramic vase on a wheel"),
          actions: [[tr("Lihat kelas", "See classes"), href("classes")]],
        }),
        offer(C, { eyebrow: tr("Kelas berdua", "Class for two"), title: tr("Kencan di roda putar", "A date at the wheel"), text: tr("Dua kursi + teh + glasir pilihan.", "Two seats + tea + glaze of your choice."), trigger: tr("Lihat detail paket", "See package details"), modalTitle: tr("Paket berdua", "Couples package"), body: tr("Rp640.000 untuk dua orang, 2,5 jam, termasuk 4 karya dibakar dan diglasir. Jadwal Jumat malam & Sabtu sore.", "Rp640,000 for two, 2.5 hours, including 4 pieces fired and glazed. Friday evenings & Saturday afternoons."), cta: tr("Pesan", "Book"), href: href("visit") }),
        galleryLb(C, { title: tr("Dari meja studio", "From the studio table"), images: [[asset("v4e-pottery"), tr("Vas terakota", "Terracotta vase")], [asset("v4e-pottery-blue"), tr("Glasir kobalt", "Cobalt glaze")], [asset("v4e-pottery"), tr("Mangkuk ramen", "Ramen bowl")]], cols: 3, ratio: "1 / 1" }),
      ],
      classes: () => [
        pageHead(C, { eyebrow: tr("Kelas", "Classes"), title: tr("Untuk pemula sampai yang ketagihan", "For beginners and the hooked") }),
        indexList(C, { title: tr("Pilihan kelas", "Class options"), rows: [{ title: tr("Coba roda putar", "Wheel taster"), meta: tr("2 jam · Rp350rb", "2 hrs · Rp350k"), tag: tr("Pemula", "Beginner"), text: tr("Buat 2 karya, kami bakar & glasir.", "Make 2 pieces; we fire & glaze."), href: href("visit"), cta: tr("Pesan", "Book") }, { title: tr("Pinch & coil", "Pinch & coil"), meta: tr("3 jam · Rp400rb", "3 hrs · Rp400k"), tag: tr("Tanpa roda", "No wheel"), href: href("visit"), cta: tr("Pesan", "Book") }, { title: tr("Kursus 6 minggu", "6-week course"), meta: tr("Rp2,1jt", "Rp2.1M"), tag: tr("Serius", "Committed"), text: tr("Sampai bisa membuat set piring.", "Until you can make a plate set."), href: href("visit"), cta: tr("Pesan", "Book") }] }),
        timelineD(C, { title: tr("Perjalanan sebuah mangkuk", "The life of a bowl"), items: [[tr("Hari 1", "Day 1"), tr("Putar", "Throw"), tr("Bentuk di roda.", "Shaped on the wheel.")], [tr("Hari 3", "Day 3"), tr("Rapikan", "Trim"), tr("Kaki mangkuk dibentuk.", "The foot is trimmed.")], [tr("Hari 7", "Day 7"), tr("Bakar biskuit", "Bisque"), "900 °C"], [tr("Hari 14", "Day 14"), tr("Glasir & bakar", "Glaze & fire"), "1.240 °C"]] }),
      ],
      shop: () => [
        pageHead(C, { eyebrow: tr("Toko", "Shop"), title: tr("Perabot makan buatan tangan", "Handmade tableware") }),
        catalog(C, { title: tr("Tersedia sekarang", "Available now"), cols: 3, items: [{ image: asset("v4e-pottery"), title: tr("Mangkuk Senja", "Dusk bowl"), text: "Ø 15 cm", price: "Rp165.000", cta: tr("Pesan", "Order"), href: href("visit") }, { image: asset("v4e-pottery-blue"), title: tr("Piring Kobalt", "Cobalt plate"), text: "Ø 26 cm", price: "Rp210.000", cta: tr("Pesan", "Order"), href: href("visit") }, { image: asset("v4e-pottery"), title: tr("Vas Leher Panjang", "Long-neck vase"), text: tr("Tinggi 28 cm", "28 cm tall"), price: "Rp390.000", badge: tr("Satu-satunya", "One of a kind"), cta: tr("Pesan", "Order"), href: href("visit") }] }),
        polaroids(C, { title: tr("Dipakai pelanggan", "In customers' homes"), items: [[asset("v4e-pottery-blue"), tr("Sarapan Minggu", "Sunday breakfast")], [asset("v4e-pottery"), tr("Vas di jendela", "Vase by the window")], [asset("v4e-pottery-blue"), tr("Set ramen", "Ramen set")]] }),
      ],
      visit: () => [
        pageHead(C, { eyebrow: tr("Kunjungi", "Visit"), title: tr("Mampir ke studio", "Drop by the studio") }),
        formD(C, { title: tr("Pesan kelas", "Book a class"), info: [[tr("Alamat", "Address"), "Jl. Tirtodipuran 9, Yogyakarta"], ["WhatsApp", "0857 2900 1414"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Kelas", "Class"), ph: tr("Pilih", "Choose"), options: [tr("Coba roda putar", "Wheel taster"), "Pinch & coil", tr("Kursus 6 minggu", "6-week course"), tr("Paket berdua", "Couples package")] }, { kind: "date", label: tr("Tanggal", "Date") }], submit: tr("Pesan", "Book") }),
      ],
    }),
};

/* --------- 13. Grafika Data — SaaS analitik (9 hlm, grafik) ---------- */
// Premium: typewriter, pricing-switch, comparison-table, pro-testimonials-wall, logo-marquee, stats-counter, back-to-top.
// Library: AOS + Animate. Grafik: bar + line.

const GP: Palette = { ink: "#eef2ff", muted: "#a5b4fc", primary: "#6366f1", primaryDark: "#4338ca", soft: "#1e1b4b", line: "#3730a3" };
const G = lookD(GP, { head: "Space Grotesk", body: "Inter", shape: "neon", radius: 16, bg: "#070a1a", alt: "#0e1230", inv: "#1e1b4b", surface: "#11163a", fx: { aos: "fade-up", animate: "fadeInDown" }, dark: true });

const gFoot = (tr: Tr) =>
  footerD("Grafika", G, {
    variant: "columns",
    about: tr("Dasbor analitik penjualan untuk UMKM dan tim e-commerce, terhubung ke kasir, toko daring, dan spreadsheet.", "Sales analytics dashboards for small businesses and e-commerce teams, connected to your POS, online store and spreadsheets."),
    cols: [
      { title: tr("Produk", "Product"), items: [tr("Fitur", "Features"), tr("Integrasi", "Integrations"), tr("Harga", "Pricing")] },
      { title: tr("Sumber", "Resources"), items: [tr("Panduan", "Guides"), tr("Status sistem", "System status"), tr("Keamanan", "Security")] },
    ],
    social: ["LinkedIn | https://linkedin.com/company/grafikadata", "YouTube | https://youtube.com/@grafikadata", "X | https://x.com/grafikadata"],
    copy: tr("© 2026 Grafika Data. Konten & angka contoh.", "© 2026 Grafika Data. Sample content & figures."),
    extra: [backTop(G, tr("Ke atas", "Top"))],
  });

const salesChart = (tr: Tr) => ({ type: "bar" as const, title: tr("Omzet per bulan (juta Rp)", "Monthly revenue (Rp million)"), series: tr("2025, 2026", "2025, 2026"), rows: [tr("Jan", "Jan") + ", 120, 168", "Feb, 132, 181", "Mar, 141, 204", tr("Apr", "Apr") + ", 150, 226", tr("Mei", "May") + ", 162, 241", "Jun, 171, 265"], c2: "#22d3ee" });

export const saasAnalitikData: TemplateContent = {
  brand: "Grafika Data",
  pages: [
    home(),
    pg("features", ["fitur", "Fitur"], ["features", "Features"]),
    pg("dashboards", ["contoh-dasbor", "Contoh Dasbor"], ["sample-dashboards", "Sample Dashboards"]),
    pg("integrations", ["integrasi", "Integrasi"], ["integrations", "Integrations"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("customers", ["pelanggan", "Pelanggan"], ["customers", "Customers"]),
    pg("security", ["keamanan", "Keamanan"], ["security", "Security"]),
    pg("guides", ["panduan", "Panduan"], ["guides", "Guides"]),
    pg("demo", ["demo", "Minta Demo"], ["demo", "Request Demo"]),
  ],
  build: (key, tr, href) =>
    render(G, key, headerD("Grafika", G, { variant: "bar", sticky: true, cta: [tr("Coba 14 hari", "Try 14 days"), href("demo")] }), gFoot(tr), {
      home: () => [
        heroDash(G, {
          eyebrow: tr("Analitik penjualan", "Sales analytics"),
          title: tr("Semua angka toko Anda, satu layar", "All your store numbers on one screen"),
          titleNode: typerD(G, tr("Lihat ", "See "), [tr("omzet harian", "daily revenue"), tr("produk terlaris", "best sellers"), tr("stok menipis", "low stock")], { size: 50, color: "#ffffff" }),
          text: tr("Grafika menarik data dari kasir, marketplace, dan spreadsheet setiap 15 menit — lalu memberi tahu apa yang berubah.", "Grafika pulls data from your POS, marketplaces and spreadsheets every 15 minutes — then tells you what changed."),
          gradient: ["#1e1b4b", "#070a1a"],
          chart: salesChart(tr),
          kpis: [[tr("+54%", "+54%"), tr("omzet YoY", "revenue YoY")], ["15 mnt", tr("sinkron", "sync")]],
          actions: [[tr("Coba gratis", "Start free"), href("demo")], [tr("Lihat contoh dasbor", "See sample dashboards"), href("dashboards"), "outline"]],
        }),
        marqueeD(G, { title: tr("Dipakai 2.400 toko", "Used by 2,400 stores"), items: ["Kopi Senandung", "Batik Lawang", "Roti Nyonya", "Sepatu Langkah", "Toko Kelontong 88", "Mebel Rimba"] }),
        kpiStrip(G, { items: [["2.400", tr("Toko aktif", "Active stores"), tr("+38% tahun ini", "+38% this year")], ["31 jt", tr("Transaksi/bulan", "Transactions/month"), "+12%"], ["15 mnt", tr("Interval sinkron", "Sync interval"), tr("real-time Pro", "real-time on Pro")], ["99,9%", "Uptime", tr("12 bulan", "12 months")]] }),
        withFx(G, testimonialsWall(pro(G), tr, { title: tr("Keputusan lebih cepat", "Faster decisions"), score: 4.8, caption: tr("dari 610 ulasan", "from 610 reviews"), dark: true, quotes: [{ text: tr("Kami berhenti rekap Excel tiap Senin pagi.", "We stopped doing Monday-morning Excel recaps."), name: "Sari Wulandari", role: tr("Pemilik, Batik Lawang", "Owner, Batik Lawang"), avatar: asset("v4e-face-2") }, { text: tr("Peringatan stok menipis menyelamatkan promo 11.11.", "Low-stock alerts saved our 11.11 sale."), name: "Ferry Gunawan", role: "Ops, Sepatu Langkah", avatar: asset("v4e-face-1") }, { text: tr("Grafik cabang bikin rapat jadi 15 menit.", "Branch charts cut meetings to 15 minutes."), name: "Lina Hartati", role: tr("Manajer, Roti Nyonya", "Manager, Roti Nyonya"), avatar: asset("v4e-face-4") }] })),
      ],
      features: () => [
        pageHead(G, { eyebrow: tr("Fitur", "Features"), title: tr("Dibuat untuk pemilik toko, bukan analis data", "Built for store owners, not data analysts") }),
        bento(G, { title: tr("Yang Anda dapat", "What you get"), items: [{ title: tr("Dasbor siap pakai", "Ready-made dashboards"), text: tr("12 templat: omzet, margin, cabang, kasir.", "12 templates: revenue, margin, branches, cashiers."), image: asset("v4e-dash-dark"), wide: true }, { title: tr("Peringatan", "Alerts"), text: tr("WhatsApp saat stok < batas.", "WhatsApp when stock dips below a limit."), icon: "⚑", accent: true }, { title: tr("Laporan otomatis", "Auto reports"), text: tr("PDF setiap Senin 07.00.", "PDF every Monday 7am."), icon: "▤" }, { title: tr("Perkiraan", "Forecasts"), text: tr("Prediksi penjualan 4 minggu.", "4-week sales forecast."), icon: "↗" }] }),
        chartPanel(G, { eyebrow: tr("Perkiraan", "Forecast"), title: tr("Tahu kapan harus menambah stok", "Know when to restock"), text: tr("Model musiman membaca pola Lebaran, gajian, dan tanggal kembar.", "Seasonal models read patterns around Lebaran, paydays and double-date sales."), chart: { type: "line", title: tr("Penjualan aktual vs perkiraan (unit)", "Actual vs forecast sales (units)"), series: tr("Aktual, Perkiraan", "Actual, Forecast"), rows: [tr("Mg 1", "Wk 1") + ", 820, 800", tr("Mg 2", "Wk 2") + ", 910, 880", tr("Mg 3", "Wk 3") + ", 1340, 1290", tr("Mg 4", "Wk 4") + ", 990, 1020", tr("Mg 5", "Wk 5") + ", 870, 900", tr("Mg 6", "Wk 6") + ", 1120, 1100"], c2: "#22d3ee" }, kpis: [["94%", tr("akurasi", "accuracy")], ["4 mg", tr("ke depan", "ahead")]] }),
      ],
      dashboards: () => [
        pageHead(G, { eyebrow: tr("Contoh dasbor", "Sample dashboards"), title: tr("Seperti inilah layar Anda nanti", "This is what your screen will look like") }),
        chartDuo(G, { title: tr("Dasbor ritel", "Retail dashboard"), charts: [salesChart(tr), { type: "line", title: tr("Pengunjung toko daring per hari", "Online store visitors per day"), series: tr("Pengunjung, Pembeli", "Visitors, Buyers"), rows: [tr("Sen", "Mon") + ", 1820, 142", tr("Sel", "Tue") + ", 1640, 131", tr("Rab", "Wed") + ", 1710, 150", tr("Kam", "Thu") + ", 1980, 171", tr("Jum", "Fri") + ", 2410, 220", tr("Sab", "Sat") + ", 2950, 284", tr("Min", "Sun") + ", 2700, 251"], c2: "#f472b6" }], notes: [tr("Angka contoh dari toko fiktif.", "Sample figures from a fictional store."), tr("Konversi rata-rata 8,6%.", "Average conversion 8.6%.")] }),
        tabsD(G, { title: tr("Dasbor lain", "More dashboards"), tabs: [[tr("Cabang", "Branches"), tr("Bandingkan omzet dan margin antar cabang dalam satu tabel.", "Compare revenue and margin across branches in one table.")], [tr("Kasir", "Cashiers"), tr("Transaksi per kasir, void, dan diskon manual.", "Transactions per cashier, voids and manual discounts.")], [tr("Produk", "Products"), tr("ABC analysis: 20% produk yang menghasilkan 80% omzet.", "ABC analysis: the 20% of products driving 80% of revenue.")]] }),
      ],
      integrations: () => [
        pageHead(G, { eyebrow: tr("Integrasi", "Integrations"), title: tr("Sambungkan dalam 5 menit", "Connect in 5 minutes") }),
        cardsD(G, { title: tr("Sumber data", "Data sources"), cols: 4, items: [{ icon: "⌁", title: tr("Kasir (POS)", "POS"), text: tr("8 aplikasi kasir lokal.", "8 local POS apps.") }, { icon: "◫", title: "Marketplace", text: tr("Pesanan & ulasan.", "Orders & reviews.") }, { icon: "▦", title: tr("Spreadsheet", "Spreadsheets"), text: tr("Sinkron dua arah.", "Two-way sync.") }, { icon: "⇄", title: "API", text: tr("REST & webhook.", "REST & webhooks.") }] }),
        rail(G, { title: tr("Cara menyambungkan", "How to connect"), steps: [[tr("Pilih sumber", "Pick a source"), tr("Dari daftar integrasi.", "From the integrations list.")], [tr("Izinkan akses", "Grant access"), tr("Hanya baca.", "Read-only.")], [tr("Selesai", "Done"), tr("Data muncul dalam 15 menit.", "Data appears in 15 minutes.")]] }),
      ],
      pricing: () => [
        pageHead(G, { eyebrow: tr("Harga", "Pricing"), title: tr("Mulai gratis, naik saat toko tumbuh", "Start free, upgrade as you grow") }),
        priceSwitchD(G, { title: tr("Paket Grafika", "Grafika plans"), plans: [tr("Mulai | Rp0 | Rp0 | 1 toko; 3 dasbor; Sinkron 1 jam | Daftar", "Starter | Rp0 | Rp0 | 1 store; 3 dashboards; 1-hour sync | Sign up"), tr("Tumbuh | Rp249rb | Rp2,49jt | 3 toko; Semua dasbor; Peringatan WhatsApp | Coba 14 hari", "Growth | Rp249k | Rp2.49M | 3 stores; All dashboards; WhatsApp alerts | Try 14 days"), tr("Pro | Rp690rb | Rp6,9jt | Toko tak terbatas; Real-time; API | Hubungi kami", "Pro | Rp690k | Rp6.9M | Unlimited stores; Real-time; API | Contact us")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 17%", "Save 17%"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("demo") }),
        compareD(G, { title: tr("Bandingkan paket", "Compare plans"), columns: [tr("Mulai", "Starter"), tr("Tumbuh", "Growth"), "Pro"], rows: [tr("Toko | 1 | 3 | tak terbatas", "Stores | 1 | 3 | unlimited"), tr("Perkiraan | tidak | ya | ya", "Forecasts | no | yes | yes"), tr("Real-time | tidak | tidak | ya", "Real-time | no | no | yes"), tr("API | tidak | tidak | ya", "API | no | no | yes")], highlight: 2, caption: tr("Harga contoh, belum PPN.", "Sample prices, excl. VAT.") }),
      ],
      customers: () => [
        pageHead(G, { eyebrow: tr("Pelanggan", "Customers"), title: tr("Cerita dari toko yang tumbuh", "Stories from growing stores") }),
        counterD(G, { items: [tr("2.400 | Toko", "2,400 | Stores"), tr("31 jt | Transaksi/bulan", "31M | Transactions/month"), tr("4,8 | Rating", "4.8 | Rating"), tr("6 jam | Hemat per minggu", "6 hrs | Saved per week")] }),
        chartPanel(G, { eyebrow: tr("Studi kasus", "Case study"), title: tr("Roti Nyonya: margin naik 9 poin", "Roti Nyonya: margin up 9 points"), text: tr("Setelah melihat produk rugi di dasbor margin, 7 varian dihentikan dan harga 12 varian disesuaikan.", "After spotting loss-making products on the margin dashboard, 7 variants were dropped and 12 repriced."), chart: { type: "bar", title: tr("Margin kotor per kuartal (%)", "Gross margin per quarter (%)"), series: tr("Margin", "Margin"), rows: ["Q1, 31", "Q2, 34", "Q3, 38", "Q4, 40"], legend: false }, reverse: true }),
      ],
      security: () => [
        pageHead(G, { eyebrow: tr("Keamanan", "Security"), title: tr("Data Anda tetap milik Anda", "Your data stays yours") }),
        editorial(G, { title: tr("Prinsip keamanan", "Security principles"), cols: [[tr("Hanya baca", "Read-only"), tr("Kami tidak pernah mengubah data kasir Anda.", "We never change your POS data.")], [tr("Enkripsi", "Encryption"), tr("AES-256 saat disimpan, TLS 1.3 saat dikirim.", "AES-256 at rest, TLS 1.3 in transit.")], [tr("Server lokal", "Local servers"), tr("Data disimpan di pusat data Jakarta.", "Data stored in a Jakarta data centre.")]] }),
        faqD(G, { title: tr("Pertanyaan keamanan", "Security questions"), items: [[tr("Siapa yang bisa melihat data?", "Who can see data?"), tr("Hanya pengguna yang Anda undang.", "Only users you invite.")], [tr("Bisa hapus akun?", "Can I delete my account?"), tr("Ya, data dihapus permanen dalam 30 hari.", "Yes, data is permanently deleted within 30 days.")]] }),
      ],
      guides: () => [
        pageHead(G, { eyebrow: tr("Panduan", "Guides"), title: tr("Belajar membaca angka toko", "Learn to read your store numbers") }),
        magazine(G, { title: tr("Artikel terbaru", "Latest articles"), read: tr("Baca", "Read"), lead: { image: asset("v4e-dash-dark"), tag: tr("Dasar", "Basics"), date: "10 Okt 2026", title: tr("Margin kotor vs margin bersih untuk UMKM", "Gross vs net margin for small businesses"), text: tr("Dua angka yang sering tertukar, dan mana yang harus dilihat setiap minggu.", "Two numbers often confused, and which one to watch weekly."), href: href("guides") }, items: [{ image: asset("v4e-dash"), tag: tr("Stok", "Stock"), date: "3 Okt", title: tr("Menentukan batas stok minimum", "Setting minimum stock levels"), text: "", href: href("guides") }, { image: asset("v4e-dash-dark"), tag: tr("Promo", "Sales"), date: "26 Sep", title: tr("Mengukur hasil promo tanggal kembar", "Measuring double-date sales"), text: "", href: href("guides") }] }),
        newsletter(G, { title: tr("Satu tips analitik setiap Kamis", "One analytics tip every Thursday"), text: tr("Ringkas, praktis, tanpa jargon.", "Short, practical, no jargon."), ph: tr("Email Anda", "Your email"), submit: tr("Langganan", "Subscribe"), inv: true }),
      ],
      demo: () => [
        pageHead(G, { eyebrow: "Demo", title: tr("Lihat data toko Anda sendiri dalam demo", "See your own store data in the demo") }),
        formD(G, { title: tr("Minta demo", "Request a demo"), info: [["Email", "halo@grafikadata.id"], [tr("Jam", "Hours"), tr("Senin–Jumat 09.00–18.00", "Mon–Fri 9am–6pm")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: tr("Nama toko", "Store name"), ph: "Toko Anda" }, { kind: "select", label: tr("Jumlah toko", "Number of stores"), ph: tr("Pilih", "Choose"), options: ["1", "2–5", "6–20", "20+"] }], submit: tr("Jadwalkan demo", "Schedule demo"), formFirst: true }),
      ],
    }),
};

/* ------ 14. Tumbuh Aset Investama — investasi (8 hlm, grafik) -------- */
// Premium: pro-stats-band, comparison-table, pricing, progress, pro-team-cards. Library: AOS. Grafik: line + doughnut.

const FP: Palette = { ink: "#05261c", muted: "#45635a", primary: "#047857", primaryDark: "#065f46", soft: "#d1fae5", line: "#a7f3d0" };
const F = lookD(FP, { head: "Merriweather", body: "Inter", shape: "sharp", radius: 6, bg: "#ffffff", alt: "#f1f8f5", inv: "#05261c", fx: { aos: "fade-up" } });

const fFoot = (tr: Tr) =>
  footerD("Tumbuh Aset", F, {
    variant: "columns",
    about: tr("Agen penjual reksa dana fiktif untuk keperluan contoh. Investasi mengandung risiko; kinerja masa lalu tidak menjamin kinerja masa depan.", "A fictional mutual-fund distributor for sample purposes. Investing carries risk; past performance does not guarantee future results."),
    cols: [{ title: tr("Produk", "Products"), items: [tr("Pasar uang", "Money market"), tr("Pendapatan tetap", "Fixed income"), tr("Saham", "Equity")] }, { title: tr("Bantuan", "Help"), items: ["1500-886", "cs@tumbuhaset.id"] }],
    social: ["Instagram | https://instagram.com/tumbuhaset", "YouTube | https://youtube.com/@tumbuhaset", "LinkedIn | https://linkedin.com/company/tumbuhaset"],
    copy: tr("© 2026 Tumbuh Aset Investama (fiktif). Angka contoh.", "© 2026 Tumbuh Aset Investama (fictional). Sample figures."),
  });

export const financeInvestasi: TemplateContent = {
  brand: "Tumbuh Aset Investama",
  pages: [
    home(),
    pg("products", ["produk", "Produk"], ["products", "Products"]),
    pg("performance", ["kinerja", "Kinerja"], ["performance", "Performance"]),
    pg("plans", ["paket-rutin", "Paket Rutin"], ["auto-invest", "Auto-Invest"]),
    pg("learn", ["belajar", "Belajar"], ["learn", "Learn"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("faq", ["faq", "FAQ"], ["faq", "FAQ"]),
    pg("contact", ["buka-akun", "Buka Akun"], ["open-account", "Open Account"]),
  ],
  build: (key, tr, href) =>
    render(F, key, headerD("Tumbuh Aset", F, { variant: "split", info: [tr("Berizin & diawasi (contoh)", "Licensed & supervised (sample)"), "1500-886"], cta: [tr("Buka akun", "Open account"), href("contact")] }), fFoot(tr), {
      home: () => [
        heroBento(F, {
          eyebrow: tr("Reksa dana mulai Rp10.000", "Mutual funds from Rp10,000"),
          title: tr("Uang yang bekerja selagi Anda bekerja", "Money that works while you do"),
          text: tr("Pilih reksa dana sesuai tujuan: dana darurat, DP rumah, atau pensiun. Pantau pertumbuhannya setiap hari.", "Pick funds by goal: emergency fund, house deposit or retirement. Track growth every day."),
          image: asset("v4e-growth"),
          alt: tr("Tumpukan koin dan tunas", "Coin stacks and a sprout"),
          tiles: [["310rb", tr("Investor", "Investors")], ["Rp4,2 T", tr("Dana kelolaan", "Assets under management")]],
          actions: [[tr("Mulai investasi", "Start investing"), href("contact")], [tr("Lihat kinerja", "See performance"), href("performance"), "outline"]],
        }),
        chartPanel(F, { eyebrow: tr("Simulasi", "Simulation"), title: tr("Rp500 ribu per bulan selama 10 tahun", "Rp500k a month for 10 years"), text: tr("Simulasi pertumbuhan dengan asumsi imbal hasil 7% per tahun dibandingkan menabung biasa 2%.", "Growth simulation assuming 7% annual returns versus a 2% savings account."), chart: { type: "line", title: tr("Nilai akumulasi (juta Rp)", "Accumulated value (Rp million)"), series: tr("Reksa dana 7%, Tabungan 2%", "Fund 7%, Savings 2%"), rows: [tr("Thn 1", "Yr 1") + ", 6.2, 6.1", tr("Thn 2", "Yr 2") + ", 12.9, 12.2", tr("Thn 4", "Yr 4") + ", 27.6, 24.9", tr("Thn 6", "Yr 6") + ", 44.5, 38.1", tr("Thn 8", "Yr 8") + ", 64.0, 51.9", tr("Thn 10", "Yr 10") + ", 86.5, 66.3"], c2: "#94a3b8" }, kpis: [["Rp86,5 jt", tr("hasil simulasi", "simulated value")], ["Rp60 jt", tr("total setoran", "total deposits")]], bullets: [tr("Ilustrasi, bukan janji imbal hasil.", "Illustration only, not a promised return.")] }),
        withFx(F, statsBand(pro(F), tr, { title: tr("Dipercaya investor pemula", "Trusted by first-time investors"), stats: [["310rb", tr("Investor", "Investors")], ["62%", tr("Investor < 30 tahun", "Investors under 30")], ["Rp10rb", tr("Minimal pembelian", "Minimum purchase")], ["0", tr("Biaya beli & jual", "Buy & sell fees")]] })),
      ],
      products: () => [
        pageHead(F, { eyebrow: tr("Produk", "Products"), title: tr("Tiga kelas reksa dana", "Three fund classes") }),
        compareD(F, { title: tr("Pilih sesuai jangka waktu", "Choose by time horizon"), columns: [tr("Pasar uang", "Money market"), tr("Pendapatan tetap", "Fixed income"), tr("Saham", "Equity")], rows: [tr("Jangka waktu | < 1 tahun | 1–3 tahun | > 5 tahun", "Horizon | < 1 yr | 1–3 yrs | > 5 yrs"), tr("Risiko | rendah | sedang | tinggi", "Risk | low | medium | high"), tr("Imbal hasil 5 thn (contoh) | 4,6% | 6,8% | 9,9%", "5-yr return (sample) | 4.6% | 6.8% | 9.9%")], highlight: 2, caption: tr("Kinerja contoh per tahun, fiktif.", "Sample annualised performance, fictional.") }),
        chartPanel(F, { title: tr("Contoh portofolio seimbang", "Sample balanced portfolio"), text: tr("Untuk tujuan 3–5 tahun dengan profil risiko moderat.", "For 3–5 year goals with a moderate risk profile."), chart: { type: "doughnut", title: tr("Alokasi aset (%)", "Asset allocation (%)"), series: tr("Porsi", "Share"), rows: [tr("Pasar uang", "Money market") + ", 20", tr("Obligasi", "Bonds") + ", 45", tr("Saham", "Equity") + ", 35"] }, reverse: true }),
      ],
      performance: () => [
        pageHead(F, { eyebrow: tr("Kinerja", "Performance"), title: tr("Kinerja reksa dana unggulan", "Flagship fund performance") }),
        chartDuo(F, { title: tr("Lima tahun terakhir", "The last five years"), charts: [{ type: "line", title: tr("Nilai aktiva bersih per unit (Rp)", "Net asset value per unit (Rp)"), series: tr("Tumbuh Saham, Indeks acuan", "Tumbuh Equity, Benchmark"), rows: ["2021, 1000, 1000", "2022, 1084, 1041", "2023, 1139, 1062", "2024, 1262, 1150", "2025, 1398, 1227", "2026, 1521, 1302"], c2: "#f59e0b" }, { type: "bar", title: tr("Imbal hasil tahunan (%)", "Annual return (%)"), series: tr("Pendapatan tetap, Pasar uang", "Fixed income, Money market"), rows: ["2022, 5.9, 3.8", "2023, 6.4, 4.2", "2024, 7.1, 4.9", "2025, 6.9, 4.7"], c2: "#a7f3d0" }], notes: [tr("Data fiktif untuk contoh.", "Fictional sample data."), tr("Sebelum pajak & biaya.", "Before tax & fees.")] }),
        tableD(F, { title: tr("Ringkasan per 30 September 2026", "Summary as of 30 September 2026"), columns: [tr("Reksa dana", "Fund"), "YTD", tr("1 tahun", "1 year"), tr("3 tahun", "3 years")], rows: [[tr("Tumbuh Pasar Uang", "Tumbuh Money Market"), "3,4%", "4,6%", "13,9%"], [tr("Tumbuh Obligasi", "Tumbuh Bond"), "5,1%", "6,8%", "21,4%"], [tr("Tumbuh Saham", "Tumbuh Equity"), "8,8%", "9,9%", "33,6%"]] }),
      ],
      plans: () => [
        pageHead(F, { eyebrow: tr("Paket rutin", "Auto-invest"), title: tr("Investasi otomatis setiap gajian", "Invest automatically every payday") }),
        plansD(F, { title: tr("Paket autodebet", "Auto-debit plans"), items: [{ plan: tr("Dana darurat", "Emergency fund"), price: "Rp200rb", period: tr("/bulan", "/month"), description: tr("100% pasar uang.", "100% money market."), features: [tr("Cair 1 hari kerja", "Withdraw in 1 working day"), tr("Risiko rendah", "Low risk")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact") }, { plan: tr("DP rumah", "House deposit"), price: "Rp1jt", period: tr("/bulan", "/month"), description: tr("Campuran 3–5 tahun.", "3–5 year mix."), features: [tr("Rebalancing otomatis", "Automatic rebalancing"), tr("Target tercapai notifikasi", "Goal-reached alerts")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact"), featured: true, badge: tr("Populer", "Popular") }, { plan: tr("Pensiun", "Retirement"), price: "Rp500rb", period: tr("/bulan", "/month"), description: tr("Didominasi saham.", "Equity-heavy."), features: [tr("Horizon > 10 tahun", "10+ year horizon"), tr("Laporan tahunan", "Annual report")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact") }] }),
        progressD(F, { title: tr("Contoh progres tujuan", "Sample goal progress"), bars: [[tr("Dana darurat", "Emergency fund"), 82], [tr("DP rumah", "House deposit"), 46], [tr("Pensiun", "Retirement"), 18]] }),
      ],
      learn: () => [
        pageHead(F, { eyebrow: tr("Belajar", "Learn"), title: tr("Kelas investasi gratis", "Free investing classes") }),
        indexList(F, { title: tr("Materi dasar", "Basics"), rows: [{ title: tr("Apa itu reksa dana?", "What is a mutual fund?"), meta: tr("6 menit baca", "6-min read"), tag: tr("Dasar", "Basics"), href: href("learn"), cta: tr("Baca", "Read") }, { title: tr("Mengenal profil risiko", "Understanding risk profiles"), meta: tr("8 menit baca", "8-min read"), tag: tr("Dasar", "Basics"), href: href("learn"), cta: tr("Baca", "Read") }, { title: tr("Strategi investasi rutin", "Regular investing strategy"), meta: tr("5 menit baca", "5-min read"), tag: tr("Strategi", "Strategy"), href: href("learn"), cta: tr("Baca", "Read") }] }),
        newsletter(F, { title: tr("Surat kabar investasi mingguan", "Weekly investing letter"), text: tr("Ringkasan pasar dalam 3 menit setiap Senin.", "A 3-minute market summary every Monday."), ph: tr("Email Anda", "Your email"), submit: tr("Langganan", "Subscribe") }),
      ],
      about: () => [
        pageHead(F, { eyebrow: tr("Tentang", "About"), title: tr("Membuat investasi terasa biasa", "Making investing feel ordinary") }),
        withFx(F, teamCards(pro(F), tr, { title: tr("Tim pengelola", "Leadership"), members: [{ name: "Ratih Purnamasari, CFA", role: tr("Kepala Investasi", "Chief Investment Officer"), photo: asset("v4e-face-2") }, { name: "Yogi Prasetya", role: tr("Direktur Utama", "CEO"), photo: asset("v4e-face-1") }, { name: "Hana Wibisono", role: tr("Kepala Kepatuhan", "Head of Compliance"), photo: asset("v4e-face-4") }] })),
        timelineD(F, { title: tr("Perjalanan kami", "Our journey"), items: [["2019", tr("Berdiri", "Founded"), tr("Tim lima orang di Jakarta.", "A five-person team in Jakarta.")], ["2022", tr("100 ribu investor", "100k investors"), tr("Mayoritas investor pertama kali.", "Mostly first-time investors.")], ["2026", "Rp4,2 T", tr("Dana kelolaan.", "Assets under management.")]] }),
      ],
      faq: () => [
        pageHead(F, { eyebrow: "FAQ", title: tr("Pertanyaan investor", "Investor questions") }),
        faqD(F, { title: tr("Paling sering ditanyakan", "Most asked"), items: [[tr("Apakah uang saya aman?", "Is my money safe?"), tr("Dana disimpan di bank kustodian terpisah dari perusahaan.", "Funds are held at a custodian bank, separate from the company.")], [tr("Kapan bisa dicairkan?", "When can I withdraw?"), tr("1–7 hari kerja tergantung jenis reksa dana.", "1–7 working days depending on the fund.")], [tr("Ada biaya?", "Any fees?"), tr("Tanpa biaya beli/jual; biaya pengelolaan sudah di dalam NAB.", "No buy/sell fees; management fees are inside the NAV.")]] }),
      ],
      contact: () => [
        pageHead(F, { eyebrow: tr("Buka akun", "Open account"), title: tr("Buka akun dalam 10 menit", "Open an account in 10 minutes") }),
        rail(F, { title: tr("Yang perlu disiapkan", "What you need"), steps: [["KTP", tr("Foto KTP asli.", "A photo of your ID card.")], ["NPWP", tr("Opsional.", "Optional.")], [tr("Rekening", "Bank account"), tr("Atas nama sendiri.", "In your own name.")]] }),
        formD(F, { title: tr("Daftar", "Register"), info: [["Telepon", "1500-886"]], fields: [{ kind: "input", label: tr("Nama sesuai KTP", "Name as on ID"), ph: tr("Nama lengkap", "Full name") }, { kind: "input", label: "Email", ph: "nama@email.com", type: "email" }, { kind: "select", label: tr("Tujuan", "Goal"), ph: tr("Pilih", "Choose"), options: [tr("Dana darurat", "Emergency fund"), tr("DP rumah", "House deposit"), tr("Pensiun", "Retirement")] }], submit: tr("Lanjut", "Continue") }),
      ],
    }),
};

/* ------ 15. Hijau Rakit — kebun hidroponik (6 hlm, grafik) ----------- */
// Premium: progress, slider, pro-testimonials-wall. Library: AOS + Tilt. Grafik: bar.

const HP: Palette = { ink: "#0f2a14", muted: "#4a6450", primary: "#16a34a", primaryDark: "#15803d", soft: "#dcfce7", line: "#bbf7d0" };
const H = lookD(HP, { head: "Sora", body: "Nunito", shape: "soft", radius: 22, bg: "#f8fdf8", alt: "#ecf8ee", inv: "#0f2a14", fx: { aos: "zoom-in", tilt: true } });

const hFoot = (tr: Tr) =>
  footerD("Hijau Rakit", H, {
    variant: "slim",
    about: tr("Kebun hidroponik di atap gedung Surabaya: sayur segar dipanen pagi, diantar siang.", "A rooftop hydroponic farm in Surabaya: greens picked in the morning, delivered by noon."),
    social: ["Instagram | https://instagram.com/hijaurakit", "WhatsApp | https://wa.me/6281300009988"],
    copy: tr("© 2026 Hijau Rakit. Konten & angka contoh.", "© 2026 Hijau Rakit. Sample content & figures."),
  });

export const agricultureHidroponik: TemplateContent = {
  brand: "Hijau Rakit",
  pages: [home(), pg("produce", ["sayur", "Sayur"], ["produce", "Produce"]), pg("harvest", ["data-panen", "Data Panen"], ["harvest-data", "Harvest Data"]), pg("kits", ["kit-rumah", "Kit Rumah"], ["home-kits", "Home Kits"]), pg("training", ["pelatihan", "Pelatihan"], ["training", "Training"]), pg("order", ["pesan", "Pesan"], ["order", "Order"])],
  build: (key, tr, href) =>
    render(H, key, headerD("Hijau Rakit", H, { variant: "pill", cta: [tr("Langganan sayur", "Veg subscription"), href("order")] }), hFoot(tr), {
      home: () => [
        heroSoft(H, {
          eyebrow: tr("Hidroponik atap kota", "Urban rooftop hydroponics"),
          title: tr("Dipanen pagi, sampai di dapur siang", "Picked at dawn, in your kitchen by noon"),
          text: tr("Selada, kangkung, dan pakcoy tanpa pestisida dari 1.200 lubang tanam di atap gedung Surabaya.", "Pesticide-free lettuce, water spinach and pak choi from 1,200 planting holes on a Surabaya rooftop."),
          image: asset("v4e-hydro"),
          alt: tr("Rak hidroponik berisi selada", "Hydroponic rack of lettuce"),
          chips: [tr("Tanpa pestisida", "Pesticide-free"), tr("Hemat air 90%", "90% less water"), tr("Antar hari yang sama", "Same-day delivery")],
          actions: [[tr("Langganan", "Subscribe"), href("order")], [tr("Lihat data panen", "See harvest data"), href("harvest"), "outline"]],
        }),
        chartPanel(H, { eyebrow: tr("Transparan", "Transparent"), title: tr("Panen kami tiap bulan", "Our monthly harvest"), text: tr("Kami mencatat setiap kilogram yang dipanen dan dikirim.", "We log every kilogram harvested and delivered."), chart: { type: "bar", title: tr("Panen per bulan (kg)", "Harvest per month (kg)"), series: tr("Selada, Pakcoy", "Lettuce, Pak choi"), rows: [tr("Mei", "May") + ", 310, 220", "Jun, 340, 236", "Jul, 365, 250", tr("Agu", "Aug") + ", 392, 262", "Sep, 420, 281"], c2: "#facc15" }, kpis: [["1.200", tr("lubang tanam", "planting holes")], ["35 hr", tr("siklus selada", "lettuce cycle")]] }),
        sliderD(H, { slides: [{ title: tr("Selada keriting", "Curly lettuce"), text: tr("Renyah, cocok untuk salad.", "Crunchy, great for salads."), bg: "#15803d" }, { title: tr("Pakcoy", "Pak choi"), text: tr("Tumis bawang putih 3 menit.", "Garlic stir-fry in 3 minutes."), bg: "#166534" }, { title: tr("Kangkung", "Water spinach"), text: tr("Batang muda, tidak berserat.", "Young stems, no stringiness."), bg: "#14532d" }] }),
      ],
      produce: () => [
        pageHead(H, { eyebrow: tr("Sayur", "Produce"), title: tr("Yang tumbuh di atap kami", "What grows on our roof") }),
        catalog(H, { title: tr("Sayur minggu ini", "This week's greens"), cols: 4, items: [{ image: asset("v4e-hydro"), title: tr("Selada keriting", "Curly lettuce"), text: "250 g", price: "Rp14.000", cta: tr("Pesan", "Order"), href: href("order") }, { image: asset("v4e-hydro-night"), title: tr("Pakcoy", "Pak choi"), text: "250 g", price: "Rp12.000", cta: tr("Pesan", "Order"), href: href("order") }, { image: asset("v4e-hydro"), title: tr("Kangkung", "Water spinach"), text: "250 g", price: "Rp9.000", cta: tr("Pesan", "Order"), href: href("order") }, { image: asset("v4e-hydro-night"), title: tr("Selada romaine", "Romaine"), text: "300 g", price: "Rp18.000", badge: tr("Baru", "New"), cta: tr("Pesan", "Order"), href: href("order") }] }),
        withFx(H, testimonialsWall(pro(H), tr, { title: tr("Kata pelanggan", "Customers say"), score: 4.9, caption: tr("dari 840 pelanggan langganan", "from 840 subscribers"), quotes: [{ text: tr("Selada tahan seminggu di kulkas.", "The lettuce lasts a week in the fridge."), name: "Bu Endang", role: tr("Ibu rumah tangga", "Home cook"), avatar: asset("v4e-face-4") }, { text: tr("Restoran kami pakai pakcoy mereka setiap hari.", "Our restaurant uses their pak choi daily."), name: "Chef Arman", role: tr("Dapur Sinar", "Dapur Sinar"), avatar: asset("v4e-face-3") }, { text: tr("Anak saya mau makan sayur sejak lihat kebunnya.", "My kid eats greens since seeing the farm."), name: "Rani", role: tr("Pelanggan", "Subscriber"), avatar: asset("v4e-face-2") }] })),
      ],
      harvest: () => [
        pageHead(H, { eyebrow: tr("Data panen", "Harvest data"), title: tr("Angka dari kebun kami", "Numbers from our farm") }),
        chartDuo(H, { title: tr("Air & hasil panen", "Water & yield"), charts: [{ type: "bar", title: tr("Air terpakai per kg sayur (liter)", "Water used per kg of greens (litres)"), series: tr("Hidroponik, Tanah", "Hydroponic, Soil"), rows: [tr("Selada", "Lettuce") + ", 22, 250", tr("Pakcoy", "Pak choi") + ", 26, 230", tr("Kangkung", "Water spinach") + ", 18, 190"], c2: "#94a3b8" }, { type: "bar", title: tr("Hasil per siklus (kg/m²)", "Yield per cycle (kg/m²)"), series: tr("Kebun kami", "Our farm"), rows: [tr("Selada", "Lettuce") + ", 4.2", tr("Pakcoy", "Pak choi") + ", 3.6", tr("Kangkung", "Water spinach") + ", 5.1"], legend: false }], notes: [tr("Rata-rata Jan–Sep 2026.", "Jan–Sep 2026 average."), tr("Data internal, contoh.", "Internal data, sample.")] }),
        progressD(H, { title: tr("Target keberlanjutan 2026", "2026 sustainability targets"), bars: [[tr("Energi surya", "Solar power"), 64], [tr("Kemasan kompos", "Compostable packaging"), 88], [tr("Air hujan tertampung", "Rainwater captured"), 41]] }),
      ],
      kits: () => [
        pageHead(H, { eyebrow: tr("Kit rumah", "Home kits"), title: tr("Tanam sendiri di balkon", "Grow your own on the balcony") }),
        cardsD(H, { title: tr("Pilihan kit", "Kit options"), cols: 3, items: [{ icon: "◔", title: tr("Kit Jendela", "Window kit"), text: tr("12 lubang, wick system.", "12 holes, wick system."), meta: "Rp185.000" }, { icon: "◑", title: tr("Kit Balkon", "Balcony kit"), text: tr("36 lubang NFT + pompa.", "36-hole NFT + pump."), meta: "Rp1.250.000" }, { icon: "●", title: tr("Kit Sekolah", "School kit"), text: tr("Lengkap dengan modul ajar.", "With teaching modules."), meta: "Rp2.400.000" }] }),
        specs(H, { title: tr("Isi Kit Balkon", "Balcony kit contents"), rows: [[tr("Pipa", "Pipes"), tr("PVC 3 inci × 4", "3-inch PVC × 4")], [tr("Pompa", "Pump"), "18 W"], [tr("Nutrisi", "Nutrients"), tr("AB mix 1 liter", "AB mix 1 litre")], [tr("Benih", "Seeds"), tr("4 jenis", "4 varieties")]], image: asset("v4e-hydro"), alt: tr("Kit balkon", "Balcony kit") }),
      ],
      training: () => [
        pageHead(H, { eyebrow: tr("Pelatihan", "Training"), title: tr("Belajar hidroponik sehari", "Learn hydroponics in a day") }),
        rail(H, { title: tr("Materi pelatihan", "Training outline"), steps: [[tr("Sistem", "Systems"), tr("Wick, NFT, DFT.", "Wick, NFT, DFT.")], [tr("Nutrisi", "Nutrients"), tr("Mengukur TDS & pH.", "Measuring TDS & pH.")], [tr("Semai", "Seeding"), tr("Rockwool & pindah tanam.", "Rockwool & transplanting.")], [tr("Panen", "Harvest"), tr("Pasca panen & jual.", "Post-harvest & selling.")]] }),
        formD(H, { title: tr("Daftar pelatihan", "Join a training"), info: [[tr("Jadwal", "Schedule"), tr("Sabtu kedua tiap bulan", "Second Saturday monthly")], [tr("Biaya", "Fee"), "Rp350.000"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: "WhatsApp", ph: "08xx" }], submit: tr("Daftar", "Register") }),
      ],
      order: () => [
        pageHead(H, { eyebrow: tr("Pesan", "Order"), title: tr("Langganan sayur mingguan", "Weekly veg subscription") }),
        tableD(H, { title: tr("Paket langganan", "Subscription boxes"), columns: [tr("Paket", "Box"), tr("Isi", "Contents"), tr("Harga/minggu", "Price/week")], rows: [[tr("Kecil", "Small"), "1 kg", "Rp45.000"], [tr("Keluarga", "Family"), "2,5 kg", "Rp99.000"], [tr("Restoran", "Restaurant"), "10 kg", "Rp360.000"]] }),
        formD(H, { title: tr("Mulai langganan", "Start a subscription"), info: [["WhatsApp", "0813 0000 9988"], [tr("Area antar", "Delivery area"), "Surabaya & Sidoarjo"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Paket", "Box"), ph: tr("Pilih", "Choose"), options: [tr("Kecil", "Small"), tr("Keluarga", "Family"), tr("Restoran", "Restaurant")] }, { kind: "input", label: tr("Alamat", "Address"), ph: tr("Alamat antar", "Delivery address") }], submit: tr("Langganan", "Subscribe") }),
      ],
    }),
};
