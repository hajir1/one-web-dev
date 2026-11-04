/* ================================================================== */
/* 3D Scroll Story scenes (v22), part B: hammer → house, seed → forest, */
/* coffee drop → farm map, key → padlock → shield.                      */
/* ================================================================== */

/** 3. Hammer taps → foundation → bricks laid row by row → roof → lights on → garden. */
export const SCENE_RUMAH = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd } = ctx;
  const ground = new THREE.Mesh(new THREE.CircleGeometry(9, 48), mat("#9fbf7a", { roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.2, 3.6), mat("#b9b2a6", { roughness: 0.9 })); scene.add(slab);
  /* Bricks: 4 walls, 10 rows, staggered, leaving a door & window. */
  const BW = 0.4, BH = 0.2, ROWS = 10, list = [];
  const hole = (side, u, r) => (side === 0 && Math.abs(u) < 0.45 && r < 6) || (side === 0 && Math.abs(Math.abs(u) - 1.25) < 0.32 && r >= 4 && r < 8) || ((side === 1 || side === 3) && Math.abs(u) < 0.35 && r >= 4 && r < 8);
  for (let r = 0; r < ROWS; r++) {
    for (let side = 0; side < 4; side++) {
      const len = side % 2 === 0 ? 4 : 3, n = Math.round(len / BW), off = r % 2 ? BW / 2 : 0;
      for (let i = 0; i < n; i++) {
        const u = -len / 2 + off + BW / 2 + i * BW; if (u > len / 2 - 0.05) continue;
        if (hole(side, u, r)) continue;
        let x, z, ry = 0;
        if (side === 0) { x = u; z = 1.5; } else if (side === 2) { x = -u; z = -1.5; } else if (side === 1) { x = 2; z = -u; ry = Math.PI / 2; } else { x = -2; z = u; ry = Math.PI / 2; }
        list.push({ x, y: 0.2 + BH / 2 + r * BH, z, ry, r, k: 0.85 + rnd() * 0.3, sp: rnd() * 6.28 });
      }
    }
  }
  list.sort((a, b) => a.r - b.r || a.sp - b.sp);
  const N = list.length;
  const bricks = new THREE.InstancedMesh(new THREE.BoxGeometry(BW * 0.96, BH * 0.9, 0.2), mat(COL.obj, { roughness: 0.85 }), N);
  const tint = new THREE.Color();
  list.forEach((b, i) => { tint.set(COL.obj).multiplyScalar(b.k); bricks.setColorAt(i, tint); });
  scene.add(bricks);
  const dm = new THREE.Object3D();
  /* Roof: two sloped planes + two gable triangles. */
  const roof = new THREE.Group(); scene.add(roof);
  const rmat = mat(COL.obj2, { roughness: 0.7, flatShading: true });
  [-1, 1].forEach((sx) => { const p = new THREE.Mesh(new THREE.BoxGeometry(2.55, 0.12, 3.6), rmat); p.position.set(sx * 1.08, 0.62, 0); p.rotation.z = -sx * 0.62; roof.add(p); });
  const tri = new THREE.Shape(); tri.moveTo(-2, 0); tri.lineTo(2, 0); tri.lineTo(0, 1.3); tri.closePath();
  [-1.5, 1.5].forEach((z) => { const m = new THREE.Mesh(new THREE.ShapeGeometry(tri), mat(COL.obj, { side: THREE.DoubleSide })); m.position.z = z; roof.add(m); });
  const chimney = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.8, 0.35), mat(COL.obj)); chimney.position.set(1.0, 1.0, -0.6); roof.add(chimney);
  roof.position.y = 2.2;
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.82, 1.2, 0.08), mat(COL.accent)); door.position.set(0, 0.8, 1.52); scene.add(door);
  const winMat = new THREE.MeshStandardMaterial({ color: "#2a2a35", emissive: "#ffc46b", emissiveIntensity: 0, roughness: 0.3 });
  const wins = [[-1.25, 1.5, 0], [1.25, 1.5, 0], [2.0, 0, Math.PI / 2], [-2.0, 0, -Math.PI / 2]].map((w) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.78), winMat); m.position.set(w[0], 1.2, w[1]); m.rotation.y = w[2]; scene.add(m); return m; });
  /* Stakes & string marking the plot (before the foundation). */
  const stakes = new THREE.Group(); scene.add(stakes);
  [[-2.3, -1.8], [2.3, -1.8], [2.3, 1.8], [-2.3, 1.8]].forEach((p) => { const k = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.02, 0.6, 6), mat("#c9a26b")); k.position.set(p[0], 0.3, p[1]); stakes.add(k); });
  const str = new THREE.Line(new THREE.BufferGeometry().setFromPoints([[-2.3, -1.8], [2.3, -1.8], [2.3, 1.8], [-2.3, 1.8], [-2.3, -1.8]].map((p) => new THREE.Vector3(p[0], 0.5, p[1]))), new THREE.LineBasicMaterial({ color: COL.accent })); stakes.add(str);
  const inside = new THREE.PointLight("#ffbe5c", 0, 8, 1.5); inside.position.set(0, 1.4, 2.3); scene.add(inside);
  /* Garden: round trees & paving stones. */
  const garden = [];
  const leaf = mat("#4f8f4a", { flatShading: true }), trunk = mat("#7a5233");
  [[-3.6, 1.6], [3.4, 1.9], [-3.1, -2.4], [3.8, -1.6], [-4.4, -0.4]].forEach((p, i) => {
    const t = new THREE.Group(); t.position.set(p[0], 0, p[1]);
    const tr = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.8, 6), trunk); tr.position.y = 0.4; t.add(tr);
    const cr = new THREE.Mesh(new THREE.IcosahedronGeometry(0.6 + (i % 2) * 0.2, 0), leaf); cr.position.y = 1.15; t.add(cr);
    scene.add(t); garden.push(t);
  });
  for (let i = 0; i < 6; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 7), mat("#d8d2c4")); s.position.set(Math.sin(i) * 0.15, 0.03, 2.0 + i * 0.5); scene.add(s); garden.push(s); }
  /* Hammer: handle + head, pivoting at the end of the handle. */
  const hammer = new THREE.Group(); scene.add(hammer);
  const swing = new THREE.Group(); hammer.add(swing);
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.5, 10), mat("#b5793f")); handle.position.y = 0.75; swing.add(handle);
  const headM = mat("#5d6470", { metalness: 0.7, roughness: 0.3 });
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.22), headM); head.position.y = 1.5; swing.add(head);
  const claw = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.3, 4), headM); claw.rotation.z = Math.PI / 2; claw.position.set(-0.38, 1.5, 0); swing.add(claw);
  const spark = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(new Array(30 * 3).fill(0), 3)), new THREE.PointsMaterial({ size: 0.12, map: glow(), color: "#ffb347", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(spark);
  const dirs = Array.from({ length: 30 }, () => [rnd() - 0.5, rnd() * 0.8 + 0.3, rnd() - 0.5]);
  return {
    update(S, t) {
      slab.position.y = lerp(-0.4, 0.1, S.found); slab.scale.set(lerp(0.2, 1, S.found), 1, lerp(0.2, 1, S.found));
      for (let i = 0; i < N; i++) {
        const b = list[i], a = (i / N) * 0.88, k = seg(S.build, a, a + 0.12);
        dm.position.set(b.x, b.y + (1 - k) * (1 - k) * 3.2, b.z);
        dm.rotation.set((1 - k) * Math.sin(b.sp) * 1.2, b.ry + (1 - k) * 2, 0);
        dm.scale.setScalar(k < 0.01 ? 0.0001 : 0.4 + 0.6 * k);
        dm.updateMatrix(); bricks.setMatrixAt(i, dm.matrix);
      }
      bricks.instanceMatrix.needsUpdate = true;
      roof.position.y = 2.2 + (1 - S.roof) * 4; roof.scale.setScalar(Math.max(0.001, S.roof)); roof.visible = S.roof > 0.01;
      door.scale.y = Math.max(0.001, S.roof); door.visible = S.roof > 0.01;
      winMat.emissiveIntensity = S.light * 2.2; inside.intensity = S.light * 8;
      wins.forEach((w) => { w.visible = S.build > 0.55; });
      stakes.visible = S.found < 0.6; stakes.scale.y = Math.max(0.001, 1 - S.found);
      garden.forEach((g, i) => { const k = seg(S.garden, i * 0.07, i * 0.07 + 0.35); g.scale.setScalar(Math.max(0.001, k)); g.visible = k > 0.01; });
      /* Hammer: rises with the wall height, tapping rhythmically while S.hammer > 0. */
      const top = 0.2 + S.build * 2.0;
      hammer.position.set(lerp(1.2, 3.2, S.rest), lerp(top, 0, S.rest), lerp(2.0, 2.6, S.rest));
      const beat = Math.abs(Math.sin(t * 3.4));
      swing.rotation.z = lerp(0.2, 1.15 * (1 - beat) - 0.1, S.hammer) + S.rest * 1.35;
      swing.rotation.y = -0.6;
      const hit = S.hammer > 0.3 && beat > 0.92 ? 1 : 0;
      const pa = spark.geometry.attributes.position, ph = (t * 3.4 / Math.PI) % 1;
      for (let i = 0; i < 30; i++) { const d = dirs[i]; pa.setXYZ(i, hammer.position.x - 0.9 + d[0] * ph * 1.5, hammer.position.y + d[1] * ph, hammer.position.z - 0.2 + d[2] * ph * 1.5); }
      pa.needsUpdate = true; spark.material.opacity = S.hammer * (1 - ph) * (1 - S.rest);
      scene.fog.color.set(COL.bg);
    },
  };
}`;

/** 4. Biji jatuh → tertanam → batang & cabang tumbuh → daun & buah → buah jatuh → hutan. */
export const SCENE_POHON = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, rnd } = ctx;
  const soil = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.4, 0.5, 40), mat("#6b4a32", { roughness: 1 })); soil.position.y = -0.25; scene.add(soil);
  const grass = new THREE.Mesh(new THREE.CircleGeometry(30, 48), mat("#9cc27a", { roughness: 1 })); grass.rotation.x = -Math.PI / 2; grass.position.y = -0.02; scene.add(grass);
  const seed = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat(COL.obj2, { roughness: 0.5 })); seed.scale.set(1, 1.5, 1); scene.add(seed);
  /* Sprout: two small leaves above the ground before the stem grows. */
  const sprout = new THREE.Group(); scene.add(sprout);
  const sm = mat("#7cc35a", { flatShading: true, side: THREE.DoubleSide });
  const sst = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.035, 0.45, 6), sm); sst.position.y = 0.22; sprout.add(sst);
  [-1, 1].forEach((sx) => { const l = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 6), sm); l.scale.set(1.4, 0.25, 0.7); l.position.set(sx * 0.17, 0.46, 0); l.rotation.z = sx * 0.5; sprout.add(l); });
  /* Recursive branches; each branch grows via drawRange (tube indices run from base to tip). */
  const bark = mat("#7b5a3c", { roughness: 0.9 });
  const branches = [], tips = [];
  function grow(start, dir, len, rad, level, t0) {
    const pts = [], d = dir.clone().normalize(), bend = new THREE.Vector3(rnd() - 0.5, 0.3, rnd() - 0.5).multiplyScalar(0.35 * len);
    for (let i = 0; i <= 4; i++) { const f = i / 4; pts.push(start.clone().addScaledVector(d, len * f).addScaledVector(bend, Math.sin(f * Math.PI) * 0.5)); }
    const curve = new THREE.CatmullRomCurve3(pts);
    const geo = new THREE.TubeGeometry(curve, 10, rad, 6, false);
    const m = new THREE.Mesh(geo, bark); scene.add(m);
    const dur = 0.22;
    branches.push({ m, t0, dur, count: geo.index.count });
    if (level >= 3) { tips.push({ p: curve.getPoint(1), t0: t0 + dur }); tips.push({ p: curve.getPoint(0.7), t0: t0 + dur * 0.8 }); return; }
    const kids = level === 0 ? 4 : 3;
    for (let k = 0; k < kids; k++) {
      const f = level === 0 ? 0.55 + k * 0.12 : 0.6 + rnd() * 0.3;
      const a = k / kids * Math.PI * 2 + rnd() * 0.8, up = level === 0 ? 0.9 : 0.7;
      const nd = new THREE.Vector3(Math.cos(a), up + rnd() * 0.4, Math.sin(a)).normalize();
      grow(curve.getPoint(f), nd, len * (0.62 + rnd() * 0.1), rad * 0.58, level + 1, t0 + dur * f);
    }
  }
  grow(new THREE.Vector3(0, -0.05, 0), new THREE.Vector3(0, 1, 0), 2.4, 0.17, 0, 0);
  /* Daun & buah (instanced). */
  const LEAF = tips.length * 4;
  const leaves = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.32, 0), mat("#ffffff", { flatShading: true, roughness: 0.8 }), LEAF);
  const leafData = [], c1 = new THREE.Color("#4e9a4f"), c2 = new THREE.Color("#8cc657"), c3 = new THREE.Color(COL.accent2), cc = new THREE.Color();
  for (let i = 0; i < LEAF; i++) { const tp = tips[i % tips.length]; leafData.push({ p: tp.p.clone().add(new THREE.Vector3(rnd() - 0.5, rnd() - 0.3, rnd() - 0.5).multiplyScalar(0.8)), d: rnd() * 0.5, s: 0.7 + rnd() * 0.6, mix: rnd(), r: rnd() * 6 }); }
  scene.add(leaves);
  const FR = 14, fruits = new THREE.InstancedMesh(new THREE.SphereGeometry(0.13, 12, 10), mat(COL.accent, { roughness: 0.35 }), FR), fruitData = [];
  for (let i = 0; i < FR; i++) { const tp = tips[(i * 7) % tips.length]; fruitData.push({ p: tp.p.clone().add(new THREE.Vector3(0, -0.25, 0)), d: rnd() * 0.5 }); }
  scene.add(fruits);
  /* Forest: small trees growing from fallen fruit. */
  const FN = 46, forest = new THREE.Group(); scene.add(forest);
  const cone = new THREE.InstancedMesh(new THREE.ConeGeometry(0.55, 1.6, 7), mat("#3f7d47", { flatShading: true }), FN);
  const stem = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.07, 0.1, 0.5, 5), bark, FN);
  const fdata = []; for (let i = 0; i < FN; i++) { const a = rnd() * 6.28, r = 4 + rnd() * 12; fdata.push({ x: Math.cos(a) * r, z: Math.sin(a) * r, s: 0.6 + rnd() * 1.1, d: (r - 4) / 12 * 0.7 }); }
  forest.add(cone, stem);
  const dm = new THREE.Object3D();
  const drop = { y: 0 };
  return {
    update(S, t) {
      /* Seed: floats → falls → enters the ground. */
      const fall = seg(S.drop, 0, 1);
      seed.position.set(0, lerp(3.2 + Math.sin(t * 1.4) * 0.15, 0.12, fall * fall) - S.plant * 0.3, 0);
      seed.rotation.set(t * 0.8 * (1 - fall), t * 0.6 * (1 - fall), 0);
      seed.visible = S.plant < 0.98;
      const sk = seg(S.plant, 0.4, 1) * (1 - seg(S.grow, 0.05, 0.2)); sprout.scale.setScalar(Math.max(0.001, sk)); sprout.visible = sk > 0.01; sprout.rotation.y = t * 0.3;
      branches.forEach((b) => { const k = seg(S.grow, b.t0, b.t0 + b.dur); b.m.visible = k > 0.001; const segs = Math.max(1, Math.ceil(k * 10)); b.m.geometry.setDrawRange(0, Math.min(b.count, segs * 6 * 6)); });
      leafData.forEach((l, i) => {
        const k = seg(S.leaf, l.d, l.d + 0.5), au = S.autumn;
        dm.position.copy(l.p); dm.position.y += Math.sin(t * 1.2 + l.r) * 0.03;
        dm.rotation.set(l.r, l.r * 2, 0); dm.scale.set(l.s * k + 0.0001, l.s * 0.7 * k + 0.0001, l.s * k + 0.0001);
        dm.updateMatrix(); leaves.setMatrixAt(i, dm.matrix);
        cc.copy(c1).lerp(c2, l.mix).lerp(c3, au * l.mix); leaves.setColorAt(i, cc);
      });
      leaves.instanceMatrix.needsUpdate = true; if (leaves.instanceColor) leaves.instanceColor.needsUpdate = true;
      fruitData.forEach((f, i) => {
        const k = seg(S.fruit, f.d, f.d + 0.4);
        dm.position.copy(f.p); dm.rotation.set(0, 0, 0);
        if (i === 0) dm.position.y = lerp(f.p.y, 0.1, seg(S.harvest, 0, 0.6) * seg(S.harvest, 0, 0.6));
        dm.scale.setScalar(k + 0.0001); dm.updateMatrix(); fruits.setMatrixAt(i, dm.matrix);
      });
      fruits.instanceMatrix.needsUpdate = true;
      fdata.forEach((f, i) => {
        const k = seg(S.forest, f.d, f.d + 0.3), s = f.s * k + 0.0001;
        dm.position.set(f.x, 0.25 * s, f.z); dm.rotation.set(0, 0, Math.sin(t + i) * 0.02); dm.scale.setScalar(s); dm.updateMatrix(); stem.setMatrixAt(i, dm.matrix);
        dm.position.y = 1.2 * s; dm.updateMatrix(); cone.setMatrixAt(i, dm.matrix);
      });
      cone.instanceMatrix.needsUpdate = true; stem.instanceMatrix.needsUpdate = true;
    },
  };
}`;

/** 5. Steam from a cup → a drop of coffee falls → ripples → the camera dives into the surface → mountain slopes & a farm → the coffee's origin point. */
export const SCENE_KOPI = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, mat, seg, lerp, glow, paint, rnd } = ctx;
  const cupG = new THREE.Group(); scene.add(cupG);
  const prof = [[0, 0], [0.62, 0], [0.7, 0.08], [0.82, 0.5], [0.9, 1.0], [0.92, 1.12], [0.86, 1.12], [0.78, 0.55], [0.6, 0.12], [0, 0.12]].map((p) => new THREE.Vector2(p[0], p[1]));
  const cupM = mat(COL.obj2, { roughness: 0.25, side: THREE.DoubleSide });
  cupG.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), cupM));
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.07, 10, 24, Math.PI * 1.2), cupM); handle.position.set(0.95, 0.62, 0); handle.rotation.z = -Math.PI * 0.6; cupG.add(handle);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.2, 0.08, 48), cupM); saucer.position.y = -0.04; cupG.add(saucer);
  /* Coffee surface: a high-segment ring, vertices raised by the ripples. */
  const surfG = new THREE.RingGeometry(0.001, 0.8, 64, 18);
  const surf = new THREE.Mesh(surfG, mat(COL.obj, { roughness: 0.15, metalness: 0.1 })); surf.rotation.x = -Math.PI / 2; surf.position.y = 0.9; cupG.add(surf);
  const sp = surfG.attributes.position, base = sp.array.slice();
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), mat(COL.obj, { roughness: 0.1 })); drop.scale.set(1, 1.5, 1); cupG.add(drop);
  /* Steam: pale light dots rising in a swirl. */
  const SN = 70, st = new Float32Array(SN * 3), sd = [];
  for (let i = 0; i < SN; i++) sd.push([rnd() * 6.28, rnd(), 0.2 + rnd() * 0.4]);
  const steam = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(st, 3)), new THREE.PointsMaterial({ size: 0.45, map: glow(), color: "#ffffff", transparent: true, opacity: 0.18, depthWrite: false }));
  cupG.add(steam);
  /* Mountain slope below the surface (discovered after the dive). */
  const land = new THREE.Group(); land.position.y = -8; scene.add(land);
  const TG = new THREE.PlaneGeometry(28, 28, 110, 110); TG.rotateX(-Math.PI / 2);
  const tp = TG.attributes.position, H = new Float32Array(tp.count), cols = new Float32Array(tp.count * 3);
  const peaks = [[-6, -4, 4.2], [5, -6, 3.6], [-2, 6, 3.0], [7, 4, 2.6]];
  const lo = new THREE.Color("#4f7a3a"), mid = new THREE.Color("#2f5a2c"), hi = new THREE.Color("#6d5a4a"), c = new THREE.Color();
  for (let i = 0; i < tp.count; i++) {
    const x = tp.getX(i), z = tp.getZ(i); let h = 0;
    peaks.forEach((p) => { const d = Math.hypot(x - p[0], z - p[1]); h += p[2] * 1.3 * Math.exp(-(d * d) / 18); });
    h += 0.5 + Math.sin(x * 0.55) * Math.cos(z * 0.5) * 0.45 + Math.sin(x * 1.7 + z * 1.3) * 0.12;
    const rows = 0.5 + 0.5 * Math.sin((x + z) * 4.5);
    H[i] = h; tp.setY(i, h);
    c.copy(lo).lerp(mid, rows * 0.6).lerp(hi, Math.min(1, Math.max(0, (h - 2.6) / 1.5)));
    cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
  }
  TG.setAttribute("color", new THREE.BufferAttribute(cols, 3));
  const terrain = new THREE.Mesh(TG, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, flatShading: true }));
  land.add(terrain);
  TG.computeVertexNormals();
  /* Penanda asal kopi (label kanvas) + jalur putus-putus. */
  const names = CONFIG.asal || [];
  const pins = names.slice(0, 4).map((n, i) => {
    const p = peaks[i % peaks.length], lab = paint(512, 160, (g, W, Hh) => { g.fillStyle = "rgba(20,12,8,.86)"; g.beginPath(); g.roundRect(6, 6, W - 12, Hh - 40, 24); g.fill(); g.beginPath(); g.moveTo(W / 2 - 18, Hh - 34); g.lineTo(W / 2, Hh - 6); g.lineTo(W / 2 + 18, Hh - 34); g.fill(); g.fillStyle = COL.accent; g.font = "700 52px system-ui, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(n, W / 2, (Hh - 34) / 2 + 4); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lab.tex, transparent: true, depthTest: false, fog: false }));
    s.position.set(p[0], p[2] * 1.3 + 1.8, p[1]); s.scale.set(3.2, 1, 1); land.add(s); return s;
  });
  const routePts = peaks.map((p) => new THREE.Vector3(p[0], p[2] * 1.3 + 0.9, p[1]));
  const rc = new THREE.CatmullRomCurve3(routePts).getPoints(120);
  const route = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rc), new THREE.LineDashedMaterial({ color: COL.accent, dashSize: 0.3, gapSize: 0.2 }));
  route.computeLineDistances(); land.add(route);
  return {
    update(S, t) {
      const f = seg(S.drop, 0, 0.55);
      drop.position.set(0, lerp(3.2, 0.9, f * f), 0); drop.visible = S.drop < 0.56;
      const r = seg(S.drop, 0.5, 1);
      const amp = r * 0.05 * (1 - S.dive * 0.7);
      for (let i = 0; i < sp.count; i++) {
        const x = base[i * 3], y = base[i * 3 + 1], d = Math.hypot(x, y);
        sp.setZ(i, amp * Math.sin(d * 26 - t * 6) * Math.exp(-d * 1.6) + (1 - r) * 0);
      }
      sp.needsUpdate = true; surfG.computeVertexNormals();
      for (let i = 0; i < SN; i++) { const d = sd[i], k = (t * 0.18 * d[2] + d[1]) % 1; st[i * 3] = Math.cos(d[0] + k * 4) * 0.3 * k; st[i * 3 + 1] = 1.0 + k * 2.2; st[i * 3 + 2] = Math.sin(d[0] + k * 4) * 0.3 * k; }
      steam.geometry.attributes.position.needsUpdate = true; steam.material.opacity = 0.2 * (1 - S.dive);
      cupG.visible = S.land < 0.4;
      land.visible = S.land > 0.01;
      terrain.scale.y = Math.max(0.01, S.land);
      pins.forEach((p, i) => { const k = seg(S.pins, i * 0.2, i * 0.2 + 0.3); p.material.opacity = k; p.position.y = (peaks[i][2] * 1.3 + 0.5) * S.land + 1.4 + (1 - k) * 0.8; });
      route.geometry.setDrawRange(0, Math.floor(rc.length * S.route));
      scene.fog.near = lerp(18, 30, S.land); scene.fog.far = lerp(60, 90, S.land);
    },
  };
}`;

/** 6. Key floats → enters the keyhole → turns → padlock opens → a hexagon shield spreads. */
export const SCENE_GEMBOK = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd } = ctx;
  const lock = new THREE.Group(); scene.add(lock);
  const sh = new THREE.Shape(), w = 1.0, h = 0.8, r = 0.22;
  sh.moveTo(-w + r, -h); sh.lineTo(w - r, -h); sh.quadraticCurveTo(w, -h, w, -h + r); sh.lineTo(w, h - r); sh.quadraticCurveTo(w, h, w - r, h); sh.lineTo(-w + r, h); sh.quadraticCurveTo(-w, h, -w, h - r); sh.lineTo(-w, -h + r); sh.quadraticCurveTo(-w, -h, -w + r, -h);
  const metal = mat(COL.obj, { metalness: 0.35, roughness: 0.32 });
  const body = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.6, bevelEnabled: true, bevelSize: 0.06, bevelThickness: 0.06, bevelSegments: 3, curveSegments: 8 }), metal); body.position.z = -0.3; lock.add(body);
  const kh = new THREE.Shape(); kh.absarc(0, 0.12, 0.13, 0, Math.PI * 2, false);
  const hole = new THREE.Mesh(new THREE.ShapeGeometry(kh, 16), new THREE.MeshBasicMaterial({ color: "#05070c" })); hole.position.z = 0.37; lock.add(hole);
  const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.32), new THREE.MeshBasicMaterial({ color: "#05070c" })); slot.position.set(0, -0.08, 0.37); lock.add(slot);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 32), mat(COL.accent, { metalness: 0.6, roughness: 0.3, emissive: COL.accent, emissiveIntensity: 0.4 })); ring.position.set(0, 0.06, 0.38); lock.add(ring);
  /* Shackle: half torus + two legs; pivots on the left leg. */
  const shackle = new THREE.Group(); shackle.position.set(-0.6, 0, 0); lock.add(shackle);
  const sm = mat("#d5d9e2", { metalness: 0.4, roughness: 0.22 });
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.12, 12, 32, Math.PI), sm); arc.position.set(0.6, 1.5, 0); shackle.add(arc);
  [0, 1.2].forEach((x, i) => { const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, i ? 0.9 : 0.9, 12), sm); leg.position.set(x, 1.05, 0); shackle.add(leg); });
  /* Key: ring head, shaft, teeth. */
  const key = new THREE.Group(); scene.add(key);
  const km = mat(COL.accent, { metalness: 0.45, roughness: 0.3 });
  const bow = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.08, 10, 28), km); bow.position.z = 1.45; key.add(bow);
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.2, 10), km); shaft.rotation.x = Math.PI / 2; shaft.position.z = 0.6; key.add(shaft);
  [[0.0, 0.1], [0.22, 0.06], [0.38, 0.12]].forEach((tth) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.06, tth[1] + 0.06, 0.1), km); b.position.set(0, -0.08 - tth[1] / 2, 0.05 + tth[0]); key.add(b); });
  /* Shield: a hexagon grid that lights up from the center. */
  const hexes = [], R = 0.5;
  for (let q = -6; q <= 6; q++) for (let rr = -6; rr <= 6; rr++) { const s = -q - rr; if (Math.max(Math.abs(q), Math.abs(rr), Math.abs(s)) > 6) continue; const x = R * 1.5 * q * 1.04, y = R * Math.sqrt(3) * (rr + q / 2) * 1.04; hexes.push({ x, y, d: Math.hypot(x, y) }); }
  const HN = hexes.length;
  const hexGeo = new THREE.CylinderGeometry(R * 0.9, R * 0.9, 0.08, 6); hexGeo.rotateY(Math.PI / 6); hexGeo.rotateX(Math.PI / 2);
  const hexMesh = new THREE.InstancedMesh(hexGeo, new THREE.MeshStandardMaterial({ color: COL.obj2, emissive: COL.accent2, emissiveIntensity: 0.15, metalness: 0.3, roughness: 0.5, transparent: true, opacity: 0.6 }), HN);
  scene.add(hexMesh);
  const scan = new THREE.Mesh(new THREE.RingGeometry(0.1, 0.18, 64), new THREE.MeshBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.8, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false })); scan.position.z = -1.45; scene.add(scan);
  const flash = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: COL.accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); flash.position.set(0, 0.1, 0.5); scene.add(flash);
  const dm = new THREE.Object3D(), maxD = Math.max(...hexes.map((h) => h.d));
  return {
    update(S, t) {
      const ins = seg(S.insert, 0, 1), turn = seg(S.turn, 0, 1);
      key.position.set(lerp(1.9, 0, ins), lerp(0.9 + Math.sin(t * 1.3) * 0.12, 0.08, ins), lerp(2.2, 0.32, ins));
      key.rotation.set(lerp(0.4, 0, ins), lerp(-0.9 + Math.sin(t * 0.6) * 0.3, 0, ins), lerp(t * 0.4 % 6.283 * (1 - ins), 0, ins) + turn * Math.PI / 2);
      key.visible = S.away < 0.98;
      if (S.away > 0) key.position.z += S.away * 6;
      const up = seg(S.open, 0, 0.5), swing = seg(S.open, 0.5, 1);
      shackle.position.y = up * 0.55; shackle.rotation.y = swing * 1.2;
      lock.rotation.y = Math.sin(t * 0.5) * 0.15 * (1 - ins);
      flash.material.opacity = Math.max(0, 1 - Math.abs(S.open - 0.25) * 4) * 0.9; flash.scale.setScalar(2.5);
      hexes.forEach((hx, i) => {
        const k = seg(S.shield, (hx.d / maxD) * 0.7, (hx.d / maxD) * 0.7 + 0.3);
        dm.position.set(hx.x, hx.y, -1.5 - (1 - k) * 2); dm.rotation.set(0, 0, 0); dm.scale.setScalar(k + 0.0001); dm.updateMatrix(); hexMesh.setMatrixAt(i, dm.matrix);
      });
      hexMesh.instanceMatrix.needsUpdate = true;
      hexMesh.material.emissiveIntensity = 0.1 + 0.25 * S.shield * (0.5 + 0.5 * Math.sin(t * 2));
      const sc = ((t * 0.35) % 1) * 7 * S.shield; scan.scale.setScalar(Math.max(0.001, sc * 4)); scan.material.opacity = (1 - ((t * 0.35) % 1)) * S.shield;
    },
  };
}`;
