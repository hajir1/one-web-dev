import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import { pricingCards } from "../../../../pageMaker/helpers/sectionPresetsPro";
import {
  backTop,
  beforeAfterD,
  cardsD,
  counterD,
  countdownD,
  editorial,
  faqD,
  footerD,
  formD,
  fullHeader,
  fullImage,
  fullSplit,
  galleryLb,
  headerD,
  home,
  indexList,
  lookD,
  marqueeD,
  megaD,
  numbers,
  pageHead,
  peopleD,
  pg,
  plansD,
  priceSwitchD,
  pro,
  progressD,
  quotesD,
  rail,
  render,
  specialty,
  tableD,
  timelineD,
  withFx,
} from "./kitF";

/* ================================================================== */
/* Template v5 F5–F7: Konsultan pajak, Event organizer, Barbershop.      */
/* ================================================================== */

/* ------------- 5. Taksa Konsultan Pajak — professional (5 hlm, Premium) ------------- */
// Premium: pricing-switch, testimonial, back-to-top. Library: AOS.

const TP: Palette = { ink: "#0b2e24", muted: "#4b635b", primary: "#047857", primaryDark: "#065f46", soft: "#d1fae5", line: "#a7f3d0" };
const TX = lookD(TP, { head: "Libre Baskerville", body: "Inter", shape: "sharp", radius: 6, bg: "#ffffff", alt: "#f0fdf8", inv: "#0b2e24", fx: { aos: "fade-up" } });

const tFoot = (tr: Tr) =>
  footerD("Taksa Konsultan Pajak", TX, {
    variant: "columns",
    about: tr("Konsultan pajak terdaftar untuk UMKM, profesional, dan perusahaan menengah.", "Registered tax consultants for small businesses, professionals and mid-size companies."),
    cols: [
      { title: tr("Layanan", "Services"), items: [tr("SPT tahunan", "Annual returns"), tr("Pembukuan", "Bookkeeping"), tr("Pemeriksaan pajak", "Tax audits")] },
      { title: tr("Kantor", "Office"), items: ["Jl. Sudirman Kav. 52, Jakarta", "021 5000 7788", "halo@taksa.id"] },
    ],
    social: ["LinkedIn | https://linkedin.com/company/taksa", "Instagram | https://instagram.com/taksa.pajak"],
    copy: tr("© 2026 Taksa Konsultan Pajak. Konten contoh.", "© 2026 Taksa Tax Consultants. Sample content."),
    extra: [backTop(TX, tr("Ke atas", "Back to top"))],
  });

export const taxTaksa: TemplateContent = {
  brand: "Taksa Konsultan Pajak",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("pricing", ["biaya", "Biaya"], ["pricing", "Pricing"]), pg("guides", ["panduan", "Panduan"], ["guides", "Guides"]), pg("contact", ["konsultasi", "Konsultasi"], ["consult", "Consult"])],
  build: (key, tr, href) =>
    render(TX, key, headerD("Taksa", TX, { variant: "split", cta: [tr("Konsultasi gratis", "Free consultation"), href("contact")] }), tFoot(tr), {
      home: () => [
        fullHeader(TX, {
          eyebrow: tr("Konsultan pajak terdaftar", "Registered tax consultants"),
          title: tr("Urusan pajak beres, Anda fokus ke bisnis", "Taxes handled, so you can focus on business"),
          text: tr("SPT, pembukuan, dan pendampingan pemeriksaan oleh konsultan bersertifikat Brevet C.", "Tax returns, bookkeeping and audit support by Brevet C-certified consultants."),
          image: asset("v5f-ledger"),
          align: "left",
          overlay: 70,
          actions: [[tr("Jadwalkan konsultasi", "Book a consultation"), href("contact"), "light"]],
        }),
        numbers(TX, { items: [["1.400+", tr("SPT dilaporkan", "Returns filed")], ["0", tr("Denda telat lapor", "Late-filing fines")], ["9", tr("Konsultan bersertifikat", "Certified consultants")], ["15", tr("Tahun pengalaman", "Years' experience")]] }),
        specialty(TX, {
          side: { title: tr("Tenggat terdekat", "Upcoming deadlines"), items: [tr("31 Mar · SPT orang pribadi", "31 Mar · Personal returns"), tr("30 Apr · SPT badan", "30 Apr · Corporate returns"), tr("Tgl 20 · PPN bulanan", "20th · Monthly VAT")], action: [tr("Ingatkan saya", "Remind me"), href("contact")], inv: true },
          eyebrow: tr("Layanan", "Services"),
          title: tr("Dari SPT sampai pemeriksaan", "From returns to audits"),
          items: [
            { icon: "§", title: tr("SPT tahunan", "Annual returns"), text: tr("Pribadi & badan, termasuk lampiran.", "Personal & corporate, including schedules.") },
            { icon: "₪", title: tr("Pembukuan bulanan", "Monthly bookkeeping"), text: tr("Laporan rapi tiap tanggal 10.", "Tidy reports by the 10th.") },
            { icon: "⚖", title: tr("Pemeriksaan", "Audits"), text: tr("Pendampingan sampai SKP terbit.", "Support until the assessment is issued.") },
            { icon: "✎", title: tr("Perencanaan pajak", "Tax planning"), text: tr("Struktur usaha yang efisien & legal.", "Efficient, legal business structures.") },
          ],
          ratio: "1/3",
        }),
        quotesD(TX, { title: tr("Klien kami", "Our clients"), items: [{ quote: tr("Pemeriksaan pajak kami selesai tanpa koreksi besar.", "Our tax audit closed without major corrections."), author: "Rudi Hartanto", role: tr("Pemilik pabrik roti", "Bakery owner"), avatar: asset("v4e-face-1") }, { quote: tr("Laporan bulanannya jelas, saya akhirnya paham arus kas.", "The monthly reports are clear; I finally understand my cash flow."), author: "Sinta Maharani", role: tr("Pemilik butik", "Boutique owner"), avatar: asset("v4e-face-2") }] }),
      ],
      services: () => [
        pageHead(TX, { eyebrow: tr("Layanan", "Services"), title: tr("Layanan pajak lengkap", "Full tax services") }),
        editorial(TX, { title: tr("Cara kami bekerja", "How we work"), cols: [[tr("Pahami", "Understand"), tr("Kami pelajari usaha dan dokumen Anda.", "We study your business and documents.")], [tr("Hitung", "Calculate"), tr("Pajak dihitung dua kali oleh konsultan berbeda.", "Taxes are checked twice by different consultants.")], [tr("Laporkan", "File"), tr("Dilaporkan tepat waktu, bukti dikirim ke Anda.", "Filed on time, with receipts sent to you.")]] }),
        fullSplit(TX, { title: tr("Pendampingan pemeriksaan", "Audit support"), text: tr("Menerima surat dari kantor pajak? Kami bantu menyiapkan jawaban dan hadir mendampingi.", "Received a letter from the tax office? We help prepare your response and attend with you."), bullets: [tr("Analisis surat 1×24 jam", "Letter review within 24 hours"), tr("Penyusunan dokumen", "Document preparation"), tr("Hadir saat pembahasan", "Present at hearings")], image: asset("v5f-ledger-blue"), alt: tr("Dokumen pajak", "Tax documents"), reverse: true, tone: "primary" }),
      ],
      pricing: () => [
        pageHead(TX, { eyebrow: tr("Biaya", "Pricing"), title: tr("Biaya jelas di depan", "Clear fees up front") }),
        priceSwitchD(TX, {
          title: tr("Paket pembukuan", "Bookkeeping plans"),
          plans: [
            tr("Mikro | Rp750rb | Rp7,5jt | Pembukuan ≤ 100 transaksi; PPh final UMKM | Pilih", "Micro | Rp750k | Rp7.5m | Up to 100 transactions; SME final tax | Choose"),
            tr("Usaha | Rp1,9jt | Rp19jt | ≤ 500 transaksi; PPN & PPh 21; Laporan bulanan | Pilih", "Business | Rp1.9m | Rp19m | Up to 500 transactions; VAT & payroll tax; Monthly report | Choose"),
            tr("Korporat | Rp4,5jt | Rp45jt | Transaksi tanpa batas; Semua jenis pajak; Konsultan khusus | Hubungi", "Corporate | Rp4.5m | Rp45m | Unlimited transactions; All tax types; Dedicated consultant | Contact"),
          ],
          labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")],
          href: href("contact"),
        }),
        tableD(TX, { title: tr("Layanan satuan", "One-off services"), columns: [tr("Layanan", "Service"), tr("Biaya", "Fee")], rows: [[tr("SPT pribadi karyawan", "Employee personal return"), "Rp250.000"], [tr("SPT pribadi usahawan", "Self-employed return"), "Rp900.000"], [tr("SPT badan", "Corporate return"), tr("Mulai Rp3,5 jt", "From Rp3.5m")]], note: tr("Harga contoh, belum PPN.", "Sample prices, excl. VAT.") }),
      ],
      guides: () => [
        pageHead(TX, { eyebrow: tr("Panduan", "Guides"), title: tr("Panduan pajak singkat", "Short tax guides") }),
        indexList(TX, { title: tr("Artikel terbaru", "Latest articles"), rows: [{ title: tr("Cara lapor SPT orang pribadi lewat e-Filing", "How to file a personal return via e-Filing"), meta: tr("8 menit baca", "8 min read"), tag: "SPT" }, { title: tr("PPh final 0,5% untuk UMKM: siapa yang berhak?", "The 0.5% SME final tax: who qualifies?"), meta: tr("6 menit baca", "6 min read"), tag: "UMKM" }, { title: tr("Menyiapkan dokumen sebelum pemeriksaan", "Preparing documents before an audit"), meta: tr("10 menit baca", "10 min read"), tag: tr("Pemeriksaan", "Audit") }] }),
        faqD(TX, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Apakah data saya aman?", "Is my data safe?"), tr("Dokumen disimpan terenkripsi dan hanya diakses konsultan Anda.", "Documents are stored encrypted and only your consultant can access them.")], [tr("Bisa konsultasi daring?", "Can I consult online?"), tr("Bisa lewat video call.", "Yes, over video call.")]] }),
      ],
      contact: () => [
        pageHead(TX, { eyebrow: tr("Konsultasi", "Consult"), title: tr("30 menit pertama gratis", "The first 30 minutes are free") }),
        formD(TX, {
          title: tr("Jadwalkan konsultasi", "Book a consultation"),
          info: [[tr("Telepon", "Phone"), "021 5000 7788"], ["Email", "halo@taksa.id"], [tr("Kantor", "Office"), "Jl. Sudirman Kav. 52, Jakarta"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") },
            { kind: "select", label: tr("Kebutuhan", "Need"), ph: tr("Pilih kebutuhan", "Choose a need"), options: [tr("SPT tahunan", "Annual return"), tr("Pembukuan", "Bookkeeping"), tr("Pemeriksaan", "Audit"), tr("Lainnya", "Other")] },
            { kind: "date", label: tr("Waktu konsultasi", "Consultation time"), mode: "datetime-local" },
          ],
          submit: tr("Kirim", "Send"),
        }),
      ],
    }),
};

/* ------------- 6. Riang Pesta EO — event organizer (6 hlm, Premium) ------------- */
// Premium: mega-menu, countdown, gallery-lightbox, logo-marquee, stats-counter, pricing (plans), pricing-cards (preset Pro). Library: Animate + Tilt.

const RP: Palette = { ink: "#3b0764", muted: "#6b4a7f", primary: "#c026d3", primaryDark: "#86198f", soft: "#fae8ff", line: "#f5d0fe" };
const R = lookD(RP, { head: "Pacifico", body: "Poppins", shape: "retro", radius: 16, bg: "#fffaff", alt: "#fdf0ff", inv: "#2e1065", fx: { animate: "zoomIn", tilt: true } });

const rHead = (tr: Tr, href: (k: string) => string) =>
  headerD("Riang Pesta", R, { variant: "bar", sticky: true, nav: megaD(R, [tr("Layanan", "Services"), tr("Paket", "Packages"), tr("Portofolio", "Portfolio"), tr("Proses", "Process")], tr("Konsultasi", "Consult"), href("contact")) });
const rFoot = (tr: Tr) =>
  footerD("Riang Pesta EO", R, {
    variant: "giant",
    about: tr("Event organizer untuk ulang tahun, pernikahan intim, dan acara kantor di Surabaya.", "Event organizer for birthdays, intimate weddings and office events in Surabaya."),
    cols: [{ title: tr("Kontak", "Contact"), items: ["0857 3300 2266", "halo@riangpesta.id", "Jl. Darmo Permai 9, Surabaya"] }],
    social: ["Instagram | https://instagram.com/riangpesta", "TikTok | https://tiktok.com/@riangpesta"],
    copy: tr("© 2026 Riang Pesta EO. Konten contoh.", "© 2026 Riang Pesta EO. Sample content."),
  });

export const eventRiangPesta: TemplateContent = {
  brand: "Riang Pesta EO",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("packages", ["paket", "Paket"], ["packages", "Packages"]),
    pg("portfolio", ["portofolio", "Portofolio"], ["portfolio", "Portfolio"]),
    pg("process", ["proses", "Proses"], ["process", "Process"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) =>
    render(R, key, rHead(tr, href), rFoot(tr), {
      home: () => [
        fullHeader(R, {
          eyebrow: tr("Event organizer · Surabaya", "Event organizer · Surabaya"),
          title: tr("Pesta Anda, kami yang repot", "Your party, our hassle"),
          text: tr("Dekorasi, katering, MC, sampai bersih-bersih. Anda tinggal datang dan bersenang-senang.", "Decor, catering, MC and clean-up. You just show up and have fun."),
          image: asset("v5f-party-night"),
          actions: [[tr("Lihat paket", "See packages"), href("packages"), "light"], [tr("Portofolio", "Portfolio"), href("portfolio"), "dark"]],
        }),
        marqueeD(R, { title: tr("Dipercaya oleh", "Trusted by"), items: ["Bank Arta", "Kopi Senandung", "SMA Cendekia", "Hotel Wijaya", "Studio Kirana", "Rumah Sakit Bunda"] }),
        specialty(R, {
          side: { title: tr("Kalender kami", "Our calendar"), text: tr("Tanggal akhir pekan cepat penuh. Kunci tanggal dengan DP 20%.", "Weekends fill up fast. Lock a date with a 20% deposit."), action: [tr("Cek tanggal", "Check a date"), href("contact")] },
          eyebrow: tr("Acara", "Events"),
          title: tr("Acara yang kami tangani", "Events we run"),
          items: [
            { icon: "🎂", title: tr("Ulang tahun", "Birthdays"), text: tr("Tema karakter sampai pesta taman.", "From character themes to garden parties.") },
            { icon: "💍", title: tr("Pernikahan intim", "Intimate weddings"), text: tr("50–150 tamu, dekor hangat.", "50–150 guests, warm decor.") },
            { icon: "🏢", title: tr("Acara kantor", "Office events"), text: tr("Gathering, peluncuran produk.", "Gatherings, product launches.") },
            { icon: "🎓", title: tr("Wisuda & reuni", "Graduations & reunions"), text: tr("Panggung, foto booth, dan musik.", "Stage, photo booth and music.") },
          ],
          cols: 2,
          sideRight: true,
        }),
        counterD(R, { title: tr("Sejak 2016", "Since 2016"), items: ["640 | " + tr("Acara selesai", "Events delivered"), "52.000 | " + tr("Tamu bahagia", "Happy guests"), "35 | " + tr("Vendor mitra", "Partner vendors"), "4,9 | " + tr("Rating", "Rating")], inv: true }),
      ],
      services: () => [
        pageHead(R, { eyebrow: tr("Layanan", "Services"), title: tr("Semua bisa diatur", "Everything sorted") }),
        cardsD(R, { title: tr("Yang kami siapkan", "What we prepare"), items: [{ icon: "🎈", title: tr("Dekorasi", "Decor"), text: tr("Balon, bunga, backdrop, lampu.", "Balloons, flowers, backdrops, lights.") }, { icon: "🍰", title: tr("Katering & kue", "Catering & cake"), text: tr("Dari vendor mitra terkurasi.", "From curated partner vendors.") }, { icon: "🎤", title: tr("MC & hiburan", "MC & entertainment"), text: tr("MC, badut, band akustik.", "MCs, clowns, acoustic bands.") }, { icon: "📸", title: tr("Foto & video", "Photo & video"), text: tr("Dokumentasi + foto booth.", "Coverage + photo booth.") }, { icon: "🧹", title: tr("Bersih-bersih", "Clean-up"), text: tr("Venue kembali rapi.", "Venue left spotless.") }, { icon: "🗂", title: tr("Koordinator hari H", "Day-of coordinator"), text: tr("Satu kontak untuk semua.", "One contact for everything.") }] }),
        fullImage(R, { image: asset("v5f-party"), alt: tr("Dekorasi balon", "Balloon decor"), ratio: "21 / 6" }),
      ],
      packages: () => [
        pageHead(R, { eyebrow: tr("Paket", "Packages"), title: tr("Paket pesta", "Party packages") }),
        plansD(R, {
          title: tr("Pilih paket", "Pick a package"),
          items: [
            { plan: tr("Ceria", "Cheerful"), price: "Rp4,5jt", period: tr("/acara", "/event"), description: tr("Hingga 30 tamu", "Up to 30 guests"), features: [tr("Dekor balon", "Balloon decor"), "MC", tr("Kue 2 tingkat", "2-tier cake")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact") },
            { plan: tr("Meriah", "Festive"), price: "Rp12jt", period: tr("/acara", "/event"), description: tr("Hingga 100 tamu", "Up to 100 guests"), features: [tr("Dekor tema", "Themed decor"), tr("MC + hiburan", "MC + entertainment"), tr("Foto booth", "Photo booth"), tr("Katering", "Catering")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact"), featured: true, badge: tr("Favorit", "Favourite") },
            { plan: tr("Akbar", "Grand"), price: "Rp28jt", period: tr("/acara", "/event"), description: tr("Hingga 250 tamu", "Up to 250 guests"), features: [tr("Panggung & sound", "Stage & sound"), tr("Band", "Band"), tr("Video sinematik", "Cinematic video")], buttonText: tr("Pilih", "Choose"), buttonHref: href("contact") },
          ],
        }),
        countdownD(R, { eyebrow: tr("Promo akhir tahun", "Year-end deal"), title: tr("Gratis foto booth", "Free photo booth"), text: tr("Untuk paket Meriah yang dipesan sebelum promo berakhir.", "For Festive packages booked before the deal ends."), target: "2026-12-20T23:59", finished: tr("Promo berakhir", "Deal ended") }),
      ],
      portfolio: () => [
        pageHead(R, { eyebrow: tr("Portofolio", "Portfolio"), title: tr("Pesta-pesta kami", "Our parties") }),
        galleryLb(R, { title: tr("Galeri acara", "Event gallery"), images: [[asset("v5f-party"), tr("Ulang tahun Kirana", "Kirana's birthday")], [asset("v5f-party-night"), tr("Gathering Bank Arta", "Bank Arta gathering")], [asset("v5f-party"), tr("Pernikahan taman", "Garden wedding")], [asset("v5f-party-night"), tr("Reuni SMA", "School reunion")], [asset("v5f-party"), tr("Peluncuran kopi", "Coffee launch")], [asset("v5f-party-night"), tr("Wisuda TK", "Kindergarten graduation")]], cols: 3 }),
      ],
      process: () => [
        pageHead(R, { eyebrow: tr("Proses", "Process"), title: tr("Dari ide ke hari H", "From idea to the big day") }),
        timelineD(R, { title: tr("Tahapan", "Stages"), items: [[tr("H-60", "D-60"), tr("Konsultasi", "Consultation"), tr("Tema, anggaran, dan tamu.", "Theme, budget and guests.")], [tr("H-45", "D-45"), tr("Konsep & vendor", "Concept & vendors"), tr("Moodboard dan penawaran.", "Moodboard and quote.")], [tr("H-7", "D-7"), tr("Gladi", "Rehearsal"), tr("Cek alur dan lokasi.", "Run-through and venue check.")], [tr("Hari H", "The day"), tr("Pesta!", "Party!"), tr("Kami urus semuanya.", "We handle everything.")]] }),
        withFx(R, pricingCards(pro(R), tr, { title: tr("Tambahan populer", "Popular add-ons"), plans: [{ name: tr("Badut", "Clown"), price: "Rp750rb", period: tr("/2 jam", "/2 hrs"), text: tr("Sulap & balon", "Magic & balloons"), features: [tr("Untuk anak 3–10 th", "For ages 3–10")], cta: { label: tr("Tambah", "Add"), href: href("contact") } }, { name: tr("Foto booth", "Photo booth"), price: "Rp1,5jt", period: tr("/acara", "/event"), text: tr("Cetak sepuasnya", "Unlimited prints"), features: [tr("Properti lucu", "Fun props"), tr("Bingkai kustom", "Custom frame")], cta: { label: tr("Tambah", "Add"), href: href("contact") }, featured: true }, { name: tr("Kembang api dingin", "Cold sparklers"), price: "Rp2jt", period: tr("/acara", "/event"), text: tr("Aman di dalam ruangan", "Safe indoors"), features: [tr("4 titik", "4 points")], cta: { label: tr("Tambah", "Add"), href: href("contact") } }] })),
      ],
      contact: () => [
        pageHead(R, { eyebrow: tr("Kontak", "Contact"), title: tr("Ceritakan pesta impian Anda", "Tell us about your dream party") }),
        formD(R, {
          title: tr("Formulir konsultasi", "Consultation form"),
          info: [["WhatsApp", "0857 3300 2266"], ["Email", "halo@riangpesta.id"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
            { kind: "select", label: tr("Jenis acara", "Event type"), ph: tr("Pilih", "Choose"), options: [tr("Ulang tahun", "Birthday"), tr("Pernikahan", "Wedding"), tr("Acara kantor", "Office event"), tr("Lainnya", "Other")] },
            { kind: "date", label: tr("Tanggal acara", "Event date") },
            { kind: "input", label: tr("Jumlah tamu", "Guests"), ph: "80", type: "number" },
          ],
          submit: tr("Kirim", "Send"),
        }),
      ],
    }),
};

/* ------------- 7. Cukur Jenggala — barbershop (4 hlm, Premium) ------------- */
// Premium: before-after, progress. Library: AOS + Tilt.

const CP: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#b91c1c", primaryDark: "#7f1d1d", soft: "#fee2e2", line: "#e7e5e4" };
const C = lookD(CP, { head: "Bebas Neue", body: "Work Sans", shape: "brutal", radius: 0, bg: "#fafaf9", alt: "#f5f5f4", inv: "#1c1917", fx: { aos: "fade-up", tilt: true }, upper: true });

const cFoot = (tr: Tr) =>
  footerD("Cukur Jenggala", C, {
    variant: "slim",
    about: tr("Barbershop klasik di Malang. Potong, cukur jenggot, dan kopi tubruk.", "A classic barbershop in Malang. Cuts, beard shaves and black coffee."),
    copy: tr("© 2026 Cukur Jenggala. Konten contoh.", "© 2026 Cukur Jenggala. Sample content."),
    social: ["Instagram | https://instagram.com/cukurjenggala"],
  });

export const barberCukurJenggala: TemplateContent = {
  brand: "Cukur Jenggala",
  pages: [home(), pg("services", ["layanan", "Layanan"], ["services", "Services"]), pg("barbers", ["kapster", "Kapster"], ["barbers", "Barbers"]), pg("book", ["antre", "Antre"], ["book", "Book"])],
  build: (key, tr, href) =>
    render(C, key, headerD("Jenggala", C, { variant: "ink", cta: [tr("Ambil antrean", "Get in line"), href("book")] }), cFoot(tr), {
      home: () => [
        fullHeader(C, {
          eyebrow: tr("Barbershop · Malang", "Barbershop · Malang"),
          title: tr("Rapi tanpa basa-basi", "Sharp, no fuss"),
          text: tr("Potong klasik, fade, dan cukur jenggot pakai handuk hangat. Buka setiap hari 10.00–22.00.", "Classic cuts, fades and hot-towel beard shaves. Open daily 10am–10pm."),
          image: asset("v5f-barber"),
          align: "left",
          size: 88,
          actions: [[tr("Ambil antrean", "Get in line"), href("book"), "light"]],
        }),
        specialty(C, {
          side: { title: tr("Harga", "Prices"), items: [tr("Potong · Rp45rb", "Cut · Rp45k"), tr("Potong + cuci · Rp60rb", "Cut + wash · Rp60k"), tr("Cukur jenggot · Rp35rb", "Beard shave · Rp35k"), tr("Paket lengkap · Rp95rb", "Full package · Rp95k")], action: [tr("Pesan", "Book"), href("book")], inv: true },
          eyebrow: tr("Layanan", "Services"),
          title: tr("Dikerjakan pelan, hasilnya tahan lama", "Done slowly, made to last"),
          items: [
            { icon: "✂", title: tr("Potong klasik", "Classic cut"), text: tr("Gunting & sisir, rapi sampai tengkuk.", "Scissors and comb, neat to the nape.") },
            { icon: "⌁", title: "Skin fade", text: tr("Gradasi halus dari kulit.", "A smooth gradient from the skin.") },
            { icon: "☕", title: tr("Kopi gratis", "Free coffee"), text: tr("Kopi tubruk Dampit selama menunggu.", "Dampit black coffee while you wait.") },
            { icon: "♨", title: tr("Handuk hangat", "Hot towel"), text: tr("Untuk setiap cukur jenggot.", "With every beard shave.") },
          ],
          cols: 2,
        }),
        beforeAfterD(C, { title: tr("Sebelum & sesudah", "Before & after"), before: asset("v5f-barber-light"), after: asset("v5f-barber"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Hasil potong rambut", "Haircut result") }),
      ],
      services: () => [
        pageHead(C, { eyebrow: tr("Layanan", "Services"), title: tr("Menu barbershop", "Barbershop menu") }),
        tableD(C, { title: tr("Daftar harga", "Price list"), columns: [tr("Layanan", "Service"), tr("Durasi", "Duration"), tr("Harga", "Price")], rows: [[tr("Potong", "Cut"), tr("30 menit", "30 min"), "Rp45.000"], [tr("Potong + cuci", "Cut + wash"), tr("40 menit", "40 min"), "Rp60.000"], [tr("Cukur jenggot", "Beard shave"), tr("25 menit", "25 min"), "Rp35.000"], [tr("Pewarnaan", "Colouring"), tr("60 menit", "60 min"), "Rp150.000"]], note: tr("Harga contoh.", "Sample prices.") }),
        fullImage(C, { image: asset("v5f-barber-light"), alt: tr("Kursi barbershop", "Barber chairs"), ratio: "21 / 6" }),
      ],
      barbers: () => [
        pageHead(C, { eyebrow: tr("Kapster", "Barbers"), title: tr("Tangan-tangan terampil", "Skilled hands") }),
        peopleD(C, { title: tr("Kapster kami", "Our barbers"), items: [{ name: "Bayu", role: tr("Kepala kapster", "Head barber"), photo: asset("v4e-face-1"), text: tr("12 tahun memotong rambut.", "12 years cutting hair.") }, { name: "Damar", role: tr("Spesialis fade", "Fade specialist"), photo: asset("v4e-face-3") }, { name: "Yoga", role: tr("Spesialis jenggot", "Beard specialist"), photo: asset("v4e-face-1") }], cols: 3 }),
        progressD(C, { title: tr("Paling sering dipesan", "Most requested"), bars: [["Skin fade", 82], [tr("Potong klasik", "Classic cut"), 64], [tr("Cukur jenggot", "Beard shave"), 48]] }),
      ],
      book: () => [
        pageHead(C, { eyebrow: tr("Antre", "Book"), title: tr("Ambil antrean dari rumah", "Join the queue from home") }),
        formD(C, {
          title: tr("Formulir antrean", "Queue form"),
          info: [["WhatsApp", "0812 3456 1010"], [tr("Alamat", "Address"), "Jl. Ijen 33, Malang"], [tr("Jam", "Hours"), "10.00–22.00"]],
          fields: [
            { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
            { kind: "select", label: tr("Kapster", "Barber"), ph: tr("Siapa saja", "Anyone"), options: ["Bayu", "Damar", "Yoga"] },
            { kind: "date", label: tr("Waktu", "Time"), mode: "datetime-local" },
          ],
          submit: tr("Ambil antrean", "Join queue"),
        }),
        rail(C, { title: tr("Alur antrean", "How the queue works"), steps: [[tr("Daftar", "Sign up"), tr("Isi formulir di atas.", "Fill in the form above.")], [tr("Tunggu pesan", "Wait for a message"), tr("Kami kabari 15 menit sebelumnya.", "We ping you 15 minutes ahead.")], [tr("Datang", "Come in"), tr("Langsung duduk di kursi.", "Go straight to the chair.")]] }),
      ],
    }),
};

