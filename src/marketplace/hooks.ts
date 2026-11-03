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
/* Hook baca katalog & hak akses untuk komponen                          */
/* ================================================================== */

/**
 * Katalog lengkap (template, section, elemen) dengan status loading/error.
 * Lewat TanStack Query: dibagi semua komponen, segar 5 menit, error jaringan
 * dicoba ulang otomatis. `enabled=false` → belum dimuat (mis. daftar
 * template berhalaman hanya butuh katalog lengkap saat dialog beli dibuka).
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

/** Akun marketplace dari server (saldo, hak akses, kuota). Memuat sekali saat dipakai pertama. */
export function useMarketAccount() {
  const status = useMarketStore((s) => s.status);
  useEffect(() => {
    if (status === "idle") void refreshMarketAccount();
  }, [status]);
  return useMarketStore((s) => s.account);
}
export const useMarketStatus = () => useMarketStore((s) => s.status);

/** Batas desain halaman = kuota dasar + paket desain yang dibeli (angka dari server). Mode demo (v15): tanpa batas. */
export const maxDesigns = (): number => (isDemoMode() ? UNLIMITED_LIMIT : useMarketStore.getState().account.limits.designs.max);
export const useMaxDesigns = (): number => {
  const max = useMarketStore((s) => s.account.limits.designs.max);
  return isDemoMode() ? UNLIMITED_LIMIT : max;
};

/** Batas folder website = FREE_SITES + paket website + slot satuan (angka dari server). Mode demo (v15): tanpa batas. */
export const useSiteLimit = (): number => {
  const max = useMarketStore((s) => s.account.limits.sites.max);
  return isDemoMode() ? UNLIMITED_LIMIT : max;
};
export const siteLimit = (): number => (isDemoMode() ? UNLIMITED_LIMIT : useMarketStore.getState().account.limits.sites.max);

/**
 * Pemeriksa akses: item & template milik akun menurut SERVER.
 * `ctx.templateId` = desain berasal dari template itu.
 */
export function useAccess(ctx?: AccessContext) {
  const serverOwns = useOwnedItems();
  const snap = useMarketStore((s) => s.account.entitlements);
  const templateId = ctx?.templateId ?? null;

  const reason = useCallback(
    (itemId: ItemId, tier: Tier): AccessReason => {
      if (tier === "free") return "free";
      // Mode demo: semua section, elemen, event, dan fitur (v15: termasuk Tur 360° Pro) terbuka.
      if (isDemoMode()) return "free";
      if (serverOwns(itemId)) return "owned";
      return accessReason(itemId, tier, snap, { templateId });
    },
    [serverOwns, snap, templateId],
  );
  /** Untuk item Premium: true bila boleh dipakai di konteks ini. */
  const owns = useCallback((itemId: ItemId) => reason(itemId, "premium") !== "locked", [reason]);
  const ownsTemplate = useCallback((id: string) => isDemoMode() || serverOwns(`template:${id}`) || snapOwnsTemplate(snap, id), [serverOwns, snap]);
  const activeTemplate = activeTemplateContext(snap, { templateId }) ?? (templateId && serverOwns(`template:${templateId}`) ? templateId : null);
  const included = useCallback((itemId: ItemId) => !!activeTemplate && templateGrantedItems(snap).has(itemId), [activeTemplate, snap]);

  return { reason, owns, ownsTemplate, included, activeTemplate };
}

/**
 * Izin elemen Premium per desain halaman (ekspor website): desain dari
 * template memakai akses bawaan template itu; desain lain hanya item milik.
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

/** v6: batas dari server untuk admin tanpa kredit (praktis tanpa batas, sama dengan ADMIN_UNLIMITED di backend). */
export const UNLIMITED_LIMIT = 999_999;
/** Angka batas untuk ditampilkan: "∞" bila tanpa batas. */
export const limitText = (n: number): string | number => (n >= UNLIMITED_LIMIT ? "∞" : n);
