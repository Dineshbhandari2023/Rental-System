const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    revieweeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: function () {
        return this.type === "user_to_user";
      },
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: function () {
        return this.type === "user_to_item";
      },
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      enum: ["user_to_user", "user_to_item"],
      required: true,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one review per booking per type
reviewSchema.index({ bookingId: 1, reviewerId: 1, type: 1 }, { unique: true });

// Index for faster queries
reviewSchema.index({ revieweeId: 1, type: 1 });
reviewSchema.index({ itemId: 1, type: 1 });

module.exports = mongoose.model("Review", reviewSchema);
