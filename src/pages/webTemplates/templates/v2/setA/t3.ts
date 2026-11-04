import { asset } from "../../../assets";
import { linkButton, type Palette } from "../../../build";
import { ctaBand, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent } from "../../../types";
import { footer, header } from "../../pro/kit";
import {
  FONTS,
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
  listings,
  logos,
  look,
  menuBoard,
  page,
  pageBanner,
  people,
  pg,
  plans,
  posts,
  priceSwitch,
  process,
  progressBars,
  quotes,
  slider,
  stars,
  story,
  tableBlock,
  tabsBlock,
  timeline,
  typer,
} from "./kitA";

/* ================================================================== */
/* Template v2 A11–A15: PAUD, Klinik Hewan, Pertanian, Logistik, Gaming. */
/* ================================================================== */

/* ------------------- 11. Taman Ceria Pelangi (6 hlm) ----------------- */

const TC: Palette = { ink: "#1e3a8a", muted: "#475569", primary: "#f97316", primaryDark: "#ea580c", soft: "#fff7ed", line: "#fed7aa" };
const tc = look(TC, { bg: "#ffffff", alt: "#fefce8", dark: "#1e3a8a", radius: 28, headFont: FONTS.rounded, font: FONTS.rounded });

export const kidsPreschool: TemplateContent = {
  brand: "Taman Ceria Pelangi",
  pages: [home(), pg("program", ["program", "Program"], ["programs", "Programs"]), pg("day", ["kegiatan-harian", "Kegiatan Harian"], ["daily-routine", "Daily Routine"]), pg("teachers", ["guru", "Guru"], ["teachers", "Teachers"]), pg("fees", ["biaya", "Biaya"], ["fees", "Fees"]), pg("enrol", ["pendaftaran", "Pendaftaran"], ["enrolment", "Enrolment"])],
  build: (key, tr, href) => {
    const head = headerLeft("Ceria Pelangi", tc, { cta: linkButton(tr("Jadwalkan kunjungan", "Book a visit"), href("enrol"), "primary", TC) });
    const end = footer(
      "Taman Ceria Pelangi",
      tr("PAUD & TK berbasis bermain, terakreditasi A. Usia 2–6 tahun.", "Play-based preschool & kindergarten, A-accredited. Ages 2–6."),
      [
        { title: tr("Sekolah", "School"), items: [tr("Program", "Programs"), tr("Kegiatan harian", "Daily routine"), tr("Biaya", "Fees")] },
        { title: tr("Kunjungi", "Visit"), items: ["Jl. Kenanga 5, Depok", "+62 21 7720 3300", tr("Sen–Jum 07.00–15.00", "Mon–Fri 7am–3pm")] },
      ],
      tr("© 2026 Taman Ceria Pelangi. Konten contoh.", "© 2026 Taman Ceria Pelangi. Sample content."),
      "#1e3a8a",
    );
    switch (key) {
      case "program":
        return page(tc, [
          head,
          pageBanner(tc, { eyebrow: tr("Program", "Programs"), title: tr("Belajar lewat bermain", "Learning through play"), text: tr("Kurikulum Merdeka dipadukan pendekatan Montessori dan proyek alam.", "The national curriculum blended with Montessori and nature projects."), bg: "#fefce8", align: "center" }),
          tabsBlock(tc, {
            title: tr("Kelas menurut usia", "Classes by age"),
            variant: "pills",
            tabs: [
              [tr("Kelompok Bermain (2–3 th)", "Playgroup (2–3 yrs)"), tr("3 hari/minggu, 08.00–10.30. Fokus motorik kasar, bahasa, dan kemandirian makan.", "3 days/week, 8–10:30am. Focus on gross motor skills, language, and eating independently.")],
              [tr("TK A (4–5 th)", "Kindergarten A (4–5 yrs)"), tr("5 hari/minggu, 07.30–11.30. Pra-membaca, berhitung konkret, proyek kebun.", "5 days/week, 7:30–11:30am. Pre-reading, hands-on math, garden projects.")],
              [tr("TK B (5–6 th)", "Kindergarten B (5–6 yrs)"), tr("5 hari/minggu, 07.30–12.00. Persiapan SD tanpa calistung paksa.", "5 days/week, 7:30am–noon. Primary school readiness without pressure.")],
              [tr("Daycare", "Daycare"), tr("Hingga 17.00 dengan makan siang dan tidur siang.", "Until 5pm with lunch and nap time.")],
            ],
          }),
          story(tc, {
            eyebrow: tr("Pendekatan", "Approach"),
            title: tr("Anak memimpin, guru menemani", "Children lead, teachers guide"),
            paras: [tr("Setiap anak punya portofolio karya yang dibagikan ke orang tua tiap bulan. Tidak ada PR dan tidak ada peringkat.", "Each child has a portfolio shared with parents monthly. No homework and no rankings.")],
            bullets: [tr("Rasio guru 1:8", "1:8 teacher ratio"), tr("Kebun sayur & kolam ikan", "Vegetable garden & fish pond"), tr("Kelas bahasa Inggris lewat lagu", "English through songs")],
            image: asset("v2a-kids-play"),
            alt: tr("Balok mainan", "Toy blocks"),
          }),
          end,
        ]);
      case "day":
        return page(tc, [
          head,
          timeline(tc, {
            eyebrow: tr("Kegiatan harian TK", "Kindergarten day"),
            title: tr("Satu hari di Ceria Pelangi", "A day at Ceria Pelangi"),
            steps: [
              ["07.30", tr("Penyambutan & sarapan sehat", "Welcome & healthy breakfast"), tr("Bubur kacang hijau atau roti gandum.", "Mung bean porridge or wholewheat toast.")],
              ["08.15", tr("Lingkaran pagi", "Morning circle"), tr("Bernyanyi, cerita, dan berbagi kabar.", "Singing, stories, and sharing news.")],
              ["09.00", tr("Sentra main", "Play centers"), tr("Balok, seni, sains, dan peran.", "Blocks, art, science, and role play.")],
              ["10.15", tr("Main di luar", "Outdoor play"), tr("Kebun, pasir, dan kolam ikan.", "Garden, sandpit, and fish pond.")],
              ["11.00", tr("Membaca bersama", "Story time"), tr("Buku bergambar dwibahasa.", "Bilingual picture books.")],
              ["11.30", tr("Pulang / daycare", "Home time / daycare"), tr("Anak daycare makan siang dan tidur siang.", "Daycare kids have lunch and nap.")],
            ],
          }),
          gallery(tc, { title: tr("Momen minggu ini", "This week's moments"), images: [[asset("v2a-kids-hero"), tr("Menara balok", "Block tower")], [asset("v2a-kids-play"), tr("Panen bayam", "Spinach harvest")], [asset("v2a-kids-hero"), tr("Hari batik", "Batik day")]], bg: tc.alt }),
          end,
        ]);
      case "teachers":
        return page(tc, [
          head,
          people(tc, {
            eyebrow: tr("Guru", "Teachers"),
            title: tr("Sabar, hangat, dan terlatih", "Patient, warm, and trained"),
            text: tr("Semua guru lulusan PG-PAUD dan bersertifikat P3K anak.", "All teachers hold early childhood degrees and pediatric first aid certificates."),
            round: true,
            items: [
              { name: "Bu Ratna", role: tr("Kepala sekolah", "Principal"), photo: asset("v2a-face-6"), text: tr("22 tahun mengajar.", "22 years teaching.") },
              { name: "Bu Fitri", role: tr("Wali TK B", "Kindergarten B"), photo: asset("v2a-face-3"), text: tr("Spesialis literasi awal.", "Early literacy specialist.") },
              { name: "Pak Dimas", role: tr("Guru olahraga & musik", "PE & music"), photo: asset("v2a-face-2"), text: tr("Pemain gitar dan pelatih futsal anak.", "Guitarist and kids' futsal coach.") },
              { name: "Miss Anna", role: tr("Bahasa Inggris", "English"), photo: asset("v2a-face-5"), text: tr("Belajar lewat lagu & permainan.", "Learning with songs & games.") },
            ],
          }),
          figures(tc, { items: [["1:8", tr("Rasio guru-anak", "Teacher-child ratio")], ["12", tr("Guru & pendamping", "Teachers & aides")], ["A", tr("Akreditasi BAN PAUD", "National accreditation")]], bg: tc.alt }),
          end,
        ]);
      case "fees":
        return page(tc, [
          head,
          tableBlock(tc, {
            eyebrow: tr("Tahun ajaran 2027/2028", "2027/2028 school year"),
            title: tr("Biaya sekolah", "School fees"),
            columns: [tr("Program", "Program"), tr("Uang pangkal", "Joining fee"), tr("SPP / bulan", "Monthly fee")],
            rows: [
              [tr("Kelompok Bermain", "Playgroup"), "Rp3.500.000", "Rp850.000"],
              ["TK A", "Rp5.000.000", "Rp1.200.000"],
              ["TK B", "Rp5.000.000", "Rp1.200.000"],
              [tr("Daycare (tambahan)", "Daycare (add-on)"), "—", "Rp1.000.000"],
            ],
            note: tr("Diskon 10% uang pangkal untuk saudara kandung.", "10% joining-fee discount for siblings."),
          }),
          plans(tc, {
            title: tr("Paket daycare", "Daycare packages"),
            bg: tc.alt,
            items: [
              { plan: tr("Setengah hari", "Half day"), price: "Rp600rb", period: tr("/bulan", "/month"), description: tr("Hingga 13.00.", "Until 1pm."), features: [tr("Makan siang", "Lunch"), tr("Tidur siang", "Nap time")], buttonText: tr("Daftar", "Enrol"), buttonHref: href("enrol") },
              { plan: tr("Sehari penuh", "Full day"), price: "Rp1jt", period: tr("/bulan", "/month"), description: tr("Hingga 17.00.", "Until 5pm."), features: [tr("Makan siang & snack", "Lunch & snack"), tr("Tidur siang", "Nap time"), tr("Kegiatan sore", "Afternoon activities")], buttonText: tr("Daftar", "Enrol"), buttonHref: href("enrol"), featured: true, badge: tr("Favorit orang tua", "Parents' pick") },
            ],
          }),
          faqList(tc, {
            title: tr("Pertanyaan orang tua", "Parent questions"),
            items: [
              [tr("Apakah ada antar-jemput?", "Is there a school bus?"), tr("Ya, radius 5 km, Rp450 ribu/bulan.", "Yes, within 5 km, Rp450k/month.")],
              [tr("Bagaimana jika anak belum lepas popok?", "What if my child isn't potty-trained?"), tr("Tidak masalah untuk Kelompok Bermain; kami bantu toilet training.", "No problem for Playgroup; we help with toilet training.")],
            ],
          }),
          end,
        ]);
      case "enrol":
        return page(tc, [
          head,
          process(tc, {
            eyebrow: tr("Pendaftaran", "Enrolment"),
            title: tr("Empat langkah mudah", "Four easy steps"),
            steps: [
              [tr("Kunjungan", "Visit"), tr("Tur sekolah 30 menit bersama anak.", "A 30-minute tour with your child.")],
              [tr("Trial class", "Trial class"), tr("Anak ikut kelas satu pagi.", "Your child joins class for a morning.")],
              [tr("Formulir", "Form"), tr("Akta lahir & kartu imunisasi.", "Birth certificate & immunization card.")],
              [tr("Mulai sekolah", "Start school"), tr("Masa adaptasi 2 minggu.", "A 2-week settling-in period.")],
            ],
          }),
          contact(tc, {
            eyebrow: tr("Jadwalkan kunjungan", "Book a visit"),
            title: tr("Ajak si kecil melihat sekolah", "Bring your little one to see us"),
            info: [[tr("Alamat", "Address"), "Jl. Kenanga 5, Depok"], ["WhatsApp", "+62 812 7720 3300"]],
            fields: [
              { kind: "input", label: tr("Nama orang tua", "Parent's name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Nama anak", "Child's name"), ph: "Kirana" },
              { kind: "date", label: tr("Tanggal lahir anak", "Child's date of birth") },
              { kind: "select", label: tr("Program", "Program"), ph: tr("Pilih program", "Choose a program"), options: [tr("Kelompok Bermain", "Playgroup"), "TK A", "TK B", "Daycare"] },
              { kind: "date", label: tr("Tanggal kunjungan", "Visit date") },
            ],
            submit: tr("Kirim", "Send"),
            bg: tc.alt,
          }),
          end,
        ]);
      default:
        return page(tc, [
          head,
          heroSplit(tc, {
            badge: tr("Pendaftaran 2027/2028 dibuka", "2027/2028 enrolment open"),
            title: tr("Tempat bermain, tumbuh, dan bertanya", "A place to play, grow, and wonder"),
            text: tr("PAUD & TK di Depok dengan kebun sayur, kelas kecil, dan guru yang mengenal setiap anak.", "A preschool in Depok with a vegetable garden, small classes, and teachers who know every child."),
            actions: [[tr("Jadwalkan kunjungan", "Book a visit"), href("enrol")], [tr("Lihat program", "See programs"), href("program"), "outline"]],
            image: asset("v2a-kids-hero"),
            alt: tr("Balok ABC", "ABC blocks"),
            gradient: ["#fefce8", "#ffffff", 180],
            extra: [stars(tc, 4.9, tr("dari 310 ulasan orang tua", "from 310 parent reviews"))],
          }),
          cards(tc, {
            title: tr("Kenapa orang tua memilih kami", "Why parents choose us"),
            cols: 4,
            items: [
              { icon: "🌱", title: tr("Kebun sendiri", "Our own garden"), text: tr("Anak menanam dan memanen sayur.", "Kids plant and harvest vegetables.") },
              { icon: "👩‍🏫", title: tr("Kelas kecil", "Small classes"), text: tr("Maksimal 16 anak, 2 guru.", "Max 16 kids, 2 teachers.") },
              { icon: "🍎", title: tr("Makanan sehat", "Healthy food"), text: tr("Menu ahli gizi, tanpa gula tambahan.", "Nutritionist menus, no added sugar.") },
              { icon: "📸", title: tr("Laporan harian", "Daily updates"), text: tr("Foto & catatan lewat aplikasi.", "Photos & notes via the app.") },
            ],
          }),
          quotes(tc, {
            title: tr("Cerita orang tua", "Parent stories"),
            bg: tc.alt,
            items: [
              { quote: tr("Anak saya yang pemalu sekarang suka bercerita soal kebun di rumah.", "My shy daughter now loves telling us about the garden."), author: "Ibu Wulan", role: tr("Orang tua TK A", "Kindergarten A parent"), avatar: asset("v2a-face-3") },
              { quote: tr("Laporan foto harian membuat saya tenang di kantor.", "Daily photo updates keep me calm at work."), author: "Pak Andika", role: tr("Orang tua daycare", "Daycare parent"), avatar: asset("v2a-face-4") },
              { quote: tr("Guru-gurunya sangat sabar saat masa adaptasi.", "Teachers were so patient during settling in."), author: "Ibu Meiliana", role: tr("Orang tua KB", "Playgroup parent"), avatar: asset("v2a-face-5") },
            ],
          }),
          ctaBox(tc, { title: tr("Trial class gratis setiap Sabtu", "Free trial class every Saturday"), text: tr("Kuota 8 anak per sesi.", "8 kids per session."), actions: [[tr("Daftar trial", "Book a trial"), href("enrol"), "light"]], align: "center", bg: TC.primary }),
          end,
        ]);
    }
  },
};

/* ------------------- 12. Klinik Hewan Sahabat Bulu (5 hlm) ----------- */

const SB: Palette = { ink: "#064e3b", muted: "#4b6b5f", primary: "#059669", primaryDark: "#047857", soft: "#ecfdf5", line: "#a7f3d0" };
const sb = look(SB, { bg: "#ffffff", alt: "#f0fdf4", dark: "#064e3b", radius: 18, headFont: FONTS.rounded, font: FONTS.sans });

export const petsVetSahabat: TemplateContent = {
  brand: "Klinik Hewan Sahabat Bulu",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("grooming", ["grooming", "Grooming"], ["grooming", "Grooming"]), pg("vets", ["dokter", "Dokter"], ["vets", "Our Vets"]), pg("booking", ["janji-temu", "Janji Temu"], ["appointments", "Appointments"])],
  build: (key, tr, href) => {
    const head = headerBar("Sahabat Bulu", sb, {
      info: [tr("🚑 IGD hewan 24 jam: +62 811 1900 2424", "🚑 24-hour pet ER: +62 811 1900 2424"), tr("Jl. Wijaya I No. 30, Jakarta", "30 Wijaya I St., Jakarta")],
      cta: linkButton(tr("Buat janji", "Book a visit"), href("booking"), "primary", SB),
    });
    const end = footerSlim(sb, "Sahabat Bulu", [tr("Layanan", "Services"), "Grooming", tr("Dokter", "Vets"), "Instagram"], tr("© 2026 Klinik Hewan Sahabat Bulu", "© 2026 Sahabat Bulu Vet Clinic"), { bg: "#064e3b" });
    switch (key) {
      case "services":
        return page(sb, [
          head,
          pageBanner(sb, { eyebrow: tr("Layanan medis", "Medical services"), title: tr("Untuk anjing, kucing, dan hewan eksotis", "For dogs, cats, and exotic pets"), text: tr("Laboratorium, rontgen digital, dan rawat inap di satu tempat.", "Lab, digital X-ray, and inpatient care in one place.") }),
          tabsBlock(sb, {
            title: tr("Pilih hewan Anda", "Choose your pet"),
            variant: "boxed",
            tabs: [
              [tr("Anjing", "Dogs"), tr("Vaksin DHPPi & rabies, sterilisasi, operasi ortopedi, dan perawatan gigi.", "DHPPi & rabies vaccines, spaying/neutering, orthopedic surgery, and dental care.")],
              [tr("Kucing", "Cats"), tr("Vaksin tricat, tes FIV/FeLV, penanganan scabies dan jamur.", "Tricat vaccines, FIV/FeLV testing, scabies and fungal treatment.")],
              [tr("Eksotis", "Exotics"), tr("Kelinci, hamster, burung, dan reptil oleh dokter khusus eksotis.", "Rabbits, hamsters, birds, and reptiles by an exotics vet.")],
            ],
          }),
          process(sb, {
            title: tr("Alur kunjungan", "Your visit"),
            steps: [
              [tr("Daftar", "Check in"), tr("Bawa buku vaksin.", "Bring the vaccine book.")],
              [tr("Pemeriksaan", "Exam"), tr("Suhu, berat, jantung.", "Temperature, weight, heart.")],
              [tr("Diagnosis", "Diagnosis"), tr("Lab bila perlu, hasil 1 jam.", "Lab if needed, 1-hour results.")],
              [tr("Perawatan", "Treatment"), tr("Rencana tertulis & kontrol.", "Written plan & follow-up.")],
            ],
          }),
          end,
        ]);
      case "grooming":
        return page(sb, [
          head,
          pricingCards(sb, tr, {
            eyebrow: "Grooming",
            title: tr("Wangi, rapi, dan tidak stres", "Clean, tidy, and stress-free"),
            text: tr("Harga untuk anjing/kucing di bawah 10 kg.", "Prices for dogs/cats under 10 kg."),
            badge: tr("Terlaris", "Best seller"),
            plans: [
              { name: tr("Mandi Sehat", "Basic Bath"), price: "Rp95rb", period: "", text: tr("Untuk perawatan rutin.", "For routine care."), features: [tr("Sampo hipoalergenik", "Hypoallergenic shampoo"), tr("Potong kuku", "Nail trim"), tr("Bersih telinga", "Ear cleaning")], cta: { label: tr("Pesan", "Book"), href: href("booking") } },
              { name: tr("Grooming Lengkap", "Full Groom"), price: "Rp185rb", period: "", text: tr("Termasuk potong bulu.", "Includes a haircut."), features: [tr("Semua Mandi Sehat", "Everything in Basic"), tr("Potong & styling bulu", "Haircut & styling"), tr("Sikat gigi", "Tooth brushing")], cta: { label: tr("Pesan", "Book"), href: href("booking") }, featured: true },
              { name: tr("Mandi Kutu", "Flea Bath"), price: "Rp150rb", period: "", text: tr("Untuk kutu & jamur.", "For fleas & fungus."), features: [tr("Sampo medis", "Medicated shampoo"), tr("Cek dokter singkat", "Quick vet check")], cta: { label: tr("Pesan", "Book"), href: href("booking") } },
            ],
          }),
          menuBoard(sb, {
            title: tr("Tambahan", "Add-ons"),
            cols: 2,
            groups: [
              { title: tr("Ukuran", "Size"), items: [[tr("10–20 kg", "10–20 kg"), tr("Tambahan per layanan", "Extra per service"), "+Rp50rb"], [tr("Di atas 20 kg", "Over 20 kg"), tr("Tambahan per layanan", "Extra per service"), "+Rp100rb"]] },
              { title: tr("Perawatan", "Treatments"), items: [[tr("Masker bulu", "Coat mask"), tr("Untuk bulu kusut", "For matted coats"), "Rp40rb"], [tr("Antar-jemput", "Pick-up & drop-off"), tr("Radius 5 km", "Within 5 km"), "Rp35rb"]] },
            ],
          }),
          end,
        ]);
      case "vets":
        return page(sb, [
          head,
          teamCards(sb, tr, {
            eyebrow: tr("Dokter hewan", "Veterinarians"),
            title: tr("Dokter yang sayang hewan", "Vets who love animals"),
            members: [
              { name: "drh. Sinta Maharani", role: tr("Penyakit dalam", "Internal medicine"), photo: asset("v2a-face-3") },
              { name: "drh. Bayu Aji", role: tr("Bedah & ortopedi", "Surgery & orthopedics"), photo: asset("v2a-face-2") },
              { name: "drh. Lia Kurnia", role: tr("Hewan eksotis", "Exotic pets"), photo: asset("v2a-face-5") },
              { name: "drh. Rangga Putra", role: tr("IGD malam", "Night ER"), photo: asset("v2a-face-4") },
            ],
          }),
          tableBlock(sb, {
            title: tr("Jadwal praktik", "Clinic schedule"),
            columns: [tr("Dokter", "Vet"), tr("Sen–Jum", "Mon–Fri"), tr("Sabtu", "Saturday"), tr("Minggu", "Sunday")],
            rows: [["drh. Sinta", "09.00–15.00", "09.00–12.00", "—"], ["drh. Bayu", "13.00–20.00", "—", "10.00–14.00"], ["drh. Lia", tr("Selasa & Kamis 10.00–16.00", "Tue & Thu 10am–4pm"), "10.00–14.00", "—"], ["drh. Rangga", "20.00–08.00", "20.00–08.00", "20.00–08.00"]],
            bg: sb.alt,
          }),
          end,
        ]);
      case "booking":
        return page(sb, [
          head,
          contact(sb, {
            eyebrow: tr("Janji temu", "Appointments"),
            title: tr("Datang sesuai jam, tanpa antre", "Come on time, skip the wait"),
            text: tr("Untuk kondisi darurat, langsung datang atau telepon IGD.", "For emergencies, come straight in or call the ER."),
            info: [[tr("IGD 24 jam", "24-hour ER"), "+62 811 1900 2424"], [tr("Alamat", "Address"), "Jl. Wijaya I No. 30, Jakarta Selatan"]],
            fields: [
              { kind: "input", label: tr("Nama pemilik", "Owner's name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Nama hewan", "Pet's name"), ph: "Mochi" },
              { kind: "select", label: tr("Jenis hewan", "Species"), ph: tr("Pilih", "Choose"), options: [tr("Anjing", "Dog"), tr("Kucing", "Cat"), tr("Kelinci", "Rabbit"), tr("Lainnya", "Other")] },
              { kind: "select", label: tr("Keperluan", "Reason"), ph: tr("Pilih", "Choose"), options: [tr("Vaksin", "Vaccination"), tr("Sakit", "Illness"), "Grooming", tr("Sterilisasi", "Spay/neuter")] },
              { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            ],
            submit: tr("Buat janji", "Book appointment"),
          }),
          faqList(sb, {
            title: tr("Pertanyaan umum", "Common questions"),
            items: [
              [tr("Kapan anak kucing divaksin?", "When should kittens be vaccinated?"), tr("Mulai usia 8 minggu, diulang 3–4 minggu kemudian.", "From 8 weeks, repeated 3–4 weeks later.")],
              [tr("Perlu puasa sebelum steril?", "Fasting before spaying?"), tr("Ya, puasa makan 8 jam dan minum 2 jam.", "Yes: no food for 8 hours, no water for 2.")],
            ],
          }),
          end,
        ]);
      default:
        return page(sb, [
          head,
          heroSplit(sb, {
            eyebrow: tr("Klinik hewan · Kebayoran Baru", "Vet clinic · Kebayoran Baru"),
            title: tr("Dokter yang menenangkan, untuk sahabat berbulu Anda", "Calming vets for your furry friends"),
            text: tr("Pemeriksaan, vaksin, operasi, grooming, dan IGD 24 jam. Ruang tunggu anjing dan kucing terpisah agar semua tetap tenang.", "Checkups, vaccines, surgery, grooming, and a 24-hour ER. Separate dog and cat waiting rooms keep everyone calm."),
            actions: [[tr("Buat janji", "Book a visit"), href("booking")], [tr("Layanan", "Services"), href("services"), "outline"]],
            image: asset("v2a-pet-hero"),
            alt: tr("Jejak kaki hewan", "Paw prints"),
            reverse: true,
          }),
          statsBand(sb, tr, {
            eyebrow: tr("Sejak 2011", "Since 2011"),
            title: tr("Ribuan pasien berekor", "Thousands of tailed patients"),
            text: tr("Data klinik 2025.", "2025 clinic data."),
            stats: [["18.000+", tr("Pasien terdaftar", "Registered patients")], ["24/7", tr("IGD hewan", "Pet ER")], ["6", tr("Dokter hewan", "Vets")], ["4,9★", tr("Rating Google", "Google rating")]],
          }),
          cards(sb, {
            title: tr("Layanan utama", "Core services"),
            items: [
              { icon: "💉", title: tr("Vaksin & cek rutin", "Vaccines & checkups"), text: tr("Kartu vaksin digital otomatis mengingatkan jadwal.", "Digital vaccine cards remind you automatically.") },
              { icon: "🩺", title: tr("Operasi", "Surgery"), text: tr("Ruang operasi steril dan monitor anestesi.", "Sterile theater and anesthesia monitoring.") },
              { icon: "🛁", title: "Grooming", text: tr("Groomer bersertifikat, sampo hipoalergenik.", "Certified groomers, hypoallergenic shampoos.") },
            ],
          }),
          ctaBand(sb, tr, { title: tr("Vaksin rabies gratis setiap Sabtu pertama", "Free rabies shots every first Saturday"), text: tr("Kuota 50 hewan, daftar dulu.", "50 pets per day, register first."), primary: { label: tr("Daftar", "Register"), href: href("booking") }, secondary: { label: "Grooming", href: href("grooming") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 13. Tani Makmur Nusantara (5 hlm) --------------- */

const TM: Palette = { ink: "#1a2e05", muted: "#4d5b3a", primary: "#4d7c0f", primaryDark: "#3f6212", soft: "#f7fee7", line: "#d9f99d" };
const tm = look(TM, { bg: "#fffdf7", alt: "#f7f3e8", dark: "#1a2e05", radius: 12, headFont: FONTS.serif, font: FONTS.sans, page: "#fffdf7" });

export const agriTani: TemplateContent = {
  brand: "Tani Makmur Nusantara",
  pages: [home(), pg("produce", ["hasil-panen", "Hasil Panen"], ["produce", "Produce"]), pg("farmers", ["kemitraan", "Kemitraan Petani"], ["farmer-partners", "Farmer Partners"]), pg("process", ["dari-ladang", "Dari Ladang"], ["farm-to-table", "Farm to Table"]), pg("order", ["pesan-grosir", "Pesan Grosir"], ["wholesale", "Wholesale"])],
  build: (key, tr, href) => {
    const head = header("Tani Makmur", TM, { bg: "#fffdf7", font: FONTS.serif, cta: linkButton(tr("Pesan grosir", "Order wholesale"), href("order"), "primary", TM) });
    const end = footer(
      "Koperasi Tani Makmur Nusantara",
      tr("Koperasi 1.400 petani di Jawa Barat & Sumatra Utara.", "A cooperative of 1,400 farmers in West Java & North Sumatra."),
      [
        { title: tr("Produk", "Produce"), items: [tr("Beras organik", "Organic rice"), tr("Kopi arabika", "Arabica coffee"), tr("Sayur dataran tinggi", "Highland vegetables")] },
        { title: tr("Kantor", "Office"), items: ["Jl. Raya Lembang 88, Bandung Barat", "+62 22 278 4400"] },
      ],
      tr("© 2026 Koperasi Tani Makmur Nusantara. Data contoh.", "© 2026 Tani Makmur Nusantara Cooperative. Sample data."),
      "#1a2e05",
    );
    switch (key) {
      case "produce":
        return page(tm, [
          head,
          pageBanner(tm, { eyebrow: tr("Hasil panen", "Produce"), title: tr("Dipanen pagi, dikirim sore", "Picked in the morning, shipped by evening"), text: tr("Harga grosir per kg, minimum pemesanan 50 kg per produk.", "Wholesale price per kg, 50 kg minimum per product.") }),
          listings(tm, {
            title: tr("Komoditas tersedia", "Available produce"),
            items: [
              { image: asset("v2a-agri-harvest"), title: tr("Beras Pandan Wangi Organik", "Organic Pandan Wangi Rice"), text: tr("Cianjur · sertifikat organik", "Cianjur · certified organic"), price: "Rp16.500/kg", cta: tr("Pesan", "Order"), href: href("order") },
              { image: asset("v2a-agri-hero"), title: tr("Kopi Arabika Gayo (green bean)", "Gayo Arabica (green bean)"), text: tr("Grade 1 · proses semi-washed", "Grade 1 · semi-washed"), price: "Rp118.000/kg", badge: tr("Ekspor", "Export grade"), cta: tr("Pesan", "Order"), href: href("order") },
              { image: asset("v2a-agri-harvest"), title: tr("Kentang Granola", "Granola Potatoes"), text: tr("Pangalengan · ukuran AB", "Pangalengan · AB size"), price: "Rp11.000/kg", cta: tr("Pesan", "Order"), href: href("order") },
              { image: asset("v2a-agri-hero"), title: tr("Cabai Merah Keriting", "Curly Red Chili"), text: tr("Garut · panen mingguan", "Garut · weekly harvest"), price: "Rp32.000/kg", cta: tr("Pesan", "Order"), href: href("order") },
              { image: asset("v2a-agri-harvest"), title: tr("Bawang Merah Brebes", "Brebes Shallots"), text: tr("Kering eskip", "Dry-cured"), price: "Rp28.000/kg", cta: tr("Pesan", "Order"), href: href("order") },
              { image: asset("v2a-agri-hero"), title: tr("Tomat Beef", "Beef Tomatoes"), text: tr("Lembang · greenhouse", "Lembang · greenhouse"), price: "Rp14.000/kg", cta: tr("Pesan", "Order"), href: href("order") },
            ],
          }),
          tableBlock(tm, {
            title: tr("Kalender panen", "Harvest calendar"),
            columns: [tr("Komoditas", "Crop"), tr("Jan–Apr", "Jan–Apr"), tr("Mei–Agu", "May–Aug"), tr("Sep–Des", "Sep–Dec")],
            rows: [[tr("Beras", "Rice"), tr("Panen raya", "Main harvest"), tr("Gadu", "Dry season"), tr("Tanam", "Planting")], [tr("Kopi", "Coffee"), "—", tr("Panen", "Harvest"), tr("Panen akhir", "Late harvest")], [tr("Sayur", "Vegetables"), tr("Sepanjang tahun", "Year-round"), tr("Sepanjang tahun", "Year-round"), tr("Sepanjang tahun", "Year-round")]],
            bg: tm.alt,
          }),
          end,
        ]);
      case "farmers":
        return page(tm, [
          head,
          story(tm, {
            eyebrow: tr("Kemitraan", "Partnership"),
            title: tr("Petani mendapat harga yang adil", "Farmers get a fair price"),
            paras: [tr("Kami membeli dengan harga kontrak di atas harga tengkulak dan membayar paling lambat H+3 setelah panen.", "We buy at contract prices above middlemen rates and pay within 3 days of harvest.")],
            bullets: [tr("Bibit & pupuk organik dengan cicilan panen", "Seeds & organic fertilizer paid from harvest"), tr("Penyuluh lapangan setiap minggu", "Weekly field advisors"), tr("Asuransi gagal panen", "Crop failure insurance")],
            image: asset("v2a-agri-hero"),
            alt: tr("Sawah", "Rice field"),
          }),
          testimonialsWall(tm, tr, {
            eyebrow: tr("Suara petani", "Farmer voices"),
            title: tr("Dari sawah dan kebun mitra", "From partner fields"),
            score: 4.8,
            caption: tr("survei kepuasan mitra 2025", "2025 partner satisfaction survey"),
            quotes: [
              { text: tr("Pembayaran tidak pernah telat, jadi saya bisa langsung tanam lagi.", "Payments are never late, so I can replant right away."), name: "Pak Asep", role: tr("Petani padi, Cianjur", "Rice farmer, Cianjur"), avatar: asset("v2a-face-6") },
              { text: tr("Harga kopi saya naik 30% sejak ikut koperasi.", "My coffee price rose 30% after joining."), name: "Bu Rahmah", role: tr("Petani kopi, Gayo", "Coffee farmer, Gayo"), avatar: asset("v2a-face-5") },
              { text: tr("Penyuluhnya mengajari pupuk kompos sendiri.", "The advisor taught us to make our own compost."), name: "Pak Ujang", role: tr("Petani sayur, Garut", "Vegetable farmer, Garut"), avatar: asset("v2a-face-4") },
            ],
          }),
          faqList(tm, {
            title: tr("Ingin bergabung?", "Want to join?"),
            items: [
              [tr("Syarat menjadi mitra?", "Who can join?"), tr("Memiliki atau menggarap lahan minimal 0,25 ha dan bersedia mengikuti standar budidaya.", "Own or farm at least 0.25 ha and follow our growing standards.")],
              [tr("Apakah ada iuran?", "Is there a fee?"), tr("Simpanan pokok Rp100 ribu sekali, simpanan wajib Rp10 ribu/bulan.", "A one-time Rp100k share plus Rp10k/month.")],
            ],
          }),
          end,
        ]);
      case "process":
        return page(tm, [
          head,
          timeline(tm, {
            eyebrow: tr("Dari ladang ke dapur", "From field to kitchen"),
            title: tr("48 jam perjalanan hasil panen", "A 48-hour journey"),
            steps: [
              [tr("Jam 0", "Hour 0"), tr("Panen pagi", "Morning harvest"), tr("Dipetik pukul 05.00 saat masih segar.", "Picked at 5am while still cool.")],
              [tr("Jam 4", "Hour 4"), tr("Sortir & grading", "Sorting & grading"), tr("Di gudang desa, dipisah per ukuran.", "At the village shed, split by size.")],
              [tr("Jam 10", "Hour 10"), tr("Pendinginan", "Cooling"), tr("Cold storage 8°C untuk sayur.", "8°C cold storage for vegetables.")],
              [tr("Jam 24–48", "Hour 24–48"), tr("Pengiriman", "Delivery"), tr("Truk berpendingin ke restoran & ritel.", "Refrigerated trucks to restaurants & retail.")],
            ],
          }),
          counter(tm, { items: [tr("1.400 | Petani mitra", "1,400 | Partner farmers"), tr("2.100 | Hektare lahan", "2,100 | Hectares"), tr("38 | Ton per minggu", "38 | Tonnes per week"), tr("120 | Pembeli rutin", "120 | Regular buyers")], dark: true }),
          gallery(tm, { title: tr("Di lapangan", "In the field"), images: [[asset("v2a-agri-hero"), tr("Sawah Cianjur", "Cianjur paddies")], [asset("v2a-agri-harvest"), tr("Panen kentang", "Potato harvest")], [asset("v2a-agri-hero"), tr("Kebun kopi Gayo", "Gayo coffee garden")]] }),
          end,
        ]);
      case "order":
        return page(tm, [
          head,
          contact(tm, {
            eyebrow: tr("Pesanan grosir", "Wholesale orders"),
            title: tr("Pasok dapur Anda langsung dari petani", "Supply your kitchen straight from farmers"),
            text: tr("Untuk restoran, hotel, katering, dan ritel. Kontrak harga 3 atau 6 bulan tersedia.", "For restaurants, hotels, caterers, and retailers. 3- or 6-month price contracts available."),
            info: [[tr("Tim penjualan", "Sales team"), "+62 22 278 4400"], ["Email", "grosir@tanimakmur.example"], [tr("Area kirim", "Delivery area"), tr("Jabodetabek, Bandung, Medan", "Greater Jakarta, Bandung, Medan")]],
            fields: [
              { kind: "input", label: tr("Nama usaha", "Business name"), ph: "Resto Contoh" },
              { kind: "select", label: tr("Produk", "Product"), ph: tr("Pilih produk", "Choose a product"), options: [tr("Beras organik", "Organic rice"), tr("Kopi arabika", "Arabica coffee"), tr("Sayur campur", "Mixed vegetables"), tr("Cabai & bawang", "Chili & shallots")] },
              { kind: "input", label: tr("Kebutuhan per minggu (kg)", "Weekly volume (kg)"), ph: "200", type: "number" },
              { kind: "date", label: tr("Mulai kirim", "First delivery") },
            ],
            submit: tr("Minta penawaran", "Request a quote"),
          }),
          end,
        ]);
      default:
        return page(tm, [
          head,
          heroSplit(tm, {
            badge: tr("Koperasi petani sejak 2008", "Farmer cooperative since 2008"),
            title: tr("Panen jujur dari 1.400 petani", "Honest harvests from 1,400 farmers"),
            text: tr("Beras organik, kopi arabika, dan sayur dataran tinggi langsung dari koperasi ke dapur Anda, dengan harga adil untuk petani.", "Organic rice, arabica coffee, and highland vegetables straight from the cooperative to your kitchen, fairly priced for farmers."),
            actions: [[tr("Lihat hasil panen", "See produce"), href("produce")], [tr("Jadi mitra petani", "Become a partner"), href("farmers"), "outline"]],
            image: asset("v2a-agri-hero"),
            alt: tr("Ladang dan lumbung", "Fields and barn"),
            reverse: true,
            bg: "#fffdf7",
          }),
          counter(tm, { items: [tr("1.400 | Petani mitra", "1,400 | Partner farmers"), tr("+32% | Pendapatan petani", "+32% | Farmer income"), tr("38 | Ton per minggu", "38 | Tonnes/week"), tr("0 | Tengkulak", "0 | Middlemen")], bg: tm.alt }),
          cards(tm, {
            eyebrow: tr("Komitmen", "Commitments"),
            title: tr("Baik untuk tanah, baik untuk petani", "Good for soil, good for farmers"),
            variant: "line",
            items: [
              { title: tr("Pertanian organik", "Organic farming"), text: tr("620 ha bersertifikat organik SNI.", "620 ha certified organic.") },
              { title: tr("Harga kontrak", "Contract prices"), text: tr("Petani tahu harga sebelum menanam.", "Farmers know the price before planting.") },
              { title: tr("Rantai dingin", "Cold chain"), text: tr("Sayur sampai segar dalam 48 jam.", "Vegetables arrive fresh within 48 hours.") },
            ],
          }),
          story(tm, {
            eyebrow: tr("Cerita kami", "Our story"),
            title: tr("Dimulai dari 23 petani di Lembang", "It started with 23 farmers in Lembang"),
            paras: [tr("Lelah menjual murah ke tengkulak, Pak Darmawan mengajak tetangganya menjual bersama ke pasar swalayan. Kini koperasi memasok 120 restoran dan hotel.", "Tired of selling cheap to middlemen, Pak Darmawan asked his neighbors to sell together to supermarkets. Now the cooperative supplies 120 restaurants and hotels.")],
            image: asset("v2a-agri-harvest"),
            alt: tr("Panen", "Harvest"),
            bg: tm.alt,
          }),
          ctaBox(tm, { title: tr("Restoran atau hotel? Minta sampel gratis", "Restaurant or hotel? Get free samples"), actions: [[tr("Pesan grosir", "Order wholesale"), href("order"), "light"]], bg: TM.primaryDark }),
          end,
        ]);
    }
  },
};

/* ------------------- 14. Kirim Lintas Ekspres (7 hlm) ---------------- */

const KL: Palette = { ink: "#0f172a", muted: "#475569", primary: "#1d4ed8", primaryDark: "#1e40af", soft: "#eff6ff", line: "#bfdbfe" };
const kl = look(KL, { bg: "#ffffff", alt: "#f8fafc", dark: "#0b1739", radius: 8, headFont: FONTS.grotesk, font: FONTS.sans });

export const logisticsKirim: TemplateContent = {
  brand: "Kirim Lintas Ekspres",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("track", ["lacak-paket", "Lacak Paket"], ["track", "Track"]),
    pg("rates", ["tarif", "Tarif"], ["rates", "Rates"]),
    pg("coverage", ["jangkauan", "Jangkauan"], ["coverage", "Coverage"]),
    pg("business", ["bisnis", "Untuk Bisnis"], ["business", "For Business"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = headerLeft("Kirim Lintas", kl, { sticky: true, cta: linkButton(tr("Lacak paket", "Track parcel"), href("track"), "primary", KL) });
    const end = footer(
      "Kirim Lintas Ekspres",
      tr("Ekspedisi darat, laut, dan udara ke 514 kota/kabupaten.", "Road, sea, and air shipping to 514 cities and regencies."),
      [
        { title: tr("Layanan", "Services"), items: ["Reguler", "Express", "Same Day", "Cargo"] },
        { title: tr("Bantuan", "Help"), items: ["Call center 1500 777", "cs@kirimlintas.example", tr("Lacak paket", "Track parcel")] },
      ],
      tr("© 2026 Kirim Lintas Ekspres. Tarif contoh.", "© 2026 Kirim Lintas Ekspres. Sample rates."),
      "#0b1739",
    );
    switch (key) {
      case "services":
        return page(kl, [
          head,
          pageBanner(kl, { eyebrow: tr("Layanan", "Services"), title: tr("Satu mitra untuk semua pengiriman", "One partner for every shipment"), light: true, text: tr("Dari amplop dokumen hingga satu truk penuh.", "From document envelopes to a full truckload.") }),
          cards(kl, {
            title: tr("Pilih kecepatan", "Choose your speed"),
            variant: "num",
            cols: 4,
            items: [
              { title: "Same Day", text: tr("Jemput sebelum 12.00, sampai hari ini di kota yang sama.", "Pick up by noon, delivered today in the same city."), meta: tr("6 kota besar", "6 major cities") },
              { title: "Express", text: tr("1–2 hari via udara ke ibu kota provinsi.", "1–2 days by air to provincial capitals."), meta: tr("Prioritas", "Priority") },
              { title: "Reguler", text: tr("2–5 hari darat & laut, paling hemat.", "2–5 days by road & sea, most affordable."), meta: tr("Terpopuler", "Most popular") },
              { title: "Cargo", text: tr("Mulai 30 kg, tarif per kg lebih murah.", "From 30 kg, lower per-kg rates."), meta: "FTL · LTL" },
            ],
          }),
          story(kl, {
            eyebrow: tr("Asuransi", "Insurance"),
            title: tr("Barang berharga terlindungi", "Valuables protected"),
            paras: [tr("Asuransi 0,2% dari nilai barang, klaim dibayar maksimal 14 hari kerja.", "Insurance at 0.2% of declared value, claims paid within 14 business days.")],
            bullets: [tr("Packing kayu untuk elektronik", "Wooden crating for electronics"), tr("Foto serah terima di setiap titik", "Handover photos at every checkpoint")],
            image: asset("v2a-log-fleet"),
            alt: tr("Truk pengiriman", "Delivery truck"),
            reverse: true,
            bg: kl.alt,
          }),
          end,
        ]);
      case "track":
        return page(kl, [
          head,
          contact(kl, {
            eyebrow: tr("Lacak paket", "Track a parcel"),
            title: tr("Di mana paket saya?", "Where's my parcel?"),
            text: tr("Masukkan hingga 10 nomor resi, pisahkan dengan koma.", "Enter up to 10 tracking numbers, separated by commas."),
            info: [[tr("Format resi", "Tracking format"), "KLX + 10 digit"], ["Call center", "1500 777"]],
            fields: [{ kind: "input", label: tr("Nomor resi", "Tracking number"), ph: "KLX2610150042" }],
            submit: tr("Lacak", "Track"),
            formFirst: true,
          }),
          progressBars(kl, {
            eyebrow: "KLX2610150042",
            title: tr("Jakarta → Makassar · Express", "Jakarta → Makassar · Express"),
            text: tr("Perkiraan tiba: Sabtu, 17 Oktober 2026", "Estimated arrival: Saturday, October 17, 2026"),
            bars: [[tr("Dijemput", "Picked up"), 100], [tr("Sortir hub Cengkareng", "Sorted at Cengkareng hub"), 100], [tr("Dalam penerbangan", "In flight"), 60], [tr("Diantar kurir", "Out for delivery"), 0]],
          }),
          timeline(kl, {
            title: tr("Riwayat perjalanan", "Shipment history"),
            steps: [
              ["15 Okt 14.10", tr("Diterima di hub Cengkareng", "Received at Cengkareng hub"), tr("Berat terverifikasi 2,4 kg.", "Weight verified at 2.4 kg.")],
              ["15 Okt 19.45", tr("Berangkat ke Makassar", "Departed to Makassar"), tr("Penerbangan kargo GA-650.", "Cargo flight GA-650.")],
              ["16 Okt 08.00", tr("Tiba di hub Makassar", "Arrived at Makassar hub"), tr("Menunggu sortir.", "Awaiting sorting.")],
            ],
            bg: kl.alt,
          }),
          end,
        ]);
      case "rates":
        return page(kl, [
          head,
          tableBlock(kl, {
            eyebrow: tr("Tarif dari Jakarta", "Rates from Jakarta"),
            title: tr("Harga per kg", "Price per kg"),
            columns: [tr("Tujuan", "Destination"), "Reguler", "Express", tr("Estimasi", "ETA")],
            rows: [["Bandung", "Rp9.000", "Rp15.000", tr("1–2 hari", "1–2 days")], ["Surabaya", "Rp12.000", "Rp22.000", tr("2–3 hari", "2–3 days")], ["Medan", "Rp21.000", "Rp38.000", tr("3–5 hari", "3–5 days")], ["Makassar", "Rp24.000", "Rp41.000", tr("3–5 hari", "3–5 days")], ["Jayapura", "Rp52.000", "Rp88.000", tr("5–9 hari", "5–9 days")]],
            note: tr("Berat volume = P × L × T / 6.000. Berlaku yang lebih besar.", "Volumetric weight = L × W × H / 6,000. Whichever is greater applies."),
          }),
          compare(kl, {
            title: tr("Bandingkan layanan", "Compare services"),
            columns: ["Reguler", "Express", "Same Day"],
            rows: [tr("Waktu kirim | 2–5 hari | 1–2 hari | Hari ini", "Delivery time | 2–5 days | 1–2 days | Today"), tr("Jemput gratis | ya | ya | ya", "Free pick-up | yes | yes | yes"), tr("Prioritas di hub | tidak | ya | ya", "Hub priority | no | yes | yes"), tr("Garansi uang kembali | tidak | ya | ya", "Money-back guarantee | no | yes | yes")],
            caption: tr("Layanan Same Day tersedia di 6 kota.", "Same Day available in 6 cities."),
            bg: kl.alt,
          }),
          end,
        ]);
      case "coverage":
        return page(kl, [
          head,
          figures(kl, { items: [["514", tr("Kota/kabupaten", "Cities/regencies")], ["38", tr("Provinsi", "Provinces")], ["62", tr("Hub sortir", "Sorting hubs")], ["1.900", tr("Armada", "Vehicles")]], bg: "#0b1739", light: true }),
          tableBlock(kl, {
            title: tr("Hub utama", "Main hubs"),
            columns: ["Hub", tr("Wilayah", "Region"), tr("Kapasitas/hari", "Daily capacity")],
            rows: [["Cengkareng", tr("Jabodetabek", "Greater Jakarta"), tr("420.000 paket", "420,000 parcels")], ["Surabaya Margomulyo", tr("Jawa Timur & Bali", "East Java & Bali"), tr("180.000 paket", "180,000 parcels")], ["Medan Belawan", tr("Sumatra Utara", "North Sumatra"), tr("90.000 paket", "90,000 parcels")], ["Makassar", tr("Sulawesi & Indonesia Timur", "Sulawesi & East Indonesia"), tr("75.000 paket", "75,000 parcels")]],
          }),
          gallery(kl, { title: tr("Armada kami", "Our fleet"), images: [[asset("v2a-log-hero"), tr("Truk box", "Box trucks")], [asset("v2a-log-fleet"), tr("Truk berpendingin", "Refrigerated trucks")], [asset("v2a-log-hero"), tr("Motor kurir", "Courier bikes")]], bg: kl.alt }),
          end,
        ]);
      case "business":
        return page(kl, [
          head,
          servicesSplit(kl, tr, {
            eyebrow: tr("Untuk bisnis", "For business"),
            title: tr("Logistik yang ikut tumbuh bersama toko Anda", "Logistics that grows with your store"),
            image: asset("v2a-log-hero"),
            items: [
              { icon: "API", title: tr("Integrasi API", "API integration"), text: tr("Ongkir & resi otomatis di checkout.", "Automatic rates & labels at checkout.") },
              { icon: "COD", title: "COD", text: tr("Dana COD cair H+2.", "COD funds paid out in 2 days.") },
              { icon: "WMS", title: tr("Gudang fulfillment", "Fulfillment warehouse"), text: tr("Simpan, kemas, kirim dari Cikarang.", "Store, pack, ship from Cikarang.") },
            ],
            cta: { label: tr("Hubungi sales", "Contact sales"), href: href("contact") },
          }),
          priceSwitch(kl, {
            title: tr("Paket langganan bisnis", "Business plans"),
            text: tr("Diskon ongkir otomatis berdasarkan volume.", "Automatic shipping discounts by volume."),
            labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 15%", "Save 15%"), tr("/bulan", "/month"), tr("/tahun", "/year")],
            plans: [
              tr("Toko | Rp0 | Rp0 | Diskon 5%; Jemput gratis; Dasbor resi | Daftar", "Shop | Rp0 | Rp0 | 5% off; Free pick-up; Tracking dashboard | Sign up"),
              tr("Grow | Rp299rb | Rp3jt | Diskon 15%; API & plugin; COD H+2 | Mulai", "Grow | Rp299k | Rp3m | 15% off; API & plugins; COD in 2 days | Start"),
              tr("Enterprise | Rp1,9jt | Rp19jt | Diskon 25%; Account manager; Gudang fulfillment | Hubungi", "Enterprise | Rp1.9m | Rp19m | 25% off; Account manager; Fulfillment warehouse | Contact"),
            ],
            href: href("contact"),
            bg: kl.alt,
          }),
          quotes(kl, {
            title: tr("Dipakai 12.000 toko online", "Used by 12,000 online stores"),
            items: [
              { quote: tr("Retur turun 40% sejak pakai foto serah terima.", "Returns dropped 40% with handover photos."), author: "Kevin T.", role: tr("Pemilik toko sepatu", "Shoe store owner"), avatar: asset("v2a-face-2") },
              { quote: tr("Dana COD cair cepat, arus kas jadi lancar.", "COD funds arrive fast, so cash flow is smooth."), author: "Rina S.", role: tr("Penjual hijab", "Hijab seller"), avatar: asset("v2a-face-3") },
            ],
            cols: 2,
          }),
          end,
        ]);
      case "contact":
        return page(kl, [
          head,
          contact(kl, {
            eyebrow: tr("Hubungi kami", "Contact us"),
            title: tr("Butuh jemput atau kerja sama?", "Need a pick-up or partnership?"),
            info: [["Call center", "1500 777"], ["WhatsApp", "+62 811 1500 777"], [tr("Kantor pusat", "Head office"), "Jl. Daan Mogot Km 14, Jakarta Barat"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "select", label: tr("Keperluan", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Jemput paket", "Parcel pick-up"), tr("Kerja sama bisnis", "Business partnership"), tr("Klaim", "Claim"), tr("Lainnya", "Other")] },
              { kind: "input", label: tr("Kota asal", "Origin city"), ph: "Jakarta" },
              { kind: "input", label: "Email", ph: "nama@email.com", type: "email" },
            ],
            submit: tr("Kirim", "Send"),
          }),
          faqList(kl, {
            title: "FAQ",
            items: [
              [tr("Barang apa yang dilarang?", "What can't I ship?"), tr("Bahan mudah terbakar, narkotika, uang tunai, dan hewan hidup.", "Flammables, narcotics, cash, and live animals.")],
              [tr("Bagaimana jika paket rusak?", "What if my parcel is damaged?"), tr("Ajukan klaim maksimal 3 hari dengan foto & video unboxing.", "File a claim within 3 days with unboxing photos & video.")],
            ],
          }),
          end,
        ]);
      default:
        return page(kl, [
          head,
          heroSplit(kl, {
            eyebrow: tr("Ekspedisi nasional", "Nationwide shipping"),
            title: tr("Kirim ke 514 kota, lacak setiap kilometer", "Ship to 514 cities, track every kilometer"),
            text: tr("Jemput gratis dari rumah atau gudang, asuransi opsional, dan foto bukti di setiap serah terima.", "Free pick-up from home or warehouse, optional insurance, and photo proof at every handover."),
            actions: [[tr("Cek tarif", "Check rates"), href("rates")], [tr("Lacak paket", "Track parcel"), href("track"), "outline"]],
            image: asset("v2a-log-hero"),
            alt: tr("Truk di jalan", "Truck on the road"),
            gradient: [KL.soft, "#ffffff", 180],
          }),
          counter(kl, { items: [tr("1,2 jt | Paket per hari", "1.2M | Parcels per day"), tr("514 | Kota tujuan", "514 | Destination cities"), tr("97,8% | Tepat waktu", "97.8% | On time"), tr("12.000 | Mitra bisnis", "12,000 | Business partners")] }),
          cards(kl, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Cepat, hemat, atau besar", "Fast, cheap, or big"),
            items: [
              { icon: "⚡", title: "Same Day", text: tr("Sampai hari ini di 6 kota.", "Delivered today in 6 cities.") },
              { icon: "✈", title: "Express", text: tr("1–2 hari via udara.", "1–2 days by air.") },
              { icon: "🚚", title: "Cargo", text: tr("Mulai 30 kg, darat & laut.", "From 30 kg, road & sea.") },
            ],
            bg: kl.alt,
          }),
          logos(kl, { label: tr("Mitra marketplace & brand", "Marketplace & brand partners"), names: ["TokoRaya", "Belanjaku", "ModaLokal", "SehatMart", "Gadgetin"] }),
          ctaBand(kl, tr, { title: tr("Jualan online? Diskon ongkir hingga 25%", "Selling online? Up to 25% off shipping"), primary: { label: tr("Untuk bisnis", "For business"), href: href("business") }, secondary: { label: tr("Jangkauan", "Coverage"), href: href("coverage") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 15. Arena Nexus Esports (6 hlm) ----------------- */

const AN: Palette = { ink: "#0f172a", muted: "#64748b", primary: "#06b6d4", primaryDark: "#0891b2", soft: "#cffafe", line: "#67e8f9" };
// Hero, banners, & dark bands; content sections light so they are easy to read.
const an = look(AN, { bg: "#f8fafc", alt: "#ecfeff", dark: "#05010d", radius: 4, headFont: FONTS.mono, font: FONTS.grotesk, page: "#05010d" });

export const gamingArena: TemplateContent = {
  brand: "Arena Nexus Esports",
  pages: [home(), pg("tournaments", ["turnamen", "Turnamen"], ["tournaments", "Tournaments"]), pg("teams", ["tim", "Tim"], ["teams", "Teams"]), pg("leaderboard", ["peringkat", "Peringkat"], ["leaderboard", "Leaderboard"]), pg("booking", ["sewa-arena", "Sewa Arena"], ["book-arena", "Book the Arena"]), pg("news", ["berita", "Berita"], ["news", "News"])],
  build: (key, tr, href) => {
    const head = header("NEXUS//ARENA", AN, { bg: "#05010d", ink: "#ffffff", font: FONTS.mono, sticky: true, cta: linkButton(tr("Daftar turnamen", "Join a tournament"), href("tournaments"), "primary", AN) });
    const end = footerSlim(an, "NEXUS//ARENA", ["Discord", "Twitch", "YouTube", "TikTok"], tr("© 2026 Arena Nexus Esports · Mal Kelapa Gading Lt. 5", "© 2026 Arena Nexus Esports · Kelapa Gading Mall L5"), { bg: "#05010d" });
    const darkBanner = (title: string, text: string) => pageBanner(an, { title, text, light: true, bg: "#120626" });
    switch (key) {
      case "tournaments":
        return page(an, [
          head,
          darkBanner(tr("Turnamen", "Tournaments"), tr("Liga mingguan dan turnamen besar dengan total hadiah Rp450 juta tahun ini.", "Weekly leagues and majors with Rp450M in prizes this year.")),
          tableBlock(an, {
            title: tr("Jadwal turnamen", "Tournament schedule"),
            columns: [tr("Tanggal", "Date"), "Game", tr("Format", "Format"), tr("Hadiah", "Prize pool")],
            rows: [["24 Okt", "Valorant", "5v5 · Single elim", "Rp25 jt"], ["31 Okt", "Mobile Legends", "5v5 · Double elim", "Rp40 jt"], ["07 Nov", "EA FC 26", "1v1 · Swiss", "Rp10 jt"], ["21–22 Nov", "Nexus Major: Valorant", tr("16 tim · LAN", "16 teams · LAN"), "Rp150 jt"]],
                      }),
          tabsBlock(an, {
            title: tr("Peraturan umum", "General rules"),
            tabs: [
              [tr("Pendaftaran", "Registration"), tr("Tim mendaftar paling lambat H-3. Biaya Rp250 ribu per tim untuk liga mingguan.", "Teams register by D-3. Rp250k per team for weekly leagues.")],
              [tr("Perangkat", "Hardware"), tr("PC disediakan arena (RTX 4070, 240 Hz). Boleh membawa periferal sendiri.", "Arena PCs provided (RTX 4070, 240 Hz). Bring your own peripherals.")],
              [tr("Sportivitas", "Fair play"), tr("Anti-cheat wajib aktif. Pelanggaran = diskualifikasi tim.", "Anti-cheat must be on. Violations disqualify the team.")],
            ],
                      }),
          end,
        ]);
      case "teams":
        return page(an, [
          head,
          teamCards(an, tr, {
            eyebrow: tr("Tim binaan", "Academy roster"),
            title: tr("Nexus Academy", "Nexus Academy"),
            text: tr("Tim muda yang berlatih 5 hari seminggu di arena.", "Young teams training 5 days a week at the arena."),
            members: [
              { name: "Rizky \"Vortex\"", role: tr("Valorant · Duelist", "Valorant · Duelist"), photo: asset("v2a-face-2") },
              { name: "Salsa \"Mira\"", role: tr("MLBB · Jungler", "MLBB · Jungler"), photo: asset("v2a-face-3") },
              { name: "Fadil \"Kuro\"", role: tr("Valorant · IGL", "Valorant · IGL"), photo: asset("v2a-face-4") },
              { name: "Dewa \"Rex\"", role: "EA FC", photo: asset("v2a-face-1") },
            ],
          }),
          slider(an, {
            slides: [
              { title: tr("Juara Liga Komunitas MLBB S4", "Community MLBB League S4 champions"), text: tr("Nexus Academy MLBB, Agustus 2026.", "Nexus Academy MLBB, August 2026."), bg: "#0891b2" },
              { title: tr("Top 4 Kualifikasi Valorant Nasional", "Top 4 national Valorant qualifier"), text: tr("Nexus Valorant, Juni 2026.", "Nexus Valorant, June 2026."), bg: "#7c3aed" },
            ],
            bg: "#0b0118",
          }),
          end,
        ]);
      case "leaderboard":
        return page(an, [
          head,
          darkBanner(tr("Peringkat musim 3", "Season 3 leaderboard"), tr("Poin dari liga mingguan, diperbarui setiap Senin.", "Points from weekly leagues, updated every Monday.")),
          tableBlock(an, {
            title: "Valorant",
            columns: ["#", tr("Tim", "Team"), tr("Main", "Played"), tr("Menang", "Won"), tr("Poin", "Points")],
            rows: [["1", "Garuda Gaming", "12", "10", "31"], ["2", "Nexus Academy", "12", "9", "28"], ["3", "Kopi Tubruk Esports", "12", "8", "25"], ["4", "Rajawali Five", "12", "6", "19"], ["5", "Tim Senja", "12", "5", "16"]],
                      }),
          progressBars(an, {
            title: tr("Win rate tim teratas", "Top team win rates"),
            bars: [["Garuda Gaming", 83], ["Nexus Academy", 75], ["Kopi Tubruk Esports", 67]],
                      }),
          end,
        ]);
      case "booking":
        return page(an, [
          head,
          plans(an, {
            eyebrow: tr("Sewa arena", "Book the arena"),
            title: tr("Main bareng, latihan tim, atau acara kantor", "Play, scrim, or host a company event"),
                        items: [
              { plan: tr("Per jam", "Hourly"), price: "Rp25rb", period: tr("/jam", "/hour"), description: tr("PC 240 Hz, kursi gaming.", "240 Hz PC, gaming chair."), features: [tr("Akses semua game", "All games"), tr("Minuman gratis 1×", "1 free drink")], buttonText: tr("Pesan", "Book"), buttonHref: "#pesan" },
              { plan: tr("Bootcamp tim", "Team bootcamp"), price: "Rp1,2jt", period: tr("/hari", "/day"), description: tr("Ruang privat 5 PC.", "Private room, 5 PCs."), features: [tr("12 jam", "12 hours"), tr("Pelatih analis 2 jam", "2-hour analyst coach"), tr("Makan siang", "Lunch")], buttonText: tr("Pesan", "Book"), buttonHref: "#pesan", featured: true, badge: tr("Untuk tim", "For teams") },
              { plan: tr("Acara privat", "Private event"), price: "Rp15jt", period: tr("/hari", "/day"), description: tr("Seluruh arena 60 PC.", "Whole arena, 60 PCs."), features: [tr("Panggung & caster", "Stage & caster"), tr("Siaran Twitch", "Twitch broadcast")], buttonText: tr("Hubungi", "Contact"), buttonHref: "#pesan" },
            ],
          }),
          contact(an, {
            title: tr("Reservasi", "Reservation"),
            info: [["Discord", "discord.gg/nexusarena"], ["WhatsApp", "+62 812 5050 6060"]],
            fields: [
              { kind: "input", label: tr("Nama / tim", "Name / team"), ph: "Garuda Gaming" },
              { kind: "select", label: tr("Paket", "Package"), ph: tr("Pilih paket", "Choose"), options: [tr("Per jam", "Hourly"), tr("Bootcamp tim", "Team bootcamp"), tr("Acara privat", "Private event")] },
              { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            ],
            submit: tr("Kirim reservasi", "Send booking"),
                      }),
          end,
        ]);
      case "news":
        return page(an, [
          head,
          posts(an, {
            eyebrow: tr("Berita", "News"),
            title: tr("Kabar arena", "Arena news"),
            readLabel: tr("Baca", "Read"),
                        items: [
              { image: asset("v2a-game-hero"), tag: "Valorant", title: tr("Nexus Major kembali dengan hadiah Rp150 juta", "Nexus Major returns with a Rp150M prize pool"), text: tr("16 tim, LAN dua hari, tiket penonton gratis.", "16 teams, two-day LAN, free spectator tickets."), date: "12 Okt 2026", href: href("tournaments") },
              { image: asset("v2a-game-arena"), tag: tr("Arena", "Arena"), title: tr("40 PC baru dengan monitor 360 Hz", "40 new PCs with 360 Hz monitors"), text: tr("Zona kompetitif kini lebih mulus.", "The competitive zone is now smoother."), date: "01 Okt 2026", href: href("booking") },
              { image: asset("v2a-game-hero"), tag: "MLBB", title: tr("Academy juara liga komunitas", "Academy wins the community league"), text: tr("Kemenangan 3–1 di grand final.", "A 3–1 win in the grand final."), date: "20 Agu 2026", href: href("teams") },
            ],
          }),
          end,
        ]);
      default:
        return page(an, [
          head,
          heroCover(an, {
            eyebrow: tr("Arena esports · 60 PC · 240 Hz", "Esports arena · 60 PCs · 240 Hz"),
            title: tr("Tempat untuk berlatih, bertanding, menang", "The place to train, compete, win"),
            titleNode: typer(an, tr("Tempat untuk", "The place to"), [tr("berlatih", "train"), tr("bertanding", "compete"), tr("menang", "win")], { color: "#ffffff", word: AN.line, align: "center", size: 60 }),
            text: tr("Arena LAN terbesar di Jakarta Utara. Liga mingguan, bootcamp tim, dan siaran langsung setiap akhir pekan.", "North Jakarta's biggest LAN arena. Weekly leagues, team bootcamps, and live broadcasts every weekend."),
            actions: [[tr("Daftar turnamen", "Join a tournament"), href("tournaments")], [tr("Sewa PC", "Book a PC"), href("booking"), "outline"]],
            gradient: ["#1e0b3a", "#05010d", 160],
            image: asset("v2a-game-hero"),
            alt: tr("Gamepad neon", "Neon gamepad"),
          }),
          countdownBand(an, { eyebrow: "Nexus Major · Valorant", title: tr("LAN final 21–22 November", "LAN finals November 21–22"), text: tr("16 tim, hadiah Rp150 juta. Pendaftaran tutup 14 November.", "16 teams, Rp150M prize pool. Registration closes November 14."), target: "2026-11-21T10:00", finished: tr("Turnamen sedang berlangsung!", "The tournament is live!"), bg: "#7c3aed", actions: [[tr("Daftarkan tim", "Register a team"), href("tournaments"), "light"]] }),
          listings(an, {
            title: tr("Liga minggu ini", "This week's leagues"),
                        items: [
              { image: asset("v2a-game-arena"), title: "Valorant Weekly #42", text: tr("Sabtu 13.00 · 5v5", "Sat 1pm · 5v5"), price: "Rp25 jt", badge: tr("Slot tersisa 3", "3 slots left"), cta: tr("Daftar", "Register"), href: href("tournaments") },
              { image: asset("v2a-game-hero"), title: "MLBB Cup", text: tr("Minggu 10.00 · 5v5", "Sun 10am · 5v5"), price: "Rp40 jt", cta: tr("Daftar", "Register"), href: href("tournaments") },
              { image: asset("v2a-game-arena"), title: "EA FC Night", text: tr("Jumat 19.00 · 1v1", "Fri 7pm · 1v1"), price: "Rp10 jt", cta: tr("Daftar", "Register"), href: href("tournaments") },
            ],
          }),
          counter(an, { items: [tr("60 | PC kompetitif", "60 | Competitive PCs"), tr("9.200 | Pemain terdaftar", "9,200 | Registered players"), tr("140 | Turnamen digelar", "140 | Tournaments held"), tr("Rp450 jt | Hadiah 2026", "Rp450M | 2026 prizes")], dark: true, bg: "#05010d" }),
          end,
        ]);
    }
  },
};
