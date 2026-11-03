/* ================================================================== */
/* Adegan 3D Cerita Scroll (v22), bagian E: kardus → bola dunia, pena →  */
/* tinta → huruf, sel → DNA → grafik, pintu di gurun → hutan.           */
/* ================================================================== */

/** 14. Kardus tertutup → tutup terbuka → barang melayang keluar → kardus terurai rata → bola dunia muncul dengan jalur kiriman. */
export const SCENE_KARDUS = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd } = ctx;
  const S2 = 1.0, T = 0.04;
  const kraft = mat(COL.obj, { roughness: 0.9 }), kraftIn = mat(COL.obj2, { roughness: 0.95 }), tapeM = mat(COL.accent, { roughness: 0.6 });
  const panel = (w, h) => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, T), [kraft, kraft, kraft, kraft, kraft, kraftIn]); g.add(m); return { g, m }; };
  const box = new THREE.Group(); scene.add(box);
  const bottom = new THREE.Mesh(new THREE.BoxGeometry(S2 * 2, T, S2 * 2), kraft); box.add(bottom);
  /* Sisi berengsel di tepi bawah; tutup berengsel di tepi atas sisi. */
  const sides = [], flaps = [];
  for (let i = 0; i < 4; i++) {
    const hinge = new THREE.Group(); hinge.rotation.y = (i * Math.PI) / 2; box.add(hinge);
    const pivot = new THREE.Group(); pivot.position.z = S2; hinge.add(pivot);
    const p = panel(S2 * 2, S2 * 2); p.m.position.y = S2; pivot.add(p.g);
    const fp = new THREE.Group(); fp.position.y = S2 * 2; pivot.add(fp);
    const f = panel(S2 * 2, S2); f.m.position.y = S2 / 2; fp.add(f.g);
    if (i % 2 === 0) { const tp = new THREE.Mesh(new THREE.BoxGeometry(0.34, S2 * 0.6, T * 1.4), tapeM); tp.position.y = S2 * 0.3; fp.add(tp); }
    sides.push(pivot); flaps.push(fp);
  }
  /* Barang: ponsel, buku, sepatu (bentuk sederhana) dengan cahaya lembut. */
  const items = [];
  const phone = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.82, 0.06), mat("#1f2430", { roughness: 0.3, metalness: 0.3 })); items.push(phone);
  const book = new THREE.Group(); const bc = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.95, 0.16), mat(COL.accent2)); book.add(bc); const pg = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.9, 0.17), mat("#f8f4ea")); pg.position.x = 0.03; book.add(pg); items.push(book);
  const shoe = new THREE.Group(); const sole = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.36), mat("#ffffff")); shoe.add(sole); const up = new THREE.Mesh(new THREE.SphereGeometry(0.3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(COL.accent)); up.scale.set(1.5, 0.9, 0.62); up.position.set(-0.05, 0.05, 0); shoe.add(up); items.push(shoe);
  items.forEach((it) => scene.add(it));
  /* Bola dunia: bola + garis lintang/bujur + titik daratan + busur kiriman. */
  const globe = new THREE.Group(); globe.position.y = 2.2; scene.add(globe);
  const R = 1.6;
  globe.add(new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), mat(COL.bg2, { roughness: 0.8 })));
  const grid = new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.SphereGeometry(R * 1.002, 18, 12)), new THREE.LineBasicMaterial({ color: COL.obj2, transparent: true, opacity: 0.25 })); globe.add(grid);
  const LP = [];
  const blobs = [[0.2, 1.9, 0.7], [0.75, 0.3, 0.6], [-0.3, -1.2, 0.5], [0.9, -2.4, 0.45], [-0.6, 2.6, 0.4], [-0.1, 0.9, 0.35]];
  for (let i = 0; i < 2600; i++) { const u = rnd() * 2 - 1, a = rnd() * 6.283, lat = Math.asin(u); let ok = false; blobs.forEach((b) => { const d = Math.acos(Math.min(1, Math.sin(lat) * Math.sin(b[0]) + Math.cos(lat) * Math.cos(b[0]) * Math.cos(a - b[1]))); if (d < b[2]) ok = true; }); if (!ok) continue; const r = R * 1.01; LP.push(Math.cos(lat) * Math.cos(a) * r, Math.sin(lat) * r, Math.cos(lat) * Math.sin(a) * r); }
  globe.add(new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(LP, 3)), new THREE.PointsMaterial({ color: COL.accent2, size: 0.05 })));
  const ll = (lat, lon) => new THREE.Vector3(Math.cos(lat) * Math.cos(lon), Math.sin(lat), Math.cos(lat) * Math.sin(lon)).multiplyScalar(R);
  const hub = ll(-0.1, 0.9), dests = [ll(0.6, 1.9), ll(0.3, 0.3), ll(-0.5, -1.0), ll(-0.2, 1.3), ll(0.9, -2.4), ll(-0.7, 2.6)];
  const arcs = dests.map((d) => { const mid = hub.clone().add(d).multiplyScalar(0.5); mid.setLength(R * 1.45); const c = new THREE.QuadraticBezierCurve3(hub, mid, d); const pts = c.getPoints(60); const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), new THREE.LineBasicMaterial({ color: COL.accent })); globe.add(l); const dot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: COL.accent, transparent: true, depthWrite: false })); dot.scale.setScalar(0.22); globe.add(dot); return { l, c, dot }; });
  const hubDot = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#ffffff", transparent: true, depthWrite: false })); hubDot.position.copy(hub); hubDot.scale.setScalar(0.4); globe.add(hubDot);
  return {
    update(S, t) {
      const op = S.open, fl = S.flat;
      flaps.forEach((f, i) => { f.rotation.x = seg(op, i * 0.1, i * 0.1 + 0.6) * 2.1 * (1 - seg(fl, 0, 0.6)) + seg(fl, 0, 0.6) * Math.PI / 2 * 2; });
      flaps.forEach((f) => { if (fl > 0) f.rotation.x = lerp(2.1, Math.PI / 2, seg(fl, 0, 0.6)); });
      sides.forEach((p) => { p.rotation.x = seg(fl, 0.2, 1) * Math.PI / 2; });
      box.rotation.y = Math.sin(t * 0.3) * 0.25 * (1 - fl) + 0.6;
      box.position.y = -1.0;
      const it = S.items;
      items.forEach((m, i) => {
        const k = seg(it, i * 0.15, i * 0.15 + 0.55), a = i / 3 * Math.PI * 2 + t * 0.4 * k;
        const rr = lerp(0, 2.4, seg(it, 0.3, 1)) * (1 - S.globe * 0.0);
        m.position.set(Math.cos(a) * rr, lerp(-0.6, 1.4 + Math.sin(t + i) * 0.15, k), Math.sin(a) * rr);
        m.rotation.set(t * 0.3 + i, t * 0.5 + i, 0); m.scale.setScalar(Math.max(0.001, k * (1 - seg(S.globe, 0.6, 1))));
        m.visible = k > 0.01;
      });
      const g = S.globe;
      globe.scale.setScalar(Math.max(0.001, seg(g, 0, 0.6))); globe.visible = g > 0.01;
      globe.position.y = lerp(-0.6, 1.4, seg(g, 0, 0.6));
      globe.rotation.y = -0.9 + t * 0.12 * g;
      arcs.forEach((a, i) => { const k = seg(S.routes, i * 0.1, i * 0.1 + 0.4); a.l.geometry.setDrawRange(0, Math.floor(61 * k)); const f = (t * 0.35 + i * 0.17) % 1; a.dot.position.copy(a.c.getPoint(f)); a.dot.material.opacity = k; });
    },
  };
}`;

/** 15. Pena tinta → setetes tinta jatuh → menyebar di kertas → butir tinta naik membentuk nama → pena menandatangani. */
export const SCENE_PENA = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, BRAND, mat, seg, lerp, rnd } = ctx;
  const paper = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.03, 8.4), mat("#fbf8f1", { roughness: 0.95 })); paper.position.y = -0.02; scene.add(paper);
  for (let i = 0; i < 12; i++) { const l = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.012), new THREE.MeshBasicMaterial({ color: "#c9d3e6" })); l.rotation.x = -Math.PI / 2; l.position.set(0, 0.0, -2.6 + i * 0.5); scene.add(l); }
  /* Pena: laras, cincin emas, mata pena pipih dengan belahan. */
  const pen = new THREE.Group(); scene.add(pen);
  const tip = new THREE.Group(); pen.add(tip);
  const nibS = new THREE.Shape(); nibS.moveTo(0, 0); nibS.quadraticCurveTo(0.17, 0.35, 0.16, 0.7); nibS.lineTo(-0.16, 0.7); nibS.quadraticCurveTo(-0.17, 0.35, 0, 0);
  const gold = mat("#d6aa4b", { metalness: 0.6, roughness: 0.3 });
  const nib = new THREE.Mesh(new THREE.ExtrudeGeometry(nibS, { depth: 0.03, bevelEnabled: false }), gold); nib.position.z = -0.015; tip.add(nib);
  const slit = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.42, 0.04), new THREE.MeshBasicMaterial({ color: "#3a2a10" })); slit.position.y = 0.22; tip.add(slit);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 0.6, 24), mat("#121826", { roughness: 0.25 })); grip.position.y = 0.95; tip.add(grip);
  const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.205, 0.08, 24), gold); ring.position.y = 1.28; tip.add(ring);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.19, 2.6, 24), mat(COL.obj, { roughness: 0.2, metalness: 0.2 })); barrel.position.y = 2.6; tip.add(barrel);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(COL.obj)); cap.position.y = 3.9; tip.add(cap);
  /* Tinta: tetes, genangan (lingkaran bergerigi), butir yang membentuk teks. */
  const ink = mat(COL.accent2, { roughness: 0.15 });
  const drop = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 10), ink); drop.scale.set(1, 1.5, 1); scene.add(drop);
  const sh = new THREE.Shape(); for (let i = 0; i <= 64; i++) { const a = (i / 64) * Math.PI * 2, r = 1 + Math.sin(a * 5) * 0.08 + Math.sin(a * 11 + 1) * 0.05; const x = Math.cos(a) * r, y = Math.sin(a) * r; if (i) sh.lineTo(x, y); else sh.moveTo(x, y); }
  const blot = new THREE.Mesh(new THREE.ShapeGeometry(sh), new THREE.MeshBasicMaterial({ color: COL.accent2 })); blot.rotation.x = -Math.PI / 2; blot.position.set(0, 0.006, 1.6); scene.add(blot);
  const text = String(CONFIG.kata || BRAND);
  const c = document.createElement("canvas"); c.width = 900; c.height = 220; const g = c.getContext("2d");
  g.fillStyle = "#000"; g.font = "700 150px Georgia, 'Times New Roman', serif"; g.textAlign = "center"; g.textBaseline = "middle";
  let fs = 150; while (g.measureText(text).width > 860 && fs > 40) { fs -= 6; g.font = "700 " + fs + "px Georgia, serif"; }
  g.fillText(text, 450, 110);
  const data = g.getImageData(0, 0, 900, 220).data, targets = [];
  for (let y = 0; y < 220; y += 3) for (let x = 0; x < 900; x += 3) if (data[(y * 900 + x) * 4 + 3] > 128) targets.push([(x - 450) / 110, (110 - y) / 110]);
  const PN = Math.min(5200, targets.length), pp = new Float32Array(PN * 3), pdat = [];
  for (let i = 0; i < PN; i++) { const tg = targets[Math.floor((i / PN) * targets.length)]; const a = rnd() * 6.283, r = Math.sqrt(rnd()) * 0.9; pdat.push({ sx: Math.cos(a) * r, sz: 1.6 + Math.sin(a) * r, tx: tg[0], ty: 1.4 + tg[1], d: rnd() * 0.4 }); }
  const parts = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(pp, 3)), new THREE.PointsMaterial({ color: COL.accent2, size: 0.045 }));
  scene.add(parts);
  /* Tanda tangan: kurva yang tergambar mengikuti ujung pena. */
  const sig = new THREE.CatmullRomCurve3([[-1.6, 3.0], [-1.2, 2.6], [-0.9, 3.1], [-0.6, 2.7], [-0.2, 3.0], [0.1, 2.6], [0.4, 3.05], [0.8, 2.75], [1.3, 2.95], [1.8, 2.7]].map((p) => new THREE.Vector3(p[0], 0.008, p[1])));
  const sp = sig.getPoints(160);
  const sline = new THREE.Line(new THREE.BufferGeometry().setFromPoints(sp), new THREE.LineBasicMaterial({ color: COL.accent2 })); scene.add(sline);
  const hover = new THREE.Vector3(0.0, 1.4, 1.6);
  return {
    update(S, t) {
      /* Pena: melayang miring di atas genangan, lalu turun menandatangani. */
      const sg = S.sign, k = seg(sg, 0, 0.06);
      if (sg > 0.001) { const p = sig.getPointAt(Math.min(0.999, sg)); tip.position.set(p.x, 0.02 + (1 - k) * 1.2, p.z); }
      else tip.position.set(hover.x + seg(S.letters, 0, 0.5) * 2.6, 1.4 + Math.sin(t * 1.2) * 0.06 + seg(S.letters, 0, 0.5) * 0.6, hover.z);
      tip.rotation.set(-0.5, 0.4, -0.35 + Math.sin(t * 0.5) * 0.05 * (1 - k));
      const f = seg(S.drop, 0, 0.7);
      drop.position.set(hover.x, lerp(1.35, 0.02, f * f), hover.z); drop.visible = S.drop > 0.01 && S.drop < 0.7;
      const b = seg(S.drop, 0.6, 1) * (1 - seg(S.letters, 0, 0.6) * 0.75);
      blot.scale.setScalar(Math.max(0.001, b * 0.9)); blot.visible = b > 0.01;
      const L = S.letters;
      for (let i = 0; i < PN; i++) { const p = pdat[i], e = seg(L, p.d, p.d + 0.6), arc = Math.sin(e * Math.PI) * 0.8; pp[i * 3] = lerp(p.sx, p.tx, e); pp[i * 3 + 1] = lerp(0.02, p.ty, e) + arc * 0.3; pp[i * 3 + 2] = lerp(p.sz, 0.2, e) + arc; }
      const off = seg(L, 1.0, 1.6);
      if (off > 0) for (let i = 0; i < PN; i++) { pp[i * 3 + 1] -= off * (1.2 + pdat[i].d * 3); pp[i * 3 + 2] += off * pdat[i].d * 2; }
      parts.material.opacity = 1 - off; parts.material.transparent = true;
      parts.geometry.attributes.position.needsUpdate = true; parts.visible = L > 0.005 && off < 0.99;
      sline.geometry.setDrawRange(0, Math.floor(sp.length * sg)); sline.visible = sg > 0.005;
    },
  };
}`;

/** 16. Satu sel → membelah 2, 4, 8 → kamera masuk ke inti → heliks DNA berputar → anak tangga DNA lepas menjadi grafik batang. */
export const SCENE_SEL = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow } = ctx;
  const cells = [], cellM = new THREE.MeshStandardMaterial({ color: COL.obj, transparent: true, opacity: 0.38, roughness: 0.15, metalness: 0.05, depthWrite: false }), nucM = mat(COL.accent, { roughness: 0.3, emissive: COL.accent, emissiveIntensity: 0.25 });
  const AX = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)], D = [1.25, 0.8, 0.55];
  for (let i = 0; i < 8; i++) {
    const g = new THREE.Group();
    const m = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), cellM); g.add(m);
    const n = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 16), nucM); g.add(n);
    for (let k = 0; k < 6; k++) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), mat(COL.accent2)); o.position.set(Math.cos(k * 1.7) * 0.6, Math.sin(k * 2.3) * 0.5, Math.sin(k * 1.1) * 0.55); g.add(o); }
    scene.add(g); cells.push({ g, m, n });
  }
  /* Heliks DNA: dua untai bola + anak tangga silinder (instanced). */
  const dna = new THREE.Group(); scene.add(dna);
  const RN = 40, H = 6, sA = new THREE.InstancedMesh(new THREE.SphereGeometry(0.09, 10, 8), mat(COL.accent2, { roughness: 0.3 }), RN * 2);
  const rungs = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.03, 0.03, 1, 6), mat("#ffffff", { roughness: 0.5 }), RN);
  const bars = []; for (let i = 0; i < RN; i++) bars.push(0.3 + 0.7 * Math.abs(Math.sin(i * 0.55) * Math.cos(i * 0.21)) + (i / RN) * 0.6);
  const rc = new THREE.Color(), ca = new THREE.Color(COL.accent), cb = new THREE.Color(COL.accent2);
  for (let i = 0; i < RN; i++) { rc.copy(i % 2 ? ca : cb); rungs.setColorAt(i, rc); }
  dna.add(sA, rungs);
  const dm = new THREE.Object3D(), up = new THREE.Vector3(0, 1, 0), dir = new THREE.Vector3(), q = new THREE.Quaternion();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: COL.accent, transparent: true, opacity: 0.35, depthWrite: false })); halo.scale.setScalar(4); scene.add(halo);
  return {
    update(S, t) {
      const lv = S.divide * 3;
      cells.forEach((c, i) => {
        const p = new THREE.Vector3();
        for (let b = 0; b < 3; b++) { const k = seg(lv, b, b + 1), s = (i >> b) & 1 ? 1 : -1; p.addScaledVector(AX[b], s * D[b] * k); }
        const r = lerp(1.25, 0.62, seg(lv, 0, 3));
        const pinch = Math.sin(seg(lv - Math.floor(lv), 0, 1) * Math.PI) * 0.12;
        c.g.position.copy(p).multiplyScalar(1 + 0.15 * Math.sin(t * 0.6 + i) * 0.05);
        c.g.scale.set(r * (1 + pinch), r * (1 - pinch * 0.5), r * (1 - pinch * 0.5));
        c.g.rotation.y = t * 0.2 + i;
        c.g.visible = S.dna < 0.5 || i !== 0;
      });
      cellM.opacity = 0.38 * (1 - seg(S.dna, 0.2, 0.7));
      cells.forEach((c, i) => { c.g.visible = cellM.opacity > 0.01 || false; });
      halo.position.copy(cells[0].g.position);
      halo.material.opacity = 0.35 * (1 - S.dna);
      const dv = S.dna, uz = S.unzip;
      dna.visible = dv > 0.01;
      dna.position.copy(cells[0].g.position).multiplyScalar(1 - seg(dv, 0, 1));
      dna.scale.setScalar(Math.max(0.001, seg(dv, 0, 1)));
      const spin = t * 0.6 * (1 - uz);
      for (let i = 0; i < RN; i++) {
        const y = -H / 2 + (i / (RN - 1)) * H, a = i * 0.5 + spin, rr = 0.75;
        const A = new THREE.Vector3(Math.cos(a) * rr, y, Math.sin(a) * rr), B = new THREE.Vector3(-Math.cos(a) * rr, y, -Math.sin(a) * rr);
        /* Anak tangga lepas → batang grafik berdiri berjajar. */
        const e = seg(uz, (i / RN) * 0.5, (i / RN) * 0.5 + 0.5);
        const bx = -3.9 + i * 0.2, bh = bars[i] * 2.2, base = -2.2;
        const a2 = new THREE.Vector3(bx, base, 0), b2 = new THREE.Vector3(bx, base + bh, 0);
        A.lerp(a2, e); B.lerp(b2, e);
        dm.position.copy(A); dm.scale.setScalar(1 - e * 0.5); dm.rotation.set(0, 0, 0); dm.updateMatrix(); sA.setMatrixAt(i * 2, dm.matrix);
        dm.position.copy(B); dm.updateMatrix(); sA.setMatrixAt(i * 2 + 1, dm.matrix);
        dir.subVectors(B, A); const len = dir.length(); q.setFromUnitVectors(up, dir.normalize());
        dm.position.copy(A).add(B).multiplyScalar(0.5); dm.quaternion.copy(q); dm.scale.set(1 + e * 2.5, len, 1 + e * 2.5); dm.updateMatrix(); rungs.setMatrixAt(i, dm.matrix); dm.quaternion.identity();
      }
      sA.instanceMatrix.needsUpdate = true; rungs.instanceMatrix.needsUpdate = true;
      dna.rotation.z = lerp(0.35, 0, uz);
    },
  };
}`;

/** 17. Pintu berdiri sendirian di gurun → pintu terbuka, cahaya keluar → kamera melangkah masuk → dunia berganti jadi hutan → kunang-kunang. */
export const SCENE_PINTU = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, mat, seg, lerp, glow, rnd, hemi, key } = ctx;
  /* Langit hutan: berubah jadi senja saat kunang-kunang keluar. */
  const skyDay = new THREE.Color("#e9e2c8"), skyNight = new THREE.Color("#101c2c"), fogDay = new THREE.Color(COL.bg);
  const sky = new THREE.Color();
  /* Gurun */
  const desert = new THREE.Group(); scene.add(desert);
  const DG = new THREE.PlaneGeometry(80, 80, 90, 90); DG.rotateX(-Math.PI / 2);
  const dp = DG.attributes.position;
  for (let i = 0; i < dp.count; i++) { const x = dp.getX(i), z = dp.getZ(i); const r = Math.hypot(x, z); dp.setY(i, (Math.sin(x * 0.18 + Math.sin(z * 0.1) * 2) * 1.2 + Math.sin(z * 0.27) * 0.6) * Math.min(1, Math.max(0, (r - 4) / 8))); }
  DG.computeVertexNormals();
  desert.add(new THREE.Mesh(DG, mat("#e2b77c", { roughness: 1, flatShading: true })));
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#fff1c4", transparent: true, depthWrite: false })); sun.position.set(-14, 9, -30); sun.scale.setScalar(16); desert.add(sun);
  [[-6, -9], [7, -12], [-10, 4]].forEach((p, i) => { const c = new THREE.Group(); const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.28, 1.6, 4, 8), mat("#5f8f4e")); b.position.y = 1; c.add(b); const a = new THREE.Mesh(new THREE.CapsuleGeometry(0.18, 0.6, 4, 8), mat("#5f8f4e")); a.position.set(0.4, 1.3, 0); a.rotation.z = -0.6; c.add(a); c.position.set(p[0], 0, p[1]); desert.add(c); });
  /* Hutan */
  const forest = new THREE.Group(); scene.add(forest);
  const FG = new THREE.CircleGeometry(60, 64); FG.rotateX(-Math.PI / 2);
  forest.add(new THREE.Mesh(FG, mat("#4f7d3a", { roughness: 1 })));
  const TN = 140, trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.12, 0.2, 2.4, 6), mat("#6b4a2f"), TN), crowns = new THREE.InstancedMesh(new THREE.ConeGeometry(1.1, 3.2, 7), mat("#2f6b3f", { flatShading: true }), TN);
  const dm = new THREE.Object3D(), tc = new THREE.Color();
  for (let i = 0; i < TN; i++) {
    let x, z; do { x = (rnd() - 0.5) * 70; z = (rnd() - 0.5) * 70; } while (Math.abs(x) < 3.2 && z > -14 && z < 12);
    const s = 0.7 + rnd() * 1.1;
    dm.position.set(x, 1.2 * s, z); dm.scale.setScalar(s); dm.rotation.set(0, rnd() * 6, 0); dm.updateMatrix(); trunks.setMatrixAt(i, dm.matrix);
    dm.position.y = 3.6 * s; dm.updateMatrix(); crowns.setMatrixAt(i, dm.matrix);
    tc.set("#2f6b3f").offsetHSL(rnd() * 0.06 - 0.03, 0, rnd() * 0.12 - 0.06); crowns.setColorAt(i, tc);
  }
  forest.add(trunks, crowns);
  const river = new THREE.Mesh(new THREE.PlaneGeometry(3, 80), mat("#3d7f95", { roughness: 0.35 })); river.rotation.x = -Math.PI / 2; river.rotation.z = 0.25; river.position.set(7, 0.02, 0); forest.add(river);
  const FN = 160, fp = new Float32Array(FN * 3), fd = [];
  for (let i = 0; i < FN; i++) fd.push([(rnd() - 0.5) * 30, 0.5 + rnd() * 3, (rnd() - 0.5) * 30, rnd() * 6]);
  const flies = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(fp, 3)), new THREE.PointsMaterial({ size: 0.45, map: glow(), color: "#fff6b0", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  forest.add(flies);
  /* Pintu: kusen + daun pintu berengsel + gagang; cahaya di ambangnya. */
  const doorG = new THREE.Group(); scene.add(doorG);
  const wood = mat(COL.obj, { roughness: 0.7 });
  [[-0.78, 1.25, 0.14, 2.6], [0.78, 1.25, 0.14, 2.6]].forEach((p) => { const m = new THREE.Mesh(new THREE.BoxGeometry(p[2], p[3], 0.3), wood); m.position.set(p[0], p[1], 0); doorG.add(m); });
  const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.16, 0.3), wood); lintel.position.y = 2.62; doorG.add(lintel);
  const light = new THREE.Mesh(new THREE.PlaneGeometry(1.42, 2.5), new THREE.MeshBasicMaterial({ color: "#fff8e6", transparent: true, opacity: 0 })); light.position.set(0, 1.25, -0.02); doorG.add(light);
  const hinge = new THREE.Group(); hinge.position.set(-0.71, 0, 0.1); doorG.add(hinge);
  const leaf = new THREE.Mesh(new THREE.BoxGeometry(1.42, 2.5, 0.08), mat(COL.accent, { roughness: 0.6 })); leaf.position.set(0.71, 1.25, 0); hinge.add(leaf);
  [0.6, 1.9].forEach((y) => { const p = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.8, 0.02), mat(COL.accent, { roughness: 0.5 })); p.position.set(0.71, y, 0.05); p.scale.y = y > 1 ? 1.1 : 0.9; hinge.add(p); });
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), mat("#e0b85c", { metalness: 0.7, roughness: 0.3 })); knob.position.set(1.25, 1.2, 0.08); hinge.add(knob);
  const beam = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(), color: "#fff2cc", transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); beam.position.set(0, 1.3, 0.6); beam.scale.set(5, 6, 1); doorG.add(beam);
  return {
    update(S, t) {
      const o = seg(S.open, 0, 1);
      hinge.rotation.y = -o * 1.75;
      light.material.opacity = Math.min(1, o * 1.6) * (1 - S.world);
      beam.material.opacity = o * 0.85 * (1 - S.world);
      const w = S.world;
      desert.visible = w < 0.5; forest.visible = w >= 0.5;
      for (let i = 0; i < FN; i++) { const d = fd[i]; fp[i * 3] = d[0] + Math.sin(t * 0.5 + d[3]) * 0.6; fp[i * 3 + 1] = d[1] + Math.sin(t * 0.8 + d[3] * 2) * 0.3; fp[i * 3 + 2] = d[2] + Math.cos(t * 0.4 + d[3]) * 0.6; }
      flies.geometry.attributes.position.needsUpdate = true; flies.material.opacity = S.flies * (0.6 + 0.4 * Math.sin(t * 3));
      const n = w >= 0.5 ? Math.min(1, S.flies * 1.15) : 0;
      sky.copy(skyDay).lerp(skyNight, n); scene.background = w >= 0.5 ? sky : null; scene.fog.color.copy(fogDay).lerp(skyNight, n);
      hemi.intensity = 1.1 * (1 - n * 0.6); key.intensity = 2.3 * (1 - n * 0.75);
    },
  };
}`;
