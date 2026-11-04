/* ================================================================== */
/* Scroll-story 3D scenes (v29), part G: wheel → bike ride, music box → */
/* starry sky, tea leaf → tea garden, needle → sewn dress, compass →    */
/* city pin, paper scraps → bound book, paint drop → gallery wall.      */
/* Every scene is procedural (no external models or textures) and reads */
/* its story values from S, so scrolling back plays it in reverse.      */
/* ================================================================== */

/** 9. A lone wheel rolls in → the bike frame assembles → a route draws over the hills → the bike rides it. */
export const SCENE_SEPEDA = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp } = ctx;
  const bike = new THREE.Group(); scene.add(bike);
  const tyre = mat("#1d1d1f", { roughness: 0.9 }), frameM = mat(COL.accent, { metalness: 0.4, roughness: 0.35 }), spokeM = mat("#c9ccd2", { metalness: 0.6 });
  const wheel = () => { const w = new THREE.Group(); w.add(new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.06, 10, 48), tyre)); for (let i = 0; i < 12; i++) { const s = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.2, 4), spokeM); s.rotation.z = (i / 12) * Math.PI; w.add(s); } return w; };
  const back = wheel(), front = wheel(); back.position.x = -1.05; front.position.x = 1.05; bike.add(back, front);
  /* Frame tubes: each one flies in from its own direction while S.bike grows. */
  const tube = (a, b) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b); const m = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, A.distanceTo(B), 8), frameM); m.position.copy(A).add(B).multiplyScalar(0.5); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); m.userData.home = m.position.clone(); bike.add(m); return m; };
  const parts = [tube([-1.05, 0, 0], [-0.1, 0, 0]), tube([-0.1, 0, 0], [-0.35, 0.95, 0]), tube([-0.35, 0.95, 0], [0.75, 0.9, 0]), tube([-0.1, 0, 0], [0.75, 0.9, 0]), tube([-1.05, 0, 0], [-0.35, 0.95, 0]), tube([0.75, 0.9, 0], [1.05, 0, 0]), tube([0.75, 0.9, 0], [0.65, 1.3, 0])];
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.07, 0.16), mat("#2b2b2b")); seat.position.set(-0.4, 1.05, 0); seat.userData.home = seat.position.clone(); bike.add(seat); parts.push(seat);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 8), frameM); bar.rotation.x = Math.PI / 2; bar.position.set(0.65, 1.3, 0); bar.userData.home = bar.position.clone(); bike.add(bar); parts.push(bar);
  parts.forEach((p, i) => { p.userData.from = new THREE.Vector3(Math.cos(i * 2.3) * 4, Math.sin(i * 1.7) * 3 + 1, Math.sin(i * 2.3) * 3); });
  /* Rolling hills and a dashed route over them. */
  const hills = new THREE.Mesh(new THREE.PlaneGeometry(40, 30, 80, 60), mat(COL.obj2, { roughness: 1, flatShading: true }));
  hills.rotation.x = -Math.PI / 2; const hp = hills.geometry.attributes.position;
  const H = (x, z) => Math.sin(x * 0.35) * 0.7 + Math.cos(z * 0.3 + x * 0.1) * 0.6;
  for (let i = 0; i < hp.count; i++) hp.setZ(i, H(hp.getX(i), -hp.getY(i)));
  hills.geometry.computeVertexNormals(); hills.position.y = -0.7; scene.add(hills);
  const route = new THREE.CatmullRomCurve3([[-4, 2], [-2, -2], [1, -5], [5, -6], [8, -10], [5, -14]].map((p) => new THREE.Vector3(p[0], H(p[0], p[1]) - 0.62, p[1])));
  const rp = route.getSpacedPoints(300);
  const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(rp), new THREE.LineDashedMaterial({ color: COL.accent, dashSize: 0.25, gapSize: 0.15 })); line.computeLineDistances(); scene.add(line);
  return {
    update(S, t) {
      const roll = S.roll;
      parts.forEach((p, i) => { const k = seg(S.bike, i * 0.06, 0.45 + i * 0.06); p.position.lerpVectors(p.userData.from, p.userData.home, k); p.visible = k > 0.02; });
      front.visible = S.bike > 0.05;
      const r = S.ride;
      if (r > 0) { const u = Math.min(0.999, r), p = route.getPointAt(u), d = route.getTangentAt(u); bike.position.set(p.x, p.y + 0.62, p.z); bike.rotation.set(0, Math.atan2(-d.z, d.x), 0); bike.scale.setScalar(lerp(1, 0.6, r)); }
      else { bike.position.set(lerp(-6, 0, roll), 0, 0); bike.rotation.set(0, 0, 0); bike.scale.setScalar(1); }
      const spin = -(roll * 9 + r * 40 + t * 0.2 * S.ride); back.rotation.z = front.rotation.z = spin;
      line.geometry.setDrawRange(0, Math.floor(seg(S.route, 0, 1) * rp.length));
      hills.visible = S.route > 0.01 || S.ride > 0; hills.material.opacity = 1;
    },
  };
}`;

/** 10. A music box lid opens → a little dancer rises and spins → notes float up → the room turns into a night sky. */
export const SCENE_KOTAKMUSIK = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd, paint, hemi, key } = ctx;
  const box = new THREE.Group(); scene.add(box);
  const wood = mat(COL.obj2, { roughness: 0.6 }), trim = mat(COL.accent, { metalness: 0.6, roughness: 0.3 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1, 1.6), wood); base.position.y = 0.5; box.add(base);
  const band = new THREE.Mesh(new THREE.BoxGeometry(2.46, 0.08, 1.66), trim); band.position.y = 0.95; box.add(band);
  const lidPivot = new THREE.Group(); lidPivot.position.set(0, 1, -0.8); box.add(lidPivot);
  const lid = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.2, 1.6), wood); lid.position.set(0, 0.1, 0.8); lidPivot.add(lid);
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 1.3), mat("#cfd8e6", { metalness: 0.9, roughness: 0.1 })); mirror.position.set(0, -0.01, 0.8); mirror.rotation.x = Math.PI / 2; lidPivot.add(mirror);
  /* Dancer: lathe body, cone skirt, sphere head. */
  const dancer = new THREE.Group(); box.add(dancer);
  const skirt = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.4, 24, 1, true), mat(COL.accent, { side: THREE.DoubleSide })); skirt.position.y = 0.45; dancer.add(skirt);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.4, 12), mat("#f1d7c8")); torso.position.y = 0.75; dancer.add(torso);
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), mat("#f1d7c8")); headM.position.y = 1.02; dancer.add(headM);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), mat("#f1d7c8")); armL.position.set(0, 0.95, 0); armL.rotation.z = 1.2; dancer.add(armL);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 0.45, 6), mat("#f1d7c8")); leg.position.y = 0.22; dancer.add(leg);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.06, 24), trim); dancer.add(plinth);
  /* Music notes drawn on a canvas, used as sprites. */
  const noteTex = paint(64, 64, (g) => { g.fillStyle = "#fff"; g.font = "bold 52px serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("♪", 32, 34); }).tex;
  const notes = []; for (let i = 0; i < 26; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: noteTex, color: i % 2 ? COL.accent : COL.accent2, transparent: true, depthWrite: false })); s.userData = { k: rnd(), a: rnd() * 6.28, r: 0.4 + rnd() * 1.6 }; s.scale.setScalar(0.35); scene.add(s); notes.push(s); }
  /* Star dome that fades in at the end. */
  const SN = 900, sp = new Float32Array(SN * 3); for (let i = 0; i < SN; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.28, r = 30, s = Math.sqrt(1 - u * u); sp.set([Math.cos(a) * s * r, Math.abs(u) * r - 2, Math.sin(a) * s * r], i * 3); }
  const stars = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(sp, 3)), new THREE.PointsMaterial({ size: 0.5, map: glow(), color: "#fff6dd", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); scene.add(stars);
  const hemi0 = hemi.intensity, key0 = key.intensity;
  return {
    update(S, t) {
      lidPivot.rotation.x = -lerp(0, 1.9, S.open);
      dancer.position.y = lerp(0.3, 1.05, S.rise); dancer.visible = S.rise > 0.01; dancer.rotation.y = t * 1.6 * (0.3 + S.rise);
      armL.rotation.z = 1.2 + Math.sin(t * 2) * 0.2;
      notes.forEach((n) => { const k = (n.userData.k + t * 0.12) % 1, a = n.userData.a + t * 0.4; n.position.set(Math.cos(a) * n.userData.r * (0.4 + k), 1.2 + k * 5, Math.sin(a) * n.userData.r * (0.4 + k)); n.material.opacity = S.notes * Math.sin(k * Math.PI); n.visible = S.notes > 0.01; });
      stars.material.opacity = S.sky; stars.rotation.y = t * 0.01; stars.visible = S.sky > 0.01;
      hemi.intensity = lerp(hemi0, hemi0 * 0.35, S.sky); key.intensity = lerp(key0, key0 * 0.5, S.sky);
    },
  };
}`;

/** 11. A tea leaf drifts into a glass cup → the water brews amber → steam ribbons rise → rows of a hillside tea garden appear. */
export const SCENE_TEH = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, rnd } = ctx;
  const cup = new THREE.Group(); scene.add(cup);
  const prof = [[0.0, 0], [0.75, 0], [0.82, 0.08], [0.95, 1.5], [0.97, 1.55]].map((p) => new THREE.Vector2(p[0], p[1]));
  cup.add(new THREE.Mesh(new THREE.LatheGeometry(prof, 48), new THREE.MeshPhysicalMaterial({ color: "#ffffff", transmission: 0.9, roughness: 0.05, thickness: 0.2, transparent: true, opacity: 0.35, side: THREE.DoubleSide })));
  const water = new THREE.Color("#d9eef5"), brew = new THREE.Color(COL.accent);
  const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.78, 1.2, 40), mat("#d9eef5", { transparent: true, opacity: 0.85, roughness: 0.1 })); liquid.position.y = 0.66; cup.add(liquid);
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.3, 0.08, 48), mat(COL.obj, { roughness: 0.4 })); saucer.position.y = -0.04; cup.add(saucer);
  /* Tea leaves: flattened spheres falling and swirling into the cup. */
  const leafG = new THREE.SphereGeometry(0.16, 10, 6); leafG.scale(1, 0.12, 0.5);
  const leaves = []; for (let i = 0; i < 9; i++) { const l = new THREE.Mesh(leafG, mat("#4e7d3a")); l.userData = { a: rnd() * 6.28, d: i * 0.06 }; scene.add(l); leaves.push(l); }
  /* Steam: wavy tubes that are redrawn every frame. */
  const steamM = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, depthWrite: false });
  const steam = [0, 1, 2].map((i) => { const m = new THREE.Mesh(new THREE.SphereGeometry(0.01, 4, 2), steamM); m.userData.i = i; scene.add(m); return m; });
  /* Tea garden: rounded bushes in curved rows climbing a slope. */
  const garden = new THREE.Group(); garden.position.set(0, -1.6, -6); scene.add(garden);
  const bushG = new THREE.SphereGeometry(0.42, 10, 8); bushG.scale(1.3, 0.7, 1);
  const N = 260, bushes = new THREE.InstancedMesh(bushG, mat("#3f7a3a", { roughness: 0.95, flatShading: true }), N); garden.add(bushes);
  const B = []; for (let i = 0; i < N; i++) { const row = Math.floor(i / 20), c = i % 20; B.push([(c - 10) * 0.9 + Math.sin(row) * 0.6, row * 0.55, -row * 1.1 + Math.sin(c * 0.6 + row) * 0.3]); }
  const slope = new THREE.Mesh(new THREE.PlaneGeometry(26, 20), mat("#7a5a3a", { roughness: 1 })); slope.rotation.x = -Math.PI / 2 + 0.46; slope.position.set(0, 2.8, -6); garden.add(slope);
  const dm = new THREE.Object3D();
  return {
    update(S, t) {
      leaves.forEach((l) => { const k = seg(S.drop, l.userData.d, 0.5 + l.userData.d), a = l.userData.a + k * 5 + t * 0.4 * S.brew; const r = lerp(1.4, 0.45, k); l.position.set(Math.cos(a) * r, lerp(4, 0.7 + Math.sin(a) * 0.15, k), Math.sin(a) * r); l.rotation.set(t + a, a, k * 3); });
      liquid.material.color.copy(water).lerp(brew, S.brew); liquid.material.opacity = lerp(0.5, 0.92, S.brew);
      steam.forEach((m) => { const pts = []; for (let j = 0; j <= 30; j++) { const y = j / 30; pts.push(new THREE.Vector3(Math.sin(y * 6 + t * 1.5 + m.userData.i * 2) * 0.25 * y + (m.userData.i - 1) * 0.35, 1.6 + y * 2.6, Math.cos(y * 5 + t + m.userData.i) * 0.15)); } m.geometry.dispose(); m.geometry = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.05, 5); });
      steamM.opacity = S.steam * 0.45; steam.forEach((m) => (m.visible = S.steam > 0.01));
      const g = S.garden; garden.visible = g > 0.01; slope.visible = g > 0.01;
      for (let i = 0; i < N; i++) { const p = B[i], k = seg(g, (i % 13) * 0.03, 0.5 + (i % 13) * 0.03); dm.position.set(p[0], p[1] + 0.25, p[2]); dm.scale.setScalar(Math.max(0.001, k)); dm.rotation.y = i; dm.updateMatrix(); bushes.setMatrixAt(i, dm.matrix); }
      bushes.instanceMatrix.needsUpdate = true;
      cup.position.y = lerp(0, -0.4, g);
    },
  };
}`;

/** 12. A needle pulls a thread through → stitches march along the seam of two panels → the panels close into a dress on a form. */
export const SCENE_JAHIT = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, paint } = ctx;
  const cloth = paint(256, 256, (g, W, H) => { g.fillStyle = COL.accent2; g.fillRect(0, 0, W, H); g.fillStyle = "rgba(255,255,255,.18)"; for (let y = 0; y < H; y += 32) for (let x = (y / 32) % 2 ? 16 : 0; x < W; x += 32) { g.beginPath(); g.arc(x, y, 5, 0, 6.28); g.fill(); } });
  const clothM = new THREE.MeshStandardMaterial({ map: cloth.tex, roughness: 0.9, side: THREE.DoubleSide });
  /* Dress: two half lathes that start flat and wrap around a form. */
  const prof = [[0.55, -1.6], [0.62, -1.0], [0.42, -0.1], [0.36, 0.2], [0.44, 0.7], [0.3, 0.95]].map((p) => new THREE.Vector2(p[0], p[1]));
  const halfA = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, 0, Math.PI), clothM), halfB = new THREE.Mesh(new THREE.LatheGeometry(prof, 32, Math.PI, Math.PI), clothM);
  const dress = new THREE.Group(); dress.add(halfA, halfB); dress.position.y = 0.3; scene.add(dress);
  const form = new THREE.Group(); scene.add(form);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), mat("#6b5a4a")); pole.position.y = -1.7; form.add(pole);
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.55, 0.08, 24), mat("#6b5a4a")); foot.position.y = -2.5; form.add(foot);
  const neck = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat(COL.obj, { roughness: 0.7 })); neck.position.y = 1.35; form.add(neck);
  /* Seam stitches along the side of the dress. */
  const SN = 30, stitches = [];
  for (let i = 0; i < SN; i++) { const y = lerp(0.95, -1.6, i / (SN - 1)), r = 0.5 + Math.sin(i) * 0; const s = new THREE.Mesh(new THREE.CapsuleGeometry(0.018, 0.06, 2, 6), mat(COL.accent)); s.position.set(0, y + 0.3, 0); s.rotation.z = 0.6; scene.add(s); stitches.push(s); }
  const radiusAt = (y) => { for (let i = 1; i < prof.length; i++) if (y >= prof[i - 1].y && y <= prof[i].y) { const k = (y - prof[i - 1].y) / (prof[i].y - prof[i - 1].y); return lerp(prof[i - 1].x, prof[i].x, k); } return 0.4; };
  /* Needle and the thread trailing behind it. */
  const needle = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.7, 8), mat("#d6d9de", { metalness: 0.9, roughness: 0.2 })); scene.add(needle);
  const thread = new THREE.Line(new THREE.BufferGeometry().setFromPoints(Array.from({ length: 14 }, () => new THREE.Vector3())), new THREE.LineBasicMaterial({ color: COL.accent }));
  scene.add(thread);
  return {
    update(S, t) {
      const sew = S.sew, open = 1 - sew;
      const flat = lerp(0.14, 1, sew); halfA.position.x = open * 1.4; halfB.position.x = -open * 1.4; halfA.scale.z = halfB.scale.z = flat;
      form.visible = sew > 0.02; form.scale.setScalar(Math.max(0.001, sew)); dress.rotation.y = sew * Math.sin(t * 0.5) * 0.4;
      const st = seg(S.stitch, 0, 1), n = Math.floor(st * SN);
      stitches.forEach((s, i) => { const y = s.position.y - 0.3, r = radiusAt(y) + 0.01; s.position.x = lerp(1.4, r, sew) * (sew > 0.5 ? Math.cos(dress.rotation.y) : 1); s.position.z = sew > 0.5 ? -Math.sin(dress.rotation.y) * r : 0; s.visible = i < n; });
      const tip = stitches[Math.min(SN - 1, n)].position;
      const th = S.thread; needle.visible = th > 0.01 && S.stitch < 0.99;
      needle.position.set(lerp(3.5, tip.x + 0.2, th), lerp(2.6, tip.y + Math.sin(t * 8) * 0.12, th), 0.3); needle.rotation.z = 2.3 + Math.sin(t * 8) * 0.2;
      const pts = [new THREE.Vector3(3.5, 3.2, 0)]; for (let i = 0; i <= 12; i++) { const k = i / 12; pts.push(new THREE.Vector3(lerp(3.5, needle.position.x, k), lerp(3.2, needle.position.y, k) - Math.sin(k * Math.PI) * 0.6, 0.3)); }
      thread.geometry.setFromPoints(pts); thread.visible = needle.visible;
    },
  };
}`;

/** 13. A compass needle spins and settles → a paper map unfolds → city blocks rise from it → a location pin drops in. */
export const SCENE_KOMPAS = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, paint, rnd } = ctx;
  const comp = new THREE.Group(); comp.position.set(0, 0.4, 1.5); scene.add(comp);
  comp.add(new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.22, 48), mat(COL.obj2, { metalness: 0.7, roughness: 0.3 })));
  const dial = paint(256, 256, (g, W) => { g.fillStyle = "#f7f1e3"; g.fillRect(0, 0, W, W); g.strokeStyle = "#333"; g.fillStyle = "#333"; g.font = "bold 28px sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; ["N", "E", "S", "W"].forEach((c, i) => { const a = i * Math.PI / 2; g.fillText(c, 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }); for (let i = 0; i < 72; i++) { const a = i * Math.PI / 36, r = i % 9 ? 112 : 104; g.beginPath(); g.moveTo(128 + Math.sin(a) * r, 128 - Math.cos(a) * r); g.lineTo(128 + Math.sin(a) * 120, 128 - Math.cos(a) * 120); g.stroke(); } });
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.9, 48), new THREE.MeshStandardMaterial({ map: dial.tex, roughness: 0.6 })); face.rotation.x = -Math.PI / 2; face.position.y = 0.115; comp.add(face);
  const needle = new THREE.Group(); needle.position.y = 0.16; comp.add(needle);
  const red = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 4), mat(COL.accent)); red.rotation.x = -Math.PI / 2; red.position.z = -0.35; needle.add(red);
  const grey = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.7, 4), mat("#5b5f66")); grey.rotation.x = Math.PI / 2; grey.position.z = 0.35; needle.add(grey);
  /* Map: four panels that unfold like a folded paper map. */
  const mapTex = paint(512, 512, (g, W) => { g.fillStyle = "#efe6cf"; g.fillRect(0, 0, W, W); g.strokeStyle = "#c9b991"; g.lineWidth = 2; for (let i = 0; i < W; i += 32) { g.beginPath(); g.moveTo(i, 0); g.lineTo(i, W); g.stroke(); g.beginPath(); g.moveTo(0, i); g.lineTo(W, i); g.stroke(); } g.strokeStyle = "#7fb0c9"; g.lineWidth = 18; g.beginPath(); g.moveTo(0, 380); g.bezierCurveTo(160, 300, 320, 470, 512, 360); g.stroke(); g.strokeStyle = "#fff"; g.lineWidth = 8; g.beginPath(); g.moveTo(256, 0); g.lineTo(256, 512); g.moveTo(0, 200); g.lineTo(512, 200); g.stroke(); }).tex;
  const panels = []; const mapG = new THREE.Group(); mapG.position.y = -0.6; scene.add(mapG);
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => { const g = new THREE.PlaneGeometry(3, 3); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + (sx > 0 ? 1 : 0)) / 2, (uv.getY(i) + (sz > 0 ? 0 : 1)) / 2); g.translate(1.5 * sx, 0, 0); const piv = new THREE.Group(); piv.position.set(0, 0, sz * 1.5); const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: mapTex, side: THREE.DoubleSide, roughness: 0.9 })); m.rotation.x = -Math.PI / 2; piv.add(m); piv.userData.s = sx; mapG.add(piv); panels.push(piv); });
  /* City blocks rising from the map. */
  const BN = 70, blocks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1).translate(0, 0.5, 0), mat(COL.obj, { roughness: 0.5 }), BN); mapG.add(blocks);
  const BD = []; for (let i = 0; i < BN; i++) { let x, z; do { x = rnd() * 5.6 - 2.8; z = rnd() * 5.6 - 2.8; } while (Math.abs(x) < 0.3 || Math.abs(z + 0.6) < 0.3); BD.push([x, z, 0.2 + rnd() * 0.22, 0.3 + rnd() * rnd() * 2.2]); }
  const pin = new THREE.Group(); const head = new THREE.Mesh(new THREE.SphereGeometry(0.32, 24, 16), mat(COL.accent, { emissive: COL.accent, emissiveIntensity: 0.3 })); head.position.y = 1.15; pin.add(head);
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.9, 24), mat(COL.accent)); tip.rotation.x = Math.PI; tip.position.y = 0.6; pin.add(tip); mapG.add(pin);
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.3, 0.38, 40), new THREE.MeshBasicMaterial({ color: COL.accent, transparent: true, side: THREE.DoubleSide })); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.02; mapG.add(ring);
  const dm = new THREE.Object3D();
  return {
    update(S, t) {
      const f = S.find; needle.rotation.y = (1 - f) * (t * 6) + f * Math.sin(t * 2) * 0.05 * (1 - S.map);
      comp.position.y = lerp(0.4, 3.2, S.map); comp.scale.setScalar(lerp(1, 0.6, S.map)); comp.position.z = lerp(1.5, -1.5, S.map);
      panels.forEach((p, i) => { const k = seg(S.map, (i % 2) * 0.2, 0.6 + (i % 2) * 0.2); p.rotation.z = p.userData.s * (1 - k) * Math.PI * 0.98; p.rotation.x = i < 2 ? -(1 - seg(S.map, 0.3, 1)) * 1.5 : 0; });
      mapG.visible = S.map > 0.01;
      for (let i = 0; i < BN; i++) { const b = BD[i], k = seg(S.city, (i % 11) * 0.04, 0.5 + (i % 11) * 0.04); dm.position.set(b[0], 0.01, b[1]); dm.scale.set(b[2], Math.max(0.001, b[3] * k), b[2]); dm.updateMatrix(); blocks.setMatrixAt(i, dm.matrix); }
      blocks.instanceMatrix.needsUpdate = true; blocks.visible = S.city > 0.01;
      const pk = S.pin; pin.visible = pk > 0.01; pin.position.set(0, lerp(5, 0, seg(pk, 0, 0.7)) + Math.abs(Math.sin(t * 2)) * 0.15 * pk, -0.6); pin.rotation.y = t;
      ring.position.z = -0.6; ring.visible = pk > 0.6; const rk = (t * 0.8) % 1; ring.scale.setScalar(1 + rk * 3); ring.material.opacity = (1 - rk) * pk;
    },
  };
}`;

/** 14. A bin lid opens → paper scraps swirl up into a pulp ball → the pulp flattens into fresh sheets → the sheets bind into a book that opens. */
export const SCENE_DAUR = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, rnd } = ctx;
  const bin = new THREE.Group(); bin.position.set(-2.6, -1.6, 0); scene.add(bin);
  const binM = mat(COL.accent2, { roughness: 0.5 });
  const can = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.7, 1.8, 32, 1, true), mat(COL.accent2, { roughness: 0.5, side: THREE.DoubleSide })); can.position.y = 0.9; bin.add(can);
  const lidP = new THREE.Group(); lidP.position.set(-0.85, 1.8, 0); bin.add(lidP);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32), binM); lid.position.x = 0.85; lidP.add(lid);
  /* Recycle arrows printed on the bin as a ring of three bent arrows. */
  for (let i = 0; i < 3; i++) { const a = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.04, 6, 24, 1.6), mat("#ffffff")); a.position.set(0, 0.9, 0.84); a.rotation.z = i * 2.09; bin.add(a); }
  /* Scraps: crumpled paper bits. */
  const N = 140, scrapG = new THREE.IcosahedronGeometry(0.12, 0);
  const scraps = new THREE.InstancedMesh(scrapG, mat("#f3efe6", { roughness: 1, flatShading: true }), N); scene.add(scraps);
  const SD = []; for (let i = 0; i < N; i++) SD.push({ a: rnd() * 6.28, h: rnd(), r: 0.3 + rnd() * 0.5, s: 0.6 + rnd() * 0.8, p: new THREE.Vector3((rnd() * 2 - 1) * 0.65, rnd(), (rnd() * 2 - 1) * 0.65) });
  const pulp = new THREE.Mesh(new THREE.SphereGeometry(0.9, 32, 24), mat("#e8e1d0", { roughness: 1 })); scene.add(pulp);
  /* Book: cover halves plus a fanned block of pages. */
  const book = new THREE.Group(); book.position.set(1.6, 0, 0); scene.add(book);
  const coverM = mat(COL.accent, { roughness: 0.7 }), pageM = mat("#fbf8f0", { roughness: 0.9, side: THREE.DoubleSide });
  const left = new THREE.Group(), right = new THREE.Group(); book.add(left, right);
  const cL = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.06), coverM); cL.position.x = -0.8; left.add(cL);
  const cR = new THREE.Mesh(new THREE.BoxGeometry(1.6, 2.2, 0.06), coverM); cR.position.x = 0.8; right.add(cR);
  const pages = []; for (let i = 0; i < 14; i++) { const p = new THREE.Group(); const m = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.1), pageM); m.position.x = 0.76; p.add(m); p.position.z = 0.04 + i * 0.006; book.add(p); pages.push(p); }
  const dm = new THREE.Object3D();
  return {
    update(S, t) {
      lidP.rotation.z = -lerp(0, 2.1, S.open);
      const pk = S.pulp, bk = S.book;
      for (let i = 0; i < N; i++) { const d = SD[i], up = seg(S.open, 0.3 + d.h * 0.3, 0.8 + d.h * 0.2); const a = d.a + t * d.s + up * 4;
        const sw = new THREE.Vector3(Math.cos(a) * (d.r + up * 1.4), lerp(d.p.y * 1.4, 1.2 + d.h * 2, up), Math.sin(a) * (d.r + up * 1.4)).add(bin.position);
        sw.y += 0.2; const target = new THREE.Vector3(Math.cos(a) * 0.6, 0.5 + Math.sin(a * 1.3) * 0.5, Math.sin(a) * 0.6);
        dm.position.lerpVectors(sw, target, seg(pk, 0, 0.6)); dm.rotation.set(t * d.s + i, a, i); dm.scale.setScalar(Math.max(0.001, 1 - seg(pk, 0.5, 0.9))); dm.updateMatrix(); scraps.setMatrixAt(i, dm.matrix); }
      scraps.instanceMatrix.needsUpdate = true;
      pulp.visible = pk > 0.3 && bk < 0.98; pulp.position.set(lerp(0, 1.6, bk), 0.5, 0); pulp.scale.set(lerp(seg(pk, 0.3, 0.9), 1.2, bk) || 0.001, Math.max(0.001, lerp(seg(pk, 0.3, 0.9), 0.04, bk)), lerp(seg(pk, 0.3, 0.9), 1.4, bk) || 0.001); pulp.rotation.y = t * 0.6;
      book.visible = bk > 0.3; book.scale.setScalar(Math.max(0.001, seg(bk, 0.3, 0.8)));
      const open = seg(bk, 0.6, 1); left.rotation.y = lerp(-Math.PI + 0.02, -0.25, open); right.rotation.y = 0.0;
      pages.forEach((p, i) => { p.rotation.y = -Math.PI * open * (i / 14) * 0.95 - Math.sin(t * 1.4 + i * 0.3) * 0.04 * open; });
      book.rotation.x = -0.35; book.rotation.y = Math.sin(t * 0.4) * 0.12;
    },
  };
}`;

/** 15. A paint drop falls → a crown splash bursts up → color rings spread across a canvas → canvases hang as a gallery wall. */
export const SCENE_CAT = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, paint, rnd } = ctx;
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.25, 24, 16), mat(COL.accent, { roughness: 0.15 })); drop.scale.set(1, 1.4, 1); scene.add(drop);
  /* Crown splash: droplets on a ring that rise and fall. */
  const crown = []; for (let i = 0; i < 18; i++) { const d = new THREE.Mesh(new THREE.SphereGeometry(0.07 + (i % 3) * 0.02, 10, 8), mat(i % 2 ? COL.accent : COL.accent2, { roughness: 0.2 })); d.userData.a = (i / 18) * 6.28; scene.add(d); crown.push(d); }
  const crownWall = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.5, 0.5, 32, 1, true), mat(COL.accent, { side: THREE.DoubleSide, roughness: 0.2 })); scene.add(crownWall);
  /* The main canvas: rings of color drawn outward as S.spread grows. */
  const colors = [COL.accent, COL.accent2, COL.obj2, "#f4c95d", "#5bb6a8", "#7a5cff"];
  const art = paint(512, 512, null);
  const drawArt = (k) => art.draw((g, W) => { g.fillStyle = "#fbf8f2"; g.fillRect(0, 0, W, W); for (let i = 0; i < colors.length; i++) { const r = Math.max(0, k * 330 - i * 50); if (r <= 0) continue; g.fillStyle = colors[i]; g.beginPath(); for (let j = 0; j <= 48; j++) { const a = (j / 48) * 6.283, w = r * (1 + Math.sin(a * 5 + i) * 0.06); g.lineTo(256 + Math.cos(a) * w, 256 + Math.sin(a) * w); } g.fill(); } });
  drawArt(0);
  const frameM = mat(COL.obj2, { roughness: 0.6 });
  const mkFrame = (w, h, map) => { const g = new THREE.Group(); g.add(new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, h + 0.2, 0.08), frameM)); const c = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map, roughness: 0.9 })); c.position.z = 0.045; g.add(c); return g; };
  const main = mkFrame(3, 3, art.tex); main.rotation.x = -Math.PI / 2; main.position.y = -0.6; scene.add(main);
  /* Gallery: smaller canvases with their own abstract art, flying to a wall. */
  const gallery = []; const slots = [[-4.2, 1.2, 1.8, 2.4], [-4.2, -1.6, 1.8, 1.4], [4.2, 1.6, 2, 1.6], [4.2, -1.2, 2, 2], [-7, 0, 1.4, 3], [7, 0, 1.4, 3]];
  slots.forEach((s, i) => { const tex = paint(256, 256, (g, W, H) => { g.fillStyle = "#fbf8f2"; g.fillRect(0, 0, W, H); for (let k = 0; k < 7; k++) { g.fillStyle = colors[(i + k) % colors.length]; g.globalAlpha = 0.85; if (k % 2) { g.beginPath(); g.arc(rnd() * W, rnd() * H, 20 + rnd() * 60, 0, 6.28); g.fill(); } else g.fillRect(rnd() * W, rnd() * H, 30 + rnd() * 90, 20 + rnd() * 50); } g.globalAlpha = 1; }).tex; const f = mkFrame(s[2], s[3], tex); f.userData = { to: new THREE.Vector3(s[0], s[1], -2), from: new THREE.Vector3(s[0] * 0.3, -4, 3), d: i * 0.08 }; scene.add(f); gallery.push(f); });
  const wall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), mat(COL.obj, { roughness: 1 })); wall.position.set(0, 0, -2.2); scene.add(wall);
  let lastK = -1;
  return {
    update(S, t) {
      drop.position.set(0, lerp(5, -0.4, seg(S.drop, 0, 0.9)), 0); drop.visible = S.drop < 0.95;
      const sp = S.splash, up = Math.sin(seg(sp, 0, 1) * Math.PI);
      crown.forEach((d) => { const a = d.userData.a; d.position.set(Math.cos(a) * (0.5 + sp * 1.3), -0.5 + up * 1.4 + Math.sin(a * 3) * 0.1 * up, Math.sin(a) * (0.5 + sp * 1.3)); d.visible = sp > 0.01 && sp < 0.99; });
      crownWall.visible = sp > 0.01 && sp < 0.95; crownWall.scale.set(0.5 + sp * 1.5, Math.max(0.001, up), 0.5 + sp * 1.5); crownWall.position.y = -0.5 + up * 0.25;
      const k = Math.round(seg(S.spread, 0, 1) * 60) / 60; if (k !== lastK) { drawArt(k); lastK = k; }
      const gk = S.gallery;
      main.rotation.x = lerp(-Math.PI / 2, 0, gk); main.position.set(0, lerp(-0.6, 0.2, gk), lerp(0, -1.9, gk));
      gallery.forEach((f) => { const q = seg(gk, f.userData.d, 0.6 + f.userData.d); f.position.lerpVectors(f.userData.from, f.userData.to, q); f.rotation.z = (1 - q) * 1.2; f.visible = q > 0.01; });
      wall.visible = gk > 0.01; wall.material.opacity = 1;
    },
  };
}`;
