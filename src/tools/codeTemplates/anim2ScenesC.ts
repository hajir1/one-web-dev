/* Story animation scenes 17-21 (2D canvas, v23). Same rules as anim2ScenesA.ts:
   scene(api) returns { draw(t, B), resize?, reset? }; B rises by 1 per act; colors from api.COL. */

/** 17. A kite lying on a hill → the wind lifts it high → other kites rise too → they all circle the main kite. */
export const SCENE_LAYANG = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, mix, glowDot } = api;
  const clouds = []; for (let i = 0; i < 6; i++) clouds.push([rnd(), 0.08 + rnd() * 0.35, 0.6 + rnd() * 0.8, 0.01 + rnd() * 0.02]);
  const winds = []; for (let i = 0; i < 14; i++) winds.push([rnd(), 0.1 + rnd() * 0.55, 0.3 + rnd() * 0.5, rnd() * 6]);
  const others = []; for (let i = 0; i < 6; i++) others.push({ a: (i / 6) * Math.PI * 2, d: i * 0.08, c: ["c-1", "c-3", "c-2"][i % 3], k: 0.55 + rnd() * 0.25, sx: rnd() });
  function kite(x, y, s, col, rot, tailT) {
    /* Ekor berpita mengikuti angin. */
    g.strokeStyle = rgba(COL.ink, 0.7); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y + s * 1.3);
    const tail = [];
    for (let i = 1; i <= 7; i++) { const px = x - i * s * 0.32, py = y + s * 1.3 + i * s * 0.28 + Math.sin(tailT * 3 - i * 0.9) * s * 0.2; tail.push([px, py]); g.lineTo(px, py); }
    g.stroke();
    for (let i = 0; i < tail.length; i += 2) { const p = tail[i]; g.fillStyle = COL[i % 4 ? "c-3" : "c-1"]; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] - s * 0.16, p[1] - s * 0.14); g.lineTo(p[0] - s * 0.16, p[1] + s * 0.14); g.fill(); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(p[0] + s * 0.16, p[1] - s * 0.14); g.lineTo(p[0] + s * 0.16, p[1] + s * 0.14); g.fill(); }
    g.save(); g.translate(x, y); g.rotate(rot);
    const c = COL[col];
    g.fillStyle = c; g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.75, 0); g.lineTo(0, s * 1.35); g.lineTo(-s * 0.75, 0); g.closePath(); g.fill();
    g.fillStyle = mix(c, "#000000", 0.18); g.beginPath(); g.moveTo(0, -s); g.lineTo(s * 0.75, 0); g.lineTo(0, 0); g.fill(); g.beginPath(); g.moveTo(0, s * 1.35); g.lineTo(-s * 0.75, 0); g.lineTo(0, 0); g.fill();
    g.strokeStyle = rgba("#ffffff", 0.6); g.lineWidth = 1.4; g.beginPath(); g.moveTo(0, -s); g.lineTo(0, s * 1.35); g.moveTo(-s * 0.75, 0); g.lineTo(s * 0.75, 0); g.stroke();
    g.restore();
  }
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      /* Sun and clouds. */
      glowDot(W * 0.82, H * 0.16, u * 26, COL["c-3"], 0.35); g.fillStyle = mix(COL["c-3"], "#ffffff", 0.45); g.beginPath(); g.arc(W * 0.82, H * 0.16, u * 6, 0, 7); g.fill();
      for (const c of clouds) { const x = ((c[0] + t * c[3]) % 1.3 - 0.15) * W, y = c[1] * H, s = c[2] * u * 9; g.fillStyle = rgba("#ffffff", 0.7); g.beginPath(); g.ellipse(x, y, s * 1.6, s * 0.55, 0, 0, 7); g.ellipse(x - s * 0.6, y + s * 0.1, s * 0.9, s * 0.45, 0, 0, 7); g.ellipse(x + s * 0.5, y - s * 0.2, s, s * 0.6, 0, 0, 7); g.fill(); }
      /* Wind lines appear during the second act. */
      const wind = seg(B, 0.05, 0.6);
      if (wind > 0) for (const w of winds) { const k = (w[0] + t * w[2] * 0.25) % 1, x = k * W * 1.2 - W * 0.1, y = w[1] * H + Math.sin(t + w[3]) * u * 2; g.strokeStyle = rgba("#ffffff", 0.5 * wind * Math.sin(k * Math.PI)); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + u * 6, y - u * 1.5, x + u * 14, y); g.stroke(); }
      /* Bukit. */
      const hy = H * 0.8;
      g.fillStyle = mix(COL["c-2"], "#ffffff", 0.2); g.beginPath(); g.moveTo(0, H); g.lineTo(0, hy + u * 2); g.quadraticCurveTo(W * 0.35, hy - u * 10, W * 0.7, hy + u * 3); g.quadraticCurveTo(W * 0.88, hy + u * 7, W, hy); g.lineTo(W, H); g.fill();
      g.fillStyle = COL["c-2"]; g.beginPath(); g.moveTo(0, H); g.lineTo(0, hy + u * 9); g.quadraticCurveTo(W * 0.5, hy + u, W, hy + u * 10); g.lineTo(W, H); g.fill();
      /* Main kite: lying down, then rises and sways. */
      const ax = W * 0.24, ay = hy - u * 3.5;
      const lift = ease(seg(B, 0.25, 1.15)), ring = seg(B, 2.0, 2.9);
      const sway = Math.sin(t * 1.3) * u * 2.5 * lift;
      const kx = lerp(ax + u * 10, W * (api.small ? 0.55 : 0.6), lift) + sway, ky = lerp(ay + u * 0.5, H * 0.28, lift) + Math.cos(t * 1.7) * u * 1.5 * lift;
      const ks = u * (api.small ? 6.5 : 5.5);
      /* String from the spool to the kite, curved by the wind. */
      g.strokeStyle = rgba(COL.ink, 0.55); g.lineWidth = 1.2; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(lerp(ax, kx, 0.55), lerp(ay, ky, 0.15) + u * 6 * lift, kx, ky + ks * 0.2); g.stroke();
      g.fillStyle = mix(COL["c-2"], "#000000", 0.35); g.beginPath(); g.arc(ax, ay, u * 1.4, 0, 7); g.fill();
      /* Other kites rise in the third act, then circle around. */
      const join = seg(B, 1.1, 2.0);
      for (const o of others) {
        const p = ease(seg(join, o.d, o.d + 0.5)); if (p <= 0) continue;
        const a = o.a + t * 0.35 * ring;
        const fx = W * 0.6 + Math.cos(a) * W * 0.24 * o.k, fy = H * 0.3 + Math.sin(a) * H * 0.14 * o.k;
        const freeX = lerp(o.sx * W, W * (0.15 + o.sx * 0.7), p) + Math.sin(t + o.a) * u * 2, freeY = lerp(H + u * 10, H * (0.12 + (o.a % 1) * 0.3), p);
        kite(lerp(freeX, fx, ease(ring)), lerp(freeY, fy, ease(ring)), ks * 0.6, o.c, Math.sin(t * 1.2 + o.a) * 0.15, t + o.a);
      }
      kite(kx, ky, ks, "c-1", lerp(1.25, Math.sin(t * 1.1) * 0.12, lift), t);
      if (ring > 0) glowDot(kx, ky, u * 18 * ring, COL["c-3"], 0.18 * ring);
    },
  };
}`;

/** 18. A dark sea and a small lost boat → the lighthouse lights up and its beam sweeps → the boat follows the light to the pier → dawn breaks. */
export const SCENE_MERCUSUAR = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, mix, glowDot } = api;
  const stars = []; for (let i = 0; i < 90; i++) stars.push([rnd(), rnd() * 0.55, rnd() * 6]);
  const waves = []; for (let i = 0; i < 9; i++) waves.push([0.66 + i * 0.04, rnd() * 6, 0.6 + rnd() * 0.6]);
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const on = seg(B, 0.2, 0.8), sail = seg(B, 1.1, 2.3), dawn = seg(B, 2.1, 3);
      /* Dawn: warm light from the horizon. */
      if (dawn > 0) { const gr = g.createLinearGradient(0, H * 0.25, 0, H * 0.66); gr.addColorStop(0, rgba(COL["c-3"], 0)); gr.addColorStop(1, rgba(mix(COL["c-3"], "#ff9a6b", 0.5), 0.55 * dawn)); g.fillStyle = gr; g.fillRect(0, H * 0.25, W, H * 0.41); }
      for (const s of stars) { g.fillStyle = rgba("#ffffff", (0.25 + 0.5 * Math.abs(Math.sin(t * 0.5 + s[2]))) * (1 - dawn * 0.7)); g.fillRect(s[0] * W, s[1] * H, 1.5, 1.5); }
      const sea = H * 0.66;
      /* Lighthouse on a rock. */
      const lx = W * (api.small ? 0.8 : 0.78), base = sea + u * 2, tw = u * 7, th = u * 34, top = base - th;
      g.fillStyle = mix(COL["bg-1"], "#000000", 0.3); g.beginPath(); g.moveTo(lx - u * 16, sea + u * 6); g.quadraticCurveTo(lx - u * 10, sea - u * 4, lx, sea - u * 2); g.quadraticCurveTo(lx + u * 12, sea - u * 4, lx + u * 18, sea + u * 6); g.fill();
      for (let i = 0; i < 4; i++) { const y0 = base - (i / 4) * th, y1 = base - ((i + 1) / 4) * th, w0 = lerp(tw, tw * 0.7, i / 4), w1 = lerp(tw, tw * 0.7, (i + 1) / 4); g.fillStyle = i % 2 ? "#f4efe6" : COL["c-1"]; g.beginPath(); g.moveTo(lx - w0, y0); g.lineTo(lx + w0, y0); g.lineTo(lx + w1, y1); g.lineTo(lx - w1, y1); g.fill(); }
      g.fillStyle = mix(COL["c-1"], "#000000", 0.35); g.fillRect(lx - tw * 0.95, top - u * 1.2, tw * 1.9, u * 1.4);
      g.fillStyle = rgba(COL["c-3"], 0.25 + 0.75 * on); g.fillRect(lx - tw * 0.55, top - u * 6, tw * 1.1, u * 4.8);
      g.fillStyle = mix(COL["c-1"], "#000000", 0.35); g.beginPath(); g.moveTo(lx - tw * 0.8, top - u * 6); g.lineTo(lx, top - u * 10); g.lineTo(lx + tw * 0.8, top - u * 6); g.fill();
      const lampY = top - u * 3.6;
      /* Rotating light beam (slower as the boat approaches). */
      if (on > 0) {
        glowDot(lx, lampY, u * 14, COL["c-3"], 0.6 * on);
        const ang = Math.PI + Math.sin(t * 0.8) * 0.5 * (1 - sail * 0.6) - sail * 0.25;
        const len = Math.max(W, H) * 1.1, spread = 0.12;
        const gr = g.createRadialGradient(lx, lampY, 0, lx, lampY, len); gr.addColorStop(0, rgba(COL["c-3"], 0.55 * on)); gr.addColorStop(1, rgba(COL["c-3"], 0));
        g.fillStyle = gr; g.beginPath(); g.moveTo(lx, lampY); g.lineTo(lx + Math.cos(ang - spread) * len, lampY + Math.sin(ang - spread) * len); g.lineTo(lx + Math.cos(ang + spread) * len, lampY + Math.sin(ang + spread) * len); g.closePath(); g.fill();
      }
      /* Sea and waves. */
      const sg = g.createLinearGradient(0, sea, 0, H); sg.addColorStop(0, mix(COL["bg-2"], COL["c-2"], 0.25)); sg.addColorStop(1, COL["bg-1"]); g.fillStyle = sg; g.fillRect(0, sea, W, H - sea);
      if (dawn > 0) { g.fillStyle = rgba(COL["c-3"], 0.18 * dawn); g.fillRect(0, sea, W, u * 3); }
      for (const w of waves) { const y = w[0] * H; g.strokeStyle = rgba("#ffffff", 0.12 + 0.1 * on); g.lineWidth = 1.2; g.beginPath(); for (let x = 0; x <= W; x += 12) { const yy = y + Math.sin(x * 0.02 * w[2] + t * 1.2 + w[1]) * u * 0.8; x ? g.lineTo(x, yy) : g.moveTo(x, yy); } g.stroke(); }
      /* Beam reflection on the water. */
      if (on > 0) for (let i = 0; i < 10; i++) { const y = sea + u * (2 + i * 2.4); g.fillStyle = rgba(COL["c-3"], 0.25 * on * (1 - i / 10)); g.fillRect(lx - u * (3 + Math.sin(t * 3 + i) * 2), y, u * (6 + Math.sin(t * 2 + i) * 3), 2); }
      /* Boat: bobbing on the left, then sails to the pier at the foot of the lighthouse. */
      const bx = lerp(W * 0.16, lx - u * 22, ease(sail)), by = sea + u * 6 + Math.sin(t * 1.6) * u * 0.8, bs = u * (api.small ? 6 : 5);
      const tilt = Math.sin(t * 1.3) * 0.08 * (1 - sail * 0.5);
      g.save(); g.translate(bx, by); g.rotate(tilt);
      g.fillStyle = mix(COL["c-1"], "#3a2a20", 0.6); g.beginPath(); g.moveTo(-bs * 1.4, 0); g.lineTo(bs * 1.4, 0); g.lineTo(bs * 1.0, bs * 0.55); g.lineTo(-bs * 1.0, bs * 0.55); g.fill();
      g.strokeStyle = "#f4efe6"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -bs * 2.2); g.stroke();
      g.fillStyle = COL["c-2"]; g.beginPath(); g.moveTo(u * 0.4, -bs * 2.1); g.lineTo(bs * 1.2, -bs * 0.3); g.lineTo(u * 0.4, -bs * 0.3); g.fill();
      g.fillStyle = mix(COL["c-2"], "#ffffff", 0.3); g.beginPath(); g.moveTo(-u * 0.4, -bs * 1.8); g.lineTo(-bs * 0.9, -bs * 0.3); g.lineTo(-u * 0.4, -bs * 0.3); g.fill();
      g.restore();
      glowDot(bx + bs * 0.6, by - bs * 0.4, u * 3, COL["c-3"], 0.5);
      if (sail > 0.98) glowDot(bx, by, u * 16, COL["c-3"], 0.15);
    },
  };
}`;

/** 19. An empty cup on the morning table → coffee is poured → steam rises → the steam forms one word. */
export const SCENE_KOPI = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, mix, glowDot, textPoints } = api;
  let pts = [], parts = [];
  function build() {
    const W = api.W, H = api.H;
    const word = String(CONFIG.kata || "Pagi").slice(0, 14);
    const tw = Math.min(W * 0.86, 820), th = Math.min(H * 0.22, 180);
    const raw = textPoints(word, Math.round(tw), Math.round(th), api.small ? 5 : 6);
    const step = Math.max(1, Math.floor(raw.length / 520));
    pts = raw.filter((_, i) => i % step === 0).map((p) => [W / 2 + p[0] * tw, H * 0.3 + p[1] * th]);
    parts = pts.map(() => [rnd() * 6, 0.4 + rnd() * 0.8, (rnd() - 0.5) * 2]);
  }
  return {
    resize() { build(); },
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      if (!pts.length) build();
      /* Morning light from the window. */
      g.save(); g.globalAlpha = 0.18; g.fillStyle = "#ffffff"; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(W * (0.05 + i * 0.12), 0); g.lineTo(W * (0.12 + i * 0.12), 0); g.lineTo(W * (0.42 + i * 0.12), H * 0.75); g.lineTo(W * (0.3 + i * 0.12), H * 0.75); g.fill(); } g.restore();
      /* Meja. */
      const ty = H * (api.small ? 0.7 : 0.72);
      g.fillStyle = mix(COL["c-1"], "#5a3a24", 0.75); g.fillRect(0, ty, W, H - ty);
      g.fillStyle = rgba("#000000", 0.12); for (let i = 0; i < 5; i++) g.fillRect(0, ty + u * (3 + i * 5), W, 1);
      /* Cup and saucer. */
      const cx = W / 2, cs = u * (api.small ? 11 : 9.5), cy = ty - cs * 0.85;
      g.fillStyle = rgba("#000000", 0.15); g.beginPath(); g.ellipse(cx, ty + u * 0.6, cs * 1.9, cs * 0.32, 0, 0, 7); g.fill();
      g.fillStyle = mix(COL["c-1"], "#ffffff", 0.7); g.beginPath(); g.ellipse(cx, ty, cs * 1.7, cs * 0.28, 0, 0, 7); g.fill();
      g.strokeStyle = COL["c-1"]; g.lineWidth = cs * 0.18; g.beginPath(); g.ellipse(cx + cs * 1.05, cy + cs * 0.1, cs * 0.38, cs * 0.42, 0, -1.4, 1.4); g.stroke();
      g.fillStyle = COL["c-1"]; g.beginPath(); g.moveTo(cx - cs, cy - cs * 0.55); g.lineTo(cx + cs, cy - cs * 0.55); g.bezierCurveTo(cx + cs, cy + cs * 0.7, cx + cs * 0.55, cy + cs * 0.85, cx, cy + cs * 0.85); g.bezierCurveTo(cx - cs * 0.55, cy + cs * 0.85, cx - cs, cy + cs * 0.7, cx - cs, cy - cs * 0.55); g.fill();
      g.fillStyle = rgba("#ffffff", 0.18); g.fillRect(cx - cs * 0.75, cy - cs * 0.4, cs * 0.16, cs * 0.8);
      /* Coffee level rises while pouring. */
      const fill = ease(seg(B, 0.15, 0.95));
      g.fillStyle = mix(COL["c-1"], "#000000", 0.25); g.beginPath(); g.ellipse(cx, cy - cs * 0.55, cs, cs * 0.22, 0, 0, 7); g.fill();
      if (fill > 0) { g.fillStyle = COL["c-2"]; g.beginPath(); g.ellipse(cx, cy - cs * 0.55, cs * 0.92 * Math.min(1, fill * 1.4), cs * 0.18 * Math.min(1, fill * 1.4), 0, 0, 7); g.fill(); g.fillStyle = rgba("#ffffff", 0.35 * fill); g.beginPath(); g.ellipse(cx - cs * 0.25, cy - cs * 0.58, cs * 0.3, cs * 0.05, 0, 0, 7); g.fill(); }
      /* Coffee stream from the kettle above. */
      const pour = seg(B, 0.05, 0.25) * (1 - seg(B, 0.85, 1.05));
      if (pour > 0) { g.strokeStyle = COL["c-2"]; g.lineWidth = u * 1.1; g.beginPath(); g.moveTo(cx + u * 2, cy - cs * 0.55 - H * 0.35 * pour); g.quadraticCurveTo(cx + u * 0.6, cy - cs * 1.2, cx, cy - cs * 0.6); g.stroke(); }
      /* Steam: particles rise in waves, then are drawn together to spell a word. */
      const steam = seg(B, 0.9, 1.6), form = ease(seg(B, 1.9, 2.8));
      if (steam > 0) {
        const sy = cy - cs * 0.7;
        for (let i = 0; i < pts.length; i++) {
          const p = parts[i], k = (p[0] / 6 + t * 0.12 * p[1]) % 1;
          const fx = cx + p[2] * cs * 0.6 + Math.sin(t * 1.6 + p[0] + k * 6) * cs * 0.35 * (0.4 + k), fy = sy - k * H * 0.42;
          const x = lerp(fx, pts[i][0] + Math.sin(t * 2 + p[0]) * u * 0.25, form), y = lerp(fy, pts[i][1] + Math.cos(t * 2 + p[0]) * u * 0.25, form);
          const a = lerp(0.35 * Math.sin(k * Math.PI), 0.95, form) * steam;
          g.fillStyle = rgba(form > 0.5 ? COL["c-3"] : "#ffffff", a); g.beginPath(); g.arc(x, y, lerp(u * 0.9, u * 0.42, form), 0, 7); g.fill();
        }
        if (form > 0) glowDot(W / 2, H * 0.3, Math.min(W, H) * 0.4, COL["c-3"], 0.12 * form);
      }
    },
  };
}`;

/** 20. The night sky above a tent → shooting stars cross → the stars gather into a constellation shaped like a name → the constellation glows. */
export const SCENE_RASI = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, mix, glowDot, textPoints } = api;
  const sky = []; for (let i = 0; i < 160; i++) sky.push([rnd(), rnd() * 0.7, rnd() * 6, rnd()]);
  const meteors = []; for (let i = 0; i < 7; i++) meteors.push([0.3 + rnd() * 0.7, rnd() * 0.3, i * 0.11, 0.6 + rnd() * 0.5]);
  let pts = [], from = [], links = [];
  function build() {
    const W = api.W, H = api.H;
    const word = String(CONFIG.nama || "RAINA").toUpperCase().slice(0, 10);
    const tw = Math.min(W * 0.84, 860), th = Math.min(H * 0.24, 200);
    const raw = textPoints(word, Math.round(tw), Math.round(th), api.small ? 9 : 12);
    const step = Math.max(1, Math.floor(raw.length / 140));
    pts = raw.filter((_, i) => i % step === 0).map((p) => [W / 2 + p[0] * tw, H * 0.32 + p[1] * th]);
    from = pts.map(() => [rnd() * W, rnd() * H * 0.6]);
    /* Constellation lines: connect each star to its nearest not-yet-connected neighbor. */
    links = []; const lim = (api.small ? 9 : 12) * Math.max(1, step) * 1.6;
    for (let i = 0; i < pts.length; i++) { let best = -1, bd = 1e9; for (let j = i + 1; j < pts.length; j++) { const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]); if (d < bd) { bd = d; best = j; } } if (best >= 0 && bd < lim * 1.5) links.push([i, best]); }
  }
  return {
    resize() { build(); },
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      if (!pts.length) build();
      const fall = seg(B, 0.6, 1.7), gather = ease(seg(B, 1.4, 2.3)), link = seg(B, 2.1, 2.8), glow = seg(B, 2.6, 3);
      for (const s of sky) { g.fillStyle = rgba("#ffffff", (0.15 + 0.5 * Math.abs(Math.sin(t * (0.3 + s[3]) + s[2]))) * (1 - gather * 0.4)); g.fillRect(s[0] * W, s[1] * H, s[3] > 0.8 ? 2 : 1.2, s[3] > 0.8 ? 2 : 1.2); }
      /* Bintang jatuh. */
      if (fall > 0 && fall < 1) for (const m of meteors) { const k = seg(fall, m[2], m[2] + 0.35); if (k <= 0 || k >= 1) continue; const x = lerp(m[0] * W, m[0] * W - W * 0.35 * m[3], k), y = lerp(m[1] * H, m[1] * H + H * 0.3 * m[3], k); const gr = g.createLinearGradient(x, y, x + u * 16, y - u * 12); gr.addColorStop(0, rgba(COL["c-3"], 0.9 * Math.sin(k * Math.PI))); gr.addColorStop(1, rgba(COL["c-3"], 0)); g.strokeStyle = gr; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x + u * 16, y - u * 12); g.stroke(); glowDot(x, y, u * 2, "#ffffff", 0.8 * Math.sin(k * Math.PI)); }
      /* Constellation lines. */
      if (link > 0) { g.strokeStyle = rgba(COL["c-3"], 0.5 * link); g.lineWidth = 1.2; g.beginPath(); const n = Math.floor(links.length * link); for (let i = 0; i < n; i++) { const a = pts[links[i][0]], b = pts[links[i][1]]; g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } g.stroke(); }
      /* Bintang pembentuk nama. */
      if (gather > 0 || fall > 0.5) for (let i = 0; i < pts.length; i++) {
        const x = lerp(from[i][0], pts[i][0], gather), y = lerp(from[i][1], pts[i][1], gather);
        const tw = 0.6 + 0.4 * Math.sin(t * 2 + i);
        if (glow > 0) glowDot(x, y, u * 3.2, COL["c-3"], 0.35 * glow * tw);
        g.fillStyle = mix("#ffffff", COL["c-3"], 0.3); g.beginPath(); g.arc(x, y, u * (0.35 + 0.25 * tw), 0, 7); g.fill();
      }
      /* Hills, trees, and a glowing tent. */
      const hy = H * 0.82;
      g.fillStyle = COL["c-2"]; g.beginPath(); g.moveTo(0, H); g.lineTo(0, hy); g.quadraticCurveTo(W * 0.3, hy - u * 8, W * 0.6, hy - u * 2); g.quadraticCurveTo(W * 0.85, hy + u * 3, W, hy - u * 4); g.lineTo(W, H); g.fill();
      for (const [px, ps] of [[0.08, 1.2], [0.13, 0.8], [0.9, 1.1], [0.95, 0.7]]) { const x = px * W, s = u * 10 * ps, y = hy + u * 1; g.beginPath(); g.moveTo(x, y - s * 1.6); g.lineTo(x + s * 0.45, y); g.lineTo(x - s * 0.45, y); g.fill(); }
      const tx = W * 0.3, ty = hy - u * 5.5, ts = u * (api.small ? 8 : 7);
      glowDot(tx, ty - ts * 0.3, ts * 3, COL["c-1"], 0.35);
      g.fillStyle = COL["c-1"]; g.beginPath(); g.moveTo(tx, ty - ts); g.lineTo(tx + ts * 1.1, ty + ts * 0.2); g.lineTo(tx - ts * 1.1, ty + ts * 0.2); g.fill();
      g.fillStyle = mix(COL["c-1"], "#fff3c4", 0.6); g.beginPath(); g.moveTo(tx, ty - ts * 0.6); g.lineTo(tx + ts * 0.35, ty + ts * 0.2); g.lineTo(tx - ts * 0.35, ty + ts * 0.2); g.fill();
    },
  };
}`;

/** 21. Pemutar piringan hitam diam → jarum turun, piringan berputar → not-not lagu beterbangan → not berkumpul membentuk hati. */
export const SCENE_PIRINGAN = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, mix, glowDot } = api;
  const notes = []; for (let i = 0; i < 46; i++) notes.push({ a: i / 46, d: rnd() * 0.6, s: 0.7 + rnd() * 0.6, w: rnd() * 6, ch: rnd() > 0.5 ? "♪" : "♫", c: i % 3 ? "c-1" : "c-3" });
  const heartAt = (u) => { const a = u * Math.PI * 2; return [16 * Math.pow(Math.sin(a), 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17]; };
  let spin = 0, lastT = 0;
  return {
    reset() { spin = 0; lastT = 0; },
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const arm = ease(seg(B, 0.1, 0.8)), play = seg(B, 0.6, 1.1), fly = seg(B, 0.95, 2.0), form = ease(seg(B, 1.9, 2.8));
      const dt = Math.max(0, Math.min(0.05, t - lastT)); lastT = t; spin += dt * 3.2 * play;
      /* Floor and table. */
      const ty = H * 0.78;
      g.fillStyle = mix(COL["c-2"], "#000000", 0.2); g.fillRect(0, ty, W, H - ty);
      /* Badan pemutar. */
      const s = u * (api.small ? 14 : 12), cx = W * 0.5, cy = ty - s * 0.42;
      g.fillStyle = rgba("#000000", 0.25); g.beginPath(); g.ellipse(cx, ty + u, s * 2.3, s * 0.25, 0, 0, 7); g.fill();
      g.fillStyle = COL["c-2"]; g.beginPath(); g.roundRect ? g.roundRect(cx - s * 2.1, cy - s * 0.1, s * 4.2, s * 0.62, s * 0.08) : g.rect(cx - s * 2.1, cy - s * 0.1, s * 4.2, s * 0.62); g.fill();
      g.fillStyle = rgba("#ffffff", 0.12); g.fillRect(cx - s * 2.1, cy - s * 0.1, s * 4.2, s * 0.06);
      /* Record (an ellipse because it is seen at an angle) with grooves and a spinning label. */
      const px = cx - s * 0.35, py = cy - s * 0.1, rx = s * 1.45, ry = s * 0.42;
      g.fillStyle = "#141414"; g.beginPath(); g.ellipse(px, py, rx, ry, 0, 0, 7); g.fill();
      g.strokeStyle = rgba("#ffffff", 0.07); g.lineWidth = 1; for (let i = 1; i < 7; i++) { g.beginPath(); g.ellipse(px, py, rx * (0.4 + i * 0.085), ry * (0.4 + i * 0.085), 0, 0, 7); g.stroke(); }
      g.strokeStyle = rgba("#ffffff", 0.22); g.lineWidth = 2; g.beginPath(); g.ellipse(px, py, rx * 0.8, ry * 0.8, 0, spin, spin + 0.7); g.stroke(); g.beginPath(); g.ellipse(px, py, rx * 0.8, ry * 0.8, 0, spin + Math.PI, spin + Math.PI + 0.7); g.stroke();
      g.fillStyle = COL["c-1"]; g.beginPath(); g.ellipse(px, py, rx * 0.3, ry * 0.3, 0, 0, 7); g.fill();
      g.fillStyle = mix(COL["c-1"], "#ffffff", 0.4); g.beginPath(); g.ellipse(px + Math.cos(spin) * rx * 0.18, py + Math.sin(spin) * ry * 0.18, rx * 0.05, ry * 0.05, 0, 0, 7); g.fill();
      /* Lengan jarum. */
      const ax = cx + s * 1.65, ay = cy - s * 0.02;
      const ex = lerp(ax - s * 0.1, px + rx * 0.62, arm), ey = lerp(ay - s * 0.75, py - ry * 0.15, arm);
      g.strokeStyle = "#d8d8d8"; g.lineWidth = s * 0.07; g.lineCap = "round"; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(lerp(ax, ex, 0.5) + s * 0.1, lerp(ay, ey, 0.5) - s * 0.25, ex, ey); g.stroke();
      g.fillStyle = "#bdbdbd"; g.beginPath(); g.arc(ax, ay, s * 0.14, 0, 7); g.fill();
      g.fillStyle = "#888"; g.fillRect(ex - s * 0.08, ey - s * 0.06, s * 0.16, s * 0.12);
      if (play > 0) glowDot(px, py, s * 2.4, COL["c-3"], 0.12 * play);
      /* Music notes leave the record, then gather into a heart. */
      if (fly > 0) {
        const hs = Math.min(W, H) * (api.small ? 0.2 : 0.17), hx = W * 0.5, hy = H * 0.32;
        g.textAlign = "center"; g.textBaseline = "middle";
        for (const n of notes) {
          const p = seg(fly, n.d * 0.6, n.d * 0.6 + 0.4); if (p <= 0) continue;
          const k = (n.a + t * 0.07 * n.s) % 1;
          const freeX = px + Math.sin(k * 9 + n.w) * W * 0.3 * k, freeY = py - k * H * 0.6;
          const h = heartAt(n.a + t * 0.02), tx = hx + h[0] * hs, tyy = hy + h[1] * hs;
          const x = lerp(lerp(px, freeX, p), tx, form), y = lerp(lerp(py, freeY, p), tyy, form);
          const a = lerp(Math.min(1, p * 2) * Math.sin(Math.max(0.05, k) * Math.PI), 1, form);
          g.globalAlpha = a; g.fillStyle = COL[n.c]; g.font = Math.round(u * (3 + n.s * 1.6)) + "px serif"; g.fillText(n.ch, x, y); g.globalAlpha = 1;
        }
        if (form > 0) glowDot(hx, hy, hs * 1.6, COL["c-3"], 0.18 * form);
      }
    },
  };
}`;
