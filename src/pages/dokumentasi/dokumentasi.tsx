import { Fragment, useEffect, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Blocks,
  Braces,
  Code2,
  FileCode2,
  Globe,
  Menu as MenuIcon,
  Coins,
  Download,
  Palette,
  LayoutTemplate,
  Lightbulb,
  Library,
  Store,
  SlidersHorizontal,
  TriangleAlert,
} from "lucide-react";
import AppMeta from "../../components/app/AppMeta";
import { Link } from "../../components/app/LocaleLink";
import { CREDIT_COST } from "../../config/pricing";
import { FREE_EXPORTS, FREE_SITES, MAX_DESIGNS } from "../../config/quota";
import { CREDITS_PATH, GLOBAL_SETTING_PATH, TEMPLATES_PATH } from "../../config/menu";
import { isDemoMode } from "../../demo/demoMode";
import { TEMPLATE_SPLIT } from "../../config/marketplace";

/* ================================================================== */
/* Dokumentasi Web Maker                                                */
/* Panduan membangun web: Global Setting → Page Maker → export.         */
/* Teks ada di locales (guide.*). Format teks sederhana: **tebal**,      */
/* `kode`, dan [[tombol]] (kbd). Angka kuota & harga dibaca dari config  */
/* (quota.ts, pricing.ts) supaya panduan selalu sesuai aplikasi.         */
/* ================================================================== */

/* ------------------------------ kerangka ---------------------------- */

const ALL_SECTIONS = [
  "alur",
  "global-setting",
  "page-maker",
  "background",
  "javascript",
  "lanjutan",
  "library",
  "code-element",
  "menu",
  "website",
  "templates",
  "kredit",
  "contoh",
  "export",
  "tips",
] as const;

/** Mode demo (v12): bagian Kredit tidak ditampilkan (tidak ada kredit di demo). */
const SECTIONS = isDemoMode() ? ALL_SECTIONS.filter((id) => id !== "kredit") : ALL_SECTIONS;

/** Angka yang disisipkan ke teks panduan ({{maxDesigns}}, {{freeSites}}, …). */
const NUMS = {
  maxDesigns: MAX_DESIGNS,
  nextDesign: MAX_DESIGNS + 1,
  freeSites: FREE_SITES,
  nextSite: FREE_SITES + 1,
  freeExports: FREE_EXPORTS,
  templates: TEMPLATE_SPLIT.free + TEMPLATE_SPLIT.premium,
  templateCost: CREDIT_COST["premium-template"] ?? 8,
  siteSlotCost: CREDIT_COST["site-slot"] ?? 3,
  presetCost: CREDIT_COST["premium-preset"] ?? 2,
  elementCost: CREDIT_COST["premium-element"] ?? 2,
  eventCost: CREDIT_COST["premium-event"] ?? 1,
  exportCost: CREDIT_COST.export ?? 1,
};

/** `**tebal**`, `kode`, dan [[tombol]] → elemen React (teks lain di-escape oleh React). */
function rich(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[\[[^\]]+\]\])/g).map((p, i) => {
    if (p.startsWith("**") && p.endsWith("**")) return <B key={i}>{p.slice(2, -2)}</B>;
    if (p.startsWith("`") && p.endsWith("`")) return <C key={i}>{p.slice(1, -1)}</C>;
    if (p.startsWith("[[") && p.endsWith("]]")) return <K key={i}>{p.slice(2, -2)}</K>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}

/** Teks panduan: string (dengan format sederhana) dan daftar string dari locales. */
function useGuide() {
  const { t } = useTranslation();
  const tx = (key: string): string => t(`guide.${key}`, NUMS) as string;
  const r = (key: string): ReactNode => rich(tx(key));
  const list = (key: string): string[] => {
    const v = t(`guide.${key}`, { ...NUMS, returnObjects: true }) as unknown;
    return Array.isArray(v) ? (v as string[]) : [];
  };
  const rows = (key: string): ReactNode[][] => {
    const v = t(`guide.${key}`, { ...NUMS, returnObjects: true }) as unknown;
    return Array.isArray(v) ? (v as string[][]).map((row) => row.map(rich)) : [];
  };
  return { tx, r, list, rows };
}

function H2({ id, icon, children }: { id: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mb-4 flex scroll-mt-24 items-center gap-2.5 text-xl font-semibold text-gray-800 dark:text-white/90 sm:text-2xl"
    >
      {icon && (
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
          {icon}
        </span>
      )}
      {children}
    </h2>
  );
}

const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mb-2 mt-7 text-base font-semibold text-gray-800 dark:text-white/90">{children}</h3>
);

const P = ({ children }: { children: ReactNode }) => (
  <p className="mb-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:text-[15px]">{children}</p>
);

const UL = ({ children }: { children: ReactNode }) => (
  <ul className="mb-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-gray-600 marker:text-gray-400 dark:text-gray-300 sm:text-[15px]">
    {children}
  </ul>
);

const Steps = ({ children }: { children: ReactNode }) => (
  <ol className="mb-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-gray-600 marker:font-semibold marker:text-blue-800 dark:text-gray-300 dark:marker:text-blue-300 sm:text-[15px]">
    {children}
  </ol>
);

const B = ({ children }: { children: ReactNode }) => (
  <strong className="font-semibold text-gray-800 dark:text-white/90">{children}</strong>
);

const K = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded border border-gray-300 bg-gray-50 px-1.5 py-0.5 font-mono text-xs text-gray-700 dark:border-gray-700 dark:bg-white/5 dark:text-gray-300">
    {children}
  </kbd>
);

const C = ({ children }: { children: ReactNode }) => (
  <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[13px] text-gray-800 dark:bg-white/10 dark:text-gray-200">
    {children}
  </code>
);

function Callout({
  kind = "tip",
  title,
  children,
}: {
  kind?: "tip" | "warn";
  title: string;
  children: ReactNode;
}) {
  const warn = kind === "warn";
  const Icon = warn ? TriangleAlert : Lightbulb;
  return (
    <aside
      className={`my-4 flex gap-3 rounded-xl border p-4 text-sm leading-relaxed ${
        warn
          ? "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/50 dark:bg-amber-900/10 dark:text-amber-200"
          : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900/50 dark:bg-blue-900/10 dark:text-blue-200"
      }`}
    >
      <Icon size={18} className="mt-0.5 shrink-0" />
      <div>
        <p className="mb-0.5 font-semibold">{title}</p>
        <div className="[&_code]:bg-white/60 dark:[&_code]:bg-black/20">{children}</div>
      </div>
    </aside>
  );
}

function Code({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="my-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
      {label && (
        <figcaption className="border-b border-gray-200 bg-gray-50 px-3 py-1.5 font-mono text-xs text-gray-500 dark:border-gray-800 dark:bg-white/5 dark:text-gray-400">
          {label}
        </figcaption>
      )}
      <pre className="overflow-x-auto bg-gray-900 p-4 text-[13px] leading-relaxed text-gray-100">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
      <table className="w-full min-w-[32rem] text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-white/5 dark:text-gray-400">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-gray-600 dark:divide-gray-800 dark:text-gray-300">
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className={`px-3 py-2 align-top ${j === 0 ? "font-medium text-gray-800 dark:text-white/90" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GoLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="mt-1 inline-flex items-center gap-1.5 rounded-lg bg-blue-800 px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
    >
      {children} <ArrowRight size={14} />
    </Link>
  );
}

/* --------------------------- daftar isi (TOC) ----------------------- */

/** Bagian aktif = heading terakhir yang sudah melewati batas atas layar. */
function useActiveSection(): string {
  const [active, setActive] = useState<string>(SECTIONS[0]);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current: string = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 140) current = id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return active;
}

function Toc({ active }: { active: string }) {
  const { tx } = useGuide();
  return (
    <nav aria-label={tx("toc")}>
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        {tx("toc")}
      </p>
      <ul className="space-y-0.5">
        {SECTIONS.map((id) => (
          <li key={id}>
            <a
              href={`#${id}`}
              aria-current={active === id ? "location" : undefined}
              className={`block rounded-md px-2.5 py-1.5 text-sm transition-colors ${
                active === id
                  ? "bg-blue-50 font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white/90"
              }`}
            >
              {tx(`sections.${id}`)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ------------------------------- alur ------------------------------- */

const FLOW = [
  { key: "settings", icon: SlidersHorizontal },
  { key: "pageMaker", icon: LayoutTemplate },
  { key: "website", icon: Globe },
  { key: "export", icon: Download },
] as const;

function Flow() {
  const { tx } = useGuide();
  return (
    <ol className="my-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {FLOW.map((f, i) => {
        const Icon = f.icon;
        return (
          <li key={f.key} className="relative rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <span className="absolute right-3 top-3 text-xs font-semibold text-gray-300 dark:text-gray-600">0{i + 1}</span>
            <Icon size={20} className="mb-2 text-blue-800 dark:text-blue-300" />
            <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{tx(`flow.${f.key}.title`)}</p>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{tx(`flow.${f.key}.text`)}</p>
          </li>
        );
      })}
    </ol>
  );
}

/** Daftar butir dari locales (`guide.<key>` berupa array string). */
function Items({ k, ordered = false }: { k: string; ordered?: boolean }) {
  const { list } = useGuide();
  const items = list(k).map((it, i) => <li key={i}>{rich(it)}</li>);
  return ordered ? <Steps>{items}</Steps> : <UL>{items}</UL>;
}

/** Tabel dari locales: `guide.<key>.head` (array) + `guide.<key>.rows` (array baris). */
function GTable({ k }: { k: string }) {
  const { list, rows } = useGuide();
  return <Table head={list(`${k}.head`)} rows={rows(`${k}.rows`)} />;
}

/* ------------------------------ halaman ----------------------------- */

export default function Dokumentasi() {
  const active = useActiveSection();
  const { tx, r } = useGuide();

  return (
    <>
      <AppMeta title={tx("meta.title")} description={tx("meta.description")} />
      <div className="rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/3 xl:px-10 xl:py-10">
        <header className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300">
            <Blocks size={24} />
          </span>
          <h1 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90 sm:text-3xl">{tx("title")}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 sm:text-base">{tx("intro")}</p>
        </header>

        {/* TOC mobile */}
        <details className="mx-auto mt-6 max-w-3xl rounded-xl border border-gray-200 p-3 dark:border-gray-800 lg:hidden">
          <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">{tx("toc")}</summary>
          <div className="mt-3">
            <Toc active={active} />
          </div>
        </details>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <Toc active={active} />
            </div>
          </aside>

          <article className="min-w-0 max-w-3xl">
            {/* ------------------------------ ALUR ------------------------------ */}
            <section className="mb-14">
              <H2 id="alur">{tx("sections.alur")}</H2>
              <P>{r("alur.intro")}</P>
              <Flow />
              <Items k="alur.items" />
            </section>

            {/* ------------------------- GLOBAL SETTING ------------------------- */}
            <section className="mb-14">
              <H2 id="global-setting" icon={<SlidersHorizontal size={18} />}>
                {tx("sections.global-setting")}
              </H2>
              <P>{r("gs.intro")}</P>

              <H3>{tx("gs.iconsTitle")}</H3>
              <Items k="gs.iconSteps" ordered />
              <P>{r("gs.iconsUse")}</P>
              <Callout kind="warn" title={tx("gs.iconDeleteTitle")}>
                {r("gs.iconDeleteText")}
              </Callout>

              <H3>{tx("gs.fontsTitle")}</H3>
              <P>{r("gs.fontSources")}</P>
              <GTable k="gs.fontTable" />
              <Items k="gs.fontSteps" ordered />

              <H3>{tx("gs.baseTitle")}</H3>
              <P>{r("gs.baseText")}</P>

              <H3>{tx("gs.useTitle")}</H3>
              <P>{r("gs.useText")}</P>
              <Callout title={tx("gs.renameTitle")}>{r("gs.renameText")}</Callout>
              <GoLink to={GLOBAL_SETTING_PATH}>{tx("gs.open")}</GoLink>
            </section>

            {/* ---------------------------- PAGE MAKER --------------------------- */}
            <section className="mb-14">
              <H2 id="page-maker" icon={<LayoutTemplate size={18} />}>
                {tx("sections.page-maker")}
              </H2>
              <P>{r("pm.intro")}</P>

              <H3>{tx("pm.ruleTitle")}</H3>
              <P>{r("pm.ruleText")}</P>
              <P>{r("pm.ruleRow")}</P>

              <H3>{tx("pm.presetsTitle")}</H3>
              <P>{r("pm.presetsText")}</P>
              <GTable k="pm.presetTable" />
              <P>{r("pm.presetsNote")}</P>

              <H3>{tx("pm.fillTitle")}</H3>
              <Items k="pm.fillSteps" ordered />
              <H3>{tx("pm.plusTitle")}</H3>
              <Items k="pm.plusItems" />
              <H3>{tx("pm.rowStyleTitle")}</H3>
              <P>{r("pm.rowStyleText")}</P>
              <P>{r("pm.rowWidthText")}</P>
              <GTable k="pm.rowWidthTable" />
              <P>{r("pm.rowWidthNote")}</P>

              <H3>{tx("pm.settingsTitle")}</H3>
              <P>{r("pm.settingsText")}</P>
              <GTable k="pm.sectionTable" />
              <P>{r("pm.pageSettings")}</P>

              <H3>{tx("pm.modesTitle")}</H3>
              <Items k="pm.modesItems" />
              <Callout kind="warn" title={tx("pm.limitTitle")}>
                {r("pm.limitText")}
              </Callout>
              <GoLink to="/page-maker">{tx("pm.open")}</GoLink>
            </section>

            {/* ----------------------------- BACKGROUND ---------------------------- */}
            <section className="mb-14">
              <H2 id="background" icon={<Palette size={18} />}>
                {tx("sections.background")}
              </H2>
              <P>{r("bg.intro")}</P>
              <GTable k="bg.table" />
              <Callout title={tx("bg.uploadTitle")}>{r("bg.uploadText")}</Callout>
            </section>

            {/* ----------------------------- JAVASCRIPT ---------------------------- */}
            <section className="mb-14">
              <H2 id="javascript" icon={<Code2 size={18} />}>
                {tx("sections.javascript")}
              </H2>
              <P>{r("js.intro")}</P>
              <Code label={tx("js.sampleLabel")}>{`on(element, "click", function (event) {
  event.preventDefault();
  element.textContent = "Terima kasih!";
  console.log("Tombol diklik", event);
});`}</Code>
              <Items k="js.items" />
            </section>

            {/* ------------------------------ LANJUTAN ----------------------------- */}
            <section className="mb-14">
              <H2 id="lanjutan" icon={<Braces size={18} />}>
                {tx("sections.lanjutan")}
              </H2>
              <P>{r("adv.intro")}</P>
              <GTable k="adv.table" />
              <Code label={tx("adv.cssLabel")}>{`color: #0f172a;
&:hover { opacity: .9; }
h2 { margin: 0; }
@media (max-width: 640px) { & { padding: 12px; } }`}</Code>
              <Code label={tx("adv.jsLabel")}>{`on(element, "click", () => element.classList.toggle("aktif"));
const t = setInterval(() => console.log("tick"), 1000);
onCleanup(() => clearInterval(t));`}</Code>
              <Items k="adv.items" />
            </section>

            {/* ------------------------------ LIBRARY ------------------------------ */}
            <section className="mb-14">
              <H2 id="library" icon={<Library size={18} />}>
                {tx("sections.library")}
              </H2>
              <P>{r("lib.intro")}</P>
              <GTable k="lib.table" />
              <H3>{tx("lib.useTitle")}</H3>
              <Items k="lib.steps" ordered />
              <Code label={tx("lib.codeLabel")}>{`<!-- di dalam <head> -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" />

<section data-aos="fade-up" data-aos-duration="700">...</section>

<!-- sebelum </body> -->
<script src="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.js"></script>
<script>
  if (window.AOS) AOS.init({ duration: 700, once: true });
</script>`}</Code>
              <Items k="lib.items" />
            </section>

            {/* ---------------------------- CODE ELEMENT ---------------------------- */}
            <section className="mb-14">
              <H2 id="code-element" icon={<FileCode2 size={18} />}>
                {tx("sections.code-element")}
              </H2>
              <P>{r("code.intro")}</P>
              <Items k="code.items" />
            </section>

            {/* ------------------------------ MENU ------------------------------ */}
            <section className="mb-14">
              <H2 id="menu" icon={<MenuIcon size={18} />}>
                {tx("sections.menu")}
              </H2>
              <P>{r("menu.intro")}</P>
              <Items k="menu.items" />
              <GTable k="menu.table" />
            </section>

            {/* ----------------------------- WEBSITE ----------------------------- */}
            <section className="mb-14">
              <H2 id="website" icon={<Globe size={18} />}>
                {tx("sections.website")}
              </H2>
              <P>{r("site.intro")}</P>
              <Items k="site.steps" ordered />
              <Items k="site.items" />
              <GTable k="site.table" />
              <Items k="site.exportItems" />
              <GoLink to="/website">{tx("site.open")}</GoLink>
            </section>

            {/* ---------------------------- TEMPLATES ---------------------------- */}
            <section className="mb-14">
              <H2 id="templates" icon={<Store size={18} />}>
                {tx("sections.templates")}
              </H2>
              <P>{r("tpl.intro")}</P>
              <GTable k="tpl.table" />
              <H3>{tx("tpl.useTitle")}</H3>
              <Items k="tpl.steps" ordered />
              <Items k="tpl.items" />
              <Callout title={tx("tpl.quotaTitle")}>{r("tpl.quotaText")}</Callout>
              <GoLink to={TEMPLATES_PATH}>{tx("tpl.open")}</GoLink>
            </section>

            {/* ------------------------------- KREDIT ------------------------------ */}
            {!isDemoMode() && (
              <section className="mb-14">
                <H2 id="kredit" icon={<Coins size={18} />}>
                  {tx("sections.kredit")}
                </H2>
                <GTable k="credit.table" />
                <P>{r("credit.text")}</P>
                <P>{r("credit.buy")}</P>
                <GoLink to={CREDITS_PATH}>{tx("credit.open")}</GoLink>
              </section>
            )}

            {/* ------------------------------ CONTOH ----------------------------- */}
            <section className="mb-14">
              <H2 id="contoh">{tx("example.title")}</H2>
              <P>{r("example.intro")}</P>
              <Items k="example.steps" ordered />
            </section>

            {/* ------------------------------ EXPORT ----------------------------- */}
            <section className="mb-14">
              <H2 id="export" icon={<Download size={18} />}>
                {tx("sections.export")}
              </H2>
              <GTable k="export.table" />
              <P>{r("export.quota")}</P>
              <P>{r("export.names")}</P>
              <Code label="App.jsx">{`import CustomPage from "./CustomPage";

export default function App() {
  return <CustomPage />;
}`}</Code>
              <Items k="export.items" />
              <Callout kind="warn" title={tx("export.backupTitle")}>
                {r("export.backupText")}
              </Callout>
            </section>

            {/* ------------------------------- TIPS ------------------------------ */}
            <section className="mb-4">
              <H2 id="tips">{tx("sections.tips")}</H2>
              <GTable k="tips.table" />
              <Callout title={tx("tips.habitTitle")}>{r("tips.habitText")}</Callout>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}
