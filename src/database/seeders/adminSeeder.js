const mongoose = require("mongoose");
const config = require("../../config");
const User = require("../../modules/users/users.model");

const ADMIN_USER = {
  name: "Admin",
  email: "admin@digidittos.com",
  password: "Password@123",
  isActive: true,
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(config.mongo.uri);
    console.log("Database connected for seeding...");

    const existingAdmin = await User.findOne({ email: ADMIN_USER.email });

    if (existingAdmin) {
      console.log(`Admin user already exists (${ADMIN_USER.email}). Skipping seed.`);
    } else {
      await User.create(ADMIN_USER);
      console.log(`Admin user created successfully: ${ADMIN_USER.email}`);
    }

    await mongoose.connection.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    try { await mongoose.connection.close(); } catch { /* ignore */ }
    process.exit(1);
  }
};

seedAdmin();
