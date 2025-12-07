// // backend/server.js
// require("dotenv").config();
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");

// const app = express();
// const port = process.env.PORT || 8000;

// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => console.log("MongoDB connected successfully"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Define a simple route
// app.get("/", (req, res) => {
//   res.json({ message: "Welcome to the Rental system backend!" });
// });

// app.listen(port, () => {
//   console.log(`Server is running on port: ${port}`);
// });

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Database connection
const connectDB = require("./config/database");

// Import models (optional, but ensures they're loaded)
require("./models/User");
require("./models/Item");
require("./models/Booking");
require("./models/Review");
require("./models/Message");
require("./models/Payment");
require("./models/Dispute");
require("./models/Admin");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Community Rental Exchange System API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      items: "/api/items",
      bookings: "/api/bookings",
      // Add more endpoints as you create them
    },
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Database: ${process.env.MONGODB_URI}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
});

startServer();
