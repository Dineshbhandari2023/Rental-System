// const multer = require("multer");
// const path = require("path");

// // Storage config
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/profile-images");
//   },
//   filename: function (req, file, cb) {
//     cb(null, `user-${Date.now()}${path.extname(file.originalname)}`);
//   },
// });

// // File filter (images only)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const extname = allowedTypes.test(
//     path.extname(file.originalname).toLowerCase()
//   );
//   const mimetype = allowedTypes.test(file.mimetype);

//   if (extname && mimetype) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only image files are allowed"));
//   }
// };

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 2MB
//   fileFilter,
// });

// module.exports = upload;
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const createUploadDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created upload directory: ${dir}`);
  }
};

createUploadDir("uploads/profile-images");
createUploadDir("uploads/items");

// Dynamic storage based on route
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = "uploads/profile-images"; // default for user profile

    // Detect if request is for item routes
    if (
      req.originalUrl.includes("/items") ||
      req.path.includes("/items") ||
      req.body.isItemUpload // optional flag from frontend if needed
    ) {
      uploadPath = "uploads/items";
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const prefix = req.originalUrl.includes("/items") ? "item" : "user";
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files (JPEG, JPG, PNG, WebP) are allowed!"),
      false
    );
  }
};

// Main multer instance (reusable)
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 5MB limit per file
  },
  fileFilter,
});

module.exports = upload;
