// ─── api/bootstrap.ts ────────────────────────────────────────────────────────
// Dipanggil sekali saat aplikasi dibuka: cek sesi login ke backend Nest dan
// sambungkan store yang bergantung pada akun (kredit, marketplace, desain).

import { loadSession, onUserChange } from "../auth/session";
import { refreshMarketAccount, resetMarketAccount } from "../marketplace/account";
import { loadServerCatalog } from "../marketplace/serverCatalog";
import { refreshBilling } from "../pages/media/processing/billing";
import { installDesignSync } from "../pages/pageMaker/core/store/designSync";
import { acquireCodeTemplateHtml, clearTemplateCache } from "../pages/webTemplates/templateContent";
import { clearCodeTemplateCache, setCodeTemplateSource } from "../pages/webTemplates/codeTemplates/catalog";
import { isDemoMode } from "../demo/demoMode";
import { clearAccountQueries } from "./queryClient";
import { prefetchCommonPages } from "./queries";

let started = false;

export function bootstrapApi() {
  if (started) return;
  started = true;
  // v21.2: HTML Template Kode diambil dari backend (hak akses dicek server).
  if (!isDemoMode()) setCodeTemplateSource(acquireCodeTemplateHtml);
  installDesignSync();
  onUserChange((user) => {
    clearTemplateCache();
    clearCodeTemplateCache();
    clearAccountQueries();
    void refreshBilling();
    if (user) void refreshMarketAccount();
    else resetMarketAccount();
  });
  void loadServerCatalog();
  void loadSession().then((user) => {
    if (user) void refreshMarketAccount();
    else resetMarketAccount();
    // Setelah data utama dimuat: siapkan halaman yang paling sering dibuka
    // (katalog template halaman 1) saat browser senggang.
    prefetchCommonPages();
  });
}
