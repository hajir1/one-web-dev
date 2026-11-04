import { asset } from "../../../assets";
import { badge, col, grid, image, inline, linkButton, para, section, type Palette } from "../../../build";
import { ctaBand, faqAccordion, portfolioMosaic, teamCards, testimonialsWall } from "../../../../pageMaker/helpers/sectionPresetsPro";
import type { TemplateContent, Tr } from "../../../types";
import { footer, header } from "../../pro/kit";
import {
  FONTS,
  H,
  P,
  acts,
  article,
  bigQuote,
  cards,
  checklist,
  compare,
  contact,
  counter,
  countdownBand,
  ctaBox,
  faqList,
  field,
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
  mega,
  notice,
  page,
  pageBanner,
  people,
  pg,
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
  type Listing,
  type Look,
  type Post,
} from "./kitA";

/* ================================================================== */
/* Template v2 A16–A20: Arsitek, Berita, SaaS CRM, Skincare, Universitas.*/
/* ================================================================== */

/* ------------------- 16. Ruang Garis Studio (6 pages) ------------------ */

const RG: Palette = { ink: "#1c1917", muted: "#57534e", primary: "#57534e", primaryDark: "#292524", soft: "#f5f5f4", line: "#d6d3d1" };
const rg = look(RG, { bg: "#ffffff", alt: "#f5f5f4", dark: "#1c1917", radius: 0, headFont: FONTS.elegant, font: FONTS.grotesk });

export const architectureRuang: TemplateContent = {
  brand: "Ruang Garis Studio",
  pages: [home("Studio", "Studio"), pg("projects", ["proyek", "Proyek"], ["projects", "Projects"]), pg("project", ["rumah-tropis-ciputat", "Rumah Tropis Ciputat"], ["ciputat-tropical-house", "Ciputat Tropical House"]), pg("about", ["tentang", "Tentang"], ["about", "About"]), pg("approach", ["pendekatan", "Pendekatan"], ["approach", "Approach"]), pg("contact", ["kontak", "Kontak"], ["contact", "Contact"])],
  build: (key, tr, href) => {
    const head = headerLeft("ruang/garis", rg, {});
    const end = footerSlim(rg, "ruang/garis", ["Instagram", "Behance", "LinkedIn", "studio@ruanggaris.example"], tr("© 2026 Ruang Garis Studio · Jakarta", "© 2026 Ruang Garis Studio · Jakarta"), { bg: "#1c1917" });
    switch (key) {
      case "projects":
        return page(rg, [
          head,
          pageBanner(rg, { eyebrow: tr("Arsip 2014–2026", "Archive 2014–2026"), title: tr("Proyek", "Projects"), text: tr("Rumah tinggal, ruang kerja, dan bangunan publik kecil.", "Houses, workplaces, and small public buildings."), bg: "#ffffff" }),
          gallery(rg, {
            title: tr("Terbaru", "Recent"),
            align: "left",
            cols: 2,
            ratio: "16 / 11",
            images: [
              [asset("v2a-arch-house"), tr("Rumah Tropis Ciputat · 2026", "Ciputat Tropical House · 2026")],
              [asset("v2a-arch-tower"), tr("Kantor Kopi Nusa · 2025", "Kopi Nusa Office · 2025")],
              [asset("v2a-arch-hero"), tr("Perpustakaan Desa Wonosari · 2024", "Wonosari Village Library · 2024")],
              [asset("v2a-arch-house"), tr("Rumah Bata Bintaro · 2023", "Bintaro Brick House · 2023")],
            ],
          }),
          tabsBlock(rg, {
            title: tr("Menurut tipologi", "By typology"),
            variant: "underline",
            tabs: [
              [tr("Hunian", "Residential"), tr("14 rumah tinggal, 3 di antaranya meraih penghargaan arsitektur Jakarta.", "14 houses, 3 of them Jakarta architecture award winners.")],
              [tr("Komersial", "Commercial"), tr("Kantor, kafe, dan showroom dengan anggaran efisien.", "Offices, cafés, and showrooms on efficient budgets.")],
              [tr("Publik", "Public"), tr("Perpustakaan, balai warga, dan sekolah di desa.", "Libraries, community halls, and village schools.")],
            ],
            bg: rg.alt,
          }),
          end,
        ]);
      case "project":
        return page(rg, [
          head,
          pageBanner(rg, { crumbs: [[tr("Proyek", "Projects"), href("projects")], ["Ciputat", ""]], title: tr("Rumah Tropis Ciputat", "Ciputat Tropical House"), text: tr("Rumah 3 generasi yang sejuk tanpa AC di siang hari.", "A three-generation home that stays cool without A/C by day."), bg: "#ffffff" }),
          story(rg, {
            eyebrow: tr("Konsep", "Concept"),
            title: tr("Atap lebar, dinding bernapas", "Wide roofs, breathing walls"),
            paras: [tr("Kami memutar massa bangunan 15° agar bukaan utama menangkap angin barat daya. Roster tanah liat menggantikan jendela di sisi timur.", "We rotated the mass 15° so main openings catch the south-west breeze. Clay breeze blocks replace windows on the east side."), tr("Hasilnya, suhu dalam ruang 3–4°C lebih rendah dari luar pada pukul 14.00.", "Indoor temperature is 3–4°C cooler than outside at 2pm.")],
            image: asset("v2a-arch-house"),
            alt: tr("Fasad rumah", "House facade"),
          }),
          tableBlock(rg, {
            title: tr("Data proyek", "Project data"),
            columns: [tr("Item", "Item"), tr("Keterangan", "Detail")],
            rows: [[tr("Luas lahan", "Site area"), "420 m²"], [tr("Luas bangunan", "Floor area"), "310 m²"], [tr("Durasi", "Duration"), tr("14 bulan (desain + konstruksi)", "14 months (design + build)")], [tr("Penghargaan", "Award"), tr("Penghargaan Arsitektur Jakarta 2026 — Hunian", "Jakarta Architecture Award 2026 — Residential")]],
            bg: rg.alt,
          }),
          gallery(rg, { title: tr("Detail", "Details"), cols: 3, images: [[asset("v2a-arch-house"), tr("Roster tanah liat", "Clay breeze blocks")], [asset("v2a-arch-hero"), tr("Void tangga", "Stair void")], [asset("v2a-arch-tower"), tr("Teras belakang", "Back terrace")]] }),
          end,
        ]);
      case "about":
        return page(rg, [
          head,
          story(rg, {
            eyebrow: tr("Studio", "Studio"),
            title: tr("Arsitektur yang tenang dan tahan lama", "Quiet, lasting architecture"),
            paras: [tr("Didirikan oleh Aditya Lukman dan Sekar Paramita pada 2014. Kami bekerja dengan material lokal, tukang lokal, dan iklim tropis sebagai titik awal desain.", "Founded by Aditya Lukman and Sekar Paramita in 2014. We start every design from local materials, local craftsmen, and the tropical climate.")],
            image: asset("v2a-arch-hero"),
            alt: tr("Bangunan", "Building"),
            reverse: true,
          }),
          teamCards(rg, tr, {
            eyebrow: tr("Tim", "Team"),
            title: tr("Delapan orang, satu meja panjang", "Eight people, one long table"),
            members: [
              { name: "Aditya Lukman, IAI", role: tr("Prinsipal", "Principal"), photo: asset("v2a-face-2") },
              { name: "Sekar Paramita, IAI", role: tr("Prinsipal", "Principal"), photo: asset("v2a-face-3") },
              { name: "Yudha Prakoso", role: tr("Arsitek senior", "Senior architect"), photo: asset("v2a-face-4") },
              { name: "Nurul Aini", role: tr("Desainer interior", "Interior designer"), photo: asset("v2a-face-5") },
            ],
          }),
          figures(rg, { items: [["46", tr("Proyek terbangun", "Built projects")], ["7", tr("Penghargaan", "Awards")], ["12", tr("Tahun", "Years")]], bg: "#ffffff" }),
          end,
        ]);
      case "approach":
        return page(rg, [
          head,
          timeline(rg, {
            eyebrow: tr("Pendekatan", "Approach"),
            title: tr("Dari obrolan ke kunci rumah", "From conversation to house keys"),
            steps: [
              [tr("Minggu 1–2", "Weeks 1–2"), tr("Mendengar", "Listening"), tr("Kunjungan lahan, kebiasaan keluarga, anggaran.", "Site visit, family habits, budget.")],
              [tr("Bulan 1–2", "Months 1–2"), tr("Konsep", "Concept"), tr("Tiga alternatif massa dengan maket kayu.", "Three massing options with wooden models.")],
              [tr("Bulan 3–4", "Months 3–4"), tr("Pengembangan", "Development"), tr("Gambar kerja, RAB, dan perizinan PBG.", "Construction drawings, cost plan, and permits.")],
              [tr("Bulan 5+", "Months 5+"), tr("Pengawasan", "Supervision"), tr("Kunjungan lapangan mingguan.", "Weekly site visits.")],
            ],
          }),
          tableBlock(rg, {
            title: tr("Biaya jasa", "Fees"),
            columns: [tr("Lingkup", "Scope"), tr("Persentase biaya konstruksi", "% of construction cost")],
            rows: [[tr("Desain arsitektur", "Architectural design"), "5–7%"], [tr("Desain + interior", "Design + interior"), "8–10%"], [tr("Pengawasan berkala", "Periodic supervision"), "2%"]],
            note: tr("Minimum biaya desain Rp60 juta.", "Minimum design fee Rp60 million."),
            bg: rg.alt,
          }),
          end,
        ]);
      case "contact":
        return page(rg, [
          head,
          contact(rg, {
            eyebrow: tr("Kontak", "Contact"),
            title: tr("Ceritakan lahan dan mimpi Anda", "Tell us about your site and dreams"),
            text: tr("Kami menerima 6 proyek baru setiap tahun.", "We take on 6 new projects a year."),
            info: [[tr("Studio", "Studio"), "Jl. Bangka XI No. 3, Jakarta Selatan"], ["Email", "studio@ruanggaris.example"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "select", label: tr("Jenis proyek", "Project type"), ph: tr("Pilih", "Choose"), options: [tr("Rumah baru", "New house"), tr("Renovasi", "Renovation"), tr("Komersial", "Commercial"), tr("Publik", "Public")] },
              { kind: "input", label: tr("Lokasi lahan", "Site location"), ph: "Tangerang Selatan" },
              { kind: "input", label: tr("Perkiraan anggaran", "Estimated budget"), ph: "Rp2 M" },
            ],
            submit: tr("Kirim", "Send"),
            bg: "#ffffff",
          }),
          end,
        ]);
      default:
        return page(rg, [
          head,
          heroCover(rg, {
            eyebrow: tr("Studio arsitektur · Jakarta", "Architecture studio · Jakarta"),
            title: tr("Ruang yang sejuk, sederhana, dan jujur pada material", "Cool, simple spaces, honest to their materials"),
            text: tr("Rumah tinggal dan bangunan publik kecil yang dirancang untuk iklim tropis.", "Houses and small public buildings designed for the tropics."),
            actions: [[tr("Lihat proyek", "See projects"), href("projects"), "dark"]],
            light: false,
            bg: "#ffffff",
            image: asset("v2a-arch-hero"),
            alt: tr("Fasad geometris", "Geometric facade"),
            size: 56,
          }),
          portfolioMosaic(rg, tr, {
            eyebrow: tr("Proyek pilihan", "Selected projects"),
            title: tr("Dibangun, ditinggali, dirawat", "Built, lived in, cared for"),
            text: tr("Setiap proyek dikunjungi lagi setahun setelah serah terima.", "We revisit every project a year after handover."),
            works: [
              { title: tr("Rumah Tropis Ciputat", "Ciputat Tropical House"), tag: tr("Hunian · 2026", "Residential · 2026"), image: asset("v2a-arch-house") },
              { title: tr("Kantor Kopi Nusa", "Kopi Nusa Office"), tag: tr("Komersial · 2025", "Commercial · 2025"), image: asset("v2a-arch-tower") },
              { title: tr("Perpustakaan Wonosari", "Wonosari Library"), tag: tr("Publik · 2024", "Public · 2024"), image: asset("v2a-arch-hero") },
              { title: tr("Rumah Bata Bintaro", "Bintaro Brick House"), tag: "2023", image: asset("v2a-arch-house") },
              { title: tr("Balai Warga Klaten", "Klaten Community Hall"), tag: "2022", image: asset("v2a-arch-tower") },
            ],
            cta: { label: tr("Semua proyek", "All projects"), href: href("projects") },
          }),
          bigQuote(rg, { text: tr("Bangunan terbaik adalah yang membuat penghuninya lupa menyalakan AC.", "The best building makes its owners forget to turn on the A/C."), name: "Sekar Paramita", role: tr("Prinsipal", "Principal"), light: false }),
          logos(rg, { label: tr("Penghargaan & publikasi", "Awards & press"), names: ["Penghargaan Arsitektur 2026", "Majalah Ruang", "Arsitektur Kini", "Penghargaan Hunian Tropis"] }),
          end,
        ]);
    }
  },
};

/* ------------------- 17. Warta Kini (8 hlm) -------------------------- */

const WK: Palette = { ink: "#111111", muted: "#525252", primary: "#b91c1c", primaryDark: "#991b1b", soft: "#fef2f2", line: "#fecaca" };
const wk = look(WK, { bg: "#ffffff", alt: "#fafaf9", dark: "#111111", radius: 0, headFont: FONTS.serif, font: FONTS.serif });

export const newsWarta: TemplateContent = {
  brand: "Warta Kini",
  pages: [
    home(),
    pg("latest", ["terkini", "Terkini"], ["latest", "Latest"]),
    pg("economy", ["ekonomi", "Ekonomi"], ["economy", "Economy"]),
    pg("tech", ["teknologi", "Teknologi"], ["technology", "Technology"]),
    pg("article", ["berita-kereta-cepat", "Artikel"], ["high-speed-rail-story", "Article"]),
    pg("opinion", ["opini", "Opini"], ["opinion", "Opinion"]),
    pg("newsroom", ["redaksi", "Redaksi"], ["newsroom", "Newsroom"]),
    pg("subscribe", ["langganan", "Langganan"], ["subscribe", "Subscribe"]),
  ],
  build: (key, tr, href) => {
    const head = headerBar("WARTA KINI", wk, {
      info: [tr("Kamis, 15 Oktober 2026", "Thursday, October 15, 2026"), tr("Trending: Kereta cepat Jakarta–Surabaya · IHSG · Piala AFF", "Trending: Jakarta–Surabaya rail · IHSG · AFF Cup")],
      cta: linkButton(tr("Langganan", "Subscribe"), href("subscribe"), "primary", WK),
    });
    const end = footer(
      "Warta Kini",
      tr("Media berita independen. Terverifikasi Dewan Pers.", "Independent news media. Verified by the Press Council."),
      [
        { title: tr("Rubrik", "Sections"), items: [tr("Terkini", "Latest"), tr("Ekonomi", "Economy"), tr("Teknologi", "Technology"), tr("Opini", "Opinion")] },
        { title: tr("Redaksi", "Newsroom"), items: [tr("Pedoman siber", "Editorial guidelines"), tr("Hak jawab", "Right of reply"), "redaksi@wartakini.example"] },
      ],
      tr("© 2026 Warta Kini. Semua berita adalah contoh fiktif.", "© 2026 Warta Kini. All stories are fictional samples."),
      "#111111",
    );
    const story1: Post = { image: asset("v2a-news-1"), tag: tr("Nasional", "National"), title: tr("Kereta cepat Jakarta–Surabaya mulai uji dinamis", "Jakarta–Surabaya high-speed rail begins dynamic tests"), text: tr("Perjalanan 3,5 jam ditargetkan beroperasi 2029.", "A 3.5-hour trip targeted to open in 2029."), date: tr("2 jam lalu", "2 hours ago"), href: href("article") };
    const econ: Post[] = [
      { image: asset("v2a-news-2"), tag: tr("Pasar", "Markets"), title: tr("IHSG ditutup menguat 1,2% ke 7.940", "IHSG closes up 1.2% at 7,940"), text: tr("Saham perbankan memimpin penguatan.", "Bank stocks lead the gains."), date: tr("1 jam lalu", "1 hour ago"), href: href("article") },
      { image: asset("v2a-news-3"), tag: "UMKM", title: tr("Ekspor kopi UMKM naik 18%", "Small-business coffee exports up 18%"), text: tr("Permintaan dari Jepang dan Timur Tengah.", "Demand from Japan and the Middle East."), date: tr("4 jam lalu", "4 hours ago"), href: href("article") },
      { image: asset("v2a-news-4"), tag: tr("Energi", "Energy"), title: tr("PLTS atap tembus 2 GW", "Rooftop solar passes 2 GW"), text: tr("Pemasangan rumah tangga melonjak.", "Household installations surge."), date: tr("Kemarin", "Yesterday"), href: href("article") },
    ];
    const techPosts: Post[] = [
      { image: asset("v2a-news-2"), tag: "AI", title: tr("Startup Bandung rilis model bahasa daerah", "Bandung startup releases regional-language model"), text: tr("Mendukung Sunda, Jawa, dan Minang.", "Supports Sundanese, Javanese, and Minang."), date: tr("3 jam lalu", "3 hours ago"), href: href("article") },
      { image: asset("v2a-news-1"), tag: tr("Gawai", "Gadgets"), title: tr("Ponsel lipat lokal pertama dijual Rp6 juta", "First local foldable phone launches at Rp6M"), text: tr("Dirakit di Batam.", "Assembled in Batam."), date: tr("Kemarin", "Yesterday"), href: href("article") },
      { image: asset("v2a-news-3"), tag: tr("Internet", "Internet"), title: tr("Satelit baru jangkau 9.000 sekolah", "New satellite connects 9,000 schools"), text: tr("Kecepatan rata-rata 50 Mbps.", "Average speed 50 Mbps."), date: tr("2 hari lalu", "2 days ago"), href: href("article") },
    ];
    switch (key) {
      case "latest":
        return page(wk, [
          head,
          notice(wk, { badge: tr("TERKINI", "BREAKING"), text: tr("Gempa M5,1 di selatan Jawa, tidak berpotensi tsunami.", "M5.1 quake south of Java, no tsunami threat."), link: tr("Ikuti", "Follow"), href: href("article"), bg: "#ffffff" }),
          timeline(wk, {
            eyebrow: tr("Laporan langsung", "Live updates"),
            title: tr("Hari ini", "Today"),
            steps: [
              ["14.32", tr("BMKG: tidak ada potensi tsunami", "BMKG: no tsunami threat"), tr("Gempa terasa hingga Yogyakarta.", "Felt as far as Yogyakarta.")],
              ["12.05", tr("IHSG sesi I naik 0,8%", "IHSG up 0.8% at midday"), tr("Investor asing net buy Rp620 miliar.", "Foreign investors net buy Rp620 billion.")],
              ["09.40", tr("Uji dinamis kereta cepat dimulai", "Dynamic rail tests begin"), tr("Kecepatan uji 250 km/jam.", "Test speed 250 km/h.")],
            ],
          }),
          posts(wk, { title: tr("Terkini", "Latest"), readLabel: tr("Baca", "Read"), items: [story1, ...econ.slice(0, 2)], bg: wk.alt }),
          end,
        ]);
      case "economy":
        return page(wk, [
          head,
          pageBanner(wk, { eyebrow: tr("Rubrik", "Section"), title: tr("Ekonomi", "Economy"), bg: "#ffffff" }),
          tableBlock(wk, {
            title: tr("Data pasar penutupan", "Market close"),
            align: "left",
            columns: [tr("Indikator", "Indicator"), tr("Nilai", "Value"), tr("Perubahan", "Change")],
            rows: [["IHSG", "7.940,12", "+1,20%"], ["LQ45", "1.002,45", "+1,45%"], ["USD/IDR", "15.620", "-0,30%"], [tr("Emas (gram)", "Gold (gram)"), "Rp1.312.000", "+0,50%"]],
            note: tr("Data contoh, bukan data pasar sesungguhnya.", "Sample data, not real market data."),
          }),
          posts(wk, { title: tr("Berita ekonomi", "Economy news"), align: "left", readLabel: tr("Baca", "Read"), items: econ, bg: wk.alt }),
          end,
        ]);
      case "tech":
        return page(wk, [
          head,
          pageBanner(wk, { eyebrow: tr("Rubrik", "Section"), title: tr("Teknologi", "Technology"), bg: "#ffffff" }),
          posts(wk, { title: tr("Pilihan editor", "Editor's picks"), align: "left", readLabel: tr("Baca", "Read"), items: techPosts, cols: 3 }),
          videoBlock(wk, { eyebrow: "Video", title: tr("Mencoba ponsel lipat lokal pertama", "Trying the first local foldable"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", bg: wk.alt }),
          end,
        ]);
      case "article":
        return page(wk, [
          head,
          ...article(wk, {
            crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Nasional", "National"), href("latest")], [tr("Kereta cepat", "High-speed rail"), ""]],
            tag: tr("Nasional", "National"),
            title: tr("Kereta cepat Jakarta–Surabaya mulai uji dinamis", "Jakarta–Surabaya high-speed rail begins dynamic tests"),
            meta: tr("Oleh Anindya Putri · 15 Oktober 2026, 09.40 WIB · 5 menit baca", "By Anindya Putri · October 15, 2026, 9:40am · 5 min read"),
            image: asset("v2a-news-1"),
            lead: tr("Rangkaian kereta pertama melaju 250 km/jam di lintasan uji Cirebon–Tegal pagi ini, menandai tahap akhir sebelum operasi komersial.", "The first trainset ran at 250 km/h on the Cirebon–Tegal test section this morning, marking the final stage before commercial service."),
            blocks: [
              ["", tr("Uji dinamis akan berlangsung enam bulan dan mencakup pengereman darurat, sistem persinyalan, serta kenyamanan penumpang.", "Dynamic testing will last six months and cover emergency braking, signaling, and passenger comfort.")],
              [tr("Waktu tempuh 3,5 jam", "A 3.5-hour journey"), tr("Jika beroperasi, perjalanan Jakarta–Surabaya yang kini 8 jam dengan kereta konvensional akan dipangkas menjadi 3,5 jam dengan lima stasiun antara.", "Once running, the Jakarta–Surabaya trip, now 8 hours on conventional rail, will drop to 3.5 hours with five intermediate stations.")],
              [tr("Harga tiket", "Ticket prices"), tr("Operator belum menetapkan tarif, namun kajian awal menyebut kisaran Rp450–650 ribu sekali jalan.", "The operator hasn't set fares, but early studies suggest Rp450–650k one way.")],
            ],
            quote: tr("Kami ingin perjalanan antarkota secepat naik pesawat, tanpa ke bandara.", "We want intercity trips as fast as flying, without the airport."),
          }),
          posts(wk, { title: tr("Baca juga", "Read next"), readLabel: tr("Baca", "Read"), items: econ, align: "left", bg: wk.alt }),
          end,
        ]);
      case "opinion":
        return page(wk, [
          head,
          people(wk, {
            eyebrow: tr("Kolumnis", "Columnists"),
            title: tr("Suara yang perlu didengar", "Voices worth hearing"),
            round: true,
            items: [
              { name: "Dr. Laksmi Wardhani", role: tr("Ekonom", "Economist"), photo: asset("v2a-face-5"), text: tr("Menulis setiap Senin.", "Writes every Monday.") },
              { name: "Bonifasius Tan", role: tr("Pengamat transportasi", "Transport analyst"), photo: asset("v2a-face-6"), text: tr("Menulis setiap Rabu.", "Writes every Wednesday.") },
              { name: "Nadia Hasibuan", role: tr("Peneliti kebijakan digital", "Digital policy researcher"), photo: asset("v2a-face-3"), text: tr("Menulis setiap Jumat.", "Writes every Friday.") },
            ],
          }),
          posts(wk, {
            title: tr("Opini terbaru", "Latest opinion"),
            readLabel: tr("Baca", "Read"),
            bg: wk.alt,
            items: [
              { image: asset("v2a-news-3"), tag: tr("Opini", "Opinion"), title: tr("Kereta cepat bukan hanya soal kecepatan", "High-speed rail isn't just about speed"), text: "Bonifasius Tan", date: "14 Okt 2026", href: href("article") },
              { image: asset("v2a-news-4"), tag: tr("Opini", "Opinion"), title: tr("Menahan inflasi pangan menjelang akhir tahun", "Holding down food inflation at year-end"), text: "Dr. Laksmi Wardhani", date: "12 Okt 2026", href: href("article") },
              { image: asset("v2a-news-2"), tag: tr("Opini", "Opinion"), title: tr("AI bahasa daerah butuh data yang adil", "Regional-language AI needs fair data"), text: "Nadia Hasibuan", date: "09 Okt 2026", href: href("article") },
            ],
          }),
          end,
        ]);
      case "newsroom":
        return page(wk, [
          head,
          story(wk, {
            eyebrow: tr("Tentang kami", "About us"),
            title: tr("Jurnalisme yang bisa diverifikasi", "Journalism you can verify"),
            paras: [tr("Warta Kini berdiri pada 2018 dengan 12 jurnalis. Kini 64 jurnalis di 9 biro menulis 120 berita setiap hari.", "Warta Kini launched in 2018 with 12 journalists. Now 64 journalists in 9 bureaus file 120 stories a day.")],
            bullets: [tr("Setiap koreksi dicatat di akhir berita", "Every correction is logged at the end of the story"), tr("Iklan dipisahkan jelas dari berita", "Ads clearly separated from news"), tr("Hak jawab dimuat maksimal 1×24 jam", "Right of reply published within 24 hours")],
            image: asset("v2a-news-4"),
            alt: tr("Halaman koran", "Newspaper page"),
          }),
          tableBlock(wk, {
            title: tr("Susunan redaksi", "Editorial board"),
            columns: [tr("Jabatan", "Role"), tr("Nama", "Name")],
            rows: [[tr("Pemimpin redaksi", "Editor-in-chief"), "Hendra Gunawan"], [tr("Redaktur pelaksana", "Managing editor"), "Anindya Putri"], [tr("Redaktur ekonomi", "Economy editor"), "Rio Saputra"], [tr("Redaktur teknologi", "Technology editor"), "Maya Lestari"]],
            bg: wk.alt,
          }),
          end,
        ]);
      case "subscribe":
        return page(wk, [
          head,
          priceSwitch(wk, {
            eyebrow: tr("Langganan", "Subscribe"),
            title: tr("Dukung jurnalisme independen", "Support independent journalism"),
            text: tr("Tanpa iklan, akses arsip, dan newsletter pagi.", "Ad-free, archive access, and a morning newsletter."),
            labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 30%", "Save 30%"), tr("/bulan", "/month"), tr("/tahun", "/year")],
            plans: [
              tr("Digital | Rp39rb | Rp330rb | Semua artikel; Newsletter pagi | Langganan", "Digital | Rp39k | Rp330k | All articles; Morning newsletter | Subscribe"),
              tr("Premium | Rp69rb | Rp580rb | Tanpa iklan; Arsip sejak 2018; Podcast eksklusif | Langganan", "Premium | Rp69k | Rp580k | Ad-free; Archive since 2018; Exclusive podcast | Subscribe"),
              tr("Keluarga | Rp99rb | Rp830rb | 4 akun Premium; Majalah digital bulanan | Langganan", "Family | Rp99k | Rp830k | 4 Premium accounts; Monthly digital magazine | Subscribe"),
            ],
            href: "#langganan",
          }),
          faqList(wk, {
            title: tr("Tentang langganan", "About subscriptions"),
            items: [
              [tr("Bisa berhenti kapan saja?", "Can I cancel anytime?"), tr("Bisa, akses berlaku sampai akhir periode.", "Yes, access lasts until the end of the period.")],
              [tr("Ada harga pelajar?", "Student pricing?"), tr("Diskon 50% dengan email kampus.", "50% off with a campus email.")],
            ],
            bg: wk.alt,
          }),
          end,
        ]);
      default:
        return page(wk, [
          head,
          heroSplit(wk, {
            badge: tr("Utama", "Top story"),
            title: story1.title,
            text: tr("Rangkaian kereta pertama melaju 250 km/jam di lintasan uji Cirebon–Tegal. Operasi komersial ditargetkan 2029 dengan waktu tempuh 3,5 jam.", "The first trainset hit 250 km/h on the Cirebon–Tegal test track. Commercial service targeted for 2029 with a 3.5-hour journey."),
            actions: [[tr("Baca selengkapnya", "Read the story"), href("article"), "dark"]],
            note: tr("Anindya Putri · 2 jam lalu", "Anindya Putri · 2 hours ago"),
            image: asset("v2a-news-1"),
            alt: tr("Foto utama", "Lead photo"),
            ratio: "16 / 10",
            size: 42,
            padY: 56,
          }),
          slider(wk, {
            slides: [
              { title: tr("IHSG menguat 1,2% ke 7.940", "IHSG up 1.2% to 7,940"), text: tr("Saham bank memimpin.", "Banks lead the rally."), bg: "#991b1b" },
              { title: tr("Timnas lolos semifinal Piala AFF", "National team reaches AFF Cup semis"), text: tr("Menang 2–0 atas Vietnam.", "A 2–0 win over Vietnam."), bg: "#111111" },
              { title: tr("PLTS atap tembus 2 GW", "Rooftop solar passes 2 GW"), text: tr("Rumah tangga jadi motor utama.", "Households lead the growth."), bg: "#7f1d1d" },
            ],
            height: 220,
            bg: wk.alt,
            padY: 32,
          }),
          posts(wk, { eyebrow: tr("Ekonomi", "Economy"), title: tr("Pasar & bisnis", "Markets & business"), align: "left", readLabel: tr("Baca", "Read"), items: econ }),
          posts(wk, { eyebrow: tr("Teknologi", "Technology"), title: tr("Inovasi minggu ini", "This week in tech"), align: "left", readLabel: tr("Baca", "Read"), items: techPosts, bg: wk.alt }),
          ctaBox(wk, { title: tr("Newsletter pagi, 5 menit sebelum kerja", "A 5-minute morning newsletter"), text: tr("Gratis, setiap hari pukul 06.00.", "Free, every day at 6am."), actions: [[tr("Langganan", "Subscribe"), href("subscribe"), "light"]], bg: "#111111" }),
          end,
        ]);
    }
  },
};

/* ------------------- 18. Relasi CRM (10 hlm) ------------------------- */

const RC: Palette = { ink: "#1e1b4b", muted: "#4c4f69", primary: "#7c3aed", primaryDark: "#6d28d9", soft: "#f5f3ff", line: "#ddd6fe" };
const rc = look(RC, { bg: "#ffffff", alt: "#faf8ff", dark: "#1e1b4b", radius: 14, headFont: FONTS.sans, font: FONTS.sans });

export const saasCrmRelasi: TemplateContent = {
  brand: "Relasi CRM",
  pages: [
    home(),
    pg("features", ["fitur", "Fitur"], ["features", "Features"]),
    pg("automation", ["otomasi", "Otomasi"], ["automation", "Automation"]),
    pg("integrations", ["integrasi", "Integrasi"], ["integrations", "Integrations"]),
    pg("pricing", ["harga", "Harga"], ["pricing", "Pricing"]),
    pg("customers", ["pelanggan", "Pelanggan"], ["customers", "Customers"]),
    pg("case", ["studi-kasus-kopi-nusa", "Studi Kasus"], ["kopi-nusa-case-study", "Case Study"]),
    pg("blog", ["blog", "Blog"], ["blog", "Blog"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("demo", ["demo", "Minta Demo"], ["demo", "Book a Demo"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(
      rc,
      [
        `${tr("Produk", "Product")} | ${href("features")}`,
        `- Pipeline | ${tr("Kanban deal yang jelas", "Clear deal kanban")} | ${href("features")}`,
        `- ${tr("Otomasi", "Automation")} | ${tr("Follow-up tanpa lupa", "Never miss a follow-up")} | ${href("automation")}`,
        `- ${tr("Integrasi", "Integrations")} | ${tr("WhatsApp, email, marketplace", "WhatsApp, email, marketplaces")} | ${href("integrations")}`,
        `${tr("Harga", "Pricing")} | ${href("pricing")}`,
        `${tr("Pelanggan", "Customers")} | ${href("customers")}`,
        `- ${tr("Studi kasus", "Case studies")} | Kopi Nusa | ${href("case")}`,
        `- Blog | ${tr("Tips penjualan", "Sales tips")} | ${href("blog")}`,
        `- ${tr("Tentang", "About")} | ${tr("Tim & misi", "Team & mission")} | ${href("about")}`,
      ],
      tr("Minta demo", "Book a demo"),
      href("demo"),
    );
    const head = headerLeft("relasi", rc, { nav, sticky: true });
    const end = footer(
      "Relasi CRM",
      tr("CRM untuk tim penjualan Indonesia yang hidup di WhatsApp.", "The CRM for Indonesian sales teams that live in WhatsApp."),
      [
        { title: tr("Produk", "Product"), items: ["Pipeline", tr("Otomasi", "Automation"), tr("Integrasi", "Integrations"), tr("Harga", "Pricing")] },
        { title: tr("Perusahaan", "Company"), items: [tr("Tentang", "About"), "Blog", tr("Karier", "Careers"), tr("Keamanan", "Security")] },
      ],
      tr("© 2026 PT Relasi Teknologi. Produk contoh.", "© 2026 PT Relasi Teknologi. Sample product."),
      "#1e1b4b",
    );
    const blogPosts: Post[] = [
      { image: asset("v2a-crm-hero"), tag: "Sales", title: tr("5 template follow-up WhatsApp yang dibalas", "5 WhatsApp follow-ups that get replies"), text: tr("Kalimat pendek, satu pertanyaan, waktu yang tepat.", "Short lines, one question, perfect timing."), date: "08 Okt 2026", href: href("blog") },
      { image: asset("v2a-crm-report"), tag: tr("Data", "Data"), title: tr("Membaca laporan win rate per sales", "Reading win rate per rep"), text: tr("Bukan untuk menghukum, tapi melatih.", "Not to punish, but to coach."), date: "24 Sep 2026", href: href("blog") },
      { image: asset("v2a-crm-hero"), tag: tr("Produk", "Product"), title: tr("Rilis: skor prospek otomatis", "Release: automatic lead scoring"), text: tr("Prioritaskan prospek paling panas.", "Prioritize your hottest leads."), date: "10 Sep 2026", href: href("blog") },
    ];
    switch (key) {
      case "features":
        return page(rc, [
          head,
          pageBanner(rc, { eyebrow: tr("Fitur", "Features"), title: tr("Semua yang dibutuhkan tim sales, tanpa yang tidak perlu", "Everything sales needs, nothing it doesn't"), align: "center" }),
          tabsBlock(rc, {
            title: tr("Satu tempat untuk seluruh siklus penjualan", "One place for the whole sales cycle"),
            variant: "pills",
            tabs: [
              ["Pipeline", tr("Seret deal antar-tahap, lihat nilai per tahap, dan atur probabilitas closing.", "Drag deals between stages, see value per stage, and set close probabilities.")],
              [tr("Kontak", "Contacts"), tr("Riwayat chat WhatsApp, email, dan panggilan dalam satu linimasa.", "WhatsApp, email, and call history in one timeline.")],
              [tr("Laporan", "Reports"), tr("Win rate, siklus penjualan, dan target per sales secara real-time.", "Win rate, sales cycle, and targets per rep in real time.")],
              [tr("Aplikasi seluler", "Mobile app"), tr("Update deal dari lapangan, bahkan saat offline.", "Update deals from the field, even offline.")],
            ],
          }),
          story(rc, { eyebrow: "Pipeline", title: tr("Lihat seluruh deal dalam 5 detik", "See every deal in 5 seconds"), paras: [tr("Kanban berwarna menunjukkan deal yang macet lebih dari 7 hari.", "Color-coded kanban flags deals stuck for over 7 days.")], bullets: [tr("Tahap kustom per tim", "Custom stages per team"), tr("Filter per sales & produk", "Filter by rep & product")], image: asset("v2a-crm-hero"), alt: "Pipeline", reverse: true }),
          story(rc, { eyebrow: tr("Laporan", "Reports"), title: tr("Rapat mingguan tanpa spreadsheet", "Weekly meetings without spreadsheets"), paras: [tr("Dasbor siap tayang untuk rapat Senin pagi.", "Presentation-ready dashboards for Monday meetings.")], image: asset("v2a-crm-report"), alt: tr("Laporan", "Report"), bg: rc.alt }),
          end,
        ]);
      case "automation":
        return page(rc, [
          head,
          process(rc, {
            eyebrow: tr("Otomasi", "Automation"),
            title: tr("Atur sekali, berjalan selamanya", "Set once, runs forever"),
            steps: [
              [tr("Pemicu", "Trigger"), tr("Deal masuk tahap Penawaran.", "Deal enters Proposal stage.")],
              [tr("Tunggu", "Wait"), tr("2 hari tanpa balasan.", "2 days with no reply.")],
              [tr("Aksi", "Action"), tr("Kirim template WhatsApp.", "Send a WhatsApp template.")],
              [tr("Notifikasi", "Notify"), tr("Ingatkan sales via aplikasi.", "Nudge the rep in-app.")],
            ],
          }),
          videoBlock(rc, { eyebrow: tr("Demo 3 menit", "3-minute demo"), title: tr("Membuat alur follow-up otomatis", "Building an automatic follow-up flow"), url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ" }),
          cards(rc, {
            title: tr("Alur siap pakai", "Ready-made flows"),
            variant: "line",
            items: [
              { title: tr("Prospek baru", "New lead"), text: tr("Bagi otomatis ke sales dengan beban paling ringan.", "Auto-assign to the least busy rep.") },
              { title: tr("Penawaran terlupa", "Forgotten proposal"), text: tr("Follow-up hari ke-2 dan ke-5.", "Follow up on days 2 and 5.") },
              { title: tr("Pelanggan lama", "Past customers"), text: tr("Tawarkan isi ulang setiap 30 hari.", "Offer a reorder every 30 days.") },
            ],
            bg: rc.alt,
          }),
          end,
        ]);
      case "integrations":
        return page(rc, [
          head,
          cards(rc, {
            eyebrow: tr("Integrasi", "Integrations"),
            title: tr("Terhubung dengan alat yang sudah Anda pakai", "Works with the tools you already use"),
            cols: 4,
            items: [
              { icon: "💬", title: "WhatsApp Business", text: tr("Chat masuk jadi kontak & deal.", "Chats become contacts & deals.") },
              { icon: "✉", title: "Gmail & Outlook", text: tr("Email tercatat otomatis.", "Emails logged automatically.") },
              { icon: "🛒", title: "Marketplace", text: tr("Pesanan jadi riwayat pelanggan.", "Orders become customer history.") },
              { icon: "📊", title: "Google Sheets", text: tr("Ekspor laporan terjadwal.", "Scheduled report exports.") },
              { icon: "🧾", title: tr("Akuntansi", "Accounting"), text: tr("Faktur dari deal yang menang.", "Invoices from won deals.") },
              { icon: "📅", title: "Google Calendar", text: tr("Jadwal meeting tersinkron.", "Meetings synced.") },
              { icon: "☎", title: "VoIP", text: tr("Rekam & catat panggilan.", "Record & log calls.") },
              { icon: "🔌", title: "API & Webhook", text: tr("Bangun integrasi sendiri.", "Build your own.") },
            ],
          }),
          faqList(rc, {
            title: tr("Soal integrasi", "About integrations"),
            items: [
              [tr("Apakah WhatsApp resmi?", "Is WhatsApp official?"), tr("Ya, lewat WhatsApp Business Platform.", "Yes, via the WhatsApp Business Platform.")],
              [tr("Ada biaya tambahan?", "Any extra cost?"), tr("Semua integrasi termasuk paket Growth ke atas.", "All integrations included from Growth up.")],
            ],
            bg: rc.alt,
          }),
          end,
        ]);
      case "pricing":
        return page(rc, [
          head,
          priceSwitch(rc, {
            eyebrow: tr("Harga", "Pricing"),
            title: tr("Harga per pengguna, tanpa kontrak", "Per-user pricing, no contracts"),
            text: tr("Coba gratis 14 hari, tanpa kartu kredit.", "14-day free trial, no credit card."),
            labels: [tr("Bulanan", "Monthly"), tr("Tahunan", "Yearly"), tr("Hemat 20%", "Save 20%"), tr("/pengguna/bln", "/user/mo"), tr("/pengguna/thn", "/user/yr")],
            plans: [
              tr("Starter | Rp99rb | Rp950rb | 1 pipeline; 1.000 kontak; Aplikasi seluler | Coba gratis", "Starter | Rp99k | Rp950k | 1 pipeline; 1,000 contacts; Mobile app | Start free"),
              tr("Growth | Rp199rb | Rp1,9jt | Pipeline tanpa batas; Otomasi; Integrasi WhatsApp | Coba gratis", "Growth | Rp199k | Rp1.9m | Unlimited pipelines; Automation; WhatsApp integration | Start free"),
              tr("Scale | Rp349rb | Rp3,3jt | Skor prospek; SSO; Manajer akun | Hubungi sales", "Scale | Rp349k | Rp3.3m | Lead scoring; SSO; Account manager | Talk to sales"),
            ],
            href: href("demo"),
          }),
          compare(rc, {
            title: tr("Detail paket", "Plan details"),
            columns: ["Starter", "Growth", "Scale"],
            rows: [tr("Pipeline | 1 | Tanpa batas | Tanpa batas", "Pipelines | 1 | Unlimited | Unlimited"), tr("Otomasi | tidak | ya | ya", "Automation | no | yes | yes"), tr("WhatsApp | tidak | ya | ya", "WhatsApp | no | yes | yes"), tr("Skor prospek | tidak | tidak | ya", "Lead scoring | no | no | yes"), tr("SSO & audit log | tidak | tidak | ya", "SSO & audit log | no | no | yes")],
            caption: tr("Harga belum termasuk PPN", "Prices exclude VAT"),
            bg: rc.alt,
          }),
          faqAccordion(rc, tr, {
            title: tr("Pertanyaan soal harga", "Pricing questions"),
            items: [
              [tr("Bisa ganti paket?", "Can I switch plans?"), tr("Kapan saja; selisih dihitung prorata.", "Anytime; the difference is prorated.")],
              [tr("Diskon untuk UMKM?", "SME discount?"), tr("Diskon 30% untuk tim di bawah 5 orang di tahun pertama.", "30% off for teams under 5 in the first year.")],
            ],
            contact: { label: tr("Hubungi sales", "Talk to sales"), href: href("demo") },
          }),
          end,
        ]);
      case "customers":
        return page(rc, [
          head,
          testimonialsWall(rc, tr, {
            eyebrow: tr("Pelanggan", "Customers"),
            title: tr("3.400 tim sales sudah pindah", "3,400 sales teams have switched"),
            score: 4.8,
            caption: tr("rating ulasan pengguna", "average user review rating"),
            quotes: [
              { text: tr("Follow-up otomatis menaikkan closing kami 27%.", "Automatic follow-ups lifted our close rate 27%."), name: "Rini Hartono", role: tr("Head of Sales, Kopi Nusa", "Head of Sales, Kopi Nusa"), avatar: asset("v2a-face-3") },
              { text: tr("Sales lapangan akhirnya mau update CRM karena lewat HP.", "Field reps finally update the CRM because it's on their phones."), name: "Bagus W.", role: tr("Manajer area, Sinar Distribusi", "Area manager, Sinar Distribusi"), avatar: asset("v2a-face-2") },
              { text: tr("Migrasi dari spreadsheet cuma 2 hari.", "Migrating from spreadsheets took just 2 days."), name: "Clara T.", role: "COO, Rumah Furni", avatar: asset("v2a-face-5") },
            ],
          }),
          logos(rc, { label: tr("Dipakai oleh", "Used by"), names: ["Kopi Nusa", "Sinar Distribusi", "Rumah Furni", "EduPintar", "Klinik Sehati"], bg: rc.alt }),
          posts(rc, {
            title: tr("Studi kasus", "Case studies"),
            readLabel: tr("Baca", "Read"),
            items: [
              { image: asset("v2a-crm-report"), tag: "F&B", title: tr("Kopi Nusa: closing B2B naik 27%", "Kopi Nusa: B2B closes up 27%"), text: tr("120 kafe mitra dikelola 6 sales.", "120 partner cafés managed by 6 reps."), date: "2026", href: href("case") },
              { image: asset("v2a-crm-hero"), tag: tr("Distribusi", "Distribution"), title: tr("Sinar Distribusi: 40 sales lapangan", "Sinar Distribusi: 40 field reps"), text: tr("Kunjungan toko tercatat lengkap.", "Every store visit logged."), date: "2026", href: href("case") },
              { image: asset("v2a-crm-report"), tag: "Retail", title: tr("Rumah Furni: dari spreadsheet ke CRM", "Rumah Furni: from spreadsheets to CRM"), text: tr("Migrasi 2 hari.", "A 2-day migration."), date: "2025", href: href("case") },
            ],
          }),
          end,
        ]);
      case "case":
        return page(rc, [
          head,
          ...article(rc, {
            crumbs: [[tr("Pelanggan", "Customers"), href("customers")], ["Kopi Nusa", ""]],
            tag: tr("Studi kasus · F&B", "Case study · F&B"),
            title: tr("Bagaimana Kopi Nusa menaikkan closing B2B 27% dalam 6 bulan", "How Kopi Nusa lifted B2B closes 27% in 6 months"),
            meta: tr("6 sales · 120 kafe mitra · paket Growth", "6 reps · 120 partner cafés · Growth plan"),
            image: asset("v2a-crm-report"),
            lead: tr("Kopi Nusa memasok biji kopi ke kafe di 9 kota. Sebelum Relasi, penawaran tercecer di chat pribadi para sales.", "Kopi Nusa supplies beans to cafés in 9 cities. Before Relasi, proposals were scattered across reps' personal chats."),
            blocks: [
              [tr("Masalah", "The problem"), tr("Penawaran sering terlupa: 40% tidak pernah di-follow-up setelah dikirim.", "Proposals got forgotten: 40% were never followed up after sending.")],
              [tr("Solusi", "The solution"), tr("Integrasi WhatsApp Business dan alur follow-up hari ke-2 dan ke-5 untuk setiap penawaran.", "WhatsApp Business integration and day-2 and day-5 follow-up flows for every proposal.")],
              [tr("Hasil", "The results"), tr("Closing naik 27%, siklus penjualan turun dari 21 menjadi 13 hari.", "Closes up 27%, sales cycle down from 21 to 13 days.")],
            ],
            quote: tr("Sekarang tidak ada penawaran yang hilang di chat pribadi.", "No proposal gets lost in personal chats anymore."),
          }),
          counter(rc, { items: [tr("+27% | Tingkat closing", "+27% | Close rate"), tr("13 hari | Siklus penjualan", "13 days | Sales cycle"), tr("0 | Penawaran terlupa", "0 | Forgotten proposals")], bg: rc.alt }),
          end,
        ]);
      case "blog":
        return page(rc, [head, pageBanner(rc, { eyebrow: "Blog", title: tr("Catatan untuk tim penjualan", "Notes for sales teams") }), posts(rc, { title: tr("Artikel terbaru", "Latest articles"), readLabel: tr("Baca", "Read"), items: blogPosts }), end]);
      case "about":
        return page(rc, [
          head,
          story(rc, {
            eyebrow: tr("Tentang", "About"),
            title: tr("Dibangun di Yogyakarta untuk Indonesia", "Built in Yogyakarta for Indonesia"),
            paras: [tr("Kami pernah jadi sales yang mencatat prospek di buku tulis. Relasi lahir pada 2021 agar tim penjualan bisa fokus berjualan, bukan mengisi laporan.", "We were once reps logging leads in notebooks. Relasi was born in 2021 so sales teams could focus on selling, not filling reports.")],
            image: asset("v2a-crm-hero"),
            alt: "Relasi",
          }),
          teamCards(rc, tr, {
            title: tr("Pendiri", "Founders"),
            members: [
              { name: "Galang Mahendra", role: "CEO", photo: asset("v2a-face-2") },
              { name: "Putri Ayuningtyas", role: "CTO", photo: asset("v2a-face-3") },
              { name: "Hanif Rasyid", role: tr("Kepala Produk", "Head of Product"), photo: asset("v2a-face-4") },
              { name: "Sabrina Lie", role: tr("Kepala Customer Success", "Head of Customer Success"), photo: asset("v2a-face-5") },
            ],
          }),
          timeline(rc, {
            title: tr("Perjalanan", "Milestones"),
            steps: [["2021", tr("Peluncuran beta", "Beta launch"), tr("40 tim pertama.", "First 40 teams.")], ["2023", tr("Integrasi WhatsApp", "WhatsApp integration"), tr("Pelanggan naik 5×.", "Customers grew 5×.")], ["2026", tr("3.400 tim", "3,400 teams"), tr("Pendanaan Seri A.", "Series A funding.")]],
          }),
          end,
        ]);
      case "demo":
        return page(rc, [
          head,
          contact(rc, {
            eyebrow: tr("Demo 30 menit", "30-minute demo"),
            title: tr("Lihat Relasi dengan data Anda", "See Relasi with your own data"),
            text: tr("Kami siapkan pipeline contoh sesuai industri Anda.", "We'll set up a sample pipeline for your industry."),
            info: [["Email", "sales@relasi.example"], ["WhatsApp", "+62 811 2900 3030"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Email kantor", "Work email"), ph: "nama@perusahaan.com", type: "email" },
              { kind: "select", label: tr("Ukuran tim sales", "Sales team size"), ph: tr("Pilih", "Choose"), options: ["1–5", "6–20", "21–50", "50+"] },
              { kind: "date", label: tr("Jadwal demo", "Demo time"), mode: "datetime-local" },
            ],
            submit: tr("Jadwalkan demo", "Book demo"),
          }),
          process(rc, { title: tr("Setelah demo", "After the demo"), steps: [[tr("Trial 14 hari", "14-day trial"), tr("Semua fitur Growth.", "All Growth features.")], [tr("Impor data", "Data import"), tr("Kami bantu gratis.", "We help for free.")], [tr("Pelatihan tim", "Team training"), tr("Sesi online 1 jam.", "A 1-hour online session.")]] }),
          end,
        ]);
      default:
        return page(rc, [
          head,
          heroSplit(rc, {
            badge: tr("Baru: skor prospek otomatis", "New: automatic lead scoring"),
            title: tr("CRM untuk tim penjualan", "A CRM for sales teams"),
            titleNode: typer(rc, tr("CRM untuk tim", "The CRM for"), [tr("sales lapangan", "field sales"), tr("toko online", "online stores"), tr("distributor", "distributors")], { size: 52 }),
            text: tr("Pipeline yang jelas, follow-up WhatsApp otomatis, dan laporan siap rapat. Siap dipakai dalam satu sore.", "Clear pipelines, automatic WhatsApp follow-ups, and meeting-ready reports. Set up in an afternoon."),
            actions: [[tr("Coba gratis 14 hari", "Start 14-day trial"), href("pricing")], [tr("Minta demo", "Book a demo"), href("demo"), "outline"]],
            image: asset("v2a-crm-hero"),
            alt: tr("Dasbor pipeline", "Pipeline dashboard"),
            gradient: [RC.soft, "#ffffff", 180],
            note: tr("Tanpa kartu kredit · Batal kapan saja", "No credit card · Cancel anytime"),
          }),
          logos(rc, { label: tr("Dipercaya 3.400 tim", "Trusted by 3,400 teams"), names: ["Kopi Nusa", "Sinar Distribusi", "Rumah Furni", "EduPintar", "Klinik Sehati"] }),
          cards(rc, {
            eyebrow: tr("Kenapa Relasi", "Why Relasi"),
            title: tr("Dirancang untuk cara jualan di Indonesia", "Designed for how Indonesia sells"),
            items: [
              { icon: "💬", title: tr("WhatsApp-first", "WhatsApp-first"), text: tr("Chat pelanggan otomatis jadi deal.", "Customer chats become deals automatically.") },
              { icon: "⚙", title: tr("Otomasi", "Automation"), text: tr("Follow-up tanpa mengandalkan ingatan.", "Follow-ups without relying on memory.") },
              { icon: "📱", title: tr("Untuk lapangan", "Built for the field"), text: tr("Aplikasi ringan, bisa offline.", "A light app that works offline.") },
            ],
            bg: rc.alt,
          }),
          counter(rc, { items: [tr("3.400 | Tim aktif", "3,400 | Active teams"), tr("+27% | Rata-rata closing", "+27% | Avg. close rate"), tr("2 hari | Waktu migrasi", "2 days | Migration time"), tr("99,95% | Uptime", "99.95% | Uptime")], dark: true }),
          quotes(rc, {
            title: tr("Kata pengguna", "What users say"),
            items: [
              { quote: tr("Follow-up otomatis menaikkan closing kami 27%.", "Automatic follow-ups lifted our close rate 27%."), author: "Rini Hartono", role: "Kopi Nusa", avatar: asset("v2a-face-3") },
              { quote: tr("Dasbornya langsung saya tayangkan di rapat Senin.", "I put the dashboard straight up in Monday meetings."), author: "Bagus W.", role: "Sinar Distribusi", avatar: asset("v2a-face-2") },
            ],
            cols: 2,
          }),
          ctaBand(rc, tr, { title: tr("Siap merapikan pipeline Anda?", "Ready to tidy your pipeline?"), primary: { label: tr("Coba gratis", "Start free"), href: href("pricing") }, secondary: { label: tr("Minta demo", "Book a demo"), href: href("demo") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 19. Glowna Skin Lab (store, 7 pages) --------------- */
// A store without transactions: every product card leads to the detail page; no scripted elements.

const GS: Palette = { ink: "#4a044e", muted: "#86587f", primary: "#db2777", primaryDark: "#be185d", soft: "#fdf2f8", line: "#fbcfe8" };
const gs = look(GS, { bg: "#ffffff", alt: "#fff5f9", dark: "#4a044e", radius: 24, headFont: FONTS.rounded, font: FONTS.rounded });

const productDetail = (L: Look, tr: Tr, href: (k: string) => string) =>
  section(
    "Detail produk",
    [
      grid(
        [
          col([image(asset("v2a-skin-1"), "Glowna Barrier Serum", { ratio: "1 / 1", radius: L.radius })], { name: "Gambar" }),
          col(
            [
              badge(tr("Terlaris · kulit sensitif", "Best seller · sensitive skin"), L.p.soft, L.p.primaryDark, L.p.line),
              H(L, "Barrier Repair Serum 30 ml", "h1", { size: 40 }),
              stars(L, 4.9, tr("dari 2.318 ulasan", "from 2,318 reviews")),
              inline([para("Rp189.000", { size: 28, weight: 800, color: L.p.primaryDark, full: false }), para("Rp229.000", { size: 16, color: L.p.muted, full: false })], { gap: 14 }),
              P(L, tr("Serum ceramide 3% + niacinamide 5% untuk memperbaiki skin barrier yang rusak karena eksfoliasi berlebihan.", "A 3% ceramide + 5% niacinamide serum to repair barriers damaged by over-exfoliation.")),
              checklist(L, [tr("Bebas pewangi & alkohol", "Fragrance & alcohol free"), tr("Teruji dermatologis", "Dermatologist tested"), tr("BPOM NA18261200001", "BPOM NA18261200001")]),
              field(L, { kind: "select", label: tr("Ukuran", "Size"), ph: "30 ml", options: ["15 ml", "30 ml", "50 ml"] }, 0),
              acts(L, [[tr("Tanya stok via WhatsApp", "Ask for stock on WhatsApp"), href("contact")], [tr("Lihat produk lain", "Browse more"), href("shop"), "outline"]]),
            ],
            { gap: 14, name: "Info produk" },
          ),
        ],
        2,
        { gap: 48, align: "start" },
      ),
    ],
    { bg: L.bg, padY: 72 },
  );

export const shopSkincare: TemplateContent = {
  brand: "Glowna Skin Lab",
  pages: [
    home(),
    pg("shop", ["katalog", "Katalog"], ["shop", "Shop"]),
    pg("product", ["detail-produk", "Detail Produk"], ["product", "Product"]),
    pg("routine", ["rutinitas", "Rutinitas"], ["routine", "Routine"]),
    pg("ingredients", ["bahan-aktif", "Bahan Aktif"], ["ingredients", "Ingredients"]),
    pg("about", ["tentang", "Tentang"], ["about", "About"]),
    pg("contact", ["bantuan", "Bantuan"], ["help", "Help"]),
  ],
  build: (key, tr, href) => {
    const head = header("glowna", GS, { font: FONTS.rounded, cta: linkButton(tr("Belanja", "Shop"), href("shop"), "primary", GS) });
    const end = footer(
      "Glowna Skin Lab",
      tr("Skincare lokal berbasis riset, terdaftar BPOM, tidak diuji pada hewan.", "Research-based local skincare, BPOM registered, cruelty-free."),
      [
        { title: tr("Belanja", "Shop"), items: ["Serum", tr("Pelembap", "Moisturizers"), "Sunscreen", tr("Pembersih", "Cleansers")] },
        { title: tr("Bantuan", "Help"), items: ["WhatsApp +62 811 4500 6600", "halo@glowna.example", tr("Pengiriman & retur", "Shipping & returns")] },
      ],
      tr("© 2026 Glowna Skin Lab. Produk & harga contoh.", "© 2026 Glowna Skin Lab. Sample products & prices."),
      "#4a044e",
    );
    const pd = `${href("product")}`;
    const p = (img: string, title: string, text: string, price: string, extra: Partial<Listing> = {}): Listing => ({ image: asset(img), title, text, price, rating: 4.8, reviews: "(320)", cta: tr("Lihat detail", "View details"), href: pd, ...extra });
    const all: Listing[] = [
      p("v2a-skin-1", "Barrier Repair Serum", tr("Ceramide 3% + niacinamide 5%", "3% ceramide + 5% niacinamide"), "Rp189.000", { compare: "Rp229.000", badge: tr("Terlaris", "Best seller"), rating: 4.9, reviews: "(2.318)" }),
      p("v2a-skin-2", "Calming Gel Moisturizer", tr("Centella & panthenol", "Centella & panthenol"), "Rp149.000"),
      p("v2a-skin-3", "Daily Sun Fluid SPF 50", tr("PA++++, tanpa whitecast", "PA++++, no white cast"), "Rp129.000", { badge: tr("Baru", "New") }),
      p("v2a-skin-4", "Gentle Amino Cleanser", tr("pH 5,5, tidak bikin ketarik", "pH 5.5, no tight feeling"), "Rp99.000"),
      p("v2a-skin-5", "Bright Vitamin C 10%", tr("Ethyl ascorbic acid stabil", "Stable ethyl ascorbic acid"), "Rp199.000"),
      p("v2a-skin-6", "Overnight Repair Mask", tr("Squalane & peptida", "Squalane & peptides"), "Rp169.000"),
    ];
    switch (key) {
      case "shop":
        return page(gs, [
          head,
          pageBanner(gs, { eyebrow: tr("Katalog", "Shop"), title: tr("Semua produk", "All products"), text: tr("Gratis ongkir untuk pembelian di atas Rp250.000.", "Free shipping on orders over Rp250,000."), crumbs: [[tr("Beranda", "Home"), href("home")], [tr("Katalog", "Shop"), ""]] }),
          listings(gs, { title: tr("Rangkaian Glowna", "The Glowna range"), items: all, cols: 3 }),
          end,
        ]);
      case "product":
        return page(gs, [
          head,
          productDetail(gs, tr, href),
          tableBlock(gs, {
            title: tr("Komposisi & cara pakai", "Ingredients & how to use"),
            columns: [tr("Bahan", "Ingredient"), tr("Kadar", "Level"), tr("Fungsi", "Function")],
            rows: [["Ceramide NP/AP/EOP", "3%", tr("Memperbaiki skin barrier", "Repairs the skin barrier")], ["Niacinamide", "5%", tr("Meratakan warna kulit", "Evens skin tone")], ["Panthenol", "1%", tr("Menenangkan kemerahan", "Calms redness")]],
            note: tr("Pakai 2–3 tetes pagi & malam setelah toner.", "Use 2–3 drops morning & night after toner."),
            bg: gs.alt,
          }),
          compare(gs, {
            title: tr("Serum mana yang cocok?", "Which serum suits you?"),
            columns: ["Barrier Repair", "Bright Vitamin C"],
            rows: [tr("Kulit sensitif | ya | tidak", "Sensitive skin | yes | no"), tr("Mencerahkan | sedikit | ya", "Brightening | slight | yes"), tr("Pakai pagi | ya | ya", "Morning use | yes | yes"), tr("Aman ibu hamil | ya | ya", "Pregnancy-safe | yes | yes")],
            highlight: 1,
            caption: tr("Konsultasikan dengan dokter bila ragu.", "Consult a doctor if unsure."),
          }),
          listings(gs, { title: tr("Sering dibeli bersama", "Often bought together"), items: all.slice(1, 4), bg: gs.alt }),
          end,
        ]);
      case "routine":
        return page(gs, [
          head,
          process(gs, {
            eyebrow: tr("Rutinitas pagi", "Morning routine"),
            title: tr("Empat langkah, lima menit", "Four steps, five minutes"),
            steps: [
              [tr("Bersihkan", "Cleanse"), "Gentle Amino Cleanser"],
              [tr("Serum", "Serum"), "Bright Vitamin C 10%"],
              [tr("Lembapkan", "Moisturize"), "Calming Gel Moisturizer"],
              [tr("Lindungi", "Protect"), "Daily Sun Fluid SPF 50"],
            ],
          }),
          timeline(gs, {
            eyebrow: tr("Rutinitas malam", "Night routine"),
            title: tr("Perbaikan saat tidur", "Repair while you sleep"),
            steps: [
              ["21.00", tr("Double cleansing", "Double cleanse"), tr("Cleansing balm lalu Gentle Amino Cleanser.", "Cleansing balm, then Gentle Amino Cleanser.")],
              ["21.05", "Barrier Repair Serum", tr("2–3 tetes, tepuk lembut.", "2–3 drops, pat gently.")],
              ["21.10", "Overnight Repair Mask", tr("2–3 kali seminggu.", "2–3 times a week.")],
            ],
          }),
          listings(gs, { title: tr("Produk dalam rutinitas", "Products in this routine"), items: [all[3], all[4], all[2]], bg: gs.alt }),
          end,
        ]);
      case "ingredients":
        return page(gs, [
          head,
          cards(gs, {
            eyebrow: tr("Bahan aktif", "Active ingredients"),
            title: tr("Kadar jelas, fungsi jelas", "Clear levels, clear purpose"),
            items: [
              { icon: "Cer", title: "Ceramide", text: tr("Lemak alami kulit yang menahan air.", "The skin's natural lipids that hold water."), meta: "Barrier Repair Serum" },
              { icon: "B3", title: "Niacinamide", text: tr("Mengontrol minyak & meratakan warna.", "Controls oil & evens tone."), meta: "Barrier Repair Serum" },
              { icon: "C", title: tr("Vitamin C", "Vitamin C"), text: tr("Antioksidan pencerah.", "A brightening antioxidant."), meta: "Bright Vitamin C 10%" },
              { icon: "Cica", title: "Centella", text: tr("Menenangkan kemerahan.", "Soothes redness."), meta: "Calming Gel Moisturizer" },
              { icon: "Sq", title: "Squalane", text: tr("Pelembap ringan tidak berminyak.", "A light, non-greasy moisturizer."), meta: "Overnight Repair Mask" },
              { icon: "UV", title: tr("Filter UV generasi baru", "New-generation UV filters"), text: tr("Ringan tanpa whitecast.", "Light, no white cast."), meta: "Daily Sun Fluid" },
            ],
          }),
          progressBars(gs, {
            eyebrow: tr("Uji klinis 28 hari", "28-day clinical test"),
            title: "Barrier Repair Serum",
            text: tr("32 relawan kulit sensitif, diuji lab independen.", "32 sensitive-skin volunteers, tested by an independent lab."),
            bars: [[tr("Kelembapan kulit meningkat", "Skin hydration improved"), 91], [tr("Kemerahan berkurang", "Redness reduced"), 78], [tr("Merasa kulit lebih nyaman", "Skin felt more comfortable"), 94]],
            bg: gs.alt,
          }),
          end,
        ]);
      case "about":
        return page(gs, [
          head,
          story(gs, {
            eyebrow: tr("Tentang Glowna", "About Glowna"),
            title: tr("Diformulasikan apoteker, untuk iklim tropis", "Formulated by pharmacists, for the tropics"),
            paras: [tr("Glowna didirikan oleh dua apoteker di Surabaya yang lelah melihat produk impor terlalu berat untuk kulit lembap Indonesia.", "Glowna was founded by two Surabaya pharmacists tired of imported products too heavy for humid Indonesian skin.")],
            bullets: [tr("Diproduksi di pabrik bersertifikat CPKB", "Made in a GMP-certified facility"), tr("Tidak diuji pada hewan", "Never tested on animals"), tr("Kemasan bisa didaur ulang", "Recyclable packaging")],
            image: asset("v2a-skin-hero"),
            alt: "Glowna",
          }),
          people(gs, { title: tr("Pendiri", "Founders"), round: true, items: [{ name: "apt. Nadia Rahma", role: tr("Formulator", "Formulator"), photo: asset("v2a-face-3") }, { name: "apt. Kevin Santoso", role: tr("Riset & mutu", "Research & quality"), photo: asset("v2a-face-2") }], cols: 2, bg: gs.alt }),
          end,
        ]);
      case "contact":
        return page(gs, [
          head,
          faqList(gs, {
            eyebrow: tr("Bantuan", "Help"),
            title: tr("Pertanyaan pelanggan", "Customer questions"),
            items: [
              [tr("Berapa lama pengiriman?", "How long is shipping?"), tr("1–2 hari Jawa, 3–5 hari luar Jawa.", "1–2 days in Java, 3–5 days elsewhere.")],
              [tr("Bisa retur?", "Can I return?"), tr("Produk tersegel bisa diretur dalam 14 hari.", "Sealed products can be returned within 14 days.")],
              [tr("Cocok untuk kulit berjerawat?", "Good for acne-prone skin?"), tr("Semua produk non-comedogenic. Konsultasi gratis via WhatsApp.", "All products are non-comedogenic. Free consultation on WhatsApp.")],
            ],
          }),
          contact(gs, {
            title: tr("Konsultasi kulit gratis", "Free skin consultation"),
            text: tr("Apoteker kami membalas Senin–Sabtu, 09.00–18.00.", "Our pharmacists reply Mon–Sat, 9am–6pm."),
            info: [["WhatsApp", "+62 811 4500 6600"], ["Email", "halo@glowna.example"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "select", label: tr("Jenis kulit", "Skin type"), ph: tr("Pilih", "Choose"), options: [tr("Kering", "Dry"), tr("Berminyak", "Oily"), tr("Kombinasi", "Combination"), tr("Sensitif", "Sensitive")] },
              { kind: "input", label: tr("Keluhan utama", "Main concern"), ph: tr("Mis. kemerahan setelah eksfoliasi", "E.g. redness after exfoliating") },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(gs, [
          head,
          heroSplit(gs, {
            badge: tr("BPOM · cruelty-free · dibuat di Surabaya", "BPOM · cruelty-free · made in Surabaya"),
            title: tr("Kulit tenang, tanpa rutinitas 10 langkah", "Calm skin, without a 10-step routine"),
            text: tr("Skincare berbasis riset yang ringan untuk iklim tropis. Kadar bahan aktif tertulis jelas di setiap botol.", "Research-based, lightweight skincare for tropical climates. Active levels printed clearly on every bottle."),
            actions: [[tr("Belanja sekarang", "Shop now"), href("shop")], [tr("Temukan rutinitas", "Find your routine"), href("routine"), "outline"]],
            image: asset("v2a-skin-hero"),
            alt: tr("Botol serum", "Serum bottle"),
            reverse: true,
            gradient: [GS.soft, "#ffffff", 180],
            extra: [stars(gs, 4.9, tr("dari 12.000+ ulasan", "from 12,000+ reviews"))],
          }),
          listings(gs, { eyebrow: tr("Terlaris", "Best sellers"), title: tr("Favorit bulan ini", "This month's favorites"), items: all.slice(0, 3) }),
          cards(gs, {
            title: tr("Janji Glowna", "The Glowna promise"),
            variant: "line",
            items: [
              { title: tr("Kadar transparan", "Transparent levels"), text: tr("Persentase bahan aktif tertulis.", "Active percentages printed.") },
              { title: tr("Uji klinis", "Clinically tested"), text: tr("Lab independen, relawan Indonesia.", "Independent labs, Indonesian volunteers.") },
              { title: tr("Retur 14 hari", "14-day returns"), text: tr("Tidak cocok? Kembalikan.", "Not right? Send it back.") },
            ],
            bg: gs.alt,
          }),
          quotes(gs, {
            title: tr("Ulasan pelanggan", "Customer reviews"),
            items: [
              { quote: tr("Kemerahan setelah peeling hilang dalam seminggu.", "Post-peel redness gone in a week."), author: "Anisa P.", role: tr("Kulit sensitif · Barrier Repair Serum", "Sensitive skin · Barrier Repair Serum"), avatar: asset("v2a-face-3") },
              { quote: tr("Sunscreen pertama yang tidak bikin wajah abu-abu.", "The first sunscreen that doesn't turn me grey."), author: "Dewi K.", role: tr("Kulit sawo matang · Sun Fluid", "Medium-deep skin · Sun Fluid"), avatar: asset("v2a-face-4") },
              { quote: tr("Pelembapnya ringan, cocok buat cuaca Jakarta.", "Light moisturizer, perfect for Jakarta weather."), author: "Raka M.", role: tr("Kulit berminyak · Gel Moisturizer", "Oily skin · Gel Moisturizer"), avatar: asset("v2a-face-2") },
            ],
          }),
          listings(gs, { eyebrow: tr("Lengkapi rutinitas", "Complete your routine"), title: tr("Produk lainnya", "More products"), items: all.slice(3) }),
          ctaBand(gs, tr, { title: tr("Bingung mulai dari mana?", "Not sure where to start?"), text: tr("Konsultasi gratis dengan apoteker kami.", "Free consultation with our pharmacists."), primary: { label: tr("Konsultasi", "Consult"), href: href("contact") }, secondary: { label: tr("Lihat rutinitas", "See routines"), href: href("routine") } }),
          end,
        ]);
    }
  },
};

/* ------------------- 20. Universitas Cakrawala Nusantara (9 hlm) ----- */

const UC: Palette = { ink: "#172554", muted: "#475569", primary: "#1e3a8a", primaryDark: "#172554", soft: "#eff6ff", line: "#bfdbfe" };
const uc = look(UC, { bg: "#ffffff", alt: "#f8fafc", dark: "#172554", radius: 8, headFont: FONTS.serif, font: FONTS.sans });

export const educationUniversity: TemplateContent = {
  brand: "Universitas Cakrawala Nusantara",
  pages: [
    home(),
    pg("faculties", ["fakultas", "Fakultas"], ["faculties", "Faculties"]),
    pg("programs", ["program-studi", "Program Studi"], ["programs", "Programs"]),
    pg("admissions", ["pmb", "Penerimaan"], ["admissions", "Admissions"]),
    pg("fees", ["biaya-beasiswa", "Biaya & Beasiswa"], ["fees-scholarships", "Fees & Scholarships"]),
    pg("campus", ["kehidupan-kampus", "Kehidupan Kampus"], ["campus-life", "Campus Life"]),
    pg("research", ["riset", "Riset"], ["research", "Research"]),
    pg("news", ["berita", "Berita"], ["news", "News"]),
    pg("contact", ["kontak", "Kontak"], ["contact", "Contact"]),
  ],
  build: (key, tr, href) => {
    const nav = mega(
      uc,
      [
        `${tr("Akademik", "Academics")} | ${href("faculties")}`,
        `- ${tr("Fakultas", "Faculties")} | ${tr("6 fakultas, 28 prodi", "6 faculties, 28 programs")} | ${href("faculties")}`,
        `- ${tr("Program studi", "Programs")} | ${tr("S1, S2, dan kelas internasional", "Bachelor's, master's, international")} | ${href("programs")}`,
        `- ${tr("Riset", "Research")} | ${tr("Pusat studi & publikasi", "Research centers & papers")} | ${href("research")}`,
        `${tr("Penerimaan", "Admissions")} | ${href("admissions")}`,
        `- ${tr("Jalur masuk", "Entry routes")} | ${tr("Rapor, tes, prestasi", "Grades, test, merit")} | ${href("admissions")}`,
        `- ${tr("Biaya & beasiswa", "Fees & scholarships")} | ${tr("UKT dan 4 skema beasiswa", "Tuition and 4 scholarships")} | ${href("fees")}`,
        `${tr("Kampus", "Campus")} | ${href("campus")}`,
        `${tr("Berita", "News")} | ${href("news")}`,
      ],
      tr("Daftar PMB", "Apply now"),
      href("admissions"),
    );
    const head = headerBar("Univ. Cakrawala", uc, { info: [tr("Terakreditasi Unggul BAN-PT", "Accredited 'Excellent' by BAN-PT"), "PMB: +62 274 555 2027", "Sleman, Yogyakarta"], nav });
    const end = footer(
      "Universitas Cakrawala Nusantara",
      tr("Kampus riset di Sleman, Yogyakarta. Berdiri 1987.", "A research university in Sleman, Yogyakarta. Founded 1987."),
      [
        { title: tr("Akademik", "Academics"), items: [tr("Fakultas", "Faculties"), tr("Program studi", "Programs"), tr("Kalender akademik", "Academic calendar")] },
        { title: tr("Kontak", "Contact"), items: ["Jl. Kaliurang Km 12, Sleman", "+62 274 555 2027", "pmb@cakrawala.example"] },
      ],
      tr("© 2026 Universitas Cakrawala Nusantara. Konten contoh.", "© 2026 Universitas Cakrawala Nusantara. Sample content."),
      "#0f1a3d",
    );
    const news: Post[] = [
      { image: asset("v2a-uni-lab"), tag: tr("Riset", "Research"), title: tr("Tim teknik kembangkan baterai dari limbah sawit", "Engineering team builds batteries from palm waste"), text: tr("Kapasitas 20% lebih tinggi dari grafit biasa.", "20% more capacity than regular graphite."), date: "09 Okt 2026", href: href("research") },
      { image: asset("v2a-uni-hero"), tag: tr("Prestasi", "Achievement"), title: tr("Mahasiswa hukum juara peradilan semu nasional", "Law students win national moot court"), text: tr("Mengalahkan 42 kampus.", "Beating 42 universities."), date: "30 Sep 2026", href: href("news") },
      { image: asset("v2a-uni-lab"), tag: tr("Kampus", "Campus"), title: tr("Perpustakaan baru buka 24 jam", "New library opens 24/7"), text: tr("1.200 kursi dan 60 ruang diskusi.", "1,200 seats and 60 study rooms."), date: "15 Sep 2026", href: href("campus") },
    ];
    switch (key) {
      case "faculties":
        return page(uc, [
          head,
          pageBanner(uc, { eyebrow: tr("Akademik", "Academics"), title: tr("Enam fakultas, satu kampus", "Six faculties, one campus"), light: true }),
          cards(uc, {
            title: tr("Fakultas", "Faculties"),
            variant: "num",
            items: [
              { title: tr("Teknik", "Engineering"), text: tr("Sipil, Mesin, Elektro, Informatika, Industri.", "Civil, Mechanical, Electrical, Informatics, Industrial."), meta: tr("5 prodi", "5 programs") },
              { title: tr("Ekonomi & Bisnis", "Economics & Business"), text: tr("Manajemen, Akuntansi, Ekonomi Pembangunan.", "Management, Accounting, Development Economics."), meta: tr("4 prodi", "4 programs") },
              { title: tr("Kedokteran", "Medicine"), text: tr("Pendidikan Dokter, Keperawatan, Farmasi.", "Medicine, Nursing, Pharmacy."), meta: tr("3 prodi", "3 programs") },
              { title: tr("Hukum", "Law"), text: tr("Ilmu Hukum dengan klinik bantuan hukum.", "Law with a legal aid clinic."), meta: tr("2 prodi", "2 programs") },
              { title: tr("Ilmu Sosial & Politik", "Social & Political Sciences"), text: tr("Komunikasi, Hubungan Internasional, Sosiologi.", "Communication, International Relations, Sociology."), meta: tr("4 prodi", "4 programs") },
              { title: tr("Pertanian", "Agriculture"), text: tr("Agroteknologi, Teknologi Pangan, Kehutanan.", "Agrotechnology, Food Technology, Forestry."), meta: tr("4 prodi", "4 programs") },
            ],
          }),
          story(uc, { eyebrow: tr("Kelas internasional", "International classes"), title: tr("Belajar dalam bahasa Inggris", "Study in English"), paras: [tr("Lima prodi membuka kelas internasional dengan semester pertukaran di Belanda, Jepang, atau Australia.", "Five programs offer international classes with an exchange semester in the Netherlands, Japan, or Australia.")], image: asset("v2a-uni-hero"), alt: tr("Gedung kampus", "Campus building"), bg: uc.alt }),
          end,
        ]);
      case "programs":
        return page(uc, [
          head,
          tableBlock(uc, {
            eyebrow: tr("Program studi", "Programs"),
            title: tr("Program sarjana pilihan", "Featured bachelor's programs"),
            columns: [tr("Program studi", "Program"), tr("Fakultas", "Faculty"), tr("Akreditasi", "Accreditation"), tr("Daya tampung", "Intake")],
            rows: [[tr("Informatika", "Informatics"), tr("Teknik", "Engineering"), tr("Unggul", "Excellent"), "160"], [tr("Manajemen", "Management"), tr("Ekonomi & Bisnis", "Economics & Business"), tr("Unggul", "Excellent"), "220"], [tr("Pendidikan Dokter", "Medicine"), tr("Kedokteran", "Medicine"), "A", "100"], [tr("Ilmu Hukum", "Law"), tr("Hukum", "Law"), tr("Unggul", "Excellent"), "200"], [tr("Teknologi Pangan", "Food Technology"), tr("Pertanian", "Agriculture"), tr("Baik Sekali", "Very Good"), "90"]],
          }),
          tabsBlock(uc, {
            title: tr("Jenjang", "Levels"),
            tabs: [[tr("Sarjana (S1)", "Bachelor's"), tr("28 prodi, 8 semester, magang wajib 1 semester.", "28 programs, 8 semesters, a mandatory internship semester.")], [tr("Magister (S2)", "Master's"), tr("9 prodi, kelas reguler & akhir pekan.", "9 programs, regular & weekend classes.")], [tr("Internasional", "International"), tr("5 prodi berbahasa Inggris dengan double degree.", "5 English-taught programs with double degrees.")]],
            bg: uc.alt,
          }),
          end,
        ]);
      case "admissions":
        return page(uc, [
          head,
          countdownBand(uc, { eyebrow: tr("PMB 2027 gelombang 1", "2027 intake, round 1"), title: tr("Pendaftaran ditutup", "Applications close in"), text: tr("Jalur rapor & prestasi, 31 Januari 2027.", "Grades & merit routes, January 31, 2027."), target: "2027-01-31T23:59", finished: tr("Gelombang 1 ditutup.", "Round 1 is closed."), bg: UC.primary }),
          process(uc, {
            title: tr("Alur pendaftaran", "How to apply"),
            steps: [[tr("Buat akun", "Create an account"), tr("Di portal PMB.", "On the admissions portal.")], [tr("Pilih jalur", "Choose a route"), tr("Rapor, tes, atau prestasi.", "Grades, test, or merit.")], [tr("Unggah berkas", "Upload documents"), tr("Rapor & sertifikat.", "Report cards & certificates.")], [tr("Pengumuman", "Results"), tr("2 minggu setelah tutup.", "2 weeks after closing.")]],
          }),
          timeline(uc, {
            title: tr("Jadwal PMB 2027", "2027 admissions calendar"),
            steps: [[tr("Nov–Jan", "Nov–Jan"), tr("Gelombang 1", "Round 1"), tr("Jalur rapor & prestasi.", "Grades & merit routes.")], [tr("Feb–Apr", "Feb–Apr"), tr("Gelombang 2", "Round 2"), tr("Jalur tes CBT.", "Computer-based test.")], [tr("Mei–Jun", "May–Jun"), tr("Gelombang 3", "Round 3"), tr("Sisa kuota.", "Remaining places.")], [tr("Agustus", "August"), tr("Orientasi", "Orientation"), tr("PKKMB & kelas perdana.", "Orientation & first classes.")]],
            bg: uc.alt,
          }),
          faqAccordion(uc, tr, {
            title: tr("Pertanyaan calon mahasiswa", "Applicant questions"),
            items: [[tr("Boleh daftar lebih dari satu prodi?", "Can I apply to multiple programs?"), tr("Boleh, maksimal 2 pilihan.", "Yes, up to 2 choices.")], [tr("Ada tes kesehatan?", "Is there a health test?"), tr("Khusus Kedokteran & Keperawatan.", "Only for Medicine & Nursing.")]],
            contact: { label: tr("Hubungi PMB", "Contact admissions"), href: href("contact") },
          }),
          end,
        ]);
      case "fees":
        return page(uc, [
          head,
          tableBlock(uc, {
            eyebrow: tr("Uang kuliah tunggal", "Tuition"),
            title: tr("Biaya per semester", "Fees per semester"),
            columns: [tr("Kelompok prodi", "Program group"), tr("UKT reguler", "Regular"), tr("Kelas internasional", "International")],
            rows: [[tr("Sosial & hukum", "Social & law"), "Rp7.500.000", "Rp18.000.000"], [tr("Teknik & pertanian", "Engineering & agriculture"), "Rp9.000.000", "Rp21.000.000"], [tr("Kedokteran", "Medicine"), "Rp24.000.000", "—"]],
            note: tr("Tanpa uang gedung. UKT bisa dicicil 3 kali.", "No building fee. Tuition can be paid in 3 installments."),
          }),
          compare(uc, {
            title: tr("Skema beasiswa", "Scholarships"),
            columns: [tr("Prestasi", "Merit"), tr("Cakrawala Peduli", "Need-based"), tr("Atlet & seni", "Athletes & arts")],
            rows: [tr("Bebas UKT | 100% | 100% | 50%", "Tuition waiver | 100% | 100% | 50%"), tr("Biaya hidup | ya | ya | tidak", "Living stipend | yes | yes | no"), tr("Asrama | ya | ya | tidak", "Dormitory | yes | yes | no"), tr("Syarat IPK | 3,50 | 3,00 | 2,75", "Min. GPA | 3.50 | 3.00 | 2.75")],
            highlight: 2,
            caption: tr("Kuota 450 penerima per tahun.", "450 recipients per year."),
            bg: uc.alt,
          }),
          end,
        ]);
      case "campus":
        return page(uc, [
          head,
          slider(uc, {
            title: tr("Hidup di kampus", "Life on campus"),
            slides: [
              { title: tr("Perpustakaan 24 jam", "24/7 library"), text: tr("1.200 kursi dan 60 ruang diskusi.", "1,200 seats and 60 study rooms."), bg: "#1e3a8a" },
              { title: tr("78 UKM", "78 student clubs"), text: tr("Dari gamelan hingga robotika.", "From gamelan to robotics."), bg: "#0f766e" },
              { title: tr("Asrama 1.500 kamar", "1,500-room dorms"), text: tr("Prioritas mahasiswa luar Jawa.", "Priority for students from outside Java."), bg: "#7c2d12" },
            ],
          }),
          gallery(uc, { title: tr("Sudut kampus", "Around campus"), cols: 4, images: [[asset("v2a-uni-hero"), tr("Gedung rektorat", "Rectorate")], [asset("v2a-uni-lab"), tr("Lab terpadu", "Integrated lab")], [asset("v2a-uni-hero"), tr("Taman tengah", "Central garden")], [asset("v2a-uni-lab"), tr("Pusat olahraga", "Sports center")]], bg: uc.alt }),
          end,
        ]);
      case "research":
        return page(uc, [
          head,
          figures(uc, { items: [["1.140", tr("Publikasi Scopus 2025", "Scopus papers in 2025")], ["86", tr("Paten terdaftar", "Registered patents")], ["14", tr("Pusat studi", "Research centers")], ["Rp96 M", tr("Dana riset", "Research funding")]], bg: "#172554", light: true }),
          story(uc, { eyebrow: tr("Unggulan", "Flagship"), title: tr("Pusat Studi Energi Terbarukan", "Renewable Energy Research Center"), paras: [tr("Mengembangkan baterai berbasis limbah biomassa dan PLTS desa bersama 40 desa di DIY.", "Developing biomass-waste batteries and village solar with 40 villages in Yogyakarta.")], image: asset("v2a-uni-lab"), alt: tr("Laboratorium", "Laboratory") }),
          posts(uc, { title: tr("Kabar riset", "Research news"), readLabel: tr("Baca", "Read"), items: news.slice(0, 2), cols: 2, bg: uc.alt }),
          end,
        ]);
      case "news":
        return page(uc, [head, pageBanner(uc, { eyebrow: tr("Berita", "News"), title: tr("Kabar kampus", "Campus news") }), posts(uc, { title: tr("Terbaru", "Latest"), readLabel: tr("Baca", "Read"), items: news }), end]);
      case "contact":
        return page(uc, [
          head,
          contact(uc, {
            eyebrow: tr("Kontak", "Contact"),
            title: tr("Tanya PMB atau jadwalkan tur kampus", "Ask admissions or book a campus tour"),
            info: [[tr("Alamat", "Address"), "Jl. Kaliurang Km 12, Sleman, Yogyakarta"], [tr("Telepon PMB", "Admissions"), "+62 274 555 2027"], ["Email", "pmb@cakrawala.example"]],
            fields: [
              { kind: "input", label: tr("Nama", "Name"), ph: tr("Nama Anda", "Your name") },
              { kind: "input", label: tr("Asal sekolah", "School"), ph: "SMA Negeri 1 Klaten" },
              { kind: "select", label: tr("Prodi diminati", "Program of interest"), ph: tr("Pilih", "Choose"), options: [tr("Informatika", "Informatics"), tr("Manajemen", "Management"), tr("Kedokteran", "Medicine"), tr("Ilmu Hukum", "Law")] },
              { kind: "date", label: tr("Tanggal tur kampus", "Campus tour date") },
            ],
            submit: tr("Kirim", "Send"),
          }),
          end,
        ]);
      default:
        return page(uc, [
          head,
          heroCover(uc, {
            badge: tr("PMB 2027 gelombang 1 dibuka", "2027 admissions round 1 open"),
            title: tr("Belajar untuk menjawab persoalan nyata", "Learning to solve real problems"),
            text: tr("28 program studi terakreditasi, 1.100+ publikasi per tahun, dan 450 beasiswa penuh.", "28 accredited programs, 1,100+ papers a year, and 450 full scholarships."),
            actions: [[tr("Daftar sekarang", "Apply now"), href("admissions"), "light"], [tr("Jelajahi prodi", "Explore programs"), href("programs"), "outline"]],
            gradient: ["#172554", "#1e3a8a", 160],
            image: asset("v2a-uni-hero"),
            alt: tr("Gedung kampus", "Campus building"),
          }),
          counter(uc, { items: [tr("32.000 | Mahasiswa", "32,000 | Students"), tr("28 | Program studi", "28 | Programs"), tr("92% | Lulusan bekerja < 6 bulan", "92% | Employed < 6 months"), tr("140 | Mitra internasional", "140 | Global partners")] }),
          cards(uc, {
            eyebrow: tr("Fakultas", "Faculties"),
            title: tr("Temukan bidangmu", "Find your field"),
            cols: 3,
            items: [
              { icon: "⚙", title: tr("Teknik", "Engineering"), text: tr("5 prodi, lab terpadu.", "5 programs, integrated labs.") },
              { icon: "⚕", title: tr("Kedokteran", "Medicine"), text: tr("Rumah sakit pendidikan sendiri.", "Our own teaching hospital.") },
              { icon: "⚖", title: tr("Hukum", "Law"), text: tr("Klinik bantuan hukum gratis.", "A free legal aid clinic.") },
            ],
            bg: uc.alt,
          }),
          posts(uc, { eyebrow: tr("Berita", "News"), title: tr("Kabar terbaru", "Latest news"), readLabel: tr("Baca", "Read"), items: news }),
          ctaBand(uc, tr, { title: tr("Siap jadi bagian dari Cakrawala?", "Ready to join Cakrawala?"), primary: { label: tr("Daftar PMB", "Apply now"), href: href("admissions") }, secondary: { label: tr("Biaya & beasiswa", "Fees & scholarships"), href: href("fees") } }),
          end,
        ]);
    }
  },
};
