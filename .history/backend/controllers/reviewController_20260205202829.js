const mongoose = require("mongoose");
const Review = require("../models/review");
const Booking = require("../models/booking");
const User = require("../models/user");

exports.createReview = async (req, res) => {
  try {
    const { bookingId, type, rating, comment } = req.body;

    // 1. Basic field validation
    // if (!bookingId || !type || !rating || !comment) {
    if (!type || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "bookingId, type, rating, and comment are required",
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

    // 2. Find booking – EARLY
    const booking = await Booking.findById(bookingId);

    // 3. Must exist
    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // 4. Only the actual borrower of THIS booking can review it
    if (booking.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "Only the borrower can submit a review for this booking",
      });
    }

    // 5. Booking must be completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "You can only review completed bookings",
      });
    }

    // 6. Prevent duplicate reviews of same type for same booking
    const existingReview = await Review.findOne({
      bookingId: booking._id,
      reviewerId: req.user._id,
      type,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: `You have already submitted a ${type} review for this booking`,
      });
    }

    // 7. Prepare review data
    const reviewData = {
      reviewerId: req.user._id,
      bookingId: booking._id,
      rating,
      comment: comment.trim(),
      type,
      isVerifiedPurchase: true,
    };

    if (type === "user_to_user") {
      reviewData.revieweeId = booking.lenderId;
    }

    // if (type === "user_to_item") {
    //   reviewData.itemId = booking.itemId;
    // }
    if (type === "user_to_item") {
      reviewData.itemId = booking?.itemId || req.body.itemId;

      if (!reviewData.itemId) {
        return res.status(400).json({
          success: false,
          error: "itemId is required when no bookingId is provided",
        });
      }
    }

    // 8. Create
    const review = await Review.create(reviewData);

    // 9. Update lender rating if applicable
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

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while creating review",
      // dev only → remove in production
      // details: error.message,
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
