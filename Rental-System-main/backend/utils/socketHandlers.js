const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Message = require("../models/message");

module.exports = (io) => {
  // Socket authentication middleware
  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user || !user.isActive) {
        return next(new Error("Authentication error: Invalid user"));
      }
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user._id}`);

    // Join personal room for direct messaging
    socket.join(socket.user._id.toString());

    // Send message event
    socket.on("sendMessage", async (data) => {
      const { to, message, bookingId } = data;

      if (!to || !message) {
        return socket.emit("error", { message: "Invalid message data" });
      }

      try {
        const newMessage = await Message.create({
          senderId: socket.user._id,
          receiverId: to,
          bookingId: bookingId || null,
          message,
        });

        // Populate for emission
        const populatedMessage = await Message.findById(newMessage._id)
          .populate("senderId", "firstName lastName profilePicture")
          .populate("receiverId", "firstName lastName profilePicture");

        // Emit to receiver's room
        io.to(to.toString()).emit("newMessage", populatedMessage);

        // Confirm to sender
        socket.emit("messageSent", populatedMessage);
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", { message: "Error sending message" });
      }
    });

    // Mark message as read
    socket.on("readMessage", async (messageId) => {
      try {
        const msg = await Message.findById(messageId);
        if (
          msg &&
          msg.receiverId.toString() === socket.user._id.toString() &&
          !msg.isRead
        ) {
          msg.isRead = true;
          msg.readAt = Date.now();
          await msg.save();

          // Emit to sender
          io.to(msg.senderId.toString()).emit("messageRead", {
            messageId: msg._id,
            readAt: msg.readAt,
          });
        }
      } catch (error) {
        console.error("Read message error:", error);
      }
    });

    // Typing indicator
    socket.on("typing", (data) => {
      const { to, isTyping } = data;
      if (to) {
        io.to(to.toString()).emit("typing", {
          from: socket.user._id,
          isTyping,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user._id}`);
    });
  });
};
