import { create } from "zustand";
import { io } from "socket.io-client";
import { axiosinstance } from "@/lib/axios";

const baseURL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "/";

export const useChatStore = create((set, get) => ({
  users: [],
  isLoading: false,
  error: null,

  socket: null,
  isConnected: false,

  onlineUsers: new Set(),
  userActivities: new Map(),

  messages: [],
  selectedUser: null,

  // 🔹 Select user
  setSelectedUser: (user) => set({ selectedUser: user }),

  // 🔹 Fetch users
  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosinstance.get("/users");
      set({ users: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch users" });
    } finally {
      set({ isLoading: false });
    }
  },

  // 🔹 INIT SOCKET (FIXED)
  initSocket: (userId) => {
    const existingSocket = get().socket;
    if (existingSocket) return; // ✅ prevent multiple connections

    const socket = io(baseURL, {
      autoConnect: false,
      withCredentials: true,
      auth: { userId },
    });

    socket.connect();

    socket.emit("user_connected", userId);

    // 🔹 online users
    socket.on("users_online", (users) => {
      set({ onlineUsers: new Set(users) });
    });

    socket.on("user_connected", (id) => {
      set((state) => ({
        onlineUsers: new Set([...state.onlineUsers, id]),
      }));
    });

    socket.on("user_disconnected", (id) => {
      set((state) => {
        const updated = new Set(state.onlineUsers);
        updated.delete(id);
        return { onlineUsers: updated };
      });
    });

    // 🔥 ONLY ONE SOURCE OF TRUTH FOR RECEIVING MESSAGE
    socket.on("receive_message", (message) => {
      set((state) => ({
        messages: [...state.messages, message],
      }));
    });

    set({ socket, isConnected: true });
  },

  // 🔹 Disconnect socket
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
    }

    set({
      socket: null,
      isConnected: false,
      onlineUsers: new Set(),
      userActivities: new Map(),
    });
  },

  // 🔹 SEND MESSAGE (OPTIMISTIC UI ONLY)
  sendMessage: (messageData) => {
    const socket = get().socket;
    if (!socket || !get().isConnected) return;

    const { senderId, receiverId, content } = messageData;

    if (!senderId || !receiverId || !content?.trim()) {
      console.log("Invalid message:", messageData);
      return;
    }

    // emit to backend
    socket.emit("send_message", messageData);

    // ✅ optimistic UI (ONLY PLACE message is added for sender)
    set((state) => ({
      messages: [
        ...state.messages,
        {
          _id: Date.now().toString(),
          senderId,
          receiverId,
          content,
          createdAt: new Date().toISOString(),
          optimistic: true,
        },
      ],
    }));
  },

  // 🔹 Fetch messages
  fetchMessages: async (userId) => {
    set({ isLoading: true, error: null });

    try {
      const res = await axiosinstance.get(`/users/messages/${userId}`);
      set({ messages: res.data });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch messages" });
    } finally {
      set({ isLoading: false });
    }
  },
}));