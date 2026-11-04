import { useEffect, useRef, useState } from "react";
import { PAGE_SHELL, type PageOutgoing, type PageRenderMessage } from "../helpers/pageShell";
import type { RectMap } from "../helpers/dropTarget";
import { LIBRARY_BY_ID, MOTION_PREVIEW, SCROLL_PREVIEW, usesMotion, usesScroll, type LibraryId } from "../engine/helpers/libraries";
import { useResolvedAssets } from "../../../assetLibrary/resolve";

const NO_LIBS: readonly LibraryId[] = [];

/** CDN URLs (+ the OWD Motion runtime as a data URL) + init code for the iframe. */
const libraryBundle = (ids: readonly LibraryId[]) => {
  const libs = ids.map((id) => LIBRARY_BY_ID[id]).filter(Boolean);
  const js = (list: typeof libs) => list.flatMap((l) => (l.js ? [l.js] : []));
  const motion = usesMotion(ids);
  const scroll = usesScroll(ids);
  return {
    css: [...(motion ? [MOTION_PREVIEW.css] : []), ...(scroll ? [SCROLL_PREVIEW.css] : []), ...libs.flatMap((l) => (l.css ? [l.css] : []))],
    js: [...(motion ? [MOTION_PREVIEW.js] : []), ...(scroll ? [SCROLL_PREVIEW.js] : []), ...js(libs)],
    init: [...new Set(libs.map((l) => l.init ?? "").filter(Boolean))].join("\n"),
    editJs: js(libs.filter((l) => l.editSafe)),
  };
};

interface PageFrameProps {
  css: string;
  body: string;
  script: string;
  edit: boolean;
  /** Iframe height (px). The parent follows the reported content height. */
  height: number | string;
  title: string;
  onPick?: (id: string | null, dbl: boolean) => void;
  onHover?: (id: string | null) => void;
  onRects?: (rects: RectMap, contentHeight: number) => void;
  /** Keyboard shortcuts pressed while focus is inside the iframe. */
  onKey?: (key: string, mod: boolean, shift: boolean) => void;
  /** Click on a link between pages in the preview (target design id). */
  onNavigate?: (designId: string) => void;
  /** Installed CDN libraries (in edit mode only the `editSafe` ones). */
  libraries?: readonly LibraryId[];
}

/** A sandboxed iframe holding the page; updated through postMessage (no reload). */
export default function PageFrame({ css: rawCss, body: rawBody, script: rawScript, edit, height, title, onPick, onHover, onRects, onKey, onNavigate, libraries = NO_LIBS }: PageFrameProps) {
  const ref = useRef<HTMLIFrameElement>(null);
  // v21: Asset Library images (`aset:<id>`) → data URLs for the sandboxed iframe.
  const [css, body, script] = useResolvedAssets([rawCss, rawBody, rawScript] as const);
  const [ready, setReady] = useState(0); // increments on every iframe (re)load → re-render
  const cb = useRef({ onPick, onHover, onRects, onKey, onNavigate });
  cb.current = { onPick, onHover, onRects, onKey, onNavigate };

  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow) return;
      const m = e.data as PageOutgoing;
      if (!m || typeof m !== "object") return;
      if (m.type === "pm:ready") setReady((n) => n + 1);
      else if (m.type === "pm:pick") cb.current.onPick?.(typeof m.id === "string" ? m.id : null, !!m.dbl);
      else if (m.type === "pm:hover") cb.current.onHover?.(typeof m.id === "string" ? m.id : null);
      else if (m.type === "pm:key") cb.current.onKey?.(m.key, !!m.mod, !!m.shift);
      else if (m.type === "pm:rects") cb.current.onRects?.(m.rects, m.height);
      else if (m.type === "pm:navigate" && typeof m.page === "string") cb.current.onNavigate?.(m.page);
    };
    window.addEventListener("message", on);
    return () => window.removeEventListener("message", on);
  }, []);

  useEffect(() => {
    if (ready === 0) return;
    const msg: PageRenderMessage = { type: "pm:render", css, body, script, edit, libs: libraryBundle(libraries) };
    ref.current?.contentWindow?.postMessage(msg, "*");
  }, [ready, css, body, script, edit, libraries]);

  return (
    <iframe
      ref={ref}
      title={title}
      srcDoc={PAGE_SHELL}
      sandbox="allow-scripts"
      className="block w-full border-0 bg-white"
      style={{ height }}
    />
  );
}
