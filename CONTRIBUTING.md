# Berkontribusi

Terima kasih sudah mau membantu. Issue dan pull request boleh dalam bahasa Indonesia atau Inggris.

## Menyiapkan proyek

```bash
npm ci
cp .env.demo .env.local   # menjalankan frontend-only, tanpa backend
npm run dev
```

## Sebelum membuka pull request

```bash
npm run typecheck
npm run lint
npm test
```

Bila mengubah template atau elemen Desain Halaman, jalankan juga pemeriksaan template (butuh Playwright dan axe-core):

```bash
npm i --no-save playwright@1.63.0 axe-core@4.10.3 && npx playwright install chromium
npm run templates:gen && npm run templates:check
```

CI gagal bila ada masalah **baru** (overflow di HP, error JavaScript, pelanggaran aksesibilitas). Bila perubahan Anda memperbaiki template, perbarui baseline dengan `npm run templates:baseline` dan sertakan `scripts/templates-ci/baseline.json` di PR.

## Gaya

- Teks antarmuka selalu lewat `src/locales/id.json` dan `en.json` (keduanya diisi).
- Satu komponen per berkas; berkas di atas ±600 baris sebaiknya dipecah.
- Template baru: ikuti pola di `src/pages/webTemplates/templates/`, uji di lebar 375, 768, dan 1280.

## Lisensi kontribusi

Dengan mengirim kontribusi, Anda setuju kontribusi itu dirilis di bawah lisensi yang sama dengan proyek (AGPL-3.0; untuk template berlaku juga `LICENSE-TEMPLATES.md`).
