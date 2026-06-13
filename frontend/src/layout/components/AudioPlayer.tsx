import usePlayerStore from "@/stores/usePlayerStore";
import useRoomStore from "@/stores/useRoomStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prevSongRef = useRef<string | null>(null);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { currentSong, isPlaying, playNext } = usePlayerStore();

  // Play / pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // Cancel any pending pause emit
      if (pauseTimerRef.current) {
        clearTimeout(pauseTimerRef.current);
        pauseTimerRef.current = null;
      }

      const tryPlay = () => {
        audio.play().catch(console.error);
        const { isHost, emitPlay } = useRoomStore.getState();
        if (isHost && currentSong) {
          console.log("📡 emitting play_song:", currentSong._id, "at", audio.currentTime);
          emitPlay(currentSong._id, audio.currentTime);
        }
      };

      if (audio.readyState >= 3) {
        tryPlay();
      } else {
        audio.addEventListener("canplay", tryPlay, { once: true });
        return () => audio.removeEventListener("canplay", tryPlay);
      }
    } else {
      audio.pause();
      const { isHost, emitPause } = useRoomStore.getState();
      if (isHost) {
        // Debounce pause — wait 300ms to avoid emitting on song transitions
        pauseTimerRef.current = setTimeout(() => {
          emitPause(audio.currentTime);
          console.log("📡 emitting pause at", audio.currentTime);
        }, 300);
      }
    }
  }, [isPlaying]);

  // Song ended
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener("ended", playNext);
    return () => audio.removeEventListener("ended", playNext);
  }, [playNext]);

  // Song changed
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentSong) return;
    if (prevSongRef.current === currentSong.audioUrl) return;

    // Cancel any pending pause when song changes
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
      pauseTimerRef.current = null;
    }

    prevSongRef.current = currentSong.audioUrl;
    audio.src = currentSong.audioUrl;
    audio.load();

    const onCanPlay = () => {
      audio.play().catch(console.error);
      const { isHost, emitPlay } = useRoomStore.getState();
      if (isHost) {
        console.log("📡 emitting play_song on song change:", currentSong._id);
        emitPlay(currentSong._id, 0);
      }
    };

    audio.addEventListener("canplay", onCanPlay, { once: true });
    return () => audio.removeEventListener("canplay", onCanPlay);
  }, [currentSong]);

  return <audio ref={audioRef} />;
};

export default AudioPlayer;