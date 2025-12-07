const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
require("dotenv").config();

// Database connection
const connectDB = require("./config/db");

// Import models
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
        : ["http://localhost:3000"],
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

// Basic route
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

// API Routes
app;
