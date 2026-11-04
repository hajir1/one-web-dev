import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router";
import { Loader2, Printer } from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import BrandLogo from "../../components/app/BrandLogo";
import { Link } from "../../components/app/LocaleLink";
import { btn, Notice } from "../../components/app/ui";
import { api, ApiError } from "../../api/client";
import { formatNumber } from "../../i18n";

interface Invoice {
  invoiceNumber: string;
  issuedAt: string;
  status: string;
  seller: { name: string; address: string; email: string; phone: string; taxId: string };
  buyer: { email: string; name: string | null };
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string | null;
  providerTxId: string | null;
  refund: { amount: number; credits: number; at: string; reason: string | null } | null;
}

const rp = (n: number) => `Rp${formatNumber(n)}`;

/** /:lang/invoice/:id: a print-ready invoice / save as PDF (Ctrl+P → Save as PDF). */
export default function InvoicePage() {
  const { t, i18n } = useTranslation();
  const { id = "" } = useParams();
  const [inv, setInv] = useState<Invoice | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Invoice>(`/billing/payments/${encodeURIComponent(id)}/invoice`)
      .then(setInv)
      .catch((e) => setError(e instanceof ApiError ? e.message : t("errors.unknown")));
  }, [id, t]);

  const date = (s: string) => new Date(s).toLocaleString(i18n.language?.startsWith("en") ? "en-GB" : "id-ID", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" });

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 text-gray-800 dark:bg-gray-950 dark:text-gray-200 print:bg-white print:p-0 print:text-black">
      <AppMeta title={inv ? inv.invoiceNumber : t("invoice.title")} />
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 flex items-center justify-between print:hidden">
          <Link to="/credits" className="text-sm text-brand-600 hover:underline dark:text-brand-400">
            ← {t("invoice.back")}
          </Link>
          {inv && (
            <button type="button" className={btn.secondary} onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> {t("invoice.print")}
            </button>
          )}
        </div>
        {error && <Notice tone="error">{error}</Notice>}
        {!inv && !error && <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />}
        {inv && (
          <article className="rounded-2xl border border-gray-200 bg-white p-6 text-sm sm:p-8 dark:border-gray-800 dark:bg-gray-900 print:border-0 print:bg-white print:p-0" data-testid="invoice">
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5 dark:border-gray-800">
              <div>
                <BrandLogo />
                <p className="mt-3 font-semibold">{inv.seller.name}</p>
                <p className="text-gray-500">{inv.seller.address}</p>
                <p className="text-gray-500">
                  {inv.seller.email} · {inv.seller.phone}
                </p>
                <p className="text-gray-500">NPWP: {inv.seller.taxId}</p>
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold uppercase tracking-wide">{t("invoice.title")}</h1>
                <p className="mt-1 font-mono">{inv.invoiceNumber}</p>
                <p className="text-gray-500">{date(inv.issuedAt)} WIB</p>
                <p className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${inv.status === "REFUNDED" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {inv.status === "REFUNDED" ? t("invoice.refunded") : t("invoice.paid")}
                </p>
              </div>
            </header>
            <section className="mt-5">
              <p className="text-xs font-semibold uppercase text-gray-500">{t("invoice.billTo")}</p>
              <p className="mt-1">{inv.buyer.name ?? "-"}</p>
              <p className="text-gray-500">{inv.buyer.email}</p>
            </section>
            <table className="mt-6 w-full text-left">
              <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 dark:border-gray-800">
                <tr>
                  <th className="py-2">{t("invoice.item")}</th>
                  <th className="py-2 text-right">{t("invoice.qty")}</th>
                  <th className="py-2 text-right">{t("invoice.amount")}</th>
                </tr>
              </thead>
              <tbody>
                {inv.items.map((it, i) => (
                  <tr key={i} className="border-b border-gray-100 dark:border-gray-800">
                    <td className="py-2">{it.description}</td>
                    <td className="py-2 text-right">{it.quantity}</td>
                    <td className="py-2 text-right">{rp(it.total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="pt-3 text-right font-semibold">
                    {t("invoice.total")}
                  </td>
                  <td className="pt-3 text-right text-base font-bold">{rp(inv.total)}</td>
                </tr>
              </tfoot>
            </table>
            <p className="mt-6 text-xs text-gray-500">
              {t("invoice.paidVia", { method: inv.paymentMethod ?? "Midtrans" })}
              {inv.providerTxId ? ` · ${inv.providerTxId}` : ""}
            </p>
            {inv.refund && (
              <p className="mt-2 text-xs text-rose-600">
                {t("invoice.refundNote", { amount: rp(inv.refund.amount), credits: inv.refund.credits, date: date(inv.refund.at) })}
              </p>
            )}
            <p className="mt-6 text-xs text-gray-400">{t("invoice.footer")}</p>
          </article>
        )}
      </div>
    </div>
  );
}
