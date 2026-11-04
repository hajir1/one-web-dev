// @ts-nocheck — Node script (tsx), not part of the app bundle.
/* ================================================================== */
/* TEMPLATE CATALOG THUMBNAIL generator (v20).                          */
/*                                                                    */
/*   npm run gen:thumbs                 all templates                   */
/*   npm run gen:thumbs -- id1,id2      only specific templates         */
/*   THUMB_PARALLEL=8                   number of parallel tabs (default 4) */
/*                                                                    */
/* Needs Playwright + Chromium (one time only, not in package.json):    */
/*   npm i -D playwright && npx playwright install chromium            */
/*                                                                    */
/* Each template is rendered exactly like the old thumbnail (home page, */
/* 1280 px wide, thumbnail mode), captured, then saved as a 640×416     */
/* WebP at public/thumbs/<id>.<id|en>.webp. Code Templates have only one */
/* language (.id). The list + content hashes are written to             */
/* src/demo/thumbs.generated.ts (used by catalog cards & cache busting).*/
/* Before v20 each card loaded a whole page in an iframe (123 iframes   */
/* come alive after scrolling, ±200 font requests, one WebGL context per */
/* 3D cards). Run again whenever templates are added/changed;           */
/* the demo test fails when a template has no thumbnail.                */
/*                                                                    */
/* Optional: THUMB_CDN_DIR=<folder> serves cdn.jsdelivr.net/unpkg       */
/* from a local copy (<folder>/npm/<package>@<version>/...), for machines */
/* without CDN access.                                                  */
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
const VIEW = { width: 1280, height: 832 }; // card: 1280 wide scaled down to about 320 px, 208 px tall
const SIZE = { width: 640, height: 416 }; // 2× the card size
const QUALITY = 0.8;
const PARALLEL = Number(process.env.THUMB_PARALLEL) || 4;
const SETTLE_MS = 1200; // entrance animations (AOS/animate.css) finished

const { chromium } = createRequire(import.meta.url)("playwright");
const only = process.argv[2] ? new Set(process.argv[2].split(",")) : null;
const icons = makeIconLookup([]);
const cdnDir = process.env.THUMB_CDN_DIR ? resolve(process.env.THUMB_CDN_DIR) : null;

/** Job list: [id, language]. */
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
  // An empty parent page: the template loads in a sandboxed iframe (same as the catalog), then is captured.
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

  // Merge with the old manifest (useful when only some templates are recaptured).
  const old: Record<string, string> = {};
  if (only && existsSync(MANIFEST)) for (const m of readFileSync(MANIFEST, "utf8").matchAll(/"([^"]+)": "([0-9a-f]{8})"/g)) old[m[1]] = m[2];
  const all = { ...old, ...manifest };
  const present = new Set(readdirSync(OUT).map((f) => f.replace(/\.webp$/, "")));
  const keys = Object.keys(all).filter((k) => present.has(k)).sort();
  writeFileSync(
    MANIFEST,
    `/* GENERATED by src/tools/genThumbs.ts (npm run gen:thumbs). Do not edit by hand. */
/** Static catalog thumbnails: "<id>.<id|en>" → content hash (cache busting). Files: public/thumbs/<id>.<lang>.webp */
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
