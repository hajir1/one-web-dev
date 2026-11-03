import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { portfolioMosaic, statsBand, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  cardsD,
  chartDuo,
  chartPanel,
  compareD,
  countdownD,
  ctaD,
  faqD,
  footerD,
  formD,
  fullHeader,
  fullImage,
  fullSplit,
  galleryLb,
  headerD,
  home,
  kpiStrip,
  locations,
  lookD,
  marqueeD,
  notes,
  offer,
  pageHead,
  pg,
  plansD,
  pro,
  quotesD,
  rail,
  render,
  sliderD,
  specialty,
  specs,
  tableD,
  timelineD,
  typerD,
  withFx,
} from "./kitF";

/* ================================================================== */
/* Template v5 F8–F10: Museum, Aplikasi dompet digital, Agrowisata.      */
/* ================================================================== */

/* ------------- 8. Museum Lini Masa — museum (6 hlm, Premium) ------------- */
// Premium: slider, gallery-lightbox, modal popup, back-to-top, portfolio-mosaic (preset Pro). Library: AOS + Animate.

const MP: Palette = { ink: "#1f1a14", muted: "#5c5246", primary: "#b45309", primaryDark: "#78350f", soft: "#fef3c7", line: "#e7d9c3" };
const M = lookD(MP, { head: "DM Serif Display", body: "Work Sans", shape: "editorial", radius: 2, bg: "#fdfbf6", alt: "#f5efe3", inv: "#1f1a14", fx: { aos: "fade-up", animate: "fadeIn" } });

const mFoot = (tr: Tr) =>
  footerD("Museum Lini Masa", M, {
    variant: "columns",
    about: tr("Museum sejarah kota Semarang di bekas gedung kantor dagang tahun 1910.", "Semarang's city history museum, in a 1910 trading-house building."),
    cols: [
      { title: tr("Jam buka", "Opening hours"), items: [tr("Selasa–Minggu 09.00–17.00", "Tue–Sun 9am–5pm"), tr("Senin tutup", "Closed Mondays")] },
      { title: tr("Alamat", "Address"), items: ["Jl. Letjen Suprapto 31, Kota Lama", "024 355 1910"] },
    ],
    social: ["Instagram | https://instagram.com/museumlinimasa", "YouTube | https://youtube.com/@museumlinimasa"],
    copy: tr("© 2026 Museum Lini Masa. Konten contoh.", "© 2026 Lini Masa Museum. Sample content."),
    extra: [backTop(M, tr("Ke atas", "Back to top"))],
  });

export const museumLiniMasa: TemplateContent = {
  brand: "Museum Lini Masa",
  pages: [
    home(),
    pg("collections", ["koleksi", "Koleksi"], ["collections", "Collections"]),
    pg("exhibitions", ["pameran", "Pameran"], ["exhibitions", "Exhibitions"]),
    pg("learning", ["edukasi", "Edukasi"], ["learning", "Learning"]),
    pg("membership", ["sahabat-museum", "Sahabat Museum"], ["membership", "Membership"]),
    pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"]),
  ],
  build: (key, tr, href) =>
    render(M, key, headerD("Lini Masa", M, { variant: "center", cta: [tr("Beli tiket", "Buy tickets"), href("visit")] }), mFoot(tr), {
      home: () => [
        fullHeader(M, {
          eyebrow: tr("Museum sejarah kota", "City history museum"),
          title: tr("Seratus tahun Semarang dalam satu gedung", "A hundred years of Semarang in one building"),
          text: tr("2.400 koleksi, dari peta pelabuhan 1890 sampai radio pertama di kota ini.", "2,400 objects, from 1890 harbour maps to the city's first radio."),
          image: asset("v5f-museum-dusk"),
          size: 66,
          actions: [[tr("Rencanakan kunjungan", "Plan your visit"), href("visit"), "light"], [tr("Pameran", "Exhibitions"), href("exhibitions"), "dark"]],
        }),
        specialty(M, {
          side: { title: tr("Hari ini", "Today"), items: [tr("Buka 09.00–17.00", "Open 9am–5pm"), tr("Tur berpemandu 10.00 & 14.00", "Guided tours 10am & 2pm"), tr("Tiket dewasa Rp20.000", "Adult ticket Rp20,000")], action: [tr("Beli tiket", "Buy tickets"), href("visit")], inv: true },
          eyebrow: tr("Jelajahi", "Explore"),
          title: tr("Empat lantai, empat zaman", "Four floors, four eras"),
          items: [
            { icon: "Ⅰ", title: tr("Kota pelabuhan", "Port city"), text: tr("Perdagangan rempah dan kapal uap.", "Spice trade and steamships.") },
            { icon: "Ⅱ", title: tr("Kota Lama", "Old Town"), text: tr("Arsitektur dan kehidupan 1900-an.", "Architecture and life in the 1900s.") },
            { icon: "Ⅲ", title: tr("Masa perjuangan", "Independence era"), text: tr("Arsip pertempuran lima hari.", "Archives of the five-day battle.") },
            { icon: "Ⅳ", title: tr("Kota modern", "Modern city"), text: tr("Radio, bioskop, dan pasar.", "Radio, cinemas and markets.") },
          ],
          image: { src: asset("v5f-museum"), alt: tr("Fasad museum", "Museum facade") },
          ratio: "1/3",
        }),
        sliderD(M, { slides: [{ title: tr("Pameran: Lampu Kota", "Exhibition: City Lights"), text: tr("Sampai 30 November.", "Until 30 November."), bg: "#78350f" }, { title: tr("Malam Museum", "Museum Night"), text: tr("Jumat terakhir tiap bulan, buka sampai 21.00.", "Last Friday of the month, open until 9pm."), bg: "#1f1a14" }, { title: tr("Kelas sketsa", "Sketch class"), text: tr("Sabtu pagi untuk umum.", "Saturday mornings, open to all."), bg: "#365314" }], height: 320 }),
      ],
      collections: () => [
        pageHead(M, { eyebrow: tr("Koleksi", "Collections"), title: tr("Sorotan koleksi", "Collection highlights") }),
        withFx(M, portfolioMosaic(pro(M), tr, { title: tr("Benda pilihan", "Selected objects"), works: [{ title: tr("Peta pelabuhan 1890", "1890 harbour map"), tag: tr("Arsip", "Archive"), image: asset("v5f-museum") }, { title: tr("Radio Philips 1938", "1938 Philips radio"), tag: tr("Teknologi", "Technology"), image: asset("v5f-museum-dusk") }, { title: tr("Ubin Kota Lama", "Old Town tiles"), tag: tr("Arsitektur", "Architecture"), image: asset("v5f-museum") }, { title: tr("Poster bioskop", "Cinema posters"), tag: tr("Budaya", "Culture"), image: asset("v5f-museum-dusk") }, { title: tr("Timbangan rempah", "Spice scales"), tag: tr("Perdagangan", "Trade"), image: asset("v5f-museum") }], cta: null })),
        fullImage(M, { image: asset("v5f-museum"), alt: tr("Ruang pamer utama", "Main gallery"), caption: tr("Ruang pamer utama di lantai dua.", "The main gallery on the second floor.") }),
      ],
      exhibitions: () => [
        pageHead(M, { eyebrow: tr("Pameran", "Exhibitions"), title: tr("Pameran sementara", "Temporary exhibitions") }),
        galleryLb(M, { title: tr("Lampu Kota (2026)", "City Lights (2026)"), images: [[asset("v5f-museum-dusk"), tr("Lampu jalan gas", "Gas street lamps")], [asset("v5f-museum"), tr("Papan reklame neon", "Neon signs")], [asset("v5f-museum-dusk"), tr("Bioskop Rex", "Rex cinema")], [asset("v5f-museum"), tr("Pasar malam", "Night market")]], cols: 2 }),
        timelineD(M, { title: tr("Agenda pameran", "Exhibition calendar"), items: [[tr("Sep–Nov 2026", "Sep–Nov 2026"), tr("Lampu Kota", "City Lights"), tr("Cahaya dan kehidupan malam.", "Light and nightlife.")], [tr("Des 2026–Feb 2027", "Dec 2026–Feb 2027"), tr("Rasa Pelabuhan", "Taste of the Port"), tr("Sejarah kuliner pesisir.", "Coastal food history.")], [tr("Mar–Mei 2027", "Mar–May 2027"), tr("Suara Kota", "City Sounds"), tr("Radio, musik, dan siaran.", "Radio, music and broadcasts.")]] }),
      ],
      learning: () => [
        pageHead(M, { eyebrow: tr("Edukasi", "Learning"), title: tr("Belajar di museum", "Learning at the museum") }),
        cardsD(M, { title: tr("Program sekolah & umum", "School & public programmes"), items: [{ icon: "✎", title: tr("Kunjungan sekolah", "School visits"), text: tr("Tur & lembar kerja sesuai kurikulum.", "Tours & worksheets matched to the curriculum."), meta: tr("Gratis untuk SD", "Free for primary schools") }, { icon: "◐", title: tr("Kelas sketsa", "Sketch class"), text: tr("Menggambar gedung Kota Lama.", "Drawing Old Town buildings."), meta: "Rp35.000" }, { icon: "♫", title: tr("Malam Museum", "Museum Night"), text: tr("Tur senter & musik keroncong.", "Torch tours & keroncong music."), meta: "Rp50.000" }] }),
        offer(M, { eyebrow: tr("Untuk guru", "For teachers"), title: tr("Paket kunjungan sekolah", "School visit pack"), text: tr("Unduh lembar kerja dan jadwalkan kunjungan kelas.", "Download worksheets and schedule a class visit."), trigger: tr("Lihat isi paket", "See what's inside"), modalTitle: tr("Paket kunjungan sekolah", "School visit pack"), body: tr("Berisi 4 lembar kerja, peta museum, dan panduan guru. Kunjungan dijadwalkan minimal 2 minggu sebelumnya.", "Includes 4 worksheets, a museum map and a teacher's guide. Book visits at least 2 weeks ahead."), cta: tr("Jadwalkan", "Schedule"), href: href("visit") }),
      ],
      membership: () => [
        pageHead(M, { eyebrow: tr("Sahabat Museum", "Membership"), title: tr("Dukung museum, nikmati keuntungannya", "Support the museum, enjoy the perks") }),
        fullSplit(M, { title: tr("Sahabat Museum · Rp250.000/tahun", "Membership · Rp250,000/year"), text: tr("Masuk gratis sepanjang tahun dan undangan pembukaan pameran.", "Free entry all year and invitations to exhibition openings."), bullets: [tr("Masuk gratis + 1 tamu", "Free entry + 1 guest"), tr("Diskon toko 15%", "15% shop discount"), tr("Undangan pratinjau", "Preview invitations")], image: asset("v5f-museum-dusk"), alt: tr("Pembukaan pameran", "Exhibition opening"), actions: [[tr("Gabung", "Join"), href("visit"), "light"]] }),
      ],
      visit: () => [
        pageHead(M, { eyebrow: tr("Kunjungi", "Visit"), title: tr("Rencanakan kunjungan", "Plan your visit") }),
        tableD(M, { title: tr("Tiket", "Tickets"), columns: [tr("Kategori", "Category"), tr("Harga", "Price")], rows: [[tr("Dewasa", "Adult"), "Rp20.000"], [tr("Pelajar", "Student"), "Rp10.000"], [tr("Anak < 6 th", "Under 6"), tr("Gratis", "Free")], [tr("Wisatawan asing", "International visitor"), "Rp50.000"]], note: tr("Harga contoh.", "Sample prices.") }),
        locations(M, { title: tr("Lokasi", "Location"), image: asset("v5f-museum"), places: [[tr("Pintu utama", "Main entrance"), "Jl. Letjen Suprapto 31", tr("Ramah kursi roda", "Wheelchair accessible")], [tr("Parkir", "Parking"), tr("Taman Srigunting", "Srigunting Park"), tr("2 menit jalan kaki", "2-minute walk")]] }),
      ],
    }),
};

/* ------------- 9. Dompetku — aplikasi dompet digital (5 hlm, Premium) ------------- */
// Premium: typewriter, comparison-table, logo-marquee, testimonials-wall (preset Pro). Library: Animate + Tilt. Memakai elemen Chart.

const AP: Palette = { ink: "#082f49", muted: "#3f5b6e", primary: "#0891b2", primaryDark: "#0e7490", soft: "#cffafe", line: "#a5f3fc" };
const A = lookD(AP, { head: "Sora", body: "Plus Jakarta Sans", shape: "neon", radius: 20, bg: "#f8feff", alt: "#ecfeff", inv: "#082f49", fx: { animate: "fadeInUp", tilt: true } });

const aFoot = (tr: Tr) =>
  footerD("Dompetku", A, {
    variant: "columns",
    about: tr("Aplikasi untuk mencatat pengeluaran, menabung otomatis, dan membagi tagihan.", "An app to track spending, save automatically and split bills."),
    cols: [
      { title: tr("Produk", "Product"), items: [tr("Fitur", "Features"), tr("Keamanan", "Security"), tr("Harga", "Pricing")] },
      { title: tr("Bantuan", "Help"), items: ["bantuan@dompetku.app", tr("Pusat bantuan", "Help centre")] },
    ],
    social: ["Instagram | https://instagram.com/dompetku.app", "X | https://x.com/dompetku"],
    copy: tr("© 2026 Dompetku. Konten contoh.", "© 2026 Dompetku. Sample content."),
  });

export const appDompetku: TemplateContent = {
  brand: "Dompetku",
  pages: [home(), pg("features", ["fitur", "Fitur"], ["features", "Features"]), pg("security", ["keamanan", "Keamanan"], ["security", "Security"]), pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]), pg("download", ["unduh", "Unduh"], ["download", "Download"])],
  build: (key, tr, href) =>
    render(A, key, headerD("Dompetku", A, { variant: "pill", cta: [tr("Unduh gratis", "Download free"), href("download")] }), aFoot(tr), {
      home: () => [
        fullHeader(A, {
          eyebrow: tr("Aplikasi keuangan pribadi", "Personal finance app"),
          title: tr("Uang Anda, akhirnya terlihat jelas", "Your money, finally clear"),
          titleNode: typerD(A, tr("Kelola ", "Manage "), [tr("pengeluaran", "spending"), tr("tabungan", "savings"), tr("tagihan bersama", "shared bills")], { size: 58, color: "#ffffff", align: "center" }),
          text: tr("Hubungkan rekening, lihat ke mana uang pergi, dan tabung otomatis setiap gajian.", "Connect your accounts, see where money goes, and save automatically every payday."),
          image: asset("v5f-phone-dark"),
          overlay: 60,
          actions: [[tr("Unduh gratis", "Download free"), href("download"), "light"], [tr("Lihat fitur", "See features"), href("features"), "dark"]],
        }),
        marqueeD(A, { title: tr("Terhubung dengan", "Works with"), items: ["Bank Nusa", "Bank Arta", "e-Wallet Kilat", "Bank Samudra", "Koperasi Maju", "Bank Pelangi"] }),
        chartPanel(A, {
          eyebrow: tr("Wawasan", "Insights"),
          title: tr("Lihat pola belanja Anda", "See your spending patterns"),
          text: tr("Grafik bulanan otomatis dari transaksi Anda.", "Monthly charts built automatically from your transactions."),
          chart: { type: "doughnut", title: tr("Pengeluaran Oktober", "October spending"), series: tr("Rupiah (ribu)", "Rupiah (thousand)"), rows: [tr("Makan, 1850", "Food, 1850"), tr("Transport, 720", "Transport, 720"), tr("Tagihan, 1400", "Bills, 1400"), tr("Hiburan, 450", "Fun, 450"), tr("Lainnya, 380", "Other, 380")] },
          kpis: [["Rp4,8jt", tr("Total keluar", "Total out")], ["+12%", tr("Tabungan naik", "Savings up")]],
        }),
        specialty(A, {
          side: { title: tr("Mulai dalam 2 menit", "Start in 2 minutes"), items: [tr("Unduh aplikasi", "Download the app"), tr("Hubungkan rekening", "Connect accounts"), tr("Atur target tabungan", "Set a savings goal")], action: [tr("Unduh", "Download"), href("download")] },
          sideRight: true,
          eyebrow: tr("Fitur utama", "Key features"),
          title: tr("Satu aplikasi untuk semua dompet", "One app for every wallet"),
          items: [
            { icon: "◔", title: tr("Anggaran pintar", "Smart budgets"), text: tr("Peringatan sebelum anggaran habis.", "Alerts before a budget runs out.") },
            { icon: "⇄", title: tr("Bagi tagihan", "Split bills"), text: tr("Kirim tagihan ke teman lewat tautan.", "Send a bill to friends with a link.") },
            { icon: "↻", title: tr("Tabung otomatis", "Auto-save"), text: tr("Sisihkan % gaji setiap tanggal gajian.", "Set aside a % of each paycheck.") },
            { icon: "⌂", title: tr("Target keluarga", "Family goals"), text: tr("Tabungan bersama pasangan.", "Shared savings with a partner.") },
          ],
          cols: 2,
        }),
      ],
      features: () => [
        pageHead(A, { eyebrow: tr("Fitur", "Features"), title: tr("Dibuat untuk kebiasaan sehari-hari", "Built for everyday habits") }),
        chartDuo(A, { title: tr("Laporan yang mudah dibaca", "Reports that are easy to read"), charts: [{ type: "bar", title: tr("Masuk vs keluar", "In vs out"), series: tr("Masuk, Keluar", "In, Out"), rows: [tr("Jul, 7200, 6100", "Jul, 7200, 6100"), tr("Agu, 7200, 5800", "Aug, 7200, 5800"), tr("Sep, 7400, 6300", "Sep, 7400, 6300"), tr("Okt, 7400, 4800", "Oct, 7400, 4800")] }, { type: "line", title: tr("Saldo tabungan", "Savings balance"), series: tr("Saldo (ribu)", "Balance (thousand)"), rows: ["Jul, 2100", tr("Agu, 3500", "Aug, 3500"), "Sep, 4600", tr("Okt, 7200", "Oct, 7200")] }] }),
        fullImage(A, { image: asset("v5f-phone"), alt: tr("Tampilan aplikasi", "App screens"), ratio: "21 / 7" }),
      ],
      security: () => [
        pageHead(A, { eyebrow: tr("Keamanan", "Security"), title: tr("Aman seperti bank", "Bank-level security") }),
        specs(A, { title: tr("Cara kami menjaga data", "How we protect data"), rows: [[tr("Enkripsi", "Encryption"), "AES-256 & TLS 1.3"], [tr("Akses rekening", "Account access"), tr("Hanya baca, tidak bisa memindah dana", "Read-only, cannot move funds")], [tr("Login", "Login"), tr("Sidik jari, wajah, atau PIN", "Fingerprint, face or PIN")], [tr("Server", "Servers"), tr("Di Indonesia", "In Indonesia")]], image: asset("v5f-phone") }),
        kpiStrip(A, { items: [["0", tr("Kebocoran data", "Data breaches"), tr("sejak 2021", "since 2021")], ["99,98%", tr("Waktu aktif", "Uptime"), tr("12 bulan", "12 months")], ["24/7", tr("Pemantauan", "Monitoring"), tr("tim keamanan", "security team")]] }),
      ],
      pricing: () => [
        pageHead(A, { eyebrow: tr("Harga", "Pricing"), title: tr("Gratis selamanya, Plus bila perlu", "Free forever, Plus when you need it") }),
        compareD(A, { title: tr("Gratis vs Plus", "Free vs Plus"), columns: [tr("Fitur", "Feature"), tr("Gratis", "Free"), "Plus · Rp29rb"], rows: [tr("Rekening terhubung | 2 | Tanpa batas", "Linked accounts | 2 | Unlimited"), tr("Anggaran | 3 | Tanpa batas", "Budgets | 3 | Unlimited"), tr("Ekspor laporan | — | ✓", "Report export | — | ✓"), tr("Target keluarga | — | ✓", "Family goals | — | ✓")], highlight: 2, caption: tr("Batal kapan saja.", "Cancel any time.") }),
        withFx(A, testimonialsWall(pro(A), tr, { title: tr("Kata pengguna", "What users say"), score: 4.8, caption: tr("dari 31.000 ulasan", "from 31,000 reviews"), quotes: [{ text: tr("Pertama kalinya saya bisa menabung tiap bulan.", "The first time I've managed to save every month."), name: "Nadia", role: tr("Desainer", "Designer"), avatar: asset("v4e-face-2") }, { text: tr("Bagi tagihan kos jadi tidak canggung.", "Splitting rent is no longer awkward."), name: "Fikri", role: tr("Mahasiswa", "Student"), avatar: asset("v4e-face-3") }, { text: tr("Grafiknya bikin saya sadar boros di kopi.", "The charts showed me I overspend on coffee."), name: "Laras", role: tr("Karyawan", "Employee"), avatar: asset("v4e-face-4") }] })),
      ],
      download: () => [
        pageHead(A, { eyebrow: tr("Unduh", "Download"), title: tr("Tersedia di Android & iOS", "On Android & iOS") }),
        ctaD(A, { title: tr("Mulai catat hari ini", "Start tracking today"), text: tr("Gratis, tanpa iklan.", "Free, no ads."), actions: [["Google Play", "https://play.google.com"], ["App Store", "https://apps.apple.com", "dark"]], tone: "primary" }),
        faqD(A, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Apakah Dompetku bank?", "Is Dompetku a bank?"), tr("Bukan, kami aplikasi pencatat yang terhubung ke bank Anda.", "No, we're a tracking app connected to your bank.")], [tr("Bisa dipakai tanpa menghubungkan rekening?", "Can I use it without linking accounts?"), tr("Bisa, catat manual.", "Yes, log transactions manually.")]] }),
      ],
    }),
};

/* ------------- 10. Petik Kebun — agrowisata (5 hlm, Premium) ------------- */
// Premium: countdown, testimonial, pricing (plans), stats-band (preset Pro). Library: AOS. Memakai elemen Chart.

const KP: Palette = { ink: "#1a2e05", muted: "#4d5f37", primary: "#ea580c", primaryDark: "#c2410c", soft: "#ffedd5", line: "#fed7aa" };
const K = lookD(KP, { head: "Righteous", body: "Outfit", shape: "soft", radius: 22, bg: "#fffdf7", alt: "#f7fbe9", inv: "#1a2e05", fx: { aos: "zoom-in" } });

const kFoot = (tr: Tr) =>
  footerD("Petik Kebun", K, {
    variant: "giant",
    about: tr("Agrowisata petik jeruk, stroberi, dan apel di lereng Gunung Arjuno, Batu.", "Pick-your-own oranges, strawberries and apples on Mount Arjuno's slopes, Batu."),
    cols: [{ title: tr("Kunjungi", "Visit"), items: ["Jl. Raya Punten 77, Batu", tr("Setiap hari 07.00–16.00", "Daily 7am–4pm"), "0341 600 177"] }],
    social: ["Instagram | https://instagram.com/petikkebun", "TikTok | https://tiktok.com/@petikkebun"],
    copy: tr("© 2026 Petik Kebun. Konten contoh.", "© 2026 Petik Kebun. Sample content."),
  });

export const agroPetikKebun: TemplateContent = {
  brand: "Petik Kebun",
  pages: [home(), pg("activities", ["aktivitas", "Aktivitas"], ["activities", "Activities"]), pg("packages", ["paket", "Paket"], ["packages", "Packages"]), pg("harvest", ["musim-panen", "Musim Panen"], ["harvest", "Harvest"]), pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  build: (key, tr, href) =>
    render(K, key, headerD("Petik Kebun", K, { variant: "bar", cta: [tr("Pesan tiket", "Book tickets"), href("visit")] }), kFoot(tr), {
      home: () => [
        fullHeader(K, {
          eyebrow: tr("Agrowisata · Batu", "Agritourism · Batu"),
          title: tr("Petik sendiri, makan langsung di kebun", "Pick it yourself, eat it in the orchard"),
          text: tr("12 hektar kebun jeruk, stroberi, dan apel. Cocok untuk keluarga dan rombongan sekolah.", "12 hectares of oranges, strawberries and apples. Great for families and school groups."),
          image: asset("v5f-orchard-citrus"),
          actions: [[tr("Pesan tiket", "Book tickets"), href("visit"), "light"], [tr("Musim panen", "Harvest season"), href("harvest"), "dark"]],
        }),
        specialty(K, {
          side: { title: tr("Tiket masuk", "Entry tickets"), items: [tr("Dewasa · Rp35.000", "Adult · Rp35,000"), tr("Anak · Rp25.000", "Child · Rp25,000"), tr("Termasuk 1 kg buah", "Includes 1 kg of fruit")], action: [tr("Pesan", "Book"), href("visit")] },
          eyebrow: tr("Kebun", "Orchards"),
          title: tr("Tiga kebun, satu tiket", "Three orchards, one ticket"),
          items: [
            { icon: "🍊", title: tr("Kebun jeruk", "Orange grove"), text: tr("Jeruk keprok Batu, manis segar.", "Sweet Batu tangerines.") },
            { icon: "🍓", title: tr("Rumah stroberi", "Strawberry house"), text: tr("Hidroponik, bersih tanpa lumpur.", "Hydroponic, clean and mud-free.") },
            { icon: "🍎", title: tr("Kebun apel", "Apple orchard"), text: tr("Apel manalagi & anna.", "Manalagi & anna apples.") },
            { icon: "🧺", title: tr("Pondok makan", "Picnic huts"), text: tr("Gazebo untuk makan bersama.", "Gazebos for shared meals.") },
          ],
          cols: 2,
          image: { src: asset("v5f-orchard"), alt: tr("Kebun apel", "Apple orchard") },
        }),
        withFx(K, statsBand(pro(K), tr, { title: tr("Kebun dalam angka", "The orchard in numbers"), stats: [["12 ha", tr("Luas kebun", "Orchard area")], ["3", tr("Jenis buah", "Fruit types")], ["80rb", tr("Pengunjung/tahun", "Visitors/year")], ["35", tr("Petani lokal", "Local farmers")]] })),
      ],
      activities: () => [
        pageHead(K, { eyebrow: tr("Aktivitas", "Activities"), title: tr("Lebih dari memetik", "More than picking") }),
        notes(K, { title: tr("Yang bisa dilakukan", "Things to do"), items: [[tr("Petik buah", "Fruit picking"), tr("Bawa pulang 1 kg gratis.", "Take 1 kg home for free.")], [tr("Kelas sari buah", "Juice class"), tr("Buat sari apel sendiri.", "Make your own apple juice.")], [tr("Tanam bibit", "Plant a seedling"), tr("Beri nama pohonmu.", "Name your own tree.")], [tr("Kereta kebun", "Orchard train"), tr("Keliling 20 menit.", "A 20-minute ride.")]], colors: ["#fef3c7", "#dcfce7", "#ffe4e6", "#e0f2fe"] }),
        fullSplit(K, { title: tr("Rombongan sekolah", "School groups"), text: tr("Program belajar pertanian dengan pemandu dan lembar kerja.", "A farming programme with guides and worksheets."), bullets: [tr("Min. 30 siswa", "Min. 30 students"), tr("Termasuk makan siang", "Lunch included"), tr("Sertifikat petani cilik", "Little farmer certificate")], image: asset("v5f-orchard"), alt: tr("Siswa di kebun", "Students in the orchard"), tone: "primary" }),
      ],
      packages: () => [
        pageHead(K, { eyebrow: tr("Paket", "Packages"), title: tr("Paket kunjungan", "Visit packages") }),
        plansD(K, {
          title: tr("Pilih paket", "Choose a package"),
          items: [
            { plan: tr("Petik", "Pick"), price: "Rp35rb", period: tr("/orang", "/person"), description: tr("Tiket masuk", "Entry ticket"), features: [tr("3 kebun", "3 orchards"), tr("1 kg buah", "1 kg fruit")], buttonText: tr("Pesan", "Book"), buttonHref: href("visit") },
            { plan: tr("Keluarga", "Family"), price: "Rp150rb", period: tr("/4 orang", "/4 people"), description: tr("Paling hemat", "Best value"), features: [tr("3 kebun", "3 orchards"), tr("4 kg buah", "4 kg fruit"), tr("Kereta kebun", "Orchard train")], buttonText: tr("Pesan", "Book"), buttonHref: href("visit"), featured: true, badge: tr("Favorit", "Favourite") },
            { plan: tr("Sekolah", "School"), price: "Rp55rb", period: tr("/siswa", "/student"), description: tr("Min. 30 siswa", "Min. 30 students"), features: [tr("Pemandu", "Guide"), tr("Makan siang", "Lunch"), tr("Sertifikat", "Certificate")], buttonText: tr("Hubungi", "Contact"), buttonHref: href("visit") },
          ],
        }),
        quotesD(K, { title: tr("Kata pengunjung", "What visitors say"), items: [{ quote: tr("Anak-anak tidak mau pulang!", "The kids didn't want to leave!"), author: "Bu Ratna", role: tr("Malang", "Malang"), avatar: asset("v4e-face-2") }, { quote: tr("Stroberinya manis dan bersih.", "The strawberries were sweet and clean."), author: "Arif", role: "Surabaya", avatar: asset("v4e-face-1") }] }),
      ],
      harvest: () => [
        pageHead(K, { eyebrow: tr("Musim panen", "Harvest"), title: tr("Kapan buah paling banyak?", "When is fruit most plentiful?") }),
        chartPanel(K, { title: tr("Perkiraan panen 2026", "2026 harvest forecast"), text: tr("Berdasarkan catatan petani tiga tahun terakhir.", "Based on farmers' records over the last three years."), chart: { type: "line", title: tr("Panen per bulan (ton)", "Monthly harvest (tonnes)"), series: tr("Jeruk, Apel", "Oranges, Apples"), rows: [tr("Jan, 4, 2", "Jan, 4, 2"), tr("Mar, 6, 3", "Mar, 6, 3"), tr("Mei, 9, 5", "May, 9, 5"), tr("Jul, 12, 8", "Jul, 12, 8"), tr("Sep, 7, 10", "Sep, 7, 10"), tr("Nov, 5, 6", "Nov, 5, 6")] }, bullets: [tr("Jeruk puncak Juli", "Oranges peak in July"), tr("Apel puncak September", "Apples peak in September")] }),
        countdownD(K, { eyebrow: tr("Festival panen", "Harvest festival"), title: tr("Festival Apel 2027", "Apple Festival 2027"), text: tr("Lomba petik, musik, dan pasar tani.", "Picking contests, music and a farmers' market."), target: "2027-09-12T08:00", finished: tr("Festival dimulai!", "The festival has begun!"), actions: [[tr("Pesan tiket", "Book tickets"), href("visit"), "light"]] }),
      ],
      visit: () => [
        pageHead(K, { eyebrow: tr("Kunjungi", "Visit"), title: tr("Pesan tiket", "Book tickets") }),
        formD(K, {
          title: tr("Formulir tiket", "Ticket form"),
          info: [[tr("Telepon", "Phone"), "0341 600 177"], [tr("Alamat", "Address"), "Jl. Raya Punten 77, Batu"], [tr("Jam", "Hours"), "07.00–16.00"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama pemesan", "Your name") },
            { kind: "date", label: tr("Tanggal kunjungan", "Visit date") },
            { kind: "select", label: tr("Paket", "Package"), ph: tr("Pilih paket", "Choose a package"), options: [tr("Petik", "Pick"), tr("Keluarga", "Family"), tr("Sekolah", "School")] },
            { kind: "input", label: tr("Jumlah orang", "People"), ph: "4", type: "number" },
          ],
          submit: tr("Pesan", "Book"),
        }),
        rail(K, { title: tr("Tips berkunjung", "Visiting tips"), steps: [[tr("Datang pagi", "Come early"), tr("Buah paling segar sebelum 10.00.", "Fruit is freshest before 10am.")], [tr("Pakai sepatu", "Wear shoes"), tr("Jalan kebun bisa licin.", "Paths can be slippery.")], [tr("Bawa topi", "Bring a hat"), tr("Kebun jeruk terbuka.", "The grove is open to the sun.")]] }),
      ],
    }),
};

