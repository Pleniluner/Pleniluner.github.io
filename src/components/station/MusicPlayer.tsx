"use client";
import { useLanguage } from "./i18n/LanguageProvider";
import { asset } from "@/lib/site";

import { type CSSProperties, type Ref, useImperativeHandle, useRef, useState } from "react";

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

const NAME_TRACK = 1;
export type MusicPlayerControls = { playElysiasHeart(): void };

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";

  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function MusicPlayer({ ref }: { ref?: Ref<MusicPlayerControls> }) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement>(null);
  const playbackRequestRef = useRef(0);
  const [activeTrackIndex, setActiveTrackIndex] = useState(NAME_TRACK);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(TRACKS[NAME_TRACK].duration);
  const [error, setError] = useState("");
  const activeTrack = TRACKS[activeTrackIndex];

  const play = (audio: HTMLAudioElement) => {
    const request = ++playbackRequestRef.current;
    if (audio.error) audio.load();
    setError("");
    setIsLoading(true);
    void audio.play().catch((cause: unknown) => {
      if (request !== playbackRequestRef.current || audio !== audioRef.current) return;
      setIsLoading(false);
      setIsPlaying(false);
      if (!(cause instanceof DOMException && cause.name === "AbortError")) setError(t("s102"));
    });
  };

  const selectTrack = (index: number, start = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    const next = TRACKS[index];
    if (audio.getAttribute("src") === next.asset) {
      if (start && (audio.paused || audio.error)) play(audio);
      return;
    }

    const continuePlaying = start || (!audio.paused && !audio.ended);
    playbackRequestRef.current += 1;
    setActiveTrackIndex(index);
    setIsPlaying(false);
    setIsLoading(false);
    setIsReady(false);
    setCurrentTime(0);
    setDuration(next.duration);
    setError("");

    // Change the source and request playback in the same user gesture.
    audio.src = next.asset;
    audio.load();
    if (continuePlaying) play(audio);
  };

  useImperativeHandle(ref, () => ({
    playElysiasHeart: () => selectTrack(NAME_TRACK, true),
  }));

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused || audio.error) {
      play(audio);
    } else {
      playbackRequestRef.current += 1;
      audio.pause();
      setIsLoading(false);
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
      tabIndex={-1}
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
        ref={audioRef}
        src={TRACKS[NAME_TRACK].asset}
        preload="none"
        onLoadedMetadata={(event) => {
          if (event.currentTarget.readyState < HTMLMediaElement.HAVE_METADATA) return;
          const nextDuration = event.currentTarget.duration;
          if (Number.isFinite(nextDuration)) setDuration(nextDuration);
          setIsReady(true);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onCanPlay={({ currentTarget }) => {
          if (currentTarget.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) return;
          setIsReady(true);
          setIsLoading(false);
        }}
        onPlay={({ currentTarget }) => {
          if (!currentTarget.paused) setIsPlaying(true);
        }}
        onPlaying={({ currentTarget }) => {
          if (!currentTarget.paused) setIsLoading(false);
        }}
        onWaiting={(event) => {
          if (!event.currentTarget.paused) setIsLoading(true);
        }}
        onPause={({ currentTarget }) => {
          if (currentTarget.paused) {
            setIsPlaying(false);
            setIsLoading(false);
          }
        }}
        onEnded={(event) => {
          if (!event.currentTarget.ended) return;
          event.currentTarget.currentTime = 0;
          setCurrentTime(0);
          setIsPlaying(false);
        }}
        onError={({ currentTarget }) => {
          if (!currentTarget.error) return;
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
