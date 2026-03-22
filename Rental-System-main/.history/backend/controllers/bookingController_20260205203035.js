const Booking = require("../models/booking");
const Item = require("../models/item");
const User = require("../models/user");

exports.createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate } = req.body;

    const item = await Item.findById(itemId).populate("ownerId");

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }

    if (!item.isAvailable) {
      return res.status(400).json({
        success: false,
        message: "Item is not available for booking",
      });
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (sDate >= eDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Calculate days
    const totalDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24));

    // Check for overlapping bookings
    const overlapping = await Booking.findOne({
      itemId,
      status: { $in: ["pending", "confirmed", "ongoing"] },
      $or: [{ startDate: { $lte: eDate }, endDate: { $gte: sDate } }],
    });

    if (overlapping) {
      return res.status(400).json({
        success: false,
        message: "Item is not available for the selected dates",
      });
    }

    // Check availability periods
    const available = item.availability.some(
      (period) =>
        new Date(period.startDate) <= eDate && new Date(period.endDate) >= sDate
    );

    if (!available) {
      return res.status(400).json({
        success: false,
        message: "Item not available in selected period",
      });
    }

    const totalAmount = totalDays * item.dailyPrice;

    const booking = await Booking.create({
      itemId,
      borrowerId: req.user._id,
      lenderId: item.ownerId._id,
      startDate: sDate,
      endDate: eDate,
      totalDays,
      totalAmount,
      depositAmount: item.depositAmount,
    });

    // TODO: Integrate payment here (e.g., create payment intent)

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { borrowerId: req.user._id };

    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("itemId", "title images dailyPrice")
      .populate("lenderId", "firstName lastName");

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      bookings,
    });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("itemId", "title images dailyPrice depositAmount")
      .populate("lenderId", "firstName lastName phone")
      .populate("borrowerId", "firstName lastName phone");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check authorization
    if (
      booking.borrowerId._id.toString() !== req.user._id.toString() &&
      booking.lenderId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Get booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body; // e.g., "confirmed", "completed"

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.lenderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this booking",
      });
    }

    // Validate status transition (basic)
    const validTransitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["ongoing", "cancelled"],
      ongoing: ["completed", "disputed"],
    };

    if (
      !validTransitions[booking.status] ||
      !validTransitions[booking.status].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status transition",
      });
    }

    booking.status = status;

    if (status === "confirmed") {
      // TODO: Confirm payment
      booking.paymentStatus = "paid";
    } else if (status === "completed") {
      // TODO: Release deposit if no issues
      booking.paymentStatus = "deposit_refunded";
    }

    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking",
    });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to cancel this booking",
      });
    }

    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel booking in current status",
      });
    }

    booking.status = "cancelled";
    booking.cancellationReason = cancellationReason;
    booking.cancelledAt = new Date();
    // TODO: Handle refund

    await booking.save();

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
};

exports.getLenderBookingRequests = async (req, res) => {
  try {
    const { status = "pending", page = 1, limit = 20 } = req.query;

    const query = {
      lenderId: req.user._id,
      status,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .populate("itemId", "title images dailyPrice depositAmount")
      .populate("borrowerId", "firstName lastName phone");

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      bookings,
    });
  } catch (error) {
    console.error("Get lender requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch booking requests",
    });
  }
};

exports.getLenderBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    // Base query: bookings where user is the lender
    let query = { lenderId: req.user._id };

    // Optional: filter by one or more statuses (e.g., ?status=confirmed,ongoing)
    if (status) {
      const statuses = status.split(",").map((s) => s.trim());
      query.status = { $in: statuses };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ startDate: -1 }) // Most upcoming/recent first
      .populate("itemId", "title images dailyPrice depositAmount")
      .populate("borrowerId", "firstName lastName phone");

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      bookings,
    });
  } catch (error) {
    console.error("Get lender bookings error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your rentals",
    });
  }
};
