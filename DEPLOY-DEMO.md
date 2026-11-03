# Deploy mode demo (GitHub Pages / Vercel)

Mode demo adalah frontend tanpa backend (`VITE_API_BASE_URL=off`): tanpa akun, kredit, dan paket; semua template katalog bawaan frontend dan semuanya gratis; hanya alat yang berjalan di browser. Hasil build berupa situs statis, jadi bisa di-host gratis di GitHub Pages atau Vercel.

Panduan ini menganggap isi folder `fe/` adalah root repo (ada `package.json` di root).

## Build lokal

```bash
npm ci
npm run build:demo      # memakai .env.demo → dist/
npm run preview         # cek di http://localhost:4173
```

## Vercel

1. Buat **proyek Vercel baru** khusus demo: Add New → Project → pilih repo. Bila `package.json` ada di subfolder, isi **Root Directory** dengan `fe`.
2. Di **Environment Variables**, tambahkan `VITE_API_BASE_URL` = `off`.
3. Klik Deploy. `vercel.json` sudah mengatur build, rewrite SPA (semua rute ke `index.html`), dan header cache service worker.

Catatan: jangan mengubah Build Command di dashboard, karena `buildCommand` di `vercel.json` yang dipakai. Mode demo ditentukan oleh variabel lingkungan di langkah 2. Situs produksi tetap memakai proyek Vercel yang lain, dengan `VITE_API_BASE_URL` berisi URL backend.

## GitHub Pages

Workflow-nya sudah ada di `.github/workflows/deploy-pages.yml`.

1. Push kode ke GitHub.
2. Buka **Settings → Pages → Build and deployment → Source** dan pilih **GitHub Actions**.
3. Buka tab **Actions → deploy-demo-pages → Run workflow**. Setelah selesai, situs ada di `https://<nama>.github.io/<repo>/`.

Workflow ini menjalankan `npm test`, lalu `npm run build:demo`. Awalan path (`/<repo>/`) diisi otomatis dari GitHub. Karena GitHub Pages tidak punya rewrite, workflow menyalin `index.html` ke `404.html` supaya alamat seperti `/<repo>/id/page-maker` tetap terbuka saat dibuka langsung atau di-refresh.

Pengaturan opsional (Settings → Secrets and variables → Actions → Variables):

| Variabel | Fungsi |
|---|---|
| `DEMO_PAGES_AUTO` = `true` | Deploy otomatis setiap push ke `main`/`master`. Tanpa ini, deploy hanya lewat "Run workflow". |
| `DEMO_BASE_PATH` | Menimpa awalan path, misalnya `/` untuk domain sendiri. |

Bila `package.json` ada di subfolder `fe/`, pindahkan workflow ke `.github/workflows/` di root repo, lalu tambahkan `defaults: run: working-directory: fe` di job `build` dan ubah `path: dist` menjadi `path: fe/dist`.

## Host lain

Situs statis lain juga bisa (Netlify, Cloudflare Pages, Nginx): jalankan `npm run build:demo` lalu sajikan `dist/` dengan fallback SPA ke `index.html`. Bila situs tidak di root domain, isi `VITE_BASE_PATH=/subfolder/` saat build.

## Setelah template berubah

Bila katalog template bertambah atau isi template berubah, jalankan `npm run gen:demo` lalu commit hasilnya (`src/demo/*.generated.ts`). Uji `src/demo/tests/demo.test.ts` akan gagal bila lupa.
