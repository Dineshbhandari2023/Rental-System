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

router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:resettoken", authController.resetPassword);

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
