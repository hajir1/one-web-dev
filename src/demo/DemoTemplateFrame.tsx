import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useIconLookup } from "../pages/pageMaker/core/hooks/useElementOutput";
import type { DemoPreview } from "./demoTemplates";
import { isCodeTemplate } from "../pages/webTemplates/codeTemplates/catalog";

/* ================================================================== */
/* DEMO MODE template preview (v12): HTML is rendered in the browser and */
/* shown in a sandboxed iframe (srcdoc), replacing the static demo pages */
/* from the server. Used for card thumbnails and the detail preview.    */
/* ================================================================== */

interface Props {
  templateId: string;
  lang: string;
  /** Key of the page to show; null = home. */
  pageKey?: string | null;
  /** Thumbnail: home only, no interaction. */
  thumb?: boolean;
  title: string;
  className?: string;
  style?: React.CSSProperties;
  /** A link between pages inside the preview was clicked → key of the target page. */
  onNavigate?: (pageKey: string) => void;
  testId?: string;
}

export default function DemoTemplateFrame({ templateId, lang, pageKey = null, thumb = false, title, className, style, onNavigate, testId }: Props) {
  const icons = useIconLookup();
  const [preview, setPreview] = useState<DemoPreview | null>(null);
  const [failed, setFailed] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    let alive = true;
    setFailed(false);
    import("./demoTemplates")
      // Render after the next frame so the loading indicator has time to show.
      .then((m) => new Promise<void>((r) => requestAnimationFrame(() => r())).then(() => (alive ? m.demoPreview(templateId, lang, icons, thumb) : null)))
      .then((p) => {
        if (!alive) return;
        setPreview(p);
        setFailed(!p);
      })
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [templateId, lang, icons, thumb]);

  useEffect(() => {
    if (!onNavigate || !preview) return;
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data as { type?: unknown; file?: unknown } | null;
      if (!d || d.type !== "owd-demo-nav" || typeof d.file !== "string") return;
      const key = preview.fileToKey[d.file];
      if (key) onNavigate(key);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onNavigate, preview]);

  const keys = preview ? Object.keys(preview.html) : [];
  const html = preview ? (pageKey && preview.html[pageKey]) || preview.html[preview.fileToKey["index.html"]] || preview.html[keys[0]] : null;

  if (failed) return null;
  if (!html)
    return (
      <div className="flex h-full w-full items-center justify-center" role="status">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  return (
    <iframe
      ref={frame}
      key={`${templateId}:${pageKey ?? "home"}`}
      srcDoc={html}
      title={title}
      tabIndex={thumb ? -1 : undefined}
      // v16: Code Templates need outbound links (maps, WhatsApp) & downloads (.ics) in the detail preview.
      sandbox={!thumb && isCodeTemplate(templateId) ? "allow-scripts allow-popups allow-popups-to-escape-sandbox allow-downloads" : "allow-scripts"}
      referrerPolicy="no-referrer"
      data-testid={testId}
      className={className}
      style={style}
    />
  );
}
