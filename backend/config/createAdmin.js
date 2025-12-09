// config/createAdmin.js
const User = require("../models/user");
const Admin = require("../models/admin");

const createAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log("⚠️ ADMIN_EMAIL or ADMIN_PASSWORD missing in env");
      return;
    }

    // Check if admin user already exists
    let adminUser = await User.findOne({ email: adminEmail });

    if (adminUser) {
      console.log("✔ Admin user already exists");
      return;
    }

    // Create new admin user instance
    adminUser = new User({
      email: adminEmail,
      password: adminPassword,
      firstName: "System",
      lastName: "Admin",
      phone: "+1234567890",
      role: "admin",
      isVerified: true,
    });

    await adminUser.save(); // triggers password hashing

    // Create admin permission document
    const adminInfo = await Admin.create({
      userId: adminUser._id,
      permissions: [
        "manage_users",
        "verify_users",
        "manage_disputes",
        "manage_items",
        "view_reports",
        "manage_payments",
      ],
      isSuperAdmin: true,
    });

    // Attach adminInfo to user
    adminUser.adminInfo = adminInfo._id;
    await adminUser.save();

    console.log("✅ Admin account created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
};

module.exports = createAdmin;
