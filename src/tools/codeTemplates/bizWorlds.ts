/* ================================================================== */
/* Storyboard per template untuk website 3D bisnis (v27.1).            */
/*                                                                    */
/* Sebelumnya ke-40 template memakai adegan yang sama: urai → lorong   */
/* cincin → partikel nama, dengan latar bentuk acak yang sama pula.     */
/* Sekarang setiap template punya:                                     */
/*   - DUNIA sendiri saat kamera masuk ke objek (12 jenis, paling banyak */
/*     4 template per jenis, dipilih sesuai bidang usahanya);           */
/*   - URUTAN ADEGAN sendiri (8 rencana) dari 5 adegan: urai (exp),     */
/*     orbit (orb), lapisan berpilin (lay), menyelam (dive), dan        */
/*     partikel nama (dis), dengan bagian menyelam yang berpindah-pindah;*/
/*   - bentuk melayang di latar yang sesuai dunianya.                    */
/* ================================================================== */

export type WorldKind = "tunnel" | "rise" | "hex" | "grid" | "warp" | "weave" | "frames" | "helix" | "rain" | "waves" | "blocks" | "bloom";
export type Beat = "exp" | "orb" | "lay" | "dive" | "dis";

/** Rencana urutan adegan: bagian → adegan. Setiap rencana punya tepat satu "menyelam". */
const PLANS: Record<string, Partial<Record<string, Beat>>> = {
  P1: { keunggulan: "exp", testimoni: "dive", kontak: "dis" },
  P2: { keunggulan: "orb", alur: "lay", testimoni: "dive", kontak: "dis" },
  P3: { alur: "orb", testimoni: "dive", faq: "exp", kontak: "lay" },
  P4: { keunggulan: "lay", alur: "dive", faq: "orb", kontak: "dis" },
  P5: { keunggulan: "dis", alur: "exp", testimoni: "dive", faq: "orb" },
  P6: { alur: "lay", testimoni: "orb", faq: "dive", kontak: "exp" },
  P7: { keunggulan: "orb", alur: "exp", testimoni: "dive", faq: "lay", kontak: "dis" },
  P8: { keunggulan: "exp", alur: "orb", faq: "dive", kontak: "dis" },
};

/** Model 3D → [dunia, rencana adegan, variasi dunia]. */
export const STORYBOARD: Record<string, [WorldKind, keyof typeof PLANS, string?]> = {
  cup: ["rise", "P1", "steam"], bowl: ["rise", "P3", "steam"], carwash: ["rise", "P5", "foam"],
  honey: ["hex", "P2"], helmet: ["hex", "P7"],
  phone: ["grid", "P4"], laptop: ["grid", "P6"], gamepad: ["grid", "P2"], lock: ["grid", "P8"],
  rocket: ["warp", "P3"], atom: ["warp", "P1"], suitcase: ["warp", "P7"],
  cloth: ["weave", "P6"], knot: ["weave", "P4"], bed: ["weave", "P8"],
  camera: ["frames", "P5"], glasses: ["frames", "P2"], museum: ["frames", "P1"], clapper: ["frames", "P3"],
  pill: ["helix", "P7"], tooth: ["helix", "P4"], dumbbell: ["helix", "P6"], energy: ["helix", "P5"],
  cake: ["rain", "P8", "sprinkle"], coins: ["rain", "P1", "coin"], petbowl: ["rain", "P3", "kibble"],
  vinyl: ["waves", "P2"], mic: ["waves", "P5"], vase: ["waves", "P4"], boat: ["waves", "P6"],
  house: ["blocks", "P3"], books: ["blocks", "P7"], edu: ["blocks", "P1"], desk: ["blocks", "P8"],
  bouquet: ["bloom", "P4"], perfume: ["bloom", "P6"],
  car: ["tunnel", "P5"], truck: ["tunnel", "P2"], chair: ["tunnel", "P8"], parcel: ["tunnel", "P7"],
};

export const WORLD_LABEL: Record<WorldKind, string> = {
  tunnel: "lorong cincin & garis jalan", rise: "uap & gelembung yang naik", hex: "sarang segi enam", grid: "lantai data digital",
  warp: "lompatan bintang", weave: "anyaman benang lungsin-pakan", frames: "bingkai rana & pita film", helix: "pilinan heliks",
  rain: "hujan butiran", waves: "riak gelombang & equalizer", blocks: "kota balok", bloom: "kelopak mekar berpusar",
};
export const BEAT_LABEL: Record<Beat, string> = { exp: "urai", orb: "orbit", lay: "lapisan berpilin", dive: "menyelam", dis: "partikel nama" };

export function storyboardOf(model: string): { world: WorldKind; plan: Partial<Record<string, Beat>>; variant: string } {
  const sb = STORYBOARD[model];
  if (!sb) throw new Error(`model ${model}: storyboard belum ada`);
  return { world: sb[0], plan: PLANS[sb[1]], variant: sb[2] ?? "" };
}

/** Kanal cerita satu bagian. */
export function storyChannels(model: string, sec: string) {
  const b = storyboardOf(model).plan[sec];
  return { bld: sec === "beranda" ? 0 : 1, exp: b === "exp" ? 1 : 0, orb: b === "orb" ? 1 : 0, lay: b === "lay" ? 1 : 0, dive: b === "dive" ? 1 : 0, dis: b === "dis" ? 1 : 0, beat: !!b };
}

/** Ringkasan storyboard (untuk komentar di berkas & laporan). */
export function storyboardText(model: string): string {
  const { world, plan } = storyboardOf(model);
  return `${Object.entries(plan).map(([k, b]) => `${k}: ${BEAT_LABEL[b!]}`).join(" → ")} | dunia: ${WORLD_LABEL[world]}`;
}

/* ------------------------------------------------------------------ */
/* Bentuk melayang di latar (ekspresi JS: array geometri).              */
/* ------------------------------------------------------------------ */
export const FLOATERS: Record<WorldKind, string> = {
  tunnel: `[new THREE.IcosahedronGeometry(0.16, 0), new THREE.TorusGeometry(0.14, 0.05, 10, 24), new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.SphereGeometry(0.11, 16, 12)]`,
  rise: `[new THREE.SphereGeometry(0.12, 16, 12), new THREE.SphereGeometry(0.07, 12, 10), new THREE.SphereGeometry(0.17, 16, 12), new THREE.TorusGeometry(0.12, 0.025, 8, 24)]`,
  hex: `[new THREE.CylinderGeometry(0.17, 0.17, 0.07, 6), new THREE.CylinderGeometry(0.11, 0.11, 0.18, 6), new THREE.TorusGeometry(0.15, 0.03, 4, 6), new THREE.SphereGeometry(0.08, 12, 10)]`,
  grid: `[new THREE.BoxGeometry(0.3, 0.04, 0.22), new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.BoxGeometry(0.34, 0.02, 0.02), new THREE.OctahedronGeometry(0.1, 0)]`,
  warp: `[new THREE.OctahedronGeometry(0.15, 0), new THREE.TetrahedronGeometry(0.16, 0), new THREE.IcosahedronGeometry(0.09, 0), new THREE.TorusGeometry(0.16, 0.015, 6, 32)]`,
  weave: `[new THREE.CylinderGeometry(0.018, 0.018, 0.6, 6), new THREE.TorusGeometry(0.13, 0.02, 6, 28), new THREE.CylinderGeometry(0.018, 0.018, 0.4, 6), new THREE.TorusKnotGeometry(0.09, 0.022, 40, 6)]`,
  frames: `[new THREE.TorusGeometry(0.16, 0.022, 4, 4), new THREE.BoxGeometry(0.22, 0.16, 0.02), new THREE.CircleGeometry(0.12, 6), new THREE.TorusGeometry(0.11, 0.02, 4, 4)]`,
  helix: `[new THREE.CapsuleGeometry(0.06, 0.18, 4, 10), new THREE.SphereGeometry(0.09, 14, 10), new THREE.CapsuleGeometry(0.045, 0.12, 4, 8), new THREE.TorusGeometry(0.1, 0.03, 8, 20)]`,
  rain: `[new THREE.CylinderGeometry(0.14, 0.14, 0.035, 20), new THREE.BoxGeometry(0.06, 0.2, 0.06), new THREE.SphereGeometry(0.08, 12, 8), new THREE.CylinderGeometry(0.1, 0.1, 0.03, 16)]`,
  waves: `[new THREE.TorusGeometry(0.15, 0.018, 6, 40), new THREE.TorusGeometry(0.09, 0.018, 6, 32), new THREE.BoxGeometry(0.04, 0.3, 0.04), new THREE.SphereGeometry(0.07, 12, 8)]`,
  blocks: `[new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.BoxGeometry(0.28, 0.12, 0.16), new THREE.BoxGeometry(0.12, 0.3, 0.12), new THREE.BoxGeometry(0.16, 0.16, 0.16)]`,
  bloom: `[new THREE.SphereGeometry(0.16, 14, 10).scale(1, 0.25, 0.55), new THREE.SphereGeometry(0.12, 14, 10).scale(1, 0.25, 0.5), new THREE.SphereGeometry(0.07, 12, 8), new THREE.SphereGeometry(0.14, 14, 10).scale(0.5, 0.25, 1)]`,
};

/* ------------------------------------------------------------------ */
/* Dunia di dalam objek. Badan fungsi buildWorld(W); harus mengembalikan  */
/* { tick(dt, t) }. Alat bantu di W (lihat STORY_ENGINE):                */
/*   THREE, K, COL, world, ink, rnd, wmat(warna, o), wstd(warna, o),    */
/*   wpts(Float32Array, ukuran, warna, o), wline(warna, o), stream(...),  */
/*   loop(obj, kecepatan, dt, jarak, batas).                            */
/* ------------------------------------------------------------------ */
export const WORLDS: Record<WorldKind, string> = {
  /* Lorong cincin + garis jalan putus-putus (kendaraan, kiriman, perjalanan kayu). */
  tunnel: `
  const g = new THREE.TorusGeometry(2.1, 0.025, 6, 72), ms = [W.wmat(W.COL.accent), W.wmat(W.COL.accent2), W.wmat(W.ink, 0.45)];
  const rs = []; for (let i = 0; i < 20; i++) { const m = new THREE.Mesh(g, ms[i % 3]); m.position.z = 6 - i * 1.5; m.rotation.z = i * 0.4; m.scale.setScalar(1 + (i % 4) * 0.08); W.world.add(m); rs.push(m); }
  const dg = new THREE.BoxGeometry(0.06, 0.012, 0.6), dm = W.wmat(W.ink, 0.7), dash = [];
  for (let i = 0; i < 24; i++) { const d = new THREE.Mesh(dg, dm); d.position.set(0, -1.75, 6 - i * 1.25); W.world.add(d); dash.push(d); }
  const st = W.stream(700, 0.4, 1.6, 7, 0.07, W.COL.accent2);
  return { tick(dt) { rs.forEach((m, i) => { W.loop(m, 4, dt); m.rotation.z += dt * (i % 2 ? 0.3 : -0.2); }); dash.forEach((d) => W.loop(d, 9, dt)); st(dt); } };`,

  /* Uap & gelembung naik pelan (kopi, sup, busa cuci). */
  rise: `
  const N = 520, a = new Float32Array(N * 3), sp = new Float32Array(N), ph = new Float32Array(N);
  for (let i = 0; i < N; i++) { const an = W.rnd() * Math.PI * 2, r = 0.3 + W.rnd() * 3.6; a[i * 3] = Math.cos(an) * r; a[i * 3 + 1] = (W.rnd() - 0.5) * 9; a[i * 3 + 2] = 2 - W.rnd() * 16; sp[i] = 0.3 + W.rnd() * 0.9; ph[i] = W.rnd() * 6.3; }
  const foam = W.variant === "foam";
  const p = W.wpts(a, foam ? 0.3 : 0.24, W.COL.accent2, 1);
  const big = []; for (let i = 0; i < 9; i++) { const s = W.K.spr(i % 2 ? W.COL.accent : W.ink, 2.4 + W.rnd() * 2.2, { to: W.world, p: [(W.rnd() - 0.5) * 7, (W.rnd() - 0.5) * 6, -3 - W.rnd() * 9] }); s.material.userData.o = foam ? 0.32 : 0.22; W.wm.push(s.material); big.push(s); }
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3.2, 0.03, 6, 90), W.wmat(W.COL.accent, 0.5)); ring.rotation.x = Math.PI / 2; ring.position.set(0, -2.4, -4); W.world.add(ring);
  return { tick(dt, t) {
    for (let i = 0; i < N; i++) { a[i * 3 + 1] += dt * sp[i]; a[i * 3] += Math.sin(t * 1.2 + ph[i]) * dt * 0.25; if (a[i * 3 + 1] > 4.5) a[i * 3 + 1] -= 9; }
    p.geometry.attributes.position.needsUpdate = true;
    big.forEach((s, i) => { s.position.y += dt * (0.25 + i * 0.03); if (s.position.y > 4) s.position.y -= 8; });
    ring.scale.setScalar(1 + Math.sin(t * 0.9) * 0.06);
  } };`,

  /* Sarang segi enam: cincin heksagon, dinding sarang di ujung, tetes madu turun. */
  hex: `
  const g = new THREE.TorusGeometry(2.25, 0.045, 4, 6), ms = [W.wmat(W.COL.accent), W.wmat(W.COL.accent2, 0.7)];
  const rs = []; for (let i = 0; i < 16; i++) { const m = new THREE.Mesh(g, ms[i % 2]); m.position.z = 6 - i * 1.8; m.rotation.z = Math.PI / 6 + (i % 2) * 0.12; W.world.add(m); rs.push(m); }
  const cell = new THREE.CircleGeometry(0.27, 6), cm = W.wmat(W.COL.accent, 0.38), wall = new THREE.Group();
  for (let r = -7; r <= 7; r++) for (let c = -9; c <= 9; c++) { const m = new THREE.Mesh(cell, cm); m.position.set(c * 0.52 + (r % 2 ? 0.26 : 0), r * 0.45, 0); m.rotation.z = Math.PI / 6; m.scale.setScalar(0.4 + W.rnd() * 0.6); wall.add(m); }
  wall.position.z = -20; W.world.add(wall);
  const N = 260, a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { a[i * 3] = (W.rnd() - 0.5) * 7; a[i * 3 + 1] = (W.rnd() - 0.5) * 8; a[i * 3 + 2] = 4 - W.rnd() * 20; }
  const d = W.wpts(a, 0.16, W.COL.accent2, 0.9);
  return { tick(dt, t) {
    rs.forEach((m) => W.loop(m, 3.2, dt, 28.8));
    wall.children.forEach((m, i) => m.scale.setScalar(0.55 + 0.35 * Math.sin(t * 1.6 + i * 0.37)));
    for (let i = 0; i < N; i++) { a[i * 3 + 1] -= dt * (0.4 + (i % 5) * 0.12); if (a[i * 3 + 1] < -4) a[i * 3 + 1] += 8; }
    d.geometry.attributes.position.needsUpdate = true;
  } };`,

  /* Lantai & langit-langit kisi digital, paket data melesat, garis pindai. */
  grid: `
  const mk = (y) => { const v = []; for (let x = -6; x <= 6; x += 1) v.push(x, y, 8, x, y, -30); for (let z = 8; z >= -30; z -= 1) v.push(-6, y, z, 6, y, z); const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(v, 3)); return new THREE.LineSegments(g, W.wline(W.COL.accent, 0.55)); };
  const grids = new THREE.Group(); grids.add(mk(-1.7), mk(1.7)); W.world.add(grids);
  const pg = new THREE.BoxGeometry(0.08, 0.04, 0.7), pm = [W.wmat(W.COL.accent2), W.wmat(W.ink, 0.8)], pk = [];
  for (let i = 0; i < 46; i++) { const m = new THREE.Mesh(pg, pm[i % 2]); m.position.set(Math.round((W.rnd() - 0.5) * 10), i % 2 ? 1.66 : -1.66, 8 - W.rnd() * 38); m.userData.v = 8 + W.rnd() * 10; W.world.add(m); pk.push(m); }
  const scan = new THREE.Mesh(new THREE.PlaneGeometry(12, 0.03), W.wmat(W.COL.accent2, 0.9)); scan.position.z = -3; W.world.add(scan);
  return { tick(dt, t) { grids.position.z = (t * 3) % 1; pk.forEach((m) => W.loop(m, m.userData.v, dt, 38)); scan.position.y = Math.sin(t * 1.4) * 1.6; } };`,

  /* Lompatan bintang: garis cahaya memanjang melesat ke arah kamera. */
  warp: `
  const N = 640, v = new Float32Array(N * 6);
  for (let i = 0; i < N; i++) { const an = W.rnd() * Math.PI * 2, r = 0.35 + Math.pow(W.rnd(), 0.6) * 5, z = 8 - W.rnd() * 40, L = 0.4 + W.rnd() * 1.6; v[i * 6] = v[i * 6 + 3] = Math.cos(an) * r; v[i * 6 + 1] = v[i * 6 + 4] = Math.sin(an) * r; v[i * 6 + 2] = z; v[i * 6 + 5] = z - L; }
  const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(v, 3));
  const lines = new THREE.LineSegments(g, W.wline(W.ink, 0.9)); lines.frustumCulled = false; W.world.add(lines);
  const tint = new THREE.LineSegments(g, W.wline(W.COL.accent, 0.6)); tint.scale.setScalar(1.35); tint.frustumCulled = false; W.world.add(tint);
  const halo = W.K.spr(W.COL.accent2, 9, { to: W.world, p: [0, 0, -26] }); halo.material.userData.o = 0.6; W.wm.push(halo.material);
  return { tick(dt, t) {
    for (let i = 0; i < N; i++) { v[i * 6 + 2] += dt * 18; v[i * 6 + 5] += dt * 18; if (v[i * 6 + 5] > 8) { v[i * 6 + 2] -= 40; v[i * 6 + 5] -= 40; } }
    g.attributes.position.needsUpdate = true; W.world.rotation.z = t * 0.12; tint.rotation.z = -t * 0.05;
  } };`,

  /* Anyaman: lapisan benang lungsin & pakan bergantian mendekat, titik malam menetes. */
  weave: `
  const th = new THREE.CylinderGeometry(0.014, 0.014, 11, 6), ms = [W.wmat(W.COL.accent, 0.7), W.wmat(W.COL.accent2, 0.6), W.wmat(W.ink, 0.35)], layers = [];
  for (let l = 0; l < 7; l++) {
    const L = new THREE.Group();
    for (let i = -5; i <= 5; i++) {
      const h = new THREE.Mesh(th, ms[(i + l + 6) % 3]); h.rotation.z = Math.PI / 2; h.position.set(0, i * 0.42, (i % 2 ? 0.05 : -0.05)); L.add(h);
      const w = new THREE.Mesh(th, ms[(i + l + 7) % 3]); w.position.set(i * 0.42, 0, (i % 2 ? -0.05 : 0.05)); L.add(w);
    }
    L.position.z = 2 - l * 4.2; L.rotation.z = l * 0.42; W.world.add(L); layers.push(L);
  }
  const N = 300, a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { a[i * 3] = (W.rnd() - 0.5) * 8; a[i * 3 + 1] = (W.rnd() - 0.5) * 6; a[i * 3 + 2] = 4 - W.rnd() * 26; }
  const dots = W.wpts(a, 0.12, W.COL.accent, 0.8);
  return { tick(dt, t) { layers.forEach((L, i) => { W.loop(L, 3.4, dt, 29.4, 2.4); L.rotation.z += dt * (i % 2 ? 0.08 : -0.06); }); dots.rotation.z = Math.sin(t * 0.3) * 0.4; } };`,

  /* Bingkai rana persegi + pita film berlubang di kiri-kanan, kilat blitz. */
  frames: `
  const g = new THREE.TorusGeometry(2.4, 0.035, 4, 4), ms = [W.wmat(W.ink, 0.75), W.wmat(W.COL.accent)], fr = [];
  for (let i = 0; i < 15; i++) { const m = new THREE.Mesh(g, ms[i % 2]); m.position.z = 6 - i * 2; m.rotation.z = Math.PI / 4; m.scale.set(1.25, 0.9, 1); W.world.add(m); fr.push(m); }
  const hole = new THREE.PlaneGeometry(0.16, 0.12), hm = W.wmat(W.COL.accent2, 0.9), holes = [];
  for (let i = 0; i < 64; i++) { const m = new THREE.Mesh(hole, hm); m.position.set(i % 2 ? 3.1 : -3.1, -1.9 + ((i >> 1) % 4) * 1.25, 6 - (i >> 3) * 4); W.world.add(m); holes.push(m); }
  const bl = new THREE.PlaneGeometry(1.5, 0.22), bm = W.wmat(W.COL.accent2, 0.55), iris = new THREE.Group();
  for (let i = 0; i < 6; i++) { const b = new THREE.Mesh(bl, bm); const an = i / 6 * Math.PI * 2; b.position.set(Math.cos(an) * 1.1, Math.sin(an) * 1.1, 0); b.rotation.z = an + 1.2; iris.add(b); }
  iris.position.z = -14; W.world.add(iris);
  const flash = W.K.spr(W.ink, 10, { to: W.world, p: [0, 0, -18] }); flash.material.userData.o = 0; W.wm.push(flash.material);
  return { tick(dt, t) {
    fr.forEach((m, i) => { W.loop(m, 3.6, dt, 30); m.rotation.z = Math.PI / 4 + Math.sin(t * 0.7 + i) * 0.08; });
    holes.forEach((m) => W.loop(m, 3.6, dt, 32));
    iris.rotation.z = t * 0.5; iris.scale.setScalar(0.8 + 0.35 * Math.sin(t * 1.3));
    const ph = (t % 3.2) / 3.2; flash.material.userData.o = ph < 0.08 ? (1 - ph / 0.08) * 0.7 : 0;
  } };`,

  /* Pilinan heliks: dua untai bola dengan anak tangga, berputar di sumbu mendatar. */
  helix: `
  const N = 110, a = new Float32Array(N * 3), b = new Float32Array(N * 3), rung = [];
  for (let i = 0; i < N; i++) { const x = -11 + i * 0.2, an = i * 0.32; a[i * 3] = x; a[i * 3 + 1] = Math.cos(an) * 1.25; a[i * 3 + 2] = Math.sin(an) * 1.25; b[i * 3] = x; b[i * 3 + 1] = -a[i * 3 + 1]; b[i * 3 + 2] = -a[i * 3 + 2]; if (i % 2 === 0) rung.push(x, a[i * 3 + 1], a[i * 3 + 2], x, b[i * 3 + 1], b[i * 3 + 2]); }
  const tilt = new THREE.Group(), h = new THREE.Group(); tilt.add(h); tilt.rotation.z = 0.32; tilt.position.z = -2.5; W.world.add(tilt);
  const pa = W.wpts(a, 0.46, W.COL.accent, 1), pb = W.wpts(b, 0.46, W.COL.accent2, 1); h.add(pa, pb);
  const rg = new THREE.BufferGeometry(); rg.setAttribute("position", new THREE.Float32BufferAttribute(rung, 3)); h.add(new THREE.LineSegments(rg, W.wline(W.ink, 0.4)));
  const st = W.stream(300, 2.4, 4.4, 4, 0.06, W.COL.accent);
  return { tick(dt, t) { h.rotation.x = t * 0.9; h.position.x = Math.sin(t * 0.3) * 0.6; st(dt); } };`,

  /* Hujan butiran berputar jatuh (meses & tepung, koin, kibble). */
  rain: `
  const kind = W.variant;
  const geo = kind === "coin" ? new THREE.CylinderGeometry(0.17, 0.17, 0.035, 22) : kind === "kibble" ? new THREE.TorusGeometry(0.09, 0.045, 8, 16) : new THREE.CapsuleGeometry(0.035, 0.16, 3, 6);
  const mats = [W.wstd(W.COL.accent, 1), W.wstd(W.COL.accent2, 1), W.wstd(kind === "coin" ? "#d9a520" : W.ink, 1)];
  const it = [];
  for (let i = 0; i < 150; i++) { const m = new THREE.Mesh(geo, mats[i % 3]); m.position.set((W.rnd() - 0.5) * 9, (W.rnd() - 0.5) * 10, 2 - W.rnd() * 12); m.rotation.set(W.rnd() * 6, W.rnd() * 6, 0); m.userData.v = 0.8 + W.rnd() * 1.4; m.userData.r = (W.rnd() - 0.5) * 4; W.world.add(m); it.push(m); }
  const N = 500, a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { a[i * 3] = (W.rnd() - 0.5) * 10; a[i * 3 + 1] = (W.rnd() - 0.5) * 10; a[i * 3 + 2] = 2 - W.rnd() * 14; }
  const dust = W.wpts(a, 0.06, W.ink, 0.7);
  const glow = W.K.spr(W.COL.accent, 8, { to: W.world, p: [0, 0, -12] }); glow.material.userData.o = 0.45; W.wm.push(glow.material);
  return { tick(dt) {
    it.forEach((m) => { m.position.y -= dt * m.userData.v; m.rotation.x += dt * m.userData.r; m.rotation.z += dt * m.userData.r * 0.6; if (m.position.y < -5) m.position.y += 10; });
    for (let i = 0; i < N; i++) { a[i * 3 + 1] -= dt * 0.35; if (a[i * 3 + 1] < -5) a[i * 3 + 1] += 10; } dust.geometry.attributes.position.needsUpdate = true;
  } };`,

  /* Riak gelombang di lantai miring + batang equalizer melingkar (musik, perahu, roda putar). */
  waves: `
  const floor = new THREE.Group(); floor.rotation.x = -1.2; floor.position.set(0, -1.3, -4); W.world.add(floor);
  const NR = 14, R = 7, rg = new THREE.TorusGeometry(1, 0.02, 4, 120), rings = [];
  for (let i = 0; i < NR; i++) { const m = new THREE.Mesh(rg, W.wmat(i % 2 ? W.COL.accent : W.COL.accent2, 0.9)); floor.add(m); rings.push(m); }
  const bg = new THREE.BoxGeometry(0.09, 1, 0.09), bm = [W.wmat(W.COL.accent, 0.8), W.wmat(W.ink, 0.5)], bars = [];
  for (let i = 0; i < 36; i++) { const an = i / 36 * Math.PI * 2, m = new THREE.Mesh(bg, bm[i % 2]); m.position.set(Math.cos(an) * 3.4, Math.sin(an) * 3.4, -7); m.rotation.z = an - Math.PI / 2; W.world.add(m); bars.push(m); }
  const core = W.K.spr(W.COL.accent2, 4, { to: W.world, p: [0, 0, -7] }); core.material.userData.o = 0.7; W.wm.push(core.material);
  return { tick(dt, t) {
    rings.forEach((m, i) => { const r = ((t * 0.9 + i / NR * R) % R) + 0.05; m.scale.setScalar(r); m.material.userData.o = 0.9 * (1 - r / R); });
    bars.forEach((m, i) => { const h = 0.25 + Math.abs(Math.sin(t * 3.1 + i * 0.7) * Math.cos(t * 1.3 + i * 0.21)) * 1.6; m.scale.y = h; });
    core.scale.setScalar(3.4 + Math.sin(t * 6) * 0.4);
  } };`,

  /* Kota balok: deret balok naik-turun di kiri-kanan lorong (rumah, buku, sekolah, meja kerja). */
  blocks: `
  const N = 520, mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(0.8, 1, 0.8), W.wstd("#ffffff", 1), N);
  const pos = [], dm = new THREE.Object3D(), cA = new THREE.Color(W.COL.accent), cB = new THREE.Color(W.COL.accent2), cC = new THREE.Color(W.COL.surface);
  for (let i = 0; i < N; i++) { let x; do { x = Math.round((W.rnd() - 0.5) * 13); } while (Math.abs(x) < 2); const top = i % 6 === 0; pos.push({ x, z: 2.5 - W.rnd() * 36, top, h: 0.3 + W.rnd() * 1.7, ph: W.rnd() * 6.3 }); mesh.setColorAt(i, [cA, cB, cC][i % 3]); }
  mesh.frustumCulled = false; W.world.add(mesh);
  const st = W.stream(240, 0.2, 1.4, 6, 0.08, W.COL.accent2);
  return { tick(dt, t) {
    for (let i = 0; i < N; i++) { const p = pos[i]; p.z += dt * 4.5; if (p.z > 2.5) p.z -= 36; const h = p.h * (0.75 + 0.25 * Math.sin(t * 1.5 + p.ph)); dm.position.set(p.x, p.top ? 2.4 - h / 2 + 1 : -2.4 + h / 2 - 1, p.z); dm.scale.set(1, h, 1); dm.updateMatrix(); mesh.setMatrixAt(i, dm.matrix); }
    mesh.instanceMatrix.needsUpdate = true; st(dt);
  } };`,

  /* Kelopak mekar berpusar keluar dari pusat (spiral sudut emas). */
  bloom: `
  const N = 220, geo = new THREE.SphereGeometry(0.22, 12, 8).scale(1, 0.22, 0.5), ms = [W.wstd(W.COL.accent, 1), W.wstd(W.COL.accent2, 1)];
  const meshes = ms.map((m) => { const im = new THREE.InstancedMesh(geo, m, N / 2); im.frustumCulled = false; W.world.add(im); return im; });
  const dm = new THREE.Object3D(), GA = 2.39996;
  const core = W.K.spr(W.ink, 3.5, { to: W.world, p: [0, 0, -6] }); core.material.userData.o = 0.6; W.wm.push(core.material);
  return { tick(dt, t) {
    for (let i = 0; i < N; i++) { const f = ((t * 0.07 + i / N) % 1), r = f * 5.2, an = i * GA + t * 0.25; dm.position.set(Math.cos(an) * r, Math.sin(an) * r, -6 + f * 6); dm.rotation.set(0.6, 0, an); dm.scale.setScalar(0.4 + f * 1.1); dm.updateMatrix(); meshes[i % 2].setMatrixAt(i >> 1, dm.matrix); }
    meshes.forEach((m) => (m.instanceMatrix.needsUpdate = true));
  } };`,
};
