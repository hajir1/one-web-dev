import type { GeneratedFile } from "../core/ui/CodeExportPanel";
import type { Framework } from "../core/helpers/generatorCss";
import { LIBRARY_BY_ID, libraryHead, libraryScripts, libraryTailTags, type LibraryId } from "../engine/helpers/libraries";
import { IMG_FALLBACK_TAG } from "./imagePlaceholder";
import i18n from "../../../i18n";

/* ================================================================== */
/* Ready-to-run project scaffold for the export output (v7)             */
/*                                                                    */
/* Every format downloads as a ZIP that can run right away:            */
/*   HTML     open index.html (no build)                                */
/*   Blade    routes/web.php + resources/views + public/assets (Laravel) */
/*   React    Vite + react-router-dom                                   */
/*   Vue      Vite + vue-router                                         */
/*   Svelte   Vite + Svelte 4 (built-in hash router)                    */
/*   Angular  Angular CLI 18 (application builder, standalone)           */
/* Dependency versions are pinned (no ^) so builds are reproducible;    */
/* this combination is build-tested in tools/verifyExports.ts.          */
/* ================================================================== */

const PROJECT_VERSIONS = {
  vite: "5.4.11",
  react: "18.3.1",
  reactRouter: "6.28.0",
  pluginReact: "4.3.4",
  vue: "3.5.13",
  vueRouter: "4.5.0",
  pluginVue: "5.2.1",
  svelte: "4.2.19",
  pluginSvelte: "3.1.2",
  angular: "18.2.13",
  angularCli: "18.2.12",
  typescript: "5.5.4",
  zone: "0.14.10",
  rxjs: "7.8.1",
  tslib: "2.8.1",
} as const;

export interface ProjectPage {
  title: string;
  slug: string;
  isHome: boolean;
  /** File name without extension (index for the home page). */
  file: string;
}

export interface ProjectContext {
  /** Site name (README title, <title>). */
  name: string;
  pages: ProjectPage[];
  /** The combined CDN libraries of every page. */
  libs: LibraryId[];
  /** CSS global: variabel :root + reset dasar. */
  globalCss: string;
  /** v10: default <title> of the SPA index.html (home page SEO title). */
  headTitle?: string;
  /** v10: home page SEO meta tags for the SPA index.html <head>. */
  headExtra?: string;
}

const tr = (id: string, en: string) => (i18n.language?.startsWith("en") ? en : id);

/** A valid npm package name from the site name. */
function packageName(name: string): string {
  const s = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return s || "situs-onewebdev";
}

/** The same base styles as the Page Maker canvas/preview (pageShell.ts), so the export looks identical. */
export const BASE_RESET = `/* Base (same as the Page Maker preview) */
*, *::before, *::after {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  line-height: 1.5;
  background: #fff;
}

img {
  max-width: 100%;
}
`;

/** Library init lines (OWDMotion.init for AOS/Animate/Tilt) to rerun on every SPA page change. */
function libraryInitJs(libs: readonly LibraryId[]): string {
  return [...new Set(libs.map((id) => LIBRARY_BY_ID[id].init).filter(Boolean))].join("\n  ");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const indent = (s: string, n: number) =>
  s
    .split("\n")
    .map((l) => (l.trim() ? " ".repeat(n) + l : l))
    .join("\n");

/**
 * Turns file-style links between pages (`slug.html`, `index.html`) into
 * routes: `/slug` (router & Blade) or `#/slug` (Svelte). Only this site's
 * page slugs are changed; external links are untouched.
 */
export function rewritePageLinks(content: string, pages: readonly ProjectPage[], mode: "router" | "hash"): string {
  const files = new Map(pages.map((p) => [p.file, p] as const));
  return content.replace(/(\b(?:href|to|routerLink)=)(["'])([A-Za-z0-9_-]+)\.html(#[^"']*)?\2/g, (m, attr: string, q: string, file: string, hash?: string) => {
    const p = files.get(file);
    if (!p) return m;
    const path = p.isHome ? "/" : `/${p.slug}`;
    const route = mode === "hash" ? `#${path}` : path;
    return `${attr}${q}${route}${hash && mode !== "hash" ? hash : ""}${q}`;
  });
}

function routeTable(ctx: ProjectContext, mode: "file" | "router" | "hash"): string {
  return `| ${tr("Halaman", "Page")} | ${tr("Alamat", "Path")} |\n|---|---|\n${ctx.pages
    .map((p) => {
      const path = mode === "file" ? `${p.file}.html` : mode === "hash" ? (p.isHome ? "#/" : `#/${p.slug}`) : p.isHome ? "/" : `/${p.slug}`;
      return `| ${p.title.replace(/\|/g, "\\|")} | \`${path}\` |`;
    })
    .join("\n")}`;
}

function libsReadme(libs: readonly LibraryId[]): string {
  if (!libs.length) return "";
  return `\n## Library (CDN)\n\n${libs
    .map((id) => {
      const l = LIBRARY_BY_ID[id];
      return `- **${l.name} ${l.version}** (${l.license}): ${l.homepage}`;
    })
    .join("\n")}\n\n${tr(
    "Library dimuat dari CDN jsDelivr dengan versi terkunci (lihat `index.html` / layout). Inisialisasinya dijalankan ulang setiap pindah halaman.",
    "Libraries load from the jsDelivr CDN with pinned versions (see `index.html` / the layout). Their init code re-runs on every page change.",
  )}\n`;
}

const notes = () =>
  `\n## ${tr("Catatan", "Notes")}\n\n- ${tr("Variabel global (warna, ukuran, font) ada di blok `:root` CSS global. Ubah nilainya di sana untuk mengganti tema.", "Global variables (colours, sizes, fonts) live in the `:root` block of the global CSS. Change them there to re-theme the site.")}\n- ${tr("Font Google dimuat lewat `@import` di CSS; font cadangan sistem dipakai selama font belum termuat.", "Google Fonts load via `@import` in the CSS; system fallback fonts are used until they load.")}\n- ${tr("Formulir tidak mengirim data ke mana pun. Hubungkan ke backend atau layanan formulir Anda.", "Forms do not send data anywhere. Connect them to your backend or a form service.")}\n`;

function readme(ctx: ProjectContext, fw: string, steps: string, mode: "file" | "router" | "hash", extra = ""): GeneratedFile {
  return {
    name: "README.md",
    lang: "md",
    content: `# ${ctx.name}

${tr(`Hasil ekspor **OneWebDev** dalam format **${fw}**, ${ctx.pages.length} halaman.`, `Exported from **OneWebDev** as **${fw}**, ${ctx.pages.length} page(s).`)}

${routeTable(ctx, mode)}

## ${tr("Cara menjalankan", "How to run")}

${steps}
${extra}${libsReadme(ctx.libs)}${notes()}`,
  };
}

const json = (o: unknown) => JSON.stringify(o, null, 2) + "\n";

const headTags = (libs: readonly LibraryId[], pad = 4) => {
  const head = libraryHead(libs);
  return `${" ".repeat(pad)}${IMG_FALLBACK_TAG}${head ? `\n${indent(head, pad)}` : ""}`;
};

/** Library scripts at the end of <body> WITHOUT the init line (the app runs init after rendering). */
const libraryTailScripts = (libs: readonly LibraryId[]): string => libraryTailTags(libs);

const viteIndex = (ctx: ProjectContext, mount: string, entry: string) => `<!DOCTYPE html>
<html lang="${tr("id", "en")}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(ctx.headTitle ?? ctx.name)}</title>${ctx.headExtra ? `\n${indent(ctx.headExtra, 4)}` : ""}
${headTags(ctx.libs)}
  </head>
  <body>
    <div id="${mount}"></div>${libraryTailScripts(ctx.libs) ? `\n${indent(libraryTailScripts(ctx.libs), 4)}` : ""}
    <script type="module" src="${entry}"></script>
  </body>
</html>
`;

const initLibsFile = (ctx: ProjectContext, ext: "js" | "ts") => {
  const body = libraryInitJs(ctx.libs);
  const win = ext === "ts" ? "(window as any)" : "window";
  return `${ext === "ts" ? "// @ts-nocheck — memanggil library CDN global.\n" : ""}/** Re-run CDN library initialization after the page renders (SPA). */
export function initLibraries()${ext === "ts" ? ": void" : ""} {
  ${body ? body.replace(/\bwindow\./g, `${win}.`) : "// (tidak ada library yang perlu diinisialisasi)"}
}
`;
};

const npmSteps = (dev: string, out: string) =>
  tr(
    `Butuh Node.js 18 atau lebih baru.\n\n\`\`\`bash\nnpm install\nnpm run dev      # ${dev}\nnpm run build    # hasil siap unggah di folder \`${out}\`\n\`\`\`\n\nHosting: arahkan semua path ke \`index.html\` (SPA fallback), mis. \`try_files $uri /index.html;\` di nginx.`,
    `Requires Node.js 18 or newer.\n\n\`\`\`bash\nnpm install\nnpm run dev      # ${dev}\nnpm run build    # deployable output in \`${out}\`\n\`\`\`\n\nHosting: route every path to \`index.html\` (SPA fallback), e.g. \`try_files $uri /index.html;\` in nginx.`,
  );

/* ------------------------------ per format ------------------------------ */

export function htmlReadme(ctx: ProjectContext): GeneratedFile {
  return readme(
    ctx,
    "HTML + CSS",
    tr(
      "Tanpa build dan tanpa dependensi.\n\n1. Ekstrak zip, lalu buka `index.html` di peramban.\n2. Untuk hosting, unggah seluruh folder ke hosting statis (Netlify, Vercel, GitHub Pages, cPanel, dll.).\n\nPratinjau lokal dengan server (opsional): `npx serve .` atau `python3 -m http.server`.",
      "No build step and no dependencies.\n\n1. Extract the zip, then open `index.html` in a browser.\n2. To host it, upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel, etc.).\n\nOptional local server: `npx serve .` or `python3 -m http.server`.",
    ),
    "file",
    `\n## ${tr("Struktur", "Structure")}\n\n- \`*.html\`: ${tr("satu berkas per halaman", "one file per page")}\n- \`assets/global.css\`: ${tr("variabel global (:root), pemuat font, dan gaya dasar", "global variables (:root), font loaders and base styles")}\n- \`assets/<${tr("halaman", "page")}>.css/.js\`: ${tr("gaya & skrip tiap halaman", "per-page styles & scripts")}\n`,
  );
}

export function reactScaffold(ctx: ProjectContext): GeneratedFile[] {
  const V = PROJECT_VERSIONS;
  return [
    {
      name: "package.json",
      lang: "json",
      content: json({
        name: packageName(ctx.name),
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
        dependencies: { react: V.react, "react-dom": V.react, "react-router-dom": V.reactRouter },
        devDependencies: { "@vitejs/plugin-react": V.pluginReact, vite: V.vite },
      }),
    },
    { name: "vite.config.js", lang: "js", content: `import { defineConfig } from "vite";\nimport react from "@vitejs/plugin-react";\n\nexport default defineConfig({\n  plugins: [react()],\n});\n` },
    { name: "index.html", lang: "html", content: viteIndex(ctx, "root", "/src/main.jsx") },
    { name: "src/styles.css", lang: "css", content: ctx.globalCss },
    { name: "src/initLibraries.js", lang: "js", content: initLibsFile(ctx, "js") },
    readme(ctx, "React (Vite)", npmSteps("http://localhost:5173", "dist/"), "router"),
  ];
}

export function vueScaffold(ctx: ProjectContext): GeneratedFile[] {
  const V = PROJECT_VERSIONS;
  return [
    {
      name: "package.json",
      lang: "json",
      content: json({
        name: packageName(ctx.name),
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
        dependencies: { vue: V.vue, "vue-router": V.vueRouter },
        devDependencies: { "@vitejs/plugin-vue": V.pluginVue, vite: V.vite },
      }),
    },
    { name: "vite.config.js", lang: "js", content: `import { defineConfig } from "vite";\nimport vue from "@vitejs/plugin-vue";\n\nexport default defineConfig({\n  plugins: [vue()],\n});\n` },
    { name: "index.html", lang: "html", content: viteIndex(ctx, "app", "/src/main.js") },
    { name: "src/styles.css", lang: "css", content: ctx.globalCss },
    { name: "src/initLibraries.js", lang: "js", content: initLibsFile(ctx, "js") },
    readme(ctx, "Vue 3 (Vite)", npmSteps("http://localhost:5173", "dist/"), "router"),
  ];
}

export function svelteScaffold(ctx: ProjectContext): GeneratedFile[] {
  const V = PROJECT_VERSIONS;
  return [
    {
      name: "package.json",
      lang: "json",
      content: json({
        name: packageName(ctx.name),
        private: true,
        version: "1.0.0",
        type: "module",
        scripts: { dev: "vite", build: "vite build", preview: "vite preview" },
        devDependencies: { "@sveltejs/vite-plugin-svelte": V.pluginSvelte, svelte: V.svelte, vite: V.vite },
      }),
    },
    { name: "vite.config.js", lang: "js", content: `import { defineConfig } from "vite";\nimport { svelte } from "@sveltejs/vite-plugin-svelte";\n\nexport default defineConfig({\n  plugins: [svelte()],\n});\n` },
    { name: "index.html", lang: "html", content: viteIndex(ctx, "app", "/src/main.js") },
    { name: "src/styles.css", lang: "css", content: ctx.globalCss },
    { name: "src/initLibraries.js", lang: "js", content: initLibsFile(ctx, "js") },
    readme(
      ctx,
      "Svelte 4 (Vite)",
      tr(
        `Butuh Node.js 18 atau lebih baru.\n\n\`\`\`bash\nnpm install\nnpm run dev      # http://localhost:5173\nnpm run build    # hasil siap unggah di folder \`dist/\`\n\`\`\`\n\nRouter memakai hash (\`#/slug\`), jadi bisa diunggah ke hosting statis apa pun tanpa pengaturan tambahan.`,
        `Requires Node.js 18 or newer.\n\n\`\`\`bash\nnpm install\nnpm run dev      # http://localhost:5173\nnpm run build    # deployable output in \`dist/\`\n\`\`\`\n\nThe router uses hashes (\`#/slug\`), so it works on any static host without extra configuration.`,
      ),
      "hash",
    ),
  ];
}

export function angularScaffold(ctx: ProjectContext): GeneratedFile[] {
  const V = PROJECT_VERSIONS;
  const pkg = packageName(ctx.name);
  return [
    {
      name: "package.json",
      lang: "json",
      content: json({
        name: pkg,
        version: "1.0.0",
        private: true,
        scripts: { ng: "ng", start: "ng serve", build: "ng build" },
        dependencies: {
          "@angular/common": V.angular,
          "@angular/compiler": V.angular,
          "@angular/core": V.angular,
          "@angular/platform-browser": V.angular,
          "@angular/router": V.angular,
          rxjs: V.rxjs,
          tslib: V.tslib,
          "zone.js": V.zone,
        },
        devDependencies: {
          "@angular/build": V.angularCli,
          "@angular/cli": V.angularCli,
          "@angular/compiler-cli": V.angular,
          typescript: V.typescript,
        },
      }),
    },
    {
      name: "angular.json",
      lang: "json",
      content: json({
        $schema: "./node_modules/@angular/cli/lib/config/schema.json",
        version: 1,
        newProjectRoot: "projects",
        cli: { analytics: false },
        projects: {
          [pkg]: {
            projectType: "application",
            root: "",
            sourceRoot: "src",
            prefix: "app",
            architect: {
              build: {
                builder: "@angular/build:application",
                options: {
                  outputPath: "dist",
                  index: "src/index.html",
                  browser: "src/main.ts",
                  polyfills: ["zone.js"],
                  tsConfig: "tsconfig.app.json",
                  assets: [{ glob: "**/*", input: "public" }],
                  styles: ["src/styles.css"],
                },
                configurations: {
                  production: { outputHashing: "all", budgets: [{ type: "initial", maximumWarning: "2mb", maximumError: "5mb" }, { type: "anyComponentStyle", maximumWarning: "64kb", maximumError: "512kb" }] },
                  development: { optimization: false, extractLicenses: false, sourceMap: true },
                },
                defaultConfiguration: "production",
              },
              serve: {
                builder: "@angular/build:dev-server",
                configurations: { production: { buildTarget: `${pkg}:build:production` }, development: { buildTarget: `${pkg}:build:development` } },
                defaultConfiguration: "development",
              },
            },
          },
        },
      }),
    },
    {
      name: "tsconfig.json",
      lang: "json",
      content: json({
        compileOnSave: false,
        compilerOptions: {
          outDir: "./dist/out-tsc",
          strict: false,
          noImplicitOverride: true,
          skipLibCheck: true,
          esModuleInterop: true,
          sourceMap: true,
          declaration: false,
          experimentalDecorators: true,
          moduleResolution: "bundler",
          importHelpers: true,
          target: "ES2022",
          module: "ES2022",
          lib: ["ES2022", "dom"],
        },
        angularCompilerOptions: { strictInjectionParameters: true, strictInputAccessModifiers: true, strictTemplates: false },
      }),
    },
    { name: "tsconfig.app.json", lang: "json", content: json({ extends: "./tsconfig.json", compilerOptions: { outDir: "./out-tsc/app", types: [] }, files: ["src/main.ts"], include: ["src/**/*.d.ts"] }) },
    {
      name: "src/index.html",
      lang: "html",
      content: `<!doctype html>
<html lang="${tr("id", "en")}">
  <head>
    <meta charset="utf-8" />
    <title>${esc(ctx.headTitle ?? ctx.name)}</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />${ctx.headExtra ? `\n${indent(ctx.headExtra, 4)}` : ""}
${headTags(ctx.libs)}
  </head>
  <body>
    <app-root></app-root>${libraryTailScripts(ctx.libs) ? `\n${indent(libraryTailScripts(ctx.libs), 4)}` : ""}
  </body>
</html>
`,
    },
    { name: "src/styles.css", lang: "css", content: ctx.globalCss },
    { name: "src/app/init-libraries.ts", lang: "ts", content: initLibsFile(ctx, "ts") },
    { name: "public/.gitkeep", lang: "text", content: "" },
    readme(
      ctx,
      "Angular 18",
      tr(
        `Butuh Node.js 18.19 atau lebih baru.\n\n\`\`\`bash\nnpm install\nnpm start        # http://localhost:4200\nnpm run build    # hasil siap unggah di folder \`dist/browser\`\n\`\`\`\n\nHosting: arahkan semua path ke \`index.html\` (SPA fallback).`,
        `Requires Node.js 18.19 or newer.\n\n\`\`\`bash\nnpm install\nnpm start        # http://localhost:4200\nnpm run build    # deployable output in \`dist/browser\`\n\`\`\`\n\nHosting: route every path to \`index.html\` (SPA fallback).`,
      ),
      "router",
    ),
  ];
}

/* --------------------------------- Blade --------------------------------- */

/** String PHP berkutip tunggal. */
const phpStr = (s: string) => `'${s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;

export interface BladePage extends ProjectPage {
  /** v10: full title (SEO); empty = "<title> — <site name>". */
  fullTitle?: string;
  /** v10: SEO meta tags for <head>. */
  meta?: string;
  body: string;
  css: string;
  script: string;
  libs: LibraryId[];
}

/**
 * Laravel Blade: one layout + one view per page. Page content is wrapped in
 * `@verbatim` so text such as `{{ }}` or `@handle` is not treated as Blade
 * syntax. Per-page CSS/JS in `public/assets` is loaded through `asset()`.
 */
export function bladeProject(ctx: ProjectContext, pages: BladePage[]): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  const layout = `<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>@yield('title')</title>
  <link rel="stylesheet" href="{{ asset('assets/global.css') }}" />
  ${IMG_FALLBACK_TAG.replace(/@/g, "&#64;")}
  @stack('head')
</head>
<body>
  @yield('content')
  @stack('scripts')
</body>
</html>
`;
  files.push({ name: "resources/views/layouts/app.blade.php", lang: "php", content: layout });
  files.push({ name: "public/assets/global.css", lang: "css", content: ctx.globalCss });
  for (const p of pages) {
    const body = rewritePageLinks(p.body, ctx.pages, "router").replace(/@endverbatim/gi, "&#64;endverbatim");
    const head = libraryHead(p.libs);
    const tail = libraryScripts(p.libs);
    files.push({
      name: `resources/views/pages/${p.file}.blade.php`,
      lang: "php",
      content: `@extends('layouts.app')

@section('title')
@verbatim${esc(p.fullTitle ?? `${p.title} — ${ctx.name}`).replace(/@endverbatim/gi, "&#64;endverbatim")}@endverbatim@endsection

@push('head')${p.meta ? `\n@verbatim\n${indent(p.meta.replace(/@endverbatim/gi, "&#64;endverbatim"), 2)}\n@endverbatim` : ""}
  <link rel="stylesheet" href="{{ asset('assets/${p.file}.css') }}" />${head ? `\n${indent(head.replace(/@/g, "&#64;"), 2)}` : ""}
@endpush

@section('content')
@verbatim
${indent(body, 2)}
@endverbatim
@endsection
${tail || p.script ? `\n@push('scripts')${tail ? `\n${indent(tail.replace(/@/g, "&#64;"), 2)}` : ""}${p.script ? `\n  <script src="{{ asset('assets/${p.file}.js') }}"></script>` : ""}\n@endpush\n` : ""}`,
    });
    files.push({ name: `public/assets/${p.file}.css`, lang: "css", content: p.css });
    if (p.script) files.push({ name: `public/assets/${p.file}.js`, lang: "js", content: p.script.trim() + "\n" });
  }
  const routes = `<?php

use Illuminate\\Support\\Facades\\Route;

/*
| Page routes exported by OneWebDev.
| Add the lines below to your Laravel project's routes/web.php.
*/

${pages.map((p) => `Route::view(${phpStr(p.isHome ? "/" : `/${p.slug}`)}, ${phpStr(`pages.${p.file}`)})->name(${phpStr(`page.${p.isHome ? "home" : p.slug}`)});`).join("\n")}
`;
  files.push({ name: "routes/web.php", lang: "php", content: routes });
  files.push(
    readme(
      ctx,
      "Laravel Blade",
      tr(
        `Butuh PHP 8.2+ dan Composer.\n\n\`\`\`bash\ncomposer create-project laravel/laravel situs\n# salin folder resources/, public/, dan routes/ dari zip ini ke dalam folder situs (timpa routes/web.php)\ncd situs\nphp artisan serve   # http://127.0.0.1:8000\n\`\`\`\n\nBila muncul error database (tabel sesi belum ada), jalankan \`php artisan migrate\` sekali.\n\nBila proyek Laravel Anda sudah punya rute lain, cukup tempel baris \`Route::view(...)\` dari \`routes/web.php\` zip ini ke \`routes/web.php\` Anda.`,
        `Requires PHP 8.2+ and Composer.\n\n\`\`\`bash\ncomposer create-project laravel/laravel site\n# copy the resources/, public/ and routes/ folders from this zip into the site folder (replace routes/web.php)\ncd site\nphp artisan serve   # http://127.0.0.1:8000\n\`\`\`\n\nIf Laravel shows a database error (missing sessions table), run \`php artisan migrate\` once.\n\nIf your Laravel project already has other routes, paste the \`Route::view(...)\` lines from this zip's \`routes/web.php\` into yours.`,
      ),
      "router",
      `\n## ${tr("Struktur", "Structure")}\n\n- \`resources/views/layouts/app.blade.php\`: layout\n- \`resources/views/pages/*.blade.php\`: ${tr("satu view per halaman", "one view per page")}\n- \`public/assets/\`: CSS, JS, ${tr("dan gambar", "and images")}\n- \`routes/web.php\`: ${tr("rute", "routes")}\n`,
    ),
  );
  return files;
}

/** Export format labels (shown on the option buttons). */
export const EXPORT_FORMATS: Framework[] = ["html", "blade", "react", "vue", "svelte", "angular"];
