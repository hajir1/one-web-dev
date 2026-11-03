import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, ExternalLink, Github, Loader2, Rocket } from "lucide-react";
import Modal from "../../../components/app/Modal";
import { packForFramework } from "../../../assetLibrary/resolve";
import { blobToBase64 } from "../../../assetLibrary/pack";
import { INPUT, Notice, btn } from "../../../components/app/ui";
import { deployToGitHub, GitHubDeployError, sanitizeRepoName, type DeployFile, type DeployStep, type GitHubDeployResult } from "../helpers/githubDeploy";

/* ================================================================== */
/* Dialog "Deploy" ekspor HTML (v14): push ke repo GitHub + aktifkan     */
/* GitHub Pages, lalu tombol lanjut ke Vercel (impor repo yang sama).    */
/* Token GitHub dipakai langsung dari browser ke api.github.com, tidak   */
/* pernah dikirim ke server OneWebDev. "Ingat" = sessionStorage (tab ini).*/
/* ================================================================== */

const TOKEN_KEY = "owd-github-token";
const REPO_KEY = "owd-github-repo:";
export const GITHUB_TOKEN_URL = "https://github.com/settings/tokens/new?scopes=public_repo&description=OneWebDev%20Deploy";

const STEPS: DeployStep[] = ["auth", "repo", "upload", "pages"];

const readSession = (key: string) => {
  try {
    return sessionStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};
const writeSession = (key: string, value: string | null) => {
  try {
    if (value) sessionStorage.setItem(key, value);
    else sessionStorage.removeItem(key);
  } catch {
    /* penyimpanan diblokir: abaikan */
  }
};

interface Props {
  open: boolean;
  onClose: () => void;
  /** Nama repo bawaan (dari nama desain/website). */
  defaultRepo: string;
  /**
   * Menyiapkan berkas HTML lalu memanggil `push(files)`. Mode demo: berkas lokal;
   * produksi: berkas dari server (dihitung sebagai satu ekspor). "blocked" = menunggu
   * pembayaran kredit (push dipanggil setelah dibayar).
   */
  withFiles: (push: (files: DeployFile[]) => Promise<void>) => Promise<"done" | "blocked" | "failed">;
}

export default function DeployDialog({ open, onClose, defaultRepo, withFiles }: Props) {
  const { t } = useTranslation();
  const [token, setToken] = useState(() => readSession(TOKEN_KEY));
  const [remember, setRemember] = useState(() => !!readSession(TOKEN_KEY));
  const [repo, setRepo] = useState(() => readSession(REPO_KEY + defaultRepo) || sanitizeRepoName(defaultRepo));
  const [step, setStep] = useState<DeployStep | null>(null);
  const [result, setResult] = useState<GitHubDeployResult | null>(null);
  const [error, setError] = useState<{ code: string; detail: string } | null>(null);

  const busy = step !== null && !result && !error;
  const repoName = sanitizeRepoName(repo);

  const start = async () => {
    if (busy || !token.trim() || !repoName) return;
    setError(null);
    setResult(null);
    setStep("auth");
    writeSession(TOKEN_KEY, remember ? token.trim() : null);
    writeSession(REPO_KEY + defaultRepo, repoName);
    let failure: { code: string; detail: string } | null = null;
    let pushed = false;
    const push = async (files: DeployFile[]) => {
      setError(null);
      try {
        // v21: gambar Pustaka Aset ikut sebagai berkas assets/img/… (deploy hanya format HTML).
        const packed = await packForFramework(files, "html");
        const images = await Promise.all(packed.binaries.map(async (b) => ({ name: b.name, content: "", base64: await blobToBase64(b.blob) })));
        setResult(await deployToGitHub({ token, repo: repoName, files: [...packed.files, ...images], onStep: setStep }));
        pushed = true;
      } catch (e) {
        failure = e instanceof GitHubDeployError ? { code: e.code, detail: e.message } : { code: "unknown", detail: e instanceof Error ? e.message : String(e) };
        setError(failure);
        throw e;
      }
    };
    const got = await withFiles(push);
    if (!failure && !pushed) setError({ code: got === "blocked" ? "blocked" : "files", detail: "" });
  };

  const close = () => {
    if (busy) return;
    setStep(null);
    setResult(null);
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      size="md"
      testId="deploy-dialog"
      icon={<Rocket className="h-5 w-5" />}
      title={t("pm.deploy.title")}
      description={t("pm.deploy.description")}
      footer={
        result ? (
          <button type="button" onClick={close} className={btn.secondary}>
            {t("common.close")}
          </button>
        ) : (
          <>
            <button type="button" onClick={close} disabled={busy} className={btn.secondary}>
              {t("common.cancel")}
            </button>
            <button type="button" onClick={start} disabled={busy || !token.trim() || !repoName} className={btn.primary} data-testid="deploy-start">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />} {t("pm.deploy.start")}
            </button>
          </>
        )
      }
    >
      {result ? (
        <div className="space-y-3" data-testid="deploy-done">
          <Notice tone="success" title={t(result.created ? "pm.deploy.doneCreated" : "pm.deploy.doneUpdated", { repo: `${result.owner}/${result.repo}` })}>
            {t("pm.deploy.pagesWait")}
          </Notice>
          <div className="flex flex-col gap-2">
            <a href={result.pagesUrl} target="_blank" rel="noopener noreferrer" className={`${btn.primary} justify-start`} data-testid="deploy-pages-url">
              <ExternalLink className="h-4 w-4" /> {t("pm.deploy.openSite")} <span className="truncate font-normal opacity-80">{result.pagesUrl}</span>
            </a>
            <a href={result.repoUrl} target="_blank" rel="noopener noreferrer" className={`${btn.secondary} justify-start`} data-testid="deploy-repo-url">
              <Github className="h-4 w-4" /> {t("pm.deploy.openRepo")}
            </a>
            <a href={result.vercelUrl} target="_blank" rel="noopener noreferrer" className={`${btn.secondary} justify-start`} data-testid="deploy-vercel-url">
              <Rocket className="h-4 w-4" /> {t("pm.deploy.vercel")}
            </a>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("pm.deploy.vercelHint")}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{t("pm.deploy.redeployHint")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("pm.deploy.token")}</span>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              autoComplete="off"
              spellCheck={false}
              data-autofocus
              disabled={busy}
              placeholder="ghp_…"
              data-testid="deploy-token"
              className={INPUT}
            />
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              {t("pm.deploy.tokenHint")}{" "}
              <a href={GITHUB_TOKEN_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 underline dark:text-brand-400">
                {t("pm.deploy.tokenCreate")}
              </a>
            </span>
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} disabled={busy} className="h-4 w-4" />
            {t("pm.deploy.remember")}
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">{t("pm.deploy.repo")}</span>
            <input
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              disabled={busy}
              spellCheck={false}
              data-testid="deploy-repo"
              className={INPUT}
            />
            <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
              {repoName && repoName !== repo.trim() ? `${t("pm.deploy.repoAs", { name: repoName })} ` : ""}
              {t("pm.deploy.repoHint")}
            </span>
          </label>

          {step && !error && (
            <ol className="space-y-1.5 text-sm" data-testid="deploy-steps">
              {STEPS.map((s, i) => {
                const at = STEPS.indexOf(step);
                const done = i < at;
                const now = i === at;
                return (
                  <li key={s} className={`flex items-center gap-2 ${done || now ? "text-gray-800 dark:text-gray-100" : "text-gray-400"}`}>
                    {done ? <CheckCircle2 className="h-4 w-4 text-emerald-600" /> : now ? <Loader2 className="h-4 w-4 animate-spin text-brand-600" /> : <span className="h-4 w-4 rounded-full border border-gray-300 dark:border-gray-600" />}
                    {t(`pm.deploy.steps.${s}`)}
                  </li>
                );
              })}
            </ol>
          )}

          {error && (
            <Notice tone="error" title={t(`pm.deploy.errors.${error.code}`, { defaultValue: t("pm.deploy.errors.unknown") })} testId="deploy-error">
              {error.detail && <span className="break-words text-xs opacity-80">{error.detail}</span>}
            </Notice>
          )}
        </div>
      )}
    </Modal>
  );
}
