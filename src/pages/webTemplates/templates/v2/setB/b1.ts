import { ctaBand, faqAccordion, featuresIcons, pricingCards, servicesSplit, statsBand, teamCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { Palette } from "../../../build";
import type { TemplateContent } from "../../../types";
import { FONTS, centeredHeader, footer, header, cta } from "../../pro/kit";
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
  heroCenter,
  heroImage,
  heroSplit,
  imgCards,
  infoBar,
  logos,
  look,
  newsletter,
  pageHead,
  priceList,
  priceSwitch,
  productDetail,
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
/* Set B · bagian 1: Resume (Free), Yoga, Barbershop, Dealer, Akuntan.   */
/* ================================================================== */

/* ------------------- 1. personal-resume (FREE, 5) ------------------ */

const KW: Palette = { ink: "#292524", muted: "#57534e", primary: "#c2410c", primaryDark: "#9a3412", soft: "#fff7ed", line: "#fed7aa" };
const kwL = look(KW, { font: FONTS.sans, hf: FONTS.serif, r: 10, dark: "#1c1917", alt: "#fafaf9", onDark: "#d6d3d1" });

export const personalResume: TemplateContent = {
  brand: "Kirana Wulandari",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("experience", "Pengalaman", "Experience", "pengalaman", "experience"),
    P("projects", "Proyek", "Projects", "proyek", "projects"),
    P("writing", "Tulisan", "Writing", "tulisan", "writing"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = kwL;
    const head = header("Kirana W.", KW, { font: FONTS.serif, cta: cta(tr("Unduh CV", "Download CV"), "#cv", KW, "outline") });
    const foot = footerSlim(L, "Kirana Wulandari", [[tr("Pengalaman", "Experience"), href("experience")], [tr("Proyek", "Projects"), href("projects")], [tr("Kontak", "Contact"), href("contact")]], tr("© 2026 Kirana Wulandari · Bandung. Contoh konten.", "© 2026 Kirana Wulandari · Bandung. Sample content."));
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, {
          badge: tr("Terbuka untuk proyek Q1 2027", "Open for Q1 2027 projects"),
          title: tr("UX researcher & product designer yang mendengarkan dulu", "A UX researcher & product designer who listens first"),
          text: tr("8 tahun membantu produk fintech dan kesehatan memahami penggunanya: dari wawancara lapangan sampai prototipe yang siap diuji.", "8 years helping fintech and health products understand their users: from field interviews to test-ready prototypes."),
          btns: [[tr("Lihat proyek", "See projects"), href("projects")], [tr("Hubungi saya", "Get in touch"), href("contact")]],
          image: "v2b-face-2",
          alt: tr("Foto Kirana", "Portrait of Kirana"),
          ratio: "1 / 1",
          gradient: [KW.soft, "#ffffff", 160],
        }),
        featuresIcons(L.t, tr, {
          eyebrow: tr("Keahlian", "Expertise"),
          title: tr("Yang biasa saya kerjakan", "What I usually do"),
          items: [
            { icon: "🔎", title: tr("Riset pengguna", "User research"), text: tr("Wawancara, diary study, dan uji kegunaan dengan 5–40 partisipan.", "Interviews, diary studies, and usability tests with 5–40 participants.") },
            { icon: "🧩", title: tr("Desain produk", "Product design"), text: tr("Alur, wireframe, dan prototipe Figma yang siap diserahkan ke engineer.", "Flows, wireframes, and Figma prototypes ready for engineers.") },
            { icon: "📊", title: tr("Workshop tim", "Team workshops"), text: tr("Memfasilitasi design sprint 3–5 hari untuk tim produk.", "Facilitating 3–5 day design sprints for product teams.") },
          ],
        }),
        imgCards(L, {
          ey: tr("Proyek pilihan", "Selected projects"),
          title: tr("Hasil kerja terbaru", "Recent work"),
          items: [
            { image: "pro-work-1", meta: "Fintech · 2025", title: tr("Onboarding dompet digital", "Digital wallet onboarding"), text: tr("Waktu verifikasi turun dari 9 ke 4 menit.", "Verification time cut from 9 to 4 minutes."), link: [tr("Baca studi kasus", "Read case study"), href("projects")] },
            { image: "pro-work-3", meta: tr("Kesehatan · 2024", "Health · 2024"), title: tr("Aplikasi janji temu klinik", "Clinic booking app"), text: tr("Tingkat pembatalan turun 31%.", "Cancellation rate down 31%."), link: [tr("Baca studi kasus", "Read case study"), href("projects")] },
            { image: "pro-work-4", meta: "Edtech · 2023", title: tr("Dasbor guru", "Teacher dashboard"), text: tr("Dipakai 2.300 guru di Jawa Barat.", "Used by 2,300 teachers in West Java."), link: [tr("Baca studi kasus", "Read case study"), href("projects")] },
          ],
          bg: L.alt,
        }),
        quote(L, { text: tr("Kirana membuat tim kami berhenti menebak. Setiap keputusan desain punya alasan dari data pengguna.", "Kirana made our team stop guessing. Every design decision had a reason rooted in user data."), name: "Reza Hadinata", role: tr("VP Produk, Dompet Kita", "VP Product, Dompet Kita") }),
        ctaBand(L.t, tr, { title: tr("Punya produk yang perlu dipahami lebih dalam?", "Have a product that needs deeper understanding?"), text: tr("Ceritakan tantangannya, saya balas dalam 2 hari kerja.", "Tell me the challenge, I reply within 2 business days."), primary: { label: tr("Kirim pesan", "Send a message"), href: href("contact") }, secondary: null }),
      ],
      experience: () => [
        pageHead(L, { ey: tr("Pengalaman", "Experience"), title: tr("Perjalanan karier", "Career path"), text: tr("Dari desainer grafis di agensi kecil hingga memimpin riset di startup fintech.", "From graphic designer at a small agency to leading research at a fintech startup."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Pengalaman", "Experience"), ""]] }),
        timeline(L, {
          title: tr("Riwayat kerja", "Work history"),
          items: [
            ["2023 – " + tr("kini", "now"), tr("Lead UX Researcher · Dompet Kita", "Lead UX Researcher · Dompet Kita"), tr("Membangun tim riset 4 orang dan repositori insight untuk 6 squad.", "Built a 4-person research team and an insight repository for 6 squads.")],
            ["2020 – 2023", tr("Product Designer · Sehatin", "Product Designer · Sehatin"), tr("Mendesain ulang alur janji temu untuk 120 klinik mitra.", "Redesigned the booking flow for 120 partner clinics.")],
            ["2018 – 2020", tr("UI Designer · Ruang Kelas", "UI Designer · Ruang Kelas"), tr("Merancang sistem desain pertama perusahaan.", "Created the company's first design system.")],
            ["2016 – 2018", tr("Desainer grafis · Studio Garis", "Graphic designer · Studio Garis"), tr("Identitas visual untuk 30+ UMKM di Bandung.", "Visual identities for 30+ small businesses in Bandung.")],
          ],
        }),
        tableSec(L, {
          ey: tr("Alat & metode", "Tools & methods"),
          title: tr("Keterampilan", "Skills"),
          columns: [tr("Bidang", "Area"), tr("Alat", "Tools"), tr("Pengalaman", "Experience")],
          rows: [
            [tr("Riset", "Research"), "Dovetail, Maze, Lookback", tr("8 tahun", "8 years")],
            [tr("Desain", "Design"), "Figma, FigJam, Principle", tr("8 tahun", "8 years")],
            [tr("Data", "Data"), "Metabase, Google Sheets, SQL dasar", tr("4 tahun", "4 years")],
            [tr("Fasilitasi", "Facilitation"), "Design sprint, Jobs-to-be-done", tr("5 tahun", "5 years")],
          ],
          bg: L.alt,
        }),
        cards(L, {
          title: tr("Pendidikan & sertifikasi", "Education & certifications"),
          style: "line",
          items: [
            { meta: "2016", title: tr("S1 Desain Komunikasi Visual", "BA Visual Communication Design"), text: tr("Institut Teknologi Bandung", "Bandung Institute of Technology") },
            { meta: "2021", title: "Google UX Design Certificate", text: "Coursera" },
            { meta: "2024", title: "NN/g UX Certification", text: "Nielsen Norman Group" },
          ],
        }),
      ],
      projects: () => [
        pageHead(L, { ey: tr("Portofolio", "Portfolio"), title: tr("Studi kasus", "Case studies"), text: tr("Ringkasan masalah, proses, dan dampak setiap proyek.", "A summary of the problem, process, and impact of each project."), dark: true }),
        imgCards(L, {
          cols: 2,
          boxed: true,
          items: [
            { image: "pro-work-1", tag: "Fintech", title: tr("Onboarding dompet digital", "Digital wallet onboarding"), text: tr("Riset 24 pengguna baru di 3 kota, lalu menyederhanakan eKYC menjadi 4 langkah.", "Researched 24 new users in 3 cities, then simplified eKYC into 4 steps.") },
            { image: "pro-work-3", tag: tr("Kesehatan", "Health"), title: tr("Janji temu klinik", "Clinic booking"), text: tr("Pengingat WhatsApp & jadwal ulang satu ketuk menurunkan pembatalan 31%.", "WhatsApp reminders and one-tap rescheduling cut cancellations by 31%.") },
            { image: "pro-work-4", tag: "Edtech", title: tr("Dasbor guru", "Teacher dashboard"), text: tr("Menyatukan nilai, absensi, dan tugas dalam satu layar.", "Grades, attendance, and assignments in a single screen.") },
            { image: "pro-work-2", tag: "Branding", title: tr("Identitas kedai kopi", "Coffee shop identity"), text: tr("Proyek sampingan: logo, menu, dan kemasan untuk 3 gerai.", "Side project: logo, menu, and packaging for 3 outlets.") },
          ],
        }),
        steps(L, {
          ey: tr("Cara kerja", "How I work"),
          title: tr("Proses dalam empat tahap", "A four-stage process"),
          items: [
            [tr("Pahami", "Understand"), tr("Wawancara pemangku kepentingan dan audit data.", "Stakeholder interviews and data audit.")],
            [tr("Temukan", "Discover"), tr("Riset lapangan dan sintesis insight.", "Field research and insight synthesis.")],
            [tr("Rancang", "Design"), tr("Prototipe dan uji dengan pengguna nyata.", "Prototype and test with real users.")],
            [tr("Ukur", "Measure"), tr("Pantau metrik setelah rilis.", "Track metrics after launch.")],
          ],
          bg: L.alt,
        }),
      ],
      writing: () => [
        pageHead(L, { ey: tr("Tulisan", "Writing"), title: tr("Catatan tentang riset & desain", "Notes on research & design"), center: true }),
        rowsList(L, {
          title: tr("Artikel terbaru", "Latest articles"),
          items: [
            { meta: tr("Okt 2026 · 6 menit", "Oct 2026 · 6 min"), title: tr("Wawancara pengguna di pasar tradisional", "User interviews at traditional markets"), text: tr("Pelajaran dari 3 minggu riset di Pasar Kosambi.", "Lessons from 3 weeks of research at Kosambi Market."), link: [tr("Baca", "Read"), "#artikel-1"] },
            { meta: tr("Agu 2026 · 4 menit", "Aug 2026 · 4 min"), title: tr("Repositori insight yang benar-benar dipakai", "An insight repository people actually use"), text: tr("Struktur tag sederhana untuk 6 squad.", "A simple tag structure for 6 squads."), link: [tr("Baca", "Read"), "#artikel-2"] },
            { meta: tr("Mei 2026 · 8 menit", "May 2026 · 8 min"), title: tr("Menulis pertanyaan survei yang jujur", "Writing honest survey questions"), text: tr("12 contoh sebelum dan sesudah.", "12 before-and-after examples."), link: [tr("Baca", "Read"), "#artikel-3"] },
          ],
        }),
        newsletter(L, { title: tr("Surat bulanan", "Monthly letter"), text: tr("Satu email per bulan berisi metode riset dan bacaan pilihan.", "One email a month with research methods and curated reading."), ph: "nama@email.com", btn: tr("Berlangganan", "Subscribe") }),
      ],
      contact: () => [
        formSec(L, {
          ey: tr("Kontak", "Contact"),
          title: tr("Mari ngobrol", "Let's talk"),
          text: tr("Untuk proyek lepas, workshop, atau sekadar bertukar pikiran.", "For freelance projects, workshops, or just to swap ideas."),
          info: [
            ["Email", "halo@kiranaw.example"],
            [tr("Lokasi", "Location"), tr("Bandung · bisa remote", "Bandung · remote friendly")],
            [tr("Ketersediaan", "Availability"), tr("Mulai Januari 2027", "From January 2027")],
          ],
          fields: [
            { k: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
            { k: "input", label: "Email", ph: "nama@perusahaan.com", type: "email" },
            { k: "select", label: tr("Jenis kerja sama", "Type of work"), ph: tr("Pilih", "Choose"), options: [tr("Riset pengguna", "User research"), tr("Desain produk", "Product design"), "Workshop", tr("Lainnya", "Other")] },
          ],
          submit: tr("Kirim pesan", "Send message"),
        }),
        faqAccordion(L.t, tr, {
          items: [
            [tr("Berapa lama satu proyek riset?", "How long is a research project?"), tr("Biasanya 3–6 minggu, tergantung jumlah partisipan.", "Usually 3–6 weeks, depending on the number of participants.")],
            [tr("Apakah bisa kerja paruh waktu?", "Do you work part time?"), tr("Bisa, minimal 2 hari per minggu.", "Yes, at least 2 days per week.")],
            [tr("Bahasa yang digunakan?", "Which languages?"), tr("Indonesia, Inggris, dan Sunda.", "Indonesian, English, and Sundanese.")],
          ],
        }),
      ],
    });
  },
};

/* --------------------- 2. fitness-yoga (PREMIUM, 7) ---------------- */

const SV: Palette = { ink: "#134e4a", muted: "#3f6262", primary: "#0d9488", primaryDark: "#0f766e", soft: "#f0fdfa", line: "#99f6e4" };
const svL = look(SV, { font: FONTS.rounded, r: 28, dark: "#042f2e", alt: "#f5fbf9", onDark: "#99f6e4" });

export const fitnessYoga: TemplateContent = {
  brand: "Svarna Yoga Loka",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("classes", "Kelas", "Classes", "kelas", "classes"),
    P("schedule", "Jadwal", "Schedule", "jadwal", "schedule"),
    P("teachers", "Pengajar", "Teachers", "pengajar", "teachers"),
    P("pricing", "Harga", "Pricing", "harga", "pricing"),
    P("retreat", "Retreat", "Retreat", "retreat", "retreat"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = svL;
    const head = withTopbar(header("Svarna", SV, { font: FONTS.rounded, cta: cta(tr("Kelas percobaan", "Trial class"), href("pricing"), SV) }), L, tr("Retreat Sidemen 12–15 Maret 2027 · sisa 6 tempat", "Sidemen retreat March 12–15, 2027 · 6 spots left"), { badge: tr("Baru", "New"), link: [tr("Lihat", "View"), href("retreat")] });
    const foot = footer("Svarna Yoga Loka", tr("Studio yoga & meditasi di Sanur, Bali, sejak 2017.", "Yoga & meditation studio in Sanur, Bali, since 2017."), [{ title: tr("Studio", "Studio"), items: ["Jl. Danau Tamblingan 88", "Sanur, Bali"] }, { title: tr("Jam buka", "Hours"), items: [tr("Setiap hari 06.30–20.00", "Daily 6:30am–8pm")] }, { title: tr("Kontak", "Contact"), items: ["+62 811 3800 512", "namaste@svarna.example"] }], tr("© 2026 Svarna Yoga Loka. Konten contoh.", "© 2026 Svarna Yoga Loka. Sample content."), "#042f2e");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, {
          ey: tr("Sanur · Bali", "Sanur · Bali"),
          title: tr("Bernapas lebih pelan, bergerak lebih ringan", "Breathe slower, move lighter"),
          text: tr("Kelas hatha, vinyasa, dan yin untuk pemula hingga praktisi lama — di shala terbuka menghadap kebun kamboja.", "Hatha, vinyasa, and yin classes for beginners to long-time practitioners — in an open shala facing a frangipani garden."),
          btns: [[tr("Lihat jadwal", "See schedule"), href("schedule")], [tr("Coba gratis", "Try for free"), href("pricing")]],
          image: "v2b-yoga",
          alt: tr("Ilustrasi pose yoga", "Yoga pose illustration"),
          gradient: [SV.soft, "#ffffff", 200],
        }),
        cards(L, {
          ey: tr("Gaya latihan", "Practice styles"),
          title: tr("Temukan kelas yang pas", "Find the right class"),
          cols: 4,
          items: [
            { icon: "🌅", title: "Hatha", text: tr("Pose dasar dengan tempo tenang.", "Foundational poses at a calm pace."), link: [tr("Detail", "Details"), href("classes")] },
            { icon: "🌊", title: "Vinyasa", text: tr("Alur dinamis mengikuti napas.", "Dynamic flow that follows the breath."), link: [tr("Detail", "Details"), href("classes")] },
            { icon: "🌙", title: "Yin", text: tr("Tahanan panjang untuk jaringan ikat.", "Long holds for connective tissue."), link: [tr("Detail", "Details"), href("classes")] },
            { icon: "🤰", title: tr("Prenatal", "Prenatal"), text: tr("Aman untuk trimester 2 dan 3.", "Safe for 2nd and 3rd trimester."), link: [tr("Detail", "Details"), href("classes")] },
          ],
        }),
        split(L, { ey: tr("Shala kami", "Our shala"), title: tr("Ruang terbuka, kelas kecil", "Open space, small classes"), paras: [tr("Maksimal 14 peserta per kelas supaya pengajar bisa memperbaiki postur satu per satu.", "A maximum of 14 students per class so teachers can adjust each posture."), tr("Matras, balok, dan selimut tersedia gratis.", "Mats, blocks, and blankets are free to use.")], bullets: [tr("Lantai kayu jati & kipas langit-langit", "Teak floor & ceiling fans"), tr("Ruang ganti dan shower", "Changing room and shower"), tr("Teh jahe setelah kelas", "Ginger tea after class")], image: "v2b-yoga-night", alt: tr("Shala malam hari", "Shala at night"), reverse: true, bg: L.alt }),
        testiCards(L, {
          ey: tr("Kata murid", "From our students"),
          title: tr("Datang untuk peregangan, tinggal untuk komunitas", "Came for the stretch, stayed for the community"),
          items: [
            { quote: tr("Punggung bawah saya jauh lebih baik setelah 2 bulan kelas hatha pagi.", "My lower back is so much better after 2 months of morning hatha."), author: "Ayu Pradnyani", role: tr("Murid sejak 2024", "Student since 2024"), avatar: "v2b-face-4" },
            { quote: tr("Pengajarnya sabar dan detail. Cocok untuk yang benar-benar pemula.", "Patient, detailed teachers. Perfect for true beginners."), author: "Tom Reiner", role: tr("Ekspat, Sanur", "Expat, Sanur"), avatar: "v2b-face-3" },
            { quote: tr("Kelas yin malam jadi ritual tidur saya.", "The evening yin class became my bedtime ritual."), author: "Made Wirawan", role: tr("Murid sejak 2022", "Student since 2022"), avatar: "v2b-face-1" },
          ],
        }),
      ],
      classes: () => [
        pageHead(L, { ey: tr("Kelas", "Classes"), title: tr("Enam jenis kelas, satu filosofi", "Six class types, one philosophy"), text: tr("Semua kelas berdurasi 60–75 menit dan bisa diikuti pemula kecuali yang ditandai.", "All classes run 60–75 minutes and are beginner friendly unless marked."), image: "v2b-yoga" }),
        tabsSec(L, {
          title: tr("Detail kelas", "Class details"),
          variant: "pills",
          tabs: [
            ["Hatha", tr("75 menit · semua level. Fokus pada alignment, pernapasan ujjayi, dan relaksasi akhir 10 menit.", "75 min · all levels. Focus on alignment, ujjayi breathing, and a 10-minute final relaxation.")],
            ["Vinyasa", tr("60 menit · level 1–2. Rangkaian sun salutation dengan variasi inversi ringan.", "60 min · level 1–2. Sun salutation sequences with light inversion variations.")],
            ["Yin & Nidra", tr("75 menit · semua level. Tahanan 3–5 menit diakhiri yoga nidra.", "75 min · all levels. 3–5 minute holds ending with yoga nidra.")],
            ["Prenatal", tr("60 menit · dengan surat dokter. Pose aman dan latihan napas persalinan.", "60 min · with doctor's note. Safe poses and birth breathing practice.")],
            ["Ashtanga Mysore", tr("90 menit · level 2+. Latihan mandiri dengan pendampingan.", "90 min · level 2+. Self-paced practice with guidance.")],
          ],
        }),
        steps(L, { ey: tr("Kelas pertama", "Your first class"), title: tr("Apa yang perlu disiapkan", "What to prepare"), items: [[tr("Datang 15 menit lebih awal", "Arrive 15 minutes early"), tr("Isi formulir kesehatan singkat.", "Fill in a short health form.")], [tr("Perut kosong", "Empty stomach"), tr("Makan ringan 2 jam sebelumnya.", "Eat lightly 2 hours before.")], [tr("Pakaian nyaman", "Comfortable clothes"), tr("Yang tidak menghalangi gerak.", "Nothing that restricts movement.")], [tr("Beri tahu cedera", "Mention injuries"), tr("Pengajar akan memberi variasi.", "Your teacher will offer variations.")]], bg: L.alt }),
      ],
      schedule: () => [
        pageHead(L, { ey: tr("Jadwal", "Schedule"), title: tr("Jadwal mingguan", "Weekly timetable"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Jadwal", "Schedule"), ""]] }),
        tableSec(L, {
          title: tr("Oktober – Desember 2026", "October – December 2026"),
          text: tr("Waktu dalam WITA. Pesan tempat lewat WhatsApp atau di meja depan.", "Times in WITA. Book via WhatsApp or at the front desk."),
          columns: [tr("Jam", "Time"), tr("Senin", "Mon"), tr("Selasa", "Tue"), tr("Rabu", "Wed"), tr("Kamis", "Thu"), tr("Jumat", "Fri"), tr("Sabtu", "Sat")],
          rows: [
            ["07.00", "Hatha", "Vinyasa", "Hatha", "Vinyasa", "Hatha", "Mysore"],
            ["09.30", "Prenatal", "Hatha", "Prenatal", "Hatha", "Yin", "Vinyasa"],
            ["17.00", "Vinyasa", "Yin", "Vinyasa", "Yin", "Vinyasa", "—"],
            ["19.00", "Yin & Nidra", tr("Meditasi", "Meditation"), "Yin & Nidra", tr("Meditasi", "Meditation"), tr("Kirtan", "Kirtan"), "—"],
          ],
        }),
        infoBar(L, [[tr("Kapasitas", "Capacity"), tr("14 per kelas", "14 per class")], [tr("Pembatalan", "Cancellation"), tr("Maks. 3 jam sebelum", "Up to 3 hours before")], [tr("Parkir", "Parking"), tr("Motor & mobil", "Bikes & cars")], [tr("Minggu", "Sunday"), tr("Libur", "Closed")]]),
      ],
      teachers: () => [
        pageHead(L, { ey: tr("Pengajar", "Teachers"), title: tr("Bersertifikat Yoga Alliance", "Yoga Alliance certified"), center: true }),
        teamCards(L.t, tr, {
          eyebrow: tr("Tim kami", "Our team"),
          title: tr("Pengajar tetap", "Resident teachers"),
          members: [
            { name: "Ni Luh Sekar", role: tr("Pendiri · Hatha, Yin · E-RYT 500", "Founder · Hatha, Yin · E-RYT 500"), photo: asset("v2b-face-2"), links: [{ label: "Instagram", href: "#" }] },
            { name: "Gede Arsana", role: "Vinyasa, Ashtanga · RYT 500", photo: asset("v2b-face-1"), links: [{ label: "Instagram", href: "#" }] },
            { name: "Hannah Okoro", role: tr("Prenatal · RPYT", "Prenatal · RPYT"), photo: asset("v2b-face-4"), links: [{ label: "Instagram", href: "#" }] },
            { name: "Komang Dharma", role: tr("Meditasi & pranayama", "Meditation & pranayama"), photo: asset("v2b-face-3"), links: [{ label: "Instagram", href: "#" }] },
          ],
        }),
        quote(L, { text: tr("Yoga bukan soal menyentuh jari kaki, tapi apa yang kamu pelajari dalam perjalanan ke sana.", "Yoga isn't about touching your toes, it's what you learn on the way down."), name: "Ni Luh Sekar", role: tr("Pendiri", "Founder"), dark: true }),
      ],
      pricing: () => [
        pricingCards(L.t, tr, {
          eyebrow: tr("Harga", "Pricing"),
          title: tr("Pilih ritme latihanmu", "Choose your practice rhythm"),
          text: tr("Kelas percobaan pertama gratis untuk warga lokal maupun wisatawan.", "Your first trial class is free for locals and visitors alike."),
          badge: tr("Terfavorit", "Favorite"),
          plans: [
            { name: tr("Drop-in", "Drop-in"), price: "Rp150rb", period: tr("/kelas", "/class"), text: tr("Untuk wisatawan.", "For visitors."), features: [tr("1 kelas apa saja", "Any 1 class"), tr("Matras gratis", "Free mat")], cta: { label: tr("Pesan", "Book"), href: href("contact") } },
            { name: tr("10 Kelas", "10 Classes"), price: "Rp1,2jt", period: tr("/2 bulan", "/2 months"), text: tr("Hemat 20%.", "Save 20%."), features: [tr("10 kelas apa saja", "Any 10 classes"), tr("Bisa dibagi berdua", "Shareable with a friend"), tr("Teh jahe gratis", "Free ginger tea")], cta: { label: tr("Beli paket", "Buy pack"), href: href("contact") }, featured: true },
            { name: tr("Bulanan tanpa batas", "Unlimited monthly"), price: "Rp1,6jt", period: tr("/bulan", "/month"), text: tr("Untuk praktisi rutin.", "For regular practitioners."), features: [tr("Kelas tanpa batas", "Unlimited classes"), tr("1 sesi privat", "1 private session"), tr("Diskon retreat 10%", "10% retreat discount")], cta: { label: tr("Gabung", "Join"), href: href("contact") } },
          ],
        }),
        faqAccordion(L.t, tr, { items: [[tr("Apakah paket bisa dibekukan?", "Can I freeze my pack?"), tr("Bisa sekali hingga 14 hari dengan alasan sakit atau perjalanan.", "Once, up to 14 days, for illness or travel.")], [tr("Ada kelas privat?", "Private classes?"), tr("Ada, Rp450rb per sesi 60 menit di studio atau vila Anda.", "Yes, Rp450k per 60-minute session at the studio or your villa.")]] }),
      ],
      retreat: () => [
        heroImage(L, { ey: tr("Retreat 4 hari", "4-day retreat"), title: tr("Sidemen Silence Retreat", "Sidemen Silence Retreat"), text: tr("Yoga dua kali sehari, trekking sawah, dan hari hening penuh di lembah Sidemen.", "Yoga twice a day, rice field treks, and a full silent day in the Sidemen valley."), btns: [[tr("Daftar sekarang", "Register now"), href("contact")]], image: "v2b-villa", opacity: 45 }),
        countdownSec(L, { ey: tr("Pendaftaran ditutup", "Registration closes"), title: tr("Sisa 6 tempat", "6 spots left"), text: tr("Harga early bird Rp6,8jt berlaku sampai 31 Desember 2026.", "Early bird price Rp6.8m until December 31, 2026."), target: "2026-12-31T23:59", done: tr("Early bird telah berakhir.", "Early bird has ended."), btn: [tr("Amankan tempat", "Save your spot"), href("contact")] }),
        timeline(L, {
          title: tr("Rangkaian acara", "Itinerary"),
          items: [
            [tr("Hari 1", "Day 1"), tr("Tiba & upacara pembukaan", "Arrival & opening ceremony"), tr("Penjemputan dari Sanur pukul 10.00, yin sore.", "Pick-up from Sanur at 10am, afternoon yin.")],
            [tr("Hari 2", "Day 2"), tr("Trekking sawah", "Rice field trek"), tr("Vinyasa pagi, trekking 6 km, kelas pranayama.", "Morning vinyasa, 6 km trek, pranayama class.")],
            [tr("Hari 3", "Day 3"), tr("Hari hening", "Silent day"), tr("Meditasi, journaling, makan dalam diam.", "Meditation, journaling, silent meals.")],
            [tr("Hari 4", "Day 4"), tr("Penutupan", "Closing"), tr("Melukat di Tirta Empul lalu kembali ke Sanur.", "Water blessing at Tirta Empul, then back to Sanur.")],
          ],
          bg: L.alt,
        }),
      ],
      contact: () => [
        formSec(L, {
          ey: tr("Kontak", "Contact"),
          title: tr("Pesan kelas atau retreat", "Book a class or retreat"),
          info: [[tr("Alamat", "Address"), "Jl. Danau Tamblingan 88, Sanur"], ["WhatsApp", "+62 811 3800 512"], ["Email", "namaste@svarna.example"]],
          fields: [
            { k: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") },
            { k: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" },
            { k: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Kelas percobaan", "Trial class"), tr("Paket 10 kelas", "10-class pack"), tr("Kelas privat", "Private class"), tr("Retreat Sidemen", "Sidemen retreat")] },
            { k: "date", label: tr("Tanggal yang diinginkan", "Preferred date") },
          ],
          submit: tr("Kirim permintaan", "Send request"),
          note: tr("Kami membalas dalam 1 jam pada jam operasional.", "We reply within 1 hour during opening hours."),
        }),
      ],
    });
  },
};

/* ------------------- 3. beauty-barbershop (PREMIUM, 6) ------------- */

const KK: Palette = { ink: "#18181b", muted: "#52525b", primary: "#b91c1c", primaryDark: "#991b1b", soft: "#fef2f2", line: "#fecaca" };
const kkL = look(KK, { font: FONTS.grotesk, r: 4, dark: "#0c0a09", alt: "#f5f5f4", onDark: "#a8a29e" });

export const beautyBarbershop: TemplateContent = {
  brand: "Kumis & Kapak Barber",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("barbers", "Kapster", "Barbers", "kapster", "barbers"),
    P("gallery", "Galeri", "Gallery", "galeri", "gallery"),
    P("booking", "Booking", "Booking", "booking", "booking"),
    P("locations", "Lokasi", "Locations", "lokasi", "locations"),
  ],
  build: (key, tr, href) => {
    const L = kkL;
    const head = header("KUMIS & KAPAK", KK, { bg: "#0c0a09", ink: "#ffffff", font: FONTS.grotesk, sticky: true, cta: cta(tr("Booking", "Book now"), href("booking"), KK) });
    const foot = footerSlim(L, "KUMIS & KAPAK", [[tr("Layanan", "Services"), href("services")], [tr("Booking", "Booking"), href("booking")], [tr("Lokasi", "Locations"), href("locations")]], tr("© 2026 Kumis & Kapak Barber · Jakarta & Bekasi. Harga contoh.", "© 2026 Kumis & Kapak Barber · Jakarta & Bekasi. Sample prices."), { bg: "#0c0a09" });
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, {
          dark: true,
          bg: "#0c0a09",
          ey: tr("Barbershop klasik · sejak 2015", "Classic barbershop · since 2015"),
          title: tr("Potongan rapi, obrolan santai, handuk hangat", "Sharp cuts, easy talk, hot towels"),
          text: tr("Fade, pompadour, dan cukur jenggot pisau lurus oleh kapster berpengalaman 7+ tahun.", "Fades, pompadours, and straight-razor shaves by barbers with 7+ years of experience."),
          btns: [[tr("Booking kursi", "Book a chair"), href("booking")], [tr("Daftar harga", "Price list"), href("services")]],
          image: "v2b-barber",
          alt: tr("Kursi barber", "Barber chair"),
          size: 56,
        }),
        infoBar(L, [[tr("Buka", "Open"), tr("Setiap hari 10.00–22.00", "Daily 10am–10pm")], [tr("Rata-rata tunggu", "Avg. wait"), tr("< 10 menit dengan booking", "< 10 min with booking")], [tr("Rating", "Rating"), "4,9 · 3.100 Google reviews"], [tr("Cabang", "Branches"), "Kemang · Senopati · Bekasi"]], { bg: KK.primaryDark, dark: true }),
        servicesSplit(L.t, tr, {
          eyebrow: tr("Layanan unggulan", "Signature services"),
          title: tr("Bukan sekadar potong rambut", "More than a haircut"),
          image: asset("v2b-barber"),
          reverse: true,
          items: [
            { icon: "✂", title: tr("Signature Cut", "Signature Cut"), text: tr("Konsultasi, cuci, potong, styling, pijat kepala. 45 menit.", "Consultation, wash, cut, styling, head massage. 45 min.") },
            { icon: "🪒", title: tr("Cukur pisau lurus", "Straight-razor shave"), text: tr("Handuk hangat, minyak pra-cukur, aftershave balm.", "Hot towel, pre-shave oil, aftershave balm.") },
            { icon: "🧔", title: tr("Rapikan jenggot", "Beard sculpt"), text: tr("Bentuk garis jenggot sesuai wajah.", "Beard line shaped to your face.") },
          ],
          cta: { label: tr("Semua layanan", "All services"), href: href("services") },
        }),
        testiCards(L, {
          dark: true,
          title: tr("Pelanggan tetap bilang…", "Regulars say…"),
          items: [
            { quote: tr("Satu-satunya tempat yang paham fade saya tanpa harus dijelaskan ulang.", "The only place that gets my fade without me explaining it again."), author: "Bima Satria", role: tr("Pelanggan Kemang", "Kemang regular"), avatar: "v2b-face-1" },
            { quote: tr("Cukur pisau lurusnya bikin ketagihan. Wajib coba sebelum nikah.", "The straight-razor shave is addictive. A must before your wedding."), author: "Arief Nugraha", role: tr("Pelanggan Senopati", "Senopati regular"), avatar: "v2b-face-3" },
            { quote: tr("Anak saya yang takut gunting sekarang minta ke sini tiap bulan.", "My son who feared scissors now asks to come every month."), author: "Dimas Hartono", role: tr("Ayah dua anak", "Father of two"), avatar: "v2b-face-5" },
          ],
          bg: "#1c1917",
        }),
        ctaSplit(L, { title: tr("Kursi kosong jam 19.00 hari ini", "Chair free at 7pm today"), text: tr("Booking online, bayar di tempat.", "Book online, pay in store."), btns: [[tr("Booking sekarang", "Book now"), href("booking")]], bg: KK.primary }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Daftar harga", "Price list"), text: tr("Semua layanan termasuk cuci rambut dan minuman.", "All services include a hair wash and a drink."), dark: true, bg: "#0c0a09" }),
        priceList(L, {
          title: tr("Rambut & jenggot", "Hair & beard"),
          groups: [
            { name: tr("Rambut", "Hair"), items: [["Signature Cut", tr("45 menit", "45 min"), "Rp120rb"], ["Skin Fade", tr("50 menit, termasuk detail", "50 min, with detailing"), "Rp140rb"], [tr("Potong anak (≤ 12 th)", "Kids cut (≤ 12 yrs)"), tr("30 menit", "30 min"), "Rp85rb"], [tr("Cat rambut / semir", "Hair color"), tr("mulai", "from"), "Rp250rb"]] },
            { name: tr("Jenggot & wajah", "Beard & face"), items: [[tr("Cukur pisau lurus", "Straight-razor shave"), tr("30 menit", "30 min"), "Rp95rb"], [tr("Rapikan jenggot", "Beard sculpt"), tr("20 menit", "20 min"), "Rp70rb"], [tr("Masker arang", "Charcoal mask"), tr("15 menit", "15 min"), "Rp60rb"], ["The Groom Package", tr("cut + shave + masker", "cut + shave + mask"), "Rp320rb"]] },
          ],
          note: tr("Harga sudah termasuk pajak. Tip tidak wajib.", "Prices include tax. Tipping is optional."),
        }),
        accordionSec(L, { title: tr("Sebelum datang", "Before you come"), items: [[tr("Perlu booking?", "Do I need to book?"), tr("Disarankan, terutama Jumat–Minggu. Walk-in dilayani jika ada kursi kosong.", "Recommended, especially Fri–Sun. Walk-ins welcome when a chair is free.")], [tr("Terlambat?", "Running late?"), tr("Toleransi 10 menit, setelah itu jadwal digeser.", "10-minute grace, after that we reschedule.")], [tr("Pembayaran", "Payment"), tr("Tunai, QRIS, dan kartu debit/kredit.", "Cash, QRIS, and debit/credit cards.")]], bg: L.alt }),
      ],
      barbers: () => [
        pageHead(L, { ey: tr("Kapster", "Barbers"), title: tr("Tangan-tangan di balik gunting", "The hands behind the scissors"), center: true }),
        teamCards(L.t, tr, {
          eyebrow: tr("Tim", "Team"),
          title: tr("Kapster senior", "Senior barbers"),
          members: [
            { name: "Bang Jali", role: tr("Kepala kapster · 14 th", "Head barber · 14 yrs"), photo: asset("v2b-face-5"), links: [{ label: "Instagram", href: "#" }, { label: tr("Booking", "Book"), href: href("booking") }] },
            { name: "Rizky Ananda", role: tr("Spesialis fade · 8 th", "Fade specialist · 8 yrs"), photo: asset("v2b-face-1"), links: [{ label: "Instagram", href: "#" }, { label: tr("Booking", "Book"), href: href("booking") }] },
            { name: "Yohanes Lado", role: tr("Cukur & jenggot · 9 th", "Shave & beard · 9 yrs"), photo: asset("v2b-face-3"), links: [{ label: "Instagram", href: "#" }, { label: tr("Booking", "Book"), href: href("booking") }] },
            { name: "Sinta Maharani", role: tr("Warna rambut · 6 th", "Hair color · 6 yrs"), photo: asset("v2b-face-6"), links: [{ label: "Instagram", href: "#" }, { label: tr("Booking", "Book"), href: href("booking") }] },
          ],
        }),
        steps(L, { title: tr("Jalur karier kapster kami", "Our barber career path"), items: [[tr("Akademi 3 bulan", "3-month academy"), tr("Dasar gunting & clipper.", "Scissor & clipper basics.")], [tr("Junior", "Junior"), tr("Diawasi kapster senior.", "Supervised by seniors.")], [tr("Senior", "Senior"), tr("Kursi sendiri & komisi penuh.", "Own chair & full commission.")]], dark: true, bg: "#0c0a09" }),
      ],
      gallery: () => [
        pageHead(L, { ey: tr("Galeri", "Gallery"), title: tr("Hasil potongan minggu ini", "This week's cuts") }),
        gallery(L, { images: [["v2b-face-1", "Skin fade"], ["v2b-face-3", "Pompadour"], ["v2b-face-5", "Crew cut"], ["v2b-barber", tr("Kursi Kemang", "Kemang chair")], ["v2b-face-6", "Bob"], ["pro-team-1", "Taper"]], cols: 3 }),
        ctaSplit(L, { title: tr("Mau gaya yang sama?", "Want the same style?"), text: tr("Simpan foto, tunjukkan ke kapster.", "Save the photo, show your barber."), btns: [[tr("Booking", "Book"), href("booking")]] }),
      ],
      booking: () => [
        formSec(L, {
          ey: tr("Booking", "Booking"),
          title: tr("Amankan kursimu", "Save your chair"),
          text: tr("Konfirmasi dikirim lewat WhatsApp dalam 5 menit.", "Confirmation sent via WhatsApp within 5 minutes."),
          info: [[tr("Pembatalan", "Cancellation"), tr("Gratis hingga 2 jam sebelum", "Free up to 2 hours before")], [tr("Hotline", "Hotline"), "+62 812 1515 2026"]],
          fields: [
            { k: "select", label: tr("Cabang", "Branch"), ph: tr("Pilih cabang", "Choose a branch"), options: ["Kemang", "Senopati", "Bekasi Summarecon"] },
            { k: "select", label: tr("Layanan", "Service"), ph: tr("Pilih layanan", "Choose a service"), options: ["Signature Cut", "Skin Fade", tr("Cukur pisau lurus", "Straight-razor shave"), "The Groom Package"] },
            { k: "select", label: tr("Kapster", "Barber"), ph: tr("Siapa saja", "Anyone"), options: ["Bang Jali", "Rizky Ananda", "Yohanes Lado", "Sinta Maharani"] },
            { k: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            { k: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" },
          ],
          submit: tr("Konfirmasi booking", "Confirm booking"),
          formFirst: true,
          bg: "#f5f5f4",
        }),
      ],
      locations: () => [
        pageHead(L, { ey: tr("Lokasi", "Locations"), title: tr("Tiga cabang", "Three branches"), dark: true, bg: "#0c0a09" }),
        cards(L, {
          cols: 3,
          items: [
            { icon: "📍", meta: "Kemang", title: "Jl. Kemang Raya 21", text: tr("Parkir 10 mobil · dekat Kemang Village. 10.00–22.00.", "Parking for 10 cars · near Kemang Village. 10am–10pm."), link: [tr("Booking di sini", "Book here"), href("booking")] },
            { icon: "📍", meta: "Senopati", title: "Jl. Suryo 9", text: tr("Lantai 2, di atas kedai kopi. 10.00–23.00.", "2nd floor, above the coffee shop. 10am–11pm."), link: [tr("Booking di sini", "Book here"), href("booking")] },
            { icon: "📍", meta: "Bekasi", title: "Summarecon Mall Lt. 1", text: tr("Area F&B, dekat pintu barat. 10.00–22.00.", "F&B area, near the west entrance. 10am–10pm."), link: [tr("Booking di sini", "Book here"), href("booking")] },
          ],
        }),
        logos(L, { title: tr("Produk yang kami pakai", "Products we use"), names: ["Layrite", "Reuzel", "Proraso", "Suavecito", "Uppercut"], bg: L.alt }),
      ],
    });
  },
};

/* ------------------- 4. automotive-dealer (PREMIUM, 9) ------------- */

const RG: Palette = { ink: "#0f172a", muted: "#475569", primary: "#dc2626", primaryDark: "#b91c1c", soft: "#fef2f2", line: "#fecaca" };
const rgL = look(RG, { font: FONTS.grotesk, r: 12, dark: "#111827", alt: "#f3f4f6", onDark: "#9ca3af" });

export const automotiveDealer: TemplateContent = {
  brand: "Rodagaya Motor",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("inventory", "Stok Mobil", "Inventory", "stok-mobil", "inventory"),
    P("car", "Detail Mobil", "Car Detail", "detail-mobil", "car-detail"),
    P("compare", "Bandingkan", "Compare", "bandingkan", "compare"),
    P("financing", "Kredit", "Financing", "kredit", "financing"),
    P("service", "Servis", "Service", "servis", "service"),
    P("tradein", "Tukar Tambah", "Trade-in", "tukar-tambah", "trade-in"),
    P("about", "Tentang", "About", "tentang", "about"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = rgL;
    const head = header("RODAGAYA", RG, { font: FONTS.grotesk, cta: cta(tr("Test drive", "Test drive"), href("contact"), RG, "dark") });
    const foot = footer("Rodagaya Motor", tr("Dealer resmi mobil baru & bekas bersertifikat di Surabaya.", "Authorized dealer of new & certified used cars in Surabaya."), [{ title: tr("Showroom", "Showroom"), items: ["Jl. Ahmad Yani 300", "Surabaya"] }, { title: tr("Jam", "Hours"), items: [tr("Sen–Sab 08.00–20.00", "Mon–Sat 8am–8pm"), tr("Min 10.00–17.00", "Sun 10am–5pm")] }, { title: tr("Hubungi", "Call"), items: ["031 8800 2026", "sales@rodagaya.example"] }], tr("© 2026 Rodagaya Motor. Harga & spesifikasi contoh.", "© 2026 Rodagaya Motor. Sample prices & specs."), "#111827");
    const carsList = [
      { image: "v2b-car-1", title: "Sagara GT 1.5 Turbo", text: tr("2026 · Baru · Otomatis · Bensin", "2026 · New · Automatic · Petrol"), price: "Rp418.000.000", badge: tr("Baru", "New"), rating: 4.8, reviews: "(64)" },
      { image: "v2b-car-2", title: "Kirana Hybrid SUV", text: tr("2026 · Baru · Hybrid · 7 kursi", "2026 · New · Hybrid · 7 seats"), price: "Rp565.000.000", badge: "Hybrid", rating: 4.9, reviews: "(41)" },
      { image: "v2b-car-3", title: "Lintas EV Hatch", text: tr("2026 · Baru · Listrik · 410 km", "2026 · New · Electric · 410 km"), price: "Rp489.000.000", badge: "EV", rating: 4.7, reviews: "(29)" },
      { image: "v2b-car-4", title: "Sagara RS 2023", text: tr("Bekas · 28.000 km · 1 pemilik", "Used · 28,000 km · 1 owner"), price: "Rp312.000.000", compare: "Rp338.000.000", rating: 4.6, reviews: "(12)" },
      { image: "v2b-car-2", title: "Kirana SUV 2022", text: tr("Bekas · 41.000 km · servis resmi", "Used · 41,000 km · dealer serviced"), price: "Rp398.000.000", rating: 4.5, reviews: "(9)" },
      { image: "v2b-car-1", title: "Sagara 1.2 MT 2021", text: tr("Bekas · 55.000 km · manual", "Used · 55,000 km · manual"), price: "Rp189.000.000", rating: 4.4, reviews: "(17)" },
    ];
    return render(L, key, head, foot, {
      home: () => [
        sliderSec(L, [
          [tr("Sagara GT 2026 telah tiba", "The 2026 Sagara GT has arrived"), tr("Turbo 1.5 L, 177 PS. DP mulai 15%.", "1.5 L turbo, 177 PS. Down payment from 15%."), "#b91c1c"],
          [tr("Lintas EV: 410 km sekali isi", "Lintas EV: 410 km per charge"), tr("Gratis wallbox & instalasi bulan ini.", "Free wallbox & installation this month."), "#0f766e"],
          [tr("Mobil bekas bersertifikat", "Certified pre-owned"), tr("Inspeksi 160 titik, garansi mesin 1 tahun.", "160-point inspection, 1-year engine warranty."), "#1f2937"],
        ], { height: 420, padY: 32 }),
        products(L, { ey: tr("Stok pilihan", "Featured stock"), title: tr("Siap dikirim minggu ini", "Ready to deliver this week"), items: carsList.slice(0, 3), cta: tr("Lihat detail", "View details"), href: href("car") }),
        counters(L, [["2.400+", tr("Mobil terjual", "Cars sold")], ["160", tr("Titik inspeksi", "Inspection points")], ["4,9", tr("Rating Google", "Google rating")], ["12", tr("Tahun melayani", "Years serving")]], { dark: true }),
        cards(L, {
          title: tr("Satu tempat untuk semua urusan mobil", "One place for everything car"),
          cols: 4,
          style: "line",
          items: [
            { title: tr("Kredit cepat", "Fast financing"), text: tr("Persetujuan 1 hari dari 6 leasing.", "1-day approval from 6 lenders."), link: [tr("Simulasi", "Simulate"), href("financing")] },
            { title: tr("Tukar tambah", "Trade-in"), text: tr("Taksiran harga dalam 30 menit.", "Valuation in 30 minutes."), link: [tr("Taksir", "Get a quote"), href("tradein")] },
            { title: tr("Servis resmi", "Official service"), text: tr("12 bay, suku cadang asli.", "12 bays, genuine parts."), link: [tr("Booking", "Book"), href("service")] },
            { title: tr("Bandingkan", "Compare"), text: tr("Lihat spesifikasi berdampingan.", "See specs side by side."), link: [tr("Bandingkan", "Compare"), href("compare")] },
          ],
        }),
      ],
      inventory: () => [
        pageHead(L, { ey: tr("Stok", "Inventory"), title: tr("Mobil baru & bekas", "New & used cars"), text: tr("Diperbarui setiap hari pukul 09.00. Harga on the road Surabaya.", "Updated daily at 9am. On-the-road prices for Surabaya."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Stok", "Inventory"), ""]] }),
        products(L, { items: carsList, cta: tr("Lihat detail", "View details"), href: href("car") }),
        ctaSplit(L, { title: tr("Tidak menemukan yang dicari?", "Can't find what you need?"), text: tr("Kami carikan unit sesuai budget dalam 7 hari.", "We'll source a car within your budget in 7 days."), btns: [[tr("Minta dicarikan", "Request a car"), href("contact")]], bg: RG.primaryDark }),
      ],
      car: () => [
        productDetail(L, {
          crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Stok", "Inventory"), href("inventory")], ["Sagara GT", ""]],
          image: "v2b-car-1",
          thumbs: ["v2b-car-1", "v2b-car-4", "v2b-car-2"],
          tag: tr("Baru · Tersedia 3 unit", "New · 3 units available"),
          title: "Sagara GT 1.5 Turbo CVT",
          price: "Rp418.000.000",
          rating: 4.8,
          reviews: tr("dari 64 pemilik", "from 64 owners"),
          text: tr("Hatchback sporty dengan mesin turbo 177 PS, 6 airbag, dan adaptive cruise control.", "A sporty hatchback with a 177 PS turbo engine, 6 airbags, and adaptive cruise control."),
          options: [{ k: "select", label: tr("Warna", "Color"), ph: tr("Pilih warna", "Choose a color"), options: [tr("Merah Rubi", "Ruby Red"), tr("Hitam Onyx", "Onyx Black"), tr("Putih Mutiara", "Pearl White")] }],
          btns: [[tr("Jadwalkan test drive", "Schedule a test drive"), href("contact")], [tr("Simulasi kredit", "Financing estimate"), href("financing")]],
          tabs: [
            [tr("Spesifikasi", "Specs"), tr("1.498 cc turbo · 177 PS / 240 Nm · CVT 7-speed · 0–100 km/j 8,4 dtk · 16,2 km/l.", "1,498 cc turbo · 177 PS / 240 Nm · 7-speed CVT · 0–100 km/h 8.4 s · 16.2 km/l.")],
            [tr("Fitur", "Features"), tr("Layar 10,25 inci, Apple CarPlay nirkabel, kamera 360°, lane keeping assist.", "10.25-inch screen, wireless Apple CarPlay, 360° camera, lane keeping assist.")],
            [tr("Garansi", "Warranty"), tr("5 tahun / 150.000 km, servis gratis 4 tahun.", "5 years / 150,000 km, 4 years of free service.")],
          ],
        }),
        tableSec(L, { title: tr("Ringkasan biaya", "Cost summary"), columns: [tr("Komponen", "Item"), tr("Nilai", "Amount")], rows: [[tr("Harga OTR", "OTR price"), "Rp418.000.000"], [tr("DP 20%", "20% down payment"), "Rp83.600.000"], [tr("Cicilan 5 th (est.)", "5-yr installment (est.)"), tr("Rp7.150.000/bln", "Rp7,150,000/mo")], [tr("Asuransi tahun 1", "Year-1 insurance"), tr("Termasuk", "Included")]], bg: L.alt }),
      ],
      compare: () => [
        pageHead(L, { ey: tr("Bandingkan", "Compare"), title: tr("Tiga model terlaris", "Our three best sellers"), center: true }),
        compareSec(L, {
          title: tr("Spesifikasi berdampingan", "Side-by-side specs"),
          columns: ["Sagara GT", "Kirana Hybrid", "Lintas EV"],
          rows: [
            tr("Harga OTR | Rp418jt | Rp565jt | Rp489jt", "OTR price | Rp418m | Rp565m | Rp489m"),
            tr("Penggerak | Bensin turbo | Hybrid | Listrik", "Powertrain | Turbo petrol | Hybrid | Electric"),
            tr("Kursi | 5 | 7 | 5", "Seats | 5 | 7 | 5"),
            tr("Efisiensi | 16,2 km/l | 22,5 km/l | 410 km", "Efficiency | 16.2 km/l | 22.5 km/l | 410 km"),
            tr("Kamera 360° | ya | ya | ya", "360° camera | yes | yes | yes"),
            tr("Sunroof | tidak | ya | tidak", "Sunroof | no | yes | no"),
            tr("Pengisian cepat | tidak | tidak | ya", "Fast charging | no | no | yes"),
          ],
          highlight: 2,
          caption: tr("Spesifikasi dapat berubah sewaktu-waktu.", "Specifications may change without notice."),
        }),
        ctaSplit(L, { title: tr("Masih ragu?", "Still unsure?"), text: tr("Coba ketiganya dalam satu sesi test drive.", "Try all three in one test drive session."), btns: [[tr("Atur test drive", "Arrange a test drive"), href("contact")]] }),
      ],
      financing: () => [
        pageHead(L, { ey: tr("Kredit", "Financing"), title: tr("Cicilan yang masuk akal", "Installments that make sense"), text: tr("Bekerja sama dengan 6 leasing dan 3 bank.", "Partnered with 6 lenders and 3 banks."), image: "v2b-car-2" }),
        tableSec(L, {
          title: tr("Contoh simulasi Sagara GT", "Sagara GT sample simulation"),
          columns: [tr("Tenor", "Term"), tr("DP 20%", "20% DP"), tr("DP 30%", "30% DP"), tr("Bunga flat", "Flat rate")],
          rows: [[tr("1 tahun", "1 year"), "Rp29,7jt", "Rp25,9jt", "2,9%"], [tr("3 tahun", "3 years"), "Rp10,9jt", "Rp9,5jt", "3,9%"], [tr("5 tahun", "5 years"), "Rp7,2jt", "Rp6,3jt", "4,9%"]],
          caption: tr("Angka per bulan, ilustrasi saja.", "Monthly figures, for illustration only."),
        }),
        steps(L, { title: tr("Empat langkah sampai kunci di tangan", "Four steps to keys in hand"), items: [[tr("Ajukan", "Apply"), tr("KTP, NPWP, slip gaji.", "ID, tax number, payslip.")], [tr("Survei", "Survey"), tr("Leasing menghubungi dalam 24 jam.", "Lender calls within 24 hours.")], [tr("Persetujuan", "Approval"), tr("Rata-rata 1 hari kerja.", "1 business day on average.")], [tr("Serah terima", "Handover"), tr("Di showroom atau diantar.", "At the showroom or delivered.")]], bg: L.alt }),
      ],
      service: () => [
        pageHead(L, { ey: tr("Servis", "Service"), title: tr("Bengkel resmi 12 bay", "12-bay official workshop"), dark: true }),
        priceList(L, { title: tr("Paket servis", "Service packages"), groups: [{ name: tr("Berkala", "Periodic"), items: [[tr("10.000 km", "10,000 km"), tr("Oli, filter, cek 30 titik", "Oil, filter, 30-point check"), "Rp650rb"], [tr("40.000 km", "40,000 km"), tr("+ busi, minyak rem", "+ spark plugs, brake fluid"), "Rp1,8jt"]] }, { name: tr("Tambahan", "Add-ons"), items: [[tr("Spooring & balancing", "Alignment & balancing"), "", "Rp350rb"], [tr("Detailing interior", "Interior detailing"), "", "Rp900rb"]] }] }),
        formSec(L, { title: tr("Booking servis", "Book a service"), fields: [{ k: "input", label: tr("Nomor polisi", "Plate number"), ph: "L 1234 AB" }, { k: "select", label: tr("Paket", "Package"), ph: tr("Pilih paket", "Choose a package"), options: ["10.000 km", "20.000 km", "40.000 km", tr("Perbaikan umum", "General repair")] }, { k: "date", label: tr("Tanggal", "Date") }, { k: "check", label: tr("Butuh mobil pengganti", "Need a courtesy car") }], submit: tr("Booking", "Book"), info: [[tr("Antar-jemput", "Pick-up"), tr("Gratis radius 10 km", "Free within 10 km")]] }),
      ],
      tradein: () => [
        pageHead(L, { ey: tr("Tukar tambah", "Trade-in"), title: tr("Mobil lama jadi DP", "Your old car becomes the down payment") }),
        steps(L, { title: tr("Cara kerjanya", "How it works"), items: [[tr("Isi data", "Share details"), tr("Merek, tahun, kilometer.", "Make, year, mileage.")], [tr("Inspeksi 30 menit", "30-min inspection"), tr("Di showroom atau rumah.", "At the showroom or your home.")], [tr("Penawaran", "Offer"), tr("Berlaku 7 hari.", "Valid for 7 days.")]] }),
        formSec(L, { title: tr("Minta taksiran", "Request a valuation"), fields: [{ k: "input", label: tr("Merek & model", "Make & model"), ph: "Sagara 1.2 MT" }, { k: "input", label: tr("Tahun", "Year"), ph: "2019", type: "number" }, { k: "input", label: tr("Kilometer", "Mileage"), ph: "60000", type: "number" }, { k: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" }], submit: tr("Kirim", "Submit"), formFirst: true }),
      ],
      about: () => [
        split(L, { ey: tr("Tentang kami", "About us"), title: tr("Dealer keluarga sejak 2014", "A family dealership since 2014"), paras: [tr("Dimulai dari showroom 4 mobil di Jl. Ahmad Yani, kini Rodagaya melayani 2.400+ pemilik di Jawa Timur.", "Starting as a 4-car showroom on Jl. Ahmad Yani, Rodagaya now serves 2,400+ owners across East Java."), tr("Kami percaya transparansi harga dan servis purnajual adalah alasan pelanggan kembali.", "We believe transparent pricing and after-sales service bring customers back.")], image: "v2b-car-3", alt: tr("Showroom", "Showroom") }),
        counters(L, [["2014", tr("Berdiri", "Founded")], ["48", tr("Karyawan", "Employees")], ["12", tr("Bay servis", "Service bays")], ["97%", tr("Pelanggan kembali servis", "Return for service")]], { title: tr("Rodagaya dalam angka", "Rodagaya in numbers"), bg: L.alt }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Jadwalkan test drive", "Schedule a test drive"), info: [[tr("Showroom", "Showroom"), "Jl. Ahmad Yani 300, Surabaya"], [tr("Telepon", "Phone"), "031 8800 2026"], ["WhatsApp", "+62 811 3030 2026"]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { k: "select", label: tr("Model", "Model"), ph: tr("Pilih model", "Choose a model"), options: ["Sagara GT", "Kirana Hybrid SUV", "Lintas EV"] }, { k: "date", label: tr("Jadwal", "Schedule"), mode: "datetime-local" }], submit: tr("Kirim", "Send") }),
        infoBar(L, [[tr("Senin–Sabtu", "Mon–Sat"), "08.00–20.00"], [tr("Minggu", "Sunday"), "10.00–17.00"], [tr("Bengkel", "Workshop"), "07.30–17.00"]]),
      ],
    });
  },
};

/* ------------------- 5. finance-accounting (PREMIUM, 8) ------------ */

const NT: Palette = { ink: "#0b2545", muted: "#475569", primary: "#047857", primaryDark: "#065f46", soft: "#ecfdf5", line: "#a7f3d0" };
const ntL = look(NT, { font: FONTS.sans, hf: FONTS.serif, r: 6, dark: "#0b2545", alt: "#f6f8fb", onDark: "#a7f3d0" });

export const financeAccounting: TemplateContent = {
  brand: "Neraca Tirtamas & Rekan",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("packages", "Paket", "Packages", "paket", "packages"),
    P("industries", "Industri", "Industries", "industri", "industries"),
    P("team", "Tim", "Team", "tim", "team"),
    P("insights", "Wawasan", "Insights", "wawasan", "insights"),
    P("article", "Artikel", "Article", "artikel-pajak-umkm", "article-sme-tax"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = ntL;
    const head = centeredHeader("Neraca Tirtamas & Rekan", NT, { font: FONTS.serif });
    const foot = footer("Neraca Tirtamas & Rekan", tr("Kantor jasa akuntansi & konsultan pajak terdaftar.", "Registered accounting & tax advisory firm."), [{ title: tr("Layanan", "Services"), items: [tr("Pembukuan", "Bookkeeping"), tr("Pajak", "Tax"), tr("Audit internal", "Internal audit")] }, { title: tr("Kantor", "Office"), items: ["Menara Kuningan Lt. 11", "Jakarta Selatan", "021 5290 1188"] }], tr("© 2026 Neraca Tirtamas & Rekan. Konten contoh, bukan nasihat pajak.", "© 2026 Neraca Tirtamas & Rekan. Sample content, not tax advice."), "#0b2545");
    return render(L, key, head, foot, {
      home: () => [
        heroCenter(L, {
          badge: tr("Terdaftar di Kemenkeu & IAPI", "Registered with MoF & IAPI"),
          title: tr("Laporan keuangan rapi, pajak tepat waktu, tidur lebih nyenyak", "Tidy books, on-time taxes, better sleep"),
          text: tr("Pembukuan bulanan, SPT, dan laporan untuk investor — dikerjakan akuntan bersertifikat untuk 420+ UMKM dan startup.", "Monthly bookkeeping, tax returns, and investor reports — by certified accountants for 420+ SMEs and startups."),
          btns: [[tr("Konsultasi gratis", "Free consultation"), href("contact")], [tr("Lihat paket", "See packages"), href("packages")]],
          image: "v2b-chart",
          alt: tr("Grafik keuangan", "Financial chart"),
          gradient: [NT.soft, "#ffffff", 180],
        }),
        logos(L, { title: tr("Dipercaya oleh", "Trusted by"), names: ["Kopi Lereng", "Batikita", "Rantai.id", "Klinik Prima", "Gudang Sayur"] }),
        statsBand(L.t, tr, { eyebrow: tr("Rekam jejak", "Track record"), title: tr("Sembilan tahun tanpa denda pajak klien", "Nine years without a client tax penalty"), text: tr("Angka per September 2026.", "Figures as of September 2026."), stats: [["420+", tr("Klien aktif", "Active clients")], ["0", tr("Denda keterlambatan", "Late penalties")], ["Rp2,1 T", tr("Omzet dikelola", "Revenue managed")], ["38", tr("Akuntan & konsultan", "Accountants & advisors")]] }),
        cards(L, {
          ey: tr("Layanan", "Services"),
          title: tr("Dari transaksi harian sampai laporan tahunan", "From daily transactions to annual reports"),
          items: [
            { icon: "📒", title: tr("Pembukuan", "Bookkeeping"), text: tr("Rekonsiliasi bank & laporan bulanan tanggal 10.", "Bank reconciliation & monthly report by the 10th."), link: [tr("Detail", "Details"), href("services")] },
            { icon: "🧾", title: tr("Pajak", "Tax"), text: tr("PPh 21, PPN, SPT Badan, dan pemeriksaan.", "Payroll tax, VAT, corporate returns, and audits."), link: [tr("Detail", "Details"), href("services")] },
            { icon: "📈", title: tr("CFO paruh waktu", "Fractional CFO"), text: tr("Proyeksi kas dan kesiapan pendanaan.", "Cash forecasting and fundraising readiness."), link: [tr("Detail", "Details"), href("services")] },
          ],
          bg: L.alt,
        }),
        ctaSplit(L, { title: tr("Musim SPT Tahunan dimulai Januari", "Annual tax season starts in January"), text: tr("Kuota klien baru tersisa 15 slot.", "15 new-client slots left."), btns: [[tr("Pesan slot", "Reserve a slot"), href("contact")]] }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Apa yang kami kerjakan", "What we do"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Layanan", "Services"), ""]] }),
        tabsSec(L, {
          title: tr("Rincian layanan", "Service details"),
          tabs: [
            [tr("Pembukuan", "Bookkeeping"), tr("Pencatatan transaksi di Jurnal/Accurate, rekonsiliasi bank & e-wallet, laporan laba rugi, neraca, dan arus kas bulanan.", "Transactions recorded in Jurnal/Accurate, bank & e-wallet reconciliation, monthly P&L, balance sheet, and cash flow.")],
            [tr("Pajak", "Tax"), tr("Perhitungan & pelaporan PPh 21/23/25/4(2), PPN, SPT Tahunan Badan & orang pribadi, pendampingan pemeriksaan.", "Calculation & filing of withholding taxes, VAT, corporate & personal annual returns, audit assistance.")],
            [tr("Payroll", "Payroll"), tr("Slip gaji, BPJS, THR, dan bukti potong untuk hingga 500 karyawan.", "Payslips, social security, holiday bonus, and withholding slips for up to 500 employees.")],
            [tr("CFO paruh waktu", "Fractional CFO"), tr("Anggaran, proyeksi kas 18 bulan, data room untuk investor.", "Budgets, 18-month cash forecasts, investor data rooms.")],
          ],
        }),
        steps(L, { title: tr("Mulai dalam 7 hari", "Onboard in 7 days"), items: [[tr("Diagnosis", "Diagnosis"), tr("Review dokumen 2 tahun terakhir.", "Review the last 2 years of documents.")], [tr("Penawaran", "Proposal"), tr("Biaya tetap, tanpa biaya tersembunyi.", "Fixed fee, no hidden costs.")], [tr("Migrasi", "Migration"), tr("Pindahkan data ke sistem kami.", "Move data into our system.")], [tr("Laporan pertama", "First report"), tr("Tanggal 10 bulan berikutnya.", "By the 10th of next month.")]], bg: L.alt }),
      ],
      packages: () => [
        priceSwitch(L, {
          ey: tr("Paket", "Packages"),
          title: tr("Biaya tetap per bulan", "Fixed monthly fees"),
          text: tr("Bayar tahunan, gratis 2 bulan.", "Pay yearly, get 2 months free."),
          monthly: tr("Bulanan", "Monthly"),
          yearly: tr("Tahunan", "Yearly"),
          save: tr("Hemat 2 bulan", "2 months free"),
          pm: tr("/bulan", "/month"),
          py: tr("/tahun", "/year"),
          href: href("contact"),
          plans: [
            tr("UMKM | Rp1,5jt | Rp15jt | ≤ 150 transaksi/bln; Laporan bulanan; SPT Tahunan | Pilih", "SME | Rp1.5m | Rp15m | ≤ 150 transactions/mo; Monthly report; Annual tax return | Choose"),
            tr("Bertumbuh | Rp3,5jt | Rp35jt | ≤ 600 transaksi/bln; Pajak bulanan lengkap; Payroll 25 orang; Rapat bulanan | Pilih", "Growth | Rp3.5m | Rp35m | ≤ 600 transactions/mo; Full monthly tax; Payroll for 25; Monthly meeting | Choose"),
            tr("Startup | Rp8jt | Rp80jt | Transaksi tanpa batas; CFO paruh waktu; Laporan investor; Due diligence | Hubungi kami", "Startup | Rp8m | Rp80m | Unlimited transactions; Fractional CFO; Investor reports; Due diligence | Contact us"),
          ],
        }),
        faqAccordion(L.t, tr, { items: [[tr("Bisa pakai software sendiri?", "Can we keep our software?"), tr("Bisa. Kami terbiasa dengan Jurnal, Accurate, Xero, dan Zahir.", "Yes. We work with Jurnal, Accurate, Xero, and Zahir.")], [tr("Ada kontrak minimal?", "Is there a minimum contract?"), tr("3 bulan untuk paket bulanan.", "3 months for monthly plans.")], [tr("Bagaimana dengan tunggakan pajak lama?", "What about past tax arrears?"), tr("Kami hitung terpisah setelah diagnosis.", "Quoted separately after diagnosis.")]] }),
      ],
      industries: () => [
        pageHead(L, { ey: tr("Industri", "Industries"), title: tr("Paham bisnis Anda, bukan hanya angkanya", "We know your business, not just its numbers"), dark: true }),
        cards(L, {
          cols: 3,
          items: [
            { icon: "☕", title: "F&B", text: tr("HPP per menu, stok bahan, dan PB1 restoran.", "Per-menu COGS, inventory, and restaurant tax.") },
            { icon: "🛒", title: "E-commerce", text: tr("Rekonsiliasi marketplace & payment gateway.", "Marketplace & payment gateway reconciliation.") },
            { icon: "🏥", title: tr("Klinik", "Clinics"), text: tr("Pendapatan BPJS dan jasa medis dokter.", "Insurance revenue and doctor fees.") },
            { icon: "💻", title: "SaaS", text: tr("Pengakuan pendapatan langganan (PSAK 72).", "Subscription revenue recognition.") },
            { icon: "🏗️", title: tr("Kontraktor", "Contractors"), text: tr("PPh final konstruksi & termin proyek.", "Final construction tax & project milestones.") },
            { icon: "🎓", title: tr("Yayasan", "Foundations"), text: tr("Laporan nirlaba ISAK 35.", "Non-profit reporting.") },
          ],
        }),
      ],
      team: () => [
        teamCards(L.t, tr, {
          eyebrow: tr("Tim", "Team"),
          title: tr("Partner & manajer", "Partners & managers"),
          text: tr("Bersertifikat CPA, BKP, dan CA.", "CPA, tax consultant, and CA certified."),
          members: [
            { name: "Hendra Tirtamas, CPA", role: tr("Managing Partner", "Managing Partner"), photo: asset("pro-team-1") },
            { name: "Lestari Anggun, BKP", role: tr("Partner Pajak", "Tax Partner"), photo: asset("v2b-face-6") },
            { name: "Yosef Marpaung, CA", role: tr("Manajer Audit", "Audit Manager"), photo: asset("v2b-face-3") },
            { name: "Putri Rahmadani", role: tr("Manajer Payroll", "Payroll Manager"), photo: asset("v2b-face-2") },
          ],
        }),
        quote(L, { text: tr("Kami menjelaskan angka dengan bahasa pemilik usaha, bukan bahasa auditor.", "We explain numbers in business-owner language, not auditor-speak."), name: "Hendra Tirtamas", role: "Managing Partner" }),
      ],
      insights: () => [
        pageHead(L, { ey: tr("Wawasan", "Insights"), title: tr("Catatan pajak & keuangan", "Tax & finance notes"), center: true }),
        imgCards(L, {
          items: [
            { image: "v2b-chart", meta: tr("Pajak · 12 Okt 2026", "Tax · Oct 12, 2026"), title: tr("PPh Final 0,5% UMKM berakhir: apa selanjutnya?", "The 0.5% SME final tax ends: what's next?"), text: tr("Simulasi beban pajak setelah masa berlaku habis.", "Simulating your tax burden after it expires."), link: [tr("Baca", "Read"), href("article")] },
            { image: "v2b-chart-dark", meta: tr("Startup · 2 Okt 2026", "Startup · Oct 2, 2026"), title: tr("Menyiapkan data room seri A", "Preparing a Series A data room"), text: tr("18 dokumen yang selalu diminta investor.", "18 documents investors always ask for."), link: [tr("Baca", "Read"), href("article")] },
            { image: "v2b-books", meta: tr("Payroll · 20 Sep 2026", "Payroll · Sep 20, 2026"), title: tr("Menghitung THR karyawan kontrak", "Calculating holiday bonus for contract staff"), text: tr("Rumus pro-rata dan contoh kasus.", "Pro-rata formula and examples."), link: [tr("Baca", "Read"), href("article")] },
          ],
        }),
        newsletter(L, { title: tr("Kalender pajak bulanan", "Monthly tax calendar"), text: tr("Tenggat setor & lapor dikirim tiap tanggal 1.", "Payment & filing deadlines sent on the 1st."), ph: "email@perusahaan.com", btn: tr("Kirimi saya", "Send it to me") }),
      ],
      article: () => [
        ...article(L, {
          meta: tr("Pajak · 12 Oktober 2026 · 7 menit", "Tax · October 12, 2026 · 7 min"),
          title: tr("PPh Final 0,5% UMKM berakhir: apa selanjutnya?", "The 0.5% SME final tax ends: what's next?"),
          lead: tr("Bagi wajib pajak badan yang memakai tarif final sejak 2022, tahun pajak 2026 adalah tahun terakhir.", "For companies on the final rate since 2022, the 2026 tax year is the last one."),
          image: "v2b-chart",
          author: ["Lestari Anggun, BKP", tr("Partner Pajak", "Tax Partner"), "v2b-face-6"],
          body: [
            tr("Mulai tahun pajak berikutnya, perusahaan wajib menghitung PPh dengan tarif umum Pasal 17 atas laba bersih, bukan omzet.", "From the next tax year, companies must compute income tax at the general rate on net profit, not revenue."),
            tr("Artinya pembukuan yang rapi bukan lagi pilihan: biaya yang tidak tercatat tidak bisa menjadi pengurang.", "That means tidy books are no longer optional: unrecorded costs can't be deducted."),
            tr("Untuk usaha dengan margin tipis, tarif umum justru bisa lebih ringan. Untuk usaha bermargin tinggi, sebaliknya.", "For thin-margin businesses the general rate may actually be lighter. For high-margin ones, the opposite."),
            tr("Hubungi kami untuk simulasi berdasarkan laporan keuangan Anda sendiri.", "Contact us for a simulation based on your own financial statements."),
          ],
          pull: tr("Biaya yang tidak tercatat tidak bisa menjadi pengurang pajak.", "Unrecorded costs cannot reduce your tax."),
          sub: tr("Tiga hal yang perlu disiapkan", "Three things to prepare"),
          list: [tr("Rapikan bukti biaya sejak Januari", "Organize expense receipts from January"), tr("Pisahkan rekening pribadi & usaha", "Separate personal & business accounts"), tr("Hitung ulang harga jual", "Recalculate your pricing")],
          tags: [tr("Pajak", "Tax"), "UMKM", "PPh"],
        }),
        ctaSplit(L, { title: tr("Butuh simulasi untuk usaha Anda?", "Need a simulation for your business?"), text: tr("Gratis 30 menit bersama konsultan pajak.", "Free 30 minutes with a tax advisor."), btns: [[tr("Jadwalkan", "Schedule"), href("contact")]] }),
      ],
      contact: () => [
        pageHead(L, { ey: tr("Kontak", "Contact"), title: tr("Konsultasi awal gratis", "Free initial consultation"), center: true }),
        formSec(L, { title: tr("Ceritakan kebutuhan Anda", "Tell us what you need"), info: [[tr("Kantor", "Office"), "Menara Kuningan Lt. 11, Jakarta"], [tr("Telepon", "Phone"), "021 5290 1188"], ["Email", "halo@neraca-tirtamas.example"]], fields: [{ k: "input", label: tr("Nama perusahaan", "Company name"), ph: "PT Contoh Maju" }, { k: "select", label: tr("Omzet tahunan", "Annual revenue"), ph: tr("Pilih", "Choose"), options: ["< Rp4,8 M", "Rp4,8–50 M", "> Rp50 M"] }, { k: "select", label: tr("Kebutuhan", "Need"), ph: tr("Pilih", "Choose"), options: [tr("Pembukuan", "Bookkeeping"), tr("Pajak", "Tax"), "Payroll", tr("CFO paruh waktu", "Fractional CFO")] }, { k: "date", label: tr("Jadwal konsultasi", "Consultation slot"), mode: "datetime-local" }], submit: tr("Kirim", "Submit") }),
        quote(L, { text: tr("Sejak pindah ke Neraca Tirtamas, laporan bulanan kami selalu siap sebelum rapat direksi.", "Since moving to Neraca Tirtamas, our monthly report is always ready before the board meeting."), name: "Fikri Ramadhan", role: "CEO, Rantai.id", bg: L.alt }),
      ],
    });
  },
};
