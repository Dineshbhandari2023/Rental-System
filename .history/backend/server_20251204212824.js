// backend/server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Define a simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Rental system backend!" });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
