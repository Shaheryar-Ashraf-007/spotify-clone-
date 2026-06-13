import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import usePlayerStore from "./usePlayerStore";
import { axiosinstance } from "@/lib/axios"; // ✅ use this instead of fetch

interface RoomStore {
  socket: Socket | null;
  roomId: string | null;
  isHost: boolean;

  createRoom: (roomId: string, userId: string) => void;
  joinRoom: (roomId: string, userId: string) => void;
  leaveRoom: () => void;
  emitPlay: (songId: string, position: number) => void;
  emitPause: (position: number) => void;
  emitSeek: (position: number) => void;
}

const useRoomStore = create<RoomStore>((set, get) => ({
  socket: null,
  roomId: null,
  isHost: false,

  createRoom: (roomId: string, userId: string) => {
    get().socket?.disconnect();
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Host connected:", socket.id);
      socket.emit("create_room", { roomId, userId });
    });

    socket.on("connect_error", (err) =>
      console.error("❌ Connection error:", err.message)
    );

    socket.on("room_closed", () => get().leaveRoom());
    set({ socket, roomId, isHost: true });
  },

  joinRoom: (roomId: string, userId: string) => {
    get().socket?.disconnect();
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("✅ Listener connected:", socket.id);
      socket.emit("join_room", { roomId, userId });
    });

    socket.on("connect_error", (err) =>
      console.error("❌ Connection error:", err.message)
    );

    socket.on("sync_state", async ({ songId, position, isPlaying }) => {
  console.log("🎵 sync_state received", { songId, position, isPlaying });
  if (!songId) return;

  try {
    const { data } = await axiosinstance.get("/songs");
    const song = data.songs.find((s: any) => s._id === songId);

    if (!song) {
      console.error("❌ Song not found:", songId);
      return;
    }

    const playerState = usePlayerStore.getState();
    const audio = document.querySelector("audio") as HTMLAudioElement;

    // Song changed — load new song
    if (playerState.currentSong?._id !== songId) {
      console.log("✅ New song syncing:", song.title);
      playerState.setCurrentSong(song);

      if (audio) {
        audio.addEventListener("canplay", () => {
          audio.currentTime = position;
          if (!isPlaying) usePlayerStore.setState({ isPlaying: false });
        }, { once: true });
      }
      return;
    }

    // Same song — just sync play/pause/seek
    if (audio) {
      const diff = Math.abs(audio.currentTime - position);

      // Only seek if more than 2 seconds out of sync
      if (diff > 2) {
        console.log("⏩ Seeking to", position, "(diff:", diff, "s)");
        audio.currentTime = position;
      }

      if (isPlaying && audio.paused) {
        console.log("▶️ Resuming playback");
        usePlayerStore.setState({ isPlaying: true });
      } else if (!isPlaying && !audio.paused) {
        console.log("⏸ Pausing playback");
        usePlayerStore.setState({ isPlaying: false });
      }
    }
  } catch (err) {
    console.error("❌ Failed to sync:", err);
  }
});

    socket.on("room_closed", () => {
      alert("Host ended the session");
      get().leaveRoom();
    });

    set({ socket, roomId, isHost: false });
  },

  leaveRoom: () => {
    get().socket?.disconnect();
    set({ socket: null, roomId: null, isHost: false });
  },

  emitPlay: (songId: string, position: number) => {
    const { socket, roomId } = get();
    console.log("📤 emitPlay | connected:", socket?.connected, "| roomId:", roomId, "| songId:", songId);
    if (!socket || !roomId) return;
    if (socket.connected) {
      socket.emit("play_song", { roomId, songId, position });
    } else {
      socket.once("connect", () => {
        socket.emit("play_song", { roomId, songId, position });
      });
    }
  },

  emitPause: (position: number) => {
    const { socket, roomId } = get();
    if (socket && roomId) socket.emit("pause_song", { roomId, position });
  },

  emitSeek: (position: number) => {
    const { socket, roomId } = get();
    if (socket && roomId) socket.emit("seek_song", { roomId, position });
  },
}));

export default useRoomStore;