import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Admin from "./models/Admin.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seed = async () => {
  try {
    await Admin.deleteMany();

    // 🔐 Different passwords
    const ownerPass = await bcrypt.hash("owner@omnitech123", 10);
    const adminPass = await bcrypt.hash("admin@humrahi123", 10);
    const subAdminPass = await bcrypt.hash("subadmin@humrahi123", 10);

    await Admin.create({
      name: "Owner",
      email: "owner@humrahi.com",
      password: ownerPass,
      role: "Owner" // ⚠️ must match your system
    });

    await Admin.create({
      name: "Administrator",
      email: "administrator@humrahi.com",
      password: adminPass,
      role: "Administrator"
    });

    await Admin.create({
      name: "Admin",
      email: "admin@humrahi.com",
      password: subAdminPass,
      role: "Admin"
    });

    console.log("Admins Created Successfully");

    process.exit();

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seed();