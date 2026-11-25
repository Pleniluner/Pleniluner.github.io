"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import type { Locale } from "./i18n/locales";
import { asset } from "@/lib/site";
import zh from "./i18n/messages/zh-CN.json";
import en from "./i18n/messages/en.json";
import ja from "./i18n/messages/ja.json";
import ko from "./i18n/messages/ko.json";

import { useRef, useState } from "react";
import styles from "./audio.module.css";

const VOICES = [
  {
    id: "zh",
    lang: "zh-CN",
    text: zh,
    label: "s109",
    duration: "0:17",
    asset: asset("audio/anniversary-zh.mp3"),
  },
  {
    id: "en",
    lang: "en",
    text: en,
    label: "s112",
    duration: "0:19",
    asset: asset("audio/anniversary-en.mp3"),
  },
  {
    id: "ja",
    lang: "ja",
    text: ja,
    label: "s110",
    duration: "0:22",
    asset: asset("audio/anniversary-ja.mp3"),
  },
  {
    id: "ko",
    lang: "ko",
    text: ko,
    label: "s111",
    duration: "0:20",
    asset: asset("audio/anniversary-ko.mp3"),
  },
] as const;
type Voice = (typeof VOICES)[number];

// These pages have translated quotations but no recording in the page language.
const recordingLabels: Partial<Record<Locale, string>> = {
  ar: "لغة التسجيل", de: "Sprache der Aufnahme", es: "Idioma de la grabación",
  fr: "Langue de l’enregistrement", it: "Lingua della registrazione",
  pt: "Idioma da gravação", ru: "Язык записи",
};

export function AnniversaryVoicePlayer() {
  const { t, locale } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const pageVoice = VOICES.find(voice => voice.id === locale.split("-")[0]);
  const [chosenVoice, setChosenVoice] = useState<Voice | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState("");
  const activeVoice = chosenVoice ?? pageVoice ?? VOICES[0];
  const quote = chosenVoice && chosenVoice !== pageVoice ? chosenVoice.text : { s074: t("s074"), s075: t("s075") };
  const quoteLanguage = chosenVoice ? (chosenVoice === pageVoice ? locale : chosenVoice.lang) : undefined;

  const selectVoice = (voice: Voice) => {
    setChosenVoice(voice);
    if (voice === activeVoice) return;

    audioRef.current?.pause();
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
    } catch (cause) {
      if (audio !== audioRef.current || (cause instanceof DOMException && cause.name === "AbortError")) return;
      setIsPlaying(false);
      setError(t("s113"));
    }
  };

  return (
    <div className={`voice-quotation${isPlaying ? " is-playing" : ""}`} aria-label={t("s114")}>
      <div className="quote-voice-controls">
        <span className="quote-voice-status" aria-hidden="true"><i /><i /><i /><i /><span>{activeVoice.duration}</span></span>
        <div className="voice-languages" role="group" aria-label={t("s117")}>
          {VOICES.map(voice => (
            <button
              className={voice === activeVoice ? "is-active" : ""}
              type="button"
              key={voice.id}
              onClick={() => selectVoice(voice)}
              aria-pressed={voice === activeVoice}
            >
              <span>{t(voice.label)}</span>
            </button>
          ))}
        </div>
      </div>

      {!pageVoice && (
        <p className={styles.recording} aria-live="polite">
          {recordingLabels[locale] ?? t("s116")} · {t(activeVoice.label)}
        </p>
      )}

      <button
        className="design-credo-statement quote-play"
        type="button"
        onClick={togglePlayback}
        aria-label={`${quote.s074} ${quote.s075} — ${isPlaying ? t("s105") : t("s106")} · ${t(activeVoice.label)}`}
        aria-pressed={isPlaying}
      >
        {[quote.s074, quote.s075].map((line, index) => (
          <span key={`${quoteLanguage ?? "page"}-${index}`} lang={quoteLanguage} dir={quoteLanguage ? "ltr" : undefined}>{line}</span>
        ))}
      </button>

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
