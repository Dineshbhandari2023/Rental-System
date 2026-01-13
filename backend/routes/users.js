const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

// Public routes
router.get("/:id/public", userController.getPublicProfile);

// Protected routes
router.use(protect);

router.get("/profile", userController.getProfile);
router.put(
  "/profile",
  upload.single("profilePicture"),
  userController.updateProfile
);
router.get("/bookings", userController.getUserBookings);
router.get("/items", userController.getUserItems);
router.get("/reviews", userController.getUserReviews);

module.exports = router;
