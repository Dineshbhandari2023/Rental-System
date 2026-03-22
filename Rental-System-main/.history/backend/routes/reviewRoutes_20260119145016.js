const express = require("express");
const router = express.Router();
const {
  createReview,
  getItemReviews,
  getUserReviews,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");

// ─── Public routes ────────────────────────────────────────
router.get("/item/:itemId", getItemReviews);
router.get("/user/:userId", getUserReviews);

// ─── Protected routes ─────────────────────────────────────
router.use(protect); // all routes below require authentication

router.post("/", createReview);

module.exports = router;
