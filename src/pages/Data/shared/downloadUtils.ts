/**
 * Trigger a file download in a cross-browser compatible way.
 *
 * `a.click()` without appending the anchor to the DOM fails silently on
 * Firefox. This utility handles that edge case by temporarily appending
 * the element, clicking, then removing it.
 */
export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Delay revoke to give the browser time to initiate the download
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}

/** Safe file name (no / \ : * ? " < > | or control characters). */
export function safeFileName(name: string, fallback = "data"): string {
  const s = name
    // eslint-disable-next-line no-control-regex
    .replace(/[\\/:*?"<>|\x00-\x1f]+/g, "_")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\.+/, "")
    .slice(0, 120);
  return s || fallback;
}

/** File base name without the extension. */
export const baseName = (name: string) => name.replace(/\.[^/.]+$/, "");
