import JSZip from "jszip";
import { packAssets, type AssetSource } from "../../../assetLibrary/pack";
import { codeTemplateMeta, codeTemplateReadme, loadCodeTemplate } from "./catalog";

/** Zip Template Kode: <folder>/index.html + <folder>/README.md (+ assets/img/ bila memakai Pustaka Aset). */
export async function buildCodeZip(id: string, html: string, name: string, lang: "id" | "en", folder = id, assets?: AssetSource): Promise<{ blob: Blob; fileName: string }> {
  const meta = codeTemplateMeta(id);
  if (!meta) throw new Error("TEMPLATE_NOT_FOUND");
  const zip = new JSZip();
  const dir = zip.folder(folder)!;
  // v21: gambar Pustaka Aset → <folder>/assets/img/… (dirujuk relatif dari index.html).
  const packed = assets ? await packAssets([{ name: "index.html", content: html }], "static", assets) : null;
  dir.file("index.html", packed ? packed.files[0].content : html);
  for (const b of packed?.binaries ?? []) dir.file(b.name, b.blob);
  dir.file("README.md", codeTemplateReadme(meta, name, lang));
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
  return { blob, fileName: `${folder}.zip` };
}

/** Zip template asli (tanpa perubahan). */
export async function buildCodeTemplateZip(id: string, name: string, lang: "id" | "en"): Promise<{ blob: Blob; fileName: string }> {
  return buildCodeZip(id, await loadCodeTemplate(id), name, lang);
}
