const Review = require("../models/review");
const Booking = require("../models/booking");
const User = require("../models/user");
const Item = require("../models/item");

// @desc    Create a review (item or lender) after booking completion
// @route   POST /api/reviews
// @access  Private (Borrower only)
exports.createReview = async (req, res) => {
  try {
    const { bookingId, type, rating, comment } = req.body;

    // Validate type
    if (!["user_to_user", "user_to_item"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Invalid review type. Must be 'user_to_user' or 'user_to_item'",
      });
    }

    // Validate required fields
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        error: "Booking ID, rating, and comment are required",
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: "Rating must be between 1 and 5",
      });
    }

    // Find the booking and populate necessary fields
    const booking = await Booking.findById(bookingId)
      .populate("itemId", "_id ownerId")
      .populate("lenderId", "_id");

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    // Ensure the reviewer is the borrower
    if (booking.borrowerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: "You are not authorized to review this booking",
      });
    }

    // Ensure booking is completed
    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        error: "Reviews can only be submitted after the booking is completed",
      });
    }

    // Check if a review of this type already exists for the booking
    const existingReview = await Review.findOne({
      bookingId,
      reviewerId: req.user._id,
      type,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error:
          "You have already submitted a review of this type for this booking",
      });
    }

    // Prepare review data
    const reviewData = {
      reviewerId: req.user._id,
      bookingId: booking._id,
      rating,
      comment,
      type,
      isVerifiedPurchase: true, // Since it's post-booking
    };

    if (type === "user_to_user") {
      reviewData.revieweeId = booking.lenderId._id;
    } else if (type === "user_to_item") {
      reviewData.itemId = booking.itemId._id;
    }

    // Create the review
    const review = await Review.create(reviewData);

    // If it's a user_to_user review, update the lender's average rating
    if (type === "user_to_user") {
      const lender = await User.findById(booking.lenderId._id);

      if (lender) {
        const newTotalRatings = lender.totalRatings + 1;
        lender.rating =
          (lender.rating * lender.totalRatings + rating) / newTotalRatings;
        lender.totalRatings = newTotalRatings;
        await lender.save();
      }
    }

    // Note: For user_to_item, we don't update Item rating since the Item model doesn't have rating fields.
    // If needed, add 'rating' and 'totalRatings' to Item schema similar to User, and update here analogously.

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating review",
    });
  }
};

// @desc    Get reviews for a specific item
// @route   GET /api/reviews/item/:itemId
// @access  Public
exports.getItemReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      itemId: req.params.itemId,
      type: "user_to_item",
    })
      .populate("reviewerId", "firstName lastName profilePicture")
      .populate("bookingId", "startDate endDate")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      itemId: req.params.itemId,
      type: "user_to_item",
    });

    // Optionally calculate average rating on the fly
    const aggregate = await Review.aggregate([
      {
        $match: {
          itemId: new mongoose.Types.ObjectId(req.params.itemId),
          type: "user_to_item",
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
          totalRatings: { $sum: 1 },
        },
      },
    ]);

    const averageRating = aggregate[0]?.averageRating || 0;
    const totalRatings = aggregate[0]?.totalRatings || 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      averageRating: averageRating.toFixed(1),
      totalRatings,
      reviews,
    });
  } catch (error) {
    console.error("Get item reviews error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching item reviews",
    });
  }
};

// @desc    Get reviews for a specific user (lender)
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      revieweeId: req.params.userId,
      type: "user_to_user",
    })
      .populate("reviewerId", "firstName lastName profilePicture")
      .populate("itemId", "title images")
      .populate("bookingId", "startDate endDate")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Review.countDocuments({
      revieweeId: req.params.userId,
      type: "user_to_user",
    });

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
      error: "Error fetching user reviews",
    });
  }
};
