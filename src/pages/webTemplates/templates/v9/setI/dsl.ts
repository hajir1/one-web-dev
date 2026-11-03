import type { B, IBlockId, IBlockRef, IPage } from "./spec";

/** Halaman ringkas: kunci, nama menu, judul kepala halaman, blok. */
export const page = (key: string, name: B, title: B, blocks: IBlockRef[], text?: B): IPage => ({ key, name, title, blocks, ...(text ? { text } : {}) });

/** Blok dengan judul (dan teks) pengganti. */
export const tb = (id: IBlockId, title: B, text?: B): IBlockRef => (text ? [id, title, text] : [id, title]);
