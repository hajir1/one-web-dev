import { useTranslation } from "react-i18next";
import ImageValueInput from "../../../../assetLibrary/ImageValueInput";
import { ColorInput, Field, RangeInput, Row, Segmented, SelectInput, Toggle } from "../helpers/SmallUIHelpers";
import {
  BG_DEFAULTS,
  BG_POSITIONS,
  isSafeBgImage,
  type BgFields,
  type BgKind,
} from "../helpers/background";

/** Kunci i18n label jenis & posisi background. */
const KIND_LABEL: Record<BgKind, string> = {
  none: "pm.bg.kind.none",
  solid: "pm.bg.kind.solid",
  gradient: "pm.bg.kind.gradient",
  image: "pm.bg.kind.image",
};

const POSITION_LABEL: Record<(typeof BG_POSITIONS)[number], string> = {
  center: "pm.bg.pos.center",
  top: "pm.bg.pos.top",
  bottom: "pm.bg.pos.bottom",
  left: "pm.bg.pos.left",
  right: "pm.bg.pos.right",
  "top left": "pm.bg.pos.topLeft",
  "top right": "pm.bg.pos.topRight",
  "bottom left": "pm.bg.pos.bottomLeft",
  "bottom right": "pm.bg.pos.bottomRight",
};

export interface BackgroundEditorProps {
  value: Partial<BgFields> & { bgType?: string };
  set: (key: keyof BgFields, value: unknown) => void;
  /** Jenis yang boleh dipilih (default semua). */
  kinds?: BgKind[];
  colorLabel?: string;
}

/**
 * Editor background lengkap: none / warna / gradient / gambar (+ ukuran,
 * posisi, ulangi, parallax, warna dasar, overlay). Dipakai elemen dan
 * kontainer (section, Row, grup) supaya perilakunya sama.
 */
export default function BackgroundEditor({
  value: v,
  set,
  kinds = ["none", "solid", "gradient", "image"],
  colorLabel,
}: BackgroundEditorProps) {
  const { t } = useTranslation();
  const kind = (kinds.includes(v.bgType as BgKind) ? v.bgType : kinds.includes("solid") ? "solid" : kinds[0]) as BgKind;
  const g = <K extends keyof typeof BG_DEFAULTS>(k: K) => (v[k] ?? BG_DEFAULTS[k]) as (typeof BG_DEFAULTS)[K];
  const image = g("bgImage");
  const urlInvalid = !!image && !isSafeBgImage(image);

  return (
    <div className="flex flex-col gap-3" data-testid="bg-editor">
      {kinds.length > 1 && (
        <Field label={t("pm.bg.type")}>
          <Segmented
            value={kind}
            onChange={(k) => set("bgType", k)}
            options={kinds.map((k) => ({ value: k, label: t(KIND_LABEL[k]) }))}
          />
        </Field>
      )}

      {kind === "solid" && (
        <Field label={colorLabel ?? t("pm.styling.bgColor")}>
          <ColorInput value={v.bgColor ?? "#ffffff"} onChange={(c) => set("bgColor", c)} />
        </Field>
      )}

      {kind === "gradient" && (
        <>
          <Field label={t("pm.bg.gradientKind")}>
            <Segmented
              value={g("gradientKind")}
              onChange={(k) => set("gradientKind", k)}
              options={[
                { value: "linear", label: "Linear" },
                { value: "radial", label: "Radial" },
              ]}
            />
          </Field>
          <Row>
            <Field label={t("pm.bg.from")}>
              <ColorInput value={v.gradientFrom ?? "#2563eb"} onChange={(c) => set("gradientFrom", c)} />
            </Field>
            <Field label={t("pm.bg.to")}>
              <ColorInput value={v.gradientTo ?? "#7c3aed"} onChange={(c) => set("gradientTo", c)} />
            </Field>
          </Row>
          <Toggle
            checked={!!g("gradientVia")}
            onChange={(on) => set("gradientVia", on ? "#ffffff" : "")}
            label={t("pm.bg.viaToggle")}
          />
          {!!g("gradientVia") && (
            <Field label={t("pm.bg.via")}>
              <ColorInput value={g("gradientVia")} onChange={(c) => set("gradientVia", c)} />
            </Field>
          )}
          {g("gradientKind") === "linear" && (
            <Field label={t("pm.bg.angle", { deg: v.gradientAngle ?? 90 })}>
              <RangeInput value={v.gradientAngle ?? 90} onChange={(n) => set("gradientAngle", n)} min={0} max={360} />
            </Field>
          )}
        </>
      )}

      {kind === "image" && (
        <>
          <Field label={t("pm.bg.url")} hint={urlInvalid ? t("pm.bg.urlInvalid") : undefined}>
            <ImageValueInput value={image} onChange={(u) => set("bgImage", u.trim())} />
          </Field>
          <Row>
            <Field label={t("pm.bg.size")}>
              <SelectInput
                value={g("bgSize")}
                onChange={(x) => set("bgSize", x)}
                options={[
                  { value: "cover", label: t("pm.bg.cover") },
                  { value: "contain", label: t("pm.bg.contain") },
                  { value: "auto", label: t("pm.bg.auto") },
                ]}
              />
            </Field>
            <Field label={t("pm.bg.position")}>
              <SelectInput
                value={g("bgPosition")}
                onChange={(x) => set("bgPosition", x)}
                options={BG_POSITIONS.map((p) => ({ value: p, label: t(POSITION_LABEL[p]) }))}
              />
            </Field>
          </Row>
          <Row>
            <Field label={t("pm.bg.repeat")}>
              <SelectInput
                value={g("bgRepeat")}
                onChange={(x) => set("bgRepeat", x)}
                options={[
                  { value: "no-repeat", label: t("pm.bg.repeatNo") },
                  { value: "repeat", label: t("pm.bg.repeatYes") },
                  { value: "repeat-x", label: "Horizontal" },
                  { value: "repeat-y", label: t("pm.bg.repeatY") },
                ]}
              />
            </Field>
            <Field label={t("pm.bg.baseColor")}>
              <ColorInput value={v.bgColor ?? "#ffffff"} onChange={(c) => set("bgColor", c)} />
            </Field>
          </Row>
          <Toggle
            checked={g("bgAttachment") === "fixed"}
            onChange={(on) => set("bgAttachment", on ? "fixed" : "scroll")}
            label={t("pm.bg.parallax")}
          />
          <Field label={`Overlay: ${g("bgOverlayOpacity")}%`}>
            <RangeInput value={g("bgOverlayOpacity")} onChange={(n) => set("bgOverlayOpacity", n)} min={0} max={90} />
          </Field>
          {g("bgOverlayOpacity") > 0 && (
            <Field label={t("pm.bg.overlayColor")}>
              <ColorInput value={g("bgOverlayColor")} onChange={(c) => set("bgOverlayColor", c)} />
            </Field>
          )}
        </>
      )}
    </div>
  );
}
