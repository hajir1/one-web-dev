import { useLayoutEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import PageFrame from "./PageFrame";
import type { LibraryId } from "../engine/helpers/libraries";

/** Pratinjau halaman apa adanya (tanpa overlay builder): tampilan yang sama dengan kode hasil. */
export default function PagePreview({
  css,
  body,
  script,
  viewportWidth,
  onNavigate,
  libraries,
}: {
  css: string;
  body: string;
  script: string;
  viewportWidth: number | null;
  onNavigate?: (designId: string) => void;
  /** Library CDN terpasang (AOS, Animate.css, …). */
  libraries?: readonly LibraryId[];
}) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [stageH, setStageH] = useState(0);
  const [contentH, setContentH] = useState(0);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const m = () => setStageH(el.clientHeight);
    m();
    const ro = new ResizeObserver(m);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={scrollRef} className="h-full overflow-auto bg-gray-200 dark:bg-gray-950" data-testid="preview-scroll">
      <div
        className={`mx-auto bg-white ${viewportWidth ? "my-4 shadow-xl ring-1 ring-gray-300 dark:ring-gray-700" : ""}`}
        style={{ width: viewportWidth ?? "100%", maxWidth: "100%" }}
      >
        <PageFrame
          title={t("pm.preview.frameTitle")}
          css={css}
          body={body}
          script={script}
          edit={false}
          height={Math.max(contentH, stageH - (viewportWidth ? 32 : 0))}
          onRects={(_r, h) => setContentH(h)}
          onNavigate={onNavigate}
          libraries={libraries}
        />
      </div>
    </div>
  );
}
