import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { pricingCards, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  board,
  cardsD,
  catalog,
  compareD,
  counterD,
  countdownD,
  ctaD,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroGlass,
  heroMinimal,
  heroPoster,
  heroSoft,
  heroTicket,
  home,
  locations,
  lookD,
  marqueeD,
  megaD,
  mosaic,
  newsletter,
  notes,
  numbers,
  pageHead,
  peopleD,
  pg,
  plansD,
  polaroids,
  pro,
  progressD,
  quotesD,
  rail,
  render,
  sliderD,
  specs,
  splitPanel,
  swatches,
  tableD,
  tabsD,
  timelineD,
  typerD,
  withFx,
  zigzag,
} from "./kitE";

/* ================================================================== */
/* Template v4 E6–E10: Furnitur minimalis, Kursus bahasa, Les privat,    */
/* Trip diving, Pelayaran penumpang.                                     */
/* ================================================================== */

/* -------- 6. Bidang Furnitur — furnitur minimalis (5 hlm) ----------- */
// Premium: slider. Library: Animate + AOS.

const BP: Palette = { ink: "#171717", muted: "#525252", primary: "#404040", primaryDark: "#171717", soft: "#f5f5f4", line: "#d4d4d4" };
const B = lookD(BP, { head: "Archivo Black", body: "Inter", shape: "sharp", radius: 0, bg: "#ffffff", alt: "#f5f5f4", inv: "#171717", fx: { animate: "fadeIn", aos: "fade-up" }, upper: true });

const bFoot = (tr: Tr) =>
  footerD("Bidang", B, {
    variant: "slim",
    about: tr("Furnitur minimalis modular, dirakit tanpa alat, dikirim dalam kotak pipih.", "Minimal modular furniture, tool-free assembly, shipped flat-packed."),
    social: ["Instagram | https://instagram.com/bidang.furnitur", "Pinterest | https://pinterest.com/bidangfurnitur"],
    copy: tr("© 2026 Bidang Furnitur. Konten contoh.", "© 2026 Bidang Furnitur. Sample content."),
  });

export const furnitureMinimalis: TemplateContent = {
  brand: "Bidang Furnitur",
  pages: [home(), pg("products", ["produk", "Produk"], ["products", "Products"]), pg("lookbook", ["inspirasi", "Inspirasi"], ["lookbook", "Lookbook"]), pg("delivery", ["pengiriman", "Pengiriman"], ["delivery", "Delivery"]), pg("showroom", ["showroom", "Showroom"], ["showroom", "Showroom"])],
  build: (key, tr, href) =>
    render(B, key, headerD("Bidang", B, { variant: "bar", cta: [tr("Belanja", "Shop"), href("products"), "dark"] }), bFoot(tr), {
      home: () => [
        heroMinimal(B, {
          eyebrow: tr("Furnitur modular", "Modular furniture"),
          title: tr("Lebih sedikit benda, lebih banyak ruang", "Fewer things, more room"),
          text: tr("Sofa, rak, dan meja yang bisa ditambah atau dikurangi modulnya saat rumah Anda berubah.", "Sofas, shelves and tables you can add or remove modules from as your home changes."),
          image: asset("v4e-sofa"),
          alt: tr("Sofa abu-abu dan lampu lantai", "Grey sofa and floor lamp"),
          actions: [[tr("Lihat produk", "See products"), href("products"), "dark"]],
          note: tr("Gratis ongkir Jabodetabek untuk pesanan di atas Rp5 juta.", "Free delivery in Greater Jakarta on orders over Rp5M."),
        }),
        sliderD(B, { slides: [{ title: tr("Sofa Garis 3 modul", "Garis 3-module sofa"), text: tr("Tambah modul sudut kapan saja.", "Add a corner module any time."), bg: "#404040" }, { title: tr("Rak Petak", "Petak shelving"), text: tr("Kubus 40 cm yang bisa disusun bebas.", "40 cm cubes you can stack any way."), bg: "#78716c" }, { title: tr("Meja Lipat Dinding", "Fold-down wall desk"), text: tr("Kantor rumah dalam 60 cm.", "A home office in 60 cm."), bg: "#171717" }] }),
        swatches(B, { title: tr("Empat warna, semua cocok", "Four colours, all compatible"), items: [["#e7e5e4", tr("Kapas", "Cotton"), tr("Kain linen pucat.", "Pale linen.")], ["#78716c", tr("Batu", "Stone"), tr("Abu hangat.", "Warm grey.")], ["#404040", tr("Grafit", "Graphite"), tr("Gelap, anti noda.", "Dark, stain-resistant.")], ["#c2a189", tr("Tanah", "Clay"), tr("Terakota lembut.", "Soft terracotta.")]] }),
      ],
      products: () => [
        pageHead(B, { eyebrow: tr("Produk", "Products"), title: tr("Semua modul", "All modules") }),
        catalog(B, {
          title: tr("Terlaris bulan ini", "Best sellers this month"),
          cols: 3,
          items: [
            { image: asset("v4e-sofa"), title: tr("Sofa Garis 2 dudukan", "Garis 2-seat sofa"), text: tr("Modul lengan bisa dilepas.", "Removable arm modules."), price: "Rp6.900.000", cta: tr("Detail", "Details"), href: href("delivery"), rating: 5, reviews: "128" },
            { image: asset("v4e-sofa-clay"), title: tr("Kursi Santai Tanah", "Clay lounge chair"), text: tr("Rangka baja, busa padat.", "Steel frame, dense foam."), price: "Rp3.200.000", compare: "Rp3.700.000", badge: tr("Diskon", "Sale"), cta: tr("Detail", "Details"), href: href("delivery") },
            { image: asset("v4e-chair-sage"), title: tr("Kursi Makan Lurus", "Lurus dining chair"), text: tr("Set isi 2.", "Set of 2."), price: "Rp2.400.000", cta: tr("Detail", "Details"), href: href("delivery"), rating: 4, reviews: "54" },
          ],
        }),
        specs(B, { title: tr("Ukuran modul standar", "Standard module sizes"), rows: [[tr("Dudukan", "Seat"), "80 × 90 × 72 cm"], [tr("Sudut", "Corner"), "90 × 90 × 72 cm"], [tr("Lengan", "Arm"), "20 × 90 × 60 cm"], [tr("Berat", "Weight"), tr("14 kg per modul", "14 kg per module")]], image: asset("v4e-sofa"), alt: tr("Modul sofa", "Sofa module") }),
      ],
      lookbook: () => [
        pageHead(B, { eyebrow: tr("Inspirasi", "Lookbook"), title: tr("Rumah kecil, tata letak cerdas", "Small homes, smart layouts") }),
        mosaic(B, { title: tr("Apartemen 36 m²", "A 36 m² apartment"), images: [[asset("v4e-sofa"), tr("Ruang tamu", "Living")], [asset("v4e-sofa-clay"), tr("Sudut baca", "Reading nook")], [asset("v4e-chair-sage"), tr("Ruang makan", "Dining")]] }),
        zigzag(B, { title: tr("Tiga ide penataan", "Three layout ideas"), steps: [[tr("Satu sofa, dua fungsi", "One sofa, two jobs"), tr("Modul ottoman menjadi tempat tidur tamu.", "The ottoman module becomes a guest bed."), asset("v4e-sofa")], [tr("Rak sebagai sekat", "Shelves as dividers"), tr("Rak Petak dua sisi memisahkan kamar tanpa dinding.", "Two-sided Petak shelving splits rooms without walls."), asset("v4e-sofa-clay")]] }),
      ],
      delivery: () => [
        pageHead(B, { eyebrow: tr("Pengiriman", "Delivery"), title: tr("Kotak pipih, rakit 15 menit", "Flat box, 15-minute assembly") }),
        rail(B, { title: tr("Dari gudang ke ruang tamu", "From warehouse to living room"), steps: [[tr("Pesan", "Order"), tr("Bayar via transfer atau kartu.", "Pay by transfer or card.")], [tr("Kirim", "Ship"), tr("2–5 hari kerja di Jawa.", "2–5 working days in Java.")], [tr("Rakit", "Assemble"), tr("Klik tanpa alat.", "Tool-free clicks.")]] }),
        faqD(B, { title: tr("Retur & garansi", "Returns & warranty"), items: [[tr("Bisa retur?", "Can I return?"), tr("30 hari, kemasan boleh sudah dibuka.", "30 days, opened packaging is fine.")], [tr("Garansi?", "Warranty?"), tr("5 tahun untuk rangka.", "5 years on frames.")]] }),
      ],
      showroom: () => [
        pageHead(B, { eyebrow: "Showroom", title: tr("Duduk dulu sebelum membeli", "Sit before you buy") }),
        locations(B, { title: tr("Lokasi showroom", "Showroom locations"), image: asset("v4e-route"), places: [["Bidang Senopati", "Jl. Suryo 12, Jakarta", "10.00–21.00"], ["Bidang Dago", "Jl. Ir. H. Juanda 140, Bandung", "10.00–20.00"]] }),
        newsletter(B, { title: tr("Kabar modul baru", "New module news"), text: tr("Sebulan sekali, tanpa spam.", "Once a month, no spam."), ph: tr("Email Anda", "Your email"), submit: tr("Daftar", "Sign up"), inv: true }),
      ],
    }),
};

/* ------ 7. Lingua Pelangi — kursus bahasa (7 hlm, Premium) ---------- */
// Premium: pricing, stats-counter, pro-testimonials-wall, countdown. Library: AOS + Animate.

const LP: Palette = { ink: "#2a0a0a", muted: "#6b3b3b", primary: "#dc2626", primaryDark: "#991b1b", soft: "#fee2e2", line: "#fecaca" };
const L = lookD(LP, { head: "Righteous", body: "Plus Jakarta Sans", shape: "retro", radius: 16, bg: "#fffbf5", alt: "#fff1e6", inv: "#2a0a0a", fx: { aos: "zoom-in-up", animate: "bounceIn" } });

const lFoot = (tr: Tr) =>
  footerD("Lingua Pelangi", L, {
    variant: "columns",
    about: tr("Kursus bahasa Inggris, Jepang, Korea, Mandarin, dan Jerman untuk pelajar dan pekerja.", "English, Japanese, Korean, Mandarin and German courses for students and professionals."),
    cols: [
      { title: tr("Program", "Programmes"), items: [tr("Inggris umum", "General English"), tr("Persiapan TOEFL", "TOEFL prep"), tr("Bahasa Asia", "Asian languages")] },
      { title: tr("Cabang", "Branches"), items: ["Malang", "Kediri", tr("Kelas daring", "Online classes")] },
    ],
    social: ["Instagram | https://instagram.com/linguapelangi", "YouTube | https://youtube.com/@linguapelangi", "TikTok | https://tiktok.com/@linguapelangi"],
    copy: tr("© 2026 Lingua Pelangi. Konten contoh.", "© 2026 Lingua Pelangi. Sample content."),
  });

export const languageKursusBahasa: TemplateContent = {
  brand: "Lingua Pelangi",
  pages: [
    home(),
    pg("programs", ["program", "Program"], ["programmes", "Programmes"]),
    pg("toefl", ["toefl", "TOEFL"], ["toefl-prep", "TOEFL Prep"]),
    pg("schedule", ["jadwal", "Jadwal"], ["timetable", "Timetable"]),
    pg("teachers", ["pengajar", "Pengajar"], ["teachers", "Teachers"]),
    pg("pricing", ["biaya", "Biaya"], ["fees", "Fees"]),
    pg("register", ["daftar", "Daftar"], ["enrol", "Enrol"]),
  ],
  build: (key, tr, href) =>
    render(L, key, headerD("Lingua Pelangi", L, { variant: "bar", cta: [tr("Tes level gratis", "Free level test"), href("register")] }), lFoot(tr), {
      home: () => [
        heroPoster(L, {
          eyebrow: tr("Kursus bahasa · sejak 2011", "Language school · since 2011"),
          title: tr("Bicara dulu, tata bahasa menyusul", "Speak first, grammar follows"),
          text: tr("Kelas maksimal 8 orang, 70% waktu untuk berbicara. Tersedia lima bahasa, luring dan daring.", "Classes of up to 8, with 70% of time spent speaking. Five languages, in person and online."),
          image: asset("v4e-speech"),
          alt: tr("Gelembung percakapan dua bahasa", "Bilingual speech bubbles"),
          date: tr("Kelas baru mulai 3 November", "New classes start 3 November"),
          actions: [[tr("Lihat program", "See programmes"), href("programs")], [tr("Tes level", "Level test"), href("register"), "outline"]],
        }),
        counterD(L, { items: [tr("14.000 | Alumni", "14,000 | Alumni"), tr("5 | Bahasa", "5 | Languages"), tr("8 | Siswa per kelas", "8 | Students per class"), tr("92% | Lulus target TOEFL", "92% | Hit TOEFL target")] }),
        cardsD(L, { eyebrow: tr("Bahasa", "Languages"), title: tr("Pilih bahasa Anda", "Pick your language"), cols: 5, items: [{ icon: "EN", title: tr("Inggris", "English"), text: tr("Umum, bisnis, TOEFL, IELTS.", "General, business, TOEFL, IELTS.") }, { icon: "JP", title: tr("Jepang", "Japanese"), text: tr("Persiapan JLPT N5–N3.", "JLPT N5–N3 prep.") }, { icon: "KR", title: tr("Korea", "Korean"), text: tr("TOPIK I & II.", "TOPIK I & II.") }, { icon: "ZH", title: tr("Mandarin", "Mandarin"), text: tr("HSK 1–4.", "HSK 1–4.") }, { icon: "DE", title: tr("Jerman", "German"), text: tr("A1–B1 untuk studi.", "A1–B1 for study.") }] }),
        withFx(L, testimonialsWall(pro(L), tr, { title: tr("Mereka sudah berani bicara", "They found their voice"), score: 4.9, caption: tr("dari 2.300 ulasan alumni", "from 2,300 alumni reviews"), quotes: [{ text: tr("Wawancara beasiswa saya lancar dalam bahasa Inggris.", "My scholarship interview in English went smoothly."), name: "Fajar Nugroho", role: tr("Penerima beasiswa", "Scholarship winner"), avatar: asset("v4e-face-1") }, { text: tr("Lulus JLPT N4 dalam 10 bulan.", "Passed JLPT N4 in 10 months."), name: "Ayu Lestari", role: tr("Perawat", "Nurse"), avatar: asset("v4e-face-2") }, { text: tr("Kelas kecilnya bikin tidak malu salah.", "Small classes meant I wasn't afraid of mistakes."), name: "Kevin Saputra", role: tr("Pelajar SMA", "High-schooler"), avatar: asset("v4e-face-3") }] })),
      ],
      programs: () => [
        pageHead(L, { eyebrow: tr("Program", "Programmes"), title: tr("Program untuk setiap tujuan", "A programme for every goal") }),
        tabsD(L, { title: tr("Jalur belajar", "Learning tracks"), tabs: [[tr("Reguler", "Regular"), tr("2× seminggu, 90 menit, 12 minggu per level.", "Twice a week, 90 minutes, 12 weeks per level.")], [tr("Intensif", "Intensive"), tr("5× seminggu, cocok untuk persiapan berangkat.", "5 times a week, ideal before departure.")], [tr("Korporat", "Corporate"), tr("Kelas di kantor Anda, materi sesuai industri.", "Classes at your office, industry-specific material.")]] }),
        zigzag(L, { title: tr("Metode kami", "Our method"), steps: [[tr("Bicara dari hari pertama", "Speak from day one"), tr("Setiap sesi dibuka dengan permainan peran.", "Every session opens with role-play."), asset("v4e-speech")], [tr("Umpan balik rekaman", "Recorded feedback"), tr("Rekaman suara Anda dinilai pengajar setiap minggu.", "Teachers review your voice recordings weekly."), asset("v4e-speech-jp")]] }),
      ],
      toefl: () => [
        heroTicket(L, { eyebrow: tr("Persiapan TOEFL ITP & iBT", "TOEFL ITP & iBT prep"), title: tr("Target skor, bukan sekadar latihan soal", "A target score, not just practice tests"), text: tr("Diagnostik awal, strategi per bagian, dan 4 kali simulasi tes resmi.", "An initial diagnostic, section strategies and 4 full mock tests."), stubs: [[tr("Durasi", "Length"), tr("8 minggu", "8 weeks")], [tr("Simulasi", "Mocks"), "4×"], [tr("Rata-rata kenaikan", "Avg. gain"), tr("+63 poin", "+63 points")]], actions: [[tr("Daftar", "Enrol"), href("register")]] }),
        countdownD(L, { eyebrow: tr("Simulasi berikutnya", "Next mock test"), title: tr("Simulasi TOEFL gratis", "Free TOEFL mock test"), text: tr("Terbuka untuk umum, kuota 60 kursi.", "Open to everyone, 60 seats."), target: "2026-11-22T08:00", finished: tr("Simulasi sedang berlangsung", "The mock is under way"), actions: [[tr("Amankan kursi", "Save a seat"), href("register"), "light"]] }),
      ],
      schedule: () => [
        pageHead(L, { eyebrow: tr("Jadwal", "Timetable"), title: tr("Jadwal kelas November", "November class timetable") }),
        tableD(L, { title: tr("Kelas yang dibuka", "Open classes"), columns: [tr("Kelas", "Class"), tr("Hari", "Days"), tr("Jam", "Time"), tr("Kursi", "Seats")], rows: [[tr("Inggris A2", "English A2"), tr("Sen & Rab", "Mon & Wed"), "16.00", "3"], [tr("Jepang N5", "Japanese N5"), tr("Sel & Kam", "Tue & Thu"), "18.30", "5"], [tr("Korea dasar", "Korean basics"), tr("Sabtu", "Sat"), "09.00", "2"], ["TOEFL", tr("Sen–Jum", "Mon–Fri"), "19.00", "6"]] }),
        notes(L, { title: tr("Catatan penting", "Good to know"), colors: ["#fef08a", "#fecaca", "#bfdbfe"], items: [[tr("Tes level", "Level test"), tr("Wajib sebelum kelas pertama.", "Required before your first class.")], [tr("Kelas pengganti", "Make-up class"), tr("2× per level.", "2 per level.")], [tr("Materi", "Materials"), tr("Termasuk biaya.", "Included in the fee.")]] }),
      ],
      teachers: () => [
        pageHead(L, { eyebrow: tr("Pengajar", "Teachers"), title: tr("Pengajar bersertifikat & penutur asli", "Certified & native-speaker teachers") }),
        peopleD(L, { title: tr("Kenalan dulu", "Meet them"), cols: 4, items: [{ name: "Rina Maharani", role: tr("Inggris · CELTA", "English · CELTA"), photo: asset("v4e-face-2") }, { name: "Takeshi Ono", role: tr("Jepang · penutur asli", "Japanese · native"), photo: asset("v4e-face-1") }, { name: "Lee Soo-ah", role: tr("Korea · penutur asli", "Korean · native"), photo: asset("v4e-face-4") }, { name: "Hendra Wijaya", role: "Mandarin · HSK 6", photo: asset("v4e-face-3") }] }),
      ],
      pricing: () => [
        pageHead(L, { eyebrow: tr("Biaya", "Fees"), title: tr("Biaya per level", "Fees per level") }),
        plansD(L, { title: tr("Pilih format", "Choose a format"), items: [{ plan: tr("Daring", "Online"), price: "Rp1,2jt", period: tr("/level", "/level"), description: tr("Kelas Zoom 8 orang.", "Zoom class of 8."), features: [tr("24 sesi", "24 sessions"), tr("Rekaman kelas", "Class recordings")], buttonText: tr("Pilih", "Choose"), buttonHref: href("register") }, { plan: tr("Luring", "In person"), price: "Rp1,6jt", period: tr("/level", "/level"), description: tr("Di cabang terdekat.", "At your nearest branch."), features: [tr("24 sesi", "24 sessions"), tr("Klub percakapan", "Conversation club"), tr("Modul cetak", "Printed modules")], buttonText: tr("Pilih", "Choose"), buttonHref: href("register"), featured: true, badge: tr("Terlaris", "Best seller") }, { plan: "TOEFL", price: "Rp2,3jt", period: tr("/8 minggu", "/8 weeks"), description: tr("Termasuk 4 simulasi.", "Includes 4 mocks."), features: [tr("40 sesi", "40 sessions"), tr("Garansi ulang gratis", "Free retake guarantee")], buttonText: tr("Pilih", "Choose"), buttonHref: href("register") }] }),
      ],
      register: () => [
        pageHead(L, { eyebrow: tr("Daftar", "Enrol"), title: tr("Mulai dengan tes level gratis", "Start with a free level test") }),
        formD(L, { title: tr("Formulir pendaftaran", "Enrolment form"), info: [["WhatsApp", "0821 4400 1188"], [tr("Cabang", "Branch"), "Jl. Ijen 20, Malang"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: tr("Bahasa", "Language"), ph: tr("Pilih", "Choose"), options: [tr("Inggris", "English"), tr("Jepang", "Japanese"), tr("Korea", "Korean"), "Mandarin", tr("Jerman", "German")] }, { kind: "select", label: tr("Format", "Format"), ph: tr("Pilih", "Choose"), options: [tr("Daring", "Online"), tr("Luring", "In person")] }], submit: tr("Daftar", "Enrol") }),
      ],
    }),
};

/* --------- 8. Tutor Teras — les privat (4 hlm, Premium) ------------- */
// Premium: typewriter, pro-pricing-cards. Library: AOS.

const TP: Palette = { ink: "#0f1f3d", muted: "#4b5b78", primary: "#2563eb", primaryDark: "#1d4ed8", soft: "#dbeafe", line: "#bfdbfe" };
const TT = lookD(TP, { head: "Caveat", body: "Nunito", shape: "soft", radius: 28, bg: "#fbfdff", alt: "#eef5ff", inv: "#0f1f3d", fx: { aos: "fade-up" } });

const tFoot = (tr: Tr) =>
  footerD("Tutor Teras", TT, {
    variant: "slim",
    about: tr("Les privat SD–SMA di rumah atau daring, dengan tutor yang dipilih sesuai gaya belajar anak.", "Private tutoring for primary to high school, at home or online, with tutors matched to your child's learning style."),
    social: ["Instagram | https://instagram.com/tutorteras", "WhatsApp | https://wa.me/6281200004455"],
    copy: tr("© 2026 Tutor Teras. Konten contoh.", "© 2026 Tutor Teras. Sample content."),
  });

export const languageLesPrivat: TemplateContent = {
  brand: "Tutor Teras",
  pages: [home(), pg("subjects", ["mata-pelajaran", "Mata Pelajaran"], ["subjects", "Subjects"]), pg("pricing", ["paket", "Paket"], ["packages", "Packages"]), pg("join", ["mulai", "Mulai Les"], ["get-started", "Get Started"])],
  build: (key, tr, href) =>
    render(TT, key, headerD("Tutor Teras", TT, { variant: "pill", cta: [tr("Coba 1 sesi", "Try 1 session"), href("join")] }), tFoot(tr), {
      home: () => [
        heroSoft(TT, {
          eyebrow: tr("Les privat SD–SMA", "Private tutoring K–12"),
          title: tr("Belajar di teras rumah sendiri", "Learning on your own front porch"),
          titleNode: typerD(TT, tr("Les privat ", "Private lessons "), [tr("matematika", "maths"), tr("bahasa Inggris", "English"), tr("fisika", "physics"), tr("mengaji", "Quran reading")], { size: 56 }),
          text: tr("Tutor datang ke rumah atau belajar via video. Laporan perkembangan dikirim ke orang tua setiap minggu.", "Tutors come to your home or teach by video. Parents get a progress report every week."),
          image: asset("v4e-study"),
          alt: tr("Pelajar belajar dengan laptop", "Student studying with a laptop"),
          chips: [tr("Tutor terverifikasi", "Verified tutors"), tr("Ganti tutor gratis", "Free tutor swap"), tr("Laporan mingguan", "Weekly reports")],
          actions: [[tr("Coba 1 sesi", "Try 1 session"), href("join")]],
        }),
        notes(TT, { title: tr("Kenapa orang tua memilih kami", "Why parents choose us"), colors: ["#fef9c3", "#dbeafe", "#dcfce7", "#fce7f3"], items: [[tr("Cocok dulu", "Match first"), tr("Tes gaya belajar 10 menit.", "A 10-minute learning-style quiz.")], [tr("Jadwal fleksibel", "Flexible times"), tr("Atur ulang via WhatsApp.", "Reschedule on WhatsApp.")], [tr("Laporan jujur", "Honest reports"), tr("Nilai latihan, bukan pujian kosong.", "Practice scores, not empty praise.")], [tr("Tutor aman", "Safe tutors"), tr("Cek identitas & wawancara.", "ID check & interview.")]] }),
        rail(TT, { title: tr("Mulai dalam 3 langkah", "Start in 3 steps"), steps: [[tr("Ceritakan", "Tell us"), tr("Kelas, pelajaran, dan target.", "Grade, subject and goal.")], [tr("Kenalan", "Meet"), tr("Sesi percobaan 60 menit.", "A 60-minute trial session.")], [tr("Rutin", "Routine"), tr("Jadwal tetap tiap minggu.", "A fixed weekly slot.")]] }),
      ],
      subjects: () => [
        pageHead(TT, { eyebrow: tr("Mata pelajaran", "Subjects"), title: tr("Dari calistung sampai UTBK", "From early reading to university entrance") }),
        cardsD(TT, { title: tr("Pelajaran populer", "Popular subjects"), cols: 3, items: [{ icon: "∑", title: tr("Matematika", "Maths"), text: tr("SD–SMA, olimpiade dasar.", "Primary to high school, basic olympiad.") }, { icon: "Aa", title: tr("Bahasa Inggris", "English"), text: tr("Percakapan & tata bahasa.", "Conversation & grammar.") }, { icon: "⚛", title: tr("Fisika & Kimia", "Physics & Chemistry"), text: tr("Konsep dengan eksperimen rumah.", "Concepts with home experiments.") }, { icon: "✎", title: tr("Calistung", "Early literacy"), text: tr("Membaca, menulis, berhitung.", "Reading, writing, counting.") }, { icon: "☾", title: tr("Mengaji", "Quran reading"), text: tr("Iqro & tajwid.", "Iqro & tajwid.") }, { icon: "◎", title: "UTBK", text: tr("Strategi & simulasi.", "Strategy & mock tests.") }] }),
        splitPanel(TT, { eyebrow: tr("Bahasa asing", "Foreign languages"), title: tr("Les bahasa untuk anak", "Language lessons for kids"), text: tr("Inggris, Jepang, dan Jerman dengan permainan, lagu, dan percakapan sederhana.", "English, Japanese and German through games, songs and simple conversation."), bullets: [tr("Mulai usia 6 tahun", "From age 6"), tr("Tutor bersertifikat", "Certified tutors")], image: asset("v4e-speech-jp"), alt: tr("Gelembung percakapan", "Speech bubbles"), reverse: true }),
      ],
      pricing: () => [
        pageHead(TT, { eyebrow: tr("Paket", "Packages"), title: tr("Bayar per bulan, berhenti kapan saja", "Pay monthly, stop any time") }),
        withFx(TT, pricingCards(pro(TT), tr, { title: tr("Paket les", "Tutoring packages"), text: tr("Harga per anak, sudah termasuk transport tutor dalam kota.", "Per child, including tutor travel within the city."), plans: [{ name: tr("Ringan", "Light"), price: "Rp480rb", period: tr("4 sesi/bulan", "4 sessions/month"), text: tr("Satu pelajaran", "One subject"), features: [tr("60 menit/sesi", "60 min/session"), tr("Laporan bulanan", "Monthly report")], cta: { label: tr("Pilih", "Choose"), href: href("join") } }, { name: tr("Rutin", "Regular"), price: "Rp880rb", period: tr("8 sesi/bulan", "8 sessions/month"), text: tr("Paling banyak dipilih", "Most chosen"), features: [tr("90 menit/sesi", "90 min/session"), tr("Laporan mingguan", "Weekly report"), tr("Bank soal", "Question bank")], cta: { label: tr("Pilih", "Choose"), href: href("join") }, featured: true }, { name: tr("Ujian", "Exam"), price: "Rp1,4jt", period: tr("12 sesi/bulan", "12 sessions/month"), text: tr("Menjelang ujian", "Before exams"), features: [tr("Simulasi mingguan", "Weekly mocks"), tr("Konsultasi orang tua", "Parent consults")], cta: { label: tr("Pilih", "Choose"), href: href("join") } }] })),
        faqD(TT, { title: tr("Soal pembayaran", "About payment"), items: [[tr("Sesi bisa dipindah?", "Can sessions move?"), tr("Bisa, beri tahu 12 jam sebelumnya.", "Yes, with 12 hours' notice.")], [tr("Ada kakak-adik?", "Siblings?"), tr("Diskon 15% untuk anak kedua.", "15% off for the second child.")]] }),
      ],
      join: () => [
        pageHead(TT, { eyebrow: tr("Mulai les", "Get started"), title: tr("Sesi percobaan hanya Rp50.000", "Trial session only Rp50,000") }),
        formD(TT, { title: tr("Isi data anak", "Tell us about your child"), info: [["WhatsApp", "0812 0000 4455"], [tr("Area", "Area"), "Jakarta, Depok, Tangerang"]], fields: [{ kind: "input", label: tr("Nama orang tua", "Parent's name"), ph: tr("Nama Anda", "Your name") }, { kind: "select", label: tr("Kelas", "Grade"), ph: tr("Pilih", "Choose"), options: ["SD 1–3", "SD 4–6", "SMP", "SMA"] }, { kind: "select", label: tr("Format", "Format"), ph: tr("Pilih", "Choose"), options: [tr("Datang ke rumah", "Home visit"), tr("Daring", "Online")] }], message: tr("Target belajar", "Learning goal"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ------- 9. Gelembung Biru Trip — open trip diving (6 hlm) ---------- */
// Premium: gallery-lightbox, countdown, testimonial. Library: AOS + Tilt.

const DP: Palette = { ink: "#062a3f", muted: "#3f6278", primary: "#0369a1", primaryDark: "#075985", soft: "#e0f2fe", line: "#bae6fd" };
const D = lookD(DP, { head: "Bebas Neue", body: "Outfit", shape: "glass", radius: 22, bg: "#f4fbff", alt: "#e2f3fc", inv: "#062a3f", fx: { aos: "fade-up", tilt: true }, upper: true });

const dFoot = (tr: Tr) =>
  footerD("Gelembung Biru", D, {
    variant: "columns",
    about: tr("Open trip menyelam dan snorkeling kecil-kecilan ke perairan timur Indonesia.", "Small-group diving and snorkelling trips to the waters of eastern Indonesia."),
    cols: [{ title: tr("Basis", "Base"), items: ["Labuan Bajo", "Wakatobi"] }, { title: tr("Kontak", "Contact"), items: ["trip@gelembungbiru.id", "0813 8800 2211"] }],
    social: ["Instagram | https://instagram.com/gelembungbiru", "YouTube | https://youtube.com/@gelembungbiru"],
    copy: tr("© 2026 Gelembung Biru Trip. Konten contoh.", "© 2026 Gelembung Biru Trip. Sample content."),
  });

export const maritimeDivingTrip: TemplateContent = {
  brand: "Gelembung Biru Trip",
  pages: [home(), pg("trips", ["open-trip", "Open Trip"], ["trips", "Trips"]), pg("courses", ["kursus-selam", "Kursus Selam"], ["dive-courses", "Dive Courses"]), pg("spots", ["titik-selam", "Titik Selam"], ["dive-sites", "Dive Sites"]), pg("faq", ["tanya-jawab", "Tanya Jawab"], ["faq", "FAQ"]), pg("book", ["pesan", "Pesan"], ["book", "Book"])],
  build: (key, tr, href) =>
    render(D, key, headerD("Gelembung Biru", D, { variant: "pill", cta: [tr("Pesan trip", "Book a trip"), href("book")] }), dFoot(tr), {
      home: () => [
        heroGlass(D, {
          eyebrow: tr("Open trip menyelam", "Open dive trips"),
          title: tr("Turun 18 meter, lupa semua notifikasi", "Drop 18 metres, forget every notification"),
          text: tr("Grup maksimal 8 penyelam per pemandu. Kapal kayu, makan tiga kali, dan dokumentasi bawah air.", "Max 8 divers per guide. Wooden boat, three meals and underwater photos."),
          gradient: ["#0369a1", "#082f49"],
          chips: [tr("Pemula boleh", "Beginners welcome"), tr("Alat lengkap", "Full gear"), tr("Asuransi selam", "Dive insurance")],
          image: asset("v4e-reef"),
          alt: tr("Penyelam di atas terumbu", "Diver above a reef"),
          actions: [[tr("Lihat jadwal", "See dates"), href("trips"), "light"]],
        }),
        countdownD(D, { eyebrow: tr("Trip berikutnya", "Next trip"), title: tr("Komodo 3H2M — sisa 3 kursi", "Komodo 3D2N — 3 seats left"), text: tr("Manta Point, Batu Bolong, dan Pink Beach.", "Manta Point, Batu Bolong and Pink Beach."), target: "2026-11-14T06:00", finished: tr("Kapal sudah berlayar", "The boat has sailed"), actions: [[tr("Amankan kursi", "Grab a seat"), href("book"), "light"]] }),
        quotesD(D, { title: tr("Dari peserta", "From our divers"), items: [{ quote: tr("Pertama kali lihat manta, pemandunya sabar sekali.", "First time seeing mantas — the guide was so patient."), author: "Tasya Rahmani", role: "Jakarta", avatar: asset("v4e-face-2") }, { quote: tr("Kapal bersih, makanan enak, rombongan kecil.", "Clean boat, good food, small group."), author: "Bagas Pradipta", role: "Bandung", avatar: asset("v4e-face-3") }, { quote: tr("Foto bawah airnya dikirim hari itu juga.", "Underwater photos were sent the same day."), author: "Meilani", role: "Surabaya", avatar: asset("v4e-face-4") }] }),
      ],
      trips: () => [
        pageHead(D, { eyebrow: tr("Open trip", "Trips"), title: tr("Jadwal keberangkatan", "Departure schedule") }),
        board(D, { title: tr("Papan keberangkatan", "Departure board"), head: [tr("Tanggal", "Date"), tr("Trip", "Trip"), tr("Harga", "Price"), tr("Status", "Status")], rows: [["14 NOV", tr("Komodo 3H2M", "Komodo 3D2N"), "Rp5,9jt", tr("3 kursi", "3 seats")], ["28 NOV", tr("Wakatobi 5H4M", "Wakatobi 5D4N"), "Rp11,5jt", tr("Tersedia", "Open")], ["12 DES", tr("Komodo 4H3M", "Komodo 4D3N"), "Rp7,8jt", tr("Tersedia", "Open")], ["26 DES", tr("Alor 4H3M", "Alor 4D3N"), "Rp9,2jt", tr("Penuh", "Full")]] }),
        cardsD(D, { title: tr("Sudah termasuk", "What's included"), cols: 4, items: [{ icon: "⛴", title: tr("Kapal", "Boat"), text: tr("Kabin ber-AC.", "Air-con cabins.") }, { icon: "◎", title: tr("3–4 selaman/hari", "3–4 dives/day"), text: tr("Dengan pemandu.", "Guided.") }, { icon: "🍲", title: tr("Makan", "Meals"), text: tr("3× sehari + camilan.", "3 a day + snacks.") }, { icon: "◐", title: tr("Foto", "Photos"), text: tr("Dokumentasi bawah air.", "Underwater photos.") }] }),
      ],
      courses: () => [
        pageHead(D, { eyebrow: tr("Kursus selam", "Dive courses"), title: tr("Dari kolam sampai laut lepas", "From pool to open water") }),
        timelineD(D, { title: tr("Kursus Open Water (4 hari)", "Open Water course (4 days)"), items: [[tr("Hari 1", "Day 1"), tr("Teori & kolam", "Theory & pool"), tr("Peralatan dan keterampilan dasar.", "Gear and basic skills.")], [tr("Hari 2", "Day 2"), tr("Kolam lanjutan", "Advanced pool"), tr("Bernapas tanpa masker, berbagi udara.", "Mask-off breathing, air sharing.")], [tr("Hari 3–4", "Days 3–4"), tr("4 selaman laut", "4 sea dives"), tr("Maksimal 18 meter.", "Max 18 metres.")]], side: { image: asset("v4e-reef-deep"), alt: tr("Penyelam", "Diver") } }),
        tableD(D, { title: tr("Biaya kursus", "Course fees"), columns: [tr("Kursus", "Course"), tr("Durasi", "Length"), tr("Harga", "Price")], rows: [["Discover Scuba", tr("1 hari", "1 day"), "Rp1,5jt"], ["Open Water", tr("4 hari", "4 days"), "Rp6,8jt"], ["Advanced", tr("3 hari", "3 days"), "Rp5,9jt"]] }),
      ],
      spots: () => [
        pageHead(D, { eyebrow: tr("Titik selam", "Dive sites"), title: tr("Titik favorit pemandu kami", "Our guides' favourite sites") }),
        galleryLb(D, { title: tr("Galeri bawah air", "Underwater gallery"), images: [[asset("v4e-reef"), "Manta Point"], [asset("v4e-reef-deep"), "Batu Bolong"], [asset("v4e-reef"), tr("Taman Karang Hoga", "Hoga Coral Garden")], [asset("v4e-reef-deep"), tr("Dinding Alor", "Alor Wall")]], cols: 2, ratio: "16 / 9" }),
        polaroids(D, { title: tr("Kenangan peserta", "Diver memories"), items: [[asset("v4e-reef"), tr("Manta pertama!", "First manta!")], [asset("v4e-reef-deep"), tr("Safety stop", "Safety stop")], [asset("v4e-ship-dusk"), tr("Senja di kapal", "Sunset on deck")]] }),
      ],
      faq: () => [
        pageHead(D, { eyebrow: tr("Tanya jawab", "FAQ"), title: tr("Sebelum berangkat", "Before you go") }),
        faqD(D, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Belum punya lisensi?", "No licence yet?"), tr("Ikut Discover Scuba atau snorkeling.", "Join Discover Scuba or snorkel.")], [tr("Bagaimana jika cuaca buruk?", "What if the weather turns?"), tr("Trip dijadwalkan ulang atau uang kembali penuh.", "We reschedule or refund in full.")], [tr("Perlu bawa alat?", "Do I need gear?"), tr("Tidak, semua alat disediakan.", "No, all gear is provided.")]] }),
      ],
      book: () => [
        pageHead(D, { eyebrow: tr("Pesan", "Book"), title: tr("Pesan kursi Anda", "Book your seat") }),
        formD(D, { title: tr("Formulir pemesanan", "Booking form"), info: [["WhatsApp", "0813 8800 2211"], [tr("Uang muka", "Deposit"), "30%"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { kind: "select", label: "Trip", ph: tr("Pilih", "Choose"), options: [tr("Komodo 14 Nov", "Komodo 14 Nov"), tr("Wakatobi 28 Nov", "Wakatobi 28 Nov"), tr("Komodo 12 Des", "Komodo 12 Dec")] }, { kind: "select", label: tr("Lisensi", "Licence"), ph: tr("Pilih", "Choose"), options: [tr("Belum ada", "None"), "Open Water", "Advanced"] }], submit: tr("Pesan", "Book") }),
      ],
    }),
};

/* ---- 10. Pelayaran Samudra Jingga — kapal penumpang (8 hlm) -------- */
// Premium: mega-menu, comparison-table, back-to-top, logo-marquee, pro-team-cards, progress. Library: AOS.

const SP: Palette = { ink: "#0b1a3a", muted: "#47577a", primary: "#1e3a8a", primaryDark: "#172554", soft: "#e0e7ff", line: "#c7d2fe" };
const S = lookD(SP, { head: "Oswald", body: "Lora", shape: "sharp", radius: 4, bg: "#ffffff", alt: "#f1f4fb", inv: "#0b1a3a", fx: { aos: "fade-right" }, upper: true });

const sHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Samudra Jingga", S, {
    variant: "ink",
    info: [tr("Pusat layanan 24 jam: 1500-747", "24-hour service line: 1500-747"), tr("Cek status kapal secara langsung", "Live vessel status")],
    nav: megaD(S, [tr("Jadwal", "Schedule"), tr("Rute", "Routes"), tr("Armada", "Fleet"), tr("Tarif", "Fares"), tr("Kargo", "Cargo")], tr("Pesan tiket", "Book tickets"), href("contact")),
  });
const sFoot = (tr: Tr) =>
  footerD("Samudra Jingga", S, {
    variant: "columns",
    about: tr("Operator kapal penumpang & roro antarpulau di Nusa Tenggara dan Sulawesi.", "Inter-island passenger & ro-ro ferry operator in Nusa Tenggara and Sulawesi."),
    cols: [{ title: tr("Layanan", "Services"), items: [tr("Penumpang", "Passengers"), tr("Kendaraan", "Vehicles"), tr("Kargo", "Cargo")] }, { title: tr("Kantor pusat", "Head office"), items: ["Jl. Pelabuhan 3, Kupang", "1500-747"] }],
    social: ["Instagram | https://instagram.com/samudrajingga", "Facebook | https://facebook.com/samudrajingga", "X | https://x.com/samudrajingga"],
    copy: tr("© 2026 PT Pelayaran Samudra Jingga (fiktif). Konten contoh.", "© 2026 PT Pelayaran Samudra Jingga (fictional). Sample content."),
    extra: [backTop(S, tr("Ke atas", "Top"))],
  });

export const maritimePelayaran: TemplateContent = {
  brand: "Pelayaran Samudra Jingga",
  pages: [
    home(),
    pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]),
    pg("routes", ["rute", "Rute"], ["routes", "Routes"]),
    pg("fleet", ["armada", "Armada"], ["fleet", "Fleet"]),
    pg("fares", ["tarif", "Tarif"], ["fares", "Fares"]),
    pg("cargo", ["kargo", "Kargo"], ["cargo", "Cargo"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("contact", ["pesan-tiket", "Pesan Tiket"], ["book-tickets", "Book Tickets"]),
  ],
  build: (key, tr, href) =>
    render(S, key, sHead(tr, href), sFoot(tr), {
      home: () => [
        heroTicket(S, {
          eyebrow: tr("Kapal penumpang antarpulau", "Inter-island passenger ferries"),
          title: tr("Menyeberang dengan jadwal yang bisa dipegang", "Cross the sea on a schedule you can count on"),
          text: tr("12 kapal, 18 rute, dan 96% keberangkatan tepat waktu sepanjang 2025.", "12 vessels, 18 routes and 96% on-time departures throughout 2025."),
          image: asset("v4e-ship"),
          alt: tr("Kapal penumpang di laut", "Passenger ship at sea"),
          stubs: [[tr("Rute", "Routes"), "18"], [tr("Tepat waktu", "On time"), "96%"], [tr("Penumpang 2025", "Passengers 2025"), "1,2 jt"]],
          actions: [[tr("Lihat jadwal", "See schedule"), href("schedule")], [tr("Pesan tiket", "Book tickets"), href("contact"), "outline"]],
        }),
        board(S, { eyebrow: tr("Hari ini", "Today"), title: tr("Keberangkatan dari Kupang", "Departures from Kupang"), head: [tr("Jam", "Time"), tr("Tujuan", "Destination"), tr("Kapal", "Vessel"), tr("Status", "Status")], rows: [["07:30", "Larantuka", "KM Jingga Fajar", tr("Naik kapal", "Boarding")], ["10:00", "Kalabahi", "KM Jingga Bahari", tr("Tepat waktu", "On time")], ["14:00", "Rote", "KMP Jingga Tiga", tr("Tepat waktu", "On time")], ["19:00", "Labuan Bajo", "KM Jingga Senja", tr("Tunda 30 mnt", "Delayed 30 min")]] }),
        marqueeD(S, { title: tr("Mitra pelabuhan & agen", "Port & agent partners"), items: ["Pelabuhan Tenau", "Agen Laut Timur", "Dermaga Rote", "Bahari Tiket", "Nusa Logistik", "Agen Seroja"] }),
      ],
      schedule: () => [
        pageHead(S, { eyebrow: tr("Jadwal", "Schedule"), title: tr("Jadwal mingguan", "Weekly timetable"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Jadwal", "Schedule"), ""]] }),
        tableD(S, { title: tr("Kupang → tujuan", "Kupang → destinations"), columns: [tr("Rute", "Route"), tr("Hari", "Days"), tr("Berangkat", "Departs"), tr("Lama", "Duration")], rows: [["Kupang – Larantuka", tr("Sen, Rab, Jum", "Mon, Wed, Fri"), "07:30", tr("12 jam", "12 hrs")], ["Kupang – Kalabahi", tr("Setiap hari", "Daily"), "10:00", tr("16 jam", "16 hrs")], ["Kupang – Rote", tr("Setiap hari", "Daily"), "14:00", tr("4 jam", "4 hrs")], ["Kupang – Labuan Bajo", tr("Sel, Sab", "Tue, Sat"), "19:00", tr("30 jam", "30 hrs")]], note: tr("Jadwal dapat berubah karena cuaca.", "Schedules may change with the weather.") }),
        noticeSection(tr, href),
      ],
      routes: () => [
        pageHead(S, { eyebrow: tr("Rute", "Routes"), title: tr("18 rute di tiga provinsi", "18 routes across three provinces") }),
        splitPanel(S, { title: tr("Peta jaringan", "Network map"), text: tr("Dari Kupang dan Makassar ke pulau-pulau kecil yang belum terhubung jembatan.", "From Kupang and Makassar to small islands no bridge will ever reach."), bullets: [tr("6 rute perintis bersubsidi", "6 subsidised pioneer routes"), tr("Transit terjadwal di Larantuka", "Scheduled transfers at Larantuka")], image: asset("v4e-route"), alt: tr("Peta rute", "Route map") }),
        progressD(S, { title: tr("Keterisian kapal bulan ini", "Load factor this month"), bars: [["Kupang – Rote", 92], ["Kupang – Kalabahi", 78], ["Kupang – Larantuka", 64], ["Kupang – Labuan Bajo", 81]] }),
      ],
      fleet: () => [
        pageHead(S, { eyebrow: tr("Armada", "Fleet"), title: tr("Dua belas kapal, dirawat setiap tahun", "Twelve vessels, serviced every year") }),
        compareD(S, { title: tr("Kelas kapal", "Vessel classes"), columns: [tr("Cepat", "Fast"), tr("Penumpang", "Passenger"), "Roro"], rows: [tr("Kapasitas | 300 | 1.000 | 600 + 40 kendaraan", "Capacity | 300 | 1,000 | 600 + 40 vehicles"), tr("Kecepatan | 28 knot | 15 knot | 12 knot", "Speed | 28 kn | 15 kn | 12 kn"), tr("Kabin tidur | tidak | ya | ya", "Sleeper cabins | no | yes | yes"), tr("Kendaraan | tidak | tidak | ya", "Vehicles | no | no | yes")], highlight: 2, caption: tr("Spesifikasi contoh.", "Sample specifications.") }),
        specs(S, { title: "KM Jingga Bahari", rows: [[tr("Panjang", "Length"), "98 m"], [tr("Dibangun", "Built"), "2018"], [tr("Penumpang", "Passengers"), "1.000"], [tr("Sekoci", "Lifeboats"), "12"]], image: asset("v4e-ship-dusk"), alt: "KM Jingga Bahari" }),
      ],
      fares: () => [
        pageHead(S, { eyebrow: tr("Tarif", "Fares"), title: tr("Tarif resmi per orang", "Official fares per person") }),
        tableD(S, { title: tr("Tarif ekonomi & kabin", "Economy & cabin fares"), columns: [tr("Rute", "Route"), tr("Ekonomi", "Economy"), tr("Kabin", "Cabin"), tr("Motor", "Motorbike")], rows: [["Kupang – Rote", "Rp95.000", "–", "Rp120.000"], ["Kupang – Larantuka", "Rp215.000", "Rp480.000", "Rp260.000"], ["Kupang – Kalabahi", "Rp240.000", "Rp540.000", "Rp290.000"], ["Kupang – Labuan Bajo", "Rp410.000", "Rp920.000", "–"]] }),
        faqD(S, { title: tr("Ketentuan tiket", "Ticket rules"), items: [[tr("Anak-anak?", "Children?"), tr("Usia 2–11 tahun bayar 75%.", "Ages 2–11 pay 75%.")], [tr("Batal?", "Cancel?"), tr("Refund 75% hingga 24 jam sebelum berangkat.", "75% refund up to 24 hours before departure.")]] }),
      ],
      cargo: () => [
        pageHead(S, { eyebrow: tr("Kargo", "Cargo"), title: tr("Kirim barang antarpulau", "Ship goods between islands") }),
        cardsD(S, { title: tr("Layanan kargo", "Cargo services"), cols: 3, items: [{ icon: "▣", title: tr("Paket", "Parcels"), text: tr("Hingga 50 kg, diambil di dermaga.", "Up to 50 kg, collect at the pier.") }, { icon: "▤", title: tr("Kendaraan", "Vehicles"), text: tr("Motor, mobil, dan truk kecil.", "Bikes, cars and small trucks.") }, { icon: "❄", title: tr("Berpendingin", "Refrigerated"), text: tr("Ikan & hasil bumi segar.", "Fish & fresh produce.") }] }),
        formD(S, { title: tr("Minta tarif kargo", "Request a cargo quote"), info: [[tr("Kargo", "Cargo desk"), "0380 820 747"]], fields: [{ kind: "input", label: tr("Asal – tujuan", "From – to"), ph: "Kupang – Rote" }, { kind: "input", label: tr("Berat (kg)", "Weight (kg)"), ph: "120" }], submit: tr("Kirim", "Send") }),
      ],
      about: () => [
        pageHead(S, { eyebrow: tr("Tentang", "About"), title: tr("Melayani pulau-pulau sejak 1994", "Serving the islands since 1994") }),
        withFx(S, teamCards(pro(S), tr, { title: tr("Manajemen", "Management"), members: [{ name: "Kapten Yohanes Lado", role: tr("Direktur Operasi", "Operations Director"), photo: asset("v4e-face-1") }, { name: "Maria Seran", role: tr("Direktur Utama", "Managing Director"), photo: asset("v4e-face-2") }, { name: "Albertus Manek", role: tr("Kepala Keselamatan", "Head of Safety"), photo: asset("v4e-face-3") }] })),
        numbers(S, { items: [["1994", tr("Berdiri", "Founded")], ["12", tr("Kapal", "Vessels")], ["640", tr("Awak", "Crew")], ["0", tr("Kecelakaan fatal 10 tahun", "Fatal accidents in 10 years")]] }),
      ],
      contact: () => [
        pageHead(S, { eyebrow: tr("Pesan tiket", "Book tickets"), title: tr("Pesan lewat agen atau formulir", "Book via an agent or the form") }),
        formD(S, { title: tr("Pemesanan tiket", "Ticket booking"), info: [[tr("Layanan 24 jam", "24-hour line"), "1500-747"], ["Email", "tiket@samudrajingga.id"]], fields: [{ kind: "select", label: tr("Rute", "Route"), ph: tr("Pilih", "Choose"), options: ["Kupang – Rote", "Kupang – Larantuka", "Kupang – Kalabahi", "Kupang – Labuan Bajo"] }, { kind: "date", label: tr("Tanggal", "Date") }, { kind: "input", label: tr("Jumlah penumpang", "Passengers"), ph: "2" }], submit: tr("Cek ketersediaan", "Check availability") }),
      ],
    }),
};

/** Pengumuman cuaca (halaman jadwal pelayaran). */
function noticeSection(tr: Tr, href: (k: string) => string) {
  return ctaD(S, { title: tr("Info cuaca & penundaan", "Weather & delay info"), text: tr("Status terbaru diumumkan 2 jam sebelum keberangkatan lewat SMS dan media sosial.", "Latest status is announced 2 hours before departure by SMS and social media."), actions: [[tr("Hubungi layanan", "Contact service"), href("contact"), "light"]], tone: "inv" });
}

