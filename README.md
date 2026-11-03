# OneWebDev — frontend

Kumpulan alat developer yang berjalan di browser: rakit website dari 400 template, desain halaman dengan drag & drop lalu ekspor ke HTML, React, Vue, Svelte, atau Angular, olah data (Excel, JSON, SQL, PDF), olah media (gambar, audio, video), dan buat tur 360°.

**Versi frontend-only** (`VITE_API_BASE_URL=off`) berjalan tanpa server dan tanpa akun. Semua template, elemen, dan fitur di dalamnya terbuka penuh; data tersimpan di browser Anda dan file tidak di-upload.

React 19 + Vite 6 + TypeScript + Tailwind CSS 4.

## Janji versi frontend-only

- Versi frontend-only **gratis dan lengkap**. Tidak ada fitur yang dikunci, tidak ada batas uji coba, dan tidak ada "versi Pro" dari kode ini.
- Setiap versi yang sudah dirilis di bawah AGPL-3.0 **tetap AGPL-3.0 selamanya**. Lisensi sebuah rilis tidak bisa ditarik kembali; kalaupun arah proyek berubah, kode yang sudah terbuka tetap bisa Anda pakai, fork, dan kembangkan.
- Analitik **mati** secara bawaan di versi ini (lihat bagian Privasi).

## Lisensi

| Bagian | Lisensi | Artinya |
| --- | --- | --- |
| Kode aplikasi | [AGPL-3.0](LICENSE) | Bebas dipakai, diubah, dan dibagikan. Bila Anda menjalankan versi yang diubah sebagai layanan online, kode lengkapnya wajib dibuka dengan lisensi yang sama. |
| Template & website hasil ekspor | [LICENSE-TEMPLATES.md](LICENSE-TEMPLATES.md) | Website Anda milik Anda (boleh komersial, tanpa atribusi). Template gratis dipakai siapa saja, tetapi **tidak boleh dijual ulang sebagai template**. |
| Nama & logo OneWebDev | [TRADEMARK.md](TRADEMARK.md) | Fork boleh, tetapi pakai nama dan logo sendiri. |
| Pustaka pihak ketiga | [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) | Termasuk dasar TailAdmin (MIT). Perbarui dengan `npm run notices`. |

## Privasi

- File yang diolah alat Data dan Media diproses di perangkat Anda dan tidak dikirim ke server.
- Desain, folder website, ikon, dan font tersimpan di penyimpanan browser (IndexedDB/localStorage).
- Vercel Web Analytics hanya aktif bila di-build di Vercel **dengan backend**, atau bila Anda mengisi `VITE_VERCEL_ANALYTICS=true`. Pada versi frontend-only nilainya mati kecuali Anda menyalakannya sendiri.

## Berkontribusi

Lihat [CONTRIBUTING.md](CONTRIBUTING.md). Laporan celah keamanan: [SECURITY.md](SECURITY.md). Kode etik: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm ci` | Pasang dependency persis sesuai `package-lock.json` |
| `npm run dev` | Server pengembangan (service worker **tidak** aktif di mode ini) |
| `npm run build` | `tsc -b` lalu build produksi ke `dist/` (termasuk `sw.js` dan `manifest.webmanifest`) |
| `npm run build:demo` | Build **frontend-only** (tanpa backend) memakai `.env.demo`. Panduan deploy GitHub Pages/Vercel: `DEPLOY-DEMO.md` |
| `npm run gen:demo` | Buat ulang isi template versi frontend-only (`src/demo/*.generated.ts`) setelah katalog template berubah |
| `npm run preview` | Menyajikan `dist/` di http://localhost:4173, untuk menguji PWA secara lokal |
| `npm run typecheck` / `npm run lint` / `npm test` | Pemeriksaan tipe, ESLint, dan uji `node:test` |
| `npm run templates:gen` / `templates:check` | Bangun 400 template lalu periksa overflow (375/768/1280), error JS, axe, dan Lighthouse. Lihat `scripts/templates-ci/` |
| `npm run notices` | Buat ulang `THIRD_PARTY_NOTICES.md` dari dependency |
| `npm run icons` | Membuat ulang ikon PWA dari `public/favicon.svg` |

`.npmrc` melewati unduhan binari CUDA `onnxruntime-node` (dependensi Node dari `@huggingface/transformers`); aplikasi hanya memakai runtime web di browser.

## Variabel lingkungan

`VITE_API_BASE_URL` berisi URL backend Nest (bawaan `http://localhost:3000`, isi `off` untuk berjalan tanpa backend). Nilai ini juga dipakai service worker: semua permintaan ke origin tersebut selalu lewat jaringan (tidak pernah di-cache). Sentry opsional lewat `VITE_SENTRY_DSN`.

`VITE_BASE_PATH` (opsional, bawaan `/`) mengatur awalan path bila situs tidak di root domain, misalnya `/repo/` untuk GitHub Pages proyek.

## PWA

- Dikonfigurasi di `vite.config.ts` (`vite-plugin-pwa`, mode `generateSW`, `registerType: "prompt"`).
- Kartu "Muat ulang untuk memperbarui" ada di `src/components/common/PwaUpdatePrompt.tsx`; tombol pasang aplikasi di `PwaInstallPrompt.tsx`.
- Halaman offline: `public/offline.html`.
- Service worker hanya aktif lewat HTTPS (atau `localhost`). Header cache untuk `sw.js` diatur di `vercel.json`.
