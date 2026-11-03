import { useEffect, useState } from "react";
import { assetBlob, assetDataUrl, assetMeta, useAssets } from "./store";
import { ASSET_SCHEME, findAssetIds, MISSING_ASSET, replaceAssetRefs } from "./refs";
import { layoutFor, packAssets, type AssetSource, type TextFile } from "./pack";

/** Sumber aset untuk pack (pustaka aktif). */
export const assetSource: AssetSource = {
  meta: (id) => assetMeta(id),
  blob: (id) => assetBlob(id),
};

/** Teks dengan `aset:<id>` → data URL (pratinjau). Aset hilang → kotak abu-abu. */
export async function resolveForPreview(text: string): Promise<string> {
  const ids = findAssetIds(text);
  if (!ids.length) return text;
  const urls = new Map<string, string>();
  await Promise.all(ids.map(async (id) => urls.set(id, (await assetDataUrl(id)) ?? MISSING_ASSET)));
  return replaceAssetRefs(text, (id) => urls.get(id));
}

/**
 * Hook: daftar teks dengan rujukan aset diterjemahkan untuk pratinjau.
 * Tanpa rujukan → dikembalikan langsung (tanpa jeda satu render).
 */
export function useResolvedAssets<T extends readonly string[]>(texts: T): T {
  const has = texts.some((t) => t && t.includes(ASSET_SCHEME));
  const version = useAssets((s) => s.version);
  const [out, setOut] = useState<{ key: readonly string[]; val: T } | null>(null);
  const key = texts.join("\u0000");
  useEffect(() => {
    if (!has) return;
    let alive = true;
    void Promise.all(texts.map((t) => resolveForPreview(t))).then((val) => alive && setOut({ key: texts, val: val as unknown as T }));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` mewakili isi `texts`
  }, [key, has, version]);
  if (!has) return texts;
  // Selagi data URL disiapkan: pakai hasil sebelumnya bila ada (hindari kedip), selain itu teks tanpa gambar.
  if (out) return out.val;
  return texts.map((t) => replaceAssetRefs(t, () => MISSING_ASSET)) as unknown as T;
}

/** Berkas ekspor + gambar aset → siap di-zip / di-deploy. */
export const packForFramework = <F extends TextFile>(files: F[], framework: string) => packAssets(files, layoutFor(framework), assetSource);
