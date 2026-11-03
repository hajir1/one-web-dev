import {   MapPin, Palette } from "lucide-react";
import type { PanelSection } from "../../../ui/PanelStyling";
import {   NumberField,    TextField, ToggleField } from "../../../ui/fields";
import { defineElement } from "../../../helpers/elementDefinition";
import { h } from "../../../helpers/markup";
import { clamp,    mapsEmbedUrl } from "../shared";
import { tr, f } from "./kit";

/* ------------------------------- Peta ------------------------------- */

export interface MapEmbedState {
  query: string;
  zoom: number;
  height: number;
  radius: number;
  title: string;
  grayscale: boolean;
}

export const mapEmbedElement = defineElement<MapEmbedState>({
  type: "map-embed",
  label: "Peta Lokasi",
  group: "Data",
  componentName: "MapEmbed",
  defaultClassName: "custom-map",
  defaults: { query: "Monumen Nasional, Jakarta", zoom: 15, height: 360, radius: 16, title: "Lokasi kami", grayscale: false },
  spec: (s, cls) => ({
    css: `.${cls} {
  box-sizing: border-box;
  overflow: hidden;
  width: 100%;
  height: ${clamp(s.height, 160, 900)}px;
  border-radius: ${clamp(s.radius, 0, 40)}px;
  background: #e2e8f0;
}
.${cls}__frame {
  display: block;
  width: 100%;
  height: 100%;
  border: 0;${s.grayscale ? "\n  filter: grayscale(1);" : ""}
}
`,
    markup: h(
      "div",
      { class: cls },
      h("iframe", {
        class: `${cls}__frame`,
        src: mapsEmbedUrl(s.query, s.zoom),
        title: s.title || tr("map"),
        loading: "lazy",
        "html:referrerpolicy": "no-referrer-when-downgrade",
        "jsx:referrerPolicy": "no-referrer-when-downgrade",
        "html:allowfullscreen": true,
        "jsx:allowFullScreen": true,
      }),
    ),
  }),
  sections: (s, update): PanelSection[] => {
    const p = { s, update };
    return [
      {
        id: "content",
        label: f("content"),
        icon: MapPin,
        content: (
          <>
            <TextField {...p} k="query" label={tr("address")} hint={tr("addressHint")} />
            <NumberField {...p} k="zoom" label={tr("zoom")} min={3} max={20} />
            <TextField {...p} k="title" label={tr("frameTitle")} />
          </>
        ),
      },
      {
        id: "style",
        label: f("style"),
        icon: Palette,
        content: (
          <>
            <NumberField {...p} k="height" label={f("height")} min={160} max={900} suffix="px" />
            <NumberField {...p} k="radius" label={f("radius")} min={0} max={40} suffix="px" />
            <ToggleField {...p} k="grayscale" label={tr("grayscale")} />
          </>
        ),
      },
    ];
  },
});
