const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");

// Apply auth and admin role middleware to all routes
router.use(protect);
router.use(authorize("admin"));

// Admin routes
router.post("/setup", adminController.setupAdmin); // One-time setup
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.put("/users/:id", adminController.updateUser);
router.delete("/users/:id", adminController.deleteUser);
router.put("/users/:id/verify", adminController.verifyUser);
router.get("/stats", adminController.getDashboardStats);

module.exports = router;
