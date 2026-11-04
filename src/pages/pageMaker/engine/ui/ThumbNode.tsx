import type { CSSProperties, ReactElement } from "react";
import { boxRules, placeRules } from "../helpers/compose";
import type { BoxNode, ComponentNode, ElementNode } from "../helpers/componentTypes";

/** Thumbnail = the REAL layout (the same CSS rules as the preview), rendered small. */
export function ThumbNode({ node: input, parent, isRoot, leafMin = 10 }: { node: ComponentNode; parent: BoxNode | null; isRoot?: boolean; leafMin?: number }) {
  // Elements are drawn by kind (heading, paragraph, button, image, …) so
  // the thumbnail resembles what gets added.
  if (input.kind !== "box") {
    const place = parent ? placeRules(input.place, parent).base : {};
    return <ThumbElement el={input} place={place as CSSProperties} />;
  }
  const node = input;
  const own = boxRules(node).base;
  const place = placeRules(node.place, parent).base;
  const leaf = node.children.length === 0;
  const style: CSSProperties = {
    ...(own as CSSProperties),
    ...(place as CSSProperties),
    width: isRoot ? "100%" : undefined,
    height: isRoot ? "100%" : undefined,
    gap: 4,
    padding: isRoot ? 6 : 0,
    background: leaf ? undefined : "transparent",
    border: "none",
    borderRadius: leaf ? 2 : 0,
    boxShadow: "none",
    minWidth: leaf ? 12 : 0,
    minHeight: leaf ? leafMin : 0,
  };
  return (
    <div style={style} className={leaf ? "bg-gray-300 dark:bg-gray-600" : ""}>
      {node.children.map((c) => (
        <ThumbNode key={c.id} node={c} parent={node} leafMin={leafMin} />
      ))}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const H: Record<string, number> = { h1: 8, h2: 6, h3: 5, h4: 4 };

function ThumbElement({ el, place }: { el: ElementNode; place: CSSProperties }) {
  const st: any = el.state ?? {};
  const align = st.textAlign === "center" ? "center" : st.textAlign === "right" ? "flex-end" : "flex-start";
  const wrap = (child: ReactElement, extra: CSSProperties = {}) => (
    <div style={{ ...place, display: "flex", justifyContent: align, width: "100%", minWidth: 0, ...extra }}>{child}</div>
  );
  switch (el.elementType) {
    case "text": {
      const h = H[st.tag] ?? 0;
      const len = String(st.text ?? "").length;
      if (h) return wrap(<div className="rounded-sm bg-gray-400 dark:bg-gray-500" style={{ height: h, minWidth: 14, width: `${Math.min(92, 28 + len * 1.4)}%` }} />);
      return wrap(<div className="rounded-sm bg-gray-300 dark:bg-gray-600" style={{ height: 3, minWidth: 10, width: `${Math.min(100, 30 + len * 0.9)}%` }} />);
    }
    case "anchor":
    case "button": {
      const bg = typeof st.bgColor === "string" && st.bgColor !== "transparent" ? st.bgColor : undefined;
      return (
        <div
          style={{ ...place, width: st.widthMode === "full" ? "100%" : 22, height: 7, borderRadius: 3, background: bg, border: bg ? undefined : `1px solid ${st.borderColor ?? "#94a3b8"}`, flexShrink: 0 }}
          className={bg ? "" : "bg-transparent"}
        />
      );
    }
    case "image":
      return <div style={{ ...place, width: "100%", aspectRatio: st.aspectRatio ?? "4 / 3", maxHeight: 44, borderRadius: 3 }} className="bg-gray-300 dark:bg-gray-600" />;
    case "accordion":
      return (
        <div style={{ ...place, width: "100%", display: "flex", flexDirection: "column", gap: 2 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-sm border border-gray-300 dark:border-gray-600" style={{ height: 6 }} />
          ))}
        </div>
      );
    default:
      return <div style={{ ...place, minWidth: 12, minHeight: 6, borderRadius: 2 }} className="bg-gray-300 dark:bg-gray-600" />;
  }
}
