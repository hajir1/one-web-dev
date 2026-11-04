import { useMemo, useState } from "react";

/**
 * The class name actually used for rendering & export. When the input is
 * empty or not a valid simple CSS identifier, it falls back to
 * `defaultName` so the preview & generated code do not break.
 *
 * The rule is deliberately strict: it must start with a letter or underscore,
 * followed only by letters, digits, underscores, or hyphens.
 */
export function useSafeClassName(defaultName: string) {
  const [className, setClassName] = useState<string>(defaultName);

  const safeClassName = useMemo(() => {
    const candidate = className.trim();
    const isValidClassName = /^[A-Za-z_][A-Za-z0-9_-]*$/.test(candidate);

    return isValidClassName ? candidate : defaultName;
  }, [className, defaultName]);

  return { className, setClassName, safeClassName };
}
