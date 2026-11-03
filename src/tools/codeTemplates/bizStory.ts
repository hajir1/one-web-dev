/* ================================================================== */
/* Cerita scroll untuk website 3D bisnis (v23.1).                      */
/*                                                                    */
/* Objek tidak lagi hanya bergeser kiri-kanan. Tiap template punya     */
/* alur sendiri yang digerakkan scroll (OWD Scrub):                     */
/*  1. Hero: "benih" cerita (palu, biji kopi, telur, kunci, ...).       */
/*  2. Scroll pertama: benih beraksi (palu memukul / benih pecah) lalu  */
/*     potongan-potongan objek utama datang dan tersusun satu per satu  */
/*     (jatuh bertumpuk seperti bata, berputar dari orbit, atau tumbuh  */
/*     dari tengah).                                                    */
/*  3. Urai: objek terbuka menjadi tampilan "exploded view".            */
/*  4. Menyelam: kamera masuk ke dalam objek, dunia berganti menjadi    */
/*     dunia khas template (bizWorlds.ts, 12 jenis).                    */
/*  5. Partikel: objek luruh menjadi ribuan titik yang menyusun nama    */
/*     usaha, lalu kembali utuh.                                        */
/* Ditambah orbit & lapisan berpilin; urutan adegan per template ada    */
/* di STORYBOARD (bizWorlds.ts).                                        */
/* ================================================================== */

export type SeedKind =
  | "hammer" | "bean" | "egg" | "spool" | "lump" | "bee" | "chip" | "spark" | "lens" | "pencil" | "cross"
  | "plane" | "coin" | "key" | "bolt" | "flower" | "drop" | "note" | "bone" | "star" | "sprout" | "pin";
export type BuildKind = "drop" | "spiral" | "grow";

/** Model 3D → [benih di hero, cara objek tersusun]. */
export const STORY_OF: Record<string, [SeedKind, BuildKind]> = {
  cup: ["bean", "grow"], cake: ["egg", "drop"], cloth: ["spool", "spiral"], vase: ["lump", "grow"], honey: ["bee", "spiral"],
  phone: ["chip", "spiral"], laptop: ["chip", "drop"], rocket: ["spark", "spiral"], knot: ["spark", "spiral"], camera: ["lens", "grow"],
  edu: ["pencil", "drop"], pill: ["cross", "grow"], suitcase: ["plane", "spiral"], bowl: ["egg", "drop"], house: ["hammer", "drop"],
  coins: ["coin", "drop"], bed: ["key", "drop"], dumbbell: ["bolt", "drop"], perfume: ["flower", "grow"], car: ["key", "spiral"],
  carwash: ["drop", "grow"], vinyl: ["note", "spiral"], helmet: ["hammer", "drop"], petbowl: ["bone", "drop"], parcel: ["plane", "drop"],
  gamepad: ["star", "spiral"], energy: ["bolt", "spiral"], truck: ["pin", "drop"], lock: ["key", "grow"], glasses: ["lens", "spiral"],
  tooth: ["star", "grow"], bouquet: ["sprout", "grow"], museum: ["coin", "drop"], boat: ["pin", "spiral"], clapper: ["star", "spiral"],
  mic: ["note", "grow"], desk: ["pencil", "drop"], atom: ["spark", "spiral"], chair: ["hammer", "drop"], books: ["pencil", "drop"],
};

/** Nama benih untuk teks petunjuk & laporan. */
export const SEED_LABEL: Record<SeedKind, string> = {
  hammer: "palu", bean: "biji kopi", egg: "telur", spool: "gulungan benang", lump: "gumpalan tanah liat", bee: "lebah", chip: "chip",
  spark: "percik cahaya", lens: "lensa", pencil: "pensil", cross: "tanda plus", plane: "pesawat kertas", coin: "koin", key: "kunci",
  bolt: "petir", flower: "bunga", drop: "tetes air", note: "not musik", bone: "tulang", star: "bintang", sprout: "tunas", pin: "pin peta",
};

/** Badan fungsi JS: membangun benih dengan alat bantu K (sama dengan objek utama). */
export const SEEDS: Record<SeedKind, string> = {
  hammer: `
  const wood = K.std("#a8743f", { roughness: 0.6 });
  K.cyl(0.07, 0.085, 1.7, wood, { p: [0, -0.1, 0] });
  K.cyl(0.095, 0.095, 0.55, M.m1, { p: [0, -0.68, 0] });
  K.box(1.0, 0.3, 0.3, 0.05, M.mt, { p: [0.08, 0.78, 0] });
  K.box(0.36, 0.2, 0.26, 0.04, M.mt, { p: [-0.52, 0.86, 0], r: [0, 0, 0.55] });
  K.cyl(0.17, 0.17, 0.12, M.mt, { p: [0.62, 0.78, 0], r: [0, 0, Math.PI / 2] });`,
  bean: `
  const br = K.std("#5b3420", { roughness: 0.45 }), dk = K.std("#2e1a10", { roughness: 0.6 });
  [[0, 0, 0, 0.2], [-0.62, -0.28, 0.2, 1.4], [0.58, -0.32, -0.15, 2.4]].forEach(([x, y, z, r], i) => {
    const s = i ? 0.75 : 1;
    K.sph(0.5 * s, br, { p: [x, y, z], r: [0.3, r, 0.2], s: [1, 0.72, 0.82] });
    K.box(0.07 * s, 0.62 * s, 0.08 * s, 0.03 * s, dk, { p: [x, y, z + 0.4 * s], r: [0.3, r * 0.1, 0.2 + 0.25] });
  });`,
  egg: `
  const shell = K.std("#f4e7d2", { roughness: 0.55 });
  K.lathe([[0, -0.72], [0.36, -0.62], [0.52, -0.3], [0.5, 0.08], [0.38, 0.45], [0.2, 0.68], [0, 0.76]], shell);
  K.sph(0.16, M.m1, { p: [0.62, -0.55, 0.2] }); K.sph(0.12, M.m2, { p: [-0.6, -0.62, -0.1] });`,
  spool: `
  const wood = K.std("#c79a62", { roughness: 0.6 });
  K.cyl(0.5, 0.5, 0.12, wood, { p: [0, 0.48, 0] }); K.cyl(0.5, 0.5, 0.12, wood, { p: [0, -0.48, 0] });
  K.cyl(0.36, 0.36, 0.84, M.m1); K.cyl(0.2, 0.2, 0.9, wood);
  K.cyl(0.025, 0.012, 1.5, M.mt, { p: [0.62, 0.1, 0.1], r: [0.2, 0, -0.5] });
  K.tor(0.3, 0.012, M.m2, { p: [0.85, 0.55, 0.15], r: [1.2, 0.3, 0] });`,
  lump: `
  const clay = K.std("#b5623a", { roughness: 0.85 });
  K.sph(0.62, clay, { p: [0, 0.18, 0], s: [1, 0.72, 1] });
  K.cyl(0.95, 0.95, 0.1, M.dk, { p: [0, -0.32, 0] }); K.cyl(0.18, 0.25, 0.5, M.mt, { p: [0, -0.62, 0] });`,
  bee: `
  const yel = K.std("#f2b632", { roughness: 0.4 });
  K.sph(0.4, yel, { s: [1.35, 1, 1] });
  [-0.2, 0.12, 0.42].forEach((x) => K.cyl(0.405, 0.405, 0.1, M.dk, { p: [x, 0, 0], r: [0, 0, Math.PI / 2], s: [1, 1, 1] }));
  K.sph(0.27, M.dk, { p: [-0.62, 0.05, 0] });
  K.sph(0.36, M.gl, { p: [0.05, 0.42, 0.22], s: [1, 0.25, 0.6], r: [0.4, 0, 0.3] }); K.sph(0.36, M.gl, { p: [0.05, 0.42, -0.22], s: [1, 0.25, 0.6], r: [-0.4, 0, 0.3] });
  K.cyl(0.05, 0.0, 0.2, M.dk, { p: [0.66, -0.02, 0], r: [0, 0, -Math.PI / 2] });`,
  chip: `
  K.box(1.3, 0.16, 1.3, 0.05, M.dk);
  K.box(0.56, 0.05, 0.56, 0.02, M.au, { p: [0, 0.1, 0] });
  for (let i = 0; i < 6; i++) { const o = -0.5 + i * 0.2; K.box(0.08, 0.04, 0.22, 0, M.mt, { p: [o, -0.02, 0.74] }); K.box(0.08, 0.04, 0.22, 0, M.mt, { p: [o, -0.02, -0.74] }); K.box(0.22, 0.04, 0.08, 0, M.mt, { p: [0.74, -0.02, o] }); K.box(0.22, 0.04, 0.08, 0, M.mt, { p: [-0.74, -0.02, o] }); }
  K.spr(COL.accent, 1.2, { p: [0, 0.3, 0] });`,
  spark: `
  const glow = K.std(COL.accent, { emissive: COL.accent, emissiveIntensity: 0.8, roughness: 0.3 });
  K.sph(0.42, glow); K.spr(COL.accent, 2.6);
  K.tor(0.85, 0.025, M.m2, { r: [1.2, 0, 0] }); K.tor(0.95, 0.02, M.m1, { r: [0.3, 0.9, 0] }); K.tor(1.05, 0.018, M.au, { r: [-0.5, -0.6, 0.4] });`,
  lens: `
  K.tor(0.62, 0.13, M.dk, { r: [Math.PI / 2, 0, 0] });
  K.cyl(0.6, 0.6, 0.06, M.gl, { r: [Math.PI / 2, 0, 0] });
  K.tor(0.42, 0.035, M.m1, { r: [Math.PI / 2, 0, 0], p: [0, 0, 0.05] });
  K.cyl(0.62, 0.62, 0.4, M.dk, { r: [Math.PI / 2, 0, 0], p: [0, 0, -0.26] }, 48, true);
  K.spr("#ffffff", 0.7, { p: [-0.2, 0.22, 0.1] });`,
  pencil: `
  const wood = K.std("#e8c99a", { roughness: 0.6 });
  K.cyl(0.13, 0.13, 1.5, M.m1, { p: [0, 0, 0] }, 6);
  K.cyl(0.0, 0.13, 0.34, wood, { p: [0, 0.92, 0] }, 6); K.cyl(0.0, 0.045, 0.1, M.dk, { p: [0, 1.04, 0] }, 12);
  K.cyl(0.135, 0.135, 0.16, M.mt, { p: [0, -0.83, 0] }); K.cyl(0.13, 0.13, 0.2, K.std("#f08a8a"), { p: [0, -1.0, 0] });`,
  cross: `
  K.box(0.38, 1.25, 0.38, 0.1, M.m1); K.box(1.25, 0.38, 0.38, 0.1, M.m1);
  K.spr(COL.accent, 2.2);`,
  plane: `
  K.ext([[1.0, 0], [-0.8, 0.62], [-0.55, 0]], 0.02, M.m3, { r: [-1.25, 0, 0] });
  K.ext([[1.0, 0], [-0.8, 0.62], [-0.55, 0]], 0.02, M.m3, { r: [1.25, 0, 0], p: [0, 0, 0] });
  K.ext([[1.0, 0], [-0.7, 0.18], [-0.6, 0]], 0.02, M.m1, { r: [Math.PI / 2, 0, 0], p: [0, -0.1, 0] });`,
  coin: `
  [[0, -0.36, 0], [0.06, -0.2, 0.03], [-0.04, -0.04, -0.02]].forEach((p) => K.cyl(0.62, 0.62, 0.14, M.au, { p }));
  K.cyl(0.62, 0.62, 0.14, M.au, { p: [0.2, 0.42, 0.2], r: [1.2, 0.4, 0] });
  K.tor(0.5, 0.03, K.std("#b8892f", { metalness: 1, roughness: 0.35 }), { p: [0.2, 0.42, 0.2], r: [1.2, 0.4, 0] });`,
  key: `
  K.tor(0.34, 0.1, M.au, { p: [0, 0.62, 0] });
  K.cyl(0.075, 0.075, 1.15, M.au, { p: [0, -0.1, 0] });
  K.box(0.26, 0.1, 0.08, 0.02, M.au, { p: [0.15, -0.5, 0] }); K.box(0.2, 0.1, 0.08, 0.02, M.au, { p: [0.12, -0.3, 0] });
  K.tor(0.24, 0.03, M.m1, { p: [0, 0.98, 0], r: [0, Math.PI / 2, 0] });`,
  bolt: `
  K.ext([[0.15, 1], [-0.42, -0.05], [0.02, -0.05], [-0.22, -1], [0.48, 0.18], [0.06, 0.18], [0.36, 1]], 0.28, M.m1, {}, 0.04);
  K.spr(COL.accent, 2.4);`,
  flower: `
  K.sph(0.2, M.au, { p: [0, 0.55, 0] });
  for (let i = 0; i < 7; i++) { const a = i / 7 * Math.PI * 2; K.sph(0.26, M.m1, { p: [Math.cos(a) * 0.36, 0.55, Math.sin(a) * 0.36], s: [1, 0.35, 0.62], r: [0, -a, 0.25] }); }
  const g = K.std("#4f8a3c", { roughness: 0.5 });
  K.cyl(0.035, 0.04, 1.1, g, { p: [0, -0.05, 0] }); K.sph(0.2, g, { p: [0.16, -0.2, 0], s: [1.2, 0.25, 0.5], r: [0, 0, 0.5] });`,
  drop: `
  const w = K.std("#5fb6ff", { roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.85 });
  K.lathe([[0, -0.62], [0.32, -0.52], [0.48, -0.25], [0.44, 0.05], [0.28, 0.38], [0.1, 0.7], [0, 0.82]], w);
  K.sph(0.12, K.std("#5fb6ff", { transparent: true, opacity: 0.7 }), { p: [0.62, -0.5, 0.1] }); K.sph(0.08, K.std("#5fb6ff", { transparent: true, opacity: 0.7 }), { p: [-0.6, -0.3, -0.1] });`,
  note: `
  K.sph(0.3, M.m1, { p: [-0.25, -0.62, 0], s: [1.25, 0.9, 0.7], r: [0, 0, 0.35] });
  K.cyl(0.05, 0.05, 1.3, M.m1, { p: [0.08, 0.02, 0] });
  K.box(0.5, 0.14, 0.07, 0.03, M.m1, { p: [0.3, 0.6, 0], r: [0, 0, -0.45] });
  K.sph(0.2, M.m2, { p: [0.7, -0.4, 0], s: [1.25, 0.9, 0.7], r: [0, 0, 0.35] }); K.cyl(0.035, 0.035, 0.8, M.m2, { p: [0.92, 0, 0] });`,
  bone: `
  K.cyl(0.13, 0.13, 1.2, M.m3, { r: [0, 0, Math.PI / 2] });
  [[-0.66, 0.12], [-0.66, -0.12], [0.66, 0.12], [0.66, -0.12]].forEach(([x, y]) => K.sph(0.19, M.m3, { p: [x, y, 0] }));`,
  star: `
  const pts = []; for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 + Math.PI / 2, r = i % 2 ? 0.42 : 1; pts.push([Math.cos(a) * r, Math.sin(a) * r]); }
  K.ext(pts, 0.26, M.au, {}, 0.05); K.spr(COL.accent, 2.4);`,
  sprout: `
  K.cyl(0.55, 0.45, 0.3, K.std("#6b4a2b", { roughness: 0.9 }), { p: [0, -0.6, 0] });
  const g = K.std("#5aa04a", { roughness: 0.45 });
  K.cyl(0.035, 0.045, 0.8, g, { p: [0, -0.1, 0] });
  K.sph(0.3, g, { p: [-0.22, 0.32, 0], s: [1.2, 0.3, 0.6], r: [0, 0.3, 0.5] }); K.sph(0.26, g, { p: [0.2, 0.2, 0], s: [1.2, 0.3, 0.6], r: [0, -0.3, -0.5] });`,
  pin: `
  K.sph(0.46, M.m1, { p: [0, 0.38, 0] });
  K.cyl(0.33, 0.0, 0.9, M.m1, { p: [0, -0.32, 0] });
  K.sph(0.18, M.m3, { p: [0, 0.42, 0.34], s: [1, 1, 0.5] });
  K.cyl(0.5, 0.5, 0.03, M.dk, { p: [0, -0.8, 0] });`,
};

/* ------------------------------------------------------------------ */
/* Mesin cerita (disisipkan ke dalam start() setelah objek dibuat).     */
/* Memakai: THREE, K, M, COL, BRAND, model, fit, spin, pivot, mid, k,   */
/* scene, track, GLOW, reduce, STORY.                                   */
/* ------------------------------------------------------------------ */
export const STORY_ENGINE = String.raw`
  /* ---- Cerita scroll: benih → rakit → urai → menyelam → partikel nama ---- */
  const sm = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  /* Benih di hero (dinormalkan, ikut diputar). */
  const seedG = new THREE.Group();
  K.target(seedG); buildSeed(K, THREE, COL); K.target(model);
  seedG.updateMatrixWorld(true);
  const sb = new THREE.Box3().setFromObject(seedG), ssz = sb.getSize(new THREE.Vector3()), smid = sb.getCenter(new THREE.Vector3());
  const seedFit = new THREE.Group(); seedFit.add(seedG); seedG.position.sub(smid); seedFit.scale.setScalar(2.1 / Math.max(ssz.x, ssz.y, ssz.z));
  const seedSpin = new THREE.Group(); seedSpin.add(seedFit); spin.add(seedSpin);

  /* Potongan objek: tiap mesh dibungkus dua grup supaya bisa digeser, diputar, dan diskalakan di titik tengahnya
     tanpa mengganggu animasi bawaan objek (K.tick). */
  model.updateMatrixWorld(true);
  const invModel = new THREE.Matrix4().copy(model.matrixWorld).invert();
  const leaves = []; model.traverse((o) => { if ((o.isMesh || o.isSprite) && o !== model) leaves.push(o); });
  const parts = [];
  let minY = Infinity, maxY = -Infinity, maxR = 0;
  for (const o of leaves) {
    const par = o.parent;
    const box = new THREE.Box3().setFromObject(o);
    if (box.isEmpty()) continue;
    const cw = box.getCenter(new THREE.Vector3());
    const cm = cw.clone().applyMatrix4(invModel).sub(mid);               /* pusat di ruang objek (relatif titik tengah) */
    const A = new THREE.Matrix4().copy(par.matrixWorld).invert().multiply(model.matrixWorld);
    const A3 = new THREE.Matrix3().setFromMatrix4(A);
    const cl = cw.clone().applyMatrix4(new THREE.Matrix4().copy(par.matrixWorld).invert()); /* pusat di ruang induk */
    const w1 = new THREE.Group(), w2 = new THREE.Group();
    w1.position.copy(cl); w2.position.copy(cl).negate();
    const idx = par.children.indexOf(o); par.remove(o); w2.add(o); w1.add(w2); par.add(w1);
    if (idx >= 0) { par.children.splice(par.children.indexOf(w1), 1); par.children.splice(idx, 0, w1); }
    const r = K.rnd();
    parts.push({ w1, cl, cm, A3, r, oa: 0, rx: (K.rnd() - 0.5) * 2.4, rz: (K.rnd() - 0.5) * 2.4, a: K.rnd() * Math.PI * 2 });
    minY = Math.min(minY, cm.y); maxY = Math.max(maxY, cm.y); maxR = Math.max(maxR, cm.length());
  }
  const spanY = Math.max(1e-3, maxY - minY);
  parts.forEach((p, i) => (p.oa = (i / Math.max(1, parts.length)) * Math.PI * 2));
  parts.forEach((p) => { p.rank = STORY.build === "drop" ? (p.cm.y - minY) / spanY * 0.85 + p.r * 0.15 : STORY.build === "grow" ? p.cm.length() / Math.max(1e-3, maxR) * 0.7 + p.r * 0.3 : p.r; });
  const tmp = new THREE.Vector3();
  const U = 1 / k; /* satu satuan layar (objek dinormalkan 2,7) dalam satuan objek */

  /* Partikel: titik dari permukaan objek, berubah menjadi nama usaha. */
  const NP = 3200;
  const base = new Float32Array(NP * 3), txt = new Float32Array(NP * 3), pos = new Float32Array(NP * 3), del = new Float32Array(NP);
  {
    spin.updateMatrixWorld(true);
    const verts = []; let total = 0;
    leaves.forEach((o) => { if (o.isMesh && o.geometry.attributes.position) total += o.geometry.attributes.position.count; });
    const stride = Math.max(1, Math.floor(total / NP));
    const v = new THREE.Vector3();
    leaves.forEach((o) => { if (!o.isMesh) return; const pa = o.geometry.attributes.position; for (let i = 0; i < pa.count && verts.length < NP * 3; i += stride) { v.fromBufferAttribute(pa, i).applyMatrix4(o.matrixWorld); verts.push(v.x, v.y, v.z); } });
    for (let i = 0; i < NP; i++) { const j = (i % Math.max(1, verts.length / 3)) * 3; base[i * 3] = verts[j] || 0; base[i * 3 + 1] = verts[j + 1] || 0; base[i * 3 + 2] = verts[j + 2] || 0; del[i] = K.rnd(); }
    const c = document.createElement("canvas"), W = 640, H = 200; c.width = W; c.height = H;
    const g = c.getContext("2d"), word = (BRAND || "OneWebDev").slice(0, 24);
    let fs = 150; const fam = (getComputedStyle(root).getPropertyValue("--fd") || "sans-serif");
    do { g.font = "800 " + fs + "px " + fam; fs -= 6; } while (g.measureText(word).width > W * 0.94 && fs > 24);
    g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(word, W / 2, H / 2);
    const d = g.getImageData(0, 0, W, H).data, tp = [];
    for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (d[(y * W + x) * 4 + 3] > 128) tp.push(x, y);
    const n = Math.max(1, tp.length / 2), sc = 3.2 / W;
    for (let i = 0; i < NP; i++) { const j = ((i * 7919) % n) * 2; txt[i * 3] = (tp[j] - W / 2) * sc + (K.rnd() - 0.5) * 0.02; txt[i * 3 + 1] = -(tp[j + 1] - H / 2) * sc; txt[i * 3 + 2] = (K.rnd() - 0.5) * 0.12; }
  }
  /* Latar gelap: titik bercahaya (aditif); latar terang: titik biasa supaya tetap kontras. */
  const darkBg = new THREE.Color(COL.bg).getHSL({ h: 0, s: 0, l: 0 }).l < 0.4;
  const blend = darkBg ? THREE.AdditiveBlending : THREE.NormalBlending;
  const pgeo = track(new THREE.BufferGeometry()); pgeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const pmat = track(new THREE.PointsMaterial({ size: darkBg ? 0.09 : 0.07, map: GLOW, color: new THREE.Color(COL.accent).lerp(new THREE.Color("#ffffff"), darkBg ? 0.45 : 0), transparent: true, opacity: 0, depthWrite: false, sizeAttenuation: true, blending: blend, toneMapped: false }));
  const points = new THREE.Points(pgeo, pmat); points.visible = false; points.frustumCulled = false; pivot.add(points);

  /* Dunia di dalam objek: berbeda per template (buildWorld, lihat bizWorlds.ts). */
  const world = new THREE.Group(); world.visible = false; scene.add(world);
  const ink = darkBg ? "#ffffff" : COL.ink, wm = [];
  const fade = (m, o) => { m.transparent = true; m.opacity = 0; m.depthWrite = false; m.userData.o = o == null ? 0.85 : o; wm.push(track(m)); return m; };
  const WB = {
    THREE, K, COL, world, ink, wm, rnd: K.rnd, variant: STORY.variant || "",
    wmat: (c, o) => fade(new THREE.MeshBasicMaterial({ color: c, blending: blend, toneMapped: false, side: THREE.DoubleSide }), o),
    wstd: (c, o) => fade(new THREE.MeshStandardMaterial({ color: c, roughness: 0.45, metalness: 0.2 }), o),
    wline: (c, o) => fade(new THREE.LineBasicMaterial({ color: c, blending: blend, toneMapped: false }), o),
    wpts: (arr, size, c, o) => { const g = track(new THREE.BufferGeometry()); g.setAttribute("position", new THREE.BufferAttribute(arr, 3)); const p = new THREE.Points(g, fade(new THREE.PointsMaterial({ size, map: GLOW, color: new THREE.Color(c), blending: blend, toneMapped: false, sizeAttenuation: true }), o == null ? 1 : o)); p.frustumCulled = false; world.add(p); return p; },
    loop: (o, v, dt, far, lim) => { o.position.z += (dt || 0) * v; if (o.position.z > (lim || 7.5)) o.position.z -= far || 30; },
  };
  WB.stream = (n, r0, r1, v, size, c) => { const a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const an = K.rnd() * Math.PI * 2, rr = r0 + K.rnd() * (r1 - r0); a[i * 3] = Math.cos(an) * rr; a[i * 3 + 1] = Math.sin(an) * rr; a[i * 3 + 2] = 7 - K.rnd() * 30; } const p = WB.wpts(a, size, c); return (dt) => { for (let i = 0; i < n; i++) { a[i * 3 + 2] += (dt || 0) * v; if (a[i * 3 + 2] > 7.5) a[i * 3 + 2] -= 30; } p.geometry.attributes.position.needsUpdate = true; }; };
  const core = K.spr(COL.accent, 6, { to: world, p: [0, 0, -22] }); fade(core.material, 0.9);
  const W3 = buildWorld(WB);
  world.traverse((o) => { if (o.geometry) track(o.geometry); });

  const FIXED = { bld: 1, exp: 0, orb: 0, lay: 0, dive: 0, dis: 0 };
  const qv = new THREE.Quaternion(), ev = new THREE.Euler();
  let lastKey = "";
  /** Terapkan kanal cerita ke potongan, benih, partikel, dan dunia. */
  function story(C, t, dt) {
    const bld = C.bld, exp = C.exp, dis = C.dis, orb = C.orb || 0, lay = C.lay || 0;
    const key = bld.toFixed(4) + exp.toFixed(4) + dis.toFixed(4) + orb.toFixed(4) + lay.toFixed(4) + (orb > 0.001 ? t.toFixed(3) : "");
    if (key !== lastKey) {
      lastKey = key;
      for (const p of parts) {
        const q = Math.max(0, Math.min(1, bld * 1.9 - p.rank * 0.9)), e = 1 - Math.pow(1 - q, 3), ie = 1 - e;
        let ox = 0, oy = 0, oz = 0, s = 1, rx = 0, rz = 0;
        if (STORY.build === "drop") { oy = ie * (3.4 + p.rank * 1.8); ox = ie * (p.r - 0.5) * 0.6; rx = ie * p.rx; rz = ie * p.rz; s = q > 0 ? 0.5 + 0.5 * e : 0; }
        else if (STORY.build === "spiral") { const a = p.a + ie * 5, R = ie * 3; ox = Math.cos(a) * R; oz = Math.sin(a) * R; oy = ie * (p.r - 0.35) * 2.2; rx = ie * p.rx * 2; rz = ie * p.rz; s = q > 0 ? 0.35 + 0.65 * e : 0; }
        else { tmp.copy(p.cm).multiplyScalar(-ie / U); ox = tmp.x; oy = tmp.y; oz = tmp.z; s = e; rz = ie * p.rz; }
        if (exp > 0) { const L = p.cm.length() || 1, f = exp * (0.38 + p.r * 0.32); ox += p.cm.x / L * f; oy += p.cm.y / L * f * 0.9 + exp * (p.cm.y > 0 ? 0.12 : -0.12); oz += p.cm.z / L * f; rx += exp * p.rx * 0.25; rz += exp * p.rz * 0.25; }
        /* Orbit: potongan berputar mengelilingi pusat seperti korsel. */
        if (orb > 0) { const a = p.oa + t * 0.45, R = 2.2 + p.r * 0.5; ox += orb * (Math.cos(a) * R - p.cm.x / U); oy += orb * ((p.r - 0.5) * 0.7 + Math.sin(a * 2) * 0.18 - p.cm.y / U); oz += orb * (Math.sin(a) * R - p.cm.z / U); rx += orb * a * 0.5; s *= 1 - orb * 0.3; }
        /* Lapisan berpilin: potongan terpisah per ketinggian lalu tiap lapis diputar. */
        let ry = 0;
        if (lay > 0) { const ly = (p.cm.y - minY) / spanY - 0.5; oy += lay * ly * 2.4; ox += lay * (p.r - 0.5) * 0.35; ry = lay * ly * 2.2; }
        if (dis > 0) s *= 1 - sm(0.02 + p.r * 0.18, 0.2 + p.r * 0.18, dis);
        tmp.set(ox * U, oy * U, oz * U).applyMatrix3(p.A3);
        p.w1.position.copy(p.cl).add(tmp);
        p.w1.rotation.set(rx, ry, rz);
        p.w1.scale.setScalar(Math.max(1e-4, s));
        p.w1.visible = s > 0.002;
      }
    }
    /* Benih: diam di hero, lalu beraksi dan menghilang. */
    const sk = Math.min(1, bld / 0.42), seedVis = 1 - sm(0.28, 0.5, bld);
    seedSpin.visible = seedVis > 0.002;
    if (seedSpin.visible) {
      if (STORY.act === "strike") { seedSpin.rotation.set(0, 0, sk > 0 ? Math.sin(sk * Math.PI * 5) * 0.9 : 0); seedSpin.position.set(-0.6 * sk, 0.3 * sk, 0.4 * sk); seedSpin.scale.setScalar(Math.max(1e-4, seedVis)); }
      else { const pop = 1 + sm(0, 0.55, sk) * 0.45; seedSpin.rotation.set(0, sk * 4, 0); seedSpin.position.set(0, 0, 0); seedSpin.scale.setScalar(Math.max(1e-4, pop * seedVis)); }
      /* Benih selalu menghadap layar (tidak ikut putar otomatis), tetap bisa digeser. */
      seedFit.rotation.y = -(spin.rotation.y - user.ry) + (dt ? Math.sin(t * 0.8) * 0.55 : 0.35);
    }
    /* Partikel nama usaha. */
    points.visible = dis > 0.01;
    if (points.visible) {
      pmat.opacity = sm(0.02, 0.22, dis) * (0.85 + 0.15 * Math.sin(t * 3));
      ev.set(spin.rotation.x, spin.rotation.y, spin.rotation.z); qv.setFromEuler(ev);
      const fs = 1, puff = sm(0, 0.35, dis);
      for (let i = 0; i < NP; i++) {
        tmp.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]).applyQuaternion(qv).multiplyScalar(fs * (1 + puff * 0.35));
        const tr = sm(0.3 + del[i] * 0.25, 0.75 + del[i] * 0.25, dis), w = Math.sin(tr * Math.PI) * 0.7;
        pos[i * 3] = tmp.x + (txt[i * 3] - tmp.x) * tr + Math.sin(t * 1.7 + i) * w * 0.4;
        pos[i * 3 + 1] = tmp.y + (txt[i * 3 + 1] - tmp.y) * tr + Math.cos(t * 1.3 + i * 0.7) * w * 0.4;
        pos[i * 3 + 2] = tmp.z + (txt[i * 3 + 2] - tmp.z) * tr + Math.sin(t + i * 1.3) * w * 0.6;
      }
      pgeo.attributes.position.needsUpdate = true;
    }
    /* Menyelam: kamera masuk ke objek, lalu lorong cahaya. */
    const wv = sm(0.45, 0.85, C.dive);
    world.visible = wv > 0.01;
    if (world.visible) { W3.tick(dt || 0, t); for (const m of wm) m.opacity = wv * m.userData.o; }
    spin.visible = C.dive < 0.72;
  }
`;
