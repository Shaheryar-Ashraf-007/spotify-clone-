import { axiosinstance } from "@/lib/axios"; 
import { Album, Song } from "@/types";
import { create } from "zustand";

// Define the structure of the music store
interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  featuredSongs: Song[];
  madeForYouSongs: Song[];
  trendingSongs: Song[];

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSongs: () => Promise<void>;
  fetchMadeForYouSongs: () => Promise<void>;
  fetchTrendingSongs: () => Promise<void>;
}

export const useMusicApp = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  featuredSongs: [], 
  madeForYouSongs: [], 
  trendingSongs: [], 

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });

    try {
      const response = await axiosinstance.get('/albums');
      console.log("API Response:", response.data); 

      if (Array.isArray(response.data.albums)) {
        set({ albums: response.data.albums });
      } else {
        console.error("Expected an array but got:", response.data.albums);
        set({ albums: [] });
      }
    } catch (error: any) {
      set({ error: error.response?.data?.message || "An error occurred" });
      console.error("Fetch error:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      console.log("Fetching album with ID:", id);
      const response = await axiosinstance.get(`/albums/${id}`);
      
      if (!response.data || !Array.isArray(response.data.songs)) {
        set({ currentAlbum: null, songs: [] });
        console.error("No valid album data received");
        return;
      }

      set({ currentAlbum: response.data, songs: response.data.songs });
      console.log("Fetched album:", response.data);
    } catch (error: any) {
      console.error("Fetch error:", error);
      set({ error: error.response?.data?.message || "An error occurred" });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedSongs: async () => {
    set({ isLoading: true, error: null });

    try {
        const response = await axiosinstance.get('/songs/featured');
        console.log("Featured Songs Response:", response.data); // Log the full response

        // Adjust according to the actual response structure
        if (Array.isArray(response.data.songs)) {
            set({ featuredSongs: response.data.songs });
        } else {
            console.error("Expected an array but got:", response.data.songs);
            set({ featuredSongs: [] });
        }
    } catch (error: any) {
        set({ error: error.response?.data?.message || "An error occurred" });
        console.error("Fetch error:", error);
    } finally {
        set({ isLoading: false });
    }
},
  fetchMadeForYouSongs: async () => {
    set({ isLoading: true, error: null });

    try {
        const response = await axiosinstance.get('/songs/made-for-you');
        console.log("Made For You Songs Response:", response.data); 

        if (Array.isArray(response.data.songs)) {
            set({ madeForYouSongs: response.data.songs });
        } else {
            console.error("Expected an array but got:", response.data.songs);
            set({ madeForYouSongs: [] });
        }
    } catch (error: any) {
        set({ error: error.response?.data?.message || "An error occurred" });
        console.error("Fetch error:", error);
    } finally {
        set({ isLoading: false });
    }

  },

  fetchTrendingSongs: async () => {
     set({ isLoading: true, error: null });
        try {
          const response = await axiosinstance.get("/songs/trending");
          set({ trendingSongs: response.data });
        } catch (error: any) {
          set({ error: error.response.data.message });
        } finally {
          set({ isLoading: false });
        }
    
  },
}));