/* ================================================================== */
/* Objek 3D prosedural untuk template 3D Motion (v18).                 */
/* Tiap objek = fungsi buildObject({ THREE, COL, makeScreen,           */
/* glowTexture, textTexture, brand }) → { group, floor, update(t,dt,P) }.*/
/* P berisi pose + "keadaan" bab (mis. P.open, P.zoom, P.flame, 0..1)  */
/* yang di-scrub OWD Scrub. Tanpa model/tekstur eksternal; < 50.000 segitiga.*/
/* ================================================================== */

export type ObjectKind = "monitor" | "phone" | "laptop" | "camera" | "vinyl" | "perfume" | "rocket" | "book";

/** Bantuan bersama (disalin ke template bersama objeknya). */
const HELPERS = String.raw`
function rrShape(THREE, w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
/* Lempeng bersudut bulat (lebar w, tinggi h, tebal d) berpusat di titik asal. */
function slabGeo(THREE, w, h, d, r, b) {
  const g = new THREE.ExtrudeGeometry(rrShape(THREE, w - 2 * b, h - 2 * b, Math.max(0.002, r - b)), { depth: Math.max(0.002, d - 2 * b), bevelEnabled: b > 0, bevelThickness: b, bevelSize: b, bevelSegments: 3, curveSegments: 8 });
  g.translate(0, 0, -(d - 2 * b) / 2);
  return g;
}
function mat(THREE, color, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: color, roughness: 0.45, metalness: 0.2 }, o || {})); }
function screenMesh(THREE, tex, w, h) { return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); }
function glowSprite(THREE, tex, color, size, opacity) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: color, transparent: true, opacity: opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.scale.setScalar(size); return s;
}
function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
function lerp(a, b, t) { return a + (b - a) * t; }
`;

/* ---------------------------- PC (monitor) ---------------------------- */
const MONITOR = String.raw`
function buildObject({ THREE, COL, makeScreen, glowTexture }) {
  const group = new THREE.Group();
  const body = mat(THREE, COL.obj, { roughness: 0.35, metalness: 0.55 });
  const dark = mat(THREE, "#05070c", { roughness: 0.5, metalness: 0.1 });
  const glowTex = glowTexture();

  const mon = new THREE.Group(); mon.position.y = 0.35; group.add(mon);
  mon.add(new THREE.Mesh(slabGeo(THREE, 3.5, 2.24, 0.12, 0.08, 0.03), body));
  const back = new THREE.Mesh(slabGeo(THREE, 2.4, 1.4, 0.22, 0.2, 0.06), body); back.position.z = -0.14; mon.add(back);
  const bezel = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.14), dark); bezel.position.z = 0.061; mon.add(bezel);
  const scr = screenMesh(THREE, makeScreen(1024, 640, "dark"), 3.26, 2.04); scr.position.z = 0.064; mon.add(scr);
  const led = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.018, 0.02), new THREE.MeshBasicMaterial({ color: COL.accent })); led.position.set(0, -1.09, 0.06); mon.add(led);

  const neck = new THREE.Mesh(slabGeo(THREE, 0.36, 1.25, 0.12, 0.06, 0.02), body); neck.position.set(0, -0.92, -0.3); neck.rotation.x = -0.12; group.add(neck);
  const base = new THREE.Mesh(slabGeo(THREE, 1.5, 0.95, 0.06, 0.32, 0.02), body); base.rotation.x = -Math.PI / 2; base.position.set(0, -1.56, -0.25); group.add(base);

  /* Keyboard dengan tombol yang menyala saat "mengetik". */
  const kb = new THREE.Group(); kb.position.set(-0.2, -1.56, 1.15); group.add(kb);
  const kbBase = new THREE.Mesh(slabGeo(THREE, 2.75, 0.92, 0.07, 0.08, 0.02), body); kbBase.rotation.x = -Math.PI / 2; kb.add(kbBase);
  const COLS = 14, ROWS = 4, N = COLS * ROWS;
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.15, 0.05, 0.15), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }), N);
  const m4 = new THREE.Matrix4(), cold = new THREE.Color(COL.obj2), hot = new THREE.Color(COL.accent), tmp = new THREE.Color(), heat = new Float32Array(N);
  for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) { m4.makeTranslation(-1.17 + c * 0.18, 0.06, -0.28 + r * 0.187); keys.setMatrixAt(i, m4); keys.setColorAt(i, cold); }
  kb.add(keys);
  const mouse = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 14), body); mouse.scale.set(0.75, 0.35, 1.1); mouse.position.set(1.65, -1.52, 1.2); group.add(mouse);

  const glow = glowSprite(THREE, glowTex, COL.accent, 7.5, 0.2); glow.position.set(0, 0.4, -0.8); group.add(glow);
  let acc = 0;
  return {
    group, floor: -1.6,
    update(t, dt, P) {
      const k = P.keys || 0;
      glow.material.opacity = 0.1 + 0.35 * (P.glow || 0);
      acc += dt;
      if (k > 0.05 && acc > 0.07) { acc = 0; heat[(Math.random() * N) | 0] = 1; if (Math.random() < k) heat[(Math.random() * N) | 0] = 1; }
      let dirty = false;
      for (let i = 0; i < N; i++) if (heat[i] > 0) { heat[i] = Math.max(0, heat[i] - dt * 2.4); tmp.copy(cold).lerp(hot, heat[i]); keys.setColorAt(i, tmp); dirty = true; }
      if (dirty) keys.instanceColor.needsUpdate = true;
      mouse.position.x = 1.65 + Math.sin(t * 1.3) * 0.05 * k;
    },
  };
}
`;

/* -------------------------------- HP -------------------------------- */
const PHONE = String.raw`
function buildObject({ THREE, COL, makeScreen, glowTexture, textTexture }) {
  const group = new THREE.Group();
  const body = mat(THREE, COL.obj, { roughness: 0.25, metalness: 0.7 });
  const dark = new THREE.MeshBasicMaterial({ color: 0x05060a });
  group.add(new THREE.Mesh(slabGeo(THREE, 1.7, 3.4, 0.17, 0.28, 0.04), body));
  const bez = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(THREE, 1.6, 3.3, 0.22), 8), dark); bez.position.z = 0.086; group.add(bez);
  const scr = screenMesh(THREE, makeScreen(464, 1000, "dark"), 1.48, 3.19); scr.position.z = 0.088; group.add(scr);
  const notch = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(THREE, 0.44, 0.12, 0.06), 6), dark); notch.position.set(0, 1.47, 0.09); group.add(notch);
  [[0.9, 0.7], [0.9, 0.25], [-0.9, 0.55]].forEach((b) => { const m = new THREE.Mesh(new THREE.BoxGeometry(0.04, b[1] > 0.5 ? 0.42 : 0.3, 0.07), body); m.position.set(b[0] > 0 ? 0.86 : -0.86, b[1], 0); group.add(m); });
  const bump = new THREE.Mesh(slabGeo(THREE, 0.66, 0.66, 0.06, 0.18, 0.02), body); bump.position.set(-0.4, 1.18, -0.11); group.add(bump);
  const lensG = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24), lensM = mat(THREE, "#0a0d16", { roughness: 0.1, metalness: 0.6 });
  [[-0.53, 1.31], [-0.27, 1.05], [-0.53, 1.05]].forEach((p) => { const l = new THREE.Mesh(lensG, lensM); l.rotation.x = Math.PI / 2; l.position.set(p[0], p[1], -0.15); group.add(l); });

  /* Kartu aplikasi yang melayang keluar dari HP (keadaan "fan"). */
  const ICON = ["●", "▲", "■"];
  const cards = [[-1.55, 0.95, 0.55, 0.12], [1.55, 0.15, 0.75, -0.14], [-1.4, -0.95, 0.65, 0.1]].map((p, i) => {
    const tex = textTexture((g, w, h) => {
      g.fillStyle = COL.panel || "#ffffff"; g.beginPath(); if (g.roundRect) g.roundRect(4, 4, w - 8, h - 8, 34); else g.rect(4, 4, w - 8, h - 8); g.fill();
      g.strokeStyle = "rgba(127,127,127,.25)"; g.lineWidth = 3; g.stroke();
      g.fillStyle = i === 1 ? COL.accent2 : COL.accent; g.beginPath(); g.arc(70, h / 2, 40, 0, 7); g.fill();
      g.fillStyle = "#fff"; g.font = "700 38px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ICON[i], 70, h / 2 + 2);
      g.fillStyle = COL.ink; g.globalAlpha = 0.85; g.fillRect(130, h / 2 - 26, w * 0.42, 16); g.globalAlpha = 0.35; g.fillRect(130, h / 2 + 8, w * 0.3, 14); g.globalAlpha = 1;
    }, 400, 180);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.54), new THREE.MeshBasicMaterial({ map: tex, transparent: true, toneMapped: false, depthWrite: false }));
    m.userData.to = p; group.add(m); return m;
  });
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 6, 0.2); glow.position.z = -0.6; group.add(glow);
  return {
    group, floor: -1.85,
    update(t, dt, P) {
      const f = clamp01(P.fan || 0);
      cards.forEach((m, i) => {
        const p = m.userData.to, e = f * f * (3 - 2 * f);
        m.position.set(p[0] * e, p[1] * e + Math.sin(t * 1.2 + i * 2) * 0.06 * e, lerp(-0.1, p[2], e));
        m.rotation.z = p[3] * e; m.scale.setScalar(lerp(0.4, 1, e)); m.material.opacity = e;
        m.visible = e > 0.01;
      });
      glow.material.opacity = 0.12 + 0.4 * (P.glow || 0);
    },
  };
}
`;

/* ------------------------------- laptop ------------------------------ */
const LAPTOP = String.raw`
function buildObject({ THREE, COL, makeScreen, glowTexture }) {
  const group = new THREE.Group();
  const body = mat(THREE, COL.obj, { roughness: 0.3, metalness: 0.75 });
  const dark = mat(THREE, "#06080d", { roughness: 0.6, metalness: 0.1 });
  const inner = new THREE.Group(); inner.position.y = -0.95; group.add(inner);
  const base = new THREE.Mesh(slabGeo(THREE, 3.3, 2.2, 0.1, 0.14, 0.03), body); base.rotation.x = -Math.PI / 2; base.position.z = 1.1; inner.add(base);
  const deck = new THREE.Mesh(new THREE.PlaneGeometry(2.96, 0.98), dark); deck.rotation.x = -Math.PI / 2; deck.position.set(0, 0.052, 0.72); inner.add(deck);
  const COLS = 13, ROWS = 5, N = COLS * ROWS;
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.18, 0.02, 0.15), mat(THREE, "#12151d", { roughness: 0.7 }), N);
  const m4 = new THREE.Matrix4();
  for (let r = 0, i = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++, i++) { m4.makeTranslation(-1.32 + c * 0.22, 0.062, 0.32 + r * 0.19); keys.setMatrixAt(i, m4); }
  inner.add(keys);
  const pad = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(THREE, 1.05, 0.62, 0.06), 4), mat(THREE, COL.obj2, { roughness: 0.35, metalness: 0.5 })); pad.rotation.x = -Math.PI / 2; pad.position.set(0, 0.053, 1.68); inner.add(pad);

  const lid = new THREE.Group(); lid.position.set(0, 0.06, 0.02); inner.add(lid);
  const lidBody = new THREE.Mesh(slabGeo(THREE, 3.3, 2.12, 0.07, 0.14, 0.02), body); lidBody.position.y = 1.06; lid.add(lidBody);
  const bez = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 2.03), dark); bez.position.set(0, 1.06, 0.036); lid.add(bez);
  const scr = screenMesh(THREE, makeScreen(1024, 640, "dark"), 3.04, 1.9); scr.position.set(0, 1.09, 0.038); lid.add(scr);
  const logo = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), new THREE.MeshBasicMaterial({ color: COL.accent })); logo.position.set(0, 1.06, -0.037); logo.rotation.y = Math.PI; lid.add(logo);
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 7, 0.2); glow.position.set(0, 0.2, -1); group.add(glow);
  return {
    group, floor: -1.0,
    update(t, dt, P) {
      const o = clamp01(P.open || 0), e = o * o * (3 - 2 * o);
      lid.rotation.x = lerp(Math.PI / 2 - 0.03, -0.24, e);
      glow.material.opacity = 0.1 + 0.45 * e * (0.6 + 0.4 * (P.glow || 0));
    },
  };
}
`;

/* ------------------------------- kamera ------------------------------ */
const CAMERA = String.raw`
function buildObject({ THREE, COL, glowTexture }) {
  const group = new THREE.Group();
  const skin = mat(THREE, COL.obj, { roughness: 0.75, metalness: 0.05 });
  const metal = mat(THREE, COL.obj2, { roughness: 0.3, metalness: 0.85 });
  const rubber = mat(THREE, "#111216", { roughness: 0.85 });
  group.add(new THREE.Mesh(slabGeo(THREE, 2.8, 1.7, 1.0, 0.24, 0.06), skin));
  const top = new THREE.Mesh(slabGeo(THREE, 2.86, 0.34, 1.04, 0.1, 0.03), metal); top.position.y = 0.72; group.add(top);
  const tri = new THREE.Shape(); tri.moveTo(-0.5, 0); tri.lineTo(0.5, 0); tri.lineTo(0.28, 0.5); tri.lineTo(-0.28, 0.5); tri.lineTo(-0.5, 0);
  const hump = new THREE.Mesh(new THREE.ExtrudeGeometry(tri, { depth: 0.8, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 2 }), metal); hump.position.set(0, 0.86, -0.4); group.add(hump);
  const grip = new THREE.Mesh(slabGeo(THREE, 0.6, 1.55, 0.4, 0.22, 0.1), skin); grip.position.set(-1.12, -0.05, 0.55); group.add(grip);
  const dialG = new THREE.CylinderGeometry(0.22, 0.22, 0.14, 28);
  [[0.92, 0.0], [-0.95, 0.05]].forEach((d) => { const m = new THREE.Mesh(dialG, metal); m.position.set(d[0], 0.95, d[1]); group.add(m); });
  const shutter = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 20), new THREE.MeshStandardMaterial({ color: COL.accent, roughness: 0.3, emissive: COL.accent, emissiveIntensity: 0.25 })); shutter.position.set(-1.05, 0.93, 0.42); group.add(shutter);
  const flash = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.2, 0.04), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.2, roughness: 0.2 })); flash.position.set(0.95, 0.55, 0.52); group.add(flash);
  const flashGlow = glowSprite(THREE, glowTexture(), 0xffffff, 3.2, 0); flashGlow.position.set(0.95, 0.55, 0.8); group.add(flashGlow);

  /* Lensa: cincin-cincin yang memanjang saat "zoom". */
  const lens = new THREE.Group(); lens.position.z = 0.5; group.add(lens);
  const mount = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.74, 0.12, 48), metal); mount.rotation.x = Math.PI / 2; mount.position.z = 0.06; lens.add(mount);
  const rings = [0.68, 0.64, 0.66, 0.62].map((r, i) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 48), i % 2 ? metal : rubber); m.rotation.x = Math.PI / 2; lens.add(m); return m;
  });
  const front = new THREE.Group(); lens.add(front);
  const hood = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.6, 0.12, 48, 1, true), rubber); hood.rotation.x = Math.PI / 2; front.add(hood);
  const glass = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 12, 0, Math.PI * 2, 0, 0.55), new THREE.MeshPhysicalMaterial({ color: "#0a1020", roughness: 0.05, metalness: 0.2, clearcoat: 1, iridescence: 1, iridescenceIOR: 1.6 }));
  glass.rotation.x = Math.PI / 2; glass.position.z = -0.48; front.add(glass);
  const iris = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 8, 48), new THREE.MeshBasicMaterial({ color: COL.accent })); iris.position.z = 0.0; front.add(iris);
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 3, 0.25); glow.position.z = 0.25; front.add(glow);
  return {
    group, floor: -0.95,
    update(t, dt, P) {
      const z = clamp01(P.zoom || 0), step = 0.3 * (1 + z * 0.75);
      rings.forEach((m, i) => { m.position.z = 0.27 + i * step; });
      front.position.z = 0.27 + 3 * step + 0.24;
      front.rotation.z = t * 0.25 * (0.3 + z);
      iris.scale.setScalar(1 - 0.35 * z + Math.sin(t * 2) * 0.03 * z);
      glow.material.opacity = 0.15 + 0.4 * z;
      const fl = P.flash || 0, burst = fl * Math.max(0, 1 - ((t * 0.6) % 1) * 7);
      flashGlow.material.opacity = burst; flash.material.emissiveIntensity = 0.2 + burst * 3;
    },
  };
}
`;

/* --------------------------- piringan hitam -------------------------- */
const VINYL = String.raw`
function buildObject({ THREE, COL, glowTexture, textTexture, brand }) {
  const group = new THREE.Group();
  const wood = mat(THREE, COL.obj, { roughness: 0.55, metalness: 0.1 });
  const metal = mat(THREE, COL.obj2, { roughness: 0.25, metalness: 0.9 });
  const plinth = new THREE.Mesh(slabGeo(THREE, 3.6, 2.7, 0.32, 0.16, 0.05), wood); plinth.rotation.x = -Math.PI / 2; plinth.position.y = -0.16; group.add(plinth);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.22, 0.08, 72), metal); platter.position.set(-0.35, 0.04, 0); group.add(platter);
  const label = textTexture((g, w, h) => {
    g.fillStyle = "#0b0b0d"; g.fillRect(0, 0, w, h);
    for (let r = 250; r > 92; r -= 3) { g.strokeStyle = r % 2 ? "rgba(255,255,255,.05)" : "rgba(255,255,255,.1)"; g.lineWidth = 1; g.beginPath(); g.arc(w / 2, h / 2, r, 0, 7); g.stroke(); }
    const gr = g.createLinearGradient(0, h / 2 - 90, 0, h / 2 + 90); gr.addColorStop(0, COL.accent); gr.addColorStop(1, COL.accent2);
    g.fillStyle = gr; g.beginPath(); g.arc(w / 2, h / 2, 88, 0, 7); g.fill();
    g.fillStyle = "#fff"; g.font = "800 24px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(String(brand).slice(0, 16), w / 2, h / 2 - 30);
    g.font = "600 14px system-ui, sans-serif"; g.fillText("SIDE A · 33⅓", w / 2, h / 2 + 34);
    g.fillStyle = "#0b0b0d"; g.beginPath(); g.arc(w / 2, h / 2, 6, 0, 7); g.fill();
  }, 512, 512);
  const vinylSide = new THREE.MeshStandardMaterial({ color: 0x0b0b0d, roughness: 0.3 });
  const record = new THREE.Mesh(new THREE.CylinderGeometry(1.18, 1.18, 0.02, 72), [vinylSide, new THREE.MeshStandardMaterial({ map: label, roughness: 0.28, metalness: 0.2 }), vinylSide]);
  record.position.set(-0.35, 0.09, 0); group.add(record);
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 12), metal); spindle.position.set(-0.35, 0.12, 0); group.add(spindle);

  /* Lengan jarum: berputar ke atas piringan (keadaan "arm"). */
  const arm = new THREE.Group(); arm.position.set(1.3, 0.05, -0.95); group.add(arm);
  const armBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.16, 28), metal); arm.add(armBase);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.75, 10), metal); tube.rotation.x = Math.PI / 2; tube.position.set(0, 0.16, 0.85); arm.add(tube);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, 0.26), mat(THREE, COL.accent, { roughness: 0.3 })); head.position.set(0, 0.12, 1.75); arm.add(head);
  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 20), metal); weight.rotation.x = Math.PI / 2; weight.position.set(0, 0.16, -0.25); arm.add(weight);
  [[1.3, 0.85], [1.0, 0.85]].forEach((p, i) => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.07, 20), i ? metal : mat(THREE, COL.accent2, { emissive: COL.accent2, emissiveIntensity: 0.4 })); k.position.set(p[0], 0.03, p[1]); group.add(k); });

  /* Gelombang suara. */
  const waves = [0, 1, 2].map(() => {
    const m = new THREE.Mesh(new THREE.TorusGeometry(1, 0.012, 6, 96), new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, opacity: 0, depthWrite: false }));
    m.rotation.x = Math.PI / 2; m.position.set(-0.35, 0.12, 0); group.add(m); return m;
  });
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 6, 0.15); glow.position.set(-0.35, 0.3, -0.6); group.add(glow);
  let rot = 0;
  return {
    group, floor: -0.34,
    update(t, dt, P) {
      const s = clamp01(P.spin || 0), a = clamp01(P.arm || 0);
      rot += dt * (0.25 + 3.6 * s); record.rotation.y = -rot;
      arm.rotation.y = lerp(0.05, -0.55, a); arm.rotation.x = lerp(-0.05, 0, a);
      waves.forEach((w, i) => { const ph = (t * 0.45 + i / 3) % 1; w.scale.setScalar(1.25 + ph * 1.6); w.material.opacity = (1 - ph) * 0.7 * s; });
      glow.material.opacity = 0.1 + 0.35 * s;
    },
  };
}
`;

/* ------------------------------- parfum ------------------------------ */
const PERFUME = String.raw`
function buildObject({ THREE, COL, glowTexture, textTexture, brand }) {
  const group = new THREE.Group();
  const gold = mat(THREE, COL.obj2, { roughness: 0.22, metalness: 0.95 });
  const bottle = new THREE.Group(); bottle.rotation.y = Math.PI / 8; group.add(bottle);
  const prof = [[0, -1.3], [0.95, -1.3], [1.05, -1.22], [1.08, -1.0], [1.08, 0.45], [1.0, 0.72], [0.62, 0.92], [0.34, 1.02], [0.32, 1.22], [0, 1.22]].map((p) => new THREE.Vector2(p[0], p[1]));
  const liquidProf = [[0, -1.18], [0.92, -1.18], [0.98, -1.05], [0.98, 0.25], [0, 0.25]].map((p) => new THREE.Vector2(p[0], p[1]));
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liquidProf, 8), new THREE.MeshStandardMaterial({ color: COL.accent, emissive: COL.accent, emissiveIntensity: 0.25, roughness: 0.2, flatShading: true }));
  bottle.add(liquid);
  const glass = new THREE.Mesh(new THREE.LatheGeometry(prof, 8), new THREE.MeshPhysicalMaterial({ color: COL.obj, roughness: 0.04, metalness: 0.1, clearcoat: 1, transparent: true, opacity: 0.32, flatShading: true, depthWrite: false, side: THREE.DoubleSide }));
  glass.renderOrder = 2; bottle.add(glass);
  const lbl = textTexture((g, w, h) => {
    g.fillStyle = "rgba(255,255,255,.92)"; g.fillRect(0, 0, w, h);
    g.strokeStyle = COL.obj2; g.lineWidth = 6; g.strokeRect(14, 14, w - 28, h - 28);
    g.fillStyle = "#1d1714"; g.textAlign = "center"; g.textBaseline = "middle"; g.font = "600 52px Georgia, serif"; g.fillText(String(brand).slice(0, 14), w / 2, h / 2 - 10);
    g.font = "500 22px system-ui, sans-serif"; g.fillStyle = "#6b5f57"; g.fillText("EAU DE PARFUM", w / 2, h / 2 + 46);
  }, 512, 300);
  const label = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.52), new THREE.MeshBasicMaterial({ map: lbl, toneMapped: false })); label.position.set(0, -0.35, 1.005); label.renderOrder = 3; group.add(label);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.18, 8), gold); collar.position.y = 1.24; bottle.add(collar);
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.22, 16), gold); nozzle.position.y = 1.42; group.add(nozzle);
  const cap = new THREE.Group(); group.add(cap);
  const capBody = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.78, 8), mat(THREE, COL.obj2, { roughness: 0.18, metalness: 0.9 })); capBody.rotation.y = Math.PI / 8; cap.add(capBody);
  const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.16), new THREE.MeshStandardMaterial({ color: COL.accent2, emissive: COL.accent2, emissiveIntensity: 0.3, roughness: 0.15, metalness: 0.3, flatShading: true })); gem.position.y = 0.48; cap.add(gem);

  /* Kabut semprotan. */
  const MIST = 160, mp = new Float32Array(MIST * 3), seed = new Float32Array(MIST);
  for (let i = 0; i < MIST; i++) seed[i] = Math.random();
  const mg = new THREE.BufferGeometry(); mg.setAttribute("position", new THREE.BufferAttribute(mp, 3));
  const mist = new THREE.Points(mg, new THREE.PointsMaterial({ color: COL.accent2, size: 0.12, map: glowTexture(), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(mist);

  /* Bahan yang mengorbit (kelopak & butir). */
  const orb = new THREE.Group(); group.add(orb);
  const petal = new THREE.SphereGeometry(0.16, 14, 8), bead = new THREE.IcosahedronGeometry(0.1, 0);
  const bits = [];
  for (let i = 0; i < 12; i++) {
    const m = new THREE.Mesh(i % 3 ? petal : bead, mat(THREE, i % 2 ? COL.accent : COL.accent2, { roughness: 0.4, flatShading: i % 3 === 0 }));
    if (i % 3) m.scale.set(1, 0.35, 0.7);
    m.userData = { a: (i / 12) * Math.PI * 2, r: 1.9 + (i % 4) * 0.22, y: -0.8 + ((i * 7) % 12) / 12 * 2.2, sp: 0.25 + (i % 3) * 0.08 };
    orb.add(m); bits.push(m);
  }
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 6, 0.2); glow.position.z = -0.8; group.add(glow);
  return {
    group, floor: -1.36,
    update(t, dt, P) {
      const c = clamp01(P.cap || 0), e = c * c * (3 - 2 * c), o = clamp01(P.orbit || 0);
      cap.position.set(e * 1.2, 1.72 + e * 0.25, 0.2 * e); cap.rotation.set(0, e * 1.3, -e * 0.5);
      const ms = clamp01(P.mist || 0);
      mist.material.opacity = ms * 0.8;
      if (ms > 0.01) {
        for (let i = 0; i < MIST; i++) {
          const ph = (t * 0.5 + seed[i]) % 1, a = seed[i] * 40;
          mp[i * 3] = Math.cos(a) * ph * 0.9 + ph * 0.6; mp[i * 3 + 1] = 1.56 + ph * 1.4 + Math.sin(a) * ph * 0.3; mp[i * 3 + 2] = Math.sin(a) * ph * 0.9 + ph * 0.5;
        }
        mg.attributes.position.needsUpdate = true;
      }
      bits.forEach((m) => { const u = m.userData, a = u.a + t * u.sp; m.position.set(Math.cos(a) * u.r, u.y + Math.sin(t + u.a) * 0.12, Math.sin(a) * u.r); m.rotation.set(t * 0.7 + u.a, t * 0.5, 0); });
      orb.scale.setScalar(Math.max(0.001, o)); orb.visible = o > 0.01;
      glow.material.opacity = 0.12 + 0.35 * Math.max(ms, o);
    },
  };
}
`;

/* -------------------------------- roket ------------------------------ */
const ROCKET = String.raw`
function buildObject({ THREE, COL, glowTexture, textTexture }) {
  const group = new THREE.Group();
  const hull = mat(THREE, COL.obj, { roughness: 0.35, metalness: 0.25 });
  const metal = mat(THREE, COL.obj2, { roughness: 0.3, metalness: 0.85 });
  const paint = mat(THREE, COL.accent, { roughness: 0.4 });
  const rocket = new THREE.Group(); group.add(rocket);
  const prof = [[0, -1.6], [0.42, -1.6], [0.55, -1.32], [0.6, -0.6], [0.6, 0.4], [0.53, 1.0], [0.34, 1.55], [0.12, 1.92], [0, 2.0]].map((p) => new THREE.Vector2(p[0], p[1]));
  rocket.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 40), hull));
  const tip = new THREE.Mesh(new THREE.LatheGeometry([[0, 1.5], [0.37, 1.5], [0.34, 1.55], [0.12, 1.92], [0, 2.0]].map((p) => new THREE.Vector2(p[0], p[1])), 40), paint); tip.scale.setScalar(1.01); rocket.add(tip);
  const band = new THREE.Mesh(new THREE.CylinderGeometry(0.605, 0.605, 0.16, 40), paint); band.position.y = -0.85; rocket.add(band);
  const port = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 10, 32), metal); port.position.set(0, 0.55, 0.585); rocket.add(port);
  const win = new THREE.Mesh(new THREE.CircleGeometry(0.22, 32), new THREE.MeshStandardMaterial({ color: COL.accent2, emissive: COL.accent2, emissiveIntensity: 0.6, roughness: 0.1 })); win.position.set(0, 0.55, 0.59); rocket.add(win);
  const fin = new THREE.Shape(); fin.moveTo(0, 0); fin.lineTo(0.62, -0.55); fin.lineTo(0.62, -1.05); fin.lineTo(0, -0.62); fin.lineTo(0, 0);
  const finGeo = new THREE.ExtrudeGeometry(fin, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2 }); finGeo.translate(0, 0, -0.03);
  for (let i = 0; i < 3; i++) { const f = new THREE.Mesh(finGeo, paint), a = (i / 3) * Math.PI * 2 + Math.PI / 2; f.position.set(Math.cos(a) * 0.5, -0.75, Math.sin(a) * 0.5); f.rotation.y = -a; rocket.add(f); }
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.42, 0.36, 32, 1, true), metal); nozzle.position.y = -1.76; rocket.add(nozzle);

  /* Api & asap (keadaan "flame"). */
  const flame = new THREE.Group(); flame.position.y = -1.94; rocket.add(flame);
  const outer = new THREE.Mesh(new THREE.ConeGeometry(0.34, 1.7, 24, 1, true), new THREE.MeshBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  outer.rotation.x = Math.PI; outer.position.y = -0.85; flame.add(outer);
  const core = new THREE.Mesh(new THREE.ConeGeometry(0.18, 1.0, 16, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff4d6, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
  core.rotation.x = Math.PI; core.position.y = -0.5; flame.add(core);
  const fglow = glowSprite(THREE, glowTexture(), COL.accent2, 3.4, 0); fglow.position.y = -0.4; flame.add(fglow);
  const SM = 70, sp = new Float32Array(SM * 3), seed = new Float32Array(SM);
  for (let i = 0; i < SM; i++) seed[i] = Math.random();
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  const smoke = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, map: glowTexture(), transparent: true, opacity: 0, depthWrite: false }));
  group.add(smoke);

  /* Planet bercincin (keadaan "orbit"). */
  const planet = new THREE.Group(); planet.position.set(-3.0, -1.2, -2.6); group.add(planet);
  const stripes = textTexture((g, w, h) => { for (let y = 0; y < h; y += 8) { g.fillStyle = (y / 8) % 3 === 0 ? COL.accent : (y / 8) % 3 === 1 ? COL.obj2 : COL.accent2; g.globalAlpha = 0.55 + 0.45 * Math.sin(y * 0.3) ** 2; g.fillRect(0, y, w, 8); } g.globalAlpha = 1; }, 64, 256);
  const ball = new THREE.Mesh(new THREE.SphereGeometry(1.2, 48, 24), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.8 })); planet.add(ball);
  const ring = new THREE.Mesh(new THREE.RingGeometry(1.6, 2.3, 96), new THREE.MeshBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.45, side: THREE.DoubleSide, depthWrite: false }));
  ring.rotation.x = Math.PI / 2.4; planet.add(ring);
  return {
    group, floor: -1.75,
    update(t, dt, P) {
      const f = clamp01(P.flame || 0), l = P.lift || 0, o = clamp01(P.orbit || 0);
      rocket.position.y = l * 1.3 + Math.sin(t * 1.4) * 0.06;
      rocket.position.x = Math.sin(t * 31) * 0.008 * f;
      flame.scale.set(1, Math.max(0.001, f * (0.85 + 0.15 * Math.sin(t * 38))), 1); flame.visible = f > 0.01;
      fglow.material.opacity = f * 0.9;
      smoke.material.opacity = f * 0.16;
      if (f > 0.01) {
        for (let i = 0; i < SM; i++) {
          const ph = (t * 0.6 + seed[i]) % 1, a = seed[i] * 50;
          sp[i * 3] = Math.cos(a) * (0.3 + ph * 2.2); sp[i * 3 + 1] = rocket.position.y - 2.4 - ph * 1.2; sp[i * 3 + 2] = Math.sin(a) * (0.3 + ph * 2.2);
        }
        sg.attributes.position.needsUpdate = true;
      }
      planet.scale.setScalar(Math.max(0.001, o)); planet.visible = o > 0.01;
      ball.rotation.y = t * 0.12; ring.rotation.z = t * 0.05;
    },
  };
}
`;

/* -------------------------------- buku ------------------------------- */
const BOOK = String.raw`
function buildObject({ THREE, COL, makeScreen, glowTexture, textTexture, brand }) {
  const group = new THREE.Group();
  const W = 1.7, H = 2.4, T = 0.06, D = 0.22;
  const cloth = mat(THREE, COL.obj, { roughness: 0.8, metalness: 0.05 });
  const paperM = mat(THREE, "#f3ecdc", { roughness: 0.95 });
  const inner = new THREE.Group(); group.add(inner);
  const back = new THREE.Mesh(slabGeo(THREE, W, H, T, 0.05, 0.012), cloth); back.position.x = W / 2; inner.add(back);
  const block = new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, H - 0.1, D), paperM); block.position.set(W / 2 - 0.02, 0, T / 2 + D / 2); inner.add(block);
  const scr = screenMesh(THREE, makeScreen(600, 820, "paper"), 1.56, 2.13); scr.position.set(W / 2 - 0.02, 0, T / 2 + D + 0.002); inner.add(scr);
  const spine = new THREE.Mesh(new THREE.CylinderGeometry(D / 2 + T, D / 2 + T, H, 20, 1, false, Math.PI, Math.PI), cloth); spine.position.set(0, 0, T / 2 + D / 2); inner.add(spine);
  const ribbon = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.6, 0.01), mat(THREE, COL.accent, { roughness: 0.5 })); ribbon.position.set(0.5, -H / 2 - 0.2, T / 2 + D + 0.004); inner.add(ribbon);

  /* Sampul depan berengsel di punggung buku (keadaan "open"). */
  const cover = new THREE.Group(); cover.position.set(0, 0, T + D + T / 2); inner.add(cover);
  const front = new THREE.Mesh(slabGeo(THREE, W, H, T, 0.05, 0.012), cloth); front.position.x = W / 2; cover.add(front);
  const art = textTexture((g, w, h) => {
    g.fillStyle = COL.obj; g.fillRect(0, 0, w, h);
    g.strokeStyle = COL.obj2; g.lineWidth = 5; g.strokeRect(28, 28, w - 56, h - 56); g.lineWidth = 2; g.strokeRect(44, 44, w - 88, h - 88);
    g.fillStyle = COL.obj2; g.textAlign = "center"; g.textBaseline = "middle";
    g.beginPath(); g.arc(w / 2, h * 0.3, 46, 0, 7); g.lineWidth = 4; g.stroke();
    g.font = "italic 600 46px Georgia, serif"; g.fillText("✦", w / 2, h * 0.3 + 2);
    const words = String(brand).split(" ");
    g.font = "700 64px Georgia, serif"; words.slice(0, 3).forEach((wd, i) => g.fillText(wd, w / 2, h * 0.52 + i * 72));
    g.font = "500 22px system-ui, sans-serif"; g.fillText("— kumpulan cerita —", w / 2, h * 0.86);
  }, 512, 724);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.06, H - 0.06), new THREE.MeshStandardMaterial({ map: art, roughness: 0.75 })); face.position.set(W / 2, 0, T / 2 + 0.003); cover.add(face);
  const leftBlock = new THREE.Mesh(new THREE.BoxGeometry(W - 0.08, H - 0.1, 0.05), paperM); leftBlock.position.set(W / 2 - 0.02, 0, -T / 2 - 0.025); cover.add(leftBlock);
  const leftTex = textTexture((g, w, h) => {
    g.fillStyle = "#f3ecdc"; g.fillRect(0, 0, w, h);
    g.fillStyle = "#a59a86"; g.font = "600 22px Georgia, serif"; g.textAlign = "center"; g.fillText("— prolog —", w / 2, 90);
    g.fillStyle = "#c6bba6"; for (let y = 140; y < h - 80; y += 34) g.fillRect(60, y, (w - 120) * (y % 5 === 0 ? 0.7 : 1), 8);
    g.fillStyle = "#a59a86"; g.font = "500 20px Georgia, serif"; g.fillText("1", w / 2, h - 40);
  }, 400, 560);
  const leftPage = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.14, H - 0.2), new THREE.MeshStandardMaterial({ map: leftTex, roughness: 0.95 }));
  leftPage.rotation.y = Math.PI; leftPage.position.set(W / 2 - 0.02, 0, -T / 2 - 0.052); cover.add(leftPage);

  /* Halaman yang membalik (keadaan "flip"). */
  const pageGeo = new THREE.PlaneGeometry(W - 0.12, H - 0.16, 8, 1); pageGeo.translate((W - 0.12) / 2, 0, 0);
  const pages = [0, 1, 2].map(() => { const p = new THREE.Group(); p.position.set(0, 0, T / 2 + D + 0.01); const m = new THREE.Mesh(pageGeo, new THREE.MeshStandardMaterial({ color: "#f7f1e4", roughness: 0.95, side: THREE.DoubleSide })); p.add(m); inner.add(p); return p; });
  const glow = glowSprite(THREE, glowTexture(), COL.accent, 6, 0.15); glow.position.z = -0.8; group.add(glow);
  return {
    group, floor: -1.3,
    update(t, dt, P) {
      const o = clamp01(P.open || 0), e = o * o * (3 - 2 * o), f = clamp01(P.flip || 0);
      cover.rotation.y = -e * Math.PI * 0.985;
      inner.position.x = -W / 2 * (1 - e);
      pages.forEach((p, i) => {
        const ph = clamp01((((t * 0.32 + i / 3) % 1) * 1.5) - 0.25);
        p.visible = f > 0.5 && e > 0.9 && ph > 0.01 && ph < 0.99;
        p.rotation.y = -ph * Math.PI * 0.97;
        p.position.z = T / 2 + D + 0.01 + i * 0.004;
      });
      glow.material.opacity = 0.1 + 0.3 * e;
    },
  };
}
`;

const RAW: Record<ObjectKind, string> = { monitor: MONITOR, phone: PHONE, laptop: LAPTOP, camera: CAMERA, vinyl: VINYL, perfume: PERFUME, rocket: ROCKET, book: BOOK };

export const OBJECTS = Object.fromEntries(Object.entries(RAW).map(([k, v]) => [k, `${HELPERS.trim()}\n${v.trim()}`])) as Record<ObjectKind, string>;
