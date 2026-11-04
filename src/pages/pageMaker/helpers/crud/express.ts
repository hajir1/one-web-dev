import type { GeneratedFile } from "../../core/ui/CodeExportPanel";
import { withSlugs, type CollectionDef, type CollectionField } from "../collections";
import { ADMIN_CSS } from "./laravel";
import { collectionsScript, crudNames, isNumeric, searchFields, seedRow, tableFields, type CrudNames } from "./common";

/* ================================================================== */
/* CRUD Node.js (Express, ditulis manual) per koleksi                    */
/*                                                                    */
/* Express + EJS + Node's built-in SQLite (node:sqlite, no native build) + multer. */
/* A simple admin login from .env (one account) + a CSRF token in the session. */
/* The designed site is served from public/.                             */
/* ================================================================== */

const js = (s: string) => JSON.stringify(s);
const cmt = (s: string) => s.replace(/\*\//g, "* /").replace(/[\r\n]+/g, " ");
/** Static text in an EJS template (HTML-escaped, no EJS tags). */
const et = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/%/g, "&#37;");

function sqlColumn(f: CollectionField): string {
  switch (f.type) {
    case "price":
      return `${f.key} INTEGER${f.required ? " NOT NULL" : ""}`;
    case "number":
      return `${f.key} INTEGER NOT NULL DEFAULT 0`;
    case "rating":
      return `${f.key} REAL NOT NULL DEFAULT 0`;
    default:
      return `${f.key} TEXT${f.required ? " NOT NULL" : ""}`;
  }
}

function packageJson(name: string): string {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "situs";
  return `${JSON.stringify(
    {
      name: slug,
      private: true,
      version: "1.0.0",
      type: "module",
      scripts: { start: "node server.js", dev: "node --watch server.js", test: "node --test" },
      engines: { node: ">=22.13" },
      dependencies: {
        dotenv: "^16.5.0",
        ejs: "^3.1.10",
        express: "^4.21.2",
        "express-session": "^1.18.1",
        multer: "^2.0.2",
      },
    },
    null,
    2,
  )}\n`;
}

const ENV_EXAMPLE = `PORT=3000
# Replace with a long random string (at least 32 characters), e.g. the output of:
#   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
SESSION_SECRET=ganti-dengan-teks-acak
# Dashboard admin account (/admin). Password at least 12 characters.
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ganti-password-ini
# production = the server REFUSES to start if the secret/password above has not been changed.
NODE_ENV=development
`;

function serverJs(names: CrudNames[], itemPages: Record<string, string>): string {
  return `import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fileURLToPath as toPath } from "node:url";
import express from "express";
import session from "express-session";
import { authRoutes, csrf, requireAuth } from "./src/auth.js";
import { SqliteSessionStore } from "./src/sessionStore.js";
${names.map((n) => `import ${n.camel}Routes, { ${[`${n.camel}Api`, `${n.camel}CategoriesApi`, `${n.camel}ItemApi`, `${n.camel}RelatedApi`, ...(itemPages[n.slug] ? [`${n.camel}Page`] : [])].join(", ")} } from "./src/routes/${n.slug}.js";`).join("\n")}

const root = path.dirname(fileURLToPath(import.meta.url));

// Default/too short secret & password: production refuses to start, development shows a warning.
const weak = (v, min) => !v || v.length < min || /^(ganti|dev-only|changeme|password|admin)/i.test(v);
const problems = [
  weak(process.env.SESSION_SECRET, 32) && "SESSION_SECRET (minimal 32 karakter acak)",
  weak(process.env.ADMIN_PASSWORD, 12) && "ADMIN_PASSWORD (minimal 12 karakter)",
].filter(Boolean);
if (problems.length) {
  const msg = "Ganti di .env: " + problems.join(", ") + ".";
  if (process.env.NODE_ENV === "production") {
    console.error("Server dihentikan. " + msg);
    process.exit(1);
  }
  console.warn("Peringatan: " + msg + " (wajib sebelum NODE_ENV=production)");
}

export const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(root, "views"));
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-only-secret",
    // Sessions are stored in SQLite: the admin login survives a server restart.
    store: new SqliteSessionStore(),
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production" },
  }),
);
app.use(csrf);

// Public data for the site pages (read by public/assets/collections.js).
${names.map((n) => `app.get(${js(`/api/${n.slug}`)}, ${n.camel}Api);\napp.get(${js(`/api/${n.slug}/kategori`)}, ${n.camel}CategoriesApi);\napp.get(${js(`/api/${n.slug}/:slug`)}, ${n.camel}ItemApi);\napp.get(${js(`/api/${n.slug}/:slug/related`)}, ${n.camel}RelatedApi);`).join("\n")}
${names.filter((n) => itemPages[n.slug]).length ? `\n// Item page (detail): /<collection>/<slug>.\n${names.filter((n) => itemPages[n.slug]).map((n) => `app.get(${js(`/${n.slug}/:slug`)}, ${n.camel}Page);`).join("\n")}` : ""}

// Login + dashboard CRUD.
app.use(authRoutes);
app.get("/admin", requireAuth, (_req, res) => res.redirect(${js(`/admin/${names[0]?.slug ?? "produk"}`)}));
${names.map((n) => `app.use(${js(`/admin/${n.slug}`)}, requireAuth, ${n.camel}Routes);`).join("\n")}

// The designed site + uploaded images.
app.use(express.static(path.join(root, "public"), { extensions: ["html"] }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).send(err.expose ? err.message : "Terjadi galat di server.");
});

// Run directly (npm start) → open the port. Imported (npm test) → only export the app.
if (process.argv[1] && toPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(\`Situs: http://localhost:\${port}  ·  Dashboard: http://localhost:\${port}/admin\`));
}
`;
}

function dbJs(cols: CollectionDef[], names: CrudNames[]): string {
  return `import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
fs.mkdirSync(path.join(root, "data"), { recursive: true });

// Node.js built-in SQLite (22.13+): no native build / Visual Studio needed on Windows.
// DB_FILE is used by tests (temporary database); default data/app.db.
export const db = new DatabaseSync(process.env.DB_FILE || path.join(root, "data", "app.db"));
db.exec("PRAGMA journal_mode = WAL");

/** Slug used by the API routes (e.g. /api/produk/kategori). Written before the table is created (used during migration). */
export const RESERVED = ["kategori"];

/** Collection table (made by OneWebDev). Seed data from the design is inserted once while the table is empty. */
${cols
  .map((c, i) => {
    const n = names[i];
    return `db.exec(\`CREATE TABLE IF NOT EXISTS ${n.table} (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
${c.fields.map((f) => `  ${sqlColumn(f)},`).join("\n")}
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)\`);
ensureColumns(${js(n.table)}, ${JSON.stringify(Object.fromEntries(c.fields.map((f) => [f.key, sqlColumn(f).replace(/ NOT NULL(?! DEFAULT)/, "")])))});
ensureSlugs(${js(n.table)});
seed(${js(n.table)}, ${js(`seed/${n.slug}.json`)});`;
  })
  .join("\n\n")}

/** "Arabika Gayo 250 g" → "arabika-gayo-250-g" (slug URL item). */
export function slugify(text) {
  const s = String(text || "")
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return s || "item";
}

/** Unique slug in the table (duplicate → -2, -3, …). exceptId = the row being edited. */
export function uniqueSlug(table, base, exceptId = 0) {
  const taken = db.prepare(\`SELECT 1 FROM \${table} WHERE slug = ? AND id != ?\`);
  let slug = RESERVED.includes(base) ? base + "-2" : base;
  for (let i = 2; taken.get(slug, Number(exceptId) || 0); i++) slug = base.slice(0, 80 - String(i).length - 1) + "-" + i;
  return slug;
}

/** Old database: columns newly added in the design (e.g. kategori) are created automatically. */
function ensureColumns(table, defs) {
  const cols = db.prepare(\`PRAGMA table_info(\${table})\`).all().map((c) => c.name);
  for (const [key, def] of Object.entries(defs)) if (!cols.includes(key)) db.exec(\`ALTER TABLE \${table} ADD COLUMN \${def}\`);
}

/** Old database (no slug column): add the column, fill it from the name, then create a unique index. */
function ensureSlugs(table) {
  const cols = db.prepare(\`PRAGMA table_info(\${table})\`).all().map((c) => c.name);
  if (!cols.includes("slug")) db.exec(\`ALTER TABLE \${table} ADD COLUMN slug TEXT\`);
  const rows = db.prepare(\`SELECT id, name FROM \${table} WHERE slug IS NULL OR slug = ''\`).all();
  const set = db.prepare(\`UPDATE \${table} SET slug = ? WHERE id = ?\`);
  for (const r of rows) set.run(uniqueSlug(table, slugify(r.name), r.id), r.id);
  db.exec(\`CREATE UNIQUE INDEX IF NOT EXISTS \${table}_slug_unique ON \${table} (slug)\`);
}

function seed(table, file) {
  const count = db.prepare(\`SELECT COUNT(*) AS n FROM \${table}\`).get().n;
  if (count > 0) return;
  const rows = JSON.parse(fs.readFileSync(path.join(root, "src", file), "utf8"));
  if (!rows.length) return;
  const keys = Object.keys(rows[0]);
  const insert = db.prepare(\`INSERT INTO \${table} (\${keys.join(", ")}) VALUES (\${keys.map((k) => "@" + k).join(", ")})\`);
  db.exec("BEGIN");
  try {
    for (const r of rows) insert.run(r);
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }
}
`;
}

const SESSION_STORE_JS = `import session from "express-session";
import { db } from "./db.js";

/* Session storage in SQLite (sessions table): the admin login is not lost when the server restarts. */

db.exec("CREATE TABLE IF NOT EXISTS sessions (sid TEXT PRIMARY KEY, sess TEXT NOT NULL, expires INTEGER NOT NULL)");

const DAY = 24 * 60 * 60 * 1000;
const expiryOf = (sess) => (sess?.cookie?.expires ? new Date(sess.cookie.expires).getTime() : Date.now() + DAY);

export class SqliteSessionStore extends session.Store {
  constructor() {
    super();
    this.getStmt = db.prepare("SELECT sess, expires FROM sessions WHERE sid = ?");
    this.setStmt = db.prepare("INSERT INTO sessions (sid, sess, expires) VALUES (?, ?, ?) ON CONFLICT(sid) DO UPDATE SET sess = excluded.sess, expires = excluded.expires");
    this.delStmt = db.prepare("DELETE FROM sessions WHERE sid = ?");
    this.touchStmt = db.prepare("UPDATE sessions SET expires = ? WHERE sid = ?");
    // Clean up expired sessions every hour.
    setInterval(() => db.prepare("DELETE FROM sessions WHERE expires < ?").run(Date.now()), 60 * 60 * 1000).unref();
  }
  get(sid, cb) {
    try {
      const row = this.getStmt.get(sid);
      if (!row || row.expires < Date.now()) return cb(null, null);
      cb(null, JSON.parse(row.sess));
    } catch (err) {
      cb(err);
    }
  }
  set(sid, sess, cb = () => {}) {
    try {
      this.setStmt.run(sid, JSON.stringify(sess), expiryOf(sess));
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
  destroy(sid, cb = () => {}) {
    try {
      this.delStmt.run(sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
  touch(sid, sess, cb = () => {}) {
    try {
      this.touchStmt.run(expiryOf(sess), sid);
      cb(null);
    } catch (err) {
      cb(err);
    }
  }
}
`;

/** Built-in API test of the exported project (npm test). */
function apiTestJs(slug: string): string {
  return `// Test API bawaan (npm test): jalan di database sementara, tidak menyentuh data/app.db.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "owd-test-"));
process.env.DB_FILE = path.join(tmp, "test.db");
process.env.SESSION_SECRET ||= "test-secret-yang-cukup-panjang-untuk-uji-0123456789";
process.env.ADMIN_EMAIL = "admin@example.com";
process.env.ADMIN_PASSWORD = "password-uji-yang-panjang";

const { app } = await import("../server.js");
let server;
let base;
const K = ${js(slug)};

before(async () => {
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = "http://127.0.0.1:" + server.address().port;
});
after(() => {
  server.close();
  fs.rmSync(tmp, { recursive: true, force: true });
});

const get = (p) => fetch(base + p, { redirect: "manual" });

test("daftar: data + meta pagination", async () => {
  const r = await get(\`/api/\${K}?per_page=2\`);
  assert.equal(r.status, 200);
  const body = await r.json();
  assert.ok(Array.isArray(body.data));
  assert.ok(body.data.length <= 2);
  assert.equal(body.meta.per_page, 2);
  assert.ok(body.meta.total >= body.data.length);
});

test("pencarian & halaman di luar jangkauan tidak error", async () => {
  const first = (await (await get(\`/api/\${K}\`)).json()).data[0];
  if (first?.name) {
    const word = String(first.name).split(/\\s+/)[0];
    const r = await (await get(\`/api/\${K}?q=\${encodeURIComponent(word)}\`)).json();
    assert.ok(r.data.some((x) => x.slug === first.slug), "item ditemukan lewat pencarian");
  }
  const far = await get(\`/api/\${K}?page=9999\`);
  assert.equal(far.status, 200);
});

test("urutan tidak dikenal → 422; kategori → daftar", async () => {
  assert.equal((await get(\`/api/\${K}?sort=ngawur\`)).status, 422);
  const cats = await get(\`/api/\${K}/kategori\`);
  assert.equal(cats.status, 200);
  assert.ok(Array.isArray((await cats.json()).data));
});

test("detail item: ada → 200, tidak ada → 404", async () => {
  const first = (await (await get(\`/api/\${K}\`)).json()).data[0];
  if (first) assert.equal((await get(\`/api/\${K}/\${first.slug}\`)).status, 200);
  assert.equal((await get(\`/api/\${K}/tidak-ada-item-ini\`)).status, 404);
});

test("dashboard terkunci tanpa login; POST tanpa token CSRF ditolak", async () => {
  const r = await get(\`/admin/\${K}\`);
  assert.equal(r.status, 302);
  assert.match(r.headers.get("location") || "", /^\\/login/);
  const post = await fetch(base + \`/admin/\${K}\`, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: "name=x", redirect: "manual" });
  assert.equal(post.status, 403);
});
`;
}

const AUTH_JS = `import crypto from "node:crypto";
import { Router } from "express";

/* Simple admin login: one account from .env (ADMIN_EMAIL, ADMIN_PASSWORD). */

const same = (a, b) => {
  const x = Buffer.from(String(a));
  const y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};

/** Per-session CSRF token: checked on every POST (dashboard & login forms). */
export function csrf(req, res, next) {
  if (!req.session.csrf) req.session.csrf = crypto.randomBytes(24).toString("hex");
  res.locals.csrf = req.session.csrf;
  res.locals.admin = req.session.admin || null;
  // Multipart forms are checked after multer reads the body (see checkCsrf).
  if (req.method === "POST" && !req.is("multipart/form-data")) return checkCsrf(req, res, next);
  next();
}

export function checkCsrf(req, res, next) {
  if (req.body && same(req.body._csrf || "", req.session.csrf || "-")) return next();
  res.status(403).send("Sesi kedaluwarsa. Muat ulang halaman lalu coba lagi.");
}

export function requireAuth(req, res, next) {
  if (req.session.admin) return next();
  res.redirect("/login?next=" + encodeURIComponent(req.originalUrl));
}

export const authRoutes = Router();

authRoutes.get("/login", (req, res) => res.render("login", { error: null, email: "", next: req.query.next || "/admin" }));

/* Login attempt limit: 10 failures per 15 minutes per IP (prevents password guessing). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS = 10;
const fails = new Map();
const failsOf = (ip) => {
  const f = fails.get(ip);
  if (!f || Date.now() - f.start > WINDOW_MS) return { n: 0, start: Date.now() };
  return f;
};
setInterval(() => {
  for (const [ip, f] of fails) if (Date.now() - f.start > WINDOW_MS) fails.delete(ip);
}, WINDOW_MS).unref();

authRoutes.post("/login", (req, res) => {
  const { email = "", password = "" } = req.body;
  const ip = req.ip || "-";
  const f = failsOf(ip);
  if (f.n >= MAX_FAILS) {
    const wait = Math.ceil((WINDOW_MS - (Date.now() - f.start)) / 60000);
    return res.status(429).render("login", { error: \`Terlalu banyak percobaan. Coba lagi dalam \${wait} menit.\`, email, next: "/admin" });
  }
  const ok = process.env.ADMIN_PASSWORD && same(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL || "").toLowerCase()) && same(password, process.env.ADMIN_PASSWORD);
  const next = typeof req.body.next === "string" && req.body.next.startsWith("/admin") ? req.body.next : "/admin";
  if (!ok) {
    fails.set(ip, { n: f.n + 1, start: f.start });
    return res.status(401).render("login", { error: "Email atau password salah.", email, next });
  }
  fails.delete(ip);
  req.session.regenerate(() => {
    req.session.admin = { email: email.trim() };
    res.redirect(next);
  });
});

authRoutes.post("/logout", (req, res) => req.session.destroy(() => res.redirect("/login")));
`;

function modelJs(c: CollectionDef, n: CrudNames, itemPage: boolean): string {
  const search = searchFields(c);
  const keys = ["slug", ...c.fields.map((f) => f.key)];
  return `import { RESERVED, db, slugify, uniqueSlug } from "../db.js";

/** Koleksi "${cmt(c.name)}": skema, validasi, dan query (dibuat OneWebDev). */

export const FIELDS = ${JSON.stringify(c.fields.map((f) => ({ key: f.key, label: f.label, type: f.type, required: f.required })), null, 2)};

const TABLE = ${js(n.table)};
const KEYS = ${JSON.stringify(keys)};
const SEARCH = ${JSON.stringify(search)};
const HAS_CATEGORY = ${c.fields.some((f) => f.key === "category" && f.type === "category")};

const toInt = (v) => {
  const d = String(v ?? "").replace(/\\D/g, "");
  return d ? Number(d) : null;
};

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Validate the form body → { data, errors }. Images are handled by the route (multer).
 * \`id\` = the row being edited (empty slug = keep the old slug); no id = a new row
 * (empty slug = generated from the name).
 */
export function validate(body, id = 0) {
  const data = {};
  const errors = {};
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (slug) {
    if (slug.length > 80 || !SLUG.test(slug)) errors.slug = "Slug hanya huruf kecil, angka, dan strip.";
    else if (RESERVED.includes(slug)) errors.slug = "Slug ini dipakai sistem, pilih yang lain.";
    else if (db.prepare(\`SELECT 1 FROM \${TABLE} WHERE slug = ? AND id != ?\`).get(slug, Number(id) || 0)) errors.slug = "Slug sudah dipakai item lain.";
    data.slug = slug;
  }
  for (const f of FIELDS) {
    if (f.type === "image") continue;
    const raw = typeof body[f.key] === "string" ? body[f.key].trim() : "";
    if (f.type === "price" || f.type === "number") {
      const n = toInt(raw);
      if (raw && n === null) errors[f.key] = f.label + " harus berupa angka.";
      data[f.key] = n ?? (f.type === "number" ? 0 : null);
      if (f.required && !data[f.key]) errors[f.key] = f.label + " wajib diisi.";
    } else if (f.type === "rating") {
      const n = raw === "" ? 0 : Number(raw.replace(",", "."));
      if (!Number.isFinite(n) || n < 0 || n > 5) errors[f.key] = f.label + " harus 0 sampai 5.";
      data[f.key] = Number.isFinite(n) ? Math.round(n * 10) / 10 : 0;
    } else {
      const max = f.type === "textarea" ? 2000 : f.type === "label" ? 30 : f.type === "category" ? 40 : 160;
      const text = f.type === "category" ? raw.replace(/\\s+/g, " ") : raw;
      if (f.required && !text) errors[f.key] = f.label + " wajib diisi.";
      else if (text.length > max) errors[f.key] = f.label + " maksimal " + max + " karakter.";
      data[f.key] = text || (f.required ? "" : null);
    }
  }
  if (data.compare_price && data.price && data.compare_price <= data.price) errors.compare_price = "Harga coret harus lebih besar dari harga.";
  if (!data.slug && !id) data.slug = uniqueSlug(TABLE, slugify(data.name));
  return { data, errors };
}

function where(q, category) {
  const parts = [];
  const params = {};
  const term = String(q || "").trim();
  if (term) {
    parts.push("(" + SEARCH.map((k) => \`\${k} LIKE @q ESCAPE '\\\\'\`).join(" OR ") + ")");
    params.q = "%" + term.replace(/[\\\\%_]/g, (m) => "\\\\" + m) + "%";
  }
  const cat = HAS_CATEGORY ? String(category || "").trim() : "";
  if (cat) {
    parts.push("LOWER(TRIM(COALESCE(category, ''))) = LOWER(@category)");
    params.category = cat;
  }
  return { sql: parts.length ? "WHERE " + parts.join(" AND ") : "", params };
}

/** Sort orders that may be chosen (?sort=). "manual" = data order (id). */
export const SORTS = {
  manual: "id ASC",
  newest: "id DESC",
  name_asc: "name COLLATE NOCASE ASC, id ASC",
  name_desc: "name COLLATE NOCASE DESC, id ASC",
  price_asc: "price ASC, id ASC",
  price_desc: "price DESC, id ASC",
  rating_desc: "rating DESC, id ASC",
};

/** List with search, category filter, sorting, and pagination. */
export function paginate({ q = "", page = 1, perPage = 10, order = "DESC", category = "", sort = "" } = {}) {
  const w = where(q, category);
  const orderBy = SORTS[sort] || (order === "ASC" ? "id ASC" : "id DESC");
  const total = db.prepare(\`SELECT COUNT(*) AS n FROM \${TABLE} \${w.sql}\`).get(w.params).n;
  const pages = Math.max(1, Math.ceil(total / perPage));
  const current = Math.min(Math.max(1, Number(page) || 1), pages);
  const rows = db
    .prepare(\`SELECT * FROM \${TABLE} \${w.sql} ORDER BY \${orderBy} LIMIT @limit OFFSET @offset\`)
    .all({ ...w.params, limit: perPage, offset: (current - 1) * perPage });
  return { rows, total, page: current, pages, perPage, from: total ? (current - 1) * perPage + 1 : 0, to: (current - 1) * perPage + rows.length };
}

export const find = (id) => db.prepare(\`SELECT * FROM \${TABLE} WHERE id = ?\`).get(Number(id)) || null;

/** Unique category list (order of first appearance). */
export function categories() {
  if (!HAS_CATEGORY) return [];
  const rows = db.prepare(\`SELECT category, MIN(id) AS first FROM \${TABLE} WHERE TRIM(COALESCE(category, '')) != '' GROUP BY LOWER(TRIM(category)) ORDER BY first\`).all();
  return rows.map((r) => r.category.trim());
}

export const findBySlug = (slug) => db.prepare(\`SELECT * FROM \${TABLE} WHERE slug = ?\`).get(String(slug)) || null;

/** Related items: same label first, then other items (excluding the item itself). */
export function related(row, limit = 3) {
  const n = Math.max(1, Math.min(12, Number(limit) || 3));
  return db
    .prepare(\`SELECT * FROM \${TABLE} WHERE id != @id ORDER BY CASE WHEN COALESCE(label, '') = @label THEN 0 ELSE 1 END, id ASC LIMIT @n\`)
    .all({ id: row.id, label: row.label || "", n });
}

export function create(data) {
  const keys = KEYS.filter((k) => k in data);
  const info = db.prepare(\`INSERT INTO \${TABLE} (\${keys.join(", ")}) VALUES (\${keys.map((k) => "@" + k).join(", ")})\`).run(data);
  return find(info.lastInsertRowid);
}

export function update(id, data) {
  const keys = KEYS.filter((k) => k in data);
  db.prepare(\`UPDATE \${TABLE} SET \${keys.map((k) => k + " = @" + k).join(", ")}, updated_at = datetime('now') WHERE id = @id\`).run({ ...data, id: Number(id) });
  return find(id);
}

export const remove = (id) => db.prepare(\`DELETE FROM \${TABLE} WHERE id = ?\`).run(Number(id)).changes > 0;

/** Data shape for the cards on public pages. */
export const toCard = (row) => ({
  id: row.id,
  slug: row.slug,${itemPage ? `\n  url: ${js(`/${n.slug}/`)} + row.slug,` : ""}
${c.fields.filter((f) => f.type !== "image").map((f) => `  ${f.key}: row.${f.key},`).join("\n")}
  image_url: row.image || null,
});
`;
}

function routesJs(c: CollectionDef, n: CrudNames, itemPage: string | null): string {
  const hasImage = c.fields.some((f) => f.type === "image");
  return `import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import { Router } from "express";
import multer from "multer";
import { checkCsrf } from "../auth.js";
import * as M from "../collections/${n.slug}.js";

/** Dashboard CRUD "${cmt(c.name)}" (/admin/${n.slug}) + API publik. */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const uploadDir = path.join(root, "public", "uploads", ${js(n.slug)});
fs.mkdirSync(uploadDir, { recursive: true });

const IMAGE_TYPES = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => cb(null, crypto.randomUUID() + IMAGE_TYPES[file.mimetype]),
  }),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (_req, file, cb) => cb(null, file.mimetype in IMAGE_TYPES),
});
const PER_PAGE = [10, 25, 50];
const VIEW = ${js(`admin/${n.slug}`)};
const BASE = ${js(`/admin/${n.slug}`)};

/** Delete the old uploaded file (only inside public/uploads/). */
function dropUpload(url) {
  if (typeof url !== "string" || !url.startsWith(${js(`/uploads/${n.slug}/`)})) return;
  fs.rm(path.join(uploadDir, path.basename(url)), { force: true }, () => {});
}

const router = Router();

// Category list for autocomplete (datalist) in the form.
router.use((_req, res, next) => {
  res.locals.categories = M.categories();
  next();
});

router.get("/", (req, res) => {
  const perPage = PER_PAGE.includes(Number(req.query.per_page)) ? Number(req.query.per_page) : 10;
  const q = typeof req.query.q === "string" ? req.query.q.trim().slice(0, 100) : "";
  const result = M.paginate({ q, page: req.query.page, perPage });
  res.render(VIEW + "/index", { title: ${js(c.name)}, result, q, perPage, perPageOptions: PER_PAGE, flash: takeFlash(req) });
});

router.get("/new", (_req, res) => res.render(VIEW + "/form", { title: ${js(`Tambah ${c.name.toLowerCase()}`)}, item: {}, errors: {}, action: BASE }));

router.post("/", ${hasImage ? 'upload.single("image"), ' : ""}checkCsrf, (req, res) => {
  const { data, errors } = M.validate(req.body);
  if (Object.keys(errors).length) {
    ${hasImage ? "if (req.file) dropUpload(`/uploads/${" + js(n.slug) + "}/${req.file.filename}`);\n    " : ""}return res.status(422).render(VIEW + "/form", { title: ${js(`Tambah ${c.name.toLowerCase()}`)}, item: req.body, errors, action: BASE });
  }
  ${hasImage ? "if (req.file) data.image = `/uploads/${" + js(n.slug) + "}/${req.file.filename}`;\n  " : ""}M.create(data);
  flash(req, ${js(`${c.name} ditambahkan.`)});
  res.redirect(BASE);
});

router.get("/:id/edit", (req, res, next) => {
  const item = M.find(req.params.id);
  if (!item) return next();
  res.render(VIEW + "/form", { title: ${js(`Ubah ${c.name.toLowerCase()}`)}, item, errors: {}, action: BASE + "/" + item.id });
});

router.post("/:id", ${hasImage ? 'upload.single("image"), ' : ""}checkCsrf, (req, res, next) => {
  const item = M.find(req.params.id);
  if (!item) return next();
  const { data, errors } = M.validate(req.body, item.id);
  if (Object.keys(errors).length) {
    ${hasImage ? "if (req.file) dropUpload(`/uploads/${" + js(n.slug) + "}/${req.file.filename}`);\n    " : ""}return res.status(422).render(VIEW + "/form", { title: ${js(`Ubah ${c.name.toLowerCase()}`)}, item: { ...item, ...req.body }, errors, action: BASE + "/" + item.id });
  }
  ${hasImage ? "if (req.file) {\n    data.image = `/uploads/${" + js(n.slug) + "}/${req.file.filename}`;\n    dropUpload(item.image);\n  }\n  " : ""}M.update(item.id, data);
  flash(req, ${js(`${c.name} diperbarui.`)});
  res.redirect(BASE);
});

router.post("/:id/delete", checkCsrf, (req, res) => {
  const item = M.find(req.params.id);
  if (item) {
    ${hasImage ? "dropUpload(item.image);\n    " : ""}M.remove(item.id);
    flash(req, ${js(`${c.name} dihapus.`)});
  }
  res.redirect(req.get("referer")?.includes(BASE) ? req.get("referer") : BASE);
});

function flash(req, msg) {
  req.session.flash = msg;
}
function takeFlash(req) {
  const msg = req.session.flash;
  delete req.session.flash;
  return msg || null;
}

/**
 * GET /api/${n.slug}?q=&kategori=&sort=&page=&per_page= → { data, meta }
 * sort: manual (bawaan), newest, name_asc, name_desc, price_asc, price_desc, rating_desc.
 */
export function ${n.camel}Api(req, res) {
  const perPage = Math.max(1, Math.min(100, Number(req.query.per_page) || 12));
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const sort = str(req.query.sort, 20);
  if (sort && !M.SORTS[sort]) return res.status(422).json({ message: "sort tidak dikenal.", allowed: Object.keys(M.SORTS) });
  const category = str(req.query.kategori, 40);
  const result = M.paginate({ q: str(req.query.q, 100), category, sort: sort || "manual", page: req.query.page, perPage });
  res.json({
    data: result.rows.map(M.toCard),
    meta: { page: result.page, per_page: perPage, total: result.total, last_page: result.pages, kategori: category || null, sort: sort || "manual" },
  });
}

/** GET /api/${n.slug}/kategori → { data: ["Biji kopi", …] } (untuk chip filter). */
export function ${n.camel}CategoriesApi(_req, res) {
  res.json({ data: M.categories() });
}

/** GET /api/${n.slug}/:slug → { data } (404 bila tidak ada). */
export function ${n.camel}ItemApi(req, res) {
  const row = M.findBySlug(req.params.slug);
  if (!row) return res.status(404).json({ message: "Tidak ditemukan." });
  res.json({ data: M.toCard(row) });
}

/** GET /api/${n.slug}/:slug/related?limit=3 → { data } (label sama dulu). */
export function ${n.camel}RelatedApi(req, res) {
  const row = M.findBySlug(req.params.slug);
  if (!row) return res.status(404).json({ message: "Tidak ditemukan." });
  res.json({ data: M.related(row, req.query.limit).map(M.toCard) });
}
${
  itemPage
    ? `
/**
 * Halaman item: /${n.slug}/:slug (juga /${n.slug}/:slug.html) menyajikan
 * public/${itemPage} dengan judul produk. Isinya diisi public/assets/collections.js.
 */
const ITEM_PAGE = path.join(root, "public", ${js(itemPage)});
const esc = (s) => String(s).replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[m]);

export function ${n.camel}Page(req, res, next) {
  const row = M.findBySlug(String(req.params.slug).replace(/\\.html$/, ""));
  if (!row) return res.status(404).send("<!DOCTYPE html><meta charset=utf-8><title>Tidak ditemukan</title><p style=\\"font-family:sans-serif;padding:24px\\">${et(c.name)} tidak ditemukan. <a href=\\"/\\">Kembali ke beranda</a></p>");
  fs.readFile(ITEM_PAGE, "utf8", (err, html) => {
    if (err) return next(err);
    res.type("html").send(
      html
        // Relative addresses (assets/…, other pages) are resolved from the site root.
        .replace(/<head>/i, '<head>\\n  <base href="/" />')
        .replace(/<title>[\\s\\S]*?<\\/title>/i, () => "<title>" + esc(row.name) + "</title>"),
    );
  });
}
`
    : ""
}
export default router;
`;
}

function adminHead(names: CrudNames[], siteName: string): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title><%= title %> · Dashboard</title>
  <link rel="stylesheet" href="/assets/admin.css" />
</head>
<body class="adm">
  <aside class="adm-side">
    <a class="adm-brand" href="/">${et(siteName)}</a>
    <nav>
${names.map((n) => `      <a href="/admin/${n.slug}">${et(n.label)}</a>`).join("\n")}
    </nav>
    <form method="POST" action="/logout" class="adm-logout">
      <input type="hidden" name="_csrf" value="<%= csrf %>" />
      <button type="submit">Keluar</button>
    </form>
  </aside>
  <main class="adm-main">
`;
}

const ADMIN_FOOT = `  </main>
</body>
</html>
`;

function indexEjs(c: CollectionDef, n: CrudNames): string {
  const cols = tableFields(c);
  const cell = (f: CollectionField) => {
    switch (f.type) {
      case "image":
        return `<td><% if (item.${f.key}) { %><img class="adm-thumb" src="<%= item.${f.key} %>" alt=""><% } %></td>`;
      case "price":
        return `<td class="num"><%= item.${f.key} ? rupiah(item.${f.key}) : "–" %></td>`;
      case "rating":
        return `<td class="num"><%= Number(item.${f.key} || 0).toFixed(1) %></td>`;
      case "label":
      case "category":
        return `<td><% if (item.${f.key}) { %><span class="adm-tag"><%= item.${f.key} %></span><% } %></td>`;
      default:
        return `<td><%= item.${f.key} %></td>`;
    }
  };
  return `<%- include("../../partials/admin-head") %>
<% const rupiah = (n) => "Rp" + Number(n).toLocaleString("id-ID"); %>
<% const link = (p) => "?" + new URLSearchParams({ q, per_page: perPage, page: p }).toString(); %>
    <% if (flash) { %><div class="adm-flash" role="status"><%= flash %></div><% } %>
    <header class="adm-head">
      <h1>${et(c.name)}</h1>
      <a class="adm-btn" href="/admin/${n.slug}/new">+ Tambah ${et(c.name.toLowerCase())}</a>
    </header>

    <form method="GET" class="adm-search" role="search">
      <input type="search" name="q" value="<%= q %>" placeholder="Cari ${et(c.name.toLowerCase())}…" aria-label="Cari" />
      <select name="per_page" aria-label="Baris per halaman" onchange="this.form.submit()">
        <% perPageOptions.forEach((n) => { %><option value="<%= n %>" <%= n === perPage ? "selected" : "" %>><%= n %> / halaman</option><% }) %>
      </select>
      <button type="submit" class="adm-btn ghost">Cari</button>
    </form>

    <div class="adm-card">
      <table class="adm-table">
        <thead>
          <tr>
${cols.map((f) => `            <th${isNumeric(f) ? ' class="num"' : ""}>${et(f.label)}</th>`).join("\n")}
            <th class="act">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <% if (!result.rows.length) { %>
            <tr><td colspan="${cols.length + 1}" class="adm-empty"><%= q ? 'Tidak ada hasil untuk "' + q + '".' : "Belum ada data." %></td></tr>
          <% } %>
          <% result.rows.forEach((item) => { %>
            <tr>
${cols.map((f) => `              ${cell(f)}`).join("\n")}
              <td class="act">
                <a href="/admin/${n.slug}/<%= item.id %>/edit">Ubah</a>
                <form method="POST" action="/admin/${n.slug}/<%= item.id %>/delete" onsubmit="return confirm('Hapus data ini?')">
                  <input type="hidden" name="_csrf" value="<%= csrf %>" />
                  <button type="submit" class="danger">Hapus</button>
                </form>
              </td>
            </tr>
          <% }) %>
        </tbody>
      </table>
    </div>

    <% if (result.total) { %>
      <nav class="adm-pager" aria-label="Halaman">
        <span><%= result.from %>–<%= result.to %> dari <%= result.total %></span>
        <span class="adm-pages">
          <% if (result.page > 1) { %><a href="<%= link(result.page - 1) %>" rel="prev">‹ Sebelumnya</a><% } else { %><span class="off">‹ Sebelumnya</span><% } %>
          <span>Halaman <%= result.page %> / <%= result.pages %></span>
          <% if (result.page < result.pages) { %><a href="<%= link(result.page + 1) %>" rel="next">Berikutnya ›</a><% } else { %><span class="off">Berikutnya ›</span><% } %>
        </span>
      </nav>
    <% } %>
<%- include("../../partials/admin-foot") %>
`;
}

function formEjs(c: CollectionDef, n: CrudNames): string {
  const hasImage = c.fields.some((f) => f.type === "image");
  const err = (k: string) => `<% if (errors.${k}) { %><small class="adm-err"><%= errors.${k} %></small><% } %>`;
  const val = (k: string, dflt = '""') => `<%= item.${k} ?? ${dflt} %>`;
  const field = (f: CollectionField) => {
    const req = f.required ? " required" : "";
    const label = `<label for="f-${f.key}">${et(f.label)}${f.required ? " *" : ""}</label>`;
    switch (f.type) {
      case "textarea":
        return `        <div class="adm-field">\n          ${label}\n          <textarea id="f-${f.key}" name="${f.key}" rows="4" maxlength="2000"${req}>${val(f.key)}</textarea>\n          ${err(f.key)}\n        </div>`;
      case "image":
        return `        <div class="adm-field">\n          ${label}\n          <% if (item.${f.key} && !errors.${f.key}) { %><img class="adm-thumb lg" src="<%= item.${f.key} %>" alt=""><% } %>\n          <input id="f-${f.key}" type="file" name="${f.key}" accept="image/jpeg,image/png,image/webp,image/gif" />\n          <small>JPG, PNG, WebP, atau GIF, maksimal 2 MB. Kosongkan untuk memakai gambar lama.</small>\n        </div>`;
      case "price":
        return `        <div class="adm-field">\n          ${label}\n          <input id="f-${f.key}" type="number" name="${f.key}" min="0" step="1" inputmode="numeric" value="${val(f.key)}"${req} />\n          ${err(f.key)}\n        </div>`;
      case "number":
        return `        <div class="adm-field">\n          ${label}\n          <input id="f-${f.key}" type="number" name="${f.key}" min="0" step="1" value="${val(f.key, "0")}" />\n          ${err(f.key)}\n        </div>`;
      case "rating":
        return `        <div class="adm-field">\n          ${label}\n          <input id="f-${f.key}" type="number" name="${f.key}" min="0" max="5" step="0.1" value="${val(f.key, "0")}" />\n          ${err(f.key)}\n        </div>`;
      case "category":
        return `        <div class="adm-field">\n          ${label}\n          <input id="f-${f.key}" type="text" name="${f.key}" maxlength="40" list="dl-${f.key}" placeholder="mis. Biji kopi" value="${val(f.key)}"${req} />\n          <datalist id="dl-${f.key}"><% (locals.categories || []).forEach((c) => { %><option value="<%= c %>"></option><% }) %></datalist>\n          <small>Pilih kategori yang ada atau ketik kategori baru.</small>\n          ${err(f.key)}\n        </div>`;
      default:
        return `        <div class="adm-field">\n          ${label}\n          <input id="f-${f.key}" type="text" name="${f.key}" maxlength="${f.type === "label" ? 30 : 160}" value="${val(f.key)}"${req} />\n          ${err(f.key)}\n        </div>`;
    }
  };
  return `<%- include("../../partials/admin-head") %>
    <header class="adm-head">
      <h1><%= title %></h1>
      <a class="adm-btn ghost" href="/admin/${n.slug}">Kembali</a>
    </header>
    <form method="POST" action="<%= action %>" class="adm-card adm-form"${hasImage ? ' enctype="multipart/form-data"' : ""}>
      <input type="hidden" name="_csrf" value="<%= csrf %>" />
      <div class="adm-grid">
${c.fields.map(field).join("\n")}
        <div class="adm-field">
          <label for="f-slug">Slug URL</label>
          <input id="f-slug" type="text" name="slug" maxlength="80" pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="dibuat dari nama" value="${val("slug")}" />
          <small>Alamat: /${n.slug}/&lt;slug&gt;. Kosongkan untuk dibuat otomatis dari nama.</small>
          ${err("slug")}
        </div>
      </div>
      <div class="adm-actions">
        <button type="submit" class="adm-btn">Simpan</button>
      </div>
    </form>
<%- include("../../partials/admin-foot") %>
`;
}

const LOGIN_EJS = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Masuk · Dashboard</title>
  <link rel="stylesheet" href="/assets/admin.css" />
</head>
<body class="adm" style="align-items:center;justify-content:center;padding:16px">
  <form method="POST" action="/login" class="adm-card adm-form" style="width:100%;max-width:360px">
    <h1 style="margin:0 0 16px;font-size:20px">Masuk ke dashboard</h1>
    <% if (error) { %><div class="adm-flash" style="background:#fef2f2;color:#991b1b;border-color:#fecaca"><%= error %></div><% } %>
    <input type="hidden" name="_csrf" value="<%= csrf %>" />
    <input type="hidden" name="next" value="<%= next %>" />
    <div class="adm-field"><label for="email">Email</label><input id="email" type="email" name="email" value="<%= email %>" required autocomplete="username" /></div>
    <div class="adm-field" style="margin-top:12px"><label for="password">Password</label><input id="password" type="password" name="password" required autocomplete="current-password" /></div>
    <div class="adm-actions"><button type="submit" class="adm-btn">Masuk</button></div>
  </form>
</body>
</html>
`;

/** Express CRUD files. `site` = the static site files (moved into public/). */
export function expressCrudFiles(cols: CollectionDef[], siteName: string, itemPages: Record<string, string> = {}): GeneratedFile[] {
  const names = cols.map(crudNames);
  const files: GeneratedFile[] = [
    { name: "package.json", lang: "json", content: packageJson(siteName) },
    { name: ".env.example", lang: "text", content: ENV_EXAMPLE },
    { name: ".gitignore", lang: "text", content: "node_modules/\n.env\ndata/\npublic/uploads/\n" },
    { name: "server.js", lang: "js", content: serverJs(names, itemPages) },
    { name: "src/db.js", lang: "js", content: dbJs(cols, names) },
    { name: "src/auth.js", lang: "js", content: AUTH_JS },
    { name: "src/sessionStore.js", lang: "js", content: SESSION_STORE_JS },
    { name: "test/api.test.js", lang: "js", content: apiTestJs(names[0]?.slug ?? "produk") },
  ];
  cols.forEach((c, i) => {
    const n = names[i];
    files.push(
      { name: `src/collections/${n.slug}.js`, lang: "js", content: modelJs(c, n, !!itemPages[n.slug]) },
      { name: `src/routes/${n.slug}.js`, lang: "js", content: routesJs(c, n, itemPages[n.slug] ?? null) },
      { name: `src/seed/${n.slug}.json`, lang: "json", content: `${JSON.stringify(withSlugs(c).items.map((it) => ({ slug: it.slug, ...seedRow(c, it.values) })), null, 2)}\n` },
      { name: `views/admin/${n.slug}/index.ejs`, lang: "html", content: indexEjs(c, n) },
      { name: `views/admin/${n.slug}/form.ejs`, lang: "html", content: formEjs(c, n) },
    );
  });
  files.push(
    { name: "views/partials/admin-head.ejs", lang: "html", content: adminHead(names, siteName) },
    { name: "views/partials/admin-foot.ejs", lang: "html", content: ADMIN_FOOT },
    { name: "views/login.ejs", lang: "html", content: LOGIN_EJS },
    { name: "public/assets/admin.css", lang: "css", content: ADMIN_CSS },
    { name: "public/assets/collections.js", lang: "js", content: collectionsScript() },
  );
  return files;
}

export function expressReadme(cols: CollectionDef[], siteName: string, pages: string[] = []): string {
  const names = cols.map(crudNames);
  const first = names[0]?.slug ?? "produk";
  return `# ${siteName}: situs + dashboard CRUD (Node.js / Express)

Dibuat dengan OneWebDev. Isinya:

- **Situs** hasil desain di folder \`public/\`${pages.length ? ` (${pages.length} halaman: ${pages.map((p) => `\`${p}\``).join(", ")})` : ""}.
- **Dashboard admin** di \`/admin\` untuk ${names.map((n) => `**${n.label}**`).join(", ")}: daftar dengan pencarian dan pagination, tambah, ubah, hapus, dan unggah gambar.
- **Database** SQLite (satu berkas, tanpa server database terpisah).

## Ringkas (sudah punya Node.js 22.13+)

\`\`\`bash
npm install
cp .env.example .env     # Windows: copy .env.example .env
npm start                # buka http://localhost:3000
\`\`\`

Kalau belum pernah memakai Node.js, ikuti panduan lengkap di bawah.

## Panduan lengkap

### 1. Pasang Node.js (sekali saja)

Proyek ini butuh **Node.js versi 22.13 atau lebih baru**. Unduh versi **LTS** dari situs resminya:

- Halaman unduhan: https://nodejs.org/en/download
- **Windows**: pilih *Windows Installer (.msi)*, jalankan, lalu klik *Next* sampai selesai (biarkan opsi bawaan, termasuk *Add to PATH*). Tidak perlu mencentang *Tools for Native Modules*.
- **macOS**: pilih *macOS Installer (.pkg)*, atau lewat Homebrew: \`brew install node\`.
- **Linux (Ubuntu/Debian)**: ikuti petunjuk di halaman unduhan (pilihan *nvm* paling mudah), atau lihat https://github.com/nodesource/distributions.
- Butuh beberapa versi Node sekaligus? Pakai **nvm-windows** (https://github.com/coreybutler/nvm-windows/releases) di Windows atau **nvm** (https://github.com/nvm-sh/nvm) di macOS/Linux.

Setelah terpasang, **tutup lalu buka lagi** terminal, kemudian cek:

\`\`\`bash
node -v    # harus v22.13.0 atau lebih baru, mis. v24.x
npm -v
\`\`\`

### 2. Buka terminal di folder proyek

1. Ekstrak zip ini ke folder biasa (misalnya \`Documents/${first}-situs\`), jangan dijalankan dari dalam zip.
2. Buka terminal di folder itu:
   - **Windows**: buka foldernya di File Explorer, klik kolom alamat, ketik \`cmd\`, lalu Enter. Bisa juga klik kanan di folder lalu *Open in Terminal*.
   - **macOS**: klik kanan folder di Finder, pilih *New Terminal at Folder*.
   - **VS Code**: *File › Open Folder*, lalu *Terminal › New Terminal*.

### 3. Pasang paket

\`\`\`bash
npm install
\`\`\`

Tunggu sampai selesai. Folder \`node_modules/\` akan muncul. Langkah ini butuh internet.

### 4. Atur akun admin

Salin berkas contoh pengaturan:

\`\`\`bash
cp .env.example .env          # macOS / Linux
copy .env.example .env        # Windows (Command Prompt)
\`\`\`

Buka \`.env\` dengan editor teks lalu isi:

| Kunci | Isi |
|---|---|
| \`ADMIN_EMAIL\` | Email untuk login dashboard |
| \`ADMIN_PASSWORD\` | Kata sandi dashboard (minimal 12 karakter, jangan pakai contoh) |
| \`SESSION_SECRET\` | Teks acak minimal 32 karakter, mis. hasil \`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\` |
| \`PORT\` | Opsional, bawaan 3000 |
| \`NODE_ENV\` | \`production\` saat online: server **menolak jalan** bila secret atau sandi masih contoh/terlalu pendek |

### 5. Jalankan

\`\`\`bash
npm start          # atau: npm run dev (otomatis restart saat kode diubah)
\`\`\`

- Situs: http://localhost:3000
- Dashboard: http://localhost:3000/admin (login dengan email dan sandi di \`.env\`)
${names
  .map(
    (n) => `- API publik \`/api/${n.slug}\`:
  - \`GET /api/${n.slug}?q=kopi&kategori=Biji%20kopi&sort=price_asc&page=1&per_page=12\` (cari, filter kategori, urutan, halaman). \`sort\`: \`manual\`, \`newest\`, \`name_asc\`, \`name_desc\`, \`price_asc\`, \`price_desc\`, \`rating_desc\`.
  - \`GET /api/${n.slug}/kategori\` daftar kategori (dipakai chip filter).
  - \`GET /api/${n.slug}/<slug>\` satu item, \`GET /api/${n.slug}/<slug>/related?limit=3\` item terkait (label sama dulu).`,
  )
  .join("\n")}

Untuk berhenti, tekan \`Ctrl + C\` di terminal. Login admin disimpan di database (tabel \`sessions\`), jadi tidak hilang saat server di-restart. Database \`data/app.db\` dibuat otomatis saat pertama jalan dan diisi data awal dari desain (\`src/seed/\`).

## Test

\`\`\`bash
npm test
\`\`\`

Menjalankan \`test/api.test.js\` di database sementara (data asli tidak disentuh): daftar + pagination, pencarian, urutan tidak dikenal (422), kategori, detail item (200/404), dashboard terkunci tanpa login, dan POST tanpa token CSRF ditolak. Jalankan setiap selesai mengubah kode backend.

## Kalau ada masalah

| Gejala | Solusi |
|---|---|
| \`'node' is not recognized\` / \`command not found: npm\` | Node.js belum terpasang, atau terminal belum dibuka ulang setelah memasang. |
| \`No such built-in module: node:sqlite\` | Versi Node terlalu lama. Pasang Node.js 22.13+ (lihat langkah 1). |
| \`ExperimentalWarning: SQLite is an experimental feature\` | Hanya peringatan, aman diabaikan. |
| \`EADDRINUSE: address already in use :::3000\` | Port 3000 dipakai aplikasi lain. Ganti \`PORT=3001\` di \`.env\`. |
| Tidak bisa login | Cek \`ADMIN_EMAIL\` dan \`ADMIN_PASSWORD\` di \`.env\`, lalu jalankan ulang \`npm start\`. Setelah 10 kali salah, login dikunci 15 menit untuk IP itu. |
| \`Server dihentikan. Ganti di .env: ...\` | Mode produksi menolak secret/sandi contoh. Isi \`SESSION_SECRET\` (≥32 karakter acak) dan \`ADMIN_PASSWORD\` (≥12 karakter). |
| Kartu di situs tidak berubah | Muat ulang halaman dengan \`Ctrl + F5\`. Buka konsol browser (F12) untuk melihat galat API. |
| Ingin mengulang data dari awal | Hentikan server, hapus folder \`data/\`, lalu \`npm start\` lagi. |

## Online (produksi)

- Jalankan di hosting yang mendukung Node.js 22.13+ (VPS, Railway, Render, Fly.io, dan sejenisnya) dengan \`npm start\`.
- Set \`NODE_ENV=production\` dan pakai HTTPS (cookie sesi hanya dikirim lewat HTTPS di mode produksi).
- Ganti \`SESSION_SECRET\` dan sandi admin. Cadangkan folder \`data/\` dan \`public/uploads/\` secara berkala.

## Struktur

| Berkas | Isi |
|---|---|
| \`server.js\` | Express, sesi, rute |
| \`src/db.js\` | Koneksi SQLite, tabel, data awal |
| \`src/auth.js\` | Login admin dari \`.env\`, token CSRF |
${names.map((n) => `| \`src/collections/${n.slug}.js\` | Skema, validasi, query cari + pagination |\n| \`src/routes/${n.slug}.js\` | Dashboard CRUD + \`/api/${n.slug}\` |\n| \`views/admin/${n.slug}/\` | Tampilan EJS dashboard |`).join("\n")}
| \`public/\` | Situs hasil desain, \`assets/collections.js\`, gambar unggahan |

Halaman situs memuat \`public/assets/collections.js\`. Skrip ini mengisi ulang kartu di elemen \`[data-collection]\` dari API, jadi data yang diubah di dashboard langsung tampil. Bila koleksi diatur memakai pagination, tombol "Muat lagi", atau geser horizontal, skrip hanya memuat sebagian data per permintaan. Bila API tidak bisa diakses, kartu statis dari desain tetap tampil.
`;
}
