import { Clock, Palette } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, NumberField, TextField, ToggleField } from "../../ui/fields";
import { Field } from "../../helpers/SmallUIHelpers";
import { defineElement, type ElementSpec } from "../../helpers/elementDefinition";
import { h, renderHtml } from "../../helpers/markup";
import { safeColor } from "../../helpers/background";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* Countdown (PREMIUM) — hitung mundur ke tanggal tertentu.             */
/* Waktu dihitung di peramban pengunjung (zona waktu lokal). Timer      */
/* 1 detik selalu dibersihkan saat komponen dilepas.                    */
/* ================================================================== */

export interface CountdownState {
  title: string;
  /** "YYYY-MM-DDTHH:mm" (waktu lokal pengunjung). */
  target: string;
  finishedText: string;
  showDays: boolean;
  boxColor: string;
  numberColor: string;
  labelColor: string;
  titleColor: string;
  radius: number;
}

const DEFAULT_STATE: CountdownState = {
  title: "Promo berakhir dalam",
  target: "2026-12-31T23:59",
  finishedText: "Promo sudah berakhir.",
  showDays: true,
  boxColor: "#0f172a",
  numberColor: "#ffffff",
  labelColor: "#94a3b8",
  titleColor: "#0f172a",
  radius: 12,
};

const TARGET_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const safeTarget = (t: string) => (TARGET_RE.test(t) ? t : DEFAULT_STATE.target);

const UNITS = [
  { key: "d", label: "Hari" },
  { key: "h", label: "Jam" },
  { key: "m", label: "Menit" },
  { key: "s", label: "Detik" },
] as const;

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));
const col = (c: string, d: string) => safeColor(c) ?? d;

/** Hitung sisa waktu (dipakai di semua framework, ditulis sebagai JS biasa). */
const PARTS_FN = `function countdownParts(target, now) {
  const ms = Math.max(0, target - now);
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  };
}`;

function countdownSpec(s: CountdownState, cls: string): ElementSpec {
  const target = safeTarget(s.target);
  const units = UNITS.filter((u) => s.showDays || u.key !== "d");
  const T = `new Date(${JSON.stringify(target)}).getTime()`;
  const css = `.${cls} {
  box-sizing: border-box;
  text-align: center;
}
.${cls}__title {
  margin: 0 0 12px;
  font-weight: 600;
  color: ${col(s.titleColor, "#0f172a")};
}
.${cls}__units {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}
.${cls}__unit {
  min-width: 72px;
  padding: 12px 10px;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  background: ${col(s.boxColor, "#0f172a")};
}
.${cls}__num {
  display: block;
  font-size: 32px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${col(s.numberColor, "#ffffff")};
}
.${cls}__label {
  display: block;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${col(s.labelColor, "#94a3b8")};
}
.${cls}__done {
  margin: 12px 0 0;
  font-weight: 600;
  color: ${col(s.titleColor, "#0f172a")};
}
`;
  const markup = h(
    "div",
    { class: cls, role: "timer", "aria-live": "off" },
    !!s.title && h("p", { class: `${cls}__title` }, s.title),
    h(
      "div",
      { class: `${cls}__units` },
      units.map((u) =>
        h("div", { class: `${cls}__unit` }, h("span", { class: `${cls}__num`, "data-unit": u.key }, "00"), h("span", { class: `${cls}__label` }, u.label)),
      ),
    ),
    h("p", { class: `${cls}__done`, hidden: true }, s.finishedText),
  );
  const title = (wrap: (t: string) => string) => (s.title ? `\n  <p class="${cls}__title">${wrap(s.title)}</p>` : "");
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/{/g, "&#123;").replace(/}/g, "&#125;");
  const unitData = JSON.stringify(units.map((u) => ({ key: u.key, label: u.label })));

  return {
    css,
    html: {
      body: renderHtml(markup),
      script: `// Countdown: perbarui tiap detik, berhenti saat selesai atau elemen dilepas
${PARTS_FN}
document.querySelectorAll(".${cls}").forEach((root) => {
  const target = ${T};
  const pad = (n) => String(n).padStart(2, "0");
  function tick() {
    const p = countdownParts(target, Date.now());
    root.querySelectorAll("[data-unit]").forEach((el) => {
      el.textContent = pad(p[el.getAttribute("data-unit")]);
    });
    const done = root.querySelector(".${cls}__done");
    if (done) done.hidden = !p.done;
    return p.done;
  }
  if (tick()) return;
  const timer = setInterval(() => {
    if (!root.isConnected || tick()) clearInterval(timer);
  }, 1000);
});`,
    },
    react: {
      imports: `import { useEffect, useState } from "react";`,
      pre: `${PARTS_FN}

const TARGET = ${T};
const UNITS = ${unitData};
const pad = (n) => String(n).padStart(2, "0");

const [now, setNow] = useState(() => Date.now());
const parts = countdownParts(TARGET, now);

useEffect(() => {
  if (parts.done) return undefined;
  const timer = setInterval(() => setNow(Date.now()), 1000);
  return () => clearInterval(timer);
}, [parts.done]);`,
      jsx: `<div className="${cls}" role="timer" aria-live="off">${s.title ? `\n  <p className="${cls}__title">${esc(s.title)}</p>` : ""}
  <div className="${cls}__units">
    {UNITS.map((u) => (
      <div key={u.key} className="${cls}__unit">
        <span className="${cls}__num">{pad(parts[u.key])}</span>
        <span className="${cls}__label">{u.label}</span>
      </div>
    ))}
  </div>
  {parts.done && <p className="${cls}__done">${esc(s.finishedText)}</p>}
</div>`,
    },
    vue: {
      script: `import { ref, computed, onMounted, onBeforeUnmount } from "vue";

${PARTS_FN}

const TARGET = ${T};
const UNITS = ${unitData};
const pad = (n) => String(n).padStart(2, "0");

const now = ref(Date.now());
const parts = computed(() => countdownParts(TARGET, now.value));
let timer = null;

onMounted(() => {
  timer = setInterval(() => {
    now.value = Date.now();
    if (parts.value.done) clearInterval(timer);
  }, 1000);
});
onBeforeUnmount(() => clearInterval(timer));`,
      template: `<div class="${cls}" role="timer" aria-live="off">${title((t) => esc(t))}
  <div class="${cls}__units">
    <div v-for="u in UNITS" :key="u.key" class="${cls}__unit">
      <span class="${cls}__num">{{ pad(parts[u.key]) }}</span>
      <span class="${cls}__label">{{ u.label }}</span>
    </div>
  </div>
  <p v-if="parts.done" class="${cls}__done">${esc(s.finishedText)}</p>
</div>`,
    },
    svelte: {
      script: `import { onMount, onDestroy } from "svelte";

${PARTS_FN}

const TARGET = ${T};
const UNITS = ${unitData};
const pad = (n) => String(n).padStart(2, "0");

let now = Date.now();
let timer = null;
$: parts = countdownParts(TARGET, now);

onMount(() => {
  timer = setInterval(() => {
    now = Date.now();
    if (countdownParts(TARGET, now).done) clearInterval(timer);
  }, 1000);
});
onDestroy(() => clearInterval(timer));`,
      markup: `<div class="${cls}" role="timer" aria-live="off">${title((t) => esc(t))}
  <div class="${cls}__units">
    {#each UNITS as u (u.key)}
      <div class="${cls}__unit">
        <span class="${cls}__num">{pad(parts[u.key])}</span>
        <span class="${cls}__label">{u.label}</span>
      </div>
    {/each}
  </div>
  {#if parts.done}
    <p class="${cls}__done">${esc(s.finishedText)}</p>
  {/if}
</div>`,
    },
    angular: {
      coreImports: ["OnDestroy", "OnInit"],
      implementsList: ["OnInit", "OnDestroy"],
      classBody: `readonly target = ${T};
readonly units: { key: 'd' | 'h' | 'm' | 's'; label: string }[] = ${unitData.replace(/"/g, "'")};
parts = this.calc(Date.now());
private timer: ReturnType<typeof setInterval> | null = null;

ngOnInit(): void {
  if (this.parts.done) return;
  this.timer = setInterval(() => {
    this.parts = this.calc(Date.now());
    if (this.parts.done && this.timer) clearInterval(this.timer);
  }, 1000);
}

ngOnDestroy(): void {
  if (this.timer) clearInterval(this.timer);
}

pad(n: number): string {
  return String(n).padStart(2, '0');
}

private calc(now: number) {
  const ms = Math.max(0, this.target - now);
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor(ms / 3600000) % 24,
    m: Math.floor(ms / 60000) % 60,
    s: Math.floor(ms / 1000) % 60,
    done: ms === 0,
  };
}`,
      template: `<div class="${cls}" role="timer" aria-live="off">${title((t) => esc(t).replace(/@/g, "&#64;"))}
  <div class="${cls}__units">
    @for (u of units; track u.key) {
      <div class="${cls}__unit">
        <span class="${cls}__num">{{ pad(parts[u.key]) }}</span>
        <span class="${cls}__label">{{ u.label }}</span>
      </div>
    }
  </div>
  @if (parts.done) {
    <p class="${cls}__done">${esc(s.finishedText).replace(/@/g, "&#64;")}</p>
  }
</div>`,
    },
  };
}

export const countdownElement = defineElement<CountdownState>({
  type: "countdown",
  label: "Countdown",
  group: "Premium",
  premium: true,
  componentName: "Countdown",
  defaultClassName: "custom-countdown",
  defaults: DEFAULT_STATE,
  spec: (s, cls) => countdownSpec(s, cls),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Clock,
        content: (
          <>
            <TextField {...p} k="title" label={i18n.t("el.f.title")} />
            <Field label={i18n.t("el.f.targetDateTime")} hint={i18n.t("el.f.visitorLocalTime")}>
              <input
                type="datetime-local"
                value={safeTarget(s.target)}
                onChange={(e) => TARGET_RE.test(e.target.value) && update("target", e.target.value)}
                className="w-full rounded border border-gray-300 bg-white px-2.5 py-1.5 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
              />
            </Field>
            <TextField {...p} k="finishedText" label={i18n.t("el.f.finishedText")} />
            <ToggleField {...p} k="showDays" label={i18n.t("el.f.showDays")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="boxColor" label={i18n.t("el.f.boxBg")} />
            <ColorField {...p} k="numberColor" label={i18n.t("el.f.numberColor")} />
            <ColorField {...p} k="labelColor" label={i18n.t("el.f.labelColor")} />
            <ColorField {...p} k="titleColor" label={i18n.t("el.f.titleColor")} />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={40} suffix="px" />
          </>
        ),
      },
    ];
  },
});
