import { BarChart3, Palette } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SelectField, TextField, ToggleField, tOption } from "../../ui/fields";
import { defineElement, type ElementSpec } from "../../helpers/elementDefinition";
import { h, renderHtml } from "../../helpers/markup";
import { safeColor } from "../../helpers/background";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* Chart — grafik batang/garis/pai/donat memakai Chart.js (CDN).        */
/*                                                                    */
/* Elemen ini meminta library "chartjs": saat dipakai, compose()       */
/* otomatis memasang <script> Chart.js di hasil ekspor (HTML) dan      */
/* LIBRARIES.md (React/Vue/Svelte/Angular). Kode grafik menunggu       */
/* window.Chart tersedia, lalu menggambar; grafik lama dihancurkan.    */
/* ================================================================== */

type ChartType = "bar" | "line" | "pie" | "doughnut";

export interface ChartState {
  chartType: ChartType;
  title: string;
  /** Nama seri dipisah koma (maks. 2), mis. "Penjualan, Target". */
  series: string;
  /** Satu baris per label: "Jan, 12, 8". */
  rows: string[];
  color1: string;
  color2: string;
  titleColor: string;
  textColor: string;
  showLegend: boolean;
  beginAtZero: boolean;
  height: number;
}

const DEFAULT_STATE: ChartState = {
  chartType: "bar",
  title: "Penjualan per bulan",
  series: "Penjualan, Target",
  rows: ["Jan, 12, 10", "Feb, 19, 14", "Mar, 15, 16", "Apr, 24, 18", "Mei, 22, 20", "Jun, 30, 24"],
  color1: "#2563eb",
  color2: "#f59e0b",
  titleColor: "#0f172a",
  textColor: "#475569",
  showLegend: true,
  beginAtZero: true,
  height: 300,
};

const CHART_TYPES: ChartType[] = ["bar", "line", "pie", "doughnut"];
const MAX_CHART_ROWS = 24;
const PALETTE = ["#10b981", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#64748b"];

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));
const col = (c: string, d: string) => safeColor(c) ?? d;
const tr = (k: string) => i18n.t(`el.x.chart.${k}`);

export interface ChartData {
  labels: string[];
  series: { name: string; values: number[] }[];
}

/** Ubah isian panel jadi data grafik (label & angka dibersihkan). */
export function parseChartData(s: Pick<ChartState, "series" | "rows">): ChartData {
  const names = (s.series || "")
    .split(",")
    .map((x) => x.trim().slice(0, 40))
    .filter(Boolean)
    .slice(0, 2);
  if (!names.length) names.push("Data");
  const labels: string[] = [];
  const series = names.map((name) => ({ name, values: [] as number[] }));
  for (const line of s.rows ?? []) {
    if (labels.length >= MAX_CHART_ROWS) break;
    const parts = String(line).split(",");
    const label = parts[0].trim().slice(0, 40);
    if (!label) continue;
    labels.push(label);
    series.forEach((sr, i) => {
      const n = Number(String(parts[i + 1] ?? "").trim().replace(/\s/g, ""));
      sr.values.push(Number.isFinite(n) ? clamp(n, -1e9, 1e9) : 0);
    });
  }
  return { labels, series };
}

/** Konfigurasi Chart.js (objek JSON biasa). */
export function chartConfig(s: ChartState) {
  const type: ChartType = CHART_TYPES.includes(s.chartType) ? s.chartType : "bar";
  const { labels, series } = parseChartData(s);
  const c1 = col(s.color1, DEFAULT_STATE.color1);
  const c2 = col(s.color2, DEFAULT_STATE.color2);
  const text = col(s.textColor, DEFAULT_STATE.textColor);
  const round = type === "pie" || type === "doughnut";
  const datasets = round
    ? [{ label: series[0].name, data: series[0].values, backgroundColor: labels.map((_, i) => [c1, c2, ...PALETTE][i % (PALETTE.length + 2)]), borderWidth: 1 }]
    : series.map((sr, i) => ({
        label: sr.name,
        data: sr.values,
        backgroundColor: i ? c2 : c1,
        borderColor: i ? c2 : c1,
        borderWidth: 2,
        tension: 0.3,
        fill: false,
      }));
  const ticks = { color: text };
  return {
    type,
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: !!s.showLegend, labels: { color: text } } },
      ...(round ? {} : { scales: { x: { ticks }, y: { beginAtZero: !!s.beginAtZero, ticks } } }),
    },
  };
}

/** Ringkasan teks data untuk pembaca layar. */
export function chartSummary(s: ChartState): string {
  const { labels, series } = parseChartData(s);
  const rows = labels.map((l, i) => `${l}: ${series.map((sr) => `${sr.name} ${sr.values[i]}`).join(", ")}`);
  return `${s.title ? `${s.title}. ` : ""}${rows.join("; ")}`;
}

/** Tunggu window.Chart (CDN), lalu gambar; mengembalikan fungsi pembersih. */
const WAIT_FN = `function whenChartReady(run) {
  let tries = 0;
  let timer = null;
  let stop = null;
  (function check() {
    if (window.Chart) {
      stop = run(window.Chart);
      return;
    }
    if (tries++ < 200) timer = setTimeout(check, 50);
  })();
  return () => {
    clearTimeout(timer);
    if (stop) stop();
  };
}`;

function chartSpec(s: ChartState, cls: string): ElementSpec {
  const cfg = JSON.stringify(chartConfig(s)).replace(/</g, "\\u003c");
  const height = clamp(s.height, 160, 640);
  const label = s.title || "Chart";
  const summary = chartSummary(s);
  const css = `.${cls} {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
}
.${cls}__title {
  margin: 0 0 12px;
  font-weight: 600;
  color: ${col(s.titleColor, "#0f172a")};
}
.${cls}__box {
  position: relative;
  height: ${height}px;
}
.${cls}__canvas {
  display: block;
  max-width: 100%;
}
.${cls}__sr {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}
`;
  const markup = h(
    "div",
    { class: cls },
    !!s.title && h("p", { class: `${cls}__title` }, s.title),
    h("div", { class: `${cls}__box` }, h("canvas", { class: `${cls}__canvas`, role: "img", "aria-label": label })),
    h("p", { class: `${cls}__sr` }, summary),
  );
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/{/g, "&#123;").replace(/}/g, "&#125;");
  const ng = (t: string) => esc(t).replace(/@/g, "&#64;");
  const shell = (canvasAttr: string, cn: "class" | "className", e: (t: string) => string) => `<div ${cn}="${cls}">${s.title ? `\n  <p ${cn}="${cls}__title">${e(s.title)}</p>` : ""}
  <div ${cn}="${cls}__box">
    <canvas ${canvasAttr} ${cn}="${cls}__canvas" role="img" aria-label="${e(label)}"></canvas>
  </div>
  <p ${cn}="${cls}__sr">${e(summary)}</p>
</div>`;
  const draw = `(Chart) => {
    const chart = new Chart(canvas, JSON.parse(JSON.stringify(CONFIG)));
    return () => chart.destroy();
  }`;

  return {
    css,
    html: {
      body: renderHtml(markup),
      script: `// Chart: tunggu Chart.js (CDN) lalu gambar grafik
(() => {
  const CONFIG = ${cfg};
  ${WAIT_FN.replace(/\n/g, "\n  ")}
  document.querySelectorAll(".${cls}__canvas").forEach((canvas) => {
    whenChartReady((Chart) => {
      const old = Chart.getChart(canvas);
      if (old) old.destroy();
      new Chart(canvas, JSON.parse(JSON.stringify(CONFIG)));
    });
  });
})();`,
    },
    react: {
      imports: `import { useEffect, useRef } from "react";`,
      pre: `// Butuh Chart.js dari CDN (lihat LIBRARIES.md).
const CONFIG = ${cfg};
${WAIT_FN}

const canvasRef = useRef(null);

useEffect(() => {
  const canvas = canvasRef.current;
  if (!canvas) return undefined;
  return whenChartReady(${draw.replace(/\n {2}/g, "\n")});
}, []);`,
      jsx: shell("ref={canvasRef}", "className", esc),
    },
    vue: {
      script: `import { ref, onMounted, onBeforeUnmount } from "vue";

// Butuh Chart.js dari CDN (lihat LIBRARIES.md).
const CONFIG = ${cfg};
${WAIT_FN}

const canvasEl = ref(null);
let stop = null;

onMounted(() => {
  const canvas = canvasEl.value;
  stop = whenChartReady(${draw.replace(/\n {2}/g, "\n  ")});
});
onBeforeUnmount(() => stop && stop());`,
      template: shell(`ref="canvasEl"`, "class", esc),
    },
    svelte: {
      script: `import { onMount } from "svelte";

// Butuh Chart.js dari CDN (lihat LIBRARIES.md).
const CONFIG = ${cfg};
${WAIT_FN}

let canvas;

onMount(() =>
  whenChartReady(${draw.replace(/\n {2}/g, "\n  ")}),
);`,
      markup: shell("bind:this={canvas}", "class", esc),
    },
    angular: {
      coreImports: ["AfterViewInit", "ElementRef", "OnDestroy", "ViewChild"],
      implementsList: ["AfterViewInit", "OnDestroy"],
      classBody: `// Butuh Chart.js dari CDN (lihat LIBRARIES.md).
@ViewChild('chartCanvas') canvas?: ElementRef<HTMLCanvasElement>;
private readonly config = ${cfg};
private timer: ReturnType<typeof setTimeout> | null = null;
private chart: { destroy(): void } | null = null;

ngAfterViewInit(): void {
  this.draw(0);
}

ngOnDestroy(): void {
  if (this.timer) clearTimeout(this.timer);
  this.chart?.destroy();
}

private draw(tries: number): void {
  const Chart = (window as unknown as { Chart?: new (el: HTMLCanvasElement, cfg: unknown) => { destroy(): void } }).Chart;
  if (!Chart || !this.canvas) {
    if (tries < 200) this.timer = setTimeout(() => this.draw(tries + 1), 50);
    return;
  }
  this.chart = new Chart(this.canvas.nativeElement, JSON.parse(JSON.stringify(this.config)));
}`,
      template: shell("#chartCanvas", "class", ng),
    },
  };
}

export const chartElement = defineElement<ChartState>({
  type: "chart",
  label: "Chart",
  group: "Data",
  componentName: "Chart",
  defaultClassName: "custom-chart",
  defaults: DEFAULT_STATE,
  libraries: ["chartjs"],
  spec: (s, cls) => chartSpec(s, cls),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: BarChart3,
        content: (
          <>
            <SelectField {...p} k="chartType" label={tr("type")} options={CHART_TYPES.map((v) => tOption(v, `el.x.chart.types.${v}`))} />
            <TextField {...p} k="title" label={i18n.t("el.f.title")} />
            <TextField {...p} k="series" label={tr("series")} hint={tr("seriesHint")} />
            <LinesField {...p} k="rows" label={tr("rows")} hint={tr("rowsHint")} rows={7} />
            <ToggleField {...p} k="showLegend" label={tr("showLegend")} />
            <ToggleField {...p} k="beginAtZero" label={tr("beginAtZero")} />
            <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">{tr("cdnNote")}</p>
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="color1" label={tr("color1")} />
            <ColorField {...p} k="color2" label={tr("color2")} />
            <ColorField {...p} k="titleColor" label={i18n.t("el.f.titleColor")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <NumberField {...p} k="height" label={i18n.t("el.f.height")} min={160} max={640} suffix="px" />
          </>
        ),
      },
    ];
  },
});
