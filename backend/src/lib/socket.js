import { Server } from 'socket.io';
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
        socket.on("user_connected", (userId) => {
            userSockets.set(userId, socket.id);
            userActivities.set(userId, "Idle");

            io.emit("user_connected", userId);
            socket.emit("users_online", Array.from(userActivities.entries()));
            io.emit("users_online", Array.from(userActivities.entries()));
        });

        socket.on("user_activity", (userId, activity) => {
            console.log("User activity", userId, activity);
            userActivities.set(userId, activity);
            io.emit("user_activity", userId, activity);
        });

        socket.on("disconnect", async (data) => {
            try {
                if (data) {
                    const { senderId, receiverId, content } = data;

                    const message = await Message.create({
                        sender: senderId,
                        receiver: receiverId,
                        content: content,
                    });

                    const receiverSocketId = userSockets.get(receiverId);
                    if (receiverSocketId) {
                        io.to(receiverSocketId).emit("message_received", message);
                    }

                    socket.emit("message_sent", message);
                }
            } catch (error) {
                console.error("Error handling disconnect:", error);
                socket.emit("error", "Failed to send message on disconnect");
            }
        });

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
                io.emit("users_online", Array.from(userActivities.entries()));
            }
        });
    });
};