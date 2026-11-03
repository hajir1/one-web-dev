import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Download, Stamp } from "lucide-react";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import { ColorField, Field, INPUT, Notice, Panel, Segmented, Slider, btn } from "../../components/ui";
import { notify } from "../../../../components/app/Toaster";
import type { FileRules } from "../../lib/validate";
import { decodeImage, encodeCanvas, type DecodedImage } from "../../converters/image";
import { downloadAsZip } from "../../lib/download";
import { ICON_SPECS, ICO_SIZES, buildIco, faviconHtml, webManifest, type IconSpec } from "../../lib/webIcons";

/* ================================================================== */
/* Favicon Generator (v10): dari gambar/logo atau teks/emoji →          */
/* favicon.ico + PNG semua ukuran + apple-touch-icon + manifest + HTML.  */
/* 100% di browser.                                                      */
/* ================================================================== */

const RULES: FileRules = { kinds: ["png", "jpeg", "webp", "svg", "gif", "avif", "bmp"], maxBytes: 20 * 1024 * 1024, maxFiles: 1 };
type Shape = "square" | "rounded" | "circle";

interface Opts {
  source: "image" | "text";
  text: string;
  textColor: string;
  bg: string;
  shape: Shape;
  /** Jarak tepi dalam persen sisi (0–30). */
  padding: number;
  transparent: boolean;
}

function shapePath(ctx: CanvasRenderingContext2D, s: number, shape: Shape) {
  ctx.beginPath();
  if (shape === "circle") ctx.arc(s / 2, s / 2, s / 2, 0, Math.PI * 2);
  else if (shape === "rounded") ctx.roundRect(0, 0, s, s, s * 0.22);
  else ctx.rect(0, 0, s, s);
}

/** Gambar satu ikon ukuran `spec.size`. */
function drawIcon(spec: Pick<IconSpec, "size" | "opaque" | "maskable">, o: Opts, img: DecodedImage | null): HTMLCanvasElement {
  const s = spec.size;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  ctx.imageSmoothingQuality = "high";
  const fill = spec.opaque || !o.transparent || o.source === "text";
  if (fill) {
    ctx.fillStyle = o.bg;
    // Ikon opaque/maskable selalu kotak penuh (OS yang memotong bentuknya).
    if (spec.opaque) ctx.fillRect(0, 0, s, s);
    else {
      shapePath(ctx, s, o.shape);
      ctx.fill();
    }
  }
  // Maskable: isi di dalam lingkaran aman 80%.
  const pad = s * (spec.maskable ? Math.max(o.padding / 100, 0.1) + 0.1 : o.padding / 100);
  const box = s - pad * 2;
  if (o.source === "text") {
    const txt = o.text.trim() || "A";
    ctx.fillStyle = o.textColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let size = box * (Array.from(txt).length > 1 ? 0.62 : 0.82);
    ctx.font = `700 ${size}px system-ui, -apple-system, "Segoe UI", Roboto, "Noto Color Emoji", sans-serif`;
    const w = ctx.measureText(txt).width;
    if (w > box) {
      size *= box / w;
      ctx.font = `700 ${size}px system-ui, -apple-system, "Segoe UI", Roboto, "Noto Color Emoji", sans-serif`;
    }
    ctx.fillText(txt, s / 2, s / 2 + size * 0.04);
  } else if (img) {
    const k = Math.min(box / img.width, box / img.height);
    const w = img.width * k;
    const h = img.height * k;
    ctx.drawImage(img.source, (s - w) / 2, (s - h) / 2, w, h);
  }
  return c;
}

const toBytes = async (c: HTMLCanvasElement) => new Uint8Array(await (await encodeCanvas(c, "image/png")).arrayBuffer());

export default function FaviconGenerator() {
  const { t } = useTranslation();
  const [o, setO] = useState<Opts>({ source: "text", text: "1", textColor: "#ffffff", bg: "#3b68f0", shape: "rounded", padding: 8, transparent: true });
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<DecodedImage | null>(null);
  const [siteName, setSiteName] = useState("");
  const [theme, setTheme] = useState("#3b68f0");
  const [busy, setBusy] = useState(false);
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((x) => ({ ...x, [k]: v }));

  const intake = useFileIntake(RULES, (acc) => setFile(acc[0]?.file ?? null));
  useEffect(() => {
    let alive = true;
    if (!file) return setImg(null);
    decodeImage(file)
      .then((d) => (alive ? setImg(d) : d.close()))
      .catch((e) => notify.error(String((e as Error)?.message ?? e)));
    return () => {
      alive = false;
    };
  }, [file]);

  const ready = o.source === "text" || !!img;
  const previews = useMemo(
    () => (ready ? [16, 32, 48, 180, 192].map((size) => ({ size, url: drawIcon({ size, opaque: size === 180 }, o, img).toDataURL("image/png") })) : []),
    [o, img, ready],
  );
  const isSvg = o.source === "image" && file?.type === "image/svg+xml";
  const html = faviconHtml(theme, isSvg);

  const download = async () => {
    setBusy(true);
    try {
      const entries: { name: string; blob: Blob }[] = [];
      const pngs = new Map<number, Uint8Array>();
      for (const spec of ICON_SPECS) {
        const bytes = await toBytes(drawIcon(spec, o, img));
        if (!spec.opaque) pngs.set(spec.size, bytes);
        entries.push({ name: spec.name, blob: new Blob([bytes as BlobPart], { type: "image/png" }) });
      }
      const ico = buildIco(ICO_SIZES.map((size) => ({ size, bytes: pngs.get(size)! })));
      entries.push({ name: "favicon.ico", blob: new Blob([ico as BlobPart], { type: "image/x-icon" }) });
      if (isSvg && file) entries.push({ name: "favicon.svg", blob: file });
      entries.push({ name: "site.webmanifest", blob: new Blob([webManifest({ name: siteName, themeColor: theme, backgroundColor: o.bg })], { type: "application/manifest+json" }) });
      entries.push({ name: "head-snippet.html", blob: new Blob([html + "\n"], { type: "text/html" }) });
      await downloadAsZip(entries, "favicon.zip");
      notify.success(t("media.favicon.done"));
    } catch (e) {
      notify.error(String((e as Error)?.message ?? e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <MediaShell tool="favicon-generator" icon={Stamp} accent="indigo">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Panel title={t("media.favicon.source")} className="min-w-0">
          <div className="flex flex-col gap-4">
            <Segmented
              label={t("media.favicon.source")}
              value={o.source}
              onChange={(v) => set("source", v)}
              options={[
                { value: "text", label: t("media.favicon.fromText") },
                { value: "image", label: t("media.favicon.fromImage") },
              ]}
            />
            {o.source === "image" ? (
              <>
                <Dropzone rules={RULES} multiple={false} accept="image/*,.svg" onFiles={intake.handleFiles} busy={intake.checking} compact={!!file} allowPaste title={t("media.favicon.drop")} testId="favicon-drop" />
                {intake.rejectionText && <Notice tone="error">{intake.rejectionText}</Notice>}
                <Segmented
                  label={t("media.favicon.background")}
                  value={o.transparent ? "none" : "fill"}
                  onChange={(v) => set("transparent", v === "none")}
                  options={[
                    { value: "none", label: t("media.favicon.transparent") },
                    { value: "fill", label: t("media.favicon.filled") },
                  ]}
                />
              </>
            ) : (
              <Field label={t("media.favicon.text")} hint={t("media.favicon.textHint")}>
                <input value={o.text} maxLength={4} onChange={(e) => set("text", e.target.value)} className={INPUT} data-testid="favicon-text" />
              </Field>
            )}
            <div className="grid gap-3 sm:grid-cols-2">
              <ColorField label={t("media.favicon.bg")} value={o.bg} onChange={(v) => set("bg", v)} />
              {o.source === "text" && <ColorField label={t("media.favicon.textColor")} value={o.textColor} onChange={(v) => set("textColor", v)} />}
            </div>
            <Segmented
              label={t("media.favicon.shape")}
              value={o.shape}
              onChange={(v) => set("shape", v)}
              options={(["square", "rounded", "circle"] as const).map((v) => ({ value: v, label: t(`media.favicon.shapes.${v}`) }))}
            />
            <Slider label={t("media.favicon.padding")} value={o.padding} min={0} max={30} step={1} onChange={(v) => set("padding", v)} format={(v) => `${v}%`} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label={t("media.favicon.siteName")}>
                <input value={siteName} maxLength={60} onChange={(e) => setSiteName(e.target.value)} placeholder={t("media.favicon.siteNamePlaceholder")} className={INPUT} />
              </Field>
              <ColorField label={t("media.favicon.theme")} value={theme} onChange={setTheme} />
            </div>
          </div>
        </Panel>

        <div className="flex min-w-0 flex-col gap-5">
          <Panel title={t("media.favicon.preview")}>
            {ready ? (
              <div className="flex flex-wrap items-end gap-5" data-testid="favicon-preview">
                {previews.map((p) => (
                  <figure key={p.size} className="flex flex-col items-center gap-1">
                    <img src={p.url} width={Math.min(p.size, 96)} height={Math.min(p.size, 96)} alt="" className="rounded [image-rendering:auto]" style={{ width: Math.min(p.size, 96), height: Math.min(p.size, 96) }} />
                    <figcaption className="text-[11px] text-gray-400">{p.size}px</figcaption>
                  </figure>
                ))}
                {/* Simulasi tab browser */}
                <div className="flex items-center gap-2 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300">
                  <img src={previews[0].url} width={16} height={16} alt="" />
                  <span className="max-w-32 truncate">{siteName || t("media.favicon.siteNamePlaceholder")}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">{t("media.favicon.needImage")}</p>
            )}
          </Panel>
          <Panel title={t("media.favicon.htmlTitle")} description={t("media.favicon.htmlHint")}>
            <pre className="overflow-x-auto rounded-lg bg-gray-950 p-3 text-[11px] leading-relaxed text-gray-100" data-testid="favicon-html">
              {html}
            </pre>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" className={btn.primary} disabled={!ready || busy} onClick={download} data-testid="favicon-download">
                <Download className="h-4 w-4" /> {busy ? t("media.favicon.working") : t("media.favicon.download")}
              </button>
              <button
                type="button"
                className={btn.secondary}
                onClick={() => navigator.clipboard?.writeText(html).then(() => notify.success(t("media.favicon.copied")), () => notify.error(t("errors.unknown")))}
              >
                <Copy className="h-4 w-4" /> {t("media.favicon.copy")}
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </MediaShell>
  );
}
