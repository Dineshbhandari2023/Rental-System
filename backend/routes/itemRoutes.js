const express = require("express");
const { protect } = require("../middleware/auth");
const { authorize } = require("../middleware/role");
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
} = require("../controllers/itemController");
const upload = require("../middleware/upload");
const router = express.Router();
// Public route for searching items
router.get("/", getItems);
// Public route for getting single item
router.get("/:id", getItemById);
// Protected routes for lenders
router.post(
  "/",
  protect,
  authorize("lender"),
  upload.array("images", 5),
  createItem
);
router.put(
  "/:id",
  protect,
  authorize("lender"),
  upload.array("images", 5),
  updateItem
);
router.delete("/:id", protect, authorize("lender"), deleteItem);
module.exports = router;
