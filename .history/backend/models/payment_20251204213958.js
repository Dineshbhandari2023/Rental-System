const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["rental", "deposit", "refund", "payout", "cancellation_fee"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },
    gateway: {
      type: String,
      enum: ["stripe", "paypal", "razorpay", "manual"],
      required: true,
    },
    gatewayTransactionId: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
paymentSchema.index({ userId: 1, createdAt: -1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ gatewayTransactionId: 1 }, { unique: true });
paymentSchema.index({ status: 1, createdAt: 1 });

module.exports = mongoose.model("Payment", paymentSchema);
