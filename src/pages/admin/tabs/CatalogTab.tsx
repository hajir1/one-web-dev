import {  useEffect,  useState } from "react";
import { useTranslation } from "react-i18next";
import {  INPUT,  Panel, btn } from "../../../components/app/ui";
import {  api } from "../../../api/client";
import { Loadable, ReloadBtn, SearchBox, Select, Table } from "../adminShared";
import { qs, refreshCatalogCaches, td, useAdminGet, act } from "../adminApi";

interface CatalogRow {
  id: string;
  kind: string;
  name: string;
  tier: "free" | "premium";
  price: number;
  active: boolean;
  isNew: boolean;
}

export function CatalogTab() {
  const { t } = useTranslation();
  const [f, setF] = useState({ q: "", kind: "" });
  const q = useAdminGet<{ items: CatalogRow[] }>(`/admin/catalog-items${qs(f)}`);
  const changed = () => {
    void q.reload();
    refreshCatalogCaches();
  };
  return (
    <Panel
      title={t("admin.tabs.catalog")}
      description={t("admin.catalog.hint")}
      actions={
        <>
          <SearchBox value={f.q} onChange={(v) => setF({ ...f, q: v })} placeholder={t("admin.catalog.search")} />
          <Select
            value={f.kind}
            onChange={(v) => setF({ ...f, kind: v })}
            options={[
              { value: "", label: t("admin.catalog.allKinds") },
              { value: "section", label: "section" },
              { value: "element", label: "element" },
              { value: "event", label: "event" },
              { value: "feature", label: "feature" },
            ]}
          />
          <ReloadBtn onClick={q.reload} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table head={[t("admin.catalog.item"), t("admin.tier"), t("admin.price"), t("admin.active"), ""]} empty={q.data?.items.length === 0}>
          {q.data?.items.map((it) => <CatalogRowView key={it.id} it={it} onChanged={changed} />)}
        </Table>
      </Loadable>
    </Panel>
  );
}

function CatalogRowView({ it, onChanged }: { it: CatalogRow; onChanged: () => void }) {
  const { t } = useTranslation();
  const [v, setV] = useState({ tier: it.tier, price: String(it.price), active: it.active });
  const [busy, setBusy] = useState(false);
  useEffect(() => setV({ tier: it.tier, price: String(it.price), active: it.active }), [it.tier, it.price, it.active]);
  const dirty = v.tier !== it.tier || Number(v.price) !== it.price || v.active !== it.active;
  return (
    <tr data-testid="admin-catalog-row">
      <td className={td}>
        <p className="font-medium">{it.name}</p>
        <p className="text-xs text-gray-500">
          {it.id} · {it.kind}
        </p>
      </td>
      <td className={td}>
        <Select value={v.tier} onChange={(x) => setV({ ...v, tier: x as "free" | "premium" })} options={[{ value: "free", label: t("admin.free") }, { value: "premium", label: t("admin.premium") }]} />
      </td>
      <td className={td}>
        <input className={`${INPUT} w-20`} type="number" min={0} value={v.tier === "free" ? "0" : v.price} disabled={v.tier === "free"} onChange={(e) => setV({ ...v, price: e.target.value })} />
      </td>
      <td className={td}>
        <input type="checkbox" checked={v.active} onChange={(e) => setV({ ...v, active: e.target.checked })} aria-label={t("admin.active")} />
      </td>
      <td className={td}>
        <button
          type="button"
          className={btn.success}
          disabled={!dirty || busy}
          onClick={async () => {
            setBusy(true);
            await act(
              () => api(`/admin/catalog-items/${encodeURIComponent(it.id)}`, { method: "PATCH", body: { tier: v.tier, price: v.tier === "free" ? 0 : Number(v.price), active: v.active } }),
              t("admin.saved"),
              onChanged,
            );
            setBusy(false);
          }}
        >
          {t("admin.save")}
        </button>
      </td>
    </tr>
  );
}

/* ------------------------------ paket kredit ------------------------------ */
