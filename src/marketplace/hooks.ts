import { useCallback, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useOwnedItems } from "../credits/items";
import { accessReason, activeTemplateContext, ownsTemplate as snapOwnsTemplate, templateGrantedItems } from "./entitlements";
import { catalogRepository, type CatalogSnapshot } from "./repository";
import { catalogQuery } from "../api/queries";
import { refreshMarketAccount, useMarketStore } from "./account";
import type { AccessContext, AccessReason, ItemId, Tier } from "./types";
import { isDemoMode } from "../demo/demoMode";

/* ================================================================== */
/* Hooks reading the catalog & access rights for components              */
/* ================================================================== */

/**
 * The full catalog (templates, sections, elements) with loading/error status.
 * Through TanStack Query: shared by all components, fresh for 5 minutes, network errors
 * retried automatically. `enabled=false` → not loaded yet (e.g. the paginated
 * template list only needs the full catalog when the purchase dialog opens).
 */
export function useCatalog(enabled = true) {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "id";
  const q = useQuery({ ...catalogQuery(lang), enabled });
  const reload = useCallback(() => {
    catalogRepository.clear();
    void q.refetch();
  }, [q]);
  const status = q.isPending ? "loading" : q.isError && !q.data ? "error" : "ready";
  return { status, data: (q.data as CatalogSnapshot | undefined) ?? null, error: q.error ? q.error.message : null, reload } as const;
}

/** Marketplace account from the server (balance, access, quota). Loads once on first use. */
export function useMarketAccount() {
  const status = useMarketStore((s) => s.status);
  useEffect(() => {
    if (status === "idle") void refreshMarketAccount();
  }, [status]);
  return useMarketStore((s) => s.account);
}
export const useMarketStatus = () => useMarketStore((s) => s.status);

/** Page design limit = base quota + purchased design packs (numbers from the server). Demo mode (v15): unlimited. */
export const maxDesigns = (): number => (isDemoMode() ? UNLIMITED_LIMIT : useMarketStore.getState().account.limits.designs.max);
export const useMaxDesigns = (): number => {
  const max = useMarketStore((s) => s.account.limits.designs.max);
  return isDemoMode() ? UNLIMITED_LIMIT : max;
};

/** Website folder limit = FREE_SITES + website packs + single slots (numbers from the server). Demo mode (v15): unlimited. */
export const useSiteLimit = (): number => {
  const max = useMarketStore((s) => s.account.limits.sites.max);
  return isDemoMode() ? UNLIMITED_LIMIT : max;
};
export const siteLimit = (): number => (isDemoMode() ? UNLIMITED_LIMIT : useMarketStore.getState().account.limits.sites.max);

/**
 * Access checker: items & templates owned by the account according to the SERVER.
 * `ctx.templateId` = the design comes from that template.
 */
export function useAccess(ctx?: AccessContext) {
  const serverOwns = useOwnedItems();
  const snap = useMarketStore((s) => s.account.entitlements);
  const templateId = ctx?.templateId ?? null;

  const reason = useCallback(
    (itemId: ItemId, tier: Tier): AccessReason => {
      if (tier === "free") return "free";
      // Demo mode: every section, element, event, and feature (v15: including 360° Tour Pro) is unlocked.
      if (isDemoMode()) return "free";
      if (serverOwns(itemId)) return "owned";
      return accessReason(itemId, tier, snap, { templateId });
    },
    [serverOwns, snap, templateId],
  );
  /** For Premium items: true when it may be used in this context. */
  const owns = useCallback((itemId: ItemId) => reason(itemId, "premium") !== "locked", [reason]);
  const ownsTemplate = useCallback((id: string) => isDemoMode() || serverOwns(`template:${id}`) || snapOwnsTemplate(snap, id), [serverOwns, snap]);
  const activeTemplate = activeTemplateContext(snap, { templateId }) ?? (templateId && serverOwns(`template:${templateId}`) ? templateId : null);
  const included = useCallback((itemId: ItemId) => !!activeTemplate && templateGrantedItems(snap).has(itemId), [activeTemplate, snap]);

  return { reason, owns, ownsTemplate, included, activeTemplate };
}

/**
 * Premium element permission per page design (website export): designs from a
 * template use that template's built-in access; other designs only owned items.
 */
export function usePremiumElementsFor() {
  const serverOwns = useOwnedItems();
  const snap = useMarketStore((s) => s.account.entitlements);
  return useCallback(
    (doc: { source?: { templateId: string } }) => (type: string) => {
      if (isDemoMode()) return true;
      const id = `element:${type}`;
      return serverOwns(id) || accessReason(id, "premium", snap, { templateId: doc.source?.templateId ?? null }) !== "locked";
    },
    [serverOwns, snap],
  );
}

/** v6: server limit for no-credit admins (practically unlimited, same as ADMIN_UNLIMITED in the backend). */
export const UNLIMITED_LIMIT = 999_999;
/** Limit number for display: "∞" when unlimited. */
export const limitText = (n: number): string | number => (n >= UNLIMITED_LIMIT ? "∞" : n);
