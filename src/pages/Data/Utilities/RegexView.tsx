import { Fragment, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CopyButton from "../../../components/app/CopyButton";
import { INPUT, Notice, Panel } from "../../../components/app/ui";
import { dataErrorMessage } from "../shared/errors";
import { MAX_REGEX_MATCHES, regexReplace, runRegex, type RegexMatch } from "./lib/textTools";

const FLAGS = ["g", "i", "m", "s", "u"] as const;
/** Very long text is not highlighted (rendering thousands of <mark> slows the tab). */
const HIGHLIGHT_LIMIT = 200_000;

export default function RegexView() {
  const { t } = useTranslation();
  const [pattern, setPattern] = useState("(\\w+)@(\\w+)\\.com");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("Hubungi budi@tokokue.com atau sari@contoh.com untuk pesanan.");
  const [replace, setReplace] = useState("");

  const res = useMemo<{ ok: { matches: RegexMatch[]; truncated: boolean } } | { err: string } | null>(() => {
    if (!pattern) return null;
    try {
      return { ok: runRegex(pattern, flags, text) };
    } catch (e) {
      return { err: dataErrorMessage(e) };
    }
  }, [pattern, flags, text]);

  const replaced = useMemo(() => {
    if (!replace || !res || "err" in res) return "";
    try {
      return regexReplace(pattern, flags, text, replace);
    } catch {
      return "";
    }
  }, [pattern, flags, text, replace, res]);

  const highlighted = useMemo(() => {
    if (!res || "err" in res || text.length > HIGHLIGHT_LIMIT) return null;
    const out: React.ReactNode[] = [];
    let last = 0;
    res.ok.matches.forEach((m, i) => {
      if (!m.text) return;
      out.push(<Fragment key={`t${i}`}>{text.slice(last, m.index)}</Fragment>);
      out.push(
        <mark key={`m${i}`} className="rounded bg-amber-200 px-0.5 text-gray-900 dark:bg-amber-400/70">
          {m.text}
        </mark>,
      );
      last = m.index + m.text.length;
    });
    out.push(<Fragment key="end">{text.slice(last)}</Fragment>);
    return out;
  }, [res, text]);

  const toggle = (f: string) => setFlags((cur) => (cur.includes(f) ? cur.replace(f, "") : cur + f));

  return (
    <div className="flex flex-col gap-5" data-testid="tool-regex">
      <Panel title={t("data.util.regex.pattern")}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1 font-mono text-sm">
            <span className="text-gray-400">/</span>
            <input value={pattern} onChange={(e) => setPattern(e.target.value)} className={`${INPUT} font-mono`} spellCheck={false} aria-label={t("data.util.regex.pattern")} data-testid="regex-pattern" />
            <span className="text-gray-400">/{flags}</span>
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("data.util.regex.flags")}>
            {FLAGS.map((f) => (
              <label key={f} className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-2 py-1 text-xs dark:border-gray-700">
                <input type="checkbox" checked={flags.includes(f)} onChange={() => toggle(f)} />
                <code className="font-semibold">{f}</code> {t(`data.util.regex.flag.${f}`)}
              </label>
            ))}
          </div>
          {res && "err" in res && <Notice tone="error">{res.err}</Notice>}
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={t("data.util.regex.text")} bodyClassName="p-0">
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} spellCheck={false} className="block min-h-48 w-full resize-y rounded-b-2xl border-0 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none dark:text-gray-100" aria-label={t("data.util.regex.text")} data-testid="regex-text" />
        </Panel>
        <Panel title={res && "ok" in res ? t("data.util.regex.matchCount", { count: res.ok.matches.length }) : t("data.util.regex.result")}>
          {highlighted ? (
            <pre className="max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-gray-700 dark:text-gray-200" data-testid="regex-highlight">
              {highlighted}
            </pre>
          ) : (
            <p className="text-xs text-gray-400">{text.length > HIGHLIGHT_LIMIT ? t("data.util.regex.tooLongToHighlight") : t("data.util.outputPlaceholder")}</p>
          )}
          {res && "ok" in res && res.ok.truncated && <p className="mt-2 text-[11px] text-amber-700">{t("data.util.regex.truncated", { max: MAX_REGEX_MATCHES })}</p>}
          {res && "ok" in res && res.ok.matches.length > 0 && (
            <ol className="mt-3 flex max-h-56 flex-col gap-1 overflow-auto text-xs" data-testid="regex-matches">
              {res.ok.matches.slice(0, 100).map((m, i) => (
                <li key={i} className="rounded bg-gray-50 px-2 py-1 font-mono dark:bg-white/5">
                  <span className="text-gray-400">#{i + 1} @{m.index}</span> {JSON.stringify(m.text)}
                  {m.groups.length > 0 && <span className="text-gray-500"> · {m.groups.map((g, k) => `$${k + 1}=${JSON.stringify(g ?? null)}`).join(" ")}</span>}
                  {m.named && <span className="text-gray-500"> · {Object.entries(m.named).map(([k, v]) => `${k}=${JSON.stringify(v ?? null)}`).join(" ")}</span>}
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
      <Panel title={t("data.util.regex.replace")} description={t("data.util.regex.replaceHint")} actions={<CopyButton text={replaced} disabled={!replaced} />}>
        <input value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="$1 [at] $2" className={`${INPUT} font-mono`} spellCheck={false} aria-label={t("data.util.regex.replace")} />
        {replaced && <pre className="mt-3 max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 font-mono text-xs dark:bg-white/5">{replaced}</pre>}
      </Panel>
    </div>
  );
}
