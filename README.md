# OneWebDev — frontend

A collection of developer tools that run in the browser: build websites from 400+ templates, design pages with drag and drop and export them to HTML, React, Vue, Svelte, or Angular, process data (Excel, JSON, SQL, PDF), edit media (images, audio, video), and create 360° tours.

**The frontend-only version** (`VITE_API_BASE_URL=off`) runs without a server and without an account. Every template, element, and feature inside it is fully open; your data stays in your browser and files are never uploaded.

React 19 + Vite 6 + TypeScript + Tailwind CSS 4.

> 🇮🇩 Ringkasan dalam Bahasa Indonesia ada di [bagian bawah](#bahasa-indonesia).

## The frontend-only promise

- The frontend-only version is **free and complete**. No locked features, no trial limits, and no "Pro version" of this code.
- The code is released under the **MIT license**. A release's license cannot be taken back; even if the project changes direction, code that is already open remains yours to use, fork, and build on. Versions released earlier under the AGPL-3.0 stay available under the AGPL-3.0 for anyone who received them.
- Analytics are **off** by default in this version (see Privacy).

## License

| Part | License | What it means |
| --- | --- | --- |
| Application code | [MIT](LICENSE) | Free to use, modify, and share, including commercially. Keep the copyright and license notice. |
| Templates and exported websites | [LICENSE-TEMPLATES.md](LICENSE-TEMPLATES.md) | Your website is yours (commercial use allowed, no attribution required). Templates are free for anyone to use, but **may not be resold as templates**. |
| OneWebDev name and logo | [TRADEMARK.md](TRADEMARK.md) | Forks are welcome, but use your own name and logo. |
| Third-party libraries | [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) | Includes the TailAdmin base (MIT). Update with `npm run notices`. |

## Privacy

- Files processed by the Data and Media tools are handled on your device and are not sent to a server.
- Designs, website folders, icons, and fonts are kept in browser storage (IndexedDB/localStorage).
- Vercel Web Analytics is only active when built on Vercel **with a backend**, or when you set `VITE_VERCEL_ANALYTICS=true`. In the frontend-only version it is off unless you turn it on yourself.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Security reports: [SECURITY.md](SECURITY.md). Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Support

If OneWebDev helps you, you can support its development on [Ko-fi](https://ko-fi.com/hajir1) or [Saweria](https://saweria.co/hajir1). Both are also behind the **Sponsor** button on GitHub (see [`.github/FUNDING.yml`](.github/FUNDING.yml)).

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install dependencies exactly as in `package-lock.json` |
| `npm run dev` | Development server (the service worker is **not** active in this mode) |
| `npm run build` | `tsc -b`, then a production build into `dist/` (including `sw.js` and `manifest.webmanifest`) |
| `npm run build:demo` | **Frontend-only** build (no backend) using `.env.demo`. GitHub Pages/Vercel deploy guide: `DEPLOY-DEMO.md` |
| `npm run gen:demo` | Regenerate the frontend-only template content (`src/demo/*.generated.ts`) after the template catalog changes |
| `npm run preview` | Serves `dist/` at http://localhost:4173, to test the PWA locally |
| `npm run typecheck` / `npm run lint` / `npm test` | Type checking, ESLint, and `node:test` tests |
| `npm run templates:gen` / `templates:check` | Build every template, then check overflow (375/768/1280), JS errors, axe, and Lighthouse. See `scripts/templates-ci/` |
| `npm run notices` | Regenerate `THIRD_PARTY_NOTICES.md` from the dependencies |
| `npm run icons` | Regenerate the PWA icons from `public/favicon.svg` |

`.npmrc` skips downloading the `onnxruntime-node` CUDA binaries (a Node dependency of `@huggingface/transformers`); the app only uses the web runtime in the browser.

## Environment variables

`VITE_API_BASE_URL` holds the Nest backend URL (default `http://localhost:3000`; set it to `off` to run without a backend). The service worker uses it too: every request to that origin always goes to the network (never cached). Sentry is optional through `VITE_SENTRY_DSN`.

`VITE_BASE_PATH` (optional, default `/`) sets the path prefix when the site is not at the domain root, for example `/repo/` for a GitHub Pages project site.

## PWA

- Configured in `vite.config.ts` (`vite-plugin-pwa`, `generateSW` mode, `registerType: "prompt"`).
- The "Reload to update" card is in `src/components/common/PwaUpdatePrompt.tsx`; the install button is in `PwaInstallPrompt.tsx`.
- Offline page: `public/offline.html`.
- The service worker only runs over HTTPS (or `localhost`). Cache headers for `sw.js` are set in `vercel.json`.

---

## Bahasa Indonesia

OneWebDev adalah kumpulan alat developer yang berjalan di browser: rakit website dari 400+ template, desain halaman dengan drag & drop lalu ekspor ke HTML, React, Vue, Svelte, atau Angular, olah data dan media, serta buat tur 360°. Versi frontend-only (`VITE_API_BASE_URL=off`) gratis, lengkap, berjalan tanpa server dan tanpa akun, dan data Anda tetap di browser.

- **Lisensi:** kode aplikasi berlisensi MIT. Website hasil ekspor sepenuhnya milik Anda (boleh komersial, tanpa atribusi), tetapi template **tidak boleh dijual ulang sebagai template**. Detail lengkap ada di dokumen berbahasa Inggris di atas.
- **Mulai:** `npm ci`, `cp .env.demo .env.local`, lalu `npm run dev`.
- **Kontribusi:** issue dan pull request boleh dalam bahasa Indonesia atau Inggris. Lihat [CONTRIBUTING.md](CONTRIBUTING.md).
- **Dukungan:** bila OneWebDev bermanfaat, Anda bisa mendukung pengembangannya lewat [Ko-fi](https://ko-fi.com/hajir1) atau [Saweria](https://saweria.co/hajir1). Keduanya juga ada di tombol **Sponsor** GitHub (lihat [`.github/FUNDING.yml`](.github/FUNDING.yml)).
