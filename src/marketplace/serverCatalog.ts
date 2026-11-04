import { create } from "zustand";
import { api } from "../api/client";
import { qk, queryClient, STALE } from "../api/queryClient";
import { isBackendConfigured } from "../pages/media/processing/apiConfig";
import type { ItemId, Tier } from "./types";

/* ================================================================== */
/* Section/element/event/feature prices & tiers from the SERVER (GET /catalog) */
/*                                                                    */
/* Admins can change tiers & prices in the admin panel; values here      */
/* override the frontend defaults for DISPLAY. The charged price          */
/* is still computed by the server.                                      */
/* ================================================================== */

export interface ServerPiece {
  tier: Tier;
  price: number;
  name: string;
}

interface ServerCatalogState {
  status: "idle" | "loading" | "ready" | "error" | "unavailable";
  items: Map<ItemId, ServerPiece>;
}

const useServerCatalog = create<ServerCatalogState>(() => ({ status: "idle", items: new Map() }));

/** Server value for one item, once loaded. */
export const serverPiece = (id: ItemId): ServerPiece | undefined => useServerCatalog.getState().items.get(id);

function sanitizeServerCatalog(raw: unknown): Map<ItemId, ServerPiece> {
  const out = new Map<ItemId, ServerPiece>();
  const list = raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown }).items) ? (raw as { items: unknown[] }).items : [];
  for (const r of list) {
    if (!r || typeof r !== "object") continue;
    const v = r as Record<string, unknown>;
    if (typeof v.id !== "string" || !/^(preset|element|event|feature):[\w-]{1,80}$/.test(v.id)) continue;
    const tier: Tier = v.tier === "premium" ? "premium" : "free";
    const price = typeof v.price === "number" && Number.isFinite(v.price) && v.price >= 0 ? v.price : 0;
    out.set(v.id, { tier, price: tier === "free" ? 0 : price, name: typeof v.name === "string" ? v.name : v.id });
  }
  return out;
}

let inflight: Promise<void> | null = null;
export function loadServerCatalog(force = false): Promise<void> {
  if (!isBackendConfigured()) {
    useServerCatalog.setState({ status: "unavailable" });
    return Promise.resolve();
  }
  if (!force && useServerCatalog.getState().status === "ready") return Promise.resolve();
  inflight ??= (async () => {
    useServerCatalog.setState({ status: "loading" });
    try {
      const raw = await queryClient.fetchQuery({ queryKey: qk.serverCatalog, queryFn: () => api("/catalog"), staleTime: force ? 0 : STALE.medium, retry: false });
      useServerCatalog.setState({ status: "ready", items: sanitizeServerCatalog(raw) });
    } catch {
      useServerCatalog.setState({ status: "error" });
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
