/**
 * v9: OneWebDev icon = a code-styled "1" (monospace stroke + terminal
 * cursor) on a blue tile. Same geometry as generate-icons.mjs (favicon/PWA).
 */
export function BrandMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="ow-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b68f0" />
          <stop offset="1" stopColor="#1f3a8f" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#ow-mark)" />
      <path d="M9.7 15.2 15.8 10.2V29.6" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.2 29.6H21.2" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <rect x="23.8" y="27.8" width="6.6" height="3.6" rx="1.2" fill="#c0d2fd" />
    </svg>
  );
}

export default function BrandLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <BrandMark />
      {!collapsed && (
        <span className="flex flex-col leading-none">
          <span className="text-[17px] font-extrabold tracking-tight text-gray-900 dark:text-white">
            OneWeb<span className="text-brand-600 dark:text-brand-400">Dev</span>
          </span>
          <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400">for Developer</span>
        </span>
      )}
    </span>
  );
}
