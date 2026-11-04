import { faqAccordion, featuresIcons, portfolioMosaic, servicesSplit, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { Palette } from "../../../build";
import type { TemplateContent } from "../../../types";
import { FONTS, centeredHeader, cta, footer, header } from "../../pro/kit";
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
  heroSplit,
  imgCards,
  infoBar,
  logos,
  look,
  mega,
  newsletter,
  pageHead,
  priceSwitch,
  productDetail,
  products,
  progressSec,
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
/* Set B · part 4: Landscaping, News Magazine, Fintech, Furniture Store, */
/* Language Course.                                                     */
/* ================================================================== */

/* ---------------- 16. architecture-landscape (PREMIUM, 5) ---------- */

const RB: Palette = { ink: "#1f2a1f", muted: "#55624f", primary: "#5a7a4a", primaryDark: "#3f5a33", soft: "#eef2e8", line: "#d3dcc8" };
const rbL = look(RB, { font: FONTS.sans, hf: FONTS.elegant, r: 0, dark: "#1f2a1f", alt: "#f4f1ea", bg: "#fbfaf6", onDark: "#c9d4bd" });

export const architectureLandscape: TemplateContent = {
  brand: "Rimbaka Landscape Studio",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("studio", "Studio", "Studio", "studio", "studio"),
    P("projects", "Proyek", "Projects", "proyek", "projects"),
    P("approach", "Pendekatan", "Approach", "pendekatan", "approach"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = rbL;
    const head = header("rimbaka", RB, { font: FONTS.elegant, bg: "#fbfaf6", cta: cta(tr("Mulai proyek", "Start a project"), href("contact"), RB, "outline") });
    const foot = footerSlim(L, "rimbaka", [["Studio", href("studio")], [tr("Proyek", "Projects"), href("projects")], [tr("Pendekatan", "Approach"), href("approach")], [tr("Kontak", "Contact"), href("contact")]], tr("© 2026 Rimbaka Landscape Studio · Bogor. Proyek contoh.", "© 2026 Rimbaka Landscape Studio · Bogor. Sample projects."), { bg: "#f4f1ea", light: true });
    return render(L, key, head, foot, {
      home: () => [
        heroCenter(L, { title: tr("Lanskap yang tumbuh lebih indah setiap tahun", "Landscapes that grow more beautiful every year"), text: tr("Studio arsitektur lanskap untuk rumah tinggal, resor, dan ruang publik — dengan tanaman lokal yang hemat air.", "A landscape architecture studio for homes, resorts, and public spaces — with water-wise native plants."), btns: [[tr("Lihat proyek", "See projects"), href("projects")], [tr("Pendekatan kami", "Our approach"), href("approach")]], image: "v2b-garden", alt: tr("Denah taman", "Garden plan"), size: 56 }),
        portfolioMosaic(L.t, tr, { eyebrow: tr("Proyek pilihan", "Selected projects"), title: tr("Ruang hijau yang hidup", "Living green spaces"), text: tr("62 proyek di Jawa, Bali, dan Sumatra sejak 2012.", "62 projects across Java, Bali, and Sumatra since 2012."), cta: { label: tr("Semua proyek", "All projects"), href: href("projects") }, works: [{ title: tr("Taman Atap Menteng", "Menteng Roof Garden"), tag: tr("Rumah tinggal · 420 m²", "Residence · 420 m²"), image: asset("v2b-garden") }, { title: tr("Resor Lembah Ayung", "Ayung Valley Resort"), tag: tr("Hospitality · 2,4 ha", "Hospitality · 2.4 ha"), image: asset("v2b-villa") }, { title: tr("Taman Kota Cibinong", "Cibinong City Park"), tag: tr("Ruang publik", "Public space"), image: asset("v2b-farm") }, { title: tr("Halaman Sekolah Alam", "Nature School Yard"), tag: tr("Pendidikan", "Education"), image: asset("estate-house-3") }, { title: tr("Kebun Kantor BSD", "BSD Office Garden"), tag: tr("Komersial", "Commercial"), image: asset("v2b-room-2") }] }),
        quote(L, { text: tr("Taman terbaik adalah yang tidak terlihat ‘didesain’, tapi terasa seperti selalu ada di sana.", "The best gardens don't look ‘designed’; they feel like they've always been there."), name: "Laras Rimbaka", role: tr("Arsitek lanskap utama", "Principal landscape architect"), bg: L.alt }),
      ],
      studio: () => [
        split(L, { ey: "Studio", title: tr("Kecil, teliti, dan suka kotor", "Small, meticulous, and happy to get dirty"), paras: [tr("Rimbaka adalah studio 11 orang: arsitek lanskap, ahli hortikultura, dan tim lapangan sendiri. Kami ikut menanam, bukan hanya menggambar.", "Rimbaka is an 11-person studio: landscape architects, horticulturists, and our own field team. We plant, not just draw."), tr("Pembibitan kami di Ciapus menyimpan 180 jenis tanaman lokal.", "Our nursery in Ciapus holds 180 native species.")], image: "v2b-garden", alt: tr("Studio", "Studio"), ratio: "4 / 5" }),
        teamCards(L.t, tr, { eyebrow: tr("Tim", "Team"), title: tr("Orang-orang Rimbaka", "The Rimbaka people"), members: [{ name: "Laras Rimbaka, IALI", role: tr("Arsitek lanskap utama", "Principal landscape architect"), photo: asset("v2b-face-6") }, { name: "Teguh Santoso", role: tr("Ahli hortikultura", "Horticulturist"), photo: asset("v2b-face-5") }, { name: "Citra Maharani", role: tr("Desainer lanskap", "Landscape designer"), photo: asset("v2b-face-2") }, { name: "Joko Lelono", role: tr("Kepala tim lapangan", "Field team lead"), photo: asset("v2b-face-1") }] }),
      ],
      projects: () => [
        pageHead(L, { ey: tr("Proyek", "Projects"), title: tr("Arsip proyek", "Project archive"), text: tr("Klik proyek untuk melihat material dan daftar tanaman.", "Each project lists its materials and plant palette.") }),
        imgCards(L, { cols: 2, ratio: "3 / 2", items: [{ image: "v2b-garden", meta: tr("Jakarta · 2025", "Jakarta · 2025"), title: tr("Taman Atap Menteng", "Menteng Roof Garden"), text: tr("Media tanam ringan 30 cm, 64 jenis tanaman, irigasi tetes otomatis.", "30 cm lightweight substrate, 64 species, automatic drip irrigation.") }, { image: "v2b-villa", meta: tr("Bali · 2024", "Bali · 2024"), title: tr("Resor Lembah Ayung", "Ayung Valley Resort"), text: tr("Terasering batu paras dan kolam biofilter alami.", "Paras stone terraces and a natural biofilter pond.") }, { image: "v2b-farm", meta: tr("Bogor · 2023", "Bogor · 2023"), title: tr("Taman Kota Cibinong", "Cibinong City Park"), text: tr("Bioswale 300 m menyerap limpasan hujan.", "A 300 m bioswale absorbing stormwater runoff.") }, { image: "estate-house-3", meta: tr("Depok · 2022", "Depok · 2022"), title: tr("Halaman Sekolah Alam", "Nature School Yard"), text: tr("Kebun pangan, area main lumpur, dan rumah pohon.", "Food garden, mud play area, and a treehouse.") }] }),
        gallery(L, { title: tr("Detail material", "Material details"), images: [["v2b-garden", tr("Jalur batu", "Stone path")], ["v2b-farm", tr("Terasering", "Terraces")], ["v2b-villa-dusk", tr("Pencahayaan taman", "Garden lighting")], ["v2b-room-2", tr("Taman dalam", "Courtyard")]], cols: 4, bg: L.alt }),
      ],
      approach: () => [
        pageHead(L, { ey: tr("Pendekatan", "Approach"), title: tr("Desain yang menghormati tanah dan air", "Design that respects soil and water"), dark: true }),
        steps(L, { title: tr("Cara kami bekerja", "How we work"), items: [[tr("Membaca tapak", "Reading the site"), tr("Uji tanah, arah matahari, aliran air.", "Soil tests, sun path, water flow.")], [tr("Konsep", "Concept"), tr("Sketsa tangan dan model 3D.", "Hand sketches and a 3D model.")], [tr("Palet tanaman", "Plant palette"), tr("80% spesies lokal.", "80% native species.")], [tr("Rawat 12 bulan", "12-month care"), tr("Kunjungan bulanan setelah tanam.", "Monthly visits after planting.")]] }),
        tabsSec(L, { title: tr("Tanaman andalan", "Signature plants"), bg: L.alt, tabs: [[tr("Peneduh", "Shade trees"), tr("Ketapang kencana, tabebuya, flamboyan — tumbuh cepat dan teduh.", "Ketapang kencana, tabebuia, flame trees — fast growing and shady.")], [tr("Semak", "Shrubs"), tr("Soka, pucuk merah, melati air — tahan panas kota.", "Ixora, red shoots, water jasmine — tolerant of city heat.")], [tr("Penutup tanah", "Groundcover"), tr("Rumput gajah mini, kacang hias, lili paris.", "Dwarf zoysia, perennial peanut, spider plant.")]] }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Ceritakan lahan Anda", "Tell us about your site"), text: tr("Kunjungan tapak pertama Rp1,5jt, dipotong dari biaya desain.", "The first site visit is Rp1.5m, credited against design fees."), info: [[tr("Studio", "Studio"), "Jl. Pajajaran 210, Bogor"], ["Email", "studio@rimbaka.example"]], fields: [{ k: "select", label: tr("Jenis proyek", "Project type"), ph: tr("Pilih", "Choose"), options: [tr("Rumah tinggal", "Residence"), tr("Resor / hotel", "Resort / hotel"), tr("Komersial", "Commercial"), tr("Ruang publik", "Public space")] }, { k: "input", label: tr("Luas lahan (m²)", "Site area (m²)"), ph: "600", type: "number" }, { k: "input", label: tr("Lokasi", "Location"), ph: "Bogor" }], submit: tr("Kirim", "Send") }),
      ],
    });
  },
};

/* --------------------- 17. news-magazine (PREMIUM, 10) ------------- */

const WC: Palette = { ink: "#111111", muted: "#4b4b4b", primary: "#c8102e", primaryDark: "#9b0d23", soft: "#fdf2f3", line: "#f3c7ce" };
const wcL = look(WC, { font: FONTS.sans, hf: FONTS.serif, r: 0, dark: "#111111", alt: "#f6f5f2", onDark: "#bdbdbd" });

export const newsMagazine: TemplateContent = {
  brand: "Warta Cakrawala",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("national", "Nasional", "National", "nasional", "national"),
    P("economy", "Ekonomi", "Economy", "ekonomi", "economy"),
    P("tech", "Teknologi", "Technology", "teknologi", "technology"),
    P("culture", "Budaya", "Culture", "budaya", "culture"),
    P("opinion", "Opini", "Opinion", "opini", "opinion"),
    P("story", "Berita Utama", "Top Story", "berita-utama", "top-story"),
    P("photos", "Foto", "Photos", "foto", "photos"),
    P("subscribe", "Langganan", "Subscribe", "langganan", "subscribe"),
    P("newsroom", "Redaksi", "Newsroom", "redaksi", "newsroom"),
  ],
  build: (key, tr, href) => {
    const L = wcL;
    const nav = mega(
      L,
      [
        `${tr("Rubrik", "Sections")} | ${href("national")}`,
        `- ${tr("Nasional", "National")} | ${tr("Politik & kebijakan", "Politics & policy")} | ${href("national")}`,
        `- ${tr("Ekonomi", "Economy")} | ${tr("Pasar & bisnis", "Markets & business")} | ${href("economy")}`,
        `- ${tr("Teknologi", "Technology")} | ${tr("Startup & sains", "Startups & science")} | ${href("tech")}`,
        `- ${tr("Budaya", "Culture")} | ${tr("Seni, film, kuliner", "Arts, film, food")} | ${href("culture")}`,
        `${tr("Opini", "Opinion")} | ${href("opinion")}`,
        `${tr("Foto", "Photos")} | ${href("photos")}`,
        `${tr("Redaksi", "Newsroom")} | ${href("newsroom")}`,
      ],
      tr("Langganan", "Subscribe"),
      href("subscribe"),
    );
    const head = withTopbar(header("Warta Cakrawala", WC, { nav, font: FONTS.serif }), L, tr("Pemilu daerah 2026: hasil hitung cepat di 37 provinsi diperbarui tiap 15 menit", "2026 regional elections: quick-count results across 37 provinces updated every 15 minutes"), { badge: tr("Terkini", "Live"), link: [tr("Ikuti", "Follow"), href("national")], bg: "#c8102e" });
    const foot = footer("Warta Cakrawala", tr("Media independen sejak 1998. Terverifikasi Dewan Pers.", "Independent media since 1998. Verified by the Press Council."), [{ title: tr("Rubrik", "Sections"), items: [tr("Nasional", "National"), tr("Ekonomi", "Economy"), tr("Teknologi", "Technology"), tr("Budaya", "Culture")] }, { title: tr("Perusahaan", "Company"), items: [tr("Redaksi", "Newsroom"), tr("Pedoman siber", "Cyber guidelines"), tr("Iklan", "Advertise")] }], tr("© 2026 Warta Cakrawala. Semua berita dalam template ini fiktif.", "© 2026 Warta Cakrawala. All stories in this template are fictional."), "#111111");
    const more = (items: { image: string; meta: string; title: string; text: string }[], title?: string, bg?: string) => imgCards(L, { title, items: items.map((i) => ({ ...i, link: [tr("Baca", "Read"), href("story")] as [string, string] })), cols: 3, bg });
    return render(L, key, head, foot, {
      home: () => [
        sliderSec(L, [[tr("Kabinet umumkan paket stimulus Rp120 T untuk UMKM", "Cabinet announces Rp120T stimulus for small businesses"), tr("Nasional · 6 menit baca", "National · 6 min read"), "#111111"], [tr("Rupiah menguat ke 15.420 per dolar AS", "Rupiah strengthens to 15,420 per US dollar"), tr("Ekonomi · 3 menit baca", "Economy · 3 min read"), "#9b0d23"], [tr("Satelit cuaca buatan Bandung meluncur dari Biak", "Bandung-built weather satellite launches from Biak"), tr("Teknologi · 5 menit baca", "Technology · 5 min read"), "#1e3a5f"]], { height: 420, padY: 24 }),
        more([{ image: "v2b-news-1", meta: tr("Nasional · 2 jam lalu", "National · 2 hours ago"), title: tr("DPR sahkan RUU Perlindungan Data turunan", "Parliament passes data protection bylaw"), text: tr("Sanksi denda hingga 2% pendapatan tahunan.", "Fines up to 2% of annual revenue.") }, { image: "v2b-news-2", meta: tr("Ekonomi · 3 jam lalu", "Economy · 3 hours ago"), title: tr("Ekspor kopi naik 18% di kuartal III", "Coffee exports up 18% in Q3"), text: tr("Permintaan dari Jepang dan Timur Tengah melonjak.", "Demand from Japan and the Middle East surges.") }, { image: "v2b-news-4", meta: tr("Budaya · 5 jam lalu", "Culture · 5 hours ago"), title: tr("Festival Lima Gunung kembali digelar", "Five Mountains Festival returns"), text: tr("Seniman desa lereng Merapi tampil tiga hari.", "Village artists from Merapi's slopes perform for three days.") }], tr("Berita terkini", "Latest news")),
        rowsList(L, { ey: tr("Terpopuler", "Most read"), title: tr("Dibaca paling banyak hari ini", "Most read today"), items: [{ meta: "01 · " + tr("Nasional", "National"), title: tr("Peta hitung cepat pilkada 37 provinsi", "Regional election quick-count map, 37 provinces"), text: tr("Diperbarui setiap 15 menit.", "Updated every 15 minutes."), link: [tr("Baca", "Read"), href("story")] }, { meta: "02 · " + tr("Teknologi", "Tech"), title: tr("Startup baterai sodium dapat pendanaan seri B", "Sodium battery startup raises Series B"), text: tr("Rp640 miliar dari investor regional.", "Rp640 billion from regional investors."), link: [tr("Baca", "Read"), href("tech")] }, { meta: "03 · " + tr("Opini", "Opinion"), title: tr("Kota kita butuh lebih banyak trotoar, bukan flyover", "Our cities need more sidewalks, not flyovers"), text: tr("Kolom Ratna Wijayanti.", "A column by Ratna Wijayanti."), link: [tr("Baca", "Read"), href("opinion")] }], bg: L.alt }),
        newsletter(L, { title: tr("Pagi Cakrawala", "Cakrawala Morning"), text: tr("Lima berita terpenting, di inbox Anda pukul 06.00.", "The five most important stories, in your inbox at 6am."), ph: "nama@email.com", btn: tr("Daftar gratis", "Sign up free") }),
      ],
      national: () => [
        pageHead(L, { ey: tr("Rubrik", "Section"), title: tr("Nasional", "National"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Nasional", "National"), ""]] }),
        split(L, { ey: tr("Laporan utama", "Lead report"), title: tr("Pilkada 2026: partisipasi pemilih muda tertinggi sejak 2004", "2026 regional elections: youth turnout highest since 2004"), paras: [tr("KPU mencatat 71% pemilih berusia 17–29 tahun datang ke TPS, naik 9 poin dari pemilu sebelumnya.", "The election commission recorded 71% turnout among voters aged 17–29, up 9 points from the previous election.")], image: "v2b-news-1", alt: tr("Ilustrasi pemilu", "Election illustration"), btn: [tr("Baca selengkapnya", "Read more"), href("story")] }),
        more([{ image: "v2b-news-3", meta: tr("Hukum", "Law"), title: tr("MK tolak uji materi UU Cipta Kerja jilid III", "Constitutional Court rejects third job-creation law review"), text: tr("Putusan dibacakan Selasa sore.", "Ruling read on Tuesday afternoon.") }, { image: "v2b-news-2", meta: tr("Daerah", "Regions"), title: tr("Banjir rob genangi 4 kecamatan di Semarang", "Tidal flooding hits 4 districts in Semarang"), text: tr("Ketinggian air hingga 60 cm.", "Water up to 60 cm deep.") }, { image: "v2b-news-5", meta: tr("Pendidikan", "Education"), title: tr("Kurikulum baru wajib di semua SMA 2027", "New curriculum mandatory in all high schools by 2027"), text: tr("Guru dapat pelatihan 40 jam.", "Teachers get 40 hours of training.") }], undefined, L.alt),
      ],
      economy: () => [
        pageHead(L, { ey: tr("Rubrik", "Section"), title: tr("Ekonomi", "Economy"), dark: true }),
        tableSec(L, { title: tr("Pasar hari ini", "Markets today"), text: tr("Data penutupan 15 Oktober 2026 (ilustrasi).", "Closing data for October 15, 2026 (illustrative)."), columns: [tr("Indikator", "Indicator"), tr("Nilai", "Value"), tr("Perubahan", "Change")], rows: [["IHSG", "7.482,15", "+0,84%"], ["USD/IDR", "15.420", "−0,31%"], [tr("Emas (gram)", "Gold (gram)"), "Rp1.312.000", "+0,12%"], [tr("Minyak Brent", "Brent oil"), "$78,40", "−1,05%"], ["BI Rate", "5,50%", tr("tetap", "unchanged")]] }),
        more([{ image: "v2b-news-2", meta: tr("Komoditas", "Commodities"), title: tr("Ekspor kopi naik 18% di kuartal III", "Coffee exports up 18% in Q3"), text: tr("Harga arabika rekor tertinggi.", "Arabica prices hit a record.") }, { image: "v2b-chart", meta: tr("Perbankan", "Banking"), title: tr("Kredit UMKM tumbuh 11% secara tahunan", "SME lending grows 11% year on year"), text: tr("Didorong program KUR.", "Driven by subsidized loans.") }, { image: "v2b-news-5", meta: tr("Properti", "Property"), title: tr("Harga rumah tapak stagnan di Jabodetabek", "Landed home prices flat in Greater Jakarta"), text: tr("Apartemen turun 3%.", "Apartments down 3%.") }], tr("Analisis", "Analysis"), L.alt),
      ],
      tech: () => [
        pageHead(L, { ey: tr("Rubrik", "Section"), title: tr("Teknologi", "Technology"), image: "v2b-news-6" }),
        imgCards(L, { cols: 2, items: [{ image: "v2b-news-3", meta: "Startup", title: tr("Startup baterai sodium dapat pendanaan seri B", "Sodium battery startup raises Series B"), text: tr("Pabrik percontohan di Batang mulai 2027.", "Pilot plant in Batang from 2027."), link: [tr("Baca", "Read"), href("story")] }, { image: "v2b-news-4", meta: tr("Sains", "Science"), title: tr("Satelit cuaca buatan Bandung meluncur", "Bandung-built weather satellite launches"), text: tr("Resolusi 500 m untuk prediksi hujan.", "500 m resolution for rain forecasting."), link: [tr("Baca", "Read"), href("story")] }] }),
        cards(L, { title: tr("Penjelasan singkat", "Explainers"), cols: 3, style: "line", bg: L.alt, items: [{ meta: tr("3 menit", "3 min"), title: tr("Apa itu baterai sodium-ion?", "What is a sodium-ion battery?"), text: tr("Lebih murah dari litium, cocok untuk penyimpanan surya.", "Cheaper than lithium, suited to solar storage.") }, { meta: tr("4 menit", "4 min"), title: tr("Cara kerja AI pendeteksi hoaks", "How AI hoax detectors work"), text: tr("Dan mengapa masih butuh manusia.", "And why humans are still needed.") }, { meta: tr("2 menit", "2 min"), title: tr("UU PDP untuk orang awam", "Data protection law for everyone"), text: tr("Hak Anda atas data pribadi.", "Your rights over personal data.") }] }),
      ],
      culture: () => [
        pageHead(L, { ey: tr("Rubrik", "Section"), title: tr("Budaya", "Culture"), center: true }),
        gallery(L, { images: [["v2b-news-4", tr("Festival Lima Gunung", "Five Mountains Festival")], ["v2b-arch", tr("Pameran tekstil", "Textile exhibition")], ["v2b-music", tr("Konser keroncong", "Keroncong concert")]], cols: 3, ratio: "4 / 3" }),
        more([{ image: "v2b-news-4", meta: tr("Seni", "Arts"), title: tr("Festival Lima Gunung kembali digelar", "Five Mountains Festival returns"), text: tr("Tiga hari di lereng Merapi.", "Three days on Merapi's slopes.") }, { image: "food-hero", meta: tr("Kuliner", "Food"), title: tr("Rawon jadi sup terbaik dunia versi TasteAtlas", "Rawon named world's best soup by TasteAtlas"), text: tr("Warung legendaris kebanjiran tamu.", "Legendary stalls swamped with diners.") }, { image: "v2b-film", meta: "Film", title: tr("Film animasi Indonesia tembus Annecy", "Indonesian animated film reaches Annecy"), text: tr("Diproduksi studio di Yogyakarta.", "Produced by a Yogyakarta studio.") }]),
      ],
      opinion: () => [
        pageHead(L, { ey: tr("Opini", "Opinion"), title: tr("Kolom & editorial", "Columns & editorials"), dark: true }),
        quote(L, { text: tr("Kota yang ramah pejalan kaki adalah kota yang ramah bagi semua orang — termasuk pengendara.", "A city that's good for walking is good for everyone — drivers included."), name: "Ratna Wijayanti", role: tr("Kolumnis tata kota", "Urban planning columnist") }),
        rowsList(L, { title: tr("Kolom terbaru", "Latest columns"), items: [{ meta: "Ratna Wijayanti · " + tr("15 Okt", "Oct 15"), title: tr("Kota kita butuh lebih banyak trotoar", "Our cities need more sidewalks"), text: tr("Tentang flyover yang memindahkan macet.", "On flyovers that just move traffic jams."), link: [tr("Baca", "Read"), href("story")] }, { meta: tr("Editorial · 14 Okt", "Editorial · Oct 14"), title: tr("Stimulus UMKM harus tepat sasaran", "SME stimulus must hit its target"), text: tr("Data penerima perlu dibuka.", "Recipient data should be public."), link: [tr("Baca", "Read"), href("story")] }, { meta: "Budi Hartono · " + tr("12 Okt", "Oct 12"), title: tr("Belajar dari banjir rob Semarang", "Lessons from Semarang's tidal floods"), text: tr("Tanggul saja tidak cukup.", "Sea walls alone aren't enough."), link: [tr("Baca", "Read"), href("story")] }], bg: L.alt }),
      ],
      story: () => [
        ...article(L, { meta: tr("Nasional · 15 Oktober 2026, 07.30 WIB", "National · October 15, 2026, 7:30am WIB"), title: tr("Kabinet umumkan paket stimulus Rp120 triliun untuk UMKM", "Cabinet announces Rp120 trillion stimulus for small businesses"), lead: tr("Paket mencakup subsidi bunga, keringanan pajak, dan program digitalisasi bagi 8 juta pelaku usaha.", "The package covers interest subsidies, tax relief, and a digitization program for 8 million businesses."), image: "v2b-news-1", author: ["Dimas Prasetyo", tr("Wartawan ekonomi", "Economics reporter"), "v2b-face-1"], body: [tr("Menteri Koordinator Perekonomian menyebut stimulus akan disalurkan mulai Januari 2027 melalui 14 bank penyalur.", "The coordinating economic minister said the stimulus will roll out from January 2027 through 14 lending banks."), tr("Sebanyak Rp45 triliun dialokasikan untuk subsidi bunga KUR menjadi 3%.", "Rp45 trillion is allocated to cut subsidized loan rates to 3%."), tr("Ekonom menilai paket ini positif, namun mengingatkan pentingnya data penerima yang akurat.", "Economists welcomed the package but stressed the need for accurate recipient data."), tr("Asosiasi UMKM meminta pemerintah menyederhanakan syarat pengajuan.", "SME associations urged the government to simplify application requirements.")], pull: tr("“Tanpa data yang benar, stimulus bisa jatuh ke tangan yang salah.” — Ekonom Sri Handayani", "“Without the right data, stimulus can end up in the wrong hands.” — Economist Sri Handayani"), sub: tr("Rincian paket", "Package breakdown"), list: [tr("Subsidi bunga KUR: Rp45 T", "Loan interest subsidy: Rp45T"), tr("Keringanan PPh final: Rp30 T", "Final income tax relief: Rp30T"), tr("Digitalisasi & pelatihan: Rp25 T", "Digitization & training: Rp25T"), tr("Penjaminan kredit: Rp20 T", "Credit guarantees: Rp20T")], tags: ["UMKM", tr("Stimulus", "Stimulus"), tr("Ekonomi", "Economy")] }),
        more([{ image: "v2b-chart", meta: tr("Ekonomi", "Economy"), title: tr("Kredit UMKM tumbuh 11%", "SME lending grows 11%"), text: "" }, { image: "v2b-news-2", meta: tr("Ekonomi", "Economy"), title: tr("Ekspor kopi naik 18%", "Coffee exports up 18%"), text: "" }, { image: "v2b-news-5", meta: tr("Nasional", "National"), title: tr("Kurikulum baru 2027", "New curriculum 2027"), text: "" }], tr("Berita terkait", "Related stories"), L.alt),
      ],
      photos: () => [
        pageHead(L, { ey: tr("Foto", "Photos"), title: tr("Esai foto: Sehari di Pelabuhan Paotere", "Photo essay: A day at Paotere Harbor"), dark: true }),
        sliderSec(L, [[tr("04.30 — Perahu pinisi bersandar", "4:30am — Pinisi boats dock"), tr("Foto: Andi Mappa", "Photo: Andi Mappa"), "#1e3a5f"], [tr("06.00 — Lelang ikan dimulai", "6am — The fish auction begins"), tr("Foto: Andi Mappa", "Photo: Andi Mappa"), "#7c2d12"], [tr("09.00 — Buruh angkut beristirahat", "9am — Porters take a break"), tr("Foto: Andi Mappa", "Photo: Andi Mappa"), "#111111"]], { height: 460, bg: "#111111" }),
        gallery(L, { images: [["v2b-containers", tr("Dermaga", "Wharf")], ["v2b-news-2", tr("Pasar ikan", "Fish market")], ["v2b-truck", tr("Distribusi", "Distribution")], ["v2b-news-5", tr("Senja", "Dusk")]], cols: 4, ratio: "3 / 4" }),
      ],
      subscribe: () => [
        priceSwitch(L, { ey: tr("Langganan", "Subscribe"), title: tr("Jurnalisme yang Anda dukung", "Journalism you support"), text: tr("Tanpa iklan pop-up, akses arsip sejak 1998.", "No pop-up ads, archive access back to 1998."), monthly: tr("Bulanan", "Monthly"), yearly: tr("Tahunan", "Yearly"), save: tr("Hemat 25%", "Save 25%"), pm: tr("/bulan", "/month"), py: tr("/tahun", "/year"), href: href("newsroom"), plans: [tr("Digital | Rp49rb | Rp440rb | Semua artikel; Tanpa iklan; Newsletter premium | Berlangganan", "Digital | Rp49k | Rp440k | All articles; Ad-free; Premium newsletters | Subscribe"), tr("Digital + Cetak | Rp129rb | Rp1,16jt | Semua di Digital; Edisi cetak Minggu; Arsip PDF | Berlangganan", "Digital + Print | Rp129k | Rp1.16m | Everything in Digital; Sunday print edition; PDF archive | Subscribe"), tr("Pendukung | Rp250rb | Rp2,2jt | Semua di Digital + Cetak; Diskusi bulanan dengan redaksi; Nama di laporan tahunan | Dukung", "Supporter | Rp250k | Rp2.2m | Everything in Digital + Print; Monthly newsroom talks; Name in annual report | Support")] }),
        faqAccordion(L.t, tr, { items: [[tr("Bisa dibatalkan?", "Can I cancel?"), tr("Kapan saja dari halaman akun.", "Any time from your account page.")], [tr("Ada harga pelajar?", "Student pricing?"), tr("Diskon 50% dengan email kampus.", "50% off with a university email.")]] }),
      ],
      newsroom: () => [
        pageHead(L, { ey: tr("Redaksi", "Newsroom"), title: tr("Siapa kami", "Who we are"), text: tr("62 jurnalis di 9 biro. Kami tunduk pada Kode Etik Jurnalistik dan Pedoman Pemberitaan Media Siber.", "62 journalists in 9 bureaus. We follow the Journalistic Code of Ethics and Cyber Media Guidelines.") }),
        teamCards(L.t, tr, { eyebrow: tr("Pimpinan redaksi", "Editorial leadership"), title: tr("Dewan redaksi", "Editorial board"), members: [{ name: "Maria Sitanggang", role: tr("Pemimpin redaksi", "Editor-in-chief"), photo: asset("v2b-face-6") }, { name: "Hasan Basri", role: tr("Redaktur pelaksana", "Managing editor"), photo: asset("v2b-face-5") }, { name: "Anindya Kusuma", role: tr("Editor data", "Data editor"), photo: asset("v2b-face-2") }, { name: "Andi Mappa", role: tr("Editor foto", "Photo editor"), photo: asset("v2b-face-3") }] }),
        accordionSec(L, { title: tr("Pedoman redaksi", "Editorial standards"), items: [[tr("Koreksi", "Corrections"), tr("Kesalahan dikoreksi di artikel yang sama dengan catatan waktu.", "Errors are corrected in the same article with a timestamp note.")], [tr("Narasumber anonim", "Anonymous sources"), tr("Hanya jika keselamatan terancam dan disetujui pemimpin redaksi.", "Only when safety is at risk and approved by the editor-in-chief.")], [tr("Konten bersponsor", "Sponsored content"), tr("Selalu diberi label ‘Advertorial’.", "Always labeled ‘Advertorial’.")]] }),
      ],
    });
  },
};

/* --------------------- 18. startup-fintech (PREMIUM, 9) ------------ */

const DP: Palette = { ink: "#1e1336", muted: "#5b5675", primary: "#7c3aed", primaryDark: "#5b21b6", soft: "#f5f3ff", line: "#ddd6fe" };
const dpL = look(DP, { font: FONTS.sans, r: 22, dark: "#1e1336", alt: "#f8f7fc", onDark: "#c4b5fd" });

export const startupFintech: TemplateContent = {
  brand: "Dompetra",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("features", "Fitur", "Features", "fitur", "features"),
    P("pricing", "Harga", "Pricing", "harga", "pricing"),
    P("security", "Keamanan", "Security", "keamanan", "security"),
    P("business", "Bisnis", "Business", "bisnis", "business"),
    P("developers", "Developer", "Developers", "developer", "developers"),
    P("about", "Tentang", "About", "tentang", "about"),
    P("careers", "Karier", "Careers", "karier", "careers"),
    P("help", "Bantuan", "Help", "bantuan", "help"),
  ],
  build: (key, tr, href) => {
    const L = dpL;
    const head = header("dompetra", DP, { font: FONTS.sans, sticky: true, cta: cta(tr("Unduh aplikasi", "Get the app"), href("pricing"), DP) });
    const foot = footer("dompetra", tr("Dompet digital & kartu debit untuk generasi yang serba cepat. Diawasi OJK & Bank Indonesia (contoh).", "A digital wallet & debit card for a fast generation. Supervised by OJK & Bank Indonesia (sample)."), [{ title: tr("Produk", "Product"), items: [tr("Fitur", "Features"), tr("Harga", "Pricing"), tr("Bisnis", "Business"), "API"] }, { title: tr("Perusahaan", "Company"), items: [tr("Tentang", "About"), tr("Karier", "Careers"), tr("Keamanan", "Security")] }, { title: tr("Bantuan", "Help"), items: ["halo@dompetra.example", "1500-818"] }], tr("© 2026 PT Dompetra Digital Nusantara. Produk fiktif.", "© 2026 PT Dompetra Digital Nusantara. Fictional product."), "#1e1336");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { badge: tr("Baru: kartu debit virtual instan", "New: instant virtual debit card"), title: tr("Uangmu, lebih rapi dari spreadsheet", "Your money, tidier than a spreadsheet"), text: tr("Atur kantong tabungan, bagi tagihan dengan teman, dan transfer gratis ke 140 bank — semua dari satu aplikasi.", "Set up savings pockets, split bills with friends, and transfer free to 140 banks — all in one app."), btns: [[tr("Buka akun gratis", "Open a free account"), href("pricing")], [tr("Lihat fitur", "See features"), href("features")]], image: "v2b-phone", alt: tr("Aplikasi Dompetra", "Dompetra app"), gradient: [DP.soft, "#ffffff", 160], note: tr("Registrasi 3 menit dengan e-KTP", "3-minute sign-up with your e-ID") }),
        counters(L, [["3,2 jt", tr("Pengguna", "Users")], ["140", tr("Bank terhubung", "Connected banks")], ["Rp0", tr("Biaya transfer", "Transfer fee")], ["4,8★", tr("Rating aplikasi", "App rating")]]),
        featuresIcons(L.t, tr, { eyebrow: tr("Fitur", "Features"), title: tr("Semua yang dibutuhkan dompetmu", "Everything your wallet needs"), items: [{ icon: "🫙", title: tr("Kantong", "Pockets"), text: tr("Hingga 20 kantong dengan target & bunga 4% p.a.", "Up to 20 pockets with goals & 4% p.a. interest.") }, { icon: "🧾", title: tr("Bagi tagihan", "Split bills"), text: tr("Tagih teman lewat tautan, lunas otomatis.", "Request via link, auto-settled.") }, { icon: "💳", title: tr("Kartu virtual", "Virtual card"), text: tr("Untuk belanja online, bisa dibekukan kapan saja.", "For online shopping, freeze anytime.") }, { icon: "📊", title: tr("Analitik", "Insights"), text: tr("Pengeluaran per kategori, otomatis.", "Spending by category, automatically.") }], columns: 4 }),
        testimonialsWall(L.t, tr, { title: tr("Pengguna yang sudah pindah", "People who switched"), score: 4.8, caption: tr("dari 210.000 ulasan", "from 210,000 reviews"), quotes: [{ text: tr("Kantong ‘Dana Darurat’ akhirnya terisi 6 bulan gaji.", "My ‘Emergency Fund’ pocket finally hit 6 months of salary."), name: "Galih Saputra", role: tr("Pengguna sejak 2024", "User since 2024"), avatar: asset("v2b-face-1") }, { text: tr("Bagi tagihan kos dan listrik jadi tidak canggung lagi.", "Splitting rent and utilities isn't awkward anymore."), name: "Nabila Rahma", role: tr("Mahasiswi, Yogyakarta", "Student, Yogyakarta"), avatar: asset("v2b-face-4") }, { text: tr("Kartu virtual bikin belanja online jauh lebih tenang.", "The virtual card makes online shopping much less stressful."), name: "Steven Wijaya", role: tr("Desainer lepas", "Freelance designer"), avatar: asset("v2b-face-3") }] }),
        ctaSplit(L, { title: tr("Buka akun dalam 3 menit", "Open an account in 3 minutes"), text: tr("Gratis selamanya untuk fitur dasar.", "Free forever for core features."), btns: [[tr("Mulai", "Get started"), href("pricing")]] }),
      ],
      features: () => [
        pageHead(L, { ey: tr("Fitur", "Features"), title: tr("Dirancang untuk kebiasaan uang yang lebih baik", "Designed for better money habits"), image: "v2b-phone" }),
        tabsSec(L, { title: tr("Jelajahi fitur", "Explore features"), variant: "pills", tabs: [[tr("Kantong", "Pockets"), tr("Pisahkan uang untuk liburan, cicilan, dan dana darurat. Atur setoran otomatis tiap gajian.", "Separate money for trips, installments, and emergencies. Auto-deposit every payday.")], [tr("Bagi tagihan", "Split bills"), tr("Bagi rata atau per item, kirim tautan ke teman yang belum pakai Dompetra.", "Split evenly or by item, send a link to friends who don't use Dompetra.")], [tr("Kartu", "Cards"), tr("Kartu debit fisik Visa dan kartu virtual tak terbatas untuk langganan.", "A physical Visa debit card and unlimited virtual cards for subscriptions.")], [tr("Investasi", "Investing"), tr("Reksa dana pasar uang mulai Rp10.000 bersama mitra MI berizin.", "Money market funds from Rp10,000 with licensed partners.")]] }),
        steps(L, { title: tr("Mulai dalam 4 langkah", "Start in 4 steps"), items: [[tr("Unduh", "Download"), tr("iOS & Android.", "iOS & Android.")], [tr("Verifikasi", "Verify"), tr("e-KTP & swafoto.", "e-ID & selfie.")], [tr("Isi saldo", "Top up"), tr("Dari 140 bank.", "From 140 banks.")], [tr("Atur kantong", "Set pockets"), tr("Template siap pakai.", "Ready-made templates.")]], bg: L.alt }),
      ],
      pricing: () => [
        priceSwitch(L, { ey: tr("Harga", "Pricing"), title: tr("Gratis untuk mulai, Plus untuk lebih", "Free to start, Plus for more"), monthly: tr("Bulanan", "Monthly"), yearly: tr("Tahunan", "Yearly"), save: tr("Hemat 2 bulan", "2 months free"), pm: tr("/bulan", "/month"), py: tr("/tahun", "/year"), href: href("help"), plans: [tr("Dasar | Rp0 | Rp0 | 5 kantong; 25 transfer gratis/bln; Kartu virtual 1 | Buka akun", "Basic | Rp0 | Rp0 | 5 pockets; 25 free transfers/mo; 1 virtual card | Open account"), tr("Plus | Rp29rb | Rp290rb | 20 kantong; Transfer tanpa batas; Kartu fisik gratis; Cashback 1% | Coba 30 hari", "Plus | Rp29k | Rp290k | 20 pockets; Unlimited transfers; Free physical card; 1% cashback | Try 30 days"), tr("Keluarga | Rp59rb | Rp590rb | 5 anggota; Kantong bersama; Kontrol anak | Coba 30 hari", "Family | Rp59k | Rp590k | 5 members; Shared pockets; Parental controls | Try 30 days")] }),
        compareSec(L, { title: tr("Bandingkan paket", "Compare plans"), columns: [tr("Dasar", "Basic"), "Plus", tr("Keluarga", "Family")], rows: [tr("Kantong | 5 | 20 | 20/anggota", "Pockets | 5 | 20 | 20/member"), tr("Transfer gratis | 25/bln | tanpa batas | tanpa batas", "Free transfers | 25/mo | unlimited | unlimited"), tr("Kartu fisik | tidak | ya | ya", "Physical card | no | yes | yes"), tr("Cashback | tidak | 1% | 1%", "Cashback | no | 1% | 1%"), tr("Kontrol orang tua | tidak | tidak | ya", "Parental controls | no | no | yes")], bg: L.alt }),
      ],
      security: () => [
        pageHead(L, { ey: tr("Keamanan", "Security"), title: tr("Dana aman, data terlindungi", "Funds safe, data protected"), dark: true }),
        cards(L, { cols: 3, items: [{ icon: "🏦", title: tr("Dana di bank kustodian", "Funds at custodian banks"), text: tr("Saldo disimpan terpisah di 2 bank BUMN.", "Balances held separately at 2 state banks.") }, { icon: "🔐", title: tr("Enkripsi AES-256", "AES-256 encryption"), text: tr("Data sensitif terenkripsi saat disimpan & dikirim.", "Sensitive data encrypted at rest & in transit.") }, { icon: "🧠", title: tr("Deteksi penipuan", "Fraud detection"), text: tr("Model risiko memeriksa setiap transaksi < 100 ms.", "Risk models check every transaction in < 100 ms.") }] }),
        accordionSec(L, { title: tr("Pertanyaan keamanan", "Security questions"), bg: L.alt, items: [[tr("Bagaimana jika HP hilang?", "What if I lose my phone?"), tr("Blokir akun dari dompetra.example/blokir atau hubungi 1500-818.", "Lock your account at dompetra.example/lock or call 1500-818.")], [tr("Apakah dijamin LPS?", "Is it deposit insured?"), tr("Kantong berbunga ditempatkan di bank peserta LPS.", "Interest pockets are placed at insured banks.")], [tr("Sertifikasi?", "Certifications?"), "ISO 27001, PCI DSS Level 1."]] }),
      ],
      business: () => [
        servicesSplit(L.t, tr, { eyebrow: "Dompetra Bisnis", title: tr("Terima pembayaran & bayar gaji dari satu dasbor", "Accept payments & run payroll from one dashboard"), image: asset("v2b-chart-dark"), items: [{ icon: "QR", title: "QRIS", text: tr("MDR 0,3% untuk usaha mikro.", "0.3% MDR for micro businesses.") }, { icon: "💸", title: tr("Pembayaran massal", "Bulk payouts"), text: tr("Gaji & komisi ke 1.000 rekening sekaligus.", "Salaries & commissions to 1,000 accounts at once.") }, { icon: "🧮", title: tr("Rekonsiliasi", "Reconciliation"), text: tr("Ekspor ke Jurnal & Accurate.", "Export to Jurnal & Accurate.") }], cta: { label: tr("Hubungi sales", "Contact sales"), href: href("help") } }),
        logos(L, { title: tr("Dipakai oleh", "Used by"), names: ["Kedai Senja", "Laundry Kilat", "Toko Tani", "Batik Kirana", "Gym Ruang Gerak"], bg: L.alt }),
      ],
      developers: () => [
        pageHead(L, { ey: "API", title: tr("Bangun di atas Dompetra", "Build on Dompetra"), text: tr("REST API, webhook, dan sandbox gratis.", "REST API, webhooks, and a free sandbox."), dark: true }),
        steps(L, { title: tr("Integrasi dalam sehari", "Integrate in a day"), items: [[tr("Daftar sandbox", "Sign up for sandbox"), tr("Kunci API instan.", "Instant API keys.")], [tr("Buat tagihan", "Create an invoice"), "POST /v1/invoices"], [tr("Terima webhook", "Receive webhooks"), "invoice.paid"], [tr("Go live", "Go live"), tr("Review 2 hari kerja.", "2-business-day review.")]] }),
        tableSec(L, { title: tr("Batas API", "API limits"), columns: [tr("Endpoint", "Endpoint"), tr("Batas", "Limit"), tr("Latensi p95", "p95 latency")], rows: [["/v1/invoices", "100 req/s", "120 ms"], ["/v1/payouts", "50 req/s", "180 ms"], ["/v1/balance", "200 req/s", "40 ms"]], bg: L.alt }),
      ],
      about: () => [
        split(L, { ey: tr("Tentang", "About"), title: tr("Didirikan karena frustrasi pada biaya admin", "Founded out of frustration with admin fees"), paras: [tr("Tiga mantan bankir memulai Dompetra pada 2021 dengan satu misi: membuat mengatur uang semudah mengirim pesan.", "Three former bankers started Dompetra in 2021 with one mission: make managing money as easy as sending a message.")], image: "v2b-phone", alt: tr("Aplikasi", "App") }),
        timeline(L, { title: tr("Tonggak", "Milestones"), bg: L.alt, items: [["2021", tr("Didirikan", "Founded"), tr("Pendanaan awal $2 jt.", "$2M seed round.")], ["2023", tr("Izin uang elektronik", "E-money license"), tr("Dari Bank Indonesia.", "From Bank Indonesia.")], ["2025", tr("1 juta pengguna", "1 million users"), tr("Seri B $40 jt.", "$40M Series B.")], ["2026", tr("Kartu fisik", "Physical card"), tr("Kerja sama Visa.", "Partnership with Visa.")]] }),
      ],
      careers: () => [
        pageHead(L, { ey: tr("Karier", "Careers"), title: tr("Bantu 3 juta orang mengatur uangnya", "Help 3 million people manage their money"), center: true }),
        rowsList(L, { title: tr("Posisi terbuka", "Open roles"), items: [{ meta: tr("Jakarta · Hybrid", "Jakarta · Hybrid"), title: "Senior Backend Engineer (Go)", text: tr("Tim pembayaran.", "Payments team."), link: [tr("Lamar", "Apply"), href("help")] }, { meta: tr("Remote Indonesia", "Remote Indonesia"), title: "Product Designer", text: tr("Tim kantong & tabungan.", "Pockets & savings team."), link: [tr("Lamar", "Apply"), href("help")] }, { meta: "Jakarta", title: tr("Analis Risiko Penipuan", "Fraud Risk Analyst"), text: tr("Tim keamanan.", "Security team."), link: [tr("Lamar", "Apply"), href("help")] }] }),
        cards(L, { title: tr("Benefit", "Benefits"), cols: 4, style: "plain", bg: L.alt, items: [{ icon: "🏥", title: tr("Asuransi keluarga", "Family insurance"), text: tr("Rawat inap & jalan.", "In & outpatient.") }, { icon: "📈", title: "ESOP", text: tr("Untuk semua karyawan tetap.", "For all permanent staff.") }, { icon: "🏝️", title: tr("Cuti 20 hari", "20 days leave"), text: tr("Plus cuti ulang tahun.", "Plus a birthday day off.") }, { icon: "📚", title: tr("Dana belajar", "Learning budget"), text: tr("Rp10 jt per tahun.", "Rp10M per year.") }] }),
      ],
      help: () => [
        faqAccordion(L.t, tr, { eyebrow: tr("Bantuan", "Help"), title: tr("Pusat bantuan", "Help center"), items: [[tr("Bagaimana cara isi saldo?", "How do I top up?"), tr("Lewat transfer bank, virtual account, atau minimarket.", "Via bank transfer, virtual account, or convenience stores.")], [tr("Berapa batas saldo?", "What's the balance limit?"), tr("Rp20 juta untuk akun terverifikasi.", "Rp20 million for verified accounts.")], [tr("Transfer gagal tapi saldo terpotong?", "Transfer failed but I was charged?"), tr("Dana kembali otomatis maksimal 1x24 jam.", "Funds return automatically within 24 hours.")]], contact: { label: tr("Chat dengan kami", "Chat with us"), href: "#chat" } }),
        formSec(L, { title: tr("Kirim tiket", "Submit a ticket"), fields: [{ k: "input", label: "Email", ph: "nama@email.com", type: "email" }, { k: "select", label: tr("Topik", "Topic"), ph: tr("Pilih", "Choose"), options: [tr("Akun", "Account"), tr("Transaksi", "Transactions"), tr("Kartu", "Card"), tr("Bisnis", "Business")] }, { k: "input", label: tr("ID transaksi (opsional)", "Transaction ID (optional)"), ph: "TRX-2610-..." }], submit: tr("Kirim tiket", "Submit ticket"), info: [[tr("Telepon 24 jam", "24h phone"), "1500-818"], ["Email", "halo@dompetra.example"]] }),
      ],
    });
  },
};

/* --------------------- 19. shop-furniture (PREMIUM, 8) ------------- */

const JW: Palette = { ink: "#2a2118", muted: "#6b5d4f", primary: "#9a6b3f", primaryDark: "#7a5230", soft: "#f6efe6", line: "#e6d7c3" };
const jwL = look(JW, { font: FONTS.sans, hf: FONTS.serif, r: 4, dark: "#2a2118", alt: "#f6efe6", bg: "#fffdf9", onDark: "#e6d7c3" });

export const shopFurniture: TemplateContent = {
  brand: "Jatiwangi Living",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("catalog", "Katalog", "Catalog", "katalog", "catalog"),
    P("product", "Detail Produk", "Product Detail", "detail-produk", "product"),
    P("collections", "Koleksi", "Collections", "koleksi", "collections"),
    P("custom", "Pesanan Khusus", "Custom Orders", "pesanan-khusus", "custom-orders"),
    P("care", "Perawatan", "Care Guide", "perawatan", "care-guide"),
    P("about", "Tentang", "About", "tentang", "about"),
    P("showroom", "Showroom", "Showroom", "showroom", "showroom"),
  ],
  build: (key, tr, href) => {
    const L = jwL;
    const head = centeredHeader("JATIWANGI LIVING", JW, { font: FONTS.serif, bg: "#fffdf9" });
    const foot = footer("Jatiwangi Living", tr("Furnitur kayu jati & rotan buatan perajin Jepara dan Cirebon.", "Teak & rattan furniture made by Jepara and Cirebon artisans."), [{ title: tr("Belanja", "Shop"), items: [tr("Katalog", "Catalog"), tr("Koleksi", "Collections"), tr("Pesanan khusus", "Custom orders")] }, { title: "Showroom", items: ["Jl. Kemang Timur 18", "Jakarta Selatan"] }, { title: tr("Kontak", "Contact"), items: ["+62 811 1010 7070", "halo@jatiwangi.example"] }], tr("© 2026 Jatiwangi Living. Harga contoh, tanpa transaksi online.", "© 2026 Jatiwangi Living. Sample prices, no online checkout."), "#2a2118");
    const item = (image: string, idT: string, enT: string, idD: string, enD: string, price: string, extra: { compare?: string; badge?: string; rating?: number; reviews?: string } = {}) => ({ image, title: tr(idT, enT), text: tr(idD, enD), price, rating: 4.8, reviews: "(40)", ...extra });
    const all = [
      item("v2b-sofa", "Sofa Rangka Jati 3 Dudukan", "3-Seater Teak Frame Sofa", "Jati grade A · linen abu", "Grade-A teak · grey linen", "Rp12.900.000", { badge: tr("Terlaris", "Best seller"), rating: 4.9, reviews: "(128)" }),
      item("v2b-chair", "Kursi Makan Rotan Lengkung", "Curved Rattan Dining Chair", "Rotan sintetis · set 2", "Synthetic rattan · set of 2", "Rp3.450.000", { rating: 4.8, reviews: "(86)" }),
      item("v2b-table", "Meja Makan Bundar Trembesi", "Round Suar Wood Dining Table", "Diameter 120 cm", "120 cm diameter", "Rp8.750.000", { compare: "Rp9.900.000", rating: 4.7, reviews: "(52)" }),
      item("v2b-lamp", "Lampu Lantai Anyaman", "Woven Floor Lamp", "Bambu & kuningan · 150 cm", "Bamboo & brass · 150 cm", "Rp1.890.000", { badge: tr("Baru", "New"), rating: 4.8, reviews: "(19)" }),
      item("v2b-shelf", "Rak Buku Jati Terbuka", "Open Teak Bookshelf", "5 tingkat · 180 cm", "5 tiers · 180 cm", "Rp6.200.000", { rating: 4.9, reviews: "(44)" }),
      item("v2b-bed", "Ranjang Jati Kepala Rendah", "Low-Headboard Teak Bed", "Queen 160×200", "Queen 160×200", "Rp14.500.000", { rating: 4.8, reviews: "(31)" }),
    ];
    const grid = (items: typeof all, title?: string, ey?: string, bg?: string) => products(L, { ey, title, items, cta: tr("Lihat detail", "View details"), href: href("product"), bg });
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { ey: tr("Koleksi Musim Hujan 2026", "Rainy Season Collection 2026"), title: tr("Furnitur kayu yang diwariskan, bukan diganti", "Wooden furniture to hand down, not replace"), text: tr("Jati bersertifikat SVLK, rotan Cirebon, dan finishing minyak alami — dibuat per pesanan oleh 60 perajin.", "SVLK-certified teak, Cirebon rattan, and natural oil finishes — made to order by 60 artisans."), btns: [[tr("Jelajahi katalog", "Browse catalog"), href("catalog")], [tr("Kunjungi showroom", "Visit the showroom"), href("showroom")]], image: "v2b-sofa", alt: tr("Sofa jati", "Teak sofa"), ratio: "1 / 1", bg: JW.soft }),
        grid(all.slice(0, 3), tr("Paling dicari", "Most wanted"), tr("Terlaris", "Best sellers")),
        imgCards(L, { title: tr("Belanja per ruangan", "Shop by room"), cols: 3, ratio: "4 / 3", bg: L.alt, items: [{ image: "v2b-room", title: tr("Ruang keluarga", "Living room"), text: tr("Sofa, meja kopi, rak.", "Sofas, coffee tables, shelves."), link: [tr("Lihat", "View"), href("collections")] }, { image: "v2b-table", title: tr("Ruang makan", "Dining room"), text: tr("Meja, kursi, bufet.", "Tables, chairs, sideboards."), link: [tr("Lihat", "View"), href("collections")] }, { image: "v2b-bed", title: tr("Kamar tidur", "Bedroom"), text: tr("Ranjang, nakas, lemari.", "Beds, nightstands, wardrobes."), link: [tr("Lihat", "View"), href("collections")] }] }),
        testimonialsWall(L.t, tr, { title: tr("Rumah para pelanggan", "Our customers' homes"), score: 4.9, caption: tr("dari 860 ulasan", "from 860 reviews"), quotes: [{ text: tr("Meja makan trembesi kami jadi pusat rumah. Seratnya cantik sekali.", "Our suar wood table became the heart of the house. Gorgeous grain."), name: "Ratih & Bayu", role: tr("Bintaro", "Bintaro"), avatar: asset("v2b-face-4") }, { text: tr("Pesanan khusus rak buku sesuai ukuran ceruk dinding, pas sampai milimeter.", "A custom bookshelf made to fit our wall niche, to the millimeter."), name: "Ferdinand Lim", role: tr("Kelapa Gading", "Kelapa Gading"), avatar: asset("v2b-face-3") }, { text: tr("Pengiriman rapi, perakitan oleh tim mereka sendiri.", "Neat delivery, assembled by their own team."), name: "Sri Wulandari", role: tr("Depok", "Depok"), avatar: asset("v2b-face-6") }] }),
      ],
      catalog: () => [
        pageHead(L, { ey: tr("Katalog", "Catalog"), title: tr("Semua furnitur", "All furniture"), text: tr("Harga sudah termasuk pengiriman Jabodetabek. Produksi 3–6 minggu.", "Prices include Greater Jakarta delivery. 3–6 weeks production."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Katalog", "Catalog"), ""]] }),
        grid(all),
        ctaSplit(L, { title: tr("Ukuran tidak pas?", "Size doesn't fit?"), text: tr("Hampir semua produk bisa dibuat sesuai ukuran.", "Almost every piece can be made to measure."), btns: [[tr("Pesanan khusus", "Custom order"), href("custom")]] }),
      ],
      product: () => [
        productDetail(L, { crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Katalog", "Catalog"), href("catalog")], [tr("Sofa Rangka Jati", "Teak Frame Sofa"), ""]], image: "v2b-sofa", thumbs: ["v2b-sofa", "v2b-room", "v2b-chair"], tag: tr("Dibuat per pesanan · 4 minggu", "Made to order · 4 weeks"), title: tr("Sofa Rangka Jati 3 Dudukan", "3-Seater Teak Frame Sofa"), price: "Rp12.900.000", rating: 4.9, reviews: tr("dari 128 pembeli", "from 128 buyers"), text: tr("Rangka jati grade A dengan sambungan pasak, dudukan busa density 32 dan bantal bulu sintetis. Sarung linen bisa dilepas dan dicuci.", "Grade-A teak frame with pegged joints, density-32 foam seats, and synthetic down cushions. Removable, washable linen covers."), options: [{ k: "select", label: tr("Warna kain", "Fabric color"), ph: tr("Pilih warna", "Choose a color"), options: [tr("Abu batu", "Stone grey"), tr("Krem pasir", "Sand cream"), tr("Hijau zaitun", "Olive green")] }, { k: "select", label: "Finishing", ph: tr("Pilih finishing", "Choose a finish"), options: [tr("Minyak alami", "Natural oil"), tr("Walnut", "Walnut"), tr("Natural doff", "Matte natural")] }], btns: [[tr("Tanya via WhatsApp", "Ask on WhatsApp"), href("showroom")], [tr("Lihat di showroom", "See it in the showroom"), href("showroom")]], tabs: [[tr("Dimensi", "Dimensions"), "P 210 × L 88 × T 78 cm · " + tr("tinggi dudukan 44 cm", "seat height 44 cm")], [tr("Material", "Materials"), tr("Jati Jepara bersertifikat SVLK, busa Inoac, linen 280 gsm.", "SVLK-certified Jepara teak, Inoac foam, 280 gsm linen.")], [tr("Garansi", "Warranty"), tr("Rangka 10 tahun, busa 2 tahun.", "Frame 10 years, foam 2 years.")]], accordion: true }),
        grid(all.slice(1, 4), tr("Cocok dipadukan", "Pairs well with"), undefined, L.alt),
      ],
      collections: () => [
        pageHead(L, { ey: tr("Koleksi", "Collections"), title: tr("Tiga koleksi, tiga suasana", "Three collections, three moods"), center: true }),
        imgCards(L, { cols: 3, boxed: true, ratio: "4 / 5", items: [{ image: "v2b-room", tag: tr("12 produk", "12 pieces"), title: "Seroja", text: tr("Jati minyak alami, garis lengkung lembut.", "Natural-oiled teak with soft curves."), link: [tr("Lihat produk", "See pieces"), href("catalog")] }, { image: "v2b-chair", tag: tr("9 produk", "9 pieces"), title: "Anyam", text: tr("Rotan Cirebon dan bambu, ringan & sejuk.", "Cirebon rattan and bamboo, light & airy."), link: [tr("Lihat produk", "See pieces"), href("catalog")] }, { image: "v2b-shelf", tag: tr("7 produk", "7 pieces"), title: "Prasasti", text: tr("Kayu trembesi solid untuk ruang makan.", "Solid suar wood for dining rooms."), link: [tr("Lihat produk", "See pieces"), href("catalog")] }] }),
        grid([all[4], all[5], all[3]], tr("Baru di koleksi", "New in the collections"), undefined, L.alt),
      ],
      custom: () => [
        pageHead(L, { ey: tr("Pesanan khusus", "Custom orders"), title: tr("Dibuat sesuai ruang Anda", "Made for your space"), image: "v2b-shelf" }),
        steps(L, { title: tr("Prosesnya", "The process"), items: [[tr("Kirim ukuran", "Send measurements"), tr("Foto & denah ruangan.", "Photos & room plan.")], [tr("Gambar kerja", "Shop drawing"), tr("Gratis, 3 hari kerja.", "Free, 3 business days.")], [tr("DP 50%", "50% deposit"), tr("Produksi dimulai.", "Production begins.")], [tr("Kirim & rakit", "Deliver & assemble"), tr("Oleh tim kami.", "By our team.")]] }),
        formSec(L, { title: tr("Mulai pesanan khusus", "Start a custom order"), fields: [{ k: "select", label: tr("Jenis furnitur", "Furniture type"), ph: tr("Pilih", "Choose"), options: [tr("Rak / lemari", "Shelf / wardrobe"), tr("Meja", "Table"), tr("Sofa", "Sofa"), tr("Kitchen set", "Kitchen")] }, { k: "input", label: tr("Ukuran (P×L×T cm)", "Size (L×W×H cm)"), ph: "240 × 40 × 200" }, { k: "input", label: "WhatsApp", ph: "+62 8xx", type: "tel" }], submit: tr("Kirim", "Send"), info: [[tr("Waktu produksi", "Lead time"), tr("4–8 minggu", "4–8 weeks")]] }),
      ],
      care: () => [
        pageHead(L, { ey: tr("Perawatan", "Care guide"), title: tr("Agar kayu tetap cantik puluhan tahun", "Keep your wood beautiful for decades"), dark: true }),
        tableSec(L, { title: tr("Jadwal perawatan", "Care schedule"), columns: [tr("Material", "Material"), tr("Mingguan", "Weekly"), tr("6 bulanan", "Every 6 months")], rows: [[tr("Jati minyak alami", "Natural-oiled teak"), tr("Lap kain kering", "Dry cloth wipe"), tr("Oles minyak jati", "Re-apply teak oil")], [tr("Trembesi", "Suar wood"), tr("Lap kain lembap", "Damp cloth wipe"), tr("Wax lebah", "Beeswax")], [tr("Rotan", "Rattan"), tr("Sikat lembut", "Soft brush"), tr("Semprot anti jamur", "Anti-mold spray")], [tr("Linen", "Linen"), tr("Vakum", "Vacuum"), tr("Cuci sarung", "Wash covers")]] }),
        compareSec(L, { title: tr("Mengenal jenis kayu kami", "Know our woods"), columns: [tr("Jati", "Teak"), tr("Trembesi", "Suar"), tr("Mahoni", "Mahogany")], rows: [tr("Kekerasan | Tinggi | Sedang | Sedang", "Hardness | High | Medium | Medium"), tr("Tahan rayap | ya | tidak | tidak", "Termite resistant | yes | no | no"), tr("Untuk luar ruang | ya | tidak | tidak", "Outdoor use | yes | no | no"), tr("Serat khas | Lurus emas | Bergelombang | Halus merah", "Grain | Straight golden | Wavy | Fine reddish")], highlight: 1, bg: L.alt }),
        accordionSec(L, { title: tr("Masalah umum", "Common issues"), items: [[tr("Ada noda gelas", "Glass ring stains"), tr("Gosok dengan amplas 600 lalu oles minyak.", "Rub with 600-grit paper, then re-oil.")], [tr("Kayu retak rambut", "Hairline cracks"), tr("Normal pada kayu solid; hubungi kami untuk perbaikan gratis tahun pertama.", "Normal for solid wood; contact us for a free first-year repair.")]] }),
      ],
      about: () => [
        split(L, { ey: tr("Tentang", "About"), title: tr("Dari bengkel kecil di Jepara", "From a small Jepara workshop"), paras: [tr("Pak Wangi Sutrisno membuka bengkel ukir pada 1989. Kini cucunya, Ayu Jatiwangi, membawa desain modern tanpa meninggalkan sambungan pasak tradisional.", "Pak Wangi Sutrisno opened a carving workshop in 1989. Today his granddaughter, Ayu Jatiwangi, brings modern design without abandoning traditional pegged joinery."), tr("Setiap pohon yang ditebang diganti 5 bibit di hutan rakyat mitra.", "Every tree felled is replaced with 5 saplings in partner community forests.")], image: "v2b-room", alt: tr("Bengkel", "Workshop") }),
        cards(L, { cols: 3, style: "line", bg: L.alt, items: [{ meta: "SVLK", title: tr("Kayu legal", "Legal timber"), text: tr("Seluruh jati bersertifikat SVLK.", "All teak is SVLK certified.") }, { meta: tr("60 perajin", "60 artisans"), title: tr("Upah adil", "Fair wages"), text: tr("Gaji di atas UMK + BPJS.", "Above minimum wage + insurance.") }, { meta: tr("5 bibit", "5 saplings"), title: tr("Tanam kembali", "Replanting"), text: tr("Per pohon yang ditebang.", "Per tree felled.") }] }),
      ],
      showroom: () => [
        formSec(L, { ey: "Showroom", title: tr("Duduk dulu sebelum membeli", "Sit before you buy"), text: tr("Seluruh koleksi bisa dicoba di showroom Kemang.", "Try the full collection at our Kemang showroom."), info: [[tr("Alamat", "Address"), "Jl. Kemang Timur 18, Jakarta Selatan"], [tr("Jam", "Hours"), tr("Selasa–Minggu 10.00–19.00", "Tue–Sun 10am–7pm")], ["WhatsApp", "+62 811 1010 7070"]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") }, { k: "date", label: tr("Jadwal kunjungan", "Visit slot"), mode: "datetime-local" }, { k: "check", label: tr("Saya ingin konsultasi desain interior", "I'd like an interior design consult") }], submit: tr("Jadwalkan kunjungan", "Book a visit") }),
        infoBar(L, [[tr("Parkir", "Parking"), tr("8 mobil", "8 cars")], [tr("Konsultan", "Consultants"), tr("3 desainer interior", "3 interior designers")], [tr("Pengiriman", "Delivery"), tr("Gratis Jabodetabek", "Free in Greater Jakarta")]]),
      ],
    });
  },
};

/* ------------------ 20. education-language (PREMIUM, 10) ----------- */

const BS: Palette = { ink: "#0c2d48", muted: "#4a6378", primary: "#0b6bcb", primaryDark: "#084f96", soft: "#eaf4ff", line: "#bcdcfb" };
const bsL = look(BS, { font: FONTS.rounded, r: 18, dark: "#0c2d48", alt: "#fff8ef", onDark: "#bcdcfb" });

export const educationLanguage: TemplateContent = {
  brand: "Bahasaloka Institute",
  pages: [
    P("home", "Beranda", "Home", "index", "index", true),
    P("courses", "Kursus", "Courses", "kursus", "courses"),
    P("levels", "Level", "Levels", "level", "levels"),
    P("schedule", "Jadwal", "Schedule", "jadwal", "schedule"),
    P("teachers", "Pengajar", "Teachers", "pengajar", "teachers"),
    P("fees", "Biaya", "Fees", "biaya", "fees"),
    P("placement", "Tes Penempatan", "Placement Test", "tes-penempatan", "placement-test"),
    P("alumni", "Alumni", "Alumni", "alumni", "alumni"),
    P("blog", "Tips Belajar", "Study Tips", "tips-belajar", "study-tips"),
    P("contact", "Kontak", "Contact", "kontak", "contact"),
  ],
  build: (key, tr, href) => {
    const L = bsL;
    const head = header("bahasaloka", BS, { font: FONTS.rounded, cta: cta(tr("Tes gratis", "Free test"), href("placement"), BS) });
    const foot = footer("Bahasaloka Institute", tr("Kursus bahasa Inggris, Jepang, Korea, Mandarin, dan BIPA di Semarang & online.", "English, Japanese, Korean, Mandarin, and Indonesian-for-foreigners courses in Semarang & online."), [{ title: tr("Kursus", "Courses"), items: ["English", "日本語", "한국어", "中文", "BIPA"] }, { title: tr("Kampus", "Campus"), items: ["Jl. Pandanaran 77, Semarang", "+62 24 8600 777"] }], tr("© 2026 Bahasaloka Institute. Konten contoh.", "© 2026 Bahasaloka Institute. Sample content."), "#0c2d48");
    return render(L, key, head, foot, {
      home: () => [
        heroSplit(L, { badge: tr("Angkatan Januari 2027 dibuka", "January 2027 intake open"), title: tr("Bicara bahasa baru dengan percaya diri dalam 6 bulan", "Speak a new language with confidence in 6 months"), text: tr("Kelas kecil maksimal 8 orang, metode komunikatif, dan pengajar penutur asli untuk 5 bahasa.", "Small classes of up to 8, a communicative method, and native-speaker teachers for 5 languages."), btns: [[tr("Tes penempatan gratis", "Free placement test"), href("placement")], [tr("Lihat kursus", "See courses"), href("courses")]], image: "v2b-speech", alt: tr("Gelembung percakapan", "Speech bubbles"), gradient: [BS.soft, "#fff8ef", 135] }),
        cards(L, { ey: tr("Bahasa", "Languages"), title: tr("Lima bahasa, satu metode", "Five languages, one method"), cols: 5, align: "center", items: [{ icon: "🇬🇧", title: "English", text: tr("IELTS & bisnis", "IELTS & business"), link: [tr("Detail", "Details"), href("courses")] }, { icon: "🇯🇵", title: tr("Jepang", "Japanese"), text: "JLPT N5–N2", link: [tr("Detail", "Details"), href("courses")] }, { icon: "🇰🇷", title: tr("Korea", "Korean"), text: "TOPIK I–II", link: [tr("Detail", "Details"), href("courses")] }, { icon: "🇨🇳", title: "Mandarin", text: "HSK 1–4", link: [tr("Detail", "Details"), href("courses")] }, { icon: "🇮🇩", title: "BIPA", text: tr("Untuk penutur asing", "For foreigners"), link: [tr("Detail", "Details"), href("courses")] }], bg: L.alt }),
        countdownSec(L, { ey: tr("Pendaftaran", "Registration"), title: tr("Angkatan Januari ditutup dalam", "January intake closes in"), text: tr("Diskon 15% untuk pendaftar sebelum 15 Desember 2026.", "15% off for sign-ups before December 15, 2026."), target: "2026-12-15T23:59", done: tr("Pendaftaran ditutup.", "Registration closed."), btn: [tr("Daftar sekarang", "Enroll now"), href("placement")] }),
        testiCards(L, { title: tr("Mereka sudah lancar", "They're fluent now"), items: [{ quote: tr("Dari nol ke JLPT N3 dalam 14 bulan, sekarang kerja di Osaka.", "From zero to JLPT N3 in 14 months, now working in Osaka."), author: "Dimas Aryo", role: tr("Alumni Jepang", "Japanese alumnus"), avatar: "v2b-face-1" }, { quote: tr("IELTS 7.5 di percobaan pertama. Kelas speaking-nya juara.", "IELTS 7.5 on my first try. The speaking classes are the best."), author: "Putri Kinanti", role: tr("Alumni English", "English alumna"), avatar: "v2b-face-2" }, { quote: tr("Kelas BIPA membantu saya bernegosiasi dengan pemasok lokal.", "BIPA classes helped me negotiate with local suppliers."), author: "Lukas Meyer", role: tr("Alumni BIPA, Jerman", "BIPA alumnus, Germany"), avatar: "v2b-face-3" }] }),
      ],
      courses: () => [
        pageHead(L, { ey: tr("Kursus", "Courses"), title: tr("Pilih bahasamu", "Choose your language"), image: "v2b-speech" }),
        tabsSec(L, { title: tr("Detail program", "Program details"), variant: "pills", tabs: [["English", tr("General English (A1–C1), IELTS Preparation 8 minggu, Business English untuk karyawan.", "General English (A1–C1), 8-week IELTS Preparation, Business English for professionals.")], [tr("Jepang", "Japanese"), tr("Kelas JLPT N5–N2, persiapan kerja tokutei ginou, budaya kerja Jepang.", "JLPT N5–N2 classes, specified skilled worker prep, Japanese work culture.")], [tr("Korea", "Korean"), tr("TOPIK I–II, percakapan untuk penggemar K-drama.", "TOPIK I–II, conversation for K-drama fans.")], ["Mandarin", tr("HSK 1–4 dengan pengajar dari Taiwan dan Tiongkok.", "HSK 1–4 with teachers from Taiwan and China.")], ["BIPA", tr("Bahasa Indonesia untuk ekspatriat, level 1–7.", "Indonesian for expats, levels 1–7.")]] }),
        cards(L, { title: tr("Format kelas", "Class formats"), cols: 3, style: "line", items: [{ meta: tr("Tatap muka", "In person"), title: tr("Kelas reguler", "Regular class"), text: tr("2× seminggu, 90 menit, maks. 8 orang.", "2× a week, 90 min, max 8 people.") }, { meta: "Online", title: tr("Kelas live", "Live class"), text: tr("Zoom interaktif, rekaman tersedia.", "Interactive Zoom, recordings available.") }, { meta: tr("Privat", "Private"), title: tr("1-on-1", "1-on-1"), text: tr("Jadwal fleksibel, kurikulum khusus.", "Flexible schedule, tailored curriculum.") }], bg: L.alt }),
      ],
      levels: () => [
        pageHead(L, { ey: tr("Level", "Levels"), title: tr("Mengikuti standar CEFR", "Aligned with the CEFR"), center: true }),
        progressSec(L, { title: tr("Lama belajar per level (kelas reguler)", "Study time per level (regular class)"), text: tr("Persentase menunjukkan bagian dari perjalanan menuju C1.", "Percentages show progress along the path to C1."), items: [["A1 · " + tr("Pemula · 3 bulan", "Beginner · 3 months"), 15], ["A2 · " + tr("Dasar · 3 bulan", "Elementary · 3 months"), 30], ["B1 · " + tr("Menengah · 4 bulan", "Intermediate · 4 months"), 50], ["B2 · " + tr("Menengah atas · 5 bulan", "Upper-intermediate · 5 months"), 75], ["C1 · " + tr("Mahir · 6 bulan", "Advanced · 6 months"), 100]] }),
        tableSec(L, { title: tr("Setara ujian internasional", "International exam equivalents"), columns: ["CEFR", "IELTS", "JLPT", "TOPIK", "HSK"], rows: [["A2", "3.5–4", "N5", "1", "2"], ["B1", "4.5–5.5", "N4–N3", "3", "3"], ["B2", "6–6.5", "N2", "4", "4"], ["C1", "7–8", "N1", "5–6", "5"]], bg: L.alt }),
      ],
      schedule: () => [
        pageHead(L, { ey: tr("Jadwal", "Schedule"), title: tr("Jadwal angkatan Januari 2027", "January 2027 intake schedule"), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Jadwal", "Schedule"), ""]] }),
        tableSec(L, { title: tr("Kelas reguler", "Regular classes"), columns: [tr("Kelas", "Class"), tr("Hari", "Days"), tr("Jam", "Time"), tr("Mulai", "Starts"), tr("Kursi", "Seats")], rows: [["English B1", tr("Sen & Kam", "Mon & Thu"), "18.30–20.00", "12 Jan", "3/8"], ["IELTS Prep", tr("Sab", "Sat"), "09.00–12.00", "17 Jan", "5/8"], [tr("Jepang N5", "Japanese N5"), tr("Sel & Jum", "Tue & Fri"), "18.30–20.00", "13 Jan", "2/8"], [tr("Korea TOPIK I", "Korean TOPIK I"), tr("Rab", "Wed"), "19.00–21.00", "14 Jan", "6/8"], ["BIPA 1", tr("Sen–Rab", "Mon–Wed"), "10.00–11.30", "12 Jan", "4/8"]] }),
        infoBar(L, [[tr("Kampus", "Campus"), "Jl. Pandanaran 77"], ["Online", "Zoom"], [tr("Libur", "Holidays"), tr("Ikuti kalender nasional", "National calendar")]]),
      ],
      teachers: () => [
        teamCards(L.t, tr, { eyebrow: tr("Pengajar", "Teachers"), title: tr("Penutur asli & pengajar bersertifikat", "Native speakers & certified teachers"), members: [{ name: "Emily Carter", role: "English · CELTA", photo: asset("v2b-face-6") }, { name: "Sato Haruki", role: tr("Jepang · 8 th mengajar", "Japanese · 8 yrs teaching"), photo: asset("v2b-face-3") }, { name: "Kim Ji-woo", role: tr("Korea · lulusan SNU", "Korean · SNU graduate"), photo: asset("v2b-face-2") }, { name: "Ratna Hapsari", role: tr("BIPA · M.Pd.", "BIPA · M.Ed."), photo: asset("v2b-face-4") }] }),
        quote(L, { text: tr("Kesalahan adalah bukti kamu sedang mencoba. Di kelas kami, salah itu wajib.", "Mistakes prove you're trying. In our classes, making them is required."), name: "Emily Carter", role: tr("Koordinator akademik", "Academic coordinator"), dark: true }),
      ],
      fees: () => [
        priceSwitch(L, { ey: tr("Biaya", "Fees"), title: tr("Biaya kursus", "Course fees"), text: tr("Termasuk buku, akses aplikasi latihan, dan sertifikat.", "Includes books, practice app access, and certificate."), monthly: tr("Per bulan", "Monthly"), yearly: tr("Per level", "Per level"), save: tr("Hemat 12%", "Save 12%"), pm: tr("/bulan", "/month"), py: tr("/level", "/level"), href: href("placement"), plans: [tr("Online | Rp450rb | Rp1,2jt | 8 sesi live; Rekaman; Grup WhatsApp | Daftar", "Online | Rp450k | Rp1.2m | 8 live sessions; Recordings; WhatsApp group | Enroll"), tr("Reguler | Rp650rb | Rp1,7jt | 8 sesi tatap muka; Klub percakapan; Buku | Daftar", "Regular | Rp650k | Rp1.7m | 8 in-person sessions; Conversation club; Books | Enroll"), tr("Privat | Rp1,8jt | Rp4,8jt | 8 sesi 1-on-1; Jadwal fleksibel; Kurikulum khusus | Daftar", "Private | Rp1.8m | Rp4.8m | 8 1-on-1 sessions; Flexible schedule; Tailored curriculum | Enroll")] }),
        faqAccordion(L.t, tr, { items: [[tr("Bisa cicil?", "Installments?"), tr("Bisa 3× tanpa bunga dengan kartu kredit.", "Yes, 3× interest-free with a credit card.")], [tr("Kalau tidak lulus level?", "If I don't pass a level?"), tr("Ulang level dengan diskon 50%.", "Repeat the level at 50% off.")]] }),
      ],
      placement: () => [
        pageHead(L, { ey: tr("Tes penempatan", "Placement test"), title: tr("Tahu levelmu dalam 30 menit", "Know your level in 30 minutes"), dark: true }),
        steps(L, { title: tr("Cara kerjanya", "How it works"), items: [[tr("Isi formulir", "Fill the form"), tr("Pilih bahasa & jadwal.", "Choose language & slot.")], [tr("Tes tertulis", "Written test"), tr("20 menit online.", "20 minutes online.")], [tr("Wawancara", "Interview"), tr("10 menit dengan pengajar.", "10 minutes with a teacher.")], [tr("Rekomendasi", "Recommendation"), tr("Level & kelas yang cocok.", "The right level & class.")]] }),
        formSec(L, { title: tr("Daftar tes gratis", "Book a free test"), fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama lengkap", "Full name") }, { k: "select", label: tr("Bahasa", "Language"), ph: tr("Pilih", "Choose"), options: ["English", tr("Jepang", "Japanese"), tr("Korea", "Korean"), "Mandarin", "BIPA"] }, { k: "select", label: tr("Tujuan", "Goal"), ph: tr("Pilih", "Choose"), options: [tr("Kerja", "Work"), tr("Kuliah", "Study"), tr("Ujian", "Exam"), tr("Hobi", "Hobby")] }, { k: "date", label: tr("Jadwal tes", "Test slot"), mode: "datetime-local" }], submit: tr("Daftar tes", "Book test") }),
      ],
      alumni: () => [
        pageHead(L, { ey: "Alumni", title: tr("Ke mana alumni kami pergi", "Where our alumni go"), center: true }),
        counters(L, [["9.800+", tr("Alumni", "Alumni")], ["1.240", tr("Bekerja di luar negeri", "Working abroad")], ["86%", tr("Lulus ujian target", "Passed target exam")], ["4,9", tr("Kepuasan", "Satisfaction")]]),
        imgCards(L, { title: tr("Cerita alumni", "Alumni stories"), bg: L.alt, items: [{ image: "v2b-face-1", meta: "Osaka", title: "Dimas Aryo", text: tr("Teknisi otomotif, JLPT N3.", "Automotive technician, JLPT N3.") }, { image: "v2b-face-2", meta: "Melbourne", title: "Putri Kinanti", text: tr("S2 Kesehatan Masyarakat, IELTS 7.5.", "MPH student, IELTS 7.5.") }, { image: "v2b-face-5", meta: "Busan", title: "Agung Saputro", text: tr("Pekerja galangan kapal, TOPIK 3.", "Shipyard worker, TOPIK 3.") }], ratio: "1 / 1" }),
      ],
      blog: () => [
        ...article(L, { meta: tr("Tips belajar · 6 menit", "Study tips · 6 min"), title: tr("Metode 15 menit sehari untuk menghafal kosakata", "A 15-minute-a-day method to memorize vocabulary"), lead: tr("Pengulangan berjarak (spaced repetition) membuat kata baru bertahan di ingatan jangka panjang.", "Spaced repetition keeps new words in long-term memory."), image: "v2b-speech", author: ["Ratna Hapsari", tr("Pengajar BIPA", "BIPA teacher"), "v2b-face-4"], body: [tr("Otak lebih mudah mengingat sesuatu yang diulang tepat sebelum terlupa.", "The brain remembers best what is reviewed just before it's forgotten."), tr("Mulailah dengan 10 kata baru per hari dan ulangi pada hari ke-1, 3, 7, dan 14.", "Start with 10 new words a day and review on days 1, 3, 7, and 14."), tr("Gunakan kata dalam kalimat tentang hidupmu sendiri agar lebih melekat.", "Use each word in a sentence about your own life so it sticks.")], sub: tr("Jadwal pengulangan", "Review schedule"), list: [tr("Hari 1: pelajari 10 kata", "Day 1: learn 10 words"), tr("Hari 3: ulangi", "Day 3: review"), tr("Hari 7: tulis kalimat", "Day 7: write sentences"), tr("Hari 14: tes diri", "Day 14: self-test")], tags: [tr("Kosakata", "Vocabulary"), tr("Metode", "Method")] }),
        newsletter(L, { title: tr("Satu tips setiap Senin", "One tip every Monday"), text: tr("Dalam 5 bahasa.", "In 5 languages."), ph: "nama@email.com", btn: tr("Berlangganan", "Subscribe") }),
      ],
      contact: () => [
        formSec(L, { ey: tr("Kontak", "Contact"), title: tr("Ada pertanyaan?", "Questions?"), info: [[tr("Kampus", "Campus"), "Jl. Pandanaran 77, Semarang"], [tr("Telepon", "Phone"), "+62 24 8600 777"], ["WhatsApp", "+62 811 2900 777"]], fields: [{ k: "input", label: tr("Nama", "Name"), ph: tr("Nama", "Name") }, { k: "input", label: "Email", ph: "nama@email.com", type: "email" }, { k: "select", label: tr("Bahasa", "Language"), ph: tr("Pilih", "Choose"), options: ["English", tr("Jepang", "Japanese"), tr("Korea", "Korean"), "Mandarin", "BIPA"] }], submit: tr("Kirim", "Send") }),
        cards(L, { cols: 3, style: "plain", items: [{ icon: "🏫", title: tr("Kampus Semarang", "Semarang campus"), text: tr("Sen–Sab 08.00–21.00", "Mon–Sat 8am–9pm") }, { icon: "💻", title: tr("Kelas online", "Online classes"), text: tr("Dari seluruh Indonesia", "From anywhere in Indonesia") }, { icon: "🏢", title: tr("Kelas korporat", "Corporate classes"), text: "corporate@bahasaloka.example" }] }),
      ],
    });
  },
};
