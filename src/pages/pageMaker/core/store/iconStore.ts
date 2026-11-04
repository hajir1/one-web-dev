import { create } from "zustand";
import { persist } from "zustand/middleware";
import { makeId } from "../helpers/makeId";

/* ------------------------------------------------------------------ */
/* Tipe & store                                                        */
/* ------------------------------------------------------------------ */

export interface GlobalIcon {
  id: string;
  name: string;
  /** Raw SVG code exactly as the user pasted it (not yet colored/resized). */
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
 * Global icon library: persisted to localStorage, so icons the user adds
 * survive across sessions/days and can be used by any element maker
 * (Button, Card, Badge, etc.) as long as they import this same store.
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
/* SVG utilities (shared by IconPicker & any element)                   */
/* ------------------------------------------------------------------ */

/**
 * Strips XML declarations, DOCTYPEs, and comments that often get pasted along
 * when the user copies the content of an .svg file (previously rejected as "invalid").
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
 * Sanitizes SVG before rendering via dangerouslySetInnerHTML: drops dangerous
 * tags, every event handler attribute (on*, including unquoted ones),
 * and href/xlink:href pointing to javascript:. Uses DOMParser when
 * available (more reliable), with a regex fallback.
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
            // eslint-disable-next-line no-control-regex -- control characters are stripped on purpose so "java\x00script:" cannot slip through
            const val = a.value.replace(/[\s\u0000-\u001f]/g, "").toLowerCase();
            if (name.startsWith("on")) el.removeAttribute(a.name);
            else if ((name === "href" || name === "xlink:href") && val.startsWith("javascript:"))
              el.removeAttribute(a.name);
          });
        });
        return new XMLSerializer().serializeToString(root);
      }
    } catch {
      /* fall back */
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

/** Checks whether the pasted text is SVG code with a valid shape. */
export function isValidSvg(raw: string): boolean {
  return /^<svg[\s>][\s\S]*<\/svg>$/i.test(normalizeSvg(raw));
}

/**
 * Replaces every fill/stroke (except "none") with currentColor, so the icon
 * automatically follows the text color of the element it is placed in.
 */
function applyCurrentColor(svg: string): string {
  return svg
    .replace(/fill="(?!none)[^"]*"/gi, 'fill="currentColor"')
    .replace(/fill:\s*(?!none)[^;"']+/gi, "fill:currentColor")
    .replace(/stroke="(?!none)[^"]*"/gi, 'stroke="currentColor"')
    .replace(/stroke:\s*(?!none)[^;"']+/gi, "stroke:currentColor");
}

/**
 * Sets an explicit width/height ONLY on the opening <svg> tag. Previously a regex
 * removed width/height from EVERY element (e.g. <rect width="18">), which broke
 * icons using <rect>/<image>. When the SVG has no viewBox,
 * one is created from its original width/height so it can still scale.
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
 * The main function: raw SVG from the library → ready-to-use markup (already
 * sanitized, colored per mode, and resized), used both for the
 * in-app preview and for the code exported to files.
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
