// ─── processing/policy.ts ────────────────────────────────────────────────────
// The ONE source of truth: which Media features run in the browser, which on the
// server, and how they are billed. Pages, the Media Hub, and the documentation
// reads from here.
//
// Aturan:
// - Browser  → always free, files never leave the device.
// - Server   → chosen for technical needs (large AI models, codecs the
//              browser does not support, very large files). Cost & access
//              per server feature are configured SEPARATELY in `pricing.ts`.

import i18n from "../../../i18n";
import type { ServerFeatureId } from "./pricing";
import { isDemoMode } from "../../../demo/demoMode";

export type MediaToolId =
  | "image-converter"
  | "audio-converter"
  | "find-colors"
  | "remove-background"
  | "video-to-frames"
  | "image-upscaler"
  | "metadata-remover"
  | "video-to-gif"
  | "audio-extract"
  | "video-compress"
  | "favicon-generator"
  | "og-image";

export type ProcessingMode = "browser" | "server";
interface ModeSpec {
  /** Short explanation for the mode picker. */
  summary: string;
  /** Technical limits shown to the user. */
  limits: string[];
}

export interface MediaToolSpec {
  id: MediaToolId;
  name: string;
  path: string;
  tagline: string;
  modes: Partial<Record<ProcessingMode, ModeSpec>>;
  /** Recommended default mode. */
  recommended: ProcessingMode;
  /** Reason for the recommendation (used in the Media Hub & documentation). */
  rationale: string;
  /** Price key in pricing.ts for server mode. */
  serverFeature?: ServerFeatureId;
}

/** Policy text is read at use time (not when the module loads) so it follows the active language. */
const tt = (key: string) => i18n.t(`media.tools.${key}`);

function modeSpec(tool: MediaToolId, mode: ProcessingMode, limitCount: number): ModeSpec {
  return {
    get summary() {
      return tt(`${tool}.modes.${mode}.summary`);
    },
    get limits() {
      return Array.from({ length: limitCount }, (_, i) => tt(`${tool}.modes.${mode}.limits.${i}`));
    },
  };
}

function defineTool(t: Omit<MediaToolSpec, "name" | "tagline" | "rationale">): MediaToolSpec {
  return Object.defineProperties(t as MediaToolSpec, {
    name: { get: () => tt(`${t.id}.name`), enumerable: true },
    // Demo mode (v12): tagline without mentioning server mode (when a demo version exists).
    tagline: { get: () => (isDemoMode() && i18n.exists(`demo.media.taglines.${t.id}`) ? i18n.t(`demo.media.taglines.${t.id}`) : tt(`${t.id}.tagline`)), enumerable: true },
    rationale: { get: () => tt(`${t.id}.rationale`), enumerable: true },
  });
}

export const MEDIA_TOOLS: MediaToolSpec[] = [
  defineTool({
    id: "image-converter",
    path: "/media-tools/image-converter",
    recommended: "browser",
    modes: { browser: modeSpec("image-converter", "browser", 3) },
  }),
  defineTool({
    id: "audio-converter",
    path: "/media-tools/audio-converter",
    recommended: "browser",
    modes: { browser: modeSpec("audio-converter", "browser", 3) },
  }),
  defineTool({
    id: "find-colors",
    path: "/media-tools/find-colors-at-image",
    recommended: "browser",
    modes: { browser: modeSpec("find-colors", "browser", 2) },
  }),
  defineTool({
    id: "remove-background",
    serverFeature: "remove-background",
    path: "/media-tools/remove-background",
    recommended: "browser",
    modes: { browser: modeSpec("remove-background", "browser", 3), server: modeSpec("remove-background", "server", 3) },
  }),
  defineTool({
    id: "video-to-frames",
    serverFeature: "video-to-frames",
    path: "/media-tools/video-to-frames",
    recommended: "browser",
    modes: { browser: modeSpec("video-to-frames", "browser", 3), server: modeSpec("video-to-frames", "server", 2) },
  }),
  defineTool({
    id: "image-upscaler",
    serverFeature: "image-upscaler",
    path: "/media-tools/image-upscaler",
    recommended: "browser",
    modes: { browser: modeSpec("image-upscaler", "browser", 2), server: modeSpec("image-upscaler", "server", 2) },
  }),
  defineTool({
    id: "metadata-remover",
    path: "/media-tools/metadata-remover",
    recommended: "browser",
    modes: { browser: modeSpec("metadata-remover", "browser", 3) },
  }),
  defineTool({
    id: "video-to-gif",
    serverFeature: "video-to-gif",
    path: "/media-tools/video-to-gif",
    recommended: "server",
    modes: { server: modeSpec("video-to-gif", "server", 3) },
  }),
  defineTool({
    id: "audio-extract",
    serverFeature: "audio-extract",
    path: "/media-tools/audio-extract",
    recommended: "browser",
    modes: { browser: modeSpec("audio-extract", "browser", 3), server: modeSpec("audio-extract", "server", 2) },
  }),
  defineTool({
    id: "video-compress",
    serverFeature: "video-compress",
    path: "/media-tools/video-compress",
    recommended: "server",
    modes: { server: modeSpec("video-compress", "server", 3) },
  }),
  // v10: web asset tools (browser, free).
  defineTool({
    id: "favicon-generator",
    path: "/media-tools/favicon-generator",
    recommended: "browser",
    modes: { browser: modeSpec("favicon-generator", "browser", 2) },
  }),
  defineTool({
    id: "og-image",
    path: "/media-tools/og-image",
    recommended: "browser",
    modes: { browser: modeSpec("og-image", "browser", 2) },
  }),
];

export const TOOL_BY_ID: Record<MediaToolId, MediaToolSpec> = Object.fromEntries(MEDIA_TOOLS.map((t) => [t.id, t])) as Record<
  MediaToolId,
  MediaToolSpec
>;

export function availableModes(id: MediaToolId): ProcessingMode[] {
  return (Object.keys(TOOL_BY_ID[id].modes) as ProcessingMode[]).filter((m) => TOOL_BY_ID[id].modes[m]);
}

/** The feature can only be processed on the server. */
export const isServerOnly = (id: MediaToolId) => !TOOL_BY_ID[id].modes.browser && !!TOOL_BY_ID[id].modes.server;
