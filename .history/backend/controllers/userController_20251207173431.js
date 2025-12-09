const User = require("../models/user");
const Booking = require("../models/booking");
const Item = require("../models/item");
const Review = require("../models/review");

// @desc    Get user profile (private)
// @route   GET /api/users/profile
// @access  Private
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      address: req.body.address,
      profilePicture: req.body.profilePicture,
    };

    // Remove undefined fields
    Object.keys(updates).forEach(
      (key) => updates[key] === undefined && delete updates[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating profile",
    });
  }
};

// @desc    Get public user profile
// @route   GET /api/users/:id/public
// @access  Public
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

// @desc    Get user's bookings
// @route   GET /api/users/bookings
// @access  Private
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

// @desc    Get user's items
// @route   GET /api/users/items
// @access  Private
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

// @desc    Get user's reviews
// @route   GET /api/users/reviews
// @access  Private
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

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Private
// exports.logoutUser = async (req, res) => {
//   try {
//     // For JWT: usually logout = delete token on client or remove cookie
//     res.status(200).json({
//       success: true,
//       message: "Logged out successfully"
//     });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Error during logout"
//     });
//   }
// };
