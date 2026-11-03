/* ================================================================== */
/* Deploy ekspor HTML ke GitHub Pages (v14)                             */
/*                                                                    */
/* Langsung dari browser ke API GitHub memakai token milik pengguna     */
/* (tidak pernah dikirim ke server OneWebDev):                          */
/*   1. GET  /user                          → pemilik token            */
/*   2. GET  /repos/:o/:r  (404 → POST /user/repos, auto_init)          */
/*   3. GET  git/ref/heads/:branch          → commit terakhir           */
/*   4. POST git/trees (isi berkas langsung)  → POST git/commits         */
/*      → PATCH git/refs/heads/:branch      (isi repo = hasil ekspor)   */
/*   5. GET  /repos/:o/:r/pages (404 → POST, sumber branch "/")          */
/* Vercel: tanpa token, lewat tombol "Deploy" Vercel dari repo tadi.    */
/* Hanya format HTML (situs statis tanpa build).                        */
/* ================================================================== */

export interface DeployFile {
  name: string;
  content: string;
  /** v21: isi biner (gambar) dalam base64; bila ada, `content` diabaikan. */
  base64?: string;
}

export type DeployStep = "auth" | "repo" | "upload" | "pages";

export interface GitHubDeployInput {
  token: string;
  repo: string;
  files: DeployFile[];
  /** Pesan commit. */
  message?: string;
  onStep?: (step: DeployStep) => void;
  fetch?: typeof fetch;
  /** Jeda antar-percobaan saat repo baru belum siap (ms). */
  retryDelayMs?: number;
}

export interface GitHubDeployResult {
  owner: string;
  repo: string;
  repoUrl: string;
  pagesUrl: string;
  /** Tombol "Deploy" Vercel untuk repo ini (impor & deploy, tanpa token). */
  vercelUrl: string;
  /** true = repo baru dibuat oleh deploy ini. */
  created: boolean;
}

/** Kode galat stabil (diterjemahkan di UI: pm.deploy.errors.<code>). */
export type GitHubDeployErrorCode = "token" | "scope" | "rateLimit" | "repoName" | "notOwner" | "network" | "pages" | "unknown";

export class GitHubDeployError extends Error {
  constructor(
    public code: GitHubDeployErrorCode,
    message: string,
    public status = 0,
  ) {
    super(message);
    this.name = "GitHubDeployError";
  }
}

const API = "https://api.github.com";

/** Nama repo yang valid di GitHub: huruf, angka, ".", "_", "-"; maks. 100. */
export function sanitizeRepoName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 100);
}

/** Berkas yang dikirim: hasil ekspor + `.nojekyll` (GitHub Pages tidak memproses ulang dengan Jekyll). */
export function deployFiles(files: readonly DeployFile[]): DeployFile[] {
  const out = files.filter((f) => f.name && !f.name.startsWith("/") && !f.name.split("/").includes(".."));
  if (!out.some((f) => f.name === ".nojekyll")) out.push({ name: ".nojekyll", content: "" });
  return out;
}

/** URL GitHub Pages bawaan untuk repo (situs pengguna `nama.github.io` ada di root). */
export function pagesUrlOf(owner: string, repo: string): string {
  const host = `${owner.toLowerCase()}.github.io`;
  return repo.toLowerCase() === host ? `https://${host}/` : `https://${host}/${repo}/`;
}

export const vercelImportUrl = (repoUrl: string) => `https://vercel.com/new/clone?repository-url=${encodeURIComponent(repoUrl)}`;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function deployToGitHub(input: GitHubDeployInput): Promise<GitHubDeployResult> {
  const doFetch = input.fetch ?? ((...a: Parameters<typeof fetch>) => fetch(...a));
  const token = input.token.trim();
  const repo = sanitizeRepoName(input.repo);
  if (!token) throw new GitHubDeployError("token", "token kosong");
  if (!repo) throw new GitHubDeployError("repoName", "nama repo kosong");
  const delay = input.retryDelayMs ?? 1500;

  const call = async <T>(method: string, path: string, body?: unknown, okMissing = false): Promise<T | null> => {
    let res: Response;
    try {
      res = await doFetch(`${API}${path}`, {
        method,
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    } catch (e) {
      throw new GitHubDeployError("network", e instanceof Error ? e.message : String(e));
    }
    if (okMissing && res.status === 404) return null;
    const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    if (res.ok) return data as T;
    const msg = typeof data.message === "string" ? data.message : `HTTP ${res.status}`;
    if (res.status === 401) throw new GitHubDeployError("token", msg, 401);
    if (res.status === 403 || res.status === 429) {
      const rate = res.headers.get("x-ratelimit-remaining") === "0" || /rate limit/i.test(msg);
      throw new GitHubDeployError(rate ? "rateLimit" : "scope", msg, res.status);
    }
    if (res.status === 404) throw new GitHubDeployError("scope", msg, 404);
    if (res.status === 422 && method === "POST" && path === "/user/repos") throw new GitHubDeployError("repoName", msg, 422);
    throw new GitHubDeployError("unknown", msg, res.status);
  };

  // 1) Pemilik token.
  input.onStep?.("auth");
  const user = (await call<{ login: string }>("GET", "/user"))!;
  const owner = user.login;

  // 2) Repo: pakai yang ada, atau buat baru (publik: GitHub Pages gratis hanya untuk repo publik).
  input.onStep?.("repo");
  const r = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
  let info = await call<{ default_branch: string; html_url: string; permissions?: { push?: boolean } }>("GET", r, undefined, true);
  const created = !info;
  if (!info) {
    info = await call("POST", "/user/repos", {
      name: repo,
      description: "Website dari OneWebDev",
      homepage: pagesUrlOf(owner, repo),
      auto_init: true,
      private: false,
    });
  } else if (info.permissions && info.permissions.push === false) {
    throw new GitHubDeployError("notOwner", "tidak punya akses tulis ke repo ini", 403);
  }
  const branch = info!.default_branch || "main";
  const repoUrl = info!.html_url || `https://github.com/${owner}/${repo}`;

  // 3) Commit terakhir branch utama (repo baru kadang butuh beberapa detik).
  let head: { object: { sha: string } } | null = null;
  for (let i = 0; i < 5 && !head; i++) {
    head = await call<{ object: { sha: string } }>("GET", `${r}/git/ref/heads/${encodeURIComponent(branch)}`, undefined, true);
    if (!head && i < 4) await sleep(delay);
  }

  // 4) Isi repo diganti seluruhnya dengan hasil ekspor (tree tanpa base_tree).
  input.onStep?.("upload");
  const files = deployFiles(input.files);
  // Berkas biner (gambar) dibuat sebagai blob base64 lebih dulu; teks langsung di tree.
  const entries: { path: string; mode: string; type: string; content?: string; sha?: string }[] = [];
  for (const f of files) {
    if (f.base64 === undefined) entries.push({ path: f.name, mode: "100644", type: "blob", content: f.content });
    else {
      const blob = (await call<{ sha: string }>("POST", `${r}/git/blobs`, { content: f.base64, encoding: "base64" }))!;
      entries.push({ path: f.name, mode: "100644", type: "blob", sha: blob.sha });
    }
  }
  const tree = (await call<{ sha: string }>("POST", `${r}/git/trees`, { tree: entries }))!;
  const commit = (await call<{ sha: string }>("POST", `${r}/git/commits`, {
    message: input.message ?? "Deploy dari OneWebDev",
    tree: tree.sha,
    parents: head ? [head.object.sha] : [],
  }))!;
  if (head) await call("PATCH", `${r}/git/refs/heads/${encodeURIComponent(branch)}`, { sha: commit.sha, force: true });
  else await call("POST", `${r}/git/refs`, { ref: `refs/heads/${branch}`, sha: commit.sha });

  // 5) GitHub Pages dari branch utama (root).
  input.onStep?.("pages");
  let pages = await call<{ html_url?: string }>("GET", `${r}/pages`, undefined, true);
  if (!pages) {
    try {
      pages = await call<{ html_url?: string }>("POST", `${r}/pages`, { source: { branch, path: "/" } });
    } catch (e) {
      // 409 = sudah aktif (balapan); selain itu Pages gagal diaktifkan tetapi berkas sudah terkirim.
      if (!(e instanceof GitHubDeployError && e.status === 409)) throw new GitHubDeployError("pages", e instanceof Error ? e.message : String(e), e instanceof GitHubDeployError ? e.status : 0);
    }
  }
  return {
    owner,
    repo,
    repoUrl,
    pagesUrl: pages?.html_url || pagesUrlOf(owner, repo),
    vercelUrl: vercelImportUrl(repoUrl),
    created,
  };
}
