/* ================================================================== */
/* Adegan 3D Cerita Scroll (v22), bagian C: kertas → pesawat kertas,     */
/* bola lampu → jaringan saraf, jam pasir → lini waktu melingkar.       */
/* ================================================================== */

/** 7. Kertas datar → sudut dilipat → dilipat jadi pesawat → terbang melewati cincin kata → mendarat. */
export const SCENE_PESAWAT = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, mat, seg, lerp, paint, glow } = ctx;
  const desk = new THREE.Mesh(new THREE.BoxGeometry(7, 0.18, 5), mat(COL.obj2, { roughness: 0.8 })); desk.position.y = -0.1; scene.add(desk);
  const pencil = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 6), mat(COL.accent)); pencil.rotation.set(0, 0.7, Math.PI / 2); pencil.position.set(2.2, 0.05, 1.3); scene.add(pencil);
  /* Lembar kertas: setiap segitiga punya posisi datar dan posisi terlipat; diinterpolasi bertahap dengan lengkung. */
  const V = (x, y, z) => [x, y, z];
  const N = V(0, 0, -1.6), K = V(0, -0.42, 1.4), T = V(0, 0, 1.4);
  const pieces = [];
  [-1, 1].forEach((s) => {
    const WL = V(1.05 * s, 0.1, 1.4), FLAP = V(0.32 * s, 0.03, -0.2);
    /* [vertex datar, vertex terlipat] × 3, tahap */
    pieces.push({ st: 1, v: [[V(0, 0, -1.6), N], [V(0.38 * s, 0, 1.4), T], [V(1.38 * s, 0, 1.4), WL]] });
    pieces.push({ st: 1, v: [[V(0, 0, -1.6), N], [V(0.001 * s, 0, 1.4), K], [V(0.38 * s, 0, 1.4), T]] });
    pieces.push({ st: 0, v: [[V(0, 0, -1.6), N], [V(1.38 * s, 0, -1.6), FLAP], [V(1.38 * s, 0, 1.4), WL]] });
  });
  const pos = new Float32Array(pieces.length * 9);
  const pg = new THREE.BufferGeometry(); pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const paper = new THREE.Mesh(pg, mat("#fbfbf7", { side: THREE.DoubleSide, roughness: 0.9, flatShading: true }));
  const plane = new THREE.Group(); plane.add(paper); scene.add(plane);
  const edges = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(pieces.length * 18), 3)), new THREE.LineBasicMaterial({ color: "#c9c6bb" }));
  plane.add(edges);
  function shape(fold) {
    let o = 0, e = 0; const ea = edges.geometry.attributes.position.array;
    pieces.forEach((p) => {
      const k = p.st === 0 ? seg(fold, 0, 0.45) : seg(fold, 0.4, 1);
      const pts = p.v.map((pair) => { const a = pair[0], b = pair[1], lift = Math.sin(k * Math.PI) * 0.35 * Math.hypot(a[0] - b[0], a[2] - b[2]); return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + lift, lerp(a[2], b[2], k)]; });
      pts.forEach((q) => { pos[o++] = q[0]; pos[o++] = q[1] + 0.05; pos[o++] = q[2]; });
      [[0, 1], [1, 2], [2, 0]].forEach((ij) => { const A = pts[ij[0]], B = pts[ij[1]]; ea[e++] = A[0]; ea[e++] = A[1] + 0.055; ea[e++] = A[2]; ea[e++] = B[0]; ea[e++] = B[1] + 0.055; ea[e++] = B[2]; });
    });
    pg.attributes.position.needsUpdate = true; pg.computeVertexNormals(); edges.geometry.attributes.position.needsUpdate = true;
  }
  /* Jalur terbang dan cincin kata yang dilewati. */
  const path = new THREE.CatmullRomCurve3([[0, 0.6, 0], [-2, 2.5, -4], [-6, 4.5, -10], [0, 6, -18], [7, 5, -12], [5, 3.2, -4], [1, 1.2, 0.5]].map((p) => new THREE.Vector3(p[0], p[1], p[2])));
  const words = CONFIG.kata || [];
  const rings = words.slice(0, 4).map((w, i) => {
    const f = 0.18 + i * 0.2, p = path.getPointAt(f), tg = path.getTangentAt(f);
    const g = new THREE.Group(); g.position.copy(p); g.lookAt(p.clone().add(tg));
    const r = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 8, 48), new THREE.MeshBasicMaterial({ color: i % 2 ? COL.accent2 : COL.accent })); g.add(r);
    const lab = paint(512, 128, (c, W, H) => { c.fillStyle = i % 2 ? COL.accent2 : COL.accent; c.font = "800 72px system-ui, sans-serif"; c.textAlign = "center"; c.textBaseline = "middle"; c.fillText(w, W / 2, H / 2); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lab.tex, transparent: true, depthWrite: false })); s.scale.set(2.4, 0.6, 1); s.position.y = 1.55; g.add(s);
    scene.add(g); return { g, f };
  });
  /* Jejak: garis titik-titik di belakang pesawat. */
  const TR = 80, trail = new THREE.Line(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(new Float32Array(TR * 3), 3)), new THREE.LineDashedMaterial({ color: COL.accent, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.8 }));
  scene.add(trail);
  /* Awan: gugus bola putih. */
  const cloudM = mat("#ffffff", { roughness: 1, transparent: true, opacity: 0.92, flatShading: true });
  [[-7, 6, -14], [6, 7.5, -19], [9, 3.5, -7], [-4, 3, -3]].forEach((c, i) => { const g = new THREE.Group(); for (let k = 0; k < 5; k++) { const b = new THREE.Mesh(new THREE.IcosahedronGeometry(0.7 + (k % 3) * 0.3, 1), cloudM); b.position.set(k * 0.7 - 1.4, Math.sin(k * 2) * 0.3, Math.cos(k) * 0.4); g.add(b); } g.position.set(c[0], c[1], c[2]); g.userData.p = i; scene.add(g); });
  const tmp = new THREE.Vector3(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), m4 = new THREE.Matrix4();
  let lastFold = -1;
  return {
    update(S, t) {
      if (Math.abs(S.fold - lastFold) > 0.002) { lastFold = S.fold; shape(S.fold); }
      const fly = S.fly;
      if (fly <= 0.001) {
        plane.position.set(0, lerp(0.02, 0.9 + Math.sin(t * 1.6) * 0.08, S.lift), 0);
        plane.rotation.set(lerp(0, -0.12, S.lift), lerp(0, Math.sin(t * 0.7) * 0.2, S.lift), lerp(0, Math.sin(t * 1.1) * 0.08, S.lift));
      } else {
        const f = Math.min(0.999, fly), p = path.getPointAt(f), tg = path.getTangentAt(f);
        plane.position.copy(p);
        m4.lookAt(p, tmp.copy(p).sub(tg), up); q.setFromRotationMatrix(m4); plane.quaternion.copy(q);
        plane.rotateZ(Math.sin(f * 18) * 0.35);
      }
      const ta = trail.geometry.attributes.position;
      for (let i = 0; i < TR; i++) { const f = Math.max(0, Math.min(0.999, fly - i * 0.004)); const p = path.getPointAt(f); ta.setXYZ(i, p.x, p.y, p.z); }
      ta.needsUpdate = true; trail.computeLineDistances(); trail.visible = fly > 0.01;
      rings.forEach((r) => { const k = seg(fly, r.f - 0.12, r.f - 0.02); r.g.scale.setScalar(Math.max(0.001, k * (fly > r.f + 0.05 ? 0.85 : 1))); r.g.rotation.z += 0.004; });
    },
  };
}`;

/** 8. Bola lampu gelap → filamen menyala → kamera masuk ke filamen → filamen pecah jadi jaringan saraf yang berdenyut. */
export const SCENE_LAMPU = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd } = ctx;
  const bulb = new THREE.Group(); scene.add(bulb);
  const pts = [[0.42, -0.7], [0.45, -0.4], [0.62, 0.0], [0.95, 0.55], [1.12, 1.05], [1.1, 1.5], [0.92, 1.9], [0.55, 2.18], [0.0, 2.28]].map((p) => new THREE.Vector2(p[0], p[1]));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(pts).getPoints(40), 48), new THREE.MeshStandardMaterial({ color: "#dfefff", transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.2, side: THREE.DoubleSide, depthWrite: false }));
  bulb.add(glass);
  const thread = []; for (let i = 0; i <= 18; i++) { const y = -0.72 - i * 0.05; thread.push(new THREE.Vector2(0.44 + (i % 2 ? 0.05 : 0), y)); }
  thread.push(new THREE.Vector2(0.3, -1.72), new THREE.Vector2(0.12, -1.8), new THREE.Vector2(0, -1.82));
  bulb.add(new THREE.Mesh(new THREE.LatheGeometry(thread, 40), mat(COL.obj, { metalness: 0.9, roughness: 0.3 })));
  /* Filamen: kumparan heliks di antara dua kawat penyangga. */
  const coil = []; for (let i = 0; i <= 140; i++) { const a = i / 140; coil.push(new THREE.Vector3(lerp(-0.42, 0.42, a), 0.95 + Math.sin(a * Math.PI) * 0.12 + Math.cos(a * 64) * 0.04, Math.sin(a * 64) * 0.04)); }
  const filMat = new THREE.MeshBasicMaterial({ color: "#3a2410" });
  const fil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coil), 280, 0.012, 5), filMat); bulb.add(fil);
  const wireM = mat("#9aa0aa", { metalness: 0.9, roughness: 0.3 });
  [-0.42, 0.42].forEach((x) => { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.7, 6), wireM); w.position.set(x, 0.1, 0); bulb.add(w); });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.2, 0.6, 16), new THREE.MeshStandardMaterial({ color: "#dfefff", transparent: true, opacity: 0.25 })); stem.position.y = -0.45; bulb.add(stem);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ffcf7a", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.position.y = 0.98; bulb.add(halo);
  const lamp = new THREE.PointLight("#ffcf7a", 0, 12, 1.5); lamp.position.y = 1; bulb.add(lamp);
  /* Jaringan: simpul dalam bola, sisi ke 3 tetangga terdekat, denyut berjalan di sisi. */
  const NN = 170, nodes = [];
  for (let i = 0; i < NN; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.28, r = 2 + Math.cbrt(rnd()) * 7; const s = Math.sqrt(1 - u * u); nodes.push(new THREE.Vector3(Math.cos(a) * s * r, u * r * 0.7 + 1, Math.sin(a) * s * r)); }
  const edges = [];
  nodes.forEach((p, i) => { const near = nodes.map((q, j) => [q.distanceTo(p), j]).filter((x) => x[1] !== i).sort((a, b) => a[0] - b[0]).slice(0, 3); near.forEach((x) => { if (i < x[1]) edges.push([i, x[1]]); }); });
  const center = new THREE.Vector3(0, 0.98, 0);
  const np = new Float32Array(NN * 3), ep = new Float32Array(edges.length * 6);
  const nodePts = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(np, 3)), new THREE.PointsMaterial({ size: 0.32, map: glow(), color: COL.accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const lines = new THREE.LineSegments(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(ep, 3)), new THREE.LineBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false }));
  const PN = 90, pp = new Float32Array(PN * 3), pulse = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ size: 0.22, map: glow(), color: "#ffffff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  const pdata = Array.from({ length: PN }, () => [Math.floor(rnd() * edges.length), rnd(), 0.3 + rnd() * 0.6]);
  const net = new THREE.Group(); net.add(lines, nodePts, pulse); scene.add(net);
  const cur = nodes.map(() => new THREE.Vector3());
  const off = new THREE.Color("#3a2410"), on = new THREE.Color("#fff2c4");
  return {
    update(S, t) {
      const g = S.glow;
      filMat.color.copy(off).lerp(on, g);
      halo.material.opacity = g * (0.85 + 0.15 * Math.sin(t * 9)); halo.scale.setScalar(lerp(0.2, 2.8, g));
      lamp.intensity = g * 14;
      bulb.visible = S.net < 0.55;
      bulb.rotation.y = Math.sin(t * 0.4) * 0.2 * (1 - S.net);
      const k = S.net;
      nodes.forEach((p, i) => { const d = seg(k, (p.distanceTo(center) / 10) * 0.5, (p.distanceTo(center) / 10) * 0.5 + 0.5); cur[i].copy(center).lerp(p, d); cur[i].y += Math.sin(t * 0.8 + i) * 0.06 * d; np[i * 3] = cur[i].x; np[i * 3 + 1] = cur[i].y; np[i * 3 + 2] = cur[i].z; });
      edges.forEach((e, j) => { const a = cur[e[0]], b = cur[e[1]]; ep.set([a.x, a.y, a.z, b.x, b.y, b.z], j * 6); });
      nodePts.geometry.attributes.position.needsUpdate = true; lines.geometry.attributes.position.needsUpdate = true;
      pdata.forEach((d, i) => { const e = edges[d[0]], f = (t * d[2] + d[1]) % 1; const a = cur[e[0]], b = cur[e[1]]; pp[i * 3] = lerp(a.x, b.x, f); pp[i * 3 + 1] = lerp(a.y, b.y, f); pp[i * 3 + 2] = lerp(a.z, b.z, f); });
      pulse.geometry.attributes.position.needsUpdate = true;
      net.visible = k > 0.01; lines.material.opacity = 0.45 * k; pulse.material.opacity = k; nodePts.material.opacity = k;
      net.rotation.y = t * 0.04 * k;
    },
  };
}`;

/** 9. Jam pasir → pasir turun → tutup terbuka → butir pasir terbang membentuk cincin lini waktu → kamera berjalan di cincin. */
export const SCENE_JAMPASIR = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, mat, seg, lerp, glow, paint, rnd } = ctx;
  const hg = new THREE.Group(); scene.add(hg);
  const wood = mat(COL.obj2, { roughness: 0.6 });
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.16, 32), wood); top.position.y = 1.7; hg.add(top);
  const bot = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.16, 32), wood); bot.position.y = -1.7; hg.add(bot);
  for (let i = 0; i < 3; i++) { const a = i / 3 * Math.PI * 2, p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 3.3, 8), wood); p.position.set(Math.cos(a) * 0.98, 0, Math.sin(a) * 0.98); hg.add(p); }
  const gp = [[0.05, -1.62], [0.62, -1.5], [0.8, -1.1], [0.62, -0.5], [0.12, -0.08], [0.12, 0.08], [0.62, 0.5], [0.8, 1.1], [0.62, 1.5], [0.05, 1.62]].map((p) => new THREE.Vector2(p[0], p[1]));
  hg.add(new THREE.Mesh(new THREE.LatheGeometry(new THREE.SplineCurve(gp).getPoints(40), 40), new THREE.MeshStandardMaterial({ color: "#e8f3ff", transparent: true, opacity: 0.18, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false })));
  const sand = mat(COL.accent, { roughness: 0.95 });
  const upper = new THREE.Mesh(new THREE.ConeGeometry(0.68, 1.1, 32), sand); upper.rotation.x = Math.PI; hg.add(upper);
  const lower = new THREE.Mesh(new THREE.ConeGeometry(0.75, 0.9, 32), sand); hg.add(lower);
  const stream = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.5, 6), sand); stream.position.y = -0.78; hg.add(stream);
  /* Butir pasir yang terbang membentuk cincin lini waktu. */
  const GN = 2400, gpos = new Float32Array(GN * 3), gd = [];
  const R = 6.5;
  for (let i = 0; i < GN; i++) { const a = rnd() * 6.283; gd.push({ a, r: R + (rnd() - 0.5) * 0.6, y: (rnd() - 0.5) * 0.3, d: rnd() * 0.5, sw: rnd() * 6 }); }
  const grains = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(gpos, 3)), new THREE.PointsMaterial({ size: 0.12, map: glow(), color: COL.accent, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(grains);
  /* Penanda tahun: tugu kecil + label kanvas di sepanjang cincin. */
  const years = CONFIG.tonggak || [];
  const marks = years.map((y, i) => {
    const a = (i / years.length) * Math.PI * 2 + Math.PI / 2, g = new THREE.Group(); g.position.set(Math.cos(a) * R, -1.6, Math.sin(a) * R);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.6, 8), mat(COL.accent2)); pole.position.y = 0.8; g.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat(COL.accent, { emissive: COL.accent, emissiveIntensity: 0.6 })); ball.position.y = 1.65; g.add(ball);
    const lab = paint(512, 200, (c, W, H) => { c.fillStyle = "rgba(0,0,0,0)"; c.clearRect(0, 0, W, H); c.fillStyle = COL.accent; c.font = "800 92px Georgia, serif"; c.textAlign = "center"; c.fillText(String(y.tahun), W / 2, 92); c.fillStyle = "#ffffff"; c.font = "600 40px system-ui, sans-serif"; c.fillText(String(y.teks), W / 2, 160); });
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lab.tex, transparent: true, depthWrite: false })); s.scale.set(3, 1.17, 1); s.position.y = 2.6; g.add(s);
    scene.add(g); return { g, a };
  });
  const floor = new THREE.Mesh(new THREE.CircleGeometry(14, 64), mat(COL.bg2, { roughness: 1 })); floor.rotation.x = -Math.PI / 2; floor.position.y = -1.79; scene.add(floor);
  return {
    update(S, t) {
      const s = S.sand;
      upper.scale.set(Math.max(0.001, Math.sqrt(1 - s)), Math.max(0.001, 1 - s), Math.max(0.001, Math.sqrt(1 - s))); upper.position.y = 0.62 + (1 - s) * 0 + 0.0;
      upper.position.y = 0.1 + 0.55 * (1 - s) + 0.0;
      lower.scale.set(Math.max(0.001, Math.sqrt(s)), Math.max(0.001, s), Math.max(0.001, Math.sqrt(s))); lower.position.y = -1.62 + 0.45 * s;
      stream.visible = s > 0.02 && s < 0.98 && S.open < 0.1;
      top.position.y = 1.7 + seg(S.open, 0, 1) * 1.6; top.rotation.z = seg(S.open, 0, 1) * 0.6;
      hg.rotation.y = t * 0.15;
      const k = S.ring;
      for (let i = 0; i < GN; i++) {
        const d = gd[i], e = seg(k, d.d, d.d + 0.5), a = d.a + t * 0.05;
        const sx = Math.cos(d.sw + t) * 0.3 * (1 - e), sy = 1.4 + (1 - e) * 0.2;
        gpos[i * 3] = lerp(sx, Math.cos(a) * d.r, e); gpos[i * 3 + 1] = lerp(sy, -1.65 + d.y + Math.sin(a * 6 + t) * 0.05, e) + Math.sin(e * Math.PI) * 2.5; gpos[i * 3 + 2] = lerp(Math.sin(d.sw + t) * 0.3 * (1 - e), Math.sin(a) * d.r, e);
      }
      grains.geometry.attributes.position.needsUpdate = true; grains.visible = k > 0.005;
      marks.forEach((m, i) => { const e = seg(S.years, i * 0.12, i * 0.12 + 0.4); m.g.scale.setScalar(Math.max(0.001, e)); m.g.visible = e > 0.01; });
    },
  };
}`;
