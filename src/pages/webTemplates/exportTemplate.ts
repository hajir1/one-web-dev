import JSZip from "jszip";
import { buildSite, type SiteBuildOptions } from "../pageMaker/helpers/siteExport";
import { assetNameOf, assetSvg } from "./assets";
import { templateSiteFromPages, type BuiltTemplatePage, type TemplateRef } from "./templateContent";
import { makeTr, type TplLang } from "./types";
import type { Framework } from "../pageMaker/core/helpers/generatorCss";

/* ================================================================== */
/* Template download: full source code + assets + README in the          */
/* chosen format (v7: HTML, Laravel Blade, React, Vue, Svelte, Angular). */
/* Page content comes from the server (POST /templates/:id/acquire, only */
/* for free/owned templates); the zip is assembled in the browser.     */
/* ================================================================== */

const DATA_SVG = /data:image\/svg\+xml;base64,[A-Za-z0-9+/=]+/g;

/** System fonts (no external font download). */
const TEMPLATE_FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';

export interface TemplateFile {
  name: string;
  content: string;
}

/**
 * Replaces asset data URIs with file paths. Without `publicDir` (static HTML): relative
 * paths; files in `assets/` refer to `img/…`, others to `assets/img/…`.
 * With `publicDir` (framework/Laravel projects): absolute paths `/assets/img/…`,
 * files stored in `<publicDir>/assets/img/` (the Vite/Angular/Laravel static folder).
 */
export function externalizeAssets(files: TemplateFile[], publicDir?: string): { files: TemplateFile[]; assets: string[] } {
  const used = new Set<string>();
  const out = files.map((f) => {
    const prefix = publicDir ? "/assets/img/" : f.name.startsWith("assets/") ? "img/" : "assets/img/";
    const content = f.content.replace(DATA_SVG, (uri) => {
      const name = assetNameOf(uri);
      if (!name) return uri; // not a template asset (e.g. the user's image) → leave it
      used.add(name);
      return `${prefix}${name}.svg`;
    });
    return { name: f.name, content };
  });
  const assets = [...used].sort();
  for (const a of assets) out.push({ name: `${publicDir ? `${publicDir}/` : ""}assets/img/${a}.svg`, content: assetSvg(a) });
  return { files: out, assets };
}

function readme(t: TemplateRef, lang: TplLang, title: string, pages: { name: string; file: string }[], assets: string[]): string {
  const tr = makeTr(lang);
  return `# ${title}

${tr("Template website dari **OneWebDev — Web Templates**", "Website template from **OneWebDev — Web Templates**")} (\`${t.id}\` v${t.version}).
${tr("Format: HTML + CSS statis, tanpa build step dan tanpa dependensi.", "Format: static HTML + CSS, no build step and no dependencies.")}

## ${tr("Isi folder", "Contents")}

| ${tr("Halaman", "Page")} | ${tr("Berkas", "File")} |
|---|---|
${pages.map((p) => `| ${p.name} | \`${p.file}\` |`).join("\n")}

- \`assets/*.css\` — ${tr("gaya tiap halaman", "per-page styles")}
- \`assets/img/\` — ${tr(`${assets.length} gambar SVG ilustrasi (bebas dipakai & diganti)`, `${assets.length} SVG illustrations (free to use and replace)`)}

## ${tr("Cara memakai", "How to use")}

1. ${tr("Ekstrak zip, lalu buka `index.html` di browser untuk melihat website.", "Extract the zip, then open `index.html` in a browser to view the site.")}
2. ${tr("Ubah teks langsung di berkas `.html`, dan warna/ukuran di `assets/<halaman>.css`.", "Edit text directly in the `.html` files, and colours/sizes in `assets/<page>.css`.")}
3. ${tr("Ganti gambar dengan menimpa berkas di `assets/img/` (nama sama) atau ubah atribut `src`.", "Replace images by overwriting files in `assets/img/` (same name) or by changing the `src` attribute.")}
4. ${tr("Unggah seluruh folder ke hosting statis (mis. Netlify, Vercel, GitHub Pages, cPanel).", "Upload the whole folder to any static host (e.g. Netlify, Vercel, GitHub Pages, cPanel).")}

## ${tr("Penting", "Important")}

- ${tr("Nama, alamat, nomor telepon, harga, dan produk adalah **contoh** — ganti dengan data Anda.", "Names, addresses, phone numbers, prices, and products are **examples**; replace them with your own data.")}
- ${tr("Formulir dan tombol belanja **tidak** memproses data atau pembayaran. Hubungkan ke layanan formulir, platform e-commerce, atau backend Anda sendiri.", "Forms and shopping buttons do **not** process data or payments. Connect them to a form service, e-commerce platform, or your own backend.")}
- ${tr("Tautan antarhalaman memakai nama berkas di atas. Bila mengganti nama berkas, perbarui tautannya juga.", "Links between pages use the file names above. If you rename a file, update the links too.")}

## ${tr("Edit secara visual", "Edit visually")}

${tr(
  "Di OneWebDev, buka **Web Maker → Web Templates**, pilih template ini, lalu **Edit di Page Maker**. Template disalin menjadi folder website baru milik Anda; template asli tidak berubah. Dari menu **Website** Anda juga bisa mengekspor ke React, Vue, Svelte, atau Angular.",
  "In OneWebDev, open **Web Maker → Web Templates**, choose this template, then **Use this template**. The template is copied into a new website of your own and opens in Studio; the original template stays unchanged. From Studio's **Deploy** you can also export to React, Vue, Svelte, or Angular.",
)}
`;
}

export interface TemplateZip {
  blob: Blob;
  fileName: string;
  files: TemplateFile[];
  assets: string[];
}

/**
 * Assembles the template zip files in format `fw` (v7: HTML, Laravel Blade, React,
 * Vue, Svelte, Angular). `title` = the website name (already translated).
 */
export function templateFiles(
  t: TemplateRef,
  lang: TplLang,
  title: string,
  pagesIn: BuiltTemplatePage[],
  opts: SiteBuildOptions,
  fw: Framework = "html",
): { files: TemplateFile[]; assets: string[] } {
  const { site, designs } = templateSiteFromPages(t, pagesIn, title);
  const built = buildSite(site, designs, { ...opts, baseFont: opts.baseFont || TEMPLATE_FONT });
  const all = built.files(fw);
  const projectReadme = all.find((f) => f.name === "README.md")?.content ?? "";
  // The document language follows the template content language.
  const raw = all
    .filter((f) => f.name !== "README.md")
    .map((f) => ({ name: f.name, content: f.name.endsWith(".html") ? f.content.replace(/<html lang="[^"]*">/, `<html lang="${lang}">`) : f.content }));
  const { files, assets } = externalizeAssets(raw, fw === "html" ? undefined : "public");
  if (fw === "html") {
    const pages = built.pages
      .slice()
      .sort((a, b) => Number(b.isHome) - Number(a.isHome))
      .map((p) => ({ name: p.title, file: `${p.file}.html` }));
    files.push({ name: "README.md", content: readme(t, lang, title, pages, assets) });
  } else files.push({ name: "README.md", content: projectReadmeFor(t, lang, projectReadme, assets) });
  return { files, assets };
}

/** Framework project README + template-specific notes (assets & sample data). */
function projectReadmeFor(t: TemplateRef, lang: TplLang, base: string, assets: string[]): string {
  const tr = makeTr(lang);
  const [first, ...rest] = base.split("\n");
  return `${first}

${tr("Template website dari **OneWebDev — Web Templates**", "Website template from **OneWebDev — Web Templates**")} (\`${t.id}\` v${t.version}).
${rest.join("\n").trimEnd()}

## ${tr("Gambar", "Images")}

${tr(`${assets.length} gambar SVG ilustrasi ada di \`public/assets/img/\` (bebas dipakai & diganti; timpa berkas dengan nama sama).`, `${assets.length} SVG illustrations live in \`public/assets/img/\` (free to use and replace; overwrite a file with the same name).`)}

## ${tr("Penting", "Important")}

- ${tr("Nama, alamat, nomor telepon, harga, dan produk adalah **contoh**; ganti dengan data Anda.", "Names, addresses, phone numbers, prices, and products are **examples**; replace them with your own data.")}
- ${tr("Formulir dan tombol belanja **tidak** memproses data atau pembayaran. Hubungkan ke layanan formulir, platform e-commerce, atau backend Anda sendiri.", "Forms and shopping buttons do **not** process data or payments. Connect them to a form service, e-commerce platform, or your own backend.")}
`;
}

export async function buildTemplateZip(
  t: TemplateRef,
  lang: TplLang,
  title: string,
  pages: BuiltTemplatePage[],
  opts: SiteBuildOptions,
  fw: Framework = "html",
): Promise<TemplateZip> {
  const { files, assets } = templateFiles(t, lang, title, pages, opts, fw);
  const root = `${t.id}-${lang}${fw === "html" ? "" : `-${fw}`}`;
  const zip = new JSZip();
  for (const f of files) zip.file(`${root}/${f.name}`, f.content);
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  return { blob, fileName: `${root}.zip`, files, assets };
}
