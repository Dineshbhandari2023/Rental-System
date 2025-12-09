const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const createAdmin = require("./config/createAdmin");

require("dotenv").config();

// Database connection
const connectDB = require("./config/db");

// Import models (this loads them into mongoose)
require("./models/user");
require("./models/item");
require("./models/booking");
require("./models/review");
require("./models/message");
require("./models/payment");
require("./models/dispute");
require("./models/admin");

// Import routes
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");

const app = express();

// Middleware
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://your-frontend-domain.com"]
        : ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Community Rental Exchange System API",
    version: "1.0.0",
    documentation: "/api-docs (coming soon)",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      users: "/api/users",
    },
  });
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    service: "Community Rental Exchange API",
  });
});

// Database connection test route
app.get("/api/test-db", async (req, res) => {
  try {
    const mongoose = require("mongoose");
    const dbState = mongoose.connection.readyState;

    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    res.json({
      database: states[dbState],
      timestamp: new Date().toISOString(),
      models: Object.keys(mongoose.models),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

// 404 handler - FIXED: Using app.all() instead of app.use() with wildcard
app.all("", (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Database connection and server start
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    await createAdmin();

    const PORT = process.env.PORT || 5000;

    const server = app.listen(PORT, () => {
      console.log(`✅ Server started successfully!`);
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log(`📊 Database: ${process.env.MONGODB_URI}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
    });

    // Handle server errors
    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${PORT} is already in use`);
        process.exit(1);
      } else {
        console.error("❌ Server error:", error);
      }
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Server closed.");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    console.error("Error details:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  console.error(err.stack);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  console.error(err.stack);
  process.exit(1);
});

// Start the server
startServer();
