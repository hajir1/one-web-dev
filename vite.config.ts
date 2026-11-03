import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** Asal (origin) backend dari VITE_API_BASE_URL, sama dengan resolveApiBase() di apiConfig.ts. */
function apiOrigin(raw: string | undefined): string | null {
  const v = (raw ?? "http://localhost:3000").trim();
  if (!/^https?:\/\//.test(v)) return null;
  try {
    return new URL(v).origin;
  } catch {
    return null;
  }
}

/*
 * Path backend bila API dipasang di domain yang sama (reverse proxy), termasuk callback
 * Google, notifikasi/redirect Midtrans, dan unduhan hasil job. Tidak ada rute SPA dengan
 * awalan ini (semua rute SPA ada di bawah /id atau /en), jadi aman dikecualikan dari
 * navigateFallback. Pola yang sama ditulis ulang di dalam urlPattern di bawah karena
 * fungsi itu diserialisasi ke sw.js dan tidak bisa memakai variabel dari file ini.
 */
const BACKEND_NAV = /^\/(api|auth|billing|payments?|webhooks?|midtrans|jobs|media\/jobs|exports|uploads)(\/|$)/;
const FILE_NAV = /\/[^/]+\.(xml|txt|json|pdf|zip|png|jpe?g|svg|ico|js|css|map|wasm|webmanifest)$/i;

/**
 * v13: awalan path situs (Vite `base`). Bawaan "/". Untuk GitHub Pages proyek
 * (https://nama.github.io/repo/) isi VITE_BASE_PATH=/repo/. Selalu diawali & diakhiri "/".
 */
function basePath(raw: string | undefined): string {
  const v = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  return v ? `/${v}/` : "/";
}

/** Modul isi template (sumber template & spesifikasi demo hasil generator). */
const TEMPLATE_MODULE = /[\\/]src[\\/](pages[\\/]webTemplates[\\/](templates[\\/]|assets|build|codeTemplates[\\/]files)|demo[\\/]demoSpecs)/;

/** Modul pengganti isi template demo pada build non-demo (lihat plugin owd-demo-content). */
const EMPTY_DEMO_CONTENT = "\0owd-demo-content-empty";
/**
 * Berkas Template Kode (?raw) hanya ikut di build mode demo. Mode fullstack (v21.2)
 * mengambil HTML-nya dari backend v14 (POST /templates/:id/acquire), sehingga isi
 * template Premium tidak ada di dist/ situs produksi.
 */
const EMPTY_CODE_TEMPLATE = "\0owd-code-template-empty";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const api = apiOrigin(env.VITE_API_BASE_URL ?? env.VITE_MEDIA_API_BASE);
  // Mode demo = tanpa backend (sama dengan resolveApiBase() → null di apiConfig.ts).
  const demo = api === null;
  const base = basePath(env.VITE_BASE_PATH);

  return {
    base,
    worker: {
      format: "es",
      // Awalan "w-" menandai bundel Web Worker (codec/encoder media) agar mudah dikecualikan dari precache.
      rollupOptions: { output: { entryFileNames: "assets/w-[name]-[hash].js", chunkFileNames: "assets/w-[name]-[hash].js" } },
    },
    // Codec media dimuat dinamis di worker; dibundel di awal agar `vite dev` tidak reload saat pertama dipakai.
    optimizeDeps: {
      include: [
        "@jsquash/avif/decode.js", "@jsquash/avif/encode.js", "@jsquash/jpeg/decode.js", "@jsquash/jpeg/encode.js",
        "@jsquash/jxl/decode.js", "@jsquash/jxl/encode.js", "@jsquash/png/decode.js", "@jsquash/png/encode.js",
        "@jsquash/qoi/decode.js", "@jsquash/qoi/encode.js", "@jsquash/webp/decode.js", "@jsquash/webp/encode.js",
        "gifenc", "utif2", "mediabunny", "@mediabunny/aac-encoder", "@mediabunny/flac-encoder", "@mediabunny/mp3-encoder", "wasm-media-encoders",
      ],
    },
    build: {
      rollupOptions: {
        output: {
          // v13: chunk isi template (hanya ada di build demo) diberi awalan "tpl-" agar tidak
          // di-precache (lihat globIgnores); diunduh saat template dibuka lalu di-cache runtime.
          chunkFileNames: (c) =>
            c.moduleIds.length > 0 && c.moduleIds.every((id) => TEMPLATE_MODULE.test(id)) ? "assets/tpl-[name]-[hash].js" : "assets/[name]-[hash].js",
          // Vendor yang jarang berubah dipisah dari kode aplikasi: cache browser/SW tetap valid antar-deploy.
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-dom/client", "scheduler", "react-router"],
            "vendor-i18n": ["i18next", "react-i18next"],
            "vendor-query": ["@tanstack/react-query"],
            // Sentry hanya dimuat bila VITE_SENTRY_DSN diisi (lihat observability.ts).
            "vendor-sentry": ["@sentry/react"],
          },
        },
      },
    },
    plugins: [
      {
        // v13: isi template demo (semua template katalog) HANYA ikut di build mode demo.
        // Build produksi memakai modul kosong, sehingga isi template Premium tidak pernah
        // ada di dist/ situs produksi (template produksi tetap diambil dari server).
        name: "owd-demo-content",
        enforce: "pre",
        resolveId(source, importer) {
          if (!demo && /\/demoContent\.generated(\.ts)?$/.test(source)) return EMPTY_DEMO_CONTENT;
          if (!demo && /\.html\?raw$/.test(source) && /[\\/]codeTemplates[\\/]/.test(importer ?? "")) return EMPTY_CODE_TEMPLATE;
          return null;
        },
        load(id) {
          if (id === EMPTY_CODE_TEMPLATE) return 'export default "";';
          return id === EMPTY_DEMO_CONTENT ? "export const DEMO_PAGES = {};\nexport const DEMO_LOADERS = {};" : null;
        },
      },
      react(),
      tailwindcss(),
      VitePWA({
        // "prompt": versi baru menunggu sampai pengguna menekan "Muat ulang" (lihat PwaUpdatePrompt).
        registerType: "prompt",
        injectRegister: false,
        // Ikon, favicon, dan offline.html sudah tercakup globPatterns; jangan didaftarkan dua kali.
        includeManifestIcons: false,
        manifest: {
          id: base,
          name: "OneWebDev",
          short_name: "OneWebDev",
          description:
            "Platform alat developer web: Desain Halaman, element & component maker, template web, serta konversi media dan data langsung di browser.",
          lang: "id",
          dir: "ltr",
          start_url: base,
          scope: base,
          display: "standalone",
          orientation: "any",
          theme_color: "#3b68f0",
          background_color: "#ffffff",
          categories: ["developer", "productivity", "utilities"],
          // v9: ikon "1" baru (dibuat `npm run icons`, sumber geometri di generate-icons.mjs).
          icons: [
            { src: "favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
            { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
            { src: "pwa-192x192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "pwa-512x512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            { src: "maskable-icon-192x192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
            { src: "maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
          ],
          shortcuts: [
            { name: "Desain Halaman", short_name: "Desain", url: `${base}id/page-maker`, icons: [{ src: "pwa-192x192.png", sizes: "192x192" }] },
            { name: "Media Tools", short_name: "Media", url: `${base}id/media-tools`, icons: [{ src: "pwa-192x192.png", sizes: "192x192" }] },
          ],
        },
        workbox: {
          // Precache: kerangka aplikasi + chunk rute. Modul besar (codec WASM, encoder audio,
          // ExcelJS, preset section, model) TIDAK di-precache agar instalasi awal ringan;
          // semuanya di-cache saat pertama dipakai lewat runtimeCaching di bawah.
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
          globIgnores: [
            "**/node_modules/**",
            "icons/**", // logo lama, tidak dipakai aplikasi (lihat LAPORAN)
            "favicon.png",
            "og-image.png", // hanya untuk pratinjau tautan media sosial
            "brand/**", // berkas sumber logo (SVG/PNG) untuk dipakai di luar aplikasi
            "assets/w-*.js", // Web Worker media + encoder (dimuat saat alat media dipakai)
            "assets/sectionPresets-*.js", // ±1,3 MB data preset/template Desain Halaman
            "assets/excelUtils-*.js", // ExcelJS ±0,9 MB, hanya untuk alat Data
            "assets/pdf-*.js", // v10: pdf.js ±450 KB, hanya untuk Alat PDF (PDF → gambar, kompres)
            "assets/pdfLib-*.js", // v10: pdf-lib ±400 KB, hanya untuk Alat PDF
            "assets/vendor-sentry-*.js", // opsional, hanya bila Sentry aktif
            "assets/tpl-*.js", // v13: isi template mode demo (dimuat saat template dibuka)
          ],
          // Batas precache per file. File lebih besar tidak gagal-build, hanya diberi peringatan
          // dan tetap di-cache saat dipakai (runtimeCaching "owd-lazy-modules").
          maximumFileSizeToCacheInBytes: 512 * 1024,
          cleanupOutdatedCaches: true,
          navigateFallback: `${base}index.html`,
          navigateFallbackDenylist: [BACKEND_NAV, /\/(callback|oauth2?)(\/|$)/, /^\/__/, /^\/_vercel\//, FILE_NAV],
          runtimeCaching: [
            // 1) Backend (auth, kredit, pembayaran Midtrans, callback Google, job, unduhan): selalu jaringan.
            ...(api
              ? [{ urlPattern: new RegExp(`^${escapeRe(api)}/`), handler: "NetworkOnly" as const }]
              : []),
            {
              // Navigasi ke path ini ditangani aturan terakhir (agar offline mendapat offline.html).
              urlPattern: ({ url, request, sameOrigin }) =>
                sameOrigin &&
                request.mode !== "navigate" &&
                /^\/(api|auth|billing|payments?|webhooks?|midtrans|jobs|media\/jobs|exports|uploads)(\/|$)|\/(callback|oauth2?)(\/|$)/.test(url.pathname),
              handler: "NetworkOnly",
            },
            // Vercel Web Analytics (skrip & kiriman data): jangan pernah di-cache.
            { urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/_vercel/"), handler: "NetworkOnly" },
            {
              urlPattern: /^https:\/\/([a-z0-9-]+\.)*(midtrans\.com|veritrans\.co\.id|accounts\.google\.com|googleapis\.com\/oauth2|sentry\.io)\//,
              handler: "NetworkOnly",
            },
            // Thumbnail katalog (v21): nama berkas tetap, versi lewat ?v=hash → aman CacheFirst.
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/thumbs\/[^/]+\.webp$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "owd-thumbs",
                expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            // 2) WASM & modul besar same-origin (nama file ber-hash → aman CacheFirst).
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/assets\/.+\.wasm$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "owd-wasm",
                expiration: { maxEntries: 40, maxAgeSeconds: 60 * 60 * 24 * 60, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/assets\/.+\.(m?js|css)$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "owd-lazy-modules",
                expiration: { maxEntries: 140, maxAgeSeconds: 60 * 60 * 24 * 60, purgeOnQuotaError: true }, // v13: +chunk template demo
                cacheableResponse: { statuses: [200] },
              },
            },
            // Runtime ONNX untuk Hapus Latar (URL ber-versi di jsDelivr).
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@huggingface\/transformers@[^/]+\/dist\/.+\.(wasm|mjs)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "owd-onnx-runtime",
                expiration: { maxEntries: 6, maxAgeSeconds: 60 * 60 * 24 * 60, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            // 3) Gambar & font.
            {
              urlPattern: ({ request, sameOrigin }) => sameOrigin && request.destination === "image",
              handler: "CacheFirst",
              options: {
                cacheName: "owd-images",
                expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/,
              handler: "StaleWhileRevalidate",
              options: { cacheName: "owd-google-fonts-css", expiration: { maxEntries: 30 } },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/,
              handler: "CacheFirst",
              options: {
                cacheName: "owd-google-fonts",
                expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 365, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
            // 4) Navigasi yang tidak dilayani kerangka SPA (mis. path backend) saat offline → offline.html.
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkOnly",
              options: { precacheFallback: { fallbackURL: `${base}offline.html` } },
            },
          ],
        },
        showMaximumFileSizeToCacheInBytesWarning: true,
        devOptions: { enabled: false },
      }),
    ],
  };
});
