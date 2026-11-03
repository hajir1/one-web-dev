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
/* Menu aplikasi — SATU sumber untuk sidebar dan Dashboard             */
/*                                                                    */
/* Menambah alat baru cukup menambah satu baris di sini; sidebar dan   */
/* kartu Dashboard ikut otomatis. Teks menu ada di locales:             */
/*   nav.sections.<id>.{name,description}                              */
/*   nav.items.<key>.{name,description}                                */
/* Path ditulis TANPA prefix bahasa; prefix /id atau /en ditambahkan    */
/* oleh LocaleLink.                                                     */
/* ================================================================== */

export interface MenuLeaf {
  /** Kunci teks di locales (nav.items.<key>). */
  key: string;
  path: string;
  icon: LucideIcon;
  new?: boolean;
  /** Fitur ini memakai kredit (sebagian/seluruhnya). */
  credit?: boolean;
  /** "prefix": aktif juga untuk sub-rute (mis. /data-tools/utilities/jwt). Default "exact". */
  match?: "exact" | "prefix";
  /** Topik dokumentasi menu ini. */
  doc?: DocTopicId;
}

export interface MenuSection {
  id: "data" | "media" | "web-maker" | "vr";
  icon: LucideIcon;
  items: MenuLeaf[];
}

export const GLOBAL_SETTING_PATH = "/global-setting";
export const CREDITS_PATH = "/credits";
/** v11: paket langganan Media & Data. */
export const PLANS_PATH = "/plans";
export const DOCS_PATH = "/docs";
export const JOB_HISTORY_PATH = "/job-history";
export const TEAM_PATH = "/team";
export const TEMPLATES_PATH = "/web-templates";
/** v17: beranda Pembuat Website (alur Pilih → Modifikasi → Deploy). */
export const WEBSITE_HUB_PATH = "/website-builder";
/** Susun & Deploy (folder website). */
export const SITE_PATH = "/website";
/** v20: Studio = editor satu website (semua halaman, Situs, Kiriman, Deploy). */
export const STUDIO_PATH = "/studio";
export const studioPath = (siteId: string, pageId?: string) => `${STUDIO_PATH}/${encodeURIComponent(siteId)}${pageId ? `?page=${encodeURIComponent(pageId)}` : ""}`;
/** v17: editor tanpa kode untuk proyek Template Kode. */
export const codeEditorPath = (projectId: string) => `${WEBSITE_HUB_PATH}/code/${encodeURIComponent(projectId)}`;
/** Paket desain, saldo demo, dan item Premium (simulasi lokal). */
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
      // v20: alur disederhanakan: Website Saya (proyek → Studio) dan Template. Editor Halaman,
      // Susun & Deploy, dan Pengaturan Global kini ada di dalam Studio (tautan lama dialihkan).
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
 * Menu yang tampil. Mode demo (v12): alat yang hanya berjalan di server
 * (berbayar) dan Toko disembunyikan, dan tanda "memakai kredit" dihapus.
 */
export function visibleMenuSections(): MenuSection[] {
  if (!isDemoMode()) return MENU_SECTIONS;
  return MENU_SECTIONS.map((s) => ({ ...s, items: s.items.filter((l) => !isDemoHiddenPath(l.path)).map((l) => ({ ...l, credit: false })) })).filter((s) => s.items.length > 0);
}

/** Apakah `pathname` (tanpa prefix bahasa) termasuk menu ini. */
export function isLeafActive(leaf: Pick<MenuLeaf, "path" | "match">, pathname: string): boolean {
  if (pathname === leaf.path) return true;
  return leaf.match === "prefix" && pathname.startsWith(`${leaf.path}/`);
}
