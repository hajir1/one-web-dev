import {
  AudioLines,
  FileAudio,
  Blocks,
  Braces,
  Clapperboard,
  Database,
  Eraser,
  FileSpreadsheet,
  FileText,
  Film,
  Files,
  Glasses,
  LayoutGrid,
  LayoutTemplate,
  Maximize2,
  Pipette,
  Repeat2,
  Rocket,
  ServerCog,
  Share2,
  ShieldOff,
  Shrink,
  Stamp,
  Store,
  Video,
  type LucideIcon,
} from "lucide-react";
import type { DocTopicId } from "./docs";
import { isDemoHiddenPath, isDemoMode } from "../demo/demoMode";

/* ================================================================== */
/* App menu: the ONE source for the sidebar and the Dashboard           */
/*                                                                    */
/* Adding a new tool only takes one line here; the sidebar and          */
/* Dashboard cards follow automatically. Menu text lives in the locales: */
/*   nav.sections.<id>.{name,description}                              */
/*   nav.items.<key>.{name,description}                                */
/* Paths are written WITHOUT a language prefix; the /id or /en prefix is */
/* by LocaleLink.                                                       */
/* ================================================================== */

export interface MenuLeaf {
  /** Text key in the locales (nav.items.<key>). */
  key: string;
  path: string;
  icon: LucideIcon;
  new?: boolean;
  /** This feature uses credits (partly or fully). */
  credit?: boolean;
  /** "prefix": also active for sub-routes (e.g. /data-tools/utilities/jwt). Default "exact". */
  match?: "exact" | "prefix";
  /** Documentation topic for this menu. */
  doc?: DocTopicId;
}

export interface MenuSection {
  id: "data" | "media" | "web-maker" | "vr";
  icon: LucideIcon;
  items: MenuLeaf[];
}

export const GLOBAL_SETTING_PATH = "/global-setting";
export const CREDITS_PATH = "/credits";
/** v11: Media & Data subscription plans. */
export const PLANS_PATH = "/plans";
export const DOCS_PATH = "/docs";
export const JOB_HISTORY_PATH = "/job-history";
export const TEAM_PATH = "/team";
export const TEMPLATES_PATH = "/web-templates";
/** v17: Website Builder home (Choose → Modify → Deploy flow). */
export const WEBSITE_HUB_PATH = "/website-builder";
/** Susun & Deploy (folder website). */
export const SITE_PATH = "/website";
/** v20: Studio = single-website editor (all pages, Site, Submissions, Deploy). */
export const STUDIO_PATH = "/studio";
export const studioPath = (siteId: string, pageId?: string) => `${STUDIO_PATH}/${encodeURIComponent(siteId)}${pageId ? `?page=${encodeURIComponent(pageId)}` : ""}`;
/** v17: no-code editor for Code Template projects. */
export const codeEditorPath = (projectId: string) => `${WEBSITE_HUB_PATH}/code/${encodeURIComponent(projectId)}`;
/** Design packs, demo balance, and Premium items (local simulation). */
export const MARKET_PATH = "/web-market";

/** Menu VR: pembuat tur 360°. */
export const VR_TOUR_PATH = "/vr/tour-360";

export const MENU_SECTIONS: MenuSection[] = [
  {
    id: "data",
    icon: Files,
    items: [
      { key: "excelToJson", path: "/data-tools/excel-to-json", icon: FileSpreadsheet, doc: "data-excel-json" },
      { key: "sqlConverter", path: "/data-tools/sql-converter", icon: Database, doc: "data-sql" },
      { key: "pdfTools", path: "/data-tools/pdf-tools", icon: FileText, match: "prefix", new: true, doc: "data-pdf" },
      { key: "devUtilities", path: "/data-tools/utilities", icon: Braces, match: "prefix", new: true, doc: "data-utilities" },
      { key: "serverConvert", path: "/data-tools/server-convert", icon: ServerCog, new: true, credit: true, doc: "data-server" },
    ],
  },
  {
    id: "media",
    icon: Video,
    items: [
      { key: "mediaHub", path: "/media-tools", icon: LayoutGrid, doc: "media" },
      { key: "imageConverter", path: "/media-tools/image-converter", icon: Repeat2, doc: "media" },
      { key: "audioConverter", path: "/media-tools/audio-converter", icon: FileAudio, new: true, doc: "media" },
      { key: "findColors", path: "/media-tools/find-colors-at-image", icon: Pipette, doc: "media" },
      { key: "removeBackground", path: "/media-tools/remove-background", icon: Eraser, credit: true, doc: "media" },
      { key: "videoToFrames", path: "/media-tools/video-to-frames", icon: Clapperboard, credit: true, doc: "media" },
      { key: "imageUpscaler", path: "/media-tools/image-upscaler", icon: Maximize2, credit: true, doc: "media" },
      { key: "metadataRemover", path: "/media-tools/metadata-remover", icon: ShieldOff, doc: "media" },
      { key: "videoToGif", path: "/media-tools/video-to-gif", icon: Film, credit: true, doc: "media" },
      { key: "audioExtract", path: "/media-tools/audio-extract", icon: AudioLines, credit: true, doc: "media" },
      { key: "videoCompress", path: "/media-tools/video-compress", icon: Shrink, credit: true, doc: "media" },
      { key: "faviconGenerator", path: "/media-tools/favicon-generator", icon: Stamp, new: true, doc: "media" },
      { key: "ogImage", path: "/media-tools/og-image", icon: Share2, new: true, doc: "media" },
    ],
  },
  {
    id: "web-maker",
    icon: Blocks,
    items: [
      // v20: simplified flow: My Websites (project → Studio) and Templates. Page Editor,
      // Compose & Deploy, and Global Settings now live inside Studio (old links redirect).
      { key: "websiteHub", path: WEBSITE_HUB_PATH, icon: Rocket, new: true, match: "prefix", doc: "website" },
      { key: "webTemplates", path: TEMPLATES_PATH, icon: LayoutTemplate, match: "prefix", doc: "templates" },
      { key: "webMarket", path: MARKET_PATH, icon: Store, new: true, credit: true, doc: "templates" },
    ],
  },
  {
    id: "vr",
    icon: Glasses,
    items: [{ key: "vrTour", path: VR_TOUR_PATH, icon: Glasses, new: true, credit: true, doc: "vr" }],
  },
];

/**
 * Visible menu items. Demo mode (v12): server-only (paid) tools and the Store
 * are hidden, and the "uses credits" marker is removed.
 */
export function visibleMenuSections(): MenuSection[] {
  if (!isDemoMode()) return MENU_SECTIONS;
  return MENU_SECTIONS.map((s) => ({ ...s, items: s.items.filter((l) => !isDemoHiddenPath(l.path)).map((l) => ({ ...l, credit: false })) })).filter((s) => s.items.length > 0);
}

/** Whether `pathname` (without the language prefix) belongs to this menu item. */
export function isLeafActive(leaf: Pick<MenuLeaf, "path" | "match">, pathname: string): boolean {
  if (pathname === leaf.path) return true;
  return leaf.match === "prefix" && pathname.startsWith(`${leaf.path}/`);
}
