const User = require("../models/user");
const Admin = require("../models/admin");

// // @desc    Create initial admin user (one-time setup)
// // @route   POST /api/admin/setup
// // @access  Public (should be protected in production)
// exports.setupAdmin = async (req, res) => {
//   try {
//     // Check if admin already exists
//     const existingAdmin = await User.findOne({
//       email: process.env.ADMIN_EMAIL,
//     });
//     if (existingAdmin) {
//       return res.status(400).json({
//         success: false,
//         message: "Admin user already exists",
//       });
//     }

//     // Create admin user
//     const adminUser = await User.create({
//       email: process.env.ADMIN_EMAIL,
//       password: process.env.ADMIN_PASSWORD,
//       firstName: "System",
//       lastName: "Administrator",
//       phone: "+1234567890",
//       role: "admin",
//       isVerified: true,
//       address: {
//         street: "Admin Street",
//         city: "Admin City",
//         state: "AS",
//         zipCode: "00000",
//         country: "USA",
//       },
//     });

//     // Create admin record with full permissions
//     await Admin.create({
//       userId: adminUser._id,
//       permissions: [
//         "manage_users",
//         "verify_users",
//         "manage_disputes",
//         "manage_items",
//         "view_reports",
//         "manage_payments",
//         "system_settings",
//       ],
//       isSuperAdmin: true,
//     });

//     // Remove password from response
//     adminUser.password = undefined;

//     res.status(201).json({
//       success: true,
//       message: "Admin user created successfully",
//       user: adminUser,
//     });
//   } catch (error) {
//     console.error("Setup admin error:", error);
//     res.status(500).json({
//       success: false,
//       error: "Error creating admin user",
//     });
//   }
// };

// @desc Create initial admin user (one-time setup)
// @route POST /api/admin/setup
// @access Public (lock in production)
exports.setupAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin user already exists",
      });
    }

    // Create admin user instance (not saved yet)
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      firstName: "System",
      lastName: "Administrator",
      phone: "+1234567890",
      role: "admin",
      isVerified: true,
      address: {
        street: "Admin Street",
        city: "Admin City",
        state: "AS",
        zipCode: "00000",
        country: "USA",
      },
    });

    // 🔥 THIS forces password hashing
    await adminUser.save();

    // Create admin permission record
    const adminInfo = await Admin.create({
      userId: adminUser._id,
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

    adminUser.adminInfo = adminInfo._id;
    await adminUser.save();

    adminUser.password = undefined;

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      user: adminUser,
    });
  } catch (error) {
    console.error("Setup admin error:", error);
    res.status(500).json({
      success: false,
      error: "Error creating admin user",
    });
  }
};

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments();

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching users",
    });
  }
};

// @desc    Get user by ID (admin only)
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "adminInfo",
        select: "permissions lastLogin",
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching user",
    });
  }
};

// @desc    Update user (admin only)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // If role is changed to admin, create admin record
    if (req.body.role === "admin" && user.role !== "admin") {
      const existingAdmin = await Admin.findOne({ userId: user._id });
      if (!existingAdmin) {
        await Admin.create({
          userId: user._id,
          permissions: [
            "manage_users",
            "verify_users",
            "manage_disputes",
            "manage_items",
          ],
          isSuperAdmin: false,
        });
      }
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      success: false,
      error: "Error updating user",
    });
  }
};

// @desc    Delete user (admin only)
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Soft delete (set isActive to false)
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      error: "Error deactivating user",
    });
  }
};

// @desc    Verify user (admin only)
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
exports.verifyUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    user.isVerified = true;
    user.verificationDoc = req.body.verificationDoc || user.verificationDoc;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User verified successfully",
      user: {
        id: user._id,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Verify user error:", error);
    res.status(500).json({
      success: false,
      error: "Error verifying user",
    });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalLenders,
      totalBorrowers,
      verifiedUsers,
      activeUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "lender" }),
      User.countDocuments({ role: "borrower" }),
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isActive: true }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalLenders,
        totalBorrowers,
        verifiedUsers,
        activeUsers,
        verificationRate: ((verifiedUsers / totalUsers) * 100).toFixed(2),
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({
      success: false,
      error: "Error fetching dashboard stats",
    });
  }
};
