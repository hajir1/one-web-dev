import { asset } from "../../../assets";
import { linkButton, type Palette } from "../../../build";
import { ctaBand, faqAccordion, featuresIcons, portfolioMosaic, pricingCards, servicesSplit, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent } from "../../../types";
import { footer, header } from "../../pro/kit";
import {
  FONTS,
  article,
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
  mega,
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
  slider,
  stars,
  story,
  tableBlock,
  tabsBlock,
  timeline,
  typer,
  videoBlock,
} from "./kitA";

/* ================================================================== */
/* Template v2 A21–A25: Gigi, Umrah, Festival, Agensi, Manufaktur.       */
/* ================================================================== */

/* ------------------- 21. Klinik Gigi Senyum Seri (6 hlm) ------------- */

const SS: Palette = { ink: "#164e63", muted: "#4b6b78", primary: "#0891b2", primaryDark: "#0e7490", soft: "#ecfeff", line: "#a5f3fc" };
const ss = look(SS, { bg: "#ffffff", alt: "#f0fdff", dark: "#164e63", radius: 22, headFont: FONTS.rounded, font: FONTS.sans });

export const healthDental: TemplateContent = {
  brand: "Klinik Gigi Senyum Seri",
  pages: [home(), pg("treatments", ["perawatan", "Perawatan"], ["treatments", "Treatments"]), pg("dentists", ["dokter-gigi", "Dokter Gigi"], ["dentists", "Dentists"]), pg("prices", ["tarif", "Tarif"], ["prices", "Prices"]), pg("visit", ["info-pasien", "Info Pasien"], ["patient-info", "Patient Info"]), pg("booking", ["reservasi", "Reservasi"], ["book", "Book"])],
  build: (key, tr, href) => {
    const head = header("Senyum Seri", SS, { font: FONTS.rounded, cta: linkButton(tr("Reservasi", "Book"), href("booking"), "primary", SS) });
    const end = footer(
      "Klinik Gigi Senyum Seri",
      tr("Klinik gigi keluarga di Tebet, Jakarta. Izin Dinkes DKI.", "Family dental clinic in Tebet, Jakarta. Licensed by the Jakarta Health Office."),
      [
        { title: tr("Perawatan", "Treatments"), items: [tr("Scaling", "Cleaning"), tr("Behel", "Braces"), tr("Implan", "Implants"), tr("Gigi anak", "Kids' dentistry")] },
        { title: tr("Klinik", "Clinic"), items: ["Jl. Tebet Raya 77, Jakarta", "+62 21 8370 1122", tr("Sen–Sab 09.00–21.00", "Mon–Sat 9am–9pm")] },
      ],
      tr("© 2026 Klinik Gigi Senyum Seri. Informasi bukan pengganti konsultasi.", "© 2026 Senyum Seri Dental. Not a substitute for a consultation."),
      "#0c3442",
    );
    switch (key) {
      case "treatments":
        return page(ss, [
          head,
          pageBanner(ss, { eyebrow: tr("Perawatan", "Treatments"), title: tr("Dari pembersihan hingga implan", "From cleaning to implants"), align: "center" }),
          tabsBlock(ss, {
            title: tr("Pilih kebutuhan", "Choose a need"),
            variant: "pills",
            tabs: [
              [tr("Pencegahan", "Prevention"), tr("Scaling & polishing, fluoride, dan sealant untuk anak. Disarankan setiap 6 bulan.", "Cleaning & polishing, fluoride, and sealants for kids. Recommended every 6 months.")],
              [tr("Estetika", "Cosmetic"), tr("Bleaching, veneer komposit & porselen, serta bonding gigi depan.", "Whitening, composite & porcelain veneers, and front-tooth bonding.")],
              [tr("Ortodonti", "Orthodontics"), tr("Behel metal, keramik, dan clear aligner dengan simulasi 3D.", "Metal and ceramic braces, and clear aligners with 3D simulation.")],
              [tr("Bedah & implan", "Surgery & implants"), tr("Cabut gigi bungsu, implan titanium, dan bone graft.", "Wisdom tooth removal, titanium implants, and bone grafts.")],
            ],
          }),
          story(ss, { eyebrow: tr("Teknologi", "Technology"), title: tr("Rontgen digital, radiasi 80% lebih rendah", "Digital X-rays, 80% less radiation"), paras: [tr("Hasil rontgen panoramik dan scan 3D langsung tampil di layar, jadi Anda bisa melihat sendiri kondisi gigi.", "Panoramic X-rays and 3D scans appear on screen right away, so you can see your teeth for yourself.")], bullets: [tr("Intraoral scanner, tanpa cetakan", "Intraoral scanner, no impressions"), tr("Sterilisasi autoklaf kelas B", "Class B autoclave sterilization")], image: asset("v2a-dental-hero"), alt: tr("Gigi bersih", "Clean tooth"), bg: ss.alt }),
          end,
        ]);
      case "dentists":
        return page(ss, [
          head,
          people(ss, {
            eyebrow: tr("Dokter gigi", "Dentists"),
            title: tr("Spesialis yang ramah", "Friendly specialists"),
            items: [
              { name: "drg. Maya Anggraini, Sp.Ort", role: tr("Ortodonti", "Orthodontics"), photo: asset("v2a-face-3"), text: tr("Behel & aligner, 14 tahun.", "Braces & aligners, 14 years.") },
              { name: "drg. Reza Firmansyah, Sp.BM", role: tr("Bedah mulut", "Oral surgery"), photo: asset("v2a-face-2"), text: tr("Implan & gigi bungsu.", "Implants & wisdom teeth.") },
              { name: "drg. Tania Wijaya, Sp.KGA", role: tr("Gigi anak", "Pediatric"), photo: asset("v2a-face-5"), text: tr("Ramah anak & penakut.", "Great with kids & nervous patients.") },
              { name: "drg. Hadi Susanto", role: tr("Umum & estetika", "General & cosmetic"), photo: asset("v2a-face-4"), text: tr("Veneer & bleaching.", "Veneers & whitening.") },
            ],
          }),
          tableBlock(ss, { title: tr("Jadwal praktik", "Schedule"), columns: [tr("Dokter", "Dentist"), tr("Hari", "Days"), tr("Jam", "Hours")], rows: [["drg. Maya", tr("Sen, Rab, Jum", "Mon, Wed, Fri"), "15.00–21.00"], ["drg. Reza", tr("Sel, Kam", "Tue, Thu"), "10.00–17.00"], ["drg. Tania", tr("Sen–Sab", "Mon–Sat"), "09.00–14.00"], ["drg. Hadi", tr("Sen–Sab", "Mon–Sat"), "14.00–21.00"]], bg: ss.alt }),
          end,
        ]);
      case "prices":
        return page(ss, [
          head,
          tableBlock(ss, {
            eyebrow: tr("Tarif 2026", "2026 prices"),
            title: tr("Harga jelas sebelum perawatan", "Clear prices before treatment"),
            columns: [tr("Perawatan", "Treatment"), tr("Mulai dari", "From"), tr("Durasi", "Duration")],
            rows: [[tr("Konsultasi & rontgen", "Consultation & X-ray"), "Rp150.000", tr("30 menit", "30 min")], ["Scaling & polishing", "Rp350.000", tr("45 menit", "45 min")], [tr("Tambal komposit", "Composite filling"), "Rp400.000", tr("30 menit", "30 min")], ["Bleaching", "Rp2.500.000", tr("90 menit", "90 min")], [tr("Behel metal", "Metal braces"), "Rp7.000.000", tr("18–24 bulan", "18–24 months")], [tr("Implan", "Implant"), "Rp15.000.000", tr("3–6 bulan", "3–6 months")]],
          }),
          pricingCards(ss, tr, {
            eyebrow: tr("Keanggotaan keluarga", "Family membership"),
            title: tr("Rawat gigi sekeluarga, bayar bulanan", "Family dental care, paid monthly"),
            badge: tr("Hemat", "Best value"),
            plans: [
              { name: tr("Individu", "Individual"), price: "Rp95rb", period: tr("/bulan", "/month"), text: tr("Satu orang.", "One person."), features: [tr("2× scaling/tahun", "2 cleanings/year"), tr("Konsultasi tanpa batas", "Unlimited consultations")], cta: { label: tr("Gabung", "Join"), href: href("booking") } },
              { name: tr("Keluarga", "Family"), price: "Rp299rb", period: tr("/bulan", "/month"), text: tr("Hingga 4 orang.", "Up to 4 people."), features: [tr("2× scaling/tahun per orang", "2 cleanings/year each"), tr("Fluoride anak", "Kids' fluoride"), tr("Diskon 15% perawatan", "15% off treatments")], cta: { label: tr("Gabung", "Join"), href: href("booking") }, featured: true },
              { name: tr("Ortho Care", "Ortho Care"), price: "Rp450rb", period: tr("/bulan", "/month"), text: tr("Pengguna behel.", "For braces wearers."), features: [tr("Kontrol bulanan", "Monthly adjustments"), tr("Retainer gratis", "Free retainer")], cta: { label: tr("Gabung", "Join"), href: href("booking") } },
            ],
          }),
          end,
        ]);
      case "visit":
        return page(ss, [
          head,
          process(ss, { eyebrow: tr("Kunjungan pertama", "First visit"), title: tr("Apa yang terjadi", "What to expect"), steps: [[tr("Registrasi", "Registration"), tr("Datang 10 menit lebih awal.", "Arrive 10 minutes early.")], [tr("Pemeriksaan", "Exam"), tr("Rontgen digital & foto intraoral.", "Digital X-ray & intraoral photos.")], [tr("Rencana", "Plan"), tr("Pilihan perawatan & biaya tertulis.", "Written options & costs.")], [tr("Perawatan", "Treatment"), tr("Hari itu juga bila memungkinkan.", "Same day when possible.")]] }),
          faqList(ss, {
            title: tr("Info pasien", "Patient info"),
            items: [
              [tr("Menerima BPJS?", "Do you accept BPJS?"), tr("Belum. Kami menerima beberapa asuransi swasta rekanan.", "Not yet. We accept several partner private insurers.")],
              [tr("Aman untuk ibu hamil?", "Safe during pregnancy?"), tr("Scaling aman di trimester kedua; rontgen ditunda.", "Cleaning is safe in the second trimester; X-rays are postponed.")],
              [tr("Anak takut ke dokter gigi?", "Kids afraid of the dentist?"), tr("drg. Tania punya sesi perkenalan gratis 15 menit.", "Dr. Tania offers a free 15-minute meet-and-greet.")],
            ],
          }),
          end,
        ]);
      case "booking":
        return page(ss, [
          head,
          notice(ss, { badge: tr("Promo", "Offer"), text: tr("Scaling gratis untuk anak di bawah 12 tahun setiap Sabtu.", "Free cleaning for kids under 12 every Saturday."), link: tr("Lihat tarif", "See prices"), href: href("prices") }),
          contact(ss, {
            eyebrow: tr("Reservasi", "Booking"),
            title: tr("Pilih dokter & jam", "Choose a dentist & time"),
            info: [["WhatsApp", "+62 812 8370 1122"], [tr("Alamat", "Address"), "Jl. Tebet Raya 77, Jakarta Selatan"]],
            fields: [
              { kind: "input", label: tr("Nama pasien", "Patient name"), ph: tr("Nama lengkap", "Full name") },
              { kind: "select", label: tr("Dokter", "Dentist"), ph: tr("Siapa saja", "Any dentist"), options: ["drg. Maya", "drg. Reza", "drg. Tania", "drg. Hadi"] },
              { kind: "select", label: tr("Keluhan", "Reason"), ph: tr("Pilih", "Choose"), options: [tr("Sakit gigi", "Toothache"), "Scaling", tr("Behel", "Braces"), tr("Konsultasi estetika", "Cosmetic consult")] },
              { kind: "date", label: tr("Tanggal & jam", "Date & time"), mode: "datetime-local" },
            ],
            submit: tr("Reservasi", "Book"),
          }),
          end,
        ]);
      default:
        return page(ss, [
          head,
          heroSplit(ss, {
            eyebrow: tr("Klinik gigi keluarga · Tebet", "Family dental clinic · Tebet"),
            title: tr("Ke dokter gigi tanpa deg-degan", "The dentist, minus the nerves"),
            text: tr("Dokter spesialis, alat digital, dan harga yang ditulis di depan. Buka sampai pukul 21.00 untuk Anda yang bekerja.", "Specialists, digital equipment, and upfront prices. Open until 9pm for working patients."),
            actions: [[tr("Reservasi online", "Book online"), href("booking")], [tr("Lihat tarif", "See prices"), href("prices"), "outline"]],
            image: asset("v2a-dental-hero"),
            alt: tr("Ilustrasi gigi", "Tooth illustration"),
            gradient: [SS.soft, "#ffffff", 180],
            extra: [stars(ss, 4.9, tr("dari 1.870 ulasan Google", "from 1,870 Google reviews"))],
          }),
          featuresIcons(ss, tr, {
            title: tr("Kenapa pasien kembali", "Why patients come back"),
            items: [
              { icon: "🦷", title: tr("Spesialis lengkap", "Full specialist team"), text: tr("Ortodonti, bedah mulut, dan gigi anak.", "Orthodontics, oral surgery, and pediatric care.") },
              { icon: "🕘", title: tr("Buka sampai malam", "Open late"), text: tr("Senin–Sabtu hingga pukul 21.00.", "Monday–Saturday until 9pm.") },
              { icon: "💳", title: tr("Cicilan 0%", "0% installments"), text: tr("Untuk behel & implan hingga 12 bulan.", "For braces & implants, up to 12 months.") },
            ],
          }),
          statsBand(ss, tr, { eyebrow: tr("Sejak 2015", "Since 2015"), title: tr("Ribuan senyum dirawat", "Thousands of smiles cared for"), stats: [["21.000+", tr("Pasien", "Patients")], ["1.300", tr("Pengguna behel", "Braces patients")], ["420", tr("Implan terpasang", "Implants placed")], ["4,9★", "Google"]] }),
          quotes(ss, {
            title: tr("Cerita pasien", "Patient stories"),
            items: [
              { quote: tr("Anak saya yang dulu menangis sekarang minta kontrol ke drg. Tania.", "My son used to cry; now he asks to see Dr. Tania."), author: "Ibu Larasati", role: tr("Pasien anak", "Pediatric patient"), avatar: asset("v2a-face-5") },
              { quote: tr("Implan pertama saya hampir tidak terasa sakit.", "My first implant barely hurt."), author: "Pak Gunawan", role: tr("Pasien implan", "Implant patient"), avatar: asset("v2a-face-6") },
            ],
            cols: 2,
          }),
          ctaBand(ss, tr, { title: tr("Sudah 6 bulan sejak scaling terakhir?", "Six months since your last cleaning?"), primary: { label: tr("Reservasi", "Book"), href: href("booking") }, secondary: { label: tr("Info pasien", "Patient info"), href: href("visit") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 22. Safar Amanah Tour (8 hlm) ------------------- */

const SF: Palette = { ink: "#134e4a", muted: "#4b635f", primary: "#0f766e", primaryDark: "#115e59", soft: "#f0fdfa", line: "#99f6e4" };
const sf = look(SF, { bg: "#ffffff", alt: "#fbf8f1", dark: "#0b2b2c", radius: 12, headFont: FONTS.elegant, font: FONTS.sans });

export const travelUmrah: TemplateContent = {
  brand: "Safar Amanah Tour",
  pages: [
    home(),
    pg("packages", ["paket-umrah", "Paket Umrah"], ["umrah-packages", "Umrah Packages"]),
    pg("itinerary", ["itinerary-12-hari", "Itinerary 12 Hari"], ["12-day-itinerary", "12-Day Itinerary"]),
    pg("departures", ["jadwal-keberangkatan", "Jadwal Keberangkatan"], ["departures", "Departures"]),
    pg("requirements", ["persyaratan", "Persyaratan"], ["requirements", "Requirements"]),
    pg("guidance", ["manasik", "Manasik"], ["guidance", "Guidance"]),
    pg("stories", ["testimoni", "Testimoni"], ["testimonials", "Testimonials"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = headerBar("Safar Amanah", sf, { info: [tr("Izin PPIU Kemenag No. 1234 Tahun 2019", "Licensed Umrah operator No. 1234/2019"), "+62 21 7400 8800"], cta: linkButton(tr("Konsultasi", "Consult us"), href("contact"), "primary", SF) });
    const end = footer(
      "Safar Amanah Tour",
      tr("Penyelenggara perjalanan ibadah umrah berizin resmi sejak 2019.", "Licensed Umrah travel organizer since 2019."),
      [
        { title: tr("Paket", "Packages"), items: [tr("Umrah reguler", "Regular Umrah"), tr("Umrah plus Turki", "Umrah + Turkey"), tr("Umrah keluarga", "Family Umrah")] },
        { title: tr("Kantor", "Office"), items: ["Jl. Fatmawati 18, Jakarta Selatan", "+62 21 7400 8800", "info@safaramanah.example"] },
      ],
      tr("© 2026 Safar Amanah Tour. Harga & jadwal contoh.", "© 2026 Safar Amanah Tour. Sample prices & dates."),
      "#0b2b2c",
    );
    const pkgs = [
      { image: asset("v2a-umrah-hero"), title: tr("Umrah Reguler 12 Hari", "12-Day Regular Umrah"), text: tr("Hotel bintang 4, 300 m dari masjid", "4-star hotel, 300 m from the mosque"), price: "Rp32.500.000", badge: tr("Terlaris", "Best seller"), rating: 4.9, reviews: "(860)", cta: tr("Lihat itinerary", "See itinerary"), href: href("itinerary") },
      { image: asset("v2a-umrah-dusk"), title: tr("Umrah Plus Turki 15 Hari", "15-Day Umrah + Turkey"), text: tr("Istanbul & Bursa 3 malam", "3 nights in Istanbul & Bursa"), price: "Rp41.900.000", rating: 4.8, reviews: "(212)", cta: tr("Lihat itinerary", "See itinerary"), href: href("itinerary") },
      { image: asset("v2a-umrah-hero"), title: tr("Umrah VIP 9 Hari", "9-Day VIP Umrah"), text: tr("Hotel bintang 5, pelataran masjid", "5-star hotel, mosque courtyard"), price: "Rp54.000.000", rating: 5, reviews: "(98)", cta: tr("Lihat itinerary", "See itinerary"), href: href("itinerary") },
    ];
    switch (key) {
      case "packages":
        return page(sf, [
          head,
          pageBanner(sf, { eyebrow: tr("Paket 2027", "2027 packages"), title: tr("Pilih paket sesuai kebutuhan", "Choose the right package"), text: tr("Harga per orang, sekamar berempat. Upgrade sekamar berdua tersedia.", "Price per person, quad sharing. Double-room upgrades available."), align: "center" }),
          listings(sf, { title: tr("Paket tersedia", "Available packages"), items: pkgs }),
          compare(sf, {
            title: tr("Bandingkan paket", "Compare packages"),
            columns: [tr("Reguler", "Regular"), tr("Plus Turki", "Plus Turkey"), "VIP"],
            rows: [tr("Durasi | 12 hari | 15 hari | 9 hari", "Duration | 12 days | 15 days | 9 days"), tr("Hotel Makkah | ★4 · 300 m | ★4 · 300 m | ★5 · pelataran", "Makkah hotel | 4★ · 300 m | 4★ · 300 m | 5★ · courtyard"), tr("Penerbangan langsung | ya | tidak | ya", "Direct flight | yes | no | yes"), tr("Kereta cepat Haramain | tidak | ya | ya", "Haramain high-speed rail | no | yes | yes"), tr("Muthawif per 20 jamaah | ya | ya | ya", "Guide per 20 pilgrims | yes | yes | yes")],
            highlight: 1,
            caption: tr("Termasuk visa, asuransi, & perlengkapan", "Includes visa, insurance & kit"),
            bg: sf.alt,
          }),
          end,
        ]);
      case "itinerary":
        return page(sf, [
          head,
          pageBanner(sf, { crumbs: [[tr("Paket", "Packages"), href("packages")], [tr("Reguler 12 hari", "Regular 12 days"), ""]], title: tr("Itinerary Umrah Reguler 12 Hari", "12-Day Regular Umrah Itinerary") }),
          timeline(sf, {
            title: tr("Perjalanan hari demi hari", "Day by day"),
            steps: [
              [tr("Hari 1", "Day 1"), tr("Jakarta → Madinah", "Jakarta → Madinah"), tr("Penerbangan langsung, tiba sore hari.", "Direct flight, arriving in the afternoon.")],
              [tr("Hari 2–4", "Days 2–4"), tr("Madinah", "Madinah"), tr("Salat di Masjid Nabawi, ziarah Quba & Uhud.", "Prayers at the Prophet's Mosque, visits to Quba & Uhud.")],
              [tr("Hari 5", "Day 5"), tr("Miqat & umrah pertama", "Miqat & first Umrah"), tr("Berangkat ke Makkah, miqat di Bir Ali.", "To Makkah, miqat at Bir Ali.")],
              [tr("Hari 6–10", "Days 6–10"), tr("Makkah", "Makkah"), tr("Ibadah mandiri, ziarah Jabal Rahmah & Arafah.", "Personal worship, visits to Jabal Rahmah & Arafat.")],
              [tr("Hari 11–12", "Days 11–12"), tr("Pulang", "Return"), tr("Tawaf wada', kembali ke Jakarta.", "Farewell tawaf, return to Jakarta.")],
            ],
          }),
          tableBlock(sf, { title: tr("Hotel", "Hotels"), columns: [tr("Kota", "City"), "Hotel", tr("Jarak", "Distance"), tr("Malam", "Nights")], rows: [["Madinah", tr("Hotel ★4 pilihan", "Selected 4★ hotel"), "150 m", "4"], ["Makkah", tr("Hotel ★4 pilihan", "Selected 4★ hotel"), "300 m", "6"]], bg: sf.alt }),
          ctaBox(sf, { title: tr("Rp32.500.000 per orang", "Rp32,500,000 per person"), text: tr("Uang muka Rp5 juta mengunci kursi.", "A Rp5M deposit secures your seat."), actions: [[tr("Pesan kursi", "Reserve a seat"), href("contact"), "light"]] }),
          end,
        ]);
      case "departures":
        return page(sf, [
          head,
          notice(sf, { badge: tr("Info", "Info"), text: tr("Keberangkatan Ramadan 2027 tersisa 12 kursi.", "Only 12 seats left for Ramadan 2027 departures."), link: tr("Hubungi kami", "Contact us"), href: href("contact") }),
          tableBlock(sf, {
            title: tr("Jadwal keberangkatan", "Departure schedule"),
            columns: [tr("Tanggal", "Date"), tr("Paket", "Package"), tr("Maskapai", "Airline"), tr("Sisa kursi", "Seats left")],
            rows: [["14 Jan 2027", tr("Reguler 12 hari", "Regular 12 days"), "Hijaz Air", "18"], ["02 Feb 2027", tr("Plus Turki 15 hari", "Plus Turkey 15 days"), "Anatolia Air", "9"], ["20 Feb 2027", "VIP 9 hari", "Nusantara Air", "6"], ["01 Mar 2027", tr("Ramadan 12 hari", "Ramadan 12 days"), "Hijaz Air", "12"]],
          }),
          end,
        ]);
      case "requirements":
        return page(sf, [
          head,
          cards(sf, {
            eyebrow: tr("Persyaratan", "Requirements"),
            title: tr("Dokumen yang perlu disiapkan", "Documents to prepare"),
            variant: "line",
            cols: 4,
            items: [
              { title: tr("Paspor", "Passport"), text: tr("Berlaku minimal 8 bulan, nama 3 suku kata.", "Valid 8+ months, three-part name.") },
              { title: tr("Vaksin meningitis", "Meningitis vaccine"), text: tr("Buku kuning ICV dari KKP.", "Yellow ICV booklet.") },
              { title: tr("Foto", "Photos"), text: tr("Latar putih, wajah 80%.", "White background, face 80%.") },
              { title: tr("KTP & KK", "ID & family card"), text: tr("Untuk mahram & data visa.", "For mahram & visa data.") },
            ],
          }),
          faqList(sf, {
            title: tr("Pertanyaan jamaah", "Pilgrim questions"),
            items: [
              [tr("Perempuan wajib dengan mahram?", "Must women travel with a mahram?"), tr("Mengikuti ketentuan Saudi terbaru; perempuan di atas 18 tahun dapat berangkat dalam rombongan resmi.", "Following current Saudi rules, women over 18 may travel in an official group.")],
              [tr("Bisa untuk lansia & kursi roda?", "Elderly & wheelchair users?"), tr("Bisa, kami sediakan pendamping dan kursi roda.", "Yes, we provide companions and wheelchairs.")],
              [tr("Bisa cicil?", "Installments?"), tr("Bisa hingga 10 bulan sebelum berangkat.", "Yes, up to 10 months before departure.")],
            ],
            bg: sf.alt,
          }),
          end,
        ]);
      case "guidance":
        return page(sf, [
          head,
          process(sf, { eyebrow: tr("Manasik", "Guidance"), title: tr("Persiapan sebelum berangkat", "Preparation before departure"), steps: [[tr("Manasik 1", "Session 1"), tr("Rukun & wajib umrah.", "Pillars & duties of Umrah.")], [tr("Manasik 2", "Session 2"), tr("Praktik tawaf & sa'i.", "Tawaf & sa'i practice.")], [tr("Kesehatan", "Health"), tr("Cek & vaksin.", "Checkups & vaccines.")], [tr("Briefing", "Briefing"), tr("Koper, jadwal, kontak darurat.", "Luggage, schedule, emergency contacts.")]] }),
          videoBlock(sf, { eyebrow: tr("Video manasik", "Guidance video"), title: tr("Tata cara tawaf untuk pemula", "Tawaf for first-timers"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", bg: sf.alt }),
          people(sf, { title: tr("Pembimbing ibadah", "Spiritual guides"), round: true, items: [{ name: "Ust. H. Abdullah Faqih, Lc", role: tr("Pembimbing utama", "Head guide"), photo: asset("v2a-face-6") }, { name: "Ustz. Hj. Aisyah Rahmawati", role: tr("Pembimbing jamaah perempuan", "Guide for women pilgrims"), photo: asset("v2a-face-5") }, { name: "Ust. Fikri Ramadhan, Lc", role: tr("Muthawif Makkah", "Makkah guide"), photo: asset("v2a-face-4") }], cols: 3 }),
          end,
        ]);
      case "stories":
        return page(sf, [
          head,
          quotes(sf, {
            eyebrow: tr("Testimoni", "Testimonials"),
            title: tr("Cerita jamaah kami", "Stories from our pilgrims"),
            items: [
              { quote: tr("Ibu saya yang 78 tahun bisa tawaf dengan tenang berkat pendamping kursi roda.", "My 78-year-old mother performed tawaf calmly thanks to the wheelchair companion."), author: "Bapak Hasan", role: tr("Jamaah Januari 2026", "January 2026 pilgrim"), avatar: asset("v2a-face-6") },
              { quote: tr("Hotelnya benar-benar dekat, salat subuh tidak pernah telat.", "The hotel really was close; never late for dawn prayer."), author: "Ibu Nurlela", role: tr("Jamaah Maret 2026", "March 2026 pilgrim"), avatar: asset("v2a-face-5") },
              { quote: tr("Manasiknya detail, kami tidak bingung di sana.", "Thorough guidance; we were never lost there."), author: "Keluarga Siregar", role: tr("Jamaah Mei 2026", "May 2026 pilgrims"), avatar: asset("v2a-face-4") },
            ],
          }),
          gallery(sf, { title: tr("Dokumentasi rombongan", "Group photos"), images: [[asset("v2a-umrah-hero"), tr("Rombongan Januari", "January group")], [asset("v2a-umrah-dusk"), tr("Ziarah Uhud", "Visit to Uhud")], [asset("v2a-umrah-hero"), tr("Manasik di Jakarta", "Guidance in Jakarta")]], bg: sf.alt }),
          end,
        ]);
      case "contact":
        return page(sf, [
          head,
          contact(sf, {
            eyebrow: tr("Konsultasi gratis", "Free consultation"),
            title: tr("Rencanakan ibadah Anda", "Plan your pilgrimage"),
            text: tr("Konsultan kami membantu memilih paket, jadwal, dan skema cicilan.", "Our consultants help choose a package, date, and payment plan."),
            info: [[tr("Kantor", "Office"), "Jl. Fatmawati 18, Jakarta Selatan"], ["WhatsApp", "+62 812 7400 8800"], [tr("Jam kantor", "Office hours"), tr("Sen–Sab 08.00–17.00", "Mon–Sat 8am–5pm")]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "select", label: tr("Paket", "Package"), ph: tr("Pilih paket", "Choose a package"), options: [tr("Reguler 12 hari", "Regular 12 days"), tr("Plus Turki 15 hari", "Plus Turkey 15 days"), "VIP 9 hari"] },
              { kind: "select", label: tr("Jumlah jamaah", "Number of pilgrims"), ph: "1", options: ["1", "2", "3–5", "6+"] },
              { kind: "date", label: tr("Rencana berangkat", "Planned departure"), mode: "month" },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(sf, [
          head,
          heroCover(sf, {
            eyebrow: tr("Penyelenggara umrah resmi Kemenag", "Officially licensed Umrah organizer"),
            title: tr("Beribadah dengan tenang, kami urus sisanya", "Worship in peace, we handle the rest"),
            text: tr("Hotel dekat masjid, pembimbing berpengalaman, dan pendamping untuk jamaah lansia.", "Hotels near the mosque, experienced guides, and companions for elderly pilgrims."),
            actions: [[tr("Lihat paket", "See packages"), href("packages"), "light"], [tr("Jadwal keberangkatan", "Departures"), href("departures"), "outline"]],
            gradient: ["#0b2b2c", "#115e59", 160],
            image: asset("v2a-umrah-hero"),
            alt: tr("Siluet kubah dan menara", "Dome and minaret silhouette"),
          }),
          countdownBand(sf, { eyebrow: tr("Keberangkatan berikutnya", "Next departure"), title: tr("Umrah Reguler · 14 Januari 2027", "Regular Umrah · January 14, 2027"), text: tr("Sisa 18 kursi. Pendaftaran ditutup 30 hari sebelum berangkat.", "18 seats left. Registration closes 30 days before departure."), target: "2027-01-14T08:00", finished: tr("Rombongan sudah berangkat.", "The group has departed."), bg: SF.primaryDark, actions: [[tr("Pesan kursi", "Reserve a seat"), href("contact"), "light"]] }),
          listings(sf, { eyebrow: tr("Paket", "Packages"), title: tr("Paket umrah 2027", "2027 Umrah packages"), items: pkgs, bg: sf.alt }),
          counter(sf, { items: [tr("6.800+ | Jamaah diberangkatkan", "6,800+ | Pilgrims served"), tr("0 | Jamaah terlantar", "0 | Pilgrims stranded"), tr("1:20 | Rasio pembimbing", "1:20 | Guide ratio"), tr("4,9 | Rating jamaah", "4.9 | Pilgrim rating")] }),
          bigQuote(sf, { text: tr("Kami mengukur keberhasilan dari satu hal: jamaah pulang dengan hati tenang.", "We measure success by one thing: pilgrims returning with peaceful hearts."), name: "H. Ahmad Zaki", role: tr("Direktur", "Director") }),
          end,
        ]);
    }
  },
};

/* ------------------- 23. Gema Kota Festival (6 hlm) ------------------ */

const GK: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#e11d48", primaryDark: "#be123c", soft: "#fff1f2", line: "#fda4af" };
const gk = look(GK, { bg: "#ffffff", alt: "#fff7ed", dark: "#0c0a09", radius: 0, headFont: FONTS.grotesk, font: FONTS.grotesk });

export const eventMusicFest: TemplateContent = {
  brand: "Gema Kota Festival",
  pages: [home(), pg("lineup", ["lineup", "Lineup"], ["lineup", "Lineup"]), pg("tickets", ["tiket", "Tiket"], ["tickets", "Tickets"]), pg("schedule", ["jadwal", "Jadwal"], ["schedule", "Schedule"]), pg("venue", ["lokasi", "Lokasi & Akses"], ["venue", "Venue & Access"]), pg("faq", ["faq", "FAQ"], ["faq", "FAQ"])],
  build: (key, tr, href) => {
    const head = header("GEMA KOTA '26", GK, { bg: "#0c0a09", ink: "#ffffff", font: FONTS.grotesk, sticky: true, cta: linkButton(tr("Beli tiket", "Get tickets"), href("tickets"), "primary", GK) });
    const end = footerSlim(gk, "GEMA KOTA '26", ["Instagram", "TikTok", "Spotify", tr("Kebijakan", "Policies")], tr("© 2026 Gema Kota Festival · 28–29 November · GBK Senayan", "© 2026 Gema Kota Festival · November 28–29 · GBK Senayan"), { bg: "#0c0a09" });
    switch (key) {
      case "lineup":
        return page(gk, [
          head,
          pageBanner(gk, { eyebrow: tr("Lineup lengkap", "Full lineup"), title: tr("32 penampil, 3 panggung, 2 hari", "32 acts, 3 stages, 2 days"), light: true, bg: "#0c0a09" }),
          people(gk, {
            title: tr("Headliner", "Headliners"),
            round: true,
            items: [
              { name: "Nada Rimba", role: tr("Sabtu · Panggung Gema", "Saturday · Gema Stage"), photo: asset("v2a-face-2") },
              { name: "Laut Selatan", role: tr("Sabtu · Panggung Gema", "Saturday · Gema Stage"), photo: asset("v2a-face-4") },
              { name: "Kirana & The Lights", role: tr("Minggu · Panggung Gema", "Sunday · Gema Stage"), photo: asset("v2a-face-3") },
              { name: "DJ Arka", role: tr("Minggu · Panggung Malam", "Sunday · Night Stage"), photo: asset("v2a-face-1") },
            ],
          }),
          tabsBlock(gk, {
            title: tr("Per hari", "By day"),
            variant: "boxed",
            tabs: [
              [tr("Sabtu, 28 Nov", "Saturday, Nov 28"), "Nada Rimba · Laut Selatan · Sorai · Petrikor · Rumah Sakit · Kalaseba · +10"],
              [tr("Minggu, 29 Nov", "Sunday, Nov 29"), "Kirana & The Lights · DJ Arka · Bara Senja · Ruang Tamu · Lomba Sihir · +10"],
            ],
            bg: gk.alt,
          }),
          end,
        ]);
      case "tickets":
        return page(gk, [
          head,
          plans(gk, {
            eyebrow: tr("Tiket", "Tickets"),
            title: tr("Pilih tiketmu", "Pick your ticket"),
            text: tr("Harga presale 2 berlaku hingga 31 Oktober.", "Presale 2 prices valid until October 31."),
            items: [
              { plan: tr("1 Hari", "1-Day"), price: "Rp450rb", period: "", description: tr("Sabtu atau Minggu.", "Saturday or Sunday."), features: [tr("Akses 3 panggung", "All 3 stages"), tr("Area kuliner", "Food court")], buttonText: tr("Beli", "Buy"), buttonHref: "#beli" },
              { plan: tr("2 Hari", "2-Day"), price: "Rp790rb", period: "", description: tr("Sabtu + Minggu.", "Saturday + Sunday."), features: [tr("Akses 3 panggung", "All 3 stages"), tr("Gelang cashless", "Cashless wristband"), tr("Hemat Rp110rb", "Save Rp110k")], buttonText: tr("Beli", "Buy"), buttonHref: "#beli", featured: true, badge: tr("Terlaris", "Best seller") },
              { plan: "VIP", price: "Rp1,9jt", period: "", description: tr("2 hari, area khusus.", "2 days, VIP area."), features: [tr("Deck depan panggung", "Front-stage deck"), tr("Toilet & lounge VIP", "VIP toilets & lounge"), tr("Merch eksklusif", "Exclusive merch")], buttonText: tr("Beli", "Buy"), buttonHref: "#beli" },
            ],
          }),
          compare(gk, {
            title: tr("Bandingkan tiket", "Compare tickets"),
            columns: [tr("1 Hari", "1-Day"), tr("2 Hari", "2-Day"), "VIP"],
            rows: [tr("Jumlah hari | 1 | 2 | 2", "Days | 1 | 2 | 2"), tr("Jalur masuk cepat | tidak | tidak | ya", "Fast-track entry | no | no | yes"), tr("Lounge & toilet khusus | tidak | tidak | ya", "Lounge & private toilets | no | no | yes"), tr("Gelang cashless | tidak | ya | ya", "Cashless wristband | no | yes | yes")],
            caption: tr("Tiket tidak dapat dikembalikan.", "Tickets are non-refundable."),
            bg: gk.alt,
          }),
          end,
        ]);
      case "schedule":
        return page(gk, [
          head,
          tableBlock(gk, {
            eyebrow: tr("Sabtu, 28 November", "Saturday, November 28"),
            title: tr("Jadwal panggung", "Stage times"),
            columns: [tr("Jam", "Time"), tr("Panggung Gema", "Gema Stage"), tr("Panggung Kota", "Kota Stage"), tr("Panggung Malam", "Night Stage")],
            rows: [["15.00", "Petrikor", "Kalaseba", "—"], ["17.00", "Sorai", "Rumah Sakit", "—"], ["19.00", "Laut Selatan", "Bara Senja", "DJ Sena"], ["21.00", "Nada Rimba", "—", "DJ Arka (B2B)"], ["23.00", "—", "—", tr("Penutupan", "Closing")]],
          }),
          timeline(gk, {
            title: tr("Info hari-H", "Event-day info"),
            steps: [["13.00", tr("Gerbang dibuka", "Gates open"), tr("Tukar e-tiket ke gelang di Gerbang 5.", "Swap e-tickets for wristbands at Gate 5.")], ["14.30", tr("Kuliner & merch buka", "Food & merch open"), tr("60 tenant kuliner lokal.", "60 local food vendors.")], ["23.30", tr("Acara selesai", "Event ends"), tr("MRT beroperasi hingga 01.00.", "MRT runs until 1am.")]],
            bg: gk.alt,
          }),
          end,
        ]);
      case "venue":
        return page(gk, [
          head,
          story(gk, { eyebrow: tr("Lokasi", "Venue"), title: tr("Plaza Timur GBK Senayan", "GBK Senayan East Plaza"), paras: [tr("Masuk dari Gerbang 5, Jl. Pintu Satu Senayan. Area festival 4 hektare dengan 3 panggung.", "Enter via Gate 5, Jl. Pintu Satu Senayan. A 4-hectare site with 3 stages.")], bullets: [tr("Stasiun MRT Istora 5 menit jalan kaki", "Istora MRT station, 5-minute walk"), tr("Parkir motor & mobil di Parkir Timur", "Motorbike & car parking at East Parking"), tr("Area drop-off ojek online di Gerbang 7", "Ride-hailing drop-off at Gate 7")], image: asset("v2a-fest-stage2"), alt: tr("Peta festival", "Festival map") }),
          cards(gk, {
            title: tr("Fasilitas", "Facilities"),
            variant: "line",
            cols: 4,
            items: [
              { title: tr("Air minum gratis", "Free water"), text: tr("12 titik isi ulang, bawa botol.", "12 refill points, bring a bottle.") },
              { title: tr("Musala", "Prayer rooms"), text: tr("Dua lokasi dekat Gerbang 5 & 7.", "Two locations near Gates 5 & 7.") },
              { title: tr("Pos medis", "Medical tents"), text: tr("3 pos + ambulans siaga.", "3 tents + standby ambulance.") },
              { title: tr("Akses difabel", "Accessible access"), text: tr("Deck khusus & pendamping.", "Dedicated deck & companions.") },
            ],
          }),
          end,
        ]);
      case "faq":
        return page(gk, [
          head,
          faqAccordion(gk, tr, {
            eyebrow: "FAQ",
            title: tr("Sebelum datang", "Before you come"),
            text: tr("Pertanyaan lain? DM Instagram kami.", "Other questions? DM us on Instagram."),
            items: [
              [tr("Batas usia?", "Age limit?"), tr("Semua usia; di bawah 15 tahun wajib didampingi orang dewasa.", "All ages; under 15 must be with an adult.")],
              [tr("Boleh bawa makanan?", "Can I bring food?"), tr("Tidak, kecuali makanan bayi & obat-obatan.", "No, except baby food & medicine.")],
              [tr("Tiket bisa dipindahtangankan?", "Can I transfer my ticket?"), tr("Bisa, lewat fitur transfer di aplikasi resmi hingga H-3.", "Yes, via the official app's transfer feature until D-3.")],
            ],
            contact: { label: tr("Beli tiket", "Get tickets"), href: href("tickets") },
          }),
          contact(gk, {
            title: tr("Kerja sama & media", "Partnerships & press"),
            info: [["Email", "partner@gemakota.example"], [tr("Media", "Press"), "press@gemakota.example"]],
            fields: [
              { kind: "input", label: tr("Nama & instansi", "Name & organization"), ph: "Brand Contoh" },
              { kind: "select", label: tr("Keperluan", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Sponsor", "Sponsorship"), tr("Tenant kuliner", "Food vendor"), tr("Liputan media", "Media coverage")] },
              { kind: "input", label: "Email", ph: "nama@email.com", type: "email" },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(gk, [
          head,
          heroCover(gk, {
            badge: tr("28–29 November 2026 · GBK Senayan", "November 28–29, 2026 · GBK Senayan"),
            title: tr("Dua hari, tiga panggung, satu kota yang bernyanyi", "Two days, three stages, one city singing"),
            text: tr("Festival musik independen terbesar di Jakarta kembali dengan 32 penampil.", "Jakarta's biggest independent music festival returns with 32 acts."),
            actions: [[tr("Beli tiket", "Get tickets"), href("tickets")], [tr("Lihat lineup", "See lineup"), href("lineup"), "outline"]],
            gradient: ["#4c0519", "#0c0a09", 170],
            image: asset("v2a-fest-hero"),
            alt: tr("Panggung festival", "Festival stage"),
          }),
          countdownBand(gk, { eyebrow: tr("Presale 2 berakhir", "Presale 2 ends"), title: tr("Harga naik 1 November", "Prices rise November 1"), text: tr("Tiket 2 hari Rp790rb, setelahnya Rp950rb.", "2-day ticket Rp790k, then Rp950k."), target: "2026-10-31T23:59", finished: tr("Presale 2 berakhir.", "Presale 2 is over."), bg: GK.primary }),
          slider(gk, {
            eyebrow: "Headliner",
            title: tr("Yang paling ditunggu", "Most anticipated"),
            slides: [
              { title: "Nada Rimba", text: tr("Sabtu 21.00 · Panggung Gema", "Saturday 9pm · Gema Stage"), bg: "#be123c" },
              { title: "Kirana & The Lights", text: tr("Minggu 21.00 · Panggung Gema", "Sunday 9pm · Gema Stage"), bg: "#7c2d12" },
              { title: "DJ Arka", text: tr("Minggu 22.30 · Panggung Malam", "Sunday 10:30pm · Night Stage"), bg: "#1e1b4b" },
            ],
            bg: gk.alt,
          }),
          listings(gk, {
            title: tr("Tiket", "Tickets"),
            items: [
              { image: asset("v2a-fest-hero"), title: tr("Tiket 1 Hari", "1-Day Ticket"), text: tr("Sabtu atau Minggu", "Saturday or Sunday"), price: "Rp450.000", cta: tr("Detail", "Details"), href: href("tickets") },
              { image: asset("v2a-fest-stage2"), title: tr("Tiket 2 Hari", "2-Day Ticket"), text: tr("Hemat Rp110rb", "Save Rp110k"), price: "Rp790.000", compare: "Rp900.000", badge: tr("Terlaris", "Best seller"), cta: tr("Detail", "Details"), href: href("tickets") },
              { image: asset("v2a-fest-hero"), title: "VIP", text: tr("Deck depan & lounge", "Front deck & lounge"), price: "Rp1.900.000", cta: tr("Detail", "Details"), href: href("tickets") },
            ],
          }),
          logos(gk, { label: tr("Didukung oleh", "Supported by"), names: ["Kopi Senja", "Radio Kota", "BankKita", "TeleNusa", "Moda Rupa"], bg: "#0c0a09", light: true }),
          end,
        ]);
    }
  },
};

/* ------------------- 24. Sorak Digital Agency (8 hlm) ---------------- */

const SD: Palette = { ink: "#0f172a", muted: "#475569", primary: "#ea580c", primaryDark: "#c2410c", soft: "#fff7ed", line: "#fed7aa" };
const sd = look(SD, { bg: "#ffffff", alt: "#f8fafc", dark: "#0f172a", radius: 18, headFont: FONTS.grotesk, font: FONTS.grotesk });

export const agencyMarketing: TemplateContent = {
  brand: "Sorak Digital Agency",
  pages: [
    home(),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("work", ["karya", "Karya"], ["work", "Work"]),
    pg("case", ["studi-kasus-teh-lokal", "Studi Kasus"], ["teh-lokal-case-study", "Case Study"]),
    pg("pricing", ["retainer", "Retainer"], ["retainers", "Retainers"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const head = headerLeft("sorak!", sd, { cta: linkButton(tr("Ajak ngobrol", "Let's talk"), href("contact"), "primary", SD) });
    const end = footer(
      "Sorak Digital Agency",
      tr("Agensi performance & konten untuk brand lokal yang ingin tumbuh.", "A performance & content agency for local brands that want to grow."),
      [
        { title: tr("Layanan", "Services"), items: ["Paid ads", tr("Konten sosial", "Social content"), "SEO", tr("Influencer", "Influencers")] },
        { title: tr("Studio", "Studio"), items: ["Jl. Senopati 61, Jakarta", "hello@sorak.example", "+62 21 2900 7171"] },
      ],
      tr("© 2026 Sorak Digital Agency. Hasil contoh.", "© 2026 Sorak Digital Agency. Sample results."),
      "#0f172a",
    );
    switch (key) {
      case "services":
        return page(sd, [
          head,
          servicesSplit(sd, tr, {
            eyebrow: tr("Layanan", "Services"),
            title: tr("Strategi, konten, dan iklan dalam satu tim", "Strategy, content, and ads in one team"),
            text: tr("Satu tim kecil yang memegang brand Anda dari riset hingga laporan bulanan.", "One small team running your brand from research to monthly reports."),
            image: asset("v2a-mkt-hero"),
            items: [
              { icon: "Ads", title: "Performance ads", text: tr("Meta, TikTok, dan Google Ads dengan target ROAS.", "Meta, TikTok, and Google Ads with ROAS targets.") },
              { icon: "Cnt", title: tr("Konten sosial", "Social content"), text: tr("30 konten/bulan, termasuk video pendek.", "30 posts/month, including short videos.") },
              { icon: "SEO", title: "SEO", text: tr("Artikel dan perbaikan teknis situs.", "Articles and technical site fixes.") },
            ],
            cta: { label: tr("Lihat retainer", "See retainers"), href: href("pricing") },
          }),
          tabsBlock(sd, {
            title: tr("Cara kami bekerja", "How we work"),
            variant: "pills",
            tabs: [[tr("Minggu 1", "Week 1"), tr("Audit akun iklan, riset kompetitor, dan wawancara pelanggan.", "Ad account audit, competitor research, and customer interviews.")], [tr("Minggu 2–4", "Weeks 2–4"), tr("Uji 20+ variasi kreatif dan audiens.", "Test 20+ creative and audience variations.")], [tr("Bulan 2+", "Month 2+"), tr("Skalakan yang berhasil, laporan mingguan.", "Scale what works, weekly reports.")]],
            bg: sd.alt,
          }),
          end,
        ]);
      case "work":
        return page(sd, [
          head,
          pageBanner(sd, { eyebrow: tr("Karya", "Work"), title: tr("Angka yang kami banggakan", "Numbers we're proud of"), light: true }),
          posts(sd, {
            title: tr("Studi kasus", "Case studies"),
            readLabel: tr("Baca", "Read"),
            items: [
              { image: asset("v2a-mkt-case"), tag: "F&B", title: tr("Teh Lokal: ROAS 6,2× dalam 4 bulan", "Teh Lokal: 6.2× ROAS in 4 months"), text: tr("Dari 300 ke 4.000 pesanan per bulan.", "From 300 to 4,000 orders a month."), date: "2026", href: href("case") },
              { image: asset("v2a-mkt-hero"), tag: "Fashion", title: tr("Batik Ruma: TikTok Shop 0 ke Rp1,2 M", "Batik Ruma: TikTok Shop from 0 to Rp1.2B"), text: tr("Live shopping 4× seminggu.", "Live shopping 4× a week."), date: "2025", href: href("case") },
              { image: asset("v2a-mkt-case"), tag: tr("Pendidikan", "Education"), title: tr("KelasPintar: CPL turun 48%", "KelasPintar: CPL down 48%"), text: tr("Iklan video testimoni siswa.", "Student testimonial video ads."), date: "2025", href: href("case") },
            ],
          }),
          portfolioMosaic(sd, tr, {
            eyebrow: tr("Kreatif", "Creative"),
            title: tr("Potongan kampanye", "Campaign snippets"),
            works: [
              { title: "Teh Lokal — #SoreTanpaGula", tag: "TikTok", image: asset("v2a-mkt-case") },
              { title: "Batik Ruma — Live Jumat", tag: "TikTok Shop", image: asset("v2a-mkt-hero") },
              { title: "KelasPintar — Cerita Siswa", tag: "Meta Ads", image: asset("v2a-mkt-case") },
              { title: tr("Kopi Senja — Ulang Tahun", "Kopi Senja — Anniversary"), tag: "Instagram", image: asset("v2a-mkt-hero") },
              { title: "Sehatku — SEO", tag: "Google", image: asset("v2a-mkt-case") },
            ],
            cta: null,
            text: tr("Kreatif dibuat in-house oleh tim 6 orang.", "Creative made in-house by a team of 6."),
          }),
          end,
        ]);
      case "case":
        return page(sd, [
          head,
          ...article(sd, {
            crumbs: [[tr("Karya", "Work"), href("work")], ["Teh Lokal", ""]],
            tag: tr("Studi kasus · F&B", "Case study · F&B"),
            title: tr("Teh Lokal: dari 300 ke 4.000 pesanan per bulan", "Teh Lokal: from 300 to 4,000 orders a month"),
            meta: tr("Performance ads + konten · Feb–Jun 2026", "Performance ads + content · Feb–Jun 2026"),
            image: asset("v2a-mkt-case"),
            lead: tr("Teh Lokal punya produk bagus tapi iklan yang mahal. Kami mengubah cara mereka bercerita, bukan hanya menambah anggaran.", "Teh Lokal had a great product but expensive ads. We changed how they told their story, not just the budget."),
            blocks: [
              [tr("Insight", "Insight"), tr("Wawancara 20 pelanggan menunjukkan alasan utama membeli: teh tanpa gula yang tidak pahit.", "Interviews with 20 customers showed the main reason to buy: unsweetened tea that isn't bitter.")],
              [tr("Eksekusi", "Execution"), tr("Kampanye #SoreTanpaGula dengan 48 video pendek kreator mikro dan uji 6 sudut pesan.", "The #SoreTanpaGula campaign with 48 micro-creator videos testing 6 message angles.")],
              [tr("Hasil", "Results"), tr("ROAS 6,2×, biaya per pesanan turun 54%, dan 38% pembeli kembali dalam 60 hari.", "6.2× ROAS, cost per order down 54%, and 38% of buyers returned within 60 days.")],
            ],
            quote: tr("Mereka bertanya ke pelanggan kami sebelum membuat satu iklan pun.", "They talked to our customers before making a single ad."),
          }),
          counter(sd, { items: [tr("6,2× | ROAS", "6.2× | ROAS"), tr("-54% | Biaya per pesanan", "-54% | Cost per order"), tr("13× | Pesanan bulanan", "13× | Monthly orders"), tr("38% | Pembeli kembali", "38% | Repeat buyers")], dark: true }),
          end,
        ]);
      case "pricing":
        return page(sd, [
          head,
          priceSwitch(sd, {
            eyebrow: "Retainer",
            title: tr("Paket bulanan yang jelas", "Clear monthly retainers"),
            text: tr("Belum termasuk anggaran iklan. Minimum kontrak 3 bulan.", "Ad spend not included. 3-month minimum."),
            labels: [tr("Per bulan", "Monthly"), tr("Kontrak 12 bulan", "12-month contract"), tr("Hemat 10%", "Save 10%"), tr("/bulan", "/month"), tr("/bulan", "/month")],
            plans: [
              tr("Mulai | Rp12jt | Rp10,8jt | 1 platform iklan; 12 konten; Laporan bulanan | Pilih", "Start | Rp12m | Rp10.8m | 1 ad platform; 12 posts; Monthly report | Choose"),
              tr("Tumbuh | Rp25jt | Rp22,5jt | 3 platform iklan; 30 konten; Laporan mingguan | Pilih", "Grow | Rp25m | Rp22.5m | 3 ad platforms; 30 posts; Weekly report | Choose"),
              tr("Skala | Rp48jt | Rp43,2jt | Semua platform; Kreator & live shopping; Tim khusus | Hubungi", "Scale | Rp48m | Rp43.2m | All platforms; Creators & live shopping; Dedicated team | Contact"),
            ],
            href: href("contact"),
          }),
          faqList(sd, {
            title: tr("Soal kontrak", "About contracts"),
            items: [[tr("Ada biaya setup?", "Setup fee?"), tr("Tidak ada.", "None.")], [tr("Siapa pemilik akun iklan?", "Who owns the ad accounts?"), tr("Selalu Anda. Kami hanya diberi akses.", "Always you. We only get access.")], [tr("Bisa berhenti?", "Can we stop?"), tr("Setelah 3 bulan, cukup pemberitahuan 30 hari.", "After 3 months, with 30 days' notice.")]],
            bg: sd.alt,
          }),
          end,
        ]);
      case "about":
        return page(sd, [
          head,
          story(sd, { eyebrow: tr("Tentang", "About"), title: tr("14 orang, tanpa account executive perantara", "14 people, no middleman account executives"), paras: [tr("Anda bicara langsung dengan orang yang memasang iklan dan membuat konten. Sorak berdiri 2019 di Jakarta.", "You talk directly to the people running ads and making content. Sorak was founded in 2019 in Jakarta.")], image: asset("v2a-mkt-hero"), alt: "Sorak" }),
          teamCards(sd, tr, {
            title: tr("Tim inti", "Core team"),
            members: [
              { name: "Dimas Haryo", role: tr("Pendiri · strategi", "Founder · strategy"), photo: asset("v2a-face-2") },
              { name: "Kartika Sari", role: tr("Kepala kreatif", "Creative lead"), photo: asset("v2a-face-3") },
              { name: "Andre Wijaya", role: tr("Kepala performance", "Performance lead"), photo: asset("v2a-face-4") },
              { name: "Ayu Lestari", role: tr("Kepala konten", "Content lead"), photo: asset("v2a-face-5") },
            ],
          }),
          timeline(sd, { title: tr("Perjalanan", "Milestones"), steps: [["2019", tr("Berdiri", "Founded"), tr("3 orang, 2 klien.", "3 people, 2 clients.")], ["2022", tr("Tim kreatif in-house", "In-house creative"), tr("Studio video sendiri.", "Our own video studio.")], ["2026", tr("40 brand", "40 brands"), tr("Rp18 M belanja iklan dikelola.", "Rp18B ad spend managed.")]] }),
          end,
        ]);
      case "careers":
        return page(sd, [
          head,
          cards(sd, { eyebrow: tr("Karier", "Careers"), title: tr("Kenapa bekerja di Sorak", "Why work at Sorak"), cols: 4, items: [{ icon: "🏠", title: tr("Hybrid", "Hybrid"), text: tr("3 hari kantor, 2 hari remote.", "3 days office, 2 remote.") }, { icon: "📚", title: tr("Dana belajar", "Learning budget"), text: tr("Rp6 juta per tahun.", "Rp6M per year.") }, { icon: "🩺", title: tr("Asuransi", "Insurance"), text: tr("Rawat inap & jalan.", "Inpatient & outpatient.") }, { icon: "🌴", title: tr("Cuti 18 hari", "18 days off"), text: tr("Plus cuti ulang tahun.", "Plus your birthday.") }] }),
          jobs(sd, {
            title: tr("Posisi terbuka", "Open roles"),
            apply: tr("Lamar", "Apply"),
            href: href("contact"),
            items: [
              { title: "Performance Marketer", meta: tr("Jakarta · Hybrid", "Jakarta · Hybrid"), text: tr("Min. 2 tahun mengelola Meta & TikTok Ads dengan anggaran Rp100 jt+/bulan.", "2+ years running Meta & TikTok Ads with Rp100M+/month budgets.") },
              { title: "Video Editor", meta: tr("Jakarta · Penuh waktu", "Jakarta · Full-time"), text: tr("Mahir CapCut/Premiere, paham tren TikTok.", "Skilled in CapCut/Premiere, knows TikTok trends.") },
              { title: "Content Writer", meta: tr("Remote · Kontrak", "Remote · Contract"), text: tr("Menulis naskah iklan & artikel SEO.", "Writing ad scripts & SEO articles.") },
            ],
          }),
          end,
        ]);
      case "contact":
        return page(sd, [
          head,
          contact(sd, {
            eyebrow: tr("Ajak ngobrol", "Let's talk"),
            title: tr("Ceritakan target brand Anda", "Tell us your brand's goals"),
            text: tr("Kami balas dalam 1 hari kerja dengan audit singkat gratis.", "We reply within 1 business day with a free mini audit."),
            info: [["Email", "hello@sorak.example"], ["WhatsApp", "+62 812 2900 7171"], [tr("Studio", "Studio"), "Jl. Senopati 61, Jakarta"]],
            fields: [
              { kind: "input", label: tr("Nama & brand", "Name & brand"), ph: "Teh Lokal" },
              { kind: "input", label: "Website / Instagram", ph: "@brandanda" },
              { kind: "select", label: tr("Anggaran iklan per bulan", "Monthly ad budget"), ph: tr("Pilih", "Choose"), options: ["< Rp20 jt", "Rp20–100 jt", "Rp100–500 jt", "> Rp500 jt"] },
              { kind: "select", label: tr("Target utama", "Main goal"), ph: tr("Pilih", "Choose"), options: [tr("Penjualan online", "Online sales"), tr("Leads", "Leads"), tr("Awareness", "Awareness")] },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(sd, [
          head,
          heroSplit(sd, {
            title: tr("Bikin brand lokal disorakin", "Making local brands cheered"),
            titleNode: typer(sd, tr("Kami bikin brand lokal", "We make local brands"), [tr("laris", "sell out"), tr("viral", "go viral"), tr("diingat", "unforgettable")], { size: 54 }),
            text: tr("Agensi performance & konten untuk brand F&B, fashion, dan edukasi. Diukur dari penjualan, bukan likes.", "A performance & content agency for F&B, fashion, and education brands. Measured in sales, not likes."),
            actions: [[tr("Lihat karya", "See our work"), href("work"), "dark"], [tr("Ajak ngobrol", "Let's talk"), href("contact"), "outline"]],
            image: asset("v2a-mkt-hero"),
            alt: tr("Megafon", "Megaphone"),
            reverse: true,
          }),
          logos(sd, { label: tr("Brand yang tumbuh bersama kami", "Brands growing with us"), names: ["Teh Lokal", "Batik Ruma", "KelasPintar", "Sehatku", "Kopi Senja"], bg: sd.alt }),
          counter(sd, { items: [tr("40 | Brand aktif", "40 | Active brands"), tr("Rp18 M | Belanja iklan dikelola", "Rp18B | Ad spend managed"), tr("4,8× | ROAS rata-rata", "4.8× | Avg. ROAS"), tr("92% | Klien perpanjang", "92% | Client renewals")] }),
          portfolioMosaic(sd, tr, {
            eyebrow: tr("Karya", "Work"),
            title: tr("Kampanye terbaru", "Latest campaigns"),
            works: [
              { title: "Teh Lokal", tag: tr("ROAS 6,2×", "6.2× ROAS"), image: asset("v2a-mkt-case") },
              { title: "Batik Ruma", tag: "TikTok Shop Rp1,2 M", image: asset("v2a-mkt-hero") },
              { title: "KelasPintar", tag: tr("CPL -48%", "CPL -48%"), image: asset("v2a-mkt-case") },
              { title: "Sehatku", tag: tr("Trafik organik 3×", "3× organic traffic"), image: asset("v2a-mkt-hero") },
              { title: "Kopi Senja", tag: tr("20 jt tayangan", "20M views"), image: asset("v2a-mkt-case") },
            ],
            cta: { label: tr("Semua karya", "All work"), href: href("work") },
          }),
          testimonialsWall(sd, tr, {
            eyebrow: tr("Klien", "Clients"),
            title: tr("Kata mereka", "What they say"),
            score: 4.9,
            caption: tr("dari 40 klien aktif", "from 40 active clients"),
            quotes: [
              { text: tr("Pertama kali agensi menjelaskan angka dengan bahasa yang saya pahami.", "The first agency to explain numbers in words I understand."), name: "Laras Wibowo", role: tr("Pendiri Teh Lokal", "Founder, Teh Lokal"), avatar: asset("v2a-face-3") },
              { text: tr("Live shopping kami berjalan rapi setiap Jumat.", "Our live shopping runs smoothly every Friday."), name: "Yusuf Ramli", role: "Batik Ruma", avatar: asset("v2a-face-4") },
              { text: tr("CPL turun hampir setengah dalam dua bulan.", "CPL nearly halved in two months."), name: "Melinda K.", role: "KelasPintar", avatar: asset("v2a-face-5") },
            ],
          }),
          ctaBand(sd, tr, { title: tr("Audit iklan gratis dalam 48 jam", "A free ad audit in 48 hours"), primary: { label: tr("Minta audit", "Get an audit"), href: href("contact") }, secondary: { label: "Retainer", href: href("pricing") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 25. PT Logam Presisi Nusantara (10 hlm) --------- */

const LP: Palette = { ink: "#0c1f33", muted: "#475569", primary: "#0369a1", primaryDark: "#075985", soft: "#f0f9ff", line: "#bae6fd" };
const lp = look(LP, { bg: "#ffffff", alt: "#f1f5f9", dark: "#0c1f33", radius: 6, headFont: FONTS.grotesk, font: FONTS.sans });

export const companyManufaktur: TemplateContent = {
  brand: "PT Logam Presisi Nusantara",
  pages: [
    home(),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("products", ["produk", "Produk"], ["products", "Products"]),
    pg("spec", ["spesifikasi-flange", "Spesifikasi"], ["flange-specifications", "Specifications"]),
    pg("facilities", ["fasilitas", "Fasilitas"], ["facilities", "Facilities"]),
    pg("quality", ["mutu", "Mutu"], ["quality", "Quality"]),
    pg("industries", ["industri", "Industri"], ["industries", "Industries"]),
    pg("sustainability", ["keberlanjutan", "Keberlanjutan"], ["sustainability", "Sustainability"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("contact", ["kontak", "Kontak & RFQ"], ["contact", "Contact & RFQ"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(
      lp,
      [
        `${tr("Perusahaan", "Company")} | ${href("about")}`,
        `- ${tr("Tentang", "About")} | ${tr("Sejarah & manajemen", "History & management")} | ${href("about")}`,
        `- ${tr("Fasilitas", "Facilities")} | ${tr("Pabrik Cikarang 6 ha", "6-ha Cikarang plant")} | ${href("facilities")}`,
        `- ${tr("Keberlanjutan", "Sustainability")} | ${tr("Energi & CSR", "Energy & CSR")} | ${href("sustainability")}`,
        `${tr("Produk", "Products")} | ${href("products")}`,
        `- ${tr("Katalog", "Catalog")} | ${tr("Flange, fitting, komponen CNC", "Flanges, fittings, CNC parts")} | ${href("products")}`,
        `- ${tr("Spesifikasi", "Specifications")} | ${tr("Data teknis flange", "Flange technical data")} | ${href("spec")}`,
        `- ${tr("Mutu", "Quality")} | ISO 9001 · IATF 16949 | ${href("quality")}`,
        `${tr("Industri", "Industries")} | ${href("industries")}`,
        `${tr("Karier", "Careers")} | ${href("careers")}`,
      ],
      tr("Kirim RFQ", "Send RFQ"),
      href("contact"),
    );
    const head = headerBar("LOGAM PRESISI", lp, { info: ["ISO 9001 · IATF 16949 · ISO 14001", tr("Kawasan MM2100, Cikarang Barat", "MM2100 Industrial Estate, Cikarang"), "+62 21 8998 1200"], nav });
    const end = footer(
      "PT Logam Presisi Nusantara",
      tr("Manufaktur komponen logam presisi & flange industri sejak 1996.", "Precision metal components & industrial flange manufacturer since 1996."),
      [
        { title: tr("Produk", "Products"), items: [tr("Flange", "Flanges"), tr("Fitting pipa", "Pipe fittings"), tr("Komponen CNC", "CNC parts"), tr("Fabrikasi", "Fabrication")] },
        { title: tr("Kantor & pabrik", "Office & plant"), items: ["Jl. Sumatra Blok D-7, MM2100", "+62 21 8998 1200", "sales@logampresisi.example"] },
      ],
      tr("© 2026 PT Logam Presisi Nusantara. Data contoh.", "© 2026 PT Logam Presisi Nusantara. Sample data."),
      "#0c1f33",
    );
    switch (key) {
      case "about":
        return page(lp, [
          head,
          story(lp, { eyebrow: tr("Tentang", "About"), title: tr("Tiga dekade membentuk logam", "Three decades of shaping metal"), paras: [tr("Berawal dari bengkel bubut 8 mesin di Pulogadung, kini kami mengoperasikan pabrik 6 hektare dengan 140 mesin CNC dan 620 karyawan.", "From an 8-lathe workshop in Pulogadung, we now run a 6-hectare plant with 140 CNC machines and 620 employees."), tr("Produk kami dipakai di kilang, pembangkit listrik, dan pabrik otomotif di 14 negara.", "Our products are used in refineries, power plants, and auto factories in 14 countries.")], image: asset("v2a-mfg-hero"), alt: tr("Pabrik", "Factory") }),
          timeline(lp, { title: tr("Sejarah", "History"), steps: [["1996", tr("Bengkel bubut", "Lathe workshop"), tr("8 mesin, 12 karyawan.", "8 machines, 12 staff.")], ["2005", tr("Pindah ke MM2100", "Moved to MM2100"), tr("Pabrik pertama 2 ha.", "First 2-ha plant.")], ["2014", tr("Sertifikasi IATF", "IATF certified"), tr("Mulai memasok otomotif.", "Began supplying automotive.")], ["2025", tr("Ekspor ke 14 negara", "Exports to 14 countries"), tr("Termasuk Jepang & Australia.", "Including Japan & Australia.")]], bg: lp.alt }),
          teamCards(lp, tr, { title: tr("Manajemen", "Management"), members: [{ name: "Ir. Budi Santoso", role: tr("Presiden direktur", "President director"), photo: asset("v2a-face-6") }, { name: "Linda Kurniawan", role: tr("Direktur keuangan", "Finance director"), photo: asset("v2a-face-5") }, { name: "Agus Salim, MT", role: tr("Direktur operasi", "Operations director"), photo: asset("v2a-face-4") }, { name: "Yohana Tirta", role: tr("Direktur pemasaran", "Marketing director"), photo: asset("v2a-face-3") }] }),
          end,
        ]);
      case "products":
        return page(lp, [
          head,
          pageBanner(lp, { eyebrow: tr("Produk", "Products"), title: tr("Katalog produk", "Product catalog"), text: tr("Harga sesuai spesifikasi & volume; kirim RFQ untuk penawaran.", "Prices depend on specs & volume; send an RFQ for a quote."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Produk", "Products"), ""]] }),
          listings(lp, {
            title: tr("Lini produk", "Product lines"),
            items: [
              { image: asset("v2a-mfg-plant"), title: tr("Flange Weld Neck", "Weld Neck Flange"), text: "ASME B16.5 · 1/2\"–24\"", price: tr("Sesuai RFQ", "On RFQ"), badge: tr("Unggulan", "Flagship"), cta: tr("Spesifikasi", "Specifications"), href: href("spec") },
              { image: asset("v2a-mfg-hero"), title: tr("Flange Slip-On", "Slip-On Flange"), text: "JIS B2220 · 10K/20K", price: tr("Sesuai RFQ", "On RFQ"), cta: tr("Spesifikasi", "Specifications"), href: href("spec") },
              { image: asset("v2a-mfg-plant"), title: tr("Fitting Butt-Weld", "Butt-Weld Fittings"), text: tr("Elbow, tee, reducer", "Elbows, tees, reducers"), price: tr("Sesuai RFQ", "On RFQ"), cta: tr("Kirim RFQ", "Send RFQ"), href: href("contact") },
              { image: asset("v2a-mfg-hero"), title: tr("Komponen CNC", "CNC Components"), text: tr("Toleransi hingga ±0,01 mm", "Tolerances to ±0.01 mm"), price: tr("Sesuai RFQ", "On RFQ"), cta: tr("Kirim RFQ", "Send RFQ"), href: href("contact") },
              { image: asset("v2a-mfg-plant"), title: tr("Fabrikasi spool", "Spool Fabrication"), text: tr("Pengelasan bersertifikat ASME IX", "ASME IX certified welding"), price: tr("Sesuai RFQ", "On RFQ"), cta: tr("Kirim RFQ", "Send RFQ"), href: href("contact") },
              { image: asset("v2a-mfg-hero"), title: tr("Komponen otomotif", "Automotive Parts"), text: tr("Bracket, shaft, housing", "Brackets, shafts, housings"), price: tr("Sesuai RFQ", "On RFQ"), cta: tr("Kirim RFQ", "Send RFQ"), href: href("contact") },
            ],
          }),
          tabsBlock(lp, { title: tr("Material", "Materials"), tabs: [[tr("Baja karbon", "Carbon steel"), "ASTM A105, A350 LF2"], [tr("Baja tahan karat", "Stainless steel"), "ASTM A182 F304/F316L"], [tr("Paduan", "Alloys"), "F11, F22, Duplex F51"]], bg: lp.alt }),
          end,
        ]);
      case "spec":
        return page(lp, [
          head,
          pageBanner(lp, { crumbs: [[tr("Produk", "Products"), href("products")], [tr("Flange Weld Neck", "Weld Neck Flange"), ""]], title: tr("Flange Weld Neck ASME B16.5", "ASME B16.5 Weld Neck Flange"), text: tr("Ditempa (forged), dimesin CNC, dan diuji 100% secara visual & dimensi.", "Forged, CNC machined, and 100% visually & dimensionally inspected.") }),
          tableBlock(lp, {
            title: tr("Dimensi kelas 150", "Class 150 dimensions"),
            columns: [tr("Ukuran", "Size"), "OD (mm)", tr("Tebal (mm)", "Thickness (mm)"), tr("Jumlah baut", "Bolts"), tr("Berat (kg)", "Weight (kg)")],
            rows: [["2\"", "152", "19,1", "4", "2,7"], ["4\"", "229", "23,9", "8", "6,8"], ["6\"", "279", "25,4", "8", "10,4"], ["8\"", "343", "28,4", "8", "17,2"], ["12\"", "483", "31,8", "12", "36,3"]],
            note: tr("Toleransi sesuai ASME B16.5. Sertifikat material EN 10204 3.1 disertakan.", "Tolerances per ASME B16.5. EN 10204 3.1 mill certificates included."),
          }),
          compare(lp, { title: tr("Pilihan face", "Face options"), columns: ["RF", "FF", "RTJ"], rows: [tr("Kelas 150–600 | ya | ya | ya", "Class 150–600 | yes | yes | yes"), tr("Kelas 900–2500 | ya | tidak | ya", "Class 900–2500 | yes | no | yes"), tr("Gasket spiral wound | ya | tidak | tidak", "Spiral wound gasket | yes | no | no"), tr("Tekanan tinggi | sedang | rendah | tinggi", "High pressure | medium | low | high")], highlight: 1, caption: "Raised Face · Flat Face · Ring Type Joint", bg: lp.alt }),
          gallery(lp, { title: tr("Proses", "Process"), images: [[asset("v2a-mfg-plant"), tr("Penempaan", "Forging")], [asset("v2a-mfg-hero"), tr("Pemesinan CNC", "CNC machining")], [asset("v2a-mfg-plant"), tr("Inspeksi CMM", "CMM inspection")]] }),
          end,
        ]);
      case "facilities":
        return page(lp, [
          head,
          figures(lp, { items: [["6 ha", tr("Luas pabrik", "Plant area")], ["140", tr("Mesin CNC", "CNC machines")], ["2.400 t", tr("Kapasitas tempa/bulan", "Forging capacity/month")], ["24/7", tr("Operasi 3 shift", "3-shift operation")]], bg: "#0c1f33", light: true }),
          progressBars(lp, { eyebrow: tr("Utilisasi Q3 2026", "Q3 2026 utilization"), title: tr("Kapasitas terpakai per lini", "Capacity in use by line"), bars: [[tr("Penempaan", "Forging"), 82], [tr("Pemesinan CNC", "CNC machining"), 91], [tr("Fabrikasi & las", "Fabrication & welding"), 64], [tr("Galvanis & coating", "Galvanizing & coating"), 58]], side: { image: asset("v2a-mfg-plant"), alt: tr("Lini produksi", "Production line") } }),
          gallery(lp, { title: tr("Di dalam pabrik", "Inside the plant"), cols: 4, images: [[asset("v2a-mfg-hero"), tr("Hall tempa", "Forging hall")], [asset("v2a-mfg-plant"), tr("Hall CNC", "CNC hall")], [asset("v2a-mfg-hero"), tr("Lab uji", "Test lab")], [asset("v2a-mfg-plant"), tr("Gudang ekspor", "Export warehouse")]], bg: lp.alt }),
          end,
        ]);
      case "quality":
        return page(lp, [
          head,
          tableBlock(lp, { eyebrow: tr("Mutu", "Quality"), title: tr("Sertifikasi", "Certifications"), columns: [tr("Standar", "Standard"), tr("Lingkup", "Scope"), tr("Lembaga", "Body"), tr("Berlaku", "Valid until")], rows: [["ISO 9001:2015", tr("Manajemen mutu", "Quality management"), "KAN-accredited", "2028"], ["IATF 16949", tr("Otomotif", "Automotive"), "KAN-accredited", "2027"], ["ISO 14001:2015", tr("Lingkungan", "Environment"), "KAN-accredited", "2028"], ["API 6A", tr("Komponen migas", "Oil & gas parts"), "KAN-accredited", "2027"]] }),
          process(lp, { title: tr("Kontrol mutu", "Quality control"), steps: [[tr("Material masuk", "Incoming material"), tr("Uji spektrometer.", "Spectrometer test.")], [tr("Dalam proses", "In process"), tr("SPC per batch.", "SPC per batch.")], [tr("Akhir", "Final"), tr("CMM & uji tekanan.", "CMM & pressure test.")], [tr("Dokumen", "Documents"), tr("MTC 3.1 & laporan.", "3.1 MTC & reports.")]] }),
          bigQuote(lp, { text: tr("Satu cacat yang lolos lebih mahal dari seratus yang tertangkap.", "One defect that slips through costs more than a hundred caught."), name: "Agus Salim, MT", role: tr("Direktur operasi", "Operations director") }),
          end,
        ]);
      case "industries":
        return page(lp, [
          head,
          cards(lp, { eyebrow: tr("Industri", "Industries"), title: tr("Industri yang kami layani", "Industries we serve"), variant: "num", items: [{ title: tr("Minyak & gas", "Oil & gas"), text: tr("Flange & fitting untuk kilang dan pipa transmisi.", "Flanges & fittings for refineries and pipelines.") }, { title: tr("Pembangkit listrik", "Power generation"), text: tr("Komponen boiler & turbin.", "Boiler & turbine components.") }, { title: tr("Otomotif", "Automotive"), text: tr("Komponen presisi untuk OEM tier 1.", "Precision parts for tier-1 OEMs.") }, { title: tr("Petrokimia", "Petrochemicals"), text: tr("Material paduan tahan korosi.", "Corrosion-resistant alloys.") }, { title: tr("Air & limbah", "Water & wastewater"), text: tr("Fitting stainless untuk IPAL.", "Stainless fittings for treatment plants.") }, { title: tr("Galangan kapal", "Shipbuilding"), text: tr("Flange bersertifikat BKI.", "Class-certified flanges.") }] }),
          quotes(lp, { title: tr("Kata pelanggan", "Customer voices"), items: [{ quote: tr("Pengiriman tepat waktu selama 6 tahun berturut-turut.", "On-time delivery six years running."), author: "Hiroshi Tanaka", role: tr("Procurement, OEM otomotif", "Procurement, auto OEM"), avatar: asset("v2a-face-6") }, { quote: tr("Dokumen MTC selalu lengkap, audit kami lancar.", "MTC documents always complete; our audits run smoothly."), author: "Ratna Siregar", role: tr("QA, kontraktor EPC", "QA, EPC contractor"), avatar: asset("v2a-face-5") }], cols: 2 }),
          end,
        ]);
      case "sustainability":
        return page(lp, [
          head,
          counter(lp, { eyebrow: tr("Keberlanjutan", "Sustainability"), title: tr("Target 2030", "2030 targets"), items: [tr("4,2 MWp | PLTS atap terpasang", "4.2 MWp | Rooftop solar installed"), tr("-31% | Emisi per ton produk", "-31% | Emissions per tonne"), tr("96% | Skrap didaur ulang", "96% | Scrap recycled"), tr("12.000 | Jam pelatihan warga", "12,000 | Community training hours")] }),
          story(lp, { eyebrow: "CSR", title: tr("Sekolah vokasi untuk warga sekitar", "Vocational school for neighbors"), paras: [tr("Kelas CNC & pengelasan gratis untuk lulusan SMK sekitar Cikarang; 70% alumni bekerja di kawasan industri.", "Free CNC & welding classes for vocational graduates around Cikarang; 70% of alumni work in the industrial estate.")], image: asset("v2a-mfg-plant"), alt: tr("Pelatihan", "Training"), reverse: true, bg: lp.alt }),
          posts(lp, { title: tr("Laporan & berita", "Reports & news"), readLabel: tr("Baca", "Read"), items: [{ image: asset("v2a-mfg-hero"), tag: tr("Energi", "Energy"), title: tr("PLTS atap 4,2 MWp beroperasi penuh", "4.2 MWp rooftop solar fully online"), text: tr("Memasok 28% kebutuhan listrik pabrik.", "Supplying 28% of plant electricity."), date: "Agu 2026", href: href("sustainability") }, { image: asset("v2a-mfg-plant"), tag: "CSR", title: tr("Angkatan ke-9 sekolah vokasi lulus", "9th vocational cohort graduates"), text: tr("64 peserta, 45 langsung bekerja.", "64 participants, 45 hired right away."), date: "Jul 2026", href: href("careers") }], cols: 2 }),
          end,
        ]);
      case "careers":
        return page(lp, [
          head,
          jobs(lp, { eyebrow: tr("Karier", "Careers"), title: tr("Bergabung dengan 620 rekan kerja", "Join 620 colleagues"), apply: tr("Lamar", "Apply"), href: href("contact"), items: [{ title: "CNC Programmer", meta: tr("Cikarang · Tetap", "Cikarang · Permanent"), text: tr("Mastercam/Fusion 360, min. 3 tahun.", "Mastercam/Fusion 360, 3+ years.") }, { title: "QC Inspector (CMM)", meta: tr("Cikarang · Tetap", "Cikarang · Permanent"), text: tr("Paham GD&T dan ISO 9001.", "Knows GD&T and ISO 9001.") }, { title: "Export Sales Executive", meta: tr("Jakarta · Tetap", "Jakarta · Permanent"), text: tr("Bahasa Inggris aktif, pengalaman B2B industri.", "Fluent English, industrial B2B experience.") }] }),
          cards(lp, { title: tr("Benefit", "Benefits"), variant: "line", cols: 4, items: [{ title: tr("Bus karyawan", "Staff shuttle"), text: tr("Dari Bekasi & Jakarta Timur.", "From Bekasi & East Jakarta.") }, { title: tr("Kantin bersubsidi", "Subsidized canteen"), text: tr("Makan siang Rp5.000.", "Rp5,000 lunches.") }, { title: tr("Sertifikasi", "Certification"), text: tr("Biaya sertifikasi ditanggung.", "Certification fees covered.") }, { title: tr("Asuransi keluarga", "Family insurance"), text: tr("Pasangan & 3 anak.", "Spouse & 3 kids.") }], bg: lp.alt }),
          end,
        ]);
      case "contact":
        return page(lp, [
          head,
          contact(lp, {
            eyebrow: "RFQ",
            title: tr("Minta penawaran harga", "Request a quotation"),
            text: tr("Lampirkan gambar teknik (PDF/STEP) lewat email setelah mengirim formulir. Penawaran dalam 3 hari kerja.", "Email technical drawings (PDF/STEP) after submitting the form. Quotes within 3 business days."),
            info: [[tr("Penjualan domestik", "Domestic sales"), "sales@logampresisi.example"], [tr("Ekspor", "Export"), "export@logampresisi.example"], [tr("Pabrik", "Plant"), "Jl. Sumatra Blok D-7, MM2100, Cikarang Barat"]],
            fields: [
              { kind: "input", label: tr("Perusahaan", "Company"), ph: "PT Contoh Energi" },
              { kind: "select", label: tr("Produk", "Product"), ph: tr("Pilih produk", "Choose a product"), options: [tr("Flange", "Flanges"), tr("Fitting", "Fittings"), tr("Komponen CNC", "CNC components"), tr("Fabrikasi", "Fabrication")] },
              { kind: "input", label: tr("Jumlah (pcs)", "Quantity (pcs)"), ph: "500", type: "number" },
              { kind: "date", label: tr("Tanggal kebutuhan", "Required date") },
              { kind: "check", label: tr("Butuh sertifikat material 3.1", "Need 3.1 material certificates") },
            ],
            submit: tr("Kirim RFQ", "Send RFQ"),
          }),
          end,
        ]);
      default:
        return page(lp, [
          head,
          heroSplit(lp, {
            badge: "ISO 9001 · IATF 16949 · API 6A",
            title: tr("Komponen logam presisi untuk industri yang tidak boleh berhenti", "Precision metal parts for industries that can't stop"),
            text: tr("Flange, fitting, dan komponen CNC dari pabrik 6 hektare di Cikarang, dikirim ke 14 negara dengan dokumen mutu lengkap.", "Flanges, fittings, and CNC parts from a 6-hectare plant in Cikarang, shipped to 14 countries with full quality documents."),
            actions: [[tr("Kirim RFQ", "Send RFQ"), href("contact")], [tr("Katalog produk", "Product catalog"), href("products"), "light"]],
            image: asset("v2a-mfg-hero"),
            alt: tr("Pabrik", "Factory"),
            bg: "#0c1f33",
            light: true,
          }),
          counter(lp, { items: [tr("30 | Tahun beroperasi", "30 | Years in operation"), tr("140 | Mesin CNC", "140 | CNC machines"), tr("14 | Negara tujuan ekspor", "14 | Export countries"), tr("99,2% | Pengiriman tepat waktu", "99.2% | On-time delivery")] }),
          cards(lp, { eyebrow: tr("Produk", "Products"), title: tr("Lini produk utama", "Main product lines"), items: [{ icon: "◎", title: tr("Flange", "Flanges"), text: "ASME B16.5 · JIS · DIN" }, { icon: "⤷", title: tr("Fitting", "Fittings"), text: tr("Butt-weld & forged.", "Butt-weld & forged.") }, { icon: "⚙", title: tr("Komponen CNC", "CNC parts"), text: tr("Toleransi ±0,01 mm.", "±0.01 mm tolerance.") }], bg: lp.alt }),
          servicesSplit(lp, tr, { eyebrow: tr("Kapabilitas", "Capabilities"), title: tr("Dari bahan baku hingga kontainer ekspor", "From raw bar to export container"), image: asset("v2a-mfg-plant"), items: [{ icon: "01", title: tr("Penempaan", "Forging"), text: tr("Press 2.000 ton.", "2,000-tonne press.") }, { icon: "02", title: tr("Pemesinan", "Machining"), text: tr("CNC 5-axis.", "5-axis CNC.") }, { icon: "03", title: tr("Inspeksi", "Inspection"), text: tr("CMM & uji hidrostatik.", "CMM & hydrostatic testing.") }], cta: { label: tr("Lihat fasilitas", "See facilities"), href: href("facilities") } }),
          logos(lp, { label: tr("Dipercaya oleh", "Trusted by"), names: ["PetroNusa", "Energi Raya", "Satria Motor", "Krakatau Fab", "Rekayasa EPC"] }),
          ctaBox(lp, { title: tr("Punya gambar teknik? Kirim RFQ hari ini", "Have drawings? Send an RFQ today"), text: tr("Penawaran dalam 3 hari kerja.", "Quotes within 3 business days."), actions: [[tr("Kirim RFQ", "Send RFQ"), href("contact"), "light"]] }),
          end,
        ]);
    }
  },
};
