import { asset } from "../../../assets";
import { linkButton, type Palette } from "../../../build";
import { ctaBand, portfolioMosaic, servicesSplit, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent } from "../../../types";
import { centeredHeader, footer, header } from "../../pro/kit";
import {
  FONTS,
  bigQuote,
  cards,
  compare,
  contact,
  counter,
  countdownBand,
  ctaBox,
  faqList,
  figures,
  footerSlim,
  gallery,
  headerBar,
  headerLeft,
  heroCover,
  heroSplit,
  home,
  jobs,
  listings,
  logos,
  look,
  menuBoard,
  notice,
  page,
  pageBanner,
  people,
  pg,
  plans,
  posts,
  process,
  progressBars,
  quotes,
  slider,
  story,
  tableBlock,
  timeline,
  videoBlock,
} from "./kitA";

/* ================================================================== */
/* Template v2 A6–A10: Nirlaba, Pernikahan, Band, Konstruksi, Resort.    */
/* ================================================================== */

/* ------------------- 6. Yayasan Peduli Sesama (6 hlm) ---------------- */

const YP: Palette = { ink: "#431407", muted: "#7c5a4a", primary: "#ea580c", primaryDark: "#c2410c", soft: "#fff7ed", line: "#fed7aa" };
const yp = look(YP, { bg: "#ffffff", alt: "#fff7ed", dark: "#431407", radius: 20, headFont: FONTS.rounded, font: FONTS.rounded });

export const nonprofitPeduli: TemplateContent = {
  brand: "Yayasan Peduli Sesama",
  pages: [
    home(),
    pg("programs", ["program", "Program"], ["programs", "Programs"]),
    pg("impact", ["dampak", "Dampak"], ["impact", "Impact"]),
    pg("donate", ["donasi", "Donasi"], ["donate", "Donate"]),
    pg("volunteer", ["relawan", "Relawan"], ["volunteer", "Volunteer"]),
    pg("news", ["kabar", "Kabar"], ["news", "News"]),
  ],
  build: (key, tr, href) => {
    const head = header("Peduli Sesama", YP, { font: FONTS.rounded, cta: linkButton(tr("Donasi sekarang", "Donate now"), href("donate"), "primary", YP) });
    const end = footer(
      "Yayasan Peduli Sesama",
      tr("Yayasan terdaftar Kemenkumham sejak 2009. Laporan keuangan diaudit setiap tahun.", "Registered foundation since 2009. Financial statements audited every year."),
      [
        { title: tr("Program", "Programs"), items: [tr("Beasiswa anak", "Child scholarships"), tr("Air bersih", "Clean water"), tr("Tanggap bencana", "Disaster relief")] },
        { title: tr("Kontak", "Contact"), items: ["Jl. Cikini Raya 44, Jakarta", "+62 21 3190 4455", "BCA 123 456 7890 a.n. Yayasan Peduli Sesama"] },
      ],
      tr("© 2026 Yayasan Peduli Sesama. Data contoh.", "© 2026 Yayasan Peduli Sesama. Sample data."),
      "#2b0d03",
    );
    switch (key) {
      case "programs":
        return page(yp, [
          head,
          pageBanner(yp, { eyebrow: tr("Program", "Programs"), title: tr("Tiga program, satu tujuan", "Three programs, one purpose"), text: tr("Kami fokus di daerah 3T: tertinggal, terdepan, terluar.", "We focus on Indonesia's most remote and underserved regions."), align: "center" }),
          story(yp, {
            eyebrow: tr("Pendidikan", "Education"),
            title: tr("Beasiswa Anak Pesisir", "Coastal Children Scholarship"),
            paras: [tr("Biaya sekolah, seragam, dan pendamping belajar untuk 1.200 anak nelayan di Maluku dan NTT.", "School fees, uniforms, and study mentors for 1,200 fishermen's children in Maluku and NTT.")],
            bullets: [tr("Rp150 ribu/bulan untuk satu anak", "Rp150k/month for one child"), tr("Rapor dikirim ke donatur tiap semester", "Report cards sent to donors each semester")],
            image: asset("v2a-care-edu"),
            alt: tr("Anak belajar", "Children studying"),
          }),
          story(yp, {
            eyebrow: tr("Kesehatan", "Health"),
            title: tr("Sumur & Air Bersih", "Wells & Clean Water"),
            paras: [tr("Sumur bor dan tandon 5.000 liter untuk desa yang berjalan lebih dari 2 km mengambil air.", "Boreholes and 5,000-liter tanks for villages walking over 2 km for water.")],
            bullets: [tr("1 sumur melayani ±300 warga", "1 well serves about 300 people"), tr("Dikelola karang taruna setempat", "Run by local youth groups")],
            image: asset("v2a-care-hero"),
            alt: tr("Air bersih", "Clean water"),
            reverse: true,
            bg: yp.alt,
          }),
          gallery(yp, {
            title: tr("Dari lapangan", "From the field"),
            images: [
              [asset("v2a-care-edu"), tr("Kelas sore di Saumlaki", "Afternoon class in Saumlaki")],
              [asset("v2a-care-hero"), tr("Sumur ke-48 di Sumba", "Well #48 in Sumba")],
              [asset("v2a-care-edu"), tr("Posko banjir Demak", "Flood post in Demak")],
            ],
          }),
          end,
        ]);
      case "impact":
        return page(yp, [
          head,
          counter(yp, { eyebrow: tr("Dampak 2025", "2025 impact"), title: tr("Setiap rupiah tercatat", "Every rupiah accounted for"), items: [tr("1.200 | Anak penerima beasiswa", "1,200 | Scholarship children"), tr("48 | Sumur dibangun", "48 | Wells built"), tr("14.000 | Warga terlayani air bersih", "14,000 | People with clean water"), tr("9 | Respons bencana", "9 | Disaster responses")] }),
          tableBlock(yp, {
            eyebrow: tr("Laporan keuangan 2025 (diaudit)", "2025 financial report (audited)"),
            title: tr("Ke mana donasi Anda pergi", "Where your donation goes"),
            columns: [tr("Pos", "Item"), tr("Jumlah", "Amount"), tr("Persentase", "Share")],
            rows: [
              [tr("Program pendidikan", "Education programs"), "Rp4,2 M", "48%"],
              [tr("Program air bersih", "Clean water programs"), "Rp2,6 M", "30%"],
              [tr("Tanggap bencana", "Disaster relief"), "Rp1,1 M", "13%"],
              [tr("Operasional & audit", "Operations & audit"), "Rp0,8 M", "9%"],
            ],
            note: tr("Diaudit oleh KAP independen. Laporan lengkap tersedia atas permintaan.", "Audited by an independent firm. Full report available on request."),
            bg: yp.alt,
          }),
          timeline(yp, {
            eyebrow: tr("Perjalanan", "Milestones"),
            title: tr("17 tahun berbagi", "17 years of giving"),
            steps: [
              ["2009", tr("Berdiri", "Founded"), tr("10 relawan membagikan buku di Cilincing.", "10 volunteers handing out books in Cilincing.")],
              ["2015", tr("Sumur pertama", "First well"), tr("Desa Lamboya, Sumba Barat.", "Lamboya village, West Sumba.")],
              ["2021", tr("1.000 penerima beasiswa", "1,000 scholars"), tr("Program meluas ke Maluku.", "Program expands to Maluku.")],
            ],
          }),
          end,
        ]);
      case "donate":
        return page(yp, [
          head,
          plans(yp, {
            eyebrow: tr("Donasi rutin", "Monthly giving"),
            title: tr("Pilih cara Anda membantu", "Choose how you help"),
            text: tr("Donasi rutin membuat program bisa direncanakan setahun ke depan.", "Monthly gifts let us plan programs a year ahead."),
            items: [
              { plan: tr("Sahabat", "Friend"), price: "Rp50rb", period: tr("/bulan", "/month"), description: tr("Buku & alat tulis 1 anak.", "Books & supplies for 1 child."), features: [tr("Laporan email bulanan", "Monthly email report")], buttonText: tr("Donasi", "Give"), buttonHref: "#donasi" },
              { plan: tr("Orang Tua Asuh", "Sponsor"), price: "Rp150rb", period: tr("/bulan", "/month"), description: tr("Biaya sekolah 1 anak penuh.", "Full schooling for 1 child."), features: [tr("Rapor tiap semester", "Semester report cards"), tr("Surat dari anak asuh", "Letters from your child")], buttonText: tr("Jadi orang tua asuh", "Become a sponsor"), buttonHref: "#donasi", featured: true, badge: tr("Berdampak", "High impact") },
              { plan: tr("Penggerak", "Champion"), price: "Rp500rb", period: tr("/bulan", "/month"), description: tr("Patungan 1 sumur per tahun.", "Co-fund 1 well a year."), features: [tr("Foto progres sumur", "Well progress photos"), tr("Nama di prasasti", "Name on the plaque")], buttonText: tr("Donasi", "Give"), buttonHref: "#donasi" },
            ],
          }),
          faqList(yp, {
            title: tr("Transparansi donasi", "Donation transparency"),
            items: [
              [tr("Apakah donasi bisa mengurangi pajak?", "Is my donation tax-deductible?"), tr("Kami menerbitkan bukti setor untuk keperluan pelaporan pajak sesuai ketentuan.", "We issue receipts you can use for tax reporting according to regulations.")],
              [tr("Berapa persen untuk operasional?", "How much goes to operations?"), tr("Maksimal 10%, sesuai laporan audit 2025 sebesar 9%.", "At most 10%; it was 9% in the 2025 audit.")],
              [tr("Bisa berhenti donasi rutin?", "Can I stop monthly giving?"), tr("Bisa kapan saja lewat email atau WhatsApp.", "Anytime via email or WhatsApp.")],
            ],
          }),
          end,
        ]);
      case "volunteer":
        return page(yp, [
          head,
          process(yp, {
            eyebrow: tr("Relawan", "Volunteers"),
            title: tr("Bergabung dalam 4 langkah", "Join in 4 steps"),
            steps: [
              [tr("Daftar", "Sign up"), tr("Isi formulir singkat.", "Fill in a short form.")],
              [tr("Orientasi", "Orientation"), tr("Sesi online 2 jam.", "A 2-hour online session.")],
              [tr("Pilih tugas", "Pick a role"), tr("Mengajar, logistik, atau media.", "Teaching, logistics, or media.")],
              [tr("Berangkat", "Deploy"), tr("Minimal 3 hari di lapangan.", "At least 3 days in the field.")],
            ],
          }),
          contact(yp, {
            eyebrow: tr("Formulir relawan", "Volunteer form"),
            title: tr("Waktu Anda sangat berarti", "Your time matters"),
            text: tr("Kami menghubungi calon relawan setiap Senin.", "We contact new applicants every Monday."),
            info: [[tr("Koordinator relawan", "Volunteer coordinator"), "Mbak Sari · +62 812 1100 9090"], [tr("Pembekalan berikutnya", "Next orientation"), tr("Sabtu, 7 November 2026", "Saturday, November 7, 2026")]],
            fields: [
              { kind: "input", label: tr("Nama lengkap", "Full name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Kota", "City"), ph: "Jakarta" },
              { kind: "select", label: tr("Minat", "Interest"), ph: tr("Pilih bidang", "Choose an area"), options: [tr("Mengajar", "Teaching"), tr("Logistik", "Logistics"), tr("Kesehatan", "Health"), tr("Foto & video", "Photo & video")] },
              { kind: "check", label: tr("Saya bersedia ditugaskan di luar kota", "I'm willing to travel") },
            ],
            submit: tr("Daftar jadi relawan", "Apply to volunteer"),
          }),
          end,
        ]);
      case "news":
        return page(yp, [
          head,
          pageBanner(yp, { eyebrow: tr("Kabar", "News"), title: tr("Kabar dari lapangan", "Stories from the field") }),
          posts(yp, {
            title: tr("Terbaru", "Latest"),
            readLabel: tr("Baca", "Read"),
            items: [
              { image: asset("v2a-care-hero"), tag: tr("Air bersih", "Water"), title: tr("Sumur ke-50 mengalir di Waingapu", "Well #50 flows in Waingapu"), text: tr("Warga tidak lagi berjalan 3 km setiap pagi.", "Villagers no longer walk 3 km every morning."), date: "10 Okt 2026", href: href("impact") },
              { image: asset("v2a-care-edu"), tag: tr("Pendidikan", "Education"), title: tr("120 anak lulus SD tahun ini", "120 kids finish primary school"), text: tr("Tiga di antaranya lanjut ke SMP favorit di Ambon.", "Three are heading to top middle schools in Ambon."), date: "28 Sep 2026", href: href("programs") },
              { image: asset("v2a-care-hero"), tag: tr("Bencana", "Relief"), title: tr("Respons cepat banjir Demak", "Rapid response to the Demak floods"), text: tr("2.000 paket sembako dalam 48 jam.", "2,000 food packs in 48 hours."), date: "12 Sep 2026", href: href("programs") },
            ],
          }),
          end,
        ]);
      default:
        return page(yp, [
          head,
          heroCover(yp, {
            badge: tr("Laporan diaudit setiap tahun", "Audited every year"),
            title: tr("Satu kebaikan kecil, satu desa berubah", "One small kindness, one village changed"),
            text: tr("Bersama 18.000 donatur, kami membangun sumur, menyekolahkan anak pesisir, dan hadir saat bencana.", "With 18,000 donors, we build wells, keep coastal children in school, and show up when disaster strikes."),
            actions: [[tr("Donasi sekarang", "Donate now"), href("donate"), "light"], [tr("Lihat program", "See programs"), href("programs"), "outline"]],
            gradient: ["#c2410c", "#7c2d12", 160],
            image: asset("v2a-care-hero"),
            alt: tr("Hati di atas tangan", "A heart above hands"),
          }),
          progressBars(yp, {
            eyebrow: tr("Kampanye aktif", "Active campaigns"),
            title: tr("Bantu kami mencapai target", "Help us reach the goal"),
            text: tr("Diperbarui setiap Jumat.", "Updated every Friday."),
            bars: [[tr("10 sumur untuk Sumba Timur", "10 wells for East Sumba"), 64], [tr("Seragam 500 anak Maluku", "Uniforms for 500 kids in Maluku"), 82], [tr("Dana siaga bencana", "Disaster readiness fund"), 41]],
            side: { image: asset("v2a-care-edu"), alt: tr("Anak sekolah", "Schoolchildren") },
          }),
          cards(yp, {
            eyebrow: tr("Cara membantu", "Ways to help"),
            title: tr("Pilih peran Anda", "Choose your role"),
            items: [
              { icon: "💛", title: tr("Donasi rutin", "Give monthly"), text: tr("Mulai Rp50 ribu per bulan.", "From Rp50k a month."), meta: tr("Paling berdampak", "Most impact") },
              { icon: "🙋", title: tr("Jadi relawan", "Volunteer"), text: tr("Mengajar atau bantu logistik.", "Teach or help with logistics.") },
              { icon: "🏢", title: tr("Mitra perusahaan", "Corporate partner"), text: tr("Program CSR dengan laporan dampak.", "CSR programs with impact reports.") },
            ],
            bg: yp.alt,
          }),
          bigQuote(yp, { text: tr("Dulu anak saya bolos untuk ambil air. Sekarang dia juara kelas.", "My son used to skip school to fetch water. Now he tops his class."), name: "Mama Yuliana", role: tr("Warga Desa Lamboya, Sumba", "Lamboya village, Sumba") }),
          ctaBox(yp, { title: tr("Rp150 ribu = satu anak tetap sekolah", "Rp150k = one child stays in school"), actions: [[tr("Jadi orang tua asuh", "Become a sponsor"), href("donate"), "light"], [tr("Daftar relawan", "Volunteer"), href("volunteer"), "outline"]], align: "center" }),
          end,
        ]);
    }
  },
};

/* ------------------- 7. Janji Abadi Wedding (5 hlm) ------------------ */

const JA: Palette = { ink: "#3d3a2f", muted: "#6f6a58", primary: "#8a7b5c", primaryDark: "#6b5d40", soft: "#f4f1ea", line: "#e2dccb" };
const ja = look(JA, { bg: "#fdfcf8", alt: "#f4f1ea", dark: "#2f2d25", radius: 2, headFont: FONTS.elegant, font: FONTS.elegant, page: "#fdfcf8" });

export const weddingJanji: TemplateContent = {
  brand: "Janji Abadi Wedding",
  pages: [home(), pg("packages", ["paket", "Paket"], ["packages", "Packages"]), pg("stories", ["kisah-pernikahan", "Kisah Pernikahan"], ["real-weddings", "Real Weddings"]), pg("planning", ["perencanaan", "Perencanaan"], ["planning", "Planning"]), pg("contact", ["konsultasi", "Konsultasi"], ["enquire", "Enquire"])],
  build: (key, tr, href) => {
    const head = centeredHeader("Janji Abadi", JA, { bg: "#fdfcf8", font: FONTS.elegant });
    const end = footerSlim(ja, "Janji Abadi", ["Instagram", "Pinterest", "WhatsApp", tr("Yogyakarta & Bali", "Yogyakarta & Bali")], tr("© 2026 Janji Abadi Wedding Organizer", "© 2026 Janji Abadi Wedding Organizer"), { bg: "#2f2d25" });
    switch (key) {
      case "packages":
        return page(ja, [
          head,
          pageBanner(ja, { eyebrow: tr("Paket 2026–2027", "2026–2027 packages"), title: tr("Disusun untuk setiap skala cinta", "Made for every scale of love"), text: tr("Semua paket termasuk koordinator hari-H dan rapat teknis dengan vendor.", "Every package includes a day-of coordinator and vendor technical meetings."), align: "center" }),
          plans(ja, {
            title: tr("Pilih paket", "Choose a package"),
            items: [
              { plan: "Intimate", price: "Rp45jt", period: "", description: tr("Hingga 80 tamu.", "Up to 80 guests."), features: [tr("Koordinasi 3 bulan", "3-month coordination"), tr("Dekorasi taman", "Garden décor"), tr("Katering prasmanan", "Buffet catering")], buttonText: tr("Konsultasi", "Enquire"), buttonHref: href("contact") },
              { plan: "Classic", price: "Rp120jt", period: "", description: tr("Hingga 300 tamu.", "Up to 300 guests."), features: [tr("Koordinasi 6 bulan", "6-month coordination"), tr("Dekorasi pelaminan adat", "Traditional stage décor"), tr("Foto & video", "Photo & video"), "MC & entertainment"], buttonText: tr("Konsultasi", "Enquire"), buttonHref: href("contact"), featured: true, badge: tr("Favorit", "Favorite") },
              { plan: "Grand", price: "Rp280jt", period: "", description: tr("Hingga 800 tamu.", "Up to 800 guests."), features: [tr("Koordinasi 12 bulan", "12-month coordination"), tr("Dua acara (akad & resepsi)", "Two events (ceremony & reception)"), tr("Tim 25 orang", "25-person team"), tr("Same-day edit video", "Same-day edit video")], buttonText: tr("Konsultasi", "Enquire"), buttonHref: href("contact") },
            ],
          }),
          tableBlock(ja, {
            title: tr("Yang termasuk dalam setiap paket", "What's included"),
            columns: [tr("Layanan", "Service"), "Intimate", "Classic", "Grand"],
            rows: [
              [tr("Rapat perencanaan", "Planning meetings"), "3", "6", tr("Tanpa batas", "Unlimited")],
              [tr("Kru hari-H", "Day-of crew"), "6", "14", "25"],
              [tr("Gladi resik", "Rehearsal"), "—", "✓", "✓"],
              [tr("Undangan digital", "Digital invitation"), "✓", "✓", "✓"],
            ],
            bg: ja.alt,
          }),
          end,
        ]);
      case "stories":
        return page(ja, [
          head,
          portfolioMosaic(ja, tr, {
            eyebrow: tr("Kisah nyata", "Real weddings"),
            title: tr("Hari bahagia yang kami jaga", "Happy days we looked after"),
            text: tr("Foto dibagikan dengan izin pasangan.", "Photos shared with the couples' permission."),
            works: [
              { title: "Laras & Bima", tag: tr("Adat Jawa · Prambanan", "Javanese · Prambanan"), image: asset("v2a-wed-hero") },
              { title: "Kadek & Sarah", tag: tr("Tepi tebing · Uluwatu", "Clifftop · Uluwatu"), image: asset("v2a-wed-venue") },
              { title: "Nisa & Fikri", tag: tr("Akad intim · Kotagede", "Intimate · Kotagede"), image: asset("v2a-wed-hero") },
              { title: "Ayu & Daniel", tag: tr("Taman · Ubud", "Garden · Ubud"), image: asset("v2a-wed-venue") },
              { title: "Tiwi & Raka", tag: tr("Ballroom · Yogyakarta", "Ballroom · Yogyakarta"), image: asset("v2a-wed-hero") },
            ],
            cta: { label: tr("Rencanakan milik Anda", "Plan yours"), href: href("contact") },
          }),
          gallery(ja, {
            title: tr("Detail yang diingat tamu", "Details guests remember"),
            cols: 4,
            images: [
              [asset("v2a-wed-hero"), tr("Cincin & melati", "Rings & jasmine")],
              [asset("v2a-wed-venue"), tr("Meja panjang", "Long tables")],
              [asset("v2a-wed-hero"), tr("Kue tiga tingkat", "Three-tier cake")],
              [asset("v2a-wed-venue"), tr("Lorong lilin", "Candlelit aisle")],
            ],
            bg: ja.alt,
          }),
          end,
        ]);
      case "planning":
        return page(ja, [
          head,
          timeline(ja, {
            eyebrow: tr("Linimasa perencanaan", "Planning timeline"),
            title: tr("12 bulan menuju hari-H", "12 months to the big day"),
            steps: [
              [tr("12 bulan", "12 months"), tr("Anggaran & tanggal", "Budget & date"), tr("Tentukan jumlah tamu dan kunci venue.", "Set the guest count and lock the venue.")],
              [tr("9 bulan", "9 months"), tr("Vendor utama", "Key vendors"), tr("Katering, dekorasi, foto & video.", "Catering, décor, photo & video.")],
              [tr("6 bulan", "6 months"), tr("Busana & undangan", "Attire & invitations"), tr("Fitting pertama dan desain undangan.", "First fitting and invitation design.")],
              [tr("1 bulan", "1 month"), tr("Rapat teknis", "Technical meeting"), tr("Rundown final bersama seluruh vendor.", "Final rundown with all vendors.")],
              [tr("Hari-H", "The day"), tr("Nikmati saja", "Just enjoy it"), tr("Kru kami yang mengurus sisanya.", "Our crew handles the rest.")],
            ],
          }),
          faqList(ja, {
            title: tr("Pertanyaan pasangan", "Couples ask"),
            items: [
              [tr("Bisa memilih vendor sendiri?", "Can we pick our own vendors?"), tr("Bisa. Kami tetap berkoordinasi tanpa biaya tambahan.", "Yes. We'll still coordinate at no extra cost.")],
              [tr("Berapa uang muka?", "What's the deposit?"), tr("30% saat tanda tangan kontrak, sisanya bertahap.", "30% on signing, the rest in stages.")],
              [tr("Melayani pernikahan adat?", "Do you do traditional weddings?"), tr("Ya: Jawa, Sunda, Bali, Minang, dan Batak.", "Yes: Javanese, Sundanese, Balinese, Minang, and Batak.")],
            ],
            bg: ja.alt,
          }),
          end,
        ]);
      case "contact":
        return page(ja, [
          head,
          countdownBand(ja, { eyebrow: tr("Wedding open house", "Wedding open house"), title: tr("Temui kami di Royal Ambarrukmo", "Meet us at Royal Ambarrukmo"), text: tr("Diskon 10% untuk pasangan yang booking di acara.", "10% off for couples who book at the event."), target: "2026-12-06T10:00", finished: tr("Acara sedang berlangsung.", "The event is on now."), bg: "#2f2d25" }),
          contact(ja, {
            eyebrow: tr("Konsultasi", "Enquire"),
            title: tr("Ceritakan rencana kalian", "Tell us your plans"),
            text: tr("Kami membalas dalam 24 jam dengan ketersediaan tanggal.", "We reply within 24 hours with date availability."),
            info: [[tr("Studio", "Studio"), "Jl. Prawirotaman 21, Yogyakarta"], ["WhatsApp", "+62 811 2600 1414"]],
            fields: [
              { kind: "input", label: tr("Nama pasangan", "Couple's names"), ph: "Laras & Bima" },
              { kind: "date", label: tr("Tanggal impian", "Dream date") },
              { kind: "select", label: tr("Perkiraan tamu", "Guest count"), ph: tr("Pilih", "Choose"), options: ["< 80", "80–300", "300–800", "> 800"] },
              { kind: "select", label: tr("Kota", "City"), ph: tr("Pilih kota", "Choose a city"), options: ["Yogyakarta", "Bali", "Solo", tr("Lainnya", "Other")] },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(ja, [
          head,
          heroCover(ja, {
            eyebrow: tr("Wedding organizer · Yogyakarta & Bali", "Wedding planners · Yogyakarta & Bali"),
            title: tr("Untuk janji yang diucapkan sekali seumur hidup", "For a promise made once in a lifetime"),
            text: tr("Kami merencanakan pernikahan adat dan modern dengan tenang, rapi, dan penuh perhatian pada detail.", "We plan traditional and modern weddings calmly, neatly, and with an eye for detail."),
            actions: [[tr("Lihat paket", "See packages"), href("packages")], [tr("Kisah nyata", "Real weddings"), href("stories"), "outline"]],
            light: false,
            bg: "#fdfcf8",
            image: asset("v2a-wed-hero"),
            alt: tr("Cincin pernikahan", "Wedding rings"),
          }),
          slider(ja, {
            slides: [
              { title: tr("Laras & Bima — Prambanan", "Laras & Bima — Prambanan"), text: tr("600 tamu, akad saat matahari terbit.", "600 guests, a sunrise ceremony."), bg: "#6b5d40" },
              { title: tr("Kadek & Sarah — Uluwatu", "Kadek & Sarah — Uluwatu"), text: tr("Upacara Bali di tepi tebing.", "A Balinese ceremony on the cliffs."), bg: "#3d3a2f" },
              { title: tr("Nisa & Fikri — Kotagede", "Nisa & Fikri — Kotagede"), text: tr("Akad intim 60 tamu di rumah joglo.", "An intimate 60-guest joglo ceremony."), bg: "#8a7b5c" },
            ],
            bg: ja.alt,
          }),
          cards(ja, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Dari lamaran hingga resepsi", "From proposal to reception"),
            variant: "line",
            items: [
              { title: tr("Perencanaan penuh", "Full planning"), text: tr("Kami pegang semua vendor sejak hari pertama.", "We handle every vendor from day one.") },
              { title: tr("Koordinasi hari-H", "Day-of coordination"), text: tr("Untuk pasangan yang sudah punya vendor.", "For couples who already have vendors.") },
              { title: tr("Destination wedding", "Destination weddings"), text: tr("Bali, Lombok, dan Labuan Bajo.", "Bali, Lombok, and Labuan Bajo.") },
            ],
          }),
          quotes(ja, {
            title: tr("Dari pasangan kami", "From our couples"),
            items: [
              { quote: tr("Kami cuma perlu datang dan menikah. Semua berjalan sesuai rundown sampai menit terakhir.", "We just had to show up and get married. Everything ran to the minute."), author: "Laras & Bima", role: tr("Menikah Mei 2026", "Married May 2026"), avatar: asset("v2a-face-3") },
              { quote: tr("Tim paham adat Bali dan keluarga besar kami merasa dihormati.", "The team understood Balinese customs and our family felt respected."), author: "Kadek & Sarah", role: tr("Menikah Agustus 2025", "Married August 2025"), avatar: asset("v2a-face-4") },
            ],
            cols: 2,
          }),
          end,
        ]);
    }
  },
};

/* ------------------- 8. Nada Rimba band (6 hlm) ---------------------- */

const NR: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#f97316", primaryDark: "#ea580c", soft: "#ffedd5", line: "#fdba74" };
const nr = look(NR, { bg: "#ffffff", alt: "#fafaf9", dark: "#120d1f", radius: 0, headFont: FONTS.grotesk, font: FONTS.mono, page: "#ffffff" });

export const musicBandNada: TemplateContent = {
  brand: "Nada Rimba",
  pages: [home(), pg("music", ["musik", "Musik"], ["music", "Music"]), pg("tour", ["tur", "Tur"], ["tour", "Tour"]), pg("videos", ["video", "Video"], ["videos", "Videos"]), pg("about", ["tentang", "Tentang"], ["about", "About"]), pg("booking", ["booking", "Booking"], ["booking", "Booking"])],
  build: (key, tr, href) => {
    const head = headerLeft("NADA RIMBA", nr, { bg: "#120d1f", ink: "#ffffff", cta: linkButton(tr("Tiket tur", "Tour tickets"), href("tour"), "primary", NR) });
    const end = footerSlim(nr, "NADA RIMBA", ["Spotify", "YouTube", "Bandcamp", "Instagram"], tr("© 2026 Nada Rimba · Rimba Records", "© 2026 Nada Rimba · Rimba Records"), { bg: "#120d1f" });
    const dark = (title: string, text: string) => pageBanner(nr, { title, text, light: true, bg: "#1e1633" });
    switch (key) {
      case "music":
        return page(nr, [
          head,
          dark(tr("Diskografi", "Discography"), tr("Tiga album, satu EP, dan banyak malam di jalan.", "Three albums, one EP, and many nights on the road.")),
          listings(nr, {
            title: tr("Rilisan", "Releases"),
            cols: 4,
            items: [
              { image: asset("v2a-music-album"), title: "Akar (2026)", text: tr("Album ke-3 · 11 lagu", "3rd album · 11 tracks"), price: "Rp150.000", badge: tr("Baru", "New"), cta: tr("Dengarkan", "Listen"), href: "#dengar" },
              { image: asset("v2a-music-hero"), title: "Kabut Pagi (2023)", text: tr("Album ke-2 · 10 lagu", "2nd album · 10 tracks"), price: "Rp120.000", cta: tr("Dengarkan", "Listen"), href: "#dengar" },
              { image: asset("v2a-music-album"), title: "Sungai (2021)", text: "EP · 5 lagu", price: "Rp75.000", cta: tr("Dengarkan", "Listen"), href: "#dengar" },
              { image: asset("v2a-music-hero"), title: "Rimba (2019)", text: tr("Album debut · 9 lagu", "Debut album · 9 tracks"), price: "Rp100.000", cta: tr("Dengarkan", "Listen"), href: "#dengar" },
            ],
          }),
          tableBlock(nr, {
            eyebrow: "Akar (2026)",
            title: tr("Daftar lagu", "Tracklist"),
            columns: ["#", tr("Judul", "Title"), tr("Durasi", "Length")],
            rows: [["1", "Tanah Basah", "4:12"], ["2", "Akar", "3:48"], ["3", "Burung Gereja", "4:30"], ["4", "Pulang ke Hulu", "5:02"], ["5", "Lentera", "3:55"]],
            bg: nr.alt,
          }),
          end,
        ]);
      case "tour":
        return page(nr, [
          head,
          dark(tr("Tur Akar 2026", "Akar Tour 2026"), tr("12 kota, November–Desember. Tiket dijual lewat promotor lokal.", "12 cities, November–December. Tickets via local promoters.")),
          notice(nr, { badge: "SOLD OUT", text: tr("Jakarta (21 Nov) habis. Tanggal tambahan 22 Nov sudah dibuka.", "Jakarta (Nov 21) is sold out. An extra show on Nov 22 is now on sale."), link: tr("Info", "Details"), href: href("booking") }),
          tableBlock(nr, {
            title: tr("Jadwal tur", "Tour dates"),
            columns: [tr("Tanggal", "Date"), tr("Kota", "City"), tr("Venue", "Venue"), tr("Status", "Status")],
            rows: [
              ["14 Nov", "Bandung", "Dago Tea House", tr("Tersedia", "Available")],
              ["16 Nov", "Yogyakarta", "Taman Budaya", tr("Hampir habis", "Few left")],
              ["21 Nov", "Jakarta", "Teater Kecil TIM", "Sold out"],
              ["22 Nov", "Jakarta", "Teater Kecil TIM", tr("Tersedia", "Available")],
              ["29 Nov", "Surabaya", "Ciputra Hall", tr("Tersedia", "Available")],
              ["06 Des", "Denpasar", "Lapangan Puputan", tr("Tersedia", "Available")],
            ],
          }),
          end,
        ]);
      case "videos":
        return page(nr, [
          head,
          videoBlock(nr, { eyebrow: tr("Video musik", "Music video"), title: "Akar — Official Video", text: tr("Direkam di hutan Gunung Halimun.", "Shot in the Mount Halimun forest."), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", bg: nr.alt }),
          gallery(nr, {
            title: tr("Dari panggung", "From the stage"),
            images: [
              [asset("v2a-music-hero"), tr("Festival Halimun 2025", "Halimun Festival 2025")],
              [asset("v2a-music-album"), tr("Sesi rekaman Akar", "Recording Akar")],
              [asset("v2a-music-hero"), tr("Tur Kabut Pagi", "Kabut Pagi tour")],
            ],
            ratio: "16 / 10",
          }),
          end,
        ]);
      case "about":
        return page(nr, [
          head,
          story(nr, {
            eyebrow: tr("Tentang band", "About the band"),
            title: tr("Folk dari pinggir hutan", "Folk from the forest's edge"),
            paras: [tr("Nada Rimba dibentuk di Bogor tahun 2017 oleh empat teman yang besar di kaki Gunung Salak. Lagu-lagu kami bercerita tentang sungai, hutan, dan rumah.", "Nada Rimba formed in Bogor in 2017, four friends who grew up at the foot of Mount Salak. Our songs are about rivers, forests, and home."), tr("Album Akar dirilis independen dan masuk daftar 20 album terbaik 2026 versi Majalah Irama.", "Akar was released independently and named one of Majalah Irama's 20 best albums of 2026.")],
            image: asset("v2a-music-hero"),
            alt: tr("Gitar di panggung", "Guitar on stage"),
          }),
          people(nr, {
            title: tr("Personel", "Members"),
            items: [
              { name: "Galih", role: tr("Vokal & gitar", "Vocals & guitar"), photo: asset("v2a-face-2") },
              { name: "Rinjani", role: tr("Biola & vokal", "Violin & vocals"), photo: asset("v2a-face-3") },
              { name: "Ucok", role: "Bass", photo: asset("v2a-face-4") },
              { name: "Teddy", role: tr("Drum & perkusi", "Drums & percussion"), photo: asset("v2a-face-1") },
            ],
            bg: nr.alt,
          }),
          bigQuote(nr, { text: tr("Akar adalah album folk paling jujur dekade ini.", "Akar is the most honest folk record of the decade."), name: "Majalah Irama", role: tr("Ulasan, 2026", "Review, 2026"), bg: "#120d1f" }),
          end,
        ]);
      case "booking":
        return page(nr, [
          head,
          contact(nr, {
            eyebrow: tr("Booking & press", "Booking & press"),
            title: tr("Undang kami bermain", "Invite us to play"),
            text: tr("Tersedia untuk festival, acara kampus, dan korporat mulai Januari 2027.", "Available for festivals, campus, and corporate events from January 2027."),
            info: [[tr("Manajer", "Manager"), "Dewi Lestari · +62 813 1717 2017"], ["Press kit", "press@nadarimba.example"]],
            fields: [
              { kind: "input", label: tr("Penyelenggara", "Organizer"), ph: tr("Nama acara / instansi", "Event / organization") },
              { kind: "select", label: tr("Jenis acara", "Event type"), ph: tr("Pilih", "Choose"), options: [tr("Festival", "Festival"), tr("Kampus", "Campus"), tr("Korporat", "Corporate"), tr("Privat", "Private")] },
              { kind: "date", label: tr("Tanggal acara", "Event date") },
              { kind: "input", label: tr("Kota", "City"), ph: "Malang" },
            ],
            submit: tr("Kirim permintaan", "Send request"),
          }),
          faqList(nr, {
            title: tr("Info teknis", "Technical info"),
            items: [
              [tr("Durasi tampil?", "Set length?"), tr("45–90 menit, 12–20 lagu.", "45–90 minutes, 12–20 songs.")],
              [tr("Kebutuhan panggung?", "Stage requirements?"), tr("Rider teknis dikirim setelah konfirmasi; minimal panggung 6×4 m.", "Tech rider sent after confirmation; stage at least 6×4 m.")],
            ],
          }),
          end,
        ]);
      default:
        return page(nr, [
          head,
          heroCover(nr, {
            eyebrow: tr("Album baru · Akar", "New album · Akar"),
            title: tr("Lagu-lagu dari tanah basah", "Songs from wet soil"),
            text: tr("Album ketiga Nada Rimba, direkam live di rumah kayu tengah hutan Halimun.", "Nada Rimba's third album, recorded live in a wooden house in the Halimun forest."),
            actions: [[tr("Dengarkan sekarang", "Listen now"), href("music")], [tr("Jadwal tur", "Tour dates"), href("tour"), "outline"]],
            bg: "#120d1f",
            image: asset("v2a-music-hero"),
            alt: tr("Gitar dan gelombang suara", "Guitar and sound waves"),
          }),
          countdownBand(nr, { eyebrow: tr("Tur Akar 2026", "Akar Tour 2026"), title: tr("Malam pembuka di Bandung", "Opening night in Bandung"), text: tr("Dago Tea House · 14 November · 19.30 WIB", "Dago Tea House · November 14 · 7:30pm"), target: "2026-11-14T19:30", finished: tr("Tur sudah dimulai!", "The tour has started!"), actions: [[tr("Beli tiket", "Get tickets"), href("tour"), "light"]], bg: "#ea580c" }),
          listings(nr, {
            eyebrow: tr("Diskografi", "Discography"),
            title: tr("Rilisan terbaru", "Latest releases"),
            items: [
              { image: asset("v2a-music-album"), title: "Akar", text: "2026 · LP", price: "Rp150.000", badge: tr("Baru", "New"), cta: tr("Detail", "Details"), href: href("music") },
              { image: asset("v2a-music-hero"), title: "Kabut Pagi", text: "2023 · LP", price: "Rp120.000", cta: tr("Detail", "Details"), href: href("music") },
              { image: asset("v2a-music-album"), title: "Sungai", text: "2021 · EP", price: "Rp75.000", cta: tr("Detail", "Details"), href: href("music") },
            ],
          }),
          videoBlock(nr, { eyebrow: tr("Video terbaru", "Latest video"), title: "Akar (Live at Halimun)", url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", bg: nr.alt }),
          end,
        ]);
    }
  },
};

/* ------------------- 9. Bangun Persada Karya (7 hlm) ----------------- */

const BP: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#d97706", primaryDark: "#b45309", soft: "#fef3c7", line: "#fde68a" };
const bp = look(BP, { bg: "#ffffff", alt: "#f5f5f4", dark: "#1c1917", radius: 0, headFont: FONTS.grotesk, font: FONTS.sans });

export const constructionBangun: TemplateContent = {
  brand: "PT Bangun Persada Karya",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("projects", ["proyek", "Proyek"], ["projects", "Projects"]),
    pg("case", ["studi-kasus-gudang", "Studi Kasus"], ["warehouse-case-study", "Case Study"]),
    pg("safety", ["k3", "K3 & Mutu"], ["safety", "Safety & Quality"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("contact", ["kontak", "Minta Penawaran"], ["contact", "Request a Quote"]),
  ],
  build: (key, tr, href) => {
    const head = headerBar("BANGUN PERSADA", bp, {
      info: ["ISO 9001 · ISO 45001", tr("Kantor: Jl. TB Simatupang Kav. 9, Jakarta", "Office: Jl. TB Simatupang Kav. 9, Jakarta"), "+62 21 7800 5151"],
      cta: linkButton(tr("Minta penawaran", "Request a quote"), href("contact"), "primary", BP),
    });
    const end = footer(
      "PT Bangun Persada Karya",
      tr("Kontraktor umum gedung & industri, kualifikasi besar (B1).", "General contractor for buildings & industry, large-grade (B1) license."),
      [
        { title: tr("Layanan", "Services"), items: [tr("Gedung komersial", "Commercial buildings"), tr("Gudang & pabrik", "Warehouses & plants"), tr("Renovasi", "Renovation")] },
        { title: tr("Kantor", "Office"), items: ["Jl. TB Simatupang Kav. 9", "+62 21 7800 5151", "tender@bangunpersada.example"] },
      ],
      tr("© 2026 PT Bangun Persada Karya. Data proyek contoh.", "© 2026 PT Bangun Persada Karya. Sample project data."),
      "#1c1917",
    );
    switch (key) {
      case "services":
        return page(bp, [
          head,
          pageBanner(bp, { eyebrow: tr("Layanan", "Services"), title: tr("Desain, bangun, serah terima", "Design, build, hand over"), text: tr("Satu kontrak, satu penanggung jawab dari gambar kerja hingga sertifikat laik fungsi.", "One contract, one accountable team from drawings to occupancy certificate."), light: true }),
          cards(bp, {
            title: tr("Lingkup pekerjaan", "Scope of work"),
            variant: "num",
            items: [
              { title: tr("Design & build", "Design & build"), text: tr("Arsitek, struktur, dan MEP dalam satu tim.", "Architecture, structure, and MEP in one team."), meta: tr("Hemat 8–12% waktu", "Saves 8–12% time") },
              { title: tr("Gudang & pabrik", "Warehouses & plants"), text: tr("Struktur baja bentang lebar hingga 60 m.", "Long-span steel structures up to 60 m."), meta: "PEB · WF" },
              { title: tr("Gedung komersial", "Commercial buildings"), text: tr("Kantor, ruko, dan sekolah hingga 12 lantai.", "Offices, shophouses, and schools up to 12 floors."), meta: tr("Beton bertulang", "Reinforced concrete") },
              { title: tr("Renovasi aktif", "Live renovation"), text: tr("Pekerjaan malam agar operasi tetap berjalan.", "Night shifts so operations keep running."), meta: tr("Minim gangguan", "Minimal disruption") },
              { title: tr("Pekerjaan sipil", "Civil works"), text: tr("Jalan kawasan, drainase, dan pondasi tiang.", "Estate roads, drainage, and piling."), meta: tr("Alat berat sendiri", "Own heavy equipment") },
              { title: tr("Pemeliharaan", "Maintenance"), text: tr("Kontrak tahunan atap, MEP, dan cat.", "Annual roof, MEP, and paint contracts."), meta: "SLA 24 jam" },
            ],
          }),
          servicesSplit(bp, tr, {
            eyebrow: tr("Cara kami bekerja", "How we work"),
            title: tr("Terukur sejak hari pertama", "Measured from day one"),
            image: asset("v2a-build-site"),
            items: [
              { icon: "01", title: tr("Estimasi BoQ", "BoQ estimate"), text: tr("Rincian volume dan harga satuan terbuka.", "Open quantities and unit rates.") },
              { icon: "02", title: tr("Jadwal kurva-S", "S-curve schedule"), text: tr("Laporan progres mingguan dengan foto drone.", "Weekly progress reports with drone photos.") },
              { icon: "03", title: tr("Serah terima", "Handover"), text: tr("Masa pemeliharaan 180 hari.", "180-day defects liability period.") },
            ],
            cta: { label: tr("Minta penawaran", "Request a quote"), href: href("contact") },
          }),
          end,
        ]);
      case "projects":
        return page(bp, [
          head,
          gallery(bp, {
            eyebrow: tr("Portofolio", "Portfolio"),
            title: tr("Proyek terpilih", "Selected projects"),
            ratio: "4 / 3",
            images: [
              [asset("v2a-build-hero"), tr("Gudang distribusi Cikarang · 24.000 m²", "Cikarang distribution warehouse · 24,000 m²")],
              [asset("v2a-build-site"), tr("Kantor 8 lantai Bintaro · 2025", "8-floor office, Bintaro · 2025")],
              [asset("v2a-build-hero"), tr("Sekolah Kristen Kasih · Bogor", "Kasih Christian School · Bogor")],
              [asset("v2a-build-site"), tr("Pabrik makanan Karawang", "Food plant, Karawang")],
              [asset("v2a-build-hero"), tr("Ruko 32 unit Serpong", "32 shophouses, Serpong")],
              [asset("v2a-build-site"), tr("Renovasi RS Medika", "Medika Hospital renovation")],
            ],
          }),
          tableBlock(bp, {
            title: tr("Daftar proyek 2023–2026", "Projects 2023–2026"),
            columns: [tr("Proyek", "Project"), tr("Lokasi", "Location"), tr("Nilai", "Value"), tr("Selesai", "Completed")],
            rows: [
              [tr("Gudang distribusi", "Distribution warehouse"), "Cikarang", "Rp142 M", "2026"],
              [tr("Gedung kantor 8 lantai", "8-floor office"), "Bintaro", "Rp96 M", "2025"],
              [tr("Pabrik makanan", "Food plant"), "Karawang", "Rp210 M", "2024"],
              [tr("Sekolah 3 lantai", "3-floor school"), "Bogor", "Rp38 M", "2023"],
            ],
            bg: bp.alt,
          }),
          ctaBox(bp, { title: tr("Lihat bagaimana kami membangun gudang 24.000 m² dalam 9 bulan", "See how we built a 24,000 m² warehouse in 9 months"), actions: [[tr("Baca studi kasus", "Read the case study"), href("case"), "light"]] }),
          end,
        ]);
      case "case":
        return page(bp, [
          head,
          pageBanner(bp, { crumbs: [[tr("Proyek", "Projects"), href("projects")], [tr("Gudang Cikarang", "Cikarang warehouse"), ""]], eyebrow: tr("Studi kasus", "Case study"), title: tr("Gudang distribusi 24.000 m² dalam 9 bulan", "A 24,000 m² distribution warehouse in 9 months") }),
          story(bp, {
            eyebrow: tr("Tantangan", "Challenge"),
            title: tr("Musim hujan dan tenggat peak season", "Rainy season and a peak-season deadline"),
            paras: [tr("Klien logistik harus beroperasi sebelum Harbolnas. Tanah lunak membutuhkan 1.400 titik tiang pancang.", "The logistics client had to be running before the national shopping festival. Soft soil required 1,400 piles.")],
            bullets: [tr("Pabrikasi baja paralel dengan pondasi", "Steel fabricated in parallel with foundations"), tr("Atap dipasang sebelum lantai dicor", "Roof installed before slab pouring"), tr("Dua shift, 380 pekerja", "Two shifts, 380 workers")],
            image: asset("v2a-build-hero"),
            alt: tr("Crane di lokasi", "Crane on site"),
          }),
          progressBars(bp, {
            eyebrow: tr("Hasil", "Results"),
            title: tr("Realisasi vs rencana", "Actual vs plan"),
            bars: [[tr("Waktu (selesai 3 minggu lebih awal)", "Time (3 weeks early)"), 100], [tr("Anggaran terpakai", "Budget used"), 96], [tr("Hari tanpa kecelakaan kerja", "Accident-free days"), 100]],
            bg: bp.alt,
          }),
          counter(bp, { items: [tr("24.000 | m² luas lantai", "24,000 | m² floor area"), tr("1.400 | Tiang pancang", "1,400 | Piles"), tr("9 | Bulan pengerjaan", "9 | Months on site"), tr("0 | Kecelakaan kerja", "0 | Lost-time accidents")] }),
          end,
        ]);
      case "safety":
        return page(bp, [
          head,
          cards(bp, {
            eyebrow: tr("K3 & mutu", "Safety & quality"),
            title: tr("Semua orang pulang dengan selamat", "Everyone goes home safe"),
            variant: "line",
            cols: 4,
            items: [
              { title: "Toolbox meeting", text: tr("Setiap pagi sebelum kerja.", "Every morning before work.") },
              { title: tr("Izin kerja", "Permit to work"), text: tr("Untuk ketinggian & pengelasan.", "For heights & hot work.") },
              { title: tr("Inspeksi mingguan", "Weekly inspection"), text: tr("Bersama konsultan pengawas.", "With the supervising consultant.") },
              { title: tr("Uji material", "Material testing"), text: tr("Beton diuji di lab independen.", "Concrete tested at independent labs.") },
            ],
          }),
          tableBlock(bp, {
            title: tr("Sertifikasi", "Certifications"),
            columns: [tr("Standar", "Standard"), tr("Lingkup", "Scope"), tr("Berlaku hingga", "Valid until")],
            rows: [["ISO 9001:2015", tr("Manajemen mutu", "Quality management"), "2028"], ["ISO 45001:2018", tr("K3", "Occupational safety"), "2028"], ["SBU B1", tr("Gedung & industri", "Building & industrial"), "2027"]],
            bg: bp.alt,
          }),
          bigQuote(bp, { text: tr("Tidak ada tenggat yang lebih penting dari keselamatan pekerja.", "No deadline matters more than worker safety."), name: "Ir. Hartono Wijaya", role: tr("Direktur Operasional", "Operations Director") }),
          end,
        ]);
      case "careers":
        return page(bp, [
          head,
          story(bp, {
            eyebrow: tr("Karier", "Careers"),
            title: tr("Bangun karier di lapangan", "Build a career on site"),
            paras: [tr("400 karyawan tetap, program engineer muda 12 bulan, dan BPJS penuh sejak hari pertama.", "400 permanent staff, a 12-month graduate engineer program, and full insurance from day one.")],
            image: asset("v2a-build-site"),
            alt: tr("Lokasi proyek", "Project site"),
          }),
          jobs(bp, {
            title: tr("Lowongan terbuka", "Open positions"),
            apply: tr("Lamar", "Apply"),
            href: href("contact"),
            items: [
              { title: "Site Manager", meta: tr("Karawang · Tetap", "Karawang · Permanent"), text: tr("Min. 8 tahun proyek gedung/industri, SKA Ahli Madya.", "8+ years on building/industrial projects, mid-level expert cert.") },
              { title: "Quantity Surveyor", meta: tr("Jakarta · Tetap", "Jakarta · Permanent"), text: tr("Menyusun BoQ & cash flow proyek.", "Prepare BoQ & project cash flow.") },
              { title: tr("Petugas K3", "Safety Officer"), meta: tr("Cikarang · Kontrak", "Cikarang · Contract"), text: tr("Sertifikat AK3 Umum.", "General safety expert certificate.") },
            ],
          }),
          end,
        ]);
      case "contact":
        return page(bp, [
          head,
          contact(bp, {
            eyebrow: tr("Minta penawaran", "Request a quote"),
            title: tr("Ceritakan proyek Anda", "Tell us about your project"),
            text: tr("Estimator kami membalas dalam 2 hari kerja dengan perkiraan biaya dan jadwal.", "Our estimators reply within 2 business days with cost and schedule estimates."),
            info: [[tr("Tender & penawaran", "Tenders & quotes"), "tender@bangunpersada.example"], [tr("Telepon", "Phone"), "+62 21 7800 5151"]],
            fields: [
              { kind: "input", label: tr("Perusahaan", "Company"), ph: "PT Contoh Logistik" },
              { kind: "select", label: tr("Jenis proyek", "Project type"), ph: tr("Pilih", "Choose"), options: [tr("Gudang / pabrik", "Warehouse / plant"), tr("Gedung kantor", "Office building"), tr("Renovasi", "Renovation"), tr("Sipil", "Civil works")] },
              { kind: "input", label: tr("Luas (m²)", "Area (m²)"), ph: "5.000", type: "number" },
              { kind: "date", label: tr("Target mulai", "Target start"), mode: "month" },
            ],
            submit: tr("Kirim permintaan", "Send request"),
          }),
          end,
        ]);
      default:
        return page(bp, [
          head,
          heroSplit(bp, {
            badge: tr("Kontraktor B1 · 22 tahun", "B1 contractor · 22 years"),
            title: tr("Membangun tepat waktu, tanpa kompromi keselamatan", "Building on time, never compromising safety"),
            text: tr("Gudang, pabrik, dan gedung komersial untuk 140+ perusahaan di Jabodetabek dan Jawa Barat.", "Warehouses, plants, and commercial buildings for 140+ companies across Greater Jakarta and West Java."),
            actions: [[tr("Minta penawaran", "Request a quote"), href("contact")], [tr("Lihat proyek", "See projects"), href("projects"), "outline"]],
            image: asset("v2a-build-hero"),
            alt: tr("Crane dan gedung", "Crane and building"),
            bg: bp.alt,
          }),
          figures(bp, { items: [["320+", tr("Proyek selesai", "Projects completed")], ["2,1 jt m²", tr("Luas terbangun", "Built area")], ["98%", tr("Tepat waktu", "On time")], ["0,12", tr("Tingkat kecelakaan (LTIFR)", "Accident rate (LTIFR)")]], bg: "#1c1917", light: true }),
          servicesSplit(bp, tr, {
            eyebrow: tr("Keahlian", "Expertise"),
            title: tr("Dari tiang pancang hingga atap", "From piles to roof"),
            image: asset("v2a-build-site"),
            items: [
              { icon: "▲", title: tr("Industri", "Industrial"), text: tr("Gudang & pabrik bentang lebar.", "Long-span warehouses & plants.") },
              { icon: "■", title: tr("Komersial", "Commercial"), text: tr("Kantor, sekolah, rumah sakit.", "Offices, schools, hospitals.") },
              { icon: "●", title: tr("Renovasi", "Renovation"), text: tr("Tanpa menghentikan operasional.", "Without stopping operations.") },
            ],
            cta: { label: tr("Semua layanan", "All services"), href: href("services") },
            reverse: true,
          }),
          portfolioMosaic(bp, tr, {
            eyebrow: tr("Proyek", "Projects"),
            title: tr("Hasil kerja terbaru", "Recent work"),
            works: [
              { title: tr("Gudang Cikarang", "Cikarang warehouse"), tag: "24.000 m² · 2026", image: asset("v2a-build-hero") },
              { title: tr("Kantor Bintaro", "Bintaro office"), tag: tr("8 lantai · 2025", "8 floors · 2025"), image: asset("v2a-build-site") },
              { title: tr("Pabrik Karawang", "Karawang plant"), tag: "2024", image: asset("v2a-build-hero") },
              { title: tr("Sekolah Bogor", "Bogor school"), tag: "2023", image: asset("v2a-build-site") },
              { title: tr("Ruko Serpong", "Serpong shophouses"), tag: "2023", image: asset("v2a-build-hero") },
            ],
            cta: { label: tr("Semua proyek", "All projects"), href: href("projects") },
          }),
          logos(bp, { label: tr("Dipercaya oleh", "Trusted by"), names: ["Logistika", "NusaFood", "Medika", "Sinar Retail", "KasihEdu"] }),
          ctaBox(bp, { title: tr("Punya tender atau rencana pembangunan?", "Have a tender or a building plan?"), text: tr("Dapatkan estimasi biaya dan jadwal dalam 2 hari kerja.", "Get cost and schedule estimates within 2 business days."), actions: [[tr("Minta penawaran", "Request a quote"), href("contact"), "dark"]], bg: BP.primary }),
          end,
        ]);
    }
  },
};

/* ------------------- 10. Pantai Lengkung Resort (9 hlm) -------------- */

const PL: Palette = { ink: "#083344", muted: "#4b6b75", primary: "#0e7490", primaryDark: "#155e75", soft: "#ecfeff", line: "#a5f3fc" };
const pl = look(PL, { bg: "#ffffff", alt: "#fbf7ef", dark: "#083344", radius: 16, headFont: FONTS.elegant, font: FONTS.sans });

export const hotelResortPantai: TemplateContent = {
  brand: "Pantai Lengkung Resort",
  pages: [
    home(),
    pg("rooms", ["kamar", "Kamar & Vila"], ["rooms", "Rooms & Villas"]),
    pg("villa", ["vila-tepi-laut", "Vila Tepi Laut"], ["oceanfront-villa", "Oceanfront Villa"]),
    pg("dining", ["kuliner", "Kuliner"], ["dining", "Dining"]),
    pg("spa", ["spa", "Spa"], ["spa", "Spa"]),
    pg("activities", ["aktivitas", "Aktivitas"], ["activities", "Activities"]),
    pg("offers", ["penawaran", "Penawaran"], ["offers", "Offers"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("booking", ["reservasi", "Reservasi"], ["reservations", "Reservations"]),
  ],
  build: (key, tr, href) => {
    const head = header("Pantai Lengkung", PL, { font: FONTS.elegant, sticky: true, cta: linkButton(tr("Pesan kamar", "Book a stay"), href("booking"), "primary", PL) });
    const end = footer(
      "Pantai Lengkung Resort",
      tr("Resor 42 kamar di teluk tenang Lombok Selatan.", "A 42-key resort on a quiet bay in South Lombok."),
      [
        { title: tr("Menginap", "Stay"), items: [tr("Kamar & vila", "Rooms & villas"), tr("Penawaran", "Offers"), "Spa"] },
        { title: tr("Hubungi", "Contact"), items: ["Pantai Mawun, Lombok Tengah", "+62 370 615 4242", "stay@pantailengkung.example"] },
      ],
      tr("© 2026 Pantai Lengkung Resort. Harga contoh.", "© 2026 Pantai Lengkung Resort. Sample rates."),
      "#062530",
    );
    const roomCards = [
      { image: asset("v2a-resort-hero"), title: tr("Kamar Taman", "Garden Room"), text: tr("32 m² · balkon taman · 2 tamu", "32 m² · garden balcony · 2 guests"), price: "Rp1.850.000", rating: 4.8, reviews: "(210)", cta: tr("Detail", "Details"), href: href("villa") },
      { image: asset("v2a-resort-sunset"), title: tr("Suite Pandang Laut", "Ocean View Suite"), text: tr("48 m² · bathtub · 3 tamu", "48 m² · bathtub · 3 guests"), price: "Rp2.900.000", badge: tr("Favorit", "Favorite"), rating: 4.9, reviews: "(184)", cta: tr("Detail", "Details"), href: href("villa") },
      { image: asset("v2a-resort-hero"), title: tr("Vila Tepi Laut", "Oceanfront Villa"), text: tr("120 m² · kolam pribadi · 4 tamu", "120 m² · private pool · 4 guests"), price: "Rp6.500.000", rating: 5, reviews: "(96)", cta: tr("Detail", "Details"), href: href("villa") },
    ];
    switch (key) {
      case "rooms":
        return page(pl, [
          head,
          pageBanner(pl, { eyebrow: tr("Kamar & vila", "Rooms & villas"), title: tr("42 kamar, semuanya menghadap cahaya", "42 rooms, all facing the light"), text: tr("Harga per malam termasuk sarapan untuk dua orang.", "Nightly rates include breakfast for two."), align: "center" }),
          listings(pl, { title: tr("Pilih tempat tidur Anda", "Choose your room"), items: roomCards }),
          compare(pl, {
            title: tr("Bandingkan tipe kamar", "Compare room types"),
            columns: [tr("Taman", "Garden"), tr("Suite", "Suite"), tr("Vila", "Villa")],
            rows: [tr("Luas | 32 m² | 48 m² | 120 m²", "Size | 32 m² | 48 m² | 120 m²"), tr("Pandangan laut | tidak | ya | ya", "Ocean view | no | yes | yes"), tr("Kolam pribadi | tidak | tidak | ya", "Private pool | no | no | yes"), tr("Butler | tidak | tidak | ya", "Butler | no | no | yes"), tr("Sarapan | ya | ya | ya", "Breakfast | yes | yes | yes")],
            highlight: 3,
            caption: tr("Semua kamar ber-AC, Wi-Fi gratis", "All rooms air-conditioned, free Wi-Fi"),
            bg: pl.alt,
          }),
          end,
        ]);
      case "villa":
        return page(pl, [
          head,
          pageBanner(pl, { crumbs: [[tr("Kamar", "Rooms"), href("rooms")], [tr("Vila Tepi Laut", "Oceanfront Villa"), ""]], title: tr("Vila Tepi Laut", "Oceanfront Villa"), text: tr("Enam vila, masing-masing dengan kolam 8 m dan tangga langsung ke pasir.", "Six villas, each with an 8 m pool and steps straight onto the sand.") }),
          story(pl, {
            eyebrow: tr("Rp6.500.000 / malam", "Rp6,500,000 / night"),
            title: tr("Bangun dengan suara ombak", "Wake to the sound of waves"),
            paras: [tr("Kamar tidur king, ruang tamu terbuka, dan bale bengong untuk tidur siang. Butler menyiapkan sarapan apung di kolam setiap pagi.", "A king bedroom, open living room, and bale for afternoon naps. Your butler sets up a floating breakfast every morning.")],
            bullets: [tr("Kolam pribadi 8 × 3 m", "8 × 3 m private pool"), tr("Kamar mandi semi-outdoor", "Semi-outdoor bathroom"), tr("Antar-jemput bandara gratis", "Free airport transfer")],
            image: asset("v2a-resort-sunset"),
            alt: tr("Matahari terbenam dari vila", "Sunset from the villa"),
            actions: [[tr("Cek ketersediaan", "Check availability"), href("booking")]],
          }),
          tableBlock(pl, {
            title: tr("Fasilitas vila", "Villa amenities"),
            columns: [tr("Area", "Area"), tr("Fasilitas", "Amenities")],
            rows: [[tr("Kamar", "Bedroom"), tr("Kasur king, kelambu, AC senyap", "King bed, canopy, silent A/C")], [tr("Kamar mandi", "Bathroom"), tr("Bathtub batu, shower outdoor, produk lokal", "Stone tub, outdoor shower, local toiletries")], [tr("Hiburan", "Entertainment"), tr("Smart TV, speaker Bluetooth, buku", "Smart TV, Bluetooth speaker, books")]],
            bg: pl.alt,
          }),
          gallery(pl, { title: tr("Sudut vila", "Villa corners"), cols: 4, images: [[asset("v2a-resort-hero"), tr("Kolam", "Pool")], [asset("v2a-resort-sunset"), tr("Teras", "Terrace")], [asset("v2a-resort-hero"), tr("Bale", "Bale")], [asset("v2a-resort-sunset"), tr("Senja", "Dusk")]] }),
          end,
        ]);
      case "dining":
        return page(pl, [
          head,
          story(pl, {
            eyebrow: tr("Restoran Ombak", "Ombak Restaurant"),
            title: tr("Hasil laut pagi ini, di piring malam ini", "This morning's catch, on tonight's plate"),
            paras: [tr("Chef Lalu Ahmad memasak menu Sasak modern dari ikan nelayan Mawun dan sayur kebun resor.", "Chef Lalu Ahmad cooks modern Sasak food with fish from Mawun fishermen and vegetables from our garden.")],
            image: asset("v2a-resort-dish"),
            alt: tr("Hidangan ikan", "A fish dish"),
          }),
          menuBoard(pl, {
            eyebrow: tr("Menu malam", "Dinner menu"),
            title: tr("Pilihan chef", "Chef's picks"),
            groups: [
              { title: tr("Pembuka", "Starters"), items: [["Plecing Kangkung", tr("Kangkung, sambal tomat, kacang", "Water spinach, tomato sambal, peanuts"), "85K"], [tr("Sate Pusut", "Sate Pusut"), tr("Sate ikan berbumbu kelapa", "Spiced coconut fish satay"), "95K"]] },
              { title: tr("Utama", "Mains"), items: [["Ayam Taliwang", tr("Ayam kampung bakar pedas", "Spicy grilled village chicken"), "165K"], [tr("Ikan Bakar Mawun", "Mawun Grilled Fish"), tr("Tangkapan hari ini, sambal matah", "Today's catch, sambal matah"), "210K"]] },
              { title: tr("Penutup", "Desserts"), items: [[tr("Es Kelapa Muda", "Young Coconut Ice"), tr("Gula aren, daun pandan", "Palm sugar, pandan"), "55K"], [tr("Klepon Panna Cotta", "Klepon Panna Cotta"), tr("Pandan & kelapa", "Pandan & coconut"), "70K"]] },
            ],
          }),
          end,
        ]);
      case "spa":
        return page(pl, [
          head,
          cards(pl, {
            eyebrow: tr("Spa Sumber", "Sumber Spa"),
            title: tr("Ritual dari tradisi Sasak", "Rituals from Sasak tradition"),
            items: [
              { icon: "🌺", title: tr("Pijat Sasak", "Sasak massage"), text: tr("Tekanan dalam dengan minyak kelapa hangat.", "Deep pressure with warm coconut oil."), meta: tr("90 menit", "90 min") },
              { icon: "🌾", title: tr("Lulur beras", "Rice scrub"), text: tr("Beras merah Lombok dan kunyit.", "Lombok red rice and turmeric."), meta: tr("60 menit", "60 min") },
              { icon: "🌊", title: tr("Pijat tepi pantai", "Beachside massage"), text: tr("Di bale terbuka saat matahari terbenam.", "In an open bale at sunset."), meta: tr("60 menit", "60 min") },
            ],
          }),
          plans(pl, {
            title: tr("Paket spa", "Spa packages"),
            bg: pl.alt,
            items: [
              { plan: tr("Sore Tenang", "Quiet Afternoon"), price: "Rp850rb", period: "", description: tr("Satu orang.", "One person."), features: [tr("Pijat Sasak 90 menit", "90-min Sasak massage"), tr("Teh jahe", "Ginger tea")], buttonText: tr("Pesan", "Book"), buttonHref: href("booking") },
              { plan: tr("Berdua", "For Two"), price: "Rp1,9jt", period: "", description: tr("Ruang pasangan.", "Couple's suite."), features: [tr("Lulur beras", "Rice scrub"), tr("Pijat 60 menit", "60-min massage"), tr("Mandi bunga", "Flower bath")], buttonText: tr("Pesan", "Book"), buttonHref: href("booking"), featured: true, badge: tr("Romantis", "Romantic") },
            ],
          }),
          end,
        ]);
      case "activities":
        return page(pl, [
          head,
          timeline(pl, {
            eyebrow: tr("Sehari di Pantai Lengkung", "A day at Pantai Lengkung"),
            title: tr("Tidak harus ke mana-mana", "Nowhere you have to be"),
            steps: [
              ["06.00", tr("Yoga matahari terbit", "Sunrise yoga"), tr("Di dek kayu, gratis untuk tamu.", "On the wooden deck, free for guests.")],
              ["09.00", tr("Snorkeling teluk", "Bay snorkeling"), tr("Perahu nelayan ke karang Gili Nanggu.", "Fishing boat to Gili Nanggu reef.")],
              ["15.00", tr("Kelas tenun", "Weaving class"), tr("Bersama penenun Desa Sade.", "With weavers from Sade village.")],
              ["18.00", tr("Senja di bukit", "Hilltop sunset"), tr("Jalan kaki 15 menit, kelapa muda menunggu.", "A 15-minute walk, coconuts waiting.")],
            ],
          }),
          cards(pl, {
            title: tr("Petualangan berbayar", "Paid adventures"),
            variant: "dark",
            items: [
              { icon: "🏄", title: tr("Kelas selancar", "Surf lessons"), text: tr("Pantai Selong Belanak, papan disediakan.", "Selong Belanak beach, boards included."), meta: "Rp450rb" },
              { icon: "🛵", title: tr("Tur desa", "Village tour"), text: tr("Sade, Ende, dan bukit Merese.", "Sade, Ende, and Merese hill."), meta: "Rp350rb" },
              { icon: "🐢", title: tr("Diving pemula", "Discover scuba"), text: tr("Instruktur PADI, 2 penyelaman.", "PADI instructor, 2 dives."), meta: "Rp1,4jt" },
            ],
          }),
          end,
        ]);
      case "offers":
        return page(pl, [
          head,
          countdownBand(pl, { eyebrow: tr("Promo musim hijau", "Green season deal"), title: tr("Menginap 4 malam, bayar 3", "Stay 4 nights, pay 3"), text: tr("Untuk menginap Januari–Maret 2027. Pemesanan ditutup dalam:", "For stays January–March 2027. Booking closes in:"), target: "2026-12-15T23:59", finished: tr("Promo telah berakhir.", "The offer has ended."), actions: [[tr("Pesan sekarang", "Book now"), href("booking"), "light"]] }),
          listings(pl, {
            title: tr("Paket menginap", "Stay packages"),
            items: [
              { image: asset("v2a-resort-sunset"), title: tr("Bulan Madu", "Honeymoon"), text: tr("3 malam vila + makan malam di pantai", "3 nights villa + beach dinner"), price: "Rp18.900.000", compare: "Rp22.500.000", badge: "-16%", cta: tr("Pesan", "Book"), href: href("booking") },
              { image: asset("v2a-resort-hero"), title: tr("Keluarga", "Family"), text: tr("2 kamar terhubung + kelas selancar", "2 connecting rooms + surf lesson"), price: "Rp9.800.000", cta: tr("Pesan", "Book"), href: href("booking") },
              { image: asset("v2a-resort-dish"), title: tr("Kerja dari pantai", "Work from the beach"), text: tr("7 malam + meja kerja + laundry", "7 nights + desk + laundry"), price: "Rp11.200.000", cta: tr("Pesan", "Book"), href: href("booking") },
            ],
          }),
          end,
        ]);
      case "gallery":
        return page(pl, [
          head,
          gallery(pl, {
            eyebrow: tr("Galeri", "Gallery"),
            title: tr("Teluk kami dalam gambar", "Our bay in pictures"),
            cols: 3,
            images: [
              [asset("v2a-resort-hero"), tr("Pagi di teluk", "Morning on the bay")],
              [asset("v2a-resort-sunset"), tr("Senja Mawun", "Mawun dusk")],
              [asset("v2a-resort-dish"), tr("Makan malam", "Dinner")],
              [asset("v2a-resort-sunset"), tr("Vila tepi laut", "Oceanfront villa")],
              [asset("v2a-resort-hero"), tr("Kelapa & pasir", "Palms & sand")],
              [asset("v2a-resort-dish"), tr("Sarapan apung", "Floating breakfast")],
            ],
          }),
          videoBlock(pl, { title: tr("Tur video resor", "Resort video tour"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", bg: pl.alt }),
          end,
        ]);
      case "booking":
        return page(pl, [
          head,
          contact(pl, {
            eyebrow: tr("Reservasi langsung", "Book direct"),
            title: tr("Harga terbaik hanya di sini", "Best rate, only here"),
            text: tr("Pesan langsung dan dapatkan antar-jemput bandara serta late check-out gratis.", "Book direct for a free airport transfer and late check-out."),
            info: [[tr("Reservasi", "Reservations"), "+62 370 615 4242"], ["Email", "stay@pantailengkung.example"], [tr("Bandara terdekat", "Nearest airport"), tr("Lombok (LOP), 35 menit", "Lombok (LOP), 35 min")]],
            fields: [
              { kind: "date", label: "Check-in" },
              { kind: "date", label: "Check-out" },
              { kind: "select", label: tr("Tipe kamar", "Room type"), ph: tr("Pilih kamar", "Choose a room"), options: [tr("Kamar Taman", "Garden Room"), tr("Suite Pandang Laut", "Ocean View Suite"), tr("Vila Tepi Laut", "Oceanfront Villa")] },
              { kind: "select", label: tr("Tamu", "Guests"), ph: "2", options: ["1", "2", "3", "4"] },
              { kind: "input", label: "Email", ph: "nama@email.com", type: "email" },
            ],
            submit: tr("Cek ketersediaan", "Check availability"),
            formFirst: true,
          }),
          faqList(pl, {
            title: tr("Sebelum tiba", "Before you arrive"),
            items: [
              ["Check-in / check-out?", tr("Check-in 14.00, check-out 12.00.", "Check-in 2pm, check-out noon.")],
              [tr("Kebijakan pembatalan?", "Cancellation policy?"), tr("Gratis hingga 7 hari sebelum kedatangan.", "Free up to 7 days before arrival.")],
              [tr("Ramah anak?", "Kid-friendly?"), tr("Ya, anak di bawah 6 tahun menginap gratis.", "Yes, kids under 6 stay free.")],
            ],
          }),
          end,
        ]);
      default:
        return page(pl, [
          head,
          heroCover(pl, {
            eyebrow: tr("Lombok Selatan · 42 kamar", "South Lombok · 42 rooms"),
            title: tr("Teluk tenang di ujung selatan Lombok", "A quiet bay at Lombok's southern tip"),
            text: tr("Vila berkolam pribadi, makan malam di pasir, dan pagi tanpa alarm.", "Private-pool villas, dinner on the sand, and mornings without alarms."),
            actions: [[tr("Pesan kamar", "Book a stay"), href("booking"), "light"], [tr("Lihat vila", "See villas"), href("rooms"), "outline"]],
            gradient: ["#083344", "#0e7490", 160],
            image: asset("v2a-resort-hero"),
            alt: tr("Pantai dan pohon kelapa", "Beach and palm tree"),
          }),
          listings(pl, { eyebrow: tr("Menginap", "Stay"), title: tr("Kamar & vila", "Rooms & villas"), items: roomCards, bg: pl.alt }),
          slider(pl, {
            eyebrow: tr("Pengalaman", "Experiences"),
            title: tr("Yang membuat tamu kembali", "Why guests return"),
            slides: [
              { title: tr("Makan malam di pasir", "Dinner on the sand"), text: tr("Meja untuk dua, obor bambu, ikan bakar.", "A table for two, bamboo torches, grilled fish."), bg: "#155e75" },
              { title: tr("Yoga matahari terbit", "Sunrise yoga"), text: tr("Setiap pagi pukul 06.00 di dek kayu.", "Every morning at 6am on the deck."), bg: "#0e7490" },
              { title: tr("Snorkeling Gili Nanggu", "Gili Nanggu snorkeling"), text: tr("Perahu nelayan, karang yang masih sehat.", "Fishing boats, healthy reefs."), bg: "#083344" },
            ],
          }),
          testimonialsWall(pl, tr, {
            eyebrow: tr("Ulasan tamu", "Guest reviews"),
            title: tr("Tempat untuk benar-benar istirahat", "A place to truly rest"),
            score: 4.9,
            caption: tr("dari 1.020 ulasan", "from 1,020 reviews"),
            quotes: [
              { text: tr("Butler kami ingat kopi favorit sejak hari pertama.", "Our butler remembered our coffee from day one."), name: "Claire & Tom", role: tr("Vila, 5 malam", "Villa, 5 nights"), avatar: asset("v2a-face-6") },
              { text: tr("Ikan bakarnya paling enak se-Lombok.", "The best grilled fish in Lombok."), name: "Rudi H.", role: tr("Suite, 3 malam", "Suite, 3 nights"), avatar: asset("v2a-face-2") },
              { text: tr("Anak-anak tidak mau pulang.", "The kids didn't want to leave."), name: "Keluarga Siregar", role: tr("Kamar Taman, 4 malam", "Garden Room, 4 nights"), avatar: asset("v2a-face-4") },
            ],
          }),
          ctaBand(pl, tr, { title: tr("Menginap 4 malam, bayar 3", "Stay 4 nights, pay 3"), text: tr("Promo musim hijau, terbatas.", "Green season offer, limited."), primary: { label: tr("Lihat penawaran", "See offers"), href: href("offers") }, secondary: { label: tr("Galeri", "Gallery"), href: href("gallery") } }),
          end,
        ]);
    }
  },
};
