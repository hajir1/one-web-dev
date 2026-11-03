import {  useEffect,  useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Loader2,
} from "lucide-react";
import {  INPUT, Notice, Panel, btn } from "../../../components/app/ui";
import {  api } from "../../../api/client";
import { formatIdr } from "../../../config/pricing";
import { Loadable, ReloadBtn, Table } from "../adminShared";
import { td, useAdminGet, act } from "../adminApi";

interface PackageRow {
  id: string;
  credits: number;
  /** Rupiah bulat (Midtrans hanya IDR). */
  priceIdr: number;
  highlight: boolean;
  active: boolean;
  sortOrder: number;
}

/** Harga paket wajib rupiah bulat ≥ Rp10.000 (sama dengan validasi backend). */
const validIdr = (raw: string) => /^\d+$/.test(raw.trim()) && Number(raw) >= 10000 && Number(raw) <= 100_000_000;

export function PackagesTab() {
  const { t } = useTranslation();
  const q = useAdminGet<{ packages: PackageRow[] }>("/admin/packages");
  const [draft, setDraft] = useState({ id: "", credits: "", idr: "" });
  const [busy, setBusy] = useState(false);
  return (
    <Panel title={t("admin.tabs.packages")} actions={<ReloadBtn onClick={q.reload} loading={q.loading} />}>
      <GatewayStatus />
      <Loadable {...q} onRetry={q.reload}>
        <Table head={[t("admin.packages.name"), t("admin.packages.credits"), t("admin.packages.priceIdr"), t("admin.active"), ""]} empty={q.data?.packages.length === 0}>
          {q.data?.packages.map((p) => <PackageRowView key={p.id} p={p} onChanged={q.reload} />)}
        </Table>
      </Loadable>
      <form
        className="mt-4 grid gap-2 rounded-xl border border-dashed border-gray-300 p-3 md:grid-cols-4 dark:border-gray-700"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          const ok = await act(
            () =>
              api("/admin/packages", {
                body: {
                  id: draft.id.trim(),
                  credits: Number(draft.credits),
                  priceIdr: Number(draft.idr),
                },
              }),
            t("admin.saved"),
            q.reload,
          );
          setBusy(false);
          if (ok) setDraft({ id: "", credits: "", idr: "" });
        }}
      >
        <input className={INPUT} placeholder="id (credits-1000)" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value })} />
        <input className={INPUT} type="number" placeholder={t("admin.packages.credits")} value={draft.credits} onChange={(e) => setDraft({ ...draft, credits: e.target.value })} />
        <input className={INPUT} type="number" step="500" min="10000" placeholder={t("admin.packages.priceIdr")} value={draft.idr} onChange={(e) => setDraft({ ...draft, idr: e.target.value })} />
        <button className={btn.primary} disabled={busy || !draft.id || !draft.credits || !validIdr(draft.idr)}>
          {t("admin.packages.add")}
        </button>
      </form>
    </Panel>
  );
}

interface GatewayInfo {
  configured: boolean;
  environment: "sandbox" | "production";
  keyPrefix: string | null;
  keyEnvironmentMismatch: boolean | null;
  notificationUrl: string;
  finishRedirectUrl: string;
  dashboard: string;
  check?: { ok: boolean; httpStatus: number | null; message: string | null };
}

/** Status Midtrans untuk admin: lingkungan, kecocokan key, URL yang harus diisi di dashboard, dan uji key. */
function GatewayStatus() {
  const { t } = useTranslation();
  const q = useAdminGet<GatewayInfo>("/admin/payments/gateway");
  const [check, setCheck] = useState<GatewayInfo["check"] | null>(null);
  const [busy, setBusy] = useState(false);
  const g = q.data;
  if (!g) return null;
  const tone = !g.configured || g.keyEnvironmentMismatch || check?.ok === false ? "warn" : check?.ok ? "success" : "info";
  return (
    <div className="mb-4">
      <Notice tone={tone} title={t("admin.gateway.title", { env: g.environment })}>
        <p>{g.configured ? t("admin.gateway.key", { prefix: g.keyPrefix ?? "?" }) : t("admin.gateway.notConfigured")}</p>
        {g.keyEnvironmentMismatch && <p className="font-medium">{t("admin.gateway.mismatch")}</p>}
        <p>
          {t("admin.gateway.notification")} <code className="break-all">{g.notificationUrl}</code>
        </p>
        <p>
          {t("admin.gateway.finish")} <code className="break-all">{g.finishRedirectUrl}</code>
        </p>
        {check && <p className="font-medium">{check.ok ? t("admin.gateway.checkOk") : t("admin.gateway.checkFail", { status: check.httpStatus ?? "-", message: check.message ?? "" })}</p>}
        <button
          type="button"
          className={`${btn.secondary} mt-2`}
          disabled={busy || !g.configured}
          onClick={async () => {
            setBusy(true);
            try {
              setCheck((await api<GatewayInfo>("/admin/payments/gateway/check", { method: "POST" })).check ?? null);
            } catch {
              setCheck({ ok: false, httpStatus: null, message: null });
            } finally {
              setBusy(false);
            }
          }}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {t("admin.gateway.check")}
        </button>
      </Notice>
    </div>
  );
}

function PackageRowView({ p, onChanged }: { p: PackageRow; onChanged: () => void }) {
  const { t } = useTranslation();
  const init = () => ({ credits: String(p.credits), idr: String(p.priceIdr), active: p.active, highlight: p.highlight });
  const [v, setV] = useState(init);
  const [busy, setBusy] = useState(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setV(init()), [p]);
  const body = { credits: Number(v.credits), priceIdr: Number(v.idr), active: v.active, highlight: v.highlight };
  const dirty = body.credits !== p.credits || body.priceIdr !== p.priceIdr || v.active !== p.active || v.highlight !== p.highlight;
  return (
    <tr>
      <td className={td}>
        <p className="font-medium">{t("admin.packages.label", { credits: p.credits })}</p>
        <p className="text-xs text-gray-500">
          {p.id} · {formatIdr(p.priceIdr)} ({formatIdr(Math.round(p.priceIdr / p.credits))}/{t("admin.packages.perCredit")})
        </p>
      </td>
      <td className={td}>
        <input className={`${INPUT} w-24`} type="number" value={v.credits} onChange={(e) => setV({ ...v, credits: e.target.value })} />
      </td>
      <td className={td}>
        <input className={`${INPUT} w-32`} type="number" step="500" min="10000" value={v.idr} onChange={(e) => setV({ ...v, idr: e.target.value })} />
      </td>
      <td className={`${td} whitespace-nowrap text-xs`}>
        <label className="mr-2">
          <input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} /> {t("admin.active")}
        </label>
        <label>
          <input type="checkbox" checked={v.highlight} onChange={(e) => setV({ ...v, highlight: e.target.checked })} /> {t("admin.packages.highlight")}
        </label>
      </td>
      <td className={td}>
        <button
          type="button"
          className={btn.success}
          disabled={!dirty || busy}
          onClick={async () => {
            setBusy(true);
            await act(() => api(`/admin/packages/${encodeURIComponent(p.id)}`, { method: "PATCH", body }), t("admin.saved"), onChanged);
            setBusy(false);
          }}
        >
          {t("admin.save")}
        </button>
      </td>
    </tr>
  );
}

/* ------------------------------ pembayaran & job ------------------------------ */
