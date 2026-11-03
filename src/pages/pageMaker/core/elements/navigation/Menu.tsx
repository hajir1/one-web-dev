import { Trans } from "react-i18next";
import { Link as RouterLink } from "../../../../../components/app/LocaleLink";
import { FolderTree, Palette } from "lucide-react";
import type { PanelSection, Updater } from "../../ui/PanelStyling";
import { ColorField, NumberField, SegmentedField, SelectField, ToggleField, FONT_WEIGHT_OPTIONS } from "../../ui/fields";
import { Field, SelectInput, Toggle } from "../../helpers/SmallUIHelpers";
import { defineElement, type ElementSpec } from "../../helpers/elementDefinition";
import { h, renderFor, renderHtml, type MElement } from "../../helpers/markup";
import { safeColor } from "../../helpers/background";
import { pageHref, type SiteContext, type SiteInfo, type SitePageInfo } from "../../helpers/siteTypes";
import { useDesignStore } from "../../store/designStore";
import { allSiteInfos, PAGE_DESIGN_TYPE, SITE_TYPE } from "../../../helpers/site";
import i18n from "../../../../../i18n";

/* ================================================================== */
/* Menu — navigasi dinamis dari Folder Website                          */
/*                                                                    */
/* Item menu = halaman di folder website (nama desain terkini atau label */
/* khusus), tautan = slug yang valid (bukan nama desain mentah):        */
/*   editor / ekspor satu halaman → <a href="slug.html">                */
/*   ekspor website → Link (React) · RouterLink (Vue) · routerLink      */
/*                    (Angular) · #/slug (Svelte) · slug.html (HTML)    */
/* ================================================================== */

export interface MenuState {
  /** "" = otomatis (folder yang memuat halaman ini, atau folder pertama). */
  siteId: string;
  /** Kosong = semua halaman folder; selain itu hanya halaman ini (urutan ikut folder). */
  pageIds: string[];
  orientation: "horizontal" | "vertical";
  align: "start" | "center" | "end";
  gap: number;
  fontSize: number;
  fontWeight: number;
  paddingY: number;
  paddingX: number;
  textColor: string;
  hoverColor: string;
  activeColor: string;
  showActive: boolean;
  /** Lama (sebelum v5): diganti `mobileMenu`, tetap disimpan agar desain lama terbaca. */
  stackOnMobile: boolean;
  /** Tampilan di layar ≤ 768px: ikon hamburger (dropdown), bertumpuk, atau tetap mengalir. */
  mobileMenu: "burger" | "stack" | "wrap";
  /** Latar dropdown hamburger; "" = otomatis (gelap bila teks menu terang). */
  panelBg: string;
}

const DEFAULT_STATE: MenuState = {
  siteId: "",
  pageIds: [],
  orientation: "horizontal",
  align: "start",
  gap: 20,
  fontSize: 15,
  fontWeight: 500,
  paddingY: 6,
  paddingX: 4,
  textColor: "#334155",
  hoverColor: "#1d4ed8",
  activeColor: "#1d4ed8",
  showActive: true,
  stackOnMobile: true,
  mobileMenu: "burger",
  panelBg: "",
};

/** Batas lebar layar untuk menu hamburger: HP dan tablet (sama dengan Mega Menu). */
const MOBILE_MAX = 1024;

/** Warna terang? (untuk memilih latar dropdown otomatis). */
function isLight(hex: string): boolean {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return false;
  const v = m[1].length === 3 ? m[1].replace(/./g, (c) => c + c) : m[1];
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.6;
}

const SAMPLE: SitePageInfo[] = [
  { designId: "", label: "Beranda", slug: "beranda", isHome: true },
  { designId: "", label: "Tentang", slug: "tentang", isHome: false },
  { designId: "", label: "Kontak", slug: "kontak", isHome: false },
];

/** Folder yang dipakai menu: pilihan pengguna → folder yang memuat halaman ini → folder pertama. */
export function resolveMenuSite(s: Pick<MenuState, "siteId">, ctx?: SiteContext): SiteInfo | null {
  const sites = ctx?.sites ?? [];
  return (
    sites.find((x) => x.id === s.siteId) ??
    (ctx?.currentDesignId ? sites.find((x) => x.pages.some((p) => p.designId === ctx.currentDesignId)) : undefined) ??
    sites[0] ??
    null
  );
}

export function menuItems(s: Pick<MenuState, "siteId" | "pageIds">, ctx?: SiteContext): { items: SitePageInfo[]; sample: boolean } {
  const site = resolveMenuSite(s, ctx);
  if (!site) return { items: SAMPLE, sample: true };
  // v20: "Semua halaman" = halaman yang tidak disembunyikan dari menu (Studio → Halaman).
  const items = s.pageIds.length ? site.pages.filter((p) => s.pageIds.includes(p.designId)) : site.pages.filter((p) => p.inMenu !== false);
  return { items, sample: false };
}

const JUSTIFY = { start: "flex-start", center: "center", end: "flex-end" } as const;

function menuCss(s: MenuState, cls: string): string {
  const vertical = s.orientation === "vertical";
  const text = safeColor(s.textColor) ?? "#334155";
  const active = safeColor(s.activeColor) ?? "#1d4ed8";
  return `.${cls} {
  box-sizing: border-box;
  max-width: 100%;
}
.${cls}__list {
  display: flex;
  flex-direction: ${vertical ? "column" : "row"};
  flex-wrap: wrap;
  ${vertical ? "align-items" : "justify-content"}: ${JUSTIFY[s.align] ?? "flex-start"};
  gap: ${Math.max(0, s.gap)}px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.${cls}__link {
  display: inline-block;
  padding: ${Math.max(0, s.paddingY)}px ${Math.max(0, s.paddingX)}px;
  border-bottom: 2px solid transparent;
  color: ${text};
  font-size: ${Math.max(8, s.fontSize)}px;
  font-weight: ${s.fontWeight};
  text-decoration: none;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.${cls}__link:hover,
.${cls}__link:focus-visible {
  color: ${safeColor(s.hoverColor) ?? "#1d4ed8"};
}
${
  s.showActive
    ? `.${cls}__link[aria-current="page"] {
  color: ${active};
  border-bottom-color: ${active};
}
`
    : ""
}${vertical ? "" : mobileCss(s, cls, text, active)}`;
}

/** CSS versi HP: hamburger (dropdown CSS murni, tanpa JS) atau bertumpuk. */
function mobileCss(s: MenuState, cls: string, text: string, active: string): string {
  const mode = s.mobileMenu ?? (s.stackOnMobile ? "stack" : "wrap");
  if (mode === "wrap") return "";
  if (mode === "stack")
    return `@media (max-width: ${MOBILE_MAX}px) {
  .${cls}__list {
    flex-direction: column;
    align-items: ${JUSTIFY[s.align] ?? "flex-start"};
    gap: ${Math.max(4, Math.round(s.gap / 2))}px;
  }
}
`;
  const panel = safeColor(s.panelBg) ?? (isLight(text) ? "#0f172a" : "#ffffff");
  const side = s.align === "start" ? "left: 0;" : s.align === "center" ? "left: 50%;\n    transform: translateX(-50%);" : "right: 0;";
  return `.${cls} {
  position: relative;
}
.${cls}__toggle {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}
.${cls}__burger {
  display: none;
}
@media (max-width: ${MOBILE_MAX}px) {
  .${cls} {
    /* Hamburger di ujung kanan baris header (setelah tombol CTA). */
    order: 2;
    display: flex;
    justify-content: ${JUSTIFY[s.align] ?? "flex-start"};
  }
  .${cls}__burger {
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    padding: 0 11px;
    border-radius: 10px;
    color: ${text};
    cursor: pointer;
    box-sizing: border-box;
  }
  .${cls}__burger span {
    display: block;
    height: 2px;
    border-radius: 2px;
    background: currentColor;
    transition: transform 0.2s ease, opacity 0.2s ease;
  }
  .${cls}__burger:hover {
    background: color-mix(in srgb, ${text} 10%, transparent);
  }
  .${cls}__toggle:focus-visible + .${cls}__burger {
    outline: 2px solid ${active};
    outline-offset: 2px;
  }
  .${cls}__toggle:checked + .${cls}__burger span:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }
  .${cls}__toggle:checked + .${cls}__burger span:nth-child(2) {
    opacity: 0;
  }
  .${cls}__toggle:checked + .${cls}__burger span:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
  .${cls}__list {
    display: none;
    position: absolute;
    top: calc(100% + 8px);
    ${side}
    z-index: 60;
    width: max-content;
    min-width: 220px;
    max-width: calc(100vw - 32px);
    flex-direction: column;
    align-items: stretch;
    gap: 2px;
    padding: 8px;
    border: 1px solid color-mix(in srgb, ${text} 14%, transparent);
    border-radius: 14px;
    background: ${panel};
    box-shadow: 0 20px 40px -16px rgba(15, 23, 42, 0.35);
    box-sizing: border-box;
  }
  .${cls}__toggle:checked ~ .${cls}__list {
    display: flex;
  }
  .${cls}__link {
    display: block;
    padding: 10px 12px;
    border-bottom: 0;
    border-radius: 8px;
  }
  .${cls}__link:hover {
    background: color-mix(in srgb, ${text} 8%, transparent);
  }
  .${cls}__link[aria-current="page"] {
    background: color-mix(in srgb, ${active} 12%, transparent);
  }
}
`;
}


type LinkKind = "html" | "react" | "vue" | "svelte" | "angular";

function tree(cls: string, items: SitePageInfo[], current: string | null | undefined, kind: LinkKind, burger: boolean): MElement {
  const link = (p: SitePageInfo) => {
    const isCurrent = !!current && p.designId === current;
    const common = { class: `${cls}__link`, ...(isCurrent && kind !== "vue" ? { "aria-current": "page" } : {}) };
    if (kind === "react") return h("Link", { ...common, to: pageHref(p, "router") }, p.label);
    if (kind === "vue") return h("RouterLink", { ...common, to: pageHref(p, "router") }, p.label);
    if (kind === "angular") return h("a", { ...common, routerLink: pageHref(p, "router") }, p.label);
    if (kind === "svelte") return h("a", { ...common, href: pageHref(p, "hash") }, p.label);
    return h("a", { ...common, href: pageHref(p, "html"), ...(p.designId ? { "static:data-pm-page": p.designId } : {}) }, p.label);
  };
  return h(
    "nav",
    { class: cls, "aria-label": "Navigasi" },
    burger && h("input", { class: `${cls}__toggle`, type: "checkbox", id: `${cls}-toggle`, "aria-label": i18n.t("el.f.openMenu") }),
    burger && h("label", { class: `${cls}__burger`, for: `${cls}-toggle`, "aria-hidden": "true" }, h("span", {}), h("span", {}), h("span", {})),
    h(
      "ul",
      { class: `${cls}__list` },
      items.map((p) => h("li", { class: `${cls}__item` }, link(p))),
    ),
  );
}

function menuSpec(s: MenuState, cls: string, ctx?: { site?: SiteContext }): ElementSpec {
  const site = ctx?.site;
  const { items } = menuItems(s, site);
  const current = site?.currentDesignId;
  const css = menuCss(s, cls);
  const burger = s.orientation !== "vertical" && (s.mobileMenu ?? "burger") === "burger";
  if (site?.routing !== "site") {
    // Satu halaman: tautan biasa ke berkas halaman (sama untuk semua framework).
    return { css, markup: tree(cls, items, current, "html", burger) };
  }
  return {
    css,
    html: { body: renderHtml(tree(cls, items, current, "html", burger)) },
    react: { imports: `import { Link } from "react-router-dom";`, jsx: renderFor("react", tree(cls, items, current, "react", burger)) },
    vue: { template: renderFor("vue", tree(cls, items, current, "vue", burger)) },
    svelte: { markup: renderFor("svelte", tree(cls, items, current, "svelte", burger)) },
    angular: {
      template: renderFor("angular", tree(cls, items, current, "angular", burger)),
      imports: [{ name: "RouterLink", path: "@angular/router" }],
    },
  };
}

/* ------------------------------ panel ------------------------------ */

const EMPTY: never[] = [];

function MenuSource({ s, update }: { s: MenuState; update: Updater<MenuState> }) {
  const sites = useDesignStore((st) => st.designs[SITE_TYPE]) ?? EMPTY;
  const designs = useDesignStore((st) => st.designs[PAGE_DESIGN_TYPE]) ?? EMPTY;
  const infos = allSiteInfos(sites, designs);
  const site = infos.find((x) => x.id === s.siteId) ?? null;
  const shown = site ?? infos[0] ?? null;
  const all = s.pageIds.length === 0;
  const toggle = (id: string, on: boolean) => {
    const base = all ? (shown?.pages.map((p) => p.designId) ?? []) : s.pageIds;
    const next = on ? [...base, id] : base.filter((x) => x !== id);
    update("pageIds", next);
  };

  return (
    <div className="flex flex-col gap-3" data-testid="menu-source">
      {infos.length === 0 ? (
        <p className="rounded-lg bg-amber-50 p-2.5 text-[11px] leading-snug text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          <Trans
            i18nKey="el.f.menuNoFolders"
            components={{ link: <RouterLink to="/website" className="font-semibold underline" /> }}
          />
        </p>
      ) : (
        <>
          <Field label={i18n.t("el.f.websiteFolder")} hint={i18n.t("el.f.websiteFolderHint")}>
            <SelectInput
              value={s.siteId}
              onChange={(v) => {
                update("siteId", v);
                update("pageIds", []);
              }}
              options={[{ value: "", label: i18n.t("el.f.automatic") }, ...infos.map((x) => ({ value: x.id, label: x.name }))]}
            />
          </Field>
          {shown && (
            <div>
              <Toggle checked={all} onChange={(on) => update("pageIds", on ? [] : shown.pages.map((p) => p.designId))} label={i18n.t("el.f.showAllPages")} />
              <ul className="mt-2 flex flex-col gap-1">
                {shown.pages.map((p) => (
                  <li key={p.designId}>
                    <label className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <input
                        type="checkbox"
                        disabled={all}
                        checked={all || s.pageIds.includes(p.designId)}
                        onChange={(e) => toggle(p.designId, e.target.checked)}
                        className="accent-blue-800"
                      />
                      <span className="flex-1 truncate">{p.label}</span>
                      <code className="text-[10px] text-gray-400">{pageHref(p, "router")}</code>
                    </label>
                  </li>
                ))}
                {shown.pages.length === 0 && <li className="text-xs text-gray-400">{i18n.t("el.f.folderEmpty")}</li>}
              </ul>
            </div>
          )}
        </>
      )}
      <RouterLink to="/website" className="text-xs font-semibold text-blue-700 underline dark:text-blue-400">
        {i18n.t("el.f.manageFolders")}
      </RouterLink>
    </div>
  );
}

function menuSections(s: MenuState, update: Updater<MenuState>): PanelSection[] {
  const p = { s, update };
  return [
    { id: "source", label: i18n.t("el.f.pageSource"), icon: FolderTree, content: <MenuSource s={s} update={update} /> },
    {
      id: "style",
      label: i18n.t("el.f.layoutStyle"),
      icon: Palette,
      content: (
        <>
          <SegmentedField
            {...p}
            k="orientation"
            label={i18n.t("el.f.orientation")}
            options={[
              { value: "horizontal", label: i18n.t("el.f.horizontal") },
              { value: "vertical", label: i18n.t("el.f.vertical") },
            ]}
          />
          <SegmentedField
            {...p}
            k="align"
            label={i18n.t("el.f.alignment")}
            options={[
              { value: "start", label: i18n.t("el.f.start") },
              { value: "center", label: i18n.t("el.f.center") },
              { value: "end", label: i18n.t("el.f.end") },
            ]}
          />
          <NumberField {...p} k="gap" label={i18n.t("el.f.itemGap")} min={0} max={120} suffix="px" />
          <NumberField {...p} k="fontSize" label={i18n.t("el.f.textSize")} min={8} max={48} suffix="px" />
          <SelectField {...p} k="fontWeight" label={i18n.t("el.f.weight")} options={FONT_WEIGHT_OPTIONS} />
          <NumberField {...p} k="paddingY" label={i18n.t("el.f.itemPaddingY")} min={0} max={40} suffix="px" />
          <NumberField {...p} k="paddingX" label={i18n.t("el.f.itemPaddingX")} min={0} max={60} suffix="px" />
          <ColorField {...p} k="textColor" label={i18n.t("el.f.textColor")} />
          <ColorField {...p} k="hoverColor" label={i18n.t("el.f.hoverColor")} />
          <ToggleField {...p} k="showActive" label={i18n.t("el.f.markActivePage")} />
          <ColorField {...p} k="activeColor" label={i18n.t("el.f.activePageColor")} />
          <SegmentedField
            {...p}
            k="mobileMenu"
            label={i18n.t("el.f.mobileMenu")}
            options={[
              { value: "burger", label: i18n.t("el.f.mobileBurger") },
              { value: "stack", label: i18n.t("el.f.mobileStack") },
              { value: "wrap", label: i18n.t("el.f.mobileWrap") },
            ]}
          />
          {s.mobileMenu === "burger" && <ColorField {...p} k="panelBg" label={i18n.t("el.f.mobilePanelBg")} />}
        </>
      ),
    },
  ];
}

export const menuElement = defineElement<MenuState>({
  type: "menu",
  label: "Menu",
  group: "Navigasi",
  componentName: "SiteMenu",
  defaultClassName: "custom-menu",
  defaults: DEFAULT_STATE,
  spec: (s, cls, _icons, ctx) => menuSpec(s, cls, ctx),
  sections: menuSections,
});
