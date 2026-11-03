/* Adegan animasi cerita 9-16 (canvas 2D). Lihat anim2ScenesA.ts untuk aturannya. */

/** 9. Jembatan kosong di bawah bulan → kereta malam lewat → kereta berhenti, tiap jendela menyalakan satu huruf → kereta pergi meninggalkan bintang. */
export const SCENE_KERETA = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const stars = []; for (let i = 0; i < 110; i++) stars.push([rnd(), rnd() * 0.55, rnd() * 6]);
  const sparks = []; for (let i = 0; i < 60; i++) sparks.push([rnd(), rnd(), rnd() * 6, 0.4 + rnd() * 0.6]);
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      for (const s of stars) { g.fillStyle = rgba("#ffffff", 0.2 + 0.5 * Math.abs(Math.sin(t * 0.6 + s[2]))); g.fillRect(s[0] * W, s[1] * H, 1.5, 1.5); }
      glowDot(W * 0.78, H * 0.2, u * 22, COL["c-3"], 0.25); g.fillStyle = api.mix(COL["c-3"], "#ffffff", 0.6); g.beginPath(); g.arc(W * 0.78, H * 0.2, u * 6, 0, 7); g.fill();
      /* Bukit dan jembatan berlengkung. */
      g.fillStyle = api.mix(COL["bg-1"], COL["bg-2"], 0.5); g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.72); g.quadraticCurveTo(W * 0.3, H * 0.6, W * 0.6, H * 0.74); g.quadraticCurveTo(W * 0.85, H * 0.82, W, H * 0.7); g.lineTo(W, H); g.fill();
      const ty = H * 0.66;
      g.fillStyle = COL["bg-1"]; g.fillRect(0, ty, W, u * 1.6);
      g.strokeStyle = COL["bg-1"]; g.lineWidth = u * 1.2;
      const span = Math.max(u * 22, W / 6);
      for (let x = -span / 2; x < W + span; x += span) { g.beginPath(); g.arc(x, ty + span * 0.75, span * 0.6, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); g.fillStyle = COL["bg-1"]; g.fillRect(x - u * 1.5, ty, u * 3, H - ty); }
      /* Kereta: lokomotif + gerbong. Posisi mengikuti babak. */
      const word = String(CONFIG.kata || "RINDU").toUpperCase().slice(0, 10).split("");
      const cars = Math.max(3, word.length), carW = Math.min(u * 15, (W * 0.9) / (cars + 1.3)), carH = carW * 0.55, gap = carW * 0.08;
      const len = (cars + 1.3) * (carW + gap);
      const enter = seg(B, 0.1, 1.0), leave = seg(B, 2.05, 2.95);
      const stopX = (W - len) / 2;
      const x0 = enter < 1 ? lerp(-len - W * 0.1, stopX, ease(enter)) : lerp(stopX, W + W * 0.2, leave * leave);
      const light = seg(B, 1.15, 1.95);
      const moving = enter < 1 || leave > 0;
      for (let i = 0; i < cars; i++) {
        const x = x0 + i * (carW + gap), y = ty - carH - u * 0.8 + (moving ? Math.sin(t * 18 + i) * 0.6 : 0);
        g.fillStyle = COL["c-2"]; g.beginPath(); g.roundRect ? g.roundRect(x, y, carW, carH, carH * 0.18) : g.rect(x, y, carW, carH); g.fill();
        g.fillStyle = rgba("#000000", 0.25); g.fillRect(x, y + carH * 0.78, carW, carH * 0.08);
        const wx = x + carW * 0.18, ww = carW * 0.64, wy = y + carH * 0.18, wh = carH * 0.48;
        const lit = 0.55 + 0.45 * seg(light, i / cars * 0.6, i / cars * 0.6 + 0.4);
        g.fillStyle = rgba(COL["c-3"], lit); g.fillRect(wx, wy, ww, wh);
        if (moving && lit > 0.5) glowDot(wx + ww / 2, wy + wh / 2, carW * 0.7, COL["c-3"], 0.12);
        const ch = word[i];
        if (ch && light > 0) { const k = seg(light, i / cars * 0.6, i / cars * 0.6 + 0.4) * (1 - leave * 3); if (k > 0) { glowDot(wx + ww / 2, wy + wh / 2, carW * 0.9, COL["c-3"], 0.3 * k); g.globalAlpha = Math.max(0, k); g.fillStyle = COL["bg-1"]; g.font = "700 " + Math.round(wh * 0.82) + "px " + getComputedStyle(document.documentElement).getPropertyValue("--font-display"); g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, wx + ww / 2, wy + wh * 0.55); g.globalAlpha = 1; } }
        g.fillStyle = COL["bg-1"]; g.beginPath(); g.arc(x + carW * 0.22, ty - u * 0.6, carH * 0.13, 0, 7); g.arc(x + carW * 0.78, ty - u * 0.6, carH * 0.13, 0, 7); g.fill();
      }
      /* Lokomotif di depan. */
      const lx = x0 + cars * (carW + gap), ly = ty - carH * 1.05 - u * 0.8;
      g.fillStyle = COL["c-1"]; g.fillRect(lx, ly + carH * 0.25, carW * 1.1, carH * 0.8); g.fillRect(lx, ly - carH * 0.05, carW * 0.45, carH * 0.4);
      g.fillRect(lx + carW * 0.75, ly - carH * 0.12, carW * 0.14, carH * 0.4);
      glowDot(lx + carW * 1.12, ly + carH * 0.6, u * 8, "#fff3c4", 0.6);
      for (let i = 0; i < 5; i++) { const k = (t * 0.6 + i / 5) % 1; if (!moving) continue; glowDot(lx + carW * 0.82 - k * u * 18, ly - carH * 0.2 - k * u * 10, u * (1.5 + k * 4), "#cfd3e6", 0.25 * (1 - k)); }
      /* Setelah kereta pergi: bintang naik dari rel. */
      if (leave > 0) for (const s of sparks) { const k = (s[1] + t * 0.08 * s[3]) % 1; const x = s[0] * W + Math.sin(t + s[2]) * u, y = lerp(ty, H * 0.1, k); glowDot(x, y, u * 1.6, COL["c-3"], 0.6 * (1 - k) * leave); }
    },
  };
}`;

/** 10. Ulat merayap di daun → membungkus diri jadi kepompong → kepompong retak, kupu-kupu membuka sayap → kupu-kupu lain berdatangan. */
export const SCENE_KUPU = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const friends = []; for (let i = 0; i < 10; i++) friends.push({ a: rnd() * 6.28, r: 0.25 + rnd() * 0.25, s: 0.4 + rnd() * 0.5, w: rnd() * 6, c: i % 2 ? "c-1" : "c-3", d: rnd() * 0.5 });
  function wings(x, y, s, open, flap, col, rot) {
    g.save(); g.translate(x, y); g.rotate(rot || 0);
    for (const side of [-1, 1]) {
      g.save(); g.scale(side * Math.max(0.05, open * (0.55 + 0.45 * Math.abs(Math.cos(flap)))), 1);
      g.fillStyle = COL[col]; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(s * 0.4, -s * 1.3, s * 1.5, -s * 1.1, s * 1.15, -s * 0.15); g.bezierCurveTo(s * 1.0, s * 0.1, s * 0.4, s * 0.05, 0, 0); g.fill();
      g.fillStyle = api.mix(COL[col], "#000000", 0.15); g.beginPath(); g.moveTo(0, s * 0.05); g.bezierCurveTo(s * 0.5, s * 0.1, s * 1.0, s * 0.5, s * 0.6, s * 0.9); g.bezierCurveTo(s * 0.3, s * 1.0, s * 0.1, s * 0.5, 0, s * 0.05); g.fill();
      g.fillStyle = rgba("#ffffff", 0.55); g.beginPath(); g.arc(s * 0.85, -s * 0.55, s * 0.12, 0, 7); g.fill();
      g.restore();
    }
    g.fillStyle = "#2b2420"; g.beginPath(); g.ellipse(0, s * 0.2, s * 0.09, s * 0.55, 0, 0, 7); g.fill();
    g.strokeStyle = "#2b2420"; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -s * 0.3); g.quadraticCurveTo(-s * 0.15, -s * 0.7, -s * 0.3, -s * 0.8); g.moveTo(0, -s * 0.3); g.quadraticCurveTo(s * 0.15, -s * 0.7, s * 0.3, -s * 0.8); g.stroke();
    g.restore();
  }
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const crawl = seg(B, 0, 0.9), wrap = seg(B, 0.9, 1.5), crack = seg(B, 1.6, 2.1), fly = seg(B, 2.1, 2.95);
      /* Dahan dan daun. */
      const by = H * 0.3, bx = W * 0.5;
      g.strokeStyle = COL["c-2"]; g.lineWidth = u * 2.2; g.lineCap = "round"; g.beginPath(); g.moveTo(-10, by - u * 6); g.quadraticCurveTo(W * 0.4, by + u * 4, W + 10, by - u * 2); g.stroke();
      const lx = W * 0.32, ly = by + u * 1.5, ls = u * 22;
      g.fillStyle = COL["c-2"] === "" ? "#4a7a3a" : api.mix(COL["c-2"], "#4c8a3c", 0.75);
      g.beginPath(); g.moveTo(lx, ly); g.quadraticCurveTo(lx + ls * 0.2, ly + ls * 0.9, lx - ls * 0.15, ly + ls * 1.5); g.quadraticCurveTo(lx - ls * 0.6, ly + ls * 0.7, lx, ly); g.fill();
      g.strokeStyle = rgba("#ffffff", 0.25); g.lineWidth = 1.5; g.beginPath(); g.moveTo(lx, ly); g.quadraticCurveTo(lx - ls * 0.1, ly + ls * 0.8, lx - ls * 0.15, ly + ls * 1.45); g.stroke();
      /* Ulat: ruas yang bergelombang, merayap dari daun ke dahan. */
      const hang = [bx, by + u * 2];
      if (wrap < 1) {
        const segs = 9, path = (k) => { if (k < 0.6) { const q = k / 0.6; return [lerp(lx - ls * 0.12, lx, q), lerp(ly + ls * 1.2, ly, q)]; } const q = (k - 0.6) / 0.4; return [lerp(lx, hang[0], q), lerp(ly, hang[1], q) - Math.sin(q * Math.PI) * u * 2]; };
        for (let i = segs - 1; i >= 0; i--) {
          const k = clampK(crawl * 0.98 - i * 0.025), p = path(k), hump = Math.max(0, Math.sin(t * 6 - i * 0.8)) * u * 0.8 * (1 - wrap);
          const r = u * (i === 0 ? 2.1 : 1.8) * (1 - wrap * 0.5);
          const wx = lerp(p[0], hang[0], wrap), wy = lerp(p[1] - hump, hang[1] + u * 2 + i * u * 1.2, wrap);
          g.fillStyle = i % 2 ? COL["c-1"] : api.mix(COL["c-1"], "#ffffff", 0.25); g.beginPath(); g.arc(wx, wy, r, 0, 7); g.fill();
          if (i === 0) { g.fillStyle = "#2b2420"; g.beginPath(); g.arc(wx - r * 0.35, wy - r * 0.2, r * 0.2, 0, 7); g.fill(); }
        }
      }
      /* Kepompong. */
      if (wrap > 0 && fly < 0.6) {
        const cw = u * 4 * ease(wrap), chh = u * 9 * ease(wrap), cx = hang[0], cy = hang[1] + u * 6;
        g.strokeStyle = COL["c-2"]; g.lineWidth = 2; g.beginPath(); g.moveTo(cx, by); g.lineTo(cx, cy - chh * 0.8); g.stroke();
        g.save(); g.translate(cx, cy); g.rotate(Math.sin(t * 1.4) * 0.05 + (crack > 0 && crack < 1 ? Math.sin(t * 30) * 0.06 : 0));
        g.globalAlpha = 1 - fly * 1.6;
        g.fillStyle = api.mix(COL["c-1"], "#8a7a4a", 0.55); g.beginPath(); g.ellipse(0, 0, cw, chh, 0, 0, 7); g.fill();
        g.strokeStyle = rgba("#000000", 0.18); g.lineWidth = 1; for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(0, i * chh * 0.3, cw * 0.95, chh * 0.1, 0, 0, Math.PI); g.stroke(); }
        if (crack > 0) { g.strokeStyle = "#fff8e0"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -chh * 0.9); g.lineTo(-cw * 0.3, -chh * 0.4); g.lineTo(cw * 0.2, -chh * 0.1); g.lineTo(-cw * 0.1, chh * 0.4 * crack); g.stroke(); glowDot(0, 0, u * 12 * crack, COL["c-3"], 0.4 * crack); }
        g.restore(); g.globalAlpha = 1;
      }
      /* Kupu-kupu utama dan teman-temannya. */
      if (crack > 0.6) {
        const open = seg(crack, 0.6, 1);
        const x = lerp(hang[0], W * 0.5 + Math.sin(t * 0.6) * W * 0.18, ease(fly)), y = lerp(hang[1] + u * 6, H * 0.36 + Math.sin(t * 1.1) * u * 4, ease(fly));
        wings(x, y, u * 6, open, fly > 0 ? t * 9 : 0, "c-3", fly * Math.sin(t) * 0.2);
        for (const f of friends) { const p = seg(fly, f.d, f.d + 0.5); if (p <= 0) continue; const a = f.a + t * f.s * 0.4; const fx = lerp(f.a > 3 ? W + 40 : -40, W / 2 + Math.cos(a) * W * f.r, ease(p)), fy = lerp(H * 0.2, H * 0.4 + Math.sin(a * 1.3) * H * f.r * 0.6, ease(p)); wings(fx, fy, u * 3.2, 1, t * 10 + f.w, f.c, Math.sin(t + f.w) * 0.3); }
      }
      function clampK(v) { return Math.max(0, Math.min(1, v)); }
    },
  };
}`;

/** 11. Kolam dari atas: satu koi berenang sendiri → koi kedua datang → keduanya berputar membentuk lingkaran → teratai mekar di tengah. */
export const SCENE_KOI = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const pads = []; for (let i = 0; i < 7; i++) pads.push([rnd(), rnd(), 0.6 + rnd() * 0.6, rnd() * 6]);
  const ripples = [];
  const hist = [[], []];
  function koi(pts, col, spots, s) {
    /* Tubuh mengikuti jejak (ekor meliuk mengikuti kepala). */
    const n = pts.length; if (n < 2) return;
    for (let i = n - 1; i >= 0; i--) { const p = pts[i], k = i / (n - 1), r = s * (k < 0.15 ? lerp(0.55, 1, k / 0.15) : lerp(1, 0.25, (k - 0.15) / 0.85)); g.fillStyle = (spots && i % 4 === 1 && k > 0.2 && k < 0.8) ? COL["c-2"] : col; g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.fill(); }
    const tail = pts[n - 1], pre = pts[n - 3] || pts[n - 2], a = Math.atan2(tail[1] - pre[1], tail[0] - pre[0]);
    g.fillStyle = rgba(col, 0.75); g.beginPath(); g.moveTo(tail[0], tail[1]); g.lineTo(tail[0] + Math.cos(a + 0.6) * s * 2.2, tail[1] + Math.sin(a + 0.6) * s * 2.2); g.lineTo(tail[0] + Math.cos(a - 0.6) * s * 2.2, tail[1] + Math.sin(a - 0.6) * s * 2.2); g.fill();
    const h = pts[0], h2 = pts[2] || pts[1], ha = Math.atan2(h[1] - h2[1], h[0] - h2[0]);
    for (const sd of [-1, 1]) { g.fillStyle = rgba(col, 0.6); g.beginPath(); g.ellipse(pts[3] ? pts[3][0] + Math.cos(ha + sd * 1.6) * s : h[0], pts[3] ? pts[3][1] + Math.sin(ha + sd * 1.6) * s : h[1], s * 0.9, s * 0.4, ha + sd * 0.8, 0, 7); g.fill(); }
  }
  return {
    reset() { hist[0].length = hist[1].length = 0; ripples.length = 0; },
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      /* Kilau air. */
      for (let i = 0; i < 26; i++) { const x = ((i * 137.5 + t * 8) % (W + 80)) - 40, y = (i * 71.3) % H; g.strokeStyle = rgba("#ffffff", 0.06); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 20, y - 6, x + 40, y); g.stroke(); }
      for (const p of pads) { const x = p[0] * W, y = p[1] * H, r = u * 5 * p[2]; g.fillStyle = COL["c-3"]; g.beginPath(); g.moveTo(x, y); g.arc(x, y, r, p[3] + t * 0.02, p[3] + t * 0.02 + Math.PI * 1.85); g.closePath(); g.fill(); }
      const two = seg(B, 0.9, 1.6), circle = seg(B, 1.6, 2.4), lotus = seg(B, 2.1, 2.9);
      const cx = W / 2, cy = H * 0.36, R = Math.min(W, H) * 0.2;
      /* Posisi kepala pada waktu tt: lingkaran bebas → lingkaran tetap di sekitar pusat. Tubuh = posisi kepala sesaat sebelumnya. */
      const k = ease(circle);
      const headAt = (i, tt) => {
        const fr = i === 0 ? [cx + Math.cos(tt * 0.5) * W * 0.32, cy + Math.sin(tt * 0.8) * H * 0.22] : [lerp(W * 1.2, cx + Math.cos(tt * 0.6 + 2) * W * 0.3, ease(two)), cy + Math.sin(tt * 0.7 + 1) * H * 0.2];
        const a = tt * 0.9 + (i ? Math.PI : 0), ob = [cx + Math.cos(a) * R, cy + Math.sin(a) * R];
        return [lerp(fr[0], ob[0], k), lerp(fr[1], ob[1], k)];
      };
      for (let i = 0; i < 2; i++) { hist[i].length = 0; for (let j = 0; j < 13; j++) hist[i].push(headAt(i, t - j * 0.07)); }
      const heads = [hist[0][0], hist[1][0]];
      if (Math.random() < dt * 1.2) ripples.push([heads[0][0], heads[0][1], 0]);
      for (let i = ripples.length - 1; i >= 0; i--) { const r = ripples[i]; r[2] += dt * 0.5; if (r[2] > 1) { ripples.splice(i, 1); continue; } g.strokeStyle = rgba("#ffffff", 0.3 * (1 - r[2])); g.lineWidth = 1.5; g.beginPath(); g.arc(r[0], r[1], r[2] * u * 14, 0, 7); g.stroke(); }
      const sz = u * 2.6;
      const pick = (hs) => hs;
      g.globalAlpha = 0.25; g.save(); g.translate(u * 1.2, u * 1.8); koi(pick(hist[0]), "#000000", false, sz); if (two > 0.01) koi(pick(hist[1]), "#000000", false, sz); g.restore(); g.globalAlpha = 1;
      koi(pick(hist[0]), COL["c-1"], true, sz);
      if (two > 0.01) koi(pick(hist[1]), "#fbf6ee", true, sz);
      /* Teratai di tengah. */
      if (lotus > 0) {
        glowDot(cx, cy, R * 1.1, COL["c-2"], 0.25 * lotus);
        for (let layer = 0; layer < 3; layer++) { const n = 8 - layer * 2, len = u * (9 - layer * 2.5) * ease(seg(lotus, layer * 0.15, 0.6 + layer * 0.15)); for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2 + layer * 0.4; g.save(); g.translate(cx, cy); g.rotate(an); g.fillStyle = layer === 2 ? api.mix(COL["c-2"], "#ffffff", 0.5) : layer === 1 ? api.mix(COL["c-2"], "#ffffff", 0.25) : COL["c-2"]; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.45, -len * 0.5, 0, -len); g.quadraticCurveTo(-len * 0.45, -len * 0.5, 0, 0); g.fill(); g.restore(); } }
        g.fillStyle = "#ffd76a"; g.beginPath(); g.arc(cx, cy, u * 1.4 * lotus, 0, 7); g.fill();
      }
    },
  };
}`;

/** 12. Satu pohon melewati empat musim: semi berbunga → panas rimbun → gugur berjatuhan → salju, lalu lampu kecil menyala. */
export const SCENE_MUSIM = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot, mix } = api;
  let branches = [], tips = [];
  const snow = []; for (let i = 0; i < 120; i++) snow.push([rnd(), rnd(), 0.4 + rnd() * 0.6]);
  const fall = []; for (let i = 0; i < 70; i++) fall.push([rnd(), rnd(), rnd() * 6, 0.4 + rnd() * 0.6]);
  function grow(x, y, a, len, w, d) { const x2 = x + Math.cos(a) * len, y2 = y + Math.sin(a) * len; branches.push([x, y, x2, y2, w]); if (d === 0 || len < 8) { tips.push([x2, y2, rr()]); return; } const n = 2 + (rr() < 0.35 ? 1 : 0); for (let i = 0; i < n; i++) grow(x2, y2, a + (i - (n - 1) / 2) * 0.55 + (rr() - 0.5) * 0.3, len * (0.68 + rr() * 0.1), w * 0.68, d - 1); }
  function build() { branches = []; tips = []; const W = api.W, H = api.H, u = Math.min(W, H) / 100; seedR(); grow(W < 760 ? W / 2 : W * 0.34, H * 0.86, -Math.PI / 2, u * 17, u * 3.2, 6); }
  let rs = 3; function seedR() { rs = 3; } const rr = () => { rs = (rs * 16807) % 2147483647; return rs / 2147483647; };
  return {
    resize: build,
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      /* Warna langit per musim lewat lapisan tipis. */
      const sum = seg(B, 0.6, 1.2), aut = seg(B, 1.6, 2.2), win = seg(B, 2.6, 3.2) + seg(B, 2.4, 2.9) * 0;
      const tint = mix(mix(mix("#ffd9e6", "#bfe6ff", sum), "#ffc98a", aut), "#1f2a4a", seg(B, 2.4, 3));
      g.globalAlpha = 0.3; g.fillStyle = tint; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
      if (sum > 0 && aut < 1) glowDot(W * 0.82, H * 0.18, u * 26, "#fff2b8", 0.6 * sum * (1 - aut));
      const winter = seg(B, 2.4, 3);
      g.fillStyle = mix(mix(COL["c-3"], "#c58b3a", aut), "#f2f5fb", winter); g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.86); g.quadraticCurveTo(W / 2, H * 0.82, W, H * 0.86); g.lineTo(W, H); g.fill();
      /* Batang dan dahan. */
      g.strokeStyle = COL["c-2"]; g.lineCap = "round";
      for (const b of branches) { g.lineWidth = Math.max(1, b[4]); g.beginPath(); g.moveTo(b[0], b[1]); g.lineTo(b[2] + Math.sin(t * 0.8 + b[3] * 0.01) * (b[4] < 2 ? 1.5 : 0), b[3]); g.stroke(); }
      if (winter > 0) { g.strokeStyle = rgba("#ffffff", 0.85 * winter); for (const b of branches) if (b[4] > 1.5) { g.lineWidth = b[4] * 0.35; g.beginPath(); g.moveTo(b[0], b[1] - b[4] * 0.4); g.lineTo(b[2], b[3] - b[4] * 0.4); g.stroke(); } }
      /* Daun / bunga di ujung dahan. */
      const bloom = 0.45 + 0.55 * seg(B, 0, 0.6), leafy = sum, drop = seg(B, 1.9, 2.6), bare = seg(B, 2.4, 2.8);
      for (const tp of tips) {
        const keep = tp[2] > drop;
        if (!keep) continue;
        const s = u * (1.6 + tp[2] * 1.2) * (bloom * (1 - leafy) + leafy * 1.25) * (1 - bare); if (s < 0.3) continue;
        const col = mix(mix(COL["c-1"], "#5aa04a", leafy), "#e2752e", aut);
        g.fillStyle = col; g.beginPath(); g.arc(tp[0] + Math.sin(t + tp[2] * 9) * 1.5, tp[1], s, 0, 7); g.fill();
        if (leafy < 0.5) { g.fillStyle = rgba("#ffffff", 0.6 * (1 - leafy * 2)); g.beginPath(); g.arc(tp[0], tp[1], s * 0.3, 0, 7); g.fill(); }
      }
      /* Daun gugur. */
      if (aut > 0 && winter < 1) for (const f of fall) { const k = (f[1] + t * 0.05 * f[3]) % 1; const x = f[0] * W + Math.sin(t * f[3] + f[2]) * u * 3, y = lerp(H * 0.25, H * 0.88, k); g.save(); g.translate(x, y); g.rotate(t * f[3] + f[2]); g.globalAlpha = aut * (1 - winter); g.fillStyle = f[2] > 3 ? "#e2752e" : "#c9452a"; g.beginPath(); g.ellipse(0, 0, u * 1.1, u * 0.55, 0, 0, 7); g.fill(); g.restore(); g.globalAlpha = 1; }
      /* Salju dan lampu kecil di musim dingin. */
      if (winter > 0) {
        for (const s of snow) { s[1] += dt * 0.04 * s[2]; if (s[1] > 1) s[1] = 0; g.fillStyle = rgba("#ffffff", 0.8 * winter * s[2]); g.beginPath(); g.arc(s[0] * W + Math.sin(t + s[2] * 7) * u, s[1] * H, s[2] * 2, 0, 7); g.fill(); }
        const lights = seg(B, 2.7, 3);
        tips.forEach((tp, i) => { if (i % 4) return; glowDot(tp[0], tp[1], u * 1.5, COL["c-1"], lights * (0.5 + 0.4 * Math.sin(t * 2 + i))); });
      }
    },
  };
}`;

/** 13. Kue dengan lilin menyala → lilin ditiup, asap mengepul → lampu kamar menyala, konfeti meledak → hujan konfeti. */
export const SCENE_LILIN = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  let boomT = -1;
  const conf = []; for (let i = 0; i < 140; i++) conf.push({ a: -Math.PI / 2 + (rnd() - 0.5) * 2.2, v: 0.5 + rnd() * 0.8, c: ["c-1", "c-2", "c-3"][i % 3], r: rnd() * 6, s: 0.6 + rnd() * 0.8, x: rnd(), d: rnd() });
  return {
    reset() { boomT = -1; },
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const blow = seg(B, 1.02, 1.4), lightOn = seg(B, 1.4, 1.8), boom = seg(B, 1.4, 1.6);
      if (boom > 0 && boomT < 0) boomT = t - (dt === 0 ? 3 : 0); if (boom === 0) boomT = -1;
      /* Gelap → terang. */
      if (lightOn < 1) { g.fillStyle = rgba("#05040a", 0.45 * (1 - lightOn)); g.fillRect(0, 0, W, H); }
      const cx = W / 2, top = H * 0.6, cw = Math.min(W * 0.36, u * 46), ch = u * 12;
      /* Meja. */
      g.fillStyle = rgba(COL.ink, 0.08); g.fillRect(0, top + ch * 2.2, W, H);
      /* Kue dua tingkat. */
      g.fillStyle = rgba("#000000", 0.18); g.beginPath(); g.ellipse(cx, top + ch * 2.2, cw * 0.62, u * 2.2, 0, 0, 7); g.fill();
      const tier = (y, w, h, c) => { g.fillStyle = c; g.fillRect(cx - w / 2, y, w, h); g.beginPath(); g.ellipse(cx, y + h, w / 2, h * 0.2, 0, 0, Math.PI); g.fill(); g.fillStyle = api.mix(c, "#ffffff", 0.25); g.beginPath(); g.ellipse(cx, y, w / 2, h * 0.2, 0, 0, 7); g.fill(); g.fillStyle = "#fffaf3"; for (let i = 0; i < 9; i++) { const x = cx - w / 2 + (i + 0.5) * (w / 9); g.beginPath(); g.ellipse(x, y + h * 0.12, w / 20, h * 0.28, 0, 0, Math.PI); g.fill(); } };
      tier(top + ch, cw, ch, COL["c-2"]);
      tier(top, cw * 0.66, ch, api.mix(COL["c-2"], "#ffffff", 0.2));
      /* Lilin. */
      const n = Math.max(1, Math.min(9, +CONFIG.jumlahLilin || 5));
      for (let i = 0; i < n; i++) {
        const x = cx - cw * 0.26 + (n === 1 ? cw * 0.26 : (i / (n - 1)) * cw * 0.52), y = top - ch * 0.05 - u * 0.4, lh = u * 6;
        g.fillStyle = i % 2 ? COL["c-1"] : COL["c-3"]; g.fillRect(x - u * 0.55, y - lh, u * 1.1, lh);
        g.strokeStyle = "#3a2a20"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y - lh); g.lineTo(x, y - lh - u * 0.8); g.stroke();
        const fy = y - lh - u * 2.2, lean = blow * u * 3;
        const alive = 1 - seg(blow, i / n * 0.6, i / n * 0.6 + 0.4);
        if (alive > 0) {
          const fl = 1 + Math.sin(t * 13 + i * 2) * 0.08;
          glowDot(x, fy, u * 9 * alive, "#ffcf6b", 0.35 * alive * (1 - lightOn));
          g.fillStyle = rgba("#ffcf6b", alive); g.beginPath(); g.moveTo(x, fy + u * 1.4); g.quadraticCurveTo(x - u * 1.1, fy, x + lean, fy - u * 2.4 * fl); g.quadraticCurveTo(x + u * 1.1, fy, x, fy + u * 1.4); g.fill();
          g.fillStyle = rgba("#fffbe8", alive); g.beginPath(); g.ellipse(x + lean * 0.3, fy + u * 0.4, u * 0.35, u * 0.75, 0, 0, 7); g.fill();
        } else {
          for (let k = 0; k < 6; k++) { const q = ((t * 0.35 + k / 6) % 1); g.strokeStyle = rgba("#cfcfd8", 0.4 * (1 - q) * (1 - lightOn * 0.6)); g.lineWidth = u * (0.4 + q); g.beginPath(); const sx = x + Math.sin(q * 8 + i + t) * u * 1.6, sy = fy - q * u * 18; g.moveTo(sx, sy); g.lineTo(sx + Math.sin(q * 9 + i) * u, sy - u * 2); g.stroke(); }
        }
      }
      /* Konfeti. */
      if (boom > 0) {
        for (const c of conf) {
          const age = (t - boomT) * 0.9 + c.d * 0.3;
          let x, y;
          if (age < 1) { const r = ease(Math.min(1, age)) * Math.min(W, H) * 0.6 * c.v; x = cx + Math.cos(c.a) * r; y = top + Math.sin(c.a) * r; }
          else { const k = ((age - 1) * 0.12 + c.d + t * 0.04 * c.s) % 1; x = c.x * W + Math.sin(t * c.s + c.r) * u * 3; y = lerp(-H * 0.05, H * 1.05, k); }
          g.save(); g.translate(x, y); g.rotate(t * 3 * c.s + c.r); g.scale(1, Math.cos(t * 5 * c.s + c.r)); g.fillStyle = COL[c.c]; g.fillRect(-u * 0.6, -u * 0.35, u * 1.2, u * 0.7); g.restore();
        }
      }
    },
  };
}`;

/** 14. Tongkat sabun berkilau → gelembung ditiup → satu gelembung raksasa memantulkan pelangi → gelembung pecah jadi kilau. */
export const SCENE_GELEMBUNG = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const bubbles = []; for (let i = 0; i < 18; i++) bubbles.push({ d: rnd() * 0.7, vx: 0.25 + rnd() * 0.5, vy: -0.1 - rnd() * 0.35, r: 0.5 + rnd(), w: rnd() * 6, pop: 0.2 + rnd() * 0.6 });
  const sp = []; for (let i = 0; i < 70; i++) { const a = rnd() * 6.28; sp.push([Math.cos(a), Math.sin(a), 0.4 + rnd() * 0.6, rnd() * 6]); }
  function bubble(x, y, r, t, al) {
    const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
    gr.addColorStop(0, rgba("#ffffff", 0.05 * al)); gr.addColorStop(0.7, rgba(COL["c-1"], 0.12 * al)); gr.addColorStop(0.9, rgba(COL["c-2"], 0.35 * al)); gr.addColorStop(1, rgba(COL["c-3"], 0.55 * al));
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
    g.strokeStyle = rgba("#ffffff", 0.35 * al); g.lineWidth = 1; g.stroke();
    g.fillStyle = rgba("#ffffff", 0.75 * al); g.beginPath(); g.ellipse(x - r * 0.4, y - r * 0.45, r * 0.16, r * 0.08, -0.7, 0, 7); g.fill();
    g.strokeStyle = rgba(COL["c-2"], 0.35 * al); g.lineWidth = r * 0.04; g.beginPath(); g.arc(x, y, r * 0.86, t % 6.28, t % 6.28 + 1.4); g.stroke();
  }
  return {
    reset() { boomT = -1; },
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const blow = seg(B, 0.1, 1.9), big = seg(B, 1.95, 2.5), pop = seg(B, 2.55, 2.85);
      /* Tongkat sabun di kiri bawah. */
      const wx = W * (api.small ? 0.22 : 0.18), wy = H * 0.68, wr = u * 6;
      g.strokeStyle = COL["c-3"]; g.lineWidth = u * 1.1; g.beginPath(); g.arc(wx, wy, wr, 0, 7); g.stroke();
      g.beginPath(); g.moveTo(wx - wr * 0.3, wy + wr); g.lineTo(wx - wr * 1.1, H + 10); g.stroke();
      if (blow < 0.98) { g.fillStyle = rgba(COL["c-2"], 0.18 + 0.08 * Math.sin(t * 3)); g.beginPath(); g.arc(wx, wy, wr - 2, 0, 7); g.fill(); g.strokeStyle = rgba(COL["c-1"], 0.4); g.lineWidth = 2; g.beginPath(); g.arc(wx, wy, wr * 0.7, t, t + 2); g.stroke(); }
      /* Gelembung kecil. */
      for (const b of bubbles) {
        const age = (blow - b.d) / 0.6; if (age <= 0) continue;
        const life = Math.min(age, 3);
        const x = wx + wr + life * W * b.vx * 0.6 + Math.sin(t + b.w) * u * 2, y = wy + life * H * b.vy * 0.6 + Math.cos(t * 0.8 + b.w) * u * 2;
        const gone = seg(big, b.pop * 0.6, b.pop * 0.6 + 0.2);
        if (gone < 1) bubble(x, y, u * 3.6 * b.r * Math.min(1, age * 3), t + b.w, 1 - gone);
        if (gone > 0 && gone < 1) for (let k = 0; k < 8; k++) { const a = k * 0.785; glowDot(x + Math.cos(a) * u * 6 * gone, y + Math.sin(a) * u * 6 * gone, u * 1.2, "#ffffff", 0.8 * (1 - gone)); }
      }
      /* Gelembung raksasa. */
      const cx = W / 2, cy = H * 0.45, R = Math.min(W, H) * 0.34;
      if (big > 0 && pop < 1) bubble(lerp(wx + wr, cx, ease(big)), lerp(wy, cy, ease(big)), lerp(wr, R, ease(big)) * (1 + pop * 0.08) + Math.sin(t * 2) * u * 0.4, t * 0.6, 1 - pop);
      if (pop > 0) for (const s of sp) { const k = Math.min(1, pop * 1.4 + (B - 2.85) * 0.5); const x = cx + s[0] * R * (0.95 + k * 0.6 * s[2]), y = cy + s[1] * R * (0.95 + k * 0.6 * s[2]) + k * k * u * 20; glowDot(x, y, u * 2, s[3] > 3 ? COL["c-2"] : COL["c-3"], (0.8 - k * 0.5) * (0.6 + 0.4 * Math.sin(t * 5 + s[3]))); }
    },
  };
}`;

/** 15. Awan malam, ekor paus mengintip → paus berenang di langit → paus melompat menyemburkan bintang → paus melintasi bulan. */
export const SCENE_PAUS = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const stars = []; for (let i = 0; i < 120; i++) stars.push([rnd(), rnd(), rnd() * 6]);
  const clouds = []; for (let i = 0; i < 7; i++) clouds.push([rnd(), 0.35 + rnd() * 0.55, 0.6 + rnd() * 0.8, 0.01 + rnd() * 0.02]);
  const spray = []; for (let i = 0; i < 60; i++) spray.push([(rnd() - 0.5) * 1.4, 0.5 + rnd() * 0.8, rnd() * 6]);
  function cloud(x, y, s) { g.beginPath(); g.ellipse(x, y, s * 2.4, s * 0.8, 0, 0, 7); g.ellipse(x - s, y - s * 0.4, s, s * 0.8, 0, 0, 7); g.ellipse(x + s * 0.6, y - s * 0.6, s * 1.2, s, 0, 0, 7); g.fill(); }
  function whale(x, y, s, rot, tailK) {
    g.save(); g.translate(x, y); g.rotate(rot);
    g.fillStyle = COL["c-1"];
    g.beginPath(); g.moveTo(s * 1.6, 0); g.bezierCurveTo(s * 1.6, -s * 0.8, s * 0.2, -s * 0.9, -s * 0.8, -s * 0.35); g.bezierCurveTo(-s * 1.3, -s * 0.15, -s * 1.7, -s * 0.05, -s * 2.0, 0); g.bezierCurveTo(-s * 1.6, s * 0.2, -s * 0.6, s * 0.5, s * 0.4, s * 0.55); g.bezierCurveTo(s * 1.2, s * 0.55, s * 1.6, s * 0.35, s * 1.6, 0); g.fill();
    g.fillStyle = api.mix(COL["c-1"], "#ffffff", 0.35); g.beginPath(); g.moveTo(s * 1.5, s * 0.15); g.bezierCurveTo(s * 1.2, s * 0.5, s * 0.2, s * 0.55, -s * 0.8, s * 0.25); g.bezierCurveTo(s * 0.2, s * 0.35, s * 1.0, s * 0.3, s * 1.5, s * 0.15); g.fill();
    g.save(); g.translate(-s * 2.0, 0); g.rotate(Math.sin(tailK) * 0.35); g.fillStyle = COL["c-1"]; g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-s * 0.3, -s * 0.2, -s * 0.6, -s * 0.6, -s * 0.75, -s * 0.5); g.bezierCurveTo(-s * 0.5, -s * 0.15, -s * 0.5, s * 0.15, -s * 0.75, s * 0.5); g.bezierCurveTo(-s * 0.6, s * 0.6, -s * 0.3, s * 0.2, 0, 0); g.fill(); g.restore();
    g.fillStyle = COL["c-1"]; g.beginPath(); g.moveTo(s * 0.5, s * 0.35); g.quadraticCurveTo(s * 0.2, s * 1.0, -s * 0.2, s * 0.9); g.quadraticCurveTo(0, s * 0.6, s * 0.2, s * 0.4); g.fill();
    g.fillStyle = "#1a1830"; g.beginPath(); g.arc(s * 1.05, s * 0.02, s * 0.07, 0, 7); g.fill();
    g.fillStyle = rgba("#ffffff", 0.5); for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-s * 0.2 + i * s * 0.25, -s * 0.45 + Math.abs(i - 2) * s * 0.05, s * 0.04, 0, 7); g.fill(); }
    g.restore();
  }
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      for (const s of stars) { g.fillStyle = rgba("#ffffff", 0.2 + 0.5 * Math.abs(Math.sin(t * 0.5 + s[2]))); g.fillRect(s[0] * W, s[1] * H, 1.5, 1.5); }
      const mx = W * 0.7, my = H * 0.3; glowDot(mx, my, u * 30, COL["c-3"], 0.3); g.fillStyle = api.mix(COL["c-3"], "#ffffff", 0.6); g.beginPath(); g.arc(mx, my, u * 9, 0, 7); g.fill();
      const swim = seg(B, 0.1, 1.2), jump = seg(B, 1.2, 2.0), pass = seg(B, 2.05, 2.95);
      /* Jalur paus. */
      let x, y, rot;
      if (jump === 0) { x = lerp(W * 0.12, W * 0.45, ease(swim)); y = lerp(H * 0.86, H * 0.6, ease(swim)) + Math.sin(t * 0.9) * u * 1.5; rot = lerp(-0.6, -0.05, swim) + Math.sin(t * 0.9) * 0.04; }
      else if (pass === 0) { const a = ease(jump); x = lerp(W * 0.45, W * 0.32, a); y = H * 0.6 - Math.sin(a * Math.PI) * H * 0.2; rot = lerp(-0.05, -0.9, Math.sin(a * Math.PI * 0.5)) * (1 - a) - a * 0.1; }
      else { const a = ease(pass); x = lerp(W * 0.32, W * 1.25, a); y = lerp(H * 0.6, H * 0.34, a) + Math.sin(t) * u; rot = -0.15; }
      const s = u * (api.small ? 10 : 9);
      whale(x, y, s, rot, t * 2.2);
      /* Semburan bintang. */
      if (jump > 0.3) { const k = seg(jump, 0.3, 1) + pass * 0.5; for (const p of spray) { const sx = W * 0.34 + p[0] * u * 34 * k, sy = H * 0.38 - p[1] * u * 30 * Math.sin(Math.min(1, k) * Math.PI * 0.9) + k * k * u * 10; glowDot(sx, sy, u * 1.6, COL["c-2"], (0.8 - pass * 0.6) * (0.6 + 0.4 * Math.sin(t * 6 + p[2]))); } }
      /* Awan di depan. */
      g.fillStyle = rgba(COL["c-3"], 0.11);
      for (const c of clouds) { const cx = ((c[0] + t * c[3]) % 1.4 - 0.2) * W; cloud(cx, c[1] * H, u * 6 * c[2]); }
      if (swim < 0.15) { g.fillStyle = COL["c-1"]; g.save(); g.translate(W * 0.12, H * 0.8); g.rotate(Math.sin(t * 2) * 0.2); g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-u * 2, -u * 2, -u * 4, -u * 4, -u * 5, -u * 3); g.bezierCurveTo(-u * 3, -u * 1, -u * 3, u * 1, -u * 5, u * 3); g.closePath(); g.fill(); g.restore(); }
    },
  };
}`;

/** 16. Jendela berembun di malam bersalju → jari menggambar hati di kaca → kristal es tumbuh di sudut, cokelat panas mengepul → lampu hias menyala. */
export const SCENE_JENDELA = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const snow = []; for (let i = 0; i < 140; i++) snow.push([rnd(), rnd(), 0.3 + rnd() * 0.7]);
  const crystals = []; for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) crystals.push([i, rnd() * 1.5, 0.4 + rnd() * 0.6, rnd()]);
  const HEART = []; for (let i = 0; i <= 80; i++) { const a = (i / 80) * Math.PI * 2; HEART.push([16 * Math.pow(Math.sin(a), 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17]); }
  return {
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const fw = Math.min(W * 0.8, H * 0.95), fh = Math.min(H * 0.7, fw * 0.9), fx = (W - fw) / 2, fy = H * 0.12;
      const draw = seg(B, 0.9, 1.8), frost = seg(B, 1.8, 2.5), lights = seg(B, 2.3, 2.9);
      /* Luar: langit, salju, rumah-rumah jauh dengan jendela. */
      g.save(); g.beginPath(); g.rect(fx, fy, fw, fh); g.clip();
      g.fillStyle = COL["bg-3"]; g.fillRect(fx, fy, fw, fh);
      g.fillStyle = api.mix(COL["bg-3"], "#ffffff", 0.7); g.beginPath(); g.moveTo(fx, fy + fh); g.lineTo(fx, fy + fh * 0.78); g.quadraticCurveTo(fx + fw * 0.5, fy + fh * 0.7, fx + fw, fy + fh * 0.8); g.lineTo(fx + fw, fy + fh); g.fill();
      for (let i = 0; i < 4; i++) { const hx = fx + fw * (0.12 + i * 0.22), hy = fy + fh * 0.76, hw = fw * 0.1; g.fillStyle = api.mix(COL["bg-1"], COL["bg-3"], 0.4); g.fillRect(hx, hy - hw * 0.6, hw, hw * 0.6); g.beginPath(); g.moveTo(hx - 4, hy - hw * 0.6); g.lineTo(hx + hw / 2, hy - hw); g.lineTo(hx + hw + 4, hy - hw * 0.6); g.fill(); g.fillStyle = rgba(COL["c-2"], 0.85); g.fillRect(hx + hw * 0.35, hy - hw * 0.4, hw * 0.3, hw * 0.22); }
      for (const s of snow) { s[1] += dt * 0.05 * s[2]; if (s[1] > 1) s[1] = 0; g.fillStyle = rgba("#ffffff", 0.85 * s[2]); g.beginPath(); g.arc(fx + s[0] * fw + Math.sin(t + s[2] * 9) * u, fy + s[1] * fh, s[2] * 2.2, 0, 7); g.fill(); }
      /* Embun: lapisan putih buram dengan lubang berbentuk hati (yang digambar jari). */
      const cx = fx + fw / 2, cy = fy + fh * 0.42, R = Math.min(fw, fh) * 0.24;
      g.fillStyle = rgba("#e8eef6", 0.42);
      g.beginPath(); g.rect(fx, fy, fw, fh);
      const n = Math.floor(HEART.length * draw);
      if (n > 2) { for (let i = n - 1; i >= 0; i--) { const p = HEART[i]; i === n - 1 ? g.moveTo(cx + p[0] * R, cy + p[1] * R) : g.lineTo(cx + p[0] * R, cy + p[1] * R); } g.closePath(); }
      g.fill("evenodd");
      if (draw > 0 && draw < 1) { const p = HEART[Math.max(0, n - 1)]; g.fillStyle = rgba("#f2c8a8", 0.9); g.beginPath(); g.ellipse(cx + p[0] * R + u * 1.2, cy + p[1] * R + u * 3, u * 2.2, u * 4, 0.3, 0, 7); g.fill(); }
      if (draw > 0) { g.strokeStyle = rgba("#ffffff", 0.35); g.lineWidth = u * 1.4; g.beginPath(); for (let i = 0; i < n; i++) { const p = HEART[i]; i ? g.lineTo(cx + p[0] * R, cy + p[1] * R) : g.moveTo(cx + p[0] * R, cy + p[1] * R); } g.stroke(); }
      /* Kristal es di sudut. */
      if (frost > 0) {
        const corners = [[fx, fy, 1, 1], [fx + fw, fy, -1, 1], [fx, fy + fh, 1, -1], [fx + fw, fy + fh, -1, -1]];
        g.strokeStyle = rgba("#ffffff", 0.75); g.lineWidth = 1.4;
        for (const c of crystals) { const k = corners[c[0]], L = u * 14 * c[2] * ease(frost), a = c[1] * 0.6 + 0.1; const ex = k[0] + k[2] * Math.cos(a) * L, ey = k[1] + k[3] * Math.sin(a) * L; g.beginPath(); g.moveTo(k[0], k[1]); g.lineTo(ex, ey); for (let j = 1; j < 4; j++) { const q = j / 4, bx = lerp(k[0], ex, q), by = lerp(k[1], ey, q), bl = L * 0.2 * (1 - q); g.moveTo(bx, by); g.lineTo(bx + k[2] * Math.cos(a + 0.8) * bl, by + k[3] * Math.sin(a + 0.8) * bl); g.moveTo(bx, by); g.lineTo(bx + k[2] * Math.cos(a - 0.8) * bl, by + k[3] * Math.sin(a - 0.8) * bl); } g.stroke(); }
      }
      g.restore();
      /* Kusen jendela dan ambang. */
      g.strokeStyle = COL["c-3"]; g.lineWidth = u * 2.2; g.strokeRect(fx, fy, fw, fh); g.lineWidth = u * 1.2; g.beginPath(); g.moveTo(cx, fy); g.lineTo(cx, fy + fh); g.moveTo(fx, fy + fh * 0.55); g.lineTo(fx + fw, fy + fh * 0.55); g.stroke();
      g.fillStyle = COL["c-3"]; g.fillRect(fx - u * 3, fy + fh, fw + u * 6, u * 3);
      /* Cangkir cokelat panas di ambang. */
      const mx = fx + fw * 0.8, my = fy + fh, mw = u * 6, mh = u * 6, mug = seg(B, 1.9, 2.4);
      if (mug > 0) {
        g.globalAlpha = mug; g.fillStyle = COL["c-1"]; g.fillRect(mx - mw / 2, my - mh, mw, mh); g.strokeStyle = COL["c-1"]; g.lineWidth = u * 1; g.beginPath(); g.arc(mx + mw / 2, my - mh / 2, mh * 0.28, -1.4, 1.4); g.stroke();
        for (let k = 0; k < 3; k++) { const q = (t * 0.3 + k / 3) % 1; g.strokeStyle = rgba("#ffffff", 0.45 * (1 - q) * mug); g.lineWidth = u * 0.5; g.beginPath(); const sx = mx - mw * 0.25 + k * mw * 0.25; g.moveTo(sx, my - mh - u); g.bezierCurveTo(sx - u * 1.5, my - mh - u * 4 - q * u * 4, sx + u * 1.5, my - mh - u * 6 - q * u * 6, sx, my - mh - u * 9 - q * u * 6); g.stroke(); }
        g.globalAlpha = 1;
      }
      /* Lampu hias di sepanjang kusen atas. */
      if (lights > 0) {
        g.strokeStyle = rgba(COL.ink, 0.5); g.lineWidth = 1; g.beginPath();
        const N = 14; for (let i = 0; i <= N; i++) { const x = fx + (i / N) * fw, y = fy + Math.sin((i / N) * Math.PI * 4) * u * 1.5 + u * 1.2; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
        for (let i = 0; i < N; i++) { const x = fx + ((i + 0.5) / N) * fw, y = fy + Math.sin(((i + 0.5) / N) * Math.PI * 4) * u * 1.5 + u * 2.6; const on = seg(lights, i / N * 0.6, i / N * 0.6 + 0.3) * (0.7 + 0.3 * Math.sin(t * 3 + i)); const c = [COL["c-1"], COL["c-2"], "#7fd6ff"][i % 3]; glowDot(x, y, u * 4, c, 0.5 * on); g.fillStyle = on > 0.2 ? c : rgba(COL.ink, 0.3); g.beginPath(); g.ellipse(x, y, u * 0.6, u * 0.9, 0, 0, 7); g.fill(); }
      }
    },
  };
}`;
