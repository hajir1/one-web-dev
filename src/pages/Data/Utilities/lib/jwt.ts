import { DataError } from "../../shared/errors";
import { base64ToBytes } from "./encoding";

/* ================================================================== */
/* JWT decoder. ONLY decodes the header & payload (Base64URL).           */
/* The signature is NOT verified: that needs a key/secret and must      */
/* be done on the server. The token is never sent anywhere.            */
/* ================================================================== */

export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: unknown;
  signature: string;
  /** Time claims (Unix seconds) found. */
  times: { claim: "exp" | "iat" | "nbf"; seconds: number; iso: string }[];
  status: "valid-time" | "expired" | "not-yet-valid" | "no-exp";
}

function decodePart(part: string, which: "header" | "payload"): unknown {
  let text: string;
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(base64ToBytes(part));
  } catch {
    throw new DataError("jwtBase64", { part: which });
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new DataError("jwtJson", { part: which });
  }
}

export function decodeJwt(token: string, nowMs = Date.now()): DecodedJwt {
  const t = token.trim().replace(/^Bearer\s+/i, "");
  if (!t) throw new DataError("emptyInput");
  const parts = t.split(".");
  if (parts.length === 5) throw new DataError("jwtEncrypted");
  if (parts.length !== 3) throw new DataError("jwtParts", { count: parts.length });
  const header = decodePart(parts[0], "header");
  if (!header || typeof header !== "object" || Array.isArray(header)) throw new DataError("jwtJson", { part: "header" });
  const payload = decodePart(parts[1], "payload");
  const times: DecodedJwt["times"] = [];
  let status: DecodedJwt["status"] = "no-exp";
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    const p = payload as Record<string, unknown>;
    for (const claim of ["iat", "nbf", "exp"] as const) {
      const v = p[claim];
      if (typeof v === "number" && Number.isFinite(v)) {
        const d = new Date(v * 1000);
        if (!Number.isNaN(d.getTime())) times.push({ claim, seconds: v, iso: d.toISOString() });
      }
    }
    const exp = typeof p.exp === "number" ? p.exp * 1000 : null;
    const nbf = typeof p.nbf === "number" ? p.nbf * 1000 : null;
    if (nbf !== null && nowMs < nbf) status = "not-yet-valid";
    else if (exp !== null) status = nowMs >= exp ? "expired" : "valid-time";
  }
  return { header: header as Record<string, unknown>, payload, signature: parts[2], times, status };
}
