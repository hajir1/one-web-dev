import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Download, Share2 } from "lucide-react";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import { ColorField, Field, INPUT, Notice, Panel, Segmented, btn } from "../../components/ui";
import { notify } from "../../../../components/app/Toaster";
import type { FileRules } from "../../lib/validate";
import { decodeImage, encodeCanvas, type DecodedImage } from "../../converters/image";
import { downloadBlob } from "../../lib/download";
import { OG_SIZE, ogMetaHtml, readableOn, wrapText } from "../../lib/webIcons";

/* ================================================================== */
/* OG Image Maker (v10): 1200×630 share images for WhatsApp,            */
/* Facebook, X, LinkedIn. Title, subtitle, domain, logo, background.     */
/* ================================================================== */

const RULES: FileRules = { kinds: ["png", "jpeg", "webp", "svg", "gif", "avif"], maxBytes: 20 * 1024 * 1024, maxFiles: 1 };
const FONT = `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`;

interface Opts {
  title: string;
  subtitle: string;
  domain: string;
  bg1: string;
  bg2: string;
  style: "solid" | "gradient";
  align: "left" | "center";
}

function draw(c: HTMLCanvasElement, o: Opts, logo: DecodedImage | null) {
  const { width: W, height: H } = OG_SIZE;
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  if (o.style === "gradient") {
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, o.bg1);
    g.addColorStop(1, o.bg2);
    ctx.fillStyle = g;
  } else ctx.fillStyle = o.bg1;
  ctx.fillRect(0, 0, W, H);
  const fg = readableOn(o.bg1);
  const pad = 80;
  const maxW = W - pad * 2;
  const center = o.align === "center";
  const x = center ? W / 2 : pad;
  ctx.textAlign = center ? "center" : "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = fg;

  let y = pad;
  if (logo) {
    const h = 72;
    const w = Math.min((logo.width / logo.height) * h, 320);
    ctx.drawImage(logo.source, center ? (W - w) / 2 : pad, y, w, h);
  }
  // Title: max 3 lines; the size shrinks when long.
  const titleText = o.title.trim() || " ";
  let size = 76;
  let lines: string[] = [];
  for (; size >= 44; size -= 4) {
    ctx.font = `800 ${size}px ${FONT}`;
    lines = wrapText(titleText, maxW, (s) => ctx.measureText(s).width, 3);
    if (lines.length <= 2 || size <= 52) break;
  }
  const subSize = 34;
  ctx.font = `400 ${subSize}px ${FONT}`;
  const subLines = o.subtitle.trim() ? wrapText(o.subtitle, maxW, (s) => ctx.measureText(s).width, 2) : [];
  const blockH = lines.length * size * 1.12 + (subLines.length ? 24 + subLines.length * subSize * 1.3 : 0);
  // Text vertically centered (below the logo when present).
  const top = logo ? pad + 72 + 40 : pad;
  y = Math.max(top, (H - blockH) / 2) + size;
  ctx.font = `800 ${size}px ${FONT}`;
  for (const l of lines) {
    ctx.fillText(l, x, y);
    y += size * 1.12;
  }
  if (subLines.length) {
    y += 24 - size * 0.12;
    ctx.globalAlpha = 0.85;
    ctx.font = `400 ${subSize}px ${FONT}`;
    for (const l of subLines) {
      ctx.fillText(l, x, y);
      y += subSize * 1.3;
    }
    ctx.globalAlpha = 1;
  }
  if (o.domain.trim()) {
    ctx.font = `600 28px ${FONT}`;
    ctx.globalAlpha = 0.8;
    ctx.fillText(o.domain.trim().slice(0, 60), x, H - 56);
    ctx.globalAlpha = 1;
  }
}

export default function OgImageMaker() {
  const { t } = useTranslation();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [o, setO] = useState<Opts>({ title: "Kue Rumahan Segar Setiap Hari", subtitle: "Pesan lewat WhatsApp, diantar ke seluruh Bandung.", domain: "tokokue.id", bg1: "#1f3a8f", bg2: "#3b68f0", style: "gradient", align: "left" });
  const [file, setFile] = useState<File | null>(null);
  const [logo, setLogo] = useState<DecodedImage | null>(null);
  const [format, setFormat] = useState<"png" | "jpeg">("png");
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((x) => ({ ...x, [k]: v }));
  const intake = useFileIntake(RULES, (acc) => setFile(acc[0]?.file ?? null));

  useEffect(() => {
    let alive = true;
    if (!file) return setLogo(null);
    decodeImage(file)
      .then((d) => (alive ? setLogo(d) : d.close()))
      .catch((e) => notify.error(String((e as Error)?.message ?? e)));
    return () => {
      alive = false;
    };
  }, [file]);

  useEffect(() => {
    if (canvas.current) draw(canvas.current, o, logo);
  }, [o, logo]);

  const html = ogMetaHtml({ title: o.title, description: o.subtitle, imageUrl: o.domain.trim() ? `https://${o.domain.trim().replace(/^https?:\/\//, "").replace(/\/+$/, "")}/og-image.${format === "jpeg" ? "jpg" : "png"}` : "" });

  const download = async () => {
    if (!canvas.current) return;
    const blob = await encodeCanvas(canvas.current, `image/${format}`, 0.9);
    downloadBlob(blob, `og-image.${format === "jpeg" ? "jpg" : "png"}`);
  };

  return (
    <MediaShell tool="og-image" icon={Share2} accent="emerald">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <Panel title={t("media.og.content")}>
          <div className="flex flex-col gap-4">
            <Field label={t("media.og.title")}>
              <textarea rows={2} maxLength={120} value={o.title} onChange={(e) => set("title", e.target.value)} className={INPUT} data-testid="og-title" />
            </Field>
            <Field label={t("media.og.subtitle")}>
              <textarea rows={2} maxLength={160} value={o.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={INPUT} />
            </Field>
            <Field label={t("media.og.domain")}>
              <input value={o.domain} maxLength={60} onChange={(e) => set("domain", e.target.value)} className={INPUT} />
            </Field>
            <Field label={t("media.og.logo")}>
              <Dropzone rules={RULES} multiple={false} accept="image/*,.svg" onFiles={intake.handleFiles} busy={intake.checking} compact title={file ? file.name : t("media.og.logoDrop")} testId="og-logo" />
            </Field>
            {intake.rejectionText && <Notice tone="error">{intake.rejectionText}</Notice>}
            {file && (
              <button type="button" className={`${btn.ghost} self-start`} onClick={() => setFile(null)}>
                {t("media.og.removeLogo")}
              </button>
            )}
            <Segmented label={t("media.og.style")} value={o.style} onChange={(v) => set("style", v)} options={[{ value: "gradient", label: t("media.og.gradient") }, { value: "solid", label: t("media.og.solid") }]} />
            <div className="grid grid-cols-2 gap-3">
              <ColorField label={t("media.og.color1")} value={o.bg1} onChange={(v) => set("bg1", v)} />
              {o.style === "gradient" && <ColorField label={t("media.og.color2")} value={o.bg2} onChange={(v) => set("bg2", v)} />}
            </div>
            <Segmented label={t("media.og.align")} value={o.align} onChange={(v) => set("align", v)} options={[{ value: "left", label: t("media.og.left") }, { value: "center", label: t("media.og.center") }]} />
          </div>
        </Panel>
        <div className="flex min-w-0 flex-col gap-5">
          <Panel title={t("media.og.preview")} description={t("media.og.previewHint")}>
            <canvas ref={canvas} className="h-auto w-full rounded-lg border border-gray-200 dark:border-gray-800" style={{ aspectRatio: `${OG_SIZE.width} / ${OG_SIZE.height}` }} data-testid="og-canvas" aria-label={o.title} />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Segmented label={t("media.og.format")} value={format} onChange={setFormat} options={[{ value: "png", label: "PNG" }, { value: "jpeg", label: "JPG" }]} />
              <button type="button" className={btn.primary} onClick={download} data-testid="og-download">
                <Download className="h-4 w-4" /> {t("media.og.download")}
              </button>
            </div>
          </Panel>
          <Panel title={t("media.og.htmlTitle")} description={t("media.og.htmlHint")}>
            <pre className="overflow-x-auto rounded-lg bg-gray-950 p-3 text-[11px] leading-relaxed text-gray-100">{html}</pre>
            <button
              type="button"
              className={`${btn.secondary} mt-3`}
              onClick={() => navigator.clipboard?.writeText(html).then(() => notify.success(t("media.favicon.copied")), () => notify.error(t("errors.unknown")))}
            >
              <Copy className="h-4 w-4" /> {t("media.favicon.copy")}
            </button>
          </Panel>
        </div>
      </div>
    </MediaShell>
  );
}
