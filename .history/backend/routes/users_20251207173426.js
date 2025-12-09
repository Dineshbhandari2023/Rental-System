const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/auth");

// Public routes
router.get("/:id/public", userController.getPublicProfile);

// Protected routes
router.use(protect);

router.get("/profile", userController.getProfile);
router.put("/profile", userController.updateProfile);
router.get("/bookings", userController.getUserBookings);
router.get("/items", userController.getUserItems);
router.get("/reviews", userController.getUserReviews);
// router.get("/logout", userController.logoutUser);

module.exports = router;
