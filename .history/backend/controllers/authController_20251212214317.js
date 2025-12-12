const User = require("../models/user");
const Admin = require("../models/admin");
const { sendTokenResponse } = require("../utils/generateToken");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role, address } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User already exists with this email",
      });
    }

    // Create user
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      phone,
      role: role || "borrower",
      address: address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
    });

    // If user is admin (for initial setup), create admin record
    if (user.role === "admin") {
      await Admin.create({
        userId: user._id,
        permissions: [
          "manage_users",
          "verify_users",
          "manage_disputes",
          "manage_items",
          "view_reports",
          "manage_payments",
          "system_settings",
        ],
        isSuperAdmin: true,
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating user. Please try again.",
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide an email and password",
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        error: "Account is deactivated. Please contact support.",
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    // sendTokenResponse(user, 200, res);
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Error logging in. Please try again.",
    });
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  try {
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      error: "Error logging out",
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
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
    console.error("Get me error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user data",
    });
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res) => {
  try {
    const fieldsToUpdate = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(
      (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update details error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating user details",
    });
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("+password");

    // Check current password
    const isMatch = await user.comparePassword(req.body.currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating password",
    });
  }
};

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({
        success: false,
        error: "No user found with that email",
      });

    // generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otpCode = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP sent to email!",
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Error generating OTP",
    });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired OTP",
      });
    }

    user.password = newPassword;
    user.otpCode = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Error resetting password",
    });
  }
};

exports.loginWithOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({
      email,
      otpCode: otp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(401).json({ success: false, error: "Invalid OTP" });

    user.otpCode = null;
    user.otpExpire = null;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    console.error("OTP login error:", error);
    res.status(500).json({
      success: false,
      error: "Error logging in with OTP",
    });
  }
};
