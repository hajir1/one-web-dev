import type { InviteSpec } from "./invite";

/* ================================================================== */
/* 7 undangan baru (v18). Mesin, fitur, dan penanda edit sama dengan    */
/* undangan lain (AOS, Swiper, konfeti, ?to=, .ics, RSVP WhatsApp).     */
/* Semua nama, alamat, nomor, dan rekening fiktif.                     */
/* ================================================================== */

const C4 = (c1: string, c2: string, c3: string, c4: string) => ({ c1, c2, c3, c4 });

/* ------------------------------ ornamen ---------------------------- */

const GUNUNGAN = `<svg viewBox="0 0 200 260" aria-hidden="true" focusable="false"><path d="M100 6C70 50 34 92 22 150c-8 40 6 74 26 92h104c20-18 34-52 26-92C166 92 130 50 100 6Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="2.5"/><path d="M100 30c-20 34-46 66-54 112-5 28 3 54 18 70h72c15-16 23-42 18-70-8-46-34-78-54-112Z" fill="none" stroke="currentColor" stroke-opacity=".7" stroke-width="1.4"/><path d="M100 60v170M100 100c-16 10-30 26-36 46M100 100c16 10 30 26 36 46M100 140c-12 8-22 20-26 34M100 140c12 8 22 20 26 34" fill="none" stroke="currentColor" stroke-width="1.6"/><g fill="currentColor"><circle cx="100" cy="56" r="5"/><path d="M80 214h40v28H80Z" fill-opacity=".5"/><path d="M70 242h60v8H70Z"/></g></svg>`;

const MONOGRAM = `<svg viewBox="0 0 200 200" aria-hidden="true" focusable="false"><circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width=".8"/><path d="M100 8v14M100 178v14M8 100h14M178 100h14" stroke="currentColor" stroke-width="1.2"/></svg>`;

const WREATH = `<svg viewBox="0 0 240 240" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M120 222C56 214 22 170 22 116 22 70 50 36 86 22"/><path d="M120 222c64-8 98-52 98-106 0-46-28-80-64-94"/></g><g fill="currentColor" fill-opacity=".55"><path d="M40 170c-14-4-22-14-22-28 14 2 22 12 22 28Z"/><path d="M30 120c-12-8-16-20-12-32 12 6 16 18 12 32Z"/><path d="M44 74c-8-12-8-24 0-34 8 10 8 22 0 34Z"/><path d="M200 170c14-4 22-14 22-28-14 2-22 12-22 28Z"/><path d="M210 120c12-8 16-20 12-32-12 6-16 18-12 32Z"/><path d="M196 74c8-12 8-24 0-34-8 10-8 22 0 34Z"/></g><g fill="currentColor"><circle cx="70" cy="200" r="5"/><circle cx="170" cy="200" r="5"/><circle cx="120" cy="222" r="6"/></g></svg>`;

const SPARKLE17 = `<svg viewBox="0 0 260 200" aria-hidden="true" focusable="false"><text x="130" y="140" text-anchor="middle" font-family="var(--font-display)" font-size="150" font-weight="700" fill="none" stroke="currentColor" stroke-width="3">17</text><g fill="currentColor"><path d="M30 40l5 13 13 5-13 5-5 13-5-13-13-5 13-5Z"/><path d="M226 30l4 10 10 4-10 4-4 10-4-10-10-4 10-4Z"/><path d="M220 160l3 8 8 3-8 3-3 8-3-8-8-3 8-3Z"/><circle cx="56" cy="168" r="4"/><circle cx="200" cy="96" r="3"/></g></svg>`;

const HOUSE = `<svg viewBox="0 0 240 200" aria-hidden="true" focusable="false"><path d="M30 96 120 22l90 74" fill="none" stroke="currentColor" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/><path d="M50 84v100h140V84" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="3"/><path d="M104 184v-52h32v52" fill="currentColor" fill-opacity=".35" stroke="currentColor" stroke-width="3"/><rect x="66" y="104" width="26" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><rect x="148" y="104" width="26" height="24" rx="3" fill="none" stroke="currentColor" stroke-width="3"/><path d="M160 46V26h16v34" fill="none" stroke="currentColor" stroke-width="3"/><g fill="currentColor" fill-opacity=".7"><circle cx="20" cy="184" r="10"/><circle cx="34" cy="176" r="12"/><circle cx="220" cy="184" r="10"/><circle cx="206" cy="176" r="12"/></g></svg>`;

const BLOOM = `<svg viewBox="0 0 240 200" aria-hidden="true" focusable="false"><g fill="currentColor"><g fill-opacity=".35"><ellipse cx="120" cy="58" rx="16" ry="30"/><ellipse cx="120" cy="58" rx="16" ry="30" transform="rotate(72 120 88)"/><ellipse cx="120" cy="58" rx="16" ry="30" transform="rotate(144 120 88)"/><ellipse cx="120" cy="58" rx="16" ry="30" transform="rotate(216 120 88)"/><ellipse cx="120" cy="58" rx="16" ry="30" transform="rotate(288 120 88)"/></g><circle cx="120" cy="88" r="12"/></g><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M120 120v70M120 160c-20-4-34-16-40-34M120 150c18-6 30-18 34-34"/></g><g fill="currentColor" fill-opacity=".6"><circle cx="40" cy="60" r="6"/><circle cx="200" cy="48" r="5"/><circle cx="210" cy="150" r="4"/><circle cx="34" cy="150" r="4"/></g></svg>`;

const CASSETTE = `<svg viewBox="0 0 240 160" aria-hidden="true" focusable="false"><rect x="10" y="10" width="220" height="140" rx="14" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="4"/><rect x="34" y="30" width="172" height="62" rx="8" fill="none" stroke="currentColor" stroke-width="3"/><circle cx="80" cy="61" r="16" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="160" cy="61" r="16" fill="none" stroke="currentColor" stroke-width="4"/><path d="M96 61h48" stroke="currentColor" stroke-width="3"/><path d="M60 150l12-30h96l12 30" fill="none" stroke="currentColor" stroke-width="3"/><g fill="currentColor"><circle cx="90" cy="134" r="5"/><circle cx="150" cy="134" r="5"/></g></svg>`;

/* --------------------------- bagian bersama ------------------------ */

const RSVP_PILIHAN = ["Hadir", "Belum dapat memastikan", "Mohon maaf, tidak dapat hadir"];

export const INVITE_SPECS_V18: InviteSpec[] = [
  {
    id: "undangan-nikah-jawa-sekar-arum",
    kind: "nikah",
    title: "Undangan Pernikahan Adat Jawa Sekar & Arum",
    description: "Undangan pernikahan adat Jawa bernuansa cokelat sogan dan emas: gunungan di sampul, motif kawung, profil mempelai, siraman sampai resepsi, galeri, amplop digital, RSVP WhatsApp, dan gamelan sederhana.",
    theme: "#3b2416",
    fonts: { display: "Cinzel", script: "Great Vibes", text: "Crimson Pro", href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600&family=Great+Vibes&family=Crimson+Pro:wght@400;600&display=swap" },
    colors: { bg: "#fbf6ec", surface: "#f3e8d4", ink: "#3b2416", inkSoft: "#6e5440", primary: "#7a4a24", onPrimary: "#fff8ec", accent: "#c79a3b", line: "#e7d6b8", coverBg: "#3b2416", coverInk: "#f6e7c8", ...C4("#c79a3b", "#7a4a24", "#e9cf94", "#a7653a") },
    ornament: `<div class="kawung" aria-hidden="true"></div><div class="gunungan">${GUNUNGAN}</div>`,
    css: `
.cover { background: radial-gradient(80% 70% at 50% 30%, color-mix(in srgb, var(--cover-bg) 75%, #c79a3b), var(--cover-bg)); }
.kawung { position: absolute; inset: 0; opacity: .14; background-image: radial-gradient(circle at 0 0, transparent 13px, var(--accent) 14px, transparent 15px), radial-gradient(circle at 100% 100%, transparent 13px, var(--accent) 14px, transparent 15px), radial-gradient(circle at 100% 0, transparent 13px, var(--accent) 14px, transparent 15px), radial-gradient(circle at 0 100%, transparent 13px, var(--accent) 14px, transparent 15px); background-size: 36px 36px; }
.gunungan { position: absolute; top: 5vh; left: 50%; transform: translateX(-50%); width: min(44vw, 170px); color: var(--accent); }
.gunungan svg { width: 100%; animation: sway 6s ease-in-out infinite alternate; transform-origin: 50% 100%; }
@keyframes sway { from { transform: rotate(-1.5deg); } to { transform: rotate(1.5deg); } }
.cover-inner { padding-top: 22vh; }
.cover h1 { font-family: var(--font-script); color: var(--accent); font-weight: 400; }
.title { font-family: var(--font-display); letter-spacing: .06em; text-transform: uppercase; }
.avatar { border-radius: 50% 50% 12px 12px; background: linear-gradient(170deg, var(--c3), var(--c2)); }
.account { background: linear-gradient(135deg, var(--primary), var(--c4)); }
@media (prefers-reduced-motion: reduce) { .gunungan svg { animation: none; } }
`,
    config: {
      id: "nikah-sekar-arum",
      judul: "Pawiwahan",
      namaSampul: "Sekar & Arum",
      tamuBawaan: "Bapak/Ibu/Saudara/i",
      salam: "Sugeng rawuh. Dengan memohon rahmat Tuhan Yang Maha Esa",
      judulProfil: "Mempelai",
      pembuka: "Kami bermaksud menyelenggarakan pernikahan putra-putri kami dengan adat Jawa:",
      tokoh: [
        { panggilan: "Sekar", nama: "Raden Sekar Pamungkas, S.T.", keterangan: "Putra kedua dari Bapak Raden Hartono dan Ibu Sri Lestari" },
        { panggilan: "Arum", nama: "Arum Kinanthi Wening, S.Pd.", keterangan: "Putri pertama dari Bapak Bambang Sutejo dan Ibu Endang Sulastri" },
      ],
      kutipan: { teks: "Witing tresna jalaran saka kulina. Cinta tumbuh karena terbiasa bersama, lalu dirawat dengan sabar dan setia.", sumber: "Pepatah Jawa" },
      judulHitungMundur: "Menuju Hari Bahagia",
      teksSelesai: "Acara telah berlangsung. Matur nuwun atas doa dan restunya.",
      judulAcara: "Rangkaian Acara",
      pengantarAcara: "Rangkaian acara pernikahan akan dilaksanakan pada:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [
        { nama: "Siraman & Midodareni", mulai: "2027-06-11T15:00:00+07:00", selesai: "2027-06-11T20:00:00+07:00", tempat: "Dalem Keluarga Sutejo", alamat: "Jl. Kauman No. 21, Laweyan, Surakarta" },
        { nama: "Akad Nikah & Panggih", mulai: "2027-06-12T08:00:00+07:00", selesai: "2027-06-12T11:00:00+07:00", tempat: "Pendapa Ndalem Wijayan", alamat: "Jl. Slamet Riyadi No. 300, Surakarta" },
        { nama: "Resepsi", mulai: "2027-06-12T18:30:00+07:00", selesai: "2027-06-12T21:00:00+07:00", tempat: "Pendapa Ndalem Wijayan", alamat: "Jl. Slamet Riyadi No. 300, Surakarta" },
      ],
      judulGaleri: "Kisah Kami",
      pengantarGaleri: "Potongan perjalanan yang membawa kami ke pelaminan.",
      galeri: [{ judul: "Pertama bertemu di sanggar tari, 2019" }, { judul: "Lamaran keluarga" }, { judul: "Fitting beskap dan kebaya" }, { judul: "Menuju hari bahagia" }],
      judulUcapan: "Ucapan dan Doa",
      pengantarUcapan: "Kirimkan doa restu untuk Sekar dan Arum.",
      ucapanContoh: [
        { nama: "Keluarga Pakde Darmo", teks: "Sugeng nempuh hidup baru. Semoga langgeng dan bahagia sampai tua." },
        { nama: "Sanggar Tari Laras", teks: "Selamat untuk Arum dan Sekar! Semoga menjadi keluarga yang sakinah." },
      ],
      amplop: {
        judul: "Tanda Kasih",
        pengantar: "Doa restu Bapak/Ibu/Saudara/i sudah sangat berarti. Bila ingin memberikan tanda kasih, dapat melalui:",
        rekening: [
          { bank: "Bank BRI", nomor: "0021 0100 5566 507", atasNama: "Arum Kinanthi Wening" },
          { bank: "Bank Mandiri", nomor: "137 00 1122 3344", atasNama: "Sekar Pamungkas" },
        ],
        alamatKado: "Jl. Kauman No. 21, Laweyan, Surakarta 57148",
      },
      rsvp: {
        whatsapp: "6281200000011",
        namaAcara: "pernikahan Sekar & Arum",
        pengantar: "Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i.",
        pilihan: RSVP_PILIHAN,
        templatPesan: "Sugeng siang. Saya {nama} ingin mengonfirmasi kehadiran di {acara}: {hadir}, jumlah tamu {jumlah} orang. Matur nuwun.",
      },
      penutup: "Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.",
      salamPenutup: "Matur nuwun",
      keluarga: "Kami yang berbahagia, Keluarga Bapak Raden Hartono dan Bapak Bambang Sutejo",
      musik: { url: "", putarSaatBuka: true, tempoMs: 720, nada: [293.66, 329.63, 392, 440, 523.25, 440, 392, 329.63] },
      konfeti: { particleCount: 60, spread: 70, colors: ["#c79a3b", "#f6e7c8", "#7a4a24"], shapes: ["circle"] },
    },
  },
  {
    id: "undangan-nikah-minimalis-nara-bima",
    kind: "nikah",
    title: "Undangan Pernikahan Minimalis Nara & Bima",
    description: "Undangan pernikahan minimalis hitam-putih dengan aksen sage: sampul monogram, tipografi besar, profil mempelai, akad dan resepsi, galeri, ucapan, amplop digital, dan RSVP WhatsApp.",
    theme: "#161616",
    fonts: { display: "Playfair Display", script: "Italiana", text: "Inter", href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;1,500&family=Italiana&family=Inter:wght@400;600&display=swap" },
    colors: { bg: "#fafaf8", surface: "#f0f1ec", ink: "#161616", inkSoft: "#5a5a56", primary: "#161616", onPrimary: "#ffffff", accent: "#8a9a7e", line: "#e2e3dd", coverBg: "#f3f3ef", coverInk: "#161616", ...C4("#8a9a7e", "#d6dccf", "#161616", "#b9c3ae") },
    ornament: `<div class="mono">${MONOGRAM}<span>N<i>&amp;</i>B</span></div>`,
    css: `
.cover { background: var(--cover-bg); }
.mono { position: absolute; top: 9vh; left: 50%; transform: translateX(-50%); width: min(46vw, 180px); aspect-ratio: 1; color: var(--ink); display: grid; place-items: center; }
.mono svg { position: absolute; inset: 0; width: 100%; height: 100%; animation: rot 60s linear infinite; }
.mono span { font-family: var(--font-display); font-size: clamp(34px, 9vw, 52px); letter-spacing: .04em; }
.mono i { font-family: var(--font-script); font-style: normal; color: var(--accent); margin: 0 .1em; }
@keyframes rot { to { transform: rotate(360deg); } }
.cover-inner { padding-top: 24vh; }
.cover h1 { font-family: var(--font-display); font-style: italic; font-weight: 500; }
.title { font-family: var(--font-display); font-weight: 500; }
.avatar { border-radius: 4px; filter: grayscale(1); background: linear-gradient(160deg, var(--c2), var(--c1)); }
.account { background: var(--primary); }
@media (prefers-reduced-motion: reduce) { .mono svg { animation: none; } }
`,
    config: {
      id: "nikah-nara-bima",
      judul: "The Wedding of",
      namaSampul: "Nara & Bima",
      tamuBawaan: "Tamu Undangan",
      salam: "Dengan sukacita",
      judulProfil: "Kami Menikah",
      pembuka: "Bersama keluarga, kami mengundang Anda untuk merayakan hari pernikahan kami:",
      tokoh: [
        { panggilan: "Nara", nama: "Nara Paramitha", keterangan: "Putri dari Bapak Hendra Gunawan dan Ibu Maya Sari" },
        { panggilan: "Bima", nama: "Bima Aryasatya", keterangan: "Putra dari Bapak Rudi Hartanto dan Ibu Dewi Kartika" },
      ],
      kutipan: { teks: "Rumah bukan tempat. Rumah adalah orang yang membuatmu ingin pulang.", sumber: "Nara & Bima" },
      judulHitungMundur: "Hitung Mundur",
      teksSelesai: "Terima kasih telah menjadi bagian dari hari kami.",
      judulAcara: "Detail Acara",
      pengantarAcara: "Kami akan merayakannya pada:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [
        { nama: "Akad Nikah", mulai: "2027-04-17T09:00:00+07:00", selesai: "2027-04-17T10:30:00+07:00", tempat: "Rumah Kaca Kebun Raya", alamat: "Jl. Ir. H. Juanda No. 13, Bogor" },
        { nama: "Resepsi", mulai: "2027-04-17T16:00:00+07:00", selesai: "2027-04-17T19:00:00+07:00", tempat: "Taman Teratai, Kebun Raya", alamat: "Jl. Ir. H. Juanda No. 13, Bogor" },
      ],
      judulGaleri: "Galeri",
      pengantarGaleri: "Sedikit cerita dalam gambar.",
      galeri: [{ judul: "Kopi pertama, 2021" }, { judul: "Pendakian Papandayan" }, { judul: "Hari lamaran" }, { judul: "Sampai jumpa di hari H" }],
      judulUcapan: "Ucapan",
      pengantarUcapan: "Tinggalkan pesan untuk kami.",
      ucapanContoh: [
        { nama: "Tim Desain Lantai 3", teks: "Selamat, Nara! Semoga jadi tim terbaik seumur hidup." },
        { nama: "Raka & Dinda", teks: "Bahagia selalu, Bima dan Nara." },
      ],
      amplop: {
        judul: "Hadiah",
        pengantar: "Kehadiran Anda adalah hadiah terbaik. Bila ingin mengirim hadiah, dapat melalui:",
        rekening: [{ bank: "Bank BCA", nomor: "8800 1234 56", atasNama: "Nara Paramitha" }],
        alamatKado: "",
      },
      rsvp: {
        whatsapp: "6281200000012",
        namaAcara: "pernikahan Nara & Bima",
        pengantar: "Mohon konfirmasi sebelum 1 April 2027.",
        pilihan: RSVP_PILIHAN,
        templatPesan: "Halo, saya {nama}. Konfirmasi untuk {acara}: {hadir}, {jumlah} orang. Terima kasih.",
      },
      penutup: "Sampai bertemu di hari bahagia kami.",
      salamPenutup: "",
      keluarga: "Nara, Bima, dan keluarga",
      musik: { url: "", putarSaatBuka: true, tempoMs: 680, nada: [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66] },
      konfeti: { particleCount: 50, spread: 60, colors: ["#161616", "#8a9a7e", "#ffffff"], shapes: ["square"], scalar: 0.8 },
    },
  },
  {
    id: "undangan-nikah-rustic-tara-galih",
    kind: "nikah",
    title: "Undangan Pernikahan Rustic Tara & Galih",
    description: "Undangan pernikahan rustic bernuansa terakota dan kayu: karangan daun di sampul, tekstur kertas kraft, profil mempelai, acara kebun, galeri, ucapan, amplop digital, dan RSVP WhatsApp.",
    theme: "#a6532f",
    fonts: { display: "Abril Fatface", script: "Sacramento", text: "Karla", href: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Sacramento&family=Karla:wght@400;600&display=swap" },
    colors: { bg: "#f7efe4", surface: "#efe0cc", ink: "#3e2a1f", inkSoft: "#735b4b", primary: "#a6532f", onPrimary: "#fff7ef", accent: "#6f7d4c", line: "#e2cfb6", coverBg: "#e9d8bf", coverInk: "#3e2a1f", ...C4("#a6532f", "#6f7d4c", "#d9a273", "#c9b28c") },
    ornament: `<div class="wreath">${WREATH}</div><div class="kraft" aria-hidden="true"></div>`,
    css: `
.cover { background: radial-gradient(70% 60% at 50% 35%, #f3e6d3, var(--cover-bg)); }
.kraft { position: absolute; inset: 0; opacity: .35; background-image: repeating-linear-gradient(35deg, rgba(110,80,50,.05) 0 2px, transparent 2px 6px), repeating-linear-gradient(-55deg, rgba(110,80,50,.04) 0 1px, transparent 1px 5px); pointer-events: none; }
.wreath { position: absolute; top: 6vh; left: 50%; transform: translateX(-50%); width: min(62vw, 250px); color: var(--accent); }
.wreath svg { width: 100%; animation: breathe 5s ease-in-out infinite alternate; }
@keyframes breathe { from { transform: scale(.98); } to { transform: scale(1.02); } }
.cover-inner { padding-top: 15vh; }
.cover h1 { font-family: var(--font-script); color: var(--primary); font-weight: 400; }
.title { font-family: var(--font-display); font-weight: 400; color: var(--primary); }
.avatar { border-radius: 50%; border: 6px solid #fff; box-shadow: 0 10px 30px -14px rgba(62,42,31,.5); background: linear-gradient(160deg, var(--c3), var(--c1)); }
.account { background: linear-gradient(135deg, var(--primary), var(--c2)); }
@media (prefers-reduced-motion: reduce) { .wreath svg { animation: none; } }
`,
    config: {
      id: "nikah-tara-galih",
      judul: "Pernikahan",
      namaSampul: "Tara & Galih",
      tamuBawaan: "Sahabat Terkasih",
      salam: "Halo, sahabat!",
      judulProfil: "Dua Hati, Satu Cerita",
      pembuka: "Dengan bahagia kami mengundang Anda merayakan pernikahan kami di bawah pepohonan:",
      tokoh: [
        { panggilan: "Tara", nama: "Mentari Tara Kusuma", keterangan: "Putri dari Bapak Johan Kusuma dan Ibu Ratna Dewi" },
        { panggilan: "Galih", nama: "Galih Wicaksono", keterangan: "Putra dari Bapak Slamet Riyanto dan Ibu Siti Aminah" },
      ],
      kutipan: { teks: "Kita tumbuh pelan-pelan, seperti pohon: akarnya dulu, baru bunganya.", sumber: "Tara & Galih" },
      judulHitungMundur: "Menuju Hari H",
      teksSelesai: "Acara telah usai. Terima kasih sudah datang dan merayakan bersama kami!",
      judulAcara: "Waktu dan Tempat",
      pengantarAcara: "Acara di ruang terbuka, siapkan sepatu yang nyaman:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [
        { nama: "Pemberkatan", mulai: "2027-08-21T10:00:00+07:00", selesai: "2027-08-21T11:30:00+07:00", tempat: "Kebun Pinus Giripurno", alamat: "Jl. Raya Giripurno, Bumiaji, Kota Batu" },
        { nama: "Garden Party", mulai: "2027-08-21T15:00:00+07:00", selesai: "2027-08-21T19:00:00+07:00", tempat: "Lumbung Kayu Giripurno", alamat: "Jl. Raya Giripurno, Bumiaji, Kota Batu" },
      ],
      judulGaleri: "Album Kami",
      pengantarGaleri: "Dari kebun ke kebun.",
      galeri: [{ judul: "Panen apel pertama, 2020" }, { judul: "Berkemah di Coban Talun" }, { judul: "Galih melamar di kebun" }, { judul: "Menanam pohon bersama" }],
      judulUcapan: "Kirim Ucapan",
      pengantarUcapan: "Tulis harapan untuk Tara dan Galih.",
      ucapanContoh: [
        { nama: "Komunitas Berkebun Batu", teks: "Selamat! Semoga rumah tangganya rimbun dan berbuah manis." },
        { nama: "Bu Ratna", teks: "Bahagia selalu, Nak." },
      ],
      amplop: {
        judul: "Amplop Digital",
        pengantar: "Bila ingin memberikan tanda kasih, dapat melalui:",
        rekening: [{ bank: "Bank BNI", nomor: "0912 3456 78", atasNama: "Galih Wicaksono" }],
        alamatKado: "Jl. Bukit Berbunga No. 8, Sidomulyo, Kota Batu 65317",
      },
      rsvp: {
        whatsapp: "6281200000013",
        namaAcara: "pernikahan Tara & Galih",
        pengantar: "Bantu kami menyiapkan kursi dan hidangan, ya.",
        pilihan: RSVP_PILIHAN,
        templatPesan: "Halo! Saya {nama}. Untuk {acara}: {hadir}, {jumlah} orang. Sampai jumpa!",
      },
      penutup: "Sampai jumpa di kebun pinus!",
      salamPenutup: "",
      keluarga: "Peluk hangat, Tara & Galih",
      musik: { url: "", putarSaatBuka: true, tempoMs: 560, nada: [392, 440, 493.88, 392, 329.63, 392, 440, 349.23] },
      konfeti: { particleCount: 70, spread: 80, colors: ["#a6532f", "#6f7d4c", "#d9a273"], shapes: ["circle"] },
    },
  },
  {
    id: "undangan-ultah-17-kirana",
    kind: "ultah",
    title: "Undangan Sweet Seventeen Kirana",
    description: "Undangan ulang tahun ke-17 bernuansa ungu malam dan merah muda: angka 17 berkilau di sampul, profil, hitung mundur, dress code, galeri, ucapan, RSVP WhatsApp, dan konfeti bintang.",
    theme: "#24123d",
    fonts: { display: "Fredoka", script: "Pacifico", text: "Quicksand", href: "https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&family=Pacifico&family=Quicksand:wght@500;700&display=swap" },
    colors: { bg: "#fcf6ff", surface: "#f4e9ff", ink: "#2a1840", inkSoft: "#6b5585", primary: "#b03ad6", onPrimary: "#ffffff", accent: "#ff7ab6", line: "#ead9f7", coverBg: "#24123d", coverInk: "#ffe9f6", ...C4("#ff7ab6", "#b03ad6", "#ffd36e", "#7cc8ff") },
    ornament: `<div class="seventeen">${SPARKLE17}</div><div class="glitter" aria-hidden="true"></div>`,
    css: `
.cover { background: radial-gradient(90% 70% at 50% 25%, #4b2477, var(--cover-bg)); }
.glitter { position: absolute; inset: 0; background-image: radial-gradient(2px 2px at 20% 30%, #fff, transparent), radial-gradient(2px 2px at 70% 20%, #ffd36e, transparent), radial-gradient(1.5px 1.5px at 40% 70%, #ff7ab6, transparent), radial-gradient(2px 2px at 85% 60%, #fff, transparent), radial-gradient(1.5px 1.5px at 12% 80%, #7cc8ff, transparent); animation: twinkle 3s ease-in-out infinite alternate; }
@keyframes twinkle { from { opacity: .4; } to { opacity: 1; } }
.seventeen { position: absolute; top: 6vh; left: 50%; transform: translateX(-50%); width: min(64vw, 260px); color: var(--accent); filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 60%, transparent)); }
.seventeen svg { width: 100%; }
.cover-inner { padding-top: 18vh; }
.cover h1 { font-family: var(--font-script); color: var(--cover-ink); font-weight: 400; }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%; background: linear-gradient(140deg, var(--c1), var(--c2)); }
.account { background: linear-gradient(135deg, var(--primary), var(--c1)); }
@media (prefers-reduced-motion: reduce) { .glitter { animation: none; } }
`,
    config: {
      id: "ultah-kirana-17",
      judul: "Sweet Seventeen",
      namaSampul: "Kirana",
      tamuBawaan: "Bestie",
      salam: "Hai, kamu!",
      judulProfil: "Yang Berulang Tahun",
      pembuka: "Akhirnya tujuh belas! Datang dan rayakan malam spesial ini bareng aku:",
      tokoh: [{ panggilan: "Kirana", nama: "Kirana Ayu Lestari", keterangan: "Siswi kelas XII SMA, suka menari dan menggambar. Dress code: ungu atau pink!" }],
      kutipan: { teks: "Tujuh belas bukan soal jadi dewasa, tapi soal berani jadi diri sendiri.", sumber: "Kirana" },
      judulHitungMundur: "Pesta Dimulai Dalam",
      teksSelesai: "Pestanya sudah selesai. Makasih udah datang, kalian terbaik!",
      judulAcara: "Detail Pesta",
      pengantarAcara: "Catat tanggalnya, jangan sampai telat:",
      zonaWaktu: "Asia/Makassar",
      labelZona: "WITA",
      acara: [{ nama: "Sweet Seventeen Party", mulai: "2027-03-20T18:30:00+08:00", selesai: "2027-03-20T21:30:00+08:00", tempat: "Rooftop Hotel Pelangi", alamat: "Jl. Penghibur No. 88, Makassar" }],
      judulGaleri: "Throwback",
      pengantarGaleri: "Dari bayi sampai tujuh belas.",
      galeri: [{ judul: "Ulang tahun pertama" }, { judul: "Pentas tari SD" }, { judul: "Liburan ke Toraja" }, { judul: "Hari ini" }],
      judulUcapan: "Kirim Ucapan",
      pengantarUcapan: "Tulis ucapan paling manis buat Kirana.",
      ucapanContoh: [
        { nama: "Sasa", teks: "HBD bestie! Semoga makin cantik dan makin pinter!" },
        { nama: "Tante Wina", teks: "Selamat ulang tahun ke-17, Kirana sayang." },
      ],
      amplop: { judul: "Kado", pengantar: "Kehadiranmu udah cukup! Tapi kalau mau kirim kado, bisa lewat:", rekening: [{ bank: "Dana", nomor: "0812 0000 0014", atasNama: "Kirana Ayu" }], alamatKado: "" },
      rsvp: {
        whatsapp: "6281200000014",
        namaAcara: "Sweet Seventeen Kirana",
        pengantar: "Konfirmasi dulu ya, biar tempatnya cukup.",
        pilihan: ["Pasti datang!", "Masih belum tahu", "Maaf, nggak bisa"],
        templatPesan: "Hai Kirana! Aku {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      },
      penutup: "See you di rooftop!",
      salamPenutup: "",
      keluarga: "Love, Kirana",
      musik: { url: "", putarSaatBuka: true, tempoMs: 380, nada: [523.25, 659.25, 783.99, 659.25, 698.46, 880, 783.99, 659.25] },
      konfeti: { particleCount: 110, spread: 100, colors: ["#ff7ab6", "#b03ad6", "#ffd36e", "#7cc8ff"], shapes: ["star", "circle"] },
    },
  },
  {
    id: "undangan-rumah-baru-keluarga-hasan",
    kind: "rumah",
    title: "Undangan Syukuran Rumah Baru Keluarga Hasan",
    description: "Undangan syukuran rumah baru bernuansa hijau daun dan krem: rumah mungil di sampul, profil keluarga, hitung mundur, jadwal pengajian, denah lokasi, galeri, ucapan, dan RSVP WhatsApp.",
    theme: "#2f5d50",
    fonts: { display: "Nunito", script: "Caveat", text: "Nunito Sans", href: "https://fonts.googleapis.com/css2?family=Nunito:wght@700;800&family=Caveat:wght@600&family=Nunito+Sans:wght@400;700&display=swap" },
    colors: { bg: "#fbf8f1", surface: "#eef3ec", ink: "#22332d", inkSoft: "#5b6b64", primary: "#2f5d50", onPrimary: "#ffffff", accent: "#e0a54a", line: "#dfe7dc", coverBg: "#dfeadf", coverInk: "#22332d", ...C4("#7fb08f", "#e0a54a", "#cfe0cf", "#f2d7a6") },
    ornament: `<div class="house">${HOUSE}</div><div class="sun" aria-hidden="true"></div>`,
    css: `
.cover { background: linear-gradient(180deg, #f6f1e2 0%, var(--cover-bg) 70%); }
.sun { position: absolute; top: 7vh; right: 14vw; width: 74px; height: 74px; border-radius: 50%; background: radial-gradient(circle, #ffe2a3, var(--accent)); box-shadow: 0 0 60px #ffd77a; animation: bob 6s ease-in-out infinite alternate; }
@keyframes bob { to { transform: translateY(10px); } }
.house { position: absolute; top: 12vh; left: 50%; transform: translateX(-50%); width: min(58vw, 230px); color: var(--primary); }
.house svg { width: 100%; }
.cover-inner { padding-top: 22vh; }
.cover h1 { color: var(--primary); }
.title { font-family: var(--font-display); color: var(--primary); }
.avatar { border-radius: 24px; background: linear-gradient(160deg, var(--c3), var(--c1)); }
.account { background: linear-gradient(135deg, var(--primary), var(--c1)); }
@media (prefers-reduced-motion: reduce) { .sun { animation: none; } }
`,
    config: {
      id: "rumah-baru-hasan",
      judul: "Syukuran Rumah Baru",
      namaSampul: "Keluarga Hasan",
      tamuBawaan: "Bapak/Ibu/Saudara/i",
      salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      judulProfil: "Tuan Rumah",
      pembuka: "Alhamdulillah, kami telah menempati rumah baru. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dalam syukuran dan pengajian:",
      tokoh: [{ panggilan: "Keluarga Hasan", nama: "Bapak Hasan Basri & Ibu Nurul Aini", keterangan: "Bersama Fikri dan Zahra" }],
      kutipan: { teks: "Rumah yang baik bukan yang paling besar, tetapi yang paling banyak doa dan tawa di dalamnya.", sumber: "Keluarga Hasan" },
      judulHitungMundur: "Menuju Hari Syukuran",
      teksSelesai: "Syukuran telah berlangsung. Terima kasih atas doa dan kehadirannya.",
      judulAcara: "Waktu dan Tempat",
      pengantarAcara: "Insyaallah akan dilaksanakan pada:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [{ nama: "Pengajian & Syukuran", mulai: "2027-01-23T19:30:00+07:00", selesai: "2027-01-23T21:30:00+07:00", tempat: "Rumah Baru Keluarga Hasan", alamat: "Perumahan Griya Asri Blok F7 No. 12, Tlogomulyo, Semarang" }],
      judulGaleri: "Rumah Kami",
      pengantarGaleri: "Dari kunci pertama sampai lampu menyala.",
      galeri: [{ judul: "Serah terima kunci" }, { judul: "Mengecat kamar anak-anak" }, { judul: "Menanam mangga di halaman" }, { judul: "Makan malam pertama" }],
      judulUcapan: "Doa untuk Rumah Ini",
      pengantarUcapan: "Kirimkan doa untuk keluarga Hasan dan rumah barunya.",
      ucapanContoh: [
        { nama: "Pak RT Darto", teks: "Selamat datang di lingkungan kami. Semoga betah dan berkah." },
        { nama: "Keluarga Bu Lilis", teks: "Barakallah, semoga rumahnya penuh rezeki dan kebahagiaan." },
      ],
      amplop: { judul: "Tanda Kasih", pengantar: "Doa Anda adalah hadiah terbaik. Bila ingin memberikan tanda kasih, dapat melalui:", rekening: [{ bank: "Bank Syariah Indonesia", nomor: "7123 4567 89", atasNama: "Hasan Basri" }], alamatKado: "Perumahan Griya Asri Blok F7 No. 12, Tlogomulyo, Semarang 50196" },
      rsvp: {
        whatsapp: "6281200000015",
        namaAcara: "syukuran rumah baru Keluarga Hasan",
        pengantar: "Mohon konfirmasi kehadiran agar kami dapat menyiapkan hidangan.",
        pilihan: ["Insyaallah hadir", "Belum dapat memastikan", "Mohon maaf, tidak dapat hadir"],
        templatPesan: "Assalamu'alaikum. Saya {nama} ingin mengonfirmasi kehadiran di {acara}: {hadir}, jumlah tamu {jumlah} orang.",
      },
      penutup: "Kehadiran dan doa Bapak/Ibu/Saudara/i sangat berarti bagi kami sekeluarga.",
      salamPenutup: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
      keluarga: "Hasan, Nurul, Fikri, dan Zahra",
      musik: { url: "", putarSaatBuka: true, tempoMs: 600, nada: [349.23, 392, 440, 523.25, 440, 392, 349.23, 329.63] },
      konfeti: { particleCount: 60, spread: 70, colors: ["#7fb08f", "#e0a54a", "#ffffff"], shapes: ["circle"] },
    },
  },
  {
    id: "undangan-tujuh-bulanan-sari",
    kind: "tujuhbulan",
    title: "Undangan Tujuh Bulanan Sari & Fajar",
    description: "Undangan syukuran tujuh bulanan (mitoni) bernuansa peach dan hijau lembut: bunga mekar di sampul, profil calon orang tua, hitung mundur, pengajian dan siraman, galeri, doa, dan RSVP WhatsApp.",
    theme: "#c9735a",
    fonts: { display: "Cormorant Garamond", script: "Parisienne", text: "Mulish", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Parisienne&family=Mulish:wght@400;700&display=swap" },
    colors: { bg: "#fff8f3", surface: "#fbeae1", ink: "#3d2a25", inkSoft: "#76605a", primary: "#c9735a", onPrimary: "#ffffff", accent: "#7ea38a", line: "#f1dcd1", coverBg: "#fbe6da", coverInk: "#3d2a25", ...C4("#f4b6a0", "#7ea38a", "#fde3d6", "#cfe2d4") },
    ornament: `<div class="bloom">${BLOOM}</div><div class="petal p1"></div><div class="petal p2"></div><div class="petal p3"></div>`,
    css: `
.cover { background: radial-gradient(80% 60% at 50% 30%, #fff3ec, var(--cover-bg)); }
.bloom { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%); width: min(56vw, 220px); color: var(--primary); }
.bloom svg { width: 100%; animation: open 4s ease-in-out infinite alternate; transform-origin: 50% 45%; }
@keyframes open { from { transform: scale(.96) rotate(-2deg); } to { transform: scale(1.03) rotate(2deg); } }
.petal { position: absolute; width: 16px; height: 22px; border-radius: 50% 50% 50% 0; background: var(--c1); opacity: .75; animation: fall 9s linear infinite; }
.p1 { left: 18%; top: -5%; } .p2 { left: 62%; top: -5%; animation-delay: 3s; } .p3 { left: 84%; top: -5%; animation-delay: 6s; background: var(--accent); }
@keyframes fall { to { transform: translateY(110vh) rotate(360deg); } }
.cover-inner { padding-top: 18vh; }
.cover h1 { font-family: var(--font-script); color: var(--primary); font-weight: 400; }
.title { font-family: var(--font-display); }
.avatar { border-radius: 50%; background: radial-gradient(circle at 35% 30%, var(--c3), var(--c1)); }
.account { background: linear-gradient(135deg, var(--primary), var(--c2)); }
@media (prefers-reduced-motion: reduce) { .bloom svg, .petal { animation: none; } .petal { display: none; } }
`,
    config: {
      id: "tujuh-bulanan-sari",
      judul: "Syukuran Tujuh Bulanan",
      namaSampul: "Sari & Fajar",
      tamuBawaan: "Bapak/Ibu/Saudara/i",
      salam: "Assalamu'alaikum Warahmatullahi Wabarakatuh",
      judulProfil: "Calon Ayah dan Bunda",
      pembuka: "Alhamdulillah, kehamilan kami telah memasuki usia tujuh bulan. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan:",
      tokoh: [
        { panggilan: "Sari", nama: "Sari Puspitasari", keterangan: "Calon bunda" },
        { panggilan: "Fajar", nama: "Fajar Nugroho", keterangan: "Calon ayah" },
      ],
      kutipan: { teks: "Semoga ibu dan janin selalu sehat, persalinan dilancarkan, dan buah hati kelak menjadi anak yang saleh atau salehah.", sumber: "Doa kami" },
      judulHitungMundur: "Menuju Hari Syukuran",
      teksSelesai: "Acara telah berlangsung. Terima kasih atas doa dan kehadirannya.",
      judulAcara: "Rangkaian Acara",
      pengantarAcara: "Insyaallah akan dilaksanakan pada:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [
        { nama: "Pengajian", mulai: "2027-05-08T09:00:00+07:00", selesai: "2027-05-08T10:30:00+07:00", tempat: "Kediaman Keluarga Nugroho", alamat: "Jl. Cempaka Putih No. 17, Sleman, Yogyakarta" },
        { nama: "Siraman Mitoni", mulai: "2027-05-08T10:45:00+07:00", selesai: "2027-05-08T12:00:00+07:00", tempat: "Halaman Belakang", alamat: "Jl. Cempaka Putih No. 17, Sleman, Yogyakarta" },
      ],
      judulGaleri: "Menanti Buah Hati",
      pengantarGaleri: "Bulan demi bulan yang kami syukuri.",
      galeri: [{ judul: "Garis dua" }, { judul: "USG pertama" }, { judul: "Menyiapkan kamar bayi" }, { judul: "Tujuh bulan" }],
      judulUcapan: "Doa untuk Sari dan Calon Bayi",
      pengantarUcapan: "Kirimkan doa terbaik Anda.",
      ucapanContoh: [
        { nama: "Mbak Rini", teks: "Sehat-sehat ya Sari dan dedek bayi. Lancar sampai lahiran." },
        { nama: "Teman Kantor Fajar", teks: "Selamat, calon ayah! Semoga dimudahkan semuanya." },
      ],
      amplop: { judul: "Tanda Kasih", pengantar: "Bila ingin memberikan tanda kasih, dapat melalui:", rekening: [{ bank: "Bank Mandiri", nomor: "137 00 9988 7766", atasNama: "Sari Puspitasari" }], alamatKado: "Jl. Cempaka Putih No. 17, Sleman, Yogyakarta 55581" },
      rsvp: {
        whatsapp: "6281200000016",
        namaAcara: "syukuran tujuh bulanan Sari & Fajar",
        pengantar: "Mohon konfirmasi kehadiran Bapak/Ibu/Saudara/i.",
        pilihan: ["Insyaallah hadir", "Belum dapat memastikan", "Mohon maaf, tidak dapat hadir"],
        templatPesan: "Assalamu'alaikum. Saya {nama} ingin mengonfirmasi kehadiran di {acara}: {hadir}, jumlah tamu {jumlah} orang.",
      },
      penutup: "Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan mendoakan.",
      salamPenutup: "Wassalamu'alaikum Warahmatullahi Wabarakatuh",
      keluarga: "Kami yang berbahagia, Sari & Fajar beserta keluarga",
      musik: { url: "", putarSaatBuka: true, tempoMs: 660, nada: [329.63, 392, 440, 392, 349.23, 329.63, 293.66, 329.63] },
      konfeti: { particleCount: 60, spread: 70, colors: ["#f4b6a0", "#7ea38a", "#ffffff"], shapes: ["circle"] },
    },
  },
  {
    id: "undangan-reuni-smansa-2015",
    kind: "reuni",
    title: "Undangan Reuni Angkatan 2015 SMA Nusa Bangsa",
    description: "Undangan reuni bergaya retro 2010-an: kaset dan pita warna di sampul, profil panitia, hitung mundur, susunan acara, galeri kenangan, ucapan, iuran, dan RSVP WhatsApp.",
    theme: "#1f2a44",
    fonts: { display: "Bungee", script: "Permanent Marker", text: "Space Grotesk", href: "https://fonts.googleapis.com/css2?family=Bungee&family=Permanent+Marker&family=Space+Grotesk:wght@400;600&display=swap" },
    colors: { bg: "#fff9ee", surface: "#fdeed2", ink: "#1f2a44", inkSoft: "#4f5a75", primary: "#e5533d", onPrimary: "#ffffff", accent: "#2bb3a3", line: "#f0dfbf", coverBg: "#1f2a44", coverInk: "#fff3d6", ...C4("#e5533d", "#f6b93b", "#2bb3a3", "#6c5ce7") },
    ornament: `<div class="stripes" aria-hidden="true"></div><div class="tape">${CASSETTE}</div>`,
    css: `
.cover { background: var(--cover-bg); }
.stripes { position: absolute; left: -10%; right: -10%; bottom: 9vh; height: 64px; transform: rotate(-6deg); background: linear-gradient(180deg, var(--c1) 0 25%, var(--c2) 25% 50%, var(--c3) 50% 75%, var(--c4) 75% 100%); opacity: .9; }
.tape { position: absolute; top: 8vh; left: 50%; transform: translateX(-50%) rotate(-4deg); width: min(60vw, 240px); color: var(--c2); }
.tape svg { width: 100%; }
.tape circle:nth-of-type(1), .tape circle:nth-of-type(2) { transform-box: fill-box; transform-origin: center; animation: reel 3s linear infinite; }
@keyframes reel { to { transform: rotate(360deg); } }
.cover-inner { padding-top: 24vh; }
.cover h1 { font-family: var(--font-display); color: var(--c2); letter-spacing: .02em; }
.title { font-family: var(--font-display); color: var(--primary); font-weight: 400; }
.avatar { border-radius: 16px; transform: rotate(-3deg); background: linear-gradient(140deg, var(--c2), var(--c1)); }
.account { background: linear-gradient(135deg, var(--c4), var(--c3)); }
@media (prefers-reduced-motion: reduce) { .tape circle { animation: none; } }
`,
    config: {
      id: "reuni-smansa-2015",
      judul: "Reuni 12 Tahun",
      namaSampul: "Angkatan 2015",
      tamuBawaan: "Alumni Angkatan 2015",
      salam: "Halo, kawan lama!",
      judulProfil: "Panitia",
      pembuka: "Dua belas tahun sejak seragam putih abu-abu. Saatnya kumpul lagi, cerita lagi, ketawa lagi:",
      tokoh: [
        { panggilan: "Dodi", nama: "Dodi Firmansyah (XII IPA 2)", keterangan: "Ketua panitia" },
        { panggilan: "Lia", nama: "Amelia Kartika (XII IPS 1)", keterangan: "Bendahara & urusan konsumsi" },
      ],
      kutipan: { teks: "Kita mungkin sudah beda kota dan beda kesibukan, tapi lagu kelas kita masih sama.", sumber: "Panitia Reuni 2015" },
      judulHitungMundur: "Reuni Dimulai Dalam",
      teksSelesai: "Reuni sudah selesai. Terima kasih sudah datang, sampai jumpa di reuni berikutnya!",
      judulAcara: "Susunan Acara",
      pengantarAcara: "Satu hari penuh nostalgia:",
      zonaWaktu: "Asia/Jakarta",
      labelZona: "WIB",
      acara: [
        { nama: "Tur Sekolah & Foto Bersama", mulai: "2027-07-10T09:00:00+07:00", selesai: "2027-07-10T11:30:00+07:00", tempat: "SMA Nusa Bangsa", alamat: "Jl. Pendidikan No. 1, Cirebon" },
        { nama: "Makan Siang & Panggung Kenangan", mulai: "2027-07-10T12:00:00+07:00", selesai: "2027-07-10T16:00:00+07:00", tempat: "Aula Grage Convention", alamat: "Jl. Tentara Pelajar No. 1, Cirebon" },
      ],
      judulGaleri: "Arsip Kenangan",
      pengantarGaleri: "Siapa yang masih ingat momen ini?",
      galeri: [{ judul: "MOS 2012" }, { judul: "Class meeting juara futsal" }, { judul: "Study tour Bali" }, { judul: "Hari kelulusan 2015" }],
      judulUcapan: "Pesan untuk Angkatan",
      pengantarUcapan: "Tulis pesan atau kenangan favoritmu.",
      ucapanContoh: [
        { nama: "Bayu, XII IPA 1", teks: "Nggak sabar ketemu! Siapa yang masih utang gorengan kantin?" },
        { nama: "Putri, XII IPS 2", teks: "Kangen kalian semua. Sampai jumpa di aula!" },
      ],
      amplop: { judul: "Iuran Reuni", pengantar: "Iuran Rp150.000 per orang untuk konsumsi dan kaos reuni. Transfer ke:", rekening: [{ bank: "Bank BJB", nomor: "0089 1122 3300", atasNama: "Amelia Kartika" }], alamatKado: "" },
      rsvp: {
        whatsapp: "6281200000017",
        namaAcara: "Reuni Angkatan 2015 SMA Nusa Bangsa",
        pengantar: "Konfirmasi paling lambat 30 Juni 2027 supaya ukuran kaos bisa disiapkan.",
        pilihan: ["Hadir", "Belum pasti", "Tidak bisa hadir"],
        templatPesan: "Halo panitia! Saya {nama}. Untuk {acara}: {hadir}, {jumlah} orang.",
      },
      penutup: "Bawa cerita, bawa tawa, dan kalau bisa bawa foto lama!",
      salamPenutup: "",
      keluarga: "Panitia Reuni Angkatan 2015",
      musik: { url: "", putarSaatBuka: true, tempoMs: 420, nada: [392, 392, 440, 392, 523.25, 493.88, 392, 440] },
      konfeti: { particleCount: 100, spread: 90, colors: ["#e5533d", "#f6b93b", "#2bb3a3", "#6c5ce7"], shapes: ["square", "circle"] },
    },
  },
];
