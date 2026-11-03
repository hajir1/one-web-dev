import {  useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Download,
  FileUp,
  Loader2,
} from "lucide-react";
import {  INPUT,  Panel, btn } from "../../../components/app/ui";
import { notify } from "../../../components/app/Toaster";
import {  api } from "../../../api/client";
import { Loadable, ReloadBtn, SearchBox, Select, Table } from "../adminShared";
import { type Row, errText, qs, refreshCatalogCaches, td, useAdminGet, act } from "../adminApi";

interface TemplateRow {
  refId: string;
  name: string;
  category: string;
  tier: "free" | "premium";
  price: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  version: number;
  buyers: number;
  demoFiles: number;
  demoUrl: string;
  contents: { lang: string; bytes: number }[];
  updatedAt: string;
}

export function TemplatesTab() {
  const { t } = useTranslation();
  const [f, setF] = useState({ q: "", status: "" });
  const q = useAdminGet<{ templates: TemplateRow[] }>(`/admin/templates${qs(f)}`);
  const file = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const changed = () => {
    void q.reload();
    refreshCatalogCaches();
  };

  const upload = async (fl: File) => {
    setUploading(true);
    try {
      let bundle: unknown;
      try {
        bundle = JSON.parse(await fl.text());
      } catch {
        throw new Error(t("admin.templates.badJson"));
      }
      await act(() => api("/admin/templates", { body: bundle }), t("admin.templates.uploaded"), changed);
    } catch (e) {
      notify.error(errText(e));
    } finally {
      setUploading(false);
      if (file.current) file.current.value = "";
    }
  };

  const download = async (id: string) => {
    try {
      const b = await api(`/admin/templates/${id}/bundle`);
      const url = URL.createObjectURL(new Blob([JSON.stringify(b, null, 2)], { type: "application/json" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: `${id}.owd-template.json` });
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      notify.error(errText(e));
    }
  };

  return (
    <Panel
      title={t("admin.tabs.templates")}
      description={t("admin.templates.hint")}
      actions={
        <>
          <SearchBox value={f.q} onChange={(v) => setF({ ...f, q: v })} placeholder={t("admin.templates.search")} />
          <Select
            value={f.status}
            onChange={(v) => setF({ ...f, status: v })}
            options={[{ value: "", label: t("admin.allStatus") }, ...["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => ({ value: s, label: s }))]}
          />
          <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} data-testid="admin-template-file" />
          <button type="button" className={btn.primary} disabled={uploading} onClick={() => file.current?.click()}>
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />} {t("admin.templates.upload")}
          </button>
          <ReloadBtn onClick={q.reload} loading={q.loading} />
        </>
      }
    >
      <Loadable {...q} onRetry={q.reload}>
        <Table
          head={[t("admin.templates.name"), t("admin.status"), t("admin.tier"), t("admin.price"), t("admin.templates.buyers"), ""]}
          empty={q.data?.templates.length === 0}
        >
          {q.data?.templates.map((tp) => <TemplateRowView key={tp.refId} tp={tp} onChanged={changed} onDownload={() => download(tp.refId)} />)}
        </Table>
      </Loadable>
    </Panel>
  );
}

function TemplateRowView({ tp, onChanged, onDownload }: { tp: TemplateRow; onChanged: () => void; onDownload: () => void }) {
  const { t } = useTranslation();
  const [tier, setTier] = useState(tp.tier);
  const [price, setPrice] = useState(String(tp.price));
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setTier(tp.tier);
    setPrice(String(tp.price));
  }, [tp.tier, tp.price]);
  const dirty = tier !== tp.tier || Number(price) !== tp.price;
  const patch = async (body: Row) => {
    setBusy(true);
    await act(() => api(`/admin/templates/${tp.refId}`, { method: "PATCH", body }), t("admin.saved"), onChanged);
    setBusy(false);
  };
  return (
    <tr data-testid="admin-template-row">
      <td className={td}>
        <a href={tp.demoUrl} target="_blank" rel="noreferrer" className="font-medium hover:underline">
          {tp.name || tp.refId}
        </a>
        <p className="text-xs text-gray-500">
          {tp.refId} · {tp.category} · v{tp.version} · {tp.contents.map((c) => c.lang).join("/") || t("admin.templates.noContent")}
        </p>
      </td>
      <td className={td}>
        <Select
          value={tp.status}
          onChange={(v) => v !== tp.status && patch({ status: v })}
          options={["DRAFT", "PUBLISHED", "ARCHIVED"].map((s) => ({ value: s, label: s }))}
        />
      </td>
      <td className={td}>
        <Select value={tier} onChange={(v) => setTier(v as "free" | "premium")} options={[{ value: "free", label: t("admin.free") }, { value: "premium", label: t("admin.premium") }]} />
      </td>
      <td className={td}>
        <input className={`${INPUT} w-20`} type="number" min={0} value={tier === "free" ? "0" : price} disabled={tier === "free"} onChange={(e) => setPrice(e.target.value)} />
      </td>
      <td className={td}>{tp.buyers}</td>
      <td className={`${td} whitespace-nowrap`}>
        <button type="button" className={btn.success} disabled={!dirty || busy} onClick={() => patch({ tier, price: tier === "free" ? 0 : Number(price) })}>
          {t("admin.save")}
        </button>
        <button type="button" className={btn.icon} onClick={onDownload} aria-label={t("admin.templates.download")} title={t("admin.templates.download")}>
          <Download className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

/* ------------------------------ item katalog ------------------------------ */
