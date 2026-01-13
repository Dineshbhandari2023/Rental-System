import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    // Remove /api from the URL since Socket.io connects to root
    let API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

    // Remove /api suffix if it exists
    API_URL = API_URL.replace(/\/api$/, "");

    this.socket = io(API_URL, {
      auth: { token },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Send message
  sendMessage(to, message, bookingId = null) {
    if (!this.socket?.connected) {
      throw new Error("Socket not connected");
    }

    this.socket.emit("sendMessage", { to, message, bookingId });
  }

  // Mark message as read
  markAsRead(messageId) {
    if (this.socket?.connected) {
      this.socket.emit("readMessage", messageId);
    }
  }

  // Typing indicator
  sendTyping(to, isTyping) {
    if (this.socket?.connected) {
      this.socket.emit("typing", { to, isTyping });
    }
  }

  // Event listeners
  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("newMessage", callback);
      this.listeners.set("newMessage", callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on("messageSent", callback);
      this.listeners.set("messageSent", callback);
    }
  }

  onMessageRead(callback) {
    if (this.socket) {
      this.socket.on("messageRead", callback);
      this.listeners.set("messageRead", callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on("typing", callback);
      this.listeners.set("typing", callback);
    }
  }

  onError(callback) {
    if (this.socket) {
      this.socket.on("error", callback);
      this.listeners.set("error", callback);
    }
  }

  // Remove listeners
  off(event) {
    if (this.socket && this.listeners.has(event)) {
      this.socket.off(event, this.listeners.get(event));
      this.listeners.delete(event);
    }
  }

  removeAllListeners() {
    if (this.socket) {
      this.listeners.forEach((callback, event) => {
        this.socket.off(event, callback);
      });
      this.listeners.clear();
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }
}

export default new SocketService();
