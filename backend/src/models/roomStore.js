// roomStore.js
const rooms = new Map();
// rooms[roomId] = { hostId, songId, position, isPlaying, queue: [], listeners: Set }

export const createRoom = (roomId, hostId) => {
  rooms.set(roomId, {
    hostId,
    songId: null,
    position: 0,
    isPlaying: false,
    queue: [],
    listeners: new Set([hostId]),
  });
};

export const getRoom = (roomId) => rooms.get(roomId);
export const deleteRoom = (roomId) => rooms.delete(roomId);