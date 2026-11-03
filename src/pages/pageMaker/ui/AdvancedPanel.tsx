import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Field, TextInput } from "../core/helpers/SmallUIHelpers";
import CodeEditor from "../core/ui/CodeEditor";
import {
  MAX_CUSTOM_CSS,
  MAX_CUSTOM_JS,
  invalidClasses,
  isValidCssId,
  jsSyntaxError,
  scopeCustomCss,
  type AdvancedProps,
} from "../engine/helpers/advanced";
import type { BoxNode, ComponentNode } from "../engine/helpers/componentTypes";
import { walk } from "../engine/helpers/tree";

interface Props {
  node: ComponentNode;
  root: BoxNode;
  onChange: (advanced: AdvancedProps | undefined, key: string) => void;
}

const Err = ({ children }: { children: string }) => (
  <p role="alert" className="mt-1 text-[11px] leading-snug text-rose-600">
    {children}
  </p>
);

/** Grup "Lanjutan": CSS ID, CSS Class, Custom CSS, Custom JS (gratis). */
export default function AdvancedPanel({ node, root, onChange }: Props) {
  const { t } = useTranslation();
  const a = node.advanced ?? {};
  const set = (k: keyof AdvancedProps, v: string) => {
    const next: AdvancedProps = { ...a, [k]: v };
    if (!v.trim()) delete next[k];
    onChange(Object.keys(next).length ? next : undefined, `adv:${node.id}:${k}`);
  };

  const duplicate = useMemo(() => {
    if (!a.cssId) return false;
    let n = 0;
    walk(root, (x) => {
      if (x.advanced?.cssId === a.cssId) n++;
    });
    return n > 1;
  }, [root, a.cssId]);

  const idError = a.cssId
    ? !isValidCssId(a.cssId)
      ? t("pm.advanced.idInvalid")
      : duplicate
        ? t("pm.advanced.idDuplicate")
        : null
    : null;
  const badClasses = invalidClasses(a.cssClass);
  const cssError = a.customCss?.trim() && scopeCustomCss(a.customCss, ".x") === null;
  const jsError = a.customJs?.trim() ? jsSyntaxError(a.customJs) : null;

  return (
    <div className="flex flex-col gap-3" data-testid="advanced-panel">
      <Field label="CSS ID" hint={idError ? undefined : t("pm.advanced.idHint")}>
        <TextInput value={a.cssId ?? ""} onChange={(v) => set("cssId", v.trim())} placeholder={t("pm.advanced.idPlaceholder")} />
        {idError && <Err>{idError}</Err>}
      </Field>
      <Field label="CSS Class" hint={badClasses.length ? undefined : t("pm.advanced.classHint")}>
        <TextInput value={a.cssClass ?? ""} onChange={(v) => set("cssClass", v)} placeholder={t("pm.advanced.classPlaceholder")} />
        {badClasses.length > 0 && <Err>{t("pm.advanced.classInvalid", { list: badClasses.join(", ") })}</Err>}
      </Field>
      <div>
        <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">Custom CSS</p>
        <CodeEditor
          lang="css"
          label="Custom CSS"
          testId="custom-css"
          value={a.customCss ?? ""}
          onChange={(v) => set("customCss", v)}
          maxLength={MAX_CUSTOM_CSS}
          placeholder={"color: #0f172a;\n&:hover { opacity: .9; }\nh2 { margin: 0; }"}
        />
        {cssError ? (
          <Err>{t("pm.advanced.cssInvalid")}</Err>
        ) : (
          <p className="mt-1 text-[11px] leading-snug text-gray-400">
            <Trans i18nKey="pm.advanced.cssHint" components={{ code: <code /> }} />
          </p>
        )}
      </div>
      <div>
        <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">Custom JavaScript</p>
        <CodeEditor
          lang="js"
          label="Custom JavaScript"
          testId="custom-js"
          value={a.customJs ?? ""}
          onChange={(v) => set("customJs", v)}
          maxLength={MAX_CUSTOM_JS}
          placeholder={"on(element, \"click\", () => {\n  element.classList.toggle(\"aktif\");\n});"}
        />
        {jsError ? (
          <Err>{t("pm.advanced.jsInvalid", { error: jsError })}</Err>
        ) : (
          <p className="mt-1 text-[11px] leading-snug text-gray-400">
            <Trans i18nKey="pm.advanced.jsHint" components={{ code: <code /> }} />
          </p>
        )}
      </div>
    </div>
  );
}
