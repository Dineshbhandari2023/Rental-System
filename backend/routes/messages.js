const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getConversation,
  getUnreadCount,
  getAllConversations,
} = require("../controllers/messageController");

router.get("/conversation/:userId", protect, getConversation);
router.get("/unread", protect, getUnreadCount);
router.get("/conversations", protect, getAllConversations);

module.exports = router;
