"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import { asset } from "@/lib/site";

import { type CSSProperties, useRef, useState } from "react";

const TRACKS = [
  {
    id: "last-tour-in-wonderland",
    title: "the Last Tour in Wonderland",
    artist: "ComicFishing",
    note: "s100",
    asset: asset("audio/name-story-01.mp3"),
    cover: asset("images/covers/last-tour-in-wonderland.jpg"),
    duration: 493.47,
  },
  {
    id: "elysias-heart",
    title: "Elysia's Heart",
    artist: "Aether feat. Enzalla",
    note: "s101",
    asset: asset("audio/name-story-02.mp3"),
    cover: asset("images/covers/elysias-heart.jpg"),
    duration: 217,
  },
] as const;

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function MusicPlayer() {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playbackRequestRef = useRef(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(TRACKS[1].duration);
  const [error, setError] = useState("");
  const activeTrack = TRACKS[activeTrackIndex];

  const selectTrack = (index: number) => {
    if (index === activeTrackIndex) return;

    playbackRequestRef.current += 1;

    const audio = audioRef.current;
    if (audio) audio.pause();

    setActiveTrackIndex(index);
    setIsPlaying(false);
    setIsLoading(false);
    setIsReady(false);
    setCurrentTime(0);
    setDuration(TRACKS[index].duration);
    setError("");
  };

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      playbackRequestRef.current += 1;
      audio.pause();
      setIsLoading(false);
      return;
    }

    if (isLoading) return;

    const requestId = playbackRequestRef.current + 1;
    playbackRequestRef.current = requestId;

    try {
      setError("");
      setIsLoading(true);
      await audio.play();
    } catch {
      if (requestId !== playbackRequestRef.current) return;
      setIsLoading(false);
      setIsPlaying(false);
      setError(t("s102"));
    }
  };

  const seek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = value;
    setCurrentTime(value);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const rangeStyle = { "--music-progress": `${progress}%` } as CSSProperties;

  return (
    <section
      className="music-player"
      id="elysias-heart-player"
      aria-label={t("s103")}
      data-reveal
    >
      <div className="music-cover" aria-hidden="true">
        <img
          key={activeTrack.id}
          src={activeTrack.cover}
          alt=""
          width="500"
          height="500"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="music-details" aria-live="polite">
        <span className="music-eyebrow">{t(activeTrack.note)}</span>
        <strong className="music-title">{activeTrack.title}</strong>
        <span className="music-artist">{activeTrack.artist}</span>
      </div>

      <div className="music-controls">
        <button
          className={`music-toggle${isPlaying ? " is-playing" : ""}${isLoading ? " is-loading" : ""}`}
          type="button"
          onClick={togglePlayback}
          aria-label={isLoading ? `${t("s104")} ${activeTrack.title}` : isPlaying ? `${t("s105")} ${activeTrack.title}` : `${t("s106")} ${activeTrack.title}`}
          aria-pressed={isPlaying}
          aria-busy={isLoading}
        >
          <span className="music-toggle-icon" aria-hidden="true" />
        </button>

        <div className="music-timeline">
          <input
            className="music-range"
            type="range"
            min="0"
            max={duration}
            step="0.1"
            value={currentTime}
            onChange={(event) => seek(Number(event.currentTarget.value))}
            aria-label={`${t("s107")}: ${activeTrack.title}`}
            style={rangeStyle}
            disabled={!isReady}
          />
          <div className="music-times" aria-hidden="true">
            <time>{formatTime(currentTime)}</time>
            <time>{formatTime(duration)}</time>
          </div>
        </div>
      </div>

      <div className="music-track-list" aria-label={t("s108")}>
        {TRACKS.map((track, index) => (
          <button
            className={index === activeTrackIndex ? "is-active" : ""}
            type="button"
            key={track.id}
            onClick={() => selectTrack(index)}
            aria-pressed={index === activeTrackIndex}
          >
            <span className="music-track-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <span className="music-track-copy">
              <strong>{track.title}</strong>
              <span>{track.artist}</span>
            </span>
            <time aria-hidden="true">{formatTime(track.duration)}</time>
          </button>
        ))}
      </div>

      {error ? <span className="music-error" role="status">{error}</span> : null}

      <audio
        key={activeTrack.id}
        ref={audioRef}
        src={activeTrack.asset}
        preload="none"
        onLoadedMetadata={(event) => {
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) setDuration(nextDuration);
          setIsReady(true);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onCanPlay={() => {
          setIsReady(true);
          setIsLoading(false);
        }}
        onPlay={() => {
          setIsPlaying(true);
        }}
        onPlaying={() => setIsLoading(false)}
        onWaiting={(event) => {
          if (!event.currentTarget.paused) setIsLoading(true);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={(event) => {
          event.currentTarget.currentTime = 0;
          setCurrentTime(0);
          setIsPlaying(false);
        }}
        onError={() => {
          playbackRequestRef.current += 1;
          setIsLoading(false);
          setIsReady(false);
          setIsPlaying(false);
          setError(t("s102"));
        }}
      />
    </section>
  );
}
