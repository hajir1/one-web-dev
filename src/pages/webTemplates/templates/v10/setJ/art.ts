/* ================================================================== */
/* Set J illustrations (in-house SVG, ASCII, no third-party licenses)   */
/* third). Key: v10j-<template id>-<name>.                               */
/* ================================================================== */

export const svg = (w: number, h: number, body: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${body}</svg>`;

/** Random but fixed (deterministic) seeds/dots for texture. */
export function specks(n: number, w: number, h: number, color: string, seed = 1, r = 2): string {
  let s = seed;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  let out = "";
  for (let i = 0; i < n; i++) out += `<circle cx="${(rnd() * w).toFixed(0)}" cy="${(rnd() * h).toFixed(0)}" r="${(0.5 + rnd() * r).toFixed(1)}" fill="${color}"/>`;
  return out;
}
