import type { B, BlockId, BlockRef, GPage } from "./spec";

/** A compact page: key, menu name, page header title, blocks. */
export const page = (key: string, name: B, title: B, blocks: BlockRef[], text?: B): GPage => ({ key, name, title, blocks, ...(text ? { text } : {}) });

/** A block with a replacement title (and text). */
export const tb = (id: BlockId, title: B, text?: B): BlockRef => (text ? [id, title, text] : [id, title]);
