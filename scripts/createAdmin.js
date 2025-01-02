import dbConnect from "../lib/dbConnect";
import User from "../src/pages/api/model/User";

const createAdmin = async () => {
  await dbConnect();

  const admin = new User({
    name: "Admin",
    email: "admin@example.com",
    password: "admin123", // In production, hash the password.
    role: "admin",
  });

  try {
    await admin.save();
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Admin user creation failed:", error);
  }
};

createAdmin();
