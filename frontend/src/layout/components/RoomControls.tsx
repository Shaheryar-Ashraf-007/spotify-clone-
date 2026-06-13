import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import useRoomStore from "@/stores/useRoomStore";

const RoomControls = () => {
  const [input, setInput] = useState("");
  const { user } = useUser();
  const { roomId, isHost, createRoom, joinRoom, leaveRoom } = useRoomStore();

  const userId = user?.id ?? "anonymous";

  if (roomId) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-400">
          {isHost ? "🎙 Hosting" : "🎧 Listening"}: <b>{roomId}</b>
        </span>
        <button
          onClick={leaveRoom}
          className="px-3 py-1 bg-red-500 rounded-full text-white text-xs"
        >
          Leave
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Room ID..."
        className="px-3 py-1 rounded-full bg-zinc-700 text-white text-sm w-32"
      />
      <button
        onClick={() => input && createRoom(input, userId)}
        className="px-3 py-1 bg-green-500 rounded-full text-white text-xs"
      >
        Host
      </button>
      <button
        onClick={() => input && joinRoom(input, userId)}
        className="px-3 py-1 bg-blue-500 rounded-full text-white text-xs"
      >
        Join
      </button>
    </div>
  );
};

export default RoomControls;