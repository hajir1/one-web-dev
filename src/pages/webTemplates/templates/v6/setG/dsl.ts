import type { B, BlockId, BlockRef, GPage } from "./spec";

/** Halaman ringkas: kunci, nama menu, judul kepala halaman, blok. */
export const page = (key: string, name: B, title: B, blocks: BlockRef[], text?: B): GPage => ({ key, name, title, blocks, ...(text ? { text } : {}) });

/** Blok dengan judul (dan teks) pengganti. */
export const tb = (id: BlockId, title: B, text?: B): BlockRef => (text ? [id, title, text] : [id, title]);
