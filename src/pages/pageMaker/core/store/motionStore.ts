import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ANIM_EASING_IDS, ANIM_EASINGS, DEFAULT_MOTION, type MotionDefaults } from "../../engine/helpers/motion";
import type { CssVar } from "../helpers/cssVars";

/* ================================================================== */
/* Pengaturan Global → Animasi & 3D (v9)                                */
/*                                                                    */
/* Default values for CSS animations and 3D elements. Stored on the device */
/* (like fonts & variables) and written as CSS variables on :root       */
/* (`motionVars`), so the preview and every export format read          */
/* the same values. Elements that set their own values still win.       */
/* ================================================================== */

export type ThreeQuality = "auto" | "low" | "high";

export interface ThreeDefaults {
  /** auto = lower detail on phones / weak devices. */
  quality: ThreeQuality;
  autoRotate: boolean;
  /** Rotation speed multiplier 0.2–3. */
  rotateSpeed: number;
  /** devicePixelRatio cap (1–2): smaller is lighter on phones. */
  maxDpr: number;
  /** Can be rotated/dragged with the mouse/finger. */
  interactive: boolean;
}

export const DEFAULT_THREE: ThreeDefaults = { quality: "auto", autoRotate: true, rotateSpeed: 1, maxDpr: 1.5, interactive: true };

interface MotionStore {
  anim: MotionDefaults;
  three: ThreeDefaults;
  setAnim: (patch: Partial<MotionDefaults>) => void;
  setThree: (patch: Partial<ThreeDefaults>) => void;
  reset: () => void;
}

const num = (v: unknown, d: number, min: number, max: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : d);

export function sanitizeMotion(v: unknown): MotionDefaults {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    duration: Math.round(num(o.duration, DEFAULT_MOTION.duration, 50, 10000)),
    delay: Math.round(num(o.delay, DEFAULT_MOTION.delay, 0, 10000)),
    easing: ANIM_EASING_IDS.includes(o.easing as never) ? (o.easing as MotionDefaults["easing"]) : DEFAULT_MOTION.easing,
    distance: Math.round(num(o.distance, DEFAULT_MOTION.distance, 0, 200)),
    trigger: o.trigger === "load" ? "load" : "scroll",
    once: o.once !== false,
  };
}

export function sanitizeThree(v: unknown): ThreeDefaults {
  const o = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  return {
    quality: o.quality === "low" || o.quality === "high" ? o.quality : "auto",
    autoRotate: o.autoRotate !== false,
    rotateSpeed: Math.round(num(o.rotateSpeed, DEFAULT_THREE.rotateSpeed, 0.2, 3) * 10) / 10,
    maxDpr: Math.round(num(o.maxDpr, DEFAULT_THREE.maxDpr, 1, 2) * 4) / 4,
    interactive: o.interactive !== false,
  };
}

/** :root variables read by the animation CSS & the 3D runtime (compose only writes them when used). */
export function motionVars(anim: MotionDefaults, three: ThreeDefaults): CssVar[] {
  const v = (name: string, type: CssVar["type"], value: string): CssVar => ({ id: `motion-${name}`, name, type, value });
  return [
    v("owd-anim-duration", "text", `${anim.duration}ms`),
    v("owd-anim-delay", "text", `${anim.delay}ms`),
    v("owd-anim-easing", "text", ANIM_EASINGS[anim.easing]),
    v("owd-anim-distance", "size", `${anim.distance}px`),
    v("owd-anim-once", "text", anim.once ? "1" : "0"),
    v("owd-3d-quality", "text", three.quality),
    v("owd-3d-autorotate", "text", three.autoRotate ? "1" : "0"),
    v("owd-3d-speed", "text", String(three.rotateSpeed)),
    v("owd-3d-dpr", "text", String(three.maxDpr)),
    v("owd-3d-interactive", "text", three.interactive ? "1" : "0"),
  ];
}

export const useMotionStore = create<MotionStore>()(
  persist(
    (set) => ({
      anim: { ...DEFAULT_MOTION },
      three: { ...DEFAULT_THREE },
      setAnim: (patch) => set((s) => ({ anim: sanitizeMotion({ ...s.anim, ...patch }) })),
      setThree: (patch) => set((s) => ({ three: sanitizeThree({ ...s.three, ...patch }) })),
      reset: () => set({ anim: { ...DEFAULT_MOTION }, three: { ...DEFAULT_THREE } }),
    }),
    {
      name: "global-motion-settings",
      version: 1,
      partialize: (s) => ({ anim: s.anim, three: s.three }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as { anim?: unknown; three?: unknown };
        return { ...current, anim: sanitizeMotion(p.anim), three: sanitizeThree(p.three) };
      },
    },
  ),
);

/** Non-React snapshot (server export). */
export const currentMotionVars = () => {
  const { anim, three } = useMotionStore.getState();
  return motionVars(anim, three);
};
