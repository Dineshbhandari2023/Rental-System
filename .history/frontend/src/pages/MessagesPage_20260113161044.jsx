// import React, { useState, useEffect } from "react";
// import { useSearchParams } from "react-router-dom";
// import { MessageCircle, Loader2, Search } from "lucide-react";
// import MessagingComponent from "../components/messaging/MessagingComponent";
// import messageService from "../services/messageService";
// import authService from "../services/authService";
// import { toast } from "sonner";

// export default function MessagesPage() {
//   const [searchParams] = useSearchParams();
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Get userId from URL if provided
//   const userIdFromUrl = searchParams.get("userId");
//   const userNameFromUrl = searchParams.get("userName");
//   const bookingIdFromUrl = searchParams.get("bookingId");

//   useEffect(() => {
//     // If URL has userId, open that conversation directly
//     if (userIdFromUrl) {
//       setSelectedConversation({
//         userId: userIdFromUrl,
//         userName: userNameFromUrl || "User",
//         bookingId: bookingIdFromUrl,
//       });
//     }
//   }, [userIdFromUrl, userNameFromUrl, bookingIdFromUrl]);

//   // Load conversations (you'll need to create this endpoint in backend)
//   useEffect(() => {
//     loadConversations();
//   }, []);

//   const loadConversations = async () => {
//     try {
//       setLoading(true);
//       // This would require a new backend endpoint to get all conversations
//       // For now, we'll use a placeholder
//       setConversations([]);
//     } catch (error) {
//       console.error("Load conversations error:", error);
//       toast.error("Failed to load conversations");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredConversations = conversations.filter((conv) =>
//     conv.userName?.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       <div className="flex items-center gap-3 mb-6">
//         <MessageCircle className="h-8 w-8 text-blue-600" />
//         <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         {/* Conversations List */}
//         <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4">
//           <div className="mb-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder="Search conversations..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
//               />
//             </div>
//           </div>

//           <div className="space-y-2">
//             {loading ? (
//               <div className="flex justify-center py-8">
//                 <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
//               </div>
//             ) : filteredConversations.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
//                 <p>No conversations yet</p>
//               </div>
//             ) : (
//               filteredConversations.map((conv) => (
//                 <button
//                   key={conv.userId}
//                   onClick={() => setSelectedConversation(conv)}
//                   className={`w-full text-left p-3 rounded-lg transition ${
//                     selectedConversation?.userId === conv.userId
//                       ? "bg-blue-50 border-blue-200"
//                       : "hover:bg-gray-50"
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//                       {conv.userAvatar ? (
//                         <img
//                           src={conv.userAvatar}
//                           alt={conv.userName}
//                           className="h-full w-full rounded-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-blue-600 font-semibold">
//                           {conv.userName?.charAt(0).toUpperCase()}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="font-semibold text-gray-900 truncate">
//                         {conv.userName}
//                       </p>
//                       <p className="text-sm text-gray-500 truncate">
//                         {conv.lastMessage}
//                       </p>
//                     </div>
//                     {conv.unreadCount > 0 && (
//                       <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
//                         {conv.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               ))
//             )}
//           </div>
//         </div>

//         {/* Chat Area */}
//         <div className="lg:col-span-2">
//           {selectedConversation ? (
//             <MessagingComponent
//               recipientId={selectedConversation.userId}
//               recipientName={selectedConversation.userName}
//               recipientAvatar={selectedConversation.userAvatar}
//               bookingId={selectedConversation.bookingId}
//             />
//           ) : (
//             <div className="bg-white rounded-lg shadow-lg h-[600px] flex items-center justify-center">
//               <div className="text-center text-gray-500">
//                 <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//                 <p className="text-lg">
//                   Select a conversation to start messaging
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageCircle, Loader2, Search } from "lucide-react";
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

  // Get userId from URL if provided
  const userIdFromUrl = searchParams.get("userId");
  const userNameFromUrl = searchParams.get("userName");
  const bookingIdFromUrl = searchParams.get("bookingId");

  useEffect(() => {
    // If URL has userId, open that conversation directly
    if (userIdFromUrl) {
      setSelectedConversation({
        userId: userIdFromUrl,
        userName: userNameFromUrl || "User",
        bookingId: bookingIdFromUrl,
      });
    }
  }, [userIdFromUrl, userNameFromUrl, bookingIdFromUrl]);

  // Load conversations
  useEffect(() => {
    loadConversations();

    // Reload conversations when new message arrives
    socketService.onNewMessage((message) => {
      loadConversations();
    });

    // Reload when message is sent
    socketService.onMessageSent(() => {
      loadConversations();
    });

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
      console.error("Load conversations error:", error);
      // Don't show error toast if it's just empty conversations
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-4 h-[600px] flex flex-col">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No conversations yet</p>
                {selectedConversation && (
                  <p className="text-sm mt-2">Start chatting below!</p>
                )}
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <button
                  key={conv.userId}
                  onClick={() =>
                    setSelectedConversation({
                      userId: conv.userId,
                      userName: conv.userName,
                      userAvatar: conv.userAvatar,
                    })
                  }
                  className={`w-full text-left p-3 rounded-lg transition border ${
                    selectedConversation?.userId === conv.userId
                      ? "bg-blue-50 border-blue-200"
                      : "border-transparent hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {conv.userAvatar ? (
                        <img
                          src={conv.userAvatar}
                          alt={conv.userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-blue-600 font-semibold">
                          {conv.userName?.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">
                        {conv.userName}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <MessagingComponent
              key={selectedConversation.userId}
              recipientId={selectedConversation.userId}
              recipientName={selectedConversation.userName}
              recipientAvatar={selectedConversation.userAvatar}
              bookingId={selectedConversation.bookingId}
            />
          ) : (
            <div className="bg-white rounded-lg shadow-lg h-[600px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">
                  Select a conversation to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
