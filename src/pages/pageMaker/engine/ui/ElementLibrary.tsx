import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Package, Plus, Search } from "lucide-react";
import {
  ELEMENT_DEFINITIONS,
  ELEMENT_GROUP_ORDER,
} from "../../core/elementDefinitions";
import type {
  AnyElementDefinition,
  IconLookup,
} from "../../core/helpers/elementDefinition";
import { renderFor, type MNode } from "../../core/helpers/markup";
import { scopeCss } from "../../core/helpers/scopeCss";
import { endDrag, startDrag } from "../helpers/dnd";
import { elementIcon } from "../helpers/elementIcons";
import { AccessBadge } from "../../../../marketplace/ui/AccessBadge";
import { usePieceAccess } from "../../../../marketplace/ui/pieceAccess";
import { NEW_ELEMENT_TYPES } from "../../../../marketplace/data/prices";
import { isDemoMode } from "../../../../demo/demoMode";

/* ================================================================== */
/* Pustaka elemen bawaan Page Maker                                     */
/* ================================================================== */

export interface LibraryPick {
  elementType: string;
}

/** Pratinjau mini yang otomatis diskalakan agar muat di kotaknya. */
function FitPreview({ html, css, scope }: { html: string; css: string; scope: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const scoped = useMemo(() => scopeCss(css, `.${scope}`), [css, scope]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    if (!box || !inner) return;
    const measure = () => {
      const w = inner.offsetWidth || 1;
      const h = inner.offsetHeight || 1;
      const sw = (box.clientWidth - 12) / w;
      const sh = (box.clientHeight - 12) / h;
      setScale(Math.max(0.15, Math.min(1, sw, sh)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [html, css]);

  return (
    <div
      ref={boxRef}
      className={`${scope} pointer-events-none relative h-20 overflow-hidden rounded-md bg-gray-50`}
      aria-hidden
    >
      <style>{scoped}</style>
      <div
        ref={innerRef}
        className="absolute left-1/2 top-1/2"
        style={{
          width: "max-content",
          maxWidth: 360,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function miniRender(
  def: AnyElementDefinition,
  state: unknown,
  cls: string,
  icons: IconLookup,
): { html: string; css: string } | null {
  try {
    const spec = def.spec(state, cls, icons);
    const html =
      spec.html?.body ??
      (spec.markup ? renderFor("static", spec.markup as MNode | MNode[]) : "");
    return { html, css: spec.css };
  } catch {
    return null;
  }
}

function Card({
  def,
  name,
  state,
  idKey,
  icons,
  onAdd,
  pick,
}: {
  def: AnyElementDefinition;
  name: string;
  state: unknown;
  idKey: string;
  icons: IconLookup;
  onAdd: (p: LibraryPick) => void;
  pick: LibraryPick;
}) {
  const { t } = useTranslation();
  const scope = `cm-lib-${idKey.replace(/[^A-Za-z0-9_-]/g, "")}`;
  const rendered = useMemo(() => miniRender(def, state, `${scope}-el`, icons), [def, state, scope, icons]);
  const Icon = elementIcon(def.type);
  const tier = def.premium ? "premium" : "free";
  const locked = usePieceAccess().reason(`element:${def.type}`, tier) === "locked";

  return (
    <div
      draggable
      onDragStart={(e) => startDrag(e, { kind: "element", ...pick }, name)}
      onDragEnd={endDrag}
      onDoubleClick={() => onAdd(pick)}
      title={t("pm.library.cardTitle")}
      className="group relative cursor-grab select-none rounded-lg border border-gray-200 p-1.5 transition hover:border-blue-500 hover:shadow-sm active:cursor-grabbing dark:border-gray-800"
    >
      {rendered ? (
        <FitPreview html={rendered.html} css={rendered.css} scope={scope} />
      ) : (
        <div className="flex h-20 items-center justify-center rounded-md bg-red-50 text-[11px] text-red-600 dark:bg-red-500/10">
          {t("pm.library.renderFailed")}
        </div>
      )}
      <button
        type="button"
        aria-label={locked ? t("pm.library.addPremium", { name }) : t("pm.library.add", { name })}
        onClick={() => onAdd(pick)}
        className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-blue-800 text-white opacity-0 shadow transition focus:opacity-100 group-hover:opacity-100"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
      <AccessBadge itemId={`element:${def.type}`} tier={tier} className="absolute left-2.5 top-2.5" />
      <div className="mt-1.5 flex items-center justify-between gap-2 px-0.5">
        <span className="flex min-w-0 items-center gap-1 text-xs font-medium text-gray-700 dark:text-gray-200">
          <Icon className="h-3 w-3 shrink-0 text-gray-400" />
          <span className="truncate">{name}</span>
        </span>
        {NEW_ELEMENT_TYPES.includes(def.type) && (
          <span className="shrink-0 rounded bg-blue-50 px-1 py-0.5 text-[9px] font-semibold uppercase text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">{t("market.badge.new")}</span>
        )}
      </div>
    </div>
  );
}

interface ElementLibraryProps {
  icons: IconLookup;
  onAdd: (p: LibraryPick) => void;
  /** Nama tujuan penambahan (untuk petunjuk). */
  targetLabel: string;
  /** Nama area tujuan seret (default: "canvas", diterjemahkan). */
  dropAreaLabel?: string;
}

/** Pustaka elemen BAWAAN (satu-satunya sumber elemen untuk sementara). */
export default function ElementLibrary({ icons, onAdd, targetLabel, dropAreaLabel }: ElementLibraryProps) {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<string>("all");
  const q = query.trim().toLowerCase();
  /** Nama elemen sesuai bahasa (katalog marketplace), cadangan: label bawaan. */
  const labelOf = (d: AnyElementDefinition) => t(`market.el.${d.type}.name`, { defaultValue: d.label });

  const sections = ELEMENT_GROUP_ORDER.filter((g) => group === "all" || g === group)
    .map((g) => ({
      group: g,
      defs: ELEMENT_DEFINITIONS.filter((d) => d.group === g && (!q || d.label.toLowerCase().includes(q) || labelOf(d).toLowerCase().includes(q))),
    }))
    .filter((s) => s.defs.length > 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("pm.library.searchPlaceholder")}
            aria-label={t("pm.library.search")}
            className="w-full rounded border border-gray-300 bg-white py-1.5 pl-8 pr-2.5 text-sm text-gray-800 outline-none focus:border-blue-700 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["all", ...ELEMENT_GROUP_ORDER].map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                group === g
                  ? "border-blue-800 bg-blue-800 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-white/5"
              }`}
            >
              {g === "all" ? t("common.all") : t(`pm.groups.${g}`, { defaultValue: g })}
            </button>
          ))}
        </div>
        <p className="text-[11px] leading-snug text-gray-500 dark:text-gray-400">
          <Trans
            i18nKey="pm.library.hint"
            values={{ area: dropAreaLabel ?? t("pm.add.canvas"), target: targetLabel }}
            components={{ b: <b /> }}
          />
        </p>
      </div>

      {sections.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-8 text-center text-gray-400">
          <Package className="h-8 w-8" />
          <p className="text-sm">{t("pm.library.noMatch", { query })}</p>
        </div>
      )}

      {sections.map(({ group: g, defs }) => (
        <div key={g} className="flex flex-col gap-2">
          <h5 className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {g === "Premium" ? t(isDemoMode() ? "demo.pm.premiumGroup" : "pm.library.premiumGroup") : t(`pm.groups.${g}`, { defaultValue: g })}
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {defs.map((def) => (
              <Card
                key={def.type}
                def={def}
                name={labelOf(def)}
                state={def.defaults}
                idKey={`${def.type}-default`}
                icons={icons}
                onAdd={onAdd}
                pick={{ elementType: def.type }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
