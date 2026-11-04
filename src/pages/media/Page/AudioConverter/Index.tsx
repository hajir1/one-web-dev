import { useEffect, useMemo, useState } from "react";
import { FileAudio, Music } from "lucide-react";
import { useTranslation } from "react-i18next";
import MediaShell from "../../components/MediaShell";
import Dropzone, { useFileIntake } from "../../components/Dropzone";
import QueuePanel from "../../components/QueuePanel";
import { Notice, Panel, Segmented, SelectField } from "../../components/ui";
import { useFileQueue } from "../../hooks/useFileQueue";
import { baseName, formatTime } from "../../lib/format";
import { AUDIO_KINDS } from "../../lib/fileSniff";
import type { FileRules } from "../../lib/validate";
import { AUDIO_BITRATES, AUDIO_SAMPLE_RATES, AUDIO_TARGETS, DEFAULT_AUDIO_SETTINGS, audioTarget, type AudioConvertSettings, type AudioTargetId } from "../../lib/audioFormats";
import { canEncodeOpus, convertAudioInWorker } from "../../workers/audioClient";

// Video is accepted too: its audio track is extracted and converted.
const RULES: FileRules = { kinds: [...new Set([...AUDIO_KINDS, "mp4", "mov", "webm", "mkv"] as const)], maxBytes: 1024 * 1024 * 1024, maxFiles: 100 };

const ACCEPT = "audio/*,.mp3,.wav,.ogg,.oga,.opus,.flac,.aac,.m4a,.aif,.aiff,.mp4,.mov,.webm,.mkv";

export default function AudioConverter() {
  const { t } = useTranslation();
  const [target, setTarget] = useState<AudioTargetId>("mp3");
  const [s, setS] = useState<AudioConvertSettings>(DEFAULT_AUDIO_SETTINGS);
  const [opusOk, setOpusOk] = useState<boolean | null>(null);

  useEffect(() => {
    let live = true;
    void canEncodeOpus().then((ok) => live && setOpusOk(ok));
    return () => {
      live = false;
    };
  }, []);

  const tgt = audioTarget(target);
  const settingsKey = useMemo(() => JSON.stringify([target, tgt.lossless ? null : s.bitrate, s.sampleRate, s.channels]), [target, tgt.lossless, s]);
  const queue = useFileQueue({
    settingsKey,
    preview: false,
    process: async (item, ctx) => {
      const r = await convertAudioInWorker(item.file, target, s, tgt.mime, { signal: ctx.signal, onProgress: ctx.onProgress });
      const parts = [tgt.label];
      if (!tgt.lossless) parts.push(`${s.bitrate} kbps`);
      parts.push(`${(r.info.sampleRate / 1000).toLocaleString()} kHz`, r.info.channels === 1 ? "mono" : r.info.channels === 2 ? "stereo" : `${r.info.channels} ch`);
      if (r.info.seconds) parts.push(formatTime(r.info.seconds));
      return { blob: r.blob, fileName: `${baseName(item.file.name)}.${tgt.ext}`, label: parts.join(" · ") };
    },
  });
  const intake = useFileIntake(RULES, queue.add);
  const set = <K extends keyof AudioConvertSettings>(k: K, v: AudioConvertSettings[K]) => setS((p) => ({ ...p, [k]: v }));

  const rateOptions = [{ value: "orig", label: t("media.audioConverter.original") }, ...AUDIO_SAMPLE_RATES.map((r) => ({ value: String(r), label: `${(r / 1000).toLocaleString()} kHz` }))];
  const channelOptions: { value: "orig" | "1" | "2"; label: string }[] = [
    { value: "orig", label: t("media.audioConverter.original") },
    { value: "2", label: t("media.audioConverter.stereo") },
    { value: "1", label: t("media.audioConverter.mono") },
  ];

  return (
    <MediaShell tool="audio-converter" icon={FileAudio} accent="violet">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] xl:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <aside className="order-2 flex flex-col gap-4 lg:order-none lg:sticky lg:top-20 lg:self-start" aria-label={t("media.audioConverter.settingsLabel")}>
          <Panel title={t("media.audioConverter.targetTitle")} description={t("media.audioConverter.targetDescription")}>
            <div role="radiogroup" aria-label={t("media.audioConverter.targetTitle")} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3" data-testid="audio-targets">
              {AUDIO_TARGETS.map((tg) => {
                const off = !!tg.needsWebCodecs && opusOk === false;
                const active = target === tg.id;
                return (
                  <button
                    key={tg.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    disabled={off}
                    data-format={tg.id}
                    onClick={() => setTarget(tg.id)}
                    className={`rounded-xl border px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? "border-violet-600 bg-violet-50/70 ring-1 ring-violet-600 dark:border-violet-400 dark:bg-violet-500/10 dark:ring-violet-400"
                        : "border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600"
                    }`}
                  >
                    <span className="block text-sm font-semibold text-gray-800 dark:text-white/90">{tg.label}</span>
                    <span className="block text-[11px] leading-snug text-gray-500 dark:text-gray-400">{off ? t("media.audioConverter.notSupported") : t(`media.audioConverter.formats.${tg.id}`)}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-[11px] text-gray-500 dark:text-gray-400" data-testid="audio-wasm-note">
              {t("media.audioConverter.wasmNote")}
            </p>
            <p className="mt-1.5 text-[11px] text-gray-500 dark:text-gray-400" data-testid="audio-licenses">
              {t("media.audioConverter.licensePrefix")}{" "}
              <a href="https://lame.sourceforge.io" target="_blank" rel="noopener noreferrer" className="underline">
                LAME
              </a>{" "}
              (MP3) &amp;{" "}
              <a href="https://ffmpeg.org" target="_blank" rel="noopener noreferrer" className="underline">
                FFmpeg
              </a>{" "}
              (AAC), {t("media.audioConverter.licenseSuffix")}{" "}
              <a href="https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html" target="_blank" rel="noopener noreferrer" className="underline">
                LGPL-2.1
              </a>
              .
            </p>
          </Panel>

          <Panel title={t("media.audioConverter.qualityTitle")}>
            <div className="flex flex-col gap-4">
              {tgt.lossless ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("media.audioConverter.losslessNote", { format: tgt.label })}</p>
              ) : (
                <SelectField
                  label={t("media.audioConverter.bitrate")}
                  value={String(s.bitrate)}
                  onChange={(v) => set("bitrate", Number(v))}
                  options={AUDIO_BITRATES.map((b) => ({ value: String(b), label: `${b} kbps${b === 128 ? ` · ${t("media.audioConverter.small")}` : b === 192 ? ` · ${t("media.audioConverter.balanced")}` : b === 320 ? ` · ${t("media.audioConverter.best")}` : ""}` }))}
                />
              )}
              {target === "opus" ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">{t("media.audioConverter.opusRate")}</p>
              ) : (
                <SelectField label={t("media.audioConverter.sampleRate")} value={s.sampleRate ? String(s.sampleRate) : "orig"} onChange={(v) => set("sampleRate", v === "orig" ? null : Number(v))} options={rateOptions} />
              )}
              <Segmented label={t("media.audioConverter.channels")} value={s.channels ? (String(s.channels) as "1" | "2") : "orig"} options={channelOptions} onChange={(v) => set("channels", v === "orig" ? null : (Number(v) as 1 | 2))} />
              {tgt.maxChannels <= 2 && <p className="text-[11px] text-gray-500 dark:text-gray-400">{t("media.audioConverter.channelLimit", { format: tgt.label })}</p>}
            </div>
          </Panel>
        </aside>

        <div className="order-1 flex min-w-0 flex-col gap-4 lg:order-none">
          <Dropzone rules={RULES} accept={ACCEPT} onFiles={intake.handleFiles} busy={intake.checking} compact={queue.items.length > 0} />
          {intake.rejectionText && (
            <Notice tone="warn" onDismiss={intake.clearRejected} testId="rejections">
              {intake.rejectionText}
            </Notice>
          )}
          {queue.items.length === 0 ? (
            <Panel bodyClassName="flex flex-col items-center gap-2 px-6 py-10 text-center">
              <Music className="h-8 w-8 text-gray-300 dark:text-gray-600" />
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{t("media.audioConverter.emptyTitle")}</p>
              <p className="max-w-sm text-xs text-gray-500 dark:text-gray-400">{t("media.audioConverter.emptyText")}</p>
            </Panel>
          ) : (
            <QueuePanel
              queue={queue}
              runLabel={t("media.audioConverter.runAll")}
              actionLabel={t("media.audioConverter.run")}
              zipName={`${t("media.audioConverter.zipPrefix")}-${target}-${new Date().toISOString().slice(0, 10)}.zip`}
              rowExtra={(it) => (it.result ? <audio className="mt-2 h-8 w-full max-w-sm" controls preload="none" src={it.result.url} data-testid="audio-preview" /> : null)}
            />
          )}
        </div>
      </div>
    </MediaShell>
  );
}
