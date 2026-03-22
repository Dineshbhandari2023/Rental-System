const Message = require("../models/message");

// @desc    Get conversation history between current user and another user
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { bookingId } = req.query; // Optional: filter by bookingId

    let query = {
      $or: [
        { senderId: req.user._id, receiverId: userId },
        { senderId: userId, receiverId: req.user._id },
      ],
    };

    if (bookingId) {
      query.bookingId = bookingId;
    }

    const messages = await Message.find(query)
      .sort("createdAt")
      .populate("senderId", "firstName lastName profilePicture")
      .populate("receiverId", "firstName lastName profilePicture");

    // Mark all unread messages as read for the current user
    await Message.updateMany(
      { receiverId: req.user._id, senderId: userId, isRead: false },
      { isRead: true, readAt: Date.now() }
    );

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Get conversation error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching conversation",
    });
  }
};

// @desc    Get unread message count for current user
// @route   GET /api/messages/unread
// @access  Private
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiverId: req.user._id,
      isRead: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching unread count",
    });
  }
};

// @desc    Get all conversations for current user
// @route   GET /api/messages/conversations
// @access  Private
exports.getAllConversations = async (req, res) => {
  try {
    // Get all unique conversations
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", req.user._id] },
              "$receiverId",
              "$senderId",
            ],
          },
          lastMessage: { $first: "$message" },
          lastMessageDate: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$receiverId", req.user._id] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          userId: "$_id",
          userName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
          userAvatar: "$user.profilePicture",
          lastMessage: 1,
          lastMessageDate: 1,
          unreadCount: 1,
        },
      },
      {
        $sort: { lastMessageDate: -1 },
      },
    ]);

    res.status(200).json({
      success: true,
      conversations: messages,
    });
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching conversations",
    });
  }
};
