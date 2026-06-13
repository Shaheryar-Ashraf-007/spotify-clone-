// controllers/room.controller.js
import { getRooms } from "../lib/socket.js"; // ✅ same file as initializeSocket

export const getRoomState = (req, res) => {
  const room = getRooms().get(req.params.roomId);
  if (!room) return res.status(404).json({ message: "Room not found" });

  res.json({
    songId: room.songId,
    position: room.position,
    isPlaying: room.isPlaying,
    queue: room.queue,
    listenerCount: room.listeners.size,
  });
};