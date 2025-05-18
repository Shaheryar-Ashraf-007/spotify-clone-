import { useMusicApp } from "@/stores/useMusicStore";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Clock, Pause, Play } from "lucide-react";
import usePlayerStore from "@/stores/usePlayerStore";

const AlbumPage = () => {
  const { albumId } = useParams(); // Get the album ID from URL
  const { fetchAlbumById, currentAlbum, isLoading } = useMusicApp();

  const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (albumId) {
      console.log("Fetching album with ID:", albumId);
      fetchAlbumById(albumId); // Fetch album by the dynamic ID
    }
  }, [fetchAlbumById, albumId]);

  const handlePlayAlbum = () => {
    if (!currentAlbum) return;

    const isCurrentAlbumPlaying = currentAlbum?.songs.some(
      (song) => song._id === currentSong?._id
    );
    if (isCurrentAlbumPlaying) togglePlay();
    else {
      playAlbum(currentAlbum?.songs, 0);
    }
  };

  const handlePlaySong = (index = number) => {
    if (!currentAlbum) return;

    playAlbum(currentAlbum?.songs, index);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!currentAlbum) return <div>No album data available.</div>;

  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="relative min-h-screen">
          {/* Background gradient */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80 to-zinc-900 pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10">
            {/* Album Header */}
            <div className="flex p-6 gap-6 pb-8">
              <img
                src={currentAlbum?.imageUrl}
                alt={currentAlbum?.title}
                className="w-[240px] h-[240px] shadow-xl rounded"
              />
              <div className="flex flex-col justify-end">
                <p className="text-sm font-medium">Album</p>
                <h1 className="text-7xl font-bold my-4">
                  {currentAlbum?.title}
                </h1>
                <div className="flex items-center gap-2 text-sm text-zinc-100">
                  <span className="font-medium text-white">
                    • {currentAlbum?.artist}
                  </span>
                  <span>• {currentAlbum?.songs.length} Songs</span>
                  <span>• {currentAlbum?.releaseYear}</span>
                </div>
              </div>
            </div>

            {/* Play Button */}
            <div className="h-full w-7 text-black">
              <Button
                onClick={handlePlayAlbum}
                size="icon"
                className="w-14 h-14 m-12 rounded-full bg-green-500 hover:bg-green-400 hover:scale-105 transition-all"
              >
                {isPlaying &&
                currentAlbum?.songs.some(
                  (song) => song._id === currentSong?._id
                ) ? (
                  <Pause className="h-7 w-7 text-black" />
                ) : (
                  <Play className="h-7 w-7 text-black" />
                )}
              </Button>
            </div>

            {/* Table Header */}
            <div className="bg-black/20 backdrop-blur-sm">
              <div className="grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm text-zinc-400 border-b border-white/5">
                <div>#</div>
                <div>Title</div>
                <div>Release Date</div>
                <div>
                  <Clock className="w-4 h-4" />
                </div>
              </div>

              {/* Songs List */}
              {/* Songs List */}
              <div className="px-6">
                <div className="space-y-2 py-4">
                  {currentAlbum.songs.map((song, index) => {
                    const isCurrentSong = currentSong?._id === song._id;

                    return (
                      <div
                        key={song._id}
                        onClick={() => handlePlaySong(index)}
                        className="grid grid-cols-[40px_4fr_2fr_1fr] gap-4 px-4 py-2 text-sm text-zinc-400 hover:bg-white/5 rounded-md group cursor-pointer"
                      >
                        {/* Index with Play Icon on Hover */}
                        <div className="flex items-center justify-start group-hover:text-green-500">
                          <span className="hidden group-hover:block"></span>
                          {isCurrentSong && isPlaying ? (
                            <div className="size-4 text-green-500">♫</div>
                          ) : (
                            <span className="group-hover:hidden">
                              {index + 1}
                            </span>
                          )}
                          {!isCurrentSong && (
                            <Play className="h-4 w-4 hidden group-hover:block" />
                          )}
                        </div>

                        {/* Song Info */}
                        <div className="flex items-center gap-3">
                          <img
                            src={song.imageUrl}
                            alt={song.title}
                            className="size-10 rounded"
                          />
                          <div className="font-medium text-white">
                            <div>{song.title}</div>
                            <div className="text-xs text-zinc-400">
                              {song.artist}
                            </div>
                          </div>
                        </div>

                        {/* Release Date */}
                        <div className="flex items-center">
                          {song.createdAt
                            ? new Date(song.createdAt).toLocaleDateString()
                            : "—"}
                        </div>

                        {/* Duration */}
                        <div className="flex items-center">
                          {formatDuration(song.duration)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default AlbumPage;
