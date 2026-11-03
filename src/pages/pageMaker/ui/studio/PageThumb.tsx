import { memo, useLayoutEffect, useRef, useState } from "react";
import { useResolvedAssets } from "../../../../assetLibrary/resolve";

/* Gambar kecil halaman: HTML+CSS statis di iframe tanpa skrip, diperkecil. */
const BASE_W = 1280;

function PageThumb({ css: rawCss, body: rawBody, title }: { css: string; body: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [css, body] = useResolvedAssets([rawCss, rawBody] as const);
  const [scale, setScale] = useState(0.2);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const m = () => setScale(el.clientWidth / BASE_W);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;overflow:hidden;pointer-events:none}${css}</style></head><body>${body}</body></html>`;
  return (
    <div ref={box} className="relative aspect-[4/3] w-full overflow-hidden bg-white" aria-hidden>
      <iframe
        title={title}
        srcDoc={doc}
        sandbox=""
        tabIndex={-1}
        loading="lazy"
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
        style={{ width: BASE_W, height: BASE_W * 0.75, transform: `scale(${scale})` }}
      />
    </div>
  );
}

export default memo(PageThumb);
