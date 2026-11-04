/* ================================================================== */
/* 3D Scroll Story scenes (v22), part D: ship in a bottle, Rubik's       */
/* cube, gears → conveyor belt, paper map → mountain.                   */
/* ================================================================== */

/** 10. A ship in a bottle → the cork comes off → the camera enters through the bottle neck → the bottle vanishes, the sea inside expands → the ship sails between islands. */
export const SCENE_BOTOL = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, rnd } = ctx;
  const bottle = new THREE.Group(); bottle.rotation.z = -Math.PI / 2; scene.add(bottle);
  const prof = [[0.001, -2.3], [0.9, -2.3], [1.0, -2.1], [1.0, 0.9], [0.86, 1.45], [0.36, 1.9], [0.33, 2.7], [0.4, 2.78], [0.38, 2.9], [0.3, 2.9]].map((p) => new THREE.Vector2(p[0], p[1]));
  const glassM = new THREE.MeshStandardMaterial({ color: "#cfeee6", transparent: true, opacity: 0.22, roughness: 0.04, metalness: 0.1, side: THREE.DoubleSide, depthWrite: false });
  bottle.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), glassM));
  const cork = new THREE.Mesh(new THREE.CylinderGeometry(0.31, 0.27, 0.6, 20), mat("#b98a55", { roughness: 0.9 })); cork.position.y = 2.95; bottle.add(cork);
  /* Mini world: sea + ship + island. When "free", this world grows 14 times larger. */
  const world = new THREE.Group(); scene.add(world);
  const SG = new THREE.PlaneGeometry(4.2, 1.7, 84, 34); SG.rotateX(-Math.PI / 2);
  const sea = new THREE.Mesh(SG, mat(COL.obj, { roughness: 0.55, metalness: 0.0 })); sea.position.y = -0.45; world.add(sea);
  const sp = SG.attributes.position, sb = sp.array.slice();
  const ship = new THREE.Group(); world.add(ship);
  const hs = new THREE.Shape(); hs.moveTo(-0.5, 0.08); hs.lineTo(0.55, 0.08); hs.quadraticCurveTo(0.45, -0.12, 0.3, -0.14); hs.lineTo(-0.38, -0.14); hs.quadraticCurveTo(-0.5, -0.05, -0.5, 0.08);
  const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hs, { depth: 0.24, bevelEnabled: false }), mat(COL.obj2)); hull.position.z = -0.12; ship.add(hull);
  const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6), mat("#5a3d25")); mast.position.set(0.02, 0.45, 0); ship.add(mast);
  const sailM = mat("#fffaf0", { side: THREE.DoubleSide, roughness: 0.9 });
  const s1 = new THREE.Shape(); s1.moveTo(0, 0); s1.lineTo(0, 0.7); s1.lineTo(0.42, 0.05); s1.closePath();
  const sail = new THREE.Mesh(new THREE.ShapeGeometry(s1), sailM); sail.position.set(0.04, 0.12, 0); ship.add(sail);
  const s2 = new THREE.Shape(); s2.moveTo(0, 0); s2.lineTo(0, 0.6); s2.lineTo(-0.36, 0.04); s2.closePath();
  const jib = new THREE.Mesh(new THREE.ShapeGeometry(s2), mat(COL.accent, { side: THREE.DoubleSide })); jib.position.set(0.0, 0.14, 0.01); ship.add(jib);
  ship.position.set(-0.6, -0.42, 0); ship.scale.setScalar(0.85);
  const isl = [];
  [[1.2, -0.55, 0.22], [-1.6, 0.5, 0.3], [0.5, 0.6, 0.18], [1.8, 0.45, 0.14], [-0.4, -0.65, 0.12]].forEach((p, i) => {
    const g = new THREE.Group(); g.position.set(p[0], -0.46, p[1]);
    const rock = new THREE.Mesh(new THREE.ConeGeometry(p[2], p[2] * 1.4, 7), mat("#c9b48a", { flatShading: true })); rock.position.y = p[2] * 0.5; g.add(rock);
    const top = new THREE.Mesh(new THREE.IcosahedronGeometry(p[2] * 0.55, 0), mat("#4d9a5a", { flatShading: true })); top.position.y = p[2] * 1.1; g.add(top);
    world.add(g); isl.push(g);
  });
  const ship0 = new THREE.Vector3(-0.6, -0.42, 0), path = new THREE.CatmullRomCurve3([[-0.6, 0], [-0.2, 0.25], [0.5, 0.2], [1.0, -0.15], [1.6, -0.1]].map((p) => new THREE.Vector3(p[0], -0.42, p[1])));
  return {
    update(S, t) {
      const f = S.free;
      const amp = lerp(0.025, 0.03, f);
      for (let i = 0; i < sp.count; i++) { const x = sb[i * 3], z = sb[i * 3 + 2]; sp.setY(i, Math.sin(x * 6 + t * 1.6) * amp + Math.cos(z * 7 + t * 1.2) * amp * 0.7); }
      sp.needsUpdate = true; SG.computeVertexNormals();
      const k = lerp(1, 14, f * f);
      world.scale.setScalar(k);
      world.position.y = lerp(0, 0.45 * 14 - 0.6, f * f);
      const sl = S.sail;
      const p = sl > 0 ? path.getPointAt(Math.min(0.999, sl)) : ship0;
      ship.position.set(p.x, -0.42 + Math.sin(t * 1.6 + p.x * 6) * 0.02, p.z);
      ship.rotation.set(Math.sin(t * 1.3) * 0.06, sl > 0 ? -Math.atan2(path.getTangentAt(Math.min(0.999, sl)).z, path.getTangentAt(Math.min(0.999, sl)).x) : 0, Math.sin(t * 1.1) * 0.05);
      sail.scale.x = 1 + Math.sin(t * 2) * 0.05;
      isl.forEach((g, i) => { const e = Math.max(0.001, seg(S.isl, i * 0.12, i * 0.12 + 0.4)); g.scale.setScalar(e); g.visible = e > 0.01; });
      glassM.opacity = 0.22 * (1 - seg(f, 0, 0.5));
      bottle.visible = f < 0.5;
      bottle.scale.setScalar(lerp(1, 3, seg(f, 0, 0.5)));
      cork.position.y = 2.95 + seg(S.cork, 0, 1) * 2.4; cork.rotation.x = S.cork * 3;
      bottle.rotation.x = Math.sin(t * 0.6) * 0.05 * (1 - S.cork);
    },
  };
}`;

/** 11. Scrambled Rubik's cube → solved turn by turn with the scroll → explodes into 26 pieces → comes together again. */
export const SCENE_RUBIK = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp } = ctx;
  const cube = new THREE.Group(); scene.add(cube);
  const COLORS = { px: "#e8443a", nx: "#ff9a2e", py: "#ffffff", ny: "#ffd43b", pz: "#2fbf71", nz: "#3a7bff" };
  const black = mat("#141518", { roughness: 0.45 });
  const sticker = {}; Object.keys(COLORS).forEach((k) => { sticker[k] = mat(COLORS[k], { roughness: 0.25 }); });
  const body = new THREE.BoxGeometry(0.96, 0.96, 0.96), plate = new THREE.PlaneGeometry(0.8, 0.8);
  const cubies = [];
  for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (!x && !y && !z) continue;
    const g = new THREE.Group(); g.add(new THREE.Mesh(body, black));
    const add = (key, px, py, pz, rx, ry) => { const m = new THREE.Mesh(plate, sticker[key]); m.position.set(px, py, pz); m.rotation.set(rx, ry, 0); g.add(m); };
    if (x === 1) add("px", 0.485, 0, 0, 0, Math.PI / 2); if (x === -1) add("nx", -0.485, 0, 0, 0, -Math.PI / 2);
    if (y === 1) add("py", 0, 0.485, 0, -Math.PI / 2, 0); if (y === -1) add("ny", 0, -0.485, 0, Math.PI / 2, 0);
    if (z === 1) add("pz", 0, 0, 0.485, 0, 0); if (z === -1) add("nz", 0, 0, -0.485, 0, Math.PI);
    cube.add(g); cubies.push({ g, home: new THREE.Vector3(x, y, z), p: new THREE.Vector3(), q: new THREE.Quaternion() });
  }
  const AX = { x: new THREE.Vector3(1, 0, 0), y: new THREE.Vector3(0, 1, 0), z: new THREE.Vector3(0, 0, 1) };
  const SCRAMBLE = [["y", 1, 1], ["x", -1, -1], ["z", 1, 1], ["y", -1, -1], ["x", 1, 1], ["z", -1, -1], ["y", 1, -1]];
  const SOLVE = SCRAMBLE.slice().reverse().map((m) => [m[0], m[1], -m[2]]);
  const rq = new THREE.Quaternion();
  function turn(list, m, k) {
    const ax = AX[m[0]], ang = m[2] * (Math.PI / 2) * k;
    rq.setFromAxisAngle(ax, ang);
    list.forEach((c) => { if (Math.round(c.p[m[0]]) === m[1]) { c.p.applyQuaternion(rq); c.q.premultiply(rq); } });
  }
  function reset() { cubies.forEach((c) => { c.p.copy(c.home); c.q.identity(); }); }
  reset(); SCRAMBLE.forEach((m) => turn(cubies, m, 1));
  const scrambled = cubies.map((c) => [c.p.clone(), c.q.clone()]);
  const dirs = cubies.map((c) => c.home.clone().normalize());
  return {
    update(S, t) {
      cubies.forEach((c, i) => { c.p.copy(scrambled[i][0]); c.q.copy(scrambled[i][1]); });
      const n = S.solve * SOLVE.length;
      for (let i = 0; i < SOLVE.length; i++) { const k = Math.max(0, Math.min(1, n - i)); if (k <= 0) break; const e = k < 1 ? k * k * (3 - 2 * k) : 1; if (e > 0) turn(cubies, SOLVE[i], e); }
      const ex = S.explode;
      cubies.forEach((c, i) => {
        /* Partial rotations leave positions off-grid; the explosion uses each piece's home direction. */
        c.g.position.copy(c.p).addScaledVector(dirs[i], ex * (1.6 + (i % 5) * 0.25));
        c.g.quaternion.copy(c.q);
        if (ex > 0) c.g.rotateOnAxis(dirs[i], ex * (t * 0.6 + i));
      });
      cube.rotation.set(0.5 + Math.sin(t * 0.3) * 0.08 * (1 - S.solve), t * 0.2 * (1 - S.still) + S.spin * Math.PI * 2, 0);
    },
  };
}`;

/** 12. One gear → other gears arrive and mesh → the machine turns → the conveyor belt delivers parcels. */
export const SCENE_GIGI = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp } = ctx;
  function gearGeo(N, r, hole) {
    const s = new THREE.Shape(), ro = r + 0.11, ri = r - 0.11;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2, w = (Math.PI * 2) / N;
      const p = [[ri, a], [ri, a + w * 0.18], [ro, a + w * 0.3], [ro, a + w * 0.55], [ri, a + w * 0.68]];
      p.forEach((q, j) => { const x = Math.cos(q[1]) * q[0], y = Math.sin(q[1]) * q[0]; if (i === 0 && j === 0) s.moveTo(x, y); else s.lineTo(x, y); });
    }
    s.closePath();
    const h = new THREE.Path(); h.absarc(0, 0, hole, 0, Math.PI * 2, true); s.holes.push(h);
    if (r > 0.7) for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2, c = new THREE.Path(); c.absarc(Math.cos(a) * r * 0.55, Math.sin(a) * r * 0.55, r * 0.17, 0, Math.PI * 2, true); s.holes.push(c); }
    const g = new THREE.ExtrudeGeometry(s, { depth: 0.28, bevelEnabled: true, bevelSize: 0.025, bevelThickness: 0.025, bevelSegments: 1, curveSegments: 10 });
    g.translate(0, 0, -0.14); return g;
  }
  /* Pitch radius proportional to the tooth count → all gears mesh. */
  const P = 0.0625;
  const spec = [[16, 0, 0], [10, 0, 0], [24, 0, 0], [12, 0, 0], [20, 0, 0]];
  const angles = [0, 0.35, -0.6, 0.9, -0.2];
  const gears = [];
  spec.forEach((s, i) => {
    const N = s[0], r = N * P;
    let x = 0, y = 0, ph = 0;
    if (i > 0) { const pv = gears[i - 1], d = pv.r + r; x = pv.x + Math.cos(angles[i]) * d; y = pv.y + Math.sin(angles[i]) * d; }
    const m = new THREE.Mesh(gearGeo(N, r, Math.max(0.08, r * 0.18)), mat(i % 2 ? COL.obj2 : COL.obj, { metalness: 0.45, roughness: 0.35 }));
    const axle = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(0.06, r * 0.16), Math.max(0.06, r * 0.16), 0.5, 16), mat("#2a2f36", { metalness: 0.6, roughness: 0.3 })); axle.rotation.x = Math.PI / 2;
    const g = new THREE.Group(); g.add(m, axle); scene.add(g);
    gears.push({ g, m, N, r, x, y, dir: i % 2 ? -1 : 1 });
  });
  /* Phase so the teeth don't collide: each wheel is turned half a tooth relative to the previous one along the center line. */
  gears.forEach((g, i) => { if (!i) { g.ph = 0; return; } const pv = gears[i - 1], a = Math.atan2(g.y - pv.y, g.x - pv.x); g.ph = -(pv.ph - a) * (pv.N / g.N) + a + Math.PI + Math.PI / g.N; });
  const cx = gears.reduce((a, g) => a + g.x, 0) / gears.length, cy = gears.reduce((a, g) => a + g.y, 0) / gears.length;
  gears.forEach((g) => { g.x -= cx; g.y -= cy; });
  /* Conveyor belt below, driven by the last wheel. */
  const belt = new THREE.Group(); belt.position.set(0, -3.2, 0.8); scene.add(belt);
  const bodyB = new THREE.Mesh(new THREE.BoxGeometry(9, 0.18, 1.3), mat("#262b31", { roughness: 0.7 })); belt.add(bodyB);
  [-4.5, 4.5].forEach((x) => { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 1.32, 16), mat("#5a626c", { metalness: 0.6 })); r.rotation.x = Math.PI / 2; r.position.x = x; belt.add(r); });
  const legs = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.2, 0.1), mat("#1c2026")); legs.position.y = -0.7; belt.add(legs);
  const BN = 7, boxes = new THREE.InstancedMesh(new THREE.BoxGeometry(0.62, 0.48, 0.62), mat("#c99a5f", { roughness: 0.85 }), BN), tape = new THREE.InstancedMesh(new THREE.BoxGeometry(0.64, 0.5, 0.12), mat(COL.accent), BN);
  belt.add(boxes, tape);
  const dm = new THREE.Object3D();
  let spin = 0;
  return {
    update(S, t, dt) {
      spin += (dt || 0.016) * S.run * 0.9;
      const base = spin + S.turn * 6;
      const show = S.gears * gears.length;
      gears.forEach((g, i) => {
        const k = seg(show, i, i + 1);
        g.g.position.set(g.x + (1 - k) * (i % 2 ? 6 : -6), g.y + (1 - k) * 2, (1 - k) * -3);
        g.g.scale.setScalar(Math.max(0.001, k)); g.g.visible = k > 0.01;
        const ratio = gears[0].N / g.N;
        g.m.rotation.z = g.ph + g.dir * base * ratio;
      });
      belt.visible = S.belt > 0.01; belt.scale.setScalar(Math.max(0.001, S.belt));
      for (let i = 0; i < BN; i++) {
        const u = ((i / BN + base * 0.06) % 1 + 1) % 1, x = -4.2 + u * 8.4;
        const e = seg(S.belt, 0.3, 1) * Math.min(1, Math.min(u, 1 - u) * 12);
        dm.position.set(x, 0.33, 0); dm.rotation.set(0, 0, 0); dm.scale.setScalar(Math.max(0.001, e)); dm.updateMatrix(); boxes.setMatrixAt(i, dm.matrix); tape.setMatrixAt(i, dm.matrix);
      }
      boxes.instanceMatrix.needsUpdate = true; tape.instanceMatrix.needsUpdate = true;
    },
  };
}`;

/** 13. A flat paper map → contours rise into mountains (paper relief) → a hiking trail is drawn → a hiker climbs → a flag at the summit. */
export const SCENE_PETA = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, mat, seg, lerp, paint, glow } = ctx;
  const W = 10, D = 7;
  const peaks = [[1.2, -0.6, 2.6, 2.2], [-2.6, 1.2, 1.3, 1.6], [3.4, 1.6, 0.9, 1.2], [-1.0, -2.0, 0.8, 1.3]];
  const TRAIL_PTS = [[-4.2, 2.8], [-3.0, 2.2], [-2.0, 2.6], [-1.0, 1.6], [-0.2, 1.1], [0.2, 0.4], [0.9, 0.2], [0.8, -0.3], [1.2, -0.6]];
  const height = (x, z) => { let h = 0; peaks.forEach((p) => { const d = Math.hypot(x - p[0], z - p[1]); h += p[2] * Math.exp(-(d * d) / (p[3] * p[3] * 1.4)); }); return h + Math.sin(x * 1.3) * Math.cos(z * 1.1) * 0.08; };
  const map = paint(1400, 980, (g, w, h) => {
    g.fillStyle = "#f3e9d2"; g.fillRect(0, 0, w, h);
    g.strokeStyle = "rgba(120,90,50,.18)"; g.lineWidth = 1; for (let x = 0; x < w; x += 70) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y < h; y += 70) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    /* Contour lines: points whose height is near a multiple of 0.25. */
    const img = g.getImageData(0, 0, w, h), d = img.data;
    for (let py = 0; py < h; py += 1) for (let px = 0; px < w; px += 1) {
      const x = (px / w - 0.5) * W, z = (py / h - 0.5) * D, v = height(x, z) / 0.25, f = v - Math.floor(v);
      if (v > 0.25 && (f < 0.06 || f > 0.94)) { const o = (py * w + px) * 4, major = Math.round(v) % 4 === 0; d[o] = major ? 140 : 168; d[o + 1] = major ? 80 : 112; d[o + 2] = major ? 40 : 70; }
    }
    g.putImageData(img, 0, 0);
    g.fillStyle = "#7aa7c7"; g.globalAlpha = 0.5; g.beginPath(); g.ellipse(w * 0.16, h * 0.82, 120, 60, 0.3, 0, 7); g.fill(); g.globalAlpha = 1;
    g.strokeStyle = COL.accent; g.lineWidth = 5; g.setLineDash([16, 12]);
    g.beginPath(); TRAIL_PTS.forEach((p, i) => { const X = (p[0] / W + 0.5) * w, Y = (p[1] / D + 0.5) * h; if (i) g.lineTo(X, Y); else g.moveTo(X, Y); }); g.stroke(); g.setLineDash([]);
    g.save(); g.translate(w - 110, 110); g.strokeStyle = "#6a4a2a"; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 60, 0, 7); g.stroke(); g.fillStyle = "#6a4a2a"; g.beginPath(); g.moveTo(0, -56); g.lineTo(12, 0); g.lineTo(0, 10); g.lineTo(-12, 0); g.fill(); g.font = "700 30px Georgia, serif"; g.textAlign = "center"; g.fillText("U", 0, -70); g.restore();
    g.fillStyle = "#4a3420"; g.font = "700 46px Georgia, serif"; g.fillText(CONFIG.namaPeta || "", 60, h - 60);
    g.font = "italic 28px Georgia, serif"; g.fillText(CONFIG.subPeta || "", 60, h - 22);
  });
  const MG = new THREE.PlaneGeometry(W, D, 140, 98); MG.rotateX(-Math.PI / 2);
  const mp = MG.attributes.position, hts = new Float32Array(mp.count);
  for (let i = 0; i < mp.count; i++) hts[i] = height(mp.getX(i), mp.getZ(i));
  const sheet = new THREE.Mesh(MG, new THREE.MeshStandardMaterial({ map: map.tex, roughness: 0.95, side: THREE.DoubleSide }));
  scene.add(sheet);
  const trailPts = TRAIL_PTS.map((p) => new THREE.Vector3(p[0], 0, p[1]));
  const curve = new THREE.CatmullRomCurve3(trailPts), samples = curve.getPoints(200);
  const tl = new THREE.Line(new THREE.BufferGeometry().setFromPoints(samples), new THREE.LineBasicMaterial({ color: COL.accent2 })); scene.add(tl);
  const hiker = new THREE.Group(); scene.add(hiker);
  const hb = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.14, 4, 8), mat(COL.accent2)); hb.position.y = 0.14; hiker.add(hb);
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.06), mat(COL.accent)); pack.position.set(0, 0.16, -0.06); hiker.add(pack);
  const flag = new THREE.Group(); scene.add(flag);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.7, 6), mat("#3a2a1a")); pole.position.y = 0.35; flag.add(pole);
  const FG = new THREE.PlaneGeometry(0.42, 0.26, 8, 1); FG.translate(0.21, 0, 0);
  const cloth = new THREE.Mesh(FG, mat(COL.accent, { side: THREE.DoubleSide })); cloth.position.y = 0.55; flag.add(cloth);
  const fp = FG.attributes.position, fb = fp.array.slice();
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ffd38a", transparent: true, depthWrite: false })); sun.position.set(-6, 5, -8); sun.scale.setScalar(6); scene.add(sun);
  const clouds = [];
  for (let i = 0; i < 5; i++) { const c = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ffffff", transparent: true, opacity: 0.0, depthWrite: false })); c.scale.set(3.2, 1.2, 1); c.position.set(-4 + i * 2.2, 2.6 + (i % 2) * 0.5, -1 + (i % 3)); scene.add(c); clouds.push(c); }
  const tmp = new THREE.Vector3();
  return {
    update(S, t) {
      const r = S.rise;
      for (let i = 0; i < mp.count; i++) mp.setY(i, hts[i] * r);
      mp.needsUpdate = true; MG.computeVertexNormals();
      sheet.rotation.x = (1 - seg(S.rise, 0, 0.2)) * 0 + S.curl * 0.0;
      const posA = tl.geometry.attributes.position;
      samples.forEach((p, i) => posA.setXYZ(i, p.x, height(p.x, p.z) * r + 0.04, p.z));
      posA.needsUpdate = true; tl.geometry.setDrawRange(0, Math.floor(samples.length * S.trail)); tl.visible = S.trail > 0.01;
      const hp = curve.getPointAt(Math.min(0.999, Math.max(0.001, S.trail)));
      hiker.position.set(hp.x, height(hp.x, hp.z) * r, hp.z); hiker.visible = S.trail > 0.02 && S.trail < 1.2;
      const tg = curve.getTangentAt(Math.min(0.999, Math.max(0.001, S.trail))); hiker.rotation.y = Math.atan2(tg.x, tg.z);
      hb.position.y = 0.14 + Math.abs(Math.sin(t * 8)) * 0.02 * (S.trail > 0.02 && S.trail < 0.99 ? 1 : 0);
      const top = trailPts[trailPts.length - 1];
      flag.position.set(top.x + 0.1, height(top.x, top.z) * r, top.z); flag.scale.setScalar(Math.max(0.001, S.flag)); flag.visible = S.flag > 0.01;
      for (let i = 0; i < fp.count; i++) { const x = fb[i * 3]; fp.setZ(i, Math.sin(x * 14 - t * 6) * 0.03 * x * 2.5); }
      fp.needsUpdate = true;
      clouds.forEach((c, i) => { c.material.opacity = 0.75 * S.cloud; c.position.x = -5 + ((i * 2.2 + t * 0.15) % 10); });
    },
  };
}`;
