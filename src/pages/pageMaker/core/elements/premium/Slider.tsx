import { GalleryHorizontal, Palette, Timer } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import ItemListEditor from "../../ui/ItemListEditor";
import { ColorField, NumberField, ToggleField, Show } from "../../ui/fields";
import { defineElement, type ElementSpec } from "../../helpers/elementDefinition";
import { h, renderHtml } from "../../helpers/markup";
import { safeColor } from "../../helpers/background";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* Slider (PREMIUM): a carousel with arrows, dots, and autoplay.        */
/* Interactive: framework-specific code (index state + a timer that is  */
/* always cleared when the component unmounts).                        */
/* ================================================================== */

interface SlideData extends Record<string, string> {
  title: string;
  text: string;
  bg: string;
}

export interface SliderState {
  slides: SlideData[];
  height: number;
  radius: number;
  textColor: string;
  accentColor: string;
  autoplay: boolean;
  interval: number;
  showArrows: boolean;
  showDots: boolean;
}

const DEFAULT_STATE: SliderState = {
  slides: [
    { title: "Rilis terbaru", text: "Bangun halaman lebih cepat dengan Page Maker.", bg: "#1d4ed8" },
    { title: "Desain fleksibel", text: "Section, Row, dan elemen yang bisa diatur bebas.", bg: "#7c3aed" },
    { title: "Kode siap pakai", text: "Ekspor ke HTML, React, Vue, Svelte, dan Angular.", bg: "#0f766e" },
  ],
  height: 320,
  radius: 12,
  textColor: "#ffffff",
  accentColor: "#ffffff",
  autoplay: true,
  interval: 5,
  showArrows: true,
  showDots: true,
};

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));

/** JSON that is safe to embed in a <script>. */
const jsData = (slides: SlideData[]) =>
  JSON.stringify(slides.map((s) => ({ title: s.title, text: s.text })), null, 2).replace(/</g, "\\u003c");

function sliderCss(s: SliderState, cls: string): string {
  const bgRules = s.slides
    .map((sl, i) => `.${cls}__slide:nth-child(${i + 1}) {\n  background: ${safeColor(sl.bg) ?? "#1d4ed8"};\n}`)
    .join("\n");
  return `.${cls} {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: ${clamp(s.height, 120, 900)}px;
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 64)}px;
}
.${cls}__track {
  display: flex;
  height: 100%;
  transition: transform 0.5s ease;
}
.${cls}__slide {
  box-sizing: border-box;
  flex: 0 0 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 64px;
  text-align: center;
  color: ${safeColor(s.textColor) ?? "#ffffff"};
}
${bgRules}
.${cls}__title {
  margin: 0 0 8px;
  font-size: 28px;
  font-weight: 700;
}
.${cls}__text {
  margin: 0;
  opacity: 0.9;
}
.${cls}__nav {
  position: absolute;
  top: 50%;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.35);
  color: #ffffff;
  font-size: 22px;
  line-height: 1;
  cursor: pointer;
  transform: translateY(-50%);
}
.${cls}__nav:focus-visible,
.${cls}__dot:focus-visible {
  outline: 2px solid ${safeColor(s.accentColor) ?? "#ffffff"};
  outline-offset: 2px;
}
.${cls}__prev {
  left: 12px;
}
.${cls}__next {
  right: 12px;
}
.${cls}__dots {
  position: absolute;
  right: 0;
  bottom: 14px;
  left: 0;
  display: flex;
  justify-content: center;
  gap: 8px;
}
.${cls}__dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.${cls}__dot[aria-current="true"] {
  background: ${safeColor(s.accentColor) ?? "#ffffff"};
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__track {
    transition: none;
  }
}
`;
}

function staticMarkup(s: SliderState, cls: string) {
  const n = s.slides.length;
  return h(
    "div",
    { class: cls, role: "region", "aria-roledescription": "carousel", "aria-label": "Slider" },
    h(
      "div",
      { class: `${cls}__track` },
      s.slides.map((sl, i) =>
        h(
          "div",
          { class: `${cls}__slide`, role: "group", "aria-roledescription": "slide", "aria-label": `${i + 1} dari ${n}` },
          h("h3", { class: `${cls}__title` }, sl.title),
          h("p", { class: `${cls}__text` }, sl.text),
        ),
      ),
    ),
    s.showArrows && h("button", { type: "button", class: `${cls}__nav ${cls}__prev`, "aria-label": "Slide sebelumnya" }, "‹"),
    s.showArrows && h("button", { type: "button", class: `${cls}__nav ${cls}__next`, "aria-label": "Slide berikutnya" }, "›"),
    s.showDots &&
      h(
        "div",
        { class: `${cls}__dots` },
        s.slides.map((_, i) =>
          h("button", { type: "button", class: `${cls}__dot`, "aria-label": `Ke slide ${i + 1}`, "aria-current": String(i === 0) }),
        ),
      ),
  );
}

function sliderSpec(s: SliderState, cls: string): ElementSpec {
  const data = jsData(s.slides);
  const ms = s.autoplay ? Math.round(clamp(s.interval, 1, 60) * 1000) : 0;
  const arrowsJsx = s.showArrows
    ? `
  <button type="button" className="${cls}__nav ${cls}__prev" aria-label="Slide sebelumnya" onClick={() => go(index - 1)}>‹</button>
  <button type="button" className="${cls}__nav ${cls}__next" aria-label="Slide berikutnya" onClick={() => go(index + 1)}>›</button>`
    : "";
  const dotsJsx = s.showDots
    ? `
  <div className="${cls}__dots">
    {slides.map((_, i) => (
      <button key={i} type="button" className="${cls}__dot" aria-label={\`Ke slide \${i + 1}\`} aria-current={String(i === index)} onClick={() => go(i)} />
    ))}
  </div>`
    : "";
  const arrowsVue = s.showArrows
    ? `
  <button type="button" class="${cls}__nav ${cls}__prev" aria-label="Slide sebelumnya" @click="go(index - 1)">‹</button>
  <button type="button" class="${cls}__nav ${cls}__next" aria-label="Slide berikutnya" @click="go(index + 1)">›</button>`
    : "";
  const dotsVue = s.showDots
    ? `
  <div class="${cls}__dots">
    <button v-for="(slide, i) in slides" :key="i" type="button" class="${cls}__dot" :aria-label="'Ke slide ' + (i + 1)" :aria-current="String(i === index)" @click="go(i)"></button>
  </div>`
    : "";
  const arrowsSvelte = s.showArrows
    ? `
  <button type="button" class="${cls}__nav ${cls}__prev" aria-label="Slide sebelumnya" on:click={() => go(index - 1)}>‹</button>
  <button type="button" class="${cls}__nav ${cls}__next" aria-label="Slide berikutnya" on:click={() => go(index + 1)}>›</button>`
    : "";
  const dotsSvelte = s.showDots
    ? `
  <div class="${cls}__dots">
    {#each slides as slide, i}
      <button type="button" class="${cls}__dot" aria-label="Ke slide {i + 1}" aria-current={String(i === index)} on:click={() => go(i)}></button>
    {/each}
  </div>`
    : "";
  const arrowsNg = s.showArrows
    ? `
  <button type="button" class="${cls}__nav ${cls}__prev" aria-label="Slide sebelumnya" (click)="go(index - 1)">‹</button>
  <button type="button" class="${cls}__nav ${cls}__next" aria-label="Slide berikutnya" (click)="go(index + 1)">›</button>`
    : "";
  const dotsNg = s.showDots
    ? `
  <div class="${cls}__dots">
    @for (slide of slides; track $index; let i = $index) {
      <button type="button" class="${cls}__dot" [attr.aria-label]="'Ke slide ' + (i + 1)" [attr.aria-current]="i === index" (click)="go(i)"></button>
    }
  </div>`
    : "";

  return {
    css: sliderCss(s, cls),
    html: {
      body: renderHtml(staticMarkup(s, cls)),
      script: `// Slider: panah, titik, dan autoplay (berhenti sendiri bila elemen dilepas dari halaman)
document.querySelectorAll(".${cls}").forEach((root) => {
  const AUTOPLAY_MS = ${ms};
  const track = root.querySelector(".${cls}__track");
  const count = track.children.length;
  const dots = Array.from(root.querySelectorAll(".${cls}__dot"));
  let index = 0;
  let timer = null;

  function go(i) {
    index = (i + count) % count;
    track.style.transform = "translateX(-" + index * 100 + "%)";
    dots.forEach((d, j) => d.setAttribute("aria-current", String(j === index)));
    restart();
  }
  function restart() {
    clearInterval(timer);
    if (!AUTOPLAY_MS || count < 2) return;
    timer = setInterval(() => {
      if (!root.isConnected) return clearInterval(timer);
      go(index + 1);
    }, AUTOPLAY_MS);
  }

  const prev = root.querySelector(".${cls}__prev");
  const next = root.querySelector(".${cls}__next");
  if (prev) prev.addEventListener("click", () => go(index - 1));
  if (next) next.addEventListener("click", () => go(index + 1));
  dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
  restart();
});`,
    },
    react: {
      imports: `import { useEffect, useState } from "react";`,
      pre: `const slides = ${data};
const AUTOPLAY_MS = ${ms};

const [index, setIndex] = useState(0);
const [tick, setTick] = useState(0);

function go(i) {
  setIndex((i + slides.length) % slides.length);
  setTick((t) => t + 1); // restart the autoplay timer
}

useEffect(() => {
  if (!AUTOPLAY_MS || slides.length < 2) return undefined;
  const timer = setInterval(() => setIndex((i) => (i + 1) % slides.length), AUTOPLAY_MS);
  return () => clearInterval(timer);
}, [tick]);`,
      jsx: `<div className="${cls}" role="region" aria-roledescription="carousel" aria-label="Slider">
  <div className="${cls}__track" style={{ transform: \`translateX(-\${index * 100}%)\` }}>
    {slides.map((slide, i) => (
      <div key={i} className="${cls}__slide" role="group" aria-roledescription="slide" aria-label={\`\${i + 1} dari \${slides.length}\`}>
        <h3 className="${cls}__title">{slide.title}</h3>
        <p className="${cls}__text">{slide.text}</p>
      </div>
    ))}
  </div>${arrowsJsx}${dotsJsx}
</div>`,
    },
    vue: {
      script: `import { ref, onMounted, onBeforeUnmount } from "vue";

const slides = ${data};
const AUTOPLAY_MS = ${ms};

const index = ref(0);
let timer = null;

function restart() {
  clearInterval(timer);
  if (!AUTOPLAY_MS || slides.length < 2) return;
  timer = setInterval(() => {
    index.value = (index.value + 1) % slides.length;
  }, AUTOPLAY_MS);
}
function go(i) {
  index.value = (i + slides.length) % slides.length;
  restart();
}

onMounted(restart);
onBeforeUnmount(() => clearInterval(timer));`,
      template: `<div class="${cls}" role="region" aria-roledescription="carousel" aria-label="Slider">
  <div class="${cls}__track" :style="{ transform: 'translateX(-' + index * 100 + '%)' }">
    <div v-for="(slide, i) in slides" :key="i" class="${cls}__slide" role="group" aria-roledescription="slide" :aria-label="(i + 1) + ' dari ' + slides.length">
      <h3 class="${cls}__title">{{ slide.title }}</h3>
      <p class="${cls}__text">{{ slide.text }}</p>
    </div>
  </div>${arrowsVue}${dotsVue}
</div>`,
    },
    svelte: {
      script: `import { onMount, onDestroy } from "svelte";

const slides = ${data};
const AUTOPLAY_MS = ${ms};

let index = 0;
let timer = null;

function restart() {
  clearInterval(timer);
  if (!AUTOPLAY_MS || slides.length < 2) return;
  timer = setInterval(() => {
    index = (index + 1) % slides.length;
  }, AUTOPLAY_MS);
}
function go(i) {
  index = (i + slides.length) % slides.length;
  restart();
}

onMount(restart);
onDestroy(() => clearInterval(timer));`,
      markup: `<div class="${cls}" role="region" aria-roledescription="carousel" aria-label="Slider">
  <div class="${cls}__track" style="transform: translateX(-{index * 100}%)">
    {#each slides as slide, i}
      <div class="${cls}__slide" role="group" aria-roledescription="slide" aria-label="{i + 1} dari {slides.length}">
        <h3 class="${cls}__title">{slide.title}</h3>
        <p class="${cls}__text">{slide.text}</p>
      </div>
    {/each}
  </div>${arrowsSvelte}${dotsSvelte}
</div>`,
    },
    angular: {
      coreImports: ["OnDestroy", "OnInit"],
      implementsList: ["OnInit", "OnDestroy"],
      classBody: `slides = ${data};
readonly autoplayMs = ${ms};

index = 0;
private timer: ReturnType<typeof setInterval> | null = null;

ngOnInit(): void {
  this.restart();
}

ngOnDestroy(): void {
  if (this.timer) clearInterval(this.timer);
}

go(i: number): void {
  this.index = (i + this.slides.length) % this.slides.length;
  this.restart();
}

private restart(): void {
  if (this.timer) clearInterval(this.timer);
  this.timer = null;
  if (!this.autoplayMs || this.slides.length < 2) return;
  this.timer = setInterval(() => {
    this.index = (this.index + 1) % this.slides.length;
  }, this.autoplayMs);
}`,
      template: `<div class="${cls}" role="region" aria-roledescription="carousel" aria-label="Slider">
  <div class="${cls}__track" [style.transform]="'translateX(-' + index * 100 + '%)'">
    @for (slide of slides; track $index; let i = $index) {
      <div class="${cls}__slide" role="group" aria-roledescription="slide" [attr.aria-label]="(i + 1) + ' dari ' + slides.length">
        <h3 class="${cls}__title">{{ slide.title }}</h3>
        <p class="${cls}__text">{{ slide.text }}</p>
      </div>
    }
  </div>${arrowsNg}${dotsNg}
</div>`,
    },
  };
}

export const sliderElement = defineElement<SliderState>({
  type: "slider",
  label: "Slider",
  group: "Premium",
  premium: true,
  componentName: "Slider",
  defaultClassName: "custom-slider",
  defaults: DEFAULT_STATE,
  spec: (s, cls) => sliderSpec(s, cls),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "slides",
        label: i18n.t("el.f.slide"),
        icon: GalleryHorizontal,
        content: (
          <ItemListEditor
            items={s.slides}
            onChange={(v) => update("slides", v)}
            itemLabel={i18n.t("el.f.slide")}
            max={10}
            fields={[
              { key: "title", label: i18n.t("el.f.title") },
              { key: "text", label: i18n.t("el.f.text"), multiline: true },
              { key: "bg", label: i18n.t("el.f.slideBgHex"), placeholder: "#1d4ed8" },
            ]}
            newItem={(i) => ({ title: `Slide ${i + 1}`, text: "Teks singkat slide.", bg: "#334155" })}
          />
        ),
      },
      {
        id: "behavior",
        label: i18n.t("el.f.behavior"),
        icon: Timer,
        content: (
          <>
            <ToggleField {...p} k="autoplay" label={i18n.t("el.f.autoplay")} />
            <Show when={s.autoplay}>
              <NumberField {...p} k="interval" label={i18n.t("el.f.interval")} min={1} max={60} suffix={i18n.t("el.f.seconds")} />
            </Show>
            <ToggleField {...p} k="showArrows" label={i18n.t("el.f.showArrows")} />
            <ToggleField {...p} k="showDots" label={i18n.t("el.f.showDots")} />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="height" label={i18n.t("el.f.height")} min={120} max={900} suffix="px" />
            <NumberField {...p} k="radius" label={i18n.t("el.f.radius")} min={0} max={64} suffix="px" />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="accentColor" label={i18n.t("el.f.activeDotColor")} />
          </>
        ),
      },
    ];
  },
});
