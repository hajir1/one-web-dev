/* ================================================================== */
/* Scroll-story 3D scenes (v29), part F: yarn → sweater, raindrop →      */
/* rice terraces, paper → crane flock, plucked string → stage, candle → */
/* lit shelves, swell → surf barrel, dough → pizza slice, dish → globe. */
/* Every scene is procedural (no external models or textures) and reads */
/* its story values from S, so scrolling back plays it in reverse.      */
/* ================================================================== */

/** 1. Ball of yarn unwinds → the thread draws a sweater outline → knit fills in → the sweater sways. */
export const SCENE_RAJUT = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, paint } = ctx;
  /* Yarn ball: many thin great circles at random tilts. */
  const ball = new THREE.Group(); scene.add(ball);
  const ring = new THREE.TorusGeometry(0.9, 0.035, 6, 64), yarnM = mat(COL.accent, { roughness: 0.9 });
  for (let i = 0; i < 26; i++) { const m = new THREE.Mesh(ring, yarnM); m.rotation.set(i * 1.7, i * 0.9, i * 0.37); ball.add(m); }
  ball.add(new THREE.Mesh(new THREE.SphereGeometry(0.86, 24, 16), yarnM));
  ball.position.set(-2.6, 0.9, 0.6);
  /* Sweater outline traced by the thread, starting at the ball. */
  const P = [[-2.6, 0.9], [-1.4, 0.2], [-1.15, -1.6], [1.15, -1.6], [1.15, 0.9], [2.1, 0.2], [2.6, 0.75], [1.4, 1.9], [0.45, 2.05], [0, 1.7], [-0.45, 2.05], [-1.4, 1.9], [-2.6, 0.75], [-2.1, 0.2], [-1.15, 0.9], [-1.15, -1.6]];
  const curve = new THREE.CatmullRomCurve3(P.map((p) => new THREE.Vector3(p[0], p[1], 0)), false, "catmullrom", 0.1);
  const SEGS = 420, RAD = 6;
  const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, SEGS, 0.04, RAD), yarnM); scene.add(tube);
  /* Knit body: canvas texture of V stitches, revealed from the hem up. */
  const knitTex = paint(256, 256, (g, W, H) => { g.fillStyle = COL.accent; g.fillRect(0, 0, W, H); g.strokeStyle = "rgba(0,0,0,.22)"; g.lineWidth = 5; for (let y = 0; y < H; y += 22) for (let x = 0; x < W; x += 22) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 11, y + 16); g.lineTo(x + 22, y); g.stroke(); } });
  knitTex.tex.wrapS = knitTex.tex.wrapT = THREE.RepeatWrapping; knitTex.tex.repeat.set(4, 4);
  const shape = new THREE.Shape(); shape.moveTo(-1.15, -1.6); [[1.15, -1.6], [1.15, 0.9], [2.1, 0.2], [2.6, 0.75], [1.4, 1.9], [0.45, 2.05], [0, 1.7], [-0.45, 2.05], [-1.4, 1.9], [-2.6, 0.75], [-2.1, 0.2], [-1.15, 0.9]].forEach((p) => shape.lineTo(p[0], p[1]));
  const sg = new THREE.ShapeGeometry(shape); sg.computeBoundingBox();
  const uv = sg.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (sg.attributes.position.getX(i) + 3) / 6, (sg.attributes.position.getY(i) + 2) / 4);
  const knitM = new THREE.MeshStandardMaterial({ map: knitTex.tex, roughness: 0.95, side: THREE.DoubleSide, clippingPlanes: [new THREE.Plane(new THREE.Vector3(0, -1, 0), -1.6)] });
  ctx.renderer.localClippingEnabled = true;
  const body = new THREE.Mesh(sg, knitM); body.position.z = -0.02; scene.add(body);
  /* Needles crossing above the hem. */
  const ndl = mat(COL.obj2, { metalness: 0.4, roughness: 0.3 });
  const n1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 3.4, 8), ndl), n2 = n1.clone();
  n1.rotation.z = 0.5; n2.rotation.z = -0.5; const needles = new THREE.Group(); needles.add(n1, n2); needles.position.set(0, -2.2, 0.3); scene.add(needles);
  return {
    update(S, t) {
      ball.scale.setScalar(Math.max(0.05, 1 - S.unwind * 0.8)); ball.rotation.y = t * 0.3 + S.unwind * 9; ball.rotation.x = S.unwind * 4;
      tube.geometry.setDrawRange(0, Math.floor(seg(S.draw, 0, 1) * SEGS) * RAD * 6);
      knitM.clippingPlanes[0].constant = lerp(-1.6, 2.2, S.knit);
      needles.visible = S.knit > 0.02 && S.knit < 0.98; needles.position.y = lerp(-1.6, 2.1, S.knit); needles.rotation.z = Math.sin(t * 6) * 0.08;
      const w = S.wave; body.rotation.y = tube.rotation.y = Math.sin(t * 0.9) * 0.25 * w; body.rotation.z = tube.rotation.z = Math.sin(t * 1.3) * 0.05 * w;
      body.position.y = tube.position.y = Math.sin(t * 1.1) * 0.08 * w;
    },
  };
}`;

/** 2. A raindrop falls → ripples spread → terraces rise → rice grows and ripens → sacks appear. */
export const SCENE_SAWAH = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp } = ctx;
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), new THREE.MeshStandardMaterial({ color: "#9fd3ff", roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.85 }));
  drop.scale.set(1, 1.35, 1); scene.add(drop);
  const ripples = [0, 1, 2].map((i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(1, 0.02, 6, 72), new THREE.MeshBasicMaterial({ color: "#d6f0ff", transparent: true })); r.rotation.x = -Math.PI / 2; r.userData.k = i; scene.add(r); return r; });
  /* Terraces: arcs of stacked tiers, each with a water mirror on top. */
  const tiers = new THREE.Group(); scene.add(tiers);
  const soil = mat(COL.obj2, { roughness: 1 }), water = new THREE.MeshStandardMaterial({ color: "#8ec9e8", roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.7 });
  const RICE = [];
  for (let i = 0; i < 6; i++) {
    const R = 2 + i * 1.1, y = -i * 0.45;
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(R, R, 0.45, 48, 1, true, -1.3, 2.6), soil); wall.position.y = y - 0.22; tiers.add(wall);
    const top = new THREE.Mesh(new THREE.RingGeometry(R - 1.1, R, 48, 1, Math.PI / 2 - 1.3 + Math.PI, 2.6), water); top.rotation.x = -Math.PI / 2; top.position.y = y; tiers.add(top);
    for (let k = 0; k < 70; k++) { const a = -1.3 + (k / 70) * 2.6, r = R - 0.15 - (k % 4) * 0.25; RICE.push([Math.sin(a) * r, y, Math.cos(a) * r, k * 0.37 + i]); }
  }
  tiers.position.z = -1.2;
  const blade = new THREE.ConeGeometry(0.035, 0.6, 4); blade.translate(0, 0.3, 0);
  const riceM = mat("#5aa03c", { roughness: 0.8 });
  const rice = new THREE.InstancedMesh(blade, riceM, RICE.length); tiers.add(rice);
  const dm = new THREE.Object3D(), green = new THREE.Color("#5aa03c"), gold = new THREE.Color("#e6b84a");
  const sacks = []; for (let i = 0; i < 4; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), mat("#e8dcc0", { roughness: 1 })); s.scale.set(1, 1.25, 0.8); s.position.set(-2.4 + i * 0.95, 0.5, 2.4); scene.add(s); sacks.push(s); }
  return {
    update(S, t) {
      const d = S.drop;
      drop.position.set(0, lerp(5, 0.2, seg(d, 0, 0.7)), 0); drop.visible = d < 0.75;
      ripples.forEach((r) => { const k = seg(d, 0.65 + r.userData.k * 0.08, 1); r.scale.setScalar(0.1 + k * 4); r.material.opacity = (1 - k) * (k > 0 ? 1 : 0) * (1 - S.terrace); r.visible = k > 0 && S.terrace < 1; });
      tiers.scale.y = Math.max(0.001, S.terrace); tiers.position.y = lerp(-3, 0, S.terrace);
      riceM.color.copy(green).lerp(gold, S.ripe);
      for (let i = 0; i < RICE.length; i++) { const p = RICE[i], h = seg(S.grow, (i % 9) * 0.04, 0.6 + (i % 9) * 0.04); dm.position.set(p[0], p[1], p[2]); dm.rotation.set(Math.sin(t * 1.5 + p[3]) * 0.12 * S.grow, 0, Math.sin(t + p[3]) * 0.1 + S.ripe * 0.25); dm.scale.set(1, Math.max(0.001, h), 1); dm.updateMatrix(); rice.setMatrixAt(i, dm.matrix); }
      rice.instanceMatrix.needsUpdate = true;
      sacks.forEach((s, i) => { const k = seg(S.harvest, i * 0.15, 0.5 + i * 0.15); s.scale.set(k, k * 1.25, k * 0.8); s.visible = k > 0.01; });
    },
  };
}`;

/** 3. A square sheet folds into a crane → it takes off → a flock gathers → the flock forms a heart. */
export const SCENE_BANGAU = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp } = ctx;
  /* Crane triangles: [flat position in the square, folded position]. */
  const V = (x, y, z) => [x, y, z];
  const T = [
    [[V(-1, 0, -1), V(-0.5, 0, 0)], [V(1, 0, -1), V(0.5, 0, 0)], [V(0, 0, 0), V(0, 0.35, 0)]],
    [[V(-1, 0, 1), V(-0.5, 0, 0)], [V(1, 0, 1), V(0.5, 0, 0)], [V(0, 0, 0), V(0, -0.15, 0)]],
    [[V(-1, 0, -1), V(-0.5, 0, 0)], [V(-1, 0, 0), V(-1.5, 0.9, 0)], [V(0, 0, 0), V(-0.35, 0.1, 0)]],
    [[V(-1.2, 0, 0.2), V(-1.5, 0.9, 0)], [V(-1, 0, 1), V(-1.7, 0.8, 0)], [V(-0.8, 0, 0.3), V(-1.42, 0.85, 0)]],
    [[V(1, 0, -1), V(0.5, 0, 0)], [V(1, 0, 0), V(1.6, 0.7, 0)], [V(0, 0, 0), V(0.35, 0.1, 0)]],
    [[V(0, 0, -1), V(0, 0.1, 0)], [V(-0.6, 0, -0.2), V(-0.2, 0.1, -1.6)], [V(0.6, 0, -0.2), V(0.2, 0.1, -1.6)]],
    [[V(0, 0, 1), V(0, 0.1, 0)], [V(-0.6, 0, 0.2), V(-0.2, 0.1, 1.6)], [V(0.6, 0, 0.2), V(0.2, 0.1, 1.6)]],
  ];
  const pos = new Float32Array(T.length * 9), g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const paperM = mat(COL.obj, { side: THREE.DoubleSide, flatShading: true, roughness: 0.9 });
  const crane = new THREE.Mesh(g, paperM); scene.add(crane);
  function shape(k) {
    let o = 0;
    T.forEach((tri, i) => { const kk = seg(k, i * 0.07, 0.55 + i * 0.06); tri.forEach((p) => { const a = p[0], b = p[1], lift = Math.sin(kk * Math.PI) * 0.25; pos[o++] = lerp(a[0], b[0], kk); pos[o++] = lerp(a[1], b[1], kk) + lift; pos[o++] = lerp(a[2], b[2], kk); }); });
    g.attributes.position.needsUpdate = true; g.computeVertexNormals();
  }
  /* Flock: the folded crane as an instanced mesh, flying to points on a heart. */
  shape(1); const small = g.clone(); small.scale(0.32, 0.32, 0.32);
  const N = 72, flock = new THREE.InstancedMesh(small, mat(COL.accent, { side: THREE.DoubleSide, flatShading: true }), N); scene.add(flock);
  const start = [], heart = [], dm = new THREE.Object3D();
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, x = 16 * Math.pow(Math.sin(a), 3), y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
    heart.push(new THREE.Vector3(x * 0.2, y * 0.2 + 1.4, -2 + Math.sin(a * 3) * 0.3));
    start.push(new THREE.Vector3(Math.cos(a * 7) * 14, 6 + Math.sin(a * 5) * 4, -14 - (i % 6) * 2));
  }
  const tmp = new THREE.Vector3(); let last = -1;
  return {
    update(S, t) {
      if (Math.abs(S.fold - last) > 0.002) { last = S.fold; shape(S.fold); }
      crane.position.set(lerp(0, 2.5, S.lift), lerp(0, 2.2, S.lift) + Math.sin(t * 2) * 0.1 * S.lift, lerp(0, -1, S.lift));
      crane.rotation.set(0, lerp(0, -0.6, S.lift) + Math.sin(t * 0.5) * 0.1, lerp(0, 0.2, S.lift));
      const f = S.flock, h = S.heart;
      flock.visible = f > 0.01;
      for (let i = 0; i < N; i++) {
        const k = seg(f, (i % 12) * 0.03, 0.6 + (i % 12) * 0.03);
        tmp.copy(start[i]).lerp(heart[i], k);
        tmp.y += Math.sin(t * 2 + i) * 0.08;
        dm.position.copy(tmp); dm.rotation.set(Math.sin(t * 8 + i) * 0.25, Math.atan2(heart[i].x - start[i].x, heart[i].z - start[i].z) * (1 - k) + h * t * 0.4, 0);
        dm.scale.setScalar(Math.max(0.001, k)); dm.updateMatrix(); flock.setMatrixAt(i, dm.matrix);
      }
      flock.instanceMatrix.needsUpdate = true;
      flock.rotation.y = h * Math.sin(t * 0.4) * 0.3;
    },
  };
}`;

/** 4. A guitar string is plucked → its vibration becomes a waveform → an equalizer ring → stage lights sweep. */
export const SCENE_GITAR = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow } = ctx;
  const neck = new THREE.Group(); scene.add(neck);
  neck.add(new THREE.Mesh(new THREE.BoxGeometry(9, 0.12, 1.1), mat(COL.obj2, { roughness: 0.6 })));
  for (let i = 0; i < 14; i++) { const f = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 1.1), mat("#c9c9c9", { metalness: 0.9, roughness: 0.3 })); f.position.set(-4 + i * 0.6, 0.08, 0); neck.add(f); }
  const NP = 160, strings = [];
  for (let s = 0; s < 6; s++) {
    const arr = new Float32Array(NP * 3); for (let i = 0; i < NP; i++) { arr[i * 3] = -4.5 + (9 * i) / (NP - 1); arr[i * 3 + 1] = 0.16; arr[i * 3 + 2] = -0.4 + s * 0.16; }
    const l = new THREE.Line(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(arr, 3)), new THREE.LineBasicMaterial({ color: s === 3 ? COL.accent : "#e8e2d4" }));
    neck.add(l); strings.push(arr);
  }
  /* Waveform ribbon flying out of the plucked string. */
  const WN = 300, wv = new Float32Array(WN * 3);
  const wave = new THREE.Line(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(wv, 3)), new THREE.LineBasicMaterial({ color: COL.accent, transparent: true })); scene.add(wave);
  /* Equalizer ring. */
  const bars = [], BG = new THREE.BoxGeometry(0.16, 1, 0.16); BG.translate(0, 0.5, 0);
  for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2, b = new THREE.Mesh(BG, mat(i % 2 ? COL.accent : COL.accent2, { emissive: i % 2 ? COL.accent : COL.accent2, emissiveIntensity: 0.4 })); b.position.set(Math.cos(a) * 3.2, -1.2, Math.sin(a) * 3.2); scene.add(b); bars.push(b); }
  /* Stage lights: additive cones from above. */
  const beams = [0, 1, 2, 3].map((i) => { const c = new THREE.Mesh(new THREE.ConeGeometry(1.4, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: i % 2 ? COL.accent : COL.accent2, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); c.geometry.translate(0, -4.5, 0); c.position.set(-4.5 + i * 3, 7, -3); scene.add(c); return c; });
  const spot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: COL.accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); spot.scale.setScalar(5); spot.position.set(0, 0.5, -3); scene.add(spot);
  return {
    update(S, t) {
      strings.forEach((arr, s) => { const amp = s === 3 ? S.pluck * 0.18 : S.pluck * 0.02; for (let i = 0; i < NP; i++) arr[i * 3 + 1] = 0.16 + Math.sin((i / (NP - 1)) * Math.PI) * Math.sin(t * 38 + s) * amp; });
      neck.children.forEach((c) => { if (c.isLine) c.geometry.attributes.position.needsUpdate = true; });
      neck.position.y = lerp(0, -2.4, S.wave); neck.rotation.x = lerp(0, 0.5, S.wave);
      const w = S.wave; wave.visible = w > 0.01; wave.material.opacity = Math.min(1, w * 2) * (1 - S.stage * 0.6);
      for (let i = 0; i < WN; i++) { const x = i / (WN - 1); wv[i * 3] = lerp(-4.5, 4.5, x); wv[i * 3 + 1] = Math.sin(x * 40 - t * 6) * Math.sin(x * Math.PI) * 1.2 * w + 0.4 * w; wv[i * 3 + 2] = lerp(0, -4, x * w); }
      wave.geometry.attributes.position.needsUpdate = true;
      bars.forEach((b, i) => { const h = 0.2 + Math.abs(Math.sin(t * 3 + i * 0.6) * Math.cos(t * 1.7 + i * 0.3)) * 2.6; b.scale.set(1, Math.max(0.001, h * S.bars), 1); b.visible = S.bars > 0.01; });
      beams.forEach((c, i) => { c.material.opacity = 0.16 * S.stage; c.rotation.z = Math.sin(t * 0.8 + i * 1.3) * 0.5; c.rotation.x = Math.cos(t * 0.6 + i) * 0.25; });
      spot.material.opacity = 0.5 * S.stage;
    },
  };
}`;

/** 5. A candle in the dark → the flame catches → its light reveals shelves of jars → wax melts and scent curls up. */
export const SCENE_LILIN = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, hemi, key, rim } = ctx;
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 1.6, 40), mat(COL.obj, { roughness: 0.7 })); candle.geometry.translate(0, 0.8, 0); scene.add(candle);
  const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.66, 0.6, 1.9, 40, 1, true), new THREE.MeshStandardMaterial({ color: "#dfe8e4", transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false })); jar.position.y = 0.95; scene.add(jar);
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 6), mat("#2a2018")); scene.add(wick);
  const flameM = new THREE.MeshBasicMaterial({ color: "#ffd38a", transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), flameM); flame.scale.set(1, 2.4, 1); scene.add(flame);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ffb35c", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(halo);
  const lamp = new THREE.PointLight("#ffb35c", 0, 16, 1.4); scene.add(lamp);
  /* Shelves of jars behind. */
  const shelf = mat(COL.obj2, { roughness: 0.8 }), shelves = new THREE.Group(); scene.add(shelves);
  const jarCols = [COL.accent, COL.accent2, "#e7d3b0", "#b9c9a8"];
  for (let r = 0; r < 3; r++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(9, 0.1, 1), shelf); b.position.set(0, -0.2 + r * 1.5, -3); shelves.add(b);
    for (let i = 0; i < 9; i++) { const j = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.7, 20), mat(jarCols[(i + r) % 4], { roughness: 0.4 })); j.position.set(-4 + i, 0.2 + r * 1.5, -3); shelves.add(j); }
  }
  const SN = 120, sp = new Float32Array(SN * 3), sd = Array.from({ length: SN }, (_, i) => [i / SN, i * 0.61]);
  const smoke = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(sp, 3)), new THREE.PointsMaterial({ size: 0.22, map: glow(), color: "#f4e6d4", transparent: true, depthWrite: false })); scene.add(smoke);
  const base = { h: hemi.intensity, k: key.intensity, r: rim.intensity };
  return {
    update(S, t) {
      const L = S.light, h = lerp(1.6, 0.7, S.melt);
      candle.scale.y = h / 1.6; const top = h;
      wick.position.y = top + 0.08; flame.position.y = top + 0.3; halo.position.y = top + 0.3; lamp.position.y = top + 0.4;
      const fl = 1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05;
      flame.scale.set(fl * L, 2.4 * fl * L + 0.001, fl * L); flame.visible = L > 0.02; flameM.opacity = L;
      halo.scale.setScalar(lerp(0.1, 3.4, L) * fl); halo.material.opacity = 0.8 * L;
      lamp.intensity = 14 * L * fl;
      hemi.intensity = base.h * lerp(0.08, 0.7, L); key.intensity = base.k * lerp(0.03, 0.5, L); rim.intensity = base.r * lerp(0.1, 1, L);
      shelves.position.y = lerp(-0.6, 0, S.light);
      smoke.visible = S.aroma > 0.01;
      for (let i = 0; i < SN; i++) { const k = (sd[i][0] + t * 0.08) % 1, y = top + 0.6 + k * 4.5; sp[i * 3] = Math.sin(k * 9 + sd[i][1] + t) * k * 0.8; sp[i * 3 + 1] = y; sp[i * 3 + 2] = Math.cos(k * 7 + sd[i][1]) * k * 0.5; }
      smoke.geometry.attributes.position.needsUpdate = true; smoke.material.opacity = 0.5 * S.aroma;
    },
  };
}`;

/** 6. A swell rises → it curls into a barrel → the camera surfs through the tube → out onto the beach. */
export const SCENE_OMBAK = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, rnd } = ctx;
  const sea = new THREE.Mesh(new THREE.PlaneGeometry(60, 60, 90, 90), new THREE.MeshStandardMaterial({ color: COL.obj, roughness: 0.25, metalness: 0.1, flatShading: true })); sea.rotation.x = -Math.PI / 2; scene.add(sea);
  const sp = sea.geometry.attributes.position, base = sp.array.slice();
  /* Barrel: a long open half-tube along z that unrolls as the wave curls. */
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 22, 48, 1, true, Math.PI * 0.15, Math.PI * 1.35), new THREE.MeshStandardMaterial({ color: COL.obj, roughness: 0.15, metalness: 0.15, side: THREE.DoubleSide, transparent: true, opacity: 0.88 }));
  barrel.rotation.x = Math.PI / 2; barrel.position.set(0, 2.2, -8); scene.add(barrel);
  const FN = 500, fp = new Float32Array(FN * 3);
  for (let i = 0; i < FN; i++) { const z = 3 - rnd() * 22, a = Math.PI * 0.15 + rnd() * 0.25; fp[i * 3] = Math.cos(a) * 2.45; fp[i * 3 + 1] = 2.2 + Math.sin(a) * 2.45; fp[i * 3 + 2] = z; }
  const foam = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(fp, 3)), new THREE.PointsMaterial({ size: 0.12, color: "#ffffff", transparent: true })); scene.add(foam);
  const board = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 1.6, 6, 16), mat(COL.accent)); board.scale.set(1, 1, 0.25); board.rotation.set(Math.PI / 2, 0, 0); scene.add(board);
  /* Beach: sand bar and two palms. */
  const beach = new THREE.Group(); scene.add(beach);
  const sand = new THREE.Mesh(new THREE.CylinderGeometry(9, 10, 0.6, 48), mat("#e9d2a1", { roughness: 1 })); sand.position.set(0, 0, -26); beach.add(sand);
  [-3, 3.5].forEach((x, i) => { const p = new THREE.Group(); const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.2, 4, 8), mat("#8a6a46")); trunk.position.y = 2; trunk.rotation.z = i ? -0.15 : 0.12; p.add(trunk); for (let k = 0; k < 6; k++) { const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.35, 2.4, 4), mat(COL.accent2)); leaf.position.set(0, 4, 0); leaf.rotation.set(1.2, (k / 6) * Math.PI * 2, 0); leaf.translateY(1); p.add(leaf); } p.position.set(x, 0.3, -26 + i); beach.add(p); });
  return {
    update(S, t) {
      const sw = S.swell;
      for (let i = 0; i < sp.count; i++) { const x = base[i * 3], y = base[i * 3 + 1]; const ridge = Math.exp(-Math.pow((x - 0) / 3, 2)) * sw * 2.4 * (1 - S.curl); sp.array[i * 3 + 2] = Math.sin(x * 0.4 + t) * 0.15 + Math.cos(y * 0.3 + t * 0.8) * 0.15 + ridge; }
      sp.needsUpdate = true; sea.geometry.computeVertexNormals();
      barrel.scale.set(Math.max(0.001, S.curl), 1, Math.max(0.001, S.curl)); barrel.visible = S.curl > 0.01; barrel.rotation.y = Math.sin(t * 0.5) * 0.02;
      foam.visible = S.curl > 0.05; foam.material.opacity = S.curl;
      const fa = foam.geometry.attributes.position; for (let i = 0; i < FN; i++) { fa.array[i * 3 + 2] += 0.03; if (fa.array[i * 3 + 2] > 3) fa.array[i * 3 + 2] -= 22; } fa.needsUpdate = true;
      board.position.set(Math.sin(t * 0.9) * 0.4, lerp(0.35, 0.8, S.curl) + Math.sin(t * 2) * 0.05 + sw * 0.6 * (1 - S.curl), lerp(1, -10, S.ride) + 1);
      board.rotation.y = Math.sin(t * 0.9) * 0.2;
      beach.position.y = lerp(-2, 0, S.beach); beach.visible = S.beach > 0.01;
    },
  };
}`;

/** 7. A dough ball is flattened and spun → sauce and toppings rain on → the oven bakes it → one slice lifts away. */
export const SCENE_PIZZA = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow } = ctx;
  const pizza = new THREE.Group(); scene.add(pizza);
  const doughM = mat("#f1dcae", { roughness: 0.9 });
  const ballG = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 24), doughM); pizza.add(ballG);
  /* Eight wedges: crust + sauce + cheese per wedge so one can lift out. */
  const wedges = [];
  for (let i = 0; i < 8; i++) {
    const w = new THREE.Group(), a0 = (i / 8) * Math.PI * 2, A = Math.PI / 4;
    const crust = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 0.22, 16, 1, false, a0, A), doughM); w.add(crust);
    const sauce = new THREE.Mesh(new THREE.CylinderGeometry(2.15, 2.15, 0.06, 16, 1, false, a0, A), mat("#c2381f", { roughness: 0.6 })); sauce.position.y = 0.13; w.add(sauce);
    const cheese = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 2.1, 0.05, 16, 1, false, a0, A), mat("#f6d26b", { roughness: 0.5 })); cheese.position.y = 0.17; w.add(cheese);
    w.userData = { a: a0 + A / 2, sauce, cheese, crust }; pizza.add(w); wedges.push(w);
  }
  /* Toppings rain from above onto fixed spots. */
  const tops = [], topG = [new THREE.CylinderGeometry(0.22, 0.22, 0.05, 20), new THREE.SphereGeometry(0.14, 10, 8)];
  for (let i = 0; i < 26; i++) { const a = i * 2.39996, r = 0.4 + (i % 7) * 0.26, m = new THREE.Mesh(topG[i % 3 === 0 ? 1 : 0], mat(i % 3 === 0 ? "#3f8a3a" : "#a8321e", { roughness: 0.6 })); if (i % 3 === 0) m.scale.set(1, 0.3, 1.6); m.userData = { x: Math.cos(a) * r, z: Math.sin(a) * r, w: Math.floor((((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)) / (Math.PI / 4)) }; wedges[m.userData.w].add(m); tops.push(m); }
  const oven = new THREE.Mesh(new THREE.SphereGeometry(5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat("#9c4a2e", { roughness: 0.95, side: THREE.BackSide })); oven.position.set(0, -0.2, -2); scene.add(oven);
  const fire = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ff8a3d", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); fire.position.set(0, 0.8, -5.5); fire.scale.setScalar(6); scene.add(fire);
  const fireL = new THREE.PointLight("#ff8a3d", 0, 14, 1.4); fireL.position.set(0, 1.5, -3); scene.add(fireL);
  const raw = new THREE.Color("#f1dcae"), baked = new THREE.Color("#c98a45"), meltC = new THREE.Color("#f6d26b"), brown = new THREE.Color("#e3a83f");
  const strands = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(12 * 6), 3)), new THREE.LineBasicMaterial({ color: "#f6d26b" })); scene.add(strands);
  return {
    update(S, t) {
      const f = S.flat, k = seg(f, 0.3, 1);
      ballG.scale.set(lerp(1, 2.4, k), lerp(1, 0.1, k), lerp(1, 2.4, k)); ballG.visible = k < 0.98;
      wedges.forEach((w) => (w.visible = k > 0.95));
      pizza.rotation.y = f * 6 + t * 0.4 * (1 - S.slice); pizza.position.y = Math.sin(t * 3) * 0.05 * f * (1 - S.bake);
      wedges.forEach((w) => { w.userData.sauce.scale.set(Math.max(0.001, S.sauce), 1, Math.max(0.001, S.sauce)); w.userData.cheese.scale.set(Math.max(0.001, S.sauce), 1, Math.max(0.001, S.sauce)); w.userData.cheese.material.color.copy(meltC).lerp(brown, S.bake * 0.6); w.userData.crust.material.color.copy(raw).lerp(baked, S.bake); });
      tops.forEach((m, i) => { const q = seg(S.top, (i % 9) * 0.06, 0.5 + (i % 9) * 0.06); m.position.set(m.userData.x, lerp(5, 0.22, q), m.userData.z); m.visible = q > 0.01; });
      oven.visible = fire.visible = S.bake > 0.01; oven.scale.setScalar(Math.max(0.001, S.bake)); fire.material.opacity = S.bake * (0.8 + Math.sin(t * 9) * 0.1); fireL.intensity = 10 * S.bake;
      const w0 = wedges[0], s = S.slice; const a = w0.userData.a;
      w0.position.set(Math.sin(a) * s * 1.6, s * 1.2, Math.cos(a) * s * 1.6); w0.rotation.x = -s * 0.25;
      const sa = strands.geometry.attributes.position; strands.visible = s > 0.05 && s < 0.98;
      for (let i = 0; i < 12; i++) { const r = 0.6 + i * 0.13, b = a + (i % 2 ? 0.25 : -0.25); const p0 = new THREE.Vector3(Math.sin(b) * r, 0.2, Math.cos(b) * r).applyEuler(pizza.rotation); const p1 = p0.clone().add(new THREE.Vector3(Math.sin(a) * s * 1.6, s * 1.2, Math.cos(a) * s * 1.6).applyEuler(pizza.rotation)); sa.setXYZ(i * 2, p0.x, p0.y + pizza.position.y, p0.z); sa.setXYZ(i * 2 + 1, p1.x, p1.y + pizza.position.y, p1.z); }
      sa.needsUpdate = true;
    },
  };
}`;

/** 8. A dish antenna tilts up → signal rings rise → a satellite orbits a globe → city lights connect with arcs. */
export const SCENE_SATELIT = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd } = ctx;
  const dishG = new THREE.Group(); scene.add(dishG);
  const prof = []; for (let i = 0; i <= 20; i++) { const r = (i / 20) * 1.4; prof.push(new THREE.Vector2(r, r * r * 0.28)); }
  const dish = new THREE.Mesh(new THREE.LatheGeometry(prof, 40), mat(COL.obj, { side: THREE.DoubleSide, metalness: 0.3, roughness: 0.4 }));
  const head = new THREE.Group(); head.add(dish); const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.1, 6), mat("#9aa0aa")); arm.position.y = 0.55; head.add(arm);
  const feed = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), mat(COL.accent)); feed.position.y = 1.1; head.add(feed);
  head.position.y = 1.4; dishG.add(head);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.4, 10), mat("#9aa0aa")); post.position.y = 0.7; dishG.add(post);
  dishG.position.set(-2.5, -2.2, 1);
  const rings = [0, 1, 2, 3, 4].map((i) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.03, 6, 48), new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); r.userData.k = i / 5; scene.add(r); return r; });
  /* Globe with latitude lines and city points. */
  const globe = new THREE.Group(); globe.position.set(1.5, 1.2, -4); scene.add(globe);
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(2.4, 48, 32), mat(COL.obj2, { roughness: 0.7 })));
  for (let i = 1; i < 6; i++) { const lat = new THREE.Mesh(new THREE.TorusGeometry(2.42 * Math.sin((i / 6) * Math.PI), 0.008, 4, 96), new THREE.MeshBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.5 })); lat.rotation.x = Math.PI / 2; lat.position.y = 2.42 * Math.cos((i / 6) * Math.PI); globe.add(lat); }
  const CN = 40, cities = [];
  for (let i = 0; i < CN; i++) { const u = rnd() * 0.9 - 0.45, a = rnd() * Math.PI * 2, r = 2.45; const s = Math.sqrt(1 - u * u); cities.push(new THREE.Vector3(Math.cos(a) * s * r, u * r, Math.sin(a) * s * r)); }
  const cp = new Float32Array(CN * 3); cities.forEach((c, i) => c.toArray(cp, i * 3));
  const cityPts = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(cp, 3)), new THREE.PointsMaterial({ size: 0.28, map: glow(), color: COL.accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); globe.add(cityPts);
  const arcs = [];
  for (let i = 0; i < 22; i++) { const a = cities[i], b = cities[(i * 7 + 3) % CN]; const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(2.45 + a.distanceTo(b) * 0.45); const pts = new THREE.QuadraticBezierCurve3(a, mid, b).getPoints(40); const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: COL.accent2, transparent: true })); globe.add(l); arcs.push(l); }
  const sat = new THREE.Group(); sat.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.45), mat("#d7dbe2", { metalness: 0.6, roughness: 0.3 }))); [-1, 1].forEach((s) => { const p = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.02, 0.36), mat("#2f5bd6", { metalness: 0.4 })); p.position.x = s * 0.62; sat.add(p); }); globe.add(sat);
  return {
    update(S, t) {
      head.rotation.z = lerp(-0.2, -0.9, S.aim); head.rotation.y = Math.sin(t * 0.3) * 0.1;
      const origin = new THREE.Vector3(0, 1.1, 0).applyEuler(head.rotation).add(head.position).add(dishG.position);
      const dir = new THREE.Vector3(0, 1, 0).applyEuler(head.rotation);
      rings.forEach((r) => { const k = (r.userData.k + t * 0.25) % 1; r.position.copy(origin).addScaledVector(dir, k * 6); r.lookAt(r.position.clone().add(dir)); r.scale.setScalar(0.4 + k * 2.4); r.material.opacity = (1 - k) * S.signal; r.visible = S.signal > 0.01; });
      globe.scale.setScalar(Math.max(0.001, S.globe)); globe.rotation.y = t * 0.12; globe.visible = S.globe > 0.01;
      const a = t * 0.6; sat.position.set(Math.cos(a) * 3.3, Math.sin(a * 0.5) * 0.8, Math.sin(a) * 3.3); sat.rotation.y = -a;
      cityPts.material.opacity = S.connect; cityPts.material.size = 0.28 + Math.sin(t * 3) * 0.04;
      arcs.forEach((l, i) => { const k = seg(S.connect, i * 0.03, 0.4 + i * 0.03); l.geometry.setDrawRange(0, Math.floor(k * 41)); l.material.opacity = 0.9; });
      dishG.position.y = lerp(-2.2, -3.4, S.connect);
    },
  };
}`;
