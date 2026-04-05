import { useEffect, useRef, useState, useContext, useCallback } from "react";
// import { io } from "socket.io-client";
import { AuthContext } from "../Authentication/AuthContext";
import { auth } from "../Firebase/Firebase.config";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "https://anwesha-backend.vercel.app";

/**
 * Socket.io connection hook.
 * Manages a single shared connection per user session.
 */
export function useSocket() {
  const { user } = useContext(AuthContext);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
      return;
    }

    const connect = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;

        const socket = io(SOCKET_URL, {
          auth: { token },
          transports: ["websocket", "polling"],
        });

        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", () => setConnected(false));

        socketRef.current = socket;
      } catch (err) {
        console.error("Socket connection error:", err);
      }
    };

    connect();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setConnected(false);
      }
    };
  }, [user]);

  const on = useCallback((event, handler) => {
    socketRef.current?.on(event, handler);
    return () => socketRef.current?.off(event, handler);
  }, []);

  const emit = useCallback((event, data) => {
    socketRef.current?.emit(event, data);
  }, []);

  const joinConversation = useCallback((conversationId) => {
    socketRef.current?.emit("join:conversation", conversationId);
  }, []);

  const leaveConversation = useCallback((conversationId) => {
    socketRef.current?.emit("leave:conversation", conversationId);
  }, []);

  return {
    socket: socketRef.current,
    connected,
    on,
    emit,
    joinConversation,
    leaveConversation,
  };
}
