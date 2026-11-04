import type { TemplateCategory, TemplateTier } from "../../../../../config/templates";

/* ================================================================== */
/* v7 template specification part H: DASHBOARDS                         */
/*                                                                    */
/* One template = domain content (./domains.ts: KPIs, charts, tables, forms */
/* bilingual) + look (sidebar/topnav shell, card style, KPI style,      */
/* palette, fonts, block order). The engine in ./kitH.ts assembles it into */
/* regular Page Maker sections (Section → Row → Element), so every      */
/* page stays fully editable and exportable to every format.           */
/* ================================================================== */

/** Bilingual text "id|en" (without "|" = the same for both languages). */
export type X = string;

/** Kerangka aplikasi. */
export type Shell =
  | "side-dark" // sidebar gelap
  | "side-light" // sidebar terang bergaris
  | "side-brand" // brand-colored sidebar (gradient)
  | "side-float" // floating card sidebar
  | "topnav" // top navigation, no sidebar
  | "topnav-dark" // dark top navigation
  | "rail"; // sidebar ramping + label grup

/** Card style. */
export type CardStyle = "shadow" | "border" | "flat" | "glass" | "brutal" | "accent";

/** Stat card (KPI) style. */
export type KpiStyle = "plain" | "icon" | "tint" | "accent" | "split" | "counter";

/** Page types other than the home page (overview). */
export type PageKind = "records" | "analytics" | "board" | "settings" | "login" | "customers" | "reports";

/** Dashboard content block. */
export type HBlock =
  | "kpis" // stat cards
  | "main" // grafik utama + donat samping
  | "duo" // two charts
  | "wide" // wide chart
  | "table" // data table + toolbar + pagination
  | "mini-table" // compact table (5 rows)
  | "activity" // linimasa aktivitas
  | "goals" // target (bilah progres)
  | "team" // anggota tim
  | "board" // 3-column kanban
  | "form" // formulir pengaturan
  | "alerts" // pemberitahuan
  | "steps" // langkah onboarding
  | "tabs" // tab wawasan
  | "quick" // pintasan
  | "split-act" // compact table + activity side by side
  | "split-goal"; // target + tim berdampingan

export interface HChart {
  type: "bar" | "line" | "pie" | "doughnut";
  title: X;
  /** Series names separated by commas, e.g. "Pendapatan, Target|Revenue, Target". */
  series: X;
  /** "Label, nilai1, nilai2" — label dwibahasa "Jan|Jan". */
  rows: string[];
}

/** Content pack of one domain (admin, CRM, finance, …). */
export interface Domain {
  key: string;
  /** Role/subtitle on the home page. */
  role: X;
  /** Catalog description (without the page count). */
  desc: X;
  tags: string[];
  /** Page names. `records` = the main table page (e.g. Orders). */
  names: Partial<Record<"overview" | PageKind, X>>;
  /** One-character icon/glyph for the logo. */
  glyph: string;
  /** Search box placeholder. */
  search: X;
  /** Main action button. */
  action: X;
  /** KPI: "label|label en ; value ; delta ; up/down ; glyph". At least 6. */
  kpis: string[];
  main: HChart;
  side: HChart;
  extra: HChart;
  /** Extra charts on the analytics page. */
  extra2?: HChart;
  table: { title: X; cols: X[]; rows: string[][]; filter: X[] };
  /** Second table (customers/reports page). */
  table2?: { title: X; cols: X[]; rows: string[][]; filter: X[] };
  /** "time | title | text" (bilingual per part). */
  activity: string[];
  /** "label ; value 0–100". */
  goals: string[];
  /** "Nama ; peran". */
  team: string[];
  board: { cols: X[]; cards: string[][] };
  form: { title: X; text: X; fields: string[]; selects: string[]; switches: X[]; note: X };
  alerts: string[];
  steps: string[];
  tabs: string[];
  quick: string[];
  login: { title: X; text: X; bullets: X[] };
}

export interface HSpec {
  id: string;
  brand: string;
  cat: TemplateCategory;
  tier: TemplateTier;
  domain: Domain;
  /** [ink, muted, primary, primaryDark, soft, line] */
  pal: [string, string, string, string, string, string];
  look: { head: string; body: string; radius: number; bg: string; surface: string; dark?: boolean; card: CardStyle };
  shell: Shell;
  kpi: KpiStyle;
  login: "split" | "center" | "banner";
  /** Pages other than the home page (menu order). */
  pages: PageKind[];
  /** Home page block order. */
  home: HBlock[];
  /** Tag tambahan (gaya). */
  tags?: string[];
  /** Entrance effects (Premium only). */
  fx?: "aos" | "animate";
}
