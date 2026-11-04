import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

/**
 * v9: QR code for the otpauth:// URL (scanned by an authenticator app).
 * Generated in the browser (the `qrcode` package, lazy loaded) so the 2FA secret
 * is never sent to a third-party service.
 */
export default function MfaQr({ value }: { value: string }) {
  const { t } = useTranslation();
  const [src, setSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let alive = true;
    setSrc(null);
    setFailed(false);
    import("qrcode")
      .then((QR) => QR.toString(value, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#0f172a", light: "#ffffff" } }))
      .then((svg) => alive && setSrc(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [value]);

  if (failed) return null;
  return (
    <div className="inline-flex h-44 w-44 items-center justify-center rounded-lg border border-gray-200 bg-white p-2 dark:border-gray-700" data-testid="mfa-qr">
      {src ? <img src={src} alt={t("mfa.qrAlt")} width={160} height={160} className="h-40 w-40 [image-rendering:pixelated]" /> : <Loader2 className="h-5 w-5 animate-spin text-gray-400" />}
    </div>
  );
}
