import type { Chapter, MotionSpec, Pose, ScreenMode } from "./motion3d";
import type { ObjectKind } from "./motionObjects";

/* ================================================================== */
/* Content of the 8 3D Motion templates (v18). All names, numbers, and contacts are fictional. */
/* Same chapter flow: hero → bio code → statement → cards → numbers → contact.*/
/* ================================================================== */

type V3 = [number, number, number];
const CAM: V3 = [0, 0.6, 11];
const LOOK: V3 = [0, 0, 0];

function p(pos: V3, rot: V3, s: number, screen?: ScreenMode, st?: Record<string, number>, cam: V3 = CAM, look: V3 = LOOK): Pose {
  return { cam, look, pos, rot, s, screen, st };
}

/** Pose per chapter for each object (order: hero, code, sentence, cards, numbers, contact). */
const POSES: Record<ObjectKind, Pose[]> = {
  monitor: [
    p([2.4, -0.1, 0], [0.12, -0.5, 0], 0.8, "logo", { glow: 0, keys: 0 }),
    p([1.65, 0.05, 1.2], [0.04, -0.16, 0], 1.0, "code", { glow: 1, keys: 1 }, [0, 0.4, 8], [0, 0.2, 0]),
    p([-2.5, 0, 0], [0.1, 0.55, 0], 0.8, "ui", { glow: 0.6, keys: 0.3 }),
    p([2.5, -0.2, 0], [0.15, -0.8, 0.04], 0.75, "ui", { glow: 0.5, keys: 0.2 }),
    p([-2.5, 0.1, 0], [-0.05, 0.85, 0], 0.72, "ui", { glow: 0.4, keys: 0 }),
    p([2.4, 0, 0], [0.1, -0.35, 0], 0.8, "text", { glow: 0.6, keys: 0 }),
  ],
  phone: [
    p([2.4, 0, 0], [0.1, -0.45, 0.06], 0.8, "logo", { fan: 0, glow: 0 }),
    p([1.45, 0.2, 1.4], [0, -0.12, 0], 0.9, "code", { fan: 0, glow: 1 }, [0, 0.2, 8], [0, 0.1, 0]),
    p([-2.4, 0, 0], [0.1, 0.5, -0.05], 0.8, "ui", { fan: 1, glow: 0.6 }),
    p([2.6, 0, 0], [0.1, -0.6, 0], 0.75, "ui", { fan: 0.7, glow: 0.4 }),
    p([-2.5, 0, 0], [0, 0.7, 0], 0.72, "ui", { fan: 1, glow: 0.4 }),
    p([2.4, 0, 0], [0.1, -0.3, 0], 0.8, "text", { fan: 0, glow: 1 }),
  ],
  laptop: [
    p([2.3, -0.3, 0], [0.55, -0.6, 0], 0.85, "logo", { open: 0, glow: 0 }),
    p([1.5, 0, 1.2], [0.12, -0.18, 0], 0.95, "code", { open: 1, glow: 1 }, [0, 0.5, 8], [0, 0.2, 0]),
    p([-2.5, 0, 0], [0.2, 0.6, 0], 0.8, "ui", { open: 1, glow: 0.6 }),
    p([2.5, -0.2, 0], [0.25, -0.75, 0], 0.78, "ui", { open: 1, glow: 0.4 }),
    p([-2.4, 0, 0], [0.15, 0.75, 0], 0.75, "ui", { open: 1, glow: 0.4 }),
    p([2.4, 0, 0], [0.15, -0.35, 0], 0.8, "text", { open: 1, glow: 1 }),
  ],
  camera: [
    p([2.5, 0, 0], [0.15, -0.7, 0], 0.9, "logo", { zoom: 0, flash: 0 }),
    p([2.6, 0.1, 1.5], [0.05, -0.35, 0], 1.0, "code", { zoom: 1, flash: 0 }),
    p([-2.5, 0, 0], [0.1, 0.9, 0], 0.85, "ui", { zoom: 0.4, flash: 1 }),
    p([2.5, 0, 0], [0.3, -1.1, 0.1], 0.8, "ui", { zoom: 0.2, flash: 0 }),
    p([-2.4, 0, 0], [0, 0.5, 0], 0.8, "ui", { zoom: 1, flash: 0 }),
    p([2.4, 0, 0], [0.1, -0.4, 0], 0.85, "text", { zoom: 0, flash: 1 }),
  ],
  vinyl: [
    p([2.4, -0.2, 0], [0.7, -0.4, 0], 0.8, "logo", { spin: 0, arm: 0 }),
    p([2.5, -0.3, 1.2], [0.85, -0.2, 0], 0.95, "code", { spin: 1, arm: 1 }),
    p([-2.5, 0, 0], [0.6, 0.5, 0.1], 0.8, "ui", { spin: 1, arm: 1 }),
    p([2.5, -0.2, 0], [0.9, -0.8, 0], 0.75, "ui", { spin: 0.6, arm: 1 }),
    p([-2.4, 0, 0], [0.5, 0.9, 0], 0.75, "ui", { spin: 1, arm: 1 }),
    p([2.4, 0, 0], [0.75, -0.3, 0], 0.8, "text", { spin: 0.3, arm: 0 }),
  ],
  perfume: [
    p([2.4, -0.1, 0], [0.08, -0.3, 0], 0.85, "logo", { cap: 0, mist: 0, orbit: 0 }),
    p([2.6, 0, 1.2], [0.05, -0.2, 0], 0.95, "code", { cap: 1, mist: 1, orbit: 0 }),
    p([-2.5, 0, 0], [0.05, 0.4, 0], 0.8, "ui", { cap: 1, mist: 0.3, orbit: 1 }),
    p([2.5, -0.1, 0], [0.1, -0.5, 0.05], 0.75, "ui", { cap: 1, mist: 0, orbit: 1 }),
    p([-2.4, 0, 0], [0, 0.6, 0], 0.75, "ui", { cap: 0, mist: 0, orbit: 0.5 }),
    p([2.4, 0, 0], [0.05, -0.3, 0], 0.85, "text", { cap: 0, mist: 0, orbit: 0 }),
  ],
  rocket: [
    p([2.4, 0.1, 0], [0, -0.3, -0.15], 0.72, "logo", { flame: 0, lift: 0, orbit: 0 }),
    p([2.7, -0.1, 1], [0, -0.4, -0.08], 0.78, "code", { flame: 1, lift: 0.3, orbit: 0 }),
    p([-2.6, -0.2, 0], [0, 0.4, 0.3], 0.68, "ui", { flame: 1, lift: 0.6, orbit: 1 }),
    p([2.5, 0, 0], [0.1, -0.6, -0.2], 0.7, "ui", { flame: 0.6, lift: 0.2, orbit: 0 }),
    p([-2.4, 0, 0], [0, 0.6, 0.1], 0.7, "ui", { flame: 0, lift: 0, orbit: 0 }),
    p([2.4, -0.3, 0], [0, -0.3, -0.1], 0.72, "text", { flame: 1, lift: 1, orbit: 0 }),
  ],
  book: [
    p([2.3, 0, 0], [0.25, -0.5, 0.05], 0.95, "logo", { open: 0, flip: 0 }),
    p([1.55, 0, 1.5], [0.12, -0.1, 0], 1.0, "code", { open: 1, flip: 0 }),
    p([-2.2, 0, 0], [0.3, 0.4, 0], 0.75, "text", { open: 1, flip: 1 }),
    p([2.4, 0, 0], [0.35, -0.5, 0], 0.75, "text", { open: 1, flip: 0 }),
    p([-2.3, 0, 0], [0.2, 0.5, 0], 0.7, "text", { open: 1, flip: 1 }),
    p([2.4, 0, 0], [0.2, -0.4, 0], 0.9, "text", { open: 0, flip: 0 }),
  ],
};

interface Story {
  hero: { nav: string; kicker: string; title: string; lead: string; cta: [string, string] };
  code: { nav: string; kicker: string; title: string; body: string };
  text: { kicker: string; title: string; line: string };
  cards: { nav: string; kicker: string; title: string; items: { tag?: string; title: string; text: string }[] };
  stats: { kicker: string; title: string; stats: { value: string; label: string }[] };
  contact: { nav: string; kicker: string; title: string; body: string };
}

/** Build the 6 standard chapters from the story + object poses. */
function chapters(obj: ObjectKind, s: Story): Chapter[] {
  const P = POSES[obj];
  return [
    { id: "beranda", nav: s.hero.nav, kind: "hero", align: "left", kicker: s.hero.kicker, title: s.hero.title, body: [s.hero.lead], cta: [{ label: s.hero.cta[0], href: "#karya" }, { label: s.hero.cta[1], href: "#kontak", ghost: true }], pose: P[0] },
    { id: "profil", nav: s.code.nav, kind: "code", align: "left", kicker: s.code.kicker, title: s.code.title, body: [s.code.body], pose: P[1] },
    { id: "cerita", kind: "text", align: "right", kicker: s.text.kicker, title: s.text.title, body: [s.text.line], pose: P[2] },
    { id: "karya", nav: s.cards.nav, kind: "cards", align: "left", kicker: s.cards.kicker, title: s.cards.title, items: s.cards.items, pose: P[3] },
    { id: "angka", kind: "stats", align: "right", kicker: s.stats.kicker, title: s.stats.title, stats: s.stats.stats, pose: P[4] },
    { id: "kontak", nav: s.contact.nav, kind: "contact", align: "left", kicker: s.contact.kicker, title: s.contact.title, body: [s.contact.body], pose: P[5] },
  ];
}

const gf = (fam: string) => `https://fonts.googleapis.com/css2?${fam}&family=JetBrains+Mono:wght@500&display=swap`;

export const MOTION_SPECS_DATA: MotionSpec[] = [
  {
    id: "motion-ruang-kode",
    title: "Raka Pratama · Full-stack Developer",
    description: "Portofolio developer 3D: PC membesar saat digulir, layar mengetik biodata dalam bentuk kode, lalu kalimat, karya, dan kontak muncul bergantian.",
    brand: "Raka.dev",
    object: "monitor",
    font: { display: "Space Grotesk", text: "Inter", href: gf("family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600") },
    colors: { bg: "#070b16", bg2: "#16224d", panel: "#0e1530", ink: "#eef2ff", inkSoft: "#a3adcc", accent: "#7cf0c5", accent2: "#6c8cff", line: "#25304f", obj: "#c9cfdc", obj2: "#2a3147", dark: true },
    config: {
      komentar: "Halo! Ini saya, dalam bentuk kode.",
      variabel: "raka",
      bahasa: "js",
      profil: { nama: "Raka Pratama", peran: "Full-stack Developer", kota: "Bandung", pengalaman: "6 tahun", keahlian: ["React", "Node.js", "Three.js"], status: "Terbuka untuk proyek" },
      layarTeks: "Mari bangun sesuatu.",
      layarSub: "raka.dev",
    },
    berkas: "raka.js",
    chapters: chapters("monitor", {
      hero: { nav: "Beranda", kicker: "Portofolio · Full-stack Developer", title: "Kode yang terasa hidup.", lead: "Saya Raka. Saya membangun website dan aplikasi yang cepat, rapi, dan menyenangkan dipakai. Gulir untuk berkenalan.", cta: ["Lihat karya", "Hubungi saya"] },
      code: { nav: "Profil", kicker: "01 · Tentang saya", title: "Biodata, versi developer.", body: "Gulir pelan-pelan. Biodata saya sedang diketik di layar." },
      text: { kicker: "02 · Cara saya bekerja", title: "Prinsip kerja", line: "Website terbaik itu cepat dibuka, mudah dipahami, dan dibuat dengan kode yang bisa dirawat bertahun-tahun." },
      cards: {
        nav: "Karya",
        kicker: "03 · Karya pilihan",
        title: "Proyek terbaru",
        items: [
          { tag: "SaaS", title: "Kasirku", text: "Aplikasi kasir web untuk 1.200 UMKM, tetap jalan saat offline." },
          { tag: "3D", title: "Rumah Virtual Nusa", text: "Tur properti 3D langsung di browser dengan Three.js." },
          { tag: "API", title: "Ongkir Cepat", text: "API cek ongkir yang melayani 2 juta permintaan per hari." },
        ],
      },
      stats: { kicker: "04 · Dalam angka", title: "Enam tahun, ringkasnya.", stats: [{ value: "48", label: "proyek selesai" }, { value: "6", label: "tahun pengalaman" }, { value: "99%", label: "klien puas" }] },
      contact: { nav: "Kontak", kicker: "05 · Kontak", title: "Punya ide? Ayo ngobrol.", body: "Saya sedang menerima proyek baru untuk kuartal ini. Balasan biasanya dalam 24 jam." },
    }),
    contact: { email: "halo@raka.dev", whatsapp: "6281234567890", waText: "Halo Raka, saya ingin diskusi proyek." },
    footer: "© 2026 Raka Pratama · Three.js, OWD Scrub & Motion",
  },
  {
    id: "motion-studio-saku",
    title: "Studio Saku · Studio Aplikasi Mobile",
    description: "Website studio aplikasi dengan HP 3D: layar mengetik profil studio, kartu aplikasi melayang keluar, lalu layanan dan angka muncul saat digulir.",
    brand: "Studio Saku",
    object: "phone",
    font: { display: "Plus Jakarta Sans", text: "Plus Jakarta Sans", href: gf("family=Plus+Jakarta+Sans:wght@400;500;600;800") },
    colors: { bg: "#f4f1ff", bg2: "#e0d8ff", panel: "#ffffff", ink: "#16123a", inkSoft: "#5b5680", accent: "#6d4aff", accent2: "#ff7a59", line: "#dcd6f5", obj: "#1d1b2e", obj2: "#ffffff", dark: false },
    config: {
      komentar: "Studio aplikasi mobile",
      variabel: "studio",
      bahasa: "js",
      profil: { nama: "Studio Saku", fokus: "Aplikasi mobile", kota: "Yogyakarta", tim: "9 orang", platform: ["iOS", "Android"], buka: true },
      layarTeks: "Aplikasi yang dipakai tiap hari.",
      layarSub: "studiosaku.id",
    },
    berkas: "studio.js",
    chapters: chapters("phone", {
      hero: { nav: "Beranda", kicker: "Studio aplikasi mobile", title: "Aplikasi di saku, rapi di tangan.", lead: "Kami merancang dan membangun aplikasi iOS dan Android yang ringan, cantik, dan mudah dipakai siapa saja.", cta: ["Lihat layanan", "Konsultasi gratis"] },
      code: { nav: "Profil", kicker: "01 · Profil studio", title: "Kenalan lewat kode.", body: "Gulir terus. Profil kami diketik langsung di layar HP." },
      text: { kicker: "02 · Keyakinan kami", title: "Keyakinan kami", line: "Aplikasi yang baik terasa sederhana. Kerumitannya kami simpan di belakang layar." },
      cards: {
        nav: "Layanan",
        kicker: "03 · Layanan",
        title: "Dari ide sampai rilis",
        items: [
          { tag: "Desain", title: "UI/UX & prototipe", text: "Riset pengguna, alur, dan prototipe yang bisa langsung dicoba." },
          { tag: "Bangun", title: "Aplikasi Flutter", text: "Satu kode untuk iOS dan Android, performa tetap mulus." },
          { tag: "Rawat", title: "Perawatan & analitik", text: "Pembaruan rutin, pantauan error, dan laporan bulanan." },
        ],
      },
      stats: { kicker: "04 · Rekam jejak", title: "Sudah dipakai jutaan orang.", stats: [{ value: "32", label: "aplikasi rilis" }, { value: "4,8", label: "rating rata-rata" }, { value: "1,2 jt", label: "unduhan" }] },
      contact: { nav: "Kontak", kicker: "05 · Mulai proyek", title: "Ceritakan aplikasi impianmu.", body: "Sesi konsultasi pertama gratis, 45 menit, lewat video call." },
    }),
    contact: { email: "halo@studiosaku.id", whatsapp: "6281298765432", waText: "Halo Studio Saku, saya ingin membuat aplikasi." },
    footer: "© 2026 Studio Saku · Yogyakarta",
  },
  {
    id: "motion-lini-saas",
    title: "Lini · Kelola Proyek Tim",
    description: "Landing page SaaS dengan laptop 3D yang terbuka saat digulir, layar mengetik spesifikasi produk, lalu fitur dan angka pengguna muncul.",
    brand: "Lini",
    object: "laptop",
    font: { display: "Sora", text: "Inter", href: gf("family=Sora:wght@600;700&family=Inter:wght@400;500;600") },
    colors: { bg: "#06120e", bg2: "#0f3326", panel: "#0b1d17", ink: "#eafff5", inkSoft: "#9cc2b3", accent: "#3ddc97", accent2: "#f2c94c", line: "#1d3a30", obj: "#b8c2bf", obj2: "#2b3a35", dark: true },
    config: {
      komentar: "Lini: kelola proyek tanpa ribet",
      variabel: "lini",
      bahasa: "js",
      profil: { produk: "Lini", kategori: "Manajemen proyek", pengguna: "12 ribu tim", integrasi: ["Slack", "Drive", "WhatsApp"], uji_gratis: "14 hari", harga: "Mulai Rp49 rb/bulan" },
      layarTeks: "Semua tugas, satu lini.",
      layarSub: "lini.app",
    },
    berkas: "lini.config.js",
    chapters: chapters("laptop", {
      hero: { nav: "Beranda", kicker: "Aplikasi manajemen proyek", title: "Satu lini untuk semua kerja tim.", lead: "Tugas, tenggat, dan diskusi tim ada di satu tempat. Buka laptop, semua sudah rapi.", cta: ["Lihat fitur", "Coba gratis"] },
      code: { nav: "Produk", kicker: "01 · Spesifikasi", title: "Produk kami, dalam kode.", body: "Laptop terbuka, lalu spesifikasi Lini diketik baris demi baris." },
      text: { kicker: "02 · Kenapa Lini", title: "Kenapa Lini", line: "Tim yang hebat tidak butuh rapat lebih banyak. Mereka butuh satu tempat untuk melihat semuanya." },
      cards: {
        nav: "Fitur",
        kicker: "03 · Fitur",
        title: "Yang tim Anda dapatkan",
        items: [
          { tag: "Papan", title: "Kanban & linimasa", text: "Seret tugas antar kolom, lihat jadwal dalam satu klik." },
          { tag: "Otomatis", title: "Laporan mingguan", text: "Ringkasan progres terkirim sendiri setiap Jumat sore." },
          { tag: "Notifikasi", title: "Pengingat WhatsApp", text: "Tenggat dekat? Anggota tim diingatkan lewat WhatsApp." },
        ],
      },
      stats: { kicker: "04 · Hasil", title: "Dipercaya tim di seluruh Indonesia.", stats: [{ value: "12 rb", label: "tim aktif" }, { value: "37%", label: "rapat berkurang" }, { value: "4,9", label: "rating pengguna" }] },
      contact: { nav: "Kontak", kicker: "05 · Mulai", title: "Coba gratis 14 hari.", body: "Tanpa kartu kredit. Tim kami siap membantu memindahkan data dari aplikasi lama." },
    }),
    contact: { email: "halo@lini.app", whatsapp: "6281311122233", waText: "Halo Lini, saya ingin mencoba untuk tim saya." },
    footer: "© 2026 Lini · Kelola proyek tanpa ribet",
  },
  {
    id: "motion-lensa-nara",
    title: "Nara Wijaya · Fotografer",
    description: "Portofolio fotografer dengan kamera 3D: lensa memanjang saat digulir, biodata tampil sebagai kode Python, lalu lampu kilat berkedip di bagian cerita.",
    brand: "Nara Wijaya",
    object: "camera",
    font: { display: "Fraunces", text: "DM Sans", href: gf("family=Fraunces:opsz,wght@9..144,600;9..144,700&family=DM+Sans:wght@400;500;600") },
    colors: { bg: "#120d0a", bg2: "#3a2416", panel: "#1c1410", ink: "#fff4ea", inkSoft: "#c9b3a2", accent: "#ffb36b", accent2: "#e8546b", line: "#3a2b22", obj: "#1b1b1f", obj2: "#b9b6b0", dark: true },
    config: {
      komentar: "Nara Wijaya, fotografer",
      variabel: "nara",
      bahasa: "py",
      profil: { nama: "Nara Wijaya", spesialis: "Pernikahan & potret", kota: "Denpasar", lensa: ["35mm", "50mm", "85mm"], pengalaman: "8 tahun", jadwal: "Buka Jan–Jun 2027" },
      layarTeks: "Cahaya yang jujur.",
      layarSub: "narawijaya.id",
    },
    berkas: "nara.py",
    chapters: chapters("camera", {
      hero: { nav: "Beranda", kicker: "Fotografer pernikahan & potret", title: "Momen nyata, cahaya alami.", lead: "Saya Nara. Saya memotret pernikahan dan keluarga tanpa banyak arahan, supaya yang terekam benar-benar Anda.", cta: ["Lihat paket", "Cek jadwal"] },
      code: { nav: "Profil", kicker: "01 · Tentang saya", title: "Biodata dalam bahasa Python.", body: "Lensa memanjang, fokus ke saya sebentar." },
      text: { kicker: "02 · Pendekatan", title: "Pendekatan", line: "Foto terbaik jarang dipose. Ia muncul di antara tawa, pelukan, dan detik yang hampir terlewat." },
      cards: {
        nav: "Paket",
        kicker: "03 · Paket",
        title: "Pilih cerita Anda",
        items: [
          { tag: "Mulai 4 jt", title: "Prewedding", text: "Sesi 3 jam di dua lokasi, 60 foto hasil edit." },
          { tag: "Mulai 9 jt", title: "Pernikahan", text: "Liputan penuh akad dan resepsi, album cetak 30 halaman." },
          { tag: "Mulai 2 jt", title: "Potret keluarga", text: "Sesi santai di rumah atau taman, 30 foto hasil edit." },
        ],
      },
      stats: { kicker: "04 · Perjalanan", title: "Delapan tahun memotret.", stats: [{ value: "320", label: "sesi foto" }, { value: "8", label: "tahun" }, { value: "14", label: "kota" }] },
      contact: { nav: "Kontak", kicker: "05 · Pesan jadwal", title: "Tanggal Anda masih kosong?", body: "Kirim tanggal dan lokasi acara. Saya balas dengan ketersediaan dan penawaran." },
    }),
    contact: { email: "halo@narawijaya.id", whatsapp: "6281933344455", waText: "Halo Nara, saya ingin cek jadwal pemotretan." },
    footer: "© 2026 Nara Wijaya · Denpasar, Bali",
  },
  {
    id: "motion-nada-laras",
    title: "Laras Sora · Produser Musik",
    description: "Portofolio produser musik dengan piringan hitam 3D: piringan berputar dan jarum turun saat digulir, biodata tampil sebagai JSON, gelombang suara mengalir.",
    brand: "Laras Sora",
    object: "vinyl",
    font: { display: "Syne", text: "Manrope", href: gf("family=Syne:wght@600;800&family=Manrope:wght@400;500;600") },
    colors: { bg: "#0d0718", bg2: "#33104a", panel: "#170d26", ink: "#fbefff", inkSoft: "#bfa9d6", accent: "#ff4fd8", accent2: "#42e8ff", line: "#2e1f44", obj: "#2a1d3a", obj2: "#d8d4e0", dark: true },
    config: {
      komentar: "",
      variabel: "laras",
      bahasa: "json",
      profil: { nama: "Laras Sora", peran: "Produser musik", genre: ["Pop", "R&B", "Lo-fi"], rilisan: 42, studio: "Jakarta Selatan", kolaborasi: true },
      layarTeks: "Putar lebih keras.",
      layarSub: "larassora.id",
    },
    berkas: "laras.json",
    chapters: chapters("vinyl", {
      hero: { nav: "Beranda", kicker: "Produser · Penulis lagu", title: "Suara yang membekas.", lead: "Saya Laras. Saya memproduseri lagu pop dan R&B untuk musisi independen, dari demo kamar sampai rilis di semua platform.", cta: ["Dengar karya", "Kerja sama"] },
      code: { nav: "Profil", kicker: "01 · Tentang saya", title: "Biodata, format JSON.", body: "Jarum turun, piringan berputar, dan data saya mulai diputar." },
      text: { kicker: "02 · Filosofi", title: "Filosofi", line: "Lagu yang baik tidak perlu berteriak. Ia cukup jujur, lalu pendengar yang membesarkan suaranya." },
      cards: {
        nav: "Layanan",
        kicker: "03 · Layanan",
        title: "Yang bisa kita buat",
        items: [
          { tag: "Produksi", title: "Produksi lagu", text: "Aransemen, rekaman, dan produksi penuh dari demo Anda." },
          { tag: "Audio", title: "Mixing & mastering", text: "Siap rilis di Spotify, Apple Music, dan radio." },
          { tag: "Brand", title: "Musik iklan", text: "Jingle dan musik latar untuk iklan dan konten digital." },
        ],
      },
      stats: { kicker: "04 · Diskografi", title: "Lima tahun di studio.", stats: [{ value: "42", label: "rilisan" }, { value: "18 jt", label: "kali diputar" }, { value: "9", label: "nominasi" }] },
      contact: { nav: "Kontak", kicker: "05 · Kontak", title: "Ada lagu yang menunggu?", body: "Kirim demo atau referensi lagu. Saya dengarkan semuanya." },
    }),
    contact: { email: "studio@larassora.id", whatsapp: "6285711122233", waText: "Halo Laras, saya ingin kerja sama produksi lagu." },
    footer: "© 2026 Laras Sora · Jakarta",
  },
  {
    id: "motion-parfum-senja",
    title: "Senja Atelier · Parfum Lokal",
    description: "Website brand parfum dengan botol 3D: tutup terangkat dan kabut menyemprot saat digulir, komposisi aroma tampil sebagai JSON, bahan-bahan mengorbit botol.",
    brand: "Senja Atelier",
    object: "perfume",
    font: { display: "Cormorant Garamond", text: "Jost", href: gf("family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600") },
    colors: { bg: "#fbf3ea", bg2: "#f3d8c4", panel: "#fffaf5", ink: "#2b1d17", inkSoft: "#7a6257", accent: "#d9825b", accent2: "#b9467a", line: "#ead8c9", obj: "#f6d9c4", obj2: "#c9a46a", dark: false },
    config: {
      komentar: "",
      variabel: "senja",
      bahasa: "json",
      profil: { nama: "Senja No. 7", keluarga: "Amber floral", nada_atas: ["Bergamot", "Jeruk nipis"], nada_tengah: ["Melati", "Mawar"], nada_dasar: ["Vanila", "Cendana"], volume: "50 ml" },
      layarTeks: "Wangi jam lima sore.",
      layarSub: "senjaatelier.id",
    },
    berkas: "senja-no7.json",
    chapters: chapters("perfume", {
      hero: { nav: "Beranda", kicker: "Parfum lokal · Diracik tangan", title: "Wangi jam lima sore.", lead: "Senja Atelier meracik parfum dari bahan Nusantara dalam jumlah kecil, supaya setiap botol terasa personal.", cta: ["Lihat koleksi", "Pesan sekarang"] },
      code: { nav: "Komposisi", kicker: "01 · Komposisi", title: "Resep aroma, terbuka.", body: "Tutup terangkat. Inilah isi Senja No. 7, nada demi nada." },
      text: { kicker: "02 · Cerita", title: "Cerita kami", line: "Kami percaya wangi adalah kenangan yang bisa dibawa pulang, dan setiap botol harus punya ceritanya sendiri." },
      cards: {
        nav: "Koleksi",
        kicker: "03 · Koleksi",
        title: "Tiga waktu, tiga aroma",
        items: [
          { tag: "Rp389 rb", title: "Senja No. 7", text: "Amber floral yang hangat: melati, vanila, dan cendana." },
          { tag: "Rp349 rb", title: "Pagi No. 3", text: "Segar dan bersih: jeruk nipis, teh hijau, dan musk." },
          { tag: "Rp369 rb", title: "Hujan No. 1", text: "Tanah basah dan daun pandan setelah hujan pertama." },
        ],
      },
      stats: { kicker: "04 · Kualitas", title: "Dibuat pelan-pelan.", stats: [{ value: "12 jam", label: "ketahanan" }, { value: "100%", label: "bahan lokal" }, { value: "3", label: "aroma khas" }] },
      contact: { nav: "Kontak", kicker: "05 · Pesan", title: "Temukan wangimu.", body: "Pesan lewat WhatsApp atau minta paket sampel tiga aroma untuk dicoba di rumah." },
    }),
    contact: { email: "halo@senjaatelier.id", whatsapp: "6281244455566", waText: "Halo Senja Atelier, saya ingin memesan parfum." },
    footer: "© 2026 Senja Atelier · Bandung",
  },
  {
    id: "motion-roket-orbit",
    title: "Orbit Labs · Akselerator Startup",
    description: "Website akselerator startup dengan roket 3D: mesin menyala dan roket naik saat digulir, profil program tampil sebagai kode, planet bercincin muncul di tengah cerita.",
    brand: "Orbit Labs",
    object: "rocket",
    font: { display: "Unbounded", text: "Inter", href: gf("family=Unbounded:wght@500;700&family=Inter:wght@400;500;600") },
    colors: { bg: "#050816", bg2: "#1a1446", panel: "#0c1028", ink: "#f2f4ff", inkSoft: "#a7aed0", accent: "#ff6b3d", accent2: "#ffd166", line: "#222849", obj: "#eef0f6", obj2: "#8d93a8", dark: true },
    config: {
      komentar: "Orbit Labs: dari ide ke orbit",
      variabel: "orbit",
      bahasa: "js",
      profil: { nama: "Orbit Labs", jenis: "Akselerator startup", kota: "Jakarta", angkatan: 7, fokus: ["AI", "Fintech", "Agritech"], pendaftaran: "Dibuka" },
      layarTeks: "Siap meluncur.",
      layarSub: "orbitlabs.id",
    },
    berkas: "orbit.js",
    chapters: chapters("rocket", {
      hero: { nav: "Beranda", kicker: "Akselerator startup · Angkatan 7", title: "Dari ide ke orbit.", lead: "Program 12 minggu untuk startup tahap awal: mentor, pendanaan awal, dan jaringan investor dalam satu peluncuran.", cta: ["Lihat program", "Daftar sekarang"] },
      code: { nav: "Profil", kicker: "01 · Profil", title: "Data peluncuran.", body: "Mesin menyala. Profil Orbit Labs diketik sebelum lepas landas." },
      text: { kicker: "02 · Misi", title: "Misi kami", line: "Startup hebat tidak lahir sendirian. Mereka butuh landasan yang kuat dan teman untuk melewati gravitasi pertama." },
      cards: {
        nav: "Program",
        kicker: "03 · Program",
        title: "Bahan bakar 12 minggu",
        items: [
          { tag: "Mentor", title: "Mentor ahli", text: "Sesi mingguan dengan pendiri dan eksekutif berpengalaman." },
          { tag: "Dana", title: "Pendanaan awal", text: "Hingga Rp1,5 miliar untuk startup terpilih." },
          { tag: "Demo", title: "Demo Day", text: "Presentasi di depan 80 investor di minggu terakhir." },
        ],
      },
      stats: { kicker: "04 · Jejak", title: "Tujuh angkatan meluncur.", stats: [{ value: "64", label: "startup lulus" }, { value: "7", label: "angkatan" }, { value: "120", label: "mentor" }] },
      contact: { nav: "Daftar", kicker: "05 · Pendaftaran", title: "Siap meluncur bersama kami?", body: "Pendaftaran angkatan 8 dibuka sampai 30 Januari 2027. Ceritakan startup Anda." },
    }),
    contact: { email: "halo@orbitlabs.id", whatsapp: "6281377788899", waText: "Halo Orbit Labs, saya ingin mendaftarkan startup saya." },
    footer: "© 2026 Orbit Labs · Jakarta",
  },
  {
    id: "motion-buku-aksara",
    title: "Sekar Aksara · Penulis",
    description: "Portofolio penulis dengan buku 3D: sampul terbuka saat digulir, halaman kanan menuliskan biodata sebagai kode, lalu halaman-halaman membalik di bagian cerita.",
    brand: "Sekar Aksara",
    object: "book",
    font: { display: "Fraunces", text: "Newsreader", href: gf("family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Newsreader:opsz,wght@6..72,400;6..72,500") },
    colors: { bg: "#f2ece1", bg2: "#e6d6bb", panel: "#fbf7ef", ink: "#2a2420", inkSoft: "#6d6255", accent: "#a4442b", accent2: "#2f6f62", line: "#ddd1bd", obj: "#2f4f4a", obj2: "#d9b56a", dark: false },
    config: {
      komentar: "Sekar Aksara, penulis",
      variabel: "sekar",
      bahasa: "py",
      profil: { nama: "Sekar Aksara", profesi: "Penulis fiksi", kota: "Malang", buku: 5, terbaru: "Peta Rindu (2026)", genre: ["Sastra", "Esai"] },
      layarTeks: "Setiap halaman punya rumah.",
      layarSub: "Sekar Aksara",
    },
    berkas: "sekar.py",
    chapters: chapters("book", {
      hero: { nav: "Beranda", kicker: "Penulis · Malang", title: "Cerita yang pulang.", lead: "Saya Sekar. Saya menulis novel dan esai tentang rumah, perantauan, dan hal-hal kecil yang sering kita lupakan.", cta: ["Lihat buku", "Undang saya"] },
      code: { nav: "Profil", kicker: "01 · Tentang saya", title: "Biodata di halaman pertama.", body: "Sampul terbuka, dan halaman kanan mulai ditulis." },
      text: { kicker: "02 · Tentang menulis", title: "Tentang menulis", line: "Saya menulis supaya kenangan tidak hilang, dan supaya pembaca tahu bahwa mereka tidak sendirian." },
      cards: {
        nav: "Buku",
        kicker: "03 · Buku",
        title: "Karya terbit",
        items: [
          { tag: "2026", title: "Peta Rindu", text: "Novel tentang tiga saudara yang pulang ke kampung halaman." },
          { tag: "2024", title: "Rumah Kaca Senja", text: "Kumpulan cerpen tentang keluarga dan perantauan." },
          { tag: "2022", title: "Catatan dari Dapur", text: "Esai tentang makanan, ibu, dan ingatan." },
        ],
      },
      stats: { kicker: "04 · Perjalanan", title: "Sepuluh tahun menulis.", stats: [{ value: "5", label: "buku terbit" }, { value: "40 rb", label: "eksemplar" }, { value: "26", label: "kota tur" }] },
      contact: { nav: "Kontak", kicker: "05 · Undangan", title: "Undang saya bercerita.", body: "Untuk diskusi buku, kelas menulis, atau kerja sama penerbitan, hubungi saya di sini." },
    }),
    contact: { email: "surat@sekaraksara.id", whatsapp: "6281555566677", waText: "Halo Sekar, saya ingin mengundang Anda untuk acara buku." },
    footer: "© 2026 Sekar Aksara · Malang",
  },
];
