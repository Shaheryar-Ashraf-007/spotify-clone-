import { Button } from "@/components/ui/button";
import usePlayerStore from "@/stores/usePlayerStore";
import { Song } from "@/types";
import { Pause, Play } from "lucide-react";
import { useCallback } from "react";

const PlayButton = ({ song }: { song: Song }) => {
    const { currentSong, isPlaying, setCurrentSong, togglePlay } = usePlayerStore();

    const isCurrentSong = currentSong?._id === song._id;

    const handlePlay = useCallback(() => {
        if (isCurrentSong) {
            togglePlay(); 
        } else {
            setCurrentSong(song);
        }
    }, [isCurrentSong, song, setCurrentSong, togglePlay]);

    return (
        <Button
            size="icon"
            className={`absolute bottom-3 right-2 bg-green-500 hover:bg-green-400 hover:scale-105 transition-all 
                opacity-0 rounded-full translate-y-2 group-hover:translate-y-0 ${
                    isCurrentSong ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
            onClick={handlePlay}
            aria-label={isCurrentSong ? (isPlaying ? "Pause" : "Play") : "Play new song"}
        >
            {isCurrentSong && isPlaying ? (
                <Pause className="size-5 text-black" />
            ) : (
                <Play className="size-5 text-black" />
            )}
        </Button>
    );
};

export default PlayButton;