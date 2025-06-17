import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// Global flag to prevent multiple socket initializations
let isSocketInitializing = false;

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { data: session } = useSession();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitializing, setIsInitializing] = useState(false);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    // Only initialize if we have a session, no existing socket, and not already initializing
    if (
      session?.user?.id &&
      !socketRef.current &&
      !isInitializing &&
      !isSocketInitializing
    ) {
      console.log("Starting socket initialization for user:", session.user.id);
      setIsInitializing(true);
      isSocketInitializing = true;

      const initializeSocket = async () => {
        try {
          console.log("Initializing socket connection...");

          // Call the socketio API to initialize the server
          await fetch("/api/socketio");

          // Create new socket connection
          const newSocket = io({
            path: "/api/socketio",
            addTrailingSlash: false,
            transports: ["polling", "websocket"],
            autoConnect: true,
            timeout: 20000,
            forceNew: false, // Don't force new connection
            withCredentials: true,
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });

          newSocket.on("connect", () => {
            console.log("Connected to server with ID:", newSocket.id);
            setIsConnected(true);
            setIsInitializing(false);
            isSocketInitializing = false;
            // Authenticate the user
            newSocket.emit("authenticate", session.user.id);
          });

          newSocket.on("disconnect", (reason) => {
            console.log("Disconnected from server:", reason);
            setIsConnected(false);
            setIsInitializing(false);
            isSocketInitializing = false;
            // Only clear the ref if it's not a reconnection attempt
            if (reason === "io server disconnect") {
              socketRef.current = null;
            }
          });

          newSocket.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setIsConnected(false);
            setIsInitializing(false);
            isSocketInitializing = false;
            // Don't clear the ref on connection error, let it retry
          });

          newSocket.on("reconnect", (attemptNumber) => {
            console.log("Reconnected after", attemptNumber, "attempts");
            setIsConnected(true);
            setIsInitializing(false);
            // Re-authenticate after reconnection
            newSocket.emit("authenticate", session.user.id);
          });

          newSocket.on("reconnect_error", (error) => {
            console.error("Reconnection error:", error);
            setIsConnected(false);
          });

          // Listen for new messages to update unread count
          newSocket.on("receive_message", (message) => {
            setUnreadCount((prev) => prev + 1);
          });

          setSocket(newSocket);
          socketRef.current = newSocket;

          // Make socket available globally for typing indicators
          if (typeof window !== "undefined") {
            window.socket = newSocket;
          }
        } catch (error) {
          console.error("Error initializing socket:", error);
          setIsInitializing(false);
          isSocketInitializing = false;
          socketRef.current = null;
        }
      };

      initializeSocket();
    }
  }, [session?.user?.id, isInitializing]);

  // Cleanup on unmount or session change
  useEffect(() => {
    return () => {
      if (socketRef.current) {
        console.log("Cleaning up socket connection...");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
        if (typeof window !== "undefined") {
          window.socket = null;
        }
      }
    };
  }, []);

  // Fetch unread count when session is available
  useEffect(() => {
    if (session?.user?.id) {
      fetchUnreadCount();
    }
  }, [session?.user?.id]);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await fetch("/api/messages");
      if (response.ok) {
        const conversations = await response.json();
        const totalUnread = conversations.reduce(
          (sum, conv) => sum + (conv.unreadCount || 0),
          0
        );
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  // Start typing indicator
  const startTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit("typing_start", { receiverId });
    }
  };

  // Stop typing indicator
  const stopTyping = (receiverId) => {
    if (socket && isConnected) {
      socket.emit("typing_stop", { receiverId });
    }
  };

  const value = {
    socket,
    isConnected,
    unreadCount,
    fetchUnreadCount,
    startTyping,
    stopTyping,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
