import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");

/** The backend origin from VITE_API_BASE_URL, same as resolveApiBase() in apiConfig.ts. */
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
 * Backend paths when the API is served on the same domain (reverse proxy), including the Google
 * callback, Midtrans notifications/redirects, and job result downloads. No SPA route has
 * this prefix (every SPA route lives under /id or /en), so it is safe to exclude from
 * navigateFallback. The same pattern is rewritten inside urlPattern below because
 * that function is serialized into sw.js and cannot use variables from this file.
 */
const BACKEND_NAV = /^\/(api|auth|billing|payments?|webhooks?|midtrans|jobs|media\/jobs|exports|uploads)(\/|$)/;
const FILE_NAV = /\/[^/]+\.(xml|txt|json|pdf|zip|png|jpe?g|svg|ico|js|css|map|wasm|webmanifest)$/i;

/**
 * v13: site path prefix (Vite `base`). Default "/". For a GitHub Pages project
 * (https://name.github.io/repo/) set VITE_BASE_PATH=/repo/. Always starts & ends with "/".
 */
function basePath(raw: string | undefined): string {
  const v = (raw ?? "").trim().replace(/^\/+|\/+$/g, "");
  return v ? `/${v}/` : "/";
}

/** Template content modules (template sources & generated demo specs). */
const TEMPLATE_MODULE = /[\\/]src[\\/](pages[\\/]webTemplates[\\/](templates[\\/]|assets|build|codeTemplates[\\/]files)|demo[\\/]demoSpecs)/;

/** Replacement module for the demo template content in non-demo builds (see the owd-demo-content plugin). */
const EMPTY_DEMO_CONTENT = "\0owd-demo-content-empty";
/**
 * Code Template files (?raw) are only included in demo mode builds. Fullstack mode (v21.2)
 * fetches their HTML from backend v14 (POST /templates/:id/acquire), so the content of
 * Premium templates is not in the production site's dist/.
 */
const EMPTY_CODE_TEMPLATE = "\0owd-code-template-empty";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const api = apiOrigin(env.VITE_API_BASE_URL ?? env.VITE_MEDIA_API_BASE);
  // Demo mode = no backend (same as resolveApiBase() → null in apiConfig.ts).
  const demo = api === null;
  const base = basePath(env.VITE_BASE_PATH);

  return {
    base,
    worker: {
      format: "es",
      // The "w-" prefix marks Web Worker bundles (media codecs/encoders) so they are easy to exclude from precache.
      rollupOptions: { output: { entryFileNames: "assets/w-[name]-[hash].js", chunkFileNames: "assets/w-[name]-[hash].js" } },
    },
    // Media codecs load dynamically in the worker; prebundled so `vite dev` does not reload on first use.
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
          // v13: template content chunks (only in demo builds) get a "tpl-" prefix so they are not
          // precached (see globIgnores); downloaded when a template opens, then cached at runtime.
          chunkFileNames: (c) =>
            c.moduleIds.length > 0 && c.moduleIds.every((id) => TEMPLATE_MODULE.test(id)) ? "assets/tpl-[name]-[hash].js" : "assets/[name]-[hash].js",
          // Rarely changing vendors are split from app code: browser/SW caches stay valid across deploys.
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-dom/client", "scheduler", "react-router"],
            "vendor-i18n": ["i18next", "react-i18next"],
            "vendor-query": ["@tanstack/react-query"],
            // Sentry only loads when VITE_SENTRY_DSN is set (see observability.ts).
            "vendor-sentry": ["@sentry/react"],
          },
        },
      },
    },
    plugins: [
      {
        // v13: demo template content (every catalog template) is ONLY included in demo mode builds.
        // The production build uses an empty module, so Premium template content is never
        // in the production site's dist/ (production templates still come from the server).
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
        // "prompt": a new version waits until the user presses "Reload" (see PwaUpdatePrompt).
        registerType: "prompt",
        injectRegister: false,
        // Icons, favicons, and offline.html are already covered by globPatterns; do not register them twice.
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
          // v9: the new "1" icon (made by `npm run icons`, geometry source in generate-icons.mjs).
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
          // Precache: the app shell + route chunks. Large modules (WASM codecs, audio encoders,
          // ExcelJS, section presets, models) are NOT precached so the initial install stays light;
          // they are all cached on first use through runtimeCaching below.
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
          globIgnores: [
            "**/node_modules/**",
            "icons/**", // old logo, not used by the app (see LAPORAN)
            "favicon.png",
            "og-image.png", // only for social media link previews
            "brand/**", // logo source files (SVG/PNG) for use outside the app
            "assets/w-*.js", // media Web Workers + encoders (loaded when media tools are used)
            "assets/sectionPresets-*.js", // ±1.3 MB of Page Design preset/template data
            "assets/excelUtils-*.js", // ExcelJS about 0.9 MB, only for the Data tools
            "assets/pdf-*.js", // v10: pdf.js about 450 KB, only for the PDF Tools (PDF → images, compression)
            "assets/pdfLib-*.js", // v10: pdf-lib about 400 KB, only for the PDF Tools
            "assets/vendor-sentry-*.js", // optional, only when Sentry is active
            "assets/tpl-*.js", // v13: demo mode template content (loaded when a template opens)
          ],
          // Precache limit per file. Larger files do not fail the build, they only get a warning
          // and are still cached on use (runtimeCaching "owd-lazy-modules").
          maximumFileSizeToCacheInBytes: 512 * 1024,
          cleanupOutdatedCaches: true,
          navigateFallback: `${base}index.html`,
          navigateFallbackDenylist: [BACKEND_NAV, /\/(callback|oauth2?)(\/|$)/, /^\/__/, /^\/_vercel\//, FILE_NAV],
          runtimeCaching: [
            // 1) Backend (auth, credits, Midtrans payments, Google callback, jobs, downloads): always network.
            ...(api
              ? [{ urlPattern: new RegExp(`^${escapeRe(api)}/`), handler: "NetworkOnly" as const }]
              : []),
            {
              // Navigation to these paths is handled by the last rule (so offline gets offline.html).
              urlPattern: ({ url, request, sameOrigin }) =>
                sameOrigin &&
                request.mode !== "navigate" &&
                /^\/(api|auth|billing|payments?|webhooks?|midtrans|jobs|media\/jobs|exports|uploads)(\/|$)|\/(callback|oauth2?)(\/|$)/.test(url.pathname),
              handler: "NetworkOnly",
            },
            // Vercel Web Analytics (script & data beacons): never cache.
            { urlPattern: ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith("/_vercel/"), handler: "NetworkOnly" },
            {
              urlPattern: /^https:\/\/([a-z0-9-]+\.)*(midtrans\.com|veritrans\.co\.id|accounts\.google\.com|googleapis\.com\/oauth2|sentry\.io)\//,
              handler: "NetworkOnly",
            },
            // Catalog thumbnails (v21): fixed file names, versioned via ?v=hash → safe for CacheFirst.
            {
              urlPattern: ({ url, sameOrigin }) => sameOrigin && /\/thumbs\/[^/]+\.webp$/.test(url.pathname),
              handler: "CacheFirst",
              options: {
                cacheName: "owd-thumbs",
                expiration: { maxEntries: 400, maxAgeSeconds: 60 * 60 * 24 * 30, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            // 2) Same-origin WASM & large modules (hashed file names → safe for CacheFirst).
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
            // ONNX runtime for Remove Background (versioned URLs on jsDelivr).
            {
              urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/npm\/@huggingface\/transformers@[^/]+\/dist\/.+\.(wasm|mjs)$/,
              handler: "CacheFirst",
              options: {
                cacheName: "owd-onnx-runtime",
                expiration: { maxEntries: 6, maxAgeSeconds: 60 * 60 * 24 * 60, purgeOnQuotaError: true },
                cacheableResponse: { statuses: [200] },
              },
            },
            // 3) Images & fonts.
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
            // 4) Navigation not served by the SPA shell (e.g. backend paths) while offline → offline.html.
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
