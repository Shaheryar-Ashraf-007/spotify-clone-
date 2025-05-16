import { create } from 'zustand';

import { Song } from '@/types';

interface PlayerStore {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentIndex: number;

  initializeQueue: (songs: Song[]) => void;
  playAlbum: (songs: Song[], index?: number) => void;
  setCurrentSong: (song: Song | null) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

const usePlayerStore = create<PlayerStore>((set, get) => ({
  currentSong: null,
  isPlaying: false,
  queue: [],
  currentIndex: -1,

  
	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

  playAlbum: (songs: Song[], startIndex = 0) => {
    if (songs.length === 0) return;

    const song = songs[startIndex];

    set({
      queue: songs,
      currentIndex:startIndex,
      currentSong:song,
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
    const { queue, currentIndex } = get();
    if (queue.length === 0) {
    const nextIndex = (currentIndex + 1) % queue.length;

    set({
      currentIndex: nextIndex,
      currentSong: queue[nextIndex],
    });
  }
    
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
}));

export default usePlayerStore;