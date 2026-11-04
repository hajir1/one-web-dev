import type { B, IBlockId, IBlockRef, IPage } from "./spec";

/** A compact page: key, menu name, page header title, blocks. */
export const page = (key: string, name: B, title: B, blocks: IBlockRef[], text?: B): IPage => ({ key, name, title, blocks, ...(text ? { text } : {}) });

/** A block with a replacement title (and text). */
export const tb = (id: IBlockId, title: B, text?: B): IBlockRef => (text ? [id, title, text] : [id, title]);
