import { useEffect, useState, type CSSProperties } from "react";
import { Loader2 } from "lucide-react";
import { loadCodeTemplate } from "./catalog";

/** v21: pratinjau Template Kode di mode fullstack (HTML dari bundel frontend, iframe sandbox). */
export default function CodeTemplateFrame({ templateId, title, className, style, testId }: { templateId: string; title: string; className?: string; style?: CSSProperties; testId?: string }) {
  const [html, setHtml] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    let alive = true;
    setHtml(null);
    setFailed(false);
    loadCodeTemplate(templateId).then(
      (h) => alive && setHtml(h),
      () => alive && setFailed(true),
    );
    return () => {
      alive = false;
    };
  }, [templateId]);
  if (failed) return <p className="m-auto text-sm text-gray-500">—</p>;
  if (!html) return <Loader2 className="m-auto h-6 w-6 animate-spin text-gray-400" />;
  return <iframe srcDoc={html} title={title} sandbox="allow-scripts allow-popups" referrerPolicy="no-referrer" data-testid={testId} className={className} style={style} />;
}
