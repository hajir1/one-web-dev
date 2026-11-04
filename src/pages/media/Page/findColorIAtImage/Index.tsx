import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { Check, Copy, Crosshair, ImagePlus, Pipette, RotateCcw, Trash2, ZoomIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import { CHECKERBOARD, Chip, Notice, Panel, Slider, btn } from "../../components/ui";
import { BROWSER_DECODABLE_IMAGES } from "../../lib/fileSniff";
import type { AcceptedFile, FileRules } from "../../lib/validate";
import { assertInputSize, decodeImage } from "../../converters/image";
import { colorFormats, contrastRatio, extractPalette, toHex, type PaletteColor, type RGBA } from "../../lib/color";
import { formatSize } from "../../lib/format";

const RULES: FileRules = { kinds: BROWSER_DECODABLE_IMAGES, maxBytes: 60 * 1024 * 1024, maxFiles: 1 };

/** Loupe: 9×9 pixels, the center pixel = the selected one. */
const LOUPE_CELLS = 9;
const LOUPE_CELL = 13;
const LOUPE_SIZE = LOUPE_CELLS * LOUPE_CELL;
const HISTORY_MAX = 16;

interface Loaded {
  name: string;
  size: number;
  width: number;
  height: number;
}

/** Copies text; execCommand fallback for non-HTTPS contexts / old browsers. */
async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* continue to the fallback */
  }
  try {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

export default function FindColors() {
  const { t } = useTranslation();
  const [img, setImg] = useState<Loaded | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [hover, setHover] = useState<RGBA | null>(null);
  const [locked, setLocked] = useState<RGBA | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const [loupe, setLoupe] = useState<{ left: number; top: number } | null>(null);
  const [history, setHistory] = useState<RGBA[]>([]);
  const [palette, setPalette] = useState<PaletteColor[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  // The full canvas (original resolution) is created ONCE per image, not on every render.
  const fullRef = useRef<HTMLCanvasElement | null>(null);
  const viewRef = useRef<HTMLCanvasElement>(null);
  const loupeRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const loadToken = useRef(0);

  const shown = locked ?? hover;

  // Free canvas memory when leaving the page.
  useEffect(
    () => () => {
      if (fullRef.current) fullRef.current.width = fullRef.current.height = 0;
    },
    [],
  );

  const load = useCallback(async ([f]: AcceptedFile[]) => {
    const token = ++loadToken.current;
    setError(null);
    setLoading(true);
    try {
      const dec = await decodeImage(f.file);
      try {
        assertInputSize(dec.width, dec.height);
        const full = fullRef.current ?? document.createElement("canvas");
        full.width = dec.width;
        full.height = dec.height;
        const ctx = full.getContext("2d", { willReadFrequently: true });
        if (!ctx) throw new Error(t("media.findColors.tooLarge"));
        ctx.clearRect(0, 0, dec.width, dec.height);
        ctx.drawImage(dec.source, 0, 0);
        if (token !== loadToken.current) return; // a newer image exists
        fullRef.current = full;
        // Palette from a small copy (fast for large images).
        const s = Math.min(1, 220 / Math.max(dec.width, dec.height));
        const small = document.createElement("canvas");
        small.width = Math.max(1, Math.round(dec.width * s));
        small.height = Math.max(1, Math.round(dec.height * s));
        const sctx = small.getContext("2d")!;
        sctx.drawImage(dec.source, 0, 0, small.width, small.height);
        setPalette(extractPalette(sctx.getImageData(0, 0, small.width, small.height).data, 8));
        setImg({ name: f.file.name, size: f.file.size, width: dec.width, height: dec.height });
        setHover(null);
        setLocked(null);
        setCursor(null);
        setZoom(100);
      } finally {
        dec.close();
      }
    } catch (e) {
      if (token === loadToken.current) setError(e instanceof Error ? e.message : t("media.findColors.openFailed"));
    } finally {
      if (token === loadToken.current) setLoading(false);
    }
  }, [t]);
  const intake = useFileIntake(RULES, load);

  // Redraw the view when the image / zoom changes.
  const fitWidth = useRef(0);
  const draw = useCallback(() => {
    const full = fullRef.current;
    const view = viewRef.current;
    const stage = stageRef.current;
    if (!full || !view || !stage || !img) return;
    fitWidth.current = stage.clientWidth;
    const fit = Math.min(1, (stage.clientWidth - 2) / img.width, 560 / img.height);
    const scale = fit * (zoom / 100);
    const w = Math.max(1, Math.round(img.width * scale));
    const h = Math.max(1, Math.round(img.height * scale));
    view.width = w;
    view.height = h;
    const ctx = view.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = scale < 1;
    ctx.drawImage(full, 0, 0, w, h);
  }, [img, zoom]);

  useEffect(() => {
    draw();
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => stage.clientWidth !== fitWidth.current && draw());
    ro.observe(stage);
    return () => ro.disconnect();
  }, [draw]);

  /** Reads the color at (x,y) and draws the loupe. */
  const sample = useCallback(
    (x: number, y: number): RGBA | null => {
      const full = fullRef.current;
      if (!full || !img) return null;
      const ctx = full.getContext("2d", { willReadFrequently: true });
      if (!ctx) return null;
      const half = (LOUPE_CELLS - 1) / 2;
      const data = ctx.getImageData(x - half, y - half, LOUPE_CELLS, LOUPE_CELLS).data; // outside the image = transparent
      const lc = loupeRef.current?.getContext("2d");
      if (lc) {
        lc.clearRect(0, 0, LOUPE_SIZE, LOUPE_SIZE);
        for (let j = 0; j < LOUPE_CELLS; j++)
          for (let i = 0; i < LOUPE_CELLS; i++) {
            const o = (j * LOUPE_CELLS + i) * 4;
            lc.fillStyle = `rgba(${data[o]},${data[o + 1]},${data[o + 2]},${data[o + 3] / 255})`;
            lc.fillRect(i * LOUPE_CELL, j * LOUPE_CELL, LOUPE_CELL, LOUPE_CELL);
          }
        lc.strokeStyle = "rgba(255,255,255,.35)";
        lc.lineWidth = 1;
        for (let k = 1; k < LOUPE_CELLS; k++) {
          lc.beginPath();
          lc.moveTo(k * LOUPE_CELL + 0.5, 0);
          lc.lineTo(k * LOUPE_CELL + 0.5, LOUPE_SIZE);
          lc.moveTo(0, k * LOUPE_CELL + 0.5);
          lc.lineTo(LOUPE_SIZE, k * LOUPE_CELL + 0.5);
          lc.stroke();
        }
        lc.strokeStyle = "#ef4444";
        lc.lineWidth = 2;
        lc.strokeRect(half * LOUPE_CELL + 1, half * LOUPE_CELL + 1, LOUPE_CELL - 2, LOUPE_CELL - 2);
      }
      const c = ((half * LOUPE_CELLS + half) * 4) | 0;
      return { r: data[c], g: data[c + 1], b: data[c + 2], a: data[c + 3] };
    },
    [img],
  );

  const pointAt = (e: PointerEvent<HTMLCanvasElement>) => {
    const view = viewRef.current!;
    const r = view.getBoundingClientRect();
    if (!img || !r.width || !r.height) return null;
    const x = Math.min(img.width - 1, Math.max(0, Math.floor(((e.clientX - r.left) / r.width) * img.width)));
    const y = Math.min(img.height - 1, Math.max(0, Math.floor(((e.clientY - r.top) / r.height) * img.height)));
    return { x, y, cx: e.clientX - r.left, cy: e.clientY - r.top, r };
  };

  const placeLoupe = (cx: number, cy: number, w: number, touch: boolean) => {
    const pad = 18;
    let left = cx + pad;
    let top = touch ? cy - LOUPE_SIZE - 40 : cy + pad;
    if (left + LOUPE_SIZE + 12 > w) left = cx - LOUPE_SIZE - pad - 12;
    if (top < 0) top = cy + pad;
    setLoupe({ left: Math.max(0, left), top });
  };

  const onMove = (e: PointerEvent<HTMLCanvasElement>) => {
    const p = pointAt(e);
    if (!p) return;
    const c = sample(p.x, p.y);
    if (c) setHover(c);
    setCursor({ x: p.x, y: p.y });
    placeLoupe(p.cx, p.cy, p.r.width, e.pointerType === "touch");
  };

  const lock = (c: RGBA | null) => {
    if (!c) return;
    setLocked(c);
    setHistory((h) => [c, ...h.filter((x) => toHex(x, true) !== toHex(c, true))].slice(0, HISTORY_MAX));
  };

  const onKey = (e: KeyboardEvent<HTMLCanvasElement>) => {
    if (!img) return;
    const step = e.shiftKey ? 10 : 1;
    const cur = cursor ?? { x: Math.floor(img.width / 2), y: Math.floor(img.height / 2) };
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[e.key]) {
      e.preventDefault();
      const x = Math.min(img.width - 1, Math.max(0, cur.x + moves[e.key][0]));
      const y = Math.min(img.height - 1, Math.max(0, cur.y + moves[e.key][1]));
      setCursor({ x, y });
      const c = sample(x, y);
      if (c) setHover(c);
      const r = viewRef.current!.getBoundingClientRect();
      placeLoupe(((x + 0.5) / img.width) * r.width, ((y + 0.5) / img.height) * r.height, r.width, false);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      lock(hover);
    } else if (e.key === "Escape") {
      setLocked(null);
    }
  };

  const doCopy = async (text: string, key: string) => {
    const ok = await copyText(text);
    setCopied(ok ? key : `fail:${key}`);
    setTimeout(() => setCopied((c) => (c === key || c === `fail:${key}` ? null : c)), 1400);
  };

  const formats = shown ? colorFormats(shown) : [];
  const onWhite = shown ? contrastRatio(shown, { r: 255, g: 255, b: 255 }) : 0;
  const onBlack = shown ? contrastRatio(shown, { r: 0, g: 0, b: 0 }) : 0;

  return (
    <MediaShell
      tool="find-colors"
      icon={Pipette}
      accent="violet"
      actions={
        img && (
          <label className={`${btn.secondary} cursor-pointer`}>
            <ImagePlus className="h-4 w-4" /> {t("media.findColors.changeImage")}
            <input type="file" accept="image/*,.svg,.ico" className="hidden" data-testid="replace-input" onChange={(e) => {
              const f = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (f.length) intake.handleFiles(f);
            }} />
          </label>
        )
      }
    >
      {intake.rejectionText && (
        <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
          {intake.rejectionText}
        </Notice>
      )}
      {error && (
        <Notice tone="error" onDismiss={() => setError(null)}>
          {error}
        </Notice>
      )}

      {!img ? (
        <Dropzone rules={RULES} accept="image/*,.svg,.ico" multiple={false} onFiles={intake.handleFiles} busy={intake.checking || loading} allowPaste title={t("media.findColors.dropTitle")} />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* --------------------------- panggung --------------------------- */}
          <Panel
            title={
              <span className="flex flex-wrap items-center gap-2">
                <span className="truncate">{img.name}</span>
                <Chip>
                  {img.width}×{img.height}
                </Chip>
                <Chip>{formatSize(img.size)}</Chip>
              </span>
            }
            description={t("media.findColors.stageHelp")}
            bodyClassName="p-3 sm:p-4"
          >
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="w-full max-w-xs">
                <Slider label="Zoom" value={zoom} min={25} max={800} step={25} onChange={setZoom} format={(v) => `${v}%`} />
              </div>
              {cursor && (
                <Chip tone="blue">
                  <Crosshair className="h-3 w-3" /> x {cursor.x}, y {cursor.y}
                </Chip>
              )}
            </div>
            <div ref={stageRef} className="relative max-h-[70vh] overflow-auto rounded-xl ring-1 ring-gray-200 dark:ring-gray-700" style={CHECKERBOARD} data-testid="stage">
              <canvas
                ref={viewRef}
                tabIndex={0}
                aria-label={t("media.findColors.canvasLabel")}
                data-testid="color-canvas"
                onPointerMove={onMove}
                onPointerDown={(e) => {
                  if (e.pointerType === "touch") {
                    try {
                      (e.target as HTMLElement).setPointerCapture(e.pointerId);
                    } catch {
                      /* the pointer is no longer active */
                    }
                  }
                  onMove(e);
                }}
                onPointerUp={(e) => {
                  const p = pointAt(e);
                  if (p) lock(sample(p.x, p.y));
                  if (e.pointerType === "touch") setLoupe(null);
                }}
                onPointerLeave={(e) => e.pointerType !== "touch" && setLoupe(null)}
                onKeyDown={onKey}
                onBlur={() => setLoupe(null)}
                className="block cursor-crosshair touch-none focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                style={{ imageRendering: zoom > 100 ? "pixelated" : "auto" }}
              />
              {/* The loupe is always in the DOM so the first movement is read immediately (old bug: the first color was lost). */}
              <div
                aria-hidden
                className={`pointer-events-none absolute z-10 rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-gray-200 transition-opacity dark:bg-gray-900 dark:ring-gray-700 ${loupe ? "opacity-100" : "opacity-0"}`}
                style={{ left: loupe?.left ?? 0, top: loupe?.top ?? 0 }}
              >
                <canvas ref={loupeRef} width={LOUPE_SIZE} height={LOUPE_SIZE} className="block rounded-xl" style={CHECKERBOARD} />
                {hover && <p className="mt-1 text-center font-mono text-[11px] text-gray-700 dark:text-gray-200">{toHex(hover, true)}</p>}
              </div>
            </div>
          </Panel>

          {/* --------------------------- inspektur --------------------------- */}
          <div className="flex flex-col gap-4">
            <Panel
              title={locked ? t("media.findColors.locked") : t("media.findColors.preview")}
              actions={
                locked && (
                  <button type="button" onClick={() => setLocked(null)} className={btn.ghost}>
                    <RotateCcw className="h-3.5 w-3.5" /> {t("media.findColors.unlock")}
                  </button>
                )
              }
            >
              <div className="relative h-24 overflow-hidden rounded-xl ring-1 ring-gray-200 dark:ring-gray-700" style={CHECKERBOARD} data-testid="swatch">
                {shown && <div className="absolute inset-0" style={{ background: `rgba(${shown.r},${shown.g},${shown.b},${shown.a / 255})` }} />}
                {shown && (
                  <div className="absolute bottom-2 left-2 flex gap-1">
                    <span className="rounded-md bg-white px-1.5 py-0.5 text-[11px] font-semibold text-gray-800 shadow">
                      {t("media.findColors.vsWhite", { ratio: onWhite.toFixed(1) })} {onWhite >= 4.5 ? "AA" : onWhite >= 3 ? t("media.findColors.aaLarge") : "✕"}
                    </span>
                    <span className="rounded-md bg-gray-900 px-1.5 py-0.5 text-[11px] font-semibold text-white shadow">
                      {t("media.findColors.vsBlack", { ratio: onBlack.toFixed(1) })} {onBlack >= 4.5 ? "AA" : onBlack >= 3 ? t("media.findColors.aaLarge") : "✕"}
                    </span>
                  </div>
                )}
              </div>
              {!shown ? (
                <p className="py-6 text-center text-sm text-gray-500 dark:text-gray-400">{t("media.findColors.hoverHint")}</p>
              ) : (
                <ul className="mt-3 flex flex-col gap-1.5" data-testid="color-values">
                  {formats.map((f) => (
                    <li key={f.label} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{f.label}</p>
                        <p className="truncate font-mono text-sm text-gray-800 dark:text-white/90">{f.value}</p>
                      </div>
                      <button type="button" onClick={() => doCopy(f.value, f.label)} className={btn.icon} aria-label={t("media.findColors.copyFormat", { format: f.label })}>
                        {copied === f.label ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {copied?.startsWith("fail:") && <p className="mt-2 text-xs text-rose-600">{t("media.findColors.clipboardDenied")}</p>}
            </Panel>

            <Panel
              title={t("media.findColors.collection", { count: history.length })}
              description={t("media.findColors.collectionDescription")}
              actions={
                history.length > 0 && (
                  <>
                    <button
                      type="button"
                      className={btn.ghost}
                      onClick={() => doCopy(`:root {\n${history.map((c, i) => `  --color-${i + 1}: ${toHex(c, true)};`).join("\n")}\n}`, "css")}
                    >
                      {copied === "css" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} CSS
                    </button>
                    <button type="button" className={btn.icon} aria-label={t("media.findColors.clearCollection")} onClick={() => setHistory([])}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )
              }
            >
              {history.length ? (
                <div className="grid grid-cols-8 gap-1.5" data-testid="history">
                  {history.map((c) => (
                    <button
                      key={toHex(c, true)}
                      type="button"
                      title={toHex(c, true)}
                      aria-label={t("media.findColors.pick", { color: toHex(c, true) })}
                      onClick={() => setLocked(c)}
                      className="aspect-square rounded-lg ring-1 ring-black/10 transition hover:scale-110"
                      style={{ background: `rgba(${c.r},${c.g},${c.b},${c.a / 255})` }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("media.findColors.collectionEmpty")}</p>
              )}
            </Panel>

            <Panel title={t("media.findColors.palette")} description={t("media.findColors.paletteDescription")}>
              <ul className="flex flex-col gap-1.5" data-testid="palette">
                {palette.map((c) => (
                  <li key={toHex(c)}>
                    <button type="button" onClick={() => setLocked(c)} className="flex w-full items-center gap-2.5 rounded-lg px-1.5 py-1 text-left hover:bg-gray-50 dark:hover:bg-white/5">
                      <span className="h-7 w-7 shrink-0 rounded-md ring-1 ring-black/10" style={{ background: toHex(c) }} />
                      <span className="w-20 font-mono text-xs text-gray-700 dark:text-gray-200">{toHex(c)}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100 dark:bg-white/10">
                        <span className="block h-full rounded-full" style={{ width: `${Math.max(3, c.share * 100)}%`, background: toHex(c) }} />
                      </span>
                      <span className="w-10 text-right text-[11px] text-gray-500">{Math.round(c.share * 100)}%</span>
                    </button>
                  </li>
                ))}
                {!palette.length && <li className="text-xs text-gray-500">{t("media.findColors.fullyTransparent")}</li>}
              </ul>
            </Panel>
            <p className="flex items-center gap-1.5 px-1 text-[11px] text-gray-400">
              <ZoomIn className="h-3 w-3" /> {t("media.findColors.cmykNote")}
            </p>
          </div>
        </div>
      )}
    </MediaShell>
  );
}
