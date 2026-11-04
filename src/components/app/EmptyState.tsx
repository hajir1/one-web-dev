import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** Standard empty state: icon, title, text, optional action. */
export default function EmptyState({ icon: Icon, title, text, action, testId }: { icon: LucideIcon; title: ReactNode; text?: ReactNode; action?: ReactNode; testId?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-10 text-center" data-testid={testId}>
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-gray-800 dark:text-white/90">{title}</p>
      {text && <p className="max-w-sm text-xs leading-relaxed text-gray-500 dark:text-gray-400">{text}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
