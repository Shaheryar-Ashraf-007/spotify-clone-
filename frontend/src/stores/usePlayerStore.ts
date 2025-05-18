import { create } from 'zustand';
import { Song } from '@/types';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  originalQueue: Song[]; 
  currentIndex: number;
  isShuffle: boolean;
  repeatMode: number; 

  // Queue management
  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], index?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  
  // Playback controls
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
  
  // New functionality
  toggleShuffle: () => void;
  setRepeatMode: (mode: number) => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  originalQueue: [], // Keep track of original queue order
  currentIndex: -1,
  isShuffle: false,
  repeatMode: 0, // Default: no repeat
  
  initializeQueue: (songs: Song[]) => {
    set({
      queue: songs,
      originalQueue: [...songs], // Store original order
      currentSong: get().currentSong || songs[0],
      currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
    });
  },
  
  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;
    
    const song = songs[startIndex];
    
    set({
      queue: songs,
      originalQueue: [...songs], // Store original order
      currentIndex: startIndex,
      currentSong: song,
      isPlaying: true,
    });
  },
  
  setCurrentSong: (song: Song | null) => {
    if (!song) {
      set({ currentSong: null, isPlaying: false });
      return;
    }
    
    const songIndex = get().queue.findIndex((s) => s._id === song._id);
    set({
      currentSong: song,
      isPlaying: true,
      currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
    });
  },
  
  togglePlay: () => {
    const whilePlaying = !get().isPlaying;
    set({ isPlaying: whilePlaying });
  },
  
  playNext: () => {
    const { queue, currentIndex, repeatMode } = get();
    if (queue.length === 0) return;
    
    let nextIndex = currentIndex;
    
    if (repeatMode === 2) {
      // Repeat One - play same song again
      // Keep the same index
    } else {
      // Move to next song (for both no repeat and repeat all)
      nextIndex = (currentIndex + 1) % queue.length;
      
      // If no repeat and we've reached the end, stop playback
      if (repeatMode === 0 && nextIndex === 0) {
        set({ isPlaying: false });
        return;
      }
    }
    
    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
    });
  },
  
  playPrevious: () => {
    const { queue, currentIndex } = get();
    if (queue.length === 0) return;
    
    const prevIndex = (currentIndex - 1 + queue.length) % queue.length;
    set({
      currentIndex: prevIndex,
      currentSong: queue[prevIndex],
    });
  },
  
  toggleShuffle: () => {
    const { isShuffle, queue, originalQueue, currentSong } = get();
    
    if (isShuffle) {
      // Turn shuffle off - restore original order
      set({
        isShuffle: false,
        queue: [...originalQueue],
        currentIndex: currentSong ? originalQueue.findIndex(song => song._id === currentSong._id) : 0
      });
    } else {
      // Turn shuffle on - randomize queue except current song
      const currentSongId = currentSong?._id;
      let shuffledQueue = [...originalQueue];
      
      // Remove current song from the array before shuffling
      if (currentSongId) {
        const currentSongIndex = shuffledQueue.findIndex(song => song._id === currentSongId);
        if (currentSongIndex !== -1) {
          const currentSongItem = shuffledQueue.splice(currentSongIndex, 1)[0];
          
          // Shuffle the rest
          for (let i = shuffledQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledQueue[i], shuffledQueue[j]] = [shuffledQueue[j], shuffledQueue[i]];
          }
          
          // Put current song back at current position
          shuffledQueue.unshift(currentSongItem);
        }
      }
      
      set({
        isShuffle: true,
        queue: shuffledQueue,
        currentIndex: 0
      });
    }
  },
  
  setRepeatMode: (mode: number) => {
    set({ repeatMode: mode });
  }
}));

export default usePlayerStore;