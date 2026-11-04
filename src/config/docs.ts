import {
  BookOpen,
  Braces,
  Coins,
  Crown,
  Database,
  FileSpreadsheet,
  FileText,
  Glasses,
  Globe,
  Image,
  LayoutTemplate,
  PanelsTopLeft,
  ServerCog,
  SlidersHorizontal,
  type LucideIcon,
} from "lucide-react";
import { isDemoMode } from "../demo/demoMode";

/* ================================================================== */
/* Documentation topic list: the ONE source for the Help button in each  */
/* menu, the documentation drawer, and the /docs page.                  */
/* Each topic's content (ID & EN) lives in the locales: docs.topics.<id>. */
/* ================================================================== */

export type DocTopicId =
  | "getting-started"
  | "credits"
  | "plans"
  | "data-excel-json"
  | "data-sql"
  | "data-utilities"
  | "data-pdf"
  | "data-server"
  | "media"
  | "page-maker"
  | "website"
  | "templates"
  | "global-setting"
  | "vr";

export type DocGroup = "general" | "data" | "media" | "web-maker" | "vr";

export interface DocTopic {
  id: DocTopicId;
  group: DocGroup;
  icon: LucideIcon;
  /** The app page this topic explains (for the "Open tool" button). */
  path: string;
}

export const DOC_TOPICS: DocTopic[] = [
  { id: "getting-started", group: "general", icon: BookOpen, path: "/" },
  { id: "credits", group: "general", icon: Coins, path: "/credits" },
  { id: "plans", group: "general", icon: Crown, path: "/plans" },
  { id: "data-excel-json", group: "data", icon: FileSpreadsheet, path: "/data-tools/excel-to-json" },
  { id: "data-sql", group: "data", icon: Database, path: "/data-tools/sql-converter" },
  { id: "data-utilities", group: "data", icon: Braces, path: "/data-tools/utilities" },
  { id: "data-pdf", group: "data", icon: FileText, path: "/data-tools/pdf-tools" },
  { id: "data-server", group: "data", icon: ServerCog, path: "/data-tools/server-convert" },
  { id: "media", group: "media", icon: Image, path: "/media-tools" },
  { id: "page-maker", group: "web-maker", icon: PanelsTopLeft, path: "/page-maker" },
  { id: "website", group: "web-maker", icon: Globe, path: "/website" },
  { id: "templates", group: "web-maker", icon: LayoutTemplate, path: "/web-templates" },
  { id: "global-setting", group: "web-maker", icon: SlidersHorizontal, path: "/global-setting" },
  { id: "vr", group: "vr", icon: Glasses, path: "/vr/tour-360" },
];

/** Demo mode (v12): the Credits, Packs & Server Conversion topics are hidden. */
const DEMO_HIDDEN_TOPICS: DocTopicId[] = ["credits", "plans", "data-server"];
export const visibleDocTopics = (): DocTopic[] => (isDemoMode() ? DOC_TOPICS.filter((d) => !DEMO_HIDDEN_TOPICS.includes(d.id)) : DOC_TOPICS);
export const isVisibleDocTopic = (v: unknown): v is DocTopicId => isDocTopic(v) && (!isDemoMode() || !DEMO_HIDDEN_TOPICS.includes(v));

export const DOC_GROUP_ORDER: DocGroup[] = ["general", "data", "media", "web-maker", "vr"];

export const DOC_BY_ID = Object.fromEntries(DOC_TOPICS.map((d) => [d.id, d])) as Record<DocTopicId, DocTopic>;

export const isDocTopic = (v: unknown): v is DocTopicId => typeof v === "string" && v in DOC_BY_ID;
