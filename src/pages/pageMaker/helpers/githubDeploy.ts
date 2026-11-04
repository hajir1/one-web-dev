/* ================================================================== */
/* Deploy the HTML export to GitHub Pages (v14)                         */
/*                                                                    */
/* Straight from the browser to the GitHub API with the user's own token */
/* (never sent to the OneWebDev server):                                */
/*   1. GET  /user                          → token owner              */
/*   2. GET  /repos/:o/:r  (404 → POST /user/repos, auto_init)          */
/*   3. GET  git/ref/heads/:branch          → latest commit             */
/*   4. POST git/trees (file content inline)  → POST git/commits         */
/*      → PATCH git/refs/heads/:branch      (repo content = export output) */
/*   5. GET  /repos/:o/:r/pages (404 → POST, sumber branch "/")          */
/* Vercel: no token, through Vercel's "Deploy" button from that repo.   */
/* HTML format only (a static site without a build).                    */
/* ================================================================== */

export interface DeployFile {
  name: string;
  content: string;
  /** v21: binary content (images) in base64; when present, `content` is ignored. */
  base64?: string;
}

export type DeployStep = "auth" | "repo" | "upload" | "pages";

export interface GitHubDeployInput {
  token: string;
  repo: string;
  files: DeployFile[];
  /** Commit message. */
  message?: string;
  onStep?: (step: DeployStep) => void;
  fetch?: typeof fetch;
  /** Delay between attempts while a new repo is not ready yet (ms). */
  retryDelayMs?: number;
}

export interface GitHubDeployResult {
  owner: string;
  repo: string;
  repoUrl: string;
  pagesUrl: string;
  /** Vercel "Deploy" button for this repo (import & deploy, no token). */
  vercelUrl: string;
  /** true = the repo was just created by this deploy. */
  created: boolean;
}

/** Stable error code (translated in the UI: pm.deploy.errors.<code>). */
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

/** A valid GitHub repo name: letters, digits, ".", "_", "-"; max. 100. */
export function sanitizeRepoName(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 100);
}

/** Files sent: the export output + `.nojekyll` (GitHub Pages does not reprocess with Jekyll). */
export function deployFiles(files: readonly DeployFile[]): DeployFile[] {
  const out = files.filter((f) => f.name && !f.name.startsWith("/") && !f.name.split("/").includes(".."));
  if (!out.some((f) => f.name === ".nojekyll")) out.push({ name: ".nojekyll", content: "" });
  return out;
}

/** The default GitHub Pages URL for the repo (the user site `name.github.io` is at the root). */
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

  // 1) Token owner.
  input.onStep?.("auth");
  const user = (await call<{ login: string }>("GET", "/user"))!;
  const owner = user.login;

  // 2) Repo: use the existing one, or create a new one (public: free GitHub Pages is only for public repos).
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

  // 3) The latest commit of the main branch (a new repo sometimes needs a few seconds).
  let head: { object: { sha: string } } | null = null;
  for (let i = 0; i < 5 && !head; i++) {
    head = await call<{ object: { sha: string } }>("GET", `${r}/git/ref/heads/${encodeURIComponent(branch)}`, undefined, true);
    if (!head && i < 4) await sleep(delay);
  }

  // 4) The repo content is fully replaced by the export output (a tree without base_tree).
  input.onStep?.("upload");
  const files = deployFiles(input.files);
  // Binary files (images) are created as base64 blobs first; text goes directly into the tree.
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

  // 5) GitHub Pages from the main branch (root).
  input.onStep?.("pages");
  let pages = await call<{ html_url?: string }>("GET", `${r}/pages`, undefined, true);
  if (!pages) {
    try {
      pages = await call<{ html_url?: string }>("POST", `${r}/pages`, { source: { branch, path: "/" } });
    } catch (e) {
      // 409 = already enabled (race); otherwise Pages failed to enable but the files were already sent.
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
