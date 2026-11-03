/* ================================================================== */
/* Pemeriksaan otomatis semua template (no. 12).                        */
/*                                                                    */
/*   npm run templates:check -- [folder-situs] [opsi]                  */
/*                                                                    */
/* Untuk setiap template hasil `templates:gen`:                         */
/*   1. Overflow horizontal di lebar 375, 768, 1280 (semua halaman).    */
/*   2. Error JavaScript di halaman (pageerror).                        */
/*   3. axe-core WCAG 2 A/AA di beranda (1280 px).                      */
/* Opsi --lighthouse=N: Lighthouse (mobile) pada N template contoh dan  */
/* dibandingkan dengan anggaran skor di bawah.                          */
/*                                                                    */
/* Template lama mungkin masih punya catatan; yang tercatat ada di      */
/* baseline.json. CI GAGAL hanya bila ada masalah BARU (aturan axe baru, */
/* jumlah node naik, overflow baru, error JS baru). Bila sebuah template */
/* membaik, jalankan --update-baseline agar batasnya ikut mengetat.     */
/*                                                                    */
/* Opsi lain: --only=id1,id2  --jobs=4  --update-baseline               */
/*            --report=file.json                                       */
/* ================================================================== */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { createRequire } from "node:module";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => args.find((a) => a.startsWith(`--${k}=`))?.split("=")[1] ?? d;
const flag = (k) => args.includes(`--${k}`);
const ROOT = path.resolve(args.find((a) => !a.startsWith("--")) ?? ".template-sites");
const JOBS = Number(opt("jobs", 4));
const ONLY = opt("only", "")?.split(",").filter(Boolean);
const LH = Number(opt("lighthouse", 0));
const BASELINE = path.join(HERE, "baseline.json");
const REPORT = opt("report", path.join(ROOT, "report.json"));

const WIDTHS = [375, 768, 1280];
/** Anggaran Lighthouse (mobile, skor 0-100). */
const BUDGET = { performance: 70, accessibility: 90, "best-practices": 90, seo: 90 };
/** Template contoh Lighthouse: campuran Free, Premium, katalog, dan 3D. */
const LH_SAMPLE = ["company-starter", "shop-starter", "shop-boutique", "cafe-kopi-senja", "hotel-resort-pantai", "automotive-dealer", "fitness-gym-pulse", "realty-rumah-kita", "x3d-rimba-roastery", "x3d-velo-listrik"];

const { chromium } = require("playwright");
const AXE = fs.readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");

/* ---------- server statis ---------- */
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".txt": "text/plain", ".xml": "application/xml" };
function serve() {
  const srv = http.createServer((req, res) => {
    const rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
    let file = path.join(ROOT, rel);
    if (!file.startsWith(ROOT)) return res.writeHead(403).end();
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) return res.writeHead(404).end("not found");
    res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok) => srv.listen(0, "127.0.0.1", () => ok(srv)));
}

/* ---------- pemeriksaan satu template ---------- */
async function checkTemplate(page, base, tpl) {
  const r = { overflow: [], errors: [], axe: {} };
  const errs = [];
  const onErr = (e) => errs.push(String(e.message || e).split("\n")[0].slice(0, 160));
  page.on("pageerror", onErr);
  for (const w of WIDTHS) {
    await page.setViewportSize({ width: w, height: 800 });
    for (const pg of tpl.pages) {
      await page.goto(`${base}/${tpl.id}/${pg}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForLoadState("load", { timeout: 10000 }).catch(() => {});
      await page.waitForTimeout(120);
      const over = await page.evaluate(() => {
        const de = document.documentElement;
        // Yang dihitung: halaman benar-benar bisa digeser ke samping (overflow yang dipotong
        // dengan overflow-x: clip/hidden tidak mengganggu pengunjung).
        window.scrollTo(99999, window.scrollY);
        const d = Math.round(window.scrollX);
        window.scrollTo(0, window.scrollY);
        if (d <= 1) return null;
        const who = [...document.querySelectorAll("body *")]
          .filter((e) => e.getBoundingClientRect().right > de.clientWidth + 1 && getComputedStyle(e).position !== "fixed")
          .filter((e) => !(e.parentElement && e.parentElement.getBoundingClientRect().right > de.clientWidth + 1))
          .slice(0, 1)
          .map((e) => e.tagName.toLowerCase() + (e.className && typeof e.className === "string" ? "." + e.className.split(" ")[0] : ""));
        return `+${d}px ${who.join("")}`.trim();
      });
      if (over) r.overflow.push(`${pg}@${w} ${over}`);
      if (w === 1280 && pg === "index.html") {
        await page.addScriptTag({ content: AXE });
        const v = await page.evaluate(async () => (await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa"] })).violations.map((x) => [x.id, x.nodes.length]));
        for (const [id, n] of v) r.axe[id] = n;
      }
    }
  }
  page.off("pageerror", onErr);
  r.errors = [...new Set(errs)];
  return r;
}

/* ---------- bandingkan dengan baseline ---------- */
const keyOf = (o) => o.split(" ")[0]; // "about.html@375"
function compare(id, now, base = { overflow: [], errors: [], axe: {} }) {
  const worse = [];
  const better = [];
  for (const [rule, n] of Object.entries(now.axe)) {
    const b = base.axe?.[rule] ?? 0;
    if (n > b) worse.push(`axe ${rule}: ${b} → ${n} node`);
  }
  for (const [rule, b] of Object.entries(base.axe ?? {})) if ((now.axe[rule] ?? 0) < b) better.push(`axe ${rule}: ${b} → ${now.axe[rule] ?? 0}`);
  const bo = new Set((base.overflow ?? []).map(keyOf));
  for (const o of now.overflow) if (!bo.has(keyOf(o))) worse.push(`overflow ${o}`);
  const no = new Set(now.overflow.map(keyOf));
  for (const o of base.overflow ?? []) if (!no.has(keyOf(o))) better.push(`overflow ${keyOf(o)} hilang`);
  const be = new Set(base.errors ?? []);
  for (const e of now.errors) if (!be.has(e)) worse.push(`error JS: ${e}`);
  return { id, worse, better };
}

/* ---------- Lighthouse ---------- */
/** Jalankan satu proses dalam grup sendiri; bila lewat batas waktu, seluruh grup (termasuk Chrome) dimatikan. */
function runGroup(cmd, argv, ms) {
  return new Promise((ok) => {
    const child = spawn(cmd, argv, { stdio: "ignore", detached: true });
    const timer = setTimeout(() => {
      try {
        process.kill(-child.pid, "SIGKILL");
      } catch {
        /* sudah selesai */
      }
    }, ms);
    child.on("exit", (code) => {
      clearTimeout(timer);
      ok(code);
    });
  });
}
async function lighthouse(base, ids) {
  const chrome = chromium.executablePath();
  const rows = [];
  for (const id of ids) {
    const out = path.join(ROOT, `lh-${id}.json`);
    fs.rmSync(out, { force: true });
    const code = await runGroup("npx", ["-y", "lighthouse@12.8.2", `${base}/${id}/index.html`, `--chrome-path=${chrome}`, "--chrome-flags=--headless=new --no-sandbox", "--max-wait-for-load=30000", "--only-categories=performance,accessibility,best-practices,seo", "--output=json", `--output-path=${out}`, "--quiet"], 150000);
    if (code !== 0 || !fs.existsSync(out)) {
      rows.push({ id, score: {}, fail: [`Lighthouse gagal (kode ${code ?? "timeout"})`] });
      continue;
    }
    const cats = JSON.parse(fs.readFileSync(out, "utf8")).categories;
    const score = Object.fromEntries(Object.entries(cats).map(([k, v]) => [k, Math.round(v.score * 100)]));
    const fail = Object.entries(BUDGET).filter(([k, min]) => score[k] < min).map(([k, min]) => `${k} ${score[k]} < ${min}`);
    rows.push({ id, score, fail });
  }
  return rows;
}

/* ---------- main ---------- */
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "manifest.json"), "utf8")).filter((t) => !ONLY?.length || ONLY.includes(t.id));
const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch({ args: ["--use-gl=swiftshader", "--enable-unsafe-swiftshader"] });
const results = {};
const queue = [...manifest];
const started = Date.now();
let done = 0;
await Promise.all(
  Array.from({ length: Math.min(JOBS, queue.length) }, async () => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    for (let t = queue.shift(); t; t = queue.shift()) {
      try {
        results[t.id] = await checkTemplate(page, base, t);
      } catch (e) {
        results[t.id] = { overflow: [], axe: {}, errors: [`pemeriksaan gagal: ${String(e.message).split("\n")[0]}`] };
      }
      if (++done % 25 === 0) console.log(`  ${done}/${manifest.length} template…`);
    }
    await ctx.close();
  }),
);
await browser.close();

const baseline = fs.existsSync(BASELINE) ? JSON.parse(fs.readFileSync(BASELINE, "utf8")) : {};
const diffs = Object.entries(results).map(([id, r]) => compare(id, r, baseline[id]));
const worse = diffs.filter((d) => d.worse.length);
const better = diffs.filter((d) => d.better.length);
const lh = LH > 0 ? await lighthouse(base, LH_SAMPLE.filter((id) => results[id]).slice(0, LH)) : [];
srv.close();

const sum = (f) => Object.values(results).reduce((n, r) => n + f(r), 0);
const lines = [
  `## Pemeriksaan template (${manifest.length} template, ${((Date.now() - started) / 1000).toFixed(0)} dtk)`,
  "",
  `- Overflow horizontal: ${sum((r) => r.overflow.length)} halaman×lebar (${Object.values(results).filter((r) => r.overflow.length).length} template)`,
  `- Error JavaScript: ${sum((r) => r.errors.length)}`,
  `- Pelanggaran axe (node): ${sum((r) => Object.values(r.axe).reduce((a, b) => a + b, 0))}; template bersih: ${Object.values(results).filter((r) => !Object.keys(r.axe).length).length}`,
  `- **Masalah baru dibanding baseline: ${worse.length} template**`,
  "",
  ...worse.flatMap((d) => [`### ✗ ${d.id}`, ...d.worse.map((w) => `- ${w}`), ""]),
  ...(better.length && !flag("update-baseline") ? [`${better.length} template membaik; jalankan \`npm run templates:baseline\` agar baseline ikut mengetat.`, ""] : []),
  ...(lh.length
    ? ["### Lighthouse (mobile)", "", "| Template | Perf | A11y | BP | SEO | Hasil |", "|---|---|---|---|---|---|", ...lh.map((r) => `| ${r.id} | ${r.score.performance ?? "-"} | ${r.score.accessibility ?? "-"} | ${r.score["best-practices"] ?? "-"} | ${r.score.seo ?? "-"} | ${r.fail.length ? "✗ " + r.fail.join("; ") : "✓"} |`), ""]
    : []),
];
const md = lines.join("\n");
console.log(md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md + "\n");
fs.writeFileSync(REPORT, JSON.stringify({ results, worse, better, lighthouse: lh }, null, 1));

if (flag("update-baseline")) {
  const next = ONLY?.length ? { ...baseline } : {};
  for (const [id, r] of Object.entries(results)) {
    if (r.overflow.length || r.errors.length || Object.keys(r.axe).length) next[id] = { axe: r.axe, overflow: r.overflow, errors: r.errors };
    else delete next[id];
  }
  const sorted = Object.fromEntries(Object.keys(next).sort().map((k) => [k, next[k]]));
  fs.writeFileSync(BASELINE, JSON.stringify(sorted, null, 1) + "\n");
  console.log(`baseline diperbarui: ${Object.keys(sorted).length} template masih punya catatan`);
  process.exit(0);
}
process.exit(worse.length || lh.some((r) => r.fail.length) ? 1 : 0);
