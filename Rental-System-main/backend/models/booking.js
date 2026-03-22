const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    borrowerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lenderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalDays: {
      type: Number,
      required: true,
      min: 1,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "ongoing",
        "completed",
        "cancelled",
        "disputed",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "refunded",
        "deposit_held",
        "deposit_refunded",
        "failed",
      ],
      default: "pending",
    },
    paymentId: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      unique: true,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
bookingSchema.index({ itemId: 1, status: 1 });
bookingSchema.index({ borrowerId: 1, status: 1 });
bookingSchema.index({ lenderId: 1, status: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 });

// Pre-save hook to generate transaction ID
bookingSchema.pre("save", function () {
  if (!this.transactionId) {
    this.transactionId = `TRX${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
});

// Virtual for isActive booking
bookingSchema.virtual("isActive").get(function () {
  return ["pending", "confirmed", "ongoing"].includes(this.status);
});

module.exports = mongoose.model("Booking", bookingSchema);
