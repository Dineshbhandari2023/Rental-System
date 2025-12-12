const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  validateRegister,
  validateLogin,
  validateUpdate,
  handleValidationErrors,
} = require("../utils/validators");

// Public routes
router.post(
  "/register",
  validateRegister,
  handleValidationErrors,
  authController.register
);

router.post(
  "/login",
  validateLogin,
  handleValidationErrors,
  authController.login
);

router.post("/forgotpassword", authController.forgotPassword); // send OTP
router.post("/resetpassword", authController.resetPassword); // reset using OTP
router.post("/login-otp", authController.loginWithOTP);

// Protected routes
router.get("/logout", protect, authController.logout);
router.get("/me", protect, authController.getMe);
router.put(
  "/updatedetails",
  protect,
  validateUpdate,
  handleValidationErrors,
  authController.updateDetails
);
router.put("/updatepassword", protect, authController.updatePassword);

module.exports = router;
