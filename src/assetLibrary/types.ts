/** One image in the Asset Library. */
export interface AssetMeta {
  id: string;
  name: string;
  mime: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: number;
  /** Server mode: temporary download URL (refreshed each time the list loads). */
  url?: string;
}

/** An image already processed in the browser, ready to store. */
export interface PreparedImage {
  blob: Blob;
  name: string;
  mime: string;
  width: number;
  height: number;
}

/** Asset storage: IndexedDB (demo / signed out) or server (account). */
export interface AssetBackend {
  readonly kind: "local" | "server";
  list(): Promise<AssetMeta[]>;
  add(img: PreparedImage): Promise<AssetMeta>;
  rename(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
  blob(id: string): Promise<Blob | null>;
}

export const ASSET_LIMITS = {
  /** Incoming file before processing. */
  maxInputBytes: 15 * 1024 * 1024,
  /** Stored file after downscaling (same as the server limit). */
  maxBytes: 5 * 1024 * 1024,
  /** Longest side after downscaling. */
  maxSide: 2000,
  maxCount: 500,
  types: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"] as readonly string[],
};
