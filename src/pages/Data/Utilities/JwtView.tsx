import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ShieldAlert } from "lucide-react";
import CopyButton from "../../../components/app/CopyButton";
import { Chip, Notice, Panel, btn } from "../../../components/app/ui";
import { dataErrorMessage } from "../shared/errors";
import { decodeJwt, type DecodedJwt } from "./lib/jwt";
import { encodeBase64 } from "./lib/encoding";
import { LANG_LABEL, currentLang } from "../../../i18n";

const b64 = (o: unknown) => encodeBase64(JSON.stringify(o), true);
/** Contoh token (tanda tangan palsu, hanya untuk demo dekode). */
const SAMPLE = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: "user_42", name: "Hajir", role: "admin", iat: 1767225600, exp: 4102444800 })}.demo-signature-not-verified`;

const STATUS_TONE: Record<DecodedJwt["status"], "green" | "rose" | "amber" | "gray"> = { "valid-time": "green", expired: "rose", "not-yet-valid": "amber", "no-exp": "gray" };

function JsonBlock({ title, value, testId }: { title: string; value: unknown; testId: string }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <Panel title={title} actions={<CopyButton text={text} />} bodyClassName="p-0">
      <pre className="max-h-80 overflow-auto bg-gray-50/70 px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 dark:bg-gray-950/40 dark:text-gray-100" data-testid={testId}>
        {text}
      </pre>
    </Panel>
  );
}

export default function JwtView() {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const locale = LANG_LABEL[currentLang()].locale;

  const decoded = useMemo<{ ok: DecodedJwt } | { err: string } | null>(() => {
    if (!token.trim()) return null;
    try {
      return { ok: decodeJwt(token) };
    } catch (e) {
      return { err: dataErrorMessage(e) };
    }
  }, [token]);

  return (
    <div className="flex flex-col gap-5" data-testid="tool-jwt">
      <Notice tone="warn" title={t("data.util.jwt.notVerifiedTitle")}>
        {t("data.util.jwt.notVerified")}
      </Notice>
      <Panel
        title={t("data.util.jwt.token")}
        actions={
          <>
            <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => setToken(SAMPLE)} data-testid="tool-sample">
              {t("common.sample")}
            </button>
            {token && (
              <button type="button" className={`${btn.ghost} !py-1 text-xs`} onClick={() => setToken("")}>
                {t("common.clear")}
              </button>
            )}
          </>
        }
        bodyClassName="p-0"
      >
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder={t("data.util.tools.jwt.placeholder")}
          aria-label={t("data.util.jwt.token")}
          spellCheck={false}
          rows={5}
          className="block w-full resize-y rounded-b-2xl border-0 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none break-all placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-brand-500/30 dark:text-gray-100"
          data-testid="tool-input"
        />
      </Panel>

      {decoded && "err" in decoded && (
        <div data-testid="tool-error">
          <Notice tone="error" title={t("data.util.errorTitle")}>
            {decoded.err}
          </Notice>
        </div>
      )}

      {decoded && "ok" in decoded && (
        <>
          <div className="flex flex-wrap items-center gap-2" data-testid="jwt-status">
            <Chip tone={STATUS_TONE[decoded.ok.status]}>{t(`data.util.jwt.status.${decoded.ok.status}`)}</Chip>
            {typeof decoded.ok.header.alg === "string" && <Chip tone="blue">alg: {decoded.ok.header.alg}</Chip>}
            {decoded.ok.header.alg === "none" && (
              <Chip tone="rose">
                <ShieldAlert className="h-3 w-3" /> {t("data.util.jwt.algNone")}
              </Chip>
            )}
          </div>
          {decoded.ok.times.length > 0 && (
            <Panel title={t("data.util.jwt.times")}>
              <dl className="grid gap-2 text-sm sm:grid-cols-3">
                {decoded.ok.times.map((x) => (
                  <div key={x.claim} className="rounded-xl border border-gray-100 px-3 py-2 dark:border-gray-800">
                    <dt className="text-xs font-semibold text-gray-500">
                      <code>{x.claim}</code> · {t(`data.util.jwt.claims.${x.claim}`)}
                    </dt>
                    <dd className="mt-0.5 font-medium text-gray-800 dark:text-gray-100">{new Date(x.seconds * 1000).toLocaleString(locale, { dateStyle: "medium", timeStyle: "medium" })}</dd>
                    <dd className="font-mono text-[11px] text-gray-400">{x.iso}</dd>
                  </div>
                ))}
              </dl>
            </Panel>
          )}
          <div className="grid gap-5 xl:grid-cols-2">
            <JsonBlock title={t("data.util.jwt.header")} value={decoded.ok.header} testId="jwt-header" />
            <JsonBlock title={t("data.util.jwt.payload")} value={decoded.ok.payload} testId="jwt-payload" />
          </div>
          <Panel title={t("data.util.jwt.signature")} description={t("data.util.jwt.signatureHint")}>
            <p className="break-all font-mono text-xs text-gray-600 dark:text-gray-300">{decoded.ok.signature || "—"}</p>
          </Panel>
        </>
      )}
    </div>
  );
}
