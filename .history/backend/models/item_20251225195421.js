const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const itemSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "Tools",
        "Electronics",
        "Books",
        "Sports Equipment",
        "Home & Garden",
        "Vehicles",
        "Clothing",
        "Furniture",
        "Real State",
        "Sports Equipments",
        "Party Supplies",
        "Camera and Photography",
        "Other",
      ],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    dailyPrice: {
      type: Number,
      required: [true, "Daily price is required"],
      min: 0,
    },
    depositAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (v) {
            return v.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    addressText: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
      default: "Good",
    },
    availability: [availabilitySchema],
    rules: [
      {
        type: String,
        trim: true,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create 2dsphere index for geospatial queries
itemSchema.index({ location: "2dsphere" });

// Index for faster queries
itemSchema.index({ ownerId: 1, category: 1, isAvailable: 1 });

// Update updatedAt on save
itemSchema.pre("save", function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model("Item", itemSchema);
