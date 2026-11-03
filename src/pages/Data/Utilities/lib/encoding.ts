import { DataError } from "../../shared/errors";

/* ================================================================== */
/* Base64 (UTF-8 aman, varian URL-safe) & URL encode/decode.             */
/* ================================================================== */

function bytesToBase64(bytes: Uint8Array): string {
  let bin = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) bin += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  return btoa(bin);
}

export function base64ToBytes(b64: string): Uint8Array {
  // Terima varian URL-safe & tanpa padding; abaikan spasi/baris baru.
  let s = b64.replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (s.startsWith("data:")) {
    const comma = s.indexOf(",");
    if (comma < 0 || !/;base64$/i.test(s.slice(0, comma))) throw new DataError("base64DataUrl");
    s = s.slice(comma + 1);
  }
  if (!s) throw new DataError("emptyInput");
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(s)) {
    const bad = s.search(/[^A-Za-z0-9+/=]/);
    throw new DataError("base64Invalid", { char: bad >= 0 ? s[bad] : "=" });
  }
  const unpadded = s.replace(/=+$/, "");
  if (unpadded.length % 4 === 1) throw new DataError("base64Length");
  const padded = unpadded + "=".repeat((4 - (unpadded.length % 4)) % 4);
  let bin: string;
  try {
    bin = atob(padded);
  } catch {
    throw new DataError("base64Length");
  }
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeBase64(text: string, urlSafe = false): string {
  const b64 = bytesToBase64(new TextEncoder().encode(text));
  return urlSafe ? b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") : b64;
}

/** Base64 → teks UTF-8. Data biner (bukan UTF-8 valid) ditolak dengan pesan jelas. */
export function decodeBase64(b64: string): string {
  const bytes = base64ToBytes(b64);
  try {
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new DataError("base64Binary", { bytes: bytes.length });
  }
}

export function encodeUrl(text: string, mode: "component" | "uri" = "component"): string {
  return mode === "component" ? encodeURIComponent(text) : encodeURI(text);
}

export function decodeUrl(text: string, plusAsSpace = true): string {
  const s = plusAsSpace ? text.replace(/\+/g, " ") : text;
  try {
    return decodeURIComponent(s);
  } catch {
    const m = /%(?![0-9a-fA-F]{2})|%[0-9a-fA-F]{2}/.exec(s);
    throw new DataError("urlMalformed", { at: m ? m.index + 1 : 0 });
  }
}

/** Uraikan query string (?a=1&b=2) menjadi pasangan kunci/nilai. */
export function parseQuery(text: string): [string, string][] {
  const q = text.includes("?") ? text.slice(text.indexOf("?") + 1) : text;
  return [...new URLSearchParams(q.split("#")[0]).entries()];
}
