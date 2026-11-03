import type { GeneratedFile } from "../../core/ui/CodeExportPanel";
import type { Framework } from "../../core/helpers/generatorCss";
import { uniqueCollections, type CollectionDef } from "../collections";
import { injectBeforeBodyEnd } from "./common";
import { laravelCrudFiles, laravelCrudReadme, laravelRoutes } from "./laravel";
import { expressCrudFiles, expressReadme } from "./express";

/* ================================================================== */
/* "Include CRUD": gabungkan kode backend ke berkas ekspor halaman.      */
/*                                                                    */
/*   laravel  → format Laravel Blade + Model/Migration/Controller/...    */
/*   express  → format HTML dipindah ke public/ + server Express         */
/* ================================================================== */

export type CrudStack = "laravel" | "express";

/**
 * Stack yang ditawarkan di "Include CRUD". Keputusan uji coba: hanya
 * Node.js (Express), karena proyeknya utuh dan berdiri sendiri. Generator
 * Laravel tetap ada (withCrud("laravel", …)) untuk dipakai lagi nanti
 * sebagai proyek Laravel utuh.
 */
export const ALL_CRUD_STACKS: { id: CrudStack; label: string; framework: Framework }[] = [
  { id: "laravel", label: "Laravel", framework: "blade" },
  { id: "express", label: "Node.js (Express)", framework: "html" },
];
export const CRUD_STACKS = ALL_CRUD_STACKS.filter((s) => s.id === "express");
export const DEFAULT_CRUD_STACK: CrudStack = "express";
/** Stack tersimpan → stack yang masih ditawarkan. */
export const isOfferedStack = (v: unknown): v is CrudStack => CRUD_STACKS.some((s) => s.id === v);

export const frameworkForStack = (s: CrudStack): Framework => ALL_CRUD_STACKS.find((x) => x.id === s)!.framework;
export const stackForFramework = (fw: Framework): CrudStack | null => CRUD_STACKS.find((x) => x.framework === fw)?.id ?? null;

const hasCollection = (content: string) => /\bdata-collection="/.test(content);
/** Halaman yang butuh skrip pemuat data (koleksi, halaman item, item terkait). */
const hasDynamic = (content: string) => /\bdata-(collection|item|related)="/.test(content);

/**
 * Berkas ekspor + CRUD. `files` = hasil `projectFiles` untuk framework
 * stack itu (blade / html). Koleksi kosong → berkas apa adanya.
 */
export function withCrud(stack: CrudStack, files: GeneratedFile[], collections: CollectionDef[], siteName: string): GeneratedFile[] {
  const cols = uniqueCollections(collections);
  if (!cols.length) return files;

  if (stack === "laravel") {
    const out = files.map((f) => {
      if (f.name === "routes/web.php") return { ...f, content: `${f.content.trimEnd()}\n${laravelRoutes(cols)}` };
      if (f.name === "README.md") return { ...f, content: `${f.content.trimEnd()}\n${laravelCrudReadme(cols)}` };
      if (f.name.startsWith("resources/views/pages/") && hasCollection(f.content))
        return { ...f, content: `${f.content.trimEnd()}\n\n@push('scripts')\n  <script src="{{ asset('assets/collections.js') }}" defer></script>\n@endpush\n` };
      return f;
    });
    const crud = laravelCrudFiles(cols, siteName);
    const readmeAt = out.findIndex((f) => f.name === "README.md");
    out.splice(readmeAt < 0 ? out.length : readmeAt, 0, ...crud);
    return out;
  }

  // Express: situs statis disajikan dari public/. Berkas halaman item statis
  // (<koleksi>/<slug>.html) tidak dipakai: server menyajikan /<koleksi>/:slug.
  const itemDirs = new Set(cols.map((c) => c.slug));
  const isItemFile = (name: string) => /^[a-z][a-z0-9-]*\/[^/]+\.(html|css)$/.test(name) && itemDirs.has(name.slice(0, name.indexOf("/")));
  /** Halaman item per koleksi: berkas HTML yang punya data-item="<slug>". */
  const itemPages: Record<string, string> = {};
  for (const f of files) {
    if (f.lang !== "html" || isItemFile(f.name)) continue;
    const m = /\bdata-item="([a-z][a-z0-9-]*)"/.exec(f.content);
    if (m && itemDirs.has(m[1]) && !itemPages[m[1]]) itemPages[m[1]] = f.name;
  }
  const site = files
    .filter((f) => f.name !== "README.md" && !isItemFile(f.name))
    .map((f) => ({
      ...f,
      name: `public/${f.name}`,
      content: f.lang === "html" && hasDynamic(f.content) ? injectBeforeBodyEnd(f.content, '<script src="/assets/collections.js" defer></script>') : f.content,
    }));
  const pages = site.filter((f) => f.lang === "html").map((f) => f.name.slice("public/".length));
  return [...expressCrudFiles(cols, siteName, itemPages), ...site, { name: "README.md", lang: "markdown", content: expressReadme(cols, siteName, pages) }];
}
