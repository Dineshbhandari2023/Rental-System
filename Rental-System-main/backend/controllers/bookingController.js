const Booking = require("../models/booking");
const Item = require("../models/item");
const User = require("../models/user");
const axios = require("axios");
const Payment = require("../models/payment");

const PAYMENT_CONFIG = {
  KHALTI_SECRET_KEY: '470361cd4cd147498123c353d461bd53', 
  KHALTI_PUBLIC_KEY: 'live_public_key_546eb6da05544d7d88961db04fdb9721', 
  KHALTI_PAYMENT_URL: 'https://a.khalti.com/api/v2/epayment/initiate/',
  KHALTI_VERIFICATION_URL: 'https://a.khalti.com/api/v2/epayment/lookup/',
  KHALTI_SUCCESS_URL: 'http://localhost:5173/borrower/khalti-verify',
  KHALTI_FAILURE_URL: 'http://localhost:5173/patient/order/failed',
  
  // App Configuration
  FRONTEND_URL: 'http://localhost:5173'
};

// Helper function for Khalti verification
const verifyKhaltiPayment = async (pidx) => {
  try {
    const response = await axios.post(
      PAYMENT_CONFIG.KHALTI_VERIFICATION_URL,
      { pidx },
      {
        headers: {
          'Authorization': `Key ${PAYMENT_CONFIG.KHALTI_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return {
      success: response.data.status === 'Completed',
      reference: pidx
    };
  } catch (error) {
    console.error('Khalti verification error:', error);
    return { success: false };
  }
};

// Verify payment callback
exports.verifyPayment = async (req, res) => {
  try {
    const { pidx } = req.body;

    const booking = await Booking.findOne({ paymentId: pidx });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    const response = await axios.post(
      PAYMENT_CONFIG.KHALTI_VERIFICATION_URL,
      { pidx },
      {
        headers: {
          Authorization: `Key ${PAYMENT_CONFIG.KHALTI_SECRET_KEY}`,
        },
      }
    );

    if (response.data.status === "Completed") {
      booking.paymentStatus = "paid";
      booking.status = "confirmed";
      await booking.save();

      await Payment.findOneAndUpdate(
        { gatewayTransactionId: pidx },
        { status: "success" }
      );

      return res.json({
        success: true,
        message: "Payment successful",
      });
    }

    booking.paymentStatus = "failed";
    await booking.save();

    return res.status(400).json({
      success: false,
      message: "Payment failed",
    });

  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};


// Khalti payment initiation - USING HARDCODED CONFIG
const initiateKhaltiPayment = async (order, amount, customerPhone) => {
  const productId = `ORD-${order.orderId}-${Date.now()}`;
  
  const paymentData = {
    return_url: PAYMENT_CONFIG.KHALTI_SUCCESS_URL,
    website_url: PAYMENT_CONFIG.FRONTEND_URL,
    amount: amount * 100, // Convert to paisa
    purchase_order_id: productId,
    purchase_order_name: `Medicine Order #${order.orderId}`,
    customer_info: {
      name: order.patientId.toString(),
      email: `user${order.patientId}@example.com`,
      phone: customerPhone
    }
  };

  console.log('Khalti Payment Data:', paymentData);

  const response = await axios.post(
    PAYMENT_CONFIG.KHALTI_PAYMENT_URL,
    paymentData,
    {
      headers: {
        'Authorization': `Key ${PAYMENT_CONFIG.KHALTI_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );

  console.log('Khalti payment URL received:', response.data.payment_url);
  return { url: response.data.payment_url };
};


exports.createBooking = async (req, res) => {
  try {
    const { itemId, startDate, endDate, paymentMethod, customerPhone } = req.body;

    const item = await Item.findById(itemId).populate("ownerId");

    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (!item.isAvailable) {
      return res.status(400).json({ success: false, message: "Item not available" });
    }

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    if (sDate >= eDate) {
      return res.status(400).json({ success: false, message: "Invalid dates" });
    }

    const totalDays = Math.ceil((eDate - sDate) / (1000 * 60 * 60 * 24));

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
      paymentStatus: "pending",
    });

    // ============================
    // KHALTI PAYMENT
    // ============================
    if (paymentMethod === "khalti") {
      const khaltiResponse = await axios.post(
        PAYMENT_CONFIG.KHALTI_PAYMENT_URL,
        {
          return_url: PAYMENT_CONFIG.KHALTI_SUCCESS_URL,
          website_url: PAYMENT_CONFIG.FRONTEND_URL,
          amount: totalAmount * 100, // paisa
          purchase_order_id: booking._id.toString(),
          purchase_order_name: `Booking ${booking._id}`,
          customer_info: {
            name: req.user._id.toString(),
            email: `user${req.user._id}@test.com`,
            phone: customerPhone,
          },
        },
        {
          headers: {
            Authorization: `Key ${PAYMENT_CONFIG.KHALTI_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { payment_url, pidx } = khaltiResponse.data;

      // Save payment record
      await Payment.create({
        userId: req.user._id,
        bookingId: booking._id,
        amount: totalAmount,
        type: "rental",
        gateway: "khalti",
        gatewayTransactionId: pidx,
        status: "pending",
      });

      // Save pidx in booking
      booking.paymentId = pidx;
      await booking.save();

      return res.status(200).json({
        success: true,
        bookingId: booking._id,
        payment_url,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid payment method",
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
