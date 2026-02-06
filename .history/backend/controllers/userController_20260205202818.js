const User = require("../models/user");
const Booking = require("../models/booking");
const Item = require("../models/item");
const Review = require("../models/review");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate({
      path: "adminInfo",
      select: "permissions lastLogin",
    });

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching profile",
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    let updates = {};

    if (req.body.firstName) updates.firstName = req.body.firstName;
    if (req.body.lastName) updates.lastName = req.body.lastName;
    if (req.body.phone) updates.phone = req.body.phone;

    // ─── Handle address ────────────────────────
    if (req.body.address) {
      try {
        updates.address = JSON.parse(req.body.address);
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "Invalid address format",
        });
      }
    }

    // Handle file upload (must have multer middleware)
    if (req.file) {
      updates.profilePicture = `/uploads/profile-images/${req.file.filename}`;
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "No fields provided" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      error: "Error updating profile",
      // dev only:   message: err.message
    });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select(
        "firstName lastName profilePicture rating totalRatings role isVerified createdAt"
      )
      .where({ isActive: true });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Get user's recent reviews
    const reviews = await Review.find({ revieweeId: req.params.id })
      .populate("reviewerId", "firstName lastName profilePicture")
      .limit(5)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        reviews,
      },
    });
  } catch (error) {
    console.error("Get public profile error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching public profile",
    });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const { type = "all", status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (type === "borrower") {
      query.borrowerId = req.user.id;
    } else if (type === "lender") {
      query.lenderId = req.user.id;
    } else {
      query.$or = [{ borrowerId: req.user.id }, { lenderId: req.user.id }];
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("itemId", "title images dailyPrice")
      .populate("borrowerId", "firstName lastName profilePicture")
      .populate("lenderId", "firstName lastName profilePicture")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      bookings,
    });
  } catch (error) {
    console.error("Get user bookings error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching bookings",
    });
  }
};

exports.getUserItems = async (req, res) => {
  try {
    const { isAvailable, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = { ownerId: req.user.id };

    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === "true";
    }

    const items = await Item.find(query)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Item.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      items,
    });
  } catch (error) {
    console.error("Get user items error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching items",
    });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const { type = "received", page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (type === "received") {
      query.revieweeId = req.user.id;
      query.type = "user_to_user";
    } else if (type === "given") {
      query.reviewerId = req.user.id;
    }

    const reviews = await Review.find(query)
      .populate("reviewerId", "firstName lastName profilePicture")
      .populate("revieweeId", "firstName lastName profilePicture")
      .populate("itemId", "title images")
      .populate("bookingId", "startDate endDate")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching reviews",
    });
  }
};
