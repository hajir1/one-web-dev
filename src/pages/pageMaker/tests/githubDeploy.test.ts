// v14: deploy the HTML export to GitHub Pages (fake GitHub API).
import test from "node:test";
import assert from "node:assert/strict";
import { deployFiles, deployToGitHub, GitHubDeployError, pagesUrlOf, sanitizeRepoName, vercelImportUrl } from "../helpers/githubDeploy";

interface Call {
  method: string;
  path: string;
  body: Record<string, unknown> | undefined;
  auth: string | null;
}

/** GitHub tiruan: `routes` = "METHOD /path" → [status, body]. */
function fakeGitHub(routes: Record<string, [number, unknown] | ((body: unknown) => [number, unknown])>) {
  const calls: Call[] = [];
  const fetch = (async (url: string, init?: RequestInit) => {
    const path = url.replace("https://api.github.com", "");
    const method = init?.method ?? "GET";
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    const headers = new Headers(init?.headers);
    calls.push({ method, path, body, auth: headers.get("authorization") });
    const r = routes[`${method} ${path}`];
    const [status, data] = typeof r === "function" ? r(body) : (r ?? [404, { message: "Not Found" }]);
    return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  }) as typeof globalThis.fetch;
  return { fetch, calls };
}

const FILES = [
  { name: "index.html", content: "<h1>Hai</h1>" },
  { name: "tentang.html", content: "<h1>Tentang</h1>" },
  { name: "assets/global.css", content: "body{}" },
];

test("nama repo dibersihkan; URL Pages & tombol Vercel", () => {
  assert.equal(sanitizeRepoName("  Website Kopi Senja!! "), "website-kopi-senja");
  assert.equal(sanitizeRepoName("--.a..b--"), "a..b");
  assert.equal(sanitizeRepoName("x".repeat(150)).length, 100);
  assert.equal(pagesUrlOf("Budi", "kopi"), "https://budi.github.io/kopi/");
  assert.equal(pagesUrlOf("budi", "Budi.github.io"), "https://budi.github.io/");
  assert.equal(vercelImportUrl("https://github.com/budi/kopi"), "https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fbudi%2Fkopi");
});

test("berkas deploy: tambah .nojekyll, buang path berbahaya", () => {
  const out = deployFiles([...FILES, { name: "../x", content: "" }, { name: "/etc/y", content: "" }]);
  assert.deepEqual(
    out.map((f) => f.name),
    ["index.html", "tentang.html", "assets/global.css", ".nojekyll"],
  );
});

test("repo baru: dibuat publik, isi dikirim dalam satu commit, Pages diaktifkan", async () => {
  const gh = fakeGitHub({
    "GET /user": [200, { login: "budi" }],
    "POST /user/repos": [201, { default_branch: "main", html_url: "https://github.com/budi/kopi" }],
    "GET /repos/budi/kopi/git/ref/heads/main": [200, { object: { sha: "c0" } }],
    "POST /repos/budi/kopi/git/trees": [201, { sha: "t1" }],
    "POST /repos/budi/kopi/git/commits": [201, { sha: "c1" }],
    "PATCH /repos/budi/kopi/git/refs/heads/main": [200, {}],
    "POST /repos/budi/kopi/pages": [201, { html_url: "https://budi.github.io/kopi/" }],
  });
  const steps: string[] = [];
  const res = await deployToGitHub({ token: " ghp_abc ", repo: "Kopi", files: FILES, fetch: gh.fetch, onStep: (s) => steps.push(s) });
  assert.deepEqual(res, {
    owner: "budi",
    repo: "kopi",
    repoUrl: "https://github.com/budi/kopi",
    pagesUrl: "https://budi.github.io/kopi/",
    vercelUrl: vercelImportUrl("https://github.com/budi/kopi"),
    created: true,
  });
  assert.deepEqual(steps, ["auth", "repo", "upload", "pages"]);
  assert.ok(gh.calls.every((c) => c.auth === "Bearer ghp_abc"), "token dipangkas & dipakai di semua panggilan");
  const create = gh.calls.find((c) => c.path === "/user/repos")!;
  assert.equal(create.body!.private, false);
  assert.equal(create.body!.auto_init, true);
  const tree = gh.calls.find((c) => c.path.endsWith("/git/trees"))!;
  assert.equal(tree.body!.base_tree, undefined, "isi repo diganti seluruhnya");
  assert.deepEqual(
    (tree.body!.tree as { path: string; content: string }[]).map((e) => e.path),
    ["index.html", "tentang.html", "assets/global.css", ".nojekyll"],
  );
  assert.deepEqual(gh.calls.find((c) => c.path.endsWith("/git/commits"))!.body!.parents, ["c0"]);
  assert.deepEqual(gh.calls.find((c) => c.method === "POST" && c.path.endsWith("/pages"))!.body, { source: { branch: "main", path: "/" } });
});

test("repo yang sudah ada: diperbarui di branch bawaannya, Pages yang aktif dipakai ulang", async () => {
  const gh = fakeGitHub({
    "GET /user": [200, { login: "budi" }],
    "GET /repos/budi/kopi": [200, { default_branch: "gh-pages", html_url: "https://github.com/budi/kopi", permissions: { push: true } }],
    "GET /repos/budi/kopi/git/ref/heads/gh-pages": [200, { object: { sha: "c5" } }],
    "POST /repos/budi/kopi/git/trees": [201, { sha: "t6" }],
    "POST /repos/budi/kopi/git/commits": [201, { sha: "c6" }],
    "PATCH /repos/budi/kopi/git/refs/heads/gh-pages": [200, {}],
    "GET /repos/budi/kopi/pages": [200, { html_url: "https://kopi.contoh.id/" }],
  });
  const res = await deployToGitHub({ token: "t", repo: "kopi", files: FILES, fetch: gh.fetch });
  assert.equal(res.created, false);
  assert.equal(res.pagesUrl, "https://kopi.contoh.id/", "domain sendiri dari GitHub dipakai");
  assert.ok(!gh.calls.some((c) => c.path === "/user/repos" || (c.method === "POST" && c.path.endsWith("/pages"))));
});

test("repo baru yang belum siap: ref ditunggu ulang", async () => {
  let tries = 0;
  const gh = fakeGitHub({
    "GET /user": [200, { login: "budi" }],
    "POST /user/repos": [201, { default_branch: "main", html_url: "https://github.com/budi/kopi" }],
    "GET /repos/budi/kopi/git/ref/heads/main": () => (++tries < 3 ? [404, { message: "Not Found" }] : [200, { object: { sha: "c0" } }]),
    "POST /repos/budi/kopi/git/trees": [201, { sha: "t1" }],
    "POST /repos/budi/kopi/git/commits": [201, { sha: "c1" }],
    "PATCH /repos/budi/kopi/git/refs/heads/main": [200, {}],
    "POST /repos/budi/kopi/pages": [409, { message: "already enabled" }],
  });
  const res = await deployToGitHub({ token: "t", repo: "kopi", files: FILES, fetch: gh.fetch, retryDelayMs: 1 });
  assert.equal(tries, 3);
  assert.equal(res.pagesUrl, "https://budi.github.io/kopi/", "409 = Pages sudah aktif → tetap sukses");
});

test("galat GitHub dipetakan ke kode yang jelas", async () => {
  const code = async (routes: Parameters<typeof fakeGitHub>[0], repo = "kopi") => {
    try {
      await deployToGitHub({ token: "t", repo, files: FILES, fetch: fakeGitHub(routes).fetch, retryDelayMs: 1 });
      return "ok";
    } catch (e) {
      assert.ok(e instanceof GitHubDeployError);
      return e.code;
    }
  };
  assert.equal(await code({ "GET /user": [401, { message: "Bad credentials" }] }), "token");
  assert.equal(await code({ "GET /user": [403, { message: "API rate limit exceeded" }] }), "rateLimit");
  assert.equal(await code({ "GET /user": [200, { login: "budi" }], "POST /user/repos": [403, { message: "Resource not accessible by personal access token" }] }), "scope");
  assert.equal(await code({ "GET /user": [200, { login: "budi" }], "POST /user/repos": [422, { message: "name already exists" }] }), "repoName");
  assert.equal(await code({ "GET /user": [200, { login: "budi" }], "GET /repos/budi/kopi": [200, { default_branch: "main", permissions: { push: false } }] }), "notOwner");
  assert.equal(await code({}, "!!!"), "repoName");
  const network = (async () => {
    throw new TypeError("Failed to fetch");
  }) as unknown as typeof fetch;
  await assert.rejects(deployToGitHub({ token: "t", repo: "kopi", files: FILES, fetch: network }), (e: unknown) => e instanceof GitHubDeployError && e.code === "network");
  await assert.rejects(deployToGitHub({ token: "  ", repo: "kopi", files: FILES, fetch: network }), (e: unknown) => e instanceof GitHubDeployError && e.code === "token");
  // Pages failed to enable (e.g. a token without Pages permission) → code "pages", files already sent.
  assert.equal(
    await code({
      "GET /user": [200, { login: "budi" }],
      "POST /user/repos": [201, { default_branch: "main", html_url: "https://github.com/budi/kopi" }],
      "GET /repos/budi/kopi/git/ref/heads/main": [200, { object: { sha: "c0" } }],
      "POST /repos/budi/kopi/git/trees": [201, { sha: "t1" }],
      "POST /repos/budi/kopi/git/commits": [201, { sha: "c1" }],
      "PATCH /repos/budi/kopi/git/refs/heads/main": [200, {}],
      "POST /repos/budi/kopi/pages": [403, { message: "Resource not accessible" }],
    }),
    "pages",
  );
});
