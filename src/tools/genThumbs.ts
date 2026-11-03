// @ts-nocheck — skrip Node (tsx), tidak ikut bundle aplikasi.
/* ================================================================== */
/* Generator THUMBNAIL KATALOG TEMPLATE (v20).                          */
/*                                                                    */
/*   npm run gen:thumbs                 semua template                  */
/*   npm run gen:thumbs -- id1,id2      hanya template tertentu         */
/*   THUMB_PARALLEL=8                   jumlah tab paralel (bawaan 4)   */
/*                                                                    */
/* Butuh Playwright + Chromium (sekali saja, tidak ikut package.json):  */
/*   npm i -D playwright && npx playwright install chromium            */
/*                                                                    */
/* Tiap template dirender persis seperti thumbnail lama (beranda,        */
/* lebar 1280 px, mode thumbnail), dipotret, lalu disimpan sebagai WebP  */
/* 640×416 di public/thumbs/<id>.<id|en>.webp. Template Kode hanya satu  */
/* bahasa (.id). Daftar + hash isi ditulis ke                           */
/* src/demo/thumbs.generated.ts (dipakai kartu katalog & cache-busting).*/
/* Sebelum v20 tiap kartu memuat halaman utuh di iframe (123 iframe     */
/* hidup setelah menggulir, ±200 permintaan font, satu konteks WebGL per */
/* kartu 3D). Jalankan ulang setiap kali template ditambah/diubah;      */
/* tes demo gagal bila ada template tanpa thumbnail.                     */
/*                                                                    */
/* Opsional: THUMB_CDN_DIR=<folder> menyajikan cdn.jsdelivr.net/unpkg   */
/* dari salinan lokal (<folder>/npm/<paket>@<versi>/...), untuk mesin    */
/* tanpa akses CDN.                                                     */
/* ================================================================== */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DEMO_TEMPLATE_IDS } from "../demo/demoTemplateIds";
import { demoPreview } from "../demo/demoTemplates";
import { makeIconLookup } from "../pages/pageMaker/core/helpers/elementDefinition";
import { CODE_TEMPLATE_IDS, withThumbFlag } from "../pages/webTemplates/codeTemplates/catalog";

const here = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(here, "../../public/thumbs");
const MANIFEST = resolve(here, "../demo/thumbs.generated.ts");
const CODE_DIR = resolve(here, "../pages/webTemplates/codeTemplates/files");
const VIEW = { width: 1280, height: 832 }; // kartu: lebar 1280 diperkecil ke ±320 px, tinggi 208 px
const SIZE = { width: 640, height: 416 }; // 2× ukuran kartu
const QUALITY = 0.8;
const PARALLEL = Number(process.env.THUMB_PARALLEL) || 4;
const SETTLE_MS = 1200; // animasi masuk (AOS/animate.css) selesai

const { chromium } = createRequire(import.meta.url)("playwright");
const only = process.argv[2] ? new Set(process.argv[2].split(",")) : null;
const icons = makeIconLookup([]);
const cdnDir = process.env.THUMB_CDN_DIR ? resolve(process.env.THUMB_CDN_DIR) : null;

/** Daftar pekerjaan: [id, bahasa]. */
const jobs: [string, "id" | "en"][] = [];
for (const id of [...CODE_TEMPLATE_IDS, ...DEMO_TEMPLATE_IDS.filter((x) => !CODE_TEMPLATE_IDS.includes(x))]) {
  if (only && !only.has(id)) continue;
  if (CODE_TEMPLATE_IDS.includes(id)) jobs.push([id, "id"]);
  else jobs.push([id, "id"], [id, "en"]);
}

async function htmlOf(id: string, lang: "id" | "en"): Promise<string> {
  if (CODE_TEMPLATE_IDS.includes(id)) return withThumbFlag(readFileSync(join(CODE_DIR, `${id}.html`), "utf8"));
  const p = await demoPreview(id, lang, icons, true);
  if (!p) throw new Error(`template ${id} tidak ditemukan`);
  return p.html[p.fileToKey["index.html"]] ?? Object.values(p.html)[0];
}

const MIME: Record<string, string> = { js: "application/javascript", mjs: "application/javascript", css: "text/css", json: "application/json", woff2: "font/woff2" };

async function main() {
  mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"] });
  const ctx = await browser.newContext({ viewport: VIEW, deviceScaleFactor: 1 });
  if (cdnDir)
    await ctx.route(/^https:\/\/(cdn\.jsdelivr\.net|unpkg\.com)\//, (route) => {
      const u = new URL(route.request().url());
      const rel = u.host === "unpkg.com" ? `npm${u.pathname}` : u.pathname.slice(1);
      const f = join(cdnDir, rel.endsWith("/+esm") ? `${rel.slice(0, -5)}/__esm.js` : rel);
      if (!existsSync(f)) return route.fulfill({ status: 404 });
      route.fulfill({ status: 200, body: readFileSync(f), headers: { "content-type": MIME[f.split(".").pop()!] ?? "application/octet-stream", "access-control-allow-origin": "*" } });
    });
  // Halaman induk kosong: template dimuat di iframe sandbox (sama seperti katalog), lalu dipotret.
  await ctx.route("https://thumbs.local/", (r) => r.fulfill({ status: 200, contentType: "text/html", body: `<!doctype html><style>html,body{margin:0;overflow:hidden}iframe{display:block;border:0;width:${VIEW.width}px;height:${VIEW.height}px;background:#fff}</style><iframe sandbox="allow-scripts"></iframe>` }));

  const manifest: Record<string, string> = {};
  let done = 0;
  const failed: string[] = [];
  const queue = jobs.slice();
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      const page = await ctx.newPage();
      for (let job = queue.shift(); job; job = queue.shift()) {
        const [id, lang] = job;
        try {
          const t0 = Date.now(), lap: number[] = [];
          const mark = () => lap.push(Date.now() - t0);
          const html = await htmlOf(id, lang);
          await page.goto("https://thumbs.local/");
          const loaded = page.waitForEvent("framenavigated", { timeout: 15000 }).catch(() => null);
          await page.$eval("iframe", (f, h) => ((f as HTMLIFrameElement).srcdoc = h), html);
          await loaded;
          const frame = page.frames()[1];
          mark();
          await frame?.waitForLoadState("load", { timeout: 15000 }).catch(() => null);
          mark();
          await frame?.evaluate(() => (document.fonts ? document.fonts.ready : null)).catch(() => null);
          mark();
          await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => null);
          mark();
          await page.waitForTimeout(SETTLE_MS);
          const png = await page.screenshot({ type: "png" });
          const webp: string = await page.evaluate(
            async ({ b64, w, h, q }) => {
              const img = new Image();
              img.src = `data:image/png;base64,${b64}`;
              await img.decode();
              const c = document.createElement("canvas");
              c.width = w;
              c.height = h;
              const g = c.getContext("2d")!;
              g.imageSmoothingQuality = "high";
              g.drawImage(img, 0, 0, w, h);
              return c.toDataURL("image/webp", q).split(",")[1];
            },
            { b64: png.toString("base64"), w: SIZE.width, h: SIZE.height, q: QUALITY },
          );
          mark();
          if (process.env.THUMB_DEBUG) console.log(id, lang, lap.join(" "));
          const buf = Buffer.from(webp, "base64");
          writeFileSync(join(OUT, `${id}.${lang}.webp`), buf);
          manifest[`${id}.${lang}`] = createHash("sha1").update(buf).digest("hex").slice(0, 8);
        } catch (e) {
          failed.push(`${id}.${lang}: ${(e as Error).message}`);
        }
        if (++done % 25 === 0 || done === jobs.length) console.log(`${done}/${jobs.length}`);
      }
      await page.close();
    }),
  );
  await browser.close();

  // Gabung dengan manifest lama (berguna saat hanya sebagian template dipotret ulang).
  const old: Record<string, string> = {};
  if (only && existsSync(MANIFEST)) for (const m of readFileSync(MANIFEST, "utf8").matchAll(/"([^"]+)": "([0-9a-f]{8})"/g)) old[m[1]] = m[2];
  const all = { ...old, ...manifest };
  const present = new Set(readdirSync(OUT).map((f) => f.replace(/\.webp$/, "")));
  const keys = Object.keys(all).filter((k) => present.has(k)).sort();
  writeFileSync(
    MANIFEST,
    `/* DIHASILKAN oleh src/tools/genThumbs.ts (npm run gen:thumbs). Jangan diedit langsung. */
/** Thumbnail statis katalog: "<id>.<id|en>" → hash isi (cache-busting). Berkas: public/thumbs/<id>.<lang>.webp */
export const THUMBS: Record<string, string> = {
${keys.map((k) => `  "${k}": "${all[k]}",`).join("\n")}
};
`,
  );
  console.log(`selesai: ${Object.keys(manifest).length} gambar, manifest ${keys.length} entri`);
  if (failed.length) {
    console.error(`gagal (${failed.length}):\n${failed.join("\n")}`);
    process.exitCode = 1;
  }
}

await main();
