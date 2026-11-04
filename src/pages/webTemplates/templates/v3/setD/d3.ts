import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { portfolioMosaic, pricingCards, statsBand } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import {
  articleBody,
  backTop,
  beforeAfterD,
  bento,
  cardsD,
  catalog,
  compareD,
  counterD,
  countdownD,
  ctaD,
  editorial,
  faqD,
  footerD,
  formD,
  headerD,
  heroEditorial,
  heroNeon,
  heroSearch,
  heroSplitScreen,
  heroType,
  home,
  indexList,
  locations,
  lookD,
  magazine,
  mosaic,
  newsletter,
  numbers,
  offer,
  pageHead,
  peopleD,
  pg,
  plansD,
  priceSwitchD,
  pro,
  progressD,
  pullQuote,
  render,
  sliderD,
  specs,
  splitPanel,
  tableD,
  tabsD,
  timelineD,
  typerD,
  withFx,
  wordBand,
  zigzag,
} from "./kitD";

/* ================================================================== */
/* v3 templates D11–D15: Job portal, Bookstore, Publisher,               */
/* Panel surya, Pengisian mobil listrik.                                 */
/* ================================================================== */

/* -------------- 11. Kerjaloka — portal lowongan (7 hlm) ---------------- */
// Premium: pricing-switch, typewriter, modal-popup, back-to-top. Library: AOS + Animate. Brutalis.

const JP: Palette = { ink: "#111827", muted: "#4b5563", primary: "#4338ca", primaryDark: "#3730a3", soft: "#e0e7ff", line: "#c7d2fe" };
const J = lookD(JP, { head: "Space Grotesk", body: "Plus Jakarta Sans", shape: "brutal", radius: 10, bg: "#fafaf9", alt: "#fef08a", inv: "#111827", fx: { aos: "slide-up", animate: "fadeInLeft" } });

const jFoot = (tr: Tr) =>
  footerD("Kerjaloka", J, {
    variant: "columns",
    about: tr("Portal lowongan kerja dengan gaji transparan di setiap iklan.", "A job board with transparent salaries on every listing."),
    cols: [
      { title: tr("Pencari kerja", "Job seekers"), items: [tr("Cari lowongan", "Search jobs"), tr("Info gaji", "Salary guide"), tr("Tips karier", "Career tips")] },
      { title: tr("Perusahaan", "Employers"), items: [tr("Pasang lowongan", "Post a job"), tr("Paket", "Plans"), tr("Bantuan", "Help")] },
    ],
    social: ["LinkedIn | https://linkedin.com/company/kerjaloka", "Instagram | https://instagram.com/kerjaloka", "TikTok | https://tiktok.com/@kerjaloka"],
    copy: tr("© 2026 Kerjaloka. Konten contoh.", "© 2026 Kerjaloka. Sample content."),
    extra: [backTop(J, tr("Ke atas", "To top"))],
  });

export const recruitmentJobBoard: TemplateContent = {
  brand: "Kerjaloka",
  pages: [
    home(),
    pg("jobs", ["cari-lowongan", "Cari Lowongan"], ["search-jobs", "Search Jobs"]),
    pg("companies", ["perusahaan", "Perusahaan"], ["companies", "Companies"]),
    pg("salary", ["info-gaji", "Info Gaji"], ["salary-guide", "Salary Guide"]),
    pg("post", ["pasang-lowongan", "Pasang Lowongan"], ["post-a-job", "Post a Job"]),
    pg("tips", ["tips-karier", "Tips Karier"], ["career-tips", "Career Tips"]),
    pg("help", ["bantuan", "Bantuan"], ["help", "Help"]),
  ],
  build: (key, tr, href) =>
    render(J, key, headerD("Kerjaloka", J, { variant: "bar", cta: [tr("Pasang lowongan", "Post a job"), href("post")] }), jFoot(tr), {
      home: () => [
        heroSearch(J, {
          eyebrow: tr("12.480 lowongan aktif", "12,480 active jobs"),
          title: "",
          titleNode: typerD(J, tr("Kerja baru sebagai", "A new job as"), ["barista", "data analyst", tr("perawat", "nurse"), tr("desainer", "designer"), tr("teknisi", "technician")], { size: 58, align: "center" }),
          text: tr("Setiap lowongan mencantumkan rentang gaji. Tidak ada lagi tebak-tebakan di wawancara terakhir.", "Every listing shows a salary range. No more guessing at the final interview."),
          fields: [{ kind: "input", label: tr("Posisi", "Role"), ph: tr("mis. akuntan", "e.g. accountant") }, { kind: "select", label: tr("Kota", "City"), ph: tr("Semua kota", "All cities"), options: ["Jakarta", "Bandung", "Surabaya", "Medan", "Makassar", tr("Remote", "Remote")] }],
          submit: tr("Cari", "Search"),
          tags: [tr("Remote", "Remote"), tr("Fresh graduate", "Fresh graduate"), tr("Paruh waktu", "Part time"), tr("Gaji > Rp10 jt", "Salary > Rp10M")],
        }),
        indexList(J, { eyebrow: tr("Terbaru", "Latest"), title: tr("Lowongan yang baru tayang", "Just posted"), rows: [{ title: "Data Analyst", meta: tr("Rp9–13 jt · Jakarta", "Rp9–13M · Jakarta"), tag: tr("Hibrida", "Hybrid"), text: "Arunika Logistik", href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: tr("Perawat ICU", "ICU Nurse"), meta: tr("Rp7–9 jt · Surabaya", "Rp7–9M · Surabaya"), tag: tr("Shift", "Shifts"), text: "RS Medika Sentosa", href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: tr("Desainer Grafis", "Graphic Designer"), meta: tr("Rp6–8 jt · Remote", "Rp6–8M · Remote"), tag: "Remote", text: "Studio Rupa Kota", href: href("jobs"), cta: tr("Lamar", "Apply") }] }),
        bento(J, { title: tr("Kenapa Kerjaloka", "Why Kerjaloka"), items: [{ title: tr("Gaji wajib tampil", "Salaries always shown"), text: tr("Iklan tanpa rentang gaji tidak kami tayangkan.", "Listings without a salary range don't go live."), icon: "Rp", wide: true, accent: true }, { title: tr("Status lamaran", "Application status"), text: tr("Tahu kapan CV dibaca.", "Know when your CV is read."), icon: "◉" }, { title: tr("Perusahaan terverifikasi", "Verified companies"), text: tr("Cek NIB dan alamat kantor.", "Business IDs and offices checked."), icon: "✓" }, { title: tr("Ulasan karyawan", "Employee reviews"), text: tr("Anonim dan dimoderasi.", "Anonymous and moderated."), icon: "★", wide: true }] }),
        wordBand(J, [tr("Gaji transparan", "Transparent pay"), tr("Tanpa calo", "No middlemen"), tr("Gratis untuk pelamar", "Free for applicants"), tr("Lamar sekali klik", "One-click apply")], { bg: "#4338ca" }),
      ],
      jobs: () => [
        pageHead(J, { eyebrow: tr("Cari lowongan", "Search jobs"), title: tr("Temukan yang pas", "Find the right fit"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Lowongan", "Jobs"), ""]] }),
        indexList(J, { title: tr("Hasil: 248 lowongan", "Results: 248 jobs"), rows: [{ title: "Backend Engineer (Go)", meta: tr("Rp18–26 jt · Jakarta", "Rp18–26M · Jakarta"), tag: tr("Hibrida", "Hybrid"), href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: tr("Staf Gudang", "Warehouse Staff"), meta: tr("Rp4,8–5,5 jt · Bekasi", "Rp4.8–5.5M · Bekasi"), tag: tr("Penuh waktu", "Full time"), href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: tr("Guru Bahasa Inggris", "English Teacher"), meta: tr("Rp6–7 jt · Bandung", "Rp6–7M · Bandung"), tag: tr("Kontrak", "Contract"), href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: "Content Writer", meta: tr("Rp5–7 jt · Remote", "Rp5–7M · Remote"), tag: "Remote", href: href("jobs"), cta: tr("Lamar", "Apply") }, { title: tr("Kepala Toko", "Store Manager"), meta: tr("Rp8–10 jt · Medan", "Rp8–10M · Medan"), tag: tr("Penuh waktu", "Full time"), href: href("jobs"), cta: tr("Lamar", "Apply") }] }),
        newsletter(J, { title: tr("Simpan pencarian ini", "Save this search"), text: tr("Dapat email saat ada lowongan serupa.", "Get an email when similar jobs appear."), ph: "email@contoh.com", submit: tr("Simpan", "Save") }),
      ],
      companies: () => [
        pageHead(J, { eyebrow: tr("Perusahaan", "Companies"), title: tr("Kenali calon kantor Anda", "Get to know your next workplace") }),
        cardsD(J, { title: tr("Paling banyak diulas", "Most reviewed"), cols: 4, items: [{ icon: "A", title: "Arunika Logistik", text: tr("Logistik · 2.400 karyawan", "Logistics · 2,400 staff"), meta: "★ 4,3" }, { icon: "M", title: "Medika Sentosa", text: tr("Kesehatan · 1.100 karyawan", "Healthcare · 1,100 staff"), meta: "★ 4,1" }, { icon: "R", title: "Studio Rupa Kota", text: tr("Kreatif · 60 karyawan", "Creative · 60 staff"), meta: "★ 4,6" }, { icon: "T", title: "Teh Lereng", text: tr("F&B · 800 karyawan", "F&B · 800 staff"), meta: "★ 4,0" }] }),
        pullQuote(J, { text: tr("Ulasan anonim membantu saya menolak tawaran yang terlihat bagus di atas kertas.", "Anonymous reviews helped me turn down an offer that looked good on paper."), name: "Fikri A.", role: tr("Pengguna Kerjaloka", "Kerjaloka user") }),
      ],
      salary: () => [
        pageHead(J, { eyebrow: tr("Info gaji", "Salary guide"), title: tr("Gaji median 2026", "2026 median salaries"), text: tr("Dihitung dari 84.000 lowongan bergaji transparan. Angka contoh.", "Calculated from 84,000 listings with transparent pay. Sample figures.") }),
        tableD(J, { title: tr("Per posisi", "By role"), columns: [tr("Posisi", "Role"), "Jakarta", "Bandung", "Surabaya"], rows: [["Data Analyst", "Rp11 jt", "Rp8,5 jt", "Rp9 jt"], [tr("Perawat", "Nurse"), "Rp7,5 jt", "Rp6 jt", "Rp6,8 jt"], [tr("Desainer Grafis", "Graphic Designer"), "Rp7 jt", "Rp5,5 jt", "Rp6 jt"], ["Software Engineer", "Rp17 jt", "Rp13 jt", "Rp14 jt"]] }),
        tabsD(J, { title: tr("Tips negosiasi", "Negotiation tips"), tabs: [[tr("Sebelum", "Before"), tr("Cek median posisi dan kota di halaman ini.", "Check the median for your role and city on this page.")], [tr("Saat wawancara", "In the interview"), tr("Sebut rentang, bukan satu angka.", "Give a range, not a single number.")], [tr("Setelah tawaran", "After the offer"), tr("Tanyakan total paket: tunjangan, BPJS, bonus.", "Ask about the full package: allowances, insurance, bonus.")]] }),
      ],
      post: () => [
        pageHead(J, { eyebrow: tr("Untuk perusahaan", "For employers"), title: tr("Pasang lowongan, terima pelamar hari ini", "Post a job, get applicants today") }),
        priceSwitchD(J, { title: tr("Paket iklan", "Listing plans"), plans: [tr("Dasar | Rp0 | Rp0 | 1 lowongan aktif; Tayang 14 hari | Mulai gratis", "Basic | Rp0 | Rp0 | 1 active job; 14 days live | Start free"), tr("Tumbuh | Rp490rb | Rp4,9jt | 5 lowongan aktif; Sorotan 7 hari; Filter pelamar | Pilih Tumbuh", "Growth | Rp490k | Rp4.9M | 5 active jobs; 7-day highlight; Applicant filters | Choose Growth"), tr("Skala | Rp1,49jt | Rp14,9jt | Lowongan tanpa batas; Halaman perusahaan; Akun tim | Hubungi kami", "Scale | Rp1.49M | Rp14.9M | Unlimited jobs; Company page; Team accounts | Contact us")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("help") }),
        offer(J, { title: tr("Rekrut 10+ orang sekaligus?", "Hiring 10+ people at once?"), text: tr("Kami punya paket khusus untuk pembukaan cabang dan rekrutmen musiman.", "We have special plans for new branches and seasonal hiring."), trigger: tr("Lihat paket massal", "See bulk plans"), modalTitle: tr("Paket rekrutmen massal", "Bulk hiring plan"), body: tr("Mulai Rp4,5 jt untuk 20 lowongan selama 60 hari, termasuk tes daring dan jadwal wawancara otomatis.", "From Rp4.5M for 20 jobs over 60 days, including online tests and automated interview scheduling."), cta: tr("Hubungi sales", "Contact sales"), href: href("help") }),
      ],
      tips: () => [
        pageHead(J, { eyebrow: tr("Tips karier", "Career tips"), title: tr("Bacaan singkat sebelum melamar", "Short reads before you apply") }),
        magazine(J, { title: tr("Artikel pilihan", "Featured articles"), read: tr("Baca", "Read"), lead: { image: asset("v3d-briefcase-indigo"), tag: "CV", date: "9 Okt 2026", title: tr("CV satu halaman yang dibaca rekruter", "The one-page CV recruiters actually read"), text: tr("Struktur, kata kerja, dan angka yang membuat CV Anda lolos 6 detik pertama.", "Structure, verbs and numbers that get your CV past the first 6 seconds."), href: href("tips") }, items: [{ image: asset("v3d-dashboard"), tag: tr("Wawancara", "Interview"), date: "2 Okt", title: tr("Menjawab 'kelemahan Anda?'", "Answering 'your weakness?'"), text: "", href: href("tips") }, { image: asset("v3d-coins"), tag: tr("Gaji", "Salary"), date: "25 Sep", title: tr("Kapan boleh minta naik gaji", "When to ask for a raise"), text: "", href: href("salary") }] }),
        articleBody(J, { lead: tr("Rekruter rata-rata membaca CV selama enam detik. Isi enam detik itu dengan angka.", "Recruiters read a CV for six seconds on average. Fill those seconds with numbers."), blocks: [[tr("Mulai dengan hasil", "Lead with results"), tr("Tulis 'menaikkan penjualan 18%' alih-alih 'bertanggung jawab atas penjualan'.", "Write 'grew sales 18%' rather than 'responsible for sales'.")], [tr("Satu halaman cukup", "One page is enough"), tr("Untuk pengalaman di bawah 10 tahun, satu halaman lebih mudah dibaca.", "With under 10 years' experience, one page is easier to read.")]] }),
      ],
      help: () => [
        pageHead(J, { eyebrow: tr("Bantuan", "Help"), title: tr("Ada yang bisa kami bantu?", "How can we help?") }),
        faqD(J, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Melamar dipungut biaya?", "Do applicants pay?"), tr("Tidak pernah. Laporkan iklan yang meminta uang.", "Never. Report any listing asking for money.")], [tr("Bagaimana verifikasi perusahaan?", "How are companies verified?"), tr("Cek dokumen usaha dan panggilan video.", "Business documents and a video call.")], [tr("Menghapus akun?", "Delete my account?"), tr("Lewat Pengaturan → Privasi.", "Via Settings → Privacy.")], [tr("Faktur perusahaan?", "Company invoices?"), tr("Tersedia otomatis di dasbor.", "Available automatically in the dashboard.")]] }),
        formD(J, { title: tr("Hubungi tim", "Contact the team"), info: [["Email", "bantuan@kerjaloka.id"], [tr("Jam", "Hours"), tr("Sen–Jum 09.00–18.00", "Mon–Fri 9am–6pm")]], fields: [{ kind: "input", label: "Email", ph: "", type: "email" }, { kind: "select", label: tr("Saya adalah", "I am a"), ph: tr("Pilih", "Choose"), options: [tr("Pencari kerja", "Job seeker"), tr("Perusahaan", "Employer")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* ---------------- 12. Pustaka Teduh — bookstore (6 pages) ---------------- */
// Premium: slider, pro-stats-band. Library: AOS. Editorial hangat.

const BP: Palette = { ink: "#2a1a10", muted: "#6f5646", primary: "#7c2d12", primaryDark: "#5c1f0b", soft: "#fdecd8", line: "#ead7c3" };
const B = lookD(BP, { head: "Libre Baskerville", body: "Nunito", shape: "editorial", radius: 4, bg: "#fdf8f1", alt: "#f6ecdf", inv: "#2a1a10", fx: { aos: "fade-up" } });

const bFoot = (tr: Tr) =>
  footerD("Pustaka Teduh", B, {
    variant: "columns",
    about: tr("Toko buku independen dengan kursi baca, kopi, dan klub buku tiap Kamis.", "An independent bookshop with reading chairs, coffee and a book club every Thursday."),
    cols: [
      { title: tr("Toko", "Shop"), items: ["Jl. Cikini Raya 45, Jakarta", tr("Selasa–Minggu 10.00–21.00", "Tue–Sun 10am–9pm")] },
      { title: tr("Komunitas", "Community"), items: [tr("Klub buku", "Book club"), tr("Acara", "Events"), tr("Anggota", "Membership")] },
    ],
    social: ["Instagram | https://instagram.com/pustakateduh", "Goodreads | https://goodreads.com/pustakateduh"],
    copy: tr("© 2026 Pustaka Teduh. Konten contoh.", "© 2026 Pustaka Teduh. Sample content."),
  });

export const bookstorePustaka: TemplateContent = {
  brand: "Pustaka Teduh",
  pages: [home(), pg("catalog", ["katalog", "Katalog"], ["catalogue", "Catalogue"]), pg("club", ["klub-buku", "Klub Buku"], ["book-club", "Book Club"]), pg("events", ["acara", "Acara"], ["events", "Events"]), pg("membership", ["anggota", "Keanggotaan"], ["membership", "Membership"]), pg("visit", ["kunjungi", "Kunjungi"], ["visit", "Visit"])],
  build: (key, tr, href) =>
    render(B, key, headerD("Pustaka Teduh", B, { variant: "split", info: [tr("Gratis ongkir Jabodetabek di atas Rp200 rb", "Free Jabodetabek delivery over Rp200k"), tr("Buka Selasa–Minggu", "Open Tue–Sun")] }), bFoot(tr), {
      home: () => [
        heroEditorial(B, {
          meta: [tr("No. 42", "No. 42"), tr("Musim hujan 2026", "Rainy season 2026"), tr("Pilihan toko", "Shop picks")],
          title: tr("Tempat berteduh untuk para pembaca", "A shelter for readers"),
          text: tr("4.000 judul yang dipilih satu per satu oleh penjaga toko, sudut baca anak, dan kopi tubruk gratis untuk anggota.", "4,000 titles chosen one by one by our booksellers, a children's corner and free coffee for members."),
          image: asset("v3d-books"),
          alt: tr("Rak buku", "Bookshelf"),
          actions: [[tr("Jelajahi katalog", "Browse the catalogue"), href("catalog")], [tr("Ikut klub buku", "Join the book club"), href("club"), "outline"]],
        }),
        sliderD(B, { title: tr("Rekomendasi penjaga toko", "Bookseller recommendations"), slides: [{ title: tr("Laut Tak Pernah Tidur", "The Sea Never Sleeps"), text: tr("Novel keluarga nelayan tiga generasi. — pilihan Nara", "A three-generation fishing family novel. — Nara's pick"), bg: "#7c2d12" }, { title: tr("Atlas Pasar Nusantara", "Atlas of Island Markets"), text: tr("Esai foto 40 pasar tradisional. — pilihan Bram", "A photo essay on 40 traditional markets. — Bram's pick"), bg: "#166534" }, { title: tr("Kucing yang Menulis Surat", "The Cat Who Wrote Letters"), text: tr("Buku anak bergambar. — pilihan Tia", "A picture book for kids. — Tia's pick"), bg: "#b45309" }] }),
        editorial(B, { title: tr("Rak minggu ini", "This week's shelves"), cols: [[tr("Fiksi lokal", "Local fiction"), tr("12 novel baru dari penerbit independen.", "12 new novels from independent presses.")], [tr("Sejarah kecil", "Small histories"), tr("Kisah kampung, pasar, dan stasiun.", "Stories of villages, markets and stations.")], [tr("Anak & remaja", "Kids & teens"), tr("Dongeng dwibahasa dan komik.", "Bilingual tales and comics.")], [tr("Buku bekas", "Second-hand"), tr("Rak Rp20 ribu yang selalu ramai.", "The ever-busy Rp20k shelf.")]] }),
        withFx(B, statsBand(pro(B), tr, { eyebrow: tr("Sejak 2017", "Since 2017"), title: tr("Toko kecil, pembaca setia", "A small shop, loyal readers"), text: tr("Terima kasih telah membaca bersama kami.", "Thank you for reading with us."), stats: [["4.000", tr("Judul di rak", "Titles on shelves")], ["1.150", tr("Anggota", "Members")], ["212", tr("Pertemuan klub", "Club meetings")], ["38", tr("Penerbit indie", "Indie publishers")]] })),
      ],
      catalog: () => [
        pageHead(B, { eyebrow: tr("Katalog", "Catalogue"), title: tr("Pilihan toko bulan ini", "This month's picks"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Katalog", "Catalogue"), ""]] }),
        catalog(B, { title: tr("Baru datang", "New arrivals"), cols: 4, items: [{ image: asset("v3d-books"), title: tr("Laut Tak Pernah Tidur", "The Sea Never Sleeps"), text: tr("Novel · 312 hlm", "Novel · 312 pp"), price: "Rp98.000", cta: tr("Pesan", "Order"), href: href("visit") }, { image: asset("v3d-openbook-sepia"), title: tr("Atlas Pasar Nusantara", "Atlas of Island Markets"), text: tr("Esai foto · 180 hlm", "Photo essay · 180 pp"), price: "Rp185.000", cta: tr("Pesan", "Order"), href: href("visit") }, { image: asset("v3d-books-rose"), title: tr("Kucing yang Menulis Surat", "The Cat Who Wrote Letters"), text: tr("Anak · 48 hlm", "Kids · 48 pp"), price: "Rp75.000", cta: tr("Pesan", "Order"), href: href("visit") }, { image: asset("v3d-openbook"), title: tr("Puisi dari Peron", "Poems from the Platform"), text: tr("Puisi · 96 hlm", "Poetry · 96 pp"), price: "Rp65.000", cta: tr("Pesan", "Order"), href: href("visit") }] }),
        tabsD(B, { title: tr("Rak menurut suasana hati", "Shelves by mood"), tabs: [[tr("Hujan", "Rainy"), tr("Novel tebal, teh hangat, dan selimut.", "Thick novels, warm tea and a blanket.")], [tr("Perjalanan", "Travelling"), tr("Buku saku dan esai pendek.", "Pocket books and short essays.")], [tr("Penasaran", "Curious"), tr("Sains populer dan sejarah.", "Popular science and history.")]] }),
      ],
      club: () => [
        pageHead(B, { eyebrow: tr("Klub buku", "Book club"), title: tr("Kamis malam, satu buku, dua belas kursi", "Thursday nights, one book, twelve chairs") }),
        splitPanel(B, { title: tr("Cara ikut", "How to join"), text: tr("Beli atau pinjam buku bulan ini, baca sampai bab yang ditentukan, lalu datang pukul 19.00.", "Buy or borrow this month's book, read to the set chapter and come at 7pm."), bullets: [tr("Gratis untuk anggota", "Free for members"), tr("Rp25.000 untuk umum, termasuk kopi", "Rp25,000 for non-members, coffee included")], image: asset("v3d-openbook-sepia"), alt: tr("Buku terbuka", "Open book") }),
        tableD(B, { title: tr("Jadwal bacaan", "Reading schedule"), columns: [tr("Bulan", "Month"), tr("Buku", "Book"), tr("Pemandu", "Host")], rows: [[tr("Oktober", "October"), tr("Laut Tak Pernah Tidur", "The Sea Never Sleeps"), "Nara"], [tr("November", "November"), tr("Atlas Pasar Nusantara", "Atlas of Island Markets"), "Bram"], [tr("Desember", "December"), tr("Puisi dari Peron", "Poems from the Platform"), "Tia"]] }),
      ],
      events: () => [
        pageHead(B, { eyebrow: tr("Acara", "Events"), title: tr("Peluncuran, lokakarya, dan dongeng anak", "Launches, workshops and storytime") }),
        timelineD(B, { title: tr("Agenda bulan ini", "This month"), items: [["Sab 18 Okt", tr("Dongeng pagi", "Morning storytime"), tr("Untuk usia 4–8 tahun, 10.00.", "For ages 4–8, 10am.")], ["Rab 22 Okt", tr("Peluncuran buku", "Book launch"), tr("Atlas Pasar Nusantara bersama penulis.", "Atlas of Island Markets with the author.")], ["Sab 25 Okt", tr("Lokakarya zine", "Zine workshop"), tr("Membuat buku kecil dari kertas bekas.", "Make little books from scrap paper.")]], side: { image: asset("v3d-books-rose"), alt: tr("Rak buku berwarna", "Colourful shelf") } }),
        newsletter(B, { title: tr("Surat dari toko", "Letters from the shop"), text: tr("Rekomendasi dan undangan acara, dua kali sebulan.", "Recommendations and event invites, twice a month."), ph: "email@contoh.com", submit: tr("Langganan", "Subscribe"), inv: true }),
      ],
      membership: () => [
        pageHead(B, { eyebrow: tr("Keanggotaan", "Membership"), title: tr("Rp150.000 setahun, banyak manfaat", "Rp150,000 a year, lots of perks") }),
        cardsD(B, { title: tr("Yang Anda dapatkan", "What you get"), items: [{ title: tr("Diskon 10%", "10% off"), text: tr("Untuk semua buku baru.", "On every new book.") }, { title: tr("Kopi gratis", "Free coffee"), text: tr("Setiap kunjungan.", "Every visit.") }, { title: tr("Pinjam 2 buku", "Borrow 2 books"), text: tr("Dari rak perpustakaan kecil kami.", "From our little lending library.") }] }),
        faqD(B, { title: tr("Tanya soal anggota", "Membership questions"), items: [[tr("Bisa untuk keluarga?", "Family membership?"), tr("Ya, Rp250.000 untuk 4 orang.", "Yes, Rp250,000 for 4 people.")], [tr("Kartu fisik?", "Physical card?"), tr("Cukup nomor telepon.", "Just your phone number.")], [tr("Diperpanjang otomatis?", "Auto-renew?"), tr("Tidak, kami ingatkan lewat email.", "No, we remind you by email.")], [tr("Bisa dihadiahkan?", "Can I gift it?"), tr("Bisa, ada kartu hadiah.", "Yes, with a gift card.")]] }),
      ],
      visit: () => [
        pageHead(B, { eyebrow: tr("Kunjungi", "Visit"), title: tr("Jl. Cikini Raya 45", "Jl. Cikini Raya 45") }),
        locations(B, { title: tr("Cara ke toko", "Getting here"), image: asset("v3d-map"), places: [[tr("Toko utama", "Main shop"), "Jl. Cikini Raya 45, Jakarta", tr("Selasa–Minggu 10.00–21.00", "Tue–Sun 10am–9pm")], [tr("Pojok baca anak", "Kids' corner"), tr("Lantai 2", "Second floor"), tr("Sabtu–Minggu", "Sat–Sun")]] }),
        formD(B, { title: tr("Pesan buku untuk diambil", "Reserve a book for pickup"), info: [["WhatsApp", "0813 1717 4545"], ["Email", "toko@pustakateduh.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Judul buku", "Book title"), ph: "" }, { kind: "date", label: tr("Tanggal ambil", "Pickup date") }], submit: tr("Pesan", "Reserve") }),
      ],
    }),
};

/* -------------- 13. Penerbit Daun Lontar (5 hlm, Premium) --------------- */
// Premium: pro-portfolio-mosaic, countdown. Library: Tilt. Large typography.

const NP: Palette = { ink: "#1f0a12", muted: "#6b4452", primary: "#be123c", primaryDark: "#9f1239", soft: "#ffe4e6", line: "#fecdd3" };
const N = lookD(NP, { head: "Playfair Display", body: "Josefin Sans", shape: "sharp", radius: 0, bg: "#fffafa", alt: "#fff1f2", inv: "#1f0a12", fx: { tilt: true } });

const nFoot = (tr: Tr) =>
  footerD("Daun Lontar", N, {
    variant: "giant",
    about: tr("Penerbit sastra, esai, dan buku anak. Yogyakarta.", "A publisher of literature, essays and children's books. Yogyakarta."),
    cols: [{ title: tr("Redaksi", "Editorial"), items: ["naskah@daunlontar.id", "Jl. Kaliurang Km 6"] }, { title: tr("Distribusi", "Distribution"), items: [tr("Toko buku mitra", "Partner bookshops"), tr("Pesanan grosir", "Wholesale")] }],
    copy: tr("© 2026 Penerbit Daun Lontar. Konten contoh.", "© 2026 Daun Lontar Publishing. Sample content."),
  });

export const bookstorePenerbit: TemplateContent = {
  brand: "Penerbit Daun Lontar",
  pages: [home(), pg("books", ["buku", "Buku"], ["books", "Books"]), pg("authors", ["penulis", "Penulis"], ["authors", "Authors"]), pg("submit", ["kirim-naskah", "Kirim Naskah"], ["submissions", "Submissions"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(N, key, headerD("Daun Lontar", N, { variant: "bar", cta: [tr("Kirim naskah", "Submit"), href("submit")] }), nFoot(tr), {
      home: () => [
        heroType(N, {
          eyebrow: tr("Penerbit independen · sejak 2011", "Independent publisher · since 2011"),
          title: tr("Kata-kata yang layak dicetak", "Words worth printing"),
          text: tr("Kami menerbitkan 18 judul setahun — sedikit, tapi setiap buku disunting tiga kali dan dicetak di kertas bebas asam.", "We publish 18 titles a year — few, but each is edited three times and printed on acid-free paper."),
          words: [tr("Sastra", "Literature"), tr("Esai", "Essays"), tr("Puisi", "Poetry"), tr("Buku anak", "Children's books"), tr("Terjemahan", "Translations")],
          actions: [[tr("Katalog buku", "Book catalogue"), href("books")]],
          size: 96,
        }),
        withFx(N, portfolioMosaic(pro(N), tr, { eyebrow: tr("Terbitan terbaru", "New releases"), title: tr("Rak musim ini", "This season's shelf"), works: [{ title: tr("Hujan di Kota Garam", "Rain in the Salt Town"), tag: tr("Novel · Ratri Wulandari", "Novel · Ratri Wulandari"), image: asset("v3d-openbook") }, { title: tr("Peta yang Lupa", "The Forgetful Map"), tag: tr("Esai · Damar Setyo", "Essays · Damar Setyo"), image: asset("v3d-books-rose") }, { title: tr("Si Kancil Naik Kereta", "Mousedeer Takes the Train"), tag: tr("Anak", "Children"), image: asset("v3d-books") }, { title: tr("Seratus Pintu", "A Hundred Doors"), tag: tr("Puisi", "Poetry"), image: asset("v3d-openbook-sepia") }, { title: tr("Surat untuk Laut", "Letters to the Sea"), tag: tr("Terjemahan", "Translation"), image: asset("v3d-lake-dusk") }], cta: { label: tr("Semua buku", "All books"), href: href("books") } })),
        countdownD(N, { eyebrow: tr("Pra-pesan", "Pre-order"), title: tr("Hujan di Kota Garam terbit sebentar lagi", "Rain in the Salt Town is almost here"), text: tr("Pra-pesan dapat edisi bertanda tangan dan pembatas buku cetak saring.", "Pre-orders get a signed edition and a screen-printed bookmark."), target: "2026-11-20T10:00", finished: tr("Sudah terbit!", "Out now!"), actions: [[tr("Pra-pesan", "Pre-order"), href("contact"), "light"]] }),
      ],
      books: () => [
        pageHead(N, { eyebrow: tr("Katalog", "Catalogue"), title: tr("Semua terbitan", "All titles"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Buku", "Books"), ""]] }),
        catalog(N, { title: tr("Terlaris", "Bestsellers"), items: [{ image: asset("v3d-openbook"), title: tr("Hujan di Kota Garam", "Rain in the Salt Town"), text: "Ratri Wulandari", price: "Rp105.000", badge: tr("Pra-pesan", "Pre-order"), cta: tr("Detail", "Details"), href: href("books") }, { image: asset("v3d-books-rose"), title: tr("Peta yang Lupa", "The Forgetful Map"), text: "Damar Setyo", price: "Rp89.000", cta: tr("Detail", "Details"), href: href("books") }, { image: asset("v3d-openbook-sepia"), title: tr("Seratus Pintu", "A Hundred Doors"), text: "Laila Amarta", price: "Rp70.000", cta: tr("Detail", "Details"), href: href("books") }] }),
        specs(N, { title: tr("Standar cetak kami", "Our print standard"), rows: [[tr("Kertas isi", "Paper"), tr("Book paper 57 g bebas asam", "57 g acid-free book paper")], [tr("Jilid", "Binding"), tr("Jahit benang + lem panas", "Thread-sewn + hot glue")], [tr("Sampul", "Cover"), tr("Art carton 260 g, laminasi doff", "260 g art carton, matte lamination")]], image: asset("v3d-openbook"), alt: tr("Buku terbuka", "Open book") }),
      ],
      authors: () => [
        pageHead(N, { eyebrow: tr("Penulis", "Authors"), title: tr("Suara-suara yang kami percaya", "Voices we believe in") }),
        peopleD(N, { title: tr("Penulis kami", "Our authors"), items: [{ name: "Ratri Wulandari", role: tr("Novelis", "Novelist"), photo: asset("v3d-face-2"), text: tr("Tiga novel tentang kota pesisir.", "Three novels about coastal towns.") }, { name: "Damar Setyo", role: tr("Esais", "Essayist"), photo: asset("v3d-face-5"), text: tr("Menulis tentang peta dan ingatan.", "Writes about maps and memory.") }, { name: "Laila Amarta", role: tr("Penyair", "Poet"), photo: asset("v3d-face-6") }] }),
        pullQuote(N, { text: tr("Editor Daun Lontar membaca naskah saya seperti membaca surat dari teman lama.", "Daun Lontar's editors read my manuscript like a letter from an old friend."), name: "Ratri Wulandari", role: tr("Penulis", "Author") }),
      ],
      submit: () => [
        pageHead(N, { eyebrow: tr("Kirim naskah", "Submissions"), title: tr("Kami membaca semua naskah", "We read every manuscript") }),
        zigzag(N, { title: tr("Prosesnya", "The process"), steps: [[tr("Kirim sinopsis + 3 bab", "Send a synopsis + 3 chapters"), tr("Format PDF, maksimal 5 MB.", "PDF, max 5 MB.")], [tr("Dibaca redaksi", "Editorial read"), tr("Jawaban dalam 8–12 minggu.", "Reply within 8–12 weeks.")], [tr("Naskah lengkap", "Full manuscript"), tr("Bila tertarik, kami minta naskah utuh.", "If interested, we ask for the full text.")]] }),
        formD(N, { title: tr("Formulir naskah", "Submission form"), info: [[tr("Genre", "Genres"), tr("Fiksi, esai, puisi, anak", "Fiction, essays, poetry, kids")], ["Email", "naskah@daunlontar.id"]], fields: [{ kind: "input", label: tr("Nama penulis", "Author name"), ph: "" }, { kind: "input", label: tr("Judul naskah", "Manuscript title"), ph: "" }, { kind: "select", label: "Genre", ph: tr("Pilih", "Choose"), options: [tr("Fiksi", "Fiction"), tr("Esai", "Essays"), tr("Puisi", "Poetry"), tr("Anak", "Children")] }], message: tr("Sinopsis", "Synopsis"), submit: tr("Kirim naskah", "Submit manuscript") }),
      ],
      contact: () => [
        pageHead(N, { eyebrow: tr("Kontak", "Contact"), title: tr("Redaksi & distribusi", "Editorial & distribution") }),
        cardsD(N, { title: tr("Hubungi bagian yang tepat", "Reach the right desk"), items: [{ title: tr("Redaksi", "Editorial"), text: "naskah@daunlontar.id" }, { title: tr("Pemasaran & media", "Marketing & press"), text: "media@daunlontar.id" }, { title: tr("Grosir & toko", "Wholesale & shops"), text: "distribusi@daunlontar.id" }] }),
        locations(N, { title: tr("Kantor redaksi", "Editorial office"), image: asset("v3d-map"), places: [[tr("Daun Lontar", "Daun Lontar"), "Jl. Kaliurang Km 6, Yogyakarta", tr("Sen–Jum 09.00–17.00", "Mon–Fri 9am–5pm")]] }),
      ],
    }),
};

/* --------------- 14. Suryanta Energi — panel surya (7 hlm) --------------- */
// Premium: before-after, progress, pro-pricing-cards, pro-stats-band. Library: AOS + Tilt.

const SP: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#ca8a04", primaryDark: "#854d0e", soft: "#fef9c3", line: "#fde68a" };
const S = lookD(SP, { head: "Outfit", body: "Rubik", shape: "soft", radius: 20, bg: "#fffef7", alt: "#fefce8", inv: "#1e3a8a", fx: { aos: "zoom-in", tilt: true } });

const sFoot = (tr: Tr) =>
  footerD("Suryanta", S, {
    variant: "columns",
    about: tr("Instalasi panel surya atap untuk rumah dan bisnis. Bergaransi 25 tahun.", "Rooftop solar for homes and businesses. 25-year warranty."),
    cols: [{ title: tr("Solusi", "Solutions"), items: [tr("Rumah", "Homes"), tr("Bisnis & pabrik", "Business & factories"), tr("Pembiayaan", "Financing")] }, { title: tr("Kontak", "Contact"), items: ["0800 1 SURYA", "halo@suryanta.co.id"] }],
    copy: tr("© 2026 Suryanta Energi. Konten contoh.", "© 2026 Suryanta Energi. Sample content."),
  });

export const energySurya: TemplateContent = {
  brand: "Suryanta Energi",
  pages: [home(), pg("homes", ["rumah", "Untuk Rumah"], ["homes", "For Homes"]), pg("business", ["bisnis", "Untuk Bisnis"], ["business", "For Business"]), pg("calc", ["simulasi-hemat", "Simulasi Hemat"], ["savings-estimate", "Savings Estimate"]), pg("projects", ["proyek", "Proyek"], ["projects", "Projects"]), pg("finance", ["pembiayaan", "Pembiayaan"], ["financing", "Financing"]), pg("survey", ["survei-gratis", "Survei Gratis"], ["free-survey", "Free Survey"])],
  build: (key, tr, href) =>
    render(S, key, headerD("Suryanta", S, { variant: "pill", cta: [tr("Survei gratis", "Free survey"), href("survey")] }), sFoot(tr), {
      home: () => [
        heroSplitScreen(S, {
          reverse: true,
          eyebrow: tr("Energi dari atap sendiri", "Power from your own roof"),
          title: tr("Tagihan listrik turun hingga 60%", "Cut your power bill by up to 60%"),
          text: tr("Survei, desain, izin, dan pemasangan dalam 14 hari. Pantau produksi listrik dari aplikasi.", "Survey, design, permits and installation in 14 days. Track production in the app."),
          list: [tr("Garansi panel 25 tahun", "25-year panel warranty"), tr("Cicilan 0% hingga 24 bulan", "0% instalments up to 24 months"), tr("Teknisi bersertifikat", "Certified technicians")],
          image: asset("v3d-solar"),
          alt: tr("Panel surya dan matahari", "Solar panel and sun"),
          actions: [[tr("Hitung penghematan", "Estimate savings"), href("calc"), "light"]],
        }),
        bento(S, { title: tr("Kenapa memasang sekarang", "Why install now"), items: [{ title: tr("Balik modal 5–6 tahun", "Payback in 5–6 years"), text: tr("Sisa umur panel 19+ tahun adalah keuntungan bersih.", "The remaining 19+ years are pure savings."), icon: "☀", wide: true, accent: true }, { title: tr("Net metering", "Net metering"), text: tr("Kelebihan listrik bisa dikreditkan.", "Excess power can be credited."), icon: "⇄" }, { title: tr("Nilai rumah naik", "Higher home value"), text: tr("Rumah hemat energi lebih diminati.", "Efficient homes sell faster."), icon: "⌂" }, { title: tr("Pantau real-time", "Real-time tracking"), text: tr("Produksi harian, bulanan, dan CO₂ yang dihemat.", "Daily and monthly output, plus CO₂ saved."), icon: "◔", wide: true }] }),
        withFx(S, statsBand(pro(S), tr, { eyebrow: tr("Dampak", "Impact"), title: tr("2.300 atap, satu tujuan", "2,300 roofs, one goal"), text: tr("Data instalasi hingga September 2026.", "Installation data up to September 2026."), stats: [["2.300", tr("Atap terpasang", "Roofs installed")], ["14 MWp", tr("Kapasitas", "Capacity")], ["11.000 t", tr("CO₂ dihindari/tahun", "CO₂ avoided/yr")], ["4,9", tr("Rating pelanggan", "Customer rating")]] })),
        beforeAfterD(S, { title: tr("Atap yang sama, fungsi baru", "Same roof, new job"), before: asset("v3d-roof-plain"), after: asset("v3d-solar-roof"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Atap sebelum dan sesudah dipasang panel", "Roof before and after panels") }),
      ],
      homes: () => [
        pageHead(S, { eyebrow: tr("Untuk rumah", "For homes"), title: tr("Paket atap rumah", "Home rooftop packages"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Rumah", "Homes"), ""]] }),
        withFx(S, pricingCards(pro(S), tr, { title: tr("Pilih sesuai daya listrik", "Pick by your power connection"), text: tr("Harga sudah termasuk pemasangan & izin. Angka contoh.", "Prices include installation & permits. Sample figures."), plans: [{ name: "Surya 2", price: "Rp28 jt", period: "2 kWp", text: tr("Daya 2.200 VA", "2,200 VA connection"), features: [tr("4 panel 550 Wp", "4 × 550 Wp panels"), tr("Inverter 2 kW", "2 kW inverter"), tr("Aplikasi pemantau", "Monitoring app")], cta: { label: tr("Pilih", "Choose"), href: href("survey") } }, { name: "Surya 4", price: "Rp52 jt", period: "4 kWp", text: tr("Daya 3.500–5.500 VA", "3,500–5,500 VA connection"), features: [tr("8 panel 550 Wp", "8 × 550 Wp panels"), tr("Inverter hibrida", "Hybrid inverter"), tr("Siap baterai", "Battery-ready")], cta: { label: tr("Pilih", "Choose"), href: href("survey") }, featured: true }, { name: "Surya 6+", price: "Rp76 jt", period: "6 kWp", text: tr("Daya 7.700 VA ke atas", "7,700 VA and up"), features: [tr("12 panel", "12 panels"), tr("Baterai 5 kWh opsional", "Optional 5 kWh battery"), tr("Pengisi mobil listrik", "EV charger add-on")], cta: { label: tr("Pilih", "Choose"), href: href("survey") } }] })),
        faqD(S, { title: tr("Pertanyaan pemilik rumah", "Homeowner questions"), items: [[tr("Atap genteng bisa?", "Tiled roofs?"), tr("Bisa, dengan dudukan khusus.", "Yes, with special mounts.")], [tr("Saat mendung?", "When cloudy?"), tr("Produksi turun, listrik jaringan tetap tersambung.", "Output drops; grid power stays connected.")], [tr("Perawatan?", "Maintenance?"), tr("Bilas panel 2–3 bulan sekali.", "Rinse panels every 2–3 months.")], [tr("Atap bocor?", "Roof leaks?"), tr("Garansi kebocoran 5 tahun.", "5-year leak warranty.")]] }),
      ],
      business: () => [
        pageHead(S, { eyebrow: tr("Untuk bisnis", "For business"), title: tr("Atap pabrik jadi pembangkit", "Turn factory roofs into power plants") }),
        splitPanel(S, { title: tr("Skema sewa tanpa modal", "Zero-capex lease"), text: tr("Kami membangun dan merawat sistem; Anda membayar listrik yang dihasilkan dengan tarif lebih murah dari tarif jaringan.", "We build and maintain the system; you pay for the power it produces at a rate below the grid."), bullets: [tr("Kontrak 15 tahun", "15-year contract"), tr("Hemat 10–20% sejak bulan pertama", "Save 10–20% from month one")], image: asset("v3d-solar-roof"), alt: tr("Panel di atap", "Panels on a roof") }),
        numbers(S, { items: [["120+", tr("Klien bisnis", "Business clients")], ["8,4 MWp", tr("Kapasitas komersial", "Commercial capacity")], ["99,2%", tr("Ketersediaan sistem", "System uptime")]] }),
      ],
      calc: () => [
        pageHead(S, { eyebrow: tr("Simulasi", "Estimate"), title: tr("Berapa yang bisa dihemat?", "How much could you save?") }),
        progressD(S, { title: tr("Contoh rumah tagihan Rp1,5 jt/bulan", "Example: home with Rp1.5M monthly bill"), text: tr("Dengan paket Surya 4.", "With the Surya 4 package."), bars: [[tr("Kebutuhan siang tertutup surya", "Daytime use covered by solar"), 78], [tr("Penurunan tagihan", "Bill reduction"), 56], [tr("Balik modal (tahun ke-6 dari 25)", "Payback (year 6 of 25)"), 24]], side: { image: asset("v3d-solar"), alt: tr("Panel surya", "Solar panel") } }),
        tableD(S, { title: tr("Perkiraan per tagihan", "Estimates by bill"), columns: [tr("Tagihan/bulan", "Monthly bill"), tr("Paket", "Package"), tr("Hemat/bulan", "Saving/month")], rows: [["Rp700 rb", "Surya 2", "Rp380 rb"], ["Rp1,5 jt", "Surya 4", "Rp840 rb"], ["Rp2,5 jt", "Surya 6+", "Rp1,4 jt"]], note: tr("Perkiraan; hasil nyata tergantung arah atap dan bayangan.", "Estimates; real results depend on roof direction and shading.") }),
      ],
      projects: () => [
        pageHead(S, { eyebrow: tr("Proyek", "Projects"), title: tr("Atap yang sudah bekerja", "Roofs already at work") }),
        mosaic(S, { title: tr("Galeri instalasi", "Installation gallery"), images: [[asset("v3d-solar"), tr("Rumah, Depok · 4 kWp", "Home, Depok · 4 kWp")], [asset("v3d-solar-roof"), tr("Gudang, Cikarang · 400 kWp", "Warehouse, Cikarang · 400 kWp")], [asset("v3d-solar"), tr("Sekolah, Malang · 30 kWp", "School, Malang · 30 kWp")], [asset("v3d-solar-roof"), tr("Klinik, Bogor · 12 kWp", "Clinic, Bogor · 12 kWp")], [asset("v3d-solar"), tr("Kafe, Bali · 8 kWp", "Café, Bali · 8 kWp")], [asset("v3d-solar-roof"), tr("Pabrik roti, Bekasi · 150 kWp", "Bakery plant, Bekasi · 150 kWp")]] }),
        pullQuote(S, { text: tr("Tagihan listrik pabrik kami turun Rp38 juta per bulan tanpa keluar modal.", "Our factory bill dropped by Rp38M a month with no upfront cost."), name: "Hartati Gunawan", role: tr("Direktur, Pabrik Roti Sentosa", "Director, Sentosa Bakery") }),
      ],
      finance: () => [
        pageHead(S, { eyebrow: tr("Pembiayaan", "Financing"), title: tr("Bayar dari penghematan", "Pay from your savings") }),
        cardsD(S, { title: tr("Tiga pilihan", "Three options"), items: [{ icon: "1", title: tr("Tunai", "Cash"), text: tr("Diskon 5% dan balik modal tercepat.", "5% discount and fastest payback.") }, { icon: "2", title: tr("Cicilan 0%", "0% instalments"), text: tr("Hingga 24 bulan dengan kartu kredit.", "Up to 24 months by credit card.") }, { icon: "3", title: tr("Sewa (bisnis)", "Lease (business)"), text: tr("Tanpa modal, bayar per kWh.", "No capex, pay per kWh.") }] }),
        tabsD(S, { title: tr("Dokumen yang dibutuhkan", "Documents needed"), tabs: [[tr("Rumah", "Homes"), tr("KTP, rekening listrik 3 bulan, foto atap.", "ID, 3 months of bills, roof photos.")], [tr("Bisnis", "Business"), tr("NIB, laporan keuangan 2 tahun, denah atap.", "Business ID, 2 years of financials, roof plan.")]] }),
      ],
      survey: () => [
        pageHead(S, { eyebrow: tr("Survei gratis", "Free survey"), title: tr("Teknisi datang, ukur, dan hitung", "A technician visits, measures and calculates") }),
        formD(S, { title: tr("Jadwalkan survei", "Schedule a survey"), info: [[tr("Telepon", "Phone"), "0800 1 SURYA"], [tr("Area", "Area"), tr("Jawa, Bali, Sumatra Utara", "Java, Bali, North Sumatra")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Alamat", "Address"), ph: "" }, { kind: "select", label: tr("Tagihan per bulan", "Monthly bill"), ph: tr("Pilih", "Choose"), options: ["< Rp1 jt", "Rp1–2 jt", "Rp2–5 jt", "> Rp5 jt"] }, { kind: "date", label: tr("Tanggal survei", "Survey date") }], submit: tr("Pesan survei", "Book survey"), formFirst: true }),
        timelineD(S, { title: tr("Setelah survei", "After the survey"), items: [[tr("Hari 1", "Day 1"), tr("Survei", "Survey"), tr("Pengukuran atap dan bayangan.", "Roof and shading measurements.")], [tr("Hari 3", "Day 3"), tr("Proposal", "Proposal"), tr("Desain dan perhitungan hemat.", "Design and savings estimate.")], [tr("Hari 7–14", "Day 7–14"), tr("Pemasangan", "Installation"), tr("1–2 hari kerja di lokasi.", "1–2 days on site.")]] }),
      ],
    }),
};

/* -------------- 15. VoltaNusa — pengisian mobil listrik (5 hlm) ----------- */
// Premium: pricing, stats-counter, comparison-table. Library: Animate + AOS. Neon gelap.

const VP: Palette = { ink: "#ecfdf5", muted: "#94a3b8", primary: "#10b981", primaryDark: "#047857", soft: "#064e3b", line: "#065f46" };
const V = lookD(VP, { head: "Space Mono", body: "Space Grotesk", shape: "neon", radius: 16, bg: "#020617", alt: "#0b1324", inv: "#04291f", surface: "#0f172a", fx: { animate: "zoomIn", aos: "fade-up" }, dark: true });

const vFoot = (tr: Tr) =>
  footerD("VoltaNusa", V, {
    variant: "slim",
    about: tr("Jaringan pengisian cepat kendaraan listrik di jalur antarkota.", "A fast-charging network for EVs along intercity routes."),
    social: ["Instagram | https://instagram.com/voltanusa", "X | https://x.com/voltanusa", "YouTube | https://youtube.com/@voltanusa"],
    copy: tr("© 2026 VoltaNusa. Konten contoh.", "© 2026 VoltaNusa. Sample content."),
  });

export const energyEvCharging: TemplateContent = {
  brand: "VoltaNusa",
  pages: [home(), pg("map", ["lokasi", "Lokasi"], ["locations", "Locations"]), pg("pricing", ["tarif", "Tarif"], ["pricing", "Pricing"]), pg("host", ["mitra-lokasi", "Mitra Lokasi"], ["host-a-charger", "Host a Charger"]), pg("help", ["bantuan", "Bantuan"], ["help", "Help"])],
  build: (key, tr, href) =>
    render(V, key, headerD("VoltaNusa", V, { variant: "bar", cta: [tr("Cari lokasi", "Find a charger"), href("map")] }), vFoot(tr), {
      home: () => [
        heroNeon(V, {
          eyebrow: tr("Pengisian cepat 150 kW", "150 kW fast charging"),
          title: tr("Isi 80% selama ngopi", "80% charged over a coffee"),
          text: tr("312 titik pengisian di rest area, mal, dan hotel. Mulai dari aplikasi, bayar per kWh, tanpa kartu anggota.", "312 chargers at rest areas, malls and hotels. Start from the app, pay per kWh, no membership card."),
          chips: ["CCS2", "Type 2", "CHAdeMO"],
          image: asset("v3d-charger"),
          alt: tr("Stasiun pengisian", "Charging station"),
          actions: [[tr("Lihat peta", "See the map"), href("map")], [tr("Tarif", "Pricing"), href("pricing"), "outline"]],
        }),
        counterD(V, { items: [tr("312 | Titik pengisian", "312 | Chargers"), tr("48 | Kota", "48 | Cities"), tr("150 kW | Daya maksimum", "150 kW | Max power"), tr("99% | Uptime", "99% | Uptime")] }),
        cardsD(V, { title: tr("Mengisi semudah memesan kopi", "Charging as easy as ordering coffee"), items: [{ icon: "01", title: tr("Pindai QR", "Scan the QR"), text: tr("Di setiap unit pengisi.", "On every charger.") }, { icon: "02", title: tr("Colok & mulai", "Plug in & start"), text: tr("Status pengisian tampil di aplikasi.", "Charging status shown in the app.") }, { icon: "03", title: tr("Bayar otomatis", "Auto payment"), text: tr("Dompet digital atau kartu.", "E-wallet or card.") }] }),
        wordBand(V, [tr("Rest area tol", "Toll rest areas"), tr("Mal", "Malls"), tr("Hotel", "Hotels"), tr("Kantor", "Offices"), tr("Apartemen", "Apartments")], { bg: "#10b981", color: "#020617" }),
      ],
      map: () => [
        pageHead(V, { eyebrow: tr("Lokasi", "Locations"), title: tr("312 titik di 48 kota", "312 chargers in 48 cities"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Lokasi", "Locations"), ""]] }),
        locations(V, { title: tr("Jalur favorit", "Popular corridors"), image: asset("v3d-map"), places: [[tr("Rest Area Km 57", "Rest Area Km 57"), tr("Tol Jakarta–Cikampek", "Jakarta–Cikampek toll"), tr("4 × 150 kW · 24 jam", "4 × 150 kW · 24h")], [tr("Mal Pelangi Bandung", "Pelangi Mall Bandung"), tr("Basement B1", "Basement B1"), tr("6 × 60 kW", "6 × 60 kW")], [tr("Hotel Ombak Sanur", "Ombak Hotel Sanur"), tr("Lobi parkir", "Parking lobby"), tr("2 × 22 kW AC", "2 × 22 kW AC")]] }),
        tableD(V, { title: tr("Jenis pengisi", "Charger types"), columns: [tr("Tipe", "Type"), tr("Daya", "Power"), tr("10–80%", "10–80%")], rows: [["Ultra (CCS2)", "150 kW", "± 25 mnt"], ["Cepat (CCS2/CHAdeMO)", "60 kW", "± 50 mnt"], ["AC Type 2", "22 kW", "± 3 jam"]] }),
      ],
      pricing: () => [
        pageHead(V, { eyebrow: tr("Tarif", "Pricing"), title: tr("Bayar per kWh, transparan", "Pay per kWh, transparently") }),
        plansD(V, { title: tr("Pilih cara bayar", "Choose how to pay"), items: [{ plan: tr("Bayar di tempat", "Pay as you go"), price: "Rp2.466", period: "/kWh", description: tr("Tanpa langganan.", "No subscription."), features: [tr("Semua lokasi", "All locations"), tr("Biaya parkir terpisah", "Parking billed separately")], buttonText: tr("Unduh aplikasi", "Get the app"), buttonHref: href("help") }, { plan: "Volta+", price: "Rp99rb", period: tr("/bulan", "/month"), description: tr("Untuk pengguna harian.", "For daily drivers."), features: [tr("Rp1.950/kWh", "Rp1,950/kWh"), tr("Reservasi slot 15 menit", "15-min slot booking"), tr("Gratis biaya idle 10 menit", "10 min idle fee waived")], buttonText: tr("Langganan", "Subscribe"), buttonHref: href("help"), featured: true, badge: tr("Hemat", "Best value") }, { plan: tr("Armada", "Fleet"), price: tr("Kustom", "Custom"), period: "", description: tr("Taksi, logistik, korporat.", "Taxis, logistics, corporate."), features: [tr("Tagihan bulanan", "Monthly invoicing"), tr("Dasbor armada", "Fleet dashboard")], buttonText: tr("Hubungi kami", "Contact us"), buttonHref: href("host") }] }),
        compareD(V, { title: tr("Bandingkan", "Compare"), columns: [tr("Bayar di tempat", "Pay as you go"), "Volta+", tr("Armada", "Fleet")], rows: [tr("Tarif per kWh | Rp2.466 | Rp1.950 | Negosiasi", "Price per kWh | Rp2,466 | Rp1,950 | Negotiated"), tr("Reservasi slot | tidak | ya | ya", "Slot booking | no | yes | yes"), tr("Faktur pajak | tidak | ya | ya", "Tax invoices | no | yes | yes"), tr("Dasbor armada | tidak | tidak | ya", "Fleet dashboard | no | no | yes")], caption: tr("Tarif contoh", "Sample rates") }),
      ],
      host: () => [
        pageHead(V, { eyebrow: tr("Mitra lokasi", "Host a charger"), title: tr("Punya lahan parkir? Jadikan tujuan", "Got parking? Make it a destination") }),
        splitPanel(V, { title: tr("Kami pasang, Anda bagi hasil", "We install, you share revenue"), text: tr("Tanpa biaya investasi. Pengemudi mampir 30–45 menit dan berbelanja di lokasi Anda.", "No investment cost. Drivers stay 30–45 minutes and spend at your venue."), bullets: [tr("Bagi hasil 10% dari penjualan listrik", "10% revenue share on energy sold"), tr("Perawatan 24/7 oleh tim kami", "24/7 maintenance by our team")], image: asset("v3d-charger-light"), alt: tr("Pengisi daya", "Charger") }),
        formD(V, { title: tr("Ajukan lokasi", "Propose a site"), info: [["Email", "mitra@voltanusa.id"]], fields: [{ kind: "input", label: tr("Nama usaha", "Business name"), ph: "" }, { kind: "input", label: tr("Kota", "City"), ph: "" }, { kind: "select", label: tr("Jenis lokasi", "Site type"), ph: tr("Pilih", "Choose"), options: [tr("Mal", "Mall"), tr("Hotel", "Hotel"), tr("Rest area", "Rest area"), tr("Kantor", "Office")] }], submit: tr("Kirim", "Submit") }),
      ],
      help: () => [
        pageHead(V, { eyebrow: tr("Bantuan", "Help"), title: tr("Siaga 24 jam", "On call 24/7") }),
        faqD(V, { title: tr("Pertanyaan pengemudi", "Driver questions"), items: [[tr("Mobil saya cocok?", "Is my car compatible?"), tr("Semua mobil dengan CCS2, CHAdeMO, atau Type 2.", "Any car with CCS2, CHAdeMO or Type 2.")], [tr("Pengisian berhenti sendiri?", "Charging stopped?"), tr("Hubungi 1500-865, kami restart dari jarak jauh.", "Call 1500-865, we restart remotely.")], [tr("Biaya idle?", "Idle fee?"), tr("Rp1.000/menit setelah 10 menit penuh.", "Rp1,000/min after 10 minutes at full.")], [tr("Hujan aman?", "Safe in rain?"), tr("Ya, unit tahan air IP55.", "Yes, units are IP55 waterproof.")]] }),
        ctaD(V, { title: tr("Darurat di jalan? 1500-865", "Roadside trouble? 1500-865"), actions: [[tr("Telepon sekarang", "Call now"), "tel:1500865"]], tone: "primary" }),
      ],
    }),
};
