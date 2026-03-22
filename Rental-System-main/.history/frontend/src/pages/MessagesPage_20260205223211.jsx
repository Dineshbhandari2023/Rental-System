// MessagesPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle, Loader2, Search, ChevronLeft } from "lucide-react";
import MessagingComponent from "../components/messaging/MessagingComponent";
import messageService from "../services/messageService";
import authService from "../services/authService";
import socketService from "../services/socketService";
import { toast } from "sonner";

export default function MessagesPage() {
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileList, setShowMobileList] = useState(true);

  // Get pre-selected conversation from URL (e.g. from notification or item page)
  const userIdFromUrl = searchParams.get("userId");
  const userNameFromUrl = searchParams.get("userName");
  const bookingIdFromUrl = searchParams.get("bookingId");

  useEffect(() => {
    if (userIdFromUrl) {
      setSelectedConversation({
        userId: userIdFromUrl,
        userName: userNameFromUrl || "User",
        bookingId: bookingIdFromUrl,
        userAvatar: null, // can be fetched later if needed
      });
      // On mobile → hide list once conversation is opened
      if (window.innerWidth < 1024) {
        setShowMobileList(false);
      }
    }
  }, [userIdFromUrl, userNameFromUrl, bookingIdFromUrl]);

  useEffect(() => {
    loadConversations();

    socketService.onNewMessage(() => loadConversations());
    socketService.onMessageSent(() => loadConversations());

    return () => {
      socketService.off("newMessage");
      socketService.off("messageSent");
    };
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getAllConversations();
      setConversations(response.conversations || []);
    } catch (error) {
      if (error.response?.status !== 404) {
        toast.error("Failed to load conversations");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.userName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv);
    // On mobile → hide list after selection
    if (window.innerWidth < 1024) {
      setShowMobileList(false);
    }
  };

  const getAvatarPlaceholder = (name) => name?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Mobile Header with back button */}
        {!showMobileList && (
          <button
            onClick={() => setShowMobileList(true)}
            className="lg:hidden mb-6 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to Conversations
          </button>
        )}

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            Messages
          </h1>
          <div className="text-amber-400/80 text-sm hidden lg:block">
            {conversations.length} active{" "}
            {conversations.length === 1 ? "conversation" : "conversations"}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 h-[calc(100vh-140px)] lg:h-[calc(100vh-180px)]">
          {/* Conversations Sidebar */}
          <div
            className={`
              lg:col-span-4 xl:col-span-3 
              bg-gradient-to-b from-gray-900 to-gray-950 
              border border-amber-900/40 rounded-2xl shadow-2xl shadow-black/40 
              overflow-hidden flex flex-col
              ${showMobileList ? "block" : "hidden lg:block"}
            `}
          >
            {/* Search */}
            <div className="p-5 border-b border-amber-900/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/70" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search people..."
                  className="w-full pl-11 pr-4 py-3 bg-gray-800/60 border border-amber-900/50 rounded-xl text-amber-100 placeholder-amber-500/70 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="text-center py-16 text-amber-400/60">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No conversations yet</p>
                  <p className="text-sm mt-2">
                    Start a chat from an item or booking
                  </p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const isSelected =
                    selectedConversation?.userId === conv.userId;
                  return (
                    <button
                      key={conv.userId}
                      onClick={() => handleSelectConversation(conv)}
                      className={`
                        w-full text-left p-4 rounded-xl transition-all duration-200 flex items-center gap-4
                        ${
                          isSelected
                            ? "bg-amber-900/30 border border-amber-700/50 shadow-sm"
                            : "hover:bg-amber-950/30 border border-transparent"
                        }
                      `}
                    >
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-800 to-amber-950 flex items-center justify-center overflow-hidden border-2 border-amber-800/50 shadow-inner">
                          {conv.userAvatar ? (
                            <img
                              src={conv.userAvatar}
                              alt={conv.userName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-xl font-serif font-bold text-amber-200">
                              {getAvatarPlaceholder(conv.userName)}
                            </span>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full min-w-[18px] h-5 px-1.5 flex items-center justify-center ring-2 ring-red-900/70">
                            {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-amber-100 truncate">
                          {conv.userName}
                        </p>
                        <p className="text-sm text-amber-400/80 truncate mt-0.5">
                          {conv.lastMessage || "Start a conversation..."}
                        </p>
                      </div>

                      {/* Time / Indicator */}
                      {conv.lastMessageTime && (
                        <span className="text-xs text-amber-500/70 whitespace-nowrap">
                          {new Date(conv.lastMessageTime).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div
            className={`lg:col-span-8 xl:col-span-9 ${
              showMobileList ? "hidden lg:block" : "block"
            }`}
          >
            {selectedConversation ? (
              <div className="h-full bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden flex flex-col">
                <MessagingComponent
                  key={selectedConversation.userId}
                  recipientId={selectedConversation.userId}
                  recipientName={selectedConversation.userName}
                  recipientAvatar={selectedConversation.userAvatar}
                  bookingId={selectedConversation.bookingId}
                />
              </div>
            ) : (
              <div className="h-full bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl shadow-2xl shadow-black/40 flex items-center justify-center">
                <div className="text-center px-6 py-12">
                  <MessageCircle className="h-16 w-16 mx-auto mb-6 text-amber-700/60" />
                  <h3 className="text-2xl font-serif font-semibold text-amber-200 mb-3">
                    Your Messages
                  </h3>
                  <p className="text-amber-300/80 max-w-md mx-auto">
                    Select a conversation from the list or start a new chat from
                    an item or booking.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
