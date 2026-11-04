import { faqAccordion, portfolioMosaic, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { Palette } from "../../../build";
import type { TemplateContent } from "../../../types";
import { FONTS, centeredHeader, cta, footer, header } from "../../pro/kit";
import {
  P,
  accordionSec,
  asset,
  cards,
  compareSec,
  counters,
  countdownSec,
  ctaSplit,
  footerSlim,
  formSec,
  gallery,
  heroImage,
  heroSplit,
  heroType,
  imgCards,
  infoBar,
  logos,
  look,
  mega,
  pageHead,
  priceCards,
  priceList,
  priceSwitch,
  products,
  quote,
  render,
  rowsList,
  sliderSec,
  split,
  steps,
  tableSec,
  tabsSec,
  testiCards,
  timeline,
  withTopbar,
} from "./kitB";

/* ================================================================== */
/* Set B · part 5: Pharmacy, Wedding Films, Cybersecurity, Notary,       */
/* Coworking.                                                           */
/* ================================================================== */

/* --------------------- 21. health-pharmacy (PREMIUM, 7) ------------ */

const WF: Palette = { ink: "#073b3a", muted: "#41615f", primary: "#059669", primaryDark: "#047857", soft: "#ecfdf5", line: "#a7f3d0" };
const wfL = look(WF, { font: FONTS.sans, r: 14, dark: "#073b3a", alt: "#f0fdf9", onDark: "#a7f3d0" });

export const healthPharmacy: TemplateContent = {
  brand: "Apotek Waluyo Farma",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("products", "Produk", "Products", "produk", "products"),
    P("prescription", "Tebus Resep", "Prescriptions", "tebus-resep", "prescriptions"),
    P("services", "Layanan Kesehatan", "Health Services", "layanan", "services"),
    P("articles", "Info Sehat", "Health Tips", "info-sehat", "health-tips"),
    P("branches", "Cabang", "Branches", "cabang", "branches"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = wfL;
    const nav = mega(
      L,
      [
        `${tr("Produk", "Products")} | ${href("products")}`,
        `- ${tr("Obat bebas", "OTC medicine")} | ${tr("Demam, batuk, flu", "Fever, cough, flu")} | ${href("products")}`,
        `- ${tr("Vitamin", "Vitamins")} | ${tr("Daya tahan & suplemen", "Immunity & supplements")} | ${href("products")}`,
        `- ${tr("Ibu & anak", "Mother & baby")} | ${tr("Susu, popok, perawatan", "Formula, diapers, care")} | ${href("products")}`,
        `${tr("Tebus resep", "Prescriptions")} | ${href("prescription")}`,
        `${tr("Layanan", "Services")} | ${href("services")}`,
        `- ${tr("Cek kesehatan", "Health checks")} | ${tr("Gula darah, kolesterol, tensi", "Blood sugar, cholesterol, BP")} | ${href("services")}`,
        `- ${tr("Vaksinasi", "Vaccination")} | ${tr("Influenza, HPV, hepatitis B", "Influenza, HPV, hepatitis B")} | ${href("services")}`,
        `${tr("Cabang", "Branches")} | ${href("branches")}`,
      ],
      tr("Chat apoteker", "Chat a pharmacist"),
      href("contact"),
    );
    const head = withTopbar(header("Waluyo Farma ✚", WF, { nav, font: FONTS.sans }), L, tr("Apoteker jaga 24 jam di cabang Slamet Riyadi · antar obat 60 menit se-Solo Raya", "24-hour pharmacist at Slamet Riyadi · 60-minute delivery across Greater Solo"), { bg: "#047857" });
    const foot = footer("Apotek Waluyo Farma", tr("Jaringan apotek keluarga di Solo Raya sejak 1987.", "A family pharmacy network in Greater Solo since 1987."), [{ title: tr("Pusat", "Head office"), items: ["Jl. Slamet Riyadi 301", "Surakarta"] }, { title: tr("Izin", "Licenses"), items: ["SIA 503/0123/2020", tr("Apoteker: apt. Sri Lestari, S.Farm.", "Pharmacist: Sri Lestari, B.Pharm.")] }, { title: tr("Kontak", "Contact"), items: ["(0271) 700 301", "WA +62 812 2700 301"] }], tr("© 2026 Apotek Waluyo Farma. Informasi contoh, bukan nasihat medis.", "© 2026 Apotek Waluyo Farma. Sample information, not medical advice."), "#073b3a");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { badge: tr("12 cabang · 3 buka 24 jam", "12 branches · 3 open 24 hours"), title: tr("Apotek keluarga yang mau mendengarkan", "The family pharmacy that listens"), text: tr("Tebus resep, konsultasi apoteker gratis, cek kesehatan, dan antar obat dalam 60 menit.", "Prescriptions, free pharmacist advice, health checks, and 60-minute delivery."), btns: [[tr("Tebus resep", "Fill a prescription"), href("prescription")], [tr("Cari cabang", "Find a branch"), href("branches")]], image: "v2b-pills", alt: tr("Obat", "Medicine"), bg: WF.soft }),
        servicesSplit(L.t, tr, { eyebrow: tr("Layanan", "Services"), title: tr("Lebih dari sekadar menjual obat", "More than selling medicine"), image: asset("v2b-pack-medkit"), reverse: true, items: [{ icon: "💬", title: tr("Konsultasi apoteker", "Pharmacist advice"), text: tr("Gratis, di tempat atau via WhatsApp.", "Free, in store or via WhatsApp.") }, { icon: "🩸", title: tr("Cek kesehatan", "Health checks"), text: tr("Gula darah, kolesterol, asam urat dalam 5 menit.", "Blood sugar, cholesterol, uric acid in 5 minutes.") }, { icon: "🛵", title: tr("Antar 60 menit", "60-minute delivery"), text: tr("Gratis ongkir di atas Rp100rb.", "Free delivery over Rp100k.") }], cta: { label: tr("Semua layanan", "All services"), href: href("services") } }),
        products(L, { ey: tr("Kebutuhan musim hujan", "Rainy season essentials"), title: tr("Siaga flu & demam", "Ready for flu season"), items: [{ image: "v2b-pack-vitamin", title: tr("Vitamin C 1000 mg", "Vitamin C 1000 mg"), text: tr("30 tablet effervescent", "30 effervescent tablets"), price: "Rp58.000", rating: 4.8, reviews: "(320)" }, { image: "v2b-pack-medkit", title: tr("Kotak P3K Keluarga", "Family First-Aid Kit"), text: tr("24 item", "24 items"), price: "Rp139.000", badge: tr("Promo", "Deal"), compare: "Rp165.000", rating: 4.7, reviews: "(88)" }, { image: "v2b-pack-cream", title: tr("Balsam Anak Kayu Putih", "Kids' Eucalyptus Balm"), text: "20 g", price: "Rp27.500", rating: 4.9, reviews: "(410)" }], cta: tr("Detail", "Details"), href: href("products"), bg: L.alt }),
        testiCards(L, { title: tr("Kata pelanggan", "What customers say"), items: [{ quote: tr("Apotekernya menjelaskan interaksi obat ibu saya dengan sabar.", "The pharmacist patiently explained my mother's drug interactions."), author: "Wahyu Nugroho", role: tr("Pelanggan Laweyan", "Laweyan customer"), avatar: "v2b-face-5" }, { quote: tr("Obat anak datang 40 menit setelah pesan jam 11 malam.", "My child's medicine arrived 40 minutes after ordering at 11pm."), author: "Anisa Rahma", role: tr("Ibu dua anak", "Mother of two"), avatar: "v2b-face-4" }] }),
      ],
      products: () => [
        pageHead(L, { ey: tr("Produk", "Products"), title: tr("Obat bebas, vitamin, dan perawatan", "OTC medicine, vitamins, and care"), text: tr("Obat keras hanya dengan resep dokter.", "Prescription-only medicines require a doctor's prescription."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Produk", "Products"), ""]] }),
        products(L, { cols: 4, items: [{ image: "v2b-pack-vitamin", title: tr("Vitamin C 1000 mg", "Vitamin C 1000 mg"), text: tr("30 tablet", "30 tablets"), price: "Rp58.000", rating: 4.8, reviews: "(320)" }, { image: "v2b-pack-vitamin", title: tr("Vitamin D3 1000 IU", "Vitamin D3 1000 IU"), text: tr("60 kapsul", "60 capsules"), price: "Rp89.000", rating: 4.8, reviews: "(150)" }, { image: "v2b-pills", title: tr("Parasetamol 500 mg", "Paracetamol 500 mg"), text: tr("10 tablet", "10 tablets"), price: "Rp6.500", rating: 4.9, reviews: "(980)" }, { image: "v2b-pack-cream", title: tr("Salep Luka Bakar", "Burn Ointment"), text: "25 g", price: "Rp32.000", rating: 4.7, reviews: "(110)" }, { image: "v2b-pack-medkit", title: tr("Kotak P3K Keluarga", "Family First-Aid Kit"), text: tr("24 item", "24 items"), price: "Rp139.000", rating: 4.7, reviews: "(88)" }, { image: "v2b-pack-cream", title: tr("Minyak Telon 100 ml", "Telon Oil 100 ml"), text: tr("Untuk bayi", "For babies"), price: "Rp24.000", rating: 4.9, reviews: "(560)" }, { image: "v2b-pills", title: tr("Oralit", "Oral Rehydration Salts"), text: tr("5 sachet", "5 sachets"), price: "Rp9.000", rating: 4.8, reviews: "(204)" }, { image: "v2b-pack-vitamin", title: tr("Masker Medis", "Medical Masks"), text: tr("50 lembar", "50 pieces"), price: "Rp35.000", rating: 4.6, reviews: "(300)" }], cta: tr("Pesan via WA", "Order via WhatsApp"), href: href("contact") }),
      ],
      prescription: () => [
        pageHead(L, { ey: tr("Tebus resep", "Prescriptions"), title: tr("Foto resep, obat diantar", "Snap your prescription, we deliver"), dark: true }),
        steps(L, { title: tr("Empat langkah", "Four steps"), items: [[tr("Foto resep", "Photograph it"), tr("Kirim via formulir atau WA.", "Send via form or WhatsApp.")], [tr("Verifikasi", "Verification"), tr("Apoteker cek dosis & stok.", "Pharmacist checks dose & stock.")], [tr("Konfirmasi harga", "Price confirmation"), tr("Termasuk opsi generik.", "Including generic options.")], [tr("Antar / ambil", "Deliver / pick up"), tr("60 menit atau di cabang.", "60 minutes or in store.")]] }),
        formSec(L, { title: tr("Kirim resep", "Send your prescription"), text: tr("Resep asli diserahkan saat obat diterima.", "Hand over the original prescription on delivery."), fields: [{ k: "input", label: tr("Nama pasien", "Patient name"), ph: tr("Nama", "Name") }, { k: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" }, { k: "select", label: tr("Pengambilan", "Collection"), ph: tr("Pilih", "Choose"), options: [tr("Antar ke rumah", "Home delivery"), tr("Ambil di cabang", "Pick up in store")] }, { k: "check", label: tr("Saya bersedia obat generik", "Generic substitutes are fine") }], submit: tr("Kirim", "Send"), info: [[tr("Jam layanan", "Service hours"), tr("24 jam", "24 hours")]] }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan kesehatan", "Health services"), title: tr("Cek kesehatan & vaksinasi", "Health checks & vaccination"), image: "v2b-pack-medkit" }),
        priceList(L, { title: tr("Daftar layanan", "Service list"), groups: [{ name: tr("Cek cepat", "Quick checks"), items: [[tr("Gula darah", "Blood sugar"), tr("hasil 1 menit", "1-minute result"), "Rp20rb"], [tr("Kolesterol total", "Total cholesterol"), tr("hasil 3 menit", "3-minute result"), "Rp35rb"], [tr("Asam urat", "Uric acid"), tr("hasil 1 menit", "1-minute result"), "Rp25rb"], [tr("Tensi", "Blood pressure"), "", tr("Gratis", "Free")]] }, { name: tr("Vaksinasi", "Vaccination"), items: [[tr("Influenza", "Influenza"), tr("tahunan", "yearly"), "Rp285rb"], ["HPV", tr("per dosis", "per dose"), "Rp1,05jt"], [tr("Hepatitis B", "Hepatitis B"), tr("dewasa", "adult"), "Rp195rb"]] }], note: tr("Vaksinasi dengan dokter jaga, Sabtu 09.00–14.00.", "Vaccinations with a doctor on duty, Saturdays 9am–2pm.") }),
        accordionSec(L, { title: tr("Persiapan pemeriksaan", "Preparing for a check"), bg: L.alt, items: [[tr("Perlu puasa?", "Do I need to fast?"), tr("Gula darah puasa & kolesterol: puasa 8–10 jam.", "Fasting glucose & cholesterol: fast 8–10 hours.")], [tr("Boleh untuk anak?", "OK for children?"), tr("Cek gula darah boleh untuk usia 5 tahun ke atas.", "Blood sugar checks are fine from age 5.")]] }),
      ],
      articles: () => [
        pageHead(L, { ey: tr("Info sehat", "Health tips"), title: tr("Ditulis apoteker kami", "Written by our pharmacists"), center: true }),
        imgCards(L, { items: [{ image: "v2b-pills", meta: tr("5 menit", "5 min"), title: tr("Kapan antibiotik tidak diperlukan", "When antibiotics aren't needed"), text: tr("Flu biasa disebabkan virus, bukan bakteri.", "Common colds are viral, not bacterial.") }, { image: "v2b-pack-vitamin", meta: tr("4 menit", "4 min"), title: tr("Vitamin D di negara tropis", "Vitamin D in the tropics"), text: tr("Mengapa banyak orang Indonesia tetap kekurangan.", "Why many Indonesians are still deficient.") }, { image: "v2b-pack-medkit", meta: tr("3 menit", "3 min"), title: tr("Isi kotak P3K musim hujan", "Your rainy-season first-aid kit"), text: tr("Delapan barang yang wajib ada.", "Eight must-have items.") }] }),
        timeline(L, { title: tr("Menyimpan obat dengan benar", "Storing medicine correctly"), bg: L.alt, items: [[tr("Suhu", "Temperature"), tr("Di bawah 30°C", "Below 30°C"), tr("Jauhkan dari jendela dan dapur.", "Away from windows and the kitchen.")], [tr("Sirup", "Syrups"), tr("Buang setelah 1 bulan dibuka", "Discard 1 month after opening"), tr("Tulis tanggal buka di botol.", "Write the opening date on the bottle.")], [tr("Insulin", "Insulin"), tr("Kulkas 2–8°C", "Fridge at 2–8°C"), tr("Jangan dibekukan.", "Never freeze.")]] }),
      ],
      branches: () => [
        pageHead(L, { ey: tr("Cabang", "Branches"), title: tr("12 cabang di Solo Raya", "12 branches across Greater Solo"), dark: true }),
        cards(L, { cols: 3, items: [{ icon: "🕐", meta: tr("24 jam", "24 hours"), title: "Slamet Riyadi", text: "Jl. Slamet Riyadi 301, Surakarta" }, { icon: "🕐", meta: tr("24 jam", "24 hours"), title: "Solo Baru", text: "Jl. Ir. Soekarno 12, Sukoharjo" }, { icon: "🕐", meta: tr("24 jam", "24 hours"), title: "Kartasura", text: "Jl. Ahmad Yani 88, Kartasura" }, { icon: "🏪", meta: "07.00–22.00", title: "Laweyan", text: "Jl. Dr. Rajiman 410" }, { icon: "🏪", meta: "07.00–22.00", title: "Jebres", text: "Jl. Kolonel Sutarto 55" }, { icon: "🏪", meta: "07.00–22.00", title: "Klaten", text: "Jl. Pemuda 120, Klaten" }] }),
        infoBar(L, [[tr("Antar obat", "Delivery"), tr("60 menit", "60 minutes")], [tr("Ongkir gratis", "Free delivery"), "> Rp100rb"], [tr("Pembayaran", "Payment"), "QRIS · " + tr("kartu", "cards")]]),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Tanya apoteker", "Ask a pharmacist"), text: tr("Jawaban dalam 15 menit, 24 jam.", "Answers within 15 minutes, 24 hours."), info: [["WhatsApp", "+62 812 2700 301"], [tr("Telepon", "Phone"), "(0271) 700 301"]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { k: "select", label: tr("Topik", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Dosis obat", "Dosage"), tr("Interaksi obat", "Drug interactions"), tr("Ketersediaan stok", "Stock availability"), tr("Lainnya", "Other")] }, { k: "input", label: tr("Pertanyaan singkat", "Short question"), ph: tr("Bolehkah parasetamol untuk ibu hamil?", "Is paracetamol safe in pregnancy?") }], submit: tr("Kirim", "Send") }),
      ],
    });
  },
};

/* -------------- 22. photography-wedding-film (PREMIUM, 4) ---------- */

const KF: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#b08d57", primaryDark: "#8a6d3b", soft: "#f7f2ea", line: "#e2d3b8" };
const kfL = look(KF, { font: FONTS.sans, hf: FONTS.elegant, r: 0, dark: "#0c0a09", alt: "#f7f2ea", onDark: "#d6c4a3" });

export const photographyWeddingFilm: TemplateContent = {
  brand: "Kinara Frames",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("films", "Film", "Films", "film", "films"),
    P("packages", "Paket", "Packages", "paket", "packages"),
    P("booking", "Booking", "Booking", "booking", "booking"),
  ],
  build: (key, tr, href) => {
    const L = kfL;
    const head = centeredHeader("KINARA FRAMES", KF, { font: FONTS.elegant, bg: "#0c0a09", ink: "#ffffff" });
    const foot = footerSlim(L, "KINARA FRAMES", [[tr("Film", "Films"), href("films")], [tr("Paket", "Packages"), href("packages")], ["Booking", href("booking")]], tr("© 2026 Kinara Frames · Bandung & Bali. Karya contoh.", "© 2026 Kinara Frames · Bandung & Bali. Sample work."), { bg: "#0c0a09" });
    return render(L, key, head, foot, {
      home: () => [
        heroImage(L, { ey: tr("Foto & film pernikahan", "Wedding photo & film"), title: tr("Bukan sekadar dokumentasi. Ini film tentang kalian.", "Not just coverage. A film about you."), text: tr("Sinematografi dan foto dokumenter untuk pasangan yang ingin mengingat rasanya, bukan hanya rupanya.", "Cinematography and documentary photography for couples who want to remember how it felt, not just how it looked."), btns: [[tr("Tonton film", "Watch films"), href("films")], [tr("Cek tanggal", "Check your date"), href("booking")]], image: "v2b-film", overlay: "#0c0a09", opacity: 55, center: true, minHeight: 620 }),
        sliderSec(L, [["Laras & Bima — Yogyakarta", tr("Film 8 menit · adat Jawa · 4K", "8-minute film · Javanese ceremony · 4K"), "#3f2a1d"], ["Nadya & Kevin — Uluwatu", tr("Film 6 menit · pantai saat senja", "6-minute film · beach at dusk"), "#1e3a5f"], ["Sekar & Daniel — Lembang", tr("Film 5 menit · intimate di kebun teh", "5-minute film · intimate tea garden"), "#14532d"]], { height: 420, bg: "#0c0a09", padY: 56 }),
        portfolioMosaic(L.t, tr, { eyebrow: tr("Foto", "Photos"), title: tr("Bingkai yang kami sukai", "Frames we love"), text: tr("84 pernikahan sejak 2018, di 11 kota.", "84 weddings since 2018, in 11 cities."), cta: { label: tr("Lihat paket", "See packages"), href: href("packages") }, works: [{ title: "Laras & Bima", tag: tr("Kraton, Yogyakarta", "Kraton, Yogyakarta"), image: asset("photo-1") }, { title: "Nadya & Kevin", tag: "Uluwatu, Bali", image: asset("photo-4") }, { title: "Sekar & Daniel", tag: tr("Lembang, Bandung", "Lembang, Bandung"), image: asset("photo-2") }, { title: "Ayu & Fajar", tag: tr("Solo", "Solo"), image: asset("photo-3") }, { title: "Rara & Yusuf", tag: "Jakarta", image: asset("photo-5") }] }),
        quote(L, { dark: true, text: tr("Kami menangis lagi waktu menonton filmnya setahun kemudian. Persis seperti hari itu.", "We cried again watching the film a year later. Exactly like that day."), name: "Nadya & Kevin", role: tr("Menikah di Uluwatu, 2025", "Married in Uluwatu, 2025"), bg: "#0c0a09" }),
      ],
      films: () => [
        pageHead(L, { ey: tr("Film", "Films"), title: tr("Film pernikahan pilihan", "Selected wedding films"), text: tr("Semua film direkam dengan 2–3 kamera sinema dan audio terpisah untuk janji suci.", "Every film shot on 2–3 cinema cameras with separate audio for the vows."), dark: true, bg: "#0c0a09" }),
        imgCards(L, { cols: 2, ratio: "16 / 9", items: [{ image: "v2b-film", meta: tr("8:12 · Yogyakarta", "8:12 · Yogyakarta"), title: tr("Laras & Bima — Sepanjang Malioboro", "Laras & Bima — Along Malioboro"), text: tr("Dari midodareni hingga resepsi di pendopo.", "From midodareni to the pavilion reception.") }, { image: "photo-4", meta: "6:05 · Bali", title: tr("Nadya & Kevin — Garis Senja", "Nadya & Kevin — Sunset Line"), text: tr("Janji di tebing Uluwatu pukul 17.40.", "Vows on the Uluwatu cliffs at 5:40pm.") }, { image: "photo-2", meta: "5:30 · Bandung", title: tr("Sekar & Daniel — Kabut Teh", "Sekar & Daniel — Tea Mist"), text: tr("Pernikahan 40 tamu di kebun teh.", "A 40-guest wedding in a tea garden.") }, { image: "photo-3", meta: "7:48 · Solo", title: tr("Ayu & Fajar — Dua Keraton", "Ayu & Fajar — Two Palaces"), text: tr("Perpaduan adat Solo dan Minang.", "A blend of Solo and Minang traditions.") }] }),
        timeline(L, { title: tr("Setelah hari-H", "After the wedding"), items: [[tr("Minggu 1", "Week 1"), tr("Sneak peek", "Sneak peek"), tr("30 foto pilihan & teaser 60 detik.", "30 selected photos & a 60-second teaser.")], [tr("Minggu 6", "Week 6"), tr("Galeri foto lengkap", "Full photo gallery"), tr("600–900 foto teredit.", "600–900 edited photos.")], [tr("Minggu 10", "Week 10"), tr("Film utama", "Feature film"), tr("5–10 menit, revisi 1×.", "5–10 minutes, 1 revision.")]], bg: L.alt }),
      ],
      packages: () => [
        priceCards(L, { ey: tr("Paket", "Packages"), title: tr("Paket 2027", "2027 packages"), text: tr("Transport & akomodasi di luar Bandung ditanggung klien.", "Travel & accommodation outside Bandung covered by the client."), bg: L.alt, plans: [{ plan: tr("Foto", "Photo"), price: "Rp14jt", period: tr("/hari", "/day"), desc: tr("1 fotografer utama + 1 pendamping.", "1 lead + 1 second photographer."), features: [tr("10 jam liputan", "10 hours coverage"), tr("600+ foto teredit", "600+ edited photos"), tr("Galeri online", "Online gallery")], btn: [tr("Pilih", "Choose"), href("booking")] }, { plan: tr("Foto + Film", "Photo + Film"), price: "Rp32jt", period: tr("/hari", "/day"), desc: tr("Tim 4 orang.", "Team of 4."), features: [tr("Semua di paket Foto", "Everything in Photo"), tr("Film 5–8 menit", "5–8 minute film"), tr("Teaser 60 detik", "60-second teaser"), tr("Drone", "Drone")], btn: [tr("Pilih", "Choose"), href("booking")], featured: true, badge: tr("Paling dipilih", "Most chosen") }, { plan: tr("Dokumenter", "Documentary"), price: "Rp55jt", period: tr("/2 hari", "/2 days"), desc: tr("Untuk adat 2 hari.", "For 2-day ceremonies."), features: [tr("Liputan 2 hari", "2-day coverage"), tr("Film 10–15 menit", "10–15 minute film"), tr("Album cetak 40 halaman", "40-page printed album")], btn: [tr("Pilih", "Choose"), href("booking")] }] }),
        accordionSec(L, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Berapa DP?", "How much is the deposit?"), tr("30% untuk mengunci tanggal, sisanya H-14.", "30% locks your date, the rest 14 days before.")], [tr("Bisa ke luar negeri?", "Do you travel abroad?"), tr("Bisa, sudah ke Singapura, Kyoto, dan Melbourne.", "Yes — we've shot in Singapore, Kyoto, and Melbourne.")], [tr("Musik di film?", "Music in the film?"), tr("Berlisensi dari Musicbed & Artlist.", "Licensed from Musicbed & Artlist.")]] }),
      ],
      booking: () => [
        formSec(L, { dark: true, bg: "#0c0a09", ey: "Booking", title: tr("Cek ketersediaan tanggal", "Check your date"), text: tr("Kami hanya mengambil 2 pernikahan per bulan.", "We only take 2 weddings a month."), info: [["Email", "hello@kinaraframes.example"], ["Instagram", "@kinaraframes"], [tr("Studio", "Studio"), "Jl. Dago Pojok 7, Bandung"]], fields: [{ k: "input", label: tr("Nama pasangan", "Couple's names"), ph: "Laras & Bima" }, { k: "date", label: tr("Tanggal pernikahan", "Wedding date") }, { k: "input", label: tr("Kota / venue", "City / venue"), ph: "Yogyakarta" }, { k: "select", label: tr("Paket", "Package"), ph: tr("Pilih", "Choose"), options: [tr("Foto", "Photo"), tr("Foto + Film", "Photo + Film"), tr("Dokumenter", "Documentary")] }], submit: tr("Kirim", "Send") }),
        gallery(L, { images: [["photo-1", "Laras & Bima"], ["photo-2", "Sekar & Daniel"], ["photo-4", "Nadya & Kevin"]], cols: 3, ratio: "3 / 4", bg: "#0c0a09", dark: true }),
      ],
    });
  },
};

/* -------------------- 23. tech-cybersecurity (PREMIUM, 8) ---------- */

const CB: Palette = { ink: "#0b1324", muted: "#475569", primary: "#06b6d4", primaryDark: "#0e7490", soft: "#ecfeff", line: "#a5f3fc" };
const cbL = look(CB, { font: FONTS.sans, hf: FONTS.mono, r: 8, dark: "#020617", alt: "#f1f5f9", onDark: "#94a3b8" });

export const techCybersecurity: TemplateContent = {
  brand: "Cakrabyte Security",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("pentest", "Uji Penetrasi", "Penetration Testing", "uji-penetrasi", "penetration-testing"),
    P("soc", "SOC 24/7", "24/7 SOC", "soc", "soc"),
    P("pricing", "Harga", "Pricing", "harga", "pricing"),
    P("compliance", "Kepatuhan", "Compliance", "kepatuhan", "compliance"),
    P("research", "Riset", "Research", "riset", "research"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = cbL;
    const head = withTopbar(header("cakrabyte_", CB, { bg: "#020617", ink: "#ffffff", font: FONTS.mono, cta: cta(tr("Lapor insiden", "Report incident"), href("contact"), CB) }), L, tr("Sedang diserang? Tim respons insiden siaga 24/7: +62 21 3000 911", "Under attack? Incident response on call 24/7: +62 21 3000 911"), { badge: "IR", bg: "#be123c" });
    const foot = footer("Cakrabyte Security", tr("Konsultan keamanan siber & Security Operations Center, Jakarta.", "Cybersecurity consultancy & Security Operations Center, Jakarta."), [{ title: tr("Layanan", "Services"), items: [tr("Uji penetrasi", "Pentesting"), "SOC 24/7", tr("Respons insiden", "Incident response")] }, { title: tr("Sertifikasi", "Certifications"), items: ["ISO 27001", "CREST (contoh)", "OSCP · OSCE"] }, { title: tr("Kontak", "Contact"), items: ["security@cakrabyte.example", "PGP: 0xC4K2 B7E1"] }], tr("© 2026 Cakrabyte Security. Data & klien fiktif.", "© 2026 Cakrabyte Security. Fictional data & clients."), "#020617");
    return render(L, key, head, foot, {
      home: () => [
        heroType(L, { dark: true, ey: "// security operations", prefix: tr("Kami melindungi", "We protect"), words: [tr("data nasabah", "customer data"), tr("aplikasi Anda", "your apps"), tr("infrastruktur cloud", "cloud infrastructure"), tr("reputasi Anda", "your reputation")], text: tr("Uji penetrasi, pemantauan SOC 24/7, dan respons insiden untuk bank, fintech, dan rumah sakit.", "Penetration testing, 24/7 SOC monitoring, and incident response for banks, fintechs, and hospitals."), btns: [[tr("Konsultasi", "Talk to us"), href("contact")], [tr("Lihat layanan", "See services"), href("services")]], image: "v2b-shield", alt: tr("Perisai keamanan", "Security shield"), size: 48 }),
        counters(L, [["2,4 M", tr("Event dianalisis/hari", "Events analyzed/day")], ["11 mnt", tr("Rata-rata waktu respons", "Mean time to respond")], ["640+", tr("Kerentanan kritis ditemukan", "Critical vulns found")], ["58", tr("Klien enterprise", "Enterprise clients")]], { dark: true, bg: "#0b1324" }),
        cards(L, { ey: tr("Layanan", "Services"), title: tr("Serang dulu, sebelum orang lain", "Attack first, before someone else does"), cols: 3, items: [{ icon: "⌁", title: tr("Uji penetrasi", "Penetration testing"), text: tr("Web, mobile, API, jaringan internal, dan cloud.", "Web, mobile, API, internal network, and cloud."), link: [tr("Detail", "Details"), href("pentest")] }, { icon: "◎", title: "SOC 24/7", text: tr("SIEM + analis manusia, laporan bulanan.", "SIEM + human analysts, monthly reports."), link: [tr("Detail", "Details"), href("soc")] }, { icon: "⚑", title: tr("Kepatuhan", "Compliance"), text: tr("ISO 27001, POJK 11/2022, PCI DSS.", "ISO 27001, OJK regulations, PCI DSS."), link: [tr("Detail", "Details"), href("compliance")] }] }),
        logos(L, { title: tr("Mengamankan", "Securing"), names: ["Bank Arunika", "Medika Group", "PayLokal", "Logistik Raya", "Asuransi Teduh"], bg: L.alt }),
        ctaSplit(L, { title: tr("Uji gratis 1 aplikasi web", "Free test of 1 web app"), text: tr("Untuk perusahaan baru, laporan dalam 10 hari kerja.", "For new clients, report within 10 business days."), btns: [[tr("Ajukan", "Apply"), href("contact")]], bg: "#0e7490" }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Siklus keamanan lengkap", "The full security lifecycle"), dark: true, image: "v2b-shield" }),
        steps(L, { title: tr("Identifikasi → Lindungi → Deteksi → Respons", "Identify → Protect → Detect → Respond"), items: [[tr("Identifikasi", "Identify"), tr("Pemetaan aset & risiko.", "Asset & risk mapping.")], [tr("Lindungi", "Protect"), tr("Hardening & pelatihan staf.", "Hardening & staff training.")], [tr("Deteksi", "Detect"), tr("SOC & threat hunting.", "SOC & threat hunting.")], [tr("Respons", "Respond"), tr("Forensik & pemulihan.", "Forensics & recovery.")]] }),
        cards(L, { cols: 4, style: "line", bg: L.alt, items: [{ title: tr("Phishing simulasi", "Phishing simulation"), text: tr("Kampanye bulanan & modul belajar.", "Monthly campaigns & training modules.") }, { title: "Red team", text: tr("Simulasi penyerang nyata 4–8 minggu.", "4–8 week real-adversary simulation.") }, { title: tr("Audit cloud", "Cloud audit"), text: "AWS, GCP, Azure, Alibaba Cloud." }, { title: tr("Forensik digital", "Digital forensics"), text: tr("Bukti siap untuk proses hukum.", "Court-ready evidence.") }] }),
      ],
      pentest: () => [
        pageHead(L, { ey: tr("Uji penetrasi", "Penetration testing"), title: tr("Ditulis untuk developer, bukan hanya auditor", "Written for developers, not just auditors"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Layanan", "Services"), href("services")], [tr("Uji penetrasi", "Pentesting"), ""]] }),
        tabsSec(L, { title: tr("Cakupan", "Scope"), tabs: [["Web & API", tr("OWASP Top 10 & API Top 10, autentikasi, logika bisnis, race condition.", "OWASP Top 10 & API Top 10, auth, business logic, race conditions.")], ["Mobile", tr("Android & iOS: penyimpanan lokal, SSL pinning, reverse engineering.", "Android & iOS: local storage, SSL pinning, reverse engineering.")], [tr("Jaringan", "Network"), tr("Eksternal & internal, Active Directory, segmentasi.", "External & internal, Active Directory, segmentation.")], ["Cloud", tr("IAM, bucket publik, konfigurasi Kubernetes.", "IAM, public buckets, Kubernetes configs.")]] }),
        tableSec(L, { title: tr("Contoh temuan (anonim)", "Sample findings (anonymized)"), columns: ["ID", tr("Temuan", "Finding"), tr("Tingkat", "Severity"), "CVSS"], rows: [["CB-0412", tr("IDOR pada endpoint mutasi rekening", "IDOR on account statement endpoint"), tr("Kritis", "Critical"), "9.1"], ["CB-0418", tr("JWT tanpa validasi algoritma", "JWT without algorithm validation"), tr("Tinggi", "High"), "8.2"], ["CB-0421", tr("Rate limit OTP tidak ada", "No OTP rate limit"), tr("Tinggi", "High"), "7.5"], ["CB-0430", tr("Header keamanan hilang", "Missing security headers"), tr("Rendah", "Low"), "3.1"]], bg: L.alt }),
      ],
      soc: () => [
        pageHead(L, { ey: "SOC 24/7", title: tr("Mata yang tidak pernah tidur", "Eyes that never sleep"), dark: true }),
        counters(L, [["24/7", tr("Pemantauan", "Monitoring")], ["15 mnt", tr("SLA eskalasi kritis", "Critical escalation SLA")], ["38", tr("Analis", "Analysts")], ["99,95%", tr("Uptime platform", "Platform uptime")]]),
        tableSec(L, { title: tr("Tingkat layanan", "Service levels"), columns: [tr("Prioritas", "Priority"), tr("Contoh", "Example"), tr("Respons", "Response"), tr("Eskalasi", "Escalation")], rows: [["P1", tr("Ransomware aktif", "Active ransomware"), "15 " + tr("menit", "min"), tr("Telepon + IR", "Phone + IR")], ["P2", tr("Akun admin disusupi", "Compromised admin account"), "30 " + tr("menit", "min"), tr("Telepon", "Phone")], ["P3", tr("Malware terkarantina", "Quarantined malware"), "4 " + tr("jam", "hrs"), "Email"], ["P4", tr("Pemindaian port", "Port scanning"), "24 " + tr("jam", "hrs"), tr("Laporan", "Report")]], bg: L.alt }),
      ],
      pricing: () => [
        pricingCards(L.t, tr, { eyebrow: tr("Harga", "Pricing"), title: tr("Mulai dari yang paling penting", "Start with what matters most"), text: tr("Harga per tahun, belum termasuk PPN.", "Annual pricing, excluding VAT."), badge: tr("Direkomendasikan", "Recommended"), plans: [{ name: tr("Uji Penetrasi", "Pentest"), price: "Rp85jt", period: tr("/proyek", "/project"), text: tr("1 aplikasi web + API.", "1 web app + API."), features: [tr("10 hari kerja", "10 business days"), tr("Retest gratis", "Free retest"), tr("Laporan eksekutif & teknis", "Executive & technical report")], cta: { label: tr("Ajukan", "Request"), href: href("contact") } }, { name: "SOC Essentials", price: "Rp45jt", period: tr("/bulan", "/month"), text: tr("Hingga 500 endpoint.", "Up to 500 endpoints."), features: [tr("SIEM terkelola", "Managed SIEM"), tr("Pemantauan 24/7", "24/7 monitoring"), tr("IR 40 jam/tahun", "40 IR hours/year")], cta: { label: tr("Mulai", "Start"), href: href("contact") }, featured: true }, { name: "Enterprise", price: tr("Kustom", "Custom"), period: "", text: tr("Bank & BUMN.", "Banks & SOEs."), features: [tr("Red team tahunan", "Annual red team"), tr("CISO virtual", "Virtual CISO"), tr("Analis on-site", "On-site analysts")], cta: { label: tr("Hubungi kami", "Contact us"), href: href("contact") } }] }),
        faqAccordion(L.t, tr, { items: [[tr("Apakah ada NDA?", "Is there an NDA?"), tr("Ya, ditandatangani sebelum diskusi teknis.", "Yes, signed before any technical discussion.")], [tr("Pengujian di produksi?", "Testing in production?"), tr("Bisa, dengan jendela waktu yang disepakati.", "Yes, within an agreed time window.")]] }),
      ],
      compliance: () => [
        pageHead(L, { ey: tr("Kepatuhan", "Compliance"), title: tr("Siap audit tanpa begadang", "Audit-ready without all-nighters"), center: true }),
        compareSec(L, { title: tr("Kerangka yang kami dampingi", "Frameworks we support"), columns: ["ISO 27001", "PCI DSS 4.0", tr("POJK 11/2022", "OJK 11/2022")], rows: [tr("Analisis kesenjangan | ya | ya | ya", "Gap analysis | yes | yes | yes"), tr("Penyusunan kebijakan | ya | ya | ya", "Policy drafting | yes | yes | yes"), tr("Uji penetrasi wajib | tidak | ya | ya", "Mandatory pentest | no | yes | yes"), tr("Pendampingan audit | ya | ya | tidak", "Audit accompaniment | yes | yes | no"), tr("Durasi rata-rata | 6 bulan | 4 bulan | 3 bulan", "Typical duration | 6 months | 4 months | 3 months")], highlight: 3 }),
      ],
      research: () => [
        pageHead(L, { ey: tr("Riset", "Research"), title: tr("Advisori & laporan ancaman", "Advisories & threat reports"), dark: true }),
        rowsList(L, { title: tr("Publikasi terbaru", "Latest publications"), items: [{ meta: tr("Advisori · 9 Okt 2026", "Advisory · Oct 9, 2026"), title: tr("Kampanye phishing ‘Tagihan PLN’ menyasar UMKM", "‘Electricity bill’ phishing campaign targets SMEs"), text: tr("IoC dan aturan deteksi tersedia.", "IoCs and detection rules included."), link: [tr("Baca", "Read"), "#advisori-1"] }, { meta: tr("Laporan · Sep 2026", "Report · Sep 2026"), title: tr("Lanskap ransomware Indonesia Q3 2026", "Indonesia ransomware landscape Q3 2026"), text: tr("38 insiden, sektor kesehatan paling terdampak.", "38 incidents, healthcare hit hardest."), link: [tr("Unduh", "Download"), "#laporan-q3"] }, { meta: tr("Blog · Agu 2026", "Blog · Aug 2026"), title: tr("Kenapa OTP via SMS sudah tidak cukup", "Why SMS OTP is no longer enough"), text: tr("Studi kasus SIM swap.", "A SIM swap case study."), link: [tr("Baca", "Read"), "#blog-otp"] }] }),
        imgCards(L, { cols: 3, bg: L.alt, items: [{ image: "v2b-shield", meta: "CVE-2026-31337", title: tr("Kerentanan di plugin pembayaran", "Payment plugin vulnerability"), text: tr("Dilaporkan secara bertanggung jawab.", "Responsibly disclosed.") }, { image: "v2b-chart-dark", meta: tr("Data", "Data"), title: tr("Statistik serangan 2026", "2026 attack statistics"), text: tr("Dari 2,4 miliar event/hari.", "From 2.4 billion events/day.") }, { image: "tech-code", meta: "Open source", title: tr("Aturan Sigma lokal", "Local Sigma rules"), text: tr("120 aturan untuk ancaman lokal.", "120 rules for local threats.") }] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Bicara dengan engineer, bukan sales", "Talk to an engineer, not sales"), text: tr("Untuk insiden aktif, telepon hotline 24/7.", "For active incidents, call the 24/7 hotline."), info: [[tr("Hotline insiden", "Incident hotline"), "+62 21 3000 911"], ["Email", "security@cakrabyte.example"], [tr("Kantor", "Office"), "Gedung Cyber 2, Lt. 9, Jakarta"]], fields: [{ k: "input", label: tr("Perusahaan", "Company"), ph: "PT Contoh Finansial" }, { k: "select", label: tr("Kebutuhan", "Need"), ph: tr("Pilih", "Choose"), options: [tr("Uji penetrasi", "Penetration test"), "SOC 24/7", tr("Kepatuhan", "Compliance"), tr("Insiden aktif", "Active incident")] }, { k: "input", label: "Email", ph: "ciso@perusahaan.com", type: "email" }, { k: "check", label: tr("Kirim NDA terlebih dahulu", "Send an NDA first") }], submit: tr("Kirim", "Send"), dark: true, bg: "#020617" }),
      ],
    });
  },
};

/* ------------------ 24. professional-notary (PREMIUM, 4) ----------- */

const LH: Palette = { ink: "#2b1414", muted: "#5e4646", primary: "#7f1d1d", primaryDark: "#651717", soft: "#fbf6ef", line: "#e8d8c4" };
const lhL = look(LH, { font: FONTS.serif, r: 2, dark: "#2b1414", alt: "#fbf6ef", bg: "#fffdf9", onDark: "#e8d8c4" });

export const professionalNotary: TemplateContent = {
  brand: "Notaris Larasati Hadiningrat",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan & Biaya", "Services & Fees", "layanan", "services"),
    P("profile", "Profil", "Profile", "profil", "profile"),
    P("appointment", "Janji Temu", "Appointment", "janji-temu", "appointment"),
  ],
  build: (key, tr, href) => {
    const L = lhL;
    const head = header("Larasati Hadiningrat, S.H., M.Kn.", LH, { font: FONTS.serif, bg: "#fffdf9", cta: cta(tr("Buat janji", "Book"), href("appointment"), LH) });
    const foot = footer(tr("Notaris & PPAT Larasati Hadiningrat", "Notary & Land Deed Official Larasati Hadiningrat"), tr("Notaris di Kota Malang · PPAT wilayah Kota Malang & Kab. Malang.", "Notary in Malang City · Land deed official for Malang City & Regency."), [{ title: tr("Kantor", "Office"), items: ["Jl. Kawi 34, Malang", tr("Sen–Jum 08.00–16.00", "Mon–Fri 8am–4pm")] }, { title: tr("Kontak", "Contact"), items: ["(0341) 360 034", "kantor@notarislarasati.example"] }], tr("© 2026 Kantor Notaris Larasati Hadiningrat. Konten contoh, bukan nasihat hukum.", "© 2026 Larasati Hadiningrat Notary Office. Sample content, not legal advice."), "#2b1414");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { ey: tr("Notaris & PPAT · Malang", "Notary & land deed official · Malang"), title: tr("Akta yang jelas, proses yang dijelaskan", "Clear deeds, explained step by step"), text: tr("Pendirian PT & CV, jual beli tanah, waris, dan perjanjian — dengan estimasi biaya tertulis sebelum mulai.", "Company formation, land sales, inheritance, and agreements — with a written fee estimate before we begin."), btns: [[tr("Buat janji", "Book an appointment"), href("appointment")], [tr("Lihat biaya", "See fees"), href("services")]], image: "v2b-deed", alt: tr("Akta bermeterai", "Sealed deed"), bg: LH.soft }),
        servicesSplit(L.t, tr, { eyebrow: tr("Layanan utama", "Core services"), title: tr("Tiga hal yang paling sering kami tangani", "The three things we handle most"), image: asset("v2b-deed"), items: [{ icon: "§", title: tr("Badan usaha", "Business entities"), text: tr("PT perorangan, PT, CV, yayasan, koperasi.", "Sole PT, PT, CV, foundations, cooperatives.") }, { icon: "¶", title: tr("Pertanahan (PPAT)", "Land (PPAT)"), text: tr("AJB, hibah, APHB, roya, balik nama.", "Sale deeds, gifts, partitions, mortgage release, title transfer.") }, { icon: "†", title: tr("Waris & wasiat", "Inheritance & wills"), text: tr("Surat keterangan waris, akta wasiat.", "Inheritance certificates, wills.") }], cta: { label: tr("Biaya lengkap", "Full fees"), href: href("services") } }),
        steps(L, { title: tr("Alur pengurusan akta", "How a deed is made"), items: [[tr("Konsultasi", "Consultation"), tr("Gratis 30 menit.", "Free 30 minutes.")], [tr("Dokumen", "Documents"), tr("Daftar periksa tertulis.", "Written checklist.")], [tr("Penandatanganan", "Signing"), tr("Dibacakan di hadapan notaris.", "Read aloud before the notary.")], [tr("Salinan akta", "Deed copies"), tr("3–14 hari kerja.", "3–14 business days.")]], bg: L.alt }),
        quote(L, { text: tr("Klien berhak memahami setiap pasal yang ia tandatangani.", "Clients deserve to understand every clause they sign."), name: "Larasati Hadiningrat, S.H., M.Kn.", role: tr("Notaris & PPAT", "Notary & PPAT") }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan & biaya", "Services & fees"), title: tr("Biaya transparan", "Transparent fees"), text: tr("Belum termasuk PNBP, BPHTB, dan PPh yang dibayarkan ke negara.", "Excludes state fees, land acquisition tax, and income tax paid to the state."), dark: true }),
        priceList(L, { title: tr("Estimasi honorarium", "Fee estimates"), groups: [{ name: tr("Badan usaha", "Business entities"), items: [[tr("Pendirian PT", "PT formation"), tr("termasuk SK Kemenkumham & NIB", "incl. ministry approval & business ID"), "Rp6,5jt"], [tr("Pendirian CV", "CV formation"), tr("termasuk NIB", "incl. business ID"), "Rp3,5jt"], [tr("Perubahan anggaran dasar", "Articles amendment"), "", "Rp3jt"]] }, { name: tr("Pertanahan", "Land"), items: [[tr("Akta jual beli (AJB)", "Sale deed (AJB)"), tr("1% nilai transaksi, min.", "1% of value, min."), "Rp5jt"], [tr("Hibah", "Gift deed"), tr("min.", "min."), "Rp4jt"], [tr("Roya", "Mortgage release"), "", "Rp1,5jt"]] }] }),
        tableSec(L, { title: tr("Dokumen yang perlu disiapkan", "Documents to prepare"), columns: [tr("Layanan", "Service"), tr("Dokumen", "Documents"), tr("Lama proses", "Processing time")], rows: [[tr("Pendirian PT", "PT formation"), tr("KTP & NPWP pendiri, nama PT (3 opsi), alamat domisili", "Founders' ID & tax no., 3 name options, registered address"), tr("3–5 hari kerja", "3–5 business days")], ["AJB", tr("Sertifikat asli, PBB 5 tahun, KTP/KK penjual & pembeli", "Original certificate, 5 years of property tax, IDs of both parties"), tr("7–14 hari kerja", "7–14 business days")], [tr("Keterangan waris", "Inheritance certificate"), tr("Akta kematian, KK, akta lahir ahli waris", "Death certificate, family card, heirs' birth certificates"), tr("5–7 hari kerja", "5–7 business days")]], bg: L.alt }),
      ],
      profile: () => [
        split(L, { ey: tr("Profil", "Profile"), title: "Larasati Hadiningrat, S.H., M.Kn.", paras: [tr("Diangkat sebagai notaris pada 2011 dan PPAT pada 2013. Lulusan Magister Kenotariatan Universitas Brawijaya.", "Appointed notary in 2011 and PPAT in 2013. Master of Notarial Law, Brawijaya University."), tr("Telah membuat lebih dari 9.000 akta, termasuk untuk 400+ UMKM dan koperasi di Malang Raya.", "Has drawn up over 9,000 deeds, including for 400+ SMEs and cooperatives in Greater Malang.")], bullets: [tr("Anggota Ikatan Notaris Indonesia (INI)", "Member, Indonesian Notary Association"), tr("Anggota IPPAT", "Member, Land Deed Officials Association"), tr("Pengajar tamu FH Universitas Brawijaya", "Guest lecturer, Brawijaya Law School")], image: "v2b-face-6", alt: "Larasati Hadiningrat", ratio: "4 / 5" }),
        teamCards(L.t, tr, { eyebrow: tr("Staf", "Staff"), title: tr("Tim kantor", "Office team"), members: [{ name: "Rahmat Hidayat, S.H.", role: tr("Kepala staf akta", "Head deed clerk"), photo: asset("v2b-face-5") }, { name: "Dyah Ayu, S.H.", role: tr("Staf pertanahan", "Land affairs clerk"), photo: asset("v2b-face-2") }, { name: "Bagus Wicaksono", role: tr("Staf badan usaha", "Corporate clerk"), photo: asset("v2b-face-1") }] }),
      ],
      appointment: () => [
        formSec(L, { ey: tr("Janji temu", "Appointment"), title: tr("Jadwalkan konsultasi", "Schedule a consultation"), text: tr("Konsultasi awal 30 menit tanpa biaya, di kantor atau video call.", "A free 30-minute initial consultation, in office or by video call."), info: [[tr("Alamat", "Address"), "Jl. Kawi 34, Malang"], [tr("Telepon", "Phone"), "(0341) 360 034"], [tr("Jam", "Hours"), tr("Sen–Jum 08.00–16.00, Sab dengan janji", "Mon–Fri 8am–4pm, Sat by appointment")]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { k: "select", label: tr("Keperluan", "Matter"), ph: tr("Pilih", "Choose"), options: [tr("Pendirian badan usaha", "Business formation"), tr("Jual beli tanah", "Land sale"), tr("Waris", "Inheritance"), tr("Perjanjian", "Agreement")] }, { k: "date", label: tr("Jadwal", "Date & time"), mode: "datetime-local" }, { k: "check", label: tr("Saya lebih suka video call", "I prefer a video call") }], submit: tr("Ajukan janji", "Request appointment") }),
        infoBar(L, [[tr("Parkir", "Parking"), tr("Halaman kantor", "Office yard")], [tr("Bahasa", "Languages"), tr("Indonesia, Inggris, Jawa", "Indonesian, English, Javanese")], [tr("Pembayaran", "Payment"), tr("Transfer & QRIS", "Transfer & QRIS")]]),
      ],
    });
  },
};

/* ------------------- 25. community-coworking (PREMIUM, 6) ---------- */

const SK: Palette = { ink: "#1f2a24", muted: "#55625a", primary: "#c2562e", primaryDark: "#9c4322", soft: "#fbefe8", line: "#f2cdbb" };
const skL = look(SK, { font: FONTS.grotesk, r: 16, dark: "#1f2a24", alt: "#f4f6f2", onDark: "#c9d6cc" });

export const communityCoworking: TemplateContent = {
  brand: "Serambi Kolektif",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("spaces", "Ruang", "Spaces", "ruang", "spaces"),
    P("membership", "Keanggotaan", "Membership", "keanggotaan", "membership"),
    P("events", "Acara", "Events", "acara", "events"),
    P("community", "Komunitas", "Community", "komunitas", "community"),
    P("visit", "Kunjungi", "Visit", "kunjungi", "visit"),
  ],
  build: (key, tr, href) => {
    const L = skL;
    const head = header("serambi.", SK, { font: FONTS.grotesk, cta: cta(tr("Coba 1 hari gratis", "Free day pass"), href("visit"), SK) });
    const foot = footerSlim(L, "serambi.", [[tr("Ruang", "Spaces"), href("spaces")], [tr("Keanggotaan", "Membership"), href("membership")], [tr("Acara", "Events"), href("events")], [tr("Kunjungi", "Visit"), href("visit")]], tr("© 2026 Serambi Kolektif · Yogyakarta. Harga contoh.", "© 2026 Serambi Kolektif · Yogyakarta. Sample prices."));
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { badge: tr("Kotabaru · Yogyakarta", "Kotabaru · Yogyakarta"), title: tr("Ruang kerja bersama yang terasa seperti serambi rumah", "A coworking space that feels like a front porch"), text: tr("Meja fleksibel, ruang rapat, dapur bersama, dan 1.200 anggota yang suka saling bantu.", "Flexible desks, meeting rooms, a shared kitchen, and 1,200 members who like helping each other."), btns: [[tr("Coba gratis", "Try it free"), href("visit")], [tr("Lihat harga", "See pricing"), href("membership")]], image: "v2b-desk", alt: tr("Meja kerja", "Workspace"), gradient: [SK.soft, "#f4f6f2", 150] }),
        statsBand(L.t, tr, { eyebrow: tr("Serambi dalam angka", "Serambi in numbers"), title: tr("Komunitas, bukan sekadar Wi-Fi cepat", "A community, not just fast Wi-Fi"), text: tr("Meski Wi-Fi kami memang cepat: 1 Gbps.", "Though our Wi-Fi is fast: 1 Gbps."), stats: [["1.200", tr("Anggota", "Members")], ["96", tr("Acara per tahun", "Events per year")], ["3", tr("Lantai", "Floors")], ["24/7", tr("Akses anggota tetap", "Resident access")]] }),
        imgCards(L, { ey: tr("Ruang", "Spaces"), title: tr("Pilih tempat kerjamu", "Pick your spot"), items: [{ image: "v2b-desk", title: "Hot desk", text: tr("Duduk di mana saja di lantai 1–2.", "Sit anywhere on floors 1–2."), link: [tr("Detail", "Details"), href("spaces")] }, { image: "v2b-room-2", title: tr("Meja tetap", "Dedicated desk"), text: tr("Meja & loker milikmu sendiri.", "Your own desk & locker."), link: [tr("Detail", "Details"), href("spaces")] }, { image: "v2b-room", title: tr("Ruang tim", "Team room"), text: tr("4–10 orang, terkunci.", "4–10 people, lockable."), link: [tr("Detail", "Details"), href("spaces")] }] }),
        testimonialsWall(L.t, tr, { title: tr("Kata anggota", "Members say"), score: 4.9, caption: tr("dari 640 ulasan", "from 640 reviews"), quotes: [{ text: tr("Klien pertama saya justru datang dari obrolan di dapur Serambi.", "My first client came from a chat in the Serambi kitchen."), name: "Fadli Rahman", role: tr("Ilustrator lepas", "Freelance illustrator"), avatar: asset("v2b-face-1") }, { text: tr("Startup kami tumbuh dari 2 ke 14 orang tanpa pindah gedung.", "Our startup grew from 2 to 14 people without moving buildings."), name: "Grace Natalia", role: tr("Pendiri, Tanibox", "Founder, Tanibox"), avatar: asset("v2b-face-2") }, { text: tr("Kelas sore dan potluck Jumat bikin betah.", "Afternoon classes and Friday potlucks keep me here."), name: "Rio Saputra", role: tr("Pengembang web", "Web developer"), avatar: asset("v2b-face-3") }] }),
      ],
      spaces: () => [
        pageHead(L, { ey: tr("Ruang", "Spaces"), title: tr("Tiga lantai, satu atap joglo", "Three floors under one joglo roof"), image: "v2b-room-2" }),
        compareSec(L, { title: tr("Bandingkan ruang", "Compare spaces"), columns: ["Hot desk", tr("Meja tetap", "Dedicated desk"), tr("Ruang tim", "Team room")], rows: [tr("Akses | 08.00–22.00 | 24/7 | 24/7", "Access | 8am–10pm | 24/7 | 24/7"), tr("Loker | tidak | ya | ya", "Locker | no | yes | yes"), tr("Alamat bisnis | tidak | ya | ya", "Business address | no | yes | yes"), tr("Kredit ruang rapat | 2 jam | 6 jam | 15 jam", "Meeting room credits | 2 hrs | 6 hrs | 15 hrs"), tr("Ruang terkunci | tidak | tidak | ya", "Lockable room | no | no | yes")], highlight: 2 }),
        gallery(L, { images: [["v2b-desk", tr("Lantai 1", "Floor 1")], ["v2b-room-2", tr("Ruang tenang", "Quiet room")], ["v2b-room", tr("Ruang tim", "Team room")], ["community-people", tr("Dapur bersama", "Shared kitchen")]], cols: 4, bg: L.alt }),
      ],
      membership: () => [
        priceSwitch(L, { ey: tr("Keanggotaan", "Membership"), title: tr("Harga yang masuk akal untuk pekerja lepas", "Prices that make sense for freelancers"), text: tr("Hari pertama gratis. Tanpa kontrak untuk paket bulanan.", "First day free. No contract for monthly plans."), monthly: tr("Bulanan", "Monthly"), yearly: tr("Tahunan", "Yearly"), save: tr("Hemat 15%", "Save 15%"), pm: tr("/bulan", "/month"), py: tr("/tahun", "/year"), href: href("visit"), plans: [tr("Hot desk | Rp650rb | Rp6,6jt | Akses 08.00–22.00; Kopi & teh gratis; 2 jam ruang rapat | Gabung", "Hot desk | Rp650k | Rp6.6m | 8am–10pm access; Free coffee & tea; 2 hrs meeting room | Join"), tr("Meja tetap | Rp1,3jt | Rp13,3jt | Akses 24/7; Loker; Alamat bisnis; 6 jam ruang rapat | Gabung", "Dedicated desk | Rp1.3m | Rp13.3m | 24/7 access; Locker; Business address; 6 hrs meeting room | Join"), tr("Ruang tim | Rp6,5jt | Rp66jt | 4–6 orang; Ruang terkunci; 15 jam ruang rapat | Hubungi kami", "Team room | Rp6.5m | Rp66m | 4–6 people; Lockable room; 15 hrs meeting room | Contact us")] }),
        priceList(L, { title: tr("Harian & ruang rapat", "Day passes & meeting rooms"), bg: L.alt, groups: [{ name: tr("Harian", "Day passes"), items: [[tr("Day pass", "Day pass"), "08.00–22.00", "Rp60rb"], [tr("10 day pass", "10-day pack"), tr("berlaku 2 bulan", "valid 2 months"), "Rp500rb"]] }, { name: tr("Ruang rapat", "Meeting rooms"), items: [["Ruang Pendopo", tr("12 orang · per jam", "12 people · per hour"), "Rp150rb"], ["Ruang Gandok", tr("6 orang · per jam", "6 people · per hour"), "Rp90rb"]] }] }),
      ],
      events: () => [
        countdownSec(L, { ey: tr("Acara berikutnya", "Next event"), title: tr("Serambi Demo Night #31", "Serambi Demo Night #31"), text: tr("Kamis, 19 November 2026 · 19.00 · 8 startup lokal pamer produk, terbuka untuk umum.", "Thursday, November 19, 2026 · 7pm · 8 local startups demo their products, open to the public."), target: "2026-11-19T19:00", done: tr("Acara sedang berlangsung!", "Happening now!"), btn: [tr("Daftar hadir", "RSVP"), href("visit")] }),
        rowsList(L, { title: tr("Agenda bulan ini", "This month's agenda"), items: [{ meta: tr("Setiap Jumat · 17.00", "Every Friday · 5pm"), title: tr("Potluck Jumat", "Friday Potluck"), text: tr("Bawa satu makanan, pulang dengan teman baru.", "Bring a dish, leave with new friends."), link: [tr("Info", "Info"), "#potluck"] }, { meta: tr("Rabu, 11 Nov · 16.00", "Wed, Nov 11 · 4pm"), title: tr("Kelas: Pajak untuk pekerja lepas", "Class: Taxes for freelancers"), text: tr("Bersama konsultan pajak, gratis untuk anggota.", "With a tax advisor, free for members."), link: [tr("Daftar", "Register"), href("visit")] }, { meta: tr("Sabtu, 28 Nov · 09.00", "Sat, Nov 28 · 9am"), title: tr("Hackathon Budaya Jogja", "Jogja Culture Hackathon"), text: tr("24 jam membangun aplikasi untuk museum.", "24 hours building apps for museums."), link: [tr("Daftar", "Register"), href("visit")] }] }),
      ],
      community: () => [
        pageHead(L, { ey: tr("Komunitas", "Community"), title: tr("Siapa saja yang bekerja di Serambi", "Who works at Serambi"), center: true }),
        cards(L, { cols: 4, style: "plain", items: [{ icon: "🎨", title: tr("Kreatif", "Creatives"), text: tr("34% anggota: desainer, ilustrator, penulis.", "34%: designers, illustrators, writers.") }, { icon: "💻", title: tr("Teknologi", "Tech"), text: tr("29%: developer & startup.", "29%: developers & startups.") }, { icon: "📈", title: tr("Bisnis", "Business"), text: tr("21%: konsultan & UMKM.", "21%: consultants & SMEs.") }, { icon: "🎓", title: tr("Peneliti", "Researchers"), text: tr("16%: akademisi & mahasiswa S2/S3.", "16%: academics & grad students.") }] }),
        logos(L, { title: tr("Startup yang lahir di sini", "Startups born here"), names: ["Tanibox", "Lapak Batik", "Rutekita", "Belajarin", "Kopi Kawan"], bg: L.alt }),
        ctaSplit(L, { title: tr("Mau mengisi kelas atau acara?", "Want to host a class or event?"), text: tr("Ruang Pendopo gratis untuk acara komunitas nonkomersial.", "The Pendopo room is free for non-commercial community events."), btns: [[tr("Ajukan acara", "Propose an event"), href("visit")]] }),
      ],
      visit: () => [
        formSec(L, { ey: tr("Kunjungi", "Visit"), title: tr("Klaim day pass gratis", "Claim your free day pass"), info: [[tr("Alamat", "Address"), "Jl. Suroto 12, Kotabaru, Yogyakarta"], [tr("Jam", "Hours"), tr("Setiap hari 08.00–22.00", "Daily 8am–10pm")], ["WhatsApp", "+62 811 2626 1212"]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { k: "input", label: "Email", ph: "nama@email.com", type: "email" }, { k: "date", label: tr("Tanggal datang", "Visit date") }, { k: "select", label: tr("Tertarik dengan", "Interested in"), ph: tr("Pilih", "Choose"), options: ["Hot desk", tr("Meja tetap", "Dedicated desk"), tr("Ruang tim", "Team room"), tr("Ruang acara", "Event space")] }], submit: tr("Klaim", "Claim") }),
        infoBar(L, [[tr("Parkir", "Parking"), tr("Motor gratis", "Free for bikes")], [tr("Transportasi", "Transit"), tr("Halte Trans Jogja 150 m", "Trans Jogja stop 150 m")], [tr("Hewan", "Pets"), tr("Kucing kantor: Kopi", "Office cat: Kopi")]]),
      ],
    });
  },
};
