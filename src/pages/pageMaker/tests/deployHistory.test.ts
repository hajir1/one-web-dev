import { test } from "node:test";
import assert from "node:assert/strict";

/* Minimal browser globals for the localStorage-backed store. */
const mem = new Map<string, string>();
const g = globalThis as unknown as Record<string, unknown>;
g.localStorage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v), removeItem: (k: string) => void mem.delete(k) };
g.window ??= new EventTarget();

const { deployKey, getDeploy, removeDeploy, saveDeploy } = await import("../helpers/deployHistory");

test("deploy history: save, read, replace, remove; bad data is ignored", () => {
  const key = deployKey("code", "p1");
  assert.equal(key, "code:p1");
  assert.equal(getDeploy(key), null);
  saveDeploy(key, { owner: "hajir", repo: "undangan", repoUrl: "https://github.com/hajir/undangan", pagesUrl: "https://hajir.github.io/undangan/" });
  const r = getDeploy(key)!;
  assert.equal(r.repo, "undangan");
  assert.ok(!Number.isNaN(Date.parse(r.at)));
  saveDeploy(key, { owner: "hajir", repo: "undangan-2", repoUrl: "https://github.com/hajir/undangan-2", pagesUrl: "https://hajir.github.io/undangan-2/" });
  assert.equal(getDeploy(key)!.repo, "undangan-2");
  removeDeploy(key);
  assert.equal(getDeploy(key), null);

  mem.set("owd-deploys:v1", JSON.stringify({ "site:x": { owner: "a", repo: "b", repoUrl: "javascript:alert(1)", pagesUrl: "https://a.github.io/b/", at: "2026-11-04T00:00:00Z" } }));
  saveDeploy("site:y", { owner: "a", repo: "c", repoUrl: "https://github.com/a/c", pagesUrl: "https://a.github.io/c/" });
  assert.equal(getDeploy("site:x"), null, "non-https links are dropped");
  assert.equal(getDeploy("site:y")!.repo, "c");
});
