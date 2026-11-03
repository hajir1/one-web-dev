import { api, ApiError, newIdempotencyKey } from "../api/client";
import { commitAccount, refreshMarketAccount } from "./account";
import { quoteDesigns, quoteSites } from "./pricing";
import type { DesignQuote, PieceCatalogItem, SiteQuote, TemplateCatalogItem } from "./types";

/* ================================================================== */
/* Layanan transaksi (terpisah dari tampilan)                           */
/*                                                                    */
/* Semua pembelian lewat backend Nest: harga ditentukan SERVER, kredit    */
/* dipotong sekali per kunci idempoten, dan akun hanya diperbarui dari    */
/* respons server. Komponen tidak menghitung saldo sendiri.              */
/* ================================================================== */

type PurchaseError = "insufficient" | "already-owned" | "not-for-sale" | "invalid" | "signin" | "network";

type CommerceResult = { ok: true } | { ok: false; error: PurchaseError; message?: string };

export interface CommerceService {
  readonly mode: "server";
  purchaseTemplate(tpl: TemplateCatalogItem): Promise<CommerceResult>;
  purchaseItem(item: PieceCatalogItem): Promise<CommerceResult>;
  /** Beli kuota desain halaman; jumlah dibulatkan ke paket (lihat pricing.ts). */
  purchaseDesigns(designs: number): Promise<CommerceResult & { quote?: DesignQuote }>;
  /** Beli slot folder website tambahan; harga bertingkat (lihat pricing.ts). */
  purchaseSites(sites: number): Promise<CommerceResult & { quote?: SiteQuote }>;
}

/** Ubah error HTTP backend menjadi alasan yang dipahami UI. */
function purchaseError(e: unknown): { ok: false; error: PurchaseError; message?: string } {
  if (!(e instanceof ApiError)) return { ok: false, error: "network" };
  const message = e.message;
  if (e.status === 401) return { ok: false, error: "signin", message };
  if (e.status === 402) return { ok: false, error: "insufficient", message };
  if (e.status === 409) return { ok: false, error: "already-owned", message };
  if (e.code === "ITEM_UNKNOWN" || e.code === "TEMPLATE_NOT_FOR_SALE") return { ok: false, error: "not-for-sale", message };
  if (e.status === 0) return { ok: false, error: "network", message };
  return { ok: false, error: "invalid", message };
}

type PurchaseBody = { account?: unknown; billing?: unknown };

/** Klik ganda pada aksi yang sama digabung menjadi satu permintaan (satu kunci idempoten). */
const inflight = new Map<string, Promise<CommerceResult>>();
function once(key: string, fn: () => Promise<CommerceResult>) {
  const cur = inflight.get(key);
  if (cur) return cur;
  const p = fn().finally(() => inflight.delete(key));
  inflight.set(key, p);
  return p;
}

async function post(path: string, body: unknown, prefix: string): Promise<CommerceResult> {
  try {
    const r = await api<PurchaseBody>(path, { method: "POST", body, idempotencyKey: newIdempotencyKey(prefix) });
    commitAccount(r.account, r.billing);
    return { ok: true };
  } catch (e) {
    const res = purchaseError(e);
    // Sudah dimiliki = tidak ada biaya baru; tetap muat ulang akun agar UI sinkron.
    if (res.error === "already-owned") void refreshMarketAccount();
    return res;
  }
}

const serverCommerce: CommerceService = {
  mode: "server",
  purchaseTemplate: (tpl) =>
    tpl.tier !== "premium" ? Promise.resolve({ ok: false, error: "not-for-sale" }) : once(tpl.id, () => post(`/templates/${encodeURIComponent(tpl.refId)}/purchase`, {}, "tpl")),
  purchaseItem: (item) => (item.tier !== "premium" ? Promise.resolve({ ok: false, error: "not-for-sale" }) : once(item.id, () => post("/marketplace/purchase", { itemId: item.id }, "item"))),
  purchaseDesigns: async (designs) => {
    const quote = quoteDesigns(designs);
    return { ...(await once(`designs:${quote.designs}`, () => post("/marketplace/design-packs", { designs: quote.designs }, "designs"))), quote };
  },
  purchaseSites: async (sites) => {
    const quote = quoteSites(sites);
    return { ...(await once(`sites:${quote.sites}`, () => post("/marketplace/site-packs", { sites: quote.sites }, "sites"))), quote };
  },
};

export const commerceService: CommerceService = serverCommerce;
