import { Box, Gauge, ImageIcon, Palette, Ruler } from "lucide-react";
import type { PanelSection } from "../../ui/PanelStyling";
import { ColorField, LinesField, NumberField, SelectField, TextField, ToggleField, tOption, ImageField } from "../../ui/fields";
import { defineElement, type ElementDefinition, type ElementSpec } from "../../helpers/elementDefinition";
import { h, renderHtml } from "../../helpers/markup";
import { safeColor } from "../../helpers/background";
import { safeUrl } from "../../helpers/generatorCss";
import { isVarRef } from "../../helpers/cssVars";
import type { GeneratedFile } from "../../ui/CodeExportPanel";
import type { Framework } from "../../helpers/generatorCss";
import { OWD3D_MODULE, OWD3D_RUNTIME } from "./runtime";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* 5 built-in 3D elements (v9, all Premium)                             */
/*                                                                    */
/*   three-product    Spinning product (bottle/can/jar/glass or .glb)*/
/*   three-shape      Bentuk geometris interaktif (ikut kursor)          */
/*   three-globe      Dot globe + location markers + arcs                 */
/*   three-particles  3D particle background (wave/galaxy/sphere)         */
/*   card-3d          3D tilt card (CSS only, no WebGL)                   */
/*                                                                    */
/* All use the same runtime (./runtime.ts). The markup always contains  */
/* a static image (fallback) that is hidden once WebGL is ready, so      */
/* devices without WebGL / without JavaScript still see something.      */
/* ================================================================== */

type Tri = "global" | "on" | "off";
type Quality = "global" | "low" | "mid" | "high";

interface Common3D {
  height: number;
  mobileHeight: number;
  radius: number;
  background: string;
  quality: Quality;
  autoRotate: Tri;
  interactive: Tri;
  /** 0 = ikut Pengaturan Global. */
  speed: number;
  fallbackUrl: string;
  alt: string;
}

const COMMON: Common3D = {
  height: 420,
  mobileHeight: 300,
  radius: 16,
  background: "transparent",
  quality: "global",
  autoRotate: "global",
  interactive: "global",
  speed: 0,
  fallbackUrl: "",
  alt: "",
};

const tr = (k: string) => i18n.t(`el.x.three.${k}`);
const col = (c: string, d: string) => safeColor(c) ?? d;
/** Color for code (var(--x) stays a reference; the runtime reads it from CSS). */
const colRef = (c: string, d: string) => (isVarRef(c) ? c.trim() : col(c, d));
/** Color for the static image (SVG in <img> cannot read CSS variables). */
const colHex = (c: string, d: string) => (isVarRef(c) ? d : col(c, d));
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(n) ? n : a));
const svgUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/{/g, "&#123;").replace(/}/g, "&#125;");
const ngEsc = (t: string) => esc(t).replace(/@/g, "&#64;");

function commonCfg(s: Common3D) {
  return {
    ...(s.quality !== "global" ? { quality: s.quality } : {}),
    ...(s.autoRotate !== "global" ? { autoRotate: s.autoRotate } : {}),
    ...(s.interactive !== "global" ? { interactive: s.interactive } : {}),
    ...(s.speed > 0 ? { speed: clamp(s.speed, 0.2, 3) } : {}),
  };
}

/**
 * Runtime for script.js (HTML). The owd-shared marker makes compose()
 * write it only once even when the page has several 3D elements.
 */
const sharedRuntime = () => `/* owd-shared:owd3d */\n${OWD3D_RUNTIME}\n/* /owd-shared:owd3d */`;

/** Runtime file for framework projects (shared by every 3D element on the page). */
export function threeRuntimeFiles(fw: Framework): GeneratedFile[] {
  if (fw === "html" || fw === "blade") return [];
  if (fw === "angular") return [{ name: "owd-3d.ts", lang: "ts", content: `// @ts-nocheck — runtime elemen 3D (JavaScript biasa).\n${OWD3D_MODULE}` }];
  return [{ name: "owd3d.js", lang: "js", content: OWD3D_MODULE }];
}

/* ------------------------------------------------------------------ */
/* Spec bersama: shell markup + kode per framework                      */
/* ------------------------------------------------------------------ */

interface ShellOpts {
  kind: "product" | "shape" | "globe" | "particles";
  cls: string;
  s: Common3D;
  cfg: Record<string, unknown>;
  poster: string;
  label: string;
  fit: "contain" | "cover";
}

function webglSpec({ kind, cls, s, cfg, poster, label, fit }: ShellOpts): ElementSpec {
  const json = JSON.stringify({ ...cfg, ...commonCfg(s) }).replace(/</g, "\\u003c");
  const img = safeUrl(s.fallbackUrl, "") || poster;
  const height = clamp(s.height, 160, 1200);
  const mobile = clamp(s.mobileHeight, 140, 1000);
  const css = `.${cls} {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: ${height}px;
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 64)}px;
  background: ${col(s.background, "transparent")};
}
.${cls}__stage {
  position: absolute;
  inset: 0;
}
.${cls}__fallback {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: ${fit};
  pointer-events: none;
  transition: opacity 0.5s ease;
}
.${cls}.is-3d-ready .${cls}__fallback {
  opacity: 0;
}
@media (max-width: 640px) {
  .${cls} {
    height: ${mobile}px;
  }
}
`;
  const markup = h(
    "div",
    { class: cls, role: "img", "aria-label": label },
    h("div", { class: `${cls}__stage owd3d-stage` }),
    h("img", { class: `${cls}__fallback owd3d-fallback`, src: img, alt: "", loading: "lazy", decoding: "async" }),
  );
  const shell = (refAttr: string, cn: "class" | "className", e: (t: string) => string) => `<div ${refAttr} ${cn}="${cls}" role="img" aria-label="${e(label)}">
  <div ${cn}="${cls}__stage owd3d-stage"></div>
  <img ${cn}="${cls}__fallback owd3d-fallback" src="${img}" alt="" loading="lazy" decoding="async"${cn === "className" ? " /" : ""}>
</div>`;
  const k = JSON.stringify(kind);
  return {
    css,
    markup,
    html: {
      body: renderHtml(markup),
      script: `// Elemen 3D (${kind}): Three.js dimuat saat elemen mendekati layar.
${sharedRuntime()}
(function () {
  var CONFIG = ${json};
  document.querySelectorAll(".${cls}").forEach(function (el) {
    OWD3D.mount(el, ${k}, CONFIG);
  });
})();`,
    },
    react: {
      imports: `import { useEffect, useRef } from "react";\nimport { mount3d } from "./owd3d";`,
      pre: `// Three.js dimuat dari CDN saat elemen terlihat (lihat LIBRARIES.md).
const CONFIG = ${json};
const hostRef = useRef(null);

useEffect(() => mount3d(hostRef.current, ${k}, CONFIG), []);`,
      jsx: shell("ref={hostRef}", "className", esc),
    },
    vue: {
      script: `import { ref, onMounted, onBeforeUnmount } from "vue";
import { mount3d } from "./owd3d.js";

// Three.js is loaded from a CDN when the element becomes visible (see LIBRARIES.md).
const CONFIG = ${json};
const hostEl = ref(null);
let destroy3d = null;

onMounted(() => {
  destroy3d = mount3d(hostEl.value, ${k}, CONFIG);
});
onBeforeUnmount(() => destroy3d && destroy3d());`,
      template: shell(`ref="hostEl"`, "class", esc),
    },
    svelte: {
      script: `import { onMount } from "svelte";
import { mount3d } from "./owd3d.js";

// Three.js is loaded from a CDN when the element becomes visible (see LIBRARIES.md).
const CONFIG = ${json};
let host;

onMount(() => mount3d(host, ${k}, CONFIG));`,
      markup: shell("bind:this={host}", "class", esc),
    },
    angular: {
      coreImports: ["AfterViewInit", "ElementRef", "OnDestroy", "ViewChild"],
      implementsList: ["AfterViewInit", "OnDestroy"],
      headerImports: `import { mount3d } from './owd-3d';`,
      classBody: `// Three.js dimuat dari CDN saat elemen terlihat (lihat LIBRARIES.md).
@ViewChild('host3d') host?: ElementRef<HTMLElement>;
private readonly config = ${json};
private destroy3d: (() => void) | null = null;

ngAfterViewInit(): void {
  if (this.host) this.destroy3d = mount3d(this.host.nativeElement, ${k}, this.config);
}

ngOnDestroy(): void {
  if (this.destroy3d) this.destroy3d();
}`,
      template: shell("#host3d", "class", ngEsc),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Shared panel: size, 3D behavior, static image                        */
/* ------------------------------------------------------------------ */

function commonSections<S extends Common3D>(s: S, update: (k: keyof S, v: never) => void): PanelSection[] {
  const p = { s, update: update as never };
  const tri = (k: "autoRotate" | "interactive") => (
    <SelectField {...p} k={k as never} label={tr(k)} options={[tOption("global", "el.x.three.followGlobal"), tOption("on", "el.x.three.on"), tOption("off", "el.x.three.off")] as never} />
  );
  return [
    {
      id: "behavior",
      label: tr("behavior"),
      icon: Gauge,
      content: (
        <>
          <SelectField
            {...p}
            k={"quality" as never}
            label={tr("quality")}
            options={[tOption("global", "el.x.three.followGlobal"), tOption("low", "el.x.three.qLow"), tOption("mid", "el.x.three.qMid"), tOption("high", "el.x.three.qHigh")] as never}
          />
          {tri("autoRotate")}
          {tri("interactive")}
          <NumberField {...p} k={"speed" as never} label={tr("speed")} hint={tr("speedHint")} min={0} max={3} step={0.1} suffix="×" />
        </>
      ),
    },
    {
      id: "size",
      label: tr("size"),
      icon: Ruler,
      content: (
        <>
          <NumberField {...p} k={"height" as never} label={tr("height")} min={160} max={1200} suffix="px" />
          <NumberField {...p} k={"mobileHeight" as never} label={tr("mobileHeight")} min={140} max={1000} suffix="px" />
          <NumberField {...p} k={"radius" as never} label={tr("radius")} min={0} max={64} suffix="px" />
          <ColorField {...p} k={"background" as never} label={tr("background")} />
        </>
      ),
    },
    {
      id: "fallback",
      label: tr("fallback"),
      icon: ImageIcon,
      content: (
        <>
          <TextField {...p} k={"alt" as never} label={tr("alt")} hint={tr("altHint")} />
          <TextField {...p} k={"fallbackUrl" as never} label={tr("fallbackUrl")} hint={tr("fallbackHint")} placeholder="https://..." />
        </>
      ),
    },
  ];
}

/* ------------------------------------------------------------------ */
/* Built-in static images (in-house SVG, license free)                  */
/* ------------------------------------------------------------------ */

function productPoster(body: string, accent: string, model: string): string {
  const shapes: Record<string, string> = {
    bottle: `<path d="M178 60h44v34c0 10 30 22 30 44v188c0 12-8 20-20 20h-64c-12 0-20-8-20-20V138c0-22 30-34 30-44z" fill="url(#b)"/><rect x="180" y="40" width="40" height="26" rx="6" fill="${accent}"/><rect x="148" y="190" width="104" height="80" fill="${accent}" opacity=".9"/>`,
    can: `<rect x="140" y="80" width="120" height="250" rx="18" fill="url(#b)"/><rect x="140" y="160" width="120" height="96" fill="${accent}" opacity=".9"/><ellipse cx="200" cy="84" rx="56" ry="10" fill="#cbd5e1"/>`,
    jar: `<rect x="110" y="190" width="180" height="140" rx="20" fill="url(#b)"/><rect x="104" y="160" width="192" height="40" rx="10" fill="${accent}"/>`,
    cup: `<path d="M130 120h140l-18 200c-1 10-9 16-19 16h-66c-10 0-18-6-19-16z" fill="url(#b)"/><rect x="124" y="108" width="152" height="18" rx="9" fill="${accent}"/>`,
    vase: `<path d="M176 60h48l-6 30c30 26 64 70 64 130 0 58-30 96-54 110h-56c-24-14-54-52-54-110 0-60 34-104 64-130z" fill="url(#b)"/><rect x="128" y="206" width="144" height="10" fill="${accent}"/>`,
    lens: `<rect x="110" y="140" width="200" height="150" rx="10" transform="rotate(-12 210 215)" fill="url(#b)"/><ellipse cx="300" cy="196" rx="38" ry="78" transform="rotate(-12 300 196)" fill="${accent}"/><rect x="170" y="140" width="14" height="150" transform="rotate(-12 210 215)" fill="${accent}" opacity=".7"/>`,
    massing: `<rect x="70" y="300" width="270" height="16" fill="${accent}"/><rect x="90" y="190" width="80" height="110" fill="url(#b)"/><rect x="170" y="240" width="90" height="60" fill="url(#b)" opacity=".85"/><rect x="200" y="120" width="60" height="120" fill="url(#b)"/><rect x="262" y="210" width="60" height="90" fill="url(#b)" opacity=".9"/>`,
    kite: `<path d="M200 50l90 100-90 120-90-120z" fill="url(#b)"/><path d="M200 50l90 100h-90z" fill="${accent}"/><path d="M200 270c-10 30 14 50 0 80" stroke="${accent}" stroke-width="6" fill="none"/>`,
  };
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="b" x1="0" x2="1"><stop offset="0" stop-color="${body}" stop-opacity=".75"/><stop offset=".45" stop-color="${body}"/><stop offset="1" stop-color="#0f172a" stop-opacity=".85"/></linearGradient></defs><ellipse cx="200" cy="350" rx="110" ry="14" fill="#0f172a" opacity=".18"/>${shapes[model] ?? shapes.bottle}</svg>`,
  );
}

function shapePoster(c: string): string {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".35" stop-color="${c}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs><g fill="none" stroke="url(#g)" stroke-width="34" stroke-linecap="round"><ellipse cx="200" cy="200" rx="120" ry="62" transform="rotate(30 200 200)"/><ellipse cx="200" cy="200" rx="120" ry="62" transform="rotate(-30 200 200)"/><ellipse cx="200" cy="200" rx="120" ry="62" transform="rotate(90 200 200)"/></g></svg>`,
  );
}

function globePoster(dot: string, ocean: string, glow: string): string {
  const dots: string[] = [];
  for (let lat = -60; lat <= 60; lat += 15)
    for (let lon = -90; lon <= 90; lon += 12) {
      const x = 200 + 140 * Math.cos((lat * Math.PI) / 180) * Math.sin((lon * Math.PI) / 180);
      const y = 200 - 140 * Math.sin((lat * Math.PI) / 180);
      if ((lat * 7 + lon * 3) % 5 !== 0) dots.push(`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`);
    }
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs><radialGradient id="a"><stop offset=".7" stop-color="${glow}" stop-opacity=".45"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="180" fill="url(#a)"/><circle cx="200" cy="200" r="142" fill="${ocean}"/><g fill="${dot}">${dots.join("")}</g></svg>`,
  );
}

function particlesPoster(a: string, b: string): string {
  const dots: string[] = [];
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < 140; i++) {
    const x = rnd() * 800;
    const y = 200 + Math.sin(x / 70) * 50 + (rnd() - 0.5) * 60;
    dots.push(`<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + rnd() * 2.5).toFixed(1)}" fill="${x < 400 ? a : b}" opacity="${(0.4 + rnd() * 0.6).toFixed(2)}"/>`);
  }
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice">${dots.join("")}</svg>`);
}

/* ------------------------------------------------------------------ */
/* 1. Spinning product                                                  */
/* ------------------------------------------------------------------ */

interface ProductState extends Common3D {
  model: "bottle" | "can" | "jar" | "cup" | "vase" | "lens" | "massing" | "kite";
  finish: "glossy" | "matte" | "metal";
  color: string;
  accent: string;
  glbUrl: string;
}

const PRODUCT_DEFAULTS: ProductState = { ...COMMON, model: "bottle", finish: "glossy", color: "#2563eb", accent: "#f8fafc", glbUrl: "", alt: "Produk 3D berputar" };

/** .glb/.gltf URL: https:// or a path from the site root (data: and other schemes are rejected). */
export const safeModelUrl = (u: string) => {
  const v = String(u ?? "").trim();
  return /^https:\/\/[^\s"'<>]+\.(glb|gltf)(\?[^\s"'<>]*)?$/i.test(v) || /^\/[^/\s"'<>][^\s"'<>]*\.(glb|gltf)(\?[^\s"'<>]*)?$/i.test(v) ? v : "";
};

export const product3dElement = defineElement<ProductState>({
  type: "three-product",
  label: "Produk 3D Berputar",
  group: "3D",
  componentName: "Product3D",
  defaultClassName: "product-3d",
  defaults: PRODUCT_DEFAULTS,
  premium: true,
  uses3dSettings: true,
  libraries: ["three"],
  extraFiles: threeRuntimeFiles,
  spec: (s, cls) =>
    webglSpec({
      kind: "product",
      cls,
      s,
      cfg: { model: s.model, finish: s.finish, color: colRef(s.color, "#2563eb"), accent: colRef(s.accent, "#f8fafc"), ...(safeModelUrl(s.glbUrl) ? { glb: safeModelUrl(s.glbUrl) } : {}) },
      poster: productPoster(colHex(s.color, "#2563eb"), colHex(s.accent, "#f8fafc"), s.model),
      label: s.alt || tr("product.label"),
      fit: "contain",
    }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: tr("model"),
        icon: Box,
        content: (
          <>
            <SelectField {...p} k="model" label={tr("product.model")} options={(["bottle", "can", "jar", "cup", "vase", "lens", "massing", "kite"] as const).map((v) => tOption(v, `el.x.three.product.models.${v}`))} />
            <SelectField {...p} k="finish" label={tr("product.finish")} options={(["glossy", "matte", "metal"] as const).map((v) => tOption(v, `el.x.three.product.finishes.${v}`))} />
            <ColorField {...p} k="color" label={tr("product.color")} />
            <ColorField {...p} k="accent" label={tr("product.accent")} />
            <TextField {...p} k="glbUrl" label={tr("product.glb")} hint={tr("product.glbHint")} placeholder="https://.../model.glb" />
          </>
        ),
      },
      ...commonSections(s, update as never),
    ];
  },
});

/* ------------------------------------------------------------------ */
/* 2. Bentuk geometris interaktif                                       */
/* ------------------------------------------------------------------ */

interface ShapeState extends Common3D {
  shape: "torusKnot" | "icosahedron" | "torus" | "octahedron" | "dodecahedron";
  material: "metal" | "glass" | "matte" | "wire";
  color: string;
  outline: boolean;
  accent: string;
}

const SHAPE_DEFAULTS: ShapeState = { ...COMMON, shape: "torusKnot", material: "metal", color: "#3b68f0", outline: false, accent: "#ffffff", alt: "Bentuk geometris 3D interaktif" };

export const shape3dElement = defineElement<ShapeState>({
  type: "three-shape",
  label: "Bentuk Geometris 3D",
  group: "3D",
  componentName: "Shape3D",
  defaultClassName: "shape-3d",
  defaults: SHAPE_DEFAULTS,
  premium: true,
  uses3dSettings: true,
  libraries: ["three"],
  extraFiles: threeRuntimeFiles,
  spec: (s, cls) =>
    webglSpec({
      kind: "shape",
      cls,
      s,
      cfg: { shape: s.shape, material: s.material, color: colRef(s.color, "#3b68f0"), outline: !!s.outline, accent: colRef(s.accent, "#ffffff") },
      poster: shapePoster(colHex(s.color, "#3b68f0")),
      label: s.alt || tr("shape.label"),
      fit: "contain",
    }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: tr("model"),
        icon: Box,
        content: (
          <>
            <SelectField {...p} k="shape" label={tr("shape.shape")} options={(["torusKnot", "icosahedron", "torus", "octahedron", "dodecahedron"] as const).map((v) => tOption(v, `el.x.three.shape.shapes.${v}`))} />
            <SelectField {...p} k="material" label={tr("shape.material")} options={(["metal", "glass", "matte", "wire"] as const).map((v) => tOption(v, `el.x.three.shape.materials.${v}`))} />
            <ColorField {...p} k="color" label={tr("shape.color")} />
            <ToggleField {...p} k="outline" label={tr("shape.outline")} />
            <ColorField {...p} k="accent" label={tr("shape.accent")} />
          </>
        ),
      },
      ...commonSections(s, update as never),
    ];
  },
});

/* ------------------------------------------------------------------ */
/* 3. Globe interaktif                                                  */
/* ------------------------------------------------------------------ */

interface GlobeState extends Common3D {
  color: string;
  ocean: string;
  glow: string;
  marker: string;
  /** One line per marker: "Name, latitude, longitude". */
  markers: string[];
  arcs: boolean;
  startLon: number;
}

const GLOBE_DEFAULTS: GlobeState = {
  ...COMMON,
  height: 480,
  color: "#60a5fa",
  ocean: "#0b1220",
  glow: "#3b82f6",
  marker: "#f59e0b",
  markers: ["Jakarta, -6.2, 106.8", "Singapura, 1.35, 103.8", "Tokyo, 35.7, 139.7", "Sydney, -33.9, 151.2"],
  arcs: true,
  startLon: 110,
  alt: "Globe 3D interaktif",
};

export function parseMarkers(lines: readonly string[]): { name: string; lat: number; lon: number }[] {
  const out: { name: string; lat: number; lon: number }[] = [];
  for (const l of lines ?? []) {
    const [name, a, b] = String(l).split(",").map((x) => x.trim());
    const lat = Number(a);
    const lon = Number(b);
    if (!name || !Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) continue;
    out.push({ name: name.slice(0, 40), lat: Math.round(lat * 100) / 100, lon: Math.round(lon * 100) / 100 });
    if (out.length >= 24) break;
  }
  return out;
}

export const globe3dElement = defineElement<GlobeState>({
  type: "three-globe",
  label: "Globe 3D",
  group: "3D",
  componentName: "Globe3D",
  defaultClassName: "globe-3d",
  defaults: GLOBE_DEFAULTS,
  premium: true,
  uses3dSettings: true,
  libraries: ["three"],
  extraFiles: threeRuntimeFiles,
  spec: (s, cls) => {
    const markers = parseMarkers(s.markers);
    return webglSpec({
      kind: "globe",
      cls,
      s,
      cfg: { color: colRef(s.color, "#60a5fa"), ocean: colRef(s.ocean, "#0b1220"), glow: colRef(s.glow, "#3b82f6"), marker: colRef(s.marker, "#f59e0b"), markers, arcs: !!s.arcs, startLon: clamp(s.startLon, -180, 180) },
      poster: globePoster(colHex(s.color, "#60a5fa"), colHex(s.ocean, "#0b1220"), colHex(s.glow, "#3b82f6")),
      label: s.alt || `${tr("globe.label")}${markers.length ? `: ${markers.map((m) => m.name).join(", ")}` : ""}`,
      fit: "contain",
    });
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: tr("model"),
        icon: Box,
        content: (
          <>
            <LinesField {...p} k="markers" label={tr("globe.markers")} hint={tr("globe.markersHint")} rows={5} />
            <ToggleField {...p} k="arcs" label={tr("globe.arcs")} />
            <NumberField {...p} k="startLon" label={tr("globe.startLon")} min={-180} max={180} suffix="°" />
          </>
        ),
      },
      {
        id: "colors",
        label: tr("colors"),
        icon: Palette,
        content: (
          <>
            <ColorField {...p} k="color" label={tr("globe.color")} />
            <ColorField {...p} k="ocean" label={tr("globe.ocean")} />
            <ColorField {...p} k="glow" label={tr("globe.glow")} />
            <ColorField {...p} k="marker" label={tr("globe.marker")} />
          </>
        ),
      },
      ...commonSections(s, update as never),
    ];
  },
});

/* ------------------------------------------------------------------ */
/* 4. 3D particle background                                            */
/* ------------------------------------------------------------------ */

interface ParticleState extends Common3D {
  shape: "wave" | "galaxy" | "sphere";
  density: "low" | "normal" | "high";
  color: string;
  accent: string;
  size: number;
  glow: boolean;
}

const PARTICLE_DEFAULTS: ParticleState = { ...COMMON, height: 460, radius: 0, background: "#0b1020", shape: "wave", density: "normal", color: "#60a5fa", accent: "#c084fc", size: 3, glow: true, alt: "Latar partikel 3D" };

export const particles3dElement = defineElement<ParticleState>({
  type: "three-particles",
  label: "Latar Partikel 3D",
  group: "3D",
  componentName: "Particles3D",
  defaultClassName: "particles-3d",
  defaults: PARTICLE_DEFAULTS,
  premium: true,
  uses3dSettings: true,
  libraries: ["three"],
  extraFiles: threeRuntimeFiles,
  spec: (s, cls) =>
    webglSpec({
      kind: "particles",
      cls,
      s,
      cfg: { shape: s.shape, density: s.density, color: colRef(s.color, "#60a5fa"), accent: colRef(s.accent, "#c084fc"), size: clamp(s.size, 1, 8), glow: !!s.glow },
      poster: particlesPoster(colHex(s.color, "#60a5fa"), colHex(s.accent, "#c084fc")),
      label: s.alt || tr("particles.label"),
      fit: "cover",
    }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: tr("model"),
        icon: Box,
        content: (
          <>
            <SelectField {...p} k="shape" label={tr("particles.shape")} options={(["wave", "galaxy", "sphere"] as const).map((v) => tOption(v, `el.x.three.particles.shapes.${v}`))} />
            <SelectField {...p} k="density" label={tr("particles.density")} options={(["low", "normal", "high"] as const).map((v) => tOption(v, `el.x.three.particles.densities.${v}`))} />
            <ColorField {...p} k="color" label={tr("particles.color")} />
            <ColorField {...p} k="accent" label={tr("particles.accent")} />
            <NumberField {...p} k="size" label={tr("particles.size")} min={1} max={8} step={0.5} suffix="px" />
            <ToggleField {...p} k="glow" label={tr("particles.glow")} />
          </>
        ),
      },
      ...commonSections(s, update as never),
    ];
  },
});

/* ------------------------------------------------------------------ */
/* 5. 3D tilt card (CSS + a little JS, no WebGL)                        */
/* ------------------------------------------------------------------ */

interface CardState {
  imageUrl: string;
  alt: string;
  badge: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
  maxTilt: number;
  maxWidth: number;
  radius: number;
  bg: string;
  textColor: string;
  accent: string;
  glare: boolean;
}

const CARD_DEFAULTS: CardState = {
  imageUrl: "",
  alt: "Ilustrasi produk",
  badge: "Baru",
  title: "Kartu 3D Interaktif",
  text: "Gerakkan kursor di atas kartu: lapisan gambar, teks, dan kilau bergerak dengan kedalaman yang berbeda.",
  ctaLabel: "Lihat detail",
  ctaUrl: "#",
  maxTilt: 12,
  maxWidth: 380,
  radius: 20,
  bg: "#0f172a",
  textColor: "#f8fafc",
  accent: "#3b68f0",
  glare: true,
};

function cardArt(accent: string): string {
  return svgUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360"><defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="#7c3aed"/></linearGradient><radialGradient id="b" cx=".3" cy=".3"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="600" height="360" fill="url(#a)"/><circle cx="430" cy="110" r="140" fill="#fff" opacity=".12"/><circle cx="150" cy="300" r="120" fill="#0f172a" opacity=".18"/><g transform="translate(300 185)"><circle r="78" fill="url(#a)" stroke="#fff" stroke-opacity=".5" stroke-width="3"/><circle r="78" fill="url(#b)"/></g></svg>`,
  );
}

export const card3dElement = defineElement<CardState>({
  type: "card-3d",
  label: "Kartu 3D Tilt",
  group: "3D",
  componentName: "Card3D",
  defaultClassName: "card-3d",
  defaults: CARD_DEFAULTS,
  premium: true,
  extraFiles: threeRuntimeFiles,
  spec: (s, cls) => {
    const accent = colRef(s.accent, "#3b68f0");
    const img = safeUrl(s.imageUrl, "") || cardArt(colHex(s.accent, "#3b68f0"));
    const href = safeUrl(s.ctaUrl, "#");
    const json = JSON.stringify({ max: clamp(s.maxTilt, 2, 25) });
    const css = `.${cls} {
  box-sizing: border-box;
  width: 100%;
  max-width: ${clamp(s.maxWidth, 220, 720)}px;
  perspective: 1000px;
}
.${cls}__card {
  position: relative;
  overflow: hidden;
  border-radius: ${clamp(s.radius, 0, 48)}px;
  background: ${col(s.bg, "#0f172a")};
  color: ${col(s.textColor, "#f8fafc")};
  transform: rotateX(var(--owd-rx, 0deg)) rotateY(var(--owd-ry, 0deg));
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease;
  box-shadow: 0 24px 48px -24px rgba(15, 23, 42, 0.55);
}
.${cls}.is-tilting .${cls}__card {
  transition: transform 0.08s linear, box-shadow 0.3s ease;
  box-shadow: 0 34px 60px -26px rgba(15, 23, 42, 0.6);
}
.${cls}__media {
  display: block;
  width: 100%;
  aspect-ratio: 5 / 3;
  object-fit: cover;
  transform: translateZ(20px) scale(1.04);
}
.${cls}__body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 22px 24px;
  transform: translateZ(40px);
}
.${cls}__badge {
  align-self: flex-start;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${accent};
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}
.${cls}__title {
  margin: 0;
  font-size: 20px;
  line-height: 1.25;
}
.${cls}__text {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.85;
}
.${cls}__cta {
  align-self: flex-start;
  margin-top: 6px;
  color: ${accent};
  font-weight: 700;
  text-decoration: none;
}
.${cls}__cta:hover {
  text-decoration: underline;
}
.${cls}__glare {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle at var(--owd-gx, 50%) var(--owd-gy, 0%), rgba(255, 255, 255, 0.28), transparent 55%);
  opacity: 0;
  transition: opacity 0.3s ease;
}
.${cls}.is-tilting .${cls}__glare {
  opacity: ${s.glare ? 1 : 0};
}
@media (prefers-reduced-motion: reduce) {
  .${cls}__card {
    transform: none;
  }
}
`;
    const body = [
      s.badge && h("span", { class: `${cls}__badge` }, s.badge),
      s.title && h("h3", { class: `${cls}__title` }, s.title),
      s.text && h("p", { class: `${cls}__text` }, s.text),
      s.ctaLabel && h("a", { class: `${cls}__cta`, href }, s.ctaLabel),
    ].filter(Boolean) as ReturnType<typeof h>[];
    const markup = h(
      "div",
      { class: cls },
      h("div", { class: `${cls}__card owd3d-card` }, h("img", { class: `${cls}__media`, src: img, alt: s.alt, loading: "lazy", decoding: "async" }), h("div", { class: `${cls}__body` }, ...body), h("div", { class: `${cls}__glare`, "aria-hidden": "true" })),
    );
    const shell = (refAttr: string, cn: "class" | "className", e: (t: string) => string) => {
      const close = cn === "className" ? " /" : "";
      return `<div ${refAttr} ${cn}="${cls}">
  <div ${cn}="${cls}__card owd3d-card">
    <img ${cn}="${cls}__media" src="${img}" alt="${e(s.alt)}" loading="lazy" decoding="async"${close}>
    <div ${cn}="${cls}__body">${s.badge ? `\n      <span ${cn}="${cls}__badge">${e(s.badge)}</span>` : ""}${s.title ? `\n      <h3 ${cn}="${cls}__title">${e(s.title)}</h3>` : ""}${s.text ? `\n      <p ${cn}="${cls}__text">${e(s.text)}</p>` : ""}${s.ctaLabel ? `\n      <a ${cn}="${cls}__cta" href="${e(href)}">${e(s.ctaLabel)}</a>` : ""}
    </div>
    <div ${cn}="${cls}__glare" aria-hidden="true"></div>
  </div>
</div>`;
    };
    return {
      css,
      markup,
      html: {
        body: renderHtml(markup),
        script: `// Kartu 3D: kemiringan mengikuti kursor (CSS 3D, tanpa WebGL).
${sharedRuntime()}
(function () {
  var CONFIG = ${json};
  document.querySelectorAll(".${cls}").forEach(function (el) {
    OWD3D.mount(el, "tilt", CONFIG);
  });
})();`,
      },
      react: {
        imports: `import { useEffect, useRef } from "react";\nimport { mount3d } from "./owd3d";`,
        pre: `const CONFIG = ${json};\nconst hostRef = useRef(null);\n\nuseEffect(() => mount3d(hostRef.current, "tilt", CONFIG), []);`,
        jsx: shell("ref={hostRef}", "className", esc),
      },
      vue: {
        script: `import { ref, onMounted, onBeforeUnmount } from "vue";\nimport { mount3d } from "./owd3d.js";\n\nconst CONFIG = ${json};\nconst hostEl = ref(null);\nlet destroy3d = null;\n\nonMounted(() => {\n  destroy3d = mount3d(hostEl.value, "tilt", CONFIG);\n});\nonBeforeUnmount(() => destroy3d && destroy3d());`,
        template: shell(`ref="hostEl"`, "class", esc),
      },
      svelte: {
        script: `import { onMount } from "svelte";\nimport { mount3d } from "./owd3d.js";\n\nconst CONFIG = ${json};\nlet host;\n\nonMount(() => mount3d(host, "tilt", CONFIG));`,
        markup: shell("bind:this={host}", "class", esc),
      },
      angular: {
        coreImports: ["AfterViewInit", "ElementRef", "OnDestroy", "ViewChild"],
        implementsList: ["AfterViewInit", "OnDestroy"],
        headerImports: `import { mount3d } from './owd-3d';`,
        classBody: `@ViewChild('host3d') host?: ElementRef<HTMLElement>;\nprivate readonly config = ${json};\nprivate destroy3d: (() => void) | null = null;\n\nngAfterViewInit(): void {\n  if (this.host) this.destroy3d = mount3d(this.host.nativeElement, "tilt", this.config);\n}\n\nngOnDestroy(): void {\n  if (this.destroy3d) this.destroy3d();\n}`,
        template: shell("#host3d", "class", ngEsc),
      },
    };
  },
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: i18n.t("el.f.content"),
        icon: Box,
        content: (
          <>
            <ImageField {...p} k="imageUrl" label={tr("card.image")} hint={tr("card.imageHint")} />
            <TextField {...p} k="alt" label={tr("alt")} />
            <TextField {...p} k="badge" label={tr("card.badge")} />
            <TextField {...p} k="title" label={i18n.t("el.f.title")} />
            <TextField {...p} k="text" label={tr("card.text")} multiline rows={3} />
            <TextField {...p} k="ctaLabel" label={tr("card.cta")} />
            <TextField {...p} k="ctaUrl" label={tr("card.ctaUrl")} placeholder="https://..." />
          </>
        ),
      },
      {
        id: "style",
        label: i18n.t("el.f.style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="maxTilt" label={tr("card.tilt")} min={2} max={25} suffix="°" />
            <ToggleField {...p} k="glare" label={tr("card.glare")} />
            <NumberField {...p} k="maxWidth" label={tr("card.maxWidth")} min={220} max={720} suffix="px" />
            <NumberField {...p} k="radius" label={tr("radius")} min={0} max={48} suffix="px" />
            <ColorField {...p} k="bg" label={tr("background")} />
            <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
            <ColorField {...p} k="accent" label={tr("card.accent")} />
          </>
        ),
      },
    ];
  },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const THREE_D_ELEMENTS: ElementDefinition<any>[] = [product3dElement, shape3dElement, globe3dElement, particles3dElement, card3dElement];
export const THREE_D_TYPES = THREE_D_ELEMENTS.map((d) => d.type);
