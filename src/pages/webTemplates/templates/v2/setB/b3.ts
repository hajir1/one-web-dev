import { faqAccordion, featuresIcons, pricingCards, statsBand, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { Palette } from "../../../build";
import type { TemplateContent } from "../../../types";
import { FONTS, centeredHeader, cta, footer, header } from "../../pro/kit";
import {
  P,
  article,
  asset,
  cards,
  compareSec,
  counters,
  countdownSec,
  ctaSplit,
  footerSlim,
  formSec,
  heroImage,
  heroSplit,
  heroType,
  imgCards,
  infoBar,
  logos,
  look,
  mega,
  newsletter,
  pageHead,
  priceList,
  products,
  progressSec,
  quote,
  render,
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
/* Set B · part 3: Toy Store, Pet Shop, Coffee Farm, Cargo, Esports.     */
/* ================================================================== */

/* --------------------- 11. kids-toystore (PREMIUM, 5) -------------- */

const KC: Palette = { ink: "#1e3a8a", muted: "#475569", primary: "#f43f5e", primaryDark: "#e11d48", soft: "#fff1f2", line: "#fecdd3" };
const kcL = look(KC, { font: FONTS.rounded, r: 26, dark: "#1e3a8a", alt: "#fefce8", onDark: "#bfdbfe" });

export const kidsToystore: TemplateContent = {
  brand: "Kelereng Ceria",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("toys", "Mainan", "Toys", "mainan", "toys"),
    P("ages", "Panduan Usia", "Age Guide", "panduan-usia", "age-guide"),
    P("parties", "Pesta Ulang Tahun", "Birthday Parties", "pesta", "parties"),
    P("visit", "Kunjungi Toko", "Visit Us", "kunjungi", "visit"),
  ],
  build: (key, tr, href) => {
    const L = kcL;
    const head = header("Kelereng Ceria ●", KC, { font: FONTS.rounded, ink: "#1e3a8a", cta: cta(tr("Pesan pesta", "Book a party"), href("parties"), KC) });
    const foot = footer("Kelereng Ceria", tr("Toko mainan edukatif & ruang bermain di Malang.", "Educational toy store & play space in Malang."), [{ title: tr("Toko", "Store"), items: ["Jl. Ijen 52, Malang", tr("Setiap hari 09.00–21.00", "Daily 9am–9pm")] }, { title: tr("Kontak", "Contact"), items: ["+62 341 555 120", "main@kelereng.example"] }], tr("© 2026 Kelereng Ceria. Harga contoh.", "© 2026 Kelereng Ceria. Sample prices."), "#1e3a8a");
    const toys = [
      { image: "v2b-toy-blocks", title: tr("Balok Huruf Kayu 26 pcs", "26-piece Wooden Letter Blocks"), text: tr("Usia 2+ · kayu pinus, cat food grade", "Ages 2+ · pine wood, food-grade paint"), price: "Rp189.000", badge: tr("Terlaris", "Best seller"), rating: 4.9, reviews: "(318)" },
      { image: "v2b-toy-bear", title: tr("Boneka Beruang Kopi", "Coffee Bear Plush"), text: tr("Usia 0+ · katun organik, 32 cm", "Ages 0+ · organic cotton, 32 cm"), price: "Rp225.000", rating: 4.8, reviews: "(146)" },
      { image: "v2b-toy-train", title: tr("Kereta Rel Magnet", "Magnetic Train Set"), text: tr("Usia 3+ · 42 keping rel", "Ages 3+ · 42 track pieces"), price: "Rp349.000", compare: "Rp399.000", rating: 4.7, reviews: "(89)" },
      { image: "v2b-toy-rocket", title: tr("Roket Sains DIY", "DIY Science Rocket"), text: tr("Usia 7+ · meluncur 20 m", "Ages 7+ · launches 20 m"), price: "Rp159.000", badge: tr("Baru", "New"), rating: 4.6, reviews: "(57)" },
      { image: "v2b-toy-blocks", title: tr("Puzzle Peta Indonesia", "Indonesia Map Puzzle"), text: tr("Usia 5+ · 38 provinsi", "Ages 5+ · 38 provinces"), price: "Rp129.000", rating: 4.9, reviews: "(204)" },
      { image: "v2b-toy-bear", title: tr("Set Masak-masakan Rotan", "Rattan Play Kitchen Set"), text: tr("Usia 3+ · buatan perajin Cirebon", "Ages 3+ · made by Cirebon artisans"), price: "Rp279.000", rating: 4.8, reviews: "(76)" },
    ];
    return render(L, key, head, foot, {
      home: () => [
        sliderSec(L, [[tr("Mainan kayu buatan perajin lokal", "Wooden toys by local artisans"), tr("Aman, awet, tanpa baterai.", "Safe, durable, no batteries."), "#f43f5e"], [tr("Ruang bermain gratis tiap Sabtu", "Free play room every Saturday"), tr("Dipandu kakak pendamping.", "Guided by play hosts."), "#2563eb"], [tr("Pesta ulang tahun di toko", "Birthday parties in store"), tr("Mulai Rp1,5jt untuk 12 anak.", "From Rp1.5m for 12 kids."), "#f59e0b"]], { height: 360, padY: 32 }),
        cards(L, { title: tr("Belanja menurut usia", "Shop by age"), cols: 4, align: "center", items: [{ icon: "👶", title: "0–2", text: tr("Sensori & genggam", "Sensory & grasp"), link: [tr("Lihat", "See"), href("ages")] }, { icon: "🧸", title: "3–5", text: tr("Peran & kreativitas", "Pretend & create"), link: [tr("Lihat", "See"), href("ages")] }, { icon: "🧩", title: "6–8", text: tr("Logika & sains", "Logic & science"), link: [tr("Lihat", "See"), href("ages")] }, { icon: "🚀", title: "9+", text: tr("Proyek & STEM", "Projects & STEM"), link: [tr("Lihat", "See"), href("ages")] }], bg: L.alt }),
        products(L, { ey: tr("Pilihan minggu ini", "This week's picks"), title: tr("Disukai anak, disetujui orang tua", "Kid-loved, parent-approved"), items: toys.slice(0, 3), cta: tr("Lihat mainan", "See toy"), href: href("toys") }),
        testiCards(L, { title: tr("Kata para orang tua", "What parents say"), items: [{ quote: tr("Mainannya awet banget, balok hurufnya sudah dipakai dua anak.", "So durable, the letter blocks have survived two kids."), author: "Rina Kartika", role: tr("Ibu dari Kenzo & Ara", "Mom of Kenzo & Ara"), avatar: "v2b-face-4" }, { quote: tr("Pesta ulang tahun di sini praktis, anak-anak sibuk main 2 jam.", "Parties here are easy, kids played for 2 straight hours."), author: "Agus Salim", role: tr("Ayah dari Naila", "Dad of Naila"), avatar: "v2b-face-5" }, { quote: tr("Stafnya membantu memilih mainan sesuai tahap perkembangan.", "Staff helped pick toys that fit developmental stages."), author: "Dewi Anggraini", role: tr("Guru PAUD", "Preschool teacher"), avatar: "v2b-face-2" }] }),
      ],
      toys: () => [
        pageHead(L, { ey: tr("Mainan", "Toys"), title: tr("Katalog mainan", "Toy catalog"), text: tr("Semua mainan lolos SNI dan bebas BPA.", "All toys are SNI certified and BPA free."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Mainan", "Toys"), ""]], bg: L.p.soft }),
        products(L, { items: toys, cta: tr("Tanya stok", "Ask about stock"), href: href("visit") }),
        newsletter(L, { title: tr("Kabar mainan baru", "New toy alerts"), text: tr("Sebulan sekali, plus ide bermain di rumah.", "Once a month, plus play ideas for home."), ph: "ayah.bunda@email.com", btn: tr("Daftar", "Sign up"), bg: L.alt }),
      ],
      ages: () => [
        pageHead(L, { ey: tr("Panduan usia", "Age guide"), title: tr("Mainan yang tepat di waktu yang tepat", "The right toy at the right time"), center: true }),
        tabsSec(L, { title: tr("Tahap perkembangan", "Developmental stages"), variant: "pills", tabs: [["0–2", tr("Fokus pada indra dan motorik kasar: mainan bertekstur, kerincingan kayu, buku kain.", "Focus on senses and gross motor skills: textured toys, wooden rattles, cloth books.")], ["3–5", tr("Bermain peran dan bahasa: set masak, boneka, balok huruf.", "Pretend play and language: play kitchens, dolls, letter blocks.")], ["6–8", tr("Logika & sebab-akibat: puzzle 100 keping, kereta magnet, permainan papan.", "Logic & cause-and-effect: 100-piece puzzles, magnetic trains, board games.")], ["9+", tr("Proyek mandiri: kit sains, robotik sederhana, origami.", "Independent projects: science kits, simple robotics, origami.")]] }),
        split(L, { title: tr("Konsultasi gratis dengan terapis bermain", "Free consult with a play therapist"), paras: [tr("Setiap Sabtu 10.00–13.00, terapis okupasi kami membantu memilih mainan untuk kebutuhan khusus.", "Every Saturday 10am–1pm, our occupational therapist helps choose toys for special needs.")], image: "v2b-toy-blocks", alt: tr("Balok mainan", "Toy blocks"), btn: [tr("Kunjungi toko", "Visit the store"), href("visit")], bg: L.alt }),
      ],
      parties: () => [
        heroSplit(L, { ey: tr("Pesta ulang tahun", "Birthday parties"), title: tr("Pesta 2 jam, orang tua tinggal duduk manis", "A 2-hour party, parents just relax"), text: tr("Ruang bermain privat, kakak pendamping, kue, dan goodie bag mainan kayu.", "Private play room, party hosts, cake, and wooden toy goodie bags."), btns: [[tr("Pesan tanggal", "Book a date"), href("visit")]], image: "v2b-toy-rocket", alt: tr("Roket mainan", "Toy rocket"), gradient: ["#fefce8", "#fff1f2", 135] }),
        priceList(L, { title: tr("Paket pesta", "Party packages"), groups: [{ name: tr("Paket", "Packages"), items: [["Ceria", tr("12 anak · 2 jam · kue 18 cm", "12 kids · 2 hrs · 18 cm cake"), "Rp1,5jt"], ["Riang", tr("20 anak · 2,5 jam · dekorasi tema", "20 kids · 2.5 hrs · themed décor"), "Rp2,6jt"], ["Gembira", tr("30 anak · 3 jam · badut & sulap", "30 kids · 3 hrs · clown & magic"), "Rp3,9jt"]] }, { name: tr("Tambahan", "Add-ons"), items: [[tr("Goodie bag premium", "Premium goodie bag"), tr("per anak", "per child"), "Rp45rb"], [tr("Fotografer", "Photographer"), tr("2 jam", "2 hrs"), "Rp600rb"], [tr("Melukis wajah", "Face painting"), "", "Rp350rb"]] }] }),
      ],
      visit: () => [
        formSec(L, { ey: tr("Kunjungi", "Visit"), title: tr("Datang & bermain", "Come and play"), info: [[tr("Alamat", "Address"), "Jl. Ijen 52, Malang"], [tr("Jam", "Hours"), tr("Setiap hari 09.00–21.00", "Daily 9am–9pm")], ["WhatsApp", "+62 812 3355 1200"]], fields: [{ k: "input", label: tr("Nama orang tua", "Parent's name"), ph: tr("Nama", "Name") }, { k: "select", label: tr("Keperluan", "Purpose"), ph: tr("Pilih", "Choose"), options: [tr("Tanya stok", "Stock question"), tr("Pesta ulang tahun", "Birthday party"), tr("Konsultasi terapis", "Therapist consult")] }, { k: "date", label: tr("Tanggal", "Date") }], submit: tr("Kirim", "Send") }),
        infoBar(L, [[tr("Parkir", "Parking"), tr("Gratis 2 jam", "Free 2 hours")], [tr("Ruang menyusui", "Nursing room"), tr("Tersedia", "Available")], [tr("Kereta bayi", "Strollers"), tr("Akses ramah", "Accessible")]]),
      ],
    });
  },
};

/* ----------------------- 12. pets-shop (PREMIUM, 6) ---------------- */

const PW: Palette = { ink: "#3b2410", muted: "#6b4f3a", primary: "#f97316", primaryDark: "#c2410c", soft: "#fff7ed", line: "#fed7aa" };
const pwL = look(PW, { font: FONTS.rounded, r: 20, dark: "#134e4a", alt: "#f0fdfa", onDark: "#99f6e4" });

export const petsShop: TemplateContent = {
  brand: "Pawpuri Petshop",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("products", "Produk", "Products", "produk", "products"),
    P("grooming", "Grooming", "Grooming", "grooming", "grooming"),
    P("hotel", "Penitipan", "Pet Hotel", "penitipan", "pet-hotel"),
    P("clinic", "Klinik", "Clinic", "klinik", "clinic"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = pwL;
    const head = withTopbar(header("pawpuri 🐾", PW, { font: FONTS.rounded, cta: cta(tr("Booking grooming", "Book grooming"), href("grooming"), PW) }), L, tr("Gratis ongkir Bandung untuk belanja Rp250rb+", "Free Bandung delivery on orders over Rp250k"), { bg: "#134e4a" });
    const foot = footerSlim(L, "pawpuri 🐾", [[tr("Produk", "Products"), href("products")], ["Grooming", href("grooming")], [tr("Penitipan", "Pet hotel"), href("hotel")], [tr("Klinik", "Clinic"), href("clinic")]], tr("© 2026 Pawpuri Petshop · Bandung. Harga contoh.", "© 2026 Pawpuri Petshop · Bandung. Sample prices."), { bg: "#134e4a" });
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { badge: tr("Grooming · Hotel · Klinik · Toko", "Grooming · Hotel · Clinic · Shop"), title: tr("Semua untuk anabul, di satu tempat", "Everything for your furry family, in one place"), text: tr("Makanan premium, grooming bebas stres, dan dokter hewan jaga 7 hari seminggu di Dago, Bandung.", "Premium food, stress-free grooming, and a vet on duty 7 days a week in Dago, Bandung."), btns: [[tr("Belanja", "Shop"), href("products")], [tr("Booking grooming", "Book grooming"), href("grooming")]], image: "v2b-pet-cat", alt: tr("Kucing", "Cat"), ratio: "1 / 1", bg: PW.soft }),
        featuresIcons(L.t, tr, { title: tr("Kenapa pemilik hewan memilih kami", "Why pet parents choose us"), items: [{ icon: "🛁", title: tr("Grooming tanpa kandang", "Cage-free grooming"), text: tr("Hewan menunggu di ruang bermain, bukan kandang.", "Pets wait in a play area, not cages.") }, { icon: "🩺", title: tr("Dokter jaga", "Vet on duty"), text: tr("Setiap hari 09.00–21.00.", "Daily 9am–9pm.") }, { icon: "📷", title: tr("Kamera live", "Live camera"), text: tr("Pantau anabul di penitipan dari HP.", "Watch your pet at the hotel from your phone.") }] }),
        products(L, { ey: tr("Terlaris", "Best sellers"), title: tr("Belanja kebutuhan harian", "Everyday essentials"), items: [{ image: "v2b-pack-food", title: tr("Makanan Kucing Salmon 1,5 kg", "Salmon Cat Food 1.5 kg"), text: tr("Grain free, untuk kucing dewasa", "Grain free, adult cats"), price: "Rp185.000", rating: 4.9, reviews: "(512)" }, { image: "v2b-pack-vitamin", title: tr("Vitamin Bulu & Kulit", "Skin & Coat Vitamin"), text: tr("Omega 3 & 6, 60 tablet", "Omega 3 & 6, 60 tablets"), price: "Rp98.000", rating: 4.7, reviews: "(144)" }, { image: "v2b-pet-dog", title: tr("Kalung Reflektif", "Reflective Collar"), text: tr("Ukuran S–XL, gesper aman", "Sizes S–XL, safety buckle"), price: "Rp75.000", badge: tr("Baru", "New"), rating: 4.8, reviews: "(61)" }], cta: tr("Detail", "Details"), href: href("products"), bg: L.alt }),
        testimonialsWall(L.t, tr, { title: tr("Anabul senang, pemilik tenang", "Happy pets, relaxed owners"), score: 4.9, caption: tr("dari 2.100 ulasan", "from 2,100 reviews"), quotes: [{ text: tr("Mochi biasanya stres kalau dimandikan. Di sini dia malah tertidur.", "Mochi usually panics at bath time. Here she fell asleep."), name: "Nadia Putri Ayu", role: tr("Pemilik kucing Persia", "Persian cat owner"), avatar: asset("v2b-face-2") }, { text: tr("Penitipan selama mudik 10 hari, dapat foto & video setiap hari.", "10-day stay during the holidays, with photos & videos every day."), name: "Ardi Wibowo", role: tr("Pemilik Golden Retriever", "Golden Retriever owner"), avatar: asset("v2b-face-1") }, { text: tr("Dokternya teliti dan menjelaskan dengan sabar.", "The vet is thorough and patient in explaining."), name: "Shinta Lestari", role: tr("Pemilik dua kucing domestik", "Owner of two domestic cats"), avatar: asset("v2b-face-6") }] }),
      ],
      products: () => [
        pageHead(L, { ey: tr("Produk", "Products"), title: tr("Makanan, vitamin, dan aksesori", "Food, vitamins, and accessories"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Produk", "Products"), ""]] }),
        products(L, { cols: 4, items: [{ image: "v2b-pack-food", title: tr("Makanan Kucing Salmon", "Salmon Cat Food"), text: "1,5 kg", price: "Rp185.000", rating: 4.9, reviews: "(512)" }, { image: "v2b-pack-food", title: tr("Makanan Anjing Domba", "Lamb Dog Food"), text: "3 kg", price: "Rp310.000", rating: 4.8, reviews: "(233)" }, { image: "v2b-pack-vitamin", title: tr("Vitamin Bulu", "Coat Vitamin"), text: tr("60 tablet", "60 tablets"), price: "Rp98.000", rating: 4.7, reviews: "(144)" }, { image: "v2b-pack-cream", title: tr("Salep Luka Hewan", "Pet Wound Ointment"), text: "30 g", price: "Rp65.000", rating: 4.6, reviews: "(88)" }, { image: "v2b-pet-dog", title: tr("Kalung Reflektif", "Reflective Collar"), text: "S–XL", price: "Rp75.000", rating: 4.8, reviews: "(61)" }, { image: "v2b-pet-cat", title: tr("Mainan Pancing Bulu", "Feather Teaser"), text: tr("Tongkat 60 cm", "60 cm wand"), price: "Rp35.000", rating: 4.9, reviews: "(301)" }, { image: "v2b-pack-medkit", title: tr("Kotak P3K Hewan", "Pet First-Aid Kit"), text: tr("18 item", "18 items"), price: "Rp145.000", rating: 4.7, reviews: "(40)" }, { image: "v2b-pack-vitamin", title: tr("Pasir Kucing Tofu", "Tofu Cat Litter"), text: "6 L", price: "Rp79.000", rating: 4.8, reviews: "(420)" }], cta: tr("Pesan via WA", "Order via WhatsApp"), href: href("contact") }),
      ],
      grooming: () => [
        pageHead(L, { ey: "Grooming", title: tr("Mandi, potong, dan manjakan", "Bath, trim, and pamper"), text: tr("Groomer bersertifikat, sampo hipoalergenik, pengering senyap.", "Certified groomers, hypoallergenic shampoo, quiet dryers."), image: "v2b-pet-dog" }),
        pricingCards(L.t, tr, { eyebrow: tr("Paket grooming", "Grooming packages"), title: tr("Harga untuk kucing & anjing kecil", "Prices for cats & small dogs"), text: tr("Anjing > 10 kg +Rp50rb.", "Dogs > 10 kg add Rp50k."), badge: tr("Favorit", "Favorite"), plans: [{ name: tr("Mandi Sehat", "Healthy Bath"), price: "Rp85rb", period: "", text: tr("45 menit.", "45 min."), features: [tr("Mandi 2× sampo", "Double shampoo"), tr("Potong kuku", "Nail trim"), tr("Bersih telinga", "Ear cleaning")], cta: { label: tr("Booking", "Book"), href: href("contact") } }, { name: tr("Grooming Lengkap", "Full Groom"), price: "Rp160rb", period: "", text: tr("90 menit.", "90 min."), features: [tr("Semua di Mandi Sehat", "Everything in Healthy Bath"), tr("Potong bulu gaya", "Styled haircut"), tr("Anti kutu", "Flea treatment"), tr("Parfum", "Cologne")], cta: { label: tr("Booking", "Book"), href: href("contact") }, featured: true }, { name: tr("Spa Anabul", "Pet Spa"), price: "Rp240rb", period: "", text: tr("120 menit.", "120 min."), features: [tr("Grooming lengkap", "Full groom"), tr("Masker lumpur", "Mud mask"), tr("Pijat relaksasi", "Relaxing massage")], cta: { label: tr("Booking", "Book"), href: href("contact") } }] }),
        steps(L, { title: tr("Alur grooming", "Grooming flow"), items: [[tr("Cek kesehatan", "Health check"), tr("Kulit, kutu, luka.", "Skin, fleas, wounds.")], [tr("Mandi", "Bath"), tr("Air hangat 32°C.", "Warm water at 32°C.")], [tr("Pengeringan", "Drying"), tr("Pengering senyap.", "Quiet dryers.")], [tr("Foto", "Photo"), tr("Dikirim ke WhatsApp.", "Sent via WhatsApp.")]], bg: L.alt }),
      ],
      hotel: () => [
        pageHead(L, { ey: tr("Penitipan", "Pet hotel"), title: tr("Hotel anabul ber-AC dengan kamera live", "Air-conditioned pet hotel with live cameras"), dark: true }),
        tableSec(L, { title: tr("Tarif per malam", "Nightly rates"), columns: [tr("Kamar", "Room"), tr("Ukuran", "Size"), tr("Cocok untuk", "Suits"), tr("Tarif", "Rate")], rows: [[tr("Kabin Kucing", "Cat Cabin"), "1×1 m", tr("1–2 kucing", "1–2 cats"), "Rp75rb"], [tr("Suite Kucing", "Cat Suite"), "2×1,5 m", tr("hingga 4 kucing", "up to 4 cats"), "Rp140rb"], [tr("Kamar Anjing S", "Dog Room S"), "1,5×1,5 m", "< 10 kg", "Rp110rb"], [tr("Kamar Anjing L", "Dog Room L"), "2,5×2 m", "10–35 kg", "Rp180rb"]], caption: tr("Termasuk makan 2× sehari dan main 30 menit.", "Includes 2 meals a day and 30 minutes of play.") }),
        formSec(L, { title: tr("Pesan kamar", "Book a room"), fields: [{ k: "select", label: tr("Jenis hewan", "Pet type"), ph: tr("Pilih", "Choose"), options: [tr("Kucing", "Cat"), tr("Anjing", "Dog")] }, { k: "date", label: "Check-in" }, { k: "date", label: "Check-out" }, { k: "check", label: tr("Vaksin lengkap (wajib)", "Fully vaccinated (required)") }], submit: tr("Pesan", "Book"), info: [[tr("Syarat", "Requirement"), tr("Buku vaksin & bebas kutu", "Vaccine record & flea-free")]] }),
      ],
      clinic: () => [
        pageHead(L, { ey: tr("Klinik", "Clinic"), title: tr("Klinik hewan Pawpuri", "Pawpuri vet clinic"), center: true }),
        cards(L, { cols: 3, items: [{ icon: "💉", title: tr("Vaksinasi", "Vaccination"), text: tr("Tricat, F4, DHPPi, rabies. Mulai Rp180rb.", "Tricat, F4, DHPPi, rabies. From Rp180k.") }, { icon: "✂️", title: tr("Sterilisasi", "Spay & neuter"), text: tr("Kucing jantan Rp550rb, betina Rp850rb.", "Male cats Rp550k, female Rp850k.") }, { icon: "🦷", title: tr("Scaling gigi", "Dental scaling"), text: tr("Dengan bius ringan. Rp650rb.", "Under light sedation. Rp650k.") }] }),
        teamCards(L.t, tr, { eyebrow: tr("Dokter", "Vets"), title: tr("Dokter hewan kami", "Our veterinarians"), members: [{ name: "drh. Ratna Sari", role: tr("Penyakit dalam kucing", "Feline internal medicine"), photo: asset("v2b-face-6") }, { name: "drh. Bayu Aji", role: tr("Bedah", "Surgery"), photo: asset("v2b-face-1") }, { name: "drh. Melati Putri", role: tr("Dermatologi", "Dermatology"), photo: asset("v2b-face-4") }] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Mampir atau chat dulu", "Drop by or chat first"), info: [[tr("Alamat", "Address"), "Jl. Ir. H. Juanda 210, Dago, Bandung"], ["WhatsApp", "+62 812 2020 7788"], [tr("Jam", "Hours"), tr("Setiap hari 09.00–21.00", "Daily 9am–9pm")]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { k: "input", label: tr("Nama anabul", "Pet's name"), ph: "Mochi" }, { k: "select", label: tr("Layanan", "Service"), ph: tr("Pilih", "Choose"), options: ["Grooming", tr("Penitipan", "Pet hotel"), tr("Klinik", "Clinic"), tr("Pesan produk", "Order products")] }, { k: "date", label: tr("Jadwal", "Schedule"), mode: "datetime-local" }], submit: tr("Kirim", "Send") }),
        faqAccordion(L.t, tr, { items: [[tr("Bisa antar-jemput?", "Pick-up available?"), tr("Ya, Rp30rb dalam radius 7 km.", "Yes, Rp30k within 7 km.")], [tr("Menerima hewan eksotis?", "Exotic pets?"), tr("Untuk saat ini hanya kucing, anjing, dan kelinci.", "For now only cats, dogs, and rabbits.")]] }),
      ],
    });
  },
};

/* -------------------- 13. agri-coffee-farm (PREMIUM, 7) ------------ */

const HL: Palette = { ink: "#2b1d12", muted: "#5c4636", primary: "#4d7c0f", primaryDark: "#3f6212", soft: "#f7f3e8", line: "#e3d5b8" };
const hlL = look(HL, { font: FONTS.sans, hf: FONTS.serif, r: 8, dark: "#2b1d12", alt: "#f7f3e8", bg: "#fffdf7", onDark: "#e3d5b8" });

export const agriCoffeeFarm: TemplateContent = {
  brand: "Halimun Estate Coffee",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("farm", "Kebun", "The Farm", "kebun", "farm"),
    P("process", "Proses", "Process", "proses", "process"),
    P("coffees", "Kopi Kami", "Our Coffees", "kopi", "coffees"),
    P("wholesale", "Grosir", "Wholesale", "grosir", "wholesale"),
    P("visit", "Kunjungan", "Farm Visit", "kunjungan", "farm-visit"),
    P("journal", "Jurnal", "Journal", "jurnal", "journal"),
  ],
  build: (key, tr, href) => {
    const L = hlL;
    const head = centeredHeader("HALIMUN ESTATE", HL, { font: FONTS.serif, bg: "#fffdf7" });
    const foot = footer("Halimun Estate Coffee", tr("Kebun kopi arabika 1.450 mdpl di lereng Gunung Cikuray, Garut.", "Arabica coffee farm at 1,450 masl on Mount Cikuray, Garut."), [{ title: tr("Kebun", "Farm"), items: ["Desa Cigedug, Garut", tr("Kunjungan: Sab–Min", "Visits: Sat–Sun")] }, { title: tr("Grosir", "Wholesale"), items: ["trade@halimun.example", "+62 813 2100 1450"] }], tr("© 2026 Halimun Estate Coffee. Data panen contoh.", "© 2026 Halimun Estate Coffee. Sample harvest data."), "#2b1d12");
    return render(L, key, head, foot, {
      home: () => [
        heroImage(L, { ey: tr("Garut · 1.450 mdpl", "Garut · 1,450 masl"), title: tr("Kopi dari kabut, dipetik satu per satu", "Coffee from the mist, picked cherry by cherry"), text: tr("Arabika Sigararutang & Lini S dari 18 hektar kebun keluarga, dipetik merah, diproses di kebun.", "Sigararutang & Line S arabica from an 18-hectare family farm, red-cherry picked and processed on site."), btns: [[tr("Belanja kopi", "Shop coffee"), href("coffees")], [tr("Kunjungi kebun", "Visit the farm"), href("visit")]], image: "v2b-farm", overlay: "#2b1d12", opacity: 50 }),
        counters(L, [["18 ha", tr("Luas kebun", "Farm area")], ["1.450", tr("mdpl", "masl")], ["86,5", tr("Skor cupping tertinggi", "Top cupping score")], ["42", tr("Keluarga petani mitra", "Partner farming families")]], { bg: L.alt }),
        split(L, { ey: tr("Tentang kebun", "About the farm"), title: tr("Tiga generasi di lereng yang sama", "Three generations on the same slope"), paras: [tr("Kakek kami menanam kopi pertama pada 1978 di bawah naungan pohon suren. Kini Teh Rina dan Kang Asep mengelola kebun bersama 42 keluarga petani.", "Our grandfather planted the first coffee in 1978 under suren shade trees. Today Rina and Asep run the farm with 42 farming families.")], image: "v2b-farm", alt: tr("Kebun kopi", "Coffee farm"), btn: [tr("Cerita kebun", "Farm story"), href("farm")] }),
        products(L, { ey: tr("Panen 2026", "2026 harvest"), title: tr("Kopi kami", "Our coffees"), items: [{ image: "v2b-pack-coffee", title: "Halimun Natural", text: tr("Stroberi, cokelat susu, anggur · 200 g", "Strawberry, milk chocolate, wine · 200 g"), price: "Rp125.000", badge: "86,5", rating: 4.9, reviews: "(210)" }, { image: "v2b-pack-coffee", title: "Halimun Honey", text: tr("Gula aren, jeruk, teh hitam · 200 g", "Palm sugar, orange, black tea · 200 g"), price: "Rp110.000", rating: 4.8, reviews: "(184)" }, { image: "v2b-pack-coffee", title: "Halimun Full Wash", text: tr("Lemon, kacang, bersih · 200 g", "Lemon, nutty, clean · 200 g"), price: "Rp95.000", rating: 4.7, reviews: "(266)" }], cta: tr("Detail", "Details"), href: href("coffees"), bg: L.alt }),
        testiCards(L, { title: tr("Dari roaster & kafe", "From roasters & cafés"), items: [{ quote: tr("Natural Halimun jadi single origin terlaris kami dua musim berturut-turut.", "Halimun Natural has been our best-selling single origin two seasons running."), author: "Bagas Prakoso", role: tr("Head roaster, Kopi Lereng", "Head roaster, Kopi Lereng"), avatar: "v2b-face-1" }, { quote: tr("Konsistensi lot dan dokumentasi panennya sangat rapi untuk ekspor.", "Lot consistency and harvest records are very tidy for export."), author: "Yuki Morimoto", role: tr("Importir, Osaka", "Importer, Osaka"), avatar: "v2b-face-3" }] }),
      ],
      farm: () => [
        pageHead(L, { ey: tr("Kebun", "The farm"), title: tr("Tanah vulkanik, kabut pagi, dan pohon naungan", "Volcanic soil, morning mist, and shade trees"), image: "v2b-farm" }),
        timeline(L, { title: tr("Sejarah kebun", "Farm history"), items: [["1978", tr("Pohon kopi pertama", "First coffee trees"), tr("Ditanam Abah Uyeh di 2 hektar.", "Planted by Abah Uyeh on 2 hectares.")], ["2005", tr("Kelompok tani", "Farmers' group"), tr("12 keluarga bergabung.", "12 families join.")], ["2016", tr("Rumah proses", "Processing house"), tr("Bangun para-para & rumah jemur.", "Built raised beds & drying house.")], ["2023", tr("Ekspor pertama", "First export"), tr("1 kontainer ke Jepang.", "1 container to Japan.")]] }),
        cards(L, { title: tr("Praktik berkelanjutan", "Sustainable practices"), cols: 3, style: "line", bg: L.alt, items: [{ title: tr("Naungan 40%", "40% shade"), text: tr("Suren, alpukat, dan lamtoro.", "Suren, avocado, and leucaena trees.") }, { title: tr("Kompos kulit kopi", "Cherry-pulp compost"), text: tr("Tanpa pupuk kimia sejak 2018.", "No synthetic fertilizer since 2018.") }, { title: tr("Harga adil", "Fair price"), text: tr("Petani dibayar 30% di atas harga pasar.", "Farmers paid 30% above market.") }] }),
      ],
      process: () => [
        pageHead(L, { ey: tr("Proses", "Process"), title: tr("Dari ceri ke biji hijau", "From cherry to green bean"), dark: true }),
        steps(L, { title: tr("Lima tahap pascapanen", "Five post-harvest stages"), items: [[tr("Petik merah", "Red-cherry picking"), tr("Hanya ceri matang sempurna.", "Only fully ripe cherries.")], [tr("Sortasi apung", "Float sorting"), tr("Ceri ringan dibuang.", "Floaters removed.")], [tr("Fermentasi", "Fermentation"), tr("36–72 jam sesuai proses.", "36–72 hours per process.")], [tr("Jemur", "Drying"), tr("18–30 hari di para-para.", "18–30 days on raised beds.")]] }),
        progressSec(L, { ey: tr("Musim panen 2026", "2026 harvest season"), title: tr("Status panen Oktober", "October harvest status"), text: tr("Diperbarui setiap Senin.", "Updated every Monday."), items: [[tr("Ceri dipetik (62 dari 80 ton)", "Cherries picked (62 of 80 t)"), 78], [tr("Proses natural selesai", "Natural process completed"), 55], [tr("Proses honey selesai", "Honey process completed"), 70], [tr("Lot terjual (pre-order)", "Lots sold (pre-order)"), 64]], image: "v2b-farm", bg: L.alt }),
      ],
      coffees: () => [
        pageHead(L, { ey: tr("Kopi kami", "Our coffees"), title: tr("Sangrai mingguan, kirim hari Kamis", "Roasted weekly, shipped Thursdays"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Kopi", "Coffees"), ""]] }),
        products(L, { items: [{ image: "v2b-pack-coffee", title: "Halimun Natural", text: tr("Stroberi, cokelat susu · 200 g", "Strawberry, milk chocolate · 200 g"), price: "Rp125.000", badge: "86,5", rating: 4.9, reviews: "(210)" }, { image: "v2b-pack-coffee", title: "Halimun Honey", text: tr("Gula aren, jeruk · 200 g", "Palm sugar, orange · 200 g"), price: "Rp110.000", rating: 4.8, reviews: "(184)" }, { image: "v2b-pack-coffee", title: "Halimun Full Wash", text: tr("Lemon, kacang · 200 g", "Lemon, nutty · 200 g"), price: "Rp95.000", rating: 4.7, reviews: "(266)" }, { image: "v2b-pack-coffee", title: "Anaerobic Cikuray", text: tr("Nanas, kayu manis · 100 g", "Pineapple, cinnamon · 100 g"), price: "Rp140.000", badge: tr("Terbatas", "Limited"), rating: 4.9, reviews: "(48)" }, { image: "v2b-pack-coffee", title: tr("Drip Bag Sampler", "Drip Bag Sampler"), text: tr("10 sachet, 4 proses", "10 sachets, 4 processes"), price: "Rp85.000", rating: 4.8, reviews: "(320)" }, { image: "v2b-pack-coffee", title: tr("Langganan Bulanan", "Monthly Subscription"), text: tr("2× 200 g per bulan", "2× 200 g per month"), price: "Rp210.000", rating: 4.9, reviews: "(95)" }], cta: tr("Pesan", "Order"), href: href("visit") }),
        tableSec(L, { title: tr("Panduan seduh", "Brew guide"), columns: [tr("Metode", "Method"), tr("Rasio", "Ratio"), tr("Suhu", "Temp"), tr("Waktu", "Time")], rows: [["V60", "1:15", "92°C", "2:45"], ["Aeropress", "1:13", "88°C", "1:45"], ["French press", "1:14", "94°C", "4:00"], ["Espresso", "1:2", "93°C", "28 dtk"]], bg: L.alt }),
      ],
      wholesale: () => [
        pageHead(L, { ey: tr("Grosir", "Wholesale"), title: tr("Biji hijau untuk roaster & eksportir", "Green beans for roasters & exporters"), center: true }),
        compareSec(L, { title: tr("Lot tersedia 2026", "Available 2026 lots"), columns: ["Natural", "Honey", "Full Wash"], rows: [tr("Skor SCA | 86,5 | 85,25 | 84,0", "SCA score | 86.5 | 85.25 | 84.0"), tr("Stok | 1,2 ton | 2,4 ton | 6 ton", "Stock | 1.2 t | 2.4 t | 6 t"), tr("Harga FOB/kg | Rp210rb | Rp175rb | Rp140rb", "FOB price/kg | Rp210k | Rp175k | Rp140k"), tr("Sampel gratis | ya | ya | ya", "Free sample | yes | yes | yes"), tr("Sertifikat organik | tidak | tidak | ya", "Organic certificate | no | no | yes")], highlight: 1 }),
        formSec(L, { title: tr("Minta sampel", "Request samples"), fields: [{ k: "input", label: tr("Perusahaan", "Company"), ph: "Roastery ABC" }, { k: "select", label: tr("Lot", "Lot"), ph: tr("Pilih", "Choose"), options: ["Natural", "Honey", "Full Wash", tr("Semua", "All")] }, { k: "input", label: tr("Kebutuhan (kg/bulan)", "Volume (kg/month)"), ph: "60", type: "number" }], submit: tr("Kirim permintaan", "Send request") }),
      ],
      visit: () => [
        heroSplit(L, { ey: tr("Kunjungan kebun", "Farm visit"), title: tr("Sehari jadi petani kopi", "A day as a coffee farmer"), text: tr("Petik ceri, belajar proses, dan cupping bersama tim kebun. Sabtu & Minggu, 08.00–14.00.", "Pick cherries, learn processing, and cup with the farm team. Sat & Sun, 8am–2pm."), btns: [[tr("Pesan tur", "Book a tour"), "#tur"]], image: "v2b-farm", alt: tr("Kebun kopi", "Coffee farm"), reverse: true, bg: L.alt }),
        priceList(L, { title: tr("Pilihan tur", "Tour options"), groups: [{ name: tr("Tur", "Tours"), items: [[tr("Tur Kebun", "Farm Tour"), tr("3 jam · makan siang sunda", "3 hrs · Sundanese lunch"), "Rp250rb"], [tr("Tur + Cupping", "Tour + Cupping"), tr("5 jam · 6 kopi", "5 hrs · 6 coffees"), "Rp450rb"], [tr("Menginap 1 malam", "1-night stay"), tr("Rumah petani", "Farmer's house"), "Rp750rb"]] }] }),
        formSec(L, { title: tr("Pesan kunjungan", "Book a visit"), fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { k: "date", label: tr("Tanggal", "Date") }, { k: "select", label: tr("Jumlah orang", "Group size"), ph: tr("Pilih", "Choose"), options: ["1–2", "3–6", "7–15"] }], submit: tr("Pesan", "Book") }),
      ],
      journal: () => [
        ...article(L, { meta: tr("Jurnal kebun · 1 Oktober 2026", "Farm journal · October 1, 2026"), title: tr("Hujan di musim kemarau dan lot natural yang hampir gagal", "Dry-season rain and the natural lot that almost failed"), lead: tr("Tiga hari hujan di bulan Agustus memaksa kami memindahkan 2 ton ceri ke rumah jemur tertutup dalam semalam.", "Three days of rain in August forced us to move 2 tonnes of cherries into the covered drying house overnight."), image: "v2b-farm", author: ["Rina Halimun", tr("Pengelola kebun", "Farm manager"), "v2b-face-4"], body: [tr("Proses natural membutuhkan kelembapan rendah. Hujan berarti risiko jamur dan rasa fermentasi berlebih.", "Natural processing needs low humidity. Rain means mold risk and over-fermented flavors."), tr("Seluruh petani datang tengah malam membantu memindahkan para-para.", "Every farmer showed up at midnight to move the raised beds."), tr("Hasilnya: skor 86,5, tertinggi dalam sejarah kebun.", "The result: an 86.5 score, the farm's highest ever.")], pull: tr("Kopi terbaik kami lahir dari malam paling melelahkan.", "Our best coffee was born on our most exhausting night."), tags: [tr("Panen", "Harvest"), "Natural"] }),
        newsletter(L, { title: tr("Surat dari kebun", "Letters from the farm"), text: tr("Cerita panen dan rilis lot baru, 6× setahun.", "Harvest stories and new lot releases, 6× a year."), ph: "nama@email.com", btn: tr("Berlangganan", "Subscribe") }),
      ],
    });
  },
};

/* --------------------- 14. logistics-cargo (PREMIUM, 8) ------------ */

const BL: Palette = { ink: "#0b1d3a", muted: "#475569", primary: "#f59e0b", primaryDark: "#b45309", soft: "#fffbeb", line: "#fde68a" };
const blL = look(BL, { font: FONTS.grotesk, r: 10, dark: "#0b1d3a", alt: "#f1f5f9", onDark: "#94a3b8" });

export const logisticsCargo: TemplateContent = {
  brand: "Bahtera Lintas Cargo",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("services", "Layanan", "Services", "layanan", "services"),
    P("tracking", "Lacak Kiriman", "Tracking", "lacak", "tracking"),
    P("rates", "Tarif", "Rates", "tarif", "rates"),
    P("coverage", "Jangkauan", "Coverage", "jangkauan", "coverage"),
    P("fleet", "Armada", "Fleet", "armada", "fleet"),
    P("business", "Untuk Bisnis", "For Business", "bisnis", "business"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = blL;
    const nav = mega(
      L,
      [
        `${tr("Layanan", "Services")} | ${href("services")}`,
        `- ${tr("Kargo laut", "Sea freight")} | ${tr("FCL & LCL antar pulau", "Inter-island FCL & LCL")} | ${href("services")}`,
        `- ${tr("Kargo darat", "Road freight")} | ${tr("Truk CDD hingga trailer", "Box trucks to trailers")} | ${href("services")}`,
        `- ${tr("Kargo udara", "Air freight")} | ${tr("Sampai esok hari", "Next-day delivery")} | ${href("services")}`,
        `${tr("Lacak", "Track")} | ${href("tracking")}`,
        `${tr("Tarif", "Rates")} | ${href("rates")}`,
        `${tr("Perusahaan", "Company")} | ${href("fleet")}`,
        `- ${tr("Armada", "Fleet")} | ${tr("320 truk & 4 kapal", "320 trucks & 4 vessels")} | ${href("fleet")}`,
        `- ${tr("Jangkauan", "Coverage")} | ${tr("34 provinsi", "34 provinces")} | ${href("coverage")}`,
      ],
      tr("Untuk bisnis", "For business"),
      href("business"),
      { dark: true },
    );
    const head = header("BAHTERA·LINTAS", BL, { nav, bg: "#0b1d3a", ink: "#ffffff", font: FONTS.grotesk });
    const foot = footer("Bahtera Lintas Cargo", tr("Ekspedisi kargo laut, darat, dan udara sejak 2003.", "Sea, road, and air cargo forwarding since 2003."), [{ title: tr("Kantor pusat", "Head office"), items: ["Jl. Perak Barat 88", "Surabaya"] }, { title: tr("Layanan 24 jam", "24h service"), items: ["1500-288", "cs@bahteralintas.example"] }, { title: tr("Izin", "Licenses"), items: ["SIUJPT 503/2003", "ISO 9001:2015"] }], tr("© 2026 Bahtera Lintas Cargo. Tarif contoh.", "© 2026 Bahtera Lintas Cargo. Sample rates."), "#0b1d3a");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { dark: true, bg: "#0b1d3a", badge: tr("Surabaya · Jakarta · Makassar · Balikpapan", "Surabaya · Jakarta · Makassar · Balikpapan"), title: tr("Kirim barang ke seluruh Indonesia, terlacak setiap jam", "Ship anywhere in Indonesia, tracked every hour"), text: tr("Kargo laut, darat, dan udara untuk pabrik, distributor, dan toko online. Jemput gratis di Jawa Timur.", "Sea, road, and air cargo for factories, distributors, and online stores. Free pick-up across East Java."), btns: [[tr("Cek tarif", "Check rates"), href("rates")], [tr("Lacak kiriman", "Track shipment"), href("tracking")]], image: "v2b-truck", alt: tr("Truk kargo", "Cargo truck") }),
        counters(L, [["1,8 jt", tr("Kiriman per tahun", "Shipments per year")], ["34", tr("Provinsi", "Provinces")], ["320", tr("Truk", "Trucks")], ["99,2%", tr("Tepat waktu", "On time")]]),
        cards(L, { ey: tr("Layanan", "Services"), title: tr("Pilih moda, kami urus sisanya", "Pick a mode, we handle the rest"), cols: 3, items: [{ icon: "🚢", title: tr("Kargo laut", "Sea freight"), text: tr("FCL 20'/40' & LCL mulai 1 m³. Surabaya–Makassar 4 hari.", "FCL 20'/40' & LCL from 1 m³. Surabaya–Makassar in 4 days."), link: [tr("Detail", "Details"), href("services")] }, { icon: "🚚", title: tr("Kargo darat", "Road freight"), text: tr("Truk CDD, fuso, wingbox, trailer. Pulau Jawa & Sumatra.", "Box trucks, fuso, wingbox, trailers. Java & Sumatra."), link: [tr("Detail", "Details"), href("services")] }, { icon: "✈️", title: tr("Kargo udara", "Air freight"), text: tr("Next-day ke 60 kota. Minimal 10 kg.", "Next-day to 60 cities. Minimum 10 kg."), link: [tr("Detail", "Details"), href("services")] }], bg: L.alt }),
        logos(L, { title: tr("Dipercaya oleh", "Trusted by"), names: ["Semen Nusa", "Pupuk Raya", "TokoTani", "Mebel Jepara Co", "Elektronik Prima"] }),
        ctaSplit(L, { title: tr("Kirim rutin lebih dari 10 ton/bulan?", "Shipping over 10 tonnes a month?"), text: tr("Dapatkan tarif kontrak dan account manager khusus.", "Get contract rates and a dedicated account manager."), btns: [[tr("Untuk bisnis", "For business"), href("business")]], bg: "#b45309" }),
      ],
      services: () => [
        pageHead(L, { ey: tr("Layanan", "Services"), title: tr("Solusi kargo end-to-end", "End-to-end cargo solutions"), image: "v2b-containers" }),
        tabsSec(L, { title: tr("Detail moda", "Mode details"), tabs: [[tr("Laut", "Sea"), tr("Jadwal kapal mingguan dari Tanjung Perak ke 18 pelabuhan. Termasuk trucking door-to-door dan asuransi opsional 0,2%.", "Weekly sailings from Tanjung Perak to 18 ports. Includes door-to-door trucking and optional 0.2% insurance.")], [tr("Darat", "Road"), tr("GPS real-time, segel elektronik, dan sopir bersertifikat B2 umum.", "Real-time GPS, electronic seals, and certified drivers.")], [tr("Udara", "Air"), tr("Kerja sama dengan 4 maskapai, cut-off pukul 17.00.", "Partnered with 4 airlines, 5pm cut-off.")], [tr("Gudang", "Warehouse"), tr("12.000 m² di Surabaya & Cikarang, sistem WMS, pick & pack.", "12,000 m² in Surabaya & Cikarang, WMS, pick & pack.")]] }),
        steps(L, { title: tr("Alur pengiriman", "Shipping flow"), items: [[tr("Pesan", "Book"), tr("Online atau via sales.", "Online or via sales.")], [tr("Jemput", "Pick-up"), tr("Hari yang sama untuk Jatim.", "Same day in East Java.")], [tr("Kirim", "Transit"), tr("Lacak setiap jam.", "Tracked hourly.")], [tr("Terima", "Deliver"), tr("POD digital dengan foto.", "Digital POD with photo.")]], bg: L.alt }),
      ],
      tracking: () => [
        pageHead(L, { ey: tr("Lacak", "Track"), title: tr("Lacak kiriman", "Track a shipment"), text: tr("Masukkan nomor resi atau nomor kontainer.", "Enter your waybill or container number."), center: true, dark: true }),
        formSec(L, { title: tr("Nomor resi", "Waybill number"), text: tr("Contoh: BLC-SUB-26100231", "Example: BLC-SUB-26100231"), fields: [{ k: "input", label: tr("Nomor resi / kontainer", "Waybill / container no."), ph: "BLC-SUB-26100231" }], submit: tr("Lacak", "Track"), info: [[tr("Bantuan", "Help"), "1500-288"]] }),
        tableSec(L, { title: tr("Contoh status: BLC-SUB-26100231", "Sample status: BLC-SUB-26100231"), columns: [tr("Waktu", "Time"), tr("Lokasi", "Location"), tr("Status", "Status")], rows: [["12 Okt 08:10", "Surabaya", tr("Dijemput dari pengirim", "Picked up from shipper")], ["12 Okt 15:40", "Tanjung Perak", tr("Masuk kontainer MSKU 220981", "Loaded into container MSKU 220981")], ["13 Okt 06:00", tr("Laut Jawa", "Java Sea"), tr("Dalam pelayaran KM Bahtera 3", "Sailing on MV Bahtera 3")], ["16 Okt 09:30", "Makassar", tr("Tiba di pelabuhan", "Arrived at port")], ["16 Okt 14:15", "Makassar", tr("Diterima: Bpk. Haris", "Delivered: Mr. Haris")]] }),
      ],
      rates: () => [
        pageHead(L, { ey: tr("Tarif", "Rates"), title: tr("Tarif publik Oktober 2026", "October 2026 public rates"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Tarif", "Rates"), ""]] }),
        tableSec(L, { title: tr("Dari Surabaya", "From Surabaya"), columns: [tr("Tujuan", "Destination"), tr("Darat /kg", "Road /kg"), tr("Laut /m³", "Sea /m³"), tr("Udara /kg", "Air /kg"), tr("Estimasi", "ETA")], rows: [["Jakarta", "Rp2.100", "—", "Rp14.500", tr("2–3 hari", "2–3 days")], ["Makassar", "—", "Rp890.000", "Rp21.000", tr("4–5 hari", "4–5 days")], ["Balikpapan", "—", "Rp950.000", "Rp23.500", tr("4–6 hari", "4–6 days")], ["Medan", "Rp4.800", "Rp1.250.000", "Rp27.000", tr("6–8 hari", "6–8 days")], ["Jayapura", "—", "Rp2.900.000", "Rp48.000", tr("10–14 hari", "10–14 days")]], caption: tr("Belum termasuk asuransi & packing kayu.", "Excludes insurance & wooden crating.") }),
        compareSec(L, { title: tr("Pilih layanan yang tepat", "Choose the right service"), columns: [tr("Reguler", "Regular"), tr("Ekspres", "Express"), tr("Kontrak", "Contract")], rows: [tr("Kecepatan | Standar | 40% lebih cepat | Sesuai SLA", "Speed | Standard | 40% faster | Per SLA"), tr("Jemput gratis | Jatim | Jawa | Seluruh cabang", "Free pick-up | East Java | Java | All branches"), tr("Asuransi | opsional | ya | ya", "Insurance | optional | yes | yes"), tr("Account manager | tidak | tidak | ya", "Account manager | no | no | yes"), tr("Tagihan bulanan | tidak | tidak | ya", "Monthly invoicing | no | no | yes")], highlight: 3, bg: L.alt }),
      ],
      coverage: () => [
        pageHead(L, { ey: tr("Jangkauan", "Coverage"), title: tr("34 provinsi, 26 cabang", "34 provinces, 26 branches"), center: true }),
        cards(L, { cols: 4, style: "line", items: [{ meta: tr("6 cabang", "6 branches"), title: tr("Jawa", "Java"), text: "Jakarta, Bandung, Semarang, Yogyakarta, Surabaya, Malang" }, { meta: tr("5 cabang", "5 branches"), title: "Sumatra", text: "Medan, Pekanbaru, Padang, Palembang, Lampung" }, { meta: tr("5 cabang", "5 branches"), title: "Kalimantan", text: "Pontianak, Banjarmasin, Balikpapan, Samarinda, Tarakan" }, { meta: tr("4 cabang", "4 branches"), title: "Sulawesi", text: "Makassar, Kendari, Palu, Manado" }, { meta: tr("3 cabang", "3 branches"), title: tr("Bali & Nusa Tenggara", "Bali & Nusa Tenggara"), text: "Denpasar, Mataram, Kupang" }, { meta: tr("2 cabang", "2 branches"), title: "Maluku", text: "Ambon, Ternate" }, { meta: tr("1 cabang", "1 branch"), title: "Papua", text: "Jayapura" }, { meta: tr("Mitra", "Partners"), title: tr("Daerah 3T", "Remote areas"), text: tr("Melalui 40 agen lokal.", "Through 40 local agents.") }] }),
      ],
      fleet: () => [
        pageHead(L, { ey: tr("Armada", "Fleet"), title: tr("Armada milik sendiri", "Our own fleet"), dark: true }),
        imgCards(L, { cols: 3, items: [{ image: "v2b-truck", title: "Wingbox 10 m", text: tr("120 unit · kapasitas 15 ton", "120 units · 15-tonne capacity") }, { image: "v2b-containers", title: tr("Kontainer 20'/40'", "20'/40' containers"), text: tr("860 unit · termasuk reefer", "860 units · including reefers") }, { image: "v2b-truck", title: "CDD Box", text: tr("180 unit · kota & antar kota", "180 units · city & intercity") }] }),
        counters(L, [["320", tr("Truk", "Trucks")], ["4", tr("Kapal", "Vessels")], ["860", tr("Kontainer", "Containers")], ["12.000 m²", tr("Gudang", "Warehouse")]], { title: tr("Kapasitas", "Capacity"), bg: L.alt }),
      ],
      business: () => [
        split(L, { ey: tr("Untuk bisnis", "For business"), title: tr("Logistik yang ikut tumbuh bersama bisnis Anda", "Logistics that grows with your business"), paras: [tr("Integrasi API untuk toko online, dashboard pengiriman, dan tagihan bulanan dengan termin 30 hari.", "API integration for online stores, a shipping dashboard, and monthly invoicing on 30-day terms.")], bullets: [tr("API & plugin WooCommerce", "API & WooCommerce plugin"), tr("Laporan SLA bulanan", "Monthly SLA reports"), tr("Klaim diproses 7 hari", "Claims settled in 7 days")], image: "v2b-containers", alt: tr("Kontainer", "Containers") }),
        pricingCards(L.t, tr, { eyebrow: tr("Paket kontrak", "Contract plans"), title: tr("Diskon berdasarkan volume bulanan", "Discounts by monthly volume"), badge: tr("Populer", "Popular"), plans: [{ name: "Starter", price: "5%", period: tr(" diskon", " off"), text: tr("1–10 ton/bulan.", "1–10 t/month."), features: [tr("Tagihan bulanan", "Monthly invoice"), tr("Dashboard", "Dashboard")], cta: { label: tr("Ajukan", "Apply"), href: href("contact") } }, { name: "Growth", price: "12%", period: tr(" diskon", " off"), text: tr("10–50 ton/bulan.", "10–50 t/month."), features: [tr("Semua di Starter", "Everything in Starter"), tr("Account manager", "Account manager"), "API"], cta: { label: tr("Ajukan", "Apply"), href: href("contact") }, featured: true }, { name: "Enterprise", price: tr("Kustom", "Custom"), period: "", text: tr("> 50 ton/bulan.", "> 50 t/month."), features: [tr("SLA khusus", "Custom SLA"), tr("Gudang dedicated", "Dedicated warehouse"), tr("Tim on-site", "On-site team")], cta: { label: tr("Hubungi sales", "Contact sales"), href: href("contact") } }] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Minta penawaran", "Request a quote"), info: [[tr("Kantor pusat", "Head office"), "Jl. Perak Barat 88, Surabaya"], [tr("CS 24 jam", "24h support"), "1500-288"], ["Email", "sales@bahteralintas.example"]], fields: [{ k: "input", label: tr("Perusahaan", "Company"), ph: "PT Contoh Logam" }, { k: "input", label: tr("Asal", "Origin"), ph: "Surabaya" }, { k: "input", label: tr("Tujuan", "Destination"), ph: "Makassar" }, { k: "select", label: tr("Moda", "Mode"), ph: tr("Pilih", "Choose"), options: [tr("Laut", "Sea"), tr("Darat", "Road"), tr("Udara", "Air")] }, { k: "input", label: tr("Berat (kg)", "Weight (kg)"), ph: "1200", type: "number" }], submit: tr("Kirim", "Send") }),
      ],
    });
  },
};

/* ------------------ 15. gaming-esports-team (PREMIUM, 6) ----------- */

const GV: Palette = { ink: "#18181b", muted: "#52525b", primary: "#84cc16", primaryDark: "#4d7c0f", soft: "#ecfccb", line: "#d9f99d" };
const gvL = look(GV, { font: FONTS.grotesk, hf: FONTS.mono, r: 6, dark: "#09090b", alt: "#f4f4f5", bg: "#09090b", onDark: "#a1a1aa" });

export const gamingEsportsTeam: TemplateContent = {
  brand: "Garuda Vortex Esports",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("roster", "Roster", "Roster", "roster", "roster"),
    P("matches", "Jadwal", "Matches", "jadwal", "matches"),
    P("achievements", "Prestasi", "Achievements", "prestasi", "achievements"),
    P("merch", "Merch", "Merch", "merch", "merch"),
    P("partners", "Sponsor", "Partners", "sponsor", "partners"),
  ],
  build: (key, tr, href) => {
    const L = gvL;
    const head = header("GRD//VORTEX", GV, { bg: "#09090b", ink: "#ffffff", font: FONTS.mono, sticky: true, cta: cta(tr("Tonton live", "Watch live"), href("matches"), GV) });
    const foot = footerSlim(L, "GRD//VORTEX", [["Roster", href("roster")], [tr("Jadwal", "Matches"), href("matches")], ["Merch", href("merch")], [tr("Sponsor", "Partners"), href("partners")]], tr("© 2026 Garuda Vortex Esports. Tim & skor fiktif.", "© 2026 Garuda Vortex Esports. Fictional team & scores."), { bg: "#000000" });
    const dark = { bg: "#09090b" };
    return render(L, key, head, foot, {
      home: () => [
        heroType(L, { dark: true, ey: tr("Tim esports · Jakarta", "Esports team · Jakarta"), prefix: tr("Kami bermain untuk", "We play to"), words: [tr("menang", "win"), tr("Indonesia", "Indonesia"), tr("komunitas", "the community")], text: tr("Juara MPL musim 15 dan finalis Valorant Challengers Indonesia. Ikuti perjalanan kami ke panggung dunia.", "MPL Season 15 champions and Valorant Challengers Indonesia finalists. Follow our road to the world stage."), btns: [[tr("Jadwal pertandingan", "Match schedule"), href("matches")], [tr("Belanja jersey", "Shop jerseys"), href("merch")]], image: "v2b-gamepad", alt: tr("Stik game", "Gamepad") }),
        countdownSec(L, { ey: tr("Pertandingan berikutnya", "Next match"), title: "GRD//VORTEX vs Nusantara Titans", text: tr("MPL Playoff · Sabtu, 14 November 2026 · 19.00 WIB · Tennis Indoor Senayan.", "MPL Playoffs · Saturday, November 14, 2026 · 7pm WIB · Tennis Indoor Senayan."), target: "2026-11-14T19:00", done: tr("Pertandingan sedang berlangsung!", "The match is live!"), btn: [tr("Beli tiket", "Buy tickets"), href("matches")], bg: "#1a2e05" }),
        statsBand(L.t, tr, { eyebrow: tr("Musim 2026", "2026 season"), title: tr("Angka yang kami kejar setiap hari", "Numbers we chase every day"), text: tr("Data resmi liga per Oktober 2026.", "Official league data as of October 2026."), stats: [["3", tr("Trofi nasional", "National trophies")], ["72%", tr("Win rate MPL", "MPL win rate")], ["1,4 jt", tr("Pengikut", "Followers")], ["9", tr("Pemain inti", "Core players")]] }),
        imgCards(L, { dark: true, ey: tr("Berita", "News"), title: tr("Kabar terbaru", "Latest news"), items: [{ image: "v2b-news-6", meta: tr("12 Okt 2026", "Oct 12, 2026"), title: tr("Rizz kembali ke posisi jungler", "Rizz returns to the jungle role"), text: tr("Rotasi roster jelang playoff.", "Roster rotation ahead of playoffs.") }, { image: "v2b-gamepad", meta: tr("5 Okt 2026", "Oct 5, 2026"), title: tr("Bootcamp di Seoul", "Bootcamp in Seoul"), text: tr("Dua minggu scrim melawan tim Korea.", "Two weeks of scrims against Korean teams.") }, { image: "v2b-news-3", meta: tr("28 Sep 2026", "Sep 28, 2026"), title: tr("Jersey musim 2027 dirilis", "2027 season jersey released"), text: tr("Desain motif batik parang.", "Featuring a parang batik motif."), link: [tr("Belanja", "Shop"), href("merch")] }], ...dark }),
      ],
      roster: () => [
        pageHead(L, { ey: "Roster", title: tr("Divisi Mobile Legends", "Mobile Legends division"), dark: true, bg: "#09090b" }),
        teamCards(L.t, tr, { eyebrow: "MLBB", title: tr("Starting five", "Starting five"), members: [{ name: "Rizz", role: tr("Jungler · Rizky Pratama", "Jungler · Rizky Pratama"), photo: asset("v2b-face-1"), links: [{ label: "Instagram", href: "#" }, { label: "TikTok", href: "#" }] }, { name: "Kaito", role: tr("Gold lane · Kevin Halim", "Gold lane · Kevin Halim"), photo: asset("v2b-face-3"), links: [{ label: "Instagram", href: "#" }, { label: "TikTok", href: "#" }] }, { name: "Mira", role: tr("Mid lane · Amira Lubis", "Mid lane · Amira Lubis"), photo: asset("v2b-face-2"), links: [{ label: "Instagram", href: "#" }, { label: "TikTok", href: "#" }] }, { name: "Bonk", role: tr("Roamer · Bonifasius Tey", "Roamer · Bonifasius Tey"), photo: asset("v2b-face-5"), links: [{ label: "Instagram", href: "#" }, { label: "TikTok", href: "#" }] }] }),
        cards(L, { dark: true, title: tr("Divisi lain", "Other divisions"), cols: 3, items: [{ icon: "🎯", title: "Valorant", text: tr("Finalis VCI 2026 · 5 pemain + 1 cadangan.", "VCI 2026 finalists · 5 players + 1 sub.") }, { icon: "⚽", title: "eFootball", text: tr("Juara IFeL 2025.", "IFeL 2025 champions.") }, { icon: "🎮", title: tr("Kreator konten", "Content creators"), text: tr("4 streamer, 2,1 jt subscriber.", "4 streamers, 2.1M subscribers.") }], bg: "#18181b" }),
      ],
      matches: () => [
        pageHead(L, { ey: tr("Jadwal", "Matches"), title: tr("Jadwal & hasil", "Schedule & results"), dark: true, bg: "#09090b" }),
        sliderSec(L, [[tr("Playoff MPL · 14 Nov", "MPL Playoffs · Nov 14"), "GRD//VORTEX vs Nusantara Titans · 19.00 WIB", "#1a2e05"], [tr("VCI Grand Final · 22 Nov", "VCI Grand Final · Nov 22"), "GRD//VORTEX vs Bara Esports · 16.00 WIB", "#3f3f46"], [tr("Fan meet · 30 Nov", "Fan meet · Nov 30"), tr("Kota Kasablanka, gratis", "Kota Kasablanka, free"), "#4d7c0f"]], { height: 300, bg: "#09090b" }),
        tableSec(L, { title: tr("Hasil terakhir", "Recent results"), columns: [tr("Tanggal", "Date"), tr("Lawan", "Opponent"), tr("Turnamen", "Tournament"), tr("Skor", "Score")], rows: [["10 Okt", "Rajawali Gaming", "MPL S16", tr("2–0 Menang", "2–0 Win")], ["4 Okt", "Kraken ID", "MPL S16", tr("1–2 Kalah", "1–2 Loss")], ["27 Sep", "Bara Esports", "VCI", tr("2–1 Menang", "2–1 Win")], ["20 Sep", "Samudra 5", "MPL S16", tr("2–0 Menang", "2–0 Win")]], bg: "#ffffff" }),
      ],
      achievements: () => [
        pageHead(L, { ey: tr("Prestasi", "Achievements"), title: tr("Lemari trofi", "Trophy cabinet"), dark: true, bg: "#09090b" }),
        timeline(L, { dark: true, title: tr("Perjalanan juara", "Championship run"), items: [["2026", tr("Juara MPL Season 15", "MPL Season 15 Champions"), tr("Menang 4–2 di grand final.", "Won the grand final 4–2.")], ["2025", "IFeL Champions", tr("Divisi eFootball tak terkalahkan.", "eFootball division unbeaten.")], ["2024", tr("Runner-up MSC", "MSC Runner-up"), tr("Peringkat 2 Asia Tenggara.", "2nd in Southeast Asia.")], ["2023", tr("Tim berdiri", "Team founded"), tr("Dari turnamen kampus di Depok.", "From a campus tournament in Depok.")]], bg: "#18181b" }),
        quote(L, { dark: true, text: tr("Kami tidak lahir sebagai juara. Kami latihan 10 jam sehari sampai menjadi juara.", "We weren't born champions. We trained 10 hours a day until we became one."), name: "Coach Dimas \"Vex\" Rahardjo", role: tr("Pelatih kepala", "Head coach"), bg: "#09090b" }),
      ],
      merch: () => [
        pageHead(L, { ey: "Merch", title: tr("Jersey & koleksi resmi", "Official jerseys & gear"), dark: true, bg: "#09090b" }),
        products(L, { items: [{ image: "v2b-news-6", title: tr("Jersey 2027 Kandang", "2027 Home Jersey"), text: tr("Dry-fit, nama & nomor custom", "Dry-fit, custom name & number"), price: "Rp389.000", badge: tr("Baru", "New"), rating: 4.9, reviews: "(412)" }, { image: "v2b-gamepad", title: tr("Hoodie Vortex", "Vortex Hoodie"), text: tr("Fleece 330 gsm", "330 gsm fleece"), price: "Rp459.000", rating: 4.8, reviews: "(188)" }, { image: "v2b-news-3", title: tr("Mousepad XL", "XL Mousepad"), text: "900×400 mm", price: "Rp199.000", rating: 4.7, reviews: "(97)" }], cta: tr("Pre-order", "Pre-order"), href: href("partners"), bg: "#18181b" }),
      ],
      partners: () => [
        logos(L, { dark: true, title: tr("Didukung oleh", "Powered by"), names: ["NusaNet", "Kopi Kilat", "Arka Gear", "Bank Digi", "Volt Energy"], bg: "#09090b" }),
        cards(L, { dark: true, title: tr("Paket sponsor", "Sponsorship tiers"), cols: 3, items: [{ meta: "Platinum", title: tr("Logo dada jersey", "Chest jersey logo"), text: tr("Eksklusif per kategori, 12 bulan.", "Category exclusive, 12 months.") }, { meta: "Gold", title: tr("Logo lengan & stream", "Sleeve & stream logo"), text: tr("Overlay di 300+ jam siaran.", "Overlay on 300+ broadcast hours.") }, { meta: "Silver", title: tr("Konten kolaborasi", "Collab content"), text: tr("6 video bersama streamer kami.", "6 videos with our streamers.") }], bg: "#18181b" }),
        formSec(L, { dark: true, ey: tr("Kemitraan", "Partnerships"), title: tr("Jadi mitra kami", "Become a partner"), info: [["Email", "partner@grdvortex.example"]], fields: [{ k: "input", label: tr("Perusahaan", "Company"), ph: "PT Contoh" }, { k: "select", label: tr("Paket", "Tier"), ph: tr("Pilih", "Choose"), options: ["Platinum", "Gold", "Silver"] }, { k: "input", label: "Email", ph: "marketing@perusahaan.com", type: "email" }], submit: tr("Kirim proposal", "Send proposal"), bg: "#09090b" }),
      ],
    });
  },
};
