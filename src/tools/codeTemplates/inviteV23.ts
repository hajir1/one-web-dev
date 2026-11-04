import type { InviteSpec } from "./invite";
import { C4, DECO_CSS, ISLAM, NADA_A, NADA_B, NADA_C, NADA_D, OPEN_BASE, RSVP_NIKAH, cfg, deco, type Opening } from "./inviteV22";

/* ================================================================== */
/* 5 new invitations (v23). The engine and features are the same as the v22 invitations: */
/* a transparent cover, cover pieces (.op) that move when the button    */
/* "Buka Undangan" is pressed. Five new opening animations: folding fan, */
/* ring box, torn ticket, parted canopy, and zipper.                    */
/* Every animation finishes under 900 ms (the cover is hidden after     */
/* that). All names, addresses, numbers, and bank accounts are fictional. */
/* ================================================================== */

/** Folding fan: the cover splits into 9 slats that fold to one point below, then drop. */
const KIPAS: Opening = (() => {
  const n = 9;
  const blades = Array.from({ length: n }, (_, i) => {
    const a = ((i - (n - 1) / 2) * 6).toFixed(1);
    return `<i style="--l:${((i * 100) / n).toFixed(3)}%;--a:${a}deg;--d:${(Math.abs(i - (n - 1) / 2) * 0.03).toFixed(2)}s"></i>`;
  }).join("");
  return {
    html: `<div class="op fan" aria-hidden="true">${blades}</div>`,
    css: `
.fan { inset: 0; background: none; transition: transform .35s cubic-bezier(.6,0,.4,1) .45s, opacity .3s ease .5s; }
.fan i { position: absolute; top: 0; bottom: 0; left: var(--l); width: calc(100% / ${n} + 1px); transform-origin: 50% 120%; background: linear-gradient(90deg, color-mix(in srgb, var(--cover-bg) 92%, #000), var(--cover-bg) 30%, color-mix(in srgb, var(--cover-bg) 88%, #fff) 50%, var(--cover-bg) 70%, color-mix(in srgb, var(--cover-bg) 92%, #000)); border-right: 1px solid color-mix(in srgb, var(--accent) 35%, transparent); transition: left .45s cubic-bezier(.6,0,.3,1) var(--d), transform .45s cubic-bezier(.6,0,.3,1) var(--d), width .45s cubic-bezier(.6,0,.3,1) var(--d); }
.fan i::after { content: ""; position: absolute; left: 50%; top: 12%; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--accent); opacity: .7; }
.cover.open .fan i { left: calc(50% - 4vw); width: 8vw; transform: rotate(var(--a)) scaleY(.45); }
.cover.open .fan { transform: translateY(80vh); opacity: 0; }
`,
  };
})();

/** Ring box: the hinged velvet lid lifts up, the box base drops, the ring sparkles briefly. */
const KOTAK_CINCIN: Opening = {
  html: `<div class="op rb-base" aria-hidden="true"><i class="rb-slot"></i></div><div class="op rb-lid" aria-hidden="true"><i class="rb-satin"></i></div><b class="rb-shine" aria-hidden="true"></b>`,
  css: `
.rb-base { left: 0; right: 0; bottom: 0; top: 50%; background: radial-gradient(120% 90% at 50% 0%, color-mix(in srgb, var(--cover-bg) 82%, #fff), var(--cover-bg) 55%, color-mix(in srgb, var(--cover-bg) 80%, #000)); transition: transform .45s cubic-bezier(.6,0,.4,1) .4s; }
.rb-slot { position: absolute; left: 50%; top: 10%; width: 42%; max-width: 260px; height: 18px; transform: translateX(-50%); border-radius: 9px; background: color-mix(in srgb, var(--cover-bg) 70%, #000); box-shadow: inset 0 4px 8px rgba(0,0,0,.4); }
.rb-lid { left: 0; right: 0; top: 0; height: 50%; transform-origin: 50% 0; background: radial-gradient(120% 90% at 50% 100%, color-mix(in srgb, var(--cover-bg) 86%, #fff), var(--cover-bg) 60%, color-mix(in srgb, var(--cover-bg) 82%, #000)); border-bottom: 3px solid color-mix(in srgb, var(--accent) 70%, transparent); box-shadow: 0 8px 24px rgba(0,0,0,.25); transition: transform .5s cubic-bezier(.5,0,.3,1); backface-visibility: hidden; }
.rb-satin { position: absolute; inset: 14% 10% 10%; border-radius: 12px; background: linear-gradient(160deg, rgba(255,255,255,.18), transparent 40%, rgba(255,255,255,.08) 70%, transparent); }
.rb-shine { position: absolute; z-index: 0; left: 50%; top: 50%; width: 30vmin; height: 30vmin; margin: -15vmin 0 0 -15vmin; border-radius: 50%; background: radial-gradient(closest-side, #fff, color-mix(in srgb, var(--accent) 60%, transparent) 40%, transparent); opacity: 0; transform: scale(.2); pointer-events: none; }
.cover.open .rb-lid { transform: perspective(900px) rotateX(-96deg) translateY(-30%); }
.cover.open .rb-base { transform: translateY(110%); }
.cover.open .rb-shine { animation: rbShine .8s ease-out forwards; }
@keyframes rbShine { 30% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: scale(2.4); } }
`,
};

/** Torn ticket: a perforation line, the top part tears diagonally to the top left, the bottom part falls. */
const TIKET: Opening = (() => {
  const zig = Array.from({ length: 21 }, (_, i) => `${i * 5}% ${i % 2 ? 61 : 59}%`).join(", ");
  const zigR = Array.from({ length: 21 }, (_, i) => `${100 - i * 5}% ${(20 - i) % 2 ? 61 : 59}%`).join(", ");
  return {
    html: `<div class="op tk tk-top" aria-hidden="true"><i class="tk-stamp"></i></div><div class="op tk tk-bot" aria-hidden="true"><i class="tk-code"></i></div>`,
    css: `
.tk { inset: 0; background: linear-gradient(180deg, color-mix(in srgb, var(--cover-bg) 92%, #fff), var(--cover-bg)); }
.tk-top { clip-path: polygon(0 0, 100% 0, ${zigR}); transform-origin: 0 60%; transition: transform .6s cubic-bezier(.5,0,.4,1); }
.tk-bot { clip-path: polygon(${zig}, 100% 100%, 0 100%); transition: transform .5s cubic-bezier(.6,0,.4,1) .2s; }
.tk-top::after { content: ""; position: absolute; left: 0; right: 0; top: calc(60% - 2px); height: 0; border-top: 3px dotted color-mix(in srgb, var(--cover-ink) 45%, transparent); }
.tk-stamp { position: absolute; right: 7vw; top: 6vh; width: 92px; height: 92px; border-radius: 50%; border: 3px double var(--accent); opacity: .7; transform: rotate(-14deg); }
.tk-code { position: absolute; left: 50%; bottom: 6vh; width: min(70vw, 360px); height: 46px; transform: translateX(-50%); background: repeating-linear-gradient(90deg, var(--cover-ink) 0 2px, transparent 2px 5px, var(--cover-ink) 5px 6px, transparent 6px 10px); opacity: .45; }
.cover.open .tk-top { transform: translate(-30%, -70%) rotate(-24deg); }
.cover.open .tk-bot { transform: translateY(105%) rotate(4deg); }
.cover-inner { padding-bottom: 10vh; }
`,
  };
})();

/** Canopy: three layers of sheer fabric lift up in turn with wavy edges. */
const KELAMBU: Opening = {
  html: `<div class="op veil v1" aria-hidden="true"></div><div class="op veil v2" aria-hidden="true"></div><div class="op veil v3" aria-hidden="true"></div>`,
  css: `
.veil { left: -5%; right: -5%; top: 0; bottom: -40px; transform-origin: 50% 0; -webkit-mask: radial-gradient(28px 22px at 50% 100%, transparent 98%, #000) 0 0 / 56px 100%; mask: radial-gradient(28px 22px at 50% 100%, transparent 98%, #000) 0 0 / 56px 100%; }
.v1 { background: var(--cover-bg); transition: transform .55s cubic-bezier(.6,0,.3,1) .28s; }
.v2 { background: color-mix(in srgb, var(--cover-bg) 70%, #fff); opacity: .55; transition: transform .55s cubic-bezier(.6,0,.3,1) .14s; }
.v3 { background: repeating-linear-gradient(90deg, rgba(255,255,255,.18) 0 2px, transparent 2px 22px), color-mix(in srgb, var(--cover-bg) 60%, #fff); opacity: .4; transition: transform .55s cubic-bezier(.6,0,.3,1); }
.cover.open .veil { transform: translateY(-104%) scaleY(.6); }
`,
};

/** Zipper: zipper teeth in the middle, both sides of the cover open into a V from the top, then come off sideways. */
const RESLETING: Opening = {
  html: `<div class="op zp zp-l" aria-hidden="true"></div><div class="op zp zp-r" aria-hidden="true"></div><b class="op zp-pull" aria-hidden="true"></b>`,
  css: `
.zp { top: 0; bottom: 0; width: 50%; background: var(--cover-bg); transition: clip-path .5s cubic-bezier(.6,0,.4,1), transform .35s cubic-bezier(.6,0,.4,1) .45s; }
.zp-l { left: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); background: linear-gradient(90deg, var(--cover-bg) calc(100% - 14px), transparent calc(100% - 14px)), repeating-linear-gradient(180deg, var(--accent) 0 8px, transparent 8px 16px) right / 14px 100% no-repeat, var(--cover-bg); }
.zp-r { right: 0; clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); background: linear-gradient(90deg, transparent 14px, var(--cover-bg) 14px), repeating-linear-gradient(180deg, transparent 0 8px, var(--accent) 8px 16px) left / 14px 100% no-repeat, var(--cover-bg); }
.zp-pull { left: 50%; top: 2vh; width: 26px; height: 54px; margin-left: -13px; border-radius: 6px 6px 13px 13px; background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 70%, #000), var(--accent), color-mix(in srgb, var(--accent) 70%, #fff)); box-shadow: 0 6px 14px rgba(0,0,0,.3); transition: transform .5s cubic-bezier(.6,0,.4,1); }
.zp-pull::after { content: ""; position: absolute; left: 7px; top: 30px; width: 12px; height: 16px; border-radius: 6px; background: var(--cover-bg); }
.cover.open .zp-l { clip-path: polygon(0 0, 0 0, 100% 100%, 0 100%); transform: translateX(-102%); }
.cover.open .zp-r { clip-path: polygon(100% 0, 100% 0, 100% 100%, 0 100%); transform: translateX(102%); }
.cover.open .zp-pull { transform: translateY(100vh); }
.cover-inner { padding-top: 8vh; }
`,
};

const SPARK = `<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><g fill="currentColor"><path d="M50 4l6 34 34 6-34 6-6 34-6-34-34-6 34-6z"/><circle cx="84" cy="16" r="4"/><circle cx="18" cy="82" r="3"/></g></svg>`;

export const INVITE_SPECS_V23: InviteSpec[] = [
  {
    id: "undangan-nikah-kipas-peranakan",
    kind: "nikah",
    title: "Undangan Pernikahan Kevin & Mei Lin",
    description: "Undangan pernikahan bergaya peranakan merah dan emas: saat dibuka, sampul berupa bilah kipas yang melipat ke satu titik lalu turun, memperlihatkan undangan.",
    theme: "#8f1d24",
    fonts: { display: "Cormorant SC", script: "Imperial Script", text: "Mulish", href: "https://fonts.googleapis.com/css2?family=Cormorant+SC:wght@500;600&family=Imperial+Script&family=Mulish:wght@400;700&display=swap" },
    colors: { bg: "#fdf7f0", surface: "#f8eadc", ink: "#2e1a17", inkSoft: "#6e514a", primary: "#8f1d24", onPrimary: "#fff4dc", accent: "#d4a646", line: "#efdcc6", coverBg: "#a3222b", coverInk: "#fff1d0", ...C4("#c8323c", "#d4a646", "#f6e3c0", "#2f6b5e") },
    ornament: KIPAS.html + deco("spark", SPARK),
    css: OPEN_BASE + KIPAS.css + DECO_CSS + `
.spark { left: 50%; top: 6vh; width: 54px; margin-left: -27px; }
.cover-inner { padding: 26px 22px; border-radius: 22px; background: color-mix(in srgb, var(--cover-bg) 78%, transparent); }
.cover h1 { color: var(--accent); }
.title { font-family: var(--font-display); color: var(--primary); }
.account { background: linear-gradient(135deg, var(--primary), #4d0d12); }
`,
    config: cfg({
      id: "nikah-kevin-meilin", judul: "Pernikahan", namaSampul: "Kevin & Mei Lin", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: "Salam sejahtera untuk kita semua.", judulProfil: "Kedua Mempelai",
      pembuka: "Dengan penuh sukacita, kami mengundang Anda menjadi saksi hari bahagia kami:",
      tokoh: [
        { panggilan: "Kevin", nama: "Kevin Wijaya Tan", keterangan: "Putra Bapak Hendra Tan dan Ibu Lanny Gunawan" },
        { panggilan: "Mei Lin", nama: "Meilinda Kusuma", keterangan: "Putri Bapak Budi Kusuma dan Ibu Ratna Halim" },
      ],
      kutipan: { teks: "Kasih itu sabar, kasih itu murah hati. Ia menutupi segala sesuatu dan mengharapkan segala sesuatu.", sumber: "1 Korintus 13:4-7" },
      acara: [
        { nama: "Upacara Teh (Sangjit)", mulai: "2027-08-14T09:00:00+07:00", selesai: "2027-08-14T11:00:00+07:00", tempat: "Kediaman Keluarga Kusuma", alamat: "Jl. Gajah Mada No. 18, Semarang" },
        { nama: "Resepsi", mulai: "2027-08-14T18:30:00+07:00", selesai: "2027-08-14T21:30:00+07:00", tempat: "Ballroom Hotel Pandanaran", alamat: "Jl. Pandanaran No. 58, Semarang" },
      ],
      galeri: ["Pertemuan di Pasar Semawis", "Liburan ke Kota Lama", "Lamaran keluarga", "Foto pranikah", "Upacara teh"],
      ucapan: [["Ie Ie Ling", "Selamat menempuh hidup baru, semoga rukun sampai kakek nenek."], ["Teman kantor Kevin", "Bahagia selalu, Kevin dan Mei Lin!"]],
      amplop: { judul: "Angpao Digital", pengantar: "Doa restu Anda sudah sangat berarti. Bila ingin memberi angpao, dapat melalui:", rekening: [{ bank: "Bank BCA", nomor: "0081 2233 44", atasNama: "Kevin Wijaya Tan" }, { bank: "Bank OCBC", nomor: "6930 0012 3456", atasNama: "Meilinda Kusuma" }], alamatKado: "Jl. Gajah Mada No. 18, Semarang 50134" },
      wa: "6281200000201", namaAcara: "pernikahan Kevin & Mei Lin", pilihan: ["Hadir", "Belum pasti", "Tidak dapat hadir"],
      penutup: "Kehadiran dan doa Anda adalah kehormatan bagi kami sekeluarga.", salamPenutup: "", keluarga: "Keluarga Tan dan Keluarga Kusuma",
      nada: NADA_D, tempo: 580, konfeti: ["#c8323c", "#d4a646", "#fff1d0"],
    }),
  },
  {
    id: "undangan-lamaran-kotak-cincin",
    kind: "lamaran",
    title: "Undangan Lamaran Farhan & Salsa",
    description: "Undangan lamaran bernuansa beludru hijau zamrud dan emas: sampul berupa kotak cincin yang tutupnya terangkat, kilau cincin berpendar, lalu alas kotak turun.",
    theme: "#0f4d3f",
    fonts: { display: "Bodoni Moda", script: "Parisienne", text: "Karla", href: "https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@500;600&family=Parisienne&family=Karla:wght@400;700&display=swap" },
    colors: { bg: "#f8faf7", surface: "#e9f1ec", ink: "#16241f", inkSoft: "#4f625b", primary: "#0f4d3f", onPrimary: "#f8ecc8", accent: "#c9a24a", line: "#d8e5dd", coverBg: "#0f4d3f", coverInk: "#f8ecc8", ...C4("#1f7a63", "#c9a24a", "#f1e4bf", "#9fc8b6") },
    ornament: KOTAK_CINCIN.html,
    css: OPEN_BASE + KOTAK_CINCIN.css + `
.cover-inner { padding: 26px 22px; border-radius: 22px; background: color-mix(in srgb, var(--cover-bg) 72%, transparent); }
.cover h1 { color: var(--accent); font-weight: 500; }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 50%; }
`,
    config: cfg({
      id: "lamaran-farhan-salsa", judul: "Acara Lamaran", namaSampul: "Farhan & Salsa", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Yang Akan Melamar dan Dilamar",
      pembuka: "Dengan memohon ridha Allah SWT, kami bermaksud menyampaikan niat baik dalam acara lamaran:",
      tokoh: [
        { panggilan: "Farhan", nama: "Muhammad Farhan Hakim", keterangan: "Putra Bapak Lukman Hakim dan Ibu Siti Aminah" },
        { panggilan: "Salsa", nama: "Salsabila Az-Zahra", keterangan: "Putri Bapak Imam Syafii dan Ibu Nurul Huda" },
      ],
      kutipan: { teks: "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri.", sumber: "QS. Ar-Rum: 21" },
      acara: [{ nama: "Lamaran & Tukar Cincin", mulai: "2027-02-20T10:00:00+07:00", selesai: "2027-02-20T13:00:00+07:00", tempat: "Kediaman Bapak Imam Syafii", alamat: "Jl. Kaliurang Km 7 No. 12, Sleman, Yogyakarta" }],
      teks: { judulHitungMundur: "Menuju Hari Lamaran", judulGaleri: "Sebelum Cincin Ini" },
      galeri: ["Kenal di organisasi kampus", "Wisuda bersama", "Pertemuan keluarga", "Cincin yang dipilih berdua"],
      ucapan: [["Keluarga Pakde Harun", "Semoga lancar sampai hari akad, Nak."], ["Sahabat Salsa", "Ikut bahagia! Jangan lupa undang kami di akad nanti."]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah hadiah terindah. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BSI", nomor: "7123 4567 89", atasNama: "Muhammad Farhan Hakim" }], alamatKado: "" },
      wa: "6281200000202", namaAcara: "lamaran Farhan & Salsa", templat: RSVP_NIKAH,
      pengantarRsvp: "Acara lamaran bersifat terbatas untuk keluarga dan kerabat dekat. Mohon konfirmasi kehadiran.",
      penutup: "Atas doa dan kehadiran Bapak/Ibu/Saudara/i, kami ucapkan terima kasih.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Lukman Hakim dan Bapak Imam Syafii",
      nada: NADA_A, tempo: 560, konfeti: ["#c9a24a", "#1f7a63", "#f8ecc8"],
    }),
  },
  {
    id: "undangan-reuni-tiket-sobek",
    kind: "reuni",
    title: "Undangan Reuni Akbar SMA Harapan Angkatan 2007",
    description: "Undangan reuni bergaya tiket konser retro: saat dibuka, tiket tersobek di garis perforasi, potongan atas melayang ke pojok dan potongan bawah jatuh.",
    theme: "#1e2a5a",
    fonts: { display: "Bungee", script: "Permanent Marker", text: "IBM Plex Sans", href: "https://fonts.googleapis.com/css2?family=Bungee&family=Permanent+Marker&family=IBM+Plex+Sans:wght@400;600&display=swap" },
    colors: { bg: "#fbf7ef", surface: "#f2ead9", ink: "#1b1c2b", inkSoft: "#575a70", primary: "#1e2a5a", onPrimary: "#ffe8a3", accent: "#f2542d", line: "#e6dcc7", coverBg: "#ffd166", coverInk: "#1e2a5a", ...C4("#f2542d", "#1e2a5a", "#ffd166", "#0e9f8a") },
    ornament: TIKET.html,
    css: OPEN_BASE + TIKET.css + `
.cover h1 { font-family: var(--font-display); color: var(--primary); letter-spacing: .02em; }
.cover .btn { background: var(--accent); color: #fff; }
.guest { background: rgba(255,255,255,.55); border-color: rgba(30,42,90,.2); }
.title { font-family: var(--font-display); color: var(--primary); font-weight: 400; }
.avatar { border-radius: 14px; }
`,
    config: cfg({
      id: "reuni-sma-harapan-2007", judul: "Reuni Akbar 20 Tahun", namaSampul: "SMA Harapan '07", tamuBawaan: "Alumni Angkatan 2007", salam: "Halo, kawan lama!", judulProfil: "Panitia Reuni",
      pembuka: "Dua puluh tahun sejak lulus. Saatnya kumpul lagi, tukar cerita, dan foto bareng di lapangan basket:",
      tokoh: [
        { panggilan: "Ketua", nama: "Andika Pratama (XII IPA 2)", keterangan: "Ketua panitia, dulu ketua OSIS" },
        { panggilan: "Bendahara", nama: "Rina Marlina (XII IPS 1)", keterangan: "Penjaga kas, dulu juga bendahara kelas" },
      ],
      kutipan: { teks: "Kita boleh berpisah kelas, tapi tidak pernah berpisah kenangan.", sumber: "Buku tahunan 2007" },
      acara: [
        { nama: "Jalan Santai & Foto Angkatan", mulai: "2027-07-17T07:00:00+07:00", selesai: "2027-07-17T10:00:00+07:00", tempat: "Lapangan SMA Harapan", alamat: "Jl. Pemuda No. 21, Bekasi" },
        { nama: "Malam Reuni & Musik 2000-an", mulai: "2027-07-17T18:30:00+07:00", selesai: "2027-07-17T22:30:00+07:00", tempat: "Aula Grand Galaxy", alamat: "Jl. Boulevard Raya Blok A No. 2, Bekasi" },
      ],
      teks: { judulHitungMundur: "Reuni Dimulai Dalam", judulAcara: "Jadwal Acara", judulGaleri: "Arsip Angkatan", pengantarGaleri: "Foto lama yang berhasil kami kumpulkan.", judulUcapan: "Pesan untuk Teman Lama" },
      galeri: ["MOS 2004", "Pensi 2006", "Study tour Bali", "Foto kelulusan", "Reuni 10 tahun"],
      ucapan: [["Bowo XII IPA 1", "Siap hadir! Ada yang masih simpan foto pensi?"], ["Dewi XII IPS 3", "Kangen semua. Sampai ketemu di lapangan basket."]],
      amplop: { judul: "Iuran Reuni", pengantar: "Iuran Rp250.000 per orang untuk konsumsi, kaos, dan donasi beasiswa adik kelas:", rekening: [{ bank: "Bank BRI", nomor: "0345 0100 2233 501", atasNama: "Rina Marlina" }], alamatKado: "" },
      wa: "6281200000203", namaAcara: "reuni akbar SMA Harapan 2007", pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
      templat: "Halo panitia, saya {nama} ingin konfirmasi untuk {acara}: {hadir}, bawa {jumlah} orang. Sampai jumpa!",
      pengantarRsvp: "Konfirmasi paling lambat 1 Juli supaya ukuran kaos dan konsumsi bisa disiapkan.",
      penutup: "Tiket sudah disobek. Tidak ada alasan untuk tidak datang.", salamPenutup: "", keluarga: "Panitia Reuni Angkatan 2007",
      nada: NADA_C, tempo: 420, konfeti: ["#f2542d", "#ffd166", "#0e9f8a"],
    }),
  },
  {
    id: "undangan-tujuh-bulan-kelambu",
    kind: "tujuhbulan",
    title: "Undangan Tujuh Bulanan Mitoni Sekar",
    description: "Undangan tujuh bulanan (mitoni) bernuansa hijau daun pisang dan krem: tiga lapis kelambu tipis tersingkap ke atas bergantian saat undangan dibuka.",
    theme: "#4f6b3a",
    fonts: { display: "Marcellus", script: "Dancing Script", text: "Nunito Sans", href: "https://fonts.googleapis.com/css2?family=Marcellus&family=Dancing+Script:wght@600&family=Nunito+Sans:wght@400;700&display=swap" },
    colors: { bg: "#fbfaf4", surface: "#eef1e3", ink: "#25301c", inkSoft: "#5c6852", primary: "#4f6b3a", onPrimary: "#fffbea", accent: "#c79a4a", line: "#e1e6d2", coverBg: "#8aa66c", coverInk: "#fffdf2", ...C4("#8aa66c", "#c79a4a", "#f3ecd2", "#e8a3a0") },
    ornament: KELAMBU.html,
    css: OPEN_BASE + KELAMBU.css + `
.cover h1 { font-family: var(--font-script); font-weight: 600; }
.cover .btn { background: var(--primary); color: var(--on-primary); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 50% 50% 20px 20px; }
`,
    config: cfg({
      id: "mitoni-sekar", judul: "Tujuh Bulanan", namaSampul: "Mitoni Sekar", tamuBawaan: "Bapak/Ibu/Saudara/i", salam: ISLAM.salam, judulProfil: "Calon Ayah dan Ibu",
      pembuka: "Alhamdulillah, kandungan putri kami telah memasuki usia tujuh bulan. Kami mengundang Anda dalam doa bersama:",
      tokoh: [
        { panggilan: "Sekar", nama: "Sekar Ayuningtyas", keterangan: "Calon ibu, putri Bapak Haryono dan Ibu Sri Lestari" },
        { panggilan: "Adit", nama: "Aditya Wicaksono", keterangan: "Calon ayah, putra Bapak Bambang dan Ibu Murni" },
      ],
      kutipan: { teks: "Ya Allah, jadikanlah anak dalam kandungan ini anak yang saleh, sehat, dan menjadi penyejuk mata.", sumber: "Doa orang tua" },
      acara: [
        { nama: "Pengajian & Doa Bersama", mulai: "2027-03-06T09:00:00+07:00", selesai: "2027-03-06T10:30:00+07:00", tempat: "Kediaman Bapak Haryono", alamat: "Jl. Kenari No. 15, Kotagede, Yogyakarta" },
        { nama: "Siraman Mitoni", mulai: "2027-03-06T10:30:00+07:00", selesai: "2027-03-06T12:00:00+07:00", tempat: "Pendopo rumah", alamat: "Jl. Kenari No. 15, Kotagede, Yogyakarta" },
      ],
      teks: { judulHitungMundur: "Menuju Hari Doa Bersama", judulGaleri: "Menanti Buah Hati", pengantarGaleri: "Bulan demi bulan bersama si kecil." },
      galeri: ["Kabar bahagia", "Bulan keempat", "Kain tujuh motif", "Kamar si kecil"],
      ucapan: [["Bude Warsini", "Semoga ibu dan bayi sehat, lancar sampai lahiran."], ["Teman kantor Sekar", "Sehat-sehat ya calon mama!"]],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah hadiah terbaik untuk si kecil. Bila ingin memberi tanda kasih:", rekening: [{ bank: "Bank BRI", nomor: "0029 0110 9988 507", atasNama: "Sekar Ayuningtyas" }], alamatKado: "Jl. Kenari No. 15, Kotagede, Yogyakarta 55172" },
      wa: "6281200000204", namaAcara: "tujuh bulanan Sekar & Adit", templat: RSVP_NIKAH,
      penutup: "Terima kasih atas doa dan kehadiran Anda untuk keluarga kecil kami.", salamPenutup: ISLAM.tutup, keluarga: "Keluarga Bapak Haryono dan Bapak Bambang",
      nada: NADA_B, tempo: 560, konfeti: ["#8aa66c", "#c79a4a", "#e8a3a0"],
    }),
  },
  {
    id: "undangan-ultah-17-resleting",
    kind: "ultah",
    title: "Undangan Sweet Seventeen Kayla",
    description: "Undangan ulang tahun ke-17 bergaya jaket denim dan neon: saat dibuka, resleting di tengah sampul tertarik turun dan kedua sisi sampul terbuka ke samping.",
    theme: "#24356b",
    fonts: { display: "Righteous", script: "Pacifico", text: "Poppins", href: "https://fonts.googleapis.com/css2?family=Righteous&family=Pacifico&family=Poppins:wght@400;600&display=swap" },
    colors: { bg: "#f7f8fd", surface: "#eceffb", ink: "#1a1f36", inkSoft: "#555c7a", primary: "#3048a0", onPrimary: "#ffffff", accent: "#ff5fa2", line: "#dde1f2", coverBg: "#3d5aa8", coverInk: "#ffffff", ...C4("#ff5fa2", "#ffd23f", "#7ee0ff", "#3048a0") },
    ornament: RESLETING.html + deco("spark", SPARK),
    css: OPEN_BASE + RESLETING.css + DECO_CSS + `
.spark { right: 8vw; top: 12vh; width: 46px; color: #ffd23f; }
.cover-inner { padding: 26px 22px; border-radius: 24px; background: color-mix(in srgb, var(--cover-bg) 80%, transparent); }
.cover h1 { font-family: var(--font-script); font-weight: 400; color: #fff; text-shadow: 0 0 18px color-mix(in srgb, var(--accent) 70%, transparent); }
.cover .btn { background: var(--accent); color: #fff; }
.title { font-family: var(--font-display); color: var(--primary); font-weight: 400; }
.avatar { border-radius: 24px; }
`,
    config: cfg({
      id: "ultah-kayla-17", judul: "Sweet Seventeen", namaSampul: "Kayla", tamuBawaan: "Bestie", salam: "Halo, bestie!", judulProfil: "Yang Berulang Tahun",
      pembuka: "Akhirnya tujuh belas! Datang ya ke pesta kecil-kecilan bertema denim dan neon:",
      tokoh: [{ panggilan: "Kayla", nama: "Kayla Putri Ramadhani", keterangan: "Kelas XI, anak band, pecinta boba" }],
      kutipan: { teks: "Tujuh belas cuma sekali. Ayo bikin kenangan yang bisa diceritakan sampai tua.", sumber: "Kayla" },
      acara: [{ nama: "Pesta Ulang Tahun", mulai: "2027-10-09T16:00:00+07:00", selesai: "2027-10-09T20:00:00+07:00", tempat: "Rooftop Kafe Lantai Atas", alamat: "Jl. Raya Darmo Permai III No. 9, Surabaya" }],
      teks: { judulHitungMundur: "Pesta Dimulai Dalam", judulAcara: "Detail Pesta", pengantarAcara: "Dress code: denim dan aksesori neon.", judulGaleri: "16 Tahun dalam Foto", judulUcapan: "Ucapan untuk Kayla" },
      galeri: ["Ultah ke-5", "Masuk SMP", "Manggung pertama", "Liburan ke Malang", "Teman-teman band"],
      ucapan: [["Nadia", "Happy sweet seventeen, Kay! Ditunggu kue ulang tahunnya."], ["Om Ricky", "Selamat ulang tahun, Kayla. Makin rajin belajar ya."]],
      amplop: { judul: "Kado Digital", pengantar: "Kehadiranmu sudah jadi kado. Kalau tetap mau kasih kado:", rekening: [{ bank: "GoPay", nomor: "0812 0000 0205", atasNama: "Kayla Putri R." }], alamatKado: "" },
      wa: "6281200000205", namaAcara: "sweet seventeen Kayla", pilihan: ["Aku datang!", "Belum pasti", "Maaf, tidak bisa"],
      templat: "Hai Kayla, aku {nama} mau konfirmasi untuk {acara}: {hadir}, datang {jumlah} orang.",
      penutup: "Jangan lupa pakai denim. Sampai ketemu di rooftop!", salamPenutup: "", keluarga: "Kayla & keluarga",
      nada: NADA_C, tempo: 400, konfeti: ["#ff5fa2", "#ffd23f", "#7ee0ff"],
    }),
  },
];
