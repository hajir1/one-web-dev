/* Story animation scenes 1-8 (2D canvas). Each scene(api) function returns { draw(t, B), resize?, reset? }.
   B = story time: 0 in the first act, +1 per act. Colors from api.COL (CSS variables). */

/** 1. Closed envelope → letter slides out → letter folds into a paper bird → the bird flies drawing a heart. */
export const SCENE_SURAT = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rgba, glowDot } = api;
  /* Letter shape (8 points) and paper bird (8 points) to morph between. */
  const PAPER = [[-1, -0.7], [0, -0.7], [1, -0.7], [1, 0], [1, 0.7], [0, 0.7], [-1, 0.7], [-1, 0]];
  const BIRD = [[-1.5, -0.55], [-0.2, -0.05], [0.25, -0.1], [0.9, -0.45], [0.55, 0.05], [0.15, 0.32], [-0.4, 0.2], [-0.2, 0.0]];
  const trail = [];
  const heartAt = (u) => { const a = u * Math.PI * 2; return [16 * Math.pow(Math.sin(a), 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17]; };
  function poly(pts) { g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); }
  return {
    reset() { trail.length = 0; },
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const cx = W / 2, cy = H * 0.58;
      const open = seg(B, 0.05, 0.7), out = seg(B, 0.35, 1), fold = seg(B, 1.05, 1.75), fly = seg(B, 1.8, 2.95);
      const ew = u * 26, eh = u * 17;
      /* Envelope: body, letter, and a flap that swings open. */
      const envFade = 1 - seg(B, 1.6, 2.2);
      if (envFade > 0) {
        g.globalAlpha = envFade;
        g.save(); g.translate(cx, cy + Math.sin(t * 1.4) * u * 0.4 * (1 - open));
        g.fillStyle = COL["c-1"]; g.fillRect(-ew, -eh, ew * 2, eh * 2);
        g.fillStyle = rgba("#000000", 0.08); g.beginPath(); g.moveTo(-ew, eh); g.lineTo(0, 0); g.lineTo(ew, eh); g.closePath(); g.fill();
        g.restore();
        g.globalAlpha = 1;
      }
      /* Letter: slides out of the envelope, then folds into a bird. */
      const lx = lerp(cx, cx, fold), ly = cy - out * eh * 1.6 - fold * u * 6;
      const sc = lerp(ew * 0.85, u * 9, fold);
      let px = lx, py = ly;
      if (fly > 0) {
        const hp = heartAt(fly * 0.999 + 0.0001);
        px = lerp(lx, W / 2 + hp[0] * u * 20, seg(fly, 0, 0.12)); py = lerp(ly, H * 0.32 + hp[1] * u * 18, seg(fly, 0, 0.12));
        trail.push([px, py]); if (trail.length > 900) trail.shift();
      }
      if (fly > 0.02 && trail.length > 2) {
        g.lineWidth = u * 0.5; g.lineCap = "round"; g.strokeStyle = rgba(COL["c-3"], 0.85);
        g.beginPath(); trail.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
        for (let i = 0; i < trail.length; i += 18) glowDot(trail[i][0], trail[i][1], u * 2.4, COL["c-3"], 0.18);
      }
      const flap = fold > 0.95 ? Math.sin(t * 9) * 0.35 : 0;
      const pts = PAPER.map((p, i) => { const b = BIRD[i]; let x = lerp(p[0], b[0], ease(fold)), y = lerp(p[1], b[1], ease(fold)); if (i === 3) y += flap; if (i === 0) y -= flap * 0.4; return [px + x * sc, py + y * sc]; });
      if (out > 0.01 || fold > 0) {
        g.save();
        if (out < 1 && fold === 0) { g.beginPath(); g.rect(cx - ew, -H, ew * 2, H + cy + eh * 0.2); g.clip(); }
        g.fillStyle = "#fffdf7"; poly(pts); g.fill();
        g.strokeStyle = rgba("#000000", 0.12); g.lineWidth = 1; g.stroke();
        if (fold < 0.4) { g.globalAlpha = 1 - fold * 2.5; g.fillStyle = rgba(COL["c-2"], 0.5); for (let i = 0; i < 5; i++) g.fillRect(lx - sc * 0.7, ly - sc * 0.45 + i * sc * 0.2, sc * (i === 4 ? 0.7 : 1.4), sc * 0.05); g.globalAlpha = 1; }
        g.restore();
      }
      if (envFade > 0) {
        g.globalAlpha = envFade;
        g.save(); g.translate(cx, cy - eh);
        const fl = Math.cos(open * Math.PI);
        g.fillStyle = fl > 0 ? api.mix(COL["c-1"], "#000000", 0.12) : api.mix(COL["c-1"], "#ffffff", 0.18);
        g.beginPath(); g.moveTo(-ew, 0); g.lineTo(0, eh * 1.05 * fl); g.lineTo(ew, 0); g.closePath(); g.fill();
        if (open < 0.5) { g.fillStyle = COL["c-2"]; g.beginPath(); g.arc(0, eh * 0.95 * fl, u * 3.2, 0, 7); g.fill(); g.fillStyle = rgba("#ffffff", 0.35); api.heart(0, eh * 0.95 * fl - u * 1.4, u * 2.6); }
        g.restore();
        g.globalAlpha = 1;
      }
      if (fly >= 0.99) { const pulse = 0.5 + Math.sin(t * 2) * 0.2; glowDot(W / 2, H * 0.32, u * 30, COL["c-3"], 0.12 * pulse); }
    },
  };
}`;

/** 2. Night city → one balloon leaves a window → dozens of balloons follow → the balloons form a heart. */
export const SCENE_BALON = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  let blds = [], wins = [], balloons = [];
  function build() {
    const W = api.W, H = api.H; blds = []; wins = []; let x = -10;
    while (x < W + 10) { const w = 40 + rnd() * 70, h = H * (0.14 + rnd() * 0.24); blds.push([x, w, h]); for (let r = H - h + 16; r < H - 14; r += 22) for (let c = x + 10; c < x + w - 12; c += 16) wins.push([c, r, rnd() < 0.45, rnd() * 6]); x += w + 4; }
    const pick = wins.filter((w) => w[0] > W * 0.4 && w[0] < W * 0.6 && w[1] > H * 0.75);
    const first = pick.length ? pick[Math.floor(pick.length / 2)] : wins[0];
    if (first) first[2] = true;
    const n = api.small ? 26 : 38, cols = ["c-1", "c-2", "c-3"];
    balloons = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, hx = 16 * Math.pow(Math.sin(a), 3) / 17, hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17;
      const src = i === 0 ? first : wins[Math.floor(rnd() * wins.length)];
      balloons.push({ sx: src[0] + 4, sy: src[1], hx, hy, c: cols[i % 3], d: rnd() * 0.5, w: rnd() * 6, mx: rnd() });
    }
  }
  function balloon(x, y, r, color, sway) {
    g.strokeStyle = rgba(COL.ink, 0.45); g.lineWidth = 1; g.beginPath(); g.moveTo(x, y + r * 1.15); g.quadraticCurveTo(x + sway * r, y + r * 2.2, x - sway * r * 0.5, y + r * 3.2); g.stroke();
    g.fillStyle = COL[color]; g.beginPath(); g.ellipse(x, y, r * 0.86, r, 0, 0, 7); g.fill();
    g.beginPath(); g.moveTo(x - r * 0.15, y + r * 1.12); g.lineTo(x + r * 0.15, y + r * 1.12); g.lineTo(x, y + r * 0.95); g.fill();
    g.fillStyle = rgba("#ffffff", 0.35); g.beginPath(); g.ellipse(x - r * 0.3, y - r * 0.35, r * 0.18, r * 0.3, -0.5, 0, 7); g.fill();
  }
  return {
    resize: build,
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const one = seg(B, 0.1, 0.95), many = seg(B, 1.05, 2), shape = seg(B, 2.05, 2.95);
      g.fillStyle = rgba("#fff8e0", 0.9); for (let i = 0; i < 70; i++) { const x = (i * 97.3) % W, y = (i * 53.1) % (H * 0.55); g.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + i)); g.fillRect(x, y, 1.6, 1.6); } g.globalAlpha = 1;
      for (const b of blds) { g.fillStyle = COL["bg-1"]; g.fillRect(b[0], H - b[2], b[1], b[2]); }
      for (const w of wins) if (w[2]) { const f = 0.75 + Math.sin(t * 0.6 + w[3]) * 0.1; g.fillStyle = rgba(COL["c-3"], f); g.fillRect(w[0], w[1], 8, 11); }
      const cx = W / 2, cy = H * (api.small ? 0.3 : 0.31), R = Math.min(W * 0.42, H * 0.22);
      balloons.forEach((b, i) => {
        const p = i === 0 ? one : seg(many, b.d, b.d + 0.5);
        if (p <= 0) return;
        const free = [lerp(b.sx, b.sx + (b.mx - 0.5) * W * 0.5, p), lerp(b.sy, H * (0.15 + b.mx * 0.5), ease(p))];
        if (i === 0 && many === 0) { free[0] = lerp(b.sx, cx, ease(p)); free[1] = lerp(b.sy, H * 0.45, ease(p)); }
        const tgt = [cx + b.hx * R, cy + b.hy * R];
        const k = ease(seg(shape, b.d * 0.6, b.d * 0.6 + 0.5));
        const x = lerp(free[0], tgt[0], k) + Math.sin(t * 1.3 + b.w) * u * 0.8, y = lerp(free[1], tgt[1], k) + Math.cos(t * 1.1 + b.w) * u * 0.6;
        balloon(x, y, u * (api.small ? 3.4 : 2.6) * (0.4 + 0.6 * Math.min(1, p * 2)), b.c, Math.sin(t * 2 + b.w) * 0.3);
      });
      if (shape > 0.9) glowDot(cx, cy, R * 1.4, COL["c-1"], 0.12 * shape);
    },
  };
}`;

/** 3. Rain on the street → an umbrella opens → raindrops turn into petals → a clear sky and a rainbow. */
export const SCENE_PAYUNG = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, rnd, rgba, glowDot } = api;
  const drops = [];
  for (let i = 0; i < 170; i++) drops.push({ x: rnd(), y: rnd(), v: 0.6 + rnd() * 0.6, r: rnd() * 6.28, s: 0.6 + rnd() * 0.8 });
  return {
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const open = seg(B, 0.1, 0.8), petal = seg(B, 1.1, 1.9), clear = seg(B, 2.05, 2.9);
      /* Langit cerah menutupi langit hujan. */
      if (clear > 0) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, rgba("#ffd9a8", clear * 0.9)); gr.addColorStop(0.6, rgba("#ffeccc", clear * 0.85)); gr.addColorStop(1, rgba("#f3f0e2", clear * 0.8)); g.fillStyle = gr; g.fillRect(0, 0, W, H); glowDot(W * 0.82, H * 0.2, u * 26, "#fff3c4", clear * 0.8); }
      if (clear > 0) { const cols = ["#ff6b6b", "#ffa94d", "#ffe066", "#69db7c", "#4dabf7", "#9775fa"]; g.lineWidth = u * 1.6; g.globalAlpha = clear * 0.55; cols.forEach((c, i) => { g.strokeStyle = c; g.beginPath(); g.arc(W / 2, H * 0.92, Math.min(W, H * 1.4) * 0.48 - i * u * 1.6, Math.PI, Math.PI + Math.PI * clear); g.stroke(); }); g.globalAlpha = 1; }
      /* Wet road and puddles. */
      g.fillStyle = rgba(COL["bg-1"], 1 - clear * 0.6); g.fillRect(0, H * 0.84, W, H * 0.16);
      for (let i = 0; i < 4; i++) { const x = W * (0.15 + i * 0.24), k = ((t * 0.7 + i * 0.3) % 1); g.strokeStyle = rgba(COL.ink, (1 - k) * 0.35 * (1 - clear)); g.lineWidth = 1; g.beginPath(); g.ellipse(x, H * 0.9, k * u * 6, k * u * 1.4, 0, 0, 7); g.stroke(); }
      /* Umbrella: stick and an opening canopy. */
      const ux = W / 2, uy = H * 0.5, R = u * 17;
      g.strokeStyle = COL.ink; g.lineWidth = u * 0.7; g.lineCap = "round";
      g.beginPath(); g.moveTo(ux, uy - R * 0.1); g.lineTo(ux, uy + R * 1.2); g.arc(ux - R * 0.12, uy + R * 1.2, R * 0.12, 0, Math.PI); g.stroke();
      const wv = lerp(0.12, 1, open), hv = lerp(1.15, 0.62, open);
      g.fillStyle = COL["c-1"];
      g.beginPath(); g.moveTo(ux - R * wv, uy); g.quadraticCurveTo(ux - R * wv, uy - R * hv, ux, uy - R * hv * 1.05); g.quadraticCurveTo(ux + R * wv, uy - R * hv, ux + R * wv, uy);
      const sc = 5; for (let i = sc; i > 0; i--) { const xa = ux - R * wv + (R * wv * 2) * (i / sc), xb = ux - R * wv + (R * wv * 2) * ((i - 1) / sc); g.quadraticCurveTo((xa + xb) / 2, uy - R * 0.12 * open, xb, uy); }
      g.fill();
      g.fillStyle = rgba("#ffffff", 0.18); g.beginPath(); g.moveTo(ux, uy - R * hv * 1.05); g.quadraticCurveTo(ux - R * wv * 0.3, uy - R * hv * 0.6, ux - R * wv * 0.4, uy); g.lineTo(ux - R * wv * 0.1, uy); g.closePath(); g.fill();
      /* Hujan → kelopak. */
      const n = api.small ? 110 : 170;
      for (let i = 0; i < n; i++) {
        const d = drops[i];
        const sp = lerp(1.6, 0.18, petal) * (1 - clear * 0.6);
        d.y += d.v * sp * dt * (api.small ? 0.9 : 1); if (d.y > 1.05) { d.y = -0.05; d.x = rnd(); }
        let x = d.x * W + Math.sin(t + d.r) * u * 3 * petal, y = d.y * H;
        if (Math.abs(x - ux) < R * wv && y > uy - R * hv && y < uy + u * 2 && open > 0.6 && petal < 0.5) { if (y > uy - R * hv * 0.6) continue; }
        if (petal < 0.5) { g.strokeStyle = rgba(COL["c-3"], 0.55 * (1 - petal * 2)); g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 2, y + u * 2.2 * d.s); g.stroke(); }
        if (petal > 0.3) { g.save(); g.translate(x, y); g.rotate(t * d.v + d.r); g.globalAlpha = Math.min(1, (petal - 0.3) * 2); g.fillStyle = i % 3 ? COL["c-2"] : api.mix(COL["c-2"], "#ffffff", 0.4); g.beginPath(); g.ellipse(0, 0, u * 1.1 * d.s, u * 0.6 * d.s, 0, 0, 7); g.fill(); g.restore(); g.globalAlpha = 1; }
      }
    },
  };
}`;

/** 4. One firework rises alone → the sky fills with bursts → sparks spell a name → the name sparkles. */
export const SCENE_KEMBANG = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const bursts = [];
  let word = [], lastB = -1, nextAt = 0;
  function makeWord() { const pts = api.textPoints(String(CONFIG.kata || "Selamat"), 600, 160, api.small ? 7 : 6); word = []; const n = Math.min(pts.length, api.small ? 420 : 900); for (let i = 0; i < n; i++) { const p = pts[Math.floor((i / n) * pts.length)]; const a = rnd() * 6.283, s = 0.2 + rnd() * 0.8; word.push({ tx: p[0], ty: p[1], vx: Math.cos(a) * s, vy: Math.sin(a) * s, c: ["c-1", "c-2", "c-3"][i % 3], tw: rnd() * 6 }); } }
  function burst(x, y, color, n, big) { const parts = []; for (let i = 0; i < n; i++) { const a = (i / n) * 6.283 + rnd() * 0.2, s = (big ? 1.4 : 1) * (0.5 + rnd() * 0.5); parts.push([Math.cos(a) * s, Math.sin(a) * s]); } bursts.push({ x, y, color, parts, born: -1, rise: 0, big }); }
  return {
    resize: makeWord,
    reset() { bursts.length = 0; nextAt = 0; },
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      /* City skyline & reflection. */
      g.fillStyle = api.mix(COL["bg-1"], COL["bg-3"], 0.5); for (let i = 0; i < 18; i++) { const w = W / 18, h = H * (0.05 + ((i * 37) % 11) / 90); g.fillRect(i * w, H - h, w - 2, h); }
      /* Act 0: one rocket. Act 1: many. */
      if (B < 1.9 && t > nextAt) {
        const many = B > 0.95;
        burst(W * (many ? 0.15 + rnd() * 0.7 : 0.5), H * (many ? 0.18 + rnd() * 0.3 : 0.3), ["c-1", "c-2", "c-3"][Math.floor(rnd() * 3)], api.small ? 40 : 64, false);
        nextAt = t + (many ? 0.22 + rnd() * 0.3 : 2.2);
      }
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]; if (b.born < 0) b.born = t;
        const age = t - b.born;
        if (age < 0.9) { const k = ease(age / 0.9); const y = lerp(H, b.y, k); g.fillStyle = rgba("#fff6d8", 0.9); g.fillRect(b.x - 1, y, 2, u * 2.5); glowDot(b.x, y, u * 1.5, "#fff6d8", 0.5); continue; }
        const a = age - 0.9, life = 2.2;
        if (a > life) { bursts.splice(i, 1); continue; }
        const r = u * (b.big ? 22 : 19) * (1 - Math.exp(-a * 2.4)), fall = a * a * u * 2.2, al = 1 - a / life;
        if (a < 0.25) glowDot(b.x, b.y, u * 18 * (1 - a * 3), COL[b.color], 0.35);
        g.fillStyle = rgba(COL[b.color], al);
        for (const p of b.parts) { const x = b.x + p[0] * r, y = b.y + p[1] * r + fall; const ps = Math.max(2.4, u * 0.55); g.fillRect(x - ps / 2, y - ps / 2, ps, ps); g.fillStyle = rgba(COL[b.color], al * 0.4); for (let q = 1; q < 4; q++) g.fillRect(x - p[0] * u * 1.4 * q, y - p[1] * u * 1.4 * q - q * u * 0.3, ps * 0.6, ps * 0.6); g.fillStyle = rgba(COL[b.color], al); }
      }
      /* Act 2: a big burst that spells the word. */
      const form = seg(B, 2.0, 2.8);
      if (B > 1.9) {
        const cx = W / 2, cy = H * (api.small ? 0.3 : 0.32), sw = Math.min(W * 0.92, u * 150), sh = sw * 160 / 600;
        const rise = seg(B, 1.9, 2.05);
        if (rise < 1) { const y = lerp(H, cy, ease(rise)); glowDot(cx, y, u * 2, "#fff6d8", 0.9); }
        else {
          const spread = seg(B, 2.0, 2.25) * (1 - form);
          for (const p of word) {
            const ex = cx + p.vx * u * 30 * spread, ey = cy + p.vy * u * 30 * spread;
            const x = lerp(ex, cx + p.tx * sw, ease(form)), y = lerp(ey, cy + p.ty * sh, ease(form));
            const tw = form > 0.95 ? 0.55 + 0.45 * Math.sin(t * 4 + p.tw) : 1;
            const ps = Math.max(2.6, u * 0.6); g.fillStyle = rgba(COL[p.c], tw); g.fillRect(x - ps / 2, y - ps / 2, ps, ps);
          }
          if (form > 0.9) glowDot(cx, cy, sw * 0.6, COL["c-1"], 0.1);
        }
      }
    },
  };
}`;

/** 5. A shooting star falls into a jar → the jar glows → the lid opens, light escapes → the light forms a heart constellation. */
export const SCENE_TOPLES = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const stars = [], lights = [];
  for (let i = 0; i < 120; i++) stars.push([rnd(), rnd() * 0.7, rnd() * 6, 0.5 + rnd()]);
  const HEART = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; HEART.push([16 * Math.pow(Math.sin(a), 3) / 17, -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a)) / 17]); }
  for (let i = 0; i < 14; i++) lights.push({ ox: (rnd() - 0.5) * 0.5, oy: rnd() * 0.6, w: rnd() * 6, h: HEART[i] });
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      for (const s of stars) { g.fillStyle = rgba("#fff8e7", 0.25 + 0.5 * Math.abs(Math.sin(t * 0.7 * s[3] + s[2]))); g.fillRect(s[0] * W, s[1] * H, s[3] * 1.4, s[3] * 1.4); }
      /* Bukit. */
      g.fillStyle = COL["bg-1"]; g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.8); g.quadraticCurveTo(W * 0.5, H * 0.66, W, H * 0.82); g.lineTo(W, H); g.fill();
      const jx = W / 2, jy = H * 0.7, jw = u * 10, jh = u * 14;
      const fall = seg(B, 0.1, 0.8), glow = seg(B, 0.7, 1.2), lid = seg(B, 1.1, 1.5), free = seg(B, 1.3, 2.0), form = seg(B, 2.05, 2.9);
      /* Bintang jatuh. */
      if (fall > 0 && fall < 1) { const sx = lerp(W * 0.9, jx, ease(fall)), sy = lerp(H * 0.05, jy - jh * 0.4, ease(fall)); g.strokeStyle = rgba(COL["c-1"], 0.7); g.lineWidth = 2; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + u * 12, sy - u * 8); g.stroke(); glowDot(sx, sy, u * 4, COL["c-1"], 0.9); }
      /* Light inside the jar. */
      const inside = glow * (1 - free * 0.7);
      if (inside > 0) { glowDot(jx, jy, jw * 4, COL["c-1"], 0.35 * inside); glowDot(jx, jy, jw * 1.2, "#fffbe6", 0.8 * inside); }
      /* Toples kaca. */
      g.strokeStyle = rgba(COL.ink, 0.7); g.lineWidth = 2; g.fillStyle = rgba(COL["c-3"], 0.12);
      g.beginPath(); g.moveTo(jx - jw * 0.7, jy - jh * 0.75); g.quadraticCurveTo(jx - jw, jy - jh * 0.7, jx - jw, jy - jh * 0.4); g.lineTo(jx - jw, jy + jh * 0.45); g.quadraticCurveTo(jx - jw, jy + jh * 0.55, jx - jw * 0.8, jy + jh * 0.55); g.lineTo(jx + jw * 0.8, jy + jh * 0.55); g.quadraticCurveTo(jx + jw, jy + jh * 0.55, jx + jw, jy + jh * 0.45); g.lineTo(jx + jw, jy - jh * 0.4); g.quadraticCurveTo(jx + jw, jy - jh * 0.7, jx + jw * 0.7, jy - jh * 0.75); g.closePath(); g.fill(); g.stroke();
      g.strokeStyle = rgba("#ffffff", 0.35); g.beginPath(); g.moveTo(jx - jw * 0.7, jy - jh * 0.3); g.lineTo(jx - jw * 0.7, jy + jh * 0.3); g.stroke();
      /* The lifting lid. */
      g.save(); g.translate(jx + lid * jw * 2.1, jy - jh * 0.8 + Math.sin(lid * Math.PI) * -jh * 0.6 + lid * jh * 1.32); g.rotate(lid * 0.18);
      g.fillStyle = COL["c-2"]; g.fillRect(-jw * 0.78, -u * 1.2, jw * 1.56, u * 2.4); g.restore();
      /* Light escapes, then becomes a heart-shaped constellation. */
      if (free > 0) {
        const cx = W / 2, cy = H * 0.3, R = Math.min(W * 0.3, H * 0.19);
        const pos = lights.map((l, i) => { const fx = jx + l.ox * W * 0.6 * free + Math.sin(t + l.w) * u * 2, fy = lerp(jy, H * (0.25 + l.oy * 0.3), ease(free)) + Math.cos(t * 0.8 + l.w) * u * 2; const k = ease(seg(form, i * 0.03, i * 0.03 + 0.6)); return [lerp(fx, cx + l.h[0] * R, k), lerp(fy, cy + l.h[1] * R, k)]; });
        if (form > 0.4) { g.strokeStyle = rgba(COL["c-3"], (form - 0.4) * 0.9); g.lineWidth = 1; g.setLineDash([3, 6]); g.beginPath(); pos.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.closePath(); g.stroke(); g.setLineDash([]); }
        pos.forEach((p, i) => { glowDot(p[0], p[1], u * 3.2, COL["c-1"], 0.5 + 0.3 * Math.sin(t * 3 + i)); g.fillStyle = "#fffbe6"; g.beginPath(); g.arc(p[0], p[1], u * 0.45, 0, 7); g.fill(); });
      }
    },
  };
}`;

/** 6. A bottle on the horizon → drifts to the beach → the cork pops, a rolled letter comes out → the letter unfolds into the greeting background. */
export const SCENE_BOTOL = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rgba, glowDot } = api;
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const hz = H * 0.5;
      /* Sunset sun and its reflection. */
      glowDot(W * 0.5, hz, u * 40, COL["c-1"], 0.45); g.fillStyle = COL["c-1"]; g.beginPath(); g.arc(W * 0.5, hz, u * 7, Math.PI, 0); g.fill();
      /* Laut berlapis. */
      for (let k = 0; k < 6; k++) {
        const y0 = hz + k * (H * 0.06) ; g.fillStyle = api.mix(COL["bg-2"], COL["bg-1"], k / 5);
        g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 16) g.lineTo(x, y0 + Math.sin(x * 0.012 + t * (0.6 + k * 0.2) + k) * (2 + k * 1.5)); g.lineTo(W, H); g.fill();
        g.fillStyle = rgba(COL["c-1"], 0.35 - k * 0.05); g.fillRect(W * 0.5 - u * (6 - k) , y0 + 2, u * (12 - k * 2), 2);
      }
      /* Pasir. */
      const sand = H * 0.86; g.fillStyle = COL["c-3"]; g.beginPath(); g.moveTo(0, H); g.lineTo(0, sand + u * 2); g.quadraticCurveTo(W * 0.5, sand - u * 3, W, sand + u * 3); g.lineTo(W, H); g.fill();
      const foam = Math.sin(t * 0.8) * u * 1.5; g.strokeStyle = rgba("#ffffff", 0.6); g.lineWidth = 2; g.beginPath(); g.moveTo(0, sand + foam); g.quadraticCurveTo(W * 0.5, sand - u * 4 + foam, W, sand + u * 2 + foam); g.stroke();
      /* Botol hanyut mendekat. */
      const come = seg(B, 0, 0.95), pop = seg(B, 1.05, 1.4), roll = seg(B, 1.3, 2.0), open = seg(B, 2.05, 2.8);
      const sc = lerp(0.25, 1, ease(come)), bx = lerp(W * 0.62, W * 0.42, ease(come)), by = lerp(hz + u * 2, sand - u * 1, ease(come)) + Math.sin(t * 1.6) * u * (1 - come) * 1.2;
      const bob = (1 - come) * Math.sin(t * 1.3) * 0.25;
      g.save(); g.translate(bx, by); g.rotate(-0.25 + bob + come * 0.1); g.scale(sc, sc);
      const L = u * 18, R = u * 4.5;
      g.fillStyle = rgba(COL["c-2"], 0.55); g.strokeStyle = rgba("#ffffff", 0.6); g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(-L * 0.5, -R); g.lineTo(L * 0.18, -R); g.quadraticCurveTo(L * 0.3, -R, L * 0.36, -R * 0.4); g.lineTo(L * 0.5, -R * 0.4); g.lineTo(L * 0.5, R * 0.4); g.lineTo(L * 0.36, R * 0.4); g.quadraticCurveTo(L * 0.3, R, L * 0.18, R); g.lineTo(-L * 0.5, R); g.quadraticCurveTo(-L * 0.56, 0, -L * 0.5, -R); g.fill(); g.stroke();
      /* Scroll inside a bottle, then it comes out. */
      if (roll < 0.02) { g.fillStyle = "#f4e6c4"; g.fillRect(-L * 0.38, -R * 0.45, L * 0.5, R * 0.9); }
      g.fillStyle = "#a8794a"; if (pop < 0.02) g.fillRect(L * 0.48, -R * 0.36, L * 0.07, R * 0.72);
      g.fillStyle = rgba("#ffffff", 0.4); g.fillRect(-L * 0.4, -R * 0.75, L * 0.5, R * 0.18);
      g.restore();
      if (pop > 0 && pop < 1) { const cx = bx + Math.cos(-0.15) * L * 0.5 * sc + pop * u * 14, cy = by - pop * u * 18 + pop * pop * u * 14; g.fillStyle = "#a8794a"; g.save(); g.translate(cx, cy); g.rotate(pop * 9); g.fillRect(-u, -u * 0.8, u * 2, u * 1.6); g.restore(); glowDot(bx + L * 0.5 * sc, by - u * 2, u * 6 * (1 - pop), "#ffffff", 0.6); }
      /* Letter: floats out, then unfolds to cover part of the screen. */
      if (roll > 0) {
        const cx = lerp(bx + L * 0.5 * sc, W / 2, ease(roll)), cy = lerp(by, H * 0.5, ease(roll));
        const w = lerp(u * 4, Math.min(W * 0.86, u * 120), ease(roll)), h = lerp(u * 3, Math.min(H * 0.74, u * 92), ease(open));
        g.save(); g.translate(cx, cy); g.rotate((1 - roll) * -0.6);
        g.fillStyle = "#f6ead0"; g.shadowColor = "rgba(0,0,0,.25)"; g.shadowBlur = 24; g.fillRect(-w / 2, -h / 2, w, h); g.shadowBlur = 0;
        g.fillStyle = "#e3cfa4"; g.beginPath(); g.ellipse(0, -h / 2, w / 2 + u, u * 1.8, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(0, h / 2, w / 2 + u, u * 1.8, 0, 0, 7); g.fill();
        g.restore();
      }
    },
  };
}`;

/** 7. A seed falls to the ground → a sprout grows → a tall stem, a bud blooms into a sunflower facing the sun → a field of flowers. */
export const SCENE_MATAHARI = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, ease, rnd, rgba, glowDot } = api;
  const field = []; for (let i = 0; i < 9; i++) field.push({ x: (i + 0.5) / 9 + (rnd() - 0.5) * 0.05, h: 0.24 + rnd() * 0.18, d: rnd() * 0.5, w: rnd() * 6 });
  function flower(x, y, r, open, turn, petals, t) {
    for (let k = 0; k < petals; k++) {
      const a = (k / petals) * Math.PI * 2 + t * 0.05, len = r * (0.5 + 0.9 * open);
      g.save(); g.translate(x, y); g.rotate(a); g.scale(1 - Math.abs(turn) * 0.35 * Math.abs(Math.cos(a)), 1);
      g.fillStyle = k % 2 ? COL["c-1"] : api.mix(COL["c-1"], "#ffffff", 0.18); g.beginPath(); g.ellipse(0, -len * 0.75, r * 0.26 * open + r * 0.08, len * 0.55, 0, 0, 7); g.fill(); g.restore();
    }
    g.fillStyle = COL["c-2"]; g.beginPath(); g.ellipse(x + turn * r * 0.15, y, r * 0.62 * (1 - Math.abs(turn) * 0.25), r * 0.62, 0, 0, 7); g.fill();
    g.fillStyle = rgba("#000000", 0.18); for (let i = 0; i < 18; i++) { const a = i * 2.4, rr = Math.sqrt(i / 18) * r * 0.5; g.fillRect(x + turn * r * 0.15 + Math.cos(a) * rr - 1, y + Math.sin(a) * rr - 1, 2, 2); }
  }
  function stem(x, base, h, sway, lw) { g.strokeStyle = COL["c-3"]; g.lineWidth = lw; g.lineCap = "round"; g.beginPath(); g.moveTo(x, base); g.quadraticCurveTo(x + sway * 0.5, base - h * 0.5, x + sway, base - h); g.stroke(); }
  function leaf(x, y, s, dir) { g.fillStyle = COL["c-3"]; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + dir * s * 0.6, y - s * 0.7, x + dir * s * 1.3, y - s * 0.2); g.quadraticCurveTo(x + dir * s * 0.6, y + s * 0.2, x, y); g.fill(); }
  return {
    draw(t, B) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      const sunX = W * 0.82, sunY = H * 0.18, sun = 0.4 + seg(B, 1.6, 2.6) * 0.6;
      glowDot(sunX, sunY, u * 30, COL["c-1"], 0.4 * sun); g.fillStyle = api.mix(COL["c-1"], "#ffffff", 0.5); g.beginPath(); g.arc(sunX, sunY, u * 6, 0, 7); g.fill();
      const ground = H * 0.82;
      const drop = seg(B, 0, 0.5), sprout = seg(B, 0.55, 1.4), grow = seg(B, 1.1, 2.0), bloom = seg(B, 1.6, 2.2), farm = seg(B, 2.05, 2.95);
      /* Flower field in the back. */
      for (const f of field) { const p = seg(farm, f.d, f.d + 0.5); if (p <= 0 || Math.abs(f.x - 0.5) < 0.08) continue; const x = f.x * W, h = H * f.h * 0.8 * p, sw = Math.sin(t * 0.9 + f.w) * u; stem(x, ground, h, sw, u * 0.6); flower(x + sw, ground - h, u * 3.2 * p, p, 0.3, 14, t); }
      g.fillStyle = COL["bg-1"]; g.beginPath(); g.moveTo(0, H); g.lineTo(0, ground); g.quadraticCurveTo(W / 2, ground - u * 3, W, ground); g.lineTo(W, H); g.fill();
      const x = W / 2;
      if (drop < 1) { const y = lerp(H * 0.15, ground - u * 1.6, ease(drop)); g.fillStyle = "#4a3426"; g.beginPath(); g.ellipse(x, y, u * 1.1, u * 1.6, 0.3, 0, 7); g.fill(); }
      if (drop >= 1) { g.fillStyle = api.mix(COL["bg-1"], "#000000", 0.2); g.beginPath(); g.ellipse(x, ground - u * 0.5, u * 6, u * 1.6, 0, Math.PI, 0); g.fill(); }
      if (sprout > 0) {
        const h = lerp(u * 8 * sprout, H * 0.36, ease(grow)), sw = Math.sin(t * 0.8) * u * 1.2;
        stem(x, ground - u, h, sw, u * lerp(0.6, 1.4, grow));
        leaf(x + sw * 0.3, ground - h * 0.35, u * lerp(3, 8, grow) * sprout, -1); leaf(x + sw * 0.5, ground - h * 0.55, u * lerp(3, 7, grow) * sprout, 1);
        const head = [x + sw, ground - u - h];
        if (bloom > 0) { glowDot(head[0], head[1], u * 22 * bloom, COL["c-1"], 0.25 * farm); flower(head[0], head[1], u * lerp(2, 8, bloom), bloom, seg(B, 2, 2.8) * 0.5, 22, t); }
        else if (grow > 0.5) { g.fillStyle = COL["c-3"]; g.beginPath(); g.ellipse(head[0], head[1], u * 1.8, u * 2.4, 0, 0, 7); g.fill(); }
      }
    },
  };
}`;

/** 8. A dark snowy night → aurora curtains appear → the aurora changes color, the cabin window lights up → a shooting star. */
export const SCENE_AURORA = String.raw`
function scene(api) {
  const { g, COL, seg, lerp, rnd, rgba, glowDot } = api;
  const stars = [], snow = [];
  for (let i = 0; i < 140; i++) stars.push([rnd(), rnd() * 0.6, rnd() * 6]);
  for (let i = 0; i < 90; i++) snow.push([rnd(), rnd(), 0.3 + rnd() * 0.7]);
  function ridge(base, amp, f, ph, col) { const W = api.W, H = api.H; g.fillStyle = col; g.beginPath(); g.moveTo(0, H); for (let x = 0; x <= W; x += 12) { const k = x / W; g.lineTo(x, H * base - Math.abs(Math.sin(k * f + ph)) * H * amp - Math.sin(k * f * 2.3 + ph) * H * amp * 0.25); } g.lineTo(W, H); g.fill(); }
  return {
    draw(t, B, dt) {
      const W = api.W, H = api.H, u = Math.min(W, H) / 100;
      for (const s of stars) { g.fillStyle = rgba("#ffffff", 0.2 + 0.5 * Math.abs(Math.sin(t * 0.5 + s[2]))); g.fillRect(s[0] * W, s[1] * H, 1.5, 1.5); }
      const a1 = seg(B, 0.2, 1.1), shift = seg(B, 1.1, 2.0), cabin = seg(B, 1.3, 1.9), meteor = seg(B, 2.1, 2.9);
      /* Aurora: wavy ribbons with a vertical gradient. */
      if (a1 > 0) {
        g.globalCompositeOperation = "lighter";
        for (let r = 0; r < 3; r++) {
          const c = r === 2 ? COL["c-3"] : (r === 0 ? COL["c-1"] : api.mix(COL["c-1"], COL["c-3"], shift));
          const baseY = H * (0.2 + r * 0.07), al = a1 * (0.22 - r * 0.04) * (r === 2 ? shift + 0.2 : 1);
          for (let x = 0; x < W; x += 6) {
            const k = x / W, y = baseY + Math.sin(k * 5 + t * 0.35 + r * 1.7) * H * 0.06 + Math.sin(k * 13 - t * 0.6 + r) * H * 0.015;
            const h = H * (0.16 + 0.1 * Math.sin(k * 7 + t * 0.5 + r)) * (0.6 + 0.4 * a1);
            const gr = g.createLinearGradient(0, y - h, 0, y); gr.addColorStop(0, rgba(c, 0)); gr.addColorStop(0.75, rgba(c, al)); gr.addColorStop(1, rgba(c, al * 0.2));
            g.fillStyle = gr; g.fillRect(x, y - h, 6, h);
          }
        }
        g.globalCompositeOperation = "source-over";
      }
      if (meteor > 0 && meteor < 1) { const x = lerp(W * 0.2, W * 0.6, meteor), y = lerp(H * 0.08, H * 0.3, meteor); g.strokeStyle = rgba("#ffffff", 1 - meteor); g.lineWidth = 2; g.beginPath(); g.moveTo(x, y); g.lineTo(x - u * 14, y - u * 7); g.stroke(); }
      ridge(0.72, 0.2, 3.2, 0.4, api.mix(COL["bg-2"], "#ffffff", 0.08));
      ridge(0.82, 0.12, 5, 1.6, api.mix(COL["bg-1"], "#ffffff", 0.12));
      /* Snow on the ground and a cabin. */
      g.fillStyle = api.mix(COL["bg-3"], "#ffffff", 0.55); g.beginPath(); g.moveTo(0, H); g.lineTo(0, H * 0.9); g.quadraticCurveTo(W * 0.35, H * 0.86, W * 0.7, H * 0.895); g.quadraticCurveTo(W * 0.88, H * 0.91, W, H * 0.88); g.lineTo(W, H); g.fill();
      const cx = W * 0.68, cy = H * 0.9, cw = u * 12, ch = u * 7;
      g.fillStyle = "#3b2a22"; g.fillRect(cx - cw / 2, cy - ch, cw, ch);
      g.fillStyle = api.mix(COL["bg-1"], "#ffffff", 0.85); g.beginPath(); g.moveTo(cx - cw * 0.65, cy - ch); g.lineTo(cx, cy - ch * 1.9); g.lineTo(cx + cw * 0.65, cy - ch); g.fill();
      g.fillStyle = "#3b2a22"; g.fillRect(cx + cw * 0.22, cy - ch * 1.8, u * 1.6, ch * 0.7);
      g.fillStyle = cabin > 0 ? api.mix("#1a1410", COL["c-2"], cabin) : "#1a1410"; g.fillRect(cx - cw * 0.3, cy - ch * 0.7, cw * 0.22, ch * 0.32); g.fillRect(cx + cw * 0.08, cy - ch * 0.7, cw * 0.22, ch * 0.32);
      if (cabin > 0) { glowDot(cx, cy - ch * 0.55, u * 14, COL["c-2"], 0.35 * cabin); for (let i = 0; i < 5; i++) { const k = ((t * 0.25 + i / 5) % 1); glowDot(cx + cw * 0.3 + Math.sin(k * 6 + i) * u * 2, cy - ch * 1.8 - k * u * 14, u * (1.5 + k * 3), "#d8d8e8", 0.25 * (1 - k) * cabin); } }
      for (const s of snow) { s[1] += dt * 0.05 * s[2]; if (s[1] > 1) s[1] = 0; g.fillStyle = rgba("#ffffff", 0.6 * s[2]); g.beginPath(); g.arc(s[0] * W + Math.sin(t + s[2] * 9) * u, s[1] * H, s[2] * 1.8, 0, 7); g.fill(); }
    },
  };
}`;
