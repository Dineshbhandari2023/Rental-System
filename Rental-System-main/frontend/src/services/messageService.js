import api from "./api";

const messageService = {
  // Get conversation with a specific user
  getConversation: async (userId, bookingId = null) => {
    const params = bookingId ? { bookingId } : {};
    const response = await api.get(`/messages/conversation/${userId}`, {
      params,
    });
    return response.data;
  },

  // Get unread message count
  getUnreadCount: async () => {
    const response = await api.get("/messages/unread");
    return response.data;
  },

  // Get all conversations
  getAllConversations: async () => {
    const response = await api.get("/messages/conversations");
    return response.data;
  },
};

export default messageService;
