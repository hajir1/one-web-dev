/* ================================================================== */
/* Adegan 3D Cerita Scroll (v22), bagian A. Setiap adegan adalah         */
/* function scene(ctx) yang membangun objek lalu mengembalikan           */
/* { update(S, t, dt) }. S = keadaan cerita dari KEYS (di-scrub OWD Scrub).    */
/* ================================================================== */

/** 1. Komputer kosong → zoom ke layar → teks keluar dari layar → layar berisi situs. */
export const SCENE_KOMPUTER = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, BRAND, paint, mat, seg, lerp } = ctx;
  const g = new THREE.Group(); scene.add(g);
  const desk = new THREE.Mesh(new THREE.BoxGeometry(10, 0.22, 4.6), mat(COL.obj2, { roughness: 0.85 }));
  desk.position.set(0, -1.62, 0.4); g.add(desk);
  const body = mat(COL.obj, { roughness: 0.35, metalness: 0.25 });
  const bez = new THREE.Mesh(new THREE.BoxGeometry(4.3, 2.65, 0.16), body); bez.position.set(0, 0.35, 0); g.add(bez);
  const back = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.6, 0.35), body); back.position.set(0, 0.35, -0.22); g.add(back);
  const neck = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.2, 0.16), body); neck.position.set(0, -0.9, -0.28); g.add(neck);
  const foot = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.07, 1.1), body); foot.position.set(0, -1.48, -0.1); g.add(foot);
  const scr = paint(1024, 600);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.35), new THREE.MeshBasicMaterial({ map: scr.tex, toneMapped: false }));
  screen.position.set(0, 0.35, 0.085); g.add(screen);
  /* Papan ketik: badan + 56 tombol (instanced). */
  const kb = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.09, 1.05), mat(COL.obj, { roughness: 0.4 })); kb.position.set(0, -1.46, 1.45); g.add(kb);
  const keys = new THREE.InstancedMesh(new THREE.BoxGeometry(0.17, 0.06, 0.17), mat("#e9e9ef", { roughness: 0.6 }), 56);
  const m4 = new THREE.Matrix4(); let n = 0;
  for (let r = 0; r < 4; r++) for (let c = 0; c < 14; c++) { m4.makeTranslation(-1.36 + c * 0.21, -1.39, 1.1 + r * 0.23); keys.setMatrixAt(n++, m4); }
  g.add(keys);
  /* Cangkir & tanaman: membuat meja terasa hidup. */
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.55, 24, 1, true), mat(COL.accent, { side: THREE.DoubleSide })); cup.position.set(3.2, -1.23, 1.0); g.add(cup);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.04, 8, 16), mat(COL.accent)); handle.position.set(3.5, -1.2, 1.0); g.add(handle);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.26, 0.6, 18), mat(COL.accent2)); pot.position.set(-3.3, -1.2, 0.6); g.add(pot);
  const leafMat = mat("#3f9d6a", { flatShading: true });
  for (let i = 0; i < 7; i++) { const l = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.1, 5), leafMat); const a = i / 7 * Math.PI * 2; l.position.set(-3.3 + Math.cos(a) * 0.12, -0.5, 0.6 + Math.sin(a) * 0.12); l.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45); g.add(l); }
  const glowLight = new THREE.PointLight(COL.accent, 0, 9, 1.6); glowLight.position.set(0, 0.4, 1.4); g.add(glowLight);

  const lines = CONFIG.layarBaris || [];
  const total = lines.reduce((a, l) => a + l.length + 1, 0);
  let lastSig = "";
  function draw(g2, W, H, S, t) {
    const boot = S.boot, ui = S.ui, end = S.end;
    g2.fillStyle = "#07080d"; g2.fillRect(0, 0, W, H);
    if (boot < 0.02) { const r = g2.createLinearGradient(0, 0, W, H); r.addColorStop(0, "rgba(255,255,255,.07)"); r.addColorStop(0.5, "rgba(255,255,255,0)"); g2.fillStyle = r; g2.fillRect(0, 0, W, H); return; }
    g2.globalAlpha = boot; g2.fillStyle = COL.veil; g2.fillRect(0, 0, W, H);
    /* Mode teks: baris diketik. */
    const ta = 1 - ui;
    if (ta > 0.01) {
      g2.globalAlpha = boot * ta;
      g2.font = "600 38px ui-monospace, Menlo, Consolas, monospace"; g2.textBaseline = "top";
      let left = Math.round(S.type * total), y = 70;
      lines.forEach((l, i) => {
        if (left <= 0) return;
        const part = l.slice(0, left); left -= l.length + 1;
        g2.fillStyle = COL.accent; g2.fillText(">", 60, y);
        g2.fillStyle = i === lines.length - 1 ? COL.accent2 : "#e8ecff"; g2.fillText(part, 100, y);
        if (left <= 0 && Math.floor(t * 2) % 2 === 0) { g2.fillStyle = COL.accent; g2.fillRect(104 + g2.measureText(part).width, y, 20, 40); }
        y += 64;
      });
      if (S.type < 0.01 && Math.floor(t * 2) % 2 === 0) { g2.fillStyle = COL.accent; g2.fillRect(60, 70, 20, 40); }
    }
    /* Mode situs: tampilan situs yang dibangun. */
    if (ui > 0.01) {
      g2.globalAlpha = boot * ui * (1 - end);
      g2.fillStyle = "rgba(255,255,255,.06)"; g2.fillRect(0, 0, W, 70);
      g2.fillStyle = COL.accent; g2.beginPath(); g2.arc(48, 35, 14, 0, 7); g2.fill();
      g2.fillStyle = "#fff"; g2.font = "700 26px system-ui, sans-serif"; g2.textBaseline = "middle"; g2.fillText(BRAND, 74, 36);
      [0, 1, 2].forEach((i) => { g2.fillStyle = "rgba(255,255,255,.35)"; g2.fillRect(W - 360 + i * 110, 30, 80, 10); });
      g2.fillStyle = "#fff"; g2.font = "800 64px system-ui, sans-serif"; g2.textBaseline = "alphabetic"; g2.fillText(CONFIG.judulSitus || BRAND, 60, 190);
      g2.fillStyle = "rgba(255,255,255,.55)"; g2.fillRect(60, 220, 520, 14); g2.fillRect(60, 246, 420, 14);
      g2.fillStyle = COL.accent; g2.fillRect(60, 280, 180, 52);
      for (let i = 0; i < 3; i++) { const x = 60 + i * 310, k = 0.5 + 0.5 * Math.sin(t * 0.9 + i * 1.7); g2.fillStyle = "rgba(255,255,255,.07)"; g2.fillRect(x, 370, 280, 180); g2.fillStyle = i === 1 ? COL.accent2 : COL.accent; g2.fillRect(x + 20, 510, 120 + 120 * k, 14); g2.fillStyle = "rgba(255,255,255,.5)"; g2.fillRect(x + 20, 400, 160, 16); }
    }
    if (end > 0.01) {
      g2.globalAlpha = boot * end; g2.textAlign = "center"; g2.textBaseline = "middle";
      g2.fillStyle = "#fff"; g2.font = "800 96px system-ui, sans-serif"; g2.fillText(CONFIG.layarAkhir || BRAND, W / 2, H / 2 - 20);
      g2.fillStyle = COL.accent; g2.font = "600 34px system-ui, sans-serif"; g2.fillText(CONFIG.layarAkhirSub || "", W / 2, H / 2 + 60);
      g2.textAlign = "left";
    }
    g2.globalAlpha = 1;
  }
  return {
    update(S, t) {
      const sig = [S.boot, S.type, S.ui, S.end].map((v) => v.toFixed(3)).join() + (Math.floor(t * 2) % 2) + (S.ui > 0.01 ? Math.floor(t * 12) : 0);
      if (sig !== lastSig) { lastSig = sig; scr.draw((g2, W, H) => draw(g2, W, H, S, t)); }
      glowLight.intensity = S.boot * 6;
      g.rotation.y = Math.sin(t * 0.25) * 0.03 * (1 - S.veil);
    },
  };
}`;

/** 2. Kucing → zoom ke mata → pupil melebar → semesta di dalam mata → rasi jejak kaki. */
export const SCENE_KUCING = String.raw`
function scene(ctx) {
  const { THREE, scene, COL, CONFIG, paint, mat, glow, seg, lerp, rnd } = ctx;
  const cat = new THREE.Group(); scene.add(cat);
  const fur = mat(COL.obj, { flatShading: true, roughness: 0.8 }), belly = mat(COL.obj2, { flatShading: true, roughness: 0.85 }), pink = mat("#f3a3b5", { flatShading: true });
  const body = new THREE.Mesh(new THREE.SphereGeometry(1, 14, 10), fur); body.scale.set(1.15, 1.25, 1); body.position.y = -0.75; cat.add(body);
  const chest = new THREE.Mesh(new THREE.SphereGeometry(0.62, 12, 8), belly); chest.scale.set(1, 1.3, 0.6); chest.position.set(0, -0.6, 0.62); cat.add(chest);
  const head = new THREE.Group(); head.position.set(0, 0.95, 0.25); cat.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.85, 16, 12), fur); skull.scale.set(1.15, 0.95, 1); head.add(skull);
  const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), belly); muzzle.scale.set(1.25, 0.8, 0.8); muzzle.position.set(0, -0.28, 0.66); head.add(muzzle);
  [-1, 1].forEach((sx) => {
    const ear = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.62, 4), fur); ear.position.set(sx * 0.52, 0.78, 0); ear.rotation.z = -sx * 0.38; head.add(ear);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.4, 4), pink); inner.position.set(sx * 0.5, 0.72, 0.1); inner.rotation.z = -sx * 0.38; head.add(inner);
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), belly); paw.scale.set(1, 0.7, 1.3); paw.position.set(sx * 0.45, -1.95, 0.75); cat.add(paw);
  });
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.08, 3), pink); nose.rotation.x = Math.PI; nose.position.set(0, -0.14, 0.92); head.add(nose);
  const wpos = [];
  [-1, 1].forEach((sx) => [-0.06, 0, 0.06].forEach((dy) => wpos.push(sx * 0.2, -0.22, 0.9, sx * 0.95, -0.2 + dy * 3, 0.72)));
  const wg = new THREE.BufferGeometry(); wg.setAttribute("position", new THREE.Float32BufferAttribute(wpos, 3));
  head.add(new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7 })));
  /* Ekor: tabung melengkung yang bergoyang. */
  const tailPivot = new THREE.Group(); tailPivot.position.set(0.7, -1.6, -0.6); cat.add(tailPivot);
  const tc = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.7, 0.1, -0.3), new THREE.Vector3(1.1, 0.8, -0.2), new THREE.Vector3(0.9, 1.6, 0.1)]);
  tailPivot.add(new THREE.Mesh(new THREE.TubeGeometry(tc, 24, 0.13, 8), fur));
  /* Mata: iris digambar di kanvas (pupil mengikuti S.pupil), kubah mengilap di atasnya. */
  const irisTex = paint(256, 256);
  const eyes = [];
  [-1, 1].forEach((sx) => {
    const e = new THREE.Group(); e.position.set(sx * 0.36, 0.1, 0.78); e.rotation.y = sx * 0.28; head.add(e);
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.2, 32), new THREE.MeshBasicMaterial({ map: irisTex.tex, toneMapped: false })); disc.position.z = 0.02; e.add(disc);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.205, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: "#ffffff", transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1, depthWrite: false })); dome.rotation.x = Math.PI / 2; dome.scale.z = 0.35; dome.position.z = 0.02; e.add(dome);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), fur); lid.position.z = 0.0; lid.scale.set(1, 0.001, 1); e.add(lid);
    eyes.push({ e, lid });
  });
  let lastPupil = -1;
  function drawIris(p) {
    irisTex.draw((g2, W, H) => {
      const r = g2.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W / 2);
      r.addColorStop(0, "#ffe36e"); r.addColorStop(0.55, COL.accent); r.addColorStop(0.95, "#5a3a0a"); r.addColorStop(1, "#1a1206");
      g2.fillStyle = r; g2.fillRect(0, 0, W, H);
      g2.strokeStyle = "rgba(90,50,0,.35)"; g2.lineWidth = 2;
      for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; g2.beginPath(); g2.moveTo(W / 2 + Math.cos(a) * 30, H / 2 + Math.sin(a) * 30); g2.lineTo(W / 2 + Math.cos(a) * 120, H / 2 + Math.sin(a) * 120); g2.stroke(); }
      const pw = lerp(14, 120, p), ph = lerp(100, 124, p);
      g2.fillStyle = "#020205"; g2.beginPath(); g2.ellipse(W / 2, H / 2, pw, ph, 0, 0, 7); g2.fill();
      if (p > 0.3) { for (let i = 0; i < 40 * p; i++) { const a = rnd() * 7, d = rnd() * pw * 0.8; g2.fillStyle = "rgba(200,220,255," + (0.3 + rnd() * 0.6) + ")"; g2.fillRect(W / 2 + Math.cos(a) * d, H / 2 + Math.sin(a) * d * 0.9, 2, 2); } }
      g2.fillStyle = "rgba(255,255,255,.85)"; g2.beginPath(); g2.ellipse(W * 0.38, H * 0.32, 18, 12, -0.5, 0, 7); g2.fill();
    });
  }
  /* Semesta di dalam mata kiri: galaksi spiral (titik) yang mengembang. */
  const space = new THREE.Group(); scene.add(space);
  const N = 4200, pos = new Float32Array(N * 3), col = new Float32Array(N * 3);
  const ca = new THREE.Color(COL.accent), cb = new THREE.Color(COL.accent2), cw = new THREE.Color("#ffffff");
  for (let i = 0; i < N; i++) {
    const arm = i % 3, d = Math.pow(rnd(), 0.6) * 14, a = arm / 3 * Math.PI * 2 + d * 0.38 + (rnd() - 0.5) * 0.5;
    pos[i * 3] = Math.cos(a) * d + (rnd() - 0.5) * 0.8; pos[i * 3 + 1] = (rnd() - 0.5) * (1.2 - d * 0.05); pos[i * 3 + 2] = Math.sin(a) * d + (rnd() - 0.5) * 0.8;
    const c = d < 3 ? cw : (i % 2 ? ca : cb); col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  const sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.BufferAttribute(pos, 3)); sg.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const stars = new THREE.Points(sg, new THREE.PointsMaterial({ size: 0.22, map: glow(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  space.add(stars);
  /* Rasi bintang jejak kaki: telapak + 4 jari, garis tergambar bertahap. */
  const paw = [], ring = (cx, cy, rx, ry, k) => { for (let i = 0; i <= k; i++) { const a = i / k * Math.PI * 2; paw.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } };
  ring(0, -1.2, 2.2, 1.7, 9); ring(-2.9, 1.6, 0.8, 1.05, 6); ring(-1.0, 2.9, 0.8, 1.05, 6); ring(1.0, 2.9, 0.8, 1.05, 6); ring(2.9, 1.6, 0.8, 1.05, 6);
  const lp = []; for (let i = 0; i < paw.length - 1; i++) { if ([10, 17, 24, 31].indexOf(i + 1) >= 0) continue; lp.push(paw[i][0], paw[i][1], 0, paw[i + 1][0], paw[i + 1][1], 0); }
  const lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(lp, 3));
  const constel = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: COL.accent2, transparent: true, opacity: 0.9, fog: false }));
  const nodes = new THREE.Points(new THREE.BufferGeometry().setAttribute("position", new THREE.Float32BufferAttribute(paw.flatMap((p) => [p[0], p[1], 0]), 3)), new THREE.PointsMaterial({ size: 0.5, map: glow(), color: "#ffffff", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
  const cg = new THREE.Group(); cg.add(constel, nodes); cg.position.set(0, 3, -2); space.add(cg);
  const eyeWorld = new THREE.Vector3();
  const segs = lp.length / 6;
  return {
    update(S, t) {
      const p = Math.round(S.pupil * 40) / 40;
      if (p !== lastPupil) { lastPupil = p; drawIris(p); }
      head.rotation.y = Math.sin(t * 0.4) * 0.12 * (1 - S.pupil); head.rotation.z = Math.sin(t * 0.3) * 0.05 * (1 - S.pupil);
      tailPivot.rotation.z = Math.sin(t * 1.3) * 0.25; tailPivot.rotation.y = Math.sin(t * 0.7) * 0.2;
      /* Kedip sesekali (kecuali sedang di-zoom). */
      const bl = S.pupil < 0.1 ? Math.max(0, 1 - Math.abs(((t % 4.2) - 4.0) / 0.12)) : 0;
      eyes.forEach((o) => { o.lid.scale.y = 0.001 + bl * 0.9; o.lid.rotation.x = -Math.PI / 2 + bl * 0.4; });
      cat.visible = S.space < 0.35;
      eyes[0].e.getWorldPosition(eyeWorld);
      space.position.copy(eyeWorld);
      const k = Math.max(0.001, S.space);
      space.scale.setScalar(k);
      space.visible = S.space > 0.001;
      stars.rotation.y = t * 0.03;
      stars.material.opacity = Math.min(1, S.space * 2);
      cg.visible = S.paw > 0.001;
      constel.geometry.setDrawRange(0, Math.floor(segs * S.paw) * 2);
      nodes.material.opacity = S.paw;
      cg.rotation.y = Math.sin(t * 0.3) * 0.15;
      scene.fog.far = lerp(60, 400, S.space);
    },
  };
}`;
