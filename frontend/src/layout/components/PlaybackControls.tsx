import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import usePlayerStore from "@/stores/usePlayerStore";
import { 
  Laptop2, 
  ListMusic, 
  Mic2, 
  Pause, 
  Play, 
  Repeat, 
  Repeat1, 
  Shuffle, 
  SkipBack, 
  SkipForward, 
  Volume1,
  Volume2,
  VolumeX 
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const formatTime = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const PlaybackControls = () => {
	const { 
    currentSong, 
    isPlaying, 
    togglePlay, 
    playNext, 
    playPrevious,
    isShuffle,
    toggleShuffle,
    repeatMode,
    setRepeatMode
  } = usePlayerStore();

	const [volume, setVolume] = useState(75);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [isMuted, setIsMuted] = useState(false);
	const [prevVolume, setPrevVolume] = useState(75);
	const [showPlaylist, setShowPlaylist] = useState(false);
	const [showDevices, setShowDevices] = useState(false);
	const [showMic, setShowMic] = useState(false);
	
	const audioRef = useRef<HTMLAudioElement | null>(null);

	useEffect(() => {
		audioRef.current = document.querySelector("audio");

		const audio = audioRef.current;
		if (!audio) return;

		const updateTime = () => setCurrentTime(audio.currentTime);
		const updateDuration = () => setDuration(audio.duration);

		audio.addEventListener("timeupdate", updateTime);
		audio.addEventListener("loadedmetadata", updateDuration);

		const handleEnded = () => {
			if (repeatMode === 2) {
				// Repeat one
				audio.currentTime = 0;
				audio.play();
			} else if (repeatMode === 1) {
				// Repeat all
				playNext();
			} else {
				// No repeat
				if (isShuffle) {
					playNext();
				} else {
					const store = usePlayerStore.getState();
					// Check if we're at the end of the queue
					if (store.currentIndex === store.queue.length - 1) {
						usePlayerStore.setState({ isPlaying: false });
					} else {
						playNext();
					}
				}
			}
		};

		audio.addEventListener("ended", handleEnded);

		// Update audio volume based on component state
		audio.volume = isMuted ? 0 : volume / 100;

		return () => {
			audio.removeEventListener("timeupdate", updateTime);
			audio.removeEventListener("loadedmetadata", updateDuration);
			audio.removeEventListener("ended", handleEnded);
		};
	}, [currentSong, repeatMode, isShuffle, volume, isMuted, playNext]);

	const handleSeek = (value: number[]) => {
		if (audioRef.current) {
			audioRef.current.currentTime = value[0];
		}
	};

	const handleToggleShuffle = () => {
		toggleShuffle();
	};

	const handleToggleRepeat = () => {
		// Cycle through repeat modes: no repeat -> repeat all -> repeat one -> no repeat
		setRepeatMode((repeatMode + 1) % 3);
	};

	const toggleMute = () => {
		if (isMuted) {
			setIsMuted(false);
			setVolume(prevVolume);
			if (audioRef.current) {
				audioRef.current.volume = prevVolume / 100;
			}
		} else {
			setIsMuted(true);
			setPrevVolume(volume);
			setVolume(0);
			if (audioRef.current) {
				audioRef.current.volume = 0;
			}
		}
	};

	const togglePlaylist = () => {
		setShowPlaylist(!showPlaylist);
		// Close other panels if open
		if (!showPlaylist) {
			setShowDevices(false);
			setShowMic(false);
		}
	};

	const toggleDevices = () => {
		setShowDevices(!showDevices);
		// Close other panels if open
		if (!showDevices) {
			setShowPlaylist(false);
			setShowMic(false);
		}
	};

	const toggleMic = () => {
		setShowMic(!showMic);
		// Close other panels if open
		if (!showMic) {
			setShowPlaylist(false);
			setShowDevices(false);
		}
	};

	// Calculate progress percentage for styling
	const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
	const volumePercentage = isMuted ? 0 : volume;

	// Determine which volume icon to show based on volume level
	const getVolumeIcon = () => {
		if (isMuted || volume === 0) {
			return <VolumeX className="h-4 w-4" />;
		} else if (volume < 50) {
			return <Volume1 className="h-4 w-4" />;
		} else {
			return <Volume2 className="h-4 w-4" />;
		}
	};

	return (
		<footer className='h-20 sm:h-24 bg-zinc-900 border-t border-zinc-800 px-4'>
			<div className='flex justify-between items-center h-full max-w-[1800px] mx-auto'>
				{/* currently playing song */}
				<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%]'>
					{currentSong && (
						<>
							<img
								src={currentSong.imageUrl}
								alt={currentSong.title}
								className='w-14 h-14 object-cover rounded-md'
							/>
							<div className='flex-1 min-w-0'>
								<div className='font-medium truncate hover:underline cursor-pointer'>
									{currentSong.title}
								</div>
								<div className='text-sm text-zinc-400 truncate hover:underline cursor-pointer'>
									{currentSong.artist}
								</div>
							</div>
						</>
					)}
				</div>

				{/* player controls*/}
				<div className='flex flex-col items-center gap-2 flex-1 max-w-full sm:max-w-[45%]'>
					<div className='flex items-center gap-4 sm:gap-6'>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex hover:text-white ${isShuffle ? 'text-green-500' : 'text-zinc-400'}`}
							onClick={handleToggleShuffle}
						>
							<Shuffle className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playPrevious}
							disabled={!currentSong}
						>
							<SkipBack className='h-4 w-4' />
						</Button>

						<Button
							size='icon'
							className='bg-white hover:bg-white/80 text-black rounded-full h-8 w-8'
							onClick={togglePlay}
							disabled={!currentSong}
						>
							{isPlaying ? <Pause className='h-5 w-5' /> : <Play className='h-5 w-5' />}
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className='hover:text-white text-zinc-400'
							onClick={playNext}
							disabled={!currentSong}
						>
							<SkipForward className='h-4 w-4' />
						</Button>
						<Button
							size='icon'
							variant='ghost'
							className={`hidden sm:inline-flex hover:text-white ${repeatMode > 0 ? 'text-green-500' : 'text-zinc-400'}`}
							onClick={handleToggleRepeat}
						>
							{repeatMode === 2 ? <Repeat1 className='h-4 w-4' /> : <Repeat className='h-4 w-4' />}
						</Button>
					</div>

					<div className='hidden sm:flex items-center gap-2 w-full'>
						<div className='text-xs text-zinc-400'>{formatTime(currentTime)}</div>
						<div className='w-full relative '>
							<div
								className='absolute h-1 bg-green-500 rounded-full z-0'
								style={{ width: `${progressPercentage}%` }}
							></div>
							<Slider
								value={[currentTime]}
								max={duration || 100}
								step={1}
								
								className='w-full z-10 hover:cursor-grab active:cursor-grabbing'
								onValueChange={handleSeek}
/>
						</div>
						<div className='text-xs text-zinc-400'>{formatTime(duration)}</div>
					</div>
				</div>
				{/* volume controls */}
				<div className='hidden sm:flex items-center gap-4 min-w-[180px] w-[30%] justify-end'>
					<Button 
						size='icon' 
						variant='ghost' 
						className={`hover:text-white ${showMic ? 'text-green-500' : 'text-zinc-400'}`}
						onClick={toggleMic}
					>
						<Mic2 className='h-4 w-4' />
					</Button>
					<Button 
						size='icon' 
						variant='ghost' 
						className={`hover:text-white ${showPlaylist ? 'text-green-500' : 'text-zinc-400'}`}
						onClick={togglePlaylist}
					>
						<ListMusic className='h-4 w-4' />
					</Button>
					<Button 
						size='icon' 
						variant='ghost' 
						className={`hover:text-white ${showDevices ? 'text-green-500' : 'text-zinc-400'}`}
						onClick={toggleDevices}
					>
						<Laptop2 className='h-4 w-4' />
					</Button>

					<div className='flex items-center gap-2'>
						<Button 
							size='icon' 
							variant='ghost' 
							className='hover:text-white text-zinc-400'
							onClick={toggleMute}
						>
							{getVolumeIcon()}
						</Button>

						<div className='w-24 relative'>
							<div
								className='absolute h-1 bg-green-500 rounded-full z-0'
								style={{ width: `${volumePercentage}%` }}
							></div>
							<Slider
								value={[volume]}
								max={100}
								step={1}
								className='w-full z-10 hover:cursor-grab active:cursor-grabbing'
								onValueChange={(value) => {
									setVolume(value[0]);
									setIsMuted(value[0] === 0);
									if (audioRef.current) {
										audioRef.current.volume = value[0] / 100;
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Optional panels for playlist, devices, and mic (you would implement the content) */}
			{showPlaylist && (
				<div className="absolute bottom-24 right-40 bg-zinc-800 p-4 rounded-md shadow-lg w-64">
					<h3 className="text-white text-sm font-medium mb-2">Playlist</h3>
					{/* Playlist content would go here */}
					<div className="max-h-64 overflow-y-auto">
						{usePlayerStore.getState().queue.map((song, index) => (
							<div 
								key={song._id} 
								className={`flex items-center p-2 hover:bg-zinc-700 rounded-md cursor-pointer ${
									usePlayerStore.getState().currentIndex === index ? 'bg-zinc-700' : ''
								}`}
								onClick={() => {
									usePlayerStore.getState().setCurrentSong(song);
								}}
							>
								<div className="w-8 h-8 min-w-8 bg-zinc-600 mr-2 rounded overflow-hidden">
									{song.imageUrl && (
										<img src={song.imageUrl} alt={song.title} className="w-full h-full object-cover" />
									)}
								</div>
								<div className="flex-1 min-w-0">
									<div className="text-sm font-medium text-white truncate">{song.title}</div>
									<div className="text-xs text-zinc-400 truncate">{song.artist}</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{showDevices && (
				<div className="absolute bottom-24 right-24 bg-zinc-800 p-4 rounded-md shadow-lg w-64">
					<h3 className="text-white text-sm font-medium mb-2">Connect to a device</h3>
					<div className="space-y-2">
						<div className="flex items-center p-2 bg-zinc-700 rounded-md">
							<Laptop2 className="h-4 w-4 mr-2 text-green-500" />
							<span className="text-sm text-white">This device</span>
							<div className="ml-auto text-xs bg-green-500 px-1.5 py-0.5 rounded-full">Active</div>
						</div>
						<div className="flex items-center p-2 hover:bg-zinc-700 rounded-md cursor-pointer">
							<Laptop2 className="h-4 w-4 mr-2 text-zinc-400" />
							<span className="text-sm text-white">Other devices will appear here</span>
						</div>
					</div>
				</div>
			)}

			{showMic && (
				<div className="absolute bottom-24 right-56 bg-zinc-800 p-4 rounded-md shadow-lg w-64">
					<h3 className="text-white text-sm font-medium mb-2">Voice control</h3>
					<div className="space-y-2">
						<p className="text-zinc-400 text-xs">Voice control is not available yet.</p>
						<Button size="sm" variant="outline" className="w-full">
							Enable voice assistant
						</Button>
					</div>
				</div>
			)}
		</footer>
	);
};