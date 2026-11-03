/* ================================================================== */
/* MODEL 3D PROSEDURAL untuk Website 3D Bisnis (v23).                    */
/*                                                                    */
/* Setiap model = badan fungsi JS yang menerima K (alat bantu dari mesin */
/* biz3d) dan menyusun objek dari bentuk dasar three.js: lathe, kotak    */
/* membulat, silinder, torus, kapsul, ekstrusi. Tanpa model/tekstur      */
/* eksternal. Bahan:                                                    */
/*   M.m1 / M.m2 = warna varian (berubah saat chip warna ditekan)       */
/*   M.m3 = netral terang, M.dk = gelap, M.mt = logam, M.gl = kaca,     */
/*   M.au = emas.                                                       */
/* Opsi posisi o = { p: [x,y,z], r: [x,y,z], s: [x,y,z], to: grup }.     */
/* K.tick = (t, dt) => {} untuk gerak kecil (uap, baling-baling, dst).   */
/* ================================================================== */

const PI = "Math.PI";

const CAR = `
  const car = K.grp({ to: root });
  const body = [[-1.85,.32],[1.8,.32],[1.9,.62],[1.82,.86],[.95,1.0],[.42,1.46],[-.85,1.48],[-1.42,1.04],[-1.86,.94],[-1.95,.55]];
  K.ext(body, 1.36, M.m1, { keep: 1, p: [0, 0, -.68], to: car }, .12);
  K.ext([[.74,1.04],[.33,1.4],[-.18,1.4],[-.18,1.04]], 1.6, M.gl2, { keep: 1, p: [0, 0, -.8], to: car }, 0);
  K.ext([[-.28,1.04],[-.28,1.4],[-.8,1.41],[-1.26,1.04]], 1.6, M.gl2, { keep: 1, p: [0, 0, -.8], to: car }, 0);
  [[1.1,.8],[1.1,-.8],[-1.15,.8],[-1.15,-.8]].forEach(([x, z]) => {
    K.cyl(.38, .38, .3, M.dk, { p: [x, .38, z], r: [${PI} / 2, 0, 0], to: car }, 32);
    K.cyl(.22, .22, .32, M.mt, { p: [x, .38, z], r: [${PI} / 2, 0, 0], to: car }, 24);
  });
  const lamp = K.std("#fff6d8", { emissive: "#fff2c4", emissiveIntensity: 1.4 });
  K.box(.08, .14, .34, .03, lamp, { p: [1.93, .74, .42], to: car }); K.box(.08, .14, .34, .03, lamp, { p: [1.93, .74, -.42], to: car });
  const tail = K.std("#ff3b3b", { emissive: "#ff2020", emissiveIntensity: 1 });
  K.box(.06, .12, .3, .02, tail, { p: [-1.96, .8, .44], to: car }); K.box(.06, .12, .3, .02, tail, { p: [-1.96, .8, -.44], to: car });
  K.box(.5, .05, .06, .02, M.mt, { p: [-.05, 1.02, .71], to: car });`;

export const MODELS: Record<string, string> = {
  /* Cangkir kopi + tatakan + biji kopi + uap. */
  cup: `
  K.lathe([[0,.06],[.6,.06],[.66,.12],[.74,1.02],[.78,1.12],[.72,1.13],[.66,.2],[0,.2]], M.m1);
  K.cyl(.7, .7, .02, K.std("#3a2213", { roughness: .2 }), { p: [0, .93, 0] });
  K.tor(.29, .075, M.m1, { p: [.83, .6, 0] });
  K.lathe([[0,0],[1.1,0],[1.24,.1],[1.18,.12],[.82,.06],[0,.06]], M.m2);
  const bean = K.std("#4a2a17", { roughness: .45 });
  [[1.6,.06,.4,.3],[1.45,.06,-.6,1.2],[-1.5,.06,.5,2.2],[-1.25,.06,-.9,.7],[1.0,.06,1.2,1.7]].forEach(([x,y,z,r]) => K.sph(.11, bean, { p: [x, y, z], r: [0, r, 0], s: [1.35, .65, .95] }));
  const steam = [0, 1, 2].map((i) => K.spr("#ffffff", .7, { p: [(i - 1) * .25, 1.3, 0] }));
  K.tick = (t) => steam.forEach((s, i) => { const k = (t * .35 + i / 3) % 1; s.position.y = 1.2 + k * 1.3; s.position.x = (i - 1) * .22 + Math.sin(t * 1.4 + i * 2) * .12; s.material.opacity = Math.sin(k * ${PI}) * .28; s.scale.setScalar(.35 + k * .5); });`,

  /* Kue dua tingkat dengan lelehan, ceri, dan lilin. */
  cake: `
  K.lathe([[0,0],[1.45,0],[1.55,.08],[1.5,.1],[0,.1]], M.m3);
  K.cyl(1.05, 1.05, .75, M.m3, { p: [0, .48, 0] }, 56);
  K.cyl(.7, .7, .6, M.m3, { p: [0, 1.15, 0] }, 56);
  K.cyl(1.07, 1.07, .06, M.m1, { p: [0, .85, 0] }, 56);
  K.cyl(.72, .72, .06, M.m1, { p: [0, 1.45, 0] }, 56);
  for (let i = 0; i < 14; i++) { const a = i / 14 * ${PI} * 2; K.cap(.05, .12 + (i % 3) * .07, M.m1, { p: [Math.cos(a) * 1.06, .76 - (i % 3) * .04, Math.sin(a) * 1.06] }); }
  for (let i = 0; i < 9; i++) { const a = i / 9 * ${PI} * 2; K.sph(.1, M.m2, { p: [Math.cos(a) * .55, 1.55, Math.sin(a) * .55] }); }
  for (let i = 0; i < 12; i++) { const a = i / 12 * ${PI} * 2; K.sph(.07, M.m2, { p: [Math.cos(a) * 1.1, .14, Math.sin(a) * 1.1] }); }
  K.cyl(.035, .035, .4, K.std("#ffffff"), { p: [0, 1.68, 0] });
  const fl = K.spr("#ffb347", .45, { p: [0, 1.95, 0] });
  K.tick = (t) => { fl.scale.setScalar(.38 + Math.sin(t * 13) * .04 + Math.sin(t * 7) * .03); };`,

  /* Tumpukan kain batik terlipat + kain terbentang. */
  cloth: `
  M.m1.map = K.tex("batik"); M.m2.map = K.tex("parang");
  for (let i = 0; i < 4; i++) K.box(2.3, .16, 1.5, .07, i % 2 ? M.m2 : M.m1, { p: [0, .08 + i * .17, 0], r: [0, (i - 1.5) * .07, 0] });
  const g = new THREE.PlaneGeometry(2.6, 1.8, 48, 24), pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); pos.setZ(i, Math.sin(x * 2.4) * .12 + Math.cos(y * 3) * .06 + (y + .9) * (y + .9) * .12); }
  g.computeVertexNormals();
  const drape = K.mesh(g, M.m1, { p: [0, 1.2, -.2], r: [-1.15, 0, .05] }); drape.material.side = THREE.DoubleSide;
  K.cyl(.26, .26, 1.9, M.m2, { p: [.2, .26, 1.05], r: [0, 0, ${PI} / 2] }, 40);
  K.tick = (t) => { drape.rotation.z = .05 + Math.sin(t * .8) * .03; };`,

  /* Guci gerabah + mangkuk + pot kecil. */
  vase: `
  K.lathe([[0,0],[.48,0],[.6,.1],[.82,.62],[.8,1.05],[.5,1.6],[.36,1.92],[.46,2.12],[.42,2.15],[.3,1.98],[0,1.98]], M.m1, {}, 64);
  K.tor(.82, .025, M.m2, { p: [0, .72, 0], r: [${PI} / 2, 0, 0] });
  K.tor(.7, .02, M.m2, { p: [0, 1.25, 0], r: [${PI} / 2, 0, 0] });
  K.lathe([[0,0],[.3,0],[.58,.34],[.54,.36],[.28,.07],[0,.07]], M.m2, { p: [1.25, 0, .3] });
  K.lathe([[0,0],[.26,0],[.34,.25],[.3,.6],[.22,.72],[.26,.78],[0,.78]], M.m1, { p: [-1.15, 0, -.1] });`,

  /* Toples madu kaca + sendok madu + sarang heksagon. */
  honey: `
  K.lathe([[0,.02],[.7,.02],[.71,1.12],[0,1.12]], M.m1);
  K.lathe([[0,0],[.74,0],[.78,.08],[.78,1.32],[.62,1.48],[.58,1.56],[0,1.56]], M.gl, {}, 56);
  K.cyl(.62, .62, .2, M.m2, { p: [0, 1.66, 0] }, 48);
  K.cyl(.8, .8, .42, M.m3, { p: [0, .65, 0] }, 56, true);
  const d = K.grp({ p: [1.05, .6, .2], r: [0, 0, -.5] });
  K.cyl(.04, .05, 1.7, M.m2, { p: [0, .75, 0], to: d });
  for (let i = 0; i < 4; i++) K.tor(.15 - i * .015, .045, M.m2, { p: [0, -.1 + i * .1, 0], r: [${PI} / 2, 0, 0], to: d });
  for (let i = 0; i < 6; i++) { const a = i / 6 * ${PI} * 2; K.cyl(.22, .22, .16, M.m1, { p: [-1.2 + Math.cos(a) * .4, .08, .4 + Math.sin(a) * .4] }, 6); }
  K.cyl(.22, .22, .16, M.m1, { p: [-1.2, .08, .4] }, 6);`,

  /* Ponsel dengan layar aplikasi + wadah earbud. */
  phone: `
  const ph = K.grp({ r: [0, 0, 0] });
  K.box(1.15, 2.3, .13, .17, M.m1, { to: ph });
  K.plane(1.04, 2.18, K.screen(512, 1080, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, COL.accent); gr.addColorStop(1, COL.accent2); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = "rgba(255,255,255,.92)"; g.font = "600 92px system-ui, sans-serif"; g.textAlign = "center"; g.fillText("09.41", w / 2, 210);
    g.font = "500 30px system-ui, sans-serif"; g.fillText(BRAND, w / 2, 260);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = "rgba(255,255,255," + (.25 + ((r + c) % 3) * .15) + ")"; K.rr(g, 48 + c * 112, 380 + r * 130, 84, 84, 22); g.fill(); }
    g.fillStyle = "rgba(0,0,0,.25)"; K.rr(g, 40, h - 150, w - 80, 110, 40); g.fill();
  }), { p: [0, 0, .068], to: ph });
  K.box(.42, .42, .06, .1, M.dk, { p: [-.28, .78, -.08], to: ph });
  K.cyl(.09, .09, .04, M.gl2, { p: [-.36, .86, -.12], r: [${PI} / 2, 0, 0], to: ph }); K.cyl(.09, .09, .04, M.gl2, { p: [-.2, .7, -.12], r: [${PI} / 2, 0, 0], to: ph });
  K.box(.7, .5, .32, .16, M.m3, { p: [1.05, -.95, .2], r: [0, -.4, 0] });
  K.box(.68, .04, .3, .02, M.m2, { p: [1.05, -.83, .2], r: [0, -.4, 0] });`,

  /* Laptop terbuka dengan dasbor aplikasi. */
  laptop: `
  K.box(2.8, .09, 1.9, .06, M.m1, { p: [0, 0, .1] });
  K.plane(2.4, 1.0, K.std("#1b1d22", { roughness: .8 }), { p: [0, .05, -.05], r: [-${PI} / 2, 0, 0] });
  K.plane(.9, .55, K.std("#2a2d33", { roughness: .5 }), { p: [0, .05, .7], r: [-${PI} / 2, 0, 0] });
  const lid = K.grp({ p: [0, .04, -.84], r: [-.24, 0, 0] });
  K.box(2.8, 1.8, .06, .06, M.m1, { p: [0, .9, 0], to: lid });
  K.plane(2.62, 1.62, K.screen(1024, 634, (g, w, h) => {
    g.fillStyle = "#0f1115"; g.fillRect(0, 0, w, h);
    g.fillStyle = COL.accent; g.fillRect(0, 0, 150, h);
    g.fillStyle = "rgba(255,255,255,.85)"; g.font = "600 26px system-ui, sans-serif"; g.fillText(BRAND, 180, 54);
    for (let i = 0; i < 3; i++) { g.fillStyle = "#1c2028"; K.rr(g, 180 + i * 270, 90, 250, 120, 14); g.fill(); g.fillStyle = i === 1 ? COL.accent2 : COL.accent; g.font = "700 40px system-ui, sans-serif"; g.fillText(["128", "Rp4,2jt", "96%"][i], 200 + i * 270, 170); }
    g.fillStyle = "#1c2028"; K.rr(g, 180, 230, 520, 360, 14); g.fill();
    g.strokeStyle = COL.accent2; g.lineWidth = 6; g.beginPath(); [0, .3, .2, .55, .45, .7, .62, .9].forEach((v, i) => { const x = 210 + i * 66, y = 560 - v * 280; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke();
    for (let i = 0; i < 6; i++) { g.fillStyle = "#1c2028"; K.rr(g, 720, 230 + i * 60, 270, 48, 10); g.fill(); g.fillStyle = i % 2 ? COL.accent : COL.accent2; g.fillRect(736, 248 + i * 60, 60 + i * 24, 12); }
    for (let i = 0; i < 6; i++) { g.fillStyle = i ? "rgba(255,255,255,.18)" : "rgba(255,255,255,.7)"; K.rr(g, 24, 90 + i * 64, 102, 40, 10); g.fill(); }
  }), { p: [0, .9, .032], to: lid });`,

  /* Roket lepas landas + asap. */
  rocket: `
  const rk = K.grp({ r: [0, 0, -.12] });
  K.lathe([[0,0],[.34,0],[.46,.4],[.5,1.2],[.44,1.85],[0,1.85]], M.m3, { to: rk }, 48);
  K.lathe([[0,1.84],[.44,1.84],[.36,2.2],[.2,2.5],[0,2.62]], M.m1, { to: rk }, 48);
  K.lathe([[0,-.2],[.22,-.2],[.32,0],[0,0]], M.dk, { to: rk }, 32);
  for (let i = 0; i < 3; i++) { const f = K.grp({ r: [0, i * ${PI} * 2 / 3, 0], to: rk }); K.ext([[0,0],[.55,-.3],[.55,.1],[0,.75]], .06, M.m1, { p: [.62, .32, 0], to: f }, .02); }
  K.tor(.17, .045, M.mt, { p: [0, 1.32, .47], r: [-.08, 0, 0], to: rk }); K.cyl(.15, .15, .03, M.gl2, { p: [0, 1.32, .46], r: [${PI} / 2 - .08, 0, 0], to: rk });
  K.box(.04, .9, .04, 0, M.m2, { p: [0, .8, .5], to: rk });
  const fl = [K.spr("#ffb347", 1.0, { p: [0, -.45, 0], to: rk }), K.spr("#ff6a3d", .7, { p: [0, -.7, 0], to: rk })];
  const puffs = []; for (let i = 0; i < 7; i++) { const a = i / 7 * ${PI} * 2; puffs.push(K.sph(.24 + (i % 3) * .06, M.m3, { p: [Math.cos(a) * .7, -1.05, Math.sin(a) * .5] })); }
  K.tick = (t) => { fl.forEach((s, i) => s.scale.setScalar((i ? .6 : .9) + Math.sin(t * 18 + i) * .08)); rk.position.y = Math.sin(t * 1.3) * .06; puffs.forEach((p, i) => p.scale.setScalar(1 + Math.sin(t * 1.5 + i) * .08)); };`,

  /* Simpul torus mengilap + bola yang mengorbit. */
  knot: `
  const k = K.mesh(new THREE.TorusKnotGeometry(.78, .26, 220, 28, 2, 3), K.std(M.m1.color.getStyle(), { roughness: .18, metalness: .35 }));
  M.m1 = k.material;
  K.tor(1.55, .015, M.m2, { r: [${PI} / 2.4, 0, 0] });
  const orb = [0, 1, 2].map((i) => K.sph(.16 - i * .03, i ? M.m3 : M.m2, {}));
  K.tick = (t) => { k.rotation.y = t * .25; orb.forEach((o, i) => { const a = t * (.6 + i * .25) + i * 2.1; o.position.set(Math.cos(a) * 1.55, Math.sin(a) * 1.55 * .42, Math.sin(a) * 1.55 * .9); }); };`,

  /* Kamera mirrorless + lensa. */
  camera: `
  K.box(2.1, 1.3, .72, .14, M.dk);
  K.box(.55, 1.2, .82, .2, M.m1, { p: [.82, -.02, .04] });
  K.box(.7, .32, .5, .08, M.dk, { p: [-.35, .76, -.05] });
  K.cyl(.12, .12, .1, M.m1, { p: [.75, .72, .05] }); K.cyl(.16, .16, .08, M.mt, { p: [.35, .7, .05] }, 24);
  K.cyl(.55, .55, .3, M.mt, { p: [-.2, -.05, .5], r: [${PI} / 2, 0, 0] }, 48);
  K.cyl(.52, .55, .5, M.dk, { p: [-.2, -.05, .88], r: [${PI} / 2, 0, 0] }, 48);
  K.tor(.5, .03, M.m2, { p: [-.2, -.05, 1.0] });
  K.cyl(.42, .42, .04, M.gl2, { p: [-.2, -.05, 1.12], r: [${PI} / 2, 0, 0] }, 48);
  K.sph(.08, K.std("#ffffff", { emissive: "#ffffff", emissiveIntensity: .6 }), { p: [-.05, .1, 1.13] });`,

  /* Tumpukan buku + toga + pensil. */
  edu: `
  const bk = (w, h, d, c, p, ry) => { K.box(w, h, d, .03, c, { p, r: [0, ry, 0] }); K.box(w - .08, h - .06, d - .02, .01, M.m3, { p: [p[0] + .05 * Math.cos(ry), p[1], p[2] - .05 * Math.sin(ry)], r: [0, ry, 0] }); };
  bk(2.0, .28, 1.4, M.m1, [0, .14, 0], .1); bk(1.8, .24, 1.3, M.m2, [.05, .41, 0], -.12); bk(1.9, .26, 1.35, M.dk, [-.03, .66, 0], .05);
  K.cyl(.42, .48, .3, M.dk, { p: [0, .95, 0] }, 40);
  K.box(1.6, .05, 1.6, .01, M.dk, { p: [0, 1.12, 0], r: [0, ${PI} / 4, 0] });
  K.cyl(.06, .06, .05, M.m2, { p: [0, 1.16, 0] });
  K.cyl(.012, .012, .7, M.m2, { p: [.55, .82, .55] }); K.sph(.07, M.m2, { p: [.55, .45, .55], s: [1, 1.8, 1] });
  K.cyl(.07, .07, 1.6, M.m2, { p: [.2, .05, 1.0], r: [0, .5, ${PI} / 2] }, 6);`,

  /* Kapsul obat + tanda tambah. */
  pill: `
  const pill = (p, r) => { const g = K.grp({ p, r }); K.cyl(.32, .32, .62, M.m1, { p: [0, .31, 0], to: g }, 40); K.sph(.32, M.m1, { p: [0, .62, 0], to: g }); K.cyl(.32, .32, .62, M.m3, { p: [0, -.31, 0], to: g }, 40); K.sph(.32, M.m3, { p: [0, -.62, 0], to: g }); return g; };
  const a = pill([-.45, .2, .3], [.3, 0, .9]), b = pill([.6, -.15, .5], [-.4, .3, -.5]);
  K.ext([[-.25,-.8],[.25,-.8],[.25,-.25],[.8,-.25],[.8,.25],[.25,.25],[.25,.8],[-.25,.8],[-.25,.25],[-.8,.25],[-.8,-.25],[-.25,-.25]], .3, M.m2, { p: [0, .3, -.7] }, .07);
  K.tick = (t) => { a.rotation.y = t * .5; b.rotation.y = -t * .4; };`,

  /* Koper + bola dunia kecil. */
  suitcase: `
  K.box(1.5, 2.0, .72, .16, M.m1, { p: [0, 1.15, 0] });
  for (let i = -1; i <= 1; i++) K.box(.1, 1.9, .06, .03, M.m2, { p: [i * .42, 1.15, .37] });
  K.tor(.24, .05, M.dk, { p: [0, 2.15, 0] }, ${PI});
  K.cyl(.06, .06, .4, M.mt, { p: [-.4, 2.3, 0] }); K.cyl(.06, .06, .4, M.mt, { p: [.4, 2.3, 0] }); K.box(.9, .06, .08, .03, M.dk, { p: [0, 2.5, 0] });
  [[-.55,.25],[.55,.25],[-.55,-.25],[.55,-.25]].forEach(([x, z]) => K.cyl(.1, .1, .08, M.dk, { p: [x, .1, z], r: [0, 0, ${PI} / 2] }, 20));
  K.cyl(.22, .22, .02, M.m3, { p: [.3, 1.6, .38], r: [${PI} / 2, 0, 0] }); K.cyl(.16, .16, .02, M.m2, { p: [-.35, .7, .38], r: [${PI} / 2, 0, 0] });
  const gl = K.sph(.5, M.m2, { p: [1.35, .8, .2] }); gl.material = K.std(M.m2.color.getStyle()); gl.material.map = K.tex("globe"); M.m2b = gl.material;
  K.tor(.6, .025, M.mt, { p: [1.35, .8, .2], r: [0, ${PI} / 2, .4] }, ${PI} * 1.2); K.cyl(.05, .05, .4, M.mt, { p: [1.35, .1, .2] }); K.cyl(.3, .3, .06, M.mt, { p: [1.35, -.1, .2] });
  K.tick = (t) => { gl.rotation.y = t * .4; };`,

  /* Mangkuk ramen dengan mi, telur, nori, sumpit. */
  bowl: `
  K.lathe([[0,0],[.5,0],[.56,.06],[1.12,.82],[1.17,.88],[1.1,.88],[.52,.14],[0,.14]], M.m1, {}, 64);
  K.cyl(1.06, 1.06, .02, K.std("#e3ae5f", { roughness: .25 }), { p: [0, .74, 0] }, 56);
  for (let i = 0; i < 16; i++) K.tor(.22 + (i % 3) * .05, .028, K.M.noodle || (K.M.noodle = K.std("#f3dc9b", { roughness: .4 })), { p: [Math.cos(i * 2.4) * .45, .76, Math.sin(i * 2.4) * .45], r: [${PI} / 2, 0, i] });
  const egg = (x, z) => { K.sph(.22, K.std("#fbf7ee"), { p: [x, .78, z], s: [1, .45, 1.3] }); K.sph(.11, K.std("#f2a33a", { roughness: .3 }), { p: [x, .86, z], s: [1, .4, 1] }); };
  egg(.45, .3); egg(.62, -.1);
  K.box(.55, .65, .02, 0, M.dk, { p: [-.45, 1.0, -.55], r: [-.3, .3, 0] });
  K.cyl(.28, .28, .07, M.m2, { p: [-.35, .79, .35] }); K.cyl(.26, .26, .07, M.m2, { p: [-.05, .8, .55] });
  K.cyl(.02, .035, 2.3, M.m2, { p: [.1, .95, -.05], r: [0, .4, ${PI} / 2 - .06] }); K.cyl(.02, .035, 2.3, M.m2, { p: [.1, .95, .07], r: [0, .3, ${PI} / 2 - .06] });`,

  /* Rumah dengan atap, pintu, jendela, pohon. */
  house: `
  K.box(3.4, .12, 2.6, .05, K.std("#7fb069", { roughness: .9 }), { p: [0, -.06, 0] });
  K.box(2.0, 1.25, 1.4, .03, M.m3, { p: [0, .62, 0] });
  K.ext([[-1.2,0],[1.2,0],[0,.85]], 1.65, M.m1, { p: [0, 1.66, 0] }, .03);
  K.box(.24, .55, .24, .02, M.m1, { p: [.55, 1.85, -.2] });
  K.box(.42, .78, .05, .02, M.m2, { p: [-.3, .39, .71] }); K.sph(.03, M.mt, { p: [-.15, .4, .75] });
  K.box(.46, .4, .04, .02, M.gl2, { p: [.48, .72, .71] }); K.box(.5, .06, .1, .02, M.m2, { p: [.48, .48, .74] });
  K.box(.04, .4, .4, .02, M.gl2, { p: [1.01, .72, .1] });
  K.box(.8, .08, .5, .02, M.m2, { p: [-.3, .04, .95] });
  K.cyl(.07, .1, .7, K.std("#7a5233"), { p: [-1.3, .35, .6] }); K.sph(.42, K.std("#4f8f46", { roughness: .8 }), { p: [-1.3, .95, .6], s: [1, 1.15, 1] });
  K.sph(.25, K.std("#5ea052", { roughness: .8 }), { p: [1.35, .22, .8] });`,

  /* Koin bertumpuk + grafik batang naik. */
  coins: `
  for (let i = 0; i < 7; i++) K.cyl(.55, .55, .12, M.au, { p: [-.85, .06 + i * .125, .2], r: [0, i * .3, 0] }, 48);
  for (let i = 0; i < 4; i++) K.cyl(.55, .55, .12, M.au, { p: [.15, .06 + i * .125, .75], r: [0, i * .5, 0] }, 48);
  const c = K.grp({ p: [.9, .62, .5], r: [0, -.5, .15] });
  K.cyl(.6, .6, .1, M.au, { r: [${PI} / 2, 0, 0], to: c }, 48); K.tor(.48, .03, M.au, { p: [0, 0, .06], to: c });
  K.box(.12, .5, .04, .02, M.au, { p: [0, 0, .07], to: c }); K.box(.32, .1, .04, .02, M.au, { p: [0, .1, .07], to: c });
  [.9, 1.4, 2.0].forEach((h, i) => K.box(.42, h, .42, .06, i === 2 ? M.m2 : M.m1, { p: [-.4 + i * .55, h / 2, -.65] }));
  const arrow = K.ext([[0,0],[1.6,1.1],[1.5,1.3],[1.95,1.35],[1.85,.9],[1.72,1.05],[.12,-.12]], .08, M.m2, { p: [.2, 2.1, -.3] }, .02);
  K.tick = (t) => { c.rotation.y = -.5 + Math.sin(t * .9) * .4; arrow.position.y = 2.1 + Math.sin(t * 1.4) * .05; };`,

  /* Tempat tidur hotel + lampu meja. */
  bed: `
  K.box(2.4, .32, 1.9, .06, M.m2, { p: [0, .26, 0] });
  K.box(2.6, 1.3, .16, .06, M.m2, { p: [0, .75, -.95] });
  K.box(2.3, .32, 1.8, .14, M.m3, { p: [0, .56, .02] });
  K.box(2.34, .1, 1.1, .05, M.m1, { p: [0, .74, .37] });
  K.box(2.34, .06, .2, .03, M.m3, { p: [0, .79, -.1] });
  K.box(.85, .24, .5, .12, M.m3, { p: [-.5, .84, -.55], r: [-.3, 0, 0] }); K.box(.85, .24, .5, .12, M.m3, { p: [.5, .84, -.55], r: [-.3, 0, 0] });
  K.box(.5, .1, .2, .05, M.m1, { p: [0, .86, -.35] });
  K.box(.55, .55, .5, .05, M.m2, { p: [1.65, .28, -.6] });
  K.cyl(.05, .1, .5, M.mt, { p: [1.65, .8, -.6] });
  K.cyl(.18, .28, .3, M.m1, { p: [1.65, 1.15, -.6] }, 32, true);
  K.spr("#ffd9a0", 1.1, { p: [1.65, 1.1, -.6] });`,

  /* Dumbel + kettlebell. */
  dumbbell: `
  const db = K.grp({ p: [0, .55, 0], r: [0, .3, 0] });
  K.cyl(.08, .08, 1.9, M.mt, { r: [0, 0, ${PI} / 2], to: db }, 24);
  [-1, 1].forEach((s) => { K.cyl(.55, .55, .18, M.m1, { p: [s * .5, 0, 0], r: [0, 0, ${PI} / 2], to: db }, 48); K.cyl(.45, .45, .16, M.m1, { p: [s * .68, 0, 0], r: [0, 0, ${PI} / 2], to: db }, 48); K.cyl(.14, .14, .12, M.m2, { p: [s * .82, 0, 0], r: [0, 0, ${PI} / 2], to: db }, 24); });
  K.lathe([[0,0],[.35,0],[.5,.2],[.52,.45],[.4,.72],[0,.78]], M.m2, { p: [1.0, -.0, .9] });
  K.tor(.26, .07, M.m2, { p: [1.0, .9, .9] }, ${PI});
  K.box(1.2, .06, .7, .03, M.dk, { p: [-.5, 0, .9] });`,

  /* Botol parfum kaca + lipstik. */
  perfume: `
  K.cyl(1.4, 1.5, .14, M.m3, { p: [0, .07, 0] }, 64);
  K.box(1.15, 1.45, .62, .16, M.gl, { p: [0, .9, 0] });
  const liq = K.box(1.0, 1.0, .5, .12, M.m1, { p: [0, .72, 0] });
  K.cyl(.12, .12, .2, M.au, { p: [0, 1.72, 0] }, 24);
  K.mesh(new THREE.IcosahedronGeometry(.36, 0), M.m2, { p: [0, 2.05, 0] });
  K.cyl(.18, .18, .7, M.au, { p: [1.05, .5, .35] }, 32);
  K.cyl(.14, .14, .3, M.m1, { p: [1.05, 1.0, .35] }, 32);
  K.cyl(.02, .14, .14, M.m1, { p: [1.05, 1.22, .35], r: [.6, 0, 0] }, 32);
  K.cyl(.19, .19, .55, M.m2, { p: [-1.0, .42, .4], r: [0, 0, ${PI} / 2] }, 32);`,

  /* Mobil. */
  car: `
  const root = K.g;${CAR}`,

  /* Mobil + busa & gelembung cuci. */
  carwash: `
  const root = K.g;${CAR}
  const foam = K.std("#ffffff", { roughness: .9 });
  for (let i = 0; i < 9; i++) K.sph(.16 + (i % 3) * .05, foam, { p: [-.6 + i * .16, 1.5 + (i % 2) * .05, (i % 3 - 1) * .2] });
  const bub = []; for (let i = 0; i < 16; i++) bub.push(K.sph(.08 + (i % 4) * .04, M.gl, { p: [(i / 16 - .5) * 4, .6 + (i % 5) * .35, (i % 2 ? 1 : -1) * (.9 + (i % 3) * .2)] }));
  K.tick = (t) => bub.forEach((b, i) => { b.position.y = .4 + ((t * .25 + i * .13) % 1) * 2.2; });`,

  /* Piringan hitam di atas pemutar + sampul album. */
  vinyl: `
  K.box(2.6, .26, 2.0, .08, M.m2, { p: [0, .13, 0] });
  K.cyl(.88, .88, .07, M.mt, { p: [-.3, .3, 0] }, 64);
  const rec = K.grp({ p: [-.3, .35, 0] });
  K.cyl(.84, .84, .025, K.std("#111114", { roughness: .3 }), { to: rec }, 64);
  for (let i = 0; i < 5; i++) K.tor(.4 + i * .08, .004, K.std("#2a2a30"), { p: [0, .014, 0], r: [${PI} / 2, 0, 0], to: rec });
  K.cyl(.28, .28, .028, M.m1, { to: rec }, 48); K.cyl(.03, .03, .05, M.mt, { to: rec });
  K.cyl(.12, .12, .14, M.mt, { p: [.85, .33, -.6] }, 24);
  K.cyl(.025, .025, 1.2, M.mt, { p: [.6, .42, -.15], r: [${PI} / 2, -.35, 0] });
  K.box(.12, .05, .18, .02, M.dk, { p: [.38, .42, .4] });
  K.cyl(.08, .08, .08, M.m1, { p: [1.0, .3, .7] }); K.cyl(.08, .08, .08, M.m1, { p: [.75, .3, .7] });
  const sl = K.box(1.6, 1.6, .04, .02, M.m1, { p: [.2, .8, -1.1], r: [-.15, -.2, 0] }); sl.material = K.std(M.m1.color.getStyle()); sl.material.map = K.tex("rings"); M.m1b = sl.material;
  K.tick = (t) => { rec.rotation.y = -t * 1.6; };`,

  /* Helm proyek + bata + penggaris. */
  helmet: `
  K.lathe([[0,1.1],[.42,1.06],[.72,.84],[.86,.5],[.88,.34],[1.2,.26],[1.22,.2],[0,.2]], M.m1, { p: [0, .2, 0] }, 64);
  K.box(.18, .12, 1.5, .05, M.m1, { p: [0, 1.25, 0], r: [.05, 0, 0] });
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3 - (r === 2 ? 1 : 0); c++) K.box(.62, .26, .3, .03, M.m2, { p: [-1.6 + c * .66 + (r % 2) * .33, .13 + r * .28, .8] });
  K.box(1.4, .04, .2, .01, M.au, { p: [1.0, .02, .9], r: [0, -.4, 0] });`,

  /* Mangkuk makan hewan + tulang + bola. */
  petbowl: `
  K.lathe([[0,0],[.8,0],[1.0,.38],[.94,.42],[.72,.1],[0,.1]], M.m1, {}, 64);
  const kib = K.std("#8a5a32", { roughness: .7 });
  for (let i = 0; i < 26; i++) { const a = i * 2.4, r = (i % 6) * .11; K.sph(.09, kib, { p: [Math.cos(a) * r, .18 + (i % 3) * .05, Math.sin(a) * r], s: [1, .7, 1] }); }
  const bone = K.grp({ p: [1.0, .14, .8], r: [0, .6, 0] });
  K.cyl(.1, .1, .9, M.m3, { r: [0, 0, ${PI} / 2], to: bone }); [[-.48,.1],[-.48,-.1],[.48,.1],[.48,-.1]].forEach(([x, z]) => K.sph(.14, M.m3, { p: [x, 0, z], to: bone }));
  const ball = K.sph(.32, M.m2, { p: [-1.1, .32, .6] }); K.tor(.32, .03, M.m3, { p: [-1.1, .32, .6], r: [.4, .2, 0] });
  K.tick = (t) => { ball.rotation.z = t; };`,

  /* Tanaman dalam pot + tunas. */
  plant: `
  K.lathe([[0,0],[.42,0],[.6,.85],[.66,.88],[.66,.95],[0,.95]], M.m1, {}, 48);
  K.cyl(.6, .6, .04, K.std("#4a3020"), { p: [0, .93, 0] });
  const leaf = M.m2;
  for (let i = 0; i < 9; i++) { const a = i / 9 * ${PI} * 2, l = K.grp({ p: [0, .95, 0], r: [0, a, 0] }); K.sph(.32, leaf, { p: [.35 + (i % 2) * .1, .5 + (i % 3) * .2, 0], r: [0, 0, -.7], s: [1.6, .3, .7], to: l }); K.cyl(.02, .02, .7, leaf, { p: [.18, .25, 0], r: [0, 0, -.5], to: l }); }`,

  /* Kardus paket bertumpuk dengan label. */
  parcel: `
  const lab = K.screen(256, 160, (g, w, h) => { g.fillStyle = "#fff"; g.fillRect(0, 0, w, h); g.fillStyle = "#111"; for (let i = 0; i < 40; i++) g.fillRect(16 + i * 5.6, 70, (i % 3) + 1.5, 70); g.font = "700 26px system-ui, sans-serif"; g.fillText(BRAND.slice(0, 14), 16, 44); });
  const bx = (w, h, d, p, ry) => { const g = K.grp({ p, r: [0, ry, 0] }); K.box(w, h, d, .03, M.m1, { to: g }); K.box(w + .01, .04, .28, 0, M.m2, { p: [0, h / 2, 0], to: g }); K.box(.28, h + .01, d + .01, 0, M.m2, { p: [0, 0, 0], to: g }); K.plane(w * .35, w * .22, lab, { p: [-w * .22, -h * .15, d / 2 + .012], to: g }); return g; };
  bx(1.6, 1.15, 1.2, [0, .58, 0], .1); bx(1.1, .8, .9, [.15, 1.56, .05], -.2); bx(.8, .6, .7, [1.35, .3, .6], .5);
  K.box(2.2, .14, 1.8, .02, M.m2, { p: [0, -.07, 0] });`,

  /* Stik permainan. */
  gamepad: `
  const gp = K.grp({ r: [.5, 0, 0] });
  K.box(2.0, 1.0, .46, .36, M.m1, { to: gp });
  K.cap(.36, .55, M.m1, { p: [-.85, -.42, 0], r: [0, 0, .55], to: gp }); K.cap(.36, .55, M.m1, { p: [.85, -.42, 0], r: [0, 0, -.55], to: gp });
  [[-.45,-.2],[.35,-.2]].forEach(([x, y]) => { K.cyl(.17, .17, .1, M.dk, { p: [x, y, .26], r: [${PI} / 2, 0, 0], to: gp }); K.cyl(.13, .15, .12, M.dk, { p: [x, y, .36], r: [${PI} / 2, 0, 0], to: gp }); });
  K.box(.36, .11, .06, .02, M.dk, { p: [-.65, .2, .24], to: gp }); K.box(.11, .36, .06, .02, M.dk, { p: [-.65, .2, .24], to: gp });
  [[.65,.36],[.65,.04],[.49,.2],[.81,.2]].forEach(([x, y], i) => K.sph(.075, i % 2 ? M.m2 : M.m3, { p: [x, y, .24], to: gp }));
  K.box(.3, .1, .3, .04, M.m2, { p: [-.7, .5, -.05], to: gp }); K.box(.3, .1, .3, .04, M.m2, { p: [.7, .5, -.05], to: gp });
  K.box(.12, .05, .04, .02, M.m3, { p: [-.12, .25, .24], to: gp }); K.box(.12, .05, .04, .02, M.m3, { p: [.12, .25, .24], to: gp });
  K.tick = (t) => { gp.rotation.z = Math.sin(t * .8) * .06; };`,

  /* Panel surya + turbin angin. */
  energy: `
  const sp = K.grp({ p: [-.6, .7, .3], r: [-.9, .35, 0] });
  K.box(2.0, 1.3, .06, .02, M.mt, { to: sp });
  const cell = K.std(M.m1.color.getStyle(), { roughness: .25, metalness: .4 }); cell.map = K.tex("grid"); M.m1 = cell;
  K.plane(1.9, 1.2, cell, { p: [0, 0, .035], to: sp });
  K.cyl(.05, .05, .9, M.mt, { p: [-.6, .3, -.1] });
  K.lathe([[0,0],[.1,0],[.05,2.6],[0,2.6]], M.m3, { p: [1.05, 0, -.4] });
  K.cap(.1, .28, M.m3, { p: [1.05, 2.62, -.3], r: [${PI} / 2, 0, 0] });
  const hub = K.grp({ p: [1.05, 2.62, -.1] });
  for (let i = 0; i < 3; i++) { const b = K.grp({ r: [0, 0, i * ${PI} * 2 / 3], to: hub }); K.ext([[-.06,0],[.06,0],[.04,1.2],[-.02,1.25]], .02, M.m2, { p: [0, .62, 0], to: b }, .01); }
  K.sph(.08, M.m3, { to: hub });
  K.tick = (t) => { hub.rotation.z = -t * 1.4; };`,

  /* Truk pindahan + kardus. */
  truck: `
  K.box(2.5, 1.55, 1.5, .06, M.m3, { p: [-.45, 1.05, 0] });
  K.box(2.52, .3, 1.52, .02, M.m1, { p: [-.45, .65, 0] });
  K.box(1.05, 1.15, 1.45, .14, M.m1, { p: [1.35, .82, 0] });
  K.box(.04, .5, 1.25, .02, M.gl2, { p: [1.88, 1.05, 0] }); K.box(.6, .42, .04, .02, M.gl2, { p: [1.35, 1.05, .73] });
  K.box(3.6, .14, 1.3, .02, M.dk, { p: [0, .3, 0] });
  [[1.3,.75],[1.3,-.75],[-.3,.75],[-.3,-.75],[-1.2,.75],[-1.2,-.75]].forEach(([x, z]) => { K.cyl(.32, .32, .26, M.dk, { p: [x, .32, z], r: [${PI} / 2, 0, 0] }, 28); K.cyl(.16, .16, .28, M.mt, { p: [x, .32, z], r: [${PI} / 2, 0, 0] }, 20); });
  const card = K.std("#c9955c", { roughness: .85 });
  K.box(.6, .45, .5, .02, card, { p: [-2.2, .22, .6] }); K.box(.45, .35, .4, .02, card, { p: [-2.15, .62, .55], r: [0, .3, 0] });
  K.box(.08, .12, .3, .02, K.std("#fff6d8", { emissive: "#fff2c4", emissiveIntensity: 1.2 }), { p: [1.9, .62, .5] });`,

  /* Gembok + perisai + kunci. */
  lock: `
  K.ext([[0,1.3],[1.1,1.0],[1.0,-.2],[0,-1.2],[-1.0,-.2],[-1.1,1.0]], .18, M.m2, { p: [0, .9, -.5] }, .06);
  K.box(1.4, 1.2, .5, .18, M.m1, { p: [0, .65, .1] });
  K.tor(.45, .11, M.mt, { p: [0, 1.25, .1] }, ${PI});
  K.cyl(.11, .11, .25, M.mt, { p: [-.45, 1.2, .1] }); K.cyl(.11, .11, .25, M.mt, { p: [.45, 1.2, .1] });
  K.cyl(.12, .12, .04, M.dk, { p: [0, .75, .37], r: [${PI} / 2, 0, 0] }); K.box(.08, .28, .04, .02, M.dk, { p: [0, .58, .37] });
  const key = K.grp({ p: [1.25, .25, .5], r: [0, -.3, -.4] });
  K.tor(.2, .06, M.au, { to: key }); K.cyl(.05, .05, .9, M.au, { p: [0, -.65, 0], to: key }); K.box(.18, .08, .05, .01, M.au, { p: [.1, -.9, 0], to: key }); K.box(.14, .08, .05, .01, M.au, { p: [.08, -.72, 0], to: key });`,

  /* Kacamata + kotak kacamata. */
  glasses: `
  const gs = K.grp({ p: [0, .9, 0], r: [-.15, 0, 0] });
  [-1, 1].forEach((s) => { K.tor(.52, .065, M.m1, { p: [s * .66, 0, 0], to: gs }); K.cyl(.5, .5, .02, M.gl, { p: [s * .66, 0, 0], r: [${PI} / 2, 0, 0], to: gs }, 48); K.cyl(.035, .035, 1.6, M.m1, { p: [s * 1.17, .05, -.8], r: [${PI} / 2, 0, 0], to: gs }); K.cyl(.035, .03, .4, M.m1, { p: [s * 1.17, -.1, -1.65], r: [-.5, 0, 0], to: gs }); });
  K.tor(.16, .045, M.m1, { p: [0, .08, 0], to: gs }, ${PI});
  K.box(2.4, .55, .95, .27, M.m2, { p: [0, .27, -.2] });
  K.box(2.2, .04, .8, .02, M.m3, { p: [0, .55, -.2] });`,

  /* Gigi + sikat gigi + kilau. */
  tooth: `
  const t = K.grp({ p: [0, .3, 0] });
  [[-.28,.22],[.28,.22],[-.28,-.22],[.28,-.22]].forEach(([x, z]) => K.sph(.42, M.m3, { p: [x, 1.15, z], s: [1, .8, 1], to: t }));
  K.cyl(.62, .5, .7, M.m3, { p: [0, .8, 0], to: t }, 40);
  K.cyl(.25, .06, 1.0, M.m3, { p: [-.26, .05, 0], r: [0, 0, -.15], to: t }); K.cyl(.25, .06, 1.0, M.m3, { p: [.26, .05, 0], r: [0, 0, .15], to: t });
  const br = K.grp({ p: [1.2, .6, .6], r: [0, -.4, .9] });
  K.cap(.09, 2.0, M.m1, { to: br }); K.box(.22, .5, .14, .06, M.m1, { p: [0, 1.25, 0], to: br });
  for (let i = 0; i < 6; i++) K.box(.16, .07, .22, .02, M.m2, { p: [0, 1.06 + i * .08, .16], to: br });
  const sp = [K.spr("#ffffff", .6, { p: [-.8, 1.9, .3] }), K.spr("#ffffff", .4, { p: [.7, 2.0, -.2] })];
  K.tick = (tt) => sp.forEach((s, i) => s.scale.setScalar(.3 + Math.abs(Math.sin(tt * 2 + i * 1.7)) * .4));`,

  /* Buket bunga dalam kertas. */
  bouquet: `
  K.lathe([[.06,0],[.95,1.65],[.9,1.68],[.04,.04]], M.m3, {}, 40);
  K.tor(.32, .05, M.m1, { p: [0, .55, 0], r: [${PI} / 2, 0, 0] });
  const stem = K.std("#4f8a3c");
  const flower = (p, c, k) => { const f = K.grp({ p, r: [(K.rnd() - .5) * .6, 0, (K.rnd() - .5) * .6] }); for (let i = 0; i < 7; i++) { const a = i / 7 * ${PI} * 2; K.sph(.2 * k, c, { p: [Math.cos(a) * .2 * k, 0, Math.sin(a) * .2 * k], r: [0, -a, .5], s: [1.1, .35, .7], to: f }); } K.sph(.11 * k, M.m3, { p: [0, .05, 0], to: f }); K.cyl(.02, .02, 1.5, stem, { p: [0, -.75, 0], to: f }); };
  [[0,2.0,0],[.45,1.85,.2],[-.45,1.85,.15],[.2,1.7,-.4],[-.25,1.72,-.38],[.05,1.62,.48],[-.55,1.55,-.05],[.6,1.55,-.15]].forEach((p, i) => flower(p, i % 2 ? M.m2 : M.m1, i ? .9 : 1.1));
  for (let i = 0; i < 6; i++) { const a = i / 6 * ${PI} * 2; K.sph(.3, stem, { p: [Math.cos(a) * .6, 1.55, Math.sin(a) * .6], r: [0, -a, .8], s: [1.2, .2, .45] }); }`,

  /* Tiang museum + guci di atas alas + bingkai lukisan. */
  museum: `
  K.box(1.0, .2, 1.0, .02, M.m3, { p: [-1.2, .1, -.3] }); K.cyl(.32, .36, 2.4, M.m3, { p: [-1.2, 1.4, -.3] }, 20); K.box(.9, .2, .9, .02, M.m3, { p: [-1.2, 2.7, -.3] });
  K.box(.9, 1.1, .9, .03, M.m3, { p: [.5, .55, .3] });
  K.lathe([[0,0],[.18,0],[.3,.15],[.45,.55],[.38,.85],[.18,1.05],[.16,1.2],[.24,1.28],[0,1.28]], M.m1, { p: [.5, 1.1, .3] }, 48);
  K.tor(.18, .035, M.m1, { p: [.82, 1.95, .3], r: [0, ${PI} / 2, 0] }, ${PI}); K.tor(.18, .035, M.m1, { p: [.18, 1.95, .3], r: [0, ${PI} / 2, ${PI}] }, ${PI});
  K.tor(.4, .02, M.m2, { p: [.5, 1.55, .3], r: [${PI} / 2, 0, 0] });
  K.box(1.7, 1.2, .08, .02, M.au, { p: [.6, 2.4, -.9] });
  K.plane(1.5, 1.0, K.screen(450, 300, (g, w, h) => { g.fillStyle = COL.bg; g.fillRect(0, 0, w, h); g.fillStyle = COL.accent; g.beginPath(); g.arc(w * .3, h * .45, 70, 0, 7); g.fill(); g.fillStyle = COL.accent2; g.fillRect(w * .45, h * .2, 160, 150); g.fillStyle = COL.ink; g.fillRect(0, h * .78, w, 6); }), { p: [.6, 2.4, -.85] });`,

  /* Kapal layar + ombak + pelampung. */
  boat: `
  const b = K.grp();
  K.ext([[-1.6,.62],[1.9,.62],[1.3,0],[-1.25,0]], 1.0, M.m1, { keep: 1, p: [0, 0, -.5], to: b }, .08);
  K.box(3.0, .06, .92, .02, M.m2, { p: [0, .7, 0], to: b });
  K.box(1.0, .5, .7, .08, M.m3, { p: [-.6, .98, 0], to: b }); K.box(.8, .1, .04, .02, M.gl2, { p: [-.6, 1.05, .36], to: b });
  K.cyl(.04, .04, 2.6, M.m2, { p: [.3, 2.0, 0], to: b });
  const sail = K.ext([[0,0],[1.4,0],[0,2.2]], .02, M.m3, { keep: 1, p: [.34, .9, 0], to: b }, 0); sail.material = K.std("#fbf8f1", { side: THREE.DoubleSide });
  K.ext([[0,0],[.35,.12],[0,.24]], .01, M.m2, { keep: 1, p: [.33, 3.1, 0], to: b }, 0);
  const sea = K.std(M.m2.color.getStyle(), { roughness: .2, transparent: true, opacity: .5 });
  const waves = [0, 1, 2].map((i) => K.tor(1.9 + i * .45, .03, sea, { p: [0, .12, 0], r: [${PI} / 2, 0, 0] }));
  const buoy = K.grp({ p: [2.0, .1, 1.0] }); K.tor(.22, .08, M.m1, { r: [${PI} / 2, 0, 0], to: buoy });
  K.tick = (t) => { b.rotation.z = Math.sin(t * 1.1) * .04; b.position.y = Math.sin(t * 1.3) * .05; waves.forEach((w, i) => w.scale.setScalar(1 + ((t * .15 + i / 3) % 1) * .25)); buoy.position.y = .1 + Math.sin(t * 1.6) * .06; };`,

  /* Papan klap film + gulungan film. */
  clapper: `
  const st = K.tex("stripe");
  K.box(2.1, 1.4, .1, .03, M.dk, { p: [0, .7, 0] });
  const bar = K.std(M.m1.color.getStyle()); bar.map = st; M.m1 = bar;
  K.box(2.1, .26, .11, .02, bar, { p: [0, 1.53, 0] });
  const top = K.grp({ p: [-1.05, 1.68, 0], r: [0, 0, .32] }); K.box(2.1, .26, .11, .02, bar, { p: [1.05, .13, 0], to: top });
  K.plane(1.9, 1.15, K.screen(640, 380, (g, w, h) => { g.strokeStyle = "rgba(255,255,255,.8)"; g.lineWidth = 3; g.strokeRect(10, 10, w - 20, h - 20); g.beginPath(); g.moveTo(10, 130); g.lineTo(w - 10, 130); g.moveTo(10, 250); g.lineTo(w - 10, 250); g.moveTo(w / 2, 130); g.lineTo(w / 2, 250); g.stroke(); g.fillStyle = "#fff"; g.font = "700 46px system-ui, sans-serif"; g.fillText(BRAND.slice(0, 18).toUpperCase(), 30, 90); g.font = "500 30px system-ui, sans-serif"; g.fillText("SCENE  12", 30, 205); g.fillText("TAKE  3", w / 2 + 20, 205); g.fillText("ROLL  A07", 30, 320); }), { p: [0, .65, .055] });
  const reel = K.grp({ p: [1.35, .55, -.6], r: [0, -.6, 0] });
  K.cyl(.75, .75, .1, M.mt, { r: [${PI} / 2, 0, 0], to: reel }, 48);
  for (let i = 0; i < 5; i++) { const a = i / 5 * ${PI} * 2; K.cyl(.17, .17, .12, M.dk, { p: [Math.cos(a) * .4, Math.sin(a) * .4, 0], r: [${PI} / 2, 0, 0], to: reel }, 24); }
  K.tick = (t) => { top.rotation.z = .32 + Math.max(0, Math.sin(t * 1.2)) * .1; reel.rotation.z = t * .5; };`,

  /* Mikrofon podcast + headphone. */
  mic: `
  const m = K.grp({ p: [0, .2, 0], r: [.15, 0, 0] });
  const grill = K.std(M.mt.color.getStyle(), { metalness: .9, roughness: .35 }); grill.map = K.tex("dots");
  K.cap(.42, .7, grill, { p: [0, 1.6, 0], to: m });
  K.tor(.43, .05, M.m1, { p: [0, 1.45, 0], r: [${PI} / 2, 0, 0], to: m });
  K.cyl(.35, .28, 1.0, M.m1, { p: [0, .75, 0], to: m }, 40);
  K.cyl(.05, .05, .7, M.dk, { p: [0, .05, 0], to: m });
  K.cyl(.6, .65, .1, M.dk, { p: [0, -.35, 0] }, 48);
  const hp = K.grp({ p: [1.4, .1, .4], r: [-.3, -.6, .2] });
  K.tor(.62, .06, M.dk, { p: [0, .3, 0], to: hp }, ${PI});
  K.cyl(.28, .28, .2, M.m2, { p: [-.62, .25, 0], r: [0, 0, ${PI} / 2], to: hp }); K.cyl(.28, .28, .2, M.m2, { p: [.62, .25, 0], r: [0, 0, ${PI} / 2], to: hp });
  const on = K.spr(COL.accent2, .35, { p: [0, .95, .38] });
  K.tick = (t) => { on.material.opacity = .5 + Math.sin(t * 3) * .4; };`,

  /* Meja kerja: lampu meja, cangkir, tanaman. */
  desk: `
  K.box(3.2, .12, 1.8, .04, M.m2, { p: [0, 0, 0] });
  K.cyl(.32, .36, .08, M.m1, { p: [-1.0, .1, -.3] }, 40);
  K.cyl(.04, .04, 1.2, M.m1, { p: [-.95, .65, -.3], r: [0, 0, -.25] });
  K.cyl(.04, .04, 1.0, M.m1, { p: [-.55, 1.35, -.3], r: [0, 0, 1.1] });
  const head = K.grp({ p: [-.12, 1.5, -.3], r: [0, 0, -2.3] });
  K.lathe([[0,0],[.12,0],[.35,.4],[.33,.42],[0,.08]], M.m1, { to: head }, 40);
  K.spr("#fff1c9", 1.3, { p: [0, .45, 0], to: head });
  K.box(1.1, .05, .75, .04, M.dk, { p: [.55, .09, .15], r: [0, -.15, 0] }); K.box(1.08, .04, .72, .03, M.mt, { p: [.55, .13, .15], r: [0, -.15, 0] });
  K.lathe([[0,0],[.16,0],[.18,.3],[.16,.3],[0,.04]], M.m3, { p: [1.15, .06, -.55] }); K.tor(.08, .025, M.m3, { p: [1.34, .2, -.55] });
  K.lathe([[0,0],[.18,0],[.22,.3],[0,.3]], M.m3, { p: [-.1, .06, .55] });
  for (let i = 0; i < 6; i++) K.sph(.14, K.std("#4f8a3c"), { p: [-.1 + Math.cos(i) * .12, .5 + (i % 3) * .1, .55 + Math.sin(i) * .12], s: [.6, 1.4, .3], r: [0, i, .3] });`,

  /* Atom + labu Erlenmeyer. */
  atom: `
  const nu = K.grp({ p: [0, 1.0, 0] });
  for (let i = 0; i < 12; i++) { const a = i * 2.4, r = .2 + (i % 3) * .06; K.sph(.17, i % 2 ? M.m1 : M.m2, { p: [Math.cos(a) * r, Math.sin(i * 1.7) * .2, Math.sin(a) * r], to: nu }); }
  const glow = K.std("#ffffff", { emissive: COL.accent2, emissiveIntensity: .6 });
  const orbits = [0, 1, 2].map((i) => { const o = K.grp({ p: [0, 1.0, 0], r: [i * 1.05, i * .6, 0] }); K.tor(1.35, .015, M.m3, { to: o }); const e = K.sph(.1, glow, { to: o }); return [o, e]; });
  K.lathe([[0,0],[.5,0],[.55,.06],[.18,.75],[.16,1.0],[.2,1.04],[0,1.04]], M.gl, { p: [1.6, -.3, .4] }, 40);
  K.lathe([[0,.02],[.48,.02],[.33,.32],[0,.32]], M.m2, { p: [1.6, -.3, .4] }, 40);
  K.tick = (t) => { nu.rotation.y = t * .3; orbits.forEach(([o, e], i) => { const a = t * (1.1 + i * .3) + i; e.position.set(Math.cos(a) * 1.35, Math.sin(a) * 1.35, 0); }); };`,

  /* Kursi santai + meja samping. */
  chair: `
  const wood = M.m2;
  K.box(1.5, .26, 1.35, .12, M.m1, { p: [0, .6, 0] });
  K.box(1.5, 1.15, .24, .12, M.m1, { p: [0, 1.2, -.62], r: [-.22, 0, 0] });
  K.box(.12, .1, 1.4, .05, wood, { p: [-.82, .95, 0] }); K.box(.12, .1, 1.4, .05, wood, { p: [.82, .95, 0] });
  K.box(.1, .5, .1, .03, wood, { p: [-.82, .72, .5] }); K.box(.1, .5, .1, .03, wood, { p: [.82, .72, .5] });
  [[-.65,.5],[.65,.5],[-.65,-.5],[.65,-.5]].forEach(([x, z]) => K.cyl(.04, .06, .55, wood, { p: [x, .25, z], r: [z > 0 ? .15 : -.15, 0, x > 0 ? -.12 : .12] }));
  K.box(.6, .5, .18, .1, M.m3, { p: [.25, 1.05, -.38], r: [-.3, -.2, .1] });
  K.cyl(.38, .38, .05, wood, { p: [1.55, .62, .2] }, 40); K.cyl(.03, .03, .6, wood, { p: [1.55, .3, .2] }); K.cyl(.25, .25, .03, wood, { p: [1.55, .02, .2] }, 32);
  K.lathe([[0,0],[.1,0],[.14,.28],[.06,.4],[0,.4]], M.m3, { p: [1.5, .64, .15] });`,

  /* Tumpukan buku + buku terbuka. */
  books: `
  const bk = (w, h, d, c, p, ry) => { K.box(w, h, d, .03, c, { p, r: [0, ry, 0] }); K.box(w - .06, h - .06, d - .06, .01, M.m3, { p: [p[0], p[1], p[2] + .04], r: [0, ry, 0] }); };
  const cols = [M.m1, M.m2, M.dk, M.m1, M.m2];
  [[1.9,.3,1.3],[1.7,.25,1.25],[1.8,.34,1.2],[1.6,.22,1.15],[1.75,.28,1.2]].reduce((y, [w, h, d], i) => { bk(w, h, d, cols[i], [(i % 2 - .5) * .1, y + h / 2, 0], (i - 2) * .08); return y + h; }, 0);
  const ob = K.grp({ p: [0, 1.48, .05] });
  K.box(.85, .04, 1.1, .01, M.m3, { p: [-.43, .1, 0], r: [0, 0, .22], to: ob }); K.box(.85, .04, 1.1, .01, M.m3, { p: [.43, .1, 0], r: [0, 0, -.22], to: ob });
  K.box(.9, .03, 1.15, .01, M.m1, { p: [-.43, .06, 0], r: [0, 0, .22], to: ob }); K.box(.9, .03, 1.15, .01, M.m1, { p: [.43, .06, 0], r: [0, 0, -.22], to: ob });
  K.box(.06, .01, .9, 0, M.m2, { p: [0, .04, .6], r: [.9, 0, 0], to: ob });`,
};

export const MODEL_IDS = Object.keys(MODELS);
