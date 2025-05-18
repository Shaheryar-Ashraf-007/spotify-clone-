import usePlayerStore from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const prevSongRef = useRef<string | null>(null);
    const { currentSong, isPlaying, playNext } = usePlayerStore();

    // Handle play/pause based on isPlaying state
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            if (isPlaying) {
                const playPromise = audio.play();
                if (playPromise) {
                    playPromise.catch(error => {
                        console.error("Playback failed:", error);
                        // Optionally inform the user here
                    });
                }
            } else {
                audio.pause();
            }
        }
    }, [isPlaying]);

    // Handle the end of the song
    useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => {
            playNext();
        };

        if (audio) {
            audio.addEventListener('ended', handleEnded);
        }

        return () => {
            if (audio) {
                audio.removeEventListener('ended', handleEnded);
            }
        };
    }, [playNext]);

    // Change the audio source when the current song changes
    useEffect(() => {
        if (!audioRef.current || !currentSong) return;

        const audio = audioRef.current;
        const isSongChanged = prevSongRef.current !== currentSong.audioUrl;

        if (isSongChanged) {
            audio.src = currentSong.audioUrl;
            audio.currentTime = 0; 
            prevSongRef.current = currentSong.audioUrl;

            // Load the new audio source
            audio.load();

            // Handle play attempt after loading
            const playPromise = audio.play();
            if (playPromise) {
                playPromise.catch(error => {
                    console.error("Playback failed:", error);
                    // Inform the user about the autoplay restriction
                });
            }
        }
    }, [currentSong]);

    return (
        <audio ref={audioRef} />
    );
};

export default AudioPlayer;