import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, Braces, ShieldCheck } from "lucide-react";
import AppMeta from "../../../components/app/AppMeta";
import PageHeader from "../../../components/app/PageHeader";
import { Link, Navigate } from "../../../components/app/LocaleLink";
import { Chip } from "../../../components/app/ui";
import { TOOLS, TOOL_BY_ID, TOOL_GROUPS, isToolId, type ToolDef } from "./tools";
import ToolView from "./ToolView";
import JwtView from "./JwtView";
import TimestampView from "./TimestampView";
import RegexView from "./RegexView";
import DiffView from "./DiffView";
import ContrastView from "./ContrastView";
import { isDemoMode } from "../../../demo/demoMode";

const BASE = "/data-tools/utilities";

function ToolNav({ active }: { active: ToolDef["id"] }) {
  const { t } = useTranslation();
  return (
    <nav aria-label={t("data.util.toolsNav")} className="-mx-1 flex w-full min-w-0 max-w-full gap-1 overflow-x-auto px-1 pb-1" data-testid="tool-nav">
      {TOOLS.map((x) => (
        <Link
          key={x.id}
          to={`${BASE}/${x.id}`}
          aria-current={x.id === active ? "page" : undefined}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
            x.id === active
              ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200"
              : "border-gray-200 bg-white text-gray-600 hover:border-brand-200 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:text-white"
          }`}
        >
          <x.icon className="h-3.5 w-3.5" /> {t(`data.util.tools.${x.id}.name`)}
        </Link>
      ))}
    </nav>
  );
}

function Hub() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col gap-6" data-testid="utilities-hub">
      {TOOL_GROUPS.map((g) => (
        <section key={g} aria-labelledby={`grp-${g}`}>
          <h2 id={`grp-${g}`} className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {t(`data.util.groups.${g}`)}
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {TOOLS.filter((x) => x.group === g).map((x) => (
              <li key={x.id}>
                <Link
                  to={`${BASE}/${x.id}`}
                  className="ow-card group flex h-full items-start gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md dark:hover:border-brand-500/30"
                  data-testid={`hub-${x.id}`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                    <x.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-900 dark:text-white">
                      {t(`data.util.tools.${x.id}.name`)}
                      <ArrowUpRight className="h-3.5 w-3.5 text-gray-300 transition group-hover:text-brand-600" />
                    </span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-gray-500 dark:text-gray-400">{t(`data.util.tools.${x.id}.description`)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function DevUtilities() {
  const { t } = useTranslation();
  const { tool } = useParams();
  if (tool !== undefined && !isToolId(tool)) return <Navigate to={BASE} replace />;
  const def = tool ? TOOL_BY_ID[tool] : null;
  const title = def ? t(`data.util.tools.${def.id}.name`) : t("data.util.title");

  return (
    <>
      <AppMeta title={def ? `${title} · ${t("data.util.title")}` : title} description={def ? t(`data.util.tools.${def.id}.description`) : t("data.util.description")} />
      <div className="flex min-w-0 flex-col gap-5" data-testid="dev-utilities">
        <PageHeader
          icon={def?.icon ?? Braces}
          tileClassName="bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300"
          title={title}
          description={def ? t(`data.util.tools.${def.id}.description`) : t("data.util.description")}
          crumbs={[{ label: t("nav.sections.data.name"), to: "/data-tools" }, { label: t("data.util.title"), to: def ? BASE : undefined }, ...(def ? [{ label: title }] : [])]}
          help="data-utilities"
          chips={
            <>
              <Chip tone="green">
                <ShieldCheck className="h-3 w-3" /> {t("data.common.browserOnly")}
              </Chip>
              {!isDemoMode() && <Chip tone="blue">{t("common.free")}</Chip>}
            </>
          }
        />
        {def && <ToolNav active={def.id} />}
        {!def ? (
          <Hub />
        ) : def.view === "jwt" ? (
          <JwtView />
        ) : def.view === "timestamp" ? (
          <TimestampView />
        ) : def.view === "regex" ? (
          <RegexView />
        ) : def.view === "diff" ? (
          <DiffView />
        ) : def.view === "contrast" ? (
          <ContrastView />
        ) : (
          <ToolView key={def.id} tool={def} />
        )}
      </div>
    </>
  );
}
