import { api, apiUrl, ApiError } from "../api/client";
import { apiConfig } from "../pages/media/processing/apiConfig";
import { AssetError } from "./prepareImage";
import type { AssetBackend, AssetMeta, PreparedImage } from "./types";

/* ================================================================== */
/* Fullstack mode (backend v13): account-owned assets in object storage. */
/*                                                                    */
/*   GET    /assets                     → { assets: [...] } (+ download url) */
/*   POST   /assets/uploads             { name, contentType, bytes, width, height } */
/*            → 201 { asset, upload:{ url, method:"PUT", headers } }    */
/*   PUT    upload.url                  (directly to storage)            */
/*   POST   /assets/:id/complete        → asset siap (+ url)            */
/*   PATCH  /assets/:id                 { name }                         */
/*   DELETE /assets/:id                                                 */
/* ================================================================== */

interface ServerAsset {
  id: string;
  name: string;
  contentType: string;
  bytes: number;
  width: number | null;
  height: number | null;
  createdAt: string;
  url?: string;
}

const toMeta = (a: ServerAsset): AssetMeta => ({
  id: a.id,
  name: a.name,
  mime: a.contentType,
  bytes: a.bytes,
  width: a.width ?? 0,
  height: a.height ?? 0,
  createdAt: Date.parse(a.createdAt) || Date.now(),
  url: a.url,
});

const isApi = (u: string) => u.startsWith(apiUrl("/"));

/** Latest download URL per id (used by blob()). */
const urls = new Map<string, string>();
const remember = (m: AssetMeta) => {
  if (m.url) urls.set(m.id, m.url);
  return m;
};

const mapErr = (e: unknown): never => {
  if (e instanceof ApiError) {
    if (e.status === 413) throw new AssetError("size");
    if (e.status === 415) throw new AssetError("type");
    if (e.status === 409 || e.status === 402) throw new AssetError("quota");
  }
  throw e instanceof AssetError ? e : new AssetError("network");
};

export const serverBackend: AssetBackend = {
  kind: "server",
  async list() {
    const r = await api<{ assets: ServerAsset[] }>("/assets");
    return r.assets.map(toMeta).map(remember);
  },
  async add(img: PreparedImage) {
    try {
      const r = await api<{ asset: ServerAsset; upload: { url: string; headers?: Record<string, string> } }>("/assets/uploads", {
        body: { name: img.name, contentType: img.mime, bytes: img.blob.size, width: img.width, height: img.height },
      });
      const put = await apiConfig.fetch(r.upload.url, { method: "PUT", body: img.blob, headers: r.upload.headers ?? {}, credentials: isApi(r.upload.url) ? "include" : "omit" });
      if (!put.ok) throw new AssetError("network");
      const done = await api<ServerAsset>(`/assets/${encodeURIComponent(r.asset.id)}/complete`, { method: "POST", body: {} });
      return remember(toMeta(done));
    } catch (e) {
      return mapErr(e);
    }
  },
  async rename(id, name) {
    await api(`/assets/${encodeURIComponent(id)}`, { method: "PATCH", body: { name } });
  },
  async remove(id) {
    await api(`/assets/${encodeURIComponent(id)}`, { method: "DELETE" });
    urls.delete(id);
  },
  async blob(id) {
    let url = urls.get(id);
    if (!url) {
      await serverBackend.list().catch(() => null);
      url = urls.get(id);
    }
    if (!url) return null;
    const r = await apiConfig.fetch(url, { credentials: isApi(url) ? "include" : "omit" }).catch(() => null);
    return r && r.ok ? r.blob() : null;
  },
};
