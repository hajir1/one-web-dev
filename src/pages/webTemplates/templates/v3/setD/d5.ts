import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import {
  portfolioMosaic,
  pricingCards,
  servicesSplit,
  teamCards,
  testimonialsWall,
} from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import {
  articleBody,
  beforeAfterD,
  bento,
  cardsD,
  compareD,
  counterD,
  countdownD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroBento,
  heroCollage,
  heroMinimal,
  heroNeon,
  heroType,
  home,
  indexList,
  locations,
  lookD,
  magazine,
  marqueeD,
  newsletter,
  numbers,
  offer,
  pageHead,
  pg,
  priceSwitchD,
  pro,
  progressD,
  pullQuote,
  quotesD,
  render,
  sliderD,
  specs,
  splitPanel,
  tableD,
  tabsD,
  timelineD,
  typerD,
  videoD,
  withFx,
  wordBand,
  zigzag,
} from "./kitD";

/* ================================================================== */
/* Template v3 D21–D25: Koperasi, Apartemen, DJ, Lingkungan, Agensi SEO. */
/* ================================================================== */

/* -------------- 21. Koperasi Arta Guyub — simpan pinjam (7 hlm) ---------- */
// Premium: progress, pro-pricing-cards, testimonial. Library: AOS. Retro ramah.

const GP: Palette = { ink: "#14301c", muted: "#4d6652", primary: "#15803d", primaryDark: "#166534", soft: "#dcfce7", line: "#bbf7d0" };
const G = lookD(GP, { head: "Lora", body: "Poppins", shape: "retro", radius: 12, bg: "#fbfdf8", alt: "#f0f7e9", inv: "#14301c", fx: { aos: "fade-right" } });

const gFoot = (tr: Tr) =>
  footerD("Arta Guyub", G, {
    variant: "columns",
    about: tr("Koperasi simpan pinjam milik 8.400 anggota. Badan hukum contoh No. 123/BH/2009.", "A savings & loan cooperative owned by 8,400 members. Sample registration No. 123/BH/2009."),
    cols: [{ title: tr("Layanan", "Services"), items: [tr("Simpanan", "Savings"), tr("Pinjaman", "Loans"), tr("Keanggotaan", "Membership")] }, { title: tr("Kantor pusat", "Head office"), items: ["Jl. Diponegoro 77, Salatiga", "(0298) 320 450"] }],
    copy: tr("© 2026 Koperasi Arta Guyub. Konten contoh.", "© 2026 Arta Guyub Cooperative. Sample content."),
  });

export const financeKoperasi: TemplateContent = {
  brand: "Koperasi Arta Guyub",
  pages: [home(), pg("savings", ["simpanan", "Simpanan"], ["savings", "Savings"]), pg("loans", ["pinjaman", "Pinjaman"], ["loans", "Loans"]), pg("join", ["jadi-anggota", "Jadi Anggota"], ["become-a-member", "Become a Member"]), pg("reports", ["laporan-rat", "Laporan RAT"], ["annual-report", "Annual Report"]), pg("news", ["kabar", "Kabar Koperasi"], ["news", "News"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(G, key, headerD("Arta Guyub", G, { variant: "bar", cta: [tr("Jadi anggota", "Join us"), href("join")] }), gFoot(tr), {
      home: () => [
        heroMinimal(G, {
          eyebrow: tr("Dari anggota, untuk anggota", "By members, for members"),
          title: tr("Menabung bersama, tumbuh bersama", "Save together, grow together"),
          text: tr("Simpanan dengan bagi hasil tahunan, pinjaman usaha berbunga menurun, dan sisa hasil usaha yang kembali ke anggota.", "Savings with annual profit share, declining-rate business loans and surplus returned to members."),
          image: asset("v3d-coins"),
          alt: tr("Koin dan celengan", "Coins and piggy bank"),
          actions: [[tr("Lihat simpanan", "See savings"), href("savings")], [tr("Ajukan pinjaman", "Apply for a loan"), href("loans"), "outline"]],
          note: tr("Simpanan pokok cukup Rp100.000.", "Membership share only Rp100,000."),
        }),
        cardsD(G, { title: tr("Tiga hal yang kami jaga", "Three things we protect"), items: [{ icon: "◎", title: tr("Milik anggota", "Member-owned"), text: tr("Satu anggota, satu suara di RAT.", "One member, one vote at the AGM.") }, { icon: "◇", title: tr("Bunga wajar", "Fair rates"), text: tr("Pinjaman usaha mulai 0,9% per bulan menurun.", "Business loans from 0.9% a month, declining.") }, { icon: "♣", title: tr("Diawasi", "Supervised"), text: tr("Diaudit akuntan publik setiap tahun.", "Audited by public accountants each year.") }] }),
        progressD(G, { title: tr("Target 2026", "2026 targets"), text: tr("Posisi per 30 September 2026.", "Position as of 30 September 2026."), bars: [[tr("Anggota baru (1.000)", "New members (1,000)"), 74], [tr("Pinjaman UMKM tersalurkan", "SME loans disbursed"), 68], [tr("Simpanan pendidikan", "Education savings"), 81]], side: { image: asset("v3d-coins"), alt: tr("Pertumbuhan", "Growth") } }),
        quotesD(G, { title: tr("Cerita anggota", "Member stories"), items: [{ quote: tr("Pinjaman Rp15 juta untuk oven baru. Sekarang produksi roti saya dua kali lipat.", "A Rp15M loan for a new oven. My bread output has doubled."), author: "Bu Wartini", role: tr("Usaha roti rumahan", "Home bakery"), avatar: asset("v3d-face-4") }, { quote: tr("Simpanan pendidikan cair tepat saat anak masuk SMA.", "Education savings paid out just as my kid started high school."), author: "Pak Yusuf", role: tr("Anggota sejak 2012", "Member since 2012"), avatar: asset("v3d-face-3") }] }),
      ],
      savings: () => [
        pageHead(G, { eyebrow: tr("Simpanan", "Savings"), title: tr("Jenis simpanan", "Savings products"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Simpanan", "Savings"), ""]] }),
        withFx(G, pricingCards(pro(G), tr, { eyebrow: tr("Pilih tujuan", "Pick a goal"), title: tr("Simpanan untuk tiap kebutuhan", "Savings for every need"), text: tr("Bagi hasil dibagikan setiap RAT. Angka contoh.", "Profit share paid at each AGM. Sample figures."), plans: [{ name: tr("Simpanan Sukarela", "Voluntary Savings"), price: "4%", period: tr("/tahun", "/year"), text: tr("Ambil kapan saja.", "Withdraw any time."), features: [tr("Setor mulai Rp10.000", "Deposit from Rp10,000"), tr("Kartu ATM mitra", "Partner ATM card")], cta: { label: tr("Buka", "Open"), href: href("join") } }, { name: tr("Simpanan Pendidikan", "Education Savings"), price: "6%", period: tr("/tahun", "/year"), text: tr("Cair saat tahun ajaran baru.", "Paid out at the new school year."), features: [tr("Setoran rutin bulanan", "Fixed monthly deposits"), tr("Asuransi jiwa penabung", "Saver life cover"), tr("Hadiah RAT", "AGM prize draw")], cta: { label: tr("Buka", "Open"), href: href("join") }, featured: true }, { name: tr("Simpanan Berjangka", "Term Deposit"), price: "7%", period: tr("/tahun", "/year"), text: tr("Tenor 6–24 bulan.", "6–24 month term."), features: [tr("Mulai Rp5 juta", "From Rp5M"), tr("Bisa jadi jaminan", "Usable as collateral")], cta: { label: tr("Buka", "Open"), href: href("join") } }] })),
        faqD(G, { title: tr("Pertanyaan simpanan", "Savings questions"), items: [[tr("Apa itu simpanan pokok & wajib?", "What are member shares?"), tr("Pokok Rp100.000 sekali, wajib Rp25.000 per bulan.", "Rp100,000 once, plus Rp25,000 a month.")], [tr("Dijamin?", "Guaranteed?"), tr("Dijamin kas cadangan koperasi; bukan program penjaminan pemerintah.", "Backed by the co-op's reserve fund; not a government scheme.")], [tr("Bisa setor via transfer?", "Deposit by transfer?"), tr("Ya, ke rekening virtual anggota.", "Yes, to your member virtual account.")], [tr("Ada biaya admin?", "Admin fees?"), tr("Tidak ada.", "None.")]] }),
      ],
      loans: () => [
        pageHead(G, { eyebrow: tr("Pinjaman", "Loans"), title: tr("Pinjaman produktif untuk anggota", "Productive loans for members") }),
        tableD(G, { title: tr("Produk pinjaman", "Loan products"), columns: [tr("Produk", "Product"), tr("Plafon", "Limit"), tr("Bunga", "Rate"), tr("Tenor", "Term")], rows: [[tr("Usaha mikro", "Micro business"), "Rp50 jt", tr("0,9%/bln menurun", "0.9%/mo declining"), tr("36 bln", "36 mo")], [tr("Pendidikan", "Education"), "Rp20 jt", tr("0,7%/bln", "0.7%/mo"), tr("12 bln", "12 mo")], [tr("Darurat", "Emergency"), "Rp5 jt", tr("0,5%/bln", "0.5%/mo"), tr("6 bln", "6 mo")]] }),
        zigzag(G, { title: tr("Proses pengajuan", "How to apply"), steps: [[tr("Konsultasi", "Consultation"), tr("Petugas berkunjung ke tempat usaha Anda.", "An officer visits your business.")], [tr("Analisis", "Assessment"), tr("Keputusan dalam 3 hari kerja.", "Decision within 3 working days.")], [tr("Pencairan", "Disbursement"), tr("Ditransfer ke rekening anggota.", "Transferred to your member account.")]] }),
      ],
      join: () => [
        pageHead(G, { eyebrow: tr("Keanggotaan", "Membership"), title: tr("Bergabung dalam 15 menit", "Join in 15 minutes") }),
        splitPanel(G, { title: tr("Syarat menjadi anggota", "Membership requirements"), text: tr("Terbuka untuk warga Salatiga dan sekitarnya berusia 18 tahun ke atas.", "Open to residents of Salatiga and surroundings aged 18 and over."), bullets: [tr("KTP & KK", "ID & family card"), tr("Simpanan pokok Rp100.000", "Rp100,000 membership share"), tr("Mengikuti pendidikan anggota 1 jam", "1-hour member orientation")], image: asset("v3d-coins"), alt: tr("Keanggotaan", "Membership") }),
        formD(G, { title: tr("Formulir pendaftaran", "Registration form"), info: [[tr("Kantor", "Office"), "Jl. Diponegoro 77"], ["WhatsApp", "0813 2900 1414"]], fields: [{ kind: "input", label: tr("Nama sesuai KTP", "Name as on ID"), ph: "" }, { kind: "input", label: "NIK", ph: "" }, { kind: "input", label: tr("No. HP", "Phone"), ph: "08xx" }, { kind: "select", label: tr("Pekerjaan", "Occupation"), ph: tr("Pilih", "Choose"), options: [tr("Pedagang", "Trader"), tr("Petani", "Farmer"), tr("Karyawan", "Employee"), tr("Lainnya", "Other")] }], submit: tr("Daftar", "Register") }),
      ],
      reports: () => [
        pageHead(G, { eyebrow: tr("Transparansi", "Transparency"), title: tr("Laporan Rapat Anggota Tahunan 2025", "2025 Annual General Meeting report") }),
        numbers(G, { items: [["Rp84 M", tr("Aset", "Assets")], ["Rp61 M", tr("Simpanan anggota", "Member savings")], ["Rp2,3 M", tr("SHU dibagikan", "Surplus distributed")], ["1,8%", tr("Kredit bermasalah", "Non-performing loans")]] }),
        timelineD(G, { title: tr("Keputusan RAT", "AGM decisions"), items: [[tr("Mar 2026", "Mar 2026"), tr("SHU 2025", "2025 surplus"), tr("40% dibagi ke anggota sesuai jasa.", "40% shared to members by participation.")], [tr("Mar 2026", "Mar 2026"), tr("Pengurus baru", "New board"), tr("5 pengurus dan 3 pengawas terpilih.", "5 board and 3 supervisory members elected.")], [tr("Mar 2026", "Mar 2026"), tr("Program 2026", "2026 programme"), tr("Digitalisasi setoran dan kelas literasi keuangan.", "Digital deposits and financial literacy classes.")]] }),
      ],
      news: () => [
        pageHead(G, { eyebrow: tr("Kabar", "News"), title: tr("Kabar koperasi", "Co-op news") }),
        magazine(G, { title: tr("Terbaru", "Latest"), read: tr("Baca", "Read"), lead: { image: asset("v3d-coins"), tag: tr("Pendidikan", "Education"), date: "5 Okt 2026", title: tr("Kelas literasi keuangan untuk 300 ibu pelaku UMKM", "Financial literacy classes for 300 women entrepreneurs"), text: tr("Belajar memisahkan uang usaha dan rumah tangga.", "Learning to separate business and household money."), href: href("news") }, items: [{ image: asset("v3d-village"), tag: tr("Cabang", "Branch"), date: "20 Sep", title: tr("Kantor kas baru di Tengaran", "New cash office in Tengaran"), text: "", href: href("contact") }, { image: asset("v3d-food-green"), tag: tr("Anggota", "Members"), date: "2 Sep", title: tr("Bazar produk anggota", "Member product bazaar"), text: "", href: href("news") }] }),
      ],
      contact: () => [
        pageHead(G, { eyebrow: tr("Kontak", "Contact"), title: tr("Kantor & kas keliling", "Offices & mobile cash desk") }),
        locations(G, { title: tr("Lokasi pelayanan", "Service points"), image: asset("v3d-map"), places: [[tr("Kantor pusat", "Head office"), "Jl. Diponegoro 77, Salatiga", tr("Sen–Sab 08.00–15.00", "Mon–Sat 8am–3pm")], [tr("Kantor kas Tengaran", "Tengaran cash office"), tr("Pasar Tengaran Blok B", "Tengaran Market Block B"), tr("Sen–Sab 07.00–12.00", "Mon–Sat 7am–12pm")]] }),
        formD(G, { title: tr("Tanya petugas", "Ask an officer"), info: [["WhatsApp", "0813 2900 1414"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("No. anggota (bila ada)", "Member no. (if any)"), ph: "" }], message: tr("Pertanyaan", "Question"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ------------ 22. Menara Kirana Residence — apartemen (9 hlm) ------------ */
// Premium: gallery-lightbox, slider, comparison-table, modal-popup, pro-services-split. Library: AOS + Tilt.

const QP: Palette = { ink: "#0f172a", muted: "#475569", primary: "#334155", primaryDark: "#1e293b", soft: "#e2e8f0", line: "#cbd5e1" };
const Q = lookD(QP, { head: "Playfair Display", body: "Montserrat", shape: "glass", radius: 14, bg: "#f8fafc", alt: "#eef2f6", inv: "#0f172a", fx: { aos: "fade-up", tilt: true } });

const qFoot = (tr: Tr) =>
  footerD("Menara Kirana", Q, {
    variant: "giant",
    about: tr("Apartemen 38 lantai di koridor MRT, 5 menit ke pusat bisnis. Pengembang fiktif untuk contoh.", "A 38-storey apartment on the metro corridor, 5 minutes from the business district. A fictional developer."),
    cols: [{ title: tr("Galeri pemasaran", "Marketing gallery"), items: ["Jl. Fatmawati 210", tr("Setiap hari 09.00–18.00", "Daily 9am–6pm")] }, { title: tr("Hubungi", "Contact"), items: ["0811 900 3838", "marketing@menarakirana.id"] }],
    copy: tr("© 2026 Menara Kirana Residence. Konten contoh; gambar ilustrasi.", "© 2026 Menara Kirana Residence. Sample content; illustrative images."),
  });

export const realestateApartemen: TemplateContent = {
  brand: "Menara Kirana Residence",
  pages: [
    home(),
    pg("units", ["tipe-unit", "Tipe Unit"], ["unit-types", "Unit Types"]),
    pg("facilities", ["fasilitas", "Fasilitas"], ["facilities", "Facilities"]),
    pg("location", ["lokasi", "Lokasi"], ["location", "Location"]),
    pg("gallery", ["galeri", "Galeri"], ["gallery", "Gallery"]),
    pg("tour", ["tur-virtual", "Tur Virtual"], ["virtual-tour", "Virtual Tour"]),
    pg("payment", ["cara-bayar", "Cara Bayar"], ["payment-plans", "Payment Plans"]),
    pg("developer", ["pengembang", "Pengembang"], ["developer", "Developer"]),
    pg("contact", ["kunjungi", "Jadwalkan Kunjungan"], ["book-a-visit", "Book a Visit"]),
  ],
  build: (key, tr, href) =>
    render(Q, key, headerD("Menara Kirana", Q, { variant: "pill", cta: [tr("Jadwalkan kunjungan", "Book a visit"), href("contact")] }), qFoot(tr), {
      home: () => [
        heroCollage(Q, {
          eyebrow: tr("Serah terima Q4 2027", "Handover Q4 2027"),
          title: tr("Pulang ke lantai 30, lima menit dari kantor", "Come home to the 30th floor, five minutes from work"),
          text: tr("Studio hingga 3 kamar dengan jendela setinggi plafon, jalur pejalan kaki langsung ke stasiun MRT, dan taman atap seluas 2.000 m².", "Studios to 3-bedrooms with floor-to-ceiling windows, a covered walkway to the metro station and a 2,000 m² rooftop garden."),
          images: [[asset("v3d-tower"), tr("Menara", "Tower")], [asset("v3d-room-full"), tr("Ruang tamu", "Living room")], [asset("v3d-tower-night"), tr("Malam hari", "At night")]],
          actions: [[tr("Lihat tipe unit", "See unit types"), href("units")], [tr("Tur virtual", "Virtual tour"), href("tour"), "outline"]],
        }),
        sliderD(Q, { slides: [{ title: tr("Taman atap 2.000 m²", "2,000 m² rooftop garden"), text: tr("Jogging track dan kolam infinity di lantai 38.", "Jogging track and infinity pool on level 38."), bg: "#334155" }, { title: tr("Terhubung MRT", "Metro-connected"), text: tr("Jembatan beratap 120 m ke stasiun.", "A 120 m covered bridge to the station."), bg: "#0f766e" }, { title: tr("Hunian hemat energi", "Energy-efficient homes"), text: tr("Kaca low-E dan AC inverter standar.", "Low-E glass and inverter AC as standard."), bg: "#7c2d12" }] }),
        withFx(Q, servicesSplit(pro(Q), tr, { eyebrow: tr("Kenapa Menara Kirana", "Why Menara Kirana"), title: tr("Dirancang untuk hidup sehari-hari", "Designed for everyday living"), image: asset("v3d-tower"), imageAlt: tr("Menara apartemen", "Apartment tower"), items: [{ icon: "M", title: tr("Akses MRT", "Metro access"), text: tr("Tanpa menyeberang jalan raya.", "No road crossings.") }, { icon: "L", title: tr("Lantai rendah kepadatan", "Low-density floors"), text: tr("Hanya 8 unit per lantai.", "Only 8 units per floor.") }, { icon: "S", title: tr("Pengelola profesional", "Professional management"), text: tr("Keamanan 24 jam dan aplikasi penghuni.", "24h security and a resident app.") }], cta: { label: tr("Fasilitas lengkap", "All facilities"), href: href("facilities") } })),
        offer(Q, { eyebrow: tr("Penawaran peluncuran", "Launch offer"), title: tr("Gratis biaya IPL 2 tahun", "Two years of service charges free"), text: tr("Untuk 50 pemesan pertama tower B.", "For the first 50 buyers in tower B."), trigger: tr("Lihat syarat", "See terms"), modalTitle: tr("Syarat penawaran", "Offer terms"), body: tr("Berlaku untuk pembelian unit tower B dengan booking fee Rp10 juta sebelum 31 Desember 2026. Tidak dapat digabung dengan promo lain.", "Valid for tower B units with a Rp10M booking fee before 31 December 2026. Cannot be combined with other offers."), cta: tr("Jadwalkan kunjungan", "Book a visit"), href: href("contact") }),
      ],
      units: () => [
        pageHead(Q, { eyebrow: tr("Tipe unit", "Unit types"), title: tr("Empat tipe, satu kualitas", "Four types, one standard"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Tipe unit", "Unit types"), ""]] }),
        compareD(Q, { title: tr("Bandingkan tipe", "Compare types"), columns: ["Studio", "1BR", "2BR", "3BR"], rows: [tr("Luas | 26 m² | 38 m² | 58 m² | 86 m²", "Size | 26 m² | 38 m² | 58 m² | 86 m²"), tr("Balkon | tidak | ya | ya | ya", "Balcony | no | yes | yes | yes"), tr("Kamar mandi | 1 | 1 | 2 | 2", "Bathrooms | 1 | 1 | 2 | 2"), tr("Ruang kerja | tidak | tidak | ya | ya", "Study | no | no | yes | yes"), tr("Harga mulai | Rp780 jt | Rp1,1 M | Rp1,7 M | Rp2,6 M", "From | Rp780M | Rp1.1B | Rp1.7B | Rp2.6B")], highlight: 2, caption: tr("Harga contoh", "Sample prices") }),
        specs(Q, { title: tr("Spesifikasi teknis", "Technical specs"), rows: [[tr("Lantai", "Flooring"), tr("Granit 60×120", "60×120 granite")], [tr("Jendela", "Windows"), tr("Kaca low-E double glazing", "Low-E double glazing")], [tr("Dapur", "Kitchen"), tr("Kompor induksi & hood", "Induction hob & hood")], [tr("Listrik", "Power"), "3.500–7.700 VA"]], image: asset("v3d-room-full"), alt: tr("Interior unit", "Unit interior") }),
      ],
      facilities: () => [
        pageHead(Q, { eyebrow: tr("Fasilitas", "Facilities"), title: tr("Lebih dari sekadar unit", "More than a unit") }),
        bento(Q, { title: tr("Fasilitas penghuni", "Resident facilities"), items: [{ title: tr("Kolam infinity", "Infinity pool"), text: tr("25 m di lantai 38.", "25 m on level 38."), image: asset("v3d-tower-night"), wide: true, tall: true }, { title: tr("Co-working", "Co-working"), text: tr("Ruang rapat dapat dipesan.", "Bookable meeting rooms."), icon: "▤" }, { title: tr("Gym 24 jam", "24h gym"), text: tr("Kardio dan beban.", "Cardio and weights."), icon: "◆", accent: true }, { title: tr("Taman anak", "Kids' garden"), text: tr("Area bermain beratap.", "Covered play area."), icon: "✿", wide: true }] }),
        cardsD(Q, { title: tr("Layanan pengelola", "Management services"), items: [{ title: tr("Keamanan", "Security"), text: tr("Akses kartu & CCTV 24 jam.", "Card access & 24h CCTV.") }, { title: tr("Kebersihan", "Cleaning"), text: tr("Area umum dua kali sehari.", "Common areas twice a day.") }, { title: tr("Aplikasi penghuni", "Resident app"), text: tr("Bayar IPL, pesan fasilitas, lapor kerusakan.", "Pay fees, book facilities, report issues.") }] }),
      ],
      location: () => [
        pageHead(Q, { eyebrow: tr("Lokasi", "Location"), title: tr("Di tengah semuanya", "In the middle of everything") }),
        locations(Q, { title: tr("Jarak tempuh", "Travel times"), image: asset("v3d-map-blue"), places: [[tr("Stasiun MRT", "Metro station"), tr("2 menit jalan kaki", "2-minute walk"), tr("Jembatan beratap", "Covered bridge")], [tr("Pusat bisnis", "Business district"), tr("5 menit MRT", "5 minutes by metro"), tr("3 stasiun", "3 stops")], [tr("Rumah sakit", "Hospital"), tr("1,2 km", "1.2 km"), tr("IGD 24 jam", "24h ER")]] }),
        tableD(Q, { title: tr("Sekitar Menara Kirana", "Around Menara Kirana"), columns: [tr("Tempat", "Place"), tr("Jarak", "Distance")], rows: [[tr("Sekolah internasional", "International school"), "1,8 km"], [tr("Pusat belanja", "Shopping mall"), "900 m"], [tr("Taman kota", "City park"), "600 m"]] }),
      ],
      gallery: () => [
        pageHead(Q, { eyebrow: tr("Galeri", "Gallery"), title: tr("Ilustrasi artistik", "Artist's impressions") }),
        galleryLb(Q, { title: tr("Interior & eksterior", "Interior & exterior"), images: [[asset("v3d-tower"), tr("Fasad siang", "Facade by day")], [asset("v3d-tower-night"), tr("Fasad malam", "Facade at night")], [asset("v3d-room-full"), tr("Ruang tamu 2BR", "2BR living room")], [asset("v3d-room-plain"), tr("Unit studio", "Studio unit")], [asset("v3d-map-blue"), tr("Masterplan", "Masterplan")], [asset("v3d-lake"), tr("Pemandangan", "View")]] }),
        beforeAfterD(Q, { title: tr("Unit kosong vs tertata", "Bare vs furnished"), before: asset("v3d-room-plain"), after: asset("v3d-room-full"), labels: [tr("Kosong", "Bare"), tr("Furnished", "Furnished")], alt: tr("Unit sebelum dan sesudah diisi furnitur", "Unit before and after furnishing") }),
      ],
      tour: () => [
        pageHead(Q, { eyebrow: tr("Tur virtual", "Virtual tour"), title: tr("Jelajahi unit contoh dari rumah", "Explore the show unit from home") }),
        videoD(Q, { title: tr("Tur unit 2BR", "2BR unit tour"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", vtitle: tr("Tur unit contoh Menara Kirana", "Menara Kirana show unit tour") }),
        tabsD(Q, { title: tr("Tur per tipe", "Tours by type"), tabs: [["Studio", tr("Tata letak terbuka dengan dapur linear.", "Open layout with a linear kitchen.")], ["1BR", tr("Kamar terpisah dan balkon 4 m².", "Separate bedroom and 4 m² balcony.")], ["2BR", tr("Ruang kerja kecil dan dua kamar mandi.", "A small study and two bathrooms.")]] }),
      ],
      payment: () => [
        pageHead(Q, { eyebrow: tr("Cara bayar", "Payment plans"), title: tr("Fleksibel sesuai rencana Anda", "Flexible to your plans") }),
        cardsD(Q, { title: tr("Skema pembayaran", "Payment schemes"), items: [{ icon: "1", title: tr("Tunai keras", "Full cash"), text: tr("Diskon 12% bila lunas 30 hari.", "12% off if paid in 30 days.") }, { icon: "2", title: tr("Cicilan bertahap", "Staged instalments"), text: tr("36× tanpa bunga ke pengembang.", "36× interest-free to developer.") }, { icon: "3", title: tr("KPA", "Mortgage"), text: tr("Bekerja sama dengan bank mitra; DP mulai 10%.", "With partner lenders; 10% down payment.") }] }),
        faqD(Q, { title: tr("Pertanyaan pembelian", "Buying questions"), items: [[tr("Booking fee?", "Booking fee?"), tr("Rp10 juta, dapat dikembalikan 14 hari.", "Rp10M, refundable within 14 days.")], [tr("Sertifikat?", "Title?"), tr("SHM Sarusun setelah serah terima.", "Strata title after handover.")], [tr("Bisa disewakan?", "Can I rent it out?"), tr("Ya, pengelola menyediakan layanan sewa.", "Yes, management offers a leasing service.")], [tr("WNA boleh membeli?", "Foreign buyers?"), tr("Sesuai ketentuan hak pakai.", "Under right-of-use rules.")]] }),
      ],
      developer: () => [
        pageHead(Q, { eyebrow: tr("Pengembang", "Developer"), title: tr("PT Kirana Ruang Hidup (fiktif)", "PT Kirana Ruang Hidup (fictional)") }),
        timelineD(Q, { title: tr("Rekam jejak", "Track record"), items: [["2014", tr("Rumah Taman Kirana", "Kirana Garden Homes"), tr("320 rumah tapak, diserahkan tepat waktu.", "320 landed homes, delivered on time.")], ["2019", tr("Kirana Loft", "Kirana Loft"), tr("Apartemen 18 lantai, terhuni 96%.", "18-storey apartment, 96% occupied.")], ["2027", "Menara Kirana", tr("38 lantai, 612 unit.", "38 storeys, 612 units.")]], side: { image: asset("v3d-tower"), alt: tr("Menara", "Tower") } }),
        numbers(Q, { items: [["12", tr("Tahun", "Years")], ["1.450", tr("Unit diserahkan", "Units delivered")], ["0", tr("Proyek mangkrak", "Stalled projects")]] }),
      ],
      contact: () => [
        pageHead(Q, { eyebrow: tr("Kunjungan", "Visit"), title: tr("Lihat unit contoh secara langsung", "See the show unit in person") }),
        formD(Q, { title: tr("Jadwalkan kunjungan", "Book a visit"), info: [[tr("Galeri pemasaran", "Marketing gallery"), "Jl. Fatmawati 210"], ["WhatsApp", "0811 900 3838"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("No. HP", "Phone"), ph: "" }, { kind: "select", label: tr("Minat tipe", "Unit interest"), ph: tr("Pilih", "Choose"), options: ["Studio", "1BR", "2BR", "3BR"] }, { kind: "date", label: tr("Tanggal kunjungan", "Visit date") }], submit: tr("Jadwalkan", "Book") }),
      ],
    }),
};

/* ------------------ 23. DJ Nawala — DJ & event (4 hlm) -------------------- */
// Premium: countdown, typewriter. Library: Animate. Neon gelap magenta.

const ZP: Palette = { ink: "#fdf4ff", muted: "#c4b5fd", primary: "#d946ef", primaryDark: "#a21caf", soft: "#3b0764", line: "#6b21a8" };
const Z = lookD(ZP, { head: "Syne", body: "Space Mono", shape: "neon", radius: 20, bg: "#09090b", alt: "#1e0b2e", inv: "#2e1065", surface: "#18181b", fx: { animate: "pulse" }, upper: true, dark: true });

const zFoot = (tr: Tr) =>
  footerD("Nawala", Z, {
    variant: "slim",
    about: tr("DJ house & disko Nusantara. Klub, pernikahan, dan festival.", "House & Nusantara disco DJ. Clubs, weddings and festivals."),
    social: ["Instagram | https://instagram.com/djnawala", "SoundCloud | https://soundcloud.com/djnawala", "Spotify | https://open.spotify.com/artist/djnawala"],
    copy: tr("© 2026 DJ Nawala. Konten contoh.", "© 2026 DJ Nawala. Sample content."),
  });

export const musicDj: TemplateContent = {
  brand: "DJ Nawala",
  pages: [home(), pg("gigs", ["jadwal", "Jadwal Tampil"], ["gigs", "Gigs"]), pg("mixes", ["mixtape", "Mixtape"], ["mixes", "Mixes"]), pg("booking", ["booking", "Booking"], ["booking", "Booking"])],
  build: (key, tr, href) =>
    render(Z, key, headerD("Nawala", Z, { variant: "bar", cta: [tr("Booking", "Book"), href("booking")] }), zFoot(tr), {
      home: () => [
        heroNeon(Z, {
          eyebrow: tr("Tur Malam Panjang 2026", "Long Night Tour 2026"),
          title: "",
          titleNode: typerD(Z, "Nawala", [tr("house", "house"), tr("disko Nusantara", "Nusantara disco"), tr("sampai pagi", "till sunrise")], { size: 64, align: "center", color: "#fdf4ff" }),
          text: tr("Set 4 jam yang memadukan groove house dengan sampel gamelan, kendang, dan lagu pop lawas.", "Four-hour sets blending house grooves with gamelan, drum and retro pop samples."),
          chips: ["House", "Disco", "Afro", "Gamelan edits"],
          image: asset("v3d-turntable"),
          alt: tr("Pemutar piringan", "Turntable"),
          actions: [[tr("Lihat jadwal", "See gigs"), href("gigs")], [tr("Dengarkan mix", "Listen"), href("mixes"), "outline"]],
        }),
        countdownD(Z, { eyebrow: tr("Pertunjukan berikutnya", "Next show"), title: tr("Malam Panjang — Bandung", "Long Night — Bandung"), text: tr("Gudang Kopi Lama, 22.00 sampai habis.", "Old Coffee Warehouse, 10pm till late."), target: "2026-11-28T22:00", finished: tr("Sedang tampil!", "Playing now!"), actions: [[tr("Tiket", "Tickets"), href("gigs"), "light"]] }),
        wordBand(Z, ["Jakarta", "Bandung", "Yogyakarta", "Bali", "Makassar", "Medan"], { bg: "#d946ef", color: "#09090b" }),
      ],
      gigs: () => [
        pageHead(Z, { eyebrow: tr("Jadwal", "Gigs"), title: tr("Tur Malam Panjang", "Long Night Tour"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Jadwal", "Gigs"), ""]] }),
        indexList(Z, { title: tr("Tanggal tampil", "Tour dates"), rows: [{ title: "Bandung", meta: tr("28 Nov · Gudang Kopi Lama", "28 Nov · Old Coffee Warehouse"), tag: tr("Tiket tersedia", "On sale"), href: href("booking"), cta: tr("Tiket", "Tickets") }, { title: "Yogyakarta", meta: tr("5 Des · Pendopo Senja", "5 Dec · Pendopo Senja"), tag: tr("Hampir habis", "Few left"), href: href("booking"), cta: tr("Tiket", "Tickets") }, { title: "Bali", meta: tr("20 Des · Pantai Batu Lumut", "20 Dec · Batu Lumut Beach"), tag: tr("Festival", "Festival"), href: href("booking"), cta: tr("Info", "Info") }, { title: "Jakarta", meta: tr("31 Des · Atap Kota", "31 Dec · Atap Kota rooftop"), tag: tr("Tahun baru", "New Year's Eve"), href: href("booking"), cta: tr("Tiket", "Tickets") }] }),
        numbers(Z, { inv: true, items: [["14", tr("Kota", "Cities")], ["320+", tr("Set dimainkan", "Sets played")], ["4 jam", tr("Durasi set", "Set length")]] }),
      ],
      mixes: () => [
        pageHead(Z, { eyebrow: "Mixtape", title: tr("Untuk perjalanan malam", "For late-night drives") }),
        videoD(Z, { title: tr("Live dari Atap Kota", "Live from Atap Kota"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", vtitle: "Nawala live set" }),
        splitPanel(Z, { eyebrow: tr("Di balik meja", "Behind the decks"), title: tr("Piringan, kabel, dan banyak kopi", "Vinyl, cables and lots of coffee"), text: tr("Setiap mixtape direkam satu kali jalan tanpa potong, langsung dari studio kecil di Bandung.", "Every mixtape is recorded in one take, straight from a small studio in Bandung."), bullets: [tr("Rekam satu kali jalan", "One-take recordings"), tr("Edit ulang lagu lawas lokal", "Local retro re-edits")], image: asset("v3d-turntable-cyan"), alt: tr("Meja putar DJ", "DJ turntable"), reverse: true }),
        cardsD(Z, { title: tr("Seri mixtape", "Mixtape series"), items: [{ icon: "01", title: tr("Disko Pesisir", "Coastal Disco"), text: tr("62 menit · lagu pop lawas di-edit ulang.", "62 min · re-edited retro pop."), meta: "128 BPM" }, { icon: "02", title: tr("Gamelan House", "Gamelan House"), text: tr("75 menit · sampel saron & kendang.", "75 min · saron & drum samples."), meta: "122 BPM" }, { icon: "03", title: tr("Pagi di Atap", "Rooftop Morning"), text: tr("90 menit · deep & downtempo.", "90 min · deep & downtempo."), meta: "110 BPM" }] }),
      ],
      booking: () => [
        pageHead(Z, { eyebrow: "Booking", title: tr("Klub, pernikahan, festival", "Clubs, weddings, festivals") }),
        tableD(Z, { title: tr("Rider teknis", "Technical rider"), columns: [tr("Kebutuhan", "Requirement"), tr("Detail", "Details")], rows: [[tr("Pemutar", "Players"), tr("2 × CDJ terbaru + mixer 4 kanal", "2 × latest CDJ + 4-channel mixer")], ["Monitor", tr("2 monitor booth", "2 booth monitors")], [tr("Durasi", "Length"), tr("2–4 jam", "2–4 hours")]] }),
        formD(Z, { title: tr("Ajukan booking", "Booking request"), info: [["Email", "booking@djnawala.id"], [tr("Manajer", "Manager"), "Rara · 0812 7700 2121"]], fields: [{ kind: "input", label: tr("Nama acara", "Event name"), ph: "" }, { kind: "select", label: tr("Jenis acara", "Event type"), ph: tr("Pilih", "Choose"), options: [tr("Klub", "Club"), tr("Pernikahan", "Wedding"), tr("Festival", "Festival"), tr("Korporat", "Corporate")] }, { kind: "date", label: tr("Tanggal", "Date") }, { kind: "input", label: tr("Kota", "City"), ph: "" }], submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ----------- 24. Akar Bumi Lestari — gerakan lingkungan (6 hlm) ------------ */
// Premium: progress, stats-counter, pro-team-cards. Library: AOS.

const AKP: Palette = { ink: "#1a2e05", muted: "#4d5f35", primary: "#65a30d", primaryDark: "#3f6212", soft: "#ecfccb", line: "#d9f99d" };
const AK = lookD(AKP, { head: "Fraunces", body: "Work Sans", shape: "soft", radius: 16, bg: "#fcfdf7", alt: "#f3f8e6", inv: "#1a2e05", fx: { aos: "fade-up" } });

const akFoot = (tr: Tr) =>
  footerD("Akar Bumi Lestari", AK, {
    variant: "columns",
    about: tr("Gerakan warga untuk mangrove, sungai bersih, dan kebun kota. Yayasan fiktif untuk contoh.", "A citizen movement for mangroves, clean rivers and urban gardens. A fictional foundation."),
    cols: [{ title: tr("Terlibat", "Get involved"), items: [tr("Relawan", "Volunteer"), tr("Donasi", "Donate"), tr("Kemitraan", "Partnerships")] }, { title: tr("Sekretariat", "Office"), items: ["Jl. Rawa Indah 9, Semarang", "halo@akarbumi.or.id"] }],
    social: ["Instagram | https://instagram.com/akarbumi", "YouTube | https://youtube.com/@akarbumi", "Facebook | https://facebook.com/akarbumi"],
    copy: tr("© 2026 Akar Bumi Lestari. Konten contoh.", "© 2026 Akar Bumi Lestari. Sample content."),
  });

export const nonprofitLingkungan: TemplateContent = {
  brand: "Akar Bumi Lestari",
  pages: [home(), pg("programs", ["program", "Program"], ["programmes", "Programmes"]), pg("volunteer", ["relawan", "Relawan"], ["volunteer", "Volunteer"]), pg("donate", ["donasi", "Donasi"], ["donate", "Donate"]), pg("reports", ["laporan", "Laporan"], ["reports", "Reports"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(AK, key, headerD("Akar Bumi", AK, { variant: "bar", cta: [tr("Donasi", "Donate"), href("donate")] }), akFoot(tr), {
      home: () => [
        heroBento(AK, {
          eyebrow: tr("Gerakan warga sejak 2016", "A citizen movement since 2016"),
          title: tr("Menanam hari ini untuk pesisir 20 tahun lagi", "Planting today for the coast 20 years from now"),
          text: tr("Kami menanam mangrove, membersihkan sungai, dan membangun kebun pangan bersama 6.000 relawan di pesisir utara Jawa.", "We plant mangroves, clean rivers and build food gardens with 6,000 volunteers along Java's north coast."),
          image: asset("v3d-tree"),
          alt: tr("Pohon rindang", "A leafy tree"),
          tiles: [["412rb", tr("Bibit mangrove", "Mangrove seedlings")], ["86 t", tr("Sampah sungai diangkat", "River waste removed")], ["6.000", tr("Relawan", "Volunteers")]],
          actions: [[tr("Jadi relawan", "Volunteer"), href("volunteer")], [tr("Donasi", "Donate"), href("donate"), "outline"]],
        }),
        counterD(AK, { title: tr("Dampak sampai hari ini", "Impact so far"), items: [tr("412.000 | Bibit ditanam", "412,000 | Seedlings planted"), tr("78% | Tingkat hidup bibit", "78% | Seedling survival"), tr("23 | Kampung mitra", "23 | Partner villages"), tr("86 ton | Sampah diangkat", "86 t | Waste removed")] }),
        bento(AK, { title: tr("Tiga program utama", "Three main programmes"), items: [{ title: tr("Sabuk Mangrove", "Mangrove Belt"), text: tr("Menahan abrasi di 14 km garis pantai.", "Holding back erosion along 14 km of coast."), image: asset("v3d-tree"), wide: true, tall: true }, { title: tr("Sungai Bening", "Clear River"), text: tr("Patroli sampah tiap Minggu pagi.", "Litter patrols every Sunday morning."), icon: "≈" }, { title: tr("Kebun Kota", "City Gardens"), text: tr("40 kebun di atap dan lahan tidur.", "40 gardens on rooftops and vacant lots."), icon: "✿", accent: true }] }),
        newsletter(AK, { title: tr("Kabar dari lapangan", "News from the field"), text: tr("Foto penanaman dan laporan bulanan.", "Planting photos and monthly reports."), ph: "email@contoh.com", submit: tr("Ikuti", "Follow") }),
      ],
      programs: () => [
        pageHead(AK, { eyebrow: tr("Program", "Programmes"), title: tr("Kerja kami di lapangan", "Our work on the ground"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Program", "Programmes"), ""]] }),
        zigzag(AK, { title: tr("Cara kami bekerja", "How we work"), steps: [[tr("Sabuk Mangrove", "Mangrove Belt"), tr("Pembibitan oleh kelompok ibu nelayan, penanaman bersama relawan.", "Nurseries run by fishing-village women, planting with volunteers."), asset("v3d-tree")], [tr("Sungai Bening", "Clear River"), tr("Jaring sampah di 6 titik dan bank sampah warga.", "Litter nets at 6 points and community waste banks."), asset("v3d-lake")], [tr("Kebun Kota", "City Gardens"), tr("Pelatihan kompos dan benih untuk sekolah.", "Composting training and seeds for schools."), asset("v3d-tree-autumn")]] }),
        progressD(AK, { title: tr("Target 2026", "2026 targets"), bars: [[tr("Bibit mangrove (100.000)", "Mangrove seedlings (100,000)"), 82], [tr("Kebun sekolah (15)", "School gardens (15)"), 60], [tr("Bank sampah baru (10)", "New waste banks (10)"), 40]] }),
      ],
      volunteer: () => [
        pageHead(AK, { eyebrow: tr("Relawan", "Volunteer"), title: tr("Kotor sedikit, dampaknya banyak", "Get a little muddy, make a big difference") }),
        timelineD(AK, { title: tr("Kegiatan terdekat", "Upcoming activities"), items: [[tr("Sab 25 Okt", "Sat 25 Oct"), tr("Tanam mangrove Tambakrejo", "Tambakrejo mangrove planting"), tr("07.00–11.00, sepatu bot disediakan.", "7–11am, boots provided.")], [tr("Min 2 Nov", "Sun 2 Nov"), tr("Patroli sungai", "River patrol"), tr("06.30–09.00, sarung tangan disediakan.", "6.30–9am, gloves provided.")], [tr("Sab 8 Nov", "Sat 8 Nov"), tr("Kelas kompos", "Composting class"), tr("Untuk guru dan orang tua.", "For teachers and parents.")]] }),
        formD(AK, { title: tr("Daftar relawan", "Volunteer sign-up"), info: [[tr("Usia", "Age"), tr("15+ (di bawah 17 dengan izin orang tua)", "15+ (under 17 with parental consent)")], [tr("Asuransi", "Insurance"), tr("Ditanggung selama kegiatan", "Covered during activities")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("No. HP", "Phone"), ph: "" }, { kind: "select", label: tr("Minat", "Interest"), ph: tr("Pilih", "Choose"), options: [tr("Mangrove", "Mangroves"), tr("Sungai", "Rivers"), tr("Kebun kota", "City gardens"), tr("Dokumentasi", "Documentation")] }], submit: tr("Daftar", "Sign up") }),
      ],
      donate: () => [
        pageHead(AK, { eyebrow: tr("Donasi", "Donate"), title: tr("Rp10.000 = satu bibit mangrove ditanam & dirawat", "Rp10,000 = one mangrove seedling planted & cared for") }),
        cardsD(AK, { title: tr("Pilih dampak Anda", "Choose your impact"), items: [{ icon: "10", title: tr("Satu bibit", "One seedling"), text: tr("Rp10.000 termasuk perawatan 1 tahun.", "Rp10,000 including 1 year of care.") }, { icon: "100", title: tr("Satu petak", "One plot"), text: tr("Rp1 juta untuk 100 bibit.", "Rp1M for 100 seedlings.") }, { icon: "∞", title: tr("Donatur bulanan", "Monthly donor"), text: tr("Mulai Rp50.000 per bulan.", "From Rp50,000 a month.") }] }),
        tableD(AK, { title: tr("Ke mana donasi pergi", "Where donations go"), columns: [tr("Pos", "Item"), tr("Porsi", "Share")], rows: [[tr("Bibit & penanaman", "Seedlings & planting"), "62%"], [tr("Pendampingan kampung", "Village facilitation"), "21%"], [tr("Pemantauan & riset", "Monitoring & research"), "9%"], [tr("Operasional", "Operations"), "8%"]] }),
      ],
      reports: () => [
        pageHead(AK, { eyebrow: tr("Transparansi", "Transparency"), title: tr("Laporan & tim", "Reports & team") }),
        withFx(AK, teamCards(pro(AK), tr, { title: tr("Pengurus yayasan", "Foundation board"), members: [{ name: "Sekar Ayuningtyas", role: tr("Ketua", "Chair"), photo: asset("v3d-face-4") }, { name: "Budi Prasetyo", role: tr("Koordinator lapangan", "Field coordinator"), photo: asset("v3d-face-3") }, { name: "Lestari Wahyuni", role: tr("Bendahara", "Treasurer"), photo: asset("v3d-face-2") }, { name: "Adit Nugroho", role: tr("Pemantauan", "Monitoring"), photo: asset("v3d-face-1") }] })),
        indexList(AK, { title: tr("Unduh laporan", "Download reports"), rows: [{ title: tr("Laporan tahunan 2025", "2025 annual report"), meta: "PDF · 32 hlm", tag: tr("Diaudit", "Audited"), href: href("reports"), cta: tr("Unduh", "Download") }, { title: tr("Pemantauan mangrove Q2 2026", "Mangrove monitoring Q2 2026"), meta: "PDF · 12 hlm", href: href("reports"), cta: tr("Unduh", "Download") }] }),
      ],
      contact: () => [
        pageHead(AK, { eyebrow: tr("Kontak", "Contact"), title: tr("Mari bekerja sama", "Let's work together") }),
        formD(AK, { title: tr("Kirim pesan", "Send a message"), info: [["Email", "halo@akarbumi.or.id"], [tr("Sekretariat", "Office"), "Jl. Rawa Indah 9, Semarang"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "select", label: tr("Topik", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Kemitraan perusahaan", "Corporate partnership"), tr("Kunjungan sekolah", "School visit"), tr("Media", "Press")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
        locations(AK, { title: tr("Lokasi kegiatan", "Activity sites"), image: asset("v3d-map"), places: [["Tambakrejo", tr("Pesisir Semarang", "Semarang coast"), tr("Mangrove", "Mangroves")], [tr("Kali Bening", "Kali Bening"), tr("Semarang Barat", "West Semarang"), tr("Sungai", "River")]] }),
      ],
    }),
};

/* ------------------ 25. Rankara — agensi SEO (8 hlm) ---------------------- */
// Premium: pro-portfolio-mosaic, pro-testimonials-wall, pricing-switch, stats-counter, before-after, logo-marquee.
// Library: AOS + Animate. Retro amber.

const OP: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#d97706", primaryDark: "#92400e", soft: "#fef3c7", line: "#fde68a" };
const O = lookD(OP, { head: "Sora", body: "Space Grotesk", shape: "retro", radius: 10, bg: "#fffcf5", alt: "#fef7e0", inv: "#1c1917", fx: { aos: "fade-up", animate: "lightSpeedInRight" } });

const oFoot = (tr: Tr) =>
  footerD("Rankara", O, {
    variant: "giant",
    about: tr("Agensi SEO untuk bisnis yang ingin ditemukan tanpa bergantung pada iklan.", "An SEO agency for businesses that want to be found without relying on ads."),
    cols: [{ title: tr("Layanan", "Services"), items: [tr("Audit teknis", "Technical audit"), tr("Konten", "Content"), tr("SEO lokal", "Local SEO")] }, { title: tr("Kantor", "Office"), items: ["Jl. Tebet Raya 18", "hello@rankara.id"] }],
    social: ["LinkedIn | https://linkedin.com/company/rankara", "Instagram | https://instagram.com/rankara"],
    copy: tr("© 2026 Rankara. Konten contoh.", "© 2026 Rankara. Sample content."),
  });

export const agencySeo: TemplateContent = {
  brand: "Rankara",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("audit", ["audit-gratis", "Audit Gratis"], ["free-audit", "Free Audit"]),
    pg("cases", ["studi-kasus", "Studi Kasus"], ["case-studies", "Case Studies"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("process", ["proses", "Proses"], ["process", "Process"]),
    pg("blog", ["blog", "Blog"], ["blog", "Blog"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) =>
    render(O, key, headerD("Rankara", O, { variant: "bar", cta: [tr("Audit gratis", "Free audit"), href("audit")] }), oFoot(tr), {
      home: () => [
        heroType(O, {
          eyebrow: tr("Agensi SEO · Jakarta", "SEO agency · Jakarta"),
          title: tr("Halaman satu, tanpa trik", "Page one, no tricks"),
          text: tr("Audit teknis, konten yang menjawab pencarian, dan laporan yang bisa dibaca direksi. Rata-rata klien naik 3,2× trafik organik dalam 9 bulan.", "Technical audits, content that answers searches and reports your board can read. Clients average 3.2× organic traffic in 9 months."),
          image: asset("v3d-seo"),
          alt: tr("Grafik naik dan kaca pembesar", "Rising chart and magnifier"),
          words: [tr("Audit teknis", "Technical audit"), tr("Riset kata kunci", "Keyword research"), tr("Konten", "Content"), tr("Tautan balik", "Backlinks"), tr("SEO lokal", "Local SEO")],
          actions: [[tr("Minta audit gratis", "Get a free audit"), href("audit")], [tr("Studi kasus", "Case studies"), href("cases"), "outline"]],
          size: 92,
        }),
        marqueeD(O, { title: tr("Klien yang tumbuh bersama kami", "Clients growing with us"), items: ["Toko Kebun Rumah", "Klinik Gigi Ceria", "Kursus Nada", "Furnitur Jati Muda", "Wisata Lembah Hijau", "Kopi Tanah Air"] }),
        counterD(O, { inv: true, items: [tr("3,2× | Rata-rata trafik organik", "3.2× | Average organic traffic"), tr("140+ | Klien", "140+ | Clients"), tr("18.000 | Kata kunci halaman 1", "18,000 | Page-one keywords"), tr("9 bln | Rata-rata hasil", "9 mo | Average to results")] }),
        beforeAfterD(O, { title: tr("Grafik trafik klien, sebelum & sesudah", "Client traffic, before & after"), before: asset("v3d-seo-dark"), after: asset("v3d-seo"), labels: [tr("Bulan 0", "Month 0"), tr("Bulan 9", "Month 9")], alt: tr("Perbandingan grafik trafik", "Traffic chart comparison") }),
        withFx(O, testimonialsWall(pro(O), tr, { title: tr("Klien bicara", "Clients say"), score: 4.9, caption: tr("dari 140 klien", "from 140 clients"), quotes: [{ text: tr("Penjualan online naik 4× tanpa menambah anggaran iklan.", "Online sales up 4× without increasing ad spend."), name: "Rudi Halim", role: tr("Pemilik, Furnitur Jati Muda", "Owner, Furnitur Jati Muda"), avatar: asset("v3d-face-1") }, { text: tr("Laporannya jelas, tidak penuh istilah.", "Reports are clear, not full of jargon."), name: "drg. Nisa Rahma", role: tr("Klinik Gigi Ceria", "Klinik Gigi Ceria"), avatar: asset("v3d-face-6") }, { text: tr("Tim mereka membenahi situs lambat kami dalam 2 minggu.", "Their team fixed our slow site in 2 weeks."), name: "Galih Pratama", role: tr("Kursus Nada", "Kursus Nada"), avatar: asset("v3d-face-3") }] })),
      ],
      services: () => [
        pageHead(O, { eyebrow: tr("Layanan", "Services"), title: tr("Empat pilar SEO", "Four SEO pillars"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Layanan", "Services"), ""]] }),
        cardsD(O, { title: tr("Yang kami kerjakan", "What we do"), cols: 4, items: [{ icon: "⚙", title: tr("SEO teknis", "Technical SEO"), text: tr("Kecepatan, struktur, indeks.", "Speed, structure, indexing.") }, { icon: "✎", title: tr("Konten", "Content"), text: tr("Artikel berbasis niat pencarian.", "Articles built on search intent.") }, { icon: "⌘", title: tr("Tautan", "Links"), text: tr("Publikasi relevan, tanpa jual-beli link.", "Relevant PR, no link buying.") }, { icon: "◎", title: tr("SEO lokal", "Local SEO"), text: tr("Profil bisnis & ulasan peta.", "Business profiles & map reviews.") }] }),
        tabsD(O, { title: tr("Cocok untuk", "Built for"), tabs: [[tr("Toko online", "E-commerce"), tr("Halaman kategori dan produk yang ditemukan.", "Category and product pages that get found.")], [tr("Jasa lokal", "Local services"), tr("Klinik, kursus, bengkel muncul di peta.", "Clinics, schools, garages show up on maps.")], [tr("B2B", "B2B"), tr("Konten panjang yang menghasilkan prospek.", "Long-form content that generates leads.")]] }),
      ],
      audit: () => [
        pageHead(O, { eyebrow: tr("Audit gratis", "Free audit"), title: tr("Laporan 20 halaman dalam 5 hari kerja", "A 20-page report in 5 working days") }),
        specs(O, { title: tr("Isi laporan audit", "What the audit covers"), rows: [[tr("Teknis", "Technical"), tr("Kecepatan, error indeks, struktur URL", "Speed, index errors, URL structure")], [tr("Konten", "Content"), tr("Halaman lemah & peluang kata kunci", "Weak pages & keyword gaps")], [tr("Kompetitor", "Competitors"), tr("3 pesaing teratas Anda", "Your top 3 competitors")], [tr("Rencana", "Plan"), tr("10 perbaikan prioritas", "10 priority fixes")]], image: asset("v3d-seo"), alt: tr("Audit", "Audit") }),
        formD(O, { title: tr("Minta audit", "Request an audit"), info: [[tr("Biaya", "Cost"), tr("Gratis, tanpa ikatan", "Free, no strings")], [tr("Waktu", "Turnaround"), tr("5 hari kerja", "5 working days")]], fields: [{ kind: "input", label: tr("Alamat situs", "Website URL"), ph: "https://", type: "url" }, { kind: "input", label: "Email", ph: "", type: "email" }, { kind: "select", label: tr("Jenis bisnis", "Business type"), ph: tr("Pilih", "Choose"), options: [tr("Toko online", "E-commerce"), tr("Jasa lokal", "Local service"), "B2B", tr("Media", "Media")] }], submit: tr("Kirim", "Send"), formFirst: true }),
      ],
      cases: () => [
        pageHead(O, { eyebrow: tr("Studi kasus", "Case studies"), title: tr("Angka sebelum dan sesudah", "Numbers before and after") }),
        withFx(O, portfolioMosaic(pro(O), tr, { title: tr("Hasil klien", "Client results"), works: [{ title: "Furnitur Jati Muda", tag: tr("+412% trafik organik", "+412% organic traffic"), image: asset("v3d-seo") }, { title: "Klinik Gigi Ceria", tag: tr("#1 di peta 6 kecamatan", "#1 on maps in 6 districts"), image: asset("v3d-map") }, { title: "Kursus Nada", tag: tr("Situs 3× lebih cepat", "Site 3× faster"), image: asset("v3d-dashboard") }, { title: "Wisata Lembah Hijau", tag: tr("+280% pemesanan langsung", "+280% direct bookings"), image: asset("v3d-lake") }, { title: "Toko Kebun Rumah", tag: tr("1.200 kata kunci baru", "1,200 new keywords"), image: asset("v3d-tree") }], cta: { label: tr("Minta audit", "Request an audit"), href: href("audit") } })),
        pullQuote(O, { text: tr("SEO bukan sulap. Ini pekerjaan teliti yang dikerjakan setiap minggu.", "SEO isn't magic. It's careful work done every week."), name: "Maya Paramitha", role: tr("Pendiri Rankara", "Rankara founder") }),
      ],
      pricing: () => [
        pageHead(O, { eyebrow: tr("Harga", "Pricing"), title: tr("Retainer bulanan, kontrak minimal 6 bulan", "Monthly retainer, 6-month minimum") }),
        priceSwitchD(O, { title: tr("Paket SEO", "SEO plans"), plans: [tr("Lokal | Rp4,5jt | Rp45jt | SEO lokal; 4 artikel/bln; Laporan bulanan | Mulai", "Local | Rp4.5M | Rp45M | Local SEO; 4 articles/mo; Monthly report | Start"), tr("Tumbuh | Rp9,5jt | Rp95jt | SEO teknis; 8 artikel/bln; Publikasi tautan; Rapat 2 mingguan | Pilih Tumbuh", "Growth | Rp9.5M | Rp95M | Technical SEO; 8 articles/mo; Link PR; Bi-weekly calls | Choose Growth"), tr("Dominan | Rp19jt | Rp190jt | Semua Tumbuh; 16 artikel/bln; Multi-bahasa | Hubungi kami", "Dominant | Rp19M | Rp190M | Everything in Growth; 16 articles/mo; Multi-language | Contact us")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("contact") }),
        faqD(O, { title: tr("Soal harga", "Pricing questions"), items: [[tr("Kenapa minimal 6 bulan?", "Why 6 months minimum?"), tr("Hasil SEO butuh waktu untuk terindeks dan dipercaya.", "SEO results need time to be indexed and trusted.")], [tr("Ada jaminan peringkat?", "Ranking guarantee?"), tr("Tidak ada yang bisa menjamin; kami menjamin pekerjaan dan transparansi.", "Nobody can; we guarantee the work and transparency.")], [tr("Konten milik siapa?", "Who owns the content?"), tr("Anda, sepenuhnya.", "You, entirely.")], [tr("Bisa berhenti?", "Can I stop?"), tr("Setelah 6 bulan, pemberitahuan 30 hari.", "After 6 months, with 30 days' notice.")]] }),
      ],
      process: () => [
        pageHead(O, { eyebrow: tr("Proses", "Process"), title: tr("Sembilan bulan pertama bersama kami", "Your first nine months with us") }),
        timelineD(O, { title: tr("Peta jalan", "Roadmap"), items: [[tr("Bulan 1", "Month 1"), tr("Audit & perbaikan teknis", "Audit & technical fixes"), tr("Situs cepat dan terindeks bersih.", "A fast, cleanly indexed site.")], [tr("Bulan 2–4", "Month 2–4"), tr("Konten fondasi", "Foundation content"), tr("Halaman pilar dan artikel pendukung.", "Pillar pages and supporting articles.")], [tr("Bulan 5–7", "Month 5–7"), tr("Otoritas", "Authority"), tr("Publikasi dan kemitraan media.", "PR and media partnerships.")], [tr("Bulan 8–9", "Month 8–9"), tr("Optimasi konversi", "Conversion optimisation"), tr("Trafik menjadi prospek.", "Turning traffic into leads.")]], side: { image: asset("v3d-seo"), alt: tr("Grafik naik", "Rising chart") } }),
        editorial(O, { title: tr("Yang tidak kami lakukan", "What we don't do"), cols: [[tr("Jual-beli tautan", "Buying links"), tr("Berisiko penalti dan merusak reputasi.", "Risks penalties and reputation.")], [tr("Konten AI massal", "Mass AI content"), tr("Semua artikel disunting penulis manusia.", "Every article is edited by a human writer.")], [tr("Janji 'nomor 1'", "'Number one' promises"), tr("Kami bicara data, bukan janji.", "We talk data, not promises.")]] }),
      ],
      blog: () => [
        pageHead(O, { eyebrow: "Blog", title: tr("Catatan SEO yang membumi", "Down-to-earth SEO notes") }),
        magazine(O, { title: tr("Artikel terbaru", "Latest articles"), read: tr("Baca", "Read"), lead: { image: asset("v3d-seo"), tag: tr("Panduan", "Guide"), date: "11 Okt 2026", title: tr("SEO lokal untuk klinik: 12 langkah", "Local SEO for clinics: 12 steps"), text: tr("Dari profil bisnis sampai halaman per layanan.", "From business profiles to per-service pages."), href: href("blog") }, items: [{ image: asset("v3d-dashboard"), tag: tr("Teknis", "Technical"), date: "3 Okt", title: tr("Membaca laporan Core Web Vitals", "Reading Core Web Vitals reports"), text: "", href: href("blog") }, { image: asset("v3d-seo-dark"), tag: tr("Konten", "Content"), date: "26 Sep", title: tr("Niat pencarian, bukan volume", "Intent, not volume"), text: "", href: href("blog") }] }),
        articleBody(O, { lead: tr("Volume pencarian tinggi tidak berarti pembeli. Mulailah dari pertanyaan yang diketik calon pelanggan sebelum membeli.", "High search volume doesn't mean buyers. Start from the questions customers type before they buy."), blocks: [[tr("Empat jenis niat", "Four kinds of intent"), tr("Informasi, navigasi, komersial, dan transaksi — masing-masing butuh halaman berbeda.", "Informational, navigational, commercial and transactional — each needs a different page.")]] }),
      ],
      contact: () => [
        pageHead(O, { eyebrow: tr("Kontak", "Contact"), title: tr("Ngobrol 30 menit, gratis", "A free 30-minute chat") }),
        formD(O, { title: tr("Ceritakan bisnis Anda", "Tell us about your business"), info: [["Email", "hello@rankara.id"], ["WhatsApp", "0812 8080 1188"], [tr("Kantor", "Office"), "Jl. Tebet Raya 18, Jakarta"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Situs", "Website"), ph: "https://" }, { kind: "select", label: tr("Anggaran bulanan", "Monthly budget"), ph: tr("Pilih", "Choose"), options: ["< Rp5 jt", "Rp5–10 jt", "> Rp10 jt"] }], message: tr("Tujuan", "Goals"), submit: tr("Kirim", "Send") }),
      ],
    }),
};
