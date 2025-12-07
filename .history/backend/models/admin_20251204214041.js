const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    permissions: [
      {
        type: String,
        enum: [
          "manage_users",
          "verify_users",
          "manage_disputes",
          "manage_items",
          "view_reports",
          "manage_payments",
          "system_settings",
        ],
      },
    ],
    lastLogin: {
      type: Date,
      default: null,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);
