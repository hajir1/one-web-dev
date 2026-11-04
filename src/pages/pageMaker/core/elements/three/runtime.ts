/* ================================================================== */
/* 3D element runtime (v9): one source for the preview & every export   */
/*                                                                    */
/* Three.js 0.186.1 (MIT, pinned version) is loaded via dynamic import() */
/* from jsDelivr ONLY when a 3D element approaches the screen. Rendering pauses */
/* while the element is not visible / the tab is hidden, the pixel ratio is capped, */
/* the point count is reduced on phones, and the static image still shows when */
/* WebGL is not available. The 3D card uses CSS only (no Three.js).     */
/*                                                                    */
/* Written as plain JavaScript (no backticks) so it can be               */
/* inserted as is into script.js (HTML) and the owd3d.js /               */
/* owd-3d.ts (React, Vue, Svelte, Angular).                             */
/* ================================================================== */

export const THREE_VERSION = "0.186.1";
export const THREE_ESM_URL = `https://cdn.jsdelivr.net/npm/three@${THREE_VERSION}/+esm`;

export const OWD3D_RUNTIME = String.raw`var OWD3D = (typeof window !== "undefined" && window.OWD3D) || (function () {
  "use strict";
  var VERSION = "0.186.1";
  var BASE = "https://cdn.jsdelivr.net/npm/three@" + VERSION;
  var URLS = { core: BASE + "/+esm", gltf: BASE + "/examples/jsm/loaders/GLTFLoader.js/+esm" };
  // 128×64 land map (1 bit per cell) from Natural Earth 110m (public domain) via world-atlas (ISC).
  var LAND = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+AH/AAAAAAAAAAAAAAAAwH///wHAAwAABgAAAAAAYAAO//8BIAAAADAAAAAAAAAAA/D/AQAAEIB/AAAAAADYdz/w/wAAAAz//z8cAOD/P8nlwH8AwB9A+////+/v////weMHBvCv////////yP///8DBAQB4/////////+D3/z9wAAEAPP//////fxwAA/9/4AMAQDD+/////wMDAAD8//cHAOCI//////+AAwAA+P/3DwDA////////BwAAAPj//xgAgP///////wcAAADw//8HAID/3/n///8FAAAA8P9/AACg18P9////DAAAAPD/PwAA4KD/+///PwAAAADw/x8AAOAQ//n//zMCAAAA4P8fAADAD+D///+jAwAAAMD/BwAA4J/w////RwAAAAAAvwQAAPD///3//wcAAAAAAB4YAAD4/+/7//8HAAAAAAAcAAAA/P/fD///AwAAAAAAGBEAAPz/3x9+PgAAAAAAALhRAQD8/78PPDwAAAAAAACAAwAA/P+/Awx4AAAAAAAAAAIAAPz//wAIeAAAAAAAAACkAwD4//8DCCAAAAAAAAAA8AcA8P//AxAIEAAAAAAAAPA/AAD4/wEAFAIAAAAAAADwPwAA+P8AAIgzAAAAAAAA+P8AAPh/AACQjQAAAAAAAPj/BwDwPwAAMAgPAAAAAADw/w8A4D8AAMAADgAAAAAA8P8HAOA/AAAABBAAAAAAAOD/AwDgPwIAAMAFAAAAAADg/wMA8D8CAADwDAAAAAAAgP8DAPAfAwAA+A8AAAAAAID/AQDgDwEAAP4fAAAAAACA/wAA4B8BAAD/PwAAAAAAgH8AAOAPAAAA/z8AAAAAAIA/AADABwAAAP5/AAAAAACAHwAAwAMAAAAePwAAAAAAwA8AAAAAAAAAAD4AAAAAAMAPAAAAAAAAAAAUQAAAAADAAwAAAAAAAAAACEAAAAAAwAEAAAAAAAAAAAAQAAAAAOAAAAAAAAAAAAAAAAAAAADgAAAAAAAAAQAAAAAAAAAA4AQAAAAAAAAAAAAAAAAAAIABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAIABABAAAAAAAAAAEAAACQ//H//38AAAAAAOADAPD////+////HwCA//H/AwD8/////////wcA////HwDg//////////8DAPD//x/kwP//////////AQD8////9////////////wf//////////////////////////////////////////w==";
  var dynImport = function (u) { return import(/* @vite-ignore */ u); };
  var noop = function () {};

  function loadThree() {
    if (!window.__owdThree) window.__owdThree = dynImport(URLS.core);
    return window.__owdThree;
  }
  function hasWebGL() {
    try {
      var c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
    } catch (e) {
      return false;
    }
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function cssVar(host, name) {
    try {
      return getComputedStyle(host).getPropertyValue(name).trim();
    } catch (e) {
      return "";
    }
  }
  /** Color: plain hex/rgb or var(--x) from a global variable. */
  function color(host, v, d) {
    if (!v) return d;
    var m = /^var\((--[\w-]+)\)$/.exec(String(v).trim());
    if (m) return cssVar(host, m[1]) || d;
    return v;
  }
  /** Effective settings: the element's value, or Global Settings (--owd-3d-*). */
  function settings(host, cfg) {
    var g = function (n) { return cssVar(host, "--owd-3d-" + n); };
    var q = cfg.quality && cfg.quality !== "global" ? cfg.quality : g("quality") || "auto";
    if (q === "auto") {
      var small = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
      var weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
      q = small || weak ? "low" : "mid";
    }
    var pick = function (v, name, d) { return v === "on" ? true : v === "off" ? false : g(name) ? g(name) !== "0" : d; };
    var speed = typeof cfg.speed === "number" && cfg.speed > 0 ? cfg.speed : parseFloat(g("speed")) || 1;
    var dpr = parseFloat(g("dpr")) || 1.5;
    if (q === "low") dpr = Math.min(dpr, 1);
    return { q: q, rotate: pick(cfg.autoRotate, "autorotate", true), interactive: pick(cfg.interactive, "interactive", true), speed: speed, dpr: dpr, reduced: reducedMotion() };
  }

  /* ---------------- kerangka WebGL ---------------- */

  function context(T, host, s) {
    var stage = host.querySelector(".owd3d-stage") || host;
    var canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:pan-y;outline:none";
    stage.appendChild(canvas);
    var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: s.q !== "low", alpha: true, powerPreference: s.q === "high" ? "high-performance" : "default" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, s.dpr));
    renderer.outputColorSpace = T.SRGBColorSpace;
    var scene = new T.Scene();
    var camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);
    return { T: T, host: host, canvas: canvas, renderer: renderer, scene: scene, camera: camera, s: s, disposables: [] };
  }
  function track(ctx, o) {
    ctx.disposables.push(o);
    return o;
  }
  function disposeAll(ctx) {
    ctx.scene.traverse(function (o) {
      if (o.geometry) o.geometry.dispose();
      var m = o.material;
      if (m) (Array.isArray(m) ? m : [m]).forEach(function (x) { if (x.map) x.map.dispose(); x.dispose(); });
    });
    ctx.disposables.forEach(function (d) { if (d && d.dispose) d.dispose(); });
    ctx.renderer.dispose();
    if (ctx.renderer.forceContextLoss) ctx.renderer.forceContextLoss();
    if (ctx.canvas.parentNode) ctx.canvas.parentNode.removeChild(ctx.canvas);
  }
  /** Soft round dot texture (no image file). */
  function dotTexture(T) {
    var c = document.createElement("canvas");
    c.width = c.height = 64;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(255,255,255,1)");
    grd.addColorStop(0.45, "rgba(255,255,255,0.85)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    var t = new T.CanvasTexture(c);
    t.colorSpace = T.SRGBColorSpace;
    return t;
  }
  function shadowPlane(T, ctx, y, size, opacity) {
    var c = document.createElement("canvas");
    c.width = c.height = 128;
    var g = c.getContext("2d");
    var grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(15,23,42," + opacity + ")");
    grd.addColorStop(1, "rgba(15,23,42,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    var tex = track(ctx, new T.CanvasTexture(c));
    var m = new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    return m;
  }
  function lights(T, scene, tint) {
    scene.add(new T.HemisphereLight(0xffffff, tint || 0x334155, 1.6));
    var key = new T.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    var rim = new T.DirectionalLight(0x9fb7ff, 1.2);
    rim.position.set(-4, 2, -3);
    scene.add(rim);
  }

  /** Drag to rotate (horizontal); vertical scrolling still works on phones. */
  function dragControl(ctx, onDrag) {
    var el = ctx.canvas, down = false, lx = 0, ly = 0;
    var start = function (e) { down = true; lx = e.clientX; ly = e.clientY; ctx.dragging = true; };
    var move = function (e) {
      if (!down) return;
      onDrag((e.clientX - lx) / el.clientWidth, (e.clientY - ly) / el.clientHeight);
      lx = e.clientX;
      ly = e.clientY;
      ctx.wake();
    };
    var end = function () { down = false; ctx.dragging = false; };
    el.addEventListener("pointerdown", start);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
    return function () {
      el.removeEventListener("pointerdown", start);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
    };
  }
  /** Cursor position relative to the host (-1..1), for the "follow the cursor" effect. */
  function hoverControl(ctx, target) {
    var host = ctx.host;
    var move = function (e) {
      var r = host.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      ctx.wake();
    };
    var leave = function () { target.x = 0; target.y = 0; ctx.wake(); };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return function () {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }
  function fitObject(T, obj, height) {
    var box = new T.Box3().setFromObject(obj);
    var size = box.getSize(new T.Vector3());
    var center = box.getCenter(new T.Vector3());
    var k = height / Math.max(size.y, size.x * 0.8, size.z * 0.8, 0.0001);
    obj.scale.multiplyScalar(k);
    obj.position.sub(center.multiplyScalar(k));
  }

  /* ---------------- 1. Spinning product ---------------- */

  var PROFILES = {
    bottle: [[0, 0], [0.4, 0], [0.46, 0.06], [0.46, 1.05], [0.42, 1.22], [0.2, 1.42], [0.17, 1.6], [0, 1.6]],
    can: [[0, 0], [0.36, 0], [0.42, 0.05], [0.42, 1.18], [0.37, 1.25], [0.34, 1.27], [0, 1.27]],
    jar: [[0, 0], [0.62, 0], [0.68, 0.06], [0.68, 0.62], [0.64, 0.68], [0, 0.68]],
    cup: [[0, 0], [0.34, 0], [0.38, 0.04], [0.5, 1.05], [0.52, 1.1], [0.48, 1.1], [0.36, 0.1], [0, 0.1]],
    vase: [[0, 0], [0.3, 0], [0.34, 0.04], [0.52, 0.38], [0.6, 0.68], [0.52, 0.98], [0.3, 1.24], [0.21, 1.42], [0.24, 1.56], [0.31, 1.62], [0.29, 1.66], [0.18, 1.6], [0.16, 1.4], [0, 1.4]],
    lens: [[0, 0], [0.5, 0], [0.5, 0.14], [0.56, 0.14], [0.56, 0.5], [0.5, 0.5], [0.5, 0.58], [0.6, 0.58], [0.6, 1.04], [0.66, 1.04], [0.66, 1.22], [0.58, 1.22], [0, 1.22]]
  };
  /* v26: non-lathe models (not LatheGeometry). */
  function extraModel(T, model, mat, body, accent, seg) {
    var g = new T.Group(), m;
    if (model === "massing") {
      // Architectural model: white building masses on a site plate.
      var plate = new T.Mesh(new T.BoxGeometry(2.4, 0.08, 1.7), mat(accent, 0.8));
      g.add(plate);
      [[-0.7, 0.9, -0.3, 0.7, 0.6], [0.05, 0.5, -0.35, 0.8, 0.5], [0.15, 1.5, 0.35, 0.5, 0.5], [0.75, 0.7, 0.2, 0.5, 0.9], [-0.55, 0.35, 0.45, 0.8, 0.45]].forEach(function (b) {
        var box = new T.Mesh(new T.BoxGeometry(b[3], b[1], b[4]), mat(body, 0.85));
        box.position.set(b[0], 0.04 + b[1] / 2, b[2]);
        g.add(box);
        var edge = new T.LineSegments(new T.EdgesGeometry(box.geometry), new T.LineBasicMaterial({ color: new T.Color(accent), transparent: true, opacity: 0.55 }));
        edge.position.copy(box.position);
        g.add(edge);
      });
      return g;
    }
    if (model === "kite") {
      // Diamond kite: paper, two bamboo sticks, and a ribbon tail.
      var sh = new T.Shape();
      sh.moveTo(0, 1.1); sh.lineTo(0.75, 0.25); sh.lineTo(0, -0.85); sh.lineTo(-0.75, 0.25); sh.closePath();
      var paper = new T.Mesh(new T.ShapeGeometry(sh), new T.MeshStandardMaterial({ color: new T.Color(body), roughness: 0.75, side: T.DoubleSide }));
      g.add(paper);
      var half = new T.Shape();
      half.moveTo(0, 1.1); half.lineTo(0.75, 0.25); half.lineTo(0, 0.25); half.closePath();
      var stripe = new T.Mesh(new T.ShapeGeometry(half), new T.MeshStandardMaterial({ color: new T.Color(accent), roughness: 0.75, side: T.DoubleSide }));
      stripe.position.z = 0.004;
      g.add(stripe);
      var bamboo = new T.MeshStandardMaterial({ color: new T.Color("#b08a4f"), roughness: 0.6 });
      var v = new T.Mesh(new T.CylinderGeometry(0.02, 0.02, 1.95, 8), bamboo); v.position.set(0, 0.125, 0.02); g.add(v);
      var h = new T.Mesh(new T.CylinderGeometry(0.018, 0.018, 1.5, 8), bamboo); h.rotation.z = Math.PI / 2; h.position.set(0, 0.25, 0.02); g.add(h);
      for (var i = 0; i < 5; i++) {
        var bow = new T.Mesh(new T.PlaneGeometry(0.22, 0.1), new T.MeshStandardMaterial({ color: new T.Color(i % 2 ? accent : body), side: T.DoubleSide }));
        bow.position.set(Math.sin(i * 0.9) * 0.12, -0.95 - i * 0.24, 0);
        bow.rotation.z = Math.sin(i * 1.3) * 0.5;
        g.add(bow);
      }
      return g;
    }
    return null;
  }
  function productScene(ctx, cfg) {
    var T = ctx.T, s = ctx.s, host = ctx.host;
    lights(T, ctx.scene);
    var pivot = new T.Group();
    ctx.scene.add(pivot);
    var body = color(host, cfg.color, "#2563eb"), accent = color(host, cfg.accent, "#f8fafc");
    var finish = cfg.finish || "glossy";
    var mat = function (c, rough) {
      return new T.MeshStandardMaterial({ color: new T.Color(c), roughness: finish === "matte" ? 0.7 : rough, metalness: finish === "metal" ? 0.85 : 0.05 });
    };
    var seg = s.q === "low" ? 40 : 96;
    function procedural() {
      var extra = extraModel(T, cfg.model, mat, body, accent, seg);
      if (extra) { fitObject(T, extra, 2.1); return extra; }
      var g = new T.Group();
      var model = PROFILES[cfg.model] ? cfg.model : "bottle";
      var pts = PROFILES[model].map(function (p) { return new T.Vector2(p[0], p[1]); });
      g.add(new T.Mesh(new T.LatheGeometry(pts, seg), mat(body, 0.25)));
      if (model === "bottle") {
        var cap = new T.Mesh(new T.CylinderGeometry(0.19, 0.19, 0.28, seg), mat(accent, 0.4));
        cap.position.y = 1.72;
        g.add(cap);
      }
      if (model === "jar") {
        var lid = new T.Mesh(new T.CylinderGeometry(0.7, 0.7, 0.22, seg), mat(accent, 0.35));
        lid.position.y = 0.79;
        g.add(lid);
      }
      if (model === "lens") {
        // Front lens glass + focus ring; the lens is tilted so the glass shows while it spins.
        var glass = new T.Mesh(new T.SphereGeometry(1.1, seg, 16, 0, Math.PI * 2, 0, 0.5), new T.MeshPhysicalMaterial({ color: new T.Color(accent), roughness: 0.05, metalness: 0.2, clearcoat: 1 }));
        glass.position.y = 1.22 - 1.1 * Math.cos(0.5);
        g.add(glass);
        for (var k = 0; k < 2; k++) {
          var ring = new T.Mesh(new T.TorusGeometry(0.585 + k * 0.02, 0.018, 8, seg), mat(accent, 0.4));
          ring.rotation.x = Math.PI / 2; ring.position.y = 0.66 + k * 0.3;
          g.add(ring);
        }
        g.rotation.x = Math.PI / 2.4;
      }
      if (model === "vase") {
        var band = new T.Mesh(new T.CylinderGeometry(0.605, 0.6, 0.06, seg, 1, true), new T.MeshStandardMaterial({ color: new T.Color(accent), roughness: 0.8, side: T.DoubleSide }));
        band.position.y = 0.72;
        g.add(band);
      }
      if (model === "bottle" || model === "can") {
        var r = model === "bottle" ? 0.463 : 0.423, h = model === "bottle" ? 0.62 : 0.7;
        var label = new T.Mesh(new T.CylinderGeometry(r, r, h, seg, 1, true), new T.MeshStandardMaterial({ color: new T.Color(accent), roughness: 0.6, side: T.DoubleSide }));
        label.position.y = model === "bottle" ? 0.6 : 0.6;
        g.add(label);
      }
      fitObject(T, g, 2.1);
      return g;
    }
    var obj = procedural();
    pivot.add(obj);
    ctx.scene.add(shadowPlane(T, ctx, -1.15, 2.6, 0.35));
    ctx.camera.position.set(0, 0.35, 5.6);
    ctx.camera.lookAt(0, 0, 0);
    if (cfg.glb && /^(https?:)?\/\//.test(cfg.glb) || /^\/[^/]/.test(cfg.glb || "")) {
      dynImport(URLS.gltf)
        .then(function (mod) {
          new mod.GLTFLoader().load(cfg.glb, function (gltf) {
            if (ctx.dead) return;
            var m = gltf.scene;
            fitObject(T, m, 2.1);
            pivot.remove(obj);
            obj.traverse(function (o) { if (o.geometry) o.geometry.dispose(); });
            obj = m;
            pivot.add(m);
            ctx.wake();
          }, undefined, function () { /* model failed to load: keep the built-in shape */ });
        })
        .catch(noop);
    }
    var rotY = 0, rotX = 0.08, vel = 0;
    var stop = s.interactive ? dragControl(ctx, function (dx, dy) { vel = dx * 6; rotY += dx * 6; rotX = Math.max(-0.5, Math.min(0.6, rotX + dy * 2)); }) : noop;
    return {
      animate: s.rotate && !s.reduced,
      update: function (dt) {
        if (!ctx.dragging) {
          if (s.rotate && !s.reduced) rotY += dt * 0.6 * s.speed;
          rotY += vel;
          vel *= 0.92;
        }
        pivot.rotation.y = cfg.model === "kite" ? Math.sin(rotY) * 0.55 : rotY;
        pivot.rotation.x = rotX;
        return Math.abs(vel) > 0.0005;
      },
      dispose: stop
    };
  }

  /* ---------------- 2. Bentuk geometris interaktif ---------------- */

  function shapeScene(ctx, cfg) {
    var T = ctx.T, s = ctx.s, host = ctx.host;
    lights(T, ctx.scene, 0x1e1b4b);
    var detail = s.q === "low" ? 0 : 1;
    var geo;
    switch (cfg.shape) {
      case "icosahedron": geo = new T.IcosahedronGeometry(1.25, detail); break;
      case "torus": geo = new T.TorusGeometry(1, 0.38, s.q === "low" ? 24 : 48, s.q === "low" ? 64 : 140); break;
      case "octahedron": geo = new T.OctahedronGeometry(1.35, 0); break;
      case "dodecahedron": geo = new T.DodecahedronGeometry(1.25, 0); break;
      default: geo = new T.TorusKnotGeometry(0.85, 0.28, s.q === "low" ? 96 : 220, s.q === "low" ? 12 : 28);
    }
    var c = new T.Color(color(host, cfg.color, "#6366f1"));
    var mat;
    if (cfg.material === "glass") mat = new T.MeshPhysicalMaterial({ color: c, roughness: 0.08, metalness: 0, transmission: s.q === "low" ? 0 : 0.85, thickness: 1.2, transparent: true, opacity: s.q === "low" ? 0.75 : 1, clearcoat: 1 });
    else if (cfg.material === "wire") mat = new T.MeshBasicMaterial({ color: c, wireframe: true });
    else if (cfg.material === "matte") mat = new T.MeshStandardMaterial({ color: c, roughness: 0.85, metalness: 0 });
    else mat = new T.MeshStandardMaterial({ color: c, roughness: 0.22, metalness: 0.85 });
    var mesh = new T.Mesh(geo, mat);
    ctx.scene.add(mesh);
    if (cfg.material !== "wire" && cfg.outline) {
      var edges = new T.LineSegments(new T.EdgesGeometry(geo, 25), new T.LineBasicMaterial({ color: color(host, cfg.accent, "#ffffff"), transparent: true, opacity: 0.35 }));
      mesh.add(edges);
    }
    ctx.camera.position.set(0, 0, 5.4);
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 }, spin = 0;
    var stop = s.interactive ? hoverControl(ctx, target) : noop;
    var t = 0;
    return {
      animate: !s.reduced,
      update: function (dt) {
        t += dt;
        cur.x += (target.x - cur.x) * Math.min(1, dt * 4);
        cur.y += (target.y - cur.y) * Math.min(1, dt * 4);
        if (s.rotate && !s.reduced) spin += dt * 0.35 * s.speed;
        mesh.rotation.y = spin + cur.x * 0.9;
        mesh.rotation.x = spin * 0.6 + cur.y * 0.7;
        mesh.position.y = s.reduced ? 0 : Math.sin(t * 1.2) * 0.08;
        return Math.abs(target.x - cur.x) + Math.abs(target.y - cur.y) > 0.001;
      },
      dispose: stop
    };
  }

  /* ---------------- 3. Globe interaktif ---------------- */

  var landBits = null;
  function isLand(lat, lon) {
    if (!landBits) {
      var bin = atob(LAND);
      landBits = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) landBits[i] = bin.charCodeAt(i);
    }
    var x = Math.min(127, Math.max(0, Math.floor(((lon + 180) / 360) * 128)));
    var y = Math.min(63, Math.max(0, Math.floor(((90 - lat) / 180) * 64)));
    var k = y * 128 + x;
    return (landBits[k >> 3] & (1 << (k & 7))) !== 0;
  }
  function latLon(T, lat, lon, r) {
    var phi = ((90 - lat) * Math.PI) / 180, th = ((lon + 180) * Math.PI) / 180;
    return new T.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  }
  function globeScene(ctx, cfg) {
    var T = ctx.T, s = ctx.s, host = ctx.host;
    var R = 1.5;
    var globe = new T.Group();
    ctx.scene.add(globe);
    var dotC = new T.Color(color(host, cfg.color, "#60a5fa"));
    var oceanC = new T.Color(color(host, cfg.ocean, "#0b1220"));
    var glowC = new T.Color(color(host, cfg.glow, "#3b82f6"));
    globe.add(new T.Mesh(new T.SphereGeometry(R * 0.985, s.q === "low" ? 32 : 64, s.q === "low" ? 24 : 48), new T.MeshBasicMaterial({ color: oceanC })));
    var N = s.q === "low" ? 7000 : s.q === "high" ? 22000 : 14000;
    var pos = [], golden = Math.PI * (3 - Math.sqrt(5));
    for (var i = 0; i < N; i++) {
      var y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i;
      var lat = (Math.asin(y) * 180) / Math.PI;
      var lon = ((((Math.atan2(Math.sin(th) * rad, -Math.cos(th) * rad) * 180) / Math.PI) + 540) % 360) - 180;
      if (isLand(lat, lon)) {
        var v = latLon(T, lat, lon, R);
        pos.push(v.x, v.y, v.z);
      }
    }
    var dots = new T.BufferGeometry();
    dots.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    var dotTex = track(ctx, dotTexture(T));
    var land = new T.Points(dots, new T.PointsMaterial({ color: dotC, size: s.q === "low" ? 0.065 : 0.055, map: dotTex, transparent: true, alphaTest: 0.05, depthWrite: false, sizeAttenuation: true }));
    land.renderOrder = 1;
    globe.add(land);
    // Atmosphere: rim light (fresnel) behind the globe.
    var atmo = new T.ShaderMaterial({
      uniforms: { c: { value: glowC } },
      vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      // 0 at the outer edge → 1 at the globe's edge; premultiplied color so it looks clean on light and dark backgrounds.
      fragmentShader: "uniform vec3 c; varying vec3 vN; void main(){ float d = clamp(-dot(vN, vec3(0.0, 0.0, 1.0)) / 0.53, 0.0, 1.0); float i = pow(d, 1.6); gl_FragColor = vec4(c * i, i); }",
      side: T.BackSide,
      premultipliedAlpha: true,
      transparent: true,
      depthWrite: false
    });
    var atm = new T.Mesh(new T.SphereGeometry(R * 1.18, 48, 32), atmo);
    ctx.scene.add(atm);
    // Location markers + arcs between markers.
    var markC = new T.Color(color(host, cfg.marker, "#f59e0b"));
    var markers = (cfg.markers || []).slice(0, 24);
    var rings = [];
    markers.forEach(function (m) {
      var p = latLon(T, m.lat, m.lon, R * 1.005);
      var dot = new T.Mesh(new T.SphereGeometry(0.035, 12, 8), new T.MeshBasicMaterial({ color: markC }));
      dot.position.copy(p);
      globe.add(dot);
      var ring = new T.Mesh(new T.RingGeometry(0.04, 0.06, 32), new T.MeshBasicMaterial({ color: markC, transparent: true, side: T.DoubleSide, depthWrite: false }));
      ring.position.copy(p);
      ring.lookAt(p.clone().multiplyScalar(2));
      globe.add(ring);
      rings.push(ring);
    });
    if (cfg.arcs && markers.length > 1) {
      for (var j = 0; j < markers.length - 1; j++) {
        var a = latLon(T, markers[j].lat, markers[j].lon, R), b = latLon(T, markers[j + 1].lat, markers[j + 1].lon, R);
        var mid = a.clone().add(b).multiplyScalar(0.5);
        mid.setLength(R + a.distanceTo(b) * 0.35);
        var curve = new T.QuadraticBezierCurve3(a, mid, b);
        globe.add(new T.Line(new T.BufferGeometry().setFromPoints(curve.getPoints(48)), new T.LineBasicMaterial({ color: markC, transparent: true, opacity: 0.7 })));
      }
    }
    globe.rotation.y = (((cfg.startLon || 0) + 90) * Math.PI) / -180;
    globe.rotation.x = 0.35;
    ctx.camera.position.set(0, 0, 6.2);
    var vel = 0, t = 0;
    var stop = s.interactive ? dragControl(ctx, function (dx, dy) { vel = dx * 5; globe.rotation.y += dx * 5; globe.rotation.x = Math.max(-1, Math.min(1, globe.rotation.x + dy * 2)); }) : noop;
    return {
      animate: !s.reduced,
      update: function (dt) {
        t += dt;
        if (!ctx.dragging) {
          if (s.rotate && !s.reduced) globe.rotation.y += dt * 0.12 * s.speed;
          globe.rotation.y += vel;
          vel *= 0.93;
        }
        for (var k = 0; k < rings.length; k++) {
          var ph = (t * 0.8 + k * 0.37) % 1;
          rings[k].scale.setScalar(1 + ph * 3);
          rings[k].material.opacity = 1 - ph;
        }
        return Math.abs(vel) > 0.0005;
      },
      dispose: stop
    };
  }

  /* ---------------- 4. 3D particle background ---------------- */

  function particleScene(ctx, cfg) {
    var T = ctx.T, s = ctx.s, host = ctx.host;
    var base = cfg.density === "low" ? 0.5 : cfg.density === "high" ? 1.6 : 1;
    var N = Math.round((s.q === "low" ? 1800 : s.q === "high" ? 9000 : 5000) * base);
    var pos = new Float32Array(N * 3), mix = new Float32Array(N), seed = new Float32Array(N);
    var shape = cfg.shape || "wave";
    for (var i = 0; i < N; i++) {
      var x, y, z;
      if (shape === "galaxy") {
        var arm = i % 3, r = Math.pow(Math.random(), 0.7) * 3.2, ang = r * 1.6 + (arm * Math.PI * 2) / 3;
        x = Math.cos(ang) * r + (Math.random() - 0.5) * 0.35;
        z = Math.sin(ang) * r + (Math.random() - 0.5) * 0.35;
        y = (Math.random() - 0.5) * 0.25 * (3.2 - r);
        mix[i] = r / 3.2;
      } else if (shape === "sphere") {
        var u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = 1.9 + (Math.random() - 0.5) * 0.25;
        x = Math.sqrt(1 - u * u) * Math.cos(th) * rr;
        y = u * rr;
        z = Math.sqrt(1 - u * u) * Math.sin(th) * rr;
        mix[i] = (u + 1) / 2;
      } else {
        x = (Math.random() - 0.5) * 9;
        z = (Math.random() - 0.5) * 6;
        y = 0;
        mix[i] = (x + 4.5) / 9;
      }
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
      seed[i] = Math.random();
    }
    var geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(pos, 3));
    geo.setAttribute("aMix", new T.BufferAttribute(mix, 1));
    geo.setAttribute("aSeed", new T.BufferAttribute(seed, 1));
    var uni = {
      uTime: { value: 0 },
      uA: { value: new T.Color(color(host, cfg.color, "#60a5fa")) },
      uB: { value: new T.Color(color(host, cfg.accent, "#c084fc")) },
      uSize: { value: (cfg.size || 3) * Math.min(window.devicePixelRatio || 1, s.dpr) },
      uWave: { value: shape === "wave" ? 1 : 0 },
      uOpacity: { value: 0.9 }
    };
    var mat = new T.ShaderMaterial({
      uniforms: uni,
      transparent: true,
      depthWrite: false,
      blending: cfg.glow === false ? T.NormalBlending : T.AdditiveBlending,
      vertexShader:
        "uniform float uTime; uniform float uSize; uniform float uWave; attribute float aMix; attribute float aSeed; varying float vMix; varying float vA;" +
        "void main(){ vec3 p = position; p.y += uWave * (sin(p.x * 1.1 + uTime) * 0.35 + cos(p.z * 1.4 + uTime * 0.8) * 0.25);" +
        " p += (1.0 - uWave) * vec3(0.0, sin(uTime * 0.6 + aSeed * 6.28) * 0.06, 0.0);" +
        " vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = uSize * (0.6 + aSeed * 0.8) * (6.0 / -mv.z); vMix = aMix; vA = 0.45 + aSeed * 0.55; }",
      fragmentShader:
        "uniform vec3 uA; uniform vec3 uB; uniform float uOpacity; varying float vMix; varying float vA;" +
        "void main(){ float d = length(gl_PointCoord - vec2(0.5)); if (d > 0.5) discard; float a = (1.0 - smoothstep(0.15, 0.5, d)) * vA * uOpacity; gl_FragColor = vec4(mix(uA, uB, vMix), a); }"
    });
    var pts = new T.Points(geo, mat);
    ctx.scene.add(pts);
    ctx.camera.position.set(0, shape === "wave" ? 2.2 : 1.2, shape === "wave" ? 5.2 : 6);
    ctx.camera.lookAt(0, 0, 0);
    var target = { x: 0, y: 0 }, cur = { x: 0, y: 0 };
    var stop = s.interactive ? hoverControl(ctx, target) : noop;
    var camBase = ctx.camera.position.clone();
    return {
      animate: !s.reduced,
      update: function (dt) {
        if (!s.reduced) uni.uTime.value += dt * s.speed;
        if (shape !== "wave" && s.rotate && !s.reduced) pts.rotation.y += dt * 0.08 * s.speed;
        cur.x += (target.x - cur.x) * Math.min(1, dt * 2);
        cur.y += (target.y - cur.y) * Math.min(1, dt * 2);
        ctx.camera.position.set(camBase.x + cur.x * 0.8, camBase.y - cur.y * 0.4, camBase.z);
        ctx.camera.lookAt(0, 0, 0);
        return false;
      },
      dispose: stop
    };
  }

  /* ---------------- 5. 3D card (CSS, no WebGL) ---------------- */

  function mountTilt(host, cfg) {
    var card = host.querySelector(".owd3d-card") || host;
    if (reducedMotion()) return noop;
    var max = typeof cfg.max === "number" ? cfg.max : 12, raf = 0, nx = 0, ny = 0;
    var apply = function () {
      raf = 0;
      card.style.setProperty("--owd-rx", (-ny * max).toFixed(2) + "deg");
      card.style.setProperty("--owd-ry", (nx * max).toFixed(2) + "deg");
      card.style.setProperty("--owd-gx", ((nx + 1) * 50).toFixed(1) + "%");
      card.style.setProperty("--owd-gy", ((ny + 1) * 50).toFixed(1) + "%");
    };
    var move = function (e) {
      var r = host.getBoundingClientRect();
      nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      host.classList.add("is-tilting");
      if (!raf) raf = requestAnimationFrame(apply);
    };
    var leave = function () {
      nx = ny = 0;
      host.classList.remove("is-tilting");
      if (!raf) raf = requestAnimationFrame(apply);
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return function () {
      if (raf) cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }

  /* ---------------- siklus hidup ---------------- */

  var SCENES = { product: productScene, shape: shapeScene, globe: globeScene, particles: particleScene };

  /**
   * Mount one 3D element. Three.js loads when the element nears the viewport,
   * rendering stops while the element is hidden / the tab is in the background, and
   * a static image still shows when WebGL is unavailable or fails.
   * Returns a cleanup function (called when the component unmounts).
   */
  // Elements removed from the DOM (e.g. a re-rendered preview) are cleaned up
  // on the next mount so WebGL contexts do not pile up.
  var live = [];
  function sweep() {
    live = live.filter(function (m) {
      if (m.host.isConnected) return true;
      m.destroy();
      return false;
    });
  }
  function mount(host, kind, cfg) {
    sweep();
    if (!host || host.__owd3d) return noop;
    cfg = cfg || {};
    if (kind === "tilt") return mountTilt(host, cfg);
    var build = SCENES[kind];
    if (!build) return noop;
    if (!hasWebGL()) {
      host.classList.add("is-3d-fallback");
      return noop;
    }
    var state = { dead: false, visible: false, ctx: null, raf: 0, last: 0, scene: null, io: null, ro: null };
    host.__owd3d = true;
    function fail(err) {
      host.classList.add("is-3d-fallback");
      if (err && window.console) console.warn("[3D] memakai gambar statis:", err);
    }
    /* FPS guard: weak phones that draw < minFps (default 30) during the first ~2.5 s
       drop to 1x resolution and are measured again; if still slow, the animation
       stops and the static image is shown. minFps: 0 disables the guard. */
    var minFps = typeof cfg.minFps === "number" ? cfg.minFps : 30;
    var probe = { t: 0, n: 0, strikes: 0, done: !(minFps > 0) };
    function probeFrame(dt) {
      if (probe.done) return false;
      probe.t += dt;
      probe.n += 1;
      if (probe.t < 2.5) return false;
      var fps = probe.n / probe.t;
      probe.t = 0;
      probe.n = 0;
      if (fps >= minFps) { probe.done = true; return false; }
      probe.strikes += 1;
      var r = state.ctx.renderer;
      if (probe.strikes === 1 && r.getPixelRatio() > 1) {
        r.setPixelRatio(1);
        resize();
        return false;
      }
      probe.done = true;
      fallbackNow("FPS rendah (" + fps.toFixed(0) + ")");
      return true;
    }
    function fallbackNow(why) {
      if (state.dead) return; // forceContextLoss() on destroy also triggers "context lost"
      if (window.console) console.warn("[3D] memakai gambar statis:", why);
      destroy();
      host.__owd3d = true; // do not remount automatically
      host.classList.add("is-3d-fallback");
    }
    function resize() {
      var c = state.ctx;
      if (!c) return;
      var w = host.clientWidth || 1, h = host.clientHeight || 1;
      c.renderer.setSize(w, h, false);
      c.camera.aspect = w / h;
      c.camera.updateProjectionMatrix();
      c.wake();
    }
    function frame(now) {
      state.raf = 0;
      var c = state.ctx;
      if (state.dead || !c) return;
      if (!host.isConnected) return destroy();
      var raw = state.last ? (now - state.last) / 1000 : 0;
      var dt = Math.min(0.05, raw || 0.016);
      state.last = now;
      // Only measure consecutive frames (not the gap after the tab/scroll was idle).
      if (raw > 0 && raw < 0.5 && state.scene.animate && probeFrame(raw)) return;
      var moving = state.scene.update(dt);
      c.renderer.render(c.scene, c.camera);
      if ((state.scene.animate || moving || c.dragging) && state.visible && !document.hidden) state.raf = requestAnimationFrame(frame);
      else state.last = 0;
    }
    function wake() {
      if (!state.raf && !state.dead && state.ctx) state.raf = requestAnimationFrame(frame);
    }
    function start() {
      loadThree()
        .then(function (T) {
          if (state.dead) return;
          var c = context(T, host, settings(host, cfg));
          c.wake = wake;
          state.ctx = c;
          state.scene = build(c, cfg);
          c.dead = false;
          c.canvas.addEventListener("webglcontextlost", function (e) {
            e.preventDefault();
            fallbackNow("konteks WebGL hilang");
          });
          resize();
          host.classList.add("is-3d-ready");
          if (window.ResizeObserver) {
            state.ro = new ResizeObserver(resize);
            state.ro.observe(host);
          }
          wake();
        })
        .catch(fail);
    }
    var started = false;
    function onVis() { if (!document.hidden) wake(); }
    if ("IntersectionObserver" in window) {
      state.io = new IntersectionObserver(function (entries) {
        state.visible = entries[entries.length - 1].isIntersecting;
        if (state.visible && !started) {
          started = true;
          start();
        }
        if (state.visible) wake();
      }, { rootMargin: "200px" });
      state.io.observe(host);
    } else {
      state.visible = true;
      started = true;
      start();
    }
    document.addEventListener("visibilitychange", onVis);
    live.push({ host: host, destroy: destroy });
    function destroy() {
      if (state.dead) return;
      state.dead = true;
      host.__owd3d = false;
      if (state.raf) cancelAnimationFrame(state.raf);
      if (state.io) state.io.disconnect();
      if (state.ro) state.ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (state.ctx) {
        state.ctx.dead = true;
        try {
          if (state.scene && state.scene.dispose) state.scene.dispose();
          disposeAll(state.ctx);
        } catch (e) { /* abaikan */ }
      }
      host.classList.remove("is-3d-ready");
    }
    return destroy;
  }

  var api = { mount: mount, version: VERSION };
  if (typeof window !== "undefined") window.OWD3D = api;
  return api;
})();`;

/** Module for framework projects: runtime + `mount3d()` (returns a cleanup function). */
export const OWD3D_MODULE = `${OWD3D_RUNTIME}

export function mount3d(host, kind, cfg) {
  return OWD3D.mount(host, kind, cfg);
}
`;
