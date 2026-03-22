import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2, User as UserIcon } from "lucide-react";
import socketService from "../../services/socketService";
import messageService from "../../services/messageService";
import authService from "../../services/authService";
import { toast } from "sonner";

export default function MessagingComponent({
  recipientId,
  recipientName,
  recipientAvatar,
  bookingId = null,
}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUser = authService.getCurrentUser();

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Load conversation
  useEffect(() => {
    loadConversation();
  }, [recipientId, bookingId]);

  const loadConversation = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversation(
        recipientId,
        bookingId
      );
      setMessages(response.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error("Load conversation error:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  // Socket listeners
  useEffect(() => {
    const token = authService.getToken();
    if (!token) return;

    // Connect socket
    socketService.connect(token);

    // Listen for new messages
    socketService.onNewMessage((message) => {
      if (
        (message.senderId._id === recipientId &&
          message.receiverId._id === currentUser.id) ||
        (message.senderId._id === currentUser.id &&
          message.receiverId._id === recipientId)
      ) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();

        // Mark as read if from recipient
        if (message.senderId._id === recipientId) {
          socketService.markAsRead(message._id);
        }
      }
    });

    // Listen for message sent confirmation
    socketService.onMessageSent((message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicator
    socketService.onTyping(({ from, isTyping }) => {
      if (from === recipientId) {
        setIsTyping(isTyping);
      }
    });

    // Listen for errors
    socketService.onError((error) => {
      toast.error(error.message || "Message error");
    });

    return () => {
      socketService.off("newMessage");
      socketService.off("messageSent");
      socketService.off("typing");
      socketService.off("error");
    };
  }, [recipientId, currentUser.id]);

  // Auto-scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      socketService.sendMessage(recipientId, newMessage.trim(), bookingId);
      setNewMessage("");

      // Stop typing indicator
      socketService.sendTyping(recipientId, false);
    } catch (error) {
      console.error("Send message error:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  // Handle typing
  const handleTyping = (value) => {
    setNewMessage(value);

    // Send typing indicator
    socketService.sendTyping(recipientId, true);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(recipientId, false);
    }, 2000);
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-gray-50">
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
          {recipientAvatar ? (
            <img
              src={recipientAvatar}
              alt={recipientName}
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{recipientName}</h3>
          {isTyping && <p className="text-xs text-blue-600">typing...</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwn = msg.senderId._id === currentUser.id;
            return (
              <div
                key={msg._id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    isOwn
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm break-words">{msg.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwn ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => handleTyping(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={sending}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
