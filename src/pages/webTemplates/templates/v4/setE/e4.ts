import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { pricingCards, servicesSplit, statsBand, teamCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  bento,
  board,
  cardsD,
  chartDuo,
  chartPanel,
  compareD,
  counterD,
  countdownD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroBrutal,
  heroGlass,
  heroNeon,
  heroSearch,
  heroStacked,
  home,
  kpiStrip,
  locations,
  lookD,
  megaD,
  notes,
  numbers,
  pageHead,
  pg,
  polaroids,
  pro,
  progressD,
  pullQuote,
  quotesD,
  rail,
  render,
  specs,
  splitPanel,
  tableD,
  tabsD,
  timelineD,
  typerD,
  withFx,
  wordBand,
  zigzag,
} from "./kitE";

/* ================================================================== */
/* Template v4 E16–E20: Laporan dampak (grafik), Energi angin (grafik),  */
/* Pitch startup (grafik), Bimbel online, Gudang (grafik).               */
/* ================================================================== */

/* ---- 16. Yayasan Jejak Baik — laporan dampak (7 hlm, grafik) -------- */
// Premium: stats-counter, progress, pro-team-cards, gallery-lightbox. Library: AOS. Grafik: pie + bar.

const NP: Palette = { ink: "#2b0a1a", muted: "#6e4558", primary: "#be185d", primaryDark: "#9d174d", soft: "#fce7f3", line: "#f5c6dc" };
const N = lookD(NP, { head: "Libre Baskerville", body: "Work Sans", shape: "editorial", radius: 4, bg: "#fffbfc", alt: "#fbf0f4", inv: "#2b0a1a", fx: { aos: "fade-up" } });

const nFoot = (tr: Tr) =>
  footerD("Jejak Baik", N, {
    variant: "columns",
    about: tr("Yayasan fiktif untuk contoh: beasiswa, gizi anak, dan air bersih di 42 desa NTT dan Sulawesi Barat.", "A fictional foundation for sample purposes: scholarships, child nutrition and clean water in 42 villages in NTT and West Sulawesi."),
    cols: [{ title: tr("Laporan", "Reports"), items: [tr("Laporan dampak 2025", "2025 impact report"), tr("Audit keuangan", "Financial audit")] }, { title: tr("Kontak", "Contact"), items: ["halo@jejakbaik.or.id", "0361 700 425"] }],
    social: ["Instagram | https://instagram.com/jejakbaik", "YouTube | https://youtube.com/@jejakbaik", "LinkedIn | https://linkedin.com/company/jejakbaik"],
    copy: tr("© 2026 Yayasan Jejak Baik (fiktif). Angka contoh.", "© 2026 Yayasan Jejak Baik (fictional). Sample figures."),
  });

const fundChart = (tr: Tr) => ({ type: "pie" as const, title: tr("Penggunaan dana 2025 (%)", "Use of funds 2025 (%)"), series: tr("Porsi", "Share"), rows: [tr("Beasiswa", "Scholarships") + ", 41", tr("Gizi anak", "Child nutrition") + ", 27", tr("Air bersih", "Clean water") + ", 19", tr("Operasional", "Operations") + ", 9", tr("Penggalangan dana", "Fundraising") + ", 4"] });

export const nonprofitLaporanDampak: TemplateContent = {
  brand: "Yayasan Jejak Baik",
  pages: [
    home(),
    pg("report", ["laporan-dampak", "Laporan Dampak"], ["impact-report", "Impact Report"]),
    pg("programs", ["program", "Program"], ["programmes", "Programmes"]),
    pg("finance", ["keuangan", "Keuangan"], ["finances", "Finances"]),
    pg("stories", ["cerita", "Cerita"], ["stories", "Stories"]),
    pg("team", ["pengurus", "Pengurus"], ["board", "Board"]),
    pg("donate", ["donasi", "Donasi"], ["donate", "Donate"]),
  ],
  build: (key, tr, href) =>
    render(N, key, headerD("Jejak Baik", N, { variant: "center", cta: [tr("Donasi", "Donate"), href("donate")] }), nFoot(tr), {
      home: () => [
        heroStacked(N, {
          eyebrow: tr("Laporan dampak 2025", "2025 impact report"),
          title: tr("Setiap rupiah, tercatat.", "Every rupiah, accounted for."),
          lines: [tr("Setiap rupiah,", "Every rupiah,"), tr("tercatat,", "recorded,"), tr("terlihat.", "visible.")],
          text: tr("Tahun lalu 18.400 donatur membantu 9.600 anak. Inilah ke mana uang Anda pergi, lengkap dengan angka dan nama desa.", "Last year 18,400 donors helped 9,600 children. Here is where your money went, with numbers and village names."),
          image: asset("v4e-hands"),
          alt: tr("Tangan menopang hati", "Hands holding a heart"),
          actions: [[tr("Baca laporan", "Read the report"), href("report")], [tr("Donasi", "Donate"), href("donate"), "outline"]],
        }),
        counterD(N, { title: tr("2025 dalam angka", "2025 in numbers"), items: [tr("9.600 | Anak terbantu", "9,600 | Children helped"), tr("42 | Desa", "42 | Villages"), tr("18.400 | Donatur", "18,400 | Donors"), tr("87% | Dana ke program", "87% | Funds to programmes")] }),
        chartPanel(N, { eyebrow: tr("Transparansi", "Transparency"), title: tr("Ke mana uang Anda pergi", "Where your money goes"), text: tr("Dari total Rp12,8 miliar yang terkumpul pada 2025.", "Out of Rp12.8 billion raised in 2025."), chart: fundChart(tr), bullets: [tr("Diaudit akuntan publik independen", "Audited by an independent public accountant"), tr("Laporan lengkap bisa diunduh", "Full report available to download")] }),
      ],
      report: () => [
        pageHead(N, { eyebrow: tr("Laporan dampak", "Impact report"), title: tr("Apa yang berubah pada 2025", "What changed in 2025") }),
        chartDuo(N, { title: tr("Hasil utama", "Key outcomes"), charts: [{ type: "bar", title: tr("Penerima manfaat per tahun", "Beneficiaries per year"), series: tr("Anak, Keluarga", "Children, Families"), rows: ["2021, 3200, 1100", "2022, 4800, 1650", "2023, 6100, 2200", "2024, 7900, 2900", "2025, 9600, 3500"], c2: "#f59e0b" }, { type: "line", title: tr("Anak dengan gizi baik (%)", "Children with healthy nutrition (%)"), series: tr("Desa program, Desa pembanding", "Programme villages, Comparison villages"), rows: ["2021, 61, 60", "2022, 68, 61", "2023, 74, 63", "2024, 79, 64", "2025, 84, 66"], c2: "#94a3b8" }], notes: [tr("Termasuk penerima beasiswa & gizi.", "Includes scholarship & nutrition recipients."), tr("Survei antropometri tahunan.", "Annual anthropometric survey.")] }),
        progressD(N, { title: tr("Target 2026", "2026 targets"), bars: [[tr("Beasiswa 3.000 siswa", "3,000 scholarships"), 72], [tr("60 sumur bor", "60 boreholes"), 55], [tr("50 posyandu aktif", "50 active health posts"), 80]] }),
      ],
      programs: () => [
        pageHead(N, { eyebrow: tr("Program", "Programmes"), title: tr("Tiga program, satu tujuan", "Three programmes, one goal") }),
        zigzag(N, { title: tr("Yang kami kerjakan", "What we do"), steps: [[tr("Beasiswa Lentera", "Lentera Scholarships"), tr("Biaya sekolah, seragam, dan pendamping belajar untuk 2.180 siswa SD–SMA.", "Fees, uniforms and study mentors for 2,180 students."), asset("v4e-study")], [tr("Piring Penuh", "Full Plate"), tr("Makan bergizi di 38 posyandu dan kelas memasak untuk ibu.", "Nutritious meals at 38 health posts and cooking classes for mothers."), asset("v4e-hands")], [tr("Air Dekat", "Water Nearby"), tr("Sumur bor dan tandon air sehingga anak tidak lagi berjalan 3 km.", "Boreholes and tanks so children no longer walk 3 km.")]] }),
      ],
      finance: () => [
        pageHead(N, { eyebrow: tr("Keuangan", "Finances"), title: tr("Laporan keuangan ringkas", "Summary financial statement") }),
        tableD(N, { title: tr("Pemasukan & pengeluaran 2025", "2025 income & expenses"), columns: [tr("Pos", "Item"), tr("Jumlah", "Amount"), "%"], rows: [[tr("Donasi individu", "Individual donations"), "Rp7,9 M", "62%"], [tr("Mitra perusahaan", "Corporate partners"), "Rp3,6 M", "28%"], [tr("Hibah", "Grants"), "Rp1,3 M", "10%"], [tr("Total program", "Total programmes"), "Rp11,1 M", "87%"], [tr("Operasional & penggalangan", "Ops & fundraising"), "Rp1,7 M", "13%"]], note: tr("Angka fiktif untuk contoh.", "Fictional figures for illustration.") }),
        chartPanel(N, { title: tr("Rincian penggunaan dana", "Breakdown of spending"), text: tr("Biaya operasional dijaga di bawah 10%.", "Operating costs are kept under 10%."), chart: fundChart(tr), reverse: true, bg: N.alt }),
      ],
      stories: () => [
        pageHead(N, { eyebrow: tr("Cerita", "Stories"), title: tr("Di balik angka", "Behind the numbers") }),
        galleryLb(N, { title: tr("Dari lapangan", "From the field"), images: [[asset("v4e-study"), tr("Kelas sore di Sumba", "Afternoon class in Sumba")], [asset("v4e-hands"), tr("Posyandu Mamuju", "Mamuju health post")], [asset("v4e-route"), tr("Peta sumur baru", "New borehole map")]] }),
        pullQuote(N, { text: tr("Sekarang saya bisa sampai sekolah sebelum bel, bukan setelah mengambil air.", "Now I reach school before the bell, not after fetching water."), name: "Yanti, 11", role: tr("Siswi, Sumba Timur", "Student, East Sumba") }),
      ],
      team: () => [
        pageHead(N, { eyebrow: tr("Pengurus", "Board"), title: tr("Orang-orang yang bertanggung jawab", "The people accountable") }),
        withFx(N, teamCards(pro(N), tr, { title: tr("Pengurus yayasan", "Foundation board"), members: [{ name: "Dr. Maria Tefa", role: tr("Ketua", "Chair"), photo: asset("v4e-face-2") }, { name: "Andreas Lango", role: tr("Bendahara", "Treasurer"), photo: asset("v4e-face-1") }, { name: "Nurul Aini", role: tr("Direktur Program", "Programme Director"), photo: asset("v4e-face-4") }] })),
      ],
      donate: () => [
        pageHead(N, { eyebrow: tr("Donasi", "Donate"), title: tr("Rp150.000 = gizi satu anak selama sebulan", "Rp150,000 = a month of nutrition for one child") }),
        formD(N, { title: tr("Donasi sekarang", "Donate now"), info: [[tr("Rekening (contoh)", "Account (sample)"), "123-456-7890 a.n. Yayasan Jejak Baik"], ["QRIS", tr("Tersedia saat konfirmasi", "Shown on confirmation")]], fields: [{ kind: "select", label: tr("Nominal", "Amount"), ph: tr("Pilih", "Choose"), options: ["Rp50.000", "Rp150.000", "Rp500.000", tr("Lainnya", "Other")] }, { kind: "select", label: tr("Program", "Programme"), ph: tr("Pilih", "Choose"), options: [tr("Di mana paling dibutuhkan", "Where most needed"), tr("Beasiswa", "Scholarships"), tr("Gizi", "Nutrition"), tr("Air", "Water")] }, { kind: "check", label: tr("Jadikan donasi bulanan", "Make it monthly") }], submit: tr("Lanjut", "Continue") }),
      ],
    }),
};

/* ------- 17. Bayu Daya Energi — energi angin (5 hlm, grafik) --------- */
// Premium: pro-stats-band. Library: Animate + AOS. Grafik: line.

const WP: Palette = { ink: "#ecfeff", muted: "#94c7d1", primary: "#22d3ee", primaryDark: "#0891b2", soft: "#083344", line: "#155e75" };
const W = lookD(WP, { head: "JetBrains Mono", body: "Outfit", shape: "neon", radius: 12, bg: "#03141c", alt: "#062330", inv: "#083344", surface: "#0a2633", fx: { animate: "zoomIn", aos: "fade-up" }, dark: true });

const wFoot = (tr: Tr) =>
  footerD("Bayu Daya", W, {
    variant: "slim",
    about: tr("Pengembang & operator ladang angin fiktif di pesisir selatan Jawa dan Sulawesi Selatan.", "A fictional wind-farm developer & operator on the south coast of Java and in South Sulawesi."),
    social: ["LinkedIn | https://linkedin.com/company/bayudaya", "YouTube | https://youtube.com/@bayudaya"],
    copy: tr("© 2026 Bayu Daya Energi (fiktif). Data contoh.", "© 2026 Bayu Daya Energi (fictional). Sample data."),
  });

export const energyAngin: TemplateContent = {
  brand: "Bayu Daya Energi",
  pages: [home(), pg("production", ["data-produksi", "Data Produksi"], ["production-data", "Production Data"]), pg("farms", ["ladang-angin", "Ladang Angin"], ["wind-farms", "Wind Farms"]), pg("community", ["warga", "Warga"], ["community", "Community"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(W, key, headerD("Bayu Daya", W, { variant: "bar", cta: [tr("Data produksi", "Production data"), href("production")] }), wFoot(tr), {
      home: () => [
        heroNeon(W, {
          eyebrow: tr("Energi angin", "Wind energy"),
          title: tr("Angin pantai selatan, listrik untuk 180 ribu rumah", "South-coast wind, power for 180,000 homes"),
          text: tr("62 turbin di dua ladang angin menghasilkan 410 GWh per tahun — dan semua datanya kami buka.", "62 turbines across two wind farms generate 410 GWh a year — and we publish all the data."),
          image: asset("v4e-wind-night"),
          alt: tr("Turbin angin di bukit", "Wind turbines on a hill"),
          chips: ["62 " + tr("turbin", "turbines"), "150 MW", "410 GWh/" + tr("thn", "yr")],
          actions: [[tr("Lihat data", "See the data"), href("production")]],
        }),
        chartPanel(W, { eyebrow: tr("Produksi 2026", "2026 output"), title: tr("Musim kemarau = musim angin", "Dry season = wind season"), text: tr("Angin muson timur membuat Juni–September menjadi bulan paling produktif.", "The east monsoon makes June–September our most productive months."), chart: { type: "line", title: tr("Produksi bulanan (GWh)", "Monthly output (GWh)"), series: tr("2026, 2025", "2026, 2025"), rows: ["Jan, 24, 22", tr("Feb", "Feb") + ", 22, 21", "Mar, 26, 23", tr("Apr", "Apr") + ", 29, 27", tr("Mei", "May") + ", 34, 31", "Jun, 41, 38", "Jul, 46, 43", tr("Agu", "Aug") + ", 47, 45", "Sep, 42, 40"], c2: "#a3e635" }, kpis: [["+7%", tr("vs 2025", "vs 2025")], ["38%", tr("faktor kapasitas", "capacity factor")]] }),
        withFx(W, statsBand(pro(W), tr, { title: tr("Dampak tahunan", "Annual impact"), stats: [["410 GWh", tr("Listrik bersih", "Clean power")], ["350 rb ton", tr("CO₂ dihindari", "CO₂ avoided")], ["180 rb", tr("Rumah teraliri", "Homes powered")], ["420", tr("Pekerja lokal", "Local workers")]] })),
      ],
      production: () => [
        pageHead(W, { eyebrow: tr("Data produksi", "Production data"), title: tr("Data terbuka, diperbarui bulanan", "Open data, updated monthly") }),
        kpiStrip(W, { items: [["47 GWh", tr("Puncak (Agu)", "Peak (Aug)"), tr("rekor baru", "new record")], ["97,8%", tr("Ketersediaan turbin", "Turbine availability"), "+0,6"], ["7,4 m/s", tr("Rata-rata angin", "Average wind"), tr("80 m", "at 80 m")]], inv: false }),
        tableD(W, { title: tr("Per ladang angin (Jan–Sep 2026)", "Per wind farm (Jan–Sep 2026)"), columns: [tr("Ladang", "Farm"), tr("Turbin", "Turbines"), tr("Produksi", "Output"), tr("Faktor kapasitas", "Capacity factor")], rows: [[tr("Pesisir Selatan", "South Coast"), "38", "182 GWh", "39%"], [tr("Bukit Sidrap", "Sidrap Hills"), "24", "129 GWh", "36%"]] }),
      ],
      farms: () => [
        pageHead(W, { eyebrow: tr("Ladang angin", "Wind farms"), title: tr("Dua lokasi, satu standar", "Two sites, one standard") }),
        splitPanel(W, { eyebrow: tr("Pesisir Selatan", "South Coast"), title: tr("38 turbin 2,5 MW", "38 × 2.5 MW turbines"), text: tr("Dibangun di lahan tegalan sewa, petani tetap menanam di sekitar kaki turbin.", "Built on leased dry fields; farmers still plant around the turbine bases."), bullets: [tr("Tinggi menara 100 m", "100 m towers"), tr("Beroperasi sejak 2021", "Operating since 2021")], image: asset("v4e-wind"), alt: tr("Turbin angin", "Wind turbine") }),
        specs(W, { title: tr("Spesifikasi turbin", "Turbine specs"), rows: [[tr("Diameter rotor", "Rotor diameter"), "126 m"], [tr("Kecepatan mulai", "Cut-in speed"), "3 m/s"], [tr("Kecepatan henti", "Cut-out speed"), "25 m/s"], [tr("Umur desain", "Design life"), tr("25 tahun", "25 years")]], image: asset("v4e-wind-night"), alt: tr("Turbin malam hari", "Turbine at night") }),
      ],
      community: () => [
        pageHead(W, { eyebrow: tr("Warga", "Community"), title: tr("Tetangga dulu, pembangkit kemudian", "Neighbours first, power plant second") }),
        cardsD(W, { title: tr("Program warga", "Community programmes"), cols: 3, items: [{ icon: "₪", title: tr("Bagi hasil", "Revenue share"), text: tr("1% pendapatan ke dana desa.", "1% of revenue to village funds.") }, { icon: "⚒", title: tr("Pelatihan teknisi", "Technician training"), text: tr("86 pemuda tersertifikasi.", "86 young people certified.") }, { icon: "◎", title: tr("Listrik sekolah", "School power"), text: tr("Panel & baterai untuk 12 sekolah.", "Panels & batteries for 12 schools.") }] }),
        faqD(W, { title: tr("Pertanyaan warga", "Residents ask"), items: [[tr("Apakah berisik?", "Is it noisy?"), tr("Di jarak 500 m sekitar 40 dB, setara kulkas.", "About 40 dB at 500 m — like a fridge.")], [tr("Bagaimana dengan burung?", "What about birds?"), tr("Kami memantau dan menghentikan turbin saat migrasi.", "We monitor and pause turbines during migrations.")]] }),
      ],
      contact: () => [
        pageHead(W, { eyebrow: tr("Kontak", "Contact"), title: tr("Hubungi tim kami", "Get in touch") }),
        formD(W, { title: tr("Kirim pesan", "Send a message"), info: [["Email", "info@bayudaya.id"], [tr("Kantor", "Office"), "Jl. Pantai Baru 1, Bantul"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Topik", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Media", "Press"), tr("Investor", "Investors"), tr("Warga", "Residents"), tr("Karier", "Careers")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* --------- 18. Gerobak Pintar — pitch startup (5 hlm, grafik) -------- */
// Premium: pro-stats-band, pro-team-cards, countdown. Library: Animate + Tilt. Grafik: bar + doughnut.

const PP: Palette = { ink: "#111111", muted: "#3f3f46", primary: "#f97316", primaryDark: "#c2410c", soft: "#ffedd5", line: "#fdba74" };
const PT = lookD(PP, { head: "Space Mono", body: "Poppins", shape: "brutal", radius: 0, bg: "#fffdf8", alt: "#bef264", inv: "#111111", fx: { animate: "backInUp", tilt: true } });

const pFoot = (tr: Tr) =>
  footerD("Gerobak Pintar", PT, {
    variant: "giant",
    about: tr("Startup fiktif: aplikasi kasir & stok untuk 38.000 pedagang gerobak dan warung.", "A fictional startup: POS & stock app for 38,000 street-cart vendors and kiosks."),
    cols: [{ title: tr("Investor", "Investors"), items: ["ir@gerobakpintar.id", tr("Data room atas permintaan", "Data room on request")] }],
    social: ["LinkedIn | https://linkedin.com/company/gerobakpintar", "X | https://x.com/gerobakpintar"],
    copy: tr("© 2026 Gerobak Pintar (fiktif). Angka contoh, bukan penawaran efek.", "© 2026 Gerobak Pintar (fictional). Sample figures, not a securities offer."),
  });

export const startupPitch: TemplateContent = {
  brand: "Gerobak Pintar",
  pages: [home(), pg("traction", ["traksi", "Traksi"], ["traction", "Traction"]), pg("product", ["produk", "Produk"], ["product", "Product"]), pg("team", ["tim", "Tim"], ["team", "Team"]), pg("invest", ["investasi", "Investasi"], ["invest", "Invest"])],
  build: (key, tr, href) =>
    render(PT, key, headerD("Gerobak Pintar", PT, { variant: "bar", cta: [tr("Minta deck", "Get the deck"), href("invest")] }), pFoot(tr), {
      home: () => [
        heroBrutal(PT, {
          sticker: tr("Seri A · 2026", "Series A · 2026"),
          title: tr("Kasir di saku 38.000 pedagang gerobak", "A till in the pocket of 38,000 cart vendors"),
          text: tr("Pedagang mencatat penjualan dengan suara, stok bahan otomatis berkurang, dan pinjaman modal muncul dari riwayat transaksi.", "Vendors log sales by voice, ingredient stock updates itself, and working-capital loans come from transaction history."),
          image: asset("v4e-rocket"),
          alt: tr("Roket meluncur", "Rocket launching"),
          actions: [[tr("Lihat traksi", "See traction"), href("traction")], [tr("Minta deck", "Get the deck"), href("invest"), "outline"]],
        }),
        wordBand(PT, ["GMV Rp96 M/bln", "38.000 " + tr("pedagang", "vendors"), "NPS 71", tr("Retensi 12 bln 64%", "12-mo retention 64%")], { bg: PT.p.ink, color: "#bef264" }),
        chartPanel(PT, { eyebrow: tr("Traksi", "Traction"), title: tr("GMV tumbuh 22% per bulan", "GMV growing 22% month on month"), text: tr("Tanpa iklan berbayar: 70% pedagang baru datang dari rekomendasi sesama pedagang.", "No paid ads: 70% of new vendors come from vendor referrals."), chart: { type: "bar", title: tr("GMV per bulan (miliar Rp)", "Monthly GMV (Rp billion)"), series: "GMV", rows: [tr("Jan", "Jan") + ", 21", "Feb, 26", "Mar, 33", tr("Apr", "Apr") + ", 41", tr("Mei", "May") + ", 50", "Jun, 62", "Jul, 76", tr("Agu", "Aug") + ", 96"], legend: false } }),
      ],
      traction: () => [
        pageHead(PT, { eyebrow: tr("Traksi", "Traction"), title: tr("Angka yang kami laporkan ke investor", "The numbers we report to investors") }),
        withFx(PT, statsBand(pro(PT), tr, { title: tr("Per Agustus 2026", "As of August 2026"), stats: [["38.000", tr("Pedagang aktif", "Active vendors")], ["Rp96 M", tr("GMV bulanan", "Monthly GMV")], ["64%", tr("Retensi 12 bulan", "12-month retention")], ["Rp4.200", tr("CAC per pedagang", "CAC per vendor")]] })),
        kpiStrip(PT, { items: [["71", "NPS", tr("+9 kuartal ini", "+9 this quarter")], ["2,1%", tr("Kredit macet", "Loan default"), tr("di bawah target", "below target")], ["14", tr("Kota", "Cities"), tr("+5 tahun ini", "+5 this year")]] }),
      ],
      product: () => [
        pageHead(PT, { eyebrow: tr("Produk", "Product"), title: tr("Dibuat bersama pedagang", "Built with vendors") }),
        bento(PT, { title: tr("Tiga fitur inti", "Three core features"), items: [{ title: tr("Catat pakai suara", "Voice logging"), text: tr("\"Bakso dua, es teh satu\" langsung jadi transaksi.", "\"Two meatball soups, one iced tea\" becomes a transaction."), image: asset("v4e-rocket"), wide: true }, { title: tr("Stok otomatis", "Auto stock"), text: tr("Resep memotong stok bahan.", "Recipes deduct ingredients."), icon: "▤", accent: true }, { title: tr("Modal usaha", "Working capital"), text: tr("Limit dari riwayat penjualan.", "Limits from sales history."), icon: "₹" }] }),
        notes(PT, { title: tr("Yang kami pelajari dari lapangan", "What the street taught us"), colors: ["#bef264", "#fdba74", "#fde047"], items: [[tr("Layar terang", "Bright screens"), tr("Dipakai di bawah matahari.", "Used under the sun.")], [tr("Offline dulu", "Offline first"), tr("Sinyal sering hilang.", "Signal drops often.")], [tr("Tombol besar", "Big buttons"), tr("Tangan sering basah.", "Hands are often wet.")]] }),
      ],
      team: () => [
        pageHead(PT, { eyebrow: tr("Tim", "Team"), title: tr("Pernah berdagang, pernah membangun produk", "We've sold on the street and built products") }),
        withFx(PT, teamCards(pro(PT), tr, { title: tr("Pendiri", "Founders"), members: [{ name: "Dimas Haryanto", role: tr("CEO · eks pedagang martabak", "CEO · former martabak vendor"), photo: asset("v4e-face-1") }, { name: "Citra Anindya", role: "CTO", photo: asset("v4e-face-2") }, { name: "Bonifasius Rato", role: tr("Kepala Kredit", "Head of Credit"), photo: asset("v4e-face-3") }] })),
        timelineD(PT, { title: tr("Perjalanan", "Milestones"), items: [["2023", tr("Pilot 40 gerobak", "40-cart pilot"), tr("Di satu pasar malam Semarang.", "At one Semarang night market.")], ["2024", tr("Pendanaan awal", "Seed round"), tr("Rp18 miliar (fiktif).", "Rp18 billion (fictional).")], ["2026", tr("38.000 pedagang", "38,000 vendors"), tr("14 kota.", "14 cities.")]] }),
      ],
      invest: () => [
        countdownD(PT, { eyebrow: tr("Putaran Seri A", "Series A round"), title: tr("Putaran ditutup 15 Desember 2026", "Round closes 15 December 2026"), text: tr("Target Rp160 miliar (fiktif) untuk ekspansi 30 kota dan produk kredit.", "Targeting Rp160 billion (fictional) to expand to 30 cities and grow credit."), target: "2026-12-15T17:00", finished: tr("Putaran telah ditutup", "The round has closed") }),
        chartPanel(PT, { title: tr("Penggunaan dana", "Use of funds"), text: tr("18 bulan landasan pacu.", "18 months of runway."), chart: { type: "doughnut", title: tr("Alokasi dana Seri A (%)", "Series A allocation (%)"), series: tr("Porsi", "Share"), rows: [tr("Ekspansi kota", "City expansion") + ", 40", tr("Produk kredit", "Credit product") + ", 30", tr("Teknologi", "Engineering") + ", 20", tr("Operasional", "Operations") + ", 10"] }, reverse: true }),
        formD(PT, { title: tr("Minta deck investor", "Request the investor deck"), info: [["Email", "ir@gerobakpintar.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: tr("Dana / institusi", "Fund / institution"), ph: tr("Nama dana", "Fund name") }, { kind: "input", label: "Email", ph: "nama@dana.vc", type: "email" }], submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ------ 19. Ruang Belajar Lintang — bimbel online (8 hlm) ----------- */
// Premium: mega-menu, typewriter, pro-pricing-cards, comparison-table, testimonial, countdown. Library: AOS + Animate + Tilt.

const EP: Palette = { ink: "#1f0b3a", muted: "#5b4a78", primary: "#9333ea", primaryDark: "#7e22ce", soft: "#f3e8ff", line: "#e9d5ff" };
const E = lookD(EP, { head: "Poppins", body: "Rubik", shape: "glass", radius: 20, bg: "#fcf9ff", alt: "#f3ecff", inv: "#1f0b3a", fx: { aos: "fade-up", animate: "fadeInLeft", tilt: true } });

const eHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Lintang", E, { variant: "pill", nav: megaD(E, [tr("Program", "Programmes"), "Try out", tr("Jadwal", "Schedule"), tr("Tutor", "Tutors"), tr("Biaya", "Fees")], tr("Daftar", "Enrol"), href("register")) });
const eFoot = (tr: Tr) =>
  footerD("Ruang Belajar Lintang", E, {
    variant: "columns",
    about: tr("Bimbel online kelas 4 SD sampai persiapan UTBK, kelas langsung maksimal 20 siswa.", "Online tutoring from grade 4 to university entrance, live classes of up to 20."),
    cols: [{ title: tr("Program", "Programmes"), items: ["SD", "SMP", "SMA", "UTBK"] }, { title: tr("Bantuan", "Help"), items: ["0811 9000 2525", "halo@lintang.id"] }],
    social: ["Instagram | https://instagram.com/ruanglintang", "TikTok | https://tiktok.com/@ruanglintang", "YouTube | https://youtube.com/@ruanglintang"],
    copy: tr("© 2026 Ruang Belajar Lintang. Konten contoh.", "© 2026 Ruang Belajar Lintang. Sample content."),
  });

export const educationBimbelOnline: TemplateContent = {
  brand: "Ruang Belajar Lintang",
  pages: [
    home(),
    pg("programs", ["program", "Program"], ["programmes", "Programmes"]),
    pg("tryout", ["try-out", "Try Out"], ["mock-tests", "Mock Tests"]),
    pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]),
    pg("tutors", ["tutor", "Tutor"], ["tutors", "Tutors"]),
    pg("pricing", ["biaya", "Biaya"], ["fees", "Fees"]),
    pg("results", ["hasil", "Hasil"], ["results", "Results"]),
    pg("register", ["daftar", "Daftar"], ["enrol", "Enrol"]),
  ],
  build: (key, tr, href) =>
    render(E, key, eHead(tr, href), eFoot(tr), {
      home: () => [
        heroGlass(E, {
          eyebrow: tr("Bimbel online", "Online tutoring"),
          title: tr("Kelas langsung, bukan video rekaman", "Live classes, not recorded videos"),
          titleNode: typerD(E, tr("Siap ", "Ready for "), ["UTBK", tr("ujian sekolah", "school exams"), tr("olimpiade", "olympiads")], { size: 52, color: "#ffffff" }),
          text: tr("Maksimal 20 siswa per kelas, tutor menyapa nama Anda, dan rekaman tersedia untuk mengulang.", "Up to 20 students per class, tutors who know your name, and recordings to rewatch."),
          gradient: ["#7e22ce", "#1f0b3a"],
          chips: [tr("Kelas langsung", "Live classes"), tr("Try out mingguan", "Weekly mocks"), tr("Konsultasi PTN", "University counselling")],
          image: asset("v4e-study"),
          alt: tr("Siswa belajar daring", "Student learning online"),
          actions: [[tr("Coba kelas gratis", "Try a free class"), href("register"), "light"]],
        }),
        cardsD(E, { title: tr("Kenapa Lintang", "Why Lintang"), cols: 3, items: [{ icon: "◉", title: tr("Kelas kecil", "Small classes"), text: tr("Bisa bertanya langsung.", "Ask questions live.") }, { icon: "▤", title: tr("Bank soal 18.000", "18,000-question bank"), text: tr("Dengan pembahasan video.", "With video walkthroughs.") }, { icon: "↗", title: tr("Rapor mingguan", "Weekly report"), text: tr("Untuk siswa & orang tua.", "For students & parents.") }] }),
        quotesD(E, { title: tr("Alumni Lintang", "Lintang alumni"), items: [{ quote: tr("Skor UTBK naik 140 poin dalam 4 bulan.", "My UTBK score rose 140 points in 4 months."), author: "Naufal Rizky", role: tr("Diterima di FK", "Admitted to medicine"), avatar: asset("v4e-face-1") }, { quote: tr("Tutornya sabar mengulang sampai paham.", "Tutors patiently re-explain until it clicks."), author: "Kezia Natalia", role: tr("Kelas 9", "Grade 9"), avatar: asset("v4e-face-2") }] }),
      ],
      programs: () => [
        pageHead(E, { eyebrow: tr("Program", "Programmes"), title: tr("Program per jenjang", "Programmes by level") }),
        tabsD(E, { title: tr("Pilih jenjang", "Choose a level"), tabs: [["SD", tr("Kelas 4–6: matematika, IPA, dan literasi. 2× seminggu.", "Grades 4–6: maths, science and literacy. Twice a week.")], ["SMP", tr("Kelas 7–9: semua mapel ujian + persiapan masuk SMA favorit.", "Grades 7–9: all exam subjects + prep for top high schools.")], ["SMA", tr("Kelas 10–12: mapel sekolah sesuai kurikulum terbaru.", "Grades 10–12: school subjects on the latest curriculum.")], ["UTBK", tr("TPS, literasi, dan penalaran matematika; 5× seminggu.", "Scholastic, literacy and quantitative reasoning; 5 times a week.")]] }),
        rail(E, { title: tr("Siklus belajar mingguan", "Weekly learning cycle"), steps: [[tr("Kelas", "Class"), tr("Konsep + latihan langsung.", "Concepts + live practice.")], [tr("PR", "Homework"), tr("10 soal adaptif.", "10 adaptive questions.")], [tr("Klinik", "Clinic"), tr("Tanya jawab kecil.", "Small-group Q&A.")], [tr("Kuis", "Quiz"), tr("Nilai masuk rapor.", "Scores go to the report.")]] }),
      ],
      tryout: () => [
        countdownD(E, { eyebrow: "Try out", title: tr("Try out UTBK nasional gratis", "Free national UTBK mock test"), text: tr("Diikuti 12.000 peserta; dapatkan peringkat dan prediksi peluang PTN.", "12,000 participants; get your ranking and admission chances."), target: "2026-11-29T08:00", finished: tr("Try out sedang berlangsung", "The mock is under way"), actions: [[tr("Daftar gratis", "Register free"), href("register"), "light"]] }),
        faqD(E, { title: tr("Tentang try out", "About mock tests"), items: [[tr("Berapa lama?", "How long?"), tr("195 menit sesuai format resmi.", "195 minutes, matching the official format.")], [tr("Kapan hasil keluar?", "When are results out?"), tr("Hari Senin berikutnya.", "The following Monday.")]] }),
      ],
      schedule: () => [
        pageHead(E, { eyebrow: tr("Jadwal", "Schedule"), title: tr("Jadwal kelas langsung", "Live class schedule") }),
        tableD(E, { title: tr("Minggu ini", "This week"), columns: [tr("Kelas", "Class"), tr("Hari", "Day"), tr("Jam (WIB)", "Time (WIB)"), "Tutor"], rows: [[tr("UTBK Penalaran", "UTBK Reasoning"), tr("Senin", "Mon"), "19.00", "Kak Arga"], [tr("SMP Matematika", "Grade 7–9 Maths"), tr("Selasa", "Tue"), "16.00", "Kak Fira"], [tr("SD IPA", "Primary Science"), tr("Rabu", "Wed"), "15.30", "Kak Bayu"], [tr("SMA Fisika", "High-school Physics"), tr("Kamis", "Thu"), "19.00", "Kak Dewi"]] }),
      ],
      tutors: () => [
        pageHead(E, { eyebrow: "Tutor", title: tr("Tutor lulusan kampus pilihan", "Tutors from top campuses") }),
        polaroids(E, { title: tr("Kenalan dengan kakak tutor", "Meet the tutors"), items: [[asset("v4e-face-1"), "Kak Arga · UTBK"], [asset("v4e-face-2"), tr("Kak Fira · Matematika", "Kak Fira · Maths")], [asset("v4e-face-3"), tr("Kak Bayu · IPA", "Kak Bayu · Science")], [asset("v4e-face-4"), tr("Kak Dewi · Fisika", "Kak Dewi · Physics")]] }),
      ],
      pricing: () => [
        pageHead(E, { eyebrow: tr("Biaya", "Fees"), title: tr("Biaya per semester", "Fees per semester") }),
        withFx(E, pricingCards(pro(E), tr, { title: tr("Paket belajar", "Study packages"), plans: [{ name: "SD", price: "Rp1,2jt", period: tr("/semester", "/semester"), text: tr("2× seminggu", "2× a week"), features: [tr("Kelas langsung", "Live classes"), tr("Rapor mingguan", "Weekly reports")], cta: { label: tr("Daftar", "Enrol"), href: href("register") } }, { name: "SMP/SMA", price: "Rp1,9jt", period: tr("/semester", "/semester"), text: tr("3× seminggu", "3× a week"), features: [tr("Semua mapel ujian", "All exam subjects"), tr("Klinik PR", "Homework clinic"), tr("Try out", "Mock tests")], cta: { label: tr("Daftar", "Enrol"), href: href("register") }, featured: true }, { name: "UTBK", price: "Rp3,4jt", period: tr("/6 bulan", "/6 months"), text: tr("5× seminggu", "5× a week"), features: [tr("Try out mingguan", "Weekly mocks"), tr("Konsultasi PTN", "University counselling")], cta: { label: tr("Daftar", "Enrol"), href: href("register") } }] })),
        compareD(E, { title: tr("Bandingkan paket", "Compare packages"), columns: ["SD", "SMP/SMA", "UTBK"], rows: [tr("Kelas per minggu | 2 | 3 | 5", "Classes per week | 2 | 3 | 5"), tr("Try out | bulanan | 2 minggu | mingguan", "Mock tests | monthly | fortnightly | weekly"), tr("Konsultasi PTN | tidak | tidak | ya", "University counselling | no | no | yes")], highlight: 3, caption: tr("Harga contoh.", "Sample prices.") }),
      ],
      results: () => [
        pageHead(E, { eyebrow: tr("Hasil", "Results"), title: tr("Hasil siswa tahun ajaran 2025/2026", "Student results for 2025/26") }),
        numbers(E, { items: [["1.420", tr("Lolos PTN", "University admits")], ["+118", tr("Rata-rata kenaikan skor UTBK", "Avg. UTBK score gain")], ["94%", tr("Naik nilai rapor", "Improved report grades")]] }),
        editorial(E, { title: tr("Cara kami mengukur", "How we measure"), cols: [[tr("Skor awal", "Baseline"), tr("Diambil dari try out pertama.", "Taken from the first mock.")], [tr("Skor akhir", "Final score"), tr("Dari hasil resmi yang dilaporkan siswa.", "From official results reported by students.")]] }),
      ],
      register: () => [
        pageHead(E, { eyebrow: tr("Daftar", "Enrol"), title: tr("Coba satu kelas gratis", "Try one class free") }),
        formD(E, { title: tr("Formulir pendaftaran", "Enrolment form"), info: [["WhatsApp", "0811 9000 2525"]], fields: [{ kind: "input", label: tr("Nama siswa", "Student name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: tr("Jenjang", "Level"), ph: tr("Pilih", "Choose"), options: ["SD", "SMP", "SMA", "UTBK"] }, { kind: "input", label: tr("WhatsApp orang tua", "Parent's WhatsApp"), ph: "08xx" }], submit: tr("Daftar", "Enrol") }),
      ],
    }),
};

/* ------- 20. Gudang Simpul — gudang & fulfillment (6 hlm, grafik) ----- */
// Premium: pro-services-split, progress, comparison-table. Library: AOS. Grafik: bar + pie.

const LP: Palette = { ink: "#26170a", muted: "#6b5440", primary: "#b45309", primaryDark: "#92400e", soft: "#fef3c7", line: "#fcd34d" };
const LG = lookD(LP, { head: "Montserrat", body: "JetBrains Mono", shape: "retro", radius: 8, bg: "#fffdf7", alt: "#fdf6e3", inv: "#26170a", fx: { aos: "fade-left" }, upper: true });

const lFoot = (tr: Tr) =>
  footerD("Gudang Simpul", LG, {
    variant: "columns",
    about: tr("Gudang & fulfillment untuk brand online: simpan, kemas, dan kirim di hari yang sama.", "Warehousing & fulfilment for online brands: store, pack and ship the same day."),
    cols: [{ title: tr("Gudang", "Warehouses"), items: ["Cikarang", "Sidoarjo", "Makassar"] }, { title: tr("Kontak", "Contact"), items: ["sales@gudangsimpul.id", "021 8990 4400"] }],
    social: ["LinkedIn | https://linkedin.com/company/gudangsimpul", "Instagram | https://instagram.com/gudangsimpul"],
    copy: tr("© 2026 Gudang Simpul. Konten & angka contoh.", "© 2026 Gudang Simpul. Sample content & figures."),
  });

export const logisticsGudang: TemplateContent = {
  brand: "Gudang Simpul",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("capacity", ["kapasitas", "Kapasitas"], ["capacity", "Capacity"]), pg("pricing", ["tarif", "Tarif"], ["rates", "Rates"]), pg("locations", ["lokasi", "Lokasi"], ["locations", "Locations"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(LG, key, headerD("Gudang Simpul", LG, { variant: "split", info: [tr("Potong waktu pesanan 15.00", "Order cut-off 3pm"), "021 8990 4400"], cta: [tr("Minta tarif", "Get rates"), href("contact")] }), lFoot(tr), {
      home: () => [
        heroSearch(LG, {
          eyebrow: tr("Fulfillment e-commerce", "E-commerce fulfilment"),
          title: tr("Pesanan masuk pagi, sampai pembeli besok", "Ordered in the morning, delivered tomorrow"),
          text: tr("Tiga gudang, 14.000 m², dan 99,6% akurasi pengemasan. Cek estimasi biaya untuk brand Anda.", "Three warehouses, 14,000 m² and 99.6% picking accuracy. Estimate the cost for your brand."),
          fields: [{ kind: "select", label: tr("Pesanan per bulan", "Orders per month"), ph: tr("Pilih", "Choose"), options: ["< 1.000", "1.000–5.000", "5.000–20.000", "> 20.000"] }, { kind: "select", label: tr("Gudang", "Warehouse"), ph: tr("Pilih", "Choose"), options: ["Cikarang", "Sidoarjo", "Makassar"] }],
          submit: tr("Hitung estimasi", "Estimate cost"),
          tags: [tr("Kosmetik", "Cosmetics"), tr("Fesyen", "Fashion"), tr("Makanan kering", "Dry food"), tr("Elektronik kecil", "Small electronics")],
        }),
        withFx(LG, servicesSplit(pro(LG), tr, { eyebrow: tr("Layanan", "Services"), title: tr("Dari dok bongkar sampai kurir", "From loading dock to courier"), image: asset("v4e-warehouse"), imageAlt: tr("Rak gudang dan forklift", "Warehouse racks and forklift"), items: [{ icon: "01", title: tr("Penerimaan", "Inbound"), text: tr("Hitung & foto setiap karton.", "Every carton counted & photographed.") }, { icon: "02", title: tr("Penyimpanan", "Storage"), text: tr("Rak, palet, dan ruang sejuk.", "Shelving, pallets and cool rooms.") }, { icon: "03", title: tr("Kemas & kirim", "Pick, pack & ship"), text: tr("8 kurir terintegrasi.", "8 integrated couriers.") }], cta: { label: tr("Lihat layanan", "See services"), href: href("services") } })),
        chartPanel(LG, { eyebrow: tr("Kapasitas harian", "Daily throughput"), title: tr("Siap untuk tanggal kembar", "Ready for double-date sales"), text: tr("Kami menambah shift dan meja kemas sebelum puncak promo.", "We add shifts and packing tables ahead of peak sales."), chart: { type: "bar", title: tr("Pesanan dikirim per hari (ribu)", "Orders shipped per day (thousand)"), series: tr("Hari biasa, Hari promo", "Normal day, Sale day"), rows: ["Cikarang, 18, 46", "Sidoarjo, 9, 24", "Makassar, 4, 11"], c2: "#1f2937" }, kpis: [["99,6%", tr("akurasi", "accuracy")], ["< 4 jam", tr("kemas", "to pack")]] }),
      ],
      services: () => [
        pageHead(LG, { eyebrow: tr("Layanan", "Services"), title: tr("Layanan gudang lengkap", "Full warehouse services") }),
        cardsD(LG, { title: tr("Tambahan yang sering diminta", "Popular add-ons"), cols: 4, items: [{ icon: "▣", title: tr("Kemasan kustom", "Custom packaging"), text: tr("Kotak bermerek & kartu ucapan.", "Branded boxes & notes.") }, { icon: "⟲", title: tr("Retur", "Returns"), text: tr("Cek kondisi & stok ulang.", "Inspect & restock.") }, { icon: "❄", title: tr("Ruang sejuk", "Cool room"), text: "18–22 °C" }, { icon: "⎘", title: tr("Kitting", "Kitting"), text: tr("Rakit bundel promo.", "Assemble promo bundles.") }] }),
        board(LG, { title: tr("Jadwal jemput kurir — Cikarang", "Courier pickups — Cikarang"), head: [tr("Jam", "Time"), tr("Kurir", "Courier"), tr("Layanan", "Service"), tr("Status", "Status")], rows: [["10:00", "Kilat Ekspres", tr("Reguler", "Regular"), tr("Selesai", "Done")], ["13:00", "Paket Nusantara", tr("Kargo", "Cargo"), tr("Memuat", "Loading")], ["16:30", "Kilat Ekspres", tr("Sehari sampai", "Same day"), tr("Terjadwal", "Scheduled")], ["19:00", "Antar Cepat", tr("Instan", "Instant"), tr("Terjadwal", "Scheduled")]] }),
      ],
      capacity: () => [
        pageHead(LG, { eyebrow: tr("Kapasitas", "Capacity"), title: tr("Ruang yang tersedia kuartal ini", "Space available this quarter") }),
        progressD(LG, { title: tr("Keterisian gudang", "Warehouse occupancy"), bars: [["Cikarang", 86], ["Sidoarjo", 63], ["Makassar", 41]], side: { image: asset("v4e-warehouse"), alt: tr("Rak gudang", "Warehouse racks") } }),
        chartDuo(LG, { title: tr("Isi gudang saat ini", "What's in our warehouses"), charts: [{ type: "pie", title: tr("Inventaris per kategori (%)", "Inventory by category (%)"), series: tr("Porsi", "Share"), rows: [tr("Kosmetik", "Cosmetics") + ", 34", tr("Fesyen", "Fashion") + ", 28", tr("Makanan kering", "Dry food") + ", 18", tr("Elektronik", "Electronics") + ", 12", tr("Lainnya", "Other") + ", 8"] }, { type: "line", title: tr("Pesanan per bulan (ribu)", "Orders per month (thousand)"), series: tr("2026", "2026"), rows: ["Apr, 420", tr("Mei", "May") + ", 455", "Jun, 470", "Jul, 512", tr("Agu", "Aug") + ", 548", "Sep, 590"], legend: false }] }),
      ],
      pricing: () => [
        pageHead(LG, { eyebrow: tr("Tarif", "Rates"), title: tr("Bayar sesuai pemakaian", "Pay for what you use") }),
        compareD(LG, { title: tr("Paket fulfillment", "Fulfilment plans"), columns: [tr("Rintis", "Starter"), tr("Tumbuh", "Growth"), tr("Skala", "Scale")], rows: [tr("Pesanan/bulan | < 1.000 | 1.000–10.000 | > 10.000", "Orders/month | < 1,000 | 1,000–10,000 | > 10,000"), tr("Biaya kemas | Rp3.500 | Rp2.800 | nego", "Pick & pack | Rp3,500 | Rp2,800 | custom"), tr("Sewa rak | Rp45rb/m³ | Rp38rb/m³ | nego", "Shelf rent | Rp45k/m³ | Rp38k/m³ | custom"), tr("Manajer akun | tidak | ya | ya", "Account manager | no | yes | yes")], highlight: 2, caption: tr("Tarif contoh, belum PPN.", "Sample rates, excl. VAT.") }),
        faqD(LG, { title: tr("Pertanyaan tarif", "Rate questions"), items: [[tr("Ada biaya minimum?", "Is there a minimum?"), tr("Tidak untuk paket Rintis.", "Not on the Starter plan.")], [tr("Kontrak berapa lama?", "Contract length?"), tr("Bulanan, berhenti dengan pemberitahuan 30 hari.", "Monthly, cancel with 30 days' notice.")]] }),
      ],
      locations: () => [
        pageHead(LG, { eyebrow: tr("Lokasi", "Locations"), title: tr("Tiga gudang, dekat pembeli Anda", "Three warehouses near your buyers") }),
        locations(LG, { title: tr("Jaringan gudang", "Warehouse network"), image: asset("v4e-route"), places: [["Cikarang", tr("Kawasan Industri Jababeka Blok F", "Jababeka Industrial Estate Block F"), "8.000 m²"], ["Sidoarjo", "Jl. Raya Buduran 88", "4.000 m²"], ["Makassar", tr("Kawasan Pergudangan Parangloe", "Parangloe Warehousing Area"), "2.000 m²"]] }),
      ],
      contact: () => [
        pageHead(LG, { eyebrow: tr("Kontak", "Contact"), title: tr("Minta penawaran dalam 1 hari kerja", "Get a quote within 1 working day") }),
        formD(LG, { title: tr("Minta tarif", "Request rates"), info: [["Email", "sales@gudangsimpul.id"], [tr("Telepon", "Phone"), "021 8990 4400"]], fields: [{ kind: "input", label: tr("Nama brand", "Brand name"), ph: tr("Nama brand", "Brand name") }, { kind: "select", label: tr("Pesanan per bulan", "Orders per month"), ph: tr("Pilih", "Choose"), options: ["< 1.000", "1.000–5.000", "5.000–20.000", "> 20.000"] }, { kind: "input", label: "Email", ph: "nama@brand.id", type: "email" }], submit: tr("Kirim", "Send") }),
      ],
    }),
};
