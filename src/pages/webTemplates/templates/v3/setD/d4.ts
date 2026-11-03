import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import { pricingCards, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import {
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
  galleryLb,
  headerD,
  heroBrutal,
  heroGlass,
  heroMinimal,
  heroPoster,
  heroSoft,
  home,
  indexList,
  locations,
  lookD,
  magazine,
  marqueeD,
  megaD,
  mosaic,
  newsletter,
  numbers,
  offer,
  pageHead,
  pg,
  plansD,
  priceSwitchD,
  pro,
  progressD,
  pullQuote,
  render,
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
/* Template v3 D16–D20: Laboratorium riset, Museum sains, Merchandise,   */
/* Laundry kiloan, SaaS HR & absensi.                                    */
/* ================================================================== */

/* ------------- 16. Arunaya BioLab — laboratorium riset (8 hlm) ----------- */
// Premium: progress, pro-team-cards, pro-stats-band, logo-marquee, typewriter. Library: AOS. Ilmiah, monospace.

const RP: Palette = { ink: "#0c1f2e", muted: "#4a6275", primary: "#0369a1", primaryDark: "#075985", soft: "#e0f2fe", line: "#bae6fd" };
const R = lookD(RP, { head: "JetBrains Mono", body: "Inter", shape: "sharp", radius: 2, bg: "#ffffff", alt: "#f3f8fc", inv: "#0c1f2e", fx: { aos: "fade-up" } });

const rFoot = (tr: Tr) =>
  footerD("Arunaya BioLab", R, {
    variant: "columns",
    about: tr("Laboratorium riset biomolekuler independen. Kawasan Sains Cibinong Baru (fiktif).", "An independent biomolecular research lab. New Cibinong Science Park (fictional)."),
    cols: [{ title: tr("Riset", "Research"), items: [tr("Genomik tanaman", "Plant genomics"), tr("Mikrobioma", "Microbiome"), tr("Bioinformatika", "Bioinformatics")] }, { title: tr("Kontak", "Contact"), items: ["riset@arunaya-lab.id", "+62 21 8790 4400"] }],
    copy: tr("© 2026 Arunaya BioLab. Konten contoh.", "© 2026 Arunaya BioLab. Sample content."),
  });

export const scienceLabRiset: TemplateContent = {
  brand: "Arunaya BioLab",
  pages: [
    home(),
    pg("research", ["riset", "Bidang Riset"], ["research", "Research Areas"]),
    pg("pubs", ["publikasi", "Publikasi"], ["publications", "Publications"]),
    pg("facilities", ["fasilitas", "Fasilitas"], ["facilities", "Facilities"]),
    pg("services", ["layanan-uji", "Layanan Uji"], ["testing-services", "Testing Services"]),
    pg("team", ["tim", "Tim Peneliti"], ["team", "Research Team"]),
    pg("careers", ["karier", "Karier"], ["careers", "Careers"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) =>
    render(R, key, headerD("Arunaya BioLab", R, { variant: "split", info: ["ISO/IEC 17025 (contoh)", tr("Sen–Jum 08.00–17.00", "Mon–Fri 8am–5pm")], cta: [tr("Ajukan uji", "Request testing"), href("services")] }), rFoot(tr), {
      home: () => [
        heroMinimal(R, {
          eyebrow: tr("Laboratorium riset biomolekuler", "Biomolecular research lab"),
          title: "",
          titleNode: typerD(R, tr("Kami meneliti", "We study"), [tr("genom padi", "rice genomes"), tr("mikroba tanah", "soil microbes"), tr("enzim industri", "industrial enzymes"), tr("ketahanan pangan", "food security")], { size: 44, align: "center" }),
          text: tr("Riset terbuka, data bisa direproduksi, dan layanan uji untuk industri pangan serta pertanian.", "Open research, reproducible data and testing services for the food and agriculture industries."),
          image: asset("v3d-flask"),
          alt: tr("Labu kimia", "Chemistry flask"),
          actions: [[tr("Bidang riset", "Research areas"), href("research")], [tr("Publikasi", "Publications"), href("pubs"), "outline"]],
          note: tr("Seluruh dataset dipublikasikan dengan lisensi terbuka.", "All datasets published under open licences."),
        }),
        withFx(R, statsBand(pro(R), tr, { eyebrow: tr("Sejak 2015", "Since 2015"), title: tr("Sains yang terukur", "Measurable science"), text: tr("Angka per Desember 2025.", "Figures as of December 2025."), stats: [["142", tr("Publikasi bereviu", "Peer-reviewed papers")], ["38", tr("Peneliti", "Researchers")], ["2,1 PB", tr("Data sekuensing", "Sequencing data")], ["17", tr("Mitra riset", "Research partners")]] })),
        editorial(R, { title: tr("Tiga pertanyaan besar", "Three big questions"), cols: [[tr("Padi tahan kering", "Drought-tolerant rice"), tr("Gen apa yang membuat varietas lokal bertahan di musim kemarau?", "Which genes help local varieties survive dry seasons?")], [tr("Tanah yang hidup", "Living soil"), tr("Bagaimana mikroba tanah memengaruhi hasil panen?", "How do soil microbes shape yields?")], [tr("Enzim hijau", "Green enzymes"), tr("Bisakah limbah sawit jadi bahan baku enzim?", "Can palm waste feed enzyme production?")]] }),
        marqueeD(R, { title: tr("Mitra riset & pendanaan", "Research & funding partners"), items: ["Yayasan Benih Lestari", "Konsorsium Pangan Timur", "Institut Tanah Tropis", "Dana Riset Samudra", "Koperasi Tani Mekar", "Pusat Data Hayati"] }),
      ],
      research: () => [
        pageHead(R, { eyebrow: tr("Bidang riset", "Research areas"), title: tr("Empat kelompok riset", "Four research groups"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Riset", "Research"), ""]] }),
        cardsD(R, { title: tr("Kelompok", "Groups"), cols: 4, items: [{ icon: "G", title: tr("Genomik tanaman", "Plant genomics"), text: tr("Sekuensing 320 varietas padi lokal.", "Sequencing 320 local rice varieties.") }, { icon: "M", title: tr("Mikrobioma", "Microbiome"), text: tr("Peta mikroba tanah sawah.", "Mapping paddy-soil microbes.") }, { icon: "E", title: tr("Enzim", "Enzymes"), text: tr("Enzim dari limbah agroindustri.", "Enzymes from agro-industrial waste.") }, { icon: "B", title: tr("Bioinformatika", "Bioinformatics"), text: tr("Pipa analisis sumber terbuka.", "Open-source analysis pipelines.") }] }),
        progressD(R, { title: tr("Kemajuan proyek 2026", "2026 project progress"), bars: [[tr("Atlas genom padi lokal", "Local rice genome atlas"), 72], [tr("Biofertilizer uji lapang", "Biofertiliser field trials"), 45], [tr("Enzim selulase skala pilot", "Pilot-scale cellulase"), 30]], side: { image: asset("v3d-flask-violet"), alt: tr("Eksperimen", "Experiment") } }),
      ],
      pubs: () => [
        pageHead(R, { eyebrow: tr("Publikasi", "Publications"), title: tr("Artikel & dataset terbaru", "Latest papers & datasets") }),
        indexList(R, { title: tr("2026", "2026"), rows: [{ title: tr("Varian gen DRO1 pada padi gogo lokal", "DRO1 variants in local upland rice"), meta: tr("Jurnal Genomik Tropis · Agu", "Tropical Genomics Journal · Aug"), tag: tr("Akses terbuka", "Open access"), href: href("pubs"), cta: "PDF" }, { title: tr("Mikrobioma tanah sawah organik vs konvensional", "Organic vs conventional paddy soil microbiomes"), meta: tr("Ekologi Tanah · Jun", "Soil Ecology · Jun"), tag: "Dataset", href: href("pubs"), cta: "PDF" }, { title: tr("Pipa varian terbuka 'Ladang'", "The 'Ladang' open variant pipeline"), meta: tr("Perangkat lunak · Mar", "Software · Mar"), tag: tr("Kode", "Code"), href: href("pubs"), cta: tr("Repo", "Repo") }] }),
        newsletter(R, { title: tr("Ringkasan riset bulanan", "Monthly research digest"), text: tr("Satu email, temuan utama, tanpa jargon.", "One email, key findings, no jargon."), ph: "email@institusi.ac.id", submit: tr("Ikuti", "Subscribe") }),
      ],
      facilities: () => [
        pageHead(R, { eyebrow: tr("Fasilitas", "Facilities"), title: tr("Peralatan & ruang lab", "Equipment & lab spaces") }),
        specs(R, { title: tr("Peralatan utama", "Core equipment"), rows: [[tr("Sekuensing", "Sequencing"), tr("2 unit sekuensing generasi baru", "2 next-generation sequencers")], ["qPCR", tr("4 unit, 384 sumur", "4 units, 384-well")], [tr("Komputasi", "Compute"), tr("Klaster 1.024 inti, 2 PB", "1,024-core cluster, 2 PB")], [tr("Rumah kaca", "Greenhouse"), tr("600 m², kontrol iklim", "600 m², climate controlled")]], image: asset("v3d-flask"), alt: tr("Peralatan laboratorium", "Lab equipment") }),
        mosaic(R, { title: tr("Tur visual", "Visual tour"), images: [[asset("v3d-flask"), tr("Lab basah", "Wet lab")], [asset("v3d-flask-violet"), tr("Lab enzim", "Enzyme lab")], [asset("v3d-dashboard"), tr("Ruang data", "Data room")]] }),
      ],
      services: () => [
        pageHead(R, { eyebrow: tr("Layanan uji", "Testing services"), title: tr("Uji untuk industri & peneliti", "Testing for industry & researchers") }),
        tableD(R, { title: tr("Daftar layanan", "Service list"), columns: [tr("Layanan", "Service"), tr("Waktu", "Turnaround"), tr("Mulai", "From")], rows: [[tr("Identifikasi varietas (DNA)", "Variety ID (DNA)"), tr("7 hari", "7 days"), "Rp1,2 jt"], [tr("Profil mikroba tanah", "Soil microbe profile"), tr("14 hari", "14 days"), "Rp3,5 jt"], [tr("Uji aktivitas enzim", "Enzyme activity assay"), tr("5 hari", "5 days"), "Rp900 rb"], [tr("Analisis data sekuensing", "Sequencing data analysis"), tr("10 hari", "10 days"), "Rp2,8 jt"]], note: tr("Harga contoh per sampel.", "Sample prices per specimen.") }),
        zigzag(R, { title: tr("Cara mengirim sampel", "How to send samples"), steps: [[tr("Isi formulir", "Fill in the form"), tr("Kami kirim kode sampel dan kit.", "We send sample codes and a kit.")], [tr("Kirim dingin", "Ship cold"), tr("Gunakan kotak es; maks. 48 jam.", "Use an ice box; max 48 hours.")], [tr("Terima laporan", "Get the report"), tr("PDF + data mentah.", "PDF + raw data.")]] }),
      ],
      team: () => [
        pageHead(R, { eyebrow: tr("Tim", "Team"), title: tr("Peneliti utama", "Principal investigators") }),
        withFx(R, teamCards(pro(R), tr, { title: tr("Kepala kelompok", "Group leads"), members: [{ name: "Dr. Anggraini Kusuma", role: tr("Direktur & Genomik", "Director & Genomics"), photo: asset("v3d-face-4") }, { name: "Dr. Rizal Pane", role: tr("Mikrobioma", "Microbiome"), photo: asset("v3d-face-5") }, { name: "Dr. Yuliana Sari", role: tr("Enzim", "Enzymes"), photo: asset("v3d-face-2") }, { name: "Haris Munandar, M.Sc.", role: tr("Bioinformatika", "Bioinformatics"), photo: asset("v3d-face-1") }] })),
        pullQuote(R, { text: tr("Data yang tidak bisa diulang bukanlah temuan, melainkan cerita.", "Data that can't be reproduced isn't a finding, it's a story."), name: "Dr. Anggraini Kusuma", role: tr("Direktur", "Director") }),
      ],
      careers: () => [
        pageHead(R, { eyebrow: tr("Karier", "Careers"), title: tr("Bergabung dengan tim riset", "Join the research team") }),
        indexList(R, { title: tr("Posisi terbuka", "Open positions"), rows: [{ title: tr("Peneliti pascadoktoral, genomik", "Postdoc, genomics"), meta: tr("Kontrak 2 tahun", "2-year contract"), href: href("contact"), cta: tr("Lamar", "Apply") }, { title: tr("Teknisi laboratorium", "Lab technician"), meta: tr("Penuh waktu", "Full time"), href: href("contact"), cta: tr("Lamar", "Apply") }, { title: tr("Magang bioinformatika", "Bioinformatics intern"), meta: tr("6 bulan", "6 months"), href: href("contact"), cta: tr("Lamar", "Apply") }] }),
        faqD(R, { title: tr("Pertanyaan pelamar", "Applicant questions"), items: [[tr("Menerima lulusan S1?", "Bachelor graduates?"), tr("Ya, untuk teknisi dan magang.", "Yes, for technician and intern roles.")], [tr("Ada beasiswa?", "Scholarships?"), tr("Dua beasiswa S2 per tahun.", "Two master's scholarships a year.")], [tr("Bekerja jarak jauh?", "Remote work?"), tr("Untuk posisi data, sebagian.", "Partly, for data roles.")], [tr("Bahasa kerja?", "Working language?"), tr("Indonesia & Inggris.", "Indonesian & English.")]] }),
      ],
      contact: () => [
        pageHead(R, { eyebrow: tr("Kontak", "Contact"), title: tr("Kolaborasi atau kunjungan", "Collaboration or visits") }),
        formD(R, { title: tr("Kirim pesan", "Send a message"), info: [["Email", "riset@arunaya-lab.id"], [tr("Kunjungan", "Visits"), tr("Jumat 13.00, dengan janji", "Fridays 1pm, by appointment")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Institusi", "Institution"), ph: "" }, { kind: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Kolaborasi riset", "Research collaboration"), tr("Layanan uji", "Testing"), tr("Kunjungan", "Visit"), tr("Media", "Press")] }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* -------------- 17. Museum Sains Cakra Semesta (6 hlm) ------------------- */
// Premium: gallery-lightbox, countdown, modal-popup. Library: Tilt + Animate. Retro ceria.

const MP: Palette = { ink: "#2e1065", muted: "#5b4a7a", primary: "#7e22ce", primaryDark: "#581c87", soft: "#f3e8ff", line: "#e9d5ff" };
const M = lookD(MP, { head: "Righteous", body: "Nunito", shape: "retro", radius: 18, bg: "#fdfaff", alt: "#faf5ff", inv: "#2e1065", fx: { tilt: true, animate: "tada" } });

const mFoot = (tr: Tr) =>
  footerD("Cakra Semesta", M, {
    variant: "giant",
    about: tr("Museum sains interaktif untuk anak dan keluarga. 120 alat peraga bisa disentuh.", "An interactive science museum for kids and families. 120 hands-on exhibits."),
    cols: [{ title: tr("Jam buka", "Hours"), items: [tr("Selasa–Minggu 09.00–17.00", "Tue–Sun 9am–5pm"), tr("Senin tutup", "Closed Mondays")] }, { title: tr("Alamat", "Address"), items: ["Jl. Taman Ilmu 3", "+62 22 250 7700"] }],
    social: ["Instagram | https://instagram.com/cakrasemesta", "YouTube | https://youtube.com/@cakrasemesta"],
    copy: tr("© 2026 Museum Sains Cakra Semesta. Konten contoh.", "© 2026 Cakra Semesta Science Museum. Sample content."),
  });

export const scienceMuseum: TemplateContent = {
  brand: "Museum Sains Cakra Semesta",
  pages: [home(), pg("exhibits", ["pameran", "Pameran"], ["exhibitions", "Exhibitions"]), pg("visit", ["kunjungan", "Tiket & Kunjungan"], ["visit", "Tickets & Visit"]), pg("edu", ["edukasi", "Program Sekolah"], ["schools", "School Programmes"]), pg("events", ["acara", "Acara"], ["events", "Events"]), pg("about", ["tentang", "Tentang"], ["about", "About"])],
  build: (key, tr, href) =>
    render(M, key, headerD("Cakra Semesta", M, { variant: "ink", cta: [tr("Beli tiket", "Buy tickets"), href("visit")] }), mFoot(tr), {
      home: () => [
        heroPoster(M, {
          eyebrow: tr("Museum sains interaktif", "Interactive science museum"),
          title: tr("Sentuh, coba, lalu bertanya", "Touch, try, then ask"),
          date: tr("Pameran baru: Tata Surya Kita", "New exhibition: Our Solar System"),
          text: tr("120 alat peraga, planetarium kubah 14 meter, dan lab mini tempat anak membuat roket air sendiri.", "120 hands-on exhibits, a 14-metre dome planetarium and a mini lab where kids build their own water rockets."),
          image: asset("v3d-planet"),
          alt: tr("Planet bercincin", "Ringed planet"),
          actions: [[tr("Beli tiket", "Buy tickets"), href("visit")], [tr("Lihat pameran", "See exhibitions"), href("exhibits"), "outline"]],
        }),
        bento(M, { title: tr("Lima zona penjelajahan", "Five discovery zones"), items: [{ title: tr("Planetarium", "Planetarium"), text: tr("Pertunjukan tiap jam, 30 menit.", "Hourly shows, 30 minutes."), image: asset("v3d-planet"), wide: true, tall: true }, { title: tr("Zona Air", "Water Zone"), text: tr("Bendungan, gelombang, dan pusaran.", "Dams, waves and whirlpools."), icon: "≈" }, { title: tr("Lab Mini", "Mini Lab"), text: tr("Eksperimen 20 menit dengan pemandu.", "20-minute guided experiments."), icon: "⚗", accent: true }, { title: tr("Dino Digital", "Digital Dinos"), text: tr("Kerangka dan rekonstruksi AR.", "Skeletons and AR reconstructions."), icon: "◭", wide: true }] }),
        galleryLb(M, { eyebrow: tr("Intip dulu", "Sneak peek"), title: tr("Suasana museum", "Inside the museum"), images: [[asset("v3d-planet"), tr("Kubah planetarium", "Planetarium dome")], [asset("v3d-planet-teal"), tr("Zona antariksa", "Space zone")], [asset("v3d-flask-violet"), tr("Lab mini", "Mini lab")], [asset("v3d-lake-dusk"), tr("Zona air", "Water zone")], [asset("v3d-dashboard-dark"), tr("Galeri digital", "Digital gallery")], [asset("v3d-tree"), tr("Taman sains", "Science garden")]] }),
        offer(M, { eyebrow: tr("Hemat untuk keluarga", "Family savings"), title: tr("Tiket keluarga: 2 dewasa + 2 anak", "Family ticket: 2 adults + 2 kids"), text: tr("Rp180.000 sudah termasuk planetarium.", "Rp180,000 including the planetarium."), trigger: tr("Detail tiket keluarga", "Family ticket details"), modalTitle: tr("Tiket keluarga", "Family ticket"), body: tr("Berlaku Selasa–Jumat. Anak di bawah 3 tahun gratis. Tunjukkan kode QR di loket.", "Valid Tuesday–Friday. Under-3s free. Show the QR code at the desk."), cta: tr("Beli sekarang", "Buy now"), href: href("visit") }),
      ],
      exhibits: () => [
        pageHead(M, { eyebrow: tr("Pameran", "Exhibitions"), title: tr("Yang sedang dipamerkan", "Now showing"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Pameran", "Exhibitions"), ""]] }),
        splitPanel(M, { eyebrow: tr("Pameran utama", "Main exhibition"), title: tr("Tata Surya Kita", "Our Solar System"), text: tr("Berjalan dari Matahari ke Neptunus dalam skala 1:1 miliar. Timbang berat badan Anda di tiap planet.", "Walk from the Sun to Neptune at 1:1 billion scale. Weigh yourself on each planet."), bullets: [tr("Sampai 31 Maret 2027", "Until 31 March 2027"), tr("Cocok untuk usia 6+", "Suited to ages 6+")], image: asset("v3d-planet-teal"), alt: tr("Planet", "Planet") }),
        cardsD(M, { title: tr("Pameran tetap", "Permanent exhibitions"), items: [{ icon: "⚡", title: tr("Listrik & Magnet", "Electricity & Magnets"), text: tr("Generator engkol dan bola plasma.", "Hand-crank generators and plasma balls.") }, { icon: "◎", title: tr("Cahaya & Warna", "Light & Colour"), text: tr("Ruang cermin dan prisma raksasa.", "Mirror room and giant prisms.") }, { icon: "♪", title: tr("Bunyi", "Sound"), text: tr("Tabung gema dan gamelan sains.", "Echo tubes and science gamelan.") }] }),
      ],
      visit: () => [
        pageHead(M, { eyebrow: tr("Kunjungan", "Visit"), title: tr("Tiket & jam buka", "Tickets & hours") }),
        tableD(M, { title: tr("Harga tiket", "Ticket prices"), columns: [tr("Kategori", "Category"), tr("Hari kerja", "Weekdays"), tr("Akhir pekan", "Weekends")], rows: [[tr("Dewasa", "Adult"), "Rp60.000", "Rp75.000"], [tr("Anak 3–12", "Child 3–12"), "Rp40.000", "Rp50.000"], [tr("Planetarium", "Planetarium"), "+Rp20.000", "+Rp20.000"], [tr("Keluarga (2+2)", "Family (2+2)"), "Rp180.000", "—"]] }),
        locations(M, { title: tr("Cara ke museum", "Getting here"), image: asset("v3d-map-blue"), places: [[tr("Pintu utama", "Main entrance"), "Jl. Taman Ilmu 3", tr("Selasa–Minggu 09.00–17.00", "Tue–Sun 9am–5pm")], [tr("Parkir bus sekolah", "School bus parking"), tr("Gerbang timur", "East gate"), tr("Wajib reservasi", "Booking required")]] }),
      ],
      edu: () => [
        pageHead(M, { eyebrow: tr("Program sekolah", "School programmes"), title: tr("Kunjungan belajar sesuai kurikulum", "Curriculum-linked school visits") }),
        tabsD(M, { title: tr("Menurut jenjang", "By level"), tabs: [["SD", tr("Tur zona + lab mini 'gaya dan gerak', 2,5 jam.", "Zone tour + 'forces and motion' mini lab, 2.5 hours.")], ["SMP", tr("Planetarium + eksperimen listrik, 3 jam.", "Planetarium + electricity experiments, 3 hours.")], ["SMA", tr("Lokakarya data iklim dan roket air, 4 jam.", "Climate data workshop and water rockets, 4 hours.")]] }),
        formD(M, { title: tr("Reservasi rombongan", "Group booking"), info: [[tr("Minimal", "Minimum"), tr("20 siswa", "20 students")], [tr("Harga", "Price"), tr("Rp35.000/siswa", "Rp35,000/student")]], fields: [{ kind: "input", label: tr("Nama sekolah", "School name"), ph: "" }, { kind: "input", label: tr("Jumlah siswa", "Number of students"), ph: "" }, { kind: "date", label: tr("Tanggal kunjungan", "Visit date") }], submit: tr("Ajukan reservasi", "Request booking") }),
      ],
      events: () => [
        pageHead(M, { eyebrow: tr("Acara", "Events"), title: tr("Malam bintang & lokakarya", "Star nights & workshops") }),
        countdownD(M, { eyebrow: tr("Malam bintang", "Star night"), title: tr("Hujan meteor Geminid", "Geminid meteor shower"), text: tr("Teropong dibuka di atap museum hingga pukul 23.00.", "Telescopes open on the museum roof until 11pm."), target: "2026-12-13T19:00", finished: tr("Sedang berlangsung!", "Happening now!") }),
        timelineD(M, { title: tr("Agenda", "Agenda"), items: [["2 Nov", tr("Lokakarya robot kardus", "Cardboard robot workshop"), tr("Usia 7–12.", "Ages 7–12.")], ["16 Nov", tr("Kuliah umum gunung api", "Volcano public lecture"), tr("Untuk remaja & dewasa.", "For teens & adults.")], ["13 Des", tr("Malam bintang Geminid", "Geminid star night"), tr("Tiket terbatas 200.", "Limited to 200 tickets.")]] }),
      ],
      about: () => [
        pageHead(M, { eyebrow: tr("Tentang", "About"), title: tr("Museum yang boleh disentuh", "A museum you're allowed to touch") }),
        numbers(M, { items: [["2012", tr("Dibuka", "Opened")], ["1,8 jt", tr("Pengunjung", "Visitors")], ["120", tr("Alat peraga", "Exhibits")], ["64", tr("Pemandu sains", "Science explainers")]] }),
        editorial(M, { title: tr("Misi kami", "Our mission"), cols: [[tr("Rasa ingin tahu", "Curiosity"), tr("Setiap anak pulang dengan satu pertanyaan baru.", "Every child leaves with a new question.")], [tr("Terbuka", "Open"), tr("Tiket gratis untuk sekolah di daerah 3T.", "Free tickets for schools in remote areas.")], [tr("Lokal", "Local"), tr("Alat peraga dibuat bengkel kami sendiri.", "Exhibits built in our own workshop.")]] }),
      ],
    }),
};

/* --------------- 18. Cetak Kalcer — merchandise custom (5 hlm) ----------- */
// Premium: before-after, pro-pricing-cards. Library: Tilt + Animate. Brutalis pop.

const CP: Palette = { ink: "#0a0a0a", muted: "#3f3f46", primary: "#e11d48", primaryDark: "#be123c", soft: "#ffe4e6", line: "#fecdd3" };
const C = lookD(CP, { head: "Bebas Neue", body: "Rubik", shape: "brutal", radius: 0, bg: "#ffffff", alt: "#a7f3d0", inv: "#0a0a0a", fx: { tilt: true, animate: "rubberBand" }, upper: true });

const cFoot = (tr: Tr) =>
  footerD("Cetak Kalcer", C, {
    variant: "slim",
    about: tr("Sablon kaos, totebag, mug, dan stiker. Minimal 12 pcs, jadi 5 hari.", "Screen-printed tees, totes, mugs and stickers. Min. 12 pcs, ready in 5 days."),
    social: ["Instagram | https://instagram.com/cetakkalcer", "TikTok | https://tiktok.com/@cetakkalcer", "WhatsApp | https://wa.me/6281234560099"],
    copy: tr("© 2026 Cetak Kalcer. Konten contoh.", "© 2026 Cetak Kalcer. Sample content."),
  });

export const printingMerch: TemplateContent = {
  brand: "Cetak Kalcer",
  pages: [home(), pg("products", ["produk", "Produk"], ["products", "Products"]), pg("how", ["cara-pesan", "Cara Pesan"], ["how-to-order", "How to Order"]), pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) =>
    render(C, key, headerD("Cetak Kalcer", C, { variant: "bar", cta: [tr("Minta penawaran", "Get a quote"), href("contact")] }), cFoot(tr), {
      home: () => [
        heroBrutal(C, {
          sticker: tr("Min. 12 pcs!", "Min. 12 pcs!"),
          title: tr("Merch komunitasmu, dicetak serius", "Your crew's merch, printed seriously"),
          text: tr("Sablon plastisol, DTF, dan bordir untuk band, kampus, kantor, dan acara lari. Kirim desain hari ini, barang jadi 5 hari kerja.", "Plastisol, DTF and embroidery for bands, campuses, offices and fun runs. Send your design today, get it in 5 working days."),
          image: asset("v3d-merch"),
          alt: tr("Kaos dan mug custom", "Custom tee and mug"),
          actions: [[tr("Lihat harga", "See prices"), href("pricing")], [tr("Cara pesan", "How to order"), href("how"), "outline"]],
        }),
        wordBand(C, [tr("Kaos", "Tees"), "Hoodie", "Totebag", tr("Mug", "Mugs"), tr("Stiker", "Stickers"), tr("Topi", "Caps")], { bg: "#e11d48" }),
        beforeAfterD(C, { title: tr("Dari kaos polos jadi identitas", "From blank tee to identity"), before: asset("v3d-shirt-plain"), after: asset("v3d-merch-yellow"), labels: [tr("Polos", "Blank"), tr("Disablon", "Printed")], alt: tr("Kaos sebelum dan sesudah disablon", "Tee before and after printing") }),
        cardsD(C, { title: tr("Yang sering dipesan", "Most ordered"), cols: 4, items: [{ icon: "T", title: tr("Kaos acara", "Event tees"), text: tr("Cotton combed 30s.", "30s combed cotton.") }, { icon: "H", title: "Hoodie", text: tr("Fleece 280 gsm.", "280 gsm fleece.") }, { icon: "B", title: "Totebag", text: tr("Kanvas 12 oz.", "12 oz canvas.") }, { icon: "M", title: tr("Mug", "Mugs"), text: tr("Keramik 11 oz.", "11 oz ceramic.") }] }),
      ],
      products: () => [
        pageHead(C, { eyebrow: tr("Produk", "Products"), title: tr("Pilih bahan, kami cetak", "Pick the blank, we print"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Produk", "Products"), ""]] }),
        catalog(C, { title: tr("Katalog bahan", "Blank catalogue"), items: [{ image: asset("v3d-merch"), title: tr("Kaos Cotton 30s", "30s Cotton Tee"), text: tr("12 warna, S–3XL.", "12 colours, S–3XL."), price: tr("mulai Rp55rb", "from Rp55k"), cta: tr("Pesan", "Order"), href: href("contact") }, { image: asset("v3d-merch-yellow"), title: "Hoodie Fleece", text: tr("8 warna, M–XXL.", "8 colours, M–XXL."), price: tr("mulai Rp145rb", "from Rp145k"), cta: tr("Pesan", "Order"), href: href("contact") }, { image: asset("v3d-shirt-plain"), title: tr("Totebag Kanvas", "Canvas Tote"), text: tr("Natural & hitam.", "Natural & black."), price: tr("mulai Rp35rb", "from Rp35k"), cta: tr("Pesan", "Order"), href: href("contact") }] }),
        tabsD(C, { title: tr("Teknik cetak", "Print methods"), tabs: [[tr("Plastisol", "Plastisol"), tr("Warna tebal, awet, cocok untuk 1–4 warna.", "Bold, durable colour, best for 1–4 colours.")], ["DTF", tr("Full color, foto, gradasi tanpa batas warna.", "Full colour, photos, gradients with no colour limit.")], [tr("Bordir", "Embroidery"), tr("Untuk logo kecil di dada atau topi.", "For small chest logos or caps.")]] }),
      ],
      how: () => [
        pageHead(C, { eyebrow: tr("Cara pesan", "How to order"), title: tr("Empat langkah, lima hari", "Four steps, five days") }),
        zigzag(C, { title: tr("Alurnya", "The flow"), steps: [[tr("Kirim desain", "Send your design"), tr("PNG/AI/PDF. Belum punya? Desainer kami bantu.", "PNG/AI/PDF. No design? Our designer helps."), asset("v3d-merch")], [tr("Mockup & DP", "Mockup & deposit"), tr("Mockup dikirim dalam 24 jam, DP 50%.", "Mockup within 24 hours, 50% deposit."), asset("v3d-merch-yellow")], [tr("Produksi", "Production"), tr("3–5 hari kerja, foto progres dikirim.", "3–5 working days, progress photos sent."), asset("v3d-shirt-plain")]] }),
        faqD(C, { title: tr("Pertanyaan pesanan", "Order questions"), items: [[tr("Minimal pesan?", "Minimum order?"), tr("12 pcs per desain.", "12 pcs per design.")], [tr("Ukuran campur?", "Mixed sizes?"), tr("Boleh, tanpa biaya tambahan.", "Yes, at no extra cost.")], [tr("Kirim ke luar kota?", "Ship out of town?"), tr("Ke seluruh Indonesia.", "Anywhere in Indonesia.")], [tr("Bisa sampel?", "Samples?"), tr("1 pcs sampel Rp75 rb, dipotong saat produksi.", "1 sample for Rp75k, deducted on production.")]] }),
      ],
      pricing: () => [
        pageHead(C, { eyebrow: tr("Harga", "Pricing"), title: tr("Makin banyak, makin murah", "The more you order, the less you pay") }),
        withFx(C, pricingCards(pro(C), tr, { title: tr("Paket kaos sablon", "Printed tee bundles"), text: tr("Harga per pcs, cotton 30s, sablon 1 sisi.", "Per piece, 30s cotton, one-side print."), plans: [{ name: tr("Komunitas", "Crew"), price: "Rp85rb", period: tr("/pcs · 12–47 pcs", "/pc · 12–47 pcs"), text: tr("Untuk band dan klub.", "For bands and clubs."), features: [tr("Sablon 2 warna", "2-colour print"), tr("Mockup gratis", "Free mockup")], cta: { label: tr("Pesan", "Order"), href: href("contact") } }, { name: tr("Acara", "Event"), price: "Rp72rb", period: tr("/pcs · 48–199 pcs", "/pc · 48–199 pcs"), text: tr("Untuk lomba lari & seminar.", "For fun runs & seminars."), features: [tr("Sablon 4 warna", "4-colour print"), tr("Label leher", "Neck label"), tr("Kemasan per ukuran", "Packed by size")], cta: { label: tr("Pesan", "Order"), href: href("contact") }, featured: true }, { name: tr("Korporat", "Corporate"), price: "Rp64rb", period: tr("/pcs · 200+ pcs", "/pc · 200+ pcs"), text: tr("Untuk seragam & gathering.", "For uniforms & gatherings."), features: [tr("Bordir logo opsional", "Optional logo embroidery"), tr("Faktur pajak", "Tax invoice")], cta: { label: tr("Pesan", "Order"), href: href("contact") } }] })),
        tableD(C, { title: tr("Tambahan", "Add-ons"), columns: [tr("Tambahan", "Add-on"), tr("Harga", "Price")], rows: [[tr("Sablon belakang", "Back print"), "+Rp15rb"], [tr("Ukuran 3XL", "Size 3XL"), "+Rp10rb"], [tr("Ekspres 3 hari", "3-day express"), "+20%"]] }),
      ],
      contact: () => [
        pageHead(C, { eyebrow: tr("Kontak", "Contact"), title: tr("Minta penawaran", "Request a quote") }),
        formD(C, { title: tr("Detail pesanan", "Order details"), info: [["WhatsApp", "0812 3456 0099"], [tr("Workshop", "Workshop"), "Jl. Gegerkalong 22, Bandung"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "select", label: tr("Produk", "Product"), ph: tr("Pilih", "Choose"), options: [tr("Kaos", "Tee"), "Hoodie", "Totebag", tr("Mug", "Mug")] }, { kind: "input", label: tr("Jumlah", "Quantity"), ph: "24" }, { kind: "date", label: tr("Butuh tanggal", "Needed by") }], message: tr("Catatan desain", "Design notes"), submit: tr("Kirim", "Send"), formFirst: true }),
      ],
    }),
};

/* --------------- 19. Kilat Wangi — laundry kiloan express (4 hlm) ---------- */
// Premium: pricing. Library: AOS. Pastel bersih.

const KWP: Palette = { ink: "#0f1f3d", muted: "#4b5d7a", primary: "#2563eb", primaryDark: "#1d4ed8", soft: "#dbeafe", line: "#bfdbfe" };
const KW = lookD(KWP, { head: "Poppins", body: "Nunito", shape: "soft", radius: 26, bg: "#f8fbff", alt: "#eaf3ff", inv: "#0f1f3d", fx: { aos: "zoom-in" } });

const kwFoot = (tr: Tr) =>
  footerD("Kilat Wangi", KW, {
    variant: "slim",
    about: tr("Laundry kiloan 6 jam dengan antar-jemput gratis. Buka setiap hari 07.00–21.00.", "6-hour laundry by the kilo with free pickup. Open daily 7am–9pm."),
    social: ["WhatsApp | https://wa.me/6281299990606", "Instagram | https://instagram.com/kilatwangi"],
    copy: tr("© 2026 Kilat Wangi Laundry. Konten contoh.", "© 2026 Kilat Wangi Laundry. Sample content."),
  });

export const laundryKiloanExpress: TemplateContent = {
  brand: "Kilat Wangi Laundry",
  pages: [home(), pg("services", ["layanan", "Layanan & Harga"], ["services", "Services & Prices"]), pg("subscribe", ["langganan", "Langganan"], ["subscription", "Subscription"]), pg("outlets", ["outlet", "Outlet"], ["outlets", "Outlets"])],
  build: (key, tr, href) =>
    render(KW, key, headerD("Kilat Wangi", KW, { variant: "pill", cta: [tr("Jemput sekarang", "Book pickup"), href("outlets")] }), kwFoot(tr), {
      home: () => [
        heroSoft(KW, {
          eyebrow: tr("Selesai 6 jam", "Done in 6 hours"),
          title: tr("Cucian beres, akhir pekan lega", "Laundry sorted, weekend free"),
          text: tr("Dijemput di depan pintu, dicuci terpisah per pelanggan, dilipat rapi, dan diantar kembali di hari yang sama.", "Picked up at your door, washed separately per customer, neatly folded and returned the same day."),
          image: asset("v3d-washer"),
          alt: tr("Mesin cuci", "Washing machine"),
          chips: [tr("Antar-jemput gratis", "Free pickup"), tr("Deterjen hipoalergenik", "Hypoallergenic detergent"), tr("Garansi cuci ulang", "Re-wash guarantee")],
          actions: [[tr("Lihat harga", "See prices"), href("services")], [tr("Langganan bulanan", "Monthly plan"), href("subscribe"), "outline"]],
        }),
        bento(KW, { title: tr("Kenapa Kilat Wangi", "Why Kilat Wangi"), items: [{ title: tr("Satu mesin, satu pelanggan", "One machine per customer"), text: tr("Cucian Anda tidak dicampur dengan milik orang lain.", "Your laundry is never mixed with anyone else's."), icon: "◍", wide: true, accent: true }, { title: tr("6 jam", "6 hours"), text: tr("Masuk pagi, pulang sore.", "In by morning, back by afternoon."), icon: "◷" }, { title: tr("Lacak status", "Track status"), text: tr("Notifikasi WhatsApp tiap tahap.", "WhatsApp alerts at every step."), icon: "✓" }, { title: tr("Wangi pilihan", "Choose your scent"), text: tr("Lavender, melati, atau tanpa pewangi.", "Lavender, jasmine or unscented."), icon: "✿", wide: true }] }),
        numbers(KW, { items: [["6 jam", tr("Waktu selesai", "Turnaround")], ["4", tr("Outlet", "Outlets")], ["18rb+", tr("Pelanggan", "Customers")], ["4,9", "Rating"]] }),
      ],
      services: () => [
        pageHead(KW, { eyebrow: tr("Layanan", "Services"), title: tr("Harga jelas per kilo", "Clear prices per kilo"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Layanan", "Services"), ""]] }),
        tableD(KW, { title: tr("Daftar harga", "Price list"), columns: [tr("Layanan", "Service"), tr("Harga", "Price"), tr("Waktu", "Time")], rows: [[tr("Cuci + lipat", "Wash + fold"), "Rp8.000/kg", tr("24 jam", "24 hrs")], [tr("Cuci + setrika", "Wash + iron"), "Rp11.000/kg", tr("24 jam", "24 hrs")], [tr("Express", "Express"), "Rp16.000/kg", tr("6 jam", "6 hrs")], [tr("Bed cover", "Duvet"), "Rp35.000/pcs", tr("2 hari", "2 days")], [tr("Sepatu", "Shoes"), "Rp45.000/pasang", tr("3 hari", "3 days")]], note: tr("Minimal 3 kg untuk antar-jemput.", "Min. 3 kg for pickup.") }),
        faqD(KW, { title: tr("Pertanyaan umum", "Common questions"), items: [[tr("Pakaian luntur?", "Colour bleeding?"), tr("Kami pisahkan putih dan berwarna.", "We separate whites and colours.")], [tr("Barang hilang?", "Lost items?"), tr("Diganti hingga 10× biaya cuci.", "Reimbursed up to 10× the wash fee.")], [tr("Area antar-jemput?", "Pickup area?"), tr("Radius 5 km dari outlet.", "Within 5 km of an outlet.")], [tr("Bayar?", "Payment?"), tr("Tunai, transfer, QRIS.", "Cash, transfer, QRIS.")]] }),
      ],
      subscribe: () => [
        pageHead(KW, { eyebrow: tr("Langganan", "Subscription"), title: tr("Hemat hingga 25% untuk keluarga & kos", "Save up to 25% for families & boarding houses") }),
        plansD(KW, { title: tr("Paket bulanan", "Monthly plans"), items: [{ plan: tr("Anak Kos", "Student"), price: "Rp180rb", period: tr("/bulan", "/month"), description: tr("25 kg per bulan.", "25 kg a month."), features: [tr("Cuci + lipat", "Wash + fold"), tr("Jemput 2× seminggu", "Pickup twice a week")], buttonText: tr("Pilih", "Choose"), buttonHref: href("outlets") }, { plan: tr("Keluarga", "Family"), price: "Rp390rb", period: tr("/bulan", "/month"), description: tr("50 kg per bulan.", "50 kg a month."), features: [tr("Cuci + setrika", "Wash + iron"), tr("Jemput 3× seminggu", "Pickup 3× a week"), tr("1 bed cover gratis", "1 free duvet")], buttonText: tr("Pilih", "Choose"), buttonHref: href("outlets"), featured: true, badge: tr("Terlaris", "Bestseller") }, { plan: tr("Usaha", "Business"), price: tr("Kustom", "Custom"), period: "", description: tr("Salon, klinik, homestay.", "Salons, clinics, homestays."), features: [tr("Handuk & linen", "Towels & linen"), tr("Faktur bulanan", "Monthly invoice")], buttonText: tr("Hubungi", "Contact"), buttonHref: href("outlets") }] }),
        zigzag(KW, { title: tr("Cara kerja langganan", "How the subscription works"), steps: [[tr("Pilih jadwal", "Pick a schedule"), tr("Hari jemput tetap setiap minggu.", "Fixed pickup days each week."), asset("v3d-washer")], [tr("Taruh tas di depan", "Leave the bag out"), tr("Kurir datang membawa tas kosong pengganti.", "The courier swaps in an empty bag."), asset("v3d-washer-mint")]] }),
      ],
      outlets: () => [
        pageHead(KW, { eyebrow: tr("Outlet", "Outlets"), title: tr("Empat outlet di Bekasi & Jakarta Timur", "Four outlets in Bekasi & East Jakarta") }),
        locations(KW, { title: tr("Temukan outlet terdekat", "Find your nearest outlet"), image: asset("v3d-map-blue"), places: [["Kilat Wangi Galaxy", "Jl. Pulo Ribung Raya 8", "07.00–21.00"], ["Kilat Wangi Rawamangun", "Jl. Pemuda 120", "07.00–21.00"], ["Kilat Wangi Jatiwaringin", "Jl. Raya Jatiwaringin 41", "07.00–21.00"]] }),
        formD(KW, { title: tr("Pesan jemput", "Book a pickup"), info: [["WhatsApp", "0812 9999 0606"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Alamat", "Address"), ph: "" }, { kind: "date", label: tr("Waktu jemput", "Pickup time"), mode: "datetime-local" }], submit: tr("Jemput cucian saya", "Pick up my laundry") }),
      ],
    }),
};

/* --------------- 20. Presensia — SaaS HR & absensi (10 hlm) --------------- */
// Premium: pricing-switch, comparison-table, mega-menu, typewriter, pro-testimonials-wall, stats-counter, back-to-top.
// Library: AOS + Animate + Tilt. Kaca (glassmorphism).

const HP: Palette = { ink: "#111437", muted: "#4f5578", primary: "#6366f1", primaryDark: "#4338ca", soft: "#e0e7ff", line: "#c7d2fe" };
const H = lookD(HP, { head: "Plus Jakarta Sans", body: "Inter", shape: "glass", radius: 20, bg: "#f7f7ff", alt: "#eef0ff", inv: "#111437", fx: { aos: "fade-up", animate: "fadeInDown", tilt: true } });

const hFoot = (tr: Tr) =>
  footerD("Presensia", H, {
    variant: "columns",
    about: tr("Aplikasi HR untuk absensi, cuti, dan payroll UMKM hingga perusahaan menengah.", "HR software for attendance, leave and payroll from small to mid-size companies."),
    cols: [
      { title: tr("Produk", "Product"), items: [tr("Absensi", "Attendance"), "Payroll", tr("Aplikasi mobile", "Mobile app"), tr("Integrasi", "Integrations")] },
      { title: tr("Perusahaan", "Company"), items: [tr("Pelanggan", "Customers"), tr("Sumber daya", "Resources"), tr("Kontak", "Contact")] },
      { title: tr("Bantuan", "Support"), items: ["halo@presensia.id", "+62 21 3000 7272"] },
    ],
    social: ["LinkedIn | https://linkedin.com/company/presensia", "YouTube | https://youtube.com/@presensia", "Instagram | https://instagram.com/presensia"],
    copy: tr("© 2026 Presensia. Konten contoh.", "© 2026 Presensia. Sample content."),
    extra: [backTop(H, tr("Kembali ke atas", "Back to top"))],
  });

export const saasHrAbsensi: TemplateContent = {
  brand: "Presensia",
  pages: [
    home(),
    pg("features", ["fitur", "Fitur"], ["features", "Features"]),
    pg("attendance", ["absensi", "Absensi"], ["attendance", "Attendance"]),
    pg("payroll", ["payroll", "Payroll"], ["payroll", "Payroll"]),
    pg("mobile", ["aplikasi", "Aplikasi Mobile"], ["mobile-app", "Mobile App"]),
    pg("integrations", ["integrasi", "Integrasi"], ["integrations", "Integrations"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("customers", ["pelanggan", "Pelanggan"], ["customers", "Customers"]),
    pg("resources", ["sumber-daya", "Sumber Daya"], ["resources", "Resources"]),
    pg("demo", ["demo", "Jadwalkan Demo"], ["book-a-demo", "Book a Demo"]),
  ],
  build: (key, tr, href) => {
    const nav = megaD(H, [`${tr("Produk", "Product")} | ${href("features")}`, `- ${tr("Absensi", "Attendance")} | ${tr("GPS, selfie, shift", "GPS, selfie, shifts")} | ${href("attendance")}`, `- Payroll | ${tr("Gaji, PPh 21, BPJS", "Salary, tax, insurance")} | ${href("payroll")}`, `- ${tr("Aplikasi mobile", "Mobile app")} | ${tr("Android & iOS", "Android & iOS")} | ${href("mobile")}`, `- ${tr("Integrasi", "Integrations")} | ${tr("Akuntansi & bank", "Accounting & banking")} | ${href("integrations")}`, `${tr("Perusahaan", "Company")} | ${href("customers")}`, `- ${tr("Pelanggan", "Customers")} | ${tr("Cerita pengguna", "User stories")} | ${href("customers")}`, `- ${tr("Sumber daya", "Resources")} | ${tr("Panduan & template", "Guides & templates")} | ${href("resources")}`, `- ${tr("Harga", "Pricing")} | ${tr("Mulai Rp15rb/karyawan", "From Rp15k/employee")} | ${href("pricing")}`], tr("Jadwalkan demo", "Book a demo"), href("demo"));
    return render(H, key, headerD("Presensia", H, { variant: "pill", nav, sticky: true }), hFoot(tr), {
      home: () => [
        heroGlass(H, {
          eyebrow: tr("HRIS untuk tim Indonesia", "HRIS for Indonesian teams"),
          title: "",
          titleNode: typerD(H, tr("Urus", "Handle"), [tr("absensi", "attendance"), tr("cuti", "leave"), "payroll", tr("lembur", "overtime")], { size: 52, color: "#ffffff" }),
          text: tr("Absen dengan selfie & GPS, cuti disetujui dari ponsel, slip gaji dan PPh 21 terhitung otomatis setiap tanggal 25.", "Clock in with selfie & GPS, approve leave from your phone, payslips and income tax calculated automatically every 25th."),
          gradient: ["#4338ca", "#06b6d4"],
          chips: [tr("Uji coba 14 hari", "14-day trial"), tr("Tanpa kartu kredit", "No credit card"), tr("Data di Indonesia", "Data hosted in Indonesia")],
          image: asset("v3d-dashboard"),
          alt: tr("Dasbor HR", "HR dashboard"),
          actions: [[tr("Coba gratis", "Start free"), href("demo"), "light"], [tr("Lihat harga", "See pricing"), href("pricing"), "dark"]],
        }),
        counterD(H, { items: [tr("3.200 | Perusahaan", "3,200 | Companies"), tr("186rb | Karyawan aktif", "186k | Active employees"), tr("12 jt | Absen per bulan", "12M | Clock-ins a month"), tr("99,95% | Uptime", "99.95% | Uptime")] }),
        bento(H, { eyebrow: tr("Semua dalam satu", "All in one"), title: tr("Dari jam masuk sampai slip gaji", "From clock-in to payslip"), items: [{ title: tr("Absensi anti titip", "No buddy-punching"), text: tr("Selfie dengan deteksi wajah dan radius GPS kantor.", "Selfie with face detection and office GPS radius."), image: asset("v3d-dashboard"), wide: true, tall: true }, { title: tr("Shift fleksibel", "Flexible shifts"), text: tr("Pola shift pabrik dan ritel.", "Factory and retail shift patterns."), icon: "◷" }, { title: tr("Payroll 1 klik", "One-click payroll"), text: tr("PPh 21 TER dan BPJS otomatis.", "Automatic tax and social insurance."), icon: "Rp", accent: true }, { title: tr("Cuti & lembur", "Leave & overtime"), text: tr("Persetujuan berjenjang via ponsel.", "Multi-level approvals on mobile."), icon: "✓", wide: true }] }),
        withFx(H, testimonialsWall(pro(H), tr, { title: tr("Tim HR yang pulang tepat waktu", "HR teams who leave on time"), score: 4.8, caption: tr("dari 1.200 ulasan", "from 1,200 reviews"), quotes: [{ text: tr("Rekap absen 400 karyawan dulu 3 hari. Sekarang 10 menit.", "Attendance recap for 400 staff used to take 3 days. Now 10 minutes."), name: "Novita Hapsari", role: tr("HR Manager, Pabrik Garmen Sejahtera", "HR Manager, Sejahtera Garments"), avatar: asset("v3d-face-2") }, { text: tr("Karyawan toko absen dari ponsel, tidak ada lagi mesin sidik jari rusak.", "Store staff clock in by phone — no more broken fingerprint machines."), name: "Daniel Siregar", role: tr("COO, Toko Kebutuhan Rumah", "COO, Home Needs Stores"), avatar: asset("v3d-face-5") }, { text: tr("Slip gaji terkirim otomatis, pertanyaan ke HR turun separuh.", "Payslips go out automatically; questions to HR halved."), name: "Retno Ayu", role: tr("Founder, Kopi Jalan Kecil", "Founder, Kopi Jalan Kecil"), avatar: asset("v3d-face-4") }] })),
      ],
      features: () => [
        pageHead(H, { eyebrow: tr("Fitur", "Features"), title: tr("Satu aplikasi untuk seluruh siklus HR", "One app for the whole HR cycle"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Fitur", "Features"), ""]] }),
        cardsD(H, { title: tr("Modul", "Modules"), items: [{ icon: "◉", title: tr("Absensi", "Attendance"), text: tr("Selfie, GPS, QR, dan kios tablet.", "Selfie, GPS, QR and tablet kiosk.") }, { icon: "Rp", title: "Payroll", text: tr("Komponen gaji tanpa batas.", "Unlimited pay components.") }, { icon: "☰", title: tr("Data karyawan", "Employee data"), text: tr("Kontrak, dokumen, riwayat jabatan.", "Contracts, documents, job history.") }, { icon: "✈", title: tr("Cuti & izin", "Leave"), text: tr("Saldo otomatis sesuai kebijakan.", "Balances follow your policy.") }, { icon: "◷", title: tr("Lembur", "Overtime"), text: tr("Perhitungan sesuai regulasi.", "Calculated per regulation.") }, { icon: "▤", title: tr("Laporan", "Reports"), text: tr("Ekspor Excel & PDF.", "Export to Excel & PDF.") }] }),
        compareD(H, { title: tr("Presensia vs cara manual", "Presensia vs the manual way"), columns: [tr("Spreadsheet", "Spreadsheet"), tr("Mesin sidik jari", "Fingerprint machine"), "Presensia"], rows: [tr("Absen dari lapangan | tidak | tidak | ya", "Clock in from the field | no | no | yes"), tr("Payroll otomatis | tidak | tidak | ya", "Automatic payroll | no | no | yes"), tr("Persetujuan cuti mobile | tidak | tidak | ya", "Mobile leave approvals | no | no | yes"), tr("Rekap real-time | tidak | ya | ya", "Real-time recap | no | yes | yes")], highlight: 3, caption: tr("Perbandingan fitur", "Feature comparison") }),
      ],
      attendance: () => [
        pageHead(H, { eyebrow: tr("Absensi", "Attendance"), title: tr("Absen di mana saja, tetap terverifikasi", "Clock in anywhere, still verified") }),
        splitPanel(H, { title: tr("Selfie + GPS + jadwal", "Selfie + GPS + schedule"), text: tr("Karyawan hanya bisa absen di radius kantor atau lokasi proyek yang ditentukan, dengan foto yang dicocokkan otomatis.", "Staff can only clock in within the office radius or assigned project site, with photos matched automatically."), bullets: [tr("Mode offline untuk area sinyal lemah", "Offline mode for weak signal areas"), tr("Kios tablet untuk pabrik", "Tablet kiosk for factories"), tr("Pengingat absen otomatis", "Automatic clock-in reminders")], image: asset("v3d-dashboard"), alt: tr("Absensi", "Attendance"), reverse: true }),
        tabsD(H, { title: tr("Untuk setiap jenis tim", "For every kind of team"), tabs: [[tr("Kantor", "Office"), tr("Jam kerja tetap, WFH terjadwal.", "Fixed hours, scheduled WFH.")], [tr("Lapangan", "Field"), tr("Kunjungan klien dengan check-in lokasi.", "Client visits with location check-ins.")], [tr("Pabrik & ritel", "Factory & retail"), tr("Shift 3 regu, tukar shift via aplikasi.", "3-crew shifts, swap shifts in the app.")]] }),
      ],
      payroll: () => [
        pageHead(H, { eyebrow: "Payroll", title: tr("Gaji tepat, tanggal 25, tanpa begadang", "Accurate pay on the 25th, no late nights") }),
        zigzag(H, { title: tr("Siklus payroll", "Payroll cycle"), steps: [[tr("Tarik data absen", "Pull attendance"), tr("Lembur, potongan, dan tunjangan otomatis.", "Overtime, deductions and allowances auto-filled."), asset("v3d-dashboard")], [tr("Tinjau & setujui", "Review & approve"), tr("Bandingkan dengan bulan lalu.", "Compare with last month."), asset("v3d-dashboard-dark")], [tr("Transfer & slip", "Transfer & payslips"), tr("File transfer massal + slip ke email karyawan.", "Bulk transfer file + payslips to staff email."), asset("v3d-coins")]] }),
        specs(H, { title: tr("Kepatuhan", "Compliance"), rows: [["PPh 21", tr("Metode TER & gross-up", "TER & gross-up methods")], ["BPJS", tr("Kesehatan & Ketenagakerjaan", "Health & employment")], ["THR", tr("Prorata otomatis", "Automatic pro-rata")]] }),
      ],
      mobile: () => [
        pageHead(H, { eyebrow: tr("Aplikasi mobile", "Mobile app"), title: tr("HR di saku setiap karyawan", "HR in every employee's pocket") }),
        cardsD(H, { title: tr("Yang bisa dilakukan karyawan", "What employees can do"), inv: true, items: [{ icon: "◉", title: tr("Absen", "Clock in"), text: tr("Selfie dalam 3 detik.", "Selfie in 3 seconds.") }, { icon: "✈", title: tr("Ajukan cuti", "Request leave"), text: tr("Lihat saldo dan status.", "See balance and status.") }, { icon: "Rp", title: tr("Slip gaji", "Payslips"), text: tr("Terkunci PIN.", "PIN-protected.") }] }),
        videoD(H, { title: tr("Tur aplikasi 90 detik", "90-second app tour"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", vtitle: "Presensia mobile tour" }),
      ],
      integrations: () => [
        pageHead(H, { eyebrow: tr("Integrasi", "Integrations"), title: tr("Terhubung dengan alat yang sudah Anda pakai", "Connects with the tools you already use") }),
        editorial(H, { title: tr("Kategori integrasi", "Integration categories"), cols: [[tr("Akuntansi", "Accounting"), tr("Jurnal gaji otomatis ke software akuntansi.", "Payroll journals sent to accounting software.")], [tr("Bank", "Banking"), tr("File transfer massal format bank lokal.", "Bulk transfer files in local bank formats.")], [tr("Chat", "Chat"), tr("Notifikasi persetujuan di aplikasi pesan.", "Approval alerts in messaging apps.")], ["API", tr("REST API dan webhook untuk tim IT.", "REST API and webhooks for IT teams.")]] }),
        faqD(H, { title: tr("Pertanyaan teknis", "Technical questions"), items: [[tr("Ada API publik?", "Public API?"), tr("Ya, dokumentasi terbuka.", "Yes, with open documentation.")], [tr("Impor data lama?", "Import old data?"), tr("Dari Excel, dibantu tim onboarding.", "From Excel, with onboarding support.")], ["SSO?", tr("Tersedia di paket Enterprise.", "Available on Enterprise.")], [tr("Lokasi server?", "Server location?"), tr("Pusat data di Indonesia.", "Data centres in Indonesia.")]] }),
      ],
      pricing: () => [
        pageHead(H, { eyebrow: tr("Harga", "Pricing"), title: tr("Bayar per karyawan aktif", "Pay per active employee") }),
        priceSwitchD(H, { title: tr("Pilih paket", "Choose a plan"), plans: [tr("Starter | Rp15rb | Rp150rb | Absensi; Cuti & izin; Hingga 50 karyawan | Mulai uji coba", "Starter | Rp15k | Rp150k | Attendance; Leave; Up to 50 employees | Start trial"), tr("Growth | Rp29rb | Rp290rb | Semua Starter; Payroll & PPh 21; Shift & lembur | Coba Growth", "Growth | Rp29k | Rp290k | Everything in Starter; Payroll & tax; Shifts & overtime | Try Growth"), tr("Enterprise | Rp45rb | Rp450rb | Semua Growth; SSO & API; Manajer akun | Hubungi sales", "Enterprise | Rp45k | Rp450k | Everything in Growth; SSO & API; Account manager | Contact sales")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 17%", "Save 17%"), tr("/karyawan/bln", "/employee/mo"), tr("/karyawan/thn", "/employee/yr")], href: href("demo") }),
        faqD(H, { title: tr("Soal tagihan", "Billing questions"), items: [[tr("Karyawan resign dihitung?", "Do leavers count?"), tr("Tidak, hanya karyawan aktif bulan itu.", "No, only active employees that month.")], [tr("Minimal karyawan?", "Minimum headcount?"), tr("5 karyawan.", "5 employees.")], [tr("Bisa ganti paket?", "Switch plans?"), tr("Kapan saja, prorata.", "Any time, pro-rated.")], [tr("Faktur pajak?", "Tax invoices?"), tr("Ya, setiap bulan.", "Yes, monthly.")]] }),
      ],
      customers: () => [
        pageHead(H, { eyebrow: tr("Pelanggan", "Customers"), title: tr("Dipakai pabrik, toko, dan startup", "Used by factories, shops and startups") }),
        magazine(H, { title: tr("Cerita pelanggan", "Customer stories"), read: tr("Baca cerita", "Read story"), lead: { image: asset("v3d-dashboard"), tag: tr("Manufaktur", "Manufacturing"), date: "2026", title: tr("Pabrik Garmen Sejahtera memangkas rekap absen dari 3 hari jadi 10 menit", "Sejahtera Garments cut attendance recaps from 3 days to 10 minutes"), text: tr("400 operator, 3 shift, kios tablet di gerbang.", "400 operators, 3 shifts, tablet kiosks at the gate."), href: href("customers") }, items: [{ image: asset("v3d-dashboard-dark"), tag: tr("Ritel", "Retail"), date: "2026", title: tr("28 toko, satu jadwal shift", "28 stores, one shift schedule"), text: "", href: href("customers") }, { image: asset("v3d-coins"), tag: "F&B", date: "2025", title: tr("Payroll kedai kopi tanpa spreadsheet", "Coffee-chain payroll without spreadsheets"), text: "", href: href("customers") }] }),
        numbers(H, { inv: true, items: [["3.200", tr("Perusahaan", "Companies")], ["92%", tr("Perpanjang tahun kedua", "Renew in year two")], ["10 mnt", tr("Rata-rata rekap absen", "Average attendance recap")]] }),
      ],
      resources: () => [
        pageHead(H, { eyebrow: tr("Sumber daya", "Resources"), title: tr("Panduan & template HR gratis", "Free HR guides & templates") }),
        indexList(H, { title: tr("Unduhan populer", "Popular downloads"), rows: [{ title: tr("Template kebijakan cuti", "Leave policy template"), meta: "DOCX · 2 hlm", tag: tr("Gratis", "Free"), href: href("resources"), cta: tr("Unduh", "Download") }, { title: tr("Kalkulator PPh 21 TER", "Income tax calculator"), meta: "XLSX", tag: tr("Gratis", "Free"), href: href("resources"), cta: tr("Unduh", "Download") }, { title: tr("Panduan menyusun pola shift", "Shift pattern guide"), meta: "PDF · 14 hlm", href: href("resources"), cta: tr("Unduh", "Download") }] }),
        newsletter(H, { title: tr("Buletin HR bulanan", "Monthly HR newsletter"), text: tr("Perubahan regulasi dan tips praktis.", "Regulation updates and practical tips."), ph: "email@perusahaan.id", submit: tr("Langganan", "Subscribe") }),
      ],
      demo: () => [
        pageHead(H, { eyebrow: tr("Demo", "Demo"), title: tr("Lihat Presensia dengan data perusahaan Anda", "See Presensia with your company's data") }),
        formD(H, { title: tr("Jadwalkan demo 30 menit", "Book a 30-minute demo"), info: [[tr("Telepon", "Phone"), "+62 21 3000 7272"], ["Email", "sales@presensia.id"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: tr("Email kantor", "Work email"), ph: "", type: "email" }, { kind: "select", label: tr("Jumlah karyawan", "Headcount"), ph: tr("Pilih", "Choose"), options: ["5–50", "51–200", "201–1.000", "1.000+"] }, { kind: "date", label: tr("Waktu demo", "Demo time"), mode: "datetime-local" }], submit: tr("Jadwalkan", "Book demo") }),
        ctaD(H, { title: tr("Atau langsung coba 14 hari", "Or try it free for 14 days"), actions: [[tr("Buat akun", "Create account"), href("demo")]], tone: "primary" }),
      ],
    });
  },
};
