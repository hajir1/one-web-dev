import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import CopyButton from "../../../components/app/CopyButton";
import { Notice, Panel, Toggle } from "../../../components/app/ui";
import { dataErrorMessage } from "../shared/errors";
import { diffLines, diffToText, type DiffOp } from "./lib/textTools";

const AREA =
  "block min-h-48 w-full resize-y rounded-b-2xl border-0 bg-transparent px-4 py-3 font-mono text-xs leading-relaxed text-gray-800 outline-none dark:text-gray-100";

export default function DiffView() {
  const { t } = useTranslation();
  const [a, setA] = useState("harga: 15000\nstok: 20\nwarna: merah");
  const [b, setB] = useState("harga: 18000\nstok: 20\nwarna: merah\nukuran: L");
  const [ignoreWhitespace, setWs] = useState(false);
  const [ignoreCase, setCase] = useState(false);
  const res = useMemo<{ ops: DiffOp[] } | { err: string }>(() => {
    try {
      return { ops: diffLines(a, b, { ignoreWhitespace, ignoreCase }) };
    } catch (e) {
      return { err: dataErrorMessage(e) };
    }
  }, [a, b, ignoreWhitespace, ignoreCase]);
  const ops = "ops" in res ? res.ops : [];
  const added = ops.filter((o) => o.type === "add").length;
  const removed = ops.filter((o) => o.type === "del").length;
  return (
    <div className="flex flex-col gap-5" data-testid="tool-diff">
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={t("data.util.diff.original")} bodyClassName="p-0">
          <textarea value={a} onChange={(e) => setA(e.target.value)} rows={10} spellCheck={false} className={AREA} aria-label={t("data.util.diff.original")} data-testid="diff-a" />
        </Panel>
        <Panel title={t("data.util.diff.changed")} bodyClassName="p-0">
          <textarea value={b} onChange={(e) => setB(e.target.value)} rows={10} spellCheck={false} className={AREA} aria-label={t("data.util.diff.changed")} data-testid="diff-b" />
        </Panel>
      </div>
      <div className="flex flex-wrap gap-6">
        <Toggle checked={ignoreWhitespace} onChange={setWs} label={t("data.util.diff.ignoreWhitespace")} />
        <Toggle checked={ignoreCase} onChange={setCase} label={t("data.util.diff.ignoreCase")} />
      </div>
      <Panel
        title={t("data.util.diff.result", { added, removed })}
        actions={<CopyButton text={() => diffToText(ops)} disabled={!ops.length} />}
        bodyClassName="p-0"
      >
        {"err" in res ? (
          <div className="p-4">
            <Notice tone="error">{res.err}</Notice>
          </div>
        ) : added + removed === 0 ? (
          <p className="p-4 text-sm text-emerald-700 dark:text-emerald-300">{t("data.util.diff.same")}</p>
        ) : (
          <pre className="max-h-[60vh] overflow-auto py-2 font-mono text-xs leading-relaxed" data-testid="diff-result">
            {ops.map((o, i) => (
              <div
                key={i}
                className={`px-4 ${o.type === "add" ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-200" : o.type === "del" ? "bg-rose-50 text-rose-900 line-through decoration-rose-400/60 dark:bg-rose-500/15 dark:text-rose-200" : "text-gray-600 dark:text-gray-300"}`}
              >
                <span className="mr-2 select-none text-gray-400">{o.type === "add" ? "+" : o.type === "del" ? "−" : " "}</span>
                {o.text || " "}
              </div>
            ))}
          </pre>
        )}
      </Panel>
    </div>
  );
}
