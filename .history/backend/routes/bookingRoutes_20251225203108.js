// routes/bookingRoutes.js
const express = require("express");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getLenderBookingRequests,
} = require("../controllers/bookingController");

const router = express.Router();

// Borrower routes (protected)
router.post("/", protect, authorize("borrower"), createBooking);

router.get("/my-bookings", protect, authorize("borrower"), getMyBookings);

router.get(
  "/:id",
  protect,
  authorize("borrower", "lender"), // Both can view, but lender only for their items
  getBookingById
);

router.put(
  "/:id/status",
  protect,
  authorize("lender"), // Lender updates status (confirm, complete, etc.)
  updateBookingStatus
);

router.put(
  "/:id/cancel",
  protect,
  authorize("borrower"), // Borrower can cancel
  cancelBooking
);

router.get(
  "/lender/requests",
  protect,
  authorize("lender"),
  getLenderBookingRequests
);

router.get(
  "/lender/my-rentals",
  protect,
  authorize("lender"),
  getLenderBookings // ← New route
);

module.exports = router;
