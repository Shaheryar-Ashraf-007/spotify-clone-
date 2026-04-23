import { Server } from "socket.io";
import { Message } from "../models/message.model.js";

export const initializeSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSockets = new Map();
  const userActivities = new Map();

  io.on("connection", (socket) => {

    // ✅ USER CONNECTED
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      io.emit("user_connected", userId);
      io.emit("users_online", Array.from(userSockets.keys()));
    });

    // ✅ USER ACTIVITY
    socket.on("user_activity", (userId, activity) => {
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    // ✅ 🔥 SEND MESSAGE (THIS WAS MISSING)
    socket.on("send_message", async (data) => {
      try {
        const { senderId, receiverId, content } = data;

        if (!senderId || !receiverId || !content) {
          console.log("Invalid message:", data);
          return;
        }

        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // Send to receiver
        const receiverSocketId = userSockets.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        // Send back to sender
        socket.emit("message_sent", message);

      } catch (error) {
        console.error("Message error:", error);
      }
    });

    // ❌ DO NOT SAVE MESSAGE HERE
    socket.on("disconnect", () => {
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
    });
  });
};