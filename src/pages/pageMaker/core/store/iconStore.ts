import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeId } from "../helpers/makeId";

/* ------------------------------------------------------------------ */
/* Tipe & store                                                        */
/* ------------------------------------------------------------------ */

export interface GlobalIcon {
  id: string;
  name: string;
  /** Kode SVG mentah persis seperti yang ditempel user (belum diwarnai/diresize). */
  svg: string;
  createdAt: number;
}

interface IconStore {
  icons: GlobalIcon[];
  addIcon: (name: string, svg: string) => string;
  renameIcon: (id: string, name: string) => void;
  removeIcon: (id: string) => void;
  getIcon: (id: string) => GlobalIcon | undefined;
}

/**
 * Pustaka ikon global — persist ke localStorage, jadi ikon yang ditambahkan
 * user tetap ada lintas sesi/hari, dan bisa dipakai oleh elemen maker manapun
 * (Button, Card, Badge, dst) selama mereka import store yang sama ini.
 */
export const useIconStore = create<IconStore>()(
  persist(
    (set, get) => ({
      icons: [],

      addIcon: (name, svg) => {
        const id = makeId();
        set((s) => ({
          icons: [
            {
              id,
              name: name.trim() || "Ikon tanpa nama",
              svg,
              createdAt: Date.now(),
            },
            ...s.icons,
          ],
        }));
        return id;
      },

      renameIcon: (id, name) =>
        set((s) => ({
          icons: s.icons.map((i) =>
            i.id === id ? { ...i, name: name.trim() || i.name } : i,
          ),
        })),

      removeIcon: (id) =>
        set((s) => ({ icons: s.icons.filter((i) => i.id !== id) })),

      getIcon: (id) => get().icons.find((i) => i.id === id),
    }),
    { name: "global-icon-library" },
  ),
);

/* ------------------------------------------------------------------ */
/* Utilitas SVG (dipakai bareng oleh IconPicker & elemen mana pun)      */
/* ------------------------------------------------------------------ */

/**
 * Buang deklarasi XML, DOCTYPE, dan komentar yang sering ikut tertempel
 * saat user menyalin isi file .svg (sebelumnya ditolak sebagai "tidak valid").
 */
export function normalizeSvg(raw: string): string {
  return raw
    .trim()
    .replace(/^<\?xml[\s\S]*?\?>/i, "")
    .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .trim();
}

const DANGEROUS_TAGS = ["script", "foreignObject", "iframe", "object", "embed", "style"];

/**
 * Sanitasi SVG sebelum dirender via dangerouslySetInnerHTML: buang tag
 * berbahaya, semua atribut event handler (on*, termasuk yang tanpa kutip),
 * dan href/xlink:href yang mengarah ke javascript:. Memakai DOMParser kalau
 * tersedia (lebih andal), dengan fallback regex.
 */
export function sanitizeSvg(raw: string): string {
  const input = normalizeSvg(raw);
  if (typeof DOMParser !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(input, "image/svg+xml");
      const root = doc.documentElement;
      if (root && root.nodeName.toLowerCase() === "svg" && !doc.querySelector("parsererror")) {
        DANGEROUS_TAGS.forEach((t) =>
          root.querySelectorAll(t).forEach((el) => el.remove()),
        );
        const all = [root, ...Array.from(root.querySelectorAll("*"))];
        all.forEach((el) => {
          Array.from(el.attributes).forEach((a) => {
            const name = a.name.toLowerCase();
            // eslint-disable-next-line no-control-regex -- karakter kontrol sengaja dibuang agar "java\x00script:" tidak lolos
            const val = a.value.replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
            if (name.startsWith("on")) el.removeAttribute(a.name);
            else if ((name === "href" || name === "xlink:href") && val.startsWith("javascript:"))
              el.removeAttribute(a.name);
          });
        });
        return new XMLSerializer().serializeToString(root);
      }
    } catch {
      /* jatuh ke fallback */
    }
  }
  let svg = input;
  DANGEROUS_TAGS.forEach((t) => {
    svg = svg.replace(new RegExp(`<${t}[\\s\\S]*?<\\/${t}>`, "gi"), "");
    svg = svg.replace(new RegExp(`<${t}[^>]*\\/?>`, "gi"), "");
  });
  svg = svg.replace(/\son[\w-]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
  svg = svg.replace(/\s(xlink:)?href\s*=\s*("\s*javascript:[^"]*"|'\s*javascript:[^']*')/gi, "");
  return svg;
}

/** Cek apakah teks yang ditempel memang kode SVG yang valid secara bentuk. */
export function isValidSvg(raw: string): boolean {
  return /^<svg[\s>][\s\S]*<\/svg>$/i.test(normalizeSvg(raw));
}

/**
 * Ganti semua fill/stroke (kecuali "none") jadi currentColor, supaya ikon
 * otomatis ikut warna teks di elemen tempat ia dipasang.
 */
function applyCurrentColor(svg: string): string {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/fill:\s*(?!none)[^;"']+/gi, "fill:currentColor")
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"')
    .replace(/stroke:\s*(?!none)[^;"']+/gi, "stroke:currentColor");
}

/**
 * Set width/height eksplisit HANYA pada tag <svg> pembuka. Sebelumnya regex
 * menghapus width/height dari SEMUA elemen (mis. <rect width="18">), sehingga
 * ikon yang memakai <rect>/<image> rusak. Kalau SVG tidak punya viewBox,
 * viewBox dibuat dari width/height aslinya supaya tetap bisa diskalakan.
 */
export function resizeSvg(svg: string, size: number): string {
  return svg.replace(/<svg\b[^>]*>/i, (tag) => {
    const w = tag.match(/\swidth\s*=\s*["']?([\d.]+)/i)?.[1];
    const hgt = tag.match(/\sheight\s*=\s*["']?([\d.]+)/i)?.[1];
    let out = tag.replace(/\s(width|height)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "");
    if (!/\sviewBox\s*=/i.test(out) && w && hgt) {
      out = out.replace(/<svg/i, `<svg viewBox="0 0 ${w} ${hgt}"`);
    }
    return out.replace(/<svg/i, `<svg width="${size}" height="${size}"`);
  });
}

/**
 * Fungsi utama: dari SVG mentah di pustaka -> markup siap pakai (sudah
 * disanitasi, diwarnai sesuai mode, dan diresize), dipakai baik untuk
 * preview di app maupun untuk kode yang di-export ke file.
 */
export function renderIconMarkup(
  rawSvg: string,
  size: number,
  colorMode: "currentColor" | "original",
): string {
  let svg = sanitizeSvg(rawSvg);
  if (colorMode === "currentColor") svg = applyCurrentColor(svg);
  svg = resizeSvg(svg, size);
  return svg;
}
