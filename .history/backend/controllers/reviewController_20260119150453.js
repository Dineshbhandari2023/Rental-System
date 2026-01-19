const mongoose = require("mongoose");
const Review = require("../models/review");
const Booking = require("../models/booking");
const User = require("../models/user");

/**
 * @desc    Create a review (for lender or for item) after booking completion
 * @route   POST /api/reviews
 * @access  Private (borrower only)
 */
exports.createReview = async (req, res) => {
  try {
    const { bookingId, type, rating, comment } = req.body;

    // Validate input
    // if (!bookingId || !type || !rating || !comment) {
    //   return res.status(400).json({
    //     success: false,
    //     error: "bookingId, type, rating, and comment are required",
    //   });
    // }
    if (!type || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "type, rating, and comment are required",
      });
    }

    if (!["user_to_user", "user_to_item"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be 'user_to_user' (lender) or 'user_to_item'",
      });
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be an integer between 1 and 5",
      });
    }

    // Find booking
    // const booking = await Booking.findById(bookingId);

    // if (!booking) {
    //   return res.status(404).json({
    //     success: false,
    //     error: "Booking not found",
    //   });
    // }
    let booking = null;
    if (type === "user_to_user" || bookingId) {
      if (!bookingId) {
        return res.status(400).json({
          success: false,
          error: "bookingId is required when reviewing the lender",
        });
      }

      booking = await Booking.findById(bookingId);
      if (!booking) {
        return res
          .status(404)
          .json({ success: false, error: "Booking not found" });
      }

      // Only borrower can review
      if (booking.borrowerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          error: "Only the borrower can submit a review for this booking",
        });
      }

      // Must be completed (you can also relax this for testing)
      if (booking.status !== "completed") {
        return res.status(400).json({
          success: false,
          error: "You can only review completed bookings",
        });
      }
    }

    // Only the borrower can review
    if (booking.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the borrower can submit a review for this booking",
      });
    }

    // Booking must be completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "You can only review completed bookings",
      });
    }

    // Prevent duplicate reviews of the same type for the same booking
    const existingReview = await Review.findOne({
      bookingId: booking?._id || null,
      reviewerId: req.user._id,
      type,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: `You have already submitted a ${type} review for this booking`,
      });
    }

    // Build review document
    const reviewData = {
      reviewerId: req.user._id,
      bookingId: booking?._id || null,
      rating,
      comment: comment.trim(),
      type,
      isVerifiedPurchase: true,
    };

    if (type === "user_to_user") {
      reviewData.revieweeId = booking.lenderId;
    }

    if (type === "user_to_item") {
      reviewData.itemId = booking.itemId;
    }

    const review = await Review.create(reviewData);

    // Update lender's rating (if reviewing the user/lender)
    if (type === "user_to_user") {
      const lender = await User.findById(booking.lenderId);

      if (lender) {
        const newCount = lender.totalRatings + 1;
        const newRating =
          (lender.rating * lender.totalRatings + rating) / newCount;

        lender.rating = Number(newRating.toFixed(2));
        lender.totalRatings = newCount;
        await lender.save();
      }
    }

    // (Optional) You could also update item rating here if you add rating fields to Item model

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while creating review",
    });
  }
};

/**
 * @desc    Get reviews for a specific item
 * @route   GET /api/reviews/item/:itemId
 * @access  Public
 */
exports.getItemReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({
      itemId: req.params.itemId,
      type: "user_to_item",
    })
      .populate("reviewerId", "firstName lastName profilePicture")
      .populate("bookingId", "startDate endDate")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments({
      itemId: req.params.itemId,
      type: "user_to_item",
    });

    // Calculate average rating
    const stats = await Review.aggregate([
      {
        $match: {
          itemId: new mongoose.Types.ObjectId(req.params.itemId),
          type: "user_to_item",
        },
      },
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]);

    const avgRating =
      stats.length > 0 ? Number(stats[0].avgRating.toFixed(1)) : 0;
    const count = stats.length > 0 ? stats[0].count : 0;

    res.status(200).json({
      success: true,
      averageRating: avgRating,
      totalReviews: count,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
      reviews,
    });
  } catch (error) {
    console.error("Get item reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching item reviews",
    });
  }
};

/**
 * @desc    Get reviews received by a user (lender)
 * @route   GET /api/reviews/user/:userId
 * @access  Public
 */
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const reviews = await Review.find({
      revieweeId: req.params.userId,
      type: "user_to_user",
    })
      .populate("reviewerId", "firstName lastName profilePicture")
      .populate("itemId", "title images")
      .populate("bookingId", "startDate endDate")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await Review.countDocuments({
      revieweeId: req.params.userId,
      type: "user_to_user",
    });

    res.status(200).json({
      success: true,
      totalReviews: total,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
      reviews,
    });
  } catch (error) {
    console.error("Get user reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Server error while fetching user reviews",
    });
  }
};
