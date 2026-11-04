// ─── api/bootstrap.ts ────────────────────────────────────────────────────────
// Called once when the app opens: checks the login session with the Nest backend and
// connects the stores that depend on the account (credits, marketplace, designs).

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
  // v21.2: Code Template HTML is fetched from the backend (access is checked by the server).
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
    // After the main data loads: prepare the most frequently opened page
    // (template catalog page 1) while the browser is idle.
    prefetchCommonPages();
  });
}
