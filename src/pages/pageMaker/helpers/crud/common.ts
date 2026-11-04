import { NO_IMAGE, type CollectionDef, type CollectionField, type ItemValues } from "../collections";

/* ================================================================== */
/* Shared part of the CRUD generators (Laravel & Express)                */
/* ================================================================== */

export interface CrudNames {
  /** "produk-kopi" (URL, view/file name). */
  slug: string;
  /** "ProdukKopi" (kelas). */
  model: string;
  /** "produk_kopi" (table). */
  table: string;
  /** "produkKopi" (variabel JS). */
  camel: string;
  /** "Produk Kopi" (UI label). */
  label: string;
}

const words = (slug: string) => slug.split(/[^a-z0-9]+/i).filter(Boolean);
const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);

export function crudNames(c: CollectionDef): CrudNames {
  const w = words(c.slug);
  const model = w.map(cap).join("") || "Item";
  return {
    slug: c.slug,
    model: /^[A-Z]/.test(model) ? model : `Data${model}`,
    table: w.join("_") || "items",
    camel: model.charAt(0).toLowerCase() + model.slice(1),
    label: c.name,
  };
}

export const isNumeric = (f: CollectionField) => f.type === "price" || f.type === "number" || f.type === "rating";

/** Item value for the seed (numbers stay numbers, empty text → null unless required). */
export function seedRow(c: CollectionDef, v: ItemValues): Record<string, string | number | null> {
  const out: Record<string, string | number | null> = {};
  for (const f of c.fields) {
    const x = v[f.key];
    if (isNumeric(f)) {
      const n = Number(x) || 0;
      out[f.key] = f.key === "compare_price" && !n ? null : n;
    } else {
      const s = String(x ?? "");
      out[f.key] = s || f.required ? s : null;
    }
  }
  return out;
}

/** Searchable text columns (name, description, label). */
export const searchFields = (c: CollectionDef) => c.fields.filter((f) => f.type === "text" || f.type === "textarea" || f.type === "label" || f.type === "category").map((f) => f.key);

/** Columns shown in the dashboard table. */
export const tableFields = (c: CollectionDef) => c.fields.filter((f) => f.type !== "textarea");

/**
 * Public page script: fetches data from `/api/<slug>` and rebuilds the
 * cards in the `[data-collection]` element using the first card as the
 * pattern. When the API fails, the static cards from the design still show.
 */
export function collectionsScript(): string {
  return `/* Data collection loader (made by OneWebDev).
 * Elements [data-collection="<slug>"] are refilled from GET /api/<slug>.
 * Item page /<slug>/<item>: [data-item] is filled from GET /api/<slug>/<item>,
 * [data-related] from GET /api/<slug>/<item>/related.
 * Chips [data-filter="<slug>"] filter cards by category (?kategori=),
 * and the chip list follows GET /api/<slug>/kategori.
 * The first card is used as the pattern; if the API fails, the static cards stay visible. */
(function () {
  "use strict";
  // Marker: the category filter is handled by this script (the page's static script stops).
  window.OWD_COLLECTIONS = true;
  var API_BASE = (document.querySelector('meta[name="api-base"]') || {}).content || "";
  var NO_IMAGE = "${NO_IMAGE}";

  function rupiah(n) {
    return "Rp" + Math.round(Number(n) || 0).toLocaleString("id-ID");
  }
  function safeUrl(u) {
    u = String(u || "");
    return /^(https?:\\/\\/|data:image\\/|\\/|\\.\\/|assets\\/)/i.test(u) ? u : "";
  }
  function part(root, name) {
    return root.querySelector('[class*="__' + name + '"]');
  }
  function baseClass(card) {
    var list = String(card.className || "").split(/\\s+/);
    for (var i = 0; i < list.length; i++) if (/__product-card-\\d+$/.test(list[i])) return list[i];
    return list[0] || "card";
  }

  function fill(tpl, it) {
    var el = tpl.cloneNode(true);
    var card = el.matches && el.matches("article") ? el : el.querySelector("article");
    if (!card) return el;
    var base = baseClass(card);
    var img = part(card, "image");
    if (img) {
      img.setAttribute("src", safeUrl(it.image_url) || NO_IMAGE);
      img.setAttribute("alt", it.name || "");
    }
    var badge = part(card, "badge");
    if (it.label) {
      if (!badge) {
        badge = document.createElement("span");
        badge.className = base + "__badge";
        card.insertBefore(badge, img ? img.nextSibling : card.firstChild);
      }
      badge.textContent = it.label;
    } else if (badge) badge.remove();
    var name = part(card, "name");
    if (name) name.textContent = it.name || "";
    var rating = part(card, "rating");
    if (rating) {
      var r = Math.max(0, Math.min(5, Number(it.rating) || 0));
      var stars = part(rating, "stars");
      if (stars) stars.textContent = "\\u2605".repeat(Math.round(r)) + "\\u2606".repeat(5 - Math.round(r));
      var count = rating.lastElementChild;
      if (count && count !== stars) count.textContent = r.toFixed(1) + (it.reviews ? " (" + it.reviews + ")" : "");
    }
    var now = part(card, "now");
    if (now) now.textContent = rupiah(it.price);
    var was = part(card, "was");
    if (it.compare_price) {
      if (!was && now) {
        was = document.createElement("s");
        was.className = base + "__was";
        now.parentNode.appendChild(was);
      }
      if (was) was.textContent = rupiah(it.compare_price);
    } else if (was) was.remove();
    var text = part(card, "text");
    if (text) text.textContent = it.description || "";
    // Item page: card buttons go to /<collection>/<slug>.
    var cta = part(card, "cta");
    if (cta && it.url) cta.setAttribute("href", it.url);
    if (it.category) el.setAttribute("data-category", it.category);
    else el.removeAttribute("data-category");
    el.style.display = "";
    return el;
  }

  /* ---------- item page (detail) ---------- */

  function stars(r) {
    var n = Math.round(r);
    return "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  }
  function fieldText(f, it) {
    switch (f) {
      case "price":
        return it.price ? rupiah(it.price) : "";
      case "compare_price":
        return it.compare_price ? rupiah(it.compare_price) : "";
      case "rating": {
        var r = Math.max(0, Math.min(5, Number(it.rating) || 0));
        return r ? stars(r) + " " + r.toFixed(1) + (it.reviews ? " (" + it.reviews + ")" : "") : "";
      }
      default:
        return it[f] == null ? "" : String(it[f]);
    }
  }
  function fillItem(box, it) {
    box.querySelectorAll("[data-field]").forEach(function (el) {
      var f = el.getAttribute("data-field");
      if (f === "image") {
        var img = el.tagName === "IMG" ? el : el.querySelector("img");
        if (img) {
          img.setAttribute("src", safeUrl(it.image_url) || NO_IMAGE);
          img.setAttribute("alt", it.name || "");
        }
        return;
      }
      var v = fieldText(f, it);
      el.textContent = v;
      if (v) el.removeAttribute("data-empty");
      else el.setAttribute("data-empty", "");
    });
  }
  /** Item slug from the address /<collection>/<slug> or /<collection>/<slug>.html; null when it is not an item address. */
  function itemSlug(col) {
    var parts = location.pathname.split("/").filter(Boolean);
    var i = parts.lastIndexOf(col);
    if (i < 0 || i !== parts.length - 2) return null;
    return decodeURIComponent(parts[i + 1]).replace(/\\.html$/, "");
  }
  function getJson(url) {
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    });
  }
  function loadItem(box) {
    var col = box.getAttribute("data-item");
    var slug = col && itemSlug(col);
    if (!slug) return;
    getJson(API_BASE + "/api/" + encodeURIComponent(col) + "/" + encodeURIComponent(slug))
      .then(function (json) {
        if (!json || !json.data) return;
        fillItem(box, json.data);
        if (json.data.name) document.title = json.data.name + (document.title.indexOf(" \u2014 ") > 0 ? document.title.slice(document.title.indexOf(" \u2014 ")) : "");
      })
      .catch(function (err) {
        console.warn("[item " + col + "/" + slug + "] data server tidak dimuat.", err);
      });
  }
  function loadRelated(grid) {
    var col = grid.getAttribute("data-related");
    var slug = col && itemSlug(col);
    var first = grid.firstElementChild;
    if (!slug || !first) return;
    var tpl = first.cloneNode(true);
    var limit = Math.max(1, Math.min(12, parseInt(grid.getAttribute("data-limit"), 10) || 3));
    getJson(API_BASE + "/api/" + encodeURIComponent(col) + "/" + encodeURIComponent(slug) + "/related?limit=" + limit)
      .then(function (json) {
        var rows = (json && json.data) || [];
        var frag = document.createDocumentFragment();
        rows.forEach(function (it) {
          frag.appendChild(fill(tpl, it));
        });
        grid.replaceChildren(frag);
      })
      .catch(function (err) {
        console.warn("[terkait " + col + "] data server tidak dimuat.", err);
      });
  }

  var EN = /^en\b/i.test(document.documentElement.lang || "");
  var TXT = EN
    ? { prev: "Previous", next: "Next", more: "Load more", loading: "Loading…", page: "Page" }
    : { prev: "Sebelumnya", next: "Berikutnya", more: "Muat lagi", loading: "Memuat…", page: "Halaman" };

  function injectStyle() {
    if (document.getElementById("owd-collection-style")) return;
    var st = document.createElement("style");
    st.id = "owd-collection-style";
    st.textContent =
      ".owd-col-nav{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:6px;margin:16px 0 0}" +
      ".owd-col-nav button{font:inherit;font-size:14px;min-width:38px;padding:8px 12px;border-radius:8px;border:1px solid rgba(0,0,0,.15);background:#fff;color:inherit;cursor:pointer}" +
      ".owd-col-nav button[aria-current=page]{background:#1f2937;border-color:#1f2937;color:#fff}" +
      ".owd-col-nav button:disabled{opacity:.45;cursor:default}" +
      ".owd-col-nav [hidden]{display:none}" +
      ".owd-col-gap{padding:0 4px;opacity:.6}";
    document.head.appendChild(st);
  }

  /** Active category (chip) or the fixed category from the design, plus sort order. */
  function query(grid) {
    var cat = grid.__owdCategory != null ? grid.__owdCategory : grid.getAttribute("data-view-category") || "";
    var sort = grid.getAttribute("data-sort") || "";
    return (cat ? "&kategori=" + encodeURIComponent(cat) : "") + (sort ? "&sort=" + encodeURIComponent(sort) : "");
  }

  function getPage(slug, page, perPage, extra) {
    var url = API_BASE + "/api/" + encodeURIComponent(slug) + "?page=" + page + "&per_page=" + perPage + (extra || "");
    return fetch(url, { headers: { Accept: "application/json" } }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (json) {
      var meta = (json && json.meta) || {};
      return { rows: (json && json.data) || [], page: Number(meta.page) || page, last: Number(meta.last_page) || 1 };
    });
  }

  function render(grid, tpl, rows, append) {
    var frag = document.createDocumentFragment();
    rows.forEach(function (it) {
      frag.appendChild(fill(tpl, it));
    });
    if (append) grid.appendChild(frag);
    else grid.replaceChildren(frag);
  }

  function button(label, onClick) {
    var b = document.createElement("button");
    b.type = "button";
    var s = document.createElement("span");
    s.textContent = label;
    b.appendChild(s);
    b.addEventListener("click", onClick);
    return b;
  }

  /** Page numbers shown: 1 … p-1 p p+1 … last. */
  function pageList(p, last) {
    var out = [];
    for (var i = 1; i <= last; i++) if (i === 1 || i === last || Math.abs(i - p) <= 1) out.push(i);
    return out;
  }

  function load(grid) {
    var slug = grid.getAttribute("data-collection");
    var first = grid.firstElementChild;
    if (!slug || !first) return;
    var tpl = first.cloneNode(true);
    var mode = grid.getAttribute("data-collection-mode") || "all";
    var per = Math.max(1, Math.min(100, parseInt(grid.getAttribute("data-per-page"), 10) || 6));
    var fail = function (err) {
      console.warn("[koleksi " + slug + "] data server tidak dimuat, kartu statis dipakai.", err);
    };

    if (mode === "all") {
      grid.__owdReload = function () {
        getPage(slug, 1, 100, query(grid)).then(function (r) { render(grid, tpl, r.rows, false); }).catch(fail);
      };
      grid.__owdReload();
      return;
    }

    injectStyle();
    var nav = document.createElement("nav");
    nav.className = "owd-col-nav";
    nav.setAttribute("aria-label", slug);
    grid.insertAdjacentElement("afterend", nav);
    var state = { page: 0, last: 1, busy: false };

    if (mode === "pages") {
      var go = function (p) {
        if (state.busy) return;
        state.busy = true;
        getPage(slug, p, per, query(grid)).then(function (r) {
          render(grid, tpl, r.rows, false);
          state.page = r.page;
          state.last = r.last;
          drawPages();
          if (state.page !== 1 || p !== 1) {
            var top = grid.getBoundingClientRect().top;
            if (top < 0) grid.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }).catch(fail).then(function () { state.busy = false; });
      };
      var drawPages = function () {
        nav.replaceChildren();
        if (state.last <= 1) return;
        var prev = button("‹ " + TXT.prev, function () { go(state.page - 1); });
        prev.disabled = state.page <= 1;
        nav.appendChild(prev);
        var shown = pageList(state.page, state.last);
        shown.forEach(function (n, i) {
          if (i && n - shown[i - 1] > 1) {
            var gap = document.createElement("span");
            gap.className = "owd-col-gap";
            gap.textContent = "…";
            nav.appendChild(gap);
          }
          var b = button(String(n), function () { go(n); });
          b.setAttribute("aria-label", TXT.page + " " + n);
          if (n === state.page) b.setAttribute("aria-current", "page");
          nav.appendChild(b);
        });
        var next = button(TXT.next + " ›", function () { go(state.page + 1); });
        next.disabled = state.page >= state.last;
        nav.appendChild(next);
      };
      grid.__owdReload = function () { state.busy = false; go(1); };
      go(1);
      return;
    }

    // "more" and "scroll": the next page is appended at the end.
    var more = button(TXT.more, function () { next(); });
    more.hidden = true;
    if (mode === "more") nav.appendChild(more);
    var next = function () {
      if (state.busy || (state.page && state.page >= state.last)) return;
      state.busy = true;
      more.disabled = true;
      more.firstChild.textContent = TXT.loading;
      getPage(slug, state.page + 1, per, query(grid)).then(function (r) {
        render(grid, tpl, r.rows, state.page > 0);
        state.page = r.page;
        state.last = r.last;
      }).catch(fail).then(function () {
        state.busy = false;
        more.disabled = false;
        more.firstChild.textContent = TXT.more;
        more.hidden = state.page >= state.last || !state.page;
        if (mode === "scroll") nearEnd();
      });
    };

    if (mode === "scroll") {
      var prevBtn = button("‹", function () { grid.scrollBy({ left: -grid.clientWidth * 0.9 }); });
      var nextBtn = button("›", function () { grid.scrollBy({ left: grid.clientWidth * 0.9 }); });
      prevBtn.setAttribute("aria-label", TXT.prev);
      nextBtn.setAttribute("aria-label", TXT.next);
      nav.appendChild(prevBtn);
      nav.appendChild(nextBtn);
      var nearEnd = function () {
        var room = grid.scrollWidth - grid.clientWidth - grid.scrollLeft;
        prevBtn.disabled = grid.scrollLeft <= 2;
        nextBtn.disabled = room <= 2 && state.page >= state.last;
        if (room < grid.clientWidth * 0.5) next();
      };
      grid.addEventListener("scroll", nearEnd, { passive: true });
      window.addEventListener("resize", nearEnd);
    }
    grid.__owdReload = function () {
      state.page = 0;
      state.last = 1;
      state.busy = false;
      if (mode === "scroll") grid.scrollLeft = 0;
      next();
    };
    next();
  }

  /* ---------- chip filter kategori ---------- */

  function setChipText(chip, text) {
    var walker = document.createTreeWalker(chip, NodeFilter.SHOW_TEXT);
    for (var n = walker.nextNode(); n; n = walker.nextNode()) {
      if (n.nodeValue.trim()) {
        n.nodeValue = text;
        return;
      }
    }
    chip.appendChild(document.createTextNode(text));
  }

  function initFilter(bar) {
    var slug = bar.getAttribute("data-filter");
    var chips = Array.prototype.slice.call(bar.querySelectorAll("[data-chip]"));
    if (!slug || !chips.length) return;
    var active = chips.filter(function (c) { return c.getAttribute("aria-pressed") === "true"; })[0] || chips[0];
    var idle = chips.filter(function (c) { return c !== active; })[0] || active;
    var activeCls = active.className;
    var idleCls = idle.className;
    var idleTpl = idle.cloneNode(true);
    var allChip = chips.filter(function (c) { return c.getAttribute("data-chip") === ""; })[0];

    function select(chip, silent) {
      chips.forEach(function (c) {
        var on = c === chip;
        c.className = on ? activeCls : idleCls;
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (silent) return;
      var cat = chip.getAttribute("data-chip") || "";
      document.querySelectorAll('[data-collection="' + slug + '"]').forEach(function (grid) {
        grid.__owdCategory = cat;
        if (grid.__owdReload) grid.__owdReload();
      });
    }
    function wire(chip) {
      chip.addEventListener("click", function (e) {
        e.preventDefault();
        select(chip);
      });
      chip.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select(chip);
        }
      });
    }
    chips.forEach(wire);

    // Chips follow the latest categories in the database (new categories from the admin show up too).
    if (!allChip) return;
    getJson(API_BASE + "/api/" + encodeURIComponent(slug) + "/kategori")
      .then(function (json) {
        var cats = (json && json.data) || [];
        if (!cats.length) return;
        var parent = allChip.parentNode;
        chips.forEach(function (c) { if (c !== allChip) c.remove(); });
        chips = [allChip];
        cats.forEach(function (cat) {
          var c = idleTpl.cloneNode(true);
          setChipText(c, cat);
          c.setAttribute("data-chip", cat);
          c.className = idleCls;
          c.setAttribute("aria-pressed", "false");
          parent.appendChild(c);
          chips.push(c);
          wire(c);
        });
        select(allChip, true);
      })
      .catch(function (err) {
        console.warn("[koleksi " + slug + "] kategori tidak dimuat.", err);
      });
  }

  function init() {
    document.querySelectorAll("[data-collection]").forEach(load);
    document.querySelectorAll("[data-filter]").forEach(initFilter);
    document.querySelectorAll("[data-item]").forEach(loadItem);
    document.querySelectorAll("[data-related]").forEach(loadRelated);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
`;
}

/** Insert a `<script>` before `</body>` (static HTML). */
export function injectBeforeBodyEnd(html: string, tag: string): string {
  const i = html.toLowerCase().lastIndexOf("</body>");
  return i < 0 ? `${html}\n${tag}\n` : `${html.slice(0, i)}  ${tag}\n${html.slice(i)}`;
}
