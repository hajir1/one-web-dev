import { asset } from "../../../assets";
import type { Palette } from "../../../build";
import type { TemplateContent, Tr } from "../../../types";
import {
  backTop,
  bento,
  beforeAfterD,
  cardsD,
  catalog,
  compareD,
  counterD,
  ctaD,
  editorial,
  faqD,
  footerD,
  formD,
  galleryLb,
  headerD,
  heroBento,
  heroBrutal,
  heroGlass,
  heroSoft,
  heroSplitScreen,
  home,
  indexList,
  locations,
  lookD,
  magazine,
  articleBody,
  megaD,
  mosaic,
  newsletter,
  noticeD,
  numbers,
  offer,
  pageHead,
  pg,
  plansD,
  priceSwitchD,
  pro,
  render,
  sliderD,
  specs,
  splitPanel,
  tableD,
  tabsD,
  timelineD,
  withFx,
  wordBand,
  zigzag,
  countdownD,
  marqueeD,
} from "./kitD";
import { portfolioMosaic, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";

/* ================================================================== */
/* Template v3 D1–D5: Blog kuliner (Free), Desa digital, Dinas           */
/* pariwisata, Asuransi jiwa & kesehatan, Asuransi kendaraan.            */
/* ================================================================== */

/* -------------- 1. Dapur Lirih — blog kuliner (FREE, 4 hlm) ----------- */
// Hanya elemen & preset gratis; library: AOS.

const KP: Palette = { ink: "#3b1d0e", muted: "#7c5a48", primary: "#c2410c", primaryDark: "#9a3412", soft: "#ffedd5", line: "#fed7aa" };
const K = lookD(KP, { head: "Fraunces", body: "Nunito", shape: "soft", radius: 28, bg: "#fffaf5", alt: "#fff1e6", inv: "#3b1d0e", fx: { aos: "fade-up" } });

const kFoot = (tr: Tr) =>
  footerD("Dapur Lirih", K, {
    variant: "columns",
    about: tr("Catatan dapur rumahan: resep yang sudah dicoba berkali-kali, cerita pasar, dan perjalanan mencari rasa.", "Notes from a home kitchen: recipes tested many times, market stories and trips in search of flavour."),
    cols: [
      { title: tr("Jelajah", "Explore"), items: [tr("Resep harian", "Everyday recipes"), tr("Jajanan pasar", "Market snacks"), tr("Catatan perjalanan", "Travel notes")] },
      { title: tr("Kontak", "Contact"), items: ["halo@dapurlirih.id", tr("Kolaborasi & liputan", "Collabs & features")] },
    ],
    social: ["Instagram | https://instagram.com/dapurlirih", "YouTube | https://youtube.com/@dapurlirih", "Pinterest | https://pinterest.com/dapurlirih"],
    copy: tr("© 2026 Dapur Lirih. Konten contoh.", "© 2026 Dapur Lirih. Sample content."),
  });

export const blogCatatanKuliner: TemplateContent = {
  brand: "Dapur Lirih",
  pages: [home(), pg("recipes", ["resep", "Resep"], ["recipes", "Recipes"]), pg("trips", ["jelajah-rasa", "Jelajah Rasa"], ["food-trips", "Food Trips"]), pg("about", ["tentang", "Tentang"], ["about", "About"])],
  build: (key, tr, href) =>
    render(K, key, headerD("Dapur Lirih", K, { variant: "pill", cta: [tr("Resep terbaru", "Latest recipes"), href("recipes")] }), kFoot(tr), {
      home: () => [
        heroSoft(K, {
          eyebrow: tr("Blog dapur rumahan", "A home-kitchen blog"),
          title: tr("Masak pelan-pelan, makan bersama-sama", "Cook slowly, eat together"),
          text: tr("Resep rumahan yang ditulis lengkap dengan takaran, waktu, dan kegagalan yang pernah terjadi — supaya dapur Anda tidak perlu mengulanginya.", "Home recipes written with full measurements, timings and the failures we already made — so your kitchen doesn't have to."),
          image: asset("v3d-food-hero"),
          alt: tr("Semangkuk sayur hangat", "A bowl of warm vegetables"),
          chips: [tr("120+ resep", "120+ recipes"), tr("Diuji 3 kali", "Tested 3 times"), tr("Bahan pasar", "Market produce")],
          actions: [[tr("Lihat resep", "See recipes"), href("recipes")], [tr("Cerita perjalanan", "Travel stories"), href("trips"), "outline"]],
        }),
        bento(K, {
          eyebrow: tr("Minggu ini", "This week"),
          title: tr("Apa yang sedang mengepul di dapur", "What's steaming in the kitchen"),
          items: [
            { title: tr("Sayur asem ala Mbah Tum", "Grandma Tum's tamarind soup"), text: tr("Asam jawa, melinjo, dan kacang panjang — segar untuk siang yang terik.", "Tamarind, melinjo and long beans — refreshing on a hot afternoon."), image: asset("v3d-food-green"), wide: true, meta: tr("45 menit · 6 porsi", "45 min · serves 6") },
            { title: tr("Tips minggu ini", "Tip of the week"), text: tr("Sangrai kelapa parut sampai kuning keemasan sebelum dibuat serundeng.", "Toast grated coconut until golden before making serundeng."), icon: "✶", accent: true },
            { title: tr("Pasar Kamis", "Thursday market"), text: tr("Belimbing wuluh sedang murah — waktunya bikin sambal.", "Bilimbi is cheap right now — time for sambal."), icon: "◎" },
            { title: tr("Kue lumpur kentang", "Potato custard cakes"), text: tr("Lembut, wangi pandan, cetakan biasa juga bisa.", "Soft, pandan-scented, works in a regular mould."), icon: "◐", meta: tr("Favorit pembaca", "Reader favourite") },
            { title: tr("Bekal anak sekolah", "School lunchboxes"), text: tr("Lima menu yang bisa disiapkan malam sebelumnya.", "Five menus you can prep the night before."), icon: "▤" },
          ],
        }),
        magazine(K, {
          eyebrow: tr("Tulisan terbaru", "Latest writing"),
          title: tr("Dari meja makan kami", "From our dining table"),
          read: tr("Baca", "Read"),
          lead: { image: asset("v3d-food-plum"), tag: tr("Esai", "Essay"), date: "12 Okt 2026", title: tr("Mengapa sambal selalu lebih enak di rumah nenek", "Why sambal always tastes better at grandma's"), text: tr("Ulekan batu, cabai yang dijemur sebentar, dan sabar menunggu minyak panas. Kami mencoba membuktikannya.", "A stone mortar, briefly sun-dried chillies and patience with the hot oil. We tried to prove it."), href: href("trips") },
          items: [
            { image: asset("v3d-food-hero"), tag: tr("Resep", "Recipe"), date: "8 Okt", title: tr("Soto bening untuk pemula", "Clear soto for beginners"), text: "", href: href("recipes") },
            { image: asset("v3d-food-green"), tag: tr("Pasar", "Market"), date: "2 Okt", title: tr("Mengenal 7 jenis cabai di pasar", "Seven chillies at the market"), text: "", href: href("trips") },
            { image: asset("v3d-food-plum"), tag: tr("Dapur", "Kitchen"), date: "27 Sep", title: tr("Merawat cobek baru", "Seasoning a new mortar"), text: "", href: href("about") },
          ],
        }),
        newsletter(K, { title: tr("Satu resep setiap Jumat", "One recipe every Friday"), text: tr("Kami kirim resep lengkap + daftar belanja. Tanpa iklan.", "We send a full recipe plus a shopping list. No ads."), ph: tr("Alamat email Anda", "Your email address"), submit: tr("Langganan", "Subscribe") }),
      ],
      recipes: () => [
        pageHead(K, { eyebrow: tr("Arsip resep", "Recipe archive"), title: tr("Resep yang sudah teruji", "Tried-and-tested recipes"), text: tr("Disusun menurut waktu memasak. Semua takaran memakai sendok dan gelas biasa.", "Sorted by cooking time. All measurements use everyday spoons and cups."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Resep", "Recipes"), ""]] }),
        indexList(K, {
          title: tr("Daftar resep", "Recipe index"),
          rows: [
            { title: tr("Nasi liwet teri", "Anchovy liwet rice"), meta: tr("40 menit · mudah", "40 min · easy"), tag: tr("Nasi", "Rice"), text: tr("Dimasak di panci biasa, kerak tipis yang renyah.", "Cooked in a regular pot, with a thin crispy crust."), href: href("recipes"), cta: tr("Buka", "Open") },
            { title: tr("Pepes tahu jamur", "Steamed tofu & mushroom parcels"), meta: tr("35 menit · mudah", "35 min · easy"), tag: tr("Kukus", "Steamed"), href: href("recipes"), cta: tr("Buka", "Open") },
            { title: tr("Rendang daging rumahan", "Home-style beef rendang"), meta: tr("4 jam · sabar", "4 hrs · patience"), tag: tr("Daging", "Meat"), text: tr("Versi kering dengan kelapa sangrai.", "The dry version with toasted coconut."), href: href("recipes"), cta: tr("Buka", "Open") },
            { title: tr("Es cendol gula aren", "Palm-sugar cendol"), meta: tr("50 menit · sedang", "50 min · medium"), tag: tr("Minuman", "Drinks"), href: href("recipes"), cta: tr("Buka", "Open") },
          ],
        }),
        tabsD(K, {
          eyebrow: tr("Dasar dapur", "Kitchen basics"),
          title: tr("Bumbu dasar yang kami simpan di kulkas", "The base pastes we keep in the fridge"),
          tabs: [
            [tr("Bumbu putih", "White paste"), tr("Bawang merah, bawang putih, kemiri. Untuk opor, sayur lodeh, dan tumisan.", "Shallots, garlic, candlenuts. For opor, lodeh and stir-fries.")],
            [tr("Bumbu merah", "Red paste"), tr("Ditambah cabai merah besar dan tomat. Untuk balado dan sambal goreng.", "Add large red chillies and tomato. For balado and sambal goreng.")],
            [tr("Bumbu kuning", "Yellow paste"), tr("Ditambah kunyit, jahe, dan ketumbar. Untuk soto dan ayam goreng.", "Add turmeric, ginger and coriander. For soto and fried chicken.")],
          ],
        }),
        tableD(K, {
          title: tr("Takaran praktis", "Handy conversions"),
          columns: [tr("Bahan", "Ingredient"), tr("1 sendok makan", "1 tablespoon"), tr("1 gelas (240 ml)", "1 cup (240 ml)")],
          rows: [[tr("Gula pasir", "Sugar"), "12 g", "200 g"], [tr("Tepung terigu", "Flour"), "8 g", "125 g"], [tr("Santan kental", "Thick coconut milk"), "15 ml", "240 ml"]],
          note: tr("Angka dibulatkan; untuk kue, sebaiknya tetap menimbang.", "Rounded numbers; for baking, weighing is still best."),
        }),
      ],
      trips: () => [
        pageHead(K, { eyebrow: tr("Jelajah rasa", "Food trips"), title: tr("Catatan dari pasar dan warung kecil", "Notes from markets and tiny stalls"), text: tr("Kami datang pagi-pagi, membeli sedikit dari banyak penjual, lalu menulis apa yang kami pelajari.", "We arrive early, buy a little from many sellers, then write about what we learned.") }),
        articleBody(K, {
          lead: tr("Pasar pagi di kota kecil selalu dimulai sebelum azan subuh selesai. Pedagang tempe datang paling awal, disusul ibu-ibu penjual jajanan yang membawa tampah besar di kepala.", "A small-town morning market always starts before dawn prayers end. Tempeh sellers arrive first, followed by snack vendors carrying wide trays on their heads."),
          blocks: [
            [tr("Belajar dari penjual bumbu", "Lessons from the spice seller"), tr("Bu Sarmi sudah 30 tahun meracik bumbu pecel. Rahasianya: kencur yang dibakar sebentar dan gula merah dari desa sebelah.", "Mrs Sarmi has blended pecel paste for 30 years. Her secret: briefly charred galangal and palm sugar from the next village.")],
            [tr("Jajanan yang hampir hilang", "Snacks that are nearly gone"), tr("Gethuk lindri, cenil, dan klepon masih ada — tapi penjualnya makin sedikit. Kami mencatat resep mereka sebelum terlupa.", "Gethuk lindri, cenil and klepon are still here — but fewer people sell them. We record their recipes before they're forgotten.")],
          ],
          quote: tr("“Bumbu enak itu tidak buru-buru,” kata Bu Sarmi.", "“Good paste is never rushed,” says Mrs Sarmi."),
        }),
        mosaic(K, { eyebrow: tr("Album", "Album"), title: tr("Potret dari perjalanan", "Snapshots from the road"), images: [[asset("v3d-food-hero"), tr("Lodeh di Klaten", "Lodeh in Klaten")], [asset("v3d-food-green"), tr("Lalapan Sunda", "Sundanese greens")], [asset("v3d-food-plum"), tr("Kue basah pagi", "Morning cakes")], [asset("v3d-food-green"), tr("Pecel pincuk", "Leaf-wrapped pecel")], [asset("v3d-food-hero"), tr("Soto pinggir sungai", "Riverside soto")], [asset("v3d-food-plum"), tr("Es dawet", "Dawet ice")]] }),
      ],
      about: () => [
        splitPanel(K, {
          eyebrow: tr("Di balik blog", "Behind the blog"),
          title: tr("Dua orang, satu kompor, dan banyak catatan", "Two people, one stove and lots of notes"),
          text: tr("Laras menulis dan memotret, Bima mencuci piring dan mencicipi. Dapur Lirih dimulai dari buku resep keluarga yang hampir rusak.", "Laras writes and photographs, Bima washes up and taste-tests. Dapur Lirih began with a family recipe book that was falling apart."),
          bullets: [tr("Semua resep dicoba minimal tiga kali", "Every recipe is tested at least three times"), tr("Tidak menerima titipan produk berbayar", "No paid product placements"), tr("Bahan mudah ditemukan di pasar", "Ingredients easy to find at the market")],
          image: asset("v3d-food-plum"),
          alt: tr("Hidangan di meja makan", "Dishes on the table"),
        }),
        timelineD(K, { title: tr("Perjalanan Dapur Lirih", "The Dapur Lirih story"), items: [["2019", tr("Buku resep nenek", "Grandma's notebook"), tr("Mulai menyalin 80 resep tulisan tangan.", "We began copying 80 handwritten recipes.")], ["2021", tr("Blog pertama", "First blog post"), tr("Resep sayur asem dibaca 10 ribu kali.", "The tamarind soup recipe was read 10,000 times.")], ["2024", tr("Kelas masak kecil", "Small cooking classes"), tr("Enam peserta tiap Minggu pagi.", "Six students every Sunday morning.")], ["2026", tr("Seri jajanan pasar", "Market-snack series"), tr("Mendokumentasikan 30 kue tradisional.", "Documenting 30 traditional cakes.")]] }),
        faqD(K, { title: tr("Pertanyaan pembaca", "Reader questions"), items: [[tr("Boleh memakai resep untuk jualan?", "Can I use a recipe for my business?"), tr("Boleh, cukup sebut sumbernya bila dibagikan online.", "Yes — just credit us if you share it online.")], [tr("Menerima kolaborasi?", "Do you collaborate?"), tr("Ya, untuk liputan pasar dan kelas masak.", "Yes, for market features and cooking classes.")], [tr("Kenapa takarannya pakai gelas?", "Why measure in cups?"), tr("Supaya bisa diikuti tanpa timbangan.", "So anyone can cook without a scale.")], [tr("Ada versi vegetarian?", "Vegetarian versions?"), tr("Sebagian besar resep punya catatan pengganti.", "Most recipes include substitution notes.")]] }),
        formD(K, { eyebrow: tr("Kontak", "Contact"), title: tr("Kirim salam atau pertanyaan", "Say hello or ask away"), info: [["Email", "halo@dapurlirih.id"], [tr("Kota", "City"), "Yogyakarta"]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { kind: "input", label: "Email", ph: "nama@email.com", type: "email" }], message: tr("Pesan", "Message"), submit: tr("Kirim", "Send") }),
      ],
    }),
};

/* -------- 2. Desa Lembah Pinara — desa digital (8 hlm, Premium) -------- */
// Premium: stats-counter, pro-team-cards, gallery-lightbox, back-to-top. Library: AOS.

const DP: Palette = { ink: "#14281d", muted: "#4b6455", primary: "#166534", primaryDark: "#14532d", soft: "#dcfce7", line: "#bbf7d0" };
const D = lookD(DP, { head: "Merriweather", body: "Work Sans", shape: "sharp", radius: 4, bg: "#ffffff", alt: "#f3f8f4", inv: "#14281d", fx: { aos: "fade-right" } });

const dFoot = (tr: Tr) =>
  footerD("Desa Lembah Pinara", D, {
    variant: "columns",
    about: tr("Pemerintah Desa Lembah Pinara, Kecamatan Sagara Kidul. Melayani 4.812 warga di 6 dusun.", "Lembah Pinara Village Government, Sagara Kidul District. Serving 4,812 residents in 6 hamlets."),
    cols: [
      { title: tr("Layanan", "Services"), items: [tr("Surat keterangan", "Certificates"), tr("Pengaduan", "Complaints"), tr("Transparansi APBDes", "Budget transparency")] },
      { title: tr("Kantor desa", "Village office"), items: [tr("Sen–Jum 08.00–15.00", "Mon–Fri 8am–3pm"), "Jl. Balai Desa No. 1", "(0265) 700 1234"] },
    ],
    copy: tr("© 2026 Pemerintah Desa Lembah Pinara. Konten contoh.", "© 2026 Lembah Pinara Village Government. Sample content."),
    extra: [backTop(D, tr("Kembali ke atas", "Back to top"))],
  });

export const governmentDesaDigital: TemplateContent = {
  brand: "Desa Lembah Pinara",
  pages: [
    home(),
    pg("profile", ["profil-desa", "Profil Desa"], ["village-profile", "Village Profile"]),
    pg("gov", ["pemerintahan", "Pemerintahan"], ["government", "Government"]),
    pg("services", ["layanan", "Layanan"], ["services", "Services"]),
    pg("budget", ["apbdes", "APBDes"], ["budget", "Village Budget"]),
    pg("news", ["kabar-desa", "Kabar Desa"], ["village-news", "Village News"]),
    pg("potential", ["potensi", "Potensi Desa"], ["potential", "Local Potential"]),
    pg("contact", ["pengaduan", "Pengaduan"], ["complaints", "Complaints"]),
  ],
  build: (key, tr, href) =>
    render(D, key, headerD("Desa Lembah Pinara", D, { variant: "split", info: [tr("Kantor desa buka Sen–Jum 08.00–15.00", "Village office open Mon–Fri 8am–3pm"), "WA 0812 7000 4512"], cta: [tr("Ajukan surat", "Request a letter"), href("services")] }), dFoot(tr), {
      home: () => [
        heroSplitScreen(D, {
          eyebrow: tr("Website resmi desa", "Official village website"),
          title: tr("Layanan desa lebih dekat, langsung dari ponsel", "Village services closer, right from your phone"),
          text: tr("Ajukan surat, pantau anggaran, dan sampaikan aspirasi tanpa harus antre di balai desa.", "Request letters, follow the budget and share feedback without queueing at the village hall."),
          list: [tr("Surat jadi dalam 1 hari kerja", "Letters ready in 1 working day"), tr("APBDes terbuka untuk semua warga", "Budget open to every resident"), tr("Pengaduan ditanggapi maks. 3 hari", "Complaints answered within 3 days")],
          image: asset("v3d-village"),
          alt: tr("Pemandangan desa dan sawah", "Village houses and rice fields"),
          actions: [[tr("Lihat layanan", "See services"), href("services"), "light"]],
        }),
        counterD(D, { title: tr("Desa dalam angka", "The village in numbers"), items: [tr("4.812 | Jiwa", "4,812 | Residents"), tr("6 | Dusun", "6 | Hamlets"), tr("312 ha | Lahan pertanian", "312 ha | Farmland"), tr("97% | Layanan daring", "97% | Online services")] }),
        cardsD(D, {
          eyebrow: tr("Layanan cepat", "Quick services"),
          title: tr("Yang paling sering diurus warga", "What residents request most"),
          items: [
            { icon: "§", title: tr("Surat keterangan domisili", "Proof of residence"), text: tr("Untuk sekolah, kerja, dan bank.", "For school, work and banking."), meta: tr("1 hari kerja", "1 working day") },
            { icon: "¶", title: tr("Pengantar KTP & KK", "ID & family card cover letter"), text: tr("Diteruskan ke kantor kecamatan.", "Forwarded to the district office."), meta: tr("Hari yang sama", "Same day") },
            { icon: "✚", title: tr("Surat keterangan usaha", "Business certificate"), text: tr("Untuk UMKM dan pengajuan modal.", "For small businesses and loans."), meta: tr("2 hari kerja", "2 working days") },
          ],
        }),
        noticeD(D, { badge: tr("Info", "Notice"), text: tr("Musyawarah desa RKPDes 2027 digelar Sabtu, 7 November 2026 di balai desa.", "The 2027 village planning meeting is on Saturday 7 November 2026 at the village hall."), link: tr("Baca kabar", "Read news"), href: href("news") }),
      ],
      profile: () => [
        pageHead(D, { eyebrow: tr("Profil", "Profile"), title: tr("Lembah Pinara, desa di kaki bukit", "Lembah Pinara, a village at the foot of the hills"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Profil desa", "Village profile"), ""]] }),
        splitPanel(D, { eyebrow: tr("Sejarah", "History"), title: tr("Berdiri sejak 1912", "Founded in 1912"), text: tr("Nama Pinara berasal dari pohon pinang yang dulu berjajar di tepi sungai. Kini desa dikenal sebagai penghasil gula aren dan beras organik.", "The name Pinara comes from the areca palms that once lined the river. Today the village is known for palm sugar and organic rice."), image: asset("v3d-village-dusk"), alt: tr("Desa saat senja", "The village at dusk") }),
        specs(D, { title: tr("Data wilayah", "Area facts"), rows: [[tr("Luas wilayah", "Area"), "8,4 km²"], [tr("Ketinggian", "Elevation"), tr("420 mdpl", "420 m above sea level")], [tr("Jumlah KK", "Households"), "1.506"], [tr("Batas utara", "Northern border"), tr("Desa Wanasari", "Wanasari Village")]] }),
        timelineD(D, { title: tr("Tonggak desa", "Village milestones"), items: [["1912", tr("Desa berdiri", "Village founded"), tr("Dibuka oleh 12 keluarga perantau.", "Opened by 12 settler families.")], ["1987", tr("Listrik masuk", "Electricity arrives"), tr("Seluruh dusun teraliri listrik.", "Every hamlet connected.")], ["2020", tr("BUMDes berdiri", "Village enterprise founded"), tr("Mengelola air bersih dan wisata.", "Running clean water and tourism.")], ["2026", tr("Desa digital", "Digital village"), tr("Layanan surat sepenuhnya daring.", "Letter services fully online.")]] }),
      ],
      gov: () => [
        pageHead(D, { eyebrow: tr("Pemerintahan", "Government"), title: tr("Perangkat desa", "Village officials"), text: tr("Struktur pemerintahan desa periode 2025–2031.", "Village government for the 2025–2031 term.") }),
        withFx(D, teamCards(pro(D), tr, { eyebrow: tr("Struktur", "Structure"), title: tr("Melayani dengan terbuka", "Serving openly"), members: [{ name: "H. Darmawan Sujono", role: tr("Kepala Desa", "Village Head"), photo: asset("v3d-face-1") }, { name: "Siti Rohimah", role: tr("Sekretaris Desa", "Village Secretary"), photo: asset("v3d-face-2") }, { name: "Agus Wibisono", role: tr("Kaur Keuangan", "Finance Officer"), photo: asset("v3d-face-3") }, { name: "Rini Kartikasari", role: tr("Kasi Pelayanan", "Service Officer"), photo: asset("v3d-face-4") }] })),
        editorial(D, { title: tr("Lembaga desa", "Village institutions"), cols: [[tr("BPD", "Village Council"), tr("9 anggota, mengawasi dan menyusun peraturan desa.", "9 members overseeing village regulations.")], [tr("LPM", "Community Board"), tr("Menyalurkan usulan pembangunan dari RT/RW.", "Channels development proposals from neighbourhoods.")], ["PKK", tr("Kesehatan keluarga, posyandu, dan kebun gizi.", "Family health, clinics and nutrition gardens.")], ["Karang Taruna", tr("Kegiatan pemuda, olahraga, dan wisata.", "Youth, sports and tourism activities.")]] }),
      ],
      services: () => [
        pageHead(D, { eyebrow: tr("Layanan administrasi", "Administrative services"), title: tr("Ajukan surat secara daring", "Request letters online") }),
        tableD(D, { title: tr("Jenis surat & persyaratan", "Letters & requirements"), columns: [tr("Surat", "Letter"), tr("Syarat", "Requirements"), tr("Waktu", "Time")], rows: [[tr("Domisili", "Residence"), tr("KTP, KK", "ID, family card"), tr("1 hari", "1 day")], [tr("Usaha", "Business"), tr("KTP, foto usaha", "ID, business photo"), tr("2 hari", "2 days")], [tr("Tidak mampu", "Low income"), tr("KTP, KK, surat RT", "ID, family card, RT letter"), tr("1 hari", "1 day")], [tr("Kelahiran", "Birth"), tr("Surat bidan, KK", "Midwife letter, family card"), tr("1 hari", "1 day")]] }),
        zigzag(D, { title: tr("Alurnya sederhana", "A simple flow"), steps: [[tr("Isi formulir", "Fill in the form"), tr("Pilih jenis surat dan unggah foto dokumen.", "Choose the letter type and upload document photos.")], [tr("Verifikasi", "Verification"), tr("Petugas memeriksa data dan menghubungi via WhatsApp.", "Staff check the data and contact you via WhatsApp.")], [tr("Ambil atau unduh", "Collect or download"), tr("Surat bertanda tangan elektronik siap diunduh.", "The e-signed letter is ready to download.")]] }),
        formD(D, { title: tr("Formulir permohonan", "Request form"), info: [[tr("Loket", "Counter"), tr("Balai desa, ruang 1", "Village hall, room 1")], ["WhatsApp", "0812 7000 4512"]], fields: [{ kind: "input", label: "NIK", ph: "3207xxxxxxxxxxxx" }, { kind: "select", label: tr("Jenis surat", "Letter type"), ph: tr("Pilih", "Choose"), options: [tr("Domisili", "Residence"), tr("Usaha", "Business"), tr("Tidak mampu", "Low income"), tr("Kelahiran", "Birth")] }, { kind: "input", label: tr("No. WhatsApp", "WhatsApp no."), ph: "08xx" }], submit: tr("Kirim permohonan", "Submit request") }),
      ],
      budget: () => [
        pageHead(D, { eyebrow: tr("Transparansi", "Transparency"), title: tr("APBDes 2026", "2026 Village Budget"), text: tr("Ringkasan pendapatan dan belanja desa. Dokumen lengkap tersedia di balai desa.", "Summary of village income and spending. Full documents are available at the village hall.") }),
        numbers(D, { items: [["Rp2,41 M", tr("Pendapatan", "Income")], ["Rp2,38 M", tr("Belanja", "Spending")], ["63%", tr("Terealisasi", "Realised")], ["Rp30 jt", tr("Silpa", "Surplus")]] }),
        tableD(D, { title: tr("Rincian belanja", "Spending breakdown"), columns: [tr("Bidang", "Area"), tr("Anggaran", "Budget"), tr("Realisasi", "Realised")], rows: [[tr("Pemerintahan", "Administration"), "Rp612 jt", "71%"], [tr("Pembangunan", "Infrastructure"), "Rp1,02 M", "58%"], [tr("Pembinaan", "Community"), "Rp284 jt", "66%"], [tr("Pemberdayaan", "Empowerment"), "Rp466 jt", "60%"]], note: tr("Data per 30 September 2026.", "Data as of 30 September 2026.") }),
      ],
      news: () => [
        pageHead(D, { eyebrow: tr("Kabar desa", "Village news"), title: tr("Kabar terbaru dari Lembah Pinara", "Latest from Lembah Pinara") }),
        magazine(D, {
          title: tr("Berita & pengumuman", "News & announcements"),
          read: tr("Selengkapnya", "Read more"),
          lead: { image: asset("v3d-village"), tag: tr("Pembangunan", "Infrastructure"), date: "10 Okt 2026", title: tr("Jalan usaha tani Dusun Kalen selesai dicor", "Kalen hamlet farm road fully paved"), text: tr("Jalan sepanjang 640 meter kini bisa dilalui truk pengangkut gabah.", "The 640-metre road can now carry grain trucks."), href: href("news") },
          items: [
            { image: asset("v3d-village-dusk"), tag: tr("Kesehatan", "Health"), date: "5 Okt", title: tr("Posyandu lansia tiap Rabu", "Elderly clinic every Wednesday"), text: "", href: href("news") },
            { image: asset("v3d-tree"), tag: tr("Lingkungan", "Environment"), date: "29 Sep", title: tr("Gerakan tanam 1.000 pohon aren", "Planting 1,000 sugar palms"), text: "", href: href("potential") },
          ],
        }),
        newsletter(D, { title: tr("Pengumuman lewat WhatsApp", "Announcements via WhatsApp"), text: tr("Daftarkan nomor untuk menerima info posyandu, bansos, dan musyawarah.", "Register your number for clinic, aid and meeting updates."), ph: "08xx xxxx xxxx", submit: tr("Daftar", "Register") }),
      ],
      potential: () => [
        pageHead(D, { eyebrow: tr("Potensi", "Potential"), title: tr("Gula aren, beras organik, dan curug", "Palm sugar, organic rice and waterfalls") }),
        galleryLb(D, { title: tr("Galeri potensi desa", "Village potential gallery"), images: [[asset("v3d-village"), tr("Sawah organik Dusun Kalen", "Kalen organic fields")], [asset("v3d-tree"), tr("Kebun aren", "Sugar palm grove")], [asset("v3d-lake"), tr("Curug Pinara", "Pinara waterfall")], [asset("v3d-village-dusk"), tr("Kampung tematik", "Themed hamlet")], [asset("v3d-food-green"), tr("Kuliner desa", "Village food")], [asset("v3d-map"), tr("Peta wisata", "Tourism map")]] }),
        cardsD(D, { title: tr("Produk BUMDes", "Village enterprise products"), inv: true, items: [{ icon: "◆", title: tr("Gula aren cetak", "Moulded palm sugar"), text: tr("12 ton per bulan, dipasarkan ke 4 kota.", "12 tonnes a month, sold in 4 cities.") }, { icon: "◇", title: tr("Beras organik", "Organic rice"), text: tr("Bersertifikat, dikemas 5 kg.", "Certified, packed in 5 kg bags.") }, { icon: "○", title: tr("Wisata curug", "Waterfall tours"), text: tr("Dikelola Karang Taruna.", "Run by the youth group.") }] }),
      ],
      contact: () => [
        pageHead(D, { eyebrow: tr("Aspirasi warga", "Resident feedback"), title: tr("Sampaikan pengaduan atau usulan", "Share a complaint or suggestion") }),
        formD(D, { title: tr("Formulir pengaduan", "Complaint form"), text: tr("Identitas pelapor dirahasiakan.", "Your identity is kept confidential."), info: [[tr("Waktu tanggap", "Response time"), tr("Maks. 3 hari kerja", "Max. 3 working days")], ["Email", "pengaduan@lembahpinara.desa.id"]], fields: [{ kind: "input", label: tr("Nama (opsional)", "Name (optional)"), ph: "" }, { kind: "select", label: tr("Kategori", "Category"), ph: tr("Pilih", "Choose"), options: [tr("Infrastruktur", "Infrastructure"), tr("Pelayanan", "Service"), tr("Bantuan sosial", "Social aid"), tr("Lainnya", "Other")] }], message: tr("Uraian", "Details"), submit: tr("Kirim pengaduan", "Send complaint"), formFirst: true }),
        locations(D, { title: tr("Kantor & pos pelayanan", "Office & service posts"), image: asset("v3d-map"), places: [[tr("Balai Desa", "Village Hall"), "Jl. Balai Desa No. 1", tr("Sen–Jum 08.00–15.00", "Mon–Fri 8am–3pm")], [tr("Pos Dusun Kalen", "Kalen Post"), tr("Samping masjid Al-Hikmah", "Next to Al-Hikmah mosque"), tr("Sabtu 08.00–11.00", "Sat 8–11am")]] }),
      ],
    }),
};

/* ---- 3. Dinas Pariwisata Sagarawangi (9 hlm, Premium) ---------------- */
// Premium: slider, gallery-lightbox, mega-menu, countdown, pro-portfolio-mosaic, logo-marquee. Library: AOS + Tilt.

const WP: Palette = { ink: "#0b2a33", muted: "#47646d", primary: "#0e7490", primaryDark: "#155e75", soft: "#cffafe", line: "#a5f3fc" };
const W = lookD(WP, { head: "DM Serif Display", body: "Plus Jakarta Sans", shape: "glass", radius: 22, bg: "#f6fdff", alt: "#e6f8fb", inv: "#0b2a33", fx: { aos: "zoom-in-up", tilt: true } });

const wFoot = (tr: Tr) =>
  footerD("Sagarawangi", W, {
    variant: "giant",
    about: tr("Dinas Pariwisata Kabupaten Sagarawangi — pantai, danau vulkanik, dan desa kerajinan dalam satu kabupaten.", "Sagarawangi Regency Tourism Office — beaches, volcanic lakes and craft villages in one regency."),
    cols: [
      { title: tr("Rencanakan", "Plan"), items: [tr("Destinasi", "Destinations"), tr("Agenda", "Events"), tr("Akomodasi", "Stays")] },
      { title: tr("Pusat informasi", "Visitor centre"), items: ["Jl. Pelabuhan Lama 8", "(0371) 220 900", "info@sagarawangi.travel"] },
    ],
    social: ["Instagram | https://instagram.com/sagarawangi", "YouTube | https://youtube.com/@sagarawangi", "TikTok | https://tiktok.com/@sagarawangi"],
    copy: tr("© 2026 Dinas Pariwisata Sagarawangi. Konten contoh.", "© 2026 Sagarawangi Tourism Office. Sample content."),
  });

export const governmentDinasPariwisata: TemplateContent = {
  brand: "Sagarawangi",
  pages: [
    home(),
    pg("dest", ["destinasi", "Destinasi"], ["destinations", "Destinations"]),
    pg("events", ["agenda", "Agenda"], ["events", "Events"]),
    pg("culture", ["budaya", "Budaya"], ["culture", "Culture"]),
    pg("food", ["kuliner", "Kuliner"], ["food", "Food"]),
    pg("stay", ["akomodasi", "Akomodasi"], ["stays", "Stays"]),
    pg("guide", ["panduan", "Panduan Wisata"], ["travel-guide", "Travel Guide"]),
    pg("data", ["data-kunjungan", "Data Kunjungan"], ["visitor-data", "Visitor Data"]),
    pg("contact", ["pusat-informasi", "Pusat Informasi"], ["visitor-centre", "Visitor Centre"]),
  ],
  build: (key, tr, href) => {
    const nav = megaD(W, [`${tr("Jelajahi", "Explore")} | ${href("dest")}`, `- ${tr("Destinasi", "Destinations")} | ${tr("Pantai, danau, bukit", "Beaches, lakes, hills")} | ${href("dest")}`, `- ${tr("Budaya", "Culture")} | ${tr("Tari, tenun, upacara", "Dance, weaving, rituals")} | ${href("culture")}`, `- ${tr("Kuliner", "Food")} | ${tr("Rasa khas pesisir", "Coastal flavours")} | ${href("food")}`, `${tr("Rencanakan", "Plan")} | ${href("guide")}`, `- ${tr("Agenda", "Events")} | ${tr("Festival tahunan", "Annual festivals")} | ${href("events")}`, `- ${tr("Akomodasi", "Stays")} | ${tr("Homestay hingga resor", "Homestays to resorts")} | ${href("stay")}`, `- ${tr("Panduan", "Guide")} | ${tr("Transportasi & tips", "Transport & tips")} | ${href("guide")}`], tr("Pusat informasi", "Visitor centre"), href("contact"));
    return render(W, key, headerD("Sagarawangi", W, { variant: "pill", nav }), wFoot(tr), {
      home: () => [
        heroGlass(W, {
          eyebrow: tr("Kabupaten Sagarawangi", "Sagarawangi Regency"),
          title: tr("Laut biru, danau kawah, dan senja yang tidak tergesa", "Blue sea, crater lakes and unhurried sunsets"),
          text: tr("Rencanakan perjalanan Anda: 42 destinasi resmi, kalender festival, dan panduan transportasi dari pusat informasi kami.", "Plan your trip: 42 official destinations, a festival calendar and transport tips from our visitor centre."),
          gradient: ["#0e7490", "#7c3aed"],
          chips: [tr("42 destinasi", "42 destinations"), tr("18 festival", "18 festivals"), tr("Ramah keluarga", "Family friendly")],
          image: asset("v3d-lake"),
          alt: tr("Danau di kaki gunung", "A lake beneath the mountains"),
          actions: [[tr("Jelajahi destinasi", "Explore destinations"), href("dest"), "light"], [tr("Lihat agenda", "See events"), href("events"), "dark"]],
        }),
        sliderD(W, { slides: [{ title: tr("Pantai Watu Lintang", "Watu Lintang Beach"), text: tr("Pasir putih dan tebing karang 40 menit dari kota.", "White sand and coral cliffs 40 minutes from town."), bg: "#0e7490" }, { title: tr("Danau Kawah Sunyaragi", "Sunyaragi Crater Lake"), text: tr("Matahari terbit di ketinggian 1.600 mdpl.", "Sunrise at 1,600 m above sea level."), bg: "#7c3aed" }, { title: tr("Kampung Tenun Ikat", "Ikat Weaving Village"), text: tr("Belajar menenun bersama perajin.", "Learn to weave with artisans."), bg: "#be185d" }] }),
        withFx(W, portfolioMosaic(pro(W), tr, { eyebrow: tr("Wajib dikunjungi", "Must visit"), title: tr("Lima tempat favorit wisatawan", "Five visitor favourites"), text: tr("Dipilih dari 12.000 ulasan pengunjung tahun lalu.", "Chosen from 12,000 visitor reviews last year."), works: [{ title: "Watu Lintang", tag: tr("Pantai", "Beach"), image: asset("v3d-lake") }, { title: "Sunyaragi", tag: tr("Danau kawah", "Crater lake"), image: asset("v3d-lake-dusk") }, { title: tr("Kampung Tenun", "Weaving Village"), tag: tr("Budaya", "Culture"), image: asset("v3d-beads-teal") }, { title: tr("Bukit Kencana", "Kencana Hill"), tag: tr("Pendakian", "Hiking"), image: asset("v3d-village") }, { title: tr("Pasar Ikan Lama", "Old Fish Market"), tag: tr("Kuliner", "Food"), image: asset("v3d-food-hero") }], cta: { label: tr("Semua destinasi", "All destinations"), href: href("dest") } })),
        countdownD(W, { eyebrow: tr("Festival utama", "Main festival"), title: tr("Festival Bahari Sagarawangi 2026", "Sagarawangi Maritime Festival 2026"), text: tr("Lomba perahu hias, pasar malam, dan konser pantai selama tiga hari.", "Decorated boat races, night market and beach concerts over three days."), target: "2026-12-12T16:00", finished: tr("Festival sedang berlangsung!", "The festival is on!"), actions: [[tr("Detail agenda", "Event details"), href("events"), "light"]] }),
      ],
      dest: () => [
        pageHead(W, { eyebrow: tr("Destinasi", "Destinations"), title: tr("42 destinasi resmi", "42 official destinations"), text: tr("Tiket masuk resmi dan jam buka diperbarui setiap bulan.", "Official entry fees and opening hours, updated monthly."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Destinasi", "Destinations"), ""]] }),
        bento(W, { title: tr("Menurut jenis", "By type"), items: [{ title: tr("Pantai & pulau", "Beaches & islands"), text: tr("14 pantai, 3 pulau kecil dengan dermaga.", "14 beaches and 3 islets with jetties."), image: asset("v3d-lake"), wide: true, tall: true }, { title: tr("Danau & kawah", "Lakes & craters"), text: tr("Jalur sunrise dan perkemahan.", "Sunrise trails and campsites."), icon: "◒" }, { title: tr("Desa wisata", "Tourism villages"), text: tr("9 desa dengan homestay.", "9 villages with homestays."), icon: "⌂", accent: true }, { title: tr("Air terjun", "Waterfalls"), text: tr("Akses jalan kaki 10–40 menit.", "10–40 minute walks."), icon: "≈", wide: true }] }),
        tableD(W, { title: tr("Tiket & jam buka", "Tickets & hours"), columns: [tr("Destinasi", "Destination"), tr("Tiket", "Ticket"), tr("Jam", "Hours")], rows: [["Watu Lintang", "Rp10.000", "06.00–18.00"], ["Sunyaragi", "Rp15.000", "04.00–17.00"], [tr("Kampung Tenun", "Weaving Village"), tr("Gratis", "Free"), "08.00–16.00"], [tr("Curug Tujuh", "Seven Falls"), "Rp8.000", "07.00–16.00"]] }),
      ],
      events: () => [
        pageHead(W, { eyebrow: tr("Agenda", "Events"), title: tr("Kalender festival 2026", "2026 festival calendar") }),
        timelineD(W, { title: tr("Sepanjang tahun", "All year round"), items: [[tr("Mar", "Mar"), tr("Larung Sesaji", "Sea Offering"), tr("Upacara nelayan di Pantai Watu Lintang.", "Fishermen's ritual at Watu Lintang beach.")], [tr("Jul", "Jul"), tr("Festival Tenun Ikat", "Ikat Weaving Festival"), tr("Pameran dan peragaan busana desa.", "Village exhibition and fashion show.")], [tr("Sep", "Sep"), tr("Lari Lintas Kawah", "Crater Trail Run"), tr("21 km mengelilingi Danau Sunyaragi.", "21 km around Sunyaragi Lake.")], [tr("Des", "Dec"), tr("Festival Bahari", "Maritime Festival"), tr("Perahu hias dan konser pantai.", "Decorated boats and beach concerts.")]], side: { image: asset("v3d-lake-dusk"), alt: tr("Senja di danau", "Dusk at the lake") } }),
        newsletter(W, { title: tr("Kabari saya soal festival", "Tell me about festivals"), text: tr("Jadwal dan info tiket dikirim sebulan sebelumnya.", "Schedules and ticket info sent a month ahead."), ph: "email@contoh.com", submit: tr("Ikuti", "Follow"), inv: true }),
      ],
      culture: () => [
        pageHead(W, { eyebrow: tr("Budaya", "Culture"), title: tr("Tradisi yang masih dijalani", "Traditions still lived") }),
        splitPanel(W, { title: tr("Tenun ikat Sagarawangi", "Sagarawangi ikat weaving"), text: tr("Motif ombak dan perahu dikerjakan 3–6 bulan per kain. Pengunjung bisa ikut kelas singkat di Kampung Tenun.", "Wave and boat motifs take 3–6 months per cloth. Visitors can join short classes at the Weaving Village."), bullets: [tr("Kelas 2 jam, Rp75.000", "2-hour class, Rp75,000"), tr("Pewarna alami dari akar mengkudu", "Natural dyes from noni root")], image: asset("v3d-beads-teal"), alt: tr("Untaian tenun", "Woven strands") }),
        editorial(W, { title: tr("Seni pertunjukan", "Performing arts"), cols: [[tr("Tari Ombak", "Wave Dance"), tr("Dibawakan saat panen ikan, setiap purnama.", "Performed at fish harvests, every full moon.")], [tr("Gamelan pesisir", "Coastal gamelan"), tr("Laras slendro dengan kendang besar.", "Slendro tuning with large drums.")], [tr("Wayang perahu", "Boat puppetry"), tr("Kisah pelaut dalam bayang-bayang.", "Sailors' tales in shadow.")]] }),
      ],
      food: () => [
        pageHead(W, { eyebrow: tr("Kuliner", "Food"), title: tr("Rasa pesisir Sagarawangi", "Coastal flavours of Sagarawangi") }),
        catalog(W, { title: tr("Wajib dicoba", "Must try"), items: [{ image: asset("v3d-food-hero"), title: tr("Pindang serani", "Pindang serani"), text: tr("Sup ikan kuah kuning asam segar.", "Tangy yellow fish soup."), price: "Rp25.000", cta: tr("Lihat warung", "See stalls"), href: href("guide") }, { image: asset("v3d-food-green"), title: tr("Urap kelapa muda", "Young coconut urap"), text: tr("Sayur rebus dengan kelapa berbumbu.", "Boiled greens with spiced coconut."), price: "Rp12.000", cta: tr("Lihat warung", "See stalls"), href: href("guide") }, { image: asset("v3d-food-plum"), title: tr("Kue lumpang", "Lumpang cake"), text: tr("Kue kukus gula aren.", "Steamed palm-sugar cake."), price: "Rp3.000", cta: tr("Lihat warung", "See stalls"), href: href("guide") }] }),
        locations(W, { title: tr("Sentra kuliner", "Food hubs"), image: asset("v3d-map-blue"), places: [[tr("Pasar Ikan Lama", "Old Fish Market"), "Jl. Pelabuhan Lama", "05.00–11.00"], [tr("Taman Kuliner Alun-alun", "Square Food Park"), tr("Alun-alun kota", "Town square"), "17.00–23.00"]] }),
      ],
      stay: () => [
        pageHead(W, { eyebrow: tr("Akomodasi", "Stays"), title: tr("Menginap dekat destinasi", "Stay close to the sights") }),
        cardsD(W, { title: tr("Pilihan menginap", "Places to stay"), items: [{ icon: "⌂", title: tr("Homestay desa", "Village homestays"), text: tr("62 rumah warga terdaftar, sarapan termasuk.", "62 registered homes, breakfast included."), meta: tr("mulai Rp150.000", "from Rp150,000") }, { icon: "▲", title: tr("Perkemahan kawah", "Crater campsite"), text: tr("Sewa tenda dan matras tersedia.", "Tent and mat rental available."), meta: tr("mulai Rp40.000", "from Rp40,000") }, { icon: "◈", title: tr("Hotel & resor", "Hotels & resorts"), text: tr("24 hotel berizin di pusat kota & pantai.", "24 licensed hotels in town and by the beach."), meta: tr("mulai Rp450.000", "from Rp450,000") }] }),
        faqD(W, { title: tr("Pertanyaan menginap", "Accommodation questions"), items: [[tr("Bagaimana memesan homestay?", "How do I book a homestay?"), tr("Hubungi pusat informasi; kami teruskan ke pemilik.", "Contact the visitor centre; we'll connect you with the host.")], [tr("Ada homestay halal?", "Halal homestays?"), tr("Ya, sebagian besar homestay menyediakan makanan halal.", "Yes, most homestays serve halal food.")], [tr("Boleh membawa hewan?", "Pets allowed?"), tr("Tergantung pemilik, tanyakan saat memesan.", "Depends on the host — ask when booking.")], [tr("Musim ramai?", "Peak season?"), tr("Juli–Agustus dan Desember.", "July–August and December.")]] }),
      ],
      guide: () => [
        pageHead(W, { eyebrow: tr("Panduan", "Guide"), title: tr("Cara ke Sagarawangi & berkeliling", "Getting here & getting around") }),
        tabsD(W, { title: tr("Transportasi", "Transport"), tabs: [[tr("Kereta", "Train"), tr("Stasiun Sagarawangi dilayani 6 perjalanan per hari dari ibu kota provinsi.", "Sagarawangi station has 6 daily services from the provincial capital.")], [tr("Bus", "Bus"), tr("Terminal Pinggir Laut, bus tiap 30 menit.", "Pinggir Laut terminal, buses every 30 minutes.")], [tr("Sewa motor", "Scooter hire"), tr("Rp80.000 per hari, wajib SIM C.", "Rp80,000 per day, licence required.")]] }),
        zigzag(W, { title: tr("Rute 3 hari", "A 3-day route"), steps: [[tr("Hari 1: Pesisir", "Day 1: Coast"), tr("Pasar ikan pagi, Pantai Watu Lintang, senja di dermaga.", "Morning fish market, Watu Lintang beach, sunset at the jetty."), asset("v3d-lake")], [tr("Hari 2: Kawah", "Day 2: Crater"), tr("Sunrise Sunyaragi, curug, makan siang di desa.", "Sunyaragi sunrise, waterfalls, lunch in a village."), asset("v3d-lake-dusk")], [tr("Hari 3: Budaya", "Day 3: Culture"), tr("Kelas tenun dan pertunjukan Tari Ombak.", "Weaving class and a Wave Dance show."), asset("v3d-beads-teal")]] }),
      ],
      data: () => [
        pageHead(W, { eyebrow: tr("Data", "Data"), title: tr("Statistik kunjungan wisata", "Visitor statistics") }),
        numbers(W, { inv: true, items: [["1,2 jt", tr("Kunjungan 2025", "Visits in 2025")], ["+18%", tr("Pertumbuhan", "Growth")], ["2,6", tr("Malam rata-rata", "Average nights")], ["4,7", tr("Kepuasan (dari 5)", "Satisfaction (of 5)")]] }),
        marqueeD(W, { title: tr("Mitra promosi pariwisata", "Tourism promotion partners"), items: ["Asosiasi Homestay Pesisir", "Komunitas Pemandu Kawah", "Koperasi Tenun Ombak", "Paguyuban Nelayan Lintang", "Sanggar Tari Samudra", "Forum Kuliner Pindang"] }),
        galleryLb(W, { title: tr("Arsip foto resmi", "Official photo archive"), text: tr("Boleh dipakai untuk promosi dengan mencantumkan sumber.", "Free for promotion with credit."), images: [[asset("v3d-lake"), "Watu Lintang"], [asset("v3d-lake-dusk"), "Sunyaragi"], [asset("v3d-village"), tr("Bukit Kencana", "Kencana Hill")], [asset("v3d-beads-teal"), tr("Tenun ikat", "Ikat weaving")]], cols: 4 }),
      ],
      contact: () => [
        pageHead(W, { eyebrow: tr("Pusat informasi", "Visitor centre"), title: tr("Kami bantu merencanakan perjalanan", "We'll help plan your trip") }),
        formD(W, { title: tr("Tanya petugas", "Ask our staff"), info: [[tr("Alamat", "Address"), "Jl. Pelabuhan Lama 8"], [tr("Telepon", "Phone"), "(0371) 220 900"], [tr("Jam", "Hours"), tr("Setiap hari 08.00–20.00", "Daily 8am–8pm")]], fields: [{ kind: "input", label: tr("Nama", "Name"), ph: "" }, { kind: "input", label: "Email", ph: "", type: "email" }, { kind: "date", label: tr("Rencana tiba", "Arrival date") }], message: tr("Pertanyaan", "Question"), submit: tr("Kirim", "Send") }),
        locations(W, { title: tr("Pos informasi", "Information points"), image: asset("v3d-map-blue"), places: [[tr("Stasiun Sagarawangi", "Sagarawangi Station"), tr("Hall kedatangan", "Arrivals hall"), "07.00–19.00"], [tr("Terminal Pinggir Laut", "Pinggir Laut Terminal"), tr("Lantai 1", "Ground floor"), "06.00–18.00"], [tr("Dermaga Watu Lintang", "Watu Lintang Jetty"), tr("Loket tiket", "Ticket booth"), "06.00–17.00"]] }),
      ],
    });
  },
};

/* ------------- 4. Lindungara — asuransi jiwa & kesehatan (7 hlm) --------- */
// Premium: pricing-switch, comparison-table, pro-testimonials-wall, stats-counter, modal-popup. Library: AOS + Animate.

const LP: Palette = { ink: "#0b1b3f", muted: "#4a5a7a", primary: "#1d4ed8", primaryDark: "#1e3a8a", soft: "#dbeafe", line: "#bfdbfe" };
const LI = lookD(LP, { head: "Sora", body: "Inter", shape: "soft", radius: 24, bg: "#ffffff", alt: "#f1f6ff", inv: "#0b1b3f", fx: { aos: "fade-up", animate: "fadeInDown" } });

const liFoot = (tr: Tr) =>
  footerD("Lindungara", LI, {
    variant: "columns",
    about: tr("Lindungara Asuransi — perlindungan jiwa dan kesehatan untuk keluarga Indonesia. Perusahaan fiktif untuk contoh.", "Lindungara Insurance — life and health cover for Indonesian families. A fictional company for demo purposes."),
    cols: [
      { title: tr("Produk", "Products"), items: [tr("Kesehatan keluarga", "Family health"), tr("Jiwa berjangka", "Term life"), tr("Penyakit kritis", "Critical illness")] },
      { title: tr("Bantuan", "Help"), items: [tr("Klaim 24 jam", "24h claims"), "1500-777", "halo@lindungara.co.id"] },
    ],
    copy: tr("© 2026 Lindungara. Konten contoh, bukan penawaran asuransi nyata.", "© 2026 Lindungara. Sample content, not a real insurance offer."),
  });

export const insuranceLindungi: TemplateContent = {
  brand: "Lindungara",
  pages: [home(), pg("health", ["kesehatan", "Asuransi Kesehatan"], ["health", "Health Insurance"]), pg("life", ["jiwa", "Asuransi Jiwa"], ["life", "Life Insurance"]), pg("plans", ["paket", "Paket & Harga"], ["plans", "Plans & Pricing"]), pg("claims", ["klaim", "Klaim"], ["claims", "Claims"]), pg("about", ["tentang", "Tentang Kami"], ["about", "About Us"]), pg("contact", ["konsultasi", "Konsultasi"], ["consultation", "Consultation"])],
  build: (key, tr, href) =>
    render(LI, key, headerD("Lindungara", LI, { variant: "pill", cta: [tr("Cek premi", "Get a quote"), href("plans")], sticky: true }), liFoot(tr), {
      home: () => [
        heroBento(LI, {
          eyebrow: tr("Proteksi keluarga", "Family protection"),
          title: tr("Tenang menghadapi rumah sakit, tanpa drama dokumen", "Calm at the hospital, without paperwork drama"),
          text: tr("Kartu digital, rawat inap tanpa uang muka di 1.800 rumah sakit rekanan, dan klaim yang cair rata-rata dalam 3 hari.", "A digital card, cashless inpatient care at 1,800 partner hospitals and claims paid in 3 days on average."),
          image: asset("v3d-shield"),
          alt: tr("Perisai perlindungan", "Protective shield"),
          tiles: [["1.800+", tr("RS rekanan", "Partner hospitals")], ["3 hari", tr("Rata-rata klaim cair", "Average claim payout")], ["98%", tr("Klaim disetujui", "Claims approved")]],
          actions: [[tr("Bandingkan paket", "Compare plans"), href("plans")], [tr("Cara klaim", "How to claim"), href("claims"), "outline"]],
        }),
        counterD(LI, { items: [tr("420rb | Nasabah", "420k | Customers"), tr("1.800 | RS rekanan", "1,800 | Partner hospitals"), tr("Rp1,2 T | Klaim dibayar 2025", "Rp1.2T | Claims paid in 2025"), tr("24/7 | Layanan darurat", "24/7 | Emergency line")] }),
        bento(LI, { eyebrow: tr("Kenapa Lindungara", "Why Lindungara"), title: tr("Dirancang untuk hari terburuk Anda", "Designed for your worst day"), items: [{ title: tr("Tanpa uang muka", "No deposit"), text: tr("Cukup tunjukkan kartu digital di kasir rumah sakit.", "Just show your digital card at the hospital desk."), icon: "◈", wide: true }, { title: tr("Konsultasi dokter", "Doctor chat"), text: tr("Gratis 24 jam di aplikasi.", "Free 24h in the app."), icon: "✚", accent: true }, { title: tr("Premi tetap 5 tahun", "Fixed premium 5 years"), text: tr("Tidak naik walau ada klaim.", "Doesn't rise even after claims."), icon: "≡" }, { title: tr("Satu polis, satu keluarga", "One policy, one family"), text: tr("Pasangan dan hingga 3 anak.", "Spouse and up to 3 children."), icon: "♥", wide: true }] }),
        withFx(LI, testimonialsWall(pro(LI), tr, { title: tr("Nasabah yang sudah merasakan", "Customers who've been there"), score: 4.8, caption: tr("dari 9.200 ulasan aplikasi", "from 9,200 app reviews"), quotes: [{ text: tr("Anak saya dirawat 4 hari karena DBD. Pulang tanpa bayar sepeser pun.", "My son was hospitalised for 4 days with dengue. We left without paying a cent."), name: "Wulan Prameswari", role: tr("Nasabah sejak 2022", "Customer since 2022"), avatar: asset("v3d-face-2") }, { text: tr("Klaim rawat jalan cukup foto kuitansi. Cair dua hari kemudian.", "Outpatient claims are just a receipt photo. Paid two days later."), name: "Teguh Santoso", role: tr("Wiraswasta", "Business owner"), avatar: asset("v3d-face-1") }, { text: tr("Agennya jujur menjelaskan apa yang tidak ditanggung.", "The agent honestly explained what isn't covered."), name: "Maya Puspitasari", role: tr("Guru", "Teacher"), avatar: asset("v3d-face-6") }] })),
        offer(LI, { eyebrow: tr("Promo Oktober", "October offer"), title: tr("Gratis premi bulan pertama", "First month's premium free"), text: tr("Untuk pendaftaran paket keluarga sebelum 31 Oktober 2026.", "For family plans registered before 31 October 2026."), trigger: tr("Lihat syarat promo", "See offer terms"), modalTitle: tr("Syarat promo", "Offer terms"), body: tr("Berlaku untuk polis baru paket Keluarga atau Keluarga Plus, pembayaran bulanan via autodebet, minimal kepesertaan 12 bulan.", "Valid for new Family or Family Plus policies paid monthly by auto-debit, with a minimum 12-month term."), cta: tr("Daftar sekarang", "Sign up now"), href: href("plans") }),
      ],
      health: () => [
        pageHead(LI, { eyebrow: tr("Asuransi kesehatan", "Health insurance"), title: tr("Rawat inap, rawat jalan, dan gigi dalam satu kartu", "Inpatient, outpatient and dental on one card"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Kesehatan", "Health"), ""]] }),
        cardsD(LI, { title: tr("Yang ditanggung", "What's covered"), cols: 4, items: [{ icon: "▣", title: tr("Rawat inap", "Inpatient"), text: tr("Kamar, dokter, obat, operasi.", "Room, doctors, medicine, surgery.") }, { icon: "◫", title: tr("Rawat jalan", "Outpatient"), text: tr("Konsultasi dan obat resep.", "Consultations and prescriptions.") }, { icon: "◠", title: tr("Gigi", "Dental"), text: tr("Tambal, cabut, scaling.", "Fillings, extractions, scaling.") }, { icon: "◎", title: tr("Melahirkan", "Maternity"), text: tr("Normal dan caesar.", "Normal and caesarean.") }] }),
        specs(LI, { title: tr("Ketentuan penting", "Key terms"), rows: [[tr("Masa tunggu", "Waiting period"), tr("30 hari (umum), 12 bulan (penyakit tertentu)", "30 days (general), 12 months (specific conditions)")], [tr("Usia masuk", "Entry age"), tr("0–65 tahun", "0–65 years")], [tr("Wilayah", "Coverage area"), tr("Indonesia & Asia Tenggara", "Indonesia & Southeast Asia")], [tr("Pemeriksaan awal", "Medical check"), tr("Tidak wajib di bawah 45 tahun", "Not required under 45")]], image: asset("v3d-shield"), alt: tr("Perisai", "Shield") }),
      ],
      life: () => [
        pageHead(LI, { eyebrow: tr("Asuransi jiwa", "Life insurance"), title: tr("Warisan yang pasti untuk orang tersayang", "A certain legacy for your loved ones") }),
        splitPanel(LI, { title: tr("Jiwa berjangka murni", "Pure term life"), text: tr("Premi terjangkau, uang pertanggungan hingga Rp5 miliar, tanpa unsur investasi yang membingungkan.", "Affordable premiums, cover up to Rp5 billion and no confusing investment component."), bullets: [tr("Pilih masa 10, 20, atau 30 tahun", "Choose 10, 20 or 30 years"), tr("Bisa ditambah penyakit kritis", "Critical illness add-on available"), tr("Pembayaran klaim 7 hari kerja", "Claims paid in 7 working days")], image: asset("v3d-shield-orange"), alt: tr("Perlindungan", "Protection"), reverse: true }),
        zigzag(LI, { title: tr("Menentukan uang pertanggungan", "Choosing your cover amount"), steps: [[tr("Hitung kebutuhan", "Count the needs"), tr("Biaya hidup keluarga × jumlah tahun tanggungan.", "Family living costs × years of dependency.")], [tr("Kurangi aset", "Subtract assets"), tr("Tabungan dan aset yang mudah dicairkan.", "Savings and liquid assets.")], [tr("Tambah utang", "Add debts"), tr("KPR, cicilan kendaraan, biaya pendidikan.", "Mortgage, car loans, education costs.")]] }),
      ],
      plans: () => [
        pageHead(LI, { eyebrow: tr("Paket & harga", "Plans & pricing"), title: tr("Premi transparan, bayar bulanan atau tahunan", "Transparent premiums, monthly or yearly") }),
        priceSwitchD(LI, { title: tr("Pilih perlindungan", "Choose your cover"), plans: [tr("Lajang | Rp189rb | Rp1,9jt | Rawat inap Rp500rb/hari; Rawat jalan; Dokter 24 jam | Pilih Lajang", "Single | Rp189k | Rp1.9M | Inpatient Rp500k/day; Outpatient; 24h doctor | Choose Single"), tr("Keluarga | Rp549rb | Rp5,5jt | 2 dewasa + 3 anak; Melahirkan; Gigi | Pilih Keluarga", "Family | Rp549k | Rp5.5M | 2 adults + 3 children; Maternity; Dental | Choose Family"), tr("Keluarga Plus | Rp899rb | Rp9jt | Kamar VIP; Asia Tenggara; Penyakit kritis | Pilih Plus", "Family Plus | Rp899k | Rp9M | VIP room; Southeast Asia; Critical illness | Choose Plus")], labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 2 bulan", "2 months free"), tr("/bulan", "/month"), tr("/tahun", "/year")], href: href("contact") }),
        compareD(LI, { title: tr("Bandingkan manfaat", "Compare benefits"), columns: [tr("Lajang", "Single"), tr("Keluarga", "Family"), "Plus"], rows: [tr("Rawat inap tanpa uang muka | ya | ya | ya", "Cashless inpatient | yes | yes | yes"), tr("Melahirkan | tidak | ya | ya", "Maternity | no | yes | yes"), tr("Gigi | tidak | ya | ya", "Dental | no | yes | yes"), tr("Asia Tenggara | tidak | tidak | ya", "Southeast Asia | no | no | yes"), tr("Penyakit kritis | tidak | tidak | ya", "Critical illness | no | no | yes")], caption: tr("Manfaat per polis", "Benefits per policy") }),
      ],
      claims: () => [
        pageHead(LI, { eyebrow: tr("Klaim", "Claims"), title: tr("Klaim dari aplikasi, dipantau seperti paket kiriman", "Claim in the app, track it like a parcel") }),
        timelineD(LI, { title: tr("Alur klaim reimbursement", "Reimbursement claim flow"), items: [[tr("Hari 0", "Day 0"), tr("Unggah dokumen", "Upload documents"), tr("Foto kuitansi, resume medis, resep.", "Photos of receipts, medical summary, prescription.")], [tr("Hari 1", "Day 1"), tr("Verifikasi", "Verification"), tr("Tim medis memeriksa kelengkapan.", "Our medical team checks completeness.")], [tr("Hari 2–3", "Day 2–3"), tr("Persetujuan", "Approval"), tr("Notifikasi nominal yang disetujui.", "Notification of the approved amount.")], [tr("Hari 3", "Day 3"), tr("Dana cair", "Payout"), tr("Ditransfer ke rekening terdaftar.", "Transferred to your registered account.")]] }),
        faqD(LI, { title: tr("Pertanyaan klaim", "Claim questions"), items: [[tr("Batas waktu klaim?", "Claim deadline?"), tr("90 hari sejak keluar rumah sakit.", "90 days after discharge.")], [tr("Rumah sakit non-rekanan?", "Non-partner hospital?"), tr("Bisa, lewat reimbursement.", "Yes, via reimbursement.")], [tr("Dokumen asli perlu dikirim?", "Send original documents?"), tr("Tidak, cukup foto yang jelas.", "No, clear photos are enough.")], [tr("Klaim ditolak?", "Claim rejected?"), tr("Anda bisa mengajukan banding dalam 30 hari.", "You can appeal within 30 days.")]] }),
      ],
      about: () => [
        pageHead(LI, { eyebrow: tr("Tentang", "About"), title: tr("Asuransi yang bicara dengan bahasa manusia", "Insurance that speaks human") }),
        editorial(LI, { title: tr("Prinsip kami", "Our principles"), cols: [[tr("Jelas", "Clear"), tr("Polis maksimal 6 halaman dengan ringkasan satu lembar.", "Policies max 6 pages with a one-page summary.")], [tr("Cepat", "Fast"), tr("Target klaim cair 3 hari kerja.", "Target payout in 3 working days.")], [tr("Jujur", "Honest"), tr("Pengecualian ditulis di halaman pertama.", "Exclusions written on page one.")]] }),
        numbers(LI, { items: [["2009", tr("Berdiri", "Founded")], ["31", tr("Kantor cabang", "Branches")], ["1.240", tr("Agen bersertifikat", "Certified agents")], ["A+", tr("Peringkat kesehatan keuangan (contoh)", "Financial strength rating (sample)")]] }),
      ],
      contact: () => [
        pageHead(LI, { eyebrow: tr("Konsultasi", "Consultation"), title: tr("Bicara dengan penasihat, tanpa paksaan", "Talk to an adviser, no pressure") }),
        formD(LI, { title: tr("Jadwalkan panggilan", "Schedule a call"), info: [[tr("Telepon", "Phone"), "1500-777"], ["WhatsApp", "0811 1500 777"], [tr("Jam layanan", "Hours"), tr("Setiap hari 07.00–22.00", "Daily 7am–10pm")]], fields: [{ kind: "input", label: tr("Nama lengkap", "Full name"), ph: "" }, { kind: "input", label: tr("No. telepon", "Phone"), ph: "08xx" }, { kind: "select", label: tr("Minat", "Interest"), ph: tr("Pilih", "Choose"), options: [tr("Kesehatan", "Health"), tr("Jiwa", "Life"), tr("Keduanya", "Both")] }, { kind: "date", label: tr("Waktu dihubungi", "Call time"), mode: "datetime-local" }], submit: tr("Minta dihubungi", "Request a call") }),
      ],
    }),
};

/* --------- 5. KemudiAman — asuransi kendaraan (5 hlm, Premium) -------- */
// Premium: pricing, before-after. Library: Animate + Tilt. Gaya brutalis.

const AP: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#ea580c", primaryDark: "#c2410c", soft: "#ffedd5", line: "#fed7aa" };
const AU = lookD(AP, { head: "Archivo Black", body: "Rubik", shape: "brutal", radius: 0, bg: "#fffbf5", alt: "#fde68a", inv: "#1c1917", fx: { animate: "backInUp", tilt: true }, upper: true });

const auFoot = (tr: Tr) =>
  footerD("KemudiAman", AU, {
    variant: "slim",
    about: tr("Asuransi mobil & motor dengan klaim lewat video call. Perusahaan fiktif untuk contoh.", "Car & motorbike insurance with video-call claims. A fictional company for demo purposes."),
    social: ["Instagram | https://instagram.com/kemudiaman", "YouTube | https://youtube.com/@kemudiaman"],
    copy: tr("© 2026 KemudiAman. Konten contoh.", "© 2026 KemudiAman. Sample content."),
  });

export const insuranceAuto: TemplateContent = {
  brand: "KemudiAman",
  pages: [home(), pg("cover", ["perlindungan", "Perlindungan"], ["coverage", "Coverage"]), pg("claims", ["klaim", "Klaim"], ["claims", "Claims"]), pg("workshops", ["bengkel-rekanan", "Bengkel Rekanan"], ["partner-garages", "Partner Garages"]), pg("quote", ["cek-premi", "Cek Premi"], ["get-quote", "Get a Quote"])],
  build: (key, tr, href) =>
    render(AU, key, headerD("KemudiAman", AU, { variant: "bar", cta: [tr("Cek premi", "Get a quote"), href("quote")] }), auFoot(tr), {
      home: () => [
        heroBrutal(AU, {
          sticker: tr("Klaim via video call!", "Claim by video call!"),
          title: tr("Penyok sedikit? Lapor 5 menit.", "A little dent? Report in 5 minutes."),
          text: tr("Asuransi mobil & motor tanpa survei ke rumah. Rekam kerusakan, petugas kami menilai langsung lewat video, mobil masuk bengkel besoknya.", "Car & motorbike insurance with no home survey. Film the damage, our assessor reviews it live by video, and your car goes to the garage the next day."),
          image: asset("v3d-car"),
          alt: tr("Mobil oranye", "An orange car"),
          actions: [[tr("Hitung premi", "Calculate premium"), href("quote")], [tr("Lihat perlindungan", "See coverage"), href("cover"), "outline"]],
        }),
        wordBand(AU, [tr("All risk", "All risk"), "TLO", tr("Derek 24 jam", "24h towing"), tr("Bengkel resmi", "Authorised garages"), tr("Mobil pengganti", "Courtesy car")]),
        cardsD(AU, { title: tr("Kenapa pengemudi pindah ke kami", "Why drivers switch to us"), items: [{ icon: "01", title: tr("Survei video", "Video survey"), text: tr("Tidak perlu menunggu surveyor datang.", "No waiting for a surveyor.") }, { icon: "02", title: tr("Derek gratis", "Free towing"), text: tr("Hingga 100 km, 24 jam.", "Up to 100 km, 24 hours.") }, { icon: "03", title: tr("Diskon tanpa klaim", "No-claim discount"), text: tr("Premi turun 10% tiap tahun bebas klaim.", "Premium drops 10% each claim-free year.") }] }),
        beforeAfterD(AU, { title: tr("Hasil bengkel rekanan", "Partner garage results"), text: tr("Geser untuk melihat sebelum dan sesudah perbaikan.", "Slide to see before and after the repair."), before: asset("v3d-car-dent"), after: asset("v3d-car"), labels: [tr("Sebelum", "Before"), tr("Sesudah", "After")], alt: tr("Perbaikan bodi mobil", "Car body repair") }),
      ],
      cover: () => [
        pageHead(AU, { eyebrow: tr("Perlindungan", "Coverage"), title: tr("All risk atau TLO?", "All risk or TLO?"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Perlindungan", "Coverage"), ""]] }),
        plansD(AU, { title: tr("Paket tahunan", "Annual plans"), items: [{ plan: "TLO", price: "1,2%", period: tr("dari harga kendaraan", "of vehicle value"), description: tr("Untuk mobil di atas 7 tahun.", "For cars over 7 years old."), features: [tr("Hilang dicuri", "Theft"), tr("Rusak > 75%", "Damage > 75%"), tr("Derek 50 km", "Towing 50 km")], buttonText: tr("Pilih TLO", "Choose TLO"), buttonHref: href("quote") }, { plan: "All Risk", price: "2,4%", period: tr("dari harga kendaraan", "of vehicle value"), description: tr("Paling banyak dipilih.", "Most popular."), features: [tr("Semua kerusakan", "All damage"), tr("Bengkel resmi", "Authorised garages"), tr("Derek 100 km", "Towing 100 km"), tr("Mobil pengganti 5 hari", "Courtesy car 5 days")], buttonText: tr("Pilih All Risk", "Choose All Risk"), buttonHref: href("quote"), featured: true, badge: tr("Favorit", "Favourite") }, { plan: tr("Motor", "Motorbike"), price: "Rp350rb", period: tr("/tahun", "/year"), description: tr("Untuk motor hingga 5 tahun.", "For bikes up to 5 years."), features: [tr("Hilang dicuri", "Theft"), tr("Kecelakaan diri", "Personal accident")], buttonText: tr("Pilih Motor", "Choose Motorbike"), buttonHref: href("quote") }] }),
        tableD(AU, { title: tr("Perluasan opsional", "Optional extensions"), columns: [tr("Perluasan", "Extension"), tr("Tambahan premi", "Extra premium")], rows: [[tr("Banjir & angin topan", "Flood & storm"), "0,1%"], [tr("Huru-hara", "Riot"), "0,05%"], [tr("Tanggung jawab pihak ketiga", "Third-party liability"), "Rp150rb"]] }),
      ],
      claims: () => [
        pageHead(AU, { eyebrow: tr("Klaim", "Claims"), title: tr("Empat langkah, satu hari", "Four steps, one day") }),
        zigzag(AU, { title: tr("Cara klaim", "How to claim"), steps: [[tr("Telepon atau chat", "Call or chat"), tr("Hubungi 1500-404 atau tombol klaim di aplikasi.", "Call 1500-404 or tap claim in the app.")], [tr("Video call", "Video call"), tr("Tunjukkan kerusakan; penilaian selesai di tempat.", "Show the damage; assessment done on the spot.")], [tr("Pilih bengkel", "Pick a garage"), tr("Antar sendiri atau kami jemput.", "Drop it off or we pick it up.")], [tr("Ambil mobil", "Collect your car"), tr("Garansi perbaikan 6 bulan.", "6-month repair warranty.")]] }),
        faqD(AU, { title: tr("Soal klaim", "About claims"), items: [[tr("Ada biaya risiko sendiri?", "Is there a deductible?"), tr("Rp300.000 per kejadian.", "Rp300,000 per incident.")], [tr("Boleh pilih bengkel sendiri?", "Can I choose my own garage?"), tr("Boleh, dengan penggantian sesuai tarif rekanan.", "Yes, reimbursed at partner rates.")], [tr("Berapa lama perbaikan?", "How long are repairs?"), tr("Rata-rata 5 hari kerja.", "5 working days on average.")], [tr("Kecelakaan di luar kota?", "Accident out of town?"), tr("Derek dan bengkel tersedia di 120 kota.", "Towing and garages in 120 cities.")]] }),
      ],
      workshops: () => [
        pageHead(AU, { eyebrow: tr("Bengkel rekanan", "Partner garages"), title: tr("640 bengkel di 120 kota", "640 garages in 120 cities") }),
        locations(AU, { title: tr("Bengkel unggulan", "Featured garages"), image: asset("v3d-map"), places: [[tr("Bengkel Cat Prima Jaya", "Prima Jaya Body Shop"), "Jl. Raya Bekasi Km 18", tr("Sen–Sab 08.00–17.00", "Mon–Sat 8am–5pm")], [tr("Garasi Sentosa Motor", "Sentosa Motor Garage"), "Jl. Soekarno-Hatta 112, Bandung", tr("Setiap hari", "Daily")], [tr("Bengkel Bodi Mulia", "Mulia Body Repair"), "Jl. Ahmad Yani 40, Surabaya", tr("Sen–Sab", "Mon–Sat")]] }),
        numbers(AU, { inv: true, items: [["640", tr("Bengkel", "Garages")], ["120", tr("Kota", "Cities")], ["5 hari", tr("Rata-rata perbaikan", "Average repair")], ["6 bln", tr("Garansi", "Warranty")]] }),
      ],
      quote: () => [
        pageHead(AU, { eyebrow: tr("Cek premi", "Get a quote"), title: tr("Hitung premi dalam 1 menit", "Get a premium in 1 minute") }),
        formD(AU, { title: tr("Data kendaraan", "Vehicle details"), info: [[tr("Telepon", "Phone"), "1500-404"], ["WhatsApp", "0811 404 1500"]], fields: [{ kind: "select", label: tr("Jenis", "Type"), ph: tr("Pilih", "Choose"), options: [tr("Mobil", "Car"), tr("Motor", "Motorbike")] }, { kind: "input", label: tr("Merek & model", "Make & model"), ph: tr("mis. MPV 1.5", "e.g. MPV 1.5") }, { kind: "input", label: tr("Tahun", "Year"), ph: "2022" }, { kind: "input", label: tr("Kota", "City"), ph: "" }], submit: tr("Lihat premi", "See premium"), formFirst: true }),
        ctaD(AU, { title: tr("Masih ragu? Tanya dulu.", "Not sure yet? Just ask."), actions: [[tr("Chat WhatsApp", "WhatsApp chat"), "https://wa.me/628114041500"]], tone: "primary" }),
      ],
    }),
};
