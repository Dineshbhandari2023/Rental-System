const mongoose = require("mongoose");

const disputeSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reason: {
      type: String,
      required: true,
      enum: [
        "item_damage",
        "item_not_as_described",
        "late_return",
        "no_show",
        "payment_issue",
        "safety_concern",
        "other",
      ],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "closed"],
      default: "open",
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    resolution: {
      type: String,
      default: null,
      trim: true,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
    evidence: [
      {
        type: String, // URLs to evidence files/images
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
disputeSchema.index({ bookingId: 1 }, { unique: true }); // One dispute per booking
disputeSchema.index({ status: 1, createdAt: 1 });
disputeSchema.index({ reportedBy: 1, reportedUser: 1 });

module.exports = mongoose.model("Dispute", disputeSchema);
