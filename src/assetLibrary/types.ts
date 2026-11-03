/** Satu gambar di Pustaka Aset. */
export interface AssetMeta {
  id: string;
  name: string;
  mime: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: number;
  /** Mode server: URL unduh sementara (diperbarui tiap daftar dimuat). */
  url?: string;
}

/** Gambar yang sudah diproses di browser, siap disimpan. */
export interface PreparedImage {
  blob: Blob;
  name: string;
  mime: string;
  width: number;
  height: number;
}

/** Tempat penyimpanan aset: IndexedDB (demo / belum masuk) atau server (akun). */
export interface AssetBackend {
  readonly kind: "local" | "server";
  list(): Promise<AssetMeta[]>;
  add(img: PreparedImage): Promise<AssetMeta>;
  rename(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
  blob(id: string): Promise<Blob | null>;
}

export const ASSET_LIMITS = {
  /** Berkas masuk sebelum diproses. */
  maxInputBytes: 15 * 1024 * 1024,
  /** Berkas tersimpan setelah diperkecil (sama dengan batas server). */
  maxBytes: 5 * 1024 * 1024,
  /** Sisi terpanjang setelah diperkecil. */
  maxSide: 2000,
  maxCount: 500,
  types: ["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"] as readonly string[],
};
