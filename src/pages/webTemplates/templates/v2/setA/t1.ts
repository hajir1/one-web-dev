import { asset } from "../../../assets";
import { linkButton, type Palette } from "../../../build";
import { ctaBand, faqAccordion, featuresIcons, heroSpotlight, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall, portfolioMosaic } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { centeredHeader, footer, header } from "../../pro/kit";
import {
  FONTS,
  article,
  bigQuote,
  cards,
  compare,
  contact,
  counter,
  ctaBox,
  faqList,
  figures,
  gallery,
  headerBar,
  heroSplit,
  home,
  listings,
  look,
  mega,
  menuBoard,
  notice,
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
  story,
  tableBlock,
  tabsBlock,
  timeline,
  footerSlim,
} from "./kitA";

/* ================================================================== */
/* Template v2 A1–A5: Kafe (Free), Gym, Salon, Bengkel, Keuangan.        */
/* ================================================================== */

/* ------------------- 1. Kafe Kopi Senja (FREE, 4 hlm) ---------------- */
// Hanya section preset gratis + elemen gratis.

const KS: Palette = { ink: "#3f1d0b", muted: "#78584a", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fed7aa" };
const ks = look(KS, { bg: "#fffaf3", alt: "#fdf1e3", dark: "#2a1408", radius: 14, headFont: FONTS.serif, font: FONTS.rounded, page: "#fffaf3" });

const ksFooter = (tr: Tr) =>
  footer(
    "Senjakala Kopi",
    tr("Kedai kopi kecil di Jalan Braga, Bandung. Disangrai sendiri setiap Selasa.", "A small coffee house on Jalan Braga, Bandung. Roasted in-house every Tuesday."),
    [
      { title: tr("Buka", "Open"), items: [tr("Sen–Jum 07.00–22.00", "Mon–Fri 7am–10pm"), tr("Sab–Min 08.00–23.00", "Sat–Sun 8am–11pm")] },
      { title: tr("Kontak", "Contact"), items: ["Jl. Braga No. 27, Bandung", "+62 812 2200 1716", "@senjakala.kopi"] },
    ],
    tr("© 2026 Senjakala Kopi. Konten contoh.", "© 2026 Senjakala Kopi. Sample content."),
    "#2a1408",
  );

export const cafeKopiSenja: TemplateContent = {
  brand: "Senjakala Kopi",
  pages: [home(), pg("menu", ["menu", "Menu"], ["menu", "Menu"]), pg("story", ["cerita", "Cerita Kami"], ["our-story", "Our Story"]), pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  build: (key, tr, href) => {
    const head = centeredHeader("Senjakala Kopi", KS, { bg: "#fffaf3", font: FONTS.serif });
    const end = ksFooter(tr);
    if (key === "menu")
      return page(ks, [
        head,
        pageBanner(ks, { eyebrow: tr("Menu harian", "Daily menu"), title: tr("Dari biji pilihan hingga roti hangat", "From hand-picked beans to warm pastries"), text: tr("Semua espresso memakai house blend Java Preanger & Gayo. Ganti ke susu oat tanpa biaya tambahan.", "Every espresso uses our Java Preanger & Gayo house blend. Swap to oat milk at no extra cost."), crumbs: [[tr("Beranda", "Home"), href("home")], ["Menu", ""]] }),
        menuBoard(ks, {
          eyebrow: tr("Harga sudah termasuk pajak", "Prices include tax"),
          title: tr("Pilih teman sorenya", "Pick your afternoon companion"),
          groups: [
            { title: tr("Kopi", "Coffee"), items: [["Es Kopi Senja", tr("Espresso, susu segar, gula aren Ciamis", "Espresso, fresh milk, Ciamis palm sugar"), "28K"], ["Flat White", tr("Double ristretto, microfoam lembut", "Double ristretto, silky microfoam"), "32K"], ["V60 Gayo Wine", tr("Seduh manual, aroma buah", "Hand-brewed, fruity notes"), "35K"]] },
            { title: tr("Non-kopi", "Non-coffee"), items: [["Cokelat Garut", tr("Kakao lokal 70%, susu hangat", "70% local cacao, warm milk"), "30K"], ["Teh Rempah", tr("Teh hitam, jahe, kayu manis", "Black tea, ginger, cinnamon"), "24K"], ["Soda Jeruk Kintamani", tr("Jeruk segar dan soda", "Fresh orange and soda"), "26K"]] },
            { title: tr("Makanan", "Food"), items: [["Croissant Mentega", tr("Dipanggang tiap pagi", "Baked every morning"), "25K"], ["Roti Bakar Srikaya", tr("Selai srikaya buatan rumah", "House-made kaya jam"), "22K"], ["Nasi Goreng Kampung", tr("Telur mata sapi, kerupuk", "Fried egg, crackers"), "38K"]] },
          ],
        }),
        tabsBlock(ks, {
          eyebrow: tr("Metode seduh", "Brew methods"),
          title: tr("Biji yang sama, rasa yang berbeda", "Same beans, different taste"),
          tabs: [
            ["Espresso", tr("Tekanan 9 bar selama 28 detik. Badan tebal, cocok dengan susu.", "9 bar of pressure for 28 seconds. Full body, great with milk.")],
            ["V60", tr("Seduhan tuang 1:15 pada suhu 92°C. Bersih dan cerah.", "A 1:15 pour-over at 92°C. Clean and bright.")],
            ["Cold brew", tr("Direndam 18 jam di kulkas. Manis alami, rendah asam.", "Steeped for 18 hours in the fridge. Naturally sweet, low acidity.")],
          ],
        }),
        end,
      ]);
    if (key === "story")
      return page(ks, [
        head,
        story(ks, {
          eyebrow: tr("Sejak 2016", "Since 2016"),
          title: tr("Berawal dari gerobak di depan kampus", "It started with a cart outside campus"),
          paras: [
            tr("Raka dan Lintang menjual kopi tubruk dari gerobak sepeda di depan ITB. Pelanggan pertama mereka adalah mahasiswa yang lembur menggambar maket.", "Raka and Lintang sold tubruk coffee from a bicycle cart outside ITB. Their first customers were students pulling all-nighters on scale models."),
            tr("Sekarang kami menyangrai 40 kg biji per minggu dari empat petani di Pangalengan dan Gayo, dan tetap menyeduh setiap gelas di depan Anda.", "Today we roast 40 kg a week from four farmers in Pangalengan and Gayo, and still brew every cup in front of you."),
          ],
          bullets: [tr("Biji dibeli langsung dari petani", "Beans bought directly from farmers"), tr("Gelas kaca, tanpa sedotan plastik", "Glass cups, no plastic straws"), tr("Ampas kopi jadi kompos kebun kota", "Grounds become compost for city gardens")],
          image: asset("v2a-cafe-latte"),
          alt: tr("Latte di meja kayu", "A latte on a wooden table"),
        }),
        timeline(ks, {
          eyebrow: tr("Perjalanan", "Journey"),
          title: tr("Sepuluh tahun, satu kedai", "Ten years, one coffee house"),
          steps: [
            ["2016", tr("Gerobak sepeda", "Bicycle cart"), tr("50 gelas sehari di depan kampus.", "50 cups a day outside campus.")],
            ["2019", tr("Kedai di Braga", "Shop on Braga"), tr("Ruang 30 kursi di bangunan art deco.", "A 30-seat room in an art deco building.")],
            ["2023", tr("Mesin sangrai sendiri", "Our own roaster"), tr("Sangrai mingguan untuk rasa yang konsisten.", "Weekly roasting for a consistent taste.")],
            ["2026", tr("Kelas seduh", "Brewing classes"), tr("Kelas Sabtu pagi untuk pemula.", "Saturday morning classes for beginners.")],
          ],
        }),
        people(ks, {
          eyebrow: tr("Di balik bar", "Behind the bar"),
          title: tr("Barista kami", "Our baristas"),
          round: true,
          items: [
            { name: "Raka Pratama", role: tr("Pendiri & roaster", "Founder & roaster"), photo: asset("v2a-face-1") },
            { name: "Lintang Ayu", role: tr("Pendiri & head barista", "Founder & head barista"), photo: asset("v2a-face-3") },
            { name: "Dimas Wiryo", role: tr("Barista", "Barista"), photo: asset("v2a-face-2") },
          ],
        }),
        bigQuote(ks, { text: tr("Kopi yang baik itu jujur: kami tahu siapa yang menanamnya.", "Good coffee is honest: we know who grew it."), name: "Lintang Ayu", role: tr("Pendiri", "Co-founder") }),
        end,
      ]);
    if (key === "visit")
      return page(ks, [
        head,
        contact(ks, {
          eyebrow: tr("Reservasi meja", "Table booking"),
          title: tr("Datang berkelompok? Pesan meja dulu", "Coming as a group? Book a table"),
          text: tr("Kami menahan meja selama 15 menit dari jam yang Anda pilih.", "We hold your table for 15 minutes from the time you choose."),
          info: [[tr("Alamat", "Address"), "Jl. Braga No. 27, Bandung"], ["WhatsApp", "+62 812 2200 1716"], [tr("Parkir", "Parking"), tr("Gedung Braga City Walk, 2 menit jalan kaki", "Braga City Walk building, 2-minute walk")]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama pemesan", "Your name") },
            { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            { kind: "select", label: tr("Jumlah orang", "Party size"), ph: tr("Pilih", "Choose"), options: ["2", "3–4", "5–8", tr("Lebih dari 8", "More than 8")] },
          ],
          submit: tr("Kirim reservasi", "Send booking"),
        }),
        tableBlock(ks, {
          eyebrow: tr("Jam buka", "Opening hours"),
          title: tr("Kapan kami buka", "When we're open"),
          columns: [tr("Hari", "Day"), tr("Jam", "Hours"), tr("Catatan", "Notes")],
          rows: [
            [tr("Senin–Jumat", "Monday–Friday"), "07.00–22.00", tr("Sarapan sampai 10.00", "Breakfast until 10am")],
            [tr("Sabtu", "Saturday"), "08.00–23.00", tr("Kelas seduh 09.00", "Brewing class at 9am")],
            [tr("Minggu", "Sunday"), "08.00–23.00", tr("Live akustik 19.00", "Live acoustic at 7pm")],
          ],
        }),
        faqAccordion(ks, tr, {
          eyebrow: "FAQ",
          title: tr("Sebelum berkunjung", "Before you visit"),
          text: tr("Masih ragu? Chat kami di WhatsApp.", "Still unsure? Chat with us on WhatsApp."),
          items: [
            [tr("Ada Wi-Fi dan colokan?", "Is there Wi-Fi and power?"), tr("Ada, di setiap meja panjang lantai dua.", "Yes, at every long table upstairs.")],
            [tr("Boleh membawa hewan?", "Are pets allowed?"), tr("Boleh di area teras.", "Yes, on the terrace.")],
            [tr("Menjual biji kopi?", "Do you sell beans?"), tr("Ya, kemasan 200 g mulai Rp85 ribu.", "Yes, 200 g bags from Rp85k.")],
          ],
          contact: { label: "WhatsApp", href: "#kontak" },
        }),
        end,
      ]);
    return page(ks, [
      head,
      heroSpotlight(ks, tr, {
        badge: tr("Sangrai segar setiap Selasa", "Freshly roasted every Tuesday"),
        title: tr("Kopi hangat untuk senja di Braga", "Warm coffee for Braga sunsets"),
        text: tr("Espresso gula aren, roti mentega yang baru keluar oven, dan kursi dekat jendela untuk menunggu lampu kota menyala.", "Palm sugar espresso, butter pastries fresh from the oven, and a window seat to watch the city lights come on."),
        primary: { label: tr("Lihat menu", "See the menu"), href: href("menu") },
        secondary: { label: tr("Pesan meja", "Book a table"), href: href("visit") },
        image: asset("v2a-cafe-hero"),
        imageAlt: tr("Cangkir kopi hangat", "A warm cup of coffee"),
        note: tr("Buka setiap hari · 07.00–23.00", "Open daily · 7am–11pm"),
      }),
      featuresIcons(ks, tr, {
        eyebrow: tr("Kenapa mampir", "Why stop by"),
        title: tr("Kecil, hangat, dan konsisten", "Small, warm, and consistent"),
        items: [
          { icon: "☕", title: tr("Sangrai sendiri", "Roasted in-house"), text: tr("Profil sangrai medium untuk rasa cokelat & karamel.", "A medium roast for chocolate and caramel notes.") },
          { icon: "🥐", title: tr("Pastry harian", "Daily pastries"), text: tr("Dipanggang pukul 05.30 setiap pagi.", "Baked at 5:30 every morning.") },
          { icon: "🪑", title: tr("Ruang kerja", "Room to work"), text: tr("Meja panjang, colokan, Wi-Fi kencang.", "Long tables, power outlets, fast Wi-Fi.") },
        ],
      }),
      listings(ks, {
        eyebrow: tr("Paling dicari", "Most ordered"),
        title: tr("Favorit pelanggan", "Customer favorites"),
        items: [
          { image: asset("v2a-cafe-hero"), title: "Es Kopi Senja", text: tr("Espresso, susu, gula aren", "Espresso, milk, palm sugar"), price: "Rp28.000", badge: tr("Terlaris", "Best seller"), rating: 4.9, reviews: "(812)", cta: tr("Lihat menu", "See menu"), href: href("menu") },
          { image: asset("v2a-cafe-cold"), title: "Cold Brew Tonic", text: tr("Cold brew 18 jam + tonik", "18-hour cold brew + tonic"), price: "Rp32.000", rating: 4.8, reviews: "(240)", cta: tr("Lihat menu", "See menu"), href: href("menu") },
          { image: asset("v2a-cafe-plate"), title: "Croissant Mentega", text: tr("Dipanggang setiap pagi", "Baked every morning"), price: "Rp25.000", rating: 4.7, reviews: "(301)", cta: tr("Lihat menu", "See menu"), href: href("menu") },
        ],
      }),
      gallery(ks, {
        eyebrow: tr("Suasana", "The space"),
        title: tr("Sudut favorit di kedai", "Favorite corners"),
        images: [
          [asset("v2a-cafe-latte"), tr("Bar seduh manual", "Pour-over bar")],
          [asset("v2a-cafe-cold"), tr("Teras sore", "Afternoon terrace")],
          [asset("v2a-cafe-plate"), tr("Meja sarapan", "Breakfast table")],
        ],
        bg: ks.alt,
      }),
      ctaBand(ks, tr, { title: tr("Sampai jumpa sore ini?", "See you this afternoon?"), text: tr("Simpan lokasi kami dan pesan meja untuk rombongan.", "Save our location and book a table for groups."), primary: { label: tr("Kunjungi kami", "Visit us"), href: href("visit") }, secondary: { label: tr("Cerita kami", "Our story"), href: href("story") } }),
      end,
    ]);
  },
};

/* ------------------- 2. Fitness Gym Pulse (PREMIUM, 7 hlm) ----------- */

const GP: Palette = { ink: "#0a0a0a", muted: "#525252", primary: "#ca8a04", primaryDark: "#a16207", soft: "#fef9c3", line: "#fde047" };
const gp = look(GP, { bg: "#ffffff", alt: "#f5f5f4", dark: "#0a0a0a", radius: 6, headFont: FONTS.grotesk, font: FONTS.grotesk });

export const fitnessGymPulse: TemplateContent = {
  brand: "Pulse Gym Kemang",
  pages: [
    home(),
    pg("classes", ["kelas", "Kelas"], ["classes", "Classes"]),
    pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]),
    pg("coaches", ["pelatih", "Pelatih"], ["coaches", "Coaches"]),
    pg("membership", ["membership", "Membership"], ["membership", "Membership"]),
    pg("stories", ["kisah-member", "Kisah Member"], ["member-stories", "Member Stories"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = header("PULSE/", GP, { bg: "#0a0a0a", ink: "#ffffff", font: FONTS.grotesk, sticky: true, cta: linkButton(tr("Coba gratis", "Free trial"), href("contact"), "primary", GP) });
    const end = footerSlim(gp, "PULSE/", [tr("Kelas", "Classes"), tr("Jadwal", "Schedule"), "Membership", "Instagram"], tr("© 2026 Pulse Gym Kemang · Jl. Kemang Raya 12", "© 2026 Pulse Gym Kemang · 12 Kemang Raya St."), { bg: "#0a0a0a" });
    const banner = (eyebrowText: string, title: string, text: string) => pageBanner(gp, { eyebrow: eyebrowText, title, text, light: true, bg: "#171717" });
    switch (key) {
      case "classes":
        return page(gp, [
          head,
          banner(tr("12 jenis kelas", "12 class types"), tr("Kelas untuk setiap level", "Classes for every level"), tr("Maksimal 14 orang per kelas, jadi pelatih benar-benar memperhatikan teknik Anda.", "Max 14 people per class, so coaches actually watch your form.")),
          listings(gp, {
            title: tr("Kelas unggulan", "Signature classes"),
            items: [
              { image: asset("v2a-gym-hero"), title: "Pulse HIIT", text: tr("45 menit · interval intensitas tinggi", "45 min · high-intensity intervals"), price: tr("Termasuk member", "Included"), badge: tr("Ramai", "Popular"), cta: tr("Lihat jadwal", "See schedule"), href: href("schedule") },
              { image: asset("v2a-gym-class"), title: "Strength Lab", text: tr("60 menit · barbel & teknik angkat", "60 min · barbell & lifting technique"), price: tr("Termasuk member", "Included"), cta: tr("Lihat jadwal", "See schedule"), href: href("schedule") },
              { image: asset("v2a-gym-hero"), title: "Mobility Flow", text: tr("40 menit · fleksibilitas & pemulihan", "40 min · flexibility & recovery"), price: tr("Termasuk member", "Included"), cta: tr("Lihat jadwal", "See schedule"), href: href("schedule") },
            ],
          }),
          process(gp, {
            eyebrow: tr("Baru mulai?", "New here?"),
            title: tr("Empat langkah minggu pertama", "Your first week in four steps"),
            dark: true,
            steps: [
              [tr("Asesmen 30 menit", "30-min assessment"), tr("Cek postur, mobilitas, dan target.", "Posture, mobility, and goals check.")],
              [tr("Program awal", "Starter plan"), tr("Tiga kelas yang cocok untuk level Anda.", "Three classes matched to your level.")],
              [tr("Kelas pertama", "First class"), tr("Datang 10 menit lebih awal untuk pemanasan.", "Arrive 10 minutes early to warm up.")],
              [tr("Evaluasi", "Review"), tr("Ngobrol singkat dengan pelatih di hari ke-7.", "A short chat with your coach on day 7.")],
            ],
          }),
          end,
        ]);
      case "schedule":
        return page(gp, [
          head,
          banner(tr("Jadwal mingguan", "Weekly schedule"), tr("Pilih jam latihanmu", "Pick your training time"), tr("Booking lewat aplikasi member paling lambat 2 jam sebelum kelas.", "Book via the member app at least 2 hours before class.")),
          tableBlock(gp, {
            title: tr("Senin – Sabtu", "Monday – Saturday"),
            columns: [tr("Jam", "Time"), tr("Senin", "Mon"), tr("Rabu", "Wed"), tr("Jumat", "Fri"), tr("Sabtu", "Sat")],
            rows: [
              ["06.00", "Pulse HIIT", "Strength Lab", "Pulse HIIT", "Run Club"],
              ["07.30", "Mobility Flow", "Pulse HIIT", "Mobility Flow", "Strength Lab"],
              ["12.15", "Express Core", "Express Core", "Express Core", "—"],
              ["18.30", "Strength Lab", "Boxing Basics", "Strength Lab", "—"],
              ["19.45", "Boxing Basics", "Mobility Flow", "Pulse HIIT", "—"],
            ],
            note: tr("Minggu: area gym terbuka 08.00–16.00 tanpa kelas.", "Sunday: open gym 8am–4pm, no classes."),
          }),
          notice(gp, { badge: tr("Info", "Note"), text: tr("Kelas 06.00 hari Jumat pindah ke rooftop selama bulan November.", "Friday 6am class moves to the rooftop throughout November."), link: tr("Tanya admin", "Ask the desk"), href: href("contact") }),
          end,
        ]);
      case "coaches":
        return page(gp, [
          head,
          teamCards(gp, tr, {
            eyebrow: tr("Pelatih bersertifikat", "Certified coaches"),
            title: tr("Tim yang membuatmu konsisten", "The team that keeps you consistent"),
            text: tr("Semua pelatih memegang sertifikasi NASM atau ACE dan rutin mengikuti pelatihan cedera olahraga.", "Every coach holds NASM or ACE certification and trains regularly on sports injuries."),
            members: [
              { name: "Bima Saputra", role: tr("Kepala pelatih · Strength", "Head coach · Strength"), photo: asset("v2a-face-2"), links: [{ label: "Instagram", href: "#" }] },
              { name: "Sekar Ayu", role: "HIIT & Mobility", photo: asset("v2a-face-3"), links: [{ label: "Instagram", href: "#" }] },
              { name: "Reza Hakim", role: "Boxing", photo: asset("v2a-face-4"), links: [{ label: "Instagram", href: "#" }] },
              { name: "Nadia Putri", role: tr("Nutrisi", "Nutrition"), photo: asset("v2a-face-5"), links: [{ label: "Instagram", href: "#" }] },
            ],
          }),
          bigQuote(gp, { text: tr("Kami tidak melatih orang supaya lelah. Kami melatih supaya mereka kembali minggu depan.", "We don't train people to get tired. We train them to come back next week."), name: "Bima Saputra", role: tr("Kepala pelatih", "Head coach") }),
          end,
        ]);
      case "membership":
        return page(gp, [
          head,
          priceSwitch(gp, {
            eyebrow: "Membership",
            title: tr("Tanpa biaya pendaftaran", "No joining fee"),
            text: tr("Bayar bulanan atau hemat dengan kontrak 12 bulan.", "Pay monthly or save with a 12-month plan."),
            labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")],
            plans: [
              tr("Off-Peak | Rp390rb | Rp3,9jt | Akses 09.00–16.00; 4 kelas/bulan; Loker harian | Pilih", "Off-Peak | Rp390k | Rp3.9m | Access 9am–4pm; 4 classes/month; Day locker | Choose"),
              tr("Unlimited | Rp690rb | Rp6,9jt | Akses penuh; Kelas tanpa batas; 1 sesi asesmen | Pilih", "Unlimited | Rp690k | Rp6.9m | Full access; Unlimited classes; 1 assessment | Choose"),
              tr("Coached | Rp1,49jt | Rp14,9jt | Semua Unlimited; 4 sesi personal; Rencana nutrisi | Pilih", "Coached | Rp1.49m | Rp14.9m | All of Unlimited; 4 PT sessions; Nutrition plan | Choose"),
            ],
            href: href("contact"),
          }),
          compare(gp, {
            title: tr("Bandingkan paket", "Compare plans"),
            columns: ["Off-Peak", "Unlimited", "Coached"],
            rows: [tr("Akses jam sibuk | tidak | ya | ya", "Peak-hour access | no | yes | yes"), tr("Kelas grup | 4/bulan | Tanpa batas | Tanpa batas", "Group classes | 4/month | Unlimited | Unlimited"), tr("Personal training | tidak | tidak | 4 sesi", "Personal training | no | no | 4 sessions"), tr("Handuk & loker | tidak | ya | ya", "Towel & locker | no | yes | yes")],
            caption: tr("Harga contoh", "Sample prices"),
          }),
          faqList(gp, {
            title: tr("Pertanyaan membership", "Membership questions"),
            items: [
              [tr("Bisa cuti membership?", "Can I freeze my membership?"), tr("Bisa, maksimal 2 bulan per tahun dengan surat dokter atau tiket perjalanan.", "Yes, up to 2 months a year with a doctor's note or travel ticket.")],
              [tr("Ada kontrak minimum?", "Is there a minimum term?"), tr("Paket bulanan bisa berhenti kapan saja dengan pemberitahuan 30 hari.", "Monthly plans can stop anytime with 30 days' notice.")],
            ],
          }),
          end,
        ]);
      case "stories":
        return page(gp, [
          head,
          banner(tr("Kisah member", "Member stories"), tr("Progres nyata, bukan janji", "Real progress, not promises"), tr("Cerita member yang konsisten selama minimal 6 bulan.", "Stories from members who stayed consistent for 6+ months.")),
          quotes(gp, {
            title: tr("Kata mereka", "In their words"),
            items: [
              { quote: tr("Deadlift saya naik dari 40 ke 95 kg dalam 8 bulan tanpa cedera.", "My deadlift went from 40 to 95 kg in 8 months without injury."), author: "Ratna Dewi", role: tr("Member 2 tahun", "Member for 2 years"), avatar: asset("v2a-face-3") },
              { quote: tr("Kelas pagi jam 6 membuat saya akhirnya rutin olahraga.", "The 6am class finally made me exercise regularly."), author: "Arif Nugroho", role: tr("Member 1 tahun", "Member for 1 year"), avatar: asset("v2a-face-1") },
              { quote: tr("Pelatihnya hafal nama dan cedera lutut saya.", "Coaches know my name and my knee injury."), author: "Grace Lim", role: tr("Member 9 bulan", "Member for 9 months"), avatar: asset("v2a-face-5") },
            ],
          }),
          progressBars(gp, {
            eyebrow: tr("Target komunitas 2026", "2026 community goals"),
            title: tr("Bersama menuju 1 juta repetisi", "Together toward a million reps"),
            bars: [[tr("Repetisi tercatat", "Reps logged"), 72], [tr("Member ikut Run Club", "Members in Run Club"), 54], [tr("Kelas penuh bulan ini", "Classes full this month"), 88]],
            side: { image: asset("v2a-gym-class"), alt: tr("Kelas grup", "Group class") },
          }),
          end,
        ]);
      case "contact":
        return page(gp, [
          head,
          contact(gp, {
            eyebrow: tr("Trial 3 hari gratis", "Free 3-day trial"),
            title: tr("Coba dulu, putuskan nanti", "Try first, decide later"),
            text: tr("Isi formulir, tim kami menghubungi dalam 1 jam kerja.", "Fill in the form and we'll call within 1 business hour."),
            info: [[tr("Alamat", "Address"), "Jl. Kemang Raya 12, Jakarta Selatan"], [tr("Telepon", "Phone"), "+62 21 7199 0606"], [tr("Jam buka", "Hours"), tr("Sen–Sab 05.30–22.00 · Min 08.00–16.00", "Mon–Sat 5:30am–10pm · Sun 8am–4pm")]],
            fields: [
              { kind: "input", label: tr("Nama lengkap", "Full name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" },
              { kind: "select", label: tr("Target utama", "Main goal"), ph: tr("Pilih target", "Choose a goal"), options: [tr("Turun berat badan", "Lose weight"), tr("Lebih kuat", "Get stronger"), tr("Lebih bugar", "Get fitter"), tr("Pemulihan cedera", "Injury recovery")] },
              { kind: "date", label: tr("Tanggal trial", "Trial date") },
            ],
            submit: tr("Ambil trial gratis", "Claim free trial"),
          }),
          cards(gp, {
            eyebrow: tr("Fasilitas", "Facilities"),
            title: tr("Yang menunggu di sana", "What's waiting for you"),
            variant: "line",
            cols: 4,
            items: [
              { title: tr("Rak squat ×8", "8 squat racks"), text: tr("Platform angkat beban penuh.", "Full lifting platforms.") },
              { title: tr("Studio kelas", "Class studio"), text: tr("Lantai kayu & sound system.", "Wood floor & sound system.") },
              { title: tr("Rooftop", "Rooftop"), text: tr("Area lari & conditioning.", "Running & conditioning area.") },
              { title: tr("Ruang bilas", "Showers"), text: tr("Air hangat, sabun & sampo.", "Hot water, soap & shampoo.") },
            ],
          }),
          end,
        ]);
      default:
        return page(gp, [
          head,
          heroSplit(gp, {
            badge: tr("Buka 05.30 · Kemang, Jakarta", "Opens 5:30am · Kemang, Jakarta"),
            title: tr("Latihan keras. Hasil terukur.", "Train hard. Measure everything."),
            text: tr("Gym boutique dengan kelas kecil, pelatih bersertifikat, dan program yang dievaluasi setiap 4 minggu.", "A boutique gym with small classes, certified coaches, and programs reviewed every 4 weeks."),
            actions: [[tr("Trial 3 hari gratis", "3-day free trial"), href("contact")], [tr("Lihat jadwal", "See schedule"), href("schedule"), "light"]],
            image: asset("v2a-gym-hero"),
            alt: tr("Dumbel di lantai gym", "Dumbbells on the gym floor"),
            bg: "#0a0a0a",
            light: true,
            size: 60,
          }),
          counter(gp, { items: [tr("1.800+ | Member aktif", "1,800+ | Active members"), tr("62 | Kelas per minggu", "62 | Classes per week"), tr("14 | Pelatih bersertifikat", "14 | Certified coaches"), tr("4,9 | Rating Google", "4.9 | Google rating")], dark: true, bg: "#171717" }),
          cards(gp, {
            eyebrow: tr("Program", "Programs"),
            title: tr("Pilih jalur latihanmu", "Choose your training track"),
            variant: "dark",
            items: [
              { icon: "⚡", title: "Pulse HIIT", text: tr("Bakar kalori dalam 45 menit dengan interval terstruktur.", "Burn calories in 45 minutes of structured intervals."), meta: tr("Pemula–menengah", "Beginner–intermediate") },
              { icon: "🏋", title: "Strength Lab", text: tr("Teknik squat, deadlift, dan press dengan beban progresif.", "Squat, deadlift, and press technique with progressive loading."), meta: tr("Semua level", "All levels") },
              { icon: "🥊", title: "Boxing Basics", text: tr("Kombinasi pukulan, footwork, dan kondisi fisik.", "Punch combos, footwork, and conditioning."), meta: tr("Pemula", "Beginner") },
            ],
          }),
          ctaBox(gp, { title: tr("Minggu pertama gratis untuk tetangga Kemang", "First week free for Kemang neighbors"), text: tr("Tunjukkan KTP domisili Jakarta Selatan di meja depan.", "Show a South Jakarta ID at the front desk."), actions: [[tr("Daftar trial", "Book a trial"), href("contact"), "dark"]], bg: GP.primary }),
          end,
        ]);
    }
  },
};

/* ------------------- 3. Beauty Salon Ayu (PREMIUM, 6 hlm) ------------ */

const SA: Palette = { ink: "#4a1d2f", muted: "#8a5a6b", primary: "#be185d", primaryDark: "#9d174d", soft: "#fdf2f8", line: "#f9d5e5" };
const sa = look(SA, { bg: "#fffafc", alt: "#fdf2f8", dark: "#3b0d22", radius: 28, headFont: FONTS.elegant, font: FONTS.elegant, page: "#fffafc" });

export const beautySalonAyu: TemplateContent = {
  brand: "Ayu Rupa Salon",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("prices", ["daftar-harga", "Daftar Harga"], ["price-list", "Price List"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("booking", ["booking", "Booking"], ["book", "Book"]),
  ],
  build: (key, tr, href) => {
    const head = headerBar("Ayu Rupa", sa, {
      info: [tr("Selasa–Minggu 10.00–20.00", "Tue–Sun 10am–8pm"), "WhatsApp +62 811 3456 2020", "Jl. Gandaria 8, Jakarta"],
      cta: linkButton(tr("Booking", "Book now"), href("booking"), "primary", SA),
    });
    const end = footer(
      "Ayu Rupa Salon",
      tr("Salon rambut, kuku, dan perawatan tubuh dengan produk vegan.", "Hair, nails, and body treatments with vegan products."),
      [
        { title: tr("Layanan", "Services"), items: [tr("Potong & warna", "Cut & color"), "Nail art", "Spa & lulur"] },
        { title: tr("Kunjungi", "Visit"), items: ["Jl. Gandaria 8, Jakarta", "+62 811 3456 2020"] },
      ],
      tr("© 2026 Ayu Rupa Salon. Harga contoh.", "© 2026 Ayu Rupa Salon. Sample prices."),
      "#3b0d22",
    );
    switch (key) {
      case "services":
        return page(sa, [
          head,
          pageBanner(sa, { title: tr("Layanan kami", "Our services"), text: tr("Setiap layanan diawali konsultasi 10 menit tanpa biaya.", "Every service starts with a free 10-minute consultation."), align: "center", eyebrow: tr("Rambut · Kuku · Tubuh", "Hair · Nails · Body") }),
          cards(sa, {
            title: tr("Perawatan unggulan", "Signature treatments"),
            variant: "num",
            items: [
              { title: tr("Potong & styling", "Cut & styling"), text: tr("Potongan sesuai bentuk wajah, termasuk keramas dan blow.", "A cut for your face shape, with wash and blow-dry."), meta: tr("60 menit", "60 min") },
              { title: tr("Pewarnaan balayage", "Balayage color"), text: tr("Gradasi alami dengan pewarna bebas amonia.", "Natural gradients with ammonia-free color."), meta: tr("150 menit", "150 min") },
              { title: tr("Keratin smoothing", "Keratin smoothing"), text: tr("Rambut lebih lembut hingga 4 bulan.", "Smoother hair for up to 4 months."), meta: tr("120 menit", "120 min") },
              { title: "Gel manicure", text: tr("Tahan 3 minggu, 80 pilihan warna.", "Lasts 3 weeks, 80 shades."), meta: tr("45 menit", "45 min") },
              { title: tr("Lulur Jawa", "Javanese body scrub"), text: tr("Lulur kunyit & beras dengan pijat ringan.", "Turmeric & rice scrub with a light massage."), meta: tr("90 menit", "90 min") },
              { title: tr("Facial hidrasi", "Hydrating facial"), text: tr("Untuk kulit kusam dan dehidrasi.", "For dull, dehydrated skin."), meta: tr("60 menit", "60 min") },
            ],
          }),
          story(sa, {
            eyebrow: tr("Bahan yang kami pakai", "What we use"),
            title: tr("Lembut untuk rambut, ramah untuk bumi", "Gentle on hair, kind to the planet"),
            paras: [tr("Kami memakai produk vegan bersertifikat dan sampo bebas sulfat. Botol kosong dikembalikan ke pemasok untuk diisi ulang.", "We use certified vegan products and sulfate-free shampoos. Empty bottles go back to suppliers for refills.")],
            bullets: [tr("Pewarna bebas amonia", "Ammonia-free color"), tr("Alat disterilkan UV setiap pemakaian", "Tools UV-sterilized after each use"), tr("Handuk katun organik", "Organic cotton towels")],
            image: asset("v2a-salon-spa"),
            alt: tr("Area perawatan", "Treatment area"),
            reverse: true,
            bg: sa.alt,
          }),
          end,
        ]);
      case "prices":
        return page(sa, [
          head,
          menuBoard(sa, {
            eyebrow: tr("Daftar harga 2026", "2026 price list"),
            title: tr("Harga jelas sebelum duduk", "Clear prices before you sit down"),
            groups: [
              { title: tr("Rambut", "Hair"), items: [[tr("Potong wanita", "Women's cut"), tr("Termasuk keramas & blow", "Includes wash & blow-dry"), "Rp180rb"], [tr("Potong pria", "Men's cut"), tr("Termasuk keramas", "Includes wash"), "Rp120rb"], ["Balayage", tr("Rambut sebahu", "Shoulder length"), "Rp1,2jt"]] },
              { title: tr("Kuku", "Nails"), items: [["Gel manicure", tr("Satu warna", "Single color"), "Rp220rb"], ["Nail art", tr("Per jari, desain sederhana", "Per nail, simple design"), "Rp25rb"], ["Pedicure spa", tr("Rendam, scrub, masker", "Soak, scrub, mask"), "Rp250rb"]] },
              { title: tr("Tubuh & wajah", "Body & face"), items: [[tr("Lulur Jawa", "Javanese scrub"), tr("90 menit", "90 min"), "Rp390rb"], [tr("Facial hidrasi", "Hydrating facial"), tr("60 menit", "60 min"), "Rp350rb"], [tr("Pijat refleksi", "Reflexology"), tr("45 menit", "45 min"), "Rp180rb"]] },
            ],
          }),
          plans(sa, {
            eyebrow: tr("Paket spesial", "Special packages"),
            title: tr("Untuk hari yang penting", "For days that matter"),
            items: [
              { plan: tr("Me Time", "Me Time"), price: "Rp650rb", period: "", description: tr("Satu sore untuk diri sendiri.", "An afternoon just for you."), features: [tr("Facial hidrasi", "Hydrating facial"), "Gel manicure", tr("Teh & kudapan", "Tea & snacks")], buttonText: tr("Booking", "Book"), buttonHref: href("booking") },
              { plan: "Bridal", price: "Rp3,5jt", period: "", description: tr("Persiapan 2 hari sebelum akad.", "Prep two days before the ceremony."), features: [tr("Lulur & facial", "Scrub & facial"), tr("Hair do & trial", "Hair styling + trial"), tr("Nail art pengantin", "Bridal nail art"), tr("Untuk 2 orang", "For 2 people")], buttonText: tr("Konsultasi", "Consult us"), buttonHref: href("booking"), featured: true, badge: tr("Favorit", "Favorite") },
              { plan: tr("Ibu & Anak", "Mom & Kid"), price: "Rp480rb", period: "", description: tr("Berdua, lebih seru.", "Better together."), features: [tr("2 potong rambut", "2 haircuts"), tr("Manicure anak", "Kids' manicure"), tr("Hair mask", "Hair mask")], buttonText: tr("Booking", "Book"), buttonHref: href("booking") },
            ],
          }),
          end,
        ]);
      case "gallery":
        return page(sa, [
          head,
          portfolioMosaic(sa, tr, {
            eyebrow: tr("Hasil karya", "Our work"),
            title: tr("Sebelum pulang, foto dulu", "One photo before you leave"),
            text: tr("Hasil asli pelanggan, diunggah dengan izin.", "Real client results, shared with permission."),
            works: [
              { title: "Honey balayage", tag: tr("Pewarnaan", "Color"), image: asset("v2a-salon-hero") },
              { title: tr("Sanggul modern", "Modern updo"), tag: "Bridal", image: asset("v2a-salon-spa") },
              { title: "Milky nails", tag: "Nail art", image: asset("v2a-salon-hero") },
              { title: tr("Bob bertekstur", "Textured bob"), tag: tr("Potong", "Cut"), image: asset("v2a-salon-spa") },
              { title: tr("Lulur kunyit", "Turmeric scrub"), tag: "Spa", image: asset("v2a-salon-hero") },
            ],
            cta: { label: tr("Booking sekarang", "Book now"), href: href("booking") },
          }),
          gallery(sa, {
            title: tr("Suasana salon", "Inside the salon"),
            cols: 4,
            images: [
              [asset("v2a-salon-spa"), tr("Kursi styling", "Styling chairs")],
              [asset("v2a-salon-hero"), tr("Meja kuku", "Nail bar")],
              [asset("v2a-salon-spa"), tr("Ruang spa", "Spa room")],
              [asset("v2a-salon-hero"), tr("Ruang tunggu", "Lounge")],
            ],
            bg: sa.alt,
          }),
          end,
        ]);
      case "about":
        return page(sa, [
          head,
          story(sa, {
            eyebrow: tr("Tentang kami", "About us"),
            title: tr("Salon keluarga sejak 2012", "A family salon since 2012"),
            paras: [tr("Ayu Rupa dibuka oleh Ibu Rahayu dan dua putrinya di garasi rumah. Kini ada 9 stylist dan 4 terapis di Gandaria.", "Ayu Rupa was opened by Mrs. Rahayu and her two daughters in their garage. Today we have 9 stylists and 4 therapists in Gandaria."), tr("Kami percaya salon yang baik membuat Anda merasa didengar, bukan sekadar dipotong rambutnya.", "We believe a good salon makes you feel heard, not just trimmed.")],
            image: asset("v2a-salon-hero"),
            alt: tr("Cermin salon", "Salon mirror"),
          }),
          people(sa, {
            eyebrow: "Stylist",
            title: tr("Tangan-tangan terampil", "Skilled hands"),
            round: true,
            items: [
              { name: "Rahayu", role: tr("Pendiri · master stylist", "Founder · master stylist"), photo: asset("v2a-face-6") },
              { name: "Dinda", role: tr("Spesialis warna", "Color specialist"), photo: asset("v2a-face-3") },
              { name: "Kirana", role: "Nail artist", photo: asset("v2a-face-5") },
              { name: "Wulan", role: tr("Terapis spa", "Spa therapist"), photo: asset("v2a-face-1") },
            ],
          }),
          end,
        ]);
      case "booking":
        return page(sa, [
          head,
          contact(sa, {
            eyebrow: tr("Booking online", "Online booking"),
            title: tr("Pilih jadwal favorit Anda", "Choose your favorite slot"),
            text: tr("Konfirmasi dikirim via WhatsApp. Pembatalan gratis hingga 6 jam sebelumnya.", "Confirmation arrives on WhatsApp. Free cancellation up to 6 hours before."),
            info: [[tr("Telepon", "Phone"), "+62 811 3456 2020"], [tr("Alamat", "Address"), "Jl. Gandaria 8, Jakarta Selatan"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "select", label: tr("Layanan", "Service"), ph: tr("Pilih layanan", "Choose a service"), options: [tr("Potong & styling", "Cut & styling"), "Balayage", "Gel manicure", tr("Lulur Jawa", "Javanese scrub"), tr("Paket Bridal", "Bridal package")] },
              { kind: "select", label: "Stylist", ph: tr("Siapa saja", "Anyone"), options: ["Rahayu", "Dinda", "Kirana", "Wulan"] },
              { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            ],
            submit: tr("Kirim booking", "Send booking"),
            formFirst: true,
          }),
          faqList(sa, {
            title: tr("Sebelum datang", "Before you come"),
            items: [
              [tr("Perlu keramas dulu?", "Should I wash my hair first?"), tr("Tidak perlu, keramas termasuk di semua layanan rambut.", "No need, washing is included in all hair services.")],
              [tr("Aman untuk ibu hamil?", "Safe during pregnancy?"), tr("Kami punya pilihan pewarna & perawatan khusus. Beri tahu saat booking.", "We have pregnancy-safe color and treatments. Tell us when booking.")],
            ],
          }),
          end,
        ]);
      default:
        return page(sa, [
          head,
          heroSplit(sa, {
            eyebrow: tr("Salon & spa · Gandaria", "Salon & spa · Gandaria"),
            title: tr("Rambut indah, hati tenang", "Beautiful hair, calm mind"),
            text: tr("Stylist berpengalaman, produk vegan, dan ruangan yang sunyi. Datang untuk potong rambut, pulang dengan perasaan baru.", "Experienced stylists, vegan products, and a quiet room. Come for a haircut, leave feeling new."),
            actions: [[tr("Booking jadwal", "Book a slot"), href("booking")], [tr("Daftar harga", "Price list"), href("prices"), "outline"]],
            image: asset("v2a-salon-hero"),
            alt: tr("Cermin dan sisir salon", "Salon mirror and comb"),
            reverse: true,
            gradient: [SA.soft, "#fffafc", 160],
          }),
          servicesSplit(sa, tr, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Tiga ruang, satu kenyamanan", "Three rooms, one comfort"),
            image: asset("v2a-salon-spa"),
            items: [
              { icon: "✂", title: tr("Rambut", "Hair"), text: tr("Potong, warna, keratin, dan sanggul.", "Cuts, color, keratin, and updos.") },
              { icon: "💅", title: tr("Kuku", "Nails"), text: tr("Gel, nail art, dan pedicure spa.", "Gel, nail art, and spa pedicures.") },
              { icon: "🌿", title: tr("Tubuh", "Body"), text: tr("Lulur, facial, dan pijat refleksi.", "Scrubs, facials, and reflexology.") },
            ],
            cta: { label: tr("Semua layanan", "All services"), href: href("services") },
          }),
          testimonialsWall(sa, tr, {
            eyebrow: tr("Ulasan", "Reviews"),
            title: tr("Pelanggan setia sejak lama", "Loyal clients for years"),
            score: 4.9,
            caption: tr("dari 1.240 ulasan Google", "from 1,240 Google reviews"),
            quotes: [
              { text: tr("Balayage paling natural yang pernah saya punya.", "The most natural balayage I've ever had."), name: "Sinta W.", role: tr("Pelanggan sejak 2019", "Client since 2019"), avatar: asset("v2a-face-3") },
              { text: tr("Paket bridal-nya rapi, tim datang tepat waktu.", "The bridal package was flawless and on time."), name: "Mega R.", role: tr("Pengantin 2025", "2025 bride"), avatar: asset("v2a-face-5") },
              { text: tr("Tempat paling tenang di Jakarta Selatan.", "The calmest place in South Jakarta."), name: "Tiara A.", role: tr("Pelanggan spa", "Spa client"), avatar: asset("v2a-face-1") },
            ],
          }),
          ctaBand(sa, tr, { title: tr("Diskon 15% untuk kunjungan pertama", "15% off your first visit"), text: tr("Sebutkan kode AYUBARU saat booking.", "Mention code AYUBARU when booking."), primary: { label: tr("Booking sekarang", "Book now"), href: href("booking") }, secondary: { label: tr("Lihat galeri", "See gallery"), href: href("gallery") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 4. Bengkel Rodaprima (PREMIUM, 5 hlm) ----------- */

const BR: Palette = { ink: "#111827", muted: "#4b5563", primary: "#dc2626", primaryDark: "#b91c1c", soft: "#fee2e2", line: "#fecaca" };
const br = look(BR, { bg: "#ffffff", alt: "#f3f4f6", dark: "#111827", radius: 4, headFont: FONTS.grotesk, font: FONTS.sans });

export const automotiveBengkel: TemplateContent = {
  brand: "Bengkel Rodaprima",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("packages", ["paket-servis", "Paket Servis"], ["service-plans", "Service Plans"]), pg("booking", ["booking-servis", "Booking Servis"], ["book-service", "Book a Service"]), pg("location", ["lokasi", "Lokasi"], ["location", "Location"])],
  build: (key, tr, href) => {
    const head = header("RODAPRIMA", BR, { bg: "#111827", ink: "#ffffff", font: FONTS.grotesk, cta: linkButton(tr("Booking servis", "Book service"), href("booking"), "primary", BR) });
    const end = footer(
      "Rodaprima",
      tr("Bengkel umum mobil Jepang & Eropa. Garansi servis 30 hari.", "Independent garage for Japanese & European cars. 30-day service warranty."),
      [
        { title: tr("Layanan", "Services"), items: [tr("Servis berkala", "Scheduled service"), tr("Kaki-kaki", "Suspension"), tr("AC mobil", "Car A/C"), tr("Kelistrikan", "Electrical")] },
        { title: tr("Bengkel", "Garage"), items: ["Jl. Raya Bogor Km 21, Jakarta Timur", "+62 21 8770 2121", tr("Sen–Sab 08.00–18.00", "Mon–Sat 8am–6pm")] },
      ],
      tr("© 2026 Bengkel Rodaprima. Harga estimasi, contoh.", "© 2026 Bengkel Rodaprima. Sample estimates."),
      "#030712",
    );
    switch (key) {
      case "services":
        return page(br, [
          head,
          pageBanner(br, { eyebrow: tr("Layanan bengkel", "Garage services"), title: tr("Diagnosis dulu, baru perbaikan", "Diagnose first, fix second"), text: tr("Scanner OBD2 dan foto kondisi komponen dikirim ke WhatsApp sebelum kami mengganti apa pun.", "OBD2 scans and component photos go to your WhatsApp before we replace anything."), light: true }),
          tabsBlock(br, {
            title: tr("Area perbaikan", "What we fix"),
            variant: "boxed",
            tabs: [
              [tr("Mesin", "Engine"), tr("Tune-up, ganti oli & filter, timing belt, overhaul ringan. Estimasi 2–6 jam.", "Tune-ups, oil & filter, timing belts, light overhauls. 2–6 hours.")],
              [tr("Kaki-kaki", "Suspension"), tr("Shock absorber, tie rod, bushing, spooring & balancing komputer.", "Shock absorbers, tie rods, bushings, computerized alignment & balancing.")],
              [tr("AC", "A/C"), tr("Kuras evaporator, isi freon R134a, ganti kompresor.", "Evaporator flush, R134a refill, compressor replacement.")],
              [tr("Kelistrikan", "Electrical"), tr("Aki, alternator, starter, dan lampu LED.", "Batteries, alternators, starters, and LED lights.")],
            ],
          }),
          tableBlock(br, {
            eyebrow: tr("Pemeriksaan 30 titik", "30-point inspection"),
            title: tr("Yang kami cek di setiap servis", "What we check every service"),
            columns: [tr("Sistem", "System"), tr("Komponen", "Components"), tr("Laporan", "Report")],
            rows: [
              [tr("Mesin", "Engine"), tr("Oli, filter, busi, belt", "Oil, filter, plugs, belts"), tr("Foto + catatan", "Photo + notes")],
              [tr("Rem", "Brakes"), tr("Kampas, cakram, minyak rem", "Pads, discs, fluid"), tr("Ketebalan (mm)", "Thickness (mm)")],
              [tr("Kaki-kaki", "Suspension"), tr("Shock, bushing, ball joint", "Shocks, bushings, ball joints"), tr("Video uji jalan", "Road test video")],
              [tr("Kelistrikan", "Electrical"), tr("Aki, alternator, lampu", "Battery, alternator, lights"), tr("Hasil tes volt", "Voltage test")],
            ],
            bg: br.alt,
          }),
          end,
        ]);
      case "packages":
        return page(br, [
          head,
          plans(br, {
            eyebrow: tr("Paket servis", "Service plans"),
            title: tr("Harga transparan, termasuk jasa", "Transparent prices, labor included"),
            text: tr("Untuk mobil 1.300–2.000 cc. Mobil diesel & Eropa menyesuaikan.", "For 1,300–2,000 cc cars. Diesel & European cars vary."),
            items: [
              { plan: tr("Servis Ringan", "Basic Service"), price: "Rp450rb", period: "", description: tr("Tiap 5.000 km", "Every 5,000 km"), features: [tr("Oli mesin 4 L", "4 L engine oil"), tr("Filter oli", "Oil filter"), tr("Cek 30 titik", "30-point check")], buttonText: tr("Booking", "Book"), buttonHref: href("booking") },
              { plan: tr("Servis Berkala", "Scheduled Service"), price: "Rp1,1jt", period: "", description: tr("Tiap 20.000 km", "Every 20,000 km"), features: [tr("Semua Servis Ringan", "Everything in Basic"), tr("Filter udara & kabin", "Air & cabin filters"), tr("Busi iridium", "Iridium plugs"), tr("Kuras minyak rem", "Brake fluid flush")], buttonText: tr("Booking", "Book"), buttonHref: href("booking"), featured: true, badge: tr("Paling dipilih", "Most chosen") },
              { plan: tr("Servis Lengkap", "Full Service"), price: "Rp2,4jt", period: "", description: tr("Tiap 40.000 km", "Every 40,000 km"), features: [tr("Semua Servis Berkala", "Everything in Scheduled"), tr("Kuras transmisi", "Transmission flush"), tr("Kuras radiator", "Coolant flush"), tr("Spooring & balancing", "Alignment & balancing")], buttonText: tr("Booking", "Book"), buttonHref: href("booking") },
            ],
          }),
          faqList(br, {
            title: tr("Soal biaya & garansi", "Pricing & warranty"),
            items: [
              [tr("Apakah ada biaya tambahan?", "Any hidden costs?"), tr("Tidak. Penggantian di luar paket selalu minta persetujuan Anda dulu.", "No. Anything outside the plan needs your approval first.")],
              [tr("Garansinya berapa lama?", "How long is the warranty?"), tr("30 hari atau 1.000 km untuk jasa dan suku cadang.", "30 days or 1,000 km on labor and parts.")],
              [tr("Bisa pakai suku cadang sendiri?", "Can I bring my own parts?"), tr("Bisa, namun garansi hanya untuk jasa.", "Yes, but the warranty covers labor only.")],
            ],
          }),
          end,
        ]);
      case "booking":
        return page(br, [
          head,
          contact(br, {
            eyebrow: tr("Booking servis", "Book a service"),
            title: tr("Datang tanpa antre", "Skip the queue"),
            text: tr("Slot pagi (08.00–10.00) selesai di hari yang sama untuk servis ringan.", "Morning slots (8–10am) finish the same day for basic service."),
            info: [[tr("Telepon", "Phone"), "+62 21 8770 2121"], [tr("Derek 24 jam", "24-hour towing"), "+62 811 8770 2121"]],
            fields: [
              { kind: "input", label: tr("Nama pemilik", "Owner name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Nomor polisi", "Plate number"), ph: "B 1234 XYZ" },
              { kind: "input", label: tr("Merek & tipe", "Make & model"), ph: "Toyota Avanza 2019" },
              { kind: "select", label: tr("Layanan", "Service"), ph: tr("Pilih layanan", "Choose a service"), options: [tr("Servis Ringan", "Basic Service"), tr("Servis Berkala", "Scheduled Service"), tr("Servis Lengkap", "Full Service"), tr("Keluhan lain", "Other issue")] },
              { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            ],
            submit: tr("Kirim booking", "Send booking"),
          }),
          progressBars(br, {
            eyebrow: tr("Contoh pelacakan", "Tracking example"),
            title: tr("Pantau mobil Anda dari HP", "Follow your car from your phone"),
            text: tr("Status pengerjaan diperbarui oleh mekanik setiap tahap.", "Mechanics update the status at every stage."),
            bars: [[tr("Diagnosis", "Diagnosis"), 100], [tr("Penggantian suku cadang", "Parts replacement"), 70], [tr("Uji jalan", "Road test"), 20], [tr("Cuci & serah terima", "Wash & handover"), 0]],
            bg: br.alt,
          }),
          end,
        ]);
      case "location":
        return page(br, [
          head,
          pageBanner(br, { eyebrow: tr("Lokasi", "Location"), title: tr("Mampir ke bengkel", "Drop by the garage"), text: tr("Jl. Raya Bogor Km 21, 200 m setelah halte Transjakarta Pasar Rebo.", "Jl. Raya Bogor Km 21, 200 m past the Pasar Rebo Transjakarta stop.") }),
          gallery(br, {
            title: tr("Fasilitas bengkel", "Garage facilities"),
            images: [
              [asset("v2a-auto-hero"), tr("6 lift hidrolik", "6 hydraulic lifts")],
              [asset("v2a-auto-suv"), tr("Ruang tunggu ber-AC", "Air-conditioned lounge")],
              [asset("v2a-auto-hero"), tr("Mesin spooring 3D", "3D alignment machine")],
            ],
            ratio: "4 / 3",
          }),
          tableBlock(br, {
            title: tr("Jam operasional", "Opening hours"),
            columns: [tr("Hari", "Day"), tr("Jam", "Hours")],
            rows: [[tr("Senin–Jumat", "Monday–Friday"), "08.00–18.00"], [tr("Sabtu", "Saturday"), "08.00–15.00"], [tr("Minggu & libur", "Sunday & holidays"), tr("Derek darurat saja", "Emergency towing only")]],
            bg: br.alt,
          }),
          end,
        ]);
      default:
        return page(br, [
          head,
          heroSplit(br, {
            badge: tr("Garansi servis 30 hari", "30-day service warranty"),
            title: tr("Bengkel jujur untuk mobil keluarga", "An honest garage for family cars"),
            text: tr("Mekanik bersertifikat, suku cadang asli, dan foto bukti setiap penggantian. Tanpa kejutan di kasir.", "Certified mechanics, genuine parts, and photo proof of every replacement. No surprises at checkout."),
            actions: [[tr("Booking servis", "Book a service"), href("booking")], [tr("Paket & harga", "Plans & prices"), href("packages"), "light"]],
            image: asset("v2a-auto-hero"),
            alt: tr("Mobil merah", "A red car"),
            bg: "#111827",
            light: true,
          }),
          figures(br, { items: [["18", tr("Tahun berdiri", "Years running")], ["9.400+", tr("Mobil diservis", "Cars serviced")], ["12", tr("Mekanik", "Mechanics")], ["4,8★", tr("Rating Google", "Google rating")]] }),
          cards(br, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Satu bengkel untuk semua keluhan", "One garage for every issue"),
            variant: "line",
            cols: 4,
            items: [
              { title: tr("Servis berkala", "Scheduled service"), text: tr("Sesuai buku manual pabrikan.", "Following the manufacturer manual.") },
              { title: tr("Kaki-kaki", "Suspension"), text: tr("Bunyi gluduk hilang, setir kembali presisi.", "No more clunks, precise steering again.") },
              { title: tr("AC mobil", "Car A/C"), text: tr("Dingin lagi dalam 2 jam.", "Cold again in 2 hours.") },
              { title: tr("Kelistrikan", "Electrical"), text: tr("Aki, alternator, starter.", "Battery, alternator, starter.") },
            ],
          }),
          process(br, {
            title: tr("Cara kerja kami", "How we work"),
            steps: [
              [tr("Booking", "Book"), tr("Pilih jam lewat web atau WhatsApp.", "Pick a time online or on WhatsApp.")],
              [tr("Diagnosis", "Diagnose"), tr("Scan & foto kondisi komponen.", "Scan & photograph components.")],
              [tr("Persetujuan", "Approve"), tr("Anda setujui estimasi dulu.", "You approve the estimate first.")],
              [tr("Serah terima", "Handover"), tr("Mobil dicuci & laporan dikirim.", "Car washed & report sent.")],
            ],
          }),
          quotes(br, {
            title: tr("Kata pelanggan", "What drivers say"),
            items: [
              { quote: tr("Diberi foto kampas rem yang aus sebelum diganti. Baru kali ini bengkel transparan begini.", "They sent a photo of the worn brake pads before replacing them. First time a garage was this transparent."), author: "Hendra K.", role: "Honda HR-V 2018", avatar: asset("v2a-face-2"), rating: 5 },
              { quote: tr("Servis berkala selesai 3 jam, ruang tunggunya nyaman buat kerja.", "Scheduled service done in 3 hours, the lounge is great for working."), author: "Melati S.", role: "Toyota Rush 2021", avatar: asset("v2a-face-3"), rating: 5 },
            ],
            cols: 2,
          }),
          ctaBox(br, { title: tr("Mobil mogok? Kami jemput.", "Broken down? We'll tow you."), text: tr("Layanan derek 24 jam untuk wilayah Jakarta Timur & Depok.", "24-hour towing across East Jakarta & Depok."), actions: [[tr("Hubungi derek", "Call towing"), href("location"), "light"]] }),
          end,
        ]);
    }
  },
};

/* ------------------- 5. Finance Dana Arta (PREMIUM, 8 hlm) ----------- */

const FD: Palette = { ink: "#0b2545", muted: "#475569", primary: "#047857", primaryDark: "#065f46", soft: "#ecfdf5", line: "#a7f3d0" };
const fd = look(FD, { bg: "#ffffff", alt: "#f1f5f9", dark: "#0b2545", radius: 10, headFont: FONTS.serif, font: FONTS.sans });

export const financeDana: TemplateContent = {
  brand: "Dana Arta Finansial",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("fees", ["biaya", "Biaya"], ["fees", "Fees"]),
    pg("advisors", ["perencana", "Perencana"], ["advisors", "Advisors"]),
    pg("insights", ["wawasan", "Wawasan"], ["insights", "Insights"]),
    pg("article", ["artikel-dana-darurat", "Artikel"], ["emergency-fund-article", "Article"]),
    pg("faq", ["tanya-jawab", "Tanya Jawab"], ["faq", "FAQ"]),
    pg("contact", ["konsultasi", "Konsultasi"], ["consultation", "Consultation"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(
      fd,
      [
        `${tr("Layanan", "Services")} | ${href("services")}`,
        `- ${tr("Perencanaan keuangan", "Financial planning")} | ${tr("Peta jalan 10 tahun keluarga", "A 10-year family roadmap")} | ${href("services")}`,
        `- ${tr("Dana pensiun", "Retirement")} | ${tr("Hitung kebutuhan & strategi", "Needs & strategy")} | ${href("services")}`,
        `- ${tr("Investasi", "Investing")} | ${tr("Reksa dana & obligasi", "Mutual funds & bonds")} | ${href("services")}`,
        `${tr("Biaya", "Fees")} | ${href("fees")}`,
        `${tr("Perencana", "Advisors")} | ${href("advisors")}`,
        `${tr("Wawasan", "Insights")} | ${href("insights")}`,
        `- ${tr("Artikel", "Articles")} | ${tr("Panduan uang sehari-hari", "Everyday money guides")} | ${href("insights")}`,
        `- ${tr("Tanya jawab", "FAQ")} | ${tr("Pertanyaan umum", "Common questions")} | ${href("faq")}`,
      ],
      tr("Konsultasi gratis", "Free consultation"),
      href("contact"),
    );
    const head = header("Dana Arta", FD, { nav, font: FONTS.serif });
    const end = footer(
      "Dana Arta Finansial",
      tr("Perencana keuangan independen bersertifikat CFP®. Kami tidak menjual produk.", "Independent CFP®-certified financial planners. We don't sell products."),
      [
        { title: tr("Layanan", "Services"), items: [tr("Perencanaan keluarga", "Family planning"), tr("Pensiun", "Retirement"), tr("Investasi", "Investing")] },
        { title: tr("Kantor", "Office"), items: ["Menara Kuningan Lt. 18, Jakarta", "+62 21 3001 8899", "halo@danaarta.example"] },
      ],
      tr("© 2026 Dana Arta. Konten edukasi, bukan rekomendasi investasi.", "© 2026 Dana Arta. Educational content, not investment advice."),
      "#0b2545",
    );
    const insights = [
      { image: asset("v2a-fin-hero"), tag: tr("Dasar", "Basics"), title: tr("Berapa dana darurat yang ideal?", "How big should your emergency fund be?"), text: tr("Rumus 3–12 kali pengeluaran dan cara mencapainya.", "The 3–12× expenses rule and how to get there."), date: "02 Okt 2026", href: href("article") },
      { image: asset("v2a-fin-plan"), tag: tr("Pensiun", "Retirement"), title: tr("Mulai pensiun di usia 30", "Start retirement at 30"), text: tr("Efek bunga majemuk jika mulai 10 tahun lebih awal.", "The compounding effect of starting 10 years earlier."), date: "18 Sep 2026", href: href("article") },
      { image: asset("v2a-fin-hero"), tag: tr("Keluarga", "Family"), title: tr("Dana pendidikan anak", "Saving for your kids' education"), text: tr("Inflasi biaya kuliah 10% per tahun: ini strateginya.", "Tuition inflation is 10% a year: here's the plan."), date: "05 Sep 2026", href: href("article") },
    ];
    switch (key) {
      case "services":
        return page(fd, [
          head,
          pageBanner(fd, { eyebrow: tr("Layanan", "Services"), title: tr("Rencana, bukan produk", "Plans, not products"), text: tr("Kami dibayar oleh Anda, bukan komisi. Jadi saran kami tidak memihak produk mana pun.", "You pay us, not commissions. So our advice favors no product."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Layanan", "Services"), ""]] }),
          tabsBlock(fd, {
            title: tr("Pilih kebutuhan Anda", "Choose your need"),
            variant: "pills",
            tabs: [
              [tr("Keluarga muda", "Young families"), tr("Anggaran, dana darurat, asuransi jiwa & kesehatan, dan dana pendidikan anak.", "Budgeting, emergency fund, life & health insurance, and education savings.")],
              [tr("Menuju pensiun", "Pre-retirement"), tr("Proyeksi kebutuhan pensiun, alokasi aset, dan strategi penarikan dana.", "Retirement needs projection, asset allocation, and withdrawal strategy.")],
              [tr("Pengusaha", "Business owners"), tr("Memisahkan keuangan pribadi & usaha, dana cadangan bisnis, perencanaan waris.", "Separating personal & business money, business reserves, estate planning.")],
            ],
          }),
          process(fd, {
            eyebrow: tr("Proses", "Process"),
            title: tr("Dari obrolan ke rencana tertulis", "From conversation to written plan"),
            steps: [
              [tr("Konsultasi awal", "Discovery call"), tr("45 menit, gratis.", "45 minutes, free.")],
              [tr("Pengumpulan data", "Data gathering"), tr("Aset, utang, arus kas.", "Assets, debt, cash flow.")],
              [tr("Rencana tertulis", "Written plan"), tr("Dokumen 20–30 halaman.", "A 20–30 page document.")],
              [tr("Tinjauan rutin", "Regular reviews"), tr("Tiap 6 bulan.", "Every 6 months.")],
            ],
          }),
          end,
        ]);
      case "fees":
        return page(fd, [
          head,
          pricingCards(fd, tr, {
            eyebrow: tr("Biaya", "Fees"),
            title: tr("Biaya tetap, tanpa komisi", "Flat fees, no commissions"),
            text: tr("Biaya dibayar sekali di awal; tinjauan berikutnya opsional.", "Paid once upfront; later reviews are optional."),
            badge: tr("Paling dipilih", "Most chosen"),
            plans: [
              { name: tr("Cek Kesehatan", "Health Check"), price: "Rp1,5jt", period: "", text: tr("Satu sesi, satu topik.", "One session, one topic."), features: [tr("Analisis arus kas", "Cash flow analysis"), tr("Rekomendasi tertulis", "Written recommendations")], cta: { label: tr("Pilih", "Choose"), href: href("contact") } },
              { name: tr("Rencana Lengkap", "Full Plan"), price: "Rp7,5jt", period: "", text: tr("Peta jalan keuangan 10 tahun.", "A 10-year financial roadmap."), features: [tr("3 sesi konsultasi", "3 consultations"), tr("Dokumen rencana lengkap", "Complete plan document"), tr("Tinjauan 6 bulan", "6-month review")], cta: { label: tr("Pilih", "Choose"), href: href("contact") }, featured: true },
              { name: tr("Pendampingan", "Ongoing"), price: "Rp1,2jt", period: tr("/bulan", "/month"), text: tr("Untuk portofolio yang aktif.", "For active portfolios."), features: [tr("Sesi bulanan", "Monthly sessions"), tr("Rebalancing", "Rebalancing"), tr("Akses chat", "Chat access")], cta: { label: tr("Pilih", "Choose"), href: href("contact") } },
            ],
          }),
          compare(fd, {
            title: tr("Bedanya dengan agen produk", "How we differ from product agents"),
            columns: [tr("Agen produk", "Product agent"), "Dana Arta"],
            rows: [tr("Dibayar dari komisi | ya | tidak", "Paid by commissions | yes | no"), tr("Rekomendasi lintas produk | tidak | ya", "Cross-product advice | no | yes"), tr("Rencana tertulis | tidak | ya", "Written plan | no | yes"), tr("Sertifikasi CFP® | tidak | ya", "CFP® certified | no | yes")],
            highlight: 1,
            caption: tr("Perbandingan umum", "General comparison"),
            bg: fd.alt,
          }),
          end,
        ]);
      case "advisors":
        return page(fd, [
          head,
          teamCards(fd, tr, {
            eyebrow: tr("Perencana", "Advisors"),
            title: tr("Bersertifikat dan terdaftar", "Certified and registered"),
            members: [
              { name: "Ratih Kusuma, CFP®", role: tr("Pendiri · pensiun", "Founder · retirement"), photo: asset("v2a-face-3") },
              { name: "Yoga Prasetyo, CFP®", role: tr("Keluarga muda", "Young families"), photo: asset("v2a-face-2") },
              { name: "Lina Halim, CFA", role: tr("Investasi", "Investments"), photo: asset("v2a-face-5") },
              { name: "Fajar Ramadhan", role: tr("Pajak & waris", "Tax & estate"), photo: asset("v2a-face-4") },
            ],
          }),
          story(fd, {
            eyebrow: tr("Prinsip kami", "Our principles"),
            title: tr("Fidusia: kepentingan Anda di atas segalanya", "Fiduciary: your interest comes first"),
            paras: [tr("Setiap perencana menandatangani kode etik fidusia dan wajib mengungkapkan potensi konflik kepentingan secara tertulis.", "Every advisor signs a fiduciary code and must disclose any potential conflict of interest in writing.")],
            bullets: [tr("Tidak menerima komisi produk", "No product commissions"), tr("Data dienkripsi & tidak dibagikan", "Data encrypted & never shared"), tr("Pendidikan lanjutan 40 jam/tahun", "40 hours of training per year")],
            image: asset("v2a-fin-plan"),
            alt: tr("Grafik perencanaan", "Planning chart"),
            reverse: true,
          }),
          end,
        ]);
      case "insights":
        return page(fd, [
          head,
          pageBanner(fd, { eyebrow: tr("Wawasan", "Insights"), title: tr("Panduan uang yang mudah dipahami", "Money guides that make sense"), text: tr("Artikel baru setiap dua minggu, ditulis perencana kami.", "New articles every two weeks, written by our planners.") }),
          posts(fd, { title: tr("Artikel terbaru", "Latest articles"), readLabel: tr("Baca", "Read"), items: insights }),
          ctaBox(fd, { title: tr("Ingin rencana yang dibuat khusus?", "Want a plan made for you?"), actions: [[tr("Konsultasi gratis", "Free consultation"), href("contact"), "light"]], bg: FD.primaryDark }),
          end,
        ]);
      case "article":
        return page(fd, [
          head,
          ...article(fd, {
            crumbs: [[tr("Wawasan", "Insights"), href("insights")], [tr("Dana darurat", "Emergency fund"), ""]],
            tag: tr("Dasar", "Basics"),
            title: tr("Berapa dana darurat yang ideal?", "How big should your emergency fund be?"),
            meta: tr("Ratih Kusuma, CFP® · 6 menit baca · 2 Oktober 2026", "Ratih Kusuma, CFP® · 6 min read · October 2, 2026"),
            image: asset("v2a-fin-hero"),
            lead: tr("Dana darurat adalah fondasi: tanpa itu, satu kejadian tak terduga bisa memaksa Anda menjual investasi di saat yang salah.", "An emergency fund is the foundation: without it, one surprise can force you to sell investments at the worst time."),
            blocks: [
              [tr("Rumus dasar", "The basic rule"), tr("Lajang tanpa tanggungan: 3 kali pengeluaran bulanan. Menikah: 6 kali. Dengan anak atau penghasilan tidak tetap: 9–12 kali.", "Single with no dependents: 3× monthly expenses. Married: 6×. With kids or irregular income: 9–12×.")],
              [tr("Simpan di mana?", "Where to keep it?"), tr("Di instrumen likuid dan stabil: tabungan terpisah, deposito berjangka pendek, atau reksa dana pasar uang.", "In liquid, stable places: a separate savings account, short-term deposits, or money market funds.")],
              [tr("Mulai dari kecil", "Start small"), tr("Sisihkan 10% gaji di hari gajian secara otomatis. Dalam 12–18 bulan, target 6 kali pengeluaran biasanya tercapai.", "Automatically set aside 10% on payday. In 12–18 months, a 6× target is usually reached.")],
            ],
            quote: tr("Dana darurat bukan investasi. Tugasnya hanya satu: ada saat dibutuhkan.", "An emergency fund isn't an investment. Its only job is to be there when needed."),
            bullets: [tr("Hitung pengeluaran wajib bulanan", "Calculate monthly essential spending"), tr("Tentukan kelipatan sesuai kondisi", "Pick a multiple for your situation"), tr("Otomatiskan setoran", "Automate deposits")],
          }),
          ctaBox(fd, { title: tr("Hitung kebutuhan Anda bersama perencana", "Work out your number with a planner"), actions: [[tr("Jadwalkan konsultasi", "Schedule a consultation"), href("contact"), "light"]], align: "center" }),
          end,
        ]);
      case "faq":
        return page(fd, [
          head,
          faqAccordion(fd, tr, {
            eyebrow: "FAQ",
            title: tr("Pertanyaan yang sering diajukan", "Frequently asked questions"),
            text: tr("Belum terjawab? Hubungi kami.", "Not answered? Get in touch."),
            items: [
              [tr("Apakah Dana Arta mengelola uang saya?", "Do you manage my money?"), tr("Tidak. Dana tetap di rekening atas nama Anda; kami memberi rencana dan pendampingan.", "No. Funds stay in accounts in your name; we provide the plan and guidance.")],
              [tr("Berapa minimal aset?", "Is there a minimum?"), tr("Tidak ada minimal aset.", "There's no asset minimum.")],
              [tr("Konsultasi bisa online?", "Can we meet online?"), tr("Bisa, lewat video call.", "Yes, via video call.")],
            ],
            contact: { label: tr("Konsultasi", "Consultation"), href: href("contact") },
          }),
          notice(fd, { badge: tr("Penting", "Important"), text: tr("Konten di situs ini bersifat edukasi dan bukan ajakan membeli produk keuangan tertentu.", "Content on this site is educational and not a solicitation to buy any financial product."), link: tr("Baca wawasan", "Read insights"), href: href("insights") }),
          end,
        ]);
      case "contact":
        return page(fd, [
          head,
          contact(fd, {
            eyebrow: tr("Konsultasi awal gratis", "Free discovery call"),
            title: tr("Ceritakan tujuan keuangan Anda", "Tell us your financial goals"),
            text: tr("45 menit lewat video call atau di kantor kami.", "45 minutes on video or at our office."),
            info: [[tr("Kantor", "Office"), "Menara Kuningan Lt. 18, Jakarta"], [tr("Telepon", "Phone"), "+62 21 3001 8899"], ["Email", "halo@danaarta.example"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: "Email", ph: "nama@email.com", type: "email" },
              { kind: "select", label: tr("Topik utama", "Main topic"), ph: tr("Pilih topik", "Choose a topic"), options: [tr("Dana darurat & anggaran", "Emergency fund & budget"), tr("Pensiun", "Retirement"), tr("Investasi", "Investing"), tr("Dana pendidikan", "Education fund")] },
              { kind: "date", label: tr("Waktu yang diinginkan", "Preferred time"), mode: "datetime-local" },
              { kind: "check", label: tr("Saya setuju data diproses untuk konsultasi", "I agree my data is processed for the consultation") },
            ],
            submit: tr("Jadwalkan", "Schedule"),
          }),
          end,
        ]);
      default:
        return page(fd, [
          head,
          heroSplit(fd, {
            eyebrow: tr("Perencana keuangan independen", "Independent financial planners"),
            title: tr("Tenang soal uang, fokus pada hidup", "Calm about money, focused on life"),
            text: tr("Rencana keuangan tertulis untuk keluarga Indonesia, dari dana darurat hingga pensiun, oleh perencana CFP® yang tidak menjual produk.", "Written financial plans for Indonesian families, from emergency funds to retirement, by CFP® planners who sell no products."),
            actions: [[tr("Konsultasi gratis", "Free consultation"), href("contact")], [tr("Lihat biaya", "See fees"), href("fees"), "outline"]],
            image: asset("v2a-fin-hero"),
            alt: tr("Grafik pertumbuhan", "Growth chart"),
            gradient: [FD.soft, "#ffffff", 180],
          }),
          statsBand(fd, tr, {
            eyebrow: tr("Sejak 2014", "Since 2014"),
            title: tr("Dipercaya keluarga di 22 kota", "Trusted by families in 22 cities"),
            text: tr("Angka per Juni 2026.", "Figures as of June 2026."),
            stats: [["2.300+", tr("Rencana dibuat", "Plans written")], ["Rp1,8 T", tr("Aset klien direncanakan", "Client assets planned")], ["11", tr("Perencana CFP®", "CFP® planners")], ["96%", tr("Klien memperpanjang", "Client renewals")]],
          }),
          cards(fd, {
            eyebrow: tr("Yang kami bantu", "What we help with"),
            title: tr("Satu rencana untuk semua tujuan", "One plan for every goal"),
            variant: "line",
            items: [
              { title: tr("Dana darurat", "Emergency fund"), text: tr("Bantalan 6 bulan sebelum mulai berinvestasi.", "A 6-month cushion before investing.") },
              { title: tr("Pendidikan anak", "Kids' education"), text: tr("Target biaya kuliah dengan inflasi 10%.", "Tuition targets with 10% inflation.") },
              { title: tr("Pensiun", "Retirement"), text: tr("Berapa yang cukup, dan kapan bisa berhenti bekerja.", "How much is enough, and when you can stop.") },
            ],
          }),
          quotes(fd, {
            title: tr("Cerita klien", "Client stories"),
            items: [
              { quote: tr("Untuk pertama kalinya kami tahu persis berapa yang perlu ditabung untuk kuliah anak.", "For the first time we know exactly how much to save for our kids' college."), author: "Andre & Maya", role: tr("Keluarga muda, Bekasi", "Young family, Bekasi"), avatar: asset("v2a-face-4") },
              { quote: tr("Rencana pensiunnya realistis, bukan janji imbal hasil tinggi.", "A realistic retirement plan, not promises of high returns."), author: "Pak Sutrisno", role: tr("Pensiun 2028", "Retiring 2028"), avatar: asset("v2a-face-6") },
            ],
            cols: 2,
          }),
          ctaBand(fd, tr, { title: tr("Mulai dengan obrolan 45 menit", "Start with a 45-minute chat"), text: tr("Gratis, tanpa kewajiban.", "Free, no obligation."), primary: { label: tr("Jadwalkan", "Schedule"), href: href("contact") }, secondary: { label: tr("Baca wawasan", "Read insights"), href: href("insights") } }),
          end,
        ]);
    }
  },
};
