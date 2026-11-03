import { ctaBand, faqAccordion, portfolioMosaic, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { Palette } from "../../../build";
import type { TemplateContent } from "../../../types";
import { FONTS, centeredHeader, cta, footer, header } from "../../pro/kit";
import {
  P,
  accordionSec,
  article,
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
  productDetail,
  progressSec,
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
/* Set B · bagian 2: Yayasan, Wedding Organizer, Sekolah Musik,         */
/* Konstruksi & Interior, Vila.                                          */
/* ================================================================== */

/* ---------------- 6. nonprofit-foundation-edu (PREMIUM, 6) --------- */

const PR: Palette = { ink: "#431407", muted: "#78350f", primary: "#ea580c", primaryDark: "#c2410c", soft: "#fff7ed", line: "#fed7aa" };
const prL = look(PR, { font: FONTS.sans, hf: FONTS.rounded, r: 20, dark: "#431407", alt: "#fffbf5", onDark: "#fed7aa" });

export const nonprofitFoundationEdu: TemplateContent = {
  brand: "Yayasan Pelita Rimbun",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("programs", "Program", "Programs", "program", "programs"),
    P("impact", "Dampak", "Impact", "dampak", "impact"),
    P("stories", "Cerita", "Stories", "cerita", "stories"),
    P("volunteer", "Relawan", "Volunteer", "relawan", "volunteer"),
    P("donate", "Donasi", "Donate", "donasi", "donate"),
  ],
  build: (key, tr, href) => {
    const L = prL;
    const head = header("Pelita Rimbun", PR, { font: FONTS.rounded, cta: cta(tr("Donasi", "Donate"), href("donate"), PR) });
    const foot = footer("Yayasan Pelita Rimbun", tr("Yayasan pendidikan untuk anak-anak di desa terpencil Nusa Tenggara Timur, berdiri 2012.", "An education foundation for children in remote East Nusa Tenggara villages, founded 2012."), [{ title: tr("Program", "Programs"), items: [tr("Rumah Baca", "Reading Houses"), tr("Beasiswa", "Scholarships"), tr("Guru Desa", "Village Teachers")] }, { title: tr("Legalitas", "Legal"), items: ["AHU-0012345.AH.01.04", tr("Laporan diaudit KAP", "Audited annually")] }, { title: tr("Kontak", "Contact"), items: ["Kupang, NTT", "halo@pelitarimbun.example"] }], tr("© 2026 Yayasan Pelita Rimbun. Data contoh.", "© 2026 Yayasan Pelita Rimbun. Sample data."), "#431407");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, {
          badge: tr("38 rumah baca · 11 kabupaten", "38 reading houses · 11 regencies"),
          title: tr("Setiap anak di desa berhak punya buku pertamanya", "Every village child deserves their first book"),
          text: tr("Kami membangun rumah baca, melatih guru desa, dan memberi beasiswa agar anak-anak NTT bisa terus sekolah.", "We build reading houses, train village teachers, and fund scholarships so children in NTT can stay in school."),
          btns: [[tr("Donasi sekarang", "Donate now"), href("donate")], [tr("Jadi relawan", "Volunteer"), href("volunteer")]],
          image: "v2b-books",
          alt: tr("Tumpukan buku", "Stack of books"),
          bg: PR.soft,
        }),
        counters(L, [["14.200", tr("Anak terlayani", "Children reached")], ["38", tr("Rumah baca", "Reading houses")], ["412", tr("Guru dilatih", "Teachers trained")], ["96%", tr("Penerima beasiswa lulus", "Scholars graduated")]]),
        progressSec(L, {
          ey: tr("Kampanye 2026", "2026 campaign"),
          title: tr("10 rumah baca baru di Sumba", "10 new reading houses in Sumba"),
          text: tr("Setiap rumah baca membutuhkan Rp45 juta untuk bangunan, 600 buku, dan pelatihan pengelola.", "Each reading house needs Rp45m for the building, 600 books, and caretaker training."),
          items: [[tr("Dana terkumpul (Rp312 jt dari Rp450 jt)", "Funds raised (Rp312m of Rp450m)"), 69], [tr("Buku terkumpul (4.800 dari 6.000)", "Books collected (4,800 of 6,000)"), 80], [tr("Relawan terdaftar (52 dari 60)", "Volunteers signed up (52 of 60)"), 87]],
          image: "v2b-heart",
          btn: [tr("Bantu capai target", "Help reach the goal"), href("donate")],
          striped: true,
          bg: L.alt,
        }),
        testiCards(L, {
          title: tr("Suara dari desa", "Voices from the villages"),
          items: [
            { quote: tr("Dulu anak-anak pulang sekolah langsung ke ladang. Sekarang mereka mampir ke rumah baca dulu.", "Kids used to go straight to the fields after school. Now they stop at the reading house first."), author: "Mama Yuliana", role: tr("Pengelola Rumah Baca Waingapu", "Waingapu reading house caretaker"), avatar: "v2b-face-4" },
            { quote: tr("Beasiswa Pelita membuat saya jadi sarjana pertama di keluarga.", "The Pelita scholarship made me the first graduate in my family."), author: "Fransiskus Ndun", role: tr("Alumni beasiswa 2021", "2021 scholarship alumnus"), avatar: "v2b-face-1" },
            { quote: tr("Pelatihan guru desa mengubah cara saya mengajar membaca.", "The village teacher training changed how I teach reading."), author: "Ibu Martha Lado", role: tr("Guru SD di Alor", "Primary teacher in Alor"), avatar: "v2b-face-6" },
          ],
        }),
        ctaSplit(L, { title: tr("Rp150 ribu = 6 buku cerita bergambar", "Rp150k = 6 picture books"), text: tr("Laporan penyaluran dikirim ke email Anda setiap 3 bulan.", "Distribution reports are emailed to you every 3 months."), btns: [[tr("Donasi", "Donate"), href("donate")]], bg: PR.primaryDark }),
      ],
      programs: () => [
        pageHead(L, { ey: tr("Program", "Programs"), title: tr("Tiga program, satu tujuan", "Three programs, one goal"), text: tr("Anak membaca lancar di kelas 3 dan tetap sekolah sampai SMA.", "Children reading fluently by grade 3 and staying in school through high school."), image: "v2b-books" }),
        cards(L, {
          cols: 3,
          items: [
            { icon: "📚", title: tr("Rumah Baca", "Reading Houses"), text: tr("Ruang baca 6×8 m dengan 600 buku, dikelola warga desa, buka sore hari.", "6×8 m reading rooms with 600 books, run by villagers, open afternoons."), meta: tr("38 lokasi", "38 locations") },
            { icon: "🎓", title: tr("Beasiswa Pelita", "Pelita Scholarships"), text: tr("Biaya sekolah, seragam, dan mentor untuk siswa SMP–kuliah.", "School fees, uniforms, and mentors for middle school to university."), meta: tr("620 penerima", "620 recipients") },
            { icon: "🧑‍🏫", title: tr("Guru Desa", "Village Teachers"), text: tr("Pelatihan 10 hari metode membaca dini dan pendampingan 1 tahun.", "10-day early reading training plus 1 year of coaching."), meta: tr("412 guru", "412 teachers") },
          ],
        }),
        timeline(L, { title: tr("Perjalanan kami", "Our journey"), items: [["2012", tr("Rumah baca pertama", "First reading house"), tr("Di Desa Oelnasi, Kupang.", "In Oelnasi village, Kupang.")], ["2016", tr("Beasiswa dimulai", "Scholarships begin"), tr("25 siswa SMP pertama.", "The first 25 middle schoolers.")], ["2020", tr("Program Guru Desa", "Village Teacher program"), tr("Bermitra dengan 3 dinas pendidikan.", "Partnered with 3 education offices.")], ["2026", tr("Ekspansi ke Sumba", "Expansion to Sumba"), tr("Target 10 rumah baca baru.", "Target of 10 new reading houses.")]], bg: L.alt }),
      ],
      impact: () => [
        pageHead(L, { ey: tr("Dampak", "Impact"), title: tr("Transparansi adalah janji kami", "Transparency is our promise"), dark: true }),
        tableSec(L, {
          title: tr("Penggunaan dana 2025", "2025 use of funds"),
          columns: [tr("Pos", "Category"), tr("Jumlah", "Amount"), tr("Persentase", "Share")],
          rows: [[tr("Program Rumah Baca", "Reading Houses"), "Rp1,42 M", "41%"], [tr("Beasiswa", "Scholarships"), "Rp1,05 M", "30%"], [tr("Pelatihan guru", "Teacher training"), "Rp0,63 M", "18%"], [tr("Operasional", "Operations"), "Rp0,38 M", "11%"]],
          caption: tr("Diaudit oleh KAP independen, opini wajar tanpa pengecualian.", "Audited by an independent firm, unqualified opinion."),
        }),
        progressSec(L, { title: tr("Hasil belajar", "Learning outcomes"), text: tr("Asesmen membaca EGRA pada siswa kelas 3 di desa dampingan.", "EGRA reading assessment for grade 3 students in partner villages."), items: [[tr("Membaca lancar (2019)", "Fluent readers (2019)"), 23], [tr("Membaca lancar (2025)", "Fluent readers (2025)"), 71], [tr("Tetap sekolah hingga SMP", "Stayed through middle school"), 88]], bg: L.alt }),
        counters(L, [["Rp3,48 M", tr("Dana tersalurkan 2025", "Funds disbursed in 2025")], ["89%", tr("Langsung ke program", "Directly to programs")], ["2.940", tr("Donatur rutin", "Monthly donors")]], { dark: true }),
      ],
      stories: () => [
        ...article(L, {
          meta: tr("Cerita lapangan · September 2026", "Field story · September 2026"),
          title: tr("Rumah baca yang dibangun dengan bambu dan gotong royong", "A reading house built with bamboo and mutual help"),
          lead: tr("Di Desa Tanarara, Sumba Timur, 40 warga membangun rumah baca dalam 9 hari.", "In Tanarara village, East Sumba, 40 residents built a reading house in 9 days."),
          image: "v2b-heart",
          author: ["Agnes Bunga", tr("Koordinator Sumba", "Sumba coordinator"), "v2b-face-2"],
          body: [
            tr("Ketika kami datang membawa rencana bangunan, warga justru menawarkan bambu dari kebun mereka sendiri.", "When we arrived with building plans, the villagers offered bamboo from their own gardens."),
            tr("Anggaran yang tersisa dipakai untuk membeli 200 buku tambahan dan rak tahan rayap.", "The leftover budget bought 200 extra books and termite-proof shelves."),
            tr("Kini rumah baca buka setiap sore, dijaga bergantian oleh ibu-ibu PKK.", "Now the reading house opens every afternoon, looked after in turns by the village women's group."),
          ],
          pull: tr("“Ini rumah baca kami, bukan rumah baca yayasan.” — Kepala Desa Tanarara", "“This is our reading house, not the foundation's.” — Tanarara village head"),
          tags: ["Sumba", tr("Rumah Baca", "Reading House")],
        }),
        imgCards(L, { title: tr("Cerita lainnya", "More stories"), bg: L.alt, items: [{ image: "v2b-books", meta: "Alor", title: tr("Guru Martha dan 30 anak pembaca baru", "Teacher Martha and 30 new readers"), text: tr("Metode suku kata yang sederhana.", "A simple syllable method.") }, { image: "v2b-face-1", meta: "Kupang", title: tr("Dari ladang ke kampus", "From the fields to campus"), text: tr("Kisah Fransiskus, alumni beasiswa.", "Fransiskus, a scholarship alumnus.") }, { image: "v2b-heart", meta: "Rote", title: tr("Perpustakaan perahu", "The boat library"), text: tr("Buku menyeberang ke 4 pulau kecil.", "Books crossing to 4 small islands.") }] }),
      ],
      volunteer: () => [
        pageHead(L, { ey: tr("Relawan", "Volunteer"), title: tr("Bawa waktumu ke timur", "Bring your time east"), text: tr("Program 2–8 minggu, akomodasi di rumah warga.", "2–8 week programs, staying with host families."), center: true }),
        rowsList(L, {
          title: tr("Posisi terbuka", "Open positions"),
          items: [
            { meta: tr("Sumba Timur · 4 minggu · Jan 2027", "East Sumba · 4 weeks · Jan 2027"), title: tr("Pendamping rumah baca", "Reading house facilitator"), text: tr("Membacakan cerita dan melatih pengelola.", "Read aloud and train caretakers."), link: [tr("Daftar", "Apply"), "#daftar"] },
            { meta: tr("Kupang · 8 minggu · Feb 2027", "Kupang · 8 weeks · Feb 2027"), title: tr("Mentor beasiswa", "Scholarship mentor"), text: tr("Bimbingan belajar & persiapan kuliah.", "Tutoring & university prep."), link: [tr("Daftar", "Apply"), "#daftar"] },
            { meta: tr("Remote · fleksibel", "Remote · flexible"), title: tr("Desainer buku cerita", "Picture book designer"), text: tr("Ilustrasi cerita rakyat NTT.", "Illustrating NTT folk tales."), link: [tr("Daftar", "Apply"), "#daftar"] },
          ],
        }),
        formSec(L, { title: tr("Formulir relawan", "Volunteer form"), fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { k: "input", label: "Email", ph: "nama@email.com", type: "email" }, { k: "select", label: tr("Posisi", "Position"), ph: tr("Pilih posisi", "Choose a position"), options: [tr("Pendamping rumah baca", "Reading house facilitator"), tr("Mentor beasiswa", "Scholarship mentor"), tr("Desainer buku cerita", "Picture book designer")] }, { k: "check", label: tr("Saya bersedia tinggal di rumah warga", "I'm willing to stay with a host family") }], submit: tr("Kirim lamaran", "Submit application") }),
      ],
      donate: () => [
        priceCards(L, {
          ey: tr("Donasi", "Donate"),
          title: tr("Pilih cara berbagi", "Choose how to give"),
          text: tr("Donasi dapat menjadi pengurang penghasilan kena pajak.", "Donations may be tax deductible."),
          plans: [
            { plan: tr("Sahabat Buku", "Book Friend"), price: "Rp150rb", period: tr("/bulan", "/month"), desc: tr("6 buku cerita per bulan.", "6 storybooks a month."), features: [tr("Laporan triwulan", "Quarterly report"), tr("Kartu ucapan dari anak", "Thank-you card from a child")], btn: [tr("Mulai", "Start"), "#donasi-150"] },
            { plan: tr("Orang Tua Asuh", "Foster Sponsor"), price: "Rp500rb", period: tr("/bulan", "/month"), desc: tr("Biaya sekolah 1 siswa SMP.", "School fees for 1 middle schooler."), features: [tr("Profil siswa", "Student profile"), tr("Rapor tiap semester", "Semester report card"), tr("Surat dari siswa", "Letters from the student")], btn: [tr("Mulai", "Start"), "#donasi-500"], featured: true, badge: tr("Paling berdampak", "Most impact") },
            { plan: tr("Bangun Rumah Baca", "Build a Reading House"), price: "Rp45jt", period: tr("/sekali", "/once"), desc: tr("Untuk perusahaan & komunitas.", "For companies & communities."), features: [tr("Nama di plakat", "Name on the plaque"), tr("Kunjungan peresmian", "Opening visit"), tr("Laporan foto", "Photo report")], btn: [tr("Hubungi kami", "Contact us"), href("volunteer")] },
          ],
        }),
        accordionSec(L, { title: tr("Pertanyaan donatur", "Donor questions"), items: [[tr("Bagaimana cara transfer?", "How do I transfer?"), tr("Virtual account BCA, Mandiri, BNI, atau QRIS.", "Virtual account BCA, Mandiri, BNI, or QRIS.")], [tr("Bisa berhenti kapan saja?", "Can I stop anytime?"), tr("Bisa, cukup balas email konfirmasi.", "Yes, just reply to the confirmation email.")], [tr("Apakah ada laporan?", "Do I get reports?"), tr("Laporan triwulan dan audit tahunan dikirim ke email.", "Quarterly reports and the annual audit are emailed.")]] }),
      ],
    });
  },
};

/* ------------------- 7. wedding-organizer (PREMIUM, 8) ------------- */

const JK: Palette = { ink: "#3f2a2a", muted: "#7c5c5c", primary: "#b0855b", primaryDark: "#8c6239", soft: "#fdf6f0", line: "#ecd9c6" };
const jkL = look(JK, { font: FONTS.sans, hf: FONTS.elegant, r: 2, dark: "#2b1d1d", alt: "#fbf5f1", onDark: "#ecd9c6" });

export const weddingOrganizer: TemplateContent = {
  brand: "Janur Kemuning Wedding",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("packages", "Paket", "Packages", "paket", "packages"),
    P("portfolio", "Portofolio", "Portfolio", "portofolio", "portfolio"),
    P("venues", "Venue", "Venues", "venue", "venues"),
    P("rundown", "Alur Acara", "Rundown", "alur-acara", "rundown"),
    P("stories", "Testimoni", "Testimonials", "testimoni", "testimonials"),
    P("contact", "Konsultasi", "Consultation", "konsultasi", "consultation"),
  ],
  build: (key, tr, href) => {
    const L = jkL;
    const head = centeredHeader("Janur Kemuning", JK, { font: FONTS.elegant, bg: "#fdf6f0" });
    const foot = footer("Janur Kemuning Wedding", tr("Wedding organizer adat Jawa & modern di Yogyakarta dan Solo.", "Javanese traditional & modern wedding organizer in Yogyakarta and Solo."), [{ title: tr("Studio", "Studio"), items: ["Jl. Prawirotaman 17", "Yogyakarta"] }, { title: tr("Kontak", "Contact"), items: ["+62 812 2727 1001", "halo@janurkemuning.example"] }], tr("© 2026 Janur Kemuning Wedding. Foto & harga contoh.", "© 2026 Janur Kemuning Wedding. Sample photos & prices."), "#2b1d1d");
    return render(L, key, head, foot, {
      home: () => [
        heroImage(L, { ey: tr("Yogyakarta · Solo · Bali", "Yogyakarta · Solo · Bali"), title: tr("Hari bahagia yang terasa seperti kalian", "A wedding day that feels like you"), text: tr("Dari siraman sampai resepsi, kami merangkai adat dan cerita kalian dengan tenang dan rapi.", "From siraman to reception, we weave tradition and your story together, calmly and precisely."), btns: [[tr("Konsultasi gratis", "Free consultation"), href("contact")], [tr("Lihat paket", "See packages"), href("packages")]], image: "v2b-arch", overlay: "#2b1d1d", opacity: 45, center: true }),
        split(L, { ey: tr("Tentang kami", "About us"), title: tr("320 pernikahan, satu prinsip: pengantin tidak boleh panik", "320 weddings, one rule: the couple never panics"), paras: [tr("Tim 24 orang, koordinator khusus per keluarga, dan rundown yang diuji sehari sebelumnya.", "A team of 24, a dedicated coordinator per family, and a rundown rehearsed the day before.")], image: "v2b-rings", alt: tr("Cincin pernikahan", "Wedding rings"), btn: [tr("Layanan kami", "Our services"), href("services")] }),
        portfolioMosaic(L.t, tr, {
          eyebrow: tr("Portofolio", "Portfolio"),
          title: tr("Pernikahan terbaru", "Recent weddings"),
          text: tr("Setiap pasangan punya cerita yang berbeda.", "Every couple has a different story."),
          cta: { label: tr("Semua portofolio", "Full portfolio"), href: href("portfolio") },
          works: [
            { title: "Laras & Bima", tag: tr("Adat Jawa · Royal Ambarrukmo", "Javanese · Royal Ambarrukmo"), image: asset("v2b-arch") },
            { title: "Sekar & Daniel", tag: tr("Intimate · Taman", "Intimate · Garden"), image: asset("v2b-rings") },
            { title: "Ayu & Fajar", tag: tr("Solo · Pura Mangkunegaran", "Solo · Mangkunegaran Palace"), image: asset("photo-2") },
            { title: "Nadya & Kevin", tag: "Bali · Uluwatu", image: asset("photo-4") },
            { title: "Rara & Yusuf", tag: tr("Akad · Masjid Gedhe", "Akad · Gedhe Mosque"), image: asset("photo-1") },
          ],
        }),
        countdownSec(L, { ey: tr("Pameran pernikahan", "Wedding expo"), title: tr("Janur Kemuning Wedding Fair", "Janur Kemuning Wedding Fair"), text: tr("8–9 November 2026 di Jogja Expo Center. Diskon paket hingga 15% khusus pengunjung.", "November 8–9, 2026 at Jogja Expo Center. Up to 15% off packages for visitors."), target: "2026-11-08T10:00", done: tr("Pameran sedang berlangsung!", "The fair is on now!"), btn: [tr("Daftar kunjungan", "Register to visit"), href("contact")] }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Apa saja yang kami urus", "Everything we take care of"), center: true }),
        servicesSplit(L.t, tr, {
          eyebrow: tr("Perencanaan", "Planning"),
          title: tr("Dari lamaran sampai ngunduh mantu", "From proposal to the groom's family reception"),
          image: asset("v2b-arch"),
          items: [
            { icon: "I", title: tr("Perencanaan penuh", "Full planning"), text: tr("Anggaran, vendor, venue, dan jadwal 12 bulan.", "Budget, vendors, venue, and a 12-month schedule.") },
            { icon: "II", title: tr("Koordinasi hari-H", "Day-of coordination"), text: tr("12 kru, HT, dan rundown per menit.", "12 crew, radios, minute-by-minute rundown.") },
            { icon: "III", title: tr("Prosesi adat", "Traditional rites"), text: tr("Siraman, midodareni, panggih dengan pemandu adat.", "Siraman, midodareni, panggih with a ceremony guide.") },
          ],
          cta: { label: tr("Lihat paket", "See packages"), href: href("packages") },
        }),
        cards(L, { cols: 4, style: "line", bg: L.alt, items: [{ title: tr("Dekorasi", "Decoration"), text: tr("Janur, bunga segar, pelaminan.", "Palm leaves, fresh flowers, wedding dais.") }, { title: tr("Katering", "Catering"), text: tr("Mitra 9 katering terkurasi.", "9 curated caterers.") }, { title: tr("Rias & busana", "Makeup & attire"), text: tr("Paes ageng, solo basahan, modern.", "Paes ageng, solo basahan, modern.") }, { title: tr("Dokumentasi", "Documentation"), text: tr("Foto, video, live streaming.", "Photo, video, live streaming.") }] }),
      ],
      packages: () => [
        priceCards(L, {
          ey: tr("Paket", "Packages"),
          title: tr("Paket pernikahan 2027", "2027 wedding packages"),
          text: tr("Belum termasuk venue dan katering.", "Venue and catering not included."),
          bg: L.p.soft,
          plans: [
            { plan: tr("Akad Intim", "Intimate Akad"), price: "Rp18jt", period: tr("/acara", "/event"), desc: tr("Hingga 100 tamu.", "Up to 100 guests."), features: [tr("Koordinator hari-H (6 kru)", "Day-of coordinator (6 crew)"), tr("Dekorasi akad", "Akad decoration"), tr("Rundown & gladi", "Rundown & rehearsal")], btn: [tr("Pilih", "Choose"), href("contact")] },
            { plan: tr("Adat Lengkap", "Full Tradition"), price: "Rp65jt", period: tr("/acara", "/event"), desc: tr("Hingga 600 tamu.", "Up to 600 guests."), features: [tr("Perencanaan 9 bulan", "9-month planning"), tr("Siraman, midodareni, panggih", "Siraman, midodareni, panggih"), tr("Pelaminan & janur", "Dais & palm décor"), tr("12 kru hari-H", "12 day-of crew")], btn: [tr("Pilih", "Choose"), href("contact")], featured: true, badge: tr("Terlaris", "Best seller") },
            { plan: "Destination Bali", price: "Rp120jt", period: tr("/acara", "/event"), desc: tr("Hingga 150 tamu.", "Up to 150 guests."), features: [tr("Survei venue", "Venue scouting"), tr("Akomodasi tamu", "Guest accommodation"), tr("Upacara pantai", "Beach ceremony")], btn: [tr("Pilih", "Choose"), href("contact")] },
          ],
        }),
        tableSec(L, { title: tr("Tambahan populer", "Popular add-ons"), columns: [tr("Layanan", "Service"), tr("Harga", "Price")], rows: [[tr("Live streaming 2 kamera", "2-camera live stream"), "Rp6,5jt"], [tr("Undangan digital + RSVP", "Digital invitation + RSVP"), "Rp1,8jt"], [tr("Gamelan 12 pengrawit", "12-player gamelan"), "Rp9jt"], [tr("Photo booth 4 jam", "4-hour photo booth"), "Rp4,2jt"]] }),
      ],
      portfolio: () => [
        pageHead(L, { ey: tr("Portofolio", "Portfolio"), title: tr("Cerita yang pernah kami rangkai", "Stories we've woven"), dark: true }),
        gallery(L, { images: [["v2b-arch", "Laras & Bima"], ["v2b-rings", "Sekar & Daniel"], ["photo-1", "Rara & Yusuf"], ["photo-2", "Ayu & Fajar"], ["photo-3", tr("Detail pelaminan", "Dais detail")], ["photo-4", "Nadya & Kevin"]], cols: 3, ratio: "4 / 5" }),
        quote(L, { text: tr("Kami cuma perlu datang, menikah, dan menikmati. Sisanya sudah diurus.", "We just had to show up, get married, and enjoy. Everything else was handled."), name: "Laras & Bima", role: tr("Menikah Juni 2026", "Married June 2026"), bg: L.alt }),
      ],
      venues: () => [
        pageHead(L, { ey: "Venue", title: tr("Venue rekanan", "Partner venues"), text: tr("Harga khusus untuk klien Janur Kemuning.", "Special rates for Janur Kemuning clients.") }),
        imgCards(L, { cols: 3, boxed: true, items: [{ image: "v2b-arch", tag: tr("Indoor · 800 tamu", "Indoor · 800 guests"), title: tr("Pendopo Agung", "Pendopo Agung"), text: tr("Pendopo joglo dengan halaman 2.000 m².", "A joglo pavilion with a 2,000 m² courtyard.") }, { image: "v2b-garden", tag: tr("Outdoor · 250 tamu", "Outdoor · 250 guests"), title: tr("Taman Tirtasari", "Tirtasari Garden"), text: tr("Kebun tropis dengan kolam teratai.", "Tropical garden with a lotus pond.") }, { image: "v2b-villa-dusk", tag: tr("Bali · 150 tamu", "Bali · 150 guests"), title: "Uluwatu Cliff", text: tr("Upacara saat matahari terbenam.", "Sunset ceremonies.") }] }),
      ],
      rundown: () => [
        pageHead(L, { ey: tr("Alur acara", "Rundown"), title: tr("Contoh rundown hari-H", "A sample wedding-day rundown"), center: true }),
        timeline(L, { title: tr("Sabtu, adat Jawa lengkap", "Saturday, full Javanese ceremony"), items: [["06.00", tr("Rias pengantin", "Bridal makeup"), tr("Paes ageng ±3 jam.", "Paes ageng ±3 hours.")], ["08.30", tr("Akad nikah", "Akad ceremony"), tr("Penghulu & saksi siap 08.15.", "Officiant & witnesses ready at 8:15.")], ["10.00", tr("Panggih", "Panggih"), tr("Balangan suruh, wiji dadi, sindur.", "Betel throwing, egg breaking, sindur cloth.")], ["11.00", tr("Resepsi", "Reception"), tr("Kirab, sungkeman, jamuan.", "Procession, sungkeman, banquet.")], ["14.00", tr("Selesai", "Wrap"), tr("Bongkar dekorasi oleh vendor.", "Vendors strike the decoration.")]] }),
        accordionSec(L, { title: tr("Detail yang sering ditanyakan", "Details couples ask about"), bg: L.alt, items: [[tr("Kapan gladi bersih?", "When is the rehearsal?"), tr("H-1 sore di venue, ±90 menit.", "The afternoon before at the venue, ±90 minutes.")], [tr("Siapa yang pegang HT?", "Who carries radios?"), tr("Koordinator keluarga, MC, katering, dan dekor.", "Family coordinator, MC, catering, and décor.")]] }),
      ],
      stories: () => [
        testimonialsWall(L.t, tr, {
          eyebrow: tr("Testimoni", "Testimonials"),
          title: tr("Dari pasangan yang sudah menikah", "From couples who said yes"),
          score: 5,
          caption: tr("dari 286 ulasan Google", "from 286 Google reviews"),
          quotes: [
            { text: tr("Ibu saya yang paling cerewet soal adat pun puas. Pemandu adatnya luar biasa.", "Even my mother, the strictest about tradition, was happy. The ceremony guide was amazing."), name: "Sekar Ayuningtyas", role: tr("Menikah 2026", "Married 2026"), avatar: asset("v2b-face-2") },
            { text: tr("Hujan deras jam 10 pagi, tapi plan B sudah siap sejak minggu lalu.", "Heavy rain at 10am, but plan B had been ready since the week before."), name: "Fajar Prasetyo", role: tr("Menikah 2025", "Married 2025"), avatar: asset("v2b-face-1") },
            { text: tr("Destination wedding di Bali tanpa stres untuk 120 tamu dari Jakarta.", "A stress-free Bali destination wedding for 120 guests from Jakarta."), name: "Nadya Wirawan", role: tr("Menikah 2025", "Married 2025"), avatar: asset("v2b-face-4") },
          ],
        }),
        logos(L, { title: tr("Diliput oleh", "Featured in"), names: ["Majalah Pengantin", "Portal Nikah", "Harian Kota", "Majalah Wanita Kita"] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Konsultasi", "Consultation"), title: tr("Ceritakan rencana kalian", "Tell us your plans"), text: tr("Konsultasi pertama gratis di studio atau via video call.", "The first consultation is free at our studio or via video call."), info: [[tr("Studio", "Studio"), "Jl. Prawirotaman 17, Yogyakarta"], ["WhatsApp", "+62 812 2727 1001"]], fields: [{ k: "input", label: tr("Nama pasangan", "Couple's names"), ph: tr("Laras & Bima", "Laras & Bima") }, { k: "date", label: tr("Perkiraan tanggal", "Estimated date") }, { k: "select", label: tr("Jumlah tamu", "Guest count"), ph: tr("Pilih", "Choose"), options: ["< 100", "100–300", "300–600", "> 600"] }, { k: "select", label: tr("Konsep", "Concept"), ph: tr("Pilih", "Choose"), options: [tr("Adat Jawa", "Javanese"), tr("Modern", "Modern"), tr("Intimate", "Intimate"), "Destination"] }], submit: tr("Jadwalkan konsultasi", "Book a consultation") }),
      ],
    });
  },
};

/* ---------------------- 8. music-school (PREMIUM, 7) --------------- */

const NS: Palette = { ink: "#1e1b4b", muted: "#4c4a73", primary: "#4f46e5", primaryDark: "#3730a3", soft: "#eef2ff", line: "#c7d2fe" };
const nsL = look(NS, { font: FONTS.sans, hf: FONTS.grotesk, r: 16, dark: "#1e1b4b", alt: "#fffbeb", onDark: "#c7d2fe" });

export const musicSchool: TemplateContent = {
  brand: "Sekolah Musik Nadaswara",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("programs", "Program", "Programs", "program", "programs"),
    P("teachers", "Guru", "Teachers", "guru", "teachers"),
    P("schedule", "Jadwal", "Schedule", "jadwal", "schedule"),
    P("fees", "Biaya", "Fees", "biaya", "fees"),
    P("events", "Acara", "Events", "acara", "events"),
    P("register", "Daftar", "Enroll", "daftar", "enroll"),
  ],
  build: (key, tr, href) => {
    const L = nsL;
    const head = header("nadaswara♪", NS, { bg: "#1e1b4b", ink: "#ffffff", font: FONTS.grotesk, cta: cta(tr("Kelas trial", "Trial lesson"), href("register"), NS, "light") });
    const foot = footerSlim(L, "nadaswara♪", [[tr("Program", "Programs"), href("programs")], [tr("Biaya", "Fees"), href("fees")], [tr("Daftar", "Enroll"), href("register")]], tr("© 2026 Sekolah Musik Nadaswara · Medan. Konten contoh.", "© 2026 Nadaswara Music School · Medan. Sample content."));
    return render(L, key, head, foot, {
      home: () => [
        heroType(L, { ey: tr("Sekolah musik · Medan", "Music school · Medan"), prefix: tr("Belajar main", "Learn to play"), words: ["piano", tr("gitar", "guitar"), tr("biola", "violin"), "drum", tr("vokal", "voice")], text: tr("Kelas privat & grup untuk usia 4 tahun hingga dewasa, dengan kurikulum ABRSM dan Rockschool.", "Private & group lessons for ages 4 to adult, following ABRSM and Rockschool curricula."), btns: [[tr("Coba kelas gratis", "Try a free lesson"), href("register")], [tr("Lihat program", "See programs"), href("programs")]], image: "v2b-music", alt: tr("Gitar dan piano", "Guitar and piano"), dark: true }),
        cards(L, { ey: tr("Kenapa Nadaswara", "Why Nadaswara"), title: tr("Belajar musik yang tidak membosankan", "Music lessons that never get boring"), cols: 3, items: [{ icon: "🎹", title: tr("Studio kedap suara", "Soundproof studios"), text: tr("9 ruang dengan piano akustik Yamaha.", "9 rooms with Yamaha acoustic pianos.") }, { icon: "🏅", title: tr("Ujian internasional", "International exams"), text: tr("Pusat ujian ABRSM resmi di Sumut.", "Official ABRSM exam centre in North Sumatra.") }, { icon: "🎤", title: tr("Panggung tiap semester", "A stage every term"), text: tr("Semua murid tampil di resital.", "Every student performs at the recital.") }], bg: L.alt }),
        counters(L, [["640", tr("Murid aktif", "Active students")], ["22", tr("Guru", "Teachers")], ["98%", tr("Lulus ujian ABRSM", "ABRSM pass rate")], ["2009", tr("Berdiri", "Founded")]]),
        ctaBand(L.t, tr, { title: tr("Kelas trial 30 menit, gratis", "A free 30-minute trial lesson"), text: tr("Guru akan menilai level dan merekomendasikan kelas.", "A teacher will assess the level and recommend a class."), primary: { label: tr("Daftar trial", "Book a trial"), href: href("register") }, secondary: { label: tr("Biaya", "Fees"), href: href("fees") } }),
      ],
      programs: () => [
        pageHead(L, { ey: tr("Program", "Programs"), title: tr("Pilih instrumen, pilih jalur", "Pick an instrument, pick a path"), image: "v2b-music" }),
        tabsSec(L, { title: tr("Instrumen", "Instruments"), variant: "pills", tabs: [["Piano", tr("Klasik (ABRSM grade 1–8) atau pop/jazz. Mulai usia 5 tahun. 30/45/60 menit per minggu.", "Classical (ABRSM grades 1–8) or pop/jazz. From age 5. 30/45/60 minutes a week.")], [tr("Gitar", "Guitar"), tr("Akustik, elektrik, atau klasik. Rockschool Debut–Grade 8.", "Acoustic, electric, or classical. Rockschool Debut–Grade 8.")], [tr("Biola", "Violin"), tr("Metode Suzuki untuk anak, ABRSM untuk remaja & dewasa.", "Suzuki method for kids, ABRSM for teens & adults.")], ["Drum", tr("Ruang drum akustik & elektrik, mulai usia 7 tahun.", "Acoustic & electronic drum rooms, from age 7.")], [tr("Vokal", "Voice"), tr("Teknik pernapasan, pop, musikal, dan paduan suara.", "Breathing technique, pop, musical theatre, and choir.")]] }),
        cards(L, { title: tr("Kelas grup", "Group classes"), style: "line", cols: 3, bg: L.alt, items: [{ meta: tr("Usia 4–6", "Ages 4–6"), title: "Little Mozart", text: tr("Ritme, lagu, dan mengenal not lewat permainan.", "Rhythm, songs, and notes through play.") }, { meta: tr("Usia 10–17", "Ages 10–17"), title: tr("Band Remaja", "Teen Band"), text: tr("Bermain dalam band, rekaman di akhir semester.", "Play in a band, record at the end of term.") }, { meta: tr("Dewasa", "Adults"), title: tr("Paduan Suara Senja", "Evening Choir"), text: tr("Kamis malam, tanpa audisi.", "Thursday evenings, no audition.") }] }),
      ],
      teachers: () => [
        teamCards(L.t, tr, { eyebrow: tr("Guru", "Teachers"), title: tr("Musisi yang juga pengajar sabar", "Musicians who are patient teachers"), members: [{ name: "Theresia Sitompul", role: tr("Piano · LTCL", "Piano · LTCL"), photo: asset("v2b-face-2") }, { name: "Daniel Siregar", role: tr("Gitar · Berklee Online", "Guitar · Berklee Online"), photo: asset("v2b-face-1") }, { name: "Mei Ling Tan", role: tr("Biola · Suzuki Book 1–6", "Violin · Suzuki Books 1–6"), photo: asset("v2b-face-6") }, { name: "Raja Ginting", role: tr("Drum · 15 th panggung", "Drums · 15 years on stage"), photo: asset("v2b-face-5") }] }),
        quote(L, { text: tr("Tugas guru bukan membuat murid sempurna, tapi membuat mereka ingin berlatih besok.", "A teacher's job isn't making students perfect, it's making them want to practice tomorrow."), name: "Theresia Sitompul", role: tr("Kepala sekolah", "Head of school"), dark: true }),
      ],
      schedule: () => [
        pageHead(L, { ey: tr("Jadwal", "Schedule"), title: tr("Jam buka studio", "Studio hours"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Jadwal", "Schedule"), ""]] }),
        tableSec(L, { title: tr("Slot kelas privat", "Private lesson slots"), text: tr("Slot berwarna penuh. Hubungi admin untuk daftar tunggu.", "Full slots shown as booked. Contact admin for the waitlist."), columns: [tr("Hari", "Day"), "Piano", tr("Gitar", "Guitar"), tr("Biola", "Violin"), "Drum"], rows: [[tr("Senin–Jumat", "Mon–Fri"), "14.00–20.00", "15.00–21.00", "14.00–18.00", "16.00–21.00"], [tr("Sabtu", "Saturday"), "08.00–17.00", "09.00–17.00", "08.00–14.00", "10.00–18.00"], [tr("Minggu", "Sunday"), tr("Tutup", "Closed"), tr("Tutup", "Closed"), tr("Tutup", "Closed"), tr("Sewa studio", "Studio rental")]] }),
        infoBar(L, [[tr("Alamat", "Address"), "Jl. Gatot Subroto 155, Medan"], [tr("Parkir", "Parking"), tr("Basement, gratis", "Basement, free")], [tr("Ruang tunggu", "Waiting room"), tr("Ber-AC & Wi-Fi", "AC & Wi-Fi")]]),
      ],
      fees: () => [
        priceSwitch(L, { ey: tr("Biaya", "Fees"), title: tr("Biaya kursus", "Tuition"), text: tr("Uang pendaftaran Rp250rb, sekali seumur hidup.", "One-time Rp250k registration fee."), monthly: tr("Per bulan", "Monthly"), yearly: tr("Per semester", "Per term"), save: tr("Hemat 10%", "Save 10%"), pm: tr("/bulan", "/month"), py: tr("/semester", "/term"), href: href("register"), featured: 2, plans: [tr("Grup | Rp350rb | Rp1,9jt | 4× 60 menit; Maks. 6 murid; Resital semester | Daftar", "Group | Rp350k | Rp1.9m | 4× 60 min; Max 6 students; Term recital | Enroll"), tr("Privat 30 | Rp600rb | Rp3,2jt | 4× 30 menit; Buku materi; Laporan bulanan | Daftar", "Private 30 | Rp600k | Rp3.2m | 4× 30 min; Course book; Monthly report | Enroll"), tr("Privat 60 | Rp1,1jt | Rp5,9jt | 4× 60 menit; Persiapan ujian; Rekaman progres | Daftar", "Private 60 | Rp1.1m | Rp5.9m | 4× 60 min; Exam prep; Progress recordings | Enroll")] }),
        faqAccordion(L.t, tr, { items: [[tr("Bagaimana jika berhalangan?", "What if we miss a lesson?"), tr("Ganti jadwal maksimal 2× per bulan dengan pemberitahuan 24 jam.", "Reschedule up to twice a month with 24 hours' notice.")], [tr("Harus punya alat sendiri?", "Do I need my own instrument?"), tr("Tidak untuk kelas di studio, tapi disarankan untuk latihan di rumah.", "Not for studio lessons, but recommended for home practice.")]] }),
      ],
      events: () => [
        pageHead(L, { ey: tr("Acara", "Events"), title: tr("Panggung & masterclass", "Stage & masterclasses"), dark: true }),
        rowsList(L, { title: tr("Agenda semester ini", "This term's agenda"), items: [{ meta: tr("Sab, 22 Nov 2026 · Aula Nadaswara", "Sat, Nov 22, 2026 · Nadaswara Hall"), title: tr("Resital Piano Anak", "Children's Piano Recital"), text: tr("48 murid tampil, gratis untuk umum.", "48 students perform, free to attend."), link: [tr("Info", "Info"), "#resital"] }, { meta: tr("Min, 7 Des 2026 · online", "Sun, Dec 7, 2026 · online"), title: tr("Masterclass Gitar Fingerstyle", "Fingerstyle Guitar Masterclass"), text: tr("Bersama musisi tamu dari Yogyakarta.", "With a guest musician from Yogyakarta."), link: [tr("Daftar", "Register"), href("register")] }, { meta: tr("Sab, 13 Des 2026 · Tiara Convention", "Sat, Dec 13, 2026 · Tiara Convention"), title: tr("Konser Akhir Tahun", "Year-End Concert"), text: tr("Band remaja, paduan suara, dan orkestra gesek.", "Teen bands, choir, and string orchestra."), link: [tr("Tiket", "Tickets"), "#konser"] }] }),
        gallery(L, { title: tr("Resital lalu", "Past recitals"), images: [["v2b-music", tr("Piano", "Piano")], ["event-stage", tr("Panggung", "Stage")], ["v2b-face-4", tr("Vokal", "Voice")], ["community-people", tr("Penonton", "Audience")]], cols: 4, bg: L.alt }),
      ],
      register: () => [
        formSec(L, { ey: tr("Daftar", "Enroll"), title: tr("Pesan kelas trial gratis", "Book a free trial lesson"), info: [["WhatsApp", "+62 811 6060 909"], [tr("Admin", "Admin"), tr("Sen–Sab 09.00–18.00", "Mon–Sat 9am–6pm")]], fields: [{ k: "input", label: tr("Nama murid", "Student name"), ph: tr("Nama", "Name") }, { k: "input", label: tr("Usia", "Age"), ph: "8", type: "number" }, { k: "select", label: tr("Instrumen", "Instrument"), ph: tr("Pilih", "Choose"), options: ["Piano", tr("Gitar", "Guitar"), tr("Biola", "Violin"), "Drum", tr("Vokal", "Voice")] }, { k: "date", label: tr("Jadwal trial", "Trial slot"), mode: "datetime-local" }], submit: tr("Pesan trial", "Book trial") }),
      ],
    });
  },
};

/* ---------------- 9. construction-interior (PREMIUM, 9) ------------ */

const AK: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#d97706", primaryDark: "#b45309", soft: "#fffbeb", line: "#fde68a" };
const akL = look(AK, { font: FONTS.sans, hf: FONTS.grotesk, r: 2, dark: "#1c1917", alt: "#f5f5f4", onDark: "#d6d3d1" });

export const constructionInterior: TemplateContent = {
  brand: "Arkatama Build & Interior",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("projects", "Proyek", "Projects", "proyek", "projects"),
    P("case", "Studi Kasus", "Case Study", "studi-kasus", "case-study"),
    P("process", "Proses", "Process", "proses", "process"),
    P("materials", "Material", "Materials", "material", "materials"),
    P("about", "Tentang", "About", "tentang", "about"),
    P("careers", "Karier", "Careers", "karier", "careers"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = akL;
    const nav = mega(
      L,
      [
        `${tr("Layanan", "Services")} | ${href("services")}`,
        `- ${tr("Bangun baru", "New build")} | ${tr("Rumah & ruko 2–4 lantai", "2–4 storey homes & shophouses")} | ${href("services")}`,
        `- ${tr("Renovasi", "Renovation")} | ${tr("Struktur, atap, fasad", "Structure, roof, facade")} | ${href("services")}`,
        `- ${tr("Interior", "Interior")} | ${tr("Desain & furnitur custom", "Design & custom furniture")} | ${href("services")}`,
        `${tr("Proyek", "Projects")} | ${href("projects")}`,
        `- ${tr("Semua proyek", "All projects")} | ${tr("48 proyek selesai", "48 completed projects")} | ${href("projects")}`,
        `- ${tr("Studi kasus", "Case study")} | ${tr("Rumah Cluster Asoka", "Asoka Cluster House")} | ${href("case")}`,
        `${tr("Proses", "Process")} | ${href("process")}`,
        `${tr("Tentang", "About")} | ${href("about")}`,
      ],
      tr("Minta RAB", "Get a quote"),
      href("contact"),
    );
    const head = header("ARKATAMA", AK, { nav, font: FONTS.grotesk });
    const foot = footer("Arkatama Build & Interior", tr("Kontraktor & desain interior, BSD – Tangerang Selatan.", "Contractor & interior design, BSD – South Tangerang."), [{ title: tr("Kantor", "Office"), items: ["Ruko Golden Boulevard C-12", "BSD City"] }, { title: tr("Izin", "Licenses"), items: ["NIB 9120001234567", "SBU BG004"] }, { title: tr("Kontak", "Contact"), items: ["021 5316 7788", "proyek@arkatama.example"] }], tr("© 2026 Arkatama Build & Interior. Proyek contoh.", "© 2026 Arkatama Build & Interior. Sample projects."), "#1c1917");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { ey: tr("Kontraktor + interior dalam satu kontrak", "Contractor + interior in one contract"), title: tr("Bangun, renovasi, dan isi rumah tanpa pindah-pindah vendor", "Build, renovate, and furnish without juggling vendors"), text: tr("RAB transparan per item, laporan progres mingguan, dan garansi struktur 10 tahun.", "Itemized quotes, weekly progress reports, and a 10-year structural warranty."), btns: [[tr("Minta RAB gratis", "Get a free quote"), href("contact")], [tr("Lihat proyek", "See projects"), href("projects")]], image: "v2b-crane", alt: tr("Crane proyek", "Construction crane"), bg: "#fffbeb" }),
        statsBand(L.t, tr, { eyebrow: tr("Sejak 2011", "Since 2011"), title: tr("Dikerjakan tim sendiri, bukan disubkan", "Built by our own crew, not subcontracted"), text: tr("Mandor, tukang, dan workshop furnitur milik sendiri.", "Our own foremen, builders, and furniture workshop."), stats: [["48", tr("Proyek selesai", "Projects completed")], ["96%", tr("Tepat waktu", "On schedule")], ["10 th", tr("Garansi struktur", "Structural warranty")], ["120", tr("Tukang tetap", "Full-time builders")]] }),
        servicesSplit(L.t, tr, { eyebrow: tr("Layanan", "Services"), title: tr("Tiga layanan, satu penanggung jawab", "Three services, one point of contact"), image: asset("v2b-room"), items: [{ icon: "01", title: tr("Bangun baru", "New build"), text: tr("Dari IMB/PBG hingga serah terima kunci.", "From building permit to key handover.") }, { icon: "02", title: tr("Renovasi", "Renovation"), text: tr("Tambah lantai, ganti atap, perbaiki retak.", "Add a floor, replace roofs, fix cracks.") }, { icon: "03", title: tr("Interior", "Interior"), text: tr("Kitchen set, lemari, dan furnitur dari workshop kami.", "Kitchens, wardrobes, and furniture from our workshop.") }], cta: { label: tr("Detail layanan", "Service details"), href: href("services") } }),
        portfolioMosaic(L.t, tr, { eyebrow: tr("Proyek", "Projects"), title: tr("Proyek terbaru", "Latest projects"), cta: { label: tr("Semua proyek", "All projects"), href: href("projects") }, works: [{ title: tr("Rumah Cluster Asoka", "Asoka Cluster House"), tag: tr("Bangun baru · 2 lantai · 210 m²", "New build · 2 floors · 210 m²"), image: asset("v2b-crane") }, { title: tr("Ruko Gading Serpong", "Gading Serpong Shophouse"), tag: tr("Renovasi fasad", "Facade renovation"), image: asset("estate-house-2") }, { title: tr("Apartemen Kemang", "Kemang Apartment"), tag: tr("Interior · 96 m²", "Interior · 96 m²"), image: asset("v2b-room") }, { title: tr("Kafe Teras Pagi", "Teras Pagi Café"), tag: tr("Interior komersial", "Commercial interior"), image: asset("v2b-room-2") }, { title: tr("Rumah Bintaro", "Bintaro House"), tag: tr("Tambah lantai", "Added floor"), image: asset("estate-house-1") }] }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Lingkup pekerjaan", "Scope of work"), dark: true }),
        tabsSec(L, { title: tr("Detail per layanan", "Details per service"), tabs: [[tr("Bangun baru", "New build"), tr("Desain arsitektur, perhitungan struktur, pengurusan PBG, konstruksi, MEP, hingga serah terima. Mulai Rp5,8jt/m².", "Architecture, structural design, permits, construction, MEP, through handover. From Rp5.8m/m².")], [tr("Renovasi", "Renovation"), tr("Survei kondisi, RAB per item, pengerjaan bertahap agar rumah tetap bisa dihuni.", "Condition survey, itemized quote, phased work so you can keep living there.")], [tr("Interior", "Interior"), tr("Desain 3D, produksi di workshop Cikupa, instalasi 2–4 minggu.", "3D design, production at our Cikupa workshop, 2–4 week installation.")], [tr("Garansi", "Warranty"), tr("Struktur 10 tahun, atap & kebocoran 2 tahun, furnitur 1 tahun.", "Structure 10 years, roof & leaks 2 years, furniture 1 year.")]] }),
        cards(L, { title: tr("Termasuk di setiap kontrak", "Included in every contract"), cols: 4, style: "line", bg: L.alt, items: [{ title: tr("RAB per item", "Itemized quote"), text: tr("Tanpa harga borongan gelondongan.", "No lump-sum guesses.") }, { title: tr("Laporan mingguan", "Weekly report"), text: tr("Foto & progres via WhatsApp.", "Photos & progress via WhatsApp.") }, { title: tr("Termin bertahap", "Staged payments"), text: tr("Bayar sesuai progres fisik.", "Pay against physical progress.") }, { title: tr("Asuransi proyek", "Project insurance"), text: tr("CAR selama konstruksi.", "Contractor's all-risk cover.") }] }),
      ],
      projects: () => [
        pageHead(L, { ey: tr("Proyek", "Projects"), title: tr("48 proyek di Jabodetabek", "48 projects across Greater Jakarta"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Proyek", "Projects"), ""]] }),
        imgCards(L, { cols: 3, items: [{ image: "v2b-crane", tag: tr("Bangun baru", "New build"), title: tr("Rumah Cluster Asoka", "Asoka Cluster House"), text: tr("BSD · 210 m² · 9 bulan", "BSD · 210 m² · 9 months"), link: [tr("Studi kasus", "Case study"), href("case")] }, { image: "estate-house-2", tag: tr("Renovasi", "Renovation"), title: tr("Ruko Gading Serpong", "Gading Serpong Shophouse"), text: tr("Fasad & lantai 3 · 4 bulan", "Facade & 3rd floor · 4 months") }, { image: "v2b-room", tag: "Interior", title: tr("Apartemen Kemang", "Kemang Apartment"), text: tr("96 m² · 6 minggu", "96 m² · 6 weeks") }, { image: "v2b-room-2", tag: "Interior", title: tr("Kafe Teras Pagi", "Teras Pagi Café"), text: tr("120 kursi · 5 minggu", "120 seats · 5 weeks") }, { image: "estate-house-1", tag: tr("Renovasi", "Renovation"), title: tr("Rumah Bintaro", "Bintaro House"), text: tr("Tambah lantai · 5 bulan", "Added floor · 5 months") }, { image: "estate-house-3", tag: tr("Bangun baru", "New build"), title: tr("Rumah Alam Sutera", "Alam Sutera House"), text: tr("3 lantai · 12 bulan", "3 floors · 12 months") }] }),
      ],
      case: () => [
        pageHead(L, { ey: tr("Studi kasus", "Case study"), title: tr("Rumah Cluster Asoka, BSD", "Asoka Cluster House, BSD"), text: tr("Rumah tumbuh 2 lantai untuk keluarga dengan 3 anak.", "A 2-storey growing home for a family of five."), image: "v2b-crane" }),
        infoBar(L, [[tr("Luas", "Area"), "210 m²"], [tr("Durasi", "Duration"), tr("9 bulan", "9 months")], [tr("Nilai", "Value"), "Rp1,38 M"], [tr("Status", "Status"), tr("Finishing", "Finishing")]], { dark: true }),
        progressSec(L, { ey: tr("Progres Oktober 2026", "October 2026 progress"), title: tr("Laporan minggu ke-34", "Week 34 report"), text: tr("Struktur dan atap selesai; tim interior mulai memasang kitchen set.", "Structure and roof done; the interior team has started installing the kitchen."), items: [[tr("Struktur", "Structure"), 100], [tr("Atap & plafon", "Roof & ceiling"), 100], [tr("MEP", "MEP"), 85], [tr("Finishing", "Finishing"), 62], [tr("Interior", "Interior"), 30]], image: "v2b-room", striped: true }),
        split(L, { title: tr("Tantangan: tanah bekas rawa", "Challenge: former swamp land"), paras: [tr("Tes sondir menunjukkan tanah keras di kedalaman 9 m, sehingga kami memakai bore pile 30 cm sebanyak 42 titik.", "Soil tests found firm ground at 9 m, so we used 42 bored piles of 30 cm."), tr("Biaya fondasi naik 11%, tetapi risiko penurunan bangunan hilang.", "Foundation costs rose 11%, but the settlement risk is gone.")], image: "v2b-crane", alt: tr("Fondasi", "Foundation"), reverse: true, bg: L.alt }),
        gallery(L, { title: tr("Dokumentasi", "Documentation"), images: [["v2b-crane", tr("Minggu 6", "Week 6")], ["estate-house-3", tr("Minggu 20", "Week 20")], ["v2b-room", tr("Minggu 34", "Week 34")]], cols: 3, ratio: "4 / 3" }),
      ],
      process: () => [
        pageHead(L, { ey: tr("Proses", "Process"), title: tr("Dari survei sampai serah terima", "From survey to handover"), center: true }),
        steps(L, { title: tr("Enam tahap", "Six stages"), items: [[tr("Survei", "Survey"), tr("Gratis, 1–2 jam di lokasi.", "Free, 1–2 hours on site.")], [tr("Desain & RAB", "Design & quote"), tr("2–4 minggu, revisi 3×.", "2–4 weeks, 3 revisions.")], [tr("Kontrak", "Contract"), tr("Jadwal & termin disepakati.", "Schedule & payments agreed.")], [tr("Konstruksi", "Construction"), tr("Laporan mingguan.", "Weekly reports.")]] }),
        timeline(L, { title: tr("Contoh jadwal rumah 2 lantai", "Sample 2-storey schedule"), bg: L.alt, items: [[tr("Bulan 1", "Month 1"), tr("Persiapan & fondasi", "Prep & foundation"), tr("Bowplank, galian, bore pile.", "Setting out, excavation, piles.")], [tr("Bulan 2–4", "Months 2–4"), tr("Struktur", "Structure"), tr("Kolom, balok, plat lantai 2.", "Columns, beams, 2nd floor slab.")], [tr("Bulan 5–6", "Months 5–6"), tr("Atap & dinding", "Roof & walls"), tr("Rangka baja ringan, bata ringan.", "Light steel trusses, AAC blocks.")], [tr("Bulan 7–9", "Months 7–9"), tr("Finishing & interior", "Finishing & interior"), tr("Lantai, cat, kitchen set.", "Floors, paint, kitchen.")]] }),
      ],
      materials: () => [
        pageHead(L, { ey: tr("Material", "Materials"), title: tr("Spesifikasi standar kami", "Our standard specifications") }),
        tableSec(L, { title: tr("Standar vs premium", "Standard vs premium"), columns: [tr("Item", "Item"), tr("Standar", "Standard"), tr("Premium", "Premium")], rows: [[tr("Beton", "Concrete"), "K-250 ready mix", "K-300 ready mix"], [tr("Dinding", "Walls"), tr("Bata ringan 10 cm", "10 cm AAC block"), tr("Bata merah + insulasi", "Clay brick + insulation")], [tr("Atap", "Roof"), tr("Baja ringan + genteng metal", "Light steel + metal tiles"), tr("Baja ringan + genteng keramik", "Light steel + ceramic tiles")], [tr("Lantai", "Flooring"), tr("Granit 60×60", "60×60 granite"), tr("HT 120×60 / parket", "120×60 tile / parquet")], [tr("Kusen", "Frames"), tr("Aluminium 4 inci", "4-inch aluminum"), tr("Kayu merbau", "Merbau wood")]] }),
        accordionSec(L, { title: tr("Pertanyaan material", "Material questions"), bg: L.alt, items: [[tr("Boleh beli material sendiri?", "Can I supply my own materials?"), tr("Boleh untuk finishing; struktur wajib dari kami agar garansi berlaku.", "For finishes, yes; structure must be ours for the warranty to apply.")], [tr("Bagaimana jika harga besi naik?", "What if steel prices rise?"), tr("Harga dikunci saat kontrak untuk 6 bulan pertama.", "Prices are locked at contract for the first 6 months.")]] }),
      ],
      about: () => [
        split(L, { ey: tr("Tentang", "About"), title: tr("Didirikan mandor, dikelola insinyur", "Founded by a foreman, run by engineers"), paras: [tr("Pak Darsono memulai Arkatama sebagai mandor borongan pada 2011. Kini anaknya, Ir. Laksmi Darsono, memimpin 160 orang termasuk 12 insinyur sipil.", "Pak Darsono started Arkatama as a contract foreman in 2011. Today his daughter, Laksmi Darsono, leads 160 people including 12 civil engineers.")], image: "v2b-crane", alt: tr("Tim di lapangan", "Team on site") }),
        teamCards(L.t, tr, { eyebrow: tr("Pimpinan", "Leadership"), title: tr("Tim inti", "Core team"), members: [{ name: "Ir. Laksmi Darsono", role: tr("Direktur", "Director"), photo: asset("v2b-face-6") }, { name: "Darsono", role: tr("Pendiri & penasihat lapangan", "Founder & site advisor"), photo: asset("v2b-face-5") }, { name: "Andreas Tjahjono", role: tr("Kepala desain interior", "Head of interior design"), photo: asset("v2b-face-3") }, { name: "Siti Marlina, ST", role: tr("Manajer proyek", "Project manager"), photo: asset("v2b-face-2") }] }),
      ],
      careers: () => [
        pageHead(L, { ey: tr("Karier", "Careers"), title: tr("Bangun karier bersama kami", "Build your career with us"), dark: true }),
        rowsList(L, { title: tr("Lowongan", "Openings"), items: [{ meta: tr("BSD · Penuh waktu", "BSD · Full time"), title: tr("Site Engineer", "Site Engineer"), text: tr("S1 Teknik Sipil, pengalaman 2 tahun.", "BSc Civil Engineering, 2 years' experience."), link: [tr("Lamar", "Apply"), href("contact")] }, { meta: tr("Cikupa · Penuh waktu", "Cikupa · Full time"), title: tr("Tukang kayu senior", "Senior carpenter"), text: tr("Workshop furnitur, pengalaman 5 tahun.", "Furniture workshop, 5 years' experience."), link: [tr("Lamar", "Apply"), href("contact")] }, { meta: tr("BSD · Hybrid", "BSD · Hybrid"), title: tr("Desainer interior", "Interior designer"), text: tr("Mahir SketchUp & Enscape.", "Fluent in SketchUp & Enscape."), link: [tr("Lamar", "Apply"), href("contact")] }] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Minta RAB gratis", "Request a free quote"), text: tr("Survei lokasi gratis untuk area Jabodetabek.", "Free site survey across Greater Jakarta."), info: [[tr("Kantor", "Office"), "Ruko Golden Boulevard C-12, BSD"], [tr("Telepon", "Phone"), "021 5316 7788"]], fields: [{ k: "select", label: tr("Jenis proyek", "Project type"), ph: tr("Pilih", "Choose"), options: [tr("Bangun baru", "New build"), tr("Renovasi", "Renovation"), "Interior"] }, { k: "input", label: tr("Luas (m²)", "Area (m²)"), ph: "150", type: "number" }, { k: "input", label: tr("Lokasi", "Location"), ph: "Tangerang Selatan" }, { k: "date", label: tr("Jadwal survei", "Survey date") }], submit: tr("Kirim permintaan", "Send request") }),
      ],
    });
  },
};

/* ------------------ 10. hospitality-villa (PREMIUM, 10) ------------ */

const WK: Palette = { ink: "#1a2e22", muted: "#4b5d52", primary: "#3f6b4f", primaryDark: "#2d5039", soft: "#f3efe6", line: "#d9cfb8" };
const wkL = look(WK, { font: FONTS.sans, hf: FONTS.elegant, r: 0, dark: "#14231a", alt: "#f3efe6", bg: "#fbf9f4", onDark: "#d9cfb8" });

export const hospitalityVilla: TemplateContent = {
  brand: "Wanakarsa Villas",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("villas", "Vila", "Villas", "vila", "villas"),
    P("villa", "Vila Kolam", "Pool Villa", "vila-kolam", "pool-villa"),
    P("compare", "Bandingkan Vila", "Compare Villas", "bandingkan", "compare"),
    P("experiences", "Pengalaman", "Experiences", "pengalaman", "experiences"),
    P("dining", "Bersantap", "Dining", "bersantap", "dining"),
    P("spa", "Spa", "Spa", "spa", "spa"),
    P("gallery", "Galeri", "Gallery", "galeri", "gallery"),
    P("offers", "Penawaran", "Offers", "penawaran", "offers"),
    P("booking", "Reservasi", "Booking", "reservasi", "booking"),
  ],
  build: (key, tr, href) => {
    const L = wkL;
    const head = withTopbar(header("WANAKARSA", WK, { bg: "#14231a", ink: "#ffffff", font: FONTS.elegant, cta: cta(tr("Reservasi", "Book"), href("booking"), WK, "light") }), L, tr("Menginap 4 malam, bayar 3 — hingga 20 Desember", "Stay 4 nights, pay 3 — until December 20"), { link: [tr("Penawaran", "Offers"), href("offers")], bg: "#2d5039" });
    const foot = footer("Wanakarsa Villas", tr("Tujuh vila privat di tepi Sungai Ayung, Ubud.", "Seven private villas on the Ayung River, Ubud."), [{ title: tr("Alamat", "Address"), items: ["Jl. Raya Sayan 44", "Ubud, Bali"] }, { title: tr("Reservasi", "Reservations"), items: ["+62 361 970 444", "stay@wanakarsa.example"] }, { title: tr("Ikuti", "Follow"), items: ["Instagram", "Pinterest"] }], tr("© 2026 Wanakarsa Villas. Tarif contoh.", "© 2026 Wanakarsa Villas. Sample rates."), "#14231a");
    return render(L, key, head, foot, {
      home: () => [
        heroImage(L, { ey: "Sayan · Ubud", title: tr("Tidur diiringi suara sungai", "Fall asleep to the river"), text: tr("Tujuh vila beratap alang-alang dengan kolam pribadi, menghadap lembah Sungai Ayung.", "Seven thatched villas with private pools, overlooking the Ayung River valley."), btns: [[tr("Cek ketersediaan", "Check availability"), href("booking")], [tr("Lihat vila", "See villas"), href("villas")]], image: "v2b-villa", overlay: "#14231a", opacity: 40, minHeight: 640 }),
        imgCards(L, { ey: tr("Vila", "Villas"), title: tr("Tiga tipe vila", "Three villa types"), items: [{ image: "v2b-villa", title: tr("Vila Taman", "Garden Villa"), text: tr("1 kamar · 90 m² · mulai Rp3,2jt/malam", "1 bedroom · 90 m² · from Rp3.2m/night"), link: [tr("Detail", "Details"), href("villa")] }, { image: "v2b-villa-dusk", title: tr("Vila Kolam Lembah", "Valley Pool Villa"), text: tr("1 kamar · 140 m² · mulai Rp4,8jt/malam", "1 bedroom · 140 m² · from Rp4.8m/night"), link: [tr("Detail", "Details"), href("villa")] }, { image: "v2b-room", title: tr("Rumah Keluarga", "Family Residence"), text: tr("3 kamar · 320 m² · mulai Rp11jt/malam", "3 bedrooms · 320 m² · from Rp11m/night"), link: [tr("Detail", "Details"), href("villa")] }], ratio: "4 / 5" }),
        testimonialsWall(L.t, tr, { eyebrow: tr("Ulasan tamu", "Guest reviews"), title: tr("Tamu yang kembali lagi", "Guests who come back"), score: 4.9, caption: tr("dari 1.180 ulasan", "from 1,180 reviews"), dark: true, quotes: [{ text: tr("Sarapan terapung di kolam sambil melihat kabut lembah. Tak terlupakan.", "Floating breakfast in the pool watching the valley mist. Unforgettable."), name: "Claire Dubois", role: tr("Paris · menginap 5 malam", "Paris · 5-night stay"), avatar: asset("v2b-face-6") }, { text: tr("Butler kami, Wayan, mengingat kopi favorit kami sejak hari pertama.", "Our butler, Wayan, remembered our favorite coffee from day one."), name: "Hendra & Maya", role: tr("Jakarta · bulan madu", "Jakarta · honeymoon"), avatar: asset("v2b-face-4") }, { text: tr("Rumah Keluarga sempurna untuk tiga generasi.", "The Family Residence was perfect for three generations."), name: "Kenji Tanaka", role: tr("Osaka · keluarga 7 orang", "Osaka · family of 7"), avatar: asset("v2b-face-3") }] }),
        ctaSplit(L, { title: tr("Musim kemarau terbaik: Mei–September", "Best dry season: May–September"), text: tr("Pesan 90 hari sebelumnya untuk tarif terbaik.", "Book 90 days ahead for the best rates."), btns: [[tr("Reservasi", "Book"), href("booking")]], bg: "#2d5039" }),
      ],
      villas: () => [
        pageHead(L, { ey: tr("Vila", "Villas"), title: tr("Ruang yang menyatu dengan lembah", "Spaces that blend into the valley"), center: true }),
        imgCards(L, { cols: 3, boxed: true, items: [{ image: "v2b-villa", tag: tr("4 unit", "4 units"), title: tr("Vila Taman", "Garden Villa"), text: tr("Kolam rendam 3×5 m, taman tropis, bathtub batu.", "3×5 m plunge pool, tropical garden, stone bathtub."), link: [tr("Detail", "Details"), href("villa")] }, { image: "v2b-villa-dusk", tag: tr("2 unit", "2 units"), title: tr("Vila Kolam Lembah", "Valley Pool Villa"), text: tr("Kolam infinity 10 m menghadap sungai.", "10 m infinity pool facing the river."), link: [tr("Detail", "Details"), href("villa")] }, { image: "v2b-room", tag: tr("1 unit", "1 unit"), title: tr("Rumah Keluarga", "Family Residence"), text: tr("3 kamar, dapur lengkap, koki pribadi.", "3 bedrooms, full kitchen, private chef."), link: [tr("Detail", "Details"), href("villa")] }] }),
        ctaSplit(L, { title: tr("Bingung memilih?", "Can't decide?"), text: tr("Lihat perbandingan fasilitas setiap tipe.", "Compare the amenities of each type."), btns: [[tr("Bandingkan", "Compare"), href("compare")]] }),
      ],
      villa: () => [
        productDetail(L, { crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Vila", "Villas"), href("villas")], [tr("Vila Kolam Lembah", "Valley Pool Villa"), ""]], image: "v2b-villa-dusk", thumbs: ["v2b-villa", "v2b-room", "v2b-room-2"], tag: tr("Paling diminati", "Most requested"), title: tr("Vila Kolam Lembah", "Valley Pool Villa"), price: tr("Rp4,8jt / malam", "Rp4.8m / night"), compare: "Rp5,6jt", rating: 4.9, reviews: tr("dari 412 tamu", "from 412 guests"), text: tr("140 m², ranjang king, kolam infinity 10 m, bale bengong, dan kamar mandi semi-terbuka.", "140 m², king bed, 10 m infinity pool, bale pavilion, and semi-open bathroom."), options: [{ k: "date", label: tr("Check-in", "Check-in") }, { k: "select", label: tr("Tamu", "Guests"), ph: tr("2 dewasa", "2 adults"), options: [tr("1 dewasa", "1 adult"), tr("2 dewasa", "2 adults"), tr("2 dewasa + 1 anak", "2 adults + 1 child")] }], btns: [[tr("Reservasi", "Book"), href("booking")]], tabs: [[tr("Fasilitas", "Amenities"), tr("Sarapan terapung, minibar lokal, Wi-Fi 200 Mbps, yoga mat, speaker Bluetooth.", "Floating breakfast, local minibar, 200 Mbps Wi-Fi, yoga mat, Bluetooth speaker.")], [tr("Kebijakan", "Policies"), tr("Check-in 14.00, check-out 12.00. Pembatalan gratis hingga 14 hari.", "Check-in 2pm, check-out noon. Free cancellation up to 14 days.")], [tr("Lokasi", "Location"), tr("15 menit ke pusat Ubud, antar-jemput gratis 3× sehari.", "15 min to central Ubud, free shuttle 3× daily.")]] }),
        cards(L, { title: tr("Termasuk dalam tarif", "Included in the rate"), cols: 4, style: "plain", bg: L.alt, items: [{ icon: "🍳", title: tr("Sarapan", "Breakfast"), text: tr("Di vila atau restoran.", "In-villa or at the restaurant.") }, { icon: "🚐", title: tr("Antar-jemput", "Shuttle"), text: tr("Bandara untuk 3+ malam.", "Airport for 3+ nights.") }, { icon: "🧘", title: tr("Yoga pagi", "Morning yoga"), text: tr("Setiap hari 07.00.", "Daily at 7am.") }, { icon: "🧺", title: tr("Laundry", "Laundry"), text: tr("5 potong per hari.", "5 pieces per day.") }] }),
      ],
      compare: () => [
        pageHead(L, { ey: tr("Bandingkan", "Compare"), title: tr("Perbandingan tipe vila", "Villa type comparison"), center: true }),
        compareSec(L, { title: tr("Fasilitas per tipe", "Amenities by type"), columns: [tr("Taman", "Garden"), tr("Kolam Lembah", "Valley Pool"), tr("Rumah Keluarga", "Family Residence")], rows: [tr("Luas | 90 m² | 140 m² | 320 m²", "Size | 90 m² | 140 m² | 320 m²"), tr("Kamar | 1 | 1 | 3", "Bedrooms | 1 | 1 | 3"), tr("Kolam | Rendam 3×5 m | Infinity 10 m | Infinity 14 m", "Pool | 3×5 m plunge | 10 m infinity | 14 m infinity"), tr("Pemandangan sungai | tidak | ya | ya", "River view | no | yes | yes"), tr("Butler pribadi | tidak | ya | ya", "Private butler | no | yes | yes"), tr("Koki pribadi | tidak | tidak | ya", "Private chef | no | no | yes"), tr("Tarif mulai | Rp3,2jt | Rp4,8jt | Rp11jt", "From | Rp3.2m | Rp4.8m | Rp11m")], highlight: 2, caption: tr("Tarif per malam, belum termasuk pajak 21%.", "Nightly rates, excluding 21% tax.") }),
      ],
      experiences: () => [
        pageHead(L, { ey: tr("Pengalaman", "Experiences"), title: tr("Di luar vila", "Beyond the villa"), image: "v2b-farm" }),
        cards(L, { cols: 3, items: [{ icon: "🌾", meta: tr("Pagi · 3 jam", "Morning · 3 hrs"), title: tr("Jalan sawah Sayan", "Sayan rice field walk"), text: tr("Bersama petani, berakhir dengan kopi Bali.", "With a farmer, ending with Bali coffee.") }, { icon: "🚣", meta: tr("Siang · 2 jam", "Midday · 2 hrs"), title: tr("Arung jeram Ayung", "Ayung rafting"), text: tr("Jeram kelas II–III, cocok pemula.", "Class II–III rapids, beginner friendly.") }, { icon: "🛕", meta: tr("Sore · 4 jam", "Afternoon · 4 hrs"), title: tr("Pura & tari kecak", "Temples & kecak"), text: tr("Pura Tirta Empul dan pertunjukan senja.", "Tirta Empul temple and a sunset show.") }, { icon: "🍲", meta: tr("Pagi · 4 jam", "Morning · 4 hrs"), title: tr("Kelas masak Bali", "Balinese cooking class"), text: tr("Ke pasar Ubud lalu memasak 6 hidangan.", "Ubud market visit, then cook 6 dishes.") }, { icon: "🎨", meta: tr("Sore · 2 jam", "Afternoon · 2 hrs"), title: tr("Melukis kamasan", "Kamasan painting"), text: tr("Belajar dari pelukis desa Kamasan.", "Learn from a Kamasan village painter.") }, { icon: "🌌", meta: tr("Malam · 1 jam", "Night · 1 hr"), title: tr("Mandi bunga", "Flower bath"), text: tr("Di bathtub batu vila Anda.", "In your villa's stone bathtub.") }] }),
      ],
      dining: () => [
        pageHead(L, { ey: tr("Bersantap", "Dining"), title: tr("Restoran Lumbung", "Lumbung Restaurant"), text: tr("Bahan dari kebun sendiri dan petani Sayan.", "Produce from our garden and Sayan farmers."), dark: true }),
        priceList(L, { title: tr("Menu makan malam", "Dinner menu"), groups: [{ name: tr("Pembuka", "Starters"), items: [[tr("Lawar kelapa muda", "Young coconut lawar"), tr("sambal matah", "sambal matah"), "Rp95rb"], [tr("Sate lilit ikan", "Fish sate lilit"), tr("tusuk serai", "lemongrass skewers"), "Rp120rb"]] }, { name: tr("Utama", "Mains"), items: [[tr("Bebek betutu", "Bebek betutu"), tr("dimasak 8 jam", "slow-cooked 8 hours"), "Rp285rb"], [tr("Ikan bakar jimbaran", "Jimbaran grilled fish"), tr("tangkapan hari ini", "today's catch"), "Rp240rb"], [tr("Nasi campur vegan", "Vegan nasi campur"), tr("7 lauk", "7 sides"), "Rp160rb"]] }], note: tr("Harga belum termasuk pajak & layanan 21%.", "Prices exclude 21% tax & service.") }),
      ],
      spa: () => [
        pageHead(L, { ey: "Spa", title: tr("Spa Tirta Sari", "Tirta Sari Spa"), center: true }),
        tabsSec(L, { title: tr("Perawatan", "Treatments"), variant: "pills", tabs: [[tr("Pijat Bali", "Balinese massage"), tr("90 menit · Rp650rb. Teknik tekanan dalam dengan minyak kelapa dan sereh.", "90 min · Rp650k. Deep pressure with coconut and lemongrass oil.")], [tr("Lulur", "Lulur scrub"), tr("120 menit · Rp850rb. Lulur kunyit, mandi susu, mandi bunga.", "120 min · Rp850k. Turmeric scrub, milk soak, flower bath.")], [tr("Paket pasangan", "Couples ritual"), tr("150 menit · Rp1,9jt untuk berdua, di bale tepi sungai.", "150 min · Rp1.9m for two, in a riverside bale.")]] }),
        split(L, { title: tr("Dua bale di tepi sungai", "Two bales by the river"), paras: [tr("Terapis kami lulusan sekolah spa Ubud dengan pengalaman minimal 5 tahun.", "Our therapists trained at Ubud spa schools with at least 5 years' experience.")], image: "v2b-yoga", alt: tr("Bale spa", "Spa bale"), bg: L.alt }),
      ],
      gallery: () => [
        sliderSec(L, [[tr("Kabut pagi di lembah Ayung", "Morning mist over the Ayung valley"), tr("Pemandangan dari Vila Kolam Lembah.", "The view from the Valley Pool Villa."), "#2d5039"], [tr("Makan malam di Lumbung", "Dinner at Lumbung"), tr("Lampu minyak dan gamelan.", "Oil lamps and gamelan."), "#5b3a1f"], [tr("Senja di bale spa", "Dusk at the spa bale"), tr("Pukul 18.10, setiap hari.", "6:10pm, every day."), "#14231a"]], { height: 440, padY: 48 }),
        gallery(L, { images: [["v2b-villa", tr("Vila Taman", "Garden Villa")], ["v2b-villa-dusk", tr("Senja", "Dusk")], ["v2b-room", tr("Kamar", "Bedroom")], ["v2b-farm", tr("Sawah", "Rice fields")], ["v2b-yoga", "Yoga"], ["v2b-room-2", tr("Ruang tamu", "Living room")]], cols: 3, ratio: "4 / 3" }),
      ],
      offers: () => [
        countdownSec(L, { ey: tr("Penawaran musiman", "Seasonal offer"), title: tr("Menginap 4 malam, bayar 3", "Stay 4 nights, pay 3"), text: tr("Berlaku untuk pemesanan sebelum 20 Desember 2026, menginap hingga Maret 2027.", "For bookings made before December 20, 2026, stays until March 2027."), target: "2026-12-20T23:59", done: tr("Penawaran telah berakhir.", "This offer has ended."), btn: [tr("Pesan sekarang", "Book now"), href("booking")], bg: "#2d5039" }),
        cards(L, { title: tr("Paket lainnya", "Other packages"), cols: 3, style: "line", items: [{ meta: tr("Bulan madu", "Honeymoon"), title: tr("Asmara di Ayung", "Ayung Romance"), text: tr("3 malam, makan malam lilin, ritual spa berdua. Mulai Rp17,5jt.", "3 nights, candlelit dinner, couples spa ritual. From Rp17.5m."), link: [tr("Pesan", "Book"), href("booking")] }, { meta: tr("Keluarga", "Family"), title: tr("Liburan Tiga Generasi", "Three Generations"), text: tr("Rumah Keluarga 5 malam, kelas masak, babysitter. Mulai Rp52jt.", "Family Residence 5 nights, cooking class, babysitter. From Rp52m."), link: [tr("Pesan", "Book"), href("booking")] }, { meta: tr("Panjang", "Long stay"), title: tr("Kerja dari Ubud", "Work from Ubud"), text: tr("14+ malam, diskon 30%, meja kerja & Wi-Fi cepat.", "14+ nights, 30% off, desk & fast Wi-Fi."), link: [tr("Pesan", "Book"), href("booking")] }] }),
      ],
      booking: () => [
        formSec(L, { ey: tr("Reservasi", "Booking"), title: tr("Rencanakan masa inap", "Plan your stay"), text: tr("Tim reservasi membalas dalam 2 jam (08.00–22.00 WITA).", "Our reservations team replies within 2 hours (8am–10pm WITA)."), info: [[tr("Telepon", "Phone"), "+62 361 970 444"], ["WhatsApp", "+62 811 3970 444"], ["Email", "stay@wanakarsa.example"]], fields: [{ k: "select", label: tr("Tipe vila", "Villa type"), ph: tr("Pilih", "Choose"), options: [tr("Vila Taman", "Garden Villa"), tr("Vila Kolam Lembah", "Valley Pool Villa"), tr("Rumah Keluarga", "Family Residence")] }, { k: "date", label: "Check-in" }, { k: "date", label: "Check-out" }, { k: "select", label: tr("Tamu", "Guests"), ph: tr("Pilih", "Choose"), options: ["1", "2", "3–4", "5–7"] }, { k: "check", label: tr("Perlu antar-jemput bandara", "Need airport transfer") }], submit: tr("Kirim permintaan", "Send request"), formFirst: true }),
        infoBar(L, [["Check-in", "14.00"], ["Check-out", "12.00"], [tr("Bandara", "Airport"), tr("75 menit", "75 minutes")], [tr("Pembatalan", "Cancellation"), tr("Gratis H-14", "Free up to 14 days")]]),
      ],
    });
  },
};

