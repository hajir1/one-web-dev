// ─── workers/bgRemovalWorker.ts ──────────────────────────────────────────────
// Hapus latar di browser dengan transformers.js (Apache-2.0) + model
// BiRefNet_lite ONNX (MIT). Pengganti @imgly/background-removal (AGPL-3.0).
//
// Worker ini HIDUP TERUS selama halaman terbuka agar model (±115/224 MB)
// cukup dimuat sekali; batal = worker di-terminate oleh bgRemoval.ts.

import { AutoModel, AutoProcessor, RawImage, env, type PreTrainedModel, type Processor, type Tensor } from "@huggingface/transformers";

export const BG_MODEL_ID = "onnx-community/BiRefNet_lite-ONNX";
export type BgDtype = "fp16" | "fp32";

export type BgRequest = { id: number; file: Blob; dtype: BgDtype };
export type BgResponse =
  | { id: number; type: "progress"; value: number }
  | { id: number; type: "done"; blob: Blob; device: string }
  | { id: number; type: "error"; error: string };

env.allowLocalModels = false;

const post = (m: BgResponse) => (self as unknown as Worker).postMessage(m);

let loaded: { key: string; device: string; model: Promise<PreTrainedModel>; processor: Promise<Processor> } | null = null;

function load(dtype: BgDtype, onProgress: (v: number) => void) {
  const nav = self.navigator as Navigator & { gpu?: unknown };
  const device = nav.gpu ? "webgpu" : "wasm";
  const key = `${dtype}:${device}`;
  if (loaded?.key === key) return loaded;
  // Progres unduhan gabungan semua file model (config, preprocessor, onnx).
  const files = new Map<string, { loaded: number; total: number }>();
  const progress_callback = (p: { status: string; file?: string; loaded?: number; total?: number }) => {
    if (p.status !== "progress" || !p.file) return;
    files.set(p.file, { loaded: p.loaded ?? 0, total: p.total ?? 0 });
    let l = 0;
    let t = 0;
    for (const f of files.values()) {
      l += f.loaded;
      t += f.total;
    }
    if (t > 0) onProgress((l / t) * 70);
  };
  const model = AutoModel.from_pretrained(BG_MODEL_ID, { dtype, device: device as "webgpu" | "wasm", progress_callback });
  const processor = AutoProcessor.from_pretrained(BG_MODEL_ID, { progress_callback });
  loaded = { key, device, model, processor };
  // Gagal memuat → jangan simpan janji yang sudah gagal.
  Promise.all([model, processor]).catch(() => {
    if (loaded?.key === key) loaded = null;
  });
  return loaded;
}

async function run({ id, file, dtype }: BgRequest) {
  const progress = (value: number) => post({ id, type: "progress", value });
  const l = load(dtype, progress);
  const [model, processor] = await Promise.all([l.model, l.processor]);
  progress(72);

  const image = await RawImage.fromBlob(file);
  const { pixel_values } = (await processor(image)) as { pixel_values: Tensor };
  progress(78);
  const out = (await model({ input_image: pixel_values })) as Record<string, Tensor>;
  const matte = out.output_image ?? Object.values(out)[0];
  progress(92);
  const mask = await RawImage.fromTensor((matte as unknown as Record<number, Tensor>)[0].sigmoid().mul(255).to("uint8")).resize(image.width, image.height);

  // Gabungkan: piksel asli + alpha dari mask.
  const bmp = await createImageBitmap(file);
  const canvas = new OffscreenCanvas(bmp.width, bmp.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const m = mask.data;
  const ch = mask.channels;
  for (let i = 0, j = 0; i < px.data.length; i += 4, j += ch) px.data[i + 3] = m[j];
  ctx.putImageData(px, 0, 0);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  post({ id, type: "done", blob, device: l.device });
}

self.onmessage = (e: MessageEvent<BgRequest>) => {
  run(e.data).catch((err: unknown) => post({ id: e.data.id, type: "error", error: err instanceof Error ? err.message : String(err) }));
};
