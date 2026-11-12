"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import { asset } from "@/lib/site";
import zh from "./i18n/messages/zh-CN.json";
import en from "./i18n/messages/en.json";
import ja from "./i18n/messages/ja.json";
import ko from "./i18n/messages/ko.json";

import { useRef, useState } from "react";

const VOICES = [
  {
    id: "zh",
    label: "s109",
    duration: "0:17",
    asset: asset("audio/anniversary-zh.mp3"),
  },
  {
    id: "en",
    label: "s112",
    duration: "0:19",
    asset: asset("audio/anniversary-en.mp3"),
  },
  {
    id: "ja",
    label: "s110",
    duration: "0:22",
    asset: asset("audio/anniversary-ja.mp3"),
  },
  {
    id: "ko",
    label: "s111",
    duration: "0:20",
    asset: asset("audio/anniversary-ko.mp3"),
  },
] as const;

export function AnniversaryVoicePlayer() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeVoiceIndex, setActiveVoiceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState<number | null>(null);
  const activeVoice = VOICES[activeVoiceIndex];
  const quote = quoteIndex === null ? { s074: t("s074"), s075: t("s075") } : [zh, en, ja, ko][quoteIndex];

  const selectVoice = (index: number) => {
    setQuoteIndex(index);
    if (index === activeVoiceIndex) return;

    audioRef.current?.pause();
    setActiveVoiceIndex(index);
    setIsPlaying(false);
    setError("");
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setError("");

    if (!audio.paused) {
      audio.pause();
      return;
    }

    try {
      await audio.play();
    } catch {
      setIsPlaying(false);
      setError(t("s113"));
    }
  };

  return (
    <div className={`voice-quotation${isPlaying ? " is-playing" : ""}`} aria-label={t("s114")}>
      <button
        className="design-credo-statement quote-play"
        type="button"
        onClick={togglePlayback}
        aria-label={`${quote.s074} ${quote.s075} — ${isPlaying ? t("s105") : t("s106")} · ${t(activeVoice.label)}`}
        aria-pressed={isPlaying}
      >
        <span lang={quoteIndex === null ? undefined : ["zh-CN", "en", "ja", "ko"][quoteIndex]} dir={quoteIndex === null ? undefined : "ltr"}>{quote.s074}</span>
        <span lang={quoteIndex === null ? undefined : ["zh-CN", "en", "ja", "ko"][quoteIndex]} dir={quoteIndex === null ? undefined : "ltr"}>{quote.s075}</span>
      </button>

      <div className="quote-voice-controls">
      <span className="quote-voice-status" aria-hidden="true"><i /><i /><i /><i /><span>{activeVoice.duration}</span></span>
      <div className="voice-languages" role="group" aria-label={t("s117")}>
        {VOICES.map((voice, index) => (
          <button
            className={index === activeVoiceIndex ? "is-active" : ""}
            type="button"
            key={voice.id}
            onClick={() => selectVoice(index)}
            aria-pressed={index === activeVoiceIndex}
          >
            <span>{t(voice.label)}</span>
          </button>
        ))}
      </div>
      </div>

      {error ? <span className="voice-line-error" role="status">{error}</span> : null}

      <audio
        key={activeVoice.id}
        ref={audioRef}
        src={activeVoice.asset}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setIsPlaying(false);
        }}
        onError={() => {
          setIsPlaying(false);
          setError(t("s113"));
        }}
      />
    </div>
  );
}
