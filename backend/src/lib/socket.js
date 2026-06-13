import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

let io;
const rooms = new Map(); // for live listening rooms

export const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {
    console.log("🔌 New connection:", socket.id);

    // ─── CHAT / PRESENCE ─────────────────────────────────────

    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");
      io.emit("user_connected", userId);
      io.emit("users_online", Array.from(userSockets.keys()));
    });

    socket.on("user_activity", (userId, activity) => {
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;
        if (!senderId || !receiverId || !content) return;

        const message = await Message.create({ senderId, receiverId, content });

        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }
        socket.emit("message_sent", message);
      } catch (error) {
        console.error("Message error:", error);
      }
    });

    // ─── LIVE LISTENING ROOMS ────────────────────────────────

    socket.on("create_room", ({ roomId }) => {
      if (rooms.has(roomId)) {
        const room = rooms.get(roomId);
        room.hostId = socket.id;
        room.listeners.add(socket.id);
        socket.join(roomId);
        socket.emit("room_created", { roomId });
        console.log("🔄 Host rejoined room:", roomId, "new hostId:", socket.id);
        return;
      }

      rooms.set(roomId, {
        hostId: socket.id,
        songId: null,
        position: 0,
        isPlaying: false,
        queue: [],
        listeners: new Set([socket.id]),
      });
      socket.join(roomId);
      socket.emit("room_created", { roomId });
      console.log("✅ Room created:", roomId, "hostId:", socket.id);
    });

    socket.on("join_room", ({ roomId }) => {
      const room = rooms.get(roomId);
      if (!room) {
        console.log("❌ Room not found:", roomId);
        return socket.emit("error", { message: "Room not found" });
      }

      room.listeners.add(socket.id);
      socket.join(roomId);
      console.log("👤 Listener joined:", socket.id, "| Room:", roomId, "| Song:", room.songId);

      socket.emit("sync_state", {
        songId: room.songId,
        position: room.position,
        isPlaying: room.isPlaying,
        queue: room.queue,
      });
    });

    socket.on("play_song", ({ roomId, songId, position = 0 }) => {
      const room = rooms.get(roomId);
      console.log("🎵 play_song | socket:", socket.id, "| hostId:", room?.hostId, "| match:", room?.hostId === socket.id);

      if (!room || room.hostId !== socket.id) {
        console.log("⛔ play_song rejected — not host");
        return;
      }

      room.songId = songId;
      room.position = position;
      room.isPlaying = true;

      console.log("📡 Broadcasting to room:", roomId, "| listeners:", room.listeners.size);
      io.to(roomId).emit("sync_state", {
        songId, position, isPlaying: true, queue: room.queue,
      });
    });

    socket.on("pause_song", ({ roomId, position }) => {
      const room = rooms.get(roomId);
      if (!room || room.hostId !== socket.id) return;

      room.isPlaying = false;
      room.position = position;

      io.to(roomId).emit("sync_state", {
        songId: room.songId, position, isPlaying: false, queue: room.queue,
      });
    });

    socket.on("seek_song", ({ roomId, position }) => {
      const room = rooms.get(roomId);
      if (!room || room.hostId !== socket.id) return;

      room.position = position;

      io.to(roomId).emit("sync_state", {
        songId: room.songId, position, isPlaying: room.isPlaying, queue: room.queue,
      });
    });

    // ─── DISCONNECT ──────────────────────────────────────────

    socket.on("disconnect", () => {
      console.log("🔌 Disconnected:", socket.id);

      // Clean up chat presence
      let disconnectedUserId;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          userActivities.delete(userId);
          break;
        }
      }
      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
        io.emit("users_online", Array.from(userSockets.keys()));
      }

      // Clean up rooms
      for (const [roomId, room] of rooms) {
        if (room.hostId === socket.id) {
          io.to(roomId).emit("room_closed");
          rooms.delete(roomId);
          console.log("🗑 Room deleted:", roomId);
        } else {
          room.listeners.delete(socket.id);
        }
      }
    });
  });
};

export const getIO = () => io;
export const getRooms = () => rooms;