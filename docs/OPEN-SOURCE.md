# Checklist rilis open source (frontend-only)

Status per v25. ✓ = sudah dikerjakan di kode, ☐ = langkah Anda saat membuat repo publik.

## 1. Rahasia & riwayat git

- ✓ Pemindaian `src/`, `scripts/`, `public/`, `index.html`, `.env*`: tidak ada key API, token Midtrans/Google, private key, atau URL server internal. `.env` dan `.env.demo` hanya berisi `VITE_API_BASE_URL`.
- ☐ Buat repo publik **dari riwayat baru** (salin isi folder, `git init`, satu commit awal). Jangan push riwayat repo privat: berkas yang pernah ter-commit tetap bisa dibaca di riwayat lama walaupun sudah dihapus.
- ☐ Setelah repo publik dibuat, aktifkan **Secret scanning** dan **Private vulnerability reporting** di Settings → Code security.

## 2. Pemisahan repo

- ☐ Repo publik: hanya folder frontend ini. Backend NestJS, skrip Python, dan konfigurasi server tetap di repo privat.
- Catatan jujur: frontend masih memuat kode **klien** untuk akun, kredit, paket, dan Toko (`src/credits`, `src/marketplace`, halaman akun). Di frontend-only semua jalur itu mati (`isDemoMode()`), tidak ada batas, dan menunya disembunyikan. Kode klien itu tidak berisi rahasia, hanya memanggil API backend. Bila ingin repo publik benar-benar bersih dari kode berbayar, langkah lanjutannya adalah memindahkan bagian itu ke paket privat; ini pekerjaan terpisah yang cukup besar.

## 3. Lisensi

- ✓ `LICENSE`: MIT, atas nama hajir (OneWebDev).
- ✓ `LICENSE-TEMPLATES.md`: website hasil ekspor milik pengguna (boleh komersial, tanpa atribusi); template gratis dipakai siapa saja; **tidak boleh dijual ulang sebagai template**.
- ✓ `package.json`: `"license": "MIT"`.
- ✓ Lisensi MIT TailAdmin (dasar dashboard) disimpan di `LICENSES/MIT-TailAdmin.txt` dan dikutip di `THIRD_PARTY_NOTICES.md`. Pemberitahuan MIT TailAdmin tetap harus ada.

## 4. Lisensi pihak ketiga

- ✓ `THIRD_PARTY_NOTICES.md` dibuat otomatis (`npm run notices`): 303 paket, semuanya lisensi yang cocok dengan MIT (MIT, ISC, Apache-2.0, BSD, MPL-2.0, BlueOak, CC0, Unlicense).
- ✓ Model hapus latar di browser: BiRefNet lite (MIT). Teks UI yang menyebut "ISNet" untuk mode browser sudah diperbaiki (ISNet hanya dipakai di server).
- ☐ Gambar contoh di template: pastikan semua berasal dari sumber berlisensi bebas atau buatan sendiri.

## 5. Nama & logo

- ✓ `TRADEMARK.md`: fork boleh, nama dan logo OneWebDev tidak.
- ✓ Nama produk diseragamkan menjadi "OneWebDev" di seluruh aplikasi dan hasil ekspor.

## 6. Analitik

- ✓ Vercel Analytics mati secara bawaan pada build frontend-only; nyala hanya dengan `VITE_VERCEL_ANALYTICS=true`. Disebut di README bagian Privasi.

## 7. Dokumen dasar

- ✓ README (fitur, janji, lisensi, privasi), `CONTRIBUTING.md`, `SECURITY.md`, `CODE_OF_CONDUCT.md`.
- ✓ Template issue (`bug_report`, `feature_request`) dan PR di `.github/`.
- ✓ CI terbuka: `frontend-ci` (typecheck, lint, test, build) dan `templates-check` (400 template).

## 8. Janji tertulis

- ✓ README bagian "Janji versi frontend-only": gratis dan lengkap, tanpa versi Pro dari kode ini, dan rilis lama yang berlisensi AGPL tetap AGPL.

## Teks antarmuka frontend-only

- ✓ Label "Demo"/"Mode demo" diganti: lencana header "Tanpa akun", widget sidebar "Berjalan di browser", status simpan "Tersimpan di browser perangkat ini.", panduan "OneWebDev adalah kumpulan alat developer…".
- ✓ Tidak ada batas folder website, desain, atau scene 360° di frontend-only (`UNLIMITED_LIMIT`, `vrCap`).
