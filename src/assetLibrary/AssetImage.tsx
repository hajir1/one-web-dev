import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { assetIdOf, MISSING_ASSET } from "./refs";
import { assetDataUrl, useAssets } from "./store";

/** <img> that understands `aset:<id>` (library) as well as plain URLs. */
export default function AssetImage({ src, ...rest }: Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & { src: string }) {
  const id = assetIdOf(src);
  const version = useAssets((s) => s.version);
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;
    let alive = true;
    void assetDataUrl(id).then((u) => alive && setUrl(u ?? MISSING_ASSET));
    return () => {
      alive = false;
    };
  }, [id, version]);
  const shown = id ? url : /^(https?:|data:image\/|\/|\.\/)/i.test(src.trim()) ? src.trim() : null;
  if (!shown) return <span aria-hidden className={`${rest.className ?? ""} block animate-pulse bg-gray-100 dark:bg-gray-800`} />;
  return <img alt="" loading="lazy" decoding="async" {...rest} src={shown} />;
}
