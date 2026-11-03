// ─── demo/demoLocale.ts ──────────────────────────────────────────────────────
// Mode demo (v15): semua fitur terbuka, jadi teks yang menonjolkan "gratis",
// kredit, atau paket diganti dengan versi netral. Ditimpa di atas bundle bahasa
// setiap kali bundle itu dimuat (EN dimuat belakangan, lihat i18n.activateLanguage).
// Kunci khusus demo sendiri ada di `demo.*` pada berkas locale.

import type { i18n as I18n } from "i18next";

type Tree = { [k: string]: string | Tree };

const MEDIA_IDS = ["audio-extract", "image-converter", "image-upscaler", "metadata-remover", "remove-background", "video-to-frames", "audio-converter", "favicon-generator", "og-image"] as const;

const browserSummaries = (texts: Record<(typeof MEDIA_IDS)[number], string>): Tree =>
  Object.fromEntries(MEDIA_IDS.map((id) => [id, { modes: { browser: { summary: texts[id] } } }]));

const merge = (a: Tree, b: Tree): Tree => {
  const out: Tree = { ...a };
  for (const [k, v] of Object.entries(b)) out[k] = typeof v === "object" && typeof out[k] === "object" ? merge(out[k] as Tree, v) : v;
  return out;
};

export const DEMO_LOCALE: Record<"id" | "en", Tree> = {
  id: {
    templates: { description: "Template website responsif yang dibangun dari elemen Desain Halaman. Pratinjau, unduh source code lengkap, atau buka sebagai website baru untuk diedit." },
    data: {
      pdf: { description: "Gabung, pisah, kompres, putar, dan ubah PDF ↔ gambar. Semua diproses di browser." },
      errors: { serverSheetType: "Konversi ini menerima .xls, .ods, atau .xlsb. Untuk .xlsx/.csv gunakan Excel → JSON (di browser)." },
    },
    pm: {
      events: { freeNote: "Semua event tersedia." },
      groups: { Premium: "Interaktif" },
      library: { premiumGroup: "Interaktif" },
      deploy: { hint: "Deploy: kirim website HTML ini ke repo GitHub dan terbitkan di GitHub Pages, lalu lanjutkan ke Vercel bila mau." },
    },
    media: {
      shell: { browserFree: "Diproses di browser", browserFreeShort: "Browser" },
      hub: { browserFree: "Browser", chipBrowser: "Browser: file tidak di-upload" },
      gate: { useBrowser: "Pakai mode browser" },
      audioExtract: { runBrowser: "Ekstrak ke WAV" },
      imageConverter: { wasmNote: "Diproses di browser dengan codec WebAssembly (MozJPEG, libwebp, libavif, libjxl) di Web Worker. File tidak dikirim ke server." },
      audioConverter: { wasmNote: "Encoder WebAssembly dimuat saat pertama dipakai. File tidak pernah di-upload." },
      tools: merge(
        browserSummaries({
          "audio-extract": "Web Audio API men-decode audio di perangkat Anda lalu menyimpannya sebagai WAV. Tanpa upload.",
          "image-converter": "Diproses di perangkat Anda dengan codec WebAssembly di Web Worker. Tanpa upload.",
          "image-upscaler": "Interpolasi berkualitas tinggi + unsharp mask di Web Worker. Tidak menambah detail baru.",
          "metadata-remover": "Mengedit struktur file langsung (lossless) di perangkat Anda. Tanpa upload.",
          "remove-background": "Model AI (BiRefNet, ONNX) dijalankan di browser lewat WebAssembly/WebGPU. File tidak di-upload.",
          "video-to-frames": "Decoder video bawaan browser + Canvas. Tanpa upload.",
          "audio-converter": "Diproses di perangkat Anda dengan WebAssembly di Web Worker. Tanpa upload.",
          "favicon-generator": "Semua ukuran ikon dibuat di perangkat Anda. Tanpa upload.",
          "og-image": "Gambar dibuat di perangkat Anda. Tanpa upload.",
        }),
        {
          "audio-converter": {
            tagline: "Konversi MP3, WAV, OGG, Opus, FLAC, AAC, M4A — banyak file sekaligus, tanpa upload.",
            rationale: "Encoder WebAssembly (LAME, libvorbis, libFLAC, AAC) dan WebCodecs berjalan di perangkat Anda: cepat, dan file tidak pernah di-upload.",
          },
        },
      ),
    },
  },
  en: {
    templates: { description: "Responsive website templates built from Page Maker elements. Preview, download the full source code, or open one as a new website to edit." },
    data: {
      pdf: { description: "Merge, split, compress, rotate, and convert PDF ↔ images. Everything runs in your browser." },
      errors: { serverSheetType: "This conversion accepts .xls, .ods, or .xlsb. For .xlsx/.csv use Excel → JSON (in the browser)." },
    },
    pm: {
      events: { freeNote: "Every event is available." },
      groups: { Premium: "Interactive" },
      library: { premiumGroup: "Interactive" },
      deploy: { hint: "Deploy: push this HTML website to a GitHub repo and publish it on GitHub Pages, then continue to Vercel if you like." },
    },
    media: {
      shell: { browserFree: "Processed in your browser", browserFreeShort: "Browser" },
      hub: { browserFree: "Browser", chipBrowser: "Browser: files are not uploaded" },
      gate: { useBrowser: "Use browser mode" },
      audioExtract: { runBrowser: "Extract to WAV" },
      imageConverter: { wasmNote: "Processed in your browser with WebAssembly codecs (MozJPEG, libwebp, libavif, libjxl) in a Web Worker. Files are never sent to a server." },
      audioConverter: { wasmNote: "WebAssembly encoders load on first use. Files are never uploaded." },
      tools: merge(
        browserSummaries({
          "audio-extract": "The Web Audio API decodes the audio on your device and saves it as WAV. No upload.",
          "image-converter": "Processed on your device with WebAssembly codecs in a Web Worker. No upload.",
          "image-upscaler": "High-quality interpolation + unsharp mask in a Web Worker. Does not add new detail.",
          "metadata-remover": "Edits the file structure directly (lossless) on your device. No upload.",
          "remove-background": "An AI model (BiRefNet, ONNX) runs in the browser via WebAssembly/WebGPU. Files are not uploaded.",
          "video-to-frames": "The browser's built-in video decoder + Canvas. No upload.",
          "audio-converter": "Processed on your device with WebAssembly in a Web Worker. No upload.",
          "favicon-generator": "Every icon size is made on your device. No upload.",
          "og-image": "The image is made on your device. No upload.",
        }),
        {
          "audio-converter": {
            tagline: "Convert MP3, WAV, OGG, Opus, FLAC, AAC, M4A — many files at once, no upload.",
            rationale: "WebAssembly encoders (LAME, libvorbis, libFLAC, AAC) and WebCodecs run on your device: fast, and files are never uploaded.",
          },
        },
      ),
    },
  },
};

/** Pasang teks demo di atas setiap bundle bahasa yang sudah atau akan dimuat. */
export function installDemoLocale(i18n: I18n): void {
  let applying = false;
  const apply = (lng: string) => {
    const patch = DEMO_LOCALE[lng as "id" | "en"];
    if (!patch || applying) return;
    applying = true;
    try {
      i18n.addResourceBundle(lng, "translation", patch, true, true);
    } finally {
      applying = false;
    }
  };
  for (const lng of Object.keys(DEMO_LOCALE)) if (i18n.hasResourceBundle(lng, "translation")) apply(lng);
  i18n.store.on("added", (lng: string, ns: string) => {
    if (ns === "translation") apply(lng);
  });
}
