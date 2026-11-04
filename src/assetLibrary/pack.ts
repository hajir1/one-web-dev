import { assetFileName, findAssetIds, MISSING_ASSET, replaceAssetRefs } from "./refs";

/* ================================================================== */
/* On zip download / deploy: every `aset:<id>` in the output files is replaced */
/* with a real file path, and the image is included as a binary file.   */
/*                                                                    */
/*   HTML statis & template kode → assets/img/<nama>.<ext>, dirujuk      */
/*     relative to the file's folder (index.html → assets/img/…,         */
/*     assets/x.css → img/…).                                            */
/*   React/Vue/Svelte/Angular/Blade → public/assets/img/…, dirujuk        */
/*     /assets/img/… (the public/ folder is served as is).              */
/* ================================================================== */

export interface TextFile {
  name: string;
  content: string;
}

export interface BinaryFile {
  name: string;
  blob: Blob;
}

export interface AssetSource {
  meta: (id: string) => { name: string; mime: string } | null;
  blob: (id: string) => Promise<Blob | null>;
}

export type PackLayout = "static" | "public";

export const layoutFor = (framework: string): PackLayout => (framework === "html" ? "static" : "public");

/** Relative path from the folder of file `from` to `target` (both relative to the project root). */
export function relativePath(from: string, target: string): string {
  const dir = from.split("/").slice(0, -1);
  const t = target.split("/");
  let i = 0;
  while (i < dir.length && i < t.length - 1 && dir[i] === t[i]) i++;
  return [...dir.slice(i).map(() => ".."), ...t.slice(i)].join("/");
}

export async function packAssets<F extends TextFile>(files: F[], layout: PackLayout, src: AssetSource): Promise<{ files: F[]; binaries: BinaryFile[]; missing: string[] }> {
  const ids = findAssetIds(...files.map((f) => f.content));
  if (!ids.length) return { files, binaries: [], missing: [] };
  const paths = new Map<string, string>();
  const binaries: BinaryFile[] = [];
  const missing: string[] = [];
  const used = new Set<string>();
  for (const id of ids) {
    const [meta, blob] = [src.meta(id), await src.blob(id)];
    if (!blob) {
      missing.push(id);
      continue;
    }
    let file = assetFileName(meta?.name ?? "gambar", id, meta?.mime || blob.type || "image/webp");
    for (let n = 2; used.has(file); n++) file = file.replace(/(\.[a-z0-9]+)$/, `-${n}$1`);
    used.add(file);
    const rel = `assets/img/${file}`;
    paths.set(id, rel);
    binaries.push({ name: layout === "public" ? `public/${rel}` : rel, blob });
  }
  const out = files.map((f) => ({
    ...f,
    content: replaceAssetRefs(f.content, (id) => {
      const p = paths.get(id);
      if (!p) return MISSING_ASSET;
      return layout === "public" ? `/${p}` : relativePath(f.name, p);
    }),
  }));
  return { files: out, binaries, missing };
}

/** Binary → base64 (for the GitHub API). */
export async function blobToBase64(b: Blob): Promise<string> {
  const buf = new Uint8Array(await b.arrayBuffer());
  let s = "";
  for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
  return btoa(s);
}
